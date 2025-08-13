import React from 'react'
import { GambaUi, useCurrentToken } from 'gamba-react-ui-v2'

export interface DeepSeaDivePaytableRef {
  trackGame: (data: {
    choice: 'shallow' | 'deep' | 'abyss'
    resultIndex: number
    wasWin: boolean
    amount: number
    multiplier: number
  }) => void
}

interface DeepSeaDivePaytableProps {
  wager: number
  selectedChoice: 'shallow' | 'deep' | 'abyss'
}

interface GameHistory {
  choice: 'shallow' | 'deep' | 'abyss'
  resultIndex: number
  wasWin: boolean
  amount: number
  multiplier: number
  timestamp: number
}

const DEPTH_CHOICES = {
  shallow: [0, 0, 3, 7, 15],    
  deep: [0, 0, 0, 12, 20],      
  abyss: [0, 0, 0, 0, 30],      
}

const DeepSeaDivePaytable = React.forwardRef<DeepSeaDivePaytableRef, DeepSeaDivePaytableProps>(
  ({ wager, selectedChoice }, ref) => {
    const [gameHistory, setGameHistory] = React.useState<GameHistory[]>([])
    const [totalStats, setTotalStats] = React.useState({
      totalGames: 0,
      totalWins: 0,
      totalAmount: 0,
      bestMultiplier: 0,
      shallowDives: 0,
      deepDives: 0,
      abyssDives: 0,
      pearlsFound: 0,
      deepestSuccessfulDive: 0
    })

    const token = useCurrentToken()

    const formatCurrency = (amount: number) => {
      if (!token) return amount.toString()
      const value = amount / Math.pow(10, token.decimals)
      return value.toFixed(4) + ' ' + token.symbol
    }

    const trackGame = React.useCallback((data: {
      choice: 'shallow' | 'deep' | 'abyss'
      resultIndex: number
      wasWin: boolean
      amount: number
      multiplier: number
    }) => {
      const newGame: GameHistory = {
        ...data,
        timestamp: Date.now()
      }
      
      setGameHistory(prev => [newGame, ...prev.slice(0, 9)])
      
      setTotalStats(prev => ({
        totalGames: prev.totalGames + 1,
        totalWins: prev.totalWins + (data.wasWin ? 1 : 0),
        totalAmount: prev.totalAmount + data.amount,
        bestMultiplier: Math.max(prev.bestMultiplier, data.multiplier),
        shallowDives: prev.shallowDives + (data.choice === 'shallow' ? 1 : 0),
        deepDives: prev.deepDives + (data.choice === 'deep' ? 1 : 0),
        abyssDives: prev.abyssDives + (data.choice === 'abyss' ? 1 : 0),
        pearlsFound: prev.pearlsFound + (data.wasWin ? 1 : 0),
        deepestSuccessfulDive: data.wasWin ? Math.max(prev.deepestSuccessfulDive, data.resultIndex + 1) : prev.deepestSuccessfulDive
      }))
    }, [])

    React.useImperativeHandle(ref, () => ({
      trackGame
    }), [trackGame])

    const selectedBet = DEPTH_CHOICES[selectedChoice]
    const winChance = selectedBet.filter(x => x > 0).length / selectedBet.length
    const maxMultiplier = Math.max(...selectedBet)

    return (
      <div style={{
        width: '360px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        borderRadius: '20px',
        border: '2px solid rgba(14, 165, 233, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(3, 105, 161, 0.2) 100%)',
          padding: '20px',
          borderBottom: '1px solid rgba(56, 189, 248, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div style={{ fontSize: '24px' }}>🌊</div>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 700,
              background: 'linear-gradient(45deg, #0ea5e9, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              DEEP SEA DIVE
            </h3>
            <div style={{ fontSize: '24px' }}>🦪</div>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#9CA3AF'
          }}>
            <span>TREASURE HUNTER LOGS</span>
            <span>{selectedChoice.toUpperCase()} WATERS</span>
          </div>
        </div>

        {/* Current Dive Info */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{
            background: 'rgba(14, 165, 233, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ color: '#38bdf8', fontSize: '14px', fontWeight: 600 }}>
                {selectedChoice === 'shallow' && '🏊 SHALLOW DIVE'}
                {selectedChoice === 'deep' && '🤿 DEEP DIVE'}
                {selectedChoice === 'abyss' && '🌊 ABYSS DIVE'}
              </span>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>
                {(winChance * 100).toFixed(1)}% PEARL CHANCE
              </span>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '12px'
            }}>
              <div>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>MAX PEARL VALUE</div>
                <div style={{ color: '#38bdf8', fontWeight: 700 }}>{maxMultiplier}.00x</div>
              </div>
              <div>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>DEPTH LEVELS</div>
                <div style={{ color: '#38bdf8', fontWeight: 700 }}>{selectedBet.length}</div>
              </div>
            </div>
          </div>

          {/* Paytable */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            overflow: 'hidden',
            marginBottom: '16px'
          }}>
            <div style={{
              background: 'rgba(14, 165, 233, 0.2)',
              padding: '12px 16px',
              borderBottom: '1px solid rgba(56, 189, 248, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                fontWeight: 600,
                color: '#38bdf8'
              }}>
                <span>DEPTH LEVEL</span>
                <span>PEARL PAYOUT</span>
              </div>
            </div>
            
            {selectedBet.map((multiplier, index) => {
              const payout = wager * multiplier
              const depth = index + 1
              const depthMeters = depth * (selectedChoice === 'shallow' ? 100 : selectedChoice === 'deep' ? 200 : 500)
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: index < selectedBet.length - 1 ? '1px solid rgba(56, 189, 248, 0.1)' : 'none',
                    background: multiplier > 0 ? 'rgba(14, 165, 233, 0.05)' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '16px' }}>
                      {multiplier > 0 ? '🦪' : '🌊'}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>
                        Depth {depth}
                      </div>
                      <div style={{ color: '#9CA3AF', fontSize: '10px' }}>
                        {depthMeters}m
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    {multiplier > 0 ? (
                      <>
                        <div style={{ 
                          color: '#38bdf8', 
                          fontSize: '12px', 
                          fontWeight: 700 
                        }}>
                          {multiplier}.00x
                        </div>
                        <div style={{ 
                          color: '#9CA3AF', 
                          fontSize: '10px'
                        }}>
                          {formatCurrency(payout)}
                        </div>
                      </>
                    ) : (
                      <div style={{ 
                        color: '#6B7280', 
                        fontSize: '11px',
                        fontStyle: 'italic'
                      }}>
                        Empty depths
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Statistics */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              color: '#38bdf8',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              🗂️ EXPEDITION RECORDS
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '11px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>TOTAL DIVES</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>
                  {totalStats.totalGames}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>PEARLS FOUND</div>
                <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '14px' }}>
                  {totalStats.pearlsFound}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>SUCCESS RATE</div>
                <div style={{ color: '#22c55e', fontWeight: 700, fontSize: '14px' }}>
                  {totalStats.totalGames > 0 ? ((totalStats.totalWins / totalStats.totalGames) * 100).toFixed(1) : '0.0'}%
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>BEST PEARL</div>
                <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>
                  {totalStats.bestMultiplier.toFixed(1)}x
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>DEEPEST SUCCESS</div>
                <div style={{ color: '#a855f7', fontWeight: 700, fontSize: '14px' }}>
                  Level {totalStats.deepestSuccessfulDive}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>NET TREASURE</div>
                <div style={{ 
                  color: totalStats.totalAmount >= 0 ? '#22c55e' : '#ef4444', 
                  fontWeight: 700, 
                  fontSize: '12px' 
                }}>
                  {formatCurrency(totalStats.totalAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Dive Type Distribution */}
          {totalStats.totalGames > 0 && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '12px',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                color: '#38bdf8',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                ⚓ DIVE DISTRIBUTION
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '11px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>🏊</div>
                  <div style={{ color: '#9CA3AF', marginBottom: '2px' }}>SHALLOW</div>
                  <div style={{ color: '#38bdf8', fontWeight: 700 }}>
                    {totalStats.shallowDives}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>🤿</div>
                  <div style={{ color: '#9CA3AF', marginBottom: '2px' }}>DEEP</div>
                  <div style={{ color: '#0ea5e9', fontWeight: 700 }}>
                    {totalStats.deepDives}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>🌊</div>
                  <div style={{ color: '#9CA3AF', marginBottom: '2px' }}>ABYSS</div>
                  <div style={{ color: '#1e40af', fontWeight: 700 }}>
                    {totalStats.abyssDives}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Dive History */}
          {gameHistory.length > 0 && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '12px',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'rgba(14, 165, 233, 0.2)',
                padding: '12px 16px',
                borderBottom: '1px solid rgba(56, 189, 248, 0.2)'
              }}>
                <div style={{
                  color: '#38bdf8',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center'
                }}>
                  📋 RECENT EXPEDITIONS
                </div>
              </div>
              
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {gameHistory.slice(0, 8).map((game, index) => (
                  <div
                    key={game.timestamp}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 16px',
                      borderBottom: index < Math.min(gameHistory.length, 8) - 1 ? '1px solid rgba(56, 189, 248, 0.1)' : 'none',
                      background: game.wasWin ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ fontSize: '14px' }}>
                        {game.choice === 'shallow' && '🏊'}
                        {game.choice === 'deep' && '🤿'}
                        {game.choice === 'abyss' && '🌊'}
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}>
                          {game.choice.charAt(0).toUpperCase() + game.choice.slice(1)} Dive
                        </div>
                        <div style={{ color: '#9CA3AF', fontSize: '9px' }}>
                          Depth {game.resultIndex + 1}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        color: game.wasWin ? '#22c55e' : '#ef4444',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        {game.wasWin ? `+${game.multiplier.toFixed(1)}x` : 'Lost'}
                      </div>
                      <div style={{ fontSize: '9px' }}>
                        <div style={{ 
                          color: '#9CA3AF', 
                          fontSize: '8px' 
                        }}>
                          {formatCurrency(game.amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
)

DeepSeaDivePaytable.displayName = 'DeepSeaDivePaytable'

export default DeepSeaDivePaytable
