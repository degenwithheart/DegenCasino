import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React, { useRef, useState, useCallback, useEffect } from 'react'
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import { BET_ARRAYS_V3 } from '../rtpConfig-v3'
import { EnhancedWagerInput, MobileControls, DesktopControls, GameControlsSection, GameRecentPlaysHorizontal } from '../../components'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import { useGameStats } from '../../hooks/game/useGameStats'
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
  currentNumber: number | string
  targetNumber: number | string
  isAnimating: boolean
  animationProgress: number
  particles: Particle[]
  randomSequence: (number | string)[]
  currentSequenceIndex: number
}

export default function Magic8BallRenderer2D() {
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const pool = useCurrentPool()
  const [resultIndex, setResultIndex] = useState(-1)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [lastGameResult, setLastGameResult] = useState<'win' | 'lose' | null>(null)

  // Game statistics tracking - using centralized hook
  const gameStats = useGameStats('magic8ball')
  const [totalProfit, setTotalProfit] = useState(0)
  const [gameCount, setGameCount] = useState(0)
  const [winCount, setWinCount] = useState(0)
  const { mobile: isMobile } = useIsCompact()




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

  // Magic 8-Ball 50/50 configuration
  const multiplier = (BET_ARRAYS_V3 as any)['magic8ball'].getMultiplier()
  const bet = React.useMemo(() => (BET_ARRAYS_V3 as any)['magic8ball'].calculateBetArray(), [])
  const maxWin = multiplier * wager

  // Pool restrictions
  const maxWagerForPool = React.useMemo(() => {
    return pool.maxPayout / multiplier
  }, [pool.maxPayout, multiplier])

  const poolExceeded = maxWin > pool.maxPayout

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
  const startLuckyNumberAnimation = useCallback((targetNumber: number | string) => {
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

    // Generate sequence showing "Thinking..." during animation
    const sequence: (number | string)[] = []
    const totalNumbers = 20 // Show "Thinking..." 20 times before the result
    const targetText = typeof targetNumber === 'string' ? targetNumber : (targetNumber === 1 ? 'Win' : 'Lose')

    // Add "Thinking..." for all animation frames except the last
    for (let i = 0; i < totalNumbers - 1; i++) {
      sequence.push('Thinking...')
    }

    // Add the actual result at the end
    sequence.push(targetText)

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

    // Use consistent background color for all states
    backgroundGradient.addColorStop(0, '#1a1a2e')
    backgroundGradient.addColorStop(0.5, '#16213e')
    backgroundGradient.addColorStop(1, '#0f0f23')

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

    // Display text
    let displayText = '-' // Default when no game is active
    if (luckyNumberState.isAnimating) {
      // Show animation sequence during animation
      if (luckyNumberState.randomSequence.length > 0 && luckyNumberState.currentSequenceIndex < luckyNumberState.randomSequence.length) {
        displayText = luckyNumberState.randomSequence[luckyNumberState.currentSequenceIndex].toString()
      } else if (luckyNumberState.targetNumber !== 0 && luckyNumberState.targetNumber !== '') {
        displayText = luckyNumberState.targetNumber.toString()
      } else {
        displayText = 'Thinking...'
      }
    } else if (luckyNumberState.targetNumber !== 0 && luckyNumberState.targetNumber !== '') {
      // Show final result when animation is complete
      displayText = luckyNumberState.targetNumber.toString()
    } else if (hasPlayed && resultIndex >= 0) {
      // Show result when available
      displayText = resultIndex === 1 ? 'Win' : 'Lose'
    } else if (gamba.isPlaying) {
      // Show "Thinking..." while game is processing
      displayText = 'Thinking...'
    }

    ctx.fillStyle = '#d4a574'
    ctx.font = `bold ${NUMBER_DISPLAY_SIZE * 0.25}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(displayText, centerX, centerY)

    ctx.restore()
  }, [luckyNumberState, hasPlayed, gamba.isPlaying, lastGameResult, resultIndex, shouldRenderParticles, shouldRenderRunes, shouldRenderMysticalCircles, enableEffects, enableMotion])

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

  // Get Magic 8-Ball bet array from RTP config
  const betArray = (BET_ARRAYS_V3 as any)['magic8ball'].calculateBetArray()

    console.log('� MAGIC 8-BALL BET ARRAY DEBUG:', {
      betArray,
  nonZeroCount: betArray.filter((x: number) => x > 0).length,
      maxBet: Math.max(...betArray),
      wager
    })

    await game.play({ wager, bet: betArray })

    const result = await game.result()
    const win = result.payout > 0

    // Store the game result for background color
    setLastGameResult(win ? 'win' : 'lose')

    // Generate a random Magic 8-Ball number (1-100 for visual effect)
    const luckyNumber = Math.floor(Math.random() * 100) + 1

    console.log('� MAGIC 8-BALL RESULT:', {
      resultIndex: result.resultIndex,
      payout: result.payout,
      multiplier: result.multiplier,
      luckyNumber,
      win
    })

    // Set result index for display
    setResultIndex(luckyNumber)

    // Update comprehensive game statistics
    const profit = result.payout - wager
    gameStats.updateStats(profit)

    // Start lucky number animation with a small delay to ensure state is ready
    // If motion is disabled, skip the delay and show result immediately
    const animationDelay = enableMotion ? 50 : 0
    setTimeout(() => startLuckyNumberAnimation(win ? 'Win' : 'Lose'), animationDelay)

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



  return (
    <>
      {/* Recent Plays Portal - positioned above stats */}
      <GambaUi.Portal target="recentplays">
        <GameRecentPlaysHorizontal gameId="magic8ball" />
      </GambaUi.Portal>

      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Magic 8-Ball"
          gameMode="2D"
          rtp="95"
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'linear-gradient(135deg, #0a0511 0%, #0d0618 25%, #0f081c 50%, #0a0511 75%, #0a0511 100%)',
          perspective: '100px'
        }}>
          {/* Canvas Game Area - now starts from top since header is outside */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '120px', // Leave space for slider below
            borderRadius: '10px',
            overflow: 'hidden',
            border: '2px solid rgba(212, 165, 116, 0.4)'
          }}>
            <GambaUi.Canvas
              style={{
                width: '100%',
                height: '100%'
              }}
              render={renderCanvas}
            />
          </div>

          <GameControlsSection>

            {/* Magic 8-Ball Info */}
            <div style={{
              flex: '1',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(10, 5, 17, 0.9) 0%, rgba(139, 90, 158, 0.1) 50%, rgba(10, 5, 17, 0.9) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(212, 165, 116, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '8px 16px',
              boxShadow: '0 4px 16px rgba(10, 5, 17, 0.4), inset 0 1px 0 rgba(212, 165, 116, 0.2)',
              backdropFilter: 'blur(10px)',
              position: 'relative'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#d4a574',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                marginBottom: '4px'
              }}>
                MAGIC 8-BALL
              </div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(212, 165, 116, 0.9)',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                50/50 Chance • {multiplier}x Multiplier
              </div>
            </div>
          </GameControlsSection>

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
            {...(useGameMeta('magic8ball') && {
              title: useGameMeta('magic8ball')!.name,
              description: useGameMeta('magic8ball')!.description
            })}
          />
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={hasPlayed ? resetGame : play}
          playDisabled={gamba.isPlaying || (!hasPlayed && luckyNumberState.isAnimating) || poolExceeded}
          playText={hasPlayed ? "Ask Again" : "Ask the Magic 8-Ball"}
        />

        <DesktopControls
          onPlay={hasPlayed ? resetGame : play}
          playDisabled={gamba.isPlaying || (!hasPlayed && luckyNumberState.isAnimating) || poolExceeded}
          playText={hasPlayed ? "Ask Again" : "Ask the Magic 8-Ball"}
        >
          <EnhancedWagerInput value={wager} onChange={setWager} />
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}
