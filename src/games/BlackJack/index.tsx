import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import { makeDeterministicRng, pickDeterministic } from '../../fairness/deterministicRng'
import React from 'react'
import { BLACKJACK_CONFIG } from '../rtpConfig'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, DesktopControls } from '../../components'
import { CARD_VALUES, RANKS, RANK_SYMBOLS, SUIT_COLORS, SUIT_SYMBOLS, SUITS, SOUND_CARD, SOUND_LOSE, SOUND_PLAY, SOUND_WIN, SOUND_JACKPOT } from './constants'
import { Card, CardContainer, CardsContainer, Container, Profit, CardArea } from './styles'
import GameScreenFrame from '../../components/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { StyledBlackjackBackground } from './BlackjackBackground.enhanced.styles'

// Card creation is now deterministic; randomness sourced from on-chain result mapping.
const createCard = (rank: number, suit: number, keySeed: number): Card => ({
  key: keySeed,
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
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [playerCards, setPlayerCards] = React.useState<Card[]>([])
  const [dealerCards, setDealerCards] = React.useState<Card[]>([])
  const [initialWager, setInitialWager] = useWagerInput()
  const [profit, setProfit] = React.useState<number | null>(null)
  const [claiming, setClaiming] = React.useState(false)

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
    // Reset game state before playing
    resetGame()
    sounds.play('play')

    // Use centralized bet array from rtpConfig
    const betArray = [...BLACKJACK_CONFIG.betArray]

    await game.play({
      bet: betArray,
      wager: initialWager,
    })

    const result = await game.result()
    const payoutMultiplier = result.payout / initialWager

    // Deterministic derivation of card sequences from result
    // Seed composed of payout multiplier & resultIndex (covers all distinct outcomes)
    const seed = `${result.resultIndex}:${payoutMultiplier}:${initialWager}`
    const rng = makeDeterministicRng(seed)

    const ranks = Array.from({ length: RANKS }, (_, i) => i)
    const suits = Array.from({ length: SUITS }, (_, i) => i)

    const drawCard = (k: number) => {
      const r = pickDeterministic(ranks, rng)
      const s = pickDeterministic(suits, rng)
      return createCard(r, s, k)
    }

    // Strategy: generate minimal two-card hands; adjust according to payout class
    const player: Card[] = [drawCard(1), drawCard(2)]
    const dealer: Card[] = [drawCard(3), drawCard(4)]

    // If blackjack payout (2.5x) ensure player has Ace + 10-value
    if (payoutMultiplier === 2.5) {
      const aceRank = 12
      const tenRanks = [8,9,10,11]
      player[0] = createCard(aceRank, player[0].suit, 1)
      const tenRank = tenRanks[Math.floor(rng()*tenRanks.length)]
      player[1] = createCard(tenRank, player[1].suit, 2)
    }

    // Basic value adjustments for non-loss outcomes
    const handValue = (h: Card[]) => h.reduce((sum, c) => sum + CARD_VALUES[c.rank], 0)
    if (payoutMultiplier === 2) {
      // Ensure player > dealer and <=21
      let guard = 0
      while ((handValue(player) <= handValue(dealer) || handValue(player) > 21) && guard < 20) {
        player[0] = drawCard(10 + guard)
        player[1] = drawCard(100 + guard)
        guard++
      }
    }
    if (payoutMultiplier === 0) {
      // Ensure dealer > player or player bust
      let guard = 0
      while (!(handValue(dealer) > handValue(player) || handValue(player) > 21) && guard < 20) {
        dealer[0] = drawCard(200 + guard)
        dealer[1] = drawCard(300 + guard)
        guard++
      }
    }

    const newPlayerCards = player
    const newDealerCards = dealer

    // Animate sequential reveal deterministically
    const dealSequence: Card[][] = [newPlayerCards, newDealerCards]
    for (let h = 0; h < dealSequence.length; h++) {
      for (let i = 0; i < dealSequence[h].length; i++) {
        const c = dealSequence[h][i]
        if (h === 0) {
          setPlayerCards(prev => [...prev, c])
        } else {
          setDealerCards(prev => [...prev, c])
        }
        sounds.play('card')
        if (h === 0 && i === 1 && payoutMultiplier === 2.5) {
          sounds.play('jackpot')
        }
        // small deterministic delay (not random)
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, 350))
      }
    }

    setProfit(result.payout)

    // Play the appropriate sound based on the result
    if (payoutMultiplier === 2.5) {
      // Do nothing; jackpot sound already played
    } else if (payoutMultiplier > 0) {
      sounds.play('win')
    } else {
      sounds.play('lose')
    }
  }

  // Helper functions remain the same
  const getHandValue = (hand: Card[]): number => {
    return hand.reduce((sum, c) => sum + CARD_VALUES[c.rank], 0)
  }

  // Old random-based generators removed (now deterministic via rng + adjustments above)

  return (
    <>
      <GambaUi.Portal target="screen">
        <StyledBlackjackBackground>
          {/* Casino table background elements */}
          <div className="velvet-bg-elements" />
          <div className="smoke-overlay" />
          <div className="tension-indicator" />
          
          <GameScreenFrame {...(useGameMeta('blackjack') && { title: useGameMeta('blackjack')!.name, description: useGameMeta('blackjack')!.description })}>
            <GambaUi.Responsive>
              <div className="blackjack-content">
                <Container $disabled={claiming || gamba.isPlaying}>
                  <div className="dealer-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2>🎩 Dealer's Silent War</h2>
                    <CardArea className="enhanced-card-area">
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
                    <h2>🃏 Your Confession</h2>
                    <CardArea className="enhanced-card-area">
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
                    <div className="player-area">
                      {profit !== null ? (
                        <Profit className={profit > 0 ? 'win' : 'lose'}>
                          {profit === 0 ? (
                            <>💔 The house wins this heartbeat</>
                          ) : (
                            <>💎 Seduction complete: <TokenValue amount={profit} /></>
                          )}
                        </Profit>
                      ) : (
                        <div style={{ 
                          color: '#d1fae5', 
                          fontSize: '18px', 
                          textAlign: 'center', 
                          opacity: 0.6,
                          minHeight: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          🎭 The silent war awaits...
                        </div>
                      )}
                    </div>
                  </div>
                </Container>
              </div>
            </GambaUi.Responsive>
          </GameScreenFrame>
        </StyledBlackjackBackground>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <MobileControls
          wager={initialWager}
          setWager={setInitialWager}
          onPlay={play}
          playDisabled={false}
          playText="Deal Cards"
        />
        
        <DesktopControls>
          <EnhancedWagerInput value={initialWager} onChange={setInitialWager} />
          <EnhancedPlayButton onClick={play}>Deal Cards</EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}