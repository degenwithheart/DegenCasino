import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import { BET_ARRAYS_V2 } from '../rtpConfig-v2'
import { EnhancedWagerInput, EnhancedPlayButton, EnhancedButton, MobileControls, DesktopControls, GameStatsHeader, GameControlsSection } from '../../components'
import { useGameMeta } from '../useGameMeta'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { 
  GRID_SIZE as MINES_GRID_SIZE, MINE_SELECT, PITCH_INCREASE_FACTOR,
  SOUND_FINISH, SOUND_TICK, SOUND_WIN, SOUND_STEP, SOUND_EXPLODE
} from './constants'
import { CellState as MinesCellState, GameStatus, LoadState, GameConfig } from './types'
import { generateGrid, revealGold, revealAllMines } from './utils'

// Game constants
const GRID_COLS = 5
const GRID_ROWS = 5

type GamePhase = 'waiting' | 'playing' | 'won' | 'lost'

export default function MinesV2() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const sounds = useSound({
    reveal: SOUND_TICK,
    mine: SOUND_EXPLODE,
    win: SOUND_WIN,
    step: SOUND_STEP,
    finish: SOUND_FINISH,
  })
  const { mobile: isMobile } = useIsCompact()

  // V2 Stats tracking (standardized pattern)
  const [stats, setStats] = React.useState({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    sessionProfit: 0,
  })

  // Game state
  const [wager, setWager] = useWagerInput()
  const [mineCount, setMineCount] = React.useState(3)
  const [cells, setCells] = React.useState<MinesCellState[]>(generateGrid(MINES_GRID_SIZE))
  const [gamePhase, setGamePhase] = React.useState<GamePhase>('waiting')
  const [currentLevel, setCurrentLevel] = React.useState(0)
  const [totalGain, setTotalGain] = React.useState(0)
  const [started, setStarted] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  // Effects ref
  const effectsRef = React.useRef<GameplayEffectsRef>(null)

  // Graphics settings
  const { settings } = useGraphics()
  const enableMotion = settings.enableMotion

  // Reset stats
  const resetStats = () => {
    setStats({
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      sessionProfit: 0,
    })
  }

  // Progressive betting levels calculation (like original Mines)
  const levels = React.useMemo(() => {
    const totalLevels = MINES_GRID_SIZE - mineCount
    let previousBalance = wager

    return Array.from({ length: totalLevels }).map((_, level) => {
      // For the first level, use initial wager. For subsequent levels, use previous balance.
      const levelWager = level === 0 ? wager : previousBalance
      const config = BET_ARRAYS_V2['mines-v2']
      const multiplier = config.getMultiplier(mineCount, level + 1)
      const betArray = config.calculateBetArray(mineCount, level)

      const profit = levelWager * (multiplier - 1)
      const balance = levelWager + profit

      previousBalance = balance
      return { bet: betArray, wager: levelWager, profit, balance, multiplier }
    })
  }, [wager, mineCount])

  // Pool restrictions
  const maxMultiplier = React.useMemo(() => {
    const config = BET_ARRAYS_V2['mines-v2']
    // Calculate max possible multiplier for current mine count (full grid revealed)
    return config.getMultiplier(mineCount, MINES_GRID_SIZE - mineCount)
  }, [mineCount])

  const maxWagerForPool = React.useMemo(() => {
    return pool.maxPayout / maxMultiplier
  }, [pool.maxPayout, maxMultiplier])

  // Clamp wager to not exceed pool limits
  React.useEffect(() => {
    if (wager > maxWagerForPool) {
      setWager(maxWagerForPool)
    }
  }, [wager, maxWagerForPool, setWager])

  const poolExceeded = React.useMemo(() => {
    const maxCurrentLevelMultiplier = levels.length > 0 ? Math.max(...levels.map(l => l.multiplier)) : 1
    return wager * maxCurrentLevelMultiplier > pool.maxPayout
  }, [wager, levels, pool.maxPayout])

  // Game state calculations
  const remainingCells = MINES_GRID_SIZE - currentLevel
  const gameFinished = remainingCells <= mineCount
  const canPlay = started && !loading && !gameFinished
  const currentLevelData = levels[currentLevel]

  // Get current multiplier for display
  const getCurrentMultiplier = () => {
    return currentLevelData?.multiplier || 1
  }

  // Get next multiplier for display
  const getNextMultiplier = () => {
    const nextLevel = levels[currentLevel + 1]
    return nextLevel?.multiplier || 1
  }

  // Start new game
  const startGame = async () => {
    setCells(generateGrid(MINES_GRID_SIZE))
    setGamePhase('playing')
    setCurrentLevel(0)
    setTotalGain(0)
    setStarted(true)
    setLoading(false)
    
    sounds.play('step')
  }

  // Cash out / End game
  const endGame = async () => {
    sounds.play('finish')
    reset()
  }

  // Reset game
  const reset = () => {
    setCells(generateGrid(MINES_GRID_SIZE))
    setGamePhase('waiting')
    setCurrentLevel(0)
    setTotalGain(0)
    setStarted(false)
    setLoading(false)
  }

  // Reveal cell with Gamba integration and progressive betting
  const revealCell = async (cellIndex: number) => {
    if (!canPlay) return
    if (cells[cellIndex].status !== 'hidden') return
    if (gamba.isPlaying) return

    setLoading(true)
    
    try {
      sounds.play('step')
      
      // Use progressive betting from levels
      const { bet, wager: levelWager } = currentLevelData

      await game.play({
        bet,
        wager: levelWager,
        metadata: [mineCount, currentLevel, cellIndex],
      })

      const result = await game.result()

      // Check if player hit a mine (multiplier 0 = mine hit)
      if (result.multiplier === 0) {
        // Hit a mine - game over
        setStarted(false)
        setGamePhase('lost')
        
        const newCells = revealAllMines(cells, cellIndex, mineCount)
        setCells(newCells)
        sounds.play('mine')

        // Update stats for loss
        setStats(prev => ({
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          losses: prev.losses + 1,
          sessionProfit: prev.sessionProfit - wager,
        }))

        if (effectsRef.current) {
          effectsRef.current.loseFlash('#ff4444', 2)
        }
      } else {
        // Safe cell - reveal gold and advance level
        const nextLevel = currentLevel + 1
        setCurrentLevel(nextLevel)
        
        const newCells = revealGold(cells, cellIndex, result.profit)
        setCells(newCells)
        setTotalGain(result.payout)
        sounds.play('reveal')

        // Check if game is complete (all safe cells revealed)
        if (nextLevel >= levels.length) {
          // Game won - all safe cells revealed
          sounds.play('win')
          setGamePhase('won')

          // Update stats for win
          const profit = result.payout - wager
          setStats(prev => ({
            ...prev,
            gamesPlayed: prev.gamesPlayed + 1,
            wins: prev.wins + 1,
            sessionProfit: prev.sessionProfit + profit,
          }))

          if (effectsRef.current) {
            effectsRef.current.winFlash('#4caf50', 3)
          }
        }
      }
    } catch (error) {
      console.error('Cell reveal failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Canvas render function for GambaUi.Canvas
  const renderCanvas = React.useCallback(({ ctx, size }: any) => {
    // Clear canvas
    ctx.clearRect(0, 0, size.width, size.height)
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, size.width, size.height)

    // Draw game area
    drawGameArea(ctx, size)
  }, [gamePhase, mineCount, wager, cells, currentLevel, started, levels, getCurrentMultiplier, getNextMultiplier, totalGain])

  // Draw game area
  const drawGameArea = (ctx: CanvasRenderingContext2D, size?: { width: number; height: number }) => {
    const canvasWidth = size?.width || ctx.canvas.width
    const canvasHeight = size?.height || ctx.canvas.height
    
    const padding = 20
    const gameAreaWidth = canvasWidth - padding * 2
    const gameAreaHeight = canvasHeight - padding * 2
    const gridSize = Math.min(gameAreaWidth, gameAreaHeight)
    const cellSize = gridSize / GRID_COLS
    const gridStartX = (canvasWidth - gridSize) / 2
    const gridStartY = (canvasHeight - gridSize) / 2

    // Draw grid background
    ctx.fillStyle = 'rgba(26, 26, 46, 0.8)'
    ctx.fillRect(gridStartX - 10, gridStartY - 10, gridSize + 20, gridSize + 20)

    // Draw cells
    for (let i = 0; i < MINES_GRID_SIZE; i++) {
      const row = Math.floor(i / GRID_COLS)
      const col = i % GRID_COLS
      const x = gridStartX + col * cellSize
      const y = gridStartY + row * cellSize

      drawCell(ctx, x, y, cellSize, cells[i], i)
    }
  }

  // Draw individual cell
  const drawCell = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, cell: MinesCellState, index: number) => {
    const padding = 2
    const cellX = x + padding
    const cellY = y + padding
    const cellSize = size - padding * 2

    // Cell background
    switch (cell.status) {
      case 'hidden':
        ctx.fillStyle = '#333366'
        break
      case 'gold':
        ctx.fillStyle = '#4caf50'
        break
      case 'mine':
        ctx.fillStyle = '#f44336'
        break
    }

    ctx.fillRect(cellX, cellY, cellSize, cellSize)

    // Cell border
    ctx.strokeStyle = 'rgba(147, 88, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.strokeRect(cellX, cellY, cellSize, cellSize)

    // Cell content
    if (cell.status === 'mine') {
      // Draw mine
      ctx.fillStyle = '#ffffff'
      ctx.font = `${cellSize * 0.6}px monospace`
      ctx.textAlign = 'center'
      ctx.fillText('💣', cellX + cellSize / 2, cellY + cellSize * 0.7)
    } else if (cell.status === 'gold') {
      // Draw gem
      ctx.fillStyle = '#ffffff'
      ctx.font = `${cellSize * 0.6}px monospace`
      ctx.textAlign = 'center'
      ctx.fillText('💎', cellX + cellSize / 2, cellY + cellSize * 0.7)
    }
  }

  // Handle canvas clicks for GambaUi.Canvas
  const handleCanvasClick = React.useCallback((event: React.MouseEvent) => {
    const canvas = event.currentTarget as HTMLCanvasElement
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Scale coordinates to canvas size
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const canvasX = x * scaleX
    const canvasY = y * scaleY

    // Check if clicking on grid during play
    if (started && gamePhase === 'playing') {
      const padding = 20
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height
      const gameAreaWidth = canvasWidth - padding * 2
      const gameAreaHeight = canvasHeight - padding * 2
      const gridSize = Math.min(gameAreaWidth, gameAreaHeight - 100)
      const cellSize = gridSize / GRID_COLS
      const gridStartX = (canvasWidth - gridSize) / 2
      const gridStartY = (canvasHeight - gridSize) / 2

      if (canvasX >= gridStartX && canvasX < gridStartX + gridSize &&
          canvasY >= gridStartY && canvasY < gridStartY + gridSize) {
        
        const col = Math.floor((canvasX - gridStartX) / cellSize)
        const row = Math.floor((canvasY - gridStartY) / cellSize)
        const cellIndex = row * GRID_COLS + col

        if (col >= 0 && col < GRID_COLS && row >= 0 && row < GRID_ROWS) {
          revealCell(cellIndex)
        }
      }
    }
  }, [started, gamePhase, revealCell])

  const gameMeta = useGameMeta('mines-v2')

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'linear-gradient(135deg, #0a0511 0%, #0d0618 25%, #0f081c 50%, #0a0511 75%, #0a0511 100%)',
          perspective: '100px'
        }}>
          <GameStatsHeader
            gameName="Mines v2"
            gameMode="Strategic Mine Field • Variable RTP"
            stats={stats}
            onReset={resetStats}
            theme="purple"
            disabled={gamba.isPlaying}
            isMobile={isMobile}
          />

          {/* Canvas for game UI */}
          <div style={{
            position: 'absolute',
            top: '140px',
            left: '20px',
            right: '20px',
            bottom: '120px', // Leave space for controls below
            borderRadius: '10px',
            overflow: 'hidden',
            border: '2px solid rgba(147, 88, 255, 0.4)'
          }}>
            <GambaUi.Canvas
              style={{
                width: '100%',
                height: '100%',
                cursor: started && gamePhase === 'playing' && !loading ? 'pointer' : 'default'
              }}
              render={renderCanvas}
              onMouseDown={handleCanvasClick}
            />
          </div>

          {/* Level Progress Display */}
          <GameControlsSection>
            {/* LEVEL */}
            <div style={{
              flex: '1',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(147, 88, 255, 0.15) 0%, rgba(106, 27, 154, 0.25) 50%, rgba(147, 88, 255, 0.15) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(147, 88, 255, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(147, 88, 255, 0.2), inset 0 1px 0 rgba(147, 88, 255, 0.3)',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#9358ff',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                marginBottom: '4px'
              }}>
                LEVELS
              </div>
              <div style={{
                fontSize: '16px',
                color: 'rgba(147, 88, 255, 0.9)',
                fontWeight: '600'
              }}>
                {started ? `${currentLevel + 1}/${levels.length}` : `1/${levels.length}`}
              </div>
            </div>

            {/* CURRENT */}
            <div style={{
              flex: '1',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(46, 125, 50, 0.25) 50%, rgba(76, 175, 80, 0.15) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(76, 175, 80, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(76, 175, 80, 0.2), inset 0 1px 0 rgba(76, 175, 80, 0.3)',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#4caf50',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                marginBottom: '4px'
              }}>
                BASE MULTIPLIER
              </div>
              <div style={{
                fontSize: '16px',
                color: 'rgba(76, 175, 80, 0.9)',
                fontWeight: '600'
              }}>
                {started ? `${getCurrentMultiplier().toFixed(2)}x` : `${levels[0]?.multiplier.toFixed(2) || '1.00'}x`}
              </div>
            </div>

            {/* NEXT */}
            <div style={{
              flex: '1',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255, 235, 59, 0.15) 0%, rgba(251, 192, 45, 0.25) 50%, rgba(255, 235, 59, 0.15) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(255, 235, 59, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(255, 235, 59, 0.2), inset 0 1px 0 rgba(255, 235, 59, 0.3)',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#ffeb3b',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                marginBottom: '4px'
              }}>
                NEXT MULTIPLIER
              </div>
              <div style={{
                fontSize: '16px',
                color: 'rgba(255, 235, 59, 0.9)',
                fontWeight: '600'
              }}>
                {started ? `${getNextMultiplier().toFixed(2)}x` : (levels[1] ? `${levels[1].multiplier.toFixed(2)}x` : 'Start')}
              </div>
            </div>

            {/* TOTAL */}
            <div style={{
              flex: '1',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(46, 125, 50, 0.25) 50%, rgba(76, 175, 80, 0.15) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(76, 175, 80, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(76, 175, 80, 0.2), inset 0 1px 0 rgba(76, 175, 80, 0.3)',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#4caf50',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                marginBottom: '4px'
              }}>
                TOTAL WON
              </div>
              <div style={{
                fontSize: '16px',
                color: 'rgba(76, 175, 80, 0.9)',
                fontWeight: '600'
              }}>
                {started ? totalGain.toFixed(4) : '0.0000'}
              </div>
            </div>
          </GameControlsSection>

          <GameplayFrame
            ref={effectsRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 1000
            }}
          />
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        {!started ? (
          <>
            <MobileControls
              wager={wager}
              setWager={setWager}
              onPlay={startGame}
              playDisabled={poolExceeded}
              playText="Start"
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ color: '#fff', minWidth: '60px' }}>Mines:</label>
                <select
                  value={mineCount}
                  onChange={(e) => setMineCount(Number(e.target.value))}
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(147, 88, 255, 0.3)',
                    background: '#1a1a2e',
                    color: '#fff',
                    flex: 1
                  }}
                >
                  {MINE_SELECT.map(count => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </div>
            </MobileControls>

            <DesktopControls
              wager={wager}
              setWager={setWager}
              onPlay={startGame}
              playDisabled={poolExceeded}
              playText="Start"
            >
              <EnhancedWagerInput 
                value={wager} 
                onChange={setWager} 
                multiplier={maxMultiplier}
              />
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ color: '#fff', minWidth: '60px' }}>Mines:</label>
                <select
                  value={mineCount}
                  onChange={(e) => setMineCount(Number(e.target.value))}
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(147, 88, 255, 0.3)',
                    background: '#1a1a2e',
                    color: '#fff'
                  }}
                >
                  {MINE_SELECT.map(count => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </div>
              <EnhancedPlayButton onClick={startGame} wager={wager} disabled={poolExceeded}>
                Start
              </EnhancedPlayButton>
            </DesktopControls>
          </>
        ) : (
          <>
            <MobileControls
              wager={wager}
              setWager={setWager}
              onPlay={endGame}
              playDisabled={loading || totalGain === 0}
              playText={totalGain > 0 ? 'Cash' : 'New'}
            >
              {started && totalGain > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <EnhancedButton 
                    onClick={endGame} 
                    disabled={loading || totalGain === 0} 
                    variant="primary"
                  >
                    💰 Cash Out
                  </EnhancedButton>
                </div>
              )}
            </MobileControls>
            
            <DesktopControls
              wager={wager}
              setWager={setWager}
              onPlay={endGame}
              playDisabled={loading || totalGain === 0}
              playText={totalGain > 0 ? 'Cash' : 'New'}
            >
              {started && totalGain > 0 && (
                <EnhancedButton 
                  onClick={endGame} 
                  disabled={loading || totalGain === 0} 
                  variant="primary"
                >
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
