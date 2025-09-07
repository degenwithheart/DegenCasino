import { withUsageTracking } from '../cache/usage-tracker'

export const config = { runtime: 'edge' };

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const allowedOrigins = new Set(['https://degenheart.casino', 'http://localhost:4001']);

function cors(origin: string | null) {
  const o = origin && allowedOrigins.has(origin) ? origin : 'https://degenheart.casino';
  return {
    'Access-Control-Allow-Origin': o,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token'
  };
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return res === 0;
}

async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const { kv } = await import('@vercel/kv');
    const key = `rl:auth:${ip}`;
    const attempts = await kv.incr(key);
    
    if (attempts === 1) {
      await kv.expire(key, 300); // 5 minutes
    }
    
    return attempts <= 5; // Max 5 attempts per 5 minutes
  } catch {
    return true; // Allow if KV fails
  }
}

async function authHandler(req: Request) {
  const origin = req.headers.get('origin');
  const corsHeaders = cors(origin);

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  // Check admin token
  const token = req.headers.get('x-admin-token');
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const withinLimit = await checkRateLimit(ip);
  if (!withinLimit) {
    return new Response('Too Many Requests', { 
      status: 429, 
      headers: { ...corsHeaders, 'Retry-After': '300' } 
    });
  }

  const { password } = await req.json();
  const valid = constantTimeEqual(password, process.env.ACCESS_OVERRIDE_PASSWORD || '');
  
  return new Response(JSON.stringify({ valid }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Export with usage tracking
export default withUsageTracking(authHandler, 'auth-api', 'auth');
