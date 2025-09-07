import { cacheOnTheFly, CacheTTL } from '../cache/xcacheOnTheFly'
import { withUsageTracking } from '../cache/usage-tracker'

export const config = {
  runtime: 'edge',
}

// RPC endpoints to monitor - Production Configuration
const RPC_ENDPOINTS = [
  {
    name: 'Syndica Primary',
    url: process.env.VITE_RPC_ENDPOINT || process.env.RPC_ENDPOINT || 'https://solana-mainnet.api.syndica.io/api-key/4jiiRsRb2BL8pD6S8H3kNNr8U7YYuyBkfuce3f1ngmnYCKS5KSXwvRx53p256RNQZydrDWt1TdXxVbRrmiJrdk3RdD58qtYSna1',
    type: 'primary'
  },
  {
    name: 'Helius RPC Backup',
    url: process.env.VITE_HELIUS_API_KEY || process.env.HELIUS_API_KEY || 'https://mainnet.helius-rpc.com/?api-key=3bda9312-99fc-4ff4-9561-958d62a4a22c',
    type: 'backup'
  },
  {
    name: 'Ankr Last Resort',
    url: 'https://rpc.ankr.com/solana',
    type: 'last-resort'
  },
  {
    name: 'Solana Labs Last Resort',
    url: 'https://api.mainnet-beta.solana.com',
    type: 'last-resort'
  }
]

// Common RPC method calls to test
const RPC_TEST_CALLS = [
  {
    method: 'getHealth',
    params: [],
    name: 'Health Check',
    critical: true
  },
  {
    method: 'getVersion',
    params: [],
    name: 'Version Info',
    critical: true
  },
  {
    method: 'getSlot',
    params: [],
    name: 'Current Slot',
    critical: true
  },
  {
    method: 'getBlockHeight',
    params: [],
    name: 'Block Height',
    critical: true
  },
  {
    method: 'getLatestBlockhash',
    params: [],
    name: 'Latest Blockhash',
    critical: true
  },
  {
    method: 'getBalance',
    params: ['11111111111111111111111111111112'], // System program
    name: 'Get Balance',
    critical: false
  },
  {
    method: 'getAccountInfo',
    params: ['11111111111111111111111111111112'],
    name: 'Account Info',
    critical: false
  },
  {
    method: 'getRecentPerformanceSamples',
    params: [1],
    name: 'Performance Samples',
    critical: false
  }
]

interface RpcTestResult {
  endpoint: string
  endpointType: string
  method: string
  methodName: string
  critical: boolean
  status: 'success' | 'error' | 'timeout'
  responseTime: number
  error?: string
  result?: any
  timestamp: string
}

interface RpcEndpointSummary {
  endpoint: string
  type: string
  status: 'healthy' | 'degraded' | 'offline'
  totalTests: number
  successfulTests: number
  criticalFailures: number
  averageResponseTime: number
  results: RpcTestResult[]
}

interface RpcMonitoringReport {
  timestamp: string
  duration: number
  overallStatus: 'healthy' | 'degraded' | 'critical'
  endpointSummaries: RpcEndpointSummary[]
  totalCalls: number
  successfulCalls: number
  failedCalls: number
  averageResponseTime: number
  estimatedDailyUsage: {
    totalCallsPerDay: number
    callsPerEndpoint: Record<string, number>
    peakUsagePeriods: string[]
  }
}

async function testRpcEndpoint(endpoint: string, method: string, params: any[], timeout = 5000): Promise<{ success: boolean, responseTime: number, result?: any, error?: string }> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  const startTime = Date.now()

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: method,
        params: params
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`RPC Error: ${data.error.message || JSON.stringify(data.error)}`)
    }

    return {
      success: true,
      responseTime,
      result: data.result
    }
  } catch (error: any) {
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime

    return {
      success: false,
      responseTime,
      error: error.message || 'Unknown error'
    }
  }
}

async function rpcHealthHandler(req: Request): Promise<Response> {
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
  const timeoutParam = searchParams.get('timeout')
  const timeout = timeoutParam ? parseInt(timeoutParam) : 5000

  // Cache results for 30 seconds to prevent abuse
  const cacheKey = `rpc-monitor:${timeout}`

  try {
    const report = await cacheOnTheFly(cacheKey, async (): Promise<RpcMonitoringReport> => {
      const startTime = Date.now()
      const timestamp = new Date().toISOString()

      // Test all endpoints with all methods
      const allTests: Promise<RpcTestResult>[] = []

      for (const endpoint of RPC_ENDPOINTS) {
        for (const testCall of RPC_TEST_CALLS) {
          allTests.push(
            testRpcEndpoint(endpoint.url, testCall.method, testCall.params, timeout)
              .then(result => ({
                endpoint: endpoint.url,
                endpointType: endpoint.type,
                method: testCall.method,
                methodName: testCall.name,
                critical: testCall.critical,
                status: result.success ? 'success' as const : (result.responseTime >= timeout ? 'timeout' as const : 'error' as const),
                responseTime: result.responseTime,
                error: result.error,
                result: result.result,
                timestamp
              }))
          )
        }
      }

      const testResults = await Promise.all(allTests)
      const totalDuration = Date.now() - startTime

      // Group results by endpoint
      const endpointGroups = new Map<string, RpcTestResult[]>()
      for (const result of testResults) {
        if (!endpointGroups.has(result.endpoint)) {
          endpointGroups.set(result.endpoint, [])
        }
        endpointGroups.get(result.endpoint)!.push(result)
      }

      // Create endpoint summaries
      const endpointSummaries: RpcEndpointSummary[] = []
      for (const [endpointUrl, results] of endpointGroups) {
        const endpoint = RPC_ENDPOINTS.find(e => e.url === endpointUrl)!
        const successfulTests = results.filter(r => r.status === 'success').length
        const criticalFailures = results.filter(r => r.critical && r.status !== 'success').length
        const totalTests = results.length
        const averageResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / totalTests

        let status: 'healthy' | 'degraded' | 'offline'
        if (criticalFailures > 0) {
          status = 'offline'
        } else if (successfulTests / totalTests < 0.8) {
          status = 'degraded'
        } else {
          status = 'healthy'
        }

        endpointSummaries.push({
          endpoint: endpointUrl,
          type: endpoint.type,
          status,
          totalTests,
          successfulTests,
          criticalFailures,
          averageResponseTime,
          results
        })
      }

      // Calculate overall metrics
      const totalCalls = testResults.length
      const successfulCalls = testResults.filter(r => r.status === 'success').length
      const failedCalls = totalCalls - successfulCalls
      const averageResponseTime = testResults.reduce((sum, r) => sum + r.responseTime, 0) / totalCalls

      // Calculate estimated daily usage (extrapolate based on test frequency)
      const callsPerMinute = totalCalls // assuming this runs every minute
      const totalCallsPerDay = callsPerMinute * 60 * 24

      const callsPerEndpoint: Record<string, number> = {}
      for (const endpoint of RPC_ENDPOINTS) {
        callsPerEndpoint[endpoint.name] = RPC_TEST_CALLS.length * 60 * 24
      }

      // Determine overall status
      let overallStatus: 'healthy' | 'degraded' | 'critical'
      const healthyEndpoints = endpointSummaries.filter(e => e.status === 'healthy').length
      const offlineEndpoints = endpointSummaries.filter(e => e.status === 'offline').length

      if (offlineEndpoints > endpointSummaries.length / 2) {
        overallStatus = 'critical'
      } else if (healthyEndpoints / endpointSummaries.length < 0.7) {
        overallStatus = 'degraded'
      } else {
        overallStatus = 'healthy'
      }

      return {
        timestamp,
        duration: totalDuration,
        overallStatus,
        endpointSummaries,
        totalCalls,
        successfulCalls,
        failedCalls,
        averageResponseTime,
        estimatedDailyUsage: {
          totalCallsPerDay,
          callsPerEndpoint,
          peakUsagePeriods: ['9-11 AM UTC', '2-4 PM UTC', '7-9 PM UTC'] // Based on typical casino usage
        }
      }
    }, { ttl: 30000 }) // 30 seconds

    return new Response(JSON.stringify(report, null, 2), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30'
      }
    })

  } catch (error: any) {
    console.error('RPC monitoring error:', error)

    return new Response(JSON.stringify({
      error: 'RPC monitoring failed',
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
export default withUsageTracking(rpcHealthHandler, 'rpc-health-api', 'monitoring');
