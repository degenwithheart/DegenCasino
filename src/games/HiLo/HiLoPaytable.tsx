import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { TokenValue } from 'gamba-react-ui-v2'

interface HiLoResult {
  guessType: 'higher' | 'lower'
  targetCard: number
  resultCard: number
  wasWin: boolean
  amount: number
  multiplier: number
}

interface HiLoStats {
  totalGames: number
  totalWins: number
  totalLosses: number
  winRate: number
  totalWagered: number
  totalWon: number
  netProfit: number
  biggestWin: number
  biggestLoss: number
  correctGuesses: number
  averageMultiplier: number
  longestStreak: number
  currentStreak: number
}

export interface HiLoPaytableRef {
  trackGame: (result: HiLoResult) => void
  resetStats: () => void
}

interface HiLoPaytableProps {
  wager: number
  currentCard?: number
  guessType?: 'higher' | 'lower'
  currentResult?: {
    guessType: 'higher' | 'lower'
    targetCard: number
    resultCard: number
    wasWin: boolean
    multiplier: number
  }
}

const HiLoPaytable = forwardRef<HiLoPaytableRef, HiLoPaytableProps>(
  ({ wager, currentCard, guessType, currentResult }, ref) => {
    const [recentResults, setRecentResults] = useState<HiLoResult[]>([])
    const [stats, setStats] = useState<HiLoStats>({
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      winRate: 0,
      totalWagered: 0,
      totalWon: 0,
      netProfit: 0,
      biggestWin: 0,
      biggestLoss: 0,
      correctGuesses: 0,
      averageMultiplier: 0,
      longestStreak: 0,
      currentStreak: 0,
    })

    useImperativeHandle(ref, () => ({
      trackGame: (result: HiLoResult) => {
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
            correctGuesses: result.wasWin ? prev.correctGuesses + 1 : prev.correctGuesses,
            averageMultiplier: 0,
            longestStreak: Math.max(prev.longestStreak, newStreak),
            currentStreak: newStreak,
          }
          
          newStats.winRate = newStats.totalGames > 0 ? (newStats.totalWins / newStats.totalGames) * 100 : 0
          newStats.netProfit = newStats.totalWon - newStats.totalWagered
          
          const allResults = recentResults.concat([result]).slice(0, newStats.totalGames)
          newStats.averageMultiplier = newStats.totalGames > 0 ? 
            allResults.reduce((sum, r) => sum + r.multiplier, 0) / newStats.totalGames : 0
          
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
          correctGuesses: 0,
          averageMultiplier: 0,
          longestStreak: 0,
          currentStreak: 0,
        })
      }
    }))

    const getCardName = (cardValue: number) => {
      const suits = ['♠', '♥', '♦', '♣']
      const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
      const suitIndex = Math.floor((cardValue - 1) / 13)
      const rankIndex = (cardValue - 1) % 13
      return `${ranks[rankIndex]}${suits[suitIndex]}`
    }

    const getCardColor = (cardValue: number) => {
      const suitIndex = Math.floor((cardValue - 1) / 13)
      return suitIndex === 1 || suitIndex === 2 ? '#EF4444' : '#000'
    }

    const getPotentialMultiplier = () => {
      if (!currentCard || !guessType) return 0
      
      const higherCards = guessType === 'higher' ? (52 - currentCard) : currentCard - 1
      const lowerCards = 52 - higherCards
      const winningCards = guessType === 'higher' ? higherCards : lowerCards
      
      if (winningCards === 0) return 0
      return 52 / winningCards
    }

    const potentialMultiplier = getPotentialMultiplier()
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
            background: 'linear-gradient(45deg, #EF4444, #FCD34D)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🎴 HiLo Paytable
          </h3>
        </div>

        {/* Current Game Info */}
        {currentCard && guessType && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            padding: '12px',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <div style={{ fontSize: '14px', color: '#FCA5A5', fontWeight: 600, marginBottom: '8px' }}>
              Current Guess
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  background: '#fff',
                  color: getCardColor(currentCard),
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 700,
                  minWidth: '40px',
                  textAlign: 'center'
                }}>
                  {getCardName(currentCard)}
                </div>
                <span style={{ color: '#fff', fontSize: '14px' }}>
                  → {guessType.toUpperCase()}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#FCD34D', fontSize: '12px' }}>
                  {potentialMultiplier.toFixed(2)}x
                </div>
                <div style={{ color: '#22C55E', fontSize: '12px' }}>
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
              <span style={{ color: '#9CA3AF' }}>Streak:</span>
              <span style={{ color: '#FCD34D', fontWeight: 600, marginLeft: '4px' }}>
                {stats.currentStreak} ({stats.longestStreak})
              </span>
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
                        background: '#fff',
                        color: getCardColor(result.targetCard),
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        fontWeight: 700,
                        minWidth: '24px',
                        textAlign: 'center'
                      }}>
                        {getCardName(result.targetCard)}
                      </div>
                      <span style={{ color: '#fff', fontSize: '10px' }}>
                        {result.guessType === 'higher' ? '↑' : '↓'}
                      </span>
                      <div style={{
                        background: '#fff',
                        color: getCardColor(result.resultCard),
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        fontWeight: 700,
                        minWidth: '24px',
                        textAlign: 'center'
                      }}>
                        {getCardName(result.resultCard)}
                      </div>
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
                correctGuesses: 0,
                averageMultiplier: 0,
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

HiLoPaytable.displayName = 'HiLoPaytable'

export default HiLoPaytable
