import React from 'react'
import { useCurrentToken } from 'gamba-react-ui-v2'

export interface TimeTravelHeistPaytableRef {
  trackGame: (data: {
    period: 'medieval' | 'modern' | 'future'
    resultIndex: number
    wasWin: boolean
    amount: number
    multiplier: number
  }) => void
}

interface TimeTravelHeistPaytableProps {
  wager: number
  selectedPeriod: 'medieval' | 'modern' | 'future'
}

interface GameHistory {
  period: 'medieval' | 'modern' | 'future'
  resultIndex: number
  wasWin: boolean
  amount: number
  multiplier: number
  timestamp: number
}

const TIME_PERIODS = {
  medieval: [0, 1, 4, 8, 20],      
  modern: [0, 0, 6, 15, 30],       
  future: [0, 0, 0, 12, 45],       
}

const TimeTravelHeistPaytable = React.forwardRef<TimeTravelHeistPaytableRef, TimeTravelHeistPaytableProps>(
  ({ wager, selectedPeriod }, ref) => {
    const [gameHistory, setGameHistory] = React.useState<GameHistory[]>([])
    const [totalStats, setTotalStats] = React.useState({
      totalHeists: 0,
      totalTreasures: 0,
      totalAmount: 0,
      bestMultiplier: 0,
      medievalHeists: 0,
      modernHeists: 0,
      futureHeists: 0,
      legendaryTreasures: 0,
      deepestInfiltration: 0
    })

    const token = useCurrentToken()

    const formatCurrency = (amount: number) => {
      if (!token) return amount.toString()
      const value = amount / Math.pow(10, token.decimals)
      return value.toFixed(4) + ' ' + token.symbol
    }

    const trackGame = React.useCallback((data: {
      period: 'medieval' | 'modern' | 'future'
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
        totalHeists: prev.totalHeists + 1,
        totalTreasures: prev.totalTreasures + (data.wasWin ? 1 : 0),
        totalAmount: prev.totalAmount + data.amount,
        bestMultiplier: Math.max(prev.bestMultiplier, data.multiplier),
        medievalHeists: prev.medievalHeists + (data.period === 'medieval' ? 1 : 0),
        modernHeists: prev.modernHeists + (data.period === 'modern' ? 1 : 0),
        futureHeists: prev.futureHeists + (data.period === 'future' ? 1 : 0),
        legendaryTreasures: prev.legendaryTreasures + (data.wasWin && data.multiplier >= 30 ? 1 : 0),
        deepestInfiltration: data.wasWin ? Math.max(prev.deepestInfiltration, data.resultIndex + 1) : prev.deepestInfiltration
      }))
    }, [])

    React.useImperativeHandle(ref, () => ({
      trackGame
    }), [trackGame])

    const selectedBet = TIME_PERIODS[selectedPeriod]
    const winChance = selectedBet.filter(x => x > 0).length / selectedBet.length
    const maxMultiplier = Math.max(...selectedBet)

    return (
      <div style={{
        width: '360px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        borderRadius: '20px',
        border: '2px solid rgba(100, 116, 139, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(100, 116, 139, 0.2) 0%, rgba(71, 85, 105, 0.2) 100%)',
          padding: '20px',
          borderBottom: '1px solid rgba(100, 116, 139, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div style={{ fontSize: '24px' }}>⏰</div>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 700,
              background: 'linear-gradient(45deg, #64748b, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              TIME TRAVEL HEIST
            </h3>
            <div style={{ fontSize: '24px' }}>💎</div>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#9CA3AF'
          }}>
            <span>TEMPORAL HEIST LOGS</span>
            <span>{selectedPeriod.toUpperCase()} ERA</span>
          </div>
        </div>

        {/* Current Era Info */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{
            background: 'rgba(100, 116, 139, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(100, 116, 139, 0.2)',
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>
                {selectedPeriod === 'medieval' && '🏰 MEDIEVAL ERA'}
                {selectedPeriod === 'modern' && '🏙️ MODERN ERA'}
                {selectedPeriod === 'future' && '🚀 FUTURE ERA'}
              </span>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>
                {(winChance * 100).toFixed(1)}% SUCCESS RATE
              </span>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '12px'
            }}>
              <div>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>MAX TREASURE VALUE</div>
                <div style={{ color: '#94a3b8', fontWeight: 700 }}>{maxMultiplier}.00x</div>
              </div>
              <div>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>LOCATIONS</div>
                <div style={{ color: '#94a3b8', fontWeight: 700 }}>{selectedBet.length}</div>
              </div>
            </div>
          </div>

          {/* Paytable */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            border: '1px solid rgba(100, 116, 139, 0.2)',
            overflow: 'hidden',
            marginBottom: '16px'
          }}>
            <div style={{
              background: 'rgba(100, 116, 139, 0.2)',
              padding: '12px 16px',
              borderBottom: '1px solid rgba(100, 116, 139, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                fontWeight: 600,
                color: '#94a3b8'
              }}>
                <span>LOCATION</span>
                <span>TREASURE PAYOUT</span>
              </div>
            </div>
            
            {selectedBet.map((multiplier, index) => {
              const payout = wager * multiplier
              const location = index + 1
              const locationName = selectedPeriod === 'medieval' ? 
                ['Village', 'Castle', 'Vault', 'Tower', 'Throne'][index] :
                selectedPeriod === 'modern' ?
                ['Bank', 'Museum', 'Vault', 'Tower', 'Penthouse'][index] :
                ['Station', 'Lab', 'Vault', 'Core', 'Nexus'][index]
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: index < selectedBet.length - 1 ? '1px solid rgba(100, 116, 139, 0.1)' : 'none',
                    background: multiplier > 0 ? 'rgba(100, 116, 139, 0.05)' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '16px' }}>
                      {multiplier > 0 ? (multiplier >= 30 ? '💎' : '💰') : '⏰'}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>
                        {locationName}
                      </div>
                      <div style={{ color: '#9CA3AF', fontSize: '10px' }}>
                        Location {location}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    {multiplier > 0 ? (
                      <>
                        <div style={{ 
                          color: multiplier >= 30 ? '#fbbf24' : '#94a3b8', 
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
                        Empty timeline
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
            border: '1px solid rgba(100, 116, 139, 0.2)',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              color: '#94a3b8',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              🗂️ HEIST RECORDS
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '11px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>TOTAL HEISTS</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>
                  {totalStats.totalHeists}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>TREASURES STOLEN</div>
                <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: '14px' }}>
                  {totalStats.totalTreasures}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>SUCCESS RATE</div>
                <div style={{ color: '#22c55e', fontWeight: 700, fontSize: '14px' }}>
                  {totalStats.totalHeists > 0 ? ((totalStats.totalTreasures / totalStats.totalHeists) * 100).toFixed(1) : '0.0'}%
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>BEST TREASURE</div>
                <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '14px' }}>
                  {totalStats.bestMultiplier.toFixed(1)}x
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>LEGENDARY FINDS</div>
                <div style={{ color: '#c084fc', fontWeight: 700, fontSize: '14px' }}>
                  {totalStats.legendaryTreasures}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>NET LOOT</div>
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

          {/* Era Distribution */}
          {totalStats.totalHeists > 0 && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '12px',
              border: '1px solid rgba(100, 116, 139, 0.2)',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                🕰️ ERA DISTRIBUTION
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '11px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>🏰</div>
                  <div style={{ color: '#9CA3AF', marginBottom: '2px' }}>MEDIEVAL</div>
                  <div style={{ color: '#d97706', fontWeight: 700 }}>
                    {totalStats.medievalHeists}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>🏙️</div>
                  <div style={{ color: '#9CA3AF', marginBottom: '2px' }}>MODERN</div>
                  <div style={{ color: '#3b82f6', fontWeight: 700 }}>
                    {totalStats.modernHeists}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>🚀</div>
                  <div style={{ color: '#9CA3AF', marginBottom: '2px' }}>FUTURE</div>
                  <div style={{ color: '#a855f7', fontWeight: 700 }}>
                    {totalStats.futureHeists}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Heist History */}
          {gameHistory.length > 0 && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '12px',
              border: '1px solid rgba(100, 116, 139, 0.2)',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'rgba(100, 116, 139, 0.2)',
                padding: '12px 16px',
                borderBottom: '1px solid rgba(100, 116, 139, 0.2)'
              }}>
                <div style={{
                  color: '#94a3b8',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center'
                }}>
                  📋 RECENT HEISTS
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
                      borderBottom: index < Math.min(gameHistory.length, 8) - 1 ? '1px solid rgba(100, 116, 139, 0.1)' : 'none',
                      background: game.wasWin ? 'rgba(100, 116, 139, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ fontSize: '14px' }}>
                        {game.period === 'medieval' && '🏰'}
                        {game.period === 'modern' && '🏙️'}
                        {game.period === 'future' && '🚀'}
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}>
                          {game.period.charAt(0).toUpperCase() + game.period.slice(1)} Era
                        </div>
                        <div style={{ color: '#9CA3AF', fontSize: '9px' }}>
                          Location {game.resultIndex + 1}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        color: game.wasWin ? '#94a3b8' : '#ef4444',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        {game.wasWin ? `+${game.multiplier.toFixed(1)}x` : 'Captured'}
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

TimeTravelHeistPaytable.displayName = 'TimeTravelHeistPaytable'

export default TimeTravelHeistPaytable
