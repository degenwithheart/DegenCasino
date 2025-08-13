import React from 'react';

interface FlipOverlaysProps {
  gamePhase: 'idle' | 'countdown' | 'done';
  thinkingPhase: boolean;
  result: 'heads' | 'tails' | null;
}

const FlipOverlays: React.FC<FlipOverlaysProps> = ({ gamePhase, thinkingPhase, result }) => {
  return (
    <>
      {/* Idle State Overlay */}
      {gamePhase === 'idle' && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '12px',
          padding: '12px 20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          animation: 'fadeInUp 0.5s ease',
          zIndex: 30
        }}>
          <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            💫 Multiplayer Flip Arena
          </div>
          <div style={{ color: '#FCD34D', fontSize: '14px', fontWeight: 700 }}>
            Join teams and ready up to start!
          </div>
        </div>
      )}

      {/* Countdown Overlay */}
      {gamePhase === 'countdown' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '20px',
          padding: '30px 40px',
          border: '2px solid rgba(252, 211, 77, 0.5)',
          backdropFilter: 'blur(20px)',
          textAlign: 'center',
          animation: 'pulseGlow 1s ease infinite',
          zIndex: 40,
          boxShadow: '0 0 40px rgba(252, 211, 77, 0.3)'
        }}>
          <div style={{ 
            color: '#FCD34D', 
            fontSize: '24px', 
            fontWeight: 700, 
            marginBottom: '12px',
            animation: 'bounce 1s ease infinite'
          }}>
            ⚔️ BATTLE BEGINS SOON!
          </div>
          <div style={{ color: '#fff', fontSize: '16px' }}>
            Teams are locked and loaded...
          </div>
        </div>
      )}

      {/* Result Overlay */}
      {gamePhase === 'done' && result && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '20px',
          padding: '30px 40px',
          border: `2px solid ${result === 'heads' ? '#5EEAD4' : '#FCA5A5'}`,
          backdropFilter: 'blur(20px)',
          textAlign: 'center',
          animation: 'victoryPulse 2s ease',
          zIndex: 40,
          boxShadow: `0 0 40px ${result === 'heads' ? '#5EEAD4' : '#FCA5A5'}60`
        }}>
          <div style={{ 
            color: result === 'heads' ? '#5EEAD4' : '#FCA5A5', 
            fontSize: '28px', 
            fontWeight: 700, 
            marginBottom: '12px',
            animation: 'celebration 1.5s ease'
          }}>
            {result === 'heads' ? '👑' : '⚡'} TEAM {result === 'heads' ? 'A' : 'B'} WINS!
          </div>
          <div style={{ color: '#fff', fontSize: '18px', marginBottom: '8px' }}>
            Winning side: <span style={{ color: result === 'heads' ? '#5EEAD4' : '#FCA5A5', fontWeight: 700 }}>
              {result.toUpperCase()}
            </span>
          </div>
          <div style={{ color: '#9CA3AF', fontSize: '14px' }}>
            🎉 Victory achieved! 🎉
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 40px rgba(252, 211, 77, 0.3);
          }
          50% {
            box-shadow: 0 0 60px rgba(252, 211, 77, 0.6);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes victoryPulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes celebration {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.1) rotate(-5deg);
          }
          75% {
            transform: scale(1.1) rotate(5deg);
          }
        }

        .flip-overlays {
          position: relative;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default FlipOverlays;
