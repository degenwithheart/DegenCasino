import React, { useState, useRef } from "react"
import {
  GambaUi,
  useWagerInput,
  useCurrentToken,
  useCurrentPool,
  useTokenBalance,
  useSound,
  FAKE_TOKEN_MINT,
  TokenValue,
} from 'gamba-react-ui-v2'

import { useIsCompact } from '../../hooks/useIsCompact';
import { TOKEN_METADATA } from '../../constants'
import { useGamba } from 'gamba-react-v2'
import Slider from './Slider'
import { GameControls } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { useGambaResult } from '../../hooks/useGambaResult'
import LimboPaytable, { LimboPaytableRef } from './LimboPaytable'
import LimboOverlays from './LimboOverlays'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

export default function Limbo() {
  // Sound paths
  const spinSound = "/assets/games/limbo/numbers.mp3"
  const winSound = "/assets/games/limbo/win.mp3"
  const loseSound = "/assets/games/limbo/lose.mp3"
  const tickSound = "/assets/games/limbo/tick.mp3"

  const [resultModalOpen, setResultModalOpen] = useState(false)
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const [targetMultiplier, setTargetMultiplier] = useState<number>(20)
  const [resultMultiplier, setResultMultiplier] = useState<number>(0)
  const [playing, setPlaying] = useState<boolean>(false)
  const paytableRef = useRef<LimboPaytableRef>(null)
  const [isWin, setIsWin] = useState<boolean | null>(null)
  const [textColor, setTextColor] = useState<string>('#FFFFFF')

  // Game phase management for overlays
  const [gamePhase, setGamePhase] = React.useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')
  const [thinkingPhase, setThinkingPhase] = React.useState(false)
  const [dramaticPause, setDramaticPause] = React.useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(0)
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🤔')

  const pool = useCurrentPool()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  
  // Responsive scaling logic

  const isCompact = useIsCompact();
  const [scale, setScale] = React.useState(isCompact ? 1 : 1.2);

  React.useEffect(() => {
    setScale(isCompact ? 1 : 1.2);
  }, [isCompact]);

  React.useEffect(() => {
  }, []);
  
  // Game outcome overlay state
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin: overlayIsWin,
    profitAmount,
    resetGameState,
  } = useGameOutcome()

  // Gamba result storage
  const { storeResult } = useGambaResult()

  const tokenMeta = token
    ? TOKEN_METADATA.find((t) => t.symbol === token.symbol)
    : undefined

  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
  const maxWager = baseWager * 1000000
  const tokenPrice = tokenMeta?.usdPrice ?? 0

  // Set default wager: 1 for free tokens, 0 for real tokens
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager) // 1 token for free token
    } else {
      setWager(0) // 0 for real tokens
    }
  }, [setWager, token, baseWager])

  const sounds = useSound({
    spin: spinSound,
    win: winSound,
    lose: loseSound,
    tick: tickSound,
  })

  const handleMultiplierChange = (value: number) => {
    setTargetMultiplier(Math.max(2, Math.min(100, value)))
    sounds.play('tick')
  }

  const startAnimation = (start: number, end: number, winCondition: boolean) => {
    let startTime: number | null = null
    const duration = 2500

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      setResultMultiplier(start + (end - start) * progress)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setTextColor(winCondition ? '#10B981' : '#EF4444')
        sounds.play(winCondition ? 'win' : 'lose')
      }
    }

    requestAnimationFrame(animate)
  }

  const play = async () => {
    try {
      setPlaying(true)
      setResultMultiplier(0)
      setTextColor('#FFFFFF')

      // Start overlay sequence
      setGamePhase('thinking')
      setThinkingPhase(true)
      setDramaticPause(false)
      setCelebrationIntensity(0)
      
      // Random thinking emoji
      const thinkingEmojis = ['🤔', '🎯', '⚡', '💫', '🎪', '🔮']
      setThinkingEmoji(thinkingEmojis[Math.floor(Math.random() * thinkingEmojis.length)])

      const betArray = Array(targetMultiplier + 1).fill(0)
      betArray[targetMultiplier] = targetMultiplier

      await game.play({
        bet: betArray,
        wager,
      })

      // Thinking phase
      await new Promise(resolve => setTimeout(resolve, 1500))
      setThinkingPhase(false)
      
      // Dramatic pause
      setGamePhase('dramatic')
      setDramaticPause(true)
      await new Promise(resolve => setTimeout(resolve, 1200))
      setDramaticPause(false)

      const result = await game.result()

    // Store result in context for modal
    storeResult(result)
      const winCondition = result.resultIndex === targetMultiplier
      setIsWin(winCondition)
      setResultModalOpen(true)

      sounds.play('spin', { playbackRate: 0.8 })

      // Use the actual result index from Gamba for provable fairness
      // The multiplier should reflect the actual on-chain result, not a modified display value
      const endMultiplier = winCondition ? targetMultiplier : result.resultIndex

      // Handle celebration or mourning overlays
      if (winCondition) {
        let intensity = 1
        if (targetMultiplier >= 50) intensity = 3
        else if (targetMultiplier >= 20) intensity = 2
        
        setCelebrationIntensity(intensity)
        setGamePhase('celebrating')
        
        // Auto-reset after celebration
        setTimeout(() => {
          setGamePhase('idle')
          setCelebrationIntensity(0)
        }, 4000)
      } else {
        setGamePhase('mourning')
        
        // Auto-reset after mourning
        setTimeout(() => {
          setGamePhase('idle')
        }, 2500)
      }

      setTimeout(() => {
        startAnimation(1, endMultiplier, winCondition)
        
        // Track game result in paytable
        paytableRef.current?.trackGame({
          targetMultiplier,
          resultMultiplier: endMultiplier,
          wasWin: winCondition,
          amount: winCondition ? result.payout - wager : 0,
        })
        
        // Show outcome overlay after animation
        setTimeout(() => {
          handleGameComplete({ payout: result.payout, wager })
        }, 2000)
      }, 500)
    } catch (err) {
      console.error("Play error", err)
    } finally {
      setPlaying(false)
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main Game Area */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1f2937 0%, #374151 25%, #4b5563 50%, #6b7280 75%, #9ca3af 100%)',
            borderRadius: '24px',
            border: '3px solid rgba(75, 85, 99, 0.3)',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.5),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.3),
              0 0 30px rgba(75, 85, 99, 0.2)
            `,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Floating limbo background elements */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '8%',
              fontSize: '110px',
              opacity: 0.08,
              transform: 'rotate(-15deg)',
              pointerEvents: 'none',
              color: '#4b5563'
            }}>🌀</div>
            <div style={{
              position: 'absolute',
              bottom: '15%',
              right: '10%',
              fontSize: '95px',
              opacity: 0.06,
              transform: 'rotate(20deg)',
              pointerEvents: 'none',
              color: '#6b7280'
            }}>⚫</div>
            <div style={{
              position: 'absolute',
              top: '42%',
              right: '12%',
              fontSize: '85px',
              opacity: 0.07,
              transform: 'rotate(-25deg)',
              pointerEvents: 'none',
              color: '#374151'
            }}>🕳️</div>
            <div style={{
              position: 'absolute',
              bottom: '38%',
              left: '10%',
              fontSize: '75px',
              opacity: 0.05,
              transform: 'rotate(30deg)',
              pointerEvents: 'none',
              color: '#9ca3af'
            }}>💀</div>
            
            {/* Background Effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
              opacity: playing ? 1 : 0.5,
              transition: 'opacity 0.5s ease'
            }} />
            
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 10
            }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '12px',
                padding: '8px 16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ color: '#A78BFA', fontSize: '12px', fontWeight: 600 }}>
                  TARGET MULTIPLIER
                </span>
                <div style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>
                  {targetMultiplier.toFixed(2)}x
                </div>
              </div>
              
              <div style={{
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '12px',
                padding: '8px 16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ color: '#06B6D4', fontSize: '12px', fontWeight: 600 }}>
                  WIN CHANCE
                </span>
                <div style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>
                  {(100 / targetMultiplier).toFixed(2)}%
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              zIndex: 5
            }}>
              {/* Main Multiplier Display */}
              <div style={{
                fontSize: isCompact ? '6rem' : '8rem',
                fontWeight: 900,
                color: textColor,
                transition: 'all 0.5s ease-in-out',
                textShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
                letterSpacing: '-0.02em',
                filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.5))'
              }}>
                {resultMultiplier.toFixed(2)}x
              </div>

              {/* Game Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                maxWidth: '480px',
                width: '100%'
              }}>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    WIN CHANCE
                  </div>
                  <div style={{ color: textColor, fontSize: '20px', fontWeight: 700 }}>
                    {(100 / targetMultiplier).toFixed(1)}%
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    MULTIPLIER
                  </div>
                  <div style={{ color: textColor, fontSize: '20px', fontWeight: 700 }}>
                    {targetMultiplier.toFixed(2)}x
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    POTENTIAL PAYOUT
                  </div>
                  <div style={{ color: '#FCD34D', fontSize: '14px', fontWeight: 700 }}>
                    <TokenValue
                      mint={pool.token}
                      suffix={token?.symbol}
                      amount={targetMultiplier * wager}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Playing Indicator */}
            {playing && (
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(139, 92, 246, 0.2)',
                borderRadius: '20px',
                padding: '8px 16px',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                animation: 'pulse 2s infinite'
              }}>
                <span style={{ color: '#A78BFA', fontSize: '12px', fontWeight: 600 }}>
                  🚀 LAUNCHING...
                </span>
              </div>
            )}
            
            {/* Add the overlay component - conditionally rendered based on ENABLE_THINKING_OVERLAY */}
            {renderThinkingOverlay(
              <LimboOverlays
                gamePhase={getGamePhaseState(gamePhase)}
                thinkingPhase={getThinkingPhaseState(thinkingPhase)}
                dramaticPause={dramaticPause}
                celebrationIntensity={celebrationIntensity}
                currentWin={isWin && resultMultiplier > 0 ? { multiplier: targetMultiplier, amount: targetMultiplier * wager - wager } : undefined}
                thinkingEmoji={thinkingEmoji}
              />
            )}
          </div>

          {/* Live Paytable */}
          <LimboPaytable
            ref={paytableRef}
            targetMultiplier={targetMultiplier}
            wager={wager}
            currentResult={
              isWin !== null
                ? {
                    targetMultiplier,
                    resultMultiplier,
                    wasWin: isWin,
                  }
                : undefined
            }
          />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={playing}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'Play Again' : 'Play'}
        onPlayAgain={handlePlayAgain}
      >
        {/* Multiplier Target Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 'bold' }}>Target:</span>
            <span style={{ 
              padding: '4px 12px', 
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              {targetMultiplier.toFixed(2)}x
            </span>
          </div>
          <Slider
            disabled={playing}
            range={[2, 100]}
            min={2}
            max={100}
            value={targetMultiplier}
            onChange={handleMultiplierChange}
          />
        </div>
      </GameControls>
    </>
  )
}
