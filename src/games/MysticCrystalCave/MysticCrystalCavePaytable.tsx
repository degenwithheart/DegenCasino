import React from 'react'
import { useCurrentToken } from 'gamba-react-ui-v2'

export interface MysticCrystalCavePaytableRef {
  trackGame: (data: {
    path: 'crystal' | 'shadow' | 'light'
    resultIndex: number
    wasWin: boolean
    amount: number
    multiplier: number
  }) => void
}

interface MysticCrystalCavePaytableProps {
  wager: number
  selectedPath: 'crystal' | 'shadow' | 'light'
}

interface GameHistory {
  path: 'crystal' | 'shadow' | 'light'
  resultIndex: number
  wasWin: boolean
  amount: number
  multiplier: number
  timestamp: number
}

const CAVE_PATHS = {
  crystal: [0, 2, 5, 10, 25],      
  shadow: [0, 0, 8, 18, 35],       
  light: [0, 0, 0, 15, 50],        
}

const MysticCrystalCavePaytable = React.forwardRef<MysticCrystalCavePaytableRef, MysticCrystalCavePaytableProps>(
  ({ wager, selectedPath }, ref) => {
    const [gameHistory, setGameHistory] = React.useState<GameHistory[]>([])
    const [totalStats, setTotalStats] = React.useState({
      totalExplorations: 0,
      totalCrystalsFound: 0,
      totalAmount: 0,
      bestMultiplier: 0,
      crystalPaths: 0,
      shadowPaths: 0,
      lightPaths: 0,
      legendaryFinds: 0,
      deepestSuccess: 0
    })

    const token = useCurrentToken()

    const formatCurrency = (amount: number) => {
      if (!token) return amount.toString()
      const value = amount / Math.pow(10, token.decimals)
      return value.toFixed(4) + ' ' + token.symbol
    }

    const trackGame = React.useCallback((data: {
      path: 'crystal' | 'shadow' | 'light'
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
        totalExplorations: prev.totalExplorations + 1,
        totalCrystalsFound: prev.totalCrystalsFound + (data.wasWin ? 1 : 0),
        totalAmount: prev.totalAmount + data.amount,
        bestMultiplier: Math.max(prev.bestMultiplier, data.multiplier),
        crystalPaths: prev.crystalPaths + (data.path === 'crystal' ? 1 : 0),
        shadowPaths: prev.shadowPaths + (data.path === 'shadow' ? 1 : 0),
        lightPaths: prev.lightPaths + (data.path === 'light' ? 1 : 0),
        legendaryFinds: prev.legendaryFinds + (data.wasWin && data.multiplier >= 25 ? 1 : 0),
        deepestSuccess: data.wasWin ? Math.max(prev.deepestSuccess, data.resultIndex + 1) : prev.deepestSuccess
      }))
    }, [])

    React.useImperativeHandle(ref, () => ({
      trackGame
    }), [trackGame])

    const selectedBet = CAVE_PATHS[selectedPath]
    const winChance = selectedBet.filter(x => x > 0).length / selectedBet.length
    const maxMultiplier = Math.max(...selectedBet)

    return (
      <div style={{
        width: '360px',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(76, 29, 149, 0.95) 100%)',
        borderRadius: '20px',
        border: '2px solid rgba(147, 51, 234, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
          padding: '20px',
          borderBottom: '1px solid rgba(168, 85, 247, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div style={{ fontSize: '24px' }}>🔮</div>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 700,
              background: 'linear-gradient(45deg, #9333ea, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              MYSTIC CRYSTAL CAVE
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
            <span>CRYSTAL SEEKER LOGS</span>
            <span>{selectedPath.toUpperCase()} PATH</span>
          </div>
        </div>

        {/* Current Path Info */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{
            background: 'rgba(147, 51, 234, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ color: '#a855f7', fontSize: '14px', fontWeight: 600 }}>
                {selectedPath === 'crystal' && '💎 CRYSTAL PATH'}
                {selectedPath === 'shadow' && '🌑 SHADOW PATH'}
                {selectedPath === 'light' && '✨ LIGHT PATH'}
              </span>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>
                {(winChance * 100).toFixed(1)}% CRYSTAL CHANCE
              </span>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '12px'
            }}>
              <div>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>MAX CRYSTAL POWER</div>
                <div style={{ color: '#a855f7', fontWeight: 700 }}>{maxMultiplier}.00x</div>
              </div>
              <div>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>CHAMBERS</div>
                <div style={{ color: '#a855f7', fontWeight: 700 }}>{selectedBet.length}</div>
              </div>
            </div>
          </div>

          {/* Paytable */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            overflow: 'hidden',
            marginBottom: '16px'
          }}>
            <div style={{
              background: 'rgba(147, 51, 234, 0.2)',
              padding: '12px 16px',
              borderBottom: '1px solid rgba(168, 85, 247, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                fontWeight: 600,
                color: '#a855f7'
              }}>
                <span>CHAMBER</span>
                <span>CRYSTAL PAYOUT</span>
              </div>
            </div>
            
            {selectedBet.map((multiplier, index) => {
              const payout = wager * multiplier
              const chamber = index + 1
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: index < selectedBet.length - 1 ? '1px solid rgba(168, 85, 247, 0.1)' : 'none',
                    background: multiplier > 0 ? 'rgba(147, 51, 234, 0.05)' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '16px' }}>
                      {multiplier > 0 ? (multiplier >= 25 ? '💎' : '🔮') : '✨'}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>
                        Chamber {chamber}
                      </div>
                      <div style={{ color: '#9CA3AF', fontSize: '10px' }}>
                        {selectedPath === 'crystal' ? 'Balanced' : selectedPath === 'shadow' ? 'Dark' : 'Pure'} Magic
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    {multiplier > 0 ? (
                      <>
                        <div style={{ 
                          color: multiplier >= 25 ? '#c084fc' : '#a855f7', 
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
                        Empty chamber
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
            border: '1px solid rgba(168, 85, 247, 0.2)',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              color: '#a855f7',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              🗂️ EXPLORATION RECORDS
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '11px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>EXPEDITIONS</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>
                  {totalStats.totalExplorations}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>CRYSTALS FOUND</div>
                <div style={{ color: '#a855f7', fontWeight: 700, fontSize: '14px' }}>
                  {totalStats.totalCrystalsFound}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>SUCCESS RATE</div>
                <div style={{ color: '#22c55e', fontWeight: 700, fontSize: '14px' }}>
                  {totalStats.totalExplorations > 0 ? ((totalStats.totalCrystalsFound / totalStats.totalExplorations) * 100).toFixed(1) : '0.0'}%
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>BEST CRYSTAL</div>
                <div style={{ color: '#c084fc', fontWeight: 700, fontSize: '14px' }}>
                  {totalStats.bestMultiplier.toFixed(1)}x
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>LEGENDARY FINDS</div>
                <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>
                  {totalStats.legendaryFinds}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', marginBottom: '4px' }}>NET MAGIC</div>
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

          {/* Path Distribution */}
          {totalStats.totalExplorations > 0 && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '12px',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                color: '#a855f7',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                🗺️ PATH DISTRIBUTION
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '11px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>💎</div>
                  <div style={{ color: '#9CA3AF', marginBottom: '2px' }}>CRYSTAL</div>
                  <div style={{ color: '#a855f7', fontWeight: 700 }}>
                    {totalStats.crystalPaths}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>🌑</div>
                  <div style={{ color: '#9CA3AF', marginBottom: '2px' }}>SHADOW</div>
                  <div style={{ color: '#6b7280', fontWeight: 700 }}>
                    {totalStats.shadowPaths}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>✨</div>
                  <div style={{ color: '#9CA3AF', marginBottom: '2px' }}>LIGHT</div>
                  <div style={{ color: '#f8fafc', fontWeight: 700 }}>
                    {totalStats.lightPaths}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Exploration History */}
          {gameHistory.length > 0 && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '12px',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'rgba(147, 51, 234, 0.2)',
                padding: '12px 16px',
                borderBottom: '1px solid rgba(168, 85, 247, 0.2)'
              }}>
                <div style={{
                  color: '#a855f7',
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
                      borderBottom: index < Math.min(gameHistory.length, 8) - 1 ? '1px solid rgba(168, 85, 247, 0.1)' : 'none',
                      background: game.wasWin ? 'rgba(168, 85, 247, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ fontSize: '14px' }}>
                        {game.path === 'crystal' && '💎'}
                        {game.path === 'shadow' && '🌑'}
                        {game.path === 'light' && '✨'}
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}>
                          {game.path.charAt(0).toUpperCase() + game.path.slice(1)} Path
                        </div>
                        <div style={{ color: '#9CA3AF', fontSize: '9px' }}>
                          Chamber {game.resultIndex + 1}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        color: game.wasWin ? '#a855f7' : '#ef4444',
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

MysticCrystalCavePaytable.displayName = 'MysticCrystalCavePaytable'

export default MysticCrystalCavePaytable
