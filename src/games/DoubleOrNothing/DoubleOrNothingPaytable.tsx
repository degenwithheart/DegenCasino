import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { TokenValue, useCurrentToken } from 'gamba-react-ui-v2'
import { formatAmountWithSymbol } from '../../utils/formatAmount'

interface DoubleOrNothingResult {
  choice: 'double' | 'triple' | 'degen' | 'nothing'
  result: 'double' | 'triple' | 'degen' | 'nothing'
  wasWin: boolean
  amount: number
  multiplier: number
  currentRound: number
}

interface DoubleOrNothingStats {
  totalGames: number
  totalWins: number
  totalLosses: number
  winRate: number
  totalWagered: number
  totalWon: number
  netProfit: number
  biggestWin: number
  biggestLoss: number
  doubleChoices: number
  tripleChoices: number
  degenChoices: number
  nothingChoices: number
  doubleWins: number
  tripleWins: number
  degenWins: number
  nothingWins: number
  maxRounds: number
  averageRounds: number
  longestStreak: number
  currentStreak: number
}

export interface DoubleOrNothingPaytableRef {
  trackGame: (result: DoubleOrNothingResult) => void
  resetStats: () => void
}

interface DoubleOrNothingPaytableProps {
  wager: number
  selectedChoice?: 'double' | 'triple' | 'degen' | 'nothing'
  currentRound?: number
  currentResult?: {
    choice: 'double' | 'triple' | 'degen' | 'nothing'
    result: 'double' | 'triple' | 'degen' | 'nothing'
    wasWin: boolean
    multiplier: number
    currentRound: number
  }
}

const DoubleOrNothingPaytable = forwardRef<DoubleOrNothingPaytableRef, DoubleOrNothingPaytableProps>(
  ({ wager, selectedChoice, currentRound = 1, currentResult }, ref) => {
    const [recentResults, setRecentResults] = useState<DoubleOrNothingResult[]>([])
    const [stats, setStats] = useState<DoubleOrNothingStats>({
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      winRate: 0,
      totalWagered: 0,
      totalWon: 0,
      netProfit: 0,
      biggestWin: 0,
      biggestLoss: 0,
      doubleChoices: 0,
      tripleChoices: 0,
      degenChoices: 0,
      nothingChoices: 0,
      doubleWins: 0,
      tripleWins: 0,
      degenWins: 0,
      nothingWins: 0,
      maxRounds: 0,
      averageRounds: 0,
      longestStreak: 0,
      currentStreak: 0,
    })

    useImperativeHandle(ref, () => ({
      trackGame: (result: DoubleOrNothingResult) => {
        setRecentResults(prev => [result, ...prev.slice(0, 9)])
        
        setStats(prev => {
          const newStreak = result.wasWin ? prev.currentStreak + 1 : 0
          const allRounds = recentResults.concat([result]).slice(0, prev.totalGames + 1).map(r => r.currentRound)
          const totalRounds = allRounds.reduce((sum, rounds) => sum + rounds, 0)
          
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
            doubleChoices: result.choice === 'double' ? prev.doubleChoices + 1 : prev.doubleChoices,
            tripleChoices: result.choice === 'triple' ? prev.tripleChoices + 1 : prev.tripleChoices,
            degenChoices: result.choice === 'degen' ? prev.degenChoices + 1 : prev.degenChoices,
            nothingChoices: result.choice === 'nothing' ? prev.nothingChoices + 1 : prev.nothingChoices,
            doubleWins: result.choice === 'double' && result.wasWin ? prev.doubleWins + 1 : prev.doubleWins,
            tripleWins: result.choice === 'triple' && result.wasWin ? prev.tripleWins + 1 : prev.tripleWins,
            degenWins: result.choice === 'degen' && result.wasWin ? prev.degenWins + 1 : prev.degenWins,
            nothingWins: result.choice === 'nothing' && result.wasWin ? prev.nothingWins + 1 : prev.nothingWins,
            maxRounds: Math.max(prev.maxRounds, result.currentRound),
            averageRounds: 0,
            longestStreak: Math.max(prev.longestStreak, newStreak),
            currentStreak: newStreak,
          }
          
          newStats.winRate = newStats.totalGames > 0 ? (newStats.totalWins / newStats.totalGames) * 100 : 0
          newStats.netProfit = newStats.totalWon - newStats.totalWagered
          newStats.averageRounds = newStats.totalGames > 0 ? totalRounds / newStats.totalGames : 0
          
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
          doubleChoices: 0,
          tripleChoices: 0,
          degenChoices: 0,
          nothingChoices: 0,
          doubleWins: 0,
          tripleWins: 0,
          degenWins: 0,
          nothingWins: 0,
          maxRounds: 0,
          averageRounds: 0,
          longestStreak: 0,
          currentStreak: 0,
        })
      }
    }))

    const potentialMultiplier = selectedChoice === 'double' ? 2 : 
                                selectedChoice === 'triple' ? 3 : 
                                selectedChoice === 'degen' ? 10 : 1
    const potentialPayout = wager * potentialMultiplier

    return (
    <div className="doubleornothing-paytable" style={{
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
            background: 'linear-gradient(45deg, #10B981, #EF4444)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🎰 Double or Nothing Stats
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
              <span style={{ color: '#9CA3AF' }}>Max Rounds:</span>
              <span style={{ color: '#FCD34D', fontWeight: 600, marginLeft: '4px' }}>
                {stats.maxRounds}
              </span>
            </div>
          </div>
        </div>

        {/* Choice Analysis */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '12px'
        }}>
          <div style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: 600, marginBottom: '8px' }}>
            Choice Analysis
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '8px',
              padding: '6px',
              textAlign: 'center',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}>
              <div style={{ color: '#22C55E', fontSize: '11px', fontWeight: 600 }}>2X</div>
              <div style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                {stats.doubleChoices > 0 ? Math.round((stats.doubleWins / stats.doubleChoices) * 100) : 0}%
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '9px' }}>
                {stats.doubleWins}/{stats.doubleChoices}
              </div>
            </div>
            <div style={{
              background: 'rgba(251, 191, 36, 0.1)',
              borderRadius: '8px',
              padding: '6px',
              textAlign: 'center',
              border: '1px solid rgba(251, 191, 36, 0.3)'
            }}>
              <div style={{ color: '#FBBF24', fontSize: '11px', fontWeight: 600 }}>3X</div>
              <div style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                {stats.tripleChoices > 0 ? Math.round((stats.tripleWins / stats.tripleChoices) * 100) : 0}%
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '9px' }}>
                {stats.tripleWins}/{stats.tripleChoices}
              </div>
            </div>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              padding: '6px',
              textAlign: 'center',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <div style={{ color: '#EF4444', fontSize: '11px', fontWeight: 600 }}>10X</div>
              <div style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                {stats.degenChoices > 0 ? Math.round((stats.degenWins / stats.degenChoices) * 100) : 0}%
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '9px' }}>
                {stats.degenWins}/{stats.degenChoices}
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
                doubleChoices: 0,
                tripleChoices: 0,
                degenChoices: 0,
                nothingChoices: 0,
                doubleWins: 0,
                tripleWins: 0,
                degenWins: 0,
                nothingWins: 0,
                maxRounds: 0,
                averageRounds: 0,
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

DoubleOrNothingPaytable.displayName = 'DoubleOrNothingPaytable'

export default DoubleOrNothingPaytable
