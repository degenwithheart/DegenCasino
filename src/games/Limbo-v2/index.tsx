import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput, useCurrentToken } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import styled from 'styled-components'
import { useToast } from '../../hooks/ui/useToast'

import { GAME_CONFIG, GAME_STATES, LIMBO_ANIMATION, type GameState } from './constants'
import { LIMBO_SOUNDS } from './sounds'
import { BET_ARRAYS_V2 } from '../rtpConfig-v2'

// Enhanced Components imports
import { EnhancedWagerInput, EnhancedPlayButton } from '../../components/Game/EnhancedGameControls'
import { GameControlsSection } from '../../components'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
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
  
  .info-row {
    display: flex;
    justify-content: space-between;
    margin: 5px 0;
    font-size: 16px;
    
    .label {
      color: ${GAME_CONFIG.COLORS.textSecondary};
      margin-right: 20px;
    }
    
    .value {
      color: ${GAME_CONFIG.COLORS.text};
      font-weight: bold;
    }
  }
`

const StatsDisplay = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  color: ${GAME_CONFIG.COLORS.text};
  font-size: 14px;
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(212, 165, 116, 0.3);
  min-width: 200px;
  
  h4 {
    margin: 0 0 10px 0;
    color: ${GAME_CONFIG.COLORS.textSecondary};
    text-align: center;
  }
  
  .stat-row {
    display: flex;
    justify-content: space-between;
    margin: 5px 0;
    padding: 2px 5px;
    border-radius: 3px;
  }
`

interface LimboGameProps {}

export default function LimboGame({}: LimboGameProps) {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const selectedToken = useCurrentToken()
  const [wager, setWager] = useWagerInput()
  const addToast = useToast()
  
  // Game state
  const [gameState, setGameState] = useState<GameState>(GAME_STATES.IDLE)
  const [targetMultiplier, setTargetMultiplier] = useState<number>(GAME_CONFIG.DEFAULT_MULTIPLIER)
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.0)
  const [resultMultiplier, setResultMultiplier] = useState<number>(0)
  const [gameWon, setGameWon] = useState<boolean | null>(null)
  const [lastPayout, setLastPayout] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const animationStartTimeRef = useRef<number>(0)
  
  // Effects and particles
  const [particles, setParticles] = useState<Particle[]>([])

  // Calculate win chance and potential payout
  const winChance = useMemo(() => {
    return Math.max(0.01, (1 / targetMultiplier) * 100)
  }, [targetMultiplier])
  
  const potentialPayout = useMemo(() => {
    return targetMultiplier * wager
  }, [targetMultiplier, wager])

  // Convert screen coordinates to slider value
  const screenToSliderValue = useCallback((x: number): number => {
    const sliderStart = GAME_CONFIG.SLIDER_X
    const sliderEnd = GAME_CONFIG.SLIDER_X + GAME_CONFIG.SLIDER_WIDTH
    const normalizedX = Math.max(0, Math.min(1, (x - sliderStart) / (sliderEnd - sliderStart)))
    
    // Logarithmic scaling for better control at lower values
    const logMin = Math.log(GAME_CONFIG.MIN_MULTIPLIER)
    const logMax = Math.log(GAME_CONFIG.MAX_MULTIPLIER)
    const logValue = logMin + normalizedX * (logMax - logMin)
    
    return Math.round(Math.exp(logValue) * 100) / 100
  }, [])

  // Convert slider value to screen coordinate
  const sliderValueToScreen = useCallback((value: number): number => {
    const logMin = Math.log(GAME_CONFIG.MIN_MULTIPLIER)
    const logMax = Math.log(GAME_CONFIG.MAX_MULTIPLIER)
    const logValue = Math.log(value)
    const normalizedValue = (logValue - logMin) / (logMax - logMin)
    
    return GAME_CONFIG.SLIDER_X + normalizedValue * GAME_CONFIG.SLIDER_WIDTH
  }, [])

  // Handle canvas interactions
  const handleCanvasMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== GAME_STATES.IDLE) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    // Check if click is on slider
    if (y >= GAME_CONFIG.SLIDER_Y - 20 && y <= GAME_CONFIG.SLIDER_Y + GAME_CONFIG.SLIDER_HEIGHT + 20 &&
        x >= GAME_CONFIG.SLIDER_X && x <= GAME_CONFIG.SLIDER_X + GAME_CONFIG.SLIDER_WIDTH) {
      setIsDragging(true)
      const newValue = screenToSliderValue(x)
      setTargetMultiplier(newValue)
      LIMBO_SOUNDS.sliderMove()
    }
  }, [gameState, screenToSliderValue])

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || gameState !== GAME_STATES.IDLE) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    
    const newValue = screenToSliderValue(x)
    setTargetMultiplier(newValue)
    LIMBO_SOUNDS.sliderMove()
  }, [isDragging, gameState, screenToSliderValue])

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add particle effects
  const addParticles = useCallback((x: number, y: number, color: string, count: number = 10) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        life: GAME_CONFIG.PARTICLE_LIFE,
        maxLife: GAME_CONFIG.PARTICLE_LIFE,
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
        life: particle.life - 1
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
    
    // Draw main multiplier display
    const displayMultiplier = gameState === GAME_STATES.IDLE ? targetMultiplier : 
                              gameState === GAME_STATES.ANIMATING ? currentMultiplier : 
                              resultMultiplier
    
    // Multiplier background glow
    if (gameState === GAME_STATES.ANIMATING || gameState === GAME_STATES.COMPLETE) {
      const glowIntensity = gameState === GAME_STATES.ANIMATING ? 
                           Math.sin(Date.now() * 0.01) * 0.3 + 0.7 : 1.0
      
      ctx.save()
      ctx.shadowColor = gameWon ? GAME_CONFIG.COLORS.successGreen : GAME_CONFIG.COLORS.multiplierGlow
      ctx.shadowBlur = 40 * glowIntensity
      ctx.fillStyle = GAME_CONFIG.COLORS.multiplierBackground
      ctx.fillRect(
        GAME_CONFIG.MULTIPLIER_X - 200,
        GAME_CONFIG.MULTIPLIER_Y - 100,
        400,
        200
      )
      ctx.restore()
    }
    
    // Draw main multiplier text
    ctx.fillStyle = gameState === GAME_STATES.COMPLETE ? 
                    (gameWon ? GAME_CONFIG.COLORS.successGreen : GAME_CONFIG.COLORS.dangerRed) :
                    GAME_CONFIG.COLORS.multiplierText
    ctx.font = 'bold 80px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      `${displayMultiplier.toFixed(2)}x`,
      GAME_CONFIG.MULTIPLIER_X,
      GAME_CONFIG.MULTIPLIER_Y
    )
    
    // Draw slider track
    ctx.fillStyle = GAME_CONFIG.COLORS.sliderTrack
    ctx.fillRect(
      GAME_CONFIG.SLIDER_X,
      GAME_CONFIG.SLIDER_Y,
      GAME_CONFIG.SLIDER_WIDTH,
      GAME_CONFIG.SLIDER_HEIGHT
    )
    
    // Draw slider fill (up to current position)
    const handleX = sliderValueToScreen(targetMultiplier)
    const fillWidth = handleX - GAME_CONFIG.SLIDER_X
    ctx.fillStyle = GAME_CONFIG.COLORS.sliderFill
    ctx.fillRect(
      GAME_CONFIG.SLIDER_X,
      GAME_CONFIG.SLIDER_Y,
      fillWidth,
      GAME_CONFIG.SLIDER_HEIGHT
    )
    
    // Draw slider handle
    ctx.fillStyle = isDragging ? GAME_CONFIG.COLORS.sliderHandleHover : GAME_CONFIG.COLORS.sliderHandle
    ctx.beginPath()
    ctx.arc(
      handleX,
      GAME_CONFIG.SLIDER_Y + GAME_CONFIG.SLIDER_HEIGHT / 2,
      GAME_CONFIG.SLIDER_HANDLE_SIZE / 2,
      0,
      Math.PI * 2
    )
    ctx.fill()
    
    // Draw slider labels
    ctx.fillStyle = GAME_CONFIG.COLORS.text
    ctx.font = '14px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(
      `${GAME_CONFIG.MIN_MULTIPLIER}x`,
      GAME_CONFIG.SLIDER_X,
      GAME_CONFIG.SLIDER_Y - 10
    )
    ctx.textAlign = 'right'
    ctx.fillText(
      `${GAME_CONFIG.MAX_MULTIPLIER}x`,
      GAME_CONFIG.SLIDER_X + GAME_CONFIG.SLIDER_WIDTH,
      GAME_CONFIG.SLIDER_Y - 10
    )
    ctx.textAlign = 'center'
    ctx.fillText(
      `Target: ${targetMultiplier.toFixed(2)}x`,
      handleX,
      GAME_CONFIG.SLIDER_Y + GAME_CONFIG.SLIDER_HEIGHT + 25
    )
    
    // Draw particles
    particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife
      ctx.globalAlpha = alpha
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1
    
  }, [gameState, targetMultiplier, currentMultiplier, resultMultiplier, gameWon, isDragging, particles, sliderValueToScreen])

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

  // Limbo climbing animation
  const startClimbingAnimation = useCallback((won: boolean, finalMultiplier: number) => {
    setGameState(GAME_STATES.ANIMATING)
    setCurrentMultiplier(1.0)
    animationStartTimeRef.current = Date.now()
    
    const climb = () => {
      const elapsed = Date.now() - animationStartTimeRef.current
      const progress = Math.min(elapsed / GAME_CONFIG.ANIMATION_DURATION, 1)
      
      // Animate multiplier climbing
      if (won) {
        // If winning, climb past target then settle on final
        const climbTarget = targetMultiplier + (finalMultiplier - targetMultiplier) * progress
        setCurrentMultiplier(climbTarget)
      } else {
        // If losing, climb toward crash point
        const climbTarget = 1.0 + (finalMultiplier - 1.0) * progress
        setCurrentMultiplier(climbTarget)
      }
      
      // Play climbing sound effects
      if (elapsed % 100 < 20) { // Every 100ms
        LIMBO_SOUNDS.climb()
      }
      
      if (progress < 1) {
        requestAnimationFrame(climb)
      } else {
        setResultMultiplier(finalMultiplier)
        setGameState(GAME_STATES.COMPLETE)
        
        if (won) {
          LIMBO_SOUNDS.win()
          addParticles(GAME_CONFIG.MULTIPLIER_X, GAME_CONFIG.MULTIPLIER_Y, GAME_CONFIG.COLORS.successGreen, 20)
        } else {
          LIMBO_SOUNDS.crash()
          addParticles(GAME_CONFIG.MULTIPLIER_X, GAME_CONFIG.MULTIPLIER_Y, GAME_CONFIG.COLORS.dangerRed, 15)
        }
      }
    }
    
    requestAnimationFrame(climb)
  }, [targetMultiplier, addParticles])

  // Generate bet array for Gamba
  const generateBetArray = useCallback((multiplier: number) => {
    return BET_ARRAYS_V2['limbo-v2'].calculateBetArray(multiplier)
  }, [])

  // Play game
  const play = useCallback(async () => {
    try {
      setGameState(GAME_STATES.PLAYING)
      setGameWon(null)
      setResultMultiplier(0)
      setCurrentMultiplier(1.0)
      
      const betArray = generateBetArray(targetMultiplier)
      
      await game.play({ wager: wager, bet: betArray })
      const result = await game.result()
      
      const won = result.payout > 0
      setGameWon(won)
      setLastPayout(result.payout)
      
      // Calculate result multiplier based on game outcome
      let finalMultiplier: number
      if (won) {
        // Winner: target multiplier + some bonus
        finalMultiplier = targetMultiplier + (Math.random() * targetMultiplier * 0.2)
      } else {
        // Loser: random value between 1 and target
        finalMultiplier = 1.01 + (Math.random() * (targetMultiplier - 1.01))
      }
      
      // Add countdown delay then start climbing animation
      setTimeout(() => {
        startClimbingAnimation(won, finalMultiplier)
      }, 500)
      
    } catch (error: any) {
      addToast({ 
        title: 'Game Error', 
        description: `Game error: ${error.message}` 
      })
      setGameState(GAME_STATES.IDLE)
    }
  }, [targetMultiplier, wager, game, generateBetArray, startClimbingAnimation, addToast])

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(GAME_STATES.IDLE)
    setGameWon(null)
    setResultMultiplier(0)
    setCurrentMultiplier(1.0)
    setParticles([])
  }, [])

  return (
    <>
      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <GameContainer>
            <CanvasContainer>
              <Canvas
                ref={canvasRef}
                width={GAME_CONFIG.CANVAS_WIDTH}
                height={GAME_CONFIG.CANVAS_HEIGHT}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
              />
              
              <GameInfo>
                <h3>Limbo v2</h3>
                <div className="info-row">
                  <span className="label">Target:</span>
                  <span className="value">{targetMultiplier.toFixed(2)}x</span>
                </div>
                <div className="info-row">
                  <span className="label">Win Chance:</span>
                  <span className="value">{winChance.toFixed(2)}%</span>
                </div>
                {gameState === GAME_STATES.COMPLETE && (
                  <div className="info-row">
                    <span className="label">Result:</span>
                    <span className="value" style={{ color: gameWon ? GAME_CONFIG.COLORS.successGreen : GAME_CONFIG.COLORS.dangerRed }}>
                      {gameWon ? `Won ${lastPayout.toFixed(2)}` : 'Lost'}
                    </span>
                  </div>
                )}
              </GameInfo>
              
              <StatsDisplay>
                <h4>Game Stats</h4>
                <div className="stat-row">
                  <span>Multiplier:</span>
                  <span>{targetMultiplier.toFixed(2)}x</span>
                </div>
                <div className="stat-row">
                  <span>Win Chance:</span>
                  <span>{winChance.toFixed(2)}%</span>
                </div>
                <div className="stat-row">
                  <span>Potential Payout:</span>
                  <span>
                    <TokenValue
                      mint={pool.token}
                      suffix={selectedToken?.symbol}
                      amount={potentialPayout}
                    />
                  </span>
                </div>
              </StatsDisplay>
            </CanvasContainer>
          </GameContainer>
        </GambaUi.Responsive>
      </GambaUi.Portal>
      
      <GambaUi.Portal target="controls">
        <EnhancedWagerInput 
          value={wager} 
          onChange={setWager}
          disabled={gameState !== GAME_STATES.IDLE}
        />
        <EnhancedPlayButton
          onClick={resetGame}
          disabled={gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.ANIMATING}
        >
          Reset
        </EnhancedPlayButton>
        <EnhancedPlayButton
          onClick={play}
          disabled={gameState !== GAME_STATES.IDLE}
        >
          {gameState === GAME_STATES.PLAYING ? 'Playing...' : 
           gameState === GAME_STATES.ANIMATING ? 'Animating...' : 'Play'}
        </EnhancedPlayButton>
      </GambaUi.Portal>
    </>
  )
}