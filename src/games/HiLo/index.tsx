import React, { useContext } from 'react'
import { useIsCompact } from '../../hooks/useIsCompact';
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput, useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import { GambaResultContext } from '../../context/GambaResultContext'
import { GameControls, GameScreenLayout } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { MAX_CARD_SHOWN, RANKS, RANK_SYMBOLS, SOUND_CARD, SOUND_FINISH, SOUND_LOSE, SOUND_PLAY, SOUND_WIN } from './constants'
import { Card, CardContainer, CardPreview, CardsContainer, Container, Option, Options, Profit, PayoutPanel } from './styles'
import { TOKEN_METADATA } from '../../constants'

const BPS_PER_WHOLE = 10000

const randomRank = () => 1 + Math.floor(Math.random() * (RANKS - 1))

const card = (rank = randomRank()): Card => ({
  key: Math.random(),
  rank,
})

interface Card {
  key: number
  rank: number
}

export interface HiLoConfig {
  logo: string
}

const generateBetArray = (currentRank: number, isHi: boolean) => {
  return Array.from({ length: RANKS }).map((_, i) => {
    const result = (() => {
      if (isHi) {
        return currentRank === 0
          ? i > currentRank ? BigInt(RANKS * BPS_PER_WHOLE) / BigInt((RANKS - 1) - currentRank) : BigInt(0)
          : i >= currentRank ? BigInt(RANKS * BPS_PER_WHOLE) / BigInt((RANKS - currentRank)) : BigInt(0)
      }
      return currentRank === RANKS - 1
        ? i < currentRank ? BigInt(RANKS * BPS_PER_WHOLE) / BigInt(currentRank) : BigInt(0)
        : i <= currentRank ? BigInt(RANKS * BPS_PER_WHOLE) / BigInt((currentRank + 1)) : BigInt(0)
    })()
    return Number(result) / BPS_PER_WHOLE
  })
}

const adjustBetArray = (betArray: number[]) => {
  const maxLength = betArray.length
  const sum = betArray.reduce((acc, val) => acc + val, 0)
  if (sum > maxLength) {
    const maxIndex = betArray.findIndex(val => val === Math.max(...betArray))
    betArray[maxIndex] -= sum - maxLength
    if (betArray[maxIndex] < 0) betArray[maxIndex] = 0
  }
  return betArray
}

export default function HiLo(props: HiLoConfig) {
  const { setGambaResult } = useContext(GambaResultContext)
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [cards, setCards] = React.useState([card()])
  const [claiming, setClaiming] = React.useState(false)
  const [initialWager, setInitialWager] = useWagerInput()
  const setWager = setInitialWager
  const token = useCurrentToken();
  const { balance } = useTokenBalance();

  const tokenMeta = token
    ? TOKEN_METADATA.find((t: any) => t.symbol === token.symbol)
    : undefined;
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1);
  const tokenPrice = tokenMeta?.usdPrice ?? 0;

  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
  } = useGameOutcome()

  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setInitialWager(baseWager)
    } else {
      setInitialWager(0)
    }
  }, [setInitialWager, token, baseWager])

  const [profit, setProfit] = React.useState(0)
  const currentRank = cards[cards.length - 1].rank
  const [option, setOption] = React.useState<'hi' | 'lo'>(currentRank > RANKS / 2 ? 'lo' : 'hi')
  const [hoveredOption, hoverOption] = React.useState<'hi' | 'lo'>()

  // Track last card index for flip/glow
  const [lastCardIndex, setLastCardIndex] = React.useState(0);
  const addCard = (rank: number) => {
    setCards((cards) => {
      const newCards = [...cards, card(rank)].slice(-MAX_CARD_SHOWN);
      setLastCardIndex(newCards.length - 1);
      return newCards;
    });
  }

  // Improved responsive scaling with hard cap at 475px height (from Slots)
  const scalerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  const getResponsiveScale = () => {
    if (typeof window === 'undefined') return 1;
    const width = window.innerWidth;
    if (width <= 400) return 0.95;
    if (width <= 600) return 1.08;
    if (width <= 900) return 1.18;
    if (width <= 1200) return 1.28;
    if (width <= 1600) return 1.38;
    return 1;
  };

  const updateScale = React.useCallback(() => {
    const responsiveScale = getResponsiveScale();
    if (scalerRef.current) {
      scalerRef.current.style.transform = 'scale(1)';
      const naturalHeight = scalerRef.current.offsetHeight;
      const maxScale = 475 / naturalHeight;
      const finalScale = Math.min(responsiveScale, maxScale);
      scalerRef.current.style.transform = `scale(${finalScale})`;
      setScale(finalScale);
    } else {
      setScale(responsiveScale);
    }
  }, []);

  React.useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, [updateScale]);

  const sounds = useSound({
    card: SOUND_CARD,
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    finish: SOUND_FINISH,
  })

  const betHi = React.useMemo(() => generateBetArray(currentRank, true), [currentRank])
  const betLo = React.useMemo(() => generateBetArray(currentRank, false), [currentRank])

  const _bet = React.useMemo(() => {
    const _option = hoveredOption ?? option
    if (_option === 'hi') return betHi
    if (_option === 'lo') return betLo
    return [0]
  }, [betHi, betLo, hoveredOption, option])

  const resetGame = async () => {
    try {
      if (claiming) return

      sounds.play('finish', { playbackRate: .8 })
      setTimeout(() => {
        setProfit(0)
        sounds.play('card')
        addCard(randomRank())
        setClaiming(false)
      }, 300)
    } catch {
      setClaiming(false)
    }
  }

  const bet = adjustBetArray(_bet)

  const multipler = Math.max(...bet)
  const maxWagerForBet = pool.maxPayout / multipler
  const wager = Math.min(maxWagerForBet, profit || initialWager)

  const play = async () => {
    sounds.play('play')

    await game.play({
      bet,
      wager,
    })

    const result = await game.result()
    setGambaResult(result)
    addCard(result.resultIndex)
    sounds.play('card', { playbackRate: .8 })
    const win = result.payout > 0

    setTimeout(() => {
      setProfit(result.payout)
      handleGameComplete({ payout: result.payout, wager })

      if (win) {
        sounds.play('win')
      } else {
        sounds.play('lose')
      }
    }, 300)
  }

  const test = async () => {
    if (gamba.isPlaying) return
    await play()
  }

  const simulate = async () => {
    if (gamba.isPlaying) return
    for (let i = 0; i < 10; i++) {
      await play()
      if (profit === 0) break
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <GameScreenLayout
          left={
            <GambaUi.Responsive>
              <div
                ref={scalerRef}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'center',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s cubic-bezier(.4,2,.6,1)',
                  background: 'radial-gradient(ellipse at 50% 30%, #23234a 60%, #18182a 100%)',
                  minHeight: 400,
                  borderRadius: 24,
                  boxShadow: '0 8px 32px #0008',
                  overflow: 'hidden',
                }}
                className="hilo-game-scaler"
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  width: '100%',
                  gap: 32,
                  padding: 24,
                }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Container $disabled={claiming || gamba.isPlaying}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <CardsContainer>
                          {cards.map((card, i) => {
                            const offset = -(cards.length - (i + 1));
                            const xxx = cards.length > 3 ? (i / cards.length) : 1;
                            const opacity = Math.min(1, xxx * 3);
                            const isLast = i === cards.length - 1;
                            const isWinner = isLast && profit > 0;
                            return (
                              <CardContainer
                                key={card.key}
                                style={{
                                  transform: `translate(${offset * 30}px, ${-offset * 0}px) rotateZ(-5deg) rotateY(5deg)`,
                                  opacity,
                                }}
                                $isFlipped={isLast}
                                $isWinner={isWinner}
                              >
                                <Card style={{
                                  background: isLast ? 'linear-gradient(135deg, #ffe06644 0%, #fff0 100%)' : undefined,
                                  boxShadow: isWinner ? '0 0 16px #ffe06688' : undefined,
                                }}>
                                  <div className="rank">{RANK_SYMBOLS[card.rank]}</div>
                                  <div className="suit" style={{ backgroundImage: 'url(' + props.logo + ')' }} />
                                </Card>
                              </CardContainer>
                            );
                          })}
                        </CardsContainer>
                        <Options>
                          <Option
                            selected={option === 'hi'}
                            onClick={() => setOption('hi')}
                            onMouseEnter={() => hoverOption('hi')}
                            onMouseLeave={() => hoverOption(undefined)}
                          >
                            <div>👆</div>
                            <div>HI - ({Math.max(...betHi).toFixed(2)}x)</div>
                          </Option>
                          <Option
                            selected={option === 'lo'}
                            onClick={() => setOption('lo')}
                            onMouseEnter={() => hoverOption('lo')}
                            onMouseLeave={() => hoverOption(undefined)}
                          >
                            <div>👇</div>
                            <div>LO - ({Math.max(...betLo).toFixed(2)}x)</div>
                          </Option>
                        </Options>
                      </div>
                      <CardPreview>
                        {Array.from({ length: RANKS }).map((_, rankIndex) => {
                          const opacity = bet[rankIndex] > 0 ? .95 : .4;
                          return (
                            <Card
                              key={rankIndex}
                              $small
                              style={{ opacity }}
                              onClick={() => addCard(rankIndex)}
                              title={bet[rankIndex] > 0 ? `Payout: ${bet[rankIndex].toFixed(2)}x` : undefined}
                            >
                              <div className="rank">{RANK_SYMBOLS[rankIndex]}</div>
                            </Card>
                          );
                        })}
                      </CardPreview>
                      {profit > 0 && (
                        <Profit key={profit} onClick={resetGame}>
                          <TokenValue amount={profit} /> +{Math.round(profit / initialWager * 100 - 100).toLocaleString()}%
                        </Profit>
                      )}
                    </Container>
                  </div>
                </div>
              </div>
            </GambaUi.Responsive>
          }
          right={
            <PayoutPanel $option={option}>
              <div className="payout-title">Payouts</div>
              <div className="payout-row">
                <span>HI</span>
                <span>{Math.max(...betHi).toFixed(2)}x</span>
              </div>
              <div className="payout-row">
                <span>LO</span>
                <span>{Math.max(...betLo).toFixed(2)}x</span>
              </div>
              <div className="payout-desc">
                Choose HI or LO.<br />Payouts update based on the current card.
              </div>
            </PayoutPanel>
          }
        />
      </GambaUi.Portal>
      <GameControls
        wager={initialWager}
        setWager={setWager}
        onPlay={play}
        isPlaying={gamba.isPlaying}
        playButtonText={hasPlayedBefore ? 'Play Again' : 'Play'}
      >
      </GameControls>
    </>
  )
}
