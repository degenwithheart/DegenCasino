export { default as SOUND_LOSE } from './assets/lose.mp3'
export { default as SOUND_PLAY } from './assets/insert.mp3'
export { default as SOUND_REVEAL_LEGENDARY } from './assets/reveal-legendary.mp3'
export { default as SOUND_REVEAL } from './assets/reveal.mp3'
export { default as SOUND_SPIN } from './assets/spin.mp3'
export { default as SOUND_WIN } from './assets/win.mp3'

import IMAGE_USDC from './assets/slot-usdc.webp'
import IMAGE_SOL from './assets/slot-sol.webp'
import IMAGE_DGHRT from './assets/slot-dghrt.webp'
import IMAGE_JUP from './assets/slot-jup.webp'
import IMAGE_BONK from './assets/slot-bonk.webp'
import IMAGE_LEGENDARY from './assets/slot-legendary.webp'
import IMAGE_WOJAK from './assets/slot-wojak.webp'

export interface SlotItem {
  multiplier: number
  image: string
}

const slotItem = (multiplier: number, ...icons: string[]): SlotItem[] =>
  icons.map((image) => ({ multiplier, image }))

export const SLOT_ITEMS = [
  slotItem(7, IMAGE_LEGENDARY),
  slotItem(5, IMAGE_DGHRT),
  slotItem(3, IMAGE_SOL),
  slotItem(2, IMAGE_USDC),
  slotItem(1, IMAGE_BONK, IMAGE_JUP),
  slotItem(.5, IMAGE_WOJAK),
].flat()

export const GRID_WIDTH = 6
export const GRID_HEIGHT = 3
export const NUM_SLOTS = GRID_WIDTH * GRID_HEIGHT
// MS that it takes for spin to finish and reveal to start
export const SPIN_DELAY = 1000
// MS between each slot reveal
export const REVEAL_SLOT_DELAY = 200 // Reduced for better UX with more slots
// MS after reveal until win / lose effect is played
export const FINAL_DELAY = 500
//
export const LEGENDARY_THRESHOLD = 5
