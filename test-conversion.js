// Test script to verify lamports conversion logic
const testPlays = [
  { wager: 15040000, payout: 22620160 }, // ~0.015 SOL wagered
  { wager: 5000000, payout: 0 }, // ~0.005 SOL wagered  
  { wager: 10000000, payout: 15000000 } // ~0.01 SOL wagered
];

// Test current conversion logic
testPlays.forEach((play, index) => {
  const rawWager = parseFloat(play.wager) || 0;
  const wager = rawWager / 1e9; // Always convert from lamports
  console.log(`Play ${index + 1}: ${rawWager} lamports = ${wager} SOL`);
});

// Test total volume
const totalVolume = testPlays.reduce((total, play) => {
  const rawWager = parseFloat(play.wager) || 0;
  const wager = rawWager / 1e9;
  return total + wager;
}, 0);

console.log(`Total volume: ${totalVolume} SOL`);
console.log(`Expected: ~0.03 SOL`);