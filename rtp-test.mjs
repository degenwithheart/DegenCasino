#!/usr/bin/env node

/**
 * Quick RTP Validation Test
 * Tests the fixed RTP configurations to ensure they hit target RTPs
 */

import { BET_ARRAYS, RTP_TARGETS, calculateAverageRTP } from './src/games/rtpConfig.ts'

console.log('🎯 Testing Fixed RTP Configurations...\n')

// Test specific problematic scenarios that were failing
const testScenarios = [
  // Dice edge cases that were failing
  { game: 'dice', test: 'rollUnder=1', target: 0.95 },
  { game: 'dice', test: 'rollUnder=50', target: 0.95 },
  { game: 'dice', test: 'rollUnder=99', target: 0.95 },
  
  // HiLo edge cases
  { game: 'hilo', test: 'hi_rank=0', target: 0.95 },
  { game: 'hilo', test: 'lo_rank=12', target: 0.95 },
  { game: 'hilo', test: 'hi_rank=6', target: 0.95 },
  
  // Mines edge cases
  { game: 'mines', test: 'mines=1_revealed=14', target: 0.94 },
  { game: 'mines', test: 'mines=5_revealed=10', target: 0.94 },
  
  // Crash consistency
  { game: 'crash', test: 'target=2.0', target: 0.96 },
  { game: 'crash', test: 'target=10.0', target: 0.96 },
  
  // Progressive poker
  { game: 'progressivepoker', test: 'weighted', target: 0.96 },
]

testScenarios.forEach(({ game, test, target }) => {
  try {
    let betArray = []
    
    switch (game) {
      case 'dice':
        const rollValue = parseInt(test.split('=')[1])
        betArray = BET_ARRAYS.dice.calculateBetArray(rollValue)
        break
        
      case 'hilo':
        const [direction, rankStr] = test.split('_')
        const rank = parseInt(rankStr.split('=')[1])
        const isHi = direction === 'hi'
        betArray = BET_ARRAYS.hilo.calculateBetArray(rank, isHi)
        break
        
      case 'mines':
        const minesMatch = test.match(/mines=(\d+)_revealed=(\d+)/)
        if (minesMatch) {
          const mineCount = parseInt(minesMatch[1])
          const revealed = parseInt(minesMatch[2])
          betArray = BET_ARRAYS.mines.generateBetArray(mineCount, revealed)
        }
        break
        
      case 'crash':
        const multiplier = parseFloat(test.split('=')[1])
        betArray = BET_ARRAYS.crash.calculateBetArray(multiplier)
        break
        
      case 'progressivepoker':
        betArray = BET_ARRAYS.progressivepoker.createWeightedBetArray()
        break
    }
    
    if (betArray.length > 0) {
      const actualRTP = calculateAverageRTP(betArray)
      const deviation = Math.abs(actualRTP - target)
      const withinTolerance = deviation <= 0.01
      
      const status = withinTolerance ? '✅ PASS' : '❌ FAIL'
      const rtpStr = `${(actualRTP * 100).toFixed(2)}%`
      const targetStr = `${(target * 100).toFixed(2)}%`
      const devStr = `±${(deviation * 100).toFixed(3)}%`
      
      console.log(`${status} ${game.padEnd(15)} ${test.padEnd(20)} Target: ${targetStr} Actual: ${rtpStr} Dev: ${devStr}`)
      
      if (!withinTolerance) {
        console.log(`   ⚠️  Outside tolerance: ${devStr} > 1.000%`)
      }
    } else {
      console.log(`⚪ SKIP ${game.padEnd(15)} ${test.padEnd(20)} No valid bet array (edge case)`)
    }
    
  } catch (error) {
    console.log(`💥 ERROR ${game.padEnd(14)} ${test.padEnd(20)} ${error.message}`)
  }
})

console.log('\n🚀 RTP validation test complete!')
