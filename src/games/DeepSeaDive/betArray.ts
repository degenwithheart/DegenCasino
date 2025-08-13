// Bet arrays for different dive depths with increasing risk/reward
export const DEPTH_CHOICES = {
  shallow: [0, 0, 3, 7, 15],    // Shallow dive - safer waters, smaller pearls
  deep: [0, 0, 0, 12, 20],      // Deep dive - dangerous depths, better rewards
  abyss: [0, 0, 0, 0, 30],      // Abyssal dive - monster territory, legendary pearls
} as const

export type DepthChoice = keyof typeof DEPTH_CHOICES
