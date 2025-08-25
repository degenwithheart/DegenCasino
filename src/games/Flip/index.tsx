import { Canvas } from '@react-three/fiber'
import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { EnhancedWagerInput, EnhancedButton, EnhancedPlayButton, MobileControls, OptionSelector, DesktopControls } from '../../components'
import GameplayFrame, { GameplayEffectsRef } from '../../components/GameplayFrame'
import { useGraphics } from '../../components/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { Coin, TEXTURE_HEADS, TEXTURE_TAILS } from './Coin'
import { FLIP_CONFIG } from '../rtpConfig'
import { Effect } from './Effect'
import { StyledFlipBackground } from './FlipBackground.enhanced.styles'

import SOUND_COIN from './coin.mp3'
import SOUND_LOSE from './lose.mp3'
import SOUND_WIN from './win.mp3'

// Use centralized bet arrays from rtpConfig
const SIDES = {
  heads: FLIP_CONFIG.heads,
  tails: FLIP_CONFIG.tails,
}

type Side = keyof typeof SIDES

function Flip() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [flipping, setFlipping] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  
  // Get graphics settings to check if motion is enabled
  const { settings } = useGraphics()
  const [side, setSide] = React.useState<Side>('heads')
  const [wager, setWager] = useWagerInput()
  
  console.log('🎯 FLIP MAIN DEBUG:', {
    flipping,
    win,
    resultIndex,
    enableMotion: settings.enableMotion,
    side,
    wager
  })
  
  // Add effects ref for visual effects
  const effectsRef = React.useRef<GameplayEffectsRef>(null)

  const sounds = useSound({
    coin: SOUND_COIN,
    win: SOUND_WIN,
    lose: SOUND_LOSE,
  })

  const play = async () => {
    // CRITICAL SECURITY: Prevent zero wager gameplay
    if (wager <= 0) {
      console.error('❌ BLOCKED: Cannot play with zero wager');
      return;
    }
    
    try {
      setWin(false)
      setFlipping(true)

      sounds.play('coin', { playbackRate: .5 })

      await game.play({
        bet: [...SIDES[side]],
        wager,
        metadata: [side],
      })

      sounds.play('coin')

      const result = await game.result()

      const win = result.payout > 0

      setResultIndex(result.resultIndex)

      setWin(win)

      if (win) {
        sounds.play('win')
        // 🎉 TRIGGER WIN EFFECTS
        console.log('🎉 FLIP WIN! Triggering visual effects')
        effectsRef.current?.winFlash('#ffd700', 1.2) // Gold win flash
        effectsRef.current?.particleBurst(50, 50, '#ffd700', 12) // Gold particles from center
        effectsRef.current?.screenShake(1, 500) // Medium shake for win
      } else {
        sounds.play('lose')
        // 💥 TRIGGER LOSE EFFECTS
        console.log('💥 FLIP LOSE! Triggering lose effects')
        effectsRef.current?.flash('#ff6b6b', 300) // Red lose flash
        effectsRef.current?.screenShake(0.5, 250) // Light shake for loss
      }
    } finally {
      setFlipping(false)
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <StyledFlipBackground>
          {/* Silver poetry background elements */}
          <div className="silver-bg-elements" />
          <div className="crystal-overlay" />
          <div className="destiny-indicator" />
          
          <GameplayFrame 
            ref={effectsRef}
            disableContainerTransforms={true}
            {...(useGameMeta('flip') && { 
              title: useGameMeta('flip')!.name, 
              description: useGameMeta('flip')!.description 
            })}
          >
            <div className="flip-redesign">
              {/* Header Section */}
              <div className="flip-header">
                <div className="side-indicator">
                  <div className={`side-option ${resultIndex === 0 && !flipping ? 'active winner' : side === 'heads' ? 'selected' : ''}`}>
                    <img src={TEXTURE_HEADS} alt="Heads" />
                    <span>HEADS</span>
                    {resultIndex === 0 && !flipping && <div className="result-badge">WINNER!</div>}
                  </div>
                  <div className="vs-divider">VS</div>
                  <div className={`side-option ${resultIndex === 1 && !flipping ? 'active winner' : side === 'tails' ? 'selected' : ''}`}>
                    <img src={TEXTURE_TAILS} alt="Tails" />
                    <span>TAILS</span>
                    {resultIndex === 1 && !flipping && <div className="result-badge">WINNER!</div>}
                  </div>
                </div>
                <div className="win-multiplier">{FLIP_CONFIG.heads[0]}x</div>
              </div>

              {/* Main Coin Area */}
              <div className="coin-arena">
                <div className="coin-container">
                  <Canvas
                    linear
                    flat
                    orthographic
                    gl={{ 
                      alpha: true, 
                      antialias: true, 
                      premultipliedAlpha: false,
                      preserveDrawingBuffer: false
                    }}
                    onCreated={({ gl, size }) => {
                      gl.setClearColor(0x000000, 0)
                      console.log('🪙 Flip Canvas created', { size })
                    }}
                    camera={{
                      zoom: 250,
                      position: [0, 0, 100],
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'transparent',
                      backgroundColor: 'transparent',
                      pointerEvents: 'none',
                      zIndex: 2,
                      display: 'block'
                    }}
                  >
                    <React.Suspense fallback={null}>
                      <Coin result={resultIndex} flipping={flipping} enableMotion={settings.enableMotion} />
                    </React.Suspense>
                    <Effect color="white" />
                    {flipping && <Effect color="white" />}
                    {win && <Effect color="#10B981" />}
                    <ambientLight intensity={3} />
                    <directionalLight
                      position-z={1}
                      position-y={1}
                      castShadow
                      color="#CCCCCC"
                    />
                    <hemisphereLight
                      intensity={.5}
                      position={[0, 1, 0]}
                      scale={[1, 1, 1]}
                      color="#ffadad"
                      groundColor="#6666fe"
                    />
                  </Canvas>
                </div>
                
                {/* Coin Shadow/Base */}
                <div className="coin-shadow"></div>
              </div>

              {/* Status Display */}
              <div className="status-display">
                <div className="status-card">
                  {flipping ? (
                    <>
                      <div className="status-icon spinning">⚡</div>
                      <div className="status-text">Flipping...</div>
                    </>
                  ) : win ? (
                    <>
                      <div className="status-icon win">🎉</div>
                      <div className="status-text win">You Won!</div>
                    </>
                  ) : resultIndex !== null ? (
                    <>
                      <div className="status-icon lose">💸</div>
                      <div className="status-text lose">Better Luck Next Time</div>
                    </>
                  ) : (
                    <>
                      <div className="status-icon">🪙</div>
                      <div className="status-text">Choose Your Side</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </GameplayFrame>
        </StyledFlipBackground>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          playDisabled={gamba.isPlaying}
          playText="Flip"
        >
          <OptionSelector
            label="Side"
            options={[
              { value: 'heads', label: 'Heads' },
              { value: 'tails', label: 'Tails' }
            ]}
            selected={side}
            onSelect={setSide}
            disabled={gamba.isPlaying}
          />
        </MobileControls>
        
        {/* Desktop Layout */}
        <DesktopControls>
          <EnhancedWagerInput
            value={wager}
            onChange={setWager}
          />
          <EnhancedButton disabled={gamba.isPlaying} onClick={() => setSide(side === 'heads' ? 'tails' : 'heads')}>
            <div style={{ display: 'flex' }}>
              <img height="20px" src={side === 'heads' ? TEXTURE_HEADS : TEXTURE_TAILS} />
              {side === 'heads' ? 'Heads' : 'Tails' }
            </div>
          </EnhancedButton>
          <EnhancedPlayButton onClick={play}>
            Flip
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}

export default Flip
