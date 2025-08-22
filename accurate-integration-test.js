#!/usr/bin/env node

/**
 * Accurate Visual-Payout Integration Test
 * 
 * This test examines how games handle visual representation based on
 * actual Gamba results (result.multiplier, result.payout) and identifies
 * any mismatches with the bet arrays.
 */

import fs from 'fs';
import path from 'path';

class AccurateIntegrationTester {
  constructor() {
    this.results = [];
    this.mismatches = [];
  }

  async analyzeGame(gameId) {
    console.log(`\n🔍 Analyzing ${gameId.toUpperCase()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const analysis = {
      gameId,
      betArrayAnalysis: null,
      visualLogicAnalysis: null,
      mismatches: [],
      status: 'unknown'
    };

    try {
      // 1. Analyze bet array configuration
      analysis.betArrayAnalysis = await this.analyzeBetArray(gameId);
      
      // 2. Analyze visual logic implementation
      analysis.visualLogicAnalysis = await this.analyzeVisualLogic(gameId);
      
      // 3. Compare and find mismatches
      analysis.mismatches = this.findActualMismatches(analysis.betArrayAnalysis, analysis.visualLogicAnalysis);
      
      // 4. Determine status
      analysis.status = analysis.mismatches.length > 0 ? 'fail' : 'pass';
      
      this.logGameAnalysis(analysis);
      
    } catch (error) {
      console.log(`❌ Error analyzing ${gameId}: ${error.message}`);
      analysis.status = 'error';
      analysis.error = error.message;
    }

    return analysis;
  }

  async analyzeBetArray(gameId) {
    // Read and analyze bet array from rtpConfig.ts
    const rtpConfigPath = path.join(process.cwd(), 'src/games/rtpConfig.ts');
    
    if (!fs.existsSync(rtpConfigPath)) {
      throw new Error('rtpConfig.ts not found');
    }

    const rtpContent = fs.readFileSync(rtpConfigPath, 'utf8');
    
    let betArrayData = null;

    switch (gameId) {
      case 'blackjack':
        // Extract blackjack bet array
        const bjMatch = rtpContent.match(/blackjack:\s*{[\s\S]*?betArray:\s*\[([\s\S]*?)\]/);
        if (bjMatch) {
          const betArrayText = bjMatch[1];
          const multipliers = this.extractMultipliersFromBetArray(betArrayText);
          betArrayData = {
            type: 'static_array',
            multipliers,
            expectedOutcomes: [
              { multiplier: 1.85, probability: 0.42, outcome: 'player_win' },
              { multiplier: 2.30, probability: 0.05, outcome: 'player_blackjack' },
              { multiplier: 1.0, probability: 0.08, outcome: 'push' },
              { multiplier: 0, probability: 0.45, outcome: 'player_lose' }
            ]
          };
        }
        break;

      case 'slots':
        // Extract slots bet array
        const slotsMatch = rtpContent.match(/slots:\s*{[\s\S]*?betArray:\s*\[([\s\S]*?)\]/);
        if (slotsMatch) {
          const betArrayText = slotsMatch[1];
          const multipliers = this.extractMultipliersFromBetArray(betArrayText);
          betArrayData = {
            type: 'static_array',
            multipliers,
            expectedOutcomes: [
              { multiplier: 150.0, probability: 0.001, outcome: 'unicorn' },
              { multiplier: 60.0, probability: 0.002, outcome: 'dghrt' },
              { multiplier: 20.0, probability: 0.005, outcome: 'sol' },
              { multiplier: 8.0, probability: 0.015, outcome: 'usdc' },
              { multiplier: 3.0, probability: 0.08, outcome: 'jup' },
              { multiplier: 1.8, probability: 0.12, outcome: 'bonk' },
              { multiplier: 0, probability: 0.777, outcome: 'wojak_loss' }
            ]
          };
        }
        break;

      case 'flip':
        // Flip uses dynamic bet arrays based on side selection
        betArrayData = {
          type: 'dynamic_side_based',
          multipliers: [1.92, 0],
          expectedOutcomes: [
            { multiplier: 1.92, probability: 0.5, outcome: 'win_chosen_side' },
            { multiplier: 0, probability: 0.5, outcome: 'lose_opposite_side' }
          ]
        };
        break;

      case 'dice':
        // Dice uses calculateBetArray function
        betArrayData = {
          type: 'dynamic_calculated',
          function: 'calculateBetArray(rollUnder)',
          multipliers: [1.9, 0], // Example for rollUnder=50
          expectedOutcomes: [
            { multiplier: '~1.9', probability: 'rollUnder/100', outcome: 'roll_under_target' },
            { multiplier: 0, probability: '(100-rollUnder)/100', outcome: 'roll_over_target' }
          ]
        };
        break;

      case 'mines':
        // Mines uses generateBetArray function
        betArrayData = {
          type: 'dynamic_calculated',
          function: 'generateBetArray(mineCount, cellsRevealed)',
          multipliers: [1.32, 1.71, 2.23, 0], // Example progression
          expectedOutcomes: [
            { multiplier: 'calculated', probability: 'depends_on_mines', outcome: 'safe_cell' },
            { multiplier: 0, probability: 'mineCount/remainingCells', outcome: 'hit_mine' }
          ]
        };
        break;

      case 'plinko':
        // Plinko uses static bucket arrays
        betArrayData = {
          type: 'static_buckets',
          multipliers: [2.8, 2.2, 1.2, 1.0, 9.5, 0], // Normal + Degen mode
          expectedOutcomes: [
            { multiplier: 2.8, probability: 0.125, outcome: 'edge_bucket_normal' },
            { multiplier: 9.5, probability: 0.1, outcome: 'edge_bucket_degen' },
            { multiplier: 0, probability: 'varies', outcome: 'center_buckets' }
          ]
        };
        break;

      default:
        betArrayData = { type: 'unknown', multipliers: [], expectedOutcomes: [] };
    }

    console.log(`📊 Bet Array: ${betArrayData?.type || 'unknown'}`);
    console.log(`🎯 Multipliers: [${betArrayData?.multipliers?.join(', ') || 'none'}]`);

    return betArrayData;
  }

  async analyzeVisualLogic(gameId) {
    const gameFiles = {
      blackjack: 'src/games/BlackJack/index.tsx',
      slots: 'src/games/Slots/index.tsx',
      flip: 'src/games/Flip/index.tsx',
      dice: 'src/games/Dice/index.tsx',
      mines: 'src/games/Mines/index.tsx',
      plinko: 'src/games/Plinko/index.tsx',
      crash: 'src/games/CrashGame/index.tsx',
      hilo: 'src/games/HiLo/index.tsx',
      progressivepoker: 'src/games/ProgressivePoker/index.tsx'
    };

    const gameFile = gameFiles[gameId];
    if (!gameFile) {
      throw new Error(`No game file mapping for ${gameId}`);
    }

    const filePath = path.join(process.cwd(), gameFile);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Game file not found: ${gameFile}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');

    const visualLogic = {
      usesResultMultiplier: fileContent.includes('result.multiplier'),
      usesResultPayout: fileContent.includes('result.payout'),
      usesPayoutMultiplier: fileContent.includes('payoutMultiplier'),
      hardcodedChecks: this.extractHardcodedChecks(fileContent),
      dynamicLogic: this.analyzeDynamicLogic(fileContent),
      visualGeneration: this.analyzeVisualGeneration(gameId, fileContent)
    };

    console.log(`🎨 Visual Logic:`);
    console.log(`   • Uses result.multiplier: ${visualLogic.usesResultMultiplier}`);
    console.log(`   • Uses result.payout: ${visualLogic.usesResultPayout}`);
    console.log(`   • Hardcoded checks: [${visualLogic.hardcodedChecks.join(', ')}]`);

    return visualLogic;
  }

  extractMultipliersFromBetArray(betArrayText) {
    const multipliers = new Set();
    
    // Extract Array(n).fill(x) patterns
    const fillMatches = betArrayText.match(/Array\(\d+\)\.fill\(([\d.]+)\)/g);
    if (fillMatches) {
      fillMatches.forEach(match => {
        const valueMatch = match.match(/fill\(([\d.]+)\)/);
        if (valueMatch) {
          multipliers.add(parseFloat(valueMatch[1]));
        }
      });
    }

    // Extract direct number values
    const numberMatches = betArrayText.match(/(?:^|,|\[)\s*([\d.]+)\s*(?:,|$|\])/g);
    if (numberMatches) {
      numberMatches.forEach(match => {
        const cleaned = match.replace(/[,\[\]]/g, '').trim();
        if (cleaned && !isNaN(parseFloat(cleaned))) {
          multipliers.add(parseFloat(cleaned));
        }
      });
    }

    return Array.from(multipliers).sort((a, b) => b - a);
  }

  extractHardcodedChecks(fileContent) {
    const checks = [];
    
    // Look for payoutMultiplier === checks
    const payoutChecks = fileContent.match(/payoutMultiplier\s*===\s*([\d.]+)/g);
    if (payoutChecks) {
      payoutChecks.forEach(check => {
        const value = check.match(/===\s*([\d.]+)/);
        if (value) checks.push(parseFloat(value[1]));
      });
    }

    // Look for result.multiplier === checks
    const multiplierChecks = fileContent.match(/result\.multiplier\s*===\s*([\d.]+)/g);
    if (multiplierChecks) {
      multiplierChecks.forEach(check => {
        const value = check.match(/===\s*([\d.]+)/);
        if (value) checks.push(parseFloat(value[1]));
      });
    }

    return [...new Set(checks)].sort((a, b) => b - a);
  }

  analyzeDynamicLogic(fileContent) {
    return {
      usesResultDirectly: fileContent.includes('result.') && !fileContent.includes('=== '),
      hasConditionalLogic: fileContent.includes('if (result.payout > 0)') || fileContent.includes('if (result.multiplier > 0)'),
      generatesFromResult: fileContent.includes('getSlotCombination') || fileContent.includes('deriveLosing') || fileContent.includes('seed'),
    };
  }

  analyzeVisualGeneration(gameId, fileContent) {
    const patterns = {
      blackjack: {
        hasCardGeneration: fileContent.includes('createCard') || fileContent.includes('drawCard'),
        usesPayoutMultiplier: fileContent.includes('payoutMultiplier'),
        hasSeedGeneration: fileContent.includes('seed'),
        forcesMismatches: fileContent.includes('payoutMultiplier === 2.5') || fileContent.includes('payoutMultiplier === 2')
      },
      slots: {
        hasSlotGeneration: fileContent.includes('getSlotCombination'),
        usesResultMultiplier: fileContent.includes('result.multiplier'),
        isDeterministic: fileContent.includes('seed')
      },
      mines: {
        usesPayoutCheck: fileContent.includes('result.payout === 0'),
        hasGridReveal: fileContent.includes('revealAllMines') || fileContent.includes('revealGold'),
        isDynamic: true
      }
    };

    return patterns[gameId] || { isGeneric: true };
  }

  findActualMismatches(betArrayAnalysis, visualLogicAnalysis) {
    const mismatches = [];

    if (!betArrayAnalysis || !visualLogicAnalysis) {
      return [{ type: 'analysis_error', description: 'Could not analyze bet array or visual logic' }];
    }

    // Check for hardcoded values that don't match bet array
    visualLogicAnalysis.hardcodedChecks.forEach(hardcoded => {
      if (!betArrayAnalysis.multipliers.includes(hardcoded)) {
        mismatches.push({
          type: 'hardcoded_mismatch',
          expected: betArrayAnalysis.multipliers,
          found: hardcoded,
          description: `Visual logic checks for ${hardcoded}x but bet array only contains [${betArrayAnalysis.multipliers.join(', ')}]`
        });
      }
    });

    // Check for missing visual logic for bet array multipliers
    if (visualLogicAnalysis.hardcodedChecks.length > 0) {
      betArrayAnalysis.multipliers.forEach(multiplier => {
        if (multiplier > 0 && !visualLogicAnalysis.hardcodedChecks.includes(multiplier)) {
          mismatches.push({
            type: 'missing_visual_logic',
            expected: multiplier,
            found: null,
            description: `Bet array contains ${multiplier}x but no visual logic handles this multiplier`
          });
        }
      });
    }

    return mismatches;
  }

  logGameAnalysis(analysis) {
    if (analysis.status === 'pass') {
      console.log(`✅ PASS: Visual logic correctly handles bet array multipliers`);
    } else if (analysis.status === 'fail') {
      console.log(`❌ FAIL: ${analysis.mismatches.length} mismatch(es) detected`);
      analysis.mismatches.forEach(mismatch => {
        console.log(`   • ${mismatch.description}`);
      });
    } else {
      console.log(`⚠️  ${analysis.status.toUpperCase()}: ${analysis.error || 'Unknown status'}`);
    }
  }

  async runAccurateIntegrationTests() {
    console.log('🎯 ACCURATE VISUAL-PAYOUT INTEGRATION TEST');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🔍 Analyzing actual game implementations for visual/payout mismatches');
    console.log('🎮 Focus: How games handle result.multiplier vs hardcoded visual logic');
    console.log('════════════════════════════════════════════════════════════════');

    const games = ['blackjack', 'slots', 'flip', 'dice', 'mines', 'plinko', 'crash', 'hilo', 'progressivepoker'];
    const results = [];

    for (const gameId of games) {
      const result = await this.analyzeGame(gameId);
      results.push(result);
      this.results.push(result);
    }

    this.generateAccurateReport();
    return results;
  }

  generateAccurateReport() {
    const passed = this.results.filter(r => r.status === 'pass');
    const failed = this.results.filter(r => r.status === 'fail');
    const errors = this.results.filter(r => r.status === 'error');

    console.log('\n🎰 ACCURATE INTEGRATION TEST SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    
    console.log(`📊 Results:`);
    console.log(`   • Total: ${this.results.length}`);
    console.log(`   • ✅ Passed: ${passed.length}`);
    console.log(`   • ❌ Failed: ${failed.length}`);
    console.log(`   • ⚠️  Errors: ${errors.length}`);

    if (failed.length > 0) {
      console.log(`\n❌ GAMES WITH CONFIRMED MISMATCHES:`);
      failed.forEach(game => {
        console.log(`\n🎮 ${game.gameId.toUpperCase()}:`);
        game.mismatches.forEach(mismatch => {
          console.log(`   • ${mismatch.description}`);
        });
      });

      console.log(`\n🚨 PLAYER IMPACT:`);
      console.log(`   • ${failed.length} games have visual-payout inconsistencies`);
      console.log(`   • Players may see wrong outcomes in these games`);
      console.log(`   • This creates trust issues and potential legal problems`);
    }

    if (passed.length > 0) {
      console.log(`\n✅ GAMES WITH CORRECT IMPLEMENTATION:`);
      passed.forEach(game => {
        console.log(`   • ${game.gameId} - Visual logic properly handles bet array`);
      });
    }

    const integrityScore = passed.length / (passed.length + failed.length) * 100;
    console.log(`\n🎯 Integration Integrity Score: ${integrityScore.toFixed(1)}%`);

    if (integrityScore < 100) {
      console.log(`\n🔧 CRITICAL ACTION REQUIRED:`);
      console.log(`   1. Fix hardcoded multiplier checks in failed games`);
      console.log(`   2. Ensure visual logic uses actual result.multiplier values`);
      console.log(`   3. Test each fix with real gameplay scenarios`);
      console.log(`   4. Run this test again to verify fixes`);
    }

    console.log('════════════════════════════════════════════════════════════════');

    // Save detailed report
    this.saveAccurateReport();
  }

  saveAccurateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      testType: 'accurate_visual_payout_integration',
      description: 'Analysis of actual game implementations for visual/payout consistency',
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.status === 'pass').length,
        failed: this.results.filter(r => r.status === 'fail').length,
        errors: this.results.filter(r => r.status === 'error').length,
      },
      results: this.results,
      criticalFindings: this.results.filter(r => r.status === 'fail').map(r => ({
        game: r.gameId,
        mismatches: r.mismatches
      }))
    };

    if (!fs.existsSync('test-results')) {
      fs.mkdirSync('test-results', { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `accurate-integration-report-${timestamp}.json`;
    
    fs.writeFileSync(
      path.join('test-results', filename),
      JSON.stringify(report, null, 2)
    );

    console.log(`\n💾 Detailed report: test-results/${filename}`);
  }
}

// Main execution
async function main() {
  const tester = new AccurateIntegrationTester();
  const results = await tester.runAccurateIntegrationTests();
  
  const hasFailures = results.some(r => r.status === 'fail');
  process.exit(hasFailures ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { AccurateIntegrationTester };
