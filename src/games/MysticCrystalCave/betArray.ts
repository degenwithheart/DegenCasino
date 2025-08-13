// Bet arrays for different mystical cave paths
export const CAVE_PATHS = {
  crystal: [0, 2, 5, 10, 25],      // Crystal path - balanced magic energy
  shadow: [0, 0, 8, 18, 35],       // Shadow path - darker magic, higher risk
  light: [0, 0, 0, 15, 50],        // Light path - pure light magic, extreme risk
} as const

export type CavePath = keyof typeof CAVE_PATHS
