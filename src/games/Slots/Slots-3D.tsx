import React, { useRef } from 'react'
import { EffectTest, GambaUi } from 'gamba-react-ui-v2'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, DesktopControls } from '../../components'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { useGameMeta } from '../useGameMeta'
import { ItemPreview } from './ItemPreview'
import { Reel } from './Reel'
import { StyledSlots } from './Slots.styles'
import { StyledSlotsBackground } from './SlotsBackground.enhanced.styles'
import {
  DEFAULT_SLOT_MODE,
  SlotMode,
  getNumSlots,
  getNumReels,
  getNumRows,
  getNumPaylines,
  SLOT_ITEMS,
} from './constants'
import { useSlotsGameLogic } from './sharedLogic'

export default function Slots3D() {
  // Use shared game logic
  const {
    wager,
    bet,
    maxMultiplier,
    isValid,
    spinning,
    result,
    combination,
    revealedSlots,
    good,
    winningPaylines,
    winningSymbol,
    gameStats,
    setWager,
    play,
    handleResetStats,
  } = useSlotsGameLogic()

  const effectsRef = useRef<GameplayEffectsRef>(null)
  const { settings } = useGraphics()
  
  // Mobile detection using the hook
  const { mobile: isMobile } = useIsCompact()
  
  // Dynamic values based on screen size
  const slotMode: SlotMode = isMobile ? 'classic' : 'wide'
  const NUM_REELS = getNumReels(slotMode)
  const NUM_ROWS = getNumRows(slotMode)
  const NUM_SLOTS = getNumSlots(slotMode)
  const NUM_PAYLINES = getNumPaylines(slotMode)

  // DISABLED play function for 3D mode
  const handlePlay = () => {
    console.log('🎰 3D Slots - Coming Soon! This mode is not yet available.')
  }

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Slots"
          gameMode="3D Mode (Coming Soon)"
          rtp="95"
          stats={gameStats}
          onReset={handleResetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <StyledSlotsBackground>
          {/* Enhanced background for Slots game */}
          <div className="slots-bg-elements" />
          <div className="casino-bg-elements" />
          <div className="decorative-overlay" />
          
          <StyledSlots>
            <GameplayFrame 
              ref={effectsRef}
              {...(useGameMeta('slots') && { 
                title: useGameMeta('slots')!.name, 
                description: useGameMeta('slots')!.description 
              })}
              disableContainerTransforms={true}
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
                  🎰 3D Mode<br />
                  <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>Coming Soon!</span>
                </div>
              </div>

              {good && <EffectTest src={winningSymbol?.image || combination[0].image} />}
              <GambaUi.Responsive>
                <div className="slots-content">
                  <div className={'slots'}>
                    <div className="winning-line-display">
                      <ItemPreview 
                        betArray={[...bet]} 
                        winningMultiplier={winningSymbol?.multiplier}
                        isWinning={good}
                      />
                    </div>
                    <div className={`slots-reels ${settings.enableMotion ? 'motion-enabled' : 'motion-disabled'}`}>
                      {/* ECG-style winning line */}
                      <div className={`ecg-winning-line ${good ? 'active' : ''}`}></div>
                      
                      {/* Left Arrow */}
                      <div className="winning-line-arrow winning-line-arrow-left">
                        <div className="arrow-icon">▶</div>
                      </div>
                      
                      {Array.from({ length: NUM_REELS }).map((_, reelIndex) => {
                        const reelItems = Array.from({ length: NUM_ROWS }).map((_, rowIndex) => {
                          const slotIndex = reelIndex * NUM_ROWS + rowIndex
                          return combination[slotIndex] || SLOT_ITEMS[0] // Fallback if undefined
                        })
                        
                        const reelGoodSlots = Array.from({ length: NUM_ROWS }).map((_, rowIndex) => {
                          const slotIndex = reelIndex * NUM_ROWS + rowIndex
                          return good && winningPaylines.some(line => line.payline.includes(slotIndex))
                        })
                        
                        const reelRevealed = revealedSlots > reelIndex * NUM_ROWS
                        
                        return (
                          <Reel
                            key={reelIndex}
                            reelIndex={reelIndex}
                            revealed={reelRevealed}
                            good={reelGoodSlots}
                            items={reelItems}
                            isSpinning={spinning && !reelRevealed}
                            enableMotion={settings.enableMotion}
                          />
                        )
                      })}
                      
                      {/* Right Arrow */}
                      <div className="winning-line-arrow winning-line-arrow-right">
                        <div className="arrow-icon">◀</div>
                      </div>
                    </div>
                  </div>
                </div>
              </GambaUi.Responsive>
            </GameplayFrame>
          </StyledSlots>
        </StyledSlotsBackground>
      </GambaUi.Portal>
      
      <GambaUi.Portal target="controls">
        {/* EXACT SAME CONTROLS AS 2D BUT DISABLED */}
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={handlePlay}
          playDisabled={true}
          playText="Coming Soon"
        />
        
        <DesktopControls
          wager={wager}
          setWager={setWager}
          onPlay={handlePlay}
          playDisabled={true}
          playText="Coming Soon"
        >
          <EnhancedWagerInput value={wager} onChange={setWager} multiplier={maxMultiplier} />
          
          <EnhancedPlayButton disabled={true} onClick={handlePlay}>
            Coming Soon
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}