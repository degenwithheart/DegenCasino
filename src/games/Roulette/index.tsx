import { computed } from '@preact/signals-react'
import { GambaUi, TokenValue, useCurrentPool, useCurrentToken, useSound, useUserBalance, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { RouletteTable } from 'react-casino-roulette'
import 'react-casino-roulette/dist/index.css'
import styled from 'styled-components'
import { GameplayFrame, useGraphics } from '../../components'
import type { GameplayEffectsRef } from '../../components'
import { useGameMeta } from '../useGameMeta'
import { Chip } from './Chip'
import { StyledResults } from './Roulette.styles'
import { CHIPS, SOUND_LOSE, SOUND_PLAY, SOUND_WIN } from './constants'
import { addChips, addResult, bet, clearChips, results, selectedChip, totalChipValue, chipPlacements } from './signals'
import { ROULETTE_CONFIG } from '../rtpConfig'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, DesktopControls } from '../../components'
import { RouletteWheel } from './RouletteWheel'

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  color: white;
`
function Results({ enableMotion = true }: { enableMotion?: boolean }) {
  const _results = computed(() => [...results.value].reverse())
  return (
    <StyledResults enableMotion={enableMotion}>
      {_results.value.map((index, i) => {
        return (
          <div key={i}>
            {index + 1}
          </div>
        )
      })}
    </StyledResults>
  )
}

function Stats({ wager }: { wager: number }) {
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const balance = useUserBalance()

  const multiplier = Math.max(...bet.value)
  const maxPayout = multiplier * wager
  const maxPayoutExceeded = maxPayout > pool.maxPayout
  const balanceExceeded = wager > (balance.balance + balance.bonusBalance)

  return (
    <div style={{ textAlign: 'center', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div>
        {balanceExceeded ? (
          <span style={{ color: '#ff0066' }}>
            TOO HIGH
          </span>
        ) : (
          <>
            <TokenValue amount={wager} />
          </>
        )}
        <div>Wager</div>
      </div>
      <div>
        <div>
          {maxPayoutExceeded ? (
            <span style={{ color: '#ff0066' }}>
              TOO HIGH
            </span>
          ) : (
            <>
              <TokenValue amount={maxPayout} />
              ({multiplier.toFixed(2)}x)
            </>
          )}
        </div>
        <div>Potential win</div>
      </div>
    </div>
  )
}

export default function Roulette() {
  const game = GambaUi.useGame()
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const pool = useCurrentPool()
  const balance = useUserBalance()
  const gamba = useGamba()
  
  // Get graphics settings to check if motion is enabled
  const { settings } = useGraphics()
  
  // Phase management for multi-phase roulette
  const [phase, setPhase] = React.useState<'betting' | 'spinning' | 'result'>('betting')
  const [winningNumber, setWinningNumber] = React.useState<string>('0')
  const [wheelSpinning, setWheelSpinning] = React.useState(false)
  const [gameResult, setGameResult] = React.useState<any>(null)
  
  // Effects system for enhanced visual feedback
  const effectsRef = React.useRef<GameplayEffectsRef>(null)

  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
  })

  // Calculate actual wager from chip placements
  const actualWager = totalChipValue.value * token.baseWager / 10_000

  // Convert chip placements to RouletteTable bets format
  const rouletteBets = React.useMemo(() => {
    const bets: Record<string, { icon?: string }> = {}
    Object.entries(chipPlacements.value).forEach(([id, amount]) => {
      if (amount > 0) {
        bets[id] = {
          icon: 'https://cdn-icons-png.flaticon.com/512/10095/10095709.png'
        }
      }
    })
    return bets
  }, [chipPlacements.value])

  // Handle bets from RouletteTable
  const handleRouletteTableBet = (params: any) => {
    try {
      console.log('RouletteTable bet params:', params)
      
      if (gamba.isPlaying) return
      
      // Use the mapping function from rtpConfig
      const mappedId = ROULETTE_CONFIG.mapRouletteTableBet(params)
      
      // For straight number bets, we need to add them to our chipPlacements directly
      // since they might not exist in our tableLayout
      if (params.bet === 'STRAIGHT_UP') {
        // Add directly to chipPlacements without using addChips
        const currentAmount = chipPlacements.value[mappedId] || 0
        chipPlacements.value = {
          ...chipPlacements.value,
          [mappedId]: currentAmount + selectedChip.value
        }
      } else {
        // Use the existing addChips function for mapped bets
        addChips(mappedId, selectedChip.value)
      }
    } catch (error) {
      console.error('Error handling roulette table bet:', error, params)
    }
  }

  const multiplier = Math.max(...bet.value)
  const maxPayout = multiplier * actualWager
  const maxPayoutExceeded = maxPayout > pool.maxPayout
  const balanceExceeded = actualWager > (balance.balance + balance.bonusBalance)

  const play = async () => {
    // CRITICAL SECURITY: Prevent zero wager gameplay
    if (actualWager <= 0) {
      console.error('❌ BLOCKED: Cannot play with zero wager');
      return;
    }
    
    try {
      // Start spinning phase
      setPhase('spinning')
      
      await game.play({
        bet: bet.value,
        wager: actualWager,
      })
      sounds.play('play')
      
      const result = await game.result()
      
      // Store the Gamba result and determine winning number
      setGameResult(result)
      const resultNumber = result.resultIndex
      setWinningNumber(resultNumber.toString())
      addResult(result.resultIndex)
      
      console.log('Gamba result:', result)
      console.log('Setting wheel winning number to:', resultNumber.toString())
      
      // Start the wheel spinning with the result
      setWheelSpinning(true)
    } catch (error) {
      console.error('Error in roulette play:', error)
      setPhase('betting')
    }
  }

  // Handle when the wheel finishes spinning
  const handleWheelSpinEnd = () => {
    setWheelSpinning(false)
    setPhase('result')
    
    // Play win/lose sound based on Gamba result payout (not hardcoded logic)
    if (gameResult && gameResult.payout > 0) {
      sounds.play('win')
      
      // 🎉 TRIGGER ROULETTE WIN EFFECTS
      console.log(`🎉 WIN! Gamba payout: ${gameResult.payout}, multiplier: ${gameResult.multiplier}`)
      effectsRef.current?.winFlash() // Use theme's winGlow color
      effectsRef.current?.particleBurst(50, 50) // Use theme's particleWin color
      
      // Visual celebration based on actual result.multiplier from Gamba
      if (gameResult.multiplier >= 35) {
        console.log('🎆 HUGE WIN! Straight up bet!')
        effectsRef.current?.screenShake(2.5, 1200) // Massive shake for straight up
        effectsRef.current?.particleBurst(25, 25, undefined, 15) // Extra particles
        effectsRef.current?.particleBurst(75, 75, undefined, 15) // More particles
      } else if (gameResult.multiplier >= 17) {
        console.log('💰 BIG WIN! Split bet!')
        effectsRef.current?.screenShake(2, 1000) // Strong shake for split
        effectsRef.current?.particleBurst(30, 30, undefined, 10) // Additional particles
      } else if (gameResult.multiplier >= 5) {
        console.log('✨ NICE WIN! Inside bet!')
        effectsRef.current?.screenShake(1.5, 800) // Medium shake for inside bets
      } else if (gameResult.multiplier >= 2) {
        console.log('🎊 Good win! Outside bet!')
        effectsRef.current?.screenShake(1, 600) // Light shake for outside bets
      } else {
        console.log('🙂 Small win!')
        effectsRef.current?.screenShake(0.7, 400) // Minimal shake for small wins
      }
    } else {
      sounds.play('lose')
      console.log('💔 No payout from Gamba.result')
      
      // 💥 TRIGGER ROULETTE LOSE EFFECTS
      effectsRef.current?.loseFlash() // Use theme's loseGlow color
      effectsRef.current?.screenShake(0.5, 300) // Light shake for loss
    }
    
    // Return to betting phase after showing result
    setTimeout(() => {
      setPhase('betting')
      clearChips()
      setGameResult(null)
    }, 3000)
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <GameplayFrame 
          ref={effectsRef}
          title={useGameMeta('roulette')?.name}
          description={useGameMeta('roulette')?.description}
          gameState={phase === 'betting' ? 'playing' : phase === 'spinning' ? 'loading' : 'finished'}
        >
          <GambaUi.Responsive>
            {phase === 'betting' && (
              <Wrapper onContextMenu={(e) => e.preventDefault()}>
                <Stats wager={actualWager} />
                <Results enableMotion={settings.enableMotion} />
                <RouletteTable
                  onBet={handleRouletteTableBet}
                  bets={rouletteBets}
                />
              </Wrapper>
            )}
            
            {(phase === 'spinning' || phase === 'result') && (
              <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <RouletteWheel
                  start={wheelSpinning}
                  winningBet={parseInt(winningNumber)}
                  onSpinningEnd={handleWheelSpinEnd}
                  withAnimation={settings.enableMotion}
                />
              </div>
            )}
          </GambaUi.Responsive>
        </GameplayFrame>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          playDisabled={!actualWager || balanceExceeded || maxPayoutExceeded || gamba.isPlaying || phase !== 'betting'}
          playText="Spin"
        >
          <GambaUi.Select
            options={CHIPS}
            value={selectedChip.value}
            onChange={(value) => selectedChip.value = value}
            label={(value) => (
              <>
                <Chip value={value} /> = <TokenValue amount={token.baseWager * value} />
              </>
            )}
          />
        </MobileControls>
        
        <DesktopControls>
          <EnhancedWagerInput value={wager} onChange={setWager} />
          <GambaUi.Select
            options={CHIPS}
            value={selectedChip.value}
            onChange={(value) => selectedChip.value = value}
            label={(value) => (
              <>
                <Chip value={value} /> = <TokenValue amount={token.baseWager * value} />
              </>
            )}
          />
          <GambaUi.Button
            disabled={!actualWager || gamba.isPlaying || phase !== 'betting'}
            onClick={clearChips}
          >
            Clear
          </GambaUi.Button>
          <EnhancedPlayButton 
            disabled={!actualWager || balanceExceeded || maxPayoutExceeded || phase !== 'betting'} 
            onClick={play}
          >
            {phase === 'betting' ? 'Spin' : phase === 'spinning' ? 'Spinning...' : 'Result'}
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}
