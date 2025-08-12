import React, { forwardRef, useImperativeHandle } from 'react'
import { useCurrentToken, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { SLOT_ITEMS, PAYLINES } from './constants'

interface SlotsPaytableProps {
  onSymbolHover?: (symbolId: string | null) => void
  onPaylineHover?: (paylineIndex: number | null) => void
  wager: number
  currentWin?: {
    symbol: string
    count: number
    multiplier: number
    winType: 'payline' | 'scatter'
    paylineNumber?: number
  }
}

export interface SlotsPaytableRef {
  trackSpin: (isWin?: boolean) => void
}

// Session statistics tracking
interface SessionStats {
  totalSpins: number
  totalWins: number
  totalWagered: number
  totalWon: number
  biggestWin: number
  currentStreak: number
  longestWinStreak: number
  symbolHits: Record<string, number>
  paylineHits: Record<number, number>
}

const SlotsPaytable = forwardRef<SlotsPaytableRef, SlotsPaytableProps>(({ 
  onSymbolHover, 
  onPaylineHover, 
  wager, 
  currentWin 
}, ref) => {
  const token = useCurrentToken()
  const [sessionStats, setSessionStats] = React.useState<SessionStats>({
    totalSpins: 0,
    totalWins: 0,
    totalWagered: 0,
    totalWon: 0,
    biggestWin: 0,
    currentStreak: 0,
    longestWinStreak: 0,
    symbolHits: {},
    paylineHits: {}
  })

  const formatAmount = (amount: number, decimals: number = 2) => {
    // For FAKE_TOKEN_MINT (DGHRT), treat as 1:1 since it's free play token valued as 1
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      return (amount / 1e9).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    }
    
    // For real tokens, use proper decimal conversion
    return (amount / Math.pow(10, token?.decimals || decimals)).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    })
  }

  // Track new wins
  React.useEffect(() => {
    if (currentWin && currentWin.multiplier > 0) {
      const winAmount = wager * currentWin.multiplier

      // Update session stats
      setSessionStats(prev => {
        const newStats = { ...prev }
        newStats.totalWins += 1
        newStats.totalWon += winAmount
        newStats.biggestWin = Math.max(newStats.biggestWin, winAmount)
        newStats.currentStreak += 1
        newStats.longestWinStreak = Math.max(newStats.longestWinStreak, newStats.currentStreak)
        
        // Track symbol hits
        newStats.symbolHits[currentWin.symbol] = (newStats.symbolHits[currentWin.symbol] || 0) + 1
        
        // Track payline hits
        if (currentWin.winType === 'payline' && currentWin.paylineNumber !== undefined) {
          newStats.paylineHits[currentWin.paylineNumber] = (newStats.paylineHits[currentWin.paylineNumber] || 0) + 1
        }
        
        return newStats
      })
    }
  }, [currentWin, wager])

  // Track spins and losses
  const trackSpin = React.useCallback((isWin: boolean = false) => {
    setSessionStats(prev => {
      const newStats = { ...prev }
      newStats.totalSpins += 1
      newStats.totalWagered += wager
      
      if (!isWin) {
        newStats.currentStreak = 0
      }
      
      return newStats
    })
  }, [wager])

  // Expose trackSpin function to parent component
  useImperativeHandle(ref, () => ({
    trackSpin
  }), [trackSpin])

  const winRate = sessionStats.totalSpins > 0 ? (sessionStats.totalWins / sessionStats.totalSpins) * 100 : 0
  const netProfit = sessionStats.totalWon - sessionStats.totalWagered
  const roi = sessionStats.totalWagered > 0 ? (netProfit / sessionStats.totalWagered) * 100 : 0

  // Get paying symbols sorted by multiplier
  const payingSymbols = SLOT_ITEMS.filter(item => item.multiplier > 0).sort((a, b) => b.multiplier - a.multiplier)

  return (
    <div className="slots-paytable">
      <style>{`
        .slots-paytable {
          display: flex;
          flex-direction: column;
          min-width: 280px;
          max-width: 280px;
          height: 100%;
          gap: 16px;
          padding: 0 8px;
          
          /* Optimized scaling and performance */
          transform-origin: top left;
          transition: transform 0.2s ease;
          will-change: transform;
          backface-visibility: hidden;
        }
        
        .paytable-card {
          background: linear-gradient(135deg, rgba(30, 30, 60, 0.95) 0%, rgba(20, 20, 40, 0.98) 100%);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 224, 102, 0.2);
        }
        
        .paytable-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffe066;
          text-align: center;
          margin-bottom: 12px;
          text-shadow: 0 0 10px rgba(255, 224, 102, 0.5);
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 8px;
        }
        
        .stat-item {
          background: rgba(255, 224, 102, 0.1);
          border-radius: 6px;
          padding: 6px;
          text-align: center;
          border: 1px solid rgba(255, 224, 102, 0.2);
        }
        
        .stat-value {
          font-size: 14px;
          font-weight: 700;
          color: #ffe066;
        }
        
        .stat-label {
          font-size: 10px;
          color: #ccc;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .profit-positive {
          color: #4ade80;
        }
        
        .profit-negative {
          color: #ef4444;
        }
      `}</style>

      {/* Session Statistics */}
      <div className="paytable-card">
        <div className="paytable-title">Session Stats</div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{sessionStats.totalSpins}</div>
            <div className="stat-label">Spins</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{sessionStats.totalWins}</div>
            <div className="stat-label">Wins</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{winRate.toFixed(1)}%</div>
            <div className="stat-label">Win Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{sessionStats.currentStreak}</div>
            <div className="stat-label">Streak</div>
          </div>
        </div>
        
        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#ccc', marginBottom: '4px' }}>Net Profit</div>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '700',
            color: netProfit >= 0 ? '#4ade80' : '#ef4444'
          }}>
            {netProfit >= 0 ? '+' : ''}{formatAmount(netProfit, 2)} {token?.symbol}
          </div>
          <div style={{ 
            fontSize: '11px', 
            color: roi >= 0 ? '#4ade80' : '#ef4444',
            marginTop: '2px'
          }}>
            ({roi >= 0 ? '+' : ''}{roi.toFixed(1)}% ROI)
          </div>
        </div>

        {sessionStats.biggestWin > 0 && (
          <div style={{ marginTop: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#ccc' }}>Biggest Win</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffe066' }}>
              {formatAmount(sessionStats.biggestWin, 2)} {token?.symbol}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

SlotsPaytable.displayName = 'SlotsPaytable'

export default SlotsPaytable
