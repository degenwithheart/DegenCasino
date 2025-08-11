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

import SOUND_COIN from './coin.mp3'
import SOUND_LOSE from './lose.mp3'
import SOUND_WIN from './win.mp3'
import { GameControls, GameScreenLayout } from '../../components';

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
      setWin(false)
      setFlipping(true)

      sounds.play('coin', { playbackRate: .5 })

      await game.play({
        bet: SIDES[side],
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
        <GameScreenLayout display="ruby"
          left={
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease-out',
              }}
              className="flip-game-scaler"
            >
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
          }
          right={null}
        />
      </GambaUi.Portal>
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={flipping}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'Play Again' : 'Play'}
      >
        {/* Side Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Side:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <GambaUi.Button
              onClick={() => setSide('heads')}
              disabled={flipping || showOutcome}
            >
              {side === 'heads' ? '✓ Heads' : 'Heads'}
            </GambaUi.Button>
            <GambaUi.Button
              onClick={() => setSide('tails')}
              disabled={flipping || showOutcome}
            >
              {side === 'tails' ? '✓ Tails' : 'Tails'}
            </GambaUi.Button>
          </div>
        </div>
      </GameControls>
    </>
  )
}
