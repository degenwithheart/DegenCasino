#!/usr/bin/env node

/**
 * RPC Monitoring Script - Continuous monitoring of all API endpoints
 * Usage: node scripts/monitor-rpc.mjs [--interval=60] [--url=http://localhost:4001]
 */

import https from 'https';
import http from 'http';

// Configuration
const DEFAULT_INTERVAL = 60; // seconds
const DEFAULT_URL = 'http://localhost:4001';

// Parse command line arguments
const args = process.argv.slice(2);
const interval = args.find(arg => arg.startsWith('--interval='))?.split('=')[1] || DEFAULT_INTERVAL;
const baseUrl = args.find(arg => arg.startsWith('--url='))?.split('=')[1] || DEFAULT_URL;

console.log('🚀 Starting RPC Monitoring System');
console.log(`📊 Base URL: ${baseUrl}`);
console.log(`⏱️  Interval: ${interval} seconds`);
console.log('━'.repeat(80));

// Monitoring endpoints
const MONITORING_ENDPOINTS = [
  {
    name: 'Comprehensive Test',
    path: '/api/monitoring/comprehensive-test',
    critical: true
  },
  {
    name: 'RPC Health',
    path: '/api/monitoring/rpc-health',
    critical: true
  },
  {
    name: 'Usage Metrics',
    path: '/api/monitoring/usage-metrics',
    critical: false
  }
];

// Statistics tracking
const stats = {
  totalChecks: 0,
  successfulChecks: 0,
  failedChecks: 0,
  startTime: new Date(),
  lastCheckTime: null,
  averageResponseTime: 0,
  totalResponseTime: 0
};

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, {
      headers: {
        'User-Agent': 'DegenCasino-Monitor/1.0',
        'Accept': 'application/json'
      },
      timeout: 15000
    }, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            data: jsonData,
            responseTime
          });
        } catch (err) {
          resolve({
            statusCode: res.statusCode,
            data: data,
            responseTime
          });
        }
      });
    });
    
    req.on('error', (err) => {
      const responseTime = Date.now() - startTime;
      reject({
        error: err.message,
        responseTime
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      const responseTime = Date.now() - startTime;
      reject({
        error: 'Request timeout',
        responseTime
      });
    });
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

function getStatusIcon(status) {
  switch (status) {
    case 'healthy': return '🟢';
    case 'degraded': return '🟡';
    case 'critical': return '🔴';
    case 'success': return '✅';
    case 'error': return '❌';
    case 'timeout': return '⏰';
    default: return '❓';
  }
}

async function runMonitoringCheck() {
  const checkStartTime = Date.now();
  stats.totalChecks++;
  stats.lastCheckTime = new Date();
  
  console.log(`\n📊 Check #${stats.totalChecks} - ${stats.lastCheckTime.toISOString()}`);
  console.log('─'.repeat(80));
  
  const results = [];
  
  for (const endpoint of MONITORING_ENDPOINTS) {
    const url = `${baseUrl}${endpoint.path}`;
    
    try {
      console.log(`🔍 Testing ${endpoint.name}...`);
      const result = await makeRequest(url);
      
      const status = result.statusCode === 200 ? 'success' : 'error';
      const icon = getStatusIcon(status);
      
      console.log(`${icon} ${endpoint.name}: ${result.statusCode} (${result.responseTime}ms)`);
      
      results.push({
        ...endpoint,
        status,
        responseTime: result.responseTime,
        data: result.data
      });
      
      // Update stats
      stats.totalResponseTime += result.responseTime;
      
      if (status === 'success') {
        stats.successfulChecks++;
      } else {
        stats.failedChecks++;
      }
      
    } catch (error) {
      const icon = getStatusIcon('error');
      console.log(`${icon} ${endpoint.name}: ${error.error} (${error.responseTime}ms)`);
      
      results.push({
        ...endpoint,
        status: 'error',
        responseTime: error.responseTime,
        error: error.error
      });
      
      stats.failedChecks++;
      stats.totalResponseTime += error.responseTime;
    }
  }
  
  // Calculate averages
  stats.averageResponseTime = stats.totalResponseTime / stats.totalChecks;
  
  // Display comprehensive results
  const comprehensiveResult = results.find(r => r.name === 'Comprehensive Test');
  if (comprehensiveResult && comprehensiveResult.status === 'success' && comprehensiveResult.data) {
    const data = comprehensiveResult.data;
    
    console.log('\n📈 System Overview:');
    console.log(`${getStatusIcon(data.overallStatus)} Overall Status: ${data.overallStatus.toUpperCase()}`);
    console.log(`🎯 Tests: ${data.summary.successfulTests}/${data.summary.totalTests} passed`);
    console.log(`⚡ Avg Response: ${Math.round(data.summary.averageResponseTime)}ms`);
    
    if (data.usageMetrics) {
      console.log('\n💰 Usage & Costs:');
      console.log(`📞 Estimated Daily API Calls: ${data.usageMetrics.estimatedDailyUsage.totalDaily.toLocaleString()}`);
      console.log(`💸 Monthly Cost Estimate: $${data.usageMetrics.costEstimates.totalEstimatedMonthlyCost.toFixed(2)}`);
      console.log(`🔌 RPC Calls/Day: ${data.usageMetrics.estimatedDailyUsage.rpcDaily.toLocaleString()}`);
      console.log(`💰 Price API Calls/Day: ${data.usageMetrics.estimatedDailyUsage.priceDaily.toLocaleString()}`);
    }
    
    if (data.rpcHealth) {
      console.log('\n🔌 RPC Health Summary:');
      console.log(`${getStatusIcon(data.rpcHealth.overallStatus)} RPC Status: ${data.rpcHealth.overallStatus.toUpperCase()}`);
      console.log(`✅ Successful Calls: ${data.rpcHealth.successfulCalls}/${data.rpcHealth.totalCalls}`);
      console.log(`⚡ RPC Avg Response: ${Math.round(data.rpcHealth.averageResponseTime)}ms`);
    }
    
    if (data.recommendations && data.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      data.recommendations.forEach(rec => console.log(`   ${rec}`));
    }
  }
  
  // Display session statistics
  const uptime = Date.now() - stats.startTime;
  const successRate = ((stats.successfulChecks / (stats.successfulChecks + stats.failedChecks)) * 100).toFixed(1);
  
  console.log('\n📊 Session Statistics:');
  console.log(`⏱️  Uptime: ${formatDuration(uptime)}`);
  console.log(`✅ Success Rate: ${successRate}% (${stats.successfulChecks}/${stats.successfulChecks + stats.failedChecks})`);
  console.log(`⚡ Avg Response Time: ${Math.round(stats.averageResponseTime)}ms`);
  
  const checkDuration = Date.now() - checkStartTime;
  console.log(`🕐 Check Duration: ${checkDuration}ms`);
  console.log('─'.repeat(80));
}

// Start monitoring
console.log('Starting monitoring loop...\n');

async function monitoringLoop() {
  try {
    await runMonitoringCheck();
  } catch (error) {
    console.error('❌ Monitoring check failed:', error.message);
  }
  
  // Schedule next check
  setTimeout(monitoringLoop, interval * 1000);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down monitoring...');
  console.log('📊 Final Statistics:');
  console.log(`⏱️  Total Runtime: ${formatDuration(Date.now() - stats.startTime)}`);
  console.log(`📞 Total Checks: ${stats.totalChecks}`);
  console.log(`✅ Success Rate: ${((stats.successfulChecks / (stats.successfulChecks + stats.failedChecks)) * 100).toFixed(1)}%`);
  console.log(`⚡ Average Response Time: ${Math.round(stats.averageResponseTime)}ms`);
  console.log('\n👋 Goodbye!');
  process.exit(0);
});

// Start the monitoring loop
monitoringLoop();
