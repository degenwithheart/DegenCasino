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
  gap: 12px;
  padding: 16px;
  background: linear-gradient(145deg, #1a1a1a, #111);
  border-radius: 14px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.9);
  overflow-x: auto;
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  pointer-events: ${({ $disabled }) => $disabled ? 'none' : 'auto'};
  transition: opacity 0.3s ease;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(12%, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(24%, 1fr));
    grid-template-rows: repeat(12, auto);
    gap: 8px;
    padding: 12px;
  }
`

const StyledBetButton = styled.button<{ $highlighted: boolean; $color: string }>`
  width: 100%;
  height: 100%;
  min-height: 70px;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background: ${({ $color }) =>
    $color === 'red' ? 'linear-gradient(135deg, #ff4257, #d93247)' :
    $color === 'black' ? 'linear-gradient(135deg, #222, #111)' :
    'linear-gradient(135deg, #017b01, #004b00)'};
  color: #f0f0f0;
  font-weight: 600;
  font-size: 1.3rem;
  cursor: pointer;
  position: relative;
  user-select: none;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  box-shadow: ${({ $highlighted }) =>
    $highlighted ? '0 0 12px 3px rgba(100, 100, 255, 0.7)' : '0 4px 10px rgba(0, 0, 0, 0.6)'};

  &:hover,
  &:focus-visible {
    box-shadow: 0 0 18px 5px rgba(100, 100, 255, 0.9);
    outline: none;
  }

  & > div {
    margin-top: 6px;
    font-size: 1rem;
    font-weight: 700;
    opacity: 0.9;
    min-height: 1.2em; /* Keeps space consistent even when empty */
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 8px;
  }

  @media (max-width: 400px) {
    font-size: 0.95rem;
    padding: 6px;
  }
`

const ChipWrapper = styled.div`
  position: absolute;
  top: -12px;
  right: -12px;
  animation: ${fadeScale} 0.25s ease-out;
  pointer-events: none;
  z-index: 10;
  filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.7));

  /* Scale down chip on small devices */
  @media (max-width: 400px) {
    transform: scale(0.8);
    top: -6px;
    right: -6px;
  }

  /* Scale up chip on large screens */
  @media (min-width: 1200px) {
    transform: scale(1.3);
    top: -16px;
    right: -16px;
  }
`

const HoverOutline = styled.div<{ $highlighted: boolean }>`
  position: absolute;
  inset: 0;
  border-radius: 10px;
  pointer-events: none;
  transition: box-shadow 0.2s ease;
  box-shadow: ${({ $highlighted }) =>
    $highlighted ? '0 0 14px 4px rgba(100, 100, 255, 0.6)' : 'none'};
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
