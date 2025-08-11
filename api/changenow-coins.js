// Simple in-memory rate limiter (per process, not per user)
let lastCall = 0;
const THROTTLE_MS = 10000; // 10 seconds

export const config = { runtime: 'edge' }

export default async function handler(request) {
  const now = Date.now();
  if (now - lastCall < THROTTLE_MS) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });
  }
  lastCall = now;
  console.log('[API] /api/changenow-coins called', request.method, request.url)
  try {
    const apiKey = process.env.CHANGENOW_API_KEY || process.env.VITE_CHANGENOW_API_KEY || ''
    if (!apiKey) {
      console.error('ChangeNOW API key not found in environment variables')
      // Return a more complete mock list for UI/UX fallback
      const mockCoins = [
        { ticker: 'btc', name: 'Bitcoin' },
        { ticker: 'eth', name: 'Ethereum' },
        { ticker: 'usdc', name: 'USD Coin' },
        { ticker: 'usdt', name: 'Tether' },
        { ticker: 'bnb', name: 'BNB' },
        { ticker: 'ada', name: 'Cardano' },
        { ticker: 'dot', name: 'Polkadot' },
        { ticker: 'matic', name: 'Polygon' },
        { ticker: 'avax', name: 'Avalanche' },
        { ticker: 'ltc', name: 'Litecoin' },
        { ticker: 'link', name: 'Chainlink' },
        { ticker: 'doge', name: 'Dogecoin' },
        { ticker: 'sol', name: 'Solana' },
        { ticker: 'trx', name: 'TRON' },
        { ticker: 'shib', name: 'Shiba Inu' },
        { ticker: 'xrp', name: 'XRP' },
        { ticker: 'bch', name: 'Bitcoin Cash' },
        { ticker: 'xlm', name: 'Stellar' },
        { ticker: 'near', name: 'NEAR Protocol' },
        { ticker: 'apt', name: 'Aptos' },
        { ticker: 'arb', name: 'Arbitrum' },
        { ticker: 'op', name: 'Optimism' },
        { ticker: 'sui', name: 'Sui' },
        { ticker: 'ftm', name: 'Fantom' },
        { ticker: 'etc', name: 'Ethereum Classic' },
        { ticker: 'fil', name: 'Filecoin' },
        { ticker: 'atom', name: 'Cosmos' },
        { ticker: 'algo', name: 'Algorand' },
        { ticker: 'egld', name: 'MultiversX' },
        { ticker: 'mina', name: 'Mina Protocol' },
        { ticker: 'icp', name: 'Internet Computer' },
        { ticker: 'hnt', name: 'Helium' },
        { ticker: 'cake', name: 'PancakeSwap' },
        { ticker: 'uni', name: 'Uniswap' },
        { ticker: 'aave', name: 'Aave' },
        { ticker: 'comp', name: 'Compound' },
        { ticker: '1inch', name: '1inch' },
        { ticker: 'bat', name: 'Basic Attention Token' },
        { ticker: 'chz', name: 'Chiliz' },
        { ticker: 'enj', name: 'Enjin Coin' },
        { ticker: 'sand', name: 'The Sandbox' },
        { ticker: 'mana', name: 'Decentraland' },
        { ticker: 'gmt', name: 'STEPN' },
        { ticker: 'gala', name: 'Gala' },
        { ticker: 'ape', name: 'ApeCoin' },
        { ticker: 'pepe', name: 'Pepe' },
        { ticker: 'floki', name: 'Floki' },
        { ticker: 'bonk', name: 'Bonk' }
      ]
      return new Response(JSON.stringify(mockCoins), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const url = `https://api.changenow.io/v1/currencies?active=true&fixedRate=true&api_key=${apiKey}`
    console.log('Fetching coins from ChangeNOW API...')
    const apiRes = await fetch(url)
    if (!apiRes.ok) {
      const errorText = await apiRes.text()
      console.error(`ChangeNOW API error: ${apiRes.status} - ${errorText}`)
      return new Response(JSON.stringify({ error: errorText }), {
        status: apiRes.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const data = await apiRes.json()
    console.log(`Successfully fetched ${data.length} coins`)
    const validCoins = data.filter(coin => coin.ticker && coin.name)
    return new Response(JSON.stringify(validCoins), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error in changenow-coins handler:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
