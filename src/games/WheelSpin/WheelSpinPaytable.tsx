import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useCurrentToken } from 'gamba-react-ui-v2'
import { formatAmountWithSymbol } from '../../utils/formatAmount'

interface WheelSpinResult {
  segmentIndex: number
  multiplier: number
  wasWin: boolean
  amount: number
}

export interface WheelSpinPaytableRef {
  trackGame: (result: WheelSpinResult) => void
}

interface WheelSpinPaytableProps {
  wager: number
  segments: number[]
  wheelColors: string[]
  currentResult?: WheelSpinResult
}

const WheelSpinPaytable = forwardRef<WheelSpinPaytableRef, WheelSpinPaytableProps>(
  ({ wager, segments, wheelColors, currentResult }, ref) => {
    const [sessionStats, setSessionStats] = useState({
      totalGames: 0,
      totalWins: 0,
      totalWinAmount: 0,
      recentResults: [] as WheelSpinResult[],
      segmentHits: new Array(segments.length).fill(0)
    })

    useImperativeHandle(ref, () => ({
      trackGame: (result: WheelSpinResult) => {
        setSessionStats(prev => {
          const newSegmentHits = [...prev.segmentHits]
          newSegmentHits[result.segmentIndex] = newSegmentHits[result.segmentIndex] + 1
          
          return {
            totalGames: prev.totalGames + 1,
            totalWins: prev.totalWins + (result.wasWin ? 1 : 0),
            totalWinAmount: prev.totalWinAmount + (result.wasWin ? result.amount : 0),
            recentResults: [result, ...prev.recentResults].slice(0, 10),
            segmentHits: newSegmentHits
          }
        })
      }
    }), [])

    const winRate = sessionStats.totalGames > 0 ? (sessionStats.totalWins / sessionStats.totalGames * 100).toFixed(1) : '0.0'
    const netProfit = sessionStats.totalWinAmount - (sessionStats.totalGames * wager)

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
            🎡 WHEEL STATS
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
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Spins</span>
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

WheelSpinPaytable.displayName = 'WheelSpinPaytable'

export default WheelSpinPaytable
