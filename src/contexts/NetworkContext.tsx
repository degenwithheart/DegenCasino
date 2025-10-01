import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Connection } from '@solana/web3.js'
import { ENABLE_DEVNET_SUPPORT, ENABLE_TESTNET_SUPPORT, ENABLE_TEST_NETWORKS } from '../constants'

export type SolanaNetwork = 'mainnet' | 'devnet' | 'testnet'

interface NetworkConfig {
  name: string
  displayName: string
  rpcEndpoint: string
  explorerUrl: string
}

const NETWORK_CONFIGS: Record<SolanaNetwork, NetworkConfig> = {
  mainnet: {
    name: 'mainnet',
    displayName: 'Mainnet',
    rpcEndpoint: import.meta.env.RPC_ENDPOINT ?? 'https://solana-mainnet.api.syndica.io/api-key/4jiiRsRb2BL8pD6S8H3kNNr8U7YYuyBkfuce3f1ngmnYCKS5KSXwvRx53p256RNQZydrDWt1TdXxVbRrmiJrdk3RdD58qtYSna1',
    explorerUrl: 'https://degenheart.casino/explorer'
  },
  devnet: {
    name: 'devnet',
    displayName: 'Devnet',
    rpcEndpoint: import.meta.env.VITE_DEVNET_RPC_ENDPOINT ?? 'https://api.devnet.solana.com',
    explorerUrl: 'https://explorer.solana.com'
  },
  testnet: {
    name: 'testnet',
    displayName: 'Testnet',
    rpcEndpoint: import.meta.env.VITE_TESTNET_RPC_ENDPOINT ?? 'https://api.testnet.solana.com',
    explorerUrl: 'https://explorer.solana.com'
  }
}

interface NetworkContextValue {
  network: SolanaNetwork
  networkConfig: NetworkConfig
  connection: Connection
  switchNetwork: (network: SolanaNetwork) => void
  isDevnet: boolean
  isTestnet: boolean
  isMainnet: boolean
}

const NetworkContext = createContext<NetworkContextValue | null>(null)

export function useNetwork(): NetworkContextValue {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider')
  }
  return context
}

interface NetworkProviderProps {
  children: ReactNode
}

export function NetworkProvider({ children }: NetworkProviderProps) {
  // Load saved network preference or default to mainnet
  // Force mainnet if test networks are disabled
  const [network, setNetwork] = useState<SolanaNetwork>(() => {
    if (!ENABLE_TEST_NETWORKS) return 'mainnet'
    const saved = localStorage.getItem('solana-network') as SolanaNetwork
    if (!saved || saved === 'mainnet') return 'mainnet'
    if (saved === 'devnet' && ENABLE_DEVNET_SUPPORT) return 'devnet'
    if (saved === 'testnet' && ENABLE_TESTNET_SUPPORT) return 'testnet'
    return 'mainnet'
  })

  const [connection, setConnection] = useState<Connection>(() => 
    new Connection(NETWORK_CONFIGS[network].rpcEndpoint, 'processed')
  )

  const networkConfig = NETWORK_CONFIGS[network]

  // Save network preference and update connection when network changes
  useEffect(() => {
    localStorage.setItem('solana-network', network)
    setConnection(new Connection(NETWORK_CONFIGS[network].rpcEndpoint, 'processed'))
  }, [network])

  const switchNetwork = (newNetwork: SolanaNetwork) => {
    // Validate network switch based on enabled networks
    if (!ENABLE_TEST_NETWORKS && newNetwork !== 'mainnet') {
      console.warn('Test networks are disabled in constants')
      return
    }
    if (newNetwork === 'devnet' && !ENABLE_DEVNET_SUPPORT) {
      console.warn('Devnet support is disabled in constants')
      return
    }
    if (newNetwork === 'testnet' && !ENABLE_TESTNET_SUPPORT) {
      console.warn('Testnet support is disabled in constants')
      return
    }
    setNetwork(newNetwork)
  }

  const contextValue: NetworkContextValue = {
    network,
    networkConfig,
    connection,
    switchNetwork,
    isDevnet: network === 'devnet',
    isTestnet: network === 'testnet',
    isMainnet: network === 'mainnet'
  }

  return (
    <NetworkContext.Provider value={contextValue}>
      {children}
    </NetworkContext.Provider>
  )
}

// Export configurations for use in other parts of the app
export { NETWORK_CONFIGS, type NetworkConfig }
