import { cacheOnTheFly, CacheTTL } from '../cache/xcacheOnTheFly'
import { withUsageTracking } from '../cache/usage-tracker'
import rateLimiter from '../rate-limiter/rate-limiter'

export const config = { runtime: 'edge' };

async function heliusHandler(req: Request) {
  const origin = req.headers.get('origin');
  const allowedOrigins = new Set(['https://degenheart.casino', 'http://localhost:4001']);
  const corsOrigin = origin && allowedOrigins.has(origin) ? origin : 'https://degenheart.casino';

  // Proxy request to Helius using the secret API key
  const url = new URL(req.url);
  const heliusEndpoint = process.env.HELIUS_API_KEY;
  if (!heliusEndpoint) {
    return new Response(JSON.stringify({ error: 'HELIUS_API_KEY is not set' }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': corsOrigin,
        'Vary': 'Origin',
      },
    });
  }

  try {
    // Get request body and check rate limits
    const body = await req.text();
    
    // Check rate limit before proceeding
    const limitResult = await rateLimiter.checkLimit('helius', 'helius-api');
    
    if (!limitResult.allowed) {
      // Return rate limit response with retry info
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded',
        retryAfter: limitResult.retryAfter,
        currentRps: limitResult.currentRps,
        monthlyUsage: limitResult.monthlyUsage,
        limits: limitResult.limitInfo
      }), {
        status: 429,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': corsOrigin,
          'Vary': 'Origin',
          'Retry-After': String(limitResult.retryAfter || 1),
          'X-RateLimit-Remaining': String(limitResult.limitInfo.rpsRemaining),
          'X-RateLimit-Reset': String(limitResult.limitInfo.resetTime)
        },
      });
    }

    // Cache by endpoint+body for enhanced caching with longer TTL
    const cacheKey = `helius:${heliusEndpoint}:${body}`;
    
    const data = await cacheOnTheFly(cacheKey, async () => {
      const heliusRes = await fetch(heliusEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      
      if (!heliusRes.ok) {
        throw new Error(`Helius API error: ${heliusRes.status} ${heliusRes.statusText}`);
      }
      
      return await heliusRes.json();
    }, { 
      ttl: CacheTTL.FIVE_MINUTES, // Increased cache time to reduce requests
      skipCache: req.headers.get('X-Skip-Cache') === 'true',
      forceRefresh: req.headers.get('X-Force-Fresh') === 'true'
    });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': corsOrigin,
        'Vary': 'Origin',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-RateLimit-Remaining': String(limitResult.limitInfo.rpsRemaining),
        'X-RateLimit-Reset': String(limitResult.limitInfo.resetTime),
        'X-Cache-Status': 'cached'
      },
    });

  } catch (error) {
    console.error('Helius API Error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Helius API request failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': corsOrigin,
        'Vary': 'Origin',
      },
    });
  }
}

// Export with usage tracking
export default withUsageTracking(heliusHandler, 'helius-api', 'helius');
