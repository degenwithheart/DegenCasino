import { cacheOnTheFly, CacheTTL } from '../cache/xcacheOnTheFly'
import { UsageTracker } from '../cache/usage-tracker'

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

// REMOVED: ApiEndpointConfig interface - no longer using fake endpoint configurations

// REMOVED: API_ENDPOINTS array with fake expectedUsagePerMinute data

// Configuration for all API endpoints and their expected usage patterns
// UPDATED with realistic usage based on actual Helius data: 42,314 credits in 3 months
// COST SOURCES:
// - Syndica: Standard Plan ($0/month, 10M requests/month, 100 RPS limit)
// - Helius: Free Plan (1M credits/month, 10 RPS limit) 
// - CoinGecko: Free tier (10-50 calls/min)
// - Internal APIs: No external cost (Vercel function execution)
// REMOVED: API_ENDPOINTS array with fake expectedUsagePerMinute data
// Real usage tracking should be implemented in each actual API endpoint

// REMOVED: getHourlyMultiplier function - no more fake time-based estimates

async function calculateCurrentUsage(): Promise<UsageMetrics> {
  const now = new Date()
  const periodStart = new Date(now.getTime() - 60 * 60 * 1000).toISOString() // Last hour
  const periodEnd = now.toISOString()

  // GET REAL USAGE DATA from tracking system
  const hourlyUsage = await UsageTracker.getCurrentHourUsage()
  const dailyUsage = await UsageTracker.getCurrentDayUsage() 
  const rpcEndpoints = await UsageTracker.getRpcEndpointUsage()
  
  // Current hourly usage (REAL DATA)
  const currentHeliusUsage = hourlyUsage.helius || 0
  const currentRpcCalls = hourlyUsage.rpc || 0
  const currentPriceApi = hourlyUsage.price || 0
  const currentChatApi = hourlyUsage.chat || 0
  const currentCacheApi = hourlyUsage.cache || 0
  const currentDnsApi = hourlyUsage.dns || 0
  const currentAuditApi = hourlyUsage.audit || 0
  
  const totalApiCalls = hourlyUsage.total || 0

  // RPC endpoint breakdown (REAL DATA)
  const syndicaPrimary = rpcEndpoints['syndica-primary'] || 0
  const syndicaBalance = rpcEndpoints['syndica-balance'] || 0
  const heliusBackup = rpcEndpoints['helius-backup'] || 0
  const ankrLastResort = rpcEndpoints['ankr-last-resort'] || 0
  const solanaLabsLastResort = rpcEndpoints['solana-labs-last-resort'] || 0

  // All costs are $0 since you're on free plans
  const heliusCost = 0
  const coinGeckoCost = 0
  const coinMarketCapCost = 0

  // TODO: Implement hourly pattern tracking
  const usageByHour: Record<string, number> = {}

  // Daily usage (REAL DATA)
  const totalDaily = dailyUsage.total || 0
  const rpcDaily = dailyUsage.rpc || 0
  const priceDaily = dailyUsage.price || 0
  const chatDaily = dailyUsage.chat || 0
  const cacheDaily = dailyUsage.cache || 0
  const dnsDaily = dailyUsage.dns || 0
  const auditDaily = dailyUsage.audit || 0
  const heliusDaily = dailyUsage.helius || 0

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
        dailyProjection: heliusDaily,
        monthlyProjection: heliusDaily * 30,
        percentOfMonthlyLimit: Math.round((heliusDaily * 30 / 1000000) * 100)
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
