import { FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { PublicKey } from '@solana/web3.js'

/**
 * Standardized token amount formatting utility
 * Handles both free play tokens (DGHRT) and live tokens consistently
 * 
 * @param amount - Raw token amount (in lamports/smallest unit)
 * @param token - Token metadata with mint, decimals, etc.
 * @param options - Formatting options
 * @returns Formatted string representation of the amount
 */
export interface FormatAmountOptions {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  showPlusSign?: boolean
}

export interface TokenMeta {
  mint: PublicKey
  decimals?: number
  symbol?: string
  usdPrice?: number
}

export function formatAmount(
  amount: number, 
  token?: TokenMeta | null, 
  options: FormatAmountOptions = {}
): string {
  if (!token) return '0'

  const {
    minimumFractionDigits,
    maximumFractionDigits,
    showPlusSign = false
  } = options

  // Check if this is the free play token (DGHRT)
  const isFreeToken = token.mint.equals(FAKE_TOKEN_MINT)

  let humanAmount: number
  let formatOptions: Intl.NumberFormatOptions

  if (isFreeToken) {
    // For DGHRT (free play token):
    // - Convert from lamports (1e9 decimals) to human-readable
    // - Display as whole numbers (no decimal places)
    // - Treat as 1:1 value (1 DGHRT = 1 unit for display)
    humanAmount = amount / 1e9
    formatOptions = {
      minimumFractionDigits: minimumFractionDigits ?? 0,
      maximumFractionDigits: maximumFractionDigits ?? 0,
    }
  } else {
    // For live tokens (SOL, USDC, etc.):
    // - Convert using actual token decimals
    // - Show appropriate decimal places based on token type
    // - Use precise formatting for value display
    const decimals = token.decimals || 9
    const divisor = Math.pow(10, decimals)
    humanAmount = amount / divisor
    
    formatOptions = {
      minimumFractionDigits: minimumFractionDigits ?? 2,
      maximumFractionDigits: maximumFractionDigits ?? 6,
    }
  }

  // Format the number using Intl.NumberFormat for proper locale handling
  const formatted = new Intl.NumberFormat('en-US', formatOptions).format(Math.abs(humanAmount))
  
  // Handle sign display
  if (amount === 0) return formatted
  if (amount < 0) return `-${formatted}`
  if (showPlusSign && amount > 0) return `+${formatted}`
  
  return formatted
}

/**
 * Format amount with token symbol
 * Convenience function that includes the token symbol
 */
export function formatAmountWithSymbol(
  amount: number, 
  token?: TokenMeta | null, 
  options: FormatAmountOptions = {}
): string {
  const formattedAmount = formatAmount(amount, token, options)
  const symbol = token?.symbol || ''
  return symbol ? `${formattedAmount} ${symbol}` : formattedAmount
}

/**
 * Get appropriate decimal places for a token
 * Helper to determine sensible decimal display based on token type
 */
export function getTokenDisplayDecimals(token?: TokenMeta | null): { min: number; max: number } {
  if (!token) return { min: 0, max: 2 }
  
  // Free play token - no decimals
  if (token.mint.equals(FAKE_TOKEN_MINT)) {
    return { min: 0, max: 0 }
  }
  
  // Live tokens - based on USD value for sensible display
  const usdPrice = token.usdPrice || 0
  
  if (usdPrice >= 100) {
    // Expensive tokens like high-value SOL - show 2-4 decimals
    return { min: 2, max: 4 }
  } else if (usdPrice >= 1) {
    // Medium value tokens like USDC - show 2-6 decimals  
    return { min: 2, max: 6 }
  } else if (usdPrice >= 0.001) {
    // Lower value tokens - show more precision
    return { min: 4, max: 8 }
  } else {
    // Very low value tokens - maximum precision
    return { min: 6, max: 9 }
  }
}
