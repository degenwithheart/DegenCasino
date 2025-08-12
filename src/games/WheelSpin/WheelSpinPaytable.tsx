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
            🎡 WHEEL SEGMENTS
          </h3>
        </div>

        {/* Segment Paytable */}
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
            Segment Payouts
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {segments.map((multiplier, index) => {
              const payout = multiplier * wager
              const isCurrentResult = currentResult?.segmentIndex === index
              const hitCount = sessionStats.segmentHits[index]
              const hitRate = sessionStats.totalGames > 0 ? ((hitCount / sessionStats.totalGames) * 100).toFixed(1) : '0.0'
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: isCurrentResult
                      ? (currentResult?.wasWin ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)')
                      : 'rgba(255, 255, 255, 0.05)',
                    border: isCurrentResult 
                      ? (currentResult?.wasWin ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)')
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s ease',
                    animation: isCurrentResult ? 'pulse 1s ease-in-out 3' : undefined
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div 
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: wheelColors[index] || '#666',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    />
                    <span style={{
                      color: '#e5e7eb',
                      fontSize: '14px',
                      fontWeight: 500
                    }}>
                      Segment {index + 1}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{
                      color: multiplier > 0 ? '#fbbf24' : '#ef4444',
                      fontWeight: 700,
                      fontSize: '14px'
                    }}>
                      {multiplier > 0 ? `${multiplier}x` : 'Loss'}
                    </span>
                    {multiplier > 0 && (
                      <span style={{
                        color: '#9ca3af',
                        fontSize: '11px'
                      }}>
                        {payout.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
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

        {/* Segment Hit Statistics */}
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
            Hit Distribution
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {segments.map((multiplier, index) => {
              const hitCount = sessionStats.segmentHits[index]
              const hitRate = sessionStats.totalGames > 0 ? ((hitCount / sessionStats.totalGames) * 100).toFixed(1) : '0.0'
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div 
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: wheelColors[index] || '#666'
                      }}
                    />
                    <span style={{ color: '#9ca3af', fontSize: '11px' }}>
                      Seg {index + 1}
                    </span>
                  </div>
                  <span style={{ color: '#e5e7eb', fontSize: '11px', fontWeight: 600 }}>
                    {hitCount} ({hitRate}%)
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Results */}
        {sessionStats.recentResults.length > 0 && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: 16,
            border: '1px solid rgba(255, 255, 255, 0.05)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#fbbf24',
              marginBottom: 12,
              textAlign: 'center'
            }}>
              Recent Spins
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              flex: 1,
              overflow: 'auto'
            }}>
              {sessionStats.recentResults.slice(0, 6).map((result, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: result.wasWin 
                      ? 'rgba(34, 197, 94, 0.1)' 
                      : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${result.wasWin 
                      ? 'rgba(34, 197, 94, 0.2)' 
                      : 'rgba(239, 68, 68, 0.2)'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div 
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: wheelColors[result.segmentIndex] || '#666'
                      }}
                    />
                    <span style={{
                      fontSize: '12px',
                      color: '#e5e7eb'
                    }}>
                      {result.multiplier}x
                    </span>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: result.wasWin ? '#22c55e' : '#ef4444'
                  }}>
                    {result.wasWin ? `+${result.amount.toFixed(2)}` : `-${wager.toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
)

WheelSpinPaytable.displayName = 'WheelSpinPaytable'

export default WheelSpinPaytable
