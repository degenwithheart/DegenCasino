// SliceWheel.tsx
import React, { useEffect, useRef, useState } from 'react'
// import { NUMBERS } from './constants'


const SLICE_COUNT = 8
const SLICE_LABELS = ['1','2','3','4','5','6','7','8']
// Classic red/black sequence for 8 pockets (alternating)
const SLICE_COLORS = ['red','black','red','black','red','black','red','black']

const SIZE = 320
const CENTER = SIZE / 2
const RADIUS = 140

// Default sizes (desktop)


export const NUMBERS = Array.from({ length: 37 }, (_, i) => i);

function SliceWheel({ winningNumber }: { winningNumber: number }) {
  const [showResult, setShowResult] = React.useState(false)
  const [selectedNumber, setSelectedNumber] = React.useState<number | null>(null)
  const [resultColor, setResultColor] = React.useState<string>('red')
  const [resultNumber, setResultNumber] = React.useState<string>('00')
  const [message, setMessage] = React.useState<string>('Place Your Bets')

  React.useEffect(() => {
    if (winningNumber === null || winningNumber === undefined) return
    setShowResult(false)
    setMessage('Spinning...')

    // Reset ball position and force reflow for animation
    setTimeout(() => {
      setSelectedNumber(winningNumber)
      setResultNumber(winningNumber.toString())
      setResultColor(getColor(winningNumber))
      // Force reflow for ball centering
      const inner = document.querySelector('.inner') as HTMLElement
      if (inner) {
        inner.style.transition = 'none'
        inner.setAttribute('data-spinto', '')
        void inner.offsetWidth
        inner.style.transition = ''
      }
    }, 50)

    // Reveal result after spin duration (3s)
    setTimeout(() => {
      setShowResult(true)
      setMessage('Result')
    }, 3000)
  }, [winningNumber])

  return (
    <div className="main">
      <div className="plate mx-auto" id="plate">
        <ul
          className={`inner ${showResult ? 'rest' : ''}`}
          data-spinto={selectedNumber?.toString()}
        >
          {NUMBERS.map((number: number) => (
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
  )
}

// You may want to implement getColor or import it from your constants
// For now, just return 'red' or 'black' alternating
function getColor(n: number): string {
  return n % 2 === 1 ? 'red' : 'black';
}

export default SliceWheel;