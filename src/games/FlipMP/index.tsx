import { Canvas } from '@react-three/fiber'
import { GambaUi, useSound, useWagerInput, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { useGamba } from 'gamba-react-v2'
import React, { useState, useEffect, useMemo } from 'react'
import { useIsCompact } from '../../hooks/useIsCompact'
import { Coin } from './Coin'
import Effect from './Effect'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { useGambaResult } from '../../hooks/useGambaResult'
import FlipPaytable, { FlipPaytableRef } from './FlipPaytable'
import FlipOverlays from './FlipOverlays'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'
import { GameControls } from '../../components'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useManualMilestone } from '../../context/MilestoneContext'

import SOUND_COIN from './coin.mp3'
import SOUND_LOSE from './lose.mp3'
import SOUND_WIN from './win.mp3'

// ---- Multiplayer Config ----
const COUNTDOWN_SECONDS = 5
const SIDES = {
  heads: [1.95, 0], // 97.5% RTP (2.5% house edge)
  tails: [0, 1.95],
}

type Side = keyof typeof SIDES
type GameMode = '1v1' | '2v2' | '4v4'

type PlayerSlot = {
  wallet?: PublicKey
  name?: string
  ready: boolean
  wagerCommitted: boolean
  team: 'A' | 'B'
  color: string
  sharePercentage: number // For winnings distribution
}

type MatchState = 'lobby' | 'ready' | 'countdown' | 'playing' | 'distributing' | 'complete'

type RoundResult = {
  rngIndex: number // 0 or 1 for coinflip
  winningSide: 'heads' | 'tails'
  winningTeam: 'A' | 'B' | null
  winners: PublicKey[]
  totalPayout: number
  individualShares: Map<string, number> // wallet address -> payout amount
  timestamp: number
}

type WagerCommitment = {
  playerWallet: PublicKey
  amount: number
  team: 'A' | 'B'
  timestamp: number
}

const TEAM_COLORS = {
  A: '#5EEAD4', // teal (heads)
  B: '#FCA5A5', // rose (tails)
}

const MAX_SLOTS_BY_MODE: Record<GameMode, number> = {
  '1v1': 2,
  '2v2': 4,
  '4v4': 8,
}

function useCountdown(active: boolean, seconds: number, onDone: () => void) {
  const [timeLeft, setTimeLeft] = useState<number>(seconds)
  useEffect(() => {
    if (!active) return
    setTimeLeft(seconds)
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          onDone()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [active, seconds, onDone])
  return timeLeft
}

export default function FlipMP() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  
  // ---- Mode & dynamic join ----
  const [mode, setMode] = useState<GameMode>('1v1')
  const maxSlots = MAX_SLOTS_BY_MODE[mode]

  // Player slots
  const [slots, setSlots] = useState<PlayerSlot[]>([])

  // UI / Round state
  const [allReady, setAllReady] = useState(false)
  const [countdownActive, setCountdownActive] = useState(false)
  const timeLeft = useCountdown(countdownActive, COUNTDOWN_SECONDS, () => {
    setCountdownActive(false)
    submitSingleBet()
  })
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null)

  // Game state for visuals
  const [flipping, setFlipping] = useState(false)
  const [win, setWin] = useState(false)
  const [resultIndex, setResultIndex] = useState(0)
  const [side, setSide] = useState<Side>('heads')
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const paytableRef = React.useRef<FlipPaytableRef>(null)
  
  // Game phase management for overlays
  const [gamePhase, setGamePhase] = useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')
  const [thinkingPhase, setThinkingPhase] = useState(false)
  const [dramaticPause, setDramaticPause] = useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = useState(0)
  const [thinkingEmoji, setThinkingEmoji] = useState('🤔')
  
  // Game outcome overlay state
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
    resetGameState,
  } = useGameOutcome()

  // Gamba result storage
  const { storeResult, gambaResult } = useGambaResult()

  // Find token metadata for symbol display
  const tokenMeta = token ? TOKEN_METADATA.find(t => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)

  // Set default wager: 1 for free tokens, 0 for real tokens
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager) // 1 token for free token
    } else {
      setWager(0) // 0 for real tokens
    }
  }, [setWager, token, baseWager])

  const sounds = useSound({
    coin: SOUND_COIN,
    win: SOUND_WIN,
    lose: SOUND_LOSE,
  })

  // Bet params
  const betArray = useMemo(() => SIDES[side], [side])

  // Initialize slots when mode changes
  useEffect(() => {
    const total = MAX_SLOTS_BY_MODE[mode]
    // Alternate teams A/B
    const next: PlayerSlot[] = Array.from({ length: total }).map((_, i) => ({
      wallet: undefined,
      name: undefined,
      ready: false,
      wagerCommitted: false,
      team: i % 2 === 0 ? 'A' : 'B',
      color: i % 2 === 0 ? TEAM_COLORS.A : TEAM_COLORS.B,
      sharePercentage: 0,
    }))
    setSlots(next)
    setAllReady(false)
    setCountdownActive(false)
    setRoundResult(null)
  }, [mode])

  // Compute "all ready"
  useEffect(() => {
    const filled = slots.length > 0 && slots.every(s => !!s.wallet)
    const everyoneReady = filled && slots.every(s => s.ready)
    setAllReady(everyoneReady)
  }, [slots])

  // --- Join handlers ---
  const joinSlot = (index: number, wallet: PublicKey, name?: string) => {
    setSlots(prev => prev.map((s, i) => i === index ? { ...s, wallet, name: name ?? short(wallet.toString()) } : s))
  }
  
  const toggleReady = (index: number) => {
    setSlots(prev => prev.map((s, i) => i === index ? { ...s, ready: !s.ready } : s))
  }

  // Start countdown when all ready
  useEffect(() => {
    if (allReady && !countdownActive && !flipping) {
      setCountdownActive(true)
    }
  }, [allReady, countdownActive, flipping])

  // --- Single Gamba bet submission ---
  async function submitSingleBet() {
    try {
      // Reset states and start overlay sequence
      setWin(false)
      setFlipping(true)
      setGamePhase('thinking')
      setThinkingPhase(true)
      setDramaticPause(false)
      setCelebrationIntensity(0)
      
      // Random thinking emoji
      const thinkingEmojis = ['🤔', '🪙', '🎯', '⚡', '💭', '🔮']
      setThinkingEmoji(thinkingEmojis[Math.floor(Math.random() * thinkingEmojis.length)])

      sounds.play('coin', { playbackRate: .5 })

      await game.play({
        bet: betArray,
        wager,
        metadata: [side],
      })

      // Thinking phase
      await new Promise(resolve => setTimeout(resolve, 1500))
      setThinkingPhase(false)
      
      // Dramatic pause
      setGamePhase('dramatic')
      setDramaticPause(true)
      await new Promise(resolve => setTimeout(resolve, 1200))
      setDramaticPause(false)

      sounds.play('coin')

      const result = await game.result()

      // Store result in context for modal
      storeResult(result)

      const win = result.payout > 0
      const winningSide: 'heads' | 'tails' = result.resultIndex === 0 ? 'heads' : 'tails'

      // Map side to team: team A = heads, team B = tails
      const winningTeam = winningSide === 'heads' ? 'A' : 'B'
      const winners = slots.filter(s => s.team === winningTeam && s.wallet).map(s => s.wallet!) || []

      const roundResult: RoundResult = {
        rngIndex: result.resultIndex,
        winningSide,
        winningTeam,
        winners,
        timestamp: Date.now(),
        totalPayout: 0,
        individualShares: new Map<string, number>()
      }

      setResultIndex(result.resultIndex)
      setWin(win)
      setRoundResult(roundResult)

      // Track game result in paytable
      paytableRef.current?.trackGame({
        guess: side,
        result: winningSide,
        wasWin: win,
        amount: win ? result.payout - wager : 0,
        multiplier: win ? result.payout / wager : 0,
      })

      // Handle celebration or mourning overlays
      if (win) {
        const multiplier = result.payout / wager
        let intensity = 1
        if (multiplier >= 5) intensity = 3
        else if (multiplier >= 2.5) intensity = 2
        
        setCelebrationIntensity(intensity)
        setGamePhase('celebrating')
        sounds.play('win')
        
        // Auto-reset after celebration
        setTimeout(() => {
          setGamePhase('idle')
          setCelebrationIntensity(0)
        }, 4000)
      } else {
        setGamePhase('mourning')
        sounds.play('lose')
        
        // Auto-reset after mourning
        setTimeout(() => {
          setGamePhase('idle')
        }, 2500)
      }
      
      // Show outcome overlay
      handleGameComplete({ payout: result.payout, wager })
    } finally {
      setFlipping(false)
      // Reset slots to allow new round
      setTimeout(() => {
        setSlots(prev => prev.map(s => ({ ...s, ready: false })))
        setAllReady(false)
        setCountdownActive(false)
      }, 3000)
    }
  }

  // UI helpers
  const canJoin = (index: number) => !slots[index].wallet
  const short = (w: string) => w.slice(0, 4) + '…' + w.slice(-4)

  // Responsive scaling logic using useIsCompact
  const isCompact = useIsCompact()
  const [scale, setScale] = React.useState(isCompact ? 1 : 1.2)

  React.useEffect(() => {
    setScale(isCompact ? 1 : 1.2)
  }, [isCompact])

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main Game Area */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            gap: 16,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f4c75 50%, #3282b8 75%, #bbe1fa 100%)',
            borderRadius: '24px',
            border: '3px solid rgba(50, 130, 184, 0.3)',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.5),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.3),
              0 0 30px rgba(50, 130, 184, 0.2)
            `,
            position: 'relative',
            overflow: 'hidden',
            padding: '20px'
          }}>
            
            {/* Background Effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(187, 225, 250, 0.1) 0%, transparent 50%)',
              opacity: flipping ? 1 : 0.5,
              transition: 'opacity 0.5s ease'
            }} />

            {/* Floating multiplayer elements */}
            <div style={{
              position: 'absolute',
              top: '12%',
              left: '10%',
              fontSize: '130px',
              opacity: 0.08,
              transform: 'rotate(-18deg)',
              pointerEvents: 'none',
              color: '#3282b8'
            }}>⚔️</div>
            <div style={{
              position: 'absolute',
              bottom: '18%',
              right: '12%',
              fontSize: '110px',
              opacity: 0.06,
              transform: 'rotate(22deg)',
              pointerEvents: 'none',
              color: '#bbe1fa'
            }}>🏆</div>
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '18%',
              fontSize: '90px',
              opacity: 0.05,
              transform: 'rotate(-28deg)',
              pointerEvents: 'none',
              color: '#0f4c75'
            }}>🎯</div>
            <div style={{
              position: 'absolute',
              bottom: '40%',
              left: '15%',
              fontSize: '85px',
              opacity: 0.07,
              transform: 'rotate(35deg)',
              pointerEvents: 'none',
              color: '#16213e'
            }}>⚡</div>

            {/* Header: Mode selection and wager display */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontWeight: 700, color: '#fff' }}>Mode:</span>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as GameMode)}
                  disabled={flipping || countdownActive}
                  style={{
                    background: 'rgba(50, 130, 184, 0.2)',
                    border: '1px solid rgba(50, 130, 184, 0.5)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontWeight: 600
                  }}
                >
                  <option value="1v1">1v1</option>
                  <option value="2v2">2v2</option>
                  <option value="4v4">4v4</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600 }}>
                  TEAM A: HEADS | TEAM B: TAILS
                </div>
                <div style={{ color: '#FCD34D', fontSize: '14px', fontWeight: 700 }}>
                  2.00x PAYOUT
                </div>
              </div>
            </div>

            {/* Player lobby grid */}
            <div style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: mode === '1v1' ? '1fr 1fr' : mode === '2v2' ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: '12px',
              gridTemplateRows: mode === '4v4' ? 'repeat(2, 1fr)' : '1fr',
              opacity: flipping ? 0.3 : 1,
              transition: 'opacity 0.5s ease',
              filter: flipping ? 'blur(2px)' : 'none'
            }}>
              {slots.map((slot, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: `2px solid ${slot.color}40`,
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'all 0.3s ease',
                    transform: slot.ready ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: slot.ready ? `0 0 20px ${slot.color}60` : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div
                      style={{
                        background: slot.color,
                        color: '#000',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        animation: slot.ready ? 'glow 2s ease-in-out infinite alternate' : 'none'
                      }}
                    >
                      TEAM {slot.team}
                    </div>
                    <div style={{ color: '#9CA3AF', fontSize: '12px' }}>
                      #{i + 1}
                    </div>
                  </div>

                  {slot.wallet ? (
                    <>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>
                        {slot.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: slot.ready ? '#22C55E' : '#6B7280',
                            transition: 'background 0.3s ease',
                            animation: slot.ready ? 'pulse 1.5s ease-in-out infinite' : 'none'
                          }}
                        />
                        <span style={{ color: slot.ready ? '#22C55E' : '#9CA3AF', fontSize: '12px', fontWeight: 600 }}>
                          {slot.ready ? 'READY' : 'NOT READY'}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleReady(i)}
                        disabled={flipping || countdownActive}
                        style={{
                          background: slot.ready ? 'rgba(34, 197, 94, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                          border: `1px solid ${slot.ready ? '#22C55E' : '#6B7280'}`,
                          borderRadius: '8px',
                          padding: '8px',
                          color: slot.ready ? '#22C55E' : '#9CA3AF',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: flipping || countdownActive ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease',
                          transform: 'scale(1)',
                        }}
                        onMouseEnter={(e) => {
                          if (!flipping && !countdownActive) {
                            e.currentTarget.style.transform = 'scale(1.05)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                      >
                        {slot.ready ? 'READY ✓' : 'READY UP'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => joinSlot(i, new PublicKey('11111111111111111111111111111111'), `Player ${i + 1}`)}
                      disabled={flipping || countdownActive}
                      style={{
                        background: 'rgba(50, 130, 184, 0.2)',
                        border: '1px solid rgba(50, 130, 184, 0.5)',
                        borderRadius: '8px',
                        padding: '16px',
                        color: '#3282b8',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: flipping || countdownActive ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        transform: 'scale(1)',
                      }}
                      onMouseEnter={(e) => {
                        if (!flipping && !countdownActive) {
                          e.currentTarget.style.transform = 'scale(1.02)'
                          e.currentTarget.style.background = 'rgba(50, 130, 184, 0.3)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.background = 'rgba(50, 130, 184, 0.2)'
                      }}
                    >
                      + JOIN TEAM {slot.team}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Countdown bar */}
            {countdownActive && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                animation: 'countdownPulse 1s ease-in-out infinite',
                boxShadow: '0 0 30px rgba(252, 211, 77, 0.5)'
              }}>
                <div style={{ color: '#FCD34D', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                  ⏰ GAME STARTING IN
                </div>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: 700,
                  animation: timeLeft <= 3 ? 'urgentCountdown 0.5s ease-in-out infinite' : 'none',
                  color: timeLeft <= 3 ? '#EF4444' : '#fff'
                }}>
                  {timeLeft}
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '2px',
                  marginTop: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(timeLeft / COUNTDOWN_SECONDS) * 100}%`,
                    height: '100%',
                    background: timeLeft <= 3 ? '#EF4444' : '#FCD34D',
                    transition: 'width 1s linear',
                    borderRadius: '2px'
                  }} />
                </div>
              </div>
            )}

            {/* 3D Coin Canvas - shown during flipping */}
            {flipping && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '300px',
                height: '300px',
                zIndex: 20
              }}>
                <Canvas
                  linear
                  flat
                  orthographic
                  camera={{
                    zoom: isCompact ? 160 : 180,
                    position: [0, 0, 100],
                  }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <React.Suspense fallback={null}>
                    <Coin flipping={flipping} targetSide={resultIndex === 0 ? 'heads' : 'tails'} />
                  </React.Suspense>
                  <Effect />
                  {win && <Effect />}
                  <ambientLight intensity={3} />
                  <directionalLight
                    position-z={1}
                    position-y={1}
                    castShadow
                    color="#CCCCCC"
                  />
                  <hemisphereLight
                    intensity={.5}
                    position={[0, 1, 0]}
                    scale={[1, 1, 1]}
                    color="#ffadad"
                    groundColor="#6666fe"
                  />
                </Canvas>
              </div>
            )}

            {/* Round result display */}
            {roundResult && !flipping && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.8)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center'
              }}>
                <div style={{ color: '#FCD34D', fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>
                  🎉 ROUND COMPLETE
                </div>
                <div style={{ color: '#fff', fontSize: '16px', marginBottom: '8px' }}>
                  Winning Side: <span style={{ color: roundResult.winningSide === 'heads' ? TEAM_COLORS.A : TEAM_COLORS.B, fontWeight: 700 }}>
                    {roundResult.winningSide.toUpperCase()}
                  </span>
                </div>
                <div style={{ color: '#fff', fontSize: '16px', marginBottom: '8px' }}>
                  Winning Team: <span style={{ color: roundResult.winningTeam ? TEAM_COLORS[roundResult.winningTeam] : '#6B7280', fontWeight: 700 }}>
                    {roundResult.winningTeam}
                  </span>
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '14px' }}>
                  Winners: {roundResult.winners.length > 0 ? roundResult.winners.map(w => short(w.toString())).join(', ') : 'None'}
                </div>
              </div>
            )}
            
            {/* Add the overlay component */}
            {renderThinkingOverlay(
              <FlipOverlays
                gamePhase={
                  countdownActive ? 'countdown' : 
                  roundResult ? 'done' : 
                  'idle'
                }
                thinkingPhase={thinkingPhase}
                result={roundResult?.winningSide || null}
              />
            )}
          </div>

          {/* Live Paytable */}
          <FlipPaytable
            ref={paytableRef}
            wager={wager}
            selectedSide={side}
          />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={submitSingleBet}
        isPlaying={flipping || countdownActive}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'Restart Match' : 'Join & Start'}
        onPlayAgain={handlePlayAgain}
      >
        {/* Side Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Your Side:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <GambaUi.Button
              onClick={() => setSide('heads')}
              disabled={flipping || showOutcome || countdownActive}
            >
              {side === 'heads' ? '✓ 👑 Heads' : '👑 Heads'}
            </GambaUi.Button>
            <GambaUi.Button
              onClick={() => setSide('tails')}
              disabled={flipping || showOutcome || countdownActive}
            >
              {side === 'tails' ? '✓ ⚡ Tails' : '⚡ Tails'}
            </GambaUi.Button>
          </div>
        </div>
      </GameControls>

      {/* Global styles for animations */}
      <style>{`
        @keyframes glow {
          from {
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
          }
          to {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes countdownPulse {
          0%, 100% {
            box-shadow: 0 0 30px rgba(252, 211, 77, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(252, 211, 77, 0.6);
          }
        }

        @keyframes urgentCountdown {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </>
  )
}
