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
  SOUND_WIN, SOUND_LOSE, SOUND_PLAY, SOUND_MOON, SOUND_RUG,
  CANVAS_WIDTH, CANVAS_HEIGHT, CHART_WIDTH, CHART_HEIGHT, CHART_PADDING,
  CANDLE_WIDTH, CANDLE_SPACING, ROMANTIC_COLORS, CHART_COLORS, PRICE_CONFIG,
  MULTIPLIER_CONFIG, ANIMATION_DURATION, CHART_ANIMATION_SPEED
} from './constants'

interface CandleData {
  open: number
  close: number
  high: number
  low: number
  volume: number
  isRed: boolean
}

export default function CryptoChartGameV2() {
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
    moon: SOUND_MOON,
    rug: SOUND_RUG,
  })

  // Canvas ref with debugging
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const animationRef = React.useRef<number>()
  
  // Game state
  const [targetMultiplier, setTargetMultiplier] = React.useState(MULTIPLIER_CONFIG.default)
  const [currentMultiplier, setCurrentMultiplier] = React.useState(0)
  const [prevMultiplier, setPrevMultiplier] = React.useState(0)
  const [finalMultiplier, setFinalMultiplier] = React.useState(0)
  const [gameState, setGameState] = React.useState<'idle' | 'playing' | 'win' | 'crash'>('idle')
  const [candles, setCandles] = React.useState<CandleData[]>([])
  const [inProgress, setInProgress] = React.useState(false)
  const [lastPayout, setLastPayout] = React.useState<number | null>(null)
  const [gameCount, setGameCount] = React.useState(0)
  const [winCount, setWinCount] = React.useState(0)
  const [lossCount, setLossCount] = React.useState(0)
  const [totalProfit, setTotalProfit] = React.useState(0)

  // Get current balance for stats
  const currentBalance = React.useMemo(() => {
    return pool?.liquidity ? Number(pool.liquidity) : 0
  }, [pool])

  // Canvas drawing functions
  const drawDegenGameBackground = (ctx: CanvasRenderingContext2D) => {
    // Romantic degen gradient background
    const gradient = ctx.createRadialGradient(
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0,
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH / 2
    )
    gradient.addColorStop(0, ROMANTIC_COLORS.background)
    gradient.addColorStop(0.7, '#1a0520')
    gradient.addColorStop(1, '#0a0511')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    // Add subtle grid pattern
    ctx.strokeStyle = 'rgba(212, 165, 116, 0.1)'
    ctx.lineWidth = 1
    
    for (let i = 0; i < CANVAS_WIDTH; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, CANVAS_HEIGHT)
      ctx.stroke()
    }
    
    for (let i = 0; i < CANVAS_HEIGHT; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(CANVAS_WIDTH, i)
      ctx.stroke()
    }
  }

  const drawChart = (ctx: CanvasRenderingContext2D) => {
    const chartStartX = CHART_PADDING
    const chartStartY = CHART_PADDING
    const chartEndX = chartStartX + CHART_WIDTH
    const chartEndY = chartStartY + CHART_HEIGHT

    // Draw chart background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.fillRect(chartStartX, chartStartY, CHART_WIDTH, CHART_HEIGHT)

    // Draw grid lines
    ctx.strokeStyle = CHART_COLORS.grid
    ctx.lineWidth = 1
    
    // Horizontal grid lines (price levels)
    for (let i = 1; i < 5; i++) {
      const y = chartStartY + (CHART_HEIGHT / 5) * i
      ctx.beginPath()
      ctx.moveTo(chartStartX, y)
      ctx.lineTo(chartEndX, y)
      ctx.stroke()
    }
    
    // Vertical grid lines (time)
    for (let i = 1; i < 10; i++) {
      const x = chartStartX + (CHART_WIDTH / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, chartStartY)
      ctx.lineTo(x, chartEndY)
      ctx.stroke()
    }

    // Draw candles
    if (candles.length > 0) {
      const candleAreaWidth = CHART_WIDTH - 40
      const candleSpacing = Math.min(CANDLE_WIDTH + CANDLE_SPACING, candleAreaWidth / Math.max(1, candles.length))
      
      candles.forEach((candle, index) => {
        const x = chartStartX + 20 + (index * candleSpacing)
        const priceRange = PRICE_CONFIG.maxPrice - PRICE_CONFIG.minPrice
        
        const openY = chartEndY - ((candle.open - PRICE_CONFIG.minPrice) / priceRange) * CHART_HEIGHT
        const closeY = chartEndY - ((candle.close - PRICE_CONFIG.minPrice) / priceRange) * CHART_HEIGHT
        const highY = chartEndY - ((candle.high - PRICE_CONFIG.minPrice) / priceRange) * CHART_HEIGHT
        const lowY = chartEndY - ((candle.low - PRICE_CONFIG.minPrice) / priceRange) * CHART_HEIGHT
        
        // Draw wick
        ctx.strokeStyle = candle.isRed ? CHART_COLORS.bearish : CHART_COLORS.bullish
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x + CANDLE_WIDTH / 2, highY)
        ctx.lineTo(x + CANDLE_WIDTH / 2, lowY)
        ctx.stroke()
        
        // Draw body
        ctx.fillStyle = candle.isRed ? CHART_COLORS.bearish : CHART_COLORS.bullish
        const bodyHeight = Math.abs(closeY - openY)
        ctx.fillRect(x, Math.min(openY, closeY), CANDLE_WIDTH, Math.max(2, bodyHeight))
      })
    }

    // Draw current price line
    if (currentMultiplier > 0) {
      const currentPrice = PRICE_CONFIG.basePrice * currentMultiplier
      const priceRange = PRICE_CONFIG.maxPrice - PRICE_CONFIG.minPrice
      const priceY = chartEndY - ((currentPrice - PRICE_CONFIG.minPrice) / priceRange) * CHART_HEIGHT
      
      ctx.strokeStyle = CHART_COLORS.target
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(chartStartX, priceY)
      ctx.lineTo(chartEndX, priceY)
      ctx.stroke()
      ctx.setLineDash([])
      
      // Price label
      ctx.fillStyle = CHART_COLORS.target
      ctx.font = 'bold 14px Arial'
      ctx.fillText(`$${currentPrice.toFixed(2)}`, chartEndX + 10, priceY + 5)
    }

    // Draw target line
    if (targetMultiplier > 0) {
      const targetPrice = PRICE_CONFIG.basePrice * targetMultiplier
      const priceRange = PRICE_CONFIG.maxPrice - PRICE_CONFIG.minPrice
      const targetY = chartEndY - ((targetPrice - PRICE_CONFIG.minPrice) / priceRange) * CHART_HEIGHT
      
      ctx.strokeStyle = ROMANTIC_COLORS.gold
      ctx.lineWidth = 2
      ctx.setLineDash([10, 5])
      ctx.beginPath()
      ctx.moveTo(chartStartX, targetY)
      ctx.lineTo(chartEndX, targetY)
      ctx.stroke()
      ctx.setLineDash([])
      
      // Target label
      ctx.fillStyle = ROMANTIC_COLORS.gold
      ctx.font = 'bold 16px Arial'
      ctx.fillText(`Target: ${targetMultiplier.toFixed(2)}x`, chartStartX + 10, targetY - 10)
    }
  }

  const drawGameInfo = (ctx: CanvasRenderingContext2D) => {
    // Game state indicator
    let statusText = ''
    let statusColor = ROMANTIC_COLORS.light
    
    switch (gameState) {
      case 'playing':
        statusText = `Trading... ${currentMultiplier.toFixed(2)}x`
        statusColor = CHART_COLORS.sparkline
        break
      case 'win':
        statusText = `MOON! 🚀 ${finalMultiplier.toFixed(2)}x`
        statusColor = CHART_COLORS.bullish
        break
      case 'crash':
        statusText = `RUGGED! 💥 ${finalMultiplier.toFixed(2)}x`
        statusColor = CHART_COLORS.bearish
        break
      default:
        statusText = 'Ready to Trade'
        break
    }
    
    // Status background
    const textWidth = ctx.measureText(statusText).width
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.fillRect(CANVAS_WIDTH / 2 - textWidth / 2 - 20, 20, textWidth + 40, 50)
    
    // Status text
    ctx.fillStyle = statusColor
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(statusText, CANVAS_WIDTH / 2, 50)
    ctx.textAlign = 'left'
  }

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    // Draw background
    drawDegenGameBackground(ctx)
    
    // Draw chart
    drawChart(ctx)
    
    // Draw game info
    drawGameInfo(ctx)
  }

  // Animation loop
  React.useEffect(() => {
    drawCanvas()
  }, [candles, currentMultiplier, targetMultiplier, gameState, finalMultiplier])

  // Generate candle data
  const generateCandle = (prevClose: number): CandleData => {
    const volatility = PRICE_CONFIG.volatility
    const noise = (Math.random() - 0.5) * volatility * 2
    const trendUp = Math.random() * PRICE_CONFIG.trendStrength
    
    const open = prevClose
    let close = prevClose + trendUp + noise
    let isRed = false
    
    if (Math.random() < 0.35) {
      close = Math.max(1, prevClose - Math.random() * 2)
      isRed = true
    }
    
    const high = Math.max(open, close) + Math.random() * 0.5
    const low = Math.min(open, close) - Math.random() * 0.5
    const volume = Math.random() * 100
    
    return { open, close, high, low, volume, isRed }
  }

  // Animation function
  const animate = (current: number, target: number, win: boolean) => {
    setPrevMultiplier(currentMultiplier)
    setCurrentMultiplier(current)

    setCandles(prev => {
      const last = prev[prev.length - 1] || { close: PRICE_CONFIG.basePrice }
      const newCandle = generateCandle(last.close)
      return [...prev.slice(-50), newCandle] // Keep last 50 candles
    })

    if (current >= target) {
      setGameState(win ? 'win' : 'crash')
      setFinalMultiplier(target)
      setInProgress(false)

      // Play appropriate sound
      if (win) {
        sounds.play('moon')
        effectsRef.current?.triggerWin()
      } else {
        sounds.play('rug')
        effectsRef.current?.triggerLoss()
      }

      return
    }

    animationRef.current = window.setTimeout(() => 
      animate(current + CHART_ANIMATION_SPEED, target, win), 100
    )
  }

  // Calculate pool restrictions
  const maxMultiplier = React.useMemo(() => {
    if (!pool?.maxPayout || !initialWager || initialWager === 0) {
      return MULTIPLIER_CONFIG.max
    }
    
    const calculatedMax = pool.maxPayout / initialWager
    return Math.min(calculatedMax * 0.9, MULTIPLIER_CONFIG.max)
  }, [pool?.maxPayout, initialWager])

  // Game statistics
  const winRate = gameCount > 0 ? (winCount / gameCount) * 100 : 0
  const gameMeta = useGameMeta('cryptochartgame-v2')

  // Play function
  const play = async () => {
    if (animationRef.current !== undefined) {
      clearTimeout(animationRef.current)
      animationRef.current = undefined
    }
    
    setInProgress(true)
    setGameState('playing')
    setCurrentMultiplier(0)
    setFinalMultiplier(0)
    setCandles([{ 
      open: PRICE_CONFIG.basePrice, 
      close: PRICE_CONFIG.basePrice, 
      high: PRICE_CONFIG.basePrice, 
      low: PRICE_CONFIG.basePrice, 
      volume: 50, 
      isRed: false 
    }])
    
    try {
      sounds.play('play')
      
      const betArray = BET_ARRAYS_V2['cryptochartgame-v2'].calculateBetArray(targetMultiplier)
      await game.play({ wager: initialWager, bet: betArray })
      const result = await game.result()

      const win = result.payout > 0
      setLastPayout(win ? result.payout : null)
      
      // Update statistics
      setGameCount(prev => prev + 1)
      if (win) {
        setWinCount(prev => prev + 1)
        setTotalProfit(prev => prev + (result.payout - initialWager))
      } else {
        setLossCount(prev => prev + 1)
        setTotalProfit(prev => prev - initialWager)
      }
      
      // Calculate target based on result for provable fairness
      let target
      if (win) {
        const normalizedResult = (result.resultIndex % 1000) / 1000
        const extraMoon = normalizedResult < 0.5
        target = extraMoon ? targetMultiplier + normalizedResult * targetMultiplier * 2 : targetMultiplier
      } else {
        const normalizedResult = (result.resultIndex % 1000) / 1000
        const max = Math.min(targetMultiplier, 12)
        const exponent = normalizedResult > 0.95 ? 2.8 : (targetMultiplier > 10 ? 5 : 6)
        target = 1 + Math.pow(normalizedResult, exponent) * (max - 1)
      }
      
      animate(0, target, win)
      
    } catch (error) {
      console.error('Game error:', error)
      setGameState('idle')
      setInProgress(false)
      setLastPayout(null)
    }
  }

  const resetGame = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current)
      animationRef.current = undefined
    }
    
    setGameState('idle')
    setCurrentMultiplier(0)
    setFinalMultiplier(0)
    setInProgress(false)
    setLastPayout(null)
    setCandles([])
  }

  // Cleanup
  React.useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [])

  const isPlaying = inProgress || gamba.isPlaying
  const canPlay = !isPlaying && initialWager > 0 && targetMultiplier >= MULTIPLIER_CONFIG.min

  return (
    <>
      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <GameplayFrame ref={effectsRef}>
            {/* Game Stats Header */}
            <GameStatsHeader
              gameName="Crypto Chart"
              gameMode="Trade"
              rtp="95%"
              stats={{
                gamesPlayed: gameCount,
                wins: winCount,
                losses: lossCount,
                sessionProfit: totalProfit,
                bestWin: lastPayout || 0
              }}
            />

            {/* Canvas Game Area */}
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              height: '600px',
              background: ROMANTIC_COLORS.background,
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <canvas 
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  background: ROMANTIC_COLORS.background
                }}
              />
              
              {/* Game Result Overlay */}
              {(gameState === 'win' || gameState === 'crash') && !isPlaying && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'center',
                  color: gameState === 'win' ? CHART_COLORS.bullish : CHART_COLORS.bearish,
                  border: `2px solid ${gameState === 'win' ? CHART_COLORS.bullish : CHART_COLORS.bearish}`,
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
                    {gameState === 'win' ? '🚀 MOON!' : '💥 RUGGED!'}
                  </div>
                  <div style={{ fontSize: '20px', color: ROMANTIC_COLORS.light, marginBottom: '8px' }}>
                    Target: {targetMultiplier.toFixed(2)}x
                  </div>
                  <div style={{ fontSize: '20px', color: ROMANTIC_COLORS.light, marginBottom: '16px' }}>
                    Result: {finalMultiplier.toFixed(2)}x
                  </div>
                  {lastPayout && (
                    <div style={{ fontSize: '18px', color: ROMANTIC_COLORS.gold, fontWeight: 'bold' }}>
                      Won: <TokenValue amount={lastPayout} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </GameplayFrame>
        </GambaUi.Responsive>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        {isMobile ? (
          <MobileControls
            wager={initialWager}
            setWager={setInitialWager}
            onPlay={play}
            playDisabled={!canPlay}
            playText={isPlaying ? 'Trading...' : 'Trade'}
          >
            {/* Target Multiplier Slider */}
            <div style={{ 
              background: 'rgba(212, 165, 116, 0.1)', 
              borderRadius: '8px', 
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ color: ROMANTIC_COLORS.light, fontWeight: 'bold' }}>
                  Target Multiplier
                </span>
                <span style={{ color: ROMANTIC_COLORS.gold, fontSize: '18px', fontWeight: 'bold' }}>
                  {targetMultiplier.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min={MULTIPLIER_CONFIG.min}
                max={Math.min(maxMultiplier, MULTIPLIER_CONFIG.max)}
                step={MULTIPLIER_CONFIG.step}
                value={targetMultiplier}
                onChange={(e) => setTargetMultiplier(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '12px', 
                color: ROMANTIC_COLORS.light,
                marginTop: '4px'
              }}>
                <span>{MULTIPLIER_CONFIG.min}x</span>
                <span>{Math.min(maxMultiplier, MULTIPLIER_CONFIG.max).toFixed(0)}x</span>
              </div>
            </div>
          </MobileControls>
        ) : (
          <DesktopControls
            wager={initialWager}
            setWager={setInitialWager}
            onPlay={play}
            playDisabled={!canPlay}
            playText={isPlaying ? 'Trading...' : 'Trade'}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Target Multiplier Control */}
              <div style={{ 
                background: 'rgba(212, 165, 116, 0.1)', 
                borderRadius: '8px', 
                padding: '12px',
                minWidth: '200px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: ROMANTIC_COLORS.light, fontSize: '14px', fontWeight: 'bold' }}>
                    Target
                  </span>
                  <span style={{ color: ROMANTIC_COLORS.gold, fontSize: '16px', fontWeight: 'bold' }}>
                    {targetMultiplier.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min={MULTIPLIER_CONFIG.min}
                  max={Math.min(maxMultiplier, MULTIPLIER_CONFIG.max)}
                  step={MULTIPLIER_CONFIG.step}
                  value={targetMultiplier}
                  onChange={(e) => setTargetMultiplier(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              
              {gameState !== 'idle' && (
                <EnhancedButton onClick={resetGame}>
                  Reset
                </EnhancedButton>
              )}
            </div>
          </DesktopControls>
        )}
      </GambaUi.Portal>
    </>
  )
}