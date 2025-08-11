import React from 'react'
import styled, { css } from 'styled-components'

const StyledChip = styled.div<{$color: string}>`
  width: 1.2rem;   /* ~19.2px */
  height: 1.2rem;
  line-height: 1.2rem;
  border-radius: 50%;
  background: var(--chip-color);
  border: 2px dashed var(--border-color);
  font-size: 0.65rem; /* ~10.4px */
  font-weight: 700;
  color: var(--text-color);
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.7),
    0 2px 6px rgba(0, 0, 0, 0.25);
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;

  ${(props) => props.$color === 'white' && css`
    --chip-color: #f0f0ff;
    --border-color: #8888C0;
    --text-color: #333333;
  `}
  ${(props) => props.$color === 'green' && css`
    --chip-color: linear-gradient(145deg, #47ff7d, #2eb84e);
    --border-color: #006600;
    --text-color: #004400;
  `}
  ${(props) => props.$color === 'red' && css`
    --chip-color: linear-gradient(145deg, #ff5b72, #d92e3a);
    --border-color: #ffffff;
    --text-color: #220000;
  `}
  ${(props) => props.$color === 'blue' && css`
    --chip-color: linear-gradient(145deg, #a692ff, #6d58ff);
    --border-color: #ffffff;
    --text-color: #000245;
  `}

  /* Responsive sizing */
  @media (max-width: 600px) {
    width: 1rem;
    height: 1rem;
    line-height: 1rem;
    font-size: 0.55rem;
    border-width: 1.5px;
  }

  @media (min-width: 1200px) {
    width: 1.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: 0.75rem;
    border-width: 2.5px;
  }
`

const color = (value: number) => {
  if (value === 0) return 'green'
  if (value === 1 || value === 2) return 'red'
  if (value <= 10) return 'blue'
  return 'white'
}

export function Chip({ value }: { value: number }) {
  return (
    <StyledChip $color={color(value)}>
      {value}
    </StyledChip>
  )
}
