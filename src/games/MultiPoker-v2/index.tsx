import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { BET_ARRAYS_V2 } from '../rtpConfig-v2'
import { EnhancedWagerInput, EnhancedPlayButton, EnhancedButton, MobileControls, DesktopControls } from '../../components'
import { useGameMeta } from '../useGameMeta'
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
  const [showModeSelection, setShowModeSelection] = React.useState(true) // Start with mode selection
  const [hasPlayed, setHasPlayed] = React.useState(false) // Track if player has played like Dice-v2

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

  const drawModeSelection = (ctx: CanvasRenderingContext2D) => {
    console.log('🎨 drawModeSelection function called!')
    // Don't clear background - let the degen background show through
    
    // Title
    ctx.fillStyle = '#ffffff' // Bright white for visibility
    ctx.font = 'bold 36px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Multi Poker V2', CANVAS_WIDTH/2, 80)
    console.log('✅ Title drawn')
    
    ctx.fillStyle = '#cccccc' // Light gray for subtitle
    ctx.font = '18px Arial'
    ctx.fillText('Choose your game mode', CANVAS_WIDTH/2, 120)
    console.log('✅ Subtitle drawn')
    
    // Mode buttons
    const modes = [
      { id: 'single', name: 'Single Hand', desc: 'Play independent hands' },
      { id: 'chain', name: 'Chain Mode', desc: 'Build progressively better hands' },
      { id: 'progressive', name: 'Progressive', desc: 'Any win continues the streak' }
    ]
    
    const buttonWidth = 280
    const buttonHeight = 80
    const startY = 180
    const spacing = 100
    
    modes.forEach((mode, index) => {
      const x = CANVAS_WIDTH/2 - buttonWidth/2
      const y = startY + index * spacing
      const isSelected = gameMode === mode.id
      
      // Button background - use more visible colors
      ctx.fillStyle = isSelected ? '#444444' : '#333333'
      ctx.strokeStyle = isSelected ? '#ffffff' : '#666666'
      ctx.lineWidth = 3
      
      ctx.beginPath()
      ctx.roundRect(x, y, buttonWidth, buttonHeight, 12)
      ctx.fill()
      ctx.stroke()
      
      // Button text
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 20px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(mode.name, CANVAS_WIDTH/2, y + 30)
      
      ctx.fillStyle = '#cccccc'
      ctx.font = '14px Arial'
      ctx.fillText(mode.desc, CANVAS_WIDTH/2, y + 55)
    })
    
    // Continue button if mode selected
    const continueY = startY + modes.length * spacing + 20
    ctx.fillStyle = '#666666'
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    
    ctx.beginPath()
    ctx.roundRect(CANVAS_WIDTH/2 - 100, continueY, 200, 50, 8)
    ctx.fill()
    ctx.stroke()
    
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 18px Arial'
    ctx.fillText('Start Game', CANVAS_WIDTH/2, continueY + 32)
  }

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
      console.log('🎯 Drawing mode selection screen')
      // Show mode selection screen
      drawModeSelection(ctx)
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
    if (canvas && showModeSelection) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        console.log('Drawing mode selection screen')
        drawModeSelection(ctx)
      } else {
        console.log('Could not get canvas context')
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
            console.log('Emergency mode selection draw')
            drawModeSelection(ctx)
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
        } else {
          setCurrentBalance(0)
          setTotalProfit(-initialWager)
          setHandCount(prev => prev + 1)
          setLossCount(prev => prev + 1)
          setGameCount(prev => prev + 1)
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
  }

  // Game state helpers - updated to match Dice-v2 pattern
  const canContinue = (gameMode === 'chain' || gameMode === 'progressive') && inProgress && hand && hand.payout > 0 && !revealing && hasPlayed
  const canCashOut = (gameMode === 'chain' || gameMode === 'progressive') && inProgress && totalProfit > 0 && !revealing
  const gameEnded = hasPlayed && (!inProgress || (hand && hand.payout === 0))
  
  // Play button logic matching Dice-v2
  const getPlayText = () => {
    if (gameMode === 'single') {
      return hasPlayed ? "New Game" : "Deal Cards"
    } else {
      if (!inProgress && hasPlayed) {
        return "New Game"
      } else if (canContinue) {
        return gameMode === 'chain' ? "Continue Chain" : "Continue Streak"
      } else {
        return gameMode === 'chain' ? "Start Chain" : "Start Streak"
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
      <GambaUi.Portal target="screen">
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'linear-gradient(135deg, #0a0511 0%, #0d0618 25%, #0f081c 50%, #0a0511 75%, #0a0511 100%)',
          perspective: '100px'
        }}>
          {/* Single canvas that's always mounted */}
          <canvas 
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={handleCanvasClick}
            style={{ 
              position: 'absolute',
              top: showModeSelection ? '0' : '120px',
              left: showModeSelection ? '0' : '20px',
              right: showModeSelection ? '0' : '20px',
              bottom: showModeSelection ? '0' : '20px',
              width: showModeSelection ? '100%' : 'calc(100% - 40px)',
              height: showModeSelection ? '100%' : 'calc(100% - 140px)',
              imageRendering: 'auto',
              cursor: 'pointer',
              borderRadius: showModeSelection ? '0' : '10px',
              border: showModeSelection ? 'none' : '2px solid rgba(212, 165, 116, 0.4)',
              zIndex: showModeSelection ? 1 : 0
            }}
          />
          
          {!showModeSelection && (
            <>
              {/* Game Stats Header */}
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
                    MultiPoker v2
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(212, 165, 116, 0.8)' }}>
                    {gameMode === 'single' ? 'Single Play • 99.5% RTP' : 
                     gameMode === 'chain' ? 'Chain Mode • Progressive' : 
                     'Progressive • Compound'}
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
                    {lossCount}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(212, 165, 116, 0.8)' }}>Losses</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: winCount > lossCount ? '#4caf50' : winCount < lossCount ? '#f44336' : '#d4a574' 
                  }}>
                    {(() => {
                      if (winCount === 0 && lossCount === 0) return '0.00'
                      if (lossCount === 0) return '+∞'
                      const ratio = winCount / lossCount
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
                  <EnhancedButton
                    onClick={handleResetStats}
                    disabled={gamba.isPlaying}
                    variant="secondary"
                  >
                    Reset
                  </EnhancedButton>
                </div>
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
            />
          </>
        )}
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        {!showModeSelection && (
          <>
            <MobileControls
              wager={initialWager}
              setWager={setInitialWager}
              onPlay={getPlayAction()}
              playDisabled={revealing || !pool || (gamba.isPlaying)}
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
              playDisabled={revealing || !pool || (gamba.isPlaying)}
              playText={getPlayText()}
            />
          </>
        )}
      </GambaUi.Portal>
    </>
  )
}
