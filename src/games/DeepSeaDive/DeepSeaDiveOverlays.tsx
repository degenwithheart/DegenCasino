import React from 'react'
import { SyncedWinLossOverlay } from '../../components/SyncedWinLossOverlay';

interface DeepSeaDiveOverlaysProps {
  divingPhase: boolean
  currentDepth: number
  foundPearl: boolean
  win: boolean
  choice: 'shallow' | 'deep' | 'abyss'
  submarineDepth: number
  result?: any;
  currentBalance: number;
  wager: number;
}

export default function DeepSeaDiveOverlays({
  divingPhase,
  currentDepth,
  foundPearl,
  win,
  choice,
  submarineDepth,
  result,
  currentBalance,
  wager
}: DeepSeaDiveOverlaysProps) {
  // Custom win levels for DeepSeaDive
  const deepSeaDiveWinLevels = [
    { 
      minMultiplier: 1, 
      maxMultiplier: 3, 
      intensity: 1,
      label: "Pearl Found!",
      emoji: "🦪",
      className: "win-small"
    },
    { 
      minMultiplier: 3, 
      maxMultiplier: 10, 
      intensity: 2,
      label: "Deep Treasure!",
      emoji: "🐠",
      className: "win-medium"
    },
    { 
      minMultiplier: 10, 
      maxMultiplier: 1000, 
      intensity: 3,
      label: "ABYSSAL RICHES!",
      emoji: "🌊",
      className: "win-mega"
    }
  ];

  return (
    <>
      {/* Synced Win/Loss Overlay */}
      <SyncedWinLossOverlay
        result={result}
        currentBalance={currentBalance}
        animationPhase={foundPearl && win ? 'celebrating' : 'idle'}
        triggerPhase="celebrating"
        wager={wager}
        winLevels={deepSeaDiveWinLevels}
      />

      {/* Diving Depth Indicator */}
      {divingPhase && (
        <div style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '16px',
          padding: '20px',
          border: '2px solid rgba(14, 165, 233, 0.6)',
          backdropFilter: 'blur(10px)',
          minWidth: '200px',
          zIndex: 20
        }}>
          <div style={{
            color: '#38bdf8',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            DIVE COMPUTER
          </div>
          
          {/* Depth Meter */}
          <div style={{
            width: '100%',
            height: '120px',
            background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.2) 0%, rgba(30, 64, 175, 0.4) 100%)',
            borderRadius: '8px',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            position: 'relative',
            marginBottom: '12px'
          }}>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${submarineDepth}%`,
              background: 'linear-gradient(180deg, transparent 0%, rgba(56, 189, 248, 0.6) 100%)',
              borderRadius: '0 0 8px 8px',
              transition: 'height 1s ease-out'
            }} />
            
            {/* Submarine icon */}
            <div style={{
              position: 'absolute',
              left: '50%',
              bottom: `${submarineDepth}%`,
              transform: 'translateX(-50%)',
              fontSize: '20px',
              transition: 'bottom 1s ease-out',
              filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.8))'
            }}>
              🚤
            </div>
            
            {/* Depth markers */}
            {[25, 50, 75, 100].map((marker) => (
              <div
                key={marker}
                style={{
                  position: 'absolute',
                  right: '4px',
                  bottom: `${marker}%`,
                  color: '#9ca3af',
                  fontSize: '10px',
                  fontWeight: 500
                }}
              >
                {marker * (choice === 'shallow' ? 5 : choice === 'deep' ? 8 : 12)}m
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
            {currentDepth * (choice === 'shallow' ? 100 : choice === 'deep' ? 200 : 500)}m
          </div>
          
          <div style={{
            color: '#9ca3af',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            DEPTH LEVEL {currentDepth}
          </div>
          
          {/* Pressure indicator */}
          <div style={{
            marginTop: '12px',
            padding: '8px',
            background: 'rgba(14, 165, 233, 0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}>
            <div style={{
              color: '#38bdf8',
              fontSize: '10px',
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              PRESSURE
            </div>
            <div style={{
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700
            }}>
              {(currentDepth * (choice === 'shallow' ? 0.1 : choice === 'deep' ? 0.2 : 0.5)).toFixed(1)} ATM
            </div>
          </div>
        </div>
      )}

      {/* Ocean Floor Scanner */}
      {divingPhase && (
        <div style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '16px',
          padding: '20px',
          border: '2px solid rgba(14, 165, 233, 0.6)',
          backdropFilter: 'blur(10px)',
          minWidth: '180px',
          zIndex: 20
        }}>
          <div style={{
            color: '#38bdf8',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            SONAR SCAN
          </div>
          
          {/* Sonar display */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, rgba(0, 0, 0, 0.8) 70%)',
            border: '2px solid rgba(56, 189, 248, 0.3)',
            position: 'relative',
            margin: '0 auto 16px auto'
          }}>
            {/* Sonar sweep line */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '2px',
              height: '50%',
              background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.8) 0%, transparent 100%)',
              transformOrigin: 'top center',
              transform: 'translate(-50%, -100%) rotate(0deg)',
              animation: 'sonarSweep 3s linear infinite'
            }} />
            
            {/* Depth rings */}
            {[30, 60, 90].map((size) => (
              <div
                key={size}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: `${size}%`,
                  height: `${size}%`,
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
            
            {/* Sea floor objects */}
            {currentDepth > 1 && (
              <>
                <div style={{
                  position: 'absolute',
                  top: '25%',
                  left: '30%',
                  width: '6px',
                  height: '6px',
                  background: 'rgba(168, 85, 247, 0.8)',
                  borderRadius: '50%',
                  animation: 'sonarBlip 2s ease-in-out infinite'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '-10px',
                    fontSize: '8px',
                    color: '#a855f7'
                  }}>🪨</div>
                </div>
                
                <div style={{
                  position: 'absolute',
                  top: '60%',
                  right: '25%',
                  width: '8px',
                  height: '8px',
                  background: 'rgba(34, 197, 94, 0.8)',
                  borderRadius: '50%',
                  animation: 'sonarBlip 2.5s ease-in-out infinite'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '-10px',
                    fontSize: '8px',
                    color: '#22c55e'
                  }}>🌿</div>
                </div>
              </>
            )}
            
            {foundPearl && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '12px',
                height: '12px',
                background: 'radial-gradient(circle, rgba(248, 250, 252, 0.9) 0%, rgba(226, 232, 240, 0.6) 100%)',
                borderRadius: '50%',
                animation: 'pearlGlow 1s ease-in-out infinite alternate',
                boxShadow: '0 0 15px rgba(248, 250, 252, 0.8)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '-15px',
                  fontSize: '12px'
                }}>🦪</div>
              </div>
            )}
          </div>
          
          <div style={{
            color: '#9ca3af',
            fontSize: '12px',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            SCANNING...
          </div>
          
          <div style={{
            color: foundPearl ? '#f8fafc' : '#ef4444',
            fontSize: '11px',
            fontWeight: 600,
            textAlign: 'center',
            padding: '4px 8px',
            borderRadius: '4px',
            background: foundPearl 
              ? 'rgba(248, 250, 252, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${foundPearl ? 'rgba(248, 250, 252, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
          }}>
            {foundPearl ? 'PEARL DETECTED!' : 'NO TREASURES FOUND'}
          </div>
        </div>
      )}

      {/* Diving Status Messages */}
      {divingPhase && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '12px',
          padding: '12px 24px',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          backdropFilter: 'blur(10px)',
          zIndex: 25
        }}>
          <div style={{
            color: '#38bdf8',
            fontSize: '14px',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            {currentDepth === 1 && 'Descending through the sunlight zone...'}
            {currentDepth === 2 && 'Entering the twilight zone...'}
            {currentDepth === 3 && 'Approaching the midnight zone...'}
            {currentDepth === 4 && 'Diving into the abyssal depths...'}
            {currentDepth === 5 && 'Exploring the hadal zone...'}
          </div>
        </div>
      )}

      {/* Bubble Effects */}
      {divingPhase && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 5
        }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${10 + i * 10}%`,
                bottom: '-20px',
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                background: 'rgba(56, 189, 248, 0.3)',
                borderRadius: '50%',
                animation: `bubble ${3 + Math.random() * 4}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Pearl Discovery Effect */}
      {foundPearl && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 30,
          pointerEvents: 'none'
        }}>
          <div style={{
            fontSize: '80px',
            animation: 'pearlDiscovery 2s ease-out',
            textShadow: '0 0 30px rgba(248, 250, 252, 0.8)'
          }}>
            💎
          </div>
          
          {/* Sparkle effects around the pearl */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '4px',
                height: '4px',
                background: '#f8fafc',
                borderRadius: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-60px)`,
                animation: `sparkle 1.5s ease-out infinite`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      <style>
        {`
          @keyframes sonarSweep {
            0% { transform: translate(-50%, -100%) rotate(0deg); }
            100% { transform: translate(-50%, -100%) rotate(360deg); }
          }
          
          @keyframes sonarBlip {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          
          @keyframes pearlGlow {
            0% { box-shadow: 0 0 15px rgba(248, 250, 252, 0.6); }
            100% { box-shadow: 0 0 25px rgba(248, 250, 252, 1); }
          }
          
          @keyframes bubble {
            0% {
              bottom: -20px;
              opacity: 0.7;
              transform: translateX(0);
            }
            50% {
              opacity: 1;
              transform: translateX(${Math.random() * 40 - 20}px);
            }
            100% {
              bottom: 100vh;
              opacity: 0;
              transform: translateX(${Math.random() * 60 - 30}px);
            }
          }
          
          @keyframes pearlDiscovery {
            0% {
              transform: translate(-50%, -50%) scale(0) rotate(0deg);
              opacity: 0;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.2) rotate(180deg);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1) rotate(360deg);
              opacity: 1;
            }
          }
          
          @keyframes sparkle {
            0%, 100% {
              opacity: 0;
              transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg) translateY(-60px) scale(0);
            }
            50% {
              opacity: 1;
              transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg) translateY(-80px) scale(1);
            }
          }
        `}
      </style>
    </>
  )
}
