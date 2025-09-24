// xcache-edge.ts
// Enhanced Edge-safe universal cache utility with TTL and memory management

interface CacheItem {
  value: any;
  timestamp: number;
  ttl?: number; // TTL in milliseconds
}

class EnhancedCache {
  private cache = new Map<string, CacheItem>();
  private maxSize = 1000; // Prevent memory bloat
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default

  get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return undefined;

    // Check if expired
    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  set(key: string, value: any, ttl?: number): boolean {
    // Enforce size limit - remove oldest entries
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
    return true;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    // Check if expired
    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Cleanup expired entries
  cleanup(): number {
    let cleaned = 0;
    const now = Date.now();
    
    this.cache.forEach((item, key) => {
      if (item.ttl && now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    });
    
    return cleaned;
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: (this.cache.size / this.maxSize * 100).toFixed(1) + '%'
    };
  }

  // Set cache configuration
  configure(options: { maxSize?: number; defaultTTL?: number }) {
    if (options.maxSize) this.maxSize = options.maxSize;
    if (options.defaultTTL) this.defaultTTL = options.defaultTTL;
  }
}

const cache = new EnhancedCache();

// Periodic cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const cleaned = cache.cleanup();
    if (cleaned > 0) {
      console.log(`[xcache] Cleaned ${cleaned} expired entries`);
    }
  }, 5 * 60 * 1000);
}

// Legacy exports for compatibility
export function cacheGet(key: string) {
  return cache.get(key);
}

export function cacheSet(key: string, value: any, ttl?: number) {
  return cache.set(key, value, ttl);
}

export function cacheHas(key: string) {
  return cache.has(key);
}

export function cacheDelete(key: string) {
  return cache.delete(key);
}

export function cacheCleanup() {
  return cache.cleanup();
}

export function cacheStats() {
  return cache.getStats();
}

export function cacheConfigure(options: { maxSize?: number; defaultTTL?: number }) {
  return cache.configure(options);
}

export default cache;
