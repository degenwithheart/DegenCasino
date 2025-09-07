import { withUsageTracking } from '../cache/usage-tracker'

export const config = {
  runtime: 'edge',
}

// RPC endpoints configuration
const RPC_ENDPOINTS = {
  'syndica-primary': process.env.VITE_RPC_ENDPOINT || process.env.RPC_ENDPOINT || 'https://solana-mainnet.api.syndica.io/api-key/4jiiRsRb2BL8pD6S8H3kNNr8U7YYuyBkfuce3f1ngmnYCKS5KSXwvRx53p256RNQZydrDWt1TdXxVbRrmiJrdk3RdD58qtYSna1',
  'syndica-balance': process.env.VITE_RPC_ENDPOINT || process.env.RPC_ENDPOINT || 'https://solana-mainnet.api.syndica.io/api-key/4jiiRsRb2BL8pD6S8H3kNNr8U7YYuyBkfuce3f1ngmnYCKS5KSXwvRx53p256RNQZydrDWt1TdXxVbRrmiJrdk3RdD58qtYSna1',
  'helius-backup': process.env.VITE_HELIUS_API_KEY || process.env.HELIUS_API_KEY || 'https://mainnet.helius-rpc.com/?api-key=3bda9312-99fc-4ff4-9561-958d62a4a22c',
  'ankr-last-resort': 'https://rpc.ankr.com/solana',
  'solana-labs-last-resort': 'https://api.mainnet-beta.solana.com'
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
    const rpcUrl = RPC_ENDPOINTS[endpointKey as keyof typeof RPC_ENDPOINTS]
    
    if (!rpcUrl) {
      return new Response(JSON.stringify({
        error: 'Invalid RPC endpoint specified',
        availableEndpoints: Object.keys(RPC_ENDPOINTS)
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get the request body
    const body = await req.text()
    
    // Parse to validate JSON and extract method for tracking
    let rpcMethod = 'unknown'
    try {
      const parsed = JSON.parse(body)
      rpcMethod = parsed.method || 'unknown'
    } catch {
      // If parsing fails, continue with unknown method
    }

    // Forward the request to the actual RPC endpoint
    const response = await fetch(rpcUrl, {
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
        'X-RPC-Method': rpcMethod
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
