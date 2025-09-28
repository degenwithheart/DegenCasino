import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { GambaUi, useCurrentPool, useSound, useWagerInput, TokenValue } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import styled from 'styled-components'
import { useToast } from '../../hooks/ui/useToast'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameSEO } from '../../hooks/ui/useGameSEO'

import { GAME_CONFIG, PAYTABLE, GAME_STATES, type GameState } from './constants'
import { KENO_SOUNDS } from './sounds'
import { BET_ARRAYS_V2 } from '../rtpConfig-v2'
import { BPS_PER_WHOLE } from 'gamba-core-v2'

// Enhanced Components imports
import { EnhancedWagerInput, EnhancedButton, MobileControls, DesktopControls, GameControlsSection, GameRecentPlaysHorizontal } from '../../components'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

// Styled Components
const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${GAME_CONFIG.COLORS.background};
  position: relative;
  overflow: hidden;
`

const CanvasContainer = styled.div`
  position: relative;
  background: linear-gradient(135deg, ${GAME_CONFIG.COLORS.background} 0%, rgba(212, 165, 116, 0.05) 100%);
  border-radius: 20px;
  border: 2px solid rgba(212, 165, 116, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`

const Canvas = styled.canvas`
  display: block;
  border-radius: 18px;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 0 30px rgba(212, 165, 116, 0.3);
  }
`

const GameInfo = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: ${GAME_CONFIG.COLORS.text};
  
  h3 {
    margin: 0 0 10px 0;
    color: ${GAME_CONFIG.COLORS.textSecondary};
    font-size: 24px;
  }
  
  p {
    margin: 5px 0;
    font-size: 16px;
  }
`

const PaytableDisplay = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  color: ${GAME_CONFIG.COLORS.text};
  font-size: 14px;
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(212, 165, 116, 0.3);
  max-width: 200px;
  
  h4 {
    margin: 0 0 10px 0;
    color: ${GAME_CONFIG.COLORS.textSecondary};
    text-align: center;
  }
  
  .payout-row {
    display: flex;
    justify-content: space-between;
    margin: 3px 0;
    padding: 2px 5px;
    border-radius: 3px;
    
    &.highlighted {
      background: rgba(212, 165, 116, 0.2);
      color: ${GAME_CONFIG.COLORS.textSecondary};
    }
  }
`

interface KenoGameProps {}

interface Cell {
  number: number
  x: number
  y: number
  selected: boolean
  drawn: boolean
  revealed: boolean
  isWinning: boolean
}

export default function KenoGame({}: KenoGameProps) {
  // SEO for Keno game
  const seoHelmet = useGameSEO({
    gameName: "Keno",
    description: "Pick your lucky numbers and watch the draw! Classic lottery-style game with up to 10 number selections",
    rtp: 95,
    maxWin: "1000x"
  })

  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [wager, setWager] = useWagerInput()
  const { settings } = useGraphics()
  const effectsRef = React.useRef<GameplayEffectsRef>(null)
  const { mobile: isMobile } = useIsCompact()
  
  // Game state
  const [gameState, setGameState] = useState<GameState>(GAME_STATES.IDLE)
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([])
  const [revealedNumbers, setRevealedNumbers] = useState<Set<number>>(new Set())
  const [gameWon, setGameWon] = useState<boolean | null>(null)
  const [hitCount, setHitCount] = useState<number>(0)
  const [lastWin, setLastWin] = useState<number>(0)
  
  // Stats tracking
  const [totalProfit, setTotalProfit] = useState(0)
  const [gameCount, setGameCount] = useState(0)
  const [winCount, setWinCount] = useState(0)
  const [lossCount, setLossCount] = useState(0)
  const [lastPayout, setLastPayout] = useState(0)
  
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  
  // Effects and particles
  const [particles, setParticles] = useState<Particle[]>([])
  const addToast = useToast()

  // Create grid cells
  const cells = useMemo<Cell[]>(() => {
    const cellsArray: Cell[] = []
    for (let i = 1; i <= GAME_CONFIG.GRID_SIZE; i++) {
      const row = Math.floor((i - 1) / GAME_CONFIG.GRID_COLS)
      const col = (i - 1) % GAME_CONFIG.GRID_COLS
      
      cellsArray.push({
        number: i,
        x: GAME_CONFIG.GRID_START_X + col * (GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_GAP),
        y: GAME_CONFIG.GRID_START_Y + row * (GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_GAP),
        selected: selectedNumbers.includes(i),
        drawn: drawnNumbers.includes(i),
        revealed: revealedNumbers.has(i),
        isWinning: selectedNumbers.includes(i) && drawnNumbers.includes(i)
      })
    }
    return cellsArray
  }, [selectedNumbers, drawnNumbers, revealedNumbers])

  // Canvas click handler
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== GAME_STATES.IDLE) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    // Check if click is on a cell
    for (const cell of cells) {
      if (x >= cell.x && x <= cell.x + GAME_CONFIG.CELL_SIZE &&
          y >= cell.y && y <= cell.y + GAME_CONFIG.CELL_SIZE) {
        
        if (selectedNumbers.includes(cell.number)) {
          // Deselect number
          setSelectedNumbers(prev => prev.filter(n => n !== cell.number))
          KENO_SOUNDS.click()
        } else if (selectedNumbers.length < GAME_CONFIG.MAX_SELECTION) {
          // Select number
          setSelectedNumbers(prev => [...prev, cell.number])
          KENO_SOUNDS.click()
          
          // Add selection particle effect
          addParticles(cell.x + GAME_CONFIG.CELL_SIZE / 2, cell.y + GAME_CONFIG.CELL_SIZE / 2, GAME_CONFIG.COLORS.cellSelected)
        }
        break
      }
    }
  }, [gameState, cells, selectedNumbers])

  // Add particle effect
  const addParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        color
      })
    }
    setParticles(prev => [...prev, ...newParticles])
  }, [])

  // Update particles
  const updateParticles = useCallback(() => {
    setParticles(prev => prev
      .map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vx: particle.vx * 0.98,
        vy: particle.vy * 0.98,
        life: particle.life - 0.02
      }))
      .filter(particle => particle.life > 0)
    )
  }, [])

  // Canvas rendering
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.fillStyle = GAME_CONFIG.COLORS.background
    ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT)
    
    // Draw grid background
    ctx.fillStyle = GAME_CONFIG.COLORS.gridBackground
    ctx.fillRect(
      GAME_CONFIG.GRID_START_X - 20,
      GAME_CONFIG.GRID_START_Y - 20,
      (GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_GAP) * GAME_CONFIG.GRID_COLS - GAME_CONFIG.CELL_GAP + 40,
      (GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_GAP) * GAME_CONFIG.GRID_ROWS - GAME_CONFIG.CELL_GAP + 40
    )
    
    // Draw cells
    cells.forEach(cell => {
      let cellColor = GAME_CONFIG.COLORS.cellDefault
      let borderColor = 'transparent'
      let glowEffect = false
      
      if (cell.revealed) {
        if (cell.isWinning) {
          cellColor = GAME_CONFIG.COLORS.cellWinning
          glowEffect = true
        } else if (cell.drawn) {
          cellColor = GAME_CONFIG.COLORS.cellDrawn
        }
      } else if (cell.selected) {
        cellColor = GAME_CONFIG.COLORS.cellSelected
        borderColor = GAME_CONFIG.COLORS.textSecondary
      }
      
      // Draw glow effect for winning cells
      if (glowEffect) {
        ctx.shadowColor = GAME_CONFIG.COLORS.cellWinning
        ctx.shadowBlur = 20
      } else {
        ctx.shadowBlur = 0
      }
      
      // Draw cell background
      ctx.fillStyle = cellColor
      ctx.fillRect(cell.x, cell.y, GAME_CONFIG.CELL_SIZE, GAME_CONFIG.CELL_SIZE)
      
      // Draw border
      if (borderColor !== 'transparent') {
        ctx.strokeStyle = borderColor
        ctx.lineWidth = 2
        ctx.strokeRect(cell.x, cell.y, GAME_CONFIG.CELL_SIZE, GAME_CONFIG.CELL_SIZE)
      }
      
      // Draw number
      ctx.shadowBlur = 0
      ctx.fillStyle = GAME_CONFIG.COLORS.text
      ctx.font = 'bold 18px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(
        cell.number.toString(),
        cell.x + GAME_CONFIG.CELL_SIZE / 2,
        cell.y + GAME_CONFIG.CELL_SIZE / 2
      )
    })
    
    // Draw particles
    particles.forEach(particle => {
      ctx.globalAlpha = particle.life
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1
    
  }, [cells, particles])

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updateParticles()
      render()
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [updateParticles, render])

  // Generate bet array for Gamba
  const generateBetArray = useCallback((selectionCount: number) => {
    return BET_ARRAYS_V2['keno-v2'].calculateBetArray(selectionCount)
  }, [])

  // Simulate drawn numbers based on game result
  const simulateDrawnNumbers = useCallback((won: boolean, selectedNums: number[]): number[] => {
    const allNumbers = Array.from({ length: GAME_CONFIG.GRID_SIZE }, (_, i) => i + 1)
    const unselectedNumbers = allNumbers.filter(n => !selectedNums.includes(n))
    
    if (won && selectedNums.length > 0) {
      // Ensure at least one hit for a win
      const guaranteedHits = Math.min(Math.ceil(selectedNums.length * 0.7), selectedNums.length)
      const hits = selectedNums.slice(0, guaranteedHits)
      
      // Fill remaining slots with unselected numbers
      const remainingSlots = GAME_CONFIG.DRAW_COUNT - hits.length
      const shuffledUnselected = [...unselectedNumbers].sort(() => Math.random() - 0.5)
      const additionalNumbers = shuffledUnselected.slice(0, remainingSlots)
      
      return [...hits, ...additionalNumbers].sort(() => Math.random() - 0.5)
    } else {
      // For losses, minimize hits
      const maxHits = Math.max(0, Math.floor(selectedNums.length * 0.3))
      const hits = selectedNums.slice(0, maxHits)
      
      const remainingSlots = GAME_CONFIG.DRAW_COUNT - hits.length
      const shuffledUnselected = [...unselectedNumbers].sort(() => Math.random() - 0.5)
      const additionalNumbers = shuffledUnselected.slice(0, remainingSlots)
      
      return [...hits, ...additionalNumbers].sort(() => Math.random() - 0.5)
    }
  }, [])

  // Reveal drawn numbers with animation
  const revealDrawnNumbers = useCallback(async (drawnNums: number[], won: boolean) => {
    setGameState(GAME_STATES.REVEALING)
    
    for (let i = 0; i < drawnNums.length; i++) {
      await new Promise(resolve => {
        setTimeout(() => {
          setRevealedNumbers(prev => new Set(prev).add(drawnNums[i]))
          
          if (selectedNumbers.includes(drawnNums[i])) {
            KENO_SOUNDS.hit()
            // Add winning particle effect
            const cell = cells.find(c => c.number === drawnNums[i])
            if (cell) {
              addParticles(cell.x + GAME_CONFIG.CELL_SIZE / 2, cell.y + GAME_CONFIG.CELL_SIZE / 2, GAME_CONFIG.COLORS.cellWinning)
            }
          } else {
            KENO_SOUNDS.draw()
          }
          
          resolve(true)
        }, 300)
      })
    }
    
    // Calculate final hit count
    const hits = selectedNumbers.filter(num => drawnNums.includes(num)).length
    setHitCount(hits)
    
    setTimeout(() => {
      if (won) {
        KENO_SOUNDS.bigWin()
      }
      setGameState(GAME_STATES.COMPLETE)
    }, 500)
  }, [selectedNumbers, cells, addParticles])

  // Play game
  const play = useCallback(async () => {
    if (selectedNumbers.length === 0) {
      addToast({ 
        title: 'Selection Required', 
        description: 'Please select at least one number!' 
      })
      return
    }
    
    try {
      setGameState(GAME_STATES.PLAYING)
      setRevealedNumbers(new Set())
      setGameWon(null)
      setHitCount(0)
      
      const betArray = generateBetArray(selectedNumbers.length)
      
      await game.play({ wager: wager, bet: betArray })
      
      const result = await game.result()
      const won = result.payout > 0
      
      setLastWin(result.payout)
      setGameWon(won)
      
      const simulatedDrawnNumbers = simulateDrawnNumbers(won, selectedNumbers)
      setDrawnNumbers(simulatedDrawnNumbers)
      
      await revealDrawnNumbers(simulatedDrawnNumbers, won)
      
    } catch (error: any) {
      addToast({ 
        title: 'Game Error', 
        description: `Game error: ${error.message}` 
      })
      setGameState(GAME_STATES.IDLE)
    }
  }, [selectedNumbers, wager, game, generateBetArray, simulateDrawnNumbers, revealDrawnNumbers, addToast])

  // Clear game
  const clearGame = useCallback(() => {
    setSelectedNumbers([])
    setDrawnNumbers([])
    setRevealedNumbers(new Set())
    setGameWon(null)
    setHitCount(0)
    setLastWin(0)
    setGameState(GAME_STATES.IDLE)
    setParticles([])
  }, [])

  // Get current paytable
  const currentPaytable = useMemo(() => {
    if (selectedNumbers.length === 0) return {}
    return PAYTABLE[selectedNumbers.length as keyof typeof PAYTABLE] || {}
  }, [selectedNumbers.length])

  return (
    <>
      {seoHelmet}
      {/* Recent Plays Portal - positioned above stats */}
      <GambaUi.Portal target="recentplays">
        <GameRecentPlaysHorizontal gameId="keno-v2" />
      </GambaUi.Portal>

      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Keno"
          gameMode="V2"
          rtp="95"
          stats={{
            gamesPlayed: gameCount,
            wins: winCount,
            losses: lossCount
          }}
          onReset={() => {
            setGameCount(0)
            setWinCount(0)
            setLossCount(0)
            setTotalProfit(0)
            setLastPayout(0)
          }}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <GameContainer>
            <CanvasContainer>
              <Canvas
                ref={canvasRef}
                width={GAME_CONFIG.CANVAS_WIDTH}
                height={GAME_CONFIG.CANVAS_HEIGHT}
                onClick={handleCanvasClick}
              />
              
              <GameInfo>
                <h3>Keno v2</h3>
                <p>Selected: {selectedNumbers.length}/{GAME_CONFIG.MAX_SELECTION}</p>
                {gameState === GAME_STATES.COMPLETE && (
                  <>
                    <p>Hits: {hitCount}/{selectedNumbers.length}</p>
                    <p>Result: {gameWon ? `Won ${lastWin.toFixed(2)}` : 'Lost'}</p>
                  </>
                )}
              </GameInfo>
              
              {selectedNumbers.length > 0 && (
                <PaytableDisplay>
                  <h4>Paytable</h4>
                  {Object.entries(currentPaytable).map(([hits, multiplier]) => (
                    <div 
                      key={hits} 
                      className={`payout-row ${hitCount === parseInt(hits) ? 'highlighted' : ''}`}
                    >
                      <span>{hits} hits:</span>
                      <span>{Number(multiplier).toFixed(1)}x</span>
                    </div>
                  ))}
                </PaytableDisplay>
              )}
            </CanvasContainer>
          </GameContainer>
        </GambaUi.Responsive>
      </GambaUi.Portal>
      
      <GambaUi.Portal target="controls">
        {isMobile ? (
          <MobileControls
            wager={wager}
            setWager={setWager}
            onPlay={play}
            playDisabled={
              selectedNumbers.length === 0 || 
              gameState === GAME_STATES.PLAYING || 
              gameState === GAME_STATES.REVEALING
            }
            playText={gameState === GAME_STATES.PLAYING ? 'Playing...' : 'Play'}
          />
        ) : (
          <DesktopControls
            onPlay={play}
            playDisabled={
              selectedNumbers.length === 0 || 
              gameState === GAME_STATES.PLAYING || 
              gameState === GAME_STATES.REVEALING
            }
            playText={gameState === GAME_STATES.PLAYING ? 'Playing...' : 'Play'}
          >
            <EnhancedWagerInput 
              value={wager} 
              onChange={setWager}
              disabled={gameState !== GAME_STATES.IDLE}
            />
            <EnhancedButton
              onClick={clearGame}
              disabled={gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.REVEALING}
            >
              Clear
            </EnhancedButton>
          </DesktopControls>
        )}
      </GambaUi.Portal>
    </>
  )
}