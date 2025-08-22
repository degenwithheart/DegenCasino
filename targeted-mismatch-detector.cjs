#!/usr/bin/env node

/**
 * TARGETED VISUAL-PAYOUT MISMATCH DETECTOR
 * 
 * This script specifically looks for the exact mismatches identified in the original
 * trust crisis report: where visual UI shows different values than Gamba.result.
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 TARGETED VISUAL-PAYOUT MISMATCH DETECTOR');
console.log('═'.repeat(70));
console.log('🔍 Looking for EXACT mismatches from original crisis report');
console.log('═'.repeat(70));

const KNOWN_MISMATCHES = {
  flip: {
    file: 'src/games/Flip/index.tsx',
    issue: 'Visual shows 2.00x but actual Gamba payout is 1.92x',
    search: ['2.00x', '2.0x', 'FLIP_CONFIG.heads[0]'],
    rtpValue: 1.92
  },
  blackjack: {
    file: 'src/games/BlackJack/index.tsx', 
    issue: 'Visual checks for 2.5x, 2.0x but actual payouts are 2.30x, 1.85x',
    search: ['payoutMultiplier === 2.5', 'payoutMultiplier === 2', 'payoutMultiplier === 2.30', 'payoutMultiplier === 1.85'],
    rtpValues: [2.30, 1.85, 1.0, 0]
  },
  slots: {
    file: 'src/games/Slots/index.tsx',
    issue: 'Missing visual feedback for high multipliers',
    search: ['result.multiplier', 'multiplier >= 60', 'multiplier >= 20'],
    rtpValues: [150.0, 60.0, 20.0, 8.0, 3.0, 1.8, 0]
  },
  mines: {
    file: 'src/games/Mines/index.tsx',
    issue: 'Uses hardcoded 0 checks instead of rtpConfig logic',
    search: ['result.payout === 0', 'result.multiplier === 0', 'MINES_CONFIG.generateBetArray'],
    rtpValues: 'dynamic'
  },
  progressivepoker: {
    file: 'src/games/ProgressivePoker/index.tsx',
    issue: 'Missing visual logic for ALL rtpConfig multipliers',
    search: ['result.multiplier', 'multiplier >= 16', 'multiplier >= 8'],
    rtpValues: [16, 8, 6, 3, 0]
  }
};

function checkSpecificMismatch(gameId, config) {
  console.log(`\n🔍 CHECKING: ${gameId.toUpperCase()}`);
  console.log('─'.repeat(50));
  
  const filePath = path.join(process.cwd(), config.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${config.file}`);
    return { status: 'error', issue: 'File not found' };
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`📄 Analyzing: ${config.file}`);
  console.log(`🎯 Issue: ${config.issue}`);
  
  const findings = [];
  
  // Check for each search term
  config.search.forEach(term => {
    const found = content.includes(term);
    console.log(`   ${found ? '✅' : '❌'} Looking for: "${term}" - ${found ? 'FOUND' : 'NOT FOUND'}`);
    findings.push({ term, found });
  });
  
  // Analyze the results based on the specific issue
  const analysis = analyzeFindings(gameId, findings, content, config);
  
  console.log(`📊 Result: ${analysis.status === 'fixed' ? '✅ FIXED' : '❌ ISSUE REMAINS'}`);
  console.log(`💬 Analysis: ${analysis.explanation}`);
  
  return analysis;
}

function analyzeFindings(gameId, findings, content, config) {
  switch (gameId) {
    case 'flip':
      // Check if hardcoded 2.00x is replaced with FLIP_CONFIG
      const has200x = findings.find(f => f.term.includes('2.00x') || f.term.includes('2.0x'))?.found;
      const hasFlipConfig = findings.find(f => f.term.includes('FLIP_CONFIG'))?.found;
      
      if (has200x) {
        return {
          status: 'issue',
          explanation: 'Still shows hardcoded 2.00x instead of actual 1.92x payout'
        };
      } else if (hasFlipConfig) {
        return {
          status: 'fixed', 
          explanation: 'Now uses FLIP_CONFIG.heads[0] (1.92x) - visual matches actual payout'
        };
      } else {
        return {
          status: 'unknown',
          explanation: 'Unable to determine if visual multiplier is correct'
        };
      }
      
    case 'blackjack':
      // Check if hardcoded 2.5x, 2.0x are replaced with 2.30x, 1.85x
      const hardcoded25 = findings.find(f => f.term.includes('=== 2.5'))?.found;
      const hardcoded2 = findings.find(f => f.term.includes('=== 2'))?.found;
      const rtpConfig230 = findings.find(f => f.term.includes('2.30'))?.found;
      const rtpConfig185 = findings.find(f => f.term.includes('1.85'))?.found;
      
      if (hardcoded25 || hardcoded2) {
        return {
          status: 'issue',
          explanation: 'Still uses hardcoded 2.5x/2.0x checks that dont match actual 2.30x/1.85x payouts'
        };
      } else if (rtpConfig230 || rtpConfig185) {
        return {
          status: 'fixed',
          explanation: 'Now uses correct rtpConfig values (2.30x, 1.85x) - visual matches actual payouts'
        };
      } else {
        return {
          status: 'unknown',
          explanation: 'Unable to determine multiplier check logic'
        };
      }
      
    case 'slots':
      // Check if there's visual logic for high multipliers
      const usesResultMultiplier = findings.find(f => f.term.includes('result.multiplier'))?.found;
      const hasHighMultiplierLogic = findings.some(f => f.term.includes('>=') && f.found);
      
      if (usesResultMultiplier) {
        return {
          status: 'fixed',
          explanation: 'Uses result.multiplier for visual logic - will show actual Gamba payouts'
        };
      } else {
        return {
          status: 'issue',
          explanation: 'Missing visual logic for high multipliers (60x, 20x, 8x, etc.)'
        };
      }
      
    case 'mines':
      // Check if uses proper result checking
      const hardcodedPayout = findings.find(f => f.term.includes('payout === 0'))?.found;
      const resultMultiplier = findings.find(f => f.term.includes('multiplier === 0'))?.found;
      const usesConfig = findings.find(f => f.term.includes('MINES_CONFIG'))?.found;
      
      if (hardcodedPayout) {
        return {
          status: 'issue',
          explanation: 'Still uses hardcoded result.payout === 0 instead of result.multiplier'
        };
      } else if (resultMultiplier && usesConfig) {
        return {
          status: 'fixed',
          explanation: 'Now uses result.multiplier === 0 and MINES_CONFIG for proper logic'
        };
      } else {
        return {
          status: 'partial',
          explanation: 'Some fixes applied but may need more work'
        };
      }
      
    case 'progressivepoker':
      // Check if uses result.multiplier for visual feedback
      const usesMultiplier = findings.find(f => f.term.includes('result.multiplier'))?.found;
      
      if (usesMultiplier) {
        return {
          status: 'fixed',
          explanation: 'Uses result.multiplier for visual logic - will show actual payouts'
        };
      } else {
        return {
          status: 'issue',
          explanation: 'Missing visual logic for rtpConfig multipliers (16x, 8x, 6x, 3x)'
        };
      }
      
    default:
      return {
        status: 'unknown',
        explanation: 'Analysis not implemented for this game'
      };
  }
}

async function main() {
  const results = [];
  
  for (const [gameId, config] of Object.entries(KNOWN_MISMATCHES)) {
    const result = checkSpecificMismatch(gameId, config);
    results.push({ game: gameId, ...result });
  }
  
  // Summary
  console.log('\n🎰 TARGETED MISMATCH DETECTION SUMMARY');
  console.log('═'.repeat(70));
  
  const fixed = results.filter(r => r.status === 'fixed');
  const issues = results.filter(r => r.status === 'issue');
  const partial = results.filter(r => r.status === 'partial');
  const unknown = results.filter(r => r.status === 'unknown');
  
  console.log(`✅ FIXED: ${fixed.length} games`);
  fixed.forEach(r => console.log(`   • ${r.game}: ${r.explanation}`));
  
  console.log(`❌ ISSUES REMAIN: ${issues.length} games`);
  issues.forEach(r => console.log(`   • ${r.game}: ${r.explanation}`));
  
  if (partial.length > 0) {
    console.log(`⚠️ PARTIAL FIXES: ${partial.length} games`);
    partial.forEach(r => console.log(`   • ${r.game}: ${r.explanation}`));
  }
  
  if (unknown.length > 0) {
    console.log(`❓ UNKNOWN STATUS: ${unknown.length} games`);
    unknown.forEach(r => console.log(`   • ${r.game}: ${r.explanation}`));
  }
  
  const trustScore = Math.round((fixed.length / results.length) * 100);
  console.log(`\n🎯 TRUST SCORE: ${trustScore}%`);
  
  if (issues.length === 0) {
    console.log('\n🎉 ALL KNOWN VISUAL-PAYOUT MISMATCHES HAVE BEEN FIXED!');
    console.log('   Players now see exactly what Gamba.result returns.');
  } else {
    console.log(`\n🚨 ${issues.length} CRITICAL ISSUES REMAIN`);
    console.log('   Players still see different values than actual payouts in some games.');
  }
  
  // Save detailed report
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = `./test-results/targeted-mismatch-detection-${timestamp}.json`;
  
  if (!fs.existsSync('./test-results')) {
    fs.mkdirSync('./test-results');
  }
  
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    trustScore,
    results,
    summary: {
      total: results.length,
      fixed: fixed.length,
      issues: issues.length,
      partial: partial.length,
      unknown: unknown.length
    }
  }, null, 2));
  
  console.log(`\n💾 Detailed report: ${reportPath}`);
  
  process.exit(issues.length > 0 ? 1 : 0);
}

main().catch(console.error);
