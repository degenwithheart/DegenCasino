import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useCurrentToken,
  useTokenBalance,
  useSound,
  useWagerInput,
  FAKE_TOKEN_MINT,
} from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import { GameControls } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { useGambaResult } from '../../hooks/useGambaResult'
import React, { useRef } from 'react'
import {
  CARD_VALUES,
  RANKS,
  RANK_SYMBOLS,
  SUIT_COLORS,
  SUIT_SYMBOLS,
  SUITS,
  SOUND_CARD,
  SOUND_LOSE,
  SOUND_PLAY,
  SOUND_WIN,
  SOUND_JACKPOT,
} from './constants'
import {
  Card,
  CardContainer,
  CardsContainer,
  Container,
  Profit,
  CardArea,
  HandsWrapper,
  ProfitWrapper,
} from './styles'
import { TOKEN_METADATA } from '../../constants'
import { useIsCompact } from '../../hooks/useIsCompact'
import BlackJackPaytable, { BlackJackPaytableRef } from './BlackJackPaytable'
import BlackJackOverlays from './BlackJackOverlays'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

const randomRank = () => Math.floor(Math.random() * RANKS)
const randomSuit = () => Math.floor(Math.random() * SUITS)

const createCard = (rank = randomRank(), suit = randomSuit()): Card => ({
  key: Math.random(),
  rank,
  suit,
})

// Helper function to calculate hand total
const calculateHandTotal = (cards: Card[]): number => {
  let total = 0
  let aces = 0
  
  for (const card of cards) {
    const value = CARD_VALUES[card.rank]
    if (value === 1) {
      aces++
      total += 11 // Count ace as 11 initially
    } else {
      total += value
    }
  }
  
  // Convert aces from 11 to 1 if total is over 21
  while (total > 21 && aces > 0) {
    total -= 10
    aces--
  }
  
  return total
}

interface Card {
  key: number
  rank: number
  suit: number
}

export interface BlackjackConfig {
  logo: string
}

export default function Blackjack(props: BlackjackConfig) {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const isCompact = useIsCompact()
  const tokenMeta = token ? TOKEN_METADATA.find((t: any) => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
  const maxWager = baseWager * 1000000
  const tokenPrice = tokenMeta?.usdPrice ?? 0
  const [wager, setWager] = useWagerInput()
  const [playerCards, setPlayerCards] = React.useState<Card[]>([])
  const [dealerCards, setDealerCards] = React.useState<Card[]>([])
  const [profit, setProfit] = React.useState<number | null>(null)
  const [claiming, setClaiming] = React.useState(false)
  const isPlaying = gamba.isPlaying

  // Game phase management for overlays
  const [gamePhase, setGamePhase] = React.useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')
  const [thinkingPhase, setThinkingPhase] = React.useState(false)
  const [dramaticPause, setDramaticPause] = React.useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(0)
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🤔')

  // Live paytable tracking
  const paytableRef = useRef<BlackJackPaytableRef>(null)
  const [currentResult, setCurrentResult] = React.useState<{
    playerCards: any[]
    dealerCards: any[]
    playerTotal: number
    dealerTotal: number
    outcome: 'blackjack' | 'win' | 'push' | 'lose'
    multiplier: number
    wasWin: boolean
  } | undefined>()

  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
  } = useGameOutcome()

  // Dynamic play button text
  const playButtonText = hasPlayedBefore && !showOutcome ? "Restart" : "Start"

  // Gamba result storage
  const { storeResult } = useGambaResult()

  // Set default wager: 1 for free tokens, 0 for real tokens
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager) // 1 token for free token
    } else {
      setWager(0) // 0 for real tokens
    }
  }, [setWager, token, baseWager])

  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    card: SOUND_CARD,
    jackpot: SOUND_JACKPOT,
  })

  const resetGame = () => {
    setProfit(null)
    setPlayerCards([])
    setDealerCards([])
  }

  const play = async () => {
    // Reset states and start overlay sequence
    resetGame()
    setGamePhase('thinking')
    setThinkingPhase(true)
    setDramaticPause(false)
    setCelebrationIntensity(0)
    
    // Random thinking emoji
    const thinkingEmojis = ['🤔', '🎯', '🃏', '⚡', '🎲', '💭']
    setThinkingEmoji(thinkingEmojis[Math.floor(Math.random() * thinkingEmojis.length)])
    
    sounds.play('play')

    const betArray = [2.4, 2.4, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 0, 0, 0, 0, 0, 0, 0, 0, 0] // 96% RTP

    await game.play({
      bet: betArray,
      wager,
    })

    // Thinking phase
    await new Promise(resolve => setTimeout(resolve, 1500))
    setThinkingPhase(false)
    
    // Dramatic pause
    setGamePhase('dramatic')
    setDramaticPause(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    setDramaticPause(false)

    const result = await game.result()

    // Store result in context for modal
    storeResult(result)
    const payoutMultiplier = result.payout / wager

    let newPlayerCards: Card[] = []
    let newDealerCards: Card[] = []

    if (payoutMultiplier === 2.5) {
      newPlayerCards = generateBlackjackHand()
      newDealerCards = generateRandomHandBelow(21)
    } else if (payoutMultiplier === 2) {
      newPlayerCards = generateWinningHand()
      newDealerCards = generateLosingHand(newPlayerCards)
    } else {
      newPlayerCards = generateLosingHand()
      newDealerCards = generateWinningHandOver(newPlayerCards)
    }

    const dealCards = async () => {
      for (let i = 0; i < 2; i++) {
        if (i < newPlayerCards.length) {
          setPlayerCards(prev => [...prev, newPlayerCards[i]])
          sounds.play('card')
          await new Promise(resolve => setTimeout(resolve, 500))
        }
        if (i === 1 && payoutMultiplier === 2.5) {
          sounds.play('jackpot')
        }
        if (i < newDealerCards.length) {
          setDealerCards(prev => [...prev, newDealerCards[i]])
          sounds.play('card')
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
    }

    await dealCards()

    // Calculate hand totals and determine outcome
    const playerTotal = calculateHandTotal(newPlayerCards)
    const dealerTotal = calculateHandTotal(newDealerCards)
    
    let outcome: 'blackjack' | 'win' | 'push' | 'lose'
    if (payoutMultiplier === 2.5) {
      outcome = 'blackjack'
    } else if (payoutMultiplier === 2) {
      outcome = 'win'
    } else if (payoutMultiplier === 1) {
      outcome = 'push'
    } else {
      outcome = 'lose'
    }
    
    const wasWin = payoutMultiplier > 1
    
    // Track result in paytable
    const resultData = {
      playerCards: newPlayerCards,
      dealerCards: newDealerCards,
      playerTotal,
      dealerTotal,
      outcome,
      multiplier: payoutMultiplier,
      wasWin
    }
    setCurrentResult(resultData)
    
    if (paytableRef.current) {
      paytableRef.current.trackHand({
        playerCards: newPlayerCards,
        dealerCards: newDealerCards,
        playerTotal,
        dealerTotal,
        outcome,
        multiplier: payoutMultiplier,
        wasWin,
        amount: result.payout
      })
    }

    setProfit(result.payout)
    
    // Handle celebration or mourning overlays
    if (wasWin) {
      let intensity = 1
      if (payoutMultiplier >= 2.5) intensity = 3  // Blackjack
      else if (payoutMultiplier >= 2) intensity = 2  // Regular win
      
      setCelebrationIntensity(intensity)
      setGamePhase('celebrating')
      
      // Auto-reset after celebration
      setTimeout(() => {
        setGamePhase('idle')
        setCelebrationIntensity(0)
      }, 4000)
    } else {
      setGamePhase('mourning')
      
      // Auto-reset after mourning
      setTimeout(() => {
        setGamePhase('idle')
      }, 2500)
    }
    handleGameComplete({ payout: result.payout, wager })

    if (payoutMultiplier === 2.5) {
      // already played jackpot
    } else if (payoutMultiplier > 0) {
      sounds.play('win')
    } else {
      sounds.play('lose')
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

  const getHandValue = (hand: Card[]): number => {
    return hand.reduce((sum, c) => sum + CARD_VALUES[c.rank], 0)
  }

  const generateBlackjackHand = (): Card[] => {
    const aceRank = 12
    const tenRanks = [8, 9, 10, 11]
    const tenCardRank = tenRanks[Math.floor(Math.random() * tenRanks.length)]
    return [createCard(aceRank, randomSuit()), createCard(tenCardRank, randomSuit())]
  }

  const generateRandomHandBelow = (maxTotal: number): Card[] => {
    let handValue = maxTotal
    while (handValue >= maxTotal) {
      const card1 = createCard()
      const card2 = createCard()
      handValue = CARD_VALUES[card1.rank] + CARD_VALUES[card2.rank]
      if (handValue < maxTotal) {
        return [card1, card2]
      }
    }
    return []
  }

  const generateWinningHand = (): Card[] => {
    const totals = [17, 18, 19, 20]
    const targetTotal = totals[Math.floor(Math.random() * totals.length)]
    return generateHandWithTotal(targetTotal)
  }

  const generateLosingHand = (opponentHand?: Card[]): Card[] => {
    const opponentTotal = opponentHand ? getHandValue(opponentHand) : 20
    let total = opponentTotal
    while (total >= opponentTotal) {
      const hand = [createCard(), createCard()]
      total = getHandValue(hand)
      if (total < opponentTotal) {
        return hand
      }
    }
    return []
  }

  const generateWinningHandOver = (opponentHand: Card[]): Card[] => {
    const opponentTotal = getHandValue(opponentHand)
    let total = opponentTotal
    while (total <= opponentTotal || total > 21) {
      const hand = [createCard(), createCard()]
      total = getHandValue(hand)
      if (total > opponentTotal && total <= 21) {
        return hand
      }
    }
    return []
  }

  const generateHandWithTotal = (targetTotal: number): Card[] => {
    for (let i = 0; i < 100; i++) {
      const card1 = createCard()
      const card2 = createCard()
      if (CARD_VALUES[card1.rank] + CARD_VALUES[card2.rank] === targetTotal) {
        return [card1, card2]
      }
    }
    return generateRandomHandBelow(targetTotal)
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
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #166534 75%, #059669 100%)',
              borderRadius: '24px',
              border: '3px solid rgba(5, 150, 105, 0.3)',
              boxShadow: `
                0 25px 50px rgba(0, 0, 0, 0.5),
                inset 0 2px 4px rgba(255, 255, 255, 0.1),
                inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                0 0 30px rgba(5, 150, 105, 0.2)
              `,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Floating blackjack background elements */}
            <div style={{
              position: 'absolute',
              top: '5%',
              left: '5%',
              fontSize: '120px',
              opacity: 0.05,
              transform: 'rotate(-15deg)',
              pointerEvents: 'none',
              color: '#059669'
            }}>♠️</div>
            <div style={{
              position: 'absolute',
              bottom: '5%',
              right: '5%',
              fontSize: '100px',
              opacity: 0.06,
              transform: 'rotate(25deg)',
              pointerEvents: 'none',
              color: '#16a34a'
            }}>♥️</div>
            <div style={{
              position: 'absolute',
              top: '40%',
              right: '8%',
              fontSize: '80px',
              opacity: 0.04,
              transform: 'rotate(-25deg)',
              pointerEvents: 'none',
              color: '#166534'
            }}>♦️</div>
            <div style={{
              position: 'absolute',
              bottom: '30%',
              left: '8%',
              fontSize: '70px',
              opacity: 0.05,
              transform: 'rotate(30deg)',
              pointerEvents: 'none',
              color: '#15803d'
            }}>♣️</div>
            
            

            <GambaUi.Responsive>
              <Container $disabled={claiming || isPlaying}>
                {/* REVOLUTIONARY FIRST-PERSON CASINO VIEW */}
                <div style={{ 
                  display: 'grid',
                  gridTemplateRows: '80px 1fr 120px',
                  gridTemplateColumns: '1fr',
                  position: 'relative',
                  zIndex: 10,
                  width: '100%',
                  height: '600px',
                  background: `
                    perspective(800px),
                    linear-gradient(180deg, 
                      rgba(0,20,0,0.9) 0%, 
                      rgba(0,60,0,0.8) 30%, 
                      rgba(0,100,0,0.9) 70%, 
                      rgba(0,40,0,0.95) 100%
                    )
                  `,
                  borderRadius: '20px',
                  border: '3px solid #8B4513',
                  boxShadow: `
                    0 20px 60px rgba(0,0,0,0.6),
                    inset 0 0 40px rgba(0,150,0,0.2),
                    0 0 20px rgba(139,69,19,0.4)
                  `,
                  overflow: 'hidden',
                  transform: 'perspective(1000px) rotateX(5deg)'
                }}>

                  {/* TOP ROW - Dealer's Distant Area */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    padding: '10px',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.6), transparent)',
                    position: 'relative'
                  }}>
                    {/* Dealer Status Bar */}
                    <div style={{
                      background: 'linear-gradient(90deg, #8B0000, #DC143C, #8B0000)',
                      borderRadius: '30px',
                      padding: '8px 24px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 800,
                      boxShadow: '0 4px 20px rgba(220,20,60,0.4)',
                      border: '2px solid #FFD700',
                      animation: 'dealerPulse 2s ease-in-out infinite'
                    }}>
                      🎩 DEALER HAND: {calculateHandTotal(dealerCards)}
                    </div>

                    {/* Dealer Cards - Floating in Distance */}
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: '8px',
                      perspective: '500px'
                    }}>
                      {dealerCards.map((card, index) => (
                        <div
                          key={card.key}
                          style={{
                            width: '40px',
                            height: '56px',
                            background: 'linear-gradient(135deg, #fff, #f0f0f0)',
                            borderRadius: '4px',
                            border: '1px solid #333',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            transform: `translateZ(${index * 10}px) rotateX(45deg)`,
                            animation: `cardFloatIn 1.2s ease-out ${index * 0.2}s both`,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: '3px',
                            fontSize: '8px',
                            fontWeight: 'bold',
                            color: card.suit === 1 || card.suit === 2 ? '#DC143C' : '#000'
                          }}
                        >
                          <div>{RANK_SYMBOLS[card.rank]}</div>
                          <div style={{ textAlign: 'center', fontSize: '12px' }}>
                            {SUIT_SYMBOLS[card.suit]}
                          </div>
                          <div style={{ transform: 'rotate(180deg)', textAlign: 'right' }}>
                            {RANK_SYMBOLS[card.rank]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MIDDLE ROW - Main Game Area with Action Zones */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 200px 1fr',
                    gap: '20px',
                    padding: '20px',
                    position: 'relative'
                  }}>
                    {/* Left Action Zone - Card Stack */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      {/* Deck Stack */}
                      <div style={{
                        position: 'relative',
                        width: '60px',
                        height: '84px'
                      }}>
                        {[...Array(5)].map((_, i) => (
                          <div key={i} style={{
                            position: 'absolute',
                            width: '60px',
                            height: '84px',
                            background: 'linear-gradient(135deg, #1a1a2e, #2d3748)',
                            borderRadius: '6px',
                            border: '1px solid #4A5568',
                            top: `${i * 2}px`,
                            left: `${i * 2}px`,
                            zIndex: 5 - i,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                          }} />
                        ))}
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: '#FFD700',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          zIndex: 10
                        }}>
                          🃏
                        </div>
                      </div>

                      {/* Shuffle Animation */}
                      <div style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '12px',
                        textAlign: 'center',
                        animation: isPlaying ? 'shuffleText 1s ease-in-out infinite' : 'none'
                      }}>
                        {isPlaying ? '🔄 Shuffling...' : '📚 Deck Ready'}
                      </div>
                    </div>

                    {/* Center Zone - Betting Circle & Status */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '20px'
                    }}>
                      {/* Integrated Table Title */}
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(139,69,19,0.9), rgba(160,82,45,0.7))',
                        borderRadius: '25px',
                        padding: '8px 24px',
                        border: '2px solid #FFD700',
                        boxShadow: '0 4px 15px rgba(255,215,0,0.3)',
                        marginBottom: '10px'
                      }}>
                        <div style={{
                          color: '#FFD700',
                          fontSize: '18px',
                          fontWeight: 800,
                          textAlign: 'center',
                          letterSpacing: '2px',
                          textShadow: '0 2px 4px rgba(0,0,0,0.7)'
                        }}>
                          ♠ BLACKJACK ♥
                        </div>
                      </div>

                      {/* Multi-Layer Betting Circle */}
                      <div style={{
                        position: 'relative',
                        width: '140px',
                        height: '140px'
                      }}>
                        {/* Outer Ring */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '50%',
                          background: `
                            conic-gradient(from 0deg, 
                              #FFD700, #FFA500, #FF8C00, #DAA520, 
                              #FFD700, #FFA500, #FF8C00, #DAA520, #FFD700
                            )
                          `,
                          animation: 'ringRotate 4s linear infinite'
                        }} />
                        
                        {/* Middle Ring */}
                        <div style={{
                          position: 'absolute',
                          inset: '10px',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(139,69,19,0.9), rgba(160,82,45,0.7))',
                          border: '3px solid #8B4513'
                        }} />
                        
                        {/* Inner Circle */}
                        <div style={{
                          position: 'absolute',
                          inset: '25px',
                          borderRadius: '50%',
                          background: `
                            radial-gradient(circle at 30% 30%, 
                              rgba(255,215,0,0.9), 
                              rgba(218,165,32,0.7), 
                              rgba(139,69,19,0.8)
                            )
                          `,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)',
                          animation: 'chipGlow 2s ease-in-out infinite alternate'
                        }}>
                          <div style={{
                            color: '#8B4513',
                            fontSize: '12px',
                            fontWeight: 800,
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                          }}>
                            BET
                          </div>
                          <div style={{
                            color: '#8B4513',
                            fontSize: '10px',
                            fontWeight: 600,
                            textAlign: 'center'
                          }}>
                            <TokenValue amount={wager} />
                          </div>
                        </div>
                      </div>

                      {/* Game Status Hologram */}
                      {profit !== null && (
                        <div style={{
                          background: profit > 0 
                            ? 'linear-gradient(45deg, #00FF41, #00CC33, #00FF41)'
                            : profit < 0
                            ? 'linear-gradient(45deg, #FF0040, #CC0033, #FF0040)'
                            : 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700)',
                          color: 'white',
                          padding: '12px 20px',
                          borderRadius: '15px',
                          fontSize: '14px',
                          fontWeight: 800,
                          textAlign: 'center',
                          boxShadow: `0 0 20px ${profit > 0 ? '#00FF41' : profit < 0 ? '#FF0040' : '#FFD700'}`,
                          animation: 'hologramFloat 1s ease-out',
                          border: '1px solid rgba(255,255,255,0.3)',
                          backdropFilter: 'blur(10px)'
                        }}>
                          {profit > 0 ? '🚀 VICTORY!' : profit < 0 ? '� DEFEAT' : '⚖️ DRAW'}
                          <div style={{ fontSize: '10px', opacity: 0.9 }}>
                            <TokenValue amount={profit} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Action Zone - Discard Pile */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      {/* Discard Pile */}
                      <div style={{
                        position: 'relative',
                        width: '60px',
                        height: '84px'
                      }}>
                        <div style={{
                          width: '60px',
                          height: '84px',
                          background: 'linear-gradient(135deg, #2d3748, #4A5568)',
                          borderRadius: '6px',
                          border: '2px dashed rgba(255,255,255,0.3)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'rgba(255,255,255,0.5)',
                          fontSize: '24px'
                        }}>
                          🗑️
                        </div>
                      </div>

                      <div style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '12px',
                        textAlign: 'center'
                      }}>
                        💳 Discard
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ROW - Player's Hand Area (First Person View) */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '20px',
                    background: 'linear-gradient(0deg, rgba(0,40,0,0.8), transparent)',
                    position: 'relative'
                  }}>
                    {/* Player Hand Status */}
                    <div style={{
                      position: 'absolute',
                      top: '5px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(90deg, #006400, #228B22, #006400)',
                      borderRadius: '20px',
                      padding: '6px 20px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 800,
                      boxShadow: '0 4px 15px rgba(34,139,34,0.4)',
                      border: '2px solid #FFD700'
                    }}>
                      🎯 YOUR HAND: {calculateHandTotal(playerCards)}
                    </div>

                    {/* Player Cards - First Person Perspective */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '15px',
                      marginTop: '35px',
                      perspective: '400px'
                    }}>
                      {playerCards.map((card, index) => (
                        <div
                          key={card.key}
                          style={{
                            width: '80px',
                            height: '112px',
                            background: 'linear-gradient(135deg, #fff 0%, #f8f8f8 100%)',
                            borderRadius: '8px',
                            border: '2px solid #333',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
                            transform: `
                              translateZ(${index * 15}px) 
                              rotateX(-10deg) 
                              rotateY(${(index - playerCards.length/2) * 5}deg)
                              scale(${1 + index * 0.05})
                            `,
                            animation: `cardDealUp 1s ease-out ${index * 0.3}s both`,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            zIndex: index + 1
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = `
                              translateZ(${index * 15 + 20}px) 
                              rotateX(-5deg) 
                              rotateY(${(index - playerCards.length/2) * 5}deg)
                              scale(${1.1 + index * 0.05})
                            `;
                            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.6)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = `
                              translateZ(${index * 15}px) 
                              rotateX(-10deg) 
                              rotateY(${(index - playerCards.length/2) * 5}deg)
                              scale(${1 + index * 0.05})
                            `;
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)';
                          }}
                        >
                          {/* Card Face */}
                          <div style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: card.suit === 1 || card.suit === 2 ? '#DC143C' : '#000',
                            lineHeight: 1
                          }}>
                            <div>{RANK_SYMBOLS[card.rank]}</div>
                            <div style={{ fontSize: '12px' }}>{SUIT_SYMBOLS[card.suit]}</div>
                          </div>
                          
                          <div style={{
                            textAlign: 'center',
                            fontSize: '32px',
                            color: card.suit === 1 || card.suit === 2 ? '#DC143C' : '#000',
                            opacity: 0.4
                          }}>
                            {SUIT_SYMBOLS[card.suit]}
                          </div>
                          
                          <div style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: card.suit === 1 || card.suit === 2 ? '#DC143C' : '#000',
                            lineHeight: 1,
                            textAlign: 'right',
                            transform: 'rotate(180deg)'
                          }}>
                            <div>{RANK_SYMBOLS[card.rank]}</div>
                            <div style={{ fontSize: '12px' }}>{SUIT_SYMBOLS[card.suit]}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </Container>
            </GambaUi.Responsive>
            
            {/* CSS Keyframes */}
            <style>
              {`
                @keyframes fadeInDown {
                  from {
                    opacity: 0;
                    transform: translateY(-30px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                
                @keyframes cardFloatIn {
                  0% {
                    opacity: 0;
                    transform: translateZ(0px) rotateX(90deg) scale(0.5);
                  }
                  50% {
                    opacity: 0.7;
                    transform: translateZ(20px) rotateX(60deg) scale(0.8);
                  }
                  100% {
                    opacity: 1;
                    transform: translateZ(var(--index, 0)) rotateX(45deg) scale(1);
                  }
                }
                
                @keyframes cardDealUp {
                  0% {
                    opacity: 0;
                    transform: translateY(150px) translateZ(-50px) rotateX(90deg) scale(0.3);
                  }
                  30% {
                    opacity: 0.6;
                    transform: translateY(50px) translateZ(10px) rotateX(45deg) scale(0.7);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0) translateZ(var(--index, 0)) rotateX(-10deg) scale(1);
                  }
                }
                
                @keyframes dealerPulse {
                  0%, 100% {
                    box-shadow: 0 4px 20px rgba(220,20,60,0.4);
                  }
                  50% {
                    box-shadow: 0 6px 30px rgba(220,20,60,0.8);
                  }
                }
                
                @keyframes ringRotate {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(360deg);
                  }
                }
                
                @keyframes chipGlow {
                  0% {
                    box-shadow: 
                      0 0 20px rgba(255,215,0,0.4),
                      inset 0 0 20px rgba(0,0,0,0.2);
                  }
                  100% {
                    box-shadow: 
                      0 0 40px rgba(255,215,0,0.8),
                      inset 0 0 30px rgba(0,0,0,0.4);
                  }
                }
                
                @keyframes hologramFloat {
                  0% {
                    opacity: 0;
                    transform: translateY(30px) scale(0.8);
                  }
                  50% {
                    opacity: 0.8;
                    transform: translateY(-10px) scale(1.05);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                  }
                }
                
                @keyframes shuffleText {
                  0%, 100% {
                    opacity: 0.6;
                  }
                  50% {
                    opacity: 1;
                  }
                }
                
                @keyframes shimmer {
                  0% {
                    background-position: 0% 50%;
                  }
                  50% {
                    background-position: 100% 50%;
                  }
                  100% {
                    background-position: 0% 50%;
                  }
                }
              `}
            </style>
            
            {/* Add the overlay component - conditionally rendered based on ENABLE_THINKING_OVERLAY */}
            {renderThinkingOverlay(
              <BlackJackOverlays
                gamePhase={getGamePhaseState(gamePhase)}
                thinkingPhase={getThinkingPhaseState(thinkingPhase)}
                dramaticPause={dramaticPause}
                celebrationIntensity={celebrationIntensity}
                currentWin={profit && profit > wager ? { multiplier: profit / wager, amount: profit - wager } : undefined}
                thinkingEmoji={thinkingEmoji}
              />
            )}
          </div>
            
          {/* Paytable sidebar - separate from main game UI */}
          <BlackJackPaytable
            ref={paytableRef}
            wager={wager}
            currentResult={currentResult}
          />
        </div>
      </GambaUi.Portal>
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'Restart' : 'Deal'}
        onPlayAgain={handlePlayAgain}
      />
    </>
  )
}
