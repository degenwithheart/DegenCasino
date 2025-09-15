import { GambaUi, useSound, useWagerInput, useCurrentPool } from 'gamba-react-ui-v2'
import React from 'react'
import styled from 'styled-components'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, SliderControl } from '../../components'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import CustomSlider from './Slider'
import CRASH_SOUND from './crash.mp3'
import SOUND from './music.mp3'
import { LineLayer1, LineLayer2, LineLayer3, MultiplierText, Rocket, ScreenWrapper, StarsLayer1, StarsLayer2, StarsLayer3 } from './styles'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { CRASH_CONFIG } from '../rtpConfig'
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
  const [multiplierTarget, setMultiplierTarget] = React.useState(1.5)
  const [currentMultiplier, setCurrentMultiplier] = React.useState(0)
  const [rocketState, setRocketState] = React.useState<'idle' | 'win' | 'crash'>('idle')
  const game = GambaUi.useGame()
  const pool = useCurrentPool()
  const sound = useSound({ music: SOUND, crash: CRASH_SOUND, win: WIN_SOUND })

  // Pool restrictions
  const maxMultiplier = React.useMemo(() => {
    return 1000 // Default high max for crash games
  }, [])

  const maxWagerForPool = React.useMemo(() => {
    return pool.maxPayout / maxMultiplier
  }, [pool.maxPayout, maxMultiplier])

  const maxPayout = wager * multiplierTarget
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

  // Game statistics tracking
  const [gameStats, setGameStats] = React.useState({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    sessionProfit: 0,
    bestWin: 0
  })

  const handleResetStats = () => {
    setGameStats({
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      sessionProfit: 0,
      bestWin: 0
    })
  }
  
  // Effects system for enhanced visual feedback
  const effectsRef = React.useRef<GameplayEffectsRef>(null)

  const getRocketStyle = () => {
    const maxMultiplier = 1
    const progress = Math.min(currentMultiplier / maxMultiplier, 1)

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

  const doTheIntervalThing = (
    currentMultiplier: number,
    targetMultiplier: number,
    win: boolean,
  ) => {
    const nextIncrement = 0.01 * (Math.floor(currentMultiplier) + 1)
    const nextValue = currentMultiplier + nextIncrement

    setCurrentMultiplier(nextValue)

    if (nextValue >= targetMultiplier) {
      sound.sounds.music.player.stop()
      sound.play(win ? 'win' : 'crash')
      setRocketState(win ? 'win' : 'crash')
      setCurrentMultiplier(targetMultiplier)
      
      // ✨ TRIGGER CRASH GAME EFFECTS
      if (win) {
        console.log('🚀 CRASH WIN! Rocket reached target')
        effectsRef.current?.winFlash() // Use theme's winGlow color
        effectsRef.current?.particleBurst(70, 30, undefined, 12) // Rocket trail particles
        effectsRef.current?.screenShake(1, 600) // Medium shake for win
      } else {
        console.log('💥 CRASH! Rocket exploded')
        effectsRef.current?.loseFlash() // Use theme's loseGlow color
        effectsRef.current?.particleBurst(70, 30, undefined, 20) // Explosion particles
        effectsRef.current?.screenShake(2, 800) // Strong shake for crash
      }
      return
    }

    setTimeout(() => doTheIntervalThing(nextValue, targetMultiplier, win), 50)
  }

  const multiplierColor = (
    () => {
      if (rocketState === 'crash') return '#ff0000'
      if (rocketState === 'win') return '#00ff00'
      return '#ffffff'
    }
  )()

  // Deterministic losing multiplier mapping (visual only) derived from on-chain result index & target
  const deriveLosingMultiplier = (targetMultiplier: number, seed: string) => {
    const rng = makeDeterministicRng(`crash:${seed}:${targetMultiplier}`)
    const base = rng()
    const maxPossible = Math.min(targetMultiplier, 12)
    const exponent = base > 0.95 ? 2.8 : (targetMultiplier > 10 ? 5 : 6)
    const result = 1 + Math.pow(base, exponent) * (maxPossible - 1)
    return parseFloat(result.toFixed(2))
  }


  const play = async () => {
    // CRITICAL SECURITY: Prevent zero wager gameplay
    if (wager <= 0) {
      console.error('❌ BLOCKED: Cannot play with zero wager');
      return;
    }
    
    setRocketState('idle')
    const bet = CRASH_CONFIG.calculateBetArray(multiplierTarget)
    await game.play({ wager, bet })

    const result = await game.result()
    const win = result.payout > 0
    const multiplierResult = win
      ? parseFloat(multiplierTarget.toFixed(2))
      : deriveLosingMultiplier(multiplierTarget, `${result.resultIndex}:${result.payout}`)

    console.log('multiplierResult', multiplierResult)
    console.log('win', win)

    // Update game statistics
    const profit = result.payout - wager
    const isWin = result.payout > 0
    
    setGameStats(prev => ({
      gamesPlayed: prev.gamesPlayed + 1,
      wins: isWin ? prev.wins + 1 : prev.wins,
      losses: isWin ? prev.losses : prev.losses + 1,
      sessionProfit: prev.sessionProfit + profit,
      bestWin: profit > prev.bestWin ? profit : prev.bestWin
    }))

    sound.play('music')
    doTheIntervalThing(0, multiplierResult, win)
  }

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Crash"
          gameMode="Rocket"
          rtp="95"
          stats={gameStats}
          onReset={handleResetStats}
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
          playDisabled={poolExceeded}
          playText="Play"
        >
          <SliderControl
            label="Multiplier"
            value={multiplierTarget}
          >
            <CustomSlider
              value={multiplierTarget}
              onChange={setMultiplierTarget}
            />
          </SliderControl>
        </MobileControls>
        
        {/* Desktop controls: Custom layout for crash game */}
        <CrashDesktopControls>
          <EnhancedWagerInput value={wager} onChange={setWager} multiplier={multiplierTarget} />
          <div style={{ flex: 1, maxWidth: '200px' }}>
            <CustomSlider
              value={multiplierTarget}
              onChange={setMultiplierTarget}
            />
          </div>
          <EnhancedPlayButton onClick={play} disabled={poolExceeded}>
            Play
          </EnhancedPlayButton>
        </CrashDesktopControls>
      </GambaUi.Portal>
    </>
  )
}
