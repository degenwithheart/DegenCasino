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
  SOUND_WIN, SOUND_LOSE, SOUND_PLAY, SOUND_GALLOP, SOUND_FINISH,
  CANVAS_WIDTH, CANVAS_HEIGHT, TRACK_WIDTH, TRACK_HEIGHT, TRACK_PADDING,
  LANE_HEIGHT, LANE_SPACING, HORSE_WIDTH, HORSE_HEIGHT, HORSE_SPEED_BASE,
  HORSE_SPEED_VARIANCE, FINISH_LINE_OFFSET, ROMANTIC_COLORS, HORSES,
  TRACK_SURFACES, PARTICLE_COUNT, PARTICLE_SPEED, PARTICLE_SIZE,
  ANIMATION_DURATION, GALLOP_ANIMATION_SPEED, DUST_PARTICLE_COUNT
} from './constants'
import type { RaceState } from './constants'

interface HorsePosition {
  x: number
  y: number
  speed: number
  lane: number
  finished: boolean
  finishTime: number
  gallopFrame: number
}

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

export default function FancyVirtualHorseRacingV2() {
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
    gallop: SOUND_GALLOP,
    finish: SOUND_FINISH,
  })

  // Canvas ref
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const animationRef = React.useRef<number>()
  const particlesRef = React.useRef<Particle[]>([])
  
  // Game state
  const [raceState, setRaceState] = React.useState<RaceState>('betting')
  const [selectedHorse, setSelectedHorse] = React.useState<number | null>(null)
  const [horsePositions, setHorsePositions] = React.useState<HorsePosition[]>([])
  const [winner, setWinner] = React.useState<number | null>(null)
  const [raceProgress, setRaceProgress] = React.useState(0)
  const [inProgress, setInProgress] = React.useState(false)
  const [lastPayout, setLastPayout] = React.useState<number | null>(null)
  const [gameCount, setGameCount] = React.useState(0)
  const [winCount, setWinCount] = React.useState(0)
  const [lossCount, setLossCount] = React.useState(0)
  const [totalProfit, setTotalProfit] = React.useState(0)
  const [hoverHorse, setHoverHorse] = React.useState<number | null>(null)

  // Get current balance for stats
  const currentBalance = React.useMemo(() => {
    return pool?.liquidity ? Number(pool.liquidity) : 0
  }, [pool])

  // Initialize horse positions
  React.useEffect(() => {
    const positions: HorsePosition[] = HORSES.map((_, index) => ({
      x: TRACK_PADDING,
      y: TRACK_PADDING + index * (LANE_HEIGHT + LANE_SPACING) + LANE_HEIGHT / 2,
      speed: HORSE_SPEED_BASE + Math.random() * HORSE_SPEED_VARIANCE,
      lane: index,
      finished: false,
      finishTime: 0,
      gallopFrame: Math.random() * Math.PI * 2
    }))
    setHorsePositions(positions)
  }, [])

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
    
    // Add grass texture around track
    ctx.fillStyle = ROMANTIC_COLORS.grass
    ctx.fillRect(0, 0, CANVAS_WIDTH, TRACK_PADDING)
    ctx.fillRect(0, TRACK_PADDING + TRACK_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT - TRACK_PADDING - TRACK_HEIGHT)
  }

  const drawTrack = (ctx: CanvasRenderingContext2D) => {
    // Draw track background
    ctx.fillStyle = ROMANTIC_COLORS.track
    ctx.fillRect(TRACK_PADDING, TRACK_PADDING, TRACK_WIDTH, TRACK_HEIGHT)
    
    // Draw lane dividers
    ctx.strokeStyle = ROMANTIC_COLORS.light + '40'
    ctx.lineWidth = 1
    
    for (let i = 1; i < HORSES.length; i++) {
      const y = TRACK_PADDING + i * (LANE_HEIGHT + LANE_SPACING)
      ctx.beginPath()
      ctx.moveTo(TRACK_PADDING, y)
      ctx.lineTo(TRACK_PADDING + TRACK_WIDTH, y)
      ctx.stroke()
    }
    
    // Draw start line
    ctx.strokeStyle = ROMANTIC_COLORS.light
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(TRACK_PADDING, TRACK_PADDING)
    ctx.lineTo(TRACK_PADDING, TRACK_PADDING + TRACK_HEIGHT)
    ctx.stroke()
    
    // Draw finish line
    const finishLineX = TRACK_PADDING + TRACK_WIDTH - FINISH_LINE_OFFSET
    ctx.strokeStyle = ROMANTIC_COLORS.gold
    ctx.lineWidth = 4
    ctx.setLineDash([10, 10])
    ctx.beginPath()
    ctx.moveTo(finishLineX, TRACK_PADDING)
    ctx.lineTo(finishLineX, TRACK_PADDING + TRACK_HEIGHT)
    ctx.stroke()
    ctx.setLineDash([])
    
    // Draw checkered pattern on finish line
    const checkerSize = 10
    for (let y = TRACK_PADDING; y < TRACK_PADDING + TRACK_HEIGHT; y += checkerSize) {
      for (let x = finishLineX - 5; x < finishLineX + 5; x += checkerSize) {
        const isBlack = ((x - finishLineX + 5) / checkerSize + (y - TRACK_PADDING) / checkerSize) % 2 < 1
        ctx.fillStyle = isBlack ? '#000000' : '#ffffff'
        ctx.fillRect(x, y, checkerSize, checkerSize)
      }
    }
  }

  const drawHorses = (ctx: CanvasRenderingContext2D) => {
    horsePositions.forEach((horse, index) => {
      const horseData = HORSES[index]
      const isSelected = selectedHorse === index
      const isHovered = hoverHorse === index
      const isWinner = winner === index
      
      // Draw selection highlight
      if (isSelected || isHovered) {
        ctx.fillStyle = isSelected ? ROMANTIC_COLORS.gold + '40' : ROMANTIC_COLORS.light + '20'
        ctx.fillRect(
          horse.x - HORSE_WIDTH / 2 - 5,
          horse.y - LANE_HEIGHT / 2,
          HORSE_WIDTH + 10,
          LANE_HEIGHT
        )
      }
      
      // Draw winner glow
      if (isWinner && raceState === 'finished') {
        ctx.shadowColor = ROMANTIC_COLORS.gold
        ctx.shadowBlur = 20
      }
      
      // Draw horse body (simplified representation)
      ctx.fillStyle = horseData.color
      ctx.fillRect(
        horse.x - HORSE_WIDTH / 2,
        horse.y - HORSE_HEIGHT / 2,
        HORSE_WIDTH,
        HORSE_HEIGHT
      )
      
      // Draw galloping animation (legs)
      const gallopOffset = Math.sin(horse.gallopFrame) * 3
      ctx.fillStyle = horseData.color
      // Front legs
      ctx.fillRect(horse.x + HORSE_WIDTH / 4, horse.y + HORSE_HEIGHT / 2, 3, 8 + gallopOffset)
      // Back legs  
      ctx.fillRect(horse.x - HORSE_WIDTH / 4, horse.y + HORSE_HEIGHT / 2, 3, 8 - gallopOffset)
      
      // Reset shadow
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      
      // Draw horse number
      ctx.fillStyle = ROMANTIC_COLORS.light
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText((index + 1).toString(), horse.x, horse.y + 5)
      
      // Draw dust particles when racing
      if (raceState === 'racing' && !horse.finished) {
        createParticles(
          horse.x - HORSE_WIDTH / 2,
          horse.y + HORSE_HEIGHT / 2,
          ROMANTIC_COLORS.dirt,
          2
        )
      }
    })
    
    ctx.textAlign = 'left'
  }

  const drawHorseInfo = (ctx: CanvasRenderingContext2D) => {
    // Draw horse selection panel
    const panelX = TRACK_PADDING + TRACK_WIDTH + 20
    const panelY = TRACK_PADDING
    const panelWidth = CANVAS_WIDTH - panelX - 20
    const panelHeight = TRACK_HEIGHT
    
    // Panel background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight)
    
    // Panel title
    ctx.fillStyle = ROMANTIC_COLORS.gold
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Select Your Horse', panelX + panelWidth / 2, panelY + 30)
    
    // Horse list
    HORSES.forEach((horse, index) => {
      const y = panelY + 50 + index * 60
      const isSelected = selectedHorse === index
      const isHovered = hoverHorse === index
      
      // Horse item background
      if (isSelected || isHovered) {
        ctx.fillStyle = isSelected ? ROMANTIC_COLORS.gold + '20' : ROMANTIC_COLORS.light + '10'
        ctx.fillRect(panelX + 10, y - 25, panelWidth - 20, 50)
      }
      
      // Horse color indicator
      ctx.fillStyle = horse.color
      ctx.fillRect(panelX + 20, y - 15, 20, 20)
      
      // Horse info
      ctx.fillStyle = ROMANTIC_COLORS.light
      ctx.font = 'bold 14px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(`${index + 1}. ${horse.name}`, panelX + 50, y - 5)
      
      ctx.font = '12px Arial'
      ctx.fillStyle = ROMANTIC_COLORS.gold
      ctx.fillText(`${horse.odds} ${horse.emoji}`, panelX + 50, y + 10)
    })
    
    ctx.textAlign = 'left'
  }

  const drawRaceInfo = (ctx: CanvasRenderingContext2D) => {
    // Race state indicator
    let statusText = ''
    let statusColor = ROMANTIC_COLORS.light
    
    switch (raceState) {
      case 'betting':
        statusText = 'Select a horse to bet on'
        statusColor = ROMANTIC_COLORS.gold
        break
      case 'starting':
        statusText = 'Horses are lining up...'
        statusColor = ROMANTIC_COLORS.purple
        break
      case 'racing':
        statusText = 'And they\'re off!'
        statusColor = ROMANTIC_COLORS.crimson
        break
      case 'finished':
        if (winner !== null) {
          statusText = `${HORSES[winner].name} wins! ${HORSES[winner].emoji}`
          statusColor = HORSES[winner].color
        }
        break
      case 'celebrating':
        statusText = selectedHorse === winner ? 'You won! 🎉' : 'Better luck next time'
        statusColor = selectedHorse === winner ? ROMANTIC_COLORS.gold : ROMANTIC_COLORS.nothing
        break
    }
    
    // Status background
    const textWidth = ctx.measureText(statusText).width
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.fillRect(CANVAS_WIDTH / 2 - textWidth / 2 - 20, 20, textWidth + 40, 50)
    
    // Status text
    ctx.fillStyle = statusColor
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(statusText, CANVAS_WIDTH / 2, 50)
    ctx.textAlign = 'left'
    
    // Progress bar for race
    if (raceState === 'racing') {
      const progressBarWidth = 300
      const progressBarHeight = 10
      const progressX = (CANVAS_WIDTH - progressBarWidth) / 2
      const progressY = CANVAS_HEIGHT - 100
      
      // Progress background
      ctx.fillStyle = ROMANTIC_COLORS.dark
      ctx.fillRect(progressX, progressY, progressBarWidth, progressBarHeight)
      
      // Progress fill
      ctx.fillStyle = ROMANTIC_COLORS.gold
      ctx.fillRect(progressX, progressY, progressBarWidth * raceProgress, progressBarHeight)
      
      // Progress text
      ctx.fillStyle = ROMANTIC_COLORS.light
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`Race Progress: ${Math.round(raceProgress * 100)}%`, CANVAS_WIDTH / 2, progressY - 10)
    }
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
    
    // Draw track
    drawTrack(ctx)
    
    // Draw horses
    drawHorses(ctx)
    
    // Draw horse info panel (only during betting)
    if (raceState === 'betting') {
      drawHorseInfo(ctx)
    }
    
    // Draw race info
    drawRaceInfo(ctx)
    
    // Draw particles
    drawParticles(ctx)
  }

  // Animation loop
  React.useEffect(() => {
    const animate = () => {
      // Update horse gallop animations
      setHorsePositions(prev => prev.map(horse => ({
        ...horse,
        gallopFrame: horse.gallopFrame + GALLOP_ANIMATION_SPEED
      })))
      
      drawCanvas()
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [raceState, selectedHorse, horsePositions, winner, raceProgress, hoverHorse])

  // Handle canvas clicks
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (raceState !== 'betting' || inProgress) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH / rect.width
    const scaleY = CANVAS_HEIGHT / rect.height
    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY
    
    // Check if clicking on horse info panel
    const panelX = TRACK_PADDING + TRACK_WIDTH + 20
    const panelY = TRACK_PADDING
    const panelWidth = CANVAS_WIDTH - panelX - 20
    
    if (x >= panelX && x <= panelX + panelWidth) {
      // Check which horse was clicked
      for (let i = 0; i < HORSES.length; i++) {
        const horseY = panelY + 50 + i * 60
        if (y >= horseY - 25 && y <= horseY + 25) {
          setSelectedHorse(i)
          play()
          break
        }
      }
    }
  }

  // Handle canvas hover
  const handleCanvasMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (raceState !== 'betting') {
      setHoverHorse(null)
      return
    }
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH / rect.width
    const scaleY = CANVAS_HEIGHT / rect.height
    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY
    
    // Check if hovering over horse info panel
    const panelX = TRACK_PADDING + TRACK_WIDTH + 20
    const panelY = TRACK_PADDING
    const panelWidth = CANVAS_WIDTH - panelX - 20
    
    if (x >= panelX && x <= panelX + panelWidth) {
      let hoveredHorse = null
      for (let i = 0; i < HORSES.length; i++) {
        const horseY = panelY + 50 + i * 60
        if (y >= horseY - 25 && y <= horseY + 25) {
          hoveredHorse = i
          break
        }
      }
      setHoverHorse(hoveredHorse)
    } else {
      setHoverHorse(null)
    }
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
  const gameMeta = useGameMeta('fancyvirtualhorseracing-v2')

  // Play function
  const play = async () => {
    if (selectedHorse === null) return
    
    setInProgress(true)
    setRaceState('starting')
    
    try {
      sounds.play('play')
      
      const betArray = BET_ARRAYS_V2['fancyvirtualhorseracing-v2'].calculateBetArray()
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
      
      // Determine winner based on result
      const winnerIndex = win ? selectedHorse : (selectedHorse + 1) % HORSES.length
      setWinner(winnerIndex)
      
      // Start race animation
      setTimeout(() => {
        setRaceState('racing')
        sounds.play('gallop')
        
        // Animate race
        const raceInterval = setInterval(() => {
          setRaceProgress(prev => {
            const newProgress = prev + 0.02
            
            // Update horse positions
            setHorsePositions(prevPositions => 
              prevPositions.map((horse, index) => {
                if (horse.finished) return horse
                
                const targetX = TRACK_PADDING + TRACK_WIDTH - FINISH_LINE_OFFSET
                const distanceToFinish = targetX - horse.x
                
                if (distanceToFinish <= 0) {
                  return {
                    ...horse,
                    x: targetX,
                    finished: true,
                    finishTime: Date.now()
                  }
                }
                
                // Winner gets slight speed boost near the end
                let speed = horse.speed
                if (index === winnerIndex && newProgress > 0.7) {
                  speed *= 1.2
                }
                
                return {
                  ...horse,
                  x: horse.x + speed
                }
              })
            )
            
            if (newProgress >= 1) {
              clearInterval(raceInterval)
              setRaceState('finished')
              sounds.play('finish')
              
              // Show celebration
              setTimeout(() => {
                setRaceState('celebrating')
                
                if (win) {
                  effectsRef.current?.triggerWin()
                  createParticles(
                    CANVAS_WIDTH / 2,
                    CANVAS_HEIGHT / 2,
                    HORSES[winnerIndex].color,
                    100
                  )
                } else {
                  effectsRef.current?.triggerLoss()
                }
                
                // Reset after celebration
                setTimeout(() => {
                  resetRace()
                }, 3000)
              }, 1000)
            }
            
            return newProgress
          })
        }, 100)
      }, 2000) // 2 second delay for starting
      
    } catch (error) {
      console.error('Game error:', error)
      resetRace()
    }
  }

  const resetRace = () => {
    setRaceState('betting')
    setSelectedHorse(null)
    setWinner(null)
    setRaceProgress(0)
    setInProgress(false)
    setLastPayout(null)
    particlesRef.current = []
    
    // Reset horse positions
    const positions: HorsePosition[] = HORSES.map((_, index) => ({
      x: TRACK_PADDING,
      y: TRACK_PADDING + index * (LANE_HEIGHT + LANE_SPACING) + LANE_HEIGHT / 2,
      speed: HORSE_SPEED_BASE + Math.random() * HORSE_SPEED_VARIANCE,
      lane: index,
      finished: false,
      finishTime: 0,
      gallopFrame: Math.random() * Math.PI * 2
    }))
    setHorsePositions(positions)
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
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Virtual Horse Racing"
          gameMode="V2"
          rtp="95"
          stats={{
            gamesPlayed: gameCount,
            wins: winCount,
            losses: lossCount,
            sessionProfit: totalProfit,
            bestWin: lastPayout || 0
          }}
          onReset={() => {
            setGameCount(0)
            setWinCount(0)
            setLossCount(0)
            setTotalProfit(0)
            setLastPayout(null)
          }}
        />
      </GambaUi.Portal>
      
      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <GameplayFrame ref={effectsRef}>
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <canvas 
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMove}
            onMouseLeave={() => setHoverHorse(null)}
            style={{
              border: `2px solid ${ROMANTIC_COLORS.gold}`,
              borderRadius: '8px',
              background: ROMANTIC_COLORS.background,
              cursor: raceState === 'betting' && !isPlaying ? 'pointer' : 'default'
            }}
        />
        
        {/* Game Result Overlay */}
        {raceState === 'celebrating' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.9)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            color: selectedHorse === winner ? ROMANTIC_COLORS.gold : ROMANTIC_COLORS.nothing,
            border: `2px solid ${selectedHorse === winner ? ROMANTIC_COLORS.gold : ROMANTIC_COLORS.nothing}`,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
              {selectedHorse === winner ? '🏆 You Won!' : '💸 Better Luck Next Time'}
            </div>
            {winner !== null && (
              <div style={{ fontSize: '20px', color: ROMANTIC_COLORS.light, marginBottom: '16px' }}>
                Winner: {HORSES[winner].name} {HORSES[winner].emoji}
              </div>
            )}
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
            playText="Select horse above"
          >
            {selectedHorse !== null && (
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
                    Selected Horse
                  </span>
                  <span style={{ color: HORSES[selectedHorse].color, fontSize: '18px', fontWeight: 'bold' }}>
                    {HORSES[selectedHorse].name} {HORSES[selectedHorse].emoji}
                  </span>
                </div>
                <div style={{ color: ROMANTIC_COLORS.gold, fontSize: '14px' }}>
                  Odds: {HORSES[selectedHorse].odds}
                </div>
              </div>
            )}
          </MobileControls>
        ) : (
          <DesktopControls
            wager={initialWager}
            setWager={setInitialWager}
            onPlay={() => {}} // Handled by canvas clicks
            playDisabled={true} // Always disabled, use canvas
            playText="Select horse above"
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              {selectedHorse !== null && (
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
                    marginBottom: '4px'
                  }}>
                    <span style={{ color: ROMANTIC_COLORS.light, fontSize: '14px', fontWeight: 'bold' }}>
                      Selected
                    </span>
                    <span style={{ color: HORSES[selectedHorse].color, fontSize: '16px', fontWeight: 'bold' }}>
                      {HORSES[selectedHorse].name} {HORSES[selectedHorse].emoji}
                    </span>
                  </div>
                  <div style={{ color: ROMANTIC_COLORS.gold, fontSize: '12px' }}>
                    Odds: {HORSES[selectedHorse].odds}
                  </div>
                </div>
              )}
              
              {raceState !== 'betting' && (
                <EnhancedButton onClick={resetRace}>
                  New Race
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
        {isMobile ? (
          <MobileControls
            wager={initialWager}
            setWager={setInitialWager}
            onPlay={play}
            playDisabled={!canPlay}
            playText={isPlaying ? 'Racing...' : 'Start Race'}
          >
            {raceState !== 'betting' && (
              <EnhancedPlayButton onClick={resetRace}>
                New Race
              </EnhancedPlayButton>
            )}
          </MobileControls>
        ) : (
          <DesktopControls
            wager={initialWager}
            setWager={setInitialWager}
            onPlay={play}
            playDisabled={!canPlay}
            playText={isPlaying ? 'Racing...' : 'Start Race'}
          >
            {raceState !== 'betting' && (
              <EnhancedPlayButton onClick={resetRace}>
                New Race
              </EnhancedPlayButton>
            )}
          </DesktopControls>
        )}
      </GambaUi.Portal>
    </>
  )
}