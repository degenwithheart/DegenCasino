import React, { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { generateUsernameFromWallet } from '../../../utils/user/userProfileUtils'

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`

// Generate proper chip labels from player identifiers
function getChipLabel(playerKey: string, index: number): string {
  if (!playerKey || typeof playerKey !== 'string') return (index + 1).toString()
  
  // Generate username and take first 2 letters for chip display
  const username = generateUsernameFromWallet(playerKey)
  return username.slice(0, 2).toUpperCase()
}

// Format lamports to SOL for display
function formatBetAmount(amount: number): string {
  const solAmount = amount / LAMPORTS_PER_SOL
  // Show up to 3 decimal places, remove trailing zeros
  return solAmount.toFixed(3).replace(/\.?0+$/, '')
}

const TableContainer = styled.div`
  background: 
    radial-gradient(ellipse at center, 
      #1a5f1a 0%, 
      #0d4b0d 60%, 
      #0a3a0a 100%
    );
  border: 8px solid #c9b037;
  border-radius: 20px;
  box-shadow: 
    inset 0 0 50px rgba(255, 215, 0, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.7),
    0 0 80px rgba(255, 215, 0, 0.3);
  padding: clamp(15px, 3vw, 25px) clamp(20px, 4vw, 30px);
  margin: 0;
  width: calc(100% - clamp(40px, 8vw, 60px));
  margin-left: clamp(20px, 4vw, 30px);
  margin-right: clamp(20px, 4vw, 30px);
  max-height: 65vh;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700);
    border-radius: 24px;
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    padding: clamp(10px, 2.5vw, 15px);
    width: calc(100% - clamp(20px, 4vw, 30px));
    margin-left: clamp(10px, 2vw, 15px);
    margin-right: clamp(10px, 2vw, 15px);
    max-height: 55vh;
  }
`

const NumbersAndBetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(15px, 3vw, 25px);
  width: 100%;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: clamp(25px, 5vw, 40px);
    padding: 0 clamp(15px, 3vw, 25px);
  }
`

const NumbersSection = styled.div`
  @media (min-width: 768px) {
    flex: 1;
    max-width: 60%;
  }
`

const OutsideBeetsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(12px, 3vw, 18px);
  width: 100%;
  max-width: 400px;
  padding: clamp(8px, 2vw, 15px);
  align-content: flex-start;

  @media (min-width: 768px) {
    flex: 0 0 350px;
    max-width: 350px;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(15px, 2.5vw, 22px);
    padding: clamp(15px, 2.5vw, 25px);
    align-content: flex-start;
  }
`

const NumberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1px;
  margin: 5px;
  width: 100%;
  max-width: 300px;
  
  /* Small tablets */
  @media (min-width: 480px) {
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 2px;
    margin: 8px;
    max-width: 400px;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(3, 1fr);
    margin: 10px;
    flex: 1;
    max-width: none;
  }
`

const NumberCell = styled.button<{ $color: 'red' | 'black' | 'green'; $hasBet?: boolean }>`
  width: 100%;
  height: 30px;
  min-width: 25px;
  border: 2px solid ${props => 
    props.$color === 'red' ? '#8b0000' : 
    props.$color === 'black' ? '#1a1a1a' : '#004d00'
  };
  border-radius: 4px;
  
  /* Small tablets */
  @media (min-width: 480px) {
    height: 40px;
    border-radius: 5px;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    width: 50px;
    height: clamp(45px, 8vw, 55px);
    border: 3px solid ${props => 
      props.$color === 'red' ? '#8b0000' : 
      props.$color === 'black' ? '#1a1a1a' : '#004d00'
    };
    border-radius: 6px;
  }
  background: ${props => {
    if (props.$color === 'red') {
      return 'linear-gradient(135deg, #dc143c 0%, #b91c1c 50%, #991b1b 100%)';
    } else if (props.$color === 'black') {
      return 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 50%, #0d0d0d 100%)';
    } else {
      return 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)';
    }
  }};
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  
  ${props => props.$hasBet && css`
    animation: ${pulse} 1.5s infinite;
    box-shadow: 
      0 0 20px rgba(255, 215, 0, 0.8),
      0 3px 6px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  `}

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 12px rgba(0, 0, 0, 0.5),
      0 0 15px rgba(255, 215, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.4),
      inset 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    transform: none;
  }
`

const BetArea = styled.button<{ $hasBet?: boolean }>`
  padding: clamp(10px, 2vw, 16px) clamp(12px, 2.5vw, 18px);
  margin: 0;
  border: 2px solid #b8860b;
  border-radius: 8px;
  width: 100%;
  min-height: clamp(45px, 8vw, 55px);
  
  /* Small tablets */
  @media (min-width: 480px) {
    padding: 10px 16px;
    margin: 3px;
    border-radius: 7px;
    min-height: 45px;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    padding: 12px 20px;
    margin: 4px;
    border-radius: 8px;
    width: auto;
    min-height: auto;
  }
  background: 
    linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.9) 50%, rgba(0, 0, 0, 0.8) 100%),
    radial-gradient(ellipse at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  color: #ffd700;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 
    0 3px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 215, 0, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  
  ${props => props.$hasBet && css`
    animation: ${pulse} 1.5s infinite;
    background: 
      linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(184, 134, 11, 0.3) 50%, rgba(255, 215, 0, 0.2) 100%),
      radial-gradient(ellipse at center, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
    box-shadow: 
      0 0 20px rgba(255, 215, 0, 0.7),
      0 3px 8px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 215, 0, 0.3);
    border-color: #ffd700;
  `}

  &:hover:not(:disabled) {
    background: 
      linear-gradient(135deg, rgba(255, 215, 0, 0.25) 0%, rgba(184, 134, 11, 0.4) 50%, rgba(255, 215, 0, 0.25) 100%),
      radial-gradient(ellipse at center, rgba(255, 215, 0, 0.15) 0%, transparent 70%);
    transform: translateY(-1px);
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.5),
      0 0 15px rgba(255, 215, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
  }
`

const BetInfo = styled.div`
  position: relative;
  background: 
    linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 20, 0.95) 100%),
    radial-gradient(ellipse at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid #b8860b;
  color: #ffd700;
  font-size: 0.75rem;
  font-weight: bold;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 215, 0, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  width: 100%;
  text-align: center;
  
  /* Tablets and up */
  @media (min-width: 768px) {
    position: absolute;
    top: 12px;
    right: 18px;
    padding: 12px 18px;
    border-radius: 10px;
    font-size: 0.9rem;
    margin-bottom: 0;
    width: auto;
    text-align: left;
  }
`

const Chip = styled.div<{ $playerIndex: number }>`
  position: absolute;
  top: ${props => -8 - (props.$playerIndex * 3)}px;
  right: ${props => -8 - (props.$playerIndex * 3)}px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid ${props => {
    const borderColors = ['#8b0000', '#006400', '#191970', '#8b4513', '#800080', '#b8860b', '#2f4f4f', '#556b2f']
    return borderColors[props.$playerIndex % borderColors.length]
  }};
  background: ${props => {
    const colors = [
      'linear-gradient(135deg, #ff4757 0%, #c44569 100%)',  // Red
      'linear-gradient(135deg, #2ed573 0%, #1e90ff 100%)',  // Teal-Blue
      'linear-gradient(135deg, #3742fa 0%, #2f3542 100%)',  // Blue-Dark
      'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',  // Orange
      'linear-gradient(135deg, #9c88ff 0%, #8c7ae6 100%)',  // Purple
      'linear-gradient(135deg, #ffd700 0%, #daa520 100%)',  // Gold
      'linear-gradient(135deg, #70a1ff 0%, #5352ed 100%)',  // Light Blue
      'linear-gradient(135deg, #7bed9f 0%, #2ed573 100%)'   // Green
    ]
    return colors[props.$playerIndex % colors.length]
  }};
  color: white;
  font-size: 6px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${props => 10 + props.$playerIndex};
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  
  /* Small tablets */
  @media (min-width: 480px) {
    top: ${props => -9 - (props.$playerIndex * 4)}px;
    right: ${props => -9 - (props.$playerIndex * 4)}px;
    width: 20px;
    height: 20px;
    font-size: 7px;
    border: 2px solid ${props => {
      const borderColors = ['#8b0000', '#006400', '#191970', '#8b4513', '#800080', '#b8860b', '#2f4f4f', '#556b2f']
      return borderColors[props.$playerIndex % borderColors.length]
    }};
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    top: ${props => -10 - (props.$playerIndex * 5)}px;
    right: ${props => -10 - (props.$playerIndex * 5)}px;
    width: 24px;
    height: 24px;
    font-size: 8px;
    box-shadow: 
      0 3px 6px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    pointer-events: none;
    
    @media (min-width: 768px) {
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 2px;
    }
  }
`

interface RouletteTableProps {
  onBetPlaced?: (bet: { type: string; value: number | string; amount: number }) => void;
  gamePhase?: string;
  playerBets?: any[];
  disabled?: boolean;
  wagerAmount?: number;
}

// Roulette number colors
const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
  if (num === 0) return 'green'
  const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]
  return redNumbers.includes(num) ? 'red' : 'black'
}

// Generate numbers 1-36 in roulette order
const rouletteNumbers = Array.from({ length: 36 }, (_, i) => i + 1)

export default function RouletteTable({ onBetPlaced, gamePhase = 'waiting', playerBets = [], disabled = false, wagerAmount = 1 }: RouletteTableProps) {
  const selectedBetAmount = wagerAmount // Use the passed wager amount
  
  // Get player colors for chip display
  const getPlayerColor = (playerIndex: number): string => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98fb98', '#f4a460']
    return colors[playerIndex % colors.length]
  }
  
  // Get bets for a specific number/position
  const getBetsForPosition = (type: string, value: number | string) => {
    return playerBets.filter(bet => bet.type === type && bet.value === value)
  }
  
  const handleNumberBet = (number: number) => {
    if (disabled || !onBetPlaced) return
    onBetPlaced({
      type: 'number',
      value: number,
      amount: selectedBetAmount
    })
  }
  
  // Render chips on betting positions
  const renderChips = (type: string, value: number | string) => {
    const bets = getBetsForPosition(type, value)
    if (bets.length === 0) return null
    
    return (
      <div style={{
        position: 'absolute',
        top: '2px',
        right: '2px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1px',
        maxWidth: '30px'
      }}>
        {bets.map((bet, index) => {
          const playerIndex = bet.player ? bet.player.charCodeAt(0) % 8 : 0
          return (
            <div
              key={`${bet.player}-${index}`}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getPlayerColor(playerIndex),
                border: '1px solid white',
                fontSize: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}
              title={`Player ${bet.player?.slice(0, 8)}... bet ${formatBetAmount(bet.amount)} SOL`}
            >
              {bet.amount > 1 ? formatBetAmount(bet.amount) : ''}
            </div>
          )
        })}
      </div>
    )
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

  const getBetsOnNumber = (number: number) => {
    return playerBets.filter(bet => bet.type === 'number' && bet.value === number)
  }

  const getBetsOnOutside = (betType: string) => {
    return playerBets.filter(bet => bet.type === 'outside' && bet.value === betType)
  }

  const totalBetAmount = playerBets.reduce((sum, bet) => sum + bet.amount, 0)

  return (
    <TableContainer>
      {/* Main content area */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%', 
        alignItems: 'center',
        gap: '10px'
      }}>

        {/* Real Roulette Table Layout */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Top Section: Zero and Main Numbers Grid */}
          <div style={{
            display: 'flex',
            gap: '4px',
            justifyContent: 'center'
          }}>
            {/* Zero Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <NumberCell
                $color="green"
                $hasBet={hasBetOnNumber(0)}
                disabled={disabled}
                onClick={() => handleNumberBet(0)}
                style={{ 
                  height: '120px',
                  width: '40px',
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed'
                }}
              >
                0
                {getBetsOnNumber(0).slice(0, 4).map((bet, index) => (
                  <Chip key={`${bet?.player || 'unknown'}-${index}`} $playerIndex={index}>
                    {getChipLabel(bet?.player || 'unknown', index)}
                  </Chip>
                ))}
              </NumberCell>
            </div>

            {/* Main Numbers Grid (3 rows x 12 columns) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: '2px',
              flex: 1
            }}>
              {/* Row 1: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36 */}
              {[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].map((number) => {
                const betsOnNumber = getBetsOnNumber(number)
                return (
                  <NumberCell
                    key={number}
                    $color={getNumberColor(number)}
                    $hasBet={betsOnNumber.length > 0}
                    disabled={disabled}
                    onClick={() => handleNumberBet(number)}
                    style={{ height: '36px' }}
                  >
                    {number}
                    {betsOnNumber.slice(0, 4).map((bet, index) => (
                      <Chip key={`${bet?.player || 'unknown'}-${index}`} $playerIndex={index}>
                        {getChipLabel(bet?.player || 'unknown', index)}
                      </Chip>
                    ))}
                  </NumberCell>
                )
              })}
              {/* Row 2: 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35 */}
              {[2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].map((number) => {
                const betsOnNumber = getBetsOnNumber(number)
                return (
                  <NumberCell
                    key={number}
                    $color={getNumberColor(number)}
                    $hasBet={betsOnNumber.length > 0}
                    disabled={disabled}
                    onClick={() => handleNumberBet(number)}
                    style={{ height: '36px' }}
                  >
                    {number}
                    {betsOnNumber.slice(0, 4).map((bet, index) => (
                      <Chip key={`${bet?.player || 'unknown'}-${index}`} $playerIndex={index}>
                        {getChipLabel(bet?.player || 'unknown', index)}
                      </Chip>
                    ))}
                  </NumberCell>
                )
              })}
              {/* Row 3: 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34 */}
              {[1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].map((number) => {
                const betsOnNumber = getBetsOnNumber(number)
                return (
                  <NumberCell
                    key={number}
                    $color={getNumberColor(number)}
                    $hasBet={betsOnNumber.length > 0}
                    disabled={disabled}
                    onClick={() => handleNumberBet(number)}
                    style={{ height: '36px' }}
                  >
                    {number}
                    {betsOnNumber.slice(0, 4).map((bet, index) => (
                      <Chip key={`${bet?.player || 'unknown'}-${index}`} $playerIndex={index}>
                        {getChipLabel(bet?.player || 'unknown', index)}
                      </Chip>
                    ))}
                  </NumberCell>
                )
              })}
            </div>
          </div>

          {/* Bottom Section: Outside Bets */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '4px',
            marginTop: '8px'
          }}>
            <BetArea
              $hasBet={hasBetOnOutside('1-18')}
              disabled={disabled}
              onClick={() => handleOutsideBet('1-18')}
              style={{ gridColumn: 'span 2' }}
            >
              1-18
              {getBetsOnOutside('1-18').slice(0, 4).map((bet, index) => (
                <Chip key={`${bet?.player || 'unknown'}-${index}`} $playerIndex={index}>
                  {getChipLabel(bet?.player || 'unknown', index)}
                </Chip>
              ))}
            </BetArea>
            <BetArea
              $hasBet={hasBetOnOutside('even')}
              disabled={disabled}
              onClick={() => handleOutsideBet('even')}
            >
              Even
              {getBetsOnOutside('even').slice(0, 4).map((bet, index) => (
                <Chip key={`${bet?.player || 'unknown'}-${index}`} $playerIndex={index}>
                  {getChipLabel(bet?.player || 'unknown', index)}
                </Chip>
              ))}
            </BetArea>
            <BetArea
              $hasBet={hasBetOnOutside('red')}
              disabled={disabled}
              onClick={() => handleOutsideBet('red')}
            >
              🔴 Red
              {getBetsOnOutside('red').slice(0, 4).map((bet, index) => (
                <Chip key={`${bet?.player || 'unknown'}-${index}`} $playerIndex={index}>
                  {getChipLabel(bet?.player || 'unknown', index)}
                </Chip>
              ))}
            </BetArea>
            <BetArea
              $hasBet={hasBetOnOutside('black')}
              disabled={disabled}
              onClick={() => handleOutsideBet('black')}
            >
              ⚫ Black
              {getBetsOnOutside('black').slice(0, 4).map((bet, index) => (
                <Chip key={`${bet?.player || 'unknown'}-${index}`} $playerIndex={index}>
                  {getChipLabel(bet?.player || 'unknown', index)}
                </Chip>
              ))}
            </BetArea>
            <BetArea
              $hasBet={hasBetOnOutside('odd')}
              disabled={disabled}
              onClick={() => handleOutsideBet('odd')}
            >
              Odd
              {getBetsOnOutside('odd').slice(0, 4).map((bet, index) => (
                <Chip key={`${bet?.player || 'unknown'}-${index}`} $playerIndex={index}>
                  {getChipLabel(bet?.player || 'unknown', index)}
                </Chip>
              ))}
            </BetArea>
            <BetArea
              $hasBet={hasBetOnOutside('19-36')}
              disabled={disabled}
              onClick={() => handleOutsideBet('19-36')}
              style={{ gridColumn: 'span 2' }}
            >
              19-36
              {getBetsOnOutside('19-36').slice(0, 4).map((bet, index) => (
                <Chip key={`${bet?.player || 'unknown'}-${index}`} $playerIndex={index}>
                  {getChipLabel(bet?.player || 'unknown', index)}
                </Chip>
              ))}
            </BetArea>
          </div>
        </div>
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
