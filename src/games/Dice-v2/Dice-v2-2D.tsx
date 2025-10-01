import React, { useState, useRef } from 'react'
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import { BET_ARRAYS_V3, RTP_TARGETS_V3 } from '../rtpConfig-v3'
import { EnhancedWagerInput, MobileControls, DesktopControls, GameControlsSection, GameRecentPlaysHorizontal } from '../../components'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import { useGameStats } from '../../hooks/game/useGameStats'
import { SOUND_LOSE, SOUND_PLAY, SOUND_TICK, SOUND_WIN, OUTCOMES } from './constants'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'

const DiceV2Renderer2D: React.FC = () => {
  // Essential hooks first
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const pool = useCurrentPool()
  const game = GambaUi.useGame()
  
  // Game statistics tracking - using centralized hook
  const gameStats = useGameStats('dice-v2')
  const { mobile: isMobile } = useIsCompact()
  
  // Game state
  const [rollValue, setRollValue] = useState(50)
  const [isRollUnder, setIsRollUnder] = useState(true)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [resultIndex, setResultIndex] = useState(-1)
  const [lastGameResult, setLastGameResult] = useState<'win' | 'lose' | null>(null)

  // Get graphics settings
  const { settings } = useGraphics()
  const enableEffects = settings.enableEffects
  const enableMotion = settings.enableMotion

  // Effects system
  const effectsRef = useRef<GameplayEffectsRef>(null)

  // Sound system
  const sounds = useSound({
    win: SOUND_WIN,
    play: SOUND_PLAY,
    lose: SOUND_LOSE,
    tick: SOUND_TICK,
  })

  // Calculate game values from RTP config (no hardcoded values)
  // Win chance matches the bet array calculation exactly
  const winChance = isRollUnder ? 
    rollValue / OUTCOMES : 
    (OUTCOMES - rollValue - 1) / OUTCOMES
  
  const multiplier = winChance > 0 ? (1 / winChance) * RTP_TARGETS_V3['dice'] : 0
  const maxWin = multiplier * wager
  const poolExceeded = maxWin > pool.maxPayout

  const play = async () => {
    try {
      if (wager <= 0) {
        console.error('❌ BLOCKED: Cannot play with zero wager')
        return
      }

      // Reset game state for new game
      setHasPlayed(false)
      setResultIndex(-1)
      setLastGameResult(null)

      sounds.play('play')

      // Get dice bet array from RTP config
  const diceConfig = BET_ARRAYS_V3['dice']
      
      // Use the available calculateBetArray function for roll under, 
      // or create the bet array manually for roll over
      let betArray: number[]
      if (isRollUnder) {
        betArray = diceConfig.calculateBetArray(rollValue)
      } else {
        // For roll over, we need to create the bet array manually
        betArray = Array(OUTCOMES).fill(0)
        const winProbability = (OUTCOMES - rollValue - 1) / OUTCOMES
        if (winProbability > 0) {
          const fairMultiplier = 1 / winProbability
          const houseMultiplier = fairMultiplier * RTP_TARGETS_V3['dice']
          
          // Set winning outcomes (rollValue+1 to 99)
          for (let i = rollValue + 1; i < OUTCOMES; i++) {
            betArray[i] = houseMultiplier
          }
        }
      }

      await game.play({ wager, bet: betArray })

      const result = await game.result()
      const win = result.payout > 0

      // Store the game result
      setLastGameResult(win ? 'win' : 'lose')

      // The result index from Gamba is the actual dice roll (0-99)
      const diceRoll = result.resultIndex

      // Set result index for display
      setResultIndex(diceRoll)

      // Update comprehensive game statistics
      const profit = result.payout - wager
      gameStats.updateStats(profit)

      // Handle win/lose effects
      setTimeout(() => {
        setHasPlayed(true)

        if (win) {
          sounds.play('win')
          if (enableEffects) {
            effectsRef.current?.winFlash('#00ff00', 1.5)
            effectsRef.current?.screenShake(1, 600)
          }
        } else {
          sounds.play('lose')
          if (enableEffects) {
            effectsRef.current?.loseFlash('#ff4444', 0.8)
            effectsRef.current?.screenShake(0.5, 400)
          }
        }
      }, 100)

    } catch (error) {
      console.error('🎲 PLAY FUNCTION ERROR:', error)
      // Reset states on error
      setHasPlayed(false)
      setResultIndex(-1)
      setLastGameResult(null)
    }
  }

  // Reset game to allow new wager
  const resetGame = () => {
    setHasPlayed(false)
    setResultIndex(-1)
    setLastGameResult(null)
  }

  return (
    <>
      {/* Recent Plays Portal - positioned above stats */}
      <GambaUi.Portal target="recentplays">
        <GameRecentPlaysHorizontal gameId="dice-v2" />
      </GambaUi.Portal>

      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Dice"
          gameMode="2D"
          rtp={(RTP_TARGETS_V3['dice'] * 100).toFixed(0)}
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
          background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 25%, #4a5568 50%, #2d3748 75%, #1a202c 100%)',
          perspective: '100px'
        }}>
          {/* Main Game Area - Mobile-First */}
          <div style={{
            position: 'absolute',
            top: 'clamp(10px, 3vw, 20px)',
            left: 'clamp(10px, 3vw, 20px)',
            right: 'clamp(10px, 3vw, 20px)',
            bottom: 'clamp(100px, 20vw, 120px)', // Responsive space for GameControlsSection
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(20px, 5vw, 30px)',
            padding: '10px'
          }}>
            {/* Header - Mobile-First */}
            <div style={{
              fontSize: 'clamp(14px, 4vw, 18px)',
              color: hasPlayed && resultIndex >= 0 ? (lastGameResult === 'win' ? '#48bb78' : '#e53e3e') : '#a0aec0',
              textAlign: 'center',
              lineHeight: '1.4',
              fontWeight: hasPlayed ? 'bold' : 'normal'
            }}>
              {hasPlayed && resultIndex >= 0 ? 
                `Roll Result: ${resultIndex} - ${lastGameResult === 'win' ? 'WIN!' : 'LOSE'}` : 
                'Games Results Will Be Displayed Here'
              }
            </div>

            {/* Possible Winning Display - Mobile-First */}
            <div style={{
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: 'clamp(32px, 8vw, 48px)',
                fontWeight: 'bold',
                marginBottom: '8px',
                lineHeight: '1.2'
              }}>
                <span style={{ color: '#48bb78' }}>
                  <TokenValue exact amount={maxWin} />
                </span>
              </div>
              <div style={{
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                color: '#a0aec0'
              }}>
                Possible Winning
              </div>
            </div>

            {/* Slider Section - Mobile-First */}
            <div style={{
              width: 'clamp(280px, 80vw, 600px)',
              maxWidth: '95%',
              position: 'relative'
            }}>
              {/* Slider Track Numbers */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'clamp(8px, 2vw, 10px)',
                fontSize: 'clamp(12px, 3vw, 14px)',
                color: '#a0aec0'
              }}>
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>

              {/* Slider Container */}
              <div style={{
                position: 'relative',
                height: 'clamp(36px, 8vw, 40px)',
                background: 'rgba(45, 55, 72, 0.8)',
                borderRadius: '20px',
                padding: '4px'
              }}>
                {/* Green Section (winning area) */}
                <div style={{
                  position: 'absolute',
                  left: isRollUnder ? '4px' : 'auto',
                  right: isRollUnder ? 'auto' : '4px',
                  top: '4px',
                  bottom: '4px',
                  width: `${isRollUnder ? rollValue : 100 - rollValue}%`,
                  background: 'linear-gradient(90deg, #48bb78, #38a169)',
                  borderRadius: '16px'
                }} />

                {/* Red Section (losing area) */}
                <div style={{
                  position: 'absolute',
                  right: isRollUnder ? '4px' : 'auto',
                  left: isRollUnder ? 'auto' : '4px',
                  top: '4px',
                  bottom: '4px',
                  width: `${isRollUnder ? 100 - rollValue : rollValue}%`,
                  background: 'linear-gradient(90deg, #e53e3e, #c53030)',
                  borderRadius: '16px'
                }} />

                {/* Slider Handle - Mobile-First */}
                <div style={{
                  position: 'absolute',
                  left: `${rollValue}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'clamp(28px, 6vw, 32px)',
                  height: 'clamp(28px, 6vw, 32px)',
                  background: 'linear-gradient(135deg, #e2e8f0, #cbd5e0)',
                  borderRadius: '50%',
                  border: '2px solid #4a5568',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  touchAction: 'manipulation'
                }} />

                {/* Slider Input */}
                <input
                  type="range"
                  min="1"
                  max="99"
                  value={rollValue}
                  onChange={(e) => setRollValue(parseInt(e.target.value))}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>

            {/* 3D Decorative Dice - Mobile-First & Better Centered */}
            <div style={{
              position: 'absolute',
              top: 'clamp(20px, 5vw, 40px)',
              left: 'clamp(20px, 8vw, 60px)',
              width: 'clamp(60px, 12vw, 80px)',
              height: 'clamp(60px, 12vw, 80px)',
              background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              transform: 'rotate(-15deg) perspective(100px) rotateX(15deg) rotateY(-15deg)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: '1fr 1fr 1fr',
              padding: 'clamp(8px, 2vw, 12px)',
              opacity: 0.7,
              pointerEvents: 'none'
            }}>
              {/* Dice 4 pattern - four corners */}
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'start' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'start' }}></div>
              <div></div>
              <div></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'end' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'end' }}></div>
            </div>
            <div style={{
              position: 'absolute',
              top: 'clamp(20px, 5vw, 40px)',
              right: 'clamp(20px, 8vw, 60px)',
              width: 'clamp(60px, 12vw, 80px)',
              height: 'clamp(60px, 12vw, 80px)',
              background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              transform: 'rotate(15deg) perspective(100px) rotateX(15deg) rotateY(15deg)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: '1fr 1fr 1fr',
              padding: 'clamp(8px, 2vw, 12px)',
              opacity: 0.7,
              pointerEvents: 'none'
            }}>
              {/* Dice 5 pattern - four corners + center */}
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'start' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'start' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'center', alignSelf: 'center' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'end' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'end' }}></div>
            </div>
            <div style={{
              position: 'absolute',
              bottom: 'clamp(80px, 15vw, 120px)',
              left: 'clamp(20px, 8vw, 60px)',
              width: 'clamp(60px, 12vw, 80px)',
              height: 'clamp(60px, 12vw, 80px)',
              background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              transform: 'rotate(25deg) perspective(100px) rotateX(-15deg) rotateY(-25deg)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: '1fr 1fr 1fr',
              padding: 'clamp(8px, 2vw, 12px)',
              opacity: 0.7,
              pointerEvents: 'none'
            }}>
              {/* Dice 3 pattern - diagonal */}
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'start' }}></div>
              <div></div>
              <div></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'center', alignSelf: 'center' }}></div>
              <div></div>
              <div></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'end' }}></div>
            </div>
            <div style={{
              position: 'absolute',
              bottom: 'clamp(80px, 15vw, 120px)',
              right: 'clamp(20px, 8vw, 60px)',
              width: 'clamp(60px, 12vw, 80px)',
              height: 'clamp(60px, 12vw, 80px)',
              background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              transform: 'rotate(-25deg) perspective(100px) rotateX(-15deg) rotateY(25deg)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: '1fr 1fr 1fr',
              padding: 'clamp(8px, 2vw, 12px)',
              opacity: 0.7,
              pointerEvents: 'none'
            }}>
              {/* Dice 6 pattern - two columns of three */}
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'start' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'start' }}></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'center' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'center' }}></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'end' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'end' }}></div>
            </div>
          </div>

          {/* GameControlsSection at bottom - Mobile-First Design */}
          <GameControlsSection>
            <div style={{ 
              display: 'flex', 
              gap: 'min(20px, 4vw)', 
              alignItems: 'center', 
              width: '100%',
              justifyContent: 'center',
              flexWrap: 'wrap',
              padding: '0 10px'
            }}>
              {/* Multiplier Panel */}
              <div style={{
                background: 'rgba(26, 32, 44, 0.9)',
                borderRadius: '12px',
                padding: 'clamp(12px, 3vw, 16px)',
                textAlign: 'center',
                minWidth: 'clamp(100px, 25vw, 120px)',
                flex: '1 1 auto',
                maxWidth: '150px',
                border: '2px solid rgba(74, 85, 104, 0.5)',
                boxShadow: '0 4px 16px rgba(26, 32, 44, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ 
                  fontSize: 'clamp(12px, 2.5vw, 14px)', 
                  marginBottom: '8px', 
                  color: '#a0aec0' 
                }}>
                  Multiplier
                </div>
                <div style={{ 
                  fontSize: 'clamp(16px, 4vw, 18px)', 
                  fontWeight: 'bold', 
                  color: '#fff' 
                }}>
                  {multiplier.toFixed(2)}x
                </div>
              </div>
              
              {/* Roll Under/Over Toggle Panel */}
              <div style={{
                background: 'rgba(26, 32, 44, 0.9)',
                borderRadius: '12px',
                padding: 'clamp(12px, 3vw, 16px)',
                textAlign: 'center',
                cursor: 'pointer',
                minWidth: 'clamp(100px, 25vw, 120px)',
                flex: '1 1 auto',
                maxWidth: '150px',
                border: '2px solid rgba(74, 85, 104, 0.5)',
                boxShadow: '0 4px 16px rgba(26, 32, 44, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setIsRollUnder(!isRollUnder)}
              onMouseEnter={(e) => {
                if (window.innerWidth > 768) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth > 768) {
                  e.currentTarget.style.transform = 'translateY(0px)'
                }
              }}
              >
                <div style={{ 
                  fontSize: 'clamp(12px, 2.5vw, 14px)', 
                  marginBottom: '8px', 
                  color: '#a0aec0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}>
                  <span>{isRollUnder ? 'Roll Under' : 'Roll Over'}</span>
                  <span style={{ 
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    opacity: 0.7,
                    display: 'inline-block'
                  }}>↻</span>
                </div>
                <div style={{ 
                  fontSize: 'clamp(16px, 4vw, 18px)', 
                  fontWeight: 'bold', 
                  color: '#fff' 
                }}>
                  {rollValue}
                </div>
              </div>
              
              {/* Win Chance Panel */}
              <div style={{
                background: 'rgba(26, 32, 44, 0.9)',
                borderRadius: '12px',
                padding: 'clamp(12px, 3vw, 16px)',
                textAlign: 'center',
                minWidth: 'clamp(100px, 25vw, 120px)',
                flex: '1 1 auto',
                maxWidth: '150px',
                border: '2px solid rgba(74, 85, 104, 0.5)',
                boxShadow: '0 4px 16px rgba(26, 32, 44, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ 
                  fontSize: 'clamp(12px, 2.5vw, 14px)', 
                  marginBottom: '8px', 
                  color: '#a0aec0' 
                }}>
                  Win Chance
                </div>
                <div style={{ 
                  fontSize: 'clamp(16px, 4vw, 18px)', 
                  fontWeight: 'bold', 
                  color: '#fff' 
                }}>
                  {(winChance * 100).toFixed(0)}%
                </div>
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
            {...(useGameMeta('dice-v2') && {
              title: useGameMeta('dice-v2')!.name,
              description: useGameMeta('dice-v2')!.description
            })}
          />
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={hasPlayed ? resetGame : play}
          playDisabled={gamba.isPlaying || (!hasPlayed && poolExceeded)}
          playText={hasPlayed ? "Roll Again" : "Roll Dice"}
        />

        <DesktopControls
          onPlay={hasPlayed ? resetGame : play}
          playDisabled={gamba.isPlaying || (!hasPlayed && poolExceeded)}
          playText={hasPlayed ? "Roll Again" : "Roll Dice"}
        >
          <EnhancedWagerInput value={wager} onChange={setWager} />
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}

export default DiceV2Renderer2D