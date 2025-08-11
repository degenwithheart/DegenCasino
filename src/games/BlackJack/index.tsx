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
import { GameControls, GameScreenLayout } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import React, { useContext } from 'react'
import { GambaResultContext } from '../../context/GambaResultContext'
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

const randomRank = () => Math.floor(Math.random() * RANKS)
const randomSuit = () => Math.floor(Math.random() * SUITS)

import { useIsCompact } from '../../hooks/useIsCompact'
const createCard = (rank = randomRank(), suit = randomSuit()): Card => ({
  key: Math.random(),
  rank,
  suit,
})

interface Card {
  key: number
  rank: number
  suit: number
}

export interface BlackjackConfig {
  logo: string
}

export default function Blackjack(props: BlackjackConfig) {
  const { setGambaResult } = useContext(GambaResultContext)
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
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

  // Responsive scaling logic using useIsCompact
  const isCompact = useIsCompact();
  const [scale, setScale] = React.useState(isCompact ? 1 : 1.3);

  React.useEffect(() => {
    setScale(isCompact ? 1 : 1.3);
  }, [isCompact]);

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
    resetGame()
    sounds.play('play')

    const betArray = [2.5, 2.5, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    await game.play({
      bet: betArray,
      wager,
    })

    const result = await game.result()
    setGambaResult(result)
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

    setProfit(result.payout)
    
    // Handle game outcome for overlay
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
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            width: '100%',
            height: '100%',
            transition: 'transform 0.2s ease-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="blackjack-game-scaler"
        >
          <GambaUi.Responsive>
            <GameScreenLayout
              left={
                <Container $disabled={claiming || isPlaying}>
                  <HandsWrapper>
                    <div>
                      <h2>Dealer's Hand</h2>
                      <CardArea>
                        <CardsContainer>
                          {dealerCards.map((card) => (
                            <CardContainer key={card.key}>
                              <Card color={SUIT_COLORS[card.suit]}>
                                <div className="rank">{RANK_SYMBOLS[card.rank]}</div>
                                <div className="suit">{SUIT_SYMBOLS[card.suit]}</div>
                              </Card>
                            </CardContainer>
                          ))}
                        </CardsContainer>
                      </CardArea>
                    </div>
                    <div>
                      <h2>Player's Hand</h2>
                      <CardArea>
                        <CardsContainer>
                          {playerCards.map((card) => (
                            <CardContainer key={card.key}>
                              <Card color={SUIT_COLORS[card.suit]}>
                                <div className="rank">{RANK_SYMBOLS[card.rank]}</div>
                                <div className="suit">{SUIT_SYMBOLS[card.suit]}</div>
                              </Card>
                            </CardContainer>
                          ))}
                        </CardsContainer>
                      </CardArea>
                    </div>
                  </HandsWrapper>
                  {profit !== null && (
                    <ProfitWrapper>
                      <Profit key={profit}>
                        {profit > 0 ? (
                          <>
                            <TokenValue amount={profit} /> +{Math.round((profit / wager) * 100 - 100)}%
                          </>
                        ) : (
                          <>You Lost</>
                        )}
                      </Profit>
                    </ProfitWrapper>
                  )}
                </Container>
              }
              right={null}
            />
          </GambaUi.Responsive>
        </div>
      </GambaUi.Portal>
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        playButtonText={hasPlayedBefore ? 'Deal Again' : 'Deal'}
      />
    </>
  )
}
