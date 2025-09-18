import { useState, useCallback } from 'react'

export interface GameStats {
  gamesPlayed: number
  wins: number
  losses: number
  sessionProfit: number
  bestWin: number
}

export interface UseGameStatsReturn {
  stats: GameStats
  updateStats: (profit: number) => void
  resetStats: () => void
  winRate: number
  isOnFire: boolean
  isRekt: boolean
}

const initialStats: GameStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  sessionProfit: 0,
  bestWin: 0
}

export function useGameStats(): UseGameStatsReturn {
  const [stats, setStats] = useState<GameStats>(initialStats)

  const updateStats = useCallback((profit: number) => {
    const isWin = profit > 0
    
    setStats(prev => ({
      gamesPlayed: prev.gamesPlayed + 1,
      wins: prev.wins + (isWin ? 1 : 0),
      losses: prev.losses + (isWin ? 0 : 1),
      sessionProfit: prev.sessionProfit + profit,
      bestWin: Math.max(prev.bestWin, profit)
    }))
  }, [])

  const resetStats = useCallback(() => {
    setStats(initialStats)
  }, [])

  const winRate = stats.gamesPlayed > 0 ? (stats.wins / stats.gamesPlayed) * 100 : 0
  const isOnFire = winRate > 60
  const isRekt = winRate < 30 && stats.gamesPlayed > 5

  return {
    stats,
    updateStats,
    resetStats,
    winRate,
    isOnFire,
    isRekt
  }
}