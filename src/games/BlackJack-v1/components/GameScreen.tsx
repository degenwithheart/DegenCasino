import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { PublicKey } from '@solana/web3.js'
import { Multiplayer, TokenValue, GambaUi } from 'gamba-react-ui-v2'
import { useGame } from 'gamba-react-v2'
import { makeDeterministicRng } from '../../../fairness/deterministicRng'
import { useSound } from 'gamba-react-ui-v2'
import { Card } from '../Card'
import { RANK_SYMBOLS, SUIT_SYMBOLS, CARD_VALUES } from '../constants'
import cardSnd from '../sounds/card.mp3'
import winSnd from '../sounds/win.mp3'
import win2Snd from '../sounds/win2.mp3'
import loseSnd from '../sounds/lose.mp3'
import playSnd from '../sounds/play.mp3'

const shorten = (pk: PublicKey) =>
  pk.toBase58().slice(0, 4) + '...'

const GameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b, #334155);
  position: relative;
  overflow: hidden;
`

const GameTable = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`

const PlayerArea = styled.div<{ isWinner?: boolean; isLoser?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid ${({ isWinner, isLoser }) => 
    isWinner ? '#22c55e' : isLoser ? '#ef4444' : '#374151'
  };
  border-radius: 16px;
  background: ${({ isWinner, isLoser }) => 
    isWinner 
      ? 'rgba(34, 197, 94, 0.1)' 
      : isLoser 
      ? 'rgba(239, 68, 68, 0.1)'
      : 'rgba(0, 0, 0, 0.3)'
  };
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  
  ${({ isWinner }) => isWinner && `
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
  `}
  
  ${({ isLoser }) => isLoser && `
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
  `}
`

const PlayerInfo = styled.div`
  text-align: center;
  color: #e5e5e5;
`

const PlayerName = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #f0f0ff;
`

const PlayerStats = styled.div`
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #d1d5db;
`

const CardsArea = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  min-height: 120px;
  align-items: center;
`

const HandValue = styled.div<{ isBust?: boolean; isBlackjack?: boolean }>`
  font-size: 24px;
  font-weight: bold;
  color: ${({ isBust, isBlackjack }) => 
    isBust ? '#ef4444' : isBlackjack ? '#fbbf24' : '#4ade80'
  };
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
`

const CenterArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
`

const GameStatus = styled.div`
  text-align: center;
  color: #f0f0ff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
`

const PotInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  border: 1px solid #374151;
`

const PotLabel = styled.div`
  font-size: 14px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const PotAmount = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #fbbf24;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
`

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  color: #d1d5db;
`

const WaitingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #9ca3af;
  font-size: 16px;
`

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 16px;
  background: rgba(107, 114, 128, 0.2);
  color: #d1d5db;
  border: 1px solid #374151;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(107, 114, 128, 0.3);
  }
`

const PlayButton = styled.button`
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  font-size: 18px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

// Internal deterministic card representation
interface BlackjackCard { rankIndex: number; suitIndex: number }

// Local derived state from chain multiplayer account
interface GameStateDerived {
  phase: 'waiting' | 'ready' | 'dealing' | 'finished'
  winner?: number
}

// Card generation functions (like original BlackJack)
// RNG seeded per settlement (using on-chain winner + players) for deterministic deal
let roundRng: (() => number) | null = null
const rand = () => (roundRng ? roundRng() : 0)

// Helpers for value calculation
const cardValue = (c: BlackjackCard) => CARD_VALUES[c.rankIndex]
const handValue = (cards: BlackjackCard[]) => {
  let total = 0
  let aces = 0
  for (const c of cards) {
    if (RANK_SYMBOLS[c.rankIndex] === 'A') { aces++; total += 11 } else total += cardValue(c)
  }
  while (total > 21 && aces > 0) { total -= 10; aces-- }
  return total
}

// Build & shuffle a deck deterministically using current roundRng
const buildShuffledDeck = () => {
  const deck: BlackjackCard[] = []
  const ranks = Object.keys(RANK_SYMBOLS).length
  const suits = Object.keys(SUIT_SYMBOLS).length
  for (let r = 0; r < ranks; r++) {
    for (let s = 0; s < suits; s++) deck.push({ rankIndex: r, suitIndex: s })
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

interface DealtHand { cards: BlackjackCard[]; value: number; isBlackjack: boolean; isBust: boolean }

const computeDeterministicHands = (winnerIndex: number, playersLen: number) => {
  roundRng || (roundRng = makeDeterministicRng('fallback'))
  const deck = buildShuffledDeck()
  const used = new Set<number>()
  // pick best winner pair
  let winnerPair: number[] | null = null
  let winnerScore = -1
  for (let i = 0; i < deck.length - 1; i++) {
    if (used.has(i) || used.has(i+1)) continue
    const pair = [deck[i], deck[i+1]]
    const score = handValue(pair)
    if (score <= 21 && score > winnerScore) {
      winnerScore = score
      winnerPair = [i, i+1]
      if (score === 21) break
    }
  }
  if (!winnerPair) winnerPair = [0,1]
  used.add(winnerPair[0]); used.add(winnerPair[1])

  // pick loser pair (first valid with score < winnerScore or bust)
  let loserPair: number[] | null = null
  for (let i = 0; i < deck.length - 1; i++) {
    if (used.has(i) || used.has(i+1)) continue
    const pair = [deck[i], deck[i+1]]
    const score = handValue(pair)
    if (score < winnerScore || score > 21) { loserPair = [i,i+1]; break }
  }
  if (!loserPair) {
    for (let i = 0; i < deck.length -1; i++) if (!used.has(i) && !used.has(i+1)) { loserPair = [i,i+1]; break }
  }
  if (!loserPair) loserPair = [2,3]
  used.add(loserPair[0]); used.add(loserPair[1])

  const hands: DealtHand[] = []
  for (let p = 0; p < playersLen; p++) {
    let pairIdx = p === winnerIndex ? winnerPair : loserPair
    const cards = pairIdx.map(i => deck[i])
    const val = handValue(cards)
    const isBlackjack = val === 21 && cards.length === 2
    const isBust = val > 21
    hands.push({ cards, value: val, isBlackjack, isBust })
  }
  return hands
}

export default function GameScreen({ 
  gameId, 
  onBack 
}: { 
  gameId: PublicKey
  onBack: () => void 
}) {
  const { game: mpGame } = useGame(gameId, { fetchMetadata: true })
  // Future mapping plan:
  // 1. Obtain resultIndex / serverSeedHash / clientSeed / nonce from multiplayer resolution.
  // 2. Derive HMAC -> byte stream -> card sequence using makeDeterministicRng(seedString).
  // 3. Distribute first two cards to each player, then dealer logic (if implemented) deterministically.
  // 4. Store derived card list locally for replay & verification panel.
  const [gameState, setGameState] = useState<GameStateDerived | null>(null)
  const [hands, setHands] = useState<DealtHand[] | null>(null)
  const [isDealing, setIsDealing] = useState(false)
  
  const sounds = useSound({
    card: cardSnd,
    win: winSnd,
    win2: win2Snd,
    lose: loseSnd,
    play: playSnd,
  })

  // Initialize game when component mounts
  useEffect(() => {
    setGameState(prev => {
      if (!mpGame) return prev
      if (mpGame.state.settled) return { phase: 'finished', winner: mpGame.winnerIndexes[0] }
      if (mpGame.players.length === 2) return { phase: 'ready' }
      return { phase: 'waiting' }
    })
  }, [mpGame])

  // When game settles, derive deterministic hands once
  useEffect(() => {
    if (mpGame?.state.settled && gameState?.winner != null && !hands) {
      const seedBase = `${gameId.toBase58?.() || ''}:${mpGame.winnerIndexes[0]}:${mpGame.players.map(p=>p.user.toBase58()).join(',')}`
      roundRng = makeDeterministicRng(seedBase)
      const dealt = computeDeterministicHands(gameState.winner, mpGame.players.length)
      setHands(dealt)
    }
  }, [mpGame, gameState, hands, gameId])

  const playDuel = async () => {
    if (!gameState || isDealing) return
    
    try {
  setIsDealing(true)
  sounds.play('play')

      // Set phase to ready
      setGameState(prev => prev ? { ...prev, phase: 'ready' } : null)

  // Simulate retrieving an on-chain game result (placeholder):
  // Derive a stable deterministic seed from gameId + current pot + player pubkeys ordering.
  // In real integration, you'd fetch resultIndex & seeds from chain and hash them.
  const seedBase = `${gameId.toBase58?.() || ''}:${mpGame?.players.map(p=>p.user.toBase58()).join(',')}:manual` // manual trigger seed
  roundRng = makeDeterministicRng(seedBase)
  // Simulated resultIndex derived once (0..9999) to show potential future mapping space
  const resultIndex = Math.floor(rand() * 10000)
  // Winner derived from resultIndex parity (example mapping)
  const winner = resultIndex % 2
  // loser index not needed beyond potential UI expansions
      
  // In absence of chain settle action, we simulate immediate settlement locally (dev only)
  setGameState({ phase: 'finished', winner })
  const dealt = computeDeterministicHands(winner, mpGame?.players.length || 2)
  setHands(dealt)
  // Play result sound (jackpot sound if blackjack)
  if (dealt[winner].isBlackjack) {
    sounds.play('win2')
  } else {
    sounds.play('win')
  }
      
    } catch (error) {
      console.error('Failed to play duel:', error)
    } finally {
      setIsDealing(false)
    }
  }

  // TODO: When on-chain blackjack logic finalized, animate card distribution from deterministic seed

  if (!gameState) {
    return (
      <GameWrapper>
        <BackButton onClick={onBack}>← Back to Lobby</BackButton>
        <LoadingState>
          <div>Loading game...</div>
        </LoadingState>
      </GameWrapper>
    )
  }

  if (gameState.phase === 'waiting') {
    return (
      <GameWrapper>
        <BackButton onClick={onBack}>← Back to Lobby</BackButton>
        <CenterArea>
          <WaitingMessage>
            <h2>🃏 Waiting for opponent...</h2>
            <p>Share this game ID to invite someone to duel:</p>
            <code style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '4px' }}>
              {shorten(gameId)}
            </code>
          </WaitingMessage>
        </CenterArea>
      </GameWrapper>
    )
  }

  const players = mpGame?.players || []
  const player1 = players[0]
  const player2 = players[1]
  const isFinished = gameState?.phase === 'finished'
  const winner = gameState?.winner

  return (
    <GameWrapper>
      <BackButton onClick={onBack}>← Back to Lobby</BackButton>
      
      <GameTable>
        {/* Player 2 Area */}
        <PlayerArea 
          isWinner={isFinished && winner === 1} 
          isLoser={isFinished && winner === 0}
        >
          <PlayerInfo>
            <PlayerName>
              {player2 ? shorten(player2.publicKey) : 'Player 2'}
            </PlayerName>
            {player2 && (
              <PlayerStats>
                <div>Bet: <TokenValue amount={player2.pendingPayout || 0} /></div>
                <div>Status: {isFinished ? (winner === 1 ? 'Winner!' : 'Loser') : 'Ready'}</div>
              </PlayerStats>
            )}
          </PlayerInfo>
          
          <CardsArea>
            {hands && hands[1] && hands[1].cards.map((c,i)=> (
              <Card key={i} card={{ rank: RANK_SYMBOLS[c.rankIndex], suit: SUIT_SYMBOLS[c.suitIndex] }} />
            ))}
          </CardsArea>
          {hands && hands[1] && (
            <HandValue isBust={hands[1].isBust} isBlackjack={hands[1].isBlackjack}>
              {hands[1].value}
              {hands[1].isBlackjack && ' (Blackjack!)'}
              {hands[1].isBust && ' (Bust)'}
            </HandValue>
          )}
        </PlayerArea>

        {/* Center Area */}
        <CenterArea>
          <PotInfo>
            <PotLabel>Total Pot</PotLabel>
            <PotAmount>
              <TokenValue amount={(mpGame?.players || []).reduce((a,p)=> a + Number(p.pendingPayout||0), 0)} />
            </PotAmount>
          </PotInfo>
          
          <GameStatus>
            {gameState.phase === 'ready' && 'Ready to duel!'}
            {gameState.phase === 'dealing' && 'Dealing cards...'}
            {gameState.phase === 'finished' && (
              winner !== undefined 
                ? `Player ${winner + 1} wins the duel!`
                : 'Draw!'
            )}
          </GameStatus>

          {gameState.phase === 'ready' && !isDealing && (
            <PlayButton onClick={playDuel} disabled={isDealing}>
              🃏 Deal the Cards!
            </PlayButton>
          )}
        </CenterArea>

        {/* Player 1 Area */}
        <PlayerArea 
          isWinner={isFinished && winner === 0} 
          isLoser={isFinished && winner === 1}
        >
          <PlayerInfo>
            <PlayerName>
              {player1 ? shorten(player1.publicKey) : 'Player 1'}
            </PlayerName>
            {player1 && (
              <PlayerStats>
                <div>Bet: <TokenValue amount={player1.pendingPayout || 0} /></div>
                <div>Status: {isFinished ? (winner === 0 ? 'Winner!' : 'Loser') : 'Ready'}</div>
              </PlayerStats>
            )}
          </PlayerInfo>
          
          <CardsArea>
            {hands && hands[0] && hands[0].cards.map((c,i)=> (
              <Card key={i} card={{ rank: RANK_SYMBOLS[c.rankIndex], suit: SUIT_SYMBOLS[c.suitIndex] }} />
            ))}
          </CardsArea>
          {hands && hands[0] && (
            <HandValue isBust={hands[0].isBust} isBlackjack={hands[0].isBlackjack}>
              {hands[0].value}
              {hands[0].isBlackjack && ' (Blackjack!)'}
              {hands[0].isBust && ' (Bust)'}
            </HandValue>
          )}
        </PlayerArea>
      </GameTable>
    </GameWrapper>
  )
}
