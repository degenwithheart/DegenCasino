import { GambaUi, useCurrentToken } from 'gamba-react-ui-v2'
import React from 'react'

interface GameResult {
  dragon: 'fire' | 'ice' | 'shadow'
  resultIndex: number
  wasWin: boolean
  amount: number
  multiplier: number
}

export interface DragonVaultPaytableRef {
  trackGame: (result: GameResult) => void
}

interface DragonVaultPaytableProps {
  wager: number
  selectedDragon: 'fire' | 'ice' | 'shadow'
}

const DragonVaultPaytable = React.forwardRef<DragonVaultPaytableRef, DragonVaultPaytableProps>(
  ({ wager, selectedDragon }, ref) => {
    const [gameHistory, setGameHistory] = React.useState<GameResult[]>([])
    const [currentStreak, setCurrentStreak] = React.useState(0)
    const [bestStreak, setBestStreak] = React.useState(0)
    const token = useCurrentToken()

    React.useImperativeHandle(ref, () => ({
      trackGame: (result: GameResult) => {
        setGameHistory(prev => [result, ...prev.slice(0, 9)])
        
        if (result.wasWin) {
          const newStreak = currentStreak + 1
          setCurrentStreak(newStreak)
          setBestStreak(prev => Math.max(prev, newStreak))
        } else {
          setCurrentStreak(0)
        }
      }
    }))

    const formatWager = (amount: number) => {
      return (amount / (10 ** (token?.decimals || 9))).toLocaleString('en-US', {
        maximumFractionDigits: 9,
      })
    }

    const getDragonData = (dragon: 'fire' | 'ice' | 'shadow') => {
      const betArrays = {
        fire: [0, 2, 5, 10, 22],
        ice: [0, 0, 6, 14, 30],
        shadow: [0, 0, 0, 18, 45]
      }
      
      const colors = {
        fire: { primary: '#fca5a5', secondary: '#dc2626', tertiary: '#b91c1c' },
        ice: { primary: '#7dd3fc', secondary: '#0ea5e9', tertiary: '#0284c7' },
        shadow: { primary: '#fcd34d', secondary: '#ca8a04', tertiary: '#a16207' }
      }
      
      const names = {
        fire: 'Fire Dragon\'s Lair',
        ice: 'Ice Dragon\'s Domain', 
        shadow: 'Shadow Dragon\'s Realm'
      }
      
      return { betArray: betArrays[dragon], colors: colors[dragon], name: names[dragon] }
    }

    const { betArray, colors, name } = getDragonData(selectedDragon)
    
    const dragonStats = React.useMemo(() => {
      const stats = { fire: 0, ice: 0, shadow: 0 }
      gameHistory.forEach(game => {
        if (game.wasWin) stats[game.dragon]++
      })
      return stats
    }, [gameHistory])
    
    const totalWins = Object.values(dragonStats).reduce((a, b) => a + b, 0)

    return (
      <div style={{ 
        color: '#fff',
        fontFamily: 'monospace'
      }}>
        <GambaUi.Portal target="sidebar">
          <GambaUi.Responsive>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              padding: '20px'
            }}>
              {/* Header */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '8px'
                }}>
                  🐉 DRAGON'S VAULT 💎
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: colors.primary,
                  marginBottom: '16px'
                }}>
                  {name}
                </div>
              </div>

              {/* Current Dragon Stats */}
              <div style={{
                background: `linear-gradient(135deg, ${colors.secondary}20, ${colors.tertiary}10)`,
                border: `1px solid ${colors.primary}40`,
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  color: colors.primary,
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  VAULT DEPTHS
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {betArray.map((multiplier, index) => {
                    const chance = multiplier > 0 ? ((1 / betArray.length) * 100).toFixed(1) : '0.0'
                    const depthNames = selectedDragon === 'fire' 
                      ? ['Ember Layer', 'Flame Chamber', 'Inferno Core', 'Dragon Core', 'Heart of Fire']
                      : selectedDragon === 'ice'
                      ? ['Frost Layer', 'Freeze Chamber', 'Glacier Core', 'Dragon Core', 'Heart of Ice']
                      : ['Dusk Layer', 'Void Chamber', 'Abyss Core', 'Dragon Core', 'Heart of Shadow']
                    
                    return (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: multiplier > 0 
                            ? `linear-gradient(90deg, ${colors.secondary}30, ${colors.primary}20)` 
                            : 'rgba(107, 114, 128, 0.2)',
                          border: `1px solid ${multiplier > 0 ? colors.primary + '60' : 'rgba(107, 114, 128, 0.3)'}`,
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px' }}>
                            {selectedDragon === 'fire' ? 
                              (index === 0 ? '🔥' : index === 1 ? '🌋' : index === 2 ? '💥' : index === 3 ? '🔮' : '💎') :
                            selectedDragon === 'ice' ?
                              (index === 0 ? '❄️' : index === 1 ? '🧊' : index === 2 ? '🌨️' : index === 3 ? '🔮' : '💎') :
                              (index === 0 ? '🌑' : index === 1 ? '🌚' : index === 2 ? '⚫' : index === 3 ? '🔮' : '👑')
                            }
                          </span>
                          <span style={{ color: '#E5E7EB' }}>{depthNames[index]}</span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          color: multiplier > 0 ? colors.primary : '#9CA3AF'
                        }}>
                          <span>{chance}%</span>
                          {multiplier > 0 && (
                            <>
                              <span>•</span>
                              <span style={{ fontWeight: 'bold' }}>
                                {formatWager(wager * multiplier)} {token?.symbol}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Dragon Comparison */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.4), rgba(31, 41, 55, 0.4))',
                border: '1px solid rgba(107, 114, 128, 0.3)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  color: '#E5E7EB',
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  DRAGON COMPARISON
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(['fire', 'ice', 'shadow'] as const).map((dragon) => {
                    const dragonData = getDragonData(dragon)
                    const maxMultiplier = Math.max(...dragonData.betArray)
                    const winDepths = dragonData.betArray.filter(x => x > 0).length
                    const isSelected = dragon === selectedDragon
                    
                    return (
                      <div
                        key={dragon}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: isSelected 
                            ? `linear-gradient(90deg, ${dragonData.colors.secondary}40, ${dragonData.colors.primary}20)` 
                            : 'rgba(55, 65, 81, 0.4)',
                          border: `1px solid ${isSelected ? dragonData.colors.primary + '60' : 'rgba(107, 114, 128, 0.3)'}`,
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>
                            {dragon === 'fire' ? '🔥' : dragon === 'ice' ? '❄️' : '🌑'}
                          </span>
                          <span style={{ color: isSelected ? dragonData.colors.primary : '#E5E7EB' }}>
                            {dragon.charAt(0).toUpperCase() + dragon.slice(1)}
                          </span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          color: isSelected ? dragonData.colors.primary : '#9CA3AF'
                        }}>
                          <span>{Math.round((winDepths / dragonData.betArray.length) * 100)}%</span>
                          <span>•</span>
                          <span style={{ fontWeight: 'bold' }}>{maxMultiplier}x</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Treasure Vault Statistics */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.4), rgba(31, 41, 55, 0.4))',
                border: '1px solid rgba(107, 114, 128, 0.3)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  color: '#E5E7EB',
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  TREASURE VAULT RECORDS
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <span style={{ color: '#9CA3AF' }}>Total Expeditions:</span>
                    <span style={{ color: '#E5E7EB', fontWeight: 'bold' }}>{gameHistory.length}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <span style={{ color: '#9CA3AF' }}>Treasures Claimed:</span>
                    <span style={{ color: '#10B981', fontWeight: 'bold' }}>{totalWins}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <span style={{ color: '#9CA3AF' }}>Success Rate:</span>
                    <span style={{ 
                      color: gameHistory.length > 0 ? (totalWins / gameHistory.length >= 0.5 ? '#10B981' : '#F59E0B') : '#9CA3AF',
                      fontWeight: 'bold'
                    }}>
                      {gameHistory.length > 0 ? Math.round((totalWins / gameHistory.length) * 100) : 0}%
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <span style={{ color: '#9CA3AF' }}>Current Streak:</span>
                    <span style={{ color: currentStreak > 0 ? '#10B981' : '#9CA3AF', fontWeight: 'bold' }}>
                      {currentStreak}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <span style={{ color: '#9CA3AF' }}>Best Streak:</span>
                    <span style={{ color: bestStreak > 0 ? '#10B981' : '#9CA3AF', fontWeight: 'bold' }}>
                      {bestStreak}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dragon Encounter Distribution */}
              {gameHistory.length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.4), rgba(31, 41, 55, 0.4))',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 'bold', 
                    color: '#E5E7EB',
                    marginBottom: '12px',
                    textAlign: 'center'
                  }}>
                    DRAGON SUCCESS RATE
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(['fire', 'ice', 'shadow'] as const).map((dragon) => {
                      const dragonData = getDragonData(dragon)
                      const wins = dragonStats[dragon]
                      const total = gameHistory.filter(g => g.dragon === dragon).length
                      const rate = total > 0 ? Math.round((wins / total) * 100) : 0
                      
                      return total > 0 ? (
                        <div
                          key={dragon}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px' }}>
                              {dragon === 'fire' ? '🔥' : dragon === 'ice' ? '❄️' : '🌑'}
                            </span>
                            <span style={{ color: '#E5E7EB' }}>
                              {dragon.charAt(0).toUpperCase() + dragon.slice(1)}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            color: dragonData.colors.primary
                          }}>
                            <span>{wins}/{total}</span>
                            <span>•</span>
                            <span style={{ fontWeight: 'bold' }}>{rate}%</span>
                          </div>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              {/* Recent Expeditions */}
              {gameHistory.length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.4), rgba(31, 41, 55, 0.4))',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 'bold', 
                    color: '#E5E7EB',
                    marginBottom: '12px',
                    textAlign: 'center'
                  }}>
                    RECENT EXPEDITIONS
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {gameHistory.slice(0, 5).map((game, index) => {
                      const dragonData = getDragonData(game.dragon)
                      return (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '6px 10px',
                            background: game.wasWin 
                              ? `linear-gradient(90deg, ${dragonData.colors.secondary}30, ${dragonData.colors.primary}20)` 
                              : 'rgba(239, 68, 68, 0.2)',
                            border: `1px solid ${game.wasWin ? dragonData.colors.primary + '40' : 'rgba(239, 68, 68, 0.3)'}`,
                            borderRadius: '6px',
                            fontSize: '11px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12px' }}>
                              {game.dragon === 'fire' ? '🔥' : game.dragon === 'ice' ? '❄️' : '🌑'}
                            </span>
                            <span style={{ color: game.wasWin ? dragonData.colors.primary : '#F87171' }}>
                              Depth {game.resultIndex + 1}
                            </span>
                          </div>
                          <div style={{ 
                            color: game.wasWin ? '#10B981' : '#F87171',
                            fontWeight: 'bold'
                          }}>
                            {game.wasWin ? `+${formatWager(game.amount)}` : 'LOST'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </GambaUi.Responsive>
        </GambaUi.Portal>
      </div>
    )
  }
)

DragonVaultPaytable.displayName = 'DragonVaultPaytable'

export default DragonVaultPaytable
