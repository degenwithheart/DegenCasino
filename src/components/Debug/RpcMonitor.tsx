import React, { useEffect, useMemo, useState } from 'react';
import useRpcMonitor from '../../hooks/useRpcMonitor';
import { isDataSaverEnabled, setDataSaverEnabled } from '../../utils/rpcThrottle';
import styled from 'styled-components';

const MonitorPanel = styled.div<{ $isVisible?: boolean; }>`
    position: relative;
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid #333;
    border-radius: 8px;
    padding: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #00ff88;
    z-index: 10000;
    max-width: 300px;
`;

type CountRow = {
    method: string;
    total: number;
    last60s: number;
};

function computeCounts(entries: { method: string; url: string; ts: number; }[]) {
    const now = Date.now();
    const windowMs = 60 * 1000;
    const map = new Map<string, { total: number; last60s: number; }>();
    for (const e of entries) {
        const key = e.method || e.url || 'unknown';
        const cur = map.get(key) || { total: 0, last60s: 0 };
        cur.total += 1;
        if (now - e.ts <= windowMs) cur.last60s += 1;
        map.set(key, cur);
    }
    const rows: CountRow[] = [];
    for (const [method, v] of map.entries()) rows.push({ method, total: v.total, last60s: v.last60s });
    rows.sort((a, b) => b.last60s - a.last60s || b.total - a.total);
    return rows;
}

export const RpcMonitor: React.FC = () => {
    useRpcMonitor();
    const [tick, setTick] = useState(0);
    const [paused, setPaused] = useState(false);
    const [persist, setPersist] = useState(false);
    const [dataSaver, setDataSaver] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const t = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        try {
            const p = !!window.__rpcMonitor?.getPersistence?.();
            setPersist(p);
            try { setDataSaver(!!isDataSaverEnabled()); } catch { }
        } catch { }
    }, []);

    const entries = useMemo(() => {
        return (window.__rpcMonitor?.getEntries() || []) as { method: string; url: string; ts: number; }[];
    }, [tick]);

    const rows = useMemo(() => computeCounts(entries), [entries]);
    const totalLast60 = rows.reduce((s, r) => s + r.last60s, 0);
    const totalAll = rows.reduce((s, r) => s + r.total, 0);

    const clear = () => {
        window.__rpcMonitor?.clear();
        try { sessionStorage.removeItem('rpcMonitor:entries'); } catch { }
        setPaused(false);
    };

    const togglePause = () => {
        if (window.__rpcMonitor?.enabled) {
            window.__rpcMonitor.pause();
            setPaused(true);
        } else {
            window.__rpcMonitor?.resume();
            setPaused(false);
        }
    };

    if (collapsed) {
        return (
            <MonitorPanel>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>RPC Monitor</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 12, opacity: .8 }}>{totalLast60} / {totalAll}</div>
                        <button onClick={() => setCollapsed(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>▾</button>
                    </div>
                </div>
            </MonitorPanel>
        );
    }

    return (
        <MonitorPanel>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong>RPC Monitor</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 12, opacity: .8 }}>Total this render: {totalAll} · last 60s: {totalLast60}</div>
                    <button onClick={() => setCollapsed(true)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>▾</button>
                </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <button onClick={clear} style={{ padding: '6px 8px' }}>Clear</button>
                <button onClick={togglePause} style={{ padding: '6px 8px' }}>{paused ? 'Resume' : 'Pause'}</button>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginLeft: 8, fontSize: 12 }}>
                    <input type="checkbox" checked={persist} onChange={(e) => {
                        const v = e.target.checked;
                        setPersist(v);
                        try { window.__rpcMonitor?.setPersistence?.(v); } catch { }
                    }} />
                    <span>Persist (session)</span>
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginLeft: 8, fontSize: 12 }}>
                    <input type="checkbox" checked={dataSaver} onChange={(e) => {
                        const v = e.target.checked;
                        setDataSaver(v);
                        try { setDataSaverEnabled(!!v); } catch { }
                    }} />
                    <span>Data Saver (session)</span>
                </label>
            </div>
            <div style={{ maxHeight: 300, overflow: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', fontSize: 12, opacity: .8 }}>
                            <th>Method</th>
                            <th style={{ width: 90 }}>Last 60s</th>
                            <th style={{ width: 90 }}>Since Render</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(r => (
                            <tr key={r.method} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: 13 }}>
                                <td style={{ padding: '6px 0' }}>{r.method}</td>
                                <td style={{ padding: '6px 0' }}>{r.last60s}</td>
                                <td style={{ padding: '6px 0' }}>{r.total}</td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr><td colSpan={3} style={{ padding: '8px 0', opacity: .8 }}>No RPCs detected yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, opacity: .8, color: '#c9d6e5' }}>
                Notes: counts detected by instrumenting window.fetch. Helius v0 GETs are labelled 'helius:v0:...'. JSON-RPC POSTs show the method name when available.
            </div>
        </MonitorPanel>
    );
};

export default RpcMonitor;
