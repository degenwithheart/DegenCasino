// xcache-edge.ts
// Universal cache utility for Edge API routes (Vercel Edge Runtime)
// Tries to use @httpx/xcache, falls back to Map if not available or not compatible

let cache: any;
let isXCache = false;

try {
  // Dynamically import xcache (works in Node/browser, may fail in Edge)
  // @ts-ignore
  const { XCache } = await import('@httpx/xcache');
  cache = new XCache();
  isXCache = true;
} catch (e) {
  // Fallback: simple in-memory Map
  cache = new Map();
  isXCache = false;
}

export function cacheGet(key: string) {
  if (isXCache) return cache.get(key);
  return cache.get(key);
}

export function cacheSet(key: string, value: any) {
  if (isXCache) return cache.set(key, value);
  return cache.set(key, value);
}

export function cacheHas(key: string) {
  if (isXCache) return cache.has(key);
  return cache.has(key);
}

export function cacheDelete(key: string) {
  if (isXCache) return cache.delete(key);
  return cache.delete(key);
}

export default cache;
