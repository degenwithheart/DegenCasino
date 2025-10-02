// Canvas dimensions
export const CANVAS_WIDTH = 1200
export const CANVAS_HEIGHT = 800

// Color scheme - romantic casino colorScheme with degen background system
export const ROMANTIC_COLORS = {
  background: '#1a0f2e',
  dark: '#2a1810',
  gold: '#d4a574',
  purple: '#8b5a9e',
  crimson: '#b8336a',
  bg: {
    default: '#1a0f2e',
    win: '#50c878',
    lose: '#e74c3c'
  },
  text: {
    primary: '#ffffff',
    secondary: '#d4a574'
  },
  accent: '#8b5a9e'
} as const

// Game configuration
export const FLIP_SETTINGS = {
  MAX_COINS: 8,
  MIN_COINS: 1,
  DEFAULT_COINS: 1,
  DEFAULT_TARGET: 1
} as const

// Bet configuration
export const SIDES = {
  heads: [2, 0],
  tails: [0, 2],
} as const

export type Side = keyof typeof SIDES

export const WAGER_OPTIONS = [1, 5, 10, 50, 100] as const