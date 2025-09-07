import { getCacheInfo } from './xcacheOnTheFly'
import { cacheStats, cacheCleanup, cacheConfigure } from './xcache-edge'
import { withUsageTracking } from './usage-tracker'

export const config = {
  runtime: 'edge',
}

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const allowedOrigins = new Set(['https://degenheart.casino', 'http://localhost:4001']);

function cors(origin: string | null) {
  const o = origin && allowedOrigins.has(origin) ? origin : 'https://degenheart.casino';
  return {
    'Access-Control-Allow-Origin': o,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token'
  };
}

async function cacheAdminHandler(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const action = url.searchParams.get('action') || 'stats'
  
  const origin = req.headers.get('origin');
  const corsHeaders = cors(origin);

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders })
  }

  // Admin token check for non-stats actions
  if (action !== 'stats') {
    const token = req.headers.get('x-admin-token');
    if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }
  }

  try {
    switch (action) {
      case 'stats': {
        const stats = cacheStats()
        const info = {
          ...stats,
          timestamp: new Date().toISOString(),
          actions: ['stats', 'cleanup', 'configure']
        }
        return new Response(JSON.stringify(info), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'cleanup': {
        const cleaned = cacheCleanup()
        return new Response(JSON.stringify({ 
          cleaned, 
          message: `Cleaned ${cleaned} expired entries`,
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'configure': {
        if (req.method !== 'POST') {
          return new Response('POST required for configure', { 
            status: 405, 
            headers: corsHeaders 
          })
        }
        
        const config = await req.json()
        cacheConfigure(config)
        
        return new Response(JSON.stringify({ 
          success: true,
          config,
          message: 'Cache configuration updated',
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      default:
        return new Response(`Unknown action: ${action}`, { 
          status: 400, 
          headers: corsHeaders 
        })
    }
  } catch (error) {
    console.error('Cache management error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// Export with usage tracking
export default withUsageTracking(cacheAdminHandler, 'cache-admin-api', 'cache');
