import { useEffect } from 'react';

type RpcEntry = {
    method: string;
    url: string;
    ts: number;
};

declare global {
    interface Window {
        __rpcMonitor?: {
            getEntries: () => RpcEntry[];
            clear: () => void;
            pause: () => void;
            resume: () => void;
            enabled: boolean;
            setPersistence?: (v: boolean) => void;
            getPersistence?: () => boolean;
        };
    }
}

let originalFetch: typeof fetch | null = null;
let entries: RpcEntry[] = [];
let paused = false;
let persist = false;
const PERSIST_KEY = 'rpcMonitor:persist';
const MAX_ENTRIES = 1000;

function recordEntry(method: string, url: string) {
    if (paused) return;
    try {
        entries.push({ method, url, ts: Date.now() });
        // persist to sessionStorage when enabled
        try {
            if (persist) {
                const toSave = entries.slice(-MAX_ENTRIES);
                sessionStorage.setItem(PERSIST_KEY + ':entries', JSON.stringify(toSave));
            }
        } catch { }
    } catch (e) {
        // swallow
    }
}

function extractMethodFromRequest(input: RequestInfo, init?: RequestInit): Promise<{ methodName: string | null; url: string; }> {
    return new Promise(async (resolve) => {
        try {
            let url = typeof input === 'string' ? input : (input as Request).url;
            // Try to read JSON-RPC method
            let bodyText: string | null = null;
            if (input instanceof Request) {
                try {
                    const clone = input.clone();
                    bodyText = await clone.text();
                } catch { }
            } else if (init && init.body) {
                if (typeof init.body === 'string') bodyText = init.body;
                else if (init.body instanceof FormData) bodyText = null;
                else if (init.body instanceof URLSearchParams) bodyText = init.body.toString();
                else {
                    try { bodyText = JSON.stringify(init.body); } catch { }
                }
            }

            if (bodyText) {
                try {
                    const parsed = JSON.parse(bodyText);
                    if (parsed && typeof parsed.method === 'string') {
                        return resolve({ methodName: parsed.method, url });
                    }
                } catch { }
            }

            // fallback: inspect URL path for helius v0 patterns or generic endpoints
            try {
                const u = new URL(url, location.href);
                const path = u.pathname;
                // Helius v0 examples: /v0/transactions/, /v0/addresses/{address}/transactions
                if (/\/v0\/(transactions|addresses)\//.test(path)) {
                    if (path.includes('/transactions/')) return resolve({ methodName: 'helius:v0:transactions', url });
                    if (path.includes('/addresses/')) return resolve({ methodName: 'helius:v0:addressTxs', url });
                }
                // generic JSON-RPC endpoint - unknown method
                return resolve({ methodName: 'unknown-jsonrpc', url });
            } catch (e) {
                return resolve({ methodName: 'unknown', url });
            }
        } catch (e) {
            return resolve({ methodName: 'error', url: typeof input === 'string' ? input : (input as Request).url });
        }
    });
}

export default function useRpcMonitor() {
    useEffect(() => {
        if (window.__rpcMonitor) return;

        originalFetch = window.fetch.bind(window);

        const wrapped = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
            try {
                const info = await extractMethodFromRequest(input, init);
                recordEntry(info.methodName || 'unknown', info.url);
            } catch (e) {
                // ignore
            }

            return originalFetch!(input, init);
        };

        window.fetch = wrapped as typeof fetch;

        // load persisted entries and persist flag
        try {
            persist = sessionStorage.getItem(PERSIST_KEY) === 'true';
            const raw = sessionStorage.getItem(PERSIST_KEY + ':entries');
            if (raw) {
                try {
                    const parsed = JSON.parse(raw) as RpcEntry[];
                    if (Array.isArray(parsed)) entries = parsed.slice(-MAX_ENTRIES);
                } catch { }
            }
        } catch { }

        window.__rpcMonitor = {
            getEntries: () => entries.slice(),
            clear: () => { entries = []; },
            pause: () => { paused = true; window.__rpcMonitor!.enabled = false; },
            resume: () => { paused = false; window.__rpcMonitor!.enabled = true; },
            enabled: true,
            // persistence controls
            setPersistence: (v: boolean) => {
                try {
                    persist = !!v;
                    if (persist) sessionStorage.setItem(PERSIST_KEY, 'true');
                    else {
                        sessionStorage.removeItem(PERSIST_KEY);
                        sessionStorage.removeItem(PERSIST_KEY + ':entries');
                    }
                } catch { }
            },
            getPersistence: () => persist,
        };

        return () => {
            try {
                if (originalFetch) window.fetch = originalFetch;
            } catch { }
            delete window.__rpcMonitor;
        };
    }, []);
}
