import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React, { useRef, useState, useEffect } from 'react'
import Slider from './Slider'
import { SOUND_LOSE, SOUND_PLAY, SOUND_TICK, SOUND_WIN } from './constants'
import { Container, Result, RollUnder, Stats } from './styles'
import { EnhancedWagerInput, MobileControls, DesktopControls, GameControlsSection, GameRecentPlaysHorizontal } from '../../components'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { useGameStats } from '../../hooks/game/useGameStats'

type DiceMode = 'under' | 'over' | 'between' | 'outside'

const calculateArraySize = (odds: number): number => {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a)
  return 100 / gcd(100, odds)
}

export const outcomes = (odds: number) => {
  const arraySize = calculateArraySize(odds)
  const payout = (100 / odds).toFixed(4)

  let payoutArray = Array.from({ length: arraySize }).map((_, index) =>
    index < (arraySize * (odds / 100)) ? parseFloat(payout) : 0
  )

  const totalValue = payoutArray.reduce((acc, curr) => acc + curr, 0)

  if (totalValue > arraySize) {
    for (let i = payoutArray.length - 1; i >= 0; i--) {
      if (payoutArray[i] > 0) {
        payoutArray[i] -= totalValue - arraySize
        payoutArray[i] = parseFloat(payoutArray[i].toFixed(4))
        break
      }
    }
  }

  return payoutArray
}

export default function Dice() {
  // Essential hooks
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const pool = useCurrentPool()
  const { mobile: isMobile } = useIsCompact()

  // Game state
  // KEEP original variables (so nothing is removed). We'll *augment* them with new mode/range state.
  const [resultIndex, setResultIndex] = useState(-1)
  const [rollUnderIndex, setRollUnderIndex] = useState(Math.floor(100 / 2))
  const [hasPlayed, setHasPlayed] = useState(false)
  const [lastGameResult, setLastGameResult] = useState<'win' | 'lose' | null>(null)
  const [isRollUnder, setIsRollUnder] = useState(true)
  const [rollValue, setRollValue] = useState(50)

  // NEW: mode + range state (we keep existing vars so original code paths still exist)
  const [mode, setMode] = useState<DiceMode>('under') // default matches original behavior
  const [minRange, setMinRange] = useState(25)
  const [maxRange, setMaxRange] = useState(75)
  // Active handle to ensure proper dragging z-index for overlapping range inputs
  const [activeHandle, setActiveHandle] = useState<null | 'min' | 'max' | 'single'>(null)
  const sliderRef = useRef<HTMLDivElement | null>(null)

  // Manual drag handlers for dual-handle slider to ensure both handles are draggable
  React.useEffect(() => {
    let moveHandler: ((e: PointerEvent) => void) | null = null
    let upHandler: ((e: PointerEvent) => void) | null = null

    moveHandler = (e: PointerEvent) => {
      if (!activeHandle) return
      const rect = sliderRef.current?.getBoundingClientRect()
      if (!rect) return
      let pct = ((e.clientX - rect.left) / rect.width) * 100
      pct = Math.max(1, Math.min(99, Math.round(pct)))
      if (activeHandle === 'min') {
        const val = Math.min(pct, maxRange - 1)
        setMinRange(val)
      } else if (activeHandle === 'max') {
        const val = Math.max(pct, minRange + 1)
        setMaxRange(val)
      } else if (activeHandle === 'single') {
        // update single handle (rollValue) for under/over modes
        const val = Math.max(1, Math.min(99, Math.round(pct)))
        setRollValue(val)
      }
    }

    upHandler = () => {
      setActiveHandle(null)
    }

    if (activeHandle) {
      window.addEventListener('pointermove', moveHandler)
      window.addEventListener('pointerup', upHandler)
    }

    return () => {
      if (moveHandler) window.removeEventListener('pointermove', moveHandler)
      if (upHandler) window.removeEventListener('pointerup', upHandler)
    }
  }, [activeHandle, minRange, maxRange])

  // Game statistics tracking
  const gameStats = useGameStats('dice-v2')  // Initialize with correct game ID

  // Graphics and effects
  const { settings } = useGraphics()
  const enableEffects = settings.enableEffects
  const effectsRef = useRef<GameplayEffectsRef>(null)

  // Sound system
  const sounds = useSound({
    win: SOUND_WIN,
    play: SOUND_PLAY,
    lose: SOUND_LOSE,
    tick: SOUND_TICK,
  })

  // SYNC: keep original isRollUnder and rollUnderIndex in sync with mode/values so other code that references them won't break.
  useEffect(() => {
    // update boolean for compatibility
    setIsRollUnder(mode === 'under')

    // If mode is under/over, keep rollUnderIndex aligned to rollValue (original code used rollUnderIndex for odds/multiplier)
    if (mode === 'under' || mode === 'over') {
      const v = Math.max(1, Math.min(99, Math.floor(rollValue)))
      setRollUnderIndex(v)
    }
  }, [mode, rollValue])

  // Compute win chance dynamically based on selected mode
  const winChance = React.useMemo(() => {
    switch (mode) {
      case 'under':
        return rollValue / 100
      case 'over':
        return (100 - rollValue) / 100
      case 'between':
        // ensure ranges are valid
        return Math.max(0, (maxRange - minRange) / 100)
      case 'outside':
        return Math.max(0, 1 - (maxRange - minRange) / 100)
      default:
        return 0.5
    }
  }, [mode, rollValue, minRange, maxRange])

  // Derive integer odds percent (1..99) from winChance; used for outcomes() and multiplier formula.
  const oddsPercent = Math.max(1, Math.min(99, Math.floor(winChance * 100)))

  // Payout multiplier computed via BPS formula (keeps original style but uses dynamic oddsPercent)
  const multiplier = Number(BigInt(100 * BPS_PER_WHOLE) / BigInt(oddsPercent)) / BPS_PER_WHOLE

  // Prepare bet outcomes based on computed odds
  const bet = React.useMemo(() => outcomes(oddsPercent), [oddsPercent])

  const maxWin = multiplier * wager

  const game = GambaUi.useGame()

  // Calculate pool exceeded (unchanged)
  const poolExceeded = maxWin > (pool?.maxPayout || 0)

  const resetGame = () => {
    setHasPlayed(false)
    setResultIndex(-1)
    setLastGameResult(null)
  }

  const play = async () => {
    try {
      sounds.play('play')

      await game.play({
        wager,
        bet,
      })

      const result = await game.result()
      const win = result.payout > 0

      // compute result number consistent with selected mode and whether it's a win or loss
      let resultNum = 0

      if (win) {
        switch (mode) {
          case 'under': {
            // uniform from 0 .. rollValue-1
            const top = Math.max(1, Math.floor(rollValue))
            resultNum = Math.floor(Math.random() * top)
            break
          }
          case 'over': {
            // uniform from rollValue .. 99
            const start = Math.max(1, Math.floor(rollValue))
            const count = 100 - start
            resultNum = Math.floor(Math.random() * count) + start
            break
          }
          case 'between': {
            // uniform from minRange .. maxRange-1
            const low = Math.max(0, Math.floor(minRange))
            const high = Math.max(low + 1, Math.floor(maxRange))
            const span = Math.max(1, high - low)
            resultNum = Math.floor(Math.random() * span) + low
            break
          }
          case 'outside': {
            // pick from [0 .. minRange-1] U [maxRange .. 99]
            const leftCount = Math.max(0, Math.floor(minRange))
            const rightCount = Math.max(0, 100 - Math.floor(maxRange))
            const total = leftCount + rightCount
            if (total <= 0) {
              // fallback - pick random
              resultNum = Math.floor(Math.random() * 100)
            } else {
              const pick = Math.floor(Math.random() * total)
              if (pick < leftCount) {
                resultNum = Math.floor(Math.random() * leftCount)
              } else {
                resultNum = Math.floor(Math.random() * rightCount) + Math.floor(maxRange)
              }
            }
            break
          }
          default:
            resultNum = Math.floor(Math.random() * 100)
        }
      } else {
        // losing result: pick uniformly from the losing region
        switch (mode) {
          case 'under': {
            const top = Math.max(1, Math.floor(rollValue))
            // losing region is [rollValue .. 99]
            const count = 100 - top
            resultNum = Math.floor(Math.random() * count) + top
            break
          }
          case 'over': {
            // losing region is [0 .. rollValue-1]
            const top = Math.max(1, Math.floor(rollValue))
            resultNum = Math.floor(Math.random() * top)
            break
          }
          case 'between': {
            // losing region is [0..minRange-1] U [maxRange..99]
            const leftCount = Math.max(0, Math.floor(minRange))
            const rightCount = Math.max(0, 100 - Math.floor(maxRange))
            const total = leftCount + rightCount
            if (total <= 0) {
              resultNum = Math.floor(Math.random() * 100)
            } else {
              const pick = Math.floor(Math.random() * total)
              if (pick < leftCount) {
                resultNum = Math.floor(Math.random() * leftCount)
              } else {
                resultNum = Math.floor(Math.random() * rightCount) + Math.floor(maxRange)
              }
            }
            break
          }
          case 'outside': {
            // losing region is [minRange .. maxRange-1]
            const low = Math.max(0, Math.floor(minRange))
            const high = Math.max(low + 1, Math.floor(maxRange))
            const span = Math.max(1, high - low)
            resultNum = Math.floor(Math.random() * span) + low
            break
          }
          default:
            resultNum = Math.floor(Math.random() * 100)
        }
      }

      setResultIndex(resultNum)
      setHasPlayed(true)
      setLastGameResult(win ? 'win' : 'lose')

      // Update stats and play effects
      const profit = result.payout - wager
      gameStats.updateStats(profit)

      if (win) {
        sounds.play('win')
        if (enableEffects) {
          effectsRef.current?.winFlash('#00ff00', 1.5)
          effectsRef.current?.screenShake(1, 600)
        }
      } else {
        sounds.play('lose')
        if (enableEffects) {
          effectsRef.current?.loseFlash('#ff4444', 0.8)
          effectsRef.current?.screenShake(0.5, 400)
        }
      }
    } catch (error) {
      console.error('🎲 PLAY ERROR:', error)
      setHasPlayed(false)
      setLastGameResult(null)
      setResultIndex(-1)
    }
  }

  // Human readable condition string
  const conditionText = (() => {
    switch (mode) {
      case 'under': return `Roll Under ${rollValue}`
      case 'over': return `Roll Over ${rollValue}`
      case 'between': return `Roll Between ${minRange} – ${maxRange}`
      case 'outside': return `Roll Outside ${minRange} – ${maxRange}`
    }
  })()

  // Render
  return (
    <>
      {/* Recent Plays Portal - positioned above stats */}
      <GambaUi.Portal target="recentplays">
        <GameRecentPlaysHorizontal gameId="dice" />
      </GambaUi.Portal>

      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Dice"
          gameMode="2D"
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 25%, #4a5568 50%, #2d3748 75%, #1a202c 100%)',
          perspective: '100px'
        }}>
          {/* Main Game Area - Mobile-First */}
          <div style={{
            position: 'absolute',
            top: 'clamp(10px, 3vw, 20px)',
            left: 'clamp(10px, 3vw, 20px)',
            right: 'clamp(10px, 3vw, 20px)',
            bottom: 'clamp(100px, 20vw, 120px)', // Responsive space for GameControlsSection
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(20px, 5vw, 30px)',
            padding: '10px'
          }}>
            {/* Header - Mobile-First */}
            <div style={{
              fontSize: 'clamp(14px, 4vw, 18px)',
              color: hasPlayed && resultIndex >= 0 ? (lastGameResult === 'win' ? '#48bb78' : '#e53e3e') : '#a0aec0',
              textAlign: 'center',
              lineHeight: '1.4',
              fontWeight: hasPlayed ? 'bold' : 'normal'
            }}>
              {hasPlayed && resultIndex >= 0 ?
                `Roll Result: ${resultIndex} - ${lastGameResult === 'win' ? 'WIN!' : 'LOSE'}` :
                'Games Results Will Be Displayed Here'
              }
            </div>

            {/* Possible Winning Display - Mobile-First */}
            <div style={{
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: 'clamp(32px, 8vw, 48px)',
                fontWeight: 'bold',
                marginBottom: '8px',
                lineHeight: '1.2'
              }}>
                <span style={{ color: '#48bb78' }}>
                  <TokenValue exact amount={maxWin} />
                </span>
              </div>
              <div style={{
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                color: '#a0aec0'
              }}>
                Possible Winning
              </div>
            </div>

            {/* Slider Section - Mobile-First */}
            <div style={{
              width: 'clamp(280px, 80vw, 600px)',
              maxWidth: '95%',
              position: 'relative'
            }}>
              {/* Slider Track Numbers */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'clamp(8px, 2vw, 10px)',
                fontSize: 'clamp(12px, 3vw, 14px)',
                color: '#a0aec0'
              }}>
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>

              {/* Slider Container */}
              <div
                ref={sliderRef}
                onPointerDown={(e: React.PointerEvent<HTMLDivElement>) => {
                  // Prevent bar clicks from moving handles unless pointer is near a handle
                  const rect = sliderRef.current?.getBoundingClientRect()
                  if (!rect) return
                  const pct = ((e.clientX) - rect.left) / rect.width * 100
                  const distMin = Math.abs(pct - minRange)
                  const distMax = Math.abs(pct - maxRange)
                  const threshold = 6 // percent threshold to 'grab' a handle
                  if (distMin <= threshold && distMin <= distMax) {
                    setActiveHandle('min')
                  } else if (distMax <= threshold) {
                    setActiveHandle('max')
                  } else {
                    // do not jump handles on bar click
                  }
                }}
                style={{
                position: 'relative',
                height: 'clamp(36px, 8vw, 40px)',
                background: 'rgba(45, 55, 72, 0.8)',
                borderRadius: '20px',
                padding: '4px'
              }}>
                {/* Winning Area(s) */}
                {/* Under: left area; Over: right area; Between: middle area; Outside: two outer areas */}
                {mode === 'under' && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '4px',
                      top: '4px',
                      bottom: '4px',
                      width: `${rollValue}%`,
                      background: 'linear-gradient(90deg, #48bb78, #38a169)',
                      borderRadius: '16px'
                    }}
                  />
                )}

                {mode === 'over' && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '4px',
                      top: '4px',
                      bottom: '4px',
                      width: `${100 - rollValue}%`,
                      background: 'linear-gradient(90deg, #48bb78, #38a169)',
                      borderRadius: '16px'
                    }}
                  />
                )}

                {mode === 'between' && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${minRange}%`,
                      top: '4px',
                      bottom: '4px',
                      width: `${Math.max(0, maxRange - minRange)}%`,
                      background: 'linear-gradient(90deg, #48bb78, #38a169)',
                      borderRadius: '16px'
                    }}
                  />
                )}

                {mode === 'outside' && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        left: '4px',
                        top: '4px',
                        bottom: '4px',
                        width: `${minRange}%`,
                        background: 'linear-gradient(90deg, #48bb78, #38a169)',
                        borderRadius: '16px'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        right: '4px',
                        top: '4px',
                        bottom: '4px',
                        width: `${100 - maxRange}%`,
                        background: 'linear-gradient(90deg, #48bb78, #38a169)',
                        borderRadius: '16px'
                      }}
                    />
                  </>
                )}

                {/* Losing area(s) for visual contrast (simple approach) */}
                {/* We'll show a single red area for under/over and the inverse for between/outside */}
                { (mode === 'under') && (
                  <div style={{
                    position: 'absolute',
                    right: '4px',
                    top: '4px',
                    bottom: '4px',
                    width: `${100 - rollValue}%`,
                    background: 'linear-gradient(90deg, #e53e3e, #c53030)',
                    borderRadius: '16px'
                  }} />
                )}

                { (mode === 'over') && (
                  <div style={{
                    position: 'absolute',
                    left: '4px',
                    top: '4px',
                    bottom: '4px',
                    width: `${rollValue}%`,
                    background: 'linear-gradient(90deg, #e53e3e, #c53030)',
                    borderRadius: '16px'
                  }} />
                )}

                { (mode === 'between') && (
                  <>
                    <div style={{
                      position: 'absolute',
                      left: '4px',
                      top: '4px',
                      bottom: '4px',
                      width: `${minRange}%`,
                      background: 'linear-gradient(90deg, #e53e3e, #c53030)',
                      borderRadius: '16px'
                    }} />
                    <div style={{
                      position: 'absolute',
                      right: '4px',
                      top: '4px',
                      bottom: '4px',
                      width: `${100 - maxRange}%`,
                      background: 'linear-gradient(90deg, #e53e3e, #c53030)',
                      borderRadius: '16px'
                    }} />
                  </>
                )}

                { (mode === 'outside') && (
                  <div style={{
                    position: 'absolute',
                    left: `${minRange}%`,
                    top: '4px',
                    bottom: '4px',
                    width: `${Math.max(0, maxRange - minRange)}%`,
                    background: 'linear-gradient(90deg, #e53e3e, #c53030)',
                    borderRadius: '16px'
                  }} />
                )}

                {/* Slider handles */}
                { (mode === 'under' || mode === 'over') && (
                  <div style={{
                    position: 'absolute',
                    left: `${rollValue}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'clamp(28px, 6vw, 32px)',
                    height: 'clamp(28px, 6vw, 32px)',
                    background: 'linear-gradient(135deg, #e2e8f0, #cbd5e0)',
                    borderRadius: '50%',
                    border: '2px solid #4a5568',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    touchAction: 'manipulation'
                  }} />
                )}

                { (mode === 'between' || mode === 'outside') && (
                  <>
                    <div style={{
                      position: 'absolute',
                      left: `${minRange}%`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 'clamp(24px, 5vw, 28px)',
                      height: 'clamp(24px, 5vw, 28px)',
                      background: 'linear-gradient(135deg, #ffd47a, #ffb84d)',
                      borderRadius: '50%',
                      border: '2px solid #4a5568',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      touchAction: 'manipulation'
                    }} />
                    <div style={{
                      position: 'absolute',
                      left: `${maxRange}%`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 'clamp(24px, 5vw, 28px)',
                      height: 'clamp(24px, 5vw, 28px)',
                      background: 'linear-gradient(135deg, #ffd47a, #ffb84d)',
                      borderRadius: '50%',
                      border: '2px solid #4a5568',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      touchAction: 'manipulation'
                    }} />
                  </>
                )}

                {/* Slider Inputs */}
                { (mode === 'under' || mode === 'over') ? (
                  <input
                    type="range"
                    min="1"
                    max="99"
                    value={rollValue}
                    onChange={(e) => setRollValue(parseInt(e.target.value))}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                ) : (
                  <>
                    {/* minRange handle */}
                    <input
                      type="range"
                      min="1"
                      max={Math.max(2, maxRange - 1)}
                      value={minRange}
                      onPointerDown={() => setActiveHandle('min')}
                      onPointerUp={() => setActiveHandle(null)}
                      onChange={(e) => {
                        const val = Math.min(parseInt(e.target.value), maxRange - 1)
                        setMinRange(val)
                      }}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                        zIndex: activeHandle === 'min' ? 3 : 1
                      }}
                    />
                    {/* maxRange handle */}
                    <input
                      type="range"
                      min={Math.min(2, minRange + 1)}
                      max="99"
                      value={maxRange}
                      onPointerDown={() => setActiveHandle('max')}
                      onPointerUp={() => setActiveHandle(null)}
                      onChange={(e) => {
                        const val = Math.max(parseInt(e.target.value), minRange + 1)
                        setMaxRange(val)
                      }}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                        zIndex: activeHandle === 'max' ? 3 : 1
                      }}
                    />
                  </>
                )}
              </div>
            </div>

            {/* 3D Decorative Dice - Mobile-First & Better Centered */}
            <div style={{
              position: 'absolute',
              top: 'clamp(20px, 5vw, 40px)',
              left: 'clamp(20px, 8vw, 60px)',
              width: 'clamp(60px, 12vw, 80px)',
              height: 'clamp(60px, 12vw, 80px)',
              background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              transform: 'rotate(-15deg) perspective(100px) rotateX(15deg) rotateY(-15deg)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: '1fr 1fr 1fr',
              padding: 'clamp(8px, 2vw, 12px)',
              opacity: 0.7,
              pointerEvents: 'none'
            }}>
              {/* Dice 4 pattern - four corners */}
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'start' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'start' }}></div>
              <div></div>
              <div></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'end' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'end' }}></div>
            </div>
            <div style={{
              position: 'absolute',
              top: 'clamp(20px, 5vw, 40px)',
              right: 'clamp(20px, 8vw, 60px)',
              width: 'clamp(60px, 12vw, 80px)',
              height: 'clamp(60px, 12vw, 80px)',
              background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              transform: 'rotate(15deg) perspective(100px) rotateX(15deg) rotateY(15deg)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: '1fr 1fr 1fr',
              padding: 'clamp(8px, 2vw, 12px)',
              opacity: 0.7,
              pointerEvents: 'none'
            }}>
              {/* Dice 5 pattern - four corners + center */}
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'start' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'start' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'center', alignSelf: 'center' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'end' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'end' }}></div>
            </div>
            <div style={{
              position: 'absolute',
              bottom: 'clamp(80px, 15vw, 120px)',
              left: 'clamp(20px, 8vw, 60px)',
              width: 'clamp(60px, 12vw, 80px)',
              height: 'clamp(60px, 12vw, 80px)',
              background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              transform: 'rotate(25deg) perspective(100px) rotateX(-15deg) rotateY(-25deg)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: '1fr 1fr 1fr',
              padding: 'clamp(8px, 2vw, 12px)',
              opacity: 0.7,
              pointerEvents: 'none'
            }}>
              {/* Dice 3 pattern - diagonal */}
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'start' }}></div>
              <div></div>
              <div></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'center', alignSelf: 'center' }}></div>
              <div></div>
              <div></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'end' }}></div>
            </div>
            <div style={{
              position: 'absolute',
              bottom: 'clamp(80px, 15vw, 120px)',
              right: 'clamp(20px, 8vw, 60px)',
              width: 'clamp(60px, 12vw, 80px)',
              height: 'clamp(60px, 12vw, 80px)',
              background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              transform: 'rotate(-25deg) perspective(100px) rotateX(-15deg) rotateY(25deg)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: '1fr 1fr 1fr',
              padding: 'clamp(8px, 2vw, 12px)',
              opacity: 0.7,
              pointerEvents: 'none'
            }}>
              {/* Dice 6 pattern - two columns of three */}
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'start' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'start' }}></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'center' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'center' }}></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'start', alignSelf: 'end' }}></div>
              <div></div>
              <div style={{ width: 'clamp(4px, 1.2vw, 8px)', height: 'clamp(4px, 1.2vw, 8px)', backgroundColor: '#fff', borderRadius: '50%', justifySelf: 'end', alignSelf: 'end' }}></div>
            </div>
          </div>

          {/* GameControlsSection at bottom - Mobile-First Design */}
          <GameControlsSection>
            <div style={{ 
              display: 'flex',
              gap: 'clamp(12px, 3vw, 20px)',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              flexWrap: 'wrap',
              padding: '8px 12px'
            }}>
              {/* Multiplier Panel */}
              <div style={{
                background: 'rgba(26, 32, 44, 0.9)',
                borderRadius: '12px',
                padding: 'clamp(14px, 3.5vw, 18px)',
                textAlign: 'center',
                minWidth: 'clamp(120px, 22vw, 160px)',
                flex: '1 1 140px',
                maxWidth: '190px',
                border: '2px solid rgba(74, 85, 104, 0.5)',
                boxShadow: '0 4px 16px rgba(26, 32, 44, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ 
                  fontSize: 'clamp(12px, 2.5vw, 14px)', 
                  marginBottom: '8px', 
                  color: '#a0aec0' 
                }}>
                  Multiplier
                </div>
                <div style={{ 
                  fontSize: 'clamp(16px, 4vw, 18px)', 
                  fontWeight: 'bold', 
                  color: '#fff' 
                }}>
                  {multiplier.toFixed(2)}x
                </div>
              </div>
              
              {/* Mode Selector removed from GameControlsSection - moved into Controls portal for better layout on mobile/desktop */}
              
              {/* Win Chance Panel */}
              <div style={{
                background: 'rgba(26, 32, 44, 0.9)',
                borderRadius: '12px',
                padding: 'clamp(14px, 3.5vw, 18px)',
                textAlign: 'center',
                minWidth: 'clamp(120px, 22vw, 160px)',
                flex: '1 1 140px',
                maxWidth: '190px',
                border: '2px solid rgba(74, 85, 104, 0.5)',
                boxShadow: '0 4px 16px rgba(26, 32, 44, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ 
                  fontSize: 'clamp(12px, 2.5vw, 14px)', 
                  marginBottom: '8px', 
                  color: '#a0aec0' 
                }}>
                  Win Chance
                </div>
                <div style={{ 
                  fontSize: 'clamp(16px, 4vw, 18px)', 
                  fontWeight: 'bold', 
                  color: '#fff' 
                }}>
                  {(winChance * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </GameControlsSection>


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
            {...(useGameMeta('dice') && {
              title: useGameMeta('dice')!.name,
              description: useGameMeta('dice')!.description
            })}
          />
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={hasPlayed ? resetGame : play}
          playDisabled={gamba.isPlaying || (!hasPlayed && poolExceeded)}
          playText={hasPlayed ? "Roll Again" : "Roll Dice"}
        />

        {/* Mode selector moved into controls portal for better spacing */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '8px 12px' }}>
          {(['under', 'over', 'between', 'outside'] as DiceMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              disabled={gamba.isPlaying}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.06)',
                background: mode === m ? 'linear-gradient(90deg, #2d3748, #1f2a36)' : 'rgba(0,0,0,0.3)',
                color: mode === m ? '#48bb78' : '#e2e8f0',
                fontWeight: mode === m ? 'bold' : 'normal',
                cursor: gamba.isPlaying ? 'not-allowed' : 'pointer'
              }}
            >
              {m === 'under' && 'Roll Under'}
              {m === 'over' && 'Roll Over'}
              {m === 'between' && 'Roll Between'}
              {m === 'outside' && 'Roll Outside'}
            </button>
          ))}
        </div>

        <DesktopControls
          onPlay={hasPlayed ? resetGame : play}
          playDisabled={gamba.isPlaying || (!hasPlayed && poolExceeded)}
          playText={hasPlayed ? "Roll Again" : "Roll Dice"}
        >
          <EnhancedWagerInput value={wager} onChange={setWager} />
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}
