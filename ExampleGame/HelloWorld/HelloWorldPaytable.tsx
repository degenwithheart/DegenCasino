import { TokenValue, formatAmountWithSymbol } from 'gamba-react-ui-v2'
import { useCurrentToken } from 'gamba-react-ui-v2'
import React from 'react'
import { useIsCompact } from '../../hooks/useIsCompact';

interface HelloWorldResult {
  choice: 'lucky' | 'risky'
  resultIndex: number
  wasWin: boolean
  amount: number
  multiplier: number
}

export interface HelloWorldPaytableRef {
  trackGame: (result: HelloWorldResult) => void
}

interface HelloWorldPaytableProps {
  wager: number
  selectedChoice: 'lucky' | 'risky'
}

const HelloWorldPaytable = React.forwardRef<HelloWorldPaytableRef, HelloWorldPaytableProps>(
  ({ wager, selectedChoice }, ref) => {
    const token = useCurrentToken()
    const [results, setResults] = React.useState<HelloWorldResult[]>([])
    const [stats, setStats] = React.useState({
      totalGames: 0,
      totalWins: 0,
      totalAmount: 0,
      winRate: 0,
      averageMultiplier: 0,
      biggestWin: 0,
      luckyGames: 0,
      riskyGames: 0,
      currentStreak: 0,
      isWinStreak: false,
      bestStreak: 0,
    })

    const isCompact = useIsCompact()

    React.useImperativeHandle(ref, () => ({
      trackGame: (result: HelloWorldResult) => {
        setResults(prev => [result, ...prev.slice(0, 9)]) // Keep last 10
        setStats(prev => {
          const newTotal = prev.totalGames + 1
          const newWins = prev.totalWins + (result.wasWin ? 1 : 0)
          const newAmount = prev.totalAmount + result.amount
          const newWinRate = (newWins / newTotal) * 100

          // Streak tracking
          let newCurrentStreak = prev.currentStreak
          let newIsWinStreak = prev.isWinStreak
          let newBestStreak = prev.bestStreak

          if (result.wasWin) {
            if (prev.isWinStreak) {
              newCurrentStreak++
            } else {
              newCurrentStreak = 1
              newIsWinStreak = true
            }
          } else {
            if (!prev.isWinStreak) {
              newCurrentStreak++
            } else {
              newCurrentStreak = 1
              newIsWinStreak = false
            }
          }

          if (result.wasWin && newCurrentStreak > newBestStreak) {
            newBestStreak = newCurrentStreak
          }

          return {
            totalGames: newTotal,
            totalWins: newWins,
            totalAmount: newAmount,
            winRate: newWinRate,
            averageMultiplier: newWins > 0 ? (newAmount + wager * newWins) / (wager * newWins) : 0,
            biggestWin: Math.max(prev.biggestWin, result.multiplier),
            luckyGames: prev.luckyGames + (result.choice === 'lucky' ? 1 : 0),
            riskyGames: prev.riskyGames + (result.choice === 'risky' ? 1 : 0),
            currentStreak: newCurrentStreak,
            isWinStreak: newIsWinStreak,
            bestStreak: newBestStreak,
          }
        })
      }
    }))

    if (isCompact) {
      return null // Hide on mobile
    }

    const getChoiceEmoji = (choice: 'lucky' | 'risky') => choice === 'lucky' ? '🍀' : '🎯'
    const getResultEmoji = (wasWin: boolean) => wasWin ? '✅' : '❌'

    return (
      <div style={{
        width: '320px',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: 'fit-content',
        maxHeight: '100%',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '16px'
        }}>
          <h3 style={{
            color: '#fff',
            margin: 0,
            fontSize: '18px',
            fontWeight: 700,
            background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🌍 Hello World Stats
          </h3>
          <div style={{
            color: '#9CA3AF',
            fontSize: '12px',
            marginTop: '4px'
          }}>
            Live Session Analytics
          </div>
        </div>

        {/* Current Selection */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#60a5fa', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
            CURRENT STRATEGY
          </div>
          <div style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>
            {getChoiceEmoji(selectedChoice)} {selectedChoice.toUpperCase()}
          </div>
          <div style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px' }}>
            Wager: <TokenValue value={wager} />
          </div>
        </div>

        {/* Session Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#22c55e', fontSize: '20px', fontWeight: 700 }}>
              {stats.totalWins}
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '11px' }}>WINS</div>
          </div>
          
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#ef4444', fontSize: '20px', fontWeight: 700 }}>
              {stats.totalGames - stats.totalWins}
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '11px' }}>LOSSES</div>
          </div>
          
          <div style={{
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#a855f7', fontSize: '20px', fontWeight: 700 }}>
              {stats.winRate.toFixed(1)}%
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '11px' }}>WIN RATE</div>
          </div>
          
          <div style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#fbbf24', fontSize: '20px', fontWeight: 700 }}>
              {stats.biggestWin > 0 ? `${stats.biggestWin.toFixed(1)}x` : '-'}
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '11px' }}>BEST WIN</div>
          </div>
        </div>

        {/* Profit/Loss */}
        <div style={{
          background: stats.totalAmount >= 0 
            ? 'rgba(34, 197, 94, 0.1)' 
            : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${stats.totalAmount >= 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          borderRadius: '12px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '4px' }}>
            SESSION P&L
          </div>
          <div style={{
            color: stats.totalAmount >= 0 ? '#22c55e' : '#ef4444',
            fontSize: '18px',
            fontWeight: 700
          }}>
            {stats.totalAmount >= 0 ? '+' : ''}<TokenValue value={stats.totalAmount} />
          </div>
        </div>

        {/* Strategy Breakdown */}
        {stats.totalGames > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '12px'
          }}>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
              Strategy Usage
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ color: '#9CA3AF', fontSize: '12px' }}>🍀 Lucky</span>
              <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 600 }}>
                {stats.luckyGames} ({((stats.luckyGames / stats.totalGames) * 100).toFixed(0)}%)
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9CA3AF', fontSize: '12px' }}>🎯 Risky</span>
              <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>
                {stats.riskyGames} ({((stats.riskyGames / stats.totalGames) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        )}

        {/* Current Streak */}
        {stats.totalGames > 0 && (
          <div style={{
            background: stats.isWinStreak 
              ? 'rgba(34, 197, 94, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${stats.isWinStreak ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            borderRadius: '12px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '4px' }}>
              CURRENT STREAK
            </div>
            <div style={{
              color: stats.isWinStreak ? '#22c55e' : '#ef4444',
              fontSize: '16px',
              fontWeight: 700
            }}>
              {stats.currentStreak} {stats.isWinStreak ? 'WINS' : 'LOSSES'}
            </div>
            {stats.bestStreak > 0 && (
              <div style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '2px' }}>
                Best: {stats.bestStreak} wins
              </div>
            )}
          </div>
        )}

        {/* Recent Results */}
        {results.length > 0 && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '8px'
            }}>
              Recent Results
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {results.map((result, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: result.wasWin 
                      ? 'rgba(34, 197, 94, 0.1)' 
                      : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${result.wasWin ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{getResultEmoji(result.wasWin)}</span>
                    <span>{getChoiceEmoji(result.choice)}</span>
                    <span style={{ color: '#9CA3AF' }}>#{result.resultIndex}</span>
                  </div>
                  <div style={{
                    color: result.wasWin ? '#22c55e' : '#ef4444',
                    fontWeight: 600
                  }}>
                    {result.wasWin ? `+${formatAmountWithSymbol(result.amount, token)}` : formatAmountWithSymbol(result.amount, token)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: '#6B7280',
          fontSize: '11px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '12px'
        }}>
          Statistics reset each session
        </div>
      </div>
    )
  }
)

HelloWorldPaytable.displayName = 'HelloWorldPaytable'

export default HelloWorldPaytable
