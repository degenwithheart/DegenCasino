import React from 'react'
import styled, { keyframes, css } from 'styled-components'

const spin = keyframes`
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
`

interface RouletteWheelProps {
  spinning?: boolean
  winningNumber?: number | null
  gamePhase?: 'waiting' | 'betting' | 'spinning' | 'results'
  playerBets?: any[]
  gameResult?: any
}

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
`

const WheelContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  flex-direction: column;
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  
  /* Small tablets */
  @media (min-width: 480px) {
    padding: 15px;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    padding: 20px;
  }
`

const WheelOuter = styled.div`
  position: relative;
  width: min(280px, calc(100vw - 40px));
  height: min(280px, calc(100vw - 40px));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  
  /* Small tablets */
  @media (min-width: 480px) {
    width: min(320px, calc(100vw - 60px));
    height: min(320px, calc(100vw - 60px));
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    width: 350px;
    height: 350px;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    width: 400px;
    height: 400px;
  }
`

const Wheel = styled.div<{ $spinning?: boolean; $winningNumber?: number | null; $finalRotation?: number }>`
  width: min(280px, calc(100vw - 40px));
  height: min(280px, calc(100vw - 40px));
  border: 4px solid #8B4513;
  border-radius: 50%;
  
  /* Small tablets */
  @media (min-width: 480px) {
    width: min(320px, calc(100vw - 60px));
    height: min(320px, calc(100vw - 60px));
    border: 5px solid #8B4513;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    width: 350px;
    height: 350px;
    border: 6px solid #8B4513;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    width: 400px;
    height: 400px;
    border: 7px solid #8B4513;
  }
  background: 
    radial-gradient(circle at center, #654321 0%, #8B4513 30%, #A0522D 60%, #8B4513 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: 50% 50%;
  

  
  ${props => {
    if (props.$spinning && props.$winningNumber === null) {
      // Waiting for result - continuous spinning animation
      return css`
        animation: ${spin} 1s linear infinite;
        transform: translate(-50%, -50%) rotate(0deg);
      `;
    } else if (props.$spinning && props.$winningNumber !== null && props.$finalRotation !== undefined) {
      // Has winning number - animate from 0° to final position
      return css`
        transform: translate(-50%, -50%) rotate(${props.$finalRotation}deg);
        transition: transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        animation: none;
      `;
    } else if (!props.$spinning && props.$winningNumber !== null && props.$finalRotation !== undefined) {
      // Finished spinning - stay at final position
      return css`
        transform: translate(-50%, -50%) rotate(${props.$finalRotation}deg);
        transition: none;
        animation: none;
      `;
    } else {
      // Default position - green 0 at top
      return css`
        transform: translate(-50%, -50%) rotate(0deg);
        transition: none;
        animation: none;
      `;
    }
  }}
  box-shadow: 
    0 0 30px rgba(184, 134, 11, 0.6),
    0 0 60px rgba(184, 134, 11, 0.3),
    inset 0 0 30px rgba(0, 0, 0, 0.5);
  background-image: 
    radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
`

const WheelPointer = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 24px solid #ffd700;
  z-index: 15;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  
  /* Small tablets */
  @media (min-width: 480px) {
    top: -13px;
    border-left: 13px solid transparent;
    border-right: 13px solid transparent;
    border-top: 26px solid #ffd700;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    top: -15px;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-top: 30px solid #ffd700;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5));
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    top: -18px;
    border-left: 18px solid transparent;
    border-right: 18px solid transparent;
    border-top: 36px solid #ffd700;
  }
`

const GoldRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: 50% 50%;
  width: min(288px, calc(100vw - 32px));
  height: min(288px, calc(100vw - 32px));
  background: linear-gradient(45deg, #DAA520, #B8860B, #DAA520);
  border-radius: 50%;
  z-index: 0;
  
  /* Small tablets */
  @media (min-width: 480px) {
    width: min(330px, calc(100vw - 50px));
    height: min(330px, calc(100vw - 50px));
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    width: 362px;
    height: 362px;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    width: 414px;
    height: 414px;
  }
`

const GreenRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(180px, calc(100vw * 0.45));
  height: min(180px, calc(100vw * 0.45));
  border: 2px solid #DAA520;
  border-radius: 50%;
  background: linear-gradient(135deg, #228B22 0%, #32CD32 30%, #228B22 70%, #1F5F1F 100%);
  box-shadow: 
    inset 0 1px 2px rgba(255, 255, 255, 0.2),
    inset 0 -1px 2px rgba(0, 0, 0, 0.3),
    0 0 10px rgba(0, 0, 0, 0.3);
  z-index: -1;
  
  /* Small tablets */
  @media (min-width: 480px) {
    width: min(220px, calc(100vw * 0.5));
    height: min(220px, calc(100vw * 0.5));
    border: 3px solid #DAA520;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    width: 240px;
    height: 240px;
    box-shadow: 
      inset 0 2px 4px rgba(255, 255, 255, 0.2),
      inset 0 -2px 4px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(0, 0, 0, 0.3);
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    width: 280px;
    height: 280px;
  }
`

const WheelCenter = styled.div<{ $winningNumber?: number | null }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(60px, calc(100vw * 0.15));
  height: min(60px, calc(100vw * 0.15));
  
  /* Small tablets */
  @media (min-width: 480px) {
    width: min(70px, calc(100vw * 0.18));
    height: min(70px, calc(100vw * 0.18));
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    width: 80px;
    height: 80px;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    width: 90px;
    height: 90px;
  }
  background: 
    radial-gradient(ellipse at 30% 30%, #FFD700 0%, #DAA520 50%, #B8860B 100%);
  border: 4px solid #8B4513;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #000;
  font-size: 1.2rem;
  z-index: 10;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  ${props => props.$winningNumber !== null && css`
    background: 
      radial-gradient(ellipse at 30% 30%, #FF6B6B 0%, #E53935 50%, #C62828 100%);
    animation: ${glow} 1s infinite;
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.4),
      0 0 20px rgba(255, 107, 107, 0.6),
      inset 0 2px 4px rgba(255, 255, 255, 0.3);
  `}
`

const WinningDisplay = styled.div<{ $isWinning?: boolean }>`
  text-align: center;
  margin-top: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 10px 15px;
  border-radius: 8px;
  width: calc(100% - 20px);
  max-width: 300px;
  
  /* Small tablets */
  @media (min-width: 480px) {
    margin-top: 15px;
    font-size: 1.2rem;
    padding: 12px 18px;
    border-radius: 10px;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    margin-top: 20px;
    font-size: 1.4rem;
    padding: 15px;
    border-radius: 12px;
    width: auto;
    max-width: none;
  }
  ${props => props.$isWinning ? css`
    color: #ffd700;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 107, 107, 0.2));
    border: 2px solid #ffd700;
    animation: ${glow} 2s infinite;
  ` : css`
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
  `}
`

const WheelPocket = styled.div<{ $number: number; $angle: number }>`
  position: absolute;
  width: 18px;
  height: 28px;
  top: 50%;
  left: 50%;
  transform-origin: 50% 50%;
  transform: ${props => {
    const radius = 85; // Mobile default
    const x = Math.cos((props.$angle - 90) * Math.PI / 180) * radius;
    const y = Math.sin((props.$angle - 90) * Math.PI / 180) * radius;
    return `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${props.$angle}deg)`;
  }};
  
  /* Small tablets */
  @media (min-width: 480px) {
    width: 20px;
    height: 30px;
    transform: ${props => {
      const radius = 95;
      const x = Math.cos((props.$angle - 90) * Math.PI / 180) * radius;
      const y = Math.sin((props.$angle - 90) * Math.PI / 180) * radius;
      return `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${props.$angle}deg)`;
    }};
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    width: 22px;
    height: 32px;
    transform: ${props => {
      const radius = 105;
      const x = Math.cos((props.$angle - 90) * Math.PI / 180) * radius;
      const y = Math.sin((props.$angle - 90) * Math.PI / 180) * radius;
      return `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${props.$angle}deg)`;
    }};
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    width: 26px;
    height: 38px;
    transform: ${props => {
      const radius = 120;
      const x = Math.cos((props.$angle - 90) * Math.PI / 180) * radius;
      const y = Math.sin((props.$angle - 90) * Math.PI / 180) * radius;
      return `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${props.$angle}deg)`;
    }};
  }
  
  background: ${props => {
    if (props.$number === 0) {
      return 'linear-gradient(135deg, #228B22 0%, #32CD32 50%, #228B22 100%)';
    } else if ([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(props.$number)) {
      return 'linear-gradient(135deg, #DC143C 0%, #FF1744 50%, #DC143C 100%)';
    } else {
      return 'linear-gradient(135deg, #000000 0%, #2F2F2F 50%, #000000 100%)';
    }
  }};
  border: 1px solid #DAA520;
  border-radius: 4px;
  box-shadow: 
    inset 0 1px 2px rgba(255, 255, 255, 0.2),
    inset 0 -1px 2px rgba(0, 0, 0, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 5;
`

const PocketNumber = styled.div<{ $number: number; $angle: number }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.6rem;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.9), 0 0 1px rgba(0, 0, 0, 1);
  z-index: 100;
  pointer-events: none;
  transform: rotate(${props => -props.$angle}deg);
  
  /* Small tablets */
  @media (min-width: 480px) {
    font-size: 0.65rem;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    font-size: 0.7rem;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    font-size: 0.75rem;
  }
`

interface RouletteWheelProps {
  spinning?: boolean
  winningNumber?: number | null
  gamePhase?: 'waiting' | 'betting' | 'spinning' | 'results'
}

// Roulette numbers in wheel order (matching the visual conic-gradient layout)
const wheelNumbers = [
  0,  // 0-9.73° Green
  32, // 9.73-19.46° Red  
  15, // 19.46-29.19° Black
  19, // 29.19-38.92° Red
  4,  // 38.92-48.65° Black
  21, // 48.65-58.38° Red
  2,  // 58.38-68.11° Black
  25, // 68.11-77.84° Red
  17, // 77.84-87.57° Black
  34, // 87.57-97.30° Red
  6,  // 97.30-107.03° Black
  27, // 107.03-116.76° Red
  13, // 116.76-126.49° Black
  36, // 126.49-136.22° Red
  11, // 136.22-145.95° Black
  30, // 145.95-155.68° Red
  8,  // 155.68-165.41° Black
  23, // 165.41-175.14° Red
  10, // 175.14-184.87° Black
  5,  // 184.87-194.60° Red
  24, // 194.60-204.33° Black
  16, // 204.33-214.06° Red
  33, // 214.06-223.79° Black
  1,  // 223.79-233.52° Red
  20, // 233.52-243.25° Black
  14, // 243.25-252.98° Red
  31, // 252.98-262.71° Black
  9,  // 262.71-272.44° Red
  22, // 272.44-282.17° Black
  18, // 282.17-291.90° Red
  29, // 291.90-301.63° Black
  7,  // 301.63-311.36° Red
  28, // 311.36-321.09° Black
  12, // 321.09-330.82° Red
  35, // 330.82-340.55° Black
  3,  // 340.55-350.28° Red
  26  // 350.28-360° Black
]

export default function RouletteWheel({ spinning = false, winningNumber = null, gamePhase = 'waiting', playerBets = [], gameResult = null }: RouletteWheelProps) {
  console.log('🎡 RouletteWheel render:', { 
    spinning, 
    winningNumber, 
    gamePhase, 
    hasPlayerBets: playerBets.length > 0,
    playerBets: playerBets.map(bet => ({ type: bet.type, value: bet.value, player: bet.player?.slice(0,8) })),
    gameResult
  })
  
  // Use the real winning number from game results
  const debugWinningNumber = winningNumber
  
  // Calculate final rotation to position winning number at pointer (top)
  const getFinalRotation = (number: number | null): number => {
    if (number === null) {
      console.log('🎡 No winning number, returning 0 rotation')
      return 0
    }
    const index = wheelNumbers.indexOf(number)
    if (index === -1) {
      console.error('🎡 ❌ Number not found in wheel:', number, 'Available numbers:', wheelNumbers)
      return 0
    }
    
    console.log('🎡 Calculating rotation for number:', number, 'at index:', index)
    
    // Each segment is 360/37 = 9.729729... degrees (more precise)
    const segmentSize = 360 / 37
    
    // Calculate where this number is positioned on the wheel (center of segment)
    // Add a small offset correction to align with visual wheel
    const basePosition = index * segmentSize
    const segmentCenter = basePosition + (segmentSize / 2)
    
    // Fine-tune alignment - small adjustment based on visual inspection
    const alignmentOffset = 1.8 // degrees - fine-tuned for precise pointer alignment
    const numberPosition = segmentCenter - alignmentOffset // Subtract to shift clockwise
    
    console.log('🎯 PRECISE POSITIONING:', {
      number,
      index,
      basePosition: basePosition.toFixed(2) + '°',
      segmentCenter: segmentCenter.toFixed(2) + '°', 
      withOffset: numberPosition.toFixed(2) + '°',
      segmentSize: segmentSize.toFixed(3) + '°'
    })
    
    // Add multiple full rotations for realistic spinning effect
    // Start from 0 (green 0), add 5-7 full rotations, then land on target
    const extraRotations = 5 + Math.random() * 2 // 5-7 full rotations
    const fullRotations = Math.floor(extraRotations) * 360
    
    // Final position: start at 0°, spin multiple times, then to target position
    // Negative because wheel spins counter-clockwise to reach top position
    const totalRotation = -(fullRotations + numberPosition)
    
    console.log('🎡 FINAL CALCULATION:', {
      number,
      numberPosition: numberPosition.toFixed(1) + '°',
      fullRotations: fullRotations + '°',
      totalRotation: totalRotation.toFixed(1) + '°'
    })
    
    console.log('🎡 ✅ Final rotation:', totalRotation, 'degrees for number:', number)
    return totalRotation
  }

  const finalRotation = getFinalRotation(debugWinningNumber)
  console.log('🎡 Final rotation result:', finalRotation, 'for winning number:', debugWinningNumber)
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
        <GoldRing />
        <Wheel $spinning={spinning} $winningNumber={debugWinningNumber} $finalRotation={finalRotation}>
          <GreenRing />
          {/* Individual wheel pockets */}
          {wheelNumbers.map((number, index) => {
            const angle = index * (360 / 37); // 37 slots total (0-36)
            return (
              <WheelPocket key={number} $number={number} $angle={angle}>
                <PocketNumber $number={number} $angle={angle}>
                  {number}
                </PocketNumber>
              </WheelPocket>
            );
          })}
          <WheelCenter $winningNumber={winningNumber}>
            {winningNumber !== null ? winningNumber : spinning ? '🌟' : '🎲'}
          </WheelCenter>
        </Wheel>
      </WheelOuter>

      {/* {winningNumber !== null && (
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
      )} */}
    </WheelContainer>
  )
}
