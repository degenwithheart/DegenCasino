import React from 'react'

interface NeonCyberHackOverlaysProps {
  hackingPhase: boolean
  currentServer: number
  accessGranted: boolean
  win: boolean
  choice: 'stealth' | 'brute' | 'elite'
  hackingProgress: number
}

export default function NeonCyberHackOverlays({
  hackingPhase,
  currentServer,
  accessGranted,
  win,
  choice,
  hackingProgress
}: NeonCyberHackOverlaysProps) {
  
  if (hackingPhase && currentServer > 0) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(15px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: 1000,
        borderRadius: '24px',
        fontFamily: 'monospace'
      }}>
        {/* Terminal interface */}
        <div style={{
          width: '400px',
          height: '300px',
          background: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid #22c55e',
          borderRadius: '8px',
          padding: '20px',
          color: '#22c55e',
          fontSize: '14px',
          position: 'relative',
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)'
        }}>
          <div style={{ marginBottom: '10px' }}>
            &gt; INFILTRATING_SERVER_{currentServer.toString().padStart(2, '0')}
          </div>
          <div style={{ marginBottom: '10px' }}>
            &gt; METHOD: {choice.toUpperCase()}
          </div>
          <div style={{ marginBottom: '15px' }}>
            &gt; PROGRESS: {hackingProgress}%
          </div>
          
          {/* Progress visualization */}
          <div style={{
            width: '100%',
            height: '20px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid #22c55e',
            borderRadius: '4px',
            marginBottom: '15px',
            position: 'relative'
          }}>
            <div style={{
              width: `${hackingProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #22c55e, #16a34a)',
              borderRadius: '3px',
              transition: 'width 0.15s ease'
            }} />
          </div>
          
          {/* Code simulation */}
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            <div>&gt; SCANNING_PORTS...</div>
            <div>&gt; INJECTING_PAYLOAD...</div>
            <div>&gt; BYPASSING_FIREWALL...</div>
          </div>
          
          {/* Blinking cursor */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            animation: 'blink 1s infinite'
          }}>
            _
          </div>
        </div>
        
        <div style={{
          color: '#22c55e',
          fontSize: '16px',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          {choice === 'stealth' ? 'Infiltrating silently...' :
           choice === 'brute' ? 'Forcing entry...' :
           'Elite protocols active...'}
        </div>
        
        <style>
          {`
            @keyframes blink {
              0%, 50% { opacity: 1; }
              51%, 100% { opacity: 0; }
            }
          `}
        </style>
      </div>
    )
  }

  if (accessGranted && win) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(0, 0, 0, 0.9) 70%)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: 1000,
        borderRadius: '24px',
        fontFamily: 'monospace'
      }}>
        <div style={{
          fontSize: '80px',
          animation: 'access 2s ease-in-out infinite',
          marginBottom: '20px',
          filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.8))'
        }}>
          🔓
        </div>
        
        <div style={{
          color: '#22c55e',
          fontSize: '32px',
          fontWeight: 700,
          textAlign: 'center',
          textShadow: '0 2px 20px rgba(34, 197, 94, 0.8)',
          marginBottom: '12px'
        }}>
          &gt; ACCESS_GRANTED
        </div>
        
        <div style={{
          color: '#16a34a',
          fontSize: '16px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          &gt; DATA_EXTRACTION_COMPLETE
        </div>
        
        {/* Data streams */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              fontSize: '12px',
              color: '#22c55e',
              animation: `dataStream${i} 2s ease-out infinite`,
              pointerEvents: 'none',
              fontFamily: 'monospace'
            }}
          >
            {Math.random().toString(2).substr(2, 8)}
          </div>
        ))}
        
        <style>
          {`
            @keyframes access {
              0%, 100% { transform: scale(1); filter: hue-rotate(0deg); }
              50% { transform: scale(1.1); filter: hue-rotate(20deg); }
            }
            @keyframes dataStream0 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(-150px, -100px) scale(1); }
              100% { opacity: 0; transform: translate(-300px, -200px) scale(0); }
            }
            @keyframes dataStream1 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(150px, -100px) scale(1); }
              100% { opacity: 0; transform: translate(300px, -200px) scale(0); }
            }
            @keyframes dataStream2 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(-100px, 80px) scale(1); }
              100% { opacity: 0; transform: translate(-200px, 160px) scale(0); }
            }
            @keyframes dataStream3 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(100px, 80px) scale(1); }
              100% { opacity: 0; transform: translate(200px, 160px) scale(0); }
            }
            @keyframes dataStream4 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(0, -150px) scale(1); }
              100% { opacity: 0; transform: translate(0, -300px) scale(0); }
            }
          `}
        </style>
      </div>
    )
  }

  return null
}
