import { useState, useEffect } from "react";
import { useCacheMonitor, getCacheStats, cleanupCache, warmupCache } from "../../utils/cacheMonitor";
import { 
  DebugPanel, 
  DebugTitle, 
  StatRow, 
  StatLabel, 
  StatValue, 
  Button, 
  ActivityList, 
  ActivityItem, 
  ToggleButton 
} from './Cache.styles';

export function CacheDebugPanel() {
  const [isVisible, setIsVisible] = useState(false)
  const [serverStats, setServerStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { stats, topKeys, clear } = useCacheMonitor()

  // Fetch server-side cache stats
  useEffect(() => {
    if (isVisible) {
      const fetchStats = async () => {
        const data = await getCacheStats()
        setServerStats(data)
      }
      fetchStats()
      
      const interval = setInterval(fetchStats, 10000) // Update every 10s
      return () => clearInterval(interval)
    }
  }, [isVisible])

  const handleCleanup = async () => {
    setLoading(true)
    const success = await cleanupCache()
    if (success) {
      console.log('Cache cleanup completed')
      // Refresh stats
      const data = await getCacheStats()
      setServerStats(data)
    }
    setLoading(false)
  }

  const handleWarmup = async () => {
    setLoading(true)
    const success = await warmupCache()
    if (success) {
      console.log('Cache warmup completed')
      // Refresh stats  
      const data = await getCacheStats()
      setServerStats(data)
    }
    setLoading(false)
  }

  if (!isVisible) {
    return (
      <ToggleButton 
        onClick={() => setIsVisible(true)}
        title="Show Cache Debug Panel"
      >
        📊
      </ToggleButton>
    )
  }

  return (
    <DebugPanel>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <DebugTitle>Cache Debug Panel</DebugTitle>
        <Button onClick={() => setIsVisible(false)}>✕</Button>
      </div>

      {/* Client Stats */}
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ color: '#ffd700', margin: '0 0 0.5rem 0', fontSize: '12px' }}>Client Cache</h4>
        <StatRow>
          <StatLabel>Hit Rate:</StatLabel>
          <StatValue>{stats.hitRate.toFixed(1)}%</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Total Hits:</StatLabel>
          <StatValue>{stats.totalHits}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Total Misses:</StatLabel>
          <StatValue>{stats.totalMisses}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Unique Keys:</StatLabel>
          <StatValue>{stats.uniqueKeys}</StatValue>
        </StatRow>
      </div>

      {/* Server Stats */}
      {serverStats && (
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ color: '#ffd700', margin: '0 0 0.5rem 0', fontSize: '12px' }}>Server Cache</h4>
          <StatRow>
            <StatLabel>Size:</StatLabel>
            <StatValue>{serverStats.size}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Utilization:</StatLabel>
            <StatValue>{serverStats.utilization}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Max Size:</StatLabel>
            <StatValue>{serverStats.maxSize}</StatValue>
          </StatRow>
        </div>
      )}

      {/* Controls */}
      <div style={{ marginBottom: '1rem' }}>
        <Button onClick={clear} disabled={loading}>
          Clear Client Stats
        </Button>
        <Button onClick={handleCleanup} disabled={loading}>
          Server Cleanup
        </Button>
        <Button onClick={handleWarmup} disabled={loading}>
          Warmup Cache
        </Button>
      </div>

      {/* Top Keys */}
      {topKeys.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ color: '#ffd700', margin: '0 0 0.5rem 0', fontSize: '12px' }}>Top Cache Keys</h4>
          {topKeys.slice(0, 5).map((key, index) => (
            <div key={index} style={{ fontSize: '10px', marginBottom: '0.25rem' }}>
              <div style={{ color: '#ccc' }}>{key.key.slice(0, 30)}...</div>
              <div style={{ color: '#ffd700' }}>
                {key.hitRate.toFixed(1)}% ({key.hits}H/{key.misses}M)
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      <ActivityList>
        <h4 style={{ color: '#ffd700', margin: '0 0 0.5rem 0', fontSize: '12px' }}>Recent Activity</h4>
        {stats.recentActivity.map((activity, index) => (
          <ActivityItem key={index} $hit={activity.hit}>
            <div>{activity.hit ? 'HIT' : 'MISS'}: {activity.key.slice(0, 25)}...</div>
            <div style={{ opacity: 0.7 }}>
              {new Date(activity.timestamp).toLocaleTimeString()}
            </div>
          </ActivityItem>
        ))}
      </ActivityList>
    </DebugPanel>
  )
}

// Only show in development or when explicitly enabled
export function CacheDebugWrapper() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Enable debug panel with URL parameter or in development
    const params = new URLSearchParams(window.location.search)
    const isDev = process.env.GAMBA_ENV === 'development'
    const isDebug = params.get('cache-debug') === 'true'
    
    setEnabled(isDev || isDebug)
  }, [])

  if (!enabled) return null

  return <CacheDebugPanel />
}
