// xcacheOnTheFly.ts
// Helper for on-the-fly caching in Edge API routes
import cache, { cacheGet, cacheSet } from './xcache-edge'

/**
 * Caches the result of an async function on the fly.
 * @param key Unique cache key
 * @param fetcher Async function to fetch data if not cached
 * @param ttlMs Optional TTL in ms (only works if using @httpx/xcache)
 */
export async function cacheOnTheFly(key: string, fetcher: () => Promise<any>, ttlMs?: number) {
  let value = cacheGet(key)
  if (value !== undefined) {
    if (typeof window !== 'undefined') {
      window.console.log(`[xcache] HIT for key:`, key)
    } else {
      console.log(`[xcache] HIT for key:`, key)
    }
    return value
  }
  value = await fetcher()
  if (typeof window !== 'undefined') {
    window.console.log(`[xcache] MISS for key:`, key)
  } else {
    console.log(`[xcache] MISS for key:`, key)
  }
  if (cache.set && typeof cache.set === 'function') {
    // Only pass two arguments as expected by cache.set
    cache.set(key, value)
    // If TTL is needed, implement TTL logic here or ensure your cache implementation supports it
  } else {
    cacheSet(key, value)
  }
  return value
}
