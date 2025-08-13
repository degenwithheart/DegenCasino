import { TokenValue } from 'gamba-react-ui-v2'
import { useCurrentToken } from 'gamba-react-ui-v2'
import React from 'react'
import { useIsCompact } from '../../hooks/useIsCompact'

interface NeonCyberHackResult {
  choice: 'stealth' | 'brute' | 'elite'
  resultIndex: number
  wasWin: boolean
  amount: number
  multiplier: number
}

export interface NeonCyberHackPaytableRef {
  trackGame: (result: NeonCyberHackResult) => void
}

interface NeonCyberHackPaytableProps {
  wager: number
  selectedChoice: 'stealth' | 'brute' | 'elite'
}

const NeonCyberHackPaytable = React.forwardRef<NeonCyberHackPaytableRef, NeonCyberHackPaytableProps>(
  ({ wager, selectedChoice }, ref) => {
    const token = useCurrentToken()
    const [results, setResults] = React.useState<NeonCyberHackResult[]>([])
    const [stats, setStats] = React.useState({
      totalHacks: 0,
      successfulBreaches: 0,
      totalData: 0,
      successRate: 0,
      averageMultiplier: 0,
      biggestBreach: 0,
      stealthHacks: 0,
      bruteHacks: 0,
      eliteHacks: 0,
      currentStreak: 0,
      isSuccessStreak: false,
      bestStreak: 0,
    })

    const isCompact = useIsCompact()

    React.useImperativeHandle(ref, () => ({
      trackGame: (result: NeonCyberHackResult) => {
        setResults(prev => [result, ...prev.slice(0, 9)])
        setStats(prev => {
          const newTotal = prev.totalHacks + 1
          const newSuccesses = prev.successfulBreaches + (result.wasWin ? 1 : 0)
          const newData = prev.totalData + result.amount
          const newSuccessRate = (newSuccesses / newTotal) * 100

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
            totalHacks: newTotal,
            successfulBreaches: newSuccesses,
            totalData: newData,
            successRate: newSuccessRate,
            averageMultiplier: newSuccesses > 0 ? (newData + wager * newSuccesses) / (wager * newSuccesses) : 0,
            biggestBreach: Math.max(prev.biggestBreach, result.multiplier),
            stealthHacks: prev.stealthHacks + (result.choice === 'stealth' ? 1 : 0),
            bruteHacks: prev.bruteHacks + (result.choice === 'brute' ? 1 : 0),
            eliteHacks: prev.eliteHacks + (result.choice === 'elite' ? 1 : 0),
            currentStreak: newCurrentStreak,
            isSuccessStreak: newIsSuccessStreak,
            bestStreak: newBestStreak,
          }
        })
      }
    }))

    if (isCompact) return null

    const getMethodEmoji = (choice: 'stealth' | 'brute' | 'elite') => {
      switch(choice) {
        case 'stealth': return '🥷'
        case 'brute': return '💥'
        case 'elite': return '🎯'
      }
    }
    
    const getResultEmoji = (wasWin: boolean) => wasWin ? '🔓' : '🚫'

    return (
      <div style={{
        width: '320px',
        height: '100%',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        borderRadius: '24px',
        border: '2px solid rgba(83, 52, 131, 0.5)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'monospace'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.2) 100%)',
          padding: '20px',
          borderBottom: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 700,
            color: '#22c55e',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            💻 HACK_LOG
          </h3>
          <div style={{
            fontSize: '12px',
            color: '#9CA3AF',
            textAlign: 'center'
          }}>
            METHOD: {getMethodEmoji(selectedChoice)} {selectedChoice.toUpperCase()}
          </div>
        </div>

        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(34, 197, 94, 0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>
                {stats.totalHacks}
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                ATTEMPTS
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
              background: 'rgba(147, 51, 234, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#9333ea' }}>
                {stats.biggestBreach.toFixed(1)}x
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                MAX_BREACH
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
                {stats.isSuccessStreak ? 'SUCCESS' : 'FAIL'}_STREAK
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '8px',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>
              METHOD_DISTRIBUTION
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#22c55e' }}>🥷 {stats.stealthHacks}</span>
              <span style={{ color: '#f59e0b' }}>💥 {stats.bruteHacks}</span>
              <span style={{ color: '#9333ea' }}>🎯 {stats.eliteHacks}</span>
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
            color: '#22c55e'
          }}>
            RECENT_OPERATIONS
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
                NO_OPERATIONS_LOGGED
              </div>
            ) : (
              results.map((result, index) => (
                <div
                  key={index}
                  style={{
                    background: result.wasWin 
                      ? 'rgba(34, 197, 94, 0.15)' 
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
                      {getResultEmoji(result.wasWin)} {result.wasWin ? 'ACCESS' : 'BLOCKED'}
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
                    <span>METHOD: {getMethodEmoji(result.choice)} {result.choice}</span>
                    <span>SRV_{(result.resultIndex + 1).toString().padStart(2, '0')}</span>
                  </div>
                  {result.wasWin && (
                    <div style={{
                      marginTop: '4px',
                      color: '#22c55e',
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
          borderTop: '1px solid rgba(34, 197, 94, 0.1)',
          background: 'rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#9CA3AF',
            marginBottom: '4px'
          }}>
            OPERATION_BUDGET
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#22c55e'
          }}>
            <TokenValue amount={wager} />
          </div>
        </div>
      </div>
    )
  }
)

NeonCyberHackPaytable.displayName = 'NeonCyberHackPaytable'

export default NeonCyberHackPaytable
