// Simple sessionStorage-backed RPC throttle/cache for non-critical requests.
// - Stores textual JSON responses under a keyed entry for TTL ms.
// - Designed for opt-in `dataSaver` usage (sessionStorage flag `dataSaver:enabled`).
// - Not suitable for binary responses or streaming responses.

const DS_KEY_PREFIX = 'rpcThrottle:';
const DATASAVER_FLAG = 'dataSaver:enabled';

function makeCacheKey(url: string, body?: string | null) {
    return DS_KEY_PREFIX + btoa(url + '::' + (body || ''));
}

export function isDataSaverEnabled() {
    try { return sessionStorage.getItem(DATASAVER_FLAG) === 'true'; } catch { return false; }
}

export function setDataSaverEnabled(v: boolean) {
    try {
        if (v) sessionStorage.setItem(DATASAVER_FLAG, 'true');
        else sessionStorage.removeItem(DATASAVER_FLAG);
    } catch { }
}

type CachedEntry = {
    ts: number;
    status: number;
    headers: { [k: string]: string; };
    body: string;
};

/**
 * rpcCachedFetch: wraps fetch and caches textual JSON/text responses in sessionStorage
 * when dataSaver is enabled and method/url is not explicitly bypassed.
 * Options:
 *  - ttlMs: number (default 60 minutes)
 *  - bypass: boolean (skip cache for this call)
 */
export async function rpcCachedFetch(input: RequestInfo, init?: RequestInit, options?: { ttlMs?: number; bypass?: boolean; }) {
    // default TTL is 60 minutes, but allow override via options or sessionStorage key 'dataSaver:ttl'
    const defaultTtl = 60 * 60 * 1000;
    let ttl = options?.ttlMs ?? defaultTtl;
    try {
        const s = sessionStorage.getItem('dataSaver:ttl');
        if (s !== null) {
            const parsed = parseInt(s, 10);
            if (!isNaN(parsed)) ttl = parsed;
        }
    } catch { }
    const bypass = options?.bypass ?? false;

    // if datsaver not enabled, or TTL explicitly zero, just fetch
    if (!isDataSaverEnabled() || bypass || ttl === 0) return fetch(input, init);

    // record usage for analyze monitor (if present)
    try { window.__analyzeMonitor?.record?.('rpcCachedFetch', 'start', { url: typeof input === 'string' ? input : (input as Request).url }); } catch { }

    // compute key
    let url = typeof input === 'string' ? input : (input as Request).url;
    let bodyText: string | null = null;
    if (init?.body) {
        try {
            if (typeof init.body === 'string') bodyText = init.body;
            else bodyText = JSON.stringify(init.body);
        } catch { bodyText = null; }
    } else if (input instanceof Request) {
        try { const clone = input.clone(); bodyText = await clone.text(); } catch { bodyText = null; }
    }

    try {
        const key = makeCacheKey(url, bodyText);
        const raw = sessionStorage.getItem(key);
        if (raw) {
            try {
                const parsed: CachedEntry = JSON.parse(raw);
                if (Date.now() - parsed.ts <= ttl) {
                    const headers = new Headers(parsed.headers || {});
                    try { window.__analyzeMonitor?.record?.('rpcCachedFetch', 'success', { url, cached: true }); } catch { }
                    return new Response(parsed.body, { status: parsed.status, headers });
                }
            } catch { /* fallthrough to fetch */ }
        }

        // perform fetch and cache if textual
        const res = await fetch(input, init);
        try {
            const clone = res.clone();
            const contentType = clone.headers.get('content-type') || '';
            // only cache JSON/text responses with a 200-ish status
            if (res.ok && (contentType.includes('application/json') || contentType.startsWith('text/'))) {
                const text = await clone.text();
                const headersObj: { [k: string]: string; } = {};
                clone.headers.forEach((v, k) => { headersObj[k] = v; });
                const entry: CachedEntry = { ts: Date.now(), status: clone.status, headers: headersObj, body: text };
                try {
                    sessionStorage.setItem(key, JSON.stringify(entry));
                } catch { /* ignore quota errors */ }
            }
        } catch { /* ignore caching errors */ }
        try { window.__analyzeMonitor?.record?.('rpcCachedFetch', 'success', { url, cached: false, status: res.status }); } catch { }
        return res;
    } catch (e) {
        try { window.__analyzeMonitor?.record?.('rpcCachedFetch', 'error', { url: typeof input === 'string' ? input : (input as Request).url, message: String(((e as any)?.message) || e) }); } catch { }
        return fetch(input, init);
    }
}

export default rpcCachedFetch;
