// Returns all supported pairs from ChangeNOW API, optionally filtered by 'to' coin
// Simple in-memory rate limiter (per process, not per user)
let lastCall = 0;
const THROTTLE_MS = 10000; // 10 seconds

export const config = { runtime: 'edge' }

export default async function handler(request) {
  const now = Date.now();
  if (now - lastCall < THROTTLE_MS) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });
  }
  lastCall = now;
  console.log('[API] /api/changenow-pairs called', request.method, request.url)
  try {
    const urlObj = new URL(request.url)
    const to = urlObj.searchParams.get('to')
    const apiKey = process.env.CHANGENOW_API_KEY
    // Always fetch all pairs, filter for 'to' in code
    const url = `https://api.changenow.io/v2/exchange/pairs?active=true`
    console.log('[API] Fetching ChangeNOW pairs:', url)
    const apiRes = await fetch(url, {
      headers: apiKey ? { 'x-changenow-api-key': apiKey } : {},
    })
    const status = apiRes.status
    const text = await apiRes.text()
    console.log('[API] ChangeNOW pairs response status:', status)
    if (status !== 200) {
      console.error('[API] ChangeNOW pairs error:', text)
      return new Response(JSON.stringify({ error: text, status }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error('[API] Failed to parse ChangeNOW pairs JSON:', text)
      return new Response(JSON.stringify({ error: 'Invalid JSON from ChangeNOW', raw: text }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    let pairs = Array.isArray(data)
      ? data.map(p => ({ from: p.from, to: p.to }))
      : []
    if (to) {
      pairs = pairs.filter(p => p.to === to)
    }
    return new Response(JSON.stringify(pairs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error in changenow-pairs handler:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

