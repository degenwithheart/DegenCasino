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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token'
  };
}

export default async function handler(req: Request): Promise<Response> {
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
    // Mock live game sessions - in real implementation, fetch from on-chain data
    const sessions = [
      {
        game: 'PlinkoRace',
        players: ['Wallet1', 'Wallet2', 'Wallet3'],
        startTime: new Date().toISOString(),
        status: 'active'
      },
      {
        game: 'MultiPoker',
        players: ['Wallet4', 'Wallet5'],
        startTime: new Date(Date.now() - 300000).toISOString(),
        status: 'active'
      }
    ]

    return new Response(JSON.stringify({ sessions, count: sessions.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Games API error:', error)
    return new Response('Internal Server Error', { status: 500, headers: corsHeaders })
  }
}
