import { CRASH_CONFIG } from '../rtpConfig'

// Use centralized crash configuration
export const calculateBetArray = (multiplier: number) => {
  return CRASH_CONFIG.calculateBetArray(multiplier)
}


