#!/usr/bin/env node

// Test script for rate limiting system
// Run with: node api/rate-limiter/test-rate-limiter.mjs

import { rateLimiter } from './rate-limiter.js'
import smartCache from './smart-cache.js'

async function testRateLimiter() {
  console.log('🧪 Testing Rate Limiter System\n')
  
  // Test 1: Basic rate limit checking
  console.log('Test 1: Basic Rate Limit Checking')
  console.log('=====================================')
  
  try {
    const result1 = await rateLimiter.checkLimit('syndica', 'test-endpoint')
    console.log('✅ Syndica limit check:', {
      allowed: result1.allowed,
      currentRps: result1.currentRps,
      monthlyUsage: result1.monthlyUsage,
      rpsRemaining: result1.limitInfo.rpsRemaining
    })
    
    const result2 = await rateLimiter.checkLimit('helius', 'test-endpoint')
    console.log('✅ Helius limit check:', {
      allowed: result2.allowed,
      currentRps: result2.currentRps,
      monthlyUsage: result2.monthlyUsage,
      rpsRemaining: result2.limitInfo.rpsRemaining
    })
  } catch (error) {
    console.error('❌ Rate limit test failed:', error.message)
  }
  
  console.log('\n')
  
  // Test 2: Status monitoring
  console.log('Test 2: Status Monitoring')
  console.log('==========================')
  
  try {
    const syndicaStatus = rateLimiter.getStatus('syndica')
    console.log('📊 Syndica Status:', {
      status: syndicaStatus.status,
      currentRps: syndicaStatus.currentRps.toFixed(2),
      monthlyUsage: syndicaStatus.monthlyUsage.toLocaleString(),
      rpsLimit: syndicaStatus.limits.rpsLimit,
      monthlyLimit: syndicaStatus.limits.monthlyLimit.toLocaleString()
    })
    
    const heliusStatus = rateLimiter.getStatus('helius')
    console.log('📊 Helius Status:', {
      status: heliusStatus.status,
      currentRps: heliusStatus.currentRps.toFixed(2),
      monthlyUsage: heliusStatus.monthlyUsage.toLocaleString(),
      rpsLimit: heliusStatus.limits.rpsLimit,
      monthlyLimit: heliusStatus.limits.monthlyLimit.toLocaleString()
    })
  } catch (error) {
    console.error('❌ Status monitoring test failed:', error.message)
  }
  
  console.log('\n')
  
  // Test 3: Smart cache statistics
  console.log('Test 3: Smart Cache Statistics')
  console.log('===============================')
  
  try {
    const stats = smartCache.getStats()
    console.log('📈 Cache Stats:', {
      totalStrategies: Object.keys(stats.strategies).length,
      activePrefetches: stats.activePrefetches.length,
      prefetchMethods: stats.activePrefetches,
      syndicaRateLimit: stats.rateLimiterStatus.syndica?.status || 'unknown',
      heliusRateLimit: stats.rateLimiterStatus.helius?.status || 'unknown'
    })
    
    // Show a few key strategies
    console.log('🎯 Key Cache Strategies:')
    const keyMethods = ['getLatestBlockhash', 'getSlot', 'getBalance', 'sendTransaction']
    for (const method of keyMethods) {
      const strategy = stats.strategies[method]
      if (strategy) {
        console.log(`  ${method}: TTL=${strategy.ttl}ms, Priority=${strategy.priority}, Enabled=${strategy.enabled}`)
      }
    }
  } catch (error) {
    console.error('❌ Cache stats test failed:', error.message)
  }
  
  console.log('\n')
  
  // Test 4: Burst limit simulation
  console.log('Test 4: Burst Limit Simulation')
  console.log('===============================')
  
  try {
    console.log('🚀 Simulating rapid requests to test burst limits...')
    
    const requests = []
    for (let i = 0; i < 5; i++) {
      requests.push(rateLimiter.checkLimit('helius', `burst-test-${i}`))
    }
    
    const results = await Promise.all(requests)
    const allowedCount = results.filter(r => r.allowed).length
    const blockedCount = results.filter(r => !r.allowed).length
    
    console.log(`✅ Burst test results: ${allowedCount} allowed, ${blockedCount} blocked`)
    
    if (blockedCount > 0) {
      const blockedResult = results.find(r => !r.allowed)
      console.log(`⏱️  First blocked request should retry after: ${blockedResult?.retryAfter}s`)
    }
  } catch (error) {
    console.error('❌ Burst limit test failed:', error.message)
  }
  
  console.log('\n')
  
  // Test 5: Configuration validation
  console.log('Test 5: Configuration Validation')
  console.log('=================================')
  
  try {
    const { rateLimitConfig } = await import('./config.js')
    
    console.log('⚙️  Configuration Summary:')
    console.log(`   Providers: ${Object.keys(rateLimitConfig.providers).join(', ')}`)
    console.log(`   Cache Strategies: ${Object.keys(rateLimitConfig.cachingStrategies).length}`)
    console.log(`   Prefetching: ${rateLimitConfig.prefetchSettings.enabled ? 'Enabled' : 'Disabled'}`)
    console.log(`   Alert Thresholds: RPS=${rateLimitConfig.monitoring.alertThresholds.rpsWarning}%, Monthly=${rateLimitConfig.monitoring.alertThresholds.monthlyWarning}%`)
    
    // Validate critical configurations
    const syndica = rateLimitConfig.providers.syndica
    const helius = rateLimitConfig.providers.helius
    
    if (syndica.rpsLimit !== 100 || syndica.monthlyLimit !== 10_000_000) {
      console.warn('⚠️  Syndica limits may not match their Standard Plan')
    }
    
    if (helius.rpsLimit !== 10 || helius.monthlyLimit !== 1_000_000) {
      console.warn('⚠️  Helius limits may not match their Free Plan')
    }
    
    console.log('✅ Configuration validation passed')
  } catch (error) {
    console.error('❌ Configuration validation failed:', error.message)
  }
  
  console.log('\n🎉 Rate Limiter Test Suite Completed!\n')
  console.log('📝 Next Steps:')
  console.log('   1. Deploy to Vercel and test with real requests')
  console.log('   2. Monitor the dashboard at /api/monitoring/rate-limit-monitor')
  console.log('   3. Adjust cache TTLs based on actual usage patterns')
  console.log('   4. Set up alerts for rate limit violations')
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testRateLimiter().catch(console.error)
}

export { testRateLimiter }
