export { default as SOUND_LOSE } from './assets/lose.mp3'
export { default as SOUND_PLAY } from './assets/insert.mp3'
export { default as SOUND_REVEAL_LEGENDARY } from './assets/reveal-legendary.mp3'
export { default as SOUND_REVEAL_MYTHICAL } from './assets/reveal-legendary.mp3'
export { default as SOUND_REVEAL } from './assets/reveal.mp3'
export { default as SOUND_SPIN } from './assets/spin.mp3'
export { default as SOUND_WIN } from './assets/win.mp3'

import IMAGE_DGHRT from './assets/slot-dghrt.png'
import IMAGE_SOL from './assets/slot-sol.png'
import IMAGE_USDC from './assets/slot-usdc.png'
import IMAGE_JUP from './assets/slot-jup.png'
import IMAGE_BONK from './assets/slot-bonk.png'
import IMAGE_MYTHICAL from './assets/slot-mythical.png'
import IMAGE_LEGENDARY from './assets/slot-legendary.png'
import IMAGE_WOJAK from './assets/slot-wojak.png'
import { BET_ARRAYS } from '../rtpConfig'

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

import { SLOTS_CONFIG } from '../rtpConfig'
export const NUM_REELS = SLOTS_CONFIG.NUM_REELS
export const NUM_ROWS = SLOTS_CONFIG.NUM_ROWS  
export const NUM_PAYLINES = SLOTS_CONFIG.NUM_PAYLINES
export const NUM_SLOTS = NUM_REELS * NUM_ROWS // Total grid cells (9)
// MS that it takes for spin to finish and reveal to start
export const SPIN_DELAY = 1500
// MS between each slot reveal
export const REVEAL_SLOT_DELAY = 300
// MS after reveal until win / lose effect is played
export const FINAL_DELAY = 500
//
export const LEGENDARY_THRESHOLD = SLOTS_CONFIG.LEGENDARY_THRESHOLD
