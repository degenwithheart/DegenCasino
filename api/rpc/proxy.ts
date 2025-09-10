import { withUsageTracking } from '../cache/usage-tracker'
import smartCache from '../rate-limiter/smart-cache'
import rateLimiter from '../rate-limiter/rate-limiter'

export const config = {
  runtime: 'edge',
}

// RPC endpoints configuration with provider mapping
const RPC_ENDPOINTS = {
  // Mainnet endpoints
  'syndica-primary': { 
    url: process.env.VITE_RPC_ENDPOINT || process.env.RPC_ENDPOINT || 'https://solana-mainnet.api.syndica.io/api-key/4jiiRsRb2BL8pD6S8H3kNNr8U7YYuyBkfuce3f1ngmnYCKS5KSXwvRx53p256RNQZydrDWt1TdXxVbRrmiJrdk3RdD58qtYSna1',
    provider: 'syndica' as const,
    priority: 1,
    network: 'mainnet' as const
  },
  'syndica-balance': { 
    url: process.env.VITE_RPC_ENDPOINT || process.env.RPC_ENDPOINT || 'https://solana-mainnet.api.syndica.io/api-key/4jiiRsRb2BL8pD6S8H3kNNr8U7YYuyBkfuce3f1ngmnYCKS5KSXwvRx53p256RNQZydrDWt1TdXxVbRrmiJrdk3RdD58qtYSna1',
    provider: 'syndica' as const,
    priority: 2,
    network: 'mainnet' as const
  },
  'helius-backup': { 
    url: process.env.VITE_HELIUS_API_KEY || process.env.HELIUS_API_KEY || 'https://mainnet.helius-rpc.com/?api-key=3bda9312-99fc-4ff4-9561-958d62a4a22c',
    provider: 'helius' as const,
    priority: 3,
    network: 'mainnet' as const
  },
  'ankr-last-resort': { 
    url: 'https://rpc.ankr.com/solana',
    provider: 'public' as const,
    priority: 4,
    network: 'mainnet' as const
  },
  'solana-labs-last-resort': { 
    url: 'https://api.mainnet-beta.solana.com',
    provider: 'public' as const,
    priority: 5,
    network: 'mainnet' as const
  },
  
  // Devnet endpoints
  'devnet-primary': {
    url: process.env.VITE_DEVNET_RPC_ENDPOINT || 'https://api.devnet.solana.com',
    provider: 'public' as const,
    priority: 1,
    network: 'devnet' as const
  },
  'devnet-backup': {
    url: 'https://api.devnet.solana.com',
    provider: 'public' as const,
    priority: 2,
    network: 'devnet' as const
  }
}

const allowedOrigins = new Set(['https://degenheart.casino', 'http://localhost:4001'])

function cors(origin: string | null) {
  const o = origin && allowedOrigins.has(origin) ? origin : 'https://degenheart.casino'
  return {
    'Access-Control-Allow-Origin': o,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-RPC-Endpoint'
  }
}

async function rpcProxyHandler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin')
  const corsHeaders = cors(origin)

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    // Get endpoint preference from header or default to syndica-primary
    const endpointKey = req.headers.get('X-RPC-Endpoint') || 'syndica-primary'
    const endpointConfig = RPC_ENDPOINTS[endpointKey as keyof typeof RPC_ENDPOINTS]
    
    if (!endpointConfig) {
      return new Response(JSON.stringify({
        error: 'Invalid RPC endpoint specified',
        availableEndpoints: Object.keys(RPC_ENDPOINTS)
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get the request body and parse RPC method
    const body = await req.text()
    let rpcMethod = 'unknown'
    let rpcParams: any[] = []
    
    try {
      const parsed = JSON.parse(body)
      rpcMethod = parsed.method || 'unknown'
      rpcParams = parsed.params || []
    } catch {
      // If parsing fails, continue with unknown method
    }

    // Use smart caching for supported providers
    if (endpointConfig.provider === 'syndica' || endpointConfig.provider === 'helius') {
      try {
        const result = await smartCache.smartRpcCall(
          endpointConfig.provider,
          rpcMethod,
          rpcParams,
          {
            endpoint: endpointKey,
            skipCache: rpcMethod === 'sendTransaction' || req.headers.get('X-Skip-Cache') === 'true',
            forceFresh: req.headers.get('X-Force-Fresh') === 'true'
          }
        )

        // Return cached/rate-limited result
        return new Response(JSON.stringify({
          jsonrpc: '2.0',
          id: JSON.parse(body).id || null,
          result
        }), {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-RPC-Endpoint-Used': endpointKey,
            'X-RPC-Method': rpcMethod,
            'X-Cache-Status': 'smart-cache'
          }
        })
      } catch (cacheError) {
        console.error(`Smart cache error, falling back to direct call:`, cacheError)
        // Fall through to direct call
      }
    }

    // Direct call for public endpoints or fallback
    const response = await fetch(endpointConfig.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body
    })

    const responseText = await response.text()

    // Return the response with CORS headers
    return new Response(responseText, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'X-RPC-Endpoint-Used': endpointKey,
        'X-RPC-Method': rpcMethod,
        'X-Cache-Status': 'direct'
      }
    })

  } catch (error) {
    console.error('RPC Proxy Error:', error)
    return new Response(JSON.stringify({
      error: 'RPC proxy error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// Export with usage tracking
export default withUsageTracking(rpcProxyHandler, 'rpc-proxy', 'rpc')
