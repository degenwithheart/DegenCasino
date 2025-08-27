// Enhanced cache monitoring utility for client-side use
import React from 'react'

// Cache TTL constants (copied from API for frontend use)
export const CacheTTL = {
  MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000
} as const

interface CacheMonitorStats {
  size: number
  maxSize: number
  utilization: string
  timestamp: string
}

interface CacheEntry {
  key: string
  hit: boolean
  timestamp: number
  size?: number
}

class CacheMonitor {
  private hits = new Map<string, number>()
  private misses = new Map<string, number>()
  private recentActivity: CacheEntry[] = []
  private maxActivity = 100

  // Track cache hits/misses
  recordHit(key: string) {
    this.hits.set(key, (this.hits.get(key) || 0) + 1)
    this.addActivity({ key, hit: true, timestamp: Date.now() })
  }

  recordMiss(key: string) {
    this.misses.set(key, (this.misses.get(key) || 0) + 1)
    this.addActivity({ key, hit: false, timestamp: Date.now() })
  }

  private addActivity(entry: CacheEntry) {
    this.recentActivity.unshift(entry)
    if (this.recentActivity.length > this.maxActivity) {
      this.recentActivity.pop()
    }
  }

  // Get hit rate for a specific key
  getHitRate(key: string): number {
    const hits = this.hits.get(key) || 0
    const misses = this.misses.get(key) || 0
    const total = hits + misses
    return total > 0 ? (hits / total) * 100 : 0
  }

  // Get overall hit rate
  getOverallHitRate(): number {
    let totalHits = 0
    let totalMisses = 0
    
    for (const hits of this.hits.values()) {
      totalHits += hits
    }
    
    for (const misses of this.misses.values()) {
      totalMisses += misses
    }
    
    const total = totalHits + totalMisses
    return total > 0 ? (totalHits / total) * 100 : 0
  }

  // Get cache statistics
  getStats() {
    return {
      hitRate: this.getOverallHitRate(),
      totalHits: Array.from(this.hits.values()).reduce((a, b) => a + b, 0),
      totalMisses: Array.from(this.misses.values()).reduce((a, b) => a + b, 0),
      uniqueKeys: new Set([...this.hits.keys(), ...this.misses.keys()]).size,
      recentActivity: this.recentActivity.slice(0, 10),
      timestamp: new Date().toISOString()
    }
  }

  // Get top performing cache keys
  getTopKeys(limit = 10) {
    const keyStats = new Map<string, { hits: number; misses: number; hitRate: number }>()
    
    // Collect all keys
    const allKeys = new Set([...this.hits.keys(), ...this.misses.keys()])
    
    for (const key of allKeys) {
      const hits = this.hits.get(key) || 0
      const misses = this.misses.get(key) || 0
      const hitRate = this.getHitRate(key)
      keyStats.set(key, { hits, misses, hitRate })
    }
    
    // Sort by hit rate and total usage
    return Array.from(keyStats.entries())
      .sort(([, a], [, b]) => {
        const aTotal = a.hits + a.misses
        const bTotal = b.hits + b.misses
        return (b.hitRate * bTotal) - (a.hitRate * aTotal)
      })
      .slice(0, limit)
      .map(([key, stats]) => ({ key, ...stats }))
  }

  // Clear all statistics
  clear() {
    this.hits.clear()
    this.misses.clear()
    this.recentActivity = []
  }
}

// Singleton instance
export const cacheMonitor = new CacheMonitor()

// Utility functions for cache management in frontend
export async function getCacheStats(): Promise<CacheMonitorStats | null> {
  try {
    const response = await fetch('/api/cache-admin?action=stats')
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.warn('Failed to fetch cache stats:', error)
  }
  return null
}

export async function cleanupCache(): Promise<boolean> {
  try {
    const response = await fetch('/api/cache-admin?action=cleanup')
    return response.ok
  } catch (error) {
    console.warn('Failed to cleanup cache:', error)
    return false
  }
}

export async function warmupCache(): Promise<boolean> {
  try {
    const response = await fetch('/api/cache-warmup')
    return response.ok
  } catch (error) {
    console.warn('Failed to warmup cache:', error)
    return false
  }
}

// Hook for React components to monitor cache
export function useCacheMonitor() {
  const [stats, setStats] = React.useState(cacheMonitor.getStats())
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStats(cacheMonitor.getStats())
    }, 5000) // Update every 5 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  return {
    stats,
    topKeys: cacheMonitor.getTopKeys(),
    clear: () => cacheMonitor.clear(),
    getCacheStats,
    cleanupCache,
    warmupCache
  }
}
