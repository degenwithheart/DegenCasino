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
  const url = new URL(req.url)
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

  if (!wallet) {
    return new Response('Wallet required', { status: 400, headers: corsHeaders })
  }

  try {
    // Mock transaction audit - in real implementation, fetch from Helius or Solana
    const transactions = Array.from({ length: 10 }, (_, i) => ({
      signature: `tx${i + 1}`,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      amount: Math.random() * 100,
      type: ['bet', 'win', 'deposit'][Math.floor(Math.random() * 3)],
      game: ['slots', 'dice', 'plinko'][Math.floor(Math.random() * 3)]
    }))

    return new Response(JSON.stringify({ wallet, transactions, count: transactions.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Transactions API error:', error)
    return new Response('Internal Server Error', { status: 500, headers: corsHeaders })
  }
}
