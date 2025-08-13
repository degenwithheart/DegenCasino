import { GambaUi, useCurrentToken } from 'gamba-react-ui-v2'
import React from 'react'

interface GameResult {
  experiment: 'quantum' | 'particle' | 'dimension'
  resultIndex: number
  wasWin: boolean
  amount: number
  multiplier: number
}

export interface QuantumLabPaytableRef {
  trackGame: (result: GameResult) => void
}

interface QuantumLabPaytableProps {
  wager: number
  selectedExperiment: 'quantum' | 'particle' | 'dimension'
}

const QuantumLabPaytable = React.forwardRef<QuantumLabPaytableRef, QuantumLabPaytableProps>(
  ({ wager, selectedExperiment }, ref) => {
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

    const getExperimentData = (experiment: 'quantum' | 'particle' | 'dimension') => {
      const betArrays = {
        quantum: [0, 1, 3, 6, 12],
        particle: [0, 0, 4, 9, 20],
        dimension: [0, 0, 0, 12, 35]
      }
      
      const colors = {
        quantum: { primary: '#a78bfa', secondary: '#7c3aed', tertiary: '#5b21b6' },
        particle: { primary: '#fca5a5', secondary: '#dc2626', tertiary: '#b91c1c' },
        dimension: { primary: '#6ee7b7', secondary: '#059669', tertiary: '#047857' }
      }
      
      const names = {
        quantum: 'Quantum Experiments',
        particle: 'Particle Physics', 
        dimension: 'Dimensional Science'
      }
      
      return { betArray: betArrays[experiment], colors: colors[experiment], name: names[experiment] }
    }

    const { betArray, colors, name } = getExperimentData(selectedExperiment)
    
    const experimentStats = React.useMemo(() => {
      const stats = { quantum: 0, particle: 0, dimension: 0 }
      gameHistory.forEach(game => {
        if (game.wasWin) stats[game.experiment]++
      })
      return stats
    }, [gameHistory])
    
    const totalWins = Object.values(experimentStats).reduce((a, b) => a + b, 0)

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
                  🔬 QUANTUM LABORATORY 🧪
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: colors.primary,
                  marginBottom: '16px'
                }}>
                  {name}
                </div>
              </div>

              {/* Current Experiment Stats */}
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
                  RESEARCH PHASES
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {betArray.map((multiplier, index) => {
                    const chance = multiplier > 0 ? ((1 / betArray.length) * 100).toFixed(1) : '0.0'
                    const phaseNames = selectedExperiment === 'quantum' 
                      ? ['Entanglement', 'Superposition', 'Tunneling', 'Decoherence', 'Collapse']
                      : selectedExperiment === 'particle'
                      ? ['Acceleration', 'Collision', 'Fragmentation', 'Fusion', 'Ignition']
                      : ['Opening', 'Stabilization', 'Expansion', 'Bridging', 'Merging']
                    
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
                            {selectedExperiment === 'quantum' ? 
                              (index === 0 ? '⚛️' : index === 1 ? '🌀' : index === 2 ? '🔀' : index === 3 ? '📡' : '💫') :
                            selectedExperiment === 'particle' ?
                              (index === 0 ? '🚀' : index === 1 ? '💥' : index === 2 ? '🔥' : index === 3 ? '⚡' : '🌟') :
                              (index === 0 ? '🌀' : index === 1 ? '🔮' : index === 2 ? '🌌' : index === 3 ? '🪐' : '✨')
                            }
                          </span>
                          <span style={{ color: '#E5E7EB' }}>{phaseNames[index]}</span>
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

              {/* Experiment Comparison */}
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
                  EXPERIMENT COMPARISON
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(['quantum', 'particle', 'dimension'] as const).map((experiment) => {
                    const experimentData = getExperimentData(experiment)
                    const maxMultiplier = Math.max(...experimentData.betArray)
                    const winPhases = experimentData.betArray.filter(x => x > 0).length
                    const isSelected = experiment === selectedExperiment
                    
                    return (
                      <div
                        key={experiment}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: isSelected 
                            ? `linear-gradient(90deg, ${experimentData.colors.secondary}40, ${experimentData.colors.primary}20)` 
                            : 'rgba(55, 65, 81, 0.4)',
                          border: `1px solid ${isSelected ? experimentData.colors.primary + '60' : 'rgba(107, 114, 128, 0.3)'}`,
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>
                            {experiment === 'quantum' ? '⚛️' : experiment === 'particle' ? '💥' : '🌀'}
                          </span>
                          <span style={{ color: isSelected ? experimentData.colors.primary : '#E5E7EB' }}>
                            {experiment.charAt(0).toUpperCase() + experiment.slice(1)}
                          </span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          color: isSelected ? experimentData.colors.primary : '#9CA3AF'
                        }}>
                          <span>{Math.round((winPhases / experimentData.betArray.length) * 100)}%</span>
                          <span>•</span>
                          <span style={{ fontWeight: 'bold' }}>{maxMultiplier}x</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Laboratory Statistics */}
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
                  RESEARCH STATISTICS
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <span style={{ color: '#9CA3AF' }}>Total Experiments:</span>
                    <span style={{ color: '#E5E7EB', fontWeight: 'bold' }}>{gameHistory.length}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <span style={{ color: '#9CA3AF' }}>Breakthroughs:</span>
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

              {/* Experiment Distribution */}
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
                    FIELD SUCCESS RATE
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(['quantum', 'particle', 'dimension'] as const).map((experiment) => {
                      const experimentData = getExperimentData(experiment)
                      const wins = experimentStats[experiment]
                      const total = gameHistory.filter(g => g.experiment === experiment).length
                      const rate = total > 0 ? Math.round((wins / total) * 100) : 0
                      
                      return total > 0 ? (
                        <div
                          key={experiment}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px' }}>
                              {experiment === 'quantum' ? '⚛️' : experiment === 'particle' ? '💥' : '🌀'}
                            </span>
                            <span style={{ color: '#E5E7EB' }}>
                              {experiment.charAt(0).toUpperCase() + experiment.slice(1)}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            color: experimentData.colors.primary
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

              {/* Recent Research */}
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
                    RECENT EXPERIMENTS
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {gameHistory.slice(0, 5).map((game, index) => {
                      const experimentData = getExperimentData(game.experiment)
                      return (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '6px 10px',
                            background: game.wasWin 
                              ? `linear-gradient(90deg, ${experimentData.colors.secondary}30, ${experimentData.colors.primary}20)` 
                              : 'rgba(239, 68, 68, 0.2)',
                            border: `1px solid ${game.wasWin ? experimentData.colors.primary + '40' : 'rgba(239, 68, 68, 0.3)'}`,
                            borderRadius: '6px',
                            fontSize: '11px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12px' }}>
                              {game.experiment === 'quantum' ? '⚛️' : game.experiment === 'particle' ? '💥' : '🌀'}
                            </span>
                            <span style={{ color: game.wasWin ? experimentData.colors.primary : '#F87171' }}>
                              Phase {game.resultIndex + 1}
                            </span>
                          </div>
                          <div style={{ 
                            color: game.wasWin ? '#10B981' : '#F87171',
                            fontWeight: 'bold'
                          }}>
                            {game.wasWin ? `+${formatWager(game.amount)}` : 'FAILED'}
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

QuantumLabPaytable.displayName = 'QuantumLabPaytable'

export default QuantumLabPaytable
