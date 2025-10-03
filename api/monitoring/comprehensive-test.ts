import { cacheOnTheFly, CacheTTL } from '../cache/xcacheOnTheFly'
import { withUsageTracking } from '../cache/usage-tracker'

export const config = {
  runtime: 'edge',
}

interface TestResult {
  testName: string
  status: 'success' | 'error' | 'timeout'
  responseTime: number
  timestamp: string
  endpoint: string
  error?: string
  data?: any
}

interface ComprehensiveReport {
  timestamp: string
  duration: number
  overallStatus: 'healthy' | 'degraded' | 'critical'
  testResults: TestResult[]
  summary: {
    totalTests: number
    successfulTests: number
    failedTests: number
    averageResponseTime: number
  }
  rpcHealth: any
  usageMetrics: any
  recommendations: string[]
}

// All API endpoints to test
const TEST_ENDPOINTS = [
  {
    name: 'RPC Health Monitor',
    endpoint: '/api/monitoring/rpc-health',
    critical: true,
    timeout: 10000
  },
  {
    name: 'Usage Metrics',
    endpoint: '/api/monitoring/usage-metrics',
    critical: true,
    timeout: 5000
  },
  {
    name: 'Price Data Service',
    endpoint: '/api/services/coingecko',
    critical: true,
    timeout: 8000
  },
  {
    name: 'Helius Service',
    endpoint: '/api/services/helius',
    critical: false,
    timeout: 5000
  },
  {
    name: 'Chat Service',
    endpoint: '/api/chat/chat',
    critical: false,
    timeout: 3000
  },
  {
    name: 'Cache Stats',
    endpoint: '/api/cache/cache-admin?action=stats',
    critical: false,
    timeout: 3000
  },
  {
    name: 'Cache Warmup',
    endpoint: '/api/cache/cache-warmup',
    critical: false,
    timeout: 5000
  },
  {
    name: 'DNS Health Check',
    endpoint: '/api/dns/check-dns',
    critical: false,
    timeout: 10000
  },
  {
    name: 'RTP Audit',
    endpoint: '/api/monitoring/comprehensive-test?plays=1000',
    critical: false,
    timeout: 15000
  }
]

async function testEndpoint(baseUrl: string, endpoint: string, timeout: number): Promise<TestResult> {
  const fullUrl = `${baseUrl}${endpoint}`
  const startTime = Date.now()
  const timestamp = new Date().toISOString()

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DegenCasino-Monitor/1.0'
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      testName: endpoint,
      status: 'success',
      responseTime,
      timestamp,
      endpoint: fullUrl,
      data
    }

  } catch (error: any) {
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime

    const isTimeout = error.name === 'AbortError' || responseTime >= timeout
    
    return {
      testName: endpoint,
      status: isTimeout ? 'timeout' : 'error',
      responseTime,
      timestamp,
      endpoint: fullUrl,
      error: error.message || 'Unknown error'
    }
  }
}

function generateRecommendations(testResults: TestResult[], rpcHealth: any, usageMetrics: any): string[] {
  const recommendations: string[] = []

  // Check for failed critical tests
  const failedCriticalTests = testResults.filter(test => 
    TEST_ENDPOINTS.find(e => e.endpoint === test.testName)?.critical && test.status !== 'success'
  )

  if (failedCriticalTests.length > 0) {
    recommendations.push(`🚨 Critical services are failing: ${failedCriticalTests.map(t => t.testName).join(', ')}`)
  }

  // Check response times
  const slowTests = testResults.filter(test => test.responseTime > 5000)
  if (slowTests.length > 0) {
    recommendations.push(`⚠️ Slow response times detected in: ${slowTests.map(t => t.testName).join(', ')}`)
  }

  // Check RPC health
  if (rpcHealth?.overallStatus === 'critical') {
    recommendations.push('🔴 RPC endpoints are in critical state - consider switching to backup providers')
  } else if (rpcHealth?.overallStatus === 'degraded') {
    recommendations.push('🟡 RPC endpoints showing degraded performance - monitor closely')
  }

  // Check usage metrics
  if (usageMetrics?.costEstimates?.totalEstimatedMonthlyCost > 1000) {
    recommendations.push(`💰 High estimated monthly costs: $${usageMetrics.costEstimates.totalEstimatedMonthlyCost.toFixed(2)} - consider optimizing API usage`)
  }

  // Check for excessive RPC usage
  if (usageMetrics?.estimatedDailyUsage?.rpcDaily > 100000) {
    recommendations.push('📊 Very high RPC usage detected - consider implementing more aggressive caching')
  }

  // Check for cache effectiveness
  const cacheTest = testResults.find(test => test.testName.includes('cache'))
  if (cacheTest?.status === 'success' && cacheTest.data?.hit_rate < 0.7) {
    recommendations.push('💾 Cache hit rate is low - review caching strategy')
  }

  // Positive recommendations
  if (recommendations.length === 0) {
    recommendations.push('✅ All systems operating normally')
    recommendations.push('📈 Consider implementing proactive monitoring alerts')
    recommendations.push('🔄 Regular testing recommended every 60 seconds for production monitoring')
  }

  return recommendations
}

async function comprehensiveTestHandler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin')
  const allowedOrigins = new Set(['https://degenheart.casino', 'http://localhost:4001'])
  const corsOrigin = origin && allowedOrigins.has(origin) ? origin : 'https://degenheart.casino'

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders })
  }

  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })
  }

  const { searchParams } = new URL(req.url)
  const skipCache = searchParams.has('fresh')
  
  try {
    const cacheKey = 'comprehensive-test-report'
    
    const report = await cacheOnTheFly(cacheKey, async (): Promise<ComprehensiveReport> => {
      const startTime = Date.now()
      const timestamp = new Date().toISOString()

      // Determine base URL
      const baseUrl = req.url.startsWith('https://') 
        ? req.url.substring(0, req.url.indexOf('/api/'))
        : 'http://localhost:4001'

      // Run all tests in parallel
      const testPromises = TEST_ENDPOINTS.map(test => 
        testEndpoint(baseUrl, test.endpoint, test.timeout)
      )

      const testResults = await Promise.all(testPromises)
      const duration = Date.now() - startTime

      // Extract specific data for analysis
      const rpcHealthTest = testResults.find(test => test.testName === '/api/monitoring/rpc-health')
      const usageMetricsTest = testResults.find(test => test.testName === '/api/monitoring/usage-metrics')

      // Calculate summary statistics
      const totalTests = testResults.length
      const successfulTests = testResults.filter(test => test.status === 'success').length
      const failedTests = totalTests - successfulTests
      const averageResponseTime = testResults.reduce((sum, test) => sum + test.responseTime, 0) / totalTests

      // Determine overall status
      const criticalFailures = testResults.filter(test => {
        const endpoint = TEST_ENDPOINTS.find(e => e.endpoint === test.testName)
        return endpoint?.critical && test.status !== 'success'
      }).length

      let overallStatus: 'healthy' | 'degraded' | 'critical'
      if (criticalFailures > 0) {
        overallStatus = 'critical'
      } else if (failedTests > totalTests * 0.3) {
        overallStatus = 'degraded'
      } else {
        overallStatus = 'healthy'
      }

      // Generate recommendations
      const recommendations = generateRecommendations(
        testResults, 
        rpcHealthTest?.data, 
        usageMetricsTest?.data
      )

      return {
        timestamp,
        duration,
        overallStatus,
        testResults,
        summary: {
          totalTests,
          successfulTests,
          failedTests,
          averageResponseTime
        },
        rpcHealth: rpcHealthTest?.data,
        usageMetrics: usageMetricsTest?.data,
        recommendations
      }
    }, { 
      ttl: skipCache ? 0 : 30000 // 30 seconds
    })

    return new Response(JSON.stringify(report, null, 2), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': skipCache ? 'no-cache' : 'public, max-age=30'
      }
    })

  } catch (error: any) {
    console.error('Comprehensive test error:', error)

    return new Response(JSON.stringify({
      error: 'Comprehensive test failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
}

// Export with usage tracking
export default withUsageTracking(comprehensiveTestHandler, 'comprehensive-test-api', 'monitoring');
