// ========================================
// MULTIPLAYER GAMES RTP CONFIGURATION
// ========================================
// Centralized configuration for all multiplayer games
// Controls bet arrays, multipliers, and game customizations

import { BPS_PER_WHOLE } from 'gamba-core-v2'

// ========================================
// ROULETTE ROYALE CONFIGURATION
// ========================================
export const ROULETTE_ROYALE_CONFIG = {
  // Standard roulette payouts (European style - single zero)
  STRAIGHT_UP: 35,      // Single number
  SPLIT: 17,           // Two numbers
  STREET: 11,          // Three numbers
  CORNER: 8,           // Four numbers
  SIX_LINE: 5,         // Six numbers
  DOZEN: 2,            // 12 numbers
  COLUMN: 2,           // 12 numbers
  RED_BLACK: 1,        // 18 numbers
  ODD_EVEN: 1,         // 18 numbers
  HIGH_LOW: 1,         // 18 numbers
  
  // Multiplayer specific settings
  MAX_PLAYERS: 4,
  CHIPS_PER_PLAYER: 5,  // Number of chips each player can place
  BETTING_TIME_SECONDS: 45,
  MIN_WAGER: 0.01,
  MAX_WAGER_MULTIPLIER: 100, // Max wager = min_wager * this
  
  // Winner bonus multipliers (applied to base payout)
  WINNER_BONUS: {
    SINGLE_WINNER: 1.0,     // No bonus for single winner
    MULTIPLE_WINNERS: 0.9,  // Slight reduction if multiple winners on same number
  },
  
  // RTP: 97.3% (standard European roulette with slight house edge)
  HOUSE_EDGE: 0.027,
} as const

// ========================================
// SPEED MINING COMPETITION CONFIGURATION
// ========================================
export const SPEED_MINING_CONFIG = {
  // Grid and mine settings
  GRID_SIZE: 8,
  MINE_OPTIONS: [8, 12, 16, 20, 24], // Available mine counts
  DEFAULT_MINES: 16,
  
  // Race settings
  MAX_PLAYERS: 6,
  RACE_TIME_SECONDS: 90,
  GEMS_TO_WIN: 15, // First to find this many gems wins
  
  // Scoring system (points per gem found)
  GEM_POINTS: {
    EARLY: 3,    // First 5 gems
    MIDDLE: 2,   // Next 5 gems  
    LATE: 1,     // Remaining gems
  },
  
  // Multipliers based on final ranking
  WINNER_MULTIPLIERS: {
    FIRST_PLACE: 8.0,   // Winner takes all - high multiplier
    PARTICIPATION: 0.0, // No consolation prizes (Gamba one play rule)
  },
  
  // Risk/reward balance
  MINE_PENALTY: 0, // No penalty for hitting mines (just elimination)
  MIN_WAGER: 0.01,
  MAX_WAGER_MULTIPLIER: 50,
  
  // RTP: 96% (competitive racing with winner-takes-all)
  EXPECTED_RTP: 0.96,
} as const

// ========================================
// CARD DRAW SHOWDOWN CONFIGURATION  
// ========================================
export const CARD_SHOWDOWN_CONFIG = {
  // Game setup
  MAX_PLAYERS: 8,
  CARDS_PER_HAND: 5,
  BETTING_TIME_SECONDS: 30,
  
  // Hand ranking multipliers (winner-takes-all basis)
  HAND_MULTIPLIERS: {
    'ROYAL_FLUSH': 50.0,     // Impossible to lose with this
    'STRAIGHT_FLUSH': 40.0,
    'FOUR_KIND': 25.0,
    'FULL_HOUSE': 15.0,
    'FLUSH': 10.0,
    'STRAIGHT': 8.0,
    'THREE_KIND': 6.0,
    'TWO_PAIR': 4.0,
    'PAIR': 2.5,
    'HIGH_CARD': 2.0,
  },
  
  // Tiebreaker rules (when same hand type)
  KICKER_BONUS: 0.1, // Small bonus for higher kickers
  
  // Wager limits
  MIN_WAGER: 0.01,
  MAX_WAGER_MULTIPLIER: 75,
  
  // Special scenarios
  DEAD_HEAT_SPLIT: true, // Split pot if exact tie (rare)
  
  // RTP: 95% (skill element with winner-takes-all)
  EXPECTED_RTP: 0.95,
} as const

// ========================================
// SHARED MULTIPLAYER CONSTANTS
// ========================================
export const MULTIPLAYER_SHARED = {
  // Platform settings
  PLATFORM_FEE_BPS: 500, // 5% platform fee
  CREATOR_FEE_BPS: 200,  // 2% creator fee
  
  // Timing
  LOBBY_TIMEOUT_SECONDS: 300, // 5 minutes max lobby time
  RESULT_DISPLAY_SECONDS: 10,
  
  // Connection
  RECONNECT_ATTEMPTS: 3,
  HEARTBEAT_INTERVAL: 5000,
  
  // UI
  ANIMATION_DURATION: 2000,
  CELEBRATION_DURATION: 5000,
} as const

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Calculate expected payout for multiplayer game
 */
export function calculateMultiplayerPayout(
  totalWagers: number,
  playerCount: number,
  platformFeeBps: number = MULTIPLAYER_SHARED.PLATFORM_FEE_BPS,
  creatorFeeBps: number = MULTIPLAYER_SHARED.CREATOR_FEE_BPS
): number {
  const totalFees = (platformFeeBps + creatorFeeBps) / BPS_PER_WHOLE
  const netPool = totalWagers * (1 - totalFees)
  return netPool // Winner takes all
}

/**
 * Get bet array for roulette bet type
 */
export function getRouletteRoyaleBetArray(betType: string, numbers: number[]): number[] {
  const config = ROULETTE_ROYALE_CONFIG
  const totalNumbers = 37 // European roulette (0-36)
  const betArray = new Array(totalNumbers).fill(0)
  
  let multiplier: number
  switch (betType) {
    case 'STRAIGHT_UP': multiplier = config.STRAIGHT_UP; break
    case 'SPLIT': multiplier = config.SPLIT; break
    case 'STREET': multiplier = config.STREET; break
    case 'CORNER': multiplier = config.CORNER; break
    case 'SIX_LINE': multiplier = config.SIX_LINE; break
    case 'DOZEN': 
    case 'COLUMN': multiplier = config.DOZEN; break
    case 'RED_BLACK':
    case 'ODD_EVEN': 
    case 'HIGH_LOW': multiplier = config.RED_BLACK; break
    default: multiplier = 0
  }
  
  // Set multiplier for winning numbers
  numbers.forEach(num => {
    if (num >= 0 && num < totalNumbers) {
      betArray[num] = multiplier
    }
  })
  
  return betArray
}

/**
 * Get speed mining bet array based on performance
 */
export function getSpeedMiningBetArray(
  playerRank: number,
  totalPlayers: number
): number[] {
  const config = SPEED_MINING_CONFIG
  const betArray = new Array(2).fill(0) // [lose, win]
  
  if (playerRank === 1) {
    // Winner takes all
    betArray[1] = config.WINNER_MULTIPLIERS.FIRST_PLACE
  }
  // All other players get 0 (lose their wager)
  
  return betArray
}

/**
 * Get card showdown bet array based on hand strength
 */
export function getCardShowdownBetArray(
  handRank: string,
  isWinner: boolean
): number[] {
  const config = CARD_SHOWDOWN_CONFIG
  const betArray = new Array(2).fill(0) // [lose, win]
  
  if (isWinner) {
    const multiplier = config.HAND_MULTIPLIERS[handRank as keyof typeof config.HAND_MULTIPLIERS] || 2.0
    betArray[1] = multiplier
  }
  // Losers get 0
  
  return betArray
}

// ========================================
// TYPE EXPORTS
// ========================================
export type RouletteRoyaleConfig = typeof ROULETTE_ROYALE_CONFIG
export type SpeedMiningConfig = typeof SPEED_MINING_CONFIG  
export type CardShowdownConfig = typeof CARD_SHOWDOWN_CONFIG
export type MultiplayerSharedConfig = typeof MULTIPLAYER_SHARED