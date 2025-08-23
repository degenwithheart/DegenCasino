import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput, useCurrentToken, useTokenMeta } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import { makeDeterministicRng, pickDeterministic } from '../../fairness/deterministicRng'
import React from 'react'
import { BLACKJACK_CONFIG } from '../rtpConfig'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, DesktopControls } from '../../components'
import { CARD_VALUES, RANKS, RANK_SYMBOLS, SUIT_COLORS, SUIT_SYMBOLS, SUITS, SOUND_CARD, SOUND_LOSE, SOUND_PLAY, SOUND_WIN, SOUND_JACKPOT } from './constants'
import GameScreenFrame from '../../components/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { StyledBlackjackBackground } from './BlackjackBackground.enhanced.styles'
import { useWalletToast } from '../../utils/solanaWalletToast'

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
  const currentToken = useCurrentToken()
  const tokenMeta = useTokenMeta(currentToken.mint)
  const [playerCards, setPlayerCards] = React.useState<Card[]>([])
  const [dealerCards, setDealerCards] = React.useState<Card[]>([])
  const [initialWager, setInitialWager] = useWagerInput()
  const [profit, setProfit] = React.useState<number | null>(null)
  const [claiming, setClaiming] = React.useState(false)
  const [showBetToken, setShowBetToken] = React.useState(false)
  const [isDealing, setIsDealing] = React.useState(false)

  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    card: SOUND_CARD,
    jackpot: SOUND_JACKPOT,
  })

  const { showTransactionError } = useWalletToast()

  const resetGame = () => {
    setProfit(null)
    setPlayerCards([])
    setDealerCards([])
    setShowBetToken(false)
    setIsDealing(false)
  }

  const play = async () => {
    try {
      // Reset game state before playing
      resetGame()
      sounds.play('play')
      
      // Show bet token animation first
      setShowBetToken(true)
      setIsDealing(true)
      
      // Wait for bet animation to complete
      await new Promise(r => setTimeout(r, 800))

      // Use centralized bet array from rtpConfig
      const betArray = [...BLACKJACK_CONFIG.betArray]

      await game.play({
        bet: betArray,
        wager: initialWager,
      })

      const result = await game.result()
      // Use Gamba's exact multiplier directly (no calculation needed)
      const payoutMultiplier = result.multiplier

      // Deterministic derivation of card sequences from result
      // Seed composed of Gamba multiplier & resultIndex (covers all distinct outcomes)
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

      // If blackjack payout ensure player has Ace + 10-value
      if (payoutMultiplier === BLACKJACK_CONFIG.outcomes.playerBlackjack) {
        const aceRank = 12
        const tenRanks = [8,9,10,11]
        player[0] = createCard(aceRank, player[0].suit, 1)
        const tenRank = tenRanks[Math.floor(rng()*tenRanks.length)]
        player[1] = createCard(tenRank, player[1].suit, 2)
      }

      // Basic value adjustments for non-loss outcomes
      const handValue = (h: Card[]) => h.reduce((sum, c) => sum + CARD_VALUES[c.rank], 0)
      if (payoutMultiplier === BLACKJACK_CONFIG.outcomes.playerWin) {
        // Ensure player > dealer and <=21
        let guard = 0
        while ((handValue(player) <= handValue(dealer) || handValue(player) > 21) && guard < 20) {
          player[0] = drawCard(10 + guard)
          player[1] = drawCard(100 + guard)
          guard++
        }
      }
      if (payoutMultiplier === BLACKJACK_CONFIG.outcomes.playerLose) {
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
          if (h === 0 && i === 1 && payoutMultiplier === BLACKJACK_CONFIG.outcomes.playerBlackjack) {
            sounds.play('jackpot')
          }
          // small deterministic delay (not random)
          // eslint-disable-next-line no-await-in-loop
          await new Promise(r => setTimeout(r, 350))
        }
      }

      setProfit(result.payout)
      setIsDealing(false)

      // Play the appropriate sound based on the result
      if (payoutMultiplier === BLACKJACK_CONFIG.outcomes.playerBlackjack) {
        // Do nothing; jackpot sound already played
      } else if (payoutMultiplier > 0) {
        sounds.play('win')
      } else {
        sounds.play('lose')
      }
      
      // Hide bet token after a delay to show the result
      setTimeout(() => {
        setShowBetToken(false)
      }, 3000)
    } catch (error) {
      console.error('BlackJack game error:', error)
      showTransactionError(error)
      // Reset UI state on error
      setIsDealing(false)
      setShowBetToken(false)
    }
  }

  // Helper functions remain the same
  const getHandValue = (hand: Card[]): number => {
    return hand.reduce((sum, c) => sum + CARD_VALUES[c.rank], 0)
  }

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
              <div className="casino-table">

                {/* Dealer Section */}
                <div className="dealer-area">
                  <div className="dealer-label">
                    <span className="dealer-icon">🎩</span>
                    <span>DEALER</span>
                    <div className="dealer-score">
                      {dealerCards.length > 0 ? (
                        <span className={getHandValue(dealerCards) > 21 ? 'bust' : ''}>
                          {getHandValue(dealerCards)}
                        </span>
                      ) : (
                        <span>--</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="dealer-cards">
                    <div className="card-deck-area">
                      {/* Dealer's deck indicator */}
                      <div className="deck-stack">
                        <div className="deck-card"></div>
                        <div className="deck-card"></div>
                        <div className="deck-card"></div>
                      </div>
                    </div>
                    
                    <div className="dealer-hand">
                      {dealerCards.length === 0 ? (
                        <>
                          <div className="empty-card-slot">
                            <span>🂠</span>
                          </div>
                          <div className="empty-card-slot">
                            <span>🂠</span>
                          </div>
                        </>
                      ) : (
                        dealerCards.map((card, index) => (
                          <div key={card.key} className="casino-card" style={{ animationDelay: `${index * 0.3}s` }}>
                            <div 
                              className="playing-card dealer-card" 
                              style={{ color: SUIT_COLORS[card.suit] }}
                            >
                              <div className="card-corner top-left">
                                <div className="card-rank">{RANK_SYMBOLS[card.rank]}</div>
                                <div className="card-suit">{SUIT_SYMBOLS[card.suit]}</div>
                              </div>
                              <div className="card-suit center">{SUIT_SYMBOLS[card.suit]}</div>
                              <div className="card-corner bottom-right">
                                <div className="card-rank">{RANK_SYMBOLS[card.rank]}</div>
                                <div className="card-suit">{SUIT_SYMBOLS[card.suit]}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Table Surface */}
                <div className="table-surface">
                  {/* Betting Circles */}
                  <div className="betting-areas">
                    <div className="bet-circle">
                      <div className="bet-circle-inner">
                        {showBetToken ? (
                          <div className="bet-token-display">
                            <img 
                              src={tokenMeta.image} 
                              alt={tokenMeta.symbol}
                              className="bet-token-image"
                            />
                            <div className="bet-amount">
                              <TokenValue amount={initialWager} mint={currentToken.mint} />
                            </div>
                          </div>
                        ) : (
                          <span className="bet-label">BET</span>
                        )}
                      </div>
                    </div>
                    <div className="insurance-area">
                      <div className="insurance-line">INSURANCE</div>
                    </div>
                  </div>

                  {/* Player Section */}
                  <div className="player-area">
                    <div className="player-position">
                      <div className="player-label">
                        <span className="player-icon">👤</span>
                        <span>PLAYER</span>
                        <div className="player-score">
                          {playerCards.length > 0 ? (
                            <span className={getHandValue(playerCards) > 21 ? 'bust' : ''}>
                              {getHandValue(playerCards)}
                            </span>
                          ) : (
                            <span>--</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="player-cards">
                        {playerCards.length === 0 ? (
                          <>
                            <div className="empty-card-slot">
                              <span>🂠</span>
                            </div>
                            <div className="empty-card-slot">
                              <span>🂠</span>
                            </div>
                          </>
                        ) : (
                          playerCards.map((card, index) => (
                            <div key={card.key} className="casino-card" style={{ animationDelay: `${(index + 2) * 0.3}s` }}>
                              <div 
                                className="playing-card player-card" 
                                style={{ color: SUIT_COLORS[card.suit] }}
                              >
                                <div className="card-corner top-left">
                                  <div className="card-rank">{RANK_SYMBOLS[card.rank]}</div>
                                  <div className="card-suit">{SUIT_SYMBOLS[card.suit]}</div>
                                </div>
                                <div className="card-suit center">{SUIT_SYMBOLS[card.suit]}</div>
                                <div className="card-corner bottom-right">
                                  <div className="card-rank">{RANK_SYMBOLS[card.rank]}</div>
                                  <div className="card-suit">{SUIT_SYMBOLS[card.suit]}</div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Game Status Display */}
                <div className="game-status">
                  {profit !== null ? (
                    <div className={`result-banner ${profit > 0 ? 'win' : 'lose'}`}>
                      <div className="result-content">
                        {profit > 0 ? (
                          <>
                            <span className="result-icon">🏆</span>
                            <span className="result-text">PLAYER WINS!</span>
                            <span className="result-amount"><TokenValue amount={profit} /></span>
                          </>
                        ) : (
                          <>
                            <span className="result-icon">🏠</span>
                            <span className="result-text">HOUSE WINS</span>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="waiting-banner">
                      <span className="waiting-icon">🎲</span>
                      <span className="waiting-text">Place Your Bet and Deal</span>
                    </div>
                  )}
                </div>
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
          playDisabled={isDealing}
          playText={isDealing ? "Dealing..." : "Deal Cards"}
        />
        
        <DesktopControls>
          <EnhancedWagerInput value={initialWager} onChange={setInitialWager} disabled={isDealing} />
          <EnhancedPlayButton onClick={play} disabled={isDealing}>
            {isDealing ? "Dealing..." : "Deal Cards"}
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}
