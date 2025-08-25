import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
// import { calculateExpectedValue, analyzeWinProbability } from './analytics'
import { useGameMeta } from '../useGameMeta'
import { PROGRESSIVE_POKER_CONFIG } from '../rtpConfig'
import { EnhancedWagerInput, EnhancedPlayButton, EnhancedButton, MobileControls, DesktopControls } from '../../components'
import { SOUND_CARD, SOUND_LOSE, SOUND_PLAY, SOUND_WIN, SOUND_JACKPOT } from './constants'
import GameplayFrame, { GameplayEffectsRef } from '../../components/GameplayFrame'
import { useGraphics } from '../../components/GameScreenFrame'
import { PokerCard } from './PokerCard'
import { StyledProgressivePokerBackground } from './ProgressiveBackground.enhanced.styles'
import styled, { keyframes, css } from 'styled-components'

// Add pulsing animation for placeholder text
const pulseFade = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  color: white;
  background: transparent;
  width: 100%;
`

const GameArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  max-width: 800px;
  width: 100%;
`

const CardsContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: nowrap;
  margin: 20px 0;
  overflow: hidden;
  padding: 0 10px;
  
  @media (max-width: 768px) {
    gap: 10px;
    margin: 15px 0;
    padding: 0 5px;
  }
  
  @media (max-width: 480px) {
    gap: 6px;
    margin: 10px 0;
    padding: 0 2px;
  }
  
  /* Scale down cards on smaller screens */
  @media (max-width: 640px) {
    transform: scale(0.9);
  }
  
  @media (max-width: 480px) {
    transform: scale(0.75);
  }
  
  @media (max-width: 380px) {
    transform: scale(0.65);
  }
`

const HandResult = styled.div<{ visible: boolean; type: string; enableMotion?: boolean }>`
  text-align: center;
  background: rgba(0, 150, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  height: 280px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: ${props => props.enableMotion !== false ? 'opacity 0.3s ease, visibility 0.3s ease' : 'none'};
  background: ${props => {
    if (!props.visible) return 'transparent';
    switch (props.type) {
      case 'Royal Flush':
        return 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
      case 'Four of a Kind':
        return 'linear-gradient(135deg, #e53935 0%, #ff5722 100%)'
      case 'Full House':
      case 'Flush':
        return 'linear-gradient(135deg, #8e24aa 0%, #ba68c8 100%)'
      case 'Straight':
        return 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
      case 'Three of a Kind':
        return 'linear-gradient(135deg, #43a047 0%, #66bb6a 100%)'
      case 'Two Pair':
        return 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)'
      case 'Pair':
        return 'linear-gradient(135deg, #fb8c00 0%, #ffb74d 100%)'
      case 'Bust':
        return 'rgba(244, 67, 54, 0.2)' // Subtle red background for bust that matches ProgressiveInfo style
      default:
        return 'rgba(244, 67, 54, 0.2)' // Same subtle red for other bust types
    }
  }};
  border: ${props => {
    if (!props.visible) return 'none';
    if (props.type === 'Bust') return '1px solid rgba(244, 67, 54, 0.4)';
    return 'none';
  }};
  color: ${props => {
    if (props.type === 'Bust') return '#ff6b6b'; // Softer red text for bust
    if (['Royal Flush', 'Four of a Kind', 'Full House', 'Flush', 'Straight', 'Three of a Kind', 'Two Pair', 'Pair'].includes(props.type)) return '#000';
    return '#ff6b6b'; // Default to softer red for other bust types
  }};
  box-shadow: ${props => {
    if (!props.visible) return 'none';
    if (props.type === 'Bust') return '0 2px 8px rgba(244, 67, 54, 0.1)'; // Subtle shadow for bust
    return '0 4px 20px rgba(0, 0, 0, 0.3)';
  }};
  ${props => props.visible && props.type !== 'Bust' && props.enableMotion !== false && css`
    animation: ${pulseFade} 1.6s infinite;
  `}
`

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
  min-height: 48px; /* Fixed height to prevent jumping */
  align-items: center;
`

const PlaceholderText = styled.div<{ enableMotion?: boolean }>`
  text-align: center;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 40px 0;
  ${props => props.enableMotion !== false && css`
    animation: ${pulseFade} 1.6s infinite;
  `}
`

// Map the hand types from rtpConfig to display types
type HandType = 'Bust' | 'Pair' | 'Two Pair' | 'Three of a Kind' | 'Straight' | 'Flush' | 'Full House' | 'Four of a Kind' | 'Royal Flush';

interface HandTemplate { 
  name: string; 
  type: HandType; 
}

// Use rtpConfig HAND_TYPES and betArray to determine hand results
const getHandTemplateFromResult = (resultIndex: number): HandTemplate => {
  const handTypeName = PROGRESSIVE_POKER_CONFIG.HAND_TYPES[resultIndex] || 'Bust'
  const payout = PROGRESSIVE_POKER_CONFIG.betArray[resultIndex] || 0
  
  // Use rtpConfig display mapping function
  const displayType = PROGRESSIVE_POKER_CONFIG.getDisplayType(handTypeName, payout)
  
  return {
    name: handTypeName,
    type: displayType as HandType
  }
}

// Use rtpConfig card templates - no longer hardcoded!
function getPokerHandCards(type: string) {
  return PROGRESSIVE_POKER_CONFIG.getCardTemplate(type)
}

export default function ProgressivePowerPoker() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [initialWager, setInitialWager] = useWagerInput()
  
  // Get graphics settings to check if motion is enabled
  const { settings } = useGraphics()
  
  // Effects system for enhanced poker feedback
  const effectsRef = React.useRef<GameplayEffectsRef>(null)
  
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    card: SOUND_CARD,
    jackpot: SOUND_JACKPOT,
  })

  const [hand, setHand] = React.useState<({ name: string; type: HandType; payout: number } | null)>(null)
  const [revealing, setRevealing] = React.useState(false)
  const [cards, setCards] = React.useState<{ rank: number; suit: number }[]>([])
  const [currentBalance, setCurrentBalance] = React.useState(0) // Tracks the actual balance to wager
  const [totalProfit, setTotalProfit] = React.useState(0) // Total profit from initial wager
  const [inProgress, setInProgress] = React.useState(false)
  const [cardRevealed, setCardRevealed] = React.useState<boolean[]>([false, false, false, false, false])
  const [handCount, setHandCount] = React.useState(0) // Track number of hands played

  const play = async () => {
    // Calculate wager: initial wager for first hand, full balance for subsequent hands
    const currentWager = handCount === 0 ? initialWager : currentBalance
    
    // CRITICAL SECURITY: Prevent zero wager gameplay
    if (currentWager <= 0) {
      console.error('❌ BLOCKED: Cannot play with zero wager');
      return;
    }
    
    // Reset state to prevent card face flash
    setHand(null)
    setCards([])
    setCardRevealed([false, false, false, false, false])
    setRevealing(true)

    try {
      await game.play({
        bet: [...PROGRESSIVE_POKER_CONFIG.betArray],
        wager: currentWager,
        metadata: [handCount], // Track hand number for transparency
      })

      const result = await game.result()
      const resultIndex = result.resultIndex

      const handTemplate = getHandTemplateFromResult(resultIndex)
      const multiplier = PROGRESSIVE_POKER_CONFIG.betArray[resultIndex]
      const handCards = getPokerHandCards(handTemplate.type)

      setCards(handCards)
      
      // Reveal cards one by one
      for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 300))
        sounds.play('card')
        setCardRevealed(prev => {
          const newRevealed = [...prev]
          newRevealed[i] = true
          return newRevealed
        })
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      
      const handResult = {
        name: handTemplate.name,
        type: handTemplate.type,
        payout: multiplier
      }

      setHand(handResult)

      console.log('🔍 PROGRESSIVE POKER RESULT:', {
        resultIndex,
        handTypeName: handTemplate.name,
        gambaMultiplier: result.multiplier,
        gambaPayout: result.payout,
        currentWager
      })

      if (result.multiplier > 0) {
        // WIN: Use exact Gamba result.multiplier and result.payout
        console.log(`🎉 WIN! Gamba multiplier: ${result.multiplier}x, payout: ${result.payout}`);
        
        // Enhanced progressive poker effects
        if (effectsRef.current) {
          if (result.multiplier >= 16) {
            // Royal Flush / Straight Flush - ultimate jackpot effects
            effectsRef.current.winFlash('#ffd700', 4)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#ffd700', 120)
              effectsRef.current?.screenShake(5, 2000)
            }, 600)
          } else if (result.multiplier >= 8) {
            // Four of a Kind - major win effects
            effectsRef.current.winFlash('#e53935', 3.5)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#e53935', 90)
              effectsRef.current?.screenShake(4, 1500)
            }, 400)
          } else if (result.multiplier >= 6) {
            // Full House/Flush - good win effects
            effectsRef.current.winFlash('#8e24aa', 3)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#8e24aa', 70)
              effectsRef.current?.screenShake(3, 1200)
            }, 300)
          } else if (result.multiplier >= 3) {
            // Pairs/Two Pair - modest win effects
            effectsRef.current.winFlash('#43a047', 2.5)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#43a047', 50)
              effectsRef.current?.screenShake(2.5, 1000)
            }, 200)
          } else {
            // Small win
            effectsRef.current.winFlash('#1976d2', 2)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#1976d2', 30)
            }, 150)
          }
        }
        
        // Visual feedback based on exact result.multiplier from rtpConfig
        if (result.multiplier >= 16) {
          console.log('🎆 ROYAL/FLUSH! 16x multiplier from rtpConfig!');
          sounds.play('jackpot');
        } else if (result.multiplier >= 8) {
          console.log('🔥 THREE OF A KIND/STRAIGHT! 8x multiplier from rtpConfig!');
          sounds.play('win');
        } else if (result.multiplier >= 6) {
          console.log('💰 TWO PAIR! 6x multiplier from rtpConfig!');
          sounds.play('win');
        } else if (result.multiplier >= 3) {
          console.log('✨ JACKS+ PAIR! 3x multiplier from rtpConfig!');
          sounds.play('win');
        } else {
          console.log('🙂 Small win!');
          sounds.play('win');
        }
        
        // Use Gamba's exact payout (this already includes the multiplier calculation)
        setCurrentBalance(result.payout);
        setTotalProfit(result.payout - initialWager);
        setHandCount(prev => prev + 1);
        
      } else {
        // BUST: result.multiplier = 0, no payout
        console.log('💔 BUST! Gamba multiplier: 0x');
        
        // Enhanced bust effects for progressive poker
        if (effectsRef.current) {
          effectsRef.current.loseFlash('#f44336', 2.5)
          setTimeout(() => {
            effectsRef.current?.screenShake(2.5, 1200)
          }, 300)
        }
        
        setCurrentBalance(0);
        setTotalProfit(-initialWager);
        setInProgress(false);
        sounds.play('lose');
      }

    } catch (error) {
      console.error('Game error:', error)
    } finally {
      setRevealing(false)
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

  const handleContinue = () => {
    sounds.play('play')
    play()
  }

  const handleCashOut = () => {
    setInProgress(false)
    setHand(null)
    setCurrentBalance(0)
    setTotalProfit(0)
    setHandCount(0)
    setCards([])
    setCardRevealed([false, false, false, false, false])
  }

  const canContinue = inProgress && hand && hand.payout > 0 && !revealing
  const canCashOut = inProgress && totalProfit > 0 && !revealing
  const gameEnded = inProgress && hand && hand.payout === 0

  return (
    <>
      <GambaUi.Portal target="screen">
        <StyledProgressivePokerBackground className={hand?.type === 'Royal Flush' ? 'jackpot-mode' : ''}>
          {/* Background elements */}
          <div className="progressive-bg-elements" />
          <div className="floating-cards" />
          <div className="jackpot-symbols" />
          
          <GameplayFrame 
            ref={effectsRef}
            title={useGameMeta('progressivepoker')?.name}
            description={useGameMeta('progressivepoker')?.description}
          >
          
          <GambaUi.Responsive>
            <Container>
              <GameArea>

              {/* Always show placeholder text */}
              <PlaceholderText enableMotion={settings.enableMotion}>
                Build winning poker hands and keep your streak alive!<br />
                Cash out anytime or risk it all for bigger wins.
              </PlaceholderText>

              <CardsContainer>
                {cards.length > 0 ? (
                  cards.map((card, index) => (
                    <PokerCard
                      key={index}
                      rank={card.rank}
                      suit={card.suit}
                      revealed={cardRevealed[index]}
                      enableMotion={settings.enableMotion}
                    />
                  ))
                ) : (
                  Array.from({ length: 5 }).map((_, index) => (
                    <PokerCard
                      key={index}
                      rank={0}
                      suit={0}
                      revealed={false}
                      enableMotion={settings.enableMotion}
                    />
                  ))
                )}
              </CardsContainer>

              {/* Progressive Info - always visible with Mines-style layout */}
              <ProgressiveInfo visible={true} enableMotion={settings.enableMotion}>
                {inProgress ? (
                  <>
                    <InfoItem>
                      <InfoLabel>Current Hand</InfoLabel>
                      <InfoValue>{hand?.name || 'Playing...'}</InfoValue>
                    </InfoItem>
                    
                    <InfoItem>
                      <InfoLabel>Current Balance</InfoLabel>
                      <ProfitDisplay profit={totalProfit}>
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
                      <InfoLabel>Hand #</InfoLabel>
                      <InfoValue>{handCount + 1}</InfoValue>
                    </InfoItem>
                    
                    {canContinue && (
                      <InfoItem>
                        <InfoLabel>Next Wager</InfoLabel>
                        <InfoValue style={{ color: '#00ff00' }}>
                          <TokenValue amount={currentBalance} />
                        </InfoValue>
                      </InfoItem>
                    )}
                    
                    {gameEnded && (
                      <InfoItem>
                        <InfoLabel>Status</InfoLabel>
                        <InfoValue style={{ color: '#f44336', fontSize: '14px' }}>
                          💔 Bust!
                        </InfoValue>
                      </InfoItem>
                    )}
                  </>
                ) : (
                  <>
                    <InfoItem>
                      <InfoLabel>Game Status</InfoLabel>
                      <InfoValue>Ready to Play</InfoValue>
                    </InfoItem>
                    
                    <InfoItem>
                      <InfoLabel>Starting Wager</InfoLabel>
                      <InfoValue>
                        <TokenValue amount={initialWager} />
                      </InfoValue>
                    </InfoItem>
                    
                    <InfoItem>
                      <InfoLabel>Game Type</InfoLabel>
                      <InfoValue>Progressive Poker</InfoValue>
                    </InfoItem>
                  </>
                )}
              </ProgressiveInfo>

          </GameArea>
        </Container>
            </GambaUi.Responsive>
          </GameplayFrame>
        </StyledProgressivePokerBackground>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
    <MobileControls
      wager={initialWager}
      setWager={setInitialWager}
      onPlay={inProgress && canContinue ? handleContinue : handleStart}
      playDisabled={revealing || !pool || (inProgress && !canContinue && !gameEnded)}
      playText={
        inProgress && canContinue ? "Continue" : 
        gameEnded ? "Play" : 
        "Start"
      }
    />
    
    <DesktopControls>
      <EnhancedWagerInput value={initialWager} onChange={setInitialWager} disabled={inProgress} />
      
      <EnhancedPlayButton 
        onClick={
          inProgress && canContinue ? handleContinue : 
          gameEnded ? handleStart :
          handleStart
        }
        disabled={revealing || !pool || (inProgress && !canContinue && !gameEnded)}
        wager={initialWager}
      >
        {inProgress && canContinue ? "Continue" : 
         gameEnded ? "Play" : 
         "Start"}
      </EnhancedPlayButton>
    </DesktopControls>
    
    {/* Cash Out button - always visible, enabled only during streak */}
    <EnhancedButton 
      variant="danger"
      onClick={handleCashOut}
      disabled={!canCashOut}
    >
      Cash Out
    </EnhancedButton>
      </GambaUi.Portal>
    </>
  )
}
