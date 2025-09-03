import { Canvas } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { SmartImage } from '../../components/UI/SmartImage'
import { EnhancedWagerInput, EnhancedButton, EnhancedPlayButton, MobileControls, OptionSelector, DesktopControls } from '../../components'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { Coin, TEXTURE_HEADS, TEXTURE_TAILS } from './Coin'
import { FLIP_CONFIG, probAtLeast, computeMultiplier } from '../rtpConfig'
import { Effect } from './Effect'
import { StyledFlipBackground } from './FlipBackground.enhanced.styles'

import SOUND_COIN from './coin.mp3'
import SOUND_LOSE from './lose.mp3'
import SOUND_WIN from './win.mp3'

// Use centralized bet arrays from rtpConfig
type Side = 'heads' | 'tails'

function Flip() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [flipping, setFlipping] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  
  // Get graphics settings to check if motion is enabled
  const { settings } = useGraphics()
  const [side, setSide] = React.useState<'heads' | 'tails'>('heads')
  const [wager, setWager] = useWagerInput()
  const [n, setN] = React.useState(1) // number of coins
  const [k, setK] = React.useState(1) // target at least k
  const [hasPlayed, setHasPlayed] = React.useState(false)
  const coinContainerRef = React.useRef<HTMLDivElement | null>(null)
  const [containerSize, setContainerSize] = React.useState({ width: 800, height: 360 })

  // Observe container size for responsive coin scaling (store width and height)
  React.useEffect(() => {
    const el = coinContainerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const r = entry.contentRect
        setContainerSize({ width: r.width, height: r.height })
      }
    })
    ro.observe(el)
    // initial
    setContainerSize({ width: el.clientWidth, height: el.clientHeight })
    return () => ro.disconnect()
  }, [])
  
  // Compute probability and multiplier
  const prob = React.useMemo(() => {
    return probAtLeast(n, k);
  }, [n, k, side]);
  
  const multiplier = React.useMemo(() => computeMultiplier(prob, 0.04), [prob]);
  
  const bet = React.useMemo(() => FLIP_CONFIG.calculateBetArray(n, k, side), [n, k, side]);
  
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
        bet,
        wager,
        metadata: [side, n, k],
      })

      sounds.play('coin')

      const result = await game.result()

      const win = side === 'heads' ? result.resultIndex >= k : result.resultIndex <= n - k;

      setResultIndex(result.resultIndex)

      setWin(win)

      setHasPlayed(true)

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
                  <div className={`side-option ${!flipping && win && side === 'heads' ? 'active winner' : side === 'heads' ? 'selected' : ''}`}>
                    <SmartImage src={TEXTURE_HEADS} alt="Heads" style={{width:64,height:64}} />
                    <span>HEADS: {flipping || hasPlayed ? resultIndex : 'Ready'}</span>
                    {!flipping && win && side === 'heads' && <div className="result-badge">WINNER!</div>}
                  </div>
                  <div className="vs-divider">VS</div>
                  <div className={`side-option ${!flipping && win && side === 'tails' ? 'active winner' : side === 'tails' ? 'selected' : ''}`}>
                    <SmartImage src={TEXTURE_TAILS} alt="Tails" style={{width:64,height:64}} />
                    <span>TAILS: {flipping || hasPlayed ? n - resultIndex : 'Ready'}</span>
                    {!flipping && win && side === 'tails' && <div className="result-badge">WINNER!</div>}
                  </div>
                </div>
                <div className="win-multiplier">{multiplier.toFixed(2)}x</div>
                <div className="coins-count">Coins: {n}</div>
              </div>

              {/* Main Coin Area */}
              <div className="coin-arena">
                <div className="coin-container" ref={coinContainerRef}>
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
                    // Camera zoom derived from container height so coins scale vertically across devices
                    camera={{
                      // camera zoom tied to container height but clamped for stability
                      zoom: Math.max(110, Math.min(420, Math.round((containerSize.height || 300) * 0.7) - (n - 1) * 30)),
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
                      {n === 1 ? (
                        <Coin
                          result={resultIndex}
                          n={n}
                          showResult={flipping || hasPlayed}
                          flipping={flipping}
                          enableMotion={settings.enableMotion}
                          // single coin scales with container height (more prominent)
                          sizeScale={Math.max(0.75, Math.min(1.6, (containerSize.height || 300) / 320))}
                        />
                      ) : (
                        <>
                          {Array.from({ length: n }, (_, i) => {
                            // multi-coin sizing: scale by available width per coin, fallback to height
                            const perCoinW = (containerSize.width || 600) / Math.max(1, n)
                            const perCoinH = (containerSize.height || 300)
                            // keep coins visible on small screens by preferring height and raising min scale
                            const rawScale = Math.min(perCoinW / 340, perCoinH / 260)
                            const coinScale = Math.max(0.6, Math.min(1.2, rawScale))
                            const spacing = 2.2 / coinScale
                            return (
                              <group key={i} position={[(i - (n - 1) / 2) * spacing, 0, 0]}>
                                <Coin
                                  result={i < resultIndex ? 0 : 1}
                                  n={1}
                                  showResult={false}
                                  flipping={flipping}
                                  enableMotion={settings.enableMotion}
                                  sizeScale={coinScale}
                                />
                              </group>
                            )
                          })}
                          <Text
                            position={[0, 0, 0.02]}
                            fontSize={0.5}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                          >
                            {flipping || hasPlayed ? `${resultIndex}/${n}` : ''}
                          </Text>
                        </>
                      )}
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
          <div style={{ margin: '10px 0' }}>
            <label>Coins: {n}</label>
            <input
              type="range"
              min="1"
              max="2"
              value={n}
              onChange={(e) => {
                const newN = parseInt(e.target.value);
                setN(newN);
                if (k > newN) setK(newN);
              }}
              disabled={gamba.isPlaying}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ margin: '10px 0' }}>
            <label>At least {k} {side}</label>
            <input
              type="range"
              min="0"
              max={n}
              value={k}
              onChange={(e) => setK(parseInt(e.target.value))}
              disabled={gamba.isPlaying}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ margin: '10px 0' }}>
            Probability: {(prob * 100).toFixed(2)}%<br/>
            Multiplier: {multiplier.toFixed(2)}x
          </div>
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
          <div style={{ margin: '10px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label>Coins: {n}</label>
              <input
                type="range"
                min="1"
                max="2"
                value={n}
                onChange={(e) => {
                  const newN = parseInt(e.target.value);
                  setN(newN);
                  if (k > newN) setK(newN);
                }}
                disabled={gamba.isPlaying}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label>At least {k} {side}</label>
              <input
                type="range"
                min="0"
                max={n}
                value={k}
                onChange={(e) => setK(parseInt(e.target.value))}
                disabled={gamba.isPlaying}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              Probability: {(prob * 100).toFixed(2)}%<br/>
              Multiplier: {multiplier.toFixed(2)}x
            </div>
          </div>
          <EnhancedPlayButton onClick={play}>
            Flip
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}

export default Flip
