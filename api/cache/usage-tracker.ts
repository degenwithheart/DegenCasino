// Real-time usage tracking system for DegenCasino APIs
// Using simple in-memory storage with periodic cache sync

export interface UsageRecord {
  timestamp: number
  endpoint: string
  method: string
  category: 'rpc' | 'helius' | 'price' | 'chat' | 'cache' | 'dns' | 'audit'
  success: boolean
  responseTime?: number
}

// In-memory counters (will reset on server restart, but better than nothing)
let hourlyCounters: Record<string, number> = {}
let dailyCounters: Record<string, number> = {}
let endpointCounters: Record<string, number> = {}

export class UsageTracker {
  
  // Track a single API call
  static async track(record: UsageRecord): Promise<void> {
    try {
      const now = Date.now()
      const hourKey = Math.floor(now / (60 * 60 * 1000)) // Current hour
      const dayKey = Math.floor(now / (24 * 60 * 60 * 1000)) // Current day
      
      // Increment in-memory counters
      this.incrementInMemory(`hour:${hourKey}:${record.category}`)
      this.incrementInMemory(`hour:${hourKey}:total`)
      this.incrementInMemory(`day:${dayKey}:${record.category}`)
      this.incrementInMemory(`day:${dayKey}:total`)
      this.incrementInMemory(`endpoint:${record.endpoint}`)
      
      // Track errors separately
      if (!record.success) {
        this.incrementInMemory(`errors:hour:${hourKey}:${record.category}`)
      }
      
      console.log(`📊 Tracked: ${record.category} call to ${record.endpoint}`)
      
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
      usage[category] = hourlyCounters[`hour:${hourKey}:${category}`] || 0
    }
    
    return usage
  }
  
  // Get current day usage
  static async getCurrentDayUsage(): Promise<Record<string, number>> {
    const dayKey = Math.floor(Date.now() / (24 * 60 * 60 * 1000))
    
    const categories = ['rpc', 'helius', 'price', 'chat', 'cache', 'dns', 'audit', 'total']
    const usage: Record<string, number> = {}
    
    for (const category of categories) {
      usage[category] = dailyCounters[`day:${dayKey}:${category}`] || 0
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
      usage[endpoint] = endpointCounters[`endpoint:${endpoint}`] || 0
    }
    
    return usage
  }
  
  // Helper to increment in-memory counter
  private static incrementInMemory(key: string): void {
    if (key.includes('hour:')) {
      hourlyCounters[key] = (hourlyCounters[key] || 0) + 1
    } else if (key.includes('day:')) {
      dailyCounters[key] = (dailyCounters[key] || 0) + 1
    } else if (key.includes('endpoint:')) {
      endpointCounters[key] = (endpointCounters[key] || 0) + 1
    }
  }
  
  // Get all current stats (for debugging)
  static getDebugStats(): any {
    return {
      hourlyCounters,
      dailyCounters,
      endpointCounters,
      totalTrackedCalls: Object.values(endpointCounters).reduce((a, b) => a + b, 0)
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
