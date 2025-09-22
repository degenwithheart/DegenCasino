export interface ScrollConfig {
  scrollBehavior: 'auto' | 'smooth';
  scrollbarWidth: 'thin' | 'normal' | 'thick';
  enableMomentum: boolean;
  enableSnapScrolling: boolean;
  mobileOptimized: boolean;
  preventPullToRefresh: boolean;
  enableHorizontalScroll: boolean;
  customScrollbarColors: boolean;
}

export const defaultScrollConfig: ScrollConfig = {
  scrollBehavior: 'smooth',
  scrollbarWidth: 'normal',
  enableMomentum: true,
  enableSnapScrolling: true,
  mobileOptimized: true,
  preventPullToRefresh: true,
  enableHorizontalScroll: true,
  customScrollbarColors: true,
};

// Gaming-optimized scroll configurations
export const gameScrollConfigs = {
  dice: {
    ...defaultScrollConfig,
    enableSnapScrolling: false,
    scrollBehavior: 'auto' as const,
  },
  slots: {
    ...defaultScrollConfig,
    enableSnapScrolling: true,
    scrollBehavior: 'smooth' as const,
  },
  plinko: {
    ...defaultScrollConfig,
    enableMomentum: false,
    preventPullToRefresh: true,
  },
  roulette: {
    ...defaultScrollConfig,
    enableHorizontalScroll: true,
    enableSnapScrolling: true,
  },
  cards: {
    ...defaultScrollConfig,
    enableSnapScrolling: true,
    scrollBehavior: 'smooth' as const,
  },
} as const;

export type GameScrollConfigKey = keyof typeof gameScrollConfigs;

/**
 * Applies scroll configuration to the document root
 */
export const applyScrollConfig = (config: ScrollConfig) => {
  const root = document.documentElement;
  
  // Apply CSS custom properties for runtime control
  root.style.setProperty('--scroll-behavior', config.scrollBehavior);
  
  // Map scrollbar width to pixel values
  const scrollbarWidthMap = {
    thin: '6px',
    normal: '8px',
    thick: '12px',
  };
  root.style.setProperty('--scrollbar-width', scrollbarWidthMap[config.scrollbarWidth]);
  
  // Toggle momentum scrolling (primarily for iOS)
  root.style.setProperty(
    '--webkit-overflow-scrolling', 
    config.enableMomentum ? 'touch' : 'auto'
  );
  
  // Toggle snap scrolling
  root.style.setProperty(
    '--scroll-snap-type', 
    config.enableSnapScrolling ? 'y proximity' : 'none'
  );
  
  // Mobile optimizations
  if (config.mobileOptimized) {
    root.style.setProperty('--overscroll-behavior', 'contain');
    root.style.setProperty('--touch-action', 'pan-y');
  }
  
  // Pull-to-refresh prevention
  if (config.preventPullToRefresh) {
    root.style.setProperty('--overscroll-behavior-y', 'none');
  }
  
  // Horizontal scroll support
  if (!config.enableHorizontalScroll) {
    root.style.setProperty('--overflow-x', 'hidden');
  }
};

/**
 * Applies game-specific scroll configuration
 */
export const applyGameScrollConfig = (gameType: GameScrollConfigKey) => {
  const config = gameScrollConfigs[gameType];
  applyScrollConfig(config);
  
  // Add game-specific body class for CSS targeting
  document.body.classList.remove(...Object.keys(gameScrollConfigs).map(key => `scroll-config-${key}`));
  document.body.classList.add(`scroll-config-${gameType}`);
};

/**
 * Resets scroll configuration to default
 */
export const resetScrollConfig = () => {
  applyScrollConfig(defaultScrollConfig);
  
  // Remove all game-specific classes
  document.body.classList.remove(...Object.keys(gameScrollConfigs).map(key => `scroll-config-${key}`));
};

/**
 * Gets stored scroll configuration from localStorage
 */
export const getStoredScrollConfig = (): ScrollConfig => {
  try {
    const stored = localStorage.getItem('degenheart-scroll-config');
    if (stored) {
      return { ...defaultScrollConfig, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load scroll config from localStorage:', error);
  }
  return defaultScrollConfig;
};

/**
 * Stores scroll configuration to localStorage
 */
export const setStoredScrollConfig = (config: ScrollConfig) => {
  try {
    localStorage.setItem('degenheart-scroll-config', JSON.stringify(config));
  } catch (error) {
    console.warn('Failed to save scroll config to localStorage:', error);
  }
};

/**
 * Detects user's scroll preferences based on browser/device
 */
export const detectOptimalScrollConfig = (): Partial<ScrollConfig> => {
  const config: Partial<ScrollConfig> = {};
  
  // Check for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    config.scrollbarWidth = 'thick';
    config.mobileOptimized = true;
    config.preventPullToRefresh = true;
  }
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    config.scrollBehavior = 'auto';
    config.enableSnapScrolling = false;
  }
  
  // Check for touch capability
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (hasTouch) {
    config.enableMomentum = true;
  }
  
  // Check browser for optimal settings
  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  if (isFirefox) {
    // Firefox has different scrollbar customization
    config.customScrollbarColors = false;
  }
  
  if (isSafari) {
    // Safari benefits from momentum scrolling
    config.enableMomentum = true;
  }
  
  return config;
};

/**
 * Hook for managing scroll configuration
 */
export const useScrollConfigManager = () => {
  const applyConfig = (config: Partial<ScrollConfig>) => {
    const fullConfig = { ...defaultScrollConfig, ...config };
    applyScrollConfig(fullConfig);
    setStoredScrollConfig(fullConfig);
    return fullConfig;
  };
  
  const applyGameConfig = (gameType: GameScrollConfigKey) => {
    applyGameScrollConfig(gameType);
    return gameScrollConfigs[gameType];
  };
  
  const resetConfig = () => {
    resetScrollConfig();
    setStoredScrollConfig(defaultScrollConfig);
    return defaultScrollConfig;
  };
  
  const detectAndApplyOptimal = () => {
    const optimal = detectOptimalScrollConfig();
    return applyConfig(optimal);
  };
  
  return {
    applyConfig,
    applyGameConfig,
    resetConfig,
    detectAndApplyOptimal,
    defaultConfig: defaultScrollConfig,
    gameConfigs: gameScrollConfigs,
  };
};