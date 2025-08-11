// getCurrentHandName.ts
export interface Card {
  rank: number // 0 = A, 1 = K, ... 12 = 2
  suit: number // 0-3
}


export function getCurrentHandName(cards: Card[]): string {
  if (cards.length < 5) return "Incomplete Hand";

  // Sort ranks for easier matching
  const ranks = cards.map(c => c.rank).sort((a, b) => a - b);
  const suits = cards.map(c => c.suit);
  const rankCounts: Record<number, number> = {};
  ranks.forEach(r => rankCounts[r] = (rankCounts[r] || 0) + 1);
  const counts = Object.values(rankCounts).sort((a, b) => b - a);
  const isFlush = new Set(suits).size === 1;
  // Handle Ace-low straight
  const isStraight = ranks.length === 5 && (
    ranks[4] - ranks[0] === 4 && new Set(ranks).size === 5 ||
    JSON.stringify(ranks) === JSON.stringify([0, 9, 10, 11, 12]) // A, 10, J, Q, K
  );

  if (isFlush && isStraight && ranks.includes(0) && ranks.includes(9)) return "Royal Flush";
  if (isFlush && isStraight) return "Straight Flush";
  if (counts[0] === 4) return "Four of a Kind";
  if (counts[0] === 3 && counts[1] === 2) return "Full House";
  if (isFlush) return "Flush";
  if (isStraight) return "Straight";
  if (counts[0] === 3) return "Three of a Kind";
  if (counts[0] === 2 && counts[1] === 2) return "Two Pair";
  if (counts[0] === 2) {
    // Jacks or Better
    const pairRank = Number(Object.keys(rankCounts).find(r => rankCounts[Number(r)] === 2));
    if (pairRank <= 3 || pairRank === 0) return "Jacks or Better"; // 0:A, 1:K, 2:Q, 3:J
    return "Pair";
  }
  return "Bust";
}

function rankName(rank: number) {
  const names = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
  return names[rank] || "?";
}
