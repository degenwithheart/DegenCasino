import React from 'react'
import styled from 'styled-components'
import { TokenValue } from 'gamba-react-ui-v2'
import { FaFire, FaSkull } from 'react-icons/fa'

interface GameStats {
  gamesPlayed: number
  wins: number
  losses: number
}

interface SidebarGameStatsProps {
  gameName: string
  gameMode: string
  rtp?: string
  stats: GameStats
  onReset?: () => void
  colorScheme: any
}

const StatsContainer = styled.div<{ $colorScheme: any; $isOnFire?: boolean; $isRekt?: boolean }>`
  background: ${props => 
    props.$isOnFire 
      ? 'radial-gradient(ellipse at center, rgba(0, 255, 65, 0.15) 0%, rgba(255, 215, 0, 0.1) 40%, rgba(255, 0, 128, 0.05) 100%)'
      : props.$isRekt
      ? 'radial-gradient(ellipse at center, rgba(220, 20, 60, 0.15) 0%, rgba(255, 64, 0, 0.1) 40%, rgba(128, 0, 255, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(255, 0, 128, 0.12) 0%, rgba(0, 128, 255, 0.08) 25%, rgba(255, 255, 0, 0.1) 50%, rgba(128, 0, 255, 0.08) 75%, rgba(255, 64, 0, 0.06) 100%)'
  };
  border: 2px solid ${props => 
    props.$isOnFire 
      ? '#00ff41'
      : props.$isRekt
      ? '#dc143c'
      : 'rgba(255, 0, 128, 0.4)'
  };
  border-radius: 12px;
  padding: 1rem;
  backdrop-filter: blur(16px) saturate(120%);
  box-shadow: ${props => 
    props.$isOnFire
      ? '0 0 20px rgba(0, 255, 65, 0.4), 0 6px 16px rgba(0, 0, 0, 0.3)'
      : props.$isRekt
      ? '0 0 20px rgba(220, 20, 60, 0.4), 0 6px 16px rgba(0, 0, 0, 0.3)'
      : '0 0 25px rgba(255, 0, 128, 0.3), 0 6px 16px rgba(0, 0, 0, 0.25)'
  };
  position: relative;
  overflow: hidden;
`

const GameInfoSection = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const GameTitle = styled.div`
  font-size: 1rem;
  font-weight: 900;
  color: #ff0080;
  text-shadow: 0 0 10px #ff0080, 0 0 20px rgba(255, 0, 128, 0.5);
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
`

const GameDetails = styled.div`
  font-size: 0.8rem;
  color: #00bfff;
  text-shadow: 0 0 8px #00bfff;
  font-weight: 600;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

const StatItem = styled.div`
  text-align: center;
`

const StatValue = styled.div<{ $color: string }>`
  font-size: 1rem;
  font-weight: 900;
  color: ${props => props.$color};
  text-shadow: 0 0 10px ${props => props.$color};
  margin-bottom: 0.25rem;
`

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  font-weight: 600;
  text-transform: uppercase;
`

const StatusMessage = styled.div<{ $isOnFire?: boolean; $isRekt?: boolean }>`
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 8px;
  background: ${props => 
    props.$isOnFire 
      ? 'rgba(0, 255, 65, 0.2)'
      : props.$isRekt
      ? 'rgba(220, 20, 60, 0.2)'
      : 'rgba(255, 255, 255, 0.1)'
  };
  color: ${props => 
    props.$isOnFire 
      ? '#00ff41'
      : props.$isRekt
      ? '#dc143c'
      : 'rgba(255, 255, 255, 0.9)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`

export function SidebarGameStats({
  gameName,
  gameMode,
  rtp,
  stats,
  onReset,
  colorScheme
}: SidebarGameStatsProps) {
  const degenColors = {
    neonPink: '#ff0080',
    neonGreen: '#00ff41',
    neonBlue: '#0080ff', 
    neonPurple: '#8000ff',
    neonYellow: '#ffff00',
    neonOrange: '#ff4000',
    crimsonRed: '#dc143c',
    electricBlue: '#00bfff',
    toxicGreen: '#39ff14'
  }

  const winRate = stats.gamesPlayed > 0 ? (stats.wins / stats.gamesPlayed) * 100 : 0
  const isOnFire = winRate > 60
  const isRekt = winRate < 30 && stats.gamesPlayed > 5

  return (
    <StatsContainer $colorScheme={colorScheme} $isOnFire={isOnFire} $isRekt={isRekt}>
      <GameInfoSection>
        <GameTitle>{gameName}</GameTitle>
        <GameDetails>
          {gameMode}{rtp ? ` • ${rtp}% RTP` : ''}
        </GameDetails>
      </GameInfoSection>

      <StatsGrid>
        <StatItem>
          <StatValue $color={degenColors.neonYellow}>
            {stats.gamesPlayed}
          </StatValue>
          <StatLabel>GAMES</StatLabel>
        </StatItem>

        <StatItem>
          <StatValue $color={degenColors.electricBlue}>
            {winRate.toFixed(1)}%
          </StatValue>
          <StatLabel>WIN RATE</StatLabel>
        </StatItem>

        <StatItem>
          <StatValue $color={degenColors.toxicGreen}>
            {stats.wins}
          </StatValue>
          <StatLabel>WINS</StatLabel>
        </StatItem>

        <StatItem>
          <StatValue $color={degenColors.crimsonRed}>
            {stats.losses}
          </StatValue>
          <StatLabel>LOSSES</StatLabel>
        </StatItem>
      </StatsGrid>

      <StatusMessage $isOnFire={isOnFire} $isRekt={isRekt}>
        {isOnFire && (
          <>
            <FaFire /> You're on fire! Keep it up!
          </>
        )}
        {isRekt && (
          <>
            <FaSkull /> Tough session, maybe take a break?
          </>
        )}
        {!isOnFire && !isRekt && '🎯 Steady gaming, good luck!'}
      </StatusMessage>

      {onReset && (
        <button
          onClick={onReset}
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '8px 16px',
            background: 'linear-gradient(135deg, rgba(128, 0, 255, 0.15) 0%, rgba(255, 0, 128, 0.1) 50%, rgba(0, 128, 255, 0.15) 100%)',
            border: `2px solid ${degenColors.neonPurple}`,
            borderRadius: '8px',
            color: degenColors.neonPurple,
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            textShadow: `0 0 8px ${degenColors.neonPurple}`,
            boxShadow: `0 0 15px rgba(128, 0, 255, 0.3)`,
            letterSpacing: '0.5px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(128, 0, 255, 0.25) 0%, rgba(255, 0, 128, 0.2) 50%, rgba(0, 128, 255, 0.25) 100%)'
            e.currentTarget.style.borderColor = degenColors.neonPink
            e.currentTarget.style.color = degenColors.neonPink
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(128, 0, 255, 0.15) 0%, rgba(255, 0, 128, 0.1) 50%, rgba(0, 128, 255, 0.15) 100%)'
            e.currentTarget.style.borderColor = degenColors.neonPurple
            e.currentTarget.style.color = degenColors.neonPurple
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          🔥 RESET STATS 🔥
        </button>
      )}
    </StatsContainer>
  )
}