// BlackJack V2 Game Constants

// Canvas dimensions
export const CANVAS_WIDTH = 1200
export const CANVAS_HEIGHT = 800

// Card dimensions
export const CARD_WIDTH = 100
export const CARD_HEIGHT = 200
export const CARD_SPACING = 20

// Sound paths
export const SOUND_WIN = '/sounds/win.mp3'
export const SOUND_LOSE = '/sounds/lose.mp3'
export const SOUND_DEAL = '/sounds/deal.mp3'
export const SOUND_PLAY = '/sounds/play.mp3'

// Card back image
export const CARD_BACK_IMAGE = '/png/images/card.png'

// Game constants
export const CARD_NAMES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
export const SUIT_SYMBOLS = ['♠', '♥', '♦', '♣']
export const SUIT_COLORS = ['#000', '#e53e3e', '#e53e3e', '#000'] // Black, Red, Red, Black

// Romantic degen colors - consistent with other v2 games
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

// Game state types
export type GameState = 'idle' | 'dealing' | 'game-over'

// Card interface
export interface Card {
  rank: number // 0=Ace, 1=2, 2=3, ..., 12=King
  suit: number // 0=Spades, 1=Hearts, 2=Diamonds, 3=Clubs
}
