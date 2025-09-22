import { GambaUi, useSound, useWagerInput, useCurrentPool } from 'gamba-react-ui-v2'
import React from 'react'
import { EnhancedWagerInput, EnhancedPlayButton, EnhancedButton, MobileControls, DesktopControls } from '../../components'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import { useGameStats } from '../../hooks/game/useGameStats'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'

export default function BlackJack3D() {
  const game = GambaUi.useGame()
  const pool = useCurrentPool()
  const [wager, setWager] = useWagerInput()
  const { mobile: isMobile } = useIsCompact()
  const effectsRef = React.useRef<GameplayEffectsRef>(null)

  // Game state - SAME AS 2D
  const [gameState, setGameState] = React.useState<'betting' | 'playing' | 'finished'>('betting')

  // Game statistics tracking - using centralized hook
  const gameStats = useGameStats('blackjack-v2')

  // DISABLED functions for 3D mode
  const startGame = () => {
    console.log('🃏 3D BlackJack - Coming Soon! This mode is not yet available.')
  }

  const hit = () => {
    console.log('🃏 3D BlackJack - Coming Soon! This mode is not yet available.')
  }

  const stand = () => {
    console.log('🃏 3D BlackJack - Coming Soon! This mode is not yet available.')
  }

  const doubleDown = () => {
    console.log('🃏 3D BlackJack - Coming Soon! This mode is not yet available.')
  }

  // Helper calculations
  const maxMultiplier = 2 // Simplified for 3D
  const poolExceeded = wager * maxMultiplier > (pool?.maxPayout || 0)

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="BlackJack"
          gameMode="3D Mode (Coming Soon)"
          rtp="99.5"
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0d4a2d, #1a5c3a)',
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
              🃏 3D Mode<br />
              <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>Coming Soon!</span>
            </div>
          </div>

          <GameplayFrame
            ref={effectsRef}
            {...(useGameMeta('blackjack') && { 
              title: useGameMeta('blackjack')!.name, 
              description: useGameMeta('blackjack')!.description 
            })}
          >
            {/* Game content placeholder */}
            <div style={{
              textAlign: 'center',
              color: 'white',
              opacity: 0.3,
              padding: '2rem'
            }}>
              <h2>BlackJack Table</h2>
              <p>Dealer: [?] [?]</p>
              <p>Player: [?] [?]</p>
              
              {/* Action buttons placeholder - DISABLED */}
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                justifyContent: 'center',
                marginTop: '2rem'
              }}>
                <EnhancedButton onClick={hit} disabled={true}>
                  Hit
                </EnhancedButton>
                <EnhancedButton onClick={stand} disabled={true}>
                  Stand
                </EnhancedButton>
                <EnhancedButton onClick={doubleDown} disabled={true}>
                  Double
                </EnhancedButton>
              </div>
            </div>
          </GameplayFrame>
        </div>
      </GambaUi.Portal>
      
      <GambaUi.Portal target="controls">
        {/* CONTROLS BASED ON GAME STATE BUT DISABLED */}
        {gameState === 'betting' ? (
          <>
            <MobileControls
              wager={wager}
              setWager={setWager}
              onPlay={startGame}
              playDisabled={true}
              playText="Coming Soon"
            />
            
            <DesktopControls
              wager={wager}
              setWager={setWager}
              onPlay={startGame}
              playDisabled={true}
              playText="Coming Soon"
            >
              <EnhancedWagerInput value={wager} onChange={setWager} multiplier={maxMultiplier} />
              <EnhancedPlayButton onClick={startGame} disabled={true}>
                Coming Soon
              </EnhancedPlayButton>
            </DesktopControls>
          </>
        ) : (
          <>
            <MobileControls
              wager={wager}
              setWager={setWager}
              onPlay={startGame}
              playDisabled={true}
              playText="Coming Soon"
            />
            
            <DesktopControls
              wager={wager}
              setWager={setWager}
              onPlay={startGame}
              playDisabled={true}
              playText="Coming Soon"
            >
              <EnhancedButton onClick={hit} disabled={true}>
                Hit
              </EnhancedButton>
              <EnhancedButton onClick={stand} disabled={true}>
                Stand
              </EnhancedButton>
              <EnhancedButton onClick={doubleDown} disabled={true}>
                Double Down
              </EnhancedButton>
            </DesktopControls>
          </>
        )}
      </GambaUi.Portal>
    </>
  )
}