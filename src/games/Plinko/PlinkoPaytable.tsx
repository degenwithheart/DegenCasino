import React from 'react'
import { useCurrentToken } from 'gamba-react-ui-v2'
import { formatAmount, formatAmountWithSymbol } from '../../utils/formatAmount'

interface BucketHit {
  multiplier: number
  count: number
  totalPayout: number
}

interface PlinkoPaytableProps {
  multipliers: number[]
  bucketHits: BucketHit[]
  currentBall: number
  totalBalls: number
  runningTotal: number
  wager: number
  isPlaying: boolean
  ballResults: number[]
}

export default function PlinkoPaytable({
  multipliers,
  bucketHits,
  currentBall,
  totalBalls,
  runningTotal,
  wager,
  isPlaying,
  ballResults
}: PlinkoPaytableProps) {
  const token = useCurrentToken()

  const getRowColor = (multiplier: number, count: number) => {
    if (count === 0) return 'rgba(255, 255, 255, 0.1)'
    if (multiplier >= 3) return 'rgba(34, 197, 94, 0.2)' // Green for high multipliers
    if (multiplier >= 1) return 'rgba(59, 130, 246, 0.2)' // Blue for 1x+
    return 'rgba(239, 68, 68, 0.2)' // Red for losses
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: 16,
        padding: 20,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        width: 210,
        height: 'auto',
        color: 'white',
        zIndex: 1,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 16, textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 'bold' }}>
          Plinko Paytable
        </h3>
        {isPlaying && (
          <div style={{ fontSize: 14, color: '#94a3b8' }}>
            Ball {currentBall}/{totalBalls}
          </div>
        )}
      </div>

      {/* Multiplier Buckets */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, marginBottom: 8, color: '#94a3b8' }}>
          Multiplier Buckets
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {multipliers.map((multiplier, index) => {
            const bucketData = bucketHits.find(b => b.multiplier === multiplier)
            const hits = bucketData?.count || 0
            const payout = bucketData?.totalPayout || 0
            
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: getRowColor(multiplier, hits),
                  borderRadius: 8,
                  border: hits > 0 ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ 
                    fontWeight: 'bold',
                    color: multiplier >= 1 ? '#22c55e' : '#ef4444'
                  }}>
                    {multiplier}x
                  </span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>
                    {hits} hit{hits !== 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 'bold' }}>
                  {formatAmountWithSymbol(payout, token, { showPlusSign: payout > 0 })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Running Total */}
      <div
        style={{
          padding: 16,
          background: runningTotal >= 0 
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 4 }}>
          Running Total
        </div>
        <div style={{ 
          fontSize: 20, 
          fontWeight: 'bold',
          color: runningTotal >= 0 ? '#22c55e' : '#ef4444'
        }}>
          {formatAmountWithSymbol(runningTotal, token, { showPlusSign: true })}
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>
          ({ballResults.length}/{totalBalls} balls played)
        </div>
      </div>

      {/* Recent Results */}
      {ballResults.length > 0 && (
        <div>
          <div style={{ fontSize: 14, marginBottom: 8, color: '#94a3b8' }}>
            Recent Results
          </div>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 4,
            maxHeight: 80,
            overflowY: 'auto'
          }}>
            {ballResults.slice(-2).reverse().map((result, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 6,
                  fontSize: 12,
                }}
              >
                <span>Ball {ballResults.length - index}</span>
                <span style={{ 
                  color: result >= 0 ? '#22c55e' : '#ef4444',
                  fontWeight: 'bold'
                }}>
                  {formatAmountWithSymbol(result, token, { showPlusSign: true })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
