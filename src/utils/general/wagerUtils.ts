import { useCurrentPool, useCurrentToken, useTokenMeta, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'

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
    return tokenAmount * (meta?.baseWager ?? Math.pow(10, meta?.decimals ?? 9))
  }

  return meta?.baseWager ?? 0
}

/**
 * Calculate maximum wager based on pool maxPayout and multiplier
 * Ensures the bet won't exceed pool's maximum payout capacity
 */
export const getMaximumWager = (pool: any, multiplier: number = 1) => {
  if (!pool?.maxPayout) return Infinity
  return pool.maxPayout / multiplier
}

/**
 * Hook to get wager limits for current game context
 */
export const useWagerLimits = (multiplier: number = 1) => {
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const meta = useTokenMeta(token?.mint)

  const minWager = getMinimumWager(token, meta)
  const maxWager = getMaximumWager(pool, multiplier)

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
