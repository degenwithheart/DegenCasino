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
import { GameControls, GambaResultModal } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import React, { useEffect, useRef, useContext, useState } from 'react'
import { useIsCompact } from '../../hooks/useIsCompact'
import { GambaResultContext } from '../../context/GambaResultContext'
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
  const { setGambaResult } = useContext(GambaResultContext)
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

  // Dynamic play button text
  const playButtonText = hasPlayedBefore && !showOutcome ? "Play Again" : "Spin";

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
      timeout.current = setTimeout(() => {
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
        } else {
          // This is a loss according to Gamba
          sounds.play('lose')
          setGood(false)
          setWinningPositions([])
          setWinningPayline(null)
          setCurrentWin(undefined)
          
          console.log('Loss detected - no winning lines shown')
        }

        // Handle game outcome for overlay
        if (gambaResult) {
          handleGameComplete({
            payout: gambaResult.payout,
            wager: wager,
          });
          setGambaResult(gambaResult);
        }
      }, FINAL_DELAY)
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
      setSpinning(true)
      setResult(undefined)
      setWinningPositions([])
      setWinningPayline(null)
      setCurrentWin(undefined)
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
              maxWidth: '600px'
            }}>
              <StyledSlots>
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
          isPlaying={spinning}
          playButtonText={hasPlayedBefore && !showOutcome ? "Spin Again" : "Spin"}
        />
      </GambaUi.Portal>
      
      <GambaResultModal open={resultModalOpen} onClose={() => setResultModalOpen(false)} />
      
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
      `}</style>
    </>
  );
}
