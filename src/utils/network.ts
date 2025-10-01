import { NETWORK_ENDPOINTS, ENABLE_DEVNET_SUPPORT, ENABLE_TESTNET_SUPPORT, ENABLE_TEST_NETWORKS } from '../constants'

/**
 * Get the appropriate RPC endpoint based on the current network
 * This is a utility function for components that can't use the NetworkContext
 */
export function getRpcEndpoint(network: 'mainnet' | 'devnet' | 'testnet' = 'mainnet'): string {
  return NETWORK_ENDPOINTS[network].primary
}

/**
 * Get network configuration for API calls
 */
export function getNetworkConfig(network: 'mainnet' | 'devnet' | 'testnet' = 'mainnet') {
  return {
    rpcEndpoint: NETWORK_ENDPOINTS[network].primary,
    backupEndpoint: NETWORK_ENDPOINTS[network].backup,
    isDevnet: network === 'devnet',
    isTestnet: network === 'testnet',
    isMainnet: network === 'mainnet'
  }
}

/**
 * Detect current network from localStorage
 */
export function getCurrentNetwork(): 'mainnet' | 'devnet' | 'testnet' {
  // If test networks are disabled, force mainnet
  if (!ENABLE_TEST_NETWORKS) return 'mainnet'

  const saved = localStorage.getItem('solana-network')
  if (!saved) return 'mainnet'

  if (saved === 'devnet' && ENABLE_DEVNET_SUPPORT) return 'devnet'
  if (saved === 'testnet' && ENABLE_TESTNET_SUPPORT) return 'testnet'

  return 'mainnet'
}

/**
 * Check if devnet support is enabled
 */
export function isDevnetEnabled(): boolean {
  return ENABLE_DEVNET_SUPPORT
}

export function isTestnetEnabled(): boolean {
  return ENABLE_TESTNET_SUPPORT
}
