export { default as SOUND_LOSE } from './assets/lose.mp3'
export { default as SOUND_PLAY } from './assets/insert.mp3'
export { default as SOUND_REVEAL_LEGENDARY } from './assets/reveal-legendary.mp3'
export { default as SOUND_REVEAL_MYTHICAL } from './assets/reveal-legendary.mp3'
export { default as SOUND_REVEAL } from './assets/reveal.mp3'
export { default as SOUND_SPIN } from './assets/spin.mp3'
export { default as SOUND_WIN } from './assets/win.mp3'

import IMAGE_DGHRT from './assets/slot-dghrt.webp'
import IMAGE_SOL from './assets/slot-sol.webp'
import IMAGE_USDC from './assets/slot-usdc.webp'
import IMAGE_JUP from './assets/slot-jup.webp'
import IMAGE_BONK from './assets/slot-bonk.webp'
import IMAGE_MYTHICAL from './assets/slot-mythical.webp'
import IMAGE_LEGENDARY from './assets/slot-legendary.webp'
import IMAGE_WOJAK from './assets/slot-wojak.webp'
import { BET_ARRAYS, SLOTS_CONFIG } from '../rtpConfig'

export interface SlotItem {
  multiplier: number
  image: string
}

// Map symbol names to images
const SYMBOL_IMAGES: Record<string, string> = {
  MYTHICAL: IMAGE_MYTHICAL,
  LEGENDARY: IMAGE_LEGENDARY,
  DGHRT: IMAGE_DGHRT,
  SOL: IMAGE_SOL,
  USDC: IMAGE_USDC,
  JUP: IMAGE_JUP,
  BONK: IMAGE_BONK,
  WOJAK: IMAGE_WOJAK,
}

// Build SLOT_ITEMS directly from rtpConfig symbols array
export const SLOT_ITEMS: SlotItem[] = BET_ARRAYS.slots.symbols.map((symbol: any) => ({
  multiplier: symbol.multiplier,
  image: SYMBOL_IMAGES[symbol.name] || '',
}))

// Slot modes configuration 
export type SlotMode = 'classic' | 'wide'

// Mode configurations
const SLOT_MODES = {
  classic: { NUM_REELS: 4, NUM_ROWS: 3, NUM_PAYLINES: 1 },
  wide: { NUM_REELS: 6, NUM_ROWS: 3, NUM_PAYLINES: 1 }
}

// Default mode configuration (classic 4x3)
export const DEFAULT_SLOT_MODE: SlotMode = 'classic'

// Helper functions for mode-based values
export const getNumReels = (mode: SlotMode) => SLOT_MODES[mode].NUM_REELS
export const getNumRows = (mode: SlotMode) => SLOT_MODES[mode].NUM_ROWS
export const getNumPaylines = (mode: SlotMode) => SLOT_MODES[mode].NUM_PAYLINES
export const getNumSlots = (mode: SlotMode) => getNumReels(mode) * getNumRows(mode)

// Default values (classic mode: 4x3)
export const NUM_REELS = SLOT_MODES[DEFAULT_SLOT_MODE].NUM_REELS
export const NUM_ROWS = SLOT_MODES[DEFAULT_SLOT_MODE].NUM_ROWS  
export const NUM_PAYLINES = SLOT_MODES[DEFAULT_SLOT_MODE].NUM_PAYLINES
export const NUM_SLOTS = NUM_REELS * NUM_ROWS
// MS that it takes for spin to finish and reveal to start
export const SPIN_DELAY = 1500
// MS between each slot reveal
export const REVEAL_SLOT_DELAY = 300
// MS after reveal until win / lose effect is played
export const FINAL_DELAY = 500
//
export const LEGENDARY_THRESHOLD = SLOTS_CONFIG.LEGENDARY_THRESHOLD
