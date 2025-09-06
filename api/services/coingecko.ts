import { cacheOnTheFly, CacheTTL } from './xcacheOnTheFly'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url)
    const ids = url.searchParams.get('ids') || 'solana,usd-coin,jupiter-exchange,bonk'
    const vs_currencies = url.searchParams.get('vs_currencies') || 'usd'
    
    // Cache prices for 2 minutes
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
        'Access-Control-Allow-Origin': '*',
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
        'Access-Control-Allow-Origin': '*',
      },
      status: 202 // Accepted (using fallback)
    })
  }
}
