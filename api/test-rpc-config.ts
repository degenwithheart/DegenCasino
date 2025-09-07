/**
 * Test endpoint to v  const rpcEndpoints = [
    {
      name: 'Syndica Primary',
      url: process.env.VITE_RPC_ENDPOINT || process.env.RPC_ENDPOINT || 'https://solana-mainnet.api.syndica.io/api-key/4jiiRsRb2BL8pD6S8H3kNNr8U7YYuyBkfuce3f1ngmnYCKS5KSXwvRx53p256RNQZydrDWt1TdXxVbRrmiJrdk3RdD58qtYSna1',
      priority: 1
    },
    {
      name: 'Helius RPC Backup',
      url: process.env.VITE_HELIUS_API_KEY || process.env.HELIUS_API_KEY || 'https://mainnet.helius-rpc.com/?api-key=3bda9312-99fc-4ff4-9561-958d62a4a22c',
      priority: 2configuration
 * This tests the new RPC priority: Syndica -> Helius RPC -> Public
 */

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  const results: any[] = [];

  // Test RPC endpoints in priority order
  const rpcEndpoints = [
    {
      name: 'Syndica Primary',
      url: process.env.VITE_RPC_ENDPOINT || process.env.RPC_ENDPOINT || 'https://solana-mainnet.api.syndica.io/api-key/4jiiRsRb2BL8pD6S8H3kNNr8U7YYuyBkfuce3f1ngmnYCKS5KSXwvRx53p256RNQZydrDWt1TdXxVbRrmiJrdk3RdD58qtYSna1',
      priority: 1
    },
    {
      name: 'Helius RPC Backup',
      url: process.env.VITE_HELIUS_API_KEY || process.env.HELIUS_API_KEY || 'https://mainnet.helius-rpc.com/?api-key=3bda9312-99fc-4ff4-9561-958d62a4a22c',
      priority: 2
    },
    {
      name: 'Ankr Last Resort',
      url: 'https://rpc.ankr.com/solana',
      priority: 3
    },
    {
      name: 'Solana Labs Last Resort',
      url: 'https://api.mainnet-beta.solana.com',
      priority: 4
    }
  ];

  for (const endpoint of rpcEndpoints) {
    const startTime = Date.now();
    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getHealth'
        })
      });

      const responseTime = Date.now() - startTime;
      const data = await response.json();

      results.push({
        name: endpoint.name,
        priority: endpoint.priority,
        status: data.result === 'ok' ? 'healthy' : 'unhealthy',
        responseTime: responseTime,
        url: endpoint.url.includes('api-key') ? endpoint.url.split('api-key')[0] + 'api-key=***' : endpoint.url
      });
    } catch (error: any) {
      results.push({
        name: endpoint.name,
        priority: endpoint.priority,
        status: 'error',
        responseTime: Date.now() - startTime,
        error: error.message,
        url: endpoint.url.includes('api-key') ? endpoint.url.split('api-key')[0] + 'api-key=***' : endpoint.url
      });
    }
  }

  // Test Helius v0 API
  const heliusV0StartTime = Date.now();
  try {
    const heliusV0Response = await fetch('https://api.helius.xyz/v0/transactions/health?api-key=' + ((process.env.VITE_HELIUS_V0_TRANSACTIONS || process.env.HELIUS_V0_TRANSACTIONS)?.split('?api-key=')[1] || '3bda9312-99fc-4ff4-9561-958d62a4a22c'));
    const heliusV0ResponseTime = Date.now() - heliusV0StartTime;
    
    results.push({
      name: 'Helius v0 API',
      priority: 'specialized',
      status: heliusV0Response.ok ? 'healthy' : 'unhealthy',
      responseTime: heliusV0ResponseTime,
      url: 'https://api.helius.xyz/v0/transactions/?api-key=***'
    });
  } catch (error: any) {
    results.push({
      name: 'Helius v0 API',
      priority: 'specialized',
      status: 'error',
      responseTime: Date.now() - heliusV0StartTime,
      error: error.message,
      url: 'https://api.helius.xyz/v0/transactions/?api-key=***'
    });
  }

  const report = {
    timestamp: new Date().toISOString(),
    configuration: {
      primaryRpc: 'Syndica',
      backupRpc: 'Helius RPC',
      fallbackRpc: 'Public (Solana Labs)',
      transactionParsing: 'Helius v0 API',
      tokenMetadata: 'Helius RPC'
    },
    results: results,
    summary: {
      totalEndpoints: results.length,
      healthyEndpoints: results.filter(r => r.status === 'healthy').length,
      averageResponseTime: Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length)
    }
  };

  return new Response(JSON.stringify(report, null, 2), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
