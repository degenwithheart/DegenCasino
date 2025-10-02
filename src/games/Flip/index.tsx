import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React, { useRef, useCallback, useEffect } from 'react'
import { EnhancedWagerInput, EnhancedButton, MobileControls, DesktopControls, GameControlsSection } from '../../components'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameStats } from '../../hooks/game/useGameStats'
import { GameRecentPlaysHorizontal } from '../../components/Game/GameRecentPlaysHorizontal'

import { ROMANTIC_COLORS, CANVAS_WIDTH, CANVAS_HEIGHT, FLIP_SETTINGS, SIDES, Side } from './constants'
import { createParticleBurst, updateParticles, drawParticles, drawCoin, updateCoinAnimations, drawBackground } from './canvas-utils'
import { GameState } from './types'

import SOUND_COIN from './coin.mp3'
import SOUND_LOSE from './lose.mp3'
import SOUND_WIN from './win.mp3'
import HEADS_IMAGE from './heads.png'
import TAILS_IMAGE from './tails.png'

const TEXTURE_HEADS = HEADS_IMAGE
const TEXTURE_TAILS = TAILS_IMAGE

const GAME_META = {
  name: 'Flip',
  description: 'Classic coin flip game',
}

const COIN_POSITIONS = [
  [CANVAS_WIDTH/4, CANVAS_HEIGHT/3], [CANVAS_WIDTH/2, CANVAS_HEIGHT/3], [CANVAS_WIDTH*3/4, CANVAS_HEIGHT/3],
  [CANVAS_WIDTH/4, CANVAS_HEIGHT/2], [CANVAS_WIDTH/2, CANVAS_HEIGHT/2], [CANVAS_WIDTH*3/4, CANVAS_HEIGHT/2],
  [CANVAS_WIDTH/4, CANVAS_HEIGHT*2/3], [CANVAS_WIDTH/2, CANVAS_HEIGHT*2/3], [CANVAS_WIDTH*3/4, CANVAS_HEIGHT*2/3]
]

export default function Flip() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [wager, setWager] = useWagerInput()
  const { mobile: isMobile } = useIsCompact()
  const { settings } = useGraphics()
  const effectsRef = useRef<GameplayEffectsRef>(null)
  const gameStats = useGameStats('flip')

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  // Game state
  const [activeCoins, setActiveCoins] = React.useState(1)
  const [results, setResults] = React.useState<Side[]>([])
  const [flipping, setFlipping] = React.useState(false)
  const [win, setWin] = React.useState<boolean | null>(null)

  const [gameState, setGameState] = React.useState<GameState>({ 
    particles: [],
    coinAnimations: Array(FLIP_SETTINGS.MAX_COINS).fill(null).map(() => ({
      rotation: 0,
      targetRotation: 0,
      scale: 1,
      targetScale: 1,
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      startTime: 0,
      duration: 0,
      complete: false
      ,
      // default visual face so coins render immediately
      showing: 'heads'
    })),
    flipping: false,
    win: null,
    hasPlayed: false
  } as GameState)
  const [side, setSide] = React.useState<Side>('heads')
  // removed deprecated numCoins state - layout computed from activeCoins

  // Image state
  const [headsImg, setHeadsImg] = React.useState<HTMLImageElement | null>(null)
  const [tailsImg, setTailsImg] = React.useState<HTMLImageElement | null>(null)

  // Load images
  useEffect(() => {
    const heads = new Image()
    const tails = new Image()
    heads.src = HEADS_IMAGE
    tails.src = TAILS_IMAGE
    let loaded = 0
    heads.onload = () => {
      setHeadsImg(heads)
      loaded++
      if (loaded === 2) requestAnimationFrame((t) => render(t))
    }
    tails.onload = () => {
      setTailsImg(tails)
      loaded++
      if (loaded === 2) requestAnimationFrame((t) => render(t))
    }
  }, [])

  // Ensure first N animation slots have a visible face so coins draw before user interaction
  useEffect(() => {
    setGameState(prev => {
      const animations = prev.coinAnimations.slice()
      for (let i = 0; i < activeCoins; i++) {
        animations[i] = { ...(animations[i] || {}), showing: (animations[i] as any)?.showing || side }
      }
      return { ...prev, coinAnimations: animations }
    })
  }, [activeCoins, side])

  // Keep a ref of the latest gameState so the RAF render loop can read it
  // without forcing the render callback to change identity on every state update.
  const gameStateRef = useRef<GameState>(gameState)
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  const sounds = useSound({
    coin: SOUND_COIN,
    win: SOUND_WIN,
    lose: SOUND_LOSE,
  })

  // Render loop
  const render = useCallback((timestamp: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Update particles and animations (state writer)
    setGameState(prev => ({
      ...prev,
      particles: updateParticles(prev.particles),
      coinAnimations: updateCoinAnimations(prev.coinAnimations, 1 / 60)
    }))

    // draw
    drawBackground(ctx, timestamp)

    // draw coins: compute layout dynamically (supports multiple coins like Flip-v2)
    const currentState = gameStateRef.current
    const animations = currentState.coinAnimations
    const count = activeCoins

    // simple layout: if few coins, single row; otherwise grid 4 cols
    const cols = count <= 4 ? count : 4
    const rows = Math.ceil(count / cols)
    // determine coin size based on available area
    const paddingX = 80
    const paddingY = 120
    const availableWidth = CANVAS_WIDTH - paddingX * 2
    const availableHeight = CANVAS_HEIGHT - paddingY * 2
    const coinSize = Math.min(140, Math.floor(Math.min(availableWidth / cols, availableHeight / rows) * 0.8))

    const totalGridWidth = cols * coinSize + (cols - 1) * 20
    const totalGridHeight = rows * coinSize + (rows - 1) * 20
    const startX = (CANVAS_WIDTH - totalGridWidth) / 2 + coinSize / 2
    const startY = (CANVAS_HEIGHT - totalGridHeight) / 2 + coinSize / 2

    for (let i = 0; i < count; i++) {
      const anim = animations[i]
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = startX + col * (coinSize + 20)
      const y = startY + row * (coinSize + 20)

      // small vertical bob while animating
      let yOffset = 0
      if (anim?.startTime && anim?.duration) {
        const progress = Math.min(1, (performance.now() - anim.startTime) / anim.duration)
        yOffset = Math.sin(progress * Math.PI * 4) * 30 * (1 - progress)
      }

  const face = (anim as any)?.showing ? (anim as any).showing as 'heads' | 'tails' : side
  const imgToUse = headsImg && tailsImg ? (face === 'heads' ? headsImg : (tailsImg as HTMLImageElement)) : (headsImg || tailsImg) as HTMLImageElement

      // If image not yet loaded, draw a simple circular placeholder so multiple coins are visible during load
      if (!imgToUse || !(imgToUse.naturalWidth > 0)) {
        ctx.save()
        ctx.translate(x, y + yOffset)
        ctx.beginPath()
        ctx.fillStyle = '#444'
        ctx.arc(0, 0, coinSize / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      } else {
        drawCoin(ctx, x, y + yOffset, anim.rotation, anim.scale, imgToUse, coinSize)
      }
    }

    // debug removed

    if (settings?.enableEffects) drawParticles(ctx, currentState.particles)

    animationRef.current = requestAnimationFrame(render)
  }, [activeCoins, side, headsImg, tailsImg, settings])

  useEffect(() => {
    // size canvas to logical size
    const canvas = canvasRef.current
    if (canvas) {
      const dpr = window.devicePixelRatio || 1
      canvas.width = CANVAS_WIDTH * dpr
      canvas.height = CANVAS_HEIGHT * dpr
      canvas.style.width = `${CANVAS_WIDTH}px`
      canvas.style.height = `${CANVAS_HEIGHT}px`
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    // start the RAF loop and also perform one immediate draw so placeholders
    // are visible before any user interaction
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    animationRef.current = requestAnimationFrame(render)
    // immediate (synchronous-ish) draw using requestAnimationFrame callback
    const first = requestAnimationFrame((t) => render(t))

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      cancelAnimationFrame(first)
    }
  }, [render])

  const play = async () => {
    if (gameState.flipping) return
    setGameState(prev => ({ ...prev, flipping: true, hasPlayed: true }))

    try {
      sounds.play('coin', { playbackRate: 0.9 })

      // create animations for the currently selected number of coins
      const startTime = performance.now()
      setGameState(prev => {
        const animations = prev.coinAnimations.slice()
        for (let i = 0; i < activeCoins; i++) {
          animations[i] = {
            rotation: 0,
            targetRotation: Math.PI * 4 + (Math.random() * Math.PI * 2),
            scale: 1,
            targetScale: 1,
            x: CANVAS_WIDTH/2 - ((activeCoins-1) * 80)/2 + i * 80,
            y: CANVAS_HEIGHT/2,
            startTime,
            duration: 800 + Math.random() * 400,
            complete: false
          }
        }
        return { ...prev, coinAnimations: animations, particles: [] }
      })

      await game.play({
        bet: Array(activeCoins).fill(SIDES[side]).flat(),
        wager: wager * activeCoins,
        metadata: [side]
      })

      const result = await game.result()
      const won = (result && (result.payout ?? 0)) > 0

      // update stats
  if (result) gameStats.updateStats((result.payout ?? 0) - wager * activeCoins)

      // Build deterministic per-coin visual results to match on-chain result
      try {
        const seed = `${result?.resultIndex}:${result?.payout}:${result?.multiplier}:${activeCoins}:${side}`
        // simple seeded RNG function (xorshift style)
        let h = 2166136261 >>> 0
        for (let i = 0; i < seed.length; i++) {
          h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
        }
        const rng = () => {
          h += 0x6D2B79F5
          let t = Math.imul(h ^ (h >>> 15), 1 | h)
          t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296
        }

        const coinFaces: Array<'heads' | 'tails'> = []
        const targetWin = won
        // If won, ensure at least one coin matches chosen side (simple approach); otherwise bias away
        for (let i = 0; i < activeCoins; i++) {
          let face: 'heads' | 'tails' = rng() < 0.5 ? 'heads' : 'tails'
          coinFaces.push(face)
        }

        // apply bias to ensure overall win/loss matches `won`
        const chosenSide = side
        const matches = coinFaces.filter(f => f === chosenSide).length
        if (targetWin && matches === 0) {
          // force first coin to chosen side
          coinFaces[0] = chosenSide
        }
        if (!targetWin && matches > 0) {
          // ensure at least one mismatch: flip the first matching coin
          for (let i = 0; i < coinFaces.length; i++) {
            if (coinFaces[i] === chosenSide) {
              coinFaces[i] = chosenSide === 'heads' ? 'tails' : 'heads'
              break
            }
          }
        }

        // Write final showing to animation slots so draw uses it
        setGameState(prev => {
          const animations = prev.coinAnimations.slice()
          for (let i = 0; i < activeCoins; i++) {
            animations[i] = {
              ...animations[i],
              // ensure coin lands flat
              rotation: 0,
              scale: 1,
              startTime: animations[i]?.startTime ?? performance.now(),
              duration: 0,
              showing: coinFaces[i]
            }
          }
          return { ...prev, coinAnimations: animations, particles: targetWin ? [...prev.particles, ...createParticleBurst(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, ROMANTIC_COLORS.bg.win, 30)] : prev.particles, win: targetWin }
        })

        if (won) {
          sounds.play('win')
        } else {
          sounds.play('lose')
        }
      } catch (err) {
        // fallback: play sound only
        if (won) sounds.play('win')
        else sounds.play('lose')
      }
    } catch (err) {
      console.error('Play failed', err)
    } finally {
      setGameState(prev => ({ ...prev, flipping: false }))
    }
  }

  const totalBet = wager * activeCoins

  return (
    <>
      <GambaUi.Portal target="recentplays">
        <GameRecentPlaysHorizontal gameId="flip" limit={10} />
      </GambaUi.Portal>

      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName={GAME_META.name}
          gameMode={activeCoins > 1 ? `${activeCoins} Coins` : 'Single Coin'}
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <div style={{ width: '100%', height: '100%', position: 'relative', background: 'linear-gradient(135deg, #0a0511 0%, #0d0618 25%, #0f081c 50%)' }}>
          <div style={{ position: 'absolute', top: 20, left: 20, right: 20, bottom: 120, borderRadius: 10, overflow: 'hidden', border: '2px solid rgba(212, 165, 116, 0.4)' }}>
            <canvas ref={canvasRef} />
          </div>

          <GameControlsSection>
            <div style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '8px 16px' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <EnhancedButton disabled={gamba.isPlaying || activeCoins <= 1} onClick={() => setActiveCoins(prev => Math.max(1, prev - 1))}>-</EnhancedButton>
                <div>Coins: {activeCoins}</div>
                <EnhancedButton disabled={gamba.isPlaying || activeCoins >= FLIP_SETTINGS.MAX_COINS} onClick={() => setActiveCoins(prev => Math.min(FLIP_SETTINGS.MAX_COINS, prev + 1))}>+</EnhancedButton>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                <EnhancedButton disabled={gamba.isPlaying} onClick={() => setSide(side === 'heads' ? 'tails' : 'heads')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img height={20} src={side === 'heads' ? TEXTURE_HEADS : TEXTURE_TAILS} />
                    {side === 'heads' ? 'Heads' : 'Tails'}
                  </div>
                </EnhancedButton>

                <div style={{ textAlign: 'center', opacity: 0.9 }}>Total Bet: <TokenValue amount={totalBet} /></div>
              </div>
            </div>
          </GameControlsSection>

          <GameplayFrame ref={effectsRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 1000 }} title={GAME_META.name} description={GAME_META.description} />
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <MobileControls wager={wager} setWager={setWager} onPlay={play} playDisabled={gamba.isPlaying} playText={flipping ? 'Flipping...' : `Flip ${activeCoins > 1 ? `${activeCoins} Coins` : 'Coin'}`} />

        <DesktopControls onPlay={play} playDisabled={gamba.isPlaying} playText={flipping ? 'Flipping...' : `Flip ${activeCoins > 1 ? `${activeCoins} Coins` : 'Coin'}`}>
          <EnhancedWagerInput value={wager} onChange={setWager} />
        </DesktopControls>
      </GambaUi.Portal>

  {/* recent plays are rendered in the `recentplays` portal above */}
    </>
  )
}

