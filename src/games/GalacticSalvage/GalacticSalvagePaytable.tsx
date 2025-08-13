import { TokenValue } from 'gamba-react-ui-v2'
import { useCurrentToken } from 'gamba-react-ui-v2'
import React from 'react'
import { useIsCompact } from '../../hooks/useIsCompact'

interface GalacticSalvageResult {
  choice: 'safe' | 'risky' | 'extreme'
  resultIndex: number
  wasWin: boolean
  amount: number
  multiplier: number
}

export interface GalacticSalvagePaytableRef {
  trackGame: (result: GalacticSalvageResult) => void
}

interface GalacticSalvagePaytableProps {
  wager: number
  selectedChoice: 'safe' | 'risky' | 'extreme'
}

const GalacticSalvagePaytable = React.forwardRef<GalacticSalvagePaytableRef, GalacticSalvagePaytableProps>(
  ({ wager, selectedChoice }, ref) => {
    const token = useCurrentToken()
    const [results, setResults] = React.useState<GalacticSalvageResult[]>([])
    const [stats, setStats] = React.useState({
      totalMissions: 0,
      successfulSalvages: 0,
      totalHaul: 0,
      successRate: 0,
      averageMultiplier: 0,
      biggestFind: 0,
      safeMissions: 0,
      riskyMissions: 0,
      extremeMissions: 0,
      currentStreak: 0,
      isSuccessStreak: false,
      bestStreak: 0,
    })

    const isCompact = useIsCompact()

    React.useImperativeHandle(ref, () => ({
      trackGame: (result: GalacticSalvageResult) => {
        setResults(prev => [result, ...prev.slice(0, 9)]) // Keep last 10
        setStats(prev => {
          const newTotal = prev.totalMissions + 1
          const newSuccesses = prev.successfulSalvages + (result.wasWin ? 1 : 0)
          const newHaul = prev.totalHaul + result.amount
          const newSuccessRate = (newSuccesses / newTotal) * 100

          // Streak tracking
          let newCurrentStreak = prev.currentStreak
          let newIsSuccessStreak = prev.isSuccessStreak
          let newBestStreak = prev.bestStreak

          if (result.wasWin) {
            if (prev.isSuccessStreak) {
              newCurrentStreak++
            } else {
              newCurrentStreak = 1
              newIsSuccessStreak = true
            }
          } else {
            if (!prev.isSuccessStreak) {
              newCurrentStreak++
            } else {
              newCurrentStreak = 1
              newIsSuccessStreak = false
            }
          }

          if (result.wasWin && newCurrentStreak > newBestStreak) {
            newBestStreak = newCurrentStreak
          }

          return {
            totalMissions: newTotal,
            successfulSalvages: newSuccesses,
            totalHaul: newHaul,
            successRate: newSuccessRate,
            averageMultiplier: newSuccesses > 0 ? (newHaul + wager * newSuccesses) / (wager * newSuccesses) : 0,
            biggestFind: Math.max(prev.biggestFind, result.multiplier),
            safeMissions: prev.safeMissions + (result.choice === 'safe' ? 1 : 0),
            riskyMissions: prev.riskyMissions + (result.choice === 'risky' ? 1 : 0),
            extremeMissions: prev.extremeMissions + (result.choice === 'extreme' ? 1 : 0),
            currentStreak: newCurrentStreak,
            isSuccessStreak: newIsSuccessStreak,
            bestStreak: newBestStreak,
          }
        })
      }
    }))

    if (isCompact) {
      return null // Hide on mobile
    }

    const getRouteEmoji = (choice: 'safe' | 'risky' | 'extreme') => {
      switch(choice) {
        case 'safe': return '🛡️'
        case 'risky': return '⚡'
        case 'extreme': return '🔥'
      }
    }
    
    const getResultEmoji = (wasWin: boolean) => wasWin ? '💎' : '❌'

    return (
      <div style={{
        width: '320px',
        height: '100%',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
        borderRadius: '24px',
        border: '2px solid rgba(14, 75, 153, 0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(14, 75, 153, 0.3) 0%, rgba(22, 33, 62, 0.3) 100%)',
          padding: '20px',
          borderBottom: '1px solid rgba(100, 181, 246, 0.2)'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 700,
            color: '#64b5f6',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            🚀 SALVAGE LOG
          </h3>
          <div style={{
            fontSize: '12px',
            color: '#9CA3AF',
            textAlign: 'center'
          }}>
            Current Route: {getRouteEmoji(selectedChoice)} {selectedChoice.toUpperCase()}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(100, 181, 246, 0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              background: 'rgba(100, 181, 246, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#64b5f6' }}>
                {stats.totalMissions}
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                MISSIONS
              </div>
            </div>
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>
                {stats.successRate.toFixed(0)}%
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                SUCCESS
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <div style={{
              background: 'rgba(251, 191, 36, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#fbbf24' }}>
                {stats.biggestFind.toFixed(1)}x
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                BEST FIND
              </div>
            </div>
            <div style={{
              background: stats.isSuccessStreak 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 700, 
                color: stats.isSuccessStreak ? '#22c55e' : '#ef4444' 
              }}>
                {stats.currentStreak}
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                {stats.isSuccessStreak ? 'WIN' : 'FAIL'} STREAK
              </div>
            </div>
          </div>

          {/* Route Distribution */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>
              ROUTE DISTRIBUTION
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#64b5f6' }}>🛡️ {stats.safeMissions}</span>
              <span style={{ color: '#fbbf24' }}>⚡ {stats.riskyMissions}</span>
              <span style={{ color: '#ef4444' }}>🔥 {stats.extremeMissions}</span>
            </div>
          </div>
        </div>

        {/* Recent Results */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '16px 16px 8px 16px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#64b5f6'
          }}>
            Recent Missions
          </div>
          
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 16px 16px 16px'
          }}>
            {results.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#6B7280',
                fontSize: '12px',
                marginTop: '20px'
              }}>
                No missions completed yet
              </div>
            ) : (
              results.map((result, index) => (
                <div
                  key={index}
                  style={{
                    background: result.wasWin 
                      ? 'rgba(34, 197, 94, 0.1)' 
                      : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${result.wasWin ? '#22c55e40' : '#ef444440'}`,
                    borderRadius: '8px',
                    padding: '10px',
                    marginBottom: '8px',
                    fontSize: '12px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      color: result.wasWin ? '#22c55e' : '#ef4444',
                      fontWeight: 600
                    }}>
                      {getResultEmoji(result.wasWin)} {result.wasWin ? 'SUCCESS' : 'FAILED'}
                    </span>
                    <span style={{
                      color: result.wasWin ? '#22c55e' : '#ef4444',
                      fontWeight: 700
                    }}>
                      {result.wasWin ? `${result.multiplier.toFixed(1)}x` : '0x'}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#9CA3AF',
                    fontSize: '11px'
                  }}>
                    <span>Route: {getRouteEmoji(result.choice)} {result.choice}</span>
                    <span>Sector {result.resultIndex + 1}</span>
                  </div>
                  {result.wasWin && (
                    <div style={{
                      marginTop: '4px',
                      color: '#64b5f6',
                      fontSize: '11px'
                    }}>
                      <TokenValue amount={result.amount} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Current Wager Display */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid rgba(100, 181, 246, 0.1)',
          background: 'rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#9CA3AF',
            marginBottom: '4px'
          }}>
            Mission Investment
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#64b5f6'
          }}>
            <TokenValue amount={wager} />
          </div>
        </div>
      </div>
    )
  }
)

GalacticSalvagePaytable.displayName = 'GalacticSalvagePaytable'

export default GalacticSalvagePaytable
