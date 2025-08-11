import React from 'react'
import { NUM_SLOTS, NUM_ROWS } from './constants'
import { StyledWinningLine } from './WinningLine.styles'

interface WinningLineProps {
  winningPositions: number[]
  winningPayline: number[] | null
  isScatter: boolean
}

export function WinningLine({ winningPositions, winningPayline, isScatter }: WinningLineProps) {
  if (!winningPositions.length) return null

  // Convert position index to grid coordinates
  const getGridPosition = (index: number) => {
    const row = Math.floor(index / NUM_SLOTS)
    const col = index % NUM_SLOTS
    return { row, col }
  }

  if (isScatter) {
    // For scatter wins, highlight all winning positions with glow effect
    return (
      <StyledWinningLine>
        {winningPositions.map((position) => {
          const { row, col } = getGridPosition(position)
          return (
            <div
              key={position}
              className="scatter-highlight"
              style={{
                gridRow: row + 1,
                gridColumn: col + 1,
              }}
            />
          )
        })}
      </StyledWinningLine>
    )
  }

  if (winningPayline && winningPositions.length >= 3) {
    // For payline wins, draw a line connecting the positions
    const positions = winningPositions.map(getGridPosition)
    
    // Create SVG path
    const pathData = positions.reduce((path, pos, index) => {
      const x = (pos.col + 0.5) * (100 / NUM_SLOTS) // Center of column as percentage
      const y = (pos.row + 0.5) * (100 / NUM_ROWS)  // Center of row as percentage
      
      if (index === 0) {
        return `M ${x} ${y}`
      } else {
        return `${path} L ${x} ${y}`
      }
    }, '')

    return (
      <StyledWinningLine>
        <svg className="payline-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={pathData}
            stroke="#ffec63"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="winning-line"
          />
          {/* Add dots at each winning position */}
          {positions.map((pos, index) => (
            <circle
              key={index}
              cx={(pos.col + 0.5) * (100 / NUM_SLOTS)}
              cy={(pos.row + 0.5) * (100 / NUM_ROWS)}
              r="1.5"
              fill="#ffec63"
              className="winning-dot"
            />
          ))}
        </svg>
        
        {/* Highlight winning positions */}
        {winningPositions.map((position) => {
          const { row, col } = getGridPosition(position)
          return (
            <div
              key={position}
              className="payline-highlight"
              style={{
                gridRow: row + 1,
                gridColumn: col + 1,
              }}
            />
          )
        })}
      </StyledWinningLine>
    )
  }

  return null
}
