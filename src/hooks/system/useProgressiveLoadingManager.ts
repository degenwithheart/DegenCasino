// Progressive Loading Manager Hook
// Hybrid loading system: Route-specific + Idle progressive + Lazy loading

import { useEffect, useCallback, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useLocation } from 'react-router-dom';
import { useComponentPreloader } from './useComponentPreloader';
import {
  getCriticalGames,
  getHighPriorityGames,
  LoadingPriority,
  getLoadingRecommendation,
  type GameLoadingConfig
} from '../../games/gameLoadingPriority';
import {
  getRouteDependencies,
  getLikelyNextRoutes,
  type RouteDependencies
} from './routeDependencies';

interface NetworkInfo {
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g' | undefined;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface UserActivity {
  level: 'high' | 'medium' | 'low';
  gamesPlayed: string[];
  sessionDuration: number;
  lastActive: number;
  currentGame?: string;
  gamesPlayedThisSession: number;
  routeChanges: number;
}

// Session storage keys
const SESSION_KEYS = {
  USER_ACTIVITY: 'progressive-loading-user-activity',
  GAMES_PLAYED: 'progressive-loading-games-played',
  SESSION_START: 'progressive-loading-session-start'
} as const;

export function useProgressiveLoadingManager() {
  const { publicKey, connected } = useWallet();
  const location = useLocation();
  const { preloadGame, preloadComponent, isGamePreloaded } = useComponentPreloader();

  // Initialize user activity from session storage or defaults
  const initializeUserActivity = (): UserActivity => {
    const stored = sessionStorage.getItem(SESSION_KEYS.USER_ACTIVITY);
    const sessionStart = sessionStorage.getItem(SESSION_KEYS.SESSION_START);
    const now = Date.now();

    if (stored && sessionStart) {
      const parsed = JSON.parse(stored);
      const sessionDuration = now - parseInt(sessionStart);
      return {
        ...parsed,
        sessionDuration,
        lastActive: now
      };
    }

    // Set session start time
    sessionStorage.setItem(SESSION_KEYS.SESSION_START, now.toString());

    return {
      level: 'low', // Start with low activity level
      gamesPlayed: [],
      sessionDuration: 0,
      lastActive: now,
      gamesPlayedThisSession: 0,
      routeChanges: 0
    };
  };

  const userActivity = useRef<UserActivity>(initializeUserActivity());

  const loadingState = useRef({
    criticalGamesLoaded: false,
    highPriorityGamesLoaded: false,
    userSpecificPreloaded: false,
    rpcOptimized: false
  });

  // Track preloaded components and idle loading state
  const preloadedComponents = useRef(new Set<string>());
  const idleLoadingActive = useRef(false);

  // Component key to import function mapping
  const preloadComponentByKey = useCallback(async (componentKey: string) => {
    const componentMap: Record<string, () => Promise<any>> = {
      // Page components that exist
      'Dashboard': () => import('../../sections/Dashboard/Dashboard'),
      'GameGrid': () => import('../../sections/Dashboard/Dashboard'), // Part of Dashboard
      'RecentPlays': () => import('../../sections/Dashboard/Dashboard'), // Part of Dashboard
      'GamePage': () => import('../../sections/Game/Game'),
      'JackpotPage': () => import('../../pages/features/JackpotPage'),
      'LeaderboardPage': () => import('../../pages/features/LeaderboardPage'),
      'BonusPage': () => import('../../pages/features/BonusPage'),
      'AboutMe': () => import('../../sections/Dashboard/AboutMe/AboutMe'),
      'Terms': () => import('../../sections/Dashboard/Terms/Terms'),

      // Game components (these will be lazy loaded within pages)
      'DiceGame': () => import('../../games/Dice'),
      'SlotsGame': () => import('../../games/Slots'),
      'MinesGame': () => import('../../games/Mines'),
      'CrashGame': () => import('../../games/CrashGame'),
      'BlackJackGame': () => import('../../games/BlackJack'),
      'PlinkoGame': () => import('../../games/Plinko'),
      'FlipGame': () => import('../../games/Flip'),
      'HiLoGame': () => import('../../games/HiLo'),
      'Magic8BallGame': () => import('../../games/Magic8Ball')
    };

    const importFn = componentMap[componentKey];
    if (importFn) {
      await importFn();
      preloadedComponents.current.add(componentKey);
      console.log(`📦 Preloaded component: ${componentKey}`);
    } else {
      console.warn(`Unknown component key: ${componentKey} - skipping preload`);
    }
  }, []);

  // Detect network conditions
  const getNetworkInfo = useCallback((): NetworkInfo => {
    const nav = navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    return {
      effectiveType: connection?.effectiveType || '4g',
      downlink: connection?.downlink || 10,
      rtt: connection?.rtt || 100,
      saveData: connection?.saveData || false
    };
  }, []);

  // Update user activity tracking with session storage persistence
  const updateUserActivity = useCallback((gameId?: string, action?: 'game_start' | 'game_end' | 'route_change') => {
    const now = Date.now();
    const sessionStart = parseInt(sessionStorage.getItem(SESSION_KEYS.SESSION_START) || now.toString());
    const timeSinceLastActive = now - userActivity.current.lastActive;

    // Update session duration
    userActivity.current.sessionDuration = now - sessionStart;
    userActivity.current.lastActive = now;

    if (action === 'route_change') {
      userActivity.current.routeChanges++;
    }

    if (gameId) {
      // Track current game
      if (action === 'game_start') {
        userActivity.current.currentGame = gameId;

        // Add to games played if not already there
        if (!userActivity.current.gamesPlayed.includes(gameId)) {
          userActivity.current.gamesPlayed.push(gameId);
          userActivity.current.gamesPlayedThisSession++;

          // Store games played list in session storage
          sessionStorage.setItem(SESSION_KEYS.GAMES_PLAYED, JSON.stringify(userActivity.current.gamesPlayed));
        }
      } else if (action === 'game_end') {
        userActivity.current.currentGame = undefined;
      }

    }

    // Always update activity level based on current engagement (move outside gameId check)
    const gamesCount = userActivity.current.gamesPlayedThisSession;
    const sessionMinutes = userActivity.current.sessionDuration / (60 * 1000);

    if (gamesCount >= 3 || sessionMinutes > 10) {
      userActivity.current.level = 'high';
    } else if (gamesCount >= 1 || sessionMinutes > 3) {
      userActivity.current.level = 'medium';
    } else {
      userActivity.current.level = 'low';
    }

    // Persist to session storage
    sessionStorage.setItem(SESSION_KEYS.USER_ACTIVITY, JSON.stringify(userActivity.current));

    console.log('🏃 User Activity Updated:', {
      gamesPlayed: userActivity.current.gamesPlayedThisSession,
      level: userActivity.current.level,
      sessionDuration: Math.round(userActivity.current.sessionDuration / 1000) + 's',
      currentGame: userActivity.current.currentGame
    });
  }, []);

  // Get similar games based on game category and user behavior
  const getSimilarGames = useCallback((currentGameId: string): GameLoadingConfig[] => {
    // Define game similarity mapping
    const gameCategories: Record<string, string[]> = {
      dice: ['magic8ball', 'flip', 'hilo'],
      slots: ['crash', 'blackjack', 'roulette'],
      mines: ['plinko', 'dice', 'hilo'],
      plinko: ['mines', 'dice', 'flip'],
      crash: ['slots', 'blackjack', 'flip'],
      blackjack: ['slots', 'crash', 'roulette'],
      flip: ['dice', 'hilo', 'magic8ball'],
      hilo: ['dice', 'flip', 'magic8ball'],
      magic8ball: ['dice', 'flip', 'hilo']
    };

    const similarGameIds = gameCategories[currentGameId] || [];
    const allGames = [...getCriticalGames(), ...getHighPriorityGames()];

    // Return similar games that exist in our loading configs, prioritizing by popularity
    return similarGameIds
      .map(id => allGames.find(game => game.id === id))
      .filter((game): game is GameLoadingConfig => game !== undefined)
      .sort((a, b) => b.popularity - a.popularity); // Sort by popularity
  }, []);

  // Route-specific loading: Load exactly what the current page needs
  const loadRouteDependencies = useCallback(async (pathname: string) => {
    const routeDeps = getRouteDependencies(pathname);
    if (!routeDeps) {
      console.log(`📄 No specific dependencies for route: ${pathname}`);
      return;
    }

    console.log(`📄 Loading route dependencies for ${pathname}:`, routeDeps.components);

    // Load critical components immediately
    const criticalComponents = routeDeps.components.filter(comp => routeDeps.priority === 'critical');
    for (const component of criticalComponents) {
      if (!preloadedComponents.current.has(component)) {
        try {
          await preloadComponentByKey(component);
          preloadedComponents.current.add(component);
        } catch (error) {
          console.warn(`Failed to preload component ${component}:`, error);
        }
      }
    }

    // Load games for this route
    if (routeDeps.games) {
      for (const gameId of routeDeps.games) {
        if (!isGamePreloaded(gameId)) {
          setTimeout(() => preloadGame(gameId), Math.random() * 200); // Slight stagger
        }
      }
    }

    // Load high priority components with slight delay
    const highPriorityComponents = routeDeps.components.filter(comp => routeDeps.priority === 'high');
    setTimeout(() => {
      highPriorityComponents.forEach(component => {
        if (!preloadedComponents.current.has(component)) {
          preloadComponentByKey(component).catch(error =>
            console.warn(`Failed to preload high priority component ${component}:`, error)
          );
        }
      });
    }, 100);
  }, [preloadGame, isGamePreloaded]);

  // Idle progressive loading: Preload likely next routes when user is idle
  const startIdleProgressiveLoading = useCallback(() => {
    if (idleLoadingActive.current) return;

    const currentPath = location.pathname;
    const likelyRoutes = getLikelyNextRoutes(currentPath);

    if (likelyRoutes.length === 0) return;

    idleLoadingActive.current = true;
    console.log(`😴 Starting idle progressive loading for routes:`, likelyRoutes);

    // Preload route dependencies in background when idle
    let routeIndex = 0;
    const preloadNextRoute = () => {
      if (routeIndex >= likelyRoutes.length) {
        idleLoadingActive.current = false;
        return;
      }

      const route = likelyRoutes[routeIndex];
      const routeDeps = getRouteDependencies(route);

      if (routeDeps) {
        console.log(`😴 Idle preloading route: ${route}`);

        // Preload components for this likely route
        routeDeps.components.forEach((component, compIndex) => {
          setTimeout(() => {
            if (!preloadedComponents.current.has(component)) {
              preloadComponentByKey(component).catch(() => {
                // Silent fail for idle loading
              });
            }
          }, compIndex * 200); // Stagger component loading
        });

        // Preload games for this route
        if (routeDeps.games) {
          routeDeps.games.forEach((gameId, gameIndex) => {
            setTimeout(() => {
              if (!isGamePreloaded(gameId)) {
                preloadGame(gameId).catch(() => {
                  // Silent fail for idle loading
                });
              }
            }, gameIndex * 300);
          });
        }
      }

      routeIndex++;
      // Schedule next route preload with delay
      setTimeout(preloadNextRoute, 2000); // 2 second delay between routes
    };

    // Start after initial idle period
    setTimeout(preloadNextRoute, 3000);
  }, [location.pathname, preloadGame, isGamePreloaded]);

  // Legacy intelligent game preloading (kept for compatibility but replaced by route-specific)
  const intelligentGamePreload = useCallback(async () => {
    // This is now handled by route-specific loading and idle progressive loading
    console.log('🎮 Game preloading now handled by route-specific and idle loading');
  }, []);

  // User-behavior based intelligent preloading
  const preloadUserBehaviorBased = useCallback(async () => {
    if (loadingState.current.userSpecificPreloaded) return;

    const favoriteGames = userActivity.current.gamesPlayed
      .filter(game => userActivity.current.gamesPlayed.filter(g => g === game).length > 2)
      .slice(0, 3); // Top 3 most played games

    const recentGames = [...new Set(userActivity.current.gamesPlayed.slice(-5))]; // Last 5 unique games

    // Preload favorites and recent games via React lazy loading
    const gamesToPreload = [...new Set([...favoriteGames, ...recentGames])];
    for (const gameId of gamesToPreload.slice(0, 3)) {
      if (!isGamePreloaded(gameId)) {
        setTimeout(() => preloadGame(gameId), Math.random() * 2000); // Random delay up to 2s
      }
    }

    loadingState.current.userSpecificPreloaded = true;
  }, []);

  // Preload similar games when user is on a game page
  const preloadSimilarGames = useCallback(async (currentGameId: string) => {
    if (!currentGameId) return;

    // Define game similarity mapping
    const similarGamesMap: Record<string, string[]> = {
      dice: ['magic8ball', 'flip', 'hilo'],
      slots: ['crash', 'blackjack', 'roulette'],
      mines: ['plinko', 'dice', 'hilo'],
      plinko: ['mines', 'dice', 'flip'],
      crash: ['slots', 'blackjack', 'flip'],
      blackjack: ['slots', 'crash', 'roulette'],
      flip: ['dice', 'hilo', 'magic8ball'],
      hilo: ['dice', 'flip', 'magic8ball']
    };

    const similarGames = similarGamesMap[currentGameId] || [];

    // Preload similar games via React lazy loading
    for (const gameId of similarGames.slice(0, 2)) {
      if (!isGamePreloaded(gameId)) {
        setTimeout(() => preloadGame(gameId), Math.random() * 1500); // Random delay up to 1.5s
      }
    }
  }, []);

  // User-specific preloading when wallet connects
  const handleUserSpecificPreloading = useCallback(async () => {
    if (!connected || !publicKey || loadingState.current.userSpecificPreloaded) return;

    console.log('👤 Starting user-specific preloading');

    // Preload user-specific components
    const userComponents = [
      { fn: () => import('../../sections/UserProfile/UserProfile'), key: 'user-profile' },
      { fn: () => import('../../pages/features/BonusPage'), key: 'bonus-page' },
      { fn: () => import('../../components/Transaction/Transaction'), key: 'transaction-modal' }
    ];

    for (const { fn, key } of userComponents) {
      await preloadComponent(fn, key);
    }

    // RPC optimization not implemented yet - skip for now
    // await optimizeRpcPrefetching();

    loadingState.current.userSpecificPreloaded = true;
  }, [connected, publicKey, preloadComponent]);

  // Route-based preloading
  const handleRoutePreloading = useCallback(async () => {
    const path = location.pathname;

    // Preload likely next routes based on current route
    if (path === '/' || path === '/dashboard') {
      // From dashboard, user likely to visit games or jackpot
      await preloadComponent(() => import('../../sections/Game/Game'), 'game-section');
      await preloadComponent(() => import('../../pages/features/JackpotPage'), 'jackpot-page');
    } else if (path.startsWith('/game/')) {
      // From game, user likely to visit leaderboard
      await preloadComponent(() => import('../../pages/features/LeaderboardPage'), 'leaderboard-page');
      // Note: Game preloading is now handled by intelligentGamePreload based on similarity
    }
  }, [location.pathname, preloadComponent]);

  // Game hover preloading
  const preloadGameOnHover = useCallback(async (gameId: string) => {
    updateUserActivity();

    if (!isGamePreloaded(gameId)) {
      console.log(`🎮 Hover preloading: ${gameId}`);
      await preloadGame(gameId);

      // Cache game assets in service worker
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'PRELOAD_GAME',
          gameId: gameId
        });
      }
    }
  }, [preloadGame, isGamePreloaded, updateUserActivity]);

  // Priority-based mass preloading
  const preloadByPriority = useCallback(async (priority: 'critical' | 'high' | 'medium') => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PRELOAD_PRIORITY',
        priority: priority
      });
    }
  }, []);

  // Initialize session tracking and progressive loading on mount
  useEffect(() => {
    const initializeProgressiveLoading = async () => {
      console.log('🚀 Initializing progressive loading manager');

      // Initialize session if not exists
      if (!sessionStorage.getItem(SESSION_KEYS.SESSION_START)) {
        sessionStorage.setItem(SESSION_KEYS.SESSION_START, Date.now().toString());
        sessionStorage.setItem(SESSION_KEYS.GAMES_PLAYED, '[]');
        console.log('📊 Session tracking initialized');
      }

      // Only do minimal preloading on initialization - let route change handler do the heavy lifting
      // This prevents loading games on pages that don't need them
      console.log('🎯 Progressive loading initialized - waiting for route context');

      // Initial activity update
      updateUserActivity(undefined, 'route_change');
    };

    // Delay initialization to not block initial render
    const timeoutId = setTimeout(initializeProgressiveLoading, 1500);

    return () => clearTimeout(timeoutId);
  }, [updateUserActivity]);

  // Handle wallet connection changes
  useEffect(() => {
    if (connected && publicKey) {
      handleUserSpecificPreloading();
    }
  }, [connected, publicKey, handleUserSpecificPreloading]);

  // Handle route changes - NEW HYBRID APPROACH
  useEffect(() => {
    const handleRouteChange = async () => {
      console.log('🛣️ Route changed - loading route-specific dependencies');

      // Load exactly what this route needs immediately
      await loadRouteDependencies(location.pathname);

      // Update user activity
      updateUserActivity(undefined, 'route_change');

      // Start idle progressive loading after route-specific loading is done
      // This preloads likely next routes when user is idle
      setTimeout(() => {
        startIdleProgressiveLoading();
      }, 2000); // Wait 2 seconds for initial route loading to complete
    };

    handleRouteChange();
  }, [location.pathname, loadRouteDependencies, startIdleProgressiveLoading, updateUserActivity]);

  // Performance monitoring with live session data
  const getPerformanceStats = useCallback(() => {
    // Get live data from session storage
    const sessionStart = parseInt(sessionStorage.getItem(SESSION_KEYS.SESSION_START) || Date.now().toString());
    const currentSessionDuration = Date.now() - sessionStart;
    const gamesPlayedList = JSON.parse(sessionStorage.getItem(SESSION_KEYS.GAMES_PLAYED) || '[]');

    // Update current activity before returning stats
    const currentActivity = {
      ...userActivity.current,
      sessionDuration: currentSessionDuration,
      gamesPlayed: gamesPlayedList,
      gamesPlayedThisSession: gamesPlayedList.length
    };

    return {
      loadingState: loadingState.current,
      userActivity: currentActivity,
      networkInfo: getNetworkInfo(),
      serviceWorkerActive: 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null
    };
  }, [getNetworkInfo]);

  return {
    preloadGameOnHover,
    preloadByPriority,
    updateUserActivity,
    getPerformanceStats,
    preloadUserBehaviorBased,
    preloadSimilarGames,
    isProgressiveLoadingActive: () => loadingState.current.criticalGamesLoaded
  };
}
