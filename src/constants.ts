declare global {
  interface Window {
    HELIUS_UNAVAILABLE?: boolean;
  }
}

import { PublicKey } from '@solana/web3.js'
import { FAKE_TOKEN_MINT, PoolToken, TokenMeta, makeHeliusTokenFetcher } from 'gamba-react-ui-v2'

// The RPC endpoint for connecting to Solana blockchain.
// Reads from environment variable or falls back to a public RPC URL.
export const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT ?? 'https://mainnet.helius-rpc.com/?api-key=29dbb5f3-fc27-4528-b5f3-495379eae36a'

// Solana wallet address that receives platform fees when users play.
export const PLATFORM_CREATOR_ADDRESS = new PublicKey(
  import.meta.env.VITE_PLATFORM_CREATOR,
)

// URL to the blockchain explorer used in the platform to display recent transactions.
export const EXPLORER_URL = 'https://solscan.io'

// URL representing the platform's main website or shareable link (shown in modals).
export const PLATFORM_SHARABLE_URL = 'DegenHeart.casino'

// Fees taken by the platform creator, represented as a decimal fraction (5%).
export const PLATFORM_CREATOR_FEE = 0.05

// Fee percentage for the jackpot pool (0.2% here).
export const PLATFORM_JACKPOT_FEE = 0.002

// Referral commission fee percentage (2%).
export const PLATFORM_REFERRAL_FEE = 0.02

/** 
 * Whether users can revoke accepted referral invites.
 */
export const PLATFORM_ALLOW_REFERRER_REMOVAL = true

// Helper function to create a PoolToken object.
const lp = (tokenMint: PublicKey | string, poolAuthority?: PublicKey | string): PoolToken => ({
  token: new PublicKey(tokenMint),
  authority: poolAuthority !== undefined ? new PublicKey(poolAuthority) : undefined,
})

/**
 * List of supported liquidity pools on the platform.
 */
export const POOLS = [
  lp('So11111111111111111111111111111111111111112'),
  lp('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
  lp('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'),
  lp('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'),
  lp(FAKE_TOKEN_MINT),
]

// The default pool selected when the platform loads
export const DEFAULT_POOL = POOLS[0]

/**
 * Metadata for tokens supported by the platform.
 */
type TokenMetaWithMinted = Partial<TokenMeta> & { mint: PublicKey; minted?: boolean };

export const TOKEN_METADATA: TokenMetaWithMinted[] = [
  {
    mint: new PublicKey('So11111111111111111111111111111111111111112'),
    name: 'SOLANA',
    symbol: 'SOL',
    image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    baseWager: 1e9,
    decimals: 9,
    usdPrice: 192.55,
  },
  {
    mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    name: 'USDC',
    symbol: 'USDC',
    image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    baseWager: 1e6,
    decimals: 6,
    usdPrice: 0.9999,
  },
  {
    mint: new PublicKey('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'),
    name: 'Jupiter',
    symbol: 'JUP',
    image: 'https://static.jup.ag/jup/icon.png',
    baseWager: 1e9,
    decimals: 9,
    usdPrice: 0.000932,
  },
  {
    mint: new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'),
    name: 'Bonk',
    symbol: 'BONK',
    image: 'https://quei6zhlcfsxdfyes577gy7bkxmuz7qqakyt72xlbkyh7fysmoza.arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
    baseWager: 1e9,
    decimals: 9,
    usdPrice: 0.00002806,
  },
  {
    mint: FAKE_TOKEN_MINT,
    name: 'Degen Heart',
    symbol: 'DGHRT',
    image: '/fakemoney.png',
    baseWager: 1e9,
    decimals: 9,
    usdPrice: 1,
    minted: false, // Set to true when DGHRT is actually minted
  },
]

/** 
 * HTML snippet shown to users requiring acceptance of Terms of Service.
 */
export const TOS_HTML = `
  <p>Please review and accept our <a href="/terms">Terms of Service</a> before continuing.</p>
  
  <p><b>Gambling Awareness:</b> Please play responsibly. If you feel that gambling is becoming a problem, seek help immediately. Visit <a href="https://www.ncpgambling.org" target="_blank" rel="noopener noreferrer">National Council on Problem Gambling</a> for more information.</p>
`

/**
 * Function to fetch token metadata dynamically using the Helius metadata API,
 * if the API key is set in environment variables.
 */
/**
 * Fetcher for token metadata using the new API route (/api/helius).
 * Usage: await TOKEN_METADATA_FETCHER([mint1, mint2, ...])
 */
export const TOKEN_METADATA_FETCHER = async (mints: string[]) => {
  const res = await fetch('/api/helius', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mints }),
  });
  if (!res.ok) throw new Error('Failed to fetch token metadata');
  return await res.json();
};

/**
 * Utility to update TOKEN_METADATA with fresh USD prices from Helius
 */
export async function updateTokenPrices() {
  // CoinGecko IDs for supported tokens
  const coingeckoMap: { [mint: string]: string } = {
    'So11111111111111111111111111111111111111112': 'solana',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'usd-coin',
    'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': 'jupiter-exchange',
    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 'bonk',
  };

  // Build CoinGecko URL
  const ids = Object.values(coingeckoMap).join(',');
  const coingeckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

  // Promise for CoinGecko fetch
  const coingeckoPromise = fetch(coingeckoUrl)
    .then(res => res.json())
    .then(data => {
      TOKEN_METADATA.forEach(token => {
        const mint = token.mint.toBase58();
        if (mint === FAKE_TOKEN_MINT.toBase58()) {
          token.usdPrice = undefined;
          return;
        }
        const cgId = coingeckoMap[mint];
        if (cgId && data[cgId] && typeof data[cgId].usd === 'number') {
          token.usdPrice = data[cgId].usd;
        }
      });
      if (typeof window !== 'undefined') window.HELIUS_UNAVAILABLE = false;
      console.log('Updated TOKEN_METADATA with CoinGecko prices:', TOKEN_METADATA);
      return 'coingecko';
    });

  // Promise for Helius fetch (if available)
  let heliusPromise: Promise<string> = Promise.reject('No Helius');
  // Helius API key is now server-only. Fetch token metadata via /api/helius endpoint if needed.

  // Race both, prefer CoinGecko if both succeed
  try {
    const winner = await Promise.race([
      coingeckoPromise,
      heliusPromise,
    ]);
    // If Helius wins, still update with CoinGecko when it resolves
    if (winner === 'helius') {
      coingeckoPromise.catch(() => {}); // ignore errors
    }
  } catch (error) {
    if (typeof window !== 'undefined') window.HELIUS_UNAVAILABLE = true;
    console.error('Failed to fetch token prices from both sources:', error);
  }
}

// Footer links shown on the website footer with URLs and display titles.
export const FOOTER_LINKS = [
  {
    href: '/aboutme',
    title: 'About Me',
  },
  {
    href: 'https://github.com/degenwithheart',
    title: 'GitHub',
  },
  {
    href: 'https://x.com/DegenWithHeart',
    title: 'X',
  },
]

// Feature toggle for enabling/disabling the leaderboard functionality.
export const ENABLE_LEADERBOARD = true

// Feature toggle for enabling/disabling the thinking overlay animations.
export const ENABLE_THINKING_OVERLAY = false

// Feature toggle for enabling/disabling the Gamba result modal button.
export const ENABLE_GAMBA_RESULT_MODAL = true
