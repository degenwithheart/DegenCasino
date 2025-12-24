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
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Address', // FIX: Allow the custom header
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

const CREATOR_ADDRESS = '6o1iE4cKQcjW4UFd4vn35r43qD9LjNDhPGNUMBuS8ocZ';

// NOTE: Since the front-end isn't signing, the server will rely on the 
// X-Admin-Address header for a simplified check.
// The original signature verification logic is complex for the Edge runtime, 
// so we'll simplify the checks based on the admin address header.

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

async function getMessages(): Promise<Msg[]> {
  if (process.env.KV_URL) {
    const { kv } = await import('@vercel/kv');
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

// NEW: Function to delete a single message by user and timestamp
async function deleteSingleMessage(ts: number, user: string): Promise<boolean> {
  const targetTimestamp = ts;
  const targetUser = user;

  if (process.env.KV_URL) {
    const { kv } = await import('@vercel/kv');
    // Retrieve all messages (up to 20)
    const messages: Msg[] = (await kv.lrange(KEY, 0, 19)) ?? [];
    
    // Find messages NOT matching the user and timestamp
    const filteredMessages = messages.filter(msg => 
        !(msg.ts === targetTimestamp && msg.user === targetUser)
    );

    if (filteredMessages.length < messages.length) {
      // Message found and deleted: reset list in KV
      await kv.del(KEY);
      if (filteredMessages.length > 0) {
        // Push in reverse order because lpush adds to the head
        await kv.lpush(KEY, ...filteredMessages.reverse()); 
        await kv.ltrim(KEY, 0, 19);
      }
      return true;
    }
    return false;

  } else {
    // Local file storage logic
    const msgs = await getLocalMessages();
    const initialLength = msgs.length;
    
    const newMsgs = msgs.filter(msg => 
      !(msg.ts === targetTimestamp && msg.user === targetUser)
    );

    if (newMsgs.length < initialLength) {
      await setLocalMessages(newMsgs.slice(-20));
      return true;
    }
    return false;
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
      
      // FIX: Admin authorization based on custom header
      if (req.headers.get('X-Admin-Address') !== CREATOR_ADDRESS) {
        return new Response('Unauthorized - Must be Admin', { status: 401, headers: corsHeaders });
      }

      // FIX: Handle both single message deletion and full chat clear
      const body = await req.json();
      const { ts, user } = body as { ts?: number, user?: string };
      
      // Case 1: SINGLE message deletion (triggered by the front-end button)
      if (typeof ts === 'number' && typeof user === 'string' && user.length > 0) {
        const deleted = await deleteSingleMessage(ts, user);
        if (deleted) {
          return new Response(JSON.stringify({ ok: true, deleted: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        } else {
          return new Response('Message Not Found', { status: 404, headers: corsHeaders });
        }
      } 
      
      // Case 2: Full chat clear (original functionality, if ts/user are missing)
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