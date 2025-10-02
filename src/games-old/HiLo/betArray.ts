// Utility file to export HiLo bet array generator for audit purposes
import { BET_ARRAYS_V3 } from '../rtpConfig-v3'
import { BPS_PER_WHOLE } from 'gamba-core-v2'

// Export bet array generator directly from rtpConfig only
export const generateBetArray = BET_ARRAYS_V3.hilo.calculateBetArray;
