import React from 'react'
import { StyledGambaResultTiles } from './GambaResultTiles.styles.js'

interface GambaResultTilesProps {
  betArray: number[]
  resultIndex?: number
  isSpinning: boolean
}

export function GambaResultTiles({ betArray, resultIndex, isSpinning }: GambaResultTilesProps) {
  if (!betArray.length) return null

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
      <StyledGambaResultTiles>
        <div className="title">Gamba Result</div>
        <div className="tiles-container">
          {betArray.map((multiplier, index) => (
            <div 
              key={index}
              className={`tile ${
                !isSpinning && resultIndex === index ? 'selected' : ''
              } ${multiplier === 0 ? 'zero' : ''}`}
            >
              {multiplier === 0 ? '0' : `${multiplier}x`}
            </div>
          ))}
        </div>
      </StyledGambaResultTiles>
    </div>
  )
}
