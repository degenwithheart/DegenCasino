import React from 'react'
import styled, { keyframes } from 'styled-components'
import { TokenValue, useCurrentToken } from 'gamba-react-ui-v2'

// Animations
const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const tokenFallAnimation = keyframes`
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
`

const sparkleAnimation = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
`

// Styled components
const OverlayContainer = styled.div<{ $isWin: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$isWin 
    ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.95) 0%, rgba(34, 197, 94, 0.95) 100%)'
    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(107, 114, 128, 0.9) 100%)'
  };
  animation: ${fadeInScale} 0.5s ease-out;
  z-index: 1000;
`

const ContentContainer = styled.div`
  text-align: center;
  color: white;
  max-width: 90%;
  animation: ${fadeInScale} 0.6s ease-out 0.2s both;
`

const MainText = styled.h2`
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: bold;
  margin: 0 0 1rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
`

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
`

const StatLabel = styled.span`
  opacity: 0.9;
`

const StatValue = styled.span<{ $highlight?: boolean }>`
  font-weight: bold;
  color: ${props => props.$highlight ? '#fbbf24' : 'white'};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`

const PlayAgainButton = styled.button<{ $isWin: boolean }>`
  background: ${props => props.$isWin 
    ? 'linear-gradient(135deg, #fbbf24 0%, #059669 100%)'
    : 'linear-gradient(135deg, #ef4444 0%, #6b7280 100%)'
  };
  border: none;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`

const FallingToken = styled.div<{ $delay: number; $position: number; $tokenImage: string }>`
  position: absolute;
  width: 300px;
  height: 300px;
  background-image: url(${props => props.$tokenImage});
  background-size: contain;
  background-repeat: no-repeat;
  left: ${props => props.$position}%;
  animation: ${tokenFallAnimation} 3s ease-in ${props => props.$delay}s infinite;
  pointer-events: none;
`

const Sparkle = styled.div<{ $delay: number; $x: number; $y: number }>`
  position: absolute;
  width: 6px;
  height: 6px;
  background: #fbbf24;
  border-radius: 50%;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  animation: ${sparkleAnimation} 2s ease-in-out ${props => props.$delay}s infinite;
  pointer-events: none;
`

interface PlinkoMultiBallOverlayProps {
  isWin: boolean
  totalAmount: number
  ballsPlayed: number
  individualResults: number[]
  hasPlayedBefore: boolean
  onPlayAgain: () => void
  $isVisible: boolean
}

const PlinkoMultiBallOverlay: React.FC<PlinkoMultiBallOverlayProps> = ({
  isWin,
  totalAmount,
  ballsPlayed,
  individualResults,
  hasPlayedBefore,
  onPlayAgain,
  $isVisible
}) => {
  const token = useCurrentToken()

  if (!$isVisible) return null

  const averageResult = totalAmount / ballsPlayed
  const winningBalls = individualResults.filter(result => result > 0).length
  const winRate = (winningBalls / ballsPlayed) * 100

  return (
    <OverlayContainer $isWin={isWin}>
      {/* Falling tokens animation for wins */}
      {isWin && Array.from({ length: 8 }, (_, i) => (
        <FallingToken
          key={i}
          $delay={i * 0.3}
          $position={10 + (i * 10)}
          $tokenImage={token?.image || ''}
        />
      ))}

      {/* Sparkles for wins */}
      {isWin && Array.from({ length: 12 }, (_, i) => (
        <Sparkle
          key={i}
          $delay={i * 0.2}
          $x={Math.random() * 100}
          $y={Math.random() * 100}
        />
      ))}

      <ContentContainer>
        <MainText>
          {isWin ? '🎉 MULTI-BALL WIN! 🎉' : '💸 BETTER LUCK NEXT TIME'}
        </MainText>

        <StatsContainer>
          <StatItem>
            <StatLabel>Balls Played:</StatLabel>
            <StatValue $highlight>{ballsPlayed}</StatValue>
          </StatItem>
          
          <StatItem>
            <StatLabel>Winning Balls:</StatLabel>
            <StatValue>{winningBalls} ({winRate.toFixed(1)}%)</StatValue>
          </StatItem>
          
          <StatItem>
            <StatLabel>Average per Ball:</StatLabel>
            <StatValue>
              <TokenValue amount={averageResult} />
            </StatValue>
          </StatItem>
          
          <StatItem>
            <StatLabel>Total Result:</StatLabel>
            <StatValue $highlight>
              {isWin ? '+' : ''}<TokenValue amount={totalAmount} />
            </StatValue>
          </StatItem>
        </StatsContainer>

        <PlayAgainButton $isWin={isWin} onClick={onPlayAgain}>
          {hasPlayedBefore ? `Play ${ballsPlayed} Balls Again` : 'Restart'}
        </PlayAgainButton>
      </ContentContainer>
    </OverlayContainer>
  )
}

export default PlinkoMultiBallOverlay
