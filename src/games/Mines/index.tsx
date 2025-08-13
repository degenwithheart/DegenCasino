import React, { useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useSound,
  useWagerInput,
  useCurrentToken,
  useTokenMeta,
} from 'gamba-react-ui-v2'
import { GameControls } from '../../components'
import { useIsCompact } from '../../hooks/useIsCompact'
import MinesPaytable, { MinesPaytableRef } from './MinesPaytable'
import MinesOverlays from './MinesOverlays'
import {
  GRID_SIZE,
  MINE_SELECT,
  PITCH_INCREASE_FACTOR,
  SOUND_EXPLODE,
  SOUND_FINISH,
  SOUND_STEP,
  SOUND_TICK,
  SOUND_WIN,
} from './constants'
import { CellButton, Container, Container2, Grid } from './styles'
import { generateGrid, revealAllMines, revealGold } from './utils'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

// Responsive scaling helper (from Slots)
function getResponsiveScale() {
  if (typeof window === 'undefined') return 1
  const width = window.innerWidth
  if (width <= 400) return 0.95
  if (width <= 600) return 1.08
  if (width <= 900) return 1.18
  if (width <= 1200) return 1.28
  if (width <= 1600) return 1.38
  return 1
}

function Mines() {
  const [showBomb, setShowBomb] = useState(false)
  const game = GambaUi.useGame()
  const sounds = useSound({
    tick: SOUND_TICK,
    win: SOUND_WIN,
    finish: SOUND_FINISH,
    step: SOUND_STEP,
    explode: SOUND_EXPLODE,
  })
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const tokenMeta = useTokenMeta(token?.mint)

  const [grid, setGrid] = useState(generateGrid(GRID_SIZE))
  const [currentLevel, setLevel] = useState(0)
  const [selected, setSelected] = useState(-1)
  const [totalGain, setTotalGain] = useState(0)
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)

  const [initialWager, setInitialWager] = useWagerInput()
  const [mines, setMines] = useState(MINE_SELECT[2])
  
  // Live paytable tracking
  const paytableRef = useRef<MinesPaytableRef>(null)
  const [currentResult, setCurrentResult] = useState<{
    level: number
    multiplier: number
    wasSuccessful: boolean
  } | undefined>()

  // Game phase management for overlays
  const [gamePhase, setGamePhase] = useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')
  const [thinkingPhase, setThinkingPhase] = useState(false)
  const [dramaticPause, setDramaticPause] = useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = useState(0)
  const [thinkingEmoji, setThinkingEmoji] = useState('🤔')

  // Responsive: detect compact/mobile
  const isCompact = useIsCompact();

  // Flash bomb/token toggle effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowBomb((prev) => !prev)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  const getMultiplierForLevel = useCallback(
    (level: number) => {
      const remainingCells = GRID_SIZE - level
      const fairMultiplier = Number(BigInt(remainingCells * BPS_PER_WHOLE) / BigInt(remainingCells - mines)) / BPS_PER_WHOLE
      return fairMultiplier * 0.95 // Apply 5% house edge
    },
    [mines],
  )

  const levels = useMemo(() => {
    const totalLevels = GRID_SIZE - mines
    let cumProfit = 0
    let previousBalance = initialWager

    return Array.from({ length: totalLevels }).map((_, level) => {
      const wager = level === 0 ? initialWager : previousBalance
      const multiplier = getMultiplierForLevel(level)
      const remainingCells = GRID_SIZE - level
      const bet = Array.from({ length: remainingCells }, (_, i) => (i < mines ? 0 : multiplier))
      const profit = wager * (multiplier - 1)
      cumProfit += profit
      const balance = wager + profit
      previousBalance = balance
      return { bet, wager, profit, cumProfit, balance }
    }).filter((x) => Math.max(...x.bet) * x.wager < pool.maxPayout)
  }, [initialWager, mines, pool.maxPayout, getMultiplierForLevel])

  const remainingCells = GRID_SIZE - currentLevel
  const gameFinished = remainingCells <= mines
  const canPlay = started && !loading && !gameFinished

  const { wager, bet } = levels[currentLevel] ?? {}

  const start = () => {
    setGrid(generateGrid(GRID_SIZE))
    setLoading(false)
    setLevel(0)
    setTotalGain(0)
    setStarted(true)
  }

  const reset = () => {
    setGrid(generateGrid(GRID_SIZE))
    setLoading(false)
    setLevel(0)
    setTotalGain(0)
    setStarted(false)
  }

  const endGame = async () => {
    // Track cash-out if there was a gain
    if (totalGain > 0 && currentLevel > 0) {
      const multiplier = totalGain / initialWager
      setCurrentResult({
        level: currentLevel - 1,
        multiplier: multiplier,
        wasSuccessful: true
      })
    }
    
    sounds.play('finish')
    reset()
  }

  const play = async (cellIndex: number) => {
    if (!canPlay) return
    setLoading(true)
    setSelected(cellIndex)
    
    // Start overlay sequence
    setGamePhase('thinking')
    setThinkingPhase(true)
    setDramaticPause(false)
    setCelebrationIntensity(0)
    
    // Random thinking emoji
    const thinkingEmojis = ['🤔', '💣', '💎', '⚡', '🔍', '🎯']
    setThinkingEmoji(thinkingEmojis[Math.floor(Math.random() * thinkingEmojis.length)])
    
    try {
      sounds.sounds.step.player.loop = true
      sounds.play('step')
      sounds.sounds.tick.player.loop = true
      sounds.play('tick')

      await game.play({ bet, wager, metadata: [currentLevel] })

      // Thinking phase
      await new Promise(resolve => setTimeout(resolve, 1000))
      setThinkingPhase(false)
      
      // Dramatic pause
      setGamePhase('dramatic')
      setDramaticPause(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      setDramaticPause(false)

      const result = await game.result()

      sounds.sounds.tick.player.stop()

      // Lose condition
      if (result.payout === 0) {
        // Track mine hit
        setCurrentResult({
          level: currentLevel,
          multiplier: 0,
          wasSuccessful: false
        })
        
        setStarted(false)
        setGrid(revealAllMines(grid, cellIndex, mines))
        sounds.play('explode')
        
        // Show mourning overlay
        setGamePhase('mourning')
        setTimeout(() => {
          setGamePhase('idle')
        }, 2500)
        
        return
      }

      // Win condition, proceed
      const nextLevel = currentLevel + 1
      setLevel(nextLevel)
      setGrid(revealGold(grid, cellIndex, result.profit))
      setTotalGain(result.payout)

      // Show celebration overlay for successful mine avoidance
      const multiplier = result.payout / initialWager
      let intensity = 1
      if (multiplier >= 10) intensity = 3
      else if (multiplier >= 3) intensity = 2
      
      setCelebrationIntensity(intensity)
      setGamePhase('celebrating')
      
      // Auto-reset celebration after a short time
      setTimeout(() => {
        setGamePhase('idle')
        setCelebrationIntensity(0)
      }, 2000)

      if (nextLevel < GRID_SIZE - mines) {
        sounds.play('win', { playbackRate: Math.pow(PITCH_INCREASE_FACTOR, currentLevel) })
      } else {
        sounds.play('win', { playbackRate: 0.9 })
        sounds.play('finish')
      }
    } finally {
      setLoading(false)
      setSelected(-1)
      sounds.sounds.tick.player.stop()
      sounds.sounds.step.player.stop()
    }
  }

  // For testing a random hidden cell
  const test = async () => {
    if (!started || loading || gameFinished) return
    const hiddenCells = grid.map((cell, i) => (cell.status === 'hidden' ? i : -1)).filter((i) => i !== -1)
    if (hiddenCells.length > 0) {
      await play(hiddenCells[Math.floor(Math.random() * hiddenCells.length)])
    }
  }

  // Simulate multiple tests in sequence
  const simulate = async () => {
    for (let i = 0; i < 10; i++) {
      if (!started || loading || gameFinished) break
      await test()
    }
  }

  // Responsive scaling for Mines UI
  const scalerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const updateScale = useCallback(() => {
    const responsiveScale = getResponsiveScale()
    if (scalerRef.current) {
      scalerRef.current.style.transform = 'scale(1)'
      const naturalHeight = scalerRef.current.offsetHeight
      const maxScale = 475 / naturalHeight
      const finalScale = Math.min(responsiveScale, maxScale)
      scalerRef.current.style.transform = `scale(${finalScale})`
      setScale(finalScale)
    } else {
      setScale(responsiveScale)
    }
  }, [])

  useEffect(() => {
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => {
      window.removeEventListener('resize', updateScale)
    }
  }, [updateScale])

  // Layout: grid and right panel inside the Gamba screen, always centered
  // Center grid and paytable as a group
  const gambaScreenStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    minHeight: isCompact ? '100dvh' : '100vh',
    display: 'flex',
    flexDirection: isCompact ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    boxSizing: 'border-box',
    padding: isCompact ? '0 0 24px 0' : '0',
  };

  // The group containing grid and paytable
  const centerGroupStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: isCompact ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isCompact ? 24 : 32,
    maxWidth: 1000,
    margin: '0 auto',
  };

  const gridWrapperStyles: React.CSSProperties = {
    flex: '0 1 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: isCompact ? 0 : 320,
    maxWidth: isCompact ? '100%' : 600,
    minHeight: 320,
    width: isCompact ? '100%' : undefined,
    position: 'relative',
    margin: isCompact ? '0 auto' : undefined,
    padding: isCompact ? '16px 0 0 0' : 0,
  };

  const gridContainerStyles: React.CSSProperties = {
    position: 'relative',
    transform: `scale(${scale})`,
    transformOrigin: 'center',
    width: '100%',
    height: '100%',
    transition: 'transform 0.2s ease-out',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    zIndex: 1,
  };

  const rightPanelStyles: React.CSSProperties = {
    flex: '0 1 320px',
    width: isCompact ? '100%' : 320,
    maxWidth: 400,
    margin: isCompact ? '24px auto 0 auto' : '0 0 0 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: isCompact ? 'center' : 'flex-start',
    background: 'none',
    boxSizing: 'border-box',
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main game area */}
          <div
            ref={scalerRef}
            style={{
              flex: 1,
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #374151 0%, #4b5563 25%, #6b7280 50%, #9ca3af 75%, #d1d5db 100%)',
              borderRadius: '24px',
              border: '3px solid rgba(107, 114, 128, 0.3)',
              boxShadow: `
                0 25px 50px rgba(0, 0, 0, 0.5),
                inset 0 2px 4px rgba(255, 255, 255, 0.1),
                inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                0 0 30px rgba(107, 114, 128, 0.2)
              `,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Floating mine/gem background elements */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '8%',
              fontSize: '110px',
              opacity: 0.08,
              transform: 'rotate(-15deg)',
              pointerEvents: 'none',
              color: '#6b7280'
            }}>⛏️</div>
            <div style={{
              position: 'absolute',
              bottom: '15%',
              right: '10%',
              fontSize: '95px',
              opacity: 0.06,
              transform: 'rotate(20deg)',
              pointerEvents: 'none',
              color: '#9ca3af'
            }}>💎</div>
            <div style={{
              position: 'absolute',
              top: '42%',
              right: '12%',
              fontSize: '85px',
              opacity: 0.07,
              transform: 'rotate(-25deg)',
              pointerEvents: 'none',
              color: '#4b5563'
            }}>💣</div>
            <div style={{
              position: 'absolute',
              bottom: '38%',
              left: '10%',
              fontSize: '75px',
              opacity: 0.05,
              transform: 'rotate(30deg)',
              pointerEvents: 'none',
              color: '#d1d5db'
            }}>⚡</div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: 20,
                zIndex: 10,
                position: 'relative'
              }}>
                <h2 style={{
                  fontSize: 32,
                  fontWeight: 800,
                  margin: '0 0 8px 0',
                  letterSpacing: 2,
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  color: '#fff'
                }}>
                  💣 MINES 💎
                </h2>
                <div style={{
                  fontSize: 16,
                  color: '#888',
                  fontWeight: 600
                }}>
                  Find diamonds, avoid mines
                </div>
              </div>

              <GambaUi.Responsive>
                <Container>
                  <Grid>
                    {grid.map((cell, index) => (
                      <CellButton
                        key={index}
                        status={cell.status}
                        selected={selected === index}
                        onClick={() => play(index)}
                        disabled={!canPlay || cell.status !== 'hidden'}
                      >
                        {/* Hidden: Show pulsing token or bomb */}
                        {cell.status === 'hidden' && (
                          <span
                            className="pulse"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              width: 28,
                              height: 28,
                            }}
                          >
                            <span
                              style={{
                                fontSize: showBomb ? 22 : 14,
                                filter: showBomb
                                  ? 'hue-rotate(0deg) drop-shadow(0 0 8px #ff6b6b88)'
                                  : 'hue-rotate(45deg) drop-shadow(0 0 6px #ffe06688)',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {showBomb ? '💣' : (tokenMeta?.image ? '💎' : '🪙')}
                            </span>
                          </span>
                        )}
                        
                        {/* Revealed: Show mines, gold, or profit */}
                        {cell.status === 'gold' && (
                          <div
                            style={{
                              fontSize: 22,
                              filter: 'drop-shadow(0 0 8px #ffe06688)',
                            }}
                          >
                            💎
                          </div>
                        )}
                        
                        {cell.status === 'mine' && (
                          <div
                            style={{
                              fontSize: 22,
                              filter: 'drop-shadow(0 0 8px #ff6b6b88)',
                            }}
                          >
                            💥
                          </div>
                        )}
                        
                        {cell.profit && (
                          <div
                            style={{
                              fontSize: 10,
                              color: '#22c55e',
                              fontWeight: 'bold',
                              textShadow: '0 0 4px #22c55e88',
                            }}
                          >
                            <TokenValue amount={cell.profit} />
                          </div>
                        )}
                      </CellButton>
                    ))}
                  </Grid>
                </Container>
              </GambaUi.Responsive>
              
              {/* Add the overlay component - conditionally rendered based on ENABLE_THINKING_OVERLAY */}
              {renderThinkingOverlay(
                <MinesOverlays
                  gamePhase={getGamePhaseState(gamePhase)}
                  thinkingPhase={getThinkingPhaseState(thinkingPhase)}
                  dramaticPause={dramaticPause}
                  celebrationIntensity={celebrationIntensity}
                  currentWin={totalGain > initialWager ? { multiplier: totalGain / initialWager, amount: totalGain - initialWager } : undefined}
                  thinkingEmoji={thinkingEmoji}
                />
              )}
            </div>
          </div>

          {/* Paytable sidebar */}
          <MinesPaytable
            ref={paytableRef}
            mines={mines}
            levels={levels}
            gridSize={GRID_SIZE}
            currentLevel={currentLevel}
            wager={initialWager}
            currentResult={currentResult}
          />
        </div>
      </GambaUi.Portal>
      <GameControls
        wager={initialWager}
        setWager={setInitialWager}
        onPlay={start}
        isPlaying={loading}
        playButtonText="Start"
        playButtonDisabled={started}
      >
        <GambaUi.Select options={MINE_SELECT} value={mines} onChange={setMines} label={(m) => <>{m} Mines</>} />
        {started && (
          <GambaUi.Button onClick={endGame}>{totalGain > 0 ? 'Finish' : 'Reset'}</GambaUi.Button>
        )}
        {window.location.origin.includes('localhost') && started && (
          <>
            <GambaUi.Button onClick={test}>Test</GambaUi.Button>
            <GambaUi.Button onClick={simulate}>Simulate</GambaUi.Button>
          </>
        )}
      </GameControls>
      {/* Pulse animation */}
      <style>{`
        .pulse {
          animation: pulse 1.2s infinite;
          filter: drop-shadow(0 0 6px #ffe06688);
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 0.85; }
        }
      `}</style>
    </>
  )
}

export default Mines
