// src/constants/errorCodes.ts
// Maps error code strings to user-friendly error messages

export const ERROR_CODE_MESSAGES: Record<string, string> = {
  '25SS': 'Something went wrong. Please try again.', // Generic fallback
  // Example: Test runtime error
  // Stack/message: 'Error: This is a test runtime error!'
  '1JQK': 'Test runtime error triggered (dev only).',
  // Example: Solana wallet not connected
  // Stack/message: 'Error: NOT_CONNECTED'
  '1JQO': 'Wallet not connected. Please connect your wallet.',
  // Example: Network error
  // Stack/message: 'TypeError: Failed to fetch'
  '1K2C': 'Network error. Please check your connection.',
  // Example: Transaction failed
  // Stack/message: 'Error: Transaction failed'
  '1K2F': 'Transaction failed. Please try again.',
  // Example: Invalid bet amount
  // Stack/message: 'Error: Invalid bet amount'
  '1K3A': 'Invalid bet amount. Please enter a valid value.',
  // Example: Insufficient funds
  // Stack/message: 'Error: Insufficient funds'
  '1K3B': 'Insufficient funds. Please deposit more to continue.',
  // Example: Game not found (used in Game.tsx)
  // Stack/message: 'Game not found. Please check the URL or try again later.'
  '1K3C': 'Game not found. Please check the URL or try again later.',
  // Example: Wallet mismatch (used in Game.tsx)
  // Stack/message: 'Wallet mismatch. Please reconnect with the correct wallet.'
  '1K3I': 'Wallet mismatch. Please reconnect with the correct wallet.',
  // Example: Maintenance mode (used in Game.tsx)
  // Stack/message: '🛠️ This game is currently under maintenance. Please check back later!'
  '1K3J': 'This game is currently under maintenance. Please check back later!',
  // Example: Game being added soon (used in Game.tsx)
  // Stack/message: '🧪 This game is being added soon. Check back for new games!'
  '1K3K': 'This game is being added soon. Check back for new games!',
  // Example: Loading error (used in Game.tsx)
  // Stack/message: 'Something went wrong while loading the game.'
  '1K3L': 'Something went wrong while loading the game.',
  // Example: Rendering error (used in Game.tsx)
  // Stack/message: 'A rendering error occurred.'
  '1K3M': 'A rendering error occurred.',
};

export function getErrorCode(stackOrMessage: string): string {
  // Simple hash: sum char codes, mod 36^4, base36, pad to 4 chars, uppercase
  let hash = 0;
  for (let i = 0; i < stackOrMessage.length; i++) {
    hash = (hash * 31 + stackOrMessage.charCodeAt(i)) % 1679616; // 36^4
  }
  return hash.toString(36).toUpperCase().padStart(4, '0');
}

export function getErrorMessageForCode(code: string): string {
  return ERROR_CODE_MESSAGES[code] || 'An unknown error occurred.';
}