// Utility file to export Plinko bet arrays for audit purposes
import { PLINKO_CONFIG } from '../rtpConfig'
import { BPS_PER_WHOLE } from 'gamba-core-v2'

// Export bet arrays directly from rtpConfig only
export const BET = PLINKO_CONFIG.normal
export const DEGEN_BET = PLINKO_CONFIG.degen
