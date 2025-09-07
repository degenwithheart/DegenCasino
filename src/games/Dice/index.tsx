import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import { DICE_CONFIG } from '../rtpConfig'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, DesktopControls } from '../../components'
import Slider from './Slider'
import { SOUND_LOSE, SOUND_PLAY, SOUND_TICK, SOUND_WIN } from './constants'
import { Container, Result, RollUnder, Stats } from './styles'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { StyledDiceBackground } from './DiceBackground.enhanced.styles'

// Use centralized bet array calculation
export const outcomes = (odds: number) => {
  return DICE_CONFIG.calculateBetArray(odds)
}

export default function Dice() {
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const pool = useCurrentPool()
  const [resultIndex, setResultIndex] = React.useState(-1)
  const [rollUnderIndex, setRollUnderIndex] = React.useState(Math.floor(100 / 2))
  
  // Get graphics settings to check if motion is enabled
  const { settings } = useGraphics()
  
  // Add ref for gameplay effects
  const effectsRef = React.useRef<GameplayEffectsRef>(null)
  
  const sounds = useSound({
    win: SOUND_WIN,
    play: SOUND_PLAY,
    lose: SOUND_LOSE,
    tick: SOUND_TICK,
  })

  const odds = Math.floor((rollUnderIndex / 100) * 100)
  const multiplier = Number(BigInt(100 * BPS_PER_WHOLE) / BigInt(rollUnderIndex)) / BPS_PER_WHOLE

  const bet = React.useMemo(() => outcomes(odds), [rollUnderIndex])

  const maxWin = multiplier * wager

  const game = GambaUi.useGame()

  const play = async () => {
    // CRITICAL SECURITY: Prevent zero wager gameplay
    if (wager <= 0) {
      console.error('❌ BLOCKED: Cannot play with zero wager');
      return;
    }
    
    sounds.play('play')

    await game.play({ wager, bet })

    const result = await game.result()

    const win = result.payout > 0

    // Deterministically derive the revealed number from on-chain result index
    // so there is zero client-side influence over outcome presentation.
    // We map the resultIndex into either the winning interval [0, rollUnderIndex)
    // or the losing interval [rollUnderIndex, 100) depending on payout.
    const seed = `${result.resultIndex}:${result.payout}:${result.multiplier}:${rollUnderIndex}`
    const rng = makeDeterministicRng(seed)
    if (win) {
      const span = rollUnderIndex
      const value = Math.floor(rng() * span) // 0 .. rollUnderIndex-1
      setResultIndex(value)
      sounds.play('win')
      
      // 🎉 TRIGGER WIN EFFECTS
      console.log('🎉 WIN! Triggering visual effects')
      effectsRef.current?.winFlash('#00ff00', 1.5) // Green win flash
      effectsRef.current?.particleBurst(50, 30, '#ffd700', 15) // Gold particles from center-top
      
      // Bigger wins get more intense effects
      if (result.multiplier > 5) {
        effectsRef.current?.screenShake(2, 800) // Strong shake for big wins
        effectsRef.current?.particleBurst(25, 50, '#ff6b6b', 8) // Red particles from left
        effectsRef.current?.particleBurst(75, 50, '#4ecdc4', 8) // Cyan particles from right
      } else if (result.multiplier > 2) {
        effectsRef.current?.screenShake(1, 600) // Medium shake
      }
    } else {
      const span = 100 - rollUnderIndex
      const value = rollUnderIndex + Math.floor(rng() * span) // rollUnderIndex .. 99
      setResultIndex(value)
      sounds.play('lose')
      
      // 💥 TRIGGER LOSE EFFECTS
      console.log('💥 LOSE! Triggering lose effects')
      effectsRef.current?.flash('#ff4444', 400) // Red lose flash
      effectsRef.current?.screenShake(0.5, 300) // Light shake for loss
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <StyledDiceBackground>
          {/* Mystical background elements */}
          <div className="mystical-bg-elements" />
          <div className="sacred-overlay" />
          
          <GameplayFrame 
            ref={effectsRef}
            {...(useGameMeta('dice') && { 
              title: useGameMeta('dice')!.name, 
              description: useGameMeta('dice')!.description 
            })}
          >
            <GambaUi.Responsive>
              <div className="dice-redesign">
                {/* Header Stats */}
                <div className="dice-header">
                  <div className="stat-card">
                    <div className="stat-value">{(rollUnderIndex / 100 * 100).toFixed(0)}%</div>
                    <div className="stat-label">Win Chance</div>
                  </div>
                  <div className="stat-card highlight">
                    <div className="stat-value">{multiplier.toFixed(2)}x</div>
                    <div className="stat-label">Multiplier</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {maxWin > pool.maxPayout ? (
                        <span className="error">TOO HIGH</span>
                      ) : (
                        <TokenValue suffix="" amount={maxWin} />
                      )}
                    </div>
                    <div className="stat-label">Max Win</div>
                  </div>
                </div>

                {/* Roll Under Display */}
                <div className="roll-target">
                  <div className="target-circle">
                    <div className="target-number">{rollUnderIndex + 1}</div>
                    <div className="target-label">Roll Under</div>
                  </div>
                </div>

                {/* Main Dice Area */}
                <div className="dice-arena">
                  <div className="dice-track-container">
                    {/* Result indicator */}
                    {resultIndex > -1 && (
                      <div 
                        className="result-marker" 
                        style={{ left: `${(resultIndex / 100) * 100}%` }}
                      >
                        <div className="result-number">{resultIndex + 1}</div>
                        <div className="result-arrow"></div>
                      </div>
                    )}
                    
                    {/* Custom Slider Track */}
                    <div className="dice-track">
                      <div className="track-background">
                        <div 
                          className="win-zone" 
                          style={{ width: `${rollUnderIndex}%` }}
                        ></div>
                        <div 
                          className="lose-zone" 
                          style={{ width: `${100 - rollUnderIndex}%` }}
                        ></div>
                      </div>
                      
                      {/* Slider Component */}
                      <Slider
                        disabled={gamba.isPlaying}
                        range={[0, 100]}
                        min={1}
                        max={100 - 5}
                        value={rollUnderIndex}
                        onChange={(value) => {
                          setRollUnderIndex(value)
                          sounds.play('tick')
                        }}
                      />
                    </div>

                    {/* Track Labels */}
                    <div className="track-labels">
                      <div className="label-win">
                        <span>WIN ZONE</span>
                        <span>1 - {rollUnderIndex + 1}</span>
                      </div>
                      <div className="label-lose">
                        <span>LOSE ZONE</span>
                        <span>{rollUnderIndex + 2} - 100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GambaUi.Responsive>
          </GameplayFrame>
        </StyledDiceBackground>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          playDisabled={false}
          playText="Roll"
        />
        
        <DesktopControls>
          <EnhancedWagerInput value={wager} onChange={setWager} multiplier={multiplier} />
          <EnhancedPlayButton onClick={play}>Roll</EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}
