import { CRASH_CONFIG } from '../rtpConfig'
import { BPS_PER_WHOLE } from 'gamba-core-v2'

// Use centralized crash configuration
export const calculateBetArray = (multiplier: number) => {
  return CRASH_CONFIG.calculateBetArray(multiplier)
}


