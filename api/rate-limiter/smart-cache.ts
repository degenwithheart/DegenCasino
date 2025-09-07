// Smart caching and prefetching system for RPC calls
// Reduces actual requests to Syndica/Helius by caching frequently used data

import { cacheOnTheFly, CacheTTL } from '../cache/xcacheOnTheFly'
import rateLimiter from './rate-limiter'
import { rateLimitConfig, getCacheStrategy } from './config'

interface PrefetchConfig {
  method: string
  params: any[]
  frequency: number // seconds between prefetch
  enabled: boolean
}

class SmartCache {
  private prefetchTimers: Map<string, NodeJS.Timeout> = new Map()
  
  // High-value requests to prefetch proactively (loaded from config)
  private readonly prefetchConfigs: PrefetchConfig[] = [
    {
      method: 'getLatestBlockhash',
      params: [],
      frequency: 30, // Every 30 seconds
      enabled: rateLimitConfig.prefetchSettings.enabled
    },
    {
      method: 'getSlot', 
      params: [],
      frequency: 60, // Every minute
      enabled: rateLimitConfig.prefetchSettings.enabled
    },
    {
      method: 'getBlockHeight',
      params: [],
      frequency: 60, // Every minute  
      enabled: rateLimitConfig.prefetchSettings.enabled
    },
    {
      method: 'getHealth',
      params: [],
      frequency: 300, // Every 5 minutes
      enabled: rateLimitConfig.prefetchSettings.enabled
    },
    {
      method: 'getEpochInfo',
      params: [],
      frequency: 300, // Every 5 minutes
      enabled: rateLimitConfig.prefetchSettings.enabled
    }
  ]

  constructor() {
    if (rateLimitConfig.prefetchSettings.enabled) {
      this.startPrefetching()
    }
  }

  /**
   * Smart RPC call with caching, rate limiting, and fallback strategies
   */
  async smartRpcCall(
    provider: 'syndica' | 'helius',
    method: string,
    params: any[] = [],
    options: {
      skipCache?: boolean
      forceFresh?: boolean
      allowStale?: boolean
      endpoint?: string
    } = {}
  ): Promise<any> {
    const { skipCache = false, forceFresh = false, allowStale = true, endpoint = 'default' } = options
    
    // Generate cache key
    const cacheKey = this.generateCacheKey(provider, method, params)
    const strategy = getCacheStrategy(method)
    
    // Skip cache if requested or disabled
    if (skipCache || !strategy.enabled || method === 'sendTransaction') {
      return this.executeRpcCall(provider, method, params, endpoint)
    }

    // Force fresh data if requested
    if (forceFresh) {
      const result = await this.executeRpcCall(provider, method, params, endpoint)
      return result
    }

    // Try cache first
    try {
      const cachedResult = await cacheOnTheFly(
        cacheKey,
        async () => {
          return this.executeRpcCall(provider, method, params, endpoint)
        },
        { 
          ttl: strategy.ttl,
          skipCache: false,
          forceRefresh: false
        }
      )
      
      return cachedResult
    } catch (error) {
      console.error(`SmartCache error for ${method}:`, error)
      
      // Try to serve stale data if allowed and available
      if (allowStale && strategy.maxAge) {
        const staleData = await this.getStaleData(cacheKey, strategy.maxAge)
        if (staleData) {
          console.log(`Serving stale data for ${method}`)
          return staleData
        }
      }
      
      throw error
    }
  }

  /**
   * Execute actual RPC call with rate limiting
   */
  private async executeRpcCall(
    provider: 'syndica' | 'helius',
    method: string,
    params: any[],
    endpoint: string
  ): Promise<any> {
    // Check rate limits first
    const limitResult = await rateLimiter.checkLimit(provider, endpoint)
    
    if (!limitResult.allowed) {
      // Queue the request if rate limited
      return rateLimiter.queueRequest(provider, endpoint, async () => {
        return this.makeRpcRequest(provider, method, params)
      })
    }
    
    return this.makeRpcRequest(provider, method, params)
  }

  /**
   * Make the actual HTTP request to RPC endpoint
   */
  private async makeRpcRequest(
    provider: 'syndica' | 'helius',
    method: string,
    params: any[]
  ): Promise<any> {
    const rpcUrl = this.getRpcUrl(provider)
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params
      })
    })
    
    if (!response.ok) {
      throw new Error(`RPC request failed: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()
    
    if (result.error) {
      throw new Error(`RPC error: ${result.error.message}`)
    }
    
    return result.result
  }

  /**
   * Start prefetching high-value data
   */
  private startPrefetching(): void {
    for (const config of this.prefetchConfigs) {
      if (!config.enabled) continue
      
      const key = `${config.method}:${JSON.stringify(config.params)}`
      
      // Start immediate prefetch
      this.prefetchData(config)
      
      // Schedule recurring prefetch
      const timer = setInterval(() => {
        this.prefetchData(config)
      }, config.frequency * 1000)
      
      this.prefetchTimers.set(key, timer)
    }
  }

  /**
   * Prefetch specific data in the background
   */
  private async prefetchData(config: PrefetchConfig): Promise<void> {
    try {
      console.log(`[SmartCache] Prefetching ${config.method}`)
      
      // Use Syndica for prefetch (primary endpoint)
      await this.smartRpcCall('syndica', config.method, config.params, {
        endpoint: 'prefetch'
      })
      
      console.log(`[SmartCache] Prefetched ${config.method} successfully`)
    } catch (error) {
      console.error(`[SmartCache] Prefetch failed for ${config.method}:`, error)
    }
  }

  /**
   * Get stale data from cache if available
   */
  private async getStaleData(cacheKey: string, maxAge: number): Promise<any | null> {
    // This would need to be implemented with cache metadata
    // For now, return null - stale serving requires cache timestamp tracking
    return null
  }

  /**
   * Generate cache key for RPC call
   */
  private generateCacheKey(provider: string, method: string, params: any[]): string {
    const paramsHash = JSON.stringify(params)
    return `rpc:${provider}:${method}:${paramsHash}`
  }

  /**
   * Get RPC URL for provider
   */
  private getRpcUrl(provider: 'syndica' | 'helius'): string {
    switch (provider) {
      case 'syndica':
        return process.env.VITE_RPC_ENDPOINT || process.env.RPC_ENDPOINT || 
               'https://solana-mainnet.api.syndica.io/api-key/4jiiRsRb2BL8pD6S8H3kNNr8U7YYuyBkfuce3f1ngmnYCKS5KSXwvRx53p256RNQZydrDWt1TdXxVbRrmiJrdk3RdD58qtYSna1'
      case 'helius':
        return process.env.VITE_HELIUS_API_KEY || process.env.HELIUS_API_KEY ||
               'https://mainnet.helius-rpc.com/?api-key=3bda9312-99fc-4ff4-9561-958d62a4a22c'
      default:
        throw new Error(`Unknown provider: ${provider}`)
    }
  }

  /**
   * Update cache strategy for a method
   */
  updateStrategy(method: string, strategy: Partial<import('./config').CacheConfig>): void {
    // This would update the runtime configuration
    console.log(`Updating strategy for ${method}:`, strategy)
    // Implementation would modify rateLimitConfig.cachingStrategies[method]
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    strategies: Record<string, import('./config').CacheConfig>
    activePrefetches: string[]
    rateLimiterStatus: any
  } {
    return {
      strategies: rateLimitConfig.cachingStrategies,
      activePrefetches: Array.from(this.prefetchTimers.keys()),
      rateLimiterStatus: {
        syndica: rateLimiter.getStatus('syndica'),
        helius: rateLimiter.getStatus('helius')
      }
    }
  }

  /**
   * Stop all prefetching
   */
  stopPrefetching(): void {
    for (const timer of this.prefetchTimers.values()) {
      clearInterval(timer)
    }
    this.prefetchTimers.clear()
  }
}

// Singleton instance
const smartCache = new SmartCache()

export { smartCache, PrefetchConfig }
export default smartCache
