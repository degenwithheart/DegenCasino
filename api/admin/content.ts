import { cacheOnTheFly, CacheTTL } from '../cache/xcacheOnTheFly'

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

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const action = url.searchParams.get('action') || 'get'
  const gameId = url.searchParams.get('gameId') || ''
  const visibility = url.searchParams.get('visibility') === 'true'

  const origin = req.headers.get('origin');
  const corsHeaders = cors(origin);

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders })
  }

  // Admin token check for write operations
  if (action !== 'get') {
    const token = req.headers.get('x-admin-token');
    if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }
  }

  try {
    const cacheKey = 'admin_game_visibility'

    switch (action) {
      case 'get': {
        const settings = await cacheOnTheFly(cacheKey, async () => ({}), { ttl: CacheTTL.HOUR })
        return new Response(JSON.stringify({
          settings,
          lastUpdated: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'set': {
        if (!gameId) {
          return new Response('gameId required', { status: 400, headers: corsHeaders })
        }

        // Get current settings
        const currentSettings = await cacheOnTheFly(cacheKey, async () => ({}), { ttl: CacheTTL.HOUR })

        // Update the specific game
        const updatedSettings = {
          ...currentSettings,
          [gameId]: visibility
        }

        // Store updated settings (force refresh to update cache)
        await cacheOnTheFly(cacheKey, async () => updatedSettings, {
          ttl: CacheTTL.HOUR,
          forceRefresh: true
        })

        return new Response(JSON.stringify({
          success: true,
          gameId,
          visibility,
          settings: updatedSettings
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'reset': {
        // Reset all visibility settings
        await cacheOnTheFly(cacheKey, async () => ({}), {
          ttl: CacheTTL.HOUR,
          forceRefresh: true
        })

        return new Response(JSON.stringify({
          success: true,
          message: 'All game visibility settings reset'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      default:
        return new Response('Invalid action', { status: 400, headers: corsHeaders })
    }
  } catch (error) {
    console.error('Content management API error:', error)
    return new Response('Internal Server Error', { status: 500, headers: corsHeaders })
  }
}
