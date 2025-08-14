import React from 'react'
import { SyncedWinLossOverlay } from '../../components/SyncedWinLossOverlay';

interface PyramidQuestOverlaysProps {
  exploringPhase: boolean
  currentChamber: number
  foundTreasure: boolean
  win: boolean
  choice: 'main' | 'secret' | 'side'
  torchFlicker: boolean
  result?: any;
  currentBalance: number;
  wager: number;
}

export default function PyramidQuestOverlays({
  exploringPhase,
  currentChamber,
  foundTreasure,
  win,
  choice,
  torchFlicker,
  result,
  currentBalance,
  wager
}: PyramidQuestOverlaysProps) {
  // Custom win levels for PyramidQuest
  const pyramidQuestWinLevels = [
    { 
      minMultiplier: 1, 
      maxMultiplier: 3, 
      intensity: 1,
      label: "Ancient Coins!",
      emoji: "🪙",
      className: "win-small"
    },
    { 
      minMultiplier: 3, 
      maxMultiplier: 10, 
      intensity: 2,
      label: "Pharaoh's Gold!",
      emoji: "👑",
      className: "win-medium"
    },
    { 
      minMultiplier: 10, 
      maxMultiplier: 1000, 
      intensity: 3,
      label: "PYRAMID FORTUNE!",
      emoji: "💎",
      className: "win-mega"
    }
  ];

  const syncedOverlay = (
    <SyncedWinLossOverlay
      result={result}
      currentBalance={currentBalance}
      animationPhase={foundTreasure && win ? 'celebrating' : 'idle'}
      triggerPhase="celebrating"
      wager={wager}
      winLevels={pyramidQuestWinLevels}
    />
  );
  
  // Exploring overlay
  if (exploringPhase && currentChamber > 0) {
    return (
      <>
        {syncedOverlay}
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
        borderRadius: '24px'
      }}>
        {/* Torch effect */}
        <div style={{
          position: 'relative',
          marginBottom: '40px'
        }}>
          <div style={{
            fontSize: '120px',
            animation: torchFlicker ? 'torchFlicker 0.3s ease-in-out' : 'torchSteady 1s ease-in-out',
            filter: `drop-shadow(0 0 ${torchFlicker ? '40px' : '20px'} rgba(251, 191, 36, 0.8))`,
            transform: torchFlicker ? 'scale(1.1)' : 'scale(1)'
          }}>
            🔥
          </div>
          
          {/* Flickering light effect */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '200px',
            background: `radial-gradient(circle, rgba(251, 191, 36, ${torchFlicker ? '0.3' : '0.2'}) 0%, transparent 70%)`,
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            pointerEvents: 'none'
          }} />
        </div>
        
        <div style={{
          color: '#eab308',
          fontSize: '28px',
          fontWeight: 700,
          textAlign: 'center',
          textShadow: '0 2px 20px rgba(234, 179, 8, 0.8)',
          marginBottom: '12px'
        }}>
          🏛️ EXPLORING CHAMBER {currentChamber}
        </div>
        
        <div style={{
          color: '#ca8a04',
          fontSize: '16px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          {torchFlicker ? 'Lighting the way...' : 'Searching for ancient treasures...'}
        </div>
        
        {/* Ancient corridor visualization */}
        <div style={{
          width: '300px',
          height: '80px',
          position: 'relative',
          border: '2px solid #ca8a04',
          borderRadius: '8px',
          background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(120,53,15,0.3) 50%, rgba(0,0,0,0.8) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          {/* Hieroglyphs */}
          <div style={{
            fontSize: '20px',
            color: '#eab308',
            opacity: 0.6,
            letterSpacing: '10px'
          }}>
            𓂀 𓋹 𓅓 𓂧 𓈖
          </div>
          
          {/* Progress indicator */}
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: '0',
            height: '4px',
            width: `${(currentChamber / 4) * 100}%`,
            background: 'linear-gradient(90deg, #eab308, #ca8a04)',
            borderRadius: '2px',
            transition: 'width 0.5s ease'
          }} />
        </div>
        
        {/* Entrance info */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          border: '1px solid #ca8a04',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '12px',
          color: '#eab308'
        }}>
          ENTRANCE: {choice.toUpperCase()} | TORCH: {torchFlicker ? 'FLICKERING' : 'STEADY'}
        </div>
        
        <style>
          {`
            @keyframes torchFlicker {
              0%, 100% { transform: scale(1) rotate(-2deg); filter: hue-rotate(0deg); }
              50% { transform: scale(1.1) rotate(2deg); filter: hue-rotate(20deg); }
            }
            @keyframes torchSteady {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.02); }
            }
          `}
        </style>
      </div>
      </>
    )
  }

  // Found treasure overlay
  if (foundTreasure && win) {
    return (
      <>
        {syncedOverlay}
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
          animation: 'treasureReveal 2s ease-in-out infinite',
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
          🎉 PHARAOH'S TREASURE! 🎉
        </div>
        
        <div style={{
          color: '#fff',
          fontSize: '18px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          Ancient gold and precious gems discovered!
        </div>
        
        {/* Treasure chest opening animation */}
        <div style={{
          position: 'relative',
          width: '200px',
          height: '100px',
          marginBottom: '20px'
        }}>
          {/* Chest base */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '60px',
            background: 'linear-gradient(135deg, #a16207, #78350f)',
            borderRadius: '8px 8px 12px 12px',
            border: '3px solid #eab308'
          }} />
          
          {/* Chest lid */}
          <div style={{
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '50px',
            background: 'linear-gradient(135deg, #ca8a04, #a16207)',
            borderRadius: '12px 12px 8px 8px',
            border: '3px solid #eab308',
            animation: 'chestOpen 2s ease-in-out infinite'
          }} />
          
          {/* Treasure overflow */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '24px',
            animation: 'treasureSpill 2s ease-in-out infinite'
          }}>
            💎 🏺 💰
          </div>
        </div>
        
        {/* Golden particle effects */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              fontSize: '16px',
              animation: `goldParticle${i} 3s ease-out infinite`,
              pointerEvents: 'none'
            }}
          >
            ✨
          </div>
        ))}
        
        <style>
          {`
            @keyframes treasureReveal {
              0%, 100% { transform: scale(1) rotate(0deg); }
              25% { transform: scale(1.1) rotate(-3deg); }
              75% { transform: scale(1.1) rotate(3deg); }
            }
            @keyframes chestOpen {
              0%, 100% { transform: translateX(-50%) rotateX(0deg); }
              50% { transform: translateX(-50%) rotateX(-30deg); }
            }
            @keyframes treasureSpill {
              0%, 100% { opacity: 0.8; transform: translateX(-50%) translateY(0px); }
              50% { opacity: 1; transform: translateX(-50%) translateY(-10px); }
            }
            @keyframes goldParticle0 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(-120px, -100px) scale(1); }
              100% { opacity: 0; transform: translate(-240px, -200px) scale(0); }
            }
            @keyframes goldParticle1 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(120px, -100px) scale(1); }
              100% { opacity: 0; transform: translate(240px, -200px) scale(0); }
            }
            @keyframes goldParticle2 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(-100px, 80px) scale(1); }
              100% { opacity: 0; transform: translate(-200px, 160px) scale(0); }
            }
            @keyframes goldParticle3 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(100px, 80px) scale(1); }
              100% { opacity: 0; transform: translate(200px, 160px) scale(0); }
            }
            @keyframes goldParticle4 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(-80px, -120px) scale(1); }
              100% { opacity: 0; transform: translate(-160px, -240px) scale(0); }
            }
            @keyframes goldParticle5 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(80px, -120px) scale(1); }
              100% { opacity: 0; transform: translate(160px, -240px) scale(0); }
            }
            @keyframes goldParticle6 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(-140px, 40px) scale(1); }
              100% { opacity: 0; transform: translate(-280px, 80px) scale(0); }
            }
            @keyframes goldParticle7 {
              0% { opacity: 1; transform: translate(0, 0) scale(0); }
              50% { opacity: 1; transform: translate(140px, 40px) scale(1); }
              100% { opacity: 0; transform: translate(280px, 80px) scale(0); }
            }
          `}
        </style>
      </div>
      </>
    )
  }

  return (
    <>
      {syncedOverlay}
    </>
  )
}
