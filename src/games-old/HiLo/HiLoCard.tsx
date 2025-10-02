import React from 'react'
import styled from 'styled-components'

const RANKS = [
  'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'
]

interface HiLoCardProps {
  rank: number // 0 = A, 1 = K, ..., 12 = 2
  revealed?: boolean
  small?: boolean
  logo?: string
  onClick?: () => void
  enableMotion?: boolean
  style?: React.CSSProperties
}

const CardContainer = styled.div<{ revealed: boolean; enableMotion?: boolean; small?: boolean }>`
  width: ${props => props.small ? '35px' : '100px'};
  height: ${props => props.small ? '49px' : '140px'};
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

const CardFace = styled.div<{ small?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  background: white;
  box-shadow: -5px 5px 10px 1px #0000003d;
  color: #333;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${props => props.small ? '4px' : '10px'};
  font-weight: bold;
  user-select: none;
`

const CardBack = styled.div<{ revealed: boolean; enableMotion?: boolean; small?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  /* Use provided card back image */
  background-image: url('/png/images/card.png');
  background-repeat: no-repeat;
  background-size: cover; /* fill completely to avoid white borders */
  background-color: #2d1810; /* darker fallback to match card */
  box-shadow: -5px 5px 10px 1px #0000003d;
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

const RankDisplay = styled.div<{ small?: boolean }>`
  font-size: ${props => props.small ? '12px' : '70px'};
  font-weight: bold;
  line-height: 1em;
  align-self: flex-start;
`

const SuitDisplay = styled.div<{ small?: boolean; logo?: string }>`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 50%;
  height: 50%;
  background-image: ${props => props.logo ? `url(${props.logo})` : 'none'};
  background-size: cover;
  background-repeat: no-repeat;
  transform: translate(0%, 0%);
  font-size: ${props => props.small ? '64px' : '128px'};
  opacity: 0.9;
`

export const HiLoCard: React.FC<HiLoCardProps> = ({ 
  rank, 
  revealed = true,
  small = false,
  logo,
  onClick,
  enableMotion = true,
  style
}) => {
  const rankStr = RANKS[rank % 13]

  return (
    <CardContainer 
      revealed={revealed} 
      enableMotion={enableMotion} 
      small={small}
      onClick={onClick}
      style={style}
    >
      <CardFace small={small}>
        <RankDisplay small={small} className="rank">{rankStr}</RankDisplay>
        <SuitDisplay small={small} logo={logo} className="suit" />
      </CardFace>
      <CardBack revealed={revealed} enableMotion={enableMotion} small={small} />
    </CardContainer>
  )
}
