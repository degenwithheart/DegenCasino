import { Canvas } from '@react-three/fiber'
import { FAKE_TOKEN_MINT, GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { useIsCompact } from '../../hooks/useIsCompact';
import { Coin, TEXTURE_HEADS, TEXTURE_TAILS } from './Coin'
import { Effect } from './Effect'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import FlipPaytable, { FlipPaytableRef } from './FlipPaytable'
import FlipOverlays from './FlipOverlays'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

import SOUND_COIN from './coin.mp3'
import SOUND_LOSE from './lose.mp3'
import SOUND_WIN from './win.mp3'
import { GameControls } from '../../components';

const SIDES = {
  heads: [2, 0],
  tails: [0, 2],
}

type Side = keyof typeof SIDES

export default function Flip() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [flipping, setFlipping] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [side, setSide] = React.useState<Side>('heads')
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken();
  const { balance } = useTokenBalance();
  const paytableRef = React.useRef<FlipPaytableRef>(null)
  
  // Game phase management for overlays
  const [gamePhase, setGamePhase] = React.useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')
  const [thinkingPhase, setThinkingPhase] = React.useState(false)
  const [dramaticPause, setDramaticPause] = React.useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(0)
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🤔')
  
  // Game outcome overlay state
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
    resetGameState,
  } = useGameOutcome()
  // Find token metadata for symbol display
  const tokenMeta = token ? TOKEN_METADATA.find(t => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
  const maxWager = baseWager * 1000000
  const tokenPrice = tokenMeta?.usdPrice ?? 0

  // Set default wager: 1 for free tokens, 0 for real tokens
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager) // 1 token for free token
    } else {
      setWager(0) // 0 for real tokens
    }
  }, [setWager, token, baseWager])

  const sounds = useSound({
    coin: SOUND_COIN,
    win: SOUND_WIN,
    lose: SOUND_LOSE,
  })

  const play = async () => {
    try {
      // Reset states and start overlay sequence
      setWin(false)
      setFlipping(true)
      setGamePhase('thinking')
      setThinkingPhase(true)
      setDramaticPause(false)
      setCelebrationIntensity(0)
      
      // Random thinking emoji
      const thinkingEmojis = ['🤔', '🪙', '🎯', '⚡', '💭', '🔮']
      setThinkingEmoji(thinkingEmojis[Math.floor(Math.random() * thinkingEmojis.length)])
      
      const selectedSide = side

      sounds.play('coin', { playbackRate: .5 })

      await game.play({
        bet: SIDES[side],
        wager,
        metadata: [side],
      })

      // Thinking phase
      await new Promise(resolve => setTimeout(resolve, 1500))
      setThinkingPhase(false)
      
      // Dramatic pause
      setGamePhase('dramatic')
      setDramaticPause(true)
      await new Promise(resolve => setTimeout(resolve, 1200))
      setDramaticPause(false)

      sounds.play('coin')

      const result = await game.result()

      const win = result.payout > 0
      const resultSide = result.resultIndex === 0 ? 'heads' : 'tails'

      setResultIndex(result.resultIndex)
      setWin(win)

      // Track game result in paytable
      paytableRef.current?.trackGame({
        guess: selectedSide,
        result: resultSide,
        wasWin: win,
        amount: win ? result.payout - wager : 0,
        multiplier: win ? result.payout / wager : 0,
      })

      // Handle celebration or mourning overlays
      if (win) {
        const multiplier = result.payout / wager
        let intensity = 1
        if (multiplier >= 5) intensity = 3
        else if (multiplier >= 2.5) intensity = 2
        
        setCelebrationIntensity(intensity)
        setGamePhase('celebrating')
        sounds.play('win')
        
        // Auto-reset after celebration
        setTimeout(() => {
          setGamePhase('idle')
          setCelebrationIntensity(0)
        }, 4000)
      } else {
        setGamePhase('mourning')
        sounds.play('lose')
        
        // Auto-reset after mourning
        setTimeout(() => {
          setGamePhase('idle')
        }, 2500)
      }
      
      // Show outcome overlay
      handleGameComplete({ payout: result.payout, wager })
    } finally {
      setFlipping(false)
    }
  }

  const test = async () => {
    if (flipping) return
    await play()
  }

  const simulate = async () => {
    if (flipping) return
    for (let i = 0; i < 10; i++) {
      await play()
    }
  }

  // Responsive scaling logic using useIsCompact
  const isCompact = useIsCompact();
  const [scale, setScale] = React.useState(isCompact ? 1 : 1.2);

  React.useEffect(() => {
    setScale(isCompact ? 1 : 1.2);
  }, [isCompact]);

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main Game Area */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.5) 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(252, 211, 77, 0.1) 0%, transparent 50%)',
              opacity: flipping ? 1 : 0.5,
              transition: 'opacity 0.5s ease'
            }} />

            {/* Side Selection UI */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              zIndex: 10
            }}>
              <button
                onClick={() => setSide('heads')}
                disabled={flipping}
                style={{
                  background: side === 'heads' 
                    ? 'linear-gradient(135deg, rgba(252, 211, 77, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%)'
                    : 'rgba(0, 0, 0, 0.5)',
                  border: side === 'heads' 
                    ? '2px solid rgba(252, 211, 77, 0.5)' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: flipping ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: flipping ? 0.6 : 1
                }}
              >
                👑 HEADS
              </button>
              <button
                onClick={() => setSide('tails')}
                disabled={flipping}
                style={{
                  background: side === 'tails' 
                    ? 'linear-gradient(135deg, rgba(148, 163, 184, 0.3) 0%, rgba(100, 116, 139, 0.3) 100%)'
                    : 'rgba(0, 0, 0, 0.5)',
                  border: side === 'tails' 
                    ? '2px solid rgba(148, 163, 184, 0.5)' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: flipping ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: flipping ? 0.6 : 1
                }}
              >
                ⚡ TAILS
              </button>
            </div>

            {/* 3D Coin Canvas */}
            <Canvas
              linear
              flat
              orthographic
              camera={{
                zoom: isCompact ? 160 : 180,
                position: [0, 0, 100],
              }}
              style={{ width: '100%', height: '100%' }}
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

            {/* Game Status */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '12px',
              padding: '12px 20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                {flipping ? 'FLIPPING...' : `SELECTED: ${side.toUpperCase()}`}
              </div>
              <div style={{ color: '#FCD34D', fontSize: '14px', fontWeight: 700 }}>
                2.00x PAYOUT
              </div>
            </div>
            
            {/* Add the overlay component - conditionally rendered based on ENABLE_THINKING_OVERLAY */}
            {renderThinkingOverlay(
              <FlipOverlays
                gamePhase={getGamePhaseState(gamePhase)}
                thinkingPhase={getThinkingPhaseState(thinkingPhase)}
                dramaticPause={dramaticPause}
                celebrationIntensity={celebrationIntensity}
                currentWin={win && profitAmount ? { multiplier: (profitAmount + wager) / wager, amount: profitAmount } : undefined}
                thinkingEmoji={thinkingEmoji}
              />
            )}
          </div>

          {/* Live Paytable */}
          <FlipPaytable
            ref={paytableRef}
            wager={wager}
            selectedSide={side}
          />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={flipping}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'Play Again' : 'Play'}
        onPlayAgain={handlePlayAgain}
      >
        {/* Side Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Side:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <GambaUi.Button
              onClick={() => setSide('heads')}
              disabled={flipping || showOutcome}
            >
              {side === 'heads' ? '✓ 👑 Heads' : '👑 Heads'}
            </GambaUi.Button>
            <GambaUi.Button
              onClick={() => setSide('tails')}
              disabled={flipping || showOutcome}
            >
              {side === 'tails' ? '✓ ⚡ Tails' : '⚡ Tails'}
            </GambaUi.Button>
          </div>
        </div>
      </GameControls>
    </>
  )
}
