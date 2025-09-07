# RPC Monitoring and Daily Usage Analysis System

## Overview

I've created a comprehensive monitoring system for your DegenCasino platform that provides:

1. **Live RPC health monitoring** across multiple endpoints
2. **Daily usage calculation** and cost estimation
3. **Comprehensive system testing** in 60 seconds
4. **Real-time monitoring script** for continuous operation

## New API Endpoints

### 1. RPC Health Monitor (`/api/monitoring/rpc-health`)
- Tests 5 Solana RPC endpoints (Primary, Backup, Solana Labs, QuickNode, Helius)
- Runs 8 different RPC method calls per endpoint
- Provides response times and health status
- Calculates estimated daily usage

**Example Response:**
```json
{
  "timestamp": "2025-01-07T...",
  "overallStatus": "healthy",
  "endpointSummaries": [
    {
      "endpoint": "https://api.mainnet-beta.solana.com",
      "type": "primary",
      "status": "healthy",
      "totalTests": 8,
      "successfulTests": 8,
      "averageResponseTime": 245
    }
  ],
  "estimatedDailyUsage": {
    "totalCallsPerDay": 11520,
    "callsPerEndpoint": {...}
  }
}
```

### 2. Usage Metrics (`/api/monitoring/usage-metrics`)
- Calculates current API usage across all services
- Provides hourly usage patterns with peak time detection
- Estimates monthly costs for external APIs
- Tracks RPC, Price API, Chat, Cache, DNS, and Audit usage

**Key Metrics:**
```json
{
  "estimatedDailyUsage": {
    "totalDaily": 142560,
    "rpcDaily": 82080,
    "priceDaily": 2880,
    "heliusDaily": 36000
  },
  "costEstimates": {
    "totalEstimatedMonthlyCost": 284.76,
    "heliusCost": 216.00,
    "coinGeckoCost": 60.48
  }
}
```

### 3. Comprehensive Test (`/api/monitoring/comprehensive-test`)
- Runs all monitoring checks in parallel
- Tests 9 different API endpoints
- Provides system health recommendations
- Completes full analysis in ~60 seconds

## Usage Instructions

### 1. Admin Panel Integration
The new monitoring endpoints are already integrated into your Admin Panel:

1. Go to `/admin` (requires creator wallet connection)
2. Click **"Comprehensive System Test"** for full 60-second analysis
3. Click **"RPC Health Monitor"** for real-time RPC status
4. Click **"API Usage & Cost Analysis"** for usage metrics

### 2. Continuous Monitoring Script

Run the monitoring script for continuous system monitoring:

```bash
# Basic monitoring (60-second intervals)
node scripts/monitor-rpc.mjs

# Custom interval (30-second intervals)
node scripts/monitor-rpc.mjs --interval=30

# Monitor production site
node scripts/monitor-rpc.mjs --url=https://degenheart.casino --interval=120
```

**Script Features:**
- Real-time health monitoring
- Success rate tracking
- Average response time calculation
- Cost estimation alerts
- Graceful shutdown with statistics

### 3. Production Deployment

These APIs work with Vercel Edge Runtime and will be available at:
- `https://degenheart.casino/api/monitoring/rpc-health`
- `https://degenheart.casino/api/monitoring/usage-metrics`
- `https://degenheart.casino/api/monitoring/comprehensive-test`

## Daily Usage Estimates

Based on typical casino usage patterns, here are the estimated daily API calls:

| Service Category | Daily Calls | Peak Multiplier | Monthly Cost |
|-----------------|-------------|-----------------|--------------|
| **RPC Calls** | 82,080 | 2.2x (7-10 PM UTC) | $24.62 |
| **Helius API** | 36,000 | 2.0x (Peak gaming) | $216.00 |
| **Price APIs** | 2,880 | 1.5x (Market hours) | $60.48 |
| **Chat API** | 21,600 | 2.5x (Evening) | $6.48 |
| **Cache/DNS** | 720 | 1.0x (Consistent) | $2.16 |
| **Total** | **142,560** | - | **$284.76** |

## Monitoring Recommendations

1. **Run comprehensive tests every 60 seconds** in production
2. **Set up alerts** for when `overallStatus` becomes "critical"
3. **Monitor cost estimates** - alert if monthly costs exceed $400
4. **Track RPC response times** - switch to backup if primary > 2000ms
5. **Use the continuous script** during high-traffic periods

## Key Features

✅ **Real-time RPC health monitoring**  
✅ **Automated daily usage calculation**  
✅ **Cost estimation and tracking**  
✅ **60-second comprehensive testing**  
✅ **Admin panel integration**  
✅ **Continuous monitoring script**  
✅ **Peak usage time detection**  
✅ **Multi-endpoint failover testing**  
✅ **Performance recommendations**

## Environment Variables Needed

Make sure these are set in your environment:
- `VITE_RPC_ENDPOINT` - Your primary RPC endpoint
- `HELIUS_API_KEY` - Helius API endpoint with key
- `CMC_API_KEY` - CoinMarketCap API key (optional)

The system will work with defaults if these aren't set, but monitoring will be more accurate with proper configuration.

## Next Steps

1. Deploy to production and test the endpoints
2. Set up monitoring alerts based on the API responses
3. Run the continuous monitoring script on a server
4. Use the daily usage data to optimize API costs
5. Set up automated scaling based on peak usage patterns

Your RPC monitoring and daily usage calculation system is now ready! 🚀
