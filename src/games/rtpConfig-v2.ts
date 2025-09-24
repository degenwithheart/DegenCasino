/**
 * Centralized RTP (Return To Player) Configuration for DegenCasino V2 Games
 *
 * This file contains RTP configurations specifically for the V2 canvas-based games.
 * Each V2 game has its own section with customizable parameters, bet arrays, and multipliers.
 *
 * V2 Games: dice-v2 (currently implemented)
 *
 * Target: 94%-97% RTP with balanced win rates for sustainable operations.
 */

import { BPS_PER_WHOLE } from 'gamba-core-v2'

// RTP_TARGETS for V2 games (can be adjusted independently from V1)
export const RTP_TARGETS_V2 = {
  'dice-v2': 0.95,        // Lucky Number: 5% house edge
  'multipoker-v2': 0.96,  // Multi Poker: 4% house edge
  'flip-v2': 0.96,        // Flip V2: 4% house edge
  'blackjack-v2': 0.97,   // BlackJack V2: 3% house edge
  'mines-v2': 0.96,       // Mines V2: 4% house edge
  'cryptochartgame-v2': 0.95, // Crypto Chart Game V2: 5% house edge
  'doubleornothing-v2': 0.94, // Double or Nothing V2: 6% house edge
  'fancyvirtualhorseracing-v2': 0.95, // Fancy Virtual Horse Racing V2: 5% house edge
  'keno-v2': 0.95,        // Keno V2: 5% house edge
  'limbo-v2': 0.95,       // Limbo V2: 5% house edge
} as const

export type GameV2Key = keyof typeof RTP_TARGETS_V2

// Game configurations for V2 games
export const BET_ARRAYS_V2 = {
  'dice-v2': {
    OUTCOMES: 100, // 0-99 like original dice (game logic requires exactly 100)
    outcomes: Array.from({length: 100}, (_, i) => i), // [0, 1, 2, ..., 99]
    calculateBetArray: (rollUnder: number) => {
      // Generate bet array for a given roll-under value (1-99)
      const OUTCOMES = 100;
      const betArray = Array(OUTCOMES).fill(0);
      if (rollUnder > 0 && rollUnder <= 100) {
        const winProbability = rollUnder / 100;
        const fairMultiplier = 1 / winProbability;
        const houseMultiplier = fairMultiplier * RTP_TARGETS_V2['dice-v2'];
        // Set winning outcomes (0 to rollUnder-1)
        for (let i = 0; i < rollUnder; i++) {
          betArray[i] = houseMultiplier;
        }
      }
      return betArray;
    },
    outcomeToText: (outcome: number) => {
      return `Roll: ${outcome}`
    }
  },
  
  'multipoker-v2': {
    calculateBetArray: () => {
      return [
        0,    // 0: Bust (High Card)
        2,    // 1: Pair  
        3,    // 2: Two Pair
        4,    // 3: Three of a Kind
        4,    // 4: Straight
        8,    // 5: Flush
        10,   // 6: Full House
        25,   // 7: Four of a Kind
        100   // 8: Royal Flush
      ]
    },
    getHandName: (index: number) => {
      const names = [
        'High Card',       // 0
        'Pair',           // 1  
        'Two Pair',       // 2
        'Three of a Kind', // 3
        'Straight',       // 4
        'Flush',          // 5
        'Full House',     // 6
        'Four of a Kind', // 7
        'Royal Flush'     // 8
      ]
      return names[index] || 'Unknown'
    }
  },

  'flip-v2': {
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
          betArray[m] = houseMultiplier * outcomes * probM
        }
      } else {
        for (let m = 0; m <= n - k; m++) {
          const probM = probExact(m)
          betArray[m] = houseMultiplier * outcomes * probM
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

  'blackjack-v2': {
    calculateBetArray: () => {
      return [
        0,    // 0: Player Bust/Lose (45% chance)
        1.85, // 1: Player Win (42% chance) 
        2.30, // 2: Player BlackJack (5% chance)
        1.0   // 3: Push/Tie (8% chance)
      ]
    },
    getOutcomeName: (index: number) => {
      const names = [
        'Player Lose',    // 0
        'Player Win',     // 1
        'BlackJack!',     // 2
        'Push'            // 3
      ]
      return names[index] || 'Unknown'
    },
    // Card hand calculation utilities
    calculateHandValue: (cards: Array<{ rank: number; suit: number }>) => {
      let value = 0
      let aces = 0
      
      cards.forEach(card => {
        if (card.rank === 0) { // Ace
          aces++
          value += 11
        } else if (card.rank >= 10) { // Face cards (J, Q, K)
          value += 10
        } else {
          value += card.rank + 1 // 2-10
        }
      })
      
      // Adjust for aces
      while (value > 21 && aces > 0) {
        value -= 10
        aces--
      }
      
      return value
    },
    isBlackjack: (cards: Array<{ rank: number; suit: number }>) => {
      return cards.length === 2 && BET_ARRAYS_V2['blackjack-v2'].calculateHandValue(cards) === 21
    },
    isBust: (cards: Array<{ rank: number; suit: number }>) => {
      return BET_ARRAYS_V2['blackjack-v2'].calculateHandValue(cards) > 21
    }
  },

  'mines-v2': {
    GRID_SIZE: 25, // 5x5 grid
    MINE_SELECT: [1, 3, 5, 10, 15, 20], // Available mine counts
    
    calculateBetArray: (mineCount: number, revealedSafe: number) => {
      const gridSize = 25
      const safeSpots = gridSize - mineCount
      
      // Calculate probability of revealing X safe spots without hitting a mine
      let prob = 1
      for (let i = 0; i < revealedSafe; i++) {
        prob *= (safeSpots - i) / (gridSize - i)
      }
      
      if (prob <= 0) return Array(gridSize + 1).fill(0)
      
      // Calculate multiplier for this number of safe reveals
      const houseEdge = 0.04 // 4% house edge for 96% RTP
      const multiplier = (1 - houseEdge) / prob
      
      // Create bet array where only the winning outcome has the multiplier
      const betArray = Array(gridSize + 1).fill(0)
      betArray[revealedSafe] = multiplier
      
      return betArray
    },
    
    getMultiplier: (mineCount: number, revealedSafe: number) => {
      const gridSize = 25
      const safeSpots = gridSize - mineCount
      
      let prob = 1
      for (let i = 0; i < revealedSafe; i++) {
        prob *= (safeSpots - i) / (gridSize - i)
      }
      
      if (prob <= 0) return 0
      
      const houseEdge = 0.04
      return (1 - houseEdge) / prob
    },
    
    // Calculate next multiplier if player continues
    getNextMultiplier: (mineCount: number, currentRevealed: number) => {
      return BET_ARRAYS_V2['mines-v2'].getMultiplier(mineCount, currentRevealed + 1)
    }
  },

  'cryptochartgame-v2': {
    calculateBetArray: (targetMultiplier: number) => {
      // Use Gamba's BPS_PER_WHOLE for precise calculations
      const OUTCOMES = BPS_PER_WHOLE
      const betArray = Array(OUTCOMES).fill(0)
      
      // Calculate win probability based on target multiplier
      // Higher targets = lower win probability
      const baseProbability = 0.5
      const difficultyFactor = Math.max(0.1, 1 / Math.log(targetMultiplier + 1))
      const winProbability = Math.min(0.9, baseProbability * difficultyFactor)
      
      const winOutcomes = Math.floor(OUTCOMES * winProbability)
      const houseEdge = 1 - RTP_TARGETS_V2['cryptochartgame-v2']
      const fairMultiplier = 1 / winProbability
      const adjustedMultiplier = fairMultiplier * (1 - houseEdge)
      
      // Set winning outcomes
      for (let i = 0; i < winOutcomes; i++) {
        betArray[i] = adjustedMultiplier
      }
      
      return betArray
    },
    outcomeToText: (outcome: number, targetMultiplier: number) => {
      const OUTCOMES = BPS_PER_WHOLE
      const winProbability = Math.min(0.9, 0.5 * Math.max(0.1, 1 / Math.log(targetMultiplier + 1)))
      const winOutcomes = Math.floor(OUTCOMES * winProbability)
      
      if (outcome < winOutcomes) {
        return `MOON 🚀 (${targetMultiplier.toFixed(2)}x)`
      } else {
        return `RUGGED 💥 (${(1 + Math.random() * (targetMultiplier - 1)).toFixed(2)}x)`
      }
    }
  },

  'doubleornothing-v2': {
    calculateBetArray: (mode: number) => {
      const modes = [
        { multiplier: 1.88, outcomes: 2 }, // 2x mode with 6% house edge
        { multiplier: 2.82, outcomes: 3 }, // 3x mode with 6% house edge  
        { multiplier: 9.4, outcomes: 10 }  // 10x mode with 6% house edge
      ]
      
      const selectedMode = modes[mode] || modes[0]
      const betArray = Array(selectedMode.outcomes).fill(0)
      
      // Last outcome wins with the multiplier
      betArray[selectedMode.outcomes - 1] = selectedMode.multiplier
      
      return betArray
    },
    getModeName: (mode: number) => {
      const names = ['2x', '3x', '10x']
      return names[mode] || '2x'
    },
    getModeLabels: (mode: number) => {
      const labels = [
        ['Double!', 'Nothing'],
        ['Triple!', 'Nothing'],
        ['Degen!', 'Nothing']
      ]
      return labels[mode] || labels[0]
    }
  },

  'fancyvirtualhorseracing-v2': {
    calculateBetArray: () => {
      // 8 horses with varying odds
      const baseMultipliers = [10, 8, 6, 4.5, 3.5, 2.8, 2.2, 1.8]
      const houseEdge = 1 - RTP_TARGETS_V2['fancyvirtualhorseracing-v2']
      
      return baseMultipliers.map(multiplier => multiplier * (1 - houseEdge))
    },
    getHorseName: (index: number) => {
      const names = [
        'Lightning Bolt', 'Thunder Strike', 'Wind Runner', 'Fire Storm',
        'Ocean Wave', 'Mountain Peak', 'Solar Flare', 'Lunar Eclipse'
      ]
      return names[index] || `Horse ${index + 1}`
    },
    getHorseOdds: (index: number) => {
      const odds = ['10:1', '8:1', '6:1', '4.5:1', '3.5:1', '2.8:1', '2.2:1', '1.8:1']
      return odds[index] || '1:1'
    }
  },

  'keno-v2': {
    GRID_SIZE: 40,
    MAX_SELECTION: 10,
    DRAW_COUNT: 10, // Numbers drawn per game
    
    calculateBetArray: (selectedCount: number) => {
      // Keno payouts based on how many selected numbers match drawn numbers
      const outcomes = selectedCount + 1 // 0 to selectedCount matches
      const betArray = Array(outcomes).fill(0)
      
      if (selectedCount === 0) return betArray
      
      const houseEdge = 1 - RTP_TARGETS_V2['keno-v2']
      
      // Paytable for different hit counts (simplified for v2)
      const payouts = {
        1: [0, 3],                    // 1 selected: 0 hits = 0x, 1 hit = 3x
        2: [0, 1, 9],                 // 2 selected: 0=0x, 1=1x, 2=9x
        3: [0, 1, 2, 16],             // 3 selected: 0=0x, 1=1x, 2=2x, 3=16x
        4: [0, 0.5, 2, 6, 25],        // 4 selected: and so on...
        5: [0, 0.5, 1, 3, 15, 50],
        6: [0, 0.5, 1, 2, 3, 30, 75],
        7: [0, 0.5, 0.5, 1, 6, 12, 36, 100],
        8: [0, 0.5, 0.5, 1, 2, 4, 20, 80, 500],
        9: [0, 0.5, 0.5, 1, 1, 5, 10, 50, 200, 1000],
        10: [0, 0, 0.5, 1, 2, 5, 15, 40, 100, 250, 1800]
      }
      
      const basePayout = payouts[selectedCount as keyof typeof payouts] || payouts[1]
      
      // Apply house edge
      for (let i = 0; i < Math.min(basePayout.length, outcomes); i++) {
        betArray[i] = basePayout[i] * (1 - houseEdge)
      }
      
      return betArray
    },
    
    getHitCountText: (hits: number, selected: number) => {
      if (hits === 0) return 'No Hits'
      if (hits === selected) return `Perfect! ${hits}/${selected}`
      return `${hits}/${selected} Hits`
    }
  },

  'limbo-v2': {
    calculateBetArray: (targetMultiplier: number) => {
      // Limbo: try to reach target multiplier
      // Simple bet array where win occurs if random value >= target
      const outcomes = BPS_PER_WHOLE // Use Gamba's standard for precise calculations
      const betArray = Array(outcomes).fill(0)
      
      // Calculate win probability (simplified limbo mechanics)
      const winProbability = 1 / targetMultiplier
      const winOutcomes = Math.floor(outcomes * winProbability)
      
      const houseEdge = 1 - RTP_TARGETS_V2['limbo-v2']
      const adjustedMultiplier = targetMultiplier * (1 - houseEdge)
      
      // Set winning outcomes (first X outcomes win)
      for (let i = 0; i < winOutcomes; i++) {
        betArray[i] = adjustedMultiplier
      }
      
      return betArray
    },
    
    calculateResultMultiplier: (resultIndex: number, targetMultiplier: number, won: boolean) => {
      if (won) {
        // Winner gets target + some bonus - use BPS_PER_WHOLE for consistency
        const bonus = (resultIndex % BPS_PER_WHOLE) / (BPS_PER_WHOLE * 5) // 0-0.2 bonus multiplier
        return targetMultiplier + (targetMultiplier * bonus)
      } else {
        // Loser gets a value between 1 and target
        const normalized = (resultIndex % BPS_PER_WHOLE) / BPS_PER_WHOLE
        return 1 + (normalized * (targetMultiplier - 1))
      }
    }
  },
} as const

export type BetArrayV2Key = keyof typeof BET_ARRAYS_V2

// Utility functions for V2 games
export const V2_UTILS = {
  // Calculate RTP for any V2 game configuration
  calculateRTP: (gameKey: GameV2Key, betArray: number[]) => {
    const targetRTP = RTP_TARGETS_V2[gameKey]
    const totalOutcomes = betArray.length
    const winningOutcomes = betArray.filter(multiplier => multiplier > 0).length
    const averageWin = betArray.reduce((sum, multiplier) => sum + multiplier, 0) / winningOutcomes

    return (winningOutcomes / totalOutcomes) * averageWin
  },

  // Validate RTP configuration
  validateRTP: (gameKey: GameV2Key, betArray: number[]) => {
    const targetRTP = RTP_TARGETS_V2[gameKey]
    const actualRTP = V2_UTILS.calculateRTP(gameKey, betArray)
    const tolerance = 0.01 // 1% tolerance

    return Math.abs(actualRTP - targetRTP) <= tolerance
  }
}
