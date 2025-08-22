import { Canvas } from '@react-three/fiber'
import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { EnhancedWagerInput, EnhancedButton, EnhancedPlayButton, MobileControls, OptionSelector, DesktopControls } from '../../components'
import GameScreenFrame from '../../components/GameScreenFrame'
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
  const [side, setSide] = React.useState<Side>('heads')
  const [wager, setWager] = useWagerInput()

  const sounds = useSound({
    coin: SOUND_COIN,
    win: SOUND_WIN,
    lose: SOUND_LOSE,
  })

  const play = async () => {
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
      } else {
        sounds.play('lose')
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
          
          <GameScreenFrame {...(useGameMeta('flip') && { title: useGameMeta('flip')!.name, description: useGameMeta('flip')!.description })}>
            <div className="flip-redesign">
              {/* Header Section */}
              <div className="flip-header">
                <div className="side-indicator">
                  <div className={`side-option ${side === 'heads' ? 'active' : ''}`}>
                    <img src={TEXTURE_HEADS} alt="Heads" />
                    <span>HEADS</span>
                  </div>
                  <div className="vs-divider">VS</div>
                  <div className={`side-option ${side === 'tails' ? 'active' : ''}`}>
                    <img src={TEXTURE_TAILS} alt="Tails" />
                    <span>TAILS</span>
                  </div>
                </div>
                <div className="win-multiplier">{FLIP_CONFIG.heads[0]}x</div>
              </div>

              {/* Main Coin Area */}
              <div className="coin-arena">
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
                  onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0); // Set clear color to transparent
                  }}
                  camera={{
                    zoom: 250,
                    position: [0, 0, 100],
                  }}
                  style={{
                    width: '2000px',
                    height: '2000px',
                    position: 'absolute',
                    top: '41%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'transparent',
                    backgroundColor: 'transparent',
                    pointerEvents: 'none',
                    zIndex: 10
                  }}
                >
                  <React.Suspense fallback={null}>
                    <Coin result={resultIndex} flipping={flipping} />
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
                
                <div className="coin-container">
                  {/* Visual container for styling only */}
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
          </GameScreenFrame>
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
