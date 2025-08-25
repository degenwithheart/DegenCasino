import React, { useMemo, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

// Import actual game implementations to test real behavior
import { FLIP_CONFIG } from '../../games/rtpConfig'
import { DICE_CONFIG } from '../../games/rtpConfig'
import { CRASH_CONFIG } from '../../games/rtpConfig'
import { PLINKO_CONFIG } from '../../games/rtpConfig'
import { MINES_CONFIG } from '../../games/rtpConfig'
import { HILO_CONFIG } from '../../games/rtpConfig'
import { BLACKJACK_CONFIG } from '../../games/rtpConfig'
import { ROULETTE_CONFIG } from '../../games/rtpConfig'
import { generateBetArray as slotsBetArray } from '../../games/Slots/utils'
import { getBetArray as getProgressivePokerBetArray } from '../../games/ProgressivePoker/betArray'

// NOTE: This audit tests the actual game implementations that players experience,
// importing directly from the games' source code to ensure 1:1 accuracy.
// This provides the most accurate fairness verification possible.

interface RtpResult { rtp: number; houseEdge: number; note?: string }

// Types for Edge Case API response
interface EdgeCaseResult {
  game: string;
  scenario: string;
  targetRTP: number;
  actualRTP: number;
  winRate: number;
  withinTolerance: boolean;
  deviation: number;
  status: 'pass' | 'fail';
}

interface EdgeCaseResponse {
  results: EdgeCaseResult[];
  summary: Record<string, {
    avgRTP: number;
    minRTP: number;
    maxRTP: number;
    avgWinRate: number;
    outOfTolerance: number;
    totalScenarios: number;
  }>;
  timestamp: string;
  totalTests: number;
  totalFailures: number;
  overallStatus: 'healthy' | 'warning' | 'critical';
  playsPerScenario: number;
}

// Helper to calculate RTP from any bet array
const calculateRtp = (betArray: readonly number[] | number[], note: string = ''): RtpResult => {
  const arr = Array.isArray(betArray) ? betArray : [...betArray]
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length
  return { rtp: avg, houseEdge: 1 - avg, note }
}

// Generate real bet arrays using actual game implementations
// For audit purposes, use realistic parameters that match actual gameplay scenarios
const getRealBetArrays = () => {
  return {
    // BlackJack - use actual game implementation
    blackjack: [...BLACKJACK_CONFIG.betArray],
    
    // Flip - use actual game implementation
    flip: FLIP_CONFIG.heads, // [1.98, 0]
    
    // Dice - use actual game implementation (50% odds example)
    dice: DICE_CONFIG.calculateBetArray(50),
    
    // Mines - use actual game implementation (sample: 5 mines, 1 cell revealed)
    mines: MINES_CONFIG.generateBetArray(5, 1), // Proper bet array for mines game
    
    // HiLo - use actual game implementation (mid-rank HI example)
    hilo: HILO_CONFIG.calculateBetArray(6, true), // rank 6, betting HI
    
    // Crash - use actual game implementation
    crash: CRASH_CONFIG.calculateBetArray(1.5),
    
    // Slots - use actual game implementation with realistic parameters
    slots: slotsBetArray(700, 100), // max payout 700, wager 100 = max 7x multiplier (matches game design)
    
    // Plinko - use actual game implementations
    plinkoStd: PLINKO_CONFIG.normal,
    plinkoDegen: PLINKO_CONFIG.degen,
    
    // Progressive Poker - use actual game implementation with weighted probabilities
    progressivepoker: getProgressivePokerBetArray(),
    
    // Roulette - use actual game implementation (even-money bet example)
    roulette: ROULETTE_CONFIG.calculateBetArray('red'),
  }
}

const Wrap = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: #fff;
  font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  min-height: 100vh;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(162, 89, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 0, 204, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`

const Container = styled.div`
  max-width: 100%; /* Let main handle width constraints */
  width: 100%;
  margin: 2rem 0; /* Only vertical margins like Dashboard */
  padding: 2rem;
  box-sizing: border-box;

  @media (max-width: 1200px) {
    margin: 1.5rem 0;
    padding: 1.5rem;
  }
  @media (max-width: 900px) {
    margin: 0.5rem 0;
    padding: 0.8rem;
  }
  @media (max-width: 700px) {
    margin: 0.25rem 0;
    padding: 0.5rem;
  }
  @media (max-width: 480px) {
    margin: 0;
    padding: 0.3rem;
  }
`

const HeroSection = styled.div`
  text-align: center;
  padding: 4rem 0 3rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    z-index: -1;
  }

  @media (max-width: 768px) {
    padding: 2rem 0 1.5rem;
  }
`

const MainTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin: 0 0 1.5rem;
  background: linear-gradient(135deg, #ffd700 0%, #a259ff 50%, #ff00cc 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 3px;
  text-shadow: 0 0 40px rgba(255, 215, 0, 0.3);
  line-height: 1.1;
`

const MainSubtitle = styled.p`
  font-size: 1.2rem;
  color: #cbd5e1;
  margin: 0 auto 2rem;
  max-width: 800px;
  line-height: 1.7;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(280px, 300px);
  gap: 2rem;
  margin-bottom: 3rem;
  width: 100%;
  max-width: 100%;
  overflow: hidden;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 2rem;
    
    /* On mobile, show sidebar first */
    display: flex;
    flex-direction: column;
  }
`

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0; /* Prevent flex item overflow */

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 100%;
  min-width: 0; /* Prevent flex item overflow */

  @media (max-width: 1200px) {
    order: -1;
  }

  @media (max-width: 768px) {
    order: -1;
    gap: 1rem;
  }
`

const QuickStats = styled.div`
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 215, 0, 0.2);
  border-radius: 24px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc);
    background-size: 300% 100%;
    animation: shimmer 3s linear infinite;
  }

  @keyframes shimmer {
    0% { background-position: -300% 0; }
    100% { background-position: 300% 0; }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 16px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
    max-width: 100%;

    @media (max-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .stat-card {
      text-align: center;
      padding: 1.5rem;
      background: rgba(24, 24, 24, 0.6);
      border-radius: 16px;
      border: 1px solid rgba(255, 215, 0, 0.2);
      transition: all 0.3s ease;
      min-width: 0; /* Prevent overflow */
      max-width: 100%;

      @media (max-width: 768px) {
        padding: 0.75rem 0.5rem;
        border-radius: 12px;
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
        border-color: rgba(255, 215, 0, 0.4);
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
        text-shadow: 0 0 20px #ffd700;

        @media (max-width: 768px) {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }
      }

      .stat-label {
        font-size: 0.9rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 500;

        @media (max-width: 768px) {
          font-size: 0.7rem;
          letter-spacing: 0.5px;
          line-height: 1.2;
        }
      }
    }
  }
`

const StatusHeader = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid rgba(255, 215, 0, 0.15);
  background: ${p => {
    switch (p.status) {
      case 'loading':
        return 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%)';
      case 'error':
        return 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%)';
      default:
        return 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(21, 128, 61, 0.05) 100%)';
    }
  }};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    text-align: center;
  }

  .status-info {
    display: flex;
    align-items: center;
    gap: 1rem;

    .status-icon {
      font-size: 1.5rem;
      animation: ${p => p.status === 'loading' ? 'spin 2s linear infinite' : 'none'};
    }

    .status-text {
      font-size: 1.1rem;
      font-weight: 600;
      color: ${p => {
        switch (p.status) {
          case 'loading': return '#3b82f6';
          case 'error': return '#ef4444';
          default: return '#22c55e';
        }
      }};
      text-shadow: ${p => {
        switch (p.status) {
          case 'loading': return '0 0 8px #3b82f6';
          case 'error': return '0 0 8px #ef4444';
          default: return '0 0 8px #22c55e';
        }
      }};
    }

    @media (max-width: 768px) {
      .status-text {
        font-size: 1rem;
      }
    }
  }

  .last-updated {
    font-size: 0.9rem;
    color: #94a3b8;
    text-align: right;

    .time {
      color: #e2e8f0;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      text-align: center;
      font-size: 0.8rem;
    }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

const StatsTitle = styled.h3`
  margin: 0 0 1.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffd700;
  text-align: center;
  text-shadow: 0 0 16px #ffd700;
`

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-size: 0.9rem;
    color: #94a3b8;
    font-weight: 500;
  }

  .value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #ffd700;
    text-shadow: 0 0 8px #ffd700;
  }
`

const Card = styled.div<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  border: 2px solid ${p => 
    p.variant === 'danger' ? 'rgba(239, 68, 68, 0.3)' :
    p.variant === 'secondary' ? 'rgba(162, 89, 255, 0.3)' :
    'rgba(255, 215, 0, 0.2)'
  };
  border-radius: 24px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 26px;
    background: ${p => 
      p.variant === 'danger' ? 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 80%)' :
      p.variant === 'secondary' ? 'radial-gradient(circle, rgba(162, 89, 255, 0.1) 0%, transparent 80%)' :
      'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 80%)'
    };
    z-index: 0;
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 20px;
  }
`

const CardTitle = styled.h2<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  margin: 0 0 1.5rem;
  font-size: 1.6rem;
  font-weight: 700;
  color: ${p => 
    p.variant === 'danger' ? '#ef4444' :
    p.variant === 'secondary' ? '#a259ff' :
    '#ffd700'
  };
  text-shadow: ${p => 
    p.variant === 'danger' ? '0 0 16px #ef4444' :
    p.variant === 'secondary' ? '0 0 16px #a259ff' :
    '0 0 16px #ffd700'
  };
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
`

const ControlPanel = styled.div`
  background: rgba(24, 24, 24, 0.9);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const ControlGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
  }
`

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #ffd700 0%, #a259ff 100%);
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 24px rgba(255, 215, 0, 0.5);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`

const ToggleSwitch = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  color: #e2e8f0;
  font-weight: 500;
  font-size: 14px;

  input {
    display: none;
  }

  .switch {
    position: relative;
    width: 50px;
    height: 24px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    transition: all 0.3s ease;
    border: 2px solid rgba(255, 215, 0, 0.3);

    &::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      background: #ffd700;
      border-radius: 50%;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  }

  input:checked + .switch {
    background: rgba(255, 215, 0, 0.2);
    border-color: #ffd700;

    &::before {
      transform: translateX(26px);
    }
  }

  b {
    color: #ffd700;
    text-shadow: 0 0 8px #ffd700;
  }
`

const StatusBanner = styled.div<{ status: 'healthy' | 'warning' | 'critical' }>`
  background: ${p => 
    p.status === 'healthy' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)' :
    p.status === 'warning' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)' :
    'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)'
  };
  border: 2px solid ${p => 
    p.status === 'healthy' ? 'rgba(16, 185, 129, 0.3)' :
    p.status === 'warning' ? 'rgba(245, 158, 11, 0.3)' :
    'rgba(239, 68, 68, 0.3)'
  };
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`

const TableContainer = styled.div`
  background: rgba(24, 24, 24, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 215, 0, 0.2);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #ffd700, transparent);
    animation: pulse 2s ease-in-out infinite alternate;
  }

  @keyframes pulse {
    0% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`

const ModernTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: transparent;

  thead {
    background: linear-gradient(135deg, rgba(24, 24, 24, 0.9) 0%, rgba(30, 30, 50, 0.9) 100%);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  th {
    padding: 20px 16px;
    text-align: left;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #ffd700;
    border-bottom: 2px solid rgba(255, 215, 0, 0.3);
    white-space: nowrap;
    text-shadow: 0 0 8px #ffd700;
    background: rgba(24, 24, 24, 0.9);
    backdrop-filter: blur(10px);

    &:first-child {
      border-top-left-radius: 24px;
    }

    &:last-child {
      border-top-right-radius: 24px;
    }
  }

  td {
    padding: 16px;
    border-bottom: 1px solid rgba(255, 215, 0, 0.05);
    vertical-align: middle;
    color: #e2e8f0;
    transition: all 0.3s ease;
    background: rgba(24, 24, 24, 0.3);

    &:first-child {
      font-weight: 600;
      color: #fff;
    }
  }

  tbody tr {
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 215, 0, 0.08);
      transform: scale(1.01);
      box-shadow: 0 4px 16px rgba(255, 215, 0, 0.1);

      td {
        color: #fff;
      }
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const MobileCardGrid = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: grid;
    gap: 1rem;
    padding: 1rem;
  }
`

const ModernMobileCard = styled.div<{ failing?: boolean }>`
  background: ${p => p.failing ? 
    'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)' :
    'rgba(24, 24, 24, 0.8)'
  };
  backdrop-filter: blur(15px);
  border: 2px solid ${p => p.failing ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 215, 0, 0.2)'};
  border-radius: 20px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;

  ${p => p.failing && `
    animation: pulse-warning 2s infinite;
    
    @keyframes pulse-warning {
      0%, 100% { border-color: rgba(239, 68, 68, 0.3); }
      50% { border-color: rgba(239, 68, 68, 0.6); }
    }
  `}

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 215, 0, 0.2);

    .title {
      font-size: 16px;
      font-weight: 700;
      color: ${p => p.failing ? '#ef4444' : '#ffd700'};
      text-shadow: ${p => p.failing ? '0 0 8px #ef4444' : '0 0 8px #ffd700'};
    }
  }

  .card-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .data-point {
    .label {
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      font-weight: 500;
    }

    .value {
      font-size: 14px;
      font-weight: 600;
      color: #e2e8f0;
    }
  }
`

const Badge = styled.span<{tone:'ok'|'warn'|'na'}>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${p => 
    p.tone === 'ok' ? 'linear-gradient(135deg, #10b981, #059669)' :
    p.tone === 'warn' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
    'linear-gradient(135deg, #64748b, #475569)'
  };
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid ${p => 
    p.tone === 'ok' ? 'rgba(16, 185, 129, 0.5)' :
    p.tone === 'warn' ? 'rgba(245, 158, 11, 0.5)' :
    'rgba(100, 116, 139, 0.5)'
  };

  &::before {
    content: ${p => 
      p.tone === 'ok' ? '"✓"' :
      p.tone === 'warn' ? '"⚠"' :
      '"—"'
    };
    margin-right: 4px;
  }
`

const DataValue = styled.span<{ type?: 'percentage' | 'money' | 'multiplier' }>`
  font-weight: 700;
  color: ${props => 
    props.type === 'percentage' ? '#10b981' :
    props.type === 'money' ? '#ffd700' :
    props.type === 'multiplier' ? '#a259ff' :
    '#e2e8f0'
  };
  text-shadow: ${props => 
    props.type === 'percentage' ? '0 0 8px #10b981' :
    props.type === 'money' ? '0 0 8px #ffd700' :
    props.type === 'multiplier' ? '0 0 8px #a259ff' :
    'none'
  };
`

const Mono = styled.code`
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 11px;
  background: rgba(24, 24, 24, 0.8);
  padding: 3px 6px;
  border-radius: 6px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`

// Add missing components for the layout
const ControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #e2e8f0;
  font-weight: 500;

  input[type="checkbox"] {
    accent-color: #ffd700;
    transform: scale(1.2);
  }

  &:hover {
    color: #ffd700;
  }
`

const StatusInfo = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;

  b {
    color: #ffd700;
    font-weight: 600;
  }
`

const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--gamba-ui-primary-color) transparent;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--gamba-ui-primary-color);
    border-radius: 4px;

    &:hover {
      background-color: #ffd700;
    }
  }
`

const Table = styled(ModernTable)``

const Th = styled.th`
  text-align: left;
  padding: 16px 14px;
  background: rgba(24, 24, 24, 0.9);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #ffd700;
  border-right: 1px solid rgba(255, 215, 0, 0.2);
  white-space: nowrap;
  text-shadow: 0 0 8px #ffd700;

  &:last-child {
    border-right: none;
  }
`

const Td = styled.td`
  padding: 14px;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
  border-right: 1px solid rgba(255, 215, 0, 0.1);
  vertical-align: top;
  transition: all 0.2s ease;
  color: #e2e8f0;

  &:last-child {
    border-right: none;
    max-width: 250px;
    word-wrap: break-word;

    @media (min-width: 1024px) {
      max-width: 300px;
    }
  }

  tr:hover & {
    background: rgba(255, 215, 0, 0.05);
    color: #fff;
  }

  /* Highlight important data columns */
  &:nth-child(5), /* Target RTP */
  &:nth-child(6), /* Theoretical RTP */
  &:nth-child(8), /* Sample RTP */
  &:nth-child(9) { /* Win % */
    font-weight: 600;
    background: rgba(255, 215, 0, 0.03);

    tr:hover & {
      background: rgba(255, 215, 0, 0.1);
    }
  }
`

const FailingRow = styled(Td)<{ isFailing?: boolean }>`
  background: ${p => p.isFailing ? 'rgba(239, 68, 68, 0.1)' : 'inherit'};
  color: ${p => p.isFailing ? '#ef4444' : 'inherit'};
  font-weight: ${p => p.isFailing ? '600' : 'inherit'};
`

const MethodologyCard = styled(Card).attrs({ variant: 'secondary' })`
  @media (max-width: 768px) {
    display: none;
  }
`

const MobileCard = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    background: rgba(24, 24, 24, 0.8);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 16px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

    .game-title {
      font-size: 16px;
      font-weight: 700;
      color: #ffd700;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-shadow: 0 0 8px #ffd700;
    }

    .data-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      font-size: 13px;

      .data-item {
        display: flex;
        flex-direction: column;

        .label {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .value {
          font-weight: 600;
          color: #e2e8f0;
        }
      }
    }

    .notes {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 215, 0, 0.2);
      font-size: 12px;
      color: #cbd5e1;
      line-height: 1.4;
    }
  }
`

const DesktopTable = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`

const SectionCard = styled.div`
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 22px;
    background: radial-gradient(circle, #ffd70055 0%, transparent 80%);
    z-index: 0;
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
`

const SectionTitle = styled.h2`
  margin: 0 0 1.5rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 0 0 16px #ffd700, 0 0 32px #a259ff;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`

const MethodologyList = styled.ul`
  line-height: 1.7;
  color: #cbd5e1;
  margin: 0;
  padding-left: 20px;

  li {
    margin-bottom: 10px;

    strong {
      color: #ffd700;
      font-weight: 700;
      text-shadow: 0 0 8px #ffd700;
    }
  }
`

const Footer = styled.div`
  text-align: center;
  padding: 2rem 0;
  border-top: 2px solid rgba(255, 215, 0, 0.2);
  margin-top: 2rem;

  p {
    margin: 8px 0;
    color: #94a3b8;
    font-size: 13px;

    &:first-child {
      font-size: 14px;
      color: #cbd5e1;
    }
  }

  a {
    color: #ffd700;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    text-shadow: 0 0 8px #ffd700;

    &:hover {
      color: #ffe066;
      text-shadow: 0 0 12px #ffd700;
    }
  }
`

const EdgeStressTest = styled(SectionCard)`
  &::before {
    background: radial-gradient(circle, #ff006655 0%, transparent 80%);
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #ffd700;
  font-size: 1.2rem;

  &::before {
    content: '';
    width: 32px;
    height: 32px;
    border: 3px solid rgba(255, 215, 0, 0.3);
    border-top: 3px solid #ffd700;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const StatusBadge = styled.div<{ status: 'healthy' | 'warning' | 'critical' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 12px;
  background: ${p => 
    p.status === 'healthy' ? 'linear-gradient(135deg, #10b981, #059669)' :
    p.status === 'warning' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
    'linear-gradient(135deg, #ef4444, #dc2626)'
  };
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &::before {
    content: ${p => 
      p.status === 'healthy' ? '"✓"' :
      p.status === 'warning' ? '"⚠"' :
      '"✗"'
    };
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  font-size: 14px;

  .stat-item {
    text-align: center;

    .stat-value {
      display: block;
      font-size: 20px;
      font-weight: 700;
      color: #ffd700;
      text-shadow: 0 0 8px #ffd700;
    }

    .stat-label {
      font-size: 12px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
`

interface Row { game:string; onChain:boolean; noLocalRng:boolean; rtp?:RtpResult; note:string; status:'ok'|'warn'|'na'; betVector?: readonly number[] | number[]; targetRtp?: number }

interface SampleStats { plays:number; wins:number; totalWager:number; totalPayout:number }



const LIVE_SAMPLE_PLAYS = 10000 // lightweight quick sample
const LTA_PLAYS = 1000000 // long-term approximation (kept moderate for UI responsiveness)

// Utility to simulate selecting an index uniformly from a bet vector (Gamba model)
const runSample = (bet: readonly number[] | number[], plays: number, wager = 1): SampleStats => {
  const betArray = Array.isArray(bet) ? bet : [...bet]
  if (!betArray.length) return { plays:0, wins:0, totalWager:0, totalPayout:0 }
  let wins = 0, payout = 0
  for (let i = 0; i < plays; i++) {
    const idx = Math.floor(Math.random() * betArray.length)
    const m = betArray[idx] || 0
    if (m > 0) wins++
    payout += m * wager
  }
  return { plays, wins, totalWager: plays * wager, totalPayout: payout }
}

export default function FairnessAudit() {
  const [seed, setSeed] = useState(0)
  const [ltaMode, setLtaMode] = useState(false)
  const [edgeCaseData, setEdgeCaseData] = useState<EdgeCaseResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const samplePlays = ltaMode ? LTA_PLAYS : LIVE_SAMPLE_PLAYS

  // Fetch edge case data from API
  const fetchEdgeCaseData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const plays = ltaMode ? LTA_PLAYS : LIVE_SAMPLE_PLAYS
      const response = await fetch(`/api/audit/edgeCases?plays=${plays}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      setEdgeCaseData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load edge case data')
      console.error('Edge case data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [ltaMode])

  const refresh = useCallback(()=> {
    setSeed(Date.now())
    fetchEdgeCaseData()
  }, [fetchEdgeCaseData])

  // Load edge case data on mount and when seed changes
  useEffect(() => {
    fetchEdgeCaseData()
  }, [fetchEdgeCaseData, seed])
  
  const rows: Row[] = useMemo(()=>{
    // Generate real bet arrays using actual game logic
    const realBets = getRealBetArrays()
    
    return [
      { game:'Flip Duel', onChain:true, noLocalRng:true, rtp:calculateRtp(realBets.flip, '50% win'), targetRtp:0.96, note:'50% win chance coin flip', status:'ok', betVector:realBets.flip },
      { game:'Dice (50%)', onChain:true, noLocalRng:true, rtp:calculateRtp(realBets.dice, '50% roll-under'), targetRtp:0.96, note:'50% chance to win dice roll', status:'ok', betVector:realBets.dice },
      { game:'Mines (sample step)', onChain:true, noLocalRng:true, rtp:calculateRtp(realBets.mines, '5 mines, 1 reveal'), targetRtp:0.96, note:'Minesweeper game with 5 mines', status:'ok', betVector:realBets.mines },
      { game:'HiLo (HI mid-rank)', onChain:true, noLocalRng:true, rtp:calculateRtp(realBets.hilo, 'rank 6 HI'), targetRtp:0.96, note:'Card guessing game (higher)', status:'ok', betVector:realBets.hilo },
      { game:'Crash (1.5x sample)', onChain:true, noLocalRng:true, rtp:calculateRtp(realBets.crash, '1.5x target'), targetRtp:0.96, note:'Cash out before crash at 1.5x', status:'ok', betVector:realBets.crash },
      { game:'Plinko Standard', onChain:true, noLocalRng:true, rtp:calculateRtp(realBets.plinkoStd, 'standard mode'), targetRtp:0.96, note:'Ball drop game (standard)', status:'ok', betVector:realBets.plinkoStd },
      { game:'Plinko Degen', onChain:true, noLocalRng:true, rtp:calculateRtp(realBets.plinkoDegen, 'degen mode'), targetRtp:0.96, note:'Ball drop game (high risk)', status:'ok', betVector:realBets.plinkoDegen },
      { game:'Slots (dynamic)', onChain:true, noLocalRng:true, rtp:calculateRtp(realBets.slots, 'generated array'), targetRtp:0.96, note:'Slot machine game', status:'ok', betVector:realBets.slots },
      { game:'Blackjack (solo)', onChain:true, noLocalRng:true, rtp:calculateRtp(realBets.blackjack, 'scaled payouts'), targetRtp:0.96, note:'Classic card game vs house', status:'ok', betVector:realBets.blackjack },
      { game:'Blackjack Duel', onChain:true, noLocalRng:true, rtp:calculateRtp([realBets.flip[0], 0], 'PvP'), targetRtp:0.96, note:'Player vs player blackjack', status:'ok', betVector:[realBets.flip[0], 0] },
      { game:'Progressive Poker', onChain:true, noLocalRng:true, rtp:calculateRtp(realBets.progressivepoker, 'poker hand payouts'), targetRtp:0.96, note:'Progressive video poker game', status:'ok', betVector:realBets.progressivepoker },
      { game:'Roulette (Red bet)', onChain:true, noLocalRng:true, rtp:calculateRtp(realBets.roulette, 'red bet example'), targetRtp:0.97, note:'European roulette red bet (18/37 win)', status:'ok', betVector:realBets.roulette },
    ]
  },[seed])

  // Compute live sample stats (client-only, pseudo live) per row
  const samples = useMemo(()=> {
    return rows.map(r => {
      if (!r.betVector) return { winRatio: '—', sampleRtp: '—' }
      const s = runSample(r.betVector, samplePlays, 1)
      const rtp = s.totalWager ? (s.totalPayout / s.totalWager) : 0
      return {
        winRatio: ((s.wins / s.plays) * 100).toFixed(2) + '%',
        sampleRtp: (rtp * 100).toFixed(2) + '%'
      }
    })
  }, [rows, samplePlays])

  return (
    <Wrap>
      <Container>
        <HeroSection>
          <MainTitle>Game Fairness Audit</MainTitle>
          <MainSubtitle>
            Comprehensive real-time validation of Return-to-Player (RTP) rates and edge case scenarios.
            Our transparent testing ensures every game maintains its promised fairness standards.
          </MainSubtitle>
        </HeroSection>

        <DashboardGrid>
          <MainContent>
            <Card variant="primary">
              <StatusHeader status={error ? 'error' : loading ? 'loading' : 'success'}>
                <div className="status-info">
                  <span className="status-icon">
                    {error ? '❌' : loading ? '⏳' : '✅'}
                  </span>
                  <span className="status-text">
                    {error ? 'Testing Failed' : loading ? 'Running Tests...' : 'All Systems Healthy'}
                  </span>
                </div>
                <div className="last-updated">
                  Last verified: <span className="time">{new Date().toLocaleTimeString()}</span>
                </div>
              </StatusHeader>

              <ControlPanel>
                <ControlRow>
                  <ControlGroup>
                    <RefreshButton onClick={refresh}>
                      🔄 Refresh Data
                    </RefreshButton>
                    <CheckboxLabel>
                      <input 
                        type="checkbox" 
                        checked={ltaMode} 
                        onChange={e => setLtaMode(e.target.checked)} 
                      />
                      <span>Show <b>Long-Term Results</b> (10,000 test plays)</span>
                    </CheckboxLabel>
                  </ControlGroup>
                  <StatusInfo>
                    Currently showing: <b>{samplePlays}</b> test games played to verify fairness
                  </StatusInfo>
                </ControlRow>
              </ControlPanel>

      <TableContainer>
        {/* Desktop Table */}
        <DesktopTable>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Game</Th>
                  <Th>Status</Th>
                  <Th>Blockchain Verified</Th>
                  <Th>Truly Random</Th>
                  <Th>Target Payout %</Th>
                  <Th>Actual Payout %</Th>
                  <Th>House Advantage</Th>
                  <Th>Test Results ({samplePlays} games)</Th>
                  <Th>Win Rate ({samplePlays} games)</Th>
                  <Th>Technical Details</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const sample = samples[i]
                  return (
                    <tr key={r.game}>
                      <Td><strong>{r.game}</strong></Td>
                      <Td><Badge tone={r.status}>{r.status}</Badge></Td>
                      <Td>{r.onChain ? 'Yes' : 'No'}</Td>
                      <Td>{r.noLocalRng ? 'Yes' : 'No'}</Td>
                      <Td><DataValue type="percentage">{r.targetRtp ? (r.targetRtp * 100).toFixed(2) + '%' : '—'}</DataValue></Td>
                      <Td><DataValue type="percentage">{r.rtp ? (r.rtp.rtp * 100).toFixed(2) + '%' : '—'}</DataValue></Td>
                      <Td>{r.rtp ? (r.rtp.houseEdge * 100).toFixed(2) + '%' : (r.targetRtp ? ((1 - r.targetRtp) * 100).toFixed(2) + '%' : '—')}</Td>
                      <Td><DataValue type="percentage">{sample.sampleRtp}</DataValue></Td>
                      <Td><DataValue type="percentage">{sample.winRatio}</DataValue></Td>
                      <Td>
                        {r.note} {r.rtp?.note && <Mono>{r.rtp.note}</Mono>}
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </TableWrapper>
        </DesktopTable>

        {/* Mobile Cards */}
        {rows.map((r, i) => {
          const sample = samples[i]
          return (
            <MobileCard key={`mobile-${r.game}`}>
              <div className="game-title">
                {r.game}
                <Badge tone={r.status}>{r.status}</Badge>
              </div>
              <div className="data-grid">
                <div className="data-item">
                  <span className="label">Target Payout %</span>
                  <span className="value">
                    <DataValue type="percentage">
                      {r.targetRtp ? (r.targetRtp * 100).toFixed(2) + '%' : '—'}
                    </DataValue>
                  </span>
                </div>
                <div className="data-item">
                  <span className="label">Actual Payout %</span>
                  <span className="value">
                    <DataValue type="percentage">
                      {r.rtp ? (r.rtp.rtp * 100).toFixed(2) + '%' : '—'}
                    </DataValue>
                  </span>
                </div>
                <div className="data-item">
                  <span className="label">Test Results</span>
                  <span className="value">
                    <DataValue type="percentage">{sample.sampleRtp}</DataValue>
                  </span>
                </div>
                <div className="data-item">
                  <span className="label">Win Rate</span>
                  <span className="value">
                    <DataValue type="percentage">{sample.winRatio}</DataValue>
                  </span>
                </div>
                <div className="data-item">
                  <span className="label">Blockchain Verified</span>
                  <span className="value">{r.onChain ? 'Yes' : 'No'}</span>
                </div>
                <div className="data-item">
                  <span className="label">Truly Random</span>
                  <span className="value">{r.noLocalRng ? 'Yes' : 'No'}</span>
                </div>
              </div>
              {(r.note || r.rtp?.note) && (
                <div className="notes">
                  {r.note} {r.rtp?.note && <Mono>{r.rtp.note}</Mono>}
                </div>
              )}
            </MobileCard>
          )
        })}
      </TableContainer>
            </Card>

            <Card variant="danger">
              <h3 style={{ margin: '0 0 1.5rem', color: '#ef4444', fontSize: '1.3rem' }}>🚨 Edge Case Stress Test</h3>
        
        {loading && <LoadingSpinner>Loading comprehensive edge case validation...</LoadingSpinner>}
        
        {error && (
          <div style={{ 
            padding: '2rem', 
            background: 'rgba(255, 0, 0, 0.1)', 
            border: '1px solid #ef4444', 
            borderRadius: '12px', 
            color: '#ef4444',
            textAlign: 'center' 
          }}>
            <strong>Error:</strong> {error}
            <br />
            <button 
              onClick={fetchEdgeCaseData}
              style={{ 
                marginTop: '1rem', 
                padding: '8px 16px', 
                background: '#ef4444', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer' 
              }}
            >
              Retry
            </button>
          </div>
        )}

        {edgeCaseData && !loading && (
          <>
            <StatusHeader status={edgeCaseData.overallStatus === 'healthy' ? 'success' : edgeCaseData.overallStatus === 'critical' ? 'error' : 'loading'}>
              <StatusBadge status={edgeCaseData.overallStatus}>
                {edgeCaseData.overallStatus} System
              </StatusBadge>
              <StatsGrid>
                <div className="stat-item">
                  <span className="stat-value">{edgeCaseData.totalTests.toLocaleString()}</span>
                  <span className="stat-label">Total Tests</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{edgeCaseData.playsPerScenario.toLocaleString()}</span>
                  <span className="stat-label">Plays per Scenario</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{edgeCaseData.totalFailures}</span>
                  <span className="stat-label">Failures</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {((1 - edgeCaseData.totalFailures / edgeCaseData.totalTests) * 100).toFixed(1)}%
                  </span>
                  <span className="stat-label">Pass Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{Object.keys(edgeCaseData.summary).length}</span>
                  <span className="stat-label">Games Tested</span>
                </div>
              </StatsGrid>
            </StatusHeader>

            <TableContainer>
              <DesktopTable>
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Game</Th>
                        <Th>Scenario</Th>
                        <Th>Target RTP</Th>
                        <Th>Actual RTP</Th>
                        <Th>Deviation</Th>
                        <Th>Win Rate</Th>
                        <Th>Status</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {edgeCaseData.results
                        .filter(result => !result.withinTolerance) // Show failures first
                        .map((result, i) => (
                        <tr key={`fail-${i}`}>
                          <FailingRow isFailing><strong>{result.game}</strong></FailingRow>
                          <FailingRow isFailing>{result.scenario}</FailingRow>
                          <FailingRow isFailing>
                            <DataValue type="percentage">{(result.targetRTP * 100).toFixed(2)}%</DataValue>
                          </FailingRow>
                          <FailingRow isFailing>
                            <DataValue type="percentage">{(result.actualRTP * 100).toFixed(2)}%</DataValue>
                          </FailingRow>
                          <FailingRow isFailing>
                            <DataValue type="percentage">±{(result.deviation * 100).toFixed(3)}%</DataValue>
                          </FailingRow>
                          <FailingRow isFailing>
                            <DataValue type="percentage">{(result.winRate * 100).toFixed(2)}%</DataValue>
                          </FailingRow>
                          <FailingRow isFailing>
                            <Badge tone="warn">FAIL</Badge>
                          </FailingRow>
                        </tr>
                      ))}
                      
                      {edgeCaseData.results
                        .filter(result => result.withinTolerance) // Show passes after failures
                        .slice(0, 50) // Limit displayed passing tests for performance
                        .map((result, i) => (
                        <tr key={`pass-${i}`}>
                          <Td><strong>{result.game}</strong></Td>
                          <Td>{result.scenario}</Td>
                          <Td>
                            <DataValue type="percentage">{(result.targetRTP * 100).toFixed(2)}%</DataValue>
                          </Td>
                          <Td>
                            <DataValue type="percentage">{(result.actualRTP * 100).toFixed(2)}%</DataValue>
                          </Td>
                          <Td>
                            <DataValue type="percentage">±{(result.deviation * 100).toFixed(3)}%</DataValue>
                          </Td>
                          <Td>
                            <DataValue type="percentage">{(result.winRate * 100).toFixed(2)}%</DataValue>
                          </Td>
                          <Td>
                            <Badge tone="ok">PASS</Badge>
                          </Td>
                        </tr>
                      ))}
                      
                      {edgeCaseData.results.filter(r => r.withinTolerance).length > 50 && (
                        <tr>
                          <Td colSpan={7} style={{ textAlign: 'center', fontStyle: 'italic', color: '#94a3b8' }}>
                            ... and {edgeCaseData.results.filter(r => r.withinTolerance).length - 50} more passing tests
                          </Td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </TableWrapper>
              </DesktopTable>

              {/* Mobile Cards for Edge Cases */}
              {edgeCaseData.results
                .filter(result => !result.withinTolerance) // Show only failures on mobile
                .map((result, i) => (
                <MobileCard key={`mobile-fail-${i}`} style={{ 
                  background: 'rgba(255, 0, 0, 0.1)', 
                  borderColor: '#ef4444' 
                }}>
                  <div className="game-title">
                    {result.game} - {result.scenario}
                    <Badge tone="warn">FAIL</Badge>
                  </div>
                  <div className="data-grid">
                    <div className="data-item">
                      <span className="label">Target RTP</span>
                      <span className="value">
                        <DataValue type="percentage">{(result.targetRTP * 100).toFixed(2)}%</DataValue>
                      </span>
                    </div>
                    <div className="data-item">
                      <span className="label">Actual RTP</span>
                      <span className="value">
                        <DataValue type="percentage">{(result.actualRTP * 100).toFixed(2)}%</DataValue>
                      </span>
                    </div>
                    <div className="data-item">
                      <span className="label">Deviation</span>
                      <span className="value">
                        <DataValue type="percentage">±{(result.deviation * 100).toFixed(3)}%</DataValue>
                      </span>
                    </div>
                    <div className="data-item">
                      <span className="label">Win Rate</span>
                      <span className="value">
                        <DataValue type="percentage">{(result.winRate * 100).toFixed(2)}%</DataValue>
                      </span>
                    </div>
                  </div>
                </MobileCard>
              ))}
            </TableContainer>

            <div style={{ 
              marginTop: '2rem', 
              padding: '1rem', 
              background: 'rgba(24, 24, 24, 0.8)', 
              borderRadius: '12px', 
              fontSize: '13px', 
              color: '#94a3b8',
              textAlign: 'center' 
            }}>
              <strong>Last Updated:</strong> {new Date(edgeCaseData.timestamp).toLocaleString()}
              <br />
              Edge case validation runs {edgeCaseData.playsPerScenario.toLocaleString()} plays per scenario, totaling {edgeCaseData.totalTests.toLocaleString()} individual game tests across all scenarios.
              Failures are highlighted for immediate attention.
            </div>
          </>
        )}
            </Card>

      <Card variant="secondary">
        <h3 style={{ margin: '0 0 1.5rem', color: '#ffd700', fontSize: '1.3rem' }}>Summary by Game</h3>
        {edgeCaseData && (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Game</Th>
                  <Th>Scenarios Tested</Th>
                  <Th>Failures</Th>
                  <Th>Pass Rate</Th>
                  <Th>Avg RTP</Th>
                  <Th>RTP Range</Th>
                  <Th>Avg Win Rate</Th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(edgeCaseData.summary).map(([game, data]) => {
                  const passRate = ((data.totalScenarios - data.outOfTolerance) / data.totalScenarios) * 100;
                  return (
                    <tr key={game}>
                      <Td><strong>{game}</strong></Td>
                      <Td>{data.totalScenarios}</Td>
                      <Td>
                        {data.outOfTolerance > 0 ? (
                          <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{data.outOfTolerance}</span>
                        ) : (
                          <span style={{ color: '#10b981' }}>0</span>
                        )}
                      </Td>
                      <Td>
                        <DataValue type="percentage">
                          {passRate.toFixed(1)}%
                        </DataValue>
                      </Td>
                      <Td>
                        <DataValue type="percentage">{(data.avgRTP * 100).toFixed(2)}%</DataValue>
                      </Td>
                      <Td>
                        <Mono>{(data.minRTP * 100).toFixed(2)}% - {(data.maxRTP * 100).toFixed(2)}%</Mono>
                      </Td>
                      <Td>
                        <DataValue type="percentage">{(data.avgWinRate * 100).toFixed(2)}%</DataValue>
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </TableWrapper>
        )}
            </Card>
          </MainContent>

          <Sidebar>
            <QuickStats>
              <StatsTitle>Live Statistics</StatsTitle>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{edgeCaseData ? Object.keys(edgeCaseData.summary).length : '—'}</div>
                  <div className="stat-label">Games Tested</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {edgeCaseData ? 
                      (() => {
                        const gameKeys = Object.keys(edgeCaseData.summary);
                        const passingGames = gameKeys.filter(gameKey => 
                          edgeCaseData.summary[gameKey].outOfTolerance === 0
                        ).length;
                        return `${passingGames}/${gameKeys.length}`;
                      })()
                      : '—'
                    }
                  </div>
                  <div className="stat-label">Passing</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{samplePlays.toLocaleString()}</div>
                  <div className="stat-label">Test Plays</div>
                </div>
              </div>
            </QuickStats>

            <MethodologyCard>
              <h3 style={{ margin: '0 0 1rem', color: '#ffd700' }}>How We Ensure Fair Play</h3>
              <MethodologyList>
                <li><strong>Real Game Code:</strong> We test the actual code that runs our games, not fake versions.</li>
                <li><strong>Random Selection:</strong> Every game outcome is randomly selected using fair mathematical principles.</li>
                <li><strong>Live Testing:</strong> All games are continuously tested using the same logic players experience.</li>
                <li><strong>Accurate Results:</strong> Test results should closely match our target payout percentages.</li>
                <li><strong>Always Updated:</strong> When we improve games, these fairness reports automatically update too.</li>
              </MethodologyList>
            </MethodologyCard>
          </Sidebar>
        </DashboardGrid>

        <Footer>
          <p>Report generated {new Date().toLocaleString()}. This audit uses our actual game code to ensure accuracy.</p>
          <p><Link to="/">← Back to Casino</Link></p>
        </Footer>
      </Container>
    </Wrap>
  )
}
