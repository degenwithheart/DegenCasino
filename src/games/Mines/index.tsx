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
import { GameControls, GameScreenLayout } from '../../components'
import { GambaResultContext } from '../../context/GambaResultContext'
import { useIsCompact } from '../../hooks/useIsCompact'
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

// PayTable component
type PayTableProps = {
  mines: number
  levels: Array<{ wager: number; bet: number[]; cumProfit: number }>
  gridSize: number
  currentLevel: number
}

function PayTable({ mines, levels, gridSize, currentLevel }: PayTableProps) {
  const windowSize = 5
  const totalLevels = levels.length
  let start = 0
  if (currentLevel > 2 && totalLevels > windowSize) {
    start = Math.min(currentLevel - 2, totalLevels - windowSize)
  }
  const visibleLevels = levels.slice(start, start + windowSize)

  return (
    <div
      style={{
        minWidth: 240,
        maxWidth: 320,
        marginLeft: 24,
        background: '#111',
        borderRadius: 14,
        padding: '12px 10px',
        boxShadow: '0 2px 12px #0004',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: 8,
          fontWeight: 700,
          color: '#ffe066',
          fontSize: '1rem',
        }}
      >
        Payouts
      </div>
      <table
        className="payout-table"
        style={{ width: '100%', borderCollapse: 'collapse', background: 'none', color: '#ccc', borderRadius: 8, overflow: 'hidden' }}
      >
        <thead>
          <tr style={{ background: '#181818', color: '#aaa', fontWeight: 700, fontSize: 13 }}>
            <th style={{ textAlign: 'center', padding: '8px 6px' }}>Level</th>
            <th style={{ textAlign: 'center', padding: '8px 6px' }}>Chance</th>
            <th style={{ textAlign: 'center', padding: '8px 6px' }}>Multiplier</th>
            <th style={{ textAlign: 'center', padding: '8px 6px' }}>Profit</th>
          </tr>
        </thead>
        <tbody>
          {visibleLevels.map((level, i) => {
            const realIndex = start + i
            const multiplier = level.wager && level.bet ? level.bet.find((x) => x > 0) || 0 : 0
            const remainingCells = gridSize - realIndex
            const safeCells = remainingCells - mines
            const chance = safeCells > 0 ? (100 * safeCells) / remainingCells : 0
            const isActive = realIndex === currentLevel

            return (
              <tr
                key={realIndex}
                className={isActive ? 'payout-row active' : 'payout-row'}
                style={{
                  background: isActive ? '#222' : 'none',
                  borderLeft: isActive ? '4px solid #ff69b4' : undefined,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#fff' : undefined,
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                <td style={{ textAlign: 'center', padding: '8px 6px' }}>Lv {realIndex + 1}</td>
                <td style={{ textAlign: 'center', padding: '8px 6px' }}>{chance.toFixed(2)}%</td>
                <td
                  style={{
                    textAlign: 'center',
                    padding: '8px 6px',
                    color: multiplier === 0 ? '#f00' : '#ffe066',
                    fontWeight: 700,
                  }}
                >
                  {multiplier ? multiplier.toFixed(2) + 'x' : '-'}
                </td>
                <td style={{ textAlign: 'center', padding: '8px 6px', color: '#6cf' }}>
                  {level.cumProfit ? <TokenValue amount={level.cumProfit} /> : '-'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div style={{ marginTop: 8, color: '#aaa', fontSize: 12, textAlign: 'center' }}>
        Each level shows the multiplier, chance, and cumulative profit for a safe pick.
        <br />
        Pick carefully to climb higher!
      </div>
      <style>{`
        .payout-table th, .payout-table td { border-bottom: 1px solid #222; }
        .payout-row.active { background: #222 !important; border-left: 1px solid #ff69b4 !important; font-weight: bold !important; color: #fff !important; }
        .payout-row { transition: background 0.2s, color 0.2s; }
      `}</style>
    </div>
  )
}

function Mines() {
  const { setGambaResult } = useContext(GambaResultContext)
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
      return Number(BigInt(remainingCells * BPS_PER_WHOLE) / BigInt(remainingCells - mines)) / BPS_PER_WHOLE
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
    sounds.play('finish')
    reset()
  }

  const play = async (cellIndex: number) => {
    if (!canPlay) return
    setLoading(true)
    setSelected(cellIndex)
    try {
      sounds.sounds.step.player.loop = true
      sounds.play('step')
      sounds.sounds.tick.player.loop = true
      sounds.play('tick')

      await game.play({ bet, wager, metadata: [currentLevel] })

      const result = await game.result()
      setGambaResult(result)

      sounds.sounds.tick.player.stop()

      // Lose condition
      if (result.payout === 0) {
        setStarted(false)
        setGrid(revealAllMines(grid, cellIndex, mines))
        sounds.play('explode')
        return
      }

      // Win condition, proceed
      const nextLevel = currentLevel + 1
      setLevel(nextLevel)
      setGrid(revealGold(grid, cellIndex, result.profit))
      setTotalGain(result.payout)

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
    <GambaUi.Portal target="screen">
      <GameScreenLayout
        display="flex"
        left={
          <div ref={scalerRef} style={gridContainerStyles}>
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
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: 28,
                              height: 28,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: showBomb ? 1 : 0,
                              transition: 'opacity 0.85s',
                            }}
                          >
                            <span style={{ fontSize: 28, color: '#ff5252' }}>💣</span>
                          </span>
                          <span
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: 28,
                              height: 28,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: showBomb ? 0 : 1,
                              transition: 'opacity 0.85s',
                            }}
                          >
                            {tokenMeta?.image ? (
                              <img
                                src={tokenMeta.image}
                                alt={tokenMeta.symbol}
                                style={{ width: 28, height: 28, borderRadius: '50%' }}
                              />
                            ) : (
                              '🪙'
                            )}
                          </span>
                        </span>
                      )}
                      {/* Gold: Show profit */}
                      {cell.status === 'gold' && (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {tokenMeta?.image ? (
                            <img
                              src={tokenMeta.image}
                              alt={tokenMeta.symbol}
                              style={{ width: 28, height: 28, borderRadius: '50%' }}
                            />
                          ) : (
                            '🪙'
                          )}
                        </span>
                      )}
                      {/* Mine: Show bomb */}
                      {cell.status === 'mine' && (
                        <span style={{ fontSize: 28, color: '#ff5252' }}>💣</span>
                      )}
                    </CellButton>
                  ))}
                </Grid>
              </Container>
            </GambaUi.Responsive>
          </div>
        }
        right={
          <div style={{ width: '100%' }}>
            <PayTable mines={mines} levels={levels} gridSize={GRID_SIZE} currentLevel={currentLevel} />
          </div>
        }
        controls={
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
        }
      />
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
    </GambaUi.Portal>
  )
}

export default Mines
