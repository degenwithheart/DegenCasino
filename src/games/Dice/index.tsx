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
  const [rollUnderIndex, setRollUnderIndex] = React.useState(Math.floor(DICE_CONFIG.OUTCOMES / 2))
  
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

  const odds = Math.floor((rollUnderIndex / DICE_CONFIG.OUTCOMES) * DICE_CONFIG.OUTCOMES)
  const multiplier = Number(BigInt(DICE_CONFIG.OUTCOMES * BPS_PER_WHOLE) / BigInt(rollUnderIndex)) / BPS_PER_WHOLE

  const bet = React.useMemo(() => outcomes(odds), [rollUnderIndex])

  // Implement Plinko pattern for pool restrictions
  const maxMultiplier = multiplier
  const maxWagerForPool = React.useMemo(() => {
    return pool.maxPayout / maxMultiplier
  }, [pool.maxPayout, maxMultiplier])

  const maxWin = multiplier * wager
  const poolExceeded = maxWin > pool.maxPayout

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
    // or the losing interval [rollUnderIndex, OUTCOMES) depending on payout.
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
      const span = DICE_CONFIG.OUTCOMES - rollUnderIndex
      const value = rollUnderIndex + Math.floor(rng() * span) // rollUnderIndex .. OUTCOMES-1
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
                    <div className="stat-value">{(rollUnderIndex / DICE_CONFIG.OUTCOMES * 100).toFixed(0)}%</div>
                    <div className="stat-label">Win Chance</div>
                  </div>
                  <div className="stat-card highlight">
                    <div className="stat-value">{multiplier.toFixed(2)}x</div>
                    <div className="stat-label">Multiplier</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      <TokenValue suffix="" amount={maxWin} />
                    </div>
                    <div className="stat-label">Max Win</div>
                  </div>
                  {/* Result Stat Card */}
                  <div className={`stat-card ${resultIndex > -1 ? 'result-active' : 'result-inactive'}`}>
                    <div className="stat-value">
                      {resultIndex > -1 ? (resultIndex + 1) : '?'}
                    </div>
                    <div className="stat-label">Last Roll</div>
                  </div>
                </div>

                {/* Main Dice Area - Expanded to use more space */}
                <div className="dice-arena">
                  <div className="dice-track-container">
                    {/* Roll Under Display - Moved inside arena for better space usage */}
                    <div className="roll-target">
                      <div className="target-circle">
                        <div className="target-number">{rollUnderIndex + 1}</div>
                        <div className="target-label">Roll Under</div>
                      </div>
                    </div>


                    
                    {/* Custom Slider Track */}
                    <div className="dice-track">
                      <div className="track-background">
                        <div 
                          className="win-zone" 
                          style={{ width: `${rollUnderIndex}%` }}
                        ></div>
                        <div 
                          className="lose-zone" 
                          style={{ width: `${DICE_CONFIG.OUTCOMES - rollUnderIndex}%` }}
                        ></div>
                      </div>
                      
                      {/* Slider Component */}
                      <Slider
                        disabled={gamba.isPlaying}
                        range={[0, DICE_CONFIG.OUTCOMES]}
                        min={1}
                        max={DICE_CONFIG.OUTCOMES - 5}
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
                        <span>{rollUnderIndex + 2} - {DICE_CONFIG.OUTCOMES}</span>
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
          playDisabled={poolExceeded}
          playText="Roll"
        />
        
        <DesktopControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          playDisabled={poolExceeded}
          playText="Roll"
        >
          <EnhancedWagerInput 
            value={wager} 
            onChange={setWager} 
            multiplier={maxMultiplier}
          />
          <EnhancedPlayButton onClick={play} wager={wager} disabled={poolExceeded}>
            Roll
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}
