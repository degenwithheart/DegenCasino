import { UsageTracker } from '../cache/usage-tracker'

export const config = {
  runtime: 'edge',
}

const allowedOrigins = new Set(['https://degenheart.casino', 'http://localhost:4001'])

function cors(origin: string | null) {
  const o = origin && allowedOrigins.has(origin) ? origin : 'https://degenheart.casino'
  return {
    'Access-Control-Allow-Origin': o,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
}

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin')
  const corsHeaders = cors(origin)

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders })
  }

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const debugStats = UsageTracker.getDebugStats()
    const hourlyUsage = await UsageTracker.getCurrentHourUsage()
    const dailyUsage = await UsageTracker.getCurrentDayUsage()
    const rpcEndpoints = await UsageTracker.getRpcEndpointUsage()

    const report = {
      timestamp: new Date().toISOString(),
      status: 'active',
      
      // Raw debug data
      raw: debugStats,
      
      // Processed usage data
      current: {
        hour: hourlyUsage,
        day: dailyUsage,
        rpcEndpoints: rpcEndpoints
      },
      
      // Tracking status
      tracking: {
        trackedAPIs: [
          'helius-api (✅ enabled)',
          'coingecko-api (✅ enabled)', 
          'chat-api (✅ enabled)',
          'cache-admin-api (✅ enabled)',
          'cache-warmup-api (✅ enabled)',
          'dns-check-api (✅ enabled)',
          'audit-api (✅ enabled)',
          'rpc-proxy (✅ enabled)'
        ],
        missingAPIs: [
          'Direct RPC calls (bypass tracking)',
          'Client-side wallet calls',
          'Game transaction calls'
        ]
      },
      
      // Explanation for missing calls
      analysis: {
        expectedCalls: {
          helius: '3 expected calls',
          syndica: '1 expected call'
        },
        actualCalls: {
          helius: hourlyUsage.helius || 0,
          rpc: hourlyUsage.rpc || 0,
          total: hourlyUsage.total || 0
        },
        possibleReasons: [
          'Calls made before tracking was enabled',
          'Direct RPC calls bypassing the proxy service',
          'Client-side calls not going through tracked endpoints',
          'Cached responses reducing actual API calls',
          'Calls made to different endpoints than expected'
        ]
      }
    }

    return new Response(JSON.stringify(report, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Usage tracking debug error:', error)
    return new Response(JSON.stringify({
      error: 'Failed to get usage tracking debug info',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}
