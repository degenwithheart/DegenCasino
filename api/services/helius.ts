import { cacheOnTheFly, CacheTTL } from '../cache/xcacheOnTheFly'
export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  // Proxy request to Helius using the secret API key
  const url = new URL(req.url);
  const heliusEndpoint = process.env.HELIUS_API_KEY;
  if (!heliusEndpoint) {
    return new Response(JSON.stringify({ error: 'HELIUS_API_KEY is not set' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // Example: Forward POST body to Helius endpoint
  const body = await req.text();
  // Cache by endpoint+body for 10s
  const cacheKey = `helius:${heliusEndpoint}:${body}`;
  const data = await cacheOnTheFly(cacheKey, async () => {
    const heliusRes = await fetch(heliusEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    return await heliusRes.json();
  }, { ttl: CacheTTL.MINUTE }); // Enhanced cache with 1 min TTL
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
