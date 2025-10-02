import { Card, DrawStrategy, HandEvaluation } from '../types'
import { evaluatePokerHand } from './HandEvaluator'

/**
 * Apply a player's strategy to determine which cards to discard
 */
export function applyStrategy(hand: Card[], strategy: DrawStrategy): number[] {
  const initialEval = evaluatePokerHand(hand)
  
  // Conservative strategy: Keep any made hand
  if (strategy.riskLevel === 'conservative') {
    return applyConservativeStrategy(hand, initialEval, strategy)
  }
  
  // Aggressive strategy: Always try to improve
  if (strategy.riskLevel === 'aggressive') {
    return applyAggressiveStrategy(hand, initialEval, strategy)
  }
  
  // Balanced strategy: Mix of safety and opportunity
  return applyBalancedStrategy(hand, initialEval, strategy)
}

/**
 * Conservative strategy: Keep strong hands, minimal risk
 */
function applyConservativeStrategy(
  hand: Card[], 
  evaluation: HandEvaluation, 
  strategy: DrawStrategy
): number[] {
  // Keep any pair or better if strategy says so
  if (strategy.keepPairs && evaluation.rank !== 'HIGH_CARD') {
    return [] // Keep all cards
  }
  
  // Keep high cards (face cards + aces)
  if (strategy.keepHighCards) {
    const discardIndices: number[] = []
    hand.forEach((card, index) => {
      // Discard cards 2-9 (ranks 1-7), keep T,J,Q,K,A (ranks 8,9,10,11,0)
      if (card.rank >= 1 && card.rank <= 7) {
        discardIndices.push(index)
      }
    })
    
    // Only discard if we keep at least 2 cards
    if (hand.length - discardIndices.length >= 2) {
      return discardIndices
    }
  }
  
  // Default: Keep highest 2 cards, discard rest
  const sorted = hand.map((card, index) => ({ card, index }))
    .sort((a, b) => {
      // Aces are high in this context
      const aRank = a.card.rank === 0 ? 13 : a.card.rank
      const bRank = b.card.rank === 0 ? 13 : b.card.rank
      return bRank - aRank
    })
  
  return sorted.slice(2).map(item => item.index).sort((a, b) => a - b)
}

/**
 * Aggressive strategy: Always try to improve, take risks
 */
function applyAggressiveStrategy(
  hand: Card[], 
  evaluation: HandEvaluation, 
  strategy: DrawStrategy
): number[] {
  // Check for flush draw (4 cards of same suit)
  if (strategy.drawToFlush) {
    const flushDraw = findFlushDraw(hand)
    if (flushDraw.length === 4) {
      const keepIndices = flushDraw
      return hand.map((_, index) => index).filter(i => !keepIndices.includes(i))
    }
  }
  
  // Check for straight draw
  if (strategy.drawToStraight) {
    const straightDraw = findStraightDraw(hand)
    if (straightDraw.length >= 4) {
      const keepIndices = straightDraw.slice(0, 4) // Keep best 4 for straight
      return hand.map((_, index) => index).filter(i => !keepIndices.includes(i))
    }
  }
  
  // If no draws, only keep pairs or face cards
  const keepIndices: number[] = []
  const ranks = hand.map(c => c.rank)
  
  // Keep pairs
  for (let i = 0; i < hand.length; i++) {
    const rank = hand[i].rank
    if (ranks.filter(r => r === rank).length >= 2) {
      keepIndices.push(i)
    }
  }
  
  // If no pairs and keepHighCards is true, keep aces and face cards
  if (keepIndices.length === 0 && strategy.keepHighCards) {
    hand.forEach((card, index) => {
      if (card.rank === 0 || card.rank >= 10) { // A, J, Q, K
        keepIndices.push(index)
      }
    })
  }
  
  return hand.map((_, index) => index).filter(i => !keepIndices.includes(i))
}

/**
 * Balanced strategy: Optimal poker play
 */
function applyBalancedStrategy(
  hand: Card[], 
  evaluation: HandEvaluation, 
  strategy: DrawStrategy
): number[] {
  // Keep any pair or better
  if (evaluation.rank !== 'HIGH_CARD') {
    if (strategy.keepPairs) {
      return getOptimalKeepForMadeHand(hand, evaluation)
    }
  }
  
  // Check for strong draws
  if (strategy.drawToFlush) {
    const flushDraw = findFlushDraw(hand)
    if (flushDraw.length === 4) {
      return hand.map((_, index) => index).filter(i => !flushDraw.includes(i))
    }
  }
  
  // For high card hands, use optimal strategy
  return getOptimalHighCardStrategy(hand, strategy)
}

/**
 * Find cards forming a flush draw (4 of same suit)
 */
function findFlushDraw(hand: Card[]): number[] {
  const suitCounts: Record<number, number[]> = {}
  
  hand.forEach((card, index) => {
    if (!suitCounts[card.suit]) {
      suitCounts[card.suit] = []
    }
    suitCounts[card.suit].push(index)
  })
  
  // Return indices of the suit with most cards if 4+
  for (const indices of Object.values(suitCounts)) {
    if (indices.length >= 4) {
      return indices.slice(0, 4)
    }
  }
  
  return []
}

/**
 * Find cards forming a straight draw
 */
function findStraightDraw(hand: Card[]): number[] {
  const sorted = hand.map((card, index) => ({
    rank: card.rank,
    index,
    // Convert aces to both high and low for straight detection
    straightRanks: card.rank === 0 ? [0, 13] : [card.rank]
  }))
  
  // Check for open-ended straight draws
  // This is a simplified version - could be expanded for inside straights
  const ranks = new Set(hand.map(c => c.rank))
  
  // Look for 4-card sequences
  for (let start = 0; start <= 9; start++) {
    const sequence = [start, start + 1, start + 2, start + 3]
    let matchingCards: number[] = []
    
    for (const card of sorted) {
      if (sequence.includes(card.rank) || 
          (card.rank === 0 && (sequence.includes(0) || sequence.includes(13)))) {
        matchingCards.push(card.index)
      }
    }
    
    if (matchingCards.length >= 4) {
      return matchingCards.slice(0, 4)
    }
  }
  
  return []
}

/**
 * Optimal strategy for made hands (pairs or better)
 */
function getOptimalKeepForMadeHand(hand: Card[], evaluation: HandEvaluation): number[] {
  const ranks = hand.map(c => c.rank)
  const discardIndices: number[] = []
  
  if (evaluation.rank === 'PAIR') {
    // Keep pair, discard other cards
    const pairRank = evaluation.kickers[0]
    hand.forEach((card, index) => {
      if (card.rank !== pairRank) {
        discardIndices.push(index)
      }
    })
  } else if (evaluation.rank === 'TWO_PAIR') {
    // Keep both pairs, discard kicker
    const pair1Rank = evaluation.kickers[0]
    const pair2Rank = evaluation.kickers[1]
    hand.forEach((card, index) => {
      if (card.rank !== pair1Rank && card.rank !== pair2Rank) {
        discardIndices.push(index)
      }
    })
  }
  // For trips or better, keep all cards
  
  return discardIndices.sort((a, b) => a - b)
}

/**
 * Optimal strategy for high card hands
 */
function getOptimalHighCardStrategy(hand: Card[], strategy: DrawStrategy): number[] {
  if (strategy.keepHighCards) {
    // Keep aces and face cards
    const discardIndices: number[] = []
    hand.forEach((card, index) => {
      if (card.rank >= 1 && card.rank <= 9) { // 2-T
        discardIndices.push(index)
      }
    })
    return discardIndices.sort((a, b) => a - b)
  }
  
  // Keep highest card, discard rest
  let highestIndex = 0
  let highestRank = hand[0].rank === 0 ? 13 : hand[0].rank // Ace high
  
  hand.forEach((card, index) => {
    const rank = card.rank === 0 ? 13 : card.rank
    if (rank > highestRank) {
      highestRank = rank
      highestIndex = index
    }
  })
  
  return hand.map((_, index) => index).filter(i => i !== highestIndex)
}

/**
 * Evaluate strategy effectiveness for learning/bonuses
 */
export function evaluateStrategyEffectiveness(
  initialHand: Card[],
  discardIndices: number[],
  finalHand: Card[],
  strategy: DrawStrategy
): 'optimal' | 'good' | 'poor' {
  // This is a simplified evaluation - could be much more sophisticated
  const initialEval = evaluatePokerHand(initialHand)
  const finalEval = evaluatePokerHand(finalHand)
  
  // If we improved the hand, it was at least good
  if (finalEval.value > initialEval.value) {
    return 'optimal'
  }
  
  // If we kept a made hand, it's good
  if (initialEval.rank !== 'HIGH_CARD' && discardIndices.length === 0) {
    return 'good'
  }
  
  // If we drew to reasonable draws, it's good
  if (discardIndices.length <= 3 && strategy.drawToFlush) {
    return 'good'
  }
  
  // Otherwise, could be improved
  return 'poor'
}