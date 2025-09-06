// src/utils/cache.ts
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  key: string;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL

  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      key
    };
    this.cache.set(key, entry);
    
    // Auto-expire after TTL
    if (ttl !== undefined) {
      setTimeout(() => {
        this.delete(key);
      }, ttl);
    }
  }

  get<T>(key: string, maxAge?: number): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    const ttl = maxAge ?? this.defaultTTL;
    
    if (age > ttl) {
      this.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  invalidateByPattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const [key] of this.cache) {
      if (regex.test(key)) {
        this.delete(key);
      }
    }
  }

  // Get all keys matching a pattern
  getKeysMatching(pattern: string): string[] {
    const regex = new RegExp(pattern);
    return Array.from(this.cache.keys()).filter(key => regex.test(key));
  }

  // Check if cache has any entries
  has(key: string): boolean {
    return this.cache.has(key);
  }

  // Get cache statistics
  getStats() {
    const entries = Array.from(this.cache.values());
    const now = Date.now();
    
    return {
      totalEntries: entries.length,
      totalSize: entries.reduce((size, entry) => {
        return size + JSON.stringify(entry.data).length;
      }, 0),
      oldestEntry: Math.min(...entries.map(e => e.timestamp)),
      newestEntry: Math.max(...entries.map(e => e.timestamp)),
      expiredEntries: entries.filter(e => now - e.timestamp > this.defaultTTL).length
    };
  }
}

// Export singleton instance
export const cache = new MemoryCache();

// Cache key generators
export const CacheKeys = {
  leaderboard: (period: string, creator: string) => `leaderboard:${period}:${creator}`,
  recentPlays: (showAllPlatforms: boolean, creator?: string) => 
    `recentPlays:${showAllPlatforms}:${creator || 'all'}`,
  playerPlays: (address: string) => `playerPlays:${address}`,
  platformStats: (creator: string) => `platformStats:${creator}`,
} as const;

// Cache TTL constants (in milliseconds)
export const CacheTTL = {
  LEADERBOARD: 2 * 60 * 1000,    // 2 minutes for leaderboard
  RECENT_PLAYS: 30 * 1000,       // 30 seconds for recent plays  
  PLAYER_PLAYS: 1 * 60 * 1000,   // 1 minute for player plays
  PLATFORM_STATS: 5 * 60 * 1000, // 5 minutes for platform stats
} as const;
