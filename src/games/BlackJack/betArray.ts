// Utility file to export Blackjack bet arrays for audit purposes
import { BLACKJACK_CONFIG } from '../rtpConfig'

// Export bet array directly from rtpConfig only
export const generateBlackjackBetArray = () => BLACKJACK_CONFIG.betArray;
