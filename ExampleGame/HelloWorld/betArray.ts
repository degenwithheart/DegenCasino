// HelloWorld Game Bet Arrays
// This file defines the payout multipliers for different game choices

// Lucky choice: 33% chance to win 2x (safer option)
export const luckyBetArray = [2, 0, 0]

// Risky choice: 20% chance to win 3x (higher risk, higher reward)
export const riskyBetArray = [3, 0, 0, 0, 0]

// Default bet array (can be used for backward compatibility)
export const betArray = luckyBetArray

// Export choices object for easy access
export const HELLO_WORLD_CHOICES = {
  lucky: luckyBetArray,
  risky: riskyBetArray,
} as const

export type HelloWorldChoice = keyof typeof HELLO_WORLD_CHOICES

/**
 * Get the bet array for a specific choice
 * @param choice - The choice type ('lucky' or 'risky')
 * @returns The corresponding bet array
 */
export function getBetArrayForChoice(choice: HelloWorldChoice): number[] {
  return HELLO_WORLD_CHOICES[choice]
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
export const CHOICE_STATS = {
  lucky: {
    winChance: calculateWinChance(luckyBetArray),
    maxMultiplier: getMaxMultiplier(luckyBetArray),
    riskLevel: 'Low',
    emoji: '🍀'
  },
  risky: {
    winChance: calculateWinChance(riskyBetArray),
    maxMultiplier: getMaxMultiplier(riskyBetArray),
    riskLevel: 'High',
    emoji: '🎯'
  }
} as const
