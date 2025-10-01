// Utility file to export Plinko bet arrays for audit purposes
import { BET_ARRAYS_V3 } from '../rtpConfig-v3'
import { BPS_PER_WHOLE } from 'gamba-core-v2'

// Export bet arrays directly from rtpConfig-v3
export const BET = BET_ARRAYS_V3.plinko.calculateBetArray('normal')
export const DEGEN_BET = BET_ARRAYS_V3.plinko.calculateBetArray('degen')
