import React, { useState, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { Keypair, PublicKey } from '@solana/web3.js'
import { GambaUi, useSound } from 'gamba-react-ui-v2'
import { Canvas } from '@react-three/fiber'
import { DiceGroup } from '../three/DiceGroup'
import { Effect } from '../three/Effect'
import { PredictionType } from '../types'
import { getMinRoll, getMaxRoll, getDefaultTarget, checkWin } from '../utils'
import { DEFAULT_DICE_COUNT, MIN_DICE_COUNT, MAX_DICE_COUNT } from '../config'
import { SOUND_ROLL, SOUND_WIN, SOUND_LOSE } from '../constants'
import DICEDUAL_THEME from '../theme'
import { MobileControls, DesktopControls } from '../../../components'
import { useIsCompact } from '../../../hooks/ui/useIsCompact'
import { useGameStats } from '../../../hooks/game/useGameStats'
import { useUserStore } from '../../../hooks/data/useUserStore'
import GameplayFrame, { GameplayEffectsRef } from '../../../components/Game/GameplayFrame'
import { useGraphics } from '../../../components/Game/GameScreenFrame'

const Page = styled.div`
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
`

const Panel = styled.div`
  background: linear-gradient(180deg, ${DICEDUAL_THEME.colors.bgGradientStart} 0%, ${DICEDUAL_THEME.colors.bgGradientEnd} 100%);
  border: 1px solid ${DICEDUAL_THEME.colors.border};
  border-radius: ${DICEDUAL_THEME.sizes.borderRadius};
  padding: 24px;
  box-shadow: 0 6px 24px ${DICEDUAL_THEME.colors.shadow};
`

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  h2 { 
    margin: 0; 
    font-size: 1.5rem;
    background: linear-gradient(135deg, ${DICEDUAL_THEME.colors.primary} 0%, ${DICEDUAL_THEME.colors.secondary} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`

const FormGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const Field = styled.label`
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: ${DICEDUAL_THEME.colors.labelColor};
`

const Label = styled.span`
  font-weight: 600;
  color: ${DICEDUAL_THEME.colors.activeLabelColor};
`

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border-radius: ${DICEDUAL_THEME.sizes.buttonRadius};
  border: 1px solid #333;
  background: #222;
  color: #fff;
  outline: none;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: ${DICEDUAL_THEME.colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: ${DICEDUAL_THEME.sizes.buttonRadius};
  border: 1px solid #333;
  background: #222;
  color: #fff;
  outline: none;
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    border-color: ${DICEDUAL_THEME.colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`

const Helper = styled.div`
  color: ${DICEDUAL_THEME.colors.textSecondary};
  font-size: 12px;
  line-height: 1.4;
`

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const InfoOverlay = styled.div`
  position: absolute;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  z-index: 10;
`

const InfoCard = styled.div`
  background: linear-gradient(135deg, rgba(20, 20, 30, 0.95), rgba(12, 12, 20, 0.9));
  padding: 20px 28px;
  border-radius: 16px;
  border: 1px solid ${DICEDUAL_THEME.colors.border};
  box-shadow: 0 12px 40px ${DICEDUAL_THEME.colors.shadow};
  backdrop-filter: blur(10px);
  text-align: center;
`

const PlayerCard = styled.div<{ $highlight?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: ${DICEDUAL_THEME.sizes.borderRadius};
  background: ${({ $highlight }) =>
    $highlight
      ? `linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))`
      : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${({ $highlight }) => ($highlight ? 'rgba(102, 126, 234, 0.5)' : DICEDUAL_THEME.colors.border)};
  min-width: 140px;
`

const PlayerName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${DICEDUAL_THEME.colors.textPrimary};
`

const PlayerPrediction = styled.div`
  font-size: 0.75rem;
  color: ${DICEDUAL_THEME.colors.labelColor};
`

const VSBadge = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.08));
  border: 2px solid ${DICEDUAL_THEME.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: 1px;
  color: ${DICEDUAL_THEME.colors.textPrimary};
`

const ResultOverlay = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  pointer-events: ${({ $show }) => ($show ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
  background: linear-gradient(135deg, rgba(20, 20, 30, 0.95), rgba(12, 12, 20, 0.9));
  padding: 32px 48px;
  border-radius: 16px;
  border: 1px solid ${DICEDUAL_THEME.colors.border};
  text-align: center;
  min-width: 300px;
`

const ResultTitle = styled.div<{ $win?: boolean; $tie?: boolean }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ $win, $tie }) => ($tie ? DICEDUAL_THEME.colors.tie : $win ? DICEDUAL_THEME.colors.win : DICEDUAL_THEME.colors.lose)};
  margin-bottom: 16px;
`

const ResultSubtitle = styled.div`
  font-size: 1.2rem;
  color: ${DICEDUAL_THEME.colors.activeLabelColor};
`

export default function DebugGameScreen({ onBack }: { onBack: () => void }) {
  const { mobile: isMobile } = useIsCompact()
  const gameStats = useGameStats('dicedual')
  const { settings } = useGraphics()
  const enableEffects = settings.enableEffects
  const effectsRef = useRef<GameplayEffectsRef>(null)

  // Audio system with deferral
  const deferAudio = useUserStore(s => !!s.deferAudio)
  const [audioLoaded, setAudioLoaded] = React.useState(!deferAudio)

  const sounds = useSound(audioLoaded ? {
    roll: SOUND_ROLL,
    win: SOUND_WIN,
    lose: SOUND_LOSE,
  } : {})

  // Load audio on first interaction if deferred
  React.useEffect(() => {
    if (deferAudio && !audioLoaded) {
      const loadAudio = () => setAudioLoaded(true)
      window.addEventListener('click', loadAudio, { once: true })
      window.addEventListener('keydown', loadAudio, { once: true })
      return () => {
        window.removeEventListener('click', loadAudio)
        window.removeEventListener('keydown', loadAudio)
      }
    }
  }, [deferAudio, audioLoaded])

  const [diceCount, setDiceCount] = useState(DEFAULT_DICE_COUNT)
  const [player1Prediction, setPlayer1Prediction] = useState<PredictionType>('over')
  const [player1Target, setPlayer1Target] = useState(getDefaultTarget(DEFAULT_DICE_COUNT))
  const [player2Prediction, setPlayer2Prediction] = useState<PredictionType>('under')
  const [player2Target, setPlayer2Target] = useState(getDefaultTarget(DEFAULT_DICE_COUNT))
  const [youArePlayer, setYouArePlayer] = useState<1 | 2>(1)

  const [started, setStarted] = useState(false)
  const [rolling, setRolling] = useState(false)
  const [diceResults, setDiceResults] = useState<number[]>([])
  const [revealed, setRevealed] = useState(false)

  const minRoll = getMinRoll(diceCount)
  const maxRoll = getMaxRoll(diceCount)

  const start = useCallback(() => {
    setStarted(true)
    setRolling(true)
    setRevealed(false)

    sounds.play('roll')

    // Simulate dice roll after 2 seconds
    setTimeout(() => {
      const results = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1)
      setDiceResults(results)
      setRolling(false)

      // Show result after brief pause
      setTimeout(() => {
        setRevealed(true)

        const total = results.reduce((a, b) => a + b, 0)
        const player1Wins = checkWin(total, player1Prediction, player1Target)
        const player2Wins = checkWin(total, player2Prediction, player2Target)
        
        let winner: 1 | 2 | 'tie' = 'tie'
        if (player1Wins && !player2Wins) winner = 1
        else if (player2Wins && !player1Wins) winner = 2

        const youWon = winner === youArePlayer
        const isTie = winner === 'tie'

        // Update stats (simulate wager for tracking purposes)
        const simulatedWager = 1
        const profit = youWon ? simulatedWager : (isTie ? 0 : -simulatedWager)
        gameStats.updateStats(profit)

        // Play sound and effects
        if (isTie) {
          // Tie sound can use lose sound
          sounds.play('lose')
          if (enableEffects) {
            effectsRef.current?.winFlash(DICEDUAL_THEME.colors.tie, 1.0)
            effectsRef.current?.screenShake(0.5, 400)
          }
        } else if (youWon) {
          sounds.play('win')
          if (enableEffects) {
            effectsRef.current?.winFlash(DICEDUAL_THEME.colors.win, 1.5)
            effectsRef.current?.screenShake(1, 600)
          }
        } else {
          sounds.play('lose')
          if (enableEffects) {
            effectsRef.current?.loseFlash(DICEDUAL_THEME.colors.lose, 0.8)
            effectsRef.current?.screenShake(0.5, 400)
          }
        }
      }, 500)
    }, 2000)
  }, [diceCount, player1Prediction, player1Target, player2Prediction, player2Target, youArePlayer, sounds, enableEffects, gameStats])

  const reset = useCallback(() => {
    setStarted(false)
    setRolling(false)
    setDiceResults([])
    setRevealed(false)
  }, [])

  const total = diceResults.reduce((a, b) => a + b, 0)
  const player1Wins = revealed && checkWin(total, player1Prediction, player1Target)
  const player2Wins = revealed && checkWin(total, player2Prediction, player2Target)
  
  let winner: 1 | 2 | 'tie' = 'tie'
  if (player1Wins && !player2Wins) winner = 1
  else if (player2Wins && !player1Wins) winner = 2

  const youWon = winner === youArePlayer
  const isTie = winner === 'tie'

  return (
    <>
      {!started && (
        <Page>
          <Panel>
            <PanelHeader>
              <h2>🐞 Debug Simulator</h2>
            </PanelHeader>

            <FormGrid>
              <Field>
                <Label>Number of Dice</Label>
                <Select
                  value={diceCount}
                  onChange={(e) => {
                    const newCount = Number(e.target.value)
                    setDiceCount(newCount)
                    setPlayer1Target(getDefaultTarget(newCount))
                    setPlayer2Target(getDefaultTarget(newCount))
                  }}
                >
                  {Array.from({ length: MAX_DICE_COUNT - MIN_DICE_COUNT + 1 }, (_, i) => MIN_DICE_COUNT + i).map((n) => (
                    <option key={n} value={n}>
                      {n}d6
                    </option>
                  ))}
                </Select>
                <Helper>Choose how many dice to roll</Helper>
              </Field>

              <Field>
                <Label>You Are</Label>
                <Select value={youArePlayer} onChange={(e) => setYouArePlayer(Number(e.target.value) as 1 | 2)}>
                  <option value={1}>Player 1</option>
                  <option value={2}>Player 2</option>
                </Select>
                <Helper>Which player perspective to view</Helper>
              </Field>

              <Field>
                <Label>Player 1 - Prediction</Label>
                <Select value={player1Prediction} onChange={(e) => setPlayer1Prediction(e.target.value as PredictionType)}>
                  <option value="over">Over</option>
                  <option value="under">Under</option>
                  <option value="exact">Exact</option>
                </Select>
                <Helper>Player 1's bet type</Helper>
              </Field>

              <Field>
                <Label>Player 1 - Target ({minRoll}-{maxRoll})</Label>
                <Input
                  type="number"
                  min={minRoll}
                  max={maxRoll}
                  value={player1Target}
                  onChange={(e) => setPlayer1Target(Number(e.target.value))}
                />
                <Helper>Player 1's target number</Helper>
              </Field>

              <Field>
                <Label>Player 2 - Prediction</Label>
                <Select value={player2Prediction} onChange={(e) => setPlayer2Prediction(e.target.value as PredictionType)}>
                  <option value="over">Over</option>
                  <option value="under">Under</option>
                  <option value="exact">Exact</option>
                </Select>
                <Helper>Player 2's bet type</Helper>
              </Field>

              <Field>
                <Label>Player 2 - Target ({minRoll}-{maxRoll})</Label>
                <Input
                  type="number"
                  min={minRoll}
                  max={maxRoll}
                  value={player2Target}
                  onChange={(e) => setPlayer2Target(Number(e.target.value))}
                />
                <Helper>Player 2's target number</Helper>
              </Field>
            </FormGrid>
          </Panel>
        </Page>
      )}

      {started && (
        <Container>
          <GambaUi.Portal target="screen">
            <Canvas
              orthographic
              camera={{ zoom: 60, position: [0, 0, 100] }}
              style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)' }}
            >
              <React.Suspense fallback={null}>
                <DiceGroup count={diceCount} results={diceResults} rolling={rolling} />
              </React.Suspense>
              {rolling && <Effect color="white" />}
              {revealed && <Effect color={isTie ? DICEDUAL_THEME.colors.tie : youWon ? DICEDUAL_THEME.colors.win : DICEDUAL_THEME.colors.lose} />}
              <ambientLight intensity={2} />
              <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
              <pointLight position={[-5, -5, 5]} intensity={0.5} />
            </Canvas>

            <InfoOverlay>
              <InfoCard style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                <PlayerCard $highlight={revealed && winner === 1}>
                  <PlayerName>{youArePlayer === 1 ? 'You' : 'Player 1'}</PlayerName>
                  <PlayerPrediction>
                    {player1Prediction} {player1Target}
                  </PlayerPrediction>
                  {revealed && player1Wins && <span style={{ color: DICEDUAL_THEME.colors.win, fontWeight: 700 }}>✓ Won</span>}
                </PlayerCard>

                <VSBadge>VS</VSBadge>

                <PlayerCard $highlight={revealed && winner === 2}>
                  <PlayerName>{youArePlayer === 2 ? 'You' : 'Player 2'}</PlayerName>
                  <PlayerPrediction>
                    {player2Prediction} {player2Target}
                  </PlayerPrediction>
                  {revealed && player2Wins && <span style={{ color: DICEDUAL_THEME.colors.win, fontWeight: 700 }}>✓ Won</span>}
                </PlayerCard>
              </InfoCard>
            </InfoOverlay>

            <ResultOverlay $show={revealed}>
              <ResultTitle $win={youWon} $tie={isTie}>
                {isTie ? '🤝 Tie!' : youWon ? '🎉 You Win!' : '💀 You Lose'}
              </ResultTitle>
              <ResultSubtitle>Total: {total}</ResultSubtitle>
              {isTie && (
                <div style={{ marginTop: 12, color: DICEDUAL_THEME.colors.labelColor, fontSize: '0.9rem' }}>
                  Both players {player1Wins ? 'won' : 'lost'}
                </div>
              )}
            </ResultOverlay>

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
            />
          </GambaUi.Portal>

          <GambaUi.Portal target="controls">
            {isMobile ? (
              <MobileControls
                wager={0}
                setWager={() => {}}
                onPlay={reset}
                playDisabled={false}
                playText="← New Simulation"
              />
            ) : (
              <DesktopControls
                onPlay={reset}
                playDisabled={false}
                playText="← New Simulation"
              />
            )}
            <GambaUi.Button onClick={onBack} style={{ marginTop: 8 }}>
              ← Back to Lobby
            </GambaUi.Button>
          </GambaUi.Portal>
        </Container>
      )}

      {!started && (
        <GambaUi.Portal target="controls">
          {isMobile ? (
            <MobileControls
              wager={0}
              setWager={() => {}}
              onPlay={start}
              playDisabled={false}
              playText="▶ Run Simulation"
            />
          ) : (
            <DesktopControls
              onPlay={start}
              playDisabled={false}
              playText="▶ Run Simulation"
            />
          )}
          <GambaUi.Button onClick={onBack} style={{ marginTop: 8 }}>
            ← Back to Lobby
          </GambaUi.Button>
        </GambaUi.Portal>
      )}
    </>
  )
}