import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import { BET_ARRAYS_V2 } from '../rtpConfig-v2'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { EnhancedWagerInput, EnhancedButton, MobileControls, DesktopControls, GameControlsSection } from '../../components'
import { useGameStats } from '../../hooks/game/useGameStats'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { useGameMeta } from '../useGameMeta'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { 
  CANVAS_WIDTH, CANVAS_HEIGHT, CARD_WIDTH, CARD_HEIGHT, CARD_SPACING,
  CARD_NAMES, SUIT_SYMBOLS, SUIT_COLORS, CARD_BACK_IMAGE,
  SOUND_WIN, SOUND_LOSE, SOUND_DEAL, SOUND_PLAY,
  ROMANTIC_COLORS, GameState, Card
} from './constants'

export default function BlackJackV2() {
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
    deal: SOUND_DEAL,
    play: SOUND_PLAY,
  })

  // Canvas ref
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const animationRef = React.useRef<number>()
  
  // Game state
  const [gameState, setGameState] = React.useState<GameState>('idle')
  const [playerCards, setPlayerCards] = React.useState<Card[]>([])
  const [dealerCards, setDealerCards] = React.useState<Card[]>([])
  const [showDealerCard, setShowDealerCard] = React.useState(false)
  const [totalProfit, setTotalProfit] = React.useState(0)
  const [gameCount, setGameCount] = React.useState(0)
  const [winCount, setWinCount] = React.useState(0)
  const [lossCount, setLossCount] = React.useState(0)
  const [inProgress, setInProgress] = React.useState(false)
  const [showingResult, setShowingResult] = React.useState(false)
  const [hasPlayed, setHasPlayed] = React.useState(false)
  const [gameOutcome, setGameOutcome] = React.useState<string | null>(null)
  const [lastResult, setLastResult] = React.useState<any>(null)
  
  // Card animation states
  const [dealerCardFlipped, setDealerCardFlipped] = React.useState<boolean[]>([false, false])
  const [playerCardFlipped, setPlayerCardFlipped] = React.useState<boolean[]>([false, false])
  const [animationTime, setAnimationTime] = React.useState(0)
  
  // Load card back image
  const [cardBackImg, setCardBackImg] = React.useState<HTMLImageElement | null>(null)
  
  // Game statistics tracking - using centralized hook
  const gameStats = useGameStats('blackjack-v2')
  
  React.useEffect(() => {
    const img = new Image()
    img.onload = () => setCardBackImg(img)
    img.src = CARD_BACK_IMAGE
  }, [])

  // Get configuration
  const config = BET_ARRAYS_V2['blackjack-v2']

  // Pool restrictions
  const maxMultiplier = React.useMemo(() => {
    const betArray = config.calculateBetArray()
    return Math.max(...betArray)
  }, [config])

  const maxWagerForPool = React.useMemo(() => {
    return pool.maxPayout / maxMultiplier
  }, [pool.maxPayout, maxMultiplier])

  const maxPayout = initialWager * maxMultiplier
  const poolExceeded = maxPayout > pool.maxPayout

  // Card utilities
  const calculateHandValue = React.useCallback((cards: Card[]) => {
    return config.calculateHandValue(cards)
  }, [config])

  const isBlackjack = React.useCallback((cards: Card[]) => {
    return config.isBlackjack(cards)
  }, [config])

  const isBust = React.useCallback((cards: Card[]) => {
    return config.isBust(cards)
  }, [config])

  // Generate cards from blockchain result
  const generateCardsFromResult = React.useCallback((resultIndex: number) => {
    const rng = makeDeterministicRng(resultIndex.toString())
    const cards: Card[] = []
    
    // Generate 4 initial cards (2 player, 2 dealer)
    for (let i = 0; i < 4; i++) {
      cards.push({
        rank: Math.floor(rng() * 13),
        suit: Math.floor(rng() * 4)
      })
    }
    
    return {
      playerCards: [cards[0], cards[1]],
      dealerCards: [cards[2], cards[3]]
    }
  }, [])

  // Play game
  const play = React.useCallback(async () => {
    if (gamba.isPlaying) return

    try {
      setInProgress(true)
      setGameState('dealing')
      setShowingResult(false)
      setShowDealerCard(false)
      setGameOutcome(null)
      
      sounds.play('play')
      
      const betArray = config.calculateBetArray()
      
      await game.play({
        bet: betArray,
        wager: initialWager,
        metadata: ['blackjack-v2'],
      })

      const result = await game.result()
      setLastResult(result)
      
      // Generate deterministic cards that match the result
      const rng = makeDeterministicRng(result.resultIndex.toString())
      let playerCards: Card[] = []
      let dealerCards: Card[] = []
      
      // Keep generating hands until we get the result we need
      let attempts = 0
      while (attempts < 100) {
        // Generate initial 2 cards for each
        playerCards = [
          { rank: Math.floor(rng() * 13), suit: Math.floor(rng() * 4) },
          { rank: Math.floor(rng() * 13), suit: Math.floor(rng() * 4) }
        ]
        dealerCards = [
          { rank: Math.floor(rng() * 13), suit: Math.floor(rng() * 4) },
          { rank: Math.floor(rng() * 13), suit: Math.floor(rng() * 4) }
        ]
        
        const playerValue = calculateHandValue(playerCards)
        const dealerValue = calculateHandValue(dealerCards)
        const playerBJ = isBlackjack(playerCards)
        const dealerBJ = isBlackjack(dealerCards)
        
        // Check if this hand matches our result
        let matchesResult = false
        
        if (result.resultIndex === 0) {
          // Player loses - dealer wins or player busts
          matchesResult = (dealerBJ && !playerBJ) || (dealerValue > playerValue && dealerValue <= 21) || playerValue > 21
        } else if (result.resultIndex === 1) {
          // Player wins - player has better hand
          matchesResult = (playerBJ && !dealerBJ) || (playerValue <= 21 && (dealerValue > 21 || playerValue > dealerValue))
        } else if (result.resultIndex === 2) {
          // Player BlackJack
          matchesResult = playerBJ && !dealerBJ
        } else {
          // Push - same values
          matchesResult = playerValue === dealerValue || (playerBJ && dealerBJ)
        }
        
        if (matchesResult) break
        attempts++
      }
      
      setPlayerCards(playerCards)
      setDealerCards(dealerCards)
      
      // Reset card flip states
      setDealerCardFlipped([false, false])
      setPlayerCardFlipped([false, false])
      setAnimationTime(0)
      
      // Deal animation with card flips
      setTimeout(() => {
        sounds.play('deal')
        // Flip player cards first
        setPlayerCardFlipped([true, false])
        setTimeout(() => {
          setPlayerCardFlipped([true, true])
          setTimeout(() => {
            // Flip first dealer card
            setDealerCardFlipped([true, false])
            // Second dealer card stays face down until reveal
          }, 300)
        }, 300)
      }, 500)

      // Determine game outcome based on actual result
      let outcome: string
      let won = false
      
      if (result.resultIndex === 0) {
        outcome = 'Dealer Wins'
        won = false
      } else if (result.resultIndex === 1) {
        outcome = 'Player Wins!'
        won = true
      } else if (result.resultIndex === 2) {
        outcome = 'BlackJack!'
        won = true
      } else {
        outcome = 'Push'
        won = false // Push counts as loss in Gamba system
      }
      
      setTimeout(() => {
        setShowDealerCard(true)
        setDealerCardFlipped([true, true]) // Flip second dealer card
        setGameOutcome(outcome)
        setGameState('game-over')
        
        // Update session stats
        const profit = result.payout - initialWager
        setTotalProfit(prev => prev + profit)
        setGameCount(prev => prev + 1)
        
        // Update comprehensive game statistics
        const isWin = won
        gameStats.updateStats(isWin ? 1 : 0)
        
        if (won) {
          setWinCount(prev => prev + 1)
          sounds.play('win')
          effectsRef.current?.jackpot()
        } else {
          // All non-wins count as losses (including pushes)
          setLossCount(prev => prev + 1)
          sounds.play('lose')
        }
        
        setShowingResult(true)
        setHasPlayed(true)
      }, 1500)
      
    } catch (error) {
      console.error('Error playing BlackJack:', error)
    } finally {
      setInProgress(false)
    }
  }, [gamba, initialWager, config, sounds, calculateHandValue, isBlackjack, game])

  // Reset session
  const resetSession = React.useCallback(() => {
    setTotalProfit(0)
    setGameCount(0)
    setWinCount(0)
    setLossCount(0)
    sounds.play('play')
  }, [sounds])

  // Reset game to allow new wager
  const resetGame = React.useCallback(() => {
    setHasPlayed(false)
    setInProgress(false)
    setShowingResult(false)
    setLastResult(null)
    setGameState('idle')
    setPlayerCards([])
    setDealerCards([])
    setShowDealerCard(false)
    setGameOutcome(null)
    setDealerCardFlipped([false, false])
    setPlayerCardFlipped([false, false])
  }, [])

  // Play button logic
  const getPlayText = () => {
    if (gameState === 'dealing') return "Dealing..."
    return hasPlayed ? "New" : "Deal"
  }
  
  const getPlayAction = () => {
    return hasPlayed ? resetGame : play
  }

  // Draw individual card with flip animation
  const drawCard = React.useCallback((ctx: CanvasRenderingContext2D, card: Card, x: number, y: number, faceDown = false, isFlipped = true) => {
    if (faceDown && !isFlipped) {
      // Show card back when face down and not flipped
      if (cardBackImg) {
        ctx.drawImage(cardBackImg, x, y, CARD_WIDTH, CARD_HEIGHT)
      } else {
        // Fallback card back
        ctx.fillStyle = '#000080'
        ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT)
        ctx.strokeStyle = '#FFD700'
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT)
      }
    } else if (isFlipped) {
      // Show card face when flipped
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT)
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT)
      
      // Card content
      const isRed = card.suit === 1 || card.suit === 2
      ctx.fillStyle = isRed ? SUIT_COLORS[1] : SUIT_COLORS[0]
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(CARD_NAMES[card.rank], x + 8, y + 22)
      
      ctx.font = '24px Arial'
      ctx.fillText(SUIT_SYMBOLS[card.suit], x + 8, y + 50)
      
      // Bottom right (rotated)
      ctx.save()
      ctx.translate(x + CARD_WIDTH - 8, y + CARD_HEIGHT - 8)
      ctx.rotate(Math.PI)
      ctx.font = 'bold 12px Arial'
      ctx.fillText(CARD_NAMES[card.rank], 0, 14)
      ctx.font = '16px Arial'
      ctx.fillText(SUIT_SYMBOLS[card.suit], 0, 32)
      ctx.restore()
    } else {
      // Show card back when not flipped
      if (cardBackImg) {
        ctx.drawImage(cardBackImg, x, y, CARD_WIDTH, CARD_HEIGHT)
      } else {
        // Fallback card back
        ctx.fillStyle = '#000080'
        ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT)
        ctx.strokeStyle = '#FFD700'
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT)
      }
    }
  }, [cardBackImg])

  // Canvas drawing
  const draw = React.useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    // Professional BlackJack table background
    const gradient = ctx.createRadialGradient(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 0, CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH/2)
    gradient.addColorStop(0, '#0f4c2c')
    gradient.addColorStop(0.6, '#0a3d23')
    gradient.addColorStop(1, '#062818')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    // Table felt texture
    ctx.fillStyle = 'rgba(15, 76, 44, 0.8)'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    // Table edge/border
    ctx.strokeStyle = '#8B4513'
    ctx.lineWidth = 8
    ctx.strokeRect(4, 4, CANVAS_WIDTH - 8, CANVAS_HEIGHT - 8)
    
    // BlackJack table arc
    ctx.beginPath()
    ctx.arc(CANVAS_WIDTH/2, CANVAS_HEIGHT - 50, CANVAS_WIDTH/3, Math.PI, 0)
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // BlackJack logo in center
    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 24px serif'
    ctx.textAlign = 'center'
    ctx.fillText('BLACKJACK', CANVAS_WIDTH/2, 50)
    ctx.font = '16px serif'
    ctx.fillText('Dealer must hit soft 17', CANVAS_WIDTH/2, 75)
    
    // Dealer section
    ctx.fillStyle = 'rgba(255, 215, 0, 0.1)'
    ctx.fillRect(50, 100, CANVAS_WIDTH - 100, 160)
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 2
    ctx.strokeRect(50, 100, CANVAS_WIDTH - 100, 160)
    
    // Dealer label
    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 20px serif'
    ctx.textAlign = 'left'
    ctx.fillText('DEALER', 70, 125)
    
    // Dealer score
    if (showDealerCard && dealerCards.length > 0) {
      const dealerValue = calculateHandValue(dealerCards)
      const isBust = dealerValue > 21
      ctx.fillStyle = isBust ? '#ff4444' : '#FFD700'
      ctx.font = 'bold 18px serif'
      ctx.textAlign = 'right'
      ctx.fillText(`${dealerValue}${isBust ? ' BUST' : ''}`, CANVAS_WIDTH - 70, 125)
    } else if (dealerCards.length > 0) {
      ctx.fillStyle = '#FFD700'
      ctx.font = 'bold 18px serif'
      ctx.textAlign = 'right'
      ctx.fillText('?', CANVAS_WIDTH - 70, 125)
    }
    
    // Draw dealer cards with proper spacing and flip animation
    if (dealerCards.length > 0) {
      dealerCards.forEach((card, index) => {
        const cardSpacing = 80
        const startX = CANVAS_WIDTH/2 - (dealerCards.length * cardSpacing)/2
        const x = startX + index * cardSpacing
        const y = 140
        
        const isFlipped = dealerCardFlipped[index]
        
        if (!showDealerCard && index === 1) {
          // Face down card (second dealer card)
          drawCard(ctx, card, x, y, true, isFlipped)
        } else {
          drawCard(ctx, card, x, y, false, isFlipped)
        }
      })
    } else {
      // Show placeholder cards when idle
      for (let i = 0; i < 2; i++) {
        const cardSpacing = 80
        const startX = CANVAS_WIDTH/2 - (2 * cardSpacing)/2
        const x = startX + i * cardSpacing
        const y = 140
        
        // Draw card back placeholders
        if (cardBackImg) {
          ctx.drawImage(cardBackImg, x, y, CARD_WIDTH, CARD_HEIGHT)
        } else {
          // Fallback card back
          ctx.fillStyle = '#000080'
          ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT)
          ctx.strokeStyle = '#FFD700'
          ctx.lineWidth = 2
          ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT)
        }
      }
    }
    
    // Player section
    ctx.fillStyle = 'rgba(255, 215, 0, 0.1)'
    ctx.fillRect(50, CANVAS_HEIGHT - 200, CANVAS_WIDTH - 100, 160)
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 2
    ctx.strokeRect(50, CANVAS_HEIGHT - 200, CANVAS_WIDTH - 100, 160)
    
    // Player label
    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 20px serif'
    ctx.textAlign = 'left'
    ctx.fillText('PLAYER', 70, CANVAS_HEIGHT - 175)
    
    // Player score
    if (playerCards.length > 0) {
      const playerValue = calculateHandValue(playerCards)
      const isBust = playerValue > 21
      const isBlackJack = isBlackjack(playerCards)
      
      ctx.fillStyle = isBust ? '#ff4444' : isBlackJack ? '#00ff00' : '#FFD700'
      ctx.font = 'bold 18px serif'
      ctx.textAlign = 'right'
      
      let scoreText = playerValue.toString()
      if (isBust) scoreText += ' BUST'
      else if (isBlackJack) scoreText += ' BLACKJACK!'
      
      ctx.fillText(scoreText, CANVAS_WIDTH - 70, CANVAS_HEIGHT - 175)
    }
    
    // Draw player cards with flip animation
    if (playerCards.length > 0) {
      playerCards.forEach((card, index) => {
        const cardSpacing = 80
        const startX = CANVAS_WIDTH/2 - (playerCards.length * cardSpacing)/2
        const x = startX + index * cardSpacing
        const y = CANVAS_HEIGHT - 160
        
        const isFlipped = playerCardFlipped[index]
        
        drawCard(ctx, card, x, y, false, isFlipped)
      })
    } else {
      // Show placeholder cards when idle
      for (let i = 0; i < 2; i++) {
        const cardSpacing = 80
        const startX = CANVAS_WIDTH/2 - (2 * cardSpacing)/2
        const x = startX + i * cardSpacing
        const y = CANVAS_HEIGHT - 160
        
        // Draw card back placeholders
        if (cardBackImg) {
          ctx.drawImage(cardBackImg, x, y, CARD_WIDTH, CARD_HEIGHT)
        } else {
          // Fallback card back
          ctx.fillStyle = '#000080'
          ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT)
          ctx.strokeStyle = '#FFD700'
          ctx.lineWidth = 2
          ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT)
        }
      }
    }
    
    // Game state overlays (only dealing animation, not result overlay)
    if (gameState === 'dealing') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctx.fillStyle = '#FFD700'
      ctx.font = 'bold 36px serif'
      ctx.textAlign = 'center'
      ctx.fillText('Dealing Cards...', CANVAS_WIDTH/2, CANVAS_HEIGHT/2)
      
      // Animated dealing effect
      ctx.beginPath()
      ctx.arc(CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 50, 20, 0, 2 * Math.PI)
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 3
      ctx.stroke()
    }
  }, [gameState, playerCards, dealerCards, showDealerCard, gameOutcome, showingResult, calculateHandValue, drawCard, isBlackjack, lastResult, initialWager, dealerCardFlipped, playerCardFlipped])

  // Animation loop with time tracking for smooth animations
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let startTime = Date.now()

    const animate = () => {
      const currentTime = Date.now()
      const deltaTime = currentTime - startTime
      setAnimationTime(deltaTime)
      
      draw(ctx)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [draw])

  // Calculate win rate
  const winRate = gameCount > 0 ? (winCount / gameCount * 100) : 0

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="BlackJack"
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
          {/* Game Canvas - now starts from top since header is outside */}
          <canvas 
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            style={{ 
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '140px',
              width: 'calc(100% - 40px)',
              height: 'calc(100% - 160px)',
              imageRendering: 'auto',
              borderRadius: '10px',
              border: '2px solid rgba(212, 165, 116, 0.4)',
              zIndex: 0
            }}
          />

          <GameControlsSection>
            {/* PLAYER HAND Section */}
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
                PLAYER HAND
              </div>
              <div style={{
                fontSize: isMobile ? '16px' : '18px',
                color: 'rgba(76, 175, 80, 0.9)',
                fontWeight: '600'
              }}>
                {playerCards.length > 0 ? calculateHandValue(playerCards) : '-'}
              </div>
            </div>

            {/* DEALER HAND Section */}
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
                DEALER HAND
              </div>
              <div style={{
                fontSize: isMobile ? '16px' : '18px',
                color: 'rgba(255, 152, 0, 0.9)',
                fontWeight: '600'
              }}>
                {dealerCards.length > 0 ? (showDealerCard ? calculateHandValue(dealerCards) : calculateHandValue([dealerCards[0]])) : '-'}
              </div>
            </div>

            {/* WIN CHANCE Section */}
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
                WIN CHANCE
              </div>
              <div style={{
                fontSize: isMobile ? '16px' : '18px',
                color: 'rgba(184, 51, 106, 0.9)',
                fontWeight: '600'
              }}>
                {gameState === 'idle' ? '-' : '~50%'}
              </div>
            </div>

            {/* MULTIPLIER Section */}
            <div style={{
              flex: isMobile ? '1' : '0 0 140px',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(139, 90, 158, 0.15) 0%, rgba(106, 27, 154, 0.25) 50%, rgba(139, 90, 158, 0.15) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(139, 90, 158, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(139, 90, 158, 0.2), inset 0 1px 0 rgba(139, 90, 158, 0.3)',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{
                fontSize: isMobile ? '11px' : '14px',
                fontWeight: 'bold',
                color: '#8b5a9e',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                marginBottom: '4px'
              }}>
                MULTIPLIER
              </div>
              <div style={{
                fontSize: isMobile ? '16px' : '18px',
                color: 'rgba(139, 90, 158, 0.9)',
                fontWeight: '600'
              }}>
                {isBlackjack(playerCards) ? '2.50x' : '1.95x'}
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
          playDisabled={gameState === 'dealing' || !pool || gamba.isPlaying || poolExceeded}
          playText={getPlayText()}
        />
        
        <DesktopControls
          onPlay={getPlayAction()}
          playDisabled={gameState === 'dealing' || !pool || gamba.isPlaying || poolExceeded}
          playText={getPlayText()}
        >
          <EnhancedWagerInput value={initialWager} onChange={setInitialWager} />
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}
