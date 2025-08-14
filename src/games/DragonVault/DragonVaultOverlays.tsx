import React from 'react'
import { SyncedWinLossOverlay } from '../../components/SyncedWinLossOverlay';

interface DragonVaultOverlaysProps {
  delving: boolean
  currentDepth: number
  treasureFound: boolean
  win: boolean
  dragon: 'fire' | 'ice' | 'shadow'
  dragonAwareness: number
  vaultTemperature: number
  result?: any;
  currentBalance: number;
  wager: number;
}

const DragonVaultOverlays: React.FC<DragonVaultOverlaysProps> = ({
  delving,
  currentDepth,
  treasureFound,
  win,
  dragon,
  dragonAwareness,
  vaultTemperature,
  result,
  currentBalance,
  wager
}) => {
  // Custom win levels for DragonVault
  const dragonVaultWinLevels = [
    { 
      minMultiplier: 1, 
      maxMultiplier: 3, 
      intensity: 1,
      label: "Treasure Found!",
      emoji: "💎",
      className: "win-small"
    },
    { 
      minMultiplier: 3, 
      maxMultiplier: 10, 
      intensity: 2,
      label: "Dragon's Hoard!",
      emoji: "🐉",
      className: "win-medium"
    },
    { 
      minMultiplier: 10, 
      maxMultiplier: 1000, 
      intensity: 3,
      label: "LEGENDARY VAULT!",
      emoji: "👑",
      className: "win-mega"
    }
  ];

  if (!delving && !treasureFound && !win) return null

  return (
    <>
      {/* Synced Win/Loss Overlay */}
      <SyncedWinLossOverlay
        result={result}
        currentBalance={currentBalance}
        animationPhase={treasureFound && win ? 'celebrating' : 'idle'}
        triggerPhase="celebrating"
        wager={wager}
        winLevels={dragonVaultWinLevels}
      />

      {/* Vault Delving Interface */}
      {delving && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 100
        }}>
          {/* Vault Explorer Console */}
          <div style={{
            width: '450px',
            height: '340px',
            border: `2px solid ${dragon === 'fire' ? '#fca5a5' : dragon === 'ice' ? '#7dd3fc' : '#fcd34d'}`,
            borderRadius: '20px',
            background: `linear-gradient(135deg, 
              ${dragon === 'fire' ? 'rgba(220, 38, 38, 0.1)' : dragon === 'ice' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(124, 45, 18, 0.1)'} 0%, 
              rgba(0, 0, 0, 0.88) 50%, 
              ${dragon === 'fire' ? 'rgba(185, 28, 28, 0.1)' : dragon === 'ice' ? 'rgba(2, 132, 199, 0.1)' : 'rgba(146, 64, 14, 0.1)'} 100%)`,
            backdropFilter: 'blur(14px)',
            padding: '26px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            animation: 'vaultConsolePulse 2.8s ease-in-out infinite'
          }}>
            {/* Ancient Runes Background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 20%, ${dragon === 'fire' ? 'rgba(248, 113, 113, 0.08)' : dragon === 'ice' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(251, 191, 36, 0.08)'} 0%, transparent 30%),
                radial-gradient(circle at 80% 80%, ${dragon === 'fire' ? 'rgba(248, 113, 113, 0.08)' : dragon === 'ice' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(251, 191, 36, 0.08)'} 0%, transparent 30%)
              `,
              opacity: 0.7,
              animation: 'runesShimmer 5s linear infinite'
            }} />
            
            {/* Central Display */}
            <div style={{
              textAlign: 'center',
              color: '#fff',
              zIndex: 2
            }}>
              <div style={{
                fontSize: '80px',
                marginBottom: '14px',
                animation: 'dragonPulse 2.5s ease-in-out infinite',
                filter: `drop-shadow(0 0 30px ${dragon === 'fire' ? 'rgba(248, 113, 113, 0.9)' : dragon === 'ice' ? 'rgba(56, 189, 248, 0.9)' : 'rgba(251, 191, 36, 0.9)'})`
              }}>
                {dragon === 'fire' ? '🔥' : dragon === 'ice' ? '❄️' : '🌑'}
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: 700,
                color: dragon === 'fire' ? '#fca5a5' : dragon === 'ice' ? '#7dd3fc' : '#fcd34d',
                marginBottom: '10px',
                textShadow: `0 0 15px ${dragon === 'fire' ? 'rgba(248, 113, 113, 0.7)' : dragon === 'ice' ? 'rgba(56, 189, 248, 0.7)' : 'rgba(251, 191, 36, 0.7)'}`
              }}>
                {dragon === 'fire' ? 'FIRE DRAGON\'S LAIR' : dragon === 'ice' ? 'ICE DRAGON\'S DOMAIN' : 'SHADOW DRAGON\'S REALM'}
              </div>
              <div style={{
                fontSize: '16px',
                color: '#CBD5E1',
                marginBottom: '18px'
              }}>
                Delving Depth {currentDepth}
              </div>
              
              {/* Status Readings */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '280px',
                marginBottom: '16px'
              }}>
                {/* Dragon Awareness */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '90px',
                    height: '14px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '7px',
                    border: `1px solid ${dragonAwareness > 75 ? '#ef4444' : '#fbbf24'}`,
                    overflow: 'hidden',
                    marginBottom: '6px'
                  }}>
                    <div style={{
                      width: `${dragonAwareness}%`,
                      height: '100%',
                      background: dragonAwareness > 75 
                        ? 'linear-gradient(90deg, #dc2626, #ef4444)' 
                        : 'linear-gradient(90deg, #d97706, #fbbf24)',
                      transition: 'width 0.5s ease-out',
                      animation: dragonAwareness > 80 ? 'dangerPulse 0.8s ease-in-out infinite alternate' : 'alertGlow 2s ease-in-out infinite alternate'
                    }} />
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: dragonAwareness > 75 ? '#ef4444' : '#fbbf24',
                    fontWeight: 600
                  }}>
                    DRAGON: {dragonAwareness.toFixed(0)}%
                  </div>
                </div>

                {/* Vault Temperature */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '90px',
                    height: '14px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '7px',
                    border: `1px solid ${dragon === 'fire' ? '#fca5a5' : dragon === 'ice' ? '#7dd3fc' : '#fcd34d'}`,
                    overflow: 'hidden',
                    marginBottom: '6px'
                  }}>
                    <div style={{
                      width: `${Math.abs(vaultTemperature)}%`,
                      height: '100%',
                      background: dragon === 'fire' 
                        ? 'linear-gradient(90deg, #dc2626, #f87171)' 
                        : dragon === 'ice'
                        ? 'linear-gradient(90deg, #0ea5e9, #38bdf8)'
                        : 'linear-gradient(90deg, #ca8a04, #fbbf24)',
                      transition: 'width 0.5s ease-out',
                      animation: 'tempFlow 1.8s ease-in-out infinite alternate'
                    }} />
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: dragon === 'fire' ? '#fca5a5' : dragon === 'ice' ? '#7dd3fc' : '#fcd34d',
                    fontWeight: 600
                  }}>
                    TEMP: {vaultTemperature.toFixed(0)}°C
                  </div>
                </div>
              </div>

              {/* Depth Indicator */}
              <div style={{
                fontSize: '13px',
                color: '#9CA3AF',
                fontWeight: 500,
                marginBottom: '8px'
              }}>
                {dragon === 'fire' ? 
                  ['Ember Layer', 'Flame Chamber', 'Inferno Core', 'Dragon Core', 'Heart of Fire'][currentDepth - 1] :
                dragon === 'ice' ?
                  ['Frost Layer', 'Freeze Chamber', 'Glacier Core', 'Dragon Core', 'Heart of Ice'][currentDepth - 1] :
                  ['Dusk Layer', 'Void Chamber', 'Abyss Core', 'Dragon Core', 'Heart of Shadow'][currentDepth - 1]
                }
              </div>

              {/* Dragon Eye */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${dragon === 'fire' ? '#f87171' : dragon === 'ice' ? '#38bdf8' : '#fbbf24'} 30%, ${dragon === 'fire' ? '#dc2626' : dragon === 'ice' ? '#0ea5e9' : '#ca8a04'} 70%)`,
                margin: '0 auto',
                animation: dragonAwareness > 80 ? 'dragonEyeAlert 1s ease-in-out infinite' : 'dragonEyeWatch 3s ease-in-out infinite',
                filter: `drop-shadow(0 0 12px ${dragon === 'fire' ? 'rgba(248, 113, 113, 0.8)' : dragon === 'ice' ? 'rgba(56, 189, 248, 0.8)' : 'rgba(251, 191, 36, 0.8)'})`
              }} />
            </div>
            
            {/* Console Corners */}
            {[0, 1, 2, 3].map(corner => (
              <div
                key={corner}
                style={{
                  position: 'absolute',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: dragon === 'fire' ? '#fca5a5' : dragon === 'ice' ? '#7dd3fc' : '#fcd34d',
                  ...(corner === 0 && { top: '16px', left: '16px' }),
                  ...(corner === 1 && { top: '16px', right: '16px' }),
                  ...(corner === 2 && { bottom: '16px', left: '16px' }),
                  ...(corner === 3 && { bottom: '16px', right: '16px' }),
                  animation: 'vaultLedBlink 4s ease-in-out infinite',
                  animationDelay: `${corner * 1}s`,
                  filter: `drop-shadow(0 0 6px ${dragon === 'fire' ? 'rgba(248, 113, 113, 0.8)' : dragon === 'ice' ? 'rgba(56, 189, 248, 0.8)' : 'rgba(251, 191, 36, 0.8)'})`
                }}
              />
            ))}
          </div>
          
          {/* Mining Beam */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '8px',
            height: '180px',
            background: `linear-gradient(to bottom, ${dragon === 'fire' ? '#fca5a5' : dragon === 'ice' ? '#7dd3fc' : '#fcd34d'}, transparent)`,
            animation: 'miningBeam 3s ease-in-out infinite',
            filter: `drop-shadow(0 0 15px ${dragon === 'fire' ? 'rgba(248, 113, 113, 0.8)' : dragon === 'ice' ? 'rgba(56, 189, 248, 0.8)' : 'rgba(251, 191, 36, 0.8)'})`
          }} />
        </div>
      )}

      {/* Treasure Discovery Sequence */}
      {treasureFound && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `radial-gradient(circle, ${dragon === 'fire' ? 'rgba(220, 38, 38, 0.35)' : dragon === 'ice' ? 'rgba(14, 165, 233, 0.35)' : 'rgba(124, 45, 18, 0.35)'} 0%, rgba(0, 0, 0, 0.88) 75%)`,
          zIndex: 200,
          animation: 'treasureReveal 3s ease-out'
        }}>
          <div style={{
            textAlign: 'center',
            transform: 'scale(1)',
            animation: 'treasureFloat 3.5s ease-in-out infinite'
          }}>
            <div style={{
              fontSize: '140px',
              marginBottom: '24px',
              filter: `drop-shadow(0 0 50px ${dragon === 'fire' ? 'rgba(248, 113, 113, 1)' : dragon === 'ice' ? 'rgba(56, 189, 248, 1)' : 'rgba(251, 191, 36, 1)'})`,
              animation: 'treasureGlow 2.5s ease-in-out infinite alternate'
            }}>
              {dragon === 'fire' ? '💎' : dragon === 'ice' ? '🧊' : '👑'}
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: 800,
              color: dragon === 'fire' ? '#fca5a5' : dragon === 'ice' ? '#7dd3fc' : '#fcd34d',
              marginBottom: '18px',
              textShadow: `0 0 30px ${dragon === 'fire' ? 'rgba(248, 113, 113, 0.8)' : dragon === 'ice' ? 'rgba(56, 189, 248, 0.8)' : 'rgba(251, 191, 36, 0.8)'}`
            }}>
              ANCIENT TREASURE DISCOVERED!
            </div>
            <div style={{
              fontSize: '20px',
              color: '#fff',
              opacity: 0.9,
              marginBottom: '10px'
            }}>
              {dragon === 'fire' ? 'Molten gemstones of immense power' :
               dragon === 'ice' ? 'Frozen crystals of eternal beauty' :
               'Shadow artifacts of forgotten kings'}
            </div>
            <div style={{
              fontSize: '16px',
              color: '#CBD5E1',
              opacity: 0.8
            }}>
              The dragon's hoard yields to your bravery
            </div>
          </div>
          
          {/* Treasure Particles */}
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                background: dragon === 'fire' ? '#fca5a5' : dragon === 'ice' ? '#7dd3fc' : '#fcd34d',
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 22.5}deg) translateY(-140px)`,
                animation: `treasureParticle${i % 6} 5s ease-in-out infinite`,
                filter: `drop-shadow(0 0 8px ${dragon === 'fire' ? 'rgba(248, 113, 113, 0.8)' : dragon === 'ice' ? 'rgba(56, 189, 248, 0.8)' : 'rgba(251, 191, 36, 0.8)'})`
              }}
            />
          ))}
        </div>
      )}

      {/* Dragon-Specific Ambient Effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        opacity: delving ? 0.8 : 0.5,
        transition: 'opacity 1s ease'
      }}>
        {dragon === 'fire' && (
          <>
            {/* Fire dragon flame effects */}
            <div style={{
              position: 'absolute',
              top: '15%',
              left: 0,
              right: 0,
              height: '80px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(220, 38, 38, 0.12) 20%, rgba(248, 113, 113, 0.18) 50%, rgba(220, 38, 38, 0.12) 80%, transparent 100%)',
              animation: 'flameWave 7s ease-in-out infinite'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '25%',
              left: 0,
              right: 0,
              height: '60px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(248, 113, 113, 0.1) 30%, rgba(252, 165, 165, 0.15) 70%, transparent 100%)',
              animation: 'flameWave 9s ease-in-out infinite reverse'
            }} />
          </>
        )}
        
        {dragon === 'ice' && (
          <>
            {/* Ice dragon frost effects */}
            <div style={{
              position: 'absolute',
              top: '20%',
              left: '5%',
              width: '90%',
              height: '60%',
              background: 'radial-gradient(ellipse, rgba(14, 165, 233, 0.08) 0%, rgba(56, 189, 248, 0.12) 25%, transparent 60%)',
              borderRadius: '50%',
              animation: 'frostSpread 8s linear infinite'
            }} />
            <div style={{
              position: 'absolute',
              top: '40%',
              right: '10%',
              width: '50%',
              height: '30%',
              background: 'linear-gradient(45deg, rgba(56, 189, 248, 0.06) 0%, rgba(125, 211, 252, 0.1) 50%, transparent 100%)',
              borderRadius: '50%',
              animation: 'frostSpread 10s linear infinite reverse'
            }} />
          </>
        )}
        
        {dragon === 'shadow' && (
          <>
            {/* Shadow dragon darkness effects */}
            <div style={{
              position: 'absolute',
              top: '25%',
              left: '15%',
              width: '70px',
              height: '50%',
              background: 'linear-gradient(0deg, transparent 0%, rgba(124, 45, 18, 0.08) 20%, rgba(251, 191, 36, 0.12) 50%, rgba(124, 45, 18, 0.08) 80%, transparent 100%)',
              borderRadius: '50%',
              animation: 'shadowShift 12s ease-in-out infinite'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '30%',
              right: '20%',
              width: '50px',
              height: '40%',
              background: 'linear-gradient(0deg, transparent 0%, rgba(251, 191, 36, 0.1) 30%, rgba(252, 211, 77, 0.14) 60%, transparent 100%)',
              borderRadius: '50%',
              animation: 'shadowShift 14s ease-in-out infinite reverse'
            }} />
          </>
        )}
      </div>

      <style>
        {`
          @keyframes vaultConsolePulse {
            0%, 100% { opacity: 0.96; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.008); }
          }
          @keyframes runesShimmer {
            0% { backgroundPosition: 0 0; }
            100% { backgroundPosition: 50px 50px; }
          }
          @keyframes dragonPulse {
            0%, 100% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.06) rotate(3deg); }
            50% { transform: scale(1) rotate(0deg); }
            75% { transform: scale(1.06) rotate(-3deg); }
          }
          @keyframes alertGlow {
            0% { filter: brightness(1); }
            100% { filter: brightness(1.25); }
          }
          @keyframes dangerPulse {
            0% { filter: brightness(1); opacity: 1; }
            100% { filter: brightness(1.4); opacity: 0.8; }
          }
          @keyframes tempFlow {
            0% { filter: brightness(1); }
            100% { filter: brightness(1.2); }
          }
          @keyframes dragonEyeWatch {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          @keyframes dragonEyeAlert {
            0%, 100% { opacity: 0.8; transform: scale(1); filter: brightness(1); }
            50% { opacity: 1; transform: scale(1.2); filter: brightness(1.5); }
          }
          @keyframes vaultLedBlink {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          @keyframes miningBeam {
            0%, 100% { opacity: 0.5; transform: translateX(-50%) scaleY(1); }
            50% { opacity: 0.9; transform: translateX(-50%) scaleY(1.15); }
          }
          @keyframes treasureReveal {
            0% { opacity: 0; transform: scale(0.85); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes treasureFloat {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-12px) scale(1.03); }
          }
          @keyframes treasureGlow {
            0% { filter: drop-shadow(0 0 50px currentColor) brightness(1); }
            100% { filter: drop-shadow(0 0 80px currentColor) brightness(1.5); }
          }
          @keyframes treasureParticle0 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(0deg) translateY(-140px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(90deg) translateY(-200px) scale(1); }
          }
          @keyframes treasureParticle1 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(22.5deg) translateY(-140px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(112.5deg) translateY(-200px) scale(1); }
          }
          @keyframes treasureParticle2 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(45deg) translateY(-140px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(135deg) translateY(-200px) scale(1); }
          }
          @keyframes treasureParticle3 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(67.5deg) translateY(-140px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(157.5deg) translateY(-200px) scale(1); }
          }
          @keyframes treasureParticle4 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(90deg) translateY(-140px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(180deg) translateY(-200px) scale(1); }
          }
          @keyframes treasureParticle5 {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) rotate(112.5deg) translateY(-140px) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) rotate(202.5deg) translateY(-200px) scale(1); }
          }
          @keyframes flameWave {
            0%, 100% { transform: translateX(-40px); opacity: 0.5; }
            50% { transform: translateX(40px); opacity: 0.8; }
          }
          @keyframes frostSpread {
            0% { transform: rotate(0deg) scale(1); opacity: 0.4; }
            50% { transform: rotate(180deg) scale(1.15); opacity: 0.7; }
            100% { transform: rotate(360deg) scale(1); opacity: 0.4; }
          }
          @keyframes shadowShift {
            0%, 100% { transform: scaleY(1) rotate(0deg); opacity: 0.5; }
            33% { transform: scaleY(1.4) rotate(120deg); opacity: 0.8; }
            66% { transform: scaleY(0.6) rotate(240deg); opacity: 0.6; }
          }
        `}
      </style>
    </>
  )
}

export default DragonVaultOverlays
