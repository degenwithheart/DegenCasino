import { GambaUi, useSound, useWagerInput, useCurrentPool } from 'gamba-react-ui-v2'
import React from 'react'
import styled from 'styled-components'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls } from '../../components'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import { useGameStats } from '../../hooks/game/useGameStats'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import CRASH_SOUND from './crash.mp3'
import SOUND from './music.mp3'
import WIN_SOUND from './win.mp3'
import { LineLayer1, LineLayer2, LineLayer3, MultiplierText, Rocket, ScreenWrapper, StarsLayer1, StarsLayer2, StarsLayer3 } from './styles'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { makeDeterministicRng } from '../../fairness/deterministicRng'

// Example modified "Ladder Crash" game - NOT the traditional crash concept
const LadderDesktopControls = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  
  @media (max-width: 800px) {
    display: none;
  }
`

const LadderProgressContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 8px;
  color: white;
  font-family: monospace;
  z-index: 100;
`

const LadderStep = styled.div<{ current?: boolean; passed?: boolean; failed?: boolean }>`
  padding: 4px 8px;
  margin: 2px 0;
  border-radius: 4px;
  background: ${props => 
    props.failed ? '#ff4444' : 
    props.current ? '#ffaa00' : 
    props.passed ? '#44ff44' : 
    '#666'};
  transition: all 0.3s ease;
`

// Ladder Crash Configuration - each step has decreasing win probability
const LADDER_CONFIG = {
  steps: [
    { multiplier: 1.1, winChance: 0.90 },  // 90% chance to reach 1.1x
    { multiplier: 1.2, winChance: 0.85 },  // 85% chance to reach 1.2x  
    { multiplier: 1.5, winChance: 0.80 },  // 80% chance to reach 1.5x
    { multiplier: 2.0, winChance: 0.70 },  // 70% chance to reach 2.0x
    { multiplier: 3.0, winChance: 0.60 },  // 60% chance to reach 3.0x
    { multiplier: 5.0, winChance: 0.45 },  // 45% chance to reach 5.0x
    { multiplier: 10.0, winChance: 0.25 }, // 25% chance to reach 10.0x
    { multiplier: 25.0, winChance: 0.10 }, // 10% chance to reach 25.0x
    { multiplier: 100.0, winChance: 0.02 } // 2% chance to reach 100.0x
  ],
  
  // Calculate bet array for ladder progression
  calculateBetArray: () => {
    // For ladder, we need multiple outcomes representing each step
    // This is a simplified example - real implementation would need careful RTP calculation
    const outcomes = []
    let cumulativeProbability = 1.0
    
    for (let i = 0; i < LADDER_CONFIG.steps.length; i++) {
      const step = LADDER_CONFIG.steps[i]
      const stepFailProbability = 1 - step.winChance
      const probabilityOfReachingAndFailingHere = cumulativeProbability * stepFailProbability
      
      // Add outcomes for failing at this step
      const outcomeCount = Math.floor(probabilityOfReachingAndFailingHere * 1000)
      for (let j = 0; j < outcomeCount; j++) {
        outcomes.push(step.multiplier * 0.96) // Apply 4% house edge
      }
      
      cumulativeProbability *= step.winChance
    }
    
    // Fill remaining slots with losses (0 payout)
    while (outcomes.length < 1000) {
      outcomes.push(0)
    }
    
    return outcomes
  }
}

export default function LadderCrashGame() {
  const [wager, setWager] = useWagerInput()
  const [currentStep, setCurrentStep] = React.useState(-1)
  const [currentMultiplier, setCurrentMultiplier] = React.useState(1.0)
  const [gameState, setGameState] = React.useState<'idle' | 'climbing' | 'won' | 'crashed'>('idle')
  const [passedSteps, setPassedSteps] = React.useState<number[]>([])
  const [finalMultiplier, setFinalMultiplier] = React.useState(1.0)
  
  const game = GambaUi.useGame()
  const pool = useCurrentPool()
  const sound = useSound({ music: SOUND, crash: CRASH_SOUND, win: WIN_SOUND })
  const { settings } = useGraphics()
  const { mobile: isMobile } = useIsCompact()
  const gameStats = useGameStats('crash-ladder')
  const effectsRef = React.useRef<GameplayEffectsRef>(null)

  const maxPayout = wager * 100 // Maximum possible win
  const poolExceeded = maxPayout > pool.maxPayout

  const climbLadder = async (targetStep: number, rng: () => number) => {
    for (let step = 0; step <= targetStep; step++) {
      const stepConfig = LADDER_CONFIG.steps[step]
      
      // Visual progression
      setCurrentStep(step)
      setCurrentMultiplier(stepConfig.multiplier)
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Check if we pass this step using deterministic RNG
      const random = rng()
      const passed = random < stepConfig.winChance
      
      if (passed) {
        setPassedSteps(prev => [...prev, step])
        sound.play('win')
        
        // Visual feedback for passing step
        effectsRef.current?.particleBurst(50, 20, undefined, 8)
      } else {
        // Failed at this step - crash!
        setGameState('crashed')
        sound.play('crash')
        effectsRef.current?.loseFlash()
        effectsRef.current?.screenShake(2, 800)
        return stepConfig.multiplier
      }
    }
    
    // Made it through all steps!
    setGameState('won')
    sound.play('win')
    effectsRef.current?.winFlash()
    effectsRef.current?.particleBurst(70, 40, undefined, 20)
    return LADDER_CONFIG.steps[targetStep].multiplier
  }

  const play = async () => {
    if (wager <= 0) return
    
    // Reset state
    setGameState('climbing')
    setCurrentStep(-1)
    setCurrentMultiplier(1.0)
    setPassedSteps([])
    
    // Play the game
    const bet = LADDER_CONFIG.calculateBetArray()
    await game.play({ wager, bet })
    
    const result = await game.result()
    const win = result.payout > 0
    
    // Determine how far we climbed based on the result
    let targetStep = 0
    if (win) {
      // Find which step corresponds to our payout
      const actualMultiplier = result.payout / wager
      targetStep = LADDER_CONFIG.steps.findIndex(step => 
        Math.abs(step.multiplier - actualMultiplier) < 0.1
      )
      if (targetStep === -1) targetStep = LADDER_CONFIG.steps.length - 1
    }
    
    // Create deterministic RNG for visual progression
    const rng = makeDeterministicRng(`ladder:${result.resultIndex}:${result.payout}`)
    
    sound.play('music')
    const finalMult = await climbLadder(targetStep, rng)
    setFinalMultiplier(finalMult)
    
    gameStats.updateStats(result.payout)
  }

  const getRocketStyle = () => {
    const progress = Math.min(currentMultiplier / 10, 1)
    return {
      bottom: `${20 + progress * 60}%`,
      left: `${20 + progress * 60}%`,
      transform: `rotate(${90 - progress * 90}deg)`,
    }
  }

  return (
    <>
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Ladder Crash"
          gameMode="Auto-Climb"
          rtp="96"
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <ScreenWrapper>
          <StarsLayer1 enableMotion={settings.enableMotion} />
          <LineLayer1 enableMotion={settings.enableMotion} />
          <StarsLayer2 enableMotion={settings.enableMotion} />
          <LineLayer2 enableMotion={settings.enableMotion} />
          <StarsLayer3 enableMotion={settings.enableMotion} />
          <LineLayer3 enableMotion={settings.enableMotion} />
          
          <MultiplierText color={gameState === 'crashed' ? '#ff0000' : gameState === 'won' ? '#00ff00' : '#ffffff'}>
            {currentMultiplier.toFixed(2)}x
          </MultiplierText>
          
          <Rocket style={getRocketStyle()} />
          
          {/* Ladder Progress Display */}
          <LadderProgressContainer>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Ladder Progress:</div>
            {LADDER_CONFIG.steps.map((step, index) => (
              <LadderStep
                key={index}
                current={currentStep === index}
                passed={passedSteps.includes(index)}
                failed={gameState === 'crashed' && currentStep === index}
              >
                {step.multiplier.toFixed(1)}x ({(step.winChance * 100).toFixed(0)}% chance)
              </LadderStep>
            ))}
          </LadderProgressContainer>
        </ScreenWrapper>
        
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
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          playDisabled={poolExceeded || gameState === 'climbing'}
          playText={gameState === 'climbing' ? 'Climbing...' : 'Start Climb'}
        />
        
        <LadderDesktopControls>
          <EnhancedWagerInput value={wager} onChange={setWager} />
          <EnhancedPlayButton 
            onClick={play} 
            disabled={poolExceeded || gameState === 'climbing'}
          >
            {gameState === 'climbing' ? 'Climbing...' : 'Start Climb'}
          </EnhancedPlayButton>
        </LadderDesktopControls>
      </GambaUi.Portal>
    </>
  )
}