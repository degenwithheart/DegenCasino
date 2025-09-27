import React, { useEffect, useState, useRef, useCallback } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useGame } from 'gamba-react-v2'
import { GambaUi, Multiplayer, useSound, TokenValue } from 'gamba-react-ui-v2'
import styled, { keyframes } from 'styled-components'
import { 
  PLATFORM_CREATOR_ADDRESS,
  MULTIPLAYER_FEE_BPS,
  PLATFORM_REFERRAL_FEE,
} from '../../../constants'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, DesktopControls, GameControlsSection } from '../../../components'
import { useIsCompact } from '../../../hooks/ui/useIsCompact'
import { GameStatsHeader } from '../../../components/Game/GameStatsHeader'
import { useGameStats } from '../../../hooks/game/useGameStats'
import RouletteTable from './RouletteTable'
import RouletteWheel from './RouletteWheel'
import PlayersList from './PlayersList'
import { SOUND_WIN, SOUND_LOSE, SOUND_PLAY, SOUND_CHIP } from '../constants'
import { getRouletteRoyaleBetArray } from '../../rtpConfigMultiplayer'

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
  const { game: chainGame, metadata } = useGame(gamePubkey, { fetchMetadata: true })
  
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
  const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState(false)

  // Betting state  
  const [playerBets, setPlayerBets] = useState<Record<string, any>>({})
  const [myBets, setMyBets] = useState<any[]>([])

  // Game phase management
  useEffect(() => {
    if (!chainGame) return

    if (chainGame.state.waiting) {
      setGamePhase('waiting')
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
        }
      }
      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    } else if (chainGame.state.settled) {
      setGamePhase('results')
      // Show results and winner
      handleGameResults()
    }
  }, [chainGame?.state])

  const handleGameResults = useCallback(() => {
    if (!chainGame || !chainGame.winnerIndexes) return

    const winnerIndex = Number(chainGame.winnerIndexes[0])
    setWinningNumber(winnerIndex)
    
    // Determine winner (player who bet on winning number)
    const winnerPlayer = chainGame.players.find(player => {
      // Check if player's bet includes the winning number
      // This would need to be implemented based on how bets are stored
      return false // Placeholder
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
  }, [chainGame, sounds])

  const isPlayerInGame = publicKey && chainGame?.players.some(p => p.user.equals(publicKey))
  const canJoinGame = chainGame?.state.waiting && !isPlayerInGame

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
            top: 'clamp(10px, 3vw, 20px)',
            left: 'clamp(10px, 3vw, 20px)',
            right: 'clamp(10px, 3vw, 20px)',
            bottom: 'clamp(100px, 20vw, 120px)', // Space for GameControlsSection
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(20px, 5vw, 30px)',
            padding: '10px'
          }}>
            {showWinnerAnnouncement && winner && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'linear-gradient(45deg, #ffd700, #ff6b6b)',
                padding: '30px',
                borderRadius: '16px',
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                zIndex: 1000,
                animation: 'glowPulse 1s ease-in-out infinite',
                boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)'
              }}>
                🎉 Winner: {winner.toBase58().slice(0, 8)}... 🎉
                <br />
                <small>Number: {winningNumber}</small>
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
              {gamePhase === 'spinning' ? (
                <RouletteWheel
                  spinning={true}
                  winningNumber={winningNumber}
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

          {/* GameControlsSection - Table replaces the controls */}
          <GameControlsSection>
            <RouletteTable
              gamePhase={gamePhase}
              onBetPlaced={(bet) => {
                sounds.play('chip')
                setMyBets(prev => [...prev, bet])
              }}
              disabled={gamePhase !== 'betting' || !isPlayerInGame}
            />
          </GameControlsSection>
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
