import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import React from 'react'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, SliderControl, DesktopControls } from '../../components'
import CustomSlider from './Slider'
import CRASH_SOUND from './crash.mp3'
import SOUND from './music.mp3'
import { LineLayer1, LineLayer2, LineLayer3, MultiplierText, Rocket, ScreenWrapper, StarsLayer1, StarsLayer2, StarsLayer3 } from './styles'
import GameScreenFrame from '../../components/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { CRASH_CONFIG } from '../rtpConfig'
import WIN_SOUND from './win.mp3'
import { makeDeterministicRng } from '../../fairness/deterministicRng'

export default function CrashGame() {
  const [wager, setWager] = useWagerInput()
  const [multiplierTarget, setMultiplierTarget] = React.useState(1.5)
  const [currentMultiplier, setCurrentMultiplier] = React.useState(0)
  const [rocketState, setRocketState] = React.useState<'idle' | 'win' | 'crash'>('idle')
  const game = GambaUi.useGame()
  const sound = useSound({ music: SOUND, crash: CRASH_SOUND, win: WIN_SOUND })

  const getRocketStyle = () => {
    const maxMultiplier = 1
    const progress = Math.min(currentMultiplier / maxMultiplier, 1)

    const leftOffset = 20
    const bottomOffset = 30
    const left = progress * (100 - leftOffset)
    const bottom = Math.pow(progress, 5) * (100 - bottomOffset)
    const rotationProgress = Math.pow(progress, 2.3)
    const startRotationDeg = 90
    const rotation = (1 - rotationProgress) * startRotationDeg

    return {
      bottom: `${bottom}%`,
      left: `${left}%`,
      transform: `rotate(${rotation}deg)`,
    }
  }

  const doTheIntervalThing = (
    currentMultiplier: number,
    targetMultiplier: number,
    win: boolean,
  ) => {
    const nextIncrement = 0.01 * (Math.floor(currentMultiplier) + 1)
    const nextValue = currentMultiplier + nextIncrement

    setCurrentMultiplier(nextValue)

    if (nextValue >= targetMultiplier) {
      sound.sounds.music.player.stop()
      sound.play(win ? 'win' : 'crash')
      setRocketState(win ? 'win' : 'crash')
      setCurrentMultiplier(targetMultiplier)
      return
    }

    setTimeout(() => doTheIntervalThing(nextValue, targetMultiplier, win), 50)
  }

  const multiplierColor = (
    () => {
      if (rocketState === 'crash') return '#ff0000'
      if (rocketState === 'win') return '#00ff00'
      return '#ffffff'
    }
  )()

  // Deterministic losing multiplier mapping (visual only) derived from on-chain result index & target
  const deriveLosingMultiplier = (targetMultiplier: number, seed: string) => {
    const rng = makeDeterministicRng(`crash:${seed}:${targetMultiplier}`)
    const base = rng()
    const maxPossible = Math.min(targetMultiplier, 12)
    const exponent = base > 0.95 ? 2.8 : (targetMultiplier > 10 ? 5 : 6)
    const result = 1 + Math.pow(base, exponent) * (maxPossible - 1)
    return parseFloat(result.toFixed(2))
  }


  const play = async () => {
    setRocketState('idle')
    const bet = CRASH_CONFIG.calculateBetArray(multiplierTarget)
    await game.play({ wager, bet })

    const result = await game.result()
    const win = result.payout > 0
    const multiplierResult = win
      ? parseFloat(multiplierTarget.toFixed(2))
      : deriveLosingMultiplier(multiplierTarget, `${result.resultIndex}:${result.payout}`)

    console.log('multiplierResult', multiplierResult)
    console.log('win', win)

    sound.play('music')
    doTheIntervalThing(0, multiplierResult, win)
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <GameScreenFrame {...(useGameMeta('crash') && { title: useGameMeta('crash')!.name, description: useGameMeta('crash')!.description })}>
        <ScreenWrapper>
          <StarsLayer1 style={{ opacity: currentMultiplier > 3 ? 0 : 1 }} />
          <LineLayer1 style={{ opacity: currentMultiplier > 3 ? 1 : 0 }} />
          <StarsLayer2 style={{ opacity: currentMultiplier > 2 ? 0 : 1 }} />
          <LineLayer2 style={{ opacity: currentMultiplier > 2 ? 1 : 0 }} />
          <StarsLayer3 style={{ opacity: currentMultiplier > 1 ? 0 : 1 }} />
          <LineLayer3 style={{ opacity: currentMultiplier > 1 ? 1 : 0 }} />
          <MultiplierText color={multiplierColor}>
            {currentMultiplier.toFixed(2)}x
          </MultiplierText>
          <Rocket style={getRocketStyle()} />
        </ScreenWrapper>
        </GameScreenFrame>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          playDisabled={false}
          playText="Play"
        >
          <SliderControl
            label="Multiplier"
            value={multiplierTarget}
          >
            <CustomSlider
              value={multiplierTarget}
              onChange={setMultiplierTarget}
            />
          </SliderControl>
        </MobileControls>
        
        <DesktopControls>
          <EnhancedWagerInput value={wager} onChange={setWager} />
          <CustomSlider
            value={multiplierTarget}
            onChange={setMultiplierTarget}
          />
          <EnhancedPlayButton onClick={play}>
            Play
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}
