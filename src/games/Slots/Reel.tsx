import React from 'react'
import { SLOT_ITEMS, SlotItem } from './constants'
import styled, { css, keyframes } from 'styled-components'

interface ReelProps {
  revealed: boolean
  good: boolean[]
  reelIndex: number
  items: SlotItem[]
  isSpinning: boolean
  enableMotion?: boolean // Add motion control
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

const StyledReel = styled.div<{$revealed: boolean, $isSpinning: boolean, $enableMotion: boolean}>`
  position: relative;
  width: 100%;
  height: 300px; /* Height for 2 slots */
  overflow: hidden;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  transform: none; /* Let parent container handle 3D transforms */
  transform-style: preserve-3d;
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.5),
    0 4px 15px rgba(0, 0, 0, 0.3);
`

const ReelStrip = styled.div<{$isSpinning: boolean, $reelIndex: number, $enableMotion: boolean}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: ${props => {
    if (!props.$enableMotion) {
      // In static mode, never show spinning strip
      return 0;
    }
    return props.$isSpinning ? 1 : 0;
  }};
  transition: ${props => props.$enableMotion ? 'opacity 0.3s ease' : 'none'};

  ${(props) => props.$isSpinning && props.$enableMotion && css`
    animation: ${props.$reelIndex === 1 ? continuousScrollDown : continuousScrollUp} 0.6s linear infinite;
    filter: blur(1px);
  `}
`

const SlotContainer = styled.div<{$good: boolean, $revealed: boolean, $position?: 'top' | 'bottom', $enableMotion: boolean}>`
  width: 100%;
  height: 150px; /* Fixed slot cell height */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0;
  /* Replace scale trick with simple opacity depth cue to avoid reflow/centering issues */
  ${(p) => p.$enableMotion && p.$position === 'top' && css`opacity: .88;`}
  ${(p) => p.$enableMotion && p.$position === 'bottom' && css`opacity: 1;`}

  ${(p) => p.$good && p.$revealed && p.$enableMotion && css`
    animation: slotWin 1.8s ease-in-out infinite alternate;
  `}
  ${(p) => p.$good && p.$revealed && !p.$enableMotion && css`filter: brightness(1.3) saturate(1.4);`}

  @keyframes slotWin {
    0% { filter: brightness(1) saturate(1); }
    100% { filter: brightness(1.3) saturate(1.4); }
  }

  & img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    filter: drop-shadow(0 6px 12px rgba(0,0,0,.4));
    border-radius: 12px;
    transition: ${p => p.$enableMotion ? 'filter .4s ease' : 'none'};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    ${(p) => p.$good && p.$revealed && css`filter: brightness(1.4) saturate(1.3) drop-shadow(0 0 20px rgba(255,215,0,.7));`}
  }
`

const SpinningSlotContainer = styled.div<{$good: boolean, $revealed: boolean, $enableMotion: boolean}>`
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
    transition: ${props => props.$enableMotion ? 'all 0.4s ease' : 'none'};
    display: block;
    /* Perfect centering */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

const FinalSlot = styled.div<{$good: boolean, $revealed: boolean, $enableMotion: boolean}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  opacity: ${props => {
    // When motion is disabled, always show the final slots
    if (!props.$enableMotion) {
      return 1;
    }
    // When motion is enabled, only show when revealed
    return props.$revealed ? 1 : 0;
  }};
  transform: ${props => {
    // When motion is disabled, no transform needed
    if (!props.$enableMotion) {
      return 'translateY(0px)';
    }
    // When motion is enabled, keep position stable but use opacity for reveal
    return 'translateY(0px)';
  }};
  transition: ${props => props.$enableMotion ? 'opacity 0.5s ease-out' : 'none'};
  z-index: 5;

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

export function Reel({ revealed, good, reelIndex, items, isSpinning, enableMotion = true }: ReelProps) {
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
    <StyledReel $revealed={revealed} $isSpinning={isSpinning} $enableMotion={enableMotion}>
      {/* Spinning strip with column-specific sequences */}
      <ReelStrip $isSpinning={isSpinning} $reelIndex={reelIndex} $enableMotion={enableMotion}>
        {spinItems.map((item, index) => (
          <SpinningSlotContainer key={index} $good={false} $revealed={false} $enableMotion={enableMotion}>
            <img src={item.image} alt="" />
          </SpinningSlotContainer>
        ))}
      </ReelStrip>

      {/* Final revealed slots */}
      <FinalSlot $good={false} $revealed={revealed} $enableMotion={enableMotion}>
        {items.map((item, slotIndex) => {
          const position = slotIndex === 0 ? 'top' : 'bottom'
          return (
            <SlotContainer 
              key={slotIndex} 
              $good={good[slotIndex]} 
              $revealed={revealed}
              $position={position}
              $enableMotion={enableMotion}
            >
              <img src={item.image} alt="" />
            </SlotContainer>
          )
        })}
      </FinalSlot>
    </StyledReel>
  )
}
