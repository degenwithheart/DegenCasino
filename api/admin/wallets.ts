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
  const action = url.searchParams.get('action') || 'lookup'
  const address = url.searchParams.get('address') || ''
  const limit = parseInt(url.searchParams.get('limit') || '50')

  const origin = req.headers.get('origin');
  const corsHeaders = cors(origin);

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders })
  }

  // Admin token check for sensitive actions
  if (action !== 'lookup') {
    const token = req.headers.get('x-admin-token');
    if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }
  }

  try {
    switch (action) {
      case 'lookup': {
        if (!address) {
          return new Response('Address required', { status: 400, headers: corsHeaders })
        }
        // Mock wallet lookup - in real implementation, fetch from Solana or cache
        const walletData = {
          address,
          username: `Degen${address.slice(-4)}`,
          lastActive: new Date().toISOString(),
          totalBets: Math.floor(Math.random() * 1000),
          totalWins: Math.floor(Math.random() * 500),
          status: 'active'
        }
        return new Response(JSON.stringify(walletData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      case 'active': {
        // Mock active wallets list
        const wallets = Array.from({ length: limit }, (_, i) => ({
          address: `Wallet${i + 1}`,
          lastActive: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          game: ['slots', 'dice', 'plinko'][Math.floor(Math.random() * 3)]
        }))
        return new Response(JSON.stringify({ wallets, count: wallets.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      default:
        return new Response('Invalid action', { status: 400, headers: corsHeaders })
    }
  } catch (error) {
    console.error('Wallets API error:', error)
    return new Response('Internal Server Error', { status: 500, headers: corsHeaders })
  }
}
