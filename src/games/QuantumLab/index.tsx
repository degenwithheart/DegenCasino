import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { useIsCompact } from '../../hooks/useIsCompact'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { GameStateProvider, useGameState } from '../../hooks/useGameState'
import QuantumLabPaytable, { QuantumLabPaytableRef } from './QuantumLabPaytable'
import QuantumLabOverlays from './QuantumLabOverlays'
import { GameControls } from '../../components'

// Bet arrays for different quantum experiments
const EXPERIMENT_TYPES = {
  quantum: [0, 1, 3, 6, 12],          // Quantum entanglement - stable
  particle: [0, 0, 4, 9, 20],         // Particle acceleration - volatile
  dimension: [0, 0, 0, 12, 35],       // Dimensional rifts - extreme
}

type ExperimentType = keyof typeof EXPERIMENT_TYPES

export default function QuantumLab() {
  return (
    <GameStateProvider>
      <QuantumLabGame />
    </GameStateProvider>
  )
}

function QuantumLabGame() {
  const { gamePhase, setGamePhase } = useGameState()
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [playing, setPlaying] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [experiment, setExperiment] = React.useState<ExperimentType>('quantum')
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const paytableRef = React.useRef<QuantumLabPaytableRef>(null)
  
  // Multi-phase states
  const [currentPhase, setCurrentPhase] = React.useState(0)
  const [calibrationPhase, setCalibrationPhase] = React.useState(false)
  const [experimentComplete, setExperimentComplete] = React.useState(false)
  const [phaseResults, setPhaseResults] = React.useState<('stable' | 'unstable' | 'breakthrough')[]>([])
  const [energyLevel, setEnergyLevel] = React.useState(0)
  const [stabilityRating, setStabilityRating] = React.useState(100)
  
  // Game outcome state
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
    resetGameState,
  } = useGameOutcome()

  // Dynamic play button text
  const playButtonText = hasPlayedBefore && !showOutcome ? "Play Again" : "Start"

  const tokenMeta = token ? TOKEN_METADATA.find(t => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)

  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager)
    } else {
      setWager(0)
    }
  }, [setWager, token, baseWager])

  const sounds = useSound({
    win: '/sounds/win.mp3',
    lose: '/sounds/lose.mp3',
    play: '/sounds/play.mp3',
  })

  const play = async () => {
    try {
      setWin(false)
      setPlaying(true)
      setCurrentPhase(0)
      setCalibrationPhase(true)
      setExperimentComplete(false)
      setPhaseResults([])
      setEnergyLevel(0)
      setStabilityRating(100)
      
      const selectedExperiment = experiment
      const selectedBet = EXPERIMENT_TYPES[experiment]

      if (sounds.play) sounds.play('play', { playbackRate: 0.9 })

      await game.play({
        bet: selectedBet,
        wager,
        metadata: [experiment],
      })

      const result = await game.result()
      const winResult = result.payout > 0
      const breakthroughPhase = result.resultIndex
      const multiplier = winResult ? result.payout / wager : 0

      // Create experiment sequence
      const maxPhases = selectedBet.length
      const phaseResults: ('stable' | 'unstable' | 'breakthrough')[] = []
      
      for (let phase = 0; phase < maxPhases; phase++) {
        setCurrentPhase(phase + 1)
        setEnergyLevel(((phase + 1) / maxPhases) * 100)
        
        // Calculate stability based on experiment type and phase
        const baseStability = 100 - (phase * (experiment === 'quantum' ? 15 : experiment === 'particle' ? 20 : 25))
        setStabilityRating(Math.max(0, baseStability))
        
        // Simulate calibration time with increasing complexity
        await new Promise(resolve => setTimeout(resolve, 2400 + (phase * 800)))
        
        let phaseResult: 'stable' | 'unstable' | 'breakthrough'
        if (phase === breakthroughPhase && winResult) {
          phaseResult = selectedBet[phase] >= 20 ? 'breakthrough' : 'unstable'
        } else if (phase < breakthroughPhase || (!winResult && Math.random() < 0.4)) {
          phaseResult = Math.random() < 0.6 ? 'stable' : 'unstable'
        } else {
          phaseResult = 'stable'
        }
        
        phaseResults.push(phaseResult)
        setPhaseResults([...phaseResults])
        
        if (phaseResult === 'breakthrough') {
          break
        }
        
        await new Promise(resolve => setTimeout(resolve, 1200))
      }

      setCalibrationPhase(false)
      setExperimentComplete(true)
      setWin(winResult)
      setResultIndex(result.resultIndex)

      paytableRef.current?.trackGame({
        experiment: selectedExperiment,
        resultIndex: result.resultIndex,
        wasWin: winResult,
        amount: winResult ? result.payout - wager : 0,
        multiplier: multiplier,
      })

      if (winResult && sounds.play) {
        sounds.play('win')
      } else if (!winResult && sounds.play) {
        sounds.play('lose')
      }
      
      handleGameComplete({ payout: result.payout, wager })
    } finally {
      setPlaying(false)
    }
  }

  const isCompact = useIsCompact()
  const [scale, setScale] = React.useState(isCompact ? 1 : 1.2)

  React.useEffect(() => {
    setScale(isCompact ? 1 : 1.2)
  }, [isCompact])

  const getExperimentMultiplier = (experiment: ExperimentType) => {
    const bet = EXPERIMENT_TYPES[experiment]
    return Math.max(...bet)
  }

  const getExperimentChance = (experiment: ExperimentType) => {
    const bet = EXPERIMENT_TYPES[experiment]
    const winCount = bet.filter(x => x > 0).length
    return Math.round((winCount / bet.length) * 100)
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: experiment === 'quantum' 
              ? 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 20%, #4c1d95 40%, #3730a3 60%, #1e1b4b 80%, #0f172a 100%)'
              : experiment === 'particle'
              ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 20%, #991b1b 40%, #7f1d1d 60%, #450a0a 80%, #0f172a 100%)'
              : 'linear-gradient(135deg, #059669 0%, #047857 20%, #065f46 40%, #064e3b 60%, #022c22 80%, #0f172a 100%)',
            borderRadius: '24px',
            border: `3px solid ${experiment === 'quantum' ? 'rgba(124, 58, 237, 0.4)' : experiment === 'particle' ? 'rgba(220, 38, 38, 0.4)' : 'rgba(5, 150, 105, 0.4)'}`,
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.9),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.6),
              0 0 40px ${experiment === 'quantum' ? 'rgba(124, 58, 237, 0.3)' : experiment === 'particle' ? 'rgba(220, 38, 38, 0.3)' : 'rgba(5, 150, 105, 0.3)'}
            `,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Advanced Quantum Field Effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: experiment === 'quantum' 
                ? `
                  radial-gradient(circle at 25% 25%, rgba(124, 58, 237, 0.3) 0%, transparent 30%),
                  radial-gradient(circle at 75% 75%, rgba(91, 33, 182, 0.2) 0%, transparent 35%),
                  radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.15) 0%, transparent 40%)
                `
                : experiment === 'particle'
                ? `
                  radial-gradient(circle at 30% 70%, rgba(220, 38, 38, 0.25) 0%, transparent 35%),
                  radial-gradient(circle at 80% 20%, rgba(185, 28, 28, 0.2) 0%, transparent 40%),
                  radial-gradient(circle at 10% 40%, rgba(153, 27, 27, 0.15) 0%, transparent 30%)
                `
                : `
                  radial-gradient(circle at 60% 30%, rgba(5, 150, 105, 0.22) 0%, transparent 35%),
                  radial-gradient(circle at 20% 80%, rgba(4, 120, 87, 0.18) 0%, transparent 40%),
                  radial-gradient(circle at 90% 60%, rgba(6, 95, 70, 0.12) 0%, transparent 30%)
                `,
              animation: 'quantumField 20s ease-in-out infinite alternate'
            }} />
            
            {/* Particle Stream Effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: experiment === 'quantum' 
                ? `
                  repeating-conic-gradient(
                    from 0deg at 50% 50%,
                    transparent 0deg,
                    rgba(124, 58, 237, 0.08) 30deg,
                    transparent 60deg
                  )
                `
                : experiment === 'particle'
                ? `
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 4px,
                    rgba(220, 38, 38, 0.06) 4px,
                    rgba(220, 38, 38, 0.06) 8px
                  )
                `
                : `
                  repeating-radial-gradient(
                    circle at 50% 50%,
                    transparent 0px,
                    rgba(5, 150, 105, 0.05) 15px,
                    transparent 30px
                  )
                `,
              animation: 'particleStream 25s linear infinite'
            }} />
            
            {/* Floating Scientific Elements */}
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '10%',
              fontSize: '35px',
              opacity: 0.15,
              animation: 'equipmentFloat 18s ease-in-out infinite'
            }}>
              {experiment === 'quantum' ? '⚛️' : experiment === 'particle' ? '🔬' : '🧪'}
            </div>
            
            <div style={{
              position: 'absolute',
              top: '65%',
              right: '15%',
              fontSize: '30px',
              opacity: 0.12,
              animation: 'equipmentFloat 15s ease-in-out infinite reverse'
            }}>
              {experiment === 'quantum' ? '🔬' : experiment === 'particle' ? '💥' : '🌀'}
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '25%',
              left: '20%',
              fontSize: '28px',
              opacity: 0.18,
              animation: 'equipmentFloat 20s ease-in-out infinite'
            }}>
              {experiment === 'quantum' ? '💫' : experiment === 'particle' ? '⚡' : '🔮'}
            </div>

            {/* Experiment Type Selection */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              zIndex: 10
            }}>
              {(['quantum', 'particle', 'dimension'] as ExperimentType[]).map((expType) => (
                <button
                  key={expType}
                  onClick={() => setExperiment(expType)}
                  disabled={playing}
                  style={{
                    background: experiment === expType 
                      ? `linear-gradient(135deg, ${expType === 'quantum' ? 'rgba(124, 58, 237, 0.4)' : expType === 'particle' ? 'rgba(220, 38, 38, 0.4)' : 'rgba(5, 150, 105, 0.4)'} 0%, ${expType === 'quantum' ? 'rgba(91, 33, 182, 0.4)' : expType === 'particle' ? 'rgba(185, 28, 28, 0.4)' : 'rgba(4, 120, 87, 0.4)'} 100%)`
                      : 'rgba(0, 0, 0, 0.6)',
                    border: experiment === expType 
                      ? `2px solid ${expType === 'quantum' ? 'rgba(124, 58, 237, 0.7)' : expType === 'particle' ? 'rgba(220, 38, 38, 0.7)' : 'rgba(5, 150, 105, 0.7)'}` 
                      : '1px solid rgba(107, 114, 128, 0.3)',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: playing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: playing ? 0.6 : 1,
                    textTransform: 'uppercase'
                  }}
                >
                  {expType === 'quantum' && '⚛️ QUANTUM'} 
                  {expType === 'particle' && '💥 PARTICLE'} 
                  {expType === 'dimension' && '🌀 DIMENSION'}
                  <br />
                  <span style={{ fontSize: '9px', opacity: 0.8 }}>
                    {getExperimentChance(expType)}% • {getExperimentMultiplier(expType)}x
                  </span>
                </button>
              ))}
            </div>

            {/* Main Game Visual */}
            <div style={{
              textAlign: 'center',
              transform: `scale(${scale})`,
              transition: 'transform 0.2s ease-out',
            }}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: 800,
                margin: '0 0 16px 0',
                background: `linear-gradient(45deg, ${experiment === 'quantum' ? '#8b5cf6, #a78bfa, #c4b5fd' : experiment === 'particle' ? '#f87171, #fca5a5, #fecaca' : '#34d399, #6ee7b7, #a7f3d0'})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 0 30px ${experiment === 'quantum' ? 'rgba(124, 58, 237, 0.5)' : experiment === 'particle' ? 'rgba(220, 38, 38, 0.5)' : 'rgba(5, 150, 105, 0.5)'}`
              }}>
                🔬 QUANTUM LAB 🧪
              </h1>
              
              <div style={{
                fontSize: '20px',
                color: experiment === 'quantum' ? '#a78bfa' : experiment === 'particle' ? '#fca5a5' : '#6ee7b7',
                marginBottom: '32px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
              }}>
                {playing && calibrationPhase ? (
                  <span style={{ color: '#fbbf24' }}>⚗️ Calibrating phase {currentPhase}...</span>
                ) : playing ? (
                  <span style={{ color: '#22c55e' }}>🧬 Experiment Complete</span>
                ) : (
                  'Conduct cutting-edge quantum experiments'
                )}
              </div>

              {/* Experiment Phase Display */}
              {(playing || hasPlayedBefore) && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '24px'
                }}>
                  {EXPERIMENT_TYPES[experiment].map((multiplier, index) => {
                    const isCurrentPhase = calibrationPhase && currentPhase === index + 1
                    const isCompleted = index < phaseResults.length
                    const phaseResult = phaseResults[index]
                    
                    return (
                      <div
                        key={index}
                        style={{
                          width: '320px',
                          height: '48px',
                          borderRadius: '24px',
                          border: isCurrentPhase ? '3px solid #fbbf24' : `2px solid ${experiment === 'quantum' ? 'rgba(139, 92, 246, 0.3)' : experiment === 'particle' ? 'rgba(248, 113, 113, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`,
                          background: isCompleted
                            ? (phaseResult === 'breakthrough' ? `linear-gradient(135deg, ${experiment === 'quantum' ? '#7c3aed, #5b21b6' : experiment === 'particle' ? '#dc2626, #b91c1c' : '#059669, #047857'})` 
                               : phaseResult === 'unstable' ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                               : `linear-gradient(135deg, ${experiment === 'quantum' ? '#4c1d95, #3730a3' : experiment === 'particle' ? '#991b1b, #7f1d1d' : '#065f46, #064e3b'})`)
                            : `linear-gradient(135deg, 
                               ${experiment === 'quantum' ? `rgba(124, 58, 237, ${0.2 + index * 0.1})` : experiment === 'particle' ? `rgba(220, 38, 38, ${0.2 + index * 0.1})` : `rgba(5, 150, 105, ${0.2 + index * 0.1})`} 0%, 
                               ${experiment === 'quantum' ? `rgba(91, 33, 182, ${0.2 + index * 0.1})` : experiment === 'particle' ? `rgba(185, 28, 28, ${0.2 + index * 0.1})` : `rgba(4, 120, 87, ${0.2 + index * 0.1})`} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 20px',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: 600,
                          position: 'relative',
                          animation: isCurrentPhase ? 'phaseCalibration 1s infinite' : 'none',
                          boxShadow: isCurrentPhase ? '0 0 20px rgba(251, 191, 36, 0.5)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ fontSize: '18px' }}>
                            {isCompleted 
                              ? (phaseResult === 'breakthrough' ? '🧬' 
                                 : phaseResult === 'unstable' ? '⚠️' 
                                 : '✅')
                              : isCurrentPhase ? '⚗️' : '⚙️'}
                          </div>
                          <span>PHASE {index + 1}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {multiplier > 0 && (
                            <span style={{ fontSize: '12px', color: experiment === 'quantum' ? '#a78bfa' : experiment === 'particle' ? '#fca5a5' : '#6ee7b7' }}>
                              {multiplier}x BREAKTHROUGH
                            </span>
                          )}
                          <div style={{ fontSize: '12px' }}>
                            {experiment === 'quantum' ? 
                              (index === 0 ? 'ENTANGLE' : index === 1 ? 'SUPERPOSE' : index === 2 ? 'TUNNEL' : index === 3 ? 'DECOHERE' : 'COLLAPSE') :
                            experiment === 'particle' ?
                              (index === 0 ? 'ACCELERATE' : index === 1 ? 'COLLIDE' : index === 2 ? 'FRAGMENT' : index === 3 ? 'FUSE' : 'IGNITE') :
                              (index === 0 ? 'OPEN' : index === 1 ? 'STABILIZE' : index === 2 ? 'EXPAND' : index === 3 ? 'BRIDGE' : 'MERGE')
                            }
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Lab Status Readings */}
              {calibrationPhase && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '20px',
                  margin: '20px auto',
                  width: '300px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '50px',
                      animation: 'labPulse 2s ease-in-out infinite',
                      filter: `drop-shadow(0 0 15px ${experiment === 'quantum' ? 'rgba(139, 92, 246, 0.8)' : experiment === 'particle' ? 'rgba(248, 113, 113, 0.8)' : 'rgba(52, 211, 153, 0.8)'})`
                    }}>
                      ⚗️
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: experiment === 'quantum' ? '#a78bfa' : experiment === 'particle' ? '#fca5a5' : '#6ee7b7',
                      marginTop: '5px'
                    }}>
                      Energy: {energyLevel.toFixed(0)}%
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '50px',
                      animation: 'labPulse 2.5s ease-in-out infinite',
                      filter: `drop-shadow(0 0 15px ${stabilityRating > 50 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'})`
                    }}>
                      📊
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: stabilityRating > 50 ? '#22c55e' : '#ef4444',
                      marginTop: '5px'
                    }}>
                      Stability: {stabilityRating.toFixed(0)}%
                    </div>
                  </div>
                </div>
              )}

              {/* Result Display */}
              {!playing && hasPlayedBefore && (
                <div style={{
                  padding: '16px 32px',
                  borderRadius: '16px',
                  background: win 
                    ? `linear-gradient(135deg, ${experiment === 'quantum' ? 'rgba(124, 58, 237, 0.2)' : experiment === 'particle' ? 'rgba(220, 38, 38, 0.2)' : 'rgba(5, 150, 105, 0.2)'} 0%, ${experiment === 'quantum' ? 'rgba(91, 33, 182, 0.1)' : experiment === 'particle' ? 'rgba(185, 28, 28, 0.1)' : 'rgba(4, 120, 87, 0.1)'} 100%)`
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  border: `2px solid ${win ? (experiment === 'quantum' ? '#a78bfa' : experiment === 'particle' ? '#fca5a5' : '#6ee7b7') : '#ef4444'}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
                  marginTop: '24px'
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: win ? (experiment === 'quantum' ? '#a78bfa' : experiment === 'particle' ? '#fca5a5' : '#6ee7b7') : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {win ? '🧬 SCIENTIFIC BREAKTHROUGH!' : '💥 EXPERIMENT FAILED'}
                  </div>
                  <div style={{ color: experiment === 'quantum' ? '#a78bfa' : experiment === 'particle' ? '#fca5a5' : '#6ee7b7', fontSize: '16px' }}>
                    {win ? `Revolutionary ${experiment} discovery achieved!` : 'Experimental parameters exceeded safe limits'}
                  </div>
                </div>
              )}
            </div>

            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '12px',
              padding: '12px 20px',
              border: `1px solid ${experiment === 'quantum' ? 'rgba(139, 92, 246, 0.3)' : experiment === 'particle' ? 'rgba(248, 113, 113, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`,
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                {playing ? 'EXPERIMENT IN PROGRESS...' : `EXPERIMENT: ${experiment.toUpperCase()}`}
              </div>
              <div style={{ color: experiment === 'quantum' ? '#a78bfa' : experiment === 'particle' ? '#fca5a5' : '#6ee7b7', fontSize: '14px', fontWeight: 700 }}>
                {getExperimentMultiplier(experiment)}.00x MAX DISCOVERY
              </div>
            </div>
            
            <QuantumLabOverlays
              calibrationPhase={calibrationPhase}
              currentPhase={currentPhase}
              experimentComplete={experimentComplete}
              win={win}
              experiment={experiment}
              energyLevel={energyLevel}
              stabilityRating={stabilityRating}
            
                currentBalance={balance}
                wager={wager}
              />

            <style>
              {`
                @keyframes quantumField {
                  0%, 100% { opacity: 0.5; transform: scale(1) rotate(0deg); }
                  25% { opacity: 0.7; transform: scale(1.02) rotate(1deg); }
                  50% { opacity: 0.6; transform: scale(1.05) rotate(0deg); }
                  75% { opacity: 0.8; transform: scale(1.03) rotate(-1deg); }
                }
                @keyframes particleStream {
                  0% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
                  50% { transform: translateX(0%) rotate(180deg); opacity: 0.6; }
                  100% { transform: translateX(100%) rotate(360deg); opacity: 0.3; }
                }
                @keyframes scientificFloat {
                  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.35; }
                  25% { transform: translateY(-15px) translateX(10px) rotate(90deg); opacity: 0.45; }
                  50% { transform: translateY(-25px) translateX(-8px) rotate(180deg); opacity: 0.4; }
                  75% { transform: translateY(-12px) translateX(12px) rotate(270deg); opacity: 0.5; }
                }
                @keyframes quantumBeam1 {
                  0%, 100% { opacity: 0.4; transform: scaleY(1) rotate(15deg); }
                  50% { opacity: 0.8; transform: scaleY(1.5) rotate(15deg); }
                }
                @keyframes quantumBeam2 {
                  0%, 100% { opacity: 0.3; transform: scaleY(1) rotate(-20deg); }
                  50% { opacity: 0.7; transform: scaleY(1.3) rotate(-20deg); }
                }
                @keyframes quantumBeam3 {
                  0%, 100% { opacity: 0.25; transform: scaleY(1) rotate(45deg); }
                  50% { opacity: 0.6; transform: scaleY(1.2) rotate(45deg); }
                }
                @keyframes energyOrb {
                  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.4; }
                  25% { transform: scale(1.3) rotate(90deg); opacity: 0.6; }
                  50% { transform: scale(0.8) rotate(180deg); opacity: 0.8; }
                  75% { transform: scale(1.1) rotate(270deg); opacity: 0.5; }
                }
                @keyframes phaseCalibration {
                  0%, 100% { transform: scale(1); opacity: 1; border-radius: 30px; }
                  25% { transform: scale(1.03); opacity: 0.95; border-radius: 35px; }
                  50% { transform: scale(1.06); opacity: 0.9; border-radius: 40px; }
                  75% { transform: scale(1.04); opacity: 0.95; border-radius: 35px; }
                }
                @keyframes labPulse {
                  0%, 100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
                  25% { transform: scale(1.08) rotate(3deg); filter: brightness(1.2); }
                  50% { transform: scale(1.12) rotate(5deg); filter: brightness(1.4); }
                  75% { transform: scale(1.06) rotate(2deg); filter: brightness(1.1); }
                }
                @keyframes quantumResonance {
                  0%, 100% { filter: drop-shadow(0 0 15px rgba(124, 58, 237, 0.5)) brightness(1); }
                  50% { filter: drop-shadow(0 0 30px rgba(124, 58, 237, 0.8)) brightness(1.3); }
                }
                @keyframes experimentSuccess {
                  0% { transform: scale(1) rotate(0deg); opacity: 0.8; }
                  50% { transform: scale(1.4) rotate(180deg); opacity: 1; }
                  100% { transform: scale(1.2) rotate(360deg); opacity: 0.9; }
                }
              `}
            </style>
          </div>

          <QuantumLabPaytable
            ref={paytableRef}
            wager={wager}
            selectedExperiment={experiment}
          />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={playing}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'New Experiment' : 'Begin Research'}
        onPlayAgain={handlePlayAgain}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Experiment:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['quantum', 'particle', 'dimension'] as ExperimentType[]).map((expType) => (
              <GambaUi.Button
                key={expType}
                onClick={() => setExperiment(expType)}
                disabled={playing || showOutcome}
              >
                {experiment === expType ? '✓ ' : ''}
                {expType === 'quantum' && '⚛️ Quantum'}
                {expType === 'particle' && '💥 Particle'}
                {expType === 'dimension' && '🌀 Dimension'}
              </GambaUi.Button>
            ))}
          </div>
        </div>
      </GameControls>
    </>
  )
}
