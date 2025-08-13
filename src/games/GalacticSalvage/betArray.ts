// Galactic Salvage Game Bet Arrays
// Different salvage routes with varying risk/reward ratios

// Safe route: Higher chance of finding something, lower max reward
export const safeBetArray = [0, 2, 3, 10]

// Risky route: Lower chance but better rewards  
export const riskyBetArray = [0, 0, 5, 15]

// Extreme route: Very low chance but massive rewards
export const extremeBetArray = [0, 0, 0, 25]

// Default bet array
export const betArray = safeBetArray

// Export choices object for easy access
export const GALACTIC_SALVAGE_CHOICES = {
  safe: safeBetArray,
  risky: riskyBetArray,
  extreme: extremeBetArray,
} as const

export type GalacticSalvageChoice = keyof typeof GALACTIC_SALVAGE_CHOICES

/**
 * Get the bet array for a specific route choice
 * @param choice - The route type ('safe', 'risky', or 'extreme')
 * @returns The corresponding bet array
 */
export function getBetArrayForChoice(choice: GalacticSalvageChoice): number[] {
  return GALACTIC_SALVAGE_CHOICES[choice]
}

/**
 * Calculate the win chance for a given bet array
 * @param betArray - Array of payout multipliers
 * @returns Win chance as a percentage (0-100)
 */
export function calculateWinChance(betArray: number[]): number {
  const winningPositions = betArray.filter(multiplier => multiplier > 0).length
  return Math.round((winningPositions / betArray.length) * 100)
}

/**
 * Get the maximum multiplier for a given bet array
 * @param betArray - Array of payout multipliers
 * @returns The highest multiplier in the array
 */
export function getMaxMultiplier(betArray: number[]): number {
  return Math.max(...betArray)
}

// Precomputed statistics for quick access
export const ROUTE_STATS = {
  safe: {
    winChance: calculateWinChance(safeBetArray),
    maxMultiplier: getMaxMultiplier(safeBetArray),
    riskLevel: 'Low',
    emoji: '🛡️',
    description: 'Safe sectors with reliable salvage'
  },
  risky: {
    winChance: calculateWinChance(riskyBetArray),
    maxMultiplier: getMaxMultiplier(riskyBetArray),
    riskLevel: 'Medium',
    emoji: '⚡',
    description: 'Unstable sectors with valuable cargo'
  },
  extreme: {
    winChance: calculateWinChance(extremeBetArray),
    maxMultiplier: getMaxMultiplier(extremeBetArray),
    riskLevel: 'High',
    emoji: '🔥',
    description: 'Deep space sectors with legendary artifacts'
  }
} as const
