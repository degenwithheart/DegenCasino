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
  const action = url.searchParams.get('action') || 'list'
  const wallet = url.searchParams.get('wallet') || ''

  const origin = req.headers.get('origin');
  const corsHeaders = cors(origin);

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders })
  }

  // Admin token check
  const token = req.headers.get('x-admin-token');
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders })
  }

  try {
    const cacheKey = 'blacklist'
    
    switch (action) {
      case 'list': {
        const blacklist = await cacheOnTheFly(cacheKey, async () => [], { ttl: CacheTTL.HOUR })
        return new Response(JSON.stringify({ blacklist, count: blacklist.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      case 'add': {
        if (!wallet) {
          return new Response('Wallet required', { status: 400, headers: corsHeaders })
        }
        // In real implementation, update cache with new wallet
        return new Response(JSON.stringify({ success: true, message: `Added ${wallet} to blacklist` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      case 'remove': {
        if (!wallet) {
          return new Response('Wallet required', { status: 400, headers: corsHeaders })
        }
        // In real implementation, remove from cache
        return new Response(JSON.stringify({ success: true, message: `Removed ${wallet} from blacklist` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      default:
        return new Response('Invalid action', { status: 400, headers: corsHeaders })
    }
  } catch (error) {
    console.error('Blacklist API error:', error)
    return new Response('Internal Server Error', { status: 500, headers: corsHeaders })
  }
}
