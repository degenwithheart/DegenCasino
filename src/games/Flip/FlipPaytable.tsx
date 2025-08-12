import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useCurrentToken } from 'gamba-react-ui-v2'
import { formatAmountWithSymbol } from '../../utils/formatAmount'
import { TokenValue } from 'gamba-react-ui-v2'

interface FlipResult {
  guess: 'heads' | 'tails'
  result: 'heads' | 'tails'
  wasWin: boolean
  amount: number
  multiplier: number
}

interface FlipStats {
  totalGames: number
  totalWins: number
  totalLosses: number
  winRate: number
  totalWagered: number
  totalWon: number
  netProfit: number
  biggestWin: number
  biggestLoss: number
  headsGuesses: number
  tailsGuesses: number
  headsWins: number
  tailsWins: number
  longestStreak: number
  currentStreak: number
}

export interface FlipPaytableRef {
  trackGame: (result: FlipResult) => void
  resetStats: () => void
}

interface FlipPaytableProps {
  wager: number
  selectedSide?: 'heads' | 'tails'
  currentResult?: {
    guess: 'heads' | 'tails'
    result: 'heads' | 'tails'
    wasWin: boolean
    multiplier: number
  }
}

const FlipPaytable = forwardRef<FlipPaytableRef, FlipPaytableProps>(
  ({ wager, selectedSide, currentResult }, ref) => {
    const [recentResults, setRecentResults] = useState<FlipResult[]>([])
    const [stats, setStats] = useState<FlipStats>({
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      winRate: 0,
      totalWagered: 0,
      totalWon: 0,
      netProfit: 0,
      biggestWin: 0,
      biggestLoss: 0,
      headsGuesses: 0,
      tailsGuesses: 0,
      headsWins: 0,
      tailsWins: 0,
      longestStreak: 0,
      currentStreak: 0,
    })

    useImperativeHandle(ref, () => ({
      trackGame: (result: FlipResult) => {
        setRecentResults(prev => [result, ...prev.slice(0, 9)])
        
        setStats(prev => {
          const newStreak = result.wasWin ? prev.currentStreak + 1 : 0
          const newStats = {
            totalGames: prev.totalGames + 1,
            totalWins: result.wasWin ? prev.totalWins + 1 : prev.totalWins,
            totalLosses: result.wasWin ? prev.totalLosses : prev.totalLosses + 1,
            winRate: 0,
            totalWagered: prev.totalWagered + wager,
            totalWon: prev.totalWon + result.amount,
            netProfit: 0,
            biggestWin: result.wasWin ? Math.max(prev.biggestWin, result.amount) : prev.biggestWin,
            biggestLoss: !result.wasWin ? Math.max(prev.biggestLoss, wager) : prev.biggestLoss,
            headsGuesses: result.guess === 'heads' ? prev.headsGuesses + 1 : prev.headsGuesses,
            tailsGuesses: result.guess === 'tails' ? prev.tailsGuesses + 1 : prev.tailsGuesses,
            headsWins: result.guess === 'heads' && result.wasWin ? prev.headsWins + 1 : prev.headsWins,
            tailsWins: result.guess === 'tails' && result.wasWin ? prev.tailsWins + 1 : prev.tailsWins,
            longestStreak: Math.max(prev.longestStreak, newStreak),
            currentStreak: newStreak,
          }
          
          newStats.winRate = newStats.totalGames > 0 ? (newStats.totalWins / newStats.totalGames) * 100 : 0
          newStats.netProfit = newStats.totalWon - newStats.totalWagered
          
          return newStats
        })
      },
      resetStats: () => {
        setRecentResults([])
        setStats({
          totalGames: 0,
          totalWins: 0,
          totalLosses: 0,
          winRate: 0,
          totalWagered: 0,
          totalWon: 0,
          netProfit: 0,
          biggestWin: 0,
          biggestLoss: 0,
          headsGuesses: 0,
          tailsGuesses: 0,
          headsWins: 0,
          tailsWins: 0,
          longestStreak: 0,
          currentStreak: 0,
        })
      }
    }))

    const potentialPayout = wager * 2 // Always 2x for coin flip

    return (
      <div style={{
        width: '320px',
        height: 'auto',
        background: 'linear-gradient(135deg, rgba(40,44,64,0.95) 0%, rgba(30,32,50,0.98) 100%)',
        borderRadius: '20px',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '12px'
        }}>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: 700,
            background: 'linear-gradient(45deg, #FCD34D, #F59E0B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🪙 Flip Stats
          </h3>
        </div>

        {/* Session Statistics */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '12px'
        }}>
          <div style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: 600, marginBottom: '8px' }}>
            Session Stats
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
            <div>
              <span style={{ color: '#9CA3AF' }}>Games:</span>
              <span style={{ color: '#fff', fontWeight: 600, marginLeft: '4px' }}>
                {stats.totalGames}
              </span>
            </div>
            <div>
              <span style={{ color: '#9CA3AF' }}>Win Rate:</span>
              <span style={{ color: stats.winRate > 50 ? '#22C55E' : '#EF4444', fontWeight: 600, marginLeft: '4px' }}>
                {stats.winRate.toFixed(1)}%
              </span>
            </div>
            <div>
              <span style={{ color: '#9CA3AF' }}>Net:</span>
              <span style={{ 
                color: stats.netProfit >= 0 ? '#22C55E' : '#EF4444', 
                fontWeight: 600, 
                marginLeft: '4px' 
              }}>
                <TokenValue amount={stats.netProfit} />
              </span>
            </div>
            <div>
              <span style={{ color: '#9CA3AF' }}>Streak:</span>
              <span style={{ color: '#FCD34D', fontWeight: 600, marginLeft: '4px' }}>
                {stats.currentStreak} ({stats.longestStreak})
              </span>
            </div>
          </div>
        </div>

        {/* Side Preferences */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '12px'
        }}>
          <div style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: 600, marginBottom: '8px' }}>
            Side Analysis
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{
              background: 'rgba(252, 211, 77, 0.1)',
              borderRadius: '8px',
              padding: '8px',
              textAlign: 'center',
              border: '1px solid rgba(252, 211, 77, 0.3)'
            }}>
              <div style={{ color: '#FCD34D', fontSize: '12px', fontWeight: 600 }}>HEADS</div>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>
                {stats.headsGuesses > 0 ? Math.round((stats.headsWins / stats.headsGuesses) * 100) : 0}%
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '10px' }}>
                {stats.headsWins}/{stats.headsGuesses}
              </div>
            </div>
            <div style={{
              background: 'rgba(148, 163, 184, 0.1)',
              borderRadius: '8px',
              padding: '8px',
              textAlign: 'center',
              border: '1px solid rgba(148, 163, 184, 0.3)'
            }}>
              <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 600 }}>TAILS</div>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>
                {stats.tailsGuesses > 0 ? Math.round((stats.tailsWins / stats.tailsGuesses) * 100) : 0}%
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '10px' }}>
                {stats.tailsWins}/{stats.tailsGuesses}
              </div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        {stats.totalGames > 0 && (
          <button
            onClick={() => {
              setRecentResults([])
              setStats({
                totalGames: 0,
                totalWins: 0,
                totalLosses: 0,
                winRate: 0,
                totalWagered: 0,
                totalWon: 0,
                netProfit: 0,
                biggestWin: 0,
                biggestLoss: 0,
                headsGuesses: 0,
                tailsGuesses: 0,
                headsWins: 0,
                tailsWins: 0,
                longestStreak: 0,
                currentStreak: 0,
              })
            }}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#EF4444',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
            }}
          >
            Reset Stats
          </button>
        )}
      </div>
    )
  }
)

FlipPaytable.displayName = 'FlipPaytable'

export default FlipPaytable
