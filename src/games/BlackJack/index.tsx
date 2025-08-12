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

    const betArray = [2.5, 2.5, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0]

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
                ♠️ BLACKJACK ♥️
              </h2>
              <div style={{
                fontSize: 16,
                color: '#888',
                fontWeight: 600
              }}>
                Get as close to 21 as possible without going over
              </div>
            </div>

            <GambaUi.Responsive>
              <Container $disabled={claiming || isPlaying}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 10 
                }}>
                  <h2 style={{
                    background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '24px',
                    fontWeight: 700,
                    marginBottom: '16px'
                  }}>Dealer's Hand</h2>
                  <CardArea>
                    <CardsContainer>
                      {dealerCards.map((card) => (
                        <CardContainer key={card.key}>
                          <Card 
                            color={SUIT_COLORS[card.suit]}
                            style={{
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.9))',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.2)',
                              transition: 'all 0.3s ease',
                              animation: 'blackjackGlow 2s ease-in-out infinite alternate'
                            }}
                          >
                            <div className="rank">{RANK_SYMBOLS[card.rank]}</div>
                            <div className="suit">{SUIT_SYMBOLS[card.suit]}</div>
                          </Card>
                        </CardContainer>
                      ))}
                    </CardsContainer>
                  </CardArea>
                  
                  <h2 style={{
                    background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '24px',
                    fontWeight: 700,
                    margin: '24px 0 16px 0'
                  }}>Player's Hand</h2>
                  
                  <CardArea>
                    <CardsContainer>
                      {playerCards.map((card) => (
                        <CardContainer key={card.key}>
                          <Card 
                            color={SUIT_COLORS[card.suit]}
                            style={{
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.9))',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.2)',
                              transition: 'all 0.3s ease',
                              animation: 'blackjackGlow 2s ease-in-out infinite alternate'
                            }}
                          >
                            <div className="rank">{RANK_SYMBOLS[card.rank]}</div>
                            <div className="suit">{SUIT_SYMBOLS[card.suit]}</div>
                          </Card>
                        </CardContainer>
                      ))}
                    </CardsContainer>
                  </CardArea>
                  
                  {profit !== null && (
                    <Profit key={profit} style={{
                      background: profit > 0 
                        ? 'linear-gradient(135deg, #00ffb0, #00d4aa)'
                        : 'linear-gradient(135deg, #ff5252, #f44336)',
                      color: '#fff',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '18px',
                      marginTop: '16px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                      animation: 'blackjackGlow 1s ease-in-out'
                    }}>
                      {profit > 0 ? (
                        <>
                          <TokenValue amount={profit} /> +{Math.round((profit / wager) * 100 - 100)}%
                        </>
                      ) : (
                        <>You Lost</>
                      )}
                    </Profit>
                  )}
                </div>
              </Container>
            </GambaUi.Responsive>
            
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
            
          {/* Paytable sidebar */}
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
        playButtonText={hasPlayedBefore ? 'Deal Again' : 'Deal'}
        onPlayAgain={handlePlayAgain}
      />
    </>
  )
}
