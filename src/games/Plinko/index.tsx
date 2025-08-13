import { GambaUi, useSound, useWagerInput, useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { useIsCompact } from '../../hooks/useIsCompact'
import { useGambaResult } from '../../hooks/useGambaResult'
import { useGamba } from 'gamba-react-v2'
import React, { useContext } from 'react'
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
import PlinkoPaytable from './PlinkoPaytable'
import BallCountSelector from './BallCountSelector'
import { GameControls } from '../../components'
import PlinkoOverlays from './PlinkoOverlays'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

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
const BET = [.48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, .48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 1.44, 1.44, 1.44, 1.44, 1.44, 1.44, 1.44, 1.44, 1.44, 1.44, 2.88, 2.88, 2.88, 2.88, 2.88, 2.88, 2.88, 5.76] // 96% RTP

export default function Plinko() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const [debug, setDebug] = React.useState(false)
  const [degen, setDegen] = React.useState(false)
  const [ballCount, setBallCount] = React.useState(1)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentBall, setCurrentBall] = React.useState(0)
  const [ballResults, setBallResults] = React.useState<number[]>([])
  const [bucketHits, setBucketHits] = React.useState<Array<{
    multiplier: number
    count: number
    totalPayout: number
  }>>([])
  const [runningTotal, setRunningTotal] = React.useState(0)
  const [hasPlayedBefore, setHasPlayedBefore] = React.useState(false)
  
  // Dynamic play button text
  const playButtonText = hasPlayedBefore ? "Restart" : "Start"
  
  // Game phase management for overlays
  const [gamePhase, setGamePhase] = React.useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')
  const [thinkingPhase, setThinkingPhase] = React.useState(false)
  const [dramaticPause, setDramaticPause] = React.useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(0)
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🤔')
  
  const sounds = useSound({
    bump: BUMP,
    win: WIN,
    fall: FALL,
  })

  // Gamba result storage
  const { storeResult } = useGambaResult()
  
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
    const pegColors = React.useRef<Record<number, string>>({})
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
          // Assign a random color (HSLA for vibrancy)
          pegColors.current[contact.peg.plugin.pegIndex] = `hsl(${Math.floor(Math.random() * 360)}, 90%, 60%)`
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
    setCurrentBall(0)
    setBallResults([])
    setRunningTotal(0)
    
    // Start overlay sequence
    setGamePhase('thinking')
    setThinkingPhase(true)
    setDramaticPause(false)
    setCelebrationIntensity(0)
    
    // Random thinking emoji
    const thinkingEmojis = ['🤔', '🔮', '🎯', '⚡', '💫', '🎪']
    setThinkingEmoji(thinkingEmojis[Math.floor(Math.random() * thinkingEmojis.length)])
    
    // Initialize bucket hits tracking
    const initialBucketHits = multipliers.map(multiplier => ({
      multiplier,
      count: 0,
      totalPayout: 0
    }))
    setBucketHits(initialBucketHits)
    
    const results: number[] = []
    let totalAmount = 0
    
    // Thinking phase
    await new Promise(resolve => setTimeout(resolve, 1500))
    setThinkingPhase(false)
    
    // Dramatic pause
    setGamePhase('dramatic')
    setDramaticPause(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    setDramaticPause(false)
    setGamePhase('idle')
    
    for (let i = 0; i < ballCount; i++) {
      setCurrentBall(i + 1)
      
      // Add delay between balls for visual effect
      if (i > 0) {

        await new Promise(resolve => setTimeout(resolve, 1000))

      }
      
      await game.play({ wager, bet })

      const result = await game.result()


    // Store result in context for modal
    storeResult(result)
      
      // Run the plinko animation
      plinko.run(result.multiplier)
      
      // Calculate profit/loss for this ball
      const profit = result.payout - wager
      results.push(profit)
      totalAmount += profit
      
      // Update bucket hits
      setBucketHits(prev => prev.map(bucket => {
        if (bucket.multiplier === result.multiplier) {
          return {
            ...bucket,
            count: bucket.count + 1,
            totalPayout: bucket.totalPayout + profit
          }
        }
        return bucket
      }))
      
      // Update live totals
      setBallResults([...results])
      setRunningTotal(totalAmount)
    }
    
    setHasPlayedBefore(true)
    setIsPlaying(false)
    setCurrentBall(0)
    
    // Handle celebration or mourning overlays based on final result
    if (totalAmount > 0) {
      const totalMultiplier = (totalAmount + (ballCount * wager)) / (ballCount * wager)
      let intensity = 1
      if (totalMultiplier >= 5) intensity = 3
      else if (totalMultiplier >= 2) intensity = 2
      
      setCelebrationIntensity(intensity)
      setGamePhase('celebrating')
      
      // Auto-reset after celebration
      setTimeout(() => {
        setGamePhase('idle')
        setCelebrationIntensity(0)
      }, 4000)
    } else if (totalAmount < 0) {
      setGamePhase('mourning')
      
      // Auto-reset after mourning
      setTimeout(() => {
        setGamePhase('idle')
      }, 2500)
    }
  }

  const handlePlayAgain = () => {
    setBallResults([])
    setRunningTotal(0)
    setBucketHits(multipliers.map(multiplier => ({
      multiplier,
      count: 0,
      totalPayout: 0
    })))
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main game area */}
          <div
            style={{
              flex: 1,
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 25%, #a855f7 50%, #c084fc 75%, #e879f9 100%)',
              borderRadius: '24px',
              border: '3px solid rgba(168, 85, 247, 0.3)',
              boxShadow: `
                0 25px 50px rgba(0, 0, 0, 0.5),
                inset 0 2px 4px rgba(255, 255, 255, 0.1),
                inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                0 0 30px rgba(168, 85, 247, 0.2)
              `,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Floating plinko background elements */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '8%',
              fontSize: '110px',
              opacity: 0.08,
              transform: 'rotate(-15deg)',
              pointerEvents: 'none',
              color: '#a855f7'
            }}>⚪</div>
            <div style={{
              position: 'absolute',
              bottom: '15%',
              right: '10%',
              fontSize: '95px',
              opacity: 0.06,
              transform: 'rotate(20deg)',
              pointerEvents: 'none',
              color: '#c084fc'
            }}>🎯</div>
            <div style={{
              position: 'absolute',
              top: '42%',
              right: '12%',
              fontSize: '85px',
              opacity: 0.07,
              transform: 'rotate(-25deg)',
              pointerEvents: 'none',
              color: '#7c3aed'
            }}>⚡</div>
            <div style={{
              position: 'absolute',
              bottom: '38%',
              left: '10%',
              fontSize: '75px',
              opacity: 0.05,
              transform: 'rotate(30deg)',
              pointerEvents: 'none',
              color: '#e879f9'
            }}>🔮</div>
            
            {/* Decorative corner elements */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `
                radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)
              `,
              pointerEvents: 'none',
            }} />
            <GambaUi.Canvas
              render={({ ctx, size }) => {
                if (!plinko) return
                const bodies = plinko.getBodies()
                const xx = size.width / plinko.width
                const yy = size.height / plinko.height
                const s = Math.min(xx, yy)

                ctx.clearRect(0, 0, size.width, size.height)
                
                // Enhanced multi-layer gradient background
                const bgGradient = ctx.createLinearGradient(0, 0, 0, size.height)
                bgGradient.addColorStop(0, '#0a0a1a')
                bgGradient.addColorStop(0.3, '#1a1a2e')
                bgGradient.addColorStop(0.7, '#16213e')
                bgGradient.addColorStop(1, '#0f0f23')
                ctx.fillStyle = bgGradient
                ctx.fillRect(0, 0, size.width, size.height)
                
                // Add subtle noise texture
                for (let i = 0; i < 200; i++) {
                  const x = Math.random() * size.width
                  const y = Math.random() * size.height
                  ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.02})`
                  ctx.fillRect(x, y, 1, 1)
                }
                
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
                      
                      // Improved peg design with depth
                      const pegRadius = PEG_RADIUS
                      
                      // Outer glow
                      const pegColor = animation > 0.01 
                        ? pegColors.current[body.plugin.pegIndex] || '#ffffff' 
                        : '#ffffff'
                      
                      if (animation > 0.1) {
                        ctx.shadowColor = pegColor
                        ctx.shadowBlur = 15 + animation * 10
                        ctx.fillStyle = `rgba(255, 255, 255, ${animation * 0.3})`
                        ctx.beginPath()
                        ctx.arc(0, 0, pegRadius + 8, 0, Math.PI * 2)
                        ctx.fill()
                        ctx.shadowBlur = 0
                      }
                      
                      // Main peg - use random color if hit, otherwise near white
                      if (animation > 0.01) {
                        // Hit state - use random color
                        ctx.fillStyle = pegColor
                      } else {
                        // Idle state - near white metallic gradient
                        const pegGradient = ctx.createRadialGradient(-2, -2, 0, 0, 0, pegRadius)
                        pegGradient.addColorStop(0, '#e2e8f0')
                        pegGradient.addColorStop(0.7, '#94a3b8')
                        pegGradient.addColorStop(1, '#475569')
                        ctx.fillStyle = pegGradient
                      }
                      ctx.beginPath()
                      ctx.arc(0, 0, pegRadius, 0, Math.PI * 2)
                      ctx.fill()
                      
                      // Peg highlight
                      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
                      ctx.beginPath()
                      ctx.arc(-1, -1, pegRadius * 0.4, 0, Math.PI * 2)
                      ctx.fill()
                      
                      // Clear color when animation is done
                      if (animation < 0.01) {
                        delete pegColors.current[body.plugin.pegIndex]
                      }
                      
                      ctx.restore()
                    }
                    if (label === 'Plinko') {
                      ctx.save()
                      ctx.translate(position.x, position.y)
                      
                      // Enhanced ball with better gradient and glow
                      const ballRadius = PLINKO_RAIUS
                      
                      // Ball glow effect
                      ctx.shadowColor = '#00d4ff'
                      ctx.shadowBlur = 20
                      
                      // Main ball gradient
                      const ballGradient = ctx.createRadialGradient(-ballRadius * 0.3, -ballRadius * 0.3, 0, 0, 0, ballRadius)
                      ballGradient.addColorStop(0, '#ffffff')
                      ballGradient.addColorStop(0.3, '#00d4ff')
                      ballGradient.addColorStop(0.7, '#0ea5e9')
                      ballGradient.addColorStop(1, '#0369a1')
                      
                      ctx.fillStyle = ballGradient
                      ctx.beginPath()
                      ctx.arc(0, 0, ballRadius, 0, Math.PI * 2)
                      ctx.fill()
                      
                      // Ball highlight
                      ctx.shadowBlur = 0
                      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
                      ctx.beginPath()
                      ctx.arc(-ballRadius * 0.3, -ballRadius * 0.3, ballRadius * 0.3, 0, Math.PI * 2)
                      ctx.fill()
                      
                      // Rim effect
                      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
                      ctx.lineWidth = 1
                      ctx.beginPath()
                      ctx.arc(0, 0, ballRadius - 0.5, 0, Math.PI * 2)
                      ctx.stroke()
                      
                      ctx.restore()
                    }
                    if (label === 'Bucket') {
                      const animation = bucketAnimations.current[body.plugin.bucketIndex] ?? 0
                      if (bucketAnimations.current[body.plugin.bucketIndex]) bucketAnimations.current[body.plugin.bucketIndex] *= 0.9
                      ctx.save()
                      ctx.translate(position.x, position.y)
                      
                      // Improved bucket colors based on multiplier value
                      const multiplier = body.plugin.bucketMultiplier
                      let bucketColor
                      if (multiplier === 0) {
                        bucketColor = { h: 0, s: 75, l: 50 } // Red for 0x
                      } else if (multiplier < 1) {
                        bucketColor = { h: 25, s: 75, l: 55 } // Orange for < 1x
                      } else if (multiplier === 1) {
                        bucketColor = { h: 200, s: 75, l: 60 } // Blue for 1x
                      } else if (multiplier < 3) {
                        bucketColor = { h: 120, s: 75, l: 55 } // Green for 1-3x
                      } else {
                        bucketColor = { h: 280, s: 85, l: 65 } // Purple for high multipliers
                      }
                      
                      ctx.save()
                      ctx.translate(0, bucketHeight / 2)
                      ctx.scale(1, 1 + animation * 2)
                      
                      // Bucket background with gradient
                      const bucketGradient = ctx.createLinearGradient(0, -bucketHeight, 0, 0)
                      bucketGradient.addColorStop(0, `hsla(${bucketColor.h}, ${bucketColor.s}%, ${bucketColor.l + 20}%, 0.3)`)
                      bucketGradient.addColorStop(1, `hsla(${bucketColor.h}, ${bucketColor.s}%, ${bucketColor.l}%, 0.6)`)
                      ctx.fillStyle = bucketGradient
                      
                      // Enhanced bucket with glow when animated
                      if (animation > 0.1) {
                        ctx.shadowColor = `hsla(${bucketColor.h}, ${bucketColor.s}%, ${bucketColor.l}%, 0.8)`
                        ctx.shadowBlur = 20 + animation * 15
                      }
                      
                      ctx.fillRect(-25, -bucketHeight, 50, bucketHeight)
                      ctx.shadowBlur = 0
                      
                      // Bucket border
                      ctx.strokeStyle = `hsla(${bucketColor.h}, ${bucketColor.s}%, ${bucketColor.l + 10}%, 0.8)`
                      ctx.lineWidth = 2
                      ctx.strokeRect(-25, -bucketHeight, 50, bucketHeight)
                      
                      ctx.restore()
                      
                      // Multiplier text with better styling
                      ctx.font = 'bold 18px Arial'
                      ctx.textAlign = 'center'
                      ctx.textBaseline = 'middle'
                      
                      // Text shadow
                      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
                      ctx.fillText('x' + multiplier, 1, 1)
                      
                      // Main text
                      ctx.fillStyle = `hsla(${bucketColor.h}, ${bucketColor.s}%, ${Math.min(90, bucketColor.l + 30 + animation * 15)}%, 1)`
                      ctx.fillText('x' + multiplier, 0, 0)
                      
                      ctx.restore()
                    }
                    if (label === 'Barrier') {
                      ctx.save()
                      ctx.translate(position.x, position.y)
                      
                      // Enhanced barriers with subtle gradient
                      const barrierGradient = ctx.createLinearGradient(0, -barrierHeight/2, 0, barrierHeight/2)
                      barrierGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
                      barrierGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)')
                      barrierGradient.addColorStop(1, 'rgba(255, 255, 255, 0.06)')
                      ctx.fillStyle = barrierGradient
                      ctx.fillRect(-barrierWidth / 2, -barrierHeight / 2, barrierWidth, barrierHeight)
                      
                      // Barrier border with subtle glow
                      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
                      ctx.lineWidth = 0.5
                      ctx.strokeRect(-barrierWidth / 2, -barrierHeight / 2, barrierWidth, barrierHeight)
                      
                      ctx.restore()
                    }
                  })
                }

                ctx.restore()
              }}
            />
            
            {/* Add the overlay component - conditionally rendered based on ENABLE_THINKING_OVERLAY */}
            {renderThinkingOverlay(
              <PlinkoOverlays
                gamePhase={getGamePhaseState(gamePhase)}
                thinkingPhase={getThinkingPhaseState(thinkingPhase)}
                dramaticPause={dramaticPause}
                celebrationIntensity={celebrationIntensity}
                currentWin={runningTotal > 0 ? { multiplier: (runningTotal + (ballCount * wager)) / (ballCount * wager), amount: runningTotal } : undefined}
                thinkingEmoji={thinkingEmoji}
              />
            )}
          </div>
          
          {/* Paytable sidebar */}
          <PlinkoPaytable
            multipliers={multipliers}
            bucketHits={bucketHits}
            currentBall={currentBall}
            totalBalls={ballCount}
            runningTotal={runningTotal}
            wager={wager}
            isPlaying={isPlaying}
            ballResults={ballResults}
          />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={playMultipleBalls}
        isPlaying={isPlaying}
        playButtonText={
          isPlaying 
            ? `Ball ${currentBall}/${ballCount} - ${ballCount - currentBall} remaining`
            : `Play ${ballCount} Ball${ballCount > 1 ? 's' : ''}`
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
    </>
  )
}