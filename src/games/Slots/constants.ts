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
}

const slotItem = (multiplier: number, ...icons: string[]): SlotItem[] =>
  icons.map((image) => ({ multiplier, image }))

export const SLOT_ITEMS = [
  slotItem(7, 'unicorn', IMAGE_UNICORN),  // Keep unicorn as highest multiplier
  slotItem(5, 'dghrt', IMAGE_DGHRT),      // DGHRT token  
  slotItem(3, 'sol', IMAGE_SOL),          // SOL token
  slotItem(2, 'usdc', IMAGE_USDC),        // USDC token
  slotItem(1, 'jup', IMAGE_JUP),          // JUP token
  slotItem(1, 'bonk', IMAGE_BONK),        // BONK token
  slotItem(0.5, 'wojak', IMAGE_WOJAK),    // Keep wojak as lowest
].flat()

export const NUM_SLOTS = 3
// MS that it takes for spin to finish and reveal to start
export const SPIN_DELAY = 1000
// MS between each slot reveal
export const REVEAL_SLOT_DELAY = 500
// MS after reveal until win / lose effect is played
export const FINAL_DELAY = 500
//
export const LEGENDARY_THRESHOLD = 5
