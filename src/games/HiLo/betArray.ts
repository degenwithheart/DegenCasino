// Utility file to export HiLo bet array generator for audit purposes
import { HILO_CONFIG } from '../rtpConfig'
import { BPS_PER_WHOLE } from 'gamba-core-v2'

// Export bet array generator directly from rtpConfig only
export const generateBetArray = HILO_CONFIG.calculateBetArray;
