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
  
  // Enhanced prefetch configurations with game-specific optimizations
  private readonly prefetchConfigs: PrefetchConfig[] = [
    // Critical blockchain state (highest priority)
    {
      method: 'getLatestBlockhash',
      params: [],
      frequency: 15, // Every 15 seconds (faster for gaming)
      enabled: rateLimitConfig.prefetchSettings.enabled
    },
    {
      method: 'getSlot', 
      params: [],
      frequency: 30, // Every 30 seconds (faster refresh)
      enabled: rateLimitConfig.prefetchSettings.enabled
    },
    {
      method: 'getBlockHeight',
      params: [],
      frequency: 30, // Every 30 seconds (faster refresh)
      enabled: rateLimitConfig.prefetchSettings.enabled
    },
    
    // Network health and performance
    {
      method: 'getHealth',
      params: [],
      frequency: 120, // Every 2 minutes (more frequent for gaming)
      enabled: rateLimitConfig.prefetchSettings.enabled
    },
    {
      method: 'getEpochInfo',
      params: [],
      frequency: 300, // Every 5 minutes
      enabled: rateLimitConfig.prefetchSettings.enabled
    },
    
    // Game-specific prefetching (when gameTransactionPrefetch is enabled)
    {
      method: 'getAccountInfo',
      params: ['6o1iE4cKQcjW4UFd4vn35r43qD9LjNDhPGNUMBuS8ocZ'], // GAMBA program
      frequency: 60, // Every minute
      enabled: rateLimitConfig.prefetchSettings.gameTransactionPrefetch
    },
    {
      method: 'getProgramAccounts',
      params: ['6o1iE4cKQcjW4UFd4vn35r43qD9LjNDhPGNUMBuS8ocZ'], // GAMBA program accounts
      frequency: 120, // Every 2 minutes
      enabled: rateLimitConfig.prefetchSettings.gameTransactionPrefetch
    },
    
    // User pattern-based prefetching (when userPatternPrefetch is enabled)
    {
      method: 'getBalance',
      params: [], // Will be populated with user's public key when available
      frequency: 45, // Every 45 seconds
      enabled: rateLimitConfig.prefetchSettings.userPatternPrefetch
    }
  ]
  
  // Dynamic prefetch configurations that adapt to user behavior
  private dynamicPrefetchConfigs: PrefetchConfig[] = []

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
        return process.env.RPC_ENDPOINT || process.env.RPC_ENDPOINT || 
               'https://solana-mainnet.api.syndica.io/api-key/4jiiRsRb2BL8pD6S8H3kNNr8U7YYuyBkfuce3f1ngmnYCKS5KSXwvRx53p256RNQZydrDWt1TdXxVbRrmiJrdk3RdD58qtYSna1'
      case 'helius':
        return process.env.HELIUS_API_KEY || process.env.HELIUS_API_KEY ||
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
   * Add dynamic user-specific prefetch configuration
   */
  addUserPrefetchConfig(walletAddress: string): void {
    if (!rateLimitConfig.prefetchSettings.userPatternPrefetch) return

    // Add balance checking for the specific user
    const balanceConfig: PrefetchConfig = {
      method: 'getBalance',
      params: [walletAddress],
      frequency: 45, // Every 45 seconds
      enabled: true
    }

    // Add account info for user's wallet
    const accountConfig: PrefetchConfig = {
      method: 'getAccountInfo',
      params: [walletAddress],
      frequency: 90, // Every 90 seconds
      enabled: true
    }

    this.dynamicPrefetchConfigs.push(balanceConfig, accountConfig)
    
    // Start prefetching for these new configs
    this.startDynamicPrefetching([balanceConfig, accountConfig])
    console.log(`[SmartCache] Added user-specific prefetch for ${walletAddress}`)
  }

  /**
   * Remove user-specific prefetch configuration
   */
  removeUserPrefetchConfig(walletAddress: string): void {
    // Remove from dynamic configs
    this.dynamicPrefetchConfigs = this.dynamicPrefetchConfigs.filter(
      config => !config.params.includes(walletAddress)
    )

    // Clear associated timers
    const keysToRemove = Array.from(this.prefetchTimers.keys()).filter(
      key => key.includes(walletAddress)
    )
    
    keysToRemove.forEach(key => {
      const timer = this.prefetchTimers.get(key)
      if (timer) {
        clearInterval(timer)
        this.prefetchTimers.delete(key)
      }
    })

    console.log(`[SmartCache] Removed user-specific prefetch for ${walletAddress}`)
  }

  /**
   * Add game-specific prefetch patterns
   */
  addGamePrefetchPattern(gameId: string, gameAddress?: string): void {
    if (!rateLimitConfig.prefetchSettings.gameTransactionPrefetch) return

    if (gameAddress) {
      const gameAccountConfig: PrefetchConfig = {
        method: 'getAccountInfo',
        params: [gameAddress],
        frequency: 30, // Every 30 seconds for active games
        enabled: true
      }

      this.dynamicPrefetchConfigs.push(gameAccountConfig)
      this.startDynamicPrefetching([gameAccountConfig])
      console.log(`[SmartCache] Added game-specific prefetch for ${gameId}`)
    }
  }

  /**
   * Start prefetching for dynamic configurations
   */
  private startDynamicPrefetching(configs: PrefetchConfig[]): void {
    for (const config of configs) {
      const key = `${config.method}:${JSON.stringify(config.params)}`
      
      if (this.prefetchTimers.has(key)) {
        continue // Already running
      }

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
   * Intelligent prefetch based on current activity
   */
  async intelligentPrefetch(context: {
    userWallet?: string
    currentGame?: string
    recentGames?: string[]
    userActivity?: 'high' | 'medium' | 'low'
  }): Promise<void> {
    if (!rateLimitConfig.prefetchSettings.intelligentPrefetch) return

    const { userWallet, currentGame, recentGames = [], userActivity = 'medium' } = context

    try {
      // User-specific prefetching
      if (userWallet) {
        this.addUserPrefetchConfig(userWallet)
      }

      // Game-specific prefetching based on activity level
      if (currentGame) {
        this.addGamePrefetchPattern(currentGame)
      }

      // Prefetch recent games data if user is highly active
      if (userActivity === 'high' && recentGames.length > 0) {
        for (const gameId of recentGames.slice(0, 3)) { // Top 3 recent games
          this.addGamePrefetchPattern(gameId)
        }
      }

      // Adjust prefetch frequency based on activity
      const frequencyMultiplier = userActivity === 'high' ? 0.7 : userActivity === 'low' ? 1.5 : 1.0
      this.adjustPrefetchFrequency(frequencyMultiplier)

      console.log(`[SmartCache] Intelligent prefetch configured for ${userActivity} activity user`)
    } catch (error) {
      console.error('[SmartCache] Intelligent prefetch failed:', error)
    }
  }

  /**
   * Adjust prefetch frequencies based on user activity
   */
  private adjustPrefetchFrequency(multiplier: number): void {
    // This would adjust the frequency of existing prefetch configs
    // For now, we'll adjust future prefetch intervals
    console.log(`[SmartCache] Adjusting prefetch frequency by ${multiplier}x`)
  }

  /**
   * Stop all prefetching
   */
  stopPrefetching(): void {
    this.prefetchTimers.forEach(timer => {
      clearInterval(timer)
    })
    this.prefetchTimers.clear()
    this.dynamicPrefetchConfigs = []
  }
}

// Singleton instance
const smartCache = new SmartCache()

export { smartCache }
export type { PrefetchConfig }
export default smartCache
