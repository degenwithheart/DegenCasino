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

const StyledSlot = styled.div<{$good: boolean, $revealed: boolean}>`
  width: 180px;
  aspect-ratio: 1/1.3;
  position: relative;
  background: transparent;
  overflow: hidden;
  border: none;
  border-radius: 0;
  transition: all 0.3s ease;
  box-shadow: none;

  ${(props) => props.$revealed && css`
    animation: slotReveal 0.5s ease-out;
    transform: scale(1.03);
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
`

const Revealed = styled.div<{$revealed: boolean, $good: boolean}>`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 8px;
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
  const items = React.useMemo(() => {
    // Deterministic order (no shuffle) for transparency
    return SLOT_ITEMS
  }, [])
  return (
    <StyledSlot $good={good} $revealed={revealed}>
      <StyledSpinner data-spinning={!revealed}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <img className={'slotImage'} src={item.image} style={{ display: 'block', margin: '0 auto' }} />
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
              style={{ animationDelay: index * .25 + 's', display: 'block', margin: '0 auto' }}
            />
          </Revealed>
        </>
      )}
    </StyledSlot>
  )
}
