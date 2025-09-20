import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { EnhancedWagerInput, EnhancedPlayButton, EnhancedButton, MobileControls, DesktopControls } from '../../components'
import { useGameMeta } from '../useGameMeta'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { MINE_SELECT } from './constants'

export default function Mines3D() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [wager, setWager] = useWagerInput()
  const { mobile: isMobile } = useIsCompact()
  const effectsRef = React.useRef<GameplayEffectsRef>(null)

  // Game state - SAME AS 2D
  const [mineCount, setMineCount] = React.useState(3)
  const [started, setStarted] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [totalGain, setTotalGain] = React.useState(0)

  // Game statistics tracking
  const [gameStats, setGameStats] = React.useState({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    sessionProfit: 0,
    bestWin: 0
  })

  const handleResetStats = () => {
    setGameStats({
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      sessionProfit: 0,
      bestWin: 0
    })
  }

  // DISABLED functions for 3D mode
  const startGame = () => {
    console.log('💣 3D Mines - Coming Soon! This mode is not yet available.')
  }

  const endGame = () => {
    console.log('💣 3D Mines - Coming Soon! This mode is not yet available.')
  }

  // Helper calculations
  const maxPayout = pool?.maxPayout || 0
  const maxMultiplier = 100 // Simplified for 3D
  const poolExceeded = wager * maxMultiplier > maxPayout

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Mines"
          gameMode="3D Mode (Coming Soon)"
          rtp="95"
          stats={gameStats}
          onReset={handleResetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 3D Mode Coming Soon Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            backdropFilter: 'blur(5px)',
          }}>
            <div style={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}>
              💣 3D Mode<br />
              <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>Coming Soon!</span>
            </div>
          </div>

          <GameplayFrame
            ref={effectsRef}
            {...(useGameMeta('mines') && { 
              title: useGameMeta('mines')!.name, 
              description: useGameMeta('mines')!.description 
            })}
          >
            {/* Game grid placeholder */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gridTemplateRows: 'repeat(5, 1fr)',
              gap: '8px',
              width: '300px',
              height: '300px',
              padding: '20px',
              opacity: 0.3
            }}>
              {Array.from({ length: 25 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(147, 88, 255, 0.2)',
                    border: '2px solid rgba(147, 88, 255, 0.4)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.5rem'
                  }}
                >
                  ?
                </div>
              ))}
            </div>
          </GameplayFrame>
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        {/* EXACT SAME CONTROLS AS 2D BUT DISABLED */}
        {!started ? (
          <>
            <MobileControls
              wager={wager}
              setWager={setWager}
              onPlay={startGame}
              playDisabled={true}
              playText="Coming Soon"
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ color: '#fff', minWidth: '60px' }}>Mines:</label>
                <select
                  value={mineCount}
                  onChange={(e) => setMineCount(Number(e.target.value))}
                  disabled={true}
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
              playDisabled={true}
              playText="Coming Soon"
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
                  disabled={true}
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
              <EnhancedPlayButton onClick={startGame} wager={wager} disabled={true}>
                Coming Soon
              </EnhancedPlayButton>
            </DesktopControls>
          </>
        ) : (
          <>
            <MobileControls
              wager={wager}
              setWager={setWager}
              onPlay={endGame}
              playDisabled={true}
              playText="Coming Soon"
            >
              {started && totalGain > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <EnhancedButton 
                    onClick={endGame} 
                    disabled={true} 
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
              playDisabled={true}
              playText="Coming Soon"
            >
              {started && totalGain > 0 && (
                <EnhancedButton 
                  onClick={endGame} 
                  disabled={true} 
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