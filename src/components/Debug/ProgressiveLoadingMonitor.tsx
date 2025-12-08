// Progressive Loading Performance Monitor
// Tracks and displays loading performance metrics

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import RpcMonitor from './RpcMonitor';
import AnalyzeMonitor from './AnalyzeMonitor';
import styled from 'styled-components';
import { useProgressiveLoading } from '../../hooks/system/useProgressiveLoading';
import { PLATFORM_CREATOR_ADDRESS } from '../../constants';

const MonitorsWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 340px;
  z-index: 10000;
  display: flex;
  gap: 12px;

  @media (max-width: 900px) {
    right: 12px;
    left: 12px;
    bottom: 12px;
    flex-direction: column;
    align-items: flex-end;
  }
`;

const MonitorPanel = styled.div<{ $isVisible: boolean; }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #00ff88;
  z-index: 10000;
  max-width: 300px;
  transition: all 0.3s ease;
  transform: ${props => props.$isVisible ? 'translateX(0)' : 'translateX(100%)'};
  
  @media (max-width: 768px) {
    display: none; // Hide on mobile
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #00ff88;
  color: black;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  cursor: pointer;
  z-index: 10001;
  
  &:hover {
    background: #00cc66;
  }
  
  @media (max-width: 768px) {
    display: none; // Hide on mobile
  }
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  
  .label {
    color: #888;
  }
  
  .value {
    color: #00ff88;
    font-weight: bold;
  }
  
  &.critical .value {
    color: #ff6b6b;
  }
  
  &.warning .value {
    color: #ffa500;
  }
  
  &.good .value {
    color: #00ff88;
  }
`;

const SectionTitle = styled.div`
  color: #6ffaff;
  font-weight: bold;
  margin: 12px 0 8px 0;
  border-bottom: 1px solid #333;
  padding-bottom: 4px;
  
  &:first-child {
    margin-top: 0;
  }
`;

export function ProgressiveLoadingMonitor() {
  const { publicKey, connected } = useWallet();
  const [isVisible, setIsVisible] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>({});
  const { getPerformanceStats, isProgressiveLoadingActive } = useProgressiveLoading();

  // All hooks must be called before any conditional returns
  useEffect(() => {
    // Only show in development or when debug flag is set
    const shouldShow = import.meta.env.DEV || localStorage.getItem('debug-progressive-loading') === 'true';
    if (!shouldShow) return;

    const updateStats = () => {
      const stats = getPerformanceStats();
      setPerformanceData(stats);
    };

    updateStats();
    const interval = setInterval(updateStats, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [getPerformanceStats]);

  // Check if connected wallet is the creator
  const isCreator = connected && publicKey?.equals(PLATFORM_CREATOR_ADDRESS);

  // Only show PerfMon for creator wallet
  if (!isCreator) {
    return null;
  }

  // Don't render in production unless debug flag is set
  if (import.meta.env.PROD && localStorage.getItem('debug-progressive-loading') !== 'true') {
    return null;
  }

  const getStatusClass = (value: number, thresholds: { good: number; warning: number; }) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.warning) return 'warning';
    return 'critical';
  };

  const formatMs = (ms: number) => `${ms.toFixed(1)}ms`;
  const formatBoolean = (bool: boolean) => bool ? '✅' : '❌';
  const formatNumber = (num: number) => num.toString();

  if (!isVisible) {
    return (
      <ToggleButton onClick={() => setIsVisible(true)}>
        📊 PerfMon
      </ToggleButton>
    );
  }

  return (
    <>
      <MonitorPanel $isVisible={isVisible}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ color: '#6ffaff', fontWeight: 'bold' }}>Progressive Loading Monitor</span>
          <button
            onClick={() => setIsVisible(false)}
            style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <SectionTitle>Loading State</SectionTitle>
        <MetricRow>
          <span className="label">Progressive Active:</span>
          <span className="value">{formatBoolean(isProgressiveLoadingActive())}</span>
        </MetricRow>
        <MetricRow>
          <span className="label">Critical Games:</span>
          <span className="value">{formatBoolean(performanceData.loadingState?.criticalGamesLoaded)}</span>
        </MetricRow>
        <MetricRow>
          <span className="label">High Priority:</span>
          <span className="value">{formatBoolean(performanceData.loadingState?.highPriorityGamesLoaded)}</span>
        </MetricRow>
        <MetricRow>
          <span className="label">User Specific:</span>
          <span className="value">{formatBoolean(performanceData.loadingState?.userSpecificPreloaded)}</span>
        </MetricRow>

        <SectionTitle>User Activity</SectionTitle>
        <MetricRow>
          <span className="label">Activity Level:</span>
          <span className="value">{performanceData.userActivity?.level || 'unknown'}</span>
        </MetricRow>
        <MetricRow>
          <span className="label">Games Played:</span>
          <span className="value">{formatNumber(performanceData.userActivity?.gamesPlayed?.length || 0)}</span>
        </MetricRow>
        <MetricRow>
          <span className="label">Session Duration:</span>
          <span className="value">{formatMs(performanceData.userActivity?.sessionDuration || 0)}</span>
        </MetricRow>

        <SectionTitle>Network</SectionTitle>
        <MetricRow>
          <span className="label">Connection:</span>
          <span className="value">
            {performanceData.networkInfo?.effectiveType || 'unknown'}
            {performanceData.networkInfo?.effectiveType === '4g' && ' (WiFi/Fast)'}
          </span>
        </MetricRow>
        <MetricRow>
          <span className="label">Downlink:</span>
          <span className="value">{performanceData.networkInfo?.downlink?.toFixed(1) || '0'}Mbps</span>
        </MetricRow>
        <MetricRow>
          <span className="label">RTT:</span>
          <span className={getStatusClass(performanceData.networkInfo?.rtt || 0, { good: 50, warning: 150 })}>
            <span className="value">{formatMs(performanceData.networkInfo?.rtt || 0)}</span>
          </span>
        </MetricRow>

        <SectionTitle>Service Worker</SectionTitle>
        <MetricRow>
          <span className="label">Active:</span>
          <span className="value">{formatBoolean(performanceData.serviceWorkerActive)}</span>
        </MetricRow>
        {!performanceData.serviceWorkerActive && (
          <MetricRow>
            <span className="label" style={{ fontSize: '10px', color: '#ffa500' }}>
              Registering... Refresh if not active after 5s
            </span>
          </MetricRow>
        )}

        {(performance as any).memory && (
          <>
            <SectionTitle>Memory</SectionTitle>
            <MetricRow className={getStatusClass((performance as any).memory.usedJSHeapSize / 1024 / 1024, { good: 50, warning: 100 })}>
              <span className="label">JS Heap Used:</span>
              <span className="value">{((performance as any).memory.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB</span>
            </MetricRow>
            <MetricRow>
              <span className="label">JS Heap Limit:</span>
              <span className="value">{((performance as any).memory.jsHeapSizeLimit / 1024 / 1024).toFixed(1)}MB</span>
            </MetricRow>
          </>
        )}
      </MonitorPanel>
      {/* Render RPC monitor alongside PerfMon in dev/debug mode */}
      {isVisible && (import.meta.env.DEV || localStorage.getItem('debug-progressive-loading') === 'true') && (
        <MonitorsWrapper>
          <RpcMonitor />
          <AnalyzeMonitor />
        </MonitorsWrapper>
      )}
    </>
  );
}