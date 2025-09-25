import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import { BET_ARRAYS_V2 } from '../rtpConfig-v2'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { EnhancedWagerInput, EnhancedPlayButton, EnhancedButton, MobileControls, DesktopControls, GameControlsSection } from '../../components'
import { useGameMeta } from '../useGameMeta'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameStats } from '../../hooks/game/useGameStats'
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

  // Game statistics tracking - using centralized hook
  const gameStats = useGameStats('mines-v2')

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
        gameStats.updateStats(0)

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
          gameStats.updateStats(result.payout)

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
    
    // Enhanced premium background with multiple layers
    const bgGradient = ctx.createRadialGradient(size.width/2, size.height/2, 0, size.width/2, size.height/2, Math.max(size.width, size.height))
    bgGradient.addColorStop(0, '#2a2a4e')
    bgGradient.addColorStop(0.3, '#1f1f3d')
    bgGradient.addColorStop(0.6, '#16213e')
    bgGradient.addColorStop(0.8, '#141728')
    bgGradient.addColorStop(1, '#0a0a15')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, size.width, size.height)
    
    // Subtle noise texture overlay
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.02})`
      ctx.fillRect(Math.random() * size.width, Math.random() * size.height, 1, 1)
    }
    
    // Ambient lighting effects
    const ambientGlow = ctx.createRadialGradient(size.width * 0.3, size.height * 0.2, 0, size.width * 0.3, size.height * 0.2, size.width * 0.5)
    ambientGlow.addColorStop(0, 'rgba(147, 88, 255, 0.08)')
    ambientGlow.addColorStop(1, 'rgba(147, 88, 255, 0)')
    ctx.fillStyle = ambientGlow
    ctx.fillRect(0, 0, size.width, size.height)

    // Draw game area
    drawGameArea(ctx, size)
  }, [gamePhase, mineCount, wager, cells, currentLevel, started, levels, getCurrentMultiplier, getNextMultiplier, totalGain, isMobile])

  // Draw game area
  const drawGameArea = (ctx: CanvasRenderingContext2D, size?: { width: number; height: number }) => {
    const canvasWidth = size?.width || ctx.canvas.width
    const canvasHeight = size?.height || ctx.canvas.height
    
    // Mobile responsive sidebar
    const sidebarWidth = isMobile ? 0 : 160 // Hide sidebar on mobile, reduce width on desktop
    const padding = 20
    const sidebarGap = isMobile ? 0 : 50 // Space between grid and sidebar
    const availableWidth = canvasWidth - padding * 2 // Full width minus padding for grid sizing
    const availableHeight = canvasHeight - padding * 2 // Same height calculation as 2D version
    const gridSize = Math.min(availableWidth, availableHeight)
    
    // Center the grid itself in the canvas
    const gridStartX = (canvasWidth - gridSize) / 2
    const gridStartY = (canvasHeight - gridSize) / 2 // Center vertically like 2D version

    // Draw cells with gap
    const gap = 8
    const adjustedCellSize = (gridSize - (gap * (GRID_COLS - 1))) / GRID_COLS
    
    for (let i = 0; i < MINES_GRID_SIZE; i++) {
      const row = Math.floor(i / GRID_COLS)
      const col = i % GRID_COLS
      const x = gridStartX + col * (adjustedCellSize + gap)
      const y = gridStartY + row * (adjustedCellSize + gap)

      drawCell(ctx, x, y, adjustedCellSize, cells[i], i)
    }

    // Draw sidebar stats (mockup style) - only on desktop
    if (!isMobile) {
      drawSidebar(ctx, canvasWidth, canvasHeight, sidebarWidth)
    }
  }

  // Draw sidebar stats
  const drawSidebar = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, sidebarWidth: number) => {
    // Position sidebar to the right of the centered grid
    const padding = 20
    const sidebarGap = isMobile ? 0 : 50 // Space between grid and sidebar
    const availableWidth = canvasWidth - padding * 2 // Full width minus padding for grid sizing
    const availableHeight = canvasHeight - padding * 2 // Same height calculation as 2D version
    const gridSize = Math.min(availableWidth, availableHeight)
    const gridStartX = (canvasWidth - gridSize) / 2
    const sidebarX = gridStartX + gridSize + sidebarGap
    
    const startY = (canvasHeight - gridSize) / 2 // Center vertically like 2D version
    const cardHeight = (gridSize - 12) / 2 // Each counter takes half the available height minus gap
    const gap = 12 // Small gap between counters

    // Count revealed gems and remaining cells
    const revealedGems = cells.filter(cell => cell.status === 'gold').length
    const remainingGems = MINES_GRID_SIZE - mineCount - revealedGems

    // Gems Counter (Green) - shows remaining gems - top half
    drawGemsCard(ctx, sidebarX, startY, sidebarWidth, cardHeight, remainingGems)

    // Mines Counter (Red) - bottom half
    drawMinesCard(ctx, sidebarX, startY + cardHeight + gap, sidebarWidth, cardHeight, mineCount)

    // Decorative floating gem when winning
    if (started && totalGain > 0) {
      const gemY = startY + gridSize + 20 // Position below the sidebar
      
      // Add subtle glow effect
      ctx.shadowColor = 'rgba(0, 230, 118, 0.6)'
      ctx.shadowBlur = 20
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      
      ctx.font = '40px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('💎', sidebarX + sidebarWidth / 2, gemY)
      
      // Reset shadow
      ctx.shadowBlur = 0
    }
  }

  // Draw premium gems card with modern elegant design
  const drawGemsCard = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, remainingGems: number) => {
    const radius = Math.min(20, width * 0.15)

    // Modern 3D shadow layers for depth
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.beginPath()
    ctx.roundRect(x + 6, y + 6, width, height, radius)
    ctx.fill()

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.beginPath()
    ctx.roundRect(x + 3, y + 3, width, height, radius)
    ctx.fill()

    // Modern subtle shadow base
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
    ctx.beginPath()
    ctx.roundRect(x + 4, y + 4, width, height, radius)
    ctx.fill()

    // Main card background with elegant gradient
    const bgGradient = ctx.createLinearGradient(x, y, x, y + height)
    bgGradient.addColorStop(0, 'rgba(34, 197, 94, 0.95)')    // Emerald top
    bgGradient.addColorStop(0.3, 'rgba(22, 163, 74, 0.9)')   // Forest green
    bgGradient.addColorStop(0.7, 'rgba(20, 83, 45, 0.85)')   // Dark green
    bgGradient.addColorStop(1, 'rgba(15, 23, 42, 0.9)')      // Slate base
    ctx.fillStyle = bgGradient

    // Soft inner glow
    ctx.shadowColor = 'rgba(34, 197, 94, 0.4)'
    ctx.shadowBlur = 25
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    ctx.beginPath()
    ctx.roundRect(x, y, width, height, radius)
    ctx.fill()
    ctx.shadowBlur = 0

    // Elegant border with subtle gradient
    const borderGradient = ctx.createLinearGradient(x, y, x + width, y + height)
    borderGradient.addColorStop(0, 'rgba(74, 222, 128, 0.8)')
    borderGradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.6)')
    borderGradient.addColorStop(1, 'rgba(22, 163, 74, 0.8)')
    ctx.strokeStyle = borderGradient
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(x + 1, y + 1, width - 2, height - 2, radius - 1)
    ctx.stroke()

    // Subtle inner highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(x + 3, y + 3, width - 6, height - 6, radius - 3)
    ctx.stroke()

    // Decorative pattern overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 6; j++) {
        if ((i + j) % 2 === 0) {
          ctx.beginPath()
          ctx.roundRect(x + i * (width / 8), y + j * (height / 6), width / 8, height / 6, 2)
          ctx.fill()
        }
      }
    }

    // Premium gem icon with elegant effects - scaled for taller card
    const iconSize = Math.min(28, height * 0.18)
    ctx.font = `${iconSize}px Arial`
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.shadowBlur = 6
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.fillText('💎', x + width - iconSize * 0.8, y + iconSize * 0.8)

    ctx.shadowColor = 'rgba(74, 222, 128, 0.9)'
    ctx.shadowBlur = 12
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.fillText('💎', x + width - iconSize * 0.8, y + iconSize * 0.8)

    // Enhanced title with elegant styling - scaled for taller card
    const titleSize = Math.min(18, height * 0.14)
    ctx.fillStyle = 'rgba(187, 247, 208, 0.9)'
    ctx.font = `600 ${titleSize}px Arial`
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1
    ctx.fillText('GEMS LEFT', x + width / 2, y + titleSize + 12)

    ctx.shadowColor = 'rgba(34, 197, 94, 0.5)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.fillText('GEMS LEFT', x + width / 2, y + titleSize + 12)

    // Ultra-premium value styling - scaled for taller card
    const valueSize = Math.min(48, height * 0.4)
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${valueSize}px Arial`
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 3
    ctx.shadowOffsetY = 3
    ctx.fillText(remainingGems.toString(), x + width / 2, y + height * 0.62)

    ctx.shadowColor = 'rgba(74, 222, 128, 0.8)'
    ctx.shadowBlur = 15
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.fillText(remainingGems.toString(), x + width / 2, y + height * 0.62)

    // Bright highlight for depth
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.shadowBlur = 0
    ctx.fillText(remainingGems.toString(), x + width / 2 - 1, y + height * 0.62 - 1)
  }

  // Draw premium mines card with modern elegant design
  const drawMinesCard = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, mineCount: number) => {
    const radius = Math.min(20, width * 0.15)

    // Modern 3D shadow layers for depth
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.beginPath()
    ctx.roundRect(x + 6, y + 6, width, height, radius)
    ctx.fill()

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.beginPath()
    ctx.roundRect(x + 3, y + 3, width, height, radius)
    ctx.fill()

    // Modern subtle shadow base
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
    ctx.beginPath()
    ctx.roundRect(x + 4, y + 4, width, height, radius)
    ctx.fill()

    // Main card background with elegant gradient
    const bgGradient = ctx.createLinearGradient(x, y, x, y + height)
    bgGradient.addColorStop(0, 'rgba(239, 68, 68, 0.95)')    // Red top
    bgGradient.addColorStop(0.3, 'rgba(185, 28, 28, 0.9)')   // Dark red
    bgGradient.addColorStop(0.7, 'rgba(127, 29, 29, 0.85)')  // Crimson
    bgGradient.addColorStop(1, 'rgba(15, 23, 42, 0.9)')      // Slate base
    ctx.fillStyle = bgGradient

    // Soft inner glow
    ctx.shadowColor = 'rgba(239, 68, 68, 0.4)'
    ctx.shadowBlur = 25
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    ctx.beginPath()
    ctx.roundRect(x, y, width, height, radius)
    ctx.fill()
    ctx.shadowBlur = 0

    // Elegant border with subtle gradient
    const borderGradient = ctx.createLinearGradient(x, y, x + width, y + height)
    borderGradient.addColorStop(0, 'rgba(252, 165, 165, 0.8)')
    borderGradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.6)')
    borderGradient.addColorStop(1, 'rgba(185, 28, 28, 0.8)')
    ctx.strokeStyle = borderGradient
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(x + 1, y + 1, width - 2, height - 2, radius - 1)
    ctx.stroke()

    // Subtle inner highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(x + 3, y + 3, width - 6, height - 6, radius - 3)
    ctx.stroke()

    // Decorative pattern overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 6; j++) {
        if ((i + j) % 2 === 0) {
          ctx.beginPath()
          ctx.roundRect(x + i * (width / 8), y + j * (height / 6), width / 8, height / 6, 2)
          ctx.fill()
        }
      }
    }

    // Premium bomb icon with elegant effects - scaled for taller card
    const iconSize = Math.min(26, height * 0.17)
    ctx.font = `${iconSize}px Arial`
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.shadowBlur = 6
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.fillText('💣', x + width - iconSize * 0.8, y + iconSize * 0.8)

    ctx.shadowColor = 'rgba(252, 165, 165, 0.9)'
    ctx.shadowBlur = 12
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.fillText('💣', x + width - iconSize * 0.8, y + iconSize * 0.8)

    // Enhanced title with elegant styling - scaled for taller card
    const titleSize = Math.min(18, height * 0.14)
    ctx.fillStyle = 'rgba(254, 226, 226, 0.9)'
    ctx.font = `600 ${titleSize}px Arial`
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1
    ctx.fillText('MINES', x + width / 2, y + titleSize + 12)

    ctx.shadowColor = 'rgba(239, 68, 68, 0.5)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.fillText('MINES', x + width / 2, y + titleSize + 12)

    // Ultra-premium value styling - scaled for taller card
    const valueSize = Math.min(48, height * 0.4)
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${valueSize}px Arial`
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 3
    ctx.shadowOffsetY = 3
    ctx.fillText(mineCount.toString(), x + width / 2, y + height * 0.62)

    ctx.shadowColor = 'rgba(252, 165, 165, 0.8)'
    ctx.shadowBlur = 15
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.fillText(mineCount.toString(), x + width / 2, y + height * 0.62)

    // Bright highlight for depth
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.shadowBlur = 0
    ctx.fillText(mineCount.toString(), x + width / 2 - 1, y + height * 0.62 - 1)
  }

  // Draw individual cell with enhanced 3D styling and pressed states
  const drawCell = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, cell: MinesCellState, index: number) => {
    const depthOffset = cell.status === 'hidden' ? 6 : 1
    const isPressed = cell.status !== 'hidden' // Revealed cells appear pressed
    
    // Multiple shadow layers for more dramatic 3D depth
    if (!isPressed) {
      // Deep shadow layer
      ctx.fillStyle = 'rgba(5, 5, 15, 0.8)'
      ctx.beginPath()
      ctx.roundRect(x + depthOffset + 2, y + depthOffset + 2, size, size, 8)
      ctx.fill()
      
      // Mid shadow layer
      ctx.fillStyle = 'rgba(8, 8, 20, 0.7)'
      ctx.beginPath()
      ctx.roundRect(x + depthOffset, y + depthOffset, size, size, 8)
      ctx.fill()
      
      // Close shadow layer
      ctx.fillStyle = 'rgba(15, 15, 30, 0.5)'
      ctx.beginPath()
      ctx.roundRect(x + depthOffset - 1, y + depthOffset - 1, size, size, 8)
      ctx.fill()
    }

    // Create enhanced 3D gradient backgrounds
    let gradient
    const adjustedX = isPressed ? x + 4 : x
    const adjustedY = isPressed ? y + 4 : y
    const adjustedSize = isPressed ? size - 4 : size
    
    switch (cell.status) {
      case 'hidden':
        // Enhanced gradient for more dramatic 3D button effect
        gradient = ctx.createLinearGradient(adjustedX, adjustedY, adjustedX + adjustedSize, adjustedY + adjustedSize)
        gradient.addColorStop(0, '#707db8')      // Bright top-left highlight
        gradient.addColorStop(0.15, '#606aa0')   // Light area
        gradient.addColorStop(0.4, '#525890')    // Mid tone
        gradient.addColorStop(0.6, '#424874')    // Base color
        gradient.addColorStop(0.8, '#363e65')    // Shadow area
        gradient.addColorStop(1, '#252b45')      // Deep shadow
        ctx.fillStyle = gradient
        break
      case 'gold':
        gradient = ctx.createLinearGradient(adjustedX, adjustedY, adjustedX + adjustedSize, adjustedY + adjustedSize)
        gradient.addColorStop(0, '#40ffb0')      // Bright highlight
        gradient.addColorStop(0.2, '#30ff98')    // Light area
        gradient.addColorStop(0.5, '#20ff90')    // Mid highlight
        gradient.addColorStop(0.7, '#00e676')    // Base color
        gradient.addColorStop(0.9, '#00c853')    // Shadow
        gradient.addColorStop(1, '#00a040')      // Deep shadow
        ctx.fillStyle = gradient
        break
      case 'mine':
        gradient = ctx.createLinearGradient(adjustedX, adjustedY, adjustedX + adjustedSize, adjustedY + adjustedSize)
        gradient.addColorStop(0, '#ff9090')      // Bright highlight
        gradient.addColorStop(0.2, '#ff8080')    // Light area
        gradient.addColorStop(0.5, '#ff7070')    // Mid highlight
        gradient.addColorStop(0.7, '#ff5252')    // Base color
        gradient.addColorStop(0.9, '#d32f2f')    // Shadow
        gradient.addColorStop(1, '#b71c1c')      // Deep shadow
        ctx.fillStyle = gradient
        break
    }

    // Outer glow for revealed cells
    if (cell.status !== 'hidden') {
      ctx.shadowColor = cell.status === 'gold' ? 'rgba(0, 230, 118, 0.6)' : 'rgba(255, 82, 82, 0.6)'
      ctx.shadowBlur = 20
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    } else {
      ctx.shadowColor = 'rgba(147, 88, 255, 0.3)'
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    }

    // Draw main cell
    ctx.beginPath()
    ctx.roundRect(adjustedX, adjustedY, adjustedSize, adjustedSize, 8)
    ctx.fill()
    ctx.shadowBlur = 0

    // Enhanced 3D border effects
    if (isPressed) {
      // Pressed/inset style for revealed cells with deeper inset
      ctx.strokeStyle = cell.status === 'gold' ? 'rgba(0, 120, 60, 1.0)' : 'rgba(150, 30, 30, 1.0)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(adjustedX, adjustedY, adjustedSize, adjustedSize, 6)
      ctx.stroke()
      
      // Deep inner shadow (pressed effect)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(adjustedX + 2, adjustedY + 2, adjustedSize - 4, adjustedSize - 4, 4)
      ctx.stroke()
      
      // Inner highlight (bottom-right for inset)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(adjustedX + adjustedSize - 6, adjustedY + adjustedSize - 6, 4, 4, 2)
      ctx.stroke()
    } else {
      // Enhanced raised style for hidden cells
      ctx.strokeStyle = 'rgba(147, 88, 255, 0.8)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(adjustedX, adjustedY, adjustedSize, adjustedSize, 8)
      ctx.stroke()
      
      // Bright top-left highlight (raised effect)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(adjustedX + 3, adjustedY + 3, adjustedSize - 6, adjustedSize - 6, 5)
      ctx.stroke()
      
      // Secondary highlight
      ctx.strokeStyle = 'rgba(200, 200, 255, 0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(adjustedX + 5, adjustedY + 5, adjustedSize - 10, adjustedSize - 10, 3)
      ctx.stroke()
      
      // Bottom-right deep shadow
      ctx.strokeStyle = 'rgba(10, 10, 25, 0.8)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(adjustedX + 1, adjustedY + 1, adjustedSize - 2, adjustedSize - 2, 7)
      ctx.stroke()
      
      // Corner shadow detail
      ctx.strokeStyle = 'rgba(5, 5, 15, 0.6)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(adjustedX + 2, adjustedY + 2, adjustedSize - 4, adjustedSize - 4, 6)
      ctx.stroke()
    }

    // Enhanced cell content with dramatic 3D effects
    if (cell.status === 'mine') {
      // Draw mine with multiple shadow layers
      ctx.font = `${adjustedSize * 0.45}px Arial`
      ctx.textAlign = 'center'
      
      // Deep shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
      ctx.shadowBlur = 8
      ctx.shadowOffsetX = 4
      ctx.shadowOffsetY = 4
      ctx.fillStyle = '#000'
      ctx.fillText('💣', adjustedX + adjustedSize / 2, adjustedY + adjustedSize * 0.65)
      
      // Closer shadow for depth
      ctx.shadowBlur = 3
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2
      ctx.fillText('💣', adjustedX + adjustedSize / 2, adjustedY + adjustedSize * 0.65)
      ctx.shadowBlur = 0
    } else if (cell.status === 'gold') {
      // Draw gem with intense glow and highlight
      ctx.font = `${adjustedSize * 0.45}px Arial`
      ctx.textAlign = 'center'
      
      // Outer glow
      ctx.shadowColor = 'rgba(0, 255, 120, 1.0)'
      ctx.shadowBlur = 15
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.fillStyle = '#fff'
      ctx.fillText('💎', adjustedX + adjustedSize / 2, adjustedY + adjustedSize * 0.65)
      
      // Inner bright glow
      ctx.shadowBlur = 8
      ctx.fillText('💎', adjustedX + adjustedSize / 2, adjustedY + adjustedSize * 0.65)
      
      // Bright highlight
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
      ctx.shadowBlur = 4
      ctx.fillText('💎', adjustedX + adjustedSize / 2, adjustedY + adjustedSize * 0.65)
      ctx.shadowBlur = 0
    } else if (cell.status === 'hidden') {
      // Add subtle texture/pattern to hidden buttons
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.beginPath()
      ctx.roundRect(adjustedX + adjustedSize * 0.3, adjustedY + adjustedSize * 0.3, 
                   adjustedSize * 0.4, adjustedSize * 0.4, 2)
      ctx.fill()
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
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height
      const sidebarWidth = isMobile ? 0 : 160
      const padding = 20
      const sidebarGap = isMobile ? 0 : 50 // Space between grid and sidebar
      const availableWidth = canvasWidth - padding * 2 // Full width minus padding for grid sizing
      const availableHeight = canvasHeight - padding * 2 // Same height calculation as 2D version
      const gridSize = Math.min(availableWidth, availableHeight)
      
      // Center the grid itself in the canvas
      const gridStartX = (canvasWidth - gridSize) / 2
      const gridStartY = (canvasHeight - gridSize) / 2 // Center vertically like 2D version

      // Calculate cell positions with gaps
      const gap = 8
      const adjustedCellSize = (gridSize - (gap * (GRID_COLS - 1))) / GRID_COLS

      if (canvasX >= gridStartX && canvasX < gridStartX + gridSize &&
          canvasY >= gridStartY && canvasY < gridStartY + gridSize) {
        
        // Find which cell was clicked accounting for gaps
        let clickedIndex = -1
        for (let i = 0; i < MINES_GRID_SIZE; i++) {
          const row = Math.floor(i / GRID_COLS)
          const col = i % GRID_COLS
          const cellX = gridStartX + col * (adjustedCellSize + gap)
          const cellY = gridStartY + row * (adjustedCellSize + gap)

          if (canvasX >= cellX && canvasX < cellX + adjustedCellSize &&
              canvasY >= cellY && canvasY < cellY + adjustedCellSize) {
            clickedIndex = i
            break
          }
        }

        if (clickedIndex >= 0) {
          revealCell(clickedIndex)
        }
      }
    }
  }, [started, gamePhase, revealCell, isMobile])

  const gameMeta = useGameMeta('mines-v2')

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Mines"
          gameMode="V2"
          rtp="95"
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'linear-gradient(135deg, #0a0511 0%, #0d0618 25%, #0f081c 50%, #0a0511 75%, #0a0511 100%)',
          perspective: '100px'
        }}>
          {/* Canvas for game UI - now starts from top since header is outside */}
          <div style={{
            position: 'absolute',
            top: '20px',
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
                BASE x
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
                NEXT x
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

            <DesktopControls>
              <EnhancedWagerInput 
                value={wager} 
                onChange={setWager}
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
            
            <DesktopControls>
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
