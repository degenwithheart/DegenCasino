// xcacheOnTheFly.ts
// Enhanced helper for on-the-fly caching in Edge API routes
import cache, { cacheGet, cacheSet, cacheStats } from './xcache-edge'

interface CacheOptions {
  ttl?: number; // TTL in milliseconds
  tags?: string[]; // Tags for cache invalidation
  skipCache?: boolean; // Skip cache entirely
  forceRefresh?: boolean; // Force refresh from source
}

/**
 * Enhanced caching function with TTL, tags, and better logging
 * @param key Unique cache key
 * @param fetcher Async function to fetch data if not cached
 * @param options Cache options including TTL, tags, etc.
 */
export async function cacheOnTheFly<T>(
  key: string, 
  fetcher: () => Promise<T>, 
  options: CacheOptions = {}
): Promise<T> {
  const { ttl, skipCache = false, forceRefresh = false } = options;
  
  // Skip cache if requested
  if (skipCache) {
    console.log(`[xcache] SKIP for key: ${key}`);
    return await fetcher();
  }

  // Force refresh if requested
  if (forceRefresh) {
    console.log(`[xcache] FORCE_REFRESH for key: ${key}`);
    const value = await fetcher();
    cacheSet(key, value, ttl);
    return value;
  }

  // Try to get from cache
  let value = cacheGet(key);
  if (value !== undefined) {
    console.log(`[xcache] HIT for key: ${key}`);
    return value;
  }

  // Cache miss - fetch and store
  console.log(`[xcache] MISS for key: ${key}`);
  try {
    value = await fetcher();
    cacheSet(key, value, ttl);
    return value;
  } catch (error) {
    console.error(`[xcache] FETCH_ERROR for key: ${key}`, error);
    throw error;
  }
}

/**
 * Cache a value directly (useful for API responses)
 */
export function cacheValue<T>(key: string, value: T, ttl?: number): T {
  cacheSet(key, value, ttl);
  console.log(`[xcache] SET for key: ${key}`);
  return value;
}

/**
 * Invalidate cache entries by tag or pattern
 */
export function invalidateCache(pattern: string | RegExp): number {
  // Since we can't iterate over Map keys directly in the current implementation,
  // we'll need to enhance this when we add tag support
  console.log(`[xcache] INVALIDATE pattern: ${pattern}`);
  return 0; // Will be enhanced when tags are implemented
}

/**
 * Warm up cache with multiple entries
 */
export async function warmupCache(entries: Array<{
  key: string;
  fetcher: () => Promise<any>;
  ttl?: number;
}>): Promise<void> {
  console.log(`[xcache] WARMUP started for ${entries.length} entries`);
  
  const promises = entries.map(async ({ key, fetcher, ttl }) => {
    try {
      const value = await fetcher();
      cacheSet(key, value, ttl);
      console.log(`[xcache] WARMED key: ${key}`);
    } catch (error) {
      console.error(`[xcache] WARMUP_ERROR for key: ${key}`, error);
    }
  });
  
  await Promise.allSettled(promises);
  console.log(`[xcache] WARMUP completed`);
}

/**
 * Get cache statistics
 */
export function getCacheInfo() {
  const stats = cacheStats();
  console.log(`[xcache] STATS:`, stats);
  return stats;
}

/**
 * Create a memoized version of a function with caching
 */
export function memoize<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl?: number
): T {
  return ((...args: Parameters<T>) => {
    const key = keyGenerator(...args);
    return cacheOnTheFly(key, () => fn(...args), { ttl });
  }) as T;
}

// Export enhanced cache with common TTL presets
export const CacheTTL = {
  MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000
} as const;
