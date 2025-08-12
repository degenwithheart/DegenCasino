import { computed } from '@preact/signals-react'
import {
  FAKE_TOKEN_MINT,
  GambaUi,
  TokenValue,
  useCurrentPool,
  useCurrentToken,
  useSound,
  useUserBalance,
} from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React, { useState, useContext, useRef } from 'react'
import { GambaResultContext } from '../../context/GambaResultContext'
import styled, { keyframes } from 'styled-components'
import { GameControls } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { useIsCompact } from '../../hooks/useIsCompact';
import { Chip } from './Chip'
import { StyledResults } from './Roulette.styles'
import { Table } from './Table'
import {
  CHIPS,
  SOUND_LOSE,
  SOUND_PLAY,
  SOUND_WIN,
  NUMBERS,
} from './constants'
import {
  addResult,
  bet,
  clearChips,
  results,
  selectedChip,
  totalChipValue,
  addChips,
  chipPlacements,
} from './signals'
import { Wheel } from './Wheel'
import RoulettePaytable, { RoulettePaytableRef } from './RoulettePaytable'

// Add global keyframes for animations
const pulseAnimation = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`

// Inject global styles for animations
const GlobalStyle = styled.div`
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
`

const Wrapper = styled.div`
  display: grid;
  gap: 24px;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  color: white;
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
`

const Container = styled.div`
  display: flex;
  gap: 15%;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 20px;
  }
`

const WheelWrapper = styled.div`
  flex-shrink: 0;
  min-width: 280px;
  @media (max-width: 600px) {
    display: none;
  }
`

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 600px;
`


function Results() {
  const _results = computed(() => [...results.value].reverse())
  return (
    <StyledResults>
      {_results.value.map((n, i) => (
        <div key={i}>{n}</div>
      ))}
    </StyledResults>
  )
}

function Stats() {
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const balance = useUserBalance()
  const baseWager = token?.baseWager ?? Math.pow(10, token?.decimals ?? 9)

  const wager = totalChipValue.value * baseWager / 10_000
  const multiplier = Math.max(...bet.value)
  const maxPayout = multiplier * wager
  const maxPayoutExceeded = maxPayout > pool.maxPayout
  const balanceExceeded = wager > (balance.balance + balance.bonusBalance)

  return (
    <div style={{ textAlign: 'center', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div>
        {balanceExceeded ? (
          <span style={{ color: '#ff0066' }}>TOO HIGH</span>
        ) : (
          <>
            <TokenValue mint={token.mint} amount={wager} />
          </>
        )}
        <div>Wager</div>
      </div>
      <div>
        {maxPayoutExceeded ? (
          <span style={{ color: '#ff0066' }}>TOO HIGH</span>
        ) : (
          <>
            <TokenValue mint={token.mint} amount={maxPayout} />
            ({multiplier.toFixed(2)}x)
          </>
        )}
        <div>Potential win</div>
      </div>
    </div>
  )
}


export default function Roulette() {
  const { setGambaResult } = useContext(GambaResultContext)
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const token = useCurrentToken()
  const pool = useCurrentPool()
  const balance = useUserBalance()
  const isCompact = useIsCompact()
  const baseWager = token?.baseWager ?? Math.pow(10, token?.decimals ?? 9)
  const tokenPrice = token?.usdPrice

  // Live paytable tracking
  const paytableRef = useRef<RoulettePaytableRef>(null)
  const [currentResult, setCurrentResult] = React.useState<{
    winningNumber: number
    betsPlaced: { [position: string]: number }
    totalWon: number
    winningBets: string[]
    wasWin: boolean
  } | undefined>()

  // 2-Phase Game State
  const [gamePhase, setGamePhase] = useState<'betting' | 'spinning'>('betting')
  const [isSpinning, setIsSpinning] = useState(false)
  const [latestResult, setLatestResult] = useState<number | null>(null)
  const [spinTrigger, setSpinTrigger] = useState(0)

  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
  } = useGameOutcome()

  // State for live token wager
  const [liveWager, setLiveWager] = useState(0)

  // Determine if using fake token
  const isFakeToken = token?.mint?.equals?.(FAKE_TOKEN_MINT)

  // Wager and bet logic
  const wager = isFakeToken
    ? totalChipValue.value * baseWager / 10_000
    : liveWager
  const betValue = isFakeToken ? bet.value : Array(NUMBERS).fill(1 / NUMBERS)
  const multiplier = Math.max(...betValue)
  const maxPayout = multiplier * wager
  const balanceExceeded = wager > (balance.balance + balance.bonusBalance)
  const maxPayoutExceeded = maxPayout > pool.maxPayout

  // Responsive scaling logic - slightly more conservative for Roulette
  const getResponsiveScale = () => {
    if (typeof window === 'undefined') return 1.15;
    const width = window.innerWidth;
    if (width <= 400) return 0.85;
    if (width <= 600) return 0.95;
    if (width <= 900) return 1.05;
    if (width <= 1200) return 1.1;
    return 1.15;
  };

  const [scale, setScale] = React.useState(getResponsiveScale());

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScale(getResponsiveScale());
      }, 150); // Debounce resize events
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
  })

  const play = async () => {
    if (isSpinning) return
    
    // Phase 1: Betting completed, move to spinning phase
    setGamePhase('spinning')
    setIsSpinning(true)

    await game.play({ bet: betValue, wager })
    sounds.play('play')

    const result = await game.result()
    setLatestResult(result.resultIndex)
    setSpinTrigger(prev => prev + 1)

    // Set Gamba result in context
    setGambaResult(result)

    setTimeout(() => {
      addResult(result.resultIndex)
      setIsSpinning(false)
      
      // Track result in paytable
      const winningNumber = result.resultIndex
      const betsPlaced = { ...chipPlacements.value }
      const wasWin = result.payout > 0
      const winningBets: string[] = [] // Could be enhanced to track specific winning bet types
      
      const resultData = {
        winningNumber,
        betsPlaced,
        totalWon: result.payout,
        winningBets,
        wasWin
      }
      setCurrentResult(resultData)
      
      if (paytableRef.current) {
        paytableRef.current.trackSpin({
          winningNumber,
          betsPlaced,
          totalWon: result.payout,
          winningBets,
          wasWin,
          totalWagered: wager
        })
      }
      
      // Return to betting phase after result
      setTimeout(() => {
        setGamePhase('betting')
        // Handle game outcome
        handleGameComplete({ payout: result.payout, wager })
        if (result.payout > 0) {
          sounds.play('win')
        } else {
          sounds.play('lose')
        }
      }, 2000)
    }, 3000)
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main Game Area */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.5) 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)',
              opacity: gamePhase === 'spinning' ? 1 : 0.3,
              transition: 'opacity 0.5s ease'
            }} />

            {/* Phase 1: Betting Table */}
            {gamePhase === 'betting' && (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                opacity: gamePhase === 'betting' ? 1 : 0,
                transition: 'opacity 0.5s ease',
                position: 'relative',
                zIndex: 10
              }}>
                {/* Betting Phase Header */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '16px',
                  padding: '16px 24px',
                  marginBottom: '24px',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#DC2626', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                    🎰 PLACE YOUR BETS
                  </div>
                  <Stats />
                </div>

                {/* Roulette Table */}
                <div style={{
                  width: '100%',
                  maxWidth: '900px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px'
                }}>
                  <Table disabled={false} />
                  
                  {/* Recent Results */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textAlign: 'center' }}>
                      RECENT RESULTS
                    </div>
                    <Results />
                  </div>
                </div>
              </div>
            )}

            {/* Phase 2: Spinning Wheel */}
            {gamePhase === 'spinning' && (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: gamePhase === 'spinning' ? 1 : 0,
                transition: 'opacity 0.5s ease',
                position: 'relative',
                zIndex: 10
              }}>
                {/* Spinning Phase Header */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0, 0, 0, 0.8)',
                  borderRadius: '16px',
                  padding: '12px 24px',
                  border: '2px solid rgba(220, 38, 38, 0.5)',
                  animation: isSpinning ? 'pulse 2s infinite' : 'none'
                }}>
                  <div style={{ color: '#DC2626', fontSize: '16px', fontWeight: 700, textAlign: 'center' }}>
                    {isSpinning ? '🎲 SPINNING...' : '🎯 RESULT'}
                  </div>
                </div>

                {/* Large Wheel Display */}
                <div style={{
                  transform: 'scale(1.5)',
                  transformOrigin: 'center'
                }}>
                  <Wheel key={spinTrigger} winningNumber={latestResult ?? 0} />
                </div>

                {/* Result Display */}
                {!isSpinning && latestResult !== null && (
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.9)',
                    borderRadius: '20px',
                    padding: '20px 32px',
                    border: '3px solid rgba(220, 38, 38, 0.7)',
                    textAlign: 'center',
                    minWidth: '250px'
                  }}>
                    <div style={{ color: '#DC2626', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                      WINNING NUMBER
                    </div>
                    <div style={{ 
                      color: '#fff', 
                      fontSize: '32px', 
                      fontWeight: 900,
                      marginBottom: '8px'
                    }}>
                      {latestResult}
                    </div>
                    {currentResult && (
                      <div style={{ color: currentResult.wasWin ? '#22C55E' : '#EF4444', fontSize: '16px', fontWeight: 700 }}>
                        {currentResult.wasWin ? `+${currentResult.totalWon.toLocaleString()}` : 'No Win'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Phase Transition Overlay */}
            {gamePhase === 'spinning' && isSpinning && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5
              }}>
                <div style={{
                  color: '#DC2626',
                  fontSize: '24px',
                  fontWeight: 700,
                  textShadow: '0 0 20px rgba(220, 38, 38, 0.8)',
                  animation: 'pulse 1.5s infinite'
                }}>
                  NO MORE BETS
                </div>
              </div>
            )}
          </div>

          {/* Live Paytable Panel - Always Visible */}
          <RoulettePaytable
            ref={paytableRef}
            totalBet={totalChipValue.value}
            wager={wager}
            currentResult={currentResult}
          />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={isFakeToken ? () => {} : setLiveWager}
        onPlay={play}
        isPlaying={isSpinning || gamePhase === 'spinning'}
        playButtonText={
          gamePhase === 'spinning' ? 'Spinning...' :
          hasPlayedBefore ? 'Spin Again' : 'Spin'
        }
        playButtonDisabled={balanceExceeded || maxPayoutExceeded || gamePhase === 'spinning'}
      >
        {isFakeToken && gamePhase === 'betting' && (
          <>
            {/* Chip Selection Controls */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>Chip Value:</span>
              {CHIPS.map(chip => (
                <div
                  key={chip}
                  style={{
                    display: 'inline-block',
                    marginRight: 4,
                    background: selectedChip.value === chip 
                      ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(185, 28, 28, 0.3) 100%)'
                      : undefined,
                    border: selectedChip.value === chip 
                      ? '1px solid rgba(220, 38, 38, 0.5)' 
                      : undefined,
                    borderRadius: 4,
                  }}
                >
                  <GambaUi.Button
                    onClick={() => selectedChip.value = chip}
                    disabled={isSpinning || showOutcome}
                  >
                    {selectedChip.value === chip ? `[${chip}]` : chip}
                  </GambaUi.Button>
                </div>
              ))}
            </div>

            {/* Clear Chips Button */}
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                borderRadius: '6px',
                display: 'inline-block'
              }}
            >
              <GambaUi.Button
                onClick={clearChips}
                disabled={isSpinning || showOutcome || totalChipValue.value === 0}
              >
                Clear Chips
              </GambaUi.Button>
            </div>
          </>
        )}
      </GameControls>
    </>
  )
}
