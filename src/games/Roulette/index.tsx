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
import React, { useState, useContext } from 'react'
import { GambaResultContext } from '../../context/GambaResultContext'
import styled from 'styled-components'
import { GameControls, GameScreenLayout } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
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
} from './signals'
import { Wheel } from './Wheel'

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
  const baseWager = token?.baseWager ?? Math.pow(10, token?.decimals ?? 9)
  const tokenPrice = token?.usdPrice

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

  const [spinTrigger, setSpinTrigger] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [latestResult, setLatestResult] = useState<number | null>(null)

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
      // Handle game outcome
      handleGameComplete({ payout: result.payout, wager })
      if (result.payout > 0) {
        sounds.play('win')
      } else {
        sounds.play('lose')
      }
    }, 3000)
  }

  return (
    <GambaUi.Portal target="screen">
      <GameScreenLayout
        left={
          <GambaUi.Responsive>
            <div style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease-out'
            }} className="roulette-game-scaler">
              <Wrapper onContextMenu={(e) => e.preventDefault()}>
                <Stats />
                <Container>
                  <WheelWrapper>
                    <Wheel key={spinTrigger} winningNumber={latestResult ?? 0} />
                  </WheelWrapper>
                  <ControlsWrapper>
                    <Results />
                    <Table />
                  </ControlsWrapper>
                </Container>
              </Wrapper>
            </div>
          </GambaUi.Responsive>
        }
        right={
          <GameControls
            wager={wager}
            setWager={isFakeToken ? () => {} : setLiveWager}
            onPlay={play}
            isPlaying={isSpinning}
            playButtonText={hasPlayedBefore ? 'Spin Again' : 'Spin'}
            playButtonDisabled={balanceExceeded || maxPayoutExceeded}
          >
            {isFakeToken && (
              <>
                {/* Chip Selection Controls */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold' }}>Chip Value:</span>
                  {CHIPS.map(chip => (
                    <GambaUi.Button
                      key={chip}
                      onClick={() => selectedChip.value = chip}
                      disabled={isSpinning || showOutcome}
                    >
                      {selectedChip.value === chip ? `[${chip}]` : chip}
                    </GambaUi.Button>
                  ))}
                </div>

                {/* Clear Chips Button */}
                <GambaUi.Button
                  onClick={clearChips}
                  disabled={isSpinning || showOutcome || totalChipValue.value === 0}
                >
                  Clear Chips
                </GambaUi.Button>
              </>
            )}
          </GameControls>
        }
      />
    </GambaUi.Portal>
  )
}
