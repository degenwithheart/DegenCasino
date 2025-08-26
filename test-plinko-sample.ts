// Test the fixed sample simulation for Plinko
const runSample = (bet: readonly number[] | number[], plays: number, wager = 1, gameName?: string) => {
  const betArray = Array.isArray(bet) ? bet : [...bet]
  if (betArray.length === 0) return { plays:0, wins:0, totalWager:0, totalPayout:0 }
  let wins = 0, payout = 0
  
  // Special handling for Plinko - use binomial distribution instead of uniform
  const isPlinko = gameName?.includes('Plinko')
  const isStandardPlinko = gameName?.includes('Standard')
  
  for (let i = 0; i < plays; i++) {
    let idx: number
    
    if (isPlinko) {
      // Use binomial distribution for Plinko (matches actual game physics)
      const rows = isStandardPlinko ? 14 : 12
      let sum = 0
      for (let trial = 0; trial < rows; trial++) {
        sum += Math.random() < 0.5 ? 1 : 0
      }
      idx = sum // This gives us the binomial distribution index
    } else {
      // Use uniform distribution for all other games
      idx = Math.floor(Math.random() * betArray.length)
    }
    
    const m = betArray[idx] || 0
    if (m > 0) wins++
    payout += m * wager
  }
  return { plays, wins, totalWager: plays * wager, totalPayout: payout }
}

// Import the actual arrays
import { PLINKO_CONFIG } from './src/games/rtpConfig';

console.log('=== TESTING FIXED SAMPLE SIMULATION ===');

// Test uniform vs binomial for Plinko Standard
const uniformResult = runSample(PLINKO_CONFIG.normal, 10000, 1, 'Other Game');
const binomialResult = runSample(PLINKO_CONFIG.normal, 10000, 1, 'Plinko Standard');

console.log('Plinko Normal Array:', PLINKO_CONFIG.normal);
console.log('');
console.log('Uniform simulation (wrong):', {
  rtpPercent: ((uniformResult.totalPayout / uniformResult.totalWager) * 100).toFixed(2) + '%',
  winRate: ((uniformResult.wins / uniformResult.plays) * 100).toFixed(2) + '%'
});
console.log('Binomial simulation (correct):', {
  rtpPercent: ((binomialResult.totalPayout / binomialResult.totalWager) * 100).toFixed(2) + '%',  
  winRate: ((binomialResult.wins / binomialResult.plays) * 100).toFixed(2) + '%'
});

// Test Degen mode too
const degenBinomial = runSample(PLINKO_CONFIG.degen, 10000, 1, 'Plinko Degen');
console.log('Plinko Degen binomial:', {
  rtpPercent: ((degenBinomial.totalPayout / degenBinomial.totalWager) * 100).toFixed(2) + '%',
  winRate: ((degenBinomial.wins / degenBinomial.plays) * 100).toFixed(2) + '%'
});
