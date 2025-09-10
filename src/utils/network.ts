import { NETWORK_ENDPOINTS, ENABLE_DEVNET_SUPPORT } from '../constants'

/**
 * Get the appropriate RPC endpoint based on the current network
 * This is a utility function for components that can't use the NetworkContext
 */
export function getRpcEndpoint(network: 'mainnet' | 'devnet' = 'mainnet'): string {
  return NETWORK_ENDPOINTS[network].primary
}

/**
 * Get network configuration for API calls
 */
export function getNetworkConfig(network: 'mainnet' | 'devnet' = 'mainnet') {
  return {
    rpcEndpoint: NETWORK_ENDPOINTS[network].primary,
    backupEndpoint: NETWORK_ENDPOINTS[network].backup,
    isDevnet: network === 'devnet',
    isMainnet: network === 'mainnet'
  }
}

/**
 * Detect current network from localStorage
 */
export function getCurrentNetwork(): 'mainnet' | 'devnet' {
  if (!ENABLE_DEVNET_SUPPORT) return 'mainnet'
  const saved = localStorage.getItem('solana-network')
  return (saved === 'devnet' || saved === 'mainnet') ? saved : 'mainnet'
}

/**
 * Check if devnet support is enabled
 */
export function isDevnetEnabled(): boolean {
  return ENABLE_DEVNET_SUPPORT
}
