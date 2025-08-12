import React, { forwardRef, useImperativeHandle } from 'react'
import { useCurrentToken, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { formatAmount, formatAmountWithSymbol } from '../../utils/formatAmount'

interface BlackJackResult {
  playerCards: any[]
  dealerCards: any[]
  playerTotal: number
  dealerTotal: number
  outcome: 'blackjack' | 'win' | 'push' | 'lose'
  multiplier: number
  amount: number
  wasWin: boolean
  timestamp: number
}

interface BlackJackPaytableProps {
  wager: number
  currentResult?: {
    playerCards: any[]
    dealerCards: any[]
    playerTotal: number
    dealerTotal: number
    outcome: 'blackjack' | 'win' | 'push' | 'lose'
    multiplier: number
    wasWin: boolean
  }
}

export interface BlackJackPaytableRef {
  trackHand: (result: { playerCards: any[]; dealerCards: any[]; playerTotal: number; dealerTotal: number; outcome: 'blackjack' | 'win' | 'push' | 'lose'; multiplier: number; wasWin: boolean; amount: number }) => void
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
  blackjacks: number
  pushes: number
  handsWonAt21: number
  handsWonUnder21: number
  averagePlayerTotal: number
  averageDealerTotal: number
  totalPlayerValue: number
  totalDealerValue: number
  bustCount: number
  dealerBustCount: number
}

const BlackJackPaytable = forwardRef<BlackJackPaytableRef, BlackJackPaytableProps>(({ 
  wager, 
  currentResult 
}, ref) => {
  const token = useCurrentToken()
  const [results, setResults] = React.useState<BlackJackResult[]>([])
  const [sessionStats, setSessionStats] = React.useState<SessionStats>({
    totalHands: 0,
    totalWins: 0,
    totalWagered: 0,
    totalWon: 0,
    biggestWin: 0,
    longestWinStreak: 0,
    currentStreak: 0,
    blackjacks: 0,
    pushes: 0,
    handsWonAt21: 0,
    handsWonUnder21: 0,
    averagePlayerTotal: 0,
    averageDealerTotal: 0,
    totalPlayerValue: 0,
    totalDealerValue: 0,
    bustCount: 0,
    dealerBustCount: 0
  })

  // Get standard BlackJack payouts
  const getPayoutStructure = () => {
    return {
      'Blackjack': '3:2 (2.5x)',
      'Regular Win': '1:1 (2x)',
      'Push': '1:1 (1x)',
      'Loss': '0x'
    }
  }

  useImperativeHandle(ref, () => ({
    trackHand: (result) => {
      const newResult: BlackJackResult = {
        playerCards: result.playerCards,
        dealerCards: result.dealerCards,
        playerTotal: result.playerTotal,
        dealerTotal: result.dealerTotal,
        outcome: result.outcome,
        multiplier: result.multiplier,
        amount: result.amount,
        wasWin: result.wasWin,
        timestamp: Date.now()
      }
      
      setResults(prev => [newResult, ...prev.slice(0, 9)])
      
      setSessionStats(prev => {
        const newStats = { ...prev }
        newStats.totalHands++
        newStats.totalWagered += wager
        newStats.totalWon += result.amount
        newStats.totalPlayerValue += result.playerTotal
        newStats.totalDealerValue += result.dealerTotal
        
        // Calculate averages
        newStats.averagePlayerTotal = newStats.totalPlayerValue / newStats.totalHands
        newStats.averageDealerTotal = newStats.totalDealerValue / newStats.totalHands
        
        // Track bust counts
        if (result.playerTotal > 21) newStats.bustCount++
        if (result.dealerTotal > 21) newStats.dealerBustCount++
        
        // Track specific outcomes
        if (result.outcome === 'blackjack') {
          newStats.blackjacks++
        } else if (result.outcome === 'push') {
          newStats.pushes++
        }
        
        // Track winning patterns
        if (result.wasWin) {
          if (result.playerTotal === 21) {
            newStats.handsWonAt21++
          } else {
            newStats.handsWonUnder21++
          }
        }
        
        if (result.amount > newStats.biggestWin) {
          newStats.biggestWin = result.amount
        }
        
        if (result.wasWin || result.outcome === 'push') {
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
        totalHands: 0,
        totalWins: 0,
        totalWagered: 0,
        totalWon: 0,
        biggestWin: 0,
        longestWinStreak: 0,
        currentStreak: 0,
        blackjacks: 0,
        pushes: 0,
        handsWonAt21: 0,
        handsWonUnder21: 0,
        averagePlayerTotal: 0,
        averageDealerTotal: 0,
        totalPlayerValue: 0,
        totalDealerValue: 0,
        bustCount: 0,
        dealerBustCount: 0
      })
    }
  }))

  const winRate = sessionStats.totalHands > 0 ? (sessionStats.totalWins / sessionStats.totalHands) * 100 : 0
  const blackjackRate = sessionStats.totalHands > 0 ? (sessionStats.blackjacks / sessionStats.totalHands) * 100 : 0
  const netPL = sessionStats.totalWon - sessionStats.totalWagered
  const payoutStructure = getPayoutStructure()

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
          Live BlackJack Statistics
        </h3>
        <p style={{ 
          margin: 0, 
          color: '#888', 
          fontSize: '13px' 
        }}>
          Session tracking • Wager: {formatAmountWithSymbol(wager, token)}
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
          <div style={{ color: '#888' }}>Hands:</div>
          <div style={{ color: '#fff', textAlign: 'right' }}>{sessionStats.totalHands}</div>
          
          <div style={{ color: '#888' }}>Win Rate:</div>
          <div style={{ color: winRate >= 50 ? '#22c55e' : '#fff', textAlign: 'right' }}>
            {winRate.toFixed(1)}%
          </div>
          
          <div style={{ color: '#888' }}>Blackjacks:</div>
          <div style={{ color: '#ffd700', textAlign: 'right' }}>
            {sessionStats.blackjacks} ({blackjackRate.toFixed(1)}%)
          </div>
          
          <div style={{ color: '#888' }}>Pushes:</div>
          <div style={{ color: '#8b4513', textAlign: 'right' }}>{sessionStats.pushes}</div>
          
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
      {sessionStats.totalHands > 0 && (
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

BlackJackPaytable.displayName = 'BlackJackPaytable'

export default BlackJackPaytable