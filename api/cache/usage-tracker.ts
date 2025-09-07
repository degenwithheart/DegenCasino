// Real-time usage tracking system for DegenCasino APIs
import { cacheOnTheFly, CacheTTL } from './xcacheOnTheFly'

export interface UsageRecord {
  timestamp: number
  endpoint: string
  method: string
  category: 'rpc' | 'helius' | 'price' | 'chat' | 'cache' | 'dns' | 'audit'
  success: boolean
  responseTime?: number
}

export class UsageTracker {
  
  // Track a single API call
  static async track(record: UsageRecord): Promise<void> {
    try {
      const now = Date.now()
      const hourKey = Math.floor(now / (60 * 60 * 1000)) // Current hour
      const dayKey = Math.floor(now / (24 * 60 * 60 * 1000)) // Current day
      
      // Store in cache with multiple time buckets for aggregation
      await Promise.all([
        this.incrementCounter(`usage:hour:${hourKey}:${record.category}`, 1),
        this.incrementCounter(`usage:hour:${hourKey}:total`, 1),
        this.incrementCounter(`usage:day:${dayKey}:${record.category}`, 1),
        this.incrementCounter(`usage:day:${dayKey}:total`, 1),
        this.incrementCounter(`usage:endpoint:${record.endpoint}`, 1),
        
        // Track errors separately
        record.success ? null : this.incrementCounter(`errors:hour:${hourKey}:${record.category}`, 1),
        
        // Track response times if provided
        record.responseTime ? this.trackResponseTime(record.category, record.responseTime) : null
      ])
      
    } catch (error) {
      console.error('Usage tracking failed:', error)
      // Don't throw - tracking failure shouldn't break the API
    }
  }
  
  // Get current hour usage
  static async getCurrentHourUsage(): Promise<Record<string, number>> {
    const hourKey = Math.floor(Date.now() / (60 * 60 * 1000))
    
    const categories = ['rpc', 'helius', 'price', 'chat', 'cache', 'dns', 'audit', 'total']
    const usage: Record<string, number> = {}
    
    for (const category of categories) {
      usage[category] = await this.getCounter(`usage:hour:${hourKey}:${category}`) || 0
    }
    
    return usage
  }
  
  // Get current day usage
  static async getCurrentDayUsage(): Promise<Record<string, number>> {
    const dayKey = Math.floor(Date.now() / (24 * 60 * 60 * 1000))
    
    const categories = ['rpc', 'helius', 'price', 'chat', 'cache', 'dns', 'audit', 'total']
    const usage: Record<string, number> = {}
    
    for (const category of categories) {
      usage[category] = await this.getCounter(`usage:day:${dayKey}:${category}`) || 0
    }
    
    return usage
  }
  
  // Get RPC endpoint breakdown
  static async getRpcEndpointUsage(): Promise<Record<string, number>> {
    const endpoints = [
      'syndica-primary',
      'syndica-balance', 
      'helius-backup',
      'ankr-last-resort',
      'solana-labs-last-resort'
    ]
    
    const usage: Record<string, number> = {}
    for (const endpoint of endpoints) {
      usage[endpoint] = await this.getCounter(`usage:endpoint:${endpoint}`) || 0
    }
    
    return usage
  }
  
  // Helper to increment counter in cache
  private static async incrementCounter(key: string, value: number): Promise<void> {
    try {
      const current = await this.getCounter(key) || 0
      await cacheOnTheFly(key, async () => current + value, { ttl: CacheTTL.HOUR })
    } catch (error) {
      console.error(`Failed to increment counter ${key}:`, error)
    }
  }
  
  // Helper to get counter from cache
  private static async getCounter(key: string): Promise<number> {
    try {
      return await cacheOnTheFly(key, async () => 0, { ttl: CacheTTL.HOUR })
    } catch (error) {
      console.error(`Failed to get counter ${key}:`, error)
      return 0
    }
  }
  
  // Track response times
  private static async trackResponseTime(category: string, responseTime: number): Promise<void> {
    const timeKey = `response_time:${category}`
    try {
      // Store last 100 response times for averaging
      const times = await cacheOnTheFly(`${timeKey}:times`, async () => [], { ttl: CacheTTL.HOUR }) as number[]
      times.push(responseTime)
      if (times.length > 100) times.shift() // Keep only last 100
      
      await cacheOnTheFly(`${timeKey}:times`, async () => times, { ttl: CacheTTL.HOUR })
      await cacheOnTheFly(`${timeKey}:avg`, async () => {
        return times.reduce((a, b) => a + b, 0) / times.length
      }, { ttl: CacheTTL.HOUR })
    } catch (error) {
      console.error(`Failed to track response time for ${category}:`, error)
    }
  }
}

// Middleware wrapper to automatically track API calls
export function withUsageTracking(
  handler: (req: Request) => Promise<Response>,
  endpoint: string,
  category: UsageRecord['category']
) {
  return async (req: Request): Promise<Response> => {
    const startTime = Date.now()
    let success = false
    
    try {
      const response = await handler(req)
      success = response.status < 400
      
      // Track the call
      await UsageTracker.track({
        timestamp: Date.now(),
        endpoint,
        method: req.method,
        category,
        success,
        responseTime: Date.now() - startTime
      })
      
      return response
    } catch (error) {
      // Track failed call
      await UsageTracker.track({
        timestamp: Date.now(),
        endpoint,
        method: req.method,
        category,
        success: false,
        responseTime: Date.now() - startTime
      })
      
      throw error
    }
  }
}
