import { GambaUi, useSound, useWagerInput, useCurrentPool } from 'gamba-react-ui-v2'
import React from 'react'
import styled from 'styled-components'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, SliderControl } from '../../components'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import { useGameStats } from '../../hooks/game/useGameStats'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import CustomSlider from './Slider'
import CRASH_SOUND from './crash.mp3'
import SOUND from './music.mp3'
import { LineLayer1, LineLayer2, LineLayer3, MultiplierText, Rocket, ScreenWrapper, StarsLayer1, StarsLayer2, StarsLayer3 } from './styles'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { CRASH_CONFIG } from '../rtpConfig'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import WIN_SOUND from './win.mp3'
import { makeDeterministicRng } from '../../fairness/deterministicRng'

// Custom desktop controls for crash game
const CrashDesktopControls = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  
  @media (max-width: 800px) {
    display: none;
  }
`

// Auto cash out control
const AutoCashOutContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`

const AutoCashOutInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  width: 80px;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`

const CashOutButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#666' : 'linear-gradient(135deg, #4CAF50, #45a049)'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.disabled ? '#666' : 'linear-gradient(135deg, #45a049, #4CAF50)'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-1px)'};
  }
  
  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(0)'};
  }
`

const GameStatus = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  z-index: 100;
`

type GameState = 'waiting' | 'betting' | 'playing' | 'crashed' | 'cashed_out'

export default function CrashGame() {
  const [wager, setWager] = useWagerInput()
  const [autoCashOut, setAutoCashOut] = React.useState(2.0)
  const [currentMultiplier, setCurrentMultiplier] = React.useState(1.0)
  const [gameState, setGameState] = React.useState<GameState>('waiting')
  const [crashMultiplier, setCrashMultiplier] = React.useState(0)
  const [hasBet, setHasBet] = React.useState(false)
  const [cashedOutAt, setCashedOutAt] = React.useState(0)
  const [countdown, setCountdown] = React.useState(0)
  const [currentCrashPoint, setCurrentCrashPoint] = React.useState(0)
  const [gameResult, setGameResult] = React.useState<Promise<any> | null>(null)
  
  const game = GambaUi.useGame()
  const pool = useCurrentPool()
  const sound = useSound({ music: SOUND, crash: CRASH_SOUND, win: WIN_SOUND })
  
  // Animation cleanup ref
  const animationCleanupRef = React.useRef<(() => void) | null>(null)

  // Pool restrictions - conservative max for crash games
  const maxMultiplier = React.useMemo(() => {
    return 100 // Conservative max to protect liquidity
  }, [])

  const maxWagerForPool = React.useMemo(() => {
    return pool.maxPayout / maxMultiplier
  }, [pool.maxPayout, maxMultiplier])

  const potentialPayout = wager * currentMultiplier
  const poolExceeded = potentialPayout > pool.maxPayout

  // useEffect to clamp wager
  React.useEffect(() => {
    if (wager > maxWagerForPool) {
      setWager(maxWagerForPool)
    }
  }, [maxWagerForPool, wager, setWager])
  
  // Get graphics settings to check if motion is enabled
  const { settings } = useGraphics()
  
  // Mobile detection for responsive stats display
  const { mobile: isMobile } = useIsCompact()

  // Game statistics tracking - using centralized hook
  const gameStats = useGameStats('crash')
  
  // Effects system for enhanced visual feedback
  const effectsRef = React.useRef<GameplayEffectsRef>(null)

  const getRocketStyle = () => {
    // Smooth logarithmic scale for rocket movement
    const multiplierForMovement = Math.max(currentMultiplier, 1)
    const logMultiplier = Math.log(multiplierForMovement)
    const maxLogMultiplier = Math.log(20) // Up to 20x for full travel across screen
    const progress = Math.min(logMultiplier / maxLogMultiplier, 1)

    // Smooth movement across screen
    const leftOffset = 10
    const bottomOffset = 15
    const left = leftOffset + progress * (85 - leftOffset) // Move from 10% to 85% across screen
    const bottom = bottomOffset + Math.pow(progress, 1.2) * (80 - bottomOffset) // Smooth vertical curve
    
    // Gradual rotation from vertical to horizontal
    const rotationProgress = Math.pow(progress, 0.8)
    const startRotationDeg = 90 // Start pointing up
    const endRotationDeg = 15 // End mostly horizontal
    const rotation = startRotationDeg - (rotationProgress * (startRotationDeg - endRotationDeg))

    return {
      bottom: `${bottom}%`,
      left: `${left}%`,
      transform: `rotate(${rotation}deg)`,
      transition: gameState === 'crashed' ? 'none' : 'all 0.1s ease-out', // Smooth transitions except on crash
    }
  }

  // Generate deterministic crash point from game result
  const generateCrashPoint = (seed: string) => {
    const rng = makeDeterministicRng(`crash:${seed}`)
    const base = rng()
    
    // Crash distribution - most crashes happen early, some go very high
    // This creates the classic crash game distribution
    if (base < 0.5) {
      // 50% chance of crash between 1x and 2x
      return 1 + base * 2
    } else if (base < 0.8) {
      // 30% chance of crash between 2x and 5x
      return 2 + (base - 0.5) / 0.3 * 3
    } else if (base < 0.95) {
      // 15% chance of crash between 5x and 20x
      return 5 + (base - 0.8) / 0.15 * 15
    } else {
      // 5% chance of very high multipliers (20x - 100x+)
      return 20 + (base - 0.95) / 0.05 * 80
    }
  }

  // Animate multiplier growth
  const animateMultiplier = React.useCallback((targetCrash: number) => {
    let animationId: number
    let lastTime = Date.now()
    let currentMult = 1.0
    
    const animate = () => {
      const currentTime = Date.now()
      const deltaTime = currentTime - lastTime
      lastTime = currentTime
      
      // Smooth growth rate - starts slow, gradually accelerates
      // The higher the multiplier, the faster it grows
      const baseGrowthRate = 0.0008 // Much slower base rate (was 0.005)
      const accelerationFactor = (currentMult - 1) * 0.0003 // Slower acceleration (was 0.002)
      const growthRate = baseGrowthRate + accelerationFactor
      const increment = growthRate * deltaTime // Scale by actual time passed
      
      currentMult = Math.min(currentMult + increment, targetCrash)
      setCurrentMultiplier(currentMult)
      
      // Check auto cash out
      if (hasBet && currentMult >= autoCashOut && gameState === 'playing') {
        handleCashOut()
        return
      }
      
      // Check if we've reached crash point
      if (currentMult >= targetCrash) {
        handleCrash()
        return
      }
      
      // Continue animation
      if (gameState === 'playing') {
        animationId = requestAnimationFrame(animate)
      }
    }
    
    animationId = requestAnimationFrame(animate)
    
    const cleanup = () => cancelAnimationFrame(animationId)
    animationCleanupRef.current = cleanup
    return cleanup
  }, [hasBet, autoCashOut, gameState])

  // Handle manual cash out
  const handleCashOut = React.useCallback(async () => {
    if (gameState !== 'playing' || !hasBet || !gameResult) return
    
    setCashedOutAt(currentMultiplier)
    setGameState('cashed_out')
    
    try {
      // For cash out, we simulate a win with the current multiplier
      // The actual payout will be handled by Gamba based on our bet array
      console.log(`💰 Cashed out at ${currentMultiplier.toFixed(2)}x`)
      
      // Trigger effects
      effectsRef.current?.winFlash()
      effectsRef.current?.particleBurst(70, 30, undefined, 12)
      effectsRef.current?.screenShake(1, 400)
      
      sound.play('win')
      sound.sounds.music.player.stop()
      
    } catch (error) {
      console.error('Cash out error:', error)
    }
  }, [gameState, hasBet, gameResult, currentMultiplier, sound])

  // Handle crash
  const handleCrash = React.useCallback(() => {
    setGameState('crashed')
    setCrashMultiplier(currentMultiplier)
    
    // Trigger crash effects
    effectsRef.current?.loseFlash()
    effectsRef.current?.particleBurst(70, 30, undefined, 25)
    effectsRef.current?.screenShake(3, 800)
    
    sound.play('crash')
    sound.sounds.music.player.stop()
    
    console.log(`💥 Crashed at ${currentMultiplier.toFixed(2)}x`)
    
    // Reset for next round after delay
    setTimeout(startNewRound, 3000)
  }, [currentMultiplier, sound])

  // Start new round
  const startNewRound = React.useCallback(() => {
    // Clean up any running animations
    if (animationCleanupRef.current) {
      animationCleanupRef.current()
      animationCleanupRef.current = null
    }
    
    setGameState('betting')
    setCurrentMultiplier(1.0)
    setCrashMultiplier(0)
    setHasBet(false)
    setCashedOutAt(0)
    setCurrentCrashPoint(0)
    setGameResult(null)
    setCountdown(5) // 5 second betting phase
    
    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setGameState('playing')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  // Place bet for current round
  const placeBet = async () => {
    if (gameState !== 'betting' || hasBet || wager <= 0) return
    
    try {
      // Create a simple bet array for crash mechanics
      // We use a basic win/lose scenario and handle the multiplier logic separately
      const bet = [0, wager * 0.96] // House edge of 4%
      
      const result = game.play({ wager, bet })
      setGameResult(result)
      setHasBet(true)
      
      console.log(`🎮 Bet placed: ${wager} SOL`)
      
    } catch (error) {
      console.error('Failed to place bet:', error)
    }
  }

  const multiplierColor = React.useMemo(() => {
    if (gameState === 'crashed') return '#ff0000'
    if (gameState === 'cashed_out') return '#00ff00'
    if (currentMultiplier >= 2) return '#ffd700' // Gold for high multipliers
    return '#ffffff'
  }, [gameState, currentMultiplier])

  // Initialize game on mount
  React.useEffect(() => {
    startNewRound()
  }, [startNewRound])

  // Handle countdown and game start
  React.useEffect(() => {
    if (gameState === 'playing' && hasBet && gameResult) {
      // Get the actual result and determine crash point
      const processGame = async () => {
        try {
          // Clean up any existing animation first
          if (animationCleanupRef.current) {
            animationCleanupRef.current()
            animationCleanupRef.current = null
          }
          
          // Reset multiplier to exactly 1.0 before starting
          setCurrentMultiplier(1.0)
          
          const result = await gameResult
          const crashPoint = generateCrashPoint(`${result.resultIndex}:${result.payout}`)
          setCurrentCrashPoint(crashPoint)
          
          console.log(`🚀 Game started! Crash point: ${crashPoint.toFixed(2)}x`)
          
          sound.play('music')
          
          // Start animation after a small delay to ensure state is updated
          setTimeout(() => {
            animateMultiplier(crashPoint)
          }, 50)
          
        } catch (error) {
          console.error('Game processing error:', error)
          startNewRound()
        }
      }
      
      processGame()
    }
  }, [gameState, hasBet, gameResult, sound, animateMultiplier, startNewRound])

  // Handle game outcomes
  React.useEffect(() => {
    if (gameState === 'cashed_out' && cashedOutAt > 0) {
      // Update stats for win
      gameStats.updateStats(wager * cashedOutAt * 0.96) // Apply house edge
      
      // Reset for next round after delay
      setTimeout(startNewRound, 2000)
    } else if (gameState === 'crashed') {
      // Update stats for loss
      gameStats.updateStats(0)
      
      // Already handled in handleCrash
    }
  }, [gameState, cashedOutAt, wager, gameStats, startNewRound])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (animationCleanupRef.current) {
        animationCleanupRef.current()
      }
    }
  }, [])

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Crash"
          gameMode="Rocket"
          rtp="96"
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <ScreenWrapper>
          <StarsLayer1 enableMotion={settings.enableMotion} style={{ opacity: currentMultiplier > 3 ? 0 : 1 }} />
          <LineLayer1 enableMotion={settings.enableMotion} style={{ opacity: currentMultiplier > 3 ? 1 : 0 }} />
          <StarsLayer2 enableMotion={settings.enableMotion} style={{ opacity: currentMultiplier > 2 ? 0 : 1 }} />
          <LineLayer2 enableMotion={settings.enableMotion} style={{ opacity: currentMultiplier > 2 ? 1 : 0 }} />
          <StarsLayer3 enableMotion={settings.enableMotion} style={{ opacity: currentMultiplier > 1 ? 0 : 1 }} />
          <LineLayer3 enableMotion={settings.enableMotion} style={{ opacity: currentMultiplier > 1 ? 1 : 0 }} />
          
          {/* Game Status */}
          <GameStatus>
            {gameState === 'betting' && `Betting Phase: ${countdown}s`}
            {gameState === 'playing' && 'Flying...'}
            {gameState === 'crashed' && `Crashed at ${crashMultiplier.toFixed(2)}x`}
            {gameState === 'cashed_out' && `Cashed out at ${cashedOutAt.toFixed(2)}x`}
            {gameState === 'waiting' && 'Starting...'}
          </GameStatus>
          
          <MultiplierText color={multiplierColor}>
            {currentMultiplier.toFixed(2)}x
          </MultiplierText>
          
          <Rocket style={getRocketStyle()} />
          
          {/* Cash Out Button - only show when player has bet and game is active */}
          {hasBet && gameState === 'playing' && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}>
              <CashOutButton onClick={handleCashOut}>
                Cash Out @ {currentMultiplier.toFixed(2)}x
                <br />
                <small>Win: {(wager * currentMultiplier * 0.96).toFixed(4)} SOL</small>
              </CashOutButton>
            </div>
          )}
        </ScreenWrapper>
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
          {...(useGameMeta('crash') && { title: useGameMeta('crash')!.name, description: useGameMeta('crash')!.description })}
        />
      </GambaUi.Portal>
      
      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={placeBet}
          playDisabled={gameState !== 'betting' || hasBet || poolExceeded || wager <= 0}
          playText={
            gameState === 'betting' 
              ? hasBet 
                ? `Bet Placed (${countdown}s)` 
                : `Place Bet (${countdown}s)`
              : gameState === 'playing'
              ? 'Round Active'
              : 'Next Round'
          }
        >
          <SliderControl
            label="Auto Cash Out"
            value={autoCashOut}
          >
            <AutoCashOutContainer>
              <span style={{ color: 'white', fontSize: '12px' }}>Auto @</span>
              <AutoCashOutInput
                type="number"
                value={autoCashOut}
                onChange={(e) => setAutoCashOut(Math.max(1.01, parseFloat(e.target.value) || 1.01))}
                min="1.01"
                max="100"
                step="0.01"
                disabled={gameState === 'playing'}
              />
              <span style={{ color: 'white', fontSize: '12px' }}>x</span>
            </AutoCashOutContainer>
          </SliderControl>
        </MobileControls>
        
        {/* Desktop controls: Custom layout for crash game */}
        <CrashDesktopControls>
          <EnhancedWagerInput 
            value={wager} 
            onChange={setWager}
            disabled={gameState === 'playing'}
          />
          <AutoCashOutContainer>
            <span style={{ color: 'white', fontSize: '14px' }}>Auto Cash Out @</span>
            <AutoCashOutInput
              type="number"
              value={autoCashOut}
              onChange={(e) => setAutoCashOut(Math.max(1.01, parseFloat(e.target.value) || 1.01))}
              min="1.01"
              max="100"
              step="0.01"
              disabled={gameState === 'playing'}
            />
            <span style={{ color: 'white', fontSize: '14px' }}>x</span>
          </AutoCashOutContainer>
          <EnhancedPlayButton 
            onClick={placeBet} 
            disabled={gameState !== 'betting' || hasBet || poolExceeded || wager <= 0}
          >
            {gameState === 'betting' 
              ? hasBet 
                ? `Bet Placed (${countdown}s)` 
                : `Place Bet (${countdown}s)`
              : gameState === 'playing'
              ? 'Round Active'
              : 'Next Round'
            }
          </EnhancedPlayButton>
        </CrashDesktopControls>
      </GambaUi.Portal>
    </>
  )
}