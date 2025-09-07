# Usage Tracking System - DegenCasino

## Overview
The usage tracking system monitors all API calls across your DegenCasino platform to provide real-time insights into API usage, costs, and performance.

## Enabled APIs ✅

### 1. **Helius API** (`/api/services/helius.ts`)
- **Endpoint**: `/api/services/helius`
- **Category**: `helius`
- **Tracks**: Token metadata, transaction parsing, account lookups

### 2. **CoinGecko API** (`/api/services/coingecko.ts`)
- **Endpoint**: `/api/services/coingecko`
- **Category**: `price`
- **Tracks**: Cryptocurrency price data

### 3. **Chat API** (`/api/chat/chat.ts`)
- **Endpoint**: `/api/chat/chat`
- **Category**: `chat`
- **Tracks**: Chat message operations

### 4. **Cache Admin API** (`/api/cache/cache-admin.ts`)
- **Endpoint**: `/api/cache/cache-admin`
- **Category**: `cache`
- **Tracks**: Cache statistics, cleanup operations

### 5. **Cache Warmup API** (`/api/cache/cache-warmup.ts`)
- **Endpoint**: `/api/cache/cache-warmup`
- **Category**: `cache`
- **Tracks**: Cache warming operations

### 6. **DNS Check API** (`/api/dns/check-dns.ts`)
- **Endpoint**: `/api/dns/check-dns`
- **Category**: `dns`
- **Tracks**: DNS health checks

### 7. **Audit API** (`/api/audit/edgeCases.ts`)
- **Endpoint**: `/api/audit/edgeCases`
- **Category**: `audit`
- **Tracks**: RTP validation tests

### 8. **RPC Proxy** (`/api/rpc/proxy.ts`) 🆕
- **Endpoint**: `/api/rpc/proxy`
- **Category**: `rpc`
- **Tracks**: Solana RPC calls through proxy
- **Endpoints**: Syndica, Helius RPC, Ankr, Solana Labs

## How to Use RPC Proxy

Instead of calling RPC endpoints directly, use the proxy to enable tracking:

```javascript
// Before (untracked)
fetch('https://solana-mainnet.api.syndica.io/...', {
  method: 'POST',
  body: JSON.stringify({ method: 'getBalance', ... })
})

// After (tracked)
fetch('/api/rpc/proxy', {
  method: 'POST',
  headers: {
    'X-RPC-Endpoint': 'syndica-primary' // or 'helius-backup', 'ankr-last-resort'
  },
  body: JSON.stringify({ method: 'getBalance', ... })
})
```

## Available Endpoints
- `syndica-primary` - Primary Syndica RPC
- `syndica-balance` - Syndica for balance checks
- `helius-backup` - Helius RPC backup
- `ankr-last-resort` - Ankr public RPC
- `solana-labs-last-resort` - Solana Labs public RPC

## Admin Panel Commands

### 🧪 **Generate Test Data**
- Creates sample API calls to test tracking
- Useful for verifying tracking is working

### 🔍 **Usage Tracking Debug**
- Shows detailed debugging information
- Explains why calls might be missing
- Compares expected vs actual call counts

### 📊 **API Usage & Cost Analysis**
- Real-time usage metrics
- Cost estimates
- RPC endpoint breakdown

## Why Some Calls Might Be Missing

1. **Direct RPC Calls**: Your app makes direct calls to Syndica, bypassing tracking
2. **Client-Side Calls**: Wallet operations happen client-side
3. **Cached Responses**: Repeated calls may be served from cache
4. **Timing**: Calls made before tracking was enabled won't appear
5. **Different Endpoints**: Calls to unexpected endpoints

## Troubleshooting

If you expect to see more calls:

1. **Run "Generate Test Data"** to verify tracking works
2. **Check "Usage Tracking Debug"** for detailed analysis
3. **Use the RPC Proxy** for Solana calls to enable tracking
4. **Wait a few minutes** for in-memory counters to populate

## Real-Time Monitoring

The system uses in-memory counters that reset on server restart but provide real-time tracking during active sessions. All tracked calls are logged to console for debugging.

## Technical Details

- **Storage**: In-memory counters (hourly/daily)
- **Categories**: `rpc`, `helius`, `price`, `chat`, `cache`, `dns`, `audit`
- **Middleware**: `withUsageTracking()` wrapper function
- **Reset**: Counters reset on server restart (Edge function limitation)
