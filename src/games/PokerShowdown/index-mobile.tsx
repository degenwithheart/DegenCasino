import React, { useState, useRef, useEffect } from 'react'
import { GambaUi, TokenValue, useCurrentPool, useCurrentToken, useSound, useWagerInput, FAKE_TOKEN_MINT, useTokenMeta } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import styled from 'styled-components'
import { BET_ARRAYS } from '../rtpConfig'
import { useGameStats } from '../../hooks/game/useGameStats'
import { POKER_SHOWDOWN_CONFIG } from '../rtpConfigMultiplayer'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGameMeta } from '../useGameMeta'

// Import sounds
import SOUND_WIN from './sounds/win.mp3'
import SOUND_LOSE from './sounds/lose.mp3'
import SOUND_PLAY from './sounds/play.mp3'
import SOUND_CARD from './sounds/card.mp3'

// Types
interface Card {
  rank: number  // 0-12 (A,2,3,4,5,6,7,8,9,T,J,Q,K)
  suit: number  // 0-3 (♠,♥,♦,♣)
}

type HandRank = 
  | 'HIGH_CARD'
  | 'PAIR'
  | 'TWO_PAIR'
  | 'THREE_KIND'
  | 'STRAIGHT'
  | 'FLUSH'
  | 'FULL_HOUSE'
  | 'FOUR_KIND'
  | 'STRAIGHT_FLUSH'
  | 'ROYAL_FLUSH'

// Constants
const RANK_NAMES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
const SUIT_SYMBOLS = ['♠', '♥', '♦', '♣']
const SUIT_COLORS = ['#000000', '#ff0000', '#ff0000', '#000000']

const HAND_VALUES = {
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

const HAND_MULTIPLIERS = {
  'HIGH_CARD': 0,
  'PAIR': 1,
  'TWO_PAIR': 2,
  'THREE_KIND': 3,
  'STRAIGHT': 4,
  'FLUSH': 5,
  'FULL_HOUSE': 8,
  'FOUR_KIND': 15,
  'STRAIGHT_FLUSH': 25,
  'ROYAL_FLUSH': 100,
}

// Mobile-First Styled Components
const MobileGameContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0f1419 0%, #1a2332 25%, #2d3748 50%, #1a2332 75%, #0f1419 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

const MobileHeader = styled.div`
  padding: 16px 20px 8px 20px;
  background: rgba(15, 20, 25, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  z-index: 10;
`

const GameTitle = styled.h1`
  color: #ffd700;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  text-align: center;
`

const GameSubtitle = styled.p`
  color: #a0aec0;
  font-size: 14px;
  margin: 0;
  text-align: center;
`

const MobileGameArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  min-height: 0;
`

const ResultDisplay = styled.div<{ $hasResult: boolean; $isWin?: boolean }>`
  text-align: center;
  padding: 16px;
  margin-bottom: 20px;
  background: ${props => props.$hasResult 
    ? props.$isWin 
      ? 'rgba(255, 215, 0, 0.2)' 
      : 'rgba(160, 174, 192, 0.2)'
    : 'rgba(160, 174, 192, 0.1)'};
  border: 2px solid ${props => props.$hasResult 
    ? props.$isWin 
      ? 'rgba(255, 215, 0, 0.5)' 
      : 'rgba(160, 174, 192, 0.5)'
    : 'rgba(160, 174, 192, 0.3)'};
  border-radius: 16px;
  transition: all 0.3s ease;
`

const ResultText = styled.div<{ $hasResult: boolean; $isWin?: boolean }>`
  font-size: 16px;
  font-weight: ${props => props.$hasResult ? '700' : '400'};
  color: ${props => props.$hasResult 
    ? props.$isWin 
      ? '#ffd700' 
      : '#a0aec0'
    : '#a0aec0'};
  margin-bottom: 8px;
`

const WinAmountDisplay = styled.div`
  text-align: center;
  margin-bottom: 24px;
`

const WinAmount = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 4px;
`

const WinLabel = styled.div`
  font-size: 14px;
  color: #a0aec0;
`

const PokerTable = styled.div`
  background: linear-gradient(135deg, #1a5d1a 0%, #0d2818 70%);
  border: 3px solid #ffd700;
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`

const HandContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`

const HandLabel = styled.div`
  color: #ffd700;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
`

const CardsContainer = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
`

const Card = styled.div<{ $selected?: boolean; $revealed?: boolean }>`
  width: 50px;
  height: 70px;
  background: ${props => props.$revealed 
    ? '#fff' 
    : 'linear-gradient(135deg, #4a5568, #2d3748)'};
  border: 2px solid ${props => props.$selected ? '#ffd700' : '#666'};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  cursor: ${props => props.$revealed ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  position: relative;
  
  ${props => props.$selected && `
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
  `}
  
  &:active {
    transform: ${props => props.$revealed ? 'scale(0.98)' : 'none'};
  }
`

const CardRank = styled.div<{ $suit: number }>`
  color: ${props => SUIT_COLORS[props.$suit]};
  font-size: 14px;
  font-weight: 700;
`

const CardSuit = styled.div<{ $suit: number }>`
  color: ${props => SUIT_COLORS[props.$suit]};
  font-size: 16px;
  margin-top: 2px;
`

const ActionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`

const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  max-width: 120px;
  padding: 12px 8px;
  background: ${props => props.$variant === 'primary'
    ? 'linear-gradient(135deg, #ffd700, #daa520)'
    : 'rgba(15, 20, 25, 0.8)'};
  border: 2px solid ${props => props.$variant === 'primary' ? '#ffd700' : 'rgba(255, 215, 0, 0.3)'};
  border-radius: 8px;
  color: ${props => props.$variant === 'primary' ? '#1a2332' : '#ffd700'};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`

const WagerSection = styled.div`
  margin-bottom: 20px;
`

const WagerInput = styled.div`
  background: rgba(15, 20, 25, 0.8);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
`

const WagerLabel = styled.div`
  font-size: 14px;
  color: #a0aec0;
  margin-bottom: 12px;
`

const WagerAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 16px;
`

const WagerButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`

const WagerButton = styled.button`
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffd700;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(26, 35, 50, 1);
  }
`

const DealButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  background: ${props => props.$disabled 
    ? 'rgba(160, 174, 192, 0.4)' 
    : 'linear-gradient(135deg, #ffd700, #daa520)'};
  border: none;
  border-radius: 16px;
  padding: 18px;
  color: ${props => props.$disabled ? '#a0aec0' : '#1a2332'};
  font-size: 18px;
  font-weight: 700;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  box-shadow: ${props => props.$disabled 
    ? 'none' 
    : '0 4px 16px rgba(255, 215, 0, 0.4)'};
  
  ${props => !props.$disabled && `
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.6);
    }
  `}
`

// Helper functions
const generateDeck = (): Card[] => {
  const deck: Card[] = []
  for (let suit = 0; suit < 4; suit++) {
    for (let rank = 0; rank < 13; rank++) {
      deck.push({ rank, suit })
    }
  }
  return deck
}

const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const evaluateHand = (cards: Card[]): { rank: HandRank; multiplier: number } => {
  const ranks = cards.map(c => c.rank).sort((a, b) => a - b)
  const suits = cards.map(c => c.suit)
  
  // Count ranks
  const rankCounts = ranks.reduce((acc, rank) => {
    acc[rank] = (acc[rank] || 0) + 1
    return acc
  }, {} as Record<number, number>)
  
  const counts = Object.values(rankCounts).sort((a, b) => b - a)
  const isFlush = suits.every(suit => suit === suits[0])
  
  // Check for straight
  let isStraight = false
  if (ranks.length === 5) {
    // Normal straight
    isStraight = ranks[4] - ranks[0] === 4
    // Ace-low straight (A,2,3,4,5)
    if (!isStraight && ranks.join(',') === '0,1,2,3,12') {
      isStraight = true
    }
  }
  
  // Determine hand rank
  if (isFlush && isStraight) {
    // Check for royal flush (T,J,Q,K,A)
    if (ranks.join(',') === '0,9,10,11,12') {
      return { rank: 'ROYAL_FLUSH', multiplier: HAND_MULTIPLIERS.ROYAL_FLUSH }
    }
    return { rank: 'STRAIGHT_FLUSH', multiplier: HAND_MULTIPLIERS.STRAIGHT_FLUSH }
  }
  
  if (counts[0] === 4) {
    return { rank: 'FOUR_KIND', multiplier: HAND_MULTIPLIERS.FOUR_KIND }
  }
  
  if (counts[0] === 3 && counts[1] === 2) {
    return { rank: 'FULL_HOUSE', multiplier: HAND_MULTIPLIERS.FULL_HOUSE }
  }
  
  if (isFlush) {
    return { rank: 'FLUSH', multiplier: HAND_MULTIPLIERS.FLUSH }
  }
  
  if (isStraight) {
    return { rank: 'STRAIGHT', multiplier: HAND_MULTIPLIERS.STRAIGHT }
  }
  
  if (counts[0] === 3) {
    return { rank: 'THREE_KIND', multiplier: HAND_MULTIPLIERS.THREE_KIND }
  }
  
  if (counts[0] === 2 && counts[1] === 2) {
    return { rank: 'TWO_PAIR', multiplier: HAND_MULTIPLIERS.TWO_PAIR }
  }
  
  if (counts[0] === 2) {
    return { rank: 'PAIR', multiplier: HAND_MULTIPLIERS.PAIR }
  }
  
  return { rank: 'HIGH_CARD', multiplier: HAND_MULTIPLIERS.HIGH_CARD }
}

const MobilePokerGame: React.FC = () => {
  // Essential hooks
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const tokenMeta = useTokenMeta(token?.mint)
  const game = GambaUi.useGame()
  const gameStats = useGameStats('poker-showdown')
  
  // Game state
  const [gamePhase, setGamePhase] = useState<'betting' | 'dealt' | 'draw' | 'result'>('betting')
  const [hand, setHand] = useState<Card[]>([])
  const [selectedCards, setSelectedCards] = useState<boolean[]>([])
  const [handEvaluation, setHandEvaluation] = useState<{ rank: HandRank; multiplier: number } | null>(null)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [lastGameResult, setLastGameResult] = useState<'win' | 'lose' | null>(null)

  // Effects system
  const effectsRef = useRef<GameplayEffectsRef>(null)

  // Sound system
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    card: SOUND_CARD,
  })

  // Create bet array based on hand evaluation
  const createBetArray = () => {
    const betArray = Array(11).fill(0) // 0-10 for different hand rankings
    
    // Set multipliers for each hand rank (index matches HAND_VALUES - 1)
    Object.entries(HAND_VALUES).forEach(([handRank, value]) => {
      const multiplier = HAND_MULTIPLIERS[handRank as HandRank]
      if (multiplier > 0) {
        betArray[value] = multiplier + 1 // Add 1 to get total payout including original wager
      }
    })
    
    return betArray
  }

  const betArray = createBetArray()
  const maxMultiplier = Math.max(...betArray)
  const maxWin = wager * maxMultiplier
  const poolExceeded = maxWin > pool.maxPayout

  // Calculate min and max wagers
  const getMinimumWager = () => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      return tokenMeta?.baseWager ?? 0.01
    }
    
    const tokenPrice = tokenMeta?.usdPrice ?? 0
    if (tokenPrice > 0) {
      const tokenAmount = 1 / tokenPrice
      return tokenAmount
    }
    
    return tokenMeta?.baseWager ?? 0.01
  }

  const minWager = getMinimumWager()
  const maxWager = maxMultiplier > 0 ? Math.min(pool.maxPayout / maxMultiplier, pool.balance) : pool.balance

  const adjustWager = (factor: number) => {
    const newWager = Math.max(minWager, wager * factor)
    setWager(newWager)
  }

  const dealCards = async () => {
    if (wager <= 0) return
    
    try {
      setGamePhase('dealt')
      sounds.play('play')
      sounds.play('card')
      
      // Generate and deal 5 cards
      const deck = shuffleDeck(generateDeck())
      const newHand = deck.slice(0, 5)
      setHand(newHand)
      setSelectedCards([false, false, false, false, false])
      setHasPlayed(false)
      setLastGameResult(null)
      setHandEvaluation(null)
      
    } catch (error) {
      console.error('🃏 DEAL CARDS ERROR:', error)
    }
  }

  const toggleCardSelection = (index: number) => {
    if (gamePhase !== 'dealt') return
    
    sounds.play('card')
    setSelectedCards(prev => {
      const newSelection = [...prev]
      newSelection[index] = !newSelection[index]
      return newSelection
    })
  }

  const drawCards = async () => {
    if (gamePhase !== 'dealt') return
    
    try {
      setGamePhase('draw')
      sounds.play('card')
      
      // Replace selected cards with new ones
      const deck = shuffleDeck(generateDeck())
      let deckIndex = 5 // Start after initial 5 cards
      
      const newHand = hand.map((card, index) => {
        if (selectedCards[index]) {
          return deck[deckIndex++]
        }
        return card
      })
      
      setHand(newHand)
      
      // Evaluate final hand
      const evaluation = evaluateHand(newHand)
      setHandEvaluation(evaluation)
      
      // Play the game with blockchain
      await game.play({
        bet: betArray,
        wager,
        metadata: [evaluation.rank, evaluation.multiplier]
      })
      
      const result = await game.result()
      
      setTimeout(() => {
        setGamePhase('result')
        const won = result.payout > 0
        setLastGameResult(won ? 'win' : 'lose')
        
        const profit = result.payout - wager
        gameStats.updateStats(profit)
        
        if (won) {
          sounds.play('win')
          effectsRef.current?.winFlash('#ffd700', 1.5)
          
          if (evaluation.multiplier >= 50) {
            effectsRef.current?.screenShake(2, 1000)
          } else if (evaluation.multiplier >= 20) {
            effectsRef.current?.screenShake(1.5, 700)
          } else if (evaluation.multiplier >= 10) {
            effectsRef.current?.screenShake(1, 500)
          }
        } else {
          sounds.play('lose')
          effectsRef.current?.loseFlash('#a0aec0', 0.8)
        }
        
        setHasPlayed(true)
      }, 1000)
      
    } catch (error) {
      console.error('🃏 DRAW CARDS ERROR:', error)
      setGamePhase('betting')
    }
  }

  const resetGame = () => {
    setGamePhase('betting')
    setHand([])
    setSelectedCards([])
    setHandEvaluation(null)
    setHasPlayed(false)
    setLastGameResult(null)
  }

  return (
    <MobileGameContainer>
      {/* Header */}
      <MobileHeader>
        <GameTitle>🃏 Poker Showdown</GameTitle>
        <GameSubtitle>Mobile Edition • 5-Card Draw</GameSubtitle>
      </MobileHeader>

      {/* Game Area */}
      <MobileGameArea>
        {/* Result Display */}
        <ResultDisplay $hasResult={hasPlayed && lastGameResult !== null} $isWin={lastGameResult === 'win'}>
          <ResultText $hasResult={hasPlayed && lastGameResult !== null} $isWin={lastGameResult === 'win'}>
            {hasPlayed && handEvaluation ? 
              `${lastGameResult === 'win' ? 'WIN!' : 'BETTER LUCK NEXT TIME!'} - ${handEvaluation.rank.replace('_', ' ')}` : 
              'Deal cards and make the best poker hand!'
            }
          </ResultText>
        </ResultDisplay>

        {/* Win Amount Display */}
        <WinAmountDisplay>
          <WinAmount>
            <TokenValue exact amount={maxWin} />
          </WinAmount>
          <WinLabel>Max Win (Royal Flush: {maxMultiplier}x)</WinLabel>
        </WinAmountDisplay>

        {/* Poker Table */}
        <PokerTable>
          <HandContainer>
            <HandLabel>
              {gamePhase === 'betting' ? 'Place Your Bet' : 
               gamePhase === 'dealt' ? 'Select Cards to Discard' :
               gamePhase === 'draw' ? 'Drawing New Cards...' :
               handEvaluation ? handEvaluation.rank.replace('_', ' ') : 'Your Hand'}
            </HandLabel>
            
            {hand.length > 0 && (
              <CardsContainer>
                {hand.map((card, index) => (
                  <Card 
                    key={index}
                    $revealed={true}
                    $selected={selectedCards[index]}
                    onClick={() => toggleCardSelection(index)}
                  >
                    <CardRank $suit={card.suit}>
                      {RANK_NAMES[card.rank]}
                    </CardRank>
                    <CardSuit $suit={card.suit}>
                      {SUIT_SYMBOLS[card.suit]}
                    </CardSuit>
                  </Card>
                ))}
              </CardsContainer>
            )}
          </HandContainer>
        </PokerTable>

        {/* Actions Section */}
        {gamePhase === 'dealt' && (
          <ActionsSection>
            <ActionRow>
              <ActionButton onClick={() => setSelectedCards([false, false, false, false, false])}>
                Keep All
              </ActionButton>
              <ActionButton onClick={() => setSelectedCards([true, true, true, true, true])}>
                Discard All
              </ActionButton>
            </ActionRow>
            <ActionRow>
              <ActionButton $variant="primary" onClick={drawCards}>
                Draw Cards
              </ActionButton>
            </ActionRow>
          </ActionsSection>
        )}

        {/* Wager Section */}
        {gamePhase === 'betting' && (
          <WagerSection>
            <WagerInput>
              <WagerLabel>Wager Amount</WagerLabel>
              <WagerAmount>
                <TokenValue exact amount={wager} />
              </WagerAmount>
              <WagerButtons>
                <WagerButton onClick={() => adjustWager(0.5)}>1/2</WagerButton>
                <WagerButton onClick={() => adjustWager(2)}>2x</WagerButton>
                <WagerButton onClick={() => setWager(minWager)}>Min</WagerButton>
                <WagerButton onClick={() => setWager(maxWager)}>Max</WagerButton>
              </WagerButtons>
            </WagerInput>
          </WagerSection>
        )}

        {/* Deal/Play Again Button */}
        <DealButton 
          $disabled={
            gamba.isPlaying || 
            gamePhase === 'draw' || 
            (gamePhase === 'betting' && (wager <= 0 || poolExceeded))
          }
          onClick={gamePhase === 'result' ? resetGame : dealCards}
        >
          {gamePhase === 'betting' ? 'Deal Cards' :
           gamePhase === 'dealt' ? 'Select cards to discard, then draw' :
           gamePhase === 'draw' ? 'Drawing...' :
           'Play Again'}
        </DealButton>
      </MobileGameArea>

      <GameplayFrame
        ref={effectsRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1000
        }}
        {...(useGameMeta('poker-showdown') && {
          title: useGameMeta('poker-showdown')!.name,
          description: useGameMeta('poker-showdown')!.description
        })}
      />
    </MobileGameContainer>
  )
}

export default MobilePokerGame