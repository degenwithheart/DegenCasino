import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { GambaUi, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React, { useRef, useState, useCallback, useEffect } from 'react'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, DesktopControls, GameControlsSection } from '../../components'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'

// --- GAME CONFIGURATION CONSTANTS ---

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

// Game-specific constants
const GAME_CONFIG = {
  // Add your game configuration here
  maxMultiplier: 10,
  minBet: 0.01,
  defaultRTP: 0.95,
  animationDuration: 2000,
}

// --- GAME TEMPLATE COMPONENT ---

export default function GameTemplate() {
  // --- CORE HOOKS & INTEGRATIONS ---
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const pool = useCurrentPool()
  const { mobile: isMobile } = useIsCompact()
  const { settings } = useGraphics()
  const game = GambaUi.useGame()
  const effectsRef = useRef<GameplayEffectsRef>(null)
  
  // Sound integration - replace with actual sound paths
  const sounds = useSound({
    win: '/sounds/template/win.mp3',
    play: '/sounds/template/play.mp3',
    lose: '/sounds/template/lose.mp3',
    tick: '/sounds/template/tick.mp3',
  })

  // --- GAME STATE MANAGEMENT ---
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle')
  const [hasPlayed, setHasPlayed] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)
  const [animationStep, setAnimationStep] = useState(0)
  
  // Game statistics tracking
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    sessionProfit: 0,
    bestWin: 0,
    currentStreak: 0,
    bestStreak: 0,
  })

  // --- GAME LOGIC FUNCTIONS ---
  
  /**
   * Main game play function
   * Replace this with your actual game logic
   */
  const play = async () => {
    if (wager <= 0 || gamba.isPlaying) return
    
    try {
      setGameState('playing')
      setHasPlayed(true)
      sounds.play.play()
      
      // Example bet array - replace with your game's bet structure
      // This is a simple 50/50 example with 2x multiplier
      const bet = [0, 2] // [lose, win] - adjust for your game
      
      // Start any animations here
      setAnimationStep(1)
      
      // Execute the game through Gamba
      await game.play({ wager, bet })
      const result = await game.result()
      
      // Process the result
      const isWin = result.payout > 0
      const profit = result.payout - wager
      
      setLastResult(result)
      
      // Update statistics
      setGameStats(prev => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        wins: isWin ? prev.wins + 1 : prev.wins,
        losses: isWin ? prev.losses : prev.losses + 1,
        sessionProfit: prev.sessionProfit + profit,
        bestWin: Math.max(prev.bestWin, profit),
        currentStreak: isWin ? prev.currentStreak + 1 : 0,
        bestStreak: isWin ? Math.max(prev.bestStreak, prev.currentStreak + 1) : prev.bestStreak,
      }))
      
      // Play appropriate sound and trigger effects
      if (isWin) {
        sounds.win.play()
        effectsRef.current?.triggerWin()
      } else {
        sounds.lose.play()
        effectsRef.current?.triggerLoss()
      }
      
      setGameState('finished')
      
    } catch (error) {
      console.error('Game error:', error)
      setGameState('idle')
      // Handle error appropriately
    }
  }

  /**
   * Reset game state for a new round
   */
  const resetGame = () => {
    setHasPlayed(false)
    setGameState('idle')
    setLastResult(null)
    setAnimationStep(0)
  }

  /**
   * Reset game statistics
   */
  const handleResetStats = () => {
    setGameStats({
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      sessionProfit: 0,
      bestWin: 0,
      currentStreak: 0,
      bestStreak: 0,
    })
  }

  // --- CANVAS RENDERING ---
  
  /**
   * Main canvas render function
   * Replace with your custom game graphics
   */
  const renderCanvas = useCallback(({ ctx, size, clock }: any) => {
    // Clear canvas
    ctx.clearRect(0, 0, size.width, size.height)
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, size.width, size.height)
    gradient.addColorStop(0, '#1a1a2e')
    gradient.addColorStop(0.5, '#16213e')
    gradient.addColorStop(1, '#0f0f23')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size.width, size.height)
    
    // Center point
    const centerX = size.width / 2
    const centerY = size.height / 2
    
    // Example: Draw animated elements based on game state
    if (gameState === 'playing') {
      // Draw spinning/animated elements during play
      const rotation = (clock * 0.01) % (Math.PI * 2)
      
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)
      
      // Draw spinning element
      ctx.fillStyle = '#d4a574'
      ctx.fillRect(-30, -30, 60, 60)
      
      ctx.restore()
      
    } else if (gameState === 'finished' && lastResult) {
      // Draw result visualization
      const isWin = lastResult.payout > 0
      
      ctx.fillStyle = isWin ? '#00ff88' : '#ff4444'
      ctx.beginPath()
      ctx.arc(centerX, centerY, 50, 0, Math.PI * 2)
      ctx.fill()
      
      // Result text
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(isWin ? 'WIN!' : 'LOSE', centerX, centerY + 8)
      
    } else {
      // Idle state - draw game preview/instructions
      ctx.fillStyle = 'rgba(212, 165, 116, 0.3)'
      ctx.beginPath()
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#d4a574'
      ctx.font = '18px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Click Play to Start', centerX, centerY + 60)
    }
    
    // Game-specific drawing logic goes here
    // Example: Draw game board, pieces, animations, etc.
    
  }, [gameState, lastResult])

  // --- COMPONENT JSX ---

  return (
    <>
      {/* Game Statistics Portal */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Game Template"
          gameMode="Demo Mode"
          rtp={`${(GAME_CONFIG.defaultRTP * 100).toFixed(1)}%`}
          stats={gameStats}
          onReset={handleResetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      {/* Main Game Screen Portal */}
      <GambaUi.Portal target="screen">
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'linear-gradient(135deg, #0a0511 0%, #0d0618 25%, #0f081c 50%, #0a0511 75%, #0a0511 100%)',
          perspective: '100px'
        }}>
          
          {/* Main Canvas Game Area */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '120px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '2px solid rgba(212, 165, 116, 0.4)',
            boxShadow: '0 4px 20px rgba(10, 5, 17, 0.5)'
          }}>
            <GambaUi.Canvas
              style={{
                width: '100%',
                height: '100%',
                cursor: gameState === 'idle' ? 'pointer' : 'default'
              }}
              render={renderCanvas}
            />
          </div>

          {/* Game Information Overlay */}
          {gameState === 'idle' && (
            <div style={{
              position: 'absolute',
              top: '30px',
              left: '30px',
              background: 'rgba(10, 5, 17, 0.8)',
              padding: '10px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(212, 165, 116, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ color: '#d4a574', fontSize: '14px', marginBottom: '5px' }}>
                Game Template
              </div>
              <div style={{ color: '#ffffff', fontSize: '12px' }}>
                Replace this with your game logic
              </div>
            </div>
          )}

          {/* Result Display */}
          {gameState === 'finished' && lastResult && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: lastResult.payout > 0 ? 
                'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 255, 136, 0.1))' :
                'linear-gradient(135deg, rgba(255, 68, 68, 0.2), rgba(255, 68, 68, 0.1))',
              padding: '20px 30px',
              borderRadius: '15px',
              border: `2px solid ${lastResult.payout > 0 ? '#00ff88' : '#ff4444'}`,
              backdropFilter: 'blur(15px)',
              textAlign: 'center'
            }}>
              <div style={{ 
                color: lastResult.payout > 0 ? '#00ff88' : '#ff4444',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                {lastResult.payout > 0 ? 'YOU WIN!' : 'YOU LOSE'}
              </div>
              {lastResult.payout > 0 && (
                <div style={{ color: '#ffffff', fontSize: '16px' }}>
                  +{(lastResult.payout - wager).toFixed(4)} SOL
                </div>
              )}
            </div>
          )}

          {/* Custom Game Controls Section */}
          <GameControlsSection>
            <div style={{
              flex: '1',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(10, 5, 17, 0.9) 0%, rgba(139, 90, 158, 0.1) 50%, rgba(10, 5, 17, 0.9) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(212, 165, 116, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '8px 16px',
              boxShadow: '0 4px 16px rgba(10, 5, 17, 0.4), inset 0 1px 0 rgba(212, 165, 116, 0.2)',
              backdropFilter: 'blur(10px)',
              position: 'relative'
            }}>
              {/* Add your custom game controls here */}
              <div style={{ color: '#d4a574', marginBottom: '8px', fontSize: '14px' }}>
                Game Controls
              </div>
              <div style={{ color: '#ffffff', fontSize: '12px', textAlign: 'center' }}>
                Add custom controls for your game here
                <br />
                (difficulty, bet options, etc.)
              </div>
              
              {/* Example: Game mode selector */}
              <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                <button style={{
                  padding: '4px 8px',
                  fontSize: '10px',
                  backgroundColor: 'rgba(212, 165, 116, 0.2)',
                  border: '1px solid rgba(212, 165, 116, 0.4)',
                  borderRadius: '4px',
                  color: '#d4a574',
                  cursor: 'pointer'
                }}>
                  Easy
                </button>
                <button style={{
                  padding: '4px 8px',
                  fontSize: '10px',
                  backgroundColor: 'rgba(212, 165, 116, 0.2)',
                  border: '1px solid rgba(212, 165, 116, 0.4)',
                  borderRadius: '4px',
                  color: '#d4a574',
                  cursor: 'pointer'
                }}>
                  Hard
                </button>
              </div>
            </div>
          </GameControlsSection>

          {/* Gameplay Effects Frame */}
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
            {...(useGameMeta('template') && {
              title: useGameMeta('template')!.name,
              description: useGameMeta('template')!.description
            })}
          />
        </div>
      </GambaUi.Portal>

      {/* Game Controls Portal */}
      <GambaUi.Portal target="controls">
        {/* Mobile Controls */}
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={hasPlayed ? resetGame : play}
          playDisabled={gamba.isPlaying}
          playText={
            gamba.isPlaying ? "Playing..." :
            hasPlayed ? "New Game" : 
            "Play"
          }
        />

        {/* Desktop Controls */}
        <DesktopControls
          wager={wager}
          setWager={setWager}
          onPlay={hasPlayed ? resetGame : play}
          playDisabled={gamba.isPlaying}
          playText={
            gamba.isPlaying ? "Playing..." :
            hasPlayed ? "New Game" : 
            "Play"
          }
        >
          <EnhancedWagerInput 
            value={wager} 
            onChange={setWager} 
            multiplier={lastResult ? (lastResult.payout / wager || 0) : 1} 
          />
          <EnhancedPlayButton 
            disabled={gamba.isPlaying} 
            onClick={hasPlayed ? resetGame : play}
          >
            {gamba.isPlaying ? "Playing..." : hasPlayed ? "New Game" : "Play"}
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}

// --- HELPER FUNCTIONS (Add your game-specific helpers here) ---

/**
 * Calculate game probability based on bet array
 */
function calculateProbability(bet: number[]): number {
  const totalOutcomes = bet.length
  const winningOutcomes = bet.filter(payout => payout > 0).length
  return winningOutcomes / totalOutcomes
}

/**
 * Calculate expected RTP for a bet array
 */
function calculateRTP(bet: number[]): number {
  const totalOutcomes = bet.length
  const expectedPayout = bet.reduce((sum, payout) => sum + payout, 0) / totalOutcomes
  return Math.min(expectedPayout, 1) // Cap at 100%
}

/**
 * Format currency display
 */
function formatCurrency(amount: number): string {
  return amount.toFixed(4)
}

// --- EXPORT ---
export default GameTemplate