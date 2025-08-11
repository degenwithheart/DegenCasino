export const config = { runtime: 'edge' };

export default async function handler(req) {
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
  const heliusRes = await fetch(heliusEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  const data = await heliusRes.json();
  return new Response(JSON.stringify(data), {
    status: heliusRes.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
