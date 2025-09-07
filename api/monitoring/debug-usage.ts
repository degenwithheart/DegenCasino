import { UsageTracker } from '../cache/usage-tracker'
import { withUsageTracking } from '../cache/usage-tracker'

export const config = {
  runtime: 'edge',
}

async function debugUsageHandler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin')
  const allowedOrigins = new Set(['https://degenheart.casino', 'http://localhost:4001'])
  const corsOrigin = origin && allowedOrigins.has(origin) ? origin : 'https://degenheart.casino'

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders })
  }

  if (req.method === 'POST') {
    // Generate test data
    console.log('🧪 Generating test usage data...')
    
    // Simulate some API calls
    await UsageTracker.track({
      timestamp: Date.now(),
      endpoint: 'helius-api',
      method: 'POST',
      category: 'helius',
      success: true,
      responseTime: 250
    })
    
    await UsageTracker.track({
      timestamp: Date.now(),
      endpoint: 'coingecko-api',
      method: 'GET',
      category: 'price',
      success: true,
      responseTime: 150
    })
    
    await UsageTracker.track({
      timestamp: Date.now(),
      endpoint: 'syndica-primary',
      method: 'POST',
      category: 'rpc',
      success: true,
      responseTime: 100
    })
    
    await UsageTracker.track({
      timestamp: Date.now(),
      endpoint: 'chat-api',
      method: 'POST',
      category: 'chat',
      success: true,
      responseTime: 80
    })

    return new Response(JSON.stringify({
      message: 'Test data generated successfully',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  if (req.method === 'GET') {
    try {
      // Get current usage stats
      const hourlyUsage = await UsageTracker.getCurrentHourUsage()
      const dailyUsage = await UsageTracker.getCurrentDayUsage()
      const rpcEndpoints = await UsageTracker.getRpcEndpointUsage()
      const debugStats = UsageTracker.getDebugStats()

      const response = {
        timestamp: new Date().toISOString(),
        hourlyUsage,
        dailyUsage,
        rpcEndpoints,
        debugStats,
        instructions: {
          generateTestData: 'POST to this endpoint to create test usage data',
          refreshUsageMetrics: 'Check /api/monitoring/usage-metrics after generating test data'
        }
      }

      return new Response(JSON.stringify(response, null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    } catch (error: any) {
      console.error('Debug endpoint error:', error)
      return new Response(JSON.stringify({
        error: 'Failed to get usage stats',
        message: error.message,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  }

  return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })
}

// Export with usage tracking  
export default withUsageTracking(debugUsageHandler, 'debug-usage-api', 'monitoring');
