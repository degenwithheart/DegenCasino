// xcache-edge.ts
// Edge-safe universal cache utility: always uses in-memory Map (no @httpx/xcache)

const cache = new Map<string, any>();

export function cacheGet(key: string) {
  return cache.get(key);
}

export function cacheSet(key: string, value: any) {
  return cache.set(key, value);
}

export function cacheHas(key: string) {
  return cache.has(key);
}

export function cacheDelete(key: string) {
  return cache.delete(key);
}

export default cache;
