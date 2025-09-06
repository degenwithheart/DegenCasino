import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import { EnhancedWagerInput, EnhancedButton, EnhancedPlayButton, MobileControls, SwitchControl, DesktopControls } from '../../components'
import GameScreenFrame, { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { StyledPlinkoBackground } from './PlinkoBackground.enhanced.styles'
import { PEG_RADIUS, PLINKO_RAIUS, Plinko as PlinkoGame, PlinkoProps, barrierHeight, barrierWidth, bucketHeight } from './game'
import { PLINKO_CONFIG, getBucketColor } from '../rtpConfig'
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

// Use centralized bet arrays from rtpConfig
const BET = PLINKO_CONFIG.normal
const DEGEN_BET = PLINKO_CONFIG.degen
const PEGS = PLINKO_CONFIG.PEGS
const BUCKETS = PLINKO_CONFIG.BUCKETS

export default function Plinko() {
  console.log('🎯 PLINKO COMPONENT LOADING...')
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const [debug, setDebug] = React.useState(false)
  const [degen, setDegen] = React.useState(false)
  
  // Get graphics settings to check if effects are enabled
  const { settings } = useGraphics()

  // Restore multi-ball support
  const [ballCount, setBallCount] = React.useState<number>(1)
  
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

  const bet = degen ? DEGEN_BET : BET
  const rows = degen ? PEGS.degen : PEGS.normal
  const buckets = degen ? BUCKETS.degen : BUCKETS.normal
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
    
    // Clear scoreboard hits when starting new game
    setBucketHits(new Map())
    setActiveBuckets(new Set())
    setRecentHits([]) // Clear recent hits array
    
    const plays = Math.max(1, Math.min(ballCount | 0, 50)) // clamp 1..50
    for (let i = 0; i < plays; i++) {
      await game.play({ wager, bet: Array.from(bet) })
      const result = await game.result()
      // DO NOT plinko.reset() here; we want multiple concurrent balls
      plinko.run(result.multiplier)
    }
  }

  return (
    <>
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
            <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
              <GambaUi.Canvas
                style={{ flex: 1, width: '100%', height: '100%' }}
                render={({ ctx, size }, clock) => {
                if (!plinko) return

                const bodies = plinko.getBodies()

                const xx = size.width / plinko.width
                const yy = size.height / plinko.height
                const s = Math.min(xx, yy)

                ctx.clearRect(0, 0, size.width, size.height)
                // Remove dark background to show cyan gravity theme
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
                    ctx.arc(0, 0, PEG_RADIUS + 4, 0, Math.PI * 2)
                    ctx.fill()
                    const light = 75 + animationEffect * 25
                    ctx.fillStyle = 'hsla(' + pegHue + ', 85%, ' + light + '%, 1)'
                    ctx.beginPath()
                    ctx.arc(0, 0, PEG_RADIUS, 0, Math.PI * 2)
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
                      ctx.arc(0, 0, PLINKO_RAIUS * 1.5, 0, Math.PI * 2)
                      ctx.fill()
                      ctx.fillStyle = 'hsla(' + (i * 420 % 360) + ', 75%, 75%, 1)'
                      ctx.beginPath()
                      ctx.arc(0, 0, PLINKO_RAIUS, 0, Math.PI * 2)
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
        </StyledPlinkoBackground>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={() => play()}
          playDisabled={false}
          playText="Play"
        >
          <SwitchControl
            label="Degen Mode"
            checked={degen}
            onChange={setDegen}
            disabled={gamba.isPlaying}
          />
        </MobileControls>
        
        <DesktopControls>
          <EnhancedWagerInput value={wager} onChange={setWager} />
          <div>Degen:</div>
          <GambaUi.Switch
            disabled={gamba.isPlaying}
            checked={degen}
            onChange={setDegen}
          />
          <EnhancedPlayButton onClick={() => play()}>
            Play
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}