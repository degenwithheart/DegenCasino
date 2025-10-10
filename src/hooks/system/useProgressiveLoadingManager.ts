// Progressive Loading Manager Hook
// Orchestrates all loading systems: Service Worker, Component Preloader, and RPC Cache

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

  // Intelligent game preloading based on current context and user behavior
  const intelligentGamePreload = useCallback(async () => {
    const networkInfo = getNetworkInfo();
    const maxPriority = getLoadingRecommendation(
      networkInfo.effectiveType === '2g' || networkInfo.effectiveType === 'slow-2g' ? 'slow' :
        networkInfo.effectiveType === '3g' ? 'medium' : 'fast',
      networkInfo.saveData ? 'save' : 'normal'
    );

    const currentPath = location.pathname;

    // Only preload games on relevant pages to avoid unnecessary loading
    const shouldPreloadGames = currentPath === '/' ||
      currentPath === '/dashboard' ||
      currentPath.startsWith('/game/');

    if (!shouldPreloadGames) {
      console.log('🎮 Skipping game preloading - not on game-related page');
      return;
    }

    // Determine how many games to preload based on context
    let gamesToPreload: GameLoadingConfig[] = [];
    let preloadReason = '';

    if (currentPath === '/' || currentPath === '/dashboard') {
      // On main pages, only preload critical games (most popular)
      gamesToPreload = getCriticalGames().slice(0, 3); // Limit to top 3 critical games
      preloadReason = 'dashboard - critical games only';
    } else if (currentPath.startsWith('/game/')) {
      // On game pages, preload similar games based on current game
      const currentGameId = currentPath.split('/game/')[1]?.split('/')[0];
      if (currentGameId) {
        const similarGames = getSimilarGames(currentGameId);
        gamesToPreload = similarGames.slice(0, 2); // Limit to 2 similar games
        preloadReason = `playing ${currentGameId} - similar games`;
      }
    }

    // Filter out already preloaded games
    gamesToPreload = gamesToPreload.filter(game => !isGamePreloaded(game.id));

    if (gamesToPreload.length === 0) {
      console.log('🎮 No games need preloading');
      return;
    }

    console.log(`🎮 Intelligent preloading (${preloadReason}):`, gamesToPreload.map(g => g.id));

    // Load games with smart staggering
    for (const [index, game] of gamesToPreload.entries()) {
      // Stagger loading to avoid overwhelming the network
      setTimeout(async () => {
        if (!isGamePreloaded(game.id)) {
          await preloadGame(game.id);

          // Notify service worker to cache game assets
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'PRELOAD_GAME',
              gameId: game.id
            });
          }
        }
      }, index * 500); // 500ms between each game instead of 1000ms
    }
  }, [location.pathname, preloadGame, isGamePreloaded, getNetworkInfo]);

  // User-behavior based intelligent preloading
  const preloadUserBehaviorBased = useCallback(async () => {
    if (loadingState.current.userSpecificPreloaded) return;

    const favoriteGames = userActivity.current.gamesPlayed
      .filter(game => userActivity.current.gamesPlayed.filter(g => g === game).length > 2)
      .slice(0, 3); // Top 3 most played games

    const recentGames = [...new Set(userActivity.current.gamesPlayed.slice(-5))]; // Last 5 unique games

    // Preload favorites
    if (favoriteGames.length > 0 && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PRELOAD_USER_FAVORITES',
        favoriteGames
      });
    }

    // Preload recent games
    if (recentGames.length > 0 && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PRELOAD_RECENT_GAMES',
        recentGames
      });
    }

    loadingState.current.userSpecificPreloaded = true;
  }, []);

  // Preload similar games when user is on a game page
  const preloadSimilarGames = useCallback(async (currentGameId: string) => {
    if (!currentGameId || !('serviceWorker' in navigator) || !navigator.serviceWorker.controller) return;

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

    navigator.serviceWorker.controller.postMessage({
      type: 'PRELOAD_SIMILAR_GAMES',
      currentGame: currentGameId,
      similarGames
    });
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

    // Initialize RPC optimization for this user
    await optimizeRpcPrefetching();

    loadingState.current.userSpecificPreloaded = true;
  }, [connected, publicKey, preloadComponent, optimizeRpcPrefetching]);

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
  }, [intelligentGamePreload, handleRoutePreloading, handleUserSpecificPreloading, connected, updateUserActivity]);

  // Handle wallet connection changes
  useEffect(() => {
    if (connected && publicKey) {
      handleUserSpecificPreloading();
    }
  }, [connected, publicKey, handleUserSpecificPreloading]);

  // Handle route changes
  useEffect(() => {
    const handleRouteChange = async () => {
      console.log('🛣️ Route changed, updating preloading strategy');

      // Reset loading state for new route context
      loadingState.current.criticalGamesLoaded = false;
      loadingState.current.highPriorityGamesLoaded = false;

      // Update preloading based on new route
      await intelligentGamePreload();
      await handleRoutePreloading();
      updateUserActivity(undefined, 'route_change');
    };

    handleRouteChange();
  }, [location.pathname, intelligentGamePreload, handleRoutePreloading, updateUserActivity]);

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

function optimizeRpcPrefetching() {
  throw new Error('Function not implemented.');
}
