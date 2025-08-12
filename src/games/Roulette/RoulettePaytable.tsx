import React, { forwardRef, useImperativeHandle } from 'react'
import { useCurrentToken, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { formatAmount, formatAmountWithSymbol } from '../../utils/formatAmount'

interface RouletteResult {
  winningNumber: number
  betsPlaced: { [position: string]: number }
  totalWagered: number
  totalWon: number
  winningBets: string[]
  wasWin: boolean
  timestamp: number
}

interface RoulettePaytableProps {
  totalBet: number
  wager: number
  currentResult?: {
    winningNumber: number
    betsPlaced: { [position: string]: number }
    totalWon: number
    winningBets: string[]
    wasWin: boolean
  }
}

export interface RoulettePaytableRef {
  trackSpin: (result: { winningNumber: number; betsPlaced: { [position: string]: number }; totalWon: number; winningBets: string[]; wasWin: boolean; totalWagered: number }) => void
  resetSession: () => void
}

// Session statistics tracking
interface SessionStats {
  totalSpins: number
  totalWins: number
  totalWagered: number
  totalWon: number
  biggestWin: number
  longestWinStreak: number
  currentStreak: number
  numberHits: { [number: number]: number }
  favoriteNumber: number
  colorStats: { red: number; black: number; green: number }
  sectionStats: { '1st12': number; '2nd12': number; '3rd12': number; high: number; low: number; even: number; odd: number }
}

const RoulettePaytable = forwardRef<RoulettePaytableRef, RoulettePaytableProps>(({ 
  totalBet, 
  wager, 
  currentResult 
}, ref) => {
  const token = useCurrentToken()
  const [results, setResults] = React.useState<RouletteResult[]>([])
  const [sessionStats, setSessionStats] = React.useState<SessionStats>({
    totalSpins: 0,
    totalWins: 0,
    totalWagered: 0,
    totalWon: 0,
    biggestWin: 0,
    longestWinStreak: 0,
    currentStreak: 0,
    numberHits: {},
    favoriteNumber: 0,
    colorStats: { red: 0, black: 0, green: 0 },
    sectionStats: { '1st12': 0, '2nd12': 0, '3rd12': 0, high: 0, low: 0, even: 0, odd: 0 }
  })

  // Roulette number color mapping
  const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
    if (num === 0) return 'green'
    const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]
    return redNumbers.includes(num) ? 'red' : 'black'
  }

  // Common bet payouts
  const getBetPayouts = () => {
    return {
      'Straight Up': '35:1',
      'Split': '17:1',
      'Street': '11:1',
      'Corner': '8:1',
      'Six Line': '5:1',
      'Column': '2:1',
      'Dozen': '2:1',
      'Red/Black': '1:1',
      'Even/Odd': '1:1',
      'High/Low': '1:1'
    }
  }

  useImperativeHandle(ref, () => ({
    trackSpin: (result) => {
      const newResult: RouletteResult = {
        winningNumber: result.winningNumber,
        betsPlaced: result.betsPlaced,
        totalWagered: result.totalWagered,
        totalWon: result.totalWon,
        winningBets: result.winningBets,
        wasWin: result.wasWin,
        timestamp: Date.now()
      }
      
      setResults(prev => [newResult, ...prev.slice(0, 9)])
      
      setSessionStats(prev => {
        const newStats = { ...prev }
        newStats.totalSpins++
        newStats.totalWagered += result.totalWagered
        newStats.totalWon += result.totalWon
        
        // Track number hits
        newStats.numberHits[result.winningNumber] = (newStats.numberHits[result.winningNumber] || 0) + 1
        
        // Find most hit number
        let maxHits = 0
        let favoriteNum = 0
        Object.entries(newStats.numberHits).forEach(([num, hits]) => {
          if (hits > maxHits) {
            maxHits = hits
            favoriteNum = parseInt(num)
          }
        })
        newStats.favoriteNumber = favoriteNum
        
        // Track color stats
        const color = getNumberColor(result.winningNumber)
        newStats.colorStats[color]++
        
        // Track section stats
        if (result.winningNumber >= 1 && result.winningNumber <= 12) newStats.sectionStats['1st12']++
        else if (result.winningNumber >= 13 && result.winningNumber <= 24) newStats.sectionStats['2nd12']++
        else if (result.winningNumber >= 25 && result.winningNumber <= 36) newStats.sectionStats['3rd12']++
        
        if (result.winningNumber >= 19 && result.winningNumber <= 36) newStats.sectionStats.high++
        else if (result.winningNumber >= 1 && result.winningNumber <= 18) newStats.sectionStats.low++
        
        if (result.winningNumber % 2 === 0 && result.winningNumber !== 0) newStats.sectionStats.even++
        else if (result.winningNumber % 2 === 1) newStats.sectionStats.odd++
        
        if (result.totalWon > newStats.biggestWin) {
          newStats.biggestWin = result.totalWon
        }
        
        if (result.wasWin) {
          newStats.totalWins++
          newStats.currentStreak++
          if (newStats.currentStreak > newStats.longestWinStreak) {
            newStats.longestWinStreak = newStats.currentStreak
          }
        } else {
          newStats.currentStreak = 0
        }
        
        return newStats
      })
    },
    resetSession: () => {
      setResults([])
      setSessionStats({
        totalSpins: 0,
        totalWins: 0,
        totalWagered: 0,
        totalWon: 0,
        biggestWin: 0,
        longestWinStreak: 0,
        currentStreak: 0,
        numberHits: {},
        favoriteNumber: 0,
        colorStats: { red: 0, black: 0, green: 0 },
        sectionStats: { '1st12': 0, '2nd12': 0, '3rd12': 0, high: 0, low: 0, even: 0, odd: 0 }
      })
    }
  }))

  const winRate = sessionStats.totalSpins > 0 ? (sessionStats.totalWins / sessionStats.totalSpins) * 100 : 0
  const netPL = sessionStats.totalWon - sessionStats.totalWagered
  const betPayouts = getBetPayouts()

  return (
    <div style={{
      flex: '0 0 350px',
      minWidth: '300px',
      maxWidth: '400px',
      background: 'linear-gradient(135deg, rgba(40,42,60,0.95) 0%, rgba(25,27,35,0.98) 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '20px',
      height: 'fit-content',
      maxHeight: '600px',
      overflowY: 'auto',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(10px)'
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '16px', 
        borderBottom: '1px solid rgba(255,255,255,0.1)', 
        paddingBottom: '12px' 
      }}>
        <h3 style={{ 
          margin: '0 0 4px 0', 
          color: '#fff', 
          fontSize: '18px', 
          fontWeight: '600' 
        }}>
          Live Roulette Statistics
        </h3>
      </div>

      {/* Session Statistics */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ 
          margin: '0 0 8px 0', 
          color: '#00ffe1', 
          fontSize: '14px', 
          fontWeight: '600' 
        }}>
          Session Statistics
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '6px', 
          fontSize: '12px' 
        }}>
          <div style={{ color: '#888' }}>Spins:</div>
          <div style={{ color: '#fff', textAlign: 'right' }}>{sessionStats.totalSpins}</div>
          
          <div style={{ color: '#888' }}>Win Rate:</div>
          <div style={{ color: winRate >= 50 ? '#22c55e' : '#fff', textAlign: 'right' }}>
            {winRate.toFixed(1)}%
          </div>
          
          <div style={{ color: '#888' }}>Win Streak:</div>
          <div style={{ color: '#fff', textAlign: 'right' }}>
            {sessionStats.currentStreak} (best: {sessionStats.longestWinStreak})
          </div>
          
          <div style={{ color: '#888' }}>Net P/L:</div>
          <div style={{ 
            color: netPL >= 0 ? '#22c55e' : '#ef4444', 
            textAlign: 'right',
            fontWeight: '600'
          }}>
            {formatAmountWithSymbol(netPL, token, { showPlusSign: true })}
          </div>
        </div>
      </div>

      {/* Reset Button */}
      {sessionStats.totalSpins > 0 && (
        <button
          onClick={() => {
            if (ref && 'current' in ref && ref.current) {
              ref.current.resetSession()
            }
          }}
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '8px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
          }}
        >
          Reset Session
        </button>
      )}
    </div>
  )
})

RoulettePaytable.displayName = 'RoulettePaytable'

export default RoulettePaytable
