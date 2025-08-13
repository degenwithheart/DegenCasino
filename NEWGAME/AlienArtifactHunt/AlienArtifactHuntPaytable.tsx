import { GambaUi, useCurrentToken } from 'gamba-react-ui-v2'
import React from 'react'

interface GameResult {
  planet: 'earth' | 'gas' | 'crystal'
  resultIndex: number
  wasWin: boolean
  amount: number
  multiplier: number
}

export interface AlienArtifactHuntPaytableRef {
  trackGame: (result: GameResult) => void
}

interface AlienArtifactHuntPaytableProps {
  wager: number
  selectedPlanet: 'earth' | 'gas' | 'crystal'
}

const AlienArtifactHuntPaytable = React.forwardRef<AlienArtifactHuntPaytableRef, AlienArtifactHuntPaytableProps>(
  ({ wager, selectedPlanet }, ref) => {
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

    const getPlanetData = (planet: 'earth' | 'gas' | 'crystal') => {
      const betArrays = {
        earth: [0, 2, 4, 8, 18],
        gas: [0, 0, 6, 12, 28], 
        crystal: [0, 0, 0, 15, 40]
      }
      
      const colors = {
        earth: { primary: '#60a5fa', secondary: '#1e40af', tertiary: '#1e3a8a' },
        gas: { primary: '#fbbf24', secondary: '#d97706', tertiary: '#b45309' },
        crystal: { primary: '#34d399', secondary: '#059669', tertiary: '#047857' }
      }
      
      const names = {
        earth: 'Earth-Like Worlds',
        gas: 'Gas Giant Systems', 
        crystal: 'Crystal Formations'
      }
      
      return { betArray: betArrays[planet], colors: colors[planet], name: names[planet] }
    }

    const { betArray, colors, name } = getPlanetData(selectedPlanet)
    
    const planetStats = React.useMemo(() => {
      const stats = { earth: 0, gas: 0, crystal: 0 }
      gameHistory.forEach(game => {
        if (game.wasWin) stats[game.planet]++
      })
      return stats
    }, [gameHistory])
    
    const totalWins = Object.values(planetStats).reduce((a, b) => a + b, 0)

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
                  🛸 ALIEN ARTIFACT HUNT 👽
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: colors.primary,
                  marginBottom: '16px'
                }}>
                  {name}
                </div>
              </div>

              {/* Current Planet Stats */}
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
                  EXCAVATION SITES
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {betArray.map((multiplier, index) => {
                    const chance = multiplier > 0 ? ((1 / betArray.length) * 100).toFixed(1) : '0.0'
                    const siteNames = selectedPlanet === 'earth' 
                      ? ['Surface Ruins', 'Ancient Caverns', 'Lost Temple', 'Planetary Core', 'Nexus Chamber']
                      : selectedPlanet === 'gas'
                      ? ['Cloud Cities', 'Storm Barriers', 'Eye Vortex', 'Core Stations', 'Central Hub']
                      : ['Crystal Surface', 'Gem Clusters', 'Matrix Layers', 'Core Crystals', 'Heart Chamber']
                    
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
                            {selectedPlanet === 'earth' ? 
                              (index === 0 ? '🏛️' : index === 1 ? '🕳️' : index === 2 ? '⛩️' : index === 3 ? '🌋' : '🔮') :
                            selectedPlanet === 'gas' ?
                              (index === 0 ? '☁️' : index === 1 ? '⛈️' : index === 2 ? '🌪️' : index === 3 ? '👁️' : '⭕') :
                              (index === 0 ? '💎' : index === 1 ? '💠' : index === 2 ? '🔷' : index === 3 ? '🔹' : '💙')
                            }
                          </span>
                          <span style={{ color: '#E5E7EB' }}>{siteNames[index]}</span>
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

              {/* Planet Comparison */}
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
                  PLANET COMPARISON
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(['earth', 'gas', 'crystal'] as const).map((planet) => {
                    const planetData = getPlanetData(planet)
                    const maxMultiplier = Math.max(...planetData.betArray)
                    const winSites = planetData.betArray.filter(x => x > 0).length
                    const isSelected = planet === selectedPlanet
                    
                    return (
                      <div
                        key={planet}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: isSelected 
                            ? `linear-gradient(90deg, ${planetData.colors.secondary}40, ${planetData.colors.primary}20)` 
                            : 'rgba(55, 65, 81, 0.4)',
                          border: `1px solid ${isSelected ? planetData.colors.primary + '60' : 'rgba(107, 114, 128, 0.3)'}`,
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>
                            {planet === 'earth' ? '🌍' : planet === 'gas' ? '🪐' : '💎'}
                          </span>
                          <span style={{ color: isSelected ? planetData.colors.primary : '#E5E7EB' }}>
                            {planet.charAt(0).toUpperCase() + planet.slice(1)}
                          </span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          color: isSelected ? planetData.colors.primary : '#9CA3AF'
                        }}>
                          <span>{Math.round((winSites / planetData.betArray.length) * 100)}%</span>
                          <span>•</span>
                          <span style={{ fontWeight: 'bold' }}>{maxMultiplier}x</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Statistics */}
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
                  EXCAVATION RECORDS
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
                    <span style={{ color: '#9CA3AF' }}>Artifacts Found:</span>
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

              {/* Planet Distribution */}
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
                    PLANET SUCCESS RATE
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(['earth', 'gas', 'crystal'] as const).map((planet) => {
                      const planetData = getPlanetData(planet)
                      const wins = planetStats[planet]
                      const total = gameHistory.filter(g => g.planet === planet).length
                      const rate = total > 0 ? Math.round((wins / total) * 100) : 0
                      
                      return total > 0 ? (
                        <div
                          key={planet}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px' }}>
                              {planet === 'earth' ? '🌍' : planet === 'gas' ? '🪐' : '💎'}
                            </span>
                            <span style={{ color: '#E5E7EB' }}>
                              {planet.charAt(0).toUpperCase() + planet.slice(1)}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            color: planetData.colors.primary
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
                      const planetData = getPlanetData(game.planet)
                      return (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '6px 10px',
                            background: game.wasWin 
                              ? `linear-gradient(90deg, ${planetData.colors.secondary}30, ${planetData.colors.primary}20)` 
                              : 'rgba(239, 68, 68, 0.2)',
                            border: `1px solid ${game.wasWin ? planetData.colors.primary + '40' : 'rgba(239, 68, 68, 0.3)'}`,
                            borderRadius: '6px',
                            fontSize: '11px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12px' }}>
                              {game.planet === 'earth' ? '🌍' : game.planet === 'gas' ? '🪐' : '💎'}
                            </span>
                            <span style={{ color: game.wasWin ? planetData.colors.primary : '#F87171' }}>
                              Site {game.resultIndex + 1}
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

AlienArtifactHuntPaytable.displayName = 'AlienArtifactHuntPaytable'

export default AlienArtifactHuntPaytable
