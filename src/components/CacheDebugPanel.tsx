import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useCacheMonitor, getCacheStats, cleanupCache, warmupCache } from '../utils/cacheMonitor'

const DebugPanel = styled.div`
  position: fixed
  bottom: 20px
  right: 20px
  width: 400px
  max-height: 600px
  background: rgba(24, 24, 24, 0.95)
  border: 2px solid #ffd700
  border-radius: 12px
  padding: 1rem
  font-family: 'Courier New', monospace
  font-size: 12px
  color: #fff
  backdrop-filter: blur(10px)
  z-index: 9999
  overflow-y: auto
  
  @media (max-width: 768px) {
    width: calc(100vw - 40px)
    bottom: 10px
    right: 10px
  }
`

const DebugTitle = styled.h3`
  color: #ffd700
  margin: 0 0 1rem 0
  font-size: 14px
  text-align: center
`

const StatRow = styled.div`
  display: flex
  justify-content: space-between
  margin-bottom: 0.5rem
  padding: 0.25rem
  border-bottom: 1px solid rgba(255, 215, 0, 0.2)
`

const StatLabel = styled.span`
  color: #ccc
`

const StatValue = styled.span`
  color: #ffd700
  font-weight: bold
`

const Button = styled.button`
  background: rgba(255, 215, 0, 0.1)
  border: 1px solid #ffd700
  color: #ffd700
  padding: 0.5rem 1rem
  border-radius: 6px
  cursor: pointer
  font-size: 11px
  margin: 0.25rem
  transition: all 0.2s ease
  
  &:hover {
    background: rgba(255, 215, 0, 0.2)
    transform: translateY(-1px)
  }
  
  &:disabled {
    opacity: 0.5
    cursor: not-allowed
  }
`

const ActivityList = styled.div`
  max-height: 150px
  overflow-y: auto
  margin-top: 1rem
  border-top: 1px solid rgba(255, 215, 0, 0.2)
  padding-top: 0.5rem
`

const ActivityItem = styled.div<{ $hit: boolean }>`
  font-size: 10px
  padding: 0.25rem
  margin-bottom: 0.25rem
  background: rgba(${props => props.$hit ? '34, 197, 94' : '239, 68, 68'}, 0.1)
  border-left: 3px solid ${props => props.$hit ? '#22c55e' : '#ef4444'}
  border-radius: 2px
`

const ToggleButton = styled.button`
  position: fixed
  bottom: 20px
  right: 20px
  width: 50px
  height: 50px
  border-radius: 50%
  background: rgba(255, 215, 0, 0.9)
  border: none
  color: #000
  font-size: 20px
  cursor: pointer
  z-index: 10000
  transition: all 0.2s ease
  
  &:hover {
    transform: scale(1.1)
    background: #ffd700
  }
`

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
