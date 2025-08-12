import { GameResult } from 'gamba-core-v2'
import {
  EffectTest,
  FAKE_TOKEN_MINT,
  GambaUi,
  TokenValue,
  useCurrentPool,
  useCurrentToken,
  useTokenBalance,
  useSound,
  useWagerInput,
} from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { GameControls } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import React, { useEffect, useRef, useState } from 'react'
import { useIsCompact } from '../../hooks/useIsCompact'
import { ItemPreview } from './ItemPreview'
import { Slot } from './Slot'
import { StyledSlots } from './Slots.styles'
import { WinningLine } from './WinningLine'
import {
  FINAL_DELAY,
  LEGENDARY_THRESHOLD,
  NUM_REELS,
  NUM_ROWS,
  TOTAL_POSITIONS,
  REVEAL_REEL_DELAY,
  SLOT_ITEMS,
  SOUND_LOSE,
  SOUND_PLAY,
  SOUND_REVEAL,
  SOUND_REVEAL_LEGENDARY,
  SOUND_SPIN,
  SOUND_WIN,
  SPIN_DELAY,
  SlotItem,
  MIN_MATCH,
  PAYLINES,
} from './constants'
import { generateBetArray, getSlotCombination } from './utils'
import SlotsPaytable from './SlotsPaytable'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

interface CurrentWin {
  symbol: string
  count: number
  multiplier: number
  winType: 'payline' | 'scatter'
  paylineNumber?: number
}

/**
 * Check if grid has winning patterns (paylines or scatters)
 */
function checkWinningPattern(grid: SlotItem[]) {
  if (grid.length !== TOTAL_POSITIONS) {
    console.warn('Grid size mismatch:', grid.length, 'expected:', TOTAL_POSITIONS)
    return { hasWin: false, isLegendary: false, maxCount: 0, winningPositions: [], winningPayline: null, isScatter: false }
  }

  // Check paylines for consecutive matches
  for (const payline of PAYLINES) {
    if (payline.length < MIN_MATCH) continue

    const symbols = payline.map(pos => grid[pos]?.id).filter(Boolean)
    if (symbols.length < MIN_MATCH) continue

    const firstSymbol = symbols[0]
    let consecutiveCount = 1

    for (let i = 1; i < symbols.length; i++) {
      if (symbols[i] === firstSymbol) {
        consecutiveCount++
      } else {
        break
      }
    }

    if (consecutiveCount >= MIN_MATCH) {
      const matchingPositions = payline.slice(0, consecutiveCount)
      const isLegendary = firstSymbol === 'unicorn' || consecutiveCount === NUM_REELS
      return {
        hasWin: true,
        isLegendary,
        maxCount: consecutiveCount,
        winningPositions: matchingPositions,
        winningPayline: payline,
        isScatter: false
      }
    }
  }

  // Check for scatter patterns (6+ matching symbols anywhere)
  const symbolCounts = grid.reduce((acc, slot) => {
    acc[slot.id] = (acc[slot.id] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  for (const [symbolId, count] of Object.entries(symbolCounts)) {
    if (count >= MIN_MATCH && symbolId === 'unicorn') {
      const unicornPositions = grid
        .map((slot, index) => slot.id === 'unicorn' ? index : -1)
        .filter(index => index !== -1)
      
      return {
        hasWin: true,
        isLegendary: true, 
        maxCount: unicornPositions.length,
        winningPositions: unicornPositions,
        winningPayline: null,
        isScatter: true
      }
    }
  }
  
  return { 
    hasWin: false, 
    isLegendary: false, 
    maxCount: 0, 
    winningPositions: [],
    winningPayline: null,
    isScatter: false
  }
}

export default function Slots() {
  const gamba = GambaUi.useGame()
  const game = GambaUi.useGame()
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const { balance: walletBalance } = useTokenBalance()
  const paytableRef = useRef<any>(null)

  const [spinning, setSpinning] = React.useState(false)
  const [result, setResult] = React.useState<GameResult>()
  const [good, setGood] = React.useState(false)
  const [revealedReels, setRevealedReels] = React.useState(NUM_REELS)
  const [wager, setWager] = useWagerInput()
  const [combination, setCombination] = React.useState(
    Array.from({ length: TOTAL_POSITIONS }).map(() => SLOT_ITEMS[0]),
  )
  const [winningPositions, setWinningPositions] = React.useState<number[]>([])
  const [winningPayline, setWinningPayline] = React.useState<number[] | null>(null)
  const [currentWin, setCurrentWin] = React.useState<CurrentWin | undefined>(undefined)
  const [highlightedSymbol, setHighlightedSymbol] = React.useState<string | null>(null)
  const [highlightedPayline, setHighlightedPayline] = React.useState<number | null>(null)
  
  // Enhanced animation states
  const [gamePhase, setGamePhase] = React.useState<'idle' | 'thinking' | 'spinning' | 'revealing' | 'celebrating' | 'mourning'>('idle')
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🎰')
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(0)
  const [dramaticPause, setDramaticPause] = React.useState(false)

  // Game outcome overlay state
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
    resetGameState,
  } = useGameOutcome()

  // Dynamic play button text with animation
  const playButtonText = hasPlayedBefore && !showOutcome ? "🎰 SPIN AGAIN! 🎰" : "🚀 SPIN TO WIN! 🚀"

  // Thinking emoji cycle for dramatic effect
  const thinkingEmojis = ['🎰', '🤔', '💭', '🎯', '🔮', '✨', '🎲', '🎪', '🎭', '🎨', '💎', '🌟']
  
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (gamePhase === 'thinking') {
      interval = setInterval(() => {
        setThinkingEmoji(prev => {
          const currentIndex = thinkingEmojis.indexOf(prev)
          return thinkingEmojis[(currentIndex + 1) % thinkingEmojis.length]
        })
      }, 150)
    }
    return () => clearInterval(interval)
  }, [gamePhase])

  const tokenMeta = token ? TOKEN_METADATA.find(t => t.symbol === token.symbol) : undefined
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
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    reveal: SOUND_REVEAL,
    revealLegendary: SOUND_REVEAL_LEGENDARY,
    spin: SOUND_SPIN,
    play: SOUND_PLAY,
  })

  const bet = React.useMemo(
    () => generateBetArray(pool?.maxPayout ?? 1, wager),
    [pool?.maxPayout, wager],
  )
  const timeout = useRef<any>()
  const isValid = bet.some((x) => x > 1)
  const isPlaying = spinning

  useEffect(() => {
    return () => {
      timeout.current && clearTimeout(timeout.current)
    }
  }, [])

  const revealReel = (grid: SlotItem[], reelIndex = 0, gambaResult?: GameResult) => {
    sounds.play('reveal', { playbackRate: 1.1 })
    setGamePhase('revealing')

    // Check for partial winning patterns as we reveal reels (for sound effects only)
    const revealedSoFar = getRevealedPositions(reelIndex + 1, grid)
    const { isLegendary } = checkWinningPattern(revealedSoFar)

    if (isLegendary && revealedSoFar.length >= MIN_MATCH) {
      sounds.play('revealLegendary')
    }

    setRevealedReels(reelIndex + 1)

    if (reelIndex < NUM_REELS - 1) {
      timeout.current = setTimeout(() => revealReel(grid, reelIndex + 1, gambaResult), REVEAL_REEL_DELAY)
    } else {
      sounds.sounds.spin.player.stop()
      
      // Dramatic pause before revealing result
      setDramaticPause(true)
      
      timeout.current = setTimeout(() => {
        setDramaticPause(false)
        setSpinning(false)
        
        // CRITICAL: Use ONLY Gamba's result to determine win/loss
        const isGambaWin = gambaResult && gambaResult.multiplier > 0
        
        // Track this spin in paytable
        paytableRef.current?.trackSpin(isGambaWin)
        
        console.log('Final result determination:', {
          gambaMultiplier: gambaResult?.multiplier,
          gambaPayout: gambaResult?.payout,
          isGambaWin,
          gridSymbols: grid.map(item => item.id)
        })
        
        if (isGambaWin) {
          // This is a win according to Gamba
          sounds.play('win')
          setGood(true)
          setGamePhase('celebrating')
          
          // Set celebration intensity based on multiplier
          const multiplier = gambaResult?.multiplier || 0
          if (multiplier >= 50) {
            setCelebrationIntensity(3) // INSANE celebration
          } else if (multiplier >= 10) {
            setCelebrationIntensity(2) // Major celebration
          } else if (multiplier >= 2) {
            setCelebrationIntensity(1) // Moderate celebration
          } else {
            setCelebrationIntensity(1) // Minor celebration
          }
          
          // Find the actual winning pattern in the generated grid
          const { winningPositions, winningPayline, isScatter } = checkWinningPattern(grid)
          setWinningPositions(winningPositions)
          setWinningPayline(winningPayline)
          
          // Set current win for paytable tracking
          if (winningPositions.length > 0) {
            const winningSymbol = grid[winningPositions[0]]
            const paylineIndex = winningPayline ? PAYLINES.findIndex(p => p.toString() === winningPayline.toString()) : undefined
            
            setCurrentWin({
              symbol: winningSymbol.id,
              count: winningPositions.length,
              multiplier: gambaResult?.multiplier || 0,
              winType: isScatter ? 'scatter' : 'payline',
              paylineNumber: paylineIndex
            })
          }
          
          console.log('Win detected - showing winning lines:', {
            winningPositions,
            winningPayline,
            isScatter
          })
          
          // Return to idle after celebration
          setTimeout(() => {
            setGamePhase('idle')
            setCelebrationIntensity(0)
          }, 3000)
          
        } else {
          // This is a loss according to Gamba
          sounds.play('lose')
          setGood(false)
          setGamePhase('mourning')
          setWinningPositions([])
          setWinningPayline(null)
          setCurrentWin(undefined)
          
          console.log('Loss detected - no winning lines shown')
          
          // Return to idle after mourning
          setTimeout(() => {
            setGamePhase('idle')
          }, 2000)
        }

        // Handle game outcome for overlay
        if (gambaResult) {
          handleGameComplete({
            payout: gambaResult.payout,
            wager: wager,
          });
        }
      }, FINAL_DELAY + 1000) // Extra dramatic pause
    }
  }

  // Helper function to get positions revealed so far
  const getRevealedPositions = (reelsRevealed: number, grid: SlotItem[]): SlotItem[] => {
    const revealed: SlotItem[] = []
    for (let reel = 0; reel < reelsRevealed; reel++) {
      for (let row = 0; row < NUM_ROWS; row++) {
        const index = row * NUM_REELS + reel
        if (index < grid.length) {
          revealed.push(grid[index])
        }
      }
    }
    return revealed
  }

  const play = async () => {
    // Reset overlay state when starting new game
    if (showOutcome) {
      handlePlayAgain()
      return
    }

    try {
      // Dramatic thinking phase
      setGamePhase('thinking')
      setThinkingEmoji('🎰')
      
      // Thinking delay for drama
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSpinning(true)
      setGamePhase('spinning')
      setResult(undefined)
      setWinningPositions([])
      setWinningPayline(null)
      setCurrentWin(undefined)
      setCelebrationIntensity(0)
      
      await game.play({ wager, bet })

      sounds.play('play')
      setRevealedReels(0)
      setGood(false)
      sounds.play('spin', { playbackRate: 0.5 })

      const startTime = Date.now()
      const result = await gamba.result()
      const revealDelay = Math.max(0, SPIN_DELAY - (Date.now() - startTime))

      console.log('Game Result from Gamba:', {
        multiplier: result.multiplier,
        payout: result.payout,
        wager: wager,
        resultIndex: result.resultIndex,
        betArrayLength: bet.length,
        betArraySample: bet.slice(0, 10),
        isWin: result.multiplier > 0
      })

      const grid = getSlotCombination(TOTAL_POSITIONS, result.multiplier, bet)
      setCombination(grid)
      setResult(result)

      timeout.current = setTimeout(() => revealReel(grid, 0, result), revealDelay)
    } catch (err) {
      setSpinning(false)
      setGamePhase('idle')
      setRevealedReels(NUM_REELS)
      setResult(undefined)
      setWinningPositions([])
      setWinningPayline(null)
      setCurrentWin(undefined)
      setCombination(Array.from({ length: TOTAL_POSITIONS }).map(() => SLOT_ITEMS[0]))
      window?.alert?.('An error occurred during the spin. Please try again.')
      console.error('Slots error:', err)
    }
  }

  // Responsive scaling logic using useIsCompact
  const { compact } = useIsCompact();
  const [scale, setScale] = useState(compact ? 1 : 1.28);
  useEffect(() => { setScale(compact ? 1 : 1.28); }, [compact]);

  // Ref for slots grid
  const slotsGridRef = React.useRef<HTMLDivElement>(null);

  const [resultModalOpen, setResultModalOpen] = useState(false);
  
  return (
    <>
      <GambaUi.Portal target="screen">
        {good && <EffectTest src={combination[0].image} />}
        <GambaUi.Responsive>
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center',
              width: '100%',
              height: '100%',
              transition: 'transform 0.2s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533a7d 75%, #8e44ad 100%)',
              borderRadius: '24px',
              border: '3px solid rgba(255, 255, 255, 0.15)',
              boxShadow: `
                0 25px 50px rgba(0, 0, 0, 0.5),
                inset 0 2px 4px rgba(255, 255, 255, 0.1),
                inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                0 0 30px rgba(142, 68, 173, 0.2)
              `,
              overflow: 'hidden',
              position: 'relative',
              padding: '20px'
            }}
            className="slots-game-scaler"
          >
            {/* Main Game Area */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              flex: 1,
              maxWidth: '600px',
              position: 'relative'
            }}>
              {/* Dramatic Thinking Overlay */}
              {renderThinkingOverlay(
                gamePhase === 'thinking' && (
                  <div className="thinking-overlay">
                    <div className="thinking-content">
                      <div className="thinking-emoji">{thinkingEmoji}</div>
                      <div className="thinking-text">Calculating the perfect spin...</div>
                      <div className="thinking-subtext">🎯 Analyzing 15 paylines 🎯</div>
                    </div>
                  </div>
                )
              )}

              {/* Dramatic Pause Overlay */}
              {renderThinkingOverlay(
                dramaticPause && (
                  <div className="dramatic-pause-overlay">
                    <div className="dramatic-pause-content">
                      <div className="pause-emoji">⏰</div>
                      <div className="pause-text">Moment of Truth...</div>
                    </div>
                  </div>
                )
              )}

              {/* Celebration Overlays */}
              {renderThinkingOverlay(
                gamePhase === 'celebrating' && celebrationIntensity > 0 && (
                  <div className={`celebration-overlay celebration-level-${celebrationIntensity}`}>
                    <div className="celebration-content">
                      {celebrationIntensity >= 3 && (
                        <>
                          <div className="mega-win-text">🎆 MEGA WIN! 🎆</div>
                          <div className="win-amount">{currentWin && `${currentWin.multiplier}x MULTIPLIER!`}</div>
                        </>
                      )}
                      {celebrationIntensity === 2 && (
                        <>
                          <div className="big-win-text">🎉 BIG WIN! 🎉</div>
                          <div className="win-amount">{currentWin && `${currentWin.multiplier}x PAYOUT!`}</div>
                        </>
                      )}
                      {celebrationIntensity === 1 && (
                        <>
                          <div className="nice-win-text">✨ NICE WIN! ✨</div>
                          <div className="win-amount">{currentWin && `${currentWin.multiplier}x`}</div>
                        </>
                      )}
                    </div>
                    <div className="celebration-particles">
                      {Array.from({ length: celebrationIntensity * 15 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="particle" 
                          style={{ 
                            animationDelay: `${Math.random() * 2}s`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${2 + Math.random() * 2}s`
                          }}
                        >
                          {['💎', '🌟', '✨', '🎉', '🎊', '💰', '🏆', '🔥'][Math.floor(Math.random() * 8)]}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}

              {/* Mourning Overlay */}
              {renderThinkingOverlay(
                gamePhase === 'mourning' && (
                  <div className="mourning-overlay">
                    <div className="mourning-content">
                      <div className="mourning-emoji">😔</div>
                      <div className="mourning-text">Better luck next spin!</div>
                      <div className="mourning-subtext">🎰 The machine hungers for more... 🎰</div>
                    </div>
                  </div>
                )
              )}

              <StyledSlots className={`game-phase-${gamePhase} celebration-intensity-${celebrationIntensity}`}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                }}>
                  <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '100%',
                    marginBottom: '20px'
                  }}>
                    <div className="slots-grid" ref={slotsGridRef}>
                      {/* Winning Line Overlay */}
                      {good && (
                        <WinningLine
                          winningPositions={winningPositions}
                          winningPayline={winningPayline}
                          isScatter={winningPayline === null && winningPositions.length > 0}
                        />
                      )}
                      {/* Enhanced Symbol Highlighting */}
                      {highlightedSymbol && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          pointerEvents: 'none',
                          zIndex: 10
                        }}>
                          {combination.map((item, index) => 
                            item.id === highlightedSymbol ? (
                              <div
                                key={index}
                                style={{
                                  position: 'absolute',
                                  top: `${Math.floor(index / NUM_REELS) * (100 / NUM_ROWS)}%`,
                                  left: `${(index % NUM_REELS) * (100 / NUM_REELS)}%`,
                                  width: `${100 / NUM_REELS}%`,
                                  height: `${100 / NUM_ROWS}%`,
                                  background: 'rgba(255, 224, 102, 0.3)',
                                  border: '2px solid #ffe066',
                                  borderRadius: '8px',
                                  boxShadow: '0 0 15px rgba(255, 224, 102, 0.6)',
                                  animation: 'pulse 1.5s infinite'
                                }}
                              />
                            ) : null
                          )}
                        </div>
                      )}
                      {/* Payline Highlighting */}
                      {highlightedPayline !== null && PAYLINES[highlightedPayline] && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          pointerEvents: 'none',
                          zIndex: 5
                        }}>
                          {PAYLINES[highlightedPayline].map((position, index) => (
                            <div
                              key={index}
                              style={{
                                position: 'absolute',
                                top: `${Math.floor(position / NUM_REELS) * (100 / NUM_ROWS)}%`,
                                left: `${(position % NUM_REELS) * (100 / NUM_REELS)}%`,
                                width: `${100 / NUM_REELS}%`,
                                height: `${100 / NUM_ROWS}%`,
                                background: 'rgba(224, 255, 179, 0.2)',
                                border: '2px solid #b3ffd9',
                                borderRadius: '8px',
                                animation: 'glow 2s infinite'
                              }}
                            />
                          ))}
                        </div>
                      )}
                      {/* Group slots by reel */}
                      {Array.from({ length: NUM_REELS }).map((_, reelIndex) => (
                        <div key={reelIndex} className="slots-reel">
                          <div className="reel-label">REEL {reelIndex + 1}</div>
                          {Array.from({ length: NUM_ROWS }).map((_, rowIndex) => {
                            const slotIndex = rowIndex * NUM_REELS + reelIndex
                            const isReelRevealed = revealedReels > reelIndex
                            return (
                              <Slot
                                key={slotIndex}
                                index={slotIndex}
                                revealed={isReelRevealed}
                                item={combination[slotIndex]}
                                good={good}
                              />
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </StyledSlots>
            </div>

            {/* Live Paytable Sidebar */}
            <SlotsPaytable
              ref={paytableRef}
              wager={wager}
              currentWin={currentWin}
              onSymbolHover={setHighlightedSymbol}
              onPaylineHover={setHighlightedPayline}
            />
          </div>
        </GambaUi.Responsive>
      </GambaUi.Portal>
      
      <GambaUi.Portal target="controls">
        <GameControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          isPlaying={spinning || gamePhase === 'thinking'}
          showOutcome={showOutcome}
          playButtonText={playButtonText}
          onPlayAgain={handlePlayAgain}
        />
      </GambaUi.Portal>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(179, 255, 217, 0.3);
          }
          50% { 
            box-shadow: 0 0 20px rgba(179, 255, 217, 0.8);
          }
        }

        /* Thinking Phase Animations */
        .thinking-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(10px);
          animation: fadeInDramatic 0.5s ease-in;
        }

        .thinking-content {
          text-align: center;
          animation: breathe 2s ease-in-out infinite;
        }

        .thinking-emoji {
          font-size: 80px;
          margin-bottom: 20px;
          animation: rotate360 2s linear infinite, pulse 1.5s ease-in-out infinite;
        }

        .thinking-text {
          font-size: 24px;
          font-weight: 700;
          color: #ffe066;
          margin-bottom: 10px;
          text-shadow: 0 0 20px rgba(255, 224, 102, 0.8);
          animation: glow 2s ease-in-out infinite;
        }

        .thinking-subtext {
          font-size: 16px;
          color: #ccc;
          animation: fadeInOut 3s ease-in-out infinite;
        }

        /* Dramatic Pause */
        .dramatic-pause-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(20, 20, 20, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          animation: dramaticEntry 1s ease-out;
        }

        .dramatic-pause-content {
          text-align: center;
          animation: intenseBreathe 1s ease-in-out infinite;
        }

        .pause-emoji {
          font-size: 60px;
          margin-bottom: 15px;
          animation: tickingClock 0.5s ease-in-out infinite;
        }

        .pause-text {
          font-size: 28px;
          font-weight: 700;
          color: #ff6b6b;
          text-shadow: 0 0 30px rgba(255, 107, 107, 0.8);
          animation: dramaticPulse 1s ease-in-out infinite;
        }

        /* Celebration Overlays */
        .celebration-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          pointer-events: none;
          overflow: hidden;
        }

        .celebration-level-1 {
          background: rgba(76, 175, 80, 0.1);
          animation: gentleCelebration 3s ease-out;
        }

        .celebration-level-2 {
          background: rgba(255, 193, 7, 0.2);
          animation: bigCelebration 3s ease-out;
        }

        .celebration-level-3 {
          background: rgba(156, 39, 176, 0.3);
          animation: megaCelebration 3s ease-out;
        }

        .celebration-content {
          text-align: center;
          z-index: 2;
        }

        .mega-win-text {
          font-size: 48px;
          font-weight: 900;
          color: #e91e63;
          text-shadow: 0 0 30px rgba(233, 30, 99, 0.8);
          animation: megaWinPulse 0.5s ease-in-out infinite alternate;
          margin-bottom: 10px;
        }

        .big-win-text {
          font-size: 36px;
          font-weight: 800;
          color: #ff9800;
          text-shadow: 0 0 25px rgba(255, 152, 0, 0.8);
          animation: bigWinBounce 0.6s ease-in-out infinite alternate;
          margin-bottom: 10px;
        }

        .nice-win-text {
          font-size: 28px;
          font-weight: 700;
          color: #4caf50;
          text-shadow: 0 0 20px rgba(76, 175, 80, 0.8);
          animation: niceWinGlow 1s ease-in-out infinite alternate;
          margin-bottom: 10px;
        }

        .win-amount {
          font-size: 24px;
          font-weight: 600;
          color: #ffe066;
          text-shadow: 0 0 15px rgba(255, 224, 102, 0.6);
        }

        .celebration-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          font-size: 24px;
          animation: particleFall linear infinite;
          opacity: 0.8;
        }

        /* Mourning Overlay */
        .mourning-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(30, 30, 30, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 998;
          animation: mourningEntry 1s ease-out;
        }

        .mourning-content {
          text-align: center;
          animation: sadBreathe 2s ease-in-out infinite;
        }

        .mourning-emoji {
          font-size: 60px;
          margin-bottom: 15px;
          animation: sadSway 3s ease-in-out infinite;
        }

        .mourning-text {
          font-size: 24px;
          font-weight: 600;
          color: #ff6b6b;
          margin-bottom: 8px;
          text-shadow: 0 0 15px rgba(255, 107, 107, 0.5);
        }

        .mourning-subtext {
          font-size: 14px;
          color: #999;
          animation: fadeInOut 2s ease-in-out infinite;
        }

        /* Game Phase Styles */
        .game-phase-thinking .slots-grid {
          filter: blur(2px);
          opacity: 0.3;
          transition: all 0.5s ease;
        }

        .game-phase-spinning .slots-grid {
          animation: slotMachineShake 0.1s infinite;
        }

        .game-phase-celebrating.celebration-intensity-3 .slots-grid {
          animation: megaWinShake 0.2s infinite, rainbow 2s linear infinite;
        }

        .game-phase-celebrating.celebration-intensity-2 .slots-grid {
          animation: bigWinPulse 0.3s infinite alternate;
        }

        .game-phase-celebrating.celebration-intensity-1 .slots-grid {
          animation: gentleGlow 1s ease-in-out infinite alternate;
        }

        .game-phase-mourning .slots-grid {
          filter: grayscale(100%) brightness(0.5);
          animation: disappointedShake 0.5s ease-in-out 3;
        }

        /* Keyframe Definitions */
        @keyframes fadeInDramatic {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes rotate360 {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes dramaticEntry {
          0% { opacity: 0; background: rgba(20, 20, 20, 0); }
          100% { opacity: 1; background: rgba(20, 20, 20, 0.95); }
        }

        @keyframes intenseBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes tickingClock {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        @keyframes dramaticPulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.1); filter: brightness(1.5); }
        }

        @keyframes gentleCelebration {
          0% { opacity: 0; transform: scale(0.8); }
          20% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0; transform: scale(1); }
        }

        @keyframes bigCelebration {
          0% { opacity: 0; transform: scale(0.5) rotate(-10deg); }
          20% { opacity: 1; transform: scale(1.2) rotate(5deg); }
          100% { opacity: 0; transform: scale(1) rotate(0deg); }
        }

        @keyframes megaCelebration {
          0% { opacity: 0; transform: scale(0.3) rotate(-20deg); }
          20% { opacity: 1; transform: scale(1.3) rotate(10deg); }
          40% { transform: scale(1.1) rotate(-5deg); }
          60% { transform: scale(1.2) rotate(5deg); }
          100% { opacity: 0; transform: scale(1) rotate(0deg); }
        }

        @keyframes megaWinPulse {
          0% { transform: scale(1) rotate(-1deg); }
          100% { transform: scale(1.2) rotate(1deg); }
        }

        @keyframes bigWinBounce {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-10px) scale(1.1); }
        }

        @keyframes niceWinGlow {
          0% { filter: brightness(1); }
          100% { filter: brightness(1.3); }
        }

        @keyframes particleFall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(500px) rotate(360deg); opacity: 0; }
        }

        @keyframes mourningEntry {
          0% { opacity: 0; filter: blur(10px); }
          100% { opacity: 1; filter: blur(0px); }
        }

        @keyframes sadBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.95); }
        }

        @keyframes sadSway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }

        @keyframes megaWinShake {
          0%, 100% { transform: translateX(0px); }
          25% { transform: translateX(-3px) rotate(1deg); }
          75% { transform: translateX(3px) rotate(-1deg); }
        }

        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }

        @keyframes bigWinPulse {
          0% { transform: scale(1); filter: brightness(1); }
          100% { transform: scale(1.05); filter: brightness(1.2); }
        }

        @keyframes gentleGlow {
          0% { filter: brightness(1) drop-shadow(0 0 5px rgba(76, 175, 80, 0.3)); }
          100% { filter: brightness(1.1) drop-shadow(0 0 15px rgba(76, 175, 80, 0.6)); }
        }

        @keyframes disappointedShake {
          0%, 100% { transform: translateX(0px); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
      `}</style>
    </>
  );
}
