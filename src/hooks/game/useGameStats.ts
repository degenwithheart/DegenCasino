import { useState, useCallback, useEffect } from 'react';

export interface GameStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
}

export interface UseGameStatsReturn {
  stats: GameStats;
  updateStats: (profit: number) => void;
  resetStats: () => void;
  winRate: number;
  isOnFire: boolean;
  isRekt: boolean;
}

const initialStats: GameStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0
};

// Storage keys
const GLOBAL_STORAGE_KEY = 'degenheart-global-game-stats';
const getGameStorageKey = (gameId: string) => `degenheart-game-stats-${gameId}`;

// Load stats from localStorage
const loadStats = (gameId?: string): GameStats => {
  try {
    const key = gameId ? getGameStorageKey(gameId) : GLOBAL_STORAGE_KEY;
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure we only keep the fields we want (remove sessionProfit and bestWin if they exist)
      return {
        gamesPlayed: parsed.gamesPlayed || 0,
        wins: parsed.wins || 0,
        losses: parsed.losses || 0
      };
    }
  } catch (error) {
    console.warn('Failed to load game stats from localStorage:', error);
  }
  return initialStats;
};

// Save stats to localStorage
const saveStats = (stats: GameStats, gameId?: string): void => {
  try {
    const key = gameId ? getGameStorageKey(gameId) : GLOBAL_STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to save game stats to localStorage:', error);
  }
};

// Update global stats when game-specific stats are updated
const updateGlobalStats = (profit: number): void => {
  const globalStats = loadStats(); // Load global stats (no gameId)
  const isWin = profit > 0;

  const newGlobalStats = {
    gamesPlayed: globalStats.gamesPlayed + 1,
    wins: globalStats.wins + (isWin ? 1 : 0),
    losses: globalStats.losses + (isWin ? 0 : 1)
  };

  saveStats(newGlobalStats); // Save global stats (no gameId)
};

export function useGameStats(gameId?: string): UseGameStatsReturn {
  const [stats, setStats] = useState<GameStats>(() => loadStats(gameId));

  const updateStats = useCallback((profit: number) => {
    const isWin = profit > 0;

    setStats(prev => {
      const newStats = {
        gamesPlayed: prev.gamesPlayed + 1,
        wins: prev.wins + (isWin ? 1 : 0),
        losses: prev.losses + (isWin ? 0 : 1)
      };
      saveStats(newStats, gameId);
      return newStats;
    });

    // Always update global stats when any game is played
    updateGlobalStats(profit);
  }, [gameId]);

  const resetStats = useCallback(() => {
    setStats(initialStats);
    saveStats(initialStats, gameId);
  }, [gameId]);

  const winRate = stats.gamesPlayed > 0 ? (stats.wins / stats.gamesPlayed) * 100 : 0;
  const isOnFire = winRate > 60;
  const isRekt = winRate < 30 && stats.gamesPlayed > 5;

  return {
    stats,
    updateStats,
    resetStats,
    winRate,
    isOnFire,
    isRekt
  };
}

// Hook for accessing global stats (for user profile sidebar)
export function useGlobalGameStats(): UseGameStatsReturn {
  return useGameStats(); // No gameId = global stats
}