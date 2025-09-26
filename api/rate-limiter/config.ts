// Rate limiting and caching configuration
// Centralized configuration for all rate limiting and caching parameters

export interface ProviderConfig {
  rpsLimit: number
  monthlyLimit: number
  provider: 'syndica' | 'helius' | 'public'
  enabled: boolean
  fallbackProvider?: string
}

export interface CacheConfig {
  ttl: number
  maxAge?: number
  prefetch?: boolean
  priority: 'high' | 'medium' | 'low'
  enabled: boolean
}

export interface RateLimitConfig {
  providers: Record<string, ProviderConfig>
  cachingStrategies: Record<string, CacheConfig>
  prefetchSettings: {
    enabled: boolean
    maxConcurrentPrefetches: number
    prefetchInterval: number
    intelligentPrefetch: boolean
    gameTransactionPrefetch: boolean
    userPatternPrefetch: boolean
  }
  monitoring: {
    alertThresholds: {
      rpsWarning: number
      rpsCritical: number
      monthlyWarning: number
      monthlyCritical: number
    }
    dashboardRefreshInterval: number
  }
}

// Main configuration object
export const rateLimitConfig: RateLimitConfig = {
  providers: {
    syndica: {
      rpsLimit: 100,           // Syndica Standard Plan: 100 RPS (STRICT)
      monthlyLimit: 10_000_000, // 10M requests/month
      provider: 'syndica',
      enabled: true,
      fallbackProvider: 'helius'
    },
    helius: {
      rpsLimit: 10,            // Helius Free Plan: 10 RPS (STRICT)
      monthlyLimit: 1_000_000, // 1M credits/month
      provider: 'helius',
      enabled: true,
      fallbackProvider: 'ankr'
    },
    ankr: {
      rpsLimit: 5,             // Conservative limit for public RPC
      monthlyLimit: 100_000,   // Conservative monthly limit
      provider: 'public',
      enabled: true
    },
    solana: {
      rpsLimit: 2,             // Very conservative for official RPC
      monthlyLimit: 50_000,    // Very conservative monthly limit
      provider: 'public',
      enabled: true
    }
  },

  cachingStrategies: {
    // High-frequency blockchain state (changes every ~400ms)
    getSlot: {
      ttl: 60_000,        // 1 minute
      prefetch: true,
      priority: 'high',
      enabled: true
    },
    getBlockHeight: {
      ttl: 60_000,        // 1 minute
      prefetch: true,
      priority: 'high',
      enabled: true
    },
    getLatestBlockhash: {
      ttl: 30_000,        // 30 seconds (critical for transactions)
      maxAge: 300_000,    // Serve stale up to 5 minutes if needed
      prefetch: true,
      priority: 'high',
      enabled: true
    },

    // Network health and info (changes rarely)
    getHealth: {
      ttl: 300_000,       // 5 minutes
      prefetch: true,
      priority: 'medium',
      enabled: true
    },
    getVersion: {
      ttl: 1_800_000,     // 30 minutes
      priority: 'low',
      enabled: true
    },
    getEpochInfo: {
      ttl: 300_000,       // 5 minutes
      prefetch: true,
      priority: 'medium',
      enabled: true
    },

    // Account and balance data
    getBalance: {
      ttl: 60_000,        // 1 minute
      maxAge: 600_000,    // Serve stale up to 10 minutes for non-critical accounts
      priority: 'medium',
      enabled: true
    },
    getAccountInfo: {
      ttl: 60_000,        // 1 minute
      maxAge: 600_000,    // Serve stale up to 10 minutes
      priority: 'medium',
      enabled: true
    },
    getTokenAccountsByOwner: {
      ttl: 300_000,       // 5 minutes
      priority: 'medium',
      enabled: true
    },

    // Transaction data (immutable once confirmed)
    getTransaction: {
      ttl: 3_600_000,     // 1 hour (transactions don't change)
      priority: 'low',
      enabled: true
    },
    getSignatureStatuses: {
      ttl: 300_000,       // 5 minutes
      priority: 'medium',
      enabled: true
    },
    getConfirmedSignaturesForAddress2: {
      ttl: 600_000,       // 10 minutes
      priority: 'medium',
      enabled: true
    },

    // Gaming-specific
    simulateTransaction: {
      ttl: 10_000,        // 10 seconds (simulation results can be cached briefly)
      priority: 'high',
      enabled: true
    },
    sendTransaction: {
      ttl: 0,             // Never cache actual transaction sends
      priority: 'high',
      enabled: false
    },

    // Program accounts and market data
    getProgramAccounts: {
      ttl: 300_000,       // 5 minutes
      priority: 'medium',
      enabled: true
    },

    // Performance and stats
    getRecentPerformanceSamples: {
      ttl: 600_000,       // 10 minutes
      priority: 'low',
      enabled: true
    },

    // Default for unknown methods
    default: {
      ttl: 60_000,        // 1 minute default
      priority: 'medium',
      enabled: true
    }
  },

  prefetchSettings: {
    enabled: true,
    maxConcurrentPrefetches: 5,
    prefetchInterval: 30_000,  // 30 seconds between prefetch cycles
    intelligentPrefetch: true,  // Enable AI-driven prefetching
    gameTransactionPrefetch: true,  // Prefetch game-related RPC calls
    userPatternPrefetch: true  // Prefetch based on user behavior patterns
  },

  monitoring: {
    alertThresholds: {
      rpsWarning: 70,      // Alert when RPS usage > 70%
      rpsCritical: 85,     // Critical alert when RPS usage > 85%
      monthlyWarning: 70,  // Alert when monthly usage > 70%
      monthlyCritical: 85  // Critical alert when monthly usage > 85%
    },
    dashboardRefreshInterval: 30_000  // 30 seconds
  }
}

// Helper functions for configuration management
export function getProviderConfig(provider: string): ProviderConfig | null {
  return rateLimitConfig.providers[provider] || null
}

export function getCacheStrategy(method: string): CacheConfig {
  return rateLimitConfig.cachingStrategies[method] || rateLimitConfig.cachingStrategies.default
}

export function updateProviderConfig(provider: string, config: Partial<ProviderConfig>): void {
  if (rateLimitConfig.providers[provider]) {
    rateLimitConfig.providers[provider] = { ...rateLimitConfig.providers[provider], ...config }
  }
}

export function updateCacheStrategy(method: string, config: Partial<CacheConfig>): void {
  if (rateLimitConfig.cachingStrategies[method]) {
    rateLimitConfig.cachingStrategies[method] = { ...rateLimitConfig.cachingStrategies[method], ...config }
  }
}

// Environment-based configuration overrides
export function applyEnvironmentOverrides(): void {
  // Allow environment variables to override default limits
  if (process.env.SYNDICA_RPS_LIMIT) {
    rateLimitConfig.providers.syndica.rpsLimit = parseInt(process.env.SYNDICA_RPS_LIMIT, 10)
  }
  
  if (process.env.HELIUS_RPS_LIMIT) {
    rateLimitConfig.providers.helius.rpsLimit = parseInt(process.env.HELIUS_RPS_LIMIT, 10)
  }
  
  if (process.env.SYNDICA_MONTHLY_LIMIT) {
    rateLimitConfig.providers.syndica.monthlyLimit = parseInt(process.env.SYNDICA_MONTHLY_LIMIT, 10)
  }
  
  if (process.env.HELIUS_MONTHLY_LIMIT) {
    rateLimitConfig.providers.helius.monthlyLimit = parseInt(process.env.HELIUS_MONTHLY_LIMIT, 10)
  }

  // Disable prefetching in development
  if (process.env.NODE_ENV === 'development') {
    rateLimitConfig.prefetchSettings.enabled = false
  }
}

// Apply environment overrides on import
applyEnvironmentOverrides()

export default rateLimitConfig
