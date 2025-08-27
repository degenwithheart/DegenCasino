import { useEffect } from 'react';

// Critical resources to preload
const CRITICAL_RESOURCES = [
  '/casino.png',
  '/favicon.png',
  '/icon-192.png',
];

// Game assets to preload when user hovers over game
const GAME_ASSETS = {
  plinko: ['/games/plinko.png'],
  blackjack: ['/games/blackjack.png'],
  roulette: ['/games/roulette.png'],
  slots: ['/games/slots.png'],
  mines: ['/games/mines.png'],
  // Add other games...
};

export function preloadResource(url: string, type: 'image' | 'script' | 'style' = 'image') {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    
    if (type === 'image') {
      link.type = 'image/png'; // or detect from URL
    }
    
    link.onload = resolve;
    link.onerror = reject;
    
    document.head.appendChild(link);
  });
}

export function preloadGameAssets(gameId: string) {
  const assets = GAME_ASSETS[gameId as keyof typeof GAME_ASSETS] || [];
  return Promise.all(assets.map(asset => preloadResource(asset)));
}

// Hook to preload critical resources
export function useCriticalPreloading() {
  useEffect(() => {
    // Preload critical resources immediately
    CRITICAL_RESOURCES.forEach(resource => {
      preloadResource(resource).catch(console.warn);
    });
  }, []);
}

// Prefetch the next likely resources
export function prefetchNextResources() {
  // Prefetch commonly accessed games
  const commonGames = ['plinko', 'blackjack', 'roulette'];
  
  // Use requestIdleCallback if available
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      commonGames.forEach(game => {
        preloadGameAssets(game).catch(console.warn);
      });
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      commonGames.forEach(game => {
        preloadGameAssets(game).catch(console.warn);
      });
    }, 2000);
  }
}
