import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { GRID_SIZE, MINE_SELECT, PITCH_INCREASE_FACTOR, SOUND_EXPLODE, SOUND_FINISH, SOUND_STEP, SOUND_TICK, SOUND_WIN } from './constants'
import { CellButton, Container, Container2, Grid, Level, Levels, StatusBar } from './styles'
import { GameControlsSection, MobileControls, DesktopControls, EnhancedWagerInput, EnhancedButton, GameRecentPlaysHorizontal } from '../../components'
import { generateGrid, revealAllMines, revealGold, getProgressiveMultiplier, getProgressiveWager } from './utils'
import { useGameMeta } from '../useGameMeta'
import { useGameStats } from '../../hooks/game/useGameStats'

function Mines2D() {
  const game = GambaUi.useGame()
  const meta = useGameMeta('mines')
  const gameStats = useGameStats('mines')
  const sounds = useSound({
    tick: SOUND_TICK,
    win: SOUND_WIN,
    finish: SOUND_FINISH,
    step: SOUND_STEP,
    explode: SOUND_EXPLODE,
  })
  const pool = useCurrentPool()

  const [grid, setGrid] = React.useState(generateGrid(GRID_SIZE))
  const [currentLevel, setLevel] = React.useState(0)
  const [selected, setSelected] = React.useState(-1)
  const [totalGain, setTotalGain] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [started, setStarted] = React.useState(false)

  const [initialWager, setInitialWager] = useWagerInput()
  const [mines, setMines] = React.useState(MINE_SELECT[2])

  const getMultiplierForLevel = (level: number) => {
    const remainingCells = GRID_SIZE - level
    return getProgressiveMultiplier(level, remainingCells, mines)
  }

  const levels = React.useMemo(
    () => {
      const totalLevels = GRID_SIZE - mines
      let cumProfit = 0
      let previousBalance = initialWager

      return Array.from({ length: totalLevels }).map((_, level) => {
        const wager = level === 0 ? initialWager : getProgressiveWager(level, initialWager, previousBalance, pool.maxPayout)
        const multiplier = getMultiplierForLevel(level)
        const remainingCells = GRID_SIZE - level
        const bet = Array.from({ length: remainingCells }, (_, i) => i < mines ? 0 : multiplier)

        const profit = wager * (multiplier - 1)
        cumProfit += profit
        const balance = wager + profit

        previousBalance = balance
        return { bet, wager, profit, cumProfit, balance }
      }).filter(x => Math.max(...x.bet) * x.wager < pool.maxPayout)
    },
    [initialWager, mines, pool.maxPayout],
  )

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

  const endGame = async () => {
    sounds.play('finish')
    reset()
  }

  const reset = () => {
    setGrid(generateGrid(GRID_SIZE))
    setLoading(false)
    setLevel(0)
    setTotalGain(0)
    setStarted(false)
  }

  const play = async (cellIndex: number) => {
    setLoading(true)
    setSelected(cellIndex)
    try {
      sounds.sounds.step.player.loop = true
      sounds.play('step', {  })
      sounds.sounds.tick.player.loop = true
      sounds.play('tick', {  })
      await game.play({
        bet,
        wager,
        metadata: [currentLevel],
      })

      const result = await game.result()

      sounds.sounds.tick.player.stop()

      // Lose
      if (result.payout === 0) {
        setStarted(false)
        setGrid(revealAllMines(grid, cellIndex, mines))
        sounds.play('explode')
        return
      }

      const nextLevel = currentLevel + 1
      setLevel(nextLevel)
      setGrid(revealGold(grid, cellIndex, result.profit))
      setTotalGain(result.payout)

      if (nextLevel < GRID_SIZE - mines) {
        sounds.play('win', { playbackRate: Math.pow(PITCH_INCREASE_FACTOR, currentLevel) })
      } else {
        // No more squares
        sounds.play('win', { playbackRate: .9 })
        sounds.play('finish')
      }
    } finally {
      setLoading(false)
      setSelected(-1)
      sounds.sounds.tick.player.stop()
      sounds.sounds.step.player.stop()
    }
  }

  return (
    <>
      <GambaUi.Portal target="recentplays">
        <GameRecentPlaysHorizontal gameId="mines" />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '120px', // leave room for controls
            borderRadius: '10px',
            overflow: 'hidden',
            border: '2px solid rgba(147, 88, 255, 0.4)',
            background: 'linear-gradient(135deg, #0a0511 0%, #0d0618 25%, #0f081c 50%, #0a0511 75%, #0a0511 100%)',
            perspective: '100px'
          }}>
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
                      {(cell.status === 'gold') && (
                        <div>
                          +<TokenValue amount={cell.profit} />
                        </div>
                      )}
                    </CellButton>
                  ))}
                </Grid>
              </Container>
            </GambaUi.Responsive>
          </div>

          {/* Styled info panels like mines */}
          <GameControlsSection>
            <div style={{ flex: '1', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#9358ff', marginBottom: 4 }}>LEVELS</div>
              <div style={{ fontSize: '16px', color: 'rgba(147,88,255,0.9)', fontWeight: 600 }}>{started ? `${currentLevel + 1}/${levels.length}` : `1/${levels.length}`}</div>
            </div>

            <div style={{ flex: '1', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#4caf50', marginBottom: 4 }}>BASE x</div>
                <div style={{ fontSize: '16px', color: 'rgba(76,175,80,0.9)', fontWeight: 600 }}>{started ? `${getMultiplierForLevel(currentLevel).toFixed(2)}x` : `${getMultiplierForLevel(0).toFixed(2) || '1.00'}x`}</div>
            </div>

            <div style={{ flex: '1', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffeb3b', marginBottom: 4 }}>NEXT x</div>
              <div style={{ fontSize: '16px', color: 'rgba(255,235,59,0.9)', fontWeight: 600 }}>{started ? `${getMultiplierForLevel(currentLevel + 1).toFixed(2)}x` : (levels[1] ? `${getMultiplierForLevel(1).toFixed(2)}x` : 'Start')}</div>
            </div>

            <div style={{ flex: '1', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#4caf50', marginBottom: 4 }}>TOTAL WON</div>
              <div style={{ fontSize: '16px', color: 'rgba(76,175,80,0.9)', fontWeight: 600 }}>
                <TokenValue amount={totalGain} />
              </div>
            </div>

            <div style={{ flex: '1', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff9800', marginBottom: 4 }}>NEXT WAGER</div>
              <div style={{ fontSize: '16px', color: 'rgba(255,152,0,0.9)', fontWeight: 600 }}>
                <TokenValue amount={started ? (levels[currentLevel + 1]?.wager || 0) : initialWager} />
              </div>
            </div>
          </GameControlsSection>

          {/* gameplay effects frame not required for this 2D port */}
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        {!started ? (
          <>
            <MobileControls
              wager={initialWager}
              setWager={setInitialWager}
              onPlay={start}
              playDisabled={pool.maxPayout === 0}
              playText="Start"
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <label style={{ color: '#fff', minWidth: 60 }}>Mines:</label>
                <GambaUi.Select
                  options={MINE_SELECT}
                  value={mines}
                  onChange={setMines}
                  label={(m: number) => <>{m} Mines</>}
                />
              </div>
            </MobileControls>

            <DesktopControls
              onPlay={start}
              playDisabled={pool.maxPayout === 0}
              playText="Start"
            >
              <EnhancedWagerInput value={initialWager} onChange={setInitialWager} />
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <label style={{ color: '#fff', minWidth: 60 }}>Mines:</label>
                <select
                  value={mines}
                  onChange={(e) => setMines(Number(e.target.value))}
                  style={{ padding: 8, borderRadius: 4, border: '1px solid rgba(147, 88, 255, 0.3)', background: '#1a1a2e', color: '#fff' }}
                >
                  {MINE_SELECT.map(count => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </div>
            </DesktopControls>
          </>
        ) : (
          <>
            <MobileControls
              wager={initialWager}
              setWager={setInitialWager}
              onPlay={endGame}
              playDisabled={loading || totalGain === 0}
              playText={totalGain > 0 ? 'Cash' : 'New'}
            >
              {started && totalGain > 0 && (
                <div style={{ marginTop: 10 }}>
                  <EnhancedButton onClick={endGame} disabled={loading || totalGain === 0} variant="primary">
                    💰 Cash Out
                  </EnhancedButton>
                </div>
              )}
            </MobileControls>

            <DesktopControls>
              {started && totalGain > 0 && (
                <EnhancedButton onClick={endGame} disabled={loading || totalGain === 0} variant="primary">
                  💰 Cash Out
                </EnhancedButton>
              )}
            </DesktopControls>
          </>
        )}
      </GambaUi.Portal>
    </>
  )
}

export default Mines2D
