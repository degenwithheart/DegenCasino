
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
  // - NUM_SLOTS: Number of reels
  // - LEGENDARY_THRESHOLD: Used for special effects (e.g., animation)
  // - symbols: Array of possible slot symbols, each with a payout multiplier and weight (probability)
  // - betArray: Pre-calculated array of 1000 outcomes for precise RTP calculation
  slots: {
    NUM_SLOTS: 3, // Number of reels
    LEGENDARY_THRESHOLD: 5, // Used for special effects (e.g., legendary win)
    symbols: [
      { name: 'UNICORN', multiplier: 150.0, weight: 1 },   // Legendary: 0.1% chance, 150x payout
      { name: 'DGHRT', multiplier: 60.0, weight: 2 },      // Epic: 0.2% chance, 60x payout
      { name: 'SOL', multiplier: 20.0, weight: 5 },        // Rare: 0.5% chance, 20x payout
      { name: 'USDC', multiplier: 8.0, weight: 15 },       // Uncommon: 1.5% chance, 8x payout
      { name: 'JUP', multiplier: 3.0, weight: 80 },        // Common: 8% chance, 3x payout
      { name: 'BONK', multiplier: 1.8, weight: 120 },      // Common: 12% chance, 1.8x payout
      { name: 'WOJAK', multiplier: 0, weight: 777 },       // Loss: 77.7% chance, 0 payout
    ],
    betArray: [
      // Each entry represents a possible outcome for a single spin.
      // The number of entries for each symbol is proportional to its weight (probability).
      // 1 element: 150.0x (Unicorn) = 150.0 total value
      150.0,
      // 2 elements: 60.0x (DGHRT) = 120.0 total value
      60.0, 60.0,
      // 5 elements: 20.0x (SOL) = 100.0 total value
      20.0, 20.0, 20.0, 20.0, 20.0,
      // 15 elements: 8.0x (USDC) = 120.0 total value
      ...Array(15).fill(8.0),
      // 80 elements: 3.0x (JUP) = 240.0 total value
      ...Array(80).fill(3.0),
      // 120 elements: 1.8x (BONK) = 216.0 total value
      ...Array(120).fill(1.8),
      // 777 elements: 0x (WOJAK - losses) = 0.0 total value
      ...Array(777).fill(0),
    ]
    // Total: 946.0 value / 1000 slots = 94.6% RTP (close to 94%)
  },


  // PLINKO: Plinko game configuration
  // - ROWS: Number of rows for each mode
  // - normal/degen: Arrays of bucket multipliers for each mode
  plinko: {
    ROWS: { normal: 14, degen: 12 }, // Number of rows for each mode
    normal: [
      // 8 buckets, ~95% RTP, ~48% win rate
      0.0, 2.2, 1.2, 0.0, 1.2, 0.0, 0.0, 2.8
    ],
    degen: [
      // 10 buckets, ultra degen: ~95% RTP, ~20% win rate, one huge payout
      0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 9.5
    ]
  },


  // CRASH: Crash game configuration
  // - calculateBetArray: Function to generate bet array for a given target multiplier
  //   - targetMultiplier: The multiplier at which the player wants to cash out
  //   - Returns: Array of 100 outcomes (win/lose), with house edge applied
  crash: {
    calculateBetArray: (targetMultiplier: number) => {
      // Calculate the payout multiplier with house edge
      const houseMultiplier = targetMultiplier * RTP_TARGETS.crash;
      // Probability of winning = 1 / targetMultiplier
      const crashProbability = 1 / targetMultiplier;
      // Number of winning slots (rounded to nearest integer)
      const winSlots = Math.round(crashProbability * 100);
      // Remaining slots are losses
      const loseSlots = 100 - winSlots;
      // Return bet array: winSlots with payout, loseSlots with 0
      return [
        ...Array(winSlots).fill(houseMultiplier),
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
      // Calculate the payout multiplier for revealing a safe cell
      const GRID_SIZE = BET_ARRAYS.mines.GRID_SIZE;
      const safeCells = GRID_SIZE - mineCount;
      // Fair odds: safeCells / (safeCells - cellsRevealed)
      const fairMultiplier = safeCells / (safeCells - cellsRevealed);
      // Apply house edge
      return fairMultiplier * RTP_TARGETS.mines;
    },

    generateBetArray: (mineCount: number, cellsRevealed: number) => {
      // Generate a bet array for the current step in Mines
      const GRID_SIZE = BET_ARRAYS.mines.GRID_SIZE;
      const safeCells = GRID_SIZE - mineCount;
      const remainingSafeCells = safeCells - cellsRevealed;
      // Create array of GRID_SIZE, fill with 0 (mines)
      const betArray = Array(GRID_SIZE).fill(0);
      if (remainingSafeCells > 0) {
        // Calculate payout multiplier for this step
        const fairMultiplier = safeCells / (safeCells - cellsRevealed);
        const multiplier = fairMultiplier * RTP_TARGETS.mines;
        // Set winning outcomes for remaining safe cells
        for (let i = 0; i < remainingSafeCells; i++) {
          betArray[i] = multiplier;
        }
        // Remaining slots are losses (mines)
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
          const winProbability = winningCards / (RANKS - 1);
          const fairMultiplier = 1 / winProbability;
          const houseMultiplier = fairMultiplier * RTP_TARGETS.hilo;
          // Set winning outcomes for higher cards
          for (let i = currentRank + 1; i < RANKS; i++) {
            betArray[i] = houseMultiplier;
          }
        }
      } else {
        // Player bets next card will be lower
        const winningCards = currentRank;
        if (winningCards > 0) {
          const winProbability = winningCards / (RANKS - 1);
          const fairMultiplier = 1 / winProbability;
          const houseMultiplier = fairMultiplier * RTP_TARGETS.hilo;
          // Set winning outcomes for lower cards
          for (let i = 0; i < currentRank; i++) {
            betArray[i] = houseMultiplier;
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
 * - Validates that a bet array's RTP is within 1% of the target RTP for a game.
 * - @param gameKey The game key (e.g., 'flip', 'dice')
 * - @param betArray The bet array to validate
 * - @returns true if within tolerance, false otherwise
 */
export const validateRTP = (gameKey: GameKey, betArray: number[]): boolean => {
  const actualRTP = calculateAverageRTP(betArray);
  const targetRTP = RTP_TARGETS[gameKey];
  const tolerance = 0.01; // 1% tolerance
  return Math.abs(actualRTP - targetRTP) <= tolerance;
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
