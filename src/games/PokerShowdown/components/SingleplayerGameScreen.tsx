import React, { useState, useCallback, useRef, useEffect } from 'react'
import { GambaUi, useSound, useWagerInput, useCurrentToken, TokenValue } from 'gamba-react-ui-v2'
import styled, { keyframes, css } from 'styled-components'
import { DrawStrategy, GameResult } from '../types'
import { POKER_COLORS, CONFIG, SOUND_WIN, SOUND_LOSE, SOUND_PLAY, SOUND_CARD } from '../constants'
import { executePokerShowdown, simulateGameOutcome } from '../engine/GameEngine'
import { POKER_SHOWDOWN_CONFIG, getPokerShowdownBetArray } from '../../rtpConfigMultiplayer'
import { EnhancedWagerInput, EnhancedButton, MobileControls, DesktopControls } from '../../../components'
import { useGameStats } from '../../../hooks/game/useGameStats'
import { GameStatsHeader } from '../../../components/Game/GameStatsHeader'
import GameplayFrame, { GameplayEffectsRef } from '../../../components/Game/GameplayFrame'

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.4); }
`

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`

// Mobile-first responsive container
const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

const TableArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  position: relative;
  min-height: 0; // Important for flex child
`

const PokerTable = styled.div`
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1.2;
  background: radial-gradient(ellipse at center, #1a5d1a 0%, #0d2818 70%);
  border: 3px solid #ffd700;
  border-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 0 20px rgba(255, 215, 0, 0.3),
    inset 0 0 30px rgba(0, 0, 0, 0.5);
  
  @media (min-width: 768px) {
    max-width: 500px;
  }
`

const CardsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin: 15px 0;
  
  @media (min-width: 768px) {
    gap: 12px;
  }
`

const Card = styled.div<{ $revealed?: boolean; $isWinning?: boolean }>`
  width: 45px;
  height: 63px;
  background: ${props => props.$revealed ? '#fff' : `url('/png/images/card.png')`};
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  border: 2px solid ${props => props.$isWinning ? '#ffd700' : '#333'};
  position: relative;
  transform-style: preserve-3d;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${slideIn} 0.5s ease-out;
  
  ${props => props.$isWinning && css`
    animation: ${glow} 2s infinite;
  `}
  
  ${props => props.$revealed && `
    transform: rotateY(180deg);
  `}
  
  @media (min-width: 768px) {
    width: 60px;
    height: 84px;
  }
  
    &::before {
    content: ${props => props.$revealed ? `'${props.children}'` : "''"};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotateY(180deg);
    font-size: 12px;
    font-weight: bold;
    color: ${props => props.$revealed ? '#000' : 'transparent'};
    
    @media (min-width: 768px) {
      font-size: 16px;
    }
  }
`

const HandLabel = styled.div`
  color: #ffd700;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 16px;
  }
`

const OpponentArea = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
`

const PlayerArea = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
`

const StatusDisplay = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #ffd700;
  border-radius: 15px;
  padding: 15px;
  margin: 10px;
  text-align: center;
  color: white;
  animation: ${slideIn} 0.5s ease-out;
`

const StrategySelector = styled.div`
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 15px;
`

const StrategyButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? '#ffd700' : 'transparent'};
  color: ${props => props.$active ? '#000' : '#ffd700'};
  border: 1px solid #ffd700;
  border-radius: 6px;
  padding: 8px 12px;
  margin: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #ffd700;
    color: #000;
  }
  
  @media (min-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
  }
`

const STRATEGY_PRESETS = {
  CONSERVATIVE: {
    keepPairs: true,
    keepHighCards: true, 
    drawToFlush: false,
    drawToStraight: false,
    riskLevel: 'conservative' as const,
    description: 'Play it safe - keep pairs and high cards'
  },
  BALANCED: {
    keepPairs: true,
    keepHighCards: true,
    drawToFlush: true, 
    drawToStraight: false,
    riskLevel: 'balanced' as const,
    description: 'Balanced approach - moderate risk/reward'
  },
  AGGRESSIVE: {
    keepPairs: false,
    keepHighCards: false,
    drawToFlush: true,
    drawToStraight: true, 
    riskLevel: 'aggressive' as const,
    description: 'High risk, high reward - chase big hands'
  }
}

interface SingleplayerGameScreenProps {
  onBack: () => void
}

export default function SingleplayerGameScreen({ onBack }: SingleplayerGameScreenProps) {
  const game = GambaUi.useGame()
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const effectsRef = useRef<GameplayEffectsRef>(null)
  
  // Game state
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gamePhase, setGamePhase] = useState<'setup' | 'playing' | 'results'>('setup')
  const [selectedStrategy, setSelectedStrategy] = useState<keyof typeof STRATEGY_PRESETS>('BALANCED')
  const [cardsRevealed, setCardsRevealed] = useState(false)
  
  // Statistics
  const gameStats = useGameStats('poker-showdown-singleplayer')
  
  // Sound effects
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    card: SOUND_CARD,
  })

  const handlePlay = useCallback(async () => {
    if (wager <= 0 || isPlaying) return
    
    setIsPlaying(true)
    setGamePhase('playing')
    setCardsRevealed(false)
    sounds.play('play')
    
    try {
      // Generate AI opponent with balanced strategy
      const playerStrategy = STRATEGY_PRESETS[selectedStrategy]
      const aiStrategy = STRATEGY_PRESETS.BALANCED // AI uses balanced strategy
      
      // Strategy influences the bet array odds
      const strategies = [playerStrategy, aiStrategy]
      
      // Get strategy-adjusted bet array - better strategies get better odds
      const betArray = getPokerShowdownBetArray(playerStrategy.riskLevel)
      
      // Execute Gamba transaction - let Gamba decide the outcome
      await game.play({
        bet: betArray,
        wager: wager,
        metadata: [
          playerStrategy.keepPairs ? 1 : 0,
          playerStrategy.keepHighCards ? 1 : 0,
          playerStrategy.drawToFlush ? 1 : 0,
          playerStrategy.drawToStraight ? 1 : 0,
          playerStrategy.riskLevel === 'aggressive' ? 2 : 
          playerStrategy.riskLevel === 'balanced' ? 1 : 0
        ]
      })
      
      // Get the Gamba result - this is the authoritative outcome
      const result = await game.result()
      const playerWins = result.payout > 0
      
      // Generate poker outcome that ALWAYS matches Gamba's decision
      // Skip the randomness - just create the logical outcome Gamba wants
      console.log('🎲 Creating deterministic outcome that matches Gamba decision:', playerWins ? 'WIN' : 'LOSE')
      
      // Use deterministic seed for variety (based on timestamp)
      const timestamp = Date.now()
      const fullResult = createDeterministicOutcome(playerWins, strategies, wager, timestamp)
      
      console.log(`🎯 Deterministic result created:`, {
        gambaWins: playerWins,
        playerWins: fullResult.winnerIndex === 0,
        playerHand: fullResult.players[0].handEval.name,
        aiHand: fullResult.players[1].handEval.name,
        playerValue: fullResult.players[0].handEval.value,
        aiValue: fullResult.players[1].handEval.value
      })
      
      // Set the actual payout from Gamba
      fullResult.players[0].payout = result.payout
      
      // Update payout based on actual game result from Gamba
      fullResult.players[0].payout = result.payout
      
      console.log('🎯 Game Result:', {
        winner: fullResult.winnerIndex === 0 ? 'Player' : 'AI',
        playerHand: fullResult.players[0].handEval.name,
        aiHand: fullResult.players[1].handEval.name,
        payout: fullResult.players[0].payout
      })
      
      setGameResult(fullResult)
      
      // Reveal cards with animation delay
      setTimeout(() => {
        setCardsRevealed(true)
        sounds.play('card')
      }, 1000)
      
      // Show results
      setTimeout(() => {
        setGamePhase('results')
        
        const humanWon = result.payout > 0
        gameStats.updateStats(result.payout)
        
        if (humanWon) {
          sounds.play('win')
          if (effectsRef.current) {
            effectsRef.current.winFlash('#ffd700', 3)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#ffd700', 30)
            }, 500)
          }
        } else {
          sounds.play('lose')
          if (effectsRef.current) {
            effectsRef.current.loseFlash('#f44336', 2)
          }
        }
      }, 2500)
      
    } catch (error) {
      console.error('❌ Singleplayer game failed:', error)
      setGamePhase('setup')
    } finally {
      setIsPlaying(false)
    }
  }, [wager, isPlaying, selectedStrategy, sounds, game, gameStats])

  const handleNewGame = useCallback(() => {
    setGameResult(null)
    setGamePhase('setup')
    setCardsRevealed(false)
  }, [])

  const formatSOL = (lamports: number) => {
    return (lamports / 1000000000).toFixed(4)
  }

  // Helper function to format a card for display
  const formatCard = (card: any) => {
    const suits = ['♠', '♥', '♦', '♣']
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    return `${ranks[card.rank]}${suits[card.suit]}`
  }

  // Helper function to get strategy payout info
  const getStrategyPayoutInfo = (strategyKey: keyof typeof STRATEGY_PRESETS) => {
    switch (strategyKey) {
      case 'AGGRESSIVE':
        return '4.0x'
      case 'BALANCED':
        return '2.5x'
      case 'CONSERVATIVE':
        return '2.2x'
      default:
        return '2.5x'
    }
  }

  // Helper to create deterministic poker outcome (like blackjack does)
  const createDeterministicOutcome = (playerShouldWin: boolean, strategies: any[], wager: number, timestamp: number) => {
    // Use timestamp for deterministic variety (no Math.random!)
    const scenario = timestamp % 6 // 6 different scenarios, deterministically chosen
    
    if (playerShouldWin) {
      // Player wins scenarios - player gets better hand
      switch (scenario) {
        case 0: // Full House vs Three of a Kind
          return createHandOutcome(
            [{ rank: 0, suit: 0 }, { rank: 0, suit: 1 }, { rank: 0, suit: 2 }, { rank: 12, suit: 0 }, { rank: 12, suit: 1 }], // AAA KK
            [{ rank: 11, suit: 0 }, { rank: 11, suit: 1 }, { rank: 11, suit: 2 }, { rank: 10, suit: 0 }, { rank: 9, suit: 0 }], // QQQ 10 9
            { rank: 'FULL_HOUSE', name: 'As full of Ks', value: 6000 },
            { rank: 'THREE_OF_A_KIND', name: 'Three Qs', value: 3000 },
            0, wager
          )
        case 1: // Straight vs Two Pair  
          return createHandOutcome(
            [{ rank: 0, suit: 0 }, { rank: 12, suit: 1 }, { rank: 11, suit: 2 }, { rank: 10, suit: 3 }, { rank: 9, suit: 0 }], // A K Q J 10 straight
            [{ rank: 12, suit: 0 }, { rank: 12, suit: 2 }, { rank: 11, suit: 0 }, { rank: 11, suit: 3 }, { rank: 8, suit: 1 }], // KK QQ 9
            { rank: 'STRAIGHT', name: 'A high straight', value: 4000 },
            { rank: 'TWO_PAIR', name: 'Ks and Qs', value: 2000 },
            0, wager
          )
        case 2: // Four of a Kind vs Full House
          return createHandOutcome(
            [{ rank: 10, suit: 0 }, { rank: 10, suit: 1 }, { rank: 10, suit: 2 }, { rank: 10, suit: 3 }, { rank: 0, suit: 0 }], // JJJJ A
            [{ rank: 9, suit: 0 }, { rank: 9, suit: 1 }, { rank: 9, suit: 2 }, { rank: 8, suit: 0 }, { rank: 8, suit: 1 }], // 999 88
            { rank: 'FOUR_OF_A_KIND', name: 'Four Js', value: 7000 },
            { rank: 'FULL_HOUSE', name: '10s full of 9s', value: 6000 },
            0, wager
          )
        case 3: // Three of a Kind vs Pair
          return createHandOutcome(
            [{ rank: 1, suit: 0 }, { rank: 1, suit: 1 }, { rank: 1, suit: 2 }, { rank: 0, suit: 0 }, { rank: 12, suit: 1 }], // 222 A K
            [{ rank: 11, suit: 0 }, { rank: 11, suit: 1 }, { rank: 10, suit: 2 }, { rank: 9, suit: 3 }, { rank: 8, suit: 0 }], // QQ J 10 9
            { rank: 'THREE_OF_A_KIND', name: 'Three 2s', value: 3000 },
            { rank: 'PAIR', name: 'Pair of Qs', value: 1000 },
            0, wager
          )
        case 4: // Flush vs Straight
          return createHandOutcome(
            [{ rank: 0, suit: 0 }, { rank: 11, suit: 0 }, { rank: 9, suit: 0 }, { rank: 7, suit: 0 }, { rank: 5, suit: 0 }], // A Q 10 8 6 all spades
            [{ rank: 8, suit: 0 }, { rank: 7, suit: 1 }, { rank: 6, suit: 2 }, { rank: 5, suit: 3 }, { rank: 4, suit: 0 }], // 9 8 7 6 5 straight
            { rank: 'FLUSH', name: 'A high flush', value: 5000 },
            { rank: 'STRAIGHT', name: '9 high straight', value: 4000 },
            0, wager
          )
        default: // Two Pair vs Pair
          return createHandOutcome(
            [{ rank: 0, suit: 0 }, { rank: 0, suit: 1 }, { rank: 12, suit: 0 }, { rank: 12, suit: 2 }, { rank: 11, suit: 0 }], // AA KK Q
            [{ rank: 10, suit: 0 }, { rank: 10, suit: 1 }, { rank: 9, suit: 2 }, { rank: 8, suit: 3 }, { rank: 7, suit: 0 }], // JJ 10 9 8
            { rank: 'TWO_PAIR', name: 'As and Ks', value: 2000 },
            { rank: 'PAIR', name: 'Pair of Js', value: 1000 },
            0, wager
          )
      }
    } else {
      // AI wins scenarios - AI gets better hand
      switch (scenario) {
        case 0: // AI gets Full House, Player gets Flush
          return createHandOutcome(
            [{ rank: 0, suit: 0 }, { rank: 11, suit: 0 }, { rank: 9, suit: 0 }, { rank: 7, suit: 0 }, { rank: 5, suit: 0 }], // A Q 10 8 6 flush
            [{ rank: 12, suit: 0 }, { rank: 12, suit: 1 }, { rank: 12, suit: 2 }, { rank: 11, suit: 0 }, { rank: 11, suit: 1 }], // KKK QQ
            { rank: 'FLUSH', name: 'A high flush', value: 5000 },
            { rank: 'FULL_HOUSE', name: 'Ks full of Qs', value: 6000 },
            1, wager
          )
        case 1: // AI gets Straight, Player gets Two Pair
          return createHandOutcome(
            [{ rank: 0, suit: 0 }, { rank: 0, suit: 1 }, { rank: 12, suit: 0 }, { rank: 12, suit: 2 }, { rank: 11, suit: 0 }], // AA KK Q
            [{ rank: 8, suit: 0 }, { rank: 7, suit: 1 }, { rank: 6, suit: 2 }, { rank: 5, suit: 3 }, { rank: 4, suit: 0 }], // 9-5 straight
            { rank: 'TWO_PAIR', name: 'As and Ks', value: 2000 },
            { rank: 'STRAIGHT', name: '9 high straight', value: 4000 },
            1, wager
          )
        case 2: // AI gets Four of a Kind, Player gets Three of a Kind
          return createHandOutcome(
            [{ rank: 10, suit: 0 }, { rank: 10, suit: 1 }, { rank: 10, suit: 2 }, { rank: 0, suit: 0 }, { rank: 12, suit: 1 }], // JJJ A K
            [{ rank: 9, suit: 0 }, { rank: 9, suit: 1 }, { rank: 9, suit: 2 }, { rank: 9, suit: 3 }, { rank: 8, suit: 0 }], // 10101010 9
            { rank: 'THREE_OF_A_KIND', name: 'Three Js', value: 3000 },
            { rank: 'FOUR_OF_A_KIND', name: 'Four 10s', value: 7000 },
            1, wager
          )
        case 3: // AI gets Three of a Kind, Player gets Pair
          return createHandOutcome(
            [{ rank: 11, suit: 0 }, { rank: 11, suit: 1 }, { rank: 10, suit: 2 }, { rank: 9, suit: 3 }, { rank: 8, suit: 0 }], // QQ J 10 9
            [{ rank: 0, suit: 0 }, { rank: 0, suit: 1 }, { rank: 0, suit: 2 }, { rank: 12, suit: 0 }, { rank: 11, suit: 3 }], // AAA K Q
            { rank: 'PAIR', name: 'Pair of Qs', value: 1000 },
            { rank: 'THREE_OF_A_KIND', name: 'Three As', value: 3000 },
            1, wager
          )
        case 4: // AI gets Pair, Player gets High Card
          return createHandOutcome(
            [{ rank: 12, suit: 0 }, { rank: 11, suit: 1 }, { rank: 10, suit: 2 }, { rank: 9, suit: 3 }, { rank: 7, suit: 0 }], // K Q J 10 8
            [{ rank: 0, suit: 0 }, { rank: 0, suit: 1 }, { rank: 10, suit: 0 }, { rank: 9, suit: 0 }, { rank: 8, suit: 2 }], // AA J 10 9
            { rank: 'HIGH_CARD', name: 'K high', value: 130 },
            { rank: 'PAIR', name: 'Pair of As', value: 1000 },
            1, wager
          )
        default: // AI gets Full House, Player gets Two Pair
          return createHandOutcome(
            [{ rank: 12, suit: 0 }, { rank: 12, suit: 1 }, { rank: 11, suit: 0 }, { rank: 11, suit: 2 }, { rank: 10, suit: 0 }], // KK QQ J
            [{ rank: 8, suit: 0 }, { rank: 8, suit: 1 }, { rank: 8, suit: 2 }, { rank: 7, suit: 0 }, { rank: 7, suit: 1 }], // 999 77
            { rank: 'TWO_PAIR', name: 'Ks and Qs', value: 2000 },
            { rank: 'FULL_HOUSE', name: '9s full of 8s', value: 6000 },
            1, wager
          )
      }
    }
  }

  // Helper to create hand outcome structure
  const createHandOutcome = (playerCards: any[], aiCards: any[], playerHand: any, aiHand: any, winnerIndex: number, wager: number) => {
    return {
      gameId: 'deterministic',
      players: [
        {
          playerId: 'human',
          playerIndex: 0,
          initialHand: playerCards,
          finalHand: playerCards,
          handEval: playerHand,
          isWinner: winnerIndex === 0,
          payout: 0, // Will be set by Gamba
          discardIndices: [],
          strategy: STRATEGY_PRESETS[selectedStrategy]
        },
        {
          playerId: 'ai',
          playerIndex: 1,
          initialHand: aiCards,
          finalHand: aiCards,
          handEval: aiHand,
          isWinner: winnerIndex === 1,
          payout: 0,
          discardIndices: [],
          strategy: STRATEGY_PRESETS.BALANCED
        }
      ],
      winnerIndex,
      totalPot: wager,
      seed: `deterministic-${winnerIndex === 0 ? 'win' : 'loss'}`
    }
  }

  const renderHand = (cards: any[], label: string, isWinning: boolean = false) => {
    if (!cards || cards.length === 0) {
      return (
        <div>
          <HandLabel>{label}</HandLabel>
          <CardsContainer>
            {Array.from({ length: 5 }, (_, i) => (
              <Card key={i}>
                ?
              </Card>
            ))}
          </CardsContainer>
        </div>
      )
    }

    return (
      <div>
        <HandLabel>{label}</HandLabel>
        <CardsContainer>
          {cards.map((card, i) => (
            <Card key={i} $revealed={cardsRevealed} $isWinning={isWinning}>
              {cardsRevealed ? formatCard(card) : '?'}
            </Card>
          ))}
        </CardsContainer>
      </div>
    )
  }

  return (
    <>
      {/* Stats Portal */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Poker Showdown"
          gameMode={`SP vs AI (${selectedStrategy} - ${getStrategyPayoutInfo(selectedStrategy)})`}
          rtp="94"
          stats={gameStats.stats}
        />
      </GambaUi.Portal>

      {/* Screen Portal */}
      <GambaUi.Portal target="screen">
        <GameplayFrame effectsRef={effectsRef}>
          <GameContainer>
            <TableArea>
              <PokerTable>
                {gameResult ? (
                  <>
                    <OpponentArea>
                      {renderHand(
                        gameResult.players[1]?.finalHand || [], 
                        'AI Opponent',
                        gameResult.winnerIndex === 1
                      )}
                    </OpponentArea>
                    
                    <PlayerArea>
                      {renderHand(
                        gameResult.players[0]?.finalHand || [], 
                        'Your Hand',
                        gameResult.winnerIndex === 0
                      )}
                    </PlayerArea>
                  </>
                ) : (
                  <>
                    <OpponentArea>
                      {renderHand([], 'AI Opponent')}
                    </OpponentArea>
                    
                    <PlayerArea>
                      {renderHand([], 'Your Hand')}
                    </PlayerArea>
                  </>
                )}
              </PokerTable>
              
              {gamePhase === 'setup' && (
                <StrategySelector>
                  <div style={{ marginBottom: '10px', color: '#ffd700', fontSize: '14px', fontWeight: 'bold' }}>
                    Choose Your Strategy
                  </div>
                  <div>
                    {Object.entries(STRATEGY_PRESETS).map(([key, strategy]) => (
                      <StrategyButton
                        key={key}
                        $active={selectedStrategy === key}
                        onClick={() => setSelectedStrategy(key as keyof typeof STRATEGY_PRESETS)}
                      >
                        {key} ({getStrategyPayoutInfo(key as keyof typeof STRATEGY_PRESETS)})
                      </StrategyButton>
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px' }}>
                    {STRATEGY_PRESETS[selectedStrategy].description}
                  </div>
                  <div style={{ fontSize: '11px', color: '#ffd700', marginTop: '4px', fontWeight: 'bold' }}>
                    💰 Win Payout: {getStrategyPayoutInfo(selectedStrategy)} 
                    {selectedStrategy === 'AGGRESSIVE' && ' (High Risk, High Reward)'}
                    {selectedStrategy === 'BALANCED' && ' (Standard Risk & Reward)'}
                    {selectedStrategy === 'CONSERVATIVE' && ' (Lower Risk, Better Odds)'}
                  </div>
                </StrategySelector>
              )}
              
              {gamePhase === 'playing' && (
                <StatusDisplay>
                  <div>🎯 Cards being dealt...</div>
                  <div style={{ fontSize: '12px', marginTop: '5px' }}>
                    Strategy: {selectedStrategy} (Win Payout: {getStrategyPayoutInfo(selectedStrategy)})
                  </div>
                </StatusDisplay>
              )}
              
              {gamePhase === 'results' && gameResult && (
                <StatusDisplay>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                    {gameResult.players[0].payout > 0 ? '🏆 You Win!' : '💔 You Lose!'}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    Your Hand: {gameResult.players[0].handEval.name}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    AI Hand: {gameResult.players[1].handEval.name}
                  </div>
                  <div style={{ color: '#ffd700', fontWeight: 'bold' }}>
                    {gameResult.players[0].payout > 0
                      ? <>Won: <TokenValue exact amount={gameResult.players[0].payout} mint={token?.mint} /></>
                      : <>Lost: <TokenValue exact amount={wager} mint={token?.mint} /></>
                    }
                  </div>
                </StatusDisplay>
              )}
            </TableArea>
          </GameContainer>
        </GameplayFrame>
      </GambaUi.Portal>

      {/* Controls Portal */}
      <GambaUi.Portal target="controls">
        {gamePhase === 'setup' ? (
          <>
            <MobileControls
              wager={wager}
              setWager={setWager}
              onPlay={handlePlay}
              playDisabled={isPlaying || wager <= 0}
              playText="Deal Cards"
            />
            <DesktopControls>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <EnhancedButton onClick={onBack}>
                  Back to Lobby
                </EnhancedButton>
                <EnhancedWagerInput
                  value={wager}
                  onChange={setWager}
                  disabled={isPlaying}
                />
                <EnhancedButton 
                  onClick={handlePlay} 
                  disabled={isPlaying || wager <= 0}
                  variant="primary"
                >
                  {isPlaying ? 'Dealing...' : 'Deal Cards'}
                </EnhancedButton>
              </div>
            </DesktopControls>
          </>
        ) : gamePhase === 'results' ? (
          <>
            <MobileControls
              wager={wager}
              setWager={setWager}
              onPlay={handleNewGame}
              playDisabled={false}
              playText="Deal Again"
            />
            <DesktopControls>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
                <EnhancedButton onClick={onBack}>
                  Back to Lobby
                </EnhancedButton>
                <EnhancedButton onClick={handleNewGame} variant="primary">
                  Deal Again
                </EnhancedButton>
              </div>
            </DesktopControls>
          </>
        ) : (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: '#fff' 
          }}>
            <p>Game in progress...</p>
          </div>
        )}
      </GambaUi.Portal>
    </>
  )
}