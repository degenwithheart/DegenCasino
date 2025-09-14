import React from 'react'
import { TokenValue } from 'gamba-react-ui-v2'
import { EnhancedButton } from './EnhancedGameControls'

interface GameStats {
  gamesPlayed: number
  wins: number
  losses: number
  sessionProfit: number
}

interface GameStatsHeaderProps {
  gameName: string
  gameMode: string
  stats: GameStats
  onReset?: () => void
  theme?: 'purple' | 'gold'
  disabled?: boolean
  isMobile?: boolean
}

export function GameStatsHeader({
  gameName,
  gameMode,
  stats,
  onReset,
  theme = 'gold',
  disabled = false,
  isMobile = false
}: GameStatsHeaderProps) {
  const colors = {
    purple: {
      primary: '#9358ff',
      secondary: 'rgba(147, 88, 255, 0.8)',
      border: 'rgba(147, 88, 255, 0.3)',
      inset: 'rgba(147, 88, 255, 0.2)'
    },
    gold: {
      primary: '#d4a574',
      secondary: 'rgba(212, 165, 116, 0.8)',
      border: 'rgba(212, 165, 116, 0.3)',
      inset: 'rgba(212, 165, 116, 0.2)'
    }
  }

  const colorScheme = colors[theme]

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      right: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1,
      background: 'linear-gradient(135deg, rgba(10, 5, 17, 0.85) 0%, rgba(139, 90, 158, 0.15) 50%, rgba(10, 5, 17, 0.85) 100%)',
      padding: '15px',
      borderRadius: '16px',
      border: `1px solid ${colorScheme.border}`,
      boxShadow: '0 8px 32px rgba(10, 5, 17, 0.4), inset 0 1px 0 ' + colorScheme.inset,
      backdropFilter: 'blur(16px)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: colorScheme.primary }}>
          {gameName}
        </div>
        <div style={{ fontSize: '12px', color: colorScheme.secondary }}>
          {gameMode}
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: colorScheme.primary }}>
          {stats.gamesPlayed}
        </div>
        <div style={{ fontSize: '12px', color: colorScheme.secondary }}>Games</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4caf50' }}>
          {stats.wins}
        </div>
        <div style={{ fontSize: '12px', color: colorScheme.secondary }}>Wins</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f44336' }}>
          {stats.losses}
        </div>
        <div style={{ fontSize: '12px', color: colorScheme.secondary }}>Losses</div>
      </div>
      {!isMobile && (
        <>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: stats.wins > stats.losses ? '#4caf50' : stats.wins < stats.losses ? '#f44336' : colorScheme.primary
            }}>
              {(() => {
                if (stats.wins === 0 && stats.losses === 0) return '0.00'
                if (stats.losses === 0) return '+∞'
                const ratio = stats.wins / stats.losses
                const prefix = ratio >= 1 ? '+' : '-'
                return `${prefix}${ratio.toFixed(2)}`
              })()}
            </div>
            <div style={{ fontSize: '12px', color: colorScheme.secondary }}>W/L Ratio</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: stats.sessionProfit > 0 ? '#4caf50' : stats.sessionProfit < 0 ? '#f44336' : colorScheme.primary
            }}>
              <TokenValue amount={stats.sessionProfit} />
            </div>
            <div style={{ fontSize: '12px', color: colorScheme.secondary }}>Session Profit</div>
          </div>
        </>
      )}
      {onReset && (
        <div style={{ textAlign: 'center' }}>
          <EnhancedButton
            onClick={onReset}
            disabled={disabled}
            variant="secondary"
          >
            Reset
          </EnhancedButton>
        </div>
      )}
    </div>
  )
}