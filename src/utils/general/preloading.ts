import { useEffect } from 'react';

// Critical resources to preload
const CRITICAL_RESOURCES = [
  '/png/images/casino.png',
  '/png/icons/favicon.png',
  '/png/icons/icon-192.png',
];

// Game assets to preload when user hovers over game
const GAME_ASSETS = {
  plinko: ['/png/games/plinko.png'],
  blackjack: ['/png/games/blackjack.png'],
  roulette: ['/png/games/roulette.png'],
  slots: ['/png/games/slots.png'],
  mines: ['/png/games/mines.png'],
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
  const commonGames = ['plinko', 'blackjack'];
  
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
