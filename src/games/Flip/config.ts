/**
 * Centralized RTP (Return To Player) Configuration for DegenCasino V2 Games
 *
 * This file contains RTP configurations specifically for the V2 canvas-based games.
 * Each V2 game has its own section with customizable parameters, bet arrays, and multipliers.
 *
 * V2 Games: magic8ball (currently implemented)
 *
 * Target: 94%-97% RTP with balanced win rates for sustainable operations.
 */

import { BPS_PER_WHOLE } from 'gamba-core-v2'

// Game configurations for V2 games
export const BET_ARRAYS_V2 = {
  'flip': {
    calculateBetArray: (n: number, k: number, face: 'heads' | 'tails') => {
      const outcomes = n + 1
      const betArray = Array(outcomes).fill(0)
      
      // Binomial coefficient calculation
      const binomial = (n: number, k: number): number => {
        if (k < 0 || k > n) return 0
        k = Math.min(k, n - k)
        let c = 1
        for (let i = 0; i < k; i++) {
          c = c * (n - i) / (i + 1)
        }
        return c
      }
      
      // Probability of exactly m heads
      const probExact = (m: number) => binomial(n, m) * Math.pow(0.5, n)
      
      // Probability of at least k of chosen face
      let p = 0
      for (let m = k; m <= n; m++) {
        p += probExact(m)
      }
      
      if (p === 0) return betArray // impossible outcome
      
      const fairMultiplier = 1 / p
      const houseMultiplier = fairMultiplier * 0.96 // 96% RTP target
      
      // For 'heads', winning if at least k heads (indices k to n)
      // For 'tails', winning if at least k tails, i.e., at most n-k heads (indices 0 to n-k)
      if (face === 'heads') {
        for (let m = k; m <= n; m++) {
          const probM = probExact(m)
          betArray[m] = houseMultiplier
        }
      } else {
        for (let m = 0; m <= n - k; m++) {
          const probM = probExact(m)
          betArray[m] = houseMultiplier
        }
      }
      
      return betArray
    },
    
    // Helper functions for probability calculations
    probAtLeast: (n: number, k: number, p = 0.5) => {
      const binomial = (n: number, k: number): number => {
        if (k < 0 || k > n) return 0
        k = Math.min(k, n - k)
        let c = 1
        for (let i = 0; i < k; i++) {
          c = c * (n - i) / (i + 1)
        }
        return c
      }
      
      let sum = 0
      for (let i = k; i <= n; i++) {
        sum += binomial(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i)
      }
      return sum
    },
    
    computeMultiplier: (prob: number, houseEdge = 0.04) => {
      if (prob <= 0) return 0
      return (1 - houseEdge) / prob
    }
  },
} as const

export type BetArrayV2Key = keyof typeof BET_ARRAYS_V2