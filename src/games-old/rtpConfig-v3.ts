/**
 * Centralized RTP (Return To Player) Configuration for DegenCasino V3
 * 
 * This is the single source of truth for all game RTP configurations.
 * All games must use this configuration to ensure blockchain validation.
 */

import { BPS_PER_WHOLE } from 'gamba-core-v2'

// Central RTP targets - consistent across all games
export const RTP_TARGETS_V3 = {
  // Base Games
  'dice': 0.95,      // 95% RTP - 5% house edge
  'magic8ball': 0.95,  // 95% RTP - 5% house edge
  'mines': 0.94,     // 94% RTP - 6% house edge
  'plinko': 0.95,    // 95% RTP - 5% house edge
  'limbo': 0.95,     // 95% RTP - 5% house edge (limbo)
  'crash': 0.95,     // 95% RTP - 5% house edge
  'slots': 0.96,     // 96% RTP - 4% house edge
  'flip': 0.96,      // 96% RTP - 4% house edge
  'hilo': 0.95,      // 95% RTP - 5% house edge
  
  // Skill-Based Games (higher RTP due to skill element)
  'poker': 0.97,     // 97% RTP - 3% house edge
  'blackjack': 0.97, // 97% RTP - 3% house edge
  // Backwards-compatible keys for V2 game ids
  'keno': 0.95,
  'multipoker-v2': 0.96,
  'cryptochartgame-v2': 0.95,
  'doubleornothing-v2': 0.94,
  // Convenience aliases (non-v2 keys used across the UI)
  'multipoker': 0.96,
  'cryptochartgame': 0.95,
  'fancyvirtualhorseracing': 0.95,
  'fancyvirtualhorseracing-v2': 0.95,
} as const

export type GameV3Key = keyof typeof RTP_TARGETS_V3

// Game-specific configurations
export const BET_ARRAYS_V3 = {
  'dice': {
    OUTCOMES: 100, // 0-99 for maximum precision
    outcomes: Array.from({length: 100}, (_, i) => i),
    calculateBetArray: (rollUnder: number) => {
      const OUTCOMES = 100;
      const betArray = Array(OUTCOMES).fill(0);
      if (rollUnder > 0 && rollUnder <= 100) {
        const winProbability = rollUnder / 100;
        const fairMultiplier = 1 / winProbability;
        const houseMultiplier = fairMultiplier * RTP_TARGETS_V3['dice'];
        for (let i = 0; i < rollUnder; i++) {
          betArray[i] = parseFloat(houseMultiplier.toFixed(4));
        }
      }
      return betArray;
    }
  },

    'flip': {
      calculateBetArray: (n: number, k: number, face: 'heads' | 'tails') => {
        const outcomes = n + 1;
        const betArray = Array(outcomes).fill(0);
        const binomial = (n: number, k: number): number => {
          if (k < 0 || k > n) return 0;
          k = Math.min(k, n - k);
          let c = 1;
          for (let i = 0; i < k; i++) {
            c = c * (n - i) / (i + 1);
          }
          return c;
        };
        const probExact = (m: number) => binomial(n, m) * Math.pow(0.5, n);
        let p = 0;
        for (let m = k; m <= n; m++) p += probExact(m);
        if (p === 0) return betArray;
        const fairMultiplier = 1 / p;
        const houseMultiplier = fairMultiplier * RTP_TARGETS_V3['flip'];
        if (face === 'heads') {
          for (let m = k; m <= n; m++) {
            const probM = probExact(m);
            betArray[m] = houseMultiplier * outcomes * probM;
          }
        } else {
          for (let m = 0; m <= n - k; m++) {
            const probM = probExact(m);
            betArray[m] = houseMultiplier * outcomes * probM;
          }
        }
        return betArray;
      }
    },

  'magic8ball': {
    OUTCOMES: 2,
    outcomes: [0, 1], // [Win, Lose]
    calculateBetArray: () => {
      const winProbability = 0.5;
      const fairMultiplier = 1 / winProbability;
      const houseMultiplier = fairMultiplier * RTP_TARGETS_V3['magic8ball'];
      return [
        parseFloat(houseMultiplier.toFixed(4)), // Win
        0                                       // Lose
      ];
    }
  },

  'mines': {
    GRID_SIZE: 25, // Updated to match UI
    MINE_OPTIONS: [1, 3, 5, 10, 15, 24],
    calculateBetArray: (mineCount: number, cellsRevealed: number) => {
      const GRID_SIZE = BET_ARRAYS_V3.mines.GRID_SIZE;
      const safeCells = GRID_SIZE - mineCount;
      const remainingCells = GRID_SIZE - cellsRevealed;
      const remainingSafeCells = safeCells - cellsRevealed;
      
      // Return zero array if no more safe cells
      if (remainingSafeCells <= 0 || remainingCells <= 0) {
        return [0, 0];
      }

      // Calculate win probability for this specific reveal
      const pWin = remainingSafeCells / remainingCells;
      const fairMultiplier = 1 / pWin;
      
      // Adjust RTP based on mine count to ensure valid house edge
      const baseRtp = RTP_TARGETS_V3['mines'];
      const mineRatio = mineCount / GRID_SIZE;
      // Scale RTP between 94% and 97% based on mine count
      const adjustedRtp = baseRtp + (0.03 * (1 - mineRatio));
      
      // Calculate multiplier with adjusted RTP
      const multiplier = fairMultiplier * adjustedRtp;
      
      return [0, parseFloat(multiplier.toFixed(4))];
    },
    getMultiplier: (mineCount: number, cellsRevealed: number) => {
      const GRID_SIZE = BET_ARRAYS_V3.mines.GRID_SIZE;
      const safeCells = GRID_SIZE - mineCount;
      const remainingSafeCells = safeCells - (cellsRevealed || 0);
      if (remainingSafeCells <= 0) return 0;
      const pWin = remainingSafeCells / GRID_SIZE;
      const fairMultiplier = 1 / pWin;
      return parseFloat((fairMultiplier * RTP_TARGETS_V3['mines']).toFixed(4));
    }
  },

  'plinko': {
    PEGS: { normal: 14, degen: 16 },
    BUCKETS: { normal: 8, degen: 10 },
    _binomialProb(n: number, k: number) {
      if (k > n) return 0;
      if (k === 0 || k === n) return 1;
      k = Math.min(k, n - k);
      let c = 1;
      for (let i = 0; i < k; i++) {
        c = c * (n - i) / (i + 1);
      }
      return c;
    },
    
    _probabilities(n: number) {
      const probs = [];
      for (let k = 0; k <= n; k++) {
        probs.push(this._binomialProb(n, k) * Math.pow(0.5, n));
      }
      return probs;
    },
    _createMultipliers(n: number, targetRTP: number, volatility: 'normal' | 'degen') {
      const probs = this._probabilities(n);
      const center = n / 2;
      const pow = volatility === 'degen' ? 2.0 : 1.6;
      // Ensure minimum multiplier is 1.0
      const raw: number[] = probs.map((_, i) => {
        const d = Math.abs(i - center);
        // Base multiplier never goes below 1.0
        return Math.max(1.0, 1 + Math.pow(d + (volatility === 'degen' ? 0.3 : 0.15), pow));
      });
      // Add extra bonus for outer buckets in degen mode
      if (volatility === 'degen') {
        raw[0] *= 1.5;
        raw[raw.length - 1] *= 1.5;
      }
      // Scale to target RTP while preserving minimum 1.0x
      const expectedRaw = raw.reduce((s, w, i) => s + w * probs[i], 0);
      const scale = targetRTP / expectedRaw;
      return raw.map(w => parseFloat((Math.max(1.0, w * scale)).toFixed(2)));
    },
    createCustomMultipliers(buckets: number, rows: number, volatility: 'normal' | 'degen') {
      const probs: number[] = [];
      for (let k = 0; k < buckets; k++) {
        const p = rows > 0 ? Math.exp(-Math.pow((k - (buckets - 1) / 2) / (rows / 4), 2) / 2) : 1 / buckets;
        probs.push(p);
      }
      const totalProb = probs.reduce((sum, p) => sum + p, 0);
      const normalizedProbs = probs.map(p => p / totalProb);
      const center = (buckets - 1) / 2;
      const pow = volatility === 'degen' ? 2.2 : 1.8;
      const raw: number[] = normalizedProbs.map((_, i) => {
        const d = Math.abs(i - center);
        return 1 + Math.pow(d + (volatility === 'degen' ? 0.4 : 0.2), pow);
      });
      if (volatility === 'degen') {
        raw[0] *= 2.5;
        raw[raw.length - 1] *= 2.5;
      }
      const expectedRaw = raw.reduce((s, w, i) => s + w * normalizedProbs[i], 0);
      const scale = RTP_TARGETS_V3.plinko / expectedRaw;
      return raw.map(w => parseFloat((w * scale).toFixed(2)));
    },
    get normal() {
      if (!(this as any)._normalCache) {
        (this as any)._normalCache = this._createMultipliers(this.BUCKETS.normal, RTP_TARGETS_V3.plinko, 'normal');
      }
      return (this as any)._normalCache as number[];
    },
    get degen() {
      if (!(this as any)._degenCache) {
        (this as any)._degenCache = this._createMultipliers(this.BUCKETS.degen, RTP_TARGETS_V3.plinko, 'degen');
      }
      return (this as any)._degenCache as number[];
    },
    
    calculateBetArray: (mode: 'normal' | 'degen' = 'normal') => {
      const rows = BET_ARRAYS_V3.plinko.PEGS[mode];
      const probs = BET_ARRAYS_V3.plinko._probabilities(rows);
      const n = probs.length
      const target = RTP_TARGETS_V3['plinko']

      // Set multipliers so that sum(p_i * m_i) = target, choosing m_i proportional to 1/p_i:
      // m_i = target / (n * p_i)
      const multipliers = probs.map(p => p > 0 ? parseFloat((target / (n * p)).toFixed(2)) : 0)
      return multipliers
    }
  }

  ,
  // CRASH: Crash (multiplier) game configuration
  // - Fine-grained outcomes for predictable on-chain validation
  'crash': {
    OUTCOMES: 1000,
    outcomes: Array.from({ length: 1000 }, (_, i) => i),
    calculateBetArray: () => {
      const TARGET_RTP = RTP_TARGETS_V3['crash'];
      return Array(1000).fill(0).map((_, index) => {
        if (index < 10) return 50.0 * TARGET_RTP
        if (index < 25) return 20.0 * TARGET_RTP
        if (index < 50) return 10.0 * TARGET_RTP
        if (index < 100) return 5.0 * TARGET_RTP
        if (index < 180) return 3.0 * TARGET_RTP
        if (index < 280) return 2.0 * TARGET_RTP
        if (index < 400) return 1.5 * TARGET_RTP
        if (index < 500) return 1.2 * TARGET_RTP
        return 0
      })
    },
    getCrashMultiplier: (outcomeIndex: number) => {
      if (outcomeIndex >= 500) {
        const normalized = (outcomeIndex - 500) / 500
        return parseFloat((1.0 + (normalized * 0.19)).toFixed(4))
      }
      const betArray = (BET_ARRAYS_V3 as any)['crash'].calculateBetArray()
      const TARGET_RTP = RTP_TARGETS_V3['crash']
      return parseFloat((betArray[outcomeIndex] / TARGET_RTP).toFixed(4))
    }
  }
  ,
  // LIMBO: Target-multiplier climb game
  'limbo': {
    OUTCOMES: [1, 1.2, 1.5, 2, 3, 5, 10, 100],
    calculateBetArray: (targetMultiplier: number) => {
      // Map a requested multiplier to the nearest entry and produce a weighted betArray
      const arr = (BET_ARRAYS_V3 as any)['limbo'].OUTCOMES
      // Simple resolution: create an array over 100 outcomes mirroring rarities
      const base = Array(100).fill(0)
      // Assign approximate rarity bands (tuned to give ~95% RTP)
      base.fill(0)
      for (let i = 0; i < 100; i++) {
        if (i < 50) base[i] = 1
        else if (i < 75) base[i] = 1.2
        else if (i < 88) base[i] = 1.5
        else if (i < 95) base[i] = 2
        else base[i] = 5
      }
  // Apply house edge scaling toward target RTP (limbo historically ~95%)
  const target = RTP_TARGETS_V3['limbo'] || 0.95
      const avg = base.reduce((s: number, x: number) => s + x, 0) / base.length
      const scale = target / avg
      return base.map((m: number) => parseFloat((m * scale).toFixed(4)))
    }
  }

  ,
  // BLACKJACK: Simplified blackjack payout table for V3
  'blackjack': {
    RANKS: 13,
    SUITS: 4,
    // Return a precomputed betArray similar to V2 but matching V3 targets
    betArray: (() => {
      const TARGET = RTP_TARGETS_V3['blackjack'] || 0.97
      // base distribution (approx): wins 42 slots @1.85, blackjack 5 @2.3, push 8 @1, lose 45 @0
      const base = [
        ...Array(42).fill(1.85),
        ...Array(5).fill(2.3),
        ...Array(8).fill(1.0),
        ...Array(45).fill(0)
      ]
      // Scale to target RTP
      const avg = base.reduce((s, x) => s + x, 0) / base.length
      const scale = TARGET / avg
      return base.map(x => parseFloat((x * scale).toFixed(4)))
    })()
  }

    ,
    // KENO: replicate V2 simplified payouts
    'keno': {
      GRID_SIZE: 40,
      MAX_SELECTION: 10,
      DRAW_COUNT: 10,
      calculateBetArray: (selectedCount: number) => {
        const outcomes = (selectedCount || 0) + 1
        const betArray = Array(outcomes).fill(0)
        if (!selectedCount || selectedCount === 0) return betArray
        const houseEdge = 1 - (RTP_TARGETS_V3['keno'] || 0.95)
        const payouts: Record<number, number[]> = {
          1: [0, 3],
          2: [0, 1, 9],
          3: [0, 1, 2, 16],
          4: [0, 0.5, 2, 6, 25],
          5: [0, 0.5, 1, 3, 15, 50],
          6: [0, 0.5, 1, 2, 3, 30, 75],
          7: [0, 0.5, 0.5, 1, 6, 12, 36, 100],
          8: [0, 0.5, 0.5, 1, 2, 4, 20, 80, 500],
          9: [0, 0.5, 0.5, 1, 1, 5, 10, 50, 200, 1000],
          10: [0, 0, 0.5, 1, 2, 5, 15, 40, 100, 250, 1800]
        }
        const basePayout = payouts[selectedCount] || payouts[1]
        // Scale base payouts so their average equals the target RTP (apply house edge via scaling)
        const validPayouts = basePayout.slice(0, betArray.length)
        const avgBase = validPayouts.reduce((s, x) => s + x, 0) / validPayouts.length
        const scale = (RTP_TARGETS_V3['keno'] || 0.95) / (avgBase || 1)
        for (let i = 0; i < Math.min(validPayouts.length, betArray.length); i++) {
          betArray[i] = parseFloat((validPayouts[i] * scale).toFixed(4))
        }
        return betArray
      }
    }

    ,
    // MULTIPOKER: mirror V2 fixed table
    'multipoker': {
      calculateBetArray: () => {
        const base = [0,2,3,4,4,8,10,25,100]
        const target = RTP_TARGETS_V3['multipoker'] || RTP_TARGETS_V3['poker'] || 0.96
        const avg = base.reduce((s, x) => s + x, 0) / base.length
        const scale = target / avg
        return base.map(x => parseFloat((x * scale).toFixed(4)))
      },
      getHandName: (index: number) => {
        const names = ['High Card','Pair','Two Pair','Three of a Kind','Straight','Flush','Full House','Four of a Kind','Royal Flush']
        return names[index] || 'Unknown'
      }
    }

    ,
    // CRYPTO CHART: mirror V2 simplified logic
    'cryptochartgame': {
      calculateBetArray: (targetMultiplier: number) => {
        const OUTCOMES = BPS_PER_WHOLE
        const betArray = Array(OUTCOMES).fill(0)
        const baseProbability = 0.5
        const difficultyFactor = Math.max(0.1, 1 / Math.log(targetMultiplier + 1))
        const winProbability = Math.min(0.9, baseProbability * difficultyFactor)
        const winOutcomes = Math.floor(OUTCOMES * winProbability)
        const houseEdge = 1 - (RTP_TARGETS_V3['crash'] || 0.95) // fallback if not set
        const fairMultiplier = 1 / winProbability
        const adjustedMultiplier = fairMultiplier * (1 - houseEdge)
        for (let i = 0; i < winOutcomes; i++) {
          betArray[i] = parseFloat(adjustedMultiplier.toFixed(4))
        }
        return betArray
      }
    }
    ,
    // DOUBLE OR NOTHING V2: mirror legacy V2 behavior under V3 central config
    'doubleornothing-v2': {
      calculateBetArray: (mode: number) => {
        const modes = [
          { multiplier: 1.88, outcomes: 2 }, // 2x mode
          { multiplier: 2.82, outcomes: 3 }, // 3x mode
          { multiplier: 9.4, outcomes: 10 }  // 10x mode
        ]
        const selected = modes[mode] || modes[0]
        const arr = Array(selected.outcomes).fill(0)
        arr[selected.outcomes - 1] = parseFloat(selected.multiplier.toFixed(4))
        return arr
      },
      getModeName: (mode: number) => ['2x', '3x', '10x'][mode] || '2x',
      getModeLabels: (mode: number) => {
        const labels = [['Double!', 'Nothing'], ['Triple!', 'Nothing'], ['Degen!', 'Nothing']]
        return labels[mode] || labels[0]
      }
    }
    ,
    // FANCY VIRTUAL HORSE RACING: mirror V2 simple payouts
    'fancyvirtualhorseracing-v2': {
      calculateBetArray: () => {
        const baseMultipliers = [10, 8, 6, 4.5, 3.5, 2.8, 2.2, 1.8]
        const target = RTP_TARGETS_V3['fancyvirtualhorseracing-v2'] || RTP_TARGETS_V3['fancyvirtualhorseracing'] || 0.95
        const avg = baseMultipliers.reduce((s, x) => s + x, 0) / baseMultipliers.length
        const scale = target / (avg || 1)
        return baseMultipliers.map(m => parseFloat((m * scale).toFixed(4)))
      },
      getHorseName: (index: number) => {
        const names = ['Lightning Bolt', 'Thunder Strike', 'Wind Runner', 'Fire Storm', 'Ocean Wave', 'Mountain Peak', 'Solar Flare', 'Lunar Eclipse']
        return names[index] || `Horse ${index + 1}`
      },
      getHorseOdds: (index: number) => {
        const odds = ['10:1', '8:1', '6:1', '4.5:1', '3.5:1', '2.8:1', '2.2:1', '1.8:1']
        return odds[index] || '1:1'
      }
    }
}

// Utility functions for bet array validation
export const V3_UTILS = {
  // Calculate actual RTP for a bet array
  calculateRTP: (gameKey: GameV3Key, betArray: number[]): number => {
    // Some games (like Plinko and Mines) have non-uniform outcome probabilities.
    // For those, compute a probability-weighted expected value using the game's
    // internal probability model. For all other games, fall back to uniform average.
    if (gameKey === 'plinko') {
      const rows = BET_ARRAYS_V3.plinko.PEGS.normal
      const probs = BET_ARRAYS_V3.plinko._probabilities(rows)
      // If betArray length mismatches probs, try to align by truncation/padding
      const n = Math.min(probs.length, betArray.length)
      let ev = 0
      for (let i = 0; i < n; i++) {
        ev += (betArray[i] || 0) * probs[i]
      }
      return parseFloat(ev.toFixed(4))
    }

    if (gameKey === 'mines') {
      // For bet arrays generated with m_i proportional to 1/p_i, we can compute
      // expected RTP directly from the multipliers using the identity:
      // RTP = nonZeroCount / sum(1/m_i)  (for m_i > 0)
      const ms = betArray.filter(m => m > 0)
      if (ms.length === 0) return 0
      const sumInv = ms.reduce((s, m) => s + (1 / m), 0)
      const ev = ms.length / sumInv
      return parseFloat(ev.toFixed(4))
    }

    // Default: uniform distribution across outcomes
    const totalOutcomes = betArray.length;
    const expectedValue = betArray.reduce((sum, multiplier) => sum + multiplier, 0) / totalOutcomes;
    return parseFloat(expectedValue.toFixed(4));
  },

  // Validate RTP is within acceptable range
  validateRTP: (gameKey: GameV3Key, betArray: number[]): boolean => {
    const targetRTP = RTP_TARGETS_V3[gameKey];
    const actualRTP = V3_UTILS.calculateRTP(gameKey, betArray);
    const tolerance = 0.01; // 1% tolerance
    
    return Math.abs(actualRTP - targetRTP) <= tolerance;
  },

  // Get game's target RTP
  getTargetRTP: (gameKey: GameV3Key): number => {
    return RTP_TARGETS_V3[gameKey];
  },

  // Calculate win rate for a bet array
  calculateWinRate: (betArray: number[]): number => {
    const winningOutcomes = betArray.filter(multiplier => multiplier > 0).length;
    return parseFloat((winningOutcomes / betArray.length).toFixed(4));
  }
}

// Utility function to determine bucket color based on multiplier value
export const getBucketColor = (multiplier: number): { primary: string; secondary: string; tertiary: string } => {
  if (multiplier <= 0.99) {
    return {
      primary: 'rgba(239, 68, 68, 0.9)',
      secondary: 'rgba(220, 38, 38, 0.85)',
      tertiary: 'rgba(185, 28, 28, 0.9)'
    }
  } else if (multiplier >= 1.00 && multiplier <= 3.99) {
    return {
      primary: 'rgba(245, 158, 11, 0.9)',
      secondary: 'rgba(217, 119, 6, 0.85)',
      tertiary: 'rgba(180, 83, 9, 0.9)'
    }
  } else if (multiplier >= 4.00 && multiplier <= 6.99) {
    return {
      primary: 'rgba(34, 197, 94, 0.9)',
      secondary: 'rgba(22, 163, 74, 0.85)',
      tertiary: 'rgba(21, 128, 61, 0.9)'
    }
  } else {
    return {
      primary: 'rgba(59, 130, 246, 0.9)',
      secondary: 'rgba(37, 99, 235, 0.85)',
      tertiary: 'rgba(29, 78, 216, 0.9)'
    }
  }
}

// Export commonly used game configs for easy imports
export const CRASH_CONFIG_V3 = (BET_ARRAYS_V3 as any)['crash']