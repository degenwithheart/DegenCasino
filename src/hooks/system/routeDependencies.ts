// Route-specific dependency loading system
// Maps each route to the components/assets it needs immediately

export interface RouteDependencies {
    components: string[]; // Component keys to preload immediately
    games?: string[]; // Game IDs to preload for this route
    assets?: string[]; // Additional assets to preload
    priority: 'critical' | 'high' | 'medium'; // Loading priority
}

// Route dependency mapping - what each page needs immediately
export const ROUTE_DEPENDENCIES: Record<string, RouteDependencies> = {
    // Dashboard/Home - needs game grid and navigation
    '/': {
        components: ['Dashboard'],
        games: [], // Games loaded on-demand via lazy loading
        priority: 'critical'
    },
    '/dashboard': {
        components: ['Dashboard'],
        games: [],
        priority: 'critical'
    },

    // Game pages - need game-specific components
    '/game/dice': {
        components: ['DiceGame'],
        games: ['dice'], // Preload the current game
        priority: 'critical'
    },
    '/game/slots': {
        components: ['SlotsGame'],
        games: ['slots'],
        priority: 'critical'
    },
    '/game/mines': {
        components: ['MinesGame'],
        games: ['mines'],
        priority: 'critical'
    },
    '/game/crash': {
        components: ['CrashGame'],
        games: ['crash'],
        priority: 'critical'
    },
    '/game/blackjack': {
        components: ['BlackJackGame'],
        games: ['blackjack'],
        priority: 'critical'
    },
    '/game/plinko': {
        components: ['PlinkoGame'],
        games: ['plinko'],
        priority: 'critical'
    },
    '/game/flip': {
        components: ['FlipGame'],
        games: ['flip'],
        priority: 'critical'
    },
    '/game/hilo': {
        components: ['HiLoGame'],
        games: ['hilo'],
        priority: 'critical'
    },
    '/game/magic8ball': {
        components: ['Magic8BallGame'],
        games: ['magic8ball'],
        priority: 'critical'
    },

    // User pages
    '/jackpot': {
        components: ['JackpotPage'],
        priority: 'high'
    },
    '/leaderboard': {
        components: ['LeaderboardPage'],
        priority: 'high'
    },
    '/bonus': {
        components: ['BonusPage'],
        priority: 'high'
    },

    // Static pages - minimal dependencies
    '/about': {
        components: ['AboutMe'],
        priority: 'medium'
    },
    '/terms': {
        components: ['Terms'],
        priority: 'medium'
    }
};

// Get dependencies for a specific route
export function getRouteDependencies(pathname: string): RouteDependencies | null {
    // Exact match first
    if (ROUTE_DEPENDENCIES[pathname]) {
        return ROUTE_DEPENDENCIES[pathname];
    }

    // Pattern matching for dynamic routes
    if (pathname.startsWith('/game/')) {
        const gameId = pathname.split('/game/')[1]?.split('/')[0];
        if (gameId && ROUTE_DEPENDENCIES[`/game/${gameId}`]) {
            return ROUTE_DEPENDENCIES[`/game/${gameId}`];
        }
    }

    return null;
}

// Get likely next routes from current route (for idle preloading)
export function getLikelyNextRoutes(currentPath: string): string[] {
    const routeTransitions: Record<string, string[]> = {
        '/': ['/game/dice', '/game/slots', '/game/mines', '/profile'],
        '/dashboard': ['/game/dice', '/game/slots', '/game/mines', '/profile'],
        '/game/dice': ['/game/slots', '/game/mines', '/game/magic8ball'],
        '/game/slots': ['/game/crash', '/game/blackjack', '/game/mines'],
        '/game/mines': ['/game/plinko', '/game/dice', '/game/hilo'],
        '/profile': ['/', '/jackpot', '/leaderboard']
    };

    return routeTransitions[currentPath] || [];
}