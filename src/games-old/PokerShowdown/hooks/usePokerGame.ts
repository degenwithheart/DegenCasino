import { useState, useCallback, useEffect } from 'react'
import { DrawStrategy, STRATEGY_PRESETS } from '../types'
import { POKER_SHOWDOWN_CONFIG } from '../../rtpConfigMultiplayer'

/**
 * Hook for managing player strategy selection
 */
export function usePlayerStrategy() {
  const [selectedStrategy, setSelectedStrategy] = useState<DrawStrategy>(STRATEGY_PRESETS.BALANCED)
  const [isCustomStrategy, setIsCustomStrategy] = useState(false)
  
  const selectPresetStrategy = useCallback((presetName: keyof typeof STRATEGY_PRESETS) => {
    setSelectedStrategy(STRATEGY_PRESETS[presetName])
    setIsCustomStrategy(false)
  }, [])
  
  const updateCustomStrategy = useCallback((updates: Partial<DrawStrategy>) => {
    setSelectedStrategy(prev => ({ ...prev, ...updates }))
    setIsCustomStrategy(true)
  }, [])
  
  const resetToDefault = useCallback(() => {
    setSelectedStrategy(STRATEGY_PRESETS.BALANCED)
    setIsCustomStrategy(false)
  }, [])
  
  return {
    selectedStrategy,
    isCustomStrategy,
    selectPresetStrategy,
    updateCustomStrategy,
    resetToDefault
  }
}

/**
 * Hook for managing game state and timing
 */
export function usePokerGameState() {
  const [gamePhase, setGamePhase] = useState<'lobby' | 'strategy' | 'playing' | 'results'>('lobby')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isReady, setIsReady] = useState(false)
  
  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && gamePhase === 'strategy') {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && gamePhase === 'strategy') {
      // Auto-submit when time runs out
      setGamePhase('playing')
    }
  }, [timeRemaining, gamePhase])
  
  const startStrategyPhase = useCallback(() => {
    setGamePhase('strategy')
    setTimeRemaining(POKER_SHOWDOWN_CONFIG.STRATEGY_TIME_SECONDS)
  }, [])
  
  const startGame = useCallback(() => {
    setGamePhase('playing')
    setTimeRemaining(0)
  }, [])
  
  const showResults = useCallback(() => {
    setGamePhase('results')
  }, [])
  
  const returnToLobby = useCallback(() => {
    setGamePhase('lobby')
    setIsReady(false)
    setTimeRemaining(0)
  }, [])
  
  const toggleReady = useCallback(() => {
    setIsReady(prev => !prev)
  }, [])
  
  return {
    gamePhase,
    timeRemaining,
    isReady,
    startStrategyPhase,
    startGame,
    showResults,
    returnToLobby,
    toggleReady
  }
}

/**
 * Hook for managing multiplayer game statistics
 */
export function usePokerStats() {
  const [stats, setStats] = useState<{
    gamesPlayed: number
    gamesWon: number
    totalWinnings: number
    bestHand: string
    favoriteStrategy: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE'
    winRate: number
  }>({
    gamesPlayed: 0,
    gamesWon: 0,
    totalWinnings: 0,
    bestHand: 'HIGH_CARD',
    favoriteStrategy: 'BALANCED',
    winRate: 0
  })
  
  const updateStats = useCallback((
    won: boolean, 
    winnings: number, 
    handRank: string, 
    strategy: DrawStrategy
  ) => {
    setStats(prev => {
      const newGamesPlayed = prev.gamesPlayed + 1
      const newGamesWon = prev.gamesWon + (won ? 1 : 0)
      const newWinRate = newGamesWon / newGamesPlayed
      
      // Determine strategy name
      let strategyName: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE' = 'BALANCED'
      if (strategy.riskLevel === 'conservative') strategyName = 'CONSERVATIVE'
      else if (strategy.riskLevel === 'aggressive') strategyName = 'AGGRESSIVE'
      
      return {
        gamesPlayed: newGamesPlayed,
        gamesWon: newGamesWon,
        totalWinnings: prev.totalWinnings + winnings,
        bestHand: isHandBetter(handRank, prev.bestHand) ? handRank : prev.bestHand,
        favoriteStrategy: strategyName,
        winRate: newWinRate
      }
    })
  }, [])
  
  const resetStats = useCallback(() => {
    setStats({
      gamesPlayed: 0,
      gamesWon: 0,
      totalWinnings: 0,
      bestHand: 'HIGH_CARD',
      favoriteStrategy: 'BALANCED',
      winRate: 0
    })
  }, [])
  
  return {
    stats,
    updateStats,
    resetStats
  }
}

/**
 * Helper function to compare hand rankings
 */
function isHandBetter(newHand: string, currentBest: string): boolean {
  const rankings = {
    'HIGH_CARD': 1,
    'PAIR': 2,
    'TWO_PAIR': 3,
    'THREE_KIND': 4,
    'STRAIGHT': 5,
    'FLUSH': 6,
    'FULL_HOUSE': 7,
    'FOUR_KIND': 8,
    'STRAIGHT_FLUSH': 9,
    'ROYAL_FLUSH': 10
  }
  
  return (rankings[newHand as keyof typeof rankings] || 1) > (rankings[currentBest as keyof typeof rankings] || 1)
}