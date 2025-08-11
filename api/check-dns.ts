
// Simple in-memory rate limiter (per process, not per user)
let lastCall = 0;
const THROTTLE_MS = 10000; // 10 seconds

export const config = {
  runtime: 'edge',
}

const LOCATIONS = [
  { location: "Atlanta", country: "United States", code: "US" },
  { location: "New York", country: "United States", code: "US" },
  { location: "Seattle", country: "United States", code: "US" },
  { location: "Los Angeles", country: "United States", code: "US" },
  { location: "Chicago", country: "United States", code: "US" },
  { location: "Toronto", country: "Canada", code: "CA" },
  { location: "Buenos Aires", country: "Argentina", code: "AR" },
  { location: "Santiago", country: "Chile", code: "CL" },
  { location: "Manchester", country: "United Kingdom", code: "GB" },
  { location: "Vancouver", country: "Canada", code: "CA" },
  { location: "Frankfurt", country: "Germany", code: "DE" },
  { location: "Berlin", country: "Germany", code: "DE" },
  { location: "Madrid", country: "Spain", code: "ES" },
  { location: "Paris", country: "France", code: "FR" },
  { location: "Osaka", country: "Japan", code: "JP" },
  { location: "Jakarta", country: "Indonesia", code: "ID" },
  { location: "Johannesburg", country: "South Africa", code: "ZA" },
  { location: "Auckland", country: "New Zealand", code: "NZ" },
  { location: "Singapore", country: "Singapore", code: "SG" },
  { location: "Lima", country: "Peru", code: "PE" },
  { location: "São Paulo", country: "Brazil", code: "BR" },
  { location: "Melbourne", country: "Australia", code: "AU" },
  { location: "Nairobi", country: "Kenya", code: "KE" },
  { location: "Phoenix", country: "United States", code: "US" },
  { location: "Kampala", country: "Uganda", code: "UG" },
  { location: "Dubai", country: "United Arab Emirates", code: "AE" },
  { location: "Guangzhou", country: "China", code: "CN" },
  { location: "Beijing", country: "China", code: "CN" },
  { location: "Chandigarh", country: "India", code: "IN" },
  { location: "Sydney", country: "Australia", code: "AU" },
  { location: "Tokyo", country: "Japan", code: "JP" },
]

export default async function handler(req: Request): Promise<Response> {
  const now = Date.now();
  if (now - lastCall < THROTTLE_MS) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });
  }
  lastCall = now;
  const { searchParams } = new URL(req.url)
  const domain = searchParams.get('domain')

  if (!domain) {
    return new Response('Missing domain', { status: 400 })
  }

  const results = await Promise.all(
    LOCATIONS.map(async ({ location, country, code }) => {
      // Helper to fetch with timeout (Edge runtime compatible)
      async function fetchWithTimeout(resource, options = {}, timeout = 4000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
          const response = await fetch(resource, { ...options, signal: controller.signal });
          clearTimeout(id);
          return response;
        } catch (err) {
          clearTimeout(id);
          throw err;
        }
      }

      // Try Google DNS first
      try {
        const response = await fetchWithTimeout(`https://dns.google/resolve?name=${domain}&type=A`, {}, 4000);
        if (!response.ok) throw new Error('Primary DNS failed');
        const data = await response.json();
        const status = data.Answer ? 'online' : 'offline';
        return { location, country, code, status };
      } catch {
        // fallback DNS resolver (Cloudflare DoH)
        try {
          const fallback = await fetchWithTimeout(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`, {
            headers: { 'accept': 'application/dns-json' },
          }, 4000);
          const fallbackData = await fallback.json();
          const status = fallbackData.Answer ? 'online' : 'offline';
          return { location, country, code, status };
        } catch {
          return { location, country, code, status: 'offline' };
        }
      }
    })
  );

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  })
  // Fallback in case something goes wrong (should never reach here)
  return new Response('Internal Server Error', { status: 500 })
}
