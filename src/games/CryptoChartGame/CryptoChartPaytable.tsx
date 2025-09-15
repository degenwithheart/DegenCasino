import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useCurrentToken } from 'gamba-react-ui-v2'
import { formatAmountWithSymbol } from '../../utils/formatAmount'

interface CryptoChartResult {
  targetMultiplier: number
  finalMultiplier: number
  wasWin: boolean
  amount: number
}

export interface CryptoChartPaytableRef {
  trackGame: (result: CryptoChartResult) => void
}

interface CryptoChartPaytableProps {
  wager: number
  targetMultiplier: number
  currentMultiplier: number
  currentResult?: CryptoChartResult
}

// SOL price ranges for visual reference
const PRICE_RANGES = [
  { range: '$100 - $150', multiplier: '1.00x - 1.50x', color: '#22c55e' },
  { range: '$150 - $200', multiplier: '1.50x - 2.00x', color: '#3b82f6' },
  { range: '$200 - $300', multiplier: '2.00x - 3.00x', color: '#a855f7' },
  { range: '$300 - $500', multiplier: '3.00x - 5.00x', color: '#f59e0b' },
  { range: '$500+', multiplier: '5.00x+', color: '#ef4444' }
]

const CryptoChartPaytable = forwardRef<CryptoChartPaytableRef, CryptoChartPaytableProps>(
  ({ wager, targetMultiplier, currentMultiplier, currentResult }, ref) => {
    const token = useCurrentToken()
    const [sessionStats, setSessionStats] = useState({
      totalGames: 0,
      totalWins: 0,
      totalWinAmount: 0,
      recentResults: [] as CryptoChartResult[],
      averageTarget: 0,
      bestMultiplier: 0,
      currentStreak: 0,
      bestStreak: 0
    })

    useImperativeHandle(ref, () => ({
      trackGame: (result: CryptoChartResult) => {
        setSessionStats(prev => {
          const newStreak = result.wasWin ? prev.currentStreak + 1 : 0
          
          return {
            totalGames: prev.totalGames + 1,
            totalWins: prev.totalWins + (result.wasWin ? 1 : 0),
            totalWinAmount: prev.totalWinAmount + (result.wasWin ? result.amount : 0),
            recentResults: [result, ...prev.recentResults].slice(0, 10),
            averageTarget: prev.totalGames > 0 
              ? ((prev.averageTarget * prev.totalGames) + result.targetMultiplier) / (prev.totalGames + 1)
              : result.targetMultiplier,
            bestMultiplier: Math.max(prev.bestMultiplier, result.finalMultiplier),
            currentStreak: newStreak,
            bestStreak: Math.max(prev.bestStreak, newStreak)
          }
        })
      }
    }), [])

    const winRate = sessionStats.totalGames > 0 ? (sessionStats.totalWins / sessionStats.totalGames * 100).toFixed(1) : '0.0'
    const netProfit = sessionStats.totalWinAmount - (sessionStats.totalGames * wager)
    const targetPayout = targetMultiplier * wager
    const currentPrice = 100 + (currentMultiplier - 1) * 100 // Convert multiplier to SOL price

    return (
    <div className="cryptochartgame-paytable" style={{
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
            📈 SOL CHART STATS
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
            Trading Stats
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Trades</span>
              <span style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: 600 }}>
                {sessionStats.totalGames}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Win Rate</span>
              <span style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: 600 }}>
                {winRate}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Avg Target</span>
              <span style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: 600 }}>
                {sessionStats.averageTarget.toFixed(2)}x
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Best Peak</span>
              <span style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 600 }}>
                {sessionStats.bestMultiplier.toFixed(2)}x
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Win Streak</span>
              <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: 600 }}>
                {sessionStats.currentStreak}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Best Streak</span>
              <span style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 600 }}>
                {sessionStats.bestStreak}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Net P&L</span>
              <span style={{ 
                color: netProfit >= 0 ? '#22c55e' : '#ef4444', 
                fontSize: '13px', 
                fontWeight: 600 
              }}>
                {netProfit >= 0 ? '+' : ''}{netProfit.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

CryptoChartPaytable.displayName = 'CryptoChartPaytable'

export default CryptoChartPaytable
