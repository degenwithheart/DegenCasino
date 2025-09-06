// Utility file to export Progressive Poker bet arrays for audit purposes
import { PROGRESSIVE_POKER_CONFIG } from '../rtpConfig'

// Export weighted bet array for audit integration using rtpConfig
export const getBetArray = () => PROGRESSIVE_POKER_CONFIG.createWeightedBetArray()

// Export the config directly for convenience
export { PROGRESSIVE_POKER_CONFIG }

// Export function to get the raw multiplier array (for reference)
export const getRawMultipliers = () => PROGRESSIVE_POKER_CONFIG.betArray
