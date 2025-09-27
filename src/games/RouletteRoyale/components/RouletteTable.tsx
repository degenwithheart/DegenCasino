import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`

const TableContainer = styled.div`
  background: linear-gradient(135deg, #0f4c3a 0%, #1a5c4a 100%);
  border: 3px solid #ffd700;
  border-radius: 20px;
  padding: 20px;
  margin: 20px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  color: white;
  max-width: 100%;
  overflow-x: auto;
`

const NumberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  margin: 10px;
  flex: 1;
`

const NumberCell = styled.button<{ $color: 'red' | 'black' | 'green'; $hasBet?: boolean }>`
  width: 50px;
  height: 40px;
  border: 2px solid #ffd700;
  border-radius: 8px;
  background: ${props => 
    props.$color === 'red' ? '#dc3545' : 
    props.$color === 'black' ? '#343a40' : '#28a745'
  };
  color: white;
  font-weight: bold;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  position: relative;
  
  ${props => props.$hasBet && `
    animation: ${pulse} 1s infinite;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
  `}

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }

  &:disabled {
    opacity: 0.5;
  }
`

const BetArea = styled.button<{ $hasBet?: boolean }>`
  padding: 10px 20px;
  margin: 5px;
  border: 2px solid #ffd700;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-weight: bold;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  ${props => props.$hasBet && `
    animation: ${pulse} 1s infinite;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
  `}

  &:hover:not(:disabled) {
    background: rgba(255, 215, 0, 0.2);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
  }
`

const BetInfo = styled.div`
  position: absolute;
  top: 10px;
  right: 15px;
  background: rgba(0, 0, 0, 0.8);
  padding: 8px 12px;
  border-radius: 8px;
  color: #ffd700;
  font-size: 0.9rem;
`

interface RouletteTableProps {
  onBetPlaced?: (bet: { type: string; value: number | string; amount: number }) => void;
  gamePhase?: string;
  playerBets?: Array<{ type: string; value: number | string; amount: number }>;
  disabled?: boolean;
}

// Roulette number colors
const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
  if (num === 0) return 'green'
  const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]
  return redNumbers.includes(num) ? 'red' : 'black'
}

// Generate numbers 1-36 in roulette order
const rouletteNumbers = Array.from({ length: 36 }, (_, i) => i + 1)

export default function RouletteTable({ onBetPlaced, gamePhase = 'waiting', playerBets = [], disabled = false }: RouletteTableProps) {
  const [selectedBetAmount] = useState(1) // Default bet amount
  
  const handleNumberBet = (number: number) => {
    if (disabled || !onBetPlaced) return
    onBetPlaced({
      type: 'number',
      value: number,
      amount: selectedBetAmount
    })
  }

  const handleOutsideBet = (betType: string) => {
    if (disabled || !onBetPlaced) return
    onBetPlaced({
      type: 'outside',
      value: betType,
      amount: selectedBetAmount
    })
  }

  const hasBetOnNumber = (number: number) => {
    return playerBets.some(bet => bet.type === 'number' && bet.value === number)
  }

  const hasBetOnOutside = (betType: string) => {
    return playerBets.some(bet => bet.type === 'outside' && bet.value === betType)
  }

  const totalBetAmount = playerBets.reduce((sum, bet) => sum + bet.amount, 0)

  return (
    <TableContainer>
      <BetInfo>
        💰 Total Bets: {totalBetAmount} | Phase: {gamePhase}
      </BetInfo>
      
      {/* Left side: Zero and Numbers Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        {/* Zero */}
        <NumberCell
          $color="green"
          $hasBet={hasBetOnNumber(0)}
          disabled={disabled}
          onClick={() => handleNumberBet(0)}
          style={{ marginBottom: '10px', width: '60px', height: '50px' }}
        >
          0
        </NumberCell>

        {/* Numbers 1-36 */}
        <NumberGrid>
          {rouletteNumbers.map((number) => (
            <NumberCell
              key={number}
              $color={getNumberColor(number)}
              $hasBet={hasBetOnNumber(number)}
              disabled={disabled}
              onClick={() => handleNumberBet(number)}
            >
              {number}
            </NumberCell>
          ))}
        </NumberGrid>
      </div>

      {/* Outside Bets - Vertical on the right */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '5px', 
        marginLeft: '20px',
        alignSelf: 'stretch',
        justifyContent: 'center'
      }}>
        <BetArea
          $hasBet={hasBetOnOutside('red')}
          disabled={disabled}
          onClick={() => handleOutsideBet('red')}
        >
          🔴 Red
        </BetArea>
        <BetArea
          $hasBet={hasBetOnOutside('black')}
          disabled={disabled}
          onClick={() => handleOutsideBet('black')}
        >
          ⚫ Black
        </BetArea>
        <BetArea
          $hasBet={hasBetOnOutside('odd')}
          disabled={disabled}
          onClick={() => handleOutsideBet('odd')}
        >
          Odd
        </BetArea>
        <BetArea
          $hasBet={hasBetOnOutside('even')}
          disabled={disabled}
          onClick={() => handleOutsideBet('even')}
        >
          Even
        </BetArea>
        <BetArea
          $hasBet={hasBetOnOutside('1-18')}
          disabled={disabled}
          onClick={() => handleOutsideBet('1-18')}
        >
          1-18
        </BetArea>
        <BetArea
          $hasBet={hasBetOnOutside('19-36')}
          disabled={disabled}
          onClick={() => handleOutsideBet('19-36')}
        >
          19-36
        </BetArea>
      </div>

      {gamePhase === 'waiting' && (
        <div style={{ textAlign: 'center', marginTop: '15px', color: '#ffd700' }}>
          🎯 Place your bets! Click numbers or betting areas above.
        </div>
      )}

      {gamePhase === 'betting' && (
        <div style={{ textAlign: 'center', marginTop: '15px', color: '#ff6b6b' }}>
          ⏰ Betting time! Get your bets in now!
        </div>
      )}

      {gamePhase === 'spinning' && (
        <div style={{ textAlign: 'center', marginTop: '15px', color: '#ffd700' }}>
          🎰 No more bets! The wheel is spinning...
        </div>
      )}
    </TableContainer>
  )
}
