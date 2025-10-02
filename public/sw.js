const CACHE_NAME = 'degencasino-v3-progressive';
const GAME_CACHE_NAME = 'degencasino-games-v1';
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

// Critical game assets to preload immediately
const CRITICAL_GAME_ASSETS = [
  '/webp/games/dice.webp',
  '/webp/games/slots.webp', 
  '/webp/games/mines.webp',
  '/webp/games/plinko.webp',
  '/webp/games/magic8ball.png'
];

// High priority game assets to preload after critical
const HIGH_PRIORITY_GAME_ASSETS = [
  '/webp/games/crash.webp',
  '/webp/games/blackjack.webp',
  '/webp/games/multi-poker.webp',
  '/webp/games/flip.webp',
  '/webp/games/hilo.webp'
];

// Game-specific caching strategies
const GAME_LOADING_PRIORITIES = {
  'critical': ['dice', 'slots', 'mines', 'plinko', 'magic8ball'],
  'high': ['crash', 'blackjack', 'multipoker', 'flip-v2', 'hilo'],
  'medium': ['cryptochartgame-v2', 'doubleornothing-v2', 'fancyvirtualhorseracing-v2', 'keno-v2', 'limbo-v2'],
  'low': [] // Populated dynamically
};

// Enhanced cache strategies with game-specific handling
const CACHE_STRATEGIES = {
  // Static assets - cache first with longer TTL
  static: [
    /\.(css|js|woff2|woff|ttf)$/,
    /\/webp\/icons\//,
    /\/png\/icons\//
  ],
  // Game assets - prioritized caching with immediate availability
  gameAssets: [
    /\/webp\/games\//,
    /\/png\/games\//
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
      // Cache critical game assets
      caches.open(GAME_CACHE_NAME).then((gameCache) => {
        console.log('🎮 Caching critical game assets');
        return gameCache.addAll(CRITICAL_GAME_ASSETS);
      }),
      // Initialize RPC cache
      caches.open(RPC_CACHE_NAME).then((rpcCache) => {
        console.log('⚡ Initializing RPC cache');
        return Promise.resolve(); // RPC cache populated on demand
      })
    ])
    .then(() => {
      console.log('✅ Enhanced Service Worker installed');
      // Schedule background preloading of high priority assets
      self.postMessage({ type: 'PRELOAD_HIGH_PRIORITY' });
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
  // Preload high priority game assets after 2 seconds
  setTimeout(() => {
    caches.open(GAME_CACHE_NAME).then((gameCache) => {
      console.log('🎮 Preloading high priority game assets');
      HIGH_PRIORITY_GAME_ASSETS.forEach(asset => {
        fetch(asset).then(response => {
          if (response.ok) {
            gameCache.put(asset, response);
          }
        }).catch(() => {}); // Silent fail for background loading
      });
    });
  }, 2000);
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
    // Strategy 1: Game Assets - Prioritized caching
    if (CACHE_STRATEGIES.gameAssets.some(pattern => pattern.test(pathname))) {
      return await gameAssetStrategy(request);
    }
    
    // Strategy 2: RPC Calls - Smart caching with TTL
    if (CACHE_STRATEGIES.rpcCalls.some(pattern => pattern.test(pathname))) {
      return await rpcCacheStrategy(request);
    }
    
    // Strategy 3: Static Assets - Cache first
    if (CACHE_STRATEGIES.static.some(pattern => pattern.test(pathname))) {
      return await cacheFirst(request, CACHE_NAME);
    }
    
    // Strategy 4: Network First (API calls, HTML)
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

// Game Asset Strategy - Optimized for game resources
async function gameAssetStrategy(request) {
  const gameCache = await caches.open(GAME_CACHE_NAME);
  const cachedResponse = await gameCache.match(request);
  
  // Always return cached version immediately for games
  if (cachedResponse) {
    // Background update for critical games
    if (isCriticalGameAsset(request.url)) {
      fetch(request).then(response => {
        if (response.ok && response.type !== 'opaque') {
          gameCache.put(request, response);
        }
      }).catch(() => {}); // Silent background update
    }
    return cachedResponse;
  }
  
  // Not in cache, fetch and cache
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && networkResponse.type !== 'opaque') {
      gameCache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('Game asset fetch failed:', request.url);
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

// Enhanced message handling for progressive loading
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls;
    const isGameAsset = urls.some(url => url.includes('/games/'));
    const cacheName = isGameAsset ? GAME_CACHE_NAME : CACHE_NAME;
    
    event.waitUntil(
      caches.open(cacheName).then((cache) => {
        return cache.addAll(urls);
      })
    );
  }
  
  if (event.data && event.data.type === 'PRELOAD_GAME') {
    const gameId = event.data.gameId;
    event.waitUntil(preloadGameAssets(gameId));
  }
  
  if (event.data && event.data.type === 'PRELOAD_PRIORITY') {
    const priority = event.data.priority; // 'critical', 'high', 'medium'
    event.waitUntil(preloadGamesByPriority(priority));
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATS') {
    event.waitUntil(getCacheStats().then(stats => {
      event.ports[0].postMessage({ type: 'CACHE_STATS', stats });
    }));
  }
});

// Preload specific game assets
async function preloadGameAssets(gameId) {
  const gameCache = await caches.open(GAME_CACHE_NAME);
  const gameAssets = [
    `/webp/games/${gameId}.webp`,
    `/png/games/${gameId}.png`
  ];
  
  for (const asset of gameAssets) {
    try {
      const response = await fetch(asset);
      if (response.ok) {
        await gameCache.put(asset, response);
        console.log(`🎮 Preloaded ${asset}`);
      }
    } catch (error) {
      console.warn(`Failed to preload ${asset}:`, error);
    }
  }
}

// Preload games by priority level
async function preloadGamesByPriority(priority) {
  const games = GAME_LOADING_PRIORITIES[priority] || [];
  const gameCache = await caches.open(GAME_CACHE_NAME);
  
  for (const gameId of games) {
    await preloadGameAssets(gameId);
  }
  
  console.log(`🎮 Preloaded ${priority} priority games: ${games.join(', ')}`);
}

// Get cache statistics
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
