import { makeDeterministicRng } from '../../../fairness/deterministicRng'
import { Card, DrawStrategy, PlayerResult, GameResult, HandEvaluation } from '../types'
import { evaluatePokerHand, findWinner } from './HandEvaluator'
import { applyStrategy, evaluateStrategyEffectiveness } from './StrategyEngine'
import { POKER_SHOWDOWN_CONFIG } from '../../rtpConfigMultiplayer'

/**
 * Create a standard 52-card deck
 */
function createDeck(): Card[] {
  const deck: Card[] = []
  
  for (let suit = 0; suit < 4; suit++) {
    for (let rank = 0; rank < 13; rank++) {
      deck.push({ rank, suit })
    }
  }
  
  return deck
}

/**
 * Shuffle deck using deterministic RNG
 */
function shuffleDeck(deck: Card[], rng: () => number): void {
  // Fisher-Yates shuffle with deterministic RNG
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
}

/**
 * Deal hands to multiple players from a shuffled deck
 */
function dealMultipleHands(playerCount: number, seed: string): Card[][] {
  const deck = createDeck()
  const rng = makeDeterministicRng(seed)
  shuffleDeck(deck, rng)
  
  const hands: Card[][] = []
  let cardIndex = 0
  
  for (let player = 0; player < playerCount; player++) {
    const hand: Card[] = []
    for (let card = 0; card < 5; card++) {
      hand.push(deck[cardIndex++])
    }
    hands.push(hand)
  }
  
  return hands
}

/**
 * Format a card for display
 */
function formatCard(card: Card): string {
  const suits = ['♠', '♥', '♦', '♣']
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
  return `${ranks[card.rank]}${suits[card.suit]}`
}

/**
 * Execute a complete poker showdown game in a single deterministic transaction
 */
export function executePokerShowdown(
  strategies: DrawStrategy[],
  playerIds: string[],
  totalPot: number,
  seed: string = Math.random().toString()
): GameResult {
  console.log('🎯 Executing poker showdown:', {
    playerCount: strategies.length,
    totalPot,
    strategies: strategies.map(s => s.riskLevel)
  })
  
  const players: PlayerResult[] = []
  const deckSeed = `poker-${seed}-deck`
  
  // Deal initial hands to all players
  const allHands = dealMultipleHands(strategies.length, deckSeed)
  
  for (let i = 0; i < strategies.length; i++) {
    const playerId = playerIds[i]
    const strategy = strategies[i]
    const initialHand = allHands[i]
    
    console.log(`🃏 Player ${i + 1} initial hand:`, initialHand.map(formatCard))
    
    // Apply strategy to get discard indices
    const discardIndices = applyStrategy(initialHand, strategy)
    
    // Create final hand by dealing new cards for discarded ones
    const finalHand = [...initialHand]
    const deck = createDeck()
    const rng = makeDeterministicRng(`${deckSeed}-${i}-draw`)
    shuffleDeck(deck, rng)
    
    // Replace discarded cards with new ones from deck
    let deckIndex = 0
    for (const discardIndex of discardIndices) {
      // Skip cards already in any player's initial hand
      while (allHands.flat().some(card => card.rank === deck[deckIndex].rank && card.suit === deck[deckIndex].suit)) {
        deckIndex++
      }
      finalHand[discardIndex] = deck[deckIndex++]
    }
    
    console.log(`🎯 Player ${i + 1} final hand:`, finalHand.map(formatCard))
    
    // Evaluate hand
    const handEval = evaluatePokerHand(finalHand)
    console.log(`🏆 Player ${i + 1} result:`, handEval)
    
    // Calculate base payout (will be adjusted for winner)
    const basePayout = 0 // Only winner gets payout
    
    players.push({
      playerId,
      playerIndex: i,
      initialHand,
      finalHand,
      discardIndices,
      handEval,
      payout: basePayout,
      strategy,
      isWinner: false // Will be set later
    })
  }
  
  // Determine winner using hand evaluator
  const winnerIndices = findWinner(players.map(p => p.handEval))
  const winnerIndex = winnerIndices[0] // Take first winner if tie
  
  // Award total pot to winner and mark as winner
  players[winnerIndex].payout = totalPot
  players[winnerIndex].isWinner = true
  
  const result: GameResult = {
    gameId: 'practice',
    players,
    winnerIndex,
    totalPot,
    seed
  }
  
  console.log('🎊 Game result:', {
    winner: `Player ${winnerIndex + 1}`,
    winningHand: players[winnerIndex].handEval.name,
    payout: totalPot
  })
  
  return result
}

/**
 * Simulate a game to determine the expected outcome for bet array calculation
 */
export function simulateGameOutcome(
  strategies: DrawStrategy[],
  seed: string
): { winnerIndex: number; winnerHandRank: number } {
  const deckSeed = `poker-sim-${seed}-deck`
  const allHands = dealMultipleHands(strategies.length, deckSeed)
  
  let winnerIndex = 0
  let bestValue = 0
  
  for (let i = 0; i < strategies.length; i++) {
    const strategy = strategies[i]
    const initialHand = allHands[i]
    
    // Apply strategy to get discard indices
    const discardIndices = applyStrategy(initialHand, strategy)
    
    // Create final hand by dealing new cards for discarded ones
    const finalHand = [...initialHand]
    const deck = createDeck()
    const rng = makeDeterministicRng(`${deckSeed}-${i}-draw`)
    shuffleDeck(deck, rng)
    
    // Replace discarded cards with new ones from deck
    let deckIndex = 0
    for (const discardIndex of discardIndices) {
      // Skip cards already in any player's initial hand
      while (allHands.flat().some(card => card.rank === deck[deckIndex].rank && card.suit === deck[deckIndex].suit)) {
        deckIndex++
      }
      finalHand[discardIndex] = deck[deckIndex++]
    }
    
    const handEval = evaluatePokerHand(finalHand)
    
    if (handEval.value > bestValue) {
      bestValue = handEval.value
      winnerIndex = i
    }
  }
  
  return { winnerIndex, winnerHandRank: bestValue }
}

/**
 * Calculate bet array for Gamba based on game result
 */
export function calculatePokerShowdownBetArray(
  playerCount: number,
  winnerHandRank: string
): number[] {
  const betArray = new Array(playerCount * 10).fill(0) // Extra slots for different outcomes
  
  // Winner gets the multiplier based on their hand
  const multiplier = POKER_SHOWDOWN_CONFIG.HAND_MULTIPLIERS[winnerHandRank as keyof typeof POKER_SHOWDOWN_CONFIG.HAND_MULTIPLIERS] || 1.8
  
  // Set winner position (first slot for simplicity)
  betArray[0] = multiplier
  
  return betArray
}