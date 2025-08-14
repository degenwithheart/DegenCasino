import React from 'react'
import { SyncedWinLossOverlay } from '../../components/SyncedWinLossOverlay';

interface QuantumLabOverlaysProps {
  calibrationPhase: boolean
  currentPhase: number
  experimentComplete: boolean
  win: boolean
  experiment: 'quantum' | 'particle' | 'dimension'
  energyLevel: number
  stabilityRating: number
  result?: any;
  currentBalance: number;
  wager: number;
}

const QuantumLabOverlays: React.FC<QuantumLabOverlaysProps> = ({
  calibrationPhase,
  currentPhase,
  experimentComplete,
  win,
  experiment,
  energyLevel,
  stabilityRating,
  result,
  currentBalance,
  wager
}) => {
  // Custom win levels for QuantumLab
  const quantumLabWinLevels = [
    { 
      minMultiplier: 1, 
      maxMultiplier: 3, 
      intensity: 1,
      label: "Experiment Success!",
      emoji: "🔬",
      className: "win-small"
    },
    { 
      minMultiplier: 3, 
      maxMultiplier: 10, 
      intensity: 2,
      label: "Quantum Breakthrough!",
      emoji: "⚡",
      className: "win-medium"
    },
    { 
      minMultiplier: 10, 
      maxMultiplier: 1000, 
      intensity: 3,
      label: "DIMENSIONAL RIFT!",
      emoji: "🌌",
      className: "win-mega"
    }
  ];

  if (!calibrationPhase && !experimentComplete && !win) return null

  return (
    <>
      {/* Synced Win/Loss Overlay */}
      <SyncedWinLossOverlay
        result={result}
        currentBalance={currentBalance}
        animationPhase={experimentComplete && win ? 'celebrating' : 'idle'}
        triggerPhase="celebrating"
        wager={wager}
        winLevels={quantumLabWinLevels}
      />

      {/* Laboratory Control Interface */}
      {calibrationPhase && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 100
        }}>
          {/* Laboratory Control Panel */}
          <div style={{
            width: '420px',
            height: '320px',
            border: `2px solid ${experiment === 'quantum' ? '#a78bfa' : experiment === 'particle' ? '#fca5a5' : '#6ee7b7'}`,
            borderRadius: '20px',
            background: `linear-gradient(135deg, 
              ${experiment === 'quantum' ? 'rgba(124, 58, 237, 0.1)' : experiment === 'particle' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(5, 150, 105, 0.1)'} 0%, 
              rgba(0, 0, 0, 0.85) 50%, 
              ${experiment === 'quantum' ? 'rgba(91, 33, 182, 0.1)' : experiment === 'particle' ? 'rgba(185, 28, 28, 0.1)' : 'rgba(4, 120, 87, 0.1)'} 100%)`,
            backdropFilter: 'blur(12px)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            animation: 'labPanelPulse 2.5s ease-in-out infinite'
          }}>
            {/* Control Grid Background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                repeating-linear-gradient(90deg, transparent 0%, transparent 18px, ${experiment === 'quantum' ? 'rgba(139, 92, 246, 0.05)' : experiment === 'particle' ? 'rgba(248, 113, 113, 0.05)' : 'rgba(52, 211, 153, 0.05)'} 20px),
                repeating-linear-gradient(0deg, transparent 0%, transparent 18px, ${experiment === 'quantum' ? 'rgba(139, 92, 246, 0.05)' : experiment === 'particle' ? 'rgba(248, 113, 113, 0.05)' : 'rgba(52, 211, 153, 0.05)'} 20px)
              `,
              opacity: 0.6,
              animation: 'gridShift 4s linear infinite'
            }} />
            
            {/* Central Display */}
            <div style={{
              textAlign: 'center',
              color: '#fff',
              zIndex: 2
            }}>
              <div style={{
                fontSize: '70px',
                marginBottom: '12px',
                animation: 'experimentRotate 3s linear infinite',
                filter: `drop-shadow(0 0 25px ${experiment === 'quantum' ? 'rgba(139, 92, 246, 0.8)' : experiment === 'particle' ? 'rgba(248, 113, 113, 0.8)' : 'rgba(52, 211, 153, 0.8)'})`
              }}>
                {experiment === 'quantum' ? '⚛️' : experiment === 'particle' ? '💥' : '🌀'}
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: experiment === 'quantum' ? '#a78bfa' : experiment === 'particle' ? '#fca5a5' : '#6ee7b7',
                marginBottom: '8px',
                textShadow: `0 0 10px ${experiment === 'quantum' ? 'rgba(139, 92, 246, 0.6)' : experiment === 'particle' ? 'rgba(248, 113, 113, 0.6)' : 'rgba(52, 211, 153, 0.6)'}`
              }}>
                {experiment === 'quantum' ? 'QUANTUM LABORATORY' : experiment === 'particle' ? 'PARTICLE ACCELERATOR' : 'DIMENSIONAL CHAMBER'}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#CBD5E1',
                marginBottom: '16px'
              }}>
                Phase {currentPhase} Calibration
              </div>
              
              {/* Status Displays */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '250px',
                marginBottom: '12px'
              }}>
                {/* Energy Level */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '12px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '6px',
                    border: `1px solid ${experiment === 'quantum' ? '#a78bfa' : experiment === 'particle' ? '#fca5a5' : '#6ee7b7'}`,
                    overflow: 'hidden',
                    marginBottom: '4px'
                  }}>
                    <div style={{
                      width: `${energyLevel}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${experiment === 'quantum' ? '#7c3aed, #8b5cf6' : experiment === 'particle' ? '#dc2626, #f87171' : '#059669, #34d399'})`,
                      transition: 'width 0.5s ease-out',
                      animation: 'energyFlow 1.5s ease-in-out infinite alternate'
                    }} />
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: experiment === 'quantum' ? '#a78bfa' : experiment === 'particle' ? '#fca5a5' : '#6ee7b7',
                    fontWeight: 600
                  }}>
                    ENERGY: {energyLevel.toFixed(0)}%
                  </div>
                </div>

                {/* Stability Rating */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '12px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '6px',
                    border: `1px solid ${stabilityRating > 50 ? '#22c55e' : '#ef4444'}`,
                    overflow: 'hidden',
                    marginBottom: '4px'
                  }}>
                    <div style={{
                      width: `${stabilityRating}%`,
                      height: '100%',
                      background: stabilityRating > 50 
                        ? 'linear-gradient(90deg, #059669, #22c55e)' 
                        : 'linear-gradient(90deg, #dc2626, #ef4444)',
                      transition: 'width 0.5s ease-out',
                      animation: stabilityRating < 30 ? 'instabilityFlicker 0.5s ease-in-out infinite alternate' : 'none'
                    }} />
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: stabilityRating > 50 ? '#22c55e' : '#ef4444',
                    fontWeight: 600
                  }}>
                    STABLE: {stabilityRating.toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Phase Indicator */}
              <div style={{
                fontSize: '12px',
                color: '#9CA3AF',
                fontWeight: 500
              }}>
                {experiment === 'quantum' ? 
                  ['Entanglement', 'Superposition', 'Tunneling', 'Decoherence', 'Collapse'][currentPhase - 1] :
                experiment === 'particle' ?
                  ['Acceleration', 'Collision', 'Fragmentation', 'Fusion', 'Ignition'][currentPhase - 1] :
                  ['Opening', 'Stabilization', 'Expansion', 'Bridging', 'Merging'][currentPhase - 1]
                } Phase Active
              </div>
            </div>
            
            {/* Panel Corner LEDs */}
            {[0, 1, 2, 3].map(corner => (
              <div
                key={corner}
                style={{
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: experiment === 'quantum' ? '#a78bfa' : experiment === 'particle' ? '#fca5a5' : '#6ee7b7',
                  ...(corner === 0 && { top: '12px', left: '12px' }),
                  ...(corner === 1 && { top: '12px', right: '12px' }),
                  ...(corner === 2 && { bottom: '12px', left: '12px' }),
                  ...(corner === 3 && { bottom: '12px', right: '12px' }),
                  animation: 'ledBlink 3s ease-in-out infinite',
                  animationDelay: `${corner * 0.75}s`,
                  filter: `drop-shadow(0 0 4px ${experiment === 'quantum' ? 'rgba(139, 92, 246, 0.8)' : experiment === 'particle' ? 'rgba(248, 113, 113, 0.8)' : 'rgba(52, 211, 153, 0.8)'})`
                }}
              />
            ))}
          </div>
          
          {/* Energy Beam Effect */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '6px',
            height: '150px',
            background: `linear-gradient(to bottom, ${experiment === 'quantum' ? '#a78bfa' : experiment === 'particle' ? '#fca5a5' : '#6ee7b7'}, transparent)`,
            animation: 'energyBeam 2.5s ease-in-out infinite',
            filter: `drop-shadow(0 0 12px ${experiment === 'quantum' ? 'rgba(139, 92, 246, 0.8)' : experiment === 'particle' ? 'rgba(248, 113, 113, 0.8)' : 'rgba(52, 211, 153, 0.8)'})`
          }} />
        </div>
      )}

      {/* Breakthrough Discovery Sequence */}
      {experimentComplete && win && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `radial-gradient(circle, ${experiment === 'quantum' ? 'rgba(124, 58, 237, 0.3)' : experiment === 'particle' ? 'rgba(220, 38, 38, 0.3)' : 'rgba(5, 150, 105, 0.3)'} 0%, rgba(0, 0, 0, 0.85) 70%)`,
          zIndex: 200,
          animation: 'breakthroughReveal 2.5s ease-out'
        }}>
          <div style={{
            textAlign: 'center',
            transform: 'scale(1)',
            animation: 'discoveryFloat 3s ease-in-out infinite'
          }}>
            <div style={{
              fontSize: '120px',
              marginBottom: '20px',
              filter: `drop-shadow(0 0 40px ${experiment === 'quantum' ? 'rgba(139, 92, 246, 1)' : experiment === 'particle' ? 'rgba(248, 113, 113, 1)' : 'rgba(52, 211, 153, 1)'})`,
              animation: 'breakthroughGlow 2s ease-in-out infinite alternate'
            }}>
              {experiment === 'quantum' ? '🧬' : experiment === 'particle' ? '💥' : '🌀'}
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 800,
              color: experiment === 'quantum' ? '#a78bfa' : experiment === 'particle' ? '#fca5a5' : '#6ee7b7',
              marginBottom: '16px',
              textShadow: `0 0 25px ${experiment === 'quantum' ? 'rgba(139, 92, 246, 0.8)' : experiment === 'particle' ? 'rgba(248, 113, 113, 0.8)' : 'rgba(52, 211, 153, 0.8)'}`
            }}>
              SCIENTIFIC BREAKTHROUGH!
            </div>
            <div style={{
              fontSize: '18px',
              color: '#fff',
              opacity: 0.9,
              marginBottom: '8px'
            }}>
              {experiment === 'quantum' ? 'Quantum entanglement protocol achieved' :
               experiment === 'particle' ? 'Particle fusion reaction stabilized' :
               'Dimensional bridge successfully opened'}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#CBD5E1',
              opacity: 0.8
            }}>
              Revolutionary discovery recorded in laboratory archives
            </div>
          </div>
          
          {/* Scientific Data Particles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                background: experiment === 'quantum' ? '#a78bfa' : experiment === 'particle' ? '#fca5a5' : '#6ee7b7',
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-120px)`,
                animation: `dataParticle${i % 4} 4s ease-in-out infinite`,
                filter: `drop-shadow(0 0 6px ${experiment === 'quantum' ? 'rgba(139, 92, 246, 0.8)' : experiment === 'particle' ? 'rgba(248, 113, 113, 0.8)' : 'rgba(52, 211, 153, 0.8)'})`
              }}
            />
          ))}
        </div>
      )}

      {/* Experiment-Specific Atmospheric Effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        opacity: calibrationPhase ? 0.7 : 0.4,
        transition: 'opacity 1s ease'
      }}>
        {experiment === 'quantum' && (
          <>
            {/* Quantum wave effects */}
            <div style={{
              position: 'absolute',
              top: '20%',
              left: 0,
              right: 0,
              height: '60px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(124, 58, 237, 0.1) 25%, rgba(139, 92, 246, 0.15) 50%, rgba(124, 58, 237, 0.1) 75%, transparent 100%)',
              animation: 'quantumWave 6s ease-in-out infinite'
            }} />
            <div style={{
              position: 'absolute',
              top: '60%',
              left: 0,
              right: 0,
              height: '40px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.08) 30%, rgba(167, 139, 250, 0.12) 70%, transparent 100%)',
              animation: 'quantumWave 8s ease-in-out infinite reverse'
            }} />
          </>
        )}
        
        {experiment === 'particle' && (
          <>
            {/* Particle collision effects */}
            <div style={{
              position: 'absolute',
              top: '25%',
              left: '10%',
              width: '80%',
              height: '50%',
              background: 'radial-gradient(ellipse, rgba(220, 38, 38, 0.1) 0%, rgba(248, 113, 113, 0.15) 30%, transparent 60%)',
              borderRadius: '50%',
              animation: 'particleCollision 5s linear infinite'
            }} />
            <div style={{
              position: 'absolute',
              top: '40%',
              right: '5%',
              width: '60%',
              height: '20%',
              background: 'linear-gradient(45deg, rgba(248, 113, 113, 0.08) 0%, rgba(220, 38, 38, 0.12) 50%, transparent 100%)',
              borderRadius: '50%',
              animation: 'particleCollision 7s linear infinite reverse'
            }} />
          </>
        )}
        
        {experiment === 'dimension' && (
          <>
            {/* Dimensional rift effects */}
            <div style={{
              position: 'absolute',
              top: '30%',
              left: '20%',
              width: '60px',
              height: '40%',
              background: 'linear-gradient(0deg, transparent 0%, rgba(5, 150, 105, 0.1) 20%, rgba(52, 211, 153, 0.2) 50%, rgba(5, 150, 105, 0.1) 80%, transparent 100%)',
              borderRadius: '50%',
              animation: 'dimensionalRift 10s ease-in-out infinite'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '25%',
              right: '25%',
              width: '40px',
              height: '30%',
              background: 'linear-gradient(0deg, transparent 0%, rgba(52, 211, 153, 0.12) 30%, rgba(110, 231, 183, 0.18) 60%, transparent 100%)',
              borderRadius: '50%',
              animation: 'dimensionalRift 12s ease-in-out infinite reverse'
            }} />
          </>
        )}
      </div>

      <style>
        {`
          @keyframes labPanelPulse {
            0%, 100% { opacity: 0.95; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.01); }
          }
          @keyframes gridShift {
            0% { backgroundPosition: 0 0; }
            100% { backgroundPosition: 20px 20px; }
          }
          @keyframes experimentRotate {
            0% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(90deg) scale(1.05); }
            50% { transform: rotate(180deg) scale(1); }
            75% { transform: rotate(270deg) scale(1.05); }
            100% { transform: rotate(360deg) scale(1); }
          }
          @keyframes energyFlow {
            0% { filter: brightness(1); }
            100% { filter: brightness(1.3); }
          }
          @keyframes instabilityFlicker {
            0% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          @keyframes ledBlink {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          @keyframes energyBeam {
            0%, 100% { opacity: 0.4; transform: translateX(-50%) scaleY(1); }
            50% { opacity: 0.8; transform: translateX(-50%) scaleY(1.1); }
          }
          @keyframes breakthroughReveal {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes discoveryFloat {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-8px) scale(1.02); }
          }
          @keyframes breakthroughGlow {
            0% { filter: drop-shadow(0 0 40px currentColor) brightness(1); }
            100% { filter: drop-shadow(0 0 60px currentColor) brightness(1.4); }
          }
          @keyframes dataParticle0 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(0deg) translateY(-120px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(90deg) translateY(-180px) scale(1); }
          }
          @keyframes dataParticle1 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(30deg) translateY(-120px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(120deg) translateY(-180px) scale(1); }
          }
          @keyframes dataParticle2 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(60deg) translateY(-120px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(150deg) translateY(-180px) scale(1); }
          }
          @keyframes dataParticle3 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(90deg) translateY(-120px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(180deg) translateY(-180px) scale(1); }
          }
          @keyframes quantumWave {
            0%, 100% { transform: translateX(-30px); opacity: 0.4; }
            50% { transform: translateX(30px); opacity: 0.7; }
          }
          @keyframes particleCollision {
            0% { transform: rotate(0deg) scale(1); opacity: 0.3; }
            50% { transform: rotate(180deg) scale(1.2); opacity: 0.6; }
            100% { transform: rotate(360deg) scale(1); opacity: 0.3; }
          }
          @keyframes dimensionalRift {
            0%, 100% { transform: scaleY(1) rotate(0deg); opacity: 0.4; }
            33% { transform: scaleY(1.3) rotate(120deg); opacity: 0.7; }
            66% { transform: scaleY(0.7) rotate(240deg); opacity: 0.5; }
          }
        `}
      </style>
    </>
  )
}

export default QuantumLabOverlays
