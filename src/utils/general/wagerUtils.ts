import { useCurrentPool, useCurrentToken, useTokenMeta, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'

/**
 * Round wager to human-friendly precision based on token properties
 * - Takes into account the token's baseWager to determine appropriate display precision
 * - For 1e9 tokens (SOL): more precision needed for small amounts
 * - For 1e6 tokens (USDC): less precision needed
 */
export const roundToHumanFriendly = (amount: number, baseWager?: number): number => {
  if (amount === 0) return 0
  
  // If we have baseWager info, use it to determine appropriate precision
  if (baseWager) {
    // Convert to display units (divide by baseWager)
    const displayAmount = amount / baseWager
    
    // Determine precision based on display amount magnitude
    let precision: number
    if (displayAmount >= 10) {
      precision = 2 // e.g., 12.34
    } else if (displayAmount >= 1) {
      precision = 3 // e.g., 1.234
    } else if (displayAmount >= 0.1) {
      precision = 4 // e.g., 0.1234
    } else if (displayAmount >= 0.01) {
      precision = 4 // e.g., 0.0123
    } else if (displayAmount >= 0.001) {
      precision = 4 // e.g., 0.0012
    } else {
      precision = 4 // Keep reasonable precision for very small amounts
    }
    
    // Round to the determined precision in display units
    const factor = Math.pow(10, precision)
    const rounded = Math.round(displayAmount * factor) / factor
    return rounded * baseWager
  }
  
  // Fallback for when no baseWager is provided
  if (amount < 0.0001) {
    return Math.round(amount * 1000000) / 1000000 // 6 decimal places
  } else if (amount < 1) {
    return Math.round(amount * 10000) / 10000 // 4 decimal places
  } else {
    return Math.round(amount * 100) / 100 // 2 decimal places
  }
}

/**
 * Calculate minimum wager in token amount ($1 USD for real tokens)
 */
export const getMinimumWager = (token: any, meta: any) => {
  if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
    return meta?.baseWager ?? 0 // For free tokens, use base wager
  }

  // For real tokens, minimum is $1 USD
  const tokenPrice = meta?.usdPrice ?? 0
  if (tokenPrice > 0) {
    const tokenAmount = 1 / tokenPrice // $1 worth of tokens
    const rawAmount = tokenAmount * (meta?.baseWager ?? Math.pow(10, meta?.decimals ?? 9))
    return roundToHumanFriendly(rawAmount, meta?.baseWager) // Round with baseWager context
  }

  return meta?.baseWager ?? 0
}

/**
 * Calculate maximum wager based on pool maxPayout and multiplier
 * Ensures the bet won't exceed pool's maximum payout capacity
 */
export const getMaximumWager = (pool: any, multiplier: number = 1, baseWager?: number) => {
  if (!pool?.maxPayout) return Infinity
  const rawAmount = pool.maxPayout / multiplier
  return roundToHumanFriendly(rawAmount, baseWager) // Round with baseWager context
}

/**
 * Hook to get wager limits for current game context
 */
export const useWagerLimits = (multiplier: number = 1) => {
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const meta = useTokenMeta(token?.mint)

  const minWager = getMinimumWager(token, meta)
  const maxWager = getMaximumWager(pool, multiplier, meta?.baseWager)

  return {
    minWager,
    maxWager,
    pool,
    token,
    meta
  }
}

/**
 * Validate if a wager amount is within acceptable limits
 */
export const validateWager = (wager: number, minWager: number, maxWager: number) => {
  if (wager < minWager) {
    return { valid: false, reason: `Minimum wager is $${(minWager / (minWager > 0 ? minWager : 1)).toFixed(2)}` }
  }
  if (wager > maxWager) {
    return { valid: false, reason: `Maximum wager is $${(maxWager / (maxWager > 0 ? maxWager : 1)).toFixed(2)}` }
  }
  return { valid: true }
}
