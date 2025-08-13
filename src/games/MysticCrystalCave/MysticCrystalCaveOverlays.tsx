import React from 'react'

interface MysticCrystalCaveOverlaysProps {
  exploringPhase: boolean
  currentChamber: number
  foundCrystal: boolean
  win: boolean
  path: 'crystal' | 'shadow' | 'light'
  magicEnergy: number
}

export default function MysticCrystalCaveOverlays({
  exploringPhase,
  currentChamber,
  foundCrystal,
  win,
  path,
  magicEnergy
}: MysticCrystalCaveOverlaysProps) {
  return (
    <>
      {/* Magic Energy Display */}
      {exploringPhase && (
        <div style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '16px',
          padding: '20px',
          border: '2px solid rgba(147, 51, 234, 0.6)',
          backdropFilter: 'blur(10px)',
          minWidth: '200px',
          zIndex: 20
        }}>
          <div style={{
            color: '#a855f7',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            MAGIC DETECTOR
          </div>
          
          {/* Energy Orb */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `radial-gradient(circle, 
              rgba(168, 85, 247, 0.8) 0%, 
              rgba(147, 51, 234, 0.6) 30%, 
              rgba(107, 33, 168, 0.4) 60%, 
              rgba(0, 0, 0, 0.8) 100%)`,
            border: '2px solid rgba(168, 85, 247, 0.4)',
            position: 'relative',
            margin: '0 auto 16px auto',
            animation: 'energyPulse 2s ease-in-out infinite'
          }}>
            {/* Energy rings */}
            {[40, 60, 80].map((size) => (
              <div
                key={size}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: `${size}%`,
                  height: `${size}%`,
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: `energyRing ${2 + size * 0.02}s linear infinite`
                }}
              />
            ))}
            
            {/* Central crystal */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '24px',
              filter: `drop-shadow(0 0 ${magicEnergy * 0.3}px rgba(168, 85, 247, 0.8))`,
              animation: 'crystalSpin 3s linear infinite'
            }}>
              {path === 'crystal' && '💎'}
              {path === 'shadow' && '🌑'}
              {path === 'light' && '✨'}
            </div>
            
            {/* Energy level indicator */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${magicEnergy}%`,
              background: `linear-gradient(180deg, 
                transparent 0%, 
                rgba(168, 85, 247, 0.3) 50%, 
                rgba(168, 85, 247, 0.6) 100%)`,
              borderRadius: '0 0 58px 58px',
              transition: 'height 1s ease-out'
            }} />
          </div>
          
          <div style={{
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            {magicEnergy.toFixed(0)}%
          </div>
          
          <div style={{
            color: '#9ca3af',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            MAGIC ENERGY
          </div>
          
          {/* Path-specific indicators */}
          <div style={{
            marginTop: '12px',
            padding: '8px',
            background: `rgba(${path === 'crystal' ? '168, 85, 247' : path === 'shadow' ? '0, 0, 0' : '255, 255, 255'}, 0.1)`,
            borderRadius: '6px',
            border: `1px solid rgba(${path === 'crystal' ? '168, 85, 247' : path === 'shadow' ? '75, 85, 99' : '248, 250, 252'}, 0.3)`
          }}>
            <div style={{
              color: path === 'crystal' ? '#a855f7' : path === 'shadow' ? '#6b7280' : '#f8fafc',
              fontSize: '10px',
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              {path === 'crystal' && 'CRYSTAL RESONANCE'}
              {path === 'shadow' && 'SHADOW ALIGNMENT'}
              {path === 'light' && 'LIGHT PURITY'}
            </div>
            <div style={{
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700
            }}>
              {path === 'crystal' && 'BALANCED'}
              {path === 'shadow' && 'CHAOTIC'}
              {path === 'light' && 'HARMONIC'}
            </div>
          </div>
        </div>
      )}

      {/* Mystical Compass */}
      {exploringPhase && (
        <div style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '16px',
          padding: '20px',
          border: '2px solid rgba(147, 51, 234, 0.6)',
          backdropFilter: 'blur(10px)',
          minWidth: '180px',
          zIndex: 20
        }}>
          <div style={{
            color: '#a855f7',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            MYSTIC COMPASS
          </div>
          
          {/* Compass display */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, rgba(0, 0, 0, 0.8) 70%)',
            border: '2px solid rgba(168, 85, 247, 0.4)',
            position: 'relative',
            margin: '0 auto 16px auto'
          }}>
            {/* Compass needle */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '2px',
              height: '40%',
              background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.9) 0%, transparent 100%)',
              transformOrigin: 'bottom center',
              transform: `translate(-50%, -100%) rotate(${currentChamber * 72}deg)`,
              transition: 'transform 1s ease-out'
            }} />
            
            {/* Compass directions */}
            {['N', 'E', 'S', 'W'].map((direction, index) => (
              <div
                key={direction}
                style={{
                  position: 'absolute',
                  top: index === 0 ? '8px' : index === 2 ? 'auto' : '50%',
                  bottom: index === 2 ? '8px' : 'auto',
                  left: index === 3 ? '8px' : index === 1 ? 'auto' : '50%',
                  right: index === 1 ? '8px' : 'auto',
                  transform: (index === 0 || index === 2) ? 'translateX(-50%)' : 'translateY(-50%)',
                  color: '#a855f7',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                {direction}
              </div>
            ))}
            
            {/* Chamber markers */}
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '8px',
                  height: '8px',
                  background: index < currentChamber 
                    ? 'rgba(168, 85, 247, 0.8)' 
                    : 'rgba(168, 85, 247, 0.3)',
                  borderRadius: '50%',
                  transform: `translate(-50%, -50%) rotate(${index * 72}deg) translateY(-35px)`,
                  transition: 'background 0.5s ease'
                }}
              />
            ))}
            
            {foundCrystal && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '20px',
                animation: 'crystalDiscovered 2s ease-out infinite'
              }}>
                💎
              </div>
            )}
          </div>
          
          <div style={{
            color: '#9ca3af',
            fontSize: '12px',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            CHAMBER {currentChamber} / 5
          </div>
          
          <div style={{
            color: foundCrystal ? '#a855f7' : '#ef4444',
            fontSize: '11px',
            fontWeight: 600,
            textAlign: 'center',
            padding: '4px 8px',
            borderRadius: '4px',
            background: foundCrystal 
              ? 'rgba(168, 85, 247, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${foundCrystal ? 'rgba(168, 85, 247, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            {foundCrystal ? 'CRYSTAL LOCATED!' : 'SEARCHING...'}
          </div>
        </div>
      )}

      {/* Exploration Status Messages */}
      {exploringPhase && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '12px',
          padding: '12px 24px',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          backdropFilter: 'blur(10px)',
          zIndex: 25
        }}>
          <div style={{
            color: '#a855f7',
            fontSize: '14px',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            {currentChamber === 1 && 'Entering the crystal formations...'}
            {currentChamber === 2 && 'Magic energy is growing stronger...'}
            {currentChamber === 3 && 'Ancient runes begin to glow...'}
            {currentChamber === 4 && 'The air crackles with mystical power...'}
            {currentChamber === 5 && 'Approaching the heart of the cave...'}
          </div>
        </div>
      )}

      {/* Mystical Energy Particles */}
      {exploringPhase && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 5
        }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${10 + i * 7}%`,
                bottom: '-10px',
                width: `${3 + Math.random() * 6}px`,
                height: `${3 + Math.random() * 6}px`,
                background: `rgba(${path === 'crystal' ? '168, 85, 247' : path === 'shadow' ? '75, 85, 99' : '248, 250, 252'}, 0.7)`,
                borderRadius: '50%',
                animation: `mysticalRise ${4 + Math.random() * 3}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Crystal Discovery Effect */}
      {foundCrystal && (
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
            animation: 'crystalMajesty 3s ease-out',
            textShadow: '0 0 40px rgba(168, 85, 247, 0.9)'
          }}>
            💎
          </div>
          
          {/* Magical aura effects */}
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '6px',
                height: '6px',
                background: `rgba(${path === 'crystal' ? '192, 132, 252' : path === 'shadow' ? '107, 114, 128' : '248, 250, 252'}, 0.8)`,
                borderRadius: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 22.5}deg) translateY(-80px)`,
                animation: `magicalSparkle 2s ease-out infinite`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      <style>
        {`
          @keyframes energyPulse {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); 
              transform: scale(1);
            }
            50% { 
              box-shadow: 0 0 30px rgba(168, 85, 247, 0.8); 
              transform: scale(1.05);
            }
          }
          
          @keyframes energyRing {
            0% { 
              opacity: 0.8; 
              transform: translate(-50%, -50%) scale(1); 
            }
            100% { 
              opacity: 0; 
              transform: translate(-50%, -50%) scale(1.5); 
            }
          }
          
          @keyframes crystalSpin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
          
          @keyframes crystalDiscovered {
            0%, 100% { 
              transform: translate(-50%, -50%) scale(1); 
              filter: brightness(1);
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.3); 
              filter: brightness(1.5);
            }
          }
          
          @keyframes mysticalRise {
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
          
          @keyframes crystalMajesty {
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
          
          @keyframes magicalSparkle {
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
