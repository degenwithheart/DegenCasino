import { TokenValue } from 'gamba-react-ui-v2'
import { useCurrentToken } from 'gamba-react-ui-v2'
import React from 'react'
import { useIsCompact } from '../../src/hooks/useIsCompact'

interface PyramidQuestResult {
  choice: 'main' | 'secret' | 'side'
  resultIndex: number
  wasWin: boolean
  amount: number
  multiplier: number
}

export interface PyramidQuestPaytableRef {
  trackGame: (result: PyramidQuestResult) => void
}

interface PyramidQuestPaytableProps {
  wager: number
  selectedChoice: 'main' | 'secret' | 'side'
}

const PyramidQuestPaytable = React.forwardRef<PyramidQuestPaytableRef, PyramidQuestPaytableProps>(
  ({ wager, selectedChoice }, ref) => {
    const token = useCurrentToken()
    const [results, setResults] = React.useState<PyramidQuestResult[]>([])
    const [stats, setStats] = React.useState({
      totalExpeditions: 0,
      treasuresFound: 0,
      totalGold: 0,
      successRate: 0,
      averageMultiplier: 0,
      biggestTreasure: 0,
      mainExpeditions: 0,
      secretExpeditions: 0,
      sideExpeditions: 0,
      currentStreak: 0,
      isTreasureStreak: false,
      bestStreak: 0,
    })

    const isCompact = useIsCompact()

    React.useImperativeHandle(ref, () => ({
      trackGame: (result: PyramidQuestResult) => {
        setResults(prev => [result, ...prev.slice(0, 9)]) // Keep last 10
        setStats(prev => {
          const newTotal = prev.totalExpeditions + 1
          const newTreasures = prev.treasuresFound + (result.wasWin ? 1 : 0)
          const newGold = prev.totalGold + result.amount
          const newSuccessRate = (newTreasures / newTotal) * 100

          // Streak tracking
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
            totalExpeditions: newTotal,
            treasuresFound: newTreasures,
            totalGold: newGold,
            successRate: newSuccessRate,
            averageMultiplier: newTreasures > 0 ? (newGold + wager * newTreasures) / (wager * newTreasures) : 0,
            biggestTreasure: Math.max(prev.biggestTreasure, result.multiplier),
            mainExpeditions: prev.mainExpeditions + (result.choice === 'main' ? 1 : 0),
            secretExpeditions: prev.secretExpeditions + (result.choice === 'secret' ? 1 : 0),
            sideExpeditions: prev.sideExpeditions + (result.choice === 'side' ? 1 : 0),
            currentStreak: newCurrentStreak,
            isTreasureStreak: newIsTreasureStreak,
            bestStreak: newBestStreak,
          }
        })
      }
    }))

    if (isCompact) {
      return null // Hide on mobile
    }

    const getEntranceEmoji = (choice: 'main' | 'secret' | 'side') => {
      switch(choice) {
        case 'main': return '🚪'
        case 'secret': return '🕳️'
        case 'side': return '📍'
      }
    }
    
    const getResultEmoji = (wasWin: boolean) => wasWin ? '💰' : '💀'

    return (
      <div style={{
        width: '320px',
        height: '100%',
        background: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)',
        borderRadius: '24px',
        border: '2px solid rgba(202, 138, 4, 0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(202, 138, 4, 0.3) 0%, rgba(161, 98, 7, 0.3) 100%)',
          padding: '20px',
          borderBottom: '1px solid rgba(234, 179, 8, 0.2)'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 700,
            color: '#eab308',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            🏺 EXPEDITION LOG
          </h3>
          <div style={{
            fontSize: '12px',
            color: '#9CA3AF',
            textAlign: 'center'
          }}>
            Current Path: {getEntranceEmoji(selectedChoice)} {selectedChoice.toUpperCase()}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(234, 179, 8, 0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              background: 'rgba(234, 179, 8, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#eab308' }}>
                {stats.totalExpeditions}
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                EXPEDITIONS
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
                {stats.biggestTreasure.toFixed(1)}x
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                BEST FIND
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
                {stats.isTreasureStreak ? 'TREASURE' : 'TRAP'} STREAK
              </div>
            </div>
          </div>

          {/* Entrance Distribution */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>
              ENTRANCE USAGE
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#eab308' }}>🚪 {stats.mainExpeditions}</span>
              <span style={{ color: '#fbbf24' }}>🕳️ {stats.secretExpeditions}</span>
              <span style={{ color: '#ca8a04' }}>📍 {stats.sideExpeditions}</span>
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
            color: '#eab308'
          }}>
            Recent Expeditions
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
                No expeditions completed yet
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
                      {getResultEmoji(result.wasWin)} {result.wasWin ? 'TREASURE' : 'TRAPPED'}
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
                    <span>Path: {getEntranceEmoji(result.choice)} {result.choice}</span>
                    <span>Chamber {result.resultIndex + 1}</span>
                  </div>
                  {result.wasWin && (
                    <div style={{
                      marginTop: '4px',
                      color: '#eab308',
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
          borderTop: '1px solid rgba(234, 179, 8, 0.1)',
          background: 'rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#9CA3AF',
            marginBottom: '4px'
          }}>
            Expedition Fund
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#eab308'
          }}>
            <TokenValue amount={wager} />
          </div>
        </div>
      </div>
    )
  }
)

PyramidQuestPaytable.displayName = 'PyramidQuestPaytable'

export default PyramidQuestPaytable
