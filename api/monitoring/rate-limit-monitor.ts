// Rate limiting monitoring and admin endpoint
import { withUsageTracking } from '../cache/usage-tracker'
import rateLimiter from '../rate-limiter/rate-limiter'
import smartCache from '../rate-limiter/smart-cache'

export const config = {
  runtime: 'edge',
}

async function rateLimitMonitoringHandler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin')
  const allowedOrigins = new Set(['https://degenheart.casino', 'http://localhost:4001'])
  const corsOrigin = origin && allowedOrigins.has(origin) ? origin : 'https://degenheart.casino'

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    switch (action) {
      case 'status':
        return handleStatus(corsHeaders)
      
      case 'config':
        return handleConfig(corsHeaders)
      
      case 'reset':
        return handleReset(req, corsHeaders)
      
      case 'cache-stats':
        return handleCacheStats(corsHeaders)
      
      default:
        return handleDashboard(corsHeaders)
    }

  } catch (error) {
    console.error('Rate limit monitoring error:', error)
    return new Response(JSON.stringify({
      error: 'Monitoring endpoint error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleStatus(corsHeaders: Record<string, string>): Promise<Response> {
  const syndicaStatus = rateLimiter.getStatus('syndica')
  const heliusStatus = rateLimiter.getStatus('helius')
  const cacheStats = smartCache.getStats()

  const response = {
    timestamp: new Date().toISOString(),
    providers: {
      syndica: {
        ...syndicaStatus,
        utilizationRps: Math.round((syndicaStatus.currentRps / syndicaStatus.limits.rpsLimit) * 100),
        utilizationMonthly: Math.round((syndicaStatus.monthlyUsage / syndicaStatus.limits.monthlyLimit) * 100),
        remainingRequests: syndicaStatus.limits.monthlyLimit - syndicaStatus.monthlyUsage,
        projectedMonthlyUsage: Math.round(syndicaStatus.monthlyUsage * (30 / new Date().getDate()))
      },
      helius: {
        ...heliusStatus,
        utilizationRps: Math.round((heliusStatus.currentRps / heliusStatus.limits.rpsLimit) * 100),
        utilizationMonthly: Math.round((heliusStatus.monthlyUsage / heliusStatus.limits.monthlyLimit) * 100),
        remainingRequests: heliusStatus.limits.monthlyLimit - heliusStatus.monthlyUsage,
        projectedMonthlyUsage: Math.round(heliusStatus.monthlyUsage * (30 / new Date().getDate()))
      }
    },
    smartCache: {
      activePrefetches: cacheStats.activePrefetches.length,
      prefetchMethods: cacheStats.activePrefetches
    },
    recommendations: generateRecommendations(syndicaStatus, heliusStatus)
  }

  return new Response(JSON.stringify(response, null, 2), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleConfig(corsHeaders: Record<string, string>): Promise<Response> {
  const cacheStats = smartCache.getStats()

  const response = {
    rateLimits: {
      syndica: {
        rpsLimit: 100,
        monthlyLimit: 10_000_000,
        provider: 'syndica'
      },
      helius: {
        rpsLimit: 10,
        monthlyLimit: 1_000_000,
        provider: 'helius'
      }
    },
    cacheStrategies: cacheStats.strategies,
    prefetchConfigs: cacheStats.activePrefetches
  }

  return new Response(JSON.stringify(response, null, 2), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleReset(req: Request, corsHeaders: Record<string, string>): Promise<Response> {
  // Only allow POST for reset operations
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // TODO: Add authentication check here
  // For now, just return a warning
  return new Response(JSON.stringify({
    warning: 'Reset functionality not implemented - requires authentication',
    message: 'Rate limit reset would require admin authentication'
  }), {
    status: 501,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleCacheStats(corsHeaders: Record<string, string>): Promise<Response> {
  const stats = smartCache.getStats()

  const response = {
    strategies: stats.strategies,
    activePrefetches: stats.activePrefetches,
    rateLimiterStatus: stats.rateLimiterStatus,
    cacheEfficiency: {
      // These would be calculated from actual cache hit/miss data
      hitRate: 'N/A - tracking not implemented',
      totalRequests: 'N/A - tracking not implemented',
      cachedRequests: 'N/A - tracking not implemented'
    }
  }

  return new Response(JSON.stringify(response, null, 2), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleDashboard(corsHeaders: Record<string, string>): Promise<Response> {
  const syndicaStatus = rateLimiter.getStatus('syndica')
  const heliusStatus = rateLimiter.getStatus('helius')

  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Rate Limit Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .card { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .status-healthy { color: #22c55e; }
        .status-warning { color: #f59e0b; }
        .status-critical { color: #ef4444; }
        .metric { display: inline-block; margin: 10px 20px 10px 0; }
        .progress-bar { width: 100%; height: 20px; background: #e5e7eb; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; transition: width 0.3s ease; }
        .progress-healthy { background: #22c55e; }
        .progress-warning { background: #f59e0b; }
        .progress-critical { background: #ef4444; }
        pre { background: #f3f4f6; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚦 Rate Limit Dashboard</h1>
        
        <div class="card">
            <h2>📊 Syndica Status</h2>
            <div class="metric">
                <strong>RPS:</strong> 
                <span class="status-${syndicaStatus.status}">${syndicaStatus.currentRps.toFixed(1)} / ${syndicaStatus.limits.rpsLimit}</span>
            </div>
            <div class="metric">
                <strong>Monthly:</strong> 
                <span class="status-${syndicaStatus.status}">${syndicaStatus.monthlyUsage.toLocaleString()} / ${syndicaStatus.limits.monthlyLimit.toLocaleString()}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill progress-${syndicaStatus.status}" 
                     style="width: ${Math.min((syndicaStatus.monthlyUsage / syndicaStatus.limits.monthlyLimit) * 100, 100)}%"></div>
            </div>
        </div>

        <div class="card">
            <h2>🌐 Helius Status</h2>
            <div class="metric">
                <strong>RPS:</strong> 
                <span class="status-${heliusStatus.status}">${heliusStatus.currentRps.toFixed(1)} / ${heliusStatus.limits.rpsLimit}</span>
            </div>
            <div class="metric">
                <strong>Monthly:</strong> 
                <span class="status-${heliusStatus.status}">${heliusStatus.monthlyUsage.toLocaleString()} / ${heliusStatus.limits.monthlyLimit.toLocaleString()}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill progress-${heliusStatus.status}" 
                     style="width: ${Math.min((heliusStatus.monthlyUsage / heliusStatus.limits.monthlyLimit) * 100, 100)}%"></div>
            </div>
        </div>

        <div class="card">
            <h2>📈 API Endpoints</h2>
            <p><a href="?action=status">📊 Status JSON</a></p>
            <p><a href="?action=config">⚙️ Configuration JSON</a></p>
            <p><a href="?action=cache-stats">💾 Cache Statistics JSON</a></p>
        </div>

        <div class="card">
            <h2>🔄 Auto-refresh</h2>
            <script>
                setTimeout(() => window.location.reload(), 30000);
                console.log('Dashboard will auto-refresh in 30 seconds');
            </script>
            <p>This page auto-refreshes every 30 seconds</p>
        </div>
    </div>
</body>
</html>`

  return new Response(html, {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'text/html' }
  })
}

function generateRecommendations(syndicaStatus: any, heliusStatus: any): string[] {
  const recommendations: string[] = []

  // RPS recommendations
  if (syndicaStatus.currentRps > syndicaStatus.limits.rpsLimit * 0.8) {
    recommendations.push('🚨 Syndica RPS usage high - implement request queuing or increase cache TTL')
  }
  
  if (heliusStatus.currentRps > heliusStatus.limits.rpsLimit * 0.8) {
    recommendations.push('🚨 Helius RPS usage high - reduce request frequency or upgrade plan')
  }

  // Monthly usage recommendations
  const syndicaMonthlyPct = (syndicaStatus.monthlyUsage / syndicaStatus.limits.monthlyLimit) * 100
  const heliusMonthlyPct = (heliusStatus.monthlyUsage / heliusStatus.limits.monthlyLimit) * 100

  if (syndicaMonthlyPct > 70) {
    recommendations.push(`⚠️ Syndica monthly usage at ${syndicaMonthlyPct.toFixed(1)}% - monitor closely`)
  }

  if (heliusMonthlyPct > 70) {
    recommendations.push(`⚠️ Helius monthly usage at ${heliusMonthlyPct.toFixed(1)}% - consider upgrade`)
  }

  // Optimization recommendations
  if (syndicaStatus.currentRps > 50) {
    recommendations.push('💡 High Syndica usage - consider increasing cache TTL for getLatestBlockhash')
  }

  if (heliusStatus.currentRps > 5) {
    recommendations.push('💡 High Helius usage - implement more aggressive caching strategy')
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ All rate limits healthy - current setup optimal')
  }

  return recommendations
}

// Export with usage tracking
export default withUsageTracking(rateLimitMonitoringHandler, 'rate-limit-monitor', 'monitoring')
