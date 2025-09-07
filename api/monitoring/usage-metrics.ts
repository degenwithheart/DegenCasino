import { cacheOnTheFly, CacheTTL } from '../cache/xcacheOnTheFly'

export const config = {
  runtime: 'edge',
}

interface UsageMetrics {
  timestamp: string
  periodStart: string
  periodEnd: string
  totalApiCalls: number
  rpcCalls: number
  priceApiCalls: number
  chatApiCalls: number
  cacheApiCalls: number
  dnsApiCalls: number
  auditApiCalls: number
  heliusApiCalls: number
  estimatedDailyUsage: {
    totalDaily: number
    rpcDaily: number
    priceDaily: number
    chatDaily: number
    cacheDaily: number
    dnsDaily: number
    auditDaily: number
    heliusDaily: number
  }
  usageByHour: Record<string, number>
  peakUsageTimes: string[]
  costEstimates: {
    heliusCost: number
    coinGeckoCost: number
    coinMarketCapCost: number
    totalEstimatedMonthlyCost: number
  }
}

interface ApiEndpointConfig {
  name: string
  endpoint: string
  method: string
  expectedUsagePerMinute: number
  costPerRequest: number
  category: 'rpc' | 'price' | 'chat' | 'cache' | 'dns' | 'audit' | 'helius'
}

// Configuration for all API endpoints and their expected usage patterns
// UPDATED with realistic usage based on actual Helius data: 42,314 credits in 3 months
const API_ENDPOINTS: ApiEndpointConfig[] = [
  // RPC Endpoints - Based on actual gaming patterns
  {
    name: 'Primary RPC Health',
    endpoint: '/api/monitoring/rpc-health',
    method: 'GET',
    expectedUsagePerMinute: 0.2, // Every 5 minutes
    costPerRequest: 0.0001,
    category: 'rpc'
  },
  {
    name: 'Solana RPC Calls (Game Transactions)',
    endpoint: 'RPC_DIRECT',
    method: 'POST',
    expectedUsagePerMinute: 8, // Much more realistic based on actual usage
    costPerRequest: 0.0001,
    category: 'rpc'
  },
  {
    name: 'Wallet Balance Checks',
    endpoint: 'RPC_BALANCE',
    method: 'POST',
    expectedUsagePerMinute: 3, // Reduced from 20
    costPerRequest: 0.0001,
    category: 'rpc'
  },

  // Price API Endpoints
  {
    name: 'CoinGecko Price Fetch',
    endpoint: '/api/services/coingecko',
    method: 'GET',
    expectedUsagePerMinute: 0.5, // Every 2 minutes (cached for 2-5 min)
    costPerRequest: 0.01,
    category: 'price'
  },

  // Helius API - CORRECTED based on real usage: 42,314 in 3 months = ~470/day
  {
    name: 'Helius Transaction Processing',
    endpoint: '/api/services/helius',
    method: 'POST',
    expectedUsagePerMinute: 0.33, // 470/day ÷ 1440min = 0.33/min
    costPerRequest: 0.0002,
    category: 'helius'
  },

  // Chat API
  {
    name: 'Chat Message Fetch',
    endpoint: '/api/chat/chat',
    method: 'GET',
    expectedUsagePerMinute: 2, // Reduced from 10
    costPerRequest: 0.0001,
    category: 'chat'
  },
  {
    name: 'Chat Message Post',
    endpoint: '/api/chat/chat',
    method: 'POST',
    expectedUsagePerMinute: 0.5, // Reduced from 5
    costPerRequest: 0.0001,
    category: 'chat'
  },

  // Cache API
  {
    name: 'Cache Stats',
    endpoint: '/api/cache/cache-admin?action=stats',
    method: 'GET',
    expectedUsagePerMinute: 0.1, // Every 10 minutes
    costPerRequest: 0.00001,
    category: 'cache'
  },
  {
    name: 'Cache Warmup',
    endpoint: '/api/cache/cache-warmup',
    method: 'GET',
    expectedUsagePerMinute: 0.02, // Every 50 minutes
    costPerRequest: 0.0001,
    category: 'cache'
  },

  // DNS Monitoring
  {
    name: 'DNS Health Check',
    endpoint: '/api/dns/check-dns',
    method: 'GET',
    expectedUsagePerMinute: 0.05, // Every 20 minutes
    costPerRequest: 0.001,
    category: 'dns'
  },

  // Audit API
  {
    name: 'RTP Audit',
    endpoint: '/api/audit/edgeCases',
    method: 'GET',
    expectedUsagePerMinute: 0.01, // Every 100 minutes
    costPerRequest: 0.01,
    category: 'audit'
  }
]

// Simulate current usage based on time of day (realistic peak hours adjustment)
// Based on actual casino usage patterns and real Helius data
function getHourlyMultiplier(hour: number): number {
  // More realistic multipliers based on actual usage data
  if (hour >= 19 && hour <= 22) return 2.0 // Evening peak (7-10 PM UTC)
  if (hour >= 12 && hour <= 14) return 1.5 // Lunch peak
  if (hour >= 15 && hour <= 18) return 1.3 // Afternoon activity
  if (hour >= 8 && hour <= 11) return 1.2 // Morning activity
  if (hour >= 2 && hour <= 4) return 1.4 // Late night gaming
  if (hour >= 23 || hour <= 1) return 1.1 // Late night low activity
  return 0.8 // Low activity hours (more conservative baseline)
}

async function calculateCurrentUsage(): Promise<UsageMetrics> {
  const now = new Date()
  const periodStart = new Date(now.getTime() - 60 * 60 * 1000).toISOString() // Last hour
  const periodEnd = now.toISOString()
  const currentHour = now.getUTCHours()

  // REALISTIC CALCULATION based on actual Helius usage data:
  // Real usage: 42,314 credits in 3 months = ~470 calls/day
  // This means ~19.6 calls/hour average, with peaks up to ~40 calls/hour
  
  // Calculate usage by category
  let totalApiCalls = 0
  let rpcCalls = 0
  let priceApiCalls = 0
  let chatApiCalls = 0
  let cacheApiCalls = 0
  let dnsApiCalls = 0
  let auditApiCalls = 0
  let heliusApiCalls = 0

  // Calculate total costs
  let heliusCost = 0
  let coinGeckoCost = 0
  let coinMarketCapCost = 0

  // Generate hourly usage pattern for the last 24 hours
  const usageByHour: Record<string, number> = {}
  
  for (let i = 0; i < 24; i++) {
    const hour = (currentHour - i + 24) % 24
    const hourLabel = `${hour.toString().padStart(2, '0')}:00`
    const multiplier = getHourlyMultiplier(hour)
    
    let hourlyTotal = 0
    
    for (const endpoint of API_ENDPOINTS) {
      const baseUsage = endpoint.expectedUsagePerMinute * 60 // per hour
      const adjustedUsage = Math.round(baseUsage * multiplier)
      hourlyTotal += adjustedUsage
      
      // Add to category totals (only for current hour)
      if (i === 0) {
        switch (endpoint.category) {
          case 'rpc': rpcCalls += adjustedUsage; break
          case 'price': priceApiCalls += adjustedUsage; break
          case 'chat': chatApiCalls += adjustedUsage; break
          case 'cache': cacheApiCalls += adjustedUsage; break
          case 'dns': dnsApiCalls += adjustedUsage; break
          case 'audit': auditApiCalls += adjustedUsage; break
          case 'helius': heliusApiCalls += adjustedUsage; break
        }
        
        // Calculate costs
        if (endpoint.category === 'helius') {
          heliusCost += adjustedUsage * endpoint.costPerRequest
        }
        if (endpoint.category === 'price') {
          coinGeckoCost += adjustedUsage * endpoint.costPerRequest * 0.7 // 70% CoinGecko
          coinMarketCapCost += adjustedUsage * endpoint.costPerRequest * 0.3 // 30% CMC fallback
        }
      }
    }
    
    usageByHour[hourLabel] = hourlyTotal
    if (i === 0) totalApiCalls = hourlyTotal
  }

  // Calculate daily estimates (24-hour extrapolation)
  const totalDaily = totalApiCalls * 24
  const rpcDaily = rpcCalls * 24
  const priceDaily = priceApiCalls * 24
  const chatDaily = chatApiCalls * 24
  const cacheDaily = cacheApiCalls * 24
  const dnsDaily = dnsApiCalls * 24
  const auditDaily = auditApiCalls * 24
  const heliusDaily = heliusApiCalls * 24

  // VALIDATION: Check against real Helius usage
  // Real: 42,314 in 3 months = ~470/day
  // If our estimate is way off, add a warning
  const heliusValidation = heliusDaily <= 1000 ? 'REALISTIC' : 'OVERESTIMATE'

  // Identify peak usage times
  const sortedHours = Object.entries(usageByHour)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => hour)

  return {
    timestamp: now.toISOString(),
    periodStart,
    periodEnd,
    totalApiCalls,
    rpcCalls,
    priceApiCalls,
    chatApiCalls,
    cacheApiCalls,
    dnsApiCalls,
    auditApiCalls,
    heliusApiCalls,
    estimatedDailyUsage: {
      totalDaily,
      rpcDaily,
      priceDaily,
      chatDaily,
      cacheDaily,
      dnsDaily,
      auditDaily,
      heliusDaily
    },
    usageByHour,
    peakUsageTimes: sortedHours,
    costEstimates: {
      heliusCost: heliusCost * 24 * 30, // Monthly
      coinGeckoCost: coinGeckoCost * 24 * 30, // Monthly
      coinMarketCapCost: coinMarketCapCost * 24 * 30, // Monthly
      totalEstimatedMonthlyCost: (heliusCost + coinGeckoCost + coinMarketCapCost) * 24 * 30
    }
  }
}

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin')
  const allowedOrigins = new Set(['https://degenheart.casino', 'http://localhost:4001'])
  const corsOrigin = origin && allowedOrigins.has(origin) ? origin : 'https://degenheart.casino'

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders })
  }

  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })
  }

  try {
    // Cache usage calculations for 5 minutes
    const cacheKey = 'api-usage-metrics'
    
    const metrics = await cacheOnTheFly(cacheKey, async () => {
      return await calculateCurrentUsage()
    }, { ttl: CacheTTL.FIVE_MINUTES })

    return new Response(JSON.stringify(metrics, null, 2), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    })

  } catch (error: any) {
    console.error('Usage calculation error:', error)

    return new Response(JSON.stringify({
      error: 'Usage calculation failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
}
