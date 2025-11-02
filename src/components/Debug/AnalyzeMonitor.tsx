import React, { useEffect, useMemo, useState } from 'react';
import useAnalyzeMonitor from '../../hooks/useAnalyzeMonitor';
import { useUserStore } from '../../hooks/data/useUserStore';
import { isDataSaverEnabled } from '../../utils/rpcThrottle';
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

export const AnalyzeMonitor: React.FC = () => {
    useAnalyzeMonitor();
    const [tick, setTick] = useState(0);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const t = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(t);
    }, []);

    const stats = useMemo(() => {
        try { return window.__analyzeMonitor?.getStats() || {}; } catch { return {}; }
    }, [tick]);

    // Read current settings to show enabled/disabled for monitored functions
    const dataSaver = useUserStore(s => !!s.dataSaver);
    const particlesEnabled = useUserStore(s => s.particlesEnabled !== false);
    const reduceMotion = useUserStore(s => !!s.reduceMotion);
    const lessGlow = useUserStore(s => !!s.lessGlow);
    const deferAudio = useUserStore(s => !!s.deferAudio);
    const progressiveImages = useUserStore(s => !!s.progressiveImages);
    const backgroundThrottle = useUserStore(s => !!s.backgroundThrottle);
    const cacheWarmup = useUserStore(s => !!s.cacheWarmup);
    const fontSlim = useUserStore(s => !!s.fontSlim);
    const autoAdapt = useUserStore(s => !!s.autoAdapt);
    const adaptiveRaf = useUserStore(s => s.adaptiveRaf !== false);

    const monitoredList = [
        { key: 'toggleDataSaver', label: 'Save Data', enabled: dataSaver, info: 'Caches non-critical JSON/text responses per session.' },
        { key: 'toggleParticles', label: 'Visual Effects', enabled: particlesEnabled, info: 'Particle/background visual effects.' },
        { key: 'toggleReduceMotion', label: 'Less Motion', enabled: reduceMotion, info: 'Reduces animations for comfort & battery.' },
        { key: 'toggleLessGlow', label: 'Dim Glows', enabled: lessGlow, info: 'Tone down bright glows & heavy shadows.' },
        { key: 'toggleDeferAudio', label: 'Delay Audio Engine', enabled: deferAudio, info: 'Delay audio engine until user gesture.' },
        { key: 'toggleProgressiveImages', label: 'Smooth Image Loading', enabled: progressiveImages, info: 'Use subtle blur while large images load.' },
        { key: 'toggleBackgroundThrottle', label: 'Pause In Background', enabled: backgroundThrottle, info: 'Pause timers & loops when tab hidden.' },
        { key: 'toggleCacheWarmup', label: 'Preload Core Files', enabled: cacheWarmup, info: 'Preload key files after idle to speed next visits.' },
        { key: 'toggleFontSlim', label: 'Simple Fonts', enabled: fontSlim, info: 'Load fewer font styles for speed.' },
        { key: 'toggleAutoAdapt', label: 'Auto Optimize', enabled: autoAdapt, info: 'Automatically tone things down under heavy load.' },
        { key: 'toggleAdaptiveRaf', label: 'Adaptive Performance', enabled: adaptiveRaf, info: 'Lower internal frame rate under heavy load.' },
        { key: 'resetDefaults', label: 'Reset Defaults', enabled: false, info: 'Restore settings to defaults.' },
        { key: 'rpcCachedFetch', label: 'rpcCachedFetch', enabled: isDataSaverEnabled(), info: 'Session cache for non-critical RPC requests (Data Saver).' }
    ];

    const rows = monitoredList.map(m => {
        const s = (stats as any)[m.key];
        return ({ name: m.key, label: m.label, enabled: m.enabled, info: m.info, total: s?.total || 0, lastTs: s?.lastTs || 0, lastStatus: s?.lastStatus, lastError: s?.lastError });
    });
    rows.sort((a, b) => (b.lastTs || 0) - (a.lastTs || 0));

    const clear = () => { try { window.__analyzeMonitor?.clear(); } catch { } };
    const togglePause = () => {
        if (window.__analyzeMonitor?.enabled) window.__analyzeMonitor.pause();
        else window.__analyzeMonitor?.resume();
    };

    if (collapsed) {
        return (
            <MonitorPanel>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>Analyze Monitor</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 12, opacity: .8 }}>{rows.filter(r => r.enabled).length} enabled</div>
                        <button onClick={() => setCollapsed(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>▾</button>
                    </div>
                </div>
            </MonitorPanel>
        );
    }

    return (
        <MonitorPanel>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong>Analyze Monitor</strong>
                <div style={{ fontSize: 12, opacity: .8 }}>{rows.length} tracked functions</div>
                <div>
                    <button onClick={() => setCollapsed(true)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>▾</button>
                </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <button onClick={clear} style={{ padding: '6px 8px' }}>Clear</button>
                <button onClick={togglePause} style={{ padding: '6px 8px' }}>{window.__analyzeMonitor?.enabled ? 'Pause' : 'Resume'}</button>
            </div>
            <div style={{ maxHeight: 320, overflow: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', fontSize: 12, opacity: .8 }}>
                            <th>Function</th>
                            <th style={{ width: 70 }}>Enabled</th>
                            <th style={{ width: 110 }}>Last Status</th>
                            <th style={{ width: 120 }}>Last Invoked</th>
                            <th style={{ width: 90 }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(r => (
                            <tr key={r.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: 13 }}>
                                <td style={{ padding: '6px 0' }}>{r.label || r.name}</td>
                                <td style={{ padding: '6px 0' }}>{r.enabled ? '✅' : '❌'}</td>
                                <td style={{ padding: '6px 0', color: r.lastStatus === 'error' ? '#ff6b6b' : r.lastStatus === 'start' ? '#ffa500' : '#7efc6f' }}>{r.lastStatus || '-'}</td>
                                <td style={{ padding: '6px 0' }}>{r.lastTs ? new Date(r.lastTs).toLocaleTimeString() : '-'}</td>
                                <td style={{ padding: '6px 0' }}>{r.total}</td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr><td colSpan={4} style={{ padding: '8px 0', opacity: .8 }}>No functions tracked yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Bottom info: show details for enabled settings */}
            <div style={{ marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                <strong style={{ fontSize: 13 }}>Enabled Settings</strong>
                <div style={{ marginTop: 6, maxHeight: 120, overflow: 'auto' }}>
                    {rows.filter(r => r.enabled).length === 0 && (
                        <div style={{ opacity: .8, fontSize: 12 }}>No monitored settings are enabled.</div>
                    )}
                    {rows.filter(r => r.enabled).map(r => (
                        <div key={r.name} style={{ marginTop: 6, padding: '6px', background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</div>
                            <div style={{ fontSize: 12, opacity: .85 }}>{r.info}</div>
                            <div style={{ fontSize: 11, opacity: .7, marginTop: 6 }}>Last invoked: {r.lastTs ? new Date(r.lastTs).toLocaleString() : 'never'} • Calls: {r.total}</div>
                        </div>
                    ))}
                </div>
            </div>
        </MonitorPanel>
    );
};

export default AnalyzeMonitor;
