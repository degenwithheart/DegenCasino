import React, { useCallback } from 'react'
import { tableLayout } from './constants'
import { addChips, getChips, hover, hovered, selectedChip } from './signals'
import { Chip } from './Chip'
import styled, { keyframes } from 'styled-components'

const fadeScale = keyframes`
  from {
    transform: scale(0.6);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`

const StyledTable = styled.div<{ $disabled?: boolean }>`
  display: grid;
  grid-template-rows: repeat(4, auto);
  gap: 2px;
  padding: 20px;
  background: 
    linear-gradient(145deg, #0d4a0d 0%, #1a5a1a 50%, #0d4a0d 100%),
    radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
  border-radius: 20px;
  border: 4px solid #8B4513;
  box-shadow: 
    0 0 0 2px #DAA520,
    0 8px 32px rgba(0, 0, 0, 0.9),
    inset 0 2px 4px rgba(255, 215, 0, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.3);
  overflow-x: auto;
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  pointer-events: ${({ $disabled }) => $disabled ? 'none' : 'auto'};
  transition: opacity 0.3s ease;
  position: relative;

  /* Felt texture overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 1px,
        rgba(255, 255, 255, 0.02) 1px,
        rgba(255, 255, 255, 0.02) 2px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 1px,
        rgba(0, 0, 0, 0.02) 1px,
        rgba(0, 0, 0, 0.02) 2px
      );
    border-radius: 16px;
    pointer-events: none;
  }

  /* Casino table edge lighting */
  &::after {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    background: linear-gradient(45deg, 
      #8B4513, #DAA520, #8B4513, #DAA520, 
      #8B4513, #DAA520, #8B4513, #DAA520
    );
    background-size: 20px 20px;
    border-radius: 24px;
    z-index: -1;
    animation: shimmer 3s linear infinite;
  }

  @keyframes shimmer {
    0% { background-position: 0 0; }
    100% { background-position: 20px 20px; }
  }

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #8B4513;
    border-radius: 4px;
    border: 1px solid #DAA520;
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(12%, 1fr));
    padding: 16px;
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(24%, 1fr));
    grid-template-rows: repeat(12, auto);
    gap: 1px;
    padding: 12px;
  }
`

const StyledBetButton = styled.button<{ $highlighted: boolean; $color: string }>`
  width: 100%;
  height: 100%;
  min-height: 70px;
  padding: 8px;
  border: 2px solid ${({ $color }) =>
    $color === 'red' ? '#8B0000' :
    $color === 'black' ? '#2F2F2F' :
    '#DAA520'};
  border-radius: 4px;
  background: ${({ $color }) =>
    $color === 'red' ? `
      linear-gradient(135deg, #CC0000 0%, #8B0000 50%, #660000 100%),
      radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)
    ` :
    $color === 'black' ? `
      linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #000000 100%),
      radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 70%)
    ` :
    `
      linear-gradient(135deg, #228B22 0%, #006400 50%, #004500 100%),
      radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 70%)
    `};
  color: #ffffff;
  font-weight: 700;
  font-size: 1.2rem;
  cursor: pointer;
  position: relative;
  user-select: none;
  transition: all 0.2s ease;
  text-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.8),
    0 0 4px rgba(0, 0, 0, 0.5);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* Casino table square styling */
  &::before {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    border-radius: 2px;
    background: ${({ $color }) =>
      $color === 'red' ? 'rgba(255, 255, 255, 0.1)' :
      $color === 'black' ? 'rgba(255, 255, 255, 0.05)' :
      'rgba(255, 255, 255, 0.08)'};
    pointer-events: none;
  }

  /* Inner shadow for depth */
  box-shadow: ${({ $highlighted }) =>
    $highlighted ? 
      '0 0 0 3px #FFD700, inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.4)' : 
      'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.4)'};

  &:hover,
  &:focus-visible {
    box-shadow: 
      0 0 0 2px #FFD700,
      inset 0 2px 4px rgba(0, 0, 0, 0.3),
      0 4px 12px rgba(0, 0, 0, 0.6);
    outline: none;
  }

  &:active {
    box-shadow: 
      0 0 0 2px #FFD700,
      inset 0 3px 6px rgba(0, 0, 0, 0.4),
      0 1px 2px rgba(0, 0, 0, 0.4);
  }

  /* Number styling for roulette squares */
  ${({ $color }) => $color === 'red' || $color === 'black' ? `
    font-family: 'Georgia', serif;
    font-weight: 900;
    font-size: 1.4rem;
    letter-spacing: 0.5px;
  ` : `
    font-family: 'Arial', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  `}

  & > div {
    margin-top: 4px;
    font-size: 0.8rem;
    font-weight: 600;
    opacity: 0.9;
    min-height: 1em;
    color: rgba(255, 255, 255, 0.8);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 6px;
    min-height: 60px;
  }

  @media (max-width: 400px) {
    font-size: 0.9rem;
    padding: 4px;
    min-height: 50px;
  }
`

const ChipWrapper = styled.div`
  position: absolute;
  top: -15px;
  right: -15px;
  animation: ${fadeScale} 0.3s ease-out;
  pointer-events: none;
  z-index: 10;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.8));

  /* Chip glow effect */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    z-index: -1;
  }

  /* Scale down chip on small devices */
  @media (max-width: 400px) {
    transform: scale(0.8);
    top: -8px;
    right: -8px;
  }

  /* Scale up chip on large screens */
  @media (min-width: 1200px) {
    transform: scale(1.2);
    top: -18px;
    right: -18px;
  }
`

const HoverOutline = styled.div<{ $highlighted: boolean }>`
  position: absolute;
  inset: -2px;
  border-radius: 6px;
  pointer-events: none;
  transition: all 0.2s ease;
  background: ${({ $highlighted }) =>
    $highlighted ? 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700)' : 'transparent'};
  opacity: ${({ $highlighted }) => $highlighted ? 0.6 : 0};
  animation: ${({ $highlighted }) => $highlighted ? 'pulse 1.5s infinite' : 'none'};
  
  &::before {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: 4px;
    background: ${({ $highlighted }) =>
      $highlighted ? 'rgba(255, 215, 0, 0.2)' : 'transparent'};
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
`

interface TableProps {
  disabled?: boolean
}

export function Table({ disabled = false }: TableProps) {
  const handleMouseEnter = useCallback((numbers: number[]) => {
    if (disabled) return
    hover(numbers)
  }, [disabled])

  const handleMouseLeave = useCallback(() => {
    if (disabled) return
    hover([])
  }, [disabled])

  const handleClick = useCallback((id: string) => {
    if (disabled) return
    addChips(id, selectedChip.value)
  }, [disabled])

  return (
    <StyledTable $disabled={disabled} role="grid" aria-label="Roulette betting table">
      {Object.entries(tableLayout).map(([id, square]) => {
        const chipAmount = getChips(id)
        const isHighlighted = square.numbers
          .filter((n): n is number => typeof n === 'number')
          .some((n) => hovered.value.includes(n))

        return (
          <div
            key={id}
            style={{
              gridRow: square.row,
              gridColumn: square.column,
              position: 'relative',
            }}
            role="gridcell"
            aria-label={`${square.label} betting area`}
          >
            <StyledBetButton
              $highlighted={isHighlighted && !disabled}
              $color={square.color ?? 'green'}
              onMouseEnter={() => handleMouseEnter(square.numbers.filter((n): n is number => typeof n === 'number'))}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(id)}
              disabled={disabled}
              aria-pressed={chipAmount > 0}
              tabIndex={disabled ? -1 : 0}
              style={{
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1
              }}
            >
              {square.label}
              <div>{chipAmount > 0 ? `x${chipAmount}` : ''}</div>
              <HoverOutline $highlighted={isHighlighted && !disabled} />
            </StyledBetButton>

            {chipAmount > 0 && (
              <ChipWrapper>
                <Chip value={chipAmount} />
              </ChipWrapper>
            )}
          </div>
        )
      })}
    </StyledTable>
  )
}
