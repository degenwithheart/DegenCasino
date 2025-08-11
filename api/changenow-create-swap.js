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
    const { from, to, amount, address, extraId } = await req.json()
    if (!from || !to || !amount || !address) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 })
    }

    const apiKey = process.env.CHANGENOW_API_KEY || process.env.VITE_CHANGENOW_API_KEY || ''
    const res = await fetch('https://api.changenow.io/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-changenow-api-key': apiKey,
      },
      body: JSON.stringify({ from, to, amount, address, extraId }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`ChangeNOW error ${res.status}: ${errorText}`)
    }

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}