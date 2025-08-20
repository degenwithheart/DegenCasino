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
            <div className="flip-content">
              <div className="silver-truth-area">
                <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
                  🪙 Silver Caught Between Truths
                </h2>
              </div>
              
              <div className="instinct-canvas-container">
                <Canvas
                  linear
                  flat
                  orthographic
                  camera={{
                    zoom: 80,
                    position: [0, 0, 100],
                  }}
                >
                  <React.Suspense fallback={null}>
                    <Coin result={resultIndex} flipping={flipping} />
                  </React.Suspense>
                  <Effect color="white" />

                  {flipping && <Effect color="white" />}
                  {win && <Effect color="#42ff78" />}
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
              
              <div className="fate-result-area">
                {flipping ? (
                  <div style={{ fontSize: '18px', opacity: 0.9 }}>
                    ✨ The world falls silent, breath held...
                  </div>
                ) : win ? (
                  <div style={{ fontSize: '18px', color: '#42ff78' }}>
                    💫 Destiny favors your raw instinct!
                  </div>
                ) : resultIndex !== null ? (
                  <div style={{ fontSize: '18px', color: '#fca5a5' }}>
                    🌙 The silver speaks its truth
                  </div>
                ) : (
                  <div style={{ fontSize: '18px', opacity: 0.6 }}>
                    🎭 The simplest duel with destiny awaits...
                  </div>
                )}
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
