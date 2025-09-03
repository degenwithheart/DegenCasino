import { useEffect } from 'react';

// Service Worker registration and management
export function useServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register the service worker
      navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 New Service Worker available');
                // Optionally notify user about update
                if (window.confirm('A new version is available. Reload to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
      
      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'VERSION') {
          console.log('📦 Cache version:', event.data.version);
        }
      });
    }
  }, []);
}

// Cache critical game assets when user hovers over game
export function preloadGameAssets(gameId: string) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    const gameAssets = [
      `/webp/games/${gameId}.webp`,
      `/webp/games/${gameId}.png`, // fallback
    ];
    
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_URLS',
      urls: gameAssets
    });
  }
}

// Preload critical assets immediately
export function preloadCriticalAssets() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    const criticalAssets = [
      '/webp/casino.webp',
      '/webp/pfp.webp',
      '/webp/overlay-glow.webp',
      '/webp/seo.webp',
  // Early game thumbnails for perceived speed
  '/webp/games/blackjack.webp',
  '/webp/games/dice.webp',
  '/webp/games/roulette.webp',
    ];
    
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_URLS', 
      urls: criticalAssets
    });
  }
}

// Warm cache with a broader set of game/media assets after network idle
export function warmCacheDeferred() {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) return
  if ((navigator as any).connection?.saveData) return
  const idle = (cb: () => void) => {
    if ('requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(cb, { timeout: 4000 })
    } else setTimeout(cb, 1500)
  }
  idle(() => {
    navigator.serviceWorker.controller?.postMessage({
      type: 'CACHE_URLS',
      urls: [
        '/webp/games/mines.webp',
        '/webp/games/plinko.webp',
        '/webp/games/slots.webp',
        '/webp/games/crash.webp',
        '/webp/games/flip.webp',
        '/webp/games/poker.webp',
      ]
    })
  })
}

// Check if app is running from cache (offline mode)
export function checkCacheStatus(): Promise<string> {
  return new Promise((resolve) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        resolve(event.data.version || 'unknown');
      };
      
      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_VERSION' },
        [channel.port2]
      );
    } else {
      resolve('no-sw');
    }
  });
}
