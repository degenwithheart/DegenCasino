import { GambaUi, useSound, useWagerInput, useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import { TOKEN_METADATA } from '../../constants'
import React, { useRef } from 'react'
import { GameControls } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { useGambaResult } from '../../hooks/useGambaResult'
import CustomSlider from './Slider'
import CRASH_SOUND from './crash.mp3'
import SOUND from './music.mp3'
import { LineLayer1, LineLayer2, LineLayer3, MultiplierText, Rocket, ScreenWrapper, StarsLayer1, StarsLayer2, StarsLayer3 } from './styles'
import { calculateBetArray } from './utils'
import WIN_SOUND from './win.mp3'
import { useIsCompact } from '../../hooks/useIsCompact'
import CrashPaytable, { CrashPaytableRef } from './CrashPaytable'
import CrashGameOverlays from './CrashGameOverlays'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

export default function CrashGame() {
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const gamba = useGamba()

  // Live paytable tracking
  const paytableRef = useRef<CrashPaytableRef>(null)

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

  // Dynamic play button text
  const playButtonText = hasPlayedBefore && !showOutcome ? "Restart" : "Start"

  // Gamba result storage
  const { storeResult } = useGambaResult()

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

  // Game phase management for overlays
  const [gamePhase, setGamePhase] = React.useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')
  const [thinkingPhase, setThinkingPhase] = React.useState(false)
  const [dramaticPause, setDramaticPause] = React.useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(0)
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🤔')

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
    finalResult: { payout: number; wager: number },
    crashMultiplier: number
  ) => {
    const nextIncrement = 0.01 * (Math.floor(currentMultiplier) + 1)
    const nextValue = currentMultiplier + nextIncrement

    setCurrentMultiplier(nextValue)

    if (nextValue >= crashMultiplier) {
      sound.sounds.music.player.stop()
      sound.play(win ? 'win' : 'crash')
      setRocketState(win ? 'win' : 'crash')
      setCurrentMultiplier(crashMultiplier)
      
      // Track result in live paytable
      if (paytableRef.current) {
        paytableRef.current.trackGame({
          targetMultiplier,
          crashMultiplier,
          wasWin: win,
          amount: finalResult.payout
        })
      }
      
      // Handle game outcome for overlay after animation completes
      setTimeout(() => {
        handleGameComplete(finalResult)
      }, 500) // Small delay to let the final animation play
      return
    }

    setTimeout(() => doTheIntervalThing(nextValue, targetMultiplier, win, finalResult, crashMultiplier), 50)
  }

  const multiplierColor = (
    () => {
      if (rocketState === 'crash') return '#ff0000'
      if (rocketState === 'win') return '#00ff00'
      return '#ffffff'
    }
  )()

  // Use deterministic crash multiplier calculation for visual display
  // This ensures the display is consistent with the provably fair result
  const calculateVisualCrashMultiplier = (targetMultiplier: number, resultIndex: number) => {
    // Use the result index from Gamba to determine a consistent crash point
    // Normalize result index to 0-1 range (assuming it's typically 0-100 or similar)
    const normalizedResult = (resultIndex % 1000) / 1000
    const maxPossibleMultiplier = Math.min(targetMultiplier, 12)
    const exponent = normalizedResult > 0.95 ? 2.8 : (targetMultiplier > 10 ? 5 : 6)
    const result = 1 + Math.pow(normalizedResult, exponent) * (maxPossibleMultiplier - 1)
    return parseFloat(result.toFixed(2))
  }


  const play = async () => {
    try {
      // Start thinking phase
      setGamePhase('thinking')
      setThinkingPhase(true)
      setThinkingEmoji(['🚀', '💭', '🎯', '⚡'][Math.floor(Math.random() * 4)])
      
      setRocketState('idle')
      setCurrentMultiplier(0)
      const bet = calculateBetArray(multiplierTarget)
      await game.play({ wager, bet })

      const result = await game.result()

    // Store result in context for modal
    storeResult(result)
      const win = result.payout > 0
      const crashMultiplier = win ? multiplierTarget : calculateVisualCrashMultiplier(multiplierTarget, result.resultIndex)

      // Prepare result for overlay handling
      const finalResult = { payout: result.payout, wager }

      console.log('crashMultiplier', crashMultiplier)
      console.log('win', win)

      // Dramatic pause phase
      setGamePhase('dramatic')
      setDramaticPause(true)
      
      // Wait for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 1500))

      try {
        sound.play('music')
      } catch (err) {
        console.error('Sound playback failed:', err)
        // Optionally show user feedback here
      }

      // Set celebration intensity based on win amount
      if (win) {
        const multiplier = finalResult.payout / finalResult.wager
        if (multiplier >= 10) {
          setCelebrationIntensity(3) // Epic win
        } else if (multiplier >= 3) {
          setCelebrationIntensity(2) // Big win
        } else {
          setCelebrationIntensity(1) // Regular win
        }
        setGamePhase('celebrating')
      } else {
        setGamePhase('mourning')
      }

      doTheIntervalThing(0, multiplierTarget, win, finalResult, crashMultiplier)
      
      // Reset to idle after celebration/mourning
      setTimeout(() => {
        setGamePhase('idle')
      }, 3000)
    } catch (err) {
      setRocketState('crash')
      setGamePhase('mourning')
      console.error('Crash game error:', err)
      // Reset to idle after error
      setTimeout(() => {
        setGamePhase('idle')
      }, 3000)
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
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main game area */}
          <div style={{ flex: 1, minWidth: 0 }}>
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

          {/* Paytable sidebar */}
          <CrashPaytable
            ref={paytableRef}
            wager={wager}
            targetMultiplier={multiplierTarget}
            currentResult={rocketState !== 'idle' ? {
              targetMultiplier: multiplierTarget,
              crashMultiplier: currentMultiplier,
              wasWin: rocketState === 'win',
              amount: 0 // Will be set when animation completes
            } : undefined}
          />
        </div>
      </GambaUi.Portal>
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'Restart' : 'Launch'}
        style={{ padding: '0 16px' }}
        onPlayAgain={handlePlayAgain}
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
      {renderThinkingOverlay(
        <CrashGameOverlays 
          gamePhase={getGamePhaseState(gamePhase)}
          thinkingPhase={getThinkingPhaseState(thinkingPhase)}
          dramaticPause={dramaticPause}
          celebrationIntensity={celebrationIntensity}
          thinkingEmoji={thinkingEmoji}
        />
      )}
    </>
  )
}
