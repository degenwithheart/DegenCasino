import React from 'react';
import { useSyncedGameResult } from '../hooks/useSyncedGameResult';
import { useCurrentToken, TokenValue } from 'gamba-react-ui-v2';

interface GameResult {
  wasWin?: boolean;
  win?: boolean;
  amount?: number;
  payout?: number;
  multiplier?: number;
  totalWon?: number;
}

interface WinLevel {
  minMultiplier: number;
  label: string;
  emoji: string;
  className: string;
}

interface SyncedWinLossOverlayProps {
  result: GameResult | null;
  currentBalance: number;
  animationPhase: string;
  triggerPhase?: string;
  wager?: number;
  winLevels?: WinLevel[];
}

// Default win levels (can be overridden per game)
const DEFAULT_WIN_LEVELS: WinLevel[] = [
  { minMultiplier: 10, label: 'MEGA WIN!', emoji: '🎆', className: 'celebration-level-3' },
  { minMultiplier: 3, label: 'BIG WIN!', emoji: '🎉', className: 'celebration-level-2' },
  { minMultiplier: 1, label: 'NICE WIN!', emoji: '✨', className: 'celebration-level-1' },
];

export function SyncedWinLossOverlay({
  result,
  currentBalance,
  animationPhase,
  triggerPhase = 'celebrating', // Changed default to 'celebrating'
  wager = 0,
  winLevels = DEFAULT_WIN_LEVELS
}: SyncedWinLossOverlayProps) {
  const token = useCurrentToken();
  
  // Normalize the result format
  const normalizedResult = result ? {
    win: result.wasWin ?? result.win ?? false,
    amount: result.amount ?? result.payout ?? result.totalWon ?? 0,
    multiplier: result.multiplier ?? (result.payout && wager ? result.payout / wager : 0)
  } : null;

  // Support both win ('celebrating') and loss ('mourning') trigger phases
  const shouldTrigger = animationPhase === triggerPhase || 
    (animationPhase === 'mourning' && normalizedResult && !normalizedResult.win);

  const { visibleResult, syncedBalance } = useSyncedGameResult(
    normalizedResult,
    currentBalance,
    shouldTrigger ? triggerPhase : 'IDLE', // Pass triggerPhase when should trigger, else 'IDLE'
    triggerPhase
  );

  if (!visibleResult) return null;

  const isWin = visibleResult.win;
  const multiplier = visibleResult.multiplier || 0;
  const winAmount = visibleResult.amount || 0;

  // Find the highest matching win level
  const winLevel = isWin
    ? winLevels.find(lvl => multiplier >= lvl.minMultiplier) || winLevels[winLevels.length - 1]
    : null;

  // Determine celebration intensity based on win level position (for particles)
  const celebrationIntensity = winLevel 
    ? winLevels.indexOf(winLevel) + 1 
    : 1;

  return (
    <>
      {/* Win/Loss Overlay */}
      {isWin ? (
        <div className={`synced-celebration-overlay ${winLevel?.className || 'celebration-level-1'}`}>
          <div className="synced-celebration-content">
            <div className="synced-win-level-text">
              {winLevel?.emoji} {winLevel?.label}
            </div>
            <div className="synced-win-amount">{multiplier.toFixed(2)}x</div>
            <div className="synced-win-payout">
              +<TokenValue amount={winAmount} />
            </div>
          </div>
          
          {/* Celebration Particles */}
          <div className="synced-celebration-particles">
            {Array.from({ length: celebrationIntensity * 15 }).map((_, i) => (
              <div 
                key={i} 
                className="synced-particle" 
                style={{ 
                  animationDelay: `${Math.random() * 2}s`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                {['🎉', '⭐', '✨', '🎊', '💰', '🏆', '🔥', '💎'][Math.floor(Math.random() * 8)]}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="synced-mourning-overlay">
          <div className="synced-mourning-content">
            <div className="synced-loss-text">💸 BETTER LUCK NEXT TIME</div>
            <div className="synced-loss-amount">
              -{wager > 0 ? <TokenValue amount={wager} /> : 'Try Again'}
            </div>
          </div>
          
          {/* Mourning Effects */}
          <div className="synced-mourning-particles">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="synced-mourning-particle" 
                style={{ 
                  animationDelay: `${Math.random() * 1.5}s`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              >
                {['😔', '💔', '😢', '😞'][Math.floor(Math.random() * 4)]}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Balance Display */}
      <div className="synced-balance-display">
        <div className="synced-balance-label">Balance:</div>
        <div className="synced-balance-value">
          <TokenValue amount={syncedBalance} />
        </div>
      </div>

      <style>{`
        /* Celebration Overlays */
        .synced-celebration-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          z-index: 1000;
          animation: syncedFadeIn 0.5s ease-in-out;
        }

        .synced-celebration-content {
          text-align: center;
          z-index: 1001;
        }

        .synced-win-level-text {
          font-size: 2.5rem;
          font-weight: bold;
          animation: syncedWinLevelPulse 1.5s ease-in-out infinite;
          margin-bottom: 12px;
        }

        .synced-nice-win-text {
          font-size: 2rem;
          color: #22c55e;
          animation: syncedNiceWinPulse 2s ease-in-out infinite;
          margin-bottom: 12px;
        }

        .synced-big-win-text {
          font-size: 2.5rem;
          color: #f97316;
          animation: syncedBigWinBounce 1.5s ease-in-out infinite;
          margin-bottom: 12px;
        }

        .synced-mega-win-text {
          font-size: 3rem;
          color: #a855f7;
          animation: syncedMegaWinExplosion 1s ease-in-out infinite;
          margin-bottom: 12px;
        }

        .synced-win-amount {
          font-size: 1.5rem;
          color: #ffd700;
          font-weight: bold;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
          margin-bottom: 8px;
        }

        .synced-win-payout {
          font-size: 1.2rem;
          color: #10b981;
          font-weight: bold;
          text-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
        }

        /* Mourning Overlay */
        .synced-mourning-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          z-index: 1000;
          animation: syncedFadeIn 0.5s ease-in-out;
        }

        .synced-mourning-content {
          text-align: center;
          z-index: 1001;
        }

        .synced-loss-text {
          font-size: 2rem;
          color: #ef4444;
          font-weight: bold;
          margin-bottom: 12px;
          animation: syncedLossShake 0.5s ease-in-out;
        }

        .synced-loss-amount {
          font-size: 1.2rem;
          color: #f87171;
          font-weight: bold;
        }

        /* Particles */
        .synced-celebration-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .synced-particle {
          position: absolute;
          font-size: 2rem;
          animation: syncedParticleFall 4s linear infinite;
          pointer-events: none;
        }

        .synced-mourning-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .synced-mourning-particle {
          position: absolute;
          font-size: 1.5rem;
          animation: syncedMourningFloat 5s ease-in-out infinite;
          pointer-events: none;
        }

        /* Balance Display */
        .synced-balance-display {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.8);
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 1002;
          animation: syncedBalanceUpdate 0.3s ease-in-out;
        }

        .synced-balance-label {
          font-size: 0.8rem;
          color: #9ca3af;
          margin-bottom: 4px;
        }

        .synced-balance-value {
          font-size: 1rem;
          color: #ffd700;
          font-weight: bold;
        }

        /* Animations */
        @keyframes syncedFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes syncedWinLevelPulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(2deg); }
        }

        @keyframes syncedNiceWinPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes syncedBigWinBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes syncedMegaWinExplosion {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(5deg); }
        }

        @keyframes syncedLossShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @keyframes syncedParticleFall {
          from {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes syncedMourningFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 0.3;
          }
        }

        @keyframes syncedBalanceUpdate {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        /* Celebration levels - can be extended for more levels */
        .celebration-level-1 {
          background: rgba(34, 197, 94, 0.1);
        }
        .celebration-level-1 .synced-win-level-text {
          color: #22c55e;
          animation: syncedNiceWinPulse 2s ease-in-out infinite;
        }

        .celebration-level-2 {
          background: rgba(249, 115, 22, 0.1);
        }
        .celebration-level-2 .synced-win-level-text {
          color: #f97316;
          animation: syncedBigWinBounce 1.5s ease-in-out infinite;
        }

        .celebration-level-3 {
          background: rgba(168, 85, 247, 0.1);
        }
        .celebration-level-3 .synced-win-level-text {
          color: #a855f7;
          animation: syncedMegaWinExplosion 1s ease-in-out infinite;
        }

        .celebration-level-4 {
          background: rgba(59, 130, 246, 0.1);
        }
        .celebration-level-4 .synced-win-level-text {
          color: #3b82f6;
          animation: syncedMegaWinExplosion 0.8s ease-in-out infinite;
        }

        .celebration-level-5 {
          background: rgba(236, 72, 153, 0.1);
        }
        .celebration-level-5 .synced-win-level-text {
          color: #ec4899;
          animation: syncedMegaWinExplosion 0.6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
