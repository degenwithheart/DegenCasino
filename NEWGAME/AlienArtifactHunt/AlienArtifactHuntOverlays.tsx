import React from 'react'

interface AlienArtifactHuntOverlaysProps {
  excavationPhase: boolean
  currentSite: number
  artifactFound: boolean
  win: boolean
  planet: 'earth' | 'gas' | 'crystal'
  atmosphereLevel: number
}

const AlienArtifactHuntOverlays: React.FC<AlienArtifactHuntOverlaysProps> = ({
  excavationPhase,
  currentSite,
  artifactFound,
  win,
  planet,
  atmosphereLevel
}) => {
  if (!excavationPhase && !artifactFound && !win) return null

  return (
    <>
      {/* Excavation Scanner Interface */}
      {excavationPhase && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 100
        }}>
          {/* Scanner HUD */}
          <div style={{
            width: '400px',
            height: '300px',
            border: `2px solid ${planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399'}`,
            borderRadius: '20px',
            background: `linear-gradient(135deg, 
              ${planet === 'earth' ? 'rgba(30, 64, 175, 0.1)' : planet === 'gas' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(5, 150, 105, 0.1)'} 0%, 
              rgba(0, 0, 0, 0.8) 50%, 
              ${planet === 'earth' ? 'rgba(30, 58, 138, 0.1)' : planet === 'gas' ? 'rgba(180, 83, 9, 0.1)' : 'rgba(16, 185, 129, 0.1)'} 100%)`,
            backdropFilter: 'blur(10px)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            animation: 'scannerPulse 2s ease-in-out infinite'
          }}>
            {/* Scanner Grid */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                linear-gradient(90deg, transparent 0%, ${planet === 'earth' ? 'rgba(60, 165, 250, 0.1)' : planet === 'gas' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(52, 211, 153, 0.1)'} 50%, transparent 100%),
                linear-gradient(0deg, transparent 0%, ${planet === 'earth' ? 'rgba(60, 165, 250, 0.1)' : planet === 'gas' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(52, 211, 153, 0.1)'} 50%, transparent 100%)
              `,
              backgroundSize: '40px 40px',
              opacity: 0.3,
              animation: 'gridScan 3s linear infinite'
            }} />
            
            {/* Scanner Display */}
            <div style={{
              textAlign: 'center',
              color: '#fff',
              zIndex: 2
            }}>
              <div style={{
                fontSize: '80px',
                marginBottom: '10px',
                animation: 'scannerRotate 1.5s linear infinite',
                filter: `drop-shadow(0 0 20px ${planet === 'earth' ? 'rgba(60, 165, 250, 0.8)' : planet === 'gas' ? 'rgba(251, 191, 36, 0.8)' : 'rgba(52, 211, 153, 0.8)'})`
              }}>
                📡
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 600,
                color: planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399',
                marginBottom: '8px'
              }}>
                XENOARCHAEOLOGY SCANNER
              </div>
              <div style={{
                fontSize: '14px',
                color: '#9CA3AF',
                marginBottom: '12px'
              }}>
                Excavating Site {currentSite}
              </div>
              
              {/* Atmosphere Reading */}
              <div style={{
                width: '200px',
                height: '8px',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '4px',
                border: `1px solid ${planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399'}`,
                overflow: 'hidden',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: `${atmosphereLevel}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${planet === 'earth' ? '#1e40af, #3b82f6' : planet === 'gas' ? '#d97706, #f59e0b' : '#059669, #10b981'})`,
                  transition: 'width 0.5s ease-out',
                  animation: 'atmosphereGlow 1s ease-in-out infinite alternate'
                }} />
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9CA3AF'
              }}>
                Atmospheric Density: {atmosphereLevel.toFixed(1)}%
              </div>
            </div>
            
            {/* Scanner Corners */}
            {[0, 1, 2, 3].map(corner => (
              <div
                key={corner}
                style={{
                  position: 'absolute',
                  width: '20px',
                  height: '20px',
                  border: `2px solid ${planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399'}`,
                  ...(corner === 0 && { top: '10px', left: '10px', borderRight: 'none', borderBottom: 'none' }),
                  ...(corner === 1 && { top: '10px', right: '10px', borderLeft: 'none', borderBottom: 'none' }),
                  ...(corner === 2 && { bottom: '10px', left: '10px', borderRight: 'none', borderTop: 'none' }),
                  ...(corner === 3 && { bottom: '10px', right: '10px', borderLeft: 'none', borderTop: 'none' }),
                  animation: 'cornerPulse 2s ease-in-out infinite',
                  animationDelay: `${corner * 0.5}s`
                }}
              />
            ))}
          </div>
          
          {/* Scanning Beam */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '200px',
            background: `linear-gradient(to bottom, ${planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399'}, transparent)`,
            animation: 'scanBeam 3s ease-in-out infinite',
            filter: `drop-shadow(0 0 10px ${planet === 'earth' ? 'rgba(60, 165, 250, 0.8)' : planet === 'gas' ? 'rgba(251, 191, 36, 0.8)' : 'rgba(52, 211, 153, 0.8)'})`
          }} />
        </div>
      )}

      {/* Artifact Discovery Sequence */}
      {artifactFound && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `radial-gradient(circle, ${planet === 'earth' ? 'rgba(30, 64, 175, 0.3)' : planet === 'gas' ? 'rgba(217, 119, 6, 0.3)' : 'rgba(5, 150, 105, 0.3)'} 0%, rgba(0, 0, 0, 0.8) 70%)`,
          zIndex: 200,
          animation: 'artifactDiscovery 2s ease-out'
        }}>
          <div style={{
            textAlign: 'center',
            transform: 'scale(1)',
            animation: 'artifactFloat 3s ease-in-out infinite'
          }}>
            <div style={{
              fontSize: '120px',
              marginBottom: '20px',
              filter: `drop-shadow(0 0 30px ${planet === 'earth' ? 'rgba(60, 165, 250, 1)' : planet === 'gas' ? 'rgba(251, 191, 36, 1)' : 'rgba(52, 211, 153, 1)'})`,
              animation: 'artifactGlow 2s ease-in-out infinite alternate'
            }}>
              {planet === 'earth' ? '🛸' : planet === 'gas' ? '⚡' : '💎'}
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: 800,
              color: planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399',
              marginBottom: '12px',
              textShadow: `0 0 20px ${planet === 'earth' ? 'rgba(60, 165, 250, 0.8)' : planet === 'gas' ? 'rgba(251, 191, 36, 0.8)' : 'rgba(52, 211, 153, 0.8)'}`
            }}>
              ALIEN ARTIFACT DISCOVERED!
            </div>
            <div style={{
              fontSize: '16px',
              color: '#fff',
              opacity: 0.9
            }}>
              {planet === 'earth' ? 'Ancient starship technology unearthed' :
               planet === 'gas' ? 'Plasma-energy crystal core extracted' :
               'Crystalline neural network matrix found'}
            </div>
          </div>
          
          {/* Energy Particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                background: planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399',
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-100px)`,
                animation: `energyParticle${i} 3s ease-in-out infinite`,
                filter: `drop-shadow(0 0 8px ${planet === 'earth' ? 'rgba(60, 165, 250, 0.8)' : planet === 'gas' ? 'rgba(251, 191, 36, 0.8)' : 'rgba(52, 211, 153, 0.8)'})`
              }}
            />
          ))}
        </div>
      )}

      {/* Planet-Specific Atmospheric Effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        opacity: excavationPhase ? 0.6 : 0.3,
        transition: 'opacity 1s ease'
      }}>
        {planet === 'earth' && (
          <>
            {/* Earth-like aurora effects */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: 0,
              right: 0,
              height: '100px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(30, 64, 175, 0.1) 20%, rgba(60, 165, 250, 0.2) 50%, rgba(30, 64, 175, 0.1) 80%, transparent 100%)',
              animation: 'auroraShift 8s ease-in-out infinite'
            }} />
            <div style={{
              position: 'absolute',
              top: '20%',
              left: 0,
              right: 0,
              height: '80px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(60, 165, 250, 0.1) 30%, rgba(30, 64, 175, 0.15) 70%, transparent 100%)',
              animation: 'auroraShift 6s ease-in-out infinite reverse'
            }} />
          </>
        )}
        
        {planet === 'gas' && (
          <>
            {/* Gas giant storm effects */}
            <div style={{
              position: 'absolute',
              top: '30%',
              left: '-10%',
              width: '120%',
              height: '40%',
              background: 'linear-gradient(45deg, rgba(217, 119, 6, 0.1) 0%, rgba(251, 191, 36, 0.2) 50%, rgba(217, 119, 6, 0.1) 100%)',
              borderRadius: '50%',
              animation: 'gasStorm 10s linear infinite'
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '-10%',
              width: '80%',
              height: '30%',
              background: 'linear-gradient(-45deg, rgba(251, 191, 36, 0.1) 0%, rgba(217, 119, 6, 0.15) 50%, transparent 100%)',
              borderRadius: '50%',
              animation: 'gasStorm 12s linear infinite reverse'
            }} />
          </>
        )}
        
        {planet === 'crystal' && (
          <>
            {/* Crystal world prismatic effects */}
            <div style={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: '80px',
              height: '80px',
              background: 'conic-gradient(from 0deg, rgba(5, 150, 105, 0.2), rgba(52, 211, 153, 0.3), rgba(110, 231, 183, 0.2), rgba(5, 150, 105, 0.2))',
              borderRadius: '50%',
              animation: 'crystalPrism 6s linear infinite'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '30%',
              right: '15%',
              width: '60px',
              height: '60px',
              background: 'conic-gradient(from 180deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.2), rgba(52, 211, 153, 0.2))',
              borderRadius: '50%',
              animation: 'crystalPrism 8s linear infinite reverse'
            }} />
          </>
        )}
      </div>

      <style>
        {`
          @keyframes scannerPulse {
            0%, 100% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.02); }
          }
          @keyframes gridScan {
            0% { backgroundPosition: 0 0; }
            100% { backgroundPosition: 40px 40px; }
          }
          @keyframes scannerRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes cornerPulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          @keyframes atmosphereGlow {
            0% { filter: brightness(1); }
            100% { filter: brightness(1.2); }
          }
          @keyframes scanBeam {
            0%, 100% { opacity: 0.3; transform: translateX(-50%) scaleY(1); }
            50% { opacity: 0.8; transform: translateX(-50%) scaleY(1.2); }
          }
          @keyframes artifactDiscovery {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes artifactFloat {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-10px) scale(1.05); }
          }
          @keyframes artifactGlow {
            0% { filter: drop-shadow(0 0 30px currentColor) brightness(1); }
            100% { filter: drop-shadow(0 0 50px currentColor) brightness(1.3); }
          }
          @keyframes energyParticle0 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(0deg) translateY(-100px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(45deg) translateY(-150px) scale(1); }
          }
          @keyframes energyParticle1 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(45deg) translateY(-100px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(90deg) translateY(-150px) scale(1); }
          }
          @keyframes energyParticle2 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(90deg) translateY(-100px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(135deg) translateY(-150px) scale(1); }
          }
          @keyframes energyParticle3 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(135deg) translateY(-100px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(180deg) translateY(-150px) scale(1); }
          }
          @keyframes energyParticle4 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(180deg) translateY(-100px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(225deg) translateY(-150px) scale(1); }
          }
          @keyframes energyParticle5 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(225deg) translateY(-100px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(270deg) translateY(-150px) scale(1); }
          }
          @keyframes energyParticle6 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(270deg) translateY(-100px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(315deg) translateY(-150px) scale(1); }
          }
          @keyframes energyParticle7 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(315deg) translateY(-100px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(360deg) translateY(-150px) scale(1); }
          }
          @keyframes auroraShift {
            0%, 100% { transform: translateX(-20px); opacity: 0.3; }
            50% { transform: translateX(20px); opacity: 0.6; }
          }
          @keyframes gasStorm {
            0% { transform: rotate(0deg) scale(1); }
            100% { transform: rotate(360deg) scale(1.1); }
          }
          @keyframes crystalPrism {
            0% { transform: rotate(0deg) scale(1); opacity: 0.3; }
            50% { transform: rotate(180deg) scale(1.1); opacity: 0.6; }
            100% { transform: rotate(360deg) scale(1); opacity: 0.3; }
          }
        `}
      </style>
    </>
  )
}

export default AlienArtifactHuntOverlays
