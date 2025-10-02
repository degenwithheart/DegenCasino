export { default as SOUND_FINISH } from './finish.mp3'
export { default as SOUND_TICK } from './tick.mp3'
export { default as SOUND_WIN } from './win.mp3'
export { default as SOUND_STEP } from './axe.mp3'
export { default as SOUND_EXPLODE } from './explode.mp3'

import { BET_ARRAYS_V3 } from '../rtpConfig-v3'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
export const GRID_SIZE = BET_ARRAYS_V3['mines'].GRID_SIZE
export const MINE_SELECT = BET_ARRAYS_V3['mines'].MINE_OPTIONS
export const PITCH_INCREASE_FACTOR = 1.06
