
// Simple in-memory rate limiter (per process, not per user)
let lastCall = 0;
const THROTTLE_MS = 10000; // 10 seconds

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const now = Date.now();
  if (now - lastCall < THROTTLE_MS) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });
  }
  lastCall = now;
  try {
    let amount, from, to
    const url = new URL(req.url)
    amount = url.searchParams.get('amount')
    from = url.searchParams.get('from')
    to = url.searchParams.get('to')
    console.log('[changenow-estimate] Incoming params:', { amount, from, to })
    if (!amount || !from || !to) {
      console.error('[changenow-estimate] Missing parameters', { amount, from, to })
      return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 })
    }

    const apiKey = process.env.CHANGENOW_API_KEY || process.env.VITE_CHANGENOW_API_KEY || ''
    if (!apiKey) {
      console.error('[changenow-estimate] No ChangeNOW API key set')
      return new Response(JSON.stringify({ error: 'No ChangeNOW API key set' }), { status: 500 })
    }

    // Use GET for ChangeNOW API
    const changenowUrl = `https://api.changenow.io/v1/exchange/estimated-amount?fromCurrency=${from}&toCurrency=${to}&amount=${amount}&api_key=${apiKey}`
    console.log('[changenow-estimate] Requesting:', changenowUrl)
    const res = await fetch(changenowUrl, { method: 'GET' })
    if (!res.ok) {
      const errorText = await res.text()
      console.error('[changenow-estimate] ChangeNOW API error:', res.status, errorText)
      throw new Error(`ChangeNOW API error: ${res.status} ${errorText}`)
    }
    const data = await res.json()
    console.log('[changenow-estimate] Success:', data)
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[changenow-estimate] Handler error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
