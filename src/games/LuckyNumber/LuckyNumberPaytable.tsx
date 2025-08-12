import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useCurrentToken } from 'gamba-react-ui-v2'
import { formatAmountWithSymbol } from '../../utils/formatAmount'

interface LuckyNumberResult {
  selectedNumber: number
  resultNumber: number
  wasWin: boolean
  amount: number
  multiplier: number
}

export interface LuckyNumberPaytableRef {
  trackGame: (result: LuckyNumberResult) => void
}

interface LuckyNumberPaytableProps {
  wager: number
  selectedNumber: number
  currentResult?: LuckyNumberResult
}

const LuckyNumberPaytable = forwardRef<LuckyNumberPaytableRef, LuckyNumberPaytableProps>(
  ({ wager, selectedNumber, currentResult }, ref) => {
    const [sessionStats, setSessionStats] = useState({
      totalGames: 0,
      totalWins: 0,
      totalWinAmount: 0,
      recentResults: [] as LuckyNumberResult[],
      numberHits: new Array(10).fill(0),
      luckyStreak: 0,
      bestStreak: 0
    })

    useImperativeHandle(ref, () => ({
      trackGame: (result: LuckyNumberResult) => {
        setSessionStats(prev => {
          const newNumberHits = [...prev.numberHits]
          newNumberHits[result.resultNumber - 1] = newNumberHits[result.resultNumber - 1] + 1
          
          const newStreak = result.wasWin ? prev.luckyStreak + 1 : 0
          
          return {
            totalGames: prev.totalGames + 1,
            totalWins: prev.totalWins + (result.wasWin ? 1 : 0),
            totalWinAmount: prev.totalWinAmount + (result.wasWin ? result.amount : 0),
            recentResults: [result, ...prev.recentResults].slice(0, 10),
            numberHits: newNumberHits,
            luckyStreak: newStreak,
            bestStreak: Math.max(prev.bestStreak, newStreak)
          }
        })
      }
    }), [])

    const winRate = sessionStats.totalGames > 0 ? (sessionStats.totalWins / sessionStats.totalGames * 100).toFixed(1) : '0.0'
    const netProfit = sessionStats.totalWinAmount - (sessionStats.totalGames * wager)
    const expectedPayout = 10 * wager // 10x multiplier for winning

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
            🍀 LUCKY NUMBER
          </h3>
        </div>

        {/* Current Pick */}
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '12px',
          padding: 16,
          border: '1px solid rgba(34, 197, 94, 0.2)'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#22c55e',
            marginBottom: 8,
            textAlign: 'center'
          }}>
            Your Lucky Number
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#e5e7eb', fontSize: '14px' }}>Selected:</span>
            <span style={{ 
              color: '#22c55e', 
              fontSize: '24px', 
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(34, 197, 94, 0.5)'
            }}>
              {selectedNumber}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#e5e7eb', fontSize: '14px' }}>Win Chance:</span>
            <span style={{ color: '#fbbf24', fontSize: '14px', fontWeight: 600 }}>
              10% (1 in 10)
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#e5e7eb', fontSize: '14px' }}>Potential Win:</span>
            <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: 600 }}>
              {expectedPayout.toFixed(2)} (10x)
            </span>
          </div>
        </div>

        {/* Game Odds */}
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
            Game Rules
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: '8px',
              background: currentResult?.wasWin 
                ? 'rgba(34, 197, 94, 0.2)' 
                : currentResult 
                ? 'rgba(239, 68, 68, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
              border: currentResult?.wasWin 
                ? '1px solid rgba(34, 197, 94, 0.4)'
                : currentResult 
                ? '1px solid rgba(239, 68, 68, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              animation: currentResult ? 'pulse 1s ease-in-out 3' : undefined
            }}>
              <span style={{ color: '#e5e7eb', fontSize: '14px' }}>Match Number</span>
              <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: 700 }}>10x Payout</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ color: '#e5e7eb', fontSize: '14px' }}>No Match</span>
              <span style={{ color: '#ef4444', fontSize: '14px', fontWeight: 700 }}>Lose Bet</span>
            </div>
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
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Picks</span>
              <span style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: 600 }}>
                {sessionStats.totalGames}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Hit Rate</span>
              <span style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: 600 }}>
                {winRate}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Lucky Streak</span>
              <span style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 600 }}>
                {sessionStats.luckyStreak}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Best Streak</span>
              <span style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 600 }}>
                {sessionStats.bestStreak}
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

        {/* Number Hit Distribution */}
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
            Number Distribution
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 4
          }}>
            {Array.from({ length: 10 }, (_, i) => {
              const number = i + 1
              const hitCount = sessionStats.numberHits[i]
              const isSelected = selectedNumber === number
              const isCurrentResult = currentResult?.resultNumber === number
              
              return (
                <div
                  key={number}
                  style={{
                    padding: '6px 4px',
                    borderRadius: '4px',
                    background: isSelected 
                      ? 'rgba(34, 197, 94, 0.2)'
                      : isCurrentResult
                      ? (currentResult?.wasWin ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.2)')
                      : 'rgba(255, 255, 255, 0.05)',
                    border: isSelected 
                      ? '1px solid rgba(34, 197, 94, 0.4)'
                      : isCurrentResult
                      ? (currentResult?.wasWin ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(239, 68, 68, 0.4)')
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center',
                    animation: isCurrentResult ? 'pulse 1s ease-in-out 3' : undefined
                  }}
                >
                  <div style={{
                    color: isSelected ? '#22c55e' : '#e5e7eb',
                    fontSize: '12px',
                    fontWeight: isSelected ? 700 : 500
                  }}>
                    {number}
                  </div>
                  <div style={{
                    color: '#9ca3af',
                    fontSize: '9px'
                  }}>
                    {hitCount}
                  </div>
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
              Recent Picks
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
                  <span style={{
                    fontSize: '12px',
                    color: '#e5e7eb'
                  }}>
                    {result.selectedNumber} → {result.resultNumber}
                  </span>
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

LuckyNumberPaytable.displayName = 'LuckyNumberPaytable'

export default LuckyNumberPaytable
