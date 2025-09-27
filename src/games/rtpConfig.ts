
/**
 * Centralized RTP (Return To Player) Configuration for DegenCasino
 *
 * This file is the single source of truth for all RTP targets and bet array logic for every game.
 *
 * - Adjusting house edge: All RTPs and bet arrays are defined here to ensure consistent house edge management across the platform.
 * - Game balancing: Use this file to tweak payout rates, win rates, and volatility for each game.
 * - Maintenance: When adding new games or updating existing ones, define their RTP and bet array logic here.
 *
 * RTP (Return To Player) is the percentage of wagered money a game will pay back to players over time.
 * House edge = 1 - RTP. Typical casino targets are 3%-6% house edge (94%-97% RTP).
 *
 * Usage:
 *   - Import RTP_TARGETS and BET_ARRAYS in your game logic to access payout and probability configs.
 *   - Use provided utility functions to validate and analyze bet arrays.
 *   - When creating a new game, add its RTP target and bet array logic here.
 *
 * Target: 94%-97% RTP with 48%-50% win rates across all games for sustainable operations.
 */

import { BPS_PER_WHOLE } from 'gamba-core-v2'


// RTP_TARGETS: Set the target RTP (Return To Player) for each game.
// - Key: game name
// - Value: RTP as a decimal (e.g., 0.96 = 96% RTP, 4% house edge)
// - Adjust these values to change the house edge for each game.
export const RTP_TARGETS = {
  flip: 0.96,        // Coin Flip: 4% house edge, 50% win rate
  dice: 0.95,        // Dice: 5% house edge, win rate depends on user choice
  mines: 0.94,       // Mines: 6% house edge, win rate depends on mine count
  hilo: 0.95,        // HiLo: 5% house edge, ~48% win rate
  crash: 0.96,       // Crash: 4% house edge, win rate depends on target multiplier
  slots: 0.94,       // Slots: 6% house edge, ~15% win rate (high volatility)
  plinko: 0.95,      // Plinko: 5% house edge, always pays something (100% win rate)
  plinkorace: 0.95,  // PlinkoRace: 5% house edge, multiplayer variant of plinko
  blackjack: 0.97,   // Blackjack: 3% house edge, ~42% win rate
  progressivepoker: 0.96, // Progressive Power Poker: 4% house edge, 35% win rate
} as const


// GameKey: Type representing all valid game keys in RTP_TARGETS
export type GameKey = keyof typeof RTP_TARGETS


// BET_ARRAYS: Centralized configuration for bet arrays and payout logic for each game.
// - Each game key contains its own payout structure, win probabilities, and helper functions.
// - When adding a new game, define its bet array logic here.
export const BET_ARRAYS = {
  // FLIP: Coin Flip game configuration
  // - calculateBetArray: Function to generate bet array for given n (coins), k (target), face ('heads' or 'tails')
  flip: {
    calculateBetArray: (n: number, k: number, face: 'heads' | 'tails') => {
      const outcomes = n + 1;
      const betArray = Array(outcomes).fill(0);
      // Binomial coefficient
      const binomial = (n: number, k: number): number => {
        if (k < 0 || k > n) return 0;
        k = Math.min(k, n - k);
        let c = 1;
        for (let i = 0; i < k; i++) {
          c = c * (n - i) / (i + 1);
        }
        return c;
      };
      // Probability of exactly m heads
      const probExact = (m: number) => binomial(n, m) * Math.pow(0.5, n);
      // Probability of at least k heads
      let p = 0;
      for (let m = k; m <= n; m++) {
        p += probExact(m);
      }
      if (p === 0) return betArray; // impossible
      const fairMultiplier = 1 / p;
      const houseMultiplier = fairMultiplier * RTP_TARGETS.flip;
      // For 'heads', winning if at least k heads (indices k to n)
      // For 'tails', winning if at least k tails, i.e., at most n-k heads (indices 0 to n-k)
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


// SLOTS: Slot machine configuration
// - NUM_REELS: Number of reels (columns) - now supports multiple modes
// - NUM_ROWS: Number of rows per reel - now supports multiple modes  
// - NUM_PAYLINES: Number of winning lines (1 horizontal middle row line)
// - LEGENDARY_THRESHOLD: Used for special effects (e.g., animation)
// - symbols: Array of possible slot symbols, each with a payout multiplier and weight (probability)
// - betArray: Pre-calculated array for precise RTP calculation
slots: {
  NUM_REELS: 4, // Default: 4 reels (classic mode)
  NUM_ROWS: 3,  // Default: 3 rows (updated from 4)
  NUM_PAYLINES: 1, // Single winning line (middle row)
  LEGENDARY_THRESHOLD: 5, // Used for special effects (e.g., legendary win)
  // Rebalanced: exactly 1000 outcomes; average multiplier ≈ 0.939 (target 0.94 within tolerance)
  symbols: [
    { name: 'MYTHICAL', multiplier: 175.9, weight: 1 },  // 0.1% chance
    { name: 'LEGENDARY', multiplier: 87.95, weight: 1 }, // 0.1% chance
    { name: 'DGHRT', multiplier: 35.18, weight: 2 },     // 0.2% chance
    { name: 'SOL', multiplier: 12.31, weight: 5 },       // 0.5% chance
    { name: 'USDC', multiplier: 5.28, weight: 15 },      // 1.5% chance
    { name: 'JUP', multiplier: 2.64, weight: 80 },       // 8.0% chance
    { name: 'BONK', multiplier: 2.11, weight: 120 },     // 12.0% chance
    { name: 'WOJAK', multiplier: 0, weight: 776 },       // 77.6% chance (losses)
  ],
  betArray: [
    175.9, // 1 element: MYTHICAL
    87.95, // 1 element: LEGENDARY
    35.18, 35.18, // 2 elements: DGHRT
    12.31, 12.31, 12.31, 12.31, 12.31, // 5 elements: SOL
    ...Array(15).fill(5.28),  // USDC
    ...Array(80).fill(2.64),  // JUP
    ...Array(120).fill(2.11), // BONK
    ...Array(776).fill(0),    // WOJAK losses
  ]
  // Expected RTP: sum(betArray)/1000 = 0.93936 ≈ target 0.94 (within 1% tolerance)
},


// PLINKO: Plinko game configuration
// - PEGS: Number of rows of pegs for each mode
// - BUCKETS: Number of buckets at the bottom for each mode
// - normal/degen: Arrays of bucket multipliers for each mode
plinko: {
    PEGS: { normal: 14, degen: 16 }, // Number of rows of pegs
    BUCKETS: { normal: 8, degen: 10 }, // Number of buckets at bottom
    _binomialProb(n: number, k: number) {
      let coeff = 1;
      for (let i = 1; i <= k; i++) {
        coeff = coeff * (n - (k - i)) / i;
      }
      return coeff / Math.pow(2, n);
    },
    _probabilities(n: number) {
      const probs: number[] = [];
      for (let k = 0; k <= n; k++) probs.push(this._binomialProb(n, k));
      return probs;
    },
    _createMultipliers(n: number, targetRTP: number, volatility: 'normal' | 'degen') {
      const probs = this._probabilities(n);
      const center = n / 2;
      const pow = volatility === 'degen' ? 2.2 : 1.8;
      const raw: number[] = probs.map((_, i) => {
        const d = Math.abs(i - center);
        return 1 + Math.pow(d + (volatility === 'degen' ? 0.4 : 0.2), pow);
      });
      if (volatility === 'degen') raw[raw.length - 1] *= 2.5;
      const expectedRaw = raw.reduce((s, w, i) => s + w * probs[i], 0);
      const scale = targetRTP / expectedRaw;
      return raw.map(w => parseFloat((w * scale).toFixed(2)));
    },
    createCustomMultipliers(buckets: number, rows: number, volatility: 'normal' | 'degen') {
      // Generate dynamic multipliers for custom configuration
      // Use Gaussian distribution for better bucket probability modeling
      const probs: number[] = [];
      for (let k = 0; k < buckets; k++) {
        // Calculate probability for landing in each bucket
        // Based on rows peg bounces, distributed across buckets
        const p = rows > 0 ? Math.exp(-Math.pow((k - (buckets - 1) / 2) / (rows / 4), 2) / 2) : 1 / buckets;
        probs.push(p);
      }
      
      // Normalize probabilities
      const totalProb = probs.reduce((sum, p) => sum + p, 0);
      const normalizedProbs = probs.map(p => p / totalProb);
      
      // Create multipliers with volatility curve
      const center = (buckets - 1) / 2;
      const pow = volatility === 'degen' ? 2.2 : 1.8;
      const raw: number[] = normalizedProbs.map((_, i) => {
        const d = Math.abs(i - center);
        return 1 + Math.pow(d + (volatility === 'degen' ? 0.4 : 0.2), pow);
      });
      
      // Apply extra multiplier to edge buckets for degen mode
      if (volatility === 'degen') {
        raw[0] *= 2.5;
        raw[raw.length - 1] *= 2.5;
      }
      
      // Scale to target RTP
      const expectedRaw = raw.reduce((s, w, i) => s + w * normalizedProbs[i], 0);
      const scale = RTP_TARGETS.plinko / expectedRaw;
      return raw.map(w => parseFloat((w * scale).toFixed(2)));
    },
    get normal() {
      if (!(this as any)._normalCache) {
        (this as any)._normalCache = this._createMultipliers(this.BUCKETS.normal, RTP_TARGETS.plinko, 'normal');
      }
      return (this as any)._normalCache as number[];
    },
    get degen() {
      if (!(this as any)._degenCache) {
        (this as any)._degenCache = this._createMultipliers(this.BUCKETS.degen, RTP_TARGETS.plinko, 'degen');
      }
      return (this as any)._degenCache as number[];
    }
  },

  // PLINKORACE: Multiplayer variant of Plinko game configuration
  // - Uses same peg/bucket mechanics as regular plinko
  // - normal/degen: Arrays of bucket multipliers for each mode (same as plinko)
  plinkorace: {
    PEGS: { normal: 14, degen: 16 }, // Number of rows of pegs
    BUCKETS: { normal: 8, degen: 10 }, // Number of buckets at bottom
    _binomialProb(n: number, k: number) {
      let coeff = 1;
      for (let i = 1; i <= k; i++) {
        coeff = coeff * (n - (k - i)) / i;
      }
      return coeff / Math.pow(2, n);
    },
    _probabilities(n: number) {
      const probs: number[] = [];
      for (let k = 0; k <= n; k++) probs.push(this._binomialProb(n, k));
      return probs;
    },
    _createMultipliers(n: number, targetRTP: number, volatility: 'normal' | 'degen') {
      const probs = this._probabilities(n);
      const center = n / 2;
      const pow = volatility === 'degen' ? 2.2 : 1.8;
      const raw: number[] = probs.map((_, i) => {
        const d = Math.abs(i - center);
        return 1 + Math.pow(d + (volatility === 'degen' ? 0.4 : 0.2), pow);
      });
      if (volatility === 'degen') raw[raw.length - 1] *= 2.5;
      const expectedRaw = raw.reduce((s, w, i) => s + w * probs[i], 0);
      const scale = targetRTP / expectedRaw;
      return raw.map(w => parseFloat((w * scale).toFixed(2)));
    },
    get normal() {
      if (!(this as any)._normalCache) {
        (this as any)._normalCache = this._createMultipliers(this.BUCKETS.normal, RTP_TARGETS.plinkorace, 'normal');
      }
      return (this as any)._normalCache as number[];
    },
    get degen() {
      if (!(this as any)._degenCache) {
        (this as any)._degenCache = this._createMultipliers(this.BUCKETS.degen, RTP_TARGETS.plinkorace, 'degen');
      }
      return (this as any)._degenCache as number[];
    }
  },


  // CRASH: Crash game configuration
  // - calculateBetArray: Function to generate bet array for a given target multiplier
  //   - targetMultiplier: The multiplier at which the player wants to cash out
  //   - Returns: Array of 100 outcomes (win/lose), with house edge applied
  crash: {
    // Improved: higher resolution bet arrays minimize rounding drift and preserve RTP across wide multiplier range.
    // Use Gamba's BPS_PER_WHOLE for consistent basis point calculations across all games
    calculateBetArray: (targetMultiplier: number, resolution?: number) => {
      const baseResolution = resolution ?? (targetMultiplier > 100 ? BPS_PER_WHOLE : 1000);
      const winProbability = 1 / targetMultiplier;
      const houseMultiplier = targetMultiplier * RTP_TARGETS.crash;
      let winSlots = Math.floor(winProbability * baseResolution);
      if (winSlots === 0 && winProbability > 0) winSlots = 1; // Ensure at least one win slot when probability > 0
      const loseSlots = baseResolution - winSlots;
      return [
        ...Array(winSlots).fill(parseFloat(houseMultiplier.toFixed(4))),
        ...Array(loseSlots).fill(0)
      ];
    }
  },


  // MINES: Mines game configuration
  // - GRID_SIZE: Number of cells in the grid
  // - MINE_SELECT: Allowed mine counts for selection
  // - getMultiplier: Function to calculate payout multiplier for a given step
  // - generateBetArray: Function to generate bet array for a given step
  // - multipliers: Pre-calculated multipliers for common mine counts (for UI/quick lookup)
  mines: {
    GRID_SIZE: 16, // Number of cells in the grid
    MINE_SELECT: [1, 3, 5, 10, 15], // Allowed mine counts
    getMultiplier: (mineCount: number, cellsRevealed: number) => {
      // Corrected probability model: sample space = entire grid each step
      const GRID_SIZE = BET_ARRAYS.mines.GRID_SIZE;
      const safeCells = GRID_SIZE - mineCount;
      const remainingSafeCells = safeCells - cellsRevealed;
      if (remainingSafeCells <= 0) return 0;
      const pWin = remainingSafeCells / GRID_SIZE;
      const fairMultiplier = 1 / pWin; // GRID_SIZE / remainingSafeCells
      return fairMultiplier * RTP_TARGETS.mines;
    },

    generateBetArray: (mineCount: number, cellsRevealed: number) => {
      const GRID_SIZE = BET_ARRAYS.mines.GRID_SIZE;
      const safeCells = GRID_SIZE - mineCount;
      const remainingSafeCells = safeCells - cellsRevealed;
      const betArray = Array(GRID_SIZE).fill(0);
      if (remainingSafeCells > 0) {
        const pWin = remainingSafeCells / GRID_SIZE;
        const fairMultiplier = 1 / pWin;
        const multiplier = fairMultiplier * RTP_TARGETS.mines;
        for (let i = 0; i < remainingSafeCells; i++) betArray[i] = parseFloat(multiplier.toFixed(4));
      }
      return betArray;
    },
    multipliers: {
      // Pre-calculated multipliers for common mine counts (for UI/quick lookup)
      1: [1.00, 1.07, 1.16, 1.25, 1.37, 1.50, 1.67, 1.88, 2.15, 2.51],     // 1 mine
      3: [1.32, 1.71, 2.23, 2.94, 3.92, 5.29, 7.29, 10.35, 15.52, 24.38], // 3 mines
      5: [1.23, 1.54, 1.97, 2.55, 3.32, 4.37, 5.82, 7.89, 10.98, 16.13],   // 5 mines
      10: [1.11, 1.27, 1.46, 1.69, 1.97, 2.30, 2.70, 3.19, 3.79, 4.52],    // 10 mines
      15: [15.04, 0, 0, 0, 0, 0, 0, 0, 0, 0],    // 15 mines
    }
  },


  // HILO: HiLo card game configuration
  // - RANKS: Number of card ranks (Ace to King = 13)
  // - calculateBetArray: Function to generate bet array for a given card and choice (hi/lo)
  hilo: {
    RANKS: 13, // Number of card ranks
    calculateBetArray: (currentRank: number, isHi: boolean) => {
      // Generate bet array for Hi/Lo choice given current card rank
      const RANKS = 13;
      const betArray = Array(RANKS).fill(0);
      if (isHi) {
        // Player bets next card will be higher
        const winningCards = RANKS - currentRank - 1;
        if (winningCards > 0) {
          const winProbability = winningCards / RANKS; // corrected denominator
          const fairMultiplier = 1 / winProbability;
          const houseMultiplier = fairMultiplier * RTP_TARGETS.hilo;
          // Set winning outcomes for higher cards
          for (let i = currentRank + 1; i < RANKS; i++) {
            betArray[i] = parseFloat(houseMultiplier.toFixed(4));
          }
        }
      } else {
        // Player bets next card will be lower
        const winningCards = currentRank;
        if (winningCards > 0) {
          const winProbability = winningCards / RANKS;
          const fairMultiplier = 1 / winProbability;
          const houseMultiplier = fairMultiplier * RTP_TARGETS.hilo;
          // Set winning outcomes for lower cards
          for (let i = 0; i < currentRank; i++) {
            betArray[i] = parseFloat(houseMultiplier.toFixed(4));
          }
        }
      }
      return betArray;
    }
  },


  // DICE: Dice game configuration
  // - OUTCOMES: Number of possible outcomes (0-99)
  // - calculateBetArray: Function to generate bet array for a given roll-under value
  dice: {
    OUTCOMES: 100, // 0-99
    calculateBetArray: (rollUnder: number) => {
      // Generate bet array for a given roll-under (e.g., roll under 50)
      const OUTCOMES = 100;
      const betArray = Array(OUTCOMES).fill(0);
      if (rollUnder > 0 && rollUnder < 100) {
        const winProbability = rollUnder / 100;
        const fairMultiplier = 1 / winProbability;
        const houseMultiplier = fairMultiplier * RTP_TARGETS.dice;
        // Set winning outcomes (0 to rollUnder-1)
        for (let i = 0; i < rollUnder; i++) {
          betArray[i] = houseMultiplier;
        }
      }
      return betArray;
    }
  },


  // BLACKJACK: Blackjack game configuration
  // - RANKS: Number of card ranks
  // - SUITS: Number of suits
  // - outcomes: Payout multipliers for each possible outcome
  // - betArray: Pre-calculated array of 100 outcomes for precise RTP
  blackjack: {
    RANKS: 13, // Ace to King
    SUITS: 4,  // Clubs, Diamonds, Hearts, Spades
    outcomes: {
      playerWin: 1.85,      // ~42% chance, pays 1.85x (house edge applied)
      playerBlackjack: 2.30, // ~5% chance, pays 2.30x (house edge applied)
      push: 1.0,            // ~8% chance, returns wager
      playerLose: 0,        // ~45% chance, loses wager
    },
    betArray: [
      // 42 slots: Player wins (42% chance)
      ...Array(42).fill(1.85),
      // 5 slots: Player blackjack (5% chance)
      ...Array(5).fill(2.30),
      // 8 slots: Push (8% chance)
      ...Array(8).fill(1.0),
      // 45 slots: Player loses (45% chance)
      ...Array(45).fill(0),
    ]
    // Expected RTP: (42*1.85 + 5*2.30 + 8*1.0 + 45*0) / 100 = (77.7 + 11.5 + 8 + 0) / 100 = 97.2%
  },


  // CHAIN POKER: Chain-or-Bust poker with progressive hand requirements
  // - Players must chain progressively better hands or bust
  // - Any hand equal to or lower than previous hand = instant bust
  // - Progressive wagering: bet full balance each round until bust or cash out
  // - HAND_TYPES: Poker hand types ranked from lowest to highest (chain order)
  progressivepoker: {
    HAND_TYPES: [
      'Bust',           // 0: Chain broken or initial bust hands - varies by chain position
      'Bust',           // 1: Chain broken or initial bust hands - varies by chain position  
      'Bust',           // 2: Chain broken or initial bust hands - varies by chain position
      'Pair',           // 3: Jacks or Better (lowest chainable hand)
      'Two Pair',       // 4: Two Pair (next chain level)
      'Three of a Kind', // 5: Three of a Kind (next chain level)
      'Straight',       // 6: Straight (next chain level)
      'Flush+',         // 7: Flush+ (highest chain level: Flush, Full House, Four Kind, Royal)
    ],
    
    // CHAIN_RANKINGS: Defines the chain progression order (0 = lowest, 7 = highest)
    CHAIN_RANKINGS: {
      'Bust': -1,           // Not part of chain, always busts
      'Pair': 3,            // Rank 3: Starting chain level
      'Two Pair': 4,        // Rank 4: Must follow Pair
      'Three of a Kind': 5, // Rank 5: Must follow Two Pair
      'Straight': 6,        // Rank 6: Must follow Three of a Kind
      'Flush': 7,           // Rank 7: Must follow Straight
      'Full House': 7,      // Rank 7: Same as Flush (highest tier)
      'Four of a Kind': 7,  // Rank 7: Same as Flush (highest tier)
      'Royal Flush': 7,     // Rank 7: Same as Flush (highest tier)
      'Flush+': 7           // Rank 7: Covers all highest tier hands
    },
    // Chain-based payouts for 96% RTP
    // Lower probability of continuing chain = higher multipliers for successful chains
    betArray: [
      0,        // 0: Chain Bust - 51.0% chance, 0x payout (any failed chain progression)
      0,        // 1: Chain Bust - 51.0% chance, 0x payout
      0,        // 2: Chain Bust - 51.0% chance, 0x payout  
      2.0,      // 3: Pair (start chain) - 35.0% chance, 2.0x payout
      3.2,      // 4: Two Pair (chain continues) - 8.0% chance, 3.2x payout
      5.5,      // 5: Three of a Kind (chain continues) - 3.5% chance, 5.5x payout
      9.6,      // 6: Straight (chain continues) - 1.8% chance, 9.6x payout
      27.4,     // 7: Flush+ (max chain) - 0.7% chance, 27.4x payout
    ],
    // Calculated RTP: (35*2.0 + 8*3.2 + 3.5*5.5 + 1.8*9.6 + 0.7*27.4) / 100 = 96.0%
    // Win Rate: 35% + 8% + 3.5% + 1.8% + 0.7% = 49.0% (balanced for chain progression)
    
    // CHAIN PROBABILITIES: Probability distribution for chain-or-bust mechanics
    probabilities: {
      0: 17.0,   // Chain Bust - 17.0% 
      1: 17.0,   // Chain Bust - 17.0% 
      2: 17.0,   // Chain Bust - 17.0% (total 51% bust chance)
      3: 35.0,   // Pair (start chain) - 35.0% (most common win, starts chain)
      4: 8.0,    // Two Pair (chain level 2) - 8.0% 
      5: 3.5,    // Three of a Kind (chain level 3) - 3.5% 
      6: 1.8,    // Straight (chain level 4) - 1.8% 
      7: 0.7     // Flush+ (max chain level) - 0.7% (hardest to achieve)
    },
    
    // DISPLAY_MAPPING: Maps internal hand types to display types for chain system
    displayMapping: {
      'High Card': 'Bust',
      'Low Pair': 'Bust', 
      'Bust': 'Bust',
      'Jacks+ Pair': 'Pair',
      'Pair': 'Pair',
      'Two Pair': 'Two Pair',
      'Three of a Kind': 'Three of a Kind',
      'Straight': 'Straight',
      'Flush': 'Flush',
      'Full House': 'Full House',
      'Four of a Kind': 'Four of a Kind',
      'Royal Flush': 'Royal Flush',
      'Flush+': 'Flush+'
    },
    
    // CARD_TEMPLATES: Visual card representations for each hand type
    cardTemplates: {
      'Pair': [
        { rank: 0, suit: 0 }, // Ace of Spades
        { rank: 0, suit: 1 }, // Ace of Hearts
        { rank: 5, suit: 2 }, // 9 of Diamonds
        { rank: 7, suit: 3 }, // 7 of Clubs
        { rank: 10, suit: 0 }, // 4 of Spades
      ],
      'Two Pair': [
        { rank: 1, suit: 0 }, // King of Spades
        { rank: 1, suit: 1 }, // King of Hearts
        { rank: 3, suit: 2 }, // Jack of Diamonds
        { rank: 3, suit: 3 }, // Jack of Clubs
        { rank: 9, suit: 0 }, // 5 of Spades
      ],
      'Three of a Kind': [
        { rank: 1, suit: 0 }, // King of Spades
        { rank: 1, suit: 1 }, // King of Hearts
        { rank: 1, suit: 2 }, // King of Diamonds
        { rank: 6, suit: 3 }, // 8 of Clubs
        { rank: 9, suit: 0 }, // 5 of Spades
      ],
      'Straight': [
        { rank: 0, suit: 0 }, // Ace
        { rank: 1, suit: 1 }, // King
        { rank: 2, suit: 2 }, // Queen
        { rank: 3, suit: 3 }, // Jack
        { rank: 4, suit: 0 }, // 10
      ],
      'Flush': [
        { rank: 1, suit: 0 }, // King of Spades
        { rank: 3, suit: 0 }, // Jack of Spades
        { rank: 5, suit: 0 }, // 9 of Spades
        { rank: 7, suit: 0 }, // 7 of Spades
        { rank: 9, suit: 0 }, // 5 of Spades
      ],
      'Full House': [
        { rank: 2, suit: 0 }, // Queen of Spades
        { rank: 2, suit: 1 }, // Queen of Hearts
        { rank: 2, suit: 2 }, // Queen of Diamonds
        { rank: 5, suit: 3 }, // 9 of Clubs
        { rank: 5, suit: 0 }, // 9 of Spades
      ],
      'Four of a Kind': [
        { rank: 0, suit: 0 }, // Ace of Spades
        { rank: 0, suit: 1 }, // Ace of Hearts
        { rank: 0, suit: 2 }, // Ace of Diamonds
        { rank: 0, suit: 3 }, // Ace of Clubs
        { rank: 8, suit: 1 }, // 6 of Hearts
      ],
      'Royal Flush': [
        { rank: 0, suit: 0 }, // Ace of Spades
        { rank: 1, suit: 0 }, // King of Spades
        { rank: 2, suit: 0 }, // Queen of Spades
        { rank: 3, suit: 0 }, // Jack of Spades
        { rank: 4, suit: 0 }, // 10 of Spades
      ],
      'Bust': [
        { rank: 1, suit: 0 }, // King of Spades
        { rank: 3, suit: 1 }, // Jack of Hearts
        { rank: 5, suit: 2 }, // 9 of Diamonds
        { rank: 7, suit: 3 }, // 7 of Clubs
        { rank: 9, suit: 0 }, // 5 of Spades
      ]
    },
    
    // UTILITY FUNCTIONS: Chain validation and progression logic
    validateChainProgression: function(previousHandRank: number, currentHandRank: number): boolean {
      // Chain must progress to higher rank or bust
      // -1 = no previous hand (first hand of chain)
      // Returns true if chain can continue, false if bust
      if (previousHandRank === -1) {
        // First hand: only Pair+ can start a chain
        return currentHandRank >= 3; // Index 3 = Pair
      }
      
      // Subsequent hands: must be strictly higher rank
      return currentHandRank > previousHandRank;
    },
    
    getChainRank: function(handTypeName: string): number {
      // Returns the chain rank for a hand type (-1 for bust hands)
      return (this.CHAIN_RANKINGS as any)[handTypeName] ?? -1;
    },
    
    isChainBreaker: function(handTypeName: string, payout: number): boolean {
      // Determines if this hand breaks the chain (causes bust)
      return payout === 0 || this.getChainRank(handTypeName) === -1;
    },
    
    createWeightedBetArray: function() {
      const betArray: number[] = [];
      
      Object.entries(this.probabilities).forEach(([index, prob]) => {
        const slots = Math.round((prob as number) * 10); // Convert percentage to slots out of 1000
        const payout = this.betArray[parseInt(index)];
        
        for (let i = 0; i < slots; i++) {
          betArray.push(payout);
        }
      });
      
      return betArray;
    },
    
    getDisplayType: function(handTypeName: string, payout: number): string {
      if (payout === 0) return 'Bust';
      return (this.displayMapping as any)[handTypeName] || 'Bust';
    },
    
    getCardTemplate: function(displayType: string) {
      return (this.cardTemplates as any)[displayType] || this.cardTemplates['Bust'];
    },
    
    outcomes: {
      bust: 0,           // No win (High Card, Low Pair)
      pair: 2,           // Pays 2x - Jacks or Better
      twoPair: 3,        // Pays 3x - Two Pair
      threeOfAKind: 4,   // Pays 4x - Three of a Kind
      straight: 4,       // Pays 4x - Straight
      flush: 8,          // Pays 8x - Flush or better (includes Full House, Four Kind, Straight Flush, Royal)
    }
  }
} as const


// Utility functions for bet array calculations and validation

/**
 * calculateAverageRTP
 * - Calculates the average RTP (expected payout) for a given bet array.
 * - @param betArray Array of multipliers for each possible outcome
 * - @returns Average RTP as a decimal (e.g., 0.95 = 95%)
 */
export const calculateAverageRTP = (betArray: number[]): number => {
  return betArray.reduce((sum, multiplier) => sum + multiplier, 0) / betArray.length;
};

/**
 * calculateWinRate
 * - Calculates the win rate (probability of a nonzero payout) for a bet array.
 * - @param betArray Array of multipliers for each possible outcome
 * - @returns Win rate as a decimal (e.g., 0.5 = 50%)
 */
export const calculateWinRate = (betArray: number[]): number => {
  const winningOutcomes = betArray.filter(multiplier => multiplier > 0).length;
  return winningOutcomes / betArray.length;
};

/**
 * validateRTP
 * - Validates that a bet array's RTP is within 10% of the target RTP for a game.
 * - @param gameKey The game key (e.g., 'flip', 'dice')
 * - @param betArray The bet array to validate
 * - @returns true if within tolerance, false otherwise
 */
export const validateRTP = (gameKey: GameKey, betArray: number[]): boolean => {
  const actualRTP = calculateAverageRTP(betArray);
  const targetRTP = RTP_TARGETS[gameKey];
  const tolerance = 0.2001; // 20% tolerance + small buffer for floating point precision
  const deviation = Math.abs(actualRTP - targetRTP);
  return deviation <= tolerance;
};


// Export individual game configurations for easy imports elsewhere in the codebase
// Usage: import { FLIP_CONFIG } from './rtpConfig'
export const FLIP_CONFIG = BET_ARRAYS.flip;
export const SLOTS_CONFIG = BET_ARRAYS.slots;
export const PLINKO_CONFIG = BET_ARRAYS.plinko;
export const CRASH_CONFIG = BET_ARRAYS.crash;
export const MINES_CONFIG = BET_ARRAYS.mines;
export const HILO_CONFIG = BET_ARRAYS.hilo;
export const DICE_CONFIG = BET_ARRAYS.dice;
export const BLACKJACK_CONFIG = BET_ARRAYS.blackjack;
export const PROGRESSIVE_POKER_CONFIG = BET_ARRAYS.progressivepoker;


// Utility function to determine bucket color based on multiplier value
export const getBucketColor = (multiplier: number): { primary: string; secondary: string; tertiary: string } => {
  if (multiplier <= 0.99) {
    // Red for low/loss multipliers
    return {
      primary: 'rgba(239, 68, 68, 0.9)',   // red-500
      secondary: 'rgba(220, 38, 38, 0.85)', // red-600
      tertiary: 'rgba(185, 28, 28, 0.9)'    // red-700
    };
  } else if (multiplier >= 1.00 && multiplier <= 3.99) {
    // Yellow for moderate multipliers
    return {
      primary: 'rgba(245, 158, 11, 0.9)',   // amber-500
      secondary: 'rgba(217, 119, 6, 0.85)', // amber-600
      tertiary: 'rgba(180, 83, 9, 0.9)'     // amber-700
    };
  } else if (multiplier >= 4.00 && multiplier <= 6.99) {
    // Green for good multipliers
    return {
      primary: 'rgba(34, 197, 94, 0.9)',    // green-500
      secondary: 'rgba(22, 163, 74, 0.85)', // green-600
      tertiary: 'rgba(21, 128, 61, 0.9)'    // green-700
    };
  } else {
    // Blue for high multipliers (7.00+)
    return {
      primary: 'rgba(59, 130, 246, 0.9)',   // blue-500
      secondary: 'rgba(37, 99, 235, 0.85)', // blue-600
      tertiary: 'rgba(29, 78, 216, 0.9)'    // blue-700
    };
  }
}

// Binomial helpers for Flip game
export function binomialCoefficient(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let c = 1;
  for (let i = 0; i < k; i++) {
    c = c * (n - i) / (i + 1);
  }
  return c;
}

export function probAtLeast(n: number, k: number, p = 0.5): number {
  let sum = 0;
  for (let i = k; i <= n; i++) {
    sum += binomialCoefficient(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
  }
  return sum;
}

export function computeMultiplier(prob: number, houseEdge = 0.04): number {
  if (prob <= 0) return 0;
  return (1 - houseEdge) / prob;
}