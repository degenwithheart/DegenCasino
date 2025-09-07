import React from 'react'
import styled from 'styled-components'

const SUITS = [
  { symbol: '♠', color: '#222' },
  { symbol: '♥', color: '#e53935' },
  { symbol: '♦', color: '#039be5' },
  { symbol: '♣', color: '#43a047' },
]

const RANKS = [
  'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'
]

interface BlackjackCardProps {
  rank: number // 0 = A, 1 = K, ..., 12 = 2
  suit: number // 0 = ♠, 1 = ♥, 2 = ♦, 3 = ♣
  revealed?: boolean
  isDealer?: boolean
  onClick?: () => void
  enableMotion?: boolean
}

const CardContainer = styled.div<{ revealed: boolean; enableMotion?: boolean }>`
  width: 120px;
  height: 168px;
  margin: 5px;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: ${props => props.enableMotion !== false ? 'transform 0.6s' : 'none'};
  transform-style: preserve-3d;
  transform: ${props => {
    if (props.enableMotion === false) {
      // In static mode, just show/hide without rotation
      return props.revealed ? 'rotateY(0deg)' : 'rotateY(0deg)';
    }
    return props.revealed ? 'rotateY(0deg)' : 'rotateY(180deg)';
  }};

  &:hover {
    transform: ${props => {
      if (props.enableMotion === false) {
        return props.revealed ? 'scale(1.05)' : 'scale(1.05)';
      }
      return props.revealed ? 'rotateY(0deg) scale(1.05)' : 'rotateY(180deg) scale(1.05)';
    }};
  }
`

const CardFace = styled.div<{ color: string; isDealer?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  background: 
    linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%),
    linear-gradient(45deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
  border: 2px solid ${props => props.isDealer ? 'rgba(220, 20, 60, 0.3)' : 'rgba(30, 144, 255, 0.3)'};
  box-shadow: 
    ${props => props.isDealer ? '0 8px 25px rgba(220, 20, 60, 0.1)' : '0 8px 25px rgba(30, 144, 255, 0.1)'},
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  color: ${props => props.color};
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  user-select: none;
`

const CardBack = styled.div<{ revealed: boolean; enableMotion?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  /* Use provided card back image */
  background-image: url('/png/images/card.png');
  background-repeat: no-repeat;
  background-size: cover; /* fill completely to avoid white borders */
  background-color: #2d1810; /* darker fallback to match card */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  padding: 6px;
  display: ${props => {
    if (props.enableMotion === false) {
      // In static mode, hide the back when revealed
      return props.revealed ? 'none' : 'flex';
    }
    return 'flex';
  }};
  align-items: center;
  justify-content: center;
  transform: rotateY(180deg);
  border: none; /* image includes its own frame */
  overflow: hidden; /* keep rounded corners clean */
`

const CardCorner = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
`

const TopLeft = styled(CardCorner)`
  top: 10px;
  left: 10px;
`

const BottomRight = styled(CardCorner)`
  bottom: 10px;
  right: 10px;
  transform: rotate(180deg);
`

const CardRank = styled.div`
  font-size: 16px;
  font-weight: 700;
  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.3),
    0 0 4px rgba(255, 255, 255, 0.1);
  line-height: 1;
  letter-spacing: -0.5px;
`

const CardSuit = styled.div`
  font-size: 14px;
  font-weight: 700;
  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.3),
    0 0 4px rgba(255, 255, 255, 0.1);
  line-height: 1;
  letter-spacing: -0.5px;
`

const SuitCenter = styled.div`
  font-size: 36px;
  opacity: 0.8;
  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.4),
    0 0 8px rgba(255, 255, 255, 0.2);
  font-weight: 800;
`

export const BlackjackCard: React.FC<BlackjackCardProps> = ({ 
  rank, 
  suit, 
  revealed = false,
  isDealer = false,
  onClick,
  enableMotion = true
}) => {
  const suitObj = SUITS[suit % 4]
  const rankStr = RANKS[rank % 13]

  return (
    <CardContainer revealed={revealed} enableMotion={enableMotion} onClick={onClick}>
      <CardFace color={suitObj.color} isDealer={isDealer}>
        <TopLeft>
          <CardRank>{rankStr}</CardRank>
          <CardSuit>{suitObj.symbol}</CardSuit>
        </TopLeft>
        <SuitCenter>{suitObj.symbol}</SuitCenter>
        <BottomRight>
          <CardRank>{rankStr}</CardRank>
          <CardSuit>{suitObj.symbol}</CardSuit>
        </BottomRight>
      </CardFace>
      <CardBack revealed={revealed} enableMotion={enableMotion} />
    </CardContainer>
  )
}
