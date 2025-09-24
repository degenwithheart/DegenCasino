import React from 'react'
import styled from 'styled-components';

const Container = styled.div<{ $colorScheme?: any }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
  border-radius: 20px;
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  font-size: 14px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
`

const Label = styled.span<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#888'};
`

const Value = styled.span<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
  font-weight: 600;
`

interface PlatformStats {
  usd_volume: number
  usd_fees: number
  total_games: number
  volume?: number // SOL volume if available
  plays?: number // alternative field name for games
  totalPlays?: number // another possible field name
  sol_volume?: number // Direct SOL volume from plays
}

interface TotalBetsTopBarProps {
  stats?: PlatformStats | null
  loading?: boolean
  error?: string | null
  colorScheme: any
}

export function TotalBetsTopBar({ stats, loading, error, colorScheme }: TotalBetsTopBarProps) {

  if (loading) {
    return (
      <Container $colorScheme={colorScheme}>
        <Value $colorScheme={colorScheme}>Total Bets: Loading...</Value>
      </Container>
    );
  }

  if (error || !stats) {
    return (
      <Container $colorScheme={colorScheme}>
        <Value $colorScheme={colorScheme}>Total Bets: --</Value>
      </Container>
    );
  }

  // Use calculated SOL volume from actual wagers
  const solVolume = stats.sol_volume || 0;
  const formattedSol = solVolume.toLocaleString(undefined, { maximumFractionDigits: 4 });
  const gamesCount = stats.plays || 0;

  return (
    <Container $colorScheme={colorScheme}>
      <Value $colorScheme={colorScheme}>
        Total Bets: {formattedSol} SOL wagered in {gamesCount} games played
      </Value>
    </Container>
  );
}