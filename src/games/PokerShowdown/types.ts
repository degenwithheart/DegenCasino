// Type definitions for Poker Showdown game
export interface Card {
  rank: number  // 0-12 (A,2,3,4,5,6,7,8,9,T,J,Q,K)
  suit: number  // 0-3 (♠,♥,♦,♣)
}

export interface DrawStrategy {
  keepPairs: boolean           // Keep any pair or better
  keepHighCards: boolean       // Keep face cards/aces (10+)
  drawToFlush: boolean         // Draw to flush draws (4 suited cards)
  drawToStraight: boolean      // Draw to straight draws (4 in sequence)
  riskLevel: 'conservative' | 'balanced' | 'aggressive'
}

export interface HandEvaluation {
  rank: HandRank
  name: string
  kickers: number[]            // For tiebreaking
  value: number               // Numerical hand strength
}

export interface PlayerResult {
  playerIndex: number
  playerId: string
  initialHand: Card[]
  finalHand: Card[]
  discardIndices: number[]
  handEval: HandEvaluation
  strategy: DrawStrategy
  isWinner: boolean
  payout: number
}

export interface GameResult {
  players: PlayerResult[]
  winnerIndex: number
  totalPot: number
  gameId: string
  seed: string
}

export type HandRank = 
  | 'ROYAL_FLUSH'
  | 'STRAIGHT_FLUSH' 
  | 'FOUR_KIND'
  | 'FULL_HOUSE'
  | 'FLUSH'
  | 'STRAIGHT'
  | 'THREE_KIND'
  | 'TWO_PAIR'
  | 'PAIR'
  | 'HIGH_CARD'

export const HAND_RANKINGS: Record<HandRank, number> = {
  'HIGH_CARD': 1,
  'PAIR': 2,
  'TWO_PAIR': 3,
  'THREE_KIND': 4,
  'STRAIGHT': 5,
  'FLUSH': 6,
  'FULL_HOUSE': 7,
  'FOUR_KIND': 8,
  'STRAIGHT_FLUSH': 9,
  'ROYAL_FLUSH': 10,
}

export const HAND_NAMES: Record<HandRank, string> = {
  'HIGH_CARD': 'High Card',
  'PAIR': 'Pair',
  'TWO_PAIR': 'Two Pair',
  'THREE_KIND': 'Three of a Kind',
  'STRAIGHT': 'Straight',
  'FLUSH': 'Flush',
  'FULL_HOUSE': 'Full House',
  'FOUR_KIND': 'Four of a Kind',
  'STRAIGHT_FLUSH': 'Straight Flush',
  'ROYAL_FLUSH': 'Royal Flush',
}

export const RANK_NAMES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
export const SUIT_SYMBOLS = ['♠', '♥', '♦', '♣']
export const SUIT_COLORS = ['#000000', '#ff0000', '#ff0000', '#000000'] // Black, Red, Red, Black

// Default strategies
export const STRATEGY_PRESETS: Record<string, DrawStrategy> = {
  CONSERVATIVE: {
    keepPairs: true,
    keepHighCards: true,
    drawToFlush: false,
    drawToStraight: false,
    riskLevel: 'conservative'
  },
  BALANCED: {
    keepPairs: true,
    keepHighCards: true,
    drawToFlush: true,
    drawToStraight: false,
    riskLevel: 'balanced'
  },
  AGGRESSIVE: {
    keepPairs: false,
    keepHighCards: false,
    drawToFlush: true,
    drawToStraight: true,
    riskLevel: 'aggressive'
  }
}