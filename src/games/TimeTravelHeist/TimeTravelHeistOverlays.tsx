import React from 'react'
import { SyncedWinLossOverlay } from '../../components/SyncedWinLossOverlay';

interface TimeTravelHeistOverlaysProps {
  heistPhase: boolean
  currentLocation: number
  treasureFound: boolean
  win: boolean
  period: 'medieval' | 'modern' | 'future'
  timelineProgress: number
  result?: any;
  currentBalance: number;
  wager: number;
}

export default function TimeTravelHeistOverlays({
  heistPhase,
  currentLocation,
  treasureFound,
  win,
  period,
  timelineProgress,
  result,
  currentBalance,
  wager
}: TimeTravelHeistOverlaysProps) {
  // Custom win levels for TimeTravelHeist
  const timeTravelHeistWinLevels = [
    { 
      minMultiplier: 1, 
      maxMultiplier: 3, 
      intensity: 1,
      label: "Heist Success!",
      emoji: "⏰",
      className: "win-small"
    },
    { 
      minMultiplier: 3, 
      maxMultiplier: 10, 
      intensity: 2,
      label: "Time Vault!",
      emoji: "🚀",
      className: "win-medium"
    },
    { 
      minMultiplier: 10, 
      maxMultiplier: 1000, 
      intensity: 3,
      label: "PARADOX JACKPOT!",
      emoji: "🌌",
      className: "win-mega"
    }
  ];

  return (
    <>
      {/* Synced Win/Loss Overlay */}
      <SyncedWinLossOverlay
        result={result}
        currentBalance={currentBalance}
        animationPhase={treasureFound && win ? 'celebrating' : 'idle'}
        triggerPhase="celebrating"
        wager={wager}
        winLevels={timeTravelHeistWinLevels}
      />

      {/* Time Machine Console */}
      {heistPhase && (
        <div style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.95)',
          borderRadius: '16px',
          padding: '20px',
          border: '2px solid rgba(100, 116, 139, 0.6)',
          backdropFilter: 'blur(10px)',
          minWidth: '220px',
          zIndex: 20,
          fontFamily: 'monospace'
        }}>
          <div style={{
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            TIME MACHINE CONSOLE
          </div>
          
          {/* Timeline Display */}
          <div style={{
            width: '100%',
            height: '120px',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
            borderRadius: '8px',
            border: '1px solid rgba(100, 116, 139, 0.3)',
            position: 'relative',
            marginBottom: '12px',
            overflow: 'hidden'
          }}>
            {/* Time stream */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${timelineProgress}%`,
              background: `linear-gradient(180deg, 
                transparent 0%, 
                rgba(${period === 'medieval' ? '139, 69, 19' : period === 'modern' ? '59, 130, 246' : '168, 85, 247'}, 0.6) 100%)`,
              borderRadius: '0 0 8px 8px',
              transition: 'height 1s ease-out'
            }} />
            
            {/* Time traveler icon */}
            <div style={{
              position: 'absolute',
              left: '50%',
              bottom: `${timelineProgress}%`,
              transform: 'translateX(-50%)',
              fontSize: '20px',
              transition: 'bottom 1s ease-out',
              filter: 'drop-shadow(0 0 8px rgba(100, 116, 139, 0.8))'
            }}>
              🕵️
            </div>
            
            {/* Era markers */}
            {[25, 50, 75, 100].map((marker, index) => (
              <div
                key={marker}
                style={{
                  position: 'absolute',
                  right: '4px',
                  bottom: `${marker}%`,
                  color: '#64748b',
                  fontSize: '10px',
                  fontWeight: 500
                }}
              >
                {['1000AD', '1500AD', '2000AD', '3000AD'][index]}
              </div>
            ))}
          </div>
          
          <div style={{
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            {period === 'medieval' ? '🏰 MEDIEVAL ERA' :
             period === 'modern' ? '🏙️ MODERN ERA' :
             '🚀 FUTURE ERA'}
          </div>
          
          <div style={{
            color: '#9ca3af',
            fontSize: '12px',
            textAlign: 'center',
            marginBottom: '12px'
          }}>
            LOCATION {currentLocation} / 5
          </div>
          
          {/* Security Level */}
          <div style={{
            padding: '8px',
            background: `rgba(${period === 'medieval' ? '139, 69, 19' : period === 'modern' ? '59, 130, 246' : '168, 85, 247'}, 0.1)`,
            borderRadius: '6px',
            border: `1px solid rgba(${period === 'medieval' ? '139, 69, 19' : period === 'modern' ? '59, 130, 246' : '168, 85, 247'}, 0.3)`
          }}>
            <div style={{
              color: period === 'medieval' ? '#d97706' : period === 'modern' ? '#3b82f6' : '#a855f7',
              fontSize: '10px',
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              SECURITY LEVEL
            </div>
            <div style={{
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700
            }}>
              {period === 'medieval' && 'GUARDS & LOCKS'}
              {period === 'modern' && 'ALARMS & CAMERAS'}
              {period === 'future' && 'QUANTUM SHIELDS'}
            </div>
          </div>
          
          {/* Stealth Meter */}
          <div style={{
            marginTop: '12px',
            padding: '8px',
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            <div style={{
              color: '#22c55e',
              fontSize: '10px',
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              STEALTH STATUS
            </div>
            <div style={{
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700
            }}>
              {treasureFound ? 'MISSION SUCCESS' : 'INFILTRATING...'}
            </div>
          </div>
        </div>
      )}

      {/* Temporal Scanner */}
      {heistPhase && (
        <div style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.95)',
          borderRadius: '16px',
          padding: '20px',
          border: '2px solid rgba(100, 116, 139, 0.6)',
          backdropFilter: 'blur(10px)',
          minWidth: '180px',
          zIndex: 20
        }}>
          <div style={{
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            TEMPORAL SCANNER
          </div>
          
          {/* Scanner display */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(100, 116, 139, 0.2) 0%, rgba(0, 0, 0, 0.8) 70%)',
            border: '2px solid rgba(100, 116, 139, 0.4)',
            position: 'relative',
            margin: '0 auto 16px auto'
          }}>
            {/* Scanner sweep line */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '2px',
              height: '50%',
              background: 'linear-gradient(180deg, rgba(100, 116, 139, 0.9) 0%, transparent 100%)',
              transformOrigin: 'top center',
              transform: 'translate(-50%, -100%) rotate(0deg)',
              animation: 'temporalSweep 2s linear infinite'
            }} />
            
            {/* Time rings */}
            {[30, 60, 90].map((size) => (
              <div
                key={size}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: `${size}%`,
                  height: `${size}%`,
                  border: '1px solid rgba(100, 116, 139, 0.2)',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
            
            {/* Era-specific objects */}
            {currentLocation > 1 && (
              <>
                {period === 'medieval' && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: '25%',
                      left: '30%',
                      width: '6px',
                      height: '6px',
                      background: 'rgba(139, 69, 19, 0.8)',
                      borderRadius: '50%',
                      animation: 'temporalBlip 2s ease-in-out infinite'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-15px',
                        left: '-10px',
                        fontSize: '8px',
                        color: '#d97706'
                      }}>🏰</div>
                    </div>
                    
                    <div style={{
                      position: 'absolute',
                      top: '60%',
                      right: '25%',
                      width: '8px',
                      height: '8px',
                      background: 'rgba(139, 69, 19, 0.8)',
                      borderRadius: '50%',
                      animation: 'temporalBlip 2.5s ease-in-out infinite'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-15px',
                        left: '-10px',
                        fontSize: '8px',
                        color: '#d97706'
                      }}>⚔️</div>
                    </div>
                  </>
                )}
                
                {period === 'modern' && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: '25%',
                      left: '30%',
                      width: '6px',
                      height: '6px',
                      background: 'rgba(59, 130, 246, 0.8)',
                      borderRadius: '50%',
                      animation: 'temporalBlip 2s ease-in-out infinite'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-15px',
                        left: '-10px',
                        fontSize: '8px',
                        color: '#3b82f6'
                      }}>🏢</div>
                    </div>
                    
                    <div style={{
                      position: 'absolute',
                      top: '60%',
                      right: '25%',
                      width: '8px',
                      height: '8px',
                      background: 'rgba(59, 130, 246, 0.8)',
                      borderRadius: '50%',
                      animation: 'temporalBlip 2.5s ease-in-out infinite'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-15px',
                        left: '-10px',
                        fontSize: '8px',
                        color: '#3b82f6'
                      }}>📱</div>
                    </div>
                  </>
                )}
                
                {period === 'future' && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: '25%',
                      left: '30%',
                      width: '6px',
                      height: '6px',
                      background: 'rgba(168, 85, 247, 0.8)',
                      borderRadius: '50%',
                      animation: 'temporalBlip 2s ease-in-out infinite'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-15px',
                        left: '-10px',
                        fontSize: '8px',
                        color: '#a855f7'
                      }}>🛸</div>
                    </div>
                    
                    <div style={{
                      position: 'absolute',
                      top: '60%',
                      right: '25%',
                      width: '8px',
                      height: '8px',
                      background: 'rgba(168, 85, 247, 0.8)',
                      borderRadius: '50%',
                      animation: 'temporalBlip 2.5s ease-in-out infinite'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-15px',
                        left: '-10px',
                        fontSize: '8px',
                        color: '#a855f7'
                      }}>⚡</div>
                    </div>
                  </>
                )}
              </>
            )}
            
            {treasureFound && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '12px',
                height: '12px',
                background: 'radial-gradient(circle, rgba(251, 191, 36, 0.9) 0%, rgba(245, 158, 11, 0.6) 100%)',
                borderRadius: '50%',
                animation: 'treasureGlow 1s ease-in-out infinite alternate',
                boxShadow: '0 0 15px rgba(251, 191, 36, 0.8)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '-15px',
                  fontSize: '12px'
                }}>💎</div>
              </div>
            )}
          </div>
          
          <div style={{
            color: '#9ca3af',
            fontSize: '12px',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            SCANNING TIMELINE...
          </div>
          
          <div style={{
            color: treasureFound ? '#fbbf24' : '#ef4444',
            fontSize: '11px',
            fontWeight: 600,
            textAlign: 'center',
            padding: '4px 8px',
            borderRadius: '4px',
            background: treasureFound 
              ? 'rgba(251, 191, 36, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${treasureFound ? 'rgba(251, 191, 36, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            {treasureFound ? 'TREASURE LOCATED!' : 'TARGET SEARCHING...'}
          </div>
        </div>
      )}

      {/* Heist Status Messages */}
      {heistPhase && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.95)',
          borderRadius: '12px',
          padding: '12px 24px',
          border: '1px solid rgba(100, 116, 139, 0.4)',
          backdropFilter: 'blur(10px)',
          zIndex: 25
        }}>
          <div style={{
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            {currentLocation === 1 && `Materializing in ${period} era...`}
            {currentLocation === 2 && 'Bypassing security systems...'}
            {currentLocation === 3 && 'Infiltrating main vault...'}
            {currentLocation === 4 && 'Searching for the legendary treasure...'}
            {currentLocation === 5 && 'Final security breach in progress...'}
          </div>
        </div>
      )}

      {/* Temporal Energy Particles */}
      {heistPhase && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 5
        }}>
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${10 + i * 8}%`,
                bottom: '-10px',
                width: `${3 + Math.random() * 5}px`,
                height: `${3 + Math.random() * 5}px`,
                background: `rgba(${period === 'medieval' ? '139, 69, 19' : period === 'modern' ? '59, 130, 246' : '168, 85, 247'}, 0.7)`,
                borderRadius: '50%',
                animation: `temporalRise ${4 + Math.random() * 3}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Treasure Discovery Effect */}
      {treasureFound && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 30,
          pointerEvents: 'none'
        }}>
          <div style={{
            fontSize: '100px',
            animation: 'treasureHeist 3s ease-out',
            textShadow: '0 0 40px rgba(251, 191, 36, 0.9)'
          }}>
            💎
          </div>
          
          {/* Time ripple effects */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '6px',
                height: '6px',
                background: `rgba(${period === 'medieval' ? '139, 69, 19' : period === 'modern' ? '59, 130, 246' : '168, 85, 247'}, 0.8)`,
                borderRadius: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-80px)`,
                animation: `timeRipple 2s ease-out infinite`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      <style>
        {`
          @keyframes temporalSweep {
            0% { transform: translate(-50%, -100%) rotate(0deg); }
            100% { transform: translate(-50%, -100%) rotate(360deg); }
          }
          
          @keyframes temporalBlip {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          
          @keyframes treasureGlow {
            0% { box-shadow: 0 0 15px rgba(251, 191, 36, 0.6); }
            100% { box-shadow: 0 0 25px rgba(251, 191, 36, 1); }
          }
          
          @keyframes temporalRise {
            0% {
              bottom: -10px;
              opacity: 0.8;
              transform: translateX(0) rotate(0deg);
            }
            50% {
              opacity: 1;
              transform: translateX(${Math.random() * 60 - 30}px) rotate(180deg);
            }
            100% {
              bottom: 100vh;
              opacity: 0;
              transform: translateX(${Math.random() * 100 - 50}px) rotate(360deg);
            }
          }
          
          @keyframes treasureHeist {
            0% {
              transform: translate(-50%, -50%) scale(0) rotate(0deg);
              opacity: 0;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.3) rotate(180deg);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1) rotate(360deg);
              opacity: 1;
            }
          }
          
          @keyframes timeRipple {
            0%, 100% {
              opacity: 0;
              transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg) translateY(-80px) scale(0);
            }
            50% {
              opacity: 1;
              transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg) translateY(-120px) scale(1);
            }
          }
        `}
      </style>
    </>
  )
}
