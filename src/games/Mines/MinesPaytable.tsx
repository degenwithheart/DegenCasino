import React, { forwardRef, useImperativeHandle } from 'react'
import { useCurrentToken, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'

interface MineResult {
  level: number
  multiplier: number
  amount: number
  wasSuccessful: boolean
  minesCount: number
  timestamp: number
}

interface MinesPaytableProps {
  mines: number
  levels: Array<{ wager: number; bet: number[]; cumProfit: number }>
  gridSize: number
  currentLevel: number
  wager: number
  currentResult?: {
    level: number
    multiplier: number
    wasSuccessful: boolean
  }
}

export interface MinesPaytableRef {
  trackResult: (result: { level: number; multiplier: number; wasSuccessful: boolean; amount: number }) => void
  resetSession: () => void
}

// Session statistics tracking
interface SessionStats {
  totalGames: number
  totalWins: number
  totalWagered: number
  totalWon: number
  biggestWin: number
  longestWinStreak: number
  currentStreak: number
  averageLevel: number
  totalLevelsReached: number
  mineHits: number
  safeClicks: number
}

const MinesPaytable = forwardRef<MinesPaytableRef, MinesPaytableProps>(({ 
  mines,
  levels,
  gridSize,
  currentLevel,
  wager,
  currentResult
}, ref) => {
  const token = useCurrentToken()
  const [recentResults, setRecentResults] = React.useState<MineResult[]>([])
  const [sessionStats, setSessionStats] = React.useState<SessionStats>({
    totalGames: 0,
    totalWins: 0,
    totalWagered: 0,
    totalWon: 0,
    biggestWin: 0,
    longestWinStreak: 0,
    currentStreak: 0,
    averageLevel: 0,
    totalLevelsReached: 0,
    mineHits: 0,
    safeClicks: 0
  })

  const formatAmount = (amount: number) => {
    // For FAKE_TOKEN_MINT (DGHRT), treat as 1:1 since it's free play token valued as 1
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      return (amount / 1e9).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    }
    
    // For real tokens, use proper decimal conversion
    return (amount / Math.pow(10, token?.decimals || 9)).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    })
  }

  // Track game results
  React.useEffect(() => {
    if (currentResult && currentResult.level >= 0) {
      const resultAmount = wager * currentResult.multiplier
      const newResult: MineResult = {
        level: currentResult.level,
        multiplier: currentResult.multiplier,
        amount: resultAmount,
        wasSuccessful: currentResult.wasSuccessful,
        minesCount: mines,
        timestamp: Date.now()
      }

      setRecentResults(prev => [newResult, ...prev.slice(0, 4)]) // Keep last 5 results

      // Update session stats
      setSessionStats(prev => {
        const newStats = { ...prev }
        
        if (currentResult.wasSuccessful) {
          newStats.totalWins += 1
          newStats.totalWon += resultAmount
          newStats.biggestWin = Math.max(newStats.biggestWin, resultAmount)
          newStats.currentStreak += 1
          newStats.longestWinStreak = Math.max(newStats.longestWinStreak, newStats.currentStreak)
          newStats.safeClicks += currentResult.level + 1
        } else {
          newStats.currentStreak = 0
          newStats.mineHits += 1
          newStats.safeClicks += currentResult.level
        }

        newStats.totalGames += 1
        newStats.totalWagered += wager
        newStats.totalLevelsReached += currentResult.level
        newStats.averageLevel = newStats.totalLevelsReached / newStats.totalGames

        return newStats
      })
    }
  }, [currentResult, wager, mines])

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    trackResult: (result) => {
      // Manual tracking if needed
    },
    resetSession: () => {
      setSessionStats({
        totalGames: 0,
        totalWins: 0,
        totalWagered: 0,
        totalWon: 0,
        biggestWin: 0,
        longestWinStreak: 0,
        currentStreak: 0,
        averageLevel: 0,
        totalLevelsReached: 0,
        mineHits: 0,
        safeClicks: 0
      })
      setRecentResults([])
    }
  }))

  const winRate = sessionStats.totalGames > 0 ? (sessionStats.totalWins / sessionStats.totalGames) * 100 : 0
  const netProfit = sessionStats.totalWon - sessionStats.totalWagered
  const roi = sessionStats.totalWagered > 0 ? ((netProfit / sessionStats.totalWagered) * 100) : 0

  // Current level display
  const windowSize = 5
  const totalLevels = levels.length
  let start = 0
  if (currentLevel > 2 && totalLevels > windowSize) {
    start = Math.min(currentLevel - 2, totalLevels - windowSize)
  }
  const visibleLevels = levels.slice(start, start + windowSize)

  return (
    <div className="mines-paytable">
      <style>{`
        .mines-paytable {
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

        .levels-table {
          width: 100%;
          border-collapse: collapse;
          color: #ccc;
          font-size: 11px;
        }

        .levels-table th {
          background: #181818;
          color: #aaa;
          font-weight: 700;
          font-size: 10px;
          text-align: center;
          padding: 6px 4px;
          border-bottom: 1px solid #333;
        }

        .levels-table td {
          text-align: center;
          padding: 6px 4px;
          border-bottom: 1px solid #222;
          transition: all 0.2s ease;
        }

        .level-row {
          transition: background 0.2s, color 0.2s;
        }

        .level-row.active {
          background: #222 !important;
          border-left: 3px solid #ff69b4;
          font-weight: 700;
          color: #fff;
        }

        .multiplier-cell {
          color: #ffe066;
          font-weight: 700;
        }

        .profit-cell {
          color: #6cf;
        }

        .recent-results {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .result-item {
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
        
        .result-item:hover {
          background: rgba(255, 224, 102, 0.2);
          transform: translateY(-1px);
        }

        .result-details {
          flex: 1;
          color: #fff;
        }

        .result-amount {
          font-weight: 700;
        }

        .result-win {
          color: #4ade80;
        }

        .result-loss {
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
      `}</style>

      {/* Current Levels */}
      <div className="paytable-card">
        <div className="paytable-title">Levels ({mines} mines)</div>
        <table className="levels-table">
          <thead>
            <tr>
              <th>Lv</th>
              <th>Chance</th>
              <th>Multi</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {visibleLevels.map((level, i) => {
              const realIndex = start + i
              const multiplier = level.wager && level.bet ? level.bet.find((x) => x > 0) || 0 : 0
              const remainingCells = gridSize - realIndex
              const safeCells = remainingCells - mines
              const chance = safeCells > 0 ? (100 * safeCells) / remainingCells : 0
              const isActive = realIndex === currentLevel

              return (
                <tr key={realIndex} className={`level-row ${isActive ? 'active' : ''}`}>
                  <td>{realIndex + 1}</td>
                  <td>{chance.toFixed(1)}%</td>
                  <td className="multiplier-cell">
                    {multiplier ? multiplier.toFixed(2) + 'x' : '-'}
                  </td>
                  <td className="profit-cell">
                    {level.cumProfit ? formatAmount(level.cumProfit) : '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Recent Results */}
      <div className="paytable-card recent-results">
        <div className="paytable-title">Recent Results</div>
        {recentResults.length > 0 ? (
          recentResults.map((result, index) => (
            <div key={index} className="result-item">
              <div className="result-details">
                <div>Lv {result.level + 1} • {result.minesCount} mines</div>
                <div style={{ color: '#ccc', fontSize: '10px' }}>
                  {result.wasSuccessful ? 'Cash Out' : 'Mine Hit'}
                </div>
              </div>
              <div className={`result-amount ${result.wasSuccessful ? 'result-win' : 'result-loss'}`}>
                {result.wasSuccessful ? '+' : ''}{formatAmount(result.amount)} {token?.symbol}
              </div>
            </div>
          ))
        ) : (
          <div style={{ 
            color: '#888', 
            fontStyle: 'italic', 
            textAlign: 'center', 
            padding: '20px 0',
            fontSize: '12px'
          }}>
            No games yet - start mining!
          </div>
        )}
      </div>

      {/* Session Statistics */}
      <div className="paytable-card">
        <div className="paytable-title">Session Stats</div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{sessionStats.totalGames}</div>
            <div className="stat-label">Games</div>
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
            <div className="stat-value">{sessionStats.averageLevel.toFixed(1)}</div>
            <div className="stat-label">Avg Level</div>
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

        <div style={{ marginTop: '12px', fontSize: '11px', color: '#888', textAlign: 'center' }}>
          Safe Clicks: {sessionStats.safeClicks} • Mine Hits: {sessionStats.mineHits}
        </div>
      </div>
    </div>
  )
})

export default MinesPaytable
