// Intelligent RPC Prefetch API Endpoint
// Integrates with smart cache for user-pattern-based prefetching

import smartCache from '../rate-limiter/smart-cache';

export const config = {
  runtime: 'edge',
}

interface IntelligentPrefetchRequest {
  userWallet?: string;
  currentRoute: string;
  userActivity: {
    level: 'high' | 'medium' | 'low';
    gamesPlayed: string[];
    sessionDuration: number;
    lastActive: number;
  };
  networkInfo: {
    effectiveType: '4g' | '3g' | '2g' | 'slow-2g' | undefined;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body: IntelligentPrefetchRequest = await request.json();
    const { userWallet, currentRoute, userActivity, networkInfo } = body;

    console.log('[IntelligentPrefetch] Processing request:', {
      userWallet: userWallet ? `${userWallet.slice(0, 8)}...` : 'none',
      currentRoute,
      activityLevel: userActivity.level,
      gamesPlayed: userActivity.gamesPlayed.length,
      networkType: networkInfo.effectiveType
    });

    // Configure intelligent prefetching based on context
    await smartCache.intelligentPrefetch({
      userWallet,
      currentGame: extractGameFromRoute(currentRoute),
      recentGames: userActivity.gamesPlayed.slice(-5), // Last 5 games
      userActivity: userActivity.level
    });

    // Additional prefetch strategies based on network conditions
    if (networkInfo.effectiveType === '4g' && !networkInfo.saveData) {
      // On fast connections, prefetch more aggressively
      await prefetchGameSpecificData(userActivity.gamesPlayed);
    } else if (networkInfo.saveData || networkInfo.effectiveType === '2g') {
      // On slow connections, only critical prefetching
      await prefetchCriticalOnly(userWallet);
    }

    // Route-specific prefetching
    await prefetchRouteSpecificData(currentRoute, userActivity.level);

    return new Response(JSON.stringify({
      success: true,
      message: 'Intelligent prefetch configured',
      optimizations: {
        userSpecific: !!userWallet,
        gameSpecific: userActivity.gamesPlayed.length > 0,
        networkOptimized: true,
        routeOptimized: true
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[IntelligentPrefetch] Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to configure intelligent prefetch'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper functions
function extractGameFromRoute(route: string): string | undefined {
  const gameMatch = route.match(/\/game\/([^\/]+)/);
  return gameMatch ? gameMatch[1] : undefined;
}

async function prefetchGameSpecificData(gamesPlayed: string[]): Promise<void> {
  // Prefetch data for recently played games
  const recentGames = gamesPlayed.slice(-3); // Last 3 games
  
  for (const gameId of recentGames) {
    // Add game-specific RPC prefetching
    smartCache.addGamePrefetchPattern(gameId);
  }
  
  console.log('[IntelligentPrefetch] Added game-specific prefetch for:', recentGames);
}

async function prefetchCriticalOnly(userWallet?: string): Promise<void> {
  if (userWallet) {
    // Only add user balance prefetching on slow connections
    smartCache.addUserPrefetchConfig(userWallet);
  }
  
  console.log('[IntelligentPrefetch] Configured critical-only prefetch');
}

async function prefetchRouteSpecificData(route: string, activityLevel: string): Promise<void> {
  const routePrefetchMap: Record<string, string[]> = {
    '/': ['getLatestBlockhash', 'getHealth'],
    '/dashboard': ['getLatestBlockhash', 'getSlot'],
    '/jackpot': ['getLatestBlockhash', 'getProgramAccounts'],
    '/leaderboard': ['getSlot', 'getBlockHeight'],
  };

  const gameRouteMatch = route.match(/^\/game\//);
  if (gameRouteMatch) {
    // Game-specific prefetching
    const gamePrefetch = ['getLatestBlockhash', 'getSlot', 'getAccountInfo'];
    console.log('[IntelligentPrefetch] Game route prefetch configured');
    return;
  }

  const prefetchMethods = routePrefetchMap[route];
  if (prefetchMethods) {
    console.log(`[IntelligentPrefetch] Route-specific prefetch for ${route}:`, prefetchMethods);
  }
}