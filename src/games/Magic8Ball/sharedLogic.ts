import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { GambaUi, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import { useState, useCallback, useEffect, useRef } from 'react'
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import { BET_ARRAYS_V2 } from '../rtpConfig-v2'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameStats } from '../../hooks/game/useGameStats'
import { SOUND_LOSE, SOUND_PLAY, SOUND_TICK, SOUND_WIN } from './constants'

// Canvas-based lucky number display game configuration
export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 600
export const NUMBER_DISPLAY_SIZE = 200
export const ANIMATION_DURATION = 2500 // Faster animation for more numbers
export const PARTICLE_COUNT = 50

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export interface LuckyNumberState {
  currentNumber: number
  targetNumber: number
  isAnimating: boolean
  animationProgress: number
  particles: Particle[]
  randomSequence: number[]
  currentSequenceIndex: number
}

export const useMagic8BallGameLogic = () => {
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const pool = useCurrentPool()
  const [resultIndex, setResultIndex] = useState(-1)
  const [rollUnderIndex, setRollUnderIndex] = useState(7)
  const [isDraggingSlider, setIsDraggingSlider] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [lastGameResult, setLastGameResult] = useState<'win' | 'lose' | null>(null)

  // Game statistics tracking - using centralized hook
  const gameStats = useGameStats('magic8ball')

  const [totalProfit, setTotalProfit] = useState(0)
  const [gameCount, setGameCount] = useState(0)
  const [winCount, setWinCount] = useState(0)

  // Lucky number state for animation
  const [luckyNumberState, setLuckyNumberState] = useState<LuckyNumberState>({
    currentNumber: 0,
    targetNumber: 0,
    isAnimating: false,
    animationProgress: 0,
    particles: [],
    randomSequence: [],
    currentSequenceIndex: 0
  })

  // Animation refs
  const animationFrameRef = useRef<number>()
  const animationStartTimeRef = useRef<number>(0)

  // Graphics settings
  const { settings } = useGraphics()
  const { 
    enableMotion = true, 
    enableEffects = true, 
    quality = 'high'
  } = settings
  
  const particleCountSetting = 'medium' // Default particle count setting

  // Calculate effective particle count based on settings
  const particleCount = enableEffects ? Math.floor(PARTICLE_COUNT * 0.6) : 0

  const shouldRenderParticles = enableEffects && particleCount > 0
  const shouldRenderRunes = enableEffects && (quality === 'high' || quality === 'ultra')
  const shouldRenderMysticalCircles = enableEffects && (quality === 'medium' || quality === 'high' || quality === 'ultra')

  // Sound effects
  const sounds = useSound({
    play: SOUND_PLAY,
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    tick: SOUND_TICK,
  })

  // Calculate multiplier
  const multiplier = Number(BigInt(BET_ARRAYS_V2['magic8ball'].OUTCOMES * BPS_PER_WHOLE) / BigInt(rollUnderIndex)) / BPS_PER_WHOLE

  // Calculate if pool will be exceeded
  const maxPayout = wager * multiplier
  const poolExceeded = maxPayout > (pool?.maxPayout ?? 0)

  const updateSliderValue = useCallback((canvasX: number, canvasWidth: number) => {
    // Slider bounds in canvas coordinates
    const sliderLeft = 100
    const sliderRight = CANVAS_WIDTH - 100
    const sliderWidth = sliderRight - sliderLeft

    if (canvasX >= sliderLeft && canvasX <= sliderRight) {
      const percentage = (canvasX - sliderLeft) / sliderWidth
      const newValue = Math.max(1, Math.min(BET_ARRAYS_V2['magic8ball'].OUTCOMES - 1, Math.round(percentage * (BET_ARRAYS_V2['magic8ball'].OUTCOMES - 2)) + 1))
      setRollUnderIndex(newValue)
    }
  }, [])

  // Animation logic
  const animate = useCallback((timestamp: number) => {
    if (animationStartTimeRef.current === 0) {
      animationStartTimeRef.current = timestamp
    }

    const elapsed = timestamp - animationStartTimeRef.current
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1)

    const totalNumbers = luckyNumberState.randomSequence.length
    const currentNumberIndex = Math.floor(progress * totalNumbers)

    setLuckyNumberState(prev => {
      // Update particles (only if effects are enabled)
      const newParticles = enableEffects ? prev.particles.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 1,
        vy: particle.vy + 0.1 // gravity
      })).filter(particle => particle.life > 0) : []

      // Check if animation is complete
      const isComplete = progress >= 1 || currentNumberIndex >= totalNumbers - 1

      if (isComplete) {
        // Animation complete
        return {
          ...prev,
          isAnimating: false,
          animationProgress: 1,
          particles: newParticles,
          currentSequenceIndex: totalNumbers - 1
        }
      }

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animate)

      return {
        ...prev,
        animationProgress: progress,
        particles: newParticles,
        currentSequenceIndex: currentNumberIndex
      }
    })
  }, [ANIMATION_DURATION, enableMotion, enableEffects, shouldRenderParticles])

  // Start lucky number animation with cycling random numbers
  const startLuckyNumberAnimation = useCallback((targetNumber: number) => {
    // If motion is disabled (static mode), skip animation and show result immediately
    if (!enableMotion) {
      setLuckyNumberState(prev => ({
        ...prev,
        targetNumber,
        isAnimating: false,
        animationProgress: 1,
        particles: [],
        randomSequence: [targetNumber],
        currentSequenceIndex: 0
      }))
      return
    }

    // Generate sequence of random numbers for 8-ball style animation
    const sequence: number[] = []
    const totalNumbers = 20 // Show 20 random numbers before the result

    // Add random numbers first (excluding the target number to avoid spoilers)
    for (let i = 0; i < totalNumbers - 1; i++) {
      let randomNum
      do {
        randomNum = Math.floor(Math.random() * 100)
      } while (randomNum === targetNumber) // Avoid showing the result early
      sequence.push(randomNum)
    }

    // Add the actual result at the end
    sequence.push(targetNumber)

    setLuckyNumberState({
      currentNumber: 0,
      targetNumber,
      isAnimating: true,
      animationProgress: 0,
      particles: [],
      randomSequence: sequence,
      currentSequenceIndex: 0
    })

    // Reset timing and start animation
    animationStartTimeRef.current = 0
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [enableMotion, animate])

  // Create particle burst effect
  const createParticleBurst = useCallback((x: number, y: number, color: string) => {
    if (!shouldRenderParticles || particleCount === 0) return

    const newParticles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 5,
        life: 60 + Math.random() * 60,
        maxLife: 120,
        color,
        size: 2 + Math.random() * 4
      })
    }

    setLuckyNumberState(prev => ({
      ...prev,
      particles: [...prev.particles, ...newParticles]
    }))
  }, [shouldRenderParticles, particleCount])

  // Game instance
  const game = GambaUi.useGame()

  const play = async () => {
    if (wager <= 0) {
      console.error('❌ BLOCKED: Cannot play with zero wager')
      return
    }

    // Reset game state for new game
    setHasPlayed(false)
    setResultIndex(-1)
    setLastGameResult(null)

    // Reset lucky number state
    setLuckyNumberState(prev => ({
      ...prev,
      currentNumber: 0,
      targetNumber: 0,
      isAnimating: false,
      animationProgress: 0,
      particles: [],
      randomSequence: [],
      currentSequenceIndex: 0
    }))

    // Reset animation timing
    animationStartTimeRef.current = 0
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = undefined
    }

    sounds.play('play')

    // Use RTP config to get the bet array
    const betArray = BET_ARRAYS_V2['magic8ball'].calculateBetArray()

    console.log('🎲 BET ARRAY DEBUG:', {
      rollUnderIndex,
      betArray: betArray.slice(0, 10), // Show first 10 elements
      nonZeroCount: betArray.filter(x => x > 0).length,
      maxBet: Math.max(...betArray),
      wager
    })

    await game.play({ wager, bet: betArray })

    const result = await game.result()
    const win = result.payout > 0

    // Store the game result for background color
    setLastGameResult(win ? 'win' : 'lose')

    // Generate deterministic lucky number using RTP config logic
    const seed = `${result.resultIndex}:${result.payout}:${result.multiplier}:${rollUnderIndex}`
    const rng = makeDeterministicRng(seed)

    let luckyNumber: number
    if (win) {
      // Winning numbers are below rollUnderIndex
      luckyNumber = Math.floor(rng() * rollUnderIndex)
    } else {
      // Losing numbers are rollUnderIndex and above
      luckyNumber = rollUnderIndex + Math.floor(rng() * (BET_ARRAYS_V2['magic8ball'].OUTCOMES - rollUnderIndex))
    }

    console.log('🎲 DICE RESULT:', {
      resultIndex: result.resultIndex,
      payout: result.payout,
      multiplier: result.multiplier,
      win,
      rollUnderIndex,
      luckyNumber,
      seed
    })

    // Set result index for display
    setResultIndex(luckyNumber)

    // Update comprehensive game statistics
    const profit = result.payout - wager
    gameStats.updateStats(profit)

    // Start lucky number animation with a small delay to ensure state is ready
    // If motion is disabled, skip the delay and show result immediately
    const animationDelay = enableMotion ? 50 : 0
    setTimeout(() => startLuckyNumberAnimation(luckyNumber), animationDelay)

    // Handle win/lose effects after animation and mark game as played
    // If motion is disabled, use shorter timeout since animation completes immediately
    const effectsDelay = enableMotion ? ANIMATION_DURATION + 100 : 100
    setTimeout(() => {
      setHasPlayed(true)
      
      // Update session statistics
      setGameCount(prev => prev + 1)
      setTotalProfit(prev => prev + (result.payout - wager))
      if (win) {
        setWinCount(prev => prev + 1)
      }

      console.log('🎲 ANIMATION COMPLETE - Final result:', luckyNumber)

      if (win) {
        sounds.play('win')
      } else {
        sounds.play('lose')
      }
    }, effectsDelay)

    return { win, luckyNumber, result }
  }

  // Reset game to allow new wager
  const resetGame = () => {
    setHasPlayed(false)
    setResultIndex(-1)
    setLastGameResult(null)
    setLuckyNumberState(prev => ({
      ...prev,
      currentNumber: 0,
      targetNumber: 0,
      isAnimating: false,
      animationProgress: 0,
      particles: [],
      randomSequence: [],
      currentSequenceIndex: 0
    }))
    // Reset animation timing
    animationStartTimeRef.current = 0
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = undefined
    }
  }

  // Reset session statistics
  const resetSession = () => {
    setTotalProfit(0)
    setGameCount(0)
    setWinCount(0)
    resetGame()
  }

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return {
    // Game state
    wager,
    setWager,
    resultIndex,
    rollUnderIndex,
    setRollUnderIndex,
    isDraggingSlider,
    setIsDraggingSlider,
    hasPlayed,
    lastGameResult,
    gameStats,
    totalProfit,
    gameCount,
    winCount,
    luckyNumberState,
    setLuckyNumberState,
    
    // Game mechanics
    play,
    resetGame,
    resetSession,
    updateSliderValue,
    createParticleBurst,
    
    // Computed values
    multiplier,
    poolExceeded,
    
    // Graphics settings
    enableMotion,
    enableEffects,
    shouldRenderParticles,
    shouldRenderRunes,
    shouldRenderMysticalCircles,
    particleCount,
    
    // Game state checks
    isPlaying: gamba.isPlaying,
    isAnimating: luckyNumberState.isAnimating,
    
    // Sound effects
    sounds,
    
    // Pool info
    pool
  }
}