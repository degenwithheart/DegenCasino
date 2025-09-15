import React from 'react'
import { TokenValue } from 'gamba-react-ui-v2'
import { EnhancedButton } from './EnhancedGameControls'

interface GameStats {
  gamesPlayed: number
  wins: number
  losses: number
  sessionProfit: number
  bestWin: number
}

interface GameStatsHeaderProps {
  gameName: string
  gameMode: string
  rtp?: string
  stats: GameStats
  onReset?: () => void
  theme?: 'purple' | 'gold'
  disabled?: boolean
  isMobile?: boolean
}

export function GameStatsHeader({
  gameName,
  gameMode,
  rtp,
  stats,
  onReset,
  theme = 'gold',
  disabled = false,
  isMobile = false
}: GameStatsHeaderProps) {
  // DEGEN STYLE COLORS - WILD & CHAOTIC
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

  // Calculate win rate for dynamic styling
  const winRate = stats.gamesPlayed > 0 ? (stats.wins / stats.gamesPlayed) * 100 : 0
  const isOnFire = winRate > 60 // HOT STREAK
  const isRekt = winRate < 30 && stats.gamesPlayed > 5 // GETTING REKT

  return (
    <div style={{
      padding: isMobile ? '10px 16px' : '14px 24px',
      background: isOnFire 
        ? 'radial-gradient(ellipse at center, rgba(0, 255, 65, 0.15) 0%, rgba(255, 215, 0, 0.1) 40%, rgba(255, 0, 128, 0.05) 100%)'
        : isRekt
        ? 'radial-gradient(ellipse at center, rgba(220, 20, 60, 0.15) 0%, rgba(255, 64, 0, 0.1) 40%, rgba(128, 0, 255, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(255, 0, 128, 0.12) 0%, rgba(0, 128, 255, 0.08) 25%, rgba(255, 255, 0, 0.1) 50%, rgba(128, 0, 255, 0.08) 75%, rgba(255, 64, 0, 0.06) 100%)',
      border: isOnFire 
        ? `2px solid ${degenColors.neonGreen}`
        : isRekt
        ? `2px solid ${degenColors.crimsonRed}`
        : `2px solid rgba(255, 0, 128, 0.4)`,
      borderRadius: '12px',
      margin: '8px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backdropFilter: 'blur(16px) saturate(120%)',
      boxShadow: isOnFire
        ? `0 0 20px rgba(0, 255, 65, 0.4), 0 6px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
        : isRekt
        ? `0 0 20px rgba(220, 20, 60, 0.4), 0 6px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
        : `0 0 25px rgba(255, 0, 128, 0.3), 0 6px 16px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
      position: 'relative',
      overflow: 'hidden',
      animation: isOnFire ? 'degenPulse 2s ease-in-out infinite' : isRekt ? 'degenShake 3s ease-in-out infinite' : 'none'
    }}>
      
      {/* CHAOTIC BACKGROUND GRADIENT OVERLAY */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, transparent 0%, rgba(255, 0, 128, 0.03) 25%, transparent 50%, rgba(0, 255, 65, 0.03) 75%, transparent 100%)',
        opacity: 0.6,
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div style={{ 
        display: 'flex', 
        gap: isMobile ? '12px' : '24px', 
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        flexWrap: isMobile ? 'nowrap' : 'wrap',
        overflowX: isMobile ? 'auto' : 'visible'
      }}>
        {/* GAME NAME + MODE/RTP - NEON STYLING */}
        <div style={{ 
          textAlign: 'center', 
          minWidth: isMobile ? '60px' : '80px',
          flexShrink: 0
        }}>
          <div style={{ 
            fontSize: isMobile ? '14px' : '17px', 
            fontWeight: '900', 
            color: degenColors.neonPink,
            textShadow: `0 0 10px ${degenColors.neonPink}, 0 0 20px rgba(255, 0, 128, 0.5)`,
            letterSpacing: '0.5px'
          }}>
            {gameName}
          </div>
          {!isMobile && (
            <div style={{ 
              fontSize: '11px', 
              color: degenColors.electricBlue,
              textShadow: `0 0 8px ${degenColors.electricBlue}`,
              fontWeight: '600',
              marginTop: '2px'
            }}>
              {gameMode}{rtp ? ` • ${rtp}% RTP` : ''}
            </div>
          )}
        </div>
        
        {/* GAMES - ELECTRIC STYLING */}
        <div style={{ textAlign: 'center', minWidth: '50px', flexShrink: 0 }}>
          <div style={{ 
            fontSize: isMobile ? '16px' : '18px', 
            fontWeight: '900', 
            color: degenColors.neonYellow,
            textShadow: `0 0 10px ${degenColors.neonYellow}, 0 0 15px rgba(255, 255, 0, 0.6)`,
            filter: 'brightness(1.1)'
          }}>
            {stats.gamesPlayed}
          </div>
          <div style={{ 
            fontSize: isMobile ? '9px' : '11px', 
            color: 'rgba(255, 255, 255, 0.9)',
            textShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
            fontWeight: '600'
          }}>GAMES</div>
        </div>
        
        {/* WINS - TOXIC GREEN GLOW */}
        <div style={{ textAlign: 'center', minWidth: '45px', flexShrink: 0 }}>
          <div style={{ 
            fontSize: isMobile ? '16px' : '18px', 
            fontWeight: '900', 
            color: degenColors.toxicGreen,
            textShadow: `0 0 12px ${degenColors.toxicGreen}, 0 0 18px rgba(57, 255, 20, 0.7)`,
            filter: stats.wins > stats.losses ? 'brightness(1.2)' : 'brightness(0.8)'
          }}>
            {stats.wins}
          </div>
          <div style={{ 
            fontSize: isMobile ? '9px' : '11px', 
            color: 'rgba(57, 255, 20, 0.9)',
            textShadow: '0 0 6px rgba(57, 255, 20, 0.5)',
            fontWeight: '600'
          }}>WINS</div>
        </div>
        
        {/* LOSSES - CRIMSON FIRE */}
        <div style={{ textAlign: 'center', minWidth: '45px', flexShrink: 0 }}>
          <div style={{ 
            fontSize: isMobile ? '16px' : '18px', 
            fontWeight: '900', 
            color: degenColors.crimsonRed,
            textShadow: `0 0 12px ${degenColors.crimsonRed}, 0 0 18px rgba(220, 20, 60, 0.7)`,
            filter: stats.losses > stats.wins ? 'brightness(1.2)' : 'brightness(0.8)'
          }}>
            {stats.losses}
          </div>
          <div style={{ 
            fontSize: isMobile ? '9px' : '11px', 
            color: 'rgba(220, 20, 60, 0.9)',
            textShadow: '0 0 6px rgba(220, 20, 60, 0.5)',
            fontWeight: '600'
          }}>LOSSES</div>
        </div>

        {/* SESSION PROFIT - Show on desktop, condensed on mobile */}
        {!isMobile && (
          <div style={{ textAlign: 'center', minWidth: '70px', flexShrink: 0 }}>
            <div style={{ 
              fontSize: '17px', 
              fontWeight: '900', 
              color: stats.sessionProfit >= 0 ? degenColors.neonGreen : degenColors.crimsonRed,
              textShadow: stats.sessionProfit >= 0 
                ? `0 0 12px ${degenColors.neonGreen}, 0 0 18px rgba(0, 255, 65, 0.7)`
                : `0 0 12px ${degenColors.crimsonRed}, 0 0 18px rgba(220, 20, 60, 0.7)`,
              filter: 'brightness(1.1)'
            }}>
              <TokenValue amount={stats.sessionProfit} />
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: stats.sessionProfit >= 0 ? 'rgba(0, 255, 65, 0.9)' : 'rgba(220, 20, 60, 0.9)',
              textShadow: stats.sessionProfit >= 0 
                ? '0 0 6px rgba(0, 255, 65, 0.5)'
                : '0 0 6px rgba(220, 20, 60, 0.5)',
              fontWeight: '600'
            }}>PROFIT</div>
          </div>
        )}
        
        {/* BEST WIN - Desktop only */}
        {!isMobile && (
          <div style={{ textAlign: 'center', minWidth: '70px', flexShrink: 0 }}>
            <div style={{ 
              fontSize: '17px', 
              fontWeight: '900', 
              color: stats.bestWin > 0 ? degenColors.neonOrange : degenColors.neonBlue,
              textShadow: stats.bestWin > 0 
                ? `0 0 15px ${degenColors.neonOrange}, 0 0 25px rgba(255, 64, 0, 0.8)`
                : `0 0 10px ${degenColors.neonBlue}`,
              filter: 'brightness(1.1)'
            }}>
              <TokenValue amount={stats.bestWin} />
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: 'rgba(255, 165, 0, 0.9)',
              textShadow: '0 0 6px rgba(255, 165, 0, 0.5)',
              fontWeight: '600'
            }}>BEST HIT</div>
          </div>
        )}
      </div>
      
      {/* RESET BUTTON - Desktop only */}
      {onReset && !isMobile && (
        <button
          onClick={onReset}
          disabled={disabled}
          style={{
            padding: '8px 16px',
            background: disabled 
              ? 'rgba(128, 128, 128, 0.2)' 
              : 'linear-gradient(135deg, rgba(128, 0, 255, 0.15) 0%, rgba(255, 0, 128, 0.1) 50%, rgba(0, 128, 255, 0.15) 100%)',
            border: disabled 
              ? '2px solid rgba(128, 128, 128, 0.3)' 
              : `2px solid ${degenColors.neonPurple}`,
            borderRadius: '8px',
            color: disabled ? 'rgba(255, 255, 255, 0.4)' : degenColors.neonPurple,
            fontSize: '12px',
            fontWeight: '700',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            textShadow: disabled ? 'none' : `0 0 8px ${degenColors.neonPurple}`,
            boxShadow: disabled 
              ? 'none' 
              : `0 0 15px rgba(128, 0, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
            position: 'relative',
            zIndex: 2,
            letterSpacing: '0.5px',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.background = `linear-gradient(135deg, rgba(128, 0, 255, 0.25) 0%, rgba(255, 0, 128, 0.2) 50%, rgba(0, 128, 255, 0.25) 100%)`
              e.currentTarget.style.borderColor = degenColors.neonPink
              e.currentTarget.style.color = degenColors.neonPink
              e.currentTarget.style.textShadow = `0 0 12px ${degenColors.neonPink}`
              e.currentTarget.style.boxShadow = `0 0 20px rgba(255, 0, 128, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
              e.currentTarget.style.transform = 'scale(1.05)'
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled) {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(128, 0, 255, 0.15) 0%, rgba(255, 0, 128, 0.1) 50%, rgba(0, 128, 255, 0.15) 100%)'
              e.currentTarget.style.borderColor = degenColors.neonPurple
              e.currentTarget.style.color = degenColors.neonPurple
              e.currentTarget.style.textShadow = `0 0 8px ${degenColors.neonPurple}`
              e.currentTarget.style.boxShadow = `0 0 15px rgba(128, 0, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
              e.currentTarget.style.transform = 'scale(1)'
            }
          }}
        >
          🔥 RESET 🔥
        </button>
      )}

      {/* CSS ANIMATIONS - INJECT INTO DOCUMENT */}
      <style>{`
        @keyframes degenPulse {
          0%, 100% { 
            box-shadow: 0 0 25px rgba(0, 255, 65, 0.4), 0 6px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }
          50% { 
            box-shadow: 0 0 35px rgba(0, 255, 65, 0.6), 0 8px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          }
        }
        
        @keyframes degenShake {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-1px); }
          20% { transform: translateX(1px); }
          30% { transform: translateX(-1px); }
          40% { transform: translateX(1px); }
          50% { transform: translateX(0); }
          90% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}