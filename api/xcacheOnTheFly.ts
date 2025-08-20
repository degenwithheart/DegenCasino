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
  if (cache.set && typeof cache.set === 'function' && ttlMs && cache.set.length >= 3) {
    // @httpx/xcache supports set(key, value, ttl)
    cache.set(key, value, ttlMs)
  } else {
    cacheSet(key, value)
  }
  return value
}
