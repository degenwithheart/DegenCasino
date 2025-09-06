const CACHE_NAME = 'degencasino-v2';
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

// Cache strategies
const CACHE_STRATEGIES = {
  // Static assets - cache first
  static: [
    /\.(css|js|woff2|woff|ttf)$/,
    /\/webp\//,
    /\/games\//
  ],
  // Network first for API calls
  networkFirst: [
    /\/api\//,
    /\/rpc/
  ],
  // Stale while revalidate for game assets
  staleWhileRevalidate: [
    /\.(png|jpg|jpeg|gif|svg|webp)$/,
    /\/assets\//
  ]
};

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker installed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Cache installation failed:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

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

  // Skip sensitive endpoints that should never be cached
  if (request.headers.has('Authorization')) return;
  if (url.pathname.startsWith('/api/auth')) return;
  if (url.pathname.startsWith('/api/cache')) return;
  if (url.pathname.startsWith('/api/chat')) return;

  // Don't cache navigation requests (full HTML)
  if (request.mode === 'navigate') return;

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Strategy 1: Network First (API calls)
    if (CACHE_STRATEGIES.networkFirst.some(pattern => pattern.test(pathname))) {
      return await networkFirst(request);
    }
    
    // Strategy 2: Cache First (Static assets)
    if (CACHE_STRATEGIES.static.some(pattern => pattern.test(pathname))) {
      return await cacheFirst(request);
    }
    
    // Strategy 3: Stale While Revalidate (Images, game assets)
    if (CACHE_STRATEGIES.staleWhileRevalidate.some(pattern => pattern.test(pathname))) {
      return await staleWhileRevalidate(request);
    }
    
    // Default: Network with cache fallback
    return await networkWithCacheFallback(request);
    
  } catch (error) {
    console.error('Fetch error:', error);
    return await cacheFirst(request) || new Response('Offline', { status: 503 });
  }
}

// Cache First Strategy
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    // Guard against opaque responses
    if (networkResponse.ok && networkResponse.type !== 'opaque') {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('Network failed for:', request.url);
    throw error;
  }
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

// Message handling for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls;
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urls);
      })
    );
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('📡 Service Worker loaded');
