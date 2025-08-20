import * as ReactRoot from 'react'
console.log('🏷️ App React identity:', ReactRoot)

import * as ReactLocal from 'react'
console.log('🏷️ useConnection React identity:', ReactLocal)


import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { GambaPlatformProvider, ReferralProvider, TokenMetaProvider, useGambaPlatformContext } from 'gamba-react-ui-v2'
import { GambaProvider, SendTransactionProvider } from 'gamba-react-v2'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { GlobalErrorBoundary } from './GlobalErrorBoundary';
import { DEFAULT_POOL, PLATFORM_CREATOR_ADDRESS, PLATFORM_CREATOR_FEE, PLATFORM_JACKPOT_FEE, PLATFORM_REFERRAL_FEE, POOLS, RPC_ENDPOINT, TOKEN_METADATA, TOKEN_METADATA_FETCHER } from './constants'

import './styles.css'

const root = ReactDOM.createRoot(document.getElementById('root')!)

// Define getInitialPool function to return the default pool value
function getInitialPool() {
  return DEFAULT_POOL
}

function Root() {
  const wallets = React.useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [],
  )

// --- Helper: Get initial pool selection from localStorage or fallback ---
function getInitialPool() {
  try {
    const savedMint = localStorage.getItem('selectedTokenMint')
    if (savedMint) {
      const found = POOLS.find(pool => pool.token.toBase58() === savedMint)
      if (found) return found
    }
  } catch {}
  return DEFAULT_POOL
}

// --- PersistSelectedToken: Save selected token to localStorage on change ---
function PersistSelectedToken() {
  // This hook must be used inside GambaPlatformProvider
  const { selectedPool } = useGambaPlatformContext()
  React.useEffect(() => {
    if (selectedPool?.token) {
      localStorage.setItem('selectedTokenMint', selectedPool.token.toBase58())
    }
  }, [selectedPool])
  return null
}

  // Store the initial pool in state so it doesn't change on re-render
  const [initialPool] = React.useState(getInitialPool)

  // Global priorityFee, persisted in localStorage
  const [priorityFee, setPriorityFee] = React.useState<number>(() => {
    const saved = localStorage.getItem('priorityFee')
    return saved ? Number(saved) : 400201
  })

  React.useEffect(() => {
    localStorage.setItem('priorityFee', String(priorityFee))
  }, [priorityFee])

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ConnectionProvider
        endpoint={RPC_ENDPOINT}
        config={{ commitment: 'processed' }}
      >
        <WalletProvider autoConnect wallets={wallets}>
          <WalletModalProvider>
            <TokenMetaProvider
              tokens={TOKEN_METADATA}
              // fetcher removed: use API route for token metadata if needed
            >
              <SendTransactionProvider priorityFee={priorityFee}>
                <GambaProvider>
                  <GambaPlatformProvider
                    creator={PLATFORM_CREATOR_ADDRESS}
                    defaultCreatorFee={PLATFORM_CREATOR_FEE}
                    defaultJackpotFee={PLATFORM_JACKPOT_FEE}
                    defaultPool={initialPool}
                  >
                    <PersistSelectedToken />
                    <ReferralProvider
                      prefix="code"
                      fee={PLATFORM_REFERRAL_FEE}
                    >
                        <GlobalErrorBoundary>
                          <App />
                        </GlobalErrorBoundary>
                    </ReferralProvider>
                  </GambaPlatformProvider>
                </GambaProvider>
              </SendTransactionProvider>
            </TokenMetaProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </BrowserRouter>
  )
}

root.render(<Root />)
