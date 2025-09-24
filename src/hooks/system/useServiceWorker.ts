import { useEffect } from 'react';

// Service Worker registration and management
export function useServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register the service worker
      navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none', // Prevent caching of service worker itself
      })
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
        
        // Force update check on page load
        registration.update();
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 New Service Worker available');
                // Auto-reload for better UX (instead of prompting)
                window.location.reload();
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
        
        // Handle navigation cache refresh
        if (event.data && event.data.type === 'NAVIGATION_REFRESH') {
          console.log('🔄 Navigation cache refreshed');
          window.dispatchEvent(new CustomEvent('sw-navigation-refresh'));
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
      `/png/games/${gameId}.png`, // fallback
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
    ];
    
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_URLS', 
      urls: criticalAssets
    });
  }
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
