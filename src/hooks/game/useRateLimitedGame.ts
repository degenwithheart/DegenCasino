import { useState, useEffect, useCallback, useRef } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useGame } from 'gamba-react-v2'

interface UseRateLimitedGameOptions {
  fetchMetadata?: boolean
  updateInterval?: number // milliseconds between updates
  criticalUpdatePhases?: string[] // phases that require immediate updates
}

interface RateLimitedGameState {
  game: any
  metadata: any
  lastUpdated: number
  isStale: boolean
}

/**
 * Custom hook that rate limits game state fetching to reduce RPC calls
 * Only fetches when absolutely necessary (phase changes, critical updates, or at intervals)
 */
export function useRateLimitedGame(
  gamePubkey: PublicKey | null,
  options: UseRateLimitedGameOptions = {}
) {
  const {
    fetchMetadata = true,
    updateInterval = 5000, // 5 seconds default
    criticalUpdatePhases = ['settled', 'waiting'] // phases requiring immediate updates
  } = options

  // Use the original gamba hook
  const { game: gambaGame, metadata: gambaMetadata } = useGame(gamePubkey, { fetchMetadata })

  const [cachedState, setCachedState] = useState<RateLimitedGameState>({
    game: gambaGame,
    metadata: gambaMetadata,
    lastUpdated: Date.now(),
    isStale: false
  })

  const lastGameStateRef = useRef<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialLoadRef = useRef(true)

  // Function to update cached state
  const updateCachedState = useCallback((game: any, metadata: any, isStale = false) => {
    setCachedState({
      game,
      metadata,
      lastUpdated: Date.now(),
      isStale
    })
  }, [])

  // Check if game state has changed significantly
  const hasGameStateChanged = useCallback((newGame: any, oldGame: any) => {
    if (!newGame || !oldGame) return true
    if (!newGame.state || !oldGame.state) return true

    // Check for phase changes
    if (newGame.state.waiting !== oldGame.state.waiting) return true
    if (newGame.state.playing !== oldGame.state.playing) return true
    if (newGame.state.settled !== oldGame.state.settled) return true

    // Check for critical data changes
    if (newGame.winnerIndexes !== oldGame.winnerIndexes) return true
    if (newGame.players?.length !== oldGame.players?.length) return true

    // Check for timestamp changes (game timing)
    if (newGame.softExpirationTimestamp !== oldGame.softExpirationTimestamp) return true
    if (newGame.hardExpirationTimestamp !== oldGame.hardExpirationTimestamp) return true

    return false
  }, [])

  // Check if current phase requires immediate updates
  const requiresImmediateUpdate = useCallback((game: any) => {
    if (!game?.state) return false
    return criticalUpdatePhases.some(phase => game.state[phase])
  }, [criticalUpdatePhases])

  // Main effect to manage rate limiting
  useEffect(() => {
    if (!gambaGame) return

    const now = Date.now()
    const timeSinceLastUpdate = now - cachedState.lastUpdated

    // Always update on initial load
    if (isInitialLoadRef.current) {
      updateCachedState(gambaGame, gambaMetadata, false)
      lastGameStateRef.current = gambaGame
      isInitialLoadRef.current = false
      return
    }

    // Update immediately if game state changed significantly
    if (hasGameStateChanged(gambaGame, lastGameStateRef.current)) {
      updateCachedState(gambaGame, gambaMetadata, false)
      lastGameStateRef.current = gambaGame
      return
    }

    // Update immediately if current phase requires it
    if (requiresImmediateUpdate(gambaGame)) {
      updateCachedState(gambaGame, gambaMetadata, false)
      lastGameStateRef.current = gambaGame
      return
    }

    // Mark as stale if it's been too long since last update
    if (timeSinceLastUpdate > updateInterval * 2) {
      setCachedState(prev => ({ ...prev, isStale: true }))
    }

    // Set up interval for periodic updates
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (gambaGame && hasGameStateChanged(gambaGame, lastGameStateRef.current)) {
          updateCachedState(gambaGame, gambaMetadata, false)
          lastGameStateRef.current = gambaGame
        } else {
          // Periodic refresh even if no changes
          updateCachedState(gambaGame, gambaMetadata, false)
        }
      }, updateInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [
    gambaGame,
    gambaMetadata,
    cachedState.lastUpdated,
    updateInterval,
    hasGameStateChanged,
    requiresImmediateUpdate,
    updateCachedState
  ])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  return {
    game: cachedState.game,
    metadata: cachedState.metadata,
    lastUpdated: cachedState.lastUpdated,
    isStale: cachedState.isStale,
    // Expose original gamba data for direct access if needed
    gambaGame,
    gambaMetadata
  }
}