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
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import WIN_SOUND from './win.mp3'

// Custom desktop controls for crash game
const CrashDesktopControls = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  
  @media (max-width: 800px) {
    display: none;
  }
`

export default function Crash3D() {
  const [wager, setWager] = useWagerInput()
  const [multiplierTarget, setMultiplierTarget] = React.useState(1.5)
  const [currentMultiplier, setCurrentMultiplier] = React.useState(0)
  const [rocketState, setRocketState] = React.useState<'idle' | 'win' | 'crash'>('idle')
  const game = GambaUi.useGame()
  const pool = useCurrentPool()
  const sound = useSound({ music: SOUND, crash: CRASH_SOUND, win: WIN_SOUND })
  const { mobile: isMobile } = useIsCompact()
  const effectsRef = React.useRef<GameplayEffectsRef>(null)

  // Pool restrictions - SAME AS 2D
  const maxMultiplier = React.useMemo(() => {
    return 1000 // Default high max for crash games
  }, [])

  const maxWagerForPool = React.useMemo(() => {
    return pool.maxPayout / maxMultiplier
  }, [pool.maxPayout, maxMultiplier])

  const maxPayout = wager * multiplierTarget
  const poolExceeded = maxPayout > pool.maxPayout

  // Game statistics tracking - using centralized hook
  const gameStats = useGameStats('crash')

  // DISABLED play function for 3D mode
  const play = () => {
    console.log('🚀 3D Crash - Coming Soon! This mode is not yet available.')
  }

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Crash"
          gameMode="3D Mode (Coming Soon)"
          rtp="99"
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0f0820, #1a0f2e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 3D Mode Coming Soon Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            backdropFilter: 'blur(5px)',
          }}>
            <div style={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}>
              🚀 3D Mode<br />
              <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>Coming Soon!</span>
            </div>
          </div>

          {/* Game content placeholder */}
          <div style={{
            textAlign: 'center',
            color: 'white',
            opacity: 0.3,
            zIndex: 5
          }}>
            <h2 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>🚀</h2>
            <h3>Rocket to the Moon</h3>
            <p style={{ fontSize: '2rem', margin: '2rem 0' }}>{multiplierTarget.toFixed(2)}x</p>
            <p>Set your multiplier target and watch the rocket fly!</p>
          </div>

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
            {...(useGameMeta('crash') && { 
              title: useGameMeta('crash')!.name, 
              description: useGameMeta('crash')!.description 
            })}
          />
        </div>
      </GambaUi.Portal>
      
      <GambaUi.Portal target="controls">
        {/* EXACT SAME CONTROLS AS 2D BUT DISABLED */}
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          playDisabled={true}
          playText="Coming Soon"
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
          <EnhancedPlayButton disabled>Coming Soon</EnhancedPlayButton>
        </CrashDesktopControls>
      </GambaUi.Portal>
    </>
  )
}