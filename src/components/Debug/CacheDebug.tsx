// src/components/Debug/CacheDebug.tsx
import React from 'react'
import { cache } from '../../utils/cache/cache'

interface CacheDebugProps {
  show?: boolean
}

export function CacheDebug({ show = false }: CacheDebugProps) {
  const [stats, setStats] = React.useState(cache.getStats())
  const [isOpen, setIsOpen] = React.useState(false)

  const refreshStats = () => {
    setStats(cache.getStats())
  }

  const clearAllCache = () => {
    cache.clear()
    refreshStats()
  }

  const clearLeaderboardCache = () => {
    cache.invalidateByPattern('leaderboard:.*')
    refreshStats()
  }

  const clearRecentPlaysCache = () => {
    cache.invalidateByPattern('recentPlays:.*')
    refreshStats()
  }

  const clearPlayerCache = () => {
    cache.invalidateByPattern('playerPlays:.*')
    refreshStats()
  }

  React.useEffect(() => {
    const interval = setInterval(refreshStats, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!show && process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      border: '1px solid #333',
      minWidth: '250px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <strong>Cache Debug</strong>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'transparent',
            border: '1px solid #666',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isOpen ? '−' : '+'}
        </button>
      </div>
      
      {isOpen && (
        <>
          <div style={{ marginBottom: '8px' }}>
            <div>Entries: {stats.totalEntries}</div>
            <div>Size: {Math.round(stats.totalSize / 1024)}KB</div>
            <div>Expired: {stats.expiredEntries}</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button 
              onClick={clearAllCache}
              style={{
                background: '#dc3545',
                border: 'none',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              Clear All Cache
            </button>
            
            <button 
              onClick={clearLeaderboardCache}
              style={{
                background: '#007bff',
                border: 'none',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              Clear Leaderboard
            </button>
            
            <button 
              onClick={clearRecentPlaysCache}
              style={{
                background: '#28a745',
                border: 'none',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              Clear Recent Plays
            </button>
            
            <button 
              onClick={clearPlayerCache}
              style={{
                background: '#ffc107',
                border: 'none',
                color: 'black',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              Clear Player Data
            </button>
          </div>
        </>
      )}
    </div>
  )
}
