import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { BET_ARRAYS_V2 } from '../rtpConfig-v2'
import { EnhancedWagerInput, EnhancedPlayButton, EnhancedButton, MobileControls, DesktopControls, GameControlsSection } from '../../components'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { useGameMeta } from '../useGameMeta'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { 
  SOUND_WIN, SOUND_LOSE, SOUND_PLAY, SOUND_DOUBLE, SOUND_NOTHING,
  CANVAS_WIDTH, CANVAS_HEIGHT, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_SPACING,
  ROMANTIC_COLORS, BUTTON_COLORS, GAME_MODES, PARTICLE_COUNT, PARTICLE_SPEED,
  PARTICLE_SIZE, ANIMATION_DURATION, REVEAL_ANIMATION_SPEED, GLOW_INTENSITY
} from './constants'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export default function DoubleOrNothingV2() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [initialWager, setInitialWager] = useWagerInput()
  const { settings } = useGraphics()
  const effectsRef = React.useRef<GameplayEffectsRef>(null)
  const { mobile: isMobile } = useIsCompact()
  
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    double: SOUND_DOUBLE,
    nothing: SOUND_NOTHING,
  })

  // Canvas ref
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const animationRef = React.useRef<number>()
  const particlesRef = React.useRef<Particle[]>([])
  
  // Game state
  const [mode, setMode] = React.useState(0) // 0: 2x, 1: 3x, 2: 10x
  const [gameState, setGameState] = React.useState<'idle' | 'playing' | 'revealing' | 'win' | 'lose'>('idle')
  const [revealProgress, setRevealProgress] = React.useState(0)
  const [winningButton, setWinningButton] = React.useState<number | null>(null)
  const [selectedButton, setSelectedButton] = React.useState<number | null>(null)
  const [inProgress, setInProgress] = React.useState(false)
  const [lastPayout, setLastPayout] = React.useState<number | null>(null)
  const [gameCount, setGameCount] = React.useState(0)
  const [winCount, setWinCount] = React.useState(0)
  const [lossCount, setLossCount] = React.useState(0)
  const [totalProfit, setTotalProfit] = React.useState(0)
  const [hoverButton, setHoverButton] = React.useState<number | null>(null)

  // Get current balance for stats
  const currentBalance = React.useMemo(() => {
    return pool?.liquidity ? Number(pool.liquidity) : 0
  }, [pool])

  // Create particles
  const createParticles = (x: number, y: number, color: string, count: number = PARTICLE_COUNT) => {
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * PARTICLE_SPEED * 2,
        vy: (Math.random() - 0.5) * PARTICLE_SPEED * 2,
        life: 0,
        maxLife: 60 + Math.random() * 60,
        color,
        size: PARTICLE_SIZE + Math.random() * PARTICLE_SIZE
      })
    }
    particlesRef.current = [...particlesRef.current, ...particles]
  }

  // Canvas drawing functions
  const drawDegenGameBackground = (ctx: CanvasRenderingContext2D) => {
    // Romantic degen gradient background
    const gradient = ctx.createRadialGradient(
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0,
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH / 2
    )
    gradient.addColorStop(0, ROMANTIC_COLORS.background)
    gradient.addColorStop(0.7, '#1a0520')
    gradient.addColorStop(1, '#0a0511')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    // Add subtle grid pattern
    ctx.strokeStyle = 'rgba(212, 165, 116, 0.1)'
    ctx.lineWidth = 1
    
    for (let i = 0; i < CANVAS_WIDTH; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, CANVAS_HEIGHT)
      ctx.stroke()
    }
    
    for (let i = 0; i < CANVAS_HEIGHT; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(CANVAS_WIDTH, i)
      ctx.stroke()
    }
  }

  const drawButtons = (ctx: CanvasRenderingContext2D) => {
    const currentMode = GAME_MODES[mode]
    const buttonCount = currentMode.outcomes
    const totalWidth = buttonCount * BUTTON_WIDTH + (buttonCount - 1) * BUTTON_SPACING
    const startX = (CANVAS_WIDTH - totalWidth) / 2
    const startY = (CANVAS_HEIGHT - BUTTON_HEIGHT) / 2

    for (let i = 0; i < buttonCount; i++) {
      const x = startX + i * (BUTTON_WIDTH + BUTTON_SPACING)
      const y = startY
      const isWinning = i === buttonCount - 1 // Last button is always the winning one
      const isSelected = selectedButton === i
      const isRevealed = gameState === 'revealing' && revealProgress > (i / buttonCount)
      const isHovered = hoverButton === i

      // Button background
      let buttonColor = ROMANTIC_COLORS.dark
      let glowColor = 'transparent'
      
      if (gameState === 'idle' || gameState === 'playing') {
        if (isHovered) {
          buttonColor = currentMode.color + '20'
          glowColor = currentMode.color + '40'
        } else {
          buttonColor = ROMANTIC_COLORS.dark
        }
      } else if (isRevealed) {
        if (isWinning) {
          buttonColor = currentMode.color
          glowColor = currentMode.color + '60'
        } else {
          buttonColor = ROMANTIC_COLORS.nothing
          glowColor = ROMANTIC_COLORS.nothing + '40'
        }
      }

      // Draw glow effect
      if (glowColor !== 'transparent') {
        ctx.shadowColor = glowColor
        ctx.shadowBlur = GLOW_INTENSITY
      } else {
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
      }

      // Draw button
      ctx.fillStyle = buttonColor
      ctx.roundRect(x, y, BUTTON_WIDTH, BUTTON_HEIGHT, 16)
      ctx.fill()

      // Draw button border
      ctx.strokeStyle = isRevealed && isWinning ? currentMode.color : ROMANTIC_COLORS.gold
      ctx.lineWidth = isRevealed ? 4 : 2
      ctx.stroke()

      // Reset shadow
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0

      // Draw button text
      ctx.fillStyle = ROMANTIC_COLORS.light
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'
      
      let buttonText = ''
      if (gameState === 'idle' || gameState === 'playing') {
        buttonText = '?'
      } else if (isRevealed) {
        buttonText = isWinning ? currentMode.winLabel : currentMode.loseLabel
      } else {
        buttonText = '?'
      }
      
      ctx.fillText(buttonText, x + BUTTON_WIDTH / 2, y + BUTTON_HEIGHT / 2 + 8)
    }
  }

  const drawGameInfo = (ctx: CanvasRenderingContext2D) => {
    const currentMode = GAME_MODES[mode]
    
    // Mode indicator
    ctx.fillStyle = ROMANTIC_COLORS.gold
    ctx.font = 'bold 32px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`${currentMode.label} Mode`, CANVAS_WIDTH / 2, 100)
    
    // Description
    ctx.fillStyle = ROMANTIC_COLORS.light
    ctx.font = '18px Arial'
    ctx.fillText(currentMode.description, CANVAS_WIDTH / 2, 130)
    
    // Game state indicator
    let statusText = ''
    let statusColor = ROMANTIC_COLORS.light
    
    switch (gameState) {
      case 'playing':
        statusText = 'Choose your fate...'
        statusColor = ROMANTIC_COLORS.gold
        break
      case 'revealing':
        statusText = 'Revealing...'
        statusColor = ROMANTIC_COLORS.purple
        break
      case 'win':
        statusText = `${currentMode.winLabel} 🎉`
        statusColor = currentMode.color
        break
      case 'lose':
        statusText = 'Nothing 💸'
        statusColor = ROMANTIC_COLORS.nothing
        break
      default:
        statusText = 'Ready to risk it all?'
        break
    }
    
    ctx.fillStyle = statusColor
    ctx.font = 'bold 24px Arial'
    ctx.fillText(statusText, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 100)
    
    ctx.textAlign = 'left'
  }

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    particlesRef.current.forEach((particle, index) => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life++
      
      if (particle.life >= particle.maxLife) {
        particlesRef.current.splice(index, 1)
        return
      }
      
      const alpha = 1 - (particle.life / particle.maxLife)
      ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0')
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    // Draw background
    drawDegenGameBackground(ctx)
    
    // Draw buttons
    drawButtons(ctx)
    
    // Draw game info
    drawGameInfo(ctx)
    
    // Draw particles
    drawParticles(ctx)
  }

  // Animation loop
  React.useEffect(() => {
    const animate = () => {
      drawCanvas()
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mode, gameState, revealProgress, winningButton, selectedButton, hoverButton])

  // Handle canvas clicks
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'idle' || inProgress) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH / rect.width
    const scaleY = CANVAS_HEIGHT / rect.height
    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY
    
    const currentMode = GAME_MODES[mode]
    const buttonCount = currentMode.outcomes
    const totalWidth = buttonCount * BUTTON_WIDTH + (buttonCount - 1) * BUTTON_SPACING
    const startX = (CANVAS_WIDTH - totalWidth) / 2
    const startY = (CANVAS_HEIGHT - BUTTON_HEIGHT) / 2
    
    for (let i = 0; i < buttonCount; i++) {
      const buttonX = startX + i * (BUTTON_WIDTH + BUTTON_SPACING)
      const buttonY = startY
      
      if (x >= buttonX && x <= buttonX + BUTTON_WIDTH && 
          y >= buttonY && y <= buttonY + BUTTON_HEIGHT) {
        setSelectedButton(i)
        play()
        break
      }
    }
  }

  // Handle canvas hover
  const handleCanvasMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'idle') {
      setHoverButton(null)
      return
    }
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH / rect.width
    const scaleY = CANVAS_HEIGHT / rect.height
    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY
    
    const currentMode = GAME_MODES[mode]
    const buttonCount = currentMode.outcomes
    const totalWidth = buttonCount * BUTTON_WIDTH + (buttonCount - 1) * BUTTON_SPACING
    const startX = (CANVAS_WIDTH - totalWidth) / 2
    const startY = (CANVAS_HEIGHT - BUTTON_HEIGHT) / 2
    
    let hoveredButton = null
    for (let i = 0; i < buttonCount; i++) {
      const buttonX = startX + i * (BUTTON_WIDTH + BUTTON_SPACING)
      const buttonY = startY
      
      if (x >= buttonX && x <= buttonX + BUTTON_WIDTH && 
          y >= buttonY && y <= buttonY + BUTTON_HEIGHT) {
        hoveredButton = i
        break
      }
    }
    
    setHoverButton(hoveredButton)
  }

  // Calculate pool restrictions
  const maxMultiplier = React.useMemo(() => {
    if (!pool?.maxPayout || !initialWager || initialWager === 0) {
      return 100
    }
    
    const calculatedMax = pool.maxPayout / initialWager
    return Math.min(calculatedMax * 0.9, 100)
  }, [pool?.maxPayout, initialWager])

  // Game statistics
  const winRate = gameCount > 0 ? (winCount / gameCount) * 100 : 0
  const gameMeta = useGameMeta('doubleornothing-v2')

  // Play function
  const play = async () => {
    if (selectedButton === null) return
    
    setInProgress(true)
    setGameState('playing')
    
    try {
      sounds.play('play')
      
      const betArray = BET_ARRAYS_V2['doubleornothing-v2'].calculateBetArray(mode)
      await game.play({ wager: initialWager, bet: betArray })
      const result = await game.result()

      const win = result.payout > 0
      setLastPayout(win ? result.payout : null)
      
      // Update statistics
      setGameCount(prev => prev + 1)
      if (win) {
        setWinCount(prev => prev + 1)
        setTotalProfit(prev => prev + (result.payout - initialWager))
      } else {
        setLossCount(prev => prev + 1)
        setTotalProfit(prev => prev - initialWager)
      }
      
      // Start revealing animation
      setGameState('revealing')
      setWinningButton(win ? GAME_MODES[mode].outcomes - 1 : selectedButton)
      
      // Animate reveal
      let progress = 0
      const revealInterval = setInterval(() => {
        progress += REVEAL_ANIMATION_SPEED
        setRevealProgress(progress)
        
        if (progress >= 1) {
          clearInterval(revealInterval)
          setGameState(win ? 'win' : 'lose')
          
          // Play appropriate sound
          if (win) {
            sounds.play('double')
            effectsRef.current?.triggerWin()
            // Create win particles
            createParticles(
              CANVAS_WIDTH / 2, 
              CANVAS_HEIGHT / 2, 
              GAME_MODES[mode].color, 
              100
            )
          } else {
            sounds.play('nothing')
            effectsRef.current?.triggerLoss()
            // Create lose particles
            createParticles(
              CANVAS_WIDTH / 2, 
              CANVAS_HEIGHT / 2, 
              ROMANTIC_COLORS.nothing, 
              50
            )
          }
          
          // Reset after delay
          setTimeout(() => {
            setGameState('idle')
            setSelectedButton(null)
            setWinningButton(null)
            setRevealProgress(0)
            setInProgress(false)
          }, 3000)
        }
      }, 100)
      
    } catch (error) {
      console.error('Game error:', error)
      setGameState('idle')
      setSelectedButton(null)
      setInProgress(false)
      setLastPayout(null)
    }
  }

  const resetGame = () => {
    setGameState('idle')
    setSelectedButton(null)
    setWinningButton(null)
    setRevealProgress(0)
    setInProgress(false)
    setLastPayout(null)
    particlesRef.current = []
  }

  // Cleanup
  React.useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const isPlaying = inProgress || gamba.isPlaying
  const canPlay = !isPlaying && initialWager > 0

  return (
    <>
      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <GameplayFrame ref={effectsRef}>
      {/* Game Stats Header */}
      <GameStatsHeader
        gameName="Double or Nothing"
        gameMode={GAME_MODES[mode].label}
        rtp="94%"
        stats={{
          gamesPlayed: gameCount,
          wins: winCount,
          losses: lossCount,
          sessionProfit: totalProfit,
          bestWin: lastPayout || 0
        }}
      />

      {/* Canvas Game Area */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '600px',
        background: ROMANTIC_COLORS.background,
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <canvas 
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMove}
          onMouseLeave={() => setHoverButton(null)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            background: ROMANTIC_COLORS.background,
            cursor: gameState === 'idle' && !isPlaying ? 'pointer' : 'default'
          }}
        />
        
        {/* Game Result Overlay */}
        {(gameState === 'win' || gameState === 'lose') && !isPlaying && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.9)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            color: gameState === 'win' ? GAME_MODES[mode].color : ROMANTIC_COLORS.nothing,
            border: `2px solid ${gameState === 'win' ? GAME_MODES[mode].color : ROMANTIC_COLORS.nothing}`,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
              {gameState === 'win' ? `${GAME_MODES[mode].winLabel} 🎉` : 'Nothing 💸'}
            </div>
            {lastPayout && (
              <div style={{ fontSize: '18px', color: ROMANTIC_COLORS.gold, fontWeight: 'bold' }}>
                Won: <TokenValue amount={lastPayout} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Game Controls */}
      <GameControlsSection>
        {isMobile ? (
          <MobileControls
            wager={initialWager}
            setWager={setInitialWager}
            onPlay={() => {}} // Handled by canvas clicks
            playDisabled={true} // Always disabled, use canvas
            playText="Click buttons above"
          >
            {/* Mode Selector */}
            <div style={{ 
              background: 'rgba(212, 165, 116, 0.1)', 
              borderRadius: '8px', 
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ color: ROMANTIC_COLORS.light, fontWeight: 'bold' }}>
                  Game Mode
                </span>
                <span style={{ color: ROMANTIC_COLORS.gold, fontSize: '18px', fontWeight: 'bold' }}>
                  {GAME_MODES[mode].label}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {GAME_MODES.map((gameMode, index) => (
                  <button
                    key={index}
                    onClick={() => !isPlaying && setMode(index)}
                    disabled={isPlaying}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      border: `2px solid ${mode === index ? gameMode.color : 'transparent'}`,
                      background: mode === index ? gameMode.color + '20' : ROMANTIC_COLORS.dark,
                      color: ROMANTIC_COLORS.light,
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: isPlaying ? 'not-allowed' : 'pointer',
                      opacity: isPlaying ? 0.5 : 1
                    }}
                  >
                    {gameMode.label}
                  </button>
                ))}
              </div>
            </div>
          </MobileControls>
        ) : (
          <DesktopControls
            wager={initialWager}
            setWager={setInitialWager}
            onPlay={() => {}} // Handled by canvas clicks
            playDisabled={true} // Always disabled, use canvas
            playText="Click buttons above"
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Mode Selector */}
              <div style={{ 
                background: 'rgba(212, 165, 116, 0.1)', 
                borderRadius: '8px', 
                padding: '12px',
                minWidth: '200px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: ROMANTIC_COLORS.light, fontSize: '14px', fontWeight: 'bold' }}>
                    Mode
                  </span>
                  <span style={{ color: ROMANTIC_COLORS.gold, fontSize: '16px', fontWeight: 'bold' }}>
                    {GAME_MODES[mode].label}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {GAME_MODES.map((gameMode, index) => (
                    <button
                      key={index}
                      onClick={() => !isPlaying && setMode(index)}
                      disabled={isPlaying}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: '4px',
                        border: `2px solid ${mode === index ? gameMode.color : 'transparent'}`,
                        background: mode === index ? gameMode.color + '20' : ROMANTIC_COLORS.dark,
                        color: ROMANTIC_COLORS.light,
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: isPlaying ? 'not-allowed' : 'pointer',
                        opacity: isPlaying ? 0.5 : 1
                      }}
                    >
                      {gameMode.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {gameState !== 'idle' && (
                <EnhancedButton onClick={resetGame}>
                  Reset
                </EnhancedButton>
              )}
            </div>
          </DesktopControls>
        )}
      </GameControlsSection>
    </GameplayFrame>
        </GambaUi.Responsive>
      </GambaUi.Portal>
      
      <GambaUi.Portal target="controls">
        <EnhancedWagerInput 
          value={initialWager} 
          onChange={setInitialWager}
          disabled={isPlaying}
        />
        <EnhancedPlayButton
          onClick={play}
          disabled={!canPlay}
        >
          {isPlaying ? 'Playing...' : 'Play'}
        </EnhancedPlayButton>
        {gameState !== 'idle' && (
          <EnhancedPlayButton onClick={resetGame}>
            Reset
          </EnhancedPlayButton>
        )}
      </GambaUi.Portal>
    </>
  )
}