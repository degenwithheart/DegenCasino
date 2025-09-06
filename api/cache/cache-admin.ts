import { getCacheInfo } from './xcacheOnTheFly'
import { cacheStats, cacheCleanup, cacheConfigure } from './xcache-edge'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const action = url.searchParams.get('action') || 'stats'
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders })
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
