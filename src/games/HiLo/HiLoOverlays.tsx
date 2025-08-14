import React from 'react';
import { SyncedWinLossOverlay } from '../../components/SyncedWinLossOverlay';

interface HiLoOverlaysProps {
  gamePhase: 'thinking' | 'dramatic' | 'celebrating' | 'mourning' | 'idle';
  thinkingPhase: boolean;
  dramaticPause: boolean;
  currentWin?: {
    multiplier: number;
    amount: number;
  };
  thinkingEmoji: string;
  result?: any;
  currentBalance: number;
  wager: number;
}

export const HiLoOverlays: React.FC<HiLoOverlaysProps> = ({
  gamePhase,
  thinkingPhase,
  dramaticPause,
  currentWin,
  thinkingEmoji,
  result,
  currentBalance,
  wager
}) => {
  // Custom win levels for HiLo
  const hiloWinLevels = [
    { 
      minMultiplier: 1, 
      maxMultiplier: 2, 
      intensity: 1,
      label: "Good Guess!",
      emoji: "🎯",
      className: "win-small"
    },
    { 
      minMultiplier: 2, 
      maxMultiplier: 5, 
      intensity: 2,
      label: "Great Call!",
      emoji: "🔥",
      className: "win-medium"
    },
    { 
      minMultiplier: 5, 
      maxMultiplier: 100, 
      intensity: 3,
      label: "PERFECT READ!",
      emoji: "🎰",
      className: "win-mega"
    }
  ];

  return (
    <>
      {/* Synced Win/Loss Overlay */}
      <SyncedWinLossOverlay
        result={result}
        currentBalance={currentBalance}
        animationPhase={gamePhase}
        triggerPhase="celebrating"
        wager={wager}
        winLevels={hiloWinLevels}
      />

      {/* Dramatic Thinking Overlay */}
      {gamePhase === 'thinking' && thinkingPhase && (
        <div className="thinking-overlay">
          <div className="thinking-content">
            <div className="thinking-emoji">{thinkingEmoji}</div>
            <div className="thinking-text">Predicting the next card...</div>
            <div className="thinking-subtext">🃏 Reading card sequences... 🃏</div>
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

        /* Animation Keyframes */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default HiLoOverlays;
