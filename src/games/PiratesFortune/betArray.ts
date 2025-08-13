// Pirate's Fortune Game Bet Arrays
// Different sailing routes with varying risk/reward ratios

// Coastal route: Safer waters, moderate rewards
export const coastalBetArray = [0, 2, 3, 8]

// Deep sea route: More dangerous, better rewards
export const deepBetArray = [0, 0, 5, 12]

// Storm route: Treacherous waters, massive rewards
export const stormBetArray = [0, 0, 0, 20]

// Default bet array
export const betArray = coastalBetArray

export const PIRATES_FORTUNE_CHOICES = {
  coastal: coastalBetArray,
  deep: deepBetArray,
  storm: stormBetArray,
} as const

export type PiratesFortuneChoice = keyof typeof PIRATES_FORTUNE_CHOICES

export function getBetArrayForChoice(choice: PiratesFortuneChoice): number[] {
  return PIRATES_FORTUNE_CHOICES[choice]
}

export function calculateWinChance(betArray: number[]): number {
  const winningPositions = betArray.filter(multiplier => multiplier > 0).length
  return Math.round((winningPositions / betArray.length) * 100)
}

export function getMaxMultiplier(betArray: number[]): number {
  return Math.max(...betArray)
}

export const ROUTE_STATS = {
  coastal: {
    winChance: calculateWinChance(coastalBetArray),
    maxMultiplier: getMaxMultiplier(coastalBetArray),
    riskLevel: 'Low',
    emoji: '🏖️',
    description: 'Safe coastal waters with regular treasure'
  },
  deep: {
    winChance: calculateWinChance(deepBetArray),
    maxMultiplier: getMaxMultiplier(deepBetArray),
    riskLevel: 'Medium',
    emoji: '🌊',
    description: 'Deep ocean routes to lost pirate coves'
  },
  storm: {
    winChance: calculateWinChance(stormBetArray),
    maxMultiplier: getMaxMultiplier(stormBetArray),
    riskLevel: 'High',
    emoji: '⛈️',
    description: 'Stormy seas leading to legendary treasure'
  }
} as const
