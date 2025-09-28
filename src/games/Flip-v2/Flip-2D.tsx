import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import { BET_ARRAYS_V2 } from '../rtpConfig-v2'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { EnhancedWagerInput, EnhancedButton, MobileControls, DesktopControls, GameControlsSection, GameRecentPlaysHorizontal } from '../../components'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { useGameMeta } from '../useGameMeta'
import { useGameStats } from '../../hooks/game/useGameStats'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { 
  CANVAS_WIDTH, CANVAS_HEIGHT, ROMANTIC_COLORS, FLIP_SETTINGS
} from './constants'

// Import local sounds
import SOUND_COIN_FLIP from './sounds/coin.mp3'
import SOUND_WIN_FLIP from './sounds/win.mp3'
import SOUND_LOSE_FLIP from './sounds/lose.mp3'
import SOUND_PLAY_FLIP from './sounds/play.mp3'

// Import coin images
import HEADS_IMAGE from './images/heads.webp'
import TAILS_IMAGE from './images/tails.webp'

export default function FlipV2() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [initialWager, setInitialWager] = useWagerInput()
  const { settings } = useGraphics()
  const { mobile: isMobile } = useIsCompact()
  const effectsRef = React.useRef<GameplayEffectsRef>(null)
  
  const sounds = useSound({
    win: SOUND_WIN_FLIP,
    lose: SOUND_LOSE_FLIP,
    coin: SOUND_COIN_FLIP,
    play: SOUND_PLAY_FLIP,
  })

  // Canvas ref
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const animationRef = React.useRef<number>()
  
  // Game state
  const [side, setSide] = React.useState<'heads' | 'tails'>('heads')
  const [numCoins, setNumCoins] = React.useState(1) // 1 to FLIP_SETTINGS.MAX_COINS coins
  const [atLeastK, setAtLeastK] = React.useState(1) // at least K wins
  const [totalProfit, setTotalProfit] = React.useState(0)
  const [gameCount, setGameCount] = React.useState(0)
  const [winCount, setWinCount] = React.useState(0)
  const [lossCount, setLossCount] = React.useState(0)
  const [inProgress, setInProgress] = React.useState(false)
  const [hasPlayed, setHasPlayed] = React.useState(false)
  const [flipping, setFlipping] = React.useState(false)
  const [coinResults, setCoinResults] = React.useState<number[]>(Array(FLIP_SETTINGS.MAX_COINS).fill(0))

  // Lucky number state for particles (like Dice-v2)
  const [luckyNumberState, setLuckyNumberState] = React.useState({
    particles: [] as Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      color: string
      size: number
    }>
  })

  // Game statistics with localStorage persistence
  const gameStats = useGameStats('flip-v2')

  const handleResetStats = () => {
    // Stats are now reset through gameStats.resetStats in GameStatsHeader
  }

  // Quality-based settings
  const particleCount = settings.quality === 'ultra' ? 50 :
                       settings.quality === 'high' ? 30 :
                       settings.quality === 'medium' ? 15 : 0

  // Coin images
  const [headsImg, setHeadsImg] = React.useState<HTMLImageElement | null>(null)
  const [tailsImg, setTailsImg] = React.useState<HTMLImageElement | null>(null)

  // Create particle burst effect (like Dice-v2)
  const createParticleBurst = React.useCallback((x: number, y: number, color: string) => {
    if (!settings.enableEffects || particleCount === 0) return

    const newParticles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      color: string
      size: number
    }> = []
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
  }, [settings.enableEffects, particleCount])

  // Update particles animation (like Dice-v2)
  React.useEffect(() => {
    if (!settings.enableMotion) return

    const updateParticles = () => {
      setLuckyNumberState(prev => ({
        ...prev,
        particles: prev.particles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            vy: particle.vy + 0.1 // gravity
          }))
          .filter(particle => particle.life > 0)
      }))
    }

    const interval = setInterval(updateParticles, 16) // ~60fps
    return () => clearInterval(interval)
  }, [settings.enableMotion])

  // Load coin images
  React.useEffect(() => {
    const loadImages = async () => {
      const heads = new Image()
      heads.src = HEADS_IMAGE
      await new Promise((resolve) => { heads.onload = resolve })
      setHeadsImg(heads)

      const tails = new Image()
      tails.src = TAILS_IMAGE
      await new Promise((resolve) => { tails.onload = resolve })
      setTailsImg(tails)
    }
    loadImages()
  }, [])

  // Coin animation state
  const [coinAnimations, setCoinAnimations] = React.useState<{
    rotation: number;
    scale: number;
    y: number;
    showing: 'heads' | 'tails';
  }[]>(Array(FLIP_SETTINGS.MAX_COINS).fill(null).map(() => ({ rotation: 0, scale: 1, y: 0, showing: 'heads' })))

  // Animate coins during flip
  React.useEffect(() => {
    if (!flipping) return

    const animateCoins = () => {
      const duration = 2000 // 2 seconds
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        setCoinAnimations(prev => prev.map((coin, index) => {
          // Only animate coins that are being used
          if (index >= numCoins) return coin
          
          const flipSpeed = 8 + (index % 4) * 2 // Different speeds for variety
          const rotation = progress * flipSpeed * 360
          const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.3
          const y = Math.sin(progress * Math.PI * 4) * 30
          
          // Determine showing face based on rotation
          const normalizedRotation = (rotation % 360)
          const showing = (normalizedRotation > 90 && normalizedRotation < 270) ? 'tails' : 'heads'

          return { rotation, scale, y, showing }
        }))

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // Set final results
          setCoinAnimations(prev => prev.map((coin, index) => {
            if (index >= numCoins) return coin
            return {
              ...coin,
              rotation: 0,
              scale: 1,
              y: 0,
              showing: coinResults[index] === 1 ? 'heads' : 'tails'
            }
          }))
        }
      }

      requestAnimationFrame(animate)
    }

    animateCoins()
  }, [flipping, coinResults, numCoins])

    const drawCoinArea = (ctx: CanvasRenderingContext2D) => {
    // Always display coins regardless of game state
    const gameAreaY = 140
    const coinAreaY = gameAreaY  // Start directly at game area since messages are removed
    const coinAreaHeight = CANVAS_HEIGHT - coinAreaY - 160 // Adjusted for larger controls area
    const coinAreaWidth = CANVAS_WIDTH - 120

    // Don't draw dark background for coin area - let background show through
    // ctx.save()
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    // ctx.fillRect(60, coinAreaY, coinAreaWidth, coinAreaHeight)
    
    // Draw coins
    if (headsImg && tailsImg) {
      // Get canvas display aspect ratio to compensate for stretching
      const canvas = canvasRef.current
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        const displayAspectRatio = rect.width / rect.height
        const canvasAspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT
        const stretchX = displayAspectRatio / canvasAspectRatio
        
        // Calculate optimal coin size and layout to maximize spacing within dark area
        let coinSize: number
        let cols: number
        let rows: number
        let horizontalSpacing: number
        let verticalSpacing: number
        
        // Available space within dark area (with margins)
        const availableWidth = coinAreaWidth - 40  // 20px margin on each side
        const availableHeight = coinAreaHeight - 40  // 20px margin top/bottom
        
        if (numCoins <= 4) {
          cols = Math.min(numCoins, 4)
          rows = 1
          // Large coins for few coins - maximize visibility
          const maxCoinSize = Math.min(availableWidth / cols * 0.8, availableHeight * 0.9)
          coinSize = Math.min(500, maxCoinSize)  // Increased from 180
          horizontalSpacing = (availableWidth - cols * coinSize) / Math.max(1, cols - 1)
          verticalSpacing = 0
        } else if (numCoins <= 8) {
          cols = 4
          rows = 2
          const maxCoinSize = Math.min(availableWidth / cols * 0.85, availableHeight / rows * 0.85)
          coinSize = Math.min(500, maxCoinSize)  // Increased from 140
          horizontalSpacing = (availableWidth - cols * coinSize) / (cols - 1)
          verticalSpacing = (availableHeight - rows * coinSize) / (rows - 1)
        } else if (numCoins <= 12) {
          cols = 4
          rows = 3
          const maxCoinSize = Math.min(availableWidth / cols * 0.9, availableHeight / rows * 0.9)
          coinSize = Math.min(500, maxCoinSize)  // Increased from 140
          horizontalSpacing = (availableWidth - cols * coinSize) / (cols - 1)
          verticalSpacing = (availableHeight - rows * coinSize) / (rows - 1)
        } else if (numCoins <= 16) {
          cols = 4
          rows = 4
          const maxCoinSize = Math.min(availableWidth / cols * 0.95, availableHeight / rows * 0.95)
          coinSize = Math.min(500, maxCoinSize)  // Increased from 80
          horizontalSpacing = (availableWidth - cols * coinSize) / (cols - 1)
          verticalSpacing = (availableHeight - rows * coinSize) / (cols - 1)
        } else {
          cols = 5
          rows = 4
          const maxCoinSize = Math.min(availableWidth / cols * 0.95, availableHeight / rows * 0.95)
          coinSize = Math.min(500, maxCoinSize)  // Increased from 65
          horizontalSpacing = (availableWidth - cols * coinSize) / (cols - 1)
          verticalSpacing = (availableHeight - rows * coinSize) / (rows - 1)
        }
        
        // Calculate starting position to center the grid
        const totalGridWidth = cols * coinSize + (cols - 1) * horizontalSpacing
        const totalGridHeight = rows * coinSize + (rows - 1) * verticalSpacing
        const startX = 60 + (coinAreaWidth - totalGridWidth) / 2
        const startY = coinAreaY + (coinAreaHeight - totalGridHeight) / 2
        
        for (let i = 0; i < numCoins; i++) {
          const col = i % cols
          const row = Math.floor(i / cols)
          const x = startX + col * (coinSize + horizontalSpacing) + coinSize / 2
          const y = startY + row * (coinSize + verticalSpacing) + coinSize / 2
          
          const animation = coinAnimations[i]
          
          ctx.save()
          ctx.translate(x, y + animation.y)
          // Compensate for canvas stretching to keep coins circular
          const compensationScale = canvasAspectRatio / displayAspectRatio
          ctx.scale(animation.scale * compensationScale, animation.scale)
          ctx.rotate((animation.rotation * Math.PI) / 180)
          
          // Draw perfect circle by using arc with fill instead of clipping
          const img = animation.showing === 'heads' ? headsImg : tailsImg
          
          // Create a temporary canvas for circular masking
          const tempCanvas = document.createElement('canvas')
          tempCanvas.width = coinSize
          tempCanvas.height = coinSize
          const tempCtx = tempCanvas.getContext('2d')!
          
          // Draw circle mask
          tempCtx.beginPath()
          tempCtx.arc(coinSize / 2, coinSize / 2, coinSize / 2, 0, Math.PI * 2)
          tempCtx.closePath()
          tempCtx.clip()
          
          // Draw the coin image onto the circular mask
          tempCtx.drawImage(img, 0, 0, coinSize, coinSize)
          
          // Draw the circular result onto main canvas
          ctx.drawImage(tempCanvas, -coinSize / 2, -coinSize / 2)
          
          ctx.restore()
        }
      }
    }
    
    ctx.restore()
  }

  // Helper functions from V2 config
  const getMultiplier = () => {
    const config = BET_ARRAYS_V2['flip-v2']
    const betArray = config.calculateBetArray(numCoins, atLeastK, side)
    const prob = config.probAtLeast(numCoins, atLeastK)
    return config.computeMultiplier(prob)
  }

  const getProbability = () => {
    const config = BET_ARRAYS_V2['flip-v2']
    return config.probAtLeast(numCoins, atLeastK)
  }

  const maxMultiplier = React.useMemo(() => {
    const config = BET_ARRAYS_V2['flip-v2']
    let max = 0
    for (let coins = 1; coins <= FLIP_SETTINGS.MAX_COINS; coins++) {
      for (let k = 1; k <= coins; k++) {
        const prob = config.probAtLeast(coins, k)
        const mult = config.computeMultiplier(prob)
        if (mult > max) max = mult
      }
    }
    return max
  }, [])

  // Pool restrictions
  const maxWagerForPool = React.useMemo(() => {
    return pool.maxPayout / maxMultiplier
  }, [pool.maxPayout, maxMultiplier])

  const maxPayout = initialWager * maxMultiplier
  const poolExceeded = maxPayout > pool.maxPayout

  // Degen background for the game canvas area
  const drawDegenGameBackground = (ctx: CanvasRenderingContext2D) => {
    const currentTime = performance.now()
    const animationTime = currentTime * 0.001

    // Create background gradient based on game state
    const backgroundGradient = ctx.createRadialGradient(
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0,
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) / 2
    )

    // Determine background color based on game state
    // No special background tinting needed without results screen
    // Subtle blue tint for normal state
    backgroundGradient.addColorStop(0, 'rgba(26, 26, 46, 0.2)')
    backgroundGradient.addColorStop(0.5, 'rgba(22, 33, 62, 0.15)')
    backgroundGradient.addColorStop(1, 'rgba(15, 15, 35, 0.1)')

    ctx.fillStyle = backgroundGradient
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Romantic degen background elements (enhanced like Dice-v2)
    ctx.save()
    ctx.globalAlpha = 0.15

    // Large romantic coin symbols (top-left)
    ctx.fillStyle = 'rgba(212, 165, 116, 0.3)'
    ctx.font = '120px serif'
    ctx.textAlign = 'center'
    ctx.save()
    ctx.translate(CANVAS_WIDTH * 0.12, CANVAS_HEIGHT * 0.15)
    ctx.rotate(-15 * Math.PI / 180)
    ctx.fillText('🪙', 0, 0)
    ctx.restore()

    // Large romantic coin symbol (bottom-right)
    ctx.fillStyle = 'rgba(255, 215, 0, 0.25)'
    ctx.font = '100px serif'
    ctx.save()
    ctx.translate(CANVAS_WIDTH * 0.88, CANVAS_HEIGHT * 0.85)
    ctx.rotate(25 * Math.PI / 180)
    ctx.fillText('🪙', 0, 0)
    ctx.restore()

    // Medium romantic coin symbols
    ctx.fillStyle = 'rgba(139, 90, 158, 0.2)'
    ctx.font = '60px serif'
    ctx.save()
    ctx.translate(CANVAS_WIDTH * 0.75, CANVAS_HEIGHT * 0.25)
    ctx.rotate(45 * Math.PI / 180)
    ctx.fillText('🪙', 0, 0)
    ctx.restore()

    ctx.save()
    ctx.translate(CANVAS_WIDTH * 0.25, CANVAS_HEIGHT * 0.75)
    ctx.rotate(-30 * Math.PI / 180)
    ctx.fillText('🪙', 0, 0)
    ctx.restore()

    // Small romantic coin symbols scattered (like Dice-v2 dice symbols)
    ctx.fillStyle = 'rgba(212, 165, 116, 0.15)'
    ctx.font = '40px serif'
    const smallCoins = ['🪙', '💰', '🪙', '💰', '🪙', '💰']
    for (let i = 0; i < 8; i++) {
      const x = (i * CANVAS_WIDTH) / 8 + CANVAS_WIDTH / 16
      const y = CANVAS_HEIGHT * 0.3 + Math.sin(i * 0.8) * 60
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((i * 45) * Math.PI / 180)
      ctx.fillText(smallCoins[i % smallCoins.length], 0, 0)
      ctx.restore()
    }

    ctx.restore()

    // Draw mystical background elements (conditional based on quality)
    if (settings.enableEffects) {
      ctx.strokeStyle = 'rgba(138, 43, 226, 0.3)'
      ctx.lineWidth = 2
      for (let i = 0; i < 8; i++) {
        // Use static positions if motion is disabled
        const angle = settings.enableMotion ? (animationTime * 1 + i * Math.PI / 4) % (Math.PI * 2) : (i * Math.PI / 4)
        const radius = settings.enableMotion ? 150 + Math.sin(animationTime * 2 + i) * 50 : 150
        const x = CANVAS_WIDTH / 2 + Math.cos(angle) * radius
        const y = CANVAS_HEIGHT / 2 + Math.sin(angle) * radius

        ctx.beginPath()
        ctx.arc(x, y, 30 + i * 10, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // Draw floating runes/symbols (conditional based on quality)
    if (settings.enableEffects) {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.6)'
      ctx.font = '24px serif'
      ctx.textAlign = 'center'
      const runes = ['✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰']
      for (let i = 0; i < 10; i++) {
        // Use static positions if motion is disabled
        const baseAngle = i * Math.PI / 5
        const x = settings.enableMotion ?
          Math.sin(animationTime * 0.1 + i) * 200 + CANVAS_WIDTH / 2 :
          Math.cos(baseAngle) * 200 + CANVAS_WIDTH / 2
        const y = settings.enableMotion ?
          Math.cos(animationTime * 0.1 + i) * 150 + CANVAS_HEIGHT / 2 :
          Math.sin(baseAngle) * 150 + CANVAS_HEIGHT / 2
        ctx.save()
        ctx.translate(x, y)
        const rotation = settings.enableMotion ? animationTime * 1.5 + i : i * 0.5
        ctx.rotate(rotation)
        ctx.fillText(runes[i % runes.length], 0, 0)
        ctx.restore()
      }
    }

    // Draw particles (conditional based on quality and effects)
    if (settings.enableEffects && particleCount > 0) {
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
  }

  // Canvas drawing functions
  const drawGameArea = (ctx: CanvasRenderingContext2D) => {
    // Main game area background (no border for cleaner look)
    const gameAreaY = 140
    const gameAreaHeight = CANVAS_HEIGHT - gameAreaY - 160 // Adjusted for larger controls area
    
    // Remove the border and just keep subtle background
    // ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
    // ctx.strokeStyle = ROMANTIC_COLORS.gold
    // ctx.lineWidth = 2
    // ctx.beginPath()
    // ctx.roundRect(40, gameAreaY, CANVAS_WIDTH - 80, gameAreaHeight, 15)
    // ctx.fill()
    // ctx.stroke()
    
    // Draw the coin area with animations
    drawCoinArea(ctx)
  }

  // Animation loop
  const animate = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      animationRef.current = requestAnimationFrame(animate)
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      animationRef.current = requestAnimationFrame(animate)
      return
    }

    // Clear canvas and draw degen background
    ctx.fillStyle = ROMANTIC_COLORS.background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw degen background elements
    drawDegenGameBackground(ctx)

    // Draw game UI
    drawGameArea(ctx)

    animationRef.current = requestAnimationFrame(animate)
  }, [numCoins, side, atLeastK, totalProfit, gameCount, hasPlayed, flipping, coinAnimations, headsImg, tailsImg, settings.enableMotion, luckyNumberState.particles])

  // Start animation
  React.useEffect(() => {
    animate()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate])

  // Game logic
  const play = async () => {
    if (flipping) return
    
    setFlipping(true)
    setInProgress(true)
    
    try {
      const config = BET_ARRAYS_V2['flip-v2']
      const betArray = config.calculateBetArray(numCoins, atLeastK, side)
      
      // Scale wager by number of coins - more coins = higher total bet
      const totalWager = initialWager * numCoins
      
      await game.play({
        bet: betArray,
        wager: totalWager,
        metadata: [numCoins, atLeastK, side === 'heads' ? 1 : 0],
      })

      const result = await game.result()
      
      // Trigger coin flip animation
      sounds.play('coin')
      
      // Determine if we won based on blockchain result
      const actuallyWon = result.payout > 0
      
      // Generate coin flip results that match the actual win/loss outcome
      const results: boolean[] = []
      const coinRes: number[] = []
      
      // Use deterministic RNG to generate consistent visual results
      const seed = `${result.resultIndex}:${result.payout}:${result.multiplier}:${numCoins}:${atLeastK}:${side}`
      const rng = makeDeterministicRng(seed)
      
      if (actuallyWon) {
        // We won - ensure we get at least atLeastK of the chosen side
        let headsCount = 0
        let tailsCount = 0
        
        // First, guarantee we meet the minimum requirement
        for (let i = 0; i < atLeastK; i++) {
          const isHeads = side === 'heads'
          results.push(isHeads)
          coinRes.push(isHeads ? 1 : 0)
          if (isHeads) headsCount++
          else tailsCount++
        }
        
        // Fill the remaining coins randomly
        for (let i = atLeastK; i < numCoins; i++) {
          const isHeads = rng() < 0.5
          results.push(isHeads)
          coinRes.push(isHeads ? 1 : 0)
          if (isHeads) headsCount++
          else tailsCount++
        }
      } else {
        // We lost - ensure we DON'T meet the minimum requirement
        let headsCount = 0
        let tailsCount = 0
        const targetSideCount = Math.min(atLeastK - 1, numCoins) // Less than required
        
        // First, put some of the target side (but not enough to win)
        for (let i = 0; i < targetSideCount; i++) {
          const isHeads = side === 'heads'
          results.push(isHeads)
          coinRes.push(isHeads ? 1 : 0)
          if (isHeads) headsCount++
          else tailsCount++
        }
        
        // Fill the remaining with the opposite side or random (ensuring we don't win)
        for (let i = targetSideCount; i < numCoins; i++) {
          // Bias towards the opposite side to ensure we don't accidentally win
          const isHeads = side === 'tails' ? (rng() < 0.7) : (rng() < 0.3)
          results.push(isHeads)
          coinRes.push(isHeads ? 1 : 0)
          if (isHeads) headsCount++
          else tailsCount++
        }
      }
      
      // Set coin animation results for final display
      setCoinResults(coinRes)
      
      // Count wins (matching chosen side) - this should match the actual result
      const wins = results.filter(r => r === (side === 'heads')).length
      const visualWon = wins >= atLeastK
      
      // Wait for animation to complete (animation takes 2 seconds)
      // Note: No additional wait needed here since animation runs synchronously
      
      // Wait for coins to settle and user to see the final result
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Use the actual blockchain result for profit calculation
      const gameResult = {
        won: actuallyWon, // Use blockchain result, not visual simulation
        results,
        winnings: result.payout - totalWager // This is the actual profit/loss
      }
      
      if (actuallyWon) {
        // WIN
        if (effectsRef.current) {
          if (result.multiplier >= 3) {
            effectsRef.current.winFlash('#ffd700', 3)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#ffd700', 80)
              effectsRef.current?.screenShake(3, 1500)
              createParticleBurst(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '#ffd700')
            }, 300)
          } else {
            effectsRef.current.winFlash('#4caf50', 2)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#4caf50', 40)
              createParticleBurst(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '#4caf50')
            }, 200)
          }
        }
        
        sounds.play('win')
        setTotalProfit(prev => prev + gameResult.winnings)
        setWinCount(prev => prev + 1)
        
        // Update comprehensive game statistics for win
        gameStats.updateStats(gameResult.winnings)
      } else {
        // LOSE
        if (effectsRef.current) {
          effectsRef.current.loseFlash('#f44336', 2)
          setTimeout(() => {
            effectsRef.current?.screenShake(2, 1000)
            createParticleBurst(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '#ff6b6b')
          }, 200)
        }
        
        sounds.play('lose')
        setTotalProfit(prev => prev + gameResult.winnings)
        setLossCount(prev => prev + 1)
        
        // Update comprehensive game statistics for loss
        gameStats.updateStats(0)
      }
      
      setGameCount(prev => prev + 1)
      setHasPlayed(true)
      
    } catch (error) {
      console.error('Game error:', error)
    } finally {
      setFlipping(false)
      setInProgress(false)
    }
  }

  // Reset game to allow new wager
  const resetGame = () => {
    setHasPlayed(false)
    setInProgress(false)
    setFlipping(false)
    setTotalProfit(0)
    setGameCount(0)
    setWinCount(0)
    setLossCount(0)
    setCoinResults(Array(FLIP_SETTINGS.MAX_COINS).fill(0))
    // Reset coin animations to initial state
    setCoinAnimations(Array(FLIP_SETTINGS.MAX_COINS).fill(null).map(() => ({ rotation: 0, scale: 1, y: 0, showing: 'heads' })))
  }

  // Play button logic
  const getPlayText = () => {
    if (flipping) return "Flipping..."
    if (hasPlayed) return "Again"
    return "Flip"
  }
  
  const getPlayAction = () => {
    return play
  }

  useGameMeta('flip-v2')

  return (
    <>
      {/* Recent Plays Portal - positioned above stats */}
      <GambaUi.Portal target="recentplays">
        <GameRecentPlaysHorizontal gameId="flip-v2" />
      </GambaUi.Portal>

      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Flip"
          gameMode="V2"
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
          {/* Stats header removed - now rendered outside portal */}

          {/* Canvas for game UI - Now uses full available space since stats moved outside */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '140px',
            borderRadius: '10px',
            border: '2px solid rgba(212, 165, 116, 0.4)',
            overflow: 'hidden'
          }}>
            <canvas 
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={{ 
                  width: '100%',
                  height: '100%',
                  imageRendering: 'auto',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                  WebkitTapHighlightColor: 'transparent'
                }}
              />
          </div>
          <GameControlsSection>
              {/* Game Controls Section */}
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
                padding: '12px',
                boxShadow: '0 4px 16px rgba(10, 5, 17, 0.4), inset 0 1px 0 rgba(212, 165, 116, 0.2)',
                backdropFilter: 'blur(10px)',
                position: 'relative'
              }}>
                {/* Controls Grid */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '12px',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  {/* COINS Control */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    minWidth: '60px'
                  }}>
                    <div style={{
                      fontSize: '9px',
                      fontWeight: 'bold',
                      color: 'rgba(212, 165, 116, 0.8)',
                      textAlign: 'center'
                    }}>
                      COINS
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <button
                        onClick={() => setNumCoins(Math.max(1, numCoins - 1))}
                        disabled={flipping}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: '1px solid rgba(212, 165, 116, 0.5)',
                          background: 'rgba(10, 5, 17, 0.8)',
                          color: '#d4a574',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: flipping ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        -
                      </button>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        minWidth: '16px',
                        textAlign: 'center'
                      }}>
                        {numCoins}
                      </span>
                      <button
                        onClick={() => setNumCoins(Math.min(FLIP_SETTINGS.MAX_COINS, numCoins + 1))}
                        disabled={flipping}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: '1px solid rgba(212, 165, 116, 0.5)',
                          background: 'rgba(10, 5, 17, 0.8)',
                          color: '#d4a574',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: flipping ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* SIDE Control */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    minWidth: '60px'
                  }}>
                    <div style={{
                      fontSize: '9px',
                      fontWeight: 'bold',
                      color: 'rgba(212, 165, 116, 0.8)',
                      textAlign: 'center'
                    }}>
                      SIDE
                    </div>
                    <button
                      onClick={() => setSide(side === 'heads' ? 'tails' : 'heads')}
                      disabled={flipping}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(212, 165, 116, 0.5)',
                        background: 'rgba(10, 5, 17, 0.8)',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        cursor: flipping ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {side.charAt(0).toUpperCase() + side.slice(1)}
                    </button>
                  </div>

                  {/* MIN SIDES Control */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    minWidth: '60px'
                  }}>
                    <div style={{
                      fontSize: '9px',
                      fontWeight: 'bold',
                      color: 'rgba(212, 165, 116, 0.8)',
                      textAlign: 'center'
                    }}>
                      MIN SIDES
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <button
                        onClick={() => setAtLeastK(Math.max(1, atLeastK - 1))}
                        disabled={flipping}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: '1px solid rgba(212, 165, 116, 0.5)',
                          background: 'rgba(10, 5, 17, 0.8)',
                          color: '#d4a574',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: flipping ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        -
                      </button>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        minWidth: '16px',
                        textAlign: 'center'
                      }}>
                        {atLeastK}
                      </span>
                      <button
                        onClick={() => setAtLeastK(Math.min(numCoins, atLeastK + 1))}
                        disabled={flipping}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: '1px solid rgba(212, 165, 116, 0.5)',
                          background: 'rgba(10, 5, 17, 0.8)',
                          color: '#d4a574',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: flipping ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RISK Section */}
              <div style={{
                flex: '0 0 140px',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(245, 124, 0, 0.25) 50%, rgba(255, 152, 0, 0.15) 100%)',
                borderRadius: '12px',
                border: '2px solid rgba(255, 152, 0, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 4px 16px rgba(255, 152, 0, 0.2), inset 0 1px 0 rgba(255, 152, 0, 0.3)',
                backdropFilter: 'blur(8px)'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#ff9800',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  marginBottom: '4px'
                }}>
                  RISK
                </div>
                <div style={{
                  fontSize: '18px',
                  color: getProbability() > 0.7 ? '#4caf50' : getProbability() > 0.3 ? '#ff9800' : '#f44336',
                  fontWeight: '600'
                }}>
                  {getProbability() > 0.7 ? 'LOW' : getProbability() > 0.3 ? 'MEDIUM' : 'HIGH'}
                </div>
              </div>

              {/* WIN CHANCE Section */}
              <div style={{
                flex: '0 0 140px',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(184, 51, 106, 0.15) 0%, rgba(136, 14, 79, 0.25) 50%, rgba(184, 51, 106, 0.15) 100%)',
                borderRadius: '12px',
                border: '2px solid rgba(184, 51, 106, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 4px 16px rgba(184, 51, 106, 0.2), inset 0 1px 0 rgba(184, 51, 106, 0.3)',
                backdropFilter: 'blur(8px)'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#b8336a',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  marginBottom: '4px'
                }}>
                  WIN CHANCE
                </div>
                <div style={{
                  fontSize: '18px',
                  color: 'rgba(184, 51, 106, 0.9)',
                  fontWeight: '600'
                }}>
                  {(getProbability() * 100).toFixed(1)}%
                </div>
              </div>

              {/* MULTIPLIER Section */}
              <div style={{
                flex: '0 0 140px',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(46, 125, 50, 0.25) 50%, rgba(76, 175, 80, 0.15) 100%)',
                borderRadius: '12px',
                border: '2px solid rgba(76, 175, 80, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 4px 16px rgba(76, 175, 80, 0.2), inset 0 1px 0 rgba(76, 175, 80, 0.3)',
                backdropFilter: 'blur(8px)'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#4caf50',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  marginBottom: '4px'
                }}>
                  MULTIPLIER
                </div>
                <div style={{
                  fontSize: '18px',
                  color: 'rgba(76, 175, 80, 0.9)',
                  fontWeight: '600'
                }}>
                  {`${getMultiplier().toFixed(2)}x`}
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
          />
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <MobileControls
          wager={initialWager}
          setWager={setInitialWager}
          onPlay={getPlayAction()}
          playDisabled={flipping || !pool || gamba.isPlaying || poolExceeded}
          playText={getPlayText()}
        />
        
        <DesktopControls
          onPlay={getPlayAction()}
          playDisabled={flipping || !pool || gamba.isPlaying || poolExceeded}
          playText={getPlayText()}
        >
          <EnhancedWagerInput value={initialWager} onChange={setInitialWager} />
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}
