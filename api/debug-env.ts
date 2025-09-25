/**
 * Debug endpoint to verify environment variables
 * This helps debug RPC configuration issues
 */

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  // Check all environment variables (server-side)
  const envCheck = {
    timestamp: new Date().toISOString(),
    serverSide: {
      VITE_RPC_ENDPOINT: process.env.RPC_ENDPOINT ? 'SET' : 'NOT SET',
      RPC_ENDPOINT: process.env.RPC_ENDPOINT ? 'SET' : 'NOT SET',
      VITE_HELIUS_API_KEY: process.env.HELIUS_API_KEY ? 'SET' : 'NOT SET',
      VITE_PLATFORM_CREATOR: process.env.PLATFORM_CREATOR ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'undefined',
      VERCEL: process.env.VERCEL ? 'YES' : 'NO'
    },
    endpoints: {
      primary: process.env.RPC_ENDPOINT || process.env.RPC_ENDPOINT || 'DEFAULT_FALLBACK',
      backup: process.env.HELIUS_API_KEY || 'DEFAULT_FALLBACK'
    },
    warnings: [] as string[]
  };

  // Add warnings for missing variables
  if (!process.env.RPC_ENDPOINT && !process.env.RPC_ENDPOINT) {
    envCheck.warnings.push('🚨 NO RPC ENDPOINT SET - Using fallback');
  }

  if (!process.env.HELIUS_API_KEY) {
    envCheck.warnings.push('⚠️ NO HELIUS API KEY SET - Using fallback');
  }

  if (envCheck.endpoints.primary.includes('api.mainnet-beta.solana.com') || envCheck.endpoints.primary.includes('rpc.ankr.com')) {
    envCheck.warnings.push('🔴 CRITICAL: Using public RPC as primary instead of paid services');
  }

  return new Response(JSON.stringify(envCheck, null, 2), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
