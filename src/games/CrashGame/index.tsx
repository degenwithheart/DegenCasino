import { GambaUi, useSound, useWagerInput, useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import { TOKEN_METADATA } from '../../constants'
import React from 'react'
import { GameControls } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import CustomSlider from './Slider'
import CRASH_SOUND from './crash.mp3'
import SOUND from './music.mp3'
import { LineLayer1, LineLayer2, LineLayer3, MultiplierText, Rocket, ScreenWrapper, StarsLayer1, StarsLayer2, StarsLayer3 } from './styles'
import { calculateBetArray } from './utils'
import WIN_SOUND from './win.mp3'
import { useIsCompact } from '../../hooks/useIsCompact';

export default function CrashGame() {
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const gamba = useGamba()

  // Find token metadata for symbol display
  const tokenMeta = token ? TOKEN_METADATA.find((t: any) => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
  const maxWager = baseWager * 1000000
  const tokenPrice = tokenMeta?.usdPrice ?? 0

  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain: originalHandlePlayAgain,
    isWin,
    profitAmount,
  } = useGameOutcome()

  // Custom handlePlayAgain that also resets rocket state
  const handlePlayAgain = () => {
    setRocketState('idle')
    setCurrentMultiplier(0)
    originalHandlePlayAgain()
  }

  // Set default wager: 1 for free tokens, 0 for real tokens
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager) // 1 token for free token
    } else {
      setWager(0) // 0 for real tokens
    }
  }, [setWager, token, baseWager])

  const [multiplierTarget, setMultiplierTarget] = React.useState(1.5)
  const [currentMultiplier, setCurrentMultiplier] = React.useState(0)
  const [rocketState, setRocketState] = React.useState<'idle' | 'win' | 'crash'>('idle')
  const game = GambaUi.useGame()
  const sound = useSound({ music: SOUND, crash: CRASH_SOUND, win: WIN_SOUND })
  const isPlaying = gamba.isPlaying || rocketState !== 'idle'

  // Responsive scaling logic using useIsCompact
  const isCompact = useIsCompact();
  const [scale, setScale] = React.useState(isCompact ? 1 : 1.2);

  React.useEffect(() => {
    setScale(isCompact ? 1 : 1.2);
  }, [isCompact]);

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
    finalResult: { payout: number; wager: number }
  ) => {
    const nextIncrement = 0.01 * (Math.floor(currentMultiplier) + 1)
    const nextValue = currentMultiplier + nextIncrement

    setCurrentMultiplier(nextValue)

    if (nextValue >= targetMultiplier) {
      sound.sounds.music.player.stop()
      sound.play(win ? 'win' : 'crash')
      setRocketState(win ? 'win' : 'crash')
      setCurrentMultiplier(targetMultiplier)
      
      // Handle game outcome for overlay after animation completes
      setTimeout(() => {
        handleGameComplete(finalResult)
      }, 500) // Small delay to let the final animation play
      return
    }

    setTimeout(() => doTheIntervalThing(nextValue, targetMultiplier, win, finalResult), 50)
  }

  const multiplierColor = (
    () => {
      if (rocketState === 'crash') return '#ff0000'
      if (rocketState === 'win') return '#00ff00'
      return '#ffffff'
    }
  )()

  //Kinda realistic losing number chooser
  const calculateBiasedLowMultiplier = (targetMultiplier: number) => {
    const randomValue = Math.random()
    const maxPossibleMultiplier = Math.min(targetMultiplier, 12)
    const exponent = randomValue > 0.95 ? 2.8 : (targetMultiplier > 10 ? 5 : 6)
    const result = 1 + Math.pow(randomValue, exponent) * (maxPossibleMultiplier - 1)
    return parseFloat(result.toFixed(2))
  }


  const play = async () => {
    try {
      setRocketState('idle')
      setCurrentMultiplier(0)
      const bet = calculateBetArray(multiplierTarget)
      await game.play({ wager, bet })

      const result = await game.result()
      const win = result.payout > 0
      const multiplierResult = win ? multiplierTarget : calculateBiasedLowMultiplier(multiplierTarget)

      // Prepare result for overlay handling
      const finalResult = { payout: result.payout, wager }

      console.log('multiplierResult', multiplierResult)
      console.log('win', win)

      try {
        sound.play('music')
      } catch (err) {
        console.error('Sound playback failed:', err)
        // Optionally show user feedback here
      }
      doTheIntervalThing(0, multiplierResult, win, finalResult)
    } catch (err) {
      setRocketState('crash')
      console.error('Crash game error:', err)
      // Optionally show user feedback here
    }
  }

  const test = async () => {
    await play()
  }

  const simulate = async () => {
    for (let i = 0; i < 10; i++) {
      await play()
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease-out'
        }} className="crash-game-scaler">
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
        </div>
        
        
      </GambaUi.Portal>
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        playButtonText={hasPlayedBefore ? 'Launch Again' : 'Launch'}
        style={{ padding: '0 16px' }}
      >
        {/* Multiplier Target Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: '200px' }}>
          <span style={{ fontWeight: 'bold' }}>Target:</span>
          <CustomSlider
            value={multiplierTarget}
            onChange={setMultiplierTarget}
          />
          <span style={{ 
            padding: '4px 12px', 
            background: '#00ffe1', 
            color: '#222',
            borderRadius: 6,
            fontWeight: 'bold',
            minWidth: '60px',
            textAlign: 'center'
          }}>
            {multiplierTarget.toFixed(2)}x
          </span>
        </div>
      </GameControls>
    </>
  )
}
