import React from 'react'

interface GalacticSalvageOverlaysProps {
  scanningPhase: boolean
  currentSector: number
  foundLoot: boolean
  win: boolean
  choice: 'safe' | 'risky' | 'extreme'
}

export default function GalacticSalvageOverlays({
  scanningPhase,
  currentSector,
  foundLoot,
  win,
  choice
}: GalacticSalvageOverlaysProps) {
  
  // Scanning overlay
  if (scanningPhase && currentSector > 0) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(15px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: 1000,
        borderRadius: '24px'
      }}>
        {/* Scanning HUD */}
        <div style={{
          position: 'relative',
          width: '300px',
          height: '300px',
          border: '2px solid #64b5f6',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          {/* Radar sweep */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '2px',
            height: '140px',
            background: 'linear-gradient(to bottom, #64b5f6, transparent)',
            transformOrigin: 'top',
            transform: 'translate(-50%, -50%) rotate(0deg)',
            animation: 'radarSweep 2s linear infinite'
          }} />
          
          {/* Center dot */}
          <div style={{
            width: '8px',
            height: '8px',
            background: '#64b5f6',
            borderRadius: '50%',
            boxShadow: '0 0 20px #64b5f6'
          }} />
          
          {/* Grid lines */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '1px',
            background: 'rgba(100, 181, 246, 0.3)',
            top: '50%',
            transform: 'translateY(-50%)'
          }} />
          <div style={{
            position: 'absolute',
            height: '100%',
            width: '1px',
            background: 'rgba(100, 181, 246, 0.3)',
            left: '50%',
            transform: 'translateX(-50%)'
          }} />
          
          {/* Sector indicator */}
          <div style={{
            position: 'absolute',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fbbf24',
            fontSize: '16px',
            fontWeight: 700,
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '4px 12px',
            borderRadius: '8px',
            border: '1px solid #fbbf24'
          }}>
            SECTOR {currentSector}
          </div>
        </div>
        
        <div style={{
          color: '#64b5f6',
          fontSize: '24px',
          fontWeight: 700,
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
          marginBottom: '8px'
        }}>
          🔍 DEEP SPACE SCAN IN PROGRESS
        </div>
        
        <div style={{
          color: '#9CA3AF',
          fontSize: '14px',
          textAlign: 'center',
          animation: 'blink 1.5s infinite'
        }}>
          Analyzing sector {currentSector} for salvageable materials...
        </div>
        
        {/* Route info */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          border: '1px solid #64b5f6',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '12px',
          color: '#64b5f6'
        }}>
          ROUTE: {choice.toUpperCase()} | DRONE STATUS: ACTIVE
        </div>
        
        <style>
          {`
            @keyframes radarSweep {
              0% { transform: translate(-50%, -50%) rotate(0deg); }
              100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            @keyframes blink {
              0%, 50% { opacity: 1; }
              51%, 100% { opacity: 0.5; }
            }
          `}
        </style>
      </div>
    )
  }

  // Found loot overlay
  if (foundLoot && win) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(0, 0, 0, 0.9) 70%)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: 1000,
        borderRadius: '24px'
      }}>
        <div style={{
          fontSize: '120px',
          animation: 'treasure 2s ease-in-out infinite',
          marginBottom: '20px',
          filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.8))'
        }}>
          💎
        </div>
        
        <div style={{
          color: '#22c55e',
          fontSize: '36px',
          fontWeight: 800,
          textAlign: 'center',
          textShadow: '0 2px 20px rgba(34, 197, 94, 0.8)',
          marginBottom: '12px'
        }}>
          🎉 TREASURE LOCATED! 🎉
        </div>
        
        <div style={{
          color: '#fff',
          fontSize: '18px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          Rare artifacts recovered from the void!
        </div>
        
        {/* Particle effects */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              fontSize: '20px',
              animation: `particle${i} 3s ease-out infinite`,
              pointerEvents: 'none'
            }}
          >
            ✨
          </div>
        ))}
        
        <style>
          {`
            @keyframes treasure {
              0%, 100% { transform: scale(1) rotate(0deg); }
              25% { transform: scale(1.1) rotate(-5deg); }
              75% { transform: scale(1.1) rotate(5deg); }
            }
            @keyframes particle0 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(-100px, -80px) scale(1); }
              100% { opacity: 0; transform: translate(-200px, -160px) scale(0); }
            }
            @keyframes particle1 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(100px, -80px) scale(1); }
              100% { opacity: 0; transform: translate(200px, -160px) scale(0); }
            }
            @keyframes particle2 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(-120px, 60px) scale(1); }
              100% { opacity: 0; transform: translate(-240px, 120px) scale(0); }
            }
            @keyframes particle3 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(120px, 60px) scale(1); }
              100% { opacity: 0; transform: translate(240px, 120px) scale(0); }
            }
            @keyframes particle4 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(-80px, -120px) scale(1); }
              100% { opacity: 0; transform: translate(-160px, -240px) scale(0); }
            }
            @keyframes particle5 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(80px, -120px) scale(1); }
              100% { opacity: 0; transform: translate(160px, -240px) scale(0); }
            }
          `}
        </style>
      </div>
    )
  }

  return null
}
