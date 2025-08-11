import React from 'react'
import { SLOT_ITEMS, SlotItem } from './constants'
import styled, { css, keyframes } from 'styled-components'
import { StyledSpinner } from './Slot.styles'

interface SlotProps {
  revealed:boolean
  good: boolean
  index: number
  item?: SlotItem
}

const reveal = keyframes`
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0%);
    opacity: 1;
  }
`

const pulse = keyframes`
  0%, 30% {
    transform: scale(1)
  }
  10% {
    transform: scale(1.3)
  }
`

const StyledSlot = styled.div<{$good: boolean, $revealed: boolean}>`
  width: 100%;
  aspect-ratio: 1/1;
  position: relative;
  background: linear-gradient(145deg, #2a2a3e, #1a1a2e);
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid #3d3d57;
  transition: all .3s ease;
  box-shadow: 
    inset 0 0 8px rgba(0,0,0,0.3),
    0 2px 4px rgba(0,0,0,0.2);
  
  /* Add symbol window effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg, 
      rgba(255,255,255,0.05) 0%, 
      transparent 20%, 
      transparent 80%, 
      rgba(0,0,0,0.1) 100%
    );
    border-radius: 5px;
    pointer-events: none;
    z-index: 1;
  }
  
  /* Winning symbol glow effect */
  ${(props) => props.$good && props.$revealed && css`
    border-color: #ffec63;
    box-shadow: 
      inset 0 0 8px rgba(0,0,0,0.3),
      0 2px 4px rgba(0,0,0,0.2),
      0 0 15px rgba(255,236,99,0.4),
      0 0 30px rgba(255,236,99,0.2);
    
    &::before {
      background: linear-gradient(
        135deg, 
        rgba(255,236,99,0.1) 0%, 
        transparent 20%, 
        transparent 80%, 
        rgba(255,236,99,0.05) 100%
      );
    }
  `}
  
  ${(props) => props.$revealed && css`
    animation: result-flash-2 ease .2s;
    animation-delay: .15s;
  `}
`

const Revealed = styled.div<{$revealed: boolean, $good: boolean}>`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 8px;
  transition: opacity .2s, transform .3s ease;
  transform: translateY(-100%);
  opacity: 0;
  z-index: 2;

  ${(props) => props.$revealed && css`
    opacity: 1;
    transform: translateY(0%);
    animation: ${reveal} cubic-bezier(0.18, 0.89, 0.32, 1.3) .25s;
  `}

  ${(props) => props.$good && css`
    & > img {
      animation: ${pulse} 2s .25s cubic-bezier(0.04, 1.14, 0.48, 1.63) infinite;
      filter: brightness(1.2) saturate(1.1);
    }
  `}

  & > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    transition: filter .3s ease;
  }
`

export function Slot({ revealed, good, item, index }: SlotProps) {
  const items = React.useMemo(() =>
    [...SLOT_ITEMS].sort(() => Math.random() - .5)
  , [],
  )
  return (
    <StyledSlot $good={good} $revealed={revealed}>
      <StyledSpinner data-spinning={!revealed}>
        {items.map((item, i) => (
          <div key={i}>
            <img className={'slotImage'} src={item.image} />
          </div>
        ))}
      </StyledSpinner>
      {item && (
        <>
          <Revealed
            className={'revealedSlot'}
            $revealed={revealed}
            $good={revealed && good}
          >
            <img
              className={'slotImage'}
              src={item.image}
              style={{ animationDelay: index * .25 + 's' }}
            />
          </Revealed>
        </>
      )}
    </StyledSlot>
  )
}
