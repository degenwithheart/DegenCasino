import { Card, HandRank, HandEvaluation, HAND_RANKINGS } from '../types'

/**
 * Evaluate a 5-card poker hand
 * Returns hand rank and evaluation details
 */
export function evaluatePokerHand(cards: Card[]): HandEvaluation {
  if (cards.length !== 5) {
    throw new Error('Hand must contain exactly 5 cards')
  }

  // Sort cards by rank for easier analysis
  const sorted = [...cards].sort((a, b) => a.rank - b.rank)
  const ranks = sorted.map(c => c.rank)
  const suits = sorted.map(c => c.suit)

  // Count rank frequencies
  const rankCounts: Record<number, number> = {}
  ranks.forEach(rank => {
    rankCounts[rank] = (rankCounts[rank] || 0) + 1
  })

  const counts = Object.values(rankCounts).sort((a, b) => b - a)
  const uniqueRanks = Object.keys(rankCounts).map(Number).sort((a, b) => b - a)

  // Check for flush
  const isFlush = suits.every(suit => suit === suits[0])

  // Check for straight
  const isStraight = checkStraight(ranks)
  const isWheelStraight = checkWheelStraight(ranks) // A-2-3-4-5

  // Determine hand rank
  let handRank: HandRank
  let kickers: number[] = []

  if (isFlush && (isStraight || isWheelStraight)) {
    if (ranks.includes(12) && ranks.includes(11) && ranks.includes(10) && ranks.includes(9) && ranks.includes(0)) {
      handRank = 'ROYAL_FLUSH'
    } else {
      handRank = 'STRAIGHT_FLUSH'
      kickers = isWheelStraight ? [3] : [Math.max(...ranks)] // High card of straight
    }
  } else if (counts[0] === 4) {
    handRank = 'FOUR_KIND'
    const quadRank = Number(Object.keys(rankCounts).find(k => rankCounts[Number(k)] === 4))
    const kickerRank = Number(Object.keys(rankCounts).find(k => rankCounts[Number(k)] === 1))
    kickers = [quadRank, kickerRank]
  } else if (counts[0] === 3 && counts[1] === 2) {
    handRank = 'FULL_HOUSE'
    const tripRank = Number(Object.keys(rankCounts).find(k => rankCounts[Number(k)] === 3))
    const pairRank = Number(Object.keys(rankCounts).find(k => rankCounts[Number(k)] === 2))
    kickers = [tripRank, pairRank]
  } else if (isFlush) {
    handRank = 'FLUSH'
    kickers = uniqueRanks // All cards matter for flush
  } else if (isStraight || isWheelStraight) {
    handRank = 'STRAIGHT'
    kickers = isWheelStraight ? [3] : [Math.max(...ranks)] // High card of straight
  } else if (counts[0] === 3) {
    handRank = 'THREE_KIND'
    const tripRank = Number(Object.keys(rankCounts).find(k => rankCounts[Number(k)] === 3))
    const kickerRanks = uniqueRanks.filter(r => r !== tripRank)
    kickers = [tripRank, ...kickerRanks]
  } else if (counts[0] === 2 && counts[1] === 2) {
    handRank = 'TWO_PAIR'
    const pairRanks = Object.keys(rankCounts)
      .filter(k => rankCounts[Number(k)] === 2)
      .map(Number)
      .sort((a, b) => b - a)
    const kickerRank = Number(Object.keys(rankCounts).find(k => rankCounts[Number(k)] === 1))
    kickers = [...pairRanks, kickerRank]
  } else if (counts[0] === 2) {
    handRank = 'PAIR'
    const pairRank = Number(Object.keys(rankCounts).find(k => rankCounts[Number(k)] === 2))
    const kickerRanks = uniqueRanks.filter(r => r !== pairRank)
    kickers = [pairRank, ...kickerRanks]
  } else {
    handRank = 'HIGH_CARD'
    kickers = uniqueRanks
  }

  // Calculate numerical value for comparison
  const value = calculateHandValue(handRank, kickers)

  return {
    rank: handRank,
    name: getHandName(handRank, kickers),
    kickers,
    value
  }
}

/**
 * Check if ranks form a straight
 */
function checkStraight(ranks: number[]): boolean {
  const sorted = Array.from(new Set(ranks)).sort((a, b) => a - b)
  if (sorted.length !== 5) return false

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) {
      return false
    }
  }
  return true
}

/**
 * Check for wheel straight (A-2-3-4-5)
 */
function checkWheelStraight(ranks: number[]): boolean {
  const sorted = Array.from(new Set(ranks)).sort((a, b) => a - b)
  return sorted.length === 5 && 
         sorted[0] === 0 && // Ace
         sorted[1] === 1 && // 2
         sorted[2] === 2 && // 3
         sorted[3] === 3 && // 4
         sorted[4] === 4    // 5
}

/**
 * Calculate numerical hand value for comparison
 */
function calculateHandValue(rank: HandRank, kickers: number[]): number {
  const baseValue = HAND_RANKINGS[rank] * 1000000
  
  // Add kicker values with decreasing significance
  let kickerValue = 0
  kickers.forEach((kicker, index) => {
    kickerValue += kicker * Math.pow(100, 4 - index)
  })
  
  return baseValue + kickerValue
}

/**
 * Get human-readable hand name
 */
function getHandName(rank: HandRank, kickers: number[]): string {
  const rankNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
  
  switch (rank) {
    case 'ROYAL_FLUSH':
      return 'Royal Flush'
    case 'STRAIGHT_FLUSH':
      return `Straight Flush, ${rankNames[kickers[0]]} high`
    case 'FOUR_KIND':
      return `Four ${rankNames[kickers[0]]}s`
    case 'FULL_HOUSE':
      return `Full House, ${rankNames[kickers[0]]}s over ${rankNames[kickers[1]]}s`
    case 'FLUSH':
      return `Flush, ${rankNames[kickers[0]]} high`
    case 'STRAIGHT':
      return `Straight, ${rankNames[kickers[0]]} high`
    case 'THREE_KIND':
      return `Three ${rankNames[kickers[0]]}s`
    case 'TWO_PAIR':
      return `Two Pair, ${rankNames[kickers[0]]}s and ${rankNames[kickers[1]]}s`
    case 'PAIR':
      return `Pair of ${rankNames[kickers[0]]}s`
    case 'HIGH_CARD':
      return `${rankNames[kickers[0]]} high`
    default:
      return 'Unknown hand'
  }
}

/**
 * Compare two hands - returns positive if hand1 wins, negative if hand2 wins, 0 for tie
 */
export function compareHands(hand1: HandEvaluation, hand2: HandEvaluation): number {
  return hand1.value - hand2.value
}

/**
 * Find the winner among multiple hands
 */
export function findWinner(hands: HandEvaluation[]): number[] {
  if (hands.length === 0) return []
  
  const maxValue = Math.max(...hands.map(h => h.value))
  const winners: number[] = []
  
  hands.forEach((hand, index) => {
    if (hand.value === maxValue) {
      winners.push(index)
    }
  })
  
  return winners
}