import React, { forwardRef, useImperativeHandle } from 'react'
import { useCurrentToken, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { formatAmount, formatAmountWithSymbol } from '../../utils/formatAmount'

interface KenoResult {
  selectedNumbers: number[]
  drawnNumbers: number[]
  hits: number
  multiplier: number
  amount: number
  wasWin: boolean
  timestamp: number
}

interface KenoPaytableProps {
  selectedCount: number
  wager: number
  currentResult?: {
    selectedNumbers: number[]
    drawnNumbers: number[]
    hits: number
    multiplier: number
    wasWin: boolean
  }
}

export interface KenoPaytableRef {
  trackGame: (result: { selectedNumbers: number[]; drawnNumbers: number[]; hits: number; multiplier: number; wasWin: boolean; amount: number }) => void
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
  totalHits: number
  averageHits: number
  bestHits: number
  selectionHistory: { [key: number]: number } // tracks how often each selection count is used
  hitDistribution: { [key: number]: number } // tracks distribution of hits achieved
}

const KenoPaytable = forwardRef<KenoPaytableRef, KenoPaytableProps>(({ 
  selectedCount, 
  wager, 
  currentResult 
}, ref) => {
  const token = useCurrentToken()
  const [results, setResults] = React.useState<KenoResult[]>([])
  const [sessionStats, setSessionStats] = React.useState<SessionStats>({
    totalGames: 0,
    totalWins: 0,
    totalWagered: 0,
    totalWon: 0,
    biggestWin: 0,
    longestWinStreak: 0,
    currentStreak: 0,
    totalHits: 0,
    averageHits: 0,
    bestHits: 0,
    selectionHistory: {},
    hitDistribution: {}
  })

  // Get theoretical payouts for different hit counts
  const getPayoutTable = (selections: number) => {
    const payouts: { [hits: number]: number } = {}
    
    // Simplified Keno payout structure based on selections
    if (selections === 1) {
      payouts[1] = 3.6
    } else if (selections === 2) {
      payouts[2] = 9
    } else if (selections === 3) {
      payouts[2] = 2
      payouts[3] = 27
    } else if (selections === 4) {
      payouts[2] = 1
      payouts[3] = 4
      payouts[4] = 100
    } else if (selections === 5) {
      payouts[3] = 2
      payouts[4] = 20
      payouts[5] = 400
    } else if (selections >= 6) {
      payouts[3] = 1
      payouts[4] = 3
      payouts[5] = 20
      payouts[6] = 100
      if (selections >= 7) payouts[7] = 500
      if (selections >= 8) payouts[8] = 2000
      if (selections >= 9) payouts[9] = 10000
      if (selections >= 10) payouts[10] = 100000
    }
    
    return payouts
  }

  useImperativeHandle(ref, () => ({
    trackGame: (result) => {
      const newResult: KenoResult = {
        selectedNumbers: result.selectedNumbers,
        drawnNumbers: result.drawnNumbers,
        hits: result.hits,
        multiplier: result.multiplier,
        amount: result.amount,
        wasWin: result.wasWin,
        timestamp: Date.now()
      }
      
      setResults(prev => [newResult, ...prev.slice(0, 9)])
      
      setSessionStats(prev => {
        const newStats = { ...prev }
        newStats.totalGames++
        newStats.totalWagered += wager
        newStats.totalWon += result.amount
        newStats.totalHits += result.hits
        newStats.averageHits = newStats.totalHits / newStats.totalGames
        
        if (result.hits > newStats.bestHits) {
          newStats.bestHits = result.hits
        }
        
        if (result.amount > newStats.biggestWin) {
          newStats.biggestWin = result.amount
        }
        
        // Track selection history
        const selectionCount = result.selectedNumbers.length
        newStats.selectionHistory[selectionCount] = (newStats.selectionHistory[selectionCount] || 0) + 1
        
        // Track hit distribution
        newStats.hitDistribution[result.hits] = (newStats.hitDistribution[result.hits] || 0) + 1
        
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
        totalGames: 0,
        totalWins: 0,
        totalWagered: 0,
        totalWon: 0,
        biggestWin: 0,
        longestWinStreak: 0,
        currentStreak: 0,
        totalHits: 0,
        averageHits: 0,
        bestHits: 0,
        selectionHistory: {},
        hitDistribution: {}
      })
    }
  }))

  const winRate = sessionStats.totalGames > 0 ? (sessionStats.totalWins / sessionStats.totalGames) * 100 : 0
  const netPL = sessionStats.totalWon - sessionStats.totalWagered
  const payoutTable = getPayoutTable(selectedCount)

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
          Live Keno Statistics
        </h3>
        <p style={{ 
          margin: 0, 
          color: '#888', 
          fontSize: '13px' 
        }}>
          Session tracking • {selectedCount} numbers selected
        </p>
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
          <div style={{ color: '#888' }}>Games:</div>
          <div style={{ color: '#fff', textAlign: 'right' }}>{sessionStats.totalGames}</div>
          
          <div style={{ color: '#888' }}>Win Rate:</div>
          <div style={{ color: winRate >= 50 ? '#22c55e' : '#fff', textAlign: 'right' }}>
            {winRate.toFixed(1)}%
          </div>
          
          <div style={{ color: '#888' }}>Avg Hits:</div>
          <div style={{ color: '#fff', textAlign: 'right' }}>
            {sessionStats.averageHits.toFixed(1)}
          </div>
          
          <div style={{ color: '#888' }}>Best Hits:</div>
          <div style={{ color: '#ffd700', textAlign: 'right' }}>{sessionStats.bestHits}</div>
          
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
            {netPL >= 0 ? '+' : ''}{formatAmount(netPL)} {token?.symbol}
          </div>
        </div>
      </div>

      {/* Reset Button */}
      {sessionStats.totalGames > 0 && (
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

KenoPaytable.displayName = 'KenoPaytable'

export default KenoPaytable
