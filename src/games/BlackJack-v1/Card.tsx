import React from 'react'
import styled from 'styled-components'

interface CardType {
  suit: string
  rank: string
}

interface CardProps {
  card: CardType
}

const StyledCard = styled.div`
  width: 80px;
  height: 112px;
  background: white;
  border-radius: 8px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  
  .card-rank {
    font-size: 16px;
    line-height: 1;
  }
  
  .card-suit {
    font-size: 20px;
    line-height: 1;
  }
  
  &.red {
    color: #dc2626;
  }
  
  &.black {
    color: #000;
  }
`

const TopLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const BottomRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  transform: rotate(180deg);
`

const CenterSuit = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
`

export function Card({ card }: CardProps) {
  const isRed = card.suit === '♥' || card.suit === '♦'
  const colorClass = isRed ? 'red' : 'black'
  
  return (
    <StyledCard className={colorClass}>
      <TopLeft>
        <div className="card-rank">{card.rank}</div>
        <div className="card-suit">{card.suit}</div>
      </TopLeft>
      
      <CenterSuit className="card-suit">
        {card.suit}
      </CenterSuit>
      
      <BottomRight>
        <div className="card-rank">{card.rank}</div>
        <div className="card-suit">{card.suit}</div>
      </BottomRight>
    </StyledCard>
  )
}

export default Card
