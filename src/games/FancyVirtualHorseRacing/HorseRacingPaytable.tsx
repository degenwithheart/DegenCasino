import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useCurrentToken } from 'gamba-react-ui-v2'
import { formatAmountWithSymbol } from '../../utils/formatAmount'

export interface HorseRacingPaytableRef {
  trackRace: (data: {
    selectedHorse: number
    winnerHorse: number
    horseName: string
    odds: number
    win: boolean
    wager: number
    payout: number
  }) => void
}

interface RaceResult {
  selectedHorse: number
  winnerHorse: number
  horseName: string
  odds: number
  win: boolean
  wager: number
  payout: number
  timestamp: number
}

interface HorseRacingPaytableProps {}

const HorseRacingPaytable = forwardRef<HorseRacingPaytableRef, HorseRacingPaytableProps>((props, ref) => {
  const [sessionStats, setSessionStats] = useState({
    totalRaces: 0,
    totalWagered: 0,
    totalWon: 0,
    winCount: 0,
    horseWins: {} as Record<number, number>,
    averageOdds: 0
  })
  
  const [recentResults, setRecentResults] = useState<RaceResult[]>([])
  const [favoriteHorse, setFavoriteHorse] = useState<number | null>(null)
  const [winStreak, setWinStreak] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)

  useImperativeHandle(ref, () => ({
    trackRace: (data) => {
      const now = Date.now()
      
      // Update session stats
      setSessionStats(prev => {
        const newTotalRaces = prev.totalRaces + 1
        const newTotalWagered = prev.totalWagered + data.wager
        const newTotalWon = prev.totalWon + data.payout
        const newWinCount = prev.winCount + (data.win ? 1 : 0)
        
        // Update horse wins
        const newHorseWins = { ...prev.horseWins }
        if (data.win) {
          newHorseWins[data.selectedHorse] = (newHorseWins[data.selectedHorse] || 0) + 1
        }
        
        // Calculate average odds
        const newAverageOdds = ((prev.averageOdds * prev.totalRaces) + data.odds) / newTotalRaces
        
        return {
          totalRaces: newTotalRaces,
          totalWagered: newTotalWagered,
          totalWon: newTotalWon,
          winCount: newWinCount,
          horseWins: newHorseWins,
          averageOdds: newAverageOdds
        }
      })
      
      // Update streaks
      if (data.win) {
        setCurrentStreak(prev => prev + 1)
        setWinStreak(prev => Math.max(prev, currentStreak + 1))
      } else {
        setCurrentStreak(0)
      }
      
      // Update favorite horse (most picked)
      setFavoriteHorse(data.selectedHorse)
      
      // Add to recent results
      const newResult: RaceResult = {
        ...data,
        timestamp: now
      }
      setRecentResults(prev => [newResult, ...prev.slice(0, 9)])
    }
  }))

  const winRate = sessionStats.totalRaces > 0 ? (sessionStats.winCount / sessionStats.totalRaces) * 100 : 0
  const netPnL = sessionStats.totalWon - sessionStats.totalWagered
  const profitMargin = sessionStats.totalWagered > 0 ? ((sessionStats.totalWon - sessionStats.totalWagered) / sessionStats.totalWagered) * 100 : 0

  // Horse performance data
  const horseColors = ['#ffb347', '#77dd77', '#779ecb', '#ff6961']
  const horseNames = ['Lightning', 'Thunder', 'Storm', 'Blaze']

  return (
  <div className="fancyvirtualhorseracing-paytable" style={{
      background: 'linear-gradient(135deg, #2d1b1e 0%, #1a2332 50%, #0f1419 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 12,
      padding: 16,
      color: '#fff',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
      
      {/* Header */}
      <div style={{
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: 12
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #ff6961, #ffb347)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center'
        }}>
          🏇 Racing Analytics
        </h3>
      </div>

      {/* Session Stats */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        padding: 12
      }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#ffb347' }}>Session Statistics</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
          <div>
            <div style={{ color: '#aaa' }}>Total Races:</div>
            <div style={{ fontWeight: 'bold' }}>{sessionStats.totalRaces}</div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>Win Rate:</div>
            <div style={{ 
              fontWeight: 'bold',
              color: winRate >= 25 ? '#4ade80' : winRate >= 15 ? '#fbbf24' : '#ef4444'
            }}>
              {winRate.toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>Net P&L:</div>
            <div style={{ 
              fontWeight: 'bold',
              color: netPnL > 0 ? '#4ade80' : netPnL < 0 ? '#ef4444' : '#fff'
            }}>
              {netPnL > 0 ? '+' : ''}{netPnL.toFixed(4)}
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>Win Streak:</div>
            <div style={{ 
              fontWeight: 'bold',
              color: winStreak >= 3 ? '#ffd93d' : '#fff'
            }}>
              {winStreak} 🔥
            </div>
          </div>
        </div>
      </div>

      {/* Horse Performance */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        padding: 12,
        flex: 1
      }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#ff6961' }}>Horse Performance</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {horseNames.map((name, index) => {
            const wins = sessionStats.horseWins[index] || 0
            const winPercentage = sessionStats.totalRaces > 0 ? (wins / sessionStats.totalRaces) * 100 : 0
            const isTopPerformer = wins > 0 && wins === Math.max(...Object.values(sessionStats.horseWins))
            
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 8,
                  background: isTopPerformer 
                    ? 'linear-gradient(135deg, rgba(255, 185, 71, 0.2), rgba(255, 105, 97, 0.2))'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: isTopPerformer ? '1px solid rgba(255, 185, 71, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 6
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: horseColors[index],
                    border: '2px solid #fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }} />
                  <div style={{ fontSize: 12, fontWeight: 'bold' }}>
                    {name}
                    {favoriteHorse === index && (
                      <span style={{ color: '#ffd93d', marginLeft: 4 }}>⭐</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 11, color: '#aaa' }}>
                    {wins} wins
                  </div>
                  <div style={{ 
                    fontSize: 11,
                    fontWeight: 'bold',
                    color: isTopPerformer ? '#ffd93d' : '#666'
                  }}>
                    {winPercentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Betting Insights */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        padding: 12
      }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#779ecb' }}>Betting Insights</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
          <div>
            <div style={{ color: '#aaa' }}>Avg Odds:</div>
            <div style={{ fontWeight: 'bold' }}>{sessionStats.averageOdds.toFixed(2)}x</div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>ROI:</div>
            <div style={{ 
              fontWeight: 'bold',
              color: profitMargin > 0 ? '#4ade80' : profitMargin < 0 ? '#ef4444' : '#fff'
            }}>
              {profitMargin > 0 ? '+' : ''}{profitMargin.toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>Current Streak:</div>
            <div style={{ 
              fontWeight: 'bold',
              color: currentStreak >= 2 ? '#4ade80' : currentStreak === 1 ? '#fbbf24' : '#ef4444'
            }}>
              {currentStreak === 0 ? 'Loss' : `${currentStreak} Win${currentStreak > 1 ? 's' : ''}`}
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>Races Today:</div>
            <div style={{ fontWeight: 'bold' }}>{sessionStats.totalRaces}</div>
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        padding: 12
      }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#06b6d4' }}>Recent Results</h4>
        {recentResults.length === 0 ? (
          <div style={{ color: '#666', fontSize: 12, textAlign: 'center', padding: 20 }}>
            No races yet - place your first bet! 🏇
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {recentResults.slice(0, 5).map((result, index) => (
              <div
                key={result.timestamp}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 8px',
                  background: result.win 
                    ? 'rgba(74, 222, 128, 0.1)' 
                    : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${result.win ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                  borderRadius: 6,
                  fontSize: 11,
                  opacity: 1 - (index * 0.15)
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: horseColors[result.selectedHorse],
                    border: '1px solid #fff'
                  }} />
                  <span style={{ fontWeight: 'bold' }}>
                    {horseNames[result.selectedHorse]}
                  </span>
                  <span style={{ color: '#aaa' }}>
                    {result.odds.toFixed(2)}x
                  </span>
                </div>
                <div style={{ 
                  color: result.win ? '#4ade80' : '#ef4444',
                  fontWeight: 'bold'
                }}>
                  {result.win ? '+' : ''}{(result.payout - result.wager).toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Track Conditions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 8,
        background: 'rgba(139, 69, 19, 0.2)',
        border: '1px solid rgba(139, 69, 19, 0.4)',
        borderRadius: 6
      }}>
        <div style={{
          fontSize: 16
        }}>
          🏁
        </div>
        <div style={{ fontSize: 11, color: '#deb887', fontWeight: 'bold' }}>
          TRACK CONDITIONS: FAST
        </div>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#4ade80',
          animation: 'pulse 2s infinite'
        }} />
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  )
})

HorseRacingPaytable.displayName = 'HorseRacingPaytable'
export default HorseRacingPaytable
