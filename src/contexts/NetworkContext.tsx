import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Connection } from '@solana/web3.js'
import { ENABLE_DEVNET_SUPPORT } from '../constants'

export type SolanaNetwork = 'mainnet' | 'devnet'

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
  }
}

interface NetworkContextValue {
  network: SolanaNetwork
  networkConfig: NetworkConfig
  connection: Connection
  switchNetwork: (network: SolanaNetwork) => void
  isDevnet: boolean
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
  // Force mainnet if devnet support is disabled
  const [network, setNetwork] = useState<SolanaNetwork>(() => {
    if (!ENABLE_DEVNET_SUPPORT) return 'mainnet'
    const saved = localStorage.getItem('solana-network')
    return (saved === 'devnet' || saved === 'mainnet') ? saved : 'mainnet'
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
    // Prevent switching to devnet if devnet support is disabled
    if (!ENABLE_DEVNET_SUPPORT && newNetwork === 'devnet') {
      console.warn('Devnet support is disabled in constants')
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
