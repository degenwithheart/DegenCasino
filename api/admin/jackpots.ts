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
    // Mock jackpot and pool health - in real implementation, fetch from Solana
    const health = {
      jackpots: [
        { token: 'SOL', balance: 100.5, status: 'healthy' },
        { token: 'USDC', balance: 5000, status: 'healthy' }
      ],
      pools: [
        { name: 'Main Pool', balance: 25000, status: 'active' },
        { name: 'Bonus Pool', balance: 1500, status: 'active' }
      ],
      timestamp: new Date().toISOString()
    }

    return new Response(JSON.stringify(health), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Jackpots API error:', error)
    return new Response('Internal Server Error', { status: 500, headers: corsHeaders })
  }
}
