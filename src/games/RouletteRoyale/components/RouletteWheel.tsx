import React from 'react'
import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
`

const WheelContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  flex-direction: column;
`

const WheelOuter = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
`

const Wheel = styled.div<{ $spinning?: boolean; $winningNumber?: number | null }>`
  width: 250px;
  height: 250px;
  border: 8px solid #ffd700;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #28a745 0deg 9.73deg,     /* 0 - Green */
    #dc3545 9.73deg 19.46deg,   /* 32 - Red */
    #343a40 19.46deg 29.19deg,  /* 15 - Black */
    #dc3545 29.19deg 38.92deg,  /* 19 - Red */
    #343a40 38.92deg 48.65deg,  /* 4 - Black */
    #dc3545 48.65deg 58.38deg,  /* 21 - Red */
    #343a40 58.38deg 68.11deg,  /* 2 - Black */
    #dc3545 68.11deg 77.84deg,  /* 25 - Red */
    #343a40 77.84deg 87.57deg,  /* 17 - Black */
    #dc3545 87.57deg 97.30deg,  /* 34 - Red */
    #343a40 97.30deg 107.03deg, /* 6 - Black */
    #dc3545 107.03deg 116.76deg, /* 27 - Red */
    #343a40 116.76deg 126.49deg, /* 13 - Black */
    #dc3545 126.49deg 136.22deg, /* 36 - Red */
    #343a40 136.22deg 145.95deg, /* 11 - Black */
    #dc3545 145.95deg 155.68deg, /* 30 - Red */
    #343a40 155.68deg 165.41deg, /* 8 - Black */
    #dc3545 165.41deg 175.14deg, /* 23 - Red */
    #343a40 175.14deg 184.87deg, /* 10 - Black */
    #dc3545 184.87deg 194.60deg, /* 5 - Red */
    #343a40 194.60deg 204.33deg, /* 24 - Black */
    #dc3545 204.33deg 214.06deg, /* 16 - Red */
    #343a40 214.06deg 223.79deg, /* 33 - Black */
    #dc3545 223.79deg 233.52deg, /* 1 - Red */
    #343a40 233.52deg 243.25deg, /* 20 - Black */
    #dc3545 243.25deg 252.98deg, /* 14 - Red */
    #343a40 252.98deg 262.71deg, /* 31 - Black */
    #dc3545 262.71deg 272.44deg, /* 9 - Red */
    #343a40 272.44deg 282.17deg, /* 22 - Black */
    #dc3545 282.17deg 291.90deg, /* 18 - Red */
    #343a40 291.90deg 301.63deg, /* 29 - Black */
    #dc3545 301.63deg 311.36deg, /* 7 - Red */
    #343a40 311.36deg 321.09deg, /* 28 - Black */
    #dc3545 321.09deg 330.82deg, /* 12 - Red */
    #343a40 330.82deg 340.55deg, /* 35 - Black */
    #dc3545 340.55deg 350.28deg, /* 3 - Red */
    #343a40 350.28deg 360deg     /* 26 - Black */
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: ${props => props.$spinning ? spin : 'none'} 3s ease-out;
  ${props => props.$winningNumber !== null && `animation: ${glow} 2s infinite;`}
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`

const WheelPointer = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid #ffd700;
  z-index: 10;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
`

const WheelCenter = styled.div<{ $winningNumber?: number | null }>`
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  border: 4px solid #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #000;
  font-size: 1.2rem;
  z-index: 5;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  ${props => props.$winningNumber !== null && `
    background: linear-gradient(45deg, #ff6b6b, #ffd700);
    animation: ${glow} 1s infinite;
  `}
`

const WinningDisplay = styled.div<{ $isWinning?: boolean }>`
  text-align: center;
  margin-top: 20px;
  font-size: 1.4rem;
  font-weight: bold;
  padding: 15px;
  border-radius: 12px;
  ${props => props.$isWinning ? `
    color: #ffd700;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 107, 107, 0.2));
    border: 2px solid #ffd700;
    animation: ${glow} 2s infinite;
  ` : `
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
  `}
`

const NumberLabel = styled.div<{ $number: number }>`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => 
    props.$number === 0 ? '#28a745' : 
    [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(props.$number) ? '#dc3545' : '#343a40'
  };
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
  ${props => {
    const angle = props.$number === 0 ? 0 : ((props.$number - 1) * 9.73) + 9.73;
    const radius = 95;
    const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
    const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
    return `
      top: 50%;
      left: 50%;
      transform: translate(calc(-50% + ${x}px), calc(-50% + ${y}px));
    `;
  }}
`

interface RouletteWheelProps {
  spinning?: boolean
  winningNumber?: number | null
  gamePhase?: string
}

// Roulette numbers in wheel order
const wheelNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26]

export default function RouletteWheel({ spinning = false, winningNumber = null, gamePhase = 'waiting' }: RouletteWheelProps) {
  const getWinningColor = (num: number | null): string => {
    if (num === null) return ''
    if (num === 0) return 'Green'
    const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]
    return redNumbers.includes(num) ? 'Red' : 'Black'
  }

  return (
    <WheelContainer>
      <WheelOuter>
        <WheelPointer />
        <Wheel $spinning={spinning} $winningNumber={winningNumber}>
          {/* Add number labels around the wheel */}
          {wheelNumbers.map((number, index) => (
            <NumberLabel key={number} $number={number}>
              {number}
            </NumberLabel>
          ))}
          <WheelCenter $winningNumber={winningNumber}>
            {winningNumber !== null ? winningNumber : spinning ? '🌟' : '🎲'}
          </WheelCenter>
        </Wheel>
      </WheelOuter>

      {winningNumber !== null && (
        <WinningDisplay $isWinning={true}>
          🎊 Winner: {winningNumber} ({getWinningColor(winningNumber)}) 🎊
        </WinningDisplay>
      )}

      {spinning && winningNumber === null && (
        <WinningDisplay>
          🌟 The wheel is spinning... 🌟
        </WinningDisplay>
      )}

      {!spinning && winningNumber === null && gamePhase === 'waiting' && (
        <WinningDisplay>
          🎯 Ready to spin! Place your bets.
        </WinningDisplay>
      )}
    </WheelContainer>
  )
}
