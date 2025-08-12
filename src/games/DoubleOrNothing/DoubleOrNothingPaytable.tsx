import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { TokenValue, useCurrentToken } from 'gamba-react-ui-v2'
import { formatAmountWithSymbol } from '../../utils/formatAmount'

interface DoubleOrNothingResult {
  choice: 'double' | 'nothing'
  result: 'double' | 'nothing'
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
  nothingChoices: number
  doubleWins: number
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
  selectedChoice?: 'double' | 'nothing'
  currentRound?: number
  currentResult?: {
    choice: 'double' | 'nothing'
    result: 'double' | 'nothing'
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
      nothingChoices: 0,
      doubleWins: 0,
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
            nothingChoices: result.choice === 'nothing' ? prev.nothingChoices + 1 : prev.nothingChoices,
            doubleWins: result.choice === 'double' && result.wasWin ? prev.doubleWins + 1 : prev.doubleWins,
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
          nothingChoices: 0,
          doubleWins: 0,
          nothingWins: 0,
          maxRounds: 0,
          averageRounds: 0,
          longestStreak: 0,
          currentStreak: 0,
        })
      }
    }))

    const potentialMultiplier = selectedChoice === 'double' ? 2 : 1
    const potentialPayout = wager * potentialMultiplier

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
            background: 'linear-gradient(45deg, #10B981, #EF4444)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🎰 Double or Nothing
          </h3>
        </div>

        {/* Current Game Info */}
        {selectedChoice && (
          <div style={{
            background: selectedChoice === 'double' 
              ? 'rgba(34, 197, 94, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            padding: '12px',
            border: selectedChoice === 'double' 
              ? '1px solid rgba(34, 197, 94, 0.3)'
              : '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <div style={{ 
              fontSize: '14px', 
              color: selectedChoice === 'double' ? '#22C55E' : '#EF4444', 
              fontWeight: 600, 
              marginBottom: '8px' 
            }}>
              Current Choice
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  background: selectedChoice === 'double' 
                    ? 'linear-gradient(135deg, #22C55E, #10B981)' 
                    : 'linear-gradient(135deg, #EF4444, #DC2626)',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  textAlign: 'center'
                }}>
                  {selectedChoice === 'double' ? '💰 DOUBLE' : '❌ NOTHING'}
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '12px' }}>
                  Round {currentRound}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#22C55E', fontSize: '12px' }}>
                  50% chance
                </div>
                <div style={{ color: '#FCD34D', fontSize: '12px' }}>
                  <TokenValue amount={potentialPayout} />
                </div>
              </div>
            </div>
          </div>
        )}

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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '8px',
              padding: '8px',
              textAlign: 'center',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}>
              <div style={{ color: '#22C55E', fontSize: '12px', fontWeight: 600 }}>DOUBLE</div>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>
                {stats.doubleChoices > 0 ? Math.round((stats.doubleWins / stats.doubleChoices) * 100) : 0}%
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '10px' }}>
                {stats.doubleWins}/{stats.doubleChoices}
              </div>
            </div>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              padding: '8px',
              textAlign: 'center',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <div style={{ color: '#EF4444', fontSize: '12px', fontWeight: 600 }}>NOTHING</div>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>
                {stats.nothingChoices > 0 ? Math.round((stats.nothingWins / stats.nothingChoices) * 100) : 0}%
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '10px' }}>
                {stats.nothingWins}/{stats.nothingChoices}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Results */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '12px'
        }}>
          <div style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: 600, marginBottom: '8px' }}>
            Recent Results
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '200px', overflowY: 'auto' }}>
            {recentResults.length === 0 ? (
              <div style={{ color: '#6B7280', fontSize: '12px', textAlign: 'center', padding: '8px' }}>
                No games played yet
              </div>
            ) : (
              recentResults.map((result, index) => (
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
                    border: `1px solid ${result.wasWin ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    fontSize: '11px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: result.wasWin ? '#22C55E' : '#EF4444' }}>
                      {result.wasWin ? '✓' : '✗'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{
                        background: result.choice === 'double' 
                          ? 'linear-gradient(135deg, #22C55E, #10B981)' 
                          : 'linear-gradient(135deg, #EF4444, #DC2626)',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 700
                      }}>
                        {result.choice === 'double' ? '💰' : '❌'}
                      </div>
                      <span style={{ color: '#9CA3AF', fontSize: '10px' }}>
                        R{result.currentRound}
                      </span>
                    </div>
                  </div>
                  <span style={{ 
                    color: result.wasWin ? '#22C55E' : '#EF4444',
                    fontWeight: 600 
                  }}>
                    <TokenValue amount={result.wasWin ? result.amount : -wager} />
                  </span>
                </div>
              ))
            )}
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
                nothingChoices: 0,
                doubleWins: 0,
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
