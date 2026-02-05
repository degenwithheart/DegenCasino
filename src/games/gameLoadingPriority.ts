// Game loading priority and popularity system
// Based on featured games, live stnd typical user patterns

export enum LoadingPriority {
  CRITICAL = 0,      // Must load immediately (featured, most popular)
  HIGH = 1,          // Load after critical (popular, frequently accessed)
  MEDIUM = 2,        // Load on hover or user interest
  LOW = 3,           // Background preloading
  IDLE = 4           // Load when browser is idle
}

export interface GameLoadingConfig {
  id: string;
  priority: LoadingPriority;
  preloadAssets: string[];
  popularity: number; // 1-10 scale
  averageSessionTime: number; // estimated minutes
  conversionRate: number; // likelihood user will play after viewing
}

// Game loading configurations based on analysis of your current setup
export const GAME_LOADING_CONFIGS: GameLoadingConfig[] = [
  // CRITICAL - Featured games and most popular
  {
    id: 'dice',
    priority: LoadingPriority.CRITICAL,
    preloadAssets: ['/webp/games/dice.webp'],
    popularity: 9,
    averageSessionTime: 5,
    conversionRate: 0.8
  },
  {
    id: 'dicedual',
    priority: LoadingPriority.CRITICAL,
    preloadAssets: ['/webp/games/dicedual.webp'],
    popularity: 9,
    averageSessionTime: 5,
    conversionRate: 0.8
  },
  {
    id: 'slots',
    priority: LoadingPriority.CRITICAL,
    preloadAssets: ['/webp/games/slots.webp'],
    popularity: 10,
    averageSessionTime: 8,
    conversionRate: 0.9
  },
  {
    id: 'mines',
    priority: LoadingPriority.CRITICAL,
    preloadAssets: ['/webp/games/mines.webp'],
    popularity: 9,
    averageSessionTime: 7,
    conversionRate: 0.85
  },
  {
    id: 'plinko',
    priority: LoadingPriority.CRITICAL,
    preloadAssets: ['/webp/games/plinko.webp'],
    popularity: 8,
    averageSessionTime: 6,
    conversionRate: 0.75
  },
  {
    id: 'magic8ball',
    priority: LoadingPriority.CRITICAL,
    preloadAssets: ['/webp/games/magic8ball.png'],
    popularity: 7,
    averageSessionTime: 3,
    conversionRate: 0.7
  },

  // HIGH - Popular established games
  {
    id: 'crash',
    priority: LoadingPriority.HIGH,
    preloadAssets: ['/webp/games/crash.webp'],
    popularity: 8,
    averageSessionTime: 10,
    conversionRate: 0.8
  },
  {
    id: 'blackjack',
    priority: LoadingPriority.HIGH,
    preloadAssets: ['/webp/games/blackjack.webp'],
    popularity: 7,
    averageSessionTime: 12,
    conversionRate: 0.7
  },
  {
    id: 'flip',
    priority: LoadingPriority.HIGH,
    preloadAssets: ['/webp/games/flip.webp'],
    popularity: 7,
    averageSessionTime: 4,
    conversionRate: 0.75
  },
  {
    id: 'hilo',
    priority: LoadingPriority.HIGH,
    preloadAssets: ['/webp/games/hilo.webp'],
    popularity: 6,
    averageSessionTime: 8,
    conversionRate: 0.65
  },

  // MEDIUM - Additional games
  {
    id: 'plinkorace',
    priority: LoadingPriority.MEDIUM,
    preloadAssets: ['/webp/games/plinko-race.webp'],
    popularity: 5,
    averageSessionTime: 5,
    conversionRate: 0.5
  }
];

// Helper functions
export const getGamePriority = (gameId: string): LoadingPriority => {
  const config = GAME_LOADING_CONFIGS.find(g => g.id === gameId);
  return config?.priority ?? LoadingPriority.LOW;
};

export const getGameAssets = (gameId: string): string[] => {
  const config = GAME_LOADING_CONFIGS.find(g => g.id === gameId);
  return config?.preloadAssets ?? [];
};

export const getGamesByPriority = (priority: LoadingPriority): GameLoadingConfig[] => {
  return GAME_LOADING_CONFIGS.filter(g => g.priority === priority);
};

export const getCriticalGames = (): GameLoadingConfig[] => {
  return getGamesByPriority(LoadingPriority.CRITICAL);
};

export const getHighPriorityGames = (): GameLoadingConfig[] => {
  return getGamesByPriority(LoadingPriority.HIGH);
};

// Network-aware loading recommendations
export const getLoadingRecommendation = (
  connectionSpeed: 'slow' | 'medium' | 'fast',
  dataUsage: 'save' | 'normal' | 'unlimited'
): LoadingPriority => {
  if (dataUsage === 'save') return LoadingPriority.CRITICAL;
  if (connectionSpeed === 'slow') return LoadingPriority.HIGH;
  if (connectionSpeed === 'medium') return LoadingPriority.MEDIUM;
  return LoadingPriority.LOW; // Preload everything on fast connections
};