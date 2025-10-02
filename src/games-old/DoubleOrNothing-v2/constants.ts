// Sound imports
export { default as SOUND_LOSE } from './sounds/lose.mp3'
export { default as SOUND_PLAY } from './sounds/play.mp3'
export { default as SOUND_WIN } from './sounds/win.mp3'
export { default as SOUND_DOUBLE } from './sounds/double.mp3'
export { default as SOUND_NOTHING } from './sounds/nothing.mp3'

// Canvas dimensions for DoubleOrNothing-v2
export const CANVAS_WIDTH = 1200
export const CANVAS_HEIGHT = 800

// Game layout dimensions
export const BUTTON_WIDTH = 400
export const BUTTON_HEIGHT = 120
export const BUTTON_SPACING = 50
export const BUTTON_BORDER_RADIUS = 16

// Animation constants
export const ANIMATION_DURATION = 2000
export const PARTICLE_LIFETIME = 120
export const REVEAL_ANIMATION_SPEED = 0.05
export const GLOW_INTENSITY = 20

// Romantic degen colors
export const ROMANTIC_COLORS = {
  gold: '#d4a574',
  crimson: '#b8336a',
  purple: '#8b5a9e',
  background: '#0a0511',
  light: '#f4e9e1',
  dark: '#1a1a1a',
  nothing: '#ff4444',
  double: '#00ff55',
  triple: '#ff8800',
  degen: '#ff00ff'
}

// Button colors for different modes
export const BUTTON_COLORS = {
  double: {
    win: '#00ff55',
    lose: '#ff4444',
    inactive: '#333333',
    glow: '#00ff5540'
  },
  triple: {
    win: '#ff8800',
    lose: '#ff4444', 
    inactive: '#333333',
    glow: '#ff880040'
  },
  degen: {
    win: '#ff00ff',
    lose: '#ff4444',
    inactive: '#333333',
    glow: '#ff00ff40'
  }
}

// Game modes configuration
export const GAME_MODES = [
  { 
    label: '2x', 
    name: 'double',
    outcomes: 2,
    winLabel: 'Double!', 
    loseLabel: 'Nothing',
    color: BUTTON_COLORS.double.win,
    description: '50% chance to double your bet'
  },
  { 
    label: '3x', 
    name: 'triple',
    outcomes: 3,
    winLabel: 'Triple!', 
    loseLabel: 'Nothing',
    color: BUTTON_COLORS.triple.win,
    description: '33% chance to triple your bet'
  },
  { 
    label: '10x', 
    name: 'degen',
    outcomes: 10,
    winLabel: 'Degen!', 
    loseLabel: 'Nothing',
    color: BUTTON_COLORS.degen.win,
    description: '10% chance for 10x your bet'
  }
]

// Particle system constants
export const PARTICLE_COUNT = 50
export const PARTICLE_SPEED = 2
export const PARTICLE_SIZE = 3