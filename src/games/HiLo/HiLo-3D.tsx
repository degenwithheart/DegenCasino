import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { EnhancedWagerInput, EnhancedButton, EnhancedPlayButton, MobileControls, DesktopControls, SwitchControl } from '../../components'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import { useGameStats } from '../../hooks/game/useGameStats'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { MAX_CARD_SHOWN, RANKS, RANK_SYMBOLS } from './constants'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { StyledHiLoBackground } from './HiLoBackground.enhanced.styles'

export default function HiLo3D() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [initialWager, setInitialWager] = useWagerInput()
  const { settings } = useGraphics()
  const { mobile: isMobile } = useIsCompact()
  const effectsRef = React.useRef<GameplayEffectsRef>(null)

  // Game state - SAME AS 2D
  const [claiming, setClaiming] = React.useState(false)
  const [profit, setProfit] = React.useState(0)
  const [option, setOption] = React.useState<'hi' | 'lo'>('hi')
  const [hoveredOption, hoverOption] = React.useState<'hi' | 'lo'>()
  const [inProgress, setInProgress] = React.useState(false)
  const [currentBalance, setCurrentBalance] = React.useState(0)
  const [totalProfit, setTotalProfit] = React.useState(0)
  const [handCount, setHandCount] = React.useState(0)
  const [progressive, setProgressive] = React.useState(true) // Toggle between normal and progressive modes

  // Game statistics tracking - using centralized hook
  const gameStats = useGameStats('hilo')

  // DISABLED functions for 3D mode
  const handleStart = () => {
    console.log('🃏 3D HiLo - Coming Soon! This mode is not yet available.')
  }

  const play = () => {
    console.log('🃏 3D HiLo - Coming Soon! This mode is not yet available.')
  }

  const handleCashOut = () => {
    console.log('🃏 3D HiLo - Coming Soon! This mode is not yet available.')
  }

  // Helper calculations
  const maxWagerForBet = pool?.maxPayout ? Math.floor(pool.maxPayout / 2) : 0
  const maxMultiplier = 2 // Simplified for 3D

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="HiLo"
          gameMode="3D Mode (Coming Soon)"
          rtp="95"
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <StyledHiLoBackground>
          <GameplayFrame 
            ref={effectsRef}
            {...(useGameMeta('hilo') && { 
              title: useGameMeta('hilo')!.name, 
              description: useGameMeta('hilo')!.description 
            })}
          >
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

            <GambaUi.Responsive>
              {/* Game content placeholder */}
              <div style={{ 
                padding: '2rem',
                textAlign: 'center',
                color: 'white',
                opacity: 0.3
              }}>
                <h2>HiLo Card Game</h2>
                <p>Guess if the next card will be higher or lower</p>
                
                {/* Option buttons - DISABLED */}
                <div style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  justifyContent: 'center',
                  marginTop: '2rem'
                }}>
                  <EnhancedButton
                    onClick={() => setOption('hi')}
                    variant={option === 'hi' ? 'primary' : 'secondary'}
                    disabled={true}
                  >
                    Higher ⬆️
                  </EnhancedButton>
                  <EnhancedButton
                    onClick={() => setOption('lo')}
                    variant={option === 'lo' ? 'primary' : 'secondary'}
                    disabled={true}
                  >
                    Lower ⬇️
                  </EnhancedButton>
                </div>
              </div>
            </GambaUi.Responsive>
          </GameplayFrame>
        </StyledHiLoBackground>
      </GambaUi.Portal>
      
      <GambaUi.Portal target="controls">
        {/* EXACT SAME CONTROLS AS 2D BUT DISABLED */}
        {!inProgress ? (
          <>
            <MobileControls
              wager={initialWager}
              setWager={setInitialWager}
              onPlay={handleStart}
              playDisabled={true}
              playText="Coming Soon"
            >
              <SwitchControl
                label="Progressive Mode"
                checked={progressive}
                onChange={setProgressive}
                disabled={true}
              />
            </MobileControls>
            
            <DesktopControls
              wager={initialWager}
              setWager={setInitialWager}
              onPlay={handleStart}
              playDisabled={true}
              playText="Coming Soon"
            >
              <EnhancedWagerInput
                value={initialWager}
                onChange={setInitialWager}
                multiplier={maxMultiplier}
              />
              <div>Progressive:</div>
              <GambaUi.Switch
                checked={progressive}
                onChange={setProgressive}
                disabled={true}
              />
              <EnhancedPlayButton disabled={true} onClick={handleStart}>
                Coming Soon
              </EnhancedPlayButton>
              {initialWager > maxWagerForBet && (
                <EnhancedButton onClick={() => setInitialWager(maxWagerForBet)} disabled={true}>
                  Set max
                </EnhancedButton>
              )}
            </DesktopControls>
          </>
        ) : (
          <>
            <MobileControls
              wager={initialWager}
              setWager={setInitialWager}
              onPlay={progressive ? play : handleStart}
              playDisabled={true}
              playText="Coming Soon"
            />
            
            <DesktopControls
              wager={initialWager}
              setWager={setInitialWager}
              onPlay={progressive ? play : handleStart}
              playDisabled={true}
              playText="Coming Soon"
            >
              <EnhancedWagerInput
                value={initialWager}
                onChange={setInitialWager}
                disabled={true}
                multiplier={maxMultiplier}
              />
              <TokenValue amount={currentBalance} />
              {progressive && (
                <EnhancedButton disabled={true} onClick={handleCashOut}>
                  Cash Out
                </EnhancedButton>
              )}
              <EnhancedPlayButton disabled={true} onClick={progressive ? play : handleStart}>
                Coming Soon
              </EnhancedPlayButton>
            </DesktopControls>
          </>
        )}
      </GambaUi.Portal>
    </>
  )
}