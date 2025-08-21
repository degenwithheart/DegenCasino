import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { PROGRESSIVE_POKER_CONFIG } from '../rtpConfig'
import { EnhancedWagerInput, EnhancedPlayButton, EnhancedButton, MobileControls, DesktopControls } from '../../components'
import { SOUND_CARD, SOUND_LOSE, SOUND_PLAY, SOUND_WIN, SOUND_JACKPOT } from './constants'
import GameScreenFrame from '../../components/GameScreenFrame'
import { PokerCard } from './PokerCard'
import { StyledProgressivePokerBackground } from './ProgressiveBackground.enhanced.styles'
import styled, { keyframes } from 'styled-components'

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
  flex-wrap: wrap;
  margin: 20px 0;
`

const HandResult = styled.div<{ type: string; visible: boolean }>`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  border-radius: 8px;
  height: 280px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
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
  animation: ${props => props.visible && props.type !== 'Bust' ? pulseFade : 'none'} 1.6s infinite;
`

const ProgressiveInfo = styled.div<{ visible: boolean }>`
  text-align: center;
  background: rgba(0, 150, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  width: 100%;
  max-width: 500px;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`

const ProfitDisplay = styled.div<{ profit: number }>`
  font-size: 32px;
  font-weight: bold;
  color: ${props => props.profit > 0 ? '#4caf50' : props.profit < 0 ? '#f44336' : '#fff'};
  margin: 10px 0;
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

const PlaceholderText = styled.div`
  text-align: center;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 40px 0;
  animation: ${pulseFade} 1.6s infinite;
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
    // Reset state to prevent card face flash
    setHand(null)
    setCards([])
    setCardRevealed([false, false, false, false, false])
    setRevealing(true)

    // Calculate wager: initial wager for first hand, full balance for subsequent hands
    const currentWager = handCount === 0 ? initialWager : currentBalance

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

      // Debug logging - Enhanced to track the mismatch
      console.log('🔍 PAYOUT MISMATCH DEBUG:', {
        resultIndex,
        handTypeName: handTemplate.name,
        rtpConfigMultiplier: multiplier,
        gambaResultPayout: result.payout,
        currentWager,
        expectedPayout: currentWager * multiplier,
        actualPayout: result.payout,
        mismatch: result.payout !== (currentWager * multiplier) ? '❌ MISMATCH!' : '✅ Match'
      })

      if (multiplier > 0) {
        // Winning hand - calculate correct payout
        const expectedPayout = currentWager * multiplier;
        // Use Gamba's payout if it's non-zero and reasonable, otherwise use our calculation
        const actualPayout = (result.payout > 0 && result.payout >= expectedPayout * 0.9) 
          ? result.payout 
          : expectedPayout;
        
        setCurrentBalance(actualPayout)
        setTotalProfit(actualPayout - initialWager)
        setHandCount(prev => prev + 1)
        
        console.log('🎰 WIN PAYOUT CALCULATION:', {
          currentWager,
          multiplier,
          expectedPayout,
          gambaResultPayout: result.payout,
          finalPayout: actualPayout,
          profit: actualPayout - initialWager,
          reasoning: (result.payout > 0 && result.payout >= expectedPayout * 0.9) 
            ? 'Using Gamba payout' 
            : 'Using calculated payout (Gamba payout was invalid)'
        });
        
        if (multiplier >= 250) {
          sounds.play('jackpot')
        } else {
          sounds.play('win')
        }
      } else {
        // Bust hand - lose everything, end session
        setCurrentBalance(0)
        // Fix: When you bust, you lose your original initial wager
        setTotalProfit(-initialWager)
        setInProgress(false)
        sounds.play('lose')
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
          
          <GameScreenFrame>
            <GambaUi.Responsive>
              <Container>
                <GameArea>

              {/* Always show placeholder text */}
              <PlaceholderText>
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
                    />
                  ))
                ) : (
                  Array.from({ length: 5 }).map((_, index) => (
                    <PokerCard
                      key={index}
                      rank={0}
                      suit={0}
                      revealed={false}
                    />
                  ))
                )}
              </CardsContainer>

              {/* Combined Hand Result and Progressive Info - always visible */}
              <ProgressiveInfo visible={true}>
                {/* Hand Result Section */}
                <HandResult type={hand?.type || 'Bust'} visible={!!hand}>
                  {hand ? (
                    <>
                      {hand.name}
                      {hand.payout > 0 && (
                        <div style={{ fontSize: '18px', marginTop: '5px' }}>
                          Pays {hand.payout}x
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ color: 'transparent' }}>Placeholder</div>
                  )}
                </HandResult>

                {/* Progressive Info Section */}
                {inProgress && (
                  <>
                    <div style={{ fontSize: '18px', marginBottom: '10px' }}>Current Balance</div>
                    <ProfitDisplay profit={totalProfit}>
                      <TokenValue amount={currentBalance} />
                    </ProfitDisplay>
                    <div style={{ fontSize: '14px', color: '#aaa', marginTop: '5px' }}>
                      Profit: <TokenValue amount={totalProfit} /> | Hand #{handCount + 1}
                    </div>
                    {canContinue && (
                      <div style={{ fontSize: '16px', color: '#ffd700', marginTop: '10px', fontWeight: 'bold' }}>
                        Next wager: <TokenValue amount={currentBalance} /> (Full Balance)
                      </div>
                    )}
                    {gameEnded && (
                      <div style={{ color: '#f44336', fontSize: '16px', marginTop: '10px' }}>
                        Game Over - You hit a bust hand! Lost: <TokenValue amount={handCount === 0 ? initialWager : currentBalance} />
                      </div>
                    )}
                  </>
                )}
              </ProgressiveInfo>

              </GameArea>
            </Container>
          </GambaUi.Responsive>
        </GameScreenFrame>
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
