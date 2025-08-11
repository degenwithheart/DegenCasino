import React, { useState, useContext } from "react"
import {
  GambaUi,
  useWagerInput,
  useCurrentToken,
  useCurrentPool,
  useTokenBalance,
  useSound,
  FAKE_TOKEN_MINT,
  TokenValue,
} from 'gamba-react-ui-v2'

import { useIsCompact } from '../../hooks/useIsCompact';
import { GambaResultContext } from '../../context/GambaResultContext'
import { TOKEN_METADATA } from '../../constants'
import { useGamba } from 'gamba-react-v2'
import Slider from './Slider'
import { GameControls, GameScreenLayout } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'

// Sound paths
const spinSound = "/assets/games/limbo/numbers.mp3"
const winSound = "/assets/games/limbo/win.mp3"
const loseSound = "/assets/games/limbo/lose.mp3"
const tickSound = "/assets/games/limbo/tick.mp3"

export default function Limbo() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const [targetMultiplier, setTargetMultiplier] = useState<number>(20)
  const [resultMultiplier, setResultMultiplier] = useState<number>(0)
  const [playing, setPlaying] = useState<boolean>(false)
  const [isWin, setIsWin] = useState<boolean | null>(null)
  const [textColor, setTextColor] = useState<string>('#FFFFFF')

  const pool = useCurrentPool()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const { setGambaResult } = useContext(GambaResultContext)
  
  // Responsive scaling logic

  const isCompact = useIsCompact();
  const [scale, setScale] = React.useState(isCompact ? 1 : 1.2);

  React.useEffect(() => {
    setScale(isCompact ? 1 : 1.2);
  }, [isCompact]);

  React.useEffect(() => {
  }, []);
  
  // Game outcome overlay state
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin: overlayIsWin,
    profitAmount,
    resetGameState,
  } = useGameOutcome()

  const tokenMeta = token
    ? TOKEN_METADATA.find((t) => t.symbol === token.symbol)
    : undefined

  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
  const maxWager = baseWager * 1000000
  const tokenPrice = tokenMeta?.usdPrice ?? 0

  // Set default wager: 1 for free tokens, 0 for real tokens
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager) // 1 token for free token
    } else {
      setWager(0) // 0 for real tokens
    }
  }, [setWager, token, baseWager])

  const sounds = useSound({
    spin: spinSound,
    win: winSound,
    lose: loseSound,
    tick: tickSound,
  })

  const handleMultiplierChange = (value: number) => {
    setTargetMultiplier(Math.max(2, Math.min(100, value)))
    sounds.play('tick')
  }

  const startAnimation = (start: number, end: number, winCondition: boolean) => {
    let startTime: number | null = null
    const duration = 2500

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      setResultMultiplier(start + (end - start) * progress)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setTextColor(winCondition ? '#10B981' : '#EF4444')
        sounds.play(winCondition ? 'win' : 'lose')
      }
    }

    requestAnimationFrame(animate)
  }

  const play = async () => {
    try {
      setPlaying(true)
      setResultMultiplier(0)
      setTextColor('#FFFFFF')

      const betArray = Array(targetMultiplier + 1).fill(0)
      betArray[targetMultiplier] = targetMultiplier

      await game.play({
        bet: betArray,
        wager,
      })

      const result = await game.result()
      const winCondition = result.resultIndex === targetMultiplier
      setIsWin(winCondition)
      setGambaResult(result)

      sounds.play('spin', { playbackRate: 0.8 })

      const endMultiplier = winCondition
        ? targetMultiplier + Math.random() * targetMultiplier * 0.2
        : result.resultIndex + Math.random() * (targetMultiplier - result.resultIndex)

      setTimeout(() => {
        startAnimation(1, endMultiplier, winCondition)
        // Show outcome overlay after animation
        setTimeout(() => {
          handleGameComplete({ payout: result.payout, wager })
        }, 2000)
      }, 500)
    } catch (err) {
      console.error("Play error", err)
    } finally {
      setPlaying(false)
    }
  }

  return (
    <GameScreenLayout
      left={
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
          }} className="limbo-game-scaler">
            <GambaUi.Responsive>
              <div className="flex flex-col items-center justify-center h-[500px] transition-all" style={{ transform: 'scale(0.85)' }}>
                <div
                  style={{
                    fontSize: '10rem',
                    fontWeight: 'bold',
                    color: textColor,
                    transition: 'color 0.5s ease-in-out',
                  }}
                >
                  {resultMultiplier.toFixed(2)}x
                </div>
                <div className="flex gap-4 justify-between items-center mx-auto">
                  <div className="flex flex-col items-center">
                    <div style={{ fontSize: '2vh', fontWeight: 'bold', color: textColor }}>
                      {targetMultiplier}%
                    </div>
                    <div style={{ fontSize: '2vh', color: textColor, marginBottom: '2vh' }}>
                      Win Chance
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div style={{ fontSize: '2vh', fontWeight: 'bold', color: textColor }}>
                      {targetMultiplier}x
                    </div>
                    <div style={{ fontSize: '2vh', color: textColor, marginBottom: '2vh' }}>
                      Multiplier
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div style={{ fontSize: '2vh', fontWeight: 'bold', color: textColor }}>
                      <TokenValue
                        mint={pool.token}
                        suffix={token?.symbol}
                        amount={targetMultiplier * wager}
                      />
                    </div>
                    <div style={{ fontSize: '2vh', color: textColor, marginBottom: '2vh' }}>
                      Payout
                    </div>
                  </div>
                </div>
              </div>
            </GambaUi.Responsive>
          </div>
        </GambaUi.Portal>
      }
      right={
        <GameControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          isPlaying={playing}
          playButtonText={hasPlayedBefore ? 'Play Again' : 'Play'}
        >
          {/* Multiplier Target Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 'bold' }}>Target:</span>
              <span style={{ 
                padding: '4px 12px', 
                background: '#222', 
                borderRadius: 6,
                fontSize: 14
              }}>
                {targetMultiplier}x
              </span>
            </div>
            <Slider
              disabled={playing}
              range={[2, 100]}
              min={2}
              max={100}
              value={targetMultiplier}
              onChange={handleMultiplierChange}
            />
          </div>
        </GameControls>
      }
    />
  )
}
