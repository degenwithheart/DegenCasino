import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import { DICE_CONFIG } from '../rtpConfig'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, DesktopControls } from '../../components'
import Slider from './Slider'
import { SOUND_LOSE, SOUND_PLAY, SOUND_TICK, SOUND_WIN } from './constants'
import { Container, Result, RollUnder, Stats } from './styles'
import GameScreenFrame from '../../components/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { StyledDiceBackground } from './DiceBackground.enhanced.styles'

// Use centralized bet array calculation
export const outcomes = (odds: number) => {
  return DICE_CONFIG.calculateBetArray(odds)
}

export default function Dice() {
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const pool = useCurrentPool()
  const [resultIndex, setResultIndex] = React.useState(-1)
  const [rollUnderIndex, setRollUnderIndex] = React.useState(Math.floor(100 / 2))
  const sounds = useSound({
    win: SOUND_WIN,
    play: SOUND_PLAY,
    lose: SOUND_LOSE,
    tick: SOUND_TICK,
  })

  const odds = Math.floor((rollUnderIndex / 100) * 100)
  const multiplier = Number(BigInt(100 * BPS_PER_WHOLE) / BigInt(rollUnderIndex)) / BPS_PER_WHOLE

  const bet = React.useMemo(() => outcomes(odds), [rollUnderIndex])

  const maxWin = multiplier * wager

  const game = GambaUi.useGame()

  const play = async () => {
    sounds.play('play')

    await game.play({ wager, bet })

    const result = await game.result()

    const win = result.payout > 0

    // Deterministically derive the revealed number from on-chain result index
    // so there is zero client-side influence over outcome presentation.
    // We map the resultIndex into either the winning interval [0, rollUnderIndex)
    // or the losing interval [rollUnderIndex, 100) depending on payout.
    const seed = `${result.resultIndex}:${result.payout}:${result.multiplier}:${rollUnderIndex}`
    const rng = makeDeterministicRng(seed)
    if (win) {
      const span = rollUnderIndex
      const value = Math.floor(rng() * span) // 0 .. rollUnderIndex-1
      setResultIndex(value)
      sounds.play('win')
    } else {
      const span = 100 - rollUnderIndex
      const value = rollUnderIndex + Math.floor(rng() * span) // rollUnderIndex .. 99
      setResultIndex(value)
      sounds.play('lose')
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <StyledDiceBackground>
          {/* Mystical background elements */}
          <div className="mystical-bg-elements" />
          <div className="sacred-overlay" />
          
          <GameScreenFrame {...(useGameMeta('dice') && { title: useGameMeta('dice')!.name, description: useGameMeta('dice')!.description })}>
            <GambaUi.Responsive>
              <div className="dice-content">
                <Container>
                  <RollUnder className="roll-under-display">
                    <div>
                      <div>{rollUnderIndex + 1}</div>
                      <div>Sacred Number</div>
                    </div>
                  </RollUnder>
                  <Stats className="ancient-stats">
                    <div>
                      <div>{(rollUnderIndex / 100 * 100).toFixed(0)}%</div>
                      <div>Whispered Prayer</div>
                    </div>
                    <div>
                      <div>{multiplier.toFixed(2)}x</div>
                      <div>Divine Blessing</div>
                    </div>
                    <div>
                      {maxWin > pool.maxPayout ? (
                        <div style={{ color: '#fca5a5' }}>🔮 Too ambitious</div>
                      ) : (
                        <div><TokenValue suffix="" amount={maxWin} /></div>
                      )}
                      <div>Sacred Reward</div>
                    </div>
                  </Stats>
                  <div className="sacred-slider-container" style={{ position: 'relative' }}>
                    {resultIndex > -1 && (
                      <Result style={{ left: `${resultIndex / 100 * 100}%` }}>
                        <div key={resultIndex}>{resultIndex + 1}</div>
                      </Result>
                    )}
                    <Slider
                      disabled={gamba.isPlaying}
                      range={[0, 100]}
                      min={1}
                      max={100 - 5}
                      value={rollUnderIndex}
                      onChange={(value) => {
                        setRollUnderIndex(value)
                        sounds.play('tick')
                      }}
                    />
                  </div>
                </Container>
              </div>
            </GambaUi.Responsive>
          </GameScreenFrame>
        </StyledDiceBackground>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          playDisabled={false}
          playText="Roll"
        />
        
        <DesktopControls>
          <EnhancedWagerInput value={wager} onChange={setWager} />
          <EnhancedPlayButton onClick={play}>Roll</EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}
