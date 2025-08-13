import { TokenValue } from 'gamba-react-ui-v2'
import { useCurrentToken } from 'gamba-react-ui-v2'
import React from 'react'
import { useIsCompact } from '../../hooks/useIsCompact'

interface PiratesFortuneResult {
  choice: 'coastal' | 'deep' | 'storm'
  resultIndex: number
  wasWin: boolean
  amount: number
  multiplier: number
}

export interface PiratesFortunePaytableRef {
  trackGame: (result: PiratesFortuneResult) => void
}

interface PiratesFortunePaytableProps {
  wager: number
  selectedChoice: 'coastal' | 'deep' | 'storm'
}

const PiratesFortunePaytable = React.forwardRef<PiratesFortunePaytableRef, PiratesFortunePaytableProps>(
  ({ wager, selectedChoice }, ref) => {
    const token = useCurrentToken()
    const [results, setResults] = React.useState<PiratesFortuneResult[]>([])
    const [stats, setStats] = React.useState({
      totalVoyages: 0,
      treasuresFound: 0,
      totalBooty: 0,
      successRate: 0,
      averageMultiplier: 0,
      biggestHaul: 0,
      coastalVoyages: 0,
      deepVoyages: 0,
      stormVoyages: 0,
      currentStreak: 0,
      isTreasureStreak: false,
      bestStreak: 0,
    })

    const isCompact = useIsCompact()

    React.useImperativeHandle(ref, () => ({
      trackGame: (result: PiratesFortuneResult) => {
        setResults(prev => [result, ...prev.slice(0, 9)])
        setStats(prev => {
          const newTotal = prev.totalVoyages + 1
          const newTreasures = prev.treasuresFound + (result.wasWin ? 1 : 0)
          const newBooty = prev.totalBooty + result.amount
          const newSuccessRate = (newTreasures / newTotal) * 100

          let newCurrentStreak = prev.currentStreak
          let newIsTreasureStreak = prev.isTreasureStreak
          let newBestStreak = prev.bestStreak

          if (result.wasWin) {
            if (prev.isTreasureStreak) {
              newCurrentStreak++
            } else {
              newCurrentStreak = 1
              newIsTreasureStreak = true
            }
          } else {
            if (!prev.isTreasureStreak) {
              newCurrentStreak++
            } else {
              newCurrentStreak = 1
              newIsTreasureStreak = false
            }
          }

          if (result.wasWin && newCurrentStreak > newBestStreak) {
            newBestStreak = newCurrentStreak
          }

          return {
            totalVoyages: newTotal,
            treasuresFound: newTreasures,
            totalBooty: newBooty,
            successRate: newSuccessRate,
            averageMultiplier: newTreasures > 0 ? (newBooty + wager * newTreasures) / (wager * newTreasures) : 0,
            biggestHaul: Math.max(prev.biggestHaul, result.multiplier),
            coastalVoyages: prev.coastalVoyages + (result.choice === 'coastal' ? 1 : 0),
            deepVoyages: prev.deepVoyages + (result.choice === 'deep' ? 1 : 0),
            stormVoyages: prev.stormVoyages + (result.choice === 'storm' ? 1 : 0),
            currentStreak: newCurrentStreak,
            isTreasureStreak: newIsTreasureStreak,
            bestStreak: newBestStreak,
          }
        })
      }
    }))

    if (isCompact) return null

    const getRouteEmoji = (choice: 'coastal' | 'deep' | 'storm') => {
      switch(choice) {
        case 'coastal': return '🏖️'
        case 'deep': return '🌊'
        case 'storm': return '⛈️'
      }
    }
    
    const getResultEmoji = (wasWin: boolean) => wasWin ? '💰' : '💀'

    return (
      <div style={{
        width: '320px',
        height: '100%',
        background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
        borderRadius: '24px',
        border: '2px solid rgba(14, 165, 233, 0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.3) 0%, rgba(12, 74, 110, 0.3) 100%)',
          padding: '20px',
          borderBottom: '1px solid rgba(56, 189, 248, 0.2)'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 700,
            color: '#38bdf8',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            🏴‍☠️ CAPTAIN'S LOG
          </h3>
          <div style={{
            fontSize: '12px',
            color: '#9CA3AF',
            textAlign: 'center'
          }}>
            Current Route: {getRouteEmoji(selectedChoice)} {selectedChoice.toUpperCase()}
          </div>
        </div>

        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(56, 189, 248, 0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              background: 'rgba(56, 189, 248, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#38bdf8' }}>
                {stats.totalVoyages}
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                VOYAGES
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
                {stats.biggestHaul.toFixed(1)}x
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                BEST HAUL
              </div>
            </div>
            <div style={{
              background: stats.isTreasureStreak 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 700, 
                color: stats.isTreasureStreak ? '#22c55e' : '#ef4444' 
              }}>
                {stats.currentStreak}
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                {stats.isTreasureStreak ? 'TREASURE' : 'LOST'} STREAK
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>
              ROUTE PREFERENCE
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#38bdf8' }}>🏖️ {stats.coastalVoyages}</span>
              <span style={{ color: '#0ea5e9' }}>🌊 {stats.deepVoyages}</span>
              <span style={{ color: '#0284c7' }}>⛈️ {stats.stormVoyages}</span>
            </div>
          </div>
        </div>

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
            color: '#38bdf8'
          }}>
            Recent Voyages
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
                No voyages completed yet
              </div>
            ) : (
              results.map((result, index) => (
                <div
                  key={index}
                  style={{
                    background: result.wasWin 
                      ? 'rgba(234, 179, 8, 0.2)' 
                      : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${result.wasWin ? '#eab30840' : '#ef444440'}`,
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
                      color: result.wasWin ? '#eab308' : '#ef4444',
                      fontWeight: 600
                    }}>
                      {getResultEmoji(result.wasWin)} {result.wasWin ? 'TREASURE' : 'LOST'}
                    </span>
                    <span style={{
                      color: result.wasWin ? '#eab308' : '#ef4444',
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
                    <span>Island {result.resultIndex + 1}</span>
                  </div>
                  {result.wasWin && (
                    <div style={{
                      marginTop: '4px',
                      color: '#38bdf8',
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

        <div style={{
          padding: '16px',
          borderTop: '1px solid rgba(56, 189, 248, 0.1)',
          background: 'rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#9CA3AF',
            marginBottom: '4px'
          }}>
            Voyage Investment
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#38bdf8'
          }}>
            <TokenValue amount={wager} />
          </div>
        </div>
      </div>
    )
  }
)

PiratesFortunePaytable.displayName = 'PiratesFortunePaytable'

export default PiratesFortunePaytable
