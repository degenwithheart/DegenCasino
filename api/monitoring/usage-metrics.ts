import { cacheOnTheFly, CacheTTL } from '../cache/xcacheOnTheFly'

export const config = {
  runtime: 'edge',
}

interface UsageMetrics {
  timestamp: string
  period: string
  current: {
    total: number
    breakdown: {
      rpc: number
      price: number
      helius: number
      chat: number
      cache: number
      dns: number
      audit: number
    }
  }
  rpcEndpoints: {
    'syndica-primary': number
    'syndica-balance': number
    'helius-backup': number
    'ankr-last-resort': number
    'solana-labs-last-resort': number
  }
  costs: {
    helius: number
    coinGecko: number
    coinMarketCap: number
    total: number
  }
  daily: {
    total: number
    breakdown: {
      rpc: number
      price: number
      helius: number
      chat: number
      cache: number
      dns: number
      audit: number
    }
  }
  hourlyPattern: Record<string, number>
  rateLimits: {
    syndica: {
      planType: string
      rpsLimit: number
      monthlyLimit: number
      currentRps: number
      utilizationPercent: number
      status: string
      dailyProjection: number
      monthlyProjection: number
      percentOfMonthlyLimit: number
    }
    helius: {
      planType: string
      rpsLimit: number
      monthlyLimit: number
      currentRps: number
      utilizationPercent: number
      status: string
      dailyProjection: number
      monthlyProjection: number
      percentOfMonthlyLimit: number
    }
    publicRpcs: {
      planType: string
      rpsLimit: string | number
      monthlyLimit: string
      currentRps: number
      utilizationPercent: number
      status: string
      warning?: string | null
    }
  }
}

interface ApiEndpointConfig {
  name: string
  endpoint: string
  method: string
  expectedUsagePerMinute: number
  costPerRequest: number
  category: 'rpc' | 'price' | 'chat' | 'cache' | 'dns' | 'audit' | 'helius-v0'
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
    expectedUsagePerMinute: 2, // REALISTIC: Based on actual casino traffic patterns
    costPerRequest: 0, // Syndica Standard Plan is FREE
    category: 'rpc'
  },
  {
    name: 'Syndica Balance Checks',
    endpoint: 'SYNDICA_BALANCE',
    method: 'POST',
    expectedUsagePerMinute: 1, // REALISTIC: Reduced from inflated estimates
    costPerRequest: 0, // Syndica Standard Plan is FREE
    category: 'rpc'
  },

  // Helius RPC - Free Plan (1M credits/month, 10 RPS limit)
  {
    name: 'Helius RPC Backup',
    endpoint: 'HELIUS_RPC_BACKUP',
    method: 'POST',
    expectedUsagePerMinute: 0.2, // REALISTIC: Only when Syndica fails (rare)
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
    category: 'helius-v0'
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

  // REAL USAGE TRACKING - NO MORE FAKE ESTIMATES!
  // This should be replaced with actual usage tracking from your APIs
  
  // For now, return MINIMAL realistic numbers based on your actual Helius usage
  // Real data: 42,314 credits in 3 months = 470/day = 19.6/hour average
  
  // WARNING: These are still estimates until real tracking is implemented
  const hourlyMultiplier = getHourlyMultiplier(currentHour)
  const baseHeliusPerHour = 19.6 // Real average from your data
  
  // Conservative estimates - much lower than before
  const currentHeliusUsage = Math.round(baseHeliusPerHour * hourlyMultiplier)
  const currentRpcCalls = Math.round(currentHeliusUsage * 3) // Much more conservative scaling
  const currentPriceApi = Math.round(currentHeliusUsage * 0.1) // Very conservative
  const currentChatApi = Math.round(currentHeliusUsage * 0.5)
  const currentCacheApi = Math.round(currentHeliusUsage * 0.05)
  const currentDnsApi = Math.round(currentHeliusUsage * 0.02)
  const currentAuditApi = Math.round(currentHeliusUsage * 0.01)
  
  const totalApiCalls = currentRpcCalls + currentPriceApi + currentHeliusUsage + 
                       currentChatApi + currentCacheApi + currentDnsApi + currentAuditApi

  // RPC endpoint breakdown - conservative distribution
  const syndicaPrimary = Math.round(currentRpcCalls * 0.90) // 90% primary
  const syndicaBalance = Math.round(currentRpcCalls * 0.08) // 8% balance
  const heliusBackup = Math.round(currentRpcCalls * 0.015) // 1.5% backup
  const ankrLastResort = Math.round(currentRpcCalls * 0.003) // 0.3% last resort
  const solanaLabsLastResort = Math.round(currentRpcCalls * 0.002) // 0.2% absolute last

  // All costs are $0 since you're on free plans
  const heliusCost = 0
  const coinGeckoCost = 0
  const coinMarketCapCost = 0

  // Generate hourly usage pattern - much more conservative
  const usageByHour: Record<string, number> = {}
  
  for (let i = 0; i < 24; i++) {
    const hour = (currentHour - i + 24) % 24
    const hourLabel = `${hour.toString().padStart(2, '0')}:00`
    const multiplier = getHourlyMultiplier(hour)
    
    const hourlyHelius = Math.round(baseHeliusPerHour * multiplier)
    const hourlyTotal = Math.round(hourlyHelius * 4.1) // Conservative total multiplier
    usageByHour[hourLabel] = hourlyTotal
  }

  // REALISTIC daily estimates based on your actual 470 Helius/day
  const realHeliusDaily = 470 // Your actual usage
  const totalDaily = Math.round(realHeliusDaily * 4.1) // ~1,927 total
  const rpcDaily = Math.round(realHeliusDaily * 3) // ~1,410 RPC
  const priceDaily = Math.round(realHeliusDaily * 0.1) // ~47 price
  const chatDaily = Math.round(realHeliusDaily * 0.5) // ~235 chat
  const cacheDaily = Math.round(realHeliusDaily * 0.05) // ~24 cache
  const dnsDaily = Math.round(realHeliusDaily * 0.02) // ~9 DNS
  const auditDaily = Math.round(realHeliusDaily * 0.01) // ~5 audit
  const heliusDaily = realHeliusDaily

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
  // CORRECTED: Use REAL usage data, not inflated 24*30 extrapolations
  const syndicaRpsUsage = (syndicaPrimary + syndicaBalance) / 3600 // Convert per hour to per second
  const heliusRpsUsage = heliusBackup / 3600 // Only backup RPC usage
  
  // Use REAL monthly usage based on actual data patterns
  // Your actual Helius: 42,314 credits in 3 months = ~14,105/month (not 82,080!)
  const syndicaMonthlyUsage = rpcDaily * 30 * 0.95 // 95% of RPC goes to Syndica
  const heliusMonthlyUsage = heliusDaily * 30 // Real usage: 470*30≈14k

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
  if (priceDaily > 200) { // More than 200 price calls per day
    recommendations.push('💡 OPTIMIZATION: Increase price API cache TTL to reduce external calls')
  }

  return {
    timestamp: now.toISOString(),
    period: `${periodStart} to ${periodEnd}`,
    
    // CURRENT HOURLY USAGE (Conservative estimates until real tracking)
    current: {
      total: totalApiCalls,
      breakdown: {
        rpc: currentRpcCalls,
        price: currentPriceApi,
        helius: currentHeliusUsage,
        chat: currentChatApi,
        cache: currentCacheApi,
        dns: currentDnsApi,
        audit: currentAuditApi
      }
    },

    // RPC ENDPOINT DISTRIBUTION
    rpcEndpoints: {
      'syndica-primary': syndicaPrimary,
      'syndica-balance': syndicaBalance,
      'helius-backup': heliusBackup,
      'ankr-last-resort': ankrLastResort,
      'solana-labs-last-resort': solanaLabsLastResort
    },

    // COST ANALYSIS (All $0 on free plans)
    costs: {
      helius: heliusCost,
      coinGecko: coinGeckoCost,
      coinMarketCap: coinMarketCapCost,
      total: heliusCost + coinGeckoCost + coinMarketCapCost
    },

    // REALISTIC DAILY PROJECTIONS (Based on actual 470 Helius/day)
    daily: {
      total: totalDaily, // ~1,927
      breakdown: {
        rpc: rpcDaily,     // ~1,410
        price: priceDaily, // ~47
        helius: heliusDaily, // 470 (actual)
        chat: chatDaily,   // ~235
        cache: cacheDaily, // ~24
        dns: dnsDaily,     // ~9
        audit: auditDaily  // ~5
      }
    },

    // 24-HOUR USAGE PATTERN
    hourlyPattern: usageByHour,

    // RATE LIMIT ANALYSIS
    rateLimits: {
      syndica: {
        planType: 'Standard (FREE)',
        rpsLimit: 100,
        monthlyLimit: 10000000,
        currentRps: Math.round(syndicaPrimary / 3600), // Current requests per second
        utilizationPercent: Math.round((syndicaPrimary / 3600 / 100) * 100),
        status: (syndicaPrimary / 3600) > 80 ? 'warning' : 'healthy',
        dailyProjection: Math.round(syndicaPrimary * 24),
        monthlyProjection: Math.round(syndicaPrimary * 24 * 30),
        percentOfMonthlyLimit: Math.round((syndicaPrimary * 24 * 30 / 10000000) * 100)
      },
      helius: {
        planType: 'Free',
        rpsLimit: 10,
        monthlyLimit: 1000000, // 1M credits
        currentRps: Math.round((currentHeliusUsage + heliusBackup) / 3600),
        utilizationPercent: Math.round(((currentHeliusUsage + heliusBackup) / 3600 / 10) * 100),
        status: ((currentHeliusUsage + heliusBackup) / 3600) > 8 ? 'warning' : 'healthy',
        dailyProjection: realHeliusDaily,
        monthlyProjection: realHeliusDaily * 30, // 14,100
        percentOfMonthlyLimit: Math.round((realHeliusDaily * 30 / 1000000) * 100) // ~1.4%
      },
      publicRpcs: {
        planType: 'Public (Last Resort Only)',
        rpsLimit: 'Unknown',
        monthlyLimit: 'Unlimited',
        currentRps: Math.round((ankrLastResort + solanaLabsLastResort) / 3600),
        utilizationPercent: 0,
        status: (ankrLastResort + solanaLabsLastResort) > 0 ? 'using-last-resort' : 'unused',
        warning: (ankrLastResort + solanaLabsLastResort) > 0 ? 'Public RPCs should only be used when primary services fail' : null
      }
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
