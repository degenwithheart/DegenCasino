import { FAKE_TOKEN_MINT, GambaUi, useGame, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React, { useRef } from 'react'
import { GameControls } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { useGambaResult } from '../../hooks/useGambaResult'
import { GameStateProvider, useGameState } from '../../hooks/useGameState'
import CustomSlider from './Slider'
import { ChartWrapper, ScreenWrapper } from './styles'
import { calculateBetArray } from './utils'
import Candle from './Candle'
import { TOKEN_METADATA } from '../../constants'
import CryptoChartPaytable, { CryptoChartPaytableRef } from './CryptoChartPaytable'
import { CryptoChartGameOverlays } from './CryptoChartGameOverlays'
import { renderThinkingOverlay } from '../../utils/overlayUtils'

export default function CryptoChartGame() {
  return (
    <GameStateProvider>
      <CryptoChartGameComponent />
    </GameStateProvider>
  )
}

function CryptoChartGameComponent() {
  const { gamePhase, setGamePhase } = useGameState()
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const gamba = useGamba()

    // Use TOKEN_METADATA to get baseWager, maxWager, tokenPrice
    const tokenMeta = token ? TOKEN_METADATA.find(t => t.symbol === token.symbol) : undefined
    const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
    const maxWager = baseWager * 1000000
    const tokenPrice = tokenMeta?.usdPrice ?? 0

    const { showOutcome, hasPlayedBefore, handleGameComplete, handlePlayAgain } = useGameOutcome()

  // Dynamic play button text
  const playButtonText = hasPlayedBefore && !showOutcome ? "Restart" : "Start"

  // Gamba result storage
  const { storeResult, gambaResult } = useGambaResult()

    // Set default wager: 1 for free tokens, 0 for real tokens
    React.useEffect(() => {
      if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
        setWager(baseWager) // 1 token for free token
      } else {
        setWager(0) // 0 for real tokens
      }
    }, [setWager, token, baseWager])

    const [multiplierTarget, setMultiplierTarget] = React.useState(1.5)
    const [currentMultiplier, setCurrentMultiplier] = React.useState(0)
    const [prevMultiplier, setPrevMultiplier] = React.useState(0)
    const [basePrice] = React.useState(180) // Solana current price baseline
    const [gameState, setGameState] = React.useState<'idle' | 'win' | 'crash'>('idle')
    const paytableRef = useRef<CryptoChartPaytableRef>(null)

    type CandleType = {
      open: number
      close: number
      high: number
      low: number
      volume: number
      isRed: boolean
    }

    const [candles, setCandles] = React.useState<CandleType[]>([
      { open: 100, close: 100, high: 100, low: 100, volume: 50, isRed: false },
    ])
    const [finalMultiplier, setFinalMultiplier] = React.useState(0)
    const [lastPayout, setLastPayout] = React.useState<number | null>(null)

    // Overlay states
    const [thinkingPhase, setThinkingPhase] = React.useState(false)
    const [dramaticPause, setDramaticPause] = React.useState(false)
    const [celebrationIntensity, setCelebrationIntensity] = React.useState(1)
    const [thinkingEmoji, setThinkingEmoji] = React.useState('📈')

    const viewBoxWidth = 300
    const viewBoxHeight = 100
    const animationRef = React.useRef<number | undefined>()

    React.useEffect(() => {
      return () => {
        if (animationRef.current !== undefined) clearTimeout(animationRef.current)
      }
    }, [])

    const game = useGame()

    const generateCandle = (prevClose: number) => {
      const trendUp = 0.7
      const noise = (Math.random() - 0.5) * 1.5
      let open = prevClose
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

    const animate = (current: number, target: number, win: boolean, result: { payout: number; wager: number }) => {
      setPrevMultiplier(currentMultiplier)
      setCurrentMultiplier(current)

      setCandles(prev => {
        const last = prev[prev.length - 1] || { close: 100 }
        const newCandle = generateCandle(last.close)
        return [...prev, newCandle]
      })

      if (current >= target) {
        setGameState(win ? 'win' : 'crash')
        setFinalMultiplier(target)
        animationRef.current = undefined

        // Track result in live paytable
        if (paytableRef.current) {
          paytableRef.current.trackGame({
            targetMultiplier: multiplierTarget,
            finalMultiplier: target,
            wasWin: win,
            amount: result.payout,
          })
        }

        // Handle game outcome for overlay after animation completes
        setTimeout(() => {
          handleGameComplete(result)
        }, 1000)
        return
      }
      animationRef.current = window.setTimeout(() => animate(current + 0.03, target, win, result), 100)
    }

    const play = async () => {
      if (animationRef.current !== undefined) {
        clearTimeout(animationRef.current)
        animationRef.current = undefined
      }
      
      // Start thinking phase
      setGamePhase('thinking')
      setThinkingPhase(true)
      setThinkingEmoji(['📈', '💭', '📊', '💸'][Math.floor(Math.random() * 4)])
      
      setGameState('idle')
      setCurrentMultiplier(0)
      setFinalMultiplier(0)
      setCandles([{ open: 100, close: 100, high: 100, low: 100, volume: 50, isRed: false }])
      try {
        const betArray = calculateBetArray(multiplierTarget)
        await game.play({ wager, bet: betArray })
        const result = await game.result()

    // Store result in context for modal
    storeResult(result)
        const win = result.payout > 0
        setLastPayout(win ? result.payout : null)
        
        // Dramatic pause phase
        setGamePhase('dramatic')
        setDramaticPause(true)
        
        // Wait for dramatic effect
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Use deterministic target calculation based on result index for provable fairness
        let target
        if (win) {
          // Use result index to determine if extra moon and how much
          const normalizedResult = (result.resultIndex % 1000) / 1000
          const extraMoon = normalizedResult < 0.5
          target = extraMoon ? multiplierTarget + normalizedResult * multiplierTarget * 2 : multiplierTarget
        } else {
          // Use result index for deterministic crash point
          const normalizedResult = (result.resultIndex % 1000) / 1000
          const earlyRug = normalizedResult < 0.5
          target = earlyRug
            ? 1 + normalizedResult * Math.max(0.5, multiplierTarget - 1.5)
            : calculateDeterministicLowMultiplier(multiplierTarget, result.resultIndex)
        }
        
        const finalResult = { payout: result.payout, wager }
        
        // Set celebration intensity based on win amount
        if (win) {
          const multiplier = finalResult.payout / finalResult.wager
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
        
        animate(0, target, win, finalResult)
        
        // Reset to idle after celebration/mourning
        setTimeout(() => {
          setGamePhase('idle')
        }, 3000)
      } catch {
        setGameState('idle')
        setLastPayout(null)
        setGamePhase('mourning')
        // Reset to idle after error
        setTimeout(() => {
          setGamePhase('idle')
        }, 3000)
      }
    }

    const calculateDeterministicLowMultiplier = (targetMultiplier: number, resultIndex: number) => {
      // Use result index for deterministic calculation
      const normalizedResult = (resultIndex % 1000) / 1000
      const max = Math.min(targetMultiplier, 12)
      const exponent = normalizedResult > 0.95 ? 2.8 : (targetMultiplier > 10 ? 5 : 6)
      const result = 1 + Math.pow(normalizedResult, exponent) * (max - 1)
      return parseFloat(result.toFixed(2))
    }

    const simulatedPrice = parseFloat((basePrice * currentMultiplier).toFixed(5))
    const prevPrice = parseFloat((basePrice * prevMultiplier).toFixed(5))

    const priceColor = simulatedPrice > prevPrice ? '#00ff55' : simulatedPrice < prevPrice ? '#ff4444' : '#ffffff'

    const minPrice = 180
    const maxPrice = 1000000000

    const priceToY = (price: number) => {
      const clamped = Math.min(maxPrice, Math.max(minPrice, price))
      const pct = (clamped - minPrice) / (maxPrice - minPrice)
      return viewBoxHeight - pct * viewBoxHeight
    }

    const sparklinePointsArr = candles.map((candle, i) => {
      const x = i * 6
      const y = priceToY(Math.min(maxPrice, Math.max(minPrice, candle.close)))
      return { x, y, isRed: candle.isRed }
    })
    const sparklinePoints = sparklinePointsArr.map(pt => `${pt.x},${pt.y}`).join(' ')

    const statusText = gameState === 'win'
      ? `MOON 🚀 (${finalMultiplier.toFixed(2)}x)`
      : gameState === 'crash'
        ? `RUGGED 💥 (${finalMultiplier.toFixed(2)}x)`
        : ''
    const statusColor = gameState === 'win' ? '#00c853' : gameState === 'crash' ? '#d50000' : '#ffffff'
    const bgColor = gameState === 'win' ? '#003300' : gameState === 'crash' ? '#330000' : '#000000'
    const offsetX = Math.max(0, candles.length * 14 - viewBoxWidth)
    const isPlaying = gamba.isPlaying || gameState !== 'idle' || animationRef.current !== undefined

    return (
      <>
        <GambaUi.Portal target="screen">
          <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
            {/* Game Area */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <ScreenWrapper style={{ background: bgColor, position: 'relative', transition: 'background 0.3s' }}>
                {gameState === 'idle' && (
                  <ChartWrapper style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <svg width="100%" height="100%" viewBox={`${offsetX} 0 ${viewBoxWidth + 40} ${viewBoxHeight}`} preserveAspectRatio="none">
                        {[...Array(5)].map((_, i) => {
                          const y = (i + 1) * (viewBoxHeight / 6)
                          const priceLabels = [1000, 750, 500, 250, 0]
                          const label = priceLabels[i]
                          return (
                            <React.Fragment key={`grid-${i}`}>
                              <line x1={offsetX} x2={offsetX + viewBoxWidth} y1={y} y2={y} stroke="#2e2e2e" strokeWidth="0.5" />
                              <text x={offsetX + viewBoxWidth + 8} y={y + 4} fill="#bbb" fontSize={12} fontFamily="Arial, sans-serif" style={{ userSelect: 'none' }}>
                                {label}
                              </text>
                            </React.Fragment>
                          )
                        })}
                        <g>
                          {candles.map((candle, idx) => (
                            <Candle key={idx} index={idx} open={candle.open} close={candle.close} high={candle.high} low={candle.low} volume={candle.volume} minPrice={minPrice} maxPrice={maxPrice} />
                          ))}
                        </g>
                        <line x1={offsetX} x2={offsetX + viewBoxWidth} y1={priceToY(simulatedPrice)} y2={priceToY(simulatedPrice)} stroke="#00ff55" strokeWidth="2" strokeDasharray="4 2" />
                        <defs>
                          <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00ff55" />
                            <stop offset="100%" stopColor="#007700" />
                          </linearGradient>
                          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00ff55" floodOpacity="0.7" />
                          </filter>
                        </defs>
                        <polyline points={sparklinePoints} fill="none" stroke="url(#sparklineGradient)" strokeWidth={3} filter="url(#glow)" strokeDasharray="8 4" style={{ transition: 'points 0.1s ease-in-out', animation: 'dashmove 1.2s linear infinite' }} />
                        {sparklinePointsArr.length > 1 && sparklinePointsArr.map((pt, i) => {
                          if (i === 0) return null
                          const prev = sparklinePointsArr[i - 1]
                          const opacity = Math.max(0, 0.7 - (sparklinePointsArr.length - i) * 0.07)
                          return (
                            <line key={`trail-${i}`} x1={prev.x} y1={prev.y} x2={pt.x} y2={pt.y} stroke={pt.isRed ? '#ff4444' : '#00ff55'} strokeWidth={2} opacity={opacity} style={{ filter: 'blur(1px)' }} />
                          )
                        })}
                        <style>{`@keyframes dashmove { to { stroke-dashoffset: 24; } }`}</style>
                      </svg>
                    </div>
                  </ChartWrapper>
                )}
                {(gameState === 'win' || gameState === 'crash') && !showOutcome && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: statusColor, fontSize: 32, fontWeight: 'bold', textAlign: 'center', wordBreak: 'break-word', maxWidth: 340, background: 'rgba(0,0,0,0.7)', borderRadius: 12, padding: '24px 18px', boxShadow: '0 2px 16px #0008' }}>
                    <div style={{ fontSize: 38, color: statusColor, marginBottom: 10 }}>{statusText}</div>
                    <div style={{ fontSize: 22, color: '#fff', marginBottom: 10 }}>
                      Your Pick: <span style={{ color: '#00e676' }}>{multiplierTarget.toFixed(2)}x</span>
                    </div>
                    <div style={{ fontSize: 18, color: '#fff', marginBottom: gameState === 'win' && lastPayout ? 10 : 0 }}>
                      End Result: <span style={{ color: statusColor }}>{finalMultiplier.toFixed(2)}x</span>
                    </div>
                    {gameState === 'win' && lastPayout !== null && (
                      <div style={{ fontSize: 20, color: '#ffd700', fontWeight: 'bold' }}>
                        Total Won:{' '}
                        {`${(lastPayout / Math.pow(10, token?.decimals || 6)).toLocaleString(undefined, { maximumFractionDigits: token?.decimals || 2, })}${token?.symbol ? ` ${token.symbol}` : ''}`}
                      </div>
                    )}
                  </div>
                )}
              </ScreenWrapper>
            </div>
            {/* Paytable */}
            <CryptoChartPaytable ref={paytableRef} wager={wager} targetMultiplier={multiplierTarget} currentMultiplier={currentMultiplier} />
          </div>
        </GambaUi.Portal>
        <GameControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          isPlaying={isPlaying}
          showOutcome={showOutcome}
          playButtonText={hasPlayedBefore ? 'Restart' : 'Trade'}
          style={{ padding: '0 16px' }}
          onPlayAgain={handlePlayAgain}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: '200px' }}>
            <span style={{ fontWeight: 'bold' }}>Target:</span>
            <CustomSlider value={multiplierTarget} onChange={setMultiplierTarget} />
          </div>
        </GameControls>
        {renderThinkingOverlay(
          <CryptoChartGameOverlays 
            gamePhase={gamePhase}
            thinkingPhase={thinkingPhase}
            dramaticPause={dramaticPause}
            celebrationIntensity={celebrationIntensity}
            thinkingEmoji={thinkingEmoji}
            result={gambaResult}
            currentBalance={balance}
            wager={wager}
          />
        )}
      </>
    )
  }