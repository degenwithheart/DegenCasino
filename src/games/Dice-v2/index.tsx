import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React, { useRef, useState, useCallback, useEffect } from 'react'
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import { BET_ARRAYS_V2 } from '../rtpConfig-v2'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, DesktopControls } from '../../components'
import { SOUND_LOSE, SOUND_PLAY, SOUND_TICK, SOUND_WIN } from './constants'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'

// Canvas-based lucky number display game configuration
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const NUMBER_DISPLAY_SIZE = 200
const ANIMATION_DURATION = 2500 // Faster animation for more numbers
const PARTICLE_COUNT = 50

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

interface LuckyNumberState {
  currentNumber: number
  targetNumber: number
  isAnimating: boolean
  animationProgress: number
  particles: Particle[]
  randomSequence: number[]
  currentSequenceIndex: number
}

export default function DiceV2() {
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const pool = useCurrentPool()
  const [resultIndex, setResultIndex] = useState(-1)
  const [rollUnderIndex, setRollUnderIndex] = useState(Math.floor(100 / 2))
  const [isDraggingSlider, setIsDraggingSlider] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [lastGameResult, setLastGameResult] = useState<'win' | 'lose' | null>(null)
  const [totalProfit, setTotalProfit] = useState(0)
  const [gameCount, setGameCount] = useState(0)
  const [winCount, setWinCount] = useState(0)

  const updateSliderValue = useCallback((canvasX: number, canvasWidth: number) => {
    // Slider bounds in canvas coordinates
    const sliderLeft = 100
    const sliderRight = CANVAS_WIDTH - 100
    const sliderWidth = sliderRight - sliderLeft

    if (canvasX >= sliderLeft && canvasX <= sliderRight) {
      const percentage = (canvasX - sliderLeft) / sliderWidth
      const newValue = Math.max(1, Math.min(99, Math.round(percentage * 98) + 1))
      setRollUnderIndex(newValue)
    }
  }, [])

  // Slider interaction handlers
  const handleCanvasMouseDown = useCallback((event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    if (!rect) return

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Calculate scaling to match canvas rendering
    const scaleX = rect.width / CANVAS_WIDTH
    const scaleY = rect.height / CANVAS_HEIGHT
    const scale = Math.min(scaleX, scaleY)

    // Center the canvas
    const offsetX = (rect.width - CANVAS_WIDTH * scale) / 2
    const offsetY = (rect.height - CANVAS_HEIGHT * scale) / 2

    // Convert DOM coordinates to canvas coordinates
    const canvasX = (x - offsetX) / scale
    const canvasY = (y - offsetY) / scale

    // Check if click is on slider area (using canvas coordinates)
    const sliderY = CANVAS_HEIGHT - 120
    const sliderHeight = 60

    // Don't allow slider interaction during gameplay
    if (gamba.isPlaying || luckyNumberState.isAnimating) return

    if (canvasY >= sliderY && canvasY <= sliderY + sliderHeight) {
      setIsDraggingSlider(true)
      updateSliderValue(canvasX, CANVAS_WIDTH)
    }
  }, [])

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDraggingSlider) return

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    if (!rect) return

    const x = event.clientX - rect.left

    // Calculate scaling to match canvas rendering
    const scaleX = rect.width / CANVAS_WIDTH
    const scaleY = rect.height / CANVAS_HEIGHT
    const scale = Math.min(scaleX, scaleY)

    // Center the canvas
    const offsetX = (rect.width - CANVAS_WIDTH * scale) / 2

    // Convert DOM coordinates to canvas coordinates
    const canvasX = (x - offsetX) / scale

    updateSliderValue(canvasX, CANVAS_WIDTH)
  }, [isDraggingSlider])

  const handleCanvasMouseUp = useCallback(() => {
    setIsDraggingSlider(false)
  }, [])

  const handleCanvasTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault()
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    if (!rect) return

    const touch = event.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    // Calculate scaling to match canvas rendering
    const scaleX = rect.width / CANVAS_WIDTH
    const scaleY = rect.height / CANVAS_HEIGHT
    const scale = Math.min(scaleX, scaleY)

    // Center the canvas
    const offsetX = (rect.width - CANVAS_WIDTH * scale) / 2
    const offsetY = (rect.height - CANVAS_HEIGHT * scale) / 2

    // Convert DOM coordinates to canvas coordinates
    const canvasX = (x - offsetX) / scale
    const canvasY = (y - offsetY) / scale

    // Check if touch is on slider area (using canvas coordinates)
    const sliderY = CANVAS_HEIGHT - 120
    const sliderHeight = 60

    // Don't allow slider interaction during gameplay
    if (gamba.isPlaying || luckyNumberState.isAnimating) return

    if (canvasY >= sliderY && canvasY <= sliderY + sliderHeight) {
      setIsDraggingSlider(true)
      updateSliderValue(canvasX, CANVAS_WIDTH)
    }
  }, [])

  const handleCanvasTouchMove = useCallback((event: React.TouchEvent) => {
    event.preventDefault()
    if (!isDraggingSlider) return

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    if (!rect) return

    const touch = event.touches[0]
    const x = touch.clientX - rect.left

    // Calculate scaling to match canvas rendering
    const scaleX = rect.width / CANVAS_WIDTH
    const scaleY = rect.height / CANVAS_HEIGHT
    const scale = Math.min(scaleX, scaleY)

    // Center the canvas
    const offsetX = (rect.width - CANVAS_WIDTH * scale) / 2

    // Convert DOM coordinates to canvas coordinates
    const canvasX = (x - offsetX) / scale

    updateSliderValue(canvasX, CANVAS_WIDTH)
  }, [isDraggingSlider])

  const handleCanvasTouchEnd = useCallback((event: React.TouchEvent) => {
    event.preventDefault()
    setIsDraggingSlider(false)
  }, [])
  const [luckyNumberState, setLuckyNumberState] = useState<LuckyNumberState>({
    currentNumber: 0,
    targetNumber: 0,
    isAnimating: false,
    animationProgress: 0,
    particles: [],
    randomSequence: [],
    currentSequenceIndex: 0
  })

  // Get graphics settings
  const { settings } = useGraphics()

  // Quality-based settings
  const shouldRenderParticles = settings.quality !== 'low'
  const shouldRenderRunes = settings.quality === 'high' || settings.quality === 'ultra'
  const shouldRenderMysticalCircles = settings.quality !== 'low'
  const particleCount = settings.quality === 'ultra' ? PARTICLE_COUNT : 
                       settings.quality === 'high' ? Math.floor(PARTICLE_COUNT * 0.75) :
                       settings.quality === 'medium' ? Math.floor(PARTICLE_COUNT * 0.5) : 0

  // Accessibility settings
  const enableEffects = settings.enableEffects
  const enableMotion = settings.enableMotion

  // Effects system
  const effectsRef = useRef<GameplayEffectsRef>(null)

  // Canvas animation frame
  const animationFrameRef = useRef<number>()
  const animationStartTimeRef = useRef<number>(0)

  const sounds = useSound({
    win: SOUND_WIN,
    play: SOUND_PLAY,
    lose: SOUND_LOSE,
    tick: SOUND_TICK,
  })

  const odds = Math.floor((rollUnderIndex / 100) * 100)
  const multiplier = Number(BigInt(100 * BPS_PER_WHOLE) / BigInt(rollUnderIndex)) / BPS_PER_WHOLE

  const bet = React.useMemo(() => BET_ARRAYS_V2['dice-v2'].calculateBetArray(), [rollUnderIndex])

  const maxWin = multiplier * wager

  const game = GambaUi.useGame()

  // Initialize lucky number state
  useEffect(() => {
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
  }, [])

  // Animation loop for lucky number and particles
  const animate = useCallback((currentTime: number) => {
    // Skip animation if motion is disabled
    if (!enableMotion) return

    if (animationStartTimeRef.current === 0) {
      animationStartTimeRef.current = currentTime
    }

    const elapsed = currentTime - animationStartTimeRef.current
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1)

    // Calculate which number to show based on elapsed time
    // Show a new number every 80ms for a more visible animation
    const numberDuration = 80 // ms per number
    const totalNumbers = 20
    const currentNumberIndex = Math.min(
      Math.floor(elapsed / numberDuration),
      totalNumbers - 1
    )

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
  }, [enableMotion])

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

  // Canvas render function
  const renderCanvas = useCallback(({ ctx, size }: any, clock: any) => {
    // Clear canvas
    ctx.clearRect(0, 0, size.width, size.height)

    // Use current time for animation instead of relying on clock parameter
    const currentTime = performance.now()
    const animationTime = currentTime * 0.001 // Convert to seconds for smoother animation

    // Draw full-screen background first (before any transformations)
    const backgroundGradient = ctx.createRadialGradient(
      size.width / 2, size.height / 2, 0,
      size.width / 2, size.height / 2, Math.max(size.width, size.height) / 2
    )

    // Determine background color based on game state
    const isShowingResult = lastGameResult !== null && !luckyNumberState.isAnimating

    if (isShowingResult && lastGameResult === 'win') {
      // Green background for win
      backgroundGradient.addColorStop(0, '#1a2e1a')  // Dark green center
      backgroundGradient.addColorStop(0.5, '#2e4a2e') // Medium green
      backgroundGradient.addColorStop(1, '#0f230f')   // Dark green edge
    } else if (isShowingResult && lastGameResult === 'lose') {
      // Red background for loss
      backgroundGradient.addColorStop(0, '#2e1a1a')  // Dark red center
      backgroundGradient.addColorStop(0.5, '#4a2e2e') // Medium red
      backgroundGradient.addColorStop(1, '#230f0f')   // Dark red edge
    } else {
      // Black background for idle and playing states
      backgroundGradient.addColorStop(0, '#1a1a2e')
      backgroundGradient.addColorStop(0.5, '#16213e')
      backgroundGradient.addColorStop(1, '#0f0f23')
    }

    ctx.fillStyle = backgroundGradient
    ctx.fillRect(0, 0, size.width, size.height)

    // Romantic degen background elements
    ctx.save()
    ctx.globalAlpha = 0.15

    // Large romantic dice symbol (top-left)
    ctx.fillStyle = 'rgba(212, 165, 116, 0.3)'
    ctx.font = '120px serif'
    ctx.textAlign = 'center'
    ctx.save()
    ctx.translate(size.width * 0.12, size.height * 0.15)
    ctx.rotate(-15 * Math.PI / 180)
    ctx.fillText('⚃', 0, 0)
    ctx.restore()

    // Large romantic dice symbol (bottom-right)
    ctx.fillStyle = 'rgba(184, 51, 106, 0.25)'
    ctx.font = '100px serif'
    ctx.save()
    ctx.translate(size.width * 0.88, size.height * 0.85)
    ctx.rotate(25 * Math.PI / 180)
    ctx.fillText('⚄', 0, 0)
    ctx.restore()

    // Medium romantic dice symbols
    ctx.fillStyle = 'rgba(139, 90, 158, 0.2)'
    ctx.font = '60px serif'
    ctx.save()
    ctx.translate(size.width * 0.75, size.height * 0.25)
    ctx.rotate(45 * Math.PI / 180)
    ctx.fillText('⚂', 0, 0)
    ctx.restore()

    ctx.save()
    ctx.translate(size.width * 0.25, size.height * 0.75)
    ctx.rotate(-30 * Math.PI / 180)
    ctx.fillText('⚁', 0, 0)
    ctx.restore()

    // Small romantic dice symbols scattered
    ctx.fillStyle = 'rgba(212, 165, 116, 0.15)'
    ctx.font = '40px serif'
    const smallDice = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
    for (let i = 0; i < 8; i++) {
      const x = (i * size.width) / 8 + size.width / 16
      const y = size.height * 0.3 + Math.sin(i * 0.8) * 60
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((i * 45) * Math.PI / 180)
      ctx.fillText(smallDice[i % smallDice.length], 0, 0)
      ctx.restore()
    }

    ctx.restore()

    // Calculate scaling to fit canvas in container
    const scaleX = size.width / CANVAS_WIDTH
    const scaleY = size.height / CANVAS_HEIGHT
    const scale = Math.min(scaleX, scaleY)

    // Center the canvas
    const offsetX = (size.width - CANVAS_WIDTH * scale) / 2
    const offsetY = (size.height - CANVAS_HEIGHT * scale) / 2

    ctx.save()
    ctx.translate(offsetX, offsetY)
    ctx.scale(scale, scale)

    // Draw mystical background elements (conditional based on quality)
    if (shouldRenderMysticalCircles) {
      ctx.strokeStyle = 'rgba(138, 43, 226, 0.3)'
      ctx.lineWidth = 2
      for (let i = 0; i < 8; i++) {
        // Use static positions if motion is disabled
        const angle = enableMotion ? (animationTime * 1 + i * Math.PI / 4) % (Math.PI * 2) : (i * Math.PI / 4)
        const radius = enableMotion ? 150 + Math.sin(animationTime * 2 + i) * 50 : 150
        const x = CANVAS_WIDTH / 2 + Math.cos(angle) * radius
        const y = CANVAS_HEIGHT / 2 + Math.sin(angle) * radius

        ctx.beginPath()
        ctx.arc(x, y, 30 + i * 10, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // Draw floating runes/symbols (conditional based on quality)
    if (shouldRenderRunes) {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.6)'
      ctx.font = '24px serif'
      ctx.textAlign = 'center'
      const runes = ['✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰']
      for (let i = 0; i < 10; i++) {
        // Use static positions if motion is disabled
        const baseAngle = i * Math.PI / 5
        const x = enableMotion ? 
          Math.sin(animationTime * 0.1 + i) * 200 + CANVAS_WIDTH / 2 : 
          Math.cos(baseAngle) * 200 + CANVAS_WIDTH / 2
        const y = enableMotion ? 
          Math.cos(animationTime * 0.1 + i) * 150 + CANVAS_HEIGHT / 2 : 
          Math.sin(baseAngle) * 150 + CANVAS_HEIGHT / 2
        ctx.save()
        ctx.translate(x, y)
        const rotation = enableMotion ? animationTime * 1.5 + i : i * 0.5
        ctx.rotate(rotation)
        ctx.fillText(runes[i % runes.length], 0, 0)
        ctx.restore()
      }
    }

    // Draw particles (conditional based on quality and effects)
    if (shouldRenderParticles && enableEffects) {
      luckyNumberState.particles.forEach(particle => {
        const alpha = particle.life / particle.maxLife
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }

    // Draw lucky number display
    const centerX = CANVAS_WIDTH / 2
    const centerY = CANVAS_HEIGHT / 2

    // Outer glow ring
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, NUMBER_DISPLAY_SIZE / 2 + 20)
    glowGradient.addColorStop(0, 'rgba(212, 165, 116, 0.8)')
    glowGradient.addColorStop(1, 'rgba(212, 165, 116, 0)')
    ctx.fillStyle = glowGradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, NUMBER_DISPLAY_SIZE / 2 + 20, 0, Math.PI * 2)
    ctx.fill()

    // Main number circle
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(centerX, centerY, NUMBER_DISPLAY_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()

    // Number circle border
    ctx.strokeStyle = '#d4a574'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(centerX, centerY, NUMBER_DISPLAY_SIZE / 2, 0, Math.PI * 2)
    ctx.stroke()

    // Inner mystical ring
    ctx.strokeStyle = 'rgba(139, 90, 158, 0.6)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, NUMBER_DISPLAY_SIZE / 2 - 10, 0, Math.PI * 2)
    ctx.stroke()

    // Display number
    let displayNumber = 0 // Default to 0 when no game is active
    if (luckyNumberState.isAnimating) {
      // Show animation numbers or target number during animation
      if (luckyNumberState.randomSequence.length > 0 && luckyNumberState.currentSequenceIndex < luckyNumberState.randomSequence.length) {
        displayNumber = luckyNumberState.randomSequence[luckyNumberState.currentSequenceIndex]
      } else if (luckyNumberState.targetNumber > 0) {
        displayNumber = luckyNumberState.targetNumber
      } else if (resultIndex >= 0) {
        displayNumber = resultIndex
      }
    } else if (luckyNumberState.targetNumber > 0) {
      // Show final result when animation is complete
      displayNumber = luckyNumberState.targetNumber
    } else if (resultIndex >= 0) {
      // Show result when available
      displayNumber = resultIndex
    }

    ctx.fillStyle = '#d4a574'
    ctx.font = `bold ${NUMBER_DISPLAY_SIZE * 0.4}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(displayNumber.toString(), centerX, centerY)

    // Draw "LUCKY NUMBER" label
    ctx.fillStyle = 'rgba(212, 165, 116, 0.8)'
    ctx.font = 'bold 18px Arial'
    ctx.fillText('LUCKY NUMBER', centerX, centerY + NUMBER_DISPLAY_SIZE / 2 + 30)

    // Draw canvas slider
    const sliderY = CANVAS_HEIGHT - 100
    const sliderLeft = 100
    const sliderRight = CANVAS_WIDTH - 100
    const sliderWidth = sliderRight - sliderLeft
    const sliderHeight = 8
    const handleRadius = 15

    // Slider track
    const trackGradient = ctx.createLinearGradient(sliderLeft, sliderY, sliderRight, sliderY)
    trackGradient.addColorStop(0, '#d4a574')
    trackGradient.addColorStop(1, '#b8336a')
    ctx.fillStyle = trackGradient
    ctx.fillRect(sliderLeft, sliderY - sliderHeight / 2, sliderWidth, sliderHeight)

    // Slider track border
    ctx.strokeStyle = 'rgba(212, 165, 116, 0.5)'
    ctx.lineWidth = 2
    ctx.strokeRect(sliderLeft, sliderY - sliderHeight / 2, sliderWidth, sliderHeight)

    // Slider handle position
    const handleX = sliderLeft + ((rollUnderIndex - 1) / 98) * sliderWidth

    // Slider handle
    const handleGradient = ctx.createRadialGradient(handleX, sliderY, 0, handleX, sliderY, handleRadius)
    handleGradient.addColorStop(0, '#f4e9e1')
    handleGradient.addColorStop(1, '#d4a574')
    ctx.fillStyle = handleGradient
    ctx.beginPath()
    ctx.arc(handleX, sliderY, handleRadius, 0, Math.PI * 2)
    ctx.fill()

    // Slider handle border
    ctx.strokeStyle = '#d4a574'
    ctx.lineWidth = 3
    ctx.stroke()

    // Slider labels
    ctx.fillStyle = 'rgba(244, 233, 225, 0.9)'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('1', sliderLeft, sliderY - 35)
    ctx.textAlign = 'right'
    ctx.fillText('99', sliderRight, sliderY - 35)
    ctx.textAlign = 'center'
    ctx.fillText('Roll Under', centerX, sliderY - 25)

    // Current value display
    ctx.fillStyle = '#d4a574'
    ctx.font = 'bold 20px Arial'
    ctx.fillText(rollUnderIndex.toString(), handleX, sliderY + 35)

    // Draw roll under target
    if (rollUnderIndex > 0) {
      ctx.fillStyle = 'rgba(244, 233, 225, 0.9)'
      ctx.font = 'bold 20px Arial'
      ctx.fillText(`Roll Under: ${rollUnderIndex}`, centerX, 50)
    }

    ctx.restore()
  }, [luckyNumberState, rollUnderIndex, hasPlayed, gamba.isPlaying, lastGameResult, resultIndex, shouldRenderParticles, shouldRenderRunes, shouldRenderMysticalCircles, enableEffects, enableMotion])

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
    const betArray = BET_ARRAYS_V2['dice-v2'].calculateBetArray()

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
      luckyNumber = rollUnderIndex + Math.floor(rng() * (100 - rollUnderIndex))
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
        if (enableEffects) {
          effectsRef.current?.winFlash('#00ff00', 1.5)
          createParticleBurst(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '#ffd700')
          effectsRef.current?.screenShake(1, 600)
        }
      } else {
        sounds.play('lose')
        if (enableEffects) {
          effectsRef.current?.loseFlash('#ff4444', 0.8)
          createParticleBurst(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '#ff6b6b')
          effectsRef.current?.screenShake(0.5, 400)
        }
      }
    }, effectsDelay)
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

  // Reset animation timing when animation starts
  useEffect(() => {
    if (luckyNumberState.isAnimating && animationStartTimeRef.current === 0) {
      animationStartTimeRef.current = performance.now()
    }
  }, [luckyNumberState.isAnimating])

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'linear-gradient(135deg, #0a0511 0%, #0d0618 25%, #0f081c 50%, #0a0511 75%, #0a0511 100%)',
          perspective: '100px'
        }}>
          {/* Header Stats */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1,
            background: 'linear-gradient(135deg, rgba(10, 5, 17, 0.85) 0%, rgba(139, 90, 158, 0.15) 50%, rgba(10, 5, 17, 0.85) 100%)',
            padding: '15px',
            borderRadius: '16px',
            border: '1px solid rgba(212, 165, 116, 0.3)',
            boxShadow: '0 8px 32px rgba(10, 5, 17, 0.4), inset 0 1px 0 rgba(212, 165, 116, 0.2)',
            backdropFilter: 'blur(16px)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4a574' }}>
                Dice v2
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(212, 165, 116, 0.8)' }}>
                Roll Under • {(rollUnderIndex / 100 * 100).toFixed(0)}% • {multiplier.toFixed(2)}x
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d4a574' }}>
                {gameCount}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(212, 165, 116, 0.8)' }}>Games</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4caf50' }}>
                {winCount}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(212, 165, 116, 0.8)' }}>Wins</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f44336' }}>
                {gameCount - winCount}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(212, 165, 116, 0.8)' }}>Losses</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: winCount > (gameCount - winCount) ? '#4caf50' : winCount < (gameCount - winCount) ? '#f44336' : '#d4a574' 
              }}>
                {(() => {
                  const losses = gameCount - winCount
                  if (winCount === 0 && losses === 0) return '0.00'
                  if (losses === 0) return '+∞'
                  const ratio = winCount / losses
                  const prefix = ratio >= 1 ? '+' : '-'
                  return `${prefix}${ratio.toFixed(2)}`
                })()}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(212, 165, 116, 0.8)' }}>W/L Ratio</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: totalProfit > 0 ? '#4caf50' : totalProfit < 0 ? '#f44336' : '#d4a574' }}>
                <TokenValue amount={totalProfit} />
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(212, 165, 116, 0.8)' }}>Session Profit</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <EnhancedPlayButton
                onClick={resetSession}
                disabled={gamba.isPlaying}
              >
                Reset
              </EnhancedPlayButton>
            </div>
          </div>

          {/* Canvas Game Area */}
          <div style={{
            position: 'absolute',
            top: '120px',
            left: '20px',
            right: '20px',
            bottom: '20px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '2px solid rgba(212, 165, 116, 0.4)'
          }}>
            <GambaUi.Canvas
              style={{
                width: '100%',
                height: '100%',
                cursor: gamba.isPlaying || luckyNumberState.isAnimating ? 'not-allowed' : (isDraggingSlider ? 'grabbing' : 'grab')
              }}
              render={renderCanvas}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              onTouchStart={handleCanvasTouchStart}
              onTouchMove={handleCanvasTouchMove}
              onTouchEnd={handleCanvasTouchEnd}
            />
          </div>

          <GameplayFrame
            ref={effectsRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 1000
            }}
            {...(useGameMeta('dice') && {
              title: useGameMeta('dice')!.name,
              description: useGameMeta('dice')!.description
            })}
          />
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={hasPlayed ? resetGame : play}
          playDisabled={gamba.isPlaying || (!hasPlayed && luckyNumberState.isAnimating)}
          playText={hasPlayed ? "New Game" : "Roll Lucky Number"}
        />

        <DesktopControls
          wager={wager}
          setWager={setWager}
          onPlay={hasPlayed ? resetGame : play}
          playDisabled={gamba.isPlaying || (!hasPlayed && luckyNumberState.isAnimating)}
          playText={hasPlayed ? "New Game" : "Roll Lucky Number"}
        />
      </GambaUi.Portal>
    </>
  )
}
