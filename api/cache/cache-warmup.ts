import { warmupCache, CacheTTL } from './xcacheOnTheFly'
import { withUsageTracking } from './usage-tracker'

export const config = {
  runtime: 'edge',
}

// Common data to warm up cache with
const WARMUP_ENTRIES = [
  {
    key: 'coingecko:solana,usd-coin,jupiter-exchange,bonk:usd',
    fetcher: async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin,jupiter-exchange,bonk&vs_currencies=usd', {
        headers: {
          'User-Agent': 'DegenCasino/1.0',
          'Accept': 'application/json',
        },
      })
      return await response.json()
    },
    ttl: CacheTTL.FIVE_MINUTES
  },
  {
    key: 'dns:degenheart.casino',
    fetcher: async () => {
      // Simplified DNS check for warmup
      try {
        const response = await fetch('https://dns.google/resolve?name=degenheart.casino&type=A')
        const data = await response.json()
        return {
          status: data.Answer && data.Answer.length > 0 ? 'online' : 'offline',
          warmup: true,
          timestamp: new Date().toISOString()
        }
      } catch {
        return { status: 'offline', warmup: true, timestamp: new Date().toISOString() }
      }
    },
    ttl: CacheTTL.FIVE_MINUTES
  }
]

async function cacheWarmupHandler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin');
  const allowedOrigins = new Set(['https://degenheart.casino', 'http://localhost:4001']);
  const corsOrigin = origin && allowedOrigins.has(origin) ? origin : 'https://degenheart.casino';

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders })
  }

  try {
    console.log('[cache-warmup] Starting cache warmup...')
    
    await warmupCache(WARMUP_ENTRIES)
    
    return new Response(JSON.stringify({
      success: true,
      entries: WARMUP_ENTRIES.length,
      message: 'Cache warmup completed',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('[cache-warmup] Error:', error)
    return new Response(JSON.stringify({
      error: 'Cache warmup failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// Export with usage tracking
export default withUsageTracking(cacheWarmupHandler, 'cache-warmup-api', 'cache');
