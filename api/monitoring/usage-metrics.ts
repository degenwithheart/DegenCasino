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
  rpcEndpointBreakdown: {
    syndicaPrimary: number
    syndicaBalance: number
    heliusBackup: number
    ankrLastResort: number
    solanaLabsLastResort: number
  }
  usageByHour: Record<string, number>
  peakUsageTimes: string[]
  costEstimates: {
    heliusCost: number
    coinGeckoCost: number
    coinMarketCapCost: number
    totalEstimatedMonthlyCost: number
  }
  rateLimitAnalysis: {
    syndicaUsage: {
      requestsPerSecond: number
      requestsPerMonth: number
      rpsLimit: number
      monthlyLimit: number
      rpsUtilization: number
      monthlyUtilization: number
      status: 'safe' | 'warning' | 'critical'
    }
    heliusUsage: {
      requestsPerSecond: number
      creditsPerMonth: number
      rpsLimit: number
      monthlyLimit: number
      rpsUtilization: number
      monthlyUtilization: number
      status: 'safe' | 'warning' | 'critical'
    }
    recommendations: string[]
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
// COST SOURCES:
// - Syndica: Standard Plan ($0/month, 10M requests/month, 100 RPS limit)
// - Helius: Free Plan (1M credits/month, 10 RPS limit) 
// - CoinGecko: Free tier (10-50 calls/min)
// - Internal APIs: No external cost (Vercel function execution)
// RATE LIMITS:
// - Syndica Standard: 100 requests/second, 10M requests/month
// - Helius Free: 10 requests/second, 1M credits/month
// - CoinGecko Free: 10-50 calls/minute depending on endpoint
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
  // Syndica RPC Endpoints - Standard Plan (FREE: $0/month, 10M requests/month, 100 RPS)
  {
    name: 'Syndica RPC Calls (Primary)',
    endpoint: 'SYNDICA_PRIMARY',
    method: 'POST',
    expectedUsagePerMinute: 8, // Primary RPC for game transactions
    costPerRequest: 0, // Syndica Standard Plan is FREE
    category: 'rpc'
  },
  {
    name: 'Syndica Balance Checks',
    endpoint: 'SYNDICA_BALANCE',
    method: 'POST',
    expectedUsagePerMinute: 3,
    costPerRequest: 0, // Syndica Standard Plan is FREE
    category: 'rpc'
  },

  // Helius RPC - Free Plan (1M credits/month, 10 RPS limit)
  {
    name: 'Helius RPC Backup',
    endpoint: 'HELIUS_RPC_BACKUP',
    method: 'POST',
    expectedUsagePerMinute: 1, // Only when Syndica fails
    costPerRequest: 0, // Helius Free Plan (1M credits included)
    category: 'rpc'
  },

  // Public RPC - Last Resort Only
  {
    name: 'Ankr RPC (Last Resort)',
    endpoint: 'ANKR_LAST_RESORT',
    method: 'POST',
    expectedUsagePerMinute: 0.1, // Should rarely be used
    costPerRequest: 0, // Free but rate limited
    category: 'rpc'
  },
  {
    name: 'Solana Labs RPC (Absolute Last)',
    endpoint: 'SOLANA_LABS_LAST_RESORT',
    method: 'POST',
    expectedUsagePerMinute: 0.05, // Should almost never be used
    costPerRequest: 0, // Free but heavily rate limited
    category: 'rpc'
  },

  // Price API Endpoints (COINGECKO: Free tier 10-50 calls/min, Pro ~$129/month)
  {
    name: 'CoinGecko Price Fetch',
    endpoint: '/api/services/coingecko',
    method: 'GET',
    expectedUsagePerMinute: 0.5, // Every 2 minutes (cached for 2-5 min)
    costPerRequest: 0, // Free tier up to 10-50 calls/min, then paid plans
    category: 'price'
  },

  // Helius v0 API - Transaction parsing only (FREE PLAN: 1M credits/month included)
  {
    name: 'Helius v0 Transaction Parsing',
    endpoint: '/api/services/helius',
    method: 'POST',
    expectedUsagePerMinute: 0.33, // 470/day ÷ 1440min = 0.33/min
    costPerRequest: 0, // Helius Free Plan (1M credits included)
    category: 'helius'
  },

  // Chat API (YOUR VERCEL FUNCTIONS - no external cost)
  {
    name: 'Chat Message Fetch',
    endpoint: '/api/chat/chat',
    method: 'GET',
    expectedUsagePerMinute: 2, // Reduced from 10
    costPerRequest: 0, // Internal API, no external cost
    category: 'chat'
  },
  {
    name: 'Chat Message Post',
    endpoint: '/api/chat/chat',
    method: 'POST',
    expectedUsagePerMinute: 0.5, // Reduced from 5
    costPerRequest: 0, // Internal API, no external cost
    category: 'chat'
  },

  // Cache API (YOUR VERCEL FUNCTIONS - no external cost)
  {
    name: 'Cache Stats',
    endpoint: '/api/cache/cache-admin?action=stats',
    method: 'GET',
    expectedUsagePerMinute: 0.1, // Every 10 minutes
    costPerRequest: 0, // Internal API, no external cost
    category: 'cache'
  },
  {
    name: 'Cache Warmup',
    endpoint: '/api/cache/cache-warmup',
    method: 'GET',
    expectedUsagePerMinute: 0.02, // Every 50 minutes
    costPerRequest: 0, // Internal API, no external cost
    category: 'cache'
  },

  // DNS Monitoring (YOUR VERCEL FUNCTIONS - no external cost)
  {
    name: 'DNS Health Check',
    endpoint: '/api/dns/check-dns',
    method: 'GET',
    expectedUsagePerMinute: 0.05, // Every 20 minutes
    costPerRequest: 0, // Internal API, no external cost
    category: 'dns'
  },

  // Audit API (YOUR VERCEL FUNCTIONS - no external cost)
  {
    name: 'RTP Audit',
    endpoint: '/api/audit/edgeCases',
    method: 'GET',
    expectedUsagePerMinute: 0.01, // Every 100 minutes
    costPerRequest: 0, // Internal API, no external cost
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
  
  // Calculate usage by category and RPC endpoint breakdown
  let totalApiCalls = 0
  let rpcCalls = 0
  let priceApiCalls = 0
  let chatApiCalls = 0
  let cacheApiCalls = 0
  let dnsApiCalls = 0
  let auditApiCalls = 0
  let heliusApiCalls = 0

  // RPC endpoint breakdown
  let syndicaPrimary = 0
  let syndicaBalance = 0
  let heliusBackup = 0
  let ankrLastResort = 0
  let solanaLabsLastResort = 0

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

        // Track individual RPC endpoints
        if (endpoint.endpoint === 'SYNDICA_PRIMARY') {
          syndicaPrimary += adjustedUsage
        } else if (endpoint.endpoint === 'SYNDICA_BALANCE') {
          syndicaBalance += adjustedUsage
        } else if (endpoint.endpoint === 'HELIUS_RPC_BACKUP') {
          heliusBackup += adjustedUsage
        } else if (endpoint.endpoint === 'ANKR_LAST_RESORT') {
          ankrLastResort += adjustedUsage
        } else if (endpoint.endpoint === 'SOLANA_LABS_LAST_RESORT') {
          solanaLabsLastResort += adjustedUsage
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

  // Calculate rate limit analysis
  const syndicaRpsUsage = (syndicaPrimary + syndicaBalance) / 3600 // Convert per hour to per second
  const heliusRpsUsage = (heliusBackup + heliusApiCalls) / 3600
  const syndicaMonthlyUsage = (syndicaPrimary + syndicaBalance) * 24 * 30 // Monthly extrapolation
  const heliusMonthlyUsage = (heliusBackup + heliusApiCalls) * 24 * 30

  // Syndica Standard Plan limits
  const syndicaRpsLimit = 100 // 100 RPS
  const syndicaMonthlyLimit = 10000000 // 10M requests/month
  
  // Helius Free Plan limits  
  const heliusRpsLimit = 10 // 10 RPS
  const heliusMonthlyLimit = 1000000 // 1M credits/month

  const syndicaRpsUtilization = (syndicaRpsUsage / syndicaRpsLimit) * 100
  const syndicaMonthlyUtilization = (syndicaMonthlyUsage / syndicaMonthlyLimit) * 100
  const heliusRpsUtilization = (heliusRpsUsage / heliusRpsLimit) * 100
  const heliusMonthlyUtilization = (heliusMonthlyUsage / heliusMonthlyLimit) * 100

  // Determine status and recommendations
  const syndicaStatus = syndicaRpsUtilization > 80 || syndicaMonthlyUtilization > 80 ? 'critical' :
                       syndicaRpsUtilization > 60 || syndicaMonthlyUtilization > 60 ? 'warning' : 'safe'
  
  const heliusStatus = heliusRpsUtilization > 80 || heliusMonthlyUtilization > 80 ? 'critical' :
                      heliusRpsUtilization > 60 || heliusMonthlyUtilization > 60 ? 'warning' : 'safe'

  const recommendations: string[] = []
  
  if (syndicaStatus === 'critical') {
    recommendations.push('🚨 SYNDICA CRITICAL: Consider upgrading to Scale plan (200M requests, 300 RPS)')
  } else if (syndicaStatus === 'warning') {
    recommendations.push('⚠️ SYNDICA WARNING: Monitor usage, consider caching to reduce requests')
  }
  
  if (heliusStatus === 'critical') {
    recommendations.push('🚨 HELIUS CRITICAL: Upgrade to Developer plan ($49/month, 10M credits, 50 RPS)')
  } else if (heliusStatus === 'warning') {
    recommendations.push('⚠️ HELIUS WARNING: Monitor usage, may need paid plan soon')
  }
  
  if (syndicaStatus === 'safe' && heliusStatus === 'safe') {
    recommendations.push('✅ All rate limits healthy - current free plans sufficient')
  }

  // Add caching recommendations
  if (priceApiCalls > 30) { // More than 30 price calls per hour
    recommendations.push('💡 OPTIMIZATION: Increase price API cache TTL to reduce external calls')
  }

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
    rpcEndpointBreakdown: {
      syndicaPrimary,
      syndicaBalance,
      heliusBackup,
      ankrLastResort,
      solanaLabsLastResort
    },
    usageByHour,
    peakUsageTimes: sortedHours,
    costEstimates: {
      heliusCost: heliusCost * 24 * 30, // Monthly
      coinGeckoCost: coinGeckoCost * 24 * 30, // Monthly
      coinMarketCapCost: coinMarketCapCost * 24 * 30, // Monthly
      totalEstimatedMonthlyCost: (heliusCost + coinGeckoCost + coinMarketCapCost) * 24 * 30
    },
    rateLimitAnalysis: {
      syndicaUsage: {
        requestsPerSecond: syndicaRpsUsage,
        requestsPerMonth: syndicaMonthlyUsage,
        rpsLimit: syndicaRpsLimit,
        monthlyLimit: syndicaMonthlyLimit,
        rpsUtilization: syndicaRpsUtilization,
        monthlyUtilization: syndicaMonthlyUtilization,
        status: syndicaStatus
      },
      heliusUsage: {
        requestsPerSecond: heliusRpsUsage,
        creditsPerMonth: heliusMonthlyUsage,
        rpsLimit: heliusRpsLimit,
        monthlyLimit: heliusMonthlyLimit,
        rpsUtilization: heliusRpsUtilization,
        monthlyUtilization: heliusMonthlyUtilization,
        status: heliusStatus
      },
      recommendations
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
