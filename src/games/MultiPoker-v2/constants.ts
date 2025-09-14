// Sound imports
export { default as SOUND_LOSE } from './sounds/lose.mp3'
export { default as SOUND_PLAY } from './sounds/play.mp3'
export { default as SOUND_WIN } from './sounds/win.mp3'
export { default as SOUND_CARD } from './sounds/card.mp3'
export { default as SOUND_JACKPOT } from './sounds/win2.mp3'

// Canvas dimensions for MultiPoker-v2
export const CANVAS_WIDTH = 1200
export const CANVAS_HEIGHT = 800

// Card dimensions and layout - adjusted for better card proportions
export const CARD_WIDTH = 150  // Reduced width to make cards less square
export const CARD_HEIGHT = 300 // Slightly reduced height 
export const CARD_SPACING = 18  // Increased spacing to compensate for narrower cards
export const CARD_REVEAL_DURATION = 300

// Poker suits and ranks
export const SUITS = ['♠', '♥', '♦', '♣']

export const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2']

// Romantic degen colors
export const ROMANTIC_COLORS = {
  gold: '#d4a574',
  crimson: '#b8336a',
  purple: '#8b5a9e',
  background: '#0a0511',
  light: '#f4e9e1',
  dark: '#1a1a1a'
}

// Animation constants
export const ANIMATION_DURATION = 2000
export const PARTICLE_LIFETIME = 120
export const CARD_FLIP_SPEED = 0.3

// Game modes
export type GameMode = 'single' | 'chain' | 'progressive'

// Hand types for visual effects
export const HAND_COLORS: Record<string, string> = {
  'Royal Flush': '#ffd700',
  'Straight Flush': '#ff6b6b',
  'Four of a Kind': '#e53935',
  'Full House': '#8e24aa',
  'Flush': '#1976d2',
  'Straight': '#43a047',
  'Three of a Kind': '#ff9800',
  'Two Pair': '#fb8c00',
  'Pair': '#795548',
  'High Card': '#607d8b'
}
