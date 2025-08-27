import { FaHome, FaUser, FaInfoCircle, FaFileAlt, FaBookOpen, FaGamepad, FaGithub, FaTwitter, FaSearch } from 'react-icons/fa';

declare global {
  interface Window {
    HELIUS_UNAVAILABLE?: boolean;
  }
}

import { PublicKey } from '@solana/web3.js'
import { FAKE_TOKEN_MINT, PoolToken, TokenMeta, makeHeliusTokenFetcher } from 'gamba-react-ui-v2'

// Get RPC from the .env file or default to the public RPC.
export const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT ?? 'https://api.mainnet-beta.solana.com'

// Solana address that will receive fees when somebody plays on this platform
export const PLATFORM_CREATOR_ADDRESS = new PublicKey(
  '6o1iE4cKQcjW4UFd4vn35r43qD9LjNDhPGNUMBuS8ocZ',
)

// Explorer URL - Appears in RecentPlays
export const EXPLORER_URL = 'https://degenheart.casino/explorer'

// Platform URL - Appears in ShareModal
export const PLATFORM_SHARABLE_URL = 'degenheart.casino'

// Creator fee (in %)
export const PLATFORM_CREATOR_FEE = 0.07 // 1% !!max 7%!!

export const MULTIPLAYER_FEE = 0.015 // 1% 

// Jackpot fee (in %)
export const PLATFORM_JACKPOT_FEE = 0.001 // 0.1%,  not jackpot game specific, but platform wide

// Referral fee (in %)
export const PLATFORM_REFERRAL_FEE = 0.0025 // 0.25%

/** If the user should be able to revoke an invite after they've accepted an invite */
export const PLATFORM_ALLOW_REFERRER_REMOVAL = true

/** 
 * Referral Tier Mode:
 * false = Badge/Status rewards only (safe, no financial promises)
 * true = Actual financial tier rewards (requires custom implementation)
 */
export const REFERRAL_TIERS_FINANCIAL_MODE = false

// Referral Tiers: [{ minReferrals, fee }] - 15 tier progression system
// When REFERRAL_TIERS_FINANCIAL_MODE = false: fees shown as badges/status only
// When REFERRAL_TIERS_FINANCIAL_MODE = true: fees would be actual rewards (needs custom implementation)
export const REFERRAL_TIERS = [
  { min: 0,    fee: 0.0025, name: 'Starter',     badge: '🌱' }, // 0.25% - Tier 1
  { min: 3,    fee: 0.0035, name: 'Bronze I',    badge: '🥉' }, // 0.35% - Tier 2
  { min: 7,    fee: 0.0050, name: 'Bronze II',   badge: '🥉' }, // 0.50% - Tier 3
  { min: 15,   fee: 0.0075, name: 'Bronze III',  badge: '🥉' }, // 0.75% - Tier 4
  { min: 25,   fee: 0.0100, name: 'Silver I',    badge: '🥈' }, // 1.00% - Tier 5
  { min: 40,   fee: 0.0125, name: 'Silver II',   badge: '🥈' }, // 1.25% - Tier 6
  { min: 60,   fee: 0.0150, name: 'Silver III',  badge: '🥈' }, // 1.50% - Tier 7
  { min: 85,   fee: 0.0175, name: 'Gold I',      badge: '🥇' }, // 1.75% - Tier 8
  { min: 115,  fee: 0.0200, name: 'Gold II',     badge: '🥇' }, // 2.00% - Tier 9
  { min: 150,  fee: 0.0225, name: 'Gold III',    badge: '🥇' }, // 2.25% - Tier 10
  { min: 200,  fee: 0.0250, name: 'Platinum I',  badge: '💎' }, // 2.50% - Tier 11
  { min: 275,  fee: 0.0300, name: 'Platinum II', badge: '💎' }, // 3.00% - Tier 12
  { min: 375,  fee: 0.0350, name: 'Diamond I',   badge: '💍' }, // 3.50% - Tier 13
  { min: 500,  fee: 0.0400, name: 'Diamond II',  badge: '💍' }, // 4.00% - Tier 14
  { min: 750,  fee: 0.0500, name: 'Legend',      badge: '👑' }, // 5.00% - Tier 15
] as const

// Just a helper function
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
    image: '/$DGHRT.png',
    baseWager: 1e9,
    decimals: 9,
    usdPrice: 1,
    minted: false, // Set to true when DGHRT is actually minted
  },
]

/** HTML to display to user that they need to accept in order to continue */
export const TOS_HTML = `
<p><b>1. Age Requirement:</b> Must be 18+ or the legal gambling age in your area.</p>
<p><b>2. Legal Compliance:</b> Ensure online gambling is legal where you live before playing.</p>
<p><b>3. Risk Acknowledgement:</b> On-chain games involve real financial risk; wins are never guaranteed.</p>
<p><b>4. No Warranty & Liability:</b> Games are provided "as is" using provably fair randomness. We are not responsible for losses or damages.</p>
<p><b>5. Licensing Disclaimer:</b> This is not a licensed casino; it’s a decentralized dApp powered by the Gamba protocol.</p>
<p><b>6. Responsible Gaming:</b> Play responsibly and seek help if gambling becomes a problem.</p>
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

  // Build CoinGecko IDs list
  const ids = Object.values(coingeckoMap).join(',');
  
  // Build proxy API URL (avoids CORS issues)
  const coingeckoUrl = `/api/coingecko?ids=${ids}&vs_currencies=usd`;

  // Promise for CoinGecko fetch via proxy
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

export const SIDEBAR_LINKS = [
  {
    to: '/',
    label: 'Home',
    icon: FaHome,
    showWhen: () => true,
    external: false,
  },
  {
    to: (base58: string | null) => base58 ? `/${base58}/profile` : '/profile',
    label: 'Profile',
    icon: FaUser,
    showWhen: (connected: boolean) => connected,
    external: false,
  },
  {
    label: 'Games',
    icon: FaGamepad,
    showWhen: (connected: boolean) => connected,
    external: false,
  },
  {
    to: '/explorer',
    label: 'Explorer',
    icon: FaSearch,
    showWhen: () => true,
    external: false,
  },
];


// Footer links shown on the website footer with URLs and display titles.
export const FOOTER_LINKS = [
  {
    href: '/audit',
    title: 'Audit',
  },
  {
    href: '/explorer',
    title: 'Explorer',
  },
  {
    href: '/aboutme',
    title: 'About Me',
  },
  {
    href: '/terms',
    title: 'Terms',
  },
  {
    href: '/whitepaper',
    title: 'Whitepaper',
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

export const ENABLE_LEADERBOARD = true 
export const ENABLE_TROLLBOX = true // Requires setup in vercel (check tutorial in discord)

/** If true, the featured game is fully playable inline on the dashboard */
export const FEATURED_GAME_INLINE = false 
export const FEATURED_GAME_ID: string | undefined = 'jackpot'   // ← put game id or leave undefined

