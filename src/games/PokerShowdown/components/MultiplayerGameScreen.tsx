import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMultiplayer } from 'gamba-react-v2'
import { GambaUi, useSound, useCurrentToken, Multiplayer } from 'gamba-react-ui-v2'
import { PublicKey } from '@solana/web3.js'
import styled, { keyframes } from 'styled-components'
import { DrawStrategy, GameResult } from '../types'
import { POKER_COLORS, CONFIG, GAME_PHASES, SOUND_WIN, SOUND_LOSE, SOUND_PLAY, SOUND_CARD } from '../constants'
import { executePokerShowdown, simulateGameOutcome } from '../engine/GameEngine'
import { POKER_SHOWDOWN_CONFIG, getPokerShowdownBetArray } from '../../rtpConfigMultiplayer'
// Mock multiplayer implementation - PLATFORM_CREATOR_ADDRESS and MULTIPLAYER_FEE_BPS would be used in real implementation
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
  gamePubkey: PublicKey
  selectedStrategy: DrawStrategy
  onBack: () => void
}

export default function MultiplayerPokerGame({
  gamePubkey,
  selectedStrategy,
  onBack
}: MultiplayerPokerGameProps) {
  const { publicKey } = useWallet()
  const token = useCurrentToken()
  const effectsRef = useRef<GameplayEffectsRef>(null)
  
  // Multiplayer integration
  const multiplayer = useMultiplayer()
  
  // Game state
  const [gamePhase, setGamePhase] = useState<string>('waiting')
  const [players, setPlayers] = useState<any[]>([])
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Sound effects
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    card: SOUND_CARD,
  })

  // Extract game info from multiplayer state
  useEffect(() => {
    // Mock game state for demonstration
    // In real implementation, this would come from multiplayer SDK
    setPlayers([]) // Empty players array for now
    setGamePhase('waiting')
  }, [])

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && gamePhase === 'strategy') {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && gamePhase === 'strategy' && isReady) {
      // Auto-start game when timer expires
      handleStartGame()
    }
  }, [timeRemaining, gamePhase, isReady])

  // Check if current user is in game
  const isPlayerInGame = players.some(p => p.user?.equals(publicKey))
  const canJoinGame = publicKey && !isPlayerInGame && players.length < CONFIG.MAX_PLAYERS
  const allPlayersReady = players.length >= CONFIG.MIN_PLAYERS && 
                          players.every(p => p.status === 'ready')

  // Handle joining game
  const handleJoinGame = useCallback(async () => {
    if (!canJoinGame) return
    
    try {
      console.log('🎯 Joining Poker Showdown game...')
      // This would integrate with Multiplayer.JoinGame component
      // For now, simulate joining
      sounds.play('play')
    } catch (error) {
      console.error('❌ Failed to join game:', error)
    }
  }, [canJoinGame, sounds])

  // Handle ready toggle
  const handleToggleReady = useCallback(async () => {
    if (!isPlayerInGame) return
    
    try {
      // Mock ready state toggle - in real implementation, use multiplayer SDK
      setIsReady(!isReady)
      sounds.play('card')
    } catch (error) {
      console.error('❌ Failed to toggle ready state:', error)
    }
  }, [isPlayerInGame, isReady, selectedStrategy, sounds])

  // Handle game start
  const handleStartGame = useCallback(async () => {
    if (!allPlayersReady || isPlaying) return
    
    setIsPlaying(true)
    setGamePhase('playing')
    
    try {
      console.log('🎯 Starting Poker Showdown game...')
      
      // Collect all player strategies
      const playerStrategies = players.map(p => p.metadata?.strategy || selectedStrategy)
      const playerIds = players.map(p => p.user.toBase58())
      
      // Simulate game outcome for bet array
      const seed = `${gamePubkey.toBase58()}-${Date.now()}`
      const outcome = simulateGameOutcome(playerStrategies, seed)
      
      // Calculate bet array
      const betArray = getPokerShowdownBetArray(
        outcome.winnerHandRank.toString(),
        players.length,
        true // This player is simulated as winner for demo
      )
      
      // Mock transaction execution for demo
      const wager = 1000000 // Default 0.001 SOL
      const mockResult = { payout: wager * 2 } // Mock result
      console.log('🎯 Mock result:', mockResult)
      
      // Execute full game logic to get detailed results
      const fullResult = executePokerShowdown(
        playerStrategies,
        playerIds,
        wager * players.length,
        seed
      )
      
      setGameResult(fullResult)
      setGamePhase('results')
      
      // Play appropriate sound
      const isWinner = fullResult.players.find(p => p.playerId === publicKey?.toBase58())?.isWinner
      if (isWinner) {
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
      
    } catch (error) {
      console.error('❌ Game execution failed:', error)
      setGamePhase('waiting')
    } finally {
      setIsPlaying(false)
    }
  }, [allPlayersReady, isPlaying, players, selectedStrategy, gamePubkey, publicKey, sounds])

  const formatSOL = (lamports: number) => {
    return (lamports / 1000000000).toFixed(3)
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
            Entry: <span>{formatSOL(1000000)} SOL</span>
          </InfoItem>
          
          <InfoItem>
            Total Pot: <span>{formatSOL(1000000 * players.length)} SOL</span>
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
            const isYou = player?.user?.equals(publicKey)
            
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
                    player.status === 'ready' ? '✅ Ready' : '⏳ Selecting Strategy'
                  ) : (
                    '👤 Empty Seat'
                  )}
                </div>
                {player && (
                  <div className="player-wager">
                    {formatSOL(1000000)} SOL
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
            <button onClick={handleJoinGame}>
              Join Game (Mock)
            </button>
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
              Prize: {formatSOL(gameResult.players[gameResult.winnerIndex].payout)} SOL
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