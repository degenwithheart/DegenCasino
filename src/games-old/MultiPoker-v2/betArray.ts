import { BET_ARRAYS_V3 } from '../rtpConfig-v3'
import { BPS_PER_WHOLE } from 'gamba-core-v2'

export const getBetArray = () => (BET_ARRAYS_V3 as any)['multipoker'].calculateBetArray()