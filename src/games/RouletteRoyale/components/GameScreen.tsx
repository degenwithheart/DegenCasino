import React, { useEffect, useState, useRef, useCallback } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRateLimitedGame } from '../../../hooks/game/useRateLimitedGame'
import { GambaUi, Multiplayer, useSound, TokenValue } from 'gamba-react-ui-v2'
import styled, { keyframes } from 'styled-components'
import { 
  PLATFORM_CREATOR_ADDRESS,
  MULTIPLAYER_FEE_BPS,
  PLATFORM_REFERRAL_FEE,
} from '../../../constants'
import { EnhancedWagerInput, MobileControls, DesktopControls, GameControlsSection } from '../../../components'
import { useIsCompact } from '../../../hooks/ui/useIsCompact'
import { GameStatsHeader } from '../../../components/Game/GameStatsHeader'
import { useGameStats } from '../../../hooks/game/useGameStats'
import { generateUsernameFromWallet } from '../../../utils/user/userProfileUtils'
import RouletteTable from './RouletteTable'
import RouletteWheel from './RouletteWheel'
import PlayersList from './PlayersList'
import { SOUND_WIN, SOUND_LOSE, SOUND_PLAY, SOUND_CHIP } from '../constants'
import { ROULETTE_ROYALE_CONFIG } from '../../rtpConfigMultiplayer'

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
  }
`

const GameContainer = styled.div`
  padding: 20px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  color: white;
  background: radial-gradient(ellipse at center, rgba(139, 69, 19, 0.4) 0%, rgba(0, 0, 0, 0.9) 70%);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
`

const GameTitle = styled.h2`
  color: #ffd700;
  margin: 0;
  font-size: 1.5rem;
`

const GamePhase = styled.div<{ phase: string }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  text-align: center;
  animation: ${props => props.phase === 'betting' ? glowPulse : 'none'} 2s ease-in-out infinite;
  
  background: ${props => {
    switch (props.phase) {
      case 'betting': return 'linear-gradient(45deg, #4caf50, #45a049)'
      case 'spinning': return 'linear-gradient(45deg, #ff9800, #f57c00)'
      case 'results': return 'linear-gradient(45deg, #2196f3, #1976d2)'
      default: return 'rgba(255, 255, 255, 0.2)'
    }
  }};
`

const MainGameArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  flex-grow: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`

const TableArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`

const ConnectionStatus = styled.div<{ isStale?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: ${props => props.isStale ? '#ff9800' : '#4caf50'};
  opacity: 0.8;
`

const ConnectionIndicator = styled.div<{ isStale?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.isStale ? '#ff9800' : '#4caf50'};
  animation: ${props => props.isStale ? 'none' : 'pulse 2s infinite'};
`

const Timer = styled.div<{ urgent?: boolean }>`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.urgent ? '#ff6b6b' : '#ffd700'};
  padding: 10px;
  border: 2px solid ${props => props.urgent ? '#ff6b6b' : '#ffd700'};
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
`

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
`

const WinnerAnnouncement = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(45deg, #ffd700, #ff6b6b);
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  z-index: 1000;
  animation: ${glowPulse} 1s ease-in-out infinite;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
`

interface GameScreenProps {
  gamePubkey: PublicKey
  onBack: () => void
}

function RouletteRoyaleGameScreen({ gamePubkey, onBack }: GameScreenProps) {
  const { publicKey } = useWallet()
  const { game: chainGame, metadata, isStale } = useRateLimitedGame(gamePubkey, {
    fetchMetadata: true,
    updateInterval: 3000, // Update every 3 seconds
    criticalUpdatePhases: ['settled', 'waiting'] // Immediate updates for critical phases
  })
  
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    chip: SOUND_CHIP
  })

  // Game statistics tracking
  const gameStats = useGameStats('roulette-royale')
  const { mobile: isMobile } = useIsCompact()

  // Game state
  const [gamePhase, setGamePhase] = useState<'waiting' | 'betting' | 'spinning' | 'results'>('waiting')
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [winningNumber, setWinningNumber] = useState<number | null>(null)
  const [winner, setWinner] = useState<PublicKey | null>(null)
  const [hasProcessedResults, setHasProcessedResults] = useState(false)
  const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Debug logging for winning number changes
  useEffect(() => {
    console.log('🎯 WINNING NUMBER STATE CHANGED to:', winningNumber, 'Current game phase:', gamePhase, 'Spinning:', isSpinning)
  }, [winningNumber, gamePhase, isSpinning])

  // Betting state  
  const [playerBets, setPlayerBets] = useState<Record<string, any>>({})
  const [myBets, setMyBets] = useState<any[]>([])

  // Track bets per player for chip display
  const [allPlayerBets, setAllPlayerBets] = useState<any[]>([])

  // Helper function for number colors
  const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
    if (num === 0) return 'green'
    const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]
    return redNumbers.includes(num) ? 'red' : 'black'
  }

  // Game phase management
  useEffect(() => {
    console.log('🎮 GAME STATE EFFECT:', {
      hasChainGame: !!chainGame,
      gameState: chainGame?.state,
      gamePhase,
      hasProcessedResults,
      isSpinning,
      gameId: chainGame?.gameId
    })

    if (!chainGame) return

    if (chainGame.state.waiting) {
      console.log('⏳ Game state: WAITING - resetting all state')
      setGamePhase('waiting')
      // Clear bets for new game
      setAllPlayerBets([])
      setMyBets([])
      setWinningNumber(null)
      setWinner(null)
      setShowWinnerAnnouncement(false)
      setHasProcessedResults(false)
      setIsSpinning(false)
      console.log('🔄 Game reset - cleared all state for new game')
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current)
        spinTimeoutRef.current = null
      }
    } else if (chainGame.state.playing) {
      setGamePhase('betting')
      // Start countdown timer
      const endTime = Number(chainGame.softExpirationTimestamp) * 1000
      const updateTimer = () => {
        const now = Date.now()
        const remaining = Math.max(0, endTime - now)
        setTimeLeft(Math.ceil(remaining / 1000))
        
        if (remaining <= 0) {
          setGamePhase('spinning')
          setIsSpinning(true)
          // Start spinning animation, but don't show result yet
        }
      }
      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    } else if (chainGame.state.settled) {
      console.log('🏁 Game state: SETTLED', {
        hasProcessedResults,
        shouldProcess: !hasProcessedResults,
        winnerIndexes: chainGame.winnerIndexes,
        gameId: chainGame.gameId
      })
      
      if (!hasProcessedResults) {
        console.log('✅ Processing results for the first time...')
        setHasProcessedResults(true)
        
        // Get the result immediately
        handleGameResults()
        
        // If we're not already spinning, start spinning immediately
        if (gamePhase !== 'spinning') {
          console.log('🎲 Starting spinning phase')
          setGamePhase('spinning')
          setIsSpinning(true)
        }
        
        // Show spinning for 2 seconds, then stop spinning and show result
        if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
        spinTimeoutRef.current = setTimeout(() => {
          console.log('🎯 Stopping spin, showing results')
          setIsSpinning(false)
          setGamePhase('results')
        }, 2000)
      } else {
        console.log('⚠️ Results already processed, skipping')
      }
    } else {
      console.log('🤔 Unknown game state:', chainGame.state)
    }
  }, [chainGame?.state, gamePhase, hasProcessedResults])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current)
      }
    }
  }, [])

  const handleGameResults = useCallback(() => {
    console.log('🎲 handleGameResults CALLED with chainGame:', { 
      hasChainGame: !!chainGame, 
      gameState: chainGame?.state,
      hasWinnerIndexes: !!chainGame?.winnerIndexes,
      winnerIndexes: chainGame?.winnerIndexes,
      playersCount: chainGame?.players?.length || 0,
      allPlayerBets: allPlayerBets.length,
      myBets: myBets.length
    })
    
    // Log all current player bets for debugging
    console.log('📊 CURRENT PLAYER BETS:', {
      allPlayerBets: allPlayerBets.map(bet => ({
        player: bet.player?.slice(0, 8) + '...',
        type: bet.type,
        value: bet.value,
        amount: bet.amount
      })),
      myBets: myBets.map(bet => ({
        type: bet.type,
        value: bet.value,
        amount: bet.amount
      }))
    })
    
    if (!chainGame || !chainGame.winnerIndexes) {
      console.error('❌ No chain game or winner indexes available:', { chainGame: !!chainGame, winnerIndexes: chainGame?.winnerIndexes })
      return
    }

    console.log('🎯 Raw winnerIndexes:', chainGame.winnerIndexes, 'Type:', typeof chainGame.winnerIndexes[0])
    const winnerIndex = Number(chainGame.winnerIndexes[0])
    
    // Validate winner index is within roulette range (0-36)
    if (winnerIndex < 0 || winnerIndex > 36) {
      console.error('❌ Invalid winner index:', winnerIndex, 'Expected 0-36. Full winnerIndexes:', chainGame.winnerIndexes)
      return
    }
    
    console.log('🎯 ✅ GAME RESULT - Setting winning number:', winnerIndex, 'from winnerIndexes:', chainGame.winnerIndexes)
    console.log('🎲 Game details:', { 
      gameId: chainGame.gameId, 
      gameState: chainGame.state, 
      spinning: isSpinning,
      winnerIndex,
      color: getNumberColor(winnerIndex)
    })
    
    // Check which players had winning bets
    const winningBets = allPlayerBets.filter(bet => 
      (bet.type === 'number' && bet.value === winnerIndex) ||
      (bet.type === 'outside' && bet.value === 'red' && getNumberColor(winnerIndex) === 'red') ||
      (bet.type === 'outside' && bet.value === 'black' && getNumberColor(winnerIndex) === 'black')
    )
    
    console.log('🏆 WINNING ANALYSIS:', {
      winnerIndex,
      color: getNumberColor(winnerIndex),
      totalBets: allPlayerBets.length,
      winningBets: winningBets.map(bet => ({
        player: bet.player?.slice(0, 8) + '...',
        type: bet.type,
        value: bet.value,
        amount: bet.amount
      })),
      losers: allPlayerBets.length - winningBets.length
    })
    
    setWinningNumber(winnerIndex)
    
    // Determine winner (player who bet on winning number)
    const winnerPlayer = chainGame.players.find((player: any) => {
      const playerKey = player.user.toBase58()
      // Check if player's bet includes the winning number
      return allPlayerBets.some(bet => 
        bet.player === playerKey && 
        ((bet.type === 'number' && bet.value === winnerIndex) ||
         (bet.type === 'outside' && bet.value === 'red' && getNumberColor(winnerIndex) === 'red') ||
         (bet.type === 'outside' && bet.value === 'black' && getNumberColor(winnerIndex) === 'black'))
      )
    })
    
    if (winnerPlayer) {
      setWinner(winnerPlayer.user)
      setShowWinnerAnnouncement(true)
      sounds.play('win')
      
      // Hide announcement after 5 seconds
      setTimeout(() => {
        setShowWinnerAnnouncement(false)
      }, 5000)
    } else {
      sounds.play('lose')
    }
  }, [chainGame, allPlayerBets, sounds])

  const isPlayerInGame = publicKey && chainGame?.players.some((p: any) => p.user.equals(publicKey))
  const canJoinGame = chainGame?.state.waiting && !isPlayerInGame && (chainGame.players?.length || 0) < ROULETTE_ROYALE_CONFIG.MAX_PLAYERS

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!chainGame) {
    return (
      <GameContainer>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '20px' }}>🔄 Loading game...</div>
          <BackButton onClick={onBack}>← Back to Lobby</BackButton>
        </div>
      </GameContainer>
    )
  }

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Roulette Royale"
          gameMode="Multiplayer"
          rtp={(0.973 * 100).toFixed(0)}
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.4) 0%, rgba(0, 0, 0, 0.9) 70%)'
        }}>
          {/* Game Section - Player list and wheel transitions sharing space */}
          <div style={{
            position: 'absolute',
            top: 'clamp(8px, 2vw, 15px)',
            left: 'clamp(8px, 2vw, 15px)',
            right: 'clamp(8px, 2vw, 15px)',
            bottom: 'clamp(80px, 15vw, 100px)', // Space for GameControlsSection
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(20px, 5vw, 30px)',
            padding: '10px'
          }}>
            {/* Compact Game Results */}
            {chainGame?.state.complete && winningNumber !== null && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0, 0, 0, 0.9)',
                padding: '10px 15px',
                borderRadius: '10px',
                border: '2px solid #ffd700',
                zIndex: 1000,
                minWidth: '200px',
                maxWidth: '300px'
              }}>
                <div style={{
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  color: '#ffd700',
                  marginBottom: '8px',
                  fontWeight: 'bold'
                }}>
                  🎯 Winner: {winningNumber} ({getNumberColor(winningNumber).toUpperCase()})
                </div>
                
                {/* All Players Results */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem' }}>
                  {allPlayerBets.length > 0 ? allPlayerBets
                    .filter((bet, index, self) => self.findIndex(b => b.player === bet.player) === index) // Unique players
                    .map(bet => {
                      const playerBets = allPlayerBets.filter(b => b.player === bet.player)
                      const hasWin = playerBets.some(b => 
                        (b.type === 'number' && b.value === winningNumber) ||
                        (b.type === 'outside' && b.value === 'red' && getNumberColor(winningNumber) === 'red') ||
                        (b.type === 'outside' && b.value === 'black' && getNumberColor(winningNumber) === 'black')
                      )
                      
                      const playerName = bet.player === publicKey?.toBase58() ? 'You' : `${bet.player.slice(0, 6)}...`
                      
                      return (
                        <div key={bet.player} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '6px 10px',
                          background: hasWin ? 'rgba(40, 167, 69, 0.25)' : 'rgba(220, 53, 69, 0.25)',
                          borderRadius: '6px',
                          border: `2px solid ${hasWin ? '#28a745' : '#dc3545'}`
                        }}>
                          <span style={{ 
                            color: hasWin ? '#28a745' : '#dc3545',
                            fontWeight: 'bold',
                            minWidth: '60px'
                          }}>
                            {hasWin ? '🏆 WIN' : '❌ LOSE'}
                          </span>
                          <span style={{ 
                            color: 'white',
                            fontWeight: playerName === 'You' ? 'bold' : 'normal',
                            flex: 1,
                            textAlign: 'center'
                          }}>
                            {playerName}
                          </span>
                          <span style={{ color: '#ffd700', fontSize: '0.75rem', minWidth: '80px', textAlign: 'right' }}>
                            {playerBets.map(b => b.type === 'number' ? `#${b.value}` : b.value.charAt(0).toUpperCase()).join(', ')}
                          </span>
                        </div>
                      )
                    }) : (
                      <div style={{ textAlign: 'center', color: '#888', fontSize: '0.8rem' }}>
                        No players with bets
                      </div>
                    )}
                </div>
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px',
              width: '100%'
            }}>
              <div>
                <h2 style={{ color: '#ffd700', margin: 0, fontSize: '1.5rem' }}>
                  🎰 Roulette Royale - Table {gamePubkey.toBase58().slice(0, 6)}
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <ConnectionStatus isStale={isStale}>
                  <ConnectionIndicator isStale={isStale} />
                  {isStale ? 'Updating...' : 'Live'}
                </ConnectionStatus>
                <div style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  animation: gamePhase === 'betting' ? 'glowPulse 2s ease-in-out infinite' : 'none',
                  background: gamePhase === 'betting' ? 'linear-gradient(45deg, #4caf50, #45a049)' :
                             gamePhase === 'spinning' ? 'linear-gradient(45deg, #ff9800, #f57c00)' :
                             gamePhase === 'results' ? 'linear-gradient(45deg, #2196f3, #1976d2)' :
                             'rgba(255, 255, 255, 0.2)'
                }}>
                  {gamePhase === 'waiting' && '⏳ Waiting for Players'}
                  {gamePhase === 'betting' && '💰 Betting Open'}
                  {gamePhase === 'spinning' && '🎲 Spinning...'}
                  {gamePhase === 'results' && '🎊 Results'}
                </div>
                <BackButton onClick={onBack}>← Lobby</BackButton>
              </div>
            </div>

            {gamePhase === 'betting' && timeLeft > 0 && (
              <div style={{
                textAlign: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: timeLeft <= 10 ? '#ff6b6b' : '#ffd700',
                padding: '10px',
                border: `2px solid ${timeLeft <= 10 ? '#ff6b6b' : '#ffd700'}`,
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.3)'
              }}>
                ⏰ Betting closes in: {formatTime(timeLeft)}
              </div>
            )}

            {/* Player List and Wheel share this space - transitions between phases */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}>
              {(gamePhase === 'spinning' || gamePhase === 'results') ? (
                <RouletteWheel
                  key={`wheel-${chainGame?.gameId || 'default'}`}
                  spinning={isSpinning}
                  winningNumber={winningNumber}
                  gamePhase={gamePhase}
                  playerBets={allPlayerBets}
                  gameResult={chainGame}
                />
              ) : (
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                  width: '100%',
                  maxWidth: '600px'
                }}>
                  <PlayersList
                    players={chainGame.players}
                    currentPlayer={publicKey}
                    gameState={chainGame.state}
                  />
                </div>
              )}
            </div>

            {myBets.length > 0 && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '15px',
                borderRadius: '8px',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                width: '100%',
                maxWidth: '600px'
              }}>
                <h4 style={{ color: '#ffd700', margin: '0 0 10px 0' }}>My Bets</h4>
                {myBets.map((bet, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '5px'
                  }}>
                    <span>{bet.type}</span>
                    <TokenValue amount={bet.amount} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GameControlsSection at bottom - Mobile-First Design */}
          {(chainGame?.players?.length || 0) > 0 && (
            <GameControlsSection>
              {gamePhase === 'betting' ? (
                <RouletteTable
                  gamePhase={gamePhase}
                  wagerAmount={metadata?.wager || 1} // Use metadata wager or default to 1
                  onBetPlaced={(bet) => {
                    if (!publicKey) return
                    sounds.play('chip')
                    
                    console.log('🎯 PLAYER BET PLACED:', {
                      player: publicKey.toBase58().slice(0, 8) + '...',
                      betType: bet.type,
                      betValue: bet.value,
                      betAmount: bet.amount,
                      gamePhase,
                      gameId: chainGame?.gameId
                    })
                    
                    // Limit chips per player
                    const playerKey = publicKey.toBase58()
                    const currentPlayerBets = allPlayerBets.filter(b => b.player === playerKey)
                    
                    console.log('💰 BET TRACKING:', {
                      playerKey: playerKey.slice(0, 8) + '...',
                      currentBetsCount: currentPlayerBets.length,
                      maxAllowed: ROULETTE_ROYALE_CONFIG.CHIPS_PER_PLAYER,
                      allPlayersTotal: allPlayerBets.length
                    })
                    
                    if (currentPlayerBets.length >= ROULETTE_ROYALE_CONFIG.CHIPS_PER_PLAYER) {
                      // Replace oldest bet if at limit
                      const newBets = [...currentPlayerBets.slice(1), { ...bet, player: playerKey }]
                      const otherBets = allPlayerBets.filter(b => b.player !== playerKey)
                      setAllPlayerBets([...otherBets, ...newBets])
                      setMyBets(newBets)
                      console.log('🔄 BET REPLACED (at limit):', {
                        oldBet: currentPlayerBets[0],
                        newBet: bet,
                        newBetsCount: newBets.length
                      })
                    } else {
                      // Add new bet
                      const newBet = { ...bet, player: playerKey }
                      setAllPlayerBets(prev => [...prev, newBet])
                      setMyBets(prev => [...prev, bet])
                      console.log('➕ NEW BET ADDED:', {
                        newBet,
                        totalPlayerBets: currentPlayerBets.length + 1,
                        totalAllBets: allPlayerBets.length + 1
                      })
                    }
                  }}
                  playerBets={allPlayerBets}
                  disabled={gamePhase !== 'betting' || !isPlayerInGame || (publicKey && allPlayerBets.filter(b => b.player === publicKey.toBase58()).length >= ROULETTE_ROYALE_CONFIG.CHIPS_PER_PLAYER)}
                />
              ) : (
                <div style={{ 
                  display: 'flex', 
                  gap: 'min(12px, 3vw)', 
                  alignItems: 'center', 
                  width: '100%',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  padding: '0 5px'
                }}>
                  {/* Real Players Info Tiles */}
                  {chainGame?.players?.map((player: any, index: number) => {
                    const playerKey = player.user.toBase58()
                    const isCurrentPlayer = publicKey?.toBase58() === playerKey
                    const playerBets = allPlayerBets.filter(bet => bet.player === playerKey)
                    
                    return (
                      <div key={playerKey} style={{
                        background: 'rgba(26, 32, 44, 0.9)',
                        borderRadius: '12px',
                        padding: 'clamp(8px, 2vw, 12px)',
                        textAlign: 'center',
                        minWidth: 'clamp(80px, 20vw, 100px)',
                        flex: '1 1 auto',
                        maxWidth: '120px',
                        border: isCurrentPlayer ? '2px solid rgba(72, 187, 120, 0.6)' : '2px solid rgba(74, 85, 104, 0.5)',
                        boxShadow: '0 4px 16px rgba(26, 32, 44, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}>
                        <div style={{ 
                          fontSize: 'clamp(10px, 2vw, 12px)', 
                          marginBottom: '4px', 
                          color: '#a0aec0',
                          fontWeight: 'bold'
                        }}>
                          {generateUsernameFromWallet(playerKey)}
                        </div>
                        <div style={{ 
                          fontSize: 'clamp(12px, 2.5vw, 14px)', 
                          fontWeight: 'bold', 
                          color: isCurrentPlayer ? '#48bb78' : '#ffa500',
                          marginBottom: '2px'
                        }}>
                          {isCurrentPlayer ? '🟢' : '👤'}
                        </div>
                        <div style={{ 
                          fontSize: 'clamp(8px, 1.5vw, 10px)', 
                          color: '#a0aec0',
                          wordBreak: 'break-all',
                          lineHeight: '1.2'
                        }}>
                          {`${playerKey.slice(0, 4)}...${playerKey.slice(-4)}`}
                        </div>
                        <div style={{ 
                          fontSize: 'clamp(10px, 2vw, 12px)', 
                          color: '#ffd700',
                          marginTop: '4px',
                          fontWeight: 'bold'
                        }}>
                          {playerBets.length > 0 ? `${playerBets.length} bets` : 'Ready'}
                        </div>
                      </div>
                    )
                  }) || []}
                </div>
              )}
            </GameControlsSection>
          )}
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          padding: '15px',
          flexWrap: 'wrap'
        }}>
          {canJoinGame && (
            <Multiplayer.JoinGame
              pubkey={gamePubkey}
              account={chainGame as any}
              creatorAddress={PLATFORM_CREATOR_ADDRESS}
              creatorFeeBps={MULTIPLAYER_FEE_BPS}
              referralFee={PLATFORM_REFERRAL_FEE}
              enableMetadata
              onTx={() => sounds.play('play')}
            />
          )}

          {isPlayerInGame && gamePhase === 'waiting' && (
            <Multiplayer.EditBet
              pubkey={gamePubkey}
              account={chainGame as any}
              creatorAddress={PLATFORM_CREATOR_ADDRESS}
              creatorFeeBps={MULTIPLAYER_FEE_BPS}
              onComplete={() => {}}
            />
          )}
        </div>
      </GambaUi.Portal>
    </>
  )
}

export default RouletteRoyaleGameScreen
