// getBestPossibleHandName.ts
import { Card } from "./getCurrentHandName";

export function getBestPossibleHandName(
  revealed: Card[],
  remainingDeck: Card[],
  slotsRemaining: number
): string {
  if (slotsRemaining === 0) return "No cards remaining";

  // If already best hand
  const currentRank = handRank(revealed);
  if (currentRank === 9) return "Royal Flush Achieved";

  // Simulate if best hand possible with remaining slots
  for (let rank = 9; rank >= 1; rank--) {
    if (canMakeHand(rank, revealed, remainingDeck, slotsRemaining)) {
      return handName(rank);
    }
  }

  return "Bust — No possible winning hand";
}

// Poker hand ranking (simplified): 9=Royal Flush ... 1=Pair, 0=High Card
function handRank(cards: Card[]): number {
  // You could reuse your evaluation logic here
  if (cards.length < 5) return 0;
  // Placeholder: always return 0 if incomplete
  return 0;
}

function canMakeHand(
  targetRank: number,
  revealed: Card[],
  remainingDeck: Card[],
  slotsRemaining: number
): boolean {
  // Basic placeholder logic for now — real version would try combinations
  return true; // Assume possible unless proven impossible
}

function handName(rank: number): string {
  const names = [
    "High Card", "Pair", "Two Pair", "Three of a Kind",
    "Straight", "Flush", "Full House", "Four of a Kind", "Straight Flush", "Royal Flush"
  ];
  return names[rank] || "Unknown";
}
