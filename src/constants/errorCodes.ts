// src/constants/errorRegistry.ts
// 🧩 Unified, future-proof error title + message registry
// Fully supports ComprehensiveErrorBoundary (new system)

export interface ErrorEntry {
  code?: string;        // Optional unique identifier (e.g., 1K3A)
  title: string;        // UI title with emoji label
  message: string;      // User-facing explanation
  type?: string;        // Optional category: network, wallet, etc.
}

// ------------------------------
// 🔧 Unified Error Registry
// ------------------------------
export const ERROR_REGISTRY: Record<string, ErrorEntry> = {
  // ------------------------------
  // 🧠 System & Generic
  // ------------------------------
  '25SS': {
    code: '25SS',
    title: '🧠 Application Error',
    message: 'Something went wrong. Please try again.',
    type: 'system',
  },
  '1JQK': {
    code: '1JQK',
    title: '🧾 Test Runtime Error',
    message: 'Test runtime error triggered (dev only).',
    type: 'dev',
  },
  UNKNOWN: {
    title: '❓ Unknown Error',
    message: 'An unknown error occurred.',
    type: 'fallback',
  },

  // ------------------------------
  // 💳 Wallet & Connection
  // ------------------------------
  '1JQO': {
    code: '1JQO',
    title: '💳 Wallet Not Connected',
    message: 'Please connect your wallet to continue.',
    type: 'wallet',
  },
  '1K3I': {
    code: '1K3I',
    title: '🔒 Wallet Mismatch',
    message: 'Wallet mismatch detected. Please reconnect with the correct wallet.',
    type: 'wallet',
  },
  '1K3Q': {
    code: '1K3Q',
    title: '🚫 Transaction Rejected',
    message: 'You rejected the transaction in your wallet.',
    type: 'wallet',
  },

  // ------------------------------
  // 🌐 Network & RPC
  // ------------------------------
  '1K2C': {
    code: '1K2C',
    title: '🌐 Network Error',
    message: 'Unable to reach the network. Please check your internet connection.',
    type: 'network',
  },
  '1K3P': {
    code: '1K3P',
    title: '🔗 RPC Error',
    message: 'RPC call failed. Unable to fetch recent blockhash.',
    type: 'network',
  },
  '1K3R': {
    code: '1K3R',
    title: '⚠️ Transaction Simulation Failed',
    message: 'The transaction simulation failed. Please check your inputs.',
    type: 'network',
  },

  // ------------------------------
  // 💰 Transaction & Blockchain
  // ------------------------------
  '1K2F': {
    code: '1K2F',
    title: '❌ Transaction Failed',
    message: 'Transaction failed. Please try again.',
    type: 'transaction',
  },
  '1K2G': {
    code: '1K2G',
    title: '✅ Transaction Successful',
    message: 'Transaction confirmed successfully!',
    type: 'transaction',
  },
  '1K3S': {
    code: '1K3S',
    title: '🐛 Program Error',
    message: 'Smart contract execution failed.',
    type: 'transaction',
  },
  '1K3T': {
    code: '1K3T',
    title: '📦 Transaction Too Large',
    message: 'Transaction size exceeds limits. Please simplify inputs.',
    type: 'transaction',
  },

  // ------------------------------
  // 🎮 Game & Gameplay
  // ------------------------------
  '1K3A': {
    code: '1K3A',
    title: '🎲 Invalid Bet',
    message: 'Invalid bet amount. Please enter a valid value.',
    type: 'game',
  },
  '1K3B': {
    code: '1K3B',
    title: '💰 Insufficient Funds',
    message: 'Insufficient funds. Please deposit more to continue.',
    type: 'game',
  },
  '1K3C': {
    code: '1K3C',
    title: '🎮 Game Not Found',
    message: 'Game not found. Please check the URL or try again later.',
    type: 'game',
  },
  '1K3J': {
    code: '1K3J',
    title: '🛠️ Game Under Maintenance',
    message: 'This game is currently under maintenance.',
    type: 'game',
  },
  '1K3K': {
    code: '1K3K',
    title: '🚧 Coming Soon',
    message: 'This game is being added soon!',
    type: 'game',
  },
  '1K3L': {
    code: '1K3L',
    title: '🎮 Game Loading Error',
    message: 'Error while loading the game. Please refresh.',
    type: 'game',
  },
  '1K3M': {
    code: '1K3M',
    title: '🖼️ Rendering Error',
    message: 'A rendering error occurred. Please reload the page.',
    type: 'game',
  },
  '1K3U': {
    code: '1K3U',
    title: '⚙️ Game Parameter Error',
    message: 'Game parameters are invalid or out of range.',
    type: 'game',
  },

  // ------------------------------
  // 📊 Data & Access
  // ------------------------------
  '1K3N': {
    code: '1K3N',
    title: '🗂️ No Transaction History',
    message: 'This wallet has no transaction history yet.',
    type: 'data',
  },
  '1K3O': {
    code: '1K3O',
    title: '🚫 Access Denied',
    message: 'Access denied. Unable to fetch transaction data.',
    type: 'data',
  },

  // ------------------------------
  // 🕓 Rate Limiting & Performance
  // ------------------------------
  RATE_LIMIT_EXCEEDED: {
    title: '⏱️ Too Many Requests',
    message: 'You are performing actions too quickly. Please slow down.',
    type: 'rate_limit',
  },
  TIMEOUT_ERROR: {
    title: '⌛ Request Timeout',
    message: 'The request took too long to complete. Try again later.',
    type: 'network',
  },
  PERFORMANCE_DEGRADED: {
    title: '🐢 Slow Network',
    message: 'Performance may be degraded due to network conditions.',
    type: 'performance',
  },

  // ------------------------------
  // 🔌 WebSocket & Real-Time
  // ------------------------------
  WEBSOCKET_DISCONNECTED: {
    title: '🔌 Connection Lost',
    message: 'The real-time connection was lost. Attempting to reconnect...',
    type: 'realtime',
  },
  WEBSOCKET_FAILED: {
    title: '📡 WebSocket Error',
    message: 'Failed to establish a real-time connection.',
    type: 'realtime',
  },
  SUBSCRIPTION_DROPPED: {
    title: '🧭 Stream Disconnected',
    message: 'Real-time updates were interrupted.',
    type: 'realtime',
  },

  // ------------------------------
  // 🧱 Cache & Persistence
  // ------------------------------
  CACHE_MISS: {
    title: '🧱 Cache Miss',
    message: 'Unable to find requested data in cache.',
    type: 'cache',
  },
  CACHE_CORRUPTED: {
    title: '🧩 Cache Corrupted',
    message: 'Stored cache data appears invalid. Clearing cache may help.',
    type: 'cache',
  },
  STORAGE_ERROR: {
    title: '💾 Storage Error',
    message: 'Unable to read or write local data.',
    type: 'cache',
  },

  // ------------------------------
  // 🔑 Session & Authentication
  // ------------------------------
  SESSION_EXPIRED: {
    title: '🔑 Session Expired',
    message: 'Your session has expired. Please log in again.',
    type: 'auth',
  },
  UNAUTHORIZED: {
    title: '🚷 Unauthorized Access',
    message: 'You need to log in to access this feature.',
    type: 'auth',
  },
  TOKEN_INVALID: {
    title: '🔒 Invalid Token',
    message: 'Your authentication token is invalid or has expired.',
    type: 'auth',
  },

  // ------------------------------
  // ⚙️ API / Backend / Third-Party
  // ------------------------------
  API_ERROR: {
    title: '⚙️ API Error',
    message: 'Backend request failed. Please try again later.',
    type: 'api',
  },
  SERVICE_UNAVAILABLE: {
    title: '🧰 Service Unavailable',
    message: 'The service is temporarily unavailable.',
    type: 'api',
  },
  INTEGRATION_FAILURE: {
    title: '🪛 Integration Error',
    message: 'Failed to communicate with an external service.',
    type: 'api',
  },
};

// ------------------------------
// 🧩 Utility Functions
// ------------------------------
export function getErrorMessageForCode(code?: string): string {
  return (code && ERROR_REGISTRY[code]?.message) || 'An unknown error occurred.';
}

export function getErrorTitleForCode(code?: string): string {
  return (code && ERROR_REGISTRY[code]?.title) || '❓ Unknown Error';
}

export function getErrorTypeForCode(code?: string): string {
  return (code && ERROR_REGISTRY[code]?.type) || 'fallback';
}

export function getErrorCode(stackOrMessage: string): string {
  let hash = 0;
  for (let i = 0; i < stackOrMessage.length; i++) {
    hash = (hash * 31 + stackOrMessage.charCodeAt(i)) % 1679616; // 36^4 space
  }
  return hash.toString(36).toUpperCase().padStart(4, '0');
}
