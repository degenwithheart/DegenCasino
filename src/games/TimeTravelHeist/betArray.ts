// Bet arrays for different time periods with varying security levels
export const TIME_PERIODS = {
  medieval: [0, 1, 4, 8, 20],      // Medieval era - simpler security, moderate rewards
  modern: [0, 0, 6, 15, 30],       // Modern era - advanced security, good rewards
  future: [0, 0, 0, 12, 45],       // Future era - quantum security, legendary rewards
} as const

export type TimePeriod = keyof typeof TIME_PERIODS
