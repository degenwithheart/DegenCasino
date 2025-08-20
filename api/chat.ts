
// api/chat.ts

export const config = { runtime: 'edge' }

type Msg = { user: string; text: string; ts: number }
const KEY = 'trollbox'
const FILE = './.trollbox.json' // file for local storage

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function validateUser(user: string) {
  const clean = String(user ?? '').trim();
  if (!clean) return 'anon';
  if (clean.length > 24) return clean.slice(0, 24);
  return clean;
}

function validateText(text: string) {
  const clean = String(text ?? '').trim();
  if (!clean) return '';
  if (clean.length > 256) return clean.slice(0, 256);
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

async function getMessages(): Promise<Msg[]> {
  if (isVercel()) {
    // @ts-ignore
    const { kv } = await import('@vercel/kv');
    return (await kv.lrange(KEY, 0, 19)) ?? [];
  } else {
    const msgs = await getLocalMessages();
    return msgs.slice(-20).reverse();
  }
}

async function addMessage(msg: Msg): Promise<void> {
  if (isVercel()) {
    // @ts-ignore
    const { kv } = await import('@vercel/kv');
    await kv.lpush(KEY, msg);
    await kv.ltrim(KEY, 0, 19);
  } else {
    const msgs = await getLocalMessages();
    const newMsgs = [...msgs, msg].slice(-20);
    await setLocalMessages(newMsgs);
  }
}

export default async function handler(req: Request): Promise<Response> {
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
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  } catch (err: any) {
    console.error('[chat API error]', err);
    return new Response('Internal Error', { status: 500, headers: corsHeaders });
  }
}
