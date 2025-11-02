import { useEffect } from 'react';

type AnalyzeEntry = {
    name: string;
    status: 'start' | 'success' | 'error';
    ts: number;
    error?: string | null;
    meta?: any;
};

declare global {
    interface Window {
        __analyzeMonitor?: {
            record: (name: string, status?: 'start' | 'success' | 'error', meta?: any) => void;
            getStats: () => Record<string, { total: number; lastTs: number; lastStatus?: string; lastError?: string | null; lastMeta?: any; }>;
            clear: () => void;
            pause: () => void;
            resume: () => void;
            enabled: boolean;
        };
    }
}

let original: any = null;
let enabled = true;
const entries: AnalyzeEntry[] = [];

function recordEntry(name: string, status: AnalyzeEntry['status'], meta?: any, error?: string | null) {
    if (!enabled) return;
    try {
        entries.push({ name, status, ts: Date.now(), meta, error });
        // keep small
        if (entries.length > 2000) entries.splice(0, entries.length - 2000);
    } catch { }
}

export default function useAnalyzeMonitor() {
    useEffect(() => {
        if (window.__analyzeMonitor) return;

        window.__analyzeMonitor = {
            record: (name: string, status: 'start' | 'success' | 'error' = 'start', meta?: any) => {
                recordEntry(name, status, meta, status === 'error' && meta?.message ? String(meta.message) : null);
            },
            getStats: () => {
                const map: Record<string, { total: number; lastTs: number; lastStatus?: string; lastError?: string | null; lastMeta?: any; }> = {};
                for (const e of entries) {
                    const cur = map[e.name] || { total: 0, lastTs: 0, lastStatus: undefined, lastError: null };
                    cur.total += 1;
                    if (e.ts >= cur.lastTs) {
                        cur.lastTs = e.ts;
                        cur.lastStatus = e.status;
                        cur.lastError = e.error ?? null;
                        cur.lastMeta = e.meta;
                    }
                    map[e.name] = cur;
                }
                return map;
            },
            clear: () => { entries.length = 0; },
            pause: () => { enabled = false; window.__analyzeMonitor!.enabled = false; },
            resume: () => { enabled = true; window.__analyzeMonitor!.enabled = true; },
            enabled: true
        };

        return () => { try { delete window.__analyzeMonitor; } catch { } };
    }, []);
}
