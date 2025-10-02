import { CRASH_CONFIG_V3 } from '../rtpConfig-v3'
import { BPS_PER_WHOLE } from 'gamba-core-v2'

// Use centralized crash configuration
export const calculateBetArray = (multiplier: number) => {
  return CRASH_CONFIG_V3.calculateBetArray(multiplier)
}


