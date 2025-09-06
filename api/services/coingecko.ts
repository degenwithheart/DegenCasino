import { cacheOnTheFly, CacheTTL } from '../cache/xcacheOnTheFly'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin');
  const allowedOrigins = new Set(['https://degenheart.casino', 'http://localhost:4001']);
  const corsOrigin = origin && allowedOrigins.has(origin) ? origin : 'https://degenheart.casino';

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'prices'
    const ids = url.searchParams.get('ids') || 'solana,usd-coin,jupiter-exchange,bonk'
    const vs_currencies = url.searchParams.get('vs_currencies') || 'usd'
    const threshold = parseFloat(url.searchParams.get('threshold') || '5')
    
    if (action === 'alerts') {
      // Mock price alerts - in real implementation, compare with historical data
      const alerts = [
        { token: 'SOL', change: 3.2, status: 'normal' },
        { token: 'BONK', change: 8.5, status: 'warning' }
      ].filter(alert => alert.change > threshold)
      
      return new Response(JSON.stringify({ alerts, threshold, count: alerts.length }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': corsOrigin,
          'Vary': 'Origin',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }
    
    // Default prices action
    const cacheKey = `coingecko:${ids}:${vs_currencies}`
    
    const prices = await cacheOnTheFly(cacheKey, async () => {
      const coingeckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vs_currencies}`
      
      const response = await fetch(coingeckoUrl, {
        headers: {
          'User-Agent': 'DegenCasino/1.0',
          'Accept': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }
      
      return await response.json()
    }, { ttl: CacheTTL.FIVE_MINUTES }) // Enhanced cache with 5 min TTL for better price accuracy
    
    return new Response(JSON.stringify(prices), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=120', // 2 minute browser cache
        'Access-Control-Allow-Origin': corsOrigin,
        'Vary': 'Origin',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
    
  } catch (error) {
    console.error('CoinGecko proxy error:', error)
    
    // Return fallback prices
    const fallbackPrices = {
      'solana': { usd: 150 },
      'usd-coin': { usd: 1 },
      'jupiter-exchange': { usd: 0.85 },
      'bonk': { usd: 0.000025 }
    }
    
    return new Response(JSON.stringify(fallbackPrices), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
        'Access-Control-Allow-Origin': corsOrigin,
        'Vary': 'Origin',
      },
      status: 202 // Accepted (using fallback)
    })
  }
}
