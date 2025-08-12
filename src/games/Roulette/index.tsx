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
import React, { useState, useRef } from 'react'
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
import RouletteOverlays from './RouletteOverlays'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

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

  // Game phase management for overlays
  const [overlayGamePhase, setOverlayGamePhase] = React.useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')
  const [thinkingPhase, setThinkingPhase] = React.useState(false)
  const [dramaticPause, setDramaticPause] = React.useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(0)
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🤔')

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

    // Start overlay sequence
    setOverlayGamePhase('thinking')
    setThinkingPhase(true)
    setDramaticPause(false)
    setCelebrationIntensity(0)
    
    // Random thinking emoji
    const thinkingEmojis = ['🤔', '🎡', '🎯', '⚡', '🔮', '🎰']
    setThinkingEmoji(thinkingEmojis[Math.floor(Math.random() * thinkingEmojis.length)])

    await game.play({ bet: betValue, wager })
    sounds.play('play')

    // Thinking phase
    await new Promise(resolve => setTimeout(resolve, 1500))
    setThinkingPhase(false)
    
    // Dramatic pause
    setOverlayGamePhase('dramatic')
    setDramaticPause(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    setDramaticPause(false)

    const result = await game.result()
    setLatestResult(result.resultIndex)
    setSpinTrigger(prev => prev + 1)

    // Set Gamba result in context

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
      
      // Handle celebration or mourning overlays
      if (wasWin) {
        const multiplier = result.payout / wager
        let intensity = 1
        if (multiplier >= 20) intensity = 3
        else if (multiplier >= 5) intensity = 2
        
        setCelebrationIntensity(intensity)
        setOverlayGamePhase('celebrating')
        sounds.play('win')
        
        // Auto-reset after celebration
        setTimeout(() => {
          setOverlayGamePhase('idle')
          setCelebrationIntensity(0)
        }, 4000)
      } else {
        setOverlayGamePhase('mourning')
        sounds.play('lose')
        
        // Auto-reset after mourning
        setTimeout(() => {
          setOverlayGamePhase('idle')
        }, 2500)
      }
      
      // Return to betting phase after result
      setTimeout(() => {
        setGamePhase('betting')
        // Handle game outcome
        handleGameComplete({ payout: result.payout, wager })
      }, 2000)
    }, 3000)
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main game area */}
          <div
            style={{
              flex: 1,
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0f1419 0%, #1a1a2e 50%, #16213e 100%)',
              borderRadius: '20px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              boxShadow: `
                0 20px 40px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2)
              `,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Decorative corner elements */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `
                radial-gradient(circle at 20% 20%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
              `,
              pointerEvents: 'none',
            }} />

            {/* Phase 1: Betting Table */}
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              opacity: gamePhase === 'betting' ? 1 : 0,
              transform: gamePhase === 'betting' ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              position: gamePhase === 'betting' ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: gamePhase === 'betting' ? 10 : 1
            }}>
              {/* Roulette Table - Full Width */}
              <div style={{
                width: '100%',
                display: 'block',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}>
                <Table disabled={false} />
                
                {/* Recent Results - Moved to bottom of table */}
                <div style={{
                  margin: 'auto',
                  background: 'rgba(0, 0, 0, 0.8)',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  width: 'fit-content'
                }}>
                  <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textAlign: 'center' }}>
                    RECENT RESULTS
                  </div>
                  <Results />
                </div>
              </div>
            </div>

            {/* Phase 2: Spinning Wheel */}
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: gamePhase === 'spinning' ? 1 : 0,
              transform: gamePhase === 'spinning' ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              position: gamePhase === 'spinning' ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: gamePhase === 'spinning' ? 10 : 1
            }}>
              {/* Large Wheel Display */}
              <div style={{
                transform: 'scale(1.5)',
                transformOrigin: 'center',
                transition: 'transform 0.6s ease-out'
              }}>
                <Wheel key={spinTrigger} winningNumber={latestResult ?? 0} />
              </div>

              {/* Result Display */}
              {!isSpinning && latestResult !== null && (
                <div style={{
                  position: 'absolute',
                  bottom: '40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '20px',
                  padding: '20px 32px',
                  border: '3px solid rgba(220, 38, 38, 0.7)',
                  textAlign: 'center',
                  minWidth: '250px',
                  animation: 'slideUpFade 0.8s ease-out'
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

            {/* Phase Transition Effects */}
            {gamePhase === 'spinning' && isSpinning && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
                animation: 'fadeIn 0.5s ease-out'
              }}>
                <div style={{
                  color: '#DC2626',
                  fontSize: '24px',
                  fontWeight: 700,
                  textShadow: '0 0 20px rgba(220, 38, 38, 0.8)',
                  animation: 'pulseGlow 1.5s infinite',
                  background: 'rgba(0, 0, 0, 0.8)',
                  padding: '20px 40px',
                  borderRadius: '16px',
                  border: '2px solid rgba(220, 38, 38, 0.5)'
                }}>
                  🎲 NO MORE BETS
                </div>
              </div>
            )}
            
            {/* Add the overlay component - conditionally rendered based on ENABLE_THINKING_OVERLAY */}
            {renderThinkingOverlay(
              <RouletteOverlays
                gamePhase={getGamePhaseState(overlayGamePhase)}
                thinkingPhase={getThinkingPhaseState(thinkingPhase)}
                dramaticPause={dramaticPause}
                celebrationIntensity={celebrationIntensity}
                currentWin={currentResult?.wasWin ? { multiplier: currentResult.totalWon / wager, amount: currentResult.totalWon - wager } : undefined}
                thinkingEmoji={thinkingEmoji}
              />
            )}
          </div>

          {/* Paytable sidebar */}
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
        showOutcome={showOutcome}
        playButtonText={
          gamePhase === 'spinning' ? 'Spinning...' :
          hasPlayedBefore ? 'Spin Again' : 'Spin'
        }
        playButtonDisabled={balanceExceeded || maxPayoutExceeded || gamePhase === 'spinning'}
        onPlayAgain={handlePlayAgain}
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
      
      {/* Enhanced Animation Styles */}
      <style>
        {`
          @keyframes slideUpFade {
            0% {
              opacity: 0;
              transform: translateX(-50%) translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
          
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          
          @keyframes pulseGlow {
            0%, 100% {
              opacity: 1;
              text-shadow: 0 0 20px rgba(220, 38, 38, 0.8);
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              text-shadow: 0 0 30px rgba(220, 38, 38, 1);
              transform: scale(1.05);
            }
          }
          
          @keyframes pulse {
            0%, 100% { 
              opacity: 1; 
              transform: scale(1); 
            }
            50% { 
              opacity: 0.8; 
              transform: scale(1.05); 
            }
          }
        `}
      </style>
    </>
  )
}
