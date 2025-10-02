import { PEG_RADIUS, PLINKO_RAIUS, Plinko as PlinkoGame, PlinkoProps, barrierHeight, barrierWidth, bucketHeight } from './game'
import { GambaUi, useSound, useWagerInput, useCurrentPool, TokenValue } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import { EnhancedWagerInput, EnhancedButton, MobileControls, SwitchControl, DesktopControls, GameRecentPlaysHorizontal } from '../../components'
import GameScreenFrame, { useGraphics } from '../../components/Game/GameScreenFrame'
import { GameControlsSection } from '../../components/Game/GameControlsSection'
import { OptionSelector } from '../../components/Mobile/MobileControls'
import { useGameMeta } from '../useGameMeta'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import { useGameStats } from '../../hooks/game/useGameStats'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { StyledPlinkoBackground } from './PlinkoBackground.enhanced.styles'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { BucketScoreboard } from './BucketScoreboard'
import BUMP from './bump.mp3'
import FALL from './fall.mp3'
import WIN from './win.mp3'

function usePlinko(props: PlinkoProps, deps: React.DependencyList) {
  const [plinko, set] = React.useState<PlinkoGame>(null!)

  React.useEffect(
    () => {
      const p = new PlinkoGame(props)
      set(p)
      return () => p.cleanup()
    },
    deps,
  )

  return plinko
}

const DEGEN_BET = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 10, 10, 10, 15]
const BET = [.5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 3, 3, 3, 3, 3, 3, 3, 6]

export default function Plinko() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const [debug, setDebug] = React.useState(false)
  const [degen, setDegen] = React.useState(false)
  const sounds = useSound({
    bump: BUMP,
    win: WIN,
    fall: FALL,
  })

  const pegAnimations = React.useRef<Record<number, number>>({})
  const bucketAnimations = React.useRef<Record<number, number>>({})

  const bet = degen ? DEGEN_BET : BET
  const rows = degen ? 12 : 14

  const multipliers = React.useMemo(() => Array.from(new Set(bet)), [bet])

  // Graphics & UI state
  const { settings } = useGraphics()
  const { mobile: isMobile } = useIsCompact()
  const pool = useCurrentPool()

  const [showControls, setShowControls] = useState(false)
  const [customRows, setCustomRows] = useState<number>(rows)
  const [customBuckets, setCustomBuckets] = useState<number>(14)
  const [customMode, setCustomMode] = useState(false)
  const [ballCount, setBallCount] = useState<number>(1)
  const [activeBuckets, setActiveBuckets] = useState<Set<number>>(new Set())
  const [recentHits, setRecentHits] = useState<number[]>([])
  const [poolExceeded, setPoolExceeded] = useState(false)

  // Dynamic radii used in canvas rendering (scale-aware adjustments can be added)
  const dynamicPegRadius = PEG_RADIUS
  const dynamicBallRadius = PLINKO_RAIUS

  // Compute bucket hits map for the scoreboard
  const bucketHitsMap = React.useMemo(() => {
    const m = new Map<number, number>()
    for (const idx of recentHits) m.set(idx, (m.get(idx) || 0) + 1)
    return m
  }, [recentHits])

  const buckets = customMode ? customBuckets : multipliers.length
  const displayRows = customMode ? customRows : rows

  // Simple color helper (copied from build artifacts) - returns rgba strings
  function getBucketColor(multiplier: number) {
    if (multiplier <= 0.99) {
      return {
        primary: 'rgba(239, 68, 68, 0.9)',
        secondary: 'rgba(220, 38, 38, 0.85)',
        tertiary: 'rgba(185, 28, 28, 0.9)'
      }
    } else if (multiplier >= 1.0 && multiplier <= 3.99) {
      return {
        primary: 'rgba(245, 158, 11, 0.9)',
        secondary: 'rgba(217, 119, 6, 0.85)',
        tertiary: 'rgba(180, 83, 9, 0.9)'
      }
    } else if (multiplier >= 4.0 && multiplier <= 6.99) {
      return {
        primary: 'rgba(34, 197, 94, 0.9)',
        secondary: 'rgba(22, 163, 74, 0.85)',
        tertiary: 'rgba(21, 128, 61, 0.9)'
      }
    } else {
      return {
        primary: 'rgba(59, 130, 246, 0.9)',
        secondary: 'rgba(37, 99, 235, 0.85)',
        tertiary: 'rgba(29, 78, 216, 0.9)'
      }
    }
  }

  const plinko = usePlinko({
    rows,
    multipliers,
    onContact(contact) {
      if (contact.peg && contact.plinko) {
        pegAnimations.current[contact.peg.plugin.pegIndex] = 1
        sounds.play('bump', { playbackRate: 1 + Math.random() * .05 })
      }
      if (contact.barrier && contact.plinko) {
        sounds.play('bump', { playbackRate: .5 + Math.random() * .05 })
      }
      if (contact.bucket && contact.plinko) {
        const idx = contact.bucket.plugin.bucketIndex
        bucketAnimations.current[idx] = 1
        sounds.play(contact.bucket.plugin.bucketMultiplier >= 1 ? 'win' : 'fall')
        // Record recent hits and mark active
        setRecentHits(prev => {
          const next = [...prev.slice(-19), idx]
          return next
        })
        setActiveBuckets(prev => {
          const next = new Set(prev)
          next.add(idx)
          return next
        })
      }
    },
  }, [rows, multipliers])

  const play = async () => {
    await game.play({ wager, bet })
    const result = await game.result()
    plinko.reset()
    plinko.run(result.multiplier)
  }

  const mobile = useIsCompact();

  return (
    <>
      {/* Recent Plays Portal - positioned above stats */}
      <GambaUi.Portal target="recentplays">
        <GameRecentPlaysHorizontal gameId="plinko" />
      </GambaUi.Portal>

      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Plinko"
          gameMode={degen ? "Degen" : "Normal"}
          stats={useGameStats().stats}
          onReset={useGameStats().resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <StyledPlinkoBackground>
          {/* Gravity poetry background elements */}
          <div className="gravity-bg-elements" />
          <div className="melody-overlay" />
          <div className="inevitability-indicator" />
          
          <GameScreenFrame
            title={game.game.meta?.name}
            description={game.game.meta?.description}
          >
            {/* Canvas now gets more space since header is outside */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
              <GambaUi.Canvas
                style={{ flex: 1, width: '100%', height: '100%' }}
                render={({ ctx, size }: any, clock: any) => {
                if (!plinko) return

                const bodies = plinko.getBodies()

                const xx = size.width / plinko.width
                const yy = size.height / plinko.height
                const s = Math.min(xx, yy)

                ctx.clearRect(0, 0, size.width, size.height)
                // Remove dark background to show cyan gravity colorScheme
                // ctx.fillStyle = '#0b0b13'
                // ctx.fillRect(0, 0, size.width, size.height)
                ctx.save()
                ctx.translate(size.width / 2 - plinko.width / 2 * s, size.height / 2 - plinko.height / 2 * s)
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
                }
                // Always render balls and board, regardless of debug
                bodies.forEach((body, i) => {
                  const { label, position } = body
                  if (label === 'Peg') {
                    ctx.save()
                    ctx.translate(position.x, position.y)
                    const animation = pegAnimations.current[body.plugin.pegIndex] ?? 0
                    if (pegAnimations.current[body.plugin.pegIndex]) {
                      pegAnimations.current[body.plugin.pegIndex] *= .9
                    }
                    // Only apply scale animation if motion is enabled
                    if (settings.enableMotion) {
                      ctx.scale(1 + animation * .4, 1 + animation * .4)
                    }
                    const pegHue = (position.y + position.x + Date.now() * .05) % 360
                    // Only apply animation effects if motion is enabled, otherwise use static values
                    const animationEffect = settings.enableMotion ? animation : 0
                    ctx.fillStyle = 'hsla(' + pegHue + ', 75%, 60%, ' + (1 + animationEffect * 2) * .2 + ')'
                    ctx.beginPath()
                    ctx.arc(0, 0, dynamicPegRadius + 4, 0, Math.PI * 2)
                    ctx.fill()
                    const light = 75 + animationEffect * 25
                    ctx.fillStyle = 'hsla(' + pegHue + ', 85%, ' + light + '%, 1)'
                    ctx.beginPath()
                    ctx.arc(0, 0, dynamicPegRadius, 0, Math.PI * 2)
                    ctx.fill()
                    ctx.restore()
                  }
                  if (label === 'Plinko') {
                    // Draw plinko balls
                    ctx.save()
                    ctx.translate(position.x, position.y)
                    ctx.fillStyle = 'hsla(' + (i * 420 % 360) + ', 75%, 90%, .2)'
                    ctx.beginPath()
                    ctx.arc(0, 0, dynamicBallRadius * 1.5, 0, Math.PI * 2)
                    ctx.fill()
                    ctx.fillStyle = 'hsla(' + (i * 420 % 360) + ', 75%, 75%, 1)'
                    ctx.beginPath()
                    ctx.arc(0, 0, dynamicBallRadius, 0, Math.PI * 2)
                    ctx.fill()
                    ctx.restore()
                  }
                  if (label === 'Bucket') {
                    const animation = bucketAnimations.current[body.plugin.bucketIndex] ?? 0
                    if (bucketAnimations.current[body.plugin.bucketIndex]) {
                      bucketAnimations.current[body.plugin.bucketIndex] *= .9
                    }
                    ctx.save()
                    ctx.translate(position.x, position.y)
                    // Enhanced bucket styling with dynamic colors based on multiplier
                    const bucketMultiplier = body.plugin.bucketMultiplier
                    // Only apply animation effect if motion is enabled, otherwise use static values
                    const animationEffect = settings.enableMotion ? animation : 0
                    const bucketAlpha = 0.8 + animationEffect * 0.2
                    
                    // Get dynamic colors based on multiplier value
                    const colors = getBucketColor(bucketMultiplier)
                    
                    // Create gradient for bucket background
                    const gradient = ctx.createLinearGradient(-25, -bucketHeight, 25, 0)
                    gradient.addColorStop(0, colors.primary.replace('0.9)', `${bucketAlpha})`))
                    gradient.addColorStop(0.5, colors.secondary.replace('0.85)', `${bucketAlpha * 0.9})`))
                    gradient.addColorStop(1, colors.tertiary.replace('0.9)', `${bucketAlpha})`))
                    
                    ctx.save()
                    ctx.translate(0, bucketHeight / 2)
                    ctx.scale(1, 1 + animation * 2)
                    // Draw bucket background with gradient
                    ctx.fillStyle = gradient
                    ctx.fillRect(-25, -bucketHeight, 50, bucketHeight)
                    // Add border for better separation
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 + animation * 0.4})`
                    ctx.lineWidth = 2
                    ctx.strokeRect(-25, -bucketHeight, 50, bucketHeight)
                    ctx.restore()
                    // Enhanced text styling
                    ctx.font = 'bold 18px Arial'
                    ctx.textAlign = 'center'
                    ctx.lineWidth = 3
                    ctx.lineJoin = 'round'
                    // Text shadow/outline
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'
                    ctx.strokeText('x' + bucketMultiplier, 0, 0)
                    // Main text
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.95 + animation * 0.05})`
                    ctx.fillText('x' + bucketMultiplier, 0, 0)
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
                ctx.restore()
              }}
            />
            
            {/* Bucket Scoreboard */}
            <BucketScoreboard
              multipliers={multipliers}
              activeBuckets={activeBuckets}
              bucketHits={bucketHitsMap}
              recentHits={recentHits}
            />
            </div>
          </GameScreenFrame>
          
          {/* Custom Settings Modal - automatically switches to custom mode */}
          {showControls && (
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(24, 24, 24, 0.98) 0%, rgba(32, 32, 40, 0.95) 100%)',
                borderRadius: '16px',
                border: '2px solid rgba(156, 39, 176, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                padding: '24px',
                width: '95vw',
                maxWidth: '900px',
                position: 'relative'
              }}>
                {/* Header Section */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(156, 39, 176, 0.3)'
                }}>
                  <div>
                    <h2 style={{
                      margin: 0,
                      fontSize: '24px',
                      fontWeight: 'bold',
                      background: 'linear-gradient(90deg, #9c27b0, #e91e63)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent'
                    }}>
                      Plinko Settings
                    </h2>
                    <p style={{
                      margin: '4px 0 0 0',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      fontStyle: 'italic'
                    }}>
                      Customize your Plinko board configuration
                    </p>
                  </div>
                  <button
                    onClick={() => setShowControls(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ✕
                  </button>
                </div>
                
                {/* Horizontal Controls Layout */}
                <div style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'flex-start'
                }}>
                  {/* Rows Control */}
                  <div style={{
                    flex: 1,
                    background: 'rgba(0, 230, 118, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(0, 230, 118, 0.2)'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#00e676',
                      marginBottom: '12px'
                    }}>
                      ROWS ({customRows})
                    </div>
                    <p style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: '0 0 16px 0',
                      lineHeight: '1.4'
                    }}>
                      More rows create more randomness and wider ball distribution.
                    </p>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px'
                    }}>
                      {[10, 12, 14, 16, 18, 20].map(count => (
                        <button
                          key={count}
                          onClick={() => setCustomRows(count)}
                          disabled={gamba.isPlaying || count === 18 || count === 20}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: `2px solid ${customRows === count ? '#00e676' : (count === 18 || count === 20) ? 'rgba(128, 128, 128, 0.4)' : 'rgba(0, 230, 118, 0.4)'}`,
                            background: customRows === count 
                              ? 'linear-gradient(135deg, rgba(0, 230, 118, 0.3) 0%, rgba(0, 200, 83, 0.4) 100%)'
                              : (count === 18 || count === 20) 
                                ? 'linear-gradient(135deg, rgba(128, 128, 128, 0.1) 0%, rgba(96, 96, 96, 0.2) 100%)'
                                : 'linear-gradient(135deg, rgba(0, 230, 118, 0.1) 0%, rgba(0, 200, 83, 0.2) 100%)',
                            color: customRows === count ? '#00e676' : (count === 18 || count === 20) ? 'rgba(128, 128, 128, 0.6)' : 'rgba(0, 230, 118, 0.8)',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: gamba.isPlaying || count === 18 || count === 20 ? 'not-allowed' : 'pointer',
                            opacity: gamba.isPlaying || count === 18 || count === 20 ? 0.5 : 1,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Buckets Control */}
                  <div style={{
                    flex: 1,
                    background: 'rgba(0, 188, 212, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(0, 188, 212, 0.2)'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#00bcd4',
                      marginBottom: '12px'
                    }}>
                      BUCKETS ({customBuckets})
                    </div>
                    <p style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: '0 0 16px 0',
                      lineHeight: '1.4'
                    }}>
                      Fewer buckets mean higher multipliers on edges but lower hit frequency.
                    </p>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px'
                    }}>
                      {[6, 8, 10, 12, 14, 16].map(count => (
                        <button
                          key={count}
                          onClick={() => setCustomBuckets(count)}
                          disabled={gamba.isPlaying || count === 14 || count === 16}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: `2px solid ${customBuckets === count ? '#00bcd4' : (count === 14 || count === 16) ? 'rgba(128, 128, 128, 0.4)' : 'rgba(0, 188, 212, 0.4)'}`,
                            background: customBuckets === count 
                              ? 'linear-gradient(135deg, rgba(0, 188, 212, 0.3) 0%, rgba(0, 172, 193, 0.4) 100%)'
                              : (count === 14 || count === 16)
                                ? 'linear-gradient(135deg, rgba(128, 128, 128, 0.1) 0%, rgba(96, 96, 96, 0.2) 100%)'
                                : 'linear-gradient(135deg, rgba(0, 188, 212, 0.1) 0%, rgba(0, 172, 193, 0.2) 100%)',
                            color: customBuckets === count ? '#00bcd4' : (count === 14 || count === 16) ? 'rgba(128, 128, 128, 0.6)' : 'rgba(0, 188, 212, 0.8)',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: gamba.isPlaying || count === 14 || count === 16 ? 'not-allowed' : 'pointer',
                            opacity: gamba.isPlaying || count === 14 || count === 16 ? 0.5 : 1,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Current Config Display */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(142, 36, 170, 0.05) 100%)',
                  borderRadius: '12px',
                  padding: 'clamp(16px, 3vw, 24px)',
                  border: '1px solid rgba(156, 39, 176, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    fontWeight: 'bold',
                    color: '#9c27b0',
                    marginBottom: '8px'
                  }}>
                    CURRENT CONFIG
                  </div>
                  <div style={{
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.5'
                  }}>
                    🎯 <strong>{customMode ? 'Custom' : degen ? 'Degen' : 'Normal'}</strong> Mode • 
                    📏 <strong>{rows}</strong> Rows • 
                    🪣 <strong>{buckets}</strong> Buckets • 
                    ⚡ <strong>{ballCount}</strong> Ball{ballCount > 1 ? 's' : ''} • 
                    💰 Max: <strong>{Math.max(...bet).toFixed(2)}x</strong>
                  </div>
                </div>

                {/* Footer Info */}
                <div style={{
                  textAlign: 'center',
                  paddingTop: 'clamp(16px, 3vw, 20px)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: 'clamp(10px, 2vw, 12px)',
                  marginTop: 'clamp(16px, 3vw, 20px)'
                }}>
                  💡 {customMode ? 'Experiment with different combinations to find your perfect risk/reward balance' : 'Use the controls above to quickly switch modes and ball counts'}
                </div>
              </div>
            </div>
          )}
        </StyledPlinkoBackground>
      </GambaUi.Portal>
      
      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={() => play()}
          playDisabled={gamba.isPlaying || poolExceeded}
          playText="Play"
        >
          {/* Mode Toggle + Balls Dropdown + Settings */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Normal|Degen Toggle */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <button
                onClick={() => { setCustomMode(false); setDegen(false) }}
                disabled={gamba.isPlaying}
                style={{
                  padding: '4px 10px',
                  borderRadius: '14px',
                  border: 'none',
                  background: !customMode && !degen 
                    ? 'linear-gradient(135deg, #4caf50, #45a049)'
                    : 'transparent',
                  color: !customMode && !degen ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  cursor: gamba.isPlaying ? 'not-allowed' : 'pointer',
                  opacity: gamba.isPlaying ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                Normal
              </button>
              <button
                onClick={() => { setCustomMode(false); setDegen(true) }}
                disabled={gamba.isPlaying}
                style={{
                  padding: '4px 10px',
                  borderRadius: '14px',
                  border: 'none',
                  background: !customMode && degen 
                    ? 'linear-gradient(135deg, #ff9800, #f57c00)'
                    : 'transparent',
                  color: !customMode && degen ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  cursor: gamba.isPlaying ? 'not-allowed' : 'pointer',
                  opacity: gamba.isPlaying ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                Degen
              </button>
            </div>

            {/* Balls Dropdown */}
            <select
              value={ballCount}
              onChange={(e) => setBallCount(Number(e.target.value))}
              disabled={gamba.isPlaying}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 87, 34, 0.4)',
                background: 'rgba(255, 87, 34, 0.1)',
                color: '#ff5722',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: gamba.isPlaying ? 'not-allowed' : 'pointer',
                opacity: gamba.isPlaying ? 0.5 : 1
              }}
            >
              {[1, 3, 5, 10].map(count => (
                <option key={count} value={count} style={{ background: '#1a1a1a', color: '#ff5722' }}>
                  {count} Ball{count > 1 ? 's' : ''}
                </option>
              ))}
            </select>

            {/* Settings Button - Always visible */}
            <button
              onClick={() => { setCustomMode(true); setShowControls(true) }}
              disabled={gamba.isPlaying}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                border: '1px solid rgba(156, 39, 176, 0.4)',
                background: 'rgba(156, 39, 176, 0.1)',
                color: '#9c27b0',
                fontSize: '12px',
                cursor: gamba.isPlaying ? 'not-allowed' : 'pointer',
                opacity: gamba.isPlaying ? 0.5 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ⚙️
            </button>
          </div>
        </MobileControls>
        
        <DesktopControls
          onPlay={() => play()}
          playDisabled={gamba.isPlaying || poolExceeded}
          playText="Play"
        >
          <EnhancedWagerInput value={wager} onChange={setWager} />
          
          {/* Controls Container - EXACTLY like wager input */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(10, 5, 17, 0.85) 0%, rgba(139, 90, 158, 0.1) 50%, rgba(10, 5, 17, 0.85) 100%)',
            border: '1px solid rgba(212, 165, 116, 0.4)',
            borderRadius: '16px',
            padding: '14px',
            boxShadow: 'inset 0 2px 8px rgba(10, 5, 17, 0.4), 0 4px 16px rgba(212, 165, 116, 0.1), 0 0 0 1px rgba(212, 165, 116, 0.15)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: 'fit-content'
          }}>
            {/* Mode Toggle (where number input would be) */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '2px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <button
                onClick={() => { setCustomMode(false); setDegen(false) }}
                disabled={gamba.isPlaying}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: !customMode && !degen 
                    ? 'linear-gradient(135deg, #4caf50, #45a049)'
                    : 'transparent',
                  color: !customMode && !degen ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: gamba.isPlaying ? 'not-allowed' : 'pointer',
                  opacity: gamba.isPlaying ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                Normal
              </button>
              <button
                onClick={() => { setCustomMode(false); setDegen(true) }}
                disabled={gamba.isPlaying}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: !customMode && degen 
                    ? 'linear-gradient(135deg, #ff9800, #f57c00)'
                    : 'transparent',
                  color: !customMode && degen ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: gamba.isPlaying ? 'not-allowed' : 'pointer',
                  opacity: gamba.isPlaying ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                Degen
              </button>
            </div>
            
            {/* Balls Dropdown (where token would be) */}
            <select
              value={ballCount}
              onChange={(e) => setBallCount(Number(e.target.value))}
              disabled={gamba.isPlaying}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(212, 165, 116, 0.9)',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: gamba.isPlaying ? 'not-allowed' : 'pointer',
                opacity: gamba.isPlaying ? 0.5 : 1,
                outline: 'none',
                fontFamily: 'Libre Baskerville, serif'
              }}
            >
              {[1, 3, 5, 10].map(count => (
                <option key={count} value={count} style={{ background: '#1a1a1a', color: '#ff5722' }}>
                  {count} Ball{count > 1 ? 's' : ''}
                </option>
              ))}
            </select>

            {/* Settings Button (where info icon would be) */}
            <button
              onClick={() => { setCustomMode(true); setShowControls(true) }}
              disabled={gamba.isPlaying}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(212, 165, 116, 0.9)',
                fontSize: '16px',
                cursor: gamba.isPlaying ? 'not-allowed' : 'pointer',
                opacity: gamba.isPlaying ? 0.5 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0',
                minWidth: '24px',
                height: '24px'
              }}
            >
              ⚙️
            </button>
          </div>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}
