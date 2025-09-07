import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
// import { calculateExpectedValue, analyzeWinProbability } from './analytics'
import { useGameMeta } from '../useGameMeta'
import { PROGRESSIVE_POKER_CONFIG } from '../rtpConfig'
import { EnhancedWagerInput, EnhancedPlayButton, EnhancedButton, MobileControls, DesktopControls, SwitchControl } from '../../components'
import { SOUND_CARD, SOUND_LOSE, SOUND_PLAY, SOUND_WIN, SOUND_JACKPOT } from './constants'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { PokerCard } from './PokerCard'
import { StyledProgressivePokerBackground } from './MultiPokerBackground.enhanced.styles'
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
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: ${props => props.enableMotion !== false ? 'opacity 0.3s ease, visibility 0.3s ease' : 'none'};
  box-shadow: 0 4px 20px rgba(0, 255, 0, 0.15);
  max-width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
    margin: 15px 0;
    gap: 12px;
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    gap: 10px;
    border-radius: 8px;
    grid-template-columns: repeat(2, 1fr);
  }
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70px;
  padding: 12px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    min-height: 60px;
    padding: 10px 6px;
  }
  
  @media (max-width: 480px) {
    min-height: 55px;
    padding: 8px 4px;
    border-radius: 6px;
  }
`

const InfoLabel = styled.div`
  font-size: 12px;
  color: #bbb;
  margin-bottom: 6px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 11px;
    margin-bottom: 4px;
    letter-spacing: 0.3px;
  }
  
  @media (max-width: 480px) {
    font-size: 10px;
    margin-bottom: 3px;
    letter-spacing: 0.2px;
  }
`

const InfoValue = styled.div`
  font-size: 15px;
  font-weight: bold;
  color: #fff;
  line-height: 1.3;
  text-align: center;
  word-wrap: break-word;
  hyphens: auto;
  
  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.2;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
`

const ProfitDisplay = styled.div<{ profit: number }>`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.profit > 0 ? '#4caf50' : props.profit < 0 ? '#f44336' : '#fff'};
  line-height: 1.3;
  word-wrap: break-word;
  
  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.2;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
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

  // Calculate maximum multiplier from progressive poker bet array
  const maxMultiplier = React.useMemo(() => {
    return Math.max(...PROGRESSIVE_POKER_CONFIG.betArray);
  }, []);

  const [hand, setHand] = React.useState<({ name: string; type: HandType; payout: number } | null)>(null)
  const [revealing, setRevealing] = React.useState(false)
  const [cards, setCards] = React.useState<{ rank: number; suit: number }[]>([])
  const [currentBalance, setCurrentBalance] = React.useState(0) // Tracks the actual balance to wager
  const [totalProfit, setTotalProfit] = React.useState(0) // Total profit from initial wager
  const [inProgress, setInProgress] = React.useState(false)
  const [showingResult, setShowingResult] = React.useState(false) // Track when showing win/loss result
  const [cardRevealed, setCardRevealed] = React.useState<boolean[]>([false, false, false, false, false])
  const [handCount, setHandCount] = React.useState(0) // Track number of hands played
  const [gameMode, setGameMode] = React.useState<'single' | 'chain' | 'progressive'>('single') // Game mode selector - starts on single
  const [chainLength, setChainLength] = React.useState(0) // Track current chain length
  const [lastHandRank, setLastHandRank] = React.useState<number>(-1) // Track rank of last hand for chain validation
  const [chainHistory, setChainHistory] = React.useState<string[]>([]) // Track chain progression

  // Helper function to get hand rank for chaining logic using rtpConfig
  const getHandRank = (resultIndex: number): number => {
    // Return the result index directly as it represents the chain ranking
    return resultIndex >= 3 ? resultIndex : -1 // Only indices 3+ are valid chain hands
  }

  // Check if current hand continues the chain using rtpConfig validation
  const isValidChainProgression = (resultIndex: number): boolean => {
    if (gameMode === 'single') {
      // Single mode: every hand is valid (no chaining)
      return true
    } else if (gameMode === 'progressive') {
      // Progressive mode: any winning hand continues (no chain requirement)
      return resultIndex >= 3 // Any pair or better continues
    } else if (gameMode === 'chain') {
      // Chain mode: must get progressively better hands
      if (chainLength === 0) {
        // First hand: must be index 3+ (Pair or better) to start chain
        return resultIndex >= 3
      }
      
      // Subsequent hands: must be strictly higher index (better hand)
      return resultIndex > lastHandRank
    }
    
    return false
  }

  const play = async () => {
    // Calculate wager based on game mode
    const currentWager = gameMode === 'single' 
      ? initialWager // Single mode: always use initial wager
      : (handCount === 0 ? initialWager : currentBalance) // Chain/Progressive: use balance for continuation
    
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

      console.log('🔍 MULTI-MODE POKER RESULT:', {
        resultIndex,
        handTypeName: handTemplate.name,
        gameMode,
        chainLength,
        lastHandRank,
        isValidProgression: isValidChainProgression(resultIndex),
        gambaMultiplier: result.multiplier,
        gambaPayout: result.payout,
        currentWager
      })

      // MULTI-MODE LOGIC: Check if hand is valid based on current game mode
      const isValidProgression = isValidChainProgression(resultIndex)
      
      if (result.multiplier > 0 && isValidProgression) {
        // VALID HAND: Handle based on game mode
        if (gameMode === 'chain') {
          console.log(`🔗 CHAIN CONTINUES! ${handTemplate.name} (rank ${resultIndex}) > previous rank ${lastHandRank}`);
        } else if (gameMode === 'progressive') {
          console.log(`🎯 PROGRESSIVE WIN! ${handTemplate.name} - streak continues!`);
        } else {
          console.log(`✅ SINGLE WIN! ${handTemplate.name} - hand complete!`);
        }
        
        // Update progression state based on mode
        if (gameMode === 'chain') {
          setChainLength(prev => prev + 1)
          setLastHandRank(resultIndex)
          setChainHistory(prev => [...prev, handTemplate.name])
        } else if (gameMode === 'progressive') {
          setChainLength(prev => prev + 1) // Track streak length
          setChainHistory(prev => [...prev, handTemplate.name])
          // Don't update lastHandRank for progressive mode (no chain requirement)
        }
        // Single mode doesn't track chains
        
        // Enhanced effects based on game mode and hand strength
        if (effectsRef.current) {
          if (result.multiplier >= 20) {
            // Flush+ - ultimate effects
            effectsRef.current.winFlash('#ffd700', 4)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#ffd700', 120)
              effectsRef.current?.screenShake(5, 2000)
            }, 600)
          } else if (result.multiplier >= 9) {
            // Straight - major effects
            effectsRef.current.winFlash('#e53935', 3.5)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#e53935', 90)
              effectsRef.current?.screenShake(4, 1500)
            }, 400)
          } else if (result.multiplier >= 5) {
            // Three of a Kind - good effects
            effectsRef.current.winFlash('#8e24aa', 3)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#8e24aa', 70)
              effectsRef.current?.screenShake(3, 1200)
            }, 300)
          } else if (result.multiplier >= 3) {
            // Two Pair - modest effects
            effectsRef.current.winFlash('#43a047', 2.5)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#43a047', 50)
              effectsRef.current?.screenShake(2.5, 1000)
            }, 200)
          } else {
            // Pair - basic effects
            effectsRef.current.winFlash('#1976d2', 2)
            setTimeout(() => {
              effectsRef.current?.particleBurst(undefined, undefined, '#1976d2', 30)
            }, 150)
          }
        }
        
        // Sound effects based on progression
        if (result.multiplier >= 20) {
          console.log('🎆 ULTIMATE HAND! Flush+ achieved!');
          sounds.play('jackpot');
        } else if (chainLength >= 3 && gameMode !== 'single') {
          console.log('🔥 LONG STREAK! Building momentum!');
          sounds.play('win');
        } else {
          console.log('✨ GOOD HAND!');
          sounds.play('win');
        }
        
        // Use Gamba's exact payout (this already includes the multiplier calculation)
        if (gameMode === 'single') {
          // Single mode: each hand is independent, don't carry balance forward
          setCurrentBalance(0); // Reset balance since we don't chain
          setTotalProfit(prev => prev + (result.payout - currentWager)); // Add profit from this hand
        } else {
          // Chain/Progressive modes: carry balance forward for next wager
          setCurrentBalance(result.payout);
          setTotalProfit(result.payout - initialWager);
        }
        setHandCount(prev => prev + 1);
        setShowingResult(true);
        
        // End game based on mode
        if (gameMode === 'single') {
          // Single mode: always end after one hand
          setInProgress(false);
          setChainLength(0);
          setLastHandRank(-1);
          setChainHistory([]);
        }
        // Chain and Progressive modes continue until bust or cash out
        
      } else {
        // INVALID HAND OR BUST: Handle based on game mode
        if (result.multiplier > 0 && !isValidProgression && gameMode === 'chain') {
          console.log(`💔 CHAIN BROKEN! ${handTemplate.name} (rank ${resultIndex}) not better than previous rank ${lastHandRank}`);
        } else if (result.multiplier === 0) {
          console.log('💔 BUST! Zero multiplier hand');
        } else if (gameMode === 'progressive' && result.multiplier > 0) {
          console.log('💔 PROGRESSIVE BUST! Non-winning hand in progressive mode');
        }
        
        // Enhanced bust effects for chain poker
        if (effectsRef.current) {
          effectsRef.current.loseFlash('#f44336', 2.5)
          setTimeout(() => {
            effectsRef.current?.screenShake(2.5, 1200)
          }, 300)
        }
        
        // Show the bust result but keep game in progress state temporarily
        if (gameMode === 'single') {
          // Single mode: track loss but don't reset total profit (cumulative across hands)
          setCurrentBalance(0);
          setTotalProfit(prev => prev - currentWager); // Subtract loss from cumulative profit
        } else {
          // Chain/Progressive modes: total loss of accumulated balance
          setCurrentBalance(0);
          setTotalProfit(-initialWager);
        }
        setShowingResult(true);
        setInProgress(false); // End the game so they can start again
        setChainLength(0);
        setLastHandRank(-1);
        setChainHistory([]);
        sounds.play('lose');
      }

    } catch (error) {
      console.error('Game error:', error)
    } finally {
      setRevealing(false)
    }
  }

  const handleStart = () => {
    if (gameMode === 'single') {
      // Single mode: only reset hand-specific state, keep cumulative profit
      setCurrentBalance(0) // Single hands don't carry balance
      // Don't increment handCount here - it gets incremented in play result
      setChainLength(0)
      setLastHandRank(-1)
      setChainHistory([])
      setInProgress(true)
      setShowingResult(false)
      // Don't reset totalProfit - it accumulates across single hands
    } else {
      // Chain/Progressive modes: reset all game state for new sequence
      setCurrentBalance(initialWager)
      setTotalProfit(0)
      setHandCount(0)
      setChainLength(0)
      setLastHandRank(-1)
      setChainHistory([])
      setInProgress(true)
      setShowingResult(false)
    }
    
    // Clear previous hand display
    setHand(null)
    setCards([])
    setCardRevealed([false, false, false, false, false])
    
    sounds.play('play')
    play()
  }

  const handleContinue = () => {
    sounds.play('play')
    play()
  }

  const handleCashOut = () => {
    sounds.play('win')
    setInProgress(false)
    setShowingResult(false)
    setHand(null)
    setCurrentBalance(0)
    setHandCount(0)
    setChainLength(0)
    setLastHandRank(-1)
    setChainHistory([])
    setCards([])
    setCardRevealed([false, false, false, false, false])
  }

  const handleResetStats = () => {
    // Reset cumulative stats for single mode
    setTotalProfit(0)
    setHandCount(0)
    setChainLength(0)
    setLastHandRank(-1)
    setChainHistory([])
    sounds.play('play')
  }

  const canContinue = (gameMode === 'chain' || gameMode === 'progressive') && inProgress && hand && hand.payout > 0 && !revealing
  const canCashOut = (gameMode === 'chain' || gameMode === 'progressive') && inProgress && totalProfit > 0 && !revealing
  const gameEnded = showingResult && hand && hand.payout === 0

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
                {gameMode === 'single' ? (
                  'Play single poker hands for instant wins!'
                ) : gameMode === 'chain' ? (
                  'Chain progressively better poker hands to climb higher! Get a worse hand = BUST!'
                ) : (
                  'Win any poker hand to continue your streak! Lose a hand = BUST!'
                )}
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

              {/* Progressive Info - always visible with consistent layout */}
              <ProgressiveInfo visible={true} enableMotion={settings.enableMotion}>
                {/* Tile 1: Current Hand / Mode */}
                <InfoItem>
                  <InfoLabel>{(inProgress || showingResult) ? 'Current Hand' : 'Mode'}</InfoLabel>
                  <InfoValue>
                    {(inProgress || showingResult) ? (hand?.name || 'Playing...') : 
                     (gameMode === 'single' ? 'Single' : 
                      gameMode === 'chain' ? 'Chain' : 
                      'Progressive')}
                  </InfoValue>
                </InfoItem>
                
                {/* Tile 2: Chain/Streak/Hands Count */}
                <InfoItem>
                  <InfoLabel>
                    {gameMode === 'chain' ? 'Chain' : 
                     gameMode === 'progressive' ? 'Streak' : 
                     'Hands'}
                  </InfoLabel>
                  <InfoValue style={{ color: chainLength > 0 ? '#ffd700' : '#fff' }}>
                    {gameMode === 'single' ? handCount : chainLength}
                  </InfoValue>
                </InfoItem>
                
                {/* Tile 3: Round / Wager */}
                <InfoItem>
                  <InfoLabel>{(inProgress || showingResult) ? 'Round' : 'Wager'}</InfoLabel>
                  <InfoValue>
                    {(inProgress || showingResult) ? handCount : <TokenValue amount={initialWager} />}
                  </InfoValue>
                </InfoItem>
                
                {/* Tile 4: Profit */}
                <InfoItem>
                  <InfoLabel>Profit</InfoLabel>
                  <InfoValue style={{ color: totalProfit > 0 ? '#4caf50' : totalProfit < 0 ? '#f44336' : '#fff' }}>
                    <TokenValue amount={totalProfit} />
                  </InfoValue>
                </InfoItem>
                
                {/* Tile 5: Next Bet / Rules */}
                <InfoItem>
                  <InfoLabel>{canContinue ? 'Next Bet' : 'Rules'}</InfoLabel>
                  <InfoValue style={{ color: canContinue ? '#00ff00' : '#fff', fontSize: canContinue ? '15px' : '12px' }}>
                    {canContinue ? <TokenValue amount={currentBalance} /> :
                     (gameMode === 'single' ? 'Independent hands' :
                      gameMode === 'chain' ? 'Better hands or bust' :
                      'Any win continues')}
                  </InfoValue>
                </InfoItem>
                
                {/* Tile 6: Beat/Balance/Status */}
                <InfoItem>
                  <InfoLabel>
                    {canContinue && lastHandRank >= 0 && gameMode === 'chain' ? 'Beat' :
                     (!gameEnded && inProgress && currentBalance > 0) ? 'Balance' :
                     gameEnded ? 'Result' : 'Status'}
                  </InfoLabel>
                  <InfoValue style={{ 
                    color: canContinue && lastHandRank >= 0 && gameMode === 'chain' ? '#ffa500' :
                           gameEnded ? '#f44336' : '#fff',
                    fontSize: canContinue && lastHandRank >= 0 && gameMode === 'chain' ? '11px' : '15px'
                  }}>
                    {canContinue && lastHandRank >= 0 && gameMode === 'chain' ? 
                      PROGRESSIVE_POKER_CONFIG.HAND_TYPES[lastHandRank] :
                     (!gameEnded && inProgress && currentBalance > 0) ? 
                      <TokenValue amount={currentBalance} /> :
                     gameEnded ? 
                      (gameMode === 'chain' ? '💔 Chain Broken!' : 
                       gameMode === 'progressive' ? '💔 Streak Ended!' : 
                       '💔 Hand Lost!') :
                     'Ready to play'}
                  </InfoValue>
                </InfoItem>
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
      onPlay={
        inProgress && canContinue ? handleContinue : handleStart
      }
      playDisabled={revealing || !pool || (inProgress && !canContinue && !gameEnded)}
      playText={
        inProgress && canContinue ? 
          (gameMode === 'chain' ? "Continue Chain" : gameMode === 'progressive' ? "Continue Streak" : "Continue") : 
        gameEnded || showingResult ? "Play Again" : 
        gameMode === 'chain' ? "Start Chain" :
        gameMode === 'progressive' ? "Start Streak" :
        "Play Hand"
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
          Current Mode: {gameMode === 'single' ? 'Single Hand' : gameMode === 'chain' ? 'Chain Mode' : 'Progressive'}
        </div>
        {!inProgress && (
          <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
            <button
              style={{
                padding: '5px 10px',
                backgroundColor: gameMode === 'single' ? '#4CAF50' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid ' + (gameMode === 'single' ? '#4CAF50' : 'rgba(255,255,255,0.3)'),
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
              onClick={() => setGameMode('single')}
            >
              Single
            </button>
            <button
              style={{
                padding: '5px 10px',
                backgroundColor: gameMode === 'chain' ? '#4CAF50' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid ' + (gameMode === 'chain' ? '#4CAF50' : 'rgba(255,255,255,0.3)'),
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
              onClick={() => setGameMode('chain')}
            >
              Chain
            </button>
            <button
              style={{
                padding: '5px 10px',
                backgroundColor: gameMode === 'progressive' ? '#4CAF50' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid ' + (gameMode === 'progressive' ? '#4CAF50' : 'rgba(255,255,255,0.3)'),
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
              onClick={() => setGameMode('progressive')}
            >
              Progressive
            </button>
          </div>
        )}
        {gameMode === 'single' && !inProgress && handCount > 0 && (
          <button
            style={{
              padding: '5px 10px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              alignSelf: 'center'
            }}
            onClick={handleResetStats}
          >
            Reset Stats
          </button>
        )}
      </div>
    </MobileControls>
    
    <DesktopControls>
      <EnhancedWagerInput value={initialWager} onChange={setInitialWager} disabled={inProgress} multiplier={maxMultiplier} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Game Mode:</div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: gameMode === 'single' ? '#4CAF50' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '2px solid ' + (gameMode === 'single' ? '#4CAF50' : 'rgba(255,255,255,0.3)'),
              borderRadius: '6px',
              cursor: inProgress ? 'not-allowed' : 'pointer',
              opacity: inProgress ? 0.5 : 1,
              fontSize: '13px',
              fontWeight: 'bold'
            }}
            onClick={() => !inProgress && setGameMode('single')}
            disabled={inProgress}
          >
            Single
          </button>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: gameMode === 'chain' ? '#4CAF50' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '2px solid ' + (gameMode === 'chain' ? '#4CAF50' : 'rgba(255,255,255,0.3)'),
              borderRadius: '6px',
              cursor: inProgress ? 'not-allowed' : 'pointer',
              opacity: inProgress ? 0.5 : 1,
              fontSize: '13px',
              fontWeight: 'bold'
            }}
            onClick={() => !inProgress && setGameMode('chain')}
            disabled={inProgress}
          >
            Chain
          </button>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: gameMode === 'progressive' ? '#4CAF50' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '2px solid ' + (gameMode === 'progressive' ? '#4CAF50' : 'rgba(255,255,255,0.3)'),
              borderRadius: '6px',
              cursor: inProgress ? 'not-allowed' : 'pointer',
              opacity: inProgress ? 0.5 : 1,
              fontSize: '13px',
              fontWeight: 'bold'
            }}
            onClick={() => !inProgress && setGameMode('progressive')}
            disabled={inProgress}
          >
            Progressive
          </button>
        </div>
      </div>
      
      <EnhancedPlayButton 
        onClick={
          inProgress && canContinue ? handleContinue : handleStart
        }
        disabled={revealing || !pool || (inProgress && !canContinue && !gameEnded)}
        wager={initialWager}
      >
        {inProgress && canContinue ? 
          (gameMode === 'chain' ? "Continue Chain" : gameMode === 'progressive' ? "Continue Streak" : "Continue") : 
         gameEnded || showingResult ? "Play Again" : 
         gameMode === 'chain' ? "Start Chain" :
         gameMode === 'progressive' ? "Start Streak" :
         "Play Hand"}
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
    
    {/* Reset Stats button - only visible in single mode when not in progress */}
    {gameMode === 'single' && !inProgress && handCount > 0 && (
      <EnhancedButton 
        variant="secondary"
        onClick={handleResetStats}
      >
        Reset Stats
      </EnhancedButton>
    )}
      </GambaUi.Portal>
    </>
  )
}
