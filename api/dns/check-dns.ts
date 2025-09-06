import { cacheOnTheFly, CacheTTL } from '../cache/xcacheOnTheFly'

// Simple in-memory rate limiter (per process, not per user)
let lastCall = 0;
const THROTTLE_MS = 5000; // 5 seconds - balanced throttling

export const config = {
  runtime: 'edge',
}

// Simplified: Only check key locations to reduce API calls
const LOCATIONS = [
  { location: "New York", country: "United States", code: "US" },
  { location: "London", country: "United Kingdom", code: "GB" },
  { location: "Frankfurt", country: "Germany", code: "DE" },
  { location: "Singapore", country: "Singapore", code: "SG" },
  { location: "Sydney", country: "Australia", code: "AU" },
]

export default async function handler(req: Request): Promise<Response> {
  const now = Date.now();
  const { searchParams } = new URL(req.url)
  const domain = searchParams.get('domain') || 'degenheart.casino';
  
  // Rate limiting check
  if (now - lastCall < THROTTLE_MS) {
    return new Response(JSON.stringify({ 
      error: 'Rate limit exceeded', 
      status: 'Issues', // Default to Issues when rate limited
      retryAfter: Math.ceil((THROTTLE_MS - (now - lastCall)) / 1000)
    }), { 
      status: 429,
      headers: {
        'Retry-After': Math.ceil((THROTTLE_MS - (now - lastCall)) / 1000).toString(),
        'Content-Type': 'application/json'
      }
    });
  }
  lastCall = now;
  
  // Cache per domain for 5 minutes (much longer cache)
  const cacheKey = `dns:${domain}`;
  
  // Simplified: Only use the most reliable DNS providers
  const DNS_PROVIDERS = [
    {
      name: 'Google',
      url: (domain: string) => `https://dns.google/resolve?name=${domain}&type=A`,
      options: {},
      parse: (data: any) => data.Answer ? data.Answer.map((a: any) => a.data) : undefined
    },
    {
      name: 'Cloudflare',
      url: (domain: string) => `https://cloudflare-dns.com/dns-query?name=${domain}&type=A`,
      options: { headers: { 'accept': 'application/dns-json' } },
      parse: (data: any) => data.Answer ? data.Answer.map((a: any) => a.data) : undefined
    },
    {
      name: 'Quad9',
      url: (domain: string) => `https://dns.quad9.net/dns-query?name=${domain}&type=A`,
      options: { headers: { 'accept': 'application/dns-json' } },
      parse: (data: any) => data.Answer ? data.Answer.map((a: any) => a.data) : undefined
    },
  ];

  const results = await cacheOnTheFly(cacheKey, async () => {
    const checkedAt = new Date().toISOString();
    // For each location, check all providers and group by location
    const locationResults = await Promise.all(
      LOCATIONS.map(async ({ location, country, code }) => {
        const providers = await Promise.all(
          DNS_PROVIDERS.map(async provider => {
            async function fetchWithTimeout(resource: string, options = {}, timeout = 4000) {
              const controller = new AbortController();
              const id = setTimeout(() => controller.abort(), timeout);
              const start = Date.now();
              try {
                const response = await fetch(resource, { ...options, signal: controller.signal });
                clearTimeout(id);
                const responseTimeMs = Date.now() - start;
                return { response, responseTimeMs };
              } catch (err) {
                clearTimeout(id);
                throw err;
              }
            }
            try {
              const { response, responseTimeMs } = await fetchWithTimeout(provider.url(domain), provider.options, 4000);
              if (!response.ok) throw new Error('DNS failed');
              const data = await response.json();
              const ips = provider.parse(data);
              const status = ips && ips.length > 0 ? 'online' : 'offline';
              return {
                provider: provider.name,
                status,
                responseTimeMs,
                checkedAt,
                ip: ips ? ips.join(', ') : undefined,
                error: undefined
              };
            } catch (err: any) {
              return {
                provider: provider.name,
                status: 'offline',
                responseTimeMs: undefined,
                checkedAt,
                ip: undefined,
                error: (err && err.message) || 'Unknown error'
              };
            }
          })
        );
        // Compute summary status: online if any provider is online
        const summaryStatus = providers.some(p => p.status === 'online') ? 'online' : 'offline';
        return {
          location,
          country,
          code,
          status: summaryStatus,
          providers
        };
      })
    );
    return locationResults;
  }, { ttl: CacheTTL.FIVE_MINUTES }); // Enhanced cache with TTL

    // Summarize results into a single status string
    const onlineCount = results.filter((r: any) => r.status === 'online').length;
    let status: 'Online' | 'Issues' | 'Offline' = 'Offline';
    if (onlineCount === results.length) {
      status = 'Online';
    } else if (onlineCount > 0) {
      status = 'Issues';
    }
    return new Response(JSON.stringify({ status, results }), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // 5 min browser cache
      },
    });
  }
