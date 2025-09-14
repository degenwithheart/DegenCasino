import { useEffect } from 'react'
import { useCurrentPool, useCurrentToken, useTokenMeta } from 'gamba-react-ui-v2'
import { BET_ARRAYS } from '../../games/rtpConfig'
import { BET_ARRAYS_V2 } from '../../games/rtpConfig-v2'
import { getMinimumWager, getMaximumWager } from './wagerUtils'

/**
 * Game configuration mapping for dynamic multiplier calculation
 */
type GameConfig = {
  type: 'v1' | 'v2'
  key: string
  getMaxMultiplier: (gameParams?: any) => number
}

/**
 * Game configurations with their RTP config mappings
 */
const GAME_CONFIGS: Record<string, GameConfig> = {
  // V1 Games (rtpConfig.ts)
  'plinko': {
    type: 'v1',
    key: 'plinko',
    getMaxMultiplier: (params?: { mode?: 'normal' | 'degen' }) => {
      const mode = params?.mode || 'normal'
      return Math.max(...BET_ARRAYS.plinko[mode])
    }
  },
  'slots': {
    type: 'v1', 
    key: 'slots',
    getMaxMultiplier: () => Math.max(...BET_ARRAYS.slots.betArray)
  },
  'dice': {
    type: 'v1',
    key: 'dice', 
    getMaxMultiplier: () => {
      // Dice max multiplier depends on roll-under, but for pool limits use worst case (roll under 1)
      const betArray = BET_ARRAYS.dice.calculateBetArray(1)
      return Math.max(...betArray)
    }
  },
  'crash': {
    type: 'v1',
    key: 'crash',
    getMaxMultiplier: (params?: { targetMultiplier?: number }) => {
      // For crash, use a reasonable high multiplier for pool calculations
      return params?.targetMultiplier || 1000
    }
  },
  'mines': {
    type: 'v1',
    key: 'mines',
    getMaxMultiplier: (params?: { mineCount?: number }) => {
      const mineCount = params?.mineCount || 1 // Use safest case
      return BET_ARRAYS.mines.getMultiplier(mineCount, BET_ARRAYS.mines.GRID_SIZE - mineCount)
    }
  },
  'hilo': {
    type: 'v1',
    key: 'hilo',
    getMaxMultiplier: () => {
      // HiLo max multiplier is when current rank is highest/lowest
      const betArray = BET_ARRAYS.hilo.calculateBetArray(12, true) // Highest rank betting Hi
      return Math.max(...betArray)
    }
  },
  'flip': {
    type: 'v1',
    key: 'flip', 
    getMaxMultiplier: (params?: { coins?: number, target?: number }) => {
      const coins = params?.coins || 1
      const target = params?.target || 1
      const betArray = BET_ARRAYS.flip.calculateBetArray(coins, target, 'heads')
      return Math.max(...betArray)
    }
  },
  'blackjack': {
    type: 'v1',
    key: 'blackjack',
    getMaxMultiplier: () => Math.max(...BET_ARRAYS.blackjack.betArray)
  },
  'progressivepoker': {
    type: 'v1', 
    key: 'progressivepoker',
    getMaxMultiplier: () => Math.max(...BET_ARRAYS.progressivepoker.betArray)
  },
  'roulette': {
    type: 'v1',
    key: 'roulette',
    getMaxMultiplier: () => {
      // Roulette max is straight up bet
      const betArray = BET_ARRAYS.roulette.calculateBetArray('straight', [0])
      return Math.max(...betArray)
    }
  },

  // V2 Games (rtpConfig-v2.ts)
  'dice-v2': {
    type: 'v2',
    key: 'dice-v2', 
    getMaxMultiplier: () => {
      const betArray = BET_ARRAYS_V2['dice-v2'].calculateBetArray(1) // Roll under 1 = highest multiplier
      return Math.max(...betArray)
    }
  },
  'multipoker-v2': {
    type: 'v2',
    key: 'multipoker-v2',
    getMaxMultiplier: () => {
      const betArray = BET_ARRAYS_V2['multipoker-v2'].calculateBetArray()
      return Math.max(...betArray)
    }
  },
  'flip-v2': {
    type: 'v2',
    key: 'flip-v2',
    getMaxMultiplier: (params?: { coins?: number, target?: number }) => {
      const coins = params?.coins || 1
      const target = params?.target || 1
      const betArray = BET_ARRAYS_V2['flip-v2'].calculateBetArray(coins, target, 'heads')
      return Math.max(...betArray)
    }
  },
  'blackjack-v2': {
    type: 'v2',
    key: 'blackjack-v2',
    getMaxMultiplier: () => {
      const betArray = BET_ARRAYS_V2['blackjack-v2'].calculateBetArray()
      return Math.max(...betArray)
    }
  },
  'mines-v2': {
    type: 'v2',
    key: 'mines-v2',
    getMaxMultiplier: (params?: { mineCount?: number }) => {
      const mineCount = params?.mineCount || 1
      const gridSize = BET_ARRAYS_V2['mines-v2'].GRID_SIZE
      return BET_ARRAYS_V2['mines-v2'].getMultiplier(mineCount, gridSize - mineCount)
    }
  }
}

/**
 * Unified hook for automatic wager adjustment with multiplier-based pool capping
 * 
 * @param gameId - The game identifier (e.g., 'plinko', 'dice-v2', 'slots')
 * @param wager - Current wager amount
 * @param setWager - Function to update wager
 * @param gameParams - Game-specific parameters for multiplier calculation
 * @param customMultiplier - Override multiplier calculation with custom value
 */
export const useWagerAdjustment = (
  gameId: string,
  wager: number,
  setWager: (value: number) => void,
  gameParams?: any,
  customMultiplier?: number
) => {
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const meta = useTokenMeta(token?.mint)

  // Get minimum wager (always $1.00 USD equivalent)
  const minWager = getMinimumWager(token, meta)

  // Calculate maximum multiplier for this game
  const maxMultiplier = customMultiplier || (() => {
    const gameConfig = GAME_CONFIGS[gameId]
    if (!gameConfig) {
      console.warn(`No game config found for ${gameId}, using default multiplier of 1`)
      return 1
    }
    return gameConfig.getMaxMultiplier(gameParams)
  })()

  // Calculate maximum wager based on pool and multiplier
  const maxWager = getMaximumWager(pool, maxMultiplier)

  // Force default wager to $1.00 USD on mount
  useEffect(() => {
    if (!pool || !token || !meta || minWager <= 0) return
    
    // Set default wager to $1.00 USD equivalent on first mount when wager is 0
    if (wager === 0) {
      setWager(minWager)
    }
  }, [pool, token, meta, minWager]) // Only run when dependencies change, not on wager changes

  // Automatic wager adjustment effect
  useEffect(() => {
    if (!pool || !token || !meta) return

    let adjustedWager = wager

    // Clamp to minimum wager
    if (adjustedWager < minWager) {
      adjustedWager = minWager
    }

    // Clamp to maximum wager for pool
    if (adjustedWager > maxWager) {
      adjustedWager = maxWager
    }

    // Only update if wager actually changed
    if (adjustedWager !== wager) {
      setWager(adjustedWager)
    }
  }, [wager, minWager, maxWager, setWager, pool, token, meta])

  return {
    minWager,
    maxWager,
    maxMultiplier,
    isValid: wager >= minWager && wager <= maxWager,
    poolExceeded: wager * maxMultiplier > pool.maxPayout
  }
}

/**
 * Hook specifically for control components (EnhancedWagerInput, MobileControls)
 * Automatically handles wager adjustment without requiring game-specific knowledge
 */
export const useWagerAdjustmentForControls = (
  wager: number,
  setWager: (value: number) => void,
  multiplier: number = 1
) => {
  const pool = useCurrentPool()
  const token = useCurrentToken() 
  const meta = useTokenMeta(token?.mint)

  const minWager = getMinimumWager(token, meta)
  const maxWager = getMaximumWager(pool, multiplier)

  // Force default wager to $1.00 USD on mount
  useEffect(() => {
    if (!pool || !token || !meta || minWager <= 0) return
    
    // Set default wager to $1.00 USD equivalent on first mount 
    // This will override whatever useWagerInput() initializes to
    setWager(minWager)
  }, [pool, token, meta, minWager]) // Only run when dependencies change, not on wager changes

  // Automatic adjustment effect
  useEffect(() => {
    if (!pool || !token || !meta) return

    let adjustedWager = wager

    // Clamp to minimum
    if (adjustedWager < minWager && adjustedWager > 0) {
      adjustedWager = minWager
    }
    // Clamp to maximum
    else if (adjustedWager > maxWager) {
      adjustedWager = maxWager
    }

    // Only update if wager actually changed
    if (adjustedWager !== wager) {
      setWager(adjustedWager)
    }
  }, [wager, minWager, maxWager, setWager, pool, token, meta])

  return {
    minWager,
    maxWager,
    multiplier,
    isValid: wager >= minWager && wager <= maxWager,
    poolExceeded: wager * multiplier > pool.maxPayout
  }
}