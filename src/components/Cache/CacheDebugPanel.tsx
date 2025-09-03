import React, { useState, useEffect } from "react";
import { cache } from "../../utils/cache";

// Simple inline styles for the debug panel
const debugPanelStyles = {
  position: 'fixed' as const,
  top: '10px',
  right: '10px',
  zIndex: 9999,
  background: 'rgba(0, 0, 0, 0.9)',
  color: 'white',
  padding: '12px',
  borderRadius: '8px',
  fontSize: '12px',
  fontFamily: 'monospace',
  border: '1px solid #333',
  minWidth: '280px',
  maxHeight: '400px',
  overflow: 'auto'
};

const buttonStyles = {
  background: '#007bff',
  border: 'none',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '11px',
  margin: '2px'
};

const toggleButtonStyles = {
  position: 'fixed' as const,
  top: '10px',
  right: '10px',
  zIndex: 9999,
  background: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  cursor: 'pointer',
  fontSize: '16px'
};

export function CacheDebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState(cache.getStats());

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setStats(cache.getStats());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const handleClearAll = () => {
    cache.clear();
    setStats(cache.getStats());
  };

  const handleClearLeaderboard = () => {
    cache.invalidateByPattern('leaderboard:.*');
    setStats(cache.getStats());
  };

  const handleClearRecentPlays = () => {
    cache.invalidateByPattern('recentPlays:.*');
    setStats(cache.getStats());
  };

  const handleClearPlayerData = () => {
    cache.invalidateByPattern('playerPlays:.*');
    setStats(cache.getStats());
  };

  if (!isVisible) {
    return (
      <button 
        style={toggleButtonStyles}
        onClick={() => setIsVisible(true)}
        title="Show Cache Debug Panel"
      >
        📊
      </button>
    );
  }

  return (
    <div style={debugPanelStyles}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <strong>Cache Debug</strong>
        <button 
          style={{...buttonStyles, background: '#dc3545'}}
          onClick={() => setIsVisible(false)}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ color: '#ffd700', fontWeight: 'bold', marginBottom: '6px' }}>Stats</div>
        <div>Entries: {stats.totalEntries}</div>
        <div>Size: {Math.round(stats.totalSize / 1024)}KB</div>
        <div>Expired: {stats.expiredEntries}</div>
        {stats.oldestEntry !== Infinity && (
          <div>Oldest: {Math.round((Date.now() - stats.oldestEntry) / 1000)}s ago</div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button style={{...buttonStyles, background: '#dc3545'}} onClick={handleClearAll}>
          Clear All
        </button>
        <button style={buttonStyles} onClick={handleClearLeaderboard}>
          Clear Leaderboard
        </button>
        <button style={{...buttonStyles, background: '#28a745'}} onClick={handleClearRecentPlays}>
          Clear Recent Plays
        </button>
        <button style={{...buttonStyles, background: '#ffc107', color: 'black'}} onClick={handleClearPlayerData}>
          Clear Player Data
        </button>
      </div>
    </div>
  );
}

export function CacheDebugWrapper() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isDev = process.env.NODE_ENV === 'development';
    const isDebug = params.get('cache-debug') === 'true';
    
    setEnabled(isDev || isDebug);
  }, []);

  if (!enabled) return null;

  return <CacheDebugPanel />;
}
