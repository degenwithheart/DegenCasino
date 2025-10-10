const CACHE_NAME = 'degencasino-v3-progressive';
const RPC_CACHE_NAME = 'degencasino-rpc-v1';

// Enhanced static assets with game priorities
const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/png/icons/favicon.png',
  '/png/icons/icon-192.png',
  '/png/icons/icon-512.png',
  // Critical WebP images
  '/webp/casino.webp',
  '/webp/icons/favicon.webp',
  '/webp/icons/icon-192.webp',
  '/webp/icons/icon-512.webp',
];

// Enhanced cache strategies with game-specific handling
const CACHE_STRATEGIES = {
  // Static assets - cache first with longer TTL
  static: [
    /\.(css|js|woff2|woff|ttf)$/,
    /\/webp\/icons\//,
    /\/png\/icons\//
  ],
  // RPC and API calls - smart caching with stale-while-revalidate
  rpcCalls: [
    /\/api\/rpc/,
    /\/api\/services/
  ],
  // Network first for API calls and HTML pages
  networkFirst: [
    /\/api\//,
    /\.html$/,
    /^\/[^.]*$/ // Routes without file extensions (SPA routes)
  ],
  // Stale while revalidate for general assets
  staleWhileRevalidate: [
    /\.(png|jpg|jpeg|gif|svg|webp)$/,
    /\/assets\//
  ]
};

// Install event - cache critical assets with priority loading
self.addEventListener('install', (event) => {
  console.log('🔧 Enhanced Service Worker installing...');

  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Initialize RPC cache
      caches.open(RPC_CACHE_NAME).then((rpcCache) => {
        console.log('⚡ Initializing RPC cache');
        return Promise.resolve(); // RPC cache populated on demand
      })
    ])
      .then(() => {
        console.log('✅ Enhanced Service Worker installed');
        // Service workers don't have postMessage - communicate through clients instead
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Cache installation failed:', error);
      })
  );
});

// Activate event - clean old caches and setup progressive loading
self.addEventListener('activate', (event) => {
  console.log('🚀 Enhanced Service Worker activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) =>
              !cacheName.startsWith('degencasino-v3') &&
              !cacheName.startsWith('degencasino-games') &&
              !cacheName.startsWith('degencasino-rpc')
            )
            .map((cacheName) => {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('✅ Enhanced Service Worker activated');
        // Start progressive loading of high priority assets
        scheduleProgressiveLoading();
        return self.clients.claim();
      })
  );
});

// Progressive loading scheduler
function scheduleProgressiveLoading() {
  // Service worker handles static assets only - games are handled by React lazy loading
  console.log('🎯 Progressive loading initialized - static assets cached');
}

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;

  // Only cache same-origin requests
  if (url.origin !== location.origin) return;

  // Skip navigation requests (unless implementing offline shell)
  if (request.mode === 'navigate') return;

  // Skip sensitive endpoints that should never be cached
  if (request.headers.has('Authorization')) return;
  if (url.pathname.startsWith('/api/auth')) return;
  if (url.pathname.startsWith('/api/cache')) return;
  if (url.pathname.startsWith('/api/chat')) return;

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    // Strategy 1: RPC Calls - Smart caching with TTL
    if (CACHE_STRATEGIES.rpcCalls.some(pattern => pattern.test(pathname))) {
      return await rpcCacheStrategy(request);
    }

    // Strategy 2: Static Assets - Cache first
    if (CACHE_STRATEGIES.static.some(pattern => pattern.test(pathname))) {
      return await cacheFirst(request, CACHE_NAME);
    }

    // Strategy 3: Network First (API calls, HTML)
    if (CACHE_STRATEGIES.networkFirst.some(pattern => pattern.test(pathname))) {
      return await networkFirst(request);
    }

    // Strategy 5: Stale While Revalidate (General assets)
    if (CACHE_STRATEGIES.staleWhileRevalidate.some(pattern => pattern.test(pathname))) {
      return await staleWhileRevalidate(request);
    }

    // Default: Network with cache fallback
    return await networkWithCacheFallback(request);

  } catch (error) {
    console.error('Enhanced fetch error:', error);
    return await cacheFirst(request) || new Response('Offline', { status: 503 });
  }
}

// Enhanced Cache First Strategy
async function cacheFirst(request, cacheName = CACHE_NAME) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && networkResponse.type !== 'opaque') {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('Network failed for:', request.url);
    throw error;
  }
}

// RPC Cache Strategy - Smart caching for blockchain calls
async function rpcCacheStrategy(request) {
  const rpcCache = await caches.open(RPC_CACHE_NAME);
  const cacheKey = request.url + (request.method === 'POST' ? await request.clone().text() : '');
  const cachedResponse = await rpcCache.match(cacheKey);

  // Check if cached response is still fresh (5 minutes for most RPC calls)
  if (cachedResponse) {
    const cachedTime = cachedResponse.headers.get('sw-cached-time');
    const maxAge = getRpcCacheMaxAge(request.url);

    if (cachedTime && (Date.now() - parseInt(cachedTime)) < maxAge) {
      return cachedResponse;
    }
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && networkResponse.type !== 'opaque') {
      // Add timestamp header for cache validation
      const responseWithTime = new Response(networkResponse.body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: {
          ...networkResponse.headers,
          'sw-cached-time': Date.now().toString()
        }
      });
      rpcCache.put(cacheKey, responseWithTime.clone());
      return responseWithTime;
    }
    return networkResponse;
  } catch (error) {
    // Return stale cache on network error
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Helper functions
function isCriticalGameAsset(url) {
  return CRITICAL_GAME_ASSETS.some(asset => url.includes(asset));
}

function getRpcCacheMaxAge(url) {
  if (url.includes('getLatestBlockhash')) return 30000; // 30 seconds
  if (url.includes('getSlot') || url.includes('getBlockHeight')) return 60000; // 1 minute
  if (url.includes('getHealth') || url.includes('getVersion')) return 300000; // 5 minutes
  return 120000; // 2 minutes default
}

// Network First Strategy  
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && networkResponse.type !== 'opaque') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // Always try to fetch in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok && networkResponse.type !== 'opaque') {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  // Return cached version immediately if available
  return cachedResponse || fetchPromise;
}

// Network with Cache Fallback
async function networkWithCacheFallback(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && networkResponse.type !== 'opaque') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Message handling for cache management and statistics
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }

  if (event.data && event.data.type === 'GET_CACHE_STATS') {
    event.waitUntil(getCacheStats().then(stats => {
      event.ports[0].postMessage({ type: 'CACHE_STATS', stats });
    }));
  }
});// Get cache statistics
async function getCacheStats() {
  const cacheNames = await caches.keys();
  const stats = {};

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    stats[cacheName] = keys.length;
  }

  return stats;
}

console.log('📡 Enhanced Progressive Loading Service Worker loaded - Phase 1 Complete');
