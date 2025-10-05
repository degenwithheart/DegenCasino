import { useEffect, useRef, useCallback } from 'react';
import { getCriticalGames, getHighPriorityGames, LoadingPriority } from '../../games/gameLoadingPriority';

// Game ID to folder path mapping based on allGames.ts structure
const getGameFolderPath = (gameId: string): string => {
  const gamePathMap: { [key: string]: string; } = {
    'dice': 'Dice',
    'magic8ball': 'Magic8Ball',
    'slots': 'Slots',
    'plinkorace': 'PlinkoRace',
    'flip': 'Flip',
    'hilo': 'HiLo',
    'mines': 'Mines',
    'plinko': 'Plinko',
    'crash': 'CrashGame',
    'blackjack': 'BlackJack'
  };
  return gamePathMap[gameId] || gameId;
};

// Enhanced preloader for lazy-loaded React components with game priority awareness
export function useComponentPreloader() {
  const preloadedComponents = useRef(new Set<string>());
  const preloadedGames = useRef(new Set<string>());

  useEffect(() => {
    // Progressive component preloading based on priority
    const preloadCriticalComponents = async () => {
      // Phase 1: Critical components (immediate)
      const criticalComponents = [
        { fn: () => import('../../sections/Game/Game'), key: 'game-page', delay: 0 },
        { fn: () => import('../../sections/Dashboard/Dashboard'), key: 'dashboard', delay: 100 },
      ];

      // Phase 2: High priority components  
      const highPriorityComponents = [
        { fn: () => import('../../pages/features/JackpotPage'), key: 'jackpot', delay: 500 },
        { fn: () => import('../../pages/features/LeaderboardPage'), key: 'leaderboard', delay: 600 },
        { fn: () => import('../../sections/DGHRTToken/DGHRTToken'), key: 'dghrt-token', delay: 700 },
      ];

      // Phase 3: Medium priority components
      const mediumPriorityComponents = [
        { fn: () => import('../../sections/Dashboard/AboutMe/AboutMe'), key: 'about-me', delay: 1000 },
        { fn: () => import('../../sections/Dashboard/Terms/Terms'), key: 'terms', delay: 1100 },
        { fn: () => import('../../pages/features/SelectTokenPage'), key: 'select-token', delay: 1200 },
        { fn: () => import('../../pages/features/BonusPage'), key: 'bonus', delay: 1300 },
      ];

      const allComponents = [
        ...criticalComponents,
        ...highPriorityComponents,
        ...mediumPriorityComponents
      ];

      // Preload components with staggered timing
      allComponents.forEach(({ fn, key, delay }) => {
        setTimeout(async () => {
          try {
            await fn();
            preloadedComponents.current.add(key);
            console.log(`📦 Preloaded component: ${key}`);
          } catch (error) {
            console.warn(`Failed to preload component ${key}:`, error);
          }
        }, delay);
      });
    };

    // Preload critical games after components
    const preloadCriticalGames = async () => {
      const criticalGames = getCriticalGames();

      criticalGames.forEach((game, index) => {
        setTimeout(async () => {
          try {
            // Import the game component using correct folder path
            const folderPath = getGameFolderPath(game.id);
            const gameModule = await import(/* @vite-ignore */ `../../games/${folderPath}`);
            preloadedGames.current.add(game.id);
            console.log(`🎮 Preloaded critical game: ${game.id}`);

            // Notify service worker to cache game assets
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
              navigator.serviceWorker.controller.postMessage({
                type: 'PRELOAD_GAME',
                gameId: game.id
              });
            }
          } catch (error) {
            console.warn(`Failed to preload game ${game.id}:`, error);
          }
        }, 1500 + (index * 300)); // Start after components, stagger by 300ms
      });
    };

    // Progressive high priority games
    const preloadHighPriorityGames = async () => {
      const highPriorityGames = getHighPriorityGames();

      highPriorityGames.forEach((game, index) => {
        setTimeout(async () => {
          try {
            // Only preload if not already loaded
            if (!preloadedGames.current.has(game.id)) {
              const folderPath = getGameFolderPath(game.id);
              const gameModule = await import(/* @vite-ignore */ `../../games/${folderPath}`);
              preloadedGames.current.add(game.id);
              console.log(`🎮 Preloaded high priority game: ${game.id}`);
            }
          } catch (error) {
            console.warn(`Failed to preload game ${game.id}:`, error);
          }
        }, 3000 + (index * 500)); // Start after critical games
      });
    };

    // Start the progressive loading process
    const timeoutId = setTimeout(() => {
      preloadCriticalComponents();
      preloadCriticalGames();
      preloadHighPriorityGames();
    }, 800); // Initial delay to not block first paint

    return () => clearTimeout(timeoutId);
  }, []);

  // Preload specific component on demand
  const preloadComponent = useCallback(async (importFn: () => Promise<any>, key: string) => {
    if (preloadedComponents.current.has(key)) {
      return; // Already preloaded
    }

    try {
      await importFn();
      preloadedComponents.current.add(key);
      console.log(`📦 On-demand preloaded: ${key}`);
    } catch (error) {
      console.warn(`Failed to preload component ${key}:`, error);
    }
  }, []);

  // Preload specific game on demand (e.g., on hover)
  const preloadGame = useCallback(async (gameId: string) => {
    if (preloadedGames.current.has(gameId)) {
      return; // Already preloaded
    }

    try {
      // Dynamic import mapping for games (matches game path map)
      const gameImportMap: Record<string, () => Promise<any>> = {
        'dice': () => import('../../games/Dice'),
        'magic8ball': () => import('../../games/Magic8Ball'),
        'slots': () => import('../../games/Slots'),
        'plinkorace': () => import('../../games/PlinkoRace'),
        'flip': () => import('../../games/Flip'),
        'hilo': () => import('../../games/HiLo'),
        'mines': () => import('../../games/Mines'),
        'plinko': () => import('../../games/Plinko'),
        'crash': () => import('../../games/CrashGame'),
        'blackjack': () => import('../../games/BlackJack')
      };

      const importFn = gameImportMap[gameId];
      if (importFn) {
        await importFn();
        preloadedGames.current.add(gameId);
        console.log(`🎮 On-demand preloaded game: ${gameId}`);
      }
    } catch (error) {
      console.warn(`Failed to preload game ${gameId}:`, error);
    }
  }, []);

  return {
    preloadComponent,
    preloadGame,
    isComponentPreloaded: (key: string) => preloadedComponents.current.has(key),
    isGamePreloaded: (gameId: string) => preloadedGames.current.has(gameId),
    getPreloadedComponentsCount: () => preloadedComponents.current.size,
    getPreloadedGamesCount: () => preloadedGames.current.size
  };
}

// Hook to preload component on hover or focus
export function useHoverPreload(importFn: () => Promise<any>, key: string) {
  const { preloadComponent } = useComponentPreloader();

  const handlePreload = () => {
    preloadComponent(importFn, key);
  };

  return {
    onMouseEnter: handlePreload,
    onFocus: handlePreload,
  };
}