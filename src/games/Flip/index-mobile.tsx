import React, { useState, useRef } from 'react'
import { GambaUi, TokenValue, useCurrentPool, useCurrentToken, useSound, useWagerInput, FAKE_TOKEN_MINT, useTokenMeta } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import styled from 'styled-components'
import { useGameStats } from '../../hooks/game/useGameStats'
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGameMeta } from '../useGameMeta'

// Import sounds
import SOUND_COIN_FLIP from './sounds/coin.mp3'
import SOUND_WIN_FLIP from './sounds/win.mp3'
import SOUND_LOSE_FLIP from './sounds/lose.mp3'
import SOUND_PLAY_FLIP from './sounds/play.mp3'

// Mobile-First Styled Components
const MobileGameContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a0f2e 0%, #2a1810 25%, #8b5a9e 50%, #2a1810 75%, #1a0f2e 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

const MobileHeader = styled.div`
  padding: 16px 20px 8px 20px;
  background: rgba(26, 15, 46, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(212, 165, 116, 0.3);
  z-index: 10;
`

const GameTitle = styled.h1`
  color: #d4a574;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  text-align: center;
`

const GameSubtitle = styled.p`
  color: #8b5a9e;
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
      ? 'rgba(80, 200, 120, 0.2)' 
      : 'rgba(231, 76, 60, 0.2)'
    : 'rgba(139, 90, 158, 0.1)'};
  border: 2px solid ${props => props.$hasResult 
    ? props.$isWin 
      ? 'rgba(80, 200, 120, 0.5)' 
      : 'rgba(231, 76, 60, 0.5)'
    : 'rgba(139, 90, 158, 0.3)'};
  border-radius: 16px;
  transition: all 0.3s ease;
`

const ResultText = styled.div<{ $hasResult: boolean; $isWin?: boolean }>`
  font-size: 16px;
  font-weight: ${props => props.$hasResult ? '700' : '400'};
  color: ${props => props.$hasResult 
    ? props.$isWin 
      ? '#50c878' 
      : '#e74c3c'
    : '#d4a574'};
  margin-bottom: 8px;
`

const WinAmountDisplay = styled.div`
  text-align: center;
  margin-bottom: 24px;
`

const WinAmount = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #d4a574;
  margin-bottom: 4px;
`

const WinLabel = styled.div`
  font-size: 14px;
  color: #8b5a9e;
`

const CoinsDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 20px 0;
  min-height: 120px;
  align-items: center;
`

const Coin = styled.div<{ $flipping?: boolean; $result?: 'heads' | 'tails'; $side: 'heads' | 'tails' }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => {
    if (!props.$result) return 'linear-gradient(135deg, #d4a574 0%, #b8336a 100%)'
    return props.$result === 'heads' 
      ? 'linear-gradient(135deg, #ffd700 0%, #ffa500 100%)'
      : 'linear-gradient(135deg, #c0c0c0 0%, #808080 100%)'
  }};
  border: 3px solid ${props => props.$side === 'heads' ? '#ffd700' : '#c0c0c0'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #2a1810;
  position: relative;
  transform: ${props => props.$flipping ? 'rotateY(720deg)' : 'rotateY(0deg)'};
  transition: transform 0.8s ease-in-out;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
`

const CoinText = styled.div`
  text-transform: uppercase;
  font-size: 10px;
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

const ControlPanel = styled.div<{ $clickable?: boolean }>`
  flex: 1;
  background: rgba(26, 15, 46, 0.8);
  border: 2px solid rgba(139, 90, 158, 0.5);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  
  ${props => props.$clickable && `
    &:active {
      transform: scale(0.98);
      background: rgba(26, 15, 46, 0.6);
    }
  `}
`

const ControlLabel = styled.div`
  font-size: 12px;
  color: #8b5a9e;
  margin-bottom: 6px;
`

const ControlValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #d4a574;
`

const SideSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`

const SideButton = styled.button<{ $active: boolean; $side: 'heads' | 'tails' }>`
  flex: 1;
  padding: 16px 12px;
  background: ${props => props.$active 
    ? props.$side === 'heads'
      ? 'linear-gradient(135deg, #ffd700, #ffa500)'
      : 'linear-gradient(135deg, #c0c0c0, #808080)'
    : 'rgba(26, 15, 46, 0.6)'};
  border: 2px solid ${props => props.$active 
    ? props.$side === 'heads' ? '#ffd700' : '#c0c0c0'
    : 'rgba(139, 90, 158, 0.3)'};
  border-radius: 12px;
  color: ${props => props.$active ? '#2a1810' : '#d4a574'};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  
  &:active {
    transform: scale(0.98);
  }
`

const NumberSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
`

const NumberButton = styled.button`
  width: 40px;
  height: 40px;
  background: rgba(139, 90, 158, 0.6);
  border: 1px solid rgba(212, 165, 116, 0.5);
  border-radius: 8px;
  color: #d4a574;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(139, 90, 158, 0.8);
  }
`

const NumberDisplay = styled.div`
  min-width: 60px;
  padding: 8px 16px;
  background: rgba(26, 15, 46, 0.8);
  border: 2px solid rgba(139, 90, 158, 0.5);
  border-radius: 8px;
  color: #d4a574;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
`

const WagerSection = styled.div`
  margin-bottom: 20px;
`

const WagerInput = styled.div`
  background: rgba(26, 15, 46, 0.8);
  border: 2px solid rgba(139, 90, 158, 0.5);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
`

const WagerLabel = styled.div`
  font-size: 14px;
  color: #8b5a9e;
  margin-bottom: 12px;
`

const WagerAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #d4a574;
  margin-bottom: 16px;
`

const WagerButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`

const WagerButton = styled.button`
  background: rgba(139, 90, 158, 0.6);
  border: 1px solid rgba(212, 165, 116, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: #d4a574;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(139, 90, 158, 0.8);
  }
`

const PlayButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  background: ${props => props.$disabled 
    ? 'rgba(139, 90, 158, 0.4)' 
    : 'linear-gradient(135deg, #d4a574, #b8336a)'};
  border: none;
  border-radius: 16px;
  padding: 18px;
  color: ${props => props.$disabled ? '#8b5a9e' : '#2a1810'};
  font-size: 18px;
  font-weight: 700;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  box-shadow: ${props => props.$disabled 
    ? 'none' 
    : '0 4px 16px rgba(212, 165, 116, 0.4)'};
  
  ${props => !props.$disabled && `
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(212, 165, 116, 0.6);
    }
  `}
`

const MobileFlipGame: React.FC = () => {
  // Essential hooks
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const tokenMeta = useTokenMeta(token?.mint)
  const game = GambaUi.useGame()
  const gameStats = useGameStats('flip')
  
  // Game state
  const [side, setSide] = useState<'heads' | 'tails'>('heads')
  const [numCoins, setNumCoins] = useState(1)
  const [atLeastK, setAtLeastK] = useState(1)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [flipping, setFlipping] = useState(false)
  const [coinResults, setCoinResults] = useState<Array<'heads' | 'tails' | null>>(Array(8).fill(null))
  const [lastGameResult, setLastGameResult] = useState<'win' | 'lose' | null>(null)

  // Effects system
  const effectsRef = useRef<GameplayEffectsRef>(null)

  // Sound system
  const sounds = useSound({
    win: SOUND_WIN_FLIP,
    lose: SOUND_LOSE_FLIP,
    coin: SOUND_COIN_FLIP,
    play: SOUND_PLAY_FLIP,
  })

  // Calculate game values
  const config = BET_ARRAYS_V2['flip']
  const betArray = config.calculateBetArray(numCoins, atLeastK, side)
  
  // Calculate probability and multiplier
  const calculateWinProbability = () => {
    let probability = 0
    for (let m = atLeastK; m <= numCoins; m++) {
      const binomial = (n: number, k: number): number => {
        if (k < 0 || k > n) return 0
        k = Math.min(k, n - k)
        let c = 1
        for (let i = 0; i < k; i++) {
          c = c * (n - i) / (i + 1)
        }
        return c
      }
      probability += binomial(numCoins, m) * Math.pow(0.5, numCoins)
    }
    return probability
  }

  const winProbability = calculateWinProbability()
  const multiplier = winProbability > 0 ? (1 / winProbability) * RTP_TARGETS_V2['flip'] : 0
  const totalWager = wager * numCoins
  const maxWin = multiplier * totalWager
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
      return tokenAmount / numCoins // Divide by numCoins since we multiply wager by numCoins
    }
    
    return (tokenMeta?.baseWager ?? 0.01) / numCoins
  }

  const minWager = getMinimumWager()
  const maxWager = multiplier > 0 ? Math.min(pool.maxPayout / multiplier, pool.balance) / numCoins : pool.balance / numCoins

  // Wager controls
  const adjustWager = (factor: number) => {
    const newWager = Math.max(minWager, wager * factor)
    setWager(newWager)
  }

  // Coin controls
  const adjustNumCoins = (delta: number) => {
    const newNum = Math.max(1, Math.min(8, numCoins + delta))
    setNumCoins(newNum)
    setAtLeastK(Math.min(atLeastK, newNum)) // Ensure atLeastK doesn't exceed numCoins
  }

  const adjustAtLeastK = (delta: number) => {
    const newK = Math.max(1, Math.min(numCoins, atLeastK + delta))
    setAtLeastK(newK)
  }

  const play = async () => {
    if (flipping || totalWager <= 0) return

    try {
      setFlipping(true)
      setHasPlayed(false)
      setLastGameResult(null)
      setCoinResults(Array(8).fill(null))

      sounds.play('play')

      await game.play({
        bet: betArray,
        wager: totalWager,
        metadata: [numCoins, atLeastK, side === 'heads' ? 1 : 0],
      })

      const result = await game.result()
      
      // Trigger coin flip animation
      sounds.play('coin')
      
      // Determine if we won
      const actuallyWon = result.payout > 0
      
      // Use Gamba's resultIndex to generate deterministic results
      const results: Array<'heads' | 'tails'> = []
      
      // Each bit in resultIndex represents one coin flip
      for (let i = 0; i < numCoins; i++) {
        // Extract the i-th bit from resultIndex to determine heads/tails
        const isHeads = ((result.resultIndex >> i) & 1) === 1
        results.push(isHeads ? 'heads' : 'tails')
      }
      
      // Verify results match the actual outcome
      const matchingFlips = results.filter(r => r === side).length
      console.assert(
        (matchingFlips >= atLeastK) === actuallyWon,
        'Visual result does not match game result',
        { matchingFlips, atLeastK, actuallyWon }
      )
      
      // Results are already in deterministic order from Gamba's resultIndex
      
      // Set animation results
      setTimeout(() => {
        const newResults = Array(8).fill(null)
        for (let i = 0; i < numCoins; i++) {
          newResults[i] = results[i]
        }
        setCoinResults(newResults)
        setLastGameResult(actuallyWon ? 'win' : 'lose')
        
        const profit = result.payout - totalWager
        gameStats.updateStats(profit)
        
        setTimeout(() => {
          setHasPlayed(true)
          setFlipping(false)
          sounds.play(actuallyWon ? 'win' : 'lose')
          
          if (actuallyWon) {
            effectsRef.current?.winFlash('#d4a574', 1.5)
            effectsRef.current?.screenShake(1, 600)
          } else {
            effectsRef.current?.loseFlash('#e74c3c', 0.8)
            effectsRef.current?.screenShake(0.5, 400)
          }
        }, 800)
      }, 100)

    } catch (error) {
      console.error('🪙 MOBILE FLIP ERROR:', error)
      setFlipping(false)
      setHasPlayed(false)
      setLastGameResult(null)
    }
  }

  const resetGame = () => {
    setHasPlayed(false)
    setFlipping(false)
    setLastGameResult(null)
    setCoinResults(Array(8).fill(null))
  }

  return (
    <MobileGameContainer>
      {/* Header */}
      <MobileHeader>
        <GameTitle>🪙 Coin Flip</GameTitle>
        <GameSubtitle>Mobile Edition • RTP {(RTP_TARGETS_V2['flip'] * 100).toFixed(0)}%</GameSubtitle>
      </MobileHeader>

      {/* Game Area */}
      <MobileGameArea>
        {/* Result Display */}
        <ResultDisplay $hasResult={hasPlayed && lastGameResult !== null} $isWin={lastGameResult === 'win'}>
          <ResultText $hasResult={hasPlayed && lastGameResult !== null} $isWin={lastGameResult === 'win'}>
            {hasPlayed && lastGameResult !== null ? 
              `${lastGameResult === 'win' ? 'WIN!' : 'LOSE'} - ${coinResults.filter((r, i) => i < numCoins && r === side).length}/${numCoins} ${side}` : 
              'Coin flip results will appear here'
            }
          </ResultText>
        </ResultDisplay>

        {/* Win Amount Display */}
        <WinAmountDisplay>
          <WinAmount>
            <TokenValue exact amount={maxWin} />
          </WinAmount>
          <WinLabel>Possible Winning ({multiplier.toFixed(2)}x)</WinLabel>
        </WinAmountDisplay>

        {/* Coins Display */}
        <CoinsDisplay>
          {Array.from({ length: numCoins }).map((_, i) => (
            <Coin 
              key={i} 
              $flipping={flipping} 
              $result={coinResults[i]} 
              $side={side}
            >
              <CoinText>
                {coinResults[i] ? coinResults[i].substring(0, 1).toUpperCase() : side.substring(0, 1).toUpperCase()}
              </CoinText>
            </Coin>
          ))}
        </CoinsDisplay>

        {/* Side Selector */}
        <SideSelector>
          <SideButton 
            $active={side === 'heads'} 
            $side="heads"
            onClick={() => setSide('heads')}
          >
            🪙 Heads
          </SideButton>
          <SideButton 
            $active={side === 'tails'} 
            $side="tails"
            onClick={() => setSide('tails')}
          >
            🪙 Tails
          </SideButton>
        </SideSelector>

        {/* Controls Section */}
        <ControlsSection>
          <ControlRow>
            <ControlPanel>
              <ControlLabel>Number of Coins</ControlLabel>
              <NumberSelector>
                <NumberButton onClick={() => adjustNumCoins(-1)}>-</NumberButton>
                <NumberDisplay>{numCoins}</NumberDisplay>
                <NumberButton onClick={() => adjustNumCoins(1)}>+</NumberButton>
              </NumberSelector>
            </ControlPanel>
          </ControlRow>

          <ControlRow>
            <ControlPanel>
              <ControlLabel>At Least {atLeastK} {side}</ControlLabel>
              <NumberSelector>
                <NumberButton onClick={() => adjustAtLeastK(-1)}>-</NumberButton>
                <NumberDisplay>{atLeastK}</NumberDisplay>
                <NumberButton onClick={() => adjustAtLeastK(1)}>+</NumberButton>
              </NumberSelector>
            </ControlPanel>
          </ControlRow>

          <ControlRow>
            <ControlPanel>
              <ControlLabel>Win Chance</ControlLabel>
              <ControlValue>{(winProbability * 100).toFixed(1)}%</ControlValue>
            </ControlPanel>
          </ControlRow>
        </ControlsSection>

        {/* Wager Section */}
        <WagerSection>
          <WagerInput>
            <WagerLabel>Wager per Coin (Total: <TokenValue exact amount={totalWager} />)</WagerLabel>
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
          $disabled={gamba.isPlaying || flipping || (!hasPlayed && poolExceeded)}
          onClick={hasPlayed ? resetGame : play}
        >
          {flipping ? 'Flipping...' : hasPlayed ? 'Flip Again' : 'Flip Coins'}
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
        {...(useGameMeta('flip') && {
          title: useGameMeta('flip')!.name,
          description: useGameMeta('flip')!.description
        })}
      />
    </MobileGameContainer>
  )
}

export default MobileFlipGame