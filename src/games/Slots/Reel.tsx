import React from 'react'
import { SLOT_ITEMS, SlotItem } from './constants'
import { SLOTS_CONFIG } from '../rtpConfig'
import styled, { css, keyframes } from 'styled-components'

interface ReelProps {
  revealed: boolean
  good: boolean[]
  reelIndex: number
  items: SlotItem[]
  isSpinning: boolean
  enableMotion?: boolean // Add motion control
}

// Define specific sequences for each column to prevent matching top rows - using actual RTP config symbols
const COLUMN_SEQUENCES = {
  0: ['MYTHICAL', 'LEGENDARY', 'DGHRT', 'SOL', 'USDC', 'JUP', 'BONK', 'WOJAK'], // Column 1
  1: ['WOJAK', 'BONK', 'JUP', 'USDC', 'SOL', 'DGHRT', 'LEGENDARY', 'MYTHICAL'], // Column 2 (reverse)
  2: ['SOL', 'JUP', 'WOJAK', 'MYTHICAL', 'BONK', 'USDC', 'DGHRT', 'LEGENDARY'], // Column 3 (offset)
  3: ['LEGENDARY', 'USDC', 'WOJAK', 'JUP', 'MYTHICAL', 'BONK', 'SOL', 'DGHRT'], // Column 4 (rotated)
  4: ['BONK', 'DGHRT', 'MYTHICAL', 'WOJAK', 'JUP', 'LEGENDARY', 'SOL', 'USDC'], // Column 5 (shifted)
  5: ['USDC', 'MYTHICAL', 'BONK', 'LEGENDARY', 'WOJAK', 'SOL', 'JUP', 'DGHRT'], // Column 6 (mixed)
}

const continuousScrollUp = keyframes`
  0% {
    transform: translateY(-100px); /* Start position (1 slot height) */
  }
  100% {
    transform: translateY(-800px); /* Move up by height of 7 more slots (7 * 100px) */
  }
`

const continuousScrollDown = keyframes`
  0% {
    transform: translateY(-800px); /* Start position */
  }
  100% {
    transform: translateY(-100px); /* Move down by height of 7 more slots */
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
  width: 120px; /* Fixed width for 6-reel layout */
  height: 480px; /* Increased height for 4 slots at 120px each */
  overflow: hidden;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.4);
  transform: none; /* Let parent container handle 3D transforms */
  transform-style: preserve-3d;
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.5),
    0 4px 15px rgba(0, 0, 0, 0.3);

  /* DEBUG: Add visible border to see individual reels */
  border: 2px solid rgba(0, 255, 255, 0.8);

  /* Subtle highlight for the winning row (3rd row) */
  &::before {
    content: '';
    position: absolute;
    top: 240px; /* Position at 3rd row (2 * 120px) */
    left: 0;
    right: 0;
    height: 120px; /* Height of one slot */
    background: linear-gradient(90deg, 
      rgba(255, 215, 0, 0.1) 0%,
      rgba(255, 215, 0, 0.05) 50%,
      rgba(255, 215, 0, 0.1) 100%
    );
    pointer-events: none;
    z-index: 1;
    border-top: 1px solid rgba(255, 215, 0, 0.2);
    border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  }

  /* Responsive height adjustments for small screens */
  @media (max-width: 480px) {
    width: 80px;
    height: 320px; /* 4 slots at 80px each */
    border-radius: 6px;
    
    &::before {
      top: 160px; /* Adjust for smaller slots (2 * 80px) */
      height: 80px;
    }
  }

  @media (min-width: 481px) and (max-width: 640px) {
    width: 90px;
    height: 360px; /* 4 slots at 90px each */
    
    &::before {
      top: 180px; /* Adjust for smaller slots (2 * 90px) */
      height: 90px;
    }
  }

  @media (min-width: 641px) and (max-width: 768px) {
    width: 100px;
    height: 400px; /* 4 slots at 100px each */
    
    &::before {
      top: 200px; /* Adjust for smaller slots (2 * 100px) */
      height: 100px;
    }
  }
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
    animation: ${props.$reelIndex % 2 === 1 ? continuousScrollDown : continuousScrollUp} 0.6s linear infinite;
    filter: blur(1px);
  `}
`

const SlotContainer = styled.div<{$good: boolean, $revealed: boolean, $position?: 'top' | 'middle1' | 'middle2' | 'bottom', $enableMotion: boolean}>`
  width: 100%;
  height: 120px; /* Increased slot height for better visibility */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0;
  z-index: 2; /* Ensure slots appear above the winning row highlight */
  
  /* Responsive slot height adjustments */
  @media (max-width: 480px) {
    height: 80px; /* Smaller slots for very small screens */
  }

  @media (min-width: 481px) and (max-width: 640px) {
    height: 90px; /* Slightly smaller slots for small screens */
  }

  @media (min-width: 641px) and (max-width: 768px) {
    height: 100px; /* Medium slots for tablets */
  }

  ${(p) => p.$good && p.$revealed && p.$enableMotion && css`
    animation: slotWin 1.8s ease-in-out infinite alternate;
  `}
  ${(p) => p.$good && p.$revealed && !p.$enableMotion && css`filter: brightness(1.3) saturate(1.4);`}

  @keyframes slotWin {
    0% { filter: brightness(1) saturate(1); }
    100% { filter: brightness(1.3) saturate(1.4); }
  }

  & img {
    width: 100px; /* Larger images for better visibility */
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

    /* Responsive image sizing */
    @media (max-width: 480px) {
      width: 60px;
      height: 60px;
      border-radius: 8px;
    }

    @media (min-width: 481px) and (max-width: 640px) {
      width: 70px;
      height: 70px;
      border-radius: 10px;
    }

    @media (min-width: 641px) and (max-width: 768px) {
      width: 80px;
      height: 80px;
    }
  }
`

const SpinningSlotContainer = styled.div<{$good: boolean, $revealed: boolean, $enableMotion: boolean}>`
  width: 100%;
  height: 120px; /* Increased to match SlotContainer */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0;
  
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
    width: 100px; /* Increased size to match SlotContainer */
    height: 100px;
    object-fit: contain;
    object-position: center center;
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
    border-radius: 12px;
    transition: ${props => props.$enableMotion ? 'all 0.4s ease' : 'none'};
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    /* Responsive image sizing */
    @media (max-width: 480px) {
      width: 60px;
      height: 60px;
      border-radius: 8px;
    }

    @media (min-width: 481px) and (max-width: 640px) {
      width: 70px;
      height: 70px;
      border-radius: 10px;
    }

    @media (min-width: 641px) and (max-width: 768px) {
      width: 80px;
      height: 80px;
    }
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
    
    // Map symbol names to actual SlotItem objects using RTP config
    const sequenceItems = columnSequence.map(symbolName => {
      // Get the actual multiplier from RTP config symbols
      const symbolFromConfig = SLOTS_CONFIG.symbols.find(s => s.name === symbolName)
      if (!symbolFromConfig) {
        console.error('Symbol not found in config during spinning:', symbolName)
        return SLOT_ITEMS[0] // fallback to first item
      }
      
      // Find the corresponding SLOT_ITEM with the exact multiplier
      const slotItem = SLOT_ITEMS.find(item => Math.abs(item.multiplier - symbolFromConfig.multiplier) < 0.001)
      if (!slotItem) {
        console.error('SlotItem not found for multiplier during spinning:', symbolFromConfig.multiplier)
        return SLOT_ITEMS[0] // fallback to first item
      }
      
      return slotItem
    })
    
    // Create a longer sequence with NO REPEATING symbols for smooth spinning
    // Each sequence already has unique symbols, so we just extend it without duplicates
    const repeatedItems = []
    
    // Add the base sequence (8 unique symbols)
    repeatedItems.push(...sequenceItems)
    
    // Add two more copies for smooth looping during animation (24 total items)
    repeatedItems.push(...sequenceItems)
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
          // Determine position for each of the 4 slots
          const position = slotIndex === 0 ? 'top' : 
                          slotIndex === 1 ? 'middle1' : 
                          slotIndex === 2 ? 'middle2' : 'bottom'
          return (
            <SlotContainer 
              key={slotIndex} 
              $good={good[slotIndex]} 
              $revealed={revealed}
              $position={position}
              $enableMotion={enableMotion}
            >
              <img src={item?.image || SLOT_ITEMS[0].image} alt="" />
            </SlotContainer>
          )
        })}
      </FinalSlot>
    </StyledReel>
  )
}
