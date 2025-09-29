import React, { useState, useRef, useEffect } from 'react'
import { GambaUi, TokenValue, useCurrentPool, useCurrentToken, useSound, useWagerInput, FAKE_TOKEN_MINT, useTokenMeta } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import styled from 'styled-components'
import { BET_ARRAYS } from '../rtpConfig'
import { useGameStats } from '../../hooks/game/useGameStats'
import { ROULETTE_ROYALE_CONFIG } from '../rtpConfigMultiplayer'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGameMeta } from '../useGameMeta'

// Import sounds
import SOUND_WIN from './win.mp3'
import SOUND_LOSE from './lose.mp3'
import SOUND_PLAY from './play.mp3'
import SOUND_CHIP from './chip.mp3'

// Mobile-First Styled Components
const MobileGameContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a0f0f 0%, #2d1b1b 25%, #4a2c2c 50%, #2d1b1b 75%, #1a0f0f 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

const MobileHeader = styled.div`
  padding: 16px 20px 8px 20px;
  background: rgba(26, 15, 15, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  z-index: 10;
`

const GameTitle = styled.h1`
  color: #ffd700;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  text-align: center;
`

const GameSubtitle = styled.p`
  color: #daa520;
  font-size: 14px;
  margin: 0;
  text-align: center;
`

const MobileGameArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  min-height: 0;
`

const ResultDisplay = styled.div<{ $hasResult: boolean; $isWin?: boolean }>`
  text-align: center;
  padding: 16px;
  margin-bottom: 20px;
  background: ${props => props.$hasResult 
    ? props.$isWin 
      ? 'rgba(255, 215, 0, 0.2)' 
      : 'rgba(220, 20, 60, 0.2)'
    : 'rgba(218, 165, 32, 0.1)'};
  border: 2px solid ${props => props.$hasResult 
    ? props.$isWin 
      ? 'rgba(255, 215, 0, 0.5)' 
      : 'rgba(220, 20, 60, 0.5)'
    : 'rgba(218, 165, 32, 0.3)'};
  border-radius: 16px;
  transition: all 0.3s ease;
`

const ResultText = styled.div<{ $hasResult: boolean; $isWin?: boolean }>`
  font-size: 16px;
  font-weight: ${props => props.$hasResult ? '700' : '400'};
  color: ${props => props.$hasResult 
    ? props.$isWin 
      ? '#ffd700' 
      : '#dc143c'
    : '#daa520'};
  margin-bottom: 8px;
`

const WinAmountDisplay = styled.div`
  text-align: center;
  margin-bottom: 24px;
`

const WinAmount = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 4px;
`

const WinLabel = styled.div`
  font-size: 14px;
  color: #daa520;
`

const RouletteWheel = styled.div<{ $spinning: boolean }>`
  width: 200px;
  height: 200px;
  margin: 20px auto;
  background: radial-gradient(circle, #8b0000 0%, #4a0000 30%, #2d0000  60%, #000 100%);
  border-radius: 50%;
  border: 6px solid #ffd700;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
  transform: ${props => props.$spinning ? 'rotate(720deg)' : 'rotate(0deg)'};
  transition: transform 2s ease-out;
`

const WheelNumber = styled.div<{ $active: boolean; $number: number }>`
  position: absolute;
  width: 40px;
  height: 40px;
  background: ${props => {
    if (props.$active) return 'linear-gradient(135deg, #ffd700, #ffed4e)'
    const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(props.$number)
    return isRed ? 'linear-gradient(135deg, #dc143c, #8b0000)' : 'linear-gradient(135deg, #2f2f2f, #000)'
  }};
  border: 2px solid ${props => props.$active ? '#ffd700' : '#666'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  transform: ${props => `rotate(${props.$number * 10}deg) translateY(-70px) rotate(-${props.$number * 10}deg)`};
  
  ${props => props.$active && `
    animation: pulse 0.5s ease-in-out infinite alternate;
    @keyframes pulse {
      0% { transform: rotate(${props.$number * 10}deg) translateY(-70px) rotate(-${props.$number * 10}deg) scale(1); }
      100% { transform: rotate(${props.$number * 10}deg) translateY(-70px) rotate(-${props.$number * 10}deg) scale(1.2); }
    }
  `}
`

const WheelCenter = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ffd700, #daa520);
  border-radius: 50%;
  border: 3px solid #8b0000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #8b0000;
  text-align: center;
`

const BettingSection = styled.div`
  background: rgba(26, 15, 15, 0.8);
  border: 2px solid #ffd700;
  border-radius: 16px;
  padding: 16px;
  margin: 20px 0;
`

const BetTypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`

const BetTypeButton = styled.button<{ $active: boolean; $betType: string }>`
  padding: 12px 8px;
  background: ${props => props.$active 
    ? getBetTypeColor(props.$betType) 
    : 'rgba(26, 15, 15, 0.6)'};
  border: 2px solid ${props => props.$active ? '#ffd700' : 'rgba(255, 215, 0, 0.3)'};
  border-radius: 8px;
  color: ${props => props.$active ? '#fff' : '#daa520'};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
`

const NumberSelector = styled.div<{ $visible: boolean }>`
  display: ${props => props.$visible ? 'grid' : 'none'};
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
  margin: 12px 0;
`

const NumberButton = styled.button<{ $active: boolean; $number: number }>`
  padding: 8px 4px;
  background: ${props => {
    if (props.$active) return 'linear-gradient(135deg, #ffd700, #daa520)'
    const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(props.$number)
    return isRed ? 'linear-gradient(135deg, #dc143c, #8b0000)' : 'linear-gradient(135deg, #2f2f2f, #000)'
  }};
  border: 1px solid ${props => props.$active ? '#ffd700' : '#666'};
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
  }
`

const WagerSection = styled.div`
  margin-bottom: 20px;
`

const WagerInput = styled.div`
  background: rgba(26, 15, 15, 0.8);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
`

const WagerLabel = styled.div`
  font-size: 14px;
  color: #daa520;
  margin-bottom: 12px;
`

const WagerAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 16px;
`

const WagerButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`

const WagerButton = styled.button`
  background: rgba(74, 44, 44, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffd700;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(74, 44, 44, 1);
  }
`

const SpinButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  background: ${props => props.$disabled 
    ? 'rgba(218, 165, 32, 0.4)' 
    : 'linear-gradient(135deg, #ffd700, #daa520)'};
  border: none;
  border-radius: 16px;
  padding: 18px;
  color: ${props => props.$disabled ? '#8b7355' : '#8b0000'};
  font-size: 18px;
  font-weight: 700;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  box-shadow: ${props => props.$disabled 
    ? 'none' 
    : '0 4px 16px rgba(255, 215, 0, 0.4)'};
  
  ${props => !props.$disabled && `
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.6);
    }
  `}
`

// Helper function to get bet type colors
const getBetTypeColor = (betType: string) => {
  switch (betType) {
    case 'straight': return 'linear-gradient(135deg, #dc143c, #8b0000)'
    case 'red': return 'linear-gradient(135deg, #dc143c, #8b0000)'
    case 'black': return 'linear-gradient(135deg, #2f2f2f, #000)'
    case 'even': return 'linear-gradient(135deg, #4682b4, #2f4f4f)'
    case 'odd': return 'linear-gradient(135deg, #4682b4, #2f4f4f)'
    default: return 'linear-gradient(135deg, #ffd700, #daa520)'
  }
}

// Bet types and their multipliers
const BET_TYPES = {
  straight: { label: 'Single Number', multiplier: 35, numbers: 1 },
  red: { label: 'Red', multiplier: 1, numbers: 18 },
  black: { label: 'Black', multiplier: 1, numbers: 18 },
  even: { label: 'Even', multiplier: 1, numbers: 18 },
  odd: { label: 'Odd', multiplier: 1, numbers: 18 },
  high: { label: 'High (19-36)', multiplier: 1, numbers: 18 },
  low: { label: 'Low (1-18)', multiplier: 1, numbers: 18 }
}

const MobileRouletteGame: React.FC = () => {
  // Essential hooks
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const tokenMeta = useTokenMeta(token?.mint)
  const game = GambaUi.useGame()
  const gameStats = useGameStats('roulette-royale')
  
  // Game state
  const [betType, setBetType] = useState<keyof typeof BET_TYPES>('red')
  const [selectedNumber, setSelectedNumber] = useState(1)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [winningNumber, setWinningNumber] = useState<number | null>(null)
  const [lastGameResult, setLastGameResult] = useState<'win' | 'lose' | null>(null)

  // Effects system
  const effectsRef = useRef<GameplayEffectsRef>(null)

  // Sound system
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    chip: SOUND_CHIP,
  })

  // Calculate bet array based on selection
  const createBetArray = () => {
    const betArray = Array(37).fill(0) // 0-36 for European roulette
    const bet = BET_TYPES[betType]
    const multiplier = bet.multiplier + 1 // Add 1 to get total payout (including original wager)
    
    if (betType === 'straight') {
      betArray[selectedNumber] = multiplier
    } else if (betType === 'red') {
      const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
      redNumbers.forEach(num => betArray[num] = multiplier)
    } else if (betType === 'black') {
      const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]
      blackNumbers.forEach(num => betArray[num] = multiplier)
    } else if (betType === 'even') {
      for (let i = 2; i <= 36; i += 2) {
        betArray[i] = multiplier
      }
    } else if (betType === 'odd') {
      for (let i = 1; i <= 36; i += 2) {
        betArray[i] = multiplier
      }
    } else if (betType === 'high') {
      for (let i = 19; i <= 36; i++) {
        betArray[i] = multiplier
      }
    } else if (betType === 'low') {
      for (let i = 1; i <= 18; i++) {
        betArray[i] = multiplier
      }
    }
    
    return betArray
  }

  const betArray = createBetArray()
  const maxMultiplier = Math.max(...betArray)
  const maxWin = wager * maxMultiplier
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
      return tokenAmount
    }
    
    return tokenMeta?.baseWager ?? 0.01
  }

  const minWager = getMinimumWager()
  const maxWager = maxMultiplier > 0 ? Math.min(pool.maxPayout / maxMultiplier, pool.balance) : pool.balance

  // Wager controls
  const adjustWager = (factor: number) => {
    const newWager = Math.max(minWager, wager * factor)
    setWager(newWager)
  }

  const spin = async () => {
    if (spinning || wager <= 0) return

    try {
      setSpinning(true)
      setHasPlayed(false)
      setLastGameResult(null)
      setWinningNumber(null)

      sounds.play('play')
      sounds.play('chip')

      await game.play({
        bet: betArray,
        wager,
        metadata: [betType, selectedNumber]
      })

      const result = await game.result()
      
      // The winning number is the result index
      const winning = result.resultIndex
      setWinningNumber(winning)
      
      // Wait for wheel animation
      setTimeout(() => {
        setSpinning(false)
        const won = result.payout > 0
        setLastGameResult(won ? 'win' : 'lose')
        
        const profit = result.payout - wager
        gameStats.updateStats(profit)
        
        if (won) {
          sounds.play('win')
          effectsRef.current?.winFlash('#ffd700', 1.5)
          
          // Special effects for big wins
          const actualMultiplier = result.payout / wager
          if (actualMultiplier >= 20) {
            effectsRef.current?.screenShake(2, 1000)
          } else if (actualMultiplier >= 10) {
            effectsRef.current?.screenShake(1.5, 700)
          } else if (actualMultiplier >= 5) {
            effectsRef.current?.screenShake(1, 500)
          }
        } else {
          sounds.play('lose')
          effectsRef.current?.loseFlash('#dc143c', 0.8)
        }
        
        setHasPlayed(true)
      }, 2000)

    } catch (error) {
      console.error('🎰 MOBILE ROULETTE ERROR:', error)
      setSpinning(false)
      setHasPlayed(false)
      setLastGameResult(null)
      setWinningNumber(null)
    }
  }

  const resetGame = () => {
    setHasPlayed(false)
    setSpinning(false)
    setLastGameResult(null)
    setWinningNumber(null)
  }

  return (
    <MobileGameContainer>
      {/* Header */}
      <MobileHeader>
        <GameTitle>🎰 Roulette Royale</GameTitle>
        <GameSubtitle>Mobile Edition • European Style</GameSubtitle>
      </MobileHeader>

      {/* Game Area */}
      <MobileGameArea>
        {/* Result Display */}
        <ResultDisplay $hasResult={hasPlayed && lastGameResult !== null} $isWin={lastGameResult === 'win'}>
          <ResultText $hasResult={hasPlayed && lastGameResult !== null} $isWin={lastGameResult === 'win'}>
            {hasPlayed && lastGameResult !== null && winningNumber !== null ? 
              `${lastGameResult === 'win' ? 'WIN!' : 'LOSE'} - Number ${winningNumber}` : 
              'Place your bet and spin the wheel!'
            }
          </ResultText>
        </ResultDisplay>

        {/* Win Amount Display */}
        <WinAmountDisplay>
          <WinAmount>
            <TokenValue exact amount={maxWin} />
          </WinAmount>
          <WinLabel>Possible Win ({BET_TYPES[betType].multiplier + 1}x)</WinLabel>
        </WinAmountDisplay>

        {/* Roulette Wheel */}
        <RouletteWheel $spinning={spinning}>
          <WheelCenter>
            {winningNumber !== null ? winningNumber : 'SPIN'}
          </WheelCenter>
          {Array.from({ length: 12 }).map((_, i) => {
            const number = i * 3 + 1
            return (
              <WheelNumber 
                key={number} 
                $number={number} 
                $active={winningNumber === number}
              >
                {number}
              </WheelNumber>
            )
          })}
        </RouletteWheel>

        {/* Betting Section */}
        <BettingSection>
          <BetTypeSelector>
            {Object.entries(BET_TYPES).map(([key, bet]) => (
              <BetTypeButton 
                key={key}
                $active={betType === key}
                $betType={key}
                onClick={() => setBetType(key as keyof typeof BET_TYPES)}
              >
                {bet.label} ({bet.multiplier + 1}x)
              </BetTypeButton>
            ))}
          </BetTypeSelector>

          {/* Number Selector for Straight Bets */}
          <NumberSelector $visible={betType === 'straight'}>
            {Array.from({ length: 36 }, (_, i) => i + 1).map(num => (
              <NumberButton 
                key={num}
                $number={num}
                $active={selectedNumber === num}
                onClick={() => setSelectedNumber(num)}
              >
                {num}
              </NumberButton>
            ))}
          </NumberSelector>
        </BettingSection>

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

        {/* Spin Button */}
        <SpinButton 
          $disabled={gamba.isPlaying || spinning || (!hasPlayed && poolExceeded) || wager <= 0}
          onClick={hasPlayed ? resetGame : spin}
        >
          {spinning ? 'Spinning...' : hasPlayed ? 'Spin Again' : 'Spin Wheel'}
        </SpinButton>
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
        {...(useGameMeta('roulette-royale') && {
          title: useGameMeta('roulette-royale')!.name,
          description: useGameMeta('roulette-royale')!.description
        })}
      />
    </MobileGameContainer>
  )
}

export default MobileRouletteGame