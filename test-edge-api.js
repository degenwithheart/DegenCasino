#!/usr/bin/env node

// Test script for the enhanced edge case API
import { validateAllGames } from './api/audit/edgeCases.ts'

console.log('Testing Edge Case API with volume testing...\n')

// Test with different play counts
const testCases = [
  { plays: 100, name: 'Quick Test' },
  { plays: 1000, name: 'Medium Test' },
  { plays: 10000, name: 'Full Volume Test' }
]

testCases.forEach(({ plays, name }) => {
  console.log(`\n=== ${name} (${plays} plays per scenario) ===`)
  
  try {
    const result = validateAllGames(plays)
    
    console.log(`✅ Total Tests: ${result.totalTests.toLocaleString()}`)
    console.log(`📊 Plays per Scenario: ${result.playsPerScenario.toLocaleString()}`)
    console.log(`🎮 Games Tested: ${Object.keys(result.summary).length}`)
    console.log(`❌ Total Failures: ${result.totalFailures}`)
    console.log(`🎯 Pass Rate: ${((1 - result.totalFailures / result.totalTests) * 100).toFixed(1)}%`)
    console.log(`⚡ Status: ${result.overallStatus}`)
    
    // Show some sample results
    const sampleResults = result.results.slice(0, 3)
    console.log('\nSample Results:')
    sampleResults.forEach(r => {
      console.log(`  ${r.game} (${r.scenario}): ${(r.actualRTP * 100).toFixed(2)}% RTP, ${r.status}`)
    })
    
  } catch (error) {
    console.error(`❌ Error in ${name}:`, error.message)
  }
})

console.log('\n🚀 Edge Case API testing complete!')
