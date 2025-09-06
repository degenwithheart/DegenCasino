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

interface PokerCardProps {
  rank: number // 0 = A, 1 = K, ..., 12 = 2
  suit: number // 0 = ♠, 1 = ♥, 2 = ♦, 3 = ♣
  revealed?: boolean
  onClick?: () => void
  enableMotion?: boolean
}

const CardContainer = styled.div<{ revealed: boolean; enableMotion?: boolean }>`
  width: 130px;
  height: 200px;
  margin: 5px;
  border-radius: 8px;
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

const CardFace = styled.div<{ color: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px #0005;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 6px;
  color: ${props => props.color};
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  border: 2px solid ${props => props.color}33;
  user-select: none;
`

const CardBack = styled.div<{ revealed: boolean; enableMotion?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  /* Use provided card back image as the placeholder */
  background-image: url('/png/images/card.png');
  background-repeat: no-repeat;
  background-size: contain; /* fill completely to avoid white borders */
  background-color: #2d1810; /* darker fallback to match card */
  box-shadow: 0 2px 8px #0005;
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
  /* No extra overlays; the image is the full card back */
`

const RankTop = styled.span`
  align-self: flex-start;
  font-size: 16px;
`

const SuitCenter = styled.span`
  font-size: 28px;
`

const RankBottom = styled.span`
  align-self: flex-end;
  font-size: 14px;
  opacity: 0.7;
  transform: rotate(180deg);
`

export const PokerCard: React.FC<PokerCardProps> = ({ 
  rank, 
  suit, 
  revealed = false,
  onClick,
  enableMotion = true
}) => {
  const suitObj = SUITS[suit % 4]
  const rankStr = RANKS[rank % 13]

  return (
    <CardContainer revealed={revealed} enableMotion={enableMotion} onClick={onClick}>
      <CardFace color={suitObj.color}>
        <RankTop>{rankStr}</RankTop>
        <SuitCenter>{suitObj.symbol}</SuitCenter>
        <RankBottom>{rankStr}</RankBottom>
      </CardFace>
      <CardBack revealed={revealed} enableMotion={enableMotion} />
    </CardContainer>
  )
}
