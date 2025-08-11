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
import { GameControls, GameScreenLayout } from '../../components'
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

/**
 * Check if grid has winning patterns (paylines or scatters)
 */
function checkWinningPattern(grid: SlotItem[]) {
  // Collect all winning patterns instead of returning first found
  const allWinningPatterns: Array<{
    hasWin: boolean
    isLegendary: boolean
    maxCount: number
    winningPositions: number[]
    winningPayline: number[]
    isScatter: boolean
  }> = []

  // Check paylines for consecutive matches
  for (const payline of PAYLINES) {
    for (let startPos = 0; startPos <= payline.length - MIN_MATCH; startPos++) {
      for (let length = 6; length >= MIN_MATCH; length--) {
        if (startPos + length > payline.length) continue
        
        const positions = payline.slice(startPos, startPos + length)
        const symbols = positions.map(pos => grid[pos])
        
        if (symbols.every(symbol => symbol?.id === symbols[0]?.id)) {
          const item = symbols[0]
          const isLegendary = item && item.multiplier >= LEGENDARY_THRESHOLD
          allWinningPatterns.push({ 
            hasWin: true, 
            isLegendary, 
            maxCount: length, 
            winningPositions: positions,
            winningPayline: payline,
            isScatter: false
          })
        }
      }
    }
  }

  // If we found winning patterns, return a random one instead of the first
  if (allWinningPatterns.length > 0) {
    const randomPattern = allWinningPatterns[Math.floor(Math.random() * allWinningPatterns.length)]
    return randomPattern
  }
  
  // Check for scatter wins (unicorns anywhere)
  const unicornPositions: number[] = []
  grid.forEach((item, index) => {
    if (item?.id === 'unicorn') {
      unicornPositions.push(index)
    }
  })
  
  if (unicornPositions.length >= MIN_MATCH) {
    return { 
      hasWin: true, 
      isLegendary: true, 
      maxCount: unicornPositions.length,
      winningPositions: unicornPositions,
      winningPayline: null,
      isScatter: true
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

function Messages({ messages }: { messages: string[] }) {
  const [messageIndex, setMessageIndex] = React.useState(0)
  React.useEffect(() => {
    const timeout = setInterval(() => {
      setMessageIndex((x) => (x + 1) % messages.length)
    }, 2500)
    return () => clearInterval(timeout)
  }, [messages])
  return <>{messages[messageIndex]}</>
}

export default function Slots() {
  const { setGambaResult } = useContext(GambaResultContext)
  const [showPatterns, setShowPatterns] = React.useState(false)
  const gamba = GambaUi.useGame()
  const game = GambaUi.useGame()
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const { balance: walletBalance } = useTokenBalance()

  const [spinning, setSpinning] = React.useState(false)
  const [result, setResult] = React.useState<GameResult>()
  const [good, setGood] = React.useState(false)
  const [revealedReels, setRevealedReels] = React.useState(NUM_REELS) // Track revealed reels instead of slots
  const [wager, setWager] = useWagerInput()
  const [combination, setCombination] = React.useState(
    Array.from({ length: TOTAL_POSITIONS }).map(() => SLOT_ITEMS[0]),
  )
  const [winningPositions, setWinningPositions] = React.useState<number[]>([])
  const [winningPayline, setWinningPayline] = React.useState<number[] | null>(null)

  // Game outcome overlay state
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
    resetGameState,
  } = useGameOutcome();

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
      setCombination(Array.from({ length: TOTAL_POSITIONS }).map(() => SLOT_ITEMS[0]))
      window?.alert?.('An error occurred during the spin. Please try again.')
      console.error('Slots error:', err)
    }
  }

  // Responsive scaling logic using useIsCompact
  const { compact } = useIsCompact();
  const [scale, setScale] = useState(compact ? 1 : 1.28);
  useEffect(() => { setScale(compact ? 1 : 1.28); }, [compact]);

  // Ref for slots grid and paytable
  const slotsGridRef = React.useRef<HTMLDivElement>(null);
  const [slotsGridHeight, setSlotsGridHeight] = React.useState<number | undefined>(undefined);

  // Update paytable height to match slots grid
  React.useEffect(() => {
    if (slotsGridRef.current) {
      setSlotsGridHeight(slotsGridRef.current.offsetHeight);
    }
  }, [combination, scale, revealedReels]);

  // Paytable overlay content
  const PaytablePanel = () => {
    const [selectedPayline, setSelectedPayline] = React.useState(0);
    React.useEffect(() => {
      const interval = setInterval(() => {
        setSelectedPayline((prev) => (prev + 1) % PAYLINES.length);
      }, 2000);
      return () => clearInterval(interval);
    }, []);
    const payline = PAYLINES[selectedPayline];
    const paylineSymbol = SLOT_ITEMS.filter(item => item.multiplier > 0).sort((a, b) => b.multiplier - a.multiplier)[selectedPayline % SLOT_ITEMS.filter(item => item.multiplier > 0).length];
    const gridRows = NUM_ROWS;
    const gridCols = NUM_REELS;
    const panelWidth = 200;
    const gridCell = 18;
    const gridGap = 2;
    const gridPad = 5;
    const cardMaxHeight = 340;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: panelWidth,
          maxWidth: panelWidth,
          height: slotsGridHeight ? slotsGridHeight : 'auto',
          transition: 'height 0.2s',
        }}
      >
        <div
          style={{
            maxHeight: cardMaxHeight,
            width: '100%',
            background: 'rgba(24,24,42,0.92)',
            borderRadius: 14,
            padding: '18px 8px 14px 8px',
            boxShadow: '0 2px 12px #0004',
            margin: 'auto 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 12, fontWeight: 700, color: '#ffe066', fontSize: '1.1rem', letterSpacing: 0.2 }}>Paytable</div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            {SLOT_ITEMS.filter(item => item.multiplier > 0).sort((a, b) => a.multiplier - b.multiplier).map(item => (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <img src={item.image} alt={item.id} style={{ width: 16, height: 16, borderRadius: 3, background: '#222', boxShadow: '0 1px 4px #0006' }} />
                <span style={{ fontWeight: 900, fontSize: 11, color: '#ffe066', background: '#23234a', borderRadius: 3, padding: '0px 4px', marginTop: 1 }}>{item.multiplier}x</span>
              </div>
            ))}
          </div>
          {/* Auto-cycling Winning Patterns section */}
          <div style={{ width: '100%', marginTop: 2, background: 'linear-gradient(120deg, #e0ffb3 0%, #b3ffd9 100%)', borderRadius: 10, boxShadow: '0 2px 16px #0002', padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 13, color: '#555', marginBottom: 4, letterSpacing: 0.5 }}>{`Paylines (${PAYLINES.length} total)`}</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 11, color: '#333', background: '#fff7', borderRadius: 5, padding: '2px 8px' }}>{`Payline ${selectedPayline + 1}`}</span>
            </div>
            {/* Payline grid */}
            <div style={{ display: 'grid', gridTemplateRows: `repeat(${gridRows}, ${gridCell}px)`, gridTemplateColumns: `repeat(${gridCols}, ${gridCell}px)`, gap: gridGap, background: '#222', borderRadius: 7, padding: gridPad, marginBottom: 6, boxShadow: '0 2px 8px #0002' }}>
              {Array.from({ length: gridRows }).map((_, row) => (
                Array.from({ length: gridCols }).map((_, col) => {
                  const idx = row * gridCols + col;
                  const isActive = payline.includes(idx);
                  return (
                    <div key={idx} style={{ width: gridCell - 2, height: gridCell - 2, borderRadius: 4, background: isActive ? '#ffe066' : '#23234a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isActive ? (
                        <img src={paylineSymbol?.image} alt={paylineSymbol?.id} style={{ width: gridCell - 8, height: gridCell - 8 }} />
                      ) : null}
                    </div>
                  );
                })
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Controls with Paytable button
  function ControlsWithPaytable({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
    return (
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={spinning}
        playButtonText={playButtonText}
      >
        <button
          type="button"
          style={{
            marginLeft: 8,
            padding: '8px 16px',
            borderRadius: 8,
            background: 'linear-gradient(90deg, #ffd700, #a259ff)',
            color: '#222',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            boxShadow: '0 0 8px #ffd70088',
          }}
          onClick={onOpenSidebar}
        >
          Paytable
        </button>
      </GameControls>
    );
  }

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
            }}
            className="slots-game-scaler"
          >
            <GameScreenLayout
              display="ruby"
              left={
                <StyledSlots>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    flex: 1
                  }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                      <div className="slots-grid" ref={slotsGridRef}>
                        {/* Winning Line Overlay */}
                        {good && (
                          <WinningLine
                            winningPositions={winningPositions}
                            winningPayline={winningPayline}
                            isScatter={winningPayline === null && winningPositions.length > 0}
                          />
                        )}
                        {/* Group slots by reel instead of by row */}
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
              }
              right={<PaytablePanel />}
              controls={<ControlsWithPaytable />}
            />
          </div>
        </GambaUi.Responsive>
      </GambaUi.Portal>
    </>
  );
}
