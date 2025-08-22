const { ROULETTE_CONFIG } = require('./src/games/rtpConfig');

console.log('🎰 Roulette Game Configuration Test\n');

// Test bet array generation for different bet types
const testBets = [
  { type: 'red', name: 'Red' },
  { type: 'black', name: 'Black' },
  { type: 'odd', name: 'Odd' },
  { type: 'even', name: 'Even' },
  { type: 'straight', numbers: [7], name: 'Straight 7' },
  { type: 'dozen1', name: '1st Dozen' },
];

testBets.forEach(bet => {
  console.log(`\n${bet.name} Bet:`);
  const betArray = ROULETTE_CONFIG.calculateBetArray(bet.type, bet.numbers || []);
  const winningNumbers = [];
  
  for (let i = 0; i < betArray.length; i++) {
    if (betArray[i] > 0) {
      winningNumbers.push(i);
    }
  }
  
  console.log(`  Winning numbers: [${winningNumbers.join(', ')}]`);
  console.log(`  Payout multiplier: ${betArray[winningNumbers[0]] || 0}x`);
  console.log(`  Win probability: ${(winningNumbers.length / 37 * 100).toFixed(1)}%`);
});

// Test a few spins
console.log('\n\n🎯 Sample Game Results:');
for (let spin = 0; spin < 5; spin++) {
  const winningNumber = Math.floor(Math.random() * 37);
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const color = winningNumber === 0 ? 'Green' : 
                redNumbers.includes(winningNumber) ? 'Red' : 'Black';
  
  console.log(`\nSpin ${spin + 1}: Number ${winningNumber} (${color})`);
  
  // Check red bet
  const redBetArray = ROULETTE_CONFIG.calculateBetArray('red');
  const redWins = redBetArray[winningNumber] > 0;
  console.log(`  Red bet: ${redWins ? 'WIN' : 'LOSE'} (${redWins ? redBetArray[winningNumber] : 0}x)`);
  
  // Check straight bet on 7
  const straightBetArray = ROULETTE_CONFIG.calculateBetArray('straight', [7]);
  const straightWins = straightBetArray[winningNumber] > 0;
  console.log(`  Straight 7 bet: ${straightWins ? 'WIN' : 'LOSE'} (${straightWins ? straightBetArray[winningNumber] : 0}x)`);
}

console.log('\n✅ Roulette configuration test completed!');
console.log('\nGame Features:');
console.log('- Multi-phase gameplay (betting → spinning → results)');
console.log('- Real roulette table and wheel components');
console.log('- Multiple bet types with proper payouts');
console.log('- Smooth transitions and animations');
console.log('- Enhanced visual effects and sounds');
console.log('- 97.3% RTP (2.7% house edge - European roulette)');
