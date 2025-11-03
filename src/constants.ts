/**
 * @fileoverview Constants file for DegenCasino platform
 * This file contains all platform-wide constants, configurations, and settings
 * used throughout the application. It includes network endpoints, fees, UI settings,
 * game configurations, and more. All values are centralized here for easy maintenance
 * and configuration management.
 */

// ===================================
// FEATURE PREFERENCES & STORAGE
// ===================================

/**
 * Storage key for live game ecosystems preference
 */
const LIVE_GAME_ECOSYSTEMS_STORAGE_KEY = 'enableLiveGameEcosystems';

/**
 * Get stored live game ecosystems preference from localStorage
 * Defaults to true for new users
 */
const getStoredLiveGameEcosystemsPreference = (): boolean => {
  if (typeof window === 'undefined') return true; // Default to true on server
  try {
    const stored = localStorage.getItem(LIVE_GAME_ECOSYSTEMS_STORAGE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
    return true; // Default to true for new users
  } catch {
    return true; // Default to true if localStorage fails
  }
};

/**
 * Set stored live game ecosystems preference in localStorage
 */
export const setStoredLiveGameEcosystemsPreference = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LIVE_GAME_ECOSYSTEMS_STORAGE_KEY, enabled.toString());
  } catch {
    // Ignore localStorage errors (e.g., in private browsing)
  }
};

/**
 * React Icons imports for UI components throughout the application.
 * These icons are used in navigation, buttons, and various UI elements.
 * 
 * Imported from 'react-icons/fa' (Font Awesome icon set):
 * - FaHome: Home/dashboard navigation
 * - FaUser: User profile and account-related UI
 * - FaInfoCircle: Information and help icons
 * - FaFileAlt: Document and content icons
 * - FaBookOpen: Documentation and reading materials
 * - FaGamepad: Gaming and entertainment icons
 * - FaGithub, FaTwitter: Social media and external link icons
 * - FaSearch: Search and exploration functionality
 * - FaClipboardList: Lists, changelogs, and organized content
 * - FaCoins: Token and cryptocurrency icons
 * - FaShoppingCart: Commerce and purchasing (presale, etc.)
 * - FaMobile: Mobile app and responsive design indicators
 */
import { FaHome, FaUser, FaInfoCircle, FaFileAlt, FaBookOpen, FaGamepad, FaGithub, FaTwitter, FaSearch, FaClipboardList, FaCoins, FaShoppingCart, FaMobile } from 'react-icons/fa';

/**
 * Global TypeScript interface extension for the Window object.
 * Adds custom properties to the global window scope for runtime state management.
 * 
 * @property HELIUS_UNAVAILABLE - Flag indicating if Helius API services are unavailable
 *   Used to gracefully handle API failures and show appropriate user feedback
 *   Set to true when Helius requests fail, allowing fallback to alternative services
 */
declare global {
  interface Window {
    HELIUS_UNAVAILABLE?: boolean;
  }
}

// ===================================
// SOLANA & BLOCKCHAIN DEPENDENCIES
// ===================================

/**
 * Core Solana Web3.js imports for blockchain interaction.
 * PublicKey is the fundamental type for Solana addresses and public keys.
 * Used throughout the application for wallet addresses, token mints, and contract interactions.
 */
import { PublicKey } from '@solana/web3.js';

/**
 * Gamba React UI v2 imports for casino platform functionality.
 * 
 * FAKE_TOKEN_MINT: Special token mint used for testing and development
 *   Allows platform testing without real token transactions or value
 * 
 * PoolToken: Type definition for liquidity pool configurations
 *   Represents a token pool with mint address and optional authority
 * 
 * makeHeliusTokenFetcher: Utility for fetching token metadata from Helius API
 *   Used for dynamic token information retrieval (currently server-side only)
 */
import { FAKE_TOKEN_MINT, PoolToken } from 'gamba-react-ui-v2';
import makeHeliusTokenFetcher from 'gamba-react-ui-v2';

/**
 * Gamba Core v2 import for fundamental protocol constants.
 * BPS_PER_WHOLE: Basis points per whole unit (10000 BPS = 100% = 1 whole)
 * Used for precise fee calculations in smart contracts and UI displays.
 * 
 * Example: 7% = 0.07 * 10000 = 700 BPS
 */
import { BPS_PER_WHOLE } from 'gamba-core-v2';
import rpcCachedFetch from './utils/rpcThrottle';

// ===================================
// MOBILE & PLATFORM CONFIGURATION
// ===================================

/**
 * Mobile application feature toggle.
 * Controls whether mobile-specific features and UI elements are enabled.
 * 
 * When false: Standard web experience, mobile features disabled
 * When true: Enables mobile app integration, PWA features, and mobile-specific UI
 * 
 * Note: This works in conjunction with FEATURE_FLAGS for granular mobile control.
 */
export const ENABLE_MOBILE_APP = false;

// ===================================
// NETWORK & RPC CONFIGURATION
// ===================================

/**
 * Primary RPC endpoint for Solana blockchain communication.
 * Used as fallback when NetworkContext doesn't provide dynamic endpoints.
 * 
 * Currently configured to use Syndica's premium RPC service for:
 * - High reliability and performance
 * - Rate limiting protection
 * - Enhanced API features
 * 
 * Environment variable: RPC_ENDPOINT (from .env file)
 * Fallback: Syndica mainnet endpoint with API key
 * 
 * Note: NetworkContext now provides primary RPC management with automatic
 * failover and network-specific endpoint selection.
 */
export const RPC_ENDPOINT = import.meta.env.RPC_ENDPOINT ?? 'https://solana-mainnet.api.syndica.io/api-key/4jiiRsRb2BL8pD6S8H3kNNr8U7YYuyBkfuce3f1ngmnYCKS5KSXwvRx53p256RNQZydrDWt1TdXxVbRrmiJrdk3RdD58qtYSna1';

/**
 * Network-specific RPC endpoint configurations for different Solana networks.
 * Provides primary and backup endpoints for mainnet, devnet, and testnet.
 * 
 * Structure:
 * - primary: Main RPC endpoint for the network
 * - backup: Fallback endpoint if primary fails
 * 
 * Environment variables allow customization:
 * - RPC_ENDPOINT: Mainnet primary (shared with RPC_ENDPOINT above)
 * - HELIUS_API_KEY: Mainnet backup via Helius
 * - VITE_DEVNET_RPC_ENDPOINT: Devnet primary
 * - VITE_TESTNET_RPC_ENDPOINT: Testnet primary
 * - VITE_TESTNET_BACKUP: Testnet backup
 * 
 * Used by NetworkContext for dynamic network switching and failover handling.
 */
export const NETWORK_ENDPOINTS = {
  mainnet: {
    primary: import.meta.env.RPC_ENDPOINT ?? 'https://solana-mainnet.api.syndica.io/api-key/4jiiRsRb2BL8pD6S8H3kNNr8U7YYuyBkfuce3f1ngmnYCKS5KSXwvRx53p256RNQZydrDWt1TdXxVbRrmiJrdk3RdD58qtYSna1',
    backup: import.meta.env.HELIUS_API_KEY ?? 'https://mainnet.helius-rpc.com/?api-key=3bda9312-99fc-4ff4-9561-958d62a4a22c'
  },
  devnet: {
    primary: import.meta.env.VITE_DEVNET_RPC_ENDPOINT ?? 'https://api.devnet.solana.com',
    backup: 'https://api.devnet.solana.com'
  },
  testnet: {
    primary: import.meta.env.VITE_TESTNET_RPC_ENDPOINT ?? 'https://api.testnet.solana.com',
    backup: import.meta.env.VITE_TESTNET_BACKUP ?? 'https://api.testnet.solana.com'
  }
} as const;

// ===================================
// PLATFORM CONFIGURATION & FEES
// ===================================

/**
 * Solana wallet address that receives the platform creator fee from all bets placed on this platform.
 * This address belongs to the platform owner/creator and is where creator fees are automatically sent
 * when users play games. The fee percentage is defined by PLATFORM_CREATOR_FEE below.
 * 
 * Note: This is a public key that must be a valid Solana wallet address.
 */
export const PLATFORM_CREATOR_ADDRESS = new PublicKey(
  '6o1iE4cKQcjW4UFd4vn35r43qD9LjNDhPGNUMBuS8ocZ',
);

/**
 * URL for the platform's transaction explorer where users can view their bet history and transaction details.
 * This URL is displayed in the RecentPlays component and links to a custom explorer interface
 * that shows all gambling transactions on the platform.
 */
export const EXPLORER_URL = 'https://degenheart.casino/explorer';

/**
 * Base URL for the platform used in social sharing modals and external links.
 * This is the domain that gets shared when users want to share the platform with others
 * (e.g., via ShareModal component).
 */
export const PLATFORM_SHARABLE_URL = 'degenheart.casino';

/**
 * Platform creator fee as a decimal percentage (0.07 = 7%).
 * This fee is deducted from every bet and sent to the PLATFORM_CREATOR_ADDRESS.
 * It represents the platform owner's revenue from each gambling transaction.
 * 
 * IMPORTANT: This fee only applies to PRIVATE pools where the platform creator
 * has authority. PUBLIC pools (authority = system program) use default Gamba fees
 * and cannot be customized. For public pools, the actual creator fee received
 * may be lower than 7% (e.g., 1.24% as observed in explorer data).
 * 
 * The fee is applied before the house edge and other fees.
 */
export const PLATFORM_CREATOR_FEE = 0.07; // 7%

/**
 * Fee for multiplayer games as a decimal percentage (0.015 = 1.5%).
 * This additional fee is charged on bets in multiplayer game modes to cover
 * the costs of multiplayer infrastructure, matchmaking, and prize distribution.
 * Only applied to games that support multiplayer functionality.
 */
export const MULTIPLAYER_FEE = 0.015; // 1.5%

/**
 * Jackpot contribution fee as a decimal percentage (0.001 = 0.1%).
 * A small portion of each bet is allocated to the platform's jackpot pools.
 * This creates progressive jackpots that grow with platform activity and
 * provides additional excitement for players.
 */
export const PLATFORM_JACKPOT_FEE = 0.001; // 0.1%

/**
 * Referral program fee as a decimal percentage (0.0025 = 0.25%).
 * When users bring new players to the platform via referral links,
 * referrers earn this percentage from their referrals' bets.
 * The fee is split between the referrer and potentially the platform,
 * depending on the referral tier system configuration.
 */
export const PLATFORM_REFERRAL_FEE = 0.0025; // 0.25%

/**
 * Fee conversions to basis points (BPS) for smart contract compatibility.
 * Basis points provide precise decimal representation (1 BPS = 0.01%) and are
 * used by the Gamba protocol for accurate fee calculations in on-chain transactions.
 * BPS_PER_WHOLE = 10000, so 7% = 700 BPS, 1.5% = 150 BPS, etc.
 * These BPS values are what get passed to the blockchain contracts.
 */
export const PLATFORM_CREATOR_FEE_BPS = Math.round(PLATFORM_CREATOR_FEE * BPS_PER_WHOLE); // 700 BPS = 7%
export const MULTIPLAYER_FEE_BPS = Math.round(MULTIPLAYER_FEE * BPS_PER_WHOLE); // 150 BPS = 1.5%
export const PLATFORM_JACKPOT_FEE_BPS = Math.round(PLATFORM_JACKPOT_FEE * BPS_PER_WHOLE); // 10 BPS = 0.1%
export const PLATFORM_REFERRAL_FEE_BPS = Math.round(PLATFORM_REFERRAL_FEE * BPS_PER_WHOLE); // 25 BPS = 0.25%

/**
 * Controls whether users can revoke referral invitations after they've been accepted.
 * When true: Users can remove themselves from referral relationships they've accepted,
 * giving them control over their referral status.
 * When false: Once accepted, referral relationships are permanent.
 * This affects the referral system's flexibility and user experience.
 */
export const PLATFORM_ALLOW_REFERRER_REMOVAL = true;

// 2D/3D Toggle Feature Configuration
export const FEATURE_FLAGS = {
  TOGGLE_2D_3D_MODE: false, // Global feature flag to enable/disable the feature
  ENABLE_PER_GAME_MODE_PREFERENCES: true, // Allow per-game mode preferences

  // Game Status Blocking Configuration
  BLOCK_MAINTENANCE_GAMES: true, // Block access to games marked as 'offline' (maintenance)
  BLOCK_CREATING_GAMES: true, // Block access to games marked as 'coming-soon' (being created/added)
  RESPECT_ENVIRONMENT_FOR_GAME_BLOCKING: true, // If true, only block in production. If false, block in all environments

  // Error System Configuration
  /** 
   * Toggle between error systems:
   * - true: Use ComprehensiveErrorBoundary (new system) - Advanced error handling with retry logic, detailed error info, multiple levels (app/route/component)
   * - false: Use GlobalErrorBoundary (old system) - Simple error boundary with basic retry mechanism (2 retries max)
   * 
   * The new system provides better UX with more recovery options and debugging info in dev mode.
   * The old system is lighter and simpler, suitable for production if you prefer minimal error UI.
   */
  USE_COMPREHENSIVE_ERROR_SYSTEM: true,

  // Mobile Browser Integration
  /**
   * Enable Capacitor v7 mobile browser integration:
   * - true: Enable fullscreen native WebView for mobile apps (Capacitor v7 + Browser plugin)
   * - false: Disable mobile browser integration, use standard web navigation
   * 
   * Provides native mobile experience with fullscreen browsers for transactions, wallets, and help.
   */
  ENABLE_MOBILE_BROWSER: true,
  /**
   * Show or hide the Degen Mobile theme (mobile-only UI skin named "degen-mobile").
   * - true: enable the degen-mobile theme and related mobile-only UI tweaks
   * - false: use the regular responsive site styling on mobile
   *
   * This flag is intentionally separate from ENABLE_MOBILE_BROWSER so you can
   * toggle the UI skin independently of whether the Capacitor mobile browser
   * integration is enabled.
   */
  ENABLE_DEGEN_MOBILE_THEME: true,
  /**
   * Enable/disable the in-game (per-game) RecentGames custom component.
   */
  ENABLE_INGAME_RECENT_GAMES: true,
  /**
   * Access override / Back-soon feature flag.
   * When true, the site will be allowed to enter the "back soon" mode via code/runtime.
   * This flag can be used to quickly enable/disable the override behavior without changing env vars.
   */
  ACCESS_OVERRIDE: false,

  // Experimental Card Layouts
  /**
   * Enable the new Interactive Philosophy Journey hero cards.
   * When true: Hero cards become interactive story experiences with decision points
   * When false: Use traditional static hero cards
   */
  ENABLE_INTERACTIVE_HERO_CARDS: true,

  /**
   * Enable the new Live Game Ecosystems game cards.
   * When true: Game cards show miniature living game worlds with real-time gameplay
   * When false: Use traditional static game cards
   */
  ENABLE_LIVE_GAME_ECOSYSTEMS: getStoredLiveGameEcosystemsPreference(),
} as const;

// ===================================
// GAME RENDERING & UI CONFIGURATION
// ===================================

/**
 * Default game rendering mode for users who haven't set a personal preference.
 * This determines whether new users see games in 2D or 3D mode by default.
 * Users can override this setting in their preferences, which gets saved to localStorage.
 * 
 * - '2D': Traditional flat game rendering (better performance, simpler)
 * - '3D': Three-dimensional game rendering (more immersive, higher performance requirements)
 */
export const DEFAULT_GAME_MODE: '2D' | '3D' = '2D'; // Default mode for new users

/**
 * Available game rendering modes supported by the platform.
 * These constants are used throughout the UI for toggles, preferences, and mode switching.
 * The platform supports both 2D and 3D rendering modes for enhanced user experience.
 */
export const GAME_RENDER_MODES = {
  TWO_D: '2D',
  THREE_D: '3D',
} as const;

// ===================================
// DASHBOARD & FEATURE TOGGLES
// ===================================

/**
 * Controls whether the RecentPlays component is displayed on the main dashboard.
 * When enabled, users can see their recent betting history directly on the dashboard.
 * When disabled, recent plays are only accessible through the dedicated explorer page.
 * 
 * This toggle helps manage dashboard clutter and performance for users who prefer
 * a cleaner interface or have many recent transactions.
 */
export const DASHBOARD_SHOW_RECENT_PLAYS = false; // Toggle to show/hide RecentPlays on dashboard

/**
 * Controls whether the Leaderboard component is displayed on the main dashboard.
 * When enabled, shows top players by winnings, providing social competition and engagement.
 * When disabled, leaderboard is only accessible through dedicated pages or modals.
 * 
 * Leaderboards can drive engagement but may impact performance if user base is large.
 */
export const DASHBOARD_SHOW_LEADERBOARD = true; // Toggle to show/hide Leaderboard on dashboard

// Presale and Token page toggle
/**
 * Presale and Token page control toggle
 * 
 * When set to true:
 * - Presale is active and visible
 * - Token page is disabled/hidden
 * 
 * When set to false:
 * - Token page is active and visible  
 * - Presale is disabled/hidden
 */
export const PRESALE_ACTIVE = false; // Set to false to disable presale and activate token page

// Network feature toggles
/** 
 * Enable/disable Solana test networks (Devnet/Testnet) support and toggle functionality
 * 
 * When set to true:
 * - Users can toggle between Mainnet, Devnet, and Testnet in TokenSelect
 * - Network warning banner shows for non-mainnet networks
 * - Network preference is saved to localStorage
 * 
 * When set to false:
 * - Network is forced to mainnet-only
 * - NetworkToggle component will not render
 * - Warning banners will never show
 * - All test network functionality is disabled
 */
export const ENABLE_TEST_NETWORKS = false; // Set to false to force mainnet-only

/**
 * Individual network toggles for Solana devnet and testnet support.
 * These are only effective when ENABLE_TEST_NETWORKS is set to true.
 * 
 * Devnet: Development network for testing new features and contracts
 * Testnet: More stable testing environment closer to mainnet conditions
 * 
 * Both networks allow developers and users to test platform functionality
 * without using real SOL or affecting mainnet state.
 */
export const ENABLE_DEVNET_SUPPORT = true;  // Enable/disable devnet support
export const ENABLE_TESTNET_SUPPORT = true; // Enable/disable testnet support

// ===================================
// REFERRAL SYSTEM CONFIGURATION
// ===================================

/**
 * Controls the referral tier reward system implementation.
 * 
 * When false (recommended for safety):
 * - Referral tiers show as cosmetic badges/status indicators only
 * - No actual financial rewards are distributed
 * - Safe for platforms concerned about regulatory compliance
 * - Users see tier progression as social/status features
 * 
 * When true (requires custom implementation):
 * - Referral tiers provide actual financial rewards
 * - Platform must implement reward distribution logic
 * - May require additional legal/regulatory considerations
 * - Higher risk but potentially better user acquisition
 */
export const REFERRAL_TIERS_FINANCIAL_MODE = false;

/**
 * Referral tier progression system with 15 tiers based on number of referrals.
 * Each tier offers increasing referral fees and status recognition.
 * 
 * Structure: { min: minimum referrals, fee: referral percentage, name: tier name, badge: emoji }
 * 
 * When REFERRAL_TIERS_FINANCIAL_MODE = false:
 * - Fees are displayed as badges/status only (no actual payouts)
 * - Users earn social recognition and platform status
 * 
 * When REFERRAL_TIERS_FINANCIAL_MODE = true:
 * - Fees represent actual reward percentages (requires implementation)
 * - Higher tiers earn larger shares of referral commissions
 * 
 * The system encourages user acquisition through progressive rewards
 * and gamified progression similar to traditional affiliate programs.
 */
export const REFERRAL_TIERS = [
  { min: 0, fee: 0.0025, name: 'Starter', badge: '🌱' }, // 0.25% - Tier 1
  { min: 3, fee: 0.0035, name: 'Bronze I', badge: '🥉' }, // 0.35% - Tier 2
  { min: 7, fee: 0.0050, name: 'Bronze II', badge: '🥉' }, // 0.50% - Tier 3
  { min: 15, fee: 0.0075, name: 'Bronze III', badge: '🥉' }, // 0.75% - Tier 4
  { min: 25, fee: 0.0100, name: 'Silver I', badge: '🥈' }, // 1.00% - Tier 5
  { min: 40, fee: 0.0125, name: 'Silver II', badge: '🥈' }, // 1.25% - Tier 6
  { min: 60, fee: 0.0150, name: 'Silver III', badge: '🥈' }, // 1.50% - Tier 7
  { min: 85, fee: 0.0175, name: 'Gold I', badge: '🥇' }, // 1.75% - Tier 8
  { min: 115, fee: 0.0200, name: 'Gold II', badge: '🥇' }, // 2.00% - Tier 9
  { min: 150, fee: 0.0225, name: 'Gold III', badge: '🥇' }, // 2.25% - Tier 10
  { min: 200, fee: 0.0250, name: 'Platinum I', badge: '💎' }, // 2.50% - Tier 11
  { min: 275, fee: 0.0300, name: 'Platinum II', badge: '💎' }, // 3.00% - Tier 12
  { min: 375, fee: 0.0350, name: 'Diamond I', badge: '💍' }, // 3.50% - Tier 13
  { min: 500, fee: 0.0400, name: 'Diamond II', badge: '💍' }, // 4.00% - Tier 14
  { min: 750, fee: 0.0500, name: 'Legend', badge: '👑' }, // 5.00% - Tier 15
] as const;

// ===================================
// LIQUIDITY POOLS CONFIGURATION
// ===================================

/**
 * Helper function to create PoolToken objects for liquidity pools.
 * Simplifies pool configuration by handling PublicKey conversion and optional authority.
 * 
 * @param tokenMint - The token's mint address (string or PublicKey)
 * @param poolAuthority - Optional custom authority for private pools (string or PublicKey)
 * @returns PoolToken object with token and authority properties
 * 
 * When poolAuthority is undefined, the pool uses system program authority (public pool).
 * When poolAuthority is provided, it creates a private pool controlled by that authority.
 */
const lp = (tokenMint: PublicKey | string, poolAuthority?: PublicKey | string): PoolToken => ({
  token: new PublicKey(tokenMint),
  authority: poolAuthority !== undefined ? new PublicKey(poolAuthority) : undefined,
});

/**
 * Array of supported liquidity pools where users can place bets.
 * Each pool represents a different token that users can gamble with.
 * 
 * Pool types:
 * - Public pools: authority = undefined (system program), use default Gamba fees
 * - Private pools: authority = custom address, allow customized fees and control
 * 
 * The platform supports multiple tokens to give users betting options
 * and allow liquidity providers to deposit different assets.
 */
export const POOLS = [
  lp('So11111111111111111111111111111111111111112'), // SOL pool - Public pool using system authority
  lp('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // USDC pool - Public pool using system authority
  lp(FAKE_TOKEN_MINT), // Fake token pool for testing - Public pool for development
];

/**
 * The default liquidity pool selected when users first load the platform.
 * This pool is pre-selected in token selection UI and used for initial bets.
 * 
 * Currently set to the SOL pool (POOLS[0]) as it's the most commonly used
 * and familiar token for most Solana users.
 */
export const DEFAULT_POOL = POOLS[0];

// ===================================
// TOKEN METADATA & DISPLAY CONFIGURATION
// ===================================

/**
 * TypeScript type definition for token metadata with minted status.
 * Extends basic token information with additional properties needed for display and wagering.
 * 
 * @property mint - The unique Solana address identifying the token
 * @property name - Human-readable token name for UI display
 * @property symbol - Short token symbol (e.g., SOL, USDC)
 * @property image - URL to token logo/icon for visual representation
 * @property decimals - Number of decimal places (affects precision calculations)
 * @property baseWager - Minimum wager amount in smallest token units
 * @property poolAuthority - Custom authority for private token pools (optional)
 * @property usdPrice - Current USD price for wager calculations and display
 * @property minted - Whether the token actually exists on-chain (important for custom tokens)
 */
type TokenMetaWithMinted = {
  mint: PublicKey; // The token's mint address
  name?: string; // Display name of the token
  symbol?: string; // Token symbol (e.g., SOL, USDC)
  image?: string; // URL to token logo image
  decimals?: number; // Number of decimal places for the token
  baseWager?: number; // Base wager amount in smallest units (e.g., lamports for SOL)
  poolAuthority?: PublicKey; // Authority for the token's pool (if custom)
  usdPrice?: number; // Current USD price of the token
  minted?: boolean; // Whether the token has been minted (for custom tokens)
};

/**
 * Comprehensive metadata for all tokens supported by the platform.
 * Used throughout the application for token selection, display formatting,
 * wager calculations, and USD value conversions.
 * 
 * Each token includes:
 * - Basic identification (mint, name, symbol)
 * - Visual assets (logo images)
 * - Technical specs (decimals, base wager)
 * - Economic data (USD prices)
 * - Status flags (minted status)
 * 
 * This data drives the token selection UI and ensures consistent
 * token handling across all platform features.
 */
export const TOKEN_METADATA: TokenMetaWithMinted[] = [
  {
    mint: new PublicKey('So11111111111111111111111111111111111111112'), // SOL mint address
    name: 'SOLANA',
    symbol: 'SOL',
    image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    baseWager: 1e9, // 1 SOL in lamports (1e9)
    decimals: 9, // SOL has 9 decimals
    usdPrice: 232.89, // Example USD price (may be updated dynamically)
  },
  {
    mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // USDC mint address
    name: 'USDC',
    symbol: 'USDC',
    image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    baseWager: 1e6,
    decimals: 6,
    usdPrice: 0.999781,
  },
  {
    mint: FAKE_TOKEN_MINT, // Fake token mint for testing/development
    name: 'Degen Heart',
    symbol: 'DGHRT',
    image: '/png/images/$DGHRT.png',
    baseWager: 1e9,
    decimals: 9,
    usdPrice: 1,
    minted: false, // Set to true when DGHRT is actually minted
  },
];

// ===================================
// LEGAL & COMPLIANCE CONFIGURATION
// ===================================

/**
 * Terms of Service HTML content displayed to users before they can continue using the platform.
 * Contains essential legal disclaimers and responsible gaming information.
 * 
 * Key requirements covered:
 * 1. Age verification (18+ or local legal gambling age)
 * 2. Legal compliance (gambling laws vary by jurisdiction)
 * 3. Responsible gaming (problem gambling resources and self-control)
 * 
 * This HTML is shown in a modal or overlay that users must accept
 * before accessing gambling features. It helps ensure legal compliance
 * and promotes responsible gaming practices.
 */
export const TOS_HTML = `
<p><b>1. Age Requirement:</b> Must be 18+ or the legal gambling age in your area.</p>
<p><b>2. Legal Compliance:</b> Ensure online gambling and crypto gaming are legal where you live before playing.</p>
<p><b>3. Responsible Gaming:</b> Play responsibly and seek help if gambling becomes a problem. For support, visit <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer">BeGambleAware.org</a>.</p>
`;

// ===================================
// TOKEN DATA FETCHING & PRICE UPDATES
// ===================================

/**
 * Function to fetch detailed token metadata dynamically using the Helius metadata API.
 * Provides on-demand access to comprehensive token information from the Helius service.
 * 
 * @param mints - Array of token mint addresses (as strings) to fetch metadata for
 * @returns Promise resolving to metadata object with token details
 * 
 * Usage: await TOKEN_METADATA_FETCHER(['mint1', 'mint2', ...])
 * 
 * This function calls the platform's backend API route (/api/services/helius)
 * which proxies requests to Helius to avoid CORS issues and manage API keys server-side.
 * Used for fetching additional token information beyond the static TOKEN_METADATA.
 */
export const TOKEN_METADATA_FETCHER = async (mints: string[]) => {
  const res = await fetch('/api/services/helius', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mints }),
  });
  if (!res.ok) throw new Error('Failed to fetch token metadata');
  return await res.json();
};

/**
 * Utility function to update TOKEN_METADATA with fresh USD prices from external APIs.
 * Maintains current pricing data for accurate wager calculations and USD displays.
 * 
 * Fetches prices from CoinGecko API (via backend proxy) and updates the global
 * TOKEN_METADATA array with current market prices. Handles fallback scenarios
 * and error conditions gracefully.
 * 
 * Process:
 * 1. Maps Solana mint addresses to CoinGecko API IDs
 * 2. Fetches current prices via proxied API call
 * 3. Updates TOKEN_METADATA with fresh prices
 * 4. Sets global flag if Helius becomes unavailable
 * 
 * Called periodically to keep pricing data current for user-facing displays
 * and wager amount calculations in USD equivalents.
 */
export async function updateTokenPrices() {
  // CoinGecko IDs for supported tokens - maps Solana mint addresses to CoinGecko API IDs
  const coingeckoMap: { [mint: string]: string; } = {
    'So11111111111111111111111111111111111111112': 'solana', // SOL mint to CoinGecko ID
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'usd-coin', // USDC mint to CoinGecko ID
  };

  // Build CoinGecko IDs list for API request
  const ids = Object.values(coingeckoMap).join(',');

  // Build proxy API URL (avoids CORS issues by using our backend proxy)
  const coingeckoUrl = `/api/services/coingecko?ids=${ids}&vs_currencies=usd`;

  // Promise for CoinGecko fetch via proxy - updates TOKEN_METADATA with latest prices
  const coingeckoPromise = rpcCachedFetch(coingeckoUrl)
    .then(res => res.json())
    .then(data => {
      TOKEN_METADATA.forEach(token => {
        const mint = token.mint.toBase58();
        if (mint === FAKE_TOKEN_MINT.toBase58()) {
          token.usdPrice = undefined; // Skip fake tokens
          return;
        }
        const cgId = coingeckoMap[mint];
        if (cgId && data[cgId] && typeof data[cgId].usd === 'number') {
          token.usdPrice = data[cgId].usd; // Update price from CoinGecko data
        }
      });
      if (typeof window !== 'undefined') window.HELIUS_UNAVAILABLE = false;
      console.log('Updated TOKEN_METADATA with CoinGecko prices:', TOKEN_METADATA);
      return 'coingecko';
    });

  // Promise for Helius fetch (if available) - Helius is now server-side only
  let heliusPromise: Promise<string> = Promise.reject('No Helius');
  // Helius API key is now server-only. Fetch token metadata via /api/services/helius endpoint if needed.

  // Race both promises, prefer CoinGecko if both succeed
  try {
    const winner = await Promise.race([
      coingeckoPromise,
      heliusPromise,
    ]);
    // If Helius wins, still update with CoinGecko when it resolves
    if (winner === 'helius') {
      coingeckoPromise.catch(() => { }); // ignore errors
    }
  } catch (error) {
    if (typeof window !== 'undefined') window.HELIUS_UNAVAILABLE = true;
    console.error('Failed to fetch token prices from both sources:', error);
  }
}

// ===================================
// NAVIGATION & UI LINKS CONFIGURATION
// ===================================

/**
 * Configuration array defining all navigation links shown in the application's sidebar.
 * Each link object controls routing, display, icons, and conditional visibility.
 * 
 * Link properties:
 * - to: Route path or dynamic route function (for wallet-specific routes)
 * - label: Display text shown in the sidebar
 * - icon: React icon component for visual representation
 * - showWhen: Function determining if link should be visible (based on connection status, permissions)
 * - external: Whether the link opens in a new tab/window
 * 
 * The sidebar provides the main navigation structure and adapts based on
 * user authentication status and platform feature toggles.
 */
export const SIDEBAR_LINKS = [
  {
    to: '/', // Route path
    label: 'Home', // Display label
    icon: FaHome, // React icon component
    showWhen: () => true, // Function to determine if link should be shown
    external: false, // Whether it's an external link
  },
  {
    to: (base58: string | null) => base58 ? `/${base58}/profile` : '/profile', // Dynamic route based on wallet
    label: 'Profile',
    icon: FaUser,
    showWhen: (connected: boolean) => connected, // Only show when wallet connected
    external: false,
  },
  {
    label: 'Games', // No 'to' property means it's a dropdown or section header
    icon: FaGamepad,
    showWhen: (connected: boolean) => connected, // Only show when connected
    external: false,
  },
  {
    to: '/explorer',
    label: 'Explorer',
    icon: FaSearch,
    showWhen: () => true, // Always show
    external: false,
  },
  {
    to: '/mobile',
    label: 'Mobile App',
    icon: FaMobile,
    showWhen: () => ENABLE_MOBILE_APP || FEATURE_FLAGS.ENABLE_MOBILE_BROWSER, // Show based on feature flags
    external: false,
  },
  {
    to: '/token',
    label: '$DGHRT',
    icon: FaCoins,
    showWhen: () => !PRESALE_ACTIVE, // Show token page only when presale is NOT active
    external: false,
  },
  {
    to: '/presale',
    label: 'Presale',
    icon: FaShoppingCart,
    showWhen: () => PRESALE_ACTIVE, // Show presale only when presale IS active
    external: false,
  },
  {
    to: '/changelog',
    label: 'Changelog',
    icon: FaClipboardList,
    showWhen: () => true,
    external: false,
  },
  {
    to: '/admin',
    label: 'Admin', // Admin panel for platform creator
    icon: FaUser, // Using FaUser for now, could use a different icon
    showWhen: (connected: boolean, publicKey?: any) => {
      if (!connected || !publicKey) return false;
      return publicKey.equals(PLATFORM_CREATOR_ADDRESS); // Only show for platform creator
    },
    external: false,
  },
];

/**
 * Array of footer links displayed at the bottom of the website.
 * Provides additional navigation and external resources for users.
 * 
 * Links include platform information, legal pages, and external profiles.
 * Some links are conditionally shown based on PRESALE_ACTIVE toggle:
 * - When presale is active: shows presale link
 * - When presale is inactive: shows token page link
 * 
 * Footer links are typically displayed across all pages for consistent access
 * to important platform information and external resources.
 */
export const FOOTER_LINKS = [
  {
    href: '/aboutme',
    title: 'About Me',
  },
  {
    href: '/credits',
    title: 'Credits',
  },
  {
    href: '/terms',
    title: 'Terms',
  },
  {
    href: '/whitepaper',
    title: 'Whitepaper',
  },
  // Conditionally show token or presale link based on PRESALE_ACTIVE toggle
  ...(PRESALE_ACTIVE ? [
    {
      href: '/presale',
      title: 'Presale',
    }
  ] : [
    {
      href: '/token',
      title: '$DGHRT Token',
    }
  ]),
  {
    href: 'https://github.com/degenwithheart',
    title: 'GitHub',
  },
  {
    href: 'https://x.com/DegenWithHeart',
    title: 'X',
  },
];

/**
 * Mobile-specific footer links shown in mobile apps or mobile browser mode.
 * Provides simplified navigation for connected users on mobile devices.
 * 
 * These links are optimized for mobile interfaces and focus on core functionality:
 * - Home: Main dashboard access
 * - Profile: Dynamic wallet-specific profile page
 * - Games: Game selection and access
 * - Explorer: Transaction history and exploration
 * 
 * Only shown when users have connected wallets, as mobile footer
 * serves authenticated users in mobile contexts.
 */
export const MOBILE_FOOTER_LINKS_CONNECTED = [
  {
    href: '/',
    title: 'Home',
  },
  {
    href: '/${base58}/profile', // Dynamic profile link using wallet base58
    title: 'Profile',
  },
  {
    label: 'Games', // Label for games section
    title: 'Games',
  },
  {
    href: '/explorer',
    title: 'Explorer',
  },
];

/**
 * Mobile-specific footer links shown to disconnected users on mobile devices.
 * Provides basic navigation and information access for non-authenticated mobile users.
 * 
 * Focuses on informational content and external links since gambling features
 * require wallet connection. Includes platform information and social links
 * to help users learn about and engage with the platform.
 */
export const MOBILE_FOOTER_LINKS_DISCONNECTED = [
  {
    href: '/',
    title: 'Welcome',
  },
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
];

// ===================================
// FEATURE TOGGLES & SOCIAL FEATURES
// ===================================

/**
 * Controls whether the leaderboard feature is enabled across the platform.
 * When enabled, users can view top players by winnings and compete for ranking.
 * When disabled, leaderboard components are hidden and ranking features are inactive.
 * 
 * Leaderboards drive engagement through social competition but may impact
 * performance if the user base becomes very large. Consider scaling implications
 * when enabling for high-traffic platforms.
 */
export const ENABLE_LEADERBOARD = true;

/**
 * Controls whether the trollbox/chat feature is enabled.
 * Requires Vercel deployment configuration for real-time messaging functionality.
 * When enabled, users can participate in platform-wide chat and community interaction.
 * When disabled, chat components are hidden and messaging features are inactive.
 * 
 * Note: Requires proper Vercel setup and may involve additional infrastructure costs.
 * Check Discord tutorials for implementation details.
 */
export const ENABLE_TROLLBOX = true; // Requires setup in vercel (check tutorial in discord)

/**
 * Controls whether the featured game is displayed as a fully playable inline component
 * directly on the main dashboard, rather than just as a preview or link.
 * 
 * When true: Featured game loads and runs directly on dashboard (higher performance impact)
 * When false: Featured game shows as preview/thumbnail with link to dedicated page
 * 
 * Inline play provides better user engagement but increases initial page load time.
 * Consider performance trade-offs when enabling.
 */
export const FEATURED_GAME_INLINE = false;

/**
 * Specifies which game to feature as the platform's highlighted game.
 * Set to a valid game ID to enable featured game functionality.
 * Set to undefined to disable featured game entirely.
 * 
 * Featured games receive prominent placement and marketing focus.
 * Choose games that are popular, visually appealing, or strategically important.
 * 
 * Current featured game: 'jackpot' (leave undefined to disable)
 */
export const FEATURED_GAME_ID: string | undefined = 'jackpot';   // ← put game id or leave undefined

// ===================================
// THEME & UI CONFIGURATION
// ===================================

/**
 * Controls whether users can select and switch between different themes in the UI.
 * When enabled, theme selector becomes available in settings or header.
 * When disabled, theme selection UI is hidden and theming is fixed.
 * 
 * Theme customization enhances user experience but adds UI complexity.
 * Consider user preferences and platform branding when enabling.
 */
export const ENABLE_THEME_SELECTOR = true;

/**
 * Controls whether users can select and switch between different color schemes.
 * When enabled, color scheme selector becomes available alongside theme selector.
 * When disabled, color scheme selection is hidden and schemes are fixed.
 * 
 * Color schemes provide additional customization but increase UI options complexity.
 * Works in conjunction with ENABLE_THEME_SELECTOR for full theming control.
 */
export const ENABLE_COLOR_SCHEME_SELECTOR = true;

/**
 * Default layout theme applied to new users or when no preference is saved.
 * Determines the visual structure and component layout of the application.
 * 
 * Available themes: 'default' | 'degenheart'
 * - 'default': Standard layout with conventional component arrangement
 * - 'degenheart': Custom layout optimized for the DegenCasino brand experience
 * 
 * Theme preference is saved to localStorage for returning users.
 */
export const DEFAULT_LAYOUT_THEME = 'degenheart'; // 'default' | 'degenheart'

/**
 * Default color scheme applied to new users or when no preference is saved.
 * Determines the color palette and visual styling of the application.
 * 
 * Available schemes: 'default' | 'romanticDegen' | 'cyberpunk' | etc.
 * - 'default': Standard color scheme with neutral, accessible colors
 * - 'romanticDegen': Warm, engaging colors fitting the casino theme
 * - 'cyberpunk': Futuristic, high-contrast color scheme
 * 
 * Color scheme preference is saved to localStorage for returning users.
 */
export const DEFAULT_COLOR_SCHEME = 'romanticDegen'; // 'default' | 'romanticDegen' | 'cyberpunk' | etc.

/**
 * Controls whether the theme selector button appears in the main header.
 * When true: Theme button is visible in header for quick access
 * When false: Theme selection only available in settings modal
 * 
 * Header placement provides convenience but consumes header space.
 * Consider mobile responsiveness when enabling header placement.
 */
export const SHOW_THEME_BUTTON_IN_HEADER = true;

/**
 * Controls whether experimental or advanced layout themes are available for selection.
 * When enabled, additional theme options like "Holy Grail" layout become available.
 * When disabled, only stable, production-ready themes are shown.
 * 
 * Experimental themes may have incomplete features or performance considerations.
 * Enable only when theme system is fully implemented and tested.
 */
export const ENABLE_EXPERIMENTAL_THEMES = true; // Set to true when theme system is fully implemented

// ===================================
// EXPORTS & UTILITIES
// ===================================

/**
 * Re-export of the fake token mint constant for use in other modules.
 * This allows other parts of the application to reference the fake token
 * without importing directly from gamba-react-ui-v2.
 * 
 * Used primarily for testing and development environments where
 * real token transactions are not desired.
 */
export { FAKE_TOKEN_MINT };

