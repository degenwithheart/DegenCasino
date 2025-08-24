import React from 'react'
import { SLOT_ITEMS, SlotItem } from './constants'
import styled, { css, keyframes } from 'styled-components'

interface ReelProps {
  revealed: boolean
  good: boolean[]
  reelIndex: number
  items: SlotItem[]
  isSpinning: boolean
}

// Define specific sequences for each column to prevent matching top rows
const COLUMN_SEQUENCES = {
  0: ['UNICORN', 'DGHRT', 'SOL', 'USDC', 'JUP', 'BONK', 'WOJAK'], // Column 1
  1: ['WOJAK', 'BONK', 'JUP', 'USDC', 'SOL', 'DGHRT', 'UNICORN'], // Column 2 (reverse)
  2: ['UNICORN', 'DGHRT', 'SOL', 'USDC', 'JUP', 'BONK', 'WOJAK'], // Column 3
}

const continuousScrollUp = keyframes`
  0% {
    transform: translateY(-150px); /* Start position */
  }
  100% {
    transform: translateY(-1200px); /* Move up by height of 7 more slots (7 * 150px) */
  }
`

const continuousScrollDown = keyframes`
  0% {
    transform: translateY(-1200px); /* Start position */
  }
  100% {
    transform: translateY(-150px); /* Move down by height of 7 more slots */
  }
`

const revealReel = keyframes`
  0% { 
    transform: rotateX(12deg) translateY(10px);
    opacity: 0.8;
  }
  100% { 
    transform: rotateX(12deg) translateY(0px);
    opacity: 1;
  }
`

const StyledReel = styled.div<{$revealed: boolean, $isSpinning: boolean}>`
  position: relative;
  width: 100%;
  height: 300px; /* Height for 2 slots */
  overflow: hidden;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  transform: rotateX(12deg); /* 3D perspective tilt */
  transform-style: preserve-3d;
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.5),
    0 4px 15px rgba(0, 0, 0, 0.3);
`

const ReelStrip = styled.div<{$isSpinning: boolean, $reelIndex: number}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: ${props => props.$isSpinning ? 1 : 0};
  transition: opacity 0.3s ease;

  ${(props) => props.$isSpinning && css`
    animation: ${props.$reelIndex === 1 ? continuousScrollDown : continuousScrollUp} 0.6s linear infinite;
    filter: blur(1px);
  `}
`

const SlotContainer = styled.div<{$good: boolean, $revealed: boolean, $position?: 'top' | 'bottom'}>`
  width: 100%;
  height: 150px; /* Height of one slot - aligned with reel height of 300px for 2 slots */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 4px; /* Reduced padding for better centering */
  
  /* Apply 3D perspective scaling - top symbols appear smaller (further away) */
  ${(props) => props.$position === 'top' && css`
    transform: scale(0.7) !important;
    transform-origin: center center;
    opacity: 0.85;
  `}
  
  ${(props) => props.$position === 'bottom' && css`
    transform: scale(1.0) !important;
    transform-origin: center center;
    opacity: 1.0;
  `}

  ${(props) => props.$good && props.$revealed && css`
    animation: slotWin 1.8s ease-in-out infinite alternate;
  `}

  @keyframes slotWin {
    0% { 
      filter: brightness(1) saturate(1);
    }
    100% { 
      filter: brightness(1.3) saturate(1.4);
    }
  }

  & img {
    width: 100px; /* Fixed size for all images */
    height: 100px; /* Fixed size for all images */
    object-fit: contain;
    object-position: center center; /* Ensure centered positioning */
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
    border-radius: 12px;
    transition: all 0.4s ease;
    display: block;
    /* Perfect centering */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    ${(props) => props.$good && props.$revealed && css`
      filter: brightness(1.4) saturate(1.3) drop-shadow(0 0 20px rgba(255, 215, 0, 0.7));
    `}
  }
`

const SpinningSlotContainer = styled.div<{$good: boolean, $revealed: boolean}>`
  width: 100%;
  height: 150px; /* Height of one slot */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0; /* Remove padding for perfect centering */
  
  /* During spinning, create transition effect based on vertical position */
  transform: scale(1.0);
  
  /* Apply scaling based on position in the reel strip */
  &:nth-child(even) {
    transform: scale(0.75); /* Smaller for "top" positions */
  }
  
  &:nth-child(odd) {
    transform: scale(1.0); /* Full size for "bottom" positions */
  }

  /* Add gradient divider line at the bottom of each slot */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 12.5%;
    width: 75%;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%,
      rgba(255, 215, 0, 0.8) 20%,
      rgba(147, 51, 234, 0.9) 50%,
      rgba(255, 215, 0, 0.8) 80%,
      transparent 100%
    );
    z-index: 10;
    pointer-events: none;
  }

  & img {
    width: 100px; /* Fixed size for all images */
    height: 100px; /* Fixed size for all images */
    object-fit: contain;
    object-position: center center; /* Ensure centered positioning */
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
    border-radius: 12px;
    transition: all 0.4s ease;
    display: block;
    /* Perfect centering */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

const FinalSlot = styled.div<{$good: boolean, $revealed: boolean}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease-out;
  z-index: 5;

  ${(props) => props.$revealed && css`
    opacity: 1;
    transform: translateY(0px);
  `}

  /* Add gradient line for idle/revealed state - positioned at center between two slots */
  &::after {
    content: '';
    position: absolute;
    top: 150px; /* Position at center between two 150px slots */
    left: 12.5%;
    width: 75%;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%,
      rgba(255, 215, 0, 0.8) 20%,
      rgba(147, 51, 234, 0.9) 50%,
      rgba(255, 215, 0, 0.8) 80%,
      transparent 100%
    );
    z-index: 10;
    pointer-events: none;
  }
`

export function Reel({ revealed, good, reelIndex, items, isSpinning }: ReelProps) {
  // Create column-specific symbol sequences for strategic gameplay
  const spinItems = React.useMemo(() => {
    const columnSequence = COLUMN_SEQUENCES[reelIndex as keyof typeof COLUMN_SEQUENCES] || COLUMN_SEQUENCES[0]
    
    // Map symbol names to actual SlotItem objects
    const sequenceItems = columnSequence.map(symbolName => {
      return SLOT_ITEMS.find(item => {
        // Find by matching multiplier (since we don't have direct name mapping)
        const symbolConfig = {
          'UNICORN': 50.0,
          'DGHRT': 20.0, 
          'SOL': 7.0,
          'USDC': 3.0,
          'JUP': 1.5,
          'BONK': 1.2,
          'WOJAK': 0
        }
        return item.multiplier === symbolConfig[symbolName as keyof typeof symbolConfig]
      }) || SLOT_ITEMS[0]
    })
    
    // Create a longer unique sequence to minimize visible duplicates during spinning
    const repeatedItems = []
    
    // First, add the base sequence
    repeatedItems.push(...sequenceItems)
    
    // Then add a shuffled version to create variation
    const shuffledSequence = [...sequenceItems].reverse() // Simple reverse for variation
    repeatedItems.push(...shuffledSequence)
    
    // Add the original sequence again for seamless looping
    repeatedItems.push(...sequenceItems)
    
    return repeatedItems
  }, [reelIndex])

  return (
    <StyledReel $revealed={revealed} $isSpinning={isSpinning}>
      {/* Spinning strip with column-specific sequences */}
      <ReelStrip $isSpinning={isSpinning} $reelIndex={reelIndex}>
        {spinItems.map((item, index) => (
          <SpinningSlotContainer key={index} $good={false} $revealed={false}>
            <img src={item.image} alt="" />
          </SpinningSlotContainer>
        ))}
      </ReelStrip>

      {/* Final revealed slots */}
      <FinalSlot $good={false} $revealed={revealed}>
        {items.map((item, slotIndex) => {
          const position = slotIndex === 0 ? 'top' : 'bottom'
          return (
            <SlotContainer 
              key={slotIndex} 
              $good={good[slotIndex]} 
              $revealed={revealed}
              $position={position}
            >
              <img src={item.image} alt="" />
            </SlotContainer>
          )
        })}
      </FinalSlot>
    </StyledReel>
  )
}
