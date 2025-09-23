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