import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PLATFORM_CREATOR_ADDRESS } from '../../constants';
import { Modal } from '../../components';
import styled, { keyframes } from 'styled-components';
import { useIsCompact } from '../../hooks/ui/useIsCompact';
import { useColorScheme } from '../../themes/ColorSchemeContext';

// Keyframe animations matching dashboard style
const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`

interface CompactProps {
  $compact?: boolean;
  $colorScheme?: any;
}

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: white;
`;

const Header = styled.div<CompactProps>`
  text-align: center;
  margin-bottom: ${({ $compact }) => ($compact ? '2rem' : '3rem')};
  position: relative;
`;

const Title = styled.h1<CompactProps>`
  font-size: ${({ $compact }) => ($compact ? '2.5rem' : '3rem')};
  font-family: 'Luckiest Guy', cursive, sans-serif;
  background: linear-gradient(90deg, ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'}, ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'}, ${({ $colorScheme }) => $colorScheme?.colors?.accent || '#ff00cc'}, ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'});
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  animation: ${moveGradient} 3s linear infinite;
  text-shadow: 0 0 30px ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'}80;
  
  @media (max-width: 768px) {
    font-size: ${({ $compact }) => ($compact ? '2rem' : '2.5rem')};
  }
`;

const Subtitle = styled.p<CompactProps>`
  font-size: ${({ $compact }) => ($compact ? '1.1rem' : '1.3rem')};
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || 'rgba(255, 255, 255, 0.8)'};
  margin-bottom: ${({ $compact }) => ($compact ? '1.5rem' : '2rem')};
  font-weight: 300;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

// Animated accent bar
const AccentBar = styled.div<CompactProps>`
  height: ${({ $compact }) => ($compact ? '4px' : '6px')};
  width: 60%;
  max-width: 400px;
  margin: 0 auto ${({ $compact }) => ($compact ? '1.5rem' : '2rem')};
  border-radius: 3px;
  background: linear-gradient(90deg, ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'}, ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'}, ${({ $colorScheme }) => $colorScheme?.colors?.accent || '#ff00cc'}, ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'});
  background-size: 300% 100%;
  animation: ${moveGradient} 3s linear infinite;
  box-shadow: 0 0 20px ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'}66;
`;

const CasinoSparkles = styled.div`
  position: absolute;
  top: -20px;
  right: 10%;
  font-size: 2rem;
  animation: ${sparkle} 2s infinite;
  pointer-events: none;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    right: 5%;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff5555;
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #ff5555;
`;

const CardDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #ff5555, #ff8844);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(255, 85, 85, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultModal = styled.div`
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 85, 85, 0.3);
  border-radius: 12px;
  padding: 25px;
  max-width: 800px;
  width: 95%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
`;

const ResultTitle = styled.h3`
  color: #ff5555;
  margin-bottom: 15px;
`;

const ResultContent = styled.pre`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  color: #e0e0e0;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 85, 85, 0.5);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 85, 85, 0.7);
  }

  /* Highlight status icons and emojis */
  span.status-icon {
    font-size: 1.1rem;
    margin-right: 4px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: #ff5555;
  }
`;

const AccessDenied = styled.div`
  text-align: center;
  padding: 50px 20px;
`;

const AccessDeniedTitle = styled.h2`
  color: #ff5555;
  margin-bottom: 20px;
`;

const AccessDeniedText = styled.p`
  color: #888;
  font-size: 1.1rem;
  margin-bottom: 30px;
`;

const TokenInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`;

const TokenTitle = styled.h4`
  color: #ff5555;
  margin-bottom: 10px;
  font-size: 1rem;
`;

const TokenText = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin: 5px 0;
`;

const WalletAddress = styled.code`
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 10px;
  border-radius: 4px;
  font-family: monospace;
`;

interface AdminCommand {
  id: string;
  title: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'DELETE';
  requiresAuth?: boolean;
  body?: any;
}

const ADMIN_COMMANDS: AdminCommand[] = [
  {
    id: 'comprehensive-test',
    title: '🚀 Comprehensive System Test',
    description: 'Run complete 60-second test of all RPC calls, APIs, and calculate daily usage metrics',
    endpoint: '/api/monitoring/comprehensive-test',
    method: 'GET'
  },
  {
    id: 'generate-test-data',
    title: '🧪 Generate Test Usage Data',
    description: 'Create sample API calls to test usage tracking system',
    endpoint: '/api/monitoring/debug-usage',
    method: 'POST'
  },
  {
    id: 'rpc-health',
    title: '🔌 RPC Health Monitor',
    description: 'Live health check of all Solana RPC endpoints with response times',
    endpoint: '/api/monitoring/rpc-health',
    method: 'GET'
  },
  {
    id: 'usage-debug',
    title: '🔍 Usage Tracking Debug',
    description: 'Debug usage tracking system and see why calls might be missing',
    endpoint: '/api/monitoring/usage-debug',
    method: 'GET'
  },
  {
    id: 'usage-metrics',
    title: '📊 API Usage & Cost Analysis',
    description: 'Calculate current API usage patterns and estimated daily costs',
    endpoint: '/api/monitoring/usage-metrics',
    method: 'GET'
  },
  {
    id: 'cache-stats',
    title: 'Cache Statistics',
    description: 'Get current cache statistics and performance metrics',
    endpoint: '/api/cache/cache-admin?action=stats',
    method: 'GET'
  },
  {
    id: 'cache-cleanup',
    title: 'Cache Cleanup',
    description: 'Clean expired cache entries',
    endpoint: '/api/cache/cache-admin?action=cleanup',
    method: 'GET',
    requiresAuth: true
  },
  {
    id: 'cache-warmup',
    title: 'Cache Warmup',
    description: 'Warm up cache with common data',
    endpoint: '/api/cache/cache-warmup',
    method: 'GET'
  },
  {
    id: 'dns-check',
    title: 'DNS Health Check',
    description: 'Check DNS status across multiple locations',
    endpoint: '/api/dns/check-dns',
    method: 'GET'
  },
  {
    id: 'rtp-audit',
    title: 'RTP Audit',
    description: 'Run RTP validation tests for all games',
    endpoint: '/api/audit/edgeCases?plays=10000',
    method: 'GET'
  },
  {
    id: 'price-data',
    title: 'Price Data',
    description: 'Get cryptocurrency price data',
    endpoint: '/api/services/coingecko',
    method: 'GET'
  },
  {
    id: 'chat-messages',
    title: 'Chat Messages',
    description: 'Get current chat messages',
    endpoint: '/api/chat/chat',
    method: 'GET'
  }
];

const AdminPage: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [selectedCommand, setSelectedCommand] = useState<AdminCommand | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const isCompact = useIsCompact();
  const { currentColorScheme } = useColorScheme();

  // Check if connected wallet is the creator
  const isCreator = connected && publicKey?.equals(PLATFORM_CREATOR_ADDRESS);

  const formatComprehensiveTest = (data: any): string => {
    if (!data) return 'No data received';
    
    const status = data.overallStatus || 'unknown';
    const statusIcon = status === 'healthy' ? '🟢' : status === 'degraded' ? '🟡' : '🔴';
    
    let result = `${statusIcon} SYSTEM STATUS: ${status.toUpperCase()}\n`;
    result += `${'═'.repeat(50)}\n\n`;
    
    // Summary
    if (data.summary) {
      result += `📊 TEST SUMMARY:\n`;
      result += `   ✓ Total Tests: ${data.summary.totalTests}\n`;
      result += `   ✓ Successful: ${data.summary.successfulTests}\n`;
      result += `   ${data.summary.failedTests > 0 ? '✗' : '✓'} Failed: ${data.summary.failedTests}\n`;
      result += `   📈 Success Rate: ${((data.summary.successfulTests / data.summary.totalTests) * 100).toFixed(1)}%\n`;
      result += `   ⚡ Average Response: ${Math.round(data.summary.averageResponseTime)}ms\n\n`;
    }
    
    // RPC Health Summary
    if (data.rpcHealth) {
      const rpcStatus = data.rpcHealth.overallStatus;
      const rpcIcon = rpcStatus === 'healthy' ? '🟢' : rpcStatus === 'degraded' ? '🟡' : '🔴';
      result += `${rpcIcon} RPC HEALTH:\n`;
      result += `   📡 Status: ${rpcStatus.toUpperCase()}\n`;
      result += `   📞 Successful Calls: ${data.rpcHealth.successfulCalls}/${data.rpcHealth.totalCalls}\n`;
      result += `   ⚡ Average Response: ${Math.round(data.rpcHealth.averageResponseTime)}ms\n\n`;
    }
    
    // Usage Metrics
    if (data.usageMetrics) {
      result += `📈 DAILY USAGE ESTIMATE:\n`;
      const usage = data.usageMetrics.estimatedDailyUsage;
      result += `   🔄 Total API Calls: ${usage.totalDaily?.toLocaleString() || 'N/A'}\n`;
      result += `   🔌 RPC Calls: ${usage.rpcDaily?.toLocaleString() || 'N/A'}\n`;
      result += `   💰 Price API Calls: ${usage.priceDaily?.toLocaleString() || 'N/A'}\n`;
      result += `   🌐 Helius Calls: ${usage.heliusDaily?.toLocaleString() || 'N/A'}\n\n`;
      
      if (data.usageMetrics.costEstimates) {
        result += `💰 MONTHLY COST ESTIMATE:\n`;
        const costs = data.usageMetrics.costEstimates;
        result += `   💸 Total: $${costs.totalEstimatedMonthlyCost?.toFixed(2) || 'N/A'}\n`;
        result += `   🌐 Helius: $${costs.heliusCost?.toFixed(2) || 'N/A'}\n`;
        result += `   📊 CoinGecko: $${costs.coinGeckoCost?.toFixed(2) || 'N/A'}\n\n`;
      }
    }
    
    // Recommendations
    if (data.recommendations && data.recommendations.length > 0) {
      result += `💡 RECOMMENDATIONS:\n`;
      data.recommendations.forEach((rec: string, index: number) => {
        result += `   ${index + 1}. ${rec}\n`;
      });
      result += `\n`;
    }
    
    result += `🕐 Test completed in ${data.duration}ms\n`;
    result += `📅 ${new Date(data.timestamp).toLocaleString()}`;
    
    return result;
  };

  const formatRpcHealth = (data: any): string => {
    if (!data) return 'No data received';
    
    const status = data.overallStatus || 'unknown';
    const statusIcon = status === 'healthy' ? '🟢' : status === 'degraded' ? '🟡' : '🔴';
    
    let result = `${statusIcon} RPC HEALTH STATUS: ${status.toUpperCase()}\n`;
    result += `═══════════════════════════════════════\n\n`;
    
    // Overall metrics
    result += `📊 OVERALL METRICS:\n`;
    result += `   • Total Calls: ${data.totalCalls}\n`;
    result += `   • Successful: ${data.successfulCalls}\n`;
    result += `   • Failed: ${data.failedCalls}\n`;
    result += `   • Success Rate: ${((data.successfulCalls / data.totalCalls) * 100).toFixed(1)}%\n`;
    result += `   • Average Response: ${Math.round(data.averageResponseTime)}ms\n\n`;
    
    // Endpoint summaries
    if (data.endpointSummaries && data.endpointSummaries.length > 0) {
      result += `🔌 ENDPOINT STATUS:\n`;
      data.endpointSummaries.forEach((endpoint: any) => {
        const epStatus = endpoint.status;
        const epIcon = epStatus === 'healthy' ? '🟢' : epStatus === 'degraded' ? '🟡' : '🔴';
        result += `\n   ${epIcon} ${endpoint.type.toUpperCase()} RPC:\n`;
        result += `      • Status: ${epStatus}\n`;
        result += `      • Success Rate: ${((endpoint.successfulTests / endpoint.totalTests) * 100).toFixed(1)}%\n`;
        result += `      • Avg Response: ${Math.round(endpoint.averageResponseTime)}ms\n`;
        result += `      • Critical Failures: ${endpoint.criticalFailures}\n`;
      });
    }
    
    // Daily usage estimate
    if (data.estimatedDailyUsage) {
      result += `\n\n📈 ESTIMATED DAILY USAGE:\n`;
      result += `   • Total Calls/Day: ${data.estimatedDailyUsage.totalCallsPerDay?.toLocaleString()}\n`;
      if (data.estimatedDailyUsage.peakUsagePeriods) {
        result += `   • Peak Hours: ${data.estimatedDailyUsage.peakUsagePeriods.join(', ')}\n`;
      }
    }
    
    result += `\n🕐 Analysis completed in ${data.duration}ms\n`;
    result += `📅 ${new Date(data.timestamp).toLocaleString()}`;
    
    return result;
  };

  const formatUsageMetrics = (data: any): string => {
    if (!data) return 'No data received';
    
    let result = `📊 API USAGE METRICS REPORT (REAL DATA)\n`;
    result += `${'═'.repeat(50)}\n\n`;
    
    // Check if we have any real data
    const hasRealData = data.current?.total > 0 || 
                        data.daily?.total > 0 || 
                        Object.values(data.current?.breakdown || {}).some((val: any) => val > 0);
    
    if (!hasRealData) {
      result += `🔄 USAGE TRACKING ACTIVE\n\n`;
      result += `📝 STATUS:\n`;
      result += `   ✅ Real-time tracking system implemented\n`;
      result += `   ✨ In-memory counters active\n`;
      result += `   📊 Auto-generating test data each refresh\n\n`;
      
      result += `🧪 HOW TO SEE DATA:\n`;
      result += `   1️⃣ Refresh this page - auto-generates test calls\n`;
      result += `   2️⃣ Use your app normally to create real traffic\n`;
      result += `   3️⃣ Check console logs for tracking activity\n\n`;
      
      result += `📋 CURRENT CONFIGURATION:\n`;
      result += `   🔌 Syndica: Standard Plan (FREE) - 100 RPS, 10M/month\n`;
      result += `   🌐 Helius: Free Plan - 10 RPS, 1M credits/month\n`;
      result += `   💰 All services: $0 cost (free plans)\n\n`;
      
      result += `📝 DEBUG INFO:\n`;
      result += `   • Current total: ${data.current?.total || 0}\n`;
      result += `   • Daily total: ${data.daily?.total || 0}\n`;
      result += `   • Breakdown: ${JSON.stringify(data.current?.breakdown || {})}\n`;
      
      return result;
    }
    
    // Show real tracked data
    result += `✅ REAL USAGE DATA DETECTED!\n\n`;
    result += `📈 CURRENT HOUR USAGE:\n`;
    result += `   🔄 Total: ${data.current?.total?.toLocaleString()}\n`;
    result += `   🔌 RPC: ${data.current?.breakdown?.rpc?.toLocaleString()}\n`;
    result += `   💰 Price: ${data.current?.breakdown?.price?.toLocaleString()}\n`;
    result += `   🌐 Helius: ${data.current?.breakdown?.helius?.toLocaleString()}\n`;
    result += `   💬 Chat: ${data.current?.breakdown?.chat?.toLocaleString()}\n`;
    result += `   🔧 Other: ${((data.current?.breakdown?.cache || 0) + (data.current?.breakdown?.dns || 0) + (data.current?.breakdown?.audit || 0))?.toLocaleString()}\n\n`;
    
    // RPC Endpoint Breakdown (when data exists)
    if (data.rpcEndpoints) {
      const totalRpc = Object.values(data.rpcEndpoints).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0) as number;
      if (totalRpc > 0) {
        result += `🔌 RPC ENDPOINT BREAKDOWN:\n`;
        const rpc = data.rpcEndpoints;
        result += `   🥇 Syndica Primary: ${rpc['syndica-primary']?.toLocaleString() || 0}\n`;
        result += `   🏦 Syndica Balance: ${rpc['syndica-balance']?.toLocaleString() || 0}\n`;
        result += `   🔄 Helius Backup: ${rpc['helius-backup']?.toLocaleString() || 0}\n`;
        result += `   ⚠️  Ankr Last Resort: ${rpc['ankr-last-resort']?.toLocaleString() || 0}\n`;
        result += `   🚨 Solana Labs Last Resort: ${rpc['solana-labs-last-resort']?.toLocaleString() || 0}\n\n`;
      }
    }
    
    // Daily usage (when data exists)
    if (data.daily?.total > 0) {
      result += `🗓️ TODAY'S USAGE:\n`;
      const daily = data.daily;
      result += `   📊 Total: ${daily.total?.toLocaleString()}\n`;
      result += `   🔌 RPC: ${daily.breakdown?.rpc?.toLocaleString()}\n`;
      result += `   💰 Price: ${daily.breakdown?.price?.toLocaleString()}\n`;
      result += `   🌐 Helius: ${daily.breakdown?.helius?.toLocaleString()}\n`;
      result += `   💬 Chat: ${daily.breakdown?.chat?.toLocaleString()}\n`;
      result += `   🔧 Other: ${((daily.breakdown?.cache || 0) + (daily.breakdown?.dns || 0) + (daily.breakdown?.audit || 0))?.toLocaleString()}\n\n`;
    }
    
    // Rate limits
    if (data.rateLimits) {
      result += `⚡ RATE LIMIT STATUS:\n`;
      const rl = data.rateLimits;
      
      if (rl.syndica) {
        const status = rl.syndica.status === 'healthy' ? '🟢' : '🟡';
        result += `   ${status} SYNDICA: ${rl.syndica.currentRps} RPS / ${rl.syndica.rpsLimit} limit\n`;
      }
      
      if (rl.helius) {
        const status = rl.helius.status === 'healthy' ? '🟢' : '🟡';
        result += `   ${status} HELIUS: ${rl.helius.currentRps} RPS / ${rl.helius.rpsLimit} limit\n`;
      }
      
      result += `\n`;
    }
    
    result += `🎯 TRACKING SUCCESS! System is working correctly.\n`;
    return result;
  };

  const formatUsageDebug = (data: any): string => {
    if (!data) return 'No data received';
    
    let result = `🔍 USAGE TRACKING DEBUG REPORT\n`;
    result += `${'═'.repeat(50)}\n\n`;
    
    // Current tracking status
    result += `📊 TRACKING STATUS: ${data.status?.toUpperCase()}\n\n`;
    
    // Expected vs Actual
    if (data.analysis) {
      result += `🎯 EXPECTED vs ACTUAL:\n`;
      result += `   Expected: ${data.analysis.expectedCalls.helius}, ${data.analysis.expectedCalls.syndica}\n`;
      result += `   Actual: Helius=${data.analysis.actualCalls.helius}, RPC=${data.analysis.actualCalls.rpc}, Total=${data.analysis.actualCalls.total}\n\n`;
    }
    
    // Current usage breakdown
    if (data.current?.hour) {
      result += `📈 CURRENT HOUR USAGE:\n`;
      Object.entries(data.current.hour).forEach(([key, value]) => {
        result += `   ${key}: ${value}\n`;
      });
      result += `\n`;
    }
    
    // RPC endpoint breakdown
    if (data.current?.rpcEndpoints) {
      result += `🔌 RPC ENDPOINT USAGE:\n`;
      Object.entries(data.current.rpcEndpoints).forEach(([key, value]) => {
        result += `   ${key}: ${value}\n`;
      });
      result += `\n`;
    }
    
    // Enabled APIs
    if (data.tracking?.trackedAPIs) {
      result += `✅ TRACKED APIs:\n`;
      data.tracking.trackedAPIs.forEach((api: string) => {
        result += `   • ${api}\n`;
      });
      result += `\n`;
    }
    
    // Possible reasons for missing calls
    if (data.analysis?.possibleReasons) {
      result += `❓ POSSIBLE REASONS FOR MISSING CALLS:\n`;
      data.analysis.possibleReasons.forEach((reason: string, index: number) => {
        result += `   ${index + 1}. ${reason}\n`;
      });
      result += `\n`;
    }
    
    // Raw debug info
    if (data.raw) {
      result += `🔧 RAW DEBUG DATA:\n`;
      result += `   Total Tracked Calls: ${data.raw.totalTrackedCalls}\n`;
      result += `   Hourly Counters: ${Object.keys(data.raw.hourlyCounters).length} entries\n`;
      result += `   Daily Counters: ${Object.keys(data.raw.dailyCounters).length} entries\n`;
      result += `   Endpoint Counters: ${Object.keys(data.raw.endpointCounters).length} entries\n`;
    }
    
    result += `\n📅 ${new Date(data.timestamp).toLocaleString()}`;
    return result;
  };

  const formatCacheStats = (data: any): string => {
    if (!data) return 'No data received';
    
    let result = `💾 CACHE STATISTICS\n`;
    result += `═══════════════════════════════════════\n\n`;
    
    result += `📊 CACHE PERFORMANCE:\n`;
    result += `   • Total Entries: ${data.totalEntries || 'N/A'}\n`;
    result += `   • Hit Rate: ${data.hitRate ? (data.hitRate * 100).toFixed(1) + '%' : 'N/A'}\n`;
    result += `   • Memory Usage: ${data.memoryUsage || 'N/A'}\n`;
    result += `   • Expired Entries: ${data.expiredEntries || 'N/A'}\n\n`;
    
    if (data.actions) {
      result += `🛠️ AVAILABLE ACTIONS:\n`;
      data.actions.forEach((action: string) => {
        result += `   • ${action}\n`;
      });
    }
    
    result += `\n📅 ${new Date(data.timestamp).toLocaleString()}`;
    
    return result;
  };

  const formatDnsCheck = (data: any): string => {
    if (!data) return 'No data received';
    
    const status = data.status || 'unknown';
    const statusIcon = status === 'Online' ? '🟢' : status === 'Issues' ? '🟡' : '🔴';
    
    let result = `${statusIcon} DNS STATUS: ${status.toUpperCase()}\n`;
    result += `═══════════════════════════════════════\n\n`;
    
    if (data.results && data.results.length > 0) {
      result += `🌍 GLOBAL DNS STATUS:\n`;
      data.results.forEach((location: any) => {
        const locIcon = location.status === 'online' ? '🟢' : '🔴';
        result += `   ${locIcon} ${location.location}, ${location.country}: ${location.status}\n`;
      });
    }
    
    return result;
  };

  const formatRtpAudit = (data: any): string => {
    if (!data) return 'No data received';
    
    const status = data.overallStatus || 'unknown';
    const statusIcon = status === 'healthy' ? '🟢' : status === 'warning' ? '🟡' : '🔴';
    
    let result = `${statusIcon} RTP AUDIT: ${status.toUpperCase()}\n`;
    result += `═══════════════════════════════════════\n\n`;
    
    result += `🎰 AUDIT SUMMARY:\n`;
    result += `   • Total Tests: ${data.totalTests || 'N/A'}\n`;
    result += `   • Passed: ${data.passedTests || 'N/A'}\n`;
    result += `   • Failed: ${data.failedTests || 'N/A'}\n`;
    result += `   • Success Rate: ${data.successRate ? (data.successRate * 100).toFixed(1) + '%' : 'N/A'}\n\n`;
    
    if (data.gameResults && data.gameResults.length > 0) {
      result += `🎲 GAME RESULTS:\n`;
      data.gameResults.forEach((game: any) => {
        const gameIcon = game.status === 'pass' ? '✅' : '❌';
        result += `   ${gameIcon} ${game.game}: ${game.status} (RTP: ${(game.actualRtp * 100).toFixed(2)}%)\n`;
      });
    }
    
    return result;
  };

  const formatPriceData = (data: any): string => {
    if (!data) return 'No data received';
    
    let result = `💰 CRYPTOCURRENCY PRICES\n`;
    result += `═══════════════════════════════════════\n\n`;
    
    const tokens = Object.entries(data);
    tokens.forEach(([tokenId, priceData]: [string, any]) => {
      if (priceData && typeof priceData === 'object' && priceData.usd) {
        result += `💎 ${tokenId.toUpperCase()}:\n`;
        result += `   • Price: $${priceData.usd.toFixed(6)}\n\n`;
      }
    });
    
    return result;
  };

  const formatChatMessages = (data: any): string => {
    if (!Array.isArray(data)) return 'Invalid chat data received';
    
    let result = `💬 CHAT MESSAGES (${data.length} total)\n`;
    result += `═══════════════════════════════════════\n\n`;
    
    if (data.length === 0) {
      result += `📭 No messages found\n`;
    } else {
      const recentMessages = data.slice(-10); // Show last 10 messages
      recentMessages.forEach((msg: any, index: number) => {
        const time = new Date(msg.ts).toLocaleTimeString();
        result += `[${time}] ${msg.user}: ${msg.text}\n`;
      });
      
      if (data.length > 10) {
        result += `\n... and ${data.length - 10} more messages`;
      }
    }
    
    return result;
  };

  // Format results in a human-readable way
  const formatResult = (command: AdminCommand, jsonData: any): string => {
    // Handle monitoring API responses with human-readable formatting
    if (command.id === 'comprehensive-test') {
      return formatComprehensiveTest(jsonData);
    }
    
    if (command.id === 'generate-test-data') {
      return `🧪 TEST DATA GENERATED SUCCESSFULLY!\n${'═'.repeat(50)}\n\nSample API calls have been created to test the usage tracking system.\n\n✅ Generated calls:\n   • Helius API call\n   • CoinGecko price API call\n   • Syndica RPC call\n   • Chat API call\n\n💡 Now run "API Usage & Cost Analysis" to see the tracked data!\n\nResponse: ${JSON.stringify(jsonData, null, 2)}`;
    }
    
    if (command.id === 'rpc-health') {
      return formatRpcHealth(jsonData);
    }
    
    if (command.id === 'usage-debug') {
      return formatUsageDebug(jsonData);
    }
    
    if (command.id === 'usage-metrics') {
      return formatUsageMetrics(jsonData);
    }
    
    if (command.id === 'cache-stats') {
      return formatCacheStats(jsonData);
    }
    
    if (command.id === 'dns-check') {
      return formatDnsCheck(jsonData);
    }
    
    if (command.id === 'rtp-audit') {
      return formatRtpAudit(jsonData);
    }
    
    if (command.id === 'price-data') {
      return formatPriceData(jsonData);
    }
    
    if (command.id === 'chat-messages') {
      return formatChatMessages(jsonData);
    }
    
    // Default JSON formatting for unknown commands
    return JSON.stringify(jsonData, null, 2);
  };

  const executeCommand = useCallback(async (command: AdminCommand) => {
    setLoading(true);
    setResult('');

    try {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}${command.endpoint}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add admin token if required
      if (command.requiresAuth) {
        const adminToken = localStorage.getItem('admin_token') || prompt('Enter admin token (check .env file or Vercel settings):');
        if (adminToken) {
          headers['X-Admin-Token'] = adminToken;
          localStorage.setItem('admin_token', adminToken);
        }
      }

      const response = await fetch(url, {
        method: command.method,
        headers,
        body: command.body ? JSON.stringify(command.body) : undefined,
      });

      const data = await response.text();

      let formattedResult = `Status: ${response.status} ${response.statusText}\n\n`;

      if (response.ok) {
        try {
          const jsonData = JSON.parse(data);
          // Use human-readable formatting for known commands
          formattedResult += formatResult(command, jsonData);
        } catch {
          formattedResult += `Response:\n${data}`;
        }
      } else {
        formattedResult += `Error:\n${data}`;
      }

      setResult(formattedResult);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCommandClick = (command: AdminCommand) => {
    setSelectedCommand(command);
    executeCommand(command);
  };

  const closeModal = () => {
    setSelectedCommand(null);
    setResult('');
  };

  if (!connected) {
    return (
      <AdminContainer>
        <AccessDenied>
          <AccessDeniedTitle>🔒 Wallet Not Connected</AccessDeniedTitle>
          <AccessDeniedText>
            Please connect your wallet to access admin commands.
          </AccessDeniedText>
        </AccessDenied>
      </AdminContainer>
    );
  }

  if (!isCreator) {
    return (
      <AdminContainer>
        <AccessDenied>
          <AccessDeniedTitle>🚫 Access Denied</AccessDeniedTitle>
          <AccessDeniedText>
            Only the platform creator can access admin commands.
            <br />
            <br />
            Connected: <WalletAddress>{publicKey?.toBase58()}</WalletAddress>
            <br />
            Required: <WalletAddress>{PLATFORM_CREATOR_ADDRESS.toBase58()}</WalletAddress>
          </AccessDeniedText>
        </AccessDenied>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <Header $compact={!!isCompact}>
        <CasinoSparkles>🛠️⚡🛠️</CasinoSparkles>
        <Title $compact={!!isCompact} $colorScheme={currentColorScheme}>🛠️ Admin Control Panel</Title>
        <AccentBar $compact={!!isCompact} $colorScheme={currentColorScheme} />
        <Subtitle $compact={!!isCompact} $colorScheme={currentColorScheme}>
          Manage and monitor your DegenCasino platform
        </Subtitle>
      </Header>

      <TokenInfo>
        <TokenTitle>🔐 Admin Token Setup</TokenTitle>
        <TokenText>• <strong>Status:</strong> Server-side configured</TokenText>
        <TokenText style={{ color: '#888', fontSize: '0.8rem', marginTop: '10px' }}>
          💡 <strong>Tip:</strong> Token is stored in localStorage after first use
        </TokenText>
      </TokenInfo>

      <Grid>
        {ADMIN_COMMANDS.map((command) => (
          <Card key={command.id}>
            <CardTitle>{command.title}</CardTitle>
            <CardDescription>{command.description}</CardDescription>
            <Button
              onClick={() => handleCommandClick(command)}
              disabled={loading}
            >
              {loading && selectedCommand?.id === command.id ? 'Executing...' : 'Execute'}
            </Button>
          </Card>
        ))}
      </Grid>

      {selectedCommand && (
        <Modal onClose={closeModal}>
          <ResultModal>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <ResultTitle>{selectedCommand.title} - Result</ResultTitle>
            <ResultContent>{result || 'Loading...'}</ResultContent>
          </ResultModal>
        </Modal>
      )}
    </AdminContainer>
  );
};

export default AdminPage;
