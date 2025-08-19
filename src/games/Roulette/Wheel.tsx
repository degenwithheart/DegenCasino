import React, { useEffect, useState } from 'react'
import { StyledAuthenticalRouletteWheel } from './Wheel.authentic.styles'

// Define the roulette wheel constants here since they're not in constants.ts
const RED_NUMBERS = [
  32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3,
]

const ROULETTE_NUMBERS = [
  32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26, 0,
]

const getColor = (number: number): string => {
  if (number === 0) return 'green'
  return RED_NUMBERS.includes(number) ? 'red' : 'black'
}

interface WheelProps {
  result: number | null
  onSpinComplete?: () => void
}

export function Wheel({ result, onSpinComplete }: WheelProps) {
  const [showResult, setShowResult] = React.useState(false)
  const [selectedNumber, setSelectedNumber] = React.useState<number | null>(null)
  const [resultColor, setResultColor] = React.useState<string>('red')
  const [resultNumber, setResultNumber] = React.useState<string>('00')
  const [message, setMessage] = React.useState<string>('Spinning...')

  React.useEffect(() => {
    if (result === null || result === undefined) return
    
    setShowResult(false)
    setMessage('Spinning...')

    // Reset ball position and force reflow for animation
    setTimeout(() => {
      setSelectedNumber(result)
      setResultNumber(result.toString())
      setResultColor(getColor(result))
      // Force reflow for ball centering
      const inner = document.querySelector('.inner') as HTMLElement
      if (inner) {
        inner.style.transition = 'none'
        inner.setAttribute('data-spinto', '')
        void inner.offsetWidth
        inner.style.transition = ''
      }
    }, 100)

    // Reveal result after spin duration (3s)
    setTimeout(() => {
      setShowResult(true)
      setMessage('Result!')
      
      // Call completion callback after showing result
      setTimeout(() => {
        onSpinComplete?.()
      }, 1500)
    }, 3000)
  }, [result, onSpinComplete])

  return (
    <StyledAuthenticalRouletteWheel>
      <div className="main">
        <div className="plate mx-auto" id="plate">
          <ul
            className={`inner ${showResult ? 'rest' : ''}`}
            data-spinto={selectedNumber?.toString()}
          >
            {ROULETTE_NUMBERS.map((number: number) => (
              <li key={number} className="number">
                <label>
                  <input type="radio" name="pit" value={number} disabled />
                  <span className="pit select-none">{number}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className={`data ${showResult ? 'reveal' : ''}`}>
            <div className="data-inner select-none">
              <div className="mask">{message}</div>
              <div className="result" style={{ backgroundColor: resultColor }}>
                <div className="result-number">{resultNumber}</div>
                <div className="result-color">{resultColor}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledAuthenticalRouletteWheel>
  )
}
