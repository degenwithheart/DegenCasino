import { GambaUi, useSound, useWagerInput, useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { useIsCompact } from '../../hooks/useIsCompact'
import { useGamba } from 'gamba-react-v2'
import React, { useContext } from 'react'
import { GambaResultContext } from '../../context/GambaResultContext'
import {
  PEG_RADIUS,
  PLINKO_RAIUS,
  Plinko as PlinkoGame,
  PlinkoProps,
  barrierHeight,
  barrierWidth,
  bucketHeight,
} from './game'

import BUMP from './bump.mp3'
import FALL from './fall.mp3'
import WIN from './win.mp3'
import { TOKEN_METADATA } from '../../constants'
import PlinkoMultiBallOverlay from './PlinkoMultiBallOverlay'
import BallCountSelector from './BallCountSelector'
import { GameControls, GameScreenLayout } from '../../components'

function usePlinko(props: PlinkoProps, deps: React.DependencyList) {
  const [plinko, set] = React.useState<PlinkoGame>(null!)

  React.useEffect(() => {
    const p = new PlinkoGame(props)
    set(p)
    return () => p.cleanup()
  }, deps)

  return plinko
}

const DEGEN_BET = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 10, 10, 10, 15]
const BET = [.5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 3, 3, 3, 3, 3, 3, 3, 6]

export default function Plinko() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const { setGambaResult } = useContext(GambaResultContext)
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const [debug, setDebug] = React.useState(false)
  const [degen, setDegen] = React.useState(false)
  const [ballCount, setBallCount] = React.useState(1)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [showOutcome, setShowOutcome] = React.useState(false)
  const [hasPlayedBefore, setHasPlayedBefore] = React.useState(false)
  const [multiBallResults, setMultiBallResults] = React.useState<{
    totalAmount: number
    ballsPlayed: number
    individualResults: number[]
    isWin: boolean
  } | null>(null)
  
  const sounds = useSound({
    bump: BUMP,
    win: WIN,
    fall: FALL,
  })
  
  const tokenMeta = token ? TOKEN_METADATA.find((t) => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
  const tokenPrice = tokenMeta?.usdPrice ?? 0

  // Set default wager: 1 for free tokens, 0 for real tokens
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager) // 1 token for free token
    } else {
      setWager(0) // 0 for real tokens
    }
  }, [setWager, token, baseWager])

  const pegAnimations = React.useRef<Record<number, number>>({})
  const bucketAnimations = React.useRef<Record<number, number>>({})

  const bet = degen ? DEGEN_BET : BET
  const rows = degen ? 12 : 14

  // Responsive scaling logic using useIsCompact
  const { compact } = useIsCompact();
  const [scale, setScale] = React.useState(compact ? 1 : 1.2);

  React.useEffect(() => {
    setScale(compact ? 1 : 1.2);
  }, [compact]);

  const multipliers = React.useMemo(() => Array.from(new Set(bet)), [bet])

  const plinko = usePlinko(
    {
      rows,
      multipliers,
      onContact(contact) {
        if (contact.peg && contact.plinko) {
          pegAnimations.current[contact.peg.plugin.pegIndex] = 1
          sounds.play('bump', { playbackRate: 1 + Math.random() * 0.05 })
        }
        if (contact.barrier && contact.plinko) {
          sounds.play('bump', { playbackRate: 0.5 + Math.random() * 0.05 })
        }
        if (contact.bucket && contact.plinko) {
          bucketAnimations.current[contact.bucket.plugin.bucketIndex] = 1
          sounds.play(contact.bucket.plugin.bucketMultiplier >= 1 ? 'win' : 'fall')
        }
      },
    },
    [rows, multipliers],
  )

  const playMultipleBalls = async () => {
    if (isPlaying) return
    
    setIsPlaying(true)
    setShowOutcome(false)
    
    const results: number[] = []
    let totalAmount = 0
    
    for (let i = 0; i < ballCount; i++) {
      // Add delay between balls for visual effect
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      await game.play({ wager, bet })
      const result = await game.result()
      setGambaResult(result)
      // Run the plinko animation
      plinko.run(result.multiplier)
      // Calculate profit/loss for this ball
      const profit = result.payout - wager
      results.push(profit)
      totalAmount += profit
    }
    
    const isWin = totalAmount > 0
    
    setMultiBallResults({
      totalAmount,
      ballsPlayed: ballCount,
      individualResults: results,
      isWin
    })
    
    setShowOutcome(true)
    setHasPlayedBefore(true)
    setIsPlaying(false)
  }

  const handlePlayAgain = () => {
    setShowOutcome(false)
    setMultiBallResults(null)
    // Keep hasPlayedBefore as true for subsequent plays
  }

  return (
    <GameScreenLayout
      left={
        <GambaUi.Portal target="screen">
          <GambaUi.Canvas
            render={({ ctx, size }) => {
              if (!plinko) return
              const bodies = plinko.getBodies()
              const xx = size.width / plinko.width
              const yy = size.height / plinko.height
              const s = Math.min(xx, yy)

              ctx.clearRect(0, 0, size.width, size.height)
              ctx.fillStyle = '#0b0b13'
              ctx.fillRect(0, 0, size.width, size.height)
              ctx.save()
              ctx.translate(size.width / 2 - (plinko.width / 2) * s, size.height / 2 - (plinko.height / 2) * s)
              ctx.scale(s, s)

              if (debug) {
                ctx.beginPath()
                bodies.forEach(({ vertices }) => {
                  ctx.moveTo(vertices[0].x, vertices[0].y)
                  for (let j = 1; j < vertices.length; j += 1) {
                    ctx.lineTo(vertices[j].x, vertices[j].y)
                  }
                  ctx.lineTo(vertices[0].x, vertices[0].y)
                })
                ctx.lineWidth = 1
                ctx.strokeStyle = '#fff'
                ctx.stroke()
              } else {
                bodies.forEach((body, i) => {
                  const { label, position } = body
                  if (label === 'Peg') {
                    ctx.save()
                    ctx.translate(position.x, position.y)
                    const animation = pegAnimations.current[body.plugin.pegIndex] ?? 0
                    if (pegAnimations.current[body.plugin.pegIndex]) pegAnimations.current[body.plugin.pegIndex] *= 0.9
                    ctx.scale(1 + animation * 0.4, 1 + animation * 0.4)
                    const pegHue = (position.y + position.x + Date.now() * 0.05) % 360
                    ctx.fillStyle = `hsla(${pegHue}, 75%, 60%, ${(1 + animation * 2) * 0.2})`
                    ctx.beginPath()
                    ctx.arc(0, 0, PEG_RADIUS + 4, 0, Math.PI * 2)
                    ctx.fill()
                    const light = 75 + animation * 25
                    ctx.fillStyle = `hsla(${pegHue}, 85%, ${light}%, 1)`
                    ctx.beginPath()
                    ctx.arc(0, 0, PEG_RADIUS, 0, Math.PI * 2)
                    ctx.fill()
                    ctx.restore()
                  }
                  if (label === 'Plinko') {
                    ctx.save()
                    ctx.translate(position.x, position.y)
                    ctx.fillStyle = `hsla(${(i * 420) % 360}, 75%, 90%, 0.2)`
                    ctx.beginPath()
                    ctx.arc(0, 0, PLINKO_RAIUS * 1.5, 0, Math.PI * 2)
                    ctx.fill()
                    ctx.fillStyle = `hsla(${(i * 420) % 360}, 75%, 75%, 1)`
                    ctx.beginPath()
                    ctx.arc(0, 0, PLINKO_RAIUS, 0, Math.PI * 2)
                    ctx.fill()
                    ctx.restore()
                  }
                  if (label === 'Bucket') {
                    const animation = bucketAnimations.current[body.plugin.bucketIndex] ?? 0
                    if (bucketAnimations.current[body.plugin.bucketIndex]) bucketAnimations.current[body.plugin.bucketIndex] *= 0.9
                    ctx.save()
                    ctx.translate(position.x, position.y)
                    const bucketHue =
                      25 + (multipliers.indexOf(body.plugin.bucketMultiplier) / multipliers.length) * 125
                    const bucketAlpha = 0.05 + animation
                    ctx.save()
                    ctx.translate(0, bucketHeight / 2)
                    ctx.scale(1, 1 + animation * 2)
                    ctx.fillStyle = `hsla(${bucketHue}, 75%, 75%, ${bucketAlpha})`
                    ctx.fillRect(-25, -bucketHeight, 50, bucketHeight)
                    ctx.restore()
                    ctx.font = '20px Arial'
                    ctx.textAlign = 'center'
                    ctx.fillStyle = `hsla(${bucketHue}, 75%, ${75 + animation * 25}%, 1)`
                    ctx.lineWidth = 5
                    ctx.lineJoin = 'miter'
                    ctx.miterLimit = 2
                    ctx.beginPath()
                    ctx.strokeText('x' + body.plugin.bucketMultiplier, 0, 0)
                    ctx.stroke()
                    ctx.fillText('x' + body.plugin.bucketMultiplier, 0, 0)
                    ctx.fill()
                    ctx.restore()
                  }
                  if (label === 'Barrier') {
                    ctx.save()
                    ctx.translate(position.x, position.y)
                    ctx.fillStyle = '#cccccc22'
                    ctx.fillRect(-barrierWidth / 2, -barrierHeight / 2, barrierWidth, barrierHeight)
                    ctx.restore()
                  }
                })
              }

              ctx.restore()
            }}
          />
        </GambaUi.Portal>
      }
      right={
        <GameControls
          wager={wager}
          setWager={setWager}
          onPlay={playMultipleBalls}
          isPlaying={isPlaying}
          playButtonText={
            isPlaying 
              ? `Playing ${ballCount} ball${ballCount > 1 ? 's' : ''}...`
              : hasPlayedBefore 
                ? `${ballCount} Ball${ballCount > 1 ? 's' : ''}` 
                : `${ballCount} Ball${ballCount > 1 ? 's' : ''}`
          }
          playButtonDisabled={!wager || wager * ballCount > balance}
        >
          {/* Ball Count Selector */}
          <BallCountSelector
            ballCount={ballCount}
            onBallCountChange={setBallCount}
            disabled={isPlaying}
          />
          {/* Toggles */}
          <div style={{ display: 'flex', gap: 18, justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14 }}>
              <input
                type="checkbox"
                checked={degen}
                onChange={e => setDegen(e.target.checked)}
                style={{ accentColor: '#ff0' }}
                disabled={isPlaying}
              />
              Degen
            </label>
          </div>
        </GameControls>
      }
    />
  )
}
