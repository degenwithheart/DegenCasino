// Utility file to export Mines bet calculation for audit purposes
import { MINES_CONFIG } from '../rtpConfig'

// Export bet array generator directly from rtpConfig only
export const generateMinesBetArray = MINES_CONFIG.generateBetArray;
