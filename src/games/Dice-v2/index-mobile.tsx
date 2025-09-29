import React, { useState, useRef } from 'react'
import { GambaUi, TokenValue, useCurrentPool, useCurrentToken, useSound, useWagerInput, FAKE_TOKEN_MINT, useTokenMeta } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import styled from 'styled-components'
import { BET_ARRAYS_V2, RTP_TARGETS_V2 } from '../rtpConfig-v2'
import { useGameStats } from '../../hooks/game/useGameStats'
import { SOUND_LOSE, SOUND_PLAY, SOUND_TICK, SOUND_WIN, OUTCOMES } from './constants'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGameMeta } from '../useGameMeta'

// Mobile-First Styled Components
const MobileGameContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 25%, #4a5568 50%, #2d3748 75%, #1a202c 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

const MobileHeader = styled.div`
  padding: 16px 20px 8px 20px;
  background: rgba(26, 32, 44, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
`

const GameTitle = styled.h1`
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  text-align: center;
`

const GameSubtitle = styled.p`
  color: #a0aec0;
  font-size: 14px;
  margin: 0;
  text-align: center;
`

const MobileGameArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 20px 20px 20px;
  position: relative;
  min-height: 0;
`

const ResultDisplay = styled.div<{ $hasResult: boolean; $isWin?: boolean }>`
  text-align: center;
  padding: 16px;
  margin-bottom: 20px;
  background: ${props => props.$hasResult 
    ? props.$isWin 
      ? 'rgba(72, 187, 120, 0.2)' 
      : 'rgba(229, 62, 62, 0.2)'
    : 'rgba(160, 174, 192, 0.1)'};
  border: 2px solid ${props => props.$hasResult 
    ? props.$isWin 
      ? 'rgba(72, 187, 120, 0.5)' 
      : 'rgba(229, 62, 62, 0.5)'
    : 'rgba(160, 174, 192, 0.2)'};
  border-radius: 16px;
  transition: all 0.3s ease;
`

const ResultText = styled.div<{ $hasResult: boolean; $isWin?: boolean }>`
  font-size: 16px;
  font-weight: ${props => props.$hasResult ? '700' : '400'};
  color: ${props => props.$hasResult 
    ? props.$isWin 
      ? '#48bb78' 
      : '#e53e3e'
    : '#a0aec0'};
  margin-bottom: 8px;
`

const WinAmountDisplay = styled.div`
  text-align: center;
  margin-bottom: 24px;
`

const WinAmount = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #48bb78;
  margin-bottom: 4px;
`

const WinLabel = styled.div`
  font-size: 14px;
  color: #a0aec0;
`

const SliderSection = styled.div`
  margin-bottom: 24px;
`

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 12px;
  color: #a0aec0;
  padding: 0 4px;
`

const SliderContainer = styled.div`
  position: relative;
  height: 48px;
  background: rgba(45, 55, 72, 0.8);
  border-radius: 24px;
  padding: 4px;
  margin-bottom: 16px;
`

const SliderTrack = styled.div<{ $isUnder: boolean; $value: number }>`
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: ${props => props.$isUnder ? '4px' : 'auto'};
  right: ${props => props.$isUnder ? 'auto' : '4px'};
  width: ${props => props.$isUnder ? props.$value : 100 - props.$value}%;
  background: linear-gradient(90deg, #48bb78, #38a169);
  border-radius: 20px;
  transition: all 0.3s ease;
`

const SliderHandle = styled.div<{ $value: number }>`
  position: absolute;
  left: ${props => props.$value}%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e0);
  border-radius: 50%;
  border: 3px solid #4a5568;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 2;
`

const HiddenSlider = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
`

const ControlsSection = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`

const ControlPanel = styled.div<{ $clickable?: boolean }>`
  flex: 1;
  min-width: 0;
  background: rgba(26, 32, 44, 0.9);
  border: 2px solid rgba(74, 85, 104, 0.5);
  border-radius: 16px;
  padding: 16px 12px;
  text-align: center;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  
  ${props => props.$clickable && `
    &:active {
      transform: scale(0.98);
      background: rgba(26, 32, 44, 0.7);
    }
  `}
`

const ControlLabel = styled.div`
  font-size: 12px;
  color: #a0aec0;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`

const ControlValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
`

const WagerSection = styled.div`
  margin-bottom: 20px;
`

const WagerInput = styled.div`
  background: rgba(26, 32, 44, 0.9);
  border: 2px solid rgba(74, 85, 104, 0.5);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
`

const WagerLabel = styled.div`
  font-size: 14px;
  color: #a0aec0;
  margin-bottom: 12px;
`

const WagerAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
`

const WagerButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`

const WagerButton = styled.button`
  background: rgba(74, 85, 104, 0.8);
  border: 1px solid rgba(160, 174, 192, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(74, 85, 104, 0.6);
  }
`

const PlayButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  background: ${props => props.$disabled 
    ? 'rgba(74, 85, 104, 0.5)' 
    : 'linear-gradient(135deg, #48bb78, #38a169)'};
  border: none;
  border-radius: 16px;
  padding: 20px;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  box-shadow: ${props => props.$disabled 
    ? 'none' 
    : '0 4px 16px rgba(72, 187, 120, 0.4)'};
  
  ${props => !props.$disabled && `
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(72, 187, 120, 0.6);
    }
  `}
`

const DiceDecoration = styled.div<{ $position: string }>`
  position: absolute;
  ${props => {
    switch(props.$position) {
      case 'top-left': return 'top: 20px; left: 20px;'
      case 'top-right': return 'top: 20px; right: 20px;'
      case 'bottom-left': return 'bottom: 120px; left: 20px;'
      case 'bottom-right': return 'bottom: 120px; right: 20px;'
      default: return ''
    }
  }}
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%);
  border-radius: 8px;
  transform: ${props => {
    switch(props.$position) {
      case 'top-left': return 'rotate(-15deg)'
      case 'top-right': return 'rotate(15deg)'
      case 'bottom-left': return 'rotate(25deg)'
      case 'bottom-right': return 'rotate(-25deg)'
      default: return 'rotate(0deg)'
    }
  }};
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  opacity: 0.6;
  pointer-events: none;
`

const MobileDiceGame: React.FC = () => {
  // Essential hooks
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const tokenMeta = useTokenMeta(token?.mint)
  const game = GambaUi.useGame()
  const gameStats = useGameStats('dice-v2')
  
  // Game state
  const [rollValue, setRollValue] = useState(50)
  const [isRollUnder, setIsRollUnder] = useState(true)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [resultIndex, setResultIndex] = useState(-1)
  const [lastGameResult, setLastGameResult] = useState<'win' | 'lose' | null>(null)

  // Effects system
  const effectsRef = useRef<GameplayEffectsRef>(null)

  // Sound system
  const sounds = useSound({
    win: SOUND_WIN,
    play: SOUND_PLAY,
    lose: SOUND_LOSE,
    tick: SOUND_TICK,
  })

  // Calculate game values
  const winChance = isRollUnder ? 
    rollValue / OUTCOMES : 
    (OUTCOMES - rollValue - 1) / OUTCOMES
  
  const multiplier = winChance > 0 ? (1 / winChance) * RTP_TARGETS_V2['dice-v2'] : 0
  const maxWin = multiplier * wager
  const poolExceeded = maxWin > pool.maxPayout

  // Calculate min and max wagers (respecting pool minimum bet requirements)
  const getMinimumWager = () => {
    // Check if we're using discovery/fake tokens
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      return tokenMeta?.baseWager ?? 0.01 // For discovery tokens, use base wager
    }
    
    // For real tokens, minimum is $1 USD worth
    const tokenPrice = tokenMeta?.usdPrice ?? 0
    if (tokenPrice > 0) {
      const tokenAmount = 1 / tokenPrice // $1 worth of tokens
      return tokenAmount * (tokenMeta?.baseWager ?? Math.pow(10, tokenMeta?.decimals ?? 9))
    }
    
    return tokenMeta?.baseWager ?? 0.01
  }

  const minWager = getMinimumWager()
  const maxWager = multiplier > 0 ? Math.min(pool.maxPayout / multiplier, pool.balance) : pool.balance

  // Wager controls
  const adjustWager = (factor: number) => {
    const newWager = Math.max(minWager, wager * factor)
    setWager(newWager)
  }

  const play = async () => {
    try {
      if (wager <= 0) return

      setHasPlayed(false)
      setResultIndex(-1)
      setLastGameResult(null)

      sounds.play('play')

      // Create bet array
      const diceConfig = BET_ARRAYS_V2['dice-v2']
      let betArray: number[]
      
      if (isRollUnder) {
        betArray = diceConfig.calculateBetArray(rollValue)
      } else {
        betArray = Array(OUTCOMES).fill(0)
        const winProbability = (OUTCOMES - rollValue - 1) / OUTCOMES
        if (winProbability > 0) {
          const fairMultiplier = 1 / winProbability
          const houseMultiplier = fairMultiplier * RTP_TARGETS_V2['dice-v2']
          
          for (let i = rollValue + 1; i < OUTCOMES; i++) {
            betArray[i] = houseMultiplier
          }
        }
      }

      await game.play({ wager, bet: betArray })
      const result = await game.result()
      const win = result.payout > 0
      const diceRoll = result.resultIndex

      setLastGameResult(win ? 'win' : 'lose')
      setResultIndex(diceRoll)

      const profit = result.payout - wager
      gameStats.updateStats(profit)

      setTimeout(() => {
        setHasPlayed(true)
        sounds.play(win ? 'win' : 'lose')
        
        if (win) {
          effectsRef.current?.winFlash('#00ff00', 1.5)
          effectsRef.current?.screenShake(1, 600)
        } else {
          effectsRef.current?.loseFlash('#ff4444', 0.8)
          effectsRef.current?.screenShake(0.5, 400)
        }
      }, 100)

    } catch (error) {
      console.error('🎲 MOBILE PLAY ERROR:', error)
      setHasPlayed(false)
      setResultIndex(-1)
      setLastGameResult(null)
    }
  }

  const resetGame = () => {
    setHasPlayed(false)
    setResultIndex(-1)
    setLastGameResult(null)
  }

  return (
    <MobileGameContainer>
      {/* Header */}
      <MobileHeader>
        <GameTitle>🎲 Dice</GameTitle>
        <GameSubtitle>Mobile Edition • RTP {(RTP_TARGETS_V2['dice-v2'] * 100).toFixed(0)}%</GameSubtitle>
      </MobileHeader>

      {/* Game Area */}
      <MobileGameArea>
        {/* Decorative Dice */}
        <DiceDecoration $position="top-left" />
        <DiceDecoration $position="top-right" />
        <DiceDecoration $position="bottom-left" />
        <DiceDecoration $position="bottom-right" />

        {/* Result Display */}
        <ResultDisplay $hasResult={hasPlayed && resultIndex >= 0} $isWin={lastGameResult === 'win'}>
          <ResultText $hasResult={hasPlayed && resultIndex >= 0} $isWin={lastGameResult === 'win'}>
            {hasPlayed && resultIndex >= 0 ? 
              `Roll Result: ${resultIndex} - ${lastGameResult === 'win' ? 'WIN!' : 'LOSE'}` : 
              'Game results will appear here'
            }
          </ResultText>
        </ResultDisplay>

        {/* Win Amount Display */}
        <WinAmountDisplay>
          <WinAmount>
            <TokenValue exact amount={maxWin} />
          </WinAmount>
          <WinLabel>Possible Winning</WinLabel>
        </WinAmountDisplay>

        {/* Slider Section */}
        <SliderSection>
          <SliderLabels>
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </SliderLabels>

          <SliderContainer>
            <SliderTrack $isUnder={isRollUnder} $value={rollValue} />
            <SliderHandle $value={rollValue} />
            <HiddenSlider
              type="range"
              min="1"
              max="99"
              value={rollValue}
              onChange={(e) => setRollValue(parseInt(e.target.value))}
            />
          </SliderContainer>
        </SliderSection>

        {/* Controls Section */}
        <ControlsSection>
          <ControlPanel>
            <ControlLabel>Multiplier</ControlLabel>
            <ControlValue>{multiplier.toFixed(2)}x</ControlValue>
          </ControlPanel>
          
          <ControlPanel $clickable onClick={() => setIsRollUnder(!isRollUnder)}>
            <ControlLabel>
              {isRollUnder ? 'Roll Under' : 'Roll Over'} ↻
            </ControlLabel>
            <ControlValue>{rollValue}</ControlValue>
          </ControlPanel>
          
          <ControlPanel>
            <ControlLabel>Win Chance</ControlLabel>
            <ControlValue>{(winChance * 100).toFixed(0)}%</ControlValue>
          </ControlPanel>
        </ControlsSection>

        {/* Wager Section */}
        <WagerSection>
          <WagerInput>
            <WagerLabel>Wager Amount</WagerLabel>
            <WagerAmount>
              <TokenValue exact amount={wager} />
            </WagerAmount>
            <WagerButtons>
              <WagerButton onClick={() => adjustWager(0.5)}>1/2</WagerButton>
              <WagerButton onClick={() => adjustWager(2)}>2x</WagerButton>
              <WagerButton onClick={() => setWager(minWager)}>Min</WagerButton>
              <WagerButton onClick={() => setWager(maxWager)}>Max</WagerButton>
            </WagerButtons>
          </WagerInput>
        </WagerSection>

        {/* Play Button */}
        <PlayButton 
          $disabled={gamba.isPlaying || (!hasPlayed && poolExceeded)}
          onClick={hasPlayed ? resetGame : play}
        >
          {gamba.isPlaying ? 'Rolling...' : hasPlayed ? 'Roll Again' : 'Roll Dice'}
        </PlayButton>
      </MobileGameArea>

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
    </MobileGameContainer>
  )
}

export default MobileDiceGame