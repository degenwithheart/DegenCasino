import React, { forwardRef, useImperativeHandle } from 'react'
import { useCurrentToken, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { JACKS_OR_BETTER_BET_ARRAY } from './betArray'
import { formatAmount, formatAmountWithSymbol } from '../../utils/formatAmount'

interface HandResult {
  handType: string
  multiplier: number
  amount: number
  timestamp: number
}

interface ProgressivePokerPaytableProps {
  wager: number
  currentHandType?: string
  currentResult?: {
    handType: string
    multiplier: number
  }
}

export interface ProgressivePokerPaytableRef {
  trackHand: (result: { handType: string; multiplier: number; amount: number }) => void
  resetSession: () => void
}

// Session statistics tracking
interface SessionStats {
  totalHands: number
  totalWins: number
  totalWagered: number
  totalWon: number
  biggestWin: number
  longestWinStreak: number
  currentStreak: number
  handCounts: Record<string, number>
  royalFlushes: number
  fourOfAKinds: number
  fullHouses: number
}

const HANDS = [
  { label: 'Jackpot (Royal Flush)', payout: JACKS_OR_BETTER_BET_ARRAY[9], type: 'Jackpot' },
  { label: 'Four of a Kind', payout: JACKS_OR_BETTER_BET_ARRAY[6], type: 'Four of a Kind' },
  { label: 'Full House', payout: JACKS_OR_BETTER_BET_ARRAY[5], type: 'Full House' },
  { label: 'Straight', payout: JACKS_OR_BETTER_BET_ARRAY[4], type: 'Straight' },
  { label: 'Three of a Kind', payout: JACKS_OR_BETTER_BET_ARRAY[3], type: 'Three of a Kind' },
  { label: 'Pair', payout: JACKS_OR_BETTER_BET_ARRAY[1], type: 'Pair' },
]

const ProgressivePokerPaytable = forwardRef<ProgressivePokerPaytableRef, ProgressivePokerPaytableProps>(({ 
  wager,
  currentHandType,
  currentResult
}, ref) => {
  const token = useCurrentToken()
  const [recentHands, setRecentHands] = React.useState<HandResult[]>([])
  const [sessionStats, setSessionStats] = React.useState<SessionStats>({
    totalHands: 0,
    totalWins: 0,
    totalWagered: 0,
    totalWon: 0,
    biggestWin: 0,
    longestWinStreak: 0,
    currentStreak: 0,
    handCounts: {},
    royalFlushes: 0,
    fourOfAKinds: 0,
    fullHouses: 0
  })

  // Track hand results
  React.useEffect(() => {
    if (currentResult && currentResult.multiplier >= 0) {
      const resultAmount = wager * currentResult.multiplier
      const newHand: HandResult = {
        handType: currentResult.handType,
        multiplier: currentResult.multiplier,
        amount: resultAmount,
        timestamp: Date.now()
      }

      setRecentHands(prev => [newHand, ...prev.slice(0, 4)]) // Keep last 5 hands

      // Update session stats
      setSessionStats(prev => {
        const newStats = { ...prev }
        newStats.totalHands += 1
        newStats.totalWagered += wager

        if (currentResult.multiplier > 0) {
          newStats.totalWins += 1
          newStats.totalWon += resultAmount
          newStats.biggestWin = Math.max(newStats.biggestWin, resultAmount)
          newStats.currentStreak += 1
          newStats.longestWinStreak = Math.max(newStats.longestWinStreak, newStats.currentStreak)
          
          // Track special hands
          if (currentResult.handType === 'Jackpot') {
            newStats.royalFlushes += 1
          } else if (currentResult.handType === 'Four of a Kind') {
            newStats.fourOfAKinds += 1
          } else if (currentResult.handType === 'Full House') {
            newStats.fullHouses += 1
          }
        } else {
          newStats.currentStreak = 0
        }

        // Track hand type counts
        newStats.handCounts[currentResult.handType] = (newStats.handCounts[currentResult.handType] || 0) + 1

        return newStats
      })
    }
  }, [currentResult, wager])

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    trackHand: (result) => {
      // Manual tracking if needed
    },
    resetSession: () => {
      setSessionStats({
        totalHands: 0,
        totalWins: 0,
        totalWagered: 0,
        totalWon: 0,
        biggestWin: 0,
        longestWinStreak: 0,
        currentStreak: 0,
        handCounts: {},
        royalFlushes: 0,
        fourOfAKinds: 0,
        fullHouses: 0
      })
      setRecentHands([])
    }
  }))

  const winRate = sessionStats.totalHands > 0 ? (sessionStats.totalWins / sessionStats.totalHands) * 100 : 0
  const netProfit = sessionStats.totalWon - sessionStats.totalWagered
  const roi = sessionStats.totalWagered > 0 ? ((netProfit / sessionStats.totalWagered) * 100) : 0

  return (
    <div className="poker-paytable">
      <style>{`
        .poker-paytable {
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

        .hands-table {
          width: 100%;
          color: #fff;
          font-size: 12px;
        }

        .hands-table td {
          padding: 6px 0;
          transition: all 0.2s ease;
        }

        .hand-name {
          text-align: left;
        }

        .hand-payout {
          text-align: right;
          font-weight: 700;
          color: #ffe066;
        }

        .hand-row.active .hand-name,
        .hand-row.active .hand-payout {
          color: #ffe066;
        }

        .hand-row.bust .hand-name,
        .hand-row.bust .hand-payout {
          color: #ff7f7f;
        }

        .recent-hands {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .hand-item {
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
        
        .hand-item:hover {
          background: rgba(255, 224, 102, 0.2);
          transform: translateY(-1px);
        }

        .hand-details {
          flex: 1;
          color: #fff;
        }

        .hand-amount {
          font-weight: 700;
        }

        .hand-win {
          color: #4ade80;
        }

        .hand-loss {
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

        .special-hands {
          margin-top: 12px;
          font-size: 11px;
          color: #888;
          text-align: center;
        }
      `}</style>

      {/* Hand Payouts */}
      <div className="paytable-card">
        <div className="paytable-title">Hand Payouts</div>
        <table className="hands-table">
          <tbody>
            {HANDS.map((hand, i) => {
              const isActive = currentHandType && hand.type === currentHandType
              return (
                <tr key={i} className={`hand-row ${isActive ? 'active' : ''}`}>
                  <td className="hand-name">{hand.label}</td>
                  <td className="hand-payout">{hand.payout}x</td>
                </tr>
              )
            })}
            <tr className={`hand-row ${currentHandType === 'Bust' ? 'bust' : ''}`}>
              <td className="hand-name">Bust / No Win</td>
              <td className="hand-payout">0x</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recent Hands */}
      <div className="paytable-card recent-hands">
        <div className="paytable-title">Recent Hands</div>
        {recentHands.length > 0 ? (
          recentHands.map((hand, index) => (
            <div key={index} className="hand-item">
              <div className="hand-details">
                <div>{hand.handType}</div>
                <div style={{ color: '#ccc', fontSize: '10px' }}>
                  {hand.multiplier}x multiplier
                </div>
              </div>
              <div className={`hand-amount ${hand.multiplier > 0 ? 'hand-win' : 'hand-loss'}`}>
                {hand.multiplier > 0 ? '+' : ''}{formatAmount(hand.amount)} {token?.symbol}
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
            No hands played yet!
          </div>
        )}
      </div>

      {/* Session Statistics */}
      <div className="paytable-card">
        <div className="paytable-title">Session Stats</div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{sessionStats.totalHands}</div>
            <div className="stat-label">Hands</div>
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

        <div className="special-hands">
          Royal Flushes: {sessionStats.royalFlushes} • Four of a Kind: {sessionStats.fourOfAKinds}
        </div>
      </div>
    </div>
  )
})

export default ProgressivePokerPaytable
