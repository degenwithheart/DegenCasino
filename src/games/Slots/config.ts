import { BPS_PER_WHOLE } from 'gamba-core-v2'

// Game configurations for V2 games
export const BET_ARRAYS = {
slots: {
  NUM_REELS: 6, // Match Slots111 GRID_WIDTH
  NUM_ROWS: 3,  // Match Slots111 GRID_HEIGHT
  NUM_PAYLINES: 1, // Single winning line
  LEGENDARY_THRESHOLD: 5, // Match Slots111
  // Match Slots111 simpler multiplier structure
  symbols: [
    { name: 'LEGENDARY', multiplier: 7, weight: 1 },
    { name: 'DGHRT', multiplier: 5, weight: 2 },
    { name: 'SOL', multiplier: 3, weight: 5 },
    { name: 'USDC', multiplier: 2, weight: 15 },
    { name: 'JUP', multiplier: 1, weight: 80 },
    { name: 'BONK', multiplier: 1, weight: 80 },
    { name: 'WOJAK', multiplier: 0.5, weight: 817 }, // Adjust weight for loss rate
  ],
  betArray: [
    7,   // LEGENDARY
    5, 5, // DGHRT 
    3, 3, 3, 3, 3, // SOL
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // USDC x15
    1, 1, 1, 1, 1, // JUP & BONK (combined weight 160, taking first 5)
    0.5, 0.5, 0.5, 0.5, 0.5, // WOJAK x5
    ...Array(15).fill(0), // Remaining slots filled with 0 for losses
  ]
},
  }
export const SLOTS_CONFIG = BET_ARRAYS.slots;