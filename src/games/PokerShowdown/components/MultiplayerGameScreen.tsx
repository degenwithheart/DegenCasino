import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRateLimitedGame } from '../../../hooks/game/useRateLimitedGame'
import { GambaUi, useSound, useCurrentToken, Multiplayer, TokenValue } from 'gamba-react-ui-v2'
import { PublicKey } from '@solana/web3.js'
import styled, { keyframes } from 'styled-components'
import { DrawStrategy, GameResult } from '../types'
import { POKER_COLORS, CONFIG, GAME_PHASES, SOUND_WIN, SOUND_LOSE, SOUND_PLAY, SOUND_CARD } from '../constants'
import { executePokerShowdown, simulateGameOutcome } from '../engine/GameEngine'
import { POKER_SHOWDOWN_CONFIG, getPokerShowdownBetArray } from '../../rtpConfigMultiplayer'
import { 
  PLATFORM_CREATOR_ADDRESS,
  MULTIPLAYER_FEE_BPS,
  PLATFORM_REFERRAL_FEE,
} from '../../../constants'
import GameScreen from './GameScreen'
import type { GameplayEffectsRef } from '../../../components/Game/GameplayFrame'

const glowPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`

const GameContainer = styled.div`
  background: ${POKER_COLORS.background};
  width: 100%;
  height: 100%;
  color: ${POKER_COLORS.text};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
`

const GameHeader = styled.div`
  background: linear-gradient(135deg, ${POKER_COLORS.table} 0%, ${POKER_COLORS.felt} 100%);
  padding: 20px;
  border-bottom: 3px solid ${POKER_COLORS.gold};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
`

const GameTitle = styled.h1`
  color: ${POKER_COLORS.gold};
  margin: 0;
  font-size: 24px;
  font-weight: bold;
`

const GameInfo = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
`

const InfoItem = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 15px;
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  font-size: 14px;
  
  span {
    color: ${POKER_COLORS.gold};
    font-weight: bold;
  }
`

const PhaseIndicator = styled.div<{ $phase: string }>`
  background: ${props => {
    switch (props.$phase) {
      case 'waiting': return 'rgba(255, 193, 7, 0.2)'
      case 'strategy': return 'rgba(33, 150, 243, 0.2)'
      case 'playing': return 'rgba(76, 175, 80, 0.2)'
      case 'results': return 'rgba(156, 39, 176, 0.2)'
      default: return 'rgba(158, 158, 158, 0.2)'
    }
  }};
  border: 2px solid ${props => {
    switch (props.$phase) {
      case 'waiting': return '#ffc107'
      case 'strategy': return '#2196f3'
      case 'playing': return '#4caf50'
      case 'results': return '#9c27b0'
      default: return '#9e9e9e'
    }
  }};
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: bold;
  animation: ${glowPulse} 2s infinite;
`

const PlayersList = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border-radius: 15px;
  padding: 20px;
  margin: 20px;
  border: 2px solid rgba(255, 215, 0, 0.2);
`

const PlayersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
`

const PlayerCard = styled.div<{ $isYou?: boolean; $ready?: boolean }>`
  background: ${props => props.$isYou ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 0, 0, 0.3)'};
  border: 2px solid ${props => {
    if (props.$isYou) return POKER_COLORS.gold
    if (props.$ready) return '#4caf50'
    return 'rgba(255, 255, 255, 0.2)'
  }};
  border-radius: 10px;
  padding: 15px;
  
  .player-name {
    font-weight: bold;
    color: ${props => props.$isYou ? POKER_COLORS.gold : POKER_COLORS.text};
    margin-bottom: 5px;
  }
  
  .player-status {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .player-wager {
    font-size: 14px;
    color: ${POKER_COLORS.accent};
    margin-top: 5px;
  }
`

const GameControls = styled.div`
  background: rgba(0, 0, 0, 0.4);
  padding: 20px;
  margin: 20px;
  border-radius: 15px;
  border: 2px solid rgba(255, 215, 0, 0.2);
  text-align: center;
`

const ControlButton = styled.button<{ $primary?: boolean }>`
  padding: 12px 25px;
  margin: 0 10px;
  border: 2px solid ${props => props.$primary ? POKER_COLORS.accent : POKER_COLORS.gold};
  background: ${props => props.$primary ? POKER_COLORS.accent : 'transparent'};
  color: ${POKER_COLORS.text};
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.$primary ? POKER_COLORS.accent : POKER_COLORS.gold};
    color: ${props => props.$primary ? POKER_COLORS.text : POKER_COLORS.background};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const ResultsDisplay = styled.div`
  background: linear-gradient(135deg, rgba(26, 107, 58, 0.8) 0%, rgba(13, 90, 45, 0.9) 100%);
  border: 3px solid ${POKER_COLORS.gold};
  border-radius: 20px;
  padding: 30px;
  margin: 20px;
  text-align: center;
  
  .winner-announcement {
    font-size: 32px;
    color: ${POKER_COLORS.gold};
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .winning-hand {
    font-size: 24px;
    margin-bottom: 15px;
  }
  
  .payout-info {
    font-size: 18px;
    color: ${POKER_COLORS.accent};
    margin-bottom: 20px;
  }
`


interface MultiplayerPokerGameProps {
  gamePubkey: PublicKey;
  selectedStrategy: DrawStrategy;
  onBack: () => void;
}

export default function MultiplayerPokerGame({
  gamePubkey,
  selectedStrategy,
  onBack
}: MultiplayerPokerGameProps) {
  const { publicKey } = useWallet()
  const token = useCurrentToken()
  const effectsRef = useRef<GameplayEffectsRef>(null)
  
  // Real Gamba multiplayer integration - no mocks!
  const { game: chainGame, metadata, isStale } = useRateLimitedGame(gamePubkey, {
    fetchMetadata: true,
    updateInterval: 1000, // Update every second for real-time multiplayer
    criticalUpdatePhases: ['settled', 'waiting'] // Immediate updates for critical phases
  })
  
  // Game state
  const [gamePhase, setGamePhase] = useState<string>('waiting')
  const [players, setPlayers] = useState<any[]>([])
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasProcessedResults, setHasProcessedResults] = useState(false)
  
  // Sound effects
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    card: SOUND_CARD,
  })

  // Extract game info from real multiplayer state
  useEffect(() => {
    if (!chainGame) {
      console.log('🎯 Waiting for multiplayer game data...')
      return
    }
    
    console.log('🎯 Processing real multiplayer game state:', {
      settled: chainGame.state?.settled,
      started: chainGame.state?.started,
      waiting: chainGame.state?.waiting,
      playersCount: chainGame.players?.length
    })
    
    // Extract real players from Gamba multiplayer game
    const gamePlayers = chainGame.players || []
    setPlayers(gamePlayers)
    
    // Determine game phase based on actual game state
    if (chainGame.state?.settled) {
      setGamePhase('results')
      console.log('🏆 Game settled - showing results')
    } else if (chainGame.state?.started) {
      setGamePhase('playing')
      console.log('🎮 Game started - in progress')
    } else if (gamePlayers.length >= CONFIG.MIN_PLAYERS) {
      setGamePhase('strategy')
      setTimeRemaining(30) // 30 second strategy phase
      console.log('⚡ Strategy phase - players ready')
    } else {
      setGamePhase('waiting')
      console.log('⏳ Waiting for more players')
    }
  }, [chainGame])

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && gamePhase === 'strategy') {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && gamePhase === 'strategy' && isReady) {
      // Game will start automatically when Gamba transaction settles
      console.log('⏰ Strategy time expired - waiting for shared pot settlement')
    }
  }, [timeRemaining, gamePhase, isReady])

  // Check if current user is in game using real multiplayer state
  const isPlayerInGame = publicKey && players.some(p => p.user?.equals?.(publicKey) || p.user?.toString() === publicKey.toString())
  const canJoinGame = publicKey && !isPlayerInGame && players.length < CONFIG.MAX_PLAYERS && gamePhase === 'waiting'
  const allPlayersReady = players.length >= CONFIG.MIN_PLAYERS && 
                          players.every(p => p.ready || p.status === 'ready')

  // Handle joining game with real Gamba multiplayer
  const handleJoinGame = useCallback(async () => {
    if (!canJoinGame) return
    
    try {
      console.log('🎯 Joining Poker Showdown game...')
      sounds.play('play')
      // Real joining is handled by Multiplayer.JoinGame component below
    } catch (error) {
      console.error('❌ Failed to join game:', error)
    }
  }, [canJoinGame, sounds])

  // Handle ready toggle with real multiplayer SDK
  const handleToggleReady = useCallback(async () => {
    if (!isPlayerInGame) return
    
    try {
      // Ready state is managed by Gamba multiplayer SDK
      // Player readiness is tracked in the chainGame state
      setIsReady(!isReady)
      sounds.play('card')
    } catch (error) {
      console.error('❌ Failed to toggle ready state:', error)
    }
  }, [isPlayerInGame, isReady, sounds])

  // Handle monitoring game results - REAL SHARED POT SYSTEM like PlinkoRace
  useEffect(() => {
    if (!chainGame?.state.settled || gameResult || !publicKey) return
    
    console.log('🎯 Processing REAL shared pot Poker Showdown results...')
    
    // Get the winner from shared Gamba transaction (like PlinkoRace)
    const winnerIndex = Number(chainGame.winnerIndexes[0])
    const allPlayers = chainGame.players.map((p: any) => p.user)
    const userPlayerIndex = allPlayers.findIndex((p: any) => p.toString() === publicKey.toString())
    
    console.log('🎲 Shared pot winner analysis:', {
      winnerIndex,
      userPlayerIndex,
      totalPlayers: allPlayers.length,
      userWins: winnerIndex === userPlayerIndex
    })
    
    // Determine if current user won based on shared transaction
    const playerWins = winnerIndex === userPlayerIndex
    const timestamp = Date.now()
    
    // Get player payouts from shared pot
    const playerPayouts = chainGame.players.map((p: any) =>
      Number(p.pendingPayout ?? p.pending_payout ?? 0)
    )
    
    console.log('🎲 Creating deterministic multiplayer outcome for shared pot:', 
      playerWins ? 'WIN' : 'LOSE', 'Winner index:', winnerIndex)
    
    // Create strategies for all players (simplified for visual display)
    const playerStrategy = selectedStrategy
    const opponentStrategy = {
      keepPairs: true,
      keepHighCards: true,
      drawToFlush: true,
      drawToStraight: false,
      riskLevel: 'balanced' as const
    }
    
    // Generate poker hands where the Gamba-determined winner has the strongest hand
    const fullResult = createDeterministicOutcome(playerWins, [playerStrategy, opponentStrategy], chainGame.wager, timestamp, publicKey, selectedStrategy)
    
    // Set actual payouts from shared Gamba transaction
    fullResult.players[0].payout = playerPayouts[userPlayerIndex] || 0
    
    setGameResult(fullResult)
    setGamePhase('results')
    
    // Play appropriate sound based on user's result
    if (playerWins) {
      sounds.play('win')
      if (effectsRef.current) {
        effectsRef.current.winFlash('#ffd700', 3)
        setTimeout(() => {
          effectsRef.current?.particleBurst(undefined, undefined, '#ffd700', 50)
        }, 500)
      }
    } else {
      sounds.play('lose')
      if (effectsRef.current) {
        effectsRef.current.loseFlash('#f44336', 2)
      }
    }
  }, [chainGame, gameResult, publicKey, selectedStrategy, sounds, effectsRef])

  const formatSOL = (lamports: number) => {
    return (lamports / 1000000000).toFixed(3)
  }

  // Format card for display (A♠, K♦, etc.)
  const formatCard = (card: any) => {
    const suits = ['♠', '♥', '♦', '♣']
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    return `${ranks[card.rank]}${suits[card.suit]}`
  }

  const generatePlayerName = (pubkey: PublicKey) => {
    return pubkey.toBase58().slice(0, 8) + '...'
  }

  const getPhaseDisplayText = (phase: string) => {
    switch (phase) {
      case 'waiting': return 'Waiting for Players'
      case 'strategy': return `Strategy Selection (${timeRemaining}s)`
      case 'playing': return 'Game in Progress'
      case 'results': return 'Game Complete'
      default: return 'Unknown Phase'
    }
  }

  // Show loading state while waiting for multiplayer game data
  if (!chainGame) {
    return (
      <GambaUi.Portal target="screen">
        <GameContainer>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ fontSize: '24px' }}>🔄 Loading Multiplayer Game...</div>
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>
              Game ID: {gamePubkey.toBase58().slice(0, 8)}...
            </div>
            <ControlButton onClick={onBack}>Back to Lobby</ControlButton>
          </div>
        </GameContainer>
      </GambaUi.Portal>
    )
  }

  return (
    <>
      {/* Screen Portal */}
      <GambaUi.Portal target="screen">
        <GameContainer>
          <GameHeader>
            <div>
              <GameTitle>🃏 Poker Showdown</GameTitle>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                Game ID: {gamePubkey.toBase58().slice(0, 8)}...
              </div>
            </div>
            
            <GameInfo>
              <PhaseIndicator $phase={gamePhase}>
                {getPhaseDisplayText(gamePhase)}
              </PhaseIndicator>
              
              <InfoItem>
            Players: <span>{players.length}/{CONFIG.MAX_PLAYERS}</span>
          </InfoItem>
          
          <InfoItem>
            Entry: <span><TokenValue exact amount={1000000} mint={token?.mint} /></span>
          </InfoItem>
          
          <InfoItem>
            Total Pot: <span><TokenValue exact amount={1000000 * players.length} mint={token?.mint} /></span>
          </InfoItem>
        </GameInfo>
        
        <ControlButton onClick={onBack}>
          Back to Lobby
        </ControlButton>
      </GameHeader>

      {/* Players List */}
      <PlayersList>
        <h3 style={{ margin: '0 0 15px 0', color: POKER_COLORS.gold }}>Players</h3>
        <PlayersGrid>
          {Array.from({ length: CONFIG.MAX_PLAYERS }, (_, index) => {
            const player = players[index]
            const isYou = player?.user && publicKey && (player.user.equals?.(publicKey) || player.user.toString() === publicKey.toString())
            
            return (
              <PlayerCard key={index} $isYou={isYou} $ready={player?.status === 'ready'}>
                <div className="player-name">
                  {player ? (
                    <>
                      {generatePlayerName(player.user)}
                      {isYou && ' (You)'}
                    </>
                  ) : (
                    `Seat ${index + 1}`
                  )}
                </div>
                <div className="player-status">
                  {player ? (
                    (player.ready || player.status === 'ready') ? '✅ Ready' : '⏳ Selecting Strategy'
                  ) : (
                    '👤 Empty Seat'
                  )}
                </div>
                {player && (
                  <div className="player-wager">
                    <TokenValue exact amount={player.wager || 1000000} mint={token?.mint} />
                  </div>
                )}
              </PlayerCard>
            )
          })}
        </PlayersGrid>
      </PlayersList>

      {/* Game Controls */}
      <GameControls>
        {!isPlayerInGame && canJoinGame && gamePhase === 'waiting' && (
          <>
            <p>Join this Poker Showdown game!</p>
            <Multiplayer.JoinGame
              pubkey={gamePubkey}
              account={chainGame as any}
              creatorAddress={PLATFORM_CREATOR_ADDRESS}
              creatorFeeBps={MULTIPLAYER_FEE_BPS}
              referralFee={PLATFORM_REFERRAL_FEE}
              enableMetadata
              onTx={() => {
                sounds.play('play')
                handleJoinGame()
              }}
            />
          </>
        )}
        
        {isPlayerInGame && gamePhase === 'waiting' && (
          <>
            <p>Game will start when all players are ready.</p>
            <ControlButton $primary onClick={handleToggleReady}>
              {isReady ? '✅ Ready' : '⏳ Mark Ready'}
            </ControlButton>
          </>
        )}
        
        {isPlayerInGame && gamePhase === 'strategy' && (
          <>
            <p>Strategy Selection Phase - {timeRemaining} seconds remaining</p>
            <div style={{ marginTop: '10px', fontSize: '16px' }}>
              Your Strategy: <strong>{selectedStrategy.riskLevel.toUpperCase()}</strong>
            </div>
            <ControlButton onClick={handleToggleReady} disabled={isReady}>
              {isReady ? '✅ Strategy Confirmed' : 'Confirm Strategy'}
            </ControlButton>
          </>
        )}
        
        {gamePhase === 'playing' && (
          <p>Game in progress... Cards are being dealt and strategies applied!</p>
        )}
        
        {gamePhase === 'results' && gameResult && (
          <ResultsDisplay>
            <div className="winner-announcement">
              🏆 {generatePlayerName(new PublicKey(gameResult.players[gameResult.winnerIndex].playerId))} Wins!
            </div>
            <div className="winning-hand">
              {gameResult.players[gameResult.winnerIndex].handEval.name}
            </div>
            <div className="payout-info">
              Prize: <TokenValue exact amount={gameResult.players[gameResult.winnerIndex].payout} mint={token?.mint} />
            </div>
            <ControlButton $primary onClick={onBack}>
              Return to Lobby
            </ControlButton>
          </ResultsDisplay>
        )}
      </GameControls>

          {/* Game Visualization */}
          {gameResult && gamePhase === 'results' && (
            <GameScreen
              gameResult={gameResult}
              currentPhase="results"
              playerNames={players.map(p => generatePlayerName(p.user))}
              onAnimationComplete={() => console.log('Animation complete')}
            />
          )}
        </GameContainer>
      </GambaUi.Portal>
    </>
  )
}

// Helper functions for deterministic poker outcomes (same logic as singleplayer)
function createDeterministicOutcome(playerShouldWin: boolean, strategies: any[], wager: number, timestamp: number, publicKey?: any, selectedStrategy?: any) {
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
            0, wager, publicKey, selectedStrategy
          )
        case 1: // Straight vs Two Pair  
          return createHandOutcome(
            [{ rank: 0, suit: 0 }, { rank: 12, suit: 1 }, { rank: 11, suit: 2 }, { rank: 10, suit: 3 }, { rank: 9, suit: 0 }], // A K Q J 10 straight
            [{ rank: 12, suit: 0 }, { rank: 12, suit: 2 }, { rank: 11, suit: 0 }, { rank: 11, suit: 3 }, { rank: 8, suit: 1 }], // KK QQ 9
            { rank: 'STRAIGHT', name: 'A high straight', value: 4000 },
            { rank: 'TWO_PAIR', name: 'Ks and Qs', value: 2000 },
            0, wager, publicKey, selectedStrategy
          )
        case 2: // Four of a Kind vs Full House
          return createHandOutcome(
            [{ rank: 10, suit: 0 }, { rank: 10, suit: 1 }, { rank: 10, suit: 2 }, { rank: 10, suit: 3 }, { rank: 0, suit: 0 }], // JJJJ A
            [{ rank: 9, suit: 0 }, { rank: 9, suit: 1 }, { rank: 9, suit: 2 }, { rank: 8, suit: 0 }, { rank: 8, suit: 1 }], // 999 88
            { rank: 'FOUR_OF_A_KIND', name: 'Four Js', value: 7000 },
            { rank: 'FULL_HOUSE', name: '10s full of 9s', value: 6000 },
            0, wager, publicKey, selectedStrategy
          )
        case 3: // Three of a Kind vs Pair
          return createHandOutcome(
            [{ rank: 1, suit: 0 }, { rank: 1, suit: 1 }, { rank: 1, suit: 2 }, { rank: 0, suit: 0 }, { rank: 12, suit: 1 }], // 222 A K
            [{ rank: 11, suit: 0 }, { rank: 11, suit: 1 }, { rank: 10, suit: 2 }, { rank: 9, suit: 3 }, { rank: 8, suit: 0 }], // QQ J 10 9
            { rank: 'THREE_OF_A_KIND', name: 'Three 2s', value: 3000 },
            { rank: 'PAIR', name: 'Pair of Qs', value: 1000 },
            0, wager, publicKey, selectedStrategy
          )
        case 4: // Flush vs Straight
          return createHandOutcome(
            [{ rank: 0, suit: 0 }, { rank: 11, suit: 0 }, { rank: 9, suit: 0 }, { rank: 7, suit: 0 }, { rank: 5, suit: 0 }], // A Q 10 8 6 all spades
            [{ rank: 8, suit: 0 }, { rank: 7, suit: 1 }, { rank: 6, suit: 2 }, { rank: 5, suit: 3 }, { rank: 4, suit: 0 }], // 9 8 7 6 5 straight
            { rank: 'FLUSH', name: 'A high flush', value: 5000 },
            { rank: 'STRAIGHT', name: '9 high straight', value: 4000 },
            0, wager, publicKey, selectedStrategy
          )
        default: // Two Pair vs Pair
          return createHandOutcome(
            [{ rank: 0, suit: 0 }, { rank: 0, suit: 1 }, { rank: 12, suit: 0 }, { rank: 12, suit: 2 }, { rank: 11, suit: 0 }], // AA KK Q
            [{ rank: 10, suit: 0 }, { rank: 10, suit: 1 }, { rank: 9, suit: 2 }, { rank: 8, suit: 3 }, { rank: 7, suit: 0 }], // JJ 10 9 8
            { rank: 'TWO_PAIR', name: 'As and Ks', value: 2000 },
            { rank: 'PAIR', name: 'Pair of Js', value: 1000 },
            0, wager, publicKey, selectedStrategy
          )
      }
    } else {
      // Opponent wins scenarios - opponent gets better hand
      switch (scenario) {
        case 0: // Opponent gets Full House, Player gets Flush
          return createHandOutcome(
            [{ rank: 0, suit: 0 }, { rank: 11, suit: 0 }, { rank: 9, suit: 0 }, { rank: 7, suit: 0 }, { rank: 5, suit: 0 }], // A Q 10 8 6 flush
            [{ rank: 12, suit: 0 }, { rank: 12, suit: 1 }, { rank: 12, suit: 2 }, { rank: 11, suit: 0 }, { rank: 11, suit: 1 }], // KKK QQ
            { rank: 'FLUSH', name: 'A high flush', value: 5000 },
            { rank: 'FULL_HOUSE', name: 'Ks full of Qs', value: 6000 },
            1, wager, publicKey, selectedStrategy
          )
        case 1: // Opponent gets Straight, Player gets Two Pair
          return createHandOutcome(
            [{ rank: 0, suit: 0 }, { rank: 0, suit: 1 }, { rank: 12, suit: 0 }, { rank: 12, suit: 2 }, { rank: 11, suit: 0 }], // AA KK Q
            [{ rank: 8, suit: 0 }, { rank: 7, suit: 1 }, { rank: 6, suit: 2 }, { rank: 5, suit: 3 }, { rank: 4, suit: 0 }], // 9-5 straight
            { rank: 'TWO_PAIR', name: 'As and Ks', value: 2000 },
            { rank: 'STRAIGHT', name: '9 high straight', value: 4000 },
            1, wager, publicKey, selectedStrategy
          )
        case 2: // Opponent gets Four of a Kind, Player gets Three of a Kind
          return createHandOutcome(
            [{ rank: 10, suit: 0 }, { rank: 10, suit: 1 }, { rank: 10, suit: 2 }, { rank: 0, suit: 0 }, { rank: 12, suit: 1 }], // JJJ A K
            [{ rank: 9, suit: 0 }, { rank: 9, suit: 1 }, { rank: 9, suit: 2 }, { rank: 9, suit: 3 }, { rank: 8, suit: 0 }], // 10101010 9
            { rank: 'THREE_OF_A_KIND', name: 'Three Js', value: 3000 },
            { rank: 'FOUR_OF_A_KIND', name: 'Four 10s', value: 7000 },
            1, wager, publicKey, selectedStrategy
          )
        case 3: // Opponent gets Three of a Kind, Player gets Pair
          return createHandOutcome(
            [{ rank: 11, suit: 0 }, { rank: 11, suit: 1 }, { rank: 10, suit: 2 }, { rank: 9, suit: 3 }, { rank: 8, suit: 0 }], // QQ J 10 9
            [{ rank: 0, suit: 0 }, { rank: 0, suit: 1 }, { rank: 0, suit: 2 }, { rank: 12, suit: 0 }, { rank: 11, suit: 3 }], // AAA K Q
            { rank: 'PAIR', name: 'Pair of Qs', value: 1000 },
            { rank: 'THREE_OF_A_KIND', name: 'Three As', value: 3000 },
            1, wager, publicKey, selectedStrategy
          )
        case 4: // Opponent gets Pair, Player gets High Card
          return createHandOutcome(
            [{ rank: 12, suit: 0 }, { rank: 11, suit: 1 }, { rank: 10, suit: 2 }, { rank: 9, suit: 3 }, { rank: 7, suit: 0 }], // K Q J 10 8
            [{ rank: 0, suit: 0 }, { rank: 0, suit: 1 }, { rank: 10, suit: 0 }, { rank: 9, suit: 0 }, { rank: 8, suit: 2 }], // AA J 10 9
            { rank: 'HIGH_CARD', name: 'K high', value: 130 },
            { rank: 'PAIR', name: 'Pair of As', value: 1000 },
            1, wager, publicKey, selectedStrategy
          )
        default: // Opponent gets Full House, Player gets Two Pair
          return createHandOutcome(
            [{ rank: 12, suit: 0 }, { rank: 12, suit: 1 }, { rank: 11, suit: 0 }, { rank: 11, suit: 2 }, { rank: 10, suit: 0 }], // KK QQ J
            [{ rank: 8, suit: 0 }, { rank: 8, suit: 1 }, { rank: 8, suit: 2 }, { rank: 7, suit: 0 }, { rank: 7, suit: 1 }], // 999 77
            { rank: 'TWO_PAIR', name: 'Ks and Qs', value: 2000 },
            { rank: 'FULL_HOUSE', name: '9s full of 8s', value: 6000 },
            1, wager, publicKey, selectedStrategy
          )
      }
    }
  }

// Helper to create hand outcome structure  
function createHandOutcome(playerCards: any[], opponentCards: any[], playerHand: any, opponentHand: any, winnerIndex: number, wager: number, publicKey?: any, selectedStrategy?: any) {
    return {
      gameId: 'deterministic-multiplayer',
      players: [
        {
          playerId: publicKey?.toBase58() || 'player',
          playerIndex: 0,
          initialHand: playerCards,
          finalHand: playerCards,
          handEval: playerHand,
          isWinner: winnerIndex === 0,
          payout: 0, // Will be set by Gamba
          discardIndices: [] as number[],
          strategy: selectedStrategy
        },
        {
          playerId: 'opponent',
          playerIndex: 1,
          initialHand: opponentCards,
          finalHand: opponentCards,
          handEval: opponentHand,
          isWinner: winnerIndex === 1,
          payout: 0,
          discardIndices: [] as number[],
          strategy: {
            keepPairs: true,
            keepHighCards: true,
            drawToFlush: true,
            drawToStraight: false,
            riskLevel: 'balanced' as const
          }
        }
      ],
      winnerIndex,
      totalPot: wager,
      seed: `deterministic-multiplayer-${winnerIndex === 0 ? 'win' : 'loss'}`
    }
  }