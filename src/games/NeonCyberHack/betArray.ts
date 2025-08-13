// Neon Cyber Hack Game Bet Arrays
export const stealthBetArray = [0, 0, 2, 5, 10]  // Multiple small wins
export const bruteBetArray = [0, 0, 0, 15]       // Moderate risk
export const eliteBetArray = [0, 0, 0, 0, 25]    // Extreme risk/reward

export const betArray = stealthBetArray

export const NEON_CYBER_HACK_CHOICES = {
  stealth: stealthBetArray,
  brute: bruteBetArray,
  elite: eliteBetArray,
} as const

export type NeonCyberHackChoice = keyof typeof NEON_CYBER_HACK_CHOICES
