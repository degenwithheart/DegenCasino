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
  width: 180px;
  aspect-ratio: 1/1.3;
  position: relative;
  background: 
    linear-gradient(145deg, 
      rgba(25, 25, 35, 0.95) 0%,
      rgba(15, 15, 25, 0.98) 50%,
      rgba(20, 20, 30, 0.95) 100%
    );
  overflow: hidden;
  border-radius: 20px;
  border: 4px solid transparent;
  background-image: 
    linear-gradient(145deg, rgba(25, 25, 35, 0.95), rgba(20, 20, 30, 0.95)),
    linear-gradient(145deg, 
      rgba(147, 51, 234, 0.5) 0%,
      rgba(59, 130, 246, 0.4) 25%,
      rgba(255, 215, 0, 0.5) 50%,
      rgba(220, 38, 127, 0.4) 75%,
      rgba(147, 51, 234, 0.5) 100%
    );
  background-origin: border-box;
  background-clip: content-box, border-box;
  transition: all 0.3s ease;
  box-shadow: 
    0 12px 30px rgba(0, 0, 0, 0.5),
    0 6px 15px rgba(147, 51, 234, 0.2),
    inset 0 2px 0 rgba(255, 255, 255, 0.15),
    inset 0 -2px 0 rgba(0, 0, 0, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(
        circle at 30% 30%, 
        rgba(255, 255, 255, 0.12) 0%, 
        transparent 50%
      ),
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.08) 0%,
        transparent 50%,
        rgba(0, 0, 0, 0.15) 100%
      );
    border-radius: 16px;
    pointer-events: none;
  }

  ${(props) => props.$revealed && css`
    animation: slotReveal 0.5s ease-out;
    transform: scale(1.03);
    box-shadow: 
      0 15px 40px rgba(0, 0, 0, 0.6),
      0 8px 20px rgba(147, 51, 234, 0.3),
      inset 0 2px 0 rgba(255, 255, 255, 0.2);
  `}

  ${(props) => props.$good && css`
    animation: slotWin 1.8s ease-in-out infinite alternate;
    border-image: linear-gradient(
      45deg,
      rgba(255, 215, 0, 0.9) 0%,
      rgba(255, 140, 0, 0.7) 50%,
      rgba(255, 215, 0, 0.9) 100%
    ) 1;
    box-shadow: 
      0 0 40px rgba(255, 215, 0, 0.5),
      0 0 80px rgba(255, 215, 0, 0.3),
      0 15px 40px rgba(0, 0, 0, 0.6);
  `}

  @keyframes slotReveal {
    0% { 
      transform: scale(0.95) rotateY(-12deg);
      opacity: 0.8;
    }
    50% { 
      transform: scale(1.08) rotateY(6deg); 
    }
    100% { 
      transform: scale(1.03) rotateY(0deg);
      opacity: 1;
    }
  }

  @keyframes slotWin {
    0% { 
      transform: scale(1.03);
      filter: brightness(1) saturate(1);
    }
    100% { 
      transform: scale(1.06);
      filter: brightness(1.3) saturate(1.4);
    }
  }
`

const Revealed = styled.div<{$revealed: boolean, $good: boolean}>`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 25px;
  transition: opacity .3s ease, transform .5s cubic-bezier(0.18, 0.89, 0.32, 1.3);
  transform: translateY(-100%);
  opacity: 0;

  ${(props) => props.$revealed && css`
    opacity: 1;
    transform: translateY(0%);
    animation: ${reveal} cubic-bezier(0.18, 0.89, 0.32, 1.3) .5s;
  `}

  ${(props) => props.$good && css`
    & > img {
      animation: ${pulse} 2.5s .3s cubic-bezier(0.04, 1.14, 0.48, 1.63) infinite;
      filter: brightness(1.4) saturate(1.3);
      drop-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
    }
  `}

  & > img {
    transition: all 0.4s ease;
    border-radius: 12px;
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
    max-width: 100%;
    max-height: 100%;
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
