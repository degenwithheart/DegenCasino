import { PROGRESSIVE_POKER_CONFIG } from '../rtpConfig'

export const SUITS = [
  { symbol: '♠', color: '#222' },
  { symbol: '♥', color: '#e53935' },
  { symbol: '♦', color: '#039be5' },
  { symbol: '♣', color: '#43a047' },
]

export const RANKS = [
  'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'
]

export const HAND_TYPES = PROGRESSIVE_POKER_CONFIG.HAND_TYPES
export const BET_ARRAY = PROGRESSIVE_POKER_CONFIG.betArray

export { default as SOUND_LOSE } from './sounds/lose.mp3'
export { default as SOUND_PLAY } from './sounds/play.mp3'
export { default as SOUND_WIN } from './sounds/win.mp3'
export { default as SOUND_CARD } from './sounds/card.mp3'
export { default as SOUND_JACKPOT } from './sounds/win2.mp3'
