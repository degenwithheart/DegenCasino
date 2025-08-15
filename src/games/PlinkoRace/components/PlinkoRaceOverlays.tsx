import React from 'react';
import { SyncedWinLossOverlay } from '../../../components/SyncedWinLossOverlay';
import { GamePhase } from '../../../hooks/useGameState';

interface PlinkoRaceOverlaysProps {
  gamePhase: GamePhase;
  thinkingPhase: boolean;
  dramaticPause: boolean;
  celebrationIntensity: number;
  currentWin?: {
    multiplier: number;
    amount: number;
  };
  thinkingEmoji: string;
  result?: any;
  currentBalance: number;
  wager: number;
}

export const PlinkoRaceOverlays: React.FC<PlinkoRaceOverlaysProps> = ({
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
  // Custom win levels for PlinkoRace
  const plinkoRaceWinLevels = [
    { 
      minMultiplier: 1, 
      maxMultiplier: 3, 
      intensity: 1,
      label: "Good Race!",
      emoji: "🏁",
      className: "win-small"
    },
    { 
      minMultiplier: 3, 
      maxMultiplier: 10, 
      intensity: 2,
      label: "Amazing Race!",
      emoji: "🏆",
      className: "win-medium"
    },
    { 
      minMultiplier: 10, 
      maxMultiplier: 1000, 
      intensity: 3,
      label: "CHAMPION!",
      emoji: "🥇",
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
        winLevels={plinkoRaceWinLevels}
      />

      {/* Dramatic Thinking Overlay */}
      {gamePhase === 'thinking' && thinkingPhase && (
        <div className="thinking-overlay">
          <div className="thinking-content">
            <div className="thinking-emoji">{thinkingEmoji}</div>
            <div className="thinking-text">Racing in progress...</div>
            <div className="thinking-subtext">🏁 Balls are racing down... 🏁</div>
          </div>
        </div>
      )}

      {/* Dramatic Pause Overlay */}
      {gamePhase === 'dramatic' && dramaticPause && (
        <div className="dramatic-pause-overlay">
          <div className="dramatic-pause-content">
            <div className="pause-emoji">⏰</div>
            <div className="pause-text">Photo Finish...</div>
          </div>
        </div>
      )}

      {/* Celebration Overlays */}
      {gamePhase === 'celebrating' && celebrationIntensity > 0 && (
        <div className={`celebration-overlay celebration-level-${celebrationIntensity}`}>
          <div className="celebration-content">
            {celebrationIntensity >= 3 && (
              <>
                <div className="mega-win-text">🥇 CHAMPION! 🥇</div>
                <div className="win-amount">{currentWin && `${currentWin.multiplier}x MULTIPLIER!`}</div>
              </>
            )}
            {celebrationIntensity === 2 && (
              <>
                <div className="big-win-text">🏆 AMAZING RACE! 🏆</div>
                <div className="win-amount">{currentWin && `${currentWin.multiplier}x MULTIPLIER!`}</div>
              </>
            )}
            {celebrationIntensity === 1 && (
              <>
                <div className="small-win-text">🏁 WINNER! 🏁</div>
                <div className="win-amount">{currentWin && `${currentWin.multiplier}x MULTIPLIER!`}</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mourning Overlay */}
      {gamePhase === 'mourning' && (
        <div className="mourning-overlay">
          <div className="mourning-content">
            <div className="mourning-emoji">😢</div>
            <div className="mourning-text">Better luck next race!</div>
            <div className="mourning-subtext">🏁 The race continues... 🏁</div>
          </div>
        </div>
      )}
    </>
  );
};
