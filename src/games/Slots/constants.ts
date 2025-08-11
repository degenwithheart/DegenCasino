export { default as SOUND_LOSE } from './assets/lose.mp3'
export { default as SOUND_PLAY } from './assets/insert.mp3'
export { default as SOUND_REVEAL_LEGENDARY } from './assets/reveal-legendary.mp3'
export { default as SOUND_REVEAL } from './assets/reveal.mp3'
export { default as SOUND_SPIN } from './assets/spin.mp3'
export { default as SOUND_WIN } from './assets/win.mp3'

import IMAGE_DGHRT from './assets/slot-dghrt.png'
import IMAGE_SOL from './assets/slot-sol.png'
import IMAGE_USDC from './assets/slot-usdc.png'
import IMAGE_JUP from './assets/slot-jup.png'
import IMAGE_BONK from './assets/slot-bonk.png'
import IMAGE_UNICORN from './assets/slot-unicorn.png'
import IMAGE_WOJAK from './assets/slot-wojak.png'

export interface SlotItem {
  multiplier: number
  image: string
  id: string // Add identifier for winning logic
}

const slotItem = (multiplier: number, id: string, ...icons: string[]): SlotItem[] =>
  icons.map((image) => ({ multiplier, image, id }))

export const SLOT_ITEMS = [
  slotItem(7, 'unicorn', IMAGE_UNICORN),  // Keep unicorn as highest multiplier
  slotItem(5, 'dghrt', IMAGE_DGHRT),      // DGHRT token  
  slotItem(3, 'sol', IMAGE_SOL),          // SOL token
  slotItem(2, 'usdc', IMAGE_USDC),        // USDC token
  slotItem(1, 'jup', IMAGE_JUP),          // JUP token
  slotItem(1, 'bonk', IMAGE_BONK),        // BONK token
  slotItem(0.5, 'wojak', IMAGE_WOJAK),    // Keep wojak as lowest
].flat()

export const NUM_REELS = 6 // Number of vertical reels
export const NUM_ROWS = 3 // Visible positions per reel
export const TOTAL_POSITIONS = NUM_REELS * NUM_ROWS // 18 total positions
export const MIN_MATCH = 6 // Minimum matching symbols for a win
export const MAX_MATCH = 6 // Maximum matching symbols (all reels)

// For backwards compatibility
export const NUM_SLOTS = NUM_REELS

/* 
 * REEL-BASED SYSTEM:
 * - Each reel has a predefined symbol strip that it cycles through
 * - 6 reels total, each with its own fixed symbol sequence
 * - Each reel shows 3 consecutive symbols from its strip
 * - Reels stop sequentially from left to right (not individual positions)
 * - Position mapping: Row 0 = positions 0-5, Row 1 = positions 6-11, Row 2 = positions 12-17
 * - Traditional slot machine behavior with authentic reel mechanics
 */

// Define the symbol strips for each reel (longer sequences for variety)
export const REEL_STRIPS = [
  // Reel 1
  ['unicorn', 'wojak', 'bonk', 'usdc', 'jup', 'sol', 'dghrt', 'wojak', 'bonk', 'usdc', 'jup', 'sol'],
  // Reel 2  
  ['bonk', 'usdc', 'unicorn', 'wojak', 'dghrt', 'jup', 'sol', 'bonk', 'usdc', 'wojak', 'jup', 'sol'],
  // Reel 3
  ['usdc', 'jup', 'bonk', 'sol', 'wojak', 'unicorn', 'dghrt', 'usdc', 'jup', 'bonk', 'wojak', 'sol'],
  // Reel 4
  ['jup', 'sol', 'wojak', 'bonk', 'dghrt', 'usdc', 'unicorn', 'jup', 'sol', 'wojak', 'bonk', 'usdc'],
  // Reel 5
  ['sol', 'bonk', 'dghrt', 'jup', 'usdc', 'wojak', 'unicorn', 'sol', 'bonk', 'jup', 'usdc', 'wojak'],
  // Reel 6
  ['dghrt', 'wojak', 'usdc', 'unicorn', 'jup', 'bonk', 'sol', 'dghrt', 'wojak', 'usdc', 'jup', 'bonk']
]

// Define paylines (arrays of position indices) for 6 reels x 3 rows
export const PAYLINES = [
  // Horizontal lines
  [0, 1, 2, 3, 4, 5],     // Top row (reel positions 0)
  [6, 7, 8, 9, 10, 11],   // Middle row (reel positions 1)  
  [12, 13, 14, 15, 16, 17], // Bottom row (reel positions 2)
  
  // Diagonal lines
  [0, 7, 14, 9, 4, 17],   // Zigzag 1
  [12, 7, 2, 9, 16, 5],   // Zigzag 2
  
  // V-shaped lines
  [0, 7, 14, 15, 16, 17], // V-shape 1
  [12, 7, 2, 3, 4, 5],    // Inverted V
  
  // Additional patterns
  [6, 1, 8, 3, 10, 5],    // Wave pattern 1
  [6, 13, 8, 15, 10, 11], // Wave pattern 2
]

// Define winning patterns and their multipliers (now based on paylines)
export const WINNING_PATTERNS = {
  6: {
    unicorn: 7,    // 6 unicorns on a payline = 7x (from SLOT_ITEMS)
    dghrt: 5,      // 6 DGHRT on a payline = 5x
    sol: 3,        // 6 SOL on a payline = 3x
    usdc: 2,       // 6 USDC on a payline = 2x
    jup: 1,        // 6 JUP on a payline = 1x
    bonk: 1,       // 6 BONK on a payline = 1x
    wojak: 0.5,    // 6 wojak on a payline = 0.5x
  }
}

// Scatter win multipliers (anywhere on grid, not on payline)
export const SCATTER_PATTERNS = {
  6: { unicorn: 14 }, // 6 unicorns anywhere = 14x (2x base multiplier for scatter)
}

// MS that it takes for spin to finish and reveal to start
export const SPIN_DELAY = 1000
// MS between each reel reveal (not individual slots)
export const REVEAL_REEL_DELAY = 400
// MS after reveal until win / lose effect is played
export const FINAL_DELAY = 500
//
export const LEGENDARY_THRESHOLD = 5
