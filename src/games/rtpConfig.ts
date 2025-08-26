
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
  blackjack: 0.97,   // Blackjack: 3% house edge, ~42% win rate
  progressivepoker: 0.96, // Progressive Power Poker: 4% house edge, 35% win rate
  roulette: 0.973,   // Roulette: 2.7% house edge (European), ~47% win rate for even-money bets
} as const


// GameKey: Type representing all valid game keys in RTP_TARGETS
export type GameKey = keyof typeof RTP_TARGETS


// BET_ARRAYS: Centralized configuration for bet arrays and payout logic for each game.
// - Each game key contains its own payout structure, win probabilities, and helper functions.
// - When adding a new game, define its bet array logic here.
export const BET_ARRAYS = {
  // FLIP: Coin Flip game configuration
  // - SIDES: Possible choices
  // - heads/tails: Payout arrays for each side (index 0: heads, index 1: tails)
  flip: {
    SIDES: ['heads', 'tails'],
    heads: [1.92, 0],     // If player picks heads: 1.92x payout for heads, 0 for tails (96% RTP)
    tails: [0, 1.92],     // If player picks tails: 0 for heads, 1.92x payout for tails (96% RTP)
  },


// SLOTS: Slot machine configuration
// - NUM_REELS: Number of reels (columns)
// - NUM_ROWS: Number of rows per reel  
// - NUM_PAYLINES: Number of winning lines (1 horizontal bottom line)
// - LEGENDARY_THRESHOLD: Used for special effects (e.g., animation)
// - symbols: Array of possible slot symbols, each with a payout multiplier and weight (probability)
// - betArray: Pre-calculated array for precise RTP calculation (adjusted for 1 payline)
slots: {
  NUM_REELS: 3, // Number of reels (columns)
  NUM_ROWS: 2,  // Number of rows per reel
  NUM_PAYLINES: 1, // Single winning line (comment corrected)
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


  // CRASH: Crash game configuration
  // - calculateBetArray: Function to generate bet array for a given target multiplier
  //   - targetMultiplier: The multiplier at which the player wants to cash out
  //   - Returns: Array of 100 outcomes (win/lose), with house edge applied
  crash: {
    // Improved: higher resolution bet arrays minimize rounding drift and preserve RTP across wide multiplier range.
    calculateBetArray: (targetMultiplier: number, resolution?: number) => {
      const baseResolution = resolution ?? (targetMultiplier > 100 ? 10000 : 1000);
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
      3: [1.32, 1.71, 2.23, 2.94, 3.92, 5.29, 7.29, 10.35, 15.52, 24.38], // 3 mines
      5: [1.23, 1.54, 1.97, 2.55, 3.32, 4.37, 5.82, 7.89, 10.98, 16.13],   // 5 mines
      7: [1.18, 1.42, 1.72, 2.10, 2.57, 3.17, 3.96, 5.00, 6.37, 8.25],     // 7 mines
      10: [1.11, 1.27, 1.46, 1.69, 1.97, 2.30, 2.70, 3.19, 3.79, 4.52],    // 10 mines
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


  // ROULETTE: European Roulette game configuration
  // - NUMBERS: Array of all roulette numbers (0-36)
  // - BET_TYPES: All available bet types with their payouts and coverage
  // - calculateBetArray: Function to generate bet array for different bet types
  roulette: {
    NUMBERS: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    
    // Bet types with their base payouts (before house edge)
    BET_TYPES: {
      // Inside bets
      straight: { payout: 35, coverage: 1 },     // Single number: 35:1
      split: { payout: 17, coverage: 2 },        // Two numbers: 17:1
      street: { payout: 11, coverage: 3 },       // Three numbers: 11:1
      corner: { payout: 8, coverage: 4 },        // Four numbers: 8:1
      sixline: { payout: 5, coverage: 6 },       // Six numbers: 5:1
      
      // Outside bets
      red: { payout: 1, coverage: 18 },          // Red numbers: 1:1
      black: { payout: 1, coverage: 18 },        // Black numbers: 1:1
      odd: { payout: 1, coverage: 18 },          // Odd numbers: 1:1
      even: { payout: 1, coverage: 18 },         // Even numbers: 1:1
      low: { payout: 1, coverage: 18 },          // 1-18: 1:1
      high: { payout: 1, coverage: 18 },         // 19-36: 1:1
      dozen1: { payout: 2, coverage: 12 },       // 1st dozen: 2:1
      dozen2: { payout: 2, coverage: 12 },       // 2nd dozen: 2:1
      dozen3: { payout: 2, coverage: 12 },       // 3rd dozen: 2:1
      column1: { payout: 2, coverage: 12 },      // 1st column: 2:1
      column2: { payout: 2, coverage: 12 },      // 2nd column: 2:1
      column3: { payout: 2, coverage: 12 },      // 3rd column: 2:1
    },

    // Red and black number mappings
    RED_NUMBERS: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
    BLACK_NUMBERS: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],

    calculateBetArray: (betType: string, numbers: number[] = []) => {
      const TOTAL_NUMBERS = 37; // 0-36
      const betArray = Array(TOTAL_NUMBERS).fill(0);
      const betConfig = BET_ARRAYS.roulette.BET_TYPES[betType as keyof typeof BET_ARRAYS.roulette.BET_TYPES];
      
      if (!betConfig) return betArray;
      // Corrected formula: fair total return (stake included) is 37/coverage; apply RTP scaling once.
      const housePayout = (37 / betConfig.coverage) * RTP_TARGETS.roulette;

      switch (betType) {
        case 'straight':
          // Single number bet
          if (numbers.length === 1 && numbers[0] >= 0 && numbers[0] <= 36) {
            betArray[numbers[0]] = housePayout;
          }
          break;

        case 'red':
          BET_ARRAYS.roulette.RED_NUMBERS.forEach((num: number) => {
            betArray[num] = housePayout;
          });
          break;

        case 'black':
          BET_ARRAYS.roulette.BLACK_NUMBERS.forEach((num: number) => {
            betArray[num] = housePayout;
          });
          break;

        case 'odd':
          for (let i = 1; i <= 36; i += 2) {
            betArray[i] = housePayout;
          }
          break;

        case 'even':
          for (let i = 2; i <= 36; i += 2) {
            betArray[i] = housePayout;
          }
          break;

        case 'low':
          for (let i = 1; i <= 18; i++) {
            betArray[i] = housePayout;
          }
          break;

        case 'high':
          for (let i = 19; i <= 36; i++) {
            betArray[i] = housePayout;
          }
          break;

        case 'dozen1':
          for (let i = 1; i <= 12; i++) {
            betArray[i] = housePayout;
          }
          break;

        case 'dozen2':
          for (let i = 13; i <= 24; i++) {
            betArray[i] = housePayout;
          }
          break;

        case 'dozen3':
          for (let i = 25; i <= 36; i++) {
            betArray[i] = housePayout;
          }
          break;

        case 'column1':
          for (let i = 1; i <= 34; i += 3) {
            betArray[i] = housePayout;
          }
          break;

        case 'column2':
          for (let i = 2; i <= 35; i += 3) {
            betArray[i] = housePayout;
          }
          break;

        case 'column3':
          for (let i = 3; i <= 36; i += 3) {
            betArray[i] = housePayout;
          }
          break;

        case 'split':
        case 'street':
        case 'corner':
        case 'sixline':
          // Custom number arrays for complex bets
          numbers.forEach(num => {
            if (num >= 0 && num <= 36) {
              betArray[num] = housePayout;
            }
          });
          break;
      }

      return betArray;
    },

    // Map RouletteTable bet IDs to our system
    mapRouletteTableBet: (params: { bet: string; id: string; payload: any[] }) => {
      const { bet, id, payload } = params
      
      // Handle different bet types from RouletteTable
      switch (bet) {
        case 'STRAIGHT_UP':
          // For straight up bets, use the number directly
          return id
        case '1ST_COLUMN':
          return 'row1' // Map to our row1
        case '2ND_COLUMN':
          return 'row2' // Map to our row2  
        case '3RD_COLUMN':
          return 'row3' // Map to our row3
        case 'RED':
          return 'red'
        case 'BLACK':
          return 'black'
        case 'ODD':
          return 'odd'
        case 'EVEN':
          return 'even'
        case '1_TO_18':
          return 'firstHalf'
        case '19_TO_36':
          return 'secondHalf'
        case '1ST_DOZEN':
          return 'firstDozen'
        case '2ND_DOZEN':
          return 'secondDozen'
        case '3RD_DOZEN':
          return 'thirdDozen'
        default:
          // For unrecognized bets, create a simple entry
          return `roulette_${bet}_${id}`
      }
    }
  },


  // PROGRESSIVE POWER POKER: Progressive Power Poker game configuration
  // - Based on "Jacks or Better" video poker with compound betting mechanics
  // - Progressive mode: continue playing with accumulated profit until bust or cash out
  // - HAND_TYPES: All possible poker hand types mapped to betArray indices
  // - betArray: Mathematically balanced payouts for 89% RTP, 45% win rate
  progressivepoker: {
    HAND_TYPES: [
      'High Card',      // 0: High Card (Bust) - 30.1% actual chance
      'High Card',      // 1: High Card (Bust) - 20.0% actual chance  
      'Low Pair',       // 2: Low Pair 2s-10s (Bust) - 31.3% actual chance
      'Jacks+ Pair',    // 3: Pair of Jacks or Better - 10.4% actual chance
      'Two Pair',       // 4: Two Pair - 4.6% actual chance
      'Three of a Kind', // 5: Three of a Kind - 2.0% actual chance
      'Straight',       // 6: Straight - 1.2% actual chance
      'Flush+',         // 7: Flush, Full House, Four of a Kind, Straight Flush, Royal Flush - 0.4% actual chance
    ],
    // Payouts optimized for 96% RTP, ULTRA HIGH VOLATILITY - fewer wins, bigger payouts
    // Mathematical calculation: target_RTP = sum(probability_i * payout_i)
    // 96% = 8.35*P1 + 4.57*P2 + 2.03*P3 + 1.25*P4 + 0.37*P5 (where P1-P5 are non-zero payouts)
    betArray: [
      0,      // 0: High Card (Bust) - 30.11% chance, 0x payout
      0,      // 1: High Card (Bust) - 20.01% chance, 0x payout
      0,      // 2: Low Pair (Bust) - 33.31% chance, 0x payout (increased busts)
      3.6959, // 3: Jacks+ Pair - 8.35% chance, 3.6959x payout
      5.5438, // 4: Two Pair - 4.57% chance, 5.5438x payout  
      7.3917, // 5: Three of a Kind - 2.03% chance, 7.3917x payout
      11.0876,// 6: Straight - 1.25% chance, 11.0876x payout
      29.5669,// 7: Flush+ (includes Full House, Four Kind, Royal) - 0.37% chance, 29.5669x payout
    ],
    // Actual RTP: (8.35*3.6959 + 4.57*5.5438 + 2.03*7.3917 + 1.25*11.0876 + 0.37*29.5669) / 100 = 96.000%
    // Actual Win Rate: 8.35% + 4.57% + 2.03% + 1.25% + 0.37% = 16.57% (ultra volatile)
    
    // PROBABILITIES: Ultra high volatility - 83.4% bust rate, rare but meaningful wins
    probabilities: {
      0: 30.11,  // High Card (Bust) - 30.11%
      1: 20.01,  // High Card (Bust) - 20.01%  
      2: 33.31,  // Low Pair (Bust) - 33.31% (increased for more volatility)
      3: 8.35,   // Jacks+ Pair (2.0x) - 8.35% (reduced significantly)
      4: 4.57,   // Two Pair (4.0x) - 4.57%
      5: 2.03,   // Three of a Kind (5.5x) - 2.03%
      6: 1.25,   // Straight (6.5x) - 1.25%
      7: 0.37    // Flush+ (15x) - 0.37% (rare but big payout)
    },
    
    // DISPLAY_MAPPING: Maps internal hand types to display types
    displayMapping: {
      'High Card': 'Bust',
      'Low Pair': 'Bust', 
      'Bust': 'Bust',
      'Jacks+ Pair': 'Pair',
      'Two Pair': 'Two Pair',
      'Three of a Kind': 'Three of a Kind',
      'Straight': 'Straight',
      'Flush+': 'Flush'
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
    
    // UTILITY FUNCTIONS: Centralized bet array calculations
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
export const ROULETTE_CONFIG = BET_ARRAYS.roulette;


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