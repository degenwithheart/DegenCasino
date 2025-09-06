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
  const action = url.searchParams.get('action') || 'stats'

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
    switch (action) {
      case 'stats': {
        // Mock analytics data - in real implementation, this would aggregate from analytics service
        const analytics = {
          totalUsers: 1247,
          activeUsers: 89,
          totalGamesPlayed: 3456,
          popularGames: [
            { name: 'Slots', plays: 1200, revenue: 45000 },
            { name: 'Dice', plays: 980, revenue: 32000 },
            { name: 'Plinko', plays: 756, revenue: 28000 }
          ],
          userRetention: {
            '1day': 0.65,
            '7day': 0.32,
            '30day': 0.15
          },
          topReferrers: [
            { code: 'FRIEND123', users: 45, earnings: 1200 },
            { code: 'CASINO456', users: 32, earnings: 890 }
          ],
          timestamp: new Date().toISOString()
        }

        return new Response(JSON.stringify(analytics), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'events': {
        if (req.method === 'POST') {
          // Accept event data from frontend
          const eventData = await req.json();
          const event = {
            ...eventData,
            timestamp: new Date().toISOString(),
            ip: req.headers.get('x-forwarded-for') || 'unknown'
          };

          // Store event in cache for admin viewing
          const cacheKey = `analytics_events_${Date.now()}`;
          await cacheOnTheFly(cacheKey, () => Promise.resolve(event), { ttl: 60 * 60 * 1000 }); // 1 hour

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // GET: Return recent events
        const events = [
          { type: 'game_start', game: 'slots', wallet: 'ABC123...', timestamp: new Date(Date.now() - 300000).toISOString() },
          { type: 'bet_placed', amount: 100, game: 'dice', wallet: 'DEF456...', timestamp: new Date(Date.now() - 600000).toISOString() },
          { type: 'win', amount: 250, game: 'plinko', wallet: 'GHI789...', timestamp: new Date(Date.now() - 900000).toISOString() }
        ]

        return new Response(JSON.stringify({ events, count: events.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'performance': {
        // Mock performance metrics
        const performance = {
          pageLoadTime: 2.3, // seconds
          gameLoadTime: 1.8,
          errorRate: 0.02, // 2%
          apiResponseTime: 150, // ms
          cacheHitRate: 0.94, // 94%
          timestamp: new Date().toISOString()
        }

        return new Response(JSON.stringify(performance), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      default:
        return new Response('Invalid action', { status: 400, headers: corsHeaders })
    }
  } catch (error) {
    console.error('Analytics API error:', error)
    return new Response('Internal Server Error', { status: 500, headers: corsHeaders })
  }
}
