// src/utils/solanaWalletToast.ts
// Comprehensive Solana wallet and transaction toast messages

import { useToast } from '../hooks/useToast';

export interface WalletToastInput {
  title: string;
  description: string;
  link?: string;
}

// Toast message templates for all wallet and transaction events
export const WALLET_TOAST_MESSAGES = {
  // === WALLET CONNECTION ===
  WALLET_CONNECTED: {
    title: '✅ Wallet Connected',
    description: 'Your wallet has been connected successfully!'
  },
  WALLET_DISCONNECTED: {
    title: '🔌 Wallet Disconnected',
    description: 'Your wallet has been disconnected.'
  },
  WALLET_CONNECTION_FAILED: {
    title: '❌ Connection Failed',
    description: 'Failed to connect to your wallet. Please try again.'
  },
  WALLET_NOT_FOUND: {
    title: '❌ Wallet Not Found',
    description: 'Please install a Solana wallet extension to continue.'
  },
  WALLET_LOCKED: {
    title: '🔒 Wallet Locked',
    description: 'Please unlock your wallet to continue.'
  },
  WALLET_NOT_CONNECTED: {
    title: '⚠️ Wallet Required',
    description: 'Please connect your wallet to continue playing.'
  },

  // === TRANSACTION SUCCESS ===
  TRANSACTION_SUCCESS: {
    title: '✅ Transaction Confirmed',
    description: 'Your transaction has been successfully confirmed on the blockchain!'
  },
  GAME_TRANSACTION_SUCCESS: {
    title: '🎮 Game Complete',
    description: 'Your game transaction has been confirmed!'
  },
  WITHDRAWAL_SUCCESS: {
    title: '💰 Withdrawal Complete',
    description: 'Your withdrawal has been processed successfully!'
  },
  DEPOSIT_SUCCESS: {
    title: '💰 Deposit Complete',
    description: 'Your deposit has been confirmed!'
  },
  ACCOUNT_CREATED: {
    title: '🆕 Account Created',
    description: 'Your gaming account has been created successfully!'
  },
  ACCOUNT_CLOSED: {
    title: '📝 Account Closed',
    description: 'Your gaming account has been closed successfully!'
  },

  // === TRANSACTION FAILURES ===
  TRANSACTION_FAILED: {
    title: '❌ Transaction Failed',
    description: 'Your transaction could not be completed. Please try again.'
  },
  TRANSACTION_REJECTED: {
    title: '🚫 Transaction Rejected',
    description: 'You rejected the transaction in your wallet.'
  },
  TRANSACTION_TIMEOUT: {
    title: '⏰ Transaction Timeout',
    description: 'Transaction timed out. Please check your connection and try again.'
  },
  INSUFFICIENT_FUNDS: {
    title: '💸 Insufficient Funds',
    description: 'You don\'t have enough SOL to complete this transaction.'
  },
  INSUFFICIENT_TOKEN_BALANCE: {
    title: '💸 Insufficient Balance',
    description: 'You don\'t have enough tokens to place this bet.'
  },
  BLOCKHASH_NOT_FOUND: {
    title: '🌐 Network Issue',
    description: 'Unable to get recent blockhash. Please try again.'
  },
  ACCOUNT_NOT_FOUND: {
    title: '� Insufficient Balance',
    description: 'You need some SOL tokens to play games. Add funds to your wallet first.'
  },
  ACCESS_FORBIDDEN: {
    title: '🚫 Access Denied',
    description: 'Unable to access transaction data. Please try again later.'
  },

  // === NETWORK ERRORS ===
  NETWORK_ERROR: {
    title: '🌐 Network Error',
    description: 'Connection issue detected. Please check your internet connection.'
  },
  RPC_ERROR: {
    title: '🔗 RPC Error',
    description: 'Solana network is experiencing issues. Please try again.'
  },
  SIMULATION_FAILED: {
    title: '⚠️ Transaction Simulation Failed',
    description: 'Transaction simulation failed. Please check your inputs and try again.'
  },
  PROGRAM_ERROR: {
    title: '🐛 Program Error',
    description: 'Smart contract execution failed. Please try again.'
  },
  TRANSACTION_TOO_LARGE: {
    title: '📦 Transaction Too Large',
    description: 'Transaction size exceeds limits. Please reduce complexity.'
  },
  INDEX_OUT_OF_RANGE: {
    title: '🎯 Invalid Game Input',
    description: 'Game parameters are out of valid range. Please check your bet settings.'
  },

  // === GAME-SPECIFIC ERRORS ===
  GAME_NOT_FOUND: {
    title: '🎮 Game Not Found',
    description: 'The requested game could not be found.'
  },
  GAME_MAINTENANCE: {
    title: '🛠️ Game Maintenance',
    description: 'This game is currently under maintenance. Please try again later.'
  },
  GAME_COMING_SOON: {
    title: '🚀 Coming Soon',
    description: 'This game is being added soon. Check back later!'
  },
  INVALID_BET_AMOUNT: {
    title: '💰 Invalid Bet',
    description: 'Please enter a valid bet amount.'
  },
  BET_TOO_HIGH: {
    title: '💰 Bet Too High',
    description: 'Your bet exceeds the maximum allowed amount.'
  },
  BET_TOO_LOW: {
    title: '💰 Bet Too Low',
    description: 'Your bet is below the minimum required amount.'
  },

  // === SYSTEM ERRORS ===
  UNKNOWN_ERROR: {
    title: '❓ Unknown Error',
    description: 'An unexpected error occurred. Please try again.'
  },
  LOADING_ERROR: {
    title: '⏳ Loading Error',
    description: 'Failed to load data. Please refresh and try again.'
  },
  RENDERING_ERROR: {
    title: '🖼️ Display Error',
    description: 'A rendering error occurred. Please refresh the page.'
  },
  API_ERROR: {
    title: '🔌 API Error',
    description: 'Unable to connect to game services. Please try again later.'
  },

  // === SUCCESS ACTIONS ===
  COPY_SUCCESS: {
    title: '📋 Copied!',
    description: 'Content has been copied to your clipboard.'
  },
  REFERRAL_COPY_SUCCESS: {
    title: '📋 Referral Link Copied',
    description: 'Your referral code has been copied to clipboard!'
  },
  SHARE_SUCCESS: {
    title: '📤 Shared Successfully',
    description: 'Game result has been shared!'
  },

  // === PRIORITY FEE MESSAGES ===
  PRIORITY_FEE_SET: {
    title: '⚡ Priority Fee Updated',
    description: 'Transaction priority fee has been updated.'
  },
  HIGH_PRIORITY_WARNING: {
    title: '⚡ High Priority Fee',
    description: 'You\'ve set a high priority fee. Transactions will be faster but more expensive.'
  },

  // === BONUS AND REWARDS ===
  BONUS_CLAIMED: {
    title: '🎁 Bonus Claimed',
    description: 'Your bonus has been added to your account!'
  },
  JACKPOT_WON: {
    title: '🎰 JACKPOT WON!',
    description: 'Congratulations! You\'ve won the jackpot!'
  },
  BIG_WIN: {
    title: '🔥 BIG WIN!',
    description: 'Amazing! You scored a big win!'
  },

  // === ACCOUNT MANAGEMENT ===
  ACCOUNT_RESET: {
    title: '🔄 Account Reset',
    description: 'Your gaming account has been reset successfully.'
  },
  ACCOUNT_INITIALIZATION: {
    title: '⚙️ Initializing Account',
    description: 'Setting up your gaming account...'
  },
  ACCOUNT_INIT_SUCCESS: {
    title: '✅ Account Ready',
    description: 'Your gaming account is ready to use!'
  },
  ACCOUNT_INIT_FAILED: {
    title: '❌ Account Setup Failed',
    description: 'Failed to initialize your gaming account. Please try again.'
  }
} as const;

// Helper function to get toast message by key
export function getWalletToastMessage(key: keyof typeof WALLET_TOAST_MESSAGES): WalletToastInput {
  return WALLET_TOAST_MESSAGES[key];
}

// Hook for easy wallet toast usage
export function useWalletToast() {
  const toast = useToast();

  const showWalletToast = (key: keyof typeof WALLET_TOAST_MESSAGES, customMessage?: Partial<WalletToastInput>) => {
    const message = getWalletToastMessage(key);
    toast({
      ...message,
      ...customMessage
    });
  };

  const showTransactionSuccess = (txId?: string, gameName?: string) => {
    const message = gameName 
      ? WALLET_TOAST_MESSAGES.GAME_TRANSACTION_SUCCESS
      : WALLET_TOAST_MESSAGES.TRANSACTION_SUCCESS;
    
    toast({
      ...message,
      ...(txId && { link: `https://solscan.io/tx/${txId}` }),
      ...(gameName && { description: `${gameName} game completed successfully!` })
    });
  };

  const showTransactionError = (error: any) => {
    let messageKey: keyof typeof WALLET_TOAST_MESSAGES = 'TRANSACTION_FAILED';
    
    // Detect specific error types
    const errorMsg = error?.message || error?.error?.errorMessage || String(error);
    const errorString = errorMsg.toLowerCase();
    
    if (errorString.includes('not_connected')) {
      messageKey = 'WALLET_NOT_CONNECTED';
    } else if (errorString.includes('user rejected')) {
      messageKey = 'TRANSACTION_REJECTED';
    } else if (errorString.includes('insufficient')) {
      messageKey = 'INSUFFICIENT_FUNDS';
    } else if (errorString.includes('accountnotfound')) {
      messageKey = 'ACCOUNT_NOT_FOUND';
    } else if (errorString.includes('403') || errorString.includes('forbidden')) {
      messageKey = 'ACCESS_FORBIDDEN';
    } else if (errorString.includes('blockhash')) {
      messageKey = 'BLOCKHASH_NOT_FOUND';
    } else if (errorString.includes('network') || errorString.includes('fetch')) {
      messageKey = 'NETWORK_ERROR';
    } else if (errorString.includes('simulation failed')) {
      messageKey = 'SIMULATION_FAILED';
    } else if (errorString.includes('program error')) {
      messageKey = 'PROGRAM_ERROR';
    } else if (errorString.includes('too large')) {
      messageKey = 'TRANSACTION_TOO_LARGE';
    } else if (errorString.includes('index out of range')) {
      messageKey = 'INDEX_OUT_OF_RANGE';
    }

    showWalletToast(messageKey, {
      description: `${getWalletToastMessage(messageKey).description}${errorMsg && errorMsg !== errorString ? ` (${errorMsg})` : ''}`
    });
  };

  return {
    showWalletToast,
    showTransactionSuccess,
    showTransactionError,
    toast
  };
}

// Legacy compatibility - maps old error codes to new toast messages
export const ERROR_CODE_TO_TOAST_MAP: Record<string, keyof typeof WALLET_TOAST_MESSAGES> = {
  '1K2F': 'TRANSACTION_FAILED',
  '1K3B': 'INSUFFICIENT_FUNDS', 
  '1K3C': 'GAME_NOT_FOUND',
  '1K3I': 'WALLET_NOT_CONNECTED',
  '1K3J': 'GAME_MAINTENANCE',
  '1K3K': 'GAME_COMING_SOON',
  '1K3L': 'LOADING_ERROR',
  '1K3M': 'RENDERING_ERROR',
  '1K2C': 'NETWORK_ERROR',
  '1K3A': 'INVALID_BET_AMOUNT',
  '1JQO': 'WALLET_NOT_CONNECTED',
  '1JQK': 'UNKNOWN_ERROR',
  '1K3U': 'INDEX_OUT_OF_RANGE'
};

// Function to show toast from error code (for backwards compatibility)
export function showToastFromErrorCode(errorCode: string, toast: ReturnType<typeof useToast>) {
  const toastKey = ERROR_CODE_TO_TOAST_MAP[errorCode] || 'UNKNOWN_ERROR';
  const message = getWalletToastMessage(toastKey);
  toast(message);
}
