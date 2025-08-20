// Utility file to export HiLo bet array generator for audit purposes
import { HILO_CONFIG } from '../rtpConfig'

// Export bet array generator directly from rtpConfig only
export const generateBetArray = HILO_CONFIG.calculateBetArray;
