// Sound imports
export { default as SOUND_LOSE } from './sounds/lose.mp3'
export { default as SOUND_PLAY } from './sounds/start.mp3'
export { default as SOUND_WIN } from './sounds/win.mp3'
export { default as SOUND_GALLOP } from './sounds/gallop.mp3'
export { default as SOUND_FINISH } from './sounds/finish.mp3'

// Canvas dimensions for FancyVirtualHorseRacing-v2
export const CANVAS_WIDTH = 1200
export const CANVAS_HEIGHT = 800

// Track layout dimensions
export const TRACK_WIDTH = 1000
export const TRACK_HEIGHT = 500
export const TRACK_PADDING = 100
export const LANE_HEIGHT = 60
export const LANE_SPACING = 2

// Horse dimensions and animation
export const HORSE_WIDTH = 40
export const HORSE_HEIGHT = 30
export const HORSE_SPEED_BASE = 2
export const HORSE_SPEED_VARIANCE = 1
export const FINISH_LINE_OFFSET = 50

// Animation constants
export const ANIMATION_DURATION = 5000
export const PARTICLE_LIFETIME = 120
export const GALLOP_ANIMATION_SPEED = 0.2
export const DUST_PARTICLE_COUNT = 30

// Romantic degen colors
export const ROMANTIC_COLORS = {
  gold: '#d4a574',
  crimson: '#b8336a',
  purple: '#8b5a9e',
  background: '#0a0511',
  light: '#f4e9e1',
  dark: '#1a1a1a',
  track: '#2d5016',
  grass: '#4a7c32',
  dirt: '#8b4513',
  nothing: '#ff4444'
}

// Horse colors and names
export const HORSES = [
  { 
    name: 'Lightning Bolt', 
    color: '#ffff00', 
    odds: '10:1',
    description: 'The fastest in the west',
    emoji: '⚡'
  },
  { 
    name: 'Thunder Strike', 
    color: '#ff6600', 
    odds: '8:1',
    description: 'Strikes like lightning',
    emoji: '⛈️'
  },
  { 
    name: 'Wind Runner', 
    color: '#00ccff', 
    odds: '6:1',
    description: 'Swift as the wind',
    emoji: '💨'
  },
  { 
    name: 'Fire Storm', 
    color: '#ff3300', 
    odds: '4.5:1',
    description: 'Burns up the competition',
    emoji: '🔥'
  },
  { 
    name: 'Ocean Wave', 
    color: '#0066cc', 
    odds: '3.5:1',
    description: 'Fluid and powerful',
    emoji: '🌊'
  },
  { 
    name: 'Mountain Peak', 
    color: '#999999', 
    odds: '2.8:1',
    description: 'Solid and reliable',
    emoji: '🏔️'
  },
  { 
    name: 'Solar Flare', 
    color: '#ff9900', 
    odds: '2.2:1',
    description: 'Bright and burning',
    emoji: '☀️'
  },
  { 
    name: 'Lunar Eclipse', 
    color: '#6600cc', 
    odds: '1.8:1',
    description: 'Mysterious and dark',
    emoji: '🌙'
  }
]

// Track surface types
export const TRACK_SURFACES = {
  dirt: { color: '#8b4513', friction: 1.0 },
  grass: { color: '#4a7c32', friction: 0.95 },
  mud: { color: '#654321', friction: 0.85 }
}

// Race states
export type RaceState = 'betting' | 'starting' | 'racing' | 'finished' | 'celebrating'

// Particle system constants
export const PARTICLE_COUNT = 20
export const PARTICLE_SPEED = 1
export const PARTICLE_SIZE = 2