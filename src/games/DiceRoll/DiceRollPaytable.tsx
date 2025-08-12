import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useCurrentToken } from 'gamba-react-ui-v2'
import { formatAmountWithSymbol } from '../../utils/formatAmount'

interface DiceRollResult {
  selectedFace: number
  resultFace: number
  wasWin: boolean
  amount: number
}

export interface DiceRollPaytableRef {
  trackGame: (result: DiceRollResult) => void
}

interface DiceRollPaytableProps {
  wager: number
  selectedFace: number
  currentResult?: DiceRollResult
}

// Dice face multipliers (should match the bet array used in play)
const DICE_MULTIPLIERS = [0, 0, 0, 1.2, 1.5, 2];

const DiceRollPaytable = forwardRef<DiceRollPaytableRef, DiceRollPaytableProps>(
  ({ wager, selectedFace, currentResult }, ref) => {
    const [sessionStats, setSessionStats] = useState({
      totalGames: 0,
      totalWins: 0,
      totalWinAmount: 0,
      recentResults: [] as DiceRollResult[]
    })

    useImperativeHandle(ref, () => ({
      trackGame: (result: DiceRollResult) => {
        setSessionStats(prev => ({
          totalGames: prev.totalGames + 1,
          totalWins: prev.totalWins + (result.wasWin ? 1 : 0),
          totalWinAmount: prev.totalWinAmount + (result.wasWin ? result.amount : 0),
          recentResults: [result, ...prev.recentResults].slice(0, 10)
        }))
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
            🎲 DICE ROLL ODDS
          </h3>
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
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>Games</span>
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
              Recent Results
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              flex: 1,
              overflow: 'auto'
            }}>
              {sessionStats.recentResults.slice(0, 8).map((result, index) => (
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
                    {result.selectedFace} → {result.resultFace}
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

DiceRollPaytable.displayName = 'DiceRollPaytable'

export default DiceRollPaytable
