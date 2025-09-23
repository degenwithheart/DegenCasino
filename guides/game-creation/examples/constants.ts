// Game Constants for Modern Game Template
// This file demonstrates the pattern used in actual DegenHeart Casino games

// Import game configuration from RTP config (if exists)
// Example: import { TEMPLATE_CONFIG } from '../rtpConfig-v2'
// export const OUTCOMES = TEMPLATE_CONFIG.OUTCOMES

// Game-specific constants
export const GAME_CONFIG = {
  id: 'modern-game-template',
  name: 'Modern Game Template',
  maxMultiplier: 5,
  minBet: 0.01,
  maxBet: 100,
  rtp: 96,
  outcomes: [0, 2, 0, 5], // Example bet array: 40% lose, 30% win 2x, 20% lose, 10% win 5x
  animationDuration: 2000,
  autoResetDelay: 3000,
};

// Audio imports - following the pattern from actual games
// Place audio files in the same folder as your game components
export { default as SOUND_LOSE } from './lose.mp3'
export { default as SOUND_TICK } from './tick.mp3'
export { default as SOUND_PLAY } from './play.mp3'
export { default as SOUND_WIN } from './win.mp3'

// Game capabilities - define what rendering modes your game supports
export const GAME_CAPABILITIES = {
  'modern-game-template': {
    supports2D: true,
    supports3D: true, // Set to false if you don't implement 3D renderer
    defaultMode: '2D'
  }
};

// UI constants
export const UI_CONFIG = {
  canvasWidth: 800,
  canvasHeight: 600,
  mobileBreakpoint: 768,
  colors: {
    primary: '#ffd700',
    secondary: '#a259ff',
    accent: '#ff9500',
    success: '#00ff88',
    error: '#ff4757',
    background: '#1a1a2e',
    surface: '#16213e',
  }
};

// Game state types
export type GameState = 'idle' | 'playing' | 'finished';

// Animation constants
export const ANIMATION_CONFIG = {
  pulseSpeed: 0.008,
  rotationSpeed: 0.01,
  fadeInDuration: 500,
  fadeOutDuration: 300,
};
      play: '/sounds/your-game/play.mp3',
      tick: '/sounds/your-game/tick.mp3',
      background: '/sounds/your-game/background.mp3'
    }
  },
  
  // Color scheme
  colors: {
    primary: '#d4a574',      // Gold
    secondary: '#8b5a9e',    // Purple
    success: '#00ff88',      // Green
    danger: '#ff4444',       // Red
    warning: '#ffd700',      // Yellow
    background: '#0a0511',   // Dark purple
    text: '#ffffff',         // White
    textSecondary: '#cccccc', // Light gray
    border: 'rgba(212, 165, 116, 0.4)', // Semi-transparent gold
    glass: 'rgba(10, 5, 17, 0.8)'       // Glass effect background
  },
  
  // Game-specific settings (customize for your game)
  gameSpecific: {
    // Example for a dice game
    dice: {
      sides: 6,
      animationRotations: 5,
      winConditions: [1, 2, 3, 4, 5, 6]
    },
    
    // Example for a card game
    cards: {
      deckSize: 52,
      suits: ['hearts', 'diamonds', 'clubs', 'spades'],
      values: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    },
    
    // Example for a slots game
    slots: {
      reels: 3,
      symbols: ['🍒', '🍋', '🍊', '🍇', '⭐', '💎'],
      paylines: 1,
      spinDuration: 2000
    }
  },
  
  // Performance settings
  performance: {
    targetFPS: 60,
    enableVSync: true,
    enableGPUAcceleration: true,
    maxParticles: 100,
    enableDebugMode: false
  },
  
  // Mobile-specific settings
  mobile: {
    enableTouchControls: true,
    enableHapticFeedback: true,
    preventScroll: true,
    enableFullscreen: false,
    touchSensitivity: 1.0
  },
  
  // Multiplayer settings (if applicable)
  multiplayer: {
    enabled: false,
    maxPlayers: 4,
    roomTimeout: 300000, // 5 minutes
    turnTimeout: 30000,  // 30 seconds
    enableChat: true,
    enableSpectators: false
  },
  
  // Development settings
  development: {
    enableConsoleLogging: true,
    enablePerformanceMonitoring: true,
    showFPSCounter: false,
    enableHotReload: true,
    mockGameResults: false // Set to true for testing without real bets
  }
} as const

// Type-safe access to config values
export type GameConfigType = typeof GAME_CONFIG

// Helper functions for config access
export const getGameConfig = () => GAME_CONFIG
export const getCanvasConfig = () => GAME_CONFIG.canvas
export const getBettingConfig = () => GAME_CONFIG.betting
export const getAnimationConfig = () => GAME_CONFIG.animation
export const getAudioConfig = () => GAME_CONFIG.audio
export const getColorScheme = () => GAME_CONFIG.colors

// Environment-specific overrides
const ENV_OVERRIDES = {
  development: {
    development: {
      enableConsoleLogging: true,
      showFPSCounter: true,
      enableHotReload: true
    }
  },
  production: {
    development: {
      enableConsoleLogging: false,
      showFPSCounter: false,
      enableHotReload: false
    },
    performance: {
      enableDebugMode: false
    }
  }
}

// Apply environment-specific overrides
const currentEnv = process.env.NODE_ENV || 'development'
export const RUNTIME_CONFIG = {
  ...GAME_CONFIG,
  ...ENV_OVERRIDES[currentEnv as keyof typeof ENV_OVERRIDES]
}