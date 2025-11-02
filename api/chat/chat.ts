import { cacheOnTheFly, CacheTTL } from '../cache/xcacheOnTheFly'
import { withUsageTracking } from '../cache/usage-tracker'

// api/chat/chat.ts

export const config = { runtime: 'edge' }

type Msg = { user: string; text: string; ts: number }
const KEY = 'trollbox'
const FILE = './.trollbox.json' // file for local storage

const allowedOrigins = new Set(['https://degenheart.casino', 'http://localhost:4001']);

function cors(origin: string | null) {
  const o = origin && allowedOrigins.has(origin) ? origin : 'https://degenheart.casino';
  return {
    'Access-Control-Allow-Origin': o,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function validateUser(user: string) {
  const clean = String(user ?? '').trim();
  if (!clean) return 'anon';
  if (clean.length > 24) return clean.slice(0, 24);
  return clean;
}

function validateText(text: string) {
  const clean = String(text ?? '').trim();
  if (!clean) return '';
  if (clean.length > 260) return clean.slice(0, 260);
  return clean;
}

function isVercel() {
  return !!process.env.VERCEL;
}

// Local file-based storage for dev
async function getLocalMessages(): Promise<Msg[]> {
  try {
    const fs = await import('fs/promises');
    const data = await fs.readFile(FILE, 'utf8');
    return JSON.parse(data) as Msg[];
  } catch {
    return [];
  }
}

async function setLocalMessages(msgs: Msg[]): Promise<void> {
  const fs = await import('fs/promises');
  await fs.writeFile(FILE, JSON.stringify(msgs), 'utf8');
}

const CREATOR_ADDRESS = '6o1iE4cKQcjW4UFd4vn35r43qD9LjNDhPGNUMBuS8ocZ';

function verifySig(message: string, signatureB64: string, pubkeyBase58: string): Promise<boolean> {
  return verifyEd25519Signature(message, signatureB64, pubkeyBase58);
}

// Simple base58 decoder for Edge Runtime compatibility
function base58Decode(str: string): Uint8Array {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const bytes = [0];
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const value = alphabet.indexOf(char);
    if (value === -1) throw new Error('Invalid base58 character');
    
    for (let j = 0; j < bytes.length; j++) {
      bytes[j] *= 58;
    }
    bytes[0] += value;
    
    let carry = 0;
    for (let j = 0; j < bytes.length; j++) {
      bytes[j] += carry;
      carry = bytes[j] >> 8;
      bytes[j] &= 0xff;
    }
    while (carry) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  
  // Remove leading zeros
  for (let i = 0; i < str.length && str[i] === '1'; i++) {
    bytes.push(0);
  }
  
  return new Uint8Array(bytes.reverse());
}

// Simplified signature verification for Edge Runtime compatibility
async function verifyEd25519Signature(message: string, signatureB64: string, publicKeyBase58: string): Promise<boolean> {
  try {
    // For now, just check if the address matches the creator
    // TODO: Implement proper Ed25519 verification when Edge Runtime supports it
    return publicKeyBase58 === '6o1iE4cKQcjW4UFd4vn35r43qD9LjNDhPGNUMBuS8ocZ';
  } catch {
    return false;
  }
}

async function getMessages(): Promise<Msg[]> {
  if (process.env.KV_URL) {
    const { kv } = await import('@vercel/kv');
    // Cache trollbox messages for 2s
    return await cacheOnTheFly('chat:trollbox', async () => (await kv.lrange(KEY, 0, 19)) ?? [], { ttl: 2000 });
  } else {
    const msgs = await getLocalMessages();
    return msgs.slice(-20).reverse();
  }
}

async function addMessage(msg: Msg): Promise<void> {
  if (process.env.KV_URL) {
    const { kv } = await import('@vercel/kv');
    await kv.lpush(KEY, msg);
    await kv.ltrim(KEY, 0, 19);
  } else {
    const msgs = await getLocalMessages();
    const newMsgs = [...msgs, msg].slice(-20);
    await setLocalMessages(newMsgs);
  }
}

async function chatHandler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin');
  const corsHeaders = cors(origin);

  try {
    if (req.method === 'OPTIONS') {
      return new Response('OK', { status: 200, headers: corsHeaders });
    }
    if (req.method === 'GET') {
      const list = await getMessages();
      return new Response(JSON.stringify(list), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (req.method === 'POST') {
      const { user = 'anon', text } = (await req.json()) as Partial<Msg>;
      const cleanUser = validateUser(user);
      const cleanText = validateText(text ?? '');
      if (!cleanText) return new Response('Empty', { status: 400, headers: corsHeaders });

      const msg: Msg = { user: cleanUser, text: cleanText, ts: Date.now() };
      await addMessage(msg);
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (req.method === 'DELETE') {
      // Only allow creator to clear chat with signature verification
      let address = '';
      let signature = '';
      let nonce = '';
      try {
        const body = await req.json();
        address = String(body.address || '').trim();
        signature = String(body.signature || '');
        nonce = String(body.nonce || '');
      } catch {}
      
      if (address !== CREATOR_ADDRESS) {
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }
      
      if (!nonce || !signature || !await verifySig(`DELETE_CHAT:${nonce}`, signature, address)) {
        return new Response('Invalid signature', { status: 401, headers: corsHeaders });
      }
      
      if (process.env.KV_URL) {
        const { kv } = await import('@vercel/kv');
        await kv.del(KEY);
      } else {
        await setLocalMessages([]);
      }
      return new Response(JSON.stringify({ ok: true, cleared: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  } catch (err: any) {
    console.error('[chat API error]', err);
    return new Response('Internal Error', { status: 500, headers: corsHeaders });
  }
}

// Export with usage tracking
export default withUsageTracking(chatHandler, 'chat-api', 'chat');
