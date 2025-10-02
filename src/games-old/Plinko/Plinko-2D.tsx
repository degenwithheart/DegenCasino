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
import { PEG_RADIUS, PLINKO_RAIUS, Plinko as PlinkoGame, PlinkoProps, barrierHeight, barrierWidth, bucketHeight } from './game'
import { BET_ARRAYS_V3, getBucketColor } from '../rtpConfig-v3'
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

// Use centralized bet arrays from rtpConfig-v3
const BET = BET_ARRAYS_V3.plinko.calculateBetArray('normal')
const DEGEN_BET = BET_ARRAYS_V3.plinko.calculateBetArray('degen')
const PEGS = BET_ARRAYS_V3.plinko.PEGS
const BUCKETS = BET_ARRAYS_V3.plinko.BUCKETS

export default function PlinkoRenderer2D() {
  console.log('🎯 PLINKO COMPONENT LOADING...')
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [wager, setWager] = useWagerInput()
  const [debug, setDebug] = React.useState(false)
  const [degen, setDegen] = React.useState(false)

  // Game statistics tracking - using centralized hook
  const gameStats = useGameStats('plinko')

  // Custom configuration state  
  const [customMode, setCustomMode] = React.useState(false)
  const [customRows, setCustomRows] = React.useState(14)
  const [customBuckets, setCustomBuckets] = React.useState(8)

  // Pool restrictions
  const maxMultiplierForPool = React.useMemo(() => {
    const normalMax = Math.max(...BET_ARRAYS_V3.plinko.calculateBetArray('normal'))
    const degenMax = Math.max(...BET_ARRAYS_V3.plinko.calculateBetArray('degen'))
    return Math.max(normalMax, degenMax)
  }, [])

  const maxWagerForPool = React.useMemo(() => {
    return pool.maxPayout / maxMultiplierForPool
  }, [pool.maxPayout, maxMultiplierForPool])

  const maxPayout = wager * maxMultiplierForPool
  const poolExceeded = maxPayout > pool.maxPayout
  
  // Get graphics settings to check if effects are enabled
  const { settings } = useGraphics()

  // Mobile detection for responsive stats display
  const { mobile } = useIsCompact()

  // Restore multi-ball support
  const [ballCount, setBallCount] = React.useState<number>(1)
  
  // Controls modal state
  const [showControls, setShowControls] = React.useState(false)
  
  // Bucket scoreboard state
  const [activeBuckets, setActiveBuckets] = React.useState<Set<number>>(new Set())
  const [bucketHits, setBucketHits] = React.useState<Map<number, number>>(new Map())
  const [recentHits, setRecentHits] = React.useState<number[]>([]) // Track order of hits
  
  // Enhanced accessibility effects functions for GameScreenFrame
  const triggerWinFlash = useCallback((color: string, intensity: number) => {
    // Only run enhanced visual feedback if accessibility setting is enabled
    if (!settings.enableEffects) {
      console.log('♿ Flash effect skipped - accessibility visual feedback disabled')
      return
    }
    
    console.log('♿ ACCESSIBILITY FLASH triggered:', { color, intensity })
    
    // Enhanced intensity for accessibility - make it more noticeable
    const accessibilityIntensity = Math.min(intensity * 1.5, 0.8) // Boost but cap at 80%
    
    // Try multiple ways to find the effects container
    const methods = [
      () => document.querySelector('[data-game-effects-container="true"]') as HTMLElement,
      () => document.querySelector('[data-quality]') as HTMLElement,
      () => document.querySelector('[class*="EffectsContainer"]') as HTMLElement,
      () => document.querySelector('div[style*="--flash-color"]') as HTMLElement,
      () => document.querySelector('div[style*="position: relative"][style*="width: 100%"]') as HTMLElement,
      () => {
        // Find by checking for the ::before pseudo element capability
        const divs = document.querySelectorAll('div')
        for (const div of Array.from(divs)) {
          const styles = window.getComputedStyle(div, '::before')
          if (styles.content !== 'none' && styles.position === 'absolute') {
            return div as HTMLElement
          }
        }
        return null
      },
      () => {
        // Find the container that wraps the Plinko game content
        const gameContent = document.querySelector('canvas') || document.querySelector('[data-testid="plinko-game"]')
        return gameContent?.closest('div[class*="motion"]') as HTMLElement || 
               gameContent?.parentElement?.parentElement as HTMLElement
      }
    ]
    
    let effectsContainer: HTMLElement | null = null
    
    for (let i = 0; i < methods.length; i++) {
      try {
        effectsContainer = methods[i]()
        if (effectsContainer) {
          console.log(`🎯 Found container using method ${i + 1}:`, effectsContainer)
          break
        }
      } catch (e) {
        console.log(`❌ Method ${i + 1} failed:`, e)
      }
    }
    
    if (!effectsContainer) {
      console.log('❌ No effects container found with any method')
      // Try to find any div that could work
      const allDivs = Array.from(document.querySelectorAll('div'))
      console.log('🔍 Available divs:', allDivs.slice(0, 10).map(div => ({
        className: div.className,
        id: div.id,
        style: div.getAttribute('style')
      })))
      return
    }
    
    // Set CSS variables for flash effect  
    effectsContainer.style.setProperty('--flash-color', color)
    effectsContainer.style.setProperty('--flash-intensity', accessibilityIntensity.toString())
    
    console.log('🎯 ACCESSIBILITY CSS variables set:', { 
      '--flash-color': color, 
      '--flash-intensity': accessibilityIntensity.toString() 
    })
    
    // Add flash class
    effectsContainer.classList.add('flashing')
    console.log('♿ Added accessibility flash class')
    
    // ENHANCED ACCESSIBILITY VISUAL FLASH - stronger contrast, longer duration, multiple visual cues
    const flashOverlay = document.createElement('div')
    flashOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${color};
      opacity: ${accessibilityIntensity};
      z-index: 9999;
      pointer-events: none;
      border-radius: 8px;
      border: 6px solid ${color};
      box-shadow: inset 0 0 30px ${color}, 0 0 50px ${color}, 0 0 100px ${color}80;
      transition: opacity 0.3s ease;
    `
    effectsContainer.appendChild(flashOverlay)
    
    // Add text indicator for screen readers/accessibility
    const textIndicator = document.createElement('div')
    textIndicator.setAttribute('aria-live', 'polite')
    textIndicator.setAttribute('role', 'status')
    textIndicator.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: bold;
      z-index: 10000;
      pointer-events: none;
      font-size: 18px;
    `
    
    // Determine outcome text based on color
    let outcomeText = 'Game Outcome'
    if (color.includes('ff') && (color.includes('ff00') || color.includes('ffff'))) {
      outcomeText = '🎉 BIG WIN!'
    } else if (color.includes('00ff')) {
      outcomeText = '✅ WIN!'
    } else if (color.includes('ff') && color.includes('00')) {
      outcomeText = '❌ Loss'
    }
    
    textIndicator.textContent = outcomeText
    effectsContainer.appendChild(textIndicator)
    textIndicator.style.cssText = `
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 18px;
      font-weight: bold;
      z-index: 10000;
      pointer-events: none;
      text-align: center;
      border: 2px solid ${color};
    `
    const isWin = color.includes('00ff') || color.includes('ffff')
    textIndicator.textContent = isWin ? '� WIN!' : '❌ LOSE'
    effectsContainer.appendChild(textIndicator)
    
    console.log('♿ Added enhanced accessibility flash overlay with text indicator')
    
    // Remove flash effects after longer duration for accessibility
    setTimeout(() => {
      effectsContainer.classList.remove('flashing')
      if (flashOverlay.parentNode) {
        flashOverlay.style.opacity = '0'
        setTimeout(() => {
          if (flashOverlay.parentNode) {
            flashOverlay.parentNode.removeChild(flashOverlay)
          }
        }, 200)
      }
      if (textIndicator.parentNode) {
        textIndicator.style.opacity = '0'
        setTimeout(() => {
          if (textIndicator.parentNode) {
            textIndicator.parentNode.removeChild(textIndicator)
          }
        }, 200)
      }
      console.log('♿ Removed accessibility flash effects')
    }, 500) // Longer duration for accessibility
  }, [settings.enableEffects])
  
  const triggerLoseFlash = (color = '#ff0000', intensity = 0.3) => {
    triggerWinFlash(color, intensity)
  }
  
  const triggerScreenShake = (intensity = 1, duration = 300) => {
    // Only run enhanced visual feedback if accessibility setting is enabled
    if (!settings.enableEffects) {
      console.log('♿ Screen shake skipped - accessibility visual feedback disabled')
      return
    }
    
    // Don't run shake animations if motion is disabled
    if (!settings.enableMotion) {
      console.log('🚫 Screen shake skipped - static mode enabled (no motion)')
      return
    }
    
    console.log('♿ ACCESSIBILITY SCREEN SHAKE triggered:', { intensity, duration })
    
    // Enhanced intensity and duration for accessibility
    const accessibilityIntensity = Math.min(intensity * 2, 10) // Boost shake for visibility
    const accessibilityDuration = Math.max(duration * 1.5, 400) // Longer duration for notice
    
    // Use the same robust container finding logic
    const methods = [
      () => document.querySelector('[data-game-effects-container="true"]') as HTMLElement,
      () => document.querySelector('[data-quality]') as HTMLElement,
      () => document.querySelector('[class*="EffectsContainer"]') as HTMLElement,
      () => {
        const gameContent = document.querySelector('canvas') || document.querySelector('[data-testid="plinko-game"]')
        return gameContent?.closest('div[class*="motion"]') as HTMLElement || 
               gameContent?.parentElement?.parentElement as HTMLElement
      }
    ]
    
    let effectsContainer: HTMLElement | null = null
    
    for (let i = 0; i < methods.length; i++) {
      try {
        effectsContainer = methods[i]()
        if (effectsContainer) {
          console.log(`🎯 Found container for shake using method ${i + 1}:`, effectsContainer)
          break
        }
      } catch (e) {
        console.log(`❌ Shake method ${i + 1} failed:`, e)
      }
    }
    
    if (!effectsContainer) {
      console.log('❌ No container found for screen shake')
      return
    }
    
    console.log('♿ Shaking container for accessibility:', effectsContainer)
    
    // Enhanced accessibility shake with stronger visual cues
    const originalBorder = effectsContainer.style.border
    const originalBoxShadow = effectsContainer.style.boxShadow
    const borderColor = intensity > 1 ? '#ffff00' : '#ff6666'
    effectsContainer.style.border = `5px solid ${borderColor}` // Thicker border for visibility
    effectsContainer.style.borderRadius = '8px'
    effectsContainer.style.boxShadow = `0 0 20px ${borderColor}, inset 0 0 20px ${borderColor}50` // Glow effect
    
    const keyframes = []
    const steps = 15 // More steps for smoother accessibility feedback
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps
      const amplitude = accessibilityIntensity * 8 * (1 - progress) // Even more intense shake for accessibility
      const x = (Math.random() - 0.5) * amplitude
      const y = (Math.random() - 0.5) * amplitude
      const rotation = (Math.random() - 0.5) * 2 // Add rotation to make shake more dramatic
      
      keyframes.push({
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
        offset: progress
      })
    }
    
    const animation = effectsContainer.animate(keyframes, {
      duration: accessibilityDuration, // Longer duration for accessibility
      easing: 'ease-out'
    })
    
    console.log('♿ Accessibility screen shake animation started with enhanced amplitude:', accessibilityIntensity * 8)
    
    // Remove border and shadow effects when shake is done
    animation.onfinish = () => {
      effectsContainer!.style.border = originalBorder
      effectsContainer!.style.boxShadow = originalBoxShadow
      console.log('♿ Accessibility screen shake animation completed')
    }
  }

  const sounds = useSound({
    bump: BUMP,
    win: WIN,
    fall: FALL,
  })

  const pegAnimations = React.useRef<Record<number, number>>({})
  const bucketAnimations = React.useRef<Record<number, number>>({})

  // Dynamic bet array calculation for custom mode
  const bet = React.useMemo(() => {
    if (customMode) {
      // Use centralized custom multiplier generation from RTP config-v3
      return BET_ARRAYS_V3.plinko._createMultipliers
        ? BET_ARRAYS_V3.plinko._createMultipliers(customBuckets, customRows, degen ? 'degen' : 'normal')
        : (degen ? DEGEN_BET : BET)
    }
    return degen ? DEGEN_BET : BET
  }, [customMode, customBuckets, customRows, degen])
  
  const rows = customMode ? customRows : (degen ? PEGS.degen : PEGS.normal)
  const buckets = customMode ? customBuckets : (degen ? BUCKETS.degen : BUCKETS.normal)
  
  // Dynamic ball and peg sizing based on row count
  const dynamicBallRadius = React.useMemo(() => {
    // Base radius at 14 rows, scale down/up based on actual rows
    const baseRadius = 9;
    const baseRows = 14;
    const scaleFactor = Math.max(0.5, Math.min(1.5, baseRows / rows));
    return baseRadius * scaleFactor;
  }, [rows])
  
  const dynamicPegRadius = React.useMemo(() => {
    // Base radius at 14 rows, scale down/up based on actual rows  
    const baseRadius = 11;
    const baseRows = 14;
    const scaleFactor = Math.max(0.7, Math.min(1.3, baseRows / rows));
    return baseRadius * scaleFactor;
  }, [rows])
  
  // Calculate dynamic max multiplier for current mode
  const maxMultiplier = React.useMemo(() => Math.max(...bet), [bet])
  
  const multipliers = bet // Use exact bet array - no duplicate removal!

  const plinko = usePlinko({
    rows,
    buckets,
    multipliers,
    enableMotion: settings.enableMotion, // Pass motion setting to physics engine
    onContact(contact) {
      const baseSeed = `${contact.peg?.plugin?.pegIndex ?? 'n'}:${contact.bucket?.plugin?.bucketIndex ?? 'n'}:${contact.barrier ? 'b' : ''}:${Math.floor(Date.now()/250)}`
      const rng = makeDeterministicRng(baseSeed)
      if (contact.peg && contact.plinko) {
        // Only animate pegs if motion is enabled
        if (settings.enableMotion) {
          pegAnimations.current[contact.peg.plugin.pegIndex] = 1
        }
        const rate = 1 + rng() * .05
        sounds.play('bump', { playbackRate: rate })
      }
      if (contact.barrier && contact.plinko) {
        const rate = .5 + rng() * .05
        sounds.play('bump', { playbackRate: rate })
      }
      if (contact.bucket && contact.plinko) {
        const bucketIndex = contact.bucket.plugin.bucketIndex
        
        // Update scoreboard - mark bucket as active
        setActiveBuckets(prev => new Set(prev).add(bucketIndex))
        
        // Add to recent hits array
        setRecentHits(prev => [...prev, bucketIndex])
        
        // Update hit count
        setBucketHits(prev => {
          const newMap = new Map(prev)
          newMap.set(bucketIndex, (newMap.get(bucketIndex) || 0) + 1)
          return newMap
        })
        
        // Clear active state after animation
        setTimeout(() => {
          setActiveBuckets(prev => {
            const newSet = new Set(prev)
            newSet.delete(bucketIndex)
            return newSet
          })
        }, 600)
        
        // Only animate buckets if motion is enabled
        if (settings.enableMotion) {
          bucketAnimations.current[contact.bucket.plugin.bucketIndex] = 1
        }
        const isWin = contact.bucket.plugin.bucketMultiplier >= 1
        sounds.play(isWin ? 'win' : 'fall')
        
        // 🏀 TRIGGER PLINKO EFFECTS
        if (isWin) {
          const multiplier = contact.bucket.plugin.bucketMultiplier
          console.log(`🏀 PLINKO WIN! Ball landed in ${multiplier}x bucket`)
          
          if (multiplier >= 10) {
            // Huge win
            triggerWinFlash('#ffff00', 0.5)
            triggerScreenShake(2, 500)
          } else if (multiplier >= 3) {
            // Big win
            triggerWinFlash('#00ff00', 0.4)
            triggerScreenShake(1.5, 400)
          } else {
            // Small win
            triggerWinFlash('#00ff88', 0.3)
            triggerScreenShake(0.8, 300)
          }
        } else {
          console.log('🏀 PLINKO LOSE! Ball landed in 0x bucket')
          triggerLoseFlash('#ff4444', 0.3)
          triggerScreenShake(0.5, 200)
        }
      }
    },
  }, [rows, multipliers, settings.enableMotion])

  // Multi-ball play: launch N results, deduct wager per ball
  const play = async () => {
    // CRITICAL SECURITY: Prevent zero wager gameplay
    if (wager <= 0) {
      console.error('❌ BLOCKED: Cannot play with zero wager');
      return;
    }
    
    console.log(`🎯 PLINKO PLAY: rows=${rows}, buckets=${buckets}, multipliers.length=${multipliers.length}`);
    console.log(`🎯 BALL/PEG SIZES: ballRadius=${dynamicBallRadius}, pegRadius=${dynamicPegRadius}`);
    
    // Clear scoreboard hits when starting new game
    setBucketHits(new Map())
    setActiveBuckets(new Set())
    setRecentHits([]) // Clear recent hits array
    
    const totalWager = wager * ballCount
    let totalPayout = 0
    
    const plays = Math.max(1, Math.min(ballCount | 0, 50)) // clamp 1..50
    for (let i = 0; i < plays; i++) {
      await game.play({ wager, bet: Array.from(bet) })
      const result = await game.result()
      console.log(`🎯 BALL ${i + 1}: result=${result.multiplier}, payout=${result.payout}`);
      totalPayout += result.payout
      // DO NOT plinko.reset() here; we want multiple concurrent balls
      plinko.run(result.multiplier)
    }
    
    // Update game statistics
    const profit = totalPayout - totalWager
    const isWin = totalPayout > totalWager
    
    gameStats.updateStats(totalPayout)
  }

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
          rtp={degen ? "95" : "98"}
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={mobile}
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
                    // Only draw balls that are still being animated (present in plinko.activeBalls)
                    const active = plinko.activeBalls?.some(b => b.ball === body);
                    if (active) {
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
              bucketHits={bucketHits}
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