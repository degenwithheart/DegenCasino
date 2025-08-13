// Pyramid Quest Game Bet Arrays
// Different entrance paths with varying risk/reward ratios

// Main entrance: Moderate risk, moderate reward
export const mainBetArray = [0, 0, 5, 15]

// Secret passage: High risk, high reward
export const secretBetArray = [0, 0, 0, 25]

// Side entrance: Balanced approach with multiple opportunities
export const sideBetArray = [0, 2, 8, 12]

// Default bet array
export const betArray = mainBetArray

// Export choices object for easy access
export const PYRAMID_QUEST_CHOICES = {
  main: mainBetArray,
  secret: secretBetArray,
  side: sideBetArray,
} as const

export type PyramidQuestChoice = keyof typeof PYRAMID_QUEST_CHOICES

/**
 * Get the bet array for a specific entrance choice
 * @param choice - The entrance type ('main', 'secret', or 'side')
 * @returns The corresponding bet array
 */
export function getBetArrayForChoice(choice: PyramidQuestChoice): number[] {
  return PYRAMID_QUEST_CHOICES[choice]
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
export const ENTRANCE_STATS = {
  main: {
    winChance: calculateWinChance(mainBetArray),
    maxMultiplier: getMaxMultiplier(mainBetArray),
    riskLevel: 'Medium',
    emoji: '🚪',
    description: 'Traditional entrance with known passages'
  },
  secret: {
    winChance: calculateWinChance(secretBetArray),
    maxMultiplier: getMaxMultiplier(secretBetArray),
    riskLevel: 'High',
    emoji: '🕳️',
    description: 'Hidden passage to the pharaoh\'s treasure'
  },
  side: {
    winChance: calculateWinChance(sideBetArray),
    maxMultiplier: getMaxMultiplier(sideBetArray),
    riskLevel: 'Low',
    emoji: '📍',
    description: 'Servant\'s entrance with multiple chambers'
  }
} as const
