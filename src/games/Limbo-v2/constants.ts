// Limbo v2 Game Constants
export const GAME_CONFIG = {
  // Canvas dimensions
  CANVAS_WIDTH: 1200,
  CANVAS_HEIGHT: 800,
  
  // Multiplier settings
  MIN_MULTIPLIER: 1.01,
  MAX_MULTIPLIER: 100.0,
  DEFAULT_MULTIPLIER: 2.0,
  
  // Multiplier display settings
  MULTIPLIER_X: 600, // Center of canvas
  MULTIPLIER_Y: 400, // Center of canvas
  
  // Slider settings
  SLIDER_X: 100,
  SLIDER_Y: 700,
  SLIDER_WIDTH: 1000,
  SLIDER_HEIGHT: 20,
  SLIDER_HANDLE_SIZE: 30,
  
  // Colors (romantic degen colorScheme)
  COLORS: {
    background: '#0f0f23',
    multiplierBackground: 'rgba(212, 165, 116, 0.1)',
    multiplierText: '#d4a574',
    multiplierGlow: '#b8336a',
    sliderTrack: 'rgba(212, 165, 116, 0.3)',
    sliderFill: '#d4a574',
    sliderHandle: '#b8336a',
    sliderHandleHover: '#8b5a9e',
    text: '#ffffff',
    textSecondary: '#d4a574',
    accent: '#b8336a',
    successGreen: '#4ade80',
    dangerRed: '#ef4444',
  },
  
  // Animation settings
  ANIMATION_DURATION: 2000, // 2 seconds
  REVEAL_DELAY: 100, // milliseconds between reveals
  
  // Particle settings
  PARTICLE_COUNT: 20,
  PARTICLE_LIFE: 60, // frames
}

export const GAME_STATES = {
  IDLE: 'idle',
  PLAYING: 'playing',
  ANIMATING: 'animating',
  COMPLETE: 'complete'
} as const

export type GameState = typeof GAME_STATES[keyof typeof GAME_STATES]

// Limbo result animation settings
export const LIMBO_ANIMATION = {
  STAGES: {
    COUNTDOWN: 'countdown',
    CLIMBING: 'climbing', 
    RESULT: 'result',
    CELEBRATION: 'celebration'
  },
  
  COUNTDOWN_DURATION: 1000,
  CLIMBING_SPEED: 0.05, // multiplier increment per frame
  RESULT_DISPLAY_DURATION: 2000,
  CELEBRATION_DURATION: 1500,
}

export const SOUND_CONFIG = {
  VOLUME: 0.3,
  TICK_FREQUENCY: 50, // milliseconds between ticks during climb
}