import { useEffect, useState, useCallback } from 'react'
import { PublicKey, Keypair } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { GambaUi, useSound, TokenValue } from 'gamba-react-ui-v2'
import styled, { keyframes } from 'styled-components'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, DesktopControls, GameControlsSection } from '../../../components'
import { useIsCompact } from '../../../hooks/ui/useIsCompact'
import { GameStatsHeader } from '../../../components/Game/GameStatsHeader'
import { useGameStats } from '../../../hooks/game/useGameStats'
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

const GameStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: #ffd700;
  font-weight: bold;
`

const GameContent = styled.div`
  display: flex;
  gap: 20px;
  flex-grow: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const TableSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const WheelSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const PlayersSection = styled.div`
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(255, 215, 0, 0.3);
`

const BettingControls = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 15px;
  flex-wrap: wrap;
`

const DebugBanner = styled.div`
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 10px 20px;
  text-align: center;
  font-weight: bold;
  border-radius: 8px;
  margin-bottom: 20px;
  animation: ${glowPulse} 2s ease-in-out infinite;
`

const BackButton = styled.button`
  background: rgba(255, 0, 0, 0.2);
  color: white;
  border: 1px solid rgba(255, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 0, 0, 0.4);
    border-color: rgba(255, 0, 0, 0.8);
  }
`

// Generate fake players - same as PlinkoRace approach
function generateFakePlayer(index: number) {
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry']
  
  return {
    user: Keypair.generate().publicKey,
    name: names[index % names.length] + (index + 1),
    status: 'joined' as const,
    wager: (index + 1) * 2000000, // Deterministic wager amounts
  }
}

interface DebugGameScreenProps {
  onBack: () => void
}

export default function DebugGameScreen({ onBack }: DebugGameScreenProps) {
  const { publicKey } = useWallet()
  
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    chip: SOUND_CHIP
  })
  
  // Game statistics tracking
  const gameStats = useGameStats('roulette-royale')
  const { mobile: isMobile } = useIsCompact()
  
  const [gamePhase, setGamePhase] = useState<'wagering' | 'placing' | 'spinning' | 'outcome' | 'lobby'>('wagering')
  const [timeLeft, setTimeLeft] = useState(30)
  const [wageringTimeLeft, setWageringTimeLeft] = useState(30)
  const [currentBets, setCurrentBets] = useState<any[]>([])
  const [winningNumber, setWinningNumber] = useState<number | null>(null)
  const [hasCommitted, setHasCommitted] = useState(false)
  const [wagerAmount, setWagerAmount] = useState(1000000) // Initial wager
  
  // Generate fake players
  const [fakePlayers] = useState(['Alice', 'Bob', 'Charlie', 'Diana'])
  
  const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
    if (num === 0) return 'green'
    const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]
    return redNumbers.includes(num) ? 'red' : 'black'
  }
  
    // Simulate 5-phase game
  useEffect(() => {
    if (gamePhase === 'wagering') {
      // Start wagering countdown
      let interval: NodeJS.Timeout
      if (wageringTimeLeft > 0 && !hasCommitted) {
        interval = setInterval(() => {
          setWageringTimeLeft(prev => {
            if (prev <= 1) {
              // Timeout - return to lobby
              setGamePhase('lobby')
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
      return () => {
        if (interval) clearInterval(interval)
      }
    }
    
    if (gamePhase === 'placing') {
      // Start countdown for placing bets
      let interval: NodeJS.Timeout
      if (timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              setGamePhase('spinning')
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
      return () => {
        if (interval) clearInterval(interval)
      }
    }
    
    if (gamePhase === 'spinning') {
      // Simulate spinning for 3 seconds then show outcome
      setTimeout(() => {
        // Use a more realistic random result (simulating gamba resultIndex)
        const randomWinningNumber = Math.floor(Math.random() * 37) // 0-36
        setWinningNumber(randomWinningNumber)
        setGamePhase('outcome')
        
        // Check for winners and play sounds
        const hasWinner = currentBets.some(bet => 
          (bet.type === 'number' && bet.value === randomWinningNumber) ||
          (bet.type === 'outside' && bet.value === 'red' && getNumberColor(randomWinningNumber) === 'red') ||
          (bet.type === 'outside' && bet.value === 'black' && getNumberColor(randomWinningNumber) === 'black')
        )
        sounds.play(hasWinner ? 'win' : 'lose')
        
        // Return to lobby after 5 seconds (not wagering)
        setTimeout(() => {
          setGamePhase('lobby')
          setWinningNumber(null)
          setCurrentBets([])
          setTimeLeft(30)
          setWageringTimeLeft(30)
          setHasCommitted(false)
        }, 5000)
      }, 3000)
    }
  }, [gamePhase, timeLeft, wageringTimeLeft, hasCommitted, currentBets, sounds, fakePlayers])
  
  const handleCommitWager = useCallback(() => {
    if (hasCommitted) return
    setHasCommitted(true)
    setGamePhase('placing')
    sounds.play('play')
  }, [hasCommitted, sounds])
  
  const handleBetPlaced = useCallback((betData: any) => {
    if (gamePhase !== 'placing' || !hasCommitted || !publicKey) return
    sounds.play('chip')
    // Allow configurable number of chips per player
    setCurrentBets(prev => {
      const playerKey = publicKey.toBase58()
      const playerBets = prev.filter(bet => bet.player === playerKey)
      if (playerBets.length >= ROULETTE_ROYALE_CONFIG.CHIPS_PER_PLAYER) {
        // Replace the oldest bet if at limit
        const newBets = [...playerBets.slice(1), { ...betData, player: playerKey }]
        const otherBets = prev.filter(bet => bet.player !== playerKey)
        return [...otherBets, ...newBets]
      } else {
        // Add new bet
        return [...prev, { ...betData, player: playerKey }]
      }
    })
  }, [gamePhase, hasCommitted, publicKey, sounds])
  
  const handleWagerContinue = useCallback(() => {
    setHasCommitted(true)
    setGamePhase('placing')
    sounds.play('play')
  }, [sounds])
  
  const handleStartSpinning = useCallback(() => {
    setGamePhase('spinning')
    sounds.play('play')
  }, [sounds])
  
  const getPhaseText = () => {
    switch (gamePhase) {
      case 'wagering':
        return `Set your wager amount... ${wageringTimeLeft}s`
      case 'placing':
        return `Place your bets! ${timeLeft}s`
      case 'spinning':
        return 'Spinning...'
      case 'outcome':
        return `Winning number: ${winningNumber}`
      case 'lobby':
        return 'Returning to lobby...'
      default:
        return ''
    }
  }
  
  // All players (fake + real player if committed)
  const allPlayers = [
    ...fakePlayers.map((name, index) => ({
      user: Keypair.generate().publicKey, // Generate fake public keys for demo
      name,
      status: 'joined' as const,
      wager: wagerAmount
    })),
    ...(hasCommitted && publicKey ? [{ 
      user: publicKey, 
      name: 'You', 
      status: 'joined' as const,
      wager: wagerAmount 
    }] : [])
  ]
  
  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Roulette Royale"
          gameMode="Debug"
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

          <div style={{
            position: 'absolute',
            top: 'clamp(10px, 3vw, 20px)',
            left: 'clamp(10px, 3vw, 20px)',
            right: 'clamp(10px, 3vw, 20px)',
            bottom: 'clamp(10px, 3vw, 20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Phase-based full screen content */}
            {gamePhase === 'wagering' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '30px',
                width: '100%',
                maxWidth: '600px'
              }}>
                <h2 style={{ color: '#ffd700', margin: 0, fontSize: '2rem' }}>
                  Set Your Wager
                </h2>
                <div style={{ color: '#ff6b6b', fontSize: '0.9rem', textAlign: 'center' }}>
                  Time remaining: {wageringTimeLeft}s - Commit wager or return to lobby
                </div>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '10px',
                  padding: '15px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  width: '100%'
                }}>
                  <PlayersList
                    players={allPlayers}
                    currentPlayer={publicKey}
                    gameState={{ wagering: true }}
                  />
                </div>
              </div>
            )}

            {gamePhase === 'placing' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                width: '100%',
                height: '100%'
              }}>
                <div style={{
                  color: '#ffd700',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  Place Your Bets! Time left: {timeLeft}s
                </div>
                <RouletteTable
                  gamePhase={gamePhase}
                  onBetPlaced={handleBetPlaced}
                  playerBets={currentBets}
                  disabled={gamePhase !== 'placing' || !publicKey || currentBets.filter(bet => bet.player === publicKey.toBase58()).length >= ROULETTE_ROYALE_CONFIG.CHIPS_PER_PLAYER}
                />
              </div>
            )}

            {gamePhase === 'spinning' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '30px',
                width: '100%',
                height: '100%'
              }}>
                <h2 style={{ color: '#ffd700', margin: 0, fontSize: '2rem' }}>
                  Spinning...
                </h2>
                <RouletteWheel
                  spinning={true}
                  winningNumber={winningNumber}
                  gamePhase={gamePhase}
                />
              </div>
            )}

            {gamePhase === 'outcome' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '30px',
                width: '100%',
                maxWidth: '600px'
              }}>
                <h2 style={{ color: '#ffd700', margin: 0, fontSize: '2rem' }}>
                  Winning Number: {winningNumber}
                </h2>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '10px',
                  padding: '15px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  width: '100%'
                }}>
                  <PlayersList
                    players={allPlayers}
                    currentPlayer={publicKey}
                    gameState={{ outcome: true, winningNumber }}
                  />
                </div>
              </div>
            )}

            {gamePhase === 'lobby' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '30px'
              }}>
                <h2 style={{ color: '#ffd700', margin: 0, fontSize: '2rem' }}>
                  Returning to Lobby...
                </h2>
                <BackButton onClick={onBack}>
                  ← Back to Lobby
                </BackButton>
              </div>
            )}
          </div>
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wagerAmount}
          setWager={setWagerAmount}
          onPlay={gamePhase === 'wagering' ? handleWagerContinue : handleStartSpinning}
          playDisabled={gamePhase === 'wagering' ? false : gamePhase !== 'placing'}
          playText={
            gamePhase === 'wagering' ? "Continue to Betting" :
            gamePhase === 'placing' ? "Start Spinning" :
            "Waiting..."
          }
        />

        <DesktopControls>
          <EnhancedWagerInput value={wagerAmount} onChange={setWagerAmount} disabled={gamePhase !== 'wagering'} />
          <EnhancedPlayButton 
            disabled={gamePhase === 'wagering' ? false : gamePhase !== 'placing'}
            onClick={gamePhase === 'wagering' ? handleWagerContinue : handleStartSpinning}
          >
            {gamePhase === 'wagering' ? "Continue to Betting" :
             gamePhase === 'placing' ? "Start Spinning" :
             "Waiting..."}
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}