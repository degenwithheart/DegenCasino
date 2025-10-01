import { GambaUi, useSound, useWagerInput, useCurrentPool } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useGameMeta } from '../useGameMeta'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameStats } from '../../hooks/game/useGameStats'
import { BET_ARRAYS_V3 } from '../rtpConfig-v3'
import { BPS_PER_WHOLE } from 'gamba-core-v2'

// Use centralized bet arrays from rtpConfig-v3
const BET = BET_ARRAYS_V3.plinko.calculateBetArray('normal')
const DEGEN_BET = BET_ARRAYS_V3.plinko.calculateBetArray('degen')
const PEGS = BET_ARRAYS_V3.plinko.PEGS
const BUCKETS = BET_ARRAYS_V3.plinko.BUCKETS

interface GameStats {
  gamesPlayed: number
  wins: number
  losses: number
  sessionProfit: number
  bestWin: number
}

export function usePlinkoGameLogic() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [wager, setWager] = useWagerInput()
  const [debug, setDebug] = useState(false)
  const [degen, setDegen] = useState(false)

  // Game statistics tracking - using centralized hook
  const gameStats = useGameStats('plinko')

  // Custom configuration state  
  const [customMode, setCustomMode] = useState(false)
  const [customRows, setCustomRows] = useState(14)
  const [customBuckets, setCustomBuckets] = useState(8)

  // Pool restrictions
  const maxMultiplierForPool = useMemo(() => {
    const normalMax = Math.max(...BET)
    const degenMax = Math.max(...DEGEN_BET)
    return Math.max(normalMax, degenMax)
  }, [])

  const maxWagerForPool = useMemo(() => {
    return pool.maxPayout / maxMultiplierForPool
  }, [pool.maxPayout, maxMultiplierForPool])

  const maxPayout = wager * maxMultiplierForPool
  const poolExceeded = maxPayout > pool.maxPayout
  
  // Get graphics settings to check if effects are enabled
  const { settings } = useGraphics()

  // Mobile detection for responsive stats display
  const { mobile } = useIsCompact()

  // Restore multi-ball support
  const [ballCount, setBallCount] = useState<number>(1)
  
  // Controls modal state
  const [showControls, setShowControls] = useState(false)
  
  // Bucket scoreboard state
  const [activeBuckets, setActiveBuckets] = useState<Set<number>>(new Set())
  const [bucketHits, setBucketHits] = useState<Map<number, number>>(new Map())
  const [recentHits, setRecentHits] = useState<number[]>([]) // Track order of hits

  // Game state
  const [isPlaying, setIsPlaying] = useState(false)

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
          console.log(`🎯 Found container for flash using method ${i + 1}:`, effectsContainer)
          break
        }
      } catch (e) {
        console.log(`❌ Flash method ${i + 1} failed:`, e)
      }
    }
    
    if (!effectsContainer) {
      console.log('❌ No container found for accessibility flash')
      return
    }
    
    console.log('♿ Triggering accessibility flash on container:', effectsContainer)
    
    // Enhanced accessibility flash with stronger visual cues
    effectsContainer.style.setProperty('--flash-color', color)
    effectsContainer.style.setProperty('--flash-intensity', accessibilityIntensity.toString())
    
    const originalFilter = effectsContainer.style.filter
    const originalBorder = effectsContainer.style.border
    const originalBoxShadow = effectsContainer.style.boxShadow
    
    // More intense accessibility flash
    effectsContainer.style.filter = `brightness(${1 + accessibilityIntensity * 0.8}) saturate(${1 + accessibilityIntensity})`
    effectsContainer.style.border = `4px solid ${color}`
    effectsContainer.style.borderRadius = '8px'
    effectsContainer.style.boxShadow = `0 0 30px ${color}, inset 0 0 20px ${color}40`
    
    // Longer duration for accessibility
    const accessibilityDuration = Math.max(300, intensity * 200)
    
    setTimeout(() => {
      effectsContainer.style.filter = originalFilter
      effectsContainer.style.border = originalBorder
      effectsContainer.style.boxShadow = originalBoxShadow
    }, accessibilityDuration)
    
  }, [settings.enableEffects])

  const triggerScreenShake = useCallback((intensity: number, duration: number = 200) => {
    if (!settings.enableEffects) {
      console.log('♿ Shake effect skipped - accessibility visual feedback disabled')
      return
    }
    
    console.log('♿ ACCESSIBILITY SHAKE triggered:', { intensity, duration })
    
    // Enhanced intensity and duration for accessibility
    const accessibilityIntensity = Math.min(intensity * 2, 1) // Double intensity but cap at 100%
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
      
      keyframes.push({
        transform: `translate(${x}px, ${y}px)`,
        offset: progress
      })
    }
    
    keyframes.push({
      transform: 'translate(0px, 0px)',
      offset: 1
    })
    
    try {
      const animation = effectsContainer.animate(keyframes, {
        duration: accessibilityDuration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      })
      
      animation.onfinish = () => {
        effectsContainer.style.border = originalBorder
        effectsContainer.style.boxShadow = originalBoxShadow
      }
    } catch (animError) {
      console.log('❌ Animation failed, falling back to border effect:', animError)
      setTimeout(() => {
        effectsContainer.style.border = originalBorder
        effectsContainer.style.boxShadow = originalBoxShadow
      }, accessibilityDuration)
    }
    
  }, [settings.enableEffects])

  // Dynamic sizing based on game configuration
  const rows = customMode ? customRows : (degen ? PEGS.degen : PEGS.normal)
  const buckets = customMode ? customBuckets : (degen ? BUCKETS.degen : BUCKETS.normal)
  const bet = customMode ? Array(buckets).fill(1) : (degen ? DEGEN_BET : BET)
  const multipliers = Array.from(bet)

  const resetGame = useCallback(() => {
    setBucketHits(new Map())
    setActiveBuckets(new Set())
    setRecentHits([])
  }, [])

  // Multi-ball play: launch N results, deduct wager per ball
  const play = async () => {
    // CRITICAL SECURITY: Prevent zero wager gameplay
    if (wager <= 0) {
      console.error('❌ BLOCKED: Cannot play with zero wager')
      return
    }
    
    console.log(`🎯 PLINKO PLAY: rows=${rows}, buckets=${buckets}, multipliers.length=${multipliers.length}`)
    
    setIsPlaying(true)
    
    try {
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
        console.log(`🎯 BALL ${i + 1}: result=${result.multiplier}, payout=${result.payout}`)
        totalPayout += result.payout
      }
      
      // Update game statistics
      const profit = totalPayout - totalWager
      const isWin = totalPayout > totalWager
      
      gameStats.updateStats(profit)
      
    } catch (error) {
      console.error('❌ Play failed:', error)
    } finally {
      setIsPlaying(false)
    }
  }

  return {
    // Game state
    game,
    gamba,
    pool,
    wager,
    setWager,
    debug,
    setDebug,
    degen,
    setDegen,
    isPlaying,
    
    // Statistics
    gameStats,
    
    // Custom configuration
    customMode,
    setCustomMode,
    customRows,
    setCustomRows,
    customBuckets,
    setCustomBuckets,
    
    // Pool restrictions
    maxMultiplierForPool,
    maxWagerForPool,
    maxPayout,
    poolExceeded,
    
    // Graphics and mobile
    settings,
    mobile,
    
    // Multi-ball
    ballCount,
    setBallCount,
    
    // Controls
    showControls,
    setShowControls,
    
    // Bucket scoreboard
    activeBuckets,
    setActiveBuckets,
    bucketHits,
    setBucketHits,
    recentHits,
    setRecentHits,
    
    // Effects
    triggerWinFlash,
    triggerScreenShake,
    
    // Game logic
    rows,
    buckets,
    bet,
    multipliers,
    play,
    resetGame
  }
}