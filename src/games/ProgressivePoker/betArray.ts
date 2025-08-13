
// Standard Jacks or Better payout array with 10% house edge:
// [Bust, Jacks or Better, Two Pair, Three of a Kind, Straight, Flush, Full House, Four of a Kind, Straight Flush, Royal Flush]
export const JACKS_OR_BETTER_BET_ARRAY = [
  0,    // 0: Bust
  0.9,  // 1: Jacks or Better (Pair) - 0.9x instead of 1x
  1.8,  // 2: Two Pair - 1.8x instead of 2x
  2.7,  // 3: Three of a Kind - 2.7x instead of 3x
  3.6,  // 4: Straight - 3.6x instead of 4x
  5.4,  // 5: Flush - 5.4x instead of 6x
  8.1,  // 6: Full House - 8.1x instead of 9x
  22.5, // 7: Four of a Kind - 22.5x instead of 25x
  45,   // 8: Straight Flush - 45x instead of 50x
  720,  // 9: Royal Flush - 720x instead of 800x
]
