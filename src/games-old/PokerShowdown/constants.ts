// Constants for Poker Showdown game

// Sound effects exports - using existing casino sound files
export { default as SOUND_WIN } from '../HiLo/win.mp3'
export { default as SOUND_LOSE } from '../HiLo/lose.mp3'
export { default as SOUND_PLAY } from '../HiLo/play.mp3'
export { default as SOUND_CARD } from '../HiLo/card.mp3'

// Import multiplayer configuration
import { POKER_SHOWDOWN_CONFIG } from '../rtpConfigMultiplayer'

// Game configuration
export const CONFIG = POKER_SHOWDOWN_CONFIG

// Canvas dimensions for poker table
export const CANVAS_WIDTH = 1200
export const CANVAS_HEIGHT = 800

// Card dimensions and layout
export const CARD_WIDTH = 120
export const CARD_HEIGHT = 168
export const CARD_SPACING = 12

// Poker table layout
export const TABLE_RADIUS = 280
export const SEAT_POSITIONS = [
  { angle: 0, x: 0, y: -TABLE_RADIUS },      // Top
  { angle: 60, x: TABLE_RADIUS * 0.87, y: -TABLE_RADIUS * 0.5 },  // Top Right
  { angle: 120, x: TABLE_RADIUS * 0.87, y: TABLE_RADIUS * 0.5 },  // Bottom Right
  { angle: 180, x: 0, y: TABLE_RADIUS },     // Bottom
  { angle: 240, x: -TABLE_RADIUS * 0.87, y: TABLE_RADIUS * 0.5 }, // Bottom Left
  { angle: 300, x: -TABLE_RADIUS * 0.87, y: -TABLE_RADIUS * 0.5 }, // Top Left
]

// Colors and styling
export const POKER_COLORS = {
  table: '#0d5a2d',        // Poker table green
  felt: '#1a6b3a',         // Felt green
  gold: '#ffd700',         // Gold accents
  silver: '#c0c0c0',       // Silver accents
  cardBack: '#1a237e',     // Card back blue
  background: '#0a0a0a',   // Dark background
  text: '#ffffff',         // White text
  accent: '#ff6b35',       // Orange accent
}

// Game phases
export const GAME_PHASES = {
  WAITING: 'waiting',
  STRATEGY_SELECTION: 'strategy_selection',
  DEALING: 'dealing',
  DRAWING: 'drawing',
  SHOWDOWN: 'showdown',
  RESULTS: 'results',
} as const

// Animation timing
export const ANIMATION_TIMING = {
  CARD_DEAL: 200,          // ms between dealing cards
  CARD_FLIP: 300,          // ms for card flip animation
  DRAW_REVEAL: 400,        // ms for draw reveal
  SHOWDOWN_DELAY: 1000,    // ms before showdown starts
  RESULT_DISPLAY: 3000,    // ms to show results
}

// Strategy descriptions
export const STRATEGY_DESCRIPTIONS = {
  CONSERVATIVE: 'Keep strong hands, avoid risky draws. Best for steady play.',
  BALANCED: 'Mix of safety and opportunity. Draw to strong flush chances.',
  AGGRESSIVE: 'Always try to improve. High risk, high reward strategy.',
  CUSTOM: 'Create your own strategy with custom rules.',
}

export type GamePhase = typeof GAME_PHASES[keyof typeof GAME_PHASES]