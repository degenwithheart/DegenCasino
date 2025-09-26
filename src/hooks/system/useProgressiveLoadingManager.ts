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
  getLoadingRecommendation 
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

  // Intelligent game preloading based on current context
  const intelligentGamePreload = useCallback(async () => {
    const networkInfo = getNetworkInfo();
    const maxPriority = getLoadingRecommendation(
      networkInfo.effectiveType === '2g' || networkInfo.effectiveType === 'slow-2g' ? 'slow' :
      networkInfo.effectiveType === '3g' ? 'medium' : 'fast',
      networkInfo.saveData ? 'save' : 'normal'
    );

    // Only preload up to the recommended priority level
    if (maxPriority >= LoadingPriority.CRITICAL && !loadingState.current.criticalGamesLoaded) {
      const criticalGames = getCriticalGames();
      console.log('🎮 Intelligent preloading: Critical games');
      
      for (const game of criticalGames) {
        if (!isGamePreloaded(game.id)) {
          await preloadGame(game.id);
          
          // Notify service worker to preload game assets
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'PRELOAD_GAME',
              gameId: game.id
            });
          }
        }
      }
      loadingState.current.criticalGamesLoaded = true;
    }

    if (maxPriority >= LoadingPriority.HIGH && !loadingState.current.highPriorityGamesLoaded) {
      const highPriorityGames = getHighPriorityGames();
      console.log('🎮 Intelligent preloading: High priority games');
      
      // Stagger high priority game loading
      highPriorityGames.forEach((game, index) => {
        setTimeout(async () => {
          if (!isGamePreloaded(game.id)) {
            await preloadGame(game.id);
          }
        }, index * 1000); // 1 second between each game
      });
      loadingState.current.highPriorityGamesLoaded = true;
    }
  }, [preloadGame, isGamePreloaded]);

  // Optimize RPC prefetching based on user context
  const optimizeRpcPrefetching = useCallback(async () => {
    if (loadingState.current.rpcOptimized) return;

    try {
      // Send intelligent prefetch request to smart cache
      const response = await fetch('/api/rpc/intelligent-prefetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userWallet: publicKey?.toString(),
          currentRoute: location.pathname,
          userActivity: userActivity.current,
          networkInfo: getNetworkInfo()
        })
      });

      if (response.ok) {
        console.log('⚡ RPC prefetching optimized');
        loadingState.current.rpcOptimized = true;
      }
    } catch (error) {
      console.warn('RPC prefetch optimization failed:', error);
    }
  }, [publicKey, location.pathname]);

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
      // From game, user likely to visit leaderboard or try another game
      await preloadComponent(() => import('../../pages/features/LeaderboardPage'), 'leaderboard-page');
      
      // Preload other popular games
      const criticalGames = getCriticalGames();
      const currentGameId = path.split('/game/')[1];
      const otherGames = criticalGames.filter(g => g.id !== currentGameId).slice(0, 2);
      
      for (const game of otherGames) {
        await preloadGame(game.id);
      }
    }
  }, [location.pathname, preloadComponent, preloadGame]);

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
      
      // Start with intelligent game preloading
      await intelligentGamePreload();
      
      // Handle route-specific preloading
      await handleRoutePreloading();
      
      // User-specific preloading if connected
      if (connected) {
        await handleUserSpecificPreloading();
      }
      
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
    handleRoutePreloading();
    updateUserActivity(undefined, 'route_change');
    
    // Detect if user navigated to a game page
    const gameMatch = location.pathname.match(/\/game\/[^\/]+\/(.+)/);
    if (gameMatch) {
      const gameId = gameMatch[1];
      updateUserActivity(gameId, 'game_start');
    } else if (userActivity.current.currentGame) {
      // User left a game page
      updateUserActivity(userActivity.current.currentGame, 'game_end');
    }
  }, [location.pathname, handleRoutePreloading, updateUserActivity]);

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
    isProgressiveLoadingActive: () => loadingState.current.criticalGamesLoaded
  };
}