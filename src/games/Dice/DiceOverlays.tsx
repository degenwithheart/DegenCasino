import React from 'react';
import { SyncedWinLossOverlay } from '../../components/SyncedWinLossOverlay';

interface DiceOverlaysProps {
  gamePhase: 'thinking' | 'dramatic' | 'celebrating' | 'mourning' | 'idle';
  thinkingPhase: boolean;
  dramaticPause: boolean;
  celebrationIntensity: number;
  currentWin?: {
    multiplier: number;
    amount: number;
  };
  thinkingEmoji: string;
  // Add props needed for synced overlay
  result?: any; // Game result object
  currentBalance: number;
  wager: number;
}

export const DiceOverlays: React.FC<DiceOverlaysProps> = ({
  gamePhase,
  thinkingPhase,
  dramaticPause,
  celebrationIntensity,
  currentWin,
  thinkingEmoji,
  result,
  currentBalance,
  wager
}) => {
  return (
    <>
      {/* Dramatic Thinking Overlay */}
      {gamePhase === 'thinking' && thinkingPhase && (
        <div className="thinking-overlay">
          <div className="thinking-content">
            <div className="thinking-emoji">{thinkingEmoji}</div>
            <div className="thinking-text">Calculating the perfect roll...</div>
            <div className="thinking-subtext">🎲 Reading the dice gods... 🎲</div>
          </div>
        </div>
      )}

      {/* Dramatic Pause Overlay */}
      {gamePhase === 'dramatic' && dramaticPause && (
        <div className="dramatic-pause-overlay">
          <div className="dramatic-pause-content">
            <div className="pause-emoji">⏰</div>
            <div className="pause-text">Moment of Truth...</div>
          </div>
        </div>
      )}

      {/* Celebration Overlays */}
      {gamePhase === 'celebrating' && celebrationIntensity > 0 && (
        <div className={`celebration-overlay celebration-level-${celebrationIntensity}`}>
          <div className="celebration-content">
            {celebrationIntensity >= 3 && (
              <>
                <div className="mega-win-text">🎆 MEGA WIN! 🎆</div>
                <div className="win-amount">{currentWin && `${currentWin.multiplier.toFixed(2)}x MULTIPLIER!`}</div>
              </>
            )}
            {celebrationIntensity === 2 && (
              <>
                <div className="big-win-text">🎉 BIG WIN! 🎉</div>
                <div className="win-amount">{currentWin && `${currentWin.multiplier.toFixed(2)}x PAYOUT!`}</div>
              </>
            )}
            {celebrationIntensity === 1 && (
              <>
                <div className="nice-win-text">✨ NICE WIN! ✨</div>
                <div className="win-amount">{currentWin && `${currentWin.multiplier.toFixed(2)}x`}</div>
              </>
            )}
          </div>
          <div className="celebration-particles">
            {Array.from({ length: celebrationIntensity * 15 }).map((_, i) => (
              <div 
                key={i} 
                className="particle" 
                style={{ 
                  animationDelay: `${Math.random() * 2}s`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                {['🎲', '🌟', '✨', '🎉', '🎊', '💰', '🏆', '🔥'][Math.floor(Math.random() * 8)]}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mourning Overlay */}
      {gamePhase === 'mourning' && (
        <div className="mourning-overlay">
          <div className="mourning-content">
            <div className="mourning-emoji">😔</div>
            <div className="mourning-text">Better luck next roll!</div>
            <div className="mourning-subtext">🎲 The dice hunger for revenge... 🎲</div>
          </div>
        </div>
      )}

      {/* Universal Synced Win/Loss Overlay */}
      <SyncedWinLossOverlay
        result={result}
        currentBalance={currentBalance}
        animationPhase={gamePhase}
        triggerPhase="celebrating" // For wins
        wager={wager}
        winLevels={[
          { minMultiplier: 10, label: 'MEGA WIN!', emoji: '🎲', className: 'celebration-level-3' },
          { minMultiplier: 3, label: 'BIG WIN!', emoji: '🎉', className: 'celebration-level-2' },
          { minMultiplier: 1, label: 'WIN!', emoji: '✨', className: 'celebration-level-1' },
        ]}
      />

      {/* Universal Synced Loss Overlay */}
      <SyncedWinLossOverlay
        result={result}
        currentBalance={currentBalance}
        animationPhase={gamePhase}
        triggerPhase="mourning" // For losses
        wager={wager}
      />

      <style>{`
        /* Thinking Overlay */
        .thinking-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.5s ease-out;
        }

        .thinking-content {
          text-align: center;
          color: white;
        }

        .thinking-emoji {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: think 2s ease-in-out infinite;
        }

        .thinking-text {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #ffd700;
        }

        .thinking-subtext {
          font-size: 1rem;
          color: #cccccc;
          opacity: 0.8;
        }

        @keyframes think {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-5deg); }
          75% { transform: scale(1.1) rotate(5deg); }
        }

        /* Dramatic Pause Overlay */
        .dramatic-pause-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          animation: fadeIn 0.3s ease-out;
        }

        .dramatic-pause-content {
          text-align: center;
          color: white;
        }

        .pause-emoji {
          font-size: 3rem;
          margin-bottom: 1rem;
          animation: tick 1s ease-in-out infinite;
        }

        .pause-text {
          font-size: 2rem;
          font-weight: bold;
          color: #ff6b6b;
          text-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
        }

        @keyframes tick {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        /* Celebration Overlay */
        .celebration-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1002;
          animation: celebrationEnter 0.5s ease-out;
          pointer-events: none;
        }

        .celebration-level-1 {
          background: rgba(34, 197, 94, 0.1);
        }

        .celebration-level-2 {
          background: rgba(249, 115, 22, 0.15);
        }

        .celebration-level-3 {
          background: rgba(168, 85, 247, 0.2);
        }

        .celebration-content {
          text-align: center;
          color: white;
          z-index: 2;
          position: relative;
        }

        .nice-win-text, .big-win-text, .mega-win-text {
          font-weight: bold;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 30px currentColor;
        }

        .nice-win-text {
          font-size: 2rem;
          color: #22c55e;
          animation: niceWinPulse 2s ease-in-out infinite;
        }

        .big-win-text {
          font-size: 2.5rem;
          color: #f97316;
          animation: bigWinBounce 1.5s ease-in-out infinite;
        }

        .mega-win-text {
          font-size: 3rem;
          color: #a855f7;
          animation: megaWinExplosion 1s ease-in-out infinite;
        }

        .win-amount {
          font-size: 1.5rem;
          color: #ffd700;
          font-weight: bold;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }

        /* Celebration Particles */
        .celebration-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          font-size: 1.5rem;
          animation: particle-fall linear infinite;
          user-select: none;
        }

        @keyframes particle-fall {
          0% {
            top: -10%;
            opacity: 1;
            transform: rotate(0deg);
          }
          100% {
            top: 110%;
            opacity: 0;
            transform: rotate(360deg);
          }
        }

        /* Mourning Overlay */
        .mourning-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1003;
          animation: fadeIn 0.5s ease-out;
        }

        .mourning-content {
          text-align: center;
          color: white;
        }

        .mourning-emoji {
          font-size: 3rem;
          margin-bottom: 1rem;
          animation: mourn 2s ease-in-out infinite;
        }

        .mourning-text {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #ff6b6b;
        }

        .mourning-subtext {
          font-size: 1rem;
          color: #cccccc;
          opacity: 0.8;
        }

        @keyframes mourn {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.9); }
        }

        /* Animation Keyframes */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes celebrationEnter {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes niceWinPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes bigWinBounce {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-2deg); }
          75% { transform: scale(1.1) rotate(2deg); }
        }

        @keyframes megaWinExplosion {
          0%, 100% { transform: scale(1) rotate(0deg); }
          33% { transform: scale(1.2) rotate(-5deg); }
          66% { transform: scale(1.2) rotate(5deg); }
        }
      `}</style>
    </>
  );
};

export default DiceOverlays;
