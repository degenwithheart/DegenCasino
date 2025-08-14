import { useState, useEffect } from 'react';

/**
 * useSyncedGameResult
 * 
 * Synchronizes the display of game results and balance updates with animation phases.
 * 
 * @param {object} result - The game result object (e.g., { win: true, amount: 10 }).
 * @param {number} balance - The current balance before the result.
 * @param {string} animationPhase - The current animation phase (e.g., 'IDLE', 'SPINNING', 'RESULT').
 * @param {string} triggerPhase - The animation phase at which to show the result and update balance.
 * @returns {object} { visibleResult, syncedBalance }
 */
export function useSyncedGameResult(result: any, balance: number, animationPhase: string, triggerPhase: string = 'RESULT') {
  const [visibleResult, setVisibleResult] = useState<any>(null);
  const [syncedBalance, setSyncedBalance] = useState<number>(balance);

  useEffect(() => {
    if (result && animationPhase === triggerPhase) {
      setVisibleResult(result);
      // Only update balance on win, otherwise keep it the same
      if (result.win) {
        setSyncedBalance(balance + result.amount);
      } else {
        setSyncedBalance(balance);
      }
    }
    // Optionally reset when animation returns to idle
    if (animationPhase === 'IDLE') {
      setVisibleResult(null);
      setSyncedBalance(balance);
    }
  }, [result, balance, animationPhase, triggerPhase]);

  return { visibleResult, syncedBalance };
}
