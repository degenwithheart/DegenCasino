import {
  GambaUi,
  useWagerInput,
  useCurrentToken,
  useCurrentPool,
  useTokenBalance,
  FAKE_TOKEN_MINT,
} from 'gamba-react-ui-v2'
import React, { useContext, useEffect, useState, useRef } from 'react'

import { TOKEN_METADATA } from '../../constants'
import { Paytable } from './Paytable'
import ProgressivePokerPaytable, { ProgressivePokerPaytableRef } from './ProgressivePokerPaytable'
import { PokerCard } from './PokerCard'
import { JACKS_OR_BETTER_BET_ARRAY } from './betArray'
import { GameControls } from '../../components'
import { useIsCompact } from '../../hooks/useIsCompact'
import { ProgressivePokerOverlays } from './ProgressivePokerOverlays'

import { getCurrentHandName, Card as PokerCardType } from './getCurrentHandName'
import { getBestPossibleHandName } from './getBestPossibleHandName'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

// Pulse animation CSS
const pulseFadeStyle = `
  .pulse-fade {
    animation: pulseFade 1.6s infinite;
  @keyframes pulseFade {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }
`

// Card Unicode glyphs - for filler demo only
const CARDS = [
  '🂡', '🂢', '🂣', '🂤', '🂥', '🂦', '🂧', '🂨', '🂩', '🂪', '🂫', '🂭', '🂮'
]

type HandType =
  | 'Bust'
  | 'Pair'
  | 'Three of a Kind'
  | 'Straight'
  | 'Full House'
  | 'Four of a Kind'
  | 'Jackpot'

interface HandTemplate {
  name: string
  type: HandType
}

const HAND_TEMPLATES: Record<number, HandTemplate> = {
  0: { name: 'No Win', type: 'Bust' },
  1: { name: 'Pair', type: 'Pair' },
  2: { name: 'Pair', type: 'Pair' },
  3: { name: 'Three of a Kind', type: 'Three of a Kind' },
  4: { name: 'Straight', type: 'Straight' },
  5: { name: 'Full House', type: 'Full House' },
  6: { name: 'Four of a Kind', type: 'Four of a Kind' },
  7: { name: 'No Win', type: 'Bust' },
  8: { name: 'Three of a Kind', type: 'Three of a Kind' },
  9: { name: 'Jackpot', type: 'Jackpot' },
}

const getPokerHandCards = (type: string) => {
  switch (type) {
    case 'Pair':
      return [
        { rank: 0, suit: 0 },
        { rank: 0, suit: 1 },
        { rank: 5, suit: 2 },
        { rank: 7, suit: 3 },
        { rank: 9, suit: 0 },
      ]
    case 'Three of a Kind':
      return [
        { rank: 2, suit: 0 },
        { rank: 2, suit: 1 },
        { rank: 2, suit: 2 },
        { rank: 7, suit: 3 },
        { rank: 9, suit: 0 },
      ]
    case 'Straight':
      return [
        { rank: 4, suit: 0 },
        { rank: 5, suit: 1 },
        { rank: 6, suit: 2 },
        { rank: 7, suit: 3 },
        { rank: 8, suit: 0 },
      ]
    case 'Full House':
      return [
        { rank: 3, suit: 0 },
        { rank: 3, suit: 1 },
        { rank: 3, suit: 2 },
        { rank: 6, suit: 0 },
        { rank: 6, suit: 1 },
      ]
    case 'Four of a Kind':
      return [
        { rank: 8, suit: 0 },
        { rank: 8, suit: 1 },
        { rank: 8, suit: 2 },
        { rank: 8, suit: 3 },
        { rank: 2, suit: 0 },
      ]
    case 'Jackpot':
      return [
        { rank: 0, suit: 0 },
        { rank: 1, suit: 0 },
        { rank: 2, suit: 0 },
        { rank: 3, suit: 0 },
        { rank: 4, suit: 0 },
      ]
    default:
      return [
        { rank: 1, suit: 0 },
        { rank: 3, suit: 1 },
        { rank: 5, suit: 2 },
        { rank: 7, suit: 3 },
        { rank: 9, suit: 0 },
      ]
  }
}

export default function ProgressivePoker() {
  const [resultModalOpen, setResultModalOpen] = useState(false)
  
  // Live paytable tracking
  const paytableRef = useRef<ProgressivePokerPaytableRef>(null)
  const [currentResult, setCurrentResult] = useState<{
    handType: string
    multiplier: number
  } | undefined>()
  
  // Responsive layout
  const { compact } = useIsCompact()

  useEffect(() => {
    if (!document.getElementById('pulse-fade-style')) {
      const style = document.createElement('style')
      style.id = 'pulse-fade-style'
      style.innerHTML = pulseFadeStyle
      document.head.appendChild(style)
    }
  }, [])

  const [wager, setWager] = useWagerInput()
  const game = GambaUi.useGame()
  const token = useCurrentToken()
  const pool = useCurrentPool()
  const { balance } = useTokenBalance()

  const [hand, setHand] = useState<
    { name: string; type: HandType; payout: number } | null
  >(null)

  const [revealing, setRevealing] = useState(false)
  const [sequence, setSequence] = useState<PokerCardType[]>([])
  const [revealedCards, setRevealedCards] = useState<PokerCardType[]>([])
  const [cardRevealed, setCardRevealed] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ])

  const [profit, setProfit] = useState(0)
  const [inProgress, setInProgress] = useState(false)

  // Overlay states
  const [gamePhase, setGamePhase] = React.useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')
  const [thinkingPhase, setThinkingPhase] = React.useState(false)
  const [dramaticPause, setDramaticPause] = React.useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(1)
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🃏')

  const tokenMeta = token
    ? TOKEN_METADATA.find((t: any) => t.symbol === token.symbol)
    : undefined

  const baseWagerRaw =
    tokenMeta?.baseWager ?? (token?.decimals != null ? Math.pow(10, token.decimals) : 1)
  const baseWager = isFinite(baseWagerRaw) && baseWagerRaw > 0 ? baseWagerRaw : 1
  const tokenPriceRaw = tokenMeta?.usdPrice
  const tokenPrice =
    isFinite(tokenPriceRaw ?? NaN) && (tokenPriceRaw ?? 0) > 0 ? (tokenPriceRaw as number) : 1

  const maxWager = baseWager * 1000000

  useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager)
    } else {
      setWager(0)
    }
  }, [setWager, token, baseWager])

  // For demo, use empty remainingDeck - you can replace with real remaining deck if available from game result
  const remainingDeck: PokerCardType[] = []

  // Calculate best possible based on revealed cards & remaining
  const bestPossible = getBestPossibleHandName(
    revealedCards,
    remainingDeck,
    5 - revealedCards.length
  )

  // Start a new game, get result and sequence
  const play = async (customWager?: number) => {
    // Start thinking phase
    setGamePhase('thinking')
    setThinkingPhase(true)
    setThinkingEmoji(['🃏', '💭', '🎯', '♠️'][Math.floor(Math.random() * 4)])
    
    setHand(null)
    setSequence([])
    setRevealedCards([])
    setCardRevealed([false, false, false, false, false])
    setRevealing(true)

    let currentWager = customWager ?? wager
    currentWager = Number(currentWager)
    if (!isFinite(currentWager) || isNaN(currentWager)) {
      setRevealing(false)
      return
    }

    setInProgress(true)
    try {
      await game.play({
        wager: currentWager,
        bet: JACKS_OR_BETTER_BET_ARRAY,
      })
      const result = await game.result()
      setResultModalOpen(true)

      // Dramatic pause phase
      setGamePhase('dramatic')
      setDramaticPause(true)
      
      // Wait for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 1500))

      const resultIndex = result?.resultIndex ?? 0
      const handTemplate = HAND_TEMPLATES[resultIndex]
      const payout = JACKS_OR_BETTER_BET_ARRAY[resultIndex] * baseWager
      const multiplier = JACKS_OR_BETTER_BET_ARRAY[resultIndex]

      // Track result for live paytable
      setCurrentResult({
        handType: handTemplate.type,
        multiplier: multiplier
      })

      // Get card sequence from generated hand (simulate cards from hand type)
      // In your real code, replace this with actual cards from Gamba engine
      const cardsSequence = getPokerHandCards(handTemplate.type)

      // Convert cardsSequence to PokerCardType[] expected by UI
      // If your sequence from Gamba differs, adapt accordingly
      const seqConverted: PokerCardType[] = cardsSequence.map((c) => ({
        rank: c.rank,
        suit: c.suit,
      }))

      const isWin = payout > 0
      
      // Set celebration intensity based on win amount
      if (isWin) {
        const multiplier = payout / currentWager
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

      setSequence(seqConverted)
      setHand(null) // No hand revealed yet
      setProfit((prev) => prev + payout - currentWager)
      setRevealing(false)
      setRevealedCards([])
      setCardRevealed([false, false, false, false, false])
      
      // Reset to idle after celebration/mourning
      setTimeout(() => {
        setGamePhase('idle')
      }, 3000)
    } catch (e) {
      setRevealing(false)
      setInProgress(false)
      setGamePhase('mourning')
      // Reset to idle after error
      setTimeout(() => {
        setGamePhase('idle')
      }, 3000)
    }
  }

  // Reveal exactly one card at a time from the sequence on Continue
  const handleContinue = () => {
    if (revealing) return
    // Find next unrevealed card index
    const nextIndex = cardRevealed.findIndex((r) => !r)
    if (nextIndex === -1) return // all revealed

    setRevealing(true)
    // Reveal next card with animation delay
    setTimeout(() => {
      setCardRevealed((prev) => {
        const next = [...prev]
        next[nextIndex] = true
        return next
      })

      setRevealedCards((prev) => [...prev, sequence[nextIndex]])

      setRevealing(false)
    }, 350)

    // Bust detection after reveal: check if no possible winning hand remains
    // Because bestPossible depends on revealedCards state, use effect below
  }

  // Effect to bust or finalize after reveal updates
  useEffect(() => {
    if (!inProgress) return

    // Bust detection: if bestPossible indicates bust, end round
    if (bestPossible.toLowerCase().includes('bust')) {
      setInProgress(false)
      setHand({ name: 'Bust', type: 'Bust', payout: 0 })
      return
    }

    // If all cards revealed, finalize hand and payout
    if (revealedCards.length === 5) {
      // Determine final hand type based on revealed cards (use your hand evaluation logic)
      const finalHandName = getCurrentHandName(revealedCards)
      // Find matching template payout
      // You may want to map finalHandName to HAND_TEMPLATES or payout array, simplified here:

      // Simple mapping example:
      let payoutIndex = 0
      for (const [idx, tpl] of Object.entries(HAND_TEMPLATES)) {
        if (finalHandName.toLowerCase().includes(tpl.type.toLowerCase())) {
          payoutIndex = Number(idx)
          break
        }
      }
      const payout = JACKS_OR_BETTER_BET_ARRAY[payoutIndex] * baseWager

      setHand({ name: finalHandName, type: HAND_TEMPLATES[payoutIndex]?.type ?? 'Bust', payout })
      setInProgress(false)
    }
  }, [revealedCards, bestPossible, inProgress, baseWager])

  const handleStart = () => {
    setProfit(0)
    setInProgress(true)
    play()
  }

  const handleCashOut = () => {
    setInProgress(false)
    setHand(null)
    setProfit(0)
    setSequence([])
    setRevealedCards([])
    setCardRevealed([false, false, false, false, false])
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main game area */}
          <div
            style={{
              flex: 1,
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #7c2d12 75%, #c2410c 100%)',
              borderRadius: '24px',
              border: '3px solid rgba(194, 65, 12, 0.3)',
              boxShadow: `
                0 25px 50px rgba(0, 0, 0, 0.5),
                inset 0 2px 4px rgba(255, 255, 255, 0.1),
                inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                0 0 30px rgba(194, 65, 12, 0.2)
              `,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Floating poker background elements */}
            <div style={{
              position: 'absolute',
              top: '5%',
              left: '5%',
              fontSize: '120px',
              opacity: 0.05,
              transform: 'rotate(-15deg)',
              pointerEvents: 'none',
              color: '#7c2d12'
            }}>🃏</div>
            <div style={{
              position: 'absolute',
              bottom: '5%',
              right: '5%',
              fontSize: '100px',
              opacity: 0.06,
              transform: 'rotate(25deg)',
              pointerEvents: 'none',
              color: '#c2410c'
            }}>🎰</div>
            <div style={{
              position: 'absolute',
              top: '40%',
              right: '8%',
              fontSize: '80px',
              opacity: 0.04,
              transform: 'rotate(-30deg)',
              pointerEvents: 'none',
              color: '#ea580c'
            }}>💎</div>
            
            <div style={{
              textAlign: 'center',
              marginBottom: 20,
              zIndex: 10,
              position: 'relative'
            }}>
              <h2 style={{
                fontSize: 32,
                fontWeight: 800,
                margin: '0 0 8px 0',
                letterSpacing: 2,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                color: '#fff'
              }}>
                🃏 PROGRESSIVE POKER 🎰
              </h2>
              <div style={{
                fontSize: 16,
                color: '#888',
                fontWeight: 600
              }}>
                Draw cards to make the best poker hand
              </div>
            </div>

            <GambaUi.Responsive>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 10,
                padding: '20px'
              }}>
                {/* Hand name display */}
                <div
                  style={{
                    marginTop: 0,
                    marginBottom: 24,
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 12,
                    padding: '18px 12px 12px 12px',
                    boxShadow: '0 1px 8px 0 #0003',
                    minHeight: 160,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      letterSpacing: 1,
                      color: '#ffe082',
                      margin: 0,
                      textShadow: '0 2px 8px #000a',
                      minHeight: 34,
                    }}
                  >
                    {hand ? (
                      hand.name !== hand.type ? (
                        <>
                          {hand.name}{' '}
                          <span style={{ color: '#fff', fontWeight: 400 }}>
                            ({hand.type})
                          </span>
                        </>
                      ) : (
                        <>{hand.name}</>
                      )
                    ) : (
                      <span className="pulse-fade" style={{ color: '#fff', opacity: 0.5 }}>
                        Awaiting Hand...
                      </span>
                    )}
                  </h3>
                  
                  {/* Cards display */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 10,
                      margin: '18px 0 10px 0',
                    }}
                  >
                    {(sequence.length ? sequence : Array(5).fill(null)).map((card, i) => {
                      // Always use the same size for both revealed and placeholder cards
                      const cardSize = { width: 68, height: 104 };
                      return (
                        <div
                          key={i}
                          style={{
                            position: 'relative',
                            width: cardSize.width,
                            height: cardSize.height,
                            perspective: 400,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'width 0.2s, height 0.2s',
                          }}
                        >
                          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                            {/* Card front */}
                            <div
                              style={{
                                position: 'absolute',
                                width: 'auto',
                                height: 'auto',
                                minHeight: 104,
                                left: 0,
                                top: 0,
                                borderRadius: 8,
                                background: 'linear-gradient(135deg, #232b3a 60%, #1a1f2b 100%)',
                                boxShadow: '0 2px 8px #000a',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: 54,
                                fontWeight: 700,
                                letterSpacing: 2,
                                zIndex: 2,
                                transform: card && cardRevealed[i] ? 'rotateY(0deg)' : 'rotateY(180deg)',
                                transition: 'transform 0.6s cubic-bezier(.4,2,.6,1)',
                                display: card && cardRevealed[i] ? 'block' : 'none',
                              }}
                            >
                              {card && cardRevealed[i] && <PokerCard rank={card.rank} suit={card.suit} />}
                            </div>
                            {/* Card back */}
                            <div
                              style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                left: 0,
                                top: 0,
                                borderRadius: 8,
                                background: 'linear-gradient(135deg, #232b3a 60%, #1a1f2b 100%)',
                                boxShadow: '0 2px 8px #000a',
                                display: card && cardRevealed[i] ? 'none' : 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: 54,
                                fontWeight: 700,
                                letterSpacing: 2,
                                backfaceVisibility: 'hidden',
                                zIndex: 1,
                                userSelect: 'none',
                                transition: 'display 0.2s, font-size 0.2s',
                              }}
                            >
                              ?
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* LIVE UPDATE TEXT (Current Hand & Best Possible) */}
                <div style={{ marginTop: 12, width: '100%' }}>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 18,
                      textAlign: 'center',
                      color: '#fff',
                      margin: 0,
                      letterSpacing: 0.5,
                    }}
                  >
                    Current Hand:{' '}
                    {revealedCards.length ? (
                      getCurrentHandName(revealedCards)
                    ) : (
                      <span className="pulse-fade" style={{ opacity: 0.6 }}>
                        Evaluating...
                      </span>
                    )}
                  </p>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 18,
                      textAlign: 'center',
                      color: bestPossible.toLowerCase().includes('bust') ? '#ff7f7f' : '#ffe082',
                      margin: 0,
                      letterSpacing: 0.5,
                    }}
                  >
                    Best Possible: {bestPossible}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                    <style>
                      {`
                        @keyframes shimmer {
                          0% { background-position: 0% 50%; }
                          100% { background-position: 100% 50%; }
                        }
                        .shimmer-btn {
                          background: linear-gradient(270deg, #ffe082, #fff4b1, #ffe082);
                          background-size: 600% 600%;
                          animation: shimmer 3s ease-in-out infinite alternate;
                          color: #222;
                          border: none;
                          padding: 12px 24px;
                          font-weight: 700;
                          font-size: 16px;
                          border-radius: 8px;
                          cursor: pointer;
                          width: 160px;
                          user-select: none;
                          transition: box-shadow 0.3s ease;
                        }
                        .shimmer-btn:hover {
                          box-shadow: 0 0 12px #ffe082aa;
                        }
                        .shimmer-btn:disabled {
                          cursor: not-allowed;
                          opacity: 0.5;
                          animation-play-state: paused;
                        }
                      `}
                    </style>
                    <button
                      className="shimmer-btn"
                      disabled={
                        !inProgress ||
                        revealedCards.length >= 5 ||
                        revealing
                      }
                      onClick={handleContinue}
                    >
                      Draw Next Card
                    </button>
                  </div>
                </div>
              </div>
            </GambaUi.Responsive>
          </div>
            
          {/* Paytable sidebar */}
          <ProgressivePokerPaytable
            ref={paytableRef}
            wager={wager}
            currentHandType={hand?.type || (bestPossible.toLowerCase().includes('bust') ? 'Bust' : undefined)}
            currentResult={currentResult}
          />
        </div>
      </GambaUi.Portal>
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={handleStart}
        isPlaying={inProgress}
        playButtonText="Play"
        playButtonDisabled={revealing || balance < wager}
      />
      {renderThinkingOverlay(
        <ProgressivePokerOverlays 
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
