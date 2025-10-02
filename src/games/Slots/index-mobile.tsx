import React, { useState, useRef, useEffect } from 'react'
import { GambaUi, TokenValue, useCurrentPool, useCurrentToken, useSound, useWagerInput, FAKE_TOKEN_MINT, useTokenMeta } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import styled from 'styled-components'
import { BET_ARRAYS, RTP_TARGETS } from '../rtpConfig'
import { useGameStats } from '../../hooks/game/useGameStats'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGameMeta } from '../useGameMeta'
import { 
  SLOT_ITEMS, 
  SOUND_WIN, 
  SOUND_LOSE, 
  SOUND_SPIN, 
  SOUND_PLAY, 
  SOUND_REVEAL, 
  SOUND_REVEAL_LEGENDARY,
  LEGENDARY_THRESHOLD,
  SlotItem 
} from './constants'
import { generateBetArray, getSlotCombination, getWinningPaylines } from './utils'

// Mobile-First Styled Components
const MobileGameContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #16213e 75%, #1a1a2e 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

const MobileHeader = styled.div`
  padding: 16px 20px 8px 20px;
  background: rgba(26, 26, 46, 0.9);
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
  color: #87ceeb;
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
    : 'rgba(135, 206, 235, 0.1)'};
  border: 2px solid ${props => props.$hasResult 
    ? props.$isWin 
      ? 'rgba(255, 215, 0, 0.5)' 
      : 'rgba(220, 20, 60, 0.5)'
    : 'rgba(135, 206, 235, 0.3)'};
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
    : '#87ceeb'};
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
  color: #87ceeb;
`

const SlotsContainer = styled.div`
  background: rgba(26, 26, 46, 0.8);
  border: 3px solid #ffd700;
  border-radius: 16px;
  padding: 16px;
  margin: 20px 0;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

const ReelsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  height: 120px;
`

const Reel = styled.div<{ $spinning: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: rgba(15, 52, 96, 0.6);
  animation: ${props => props.$spinning ? 'spin 0.1s infinite linear' : 'none'};
  
  @keyframes spin {
    0% { transform: translateY(0); }
    100% { transform: translateY(-20px); }
  }
`

const Slot = styled.div<{ $revealed: boolean; $winning: boolean; $item: SlotItem }>`
  height: 36px;
  background: ${props => {
    if (!props.$revealed) return 'rgba(135, 206, 235, 0.3)'
    if (props.$winning) return 'linear-gradient(135deg, #ffd700, #ffed4e)'
    if (props.$item.multiplier >= LEGENDARY_THRESHOLD) return 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
    if (props.$item.multiplier >= 2) return 'linear-gradient(135deg, #74b9ff, #0984e3)'
    return 'linear-gradient(135deg, #a29bfe, #6c5ce7)'
  }};
  border: 2px solid ${props => {
    if (props.$winning) return '#ffd700'
    if (props.$item.multiplier >= LEGENDARY_THRESHOLD) return '#ff6b6b'
    return 'rgba(255,255,255,0.2)'
  }};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.$winning && `
    animation: pulse 0.5s infinite alternate;
    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 0 5px #ffd700; }
      100% { transform: scale(1.05); box-shadow: 0 0 20px #ffd700; }
    }
  `}
`

const SlotSymbol = styled.div<{ $item: SlotItem }>`
  font-size: 10px;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  
  &:before {
    content: '${props => {
      if (props.$item.multiplier >= 175) return '💎'
      if (props.$item.multiplier >= 80) return '👑'
      if (props.$item.multiplier >= 30) return '🎯'
      if (props.$item.multiplier >= 10) return '☀️'
      if (props.$item.multiplier >= 5) return '💎'
      if (props.$item.multiplier >= 2) return '🪙'
      if (props.$item.multiplier > 0) return '🔸'
      return '💀'
    }}';
    display: block;
    font-size: 16px;
  }
`

const PaylineIndicator = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 3px;
  background: ${props => props.$active 
    ? 'linear-gradient(90deg, transparent, #ffd700, #ffd700, #ffd700, transparent)' 
    : 'none'};
  transform: translateY(-50%);
  z-index: 10;
  opacity: ${props => props.$active ? 1 : 0};
  transition: opacity 0.3s ease;
  box-shadow: ${props => props.$active ? '0 0 10px #ffd700' : 'none'};
`

const WagerSection = styled.div`
  margin-bottom: 20px;
`

const WagerInput = styled.div`
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
`

const WagerLabel = styled.div`
  font-size: 14px;
  color: #87ceeb;
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
  background: rgba(15, 52, 96, 0.8);
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
    background: rgba(15, 52, 96, 1);
  }
`

const SpinButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  background: ${props => props.$disabled 
    ? 'rgba(135, 206, 235, 0.4)' 
    : 'linear-gradient(135deg, #ffd700, #ffed4e)'};
  border: none;
  border-radius: 16px;
  padding: 18px;
  color: ${props => props.$disabled ? '#87ceeb' : '#1a1a2e'};
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

const InfoPanel = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  font-size: 12px;
  color: #87ceeb;
`

const MobileSlotsGame: React.FC = () => {
  // Essential hooks
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const tokenMeta = useTokenMeta(token?.mint)
  const game = GambaUi.useGame()
  const gameStats = useGameStats('slots')
  
  // Game state - Mobile uses 4x3 layout (4 reels, 3 rows)
  const NUM_REELS = 4
  const NUM_ROWS = 3
  const NUM_SLOTS = NUM_REELS * NUM_ROWS
  
  const [spinning, setSpinning] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [revealedSlots, setRevealedSlots] = useState(NUM_SLOTS)
  const [combination, setCombination] = useState<SlotItem[]>(Array(NUM_SLOTS).fill(SLOT_ITEMS[0]))
  const [winningPaylines, setWinningPaylines] = useState<{ payline: number[], symbol: SlotItem }[]>([])
  const [lastGameResult, setLastGameResult] = useState<'win' | 'lose' | null>(null)

  // Effects system
  const effectsRef = useRef<GameplayEffectsRef>(null)
  const timeout = useRef<any>()

  // Sound system
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    reveal: SOUND_REVEAL,
    revealLegendary: SOUND_REVEAL_LEGENDARY,
    spin: SOUND_SPIN,
    play: SOUND_PLAY,
  })

  // Calculate bet array and max win
  const bet = React.useMemo(() => {
    const cappedMaxPayout = Math.min(pool.maxPayout, wager * Math.max(...BET_ARRAYS.slots.betArray))
    return generateBetArray(cappedMaxPayout, wager)
  }, [pool.maxPayout, wager])

  const maxMultiplier = Math.max(...bet)
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

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      timeout.current && clearTimeout(timeout.current)
    }
  }, [])

  const revealReel = (combination: SlotItem[], reel = 0) => {
    sounds.play('reveal', { playbackRate: 1.1 })

    // Reveal entire reel (column) at once
    const revealedSlotCount = (reel + 1) * NUM_ROWS
    setRevealedSlots(revealedSlotCount)

    // Check if current reel has any legendary wins
    for (let row = 0; row < NUM_ROWS; row++) {
      const slotIndex = reel * NUM_ROWS + row
      if (slotIndex < combination.length && combination[slotIndex].multiplier >= LEGENDARY_THRESHOLD) {
        sounds.play('revealLegendary')
        break
      }
    }

    if (reel < NUM_REELS - 1) {
      // Reveal next reel
      timeout.current = setTimeout(() => revealReel(combination, reel + 1), 300)
    } else {
      // Show final results
      sounds.sounds.spin.player.stop()
      const finalWinningLines = getWinningPaylines(combination, NUM_REELS, NUM_ROWS)
      setWinningPaylines(finalWinningLines)
      
      timeout.current = setTimeout(() => {
        setSpinning(false)
        if (finalWinningLines.length > 0) {
          setLastGameResult('win')
          sounds.play('win')
          
          // Trigger win effects
          effectsRef.current?.winFlash('#ffd700', 1.5)
          
          if (finalWinningLines.length >= 3) {
            effectsRef.current?.screenShake(2, 1000)
          } else if (finalWinningLines.length >= 2) {
            effectsRef.current?.screenShake(1.5, 700)
          } else {
            effectsRef.current?.screenShake(1, 500)
          }
        } else {
          setLastGameResult('lose')
          sounds.play('lose')
          effectsRef.current?.loseFlash('#dc143c', 0.8)
        }
        setHasPlayed(true)
      }, 500)
    }
  }

  const spin = async () => {
    if (spinning || wager <= 0) return

    try {
      setSpinning(true)
      setHasPlayed(false)
      setLastGameResult(null)
      setWinningPaylines([])
      setRevealedSlots(0)

      sounds.play('play')
      sounds.play('spin')

      await game.play({
        bet,
        wager,
        metadata: ['slots', NUM_REELS, NUM_ROWS]
      })

      const result = await game.result()
      
      // Generate slot combination based on result
      const newCombination = getSlotCombination(result.resultIndex, SLOT_ITEMS, NUM_SLOTS)
      setCombination(newCombination)
      
      // Update stats
      const profit = result.payout - wager
      gameStats.updateStats(profit)

      // Start revealing reels after spin delay
      setTimeout(() => {
        revealReel(newCombination)
      }, 1500)

    } catch (error) {
      console.error('🎰 MOBILE SLOTS ERROR:', error)
      setSpinning(false)
      setHasPlayed(false)
      setLastGameResult(null)
    }
  }

  const resetGame = () => {
    setHasPlayed(false)
    setSpinning(false)
    setLastGameResult(null)
    setWinningPaylines([])
    setRevealedSlots(NUM_SLOTS)
    setCombination(Array(NUM_SLOTS).fill(SLOT_ITEMS[0]))
  }

  // Check if slot is winning
  const isSlotWinning = (index: number) => {
    return winningPaylines.some(line => line.payline.includes(index))
  }

  return (
    <MobileGameContainer>
      {/* Header */}
      <MobileHeader>
        <GameTitle>🎰 Slots</GameTitle>
        <GameSubtitle>Mobile Edition • RTP {(RTP_TARGETS.slots * 100).toFixed(0)}%</GameSubtitle>
      </MobileHeader>

      {/* Game Area */}
      <MobileGameArea>
        {/* Result Display */}
        <ResultDisplay $hasResult={hasPlayed && lastGameResult !== null} $isWin={lastGameResult === 'win'}>
          <ResultText $hasResult={hasPlayed && lastGameResult !== null} $isWin={lastGameResult === 'win'}>
            {hasPlayed && lastGameResult !== null ? 
              lastGameResult === 'win' 
                ? `WIN! ${winningPaylines.length} Payline${winningPaylines.length > 1 ? 's' : ''}!` 
                : 'No winning combinations'
              : 'Spin the reels for winning combinations!'
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

        {/* Slots Machine */}
        <SlotsContainer>
          <PaylineIndicator $active={winningPaylines.length > 0} />
          <ReelsContainer>
            {Array.from({ length: NUM_REELS }).map((_, reelIndex) => (
              <Reel key={reelIndex} $spinning={spinning}>
                {Array.from({ length: NUM_ROWS }).map((_, rowIndex) => {
                  const slotIndex = reelIndex * NUM_ROWS + rowIndex
                  const isRevealed = slotIndex < revealedSlots
                  const item = combination[slotIndex] || SLOT_ITEMS[0]
                  const isWinning = hasPlayed && isSlotWinning(slotIndex)
                  
                  return (
                    <Slot 
                      key={slotIndex}
                      $revealed={isRevealed}
                      $winning={isWinning}
                      $item={item}
                    >
                      {isRevealed && (
                        <SlotSymbol $item={item}>
                          {item.multiplier > 0 ? `${item.multiplier}x` : '0x'}
                        </SlotSymbol>
                      )}
                    </Slot>
                  )
                })}
              </Reel>
            ))}
          </ReelsContainer>
        </SlotsContainer>

        <InfoPanel>
          <span>Paylines: {NUM_REELS}x{NUM_ROWS}</span>
          <span>Winning Lines: {winningPaylines.length}</span>
        </InfoPanel>

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
          {spinning ? 'Spinning...' : hasPlayed ? 'Spin Again' : 'Spin Reels'}
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
        {...(useGameMeta('slots') && {
          title: useGameMeta('slots')!.name,
          description: useGameMeta('slots')!.description
        })}
      />
    </MobileGameContainer>
  )
}

export default MobileSlotsGame