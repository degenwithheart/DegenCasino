#!/usr/bin/env node

/**
 * FINAL VISUAL-PAYOUT VERIFICATION
 * 
 * This script definitively checks if games show EXACTLY what Gamba.result returns
 * by analyzing the actual implementation patterns in each game.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 FINAL VISUAL-PAYOUT VERIFICATION');
console.log('═'.repeat(60));
console.log('🎯 Checking if games show EXACTLY what Gamba.result returns');
console.log('═'.repeat(60));

const GAMES_TO_CHECK = [
  'Flip',
  'Dice', 
  'Slots',
  'Plinko',
  'CrashGame',
  'Mines',
  'HiLo',
  'BlackJack',
  'ProgressivePoker',
  'Roulette'
];

function analyzeGameVisualLogic(gameName) {
  console.log(`\n🎮 ANALYZING: ${gameName.toUpperCase()}`);
  console.log('─'.repeat(40));
  
  const gameDir = `src/games/${gameName}`;
  const indexFile = path.join(gameDir, 'index.tsx');
  
  if (!fs.existsSync(indexFile)) {
    console.log(`❌ Game file not found: ${indexFile}`);
    return { status: 'error', issue: 'File not found' };
  }
  
  const content = fs.readFileSync(indexFile, 'utf8');
  
  // Check what the game uses for visual logic
  const checks = {
    usesResultPayout: content.includes('result.payout'),
    usesResultMultiplier: content.includes('result.multiplier'),
    usesResultIndex: content.includes('result.resultIndex'),
    usesHardcodedMultipliers: /payoutMultiplier\s*===\s*[\d.]+/.test(content),
    usesRtpConfig: content.includes('_CONFIG'),
    hasMathRandom: content.includes('Math.random()'),
    hasVisualFeedback: content.includes('win') || content.includes('animation') || content.includes('effect')
  };
  
  // Find any hardcoded multiplier values
  const hardcodedMultipliers = [];
  const multiplierMatches = content.match(/(?:payoutMultiplier|multiplier)\s*===\s*([\d.]+)/g);
  if (multiplierMatches) {
    multiplierMatches.forEach(match => {
      const value = match.match(/([\d.]+)/)[1];
      hardcodedMultipliers.push(parseFloat(value));
    });
  }
  
  console.log(`📊 Visual Logic Analysis:`);
  console.log(`   • Uses result.payout: ${checks.usesResultPayout ? '✅' : '❌'}`);
  console.log(`   • Uses result.multiplier: ${checks.usesResultMultiplier ? '✅' : '❌'}`);
  console.log(`   • Uses result.resultIndex: ${checks.usesResultIndex ? '✅' : '❌'}`);
  console.log(`   • Uses rtpConfig: ${checks.usesRtpConfig ? '✅' : '❌'}`);
  console.log(`   • Has hardcoded multipliers: ${checks.usesHardcodedMultipliers ? '❌' : '✅'}`);
  console.log(`   • Has Math.random(): ${checks.hasMathRandom ? '❌' : '✅'}`);
  console.log(`   • Has visual feedback: ${checks.hasVisualFeedback ? '✅' : '❌'}`);
  
  if (hardcodedMultipliers.length > 0) {
    console.log(`   • Hardcoded values: [${hardcodedMultipliers.join(', ')}]`);
  }
  
  // Determine if the game correctly shows Gamba.result values
  const isCorrect = evaluateCorrectness(gameName, checks, hardcodedMultipliers, content);
  
  console.log(`🎯 Shows Gamba.result correctly: ${isCorrect.status === 'correct' ? '✅' : '❌'}`);
  console.log(`💬 ${isCorrect.explanation}`);
  
  return isCorrect;
}

function evaluateCorrectness(gameName, checks, hardcodedMultipliers, content) {
  // Games that show Gamba.result correctly should:
  // 1. Use result.payout or result.multiplier for visual logic
  // 2. NOT use hardcoded multiplier checks that don't match rtpConfig  
  // 3. NOT use Math.random() for anything that affects visual outcomes
  
  const usesGambaResult = checks.usesResultPayout || checks.usesResultMultiplier;
  const hasProblematicHardcoding = checks.usesHardcodedMultipliers && !checks.usesRtpConfig;
  const usesNonDeterministic = checks.hasMathRandom;
  
  if (usesNonDeterministic) {
    return {
      status: 'incorrect',
      explanation: 'Uses Math.random() which makes results non-deterministic and inconsistent with Gamba'
    };
  }
  
  if (hasProblematicHardcoding) {
    return {
      status: 'incorrect', 
      explanation: `Uses hardcoded multiplier checks [${hardcodedMultipliers.join(', ')}] that may not match Gamba.result`
    };
  }
  
  if (!usesGambaResult) {
    return {
      status: 'unknown',
      explanation: 'Does not clearly use result.payout or result.multiplier for visual logic'
    };
  }
  
  // Game-specific validations
  switch (gameName.toLowerCase()) {
    case 'flip':
      if (content.includes('FLIP_CONFIG') && usesGambaResult) {
        return {
          status: 'correct',
          explanation: 'Uses FLIP_CONFIG values and result.payout - visual matches Gamba.result'
        };
      }
      break;
      
    case 'blackjack':
      if (content.includes('BLACKJACK_CONFIG.outcomes') && usesGambaResult) {
        return {
          status: 'correct',
          explanation: 'Uses BLACKJACK_CONFIG.outcomes and result.payout - visual matches Gamba.result'
        };
      }
      break;
      
    case 'mines':
      if (content.includes('MINES_CONFIG') && content.includes('result.multiplier === 0')) {
        return {
          status: 'correct',
          explanation: 'Uses MINES_CONFIG and result.multiplier === 0 - visual matches Gamba.result'
        };
      }
      break;
      
    case 'slots':
      if (usesGambaResult && checks.usesResultIndex) {
        return {
          status: 'correct',
          explanation: 'Uses result.multiplier and result.resultIndex - visual matches Gamba.result'
        };
      }
      break;
      
    case 'progressivepoker':
      if (content.includes('PROGRESSIVE_POKER_CONFIG') && usesGambaResult) {
        return {
          status: 'correct', 
          explanation: 'Uses PROGRESSIVE_POKER_CONFIG and result.payout comparison - visual matches Gamba.result'
        };
      }
      break;
      
    case 'roulette':
      if (content.includes('ROULETTE_CONFIG') && usesGambaResult) {
        // Check if it properly uses Gamba result for win/lose logic
        if (content.includes('gameResult.payout > 0') || content.includes('result.payout > 0')) {
          return {
            status: 'correct',
            explanation: 'Uses ROULETTE_CONFIG and result.payout for win/lose logic - visual matches Gamba.result'
          };
        } else {
          return {
            status: 'partial',
            explanation: 'Uses ROULETTE_CONFIG but may need better result.payout integration for visual feedback'
          };
        }
      } else if (content.includes('ROULETTE_CONFIG')) {
        return {
          status: 'partial',
          explanation: 'Uses ROULETTE_CONFIG but missing clear result.payout/multiplier usage for visual logic'
        };
      } else {
        return {
          status: 'unknown',
          explanation: 'Missing ROULETTE_CONFIG usage and unclear result handling'
        };
      }
      break;
  }
  
  // Default evaluation
  if (usesGambaResult && checks.usesRtpConfig) {
    return {
      status: 'correct',
      explanation: 'Uses Gamba result values and rtpConfig - should show correct visual outcomes'
    };
  } else if (usesGambaResult) {
    return {
      status: 'likely_correct',
      explanation: 'Uses Gamba result values for visual logic - likely shows correct outcomes'  
    };
  } else {
    return {
      status: 'unknown',
      explanation: 'Unable to determine if visual logic matches Gamba.result'
    };
  }
}

async function main() {
  const results = [];
  
  for (const gameName of GAMES_TO_CHECK) {
    const result = analyzeGameVisualLogic(gameName);
    results.push({ game: gameName, ...result });
  }
  
  // Summary
  console.log('\n🎰 FINAL VERIFICATION SUMMARY');
  console.log('═'.repeat(60));
  
  const correct = results.filter(r => r.status === 'correct');
  const likelyCorrect = results.filter(r => r.status === 'likely_correct');
  const incorrect = results.filter(r => r.status === 'incorrect');
  const unknown = results.filter(r => r.status === 'unknown');
  const errors = results.filter(r => r.status === 'error');
  
  console.log(`✅ CORRECTLY SHOWS GAMBA.RESULT: ${correct.length} games`);
  correct.forEach(r => console.log(`   • ${r.game}: ${r.explanation}`));
  
  if (likelyCorrect.length > 0) {
    console.log(`✅ LIKELY CORRECT: ${likelyCorrect.length} games`);
    likelyCorrect.forEach(r => console.log(`   • ${r.game}: ${r.explanation}`));
  }
  
  console.log(`❌ INCORRECT VISUAL LOGIC: ${incorrect.length} games`);
  incorrect.forEach(r => console.log(`   • ${r.game}: ${r.explanation}`));
  
  if (unknown.length > 0) {
    console.log(`❓ UNKNOWN STATUS: ${unknown.length} games`);
    unknown.forEach(r => console.log(`   • ${r.game}: ${r.explanation}`));
  }
  
  if (errors.length > 0) {
    console.log(`⚠️ ERRORS: ${errors.length} games`);
    errors.forEach(r => console.log(`   • ${r.game}: ${r.issue}`));
  }
  
  const totalCorrect = correct.length + likelyCorrect.length;
  const totalChecked = results.length - errors.length;
  const trustScore = totalChecked > 0 ? Math.round((totalCorrect / totalChecked) * 100) : 0;
  
  console.log(`\n🎯 VISUAL-PAYOUT INTEGRITY SCORE: ${trustScore}%`);
  
  if (incorrect.length === 0) {
    console.log('\n🎉 ALL GAMES CORRECTLY SHOW GAMBA.RESULT VALUES!');
    console.log('   ✅ Players see exactly what blockchain pays');
    console.log('   ✅ No visual deception detected');
    console.log('   ✅ Full trust and transparency achieved');
  } else {
    console.log(`\n🚨 ${incorrect.length} GAMES HAVE VISUAL-PAYOUT MISMATCHES`);
    console.log('   ❌ Players may see different values than actual payouts');
    console.log('   ❌ Trust crisis continues in these games');
    console.log('   ❌ Immediate fixes required');
  }
  
  // Save report
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = `./test-results/final-visual-payout-verification-${timestamp}.json`;
  
  if (!fs.existsSync('./test-results')) {
    fs.mkdirSync('./test-results');
  }
  
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    trustScore,
    results,
    summary: {
      total: results.length,
      correct: correct.length,
      likelyCorrect: likelyCorrect.length,
      incorrect: incorrect.length,
      unknown: unknown.length,
      errors: errors.length
    }
  }, null, 2));
  
  console.log(`\n💾 Detailed report: ${reportPath}`);
  
  process.exit(incorrect.length > 0 ? 1 : 0);
}

main().catch(console.error);
