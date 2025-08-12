import React, { useContext, useRef, useState, useEffect } from 'react'
import {
  FAKE_TOKEN_MINT,
  GambaUi,
  useCurrentPool,
  useCurrentToken,
  useTokenBalance,
  useWagerInput,
} from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { GameControls } from '../../components/GameControls'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import SlidePaytable, { SlidePaytableRef } from './SlidePaytable'
import { SlideOverlays } from './SlideOverlays'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

const ORIGINAL_MULTIPLIERS = [1.05, 0, 1.34, 0, 1.04, 0, 1.76, 0, 1.95, 0]

// Shuffle utility
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Format number to decimals and trim trailing zeros
function formatPayout(amount: number, decimals: number): string {
  const factor = 10 ** decimals
  const fixed = (amount / factor).toFixed(decimals)
  return fixed.replace(/\.?0+$/, '')
}

// Icon components
const TokenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="url(#tokenGradient)"/>
    <defs>
      <linearGradient id="tokenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d4ff"/>
        <stop offset="100%" stopColor="#5b63f7"/>
      </linearGradient>
    </defs>
  </svg>
)

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="8,5 19,12 8,19"/>
  </svg>
)

const FairnessIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
  </svg>
)

const getResponsiveScale = () => {
  if (typeof window === 'undefined') return 1;
  const width = window.innerWidth;
  if (width <= 400) return 0.95;
  if (width <= 600) return 1.08;
  if (width <= 900) return 1.18;
  if (width <= 1200) return 1.28;
  if (width <= 1600) return 1.38;
  return 1;
};

export default function SlideGame() {
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>()
  const [wager, setWager] = useWagerInput()
  const [scale, setScale] = useState(getResponsiveScale())
  const paytableRef = useRef<SlidePaytableRef>(null)

  useEffect(() => {
    const handleResize = () => {
      clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = setTimeout(() => {
        setScale(getResponsiveScale())
      }, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeoutRef.current)
    }
  }, [])
  const game = GambaUi.useGame()
  const token = useCurrentToken()
  const pool = useCurrentPool()
  const { balance } = useTokenBalance()
  const [result, setResult] = useState<number | null>(null)
  const [gambaResult, setGambaResultState] = useState<any>(null) // For debugging
  const [playing, setPlaying] = useState(false)
  const [offset, setOffset] = useState(0)
  const [progress, setProgress] = useState(0)
  const [recentPlays, setRecentPlays] = useState<{multiplier: number, win: boolean, amount: number}[]>([])
  const [showFairness, setShowFairness] = useState(false)
  const intervalRef = useRef<any>(null)
  const speedRef = useRef(5)
  const progressRef = useRef<any>(null)
  const startOffsetRef = useRef(0)

  // Game outcome hook
  const { showOutcome, hasPlayedBefore, handleGameComplete, handlePlayAgain: baseHandlePlayAgain, isWin, profitAmount, resetGameState } = useGameOutcome()

  // Overlay states
  const [gamePhase, setGamePhase] = React.useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')
  const [thinkingPhase, setThinkingPhase] = React.useState(false)
  const [dramaticPause, setDramaticPause] = React.useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(1)
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🎰')

  // Custom play again handler to reset slide game state
  const handlePlayAgain = () => {
    setResult(null)
    setGambaResultState(null)
    setProgress(0)
    setOffset(0)
    baseHandlePlayAgain()
  }

  const CARD_WIDTH = 120
  const CARD_GAP = 16
  const RENDERED_CARD_WIDTH = CARD_WIDTH - 16  // Actual rendered width
  const CARD_SPACING = CARD_WIDTH + CARD_GAP   // Distance between card starts
  const CONTAINER_CENTER = 300  // Needle position
  const loopWidth = CARD_SPACING * ORIGINAL_MULTIPLIERS.length

  const renderedMultipliers = [
    ...ORIGINAL_MULTIPLIERS, 
    ...ORIGINAL_MULTIPLIERS, 
    ...ORIGINAL_MULTIPLIERS, 
    ...ORIGINAL_MULTIPLIERS, 
    ...ORIGINAL_MULTIPLIERS
  ]

  const tokenMeta = token ? TOKEN_METADATA.find(t => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
  const maxWager = baseWager * 1000000
  const tokenPrice = tokenMeta?.usdPrice ?? 0
  const decimals = tokenMeta?.decimals ?? 4

  // Function to get card center position
  const getCardCenter = (cardIndex: number) => {
    return cardIndex * CARD_SPACING + (CARD_WIDTH / 2)
  }

  // Function to get which card is under the needle
  const getCardUnderNeedle = (currentOffset: number) => {
    // The needle is at CONTAINER_CENTER pixels from the left of the container
    // Each card starts at cardIndex * CARD_SPACING and has its center at cardIndex * CARD_SPACING + (CARD_WIDTH / 2)
    // We need to find which card's center is closest to the needle position
    const needlePositionInCarousel = currentOffset + CONTAINER_CENTER
    const cardIndex = Math.round((needlePositionInCarousel - (CARD_WIDTH / 2)) / CARD_SPACING)
    
    // Ensure the index is within bounds of our rendered multipliers array
    return Math.max(0, Math.min(cardIndex, renderedMultipliers.length - 1))
  }

  // Set default wager: 1 for free tokens, 0 for real tokens
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager) // 1 token for free token
    } else {
      setWager(0) // 0 for real tokens
    }
  }, [setWager, token, baseWager])

  // Initialize with needle centered on the first card of the middle set
  React.useEffect(() => {
    const cardsPerSet = ORIGINAL_MULTIPLIERS.length;
    
    // Start with the first card of the middle set (3rd set out of 5) centered under the needle
    const firstCardIndexInMiddleSet = cardsPerSet * 2; // First card of middle set (index 2 * 10 = 20)
    const firstCardCenter = getCardCenter(firstCardIndexInMiddleSet);
    const initialOffset = firstCardCenter - CONTAINER_CENTER;
    
    setOffset(initialOffset);
  }, [])

  const startProgress = () => {
    setProgress(0)
    if (progressRef.current) clearInterval(progressRef.current)
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressRef.current)
          return 100
        }
        return prev + 0.8
      })
    }, 20)
  }

  const startSlider = async () => {
    setResult(null)
    setPlaying(true)
    
    // Start with needle centered on a random card for variety
    const randomCardIndex = Math.floor(Math.random() * ORIGINAL_MULTIPLIERS.length);
    const cardsPerSet = ORIGINAL_MULTIPLIERS.length;
    
    // Position the random card from the middle set (3rd set) under the needle
    const randomCardIndexInMiddleSet = cardsPerSet * 2 + randomCardIndex; // Middle set is at index 2
    const randomCardCenter = getCardCenter(randomCardIndexInMiddleSet);
    const startOffset = randomCardCenter - CONTAINER_CENTER;
    
    setOffset(startOffset)
    startOffsetRef.current = startOffset
    speedRef.current = 15 // Start faster
    startProgress()

    await new Promise((res) => setTimeout(res, 800))

    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setOffset((prev) => {
        let next = prev + speedRef.current
        if (next >= loopWidth) {
          next -= loopWidth
        }
        return next
      })
      
      // Gradually increase speed for more excitement
      if (speedRef.current < 25) {
        speedRef.current += 0.1
      }
    }, 16)
  }

const stopSlider = async () => {
  if (intervalRef.current) clearInterval(intervalRef.current);

  const cardsPerSet = ORIGINAL_MULTIPLIERS.length;

  try {
    setPlaying(true);

    // Trigger backend spin
    await game.play({ bet: ORIGINAL_MULTIPLIERS, wager });
    const res = await game.result();
    const resultIndex = res.resultIndex ?? 0;

    console.log('Game Result:', {
      resultIndex,
      expectedMultiplier: ORIGINAL_MULTIPLIERS[resultIndex],
      payout: res.payout
    });


    // Calculate the exact position needed to center the winning card under the needle
    // Always use the middle set (3rd set out of 5) for positioning consistency
    const targetCardIndexInRendered = cardsPerSet * 2 + resultIndex; // Middle set is at index 2
    const targetCardCenter = getCardCenter(targetCardIndexInRendered);
    const targetOffset = targetCardCenter - CONTAINER_CENTER;

    console.log('Positioning calculation:', {
      resultIndex,
      targetCardIndexInRendered,
      targetCardCenter,
      targetOffset,
      expectedMultiplier: ORIGINAL_MULTIPLIERS[resultIndex]
    });

    // Normalize the current offset to ensure we're in the right loop iteration
    let normalizedCurrentOffset = offset;
    
    // Find the closest version of the target offset (accounting for looping)
    const possibleTargets = [targetOffset, targetOffset + loopWidth, targetOffset - loopWidth];
    let bestTarget = targetOffset;
    let minDistance = Math.abs(targetOffset - normalizedCurrentOffset);
    
    for (const target of possibleTargets) {
      const distance = Math.abs(target - normalizedCurrentOffset);
      if (distance < minDistance) {
        minDistance = distance;
        bestTarget = target;
      }
    }

    console.log('Animation details:', {
      originalOffset: offset,
      normalizedCurrentOffset,
      bestTarget,
      offsetDifference: bestTarget - normalizedCurrentOffset
    });

    // Animate from current offset to target offset smoothly
    const animationSteps = 60;
    for (let i = 0; i <= animationSteps; i++) {
      const progress = i / animationSteps;
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const newOffset = normalizedCurrentOffset + (bestTarget - normalizedCurrentOffset) * easeOutCubic;
      setOffset(newOffset);
      await new Promise(resolve => setTimeout(resolve, 16)); // ~60fps
    }

    // Normalize the final offset to stay within one loop cycle
    const finalOffset = bestTarget % loopWidth;
    setOffset(finalOffset);

    // Set game state
    setResult(res.payout);
    setPlaying(false);

    // Trigger outcome overlay
    handleGameComplete({
      payout: res.payout,
      wager: wager
    });

    // Update recent plays UI
    setRecentPlays(prev => [
      {
        multiplier: ORIGINAL_MULTIPLIERS[resultIndex],
        win: res.payout > 0,
        amount: res.payout > 0 ? res.payout : wager
      },
      ...prev.slice(0, 4),
    ]);

    // Track result in paytable
    paytableRef.current?.trackSpin({
      multiplier: ORIGINAL_MULTIPLIERS[resultIndex],
      win: res.payout > 0,
      wager,
      payout: res.payout
    })
  } catch (err) {
    console.error("Error during spin:", err);
    setPlaying(false);
  }
}

  const play = async () => {
    if (!wager || playing) return
    
    // Start thinking phase
    setGamePhase('thinking')
    setThinkingPhase(true)
    setThinkingEmoji(['🎰', '💭', '🎯', '🃏'][Math.floor(Math.random() * 4)])
    
    try {
      await startSlider()
      
      // Dramatic pause phase before final result
      setGamePhase('dramatic')
      setDramaticPause(true)
      
      await stopSlider()
      
      // Set celebration intensity based on final result
      if (result && gambaResult) {
        const multiplier = gambaResult.payout / wager
        if (multiplier > 0) {
          if (multiplier >= 10) {
            setCelebrationIntensity(3) // Epic win
          } else if (multiplier >= 3) {
            setCelebrationIntensity(2) // Big win
          } else {
            setCelebrationIntensity(1) // Regular win
          }
          setGamePhase('celebrating')
        } else {
          setGamePhase('mourning')
        }
        
        // Reset to idle after celebration/mourning
        setTimeout(() => {
          setGamePhase('idle')
        }, 3000)
      }
    } catch (error) {
      console.error('Play error:', error)
      setPlaying(false)
      setProgress(100)
      setGamePhase('mourning')
      // Reset to idle after error
      setTimeout(() => {
        setGamePhase('idle')
      }, 3000)
    }
  }

  const carouselStyle = {
    display: 'flex',
    gap: CARD_GAP,
    transition: playing ? 'none' : 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: `translateX(${-offset}px)`,
    width: `${CARD_SPACING * renderedMultipliers.length}px`,
  }

  // Get the current card under the needle
  const cardUnderNeedle = getCardUnderNeedle(offset);

  // Debug: Log the carousel positioning
  React.useEffect(() => {
    if (gambaResult && !playing) {
      console.log('FINAL CAROUSEL STATE:', {
        offset,
        cardUnderNeedle,
        multiplierUnderNeedle: renderedMultipliers[cardUnderNeedle],
        expectedIndex: gambaResult.resultIndex,
        expectedMultiplier: ORIGINAL_MULTIPLIERS[gambaResult.resultIndex],
        middleSetTargetIndex: ORIGINAL_MULTIPLIERS.length * 2 + gambaResult.resultIndex,
        actualTargetCard: renderedMultipliers[ORIGINAL_MULTIPLIERS.length * 2 + gambaResult.resultIndex],
        MATCH: cardUnderNeedle === (ORIGINAL_MULTIPLIERS.length * 2 + gambaResult.resultIndex)
      });
    }
  }, [offset, gambaResult, renderedMultipliers, playing, cardUnderNeedle]);

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier === 0) return '#ff3333' // Loss - red
    if (multiplier >= 10) return '#ff6b35' // High multiplier - orange
    if (multiplier >= 5) return '#ffd60a' // Medium-high - yellow
    if (multiplier >= 2) return '#00d4ff' // Medium - cyan
    return '#7209b7' // Low - purple
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main game area */}
          <div
            style={{
              flex: 1,
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #0891b2 75%, #06b6d4 100%)',
              borderRadius: '24px',
              border: '3px solid rgba(6, 182, 212, 0.3)',
              boxShadow: `
                0 25px 50px rgba(0, 0, 0, 0.5),
                inset 0 2px 4px rgba(255, 255, 255, 0.1),
                inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                0 0 30px rgba(6, 182, 212, 0.2)
              `,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Floating slide background elements */}
            <div style={{
              position: 'absolute',
              top: '5%',
              left: '5%',
              fontSize: '120px',
              opacity: 0.05,
              transform: 'rotate(-15deg)',
              pointerEvents: 'none',
              color: '#0891b2'
            }}>🎢</div>
            <div style={{
              position: 'absolute',
              bottom: '5%',
              right: '5%',
              fontSize: '100px',
              opacity: 0.06,
              transform: 'rotate(25deg)',
              pointerEvents: 'none',
              color: '#06b6d4'
            }}>🏔️</div>
            <div style={{
              position: 'absolute',
              top: '40%',
              right: '8%',
              fontSize: '80px',
              opacity: 0.04,
              transform: 'rotate(-30deg)',
              pointerEvents: 'none',
              color: '#0e7490'
            }}>🎿</div>

            <GambaUi.Responsive>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent',
                  color: '#fff',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '20px'
                }}
              >
                {/* Animated Background Elements */}
                <div style={{
                  position: 'absolute',
                  top: '10%',
                  right: '10%',
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
                  animation: 'float 6s ease-in-out infinite',
                  zIndex: 0
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '20%',
                  left: '5%',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 70%)',
                  animation: 'float 4s ease-in-out infinite reverse',
                  zIndex: 0
                }} />

                <div style={{ 
                  padding: '32px 24px',
                  width: '1100px',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {/* Header */}
                  <div style={{ marginBottom: 48 }}>
                    <h1 style={{ 
                      fontSize: '3.5rem',
                      fontWeight: '800',
                      margin: '0 0 12px 0',
                      background: 'linear-gradient(135deg, #00d4ff 0%, #ff6b35 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 40px rgba(0, 212, 255, 0.3)',
                      letterSpacing: '-0.02em'
                    }}>
                      SLIDE
                    </h1>
                    <p style={{ 
                      fontSize: '1.2rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: 0,
                      fontWeight: '300'
                    }}>
                      Spin the wheel of fortune
                      {gambaResult && (
                    <span style={{
                      marginLeft: '16px',
                      padding: '4px 12px',
                      background: gambaResult.payout > 0 
                        ? 'rgba(0, 255, 136, 0.2)' 
                        : 'rgba(255, 85, 85, 0.2)',
                      border: `1px solid ${gambaResult.payout > 0 ? '#00ff88' : '#ff5555'}`,
                      borderRadius: '8px',
                      color: gambaResult.payout > 0 ? '#00ff88' : '#ff5555',
                      fontWeight: '600',
                      fontSize: '1rem'
                    }}>
                      {ORIGINAL_MULTIPLIERS[gambaResult.resultIndex] === 0 
                        ? '💀 LOSE' 
                        : `${ORIGINAL_MULTIPLIERS[gambaResult.resultIndex]?.toFixed(2)}x`}
                    </span>
                  )}
                </p>
              </div>

              {/* Main Game Area */}
              <div>
                {/* Multiplier Carousel */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  margin: '0 auto 32px',
                  height: 200,
                  overflow: 'hidden',
                  borderRadius: 24,
                  background: 'linear-gradient(145deg, rgba(20, 20, 40, 0.95) 0%, rgba(15, 15, 30, 0.95) 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: `
                    0 20px 40px rgba(0, 0, 0, 0.6),
                    0 0 0 1px rgba(255, 255, 255, 0.05),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.2)
                  `,
                  transition: 'all 0.4s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '20px 0',
                }}>
                  
                  {/* Inner glow effect */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 22,
                    background: 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.03) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 1
                  }} />

                  <div style={carouselStyle}>
                    {renderedMultipliers.map((multiplier, index) => {
                      const color = getMultiplierColor(multiplier)
                      const isUnderNeedle = index === cardUnderNeedle;
                      const showWinnerHighlight = isUnderNeedle && !playing && result !== null;
                      
                      return (
                        <div
                          key={index}
                          style={{
                            width: RENDERED_CARD_WIDTH,
                            height: 160,
                            borderRadius: '20px',
                            background: showWinnerHighlight 
                              ? `linear-gradient(135deg, 
                                  rgba(0, 255, 136, 0.9) 0%, 
                                  rgba(0, 255, 136, 0.6) 20%, 
                                  ${color}80 100%)`
                              : `linear-gradient(135deg, 
                                  rgba(255, 255, 255, 0.1) 0%, 
                                  ${color}40 20%, 
                                  ${color}20 80%, 
                                  rgba(0, 0, 0, 0.2) 100%)`,
                            border: showWinnerHighlight 
                              ? `3px solid #00ff88`
                              : `2px solid ${color}60`,
                            boxShadow: showWinnerHighlight
                              ? `
                                  0 0 0 1px rgba(0, 255, 136, 0.3),
                                  0 8px 32px rgba(0, 255, 136, 0.6),
                                  0 0 60px rgba(0, 255, 136, 0.4),
                                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                                `
                              : `
                                  0 8px 24px rgba(0, 0, 0, 0.4),
                                  0 0 0 1px rgba(255, 255, 255, 0.1),
                                  0 0 20px ${color}20,
                                  inset 0 1px 0 rgba(255, 255, 255, 0.15),
                                  inset 0 -1px 0 rgba(0, 0, 0, 0.2)
                                `,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: '700',
                            fontSize: '1.4rem',
                            userSelect: 'none',
                            position: 'relative',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: playing 
                              ? 'scale(0.95) rotateY(2deg)' 
                              : (showWinnerHighlight ? 'scale(1.08) rotateY(-2deg)' : 'scale(1)'),
                            overflow: 'hidden'
                          }}
                        >
                          {/* Card shine effect */}
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                            animation: playing ? 'shine 2s ease-in-out infinite' : 'none',
                            zIndex: 1
                          }} />

                          {/* Background pattern */}
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0.1,
                            background: `
                              radial-gradient(circle at 20% 20%, ${color} 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, ${color} 0%, transparent 50%)
                            `,
                            borderRadius: 'inherit'
                          }} />

                          <div style={{
                            fontSize: '2.2rem',
                            fontWeight: '900',
                            textShadow: `
                              0 0 20px ${color},
                              0 2px 4px rgba(0, 0, 0, 0.8),
                              0 0 40px ${showWinnerHighlight ? '#00ff88' : color}
                            `,
                            marginBottom: '4px',
                            position: 'relative',
                            zIndex: 2
                          }}>
                            {multiplier === 0 ? '💀' : `${multiplier.toFixed(2)}x`}
                          </div>
                          
                          <div style={{
                            fontSize: '0.75rem',
                            opacity: 0.9,
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                            position: 'relative',
                            zIndex: 2
                          }}>
                            {multiplier === 0 ? 'LOSE' : 
                             multiplier >= 10 ? 'MEGA' : 
                             multiplier >= 5 ? 'HIGH' : 
                             multiplier >= 2 ? 'MID' : 'LOW'}
                          </div>
                          
                          {/* Winner indicator */}
                          {showWinnerHighlight && (
                            <div style={{
                              position: 'absolute',
                              top: '0px',
                              right: '0px',
                              width: '36px',
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '18px',
                              fontWeight: 'bold',
                              color: 'rgb(0, 0, 0)',
                              animation: '1.5s ease-in-out 0s infinite normal none running winnerPulse',
                              zIndex: 10
                            }}>
                              🎯
                            </div>
                          )}
                          
                          {/* Animated border glow for spinning */}
                          <div style={{
                            position: 'absolute',
                            inset: -3,
                            borderRadius: '23px',
                            padding: '3px',
                            background: `conic-gradient(from 0deg, ${color}, transparent, ${color}, transparent, ${color})`,
                            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            maskComposite: 'xor',
                            WebkitMaskComposite: 'xor',
                            opacity: playing ? 0.8 : 0,
                            animation: playing ? 'rotate 3s linear infinite' : 'none'
                          }} />
                        </div>
                      )
                    })}
                  </div>

                  {/* Enhanced side fade effects */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '80px',
                    height: '100%',
                    background: 'linear-gradient(to right, rgba(15, 15, 30, 0.95) 0%, rgba(15, 15, 30, 0.7) 50%, transparent 100%)',
                    pointerEvents: 'none',
                    zIndex: 15
                  }} />
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: '80px',
                    height: '100%',
                    background: 'linear-gradient(to left, rgba(15, 15, 30, 0.95) 0%, rgba(15, 15, 30, 0.7) 50%, transparent 100%)',
                    pointerEvents: 'none',
                    zIndex: 15
                  }} />
                  
                  {/* Top and bottom subtle highlights */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    pointerEvents: 'none'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.3), transparent)',
                    pointerEvents: 'none'
                  }} />
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: 24
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #00d4ff 0%, #ff6b35 100%)',
                    borderRadius: '4px',
                    transition: 'width 0.1s ease',
                    boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
                  }} />
                </div>

                {/* Result Display */}
                {result !== null && (
                  <div style={{
                    padding: '24px',
                    borderRadius: '16px',
                    background: result > 0 
                      ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 85, 85, 0.2) 0%, rgba(255, 85, 85, 0.05) 100%)',
                    border: `2px solid ${result > 0 ? '#00ff88' : '#ff5555'}`,
                    marginBottom: 24,
                    animation: 'slideIn 0.5s ease-out'
                  }}>
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color: result > 0 ? '#00ff88' : '#ff5555',
                      textAlign: 'center',
                      textShadow: `0 0 20px ${result > 0 ? '#00ff88' : '#ff5555'}`
                    }}>
                      {result > 0 ? (
                        <>
                          🎉 WIN! +{formatPayout(result, decimals)} {token?.symbol || ''}
                        </>
                      ) : (
                        <>
                          💸 BETTER LUCK NEXT TIME
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Gamba Result Debug Display */}
                {gambaResult && (
                  <div style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid #444',
                    marginBottom: 24,
                    fontSize: '0.8rem',
                    color: '#ccc',
                    fontFamily: 'monospace',
                    textAlign: 'left'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Gamba Result (Debug):</div>
                    <div>Result Index: {gambaResult.resultIndex}</div>
                    <div>Expected Multiplier: {ORIGINAL_MULTIPLIERS[gambaResult.resultIndex ?? 0]}</div>
                    <div>Card Under Needle Index: {cardUnderNeedle}</div>
                    <div>Multiplier Under Needle: {renderedMultipliers[cardUnderNeedle]}</div>
                    <div>Target Card Index: {ORIGINAL_MULTIPLIERS.length * 2 + (gambaResult.resultIndex ?? 0)}</div>
                    <div>Match: {cardUnderNeedle === (ORIGINAL_MULTIPLIERS.length * 2 + (gambaResult.resultIndex ?? 0)) ? '✅' : '❌'}</div>
                    <div>Payout: {gambaResult.payout}</div>
                    <div>Current Offset: {offset.toFixed(2)}</div>
                    <div>Target Card Center: {getCardCenter(ORIGINAL_MULTIPLIERS.length * 2 + (gambaResult.resultIndex ?? 0)).toFixed(2)}</div>
                  </div>
                )}
              </div>

              {/* Recent Plays */}
              {recentPlays.length > 0 && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '24px',
                  margin: '0 auto',
                  maxWidth: '100%',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  marginBottom: 32
                }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    margin: '0 0 16px 0',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    Recent Results
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    {recentPlays.map((play, index) => (
                      <div key={index} style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: play.win 
                          ? 'rgba(0, 255, 136, 0.1)' 
                          : 'rgba(255, 85, 85, 0.1)',
                        border: `1px solid ${play.win ? '#00ff88' : '#ff5555'}`,
                        color: play.win ? '#00ff88' : '#ff5555',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        {play.multiplier === 0 ? '💀 LOSE' : `${play.multiplier.toFixed(2)}x`}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fairness Modal Overlay */}
            {showFairness && (
              <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(10px)'
              }} onClick={() => setShowFairness(false)}>
                <div style={{
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                  borderRadius: '20px',
                  padding: '32px',
                  maxWidth: '500px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
                }} onClick={e => e.stopPropagation()}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    <FairnessIcon />
                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
                      Provably Fair
                    </h3>
                  </div>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.6,
                    margin: '0 0 20px 0'
                  }}>
                    Every game result is cryptographically verifiable. The outcome is determined by 
                    combining the server seed, client seed, and nonce using industry-standard algorithms.
                  </p>
                  <button style={{
                    background: 'linear-gradient(135deg, #00d4ff 0%, #5b63f7 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%'
                  }} onClick={() => setShowFairness(false)}>
                    Got it
                  </button>
                </div>
              </div>
            )}
                {/* CSS Animations */}
                <style>
                  {`
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
              }
              @keyframes winnerPulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.9; }
              }
              @keyframes indicatorPulse {
                0%, 100% { transform: scaleY(1); opacity: 1; }
                50% { transform: scaleY(1.1); opacity: 0.8; }
              }
              @keyframes indicatorGlow {
                0% { 
                  filter: drop-shadow(0 0 10px #00ff88); 
                  transform: scaleY(1);
                }
                100% { 
                  filter: drop-shadow(0 0 25px #00ff88); 
                  transform: scaleY(1.05);
                }
              }
              @keyframes shine {
                0% { left: -100%; }
                50%, 100% { left: 100%; }
              }
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.8; }
              }
              @keyframes glow {
                0% { filter: drop-shadow(0 0 10px #00ff88); }
                100% { filter: drop-shadow(0 0 25px #00ff88); }
              }
              @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                    `}
                  </style>
                </div>
              </GambaUi.Responsive>
            </div>
              
            {/* Paytable sidebar */}
            <SlidePaytable ref={paytableRef} />
          </div>
        </GambaUi.Portal>

      <GameControls
        wager={wager}
        setWager={setWager}
        isPlaying={playing}
        showOutcome={showOutcome}
        onPlay={() => {
          play();
          setResultModalOpen(true);
        }}
        playButtonText={playing ? 'Sliding...' : 'Slide'}
        onPlayAgain={baseHandlePlayAgain}
      />
      {renderThinkingOverlay(
        <SlideOverlays 
          gamePhase={getGamePhaseState(gamePhase)}
          thinkingPhase={getThinkingPhaseState(thinkingPhase)}
          dramaticPause={dramaticPause}
          celebrationIntensity={celebrationIntensity}
          thinkingEmoji={thinkingEmoji}
        />
      )}
    </>
  )
}