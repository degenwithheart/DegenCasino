import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { EnhancedWagerInput, EnhancedButton, EnhancedPlayButton, MobileControls, DesktopControls } from '../../components'
import { MAX_CARD_SHOWN, RANKS, RANK_SYMBOLS, SOUND_CARD, SOUND_FINISH, SOUND_LOSE, SOUND_PLAY, SOUND_WIN } from './constants'
import { Card, CardContainer, CardPreview, CardsContainer, Container, Option, Options, Profit } from './styles'
import GameScreenFrame from '../../components/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { StyledHiLoBackground } from './HiLoBackground.enhanced.styles'

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
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [cards, setCards] = React.useState([card()])
  const [claiming, setClaiming] = React.useState(false)
  const [initialWager, setInitialWager] = useWagerInput()
  const [profit, setProfit] = React.useState(0)
  const currentRank = cards[cards.length - 1].rank
  const [option, setOption] = React.useState<'hi' | 'lo'>(currentRank > RANKS / 2 ? 'lo' : 'hi')
  const [hoveredOption, hoverOption] = React.useState<'hi' | 'lo'>()

  const addCard = (rank: number) => setCards((cards) => [...cards, card(rank)].slice(-MAX_CARD_SHOWN))

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
    addCard(result.resultIndex)
    sounds.play('card', { playbackRate: .8 })
    const win = result.payout > 0

    setTimeout(() => {
      setProfit(result.payout)
      if (win) {
        sounds.play('win')
      } else {
        sounds.play('lose')
      }
    }, 300)
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <StyledHiLoBackground>
          {/* Romantic card background elements */}
          <div className="romance-bg-elements" />
          <div className="razor-overlay" />
          <div className="fragile-indicator" />
          
          <GameScreenFrame {...(useGameMeta('hilo') && { title: useGameMeta('hilo')!.name, description: useGameMeta('hilo')!.description })}>
            <GambaUi.Responsive>
              <div className="hilo-content">
                <Container $disabled={claiming || gamba.isPlaying}>
                  <div className="romance-header">
                    <h2 style={{ marginBottom: '100px' }}>🃏 Cards Are Honest in Ways People Never Are</h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                    <CardsContainer>
                      {cards.map((card, i) => {
                        const offset = -(cards.length - (i + 1))
                        const xxx = cards.length > 3 ? (i / cards.length) : 1
                        const opacity = Math.min(1, xxx * 3)
                        return (
                          <CardContainer
                            key={card.key}
                            style={{
                              transform: `translate(${offset * 30}px, ${-offset * 0}px) rotateZ(-5deg) rotateY(5deg)`,
                              opacity,
                            }}
                          >
                      <Card>
                        <div className="rank">{RANK_SYMBOLS[card.rank]}</div>
                        <div className="suit" style={{ backgroundImage: 'url(' + props.logo +  ')' }} />
                      </Card>
                    </CardContainer>
                  )
                })}
              </CardsContainer>
              <Options>
                <Option
                  selected={option === 'hi'}
                  onClick={() => setOption('hi')}
                  onMouseEnter={() => hoverOption('hi')}
                  onMouseLeave={() => hoverOption(undefined)}
                >
                  <div>
                    💘
                  </div>
                  <div>Romance Rises - ({Math.max(...betHi).toFixed(2)}x)</div>
                </Option>
                <Option
                  selected={option === 'lo'}
                  onClick={() => setOption('lo')}
                  onMouseEnter={() => hoverOption('lo')}
                  onMouseLeave={() => hoverOption(undefined)}
                >
                  <div>
                    💔
                  </div>
                  <div>Fragile Falls - ({Math.max(...betLo).toFixed(2)}x)</div>
                </Option>
              </Options>
            </div>
            <CardPreview>
              {Array.from({ length: RANKS }).map((_, rankIndex) => {
                const opacity = bet[rankIndex] > 0 ? .9 : .5
                return (
                  <Card key={rankIndex} $small style={{ opacity }} onClick={() => addCard(rankIndex)}>
                    <div className="rank">{RANK_SYMBOLS[rankIndex]}</div>
                  </Card>
                )
              })}
            </CardPreview>
            <div className="romance-result-area">
              {profit > 0 ? (
                <Profit key={profit} onClick={resetGame}>
                  💕 Love wins: <TokenValue amount={profit} /> +{Math.round(profit / initialWager * 100 - 100).toLocaleString()}%
                </Profit>
              ) : (
                <div style={{ 
                  color: '#fecaca', 
                  fontSize: '18px', 
                  textAlign: 'center', 
                  opacity: 0.6,
                  minHeight: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  🎭 Balance greed with grace...
                </div>
              )}
                  </div>
                </Container>
              </div>
            </GambaUi.Responsive>
          </GameScreenFrame>
        </StyledHiLoBackground>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        {!profit ? (
          <>
            <MobileControls
              wager={initialWager}
              setWager={setInitialWager}
              onPlay={play}
              playDisabled={!option || initialWager > maxWagerForBet}
              playText="Deal card"
            />
            
            <DesktopControls>
              <EnhancedWagerInput
                value={initialWager}
                onChange={setInitialWager}
              />
              <EnhancedPlayButton disabled={!option || initialWager > maxWagerForBet} onClick={play}>
                Deal card
              </EnhancedPlayButton>
              {initialWager > maxWagerForBet && (
                <EnhancedButton onClick={() => setInitialWager(maxWagerForBet)}>
                  Set max
                </EnhancedButton>
              )}
            </DesktopControls>
          </>
        ) : (
          <>
            <TokenValue amount={wager} />
            <EnhancedButton disabled={gamba.isPlaying} onClick={resetGame}>
              Finish
            </EnhancedButton>
            <EnhancedPlayButton disabled={!option} onClick={play}>
              Deal card
            </EnhancedPlayButton>
          </>
        )}
      </GambaUi.Portal>
    </>
  )
}
