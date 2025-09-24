// Enhanced rate limiter for Syndica and Helius endpoints
// Implements sliding window rate limiting with request queuing and caching

import { rateLimitConfig, getProviderConfig } from './config'

interface RateLimitResult {
  allowed: boolean
  retryAfter?: number // seconds to wait
  queuePosition?: number
  currentRps: number
  monthlyUsage: number
  limitInfo: {
    rpsRemaining: number
    monthlyRemaining: number
    resetTime: number
  }
}

interface RequestRecord {
  timestamp: number
  endpoint: string
  provider: string
}

class RateLimiter {
  private requests: Map<string, RequestRecord[]> = new Map()
  private monthlyCounters: Map<string, number> = new Map()
  private lastReset: Map<string, number> = new Map()
  private requestQueue: Map<string, Array<() => void>> = new Map()

  constructor() {
    // Clean up old records every minute
    setInterval(() => this.cleanup(), 60_000)
    // Reset monthly counters on the 1st of each month
    setInterval(() => this.resetMonthlyCounters(), 24 * 60 * 60 * 1000)
  }

  async checkLimit(provider: string, endpoint: string): Promise<RateLimitResult> {
    const config = getProviderConfig(provider)
    if (!config || !config.enabled) {
      throw new Error(`Unknown or disabled provider: ${provider}`)
    }

    const key = `${provider}:${endpoint}`
    const now = Date.now()
    
    // Initialize if needed
    if (!this.requests.has(key)) {
      this.requests.set(key, [])
    }
    if (!this.monthlyCounters.has(provider)) {
      this.monthlyCounters.set(provider, 0)
      this.lastReset.set(provider, now)
    }

    // Check monthly limit first
    const monthlyUsage = this.monthlyCounters.get(provider) || 0
    if (monthlyUsage >= config.monthlyLimit) {
      return {
        allowed: false,
        currentRps: 0,
        monthlyUsage,
        limitInfo: {
          rpsRemaining: 0,
          monthlyRemaining: 0,
          resetTime: this.getNextMonthReset()
        }
      }
    }

    // Get recent requests (last 60 seconds for RPS calculation)
    const recentRequests = this.getRecentRequests(key, 60)
    const currentRps = recentRequests.length / 60

    // Check RPS limit - STRICT enforcement, no burst allowed
    const lastSecondRequests = this.getRecentRequests(key, 1)
    
    if (lastSecondRequests.length >= config.rpsLimit) {
      // Rate limited - calculate retry after
      const retryAfter = Math.ceil(1 - (now - lastSecondRequests[0].timestamp) / 1000)
      
      return {
        allowed: false,
        retryAfter: Math.max(retryAfter, 1),
        currentRps: currentRps,
        monthlyUsage,
        limitInfo: {
          rpsRemaining: Math.max(0, config.rpsLimit - currentRps),
          monthlyRemaining: config.monthlyLimit - monthlyUsage,
          resetTime: this.getNextMonthReset()
        }
      }
    }

    // Request allowed - record it
    this.recordRequest(key, provider, endpoint)

    return {
      allowed: true,
      currentRps: currentRps,
      monthlyUsage: monthlyUsage + 1,
      limitInfo: {
        rpsRemaining: config.rpsLimit - currentRps - 1,
        monthlyRemaining: config.monthlyLimit - monthlyUsage - 1,
        resetTime: this.getNextMonthReset()
      }
    }
  }

  private recordRequest(key: string, provider: string, endpoint: string): void {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    
    requests.push({
      timestamp: now,
      endpoint,
      provider
    })
    
    this.requests.set(key, requests)
    
    // Increment monthly counter
    const monthlyCount = this.monthlyCounters.get(provider) || 0
    this.monthlyCounters.set(provider, monthlyCount + 1)
  }

  private getRecentRequests(key: string, seconds: number): RequestRecord[] {
    const now = Date.now()
    const cutoff = now - (seconds * 1000)
    const requests = this.requests.get(key) || []
    
    return requests.filter(req => req.timestamp > cutoff)
  }

  private cleanup(): void {
    const now = Date.now()
    const cutoff = now - (5 * 60 * 1000) // Keep 5 minutes of history
    
    for (const [key, requests] of Array.from(this.requests.entries())) {
      const filtered = requests.filter(req => req.timestamp > cutoff)
      if (filtered.length === 0) {
        this.requests.delete(key)
      } else {
        this.requests.set(key, filtered)
      }
    }
  }

  private resetMonthlyCounters(): void {
    const now = Date.now()
    const currentMonth = new Date(now).getMonth()
    
    for (const [provider, lastReset] of Array.from(this.lastReset.entries())) {
      const lastResetMonth = new Date(lastReset).getMonth()
      
      if (currentMonth !== lastResetMonth) {
        this.monthlyCounters.set(provider, 0)
        this.lastReset.set(provider, now)
      }
    }
  }

  private getNextMonthReset(): number {
    const now = new Date()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return nextMonth.getTime()
  }

  // Get current status for monitoring
  getStatus(provider: string): {
    currentRps: number
    monthlyUsage: number
    limits: import('./config').ProviderConfig
    status: 'healthy' | 'warning' | 'critical'
  } {
    const config = getProviderConfig(provider)
    if (!config) {
      throw new Error(`Unknown provider: ${provider}`)
    }

    const key = `${provider}:*`
    const recentRequests = this.getRecentRequests(key, 60)
    const currentRps = recentRequests.length / 60
    const monthlyUsage = this.monthlyCounters.get(provider) || 0
    
    const rpsUtilization = (currentRps / config.rpsLimit) * 100
    const monthlyUtilization = (monthlyUsage / config.monthlyLimit) * 100
    
    const status = (rpsUtilization > 80 || monthlyUtilization > 80) ? 'critical' :
                   (rpsUtilization > 60 || monthlyUtilization > 60) ? 'warning' : 'healthy'

    return {
      currentRps,
      monthlyUsage, 
      limits: config,
      status
    }
  }

  // Queue requests when rate limited
  async queueRequest<T>(
    provider: string, 
    endpoint: string, 
    requestFn: () => Promise<T>
  ): Promise<T> {
    const limitResult = await this.checkLimit(provider, endpoint)
    
    if (limitResult.allowed) {
      return await requestFn()
    }
    
    // Request is rate limited - queue it
    return new Promise((resolve, reject) => {
      const queueKey = `${provider}:queue`
      const queue = this.requestQueue.get(queueKey) || []
      
      queue.push(async () => {
        try {
          const result = await requestFn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      
      this.requestQueue.set(queueKey, queue)
      
      // Process queue after retry delay
      setTimeout(() => {
        this.processQueue(queueKey)
      }, (limitResult.retryAfter || 1) * 1000)
    })
  }

  private async processQueue(queueKey: string): Promise<void> {
    const queue = this.requestQueue.get(queueKey) || []
    if (queue.length === 0) return
    
    const nextRequest = queue.shift()
    if (nextRequest) {
      this.requestQueue.set(queueKey, queue)
      await nextRequest()
    }
  }
}

// Singleton instance
const rateLimiter = new RateLimiter()

export { rateLimiter }
export type { RateLimitResult }
export default rateLimiter
