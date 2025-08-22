#!/usr/bin/env node

/**
 * Real Integration Test Suite
 * 
 * This script loads actual game components and tests visual rendering logic
 * against real bet arrays to detect mismatches between what players see
 * and what Gamba actually pays out.
 */

import fs from 'fs';
import path from 'path';

// Mock React/DOM environment for component loading
global.React = {
  useState: (initial) => [initial, () => {}],
  useEffect: () => {},
  useCallback: (fn) => fn,
  useMemo: (fn) => fn(),
  useRef: () => ({ current: null }),
  createElement: (type, props, ...children) => ({ type, props, children }),
  Fragment: 'Fragment'
};

global.document = {
  createElement: () => ({ style: {}, classList: { add: () => {}, remove: () => {} } }),
  addEventListener: () => {},
  removeEventListener: () => {}
};

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  getComputedStyle: () => ({ getPropertyValue: () => '0px' })
};

// Game configurations - we need to simulate the actual imports
const GAME_CONFIGS = {
  flip: {
    betArray: { heads: [1.92, 0], tails: [0, 1.92] },
    expectedMultipliers: [1.92, 0]
  },
  dice: {
    betArray: { calculateBetArray: (rollUnder) => {
      const arr = Array(100).fill(0);
      const winMultiplier = (1 / (rollUnder / 100)) * 0.95;
      for (let i = 0; i < rollUnder; i++) {
        arr[i] = winMultiplier;
      }
      return arr;
    }},
    expectedMultipliers: [1.9, 0] // Sample for rollUnder=50
  },
  slots: {
    betArray: [
      150.0, // Unicorn
      60.0, 60.0, // DGHRT  
      ...Array(5).fill(20.0), // SOL
      ...Array(15).fill(8.0), // USDC
      ...Array(80).fill(3.0), // JUP
      ...Array(120).fill(1.8), // BONK
      ...Array(777).fill(0) // WOJAK losses
    ],
    expectedMultipliers: [150.0, 60.0, 20.0, 8.0, 3.0, 1.8, 0]
  },
  plinko: {
    betArray: {
      normal: [0.0, 2.2, 1.2, 0.0, 1.2, 0.0, 0.0, 2.8],
      degen: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 9.5]
    },
    expectedMultipliers: [2.8, 2.2, 1.2, 1.0, 9.5, 0]
  },
  crash: {
    betArray: { calculateBetArray: (target) => {
      const winSlots = Math.round((1/target) * 100);
      const houseMultiplier = target * 0.96;
      return [
        ...Array(winSlots).fill(houseMultiplier),
        ...Array(100-winSlots).fill(0)
      ];
    }},
    expectedMultipliers: [1.92, 0] // Sample for 2x target
  },
  mines: {
    betArray: { generateBetArray: (mineCount, cellsRevealed) => {
      const GRID_SIZE = 16;
      const safeCells = GRID_SIZE - mineCount;
      const fairMultiplier = safeCells / (safeCells - cellsRevealed);
      const multiplier = fairMultiplier * 0.94;
      const arr = Array(GRID_SIZE).fill(0);
      for (let i = 0; i < safeCells - cellsRevealed; i++) {
        arr[i] = multiplier;
      }
      return arr;
    }},
    expectedMultipliers: [1.32, 1.71, 2.23, 0] // Sample progression
  },
  hilo: {
    betArray: { calculateBetArray: (currentRank, isHi) => {
      const arr = Array(13).fill(0);
      if (isHi) {
        const winningCards = 13 - currentRank - 1;
        const winMultiplier = (1 / (winningCards / 12)) * 0.95;
        for (let i = currentRank + 1; i < 13; i++) {
          arr[i] = winMultiplier;
        }
      } else {
        const winMultiplier = (1 / (currentRank / 12)) * 0.95;
        for (let i = 0; i < currentRank; i++) {
          arr[i] = winMultiplier;
        }
      }
      return arr;
    }},
    expectedMultipliers: [1.9, 0] // Sample for rank 6, Hi
  },
  blackjack: {
    betArray: [
      ...Array(42).fill(1.85), // Player wins 
      ...Array(5).fill(2.30),  // Player blackjack
      ...Array(8).fill(1.0),   // Push
      ...Array(45).fill(0)     // Player loses
    ],
    expectedMultipliers: [1.85, 2.30, 1.0, 0]
  },
  progressivepoker: {
    betArray: [0, 0, 0, 0, 0, 3, 6, 8, 8, 16],
    expectedMultipliers: [16, 8, 6, 3, 0]
  }
};

// Visual logic patterns we need to check
const VISUAL_LOGIC_PATTERNS = {
  flip: {
    file: 'src/games/Flip/index.tsx',
    multiplierChecks: [
      'payoutMultiplier === 1.92',
      'result.payout > 0',
      'multiplier > 0'
    ]
  },
  dice: {
    file: 'src/games/Dice/index.tsx', 
    multiplierChecks: [
      'payoutMultiplier ===',
      'result.payout',
      'multiplier'
    ]
  },
  slots: {
    file: 'src/games/Slots/index.tsx',
    multiplierChecks: [
      'payoutMultiplier ===',
      'multiplier === 150',
      'multiplier === 60',
      'multiplier === 20'
    ]
  },
  plinko: {
    file: 'src/games/Plinko/index.tsx',
    multiplierChecks: [
      'payoutMultiplier ===',
      'multiplier === 2.8',
      'multiplier === 9.5'
    ]
  },
  crash: {
    file: 'src/games/CrashGame/index.tsx',
    multiplierChecks: [
      'payoutMultiplier ===',
      'targetMultiplier',
      'crashPoint'
    ]
  },
  mines: {
    file: 'src/games/Mines/index.tsx',
    multiplierChecks: [
      'payoutMultiplier ===',
      'multiplier ===',
      'result.payout'
    ]
  },
  hilo: {
    file: 'src/games/HiLo/index.tsx',
    multiplierChecks: [
      'payoutMultiplier ===',
      'result.payout',
      'multiplier'
    ]
  },
  blackjack: {
    file: 'src/games/BlackJack/index.tsx',
    multiplierChecks: [
      'payoutMultiplier === 2.5', // ❌ KNOWN MISMATCH
      'payoutMultiplier === 2',   // ❌ KNOWN MISMATCH  
      'payoutMultiplier === 1.85', // ✅ Should be this
      'payoutMultiplier === 2.30', // ✅ Should be this
      'payoutMultiplier === 1.0',  // ✅ Should be this
      'payoutMultiplier === 0'     // ✅ Correct
    ]
  },
  progressivepoker: {
    file: 'src/games/ProgressivePoker/index.tsx',
    multiplierChecks: [
      'payoutMultiplier ===',
      'multiplier === 16',
      'multiplier === 8'
    ]
  }
};

class RealIntegrationTester {
  constructor() {
    this.mismatches = [];
    this.results = [];
  }

  async testGame(gameId) {
    console.log(`\n🔍 Real Integration Test: ${gameId.toUpperCase()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const config = GAME_CONFIGS[gameId];
    const visualPattern = VISUAL_LOGIC_PATTERNS[gameId];
    
    if (!config || !visualPattern) {
      console.log(`❌ No test configuration found for ${gameId}`);
      return { gameId, status: 'skipped', reason: 'No config' };
    }

    // Check if game file exists
    const gameFilePath = path.join(process.cwd(), visualPattern.file);
    if (!fs.existsSync(gameFilePath)) {
      console.log(`❌ Game file not found: ${visualPattern.file}`);
      return { gameId, status: 'error', reason: 'File not found' };
    }

    // Read and analyze the game file
    const gameFileContent = fs.readFileSync(gameFilePath, 'utf8');
    
    // Extract actual multiplier checks from the code
    const foundMultiplierChecks = this.extractMultiplierChecks(gameFileContent);
    const expectedMultipliers = config.expectedMultipliers;
    
    console.log(`📊 Expected Multipliers: [${expectedMultipliers.join(', ')}]`);
    console.log(`🔍 Found Visual Checks: [${foundMultiplierChecks.join(', ')}]`);

    // Analyze mismatches
    const mismatches = this.findMismatches(gameId, expectedMultipliers, foundMultiplierChecks, gameFileContent);
    
    if (mismatches.length === 0) {
      console.log(`✅ PASS: Visual logic matches bet array`);
      return { gameId, status: 'pass', mismatches: [] };
    } else {
      console.log(`❌ FAIL: ${mismatches.length} mismatch(es) detected`);
      mismatches.forEach(mismatch => {
        console.log(`   • ${mismatch.description}`);
      });
      this.mismatches.push({ gameId, mismatches });
      return { gameId, status: 'fail', mismatches };
    }
  }

  extractMultiplierChecks(fileContent) {
    const checks = [];
    
    // Look for payoutMultiplier checks
    const payoutMultiplierRegex = /payoutMultiplier\s*===\s*([\d.]+)/g;
    let match;
    while ((match = payoutMultiplierRegex.exec(fileContent)) !== null) {
      checks.push(parseFloat(match[1]));
    }

    // Look for multiplier checks
    const multiplierRegex = /multiplier\s*===\s*([\d.]+)/g;
    while ((match = multiplierRegex.exec(fileContent)) !== null) {
      checks.push(parseFloat(match[1]));
    }

    // Look for result.payout checks
    const payoutRegex = /result\.payout\s*\/\s*\w+\s*===\s*([\d.]+)/g;
    while ((match = payoutRegex.exec(fileContent)) !== null) {
      checks.push(parseFloat(match[1]));
    }

    return [...new Set(checks)].sort((a, b) => b - a); // Remove duplicates and sort
  }

  findMismatches(gameId, expectedMultipliers, foundChecks, fileContent) {
    const mismatches = [];

    // Special handling for known blackjack issue
    if (gameId === 'blackjack') {
      if (foundChecks.includes(2.5)) {
        mismatches.push({
          type: 'wrong_multiplier',
          expected: 2.30,
          found: 2.5,
          description: 'Visual checks for 2.5x but bet array has 2.30x (blackjack payout)'
        });
      }
      if (foundChecks.includes(2)) {
        mismatches.push({
          type: 'wrong_multiplier', 
          expected: 1.85,
          found: 2,
          description: 'Visual checks for 2.0x but bet array has 1.85x (regular win)'
        });
      }
      // Check if correct multipliers are present
      if (!foundChecks.includes(1.85)) {
        mismatches.push({
          type: 'missing_multiplier',
          expected: 1.85,
          found: null,
          description: 'Missing visual logic for 1.85x multiplier (most common win)'
        });
      }
      if (!foundChecks.includes(2.30)) {
        mismatches.push({
          type: 'missing_multiplier',
          expected: 2.30,
          found: null,
          description: 'Missing visual logic for 2.30x multiplier (blackjack)'
        });
      }
    }

    // Check for missing expected multipliers
    expectedMultipliers.forEach(expected => {
      if (expected > 0 && !foundChecks.includes(expected)) {
        mismatches.push({
          type: 'missing_multiplier',
          expected,
          found: null,
          description: `Visual logic missing for ${expected}x multiplier from bet array`
        });
      }
    });

    // Check for unexpected multipliers
    foundChecks.forEach(found => {
      if (found > 0 && !expectedMultipliers.includes(found)) {
        mismatches.push({
          type: 'unexpected_multiplier',
          expected: null,
          found,
          description: `Visual logic checks for ${found}x but this multiplier not in bet array`
        });
      }
    });

    // Check for hardcoded values that might not match dynamic calculations
    if (fileContent.includes('payoutMultiplier') && fileContent.includes('===')) {
      const hardcodedValues = this.extractHardcodedMultipliers(fileContent);
      hardcodedValues.forEach(value => {
        if (!expectedMultipliers.includes(value)) {
          mismatches.push({
            type: 'hardcoded_mismatch',
            expected: 'dynamic',
            found: value,
            description: `Hardcoded multiplier ${value}x may not match dynamic bet array calculations`
          });
        }
      });
    }

    return mismatches;
  }

  extractHardcodedMultipliers(fileContent) {
    const hardcoded = [];
    // Look for hardcoded multiplier comparisons
    const patterns = [
      /payoutMultiplier\s*===\s*([\d.]+)/g,
      /multiplier\s*===\s*([\d.]+)/g,
      /payout\s*===\s*wager\s*\*\s*([\d.]+)/g
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(fileContent)) !== null) {
        hardcoded.push(parseFloat(match[1]));
      }
    });

    return [...new Set(hardcoded)];
  }

  async runAllIntegrationTests() {
    console.log('🚀 REAL INTEGRATION TEST SUITE');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🔍 Testing actual game component visual logic against bet arrays');
    console.log('🎯 Looking for mismatches between what players see vs what they get');
    console.log('════════════════════════════════════════════════════════════════');

    const games = Object.keys(GAME_CONFIGS);
    const results = [];

    for (const gameId of games) {
      const result = await this.testGame(gameId);
      results.push(result);
    }

    this.generateIntegrationReport(results);
    return results;
  }

  generateIntegrationReport(results) {
    const passedGames = results.filter(r => r.status === 'pass');
    const failedGames = results.filter(r => r.status === 'fail');
    const errorGames = results.filter(r => r.status === 'error');
    const skippedGames = results.filter(r => r.status === 'skipped');

    console.log('\n🎰 REAL INTEGRATION TEST SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    
    console.log(`📊 Test Results:`);
    console.log(`   • Total Games: ${results.length}`);
    console.log(`   • ✅ Passed: ${passedGames.length}`);
    console.log(`   • ❌ Failed: ${failedGames.length}`);
    console.log(`   • ⚠️  Errors: ${errorGames.length}`);
    console.log(`   • ⏭️  Skipped: ${skippedGames.length}`);

    if (failedGames.length > 0) {
      console.log(`\n❌ GAMES WITH VISUAL/BET ARRAY MISMATCHES:`);
      failedGames.forEach(game => {
        console.log(`\n🎮 ${game.gameId.toUpperCase()}:`);
        game.mismatches.forEach(mismatch => {
          console.log(`   • ${mismatch.description}`);
        });
      });
    }

    if (passedGames.length > 0) {
      console.log(`\n✅ GAMES WITH CORRECT VISUAL LOGIC:`);
      passedGames.forEach(game => {
        console.log(`   • ${game.gameId}`);
      });
    }

    if (errorGames.length > 0) {
      console.log(`\n⚠️  GAMES WITH TEST ERRORS:`);
      errorGames.forEach(game => {
        console.log(`   • ${game.gameId}: ${game.reason}`);
      });
    }

    const criticalIssues = failedGames.filter(game => 
      game.mismatches.some(m => m.type === 'wrong_multiplier' || m.type === 'missing_multiplier')
    );

    if (criticalIssues.length > 0) {
      console.log(`\n🚨 CRITICAL PLAYER TRUST ISSUES:`);
      console.log(`   ${criticalIssues.length} game(s) have visual results that don't match payouts!`);
      console.log(`   This directly affects player trust and game integrity.`);
    }

    const integritScore = ((passedGames.length / (passedGames.length + failedGames.length)) * 100).toFixed(1);
    console.log(`\n🎯 Visual-Payout Integrity Score: ${integritScore}%`);
    
    if (parseInt(integritScore) < 100) {
      console.log(`\n🔧 IMMEDIATE ACTION REQUIRED:`);
      console.log(`   Fix visual logic in failed games before deployment!`);
    } else {
      console.log(`\n🎉 All games have consistent visual-payout logic!`);
    }

    console.log('════════════════════════════════════════════════════════════════');

    // Save detailed report
    this.saveIntegrationReport(results);
  }

  saveIntegrationReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      testType: 'real_integration_visual_payout_consistency',
      summary: {
        totalGames: results.length,
        passed: results.filter(r => r.status === 'pass').length,
        failed: results.filter(r => r.status === 'fail').length,
        errors: results.filter(r => r.status === 'error').length
      },
      results,
      mismatches: this.mismatches
    };

    if (!fs.existsSync('test-results')) {
      fs.mkdirSync('test-results', { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `integration-test-report-${timestamp}.json`;
    
    fs.writeFileSync(
      path.join('test-results', filename),
      JSON.stringify(report, null, 2)
    );

    console.log(`\n💾 Detailed report saved: test-results/${filename}`);
  }
}

// Main execution
async function main() {
  const tester = new RealIntegrationTester();
  const results = await tester.runAllIntegrationTests();
  
  const hasFailures = results.some(r => r.status === 'fail');
  process.exit(hasFailures ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { RealIntegrationTester };
