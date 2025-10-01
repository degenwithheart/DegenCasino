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
import { CRASH_CONFIG_V3 } from '../rtpConfig-v3'
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

export default function CrashGame() {
  const [wager, setWager] = useWagerInput()
  const [currentMultiplier, setCurrentMultiplier] = React.useState(0)
  const [finalMultiplier, setFinalMultiplier] = React.useState(0) // Where it actually crashed/won
  const [actualWinMultiplier, setActualWinMultiplier] = React.useState(0) // The real payout multiplier
  const [rocketState, setRocketState] = React.useState<'idle' | 'climbing' | 'win' | 'crash'>('idle')
  const game = GambaUi.useGame()
  const pool = useCurrentPool()
  const sound = useSound({ music: SOUND, crash: CRASH_SOUND, win: WIN_SOUND })

  // Pool restrictions - based on reasonable maximum (50x)
  const maxPossibleMultiplier = 50.0
  const maxWagerForPool = React.useMemo(() => {
    return pool.maxPayout / maxPossibleMultiplier
  }, [pool.maxPayout])

  const maxPayout = wager * maxPossibleMultiplier
  const poolExceeded = maxPayout > pool.maxPayout

  // useEffect to clamp wager like Plinko
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
    // Use finalMultiplier if game is finished, otherwise currentMultiplier
    const displayMultiplier = rocketState === 'idle' ? currentMultiplier : 
                             (rocketState === 'climbing' ? currentMultiplier : finalMultiplier)
    const progress = Math.min(displayMultiplier / maxPossibleMultiplier, 1)

    const leftOffset = 20
    const bottomOffset = 30
    const left = progress * (100 - leftOffset)
    const bottom = Math.pow(progress, 5) * (100 - bottomOffset)
    const rotationProgress = Math.pow(progress, 2.3)
    const startRotationDeg = 90
    const rotation = (1 - rotationProgress) * startRotationDeg

    return {
      bottom: `${bottom}%`,
      left: `${left}%`,
      transform: `rotate(${rotation}deg)`,
    }
  }

  // Smooth climbing function that climbs until final multiplier
  const climbSmooth = (
    startMultiplier: number,
    finalMultiplier: number,
    winMultiplier: number,
    isWinner: boolean
  ) => {
    const baseIncrement = 0.01
    const nextIncrement = baseIncrement * (Math.floor(startMultiplier) + 1)
    const nextValue = startMultiplier + nextIncrement

    setCurrentMultiplier(nextValue)

    // Check if we've reached the final multiplier (win or crash point)
    if (nextValue >= finalMultiplier) {
      sound.sounds.music.player.stop()
      sound.play(isWinner ? 'win' : 'crash')
      setRocketState(isWinner ? 'win' : 'crash')
      setFinalMultiplier(finalMultiplier)
      setCurrentMultiplier(finalMultiplier)
      
      // ✨ TRIGGER CRASH GAME EFFECTS
      if (isWinner) {
        console.log(`🚀 CRASH WIN! Rocket reached ${finalMultiplier.toFixed(2)}x and won!`)
        effectsRef.current?.winFlash()
        effectsRef.current?.particleBurst(70, 30, undefined, 12)
        effectsRef.current?.screenShake(1, 600)
      } else {
        console.log(`💥 CRASH! Rocket exploded at ${finalMultiplier.toFixed(2)}x`)
        effectsRef.current?.loseFlash()
        effectsRef.current?.particleBurst(70, 30, undefined, 20)
        effectsRef.current?.screenShake(2, 800)
      }
      return
    }

    // Continue climbing smoothly
    setTimeout(() => climbSmooth(nextValue, finalMultiplier, winMultiplier, isWinner), 50)
  }

  const multiplierColor = (
    () => {
      if (rocketState === 'crash') return '#ff0000'
      if (rocketState === 'win') return '#00ff00'
      if (rocketState === 'climbing') return '#ffaa00' // Orange while climbing
      return '#ffffff'
    }
  )()

  // Generate climbing crash multiplier based on random outcome
  // This creates a distribution where most crashes happen early, but rare high multipliers are possible
  const generateCrashMultiplier = (randomValue: number) => {
    // Use exponential distribution for crash points
    // Most games crash early (1.1x-2x), but some can reach much higher
    const base = 1.0
    const exponent = 3.5 // Higher = more early crashes
    const maxReasonable = 50.0 // Cap at 50x for practical purposes
    
    // Transform uniform random (0-1) to exponential distribution
    const result = base + Math.pow(1 - randomValue, exponent) * (maxReasonable - base)
    return Math.max(1.01, parseFloat(result.toFixed(2))) // Minimum 1.01x
  }


  const play = async () => {
    // CRITICAL SECURITY: Prevent zero wager gameplay
    if (wager <= 0) {
      console.error('❌ BLOCKED: Cannot play with zero wager');
      return;
    }
    
    setRocketState('climbing')
    setCurrentMultiplier(1.0)
    setFinalMultiplier(0)
    setActualWinMultiplier(0)
    
    // Use a simplified bet array for climbing crash - we'll determine the multiplier from the result
    const bet = Array(1000).fill(0).map((_, index) => {
      // Create a distribution where payouts decrease exponentially
      // This gives us the random crash points we need
      if (index < 50) return 20.0 * 0.96   // 5% chance of 20x+ (with house edge)
      if (index < 150) return 10.0 * 0.96  // 10% chance of 10x+
      if (index < 300) return 5.0 * 0.96   // 15% chance of 5x+
      if (index < 500) return 3.0 * 0.96   // 20% chance of 3x+
      if (index < 700) return 2.0 * 0.96   // 20% chance of 2x+
      if (index < 850) return 1.5 * 0.96   // 15% chance of 1.5x+
      return 0  // 15% chance of crash before 1.5x
    })
    
    await game.play({ wager, bet })

    const result = await game.result()
    const actualPayout = result.payout
    const actualMultiplier = actualPayout > 0 ? actualPayout / wager : 0
    const isWinner = actualPayout > 0

    // Determine where the rocket climbs to:
    const rng = makeDeterministicRng(`climb:${result.resultIndex}:${actualPayout}`)
    const finalMultiplier = isWinner ? 
      actualMultiplier :  // If win: climb to exactly the winning multiplier
      generateCrashMultiplier(rng())  // If loss: crash at some random point

    setActualWinMultiplier(actualMultiplier)

    console.log('Final multiplier:', finalMultiplier.toFixed(2) + 'x')
    console.log('Win multiplier:', actualMultiplier.toFixed(2) + 'x')
    console.log('Is winner:', isWinner)

    // Update game statistics
    gameStats.updateStats(result.payout)

    sound.play('music')
    climbSmooth(1.0, finalMultiplier, actualMultiplier, isWinner)
  }

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Crash"
          gameMode="Auto-Climb"
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
          <MultiplierText color={multiplierColor}>
            {currentMultiplier.toFixed(2)}x
          </MultiplierText>
          
          <Rocket style={getRocketStyle()} />
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
          onPlay={play}
          playDisabled={poolExceeded || rocketState === 'climbing'}
          playText={rocketState === 'climbing' ? 'Climbing...' : 'Launch Rocket'}
        />
        
        {/* Desktop controls: Custom layout for crash game */}
        <CrashDesktopControls>
          <EnhancedWagerInput value={wager} onChange={setWager} />
          <EnhancedPlayButton 
            onClick={play} 
            disabled={poolExceeded || rocketState === 'climbing'}
          >
            {rocketState === 'climbing' ? 'Climbing...' : 'Launch Rocket'}
          </EnhancedPlayButton>
        </CrashDesktopControls>
      </GambaUi.Portal>
    </>
  )
}
