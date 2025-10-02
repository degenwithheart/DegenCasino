import React, { useState, useRef, useEffect } from 'react'
import { GambaUi, TokenValue, useCurrentPool, useCurrentToken, useSound, useWagerInput, FAKE_TOKEN_MINT, useTokenMeta } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import styled from 'styled-components'
import { BET_ARRAYS_V3, RTP_TARGETS_V3, getBucketColor } from '../rtpConfig-v3'
import { useGameStats } from '../../hooks/game/useGameStats'
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGameMeta } from '../useGameMeta'

// Import sounds
import BUMP from './bump.mp3'
import FALL from './fall.mp3'
import WIN from './win.mp3'

// Mobile-First Styled Components
const MobileGameContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

const MobileHeader = styled.div`
  padding: 16px 20px 8px 20px;
  background: rgba(15, 15, 35, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(66, 153, 225, 0.3);
  z-index: 10;
`

const GameTitle = styled.h1`
  color: #4299e1;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  text-align: center;
`

const GameSubtitle = styled.p`
  color: #90cdf4;
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
      ? 'rgba(72, 187, 120, 0.2)' 
      : 'rgba(245, 158, 11, 0.2)'
    : 'rgba(144, 205, 244, 0.1)'};
  border: 2px solid ${props => props.$hasResult 
    ? props.$isWin 
      ? 'rgba(72, 187, 120, 0.5)' 
      : 'rgba(245, 158, 11, 0.5)'
    : 'rgba(144, 205, 244, 0.3)'};
  border-radius: 16px;
  transition: all 0.3s ease;
`

const ResultText = styled.div<{ $hasResult: boolean; $isWin?: boolean }>`
  font-size: 16px;
  font-weight: ${props => props.$hasResult ? '700' : '400'};
  color: ${props => props.$hasResult 
    ? props.$isWin 
      ? '#48bb78' 
      : '#f59e0b'
    : '#90cdf4'};
  margin-bottom: 8px;
`

const WinAmountDisplay = styled.div`
  text-align: center;
  margin-bottom: 24px;
`

const WinAmount = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #4299e1;
  margin-bottom: 4px;
`

const WinLabel = styled.div`
  font-size: 14px;
  color: #90cdf4;
`

const PlinkoBoard = styled.div`
  background: rgba(15, 15, 35, 0.8);
  border: 3px solid #4299e1;
  border-radius: 16px;
  padding: 16px;
  margin: 20px 0;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

const PegsArea = styled.div`
  flex: 1;
  position: relative;
  margin-bottom: 16px;
  min-height: 120px;
`

const PegRow = styled.div<{ $rowIndex: number; $totalRows: number }>`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
  position: absolute;
  top: ${props => (props.$rowIndex / props.$totalRows) * 90}%;
  left: 50%;
  transform: translateX(-50%);
`

const Peg = styled.div`
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #90cdf4, #4299e1);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(66, 153, 225, 0.6);
`

const BallPath = styled.div<{ $active: boolean; $x?: number }>`
  position: absolute;
  top: -10px;
  left: ${props => props.$x ?? 50}%;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  border-radius: 50%;
  transform: translateX(-50%);
  opacity: ${props => props.$active ? 1 : 0};
  transition: all 0.3s ease;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.8);
  z-index: 10;
  
  ${props => props.$active && `
    animation: drop 2s ease-in-out;
    @keyframes drop {
      0% { top: -10px; }
      100% { top: 100%; }
    }
  `}
`

const BucketsContainer = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`

const Bucket = styled.div<{ $multiplier: number; $active: boolean }>`
  flex: 1;
  height: 40px;
  background: ${props => {
    const colors = getBucketColor(props.$multiplier);
    return props.$active 
      ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
      : `linear-gradient(135deg, ${colors.secondary}, ${colors.tertiary})`
  }};
  border: 2px solid ${props => {
    const colors = getBucketColor(props.$multiplier);
    return props.$active ? colors.primary : colors.secondary
  }};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  position: relative;
  transition: all 0.3s ease;
  
  ${props => props.$active && `
    animation: glow 0.5s ease-in-out;
    @keyframes glow {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); box-shadow: 0 0 20px ${getBucketColor(props.$multiplier).primary}; }
      100% { transform: scale(1); }
    }
  `}
`

const ModeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`

const ModeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #4299e1, #2b6cb0)'
    : 'rgba(15, 15, 35, 0.6)'};
  border: 2px solid ${props => props.$active ? '#4299e1' : 'rgba(144, 205, 244, 0.3)'};
  border-radius: 12px;
  color: ${props => props.$active ? '#fff' : '#90cdf4'};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
`

const ControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
`

const ControlRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

const ControlPanel = styled.div`
  flex: 1;
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid rgba(66, 153, 225, 0.5);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
`

const ControlLabel = styled.div`
  font-size: 12px;
  color: #90cdf4;
  margin-bottom: 6px;
`

const ControlValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #4299e1;
`

const WagerSection = styled.div`
  margin-bottom: 20px;
`

const WagerInput = styled.div`
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid rgba(66, 153, 225, 0.5);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
`

const WagerLabel = styled.div`
  font-size: 14px;
  color: #90cdf4;
  margin-bottom: 12px;
`

const WagerAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #4299e1;
  margin-bottom: 16px;
`

const WagerButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`

const WagerButton = styled.button`
  background: rgba(22, 33, 62, 0.8);
  border: 1px solid rgba(66, 153, 225, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: #4299e1;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(22, 33, 62, 1);
  }
`

const DropButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  background: ${props => props.$disabled 
    ? 'rgba(144, 205, 244, 0.4)' 
    : 'linear-gradient(135deg, #4299e1, #2b6cb0)'};
  border: none;
  border-radius: 16px;
  padding: 18px;
  color: ${props => props.$disabled ? '#90cdf4' : '#fff'};
  font-size: 18px;
  font-weight: 700;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  box-shadow: ${props => props.$disabled 
    ? 'none' 
    : '0 4px 16px rgba(66, 153, 225, 0.4)'};
  
  ${props => !props.$disabled && `
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(66, 153, 225, 0.6);
    }
  `}
`

const MobilePlinkoGame: React.FC = () => {
  // Essential hooks
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const tokenMeta = useTokenMeta(token?.mint)
  const game = GambaUi.useGame()
  const gameStats = useGameStats('plinko')
  
  // Game state
  const [degen, setDegen] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [dropping, setDropping] = useState(false)
  const [activeBucket, setActiveBucket] = useState<number | null>(null)
  const [lastGameResult, setLastGameResult] = useState<'win' | 'lose' | null>(null)
  const [ballPosition, setBallPosition] = useState(50) // percentage from left

  // Effects system
  const effectsRef = useRef<GameplayEffectsRef>(null)

  // Sound system
  const sounds = useSound({
    bump: BUMP,
    fall: FALL,
    win: WIN,
  })

  // Get bucket configuration
  const buckets = degen ? BET_ARRAYS_V3.plinko.calculateBetArray('degen') : BET_ARRAYS_V3.plinko.calculateBetArray('normal')
  const pegs = degen ? BET_ARRAYS_V3.plinko.PEGS.degen : BET_ARRAYS_V3.plinko.PEGS.normal
  
  // Calculate max win and pool constraints
  const maxMultiplier = Math.max(...buckets)
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
  const maxWager = maxMultiplier > 0 ? Math.min(pool.maxPayout / maxMultiplier, (pool as any).balance) : (pool as any).balance

  // Wager controls
  const adjustWager = (factor: number) => {
    const newWager = Math.max(minWager, wager * factor)
    setWager(newWager)
  }

  // Generate peg layout for visual
  const generatePegs = () => {
    const pegLayout = []
    for (let row = 0; row < Math.min(pegs, 10); row++) { // Limit visual pegs for mobile
      const pegsInRow = row + 3 // Start with 3 pegs, increase each row
      pegLayout.push(
        <PegRow key={row} $rowIndex={row} $totalRows={Math.min(pegs, 10)}>
          {Array.from({ length: Math.min(pegsInRow, 8) }).map((_, i) => ( // Limit pegs per row
            <Peg key={i} />
          ))}
        </PegRow>
      )
    }
    return pegLayout
  }

  const drop = async () => {
    if (dropping || wager <= 0) return

    try {
      setDropping(true)
      setHasPlayed(false)
      setLastGameResult(null)
      setActiveBucket(null)

      // Play drop sound
      sounds.play('bump')

      // Animate ball drop
      setBallPosition(50 + (Math.random() - 0.5) * 20) // Random starting position

      await game.play({
        bet: buckets,
        wager,
        metadata: [degen ? 'degen' : 'normal', buckets.length]
      })

      const result = await game.result()
      
      // Generate deterministic ball path
      const seed = `${result.resultIndex}:${result.payout}:${buckets.length}`
      const rng = makeDeterministicRng(seed)
      
      // Animate ball bouncing through pegs
      let currentX = 50
      for (let i = 0; i < 5; i++) { // 5 bounces for animation
        setTimeout(() => {
          sounds.play('bump')
          currentX += (rng() - 0.5) * 30
          currentX = Math.max(10, Math.min(90, currentX))
          setBallPosition(currentX)
        }, i * 200)
      }
      
      // Land in bucket after 2 seconds
      setTimeout(() => {
        const bucketIndex = result.resultIndex
        setActiveBucket(bucketIndex)
        
        // Final ball position matches bucket
        setBallPosition((bucketIndex / (buckets.length - 1)) * 80 + 10)
        
        sounds.play('fall')
        
        const profit = result.payout - wager
        gameStats.updateStats(profit)
        
        setTimeout(() => {
          setDropping(false)
          const won = result.payout > wager
          setLastGameResult(won ? 'win' : 'lose')
          
          if (won) {
            sounds.play('win')
            effectsRef.current?.winFlash('#4299e1', 1.5)
            
            // Special effects for high multipliers
            const multiplier = buckets[bucketIndex]
            if (multiplier >= 10) {
              effectsRef.current?.screenShake(2, 1000)
            } else if (multiplier >= 5) {
              effectsRef.current?.screenShake(1.5, 700)
            } else if (multiplier >= 2) {
              effectsRef.current?.screenShake(1, 500)
            }
          } else {
            effectsRef.current?.loseFlash('#f59e0b', 0.8)
          }
          
          setHasPlayed(true)
        }, 500)
      }, 2000)

    } catch (error) {
      console.error('🎯 MOBILE PLINKO ERROR:', error)
      setDropping(false)
      setHasPlayed(false)
      setLastGameResult(null)
      setActiveBucket(null)
    }
  }

  const resetGame = () => {
    setHasPlayed(false)
    setDropping(false)
    setLastGameResult(null)
    setActiveBucket(null)
    setBallPosition(50)
  }

  return (
    <MobileGameContainer>
      {/* Header */}
      <MobileHeader>
        <GameTitle>🎯 Plinko</GameTitle>
        <GameSubtitle>Mobile Edition • RTP {(RTP_TARGETS_V3.plinko * 100).toFixed(0)}%</GameSubtitle>
      </MobileHeader>

      {/* Game Area */}
      <MobileGameArea>
        {/* Result Display */}
        <ResultDisplay $hasResult={hasPlayed && lastGameResult !== null} $isWin={lastGameResult === 'win'}>
          <ResultText $hasResult={hasPlayed && lastGameResult !== null} $isWin={lastGameResult === 'win'}>
            {hasPlayed && lastGameResult !== null && activeBucket !== null ? 
              `${lastGameResult === 'win' ? 'WIN!' : 'TRY AGAIN'} - Bucket ${activeBucket + 1}: ${buckets[activeBucket]}x` : 
              'Drop the ball to see where it lands!'
            }
          </ResultText>
        </ResultDisplay>

        {/* Win Amount Display */}
        <WinAmountDisplay>
          <WinAmount>
            <TokenValue exact amount={maxWin} />
          </WinAmount>
          <WinLabel>Max Win ({maxMultiplier.toFixed(1)}x)</WinLabel>
        </WinAmountDisplay>

        {/* Mode Selector */}
        <ModeSelector>
            <ModeButton 
            $active={!degen}
            onClick={() => setDegen(false)}
          >
            Normal ({BET_ARRAYS_V3.plinko.BUCKETS.normal} buckets)
          </ModeButton>
          <ModeButton 
            $active={degen}
            onClick={() => setDegen(true)}
          >
            Degen ({BET_ARRAYS_V3.plinko.BUCKETS.degen} buckets)
          </ModeButton>
        </ModeSelector>

        {/* Plinko Board */}
        <PlinkoBoard>
          {/* Ball */}
          <BallPath $active={dropping} $x={ballPosition} />
          
          {/* Pegs */}
          <PegsArea>
            {generatePegs()}
          </PegsArea>
          
          {/* Buckets */}
          <BucketsContainer>
            {buckets.map((multiplier, index) => (
              <Bucket 
                key={index} 
                $multiplier={multiplier} 
                $active={activeBucket === index}
              >
                {multiplier.toFixed(1)}x
              </Bucket>
            ))}
          </BucketsContainer>
        </PlinkoBoard>

        {/* Controls Section */}
        <ControlsSection>
          <ControlRow>
            <ControlPanel>
              <ControlLabel>Buckets</ControlLabel>
              <ControlValue>{buckets.length}</ControlValue>
            </ControlPanel>
            <ControlPanel>
              <ControlLabel>Mode</ControlLabel>
              <ControlValue>{degen ? 'Degen' : 'Normal'}</ControlValue>
            </ControlPanel>
            <ControlPanel>
              <ControlLabel>Pegs</ControlLabel>
              <ControlValue>{pegs}</ControlValue>
            </ControlPanel>
          </ControlRow>
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

        {/* Drop Button */}
        <DropButton 
          $disabled={gamba.isPlaying || dropping || (!hasPlayed && poolExceeded) || wager <= 0}
          onClick={hasPlayed ? resetGame : drop}
        >
          {dropping ? 'Dropping...' : hasPlayed ? 'Drop Again' : 'Drop Ball'}
        </DropButton>
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
        {...(useGameMeta('plinko') && {
          title: useGameMeta('plinko')!.name,
          description: useGameMeta('plinko')!.description
        })}
      />
    </MobileGameContainer>
  )
}

export default MobilePlinkoGame