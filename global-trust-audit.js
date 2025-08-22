#!/usr/bin/env node

/**
 * Global Player Trust Audit
 * 
 * Comprehensive analysis of ALL games to find hardcoded values that don't match
 * rtpConfig, causing visual UI to show wrong results vs actual Gamba.result
 */

import fs from 'fs';
import path from 'path';

class GlobalTrustAuditor {
  constructor() {
    this.games = [
      'Flip', 'Dice', 'Slots', 'Plinko', 'CrashGame', 'Mines', 
      'HiLo', 'BlackJack', 'ProgressivePoker', 'BlockStack',
      'FlashHack', 'HeistSpin', 'MarketFlip', 'VaultCrack'
    ];
    this.trustIssues = [];
  }

  async auditAllGames() {
    console.log('🔍 GLOBAL PLAYER TRUST AUDIT');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🎯 Finding ALL hardcoded values that prevent visual UI from showing actual Gamba.result');
    console.log('🚨 Every mismatch breaks player trust and game integrity');
    console.log('════════════════════════════════════════════════════════════════');

    // First, extract rtpConfig values for reference
    const rtpConfigData = await this.extractRtpConfigData();
    
    for (const game of this.games) {
      await this.auditGame(game, rtpConfigData);
    }

    this.generateGlobalTrustReport();
  }

  async extractRtpConfigData() {
    const rtpPath = path.join(process.cwd(), 'src/games/rtpConfig.ts');
    if (!fs.existsSync(rtpPath)) {
      console.log('❌ rtpConfig.ts not found!');
      return {};
    }

    const content = fs.readFileSync(rtpPath, 'utf8');
    
    return {
      flip: this.extractFlipConfig(content),
      dice: this.extractDiceConfig(content),
      slots: this.extractSlotsConfig(content),
      plinko: this.extractPlinkoConfig(content),
      crash: this.extractCrashConfig(content),
      mines: this.extractMinesConfig(content),
      hilo: this.extractHiloConfig(content),
      blackjack: this.extractBlackjackConfig(content),
      progressivepoker: this.extractProgressivePokerConfig(content)
    };
  }

  extractFlipConfig(content) {
    const match = content.match(/flip:\s*{[\s\S]*?heads:\s*\[([\d.,\s]+)\][\s\S]*?tails:\s*\[([\d.,\s]+)\]/);
    if (match) {
      const heads = match[1].split(',').map(x => parseFloat(x.trim()));
      const tails = match[2].split(',').map(x => parseFloat(x.trim()));
      return { heads, tails, multipliers: [...new Set([...heads, ...tails])] };
    }
    return { multipliers: [] };
  }

  extractSlotsConfig(content) {
    const match = content.match(/slots:[\s\S]*?betArray:\s*\[([\s\S]*?)\]/);
    if (match) {
      const multipliers = this.extractMultipliersFromArray(match[1]);
      return { multipliers };
    }
    return { multipliers: [] };
  }

  extractBlackjackConfig(content) {
    const match = content.match(/blackjack:[\s\S]*?betArray:\s*\[([\s\S]*?)\]/);
    if (match) {
      const multipliers = this.extractMultipliersFromArray(match[1]);
      return { multipliers };
    }
    return { multipliers: [] };
  }

  extractProgressivePokerConfig(content) {
    const match = content.match(/progressivepoker:[\s\S]*?betArray:\s*\[([\s\S]*?)\]/);
    if (match) {
      const multipliers = this.extractMultipliersFromArray(match[1]);
      return { multipliers };
    }
    return { multipliers: [] };
  }

  extractPlinkoConfig(content) {
    const normalMatch = content.match(/normal:\s*\[([\d.,\s]+)\]/);
    const degenMatch = content.match(/degen:\s*\[([\d.,\s]+)\]/);
    const multipliers = [];
    
    if (normalMatch) {
      multipliers.push(...normalMatch[1].split(',').map(x => parseFloat(x.trim())));
    }
    if (degenMatch) {
      multipliers.push(...degenMatch[1].split(',').map(x => parseFloat(x.trim())));
    }
    
    return { multipliers: [...new Set(multipliers)] };
  }

  extractDiceConfig(content) {
    // Dice uses calculateBetArray function - dynamic values
    return { multipliers: [], isDynamic: true };
  }

  extractCrashConfig(content) {
    // Crash uses calculateBetArray function - dynamic values
    return { multipliers: [], isDynamic: true };
  }

  extractMinesConfig(content) {
    // Mines uses generateBetArray function - dynamic values
    return { multipliers: [], isDynamic: true };
  }

  extractHiloConfig(content) {
    // HiLo uses calculateBetArray function - dynamic values
    return { multipliers: [], isDynamic: true };
  }

  extractMultipliersFromArray(arrayText) {
    const multipliers = new Set();
    
    // Extract Array(n).fill(x) patterns
    const fillMatches = arrayText.match(/Array\(\d+\)\.fill\(([\d.]+)\)/g);
    if (fillMatches) {
      fillMatches.forEach(match => {
        const value = match.match(/fill\(([\d.]+)\)/)[1];
        multipliers.add(parseFloat(value));
      });
    }

    // Extract direct numbers
    const numberMatches = arrayText.match(/(?:^|,|\[)\s*([\d.]+)\s*(?:,|$|\])/g);
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

  async auditGame(gameName, rtpConfigData) {
    console.log(`\n🎮 AUDITING: ${gameName.toUpperCase()}`);
    console.log('─'.repeat(60));

    const gameFile = this.findGameFile(gameName);
    if (!gameFile || !fs.existsSync(gameFile)) {
      console.log(`❌ Game file not found: ${gameFile}`);
      return;
    }

    const content = fs.readFileSync(gameFile, 'utf8');
    const gameKey = gameName.toLowerCase().replace('game', '');
    const rtpData = rtpConfigData[gameKey] || { multipliers: [] };

    console.log(`📊 rtpConfig multipliers: [${rtpData.multipliers.join(', ')}]`);

    // Find all hardcoded multiplier checks
    const hardcodedChecks = this.findHardcodedChecks(content);
    console.log(`🔍 Found hardcoded checks: [${hardcodedChecks.join(', ')}]`);

    // Find trust issues
    const issues = this.findTrustIssues(gameName, rtpData, hardcodedChecks, content);
    
    if (issues.length === 0) {
      console.log(`✅ TRUSTED: Visual UI correctly uses Gamba.result`);
    } else {
      console.log(`❌ TRUST ISSUES: ${issues.length} mismatch(es) found`);
      issues.forEach(issue => {
        console.log(`   • ${issue.description}`);
      });
      this.trustIssues.push({ game: gameName, issues });
    }
  }

  findGameFile(gameName) {
    const paths = [
      `src/games/${gameName}/index.tsx`,
      `src/games/${gameName.charAt(0).toUpperCase() + gameName.slice(1)}/index.tsx`,
      `src/games/${gameName.toUpperCase()}/index.tsx`
    ];

    for (const p of paths) {
      const fullPath = path.join(process.cwd(), p);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }
    return null;
  }

  findHardcodedChecks(content) {
    const checks = [];
    
    // Patterns to look for hardcoded multiplier checks
    const patterns = [
      /payoutMultiplier\s*===\s*([\d.]+)/g,
      /result\.multiplier\s*===\s*([\d.]+)/g,
      /multiplier\s*===\s*([\d.]+)/g,
      /payout\s*===\s*wager\s*\*\s*([\d.]+)/g,
      /===\s*([\d.]+)(?:\s*\*\s*wager)?/g
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const value = parseFloat(match[1]);
        if (!isNaN(value)) {
          checks.push(value);
        }
      }
    });

    return [...new Set(checks)].sort((a, b) => b - a);
  }

  findTrustIssues(gameName, rtpData, hardcodedChecks, content) {
    const issues = [];

    // Skip dynamic games that calculate multipliers at runtime
    if (rtpData.isDynamic) {
      // Check if they're using hardcoded values when they should be dynamic
      if (hardcodedChecks.length > 0) {
        issues.push({
          type: 'hardcoded_in_dynamic_game',
          description: `Dynamic game uses hardcoded checks [${hardcodedChecks.join(', ')}] instead of calculating from rtpConfig`
        });
      }
      return issues;
    }

    // For static games, check if hardcoded values match rtpConfig
    hardcodedChecks.forEach(hardcoded => {
      if (!rtpData.multipliers.includes(hardcoded)) {
        issues.push({
          type: 'hardcoded_mismatch',
          hardcoded,
          rtpValues: rtpData.multipliers,
          description: `Visual checks for ${hardcoded}x but rtpConfig only has [${rtpData.multipliers.join(', ')}]`
        });
      }
    });

    // Check for missing visual logic for rtpConfig values
    rtpData.multipliers.forEach(rtpValue => {
      if (rtpValue > 0 && !hardcodedChecks.includes(rtpValue)) {
        issues.push({
          type: 'missing_visual_logic',
          rtpValue,
          description: `rtpConfig has ${rtpValue}x but no visual logic handles this Gamba.result`
        });
      }
    });

    // Check for problematic patterns
    if (content.includes('Math.random()')) {
      issues.push({
        type: 'random_usage',
        description: 'Game uses Math.random() instead of Gamba.result - breaks determinism'
      });
    }

    if (content.includes('hardcoded') || content.includes('HARDCODED')) {
      issues.push({
        type: 'hardcoded_values',
        description: 'Game contains hardcoded values that may not match rtpConfig'
      });
    }

    return issues;
  }

  generateGlobalTrustReport() {
    const totalGames = this.games.length;
    const trustedGames = totalGames - this.trustIssues.length;
    const trustScore = (trustedGames / totalGames * 100).toFixed(1);

    console.log('\n🎰 GLOBAL PLAYER TRUST REPORT');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`📊 Overall Trust Score: ${trustScore}%`);
    console.log(`✅ Trusted Games: ${trustedGames}/${totalGames}`);
    console.log(`❌ Games with Trust Issues: ${this.trustIssues.length}/${totalGames}`);

    if (this.trustIssues.length > 0) {
      console.log('\n🚨 GAMES BREAKING PLAYER TRUST:');
      this.trustIssues.forEach(({ game, issues }) => {
        console.log(`\n🎮 ${game.toUpperCase()}:`);
        issues.forEach(issue => {
          console.log(`   • ${issue.description}`);
        });
      });

      console.log('\n💥 PLAYER IMPACT:');
      console.log('   • Players see WRONG visual results vs actual Gamba.result');
      console.log('   • Breaks the fundamental promise of blockchain transparency');
      console.log('   • Creates legal liability and trust issues');
      console.log('   • Players may lose money due to visual deception');

      console.log('\n🔧 GLOBAL FIXES REQUIRED:');
      console.log('   1. Remove ALL hardcoded multiplier checks');
      console.log('   2. Use ONLY rtpConfig values for visual logic');
      console.log('   3. Ensure visual UI shows EXACTLY what Gamba.result returns');
      console.log('   4. Remove Math.random() usage - use Gamba RNG only');
      console.log('   5. Test EVERY game with real Gamba transactions');
    } else {
      console.log('\n🎉 EXCELLENT: All games maintain player trust!');
      console.log('   ✅ Visual UI matches Gamba.result perfectly');
      console.log('   ✅ No hardcoded mismatches found');
      console.log('   ✅ rtpConfig properly controls all games');
    }

    console.log('════════════════════════════════════════════════════════════════');

    // Save report
    this.saveGlobalTrustReport(trustScore);
  }

  saveGlobalTrustReport(trustScore) {
    const report = {
      timestamp: new Date().toISOString(),
      testType: 'global_player_trust_audit',
      trustScore: parseFloat(trustScore),
      summary: {
        totalGames: this.games.length,
        trustedGames: this.games.length - this.trustIssues.length,
        gamesWithIssues: this.trustIssues.length
      },
      trustIssues: this.trustIssues,
      recommendations: [
        'Remove all hardcoded multiplier checks',
        'Use only rtpConfig values for visual logic',
        'Ensure visual UI shows exactly what Gamba.result returns',
        'Remove Math.random() usage',
        'Test every game with real Gamba transactions'
      ]
    };

    if (!fs.existsSync('test-results')) {
      fs.mkdirSync('test-results', { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `global-trust-audit-${timestamp}.json`;
    
    fs.writeFileSync(
      path.join('test-results', filename),
      JSON.stringify(report, null, 2)
    );

    console.log(`\n💾 Full audit report: test-results/${filename}`);
  }
}

// Main execution
async function main() {
  const auditor = new GlobalTrustAuditor();
  await auditor.auditAllGames();
  
  const hasIssues = auditor.trustIssues.length > 0;
  process.exit(hasIssues ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { GlobalTrustAuditor };
