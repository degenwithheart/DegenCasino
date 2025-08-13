import React from 'react'

interface HelloWorldOverlaysProps {
  gamePhase: boolean
  thinkingPhase: boolean
  dramaticPause: boolean
  celebrationIntensity: number
  currentWin?: { multiplier: number; amount: number }
  thinkingEmoji: string
}

export default function HelloWorldOverlays({
  gamePhase,
  thinkingPhase,
  dramaticPause,
  celebrationIntensity,
  currentWin,
  thinkingEmoji
}: HelloWorldOverlaysProps) {
  
  // Thinking overlay
  if (thinkingPhase) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
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
          animation: 'bounce 1s infinite',
          marginBottom: '20px'
        }}>
          {thinkingEmoji}
        </div>
        <div style={{
          color: '#fff',
          fontSize: '32px',
          fontWeight: 700,
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
        }}>
          Thinking...
        </div>
        <div style={{
          color: '#9CA3AF',
          fontSize: '16px',
          marginTop: '8px',
          textAlign: 'center'
        }}>
          Calculating your destiny 🎲
        </div>
        
        <style>
          {`
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-10px); }
              60% { transform: translateY(-5px); }
            }
          `}
        </style>
      </div>
    )
  }

  // Dramatic pause overlay
  if (dramaticPause) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%)',
        backdropFilter: 'blur(15px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: 1000,
        borderRadius: '24px'
      }}>
        <div style={{
          fontSize: '80px',
          animation: 'pulse 0.8s ease-in-out infinite',
          marginBottom: '20px'
        }}>
          ⚡
        </div>
        <div style={{
          color: '#fbbf24',
          fontSize: '28px',
          fontWeight: 700,
          textAlign: 'center',
          textShadow: '0 0 20px rgba(251, 191, 36, 0.5)'
        }}>
          The moment of truth...
        </div>
        
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.1); opacity: 0.8; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}
        </style>
      </div>
    )
  }

  // Celebration overlay (when winning)
  if (celebrationIntensity > 0 && currentWin) {
    const getIntensityConfig = (intensity: number) => {
      switch (intensity) {
        case 3: // Epic win
          return {
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(255, 165, 0, 0.2) 50%, rgba(0, 0, 0, 0.8) 100%)',
            primaryColor: '#ffd700',
            secondaryColor: '#ffa500',
            emoji: '🎆🎉🔥',
            title: 'EPIC WIN!',
            subtitle: 'Legendary multiplier!',
            fontSize: '120px',
            animation: 'epicCelebration 2s ease-out infinite'
          }
        case 2: // Big win
          return {
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(16, 185, 129, 0.2) 50%, rgba(0, 0, 0, 0.8) 100%)',
            primaryColor: '#22c55e',
            secondaryColor: '#10b981',
            emoji: '🎉💰✨',
            title: 'BIG WIN!',
            subtitle: 'Great multiplier!',
            fontSize: '100px',
            animation: 'bigCelebration 1.5s ease-out infinite'
          }
        default: // Regular win
          return {
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.2) 50%, rgba(0, 0, 0, 0.8) 100%)',
            primaryColor: '#3b82f6',
            secondaryColor: '#2563eb',
            emoji: '🎉✅🌟',
            title: 'YOU WON!',
            subtitle: 'Nice play!',
            fontSize: '80px',
            animation: 'celebration 1s ease-out infinite'
          }
      }
    }

    const config = getIntensityConfig(celebrationIntensity)

    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: config.background,
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: 1000,
        borderRadius: '24px'
      }}>
        <div style={{
          fontSize: config.fontSize,
          animation: config.animation,
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {config.emoji}
        </div>
        <div style={{
          color: config.primaryColor,
          fontSize: '48px',
          fontWeight: 800,
          textAlign: 'center',
          textShadow: `0 0 30px ${config.primaryColor}`,
          marginBottom: '12px'
        }}>
          {config.title}
        </div>
        <div style={{
          color: '#fff',
          fontSize: '24px',
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          {config.subtitle}
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${config.primaryColor}20, ${config.secondaryColor}20)`,
          border: `2px solid ${config.primaryColor}`,
          borderRadius: '16px',
          padding: '16px 32px',
          textAlign: 'center'
        }}>
          <div style={{
            color: config.primaryColor,
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '4px'
          }}>
            {currentWin.multiplier.toFixed(2)}x
          </div>
          <div style={{
            color: '#9CA3AF',
            fontSize: '14px'
          }}>
            MULTIPLIER
          </div>
        </div>
        
        <style>
          {`
            @keyframes celebration {
              0%, 100% { transform: scale(1) rotate(0deg); }
              25% { transform: scale(1.1) rotate(-5deg); }
              75% { transform: scale(1.1) rotate(5deg); }
            }
            @keyframes bigCelebration {
              0%, 100% { transform: scale(1) rotate(0deg); }
              25% { transform: scale(1.2) rotate(-10deg); }
              75% { transform: scale(1.2) rotate(10deg); }
            }
            @keyframes epicCelebration {
              0%, 100% { transform: scale(1) rotate(0deg); }
              20% { transform: scale(1.3) rotate(-15deg); }
              40% { transform: scale(1.1) rotate(15deg); }
              60% { transform: scale(1.3) rotate(-10deg); }
              80% { transform: scale(1.1) rotate(10deg); }
            }
          `}
        </style>
      </div>
    )
  }

  // Mourning overlay (when losing)
  if (gamePhase && celebrationIntensity === 0) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 50%, rgba(0, 0, 0, 0.8) 100%)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: 1000,
        borderRadius: '24px'
      }}>
        <div style={{
          fontSize: '80px',
          animation: 'sway 2s ease-in-out infinite',
          marginBottom: '20px'
        }}>
          😔💸
        </div>
        <div style={{
          color: '#ef4444',
          fontSize: '36px',
          fontWeight: 700,
          textAlign: 'center',
          textShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
          marginBottom: '12px'
        }}>
          Better luck next time!
        </div>
        <div style={{
          color: '#9CA3AF',
          fontSize: '18px',
          textAlign: 'center'
        }}>
          Try a different strategy 🎯
        </div>
        
        <style>
          {`
            @keyframes sway {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(-3deg); }
              75% { transform: rotate(3deg); }
            }
          `}
        </style>
      </div>
    )
  }

  return null
}
