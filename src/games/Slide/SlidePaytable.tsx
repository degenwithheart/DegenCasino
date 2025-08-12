import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useCurrentToken } from 'gamba-react-ui-v2'
import { formatAmountWithSymbol } from '../../utils/formatAmount'

export interface SlidePaytableRef {
  trackSpin: (data: {
    multiplier: number
    win: boolean
    wager: number
    payout: number
  }) => void
}

interface SlideResult {
  multiplier: number
  win: boolean
  wager: number
  payout: number
  timestamp: number
}

interface SlidePaytableProps {}

const SlidePaytable = forwardRef<SlidePaytableRef, SlidePaytableProps>((props, ref) => {
  const [sessionStats, setSessionStats] = useState({
    totalSpins: 0,
    totalWagered: 0,
    totalWon: 0,
    winCount: 0,
    multiplierHits: {} as Record<string, number>
  })
  
  const [recentResults, setRecentResults] = useState<SlideResult[]>([])
  const [multiplierStats, setMultiplierStats] = useState<Record<string, { hits: number; lastHit?: number }>>({})

  useImperativeHandle(ref, () => ({
    trackSpin: (data) => {
      const now = Date.now()
      const multiplierKey = data.multiplier.toFixed(2)
      
      // Update session stats
      setSessionStats(prev => ({
        totalSpins: prev.totalSpins + 1,
        totalWagered: prev.totalWagered + data.wager,
        totalWon: prev.totalWon + data.payout,
        winCount: prev.winCount + (data.win ? 1 : 0),
        multiplierHits: {
          ...prev.multiplierHits,
          [multiplierKey]: (prev.multiplierHits[multiplierKey] || 0) + 1
        }
      }))
      
      // Update multiplier stats
      setMultiplierStats(prev => ({
        ...prev,
        [multiplierKey]: {
          hits: (prev[multiplierKey]?.hits || 0) + 1,
          lastHit: now
        }
      }))
      
      // Add to recent results
      const newResult: SlideResult = {
        ...data,
        timestamp: now
      }
      setRecentResults(prev => [newResult, ...prev.slice(0, 9)])
    }
  }))

  const winRate = sessionStats.totalSpins > 0 ? (sessionStats.winCount / sessionStats.totalSpins) * 100 : 0
  const netPnL = sessionStats.totalWon - sessionStats.totalWagered

  // Standard Slide multipliers (from game logic)
  const slideMultipliers = [0, 1.2, 1.5, 2.0, 3.0, 5.0, 10.0, 25.0, 50.0]

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 12,
      padding: 16,
      color: '#fff',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
      
      {/* Header */}
      <div style={{
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: 12
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center'
        }}>
          📊 Slide Analytics
        </h3>
      </div>

      {/* Session Stats */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        padding: 12
      }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#ffd93d' }}>Session Statistics</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
          <div>
            <div style={{ color: '#aaa' }}>Total Spins:</div>
            <div style={{ fontWeight: 'bold' }}>{sessionStats.totalSpins}</div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>Win Rate:</div>
            <div style={{ 
              fontWeight: 'bold',
              color: winRate >= 50 ? '#4ade80' : winRate >= 25 ? '#fbbf24' : '#ef4444'
            }}>
              {winRate.toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>Net P&L:</div>
            <div style={{ 
              fontWeight: 'bold',
              color: netPnL > 0 ? '#4ade80' : netPnL < 0 ? '#ef4444' : '#fff'
            }}>
              {netPnL > 0 ? '+' : ''}{netPnL.toFixed(4)}
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>Wins/Total:</div>
            <div style={{ fontWeight: 'bold' }}>{sessionStats.winCount}/{sessionStats.totalSpins}</div>
          </div>
        </div>
      </div>

      {/* Multiplier Distribution */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        padding: 12,
        flex: 1
      }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#ff6b6b' }}>Multiplier Distribution</h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 6,
          fontSize: 11
        }}>
          {slideMultipliers.map(mult => {
            const key = mult.toFixed(2)
            const hits = sessionStats.multiplierHits[key] || 0
            const percentage = sessionStats.totalSpins > 0 ? (hits / sessionStats.totalSpins) * 100 : 0
            const isHot = hits > 0 && percentage > (100 / slideMultipliers.length)
            
            return (
              <div
                key={mult}
                style={{
                  background: isHot 
                    ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(255, 217, 61, 0.2))'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: isHot ? '1px solid rgba(255, 107, 107, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 6,
                  padding: 6,
                  textAlign: 'center'
                }}
              >
                <div style={{ 
                  fontWeight: 'bold',
                  color: mult === 0 ? '#ef4444' : mult >= 10 ? '#ffd93d' : '#fff'
                }}>
                  {mult}x
                </div>
                <div style={{ color: '#aaa', fontSize: 10 }}>
                  {hits} hits
                </div>
                <div style={{ 
                  color: isHot ? '#ffd93d' : '#666',
                  fontSize: 10
                }}>
                  {percentage.toFixed(1)}%
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Live Tracking Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 8,
        background: 'rgba(34, 197, 94, 0.1)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        borderRadius: 6
      }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#22c55e',
          animation: 'pulse 2s infinite'
        }} />
        <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 'bold' }}>
          LIVE TRACKING
        </span>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  )
})

SlidePaytable.displayName = 'SlidePaytable'
export default SlidePaytable
