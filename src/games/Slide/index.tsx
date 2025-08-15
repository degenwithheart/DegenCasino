import React, { useRef, useState, useEffect } from 'react'
import {
  FAKE_TOKEN_MINT,
  GambaUi,
  useCurrentPool,
  useCurrentToken,
  useTokenBalance,
  useWagerInput,
} from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { GameControls } from '../../components/GameControls'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { useGambaResult } from '../../hooks/useGambaResult'
import { GameStateProvider, useGameState } from '../../hooks/useGameState'
import SlidePaytable, { SlidePaytableRef } from './SlidePaytable'
import { SlideOverlays } from './SlideOverlays'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

const ORIGINAL_MULTIPLIERS = [1.05, 0, 1.34, 0, 1.04, 0, 1.76, 0, 1.95, 0]

function formatPayout(amount: number, decimals: number): string {
  const factor = 10 ** decimals
  const fixed = (amount / factor).toFixed(decimals)
  return fixed.replace(/\.?0+$/, '')
}

function SlideGameUI() {
  const { gamePhase, setGamePhase } = useGameState()
  const [resultModalOpen, setResultModalOpen] = useState(false)
  const resizeTimeoutRef = useRef<NodeJS.Timeout>()
  const [wager, setWager] = useWagerInput()
  const [scale, setScale] = useState(1)
  const paytableRef = useRef<SlidePaytableRef>(null)

  useEffect(() => {
    const handleResize = () => {
      clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = setTimeout(() => {
        setScale(1)
      }, 150)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeoutRef.current)
    }
  }, [])

  const game = GambaUi.useGame()
  const token = useCurrentToken()
  const pool = useCurrentPool()
  const { balance } = useTokenBalance()
  const [result, setResult] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [offset, setOffset] = useState(0)
  const [progress, setProgress] = useState(0)
  const [recentPlays, setRecentPlays] = useState<{ multiplier: number, win: boolean, amount: number }[]>([])
  const [showFairness, setShowFairness] = useState(false)
  const intervalRef = useRef<any>(null)
  const speedRef = useRef(5)
  const progressRef = useRef<any>(null)
  const startOffsetRef = useRef(0)

  const { showOutcome, hasPlayedBefore, handleGameComplete, handlePlayAgain: baseHandlePlayAgain, isWin, profitAmount, resetGameState } = useGameOutcome()
  const { storeResult, gambaResult } = useGambaResult()

  const [thinkingPhase, setThinkingPhase] = React.useState(false)
  const [dramaticPause, setDramaticPause] = React.useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(1)
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🎰')
  const handlePlayAgain = () => {
    setResult(null)
    setProgress(0)
    setOffset(0)
    baseHandlePlayAgain()
  }

  const CARD_WIDTH = 120
  const CARD_GAP = 16
  const RENDERED_CARD_WIDTH = CARD_WIDTH - 16
  const CARD_SPACING = CARD_WIDTH + CARD_GAP
  const CONTAINER_CENTER = 300
  const loopWidth = CARD_SPACING * ORIGINAL_MULTIPLIERS.length

  const renderedMultipliers = [
    ...ORIGINAL_MULTIPLIERS,
    ...ORIGINAL_MULTIPLIERS,
    ...ORIGINAL_MULTIPLIERS,
    ...ORIGINAL_MULTIPLIERS,
    ...ORIGINAL_MULTIPLIERS
  ]

  const tokenMeta = token ? TOKEN_METADATA.find(t => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
  const maxWager = baseWager * 1000000
  const decimals = tokenMeta?.decimals ?? 4

  useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager)
    } else {
      setWager(0)
    }
  }, [setWager, token, baseWager])

  useEffect(() => {
    const cardsPerSet = ORIGINAL_MULTIPLIERS.length
    const firstCardIndexInMiddleSet = cardsPerSet * 2
    const firstCardCenter = firstCardIndexInMiddleSet * CARD_SPACING + (CARD_WIDTH / 2)
    const initialOffset = firstCardCenter - CONTAINER_CENTER
    setOffset(initialOffset)
  }, [])

  const startProgress = () => {
    setProgress(0)
    if (progressRef.current) clearInterval(progressRef.current)
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressRef.current)
          return 100
        }
        return prev + 0.8
      })
    }, 20)
  }

  const startSlider = async () => {
    setResult(null)
    setPlaying(true)
    const randomCardIndex = Math.floor(Math.random() * ORIGINAL_MULTIPLIERS.length)
    const cardsPerSet = ORIGINAL_MULTIPLIERS.length
    const randomCardIndexInMiddleSet = cardsPerSet * 2 + randomCardIndex
    const randomCardCenter = randomCardIndexInMiddleSet * CARD_SPACING + (CARD_WIDTH / 2)
    const startOffset = randomCardCenter - CONTAINER_CENTER
    setOffset(startOffset)
    startOffsetRef.current = startOffset
    speedRef.current = 15
    startProgress()
    await new Promise((res) => setTimeout(res, 800))
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setOffset((prev) => {
        let next = prev + speedRef.current
        if (next >= loopWidth) {
          next -= loopWidth
        }
        return next
      })
      if (speedRef.current < 25) {
        speedRef.current += 0.1
      }
    }, 16)
  }

  const stopSlider = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    const cardsPerSet = ORIGINAL_MULTIPLIERS.length
    try {
      setPlaying(true)
      await game.play({ bet: ORIGINAL_MULTIPLIERS, wager })
      const res = await game.result()
      storeResult(res)
      const resultIndex = res.resultIndex ?? 0
      const targetCardIndexInRendered = cardsPerSet * 2 + resultIndex
      const targetCardCenter = targetCardIndexInRendered * CARD_SPACING + (CARD_WIDTH / 2)
      const targetOffset = targetCardCenter - CONTAINER_CENTER
      let normalizedCurrentOffset = offset
      const possibleTargets = [targetOffset, targetOffset + loopWidth, targetOffset - loopWidth]
      let bestTarget = targetOffset
      let minDistance = Math.abs(targetOffset - normalizedCurrentOffset)
      for (const target of possibleTargets) {
        const distance = Math.abs(target - normalizedCurrentOffset)
        if (distance < minDistance) {
          minDistance = distance
          bestTarget = target
        }
      }
      const animationSteps = 60
      for (let i = 0; i <= animationSteps; i++) {
        const progress = i / animationSteps
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        const newOffset = normalizedCurrentOffset + (bestTarget - normalizedCurrentOffset) * easeOutCubic
        setOffset(newOffset)
        await new Promise(resolve => setTimeout(resolve, 16))
      }
      const finalOffset = bestTarget % loopWidth
      setOffset(finalOffset)
      setResult(res.payout)
      setPlaying(false)
      handleGameComplete({
        payout: res.payout,
        wager: wager
      })
      setRecentPlays(prev => [
        {
          multiplier: ORIGINAL_MULTIPLIERS[resultIndex],
          win: res.payout > 0,
          amount: res.payout > 0 ? res.payout : wager
        },
        ...prev.slice(0, 4),
      ])
      paytableRef.current?.trackSpin({
        multiplier: ORIGINAL_MULTIPLIERS[resultIndex],
        win: res.payout > 0,
        wager,
        payout: res.payout
      })
    } catch (err) {
      setPlaying(false)
    }
  }

  const play = async () => {
    if (!wager || playing) return
    setGamePhase('thinking')
    setThinkingPhase(true)
    setThinkingEmoji(['🎰', '💭', '🎯', '🃏'][Math.floor(Math.random() * 4)])
    try {
      await startSlider()
      setGamePhase('dramatic')
      setDramaticPause(true)
      await stopSlider()
      if (result && gambaResult) {
        const multiplier = gambaResult.payout / wager
        if (multiplier > 0) {
          if (multiplier >= 10) setCelebrationIntensity(3)
          else if (multiplier >= 3) setCelebrationIntensity(2)
          else setCelebrationIntensity(1)
          setGamePhase('celebrating')
        } else {
          setGamePhase('mourning')
        }
        setTimeout(() => setGamePhase('idle'), 3000)
      }
    } catch (error) {
      setPlaying(false)
      setProgress(100)
      setGamePhase('mourning')
      setTimeout(() => setGamePhase('idle'), 3000)
    }
  }

  // --- UI structure adapted from cashblaze129/casino-game ---
  return (
    <div className="w-full bg-[#10100f] h-full flex justify-center">
      <div className="max-w-[1300px] mt-5 w-full p-1">
        <div className="grid grid-cols-1 sm:grid-cols-4 rounded-md overflow-hidden bg-panel border-[1px] border-[#020202bb] shadow-md">
          {/* Sidebar controls */}
          <div className="col-span-1 p-2 min-h-[560px] bg-sider_panel shadow-[0px_0px_15px_rgba(0,0,0,0.25)] flex flex-col justify-between">
            {/* You can add SwitchTab, AmountInput, MultiplierInput, etc. here, or use your GameControls */}
            <GameControls
              wager={wager}
              setWager={setWager}
              isPlaying={playing}
              showOutcome={showOutcome}
              onPlay={play}
              playButtonText={playing ? 'Sliding...' : 'Slide'}
              onPlayAgain={handlePlayAgain}
            />
            <SlidePaytable ref={paytableRef} multipliers={ORIGINAL_MULTIPLIERS} />
          </div>
          {/* Main Slide UI */}
          <div className="col-span-3 gap-2 min-h-[350px] relative h-full overflow-hidden">
            {/* History bar */}
            <div className="flex absolute right-1/2 translate-x-1/2 top-5 z-20 w-[300px] space-x-1">
              {recentPlays.map((h, idx) => (
                <button
                  key={idx}
                  className="p-[3px] w-10 text-sm font-medium text-white"
                  style={{
                    background: h.win ? "#50e3c2" : "#ff3333",
                    color: h.win ? "#000" : "#fff"
                  }}>
                  {h.multiplier}x
                </button>
              ))}
              <button
                className="p-[3px] w-10 text-sm font-medium text-white"
                style={{ background: "#50e3c2" }}
                onClick={() => setShowFairness(true)}
              >Fairness</button>
            </div>
            {/* Main carousel area */}
            <div className="w-full h-full flex items-center">
              {/* Paste your carousel here, or keep your own carousel logic */}
              {/* ... */}
            </div>
            {/* Bets/Status bar */}
            <div className="absolute bottom-10 left-5 z-20">
              <div className="flex space-x-1 w-20 items-center">
                <div className="w-3 h-3 rounded-full bg-bet_button"></div>
                <div className="text-white text-sm">Bets: {recentPlays.length}</div>
              </div>
            </div>
            {/* StatusBar (if you want) */}
            <div className="w-full absolute bottom-0 z-20">
              {/* <StatusBar status={gamePhase} /> */}
            </div>
            <div className="absolute z-10 top-0 left-0 w-full h-full" style={{ background: "linear-gradient(90deg,#071824,transparent,#071824)" }} />
          </div>
        </div>
      </div>
      {/* Overlays and modals */}
      {showFairness && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setShowFairness(false)}
        >
          <div
            className="bg-[#1a1a2e] rounded-lg p-8 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span role="img" aria-label="fairness">🛡️</span> Provably Fair
            </h3>
            <p className="mb-6 text-gray-200">
              Every game result is cryptographically verifiable. The outcome is determined by 
              combining the server seed, client seed, and nonce using industry-standard algorithms.
            </p>
            <button
              className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 font-semibold text-white"
              onClick={() => setShowFairness(false)}
            >Got it</button>
          </div>
        </div>
      )}
      {/* Render overlays as before */}
      {renderThinkingOverlay(
        <SlideOverlays
          gamePhase={getGamePhaseState(
            ['thinking', 'dramatic', 'celebrating', 'mourning', 'idle'].includes(gamePhase)
              ? gamePhase as 'thinking' | 'dramatic' | 'celebrating' | 'mourning' | 'idle'
              : 'idle'
          )}
          thinkingPhase={getThinkingPhaseState(thinkingPhase)}
          dramaticPause={dramaticPause}
          celebrationIntensity={celebrationIntensity}
          thinkingEmoji={thinkingEmoji}
          result={gambaResult}
          currentBalance={balance}
          wager={wager}
        />
      )}
    </div>
  )
}

// Wrap in provider
export default function SlideGame() {
  return (
    <GameStateProvider>
      <SlideGameUI />
    </GameStateProvider>
  )
}
