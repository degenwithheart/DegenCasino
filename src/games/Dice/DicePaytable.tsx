import React, { forwardRef, useImperativeHandle } from 'react'
import { useCurrentToken, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { formatAmount, formatAmountWithSymbol } from '../../utils/formatAmount'

interface DiceResult {
  rollValue: number
  targetValue: number
  rollUnder: boolean
  multiplier: number
  amount: number
  wasWin: boolean
  timestamp: number
}

interface DicePaytableProps {
  odds: number
  rollUnder: boolean
  wager: number
  currentResult?: {
    rollValue: number
    targetValue: number
    multiplier: number
    wasWin: boolean
  }
}

export interface DicePaytableRef {
  trackRoll: (result: { rollValue: number; targetValue: number; multiplier: number; wasWin: boolean; amount: number }) => void
  resetSession: () => void
}

// Session statistics tracking
interface SessionStats {
  totalRolls: number
  totalWins: number
  totalWagered: number
  totalWon: number
  biggestWin: number
  longestWinStreak: number
  currentStreak: number
  highestRoll: number
  lowestRoll: number
  averageRoll: number
  totalRollValue: number
  rollsUnder50: number
  rollsOver50: number
  underWins: number
  overWins: number
}

const DicePaytable = forwardRef<DicePaytableRef, DicePaytableProps>(({ 
  odds,
  rollUnder,
  wager,
  currentResult
}, ref) => {
  const token = useCurrentToken()
  const [recentRolls, setRecentRolls] = React.useState<DiceResult[]>([])
  const [sessionStats, setSessionStats] = React.useState<SessionStats>({
    totalRolls: 0,
    totalWins: 0,
    totalWagered: 0,
    totalWon: 0,
    biggestWin: 0,
    longestWinStreak: 0,
    currentStreak: 0,
    highestRoll: 0,
    lowestRoll: 100,
    averageRoll: 0,
    totalRollValue: 0,
    rollsUnder50: 0,
    rollsOver50: 0,
    underWins: 0,
    overWins: 0
  })

  // Track roll results
  React.useEffect(() => {
    if (currentResult && currentResult.rollValue >= 0) {
      const resultAmount = currentResult.wasWin ? wager * currentResult.multiplier : 0

      // Update session stats
      setSessionStats(prev => {
        const newStats = { ...prev }
        newStats.totalRolls += 1
        newStats.totalWagered += wager
        newStats.totalRollValue += currentResult.rollValue
        newStats.averageRoll = newStats.totalRollValue / newStats.totalRolls
        
        newStats.highestRoll = Math.max(newStats.highestRoll, currentResult.rollValue)
        newStats.lowestRoll = Math.min(newStats.lowestRoll, currentResult.rollValue)

        if (currentResult.rollValue < 50) {
          newStats.rollsUnder50 += 1
        } else {
          newStats.rollsOver50 += 1
        }

        if (currentResult.wasWin) {
          newStats.totalWins += 1
          newStats.totalWon += resultAmount
          newStats.biggestWin = Math.max(newStats.biggestWin, resultAmount)
          newStats.currentStreak += 1
          newStats.longestWinStreak = Math.max(newStats.longestWinStreak, newStats.currentStreak)
          
          if (rollUnder) {
            newStats.underWins += 1
          } else {
            newStats.overWins += 1
          }
        } else {
          newStats.currentStreak = 0
        }

        return newStats
      })
    }
  }, [currentResult, wager, rollUnder])

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    trackRoll: (result) => {
      // Manual tracking if needed
    },
    resetSession: () => {
      setSessionStats({
        totalRolls: 0,
        totalWins: 0,
        totalWagered: 0,
        totalWon: 0,
        biggestWin: 0,
        longestWinStreak: 0,
        currentStreak: 0,
        highestRoll: 0,
        lowestRoll: 100,
        averageRoll: 0,
        totalRollValue: 0,
        rollsUnder50: 0,
        rollsOver50: 0,
        underWins: 0,
        overWins: 0
      })
      setRecentRolls([])
    }
  }))

  const winRate = sessionStats.totalRolls > 0 ? (sessionStats.totalWins / sessionStats.totalRolls) * 100 : 0
  const netProfit = sessionStats.totalWon - sessionStats.totalWagered
  const roi = sessionStats.totalWagered > 0 ? ((netProfit / sessionStats.totalWagered) * 100) : 0

  const currentMultiplier = (100 / odds).toFixed(2)

  return (
    <div className="dice-paytable">
      <style>{`
        .dice-paytable {
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

        .odds-info {
          text-align: center;
          margin-bottom: 12px;
        }

        .odds-value {
          font-size: 24px;
          font-weight: 700;
          color: #ffe066;
        }

        .odds-label {
          font-size: 12px;
          color: #ccc;
          text-transform: uppercase;
        }

        .multiplier-info {
          background: rgba(255, 224, 102, 0.1);
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          border: 1px solid rgba(255, 224, 102, 0.2);
        }

        .multiplier-value {
          font-size: 20px;
          font-weight: 700;
          color: #4ade80;
        }

        .target-info {
          font-size: 11px;
          color: #888;
          margin-top: 6px;
        }

        .recent-rolls {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .roll-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
          background: rgba(255, 224, 102, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(255, 224, 102, 0.2);
          margin-bottom: 6px;
          font-size: 11px;
          transition: all 0.3s ease;
        }
        
        .roll-item:hover {
          background: rgba(255, 224, 102, 0.2);
          transform: translateY(-1px);
        }

        .roll-details {
          flex: 1;
          color: #fff;
        }

        .roll-value {
          font-size: 16px;
          font-weight: 700;
          color: #ffe066;
        }

        .roll-amount {
          font-weight: 700;
        }

        .roll-win {
          color: #4ade80;
        }

        .roll-loss {
          color: #ef4444;
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

        .roll-stats {
          margin-top: 12px;
          font-size: 11px;
          color: #888;
          text-align: center;
        }
      `}</style>

      {/* Session Statistics */}
      <div className="paytable-card">
        <div className="paytable-title">Session Stats</div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{sessionStats.totalRolls}</div>
            <div className="stat-label">Rolls</div>
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
            <div className="stat-value">{sessionStats.averageRoll.toFixed(1)}</div>
            <div className="stat-label">Avg Roll</div>
          </div>
        </div>
        
        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#ccc', marginBottom: '4px' }}>Net Profit</div>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 'bold',
            color: netProfit >= 0 ? '#4ade80' : '#ef4444'
          }}>
            {netProfit >= 0 ? '+' : ''}{formatAmount(netProfit)} {token?.symbol}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: roi >= 0 ? '#4ade80' : '#ef4444',
            marginTop: '2px'
          }}>
            ({roi >= 0 ? '+' : ''}{roi.toFixed(1)}% ROI)
          </div>
        </div>

        <div className="roll-stats">
          High: {sessionStats.highestRoll.toFixed(1)} • Low: {sessionStats.lowestRoll === 100 ? '—' : sessionStats.lowestRoll.toFixed(1)}
          <br />
          Under 50: {sessionStats.rollsUnder50} • Over 50: {sessionStats.rollsOver50}
        </div>
      </div>
    </div>
  )
})

export default DicePaytable
