import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useCurrentToken } from 'gamba-react-ui-v2'
import { formatAmountWithSymbol } from '../../utils/formatAmount'

interface CrashResult {
  targetMultiplier: number
  crashMultiplier: number
  wasWin: boolean
  amount: number
}

export interface CrashPaytableRef {
  trackGame: (result: CrashResult) => void
}

interface CrashPaytableProps {
  wager: number
  targetMultiplier: number
  currentResult?: CrashResult
}

// Common multiplier ranges for crash games
const MULTIPLIER_RANGES = [
  { range: '1.00x - 1.50x', probability: '68%', color: '#22c55e' },
  { range: '1.50x - 2.00x', probability: '20%', color: '#3b82f6' },
  { range: '2.00x - 5.00x', probability: '10%', color: '#a855f7' },
  { range: '5.00x - 10.00x', probability: '1.5%', color: '#f59e0b' },
  { range: '10.00x+', probability: '0.5%', color: '#ef4444' }
]

const CrashPaytable = forwardRef<CrashPaytableRef, CrashPaytableProps>(
  ({ wager, targetMultiplier, currentResult }, ref) => {
    const token = useCurrentToken()
    const [sessionStats, setSessionStats] = useState({
      totalGames: 0,
      totalWins: 0,
      totalWinAmount: 0,
      recentResults: [] as CrashResult[],
      averageCrash: 0,
      bestCrash: 0
    })

    useImperativeHandle(ref, () => ({
      trackGame: (result: CrashResult) => {
        setSessionStats(prev => ({
          totalGames: prev.totalGames + 1,
          totalWins: prev.totalWins + (result.wasWin ? 1 : 0),
          totalWinAmount: prev.totalWinAmount + (result.wasWin ? result.amount : 0),
          recentResults: [result, ...prev.recentResults].slice(0, 10),
          averageCrash: prev.totalGames > 0 
            ? ((prev.averageCrash * prev.totalGames) + result.crashMultiplier) / (prev.totalGames + 1)
            : result.crashMultiplier,
          bestCrash: Math.max(prev.bestCrash, result.crashMultiplier)
        }))
      }
    }), [])

    const winRate = sessionStats.totalGames > 0 ? (sessionStats.totalWins / sessionStats.totalGames * 100).toFixed(1) : '0.0'
    const netProfit = sessionStats.totalWinAmount - (sessionStats.totalGames * wager)
    const targetPayout = targetMultiplier * wager

    return (
      <div style={{
        height: '100%',
        maxWidth: '320px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 16,
        background: 'rgba(15, 15, 25, 0.95)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: 12
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}>
            🚀 CRASH STATS
          </h3>
        </div>

        {/* Session Statistics */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          padding: 16,
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#fbbf24',
            marginBottom: 12,
            textAlign: 'center'
          }}>
            Session Stats
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Launches</span>
              <span style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: 600 }}>
                {sessionStats.totalGames}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Success Rate</span>
              <span style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: 600 }}>
                {winRate}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Avg Crash</span>
              <span style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: 600 }}>
                {sessionStats.averageCrash.toFixed(2)}x
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Best Crash</span>
              <span style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 600 }}>
                {sessionStats.bestCrash.toFixed(2)}x
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Net P&L</span>
              <span style={{ 
                color: netProfit >= 0 ? '#22c55e' : '#ef4444', 
                fontSize: '13px', 
                fontWeight: 600 
              }}>
                {formatAmountWithSymbol(netProfit, token, { showPlusSign: true })}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

CrashPaytable.displayName = 'CrashPaytable'

export default CrashPaytable
