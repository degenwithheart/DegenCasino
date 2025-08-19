import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { PublicKey } from '@solana/web3.js'
import { Multiplayer, TokenValue, GambaUi } from 'gamba-react-ui-v2'
import { useSound } from 'gamba-react-ui-v2'
import { Card } from '../Card'
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

// Types for the game state
interface BlackjackCard {
  suit: string
  rank: string
  value: number
}

interface GameState {
  phase: 'waiting' | 'ready' | 'dealing' | 'finished'
  players: Array<{
    publicKey: PublicKey
    cards: BlackjackCard[]
    handValue: number
    isBlackjack: boolean
    isBust: boolean
    bet: number
  }>
  winner?: number
  pot: number
  gameResult?: any
}

// Card generation functions (like original BlackJack)
const CARD_VALUES = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10] // A, 2-10, J, Q, K
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const SUITS = ['♠', '♥', '♦', '♣']

const createCard = (rankIndex?: number, suitIndex?: number): BlackjackCard => {
  const rank = rankIndex !== undefined ? rankIndex : Math.floor(Math.random() * RANKS.length)
  const suit = suitIndex !== undefined ? suitIndex : Math.floor(Math.random() * SUITS.length)
  
  return {
    rank: RANKS[rank],
    suit: SUITS[suit],
    value: CARD_VALUES[rank]
  }
}

const getHandValue = (cards: BlackjackCard[]): number => {
  let value = 0
  let aces = 0
  
  for (const card of cards) {
    if (card.rank === 'A') {
      aces++
      value += 11
    } else {
      value += card.value
    }
  }
  
  // Handle aces
  while (value > 21 && aces > 0) {
    value -= 10
    aces--
  }
  
  return value
}

const generateBlackjackHand = (): BlackjackCard[] => {
  const aceCard = createCard(0) // Ace
  const tenCards = [9, 10, 11, 12] // 10, J, Q, K
  const tenCard = createCard(tenCards[Math.floor(Math.random() * tenCards.length)])
  return [aceCard, tenCard]
}

const generateHandWithValue = (targetValue: number): BlackjackCard[] => {
  for (let attempts = 0; attempts < 100; attempts++) {
    const card1 = createCard()
    const card2 = createCard()
    const hand = [card1, card2]
    if (getHandValue(hand) === targetValue) {
      return hand
    }
  }
  // Fallback: create a simple hand
  return [createCard(1), createCard(targetValue - 2)] // 2 + (targetValue - 2)
}

const generateWinningHand = (): BlackjackCard[] => {
  const values = [17, 18, 19, 20, 21]
  const targetValue = values[Math.floor(Math.random() * values.length)]
  return targetValue === 21 ? generateBlackjackHand() : generateHandWithValue(targetValue)
}

const generateLosingHand = (againstValue: number): BlackjackCard[] => {
  let maxValue = againstValue - 1
  if (maxValue < 12) maxValue = 12 // Minimum reasonable losing value
  
  for (let attempts = 0; attempts < 100; attempts++) {
    const hand = [createCard(), createCard()]
    const value = getHandValue(hand)
    if (value <= maxValue) {
      return hand
    }
  }
  
  // Fallback: create a bust hand
  return [createCard(9), createCard(9)] // Two 10s = 20, but we'll adjust
}

export default function GameScreen({ 
  gameId, 
  onBack 
}: { 
  gameId: PublicKey
  onBack: () => void 
}) {
  const [gameState, setGameState] = useState<GameState | null>(null)
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
    const initializeGame = async () => {
      try {
        // Mock initial state - in real implementation, fetch from multiplayer API
        const initialState: GameState = {
          phase: 'waiting',
          players: [
            {
              publicKey: new PublicKey('11111111111111111111111111111111'),
              cards: [],
              handValue: 0,
              isBlackjack: false,
              isBust: false,
              bet: 100
            },
            {
              publicKey: new PublicKey('22222222222222222222222222222222'),
              cards: [],
              handValue: 0,
              isBlackjack: false,
              isBust: false,
              bet: 100
            }
          ],
          pot: 200
        }
        
        setGameState(initialState)
      } catch (error) {
        console.error('Failed to initialize game:', error)
      }
    }
    
    initializeGame()
  }, [gameId])

  const playDuel = async () => {
    if (!gameState || isDealing) return
    
    try {
      setIsDealing(true)
      sounds.play('play')

      // Set phase to ready
      setGameState(prev => prev ? { ...prev, phase: 'ready' } : null)

      // Simulate multiplayer game resolution (single transaction)
      // In real implementation, this would be done via Gamba multiplayer
      const winner = Math.random() < 0.5 ? 0 : 1 // Random winner for demo
      const loser = winner === 0 ? 1 : 0
      
      // Generate appropriate cards based on who won
      const winnerCards = Math.random() < 0.3 ? generateBlackjackHand() : generateWinningHand()
      const winnerValue = getHandValue(winnerCards)
      const loserCards = generateLosingHand(winnerValue)
      
      const updatedPlayers = [...gameState.players]
      updatedPlayers[winner].cards = winnerCards
      updatedPlayers[winner].handValue = winnerValue
      updatedPlayers[winner].isBlackjack = winnerValue === 21 && winnerCards.length === 2
      
      updatedPlayers[loser].cards = loserCards
      updatedPlayers[loser].handValue = getHandValue(loserCards)
      updatedPlayers[loser].isBust = updatedPlayers[loser].handValue > 21

      // Set to dealing phase and show cards one by one
      setGameState(prev => prev ? { 
        ...prev, 
        phase: 'dealing',
        players: updatedPlayers,
        winner 
      } : null)

      // Deal cards with animation
      await dealCardsWithAnimation(updatedPlayers)

      // Set final state
      setGameState(prev => prev ? { 
        ...prev, 
        phase: 'finished' 
      } : null)

      // Play result sound
      if (updatedPlayers[winner].isBlackjack) {
        sounds.play('win2') // Special sound for blackjack
      } else {
        sounds.play('win')
      }
      
    } catch (error) {
      console.error('Failed to play duel:', error)
    } finally {
      setIsDealing(false)
    }
  }

  const dealCardsWithAnimation = async (finalPlayers: GameState['players']) => {
    if (!gameState) return

    // Reset cards to empty
    setGameState(prev => prev ? {
      ...prev,
      players: prev.players.map(p => ({ ...p, cards: [], handValue: 0 }))
    } : null)

    // Deal first card to each player
    for (let cardIndex = 0; cardIndex < 2; cardIndex++) {
      for (let playerIndex = 0; playerIndex < finalPlayers.length; playerIndex++) {
        if (finalPlayers[playerIndex].cards[cardIndex]) {
          await new Promise(resolve => setTimeout(resolve, 500))
          sounds.play('card')
          
          setGameState(prev => {
            if (!prev) return null
            const updatedPlayers = [...prev.players]
            updatedPlayers[playerIndex].cards.push(finalPlayers[playerIndex].cards[cardIndex])
            updatedPlayers[playerIndex].handValue = getHandValue(updatedPlayers[playerIndex].cards)
            return { ...prev, players: updatedPlayers }
          })
        }
      }
    }
  }

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

  const [player1, player2] = gameState.players
  const isFinished = gameState.phase === 'finished'
  const winner = gameState.winner

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
                <div>Bet: <TokenValue amount={player2.bet} /></div>
                <div>Status: {isFinished ? (winner === 1 ? 'Winner!' : 'Loser') : 'Ready'}</div>
              </PlayerStats>
            )}
          </PlayerInfo>
          
          <CardsArea>
            {player2?.cards.map((card, index) => (
              <Card key={index} card={card} />
            ))}
          </CardsArea>
          
          {player2 && player2.cards.length > 0 && (
            <HandValue 
              isBust={player2.isBust} 
              isBlackjack={player2.isBlackjack}
            >
              {player2.handValue}
              {player2.isBlackjack && ' (Blackjack!)'}
              {player2.isBust && ' (Bust)'}
            </HandValue>
          )}
        </PlayerArea>

        {/* Center Area */}
        <CenterArea>
          <PotInfo>
            <PotLabel>Total Pot</PotLabel>
            <PotAmount>
              <TokenValue amount={gameState.pot} />
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
                <div>Bet: <TokenValue amount={player1.bet} /></div>
                <div>Status: {isFinished ? (winner === 0 ? 'Winner!' : 'Loser') : 'Ready'}</div>
              </PlayerStats>
            )}
          </PlayerInfo>
          
          <CardsArea>
            {player1?.cards.map((card, index) => (
              <Card key={index} card={card} />
            ))}
          </CardsArea>
          
          {player1 && player1.cards.length > 0 && (
            <HandValue 
              isBust={player1.isBust} 
              isBlackjack={player1.isBlackjack}
            >
              {player1.handValue}
              {player1.isBlackjack && ' (Blackjack!)'}
              {player1.isBust && ' (Bust)'}
            </HandValue>
          )}
        </PlayerArea>
      </GameTable>
    </GameWrapper>
  )
}
