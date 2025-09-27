import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { EnhancedWagerInput, EnhancedButton, MobileControls, DesktopControls, SwitchControl } from '../../components'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import { useGameStats } from '../../hooks/game/useGameStats'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { MAX_CARD_SHOWN, RANKS, RANK_SYMBOLS, SOUND_CARD, SOUND_FINISH, SOUND_LOSE, SOUND_PLAY, SOUND_WIN } from './constants'
import { Card, CardContainer, CardPreview, CardsContainer, Container, Option, Options, Profit } from './styles'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { StyledHiLoBackground } from './HiLoBackground.enhanced.styles'
import { HiLoCard } from './HiLoCard'

// Add pulsing animation for placeholder text
const pulseFade = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`

// Progressive Info component (similar to Mines/ProgressivePoker)
const ProgressiveInfo = styled.div<{ visible: boolean; enableMotion?: boolean }>`
  text-align: center;
  background: rgba(0, 150, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  min-height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: nowrap;
  gap: 25px;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: ${props => props.enableMotion !== false ? 'opacity 0.3s ease, visibility 0.3s ease' : 'none'};
  box-shadow: 0 2px 10px rgba(0, 255, 0, 0.1);
  overflow-x: auto;

  @media (max-width: 768px) {
    padding: 12px;
    margin: 15px 0;
    gap: 15px;
    min-height: 60px;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
    gap: 8px;
    min-height: 50px;
  }
  
  ${props => props.visible && props.enableMotion !== false && css`
    animation: ${pulseFade} 1.6s infinite;
  `}
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  max-width: 140px;
  padding: 8px 6px;
  flex: 1;
  
  @media (max-width: 768px) {
    min-width: 60px;
    max-width: 100px;
    padding: 6px 4px;
  }
  
  @media (max-width: 480px) {
    min-width: 50px;
    max-width: 80px;
    padding: 4px 2px;
  }
`

const InfoLabel = styled.div`
  font-size: 13px;
  color: #bbb;
  margin-bottom: 6px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    font-size: 11px;
    margin-bottom: 4px;
    letter-spacing: 0.3px;
  }
  
  @media (max-width: 480px) {
    font-size: 9px;
    margin-bottom: 2px;
    letter-spacing: 0.2px;
  }
`

const InfoValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`

const ProfitDisplay = styled.div<{ profit: number }>`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.profit > 0 ? '#4caf50' : props.profit < 0 ? '#f44336' : '#fff'};
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`

// Deterministic helper: given a seed string and offset, derive a rank.
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import { HILO_CONFIG } from '../rtpConfig'
const deriveRank = (seed: string, offset = 0) => {
  const rng = makeDeterministicRng(seed + ':' + offset)
  return 1 + Math.floor(rng() * (RANKS - 1))
}

const card = (rank: number, key: number): Card => ({
  key,
  rank,
})

interface Card {
  key: number
  rank: number
}

export interface HiLoConfig {
  logo: string
}

// Use centralized bet array calculation
const generateBetArray = (currentRank: number, isHi: boolean) => {
  return HILO_CONFIG.calculateBetArray(currentRank, isHi)
}

// No further adjustment required; average EV < 1 by scaling factor.

export default function HiLo(props: HiLoConfig) {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [seed] = React.useState(() => 'hilo-init')
  const [cards, setCards] = React.useState([card(deriveRank(seed, 0), 0)])
  const [claiming, setClaiming] = React.useState(false)
  const [initialWager, setInitialWager] = useWagerInput()
  const [profit, setProfit] = React.useState(0)
  const currentRank = cards[cards.length - 1].rank
  const [option, setOption] = React.useState<'hi' | 'lo'>(currentRank > RANKS / 2 ? 'lo' : 'hi')
  const [hoveredOption, hoverOption] = React.useState<'hi' | 'lo'>()
  
  // Progressive state
  const [inProgress, setInProgress] = React.useState(false)
  const [currentBalance, setCurrentBalance] = React.useState(0)
  const [totalProfit, setTotalProfit] = React.useState(0)
  const [handCount, setHandCount] = React.useState(0)
  const [progressive, setProgressive] = React.useState(true) // Toggle between normal and progressive modes
  
  // Get graphics settings to check if motion is enabled
  const { settings } = useGraphics()
  
  // Mobile detection for responsive stats display
  const { mobile: isMobile } = useIsCompact()

  // Game statistics tracking - using centralized hook
  const gameStats = useGameStats('hilo')
  
  // Effects system for enhanced visual feedback
  const effectsRef = React.useRef<GameplayEffectsRef>(null)

  const addCard = (rank: number) => setCards((cards) => [...cards, card(rank, cards.length)].slice(-MAX_CARD_SHOWN))

  const sounds = useSound({
    card: SOUND_CARD,
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    finish: SOUND_FINISH,
  })

  // Calculate maximum multiplier across all possible card ranks and hi/lo combinations
  const maxMultiplier = React.useMemo(() => {
    let max = 0;
    for (let rank = 0; rank < 13; rank++) {
      const hiArray = generateBetArray(rank, true);
      const loArray = generateBetArray(rank, false);
      const hiMax = Math.max(...hiArray);
      const loMax = Math.max(...loArray);
      max = Math.max(max, hiMax, loMax);
    }
    return max;
  }, []);

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
  addCard(deriveRank(seed + ':reset', Date.now() /* deterministic enough across resets */ % 10))
        setClaiming(false)
      }, 300)
    } catch {
      setClaiming(false)
    }
  }

  const handleStart = () => {
    setCurrentBalance(initialWager)
    setTotalProfit(0)
    setHandCount(0)
    setInProgress(true)
    sounds.play('play')
    play()
  }

  const handleCashOut = () => {
    setInProgress(false)
    setCurrentBalance(0)
    setTotalProfit(0)
    setHandCount(0)
    setProfit(0)
    resetGame()
  }

  const bet = _bet

  const multipler = Math.max(...bet)
  const maxWagerForBet = pool.maxPayout / multipler
  const wager = inProgress ? currentBalance : initialWager

  const play = async () => {
    // CRITICAL SECURITY: Prevent zero wager gameplay
    if (wager <= 0) {
      console.error('❌ BLOCKED: Cannot play with zero wager');
      return;
    }
    
    sounds.play('play')

    await game.play({
      bet,
      wager,
    })

    const result = await game.result()
    addCard(result.resultIndex)
    sounds.play('card', { playbackRate: .8 })
    const win = result.payout > 0

    // Delay state updates slightly to allow reveal animations and avoid flashing UI
    setTimeout(() => {
      if (win) {
        sounds.play('win')

        // 🃏 TRIGGER HILO WIN EFFECTS
        console.log('🃏 HILO WIN! Correct prediction')
        effectsRef.current?.winFlash() // Use colorScheme's winGlow color
        effectsRef.current?.particleBurst(50, 60, undefined, 8) // Card flip particles
        effectsRef.current?.screenShake(0.8, 500) // Light shake for win

        // Progressive: Update balance and profit after reveal
        setCurrentBalance(result.payout)
        setTotalProfit(result.payout - initialWager)
        setHandCount(prev => prev + 1)
        // update profit for the panel but avoid immediate reset elsewhere
        setProfit(result.payout)
        
        // In normal mode, reset after each win
        if (!progressive) {
          setTimeout(() => {
            setInProgress(false)
            setCurrentBalance(0)
            setTotalProfit(0)
            setHandCount(0)
            setProfit(0)
          }, 150)
        }
        
      } else {
        sounds.play('lose')

        // 💔 TRIGGER HILO LOSE EFFECTS
        console.log('💔 HILO LOSE! Wrong prediction')
        effectsRef.current?.loseFlash() // Use colorScheme's loseGlow color
        effectsRef.current?.screenShake(0.5, 300) // Light shake for loss

        // Progressive: Reset on loss after animations
        setTimeout(() => {
          setInProgress(false)
          setCurrentBalance(0)
          setTotalProfit(-initialWager)
          setHandCount(0)
          setProfit(0)
        }, 150)
      }

      // Update game statistics
      gameStats.updateStats(result.payout)
    }, 450)
  }

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="HiLo"
          gameMode={progressive ? "Progressive" : "Normal"}
          rtp="95"
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <StyledHiLoBackground>
          {/* Romantic card background elements */}
          <div className="romance-bg-elements" />
          <div className="razor-overlay" />
          <div className="fragile-indicator" />
          
          <GameplayFrame 
            ref={effectsRef}
            {...(useGameMeta('hilo') && { title: useGameMeta('hilo')!.name, description: useGameMeta('hilo')!.description })}
          >
            <GambaUi.Responsive>
              <div className="hilo-content">
                <Container $disabled={claiming || gamba.isPlaying}>
                  
                  {/* Progressive Info - always visible */}
                  <ProgressiveInfo visible={true} enableMotion={settings.enableMotion}>
                    {inProgress ? (
                      <>
                        <InfoItem>
                          <InfoLabel>Current Balance</InfoLabel>
                          <ProfitDisplay profit={currentBalance}>
                            <TokenValue amount={currentBalance} />
                          </ProfitDisplay>
                        </InfoItem>
                        
                        <InfoItem>
                          <InfoLabel>Total Profit</InfoLabel>
                          <InfoValue style={{ color: totalProfit > 0 ? '#4caf50' : '#f44336' }}>
                            <TokenValue amount={totalProfit} />
                          </InfoValue>
                        </InfoItem>
                        
                        <InfoItem>
                          <InfoLabel>Hands Played</InfoLabel>
                          <InfoValue>{handCount}</InfoValue>
                        </InfoItem>
                      </>
                    ) : (
                      <>
                        <InfoItem>
                          <InfoLabel>Game Status</InfoLabel>
                          <InfoValue>Ready to Play</InfoValue>
                        </InfoItem>
                        
                        <InfoItem>
                          <InfoLabel>Game Type</InfoLabel>
                          <InfoValue>{progressive ? 'Progressive HiLo' : 'Classic HiLo'}</InfoValue>
                        </InfoItem>
                        
                        <InfoItem>
                          <InfoLabel>Starting Wager</InfoLabel>
                          <InfoValue>
                            <TokenValue amount={initialWager} />
                          </InfoValue>
                        </InfoItem>
                        
                        <InfoItem>
                          <InfoLabel>Mode</InfoLabel>
                          <InfoValue>Progressive</InfoValue>
                        </InfoItem>
                      </>
                    )}
                  </ProgressiveInfo>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                    <CardsContainer enableMotion={settings.enableMotion}>
                      {cards.map((card, i) => {
                        const offset = -(cards.length - (i + 1))
                        const xxx = cards.length > 3 ? (i / cards.length) : 1
                        const opacity = Math.min(1, xxx * 3)
                        return (
                          <CardContainer
                            key={card.key}
                            enableMotion={settings.enableMotion}
                            style={{
                              transform: `translate(${offset * 30}px, ${-offset * 0}px) rotateZ(-5deg) rotateY(5deg)`,
                              opacity,
                            }}
                          >
                            <HiLoCard
                              rank={card.rank}
                              revealed={true}
                              small={false}
                              logo={props.logo}
                              enableMotion={settings.enableMotion}
                            />
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
                  <HiLoCard
                    key={rankIndex}
                    rank={rankIndex}
                    revealed={true}
                    small={true}
                    logo={props.logo}
                    enableMotion={settings.enableMotion}
                    style={{ opacity }}
                    onClick={() => addCard(rankIndex)}
                  />
                )
              })}
            </CardPreview>
                </Container>
              </div>
            </GambaUi.Responsive>
          </GameplayFrame>
        </StyledHiLoBackground>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        {!inProgress ? (
          <>
            <MobileControls
              wager={initialWager}
              setWager={setInitialWager}
              onPlay={handleStart}
              playDisabled={!option || initialWager > maxWagerForBet}
              playText={progressive ? "Start" : "Start"}
            >
              <SwitchControl
                label="Progressive Mode"
                checked={progressive}
                onChange={setProgressive}
                disabled={false}
              />
            </MobileControls>
            
            <DesktopControls
              onPlay={handleStart}
              playDisabled={!option || initialWager > maxWagerForBet}
              playText="Start"
            >
              <EnhancedWagerInput
                value={initialWager}
                onChange={setInitialWager}
              />
              <div>Progressive:</div>
              <GambaUi.Switch
                checked={progressive}
                onChange={setProgressive}
              />
              {initialWager > maxWagerForBet && (
                <EnhancedButton onClick={() => setInitialWager(maxWagerForBet)}>
                  Set max
                </EnhancedButton>
              )}
            </DesktopControls>
          </>
        ) : (
          <>
            <MobileControls
              wager={initialWager}
              setWager={setInitialWager}
              onPlay={progressive ? play : handleStart}
              playDisabled={progressive ? !option : false}
              playText={progressive ? "Continue" : "Again"}
            />
            
            <DesktopControls
              onPlay={progressive ? play : handleStart}
              playDisabled={progressive ? !option : false}
              playText={progressive ? "Continue" : "Again"}
            >
              <EnhancedWagerInput
                value={initialWager}
                onChange={setInitialWager}
                disabled={true}
              />
              <TokenValue amount={currentBalance} />
              {progressive && (
                <EnhancedButton disabled={gamba.isPlaying} onClick={handleCashOut}>
                  Cash Out
                </EnhancedButton>
              )}
            </DesktopControls>
          </>
        )}
      </GambaUi.Portal>
    </>
  )
}
