export { default as SOUND_FINISH } from './finish.mp3'
export { default as SOUND_TICK } from './tick.mp3'
export { default as SOUND_WIN } from './win.mp3'
export { default as SOUND_STEP } from './axe.mp3'
export { default as SOUND_EXPLODE } from './explode.mp3'

export const GRID_SIZE = 16
export const PITCH_INCREASE_FACTOR = 1.06
export const MINE_SELECT = [1, 3, 5, 10, 15]

// Progressive system caps
export const PROGRESSIVE_CAPS = {
  multiplier: [
    1.25,  // Level 0: Standard first-click multiplier
    1.2,   // Level 1: Slight reduction
    1.15,  // Level 2: Still exciting
    1.12,  // Level 3: Moderate
    1.1,   // Level 4: Conservative
    1.08   // Level 5+: Safe long-term multiplier
  ],
  // Percentage of initial wager allowed for increase
  wagerPercent: [
    100,   // Level 0: Initial wager
    130,   // Level 1: +30%
    150,   // Level 2: +50%
    170,   // Level 3: +70%
    180,   // Level 4: +80%
    190    // Level 5+: +90%
  ],
  // Absolute maximum wager increases (in SOL)
  wagerMaxIncrease: [
    0,     // Level 0: Initial wager
    2,     // Level 1: Max +2 SOL
    3,     // Level 2: Max +3 SOL
    3.5,   // Level 3: Max +3.5 SOL
    4,     // Level 4: Max +4 SOL
    4.5    // Level 5+: Max +4.5 SOL
  ]
} as const
