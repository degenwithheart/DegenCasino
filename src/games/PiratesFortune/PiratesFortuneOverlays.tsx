import React from 'react'

interface PiratesFortuneOverlaysProps {
  sailingPhase: boolean
  currentIsland: number
  foundTreasure: boolean
  win: boolean
  choice: 'coastal' | 'deep' | 'storm'
}

export default function PiratesFortuneOverlays({
  sailingPhase,
  currentIsland,
  foundTreasure,
  win,
  choice
}: PiratesFortuneOverlaysProps) {
  
  if (sailingPhase && currentIsland > 0) {
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
        {/* Ship sailing animation */}
        <div style={{
          position: 'relative',
          marginBottom: '30px'
        }}>
          <div style={{
            fontSize: '100px',
            animation: 'ship 3s ease-in-out infinite',
            filter: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.6))'
          }}>
            🚢
          </div>
          
          {/* Wind lines */}
          <div style={{
            position: 'absolute',
            left: '-50px',
            top: '20px',
            color: '#38bdf8',
            fontSize: '20px',
            opacity: 0.7,
            animation: 'wind 2s ease-in-out infinite'
          }}>
            💨💨💨
          </div>
        </div>
        
        <div style={{
          color: '#38bdf8',
          fontSize: '28px',
          fontWeight: 700,
          textAlign: 'center',
          textShadow: '0 2px 20px rgba(56, 189, 248, 0.8)',
          marginBottom: '12px'
        }}>
          ⛵ SAILING TO ISLAND {currentIsland}
        </div>
        
        <div style={{
          color: '#0ea5e9',
          fontSize: '16px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          {choice === 'storm' ? 'Battling through the storm...' : 
           choice === 'deep' ? 'Navigating deep waters...' : 
           'Following the coastal route...'}
        </div>
        
        {/* Ocean waves */}
        <div style={{
          width: '300px',
          height: '60px',
          background: `
            repeating-linear-gradient(
              90deg,
              rgba(56, 189, 248, 0.3) 0px,
              rgba(14, 165, 233, 0.3) 30px,
              rgba(56, 189, 248, 0.3) 60px
            )
          `,
          borderRadius: '30px',
          animation: 'oceanWaves 2s linear infinite',
          marginBottom: '20px'
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          border: '1px solid #38bdf8',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '12px',
          color: '#38bdf8'
        }}>
          ROUTE: {choice.toUpperCase()} | SHIP STATUS: SAILING
        </div>
        
        <style>
          {`
            @keyframes ship {
              0%, 100% { transform: translateY(0px) rotate(-2deg); }
              50% { transform: translateY(-10px) rotate(2deg); }
            }
            @keyframes wind {
              0%, 100% { opacity: 0.7; transform: translateX(0); }
              50% { opacity: 1; transform: translateX(-10px); }
            }
            @keyframes oceanWaves {
              0% { transform: translateX(0); }
              100% { transform: translateX(-60px); }
            }
          `}
        </style>
      </div>
    )
  }

  if (foundTreasure && win) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle, rgba(234, 179, 8, 0.4) 0%, rgba(0, 0, 0, 0.9) 70%)',
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
          animation: 'treasureChest 2s ease-in-out infinite',
          marginBottom: '20px',
          filter: 'drop-shadow(0 0 40px rgba(234, 179, 8, 0.9))'
        }}>
          💰
        </div>
        
        <div style={{
          color: '#eab308',
          fontSize: '36px',
          fontWeight: 800,
          textAlign: 'center',
          textShadow: '0 2px 20px rgba(234, 179, 8, 0.8)',
          marginBottom: '12px'
        }}>
          🎉 TREASURE ISLAND! 🎉
        </div>
        
        <div style={{
          color: '#fff',
          fontSize: '18px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          Captain's buried treasure discovered!
        </div>
        
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              fontSize: '20px',
              animation: `pirateParticle${i} 3s ease-out infinite`,
              pointerEvents: 'none'
            }}
          >
            ⭐
          </div>
        ))}
        
        <style>
          {`
            @keyframes treasureChest {
              0%, 100% { transform: scale(1) rotate(0deg); }
              25% { transform: scale(1.1) rotate(-5deg); }
              75% { transform: scale(1.1) rotate(5deg); }
            }
            @keyframes pirateParticle0 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(-100px, -80px) scale(1); }
              100% { opacity: 0; transform: translate(-200px, -160px) scale(0); }
            }
            @keyframes pirateParticle1 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(100px, -80px) scale(1); }
              100% { opacity: 0; transform: translate(200px, -160px) scale(0); }
            }
            @keyframes pirateParticle2 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(-120px, 60px) scale(1); }
              100% { opacity: 0; transform: translate(-240px, 120px) scale(0); }
            }
            @keyframes pirateParticle3 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(120px, 60px) scale(1); }
              100% { opacity: 0; transform: translate(240px, 120px) scale(0); }
            }
            @keyframes pirateParticle4 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(-80px, -120px) scale(1); }
              100% { opacity: 0; transform: translate(-160px, -240px) scale(0); }
            }
            @keyframes pirateParticle5 {
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
