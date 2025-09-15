import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { BET_ARRAYS_V2 } from '../rtpConfig-v2'
import { EnhancedWagerInput, EnhancedPlayButton, EnhancedButton, MobileControls, DesktopControls, GameControlsSection } from '../../components'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { useGameMeta } from '../useGameMeta'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { 
  SOUND_WIN, SOUND_LOSE, SOUND_PLAY, SOUND_CARD, SOUND_JACKPOT,
  CANVAS_WIDTH, CANVAS_HEIGHT, CARD_WIDTH, CARD_HEIGHT, CARD_SPACING,
  SUITS, RANKS, ROMANTIC_COLORS, HAND_COLORS
} from './constants'

type HandType = 'Bust' | 'Pair' | 'Two Pair' | 'Three of a Kind' | 'Straight' | 'Flush' | 'Full House' | 'Four of a Kind' | 'Royal Flush'

interface HandTemplate { 
  name: string
  type: HandType
}

// Helper functions for V2 config
const getHandTemplateFromResult = (resultIndex: number): HandTemplate => {
  const config = BET_ARRAYS_V2['multipoker-v2']
  const handTypeName = config.getHandName(resultIndex)
  const betArray = config.calculateBetArray()
  const payout = betArray[resultIndex] || 0
  
  return {
    name: handTypeName,
    type: handTypeName as HandType
  }
}

const getPokerHandCards = (type: string) => {
  // Generate sample cards for the hand type
  const cards = []
  for (let i = 0; i < 5; i++) {
    cards.push({
      rank: Math.floor(Math.random() * 13),
      suit: Math.floor(Math.random() * 4)
    })
  }
  return cards
}

export default function MultiPokerV2() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [initialWager, setInitialWager] = useWagerInput()
  const { settings } = useGraphics()
  const effectsRef = React.useRef<GameplayEffectsRef>(null)
  const { mobile: isMobile } = useIsCompact()
  
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    card: SOUND_CARD,
    jackpot: SOUND_JACKPOT,
  })

  // Canvas ref with debugging
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const animationRef = React.useRef<number>()
  
  // Load card back image
  const cardBackImage = React.useRef<HTMLImageElement | null>(null)
  
  React.useEffect(() => {
    const img = new Image()
    img.onload = () => {
      cardBackImage.current = img
      console.log('✅ Card back image loaded')
    }
    img.onerror = () => {
      console.error('❌ Failed to load card back image')
    }
    img.src = '/png/images/card.png'
  }, [])
  
  // Game state - exactly like original
  const [hand, setHand] = React.useState<({ name: string; type: HandType; payout: number } | null)>(null)
  const [revealing, setRevealing] = React.useState(false)
  const [cards, setCards] = React.useState<{ rank: number; suit: number }[]>([])
  const [currentBalance, setCurrentBalance] = React.useState(0)
  const [totalProfit, setTotalProfit] = React.useState(0)
  const [inProgress, setInProgress] = React.useState(false)
  const [showingResult, setShowingResult] = React.useState(false)
  const [cardRevealed, setCardRevealed] = React.useState<boolean[]>([false, false, false, false, false])
  const [handCount, setHandCount] = React.useState(0)
  const [winCount, setWinCount] = React.useState(0)
  const [lossCount, setLossCount] = React.useState(0)
  const [gameCount, setGameCount] = React.useState(0)
  const [gameMode, setGameMode] = React.useState<'single' | 'chain' | 'progressive'>('single')
  const [chainLength, setChainLength] = React.useState(0)
  const [lastHandRank, setLastHandRank] = React.useState<number>(-1)
  const [chainHistory, setChainHistory] = React.useState<string[]>([])
  const [showModeSelection, setShowModeSelection] = React.useState(true) // Control which GameControlsSection to show
  const [hasPlayed, setHasPlayed] = React.useState(false) // Track if player has played like Dice-v2

  // Comprehensive game statistics tracking
  const [gameStats, setGameStats] = React.useState({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    sessionProfit: 0,
    bestWin: 0
  })

  // Derived state for UI
  const currentHandType = hand?.name || (cards.length > 0 ? 'Revealing...' : null)
  const currentMultiplier = hand?.payout || null

  // Debug effect to check canvas state
  React.useEffect(() => {
    console.log('🔍 Canvas state check:', {
      canvas: !!canvasRef.current,
      showModeSelection,
      canvasWidth: canvasRef.current?.width,
      canvasHeight: canvasRef.current?.height
    })
    
    if (canvasRef.current && showModeSelection) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        console.log('🎨 Emergency draw from effect')
        // Draw test pattern
        ctx.fillStyle = '#ff0000'
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 48px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('EMERGENCY DRAW', canvasRef.current.width/2, canvasRef.current.height/2)
      }
    }
  }, [showModeSelection])

  // Background animation loop
  React.useEffect(() => {
    // The background is now drawn as part of the main animation loop
    // No separate background animation needed
  }, [settings.enableMotion, hasPlayed, showingResult, hand])

  const maxMultiplier = React.useMemo(() => {
    const config = BET_ARRAYS_V2['multipoker-v2']
    const betArray = config.calculateBetArray()
    return Math.max(...betArray)
  }, [])

  // Pool restrictions for compound wagering
  const maxWagerForPool = React.useMemo(() => {
    return pool.maxPayout / maxMultiplier
  }, [pool.maxPayout, maxMultiplier])

  const poolExceeded = React.useMemo(() => {
    const effectiveWager = inProgress ? currentBalance : initialWager
    return effectiveWager * maxMultiplier > pool.maxPayout
  }, [inProgress, currentBalance, initialWager, maxMultiplier, pool.maxPayout])

  // Game logic functions - exactly like original
  const isValidChainProgression = (resultIndex: number): boolean => {
    if (gameMode === 'single') {
      return true
    } else if (gameMode === 'progressive') {
      return resultIndex >= 3
    } else if (gameMode === 'chain') {
      if (chainLength === 0) {
        return resultIndex >= 3
      }
      return resultIndex > lastHandRank
    }
    return false
  }

  // Degen background for the game canvas area (like Dice-v2)
  const drawDegenGameBackground = (ctx: CanvasRenderingContext2D) => {
    const currentTime = performance.now()
    const animationTime = currentTime * 0.001

    // Create background gradient based on game state
    const backgroundGradient = ctx.createRadialGradient(
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0,
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) / 2
    )

    // Determine background color based on game state
    const isShowingResult = hasPlayed && showingResult

    if (isShowingResult && hand && hand.payout > 0) {
      // Green tint for win
      backgroundGradient.addColorStop(0, 'rgba(26, 46, 26, 0.3)')
      backgroundGradient.addColorStop(0.5, 'rgba(46, 74, 46, 0.2)')
      backgroundGradient.addColorStop(1, 'rgba(15, 35, 15, 0.1)')
    } else if (isShowingResult && hand && hand.payout === 0) {
      // Red tint for loss
      backgroundGradient.addColorStop(0, 'rgba(46, 26, 26, 0.3)')
      backgroundGradient.addColorStop(0.5, 'rgba(74, 46, 46, 0.2)')
      backgroundGradient.addColorStop(1, 'rgba(35, 15, 15, 0.1)')
    } else {
      // Subtle purple tint for normal state
      backgroundGradient.addColorStop(0, 'rgba(26, 26, 46, 0.2)')
      backgroundGradient.addColorStop(0.5, 'rgba(22, 33, 62, 0.15)')
      backgroundGradient.addColorStop(1, 'rgba(15, 15, 35, 0.1)')
    }

    ctx.fillStyle = backgroundGradient
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Poker-themed degen background elements
    ctx.save()
    ctx.globalAlpha = 0.3 // Increased from 0.1 to make symbols more visible

    // Large suit symbols in corners
    ctx.fillStyle = 'rgba(212, 165, 116, 0.6)' // Increased opacity from 0.3 to 0.6
    ctx.font = '80px serif'
    ctx.textAlign = 'center'
    
    // Top-left spade
    ctx.save()
    ctx.translate(CANVAS_WIDTH * 0.15, CANVAS_HEIGHT * 0.2)
    ctx.rotate(-15 * Math.PI / 180)
    ctx.fillText('♠', 0, 0)
    ctx.restore()

    // Bottom-right heart
    ctx.fillStyle = 'rgba(184, 51, 106, 0.5)' // Increased opacity from 0.25 to 0.5
    ctx.font = '70px serif'
    ctx.save()
    ctx.translate(CANVAS_WIDTH * 0.85, CANVAS_HEIGHT * 0.8)
    ctx.rotate(25 * Math.PI / 180)
    ctx.fillText('♥', 0, 0)
    ctx.restore()

    // Medium symbols
    ctx.fillStyle = 'rgba(139, 90, 158, 0.4)' // Increased opacity from 0.2 to 0.4
    ctx.font = '50px serif'
    
    // Top-right diamond
    ctx.save()
    ctx.translate(CANVAS_WIDTH * 0.85, CANVAS_HEIGHT * 0.2)
    ctx.rotate(45 * Math.PI / 180)
    ctx.fillText('♦', 0, 0)
    ctx.restore()

    // Bottom-left club
    ctx.save()
    ctx.translate(CANVAS_WIDTH * 0.15, CANVAS_HEIGHT * 0.8)
    ctx.rotate(-30 * Math.PI / 180)
    ctx.fillText('♣', 0, 0)
    ctx.restore()

    // Small scattered suits
    ctx.fillStyle = 'rgba(212, 165, 116, 0.3)' // Increased opacity from 0.15 to 0.3
    ctx.font = '30px serif'
    const suits = ['♠', '♥', '♦', '♣']
    for (let i = 0; i < 6; i++) {
      const x = (i * CANVAS_WIDTH) / 6 + CANVAS_WIDTH / 12
      const y = CANVAS_HEIGHT * 0.1 + Math.sin(i * 0.8 + animationTime * 0.5) * 30
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((i * 60 + (settings.enableMotion ? animationTime * 10 : 0)) * Math.PI / 180)
      ctx.fillText(suits[i % suits.length], 0, 0)
      ctx.restore()
    }

    // Bottom scattered suits
    for (let i = 0; i < 6; i++) {
      const x = (i * CANVAS_WIDTH) / 6 + CANVAS_WIDTH / 12
      const y = CANVAS_HEIGHT * 0.9 + Math.sin(i * 1.2 + animationTime * 0.3) * 20
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((-i * 45 + (settings.enableMotion ? animationTime * -8 : 0)) * Math.PI / 180)
      ctx.fillText(suits[(i + 2) % suits.length], 0, 0)
      ctx.restore()
    }

    // Mystical floating elements (if effects enabled)
    if (settings.enableEffects) {
      ctx.strokeStyle = 'rgba(138, 43, 226, 0.4)' // Increased opacity from 0.2 to 0.4
      ctx.lineWidth = 2 // Increased from 1 to 2
      for (let i = 0; i < 4; i++) {
        const angle = settings.enableMotion ? (animationTime * 1 + i * Math.PI / 2) % (Math.PI * 2) : (i * Math.PI / 2)
        const radius = settings.enableMotion ? 100 + Math.sin(animationTime + i) * 30 : 100
        const x = CANVAS_WIDTH / 2 + Math.cos(angle) * radius
        const y = CANVAS_HEIGHT / 2 + Math.sin(angle) * radius

        ctx.beginPath()
        ctx.arc(x, y, 20 + i * 5, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Floating golden symbols
      ctx.fillStyle = 'rgba(255, 215, 0, 0.6)' // Increased opacity from 0.4 to 0.6
      ctx.font = '20px serif' // Increased from 16px to 20px
      const runes = ['✦', '✧', '✩', '✪']
      for (let i = 0; i < 4; i++) {
        const baseAngle = i * Math.PI / 2
        const x = settings.enableMotion ? 
          Math.sin(animationTime * 0.2 + i) * 150 + CANVAS_WIDTH / 2 : 
          Math.cos(baseAngle) * 150 + CANVAS_WIDTH / 2
        const y = settings.enableMotion ? 
          Math.cos(animationTime * 0.2 + i) * 100 + CANVAS_HEIGHT / 2 : 
          Math.sin(baseAngle) * 100 + CANVAS_HEIGHT / 2
        
        ctx.save()
        ctx.translate(x, y)
        const rotation = settings.enableMotion ? animationTime + i : i * 0.5
        ctx.rotate(rotation)
        ctx.fillText(runes[i % runes.length], 0, 0)
        ctx.restore()
      }
    }

    ctx.restore()
  }

  const drawModeSelectionCards = (ctx: CanvasRenderingContext2D) => {
    // Draw 5 face-down card placeholders in the center
    const startX = (CANVAS_WIDTH - (5 * CARD_WIDTH + 4 * CARD_SPACING)) / 2
    const cardY = CANVAS_HEIGHT / 2 - CARD_HEIGHT / 2
    
    // Add subtle glow effect around cards during mode selection
    ctx.save()
    ctx.shadowColor = 'rgba(212, 165, 116, 0.3)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    
    for (let i = 0; i < 5; i++) {
      const cardX = startX + i * (CARD_WIDTH + CARD_SPACING)
      drawCard(ctx, null, cardX, cardY, false) // null card, not revealed = shows card back
    }
    
    ctx.restore()

    // Add subtle "Choose Game Mode" text above cards
    ctx.fillStyle = 'rgba(212, 165, 116, 0.7)'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Choose Game Mode', CANVAS_WIDTH / 2, cardY - 40)
    
    // Add subtle description below cards
    ctx.fillStyle = 'rgba(212, 165, 116, 0.5)'
    ctx.font = '16px Arial'
    ctx.fillText('Select your poker variant from the controls below', CANVAS_WIDTH / 2, cardY + CARD_HEIGHT + 40)
  }

  // Canvas drawing functions
  const drawCard = (ctx: CanvasRenderingContext2D, card: { rank: number; suit: number } | null, x: number, y: number, revealed: boolean) => {
    // Card background
    ctx.fillStyle = revealed ? '#ffffff' : ROMANTIC_COLORS.dark
    ctx.strokeStyle = ROMANTIC_COLORS.gold
    ctx.lineWidth = 2
    
    // Draw rounded rectangle
    ctx.beginPath()
    ctx.roundRect(x, y, CARD_WIDTH, CARD_HEIGHT, 12)
    ctx.fill()
    ctx.stroke()
    
    if (revealed && card) {
      // Determine suit color
      const suitColor = (card.suit === 1 || card.suit === 0) ? '#e53935' : '#1a1a1a' // Hearts/Diamonds red, Clubs/Spades black
      ctx.fillStyle = suitColor
      
      // Draw rank (top-left)
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(RANKS[card.rank] || 'A', x + 8, y + 20)
      
      // Draw suit (center)
      ctx.font = '32px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(SUITS[card.suit] || '♠', x + CARD_WIDTH/2, y + CARD_HEIGHT/2 + 12)
      
      // Draw rank (bottom-right, rotated)
      ctx.save()
      ctx.translate(x + CARD_WIDTH - 8, y + CARD_HEIGHT - 8)
      ctx.rotate(Math.PI)
      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(RANKS[card.rank] || 'A', 0, 0)
      ctx.restore()
      
    } else if (!revealed) {
      // Card back design - use card.png image if loaded
      if (cardBackImage.current) {
        ctx.drawImage(cardBackImage.current, x, y, CARD_WIDTH, CARD_HEIGHT)
      } else {
        // Fallback design while image loads
        ctx.fillStyle = ROMANTIC_COLORS.crimson
        ctx.font = '20px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('💎', x + CARD_WIDTH/2, y + CARD_HEIGHT/2 + 6)
      }
    }
  }

  const drawHandResult = (ctx: CanvasRenderingContext2D) => {
    if (!hand || !showingResult) return
    
    const centerX = CANVAS_WIDTH / 2
    const centerY = CANVAS_HEIGHT - 100
    
    // Background
    const bgColor = HAND_COLORS[hand.name] || ROMANTIC_COLORS.purple
    ctx.fillStyle = bgColor + '40'
    ctx.strokeStyle = bgColor
    ctx.lineWidth = 3
    
    ctx.beginPath()
    ctx.roundRect(centerX - 200, centerY - 40, 400, 80, 12)
    ctx.fill()
    ctx.stroke()
    
    // Text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(hand.name, centerX, centerY - 8)
    
    ctx.font = '18px Arial'
    ctx.fillText(`${hand.payout}x Multiplier`, centerX, centerY + 18)
  }

  // Mode selection now handled by GameControlsSection

  const drawBackButton = (ctx: CanvasRenderingContext2D) => {
    if (showModeSelection) return
    
    // Back button in top-left, positioned lower to avoid stats header
    const buttonSize = 50
    const margin = 30
    const topOffset = 80 // Position it below the stats header
    
    ctx.fillStyle = ROMANTIC_COLORS.dark + 'CC' // More opaque
    ctx.strokeStyle = ROMANTIC_COLORS.gold // More prominent border
    ctx.lineWidth = 3
    
    ctx.beginPath()
    ctx.roundRect(margin, topOffset, buttonSize, buttonSize, 10)
    ctx.fill()
    ctx.stroke()
    
    // Arrow
    ctx.fillStyle = ROMANTIC_COLORS.gold
    ctx.font = 'bold 28px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('←', margin + buttonSize/2, topOffset + buttonSize/2 + 10)
  }

  const drawGameInfo = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = ROMANTIC_COLORS.gold
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'left'
    
    // Only show chain/streak length if relevant and in progress
    if (gameMode !== 'single' && chainLength > 0) {
      ctx.fillText(`${gameMode === 'chain' ? 'Chain' : 'Streak'}: ${chainLength}`, 20, 25)
    }
    
    // Next hand requirement for chain mode
    if (gameMode === 'chain' && inProgress && lastHandRank >= 0) {
      const config = BET_ARRAYS_V2['multipoker-v2']
      ctx.fillStyle = '#ffa500'
      ctx.font = '14px Arial'
      ctx.fillText(`Beat: ${config.getHandName(lastHandRank)}`, 20, chainLength > 0 ? 50 : 25)
    }
  }

  const drawPlaceholderText = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.font = '24px Arial'
    ctx.textAlign = 'center'
    
    const text = gameMode === 'single' ? 
      'Play single poker hands for instant wins!' :
      gameMode === 'chain' ? 
      'Chain progressively better poker hands!' :
      'Win any poker hand to continue your streak!'
      
    ctx.fillText(text, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 250) // Moved higher up above cards
  }

  // Animation loop
  const animate = React.useCallback(() => {
    const canvas = canvasRef.current
    console.log('🎬 Animate called:', { 
      canvas: !!canvas, 
      showModeSelection, 
      canvasWidth: canvas?.width, 
      canvasHeight: canvas?.height 
    })
    
    if (!canvas) {
      console.log('❌ No canvas found in animate')
      animationRef.current = requestAnimationFrame(animate)
      return
    }
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.log('❌ No context found in animate')
      animationRef.current = requestAnimationFrame(animate)
      return
    }
    
    // Clear canvas and draw degen background
    ctx.fillStyle = ROMANTIC_COLORS.background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    // Draw degen background elements in the game area
    drawDegenGameBackground(ctx)

    if (showModeSelection) {
      console.log('🎯 Mode selection handled by GameControlsSection')
      // Mode selection now handled by GameControlsSection - draw background and card placeholders
      drawDegenGameBackground(ctx)
      drawModeSelectionCards(ctx)
    } else {
      // Show game screen
      // Draw back button
      drawBackButton(ctx)
      
      // Draw placeholder text BEFORE cards (so it appears behind them)
      drawPlaceholderText(ctx)
      
      // Draw cards
      const startX = (CANVAS_WIDTH - (5 * CARD_WIDTH + 4 * CARD_SPACING)) / 2
      const cardY = CANVAS_HEIGHT / 2 - CARD_HEIGHT / 2
      
      for (let i = 0; i < 5; i++) {
        const cardX = startX + i * (CARD_WIDTH + CARD_SPACING)
        const card = cards[i] || null
        drawCard(ctx, card, cardX, cardY, cardRevealed[i])
      }
      
      // Draw hand result
      drawHandResult(ctx)
      
      // Draw game info
      drawGameInfo(ctx)
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }, [cards, cardRevealed, hand, showingResult, gameMode, chainLength, currentBalance, totalProfit, handCount, lastHandRank, inProgress, showModeSelection])

  // Start animation
  React.useEffect(() => {
    animate()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate])

  // Force initial render when canvas is ready
  React.useEffect(() => {
    const canvas = canvasRef.current
    console.log('Canvas ref effect triggered:', { canvas: !!canvas, showModeSelection })
    // Mode selection now handled by GameControlsSection
    if (canvas && showModeSelection) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        console.log('Drawing background only for mode selection')
        ctx.fillStyle = ROMANTIC_COLORS.background
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        drawDegenGameBackground(ctx)
      }
    }
  }, [showModeSelection])

  // Also ensure animation starts after component mounts
  React.useEffect(() => {
    console.log('Component mounted, starting animation timer')
    const timer = setTimeout(() => {
      console.log('Timer triggered, showModeSelection:', showModeSelection)
      if (showModeSelection) {
        animate()
      }
    }, 100) // Small delay to ensure canvas is ready
    
    return () => clearTimeout(timer)
  }, [])

  // Additional effect to ensure drawing happens when component is ready
  React.useEffect(() => {
    if (showModeSelection) {
      console.log('showModeSelection is true, requesting animation frame')
      const frame = requestAnimationFrame(() => {
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext('2d')
          if (ctx) {
            console.log('Emergency background draw for mode selection')
            ctx.fillStyle = ROMANTIC_COLORS.background
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            drawDegenGameBackground(ctx)
          }
        }
      })
      return () => cancelAnimationFrame(frame)
    }
  }, [showModeSelection])

  // Canvas click handler
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH / rect.width
    const scaleY = CANVAS_HEIGHT / rect.height
    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY
    
    if (showModeSelection) {
      // Handle mode selection clicks
      const modes = ['single', 'chain', 'progressive'] as const
      const buttonWidth = 280
      const buttonHeight = 80
      const startY = 180
      const spacing = 100
      const buttonX = CANVAS_WIDTH/2 - buttonWidth/2
      
      // Check mode buttons
      modes.forEach((mode, index) => {
        const buttonY = startY + index * spacing
        if (x >= buttonX && x <= buttonX + buttonWidth && 
            y >= buttonY && y <= buttonY + buttonHeight) {
          setGameMode(mode)
        }
      })
      
      // Check continue button
      const continueY = startY + modes.length * spacing + 20
      const continueX = CANVAS_WIDTH/2 - 100
      if (x >= continueX && x <= continueX + 200 && 
          y >= continueY && y <= continueY + 50) {
        setShowModeSelection(false)
      }
    } else {
      // Handle back button click
      const buttonSize = 50
      const margin = 30
      const topOffset = 80
      if (x >= margin && x <= margin + buttonSize && 
          y >= topOffset && y <= topOffset + buttonSize) {
        // Reset game state and show mode selection
        setInProgress(false)
        setShowingResult(false)
        setHand(null)
        setCards([])
        setCardRevealed([false, false, false, false, false])
        setCurrentBalance(0)
        setTotalProfit(0)
        setHandCount(0)
        setWinCount(0)
        setLossCount(0)
        setGameCount(0)
        setChainLength(0)
        setLastHandRank(-1)
        setChainHistory([])
        setShowModeSelection(true)
      }
    }
  }

  // Main play function - exactly like original
  const play = async () => {
    const currentWager = gameMode === 'single' 
      ? initialWager 
      : (handCount === 0 ? initialWager : currentBalance)
    
    if (currentWager <= 0) {
      console.error('❌ BLOCKED: Cannot play with zero wager')
      return
    }
    
    setHand(null)
    setCards([])
    setCardRevealed([false, false, false, false, false])
    setRevealing(true)

    try {
      const config = BET_ARRAYS_V2['multipoker-v2']
      const betArray = config.calculateBetArray()
      
      await game.play({
        bet: [...betArray],
        wager: currentWager,
        metadata: [handCount],
      })

      const result = await game.result()
      const resultIndex = result.resultIndex

      const handTemplate = getHandTemplateFromResult(resultIndex)
      const multiplier = betArray[resultIndex]
      const handCards = getPokerHandCards(handTemplate.type)

      setCards(handCards)
      
      // Reveal cards one by one
      for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 300))
        sounds.play('card')
        setCardRevealed(prev => {
          const newRevealed = [...prev]
          newRevealed[i] = true
          return newRevealed
        })
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      
      const handResult = {
        name: handTemplate.name,
        type: handTemplate.type,
        payout: multiplier
      }

      setHand(handResult)

      const isValidProgression = isValidChainProgression(resultIndex)
      
      if (result.multiplier > 0 && isValidProgression) {
        // WIN
        if (gameMode === 'chain') {
          setChainLength(prev => prev + 1)
          setLastHandRank(resultIndex)
          setChainHistory(prev => [...prev, handTemplate.name])
        } else if (gameMode === 'progressive') {
          setChainLength(prev => prev + 1)
          setChainHistory(prev => [...prev, handTemplate.name])
        }
        
        // Enhanced effects
        if (effectsRef.current) {
          if (result.multiplier >= 20) {
            effectsRef.current.winFlash('#ffd700', 4)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#ffd700', 120)
              effectsRef.current?.screenShake(5, 2000)
            }, 600)
          } else if (result.multiplier >= 9) {
            effectsRef.current.winFlash('#e53935', 3.5)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#e53935', 90)
              effectsRef.current?.screenShake(4, 1500)
            }, 400)
          } else if (result.multiplier >= 5) {
            effectsRef.current.winFlash('#8e24aa', 3)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#8e24aa', 70)
              effectsRef.current?.screenShake(3, 1200)
            }, 300)
          } else if (result.multiplier >= 3) {
            effectsRef.current.winFlash('#43a047', 2.5)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#43a047', 50)
              effectsRef.current?.screenShake(2.5, 1000)
            }, 200)
          } else {
            effectsRef.current.winFlash('#1976d2', 2)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#1976d2', 30)
            }, 150)
          }
        }
        
        if (result.multiplier >= 20) {
          sounds.play('jackpot')
        } else {
          sounds.play('win')
        }
        
        if (gameMode === 'single') {
          setCurrentBalance(0)
          setTotalProfit(prev => prev + (result.payout - currentWager))
        } else {
          setCurrentBalance(result.payout)
          setTotalProfit(result.payout - initialWager)
        }
        setHandCount(prev => prev + 1)
        setWinCount(prev => prev + 1)
        setGameCount(prev => prev + 1)
        
        // Update comprehensive game statistics
        const profit = result.payout - currentWager
        setGameStats(prev => ({
          gamesPlayed: prev.gamesPlayed + 1,
          wins: prev.wins + 1,
          losses: prev.losses,
          sessionProfit: prev.sessionProfit + profit,
          bestWin: Math.max(prev.bestWin, profit)
        }))
        
        setShowingResult(true)
        setHasPlayed(true) // Mark as played when result is shown
        
        if (gameMode === 'single') {
          setInProgress(false)
          setChainLength(0)
          setLastHandRank(-1)
          setChainHistory([])
        }
        
      } else {
        // BUST
        if (effectsRef.current) {
          effectsRef.current.loseFlash('#f44336', 2.5)
          setTimeout(() => {
            effectsRef.current?.screenShake(2.5, 1200)
          }, 300)
        }
        
        if (gameMode === 'single') {
          setCurrentBalance(0)
          setTotalProfit(prev => prev - currentWager)
          setHandCount(prev => prev + 1)
          setLossCount(prev => prev + 1)
          setGameCount(prev => prev + 1)
          
          // Update comprehensive game statistics for single mode loss
          const profit = -currentWager
          setGameStats(prev => ({
            gamesPlayed: prev.gamesPlayed + 1,
            wins: prev.wins,
            losses: prev.losses + 1,
            sessionProfit: prev.sessionProfit + profit,
            bestWin: Math.max(prev.bestWin, profit)
          }))
        } else {
          setCurrentBalance(0)
          setTotalProfit(-initialWager)
          setHandCount(prev => prev + 1)
          setLossCount(prev => prev + 1)
          setGameCount(prev => prev + 1)
          
          // Update comprehensive game statistics for chain/progressive mode loss
          const profit = -initialWager
          setGameStats(prev => ({
            gamesPlayed: prev.gamesPlayed + 1,
            wins: prev.wins,
            losses: prev.losses + 1,
            sessionProfit: prev.sessionProfit + profit,
            bestWin: Math.max(prev.bestWin, profit)
          }))
        }
        setShowingResult(true)
        setHasPlayed(true) // Mark as played when result is shown
        setInProgress(false)
        setChainLength(0)
        setLastHandRank(-1)
        setChainHistory([])
        sounds.play('lose')
      }

    } catch (error) {
      console.error('Game error:', error)
    } finally {
      setRevealing(false)
    }
  }

  const handleStart = () => {
    // Reset hasPlayed at start of new game
    setHasPlayed(false)
    
    if (gameMode === 'single') {
      setCurrentBalance(0)
      setChainLength(0)
      setLastHandRank(-1)
      setChainHistory([])
      setInProgress(true)
      setShowingResult(false)
    } else {
      setCurrentBalance(initialWager)
      setTotalProfit(0)
      setHandCount(0)
      setWinCount(0)
      setLossCount(0)
      setGameCount(0)
      setChainLength(0)
      setLastHandRank(-1)
      setChainHistory([])
      setInProgress(true)
      setShowingResult(false)
    }
    
    setHand(null)
    setCards([])
    setCardRevealed([false, false, false, false, false])
    
    sounds.play('play')
    play()
  }

  const handleContinue = () => {
    setShowingResult(false)
    sounds.play('play')
    play()
  }

  // Reset game to allow new wager (like Dice-v2)
  const resetGame = () => {
    setHasPlayed(false)
    setInProgress(false)
    setShowingResult(false)
    setHand(null)
    setCards([])
    setCardRevealed([false, false, false, false, false])
    setCurrentBalance(0)
    setTotalProfit(0)
    setHandCount(0)
    setWinCount(0)
    setLossCount(0)
    setGameCount(0)
    setChainLength(0)
    setLastHandRank(-1)
    setChainHistory([])
  }

  const handleCashOut = () => {
    setInProgress(false)
    setChainLength(0)
    setLastHandRank(-1)
    setChainHistory([])
    sounds.play('win')
  }

  const handleResetStats = () => {
    setTotalProfit(0)
    setHandCount(0)
    setWinCount(0)
    setLossCount(0)
    setGameCount(0)
    setChainHistory([])
    // Reset comprehensive game stats
    setGameStats({
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      sessionProfit: 0,
      bestWin: 0
    })
  }

  // Game state helpers - updated to match Dice-v2 pattern
  const canContinue = (gameMode === 'chain' || gameMode === 'progressive') && inProgress && hand && hand.payout > 0 && !revealing && hasPlayed
  const canCashOut = (gameMode === 'chain' || gameMode === 'progressive') && inProgress && totalProfit > 0 && !revealing
  const gameEnded = hasPlayed && (!inProgress || (hand && hand.payout === 0))
  
  // Play button logic matching Dice-v2
  const getPlayText = () => {
    if (gameMode === 'single') {
      return hasPlayed ? "New" : "Deal"
    } else {
      if (!inProgress && hasPlayed) {
        return "New"
      } else if (canContinue) {
        return gameMode === 'chain' ? "Continue" : "Continue"
      } else {
        return gameMode === 'chain' ? "Start" : "Start"
      }
    }
  }
  
  const getPlayAction = () => {
    if (gameMode === 'single') {
      return hasPlayed ? resetGame : handleStart
    } else {
      if (!inProgress && hasPlayed) {
        return resetGame
      } else if (canContinue) {
        return handleContinue
      } else {
        return handleStart
      }
    }
  }

  useGameMeta('multipoker-v2')

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="MultiPoker"
          gameMode="V2"
          rtp="95"
          stats={gameStats}
          onReset={handleResetStats}
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

          {/* Game Canvas */}
          <canvas 
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            style={{ 
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '120px',
              width: 'calc(100% - 40px)',
              height: 'calc(100% - 140px)',
              imageRendering: 'auto',
              borderRadius: '10px',
              border: '2px solid rgba(212, 165, 116, 0.4)',
              zIndex: 0
            }}
          />
          
          {showModeSelection ? (
            /* Mode Selection GameControlsSection */
            <GameControlsSection>
              {/* Single Mode */}
              <div 
                onClick={() => {
                  setGameMode('single')
                  setShowModeSelection(false)
                }}
                style={{
                  flex: '1',
                  height: '100%',
                  background: gameMode === 'single' 
                    ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.25) 0%, rgba(46, 125, 50, 0.35) 50%, rgba(76, 175, 80, 0.25) 100%)'
                    : 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(46, 125, 50, 0.25) 50%, rgba(76, 175, 80, 0.15) 100%)',
                  borderRadius: '12px',
                  border: `2px solid ${gameMode === 'single' ? 'rgba(76, 175, 80, 0.6)' : 'rgba(76, 175, 80, 0.4)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 4px 16px rgba(76, 175, 80, 0.2), inset 0 1px 0 rgba(76, 175, 80, 0.3)',
                  backdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                <div style={{
                  fontSize: isMobile ? '11px' : '14px',
                  fontWeight: 'bold',
                  color: '#4caf50',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  marginBottom: '4px'
                }}>
                  SINGLE MODE
                </div>
                <div style={{
                  fontSize: isMobile ? '9px' : '11px',
                  color: 'rgba(76, 175, 80, 0.8)',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  display: isMobile ? 'none' : 'block'
                }}>
                  Classic poker • One hand • Any win pays out
                </div>
              </div>

              {/* Chain Mode */}
              <div 
                onClick={() => {
                  setGameMode('chain')
                  setShowModeSelection(false)
                }}
                style={{
                  flex: '1',
                  height: '100%',
                  background: gameMode === 'chain'
                    ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.25) 0%, rgba(245, 124, 0, 0.35) 50%, rgba(255, 152, 0, 0.25) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(245, 124, 0, 0.25) 50%, rgba(255, 152, 0, 0.15) 100%)',
                  borderRadius: '12px',
                  border: `2px solid ${gameMode === 'chain' ? 'rgba(255, 152, 0, 0.6)' : 'rgba(255, 152, 0, 0.4)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 4px 16px rgba(255, 152, 0, 0.2), inset 0 1px 0 rgba(255, 152, 0, 0.3)',
                  backdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                <div style={{
                  fontSize: isMobile ? '11px' : '14px',
                  fontWeight: 'bold',
                  color: '#ff9800',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  marginBottom: '4px'
                }}>
                  CHAIN MODE
                </div>
                <div style={{
                  fontSize: isMobile ? '9px' : '11px',
                  color: 'rgba(255, 152, 0, 0.8)',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  display: isMobile ? 'none' : 'block'
                }}>
                  Progressive builds • Must beat last hand • Higher multipliers
                </div>
              </div>

              {/* Progressive Mode */}
              <div 
                onClick={() => {
                  setGameMode('progressive')
                  setShowModeSelection(false)
                }}
                style={{
                  flex: '1',
                  height: '100%',
                  background: gameMode === 'progressive'
                    ? 'linear-gradient(135deg, rgba(184, 51, 106, 0.25) 0%, rgba(136, 14, 79, 0.35) 50%, rgba(184, 51, 106, 0.25) 100%)'
                    : 'linear-gradient(135deg, rgba(184, 51, 106, 0.15) 0%, rgba(136, 14, 79, 0.25) 50%, rgba(184, 51, 106, 0.15) 100%)',
                  borderRadius: '12px',
                  border: `2px solid ${gameMode === 'progressive' ? 'rgba(184, 51, 106, 0.6)' : 'rgba(184, 51, 106, 0.4)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 4px 16px rgba(184, 51, 106, 0.2), inset 0 1px 0 rgba(184, 51, 106, 0.3)',
                  backdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                <div style={{
                  fontSize: isMobile ? '11px' : '14px',
                  fontWeight: 'bold',
                  color: '#b8336a',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  marginBottom: '4px'
                }}>
                  PROGRESSIVE
                </div>
                <div style={{
                  fontSize: isMobile ? '9px' : '11px',
                  color: 'rgba(184, 51, 106, 0.8)',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  display: isMobile ? 'none' : 'block'
                }}>
                  Compound wins • Straight+ only • Maximum risk & reward
                </div>
              </div>
            </GameControlsSection>
          ) : (
            /* Mode-Specific GameControlsSection */
            <GameControlsSection>
              {/* Back Button */}
              <div 
                onClick={() => !inProgress && setShowModeSelection(true)}
                style={{
                  flex: isMobile ? '1' : '0 0 120px',
                  height: '100%',
                  background: inProgress 
                    ? 'linear-gradient(135deg, rgba(100, 100, 100, 0.15) 0%, rgba(80, 80, 80, 0.25) 50%, rgba(100, 100, 100, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(139, 90, 158, 0.15) 0%, rgba(106, 27, 154, 0.25) 50%, rgba(139, 90, 158, 0.15) 100%)',
                  borderRadius: '12px',
                  border: inProgress 
                    ? '2px solid rgba(100, 100, 100, 0.4)'
                    : '2px solid rgba(139, 90, 158, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: inProgress 
                    ? '0 2px 8px rgba(100, 100, 100, 0.1), inset 0 1px 0 rgba(100, 100, 100, 0.2)'
                    : '0 4px 16px rgba(139, 90, 158, 0.2), inset 0 1px 0 rgba(139, 90, 158, 0.3)',
                  backdropFilter: 'blur(8px)',
                  cursor: inProgress ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: inProgress ? 0.5 : 1
                }}>
                <div style={{
                  fontSize: isMobile ? '11px' : '14px',
                  fontWeight: 'bold',
                  color: inProgress ? '#666' : '#8b5a9e',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  marginBottom: '2px'
                }}>
                  ←
                </div>
                <div style={{
                  fontSize: isMobile ? '9px' : '11px',
                  color: inProgress ? 'rgba(100, 100, 100, 0.7)' : 'rgba(139, 90, 158, 0.8)',
                  textAlign: 'center'
                }}>
                  {inProgress ? 'LOCKED' : 'BACK'}
                </div>
              </div>

              {/* Mode-Specific Stats */}
              {gameMode === 'single' && (
                <>
                  <div style={{
                    flex: isMobile ? '1' : '0 0 140px',
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
                      fontSize: isMobile ? '11px' : '14px',
                      fontWeight: 'bold',
                      color: '#4caf50',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      marginBottom: '4px'
                    }}>
                      HAND TYPE
                    </div>
                    <div style={{
                      fontSize: isMobile ? '16px' : '18px',
                      color: 'rgba(76, 175, 80, 0.9)',
                      fontWeight: '600'
                    }}>
                      {currentHandType || 'Deal Cards'}
                    </div>
                  </div>

                  <div style={{
                    flex: isMobile ? '1' : '0 0 140px',
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
                      fontSize: isMobile ? '11px' : '14px',
                      fontWeight: 'bold',
                      color: '#ff9800',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      marginBottom: '4px'
                    }}>
                      MULTIPLIER
                    </div>
                    <div style={{
                      fontSize: isMobile ? '16px' : '18px',
                      color: 'rgba(255, 152, 0, 0.9)',
                      fontWeight: '600'
                    }}>
                      {currentMultiplier ? `${currentMultiplier.toFixed(2)}x` : '-'}
                    </div>
                  </div>

                  <div style={{
                    flex: isMobile ? '1' : '0 0 140px',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(21, 101, 192, 0.25) 50%, rgba(33, 150, 243, 0.15) 100%)',
                    borderRadius: '12px',
                    border: '2px solid rgba(33, 150, 243, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 16px rgba(33, 150, 243, 0.2), inset 0 1px 0 rgba(33, 150, 243, 0.3)',
                    backdropFilter: 'blur(8px)'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '11px' : '14px',
                      fontWeight: 'bold',
                      color: '#2196f3',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      marginBottom: '4px'
                    }}>
                      WIN CHANCE
                    </div>
                    <div style={{
                      fontSize: isMobile ? '16px' : '18px',
                      color: 'rgba(33, 150, 243, 0.9)',
                      fontWeight: '600'
                    }}>
                      {Math.round((1 - (BET_ARRAYS_V2['multipoker-v2'].calculateBetArray().filter(x => x === 0).length / BET_ARRAYS_V2['multipoker-v2'].calculateBetArray().length)) * 100)}%
                    </div>
                  </div>

                  <div style={{
                    flex: isMobile ? '1' : '0 0 140px',
                    height: '100%',
                    background: poolExceeded 
                      ? 'linear-gradient(135deg, rgba(255, 0, 102, 0.25) 0%, rgba(220, 0, 85, 0.35) 50%, rgba(255, 0, 102, 0.25) 100%)'
                      : 'linear-gradient(135deg, rgba(156, 39, 176, 0.15) 0%, rgba(106, 27, 154, 0.25) 50%, rgba(156, 39, 176, 0.15) 100%)',
                    borderRadius: '12px',
                    border: poolExceeded 
                      ? '2px solid rgba(255, 0, 102, 0.6)' 
                      : '2px solid rgba(156, 39, 176, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: poolExceeded 
                      ? '0 4px 16px rgba(255, 0, 102, 0.3), inset 0 1px 0 rgba(255, 0, 102, 0.4)' 
                      : '0 4px 16px rgba(156, 39, 176, 0.2), inset 0 1px 0 rgba(156, 39, 176, 0.3)',
                    backdropFilter: 'blur(8px)'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '11px' : '14px',
                      fontWeight: 'bold',
                      color: poolExceeded ? '#ff0066' : '#9c27b0',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      marginBottom: '4px'
                    }}>
                      {poolExceeded ? 'POOL LIMIT' : 'CURRENT WAGER'}
                    </div>
                    <div style={{
                      fontSize: isMobile ? '16px' : '18px',
                      color: 'rgba(156, 39, 176, 0.9)',
                      fontWeight: '600'
                    }}>
                      <TokenValue amount={initialWager} />
                    </div>
                  </div>
                </>
              )}

              {gameMode === 'chain' && (
                <>
                  <div style={{
                    flex: isMobile ? '1' : '0 0 140px',
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
                      fontSize: isMobile ? '11px' : '14px',
                      fontWeight: 'bold',
                      color: '#ff9800',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      marginBottom: '4px'
                    }}>
                      CHAIN LENGTH
                    </div>
                    <div style={{
                      fontSize: isMobile ? '16px' : '18px',
                      color: 'rgba(255, 152, 0, 0.9)',
                      fontWeight: '600'
                    }}>
                      {chainLength}
                    </div>
                  </div>

                  <div style={{
                    flex: isMobile ? '1' : '0 0 140px',
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
                      fontSize: isMobile ? '11px' : '14px',
                      fontWeight: 'bold',
                      color: '#b8336a',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      marginBottom: '4px'
                    }}>
                      LAST HAND
                    </div>
                    <div style={{
                      fontSize: isMobile ? '16px' : '18px',
                      color: 'rgba(184, 51, 106, 0.9)',
                      fontWeight: '600'
                    }}>
                      {lastHandRank >= 0 ? BET_ARRAYS_V2['multipoker-v2'].getHandName(lastHandRank) : 'None'}
                    </div>
                  </div>

                  <div style={{
                    flex: isMobile ? '1' : '0 0 140px',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(21, 101, 192, 0.25) 50%, rgba(33, 150, 243, 0.15) 100%)',
                    borderRadius: '12px',
                    border: '2px solid rgba(33, 150, 243, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 16px rgba(33, 150, 243, 0.2), inset 0 1px 0 rgba(33, 150, 243, 0.3)',
                    backdropFilter: 'blur(8px)'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '11px' : '14px',
                      fontWeight: 'bold',
                      color: '#2196f3',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      marginBottom: '4px'
                    }}>
                      NEXT TARGET
                    </div>
                    <div style={{
                      fontSize: isMobile ? '16px' : '18px',
                      color: 'rgba(33, 150, 243, 0.9)',
                      fontWeight: '600'
                    }}>
                      {chainLength === 0 ? 'Straight+' : lastHandRank >= 0 ? BET_ARRAYS_V2['multipoker-v2'].getHandName(Math.min(lastHandRank + 1, 8)) : 'Beat Last'}
                    </div>
                  </div>

                  <div style={{
                    flex: isMobile ? '1' : '0 0 140px',
                    height: '100%',
                    background: poolExceeded 
                      ? 'linear-gradient(135deg, rgba(255, 0, 102, 0.25) 0%, rgba(220, 0, 85, 0.35) 50%, rgba(255, 0, 102, 0.25) 100%)'
                      : 'linear-gradient(135deg, rgba(156, 39, 176, 0.15) 0%, rgba(106, 27, 154, 0.25) 50%, rgba(156, 39, 176, 0.15) 100%)',
                    borderRadius: '12px',
                    border: poolExceeded 
                      ? '2px solid rgba(255, 0, 102, 0.6)' 
                      : '2px solid rgba(156, 39, 176, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: poolExceeded 
                      ? '0 4px 16px rgba(255, 0, 102, 0.3), inset 0 1px 0 rgba(255, 0, 102, 0.4)' 
                      : '0 4px 16px rgba(156, 39, 176, 0.2), inset 0 1px 0 rgba(156, 39, 176, 0.3)',
                    backdropFilter: 'blur(8px)'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '11px' : '14px',
                      fontWeight: 'bold',
                      color: '#9c27b0',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      marginBottom: '4px'
                    }}>
                      COMPOUND WAGER
                    </div>
                    <div style={{
                      fontSize: isMobile ? '16px' : '18px',
                      color: 'rgba(156, 39, 176, 0.9)',
                      fontWeight: '600'
                    }}>
                      <TokenValue amount={chainLength > 0 ? currentBalance : initialWager} />
                    </div>
                  </div>
                </>
              )}

              {gameMode === 'progressive' && (
                <>
                  <div style={{
                    flex: isMobile ? '1' : '0 0 140px',
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
                      fontSize: isMobile ? '11px' : '14px',
                      fontWeight: 'bold',
                      color: '#b8336a',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      marginBottom: '4px'
                    }}>
                      PROGRESSION
                    </div>
                    <div style={{
                      fontSize: isMobile ? '16px' : '18px',
                      color: 'rgba(184, 51, 106, 0.9)',
                      fontWeight: '600'
                    }}>
                      Level {chainLength + 1}
                    </div>
                  </div>

                  <div style={{
                    flex: isMobile ? '1' : '0 0 140px',
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
                      fontSize: isMobile ? '11px' : '14px',
                      fontWeight: 'bold',
                      color: '#ff9800',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      marginBottom: '4px'
                    }}>
                      RISK LEVEL
                    </div>
                    <div style={{
                      fontSize: isMobile ? '16px' : '18px',
                      color: 'rgba(255, 152, 0, 0.9)',
                      fontWeight: '600'
                    }}>
                      {chainLength === 0 ? 'High' : chainLength < 3 ? 'Extreme' : 'Maximum'}
                    </div>
                  </div>

                  <div style={{
                    flex: isMobile ? '1' : '0 0 140px',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.15) 0%, rgba(194, 24, 91, 0.25) 50%, rgba(233, 30, 99, 0.15) 100%)',
                    borderRadius: '12px',
                    border: '2px solid rgba(233, 30, 99, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 16px rgba(233, 30, 99, 0.2), inset 0 1px 0 rgba(233, 30, 99, 0.3)',
                    backdropFilter: 'blur(8px)'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '11px' : '14px',
                      fontWeight: 'bold',
                      color: '#e91e63',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      marginBottom: '4px'
                    }}>
                      MIN HAND
                    </div>
                    <div style={{
                      fontSize: isMobile ? '16px' : '18px',
                      color: 'rgba(233, 30, 99, 0.9)',
                      fontWeight: '600'
                    }}>
                      Straight+
                    </div>
                  </div>

                  <div style={{
                    flex: isMobile ? '1' : '0 0 140px',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.15) 0%, rgba(81, 45, 168, 0.25) 50%, rgba(103, 58, 183, 0.15) 100%)',
                    borderRadius: '12px',
                    border: '2px solid rgba(103, 58, 183, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 16px rgba(103, 58, 183, 0.2), inset 0 1px 0 rgba(103, 58, 183, 0.3)',
                    backdropFilter: 'blur(8px)'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '11px' : '14px',
                      fontWeight: 'bold',
                      color: '#673ab7',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      marginBottom: '4px'
                    }}>
                      MAX MULTIPLIER
                    </div>
                    <div style={{
                      fontSize: isMobile ? '16px' : '18px',
                      color: 'rgba(103, 58, 183, 0.9)',
                      fontWeight: '600'
                    }}>
                      {maxMultiplier}x
                    </div>
                  </div>

                  <div style={{
                    flex: isMobile ? '1' : '0 0 140px',
                    height: '100%',
                    background: poolExceeded 
                      ? 'linear-gradient(135deg, rgba(255, 0, 102, 0.25) 0%, rgba(220, 0, 85, 0.35) 50%, rgba(255, 0, 102, 0.25) 100%)'
                      : 'linear-gradient(135deg, rgba(0, 150, 136, 0.15) 0%, rgba(0, 121, 107, 0.25) 50%, rgba(0, 150, 136, 0.15) 100%)',
                    borderRadius: '12px',
                    border: poolExceeded 
                      ? '2px solid rgba(255, 0, 102, 0.6)' 
                      : '2px solid rgba(0, 150, 136, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: poolExceeded 
                      ? '0 4px 16px rgba(255, 0, 102, 0.3), inset 0 1px 0 rgba(255, 0, 102, 0.4)' 
                      : '0 4px 16px rgba(0, 150, 136, 0.2), inset 0 1px 0 rgba(0, 150, 136, 0.3)',
                    backdropFilter: 'blur(8px)'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '11px' : '14px',
                      fontWeight: 'bold',
                      color: '#009688',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      marginBottom: '4px'
                    }}>
                      COMPOUND WAGER
                    </div>
                    <div style={{
                      fontSize: isMobile ? '16px' : '18px',
                      color: 'rgba(0, 150, 136, 0.9)',
                      fontWeight: '600'
                    }}>
                      <TokenValue amount={chainLength > 0 ? currentBalance : initialWager} />
                    </div>
                  </div>
                </>
              )}
            </GameControlsSection>
          )}

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
        {!showModeSelection && (
          <>
            <MobileControls
              wager={initialWager}
              setWager={setInitialWager}
              onPlay={getPlayAction()}
              playDisabled={revealing || !pool || gamba.isPlaying || poolExceeded}
              playText={getPlayText()}
            >
              {canCashOut && (
                <EnhancedButton 
                  variant="danger"
                  onClick={handleCashOut}
                >
                  Cash Out (<TokenValue amount={totalProfit} />)
                </EnhancedButton>
              )}
            </MobileControls>
            
            <DesktopControls
              wager={initialWager}
              setWager={setInitialWager}
              onPlay={getPlayAction()}
              playDisabled={revealing || !pool || gamba.isPlaying || poolExceeded}
              playText={getPlayText()}
            >
              <EnhancedWagerInput value={initialWager} onChange={setInitialWager} multiplier={maxMultiplier} />
              {canCashOut && (
                <EnhancedButton 
                  variant="danger"
                  onClick={handleCashOut}
                >
                  Cash Out (<TokenValue amount={totalProfit} />)
                </EnhancedButton>
              )}
              <EnhancedPlayButton 
                onClick={getPlayAction()} 
                disabled={revealing || !pool || gamba.isPlaying || poolExceeded}
              >
                {getPlayText()}
              </EnhancedPlayButton>
            </DesktopControls>
          </>
        )}
      </GambaUi.Portal>
    </>
  )
}
