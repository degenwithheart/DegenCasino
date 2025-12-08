// Buffer polyfill must be first
import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;
globalThis.global = globalThis;
globalThis.process = globalThis.process || { env: {}, browser: true };

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { GambaPlatformProvider, ReferralProvider, TokenMetaProvider, useGambaPlatformContext } from 'gamba-react-ui-v2';
import { GambaProvider, SendTransactionProvider } from 'gamba-react-v2';
import * as Tone from 'tone';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GlobalErrorBoundary } from './GlobalErrorBoundary';
import useAnalyzeMonitor from './hooks/useAnalyzeMonitor';
import { ComprehensiveErrorBoundary } from './components/ErrorBoundaries';
import { DEFAULT_POOL, FEATURE_FLAGS, PLATFORM_CREATOR_ADDRESS, PLATFORM_CREATOR_FEE, PLATFORM_JACKPOT_FEE, PLATFORM_REFERRAL_FEE, POOLS, TOKEN_METADATA } from './constants';
import { NetworkProvider, useNetwork } from './contexts/NetworkContext';
import { MobileBrowserProvider } from './contexts/MobileBrowserContext';
import { UnifiedThemeProvider } from './themes/UnifiedThemeContext';

import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

// Define getInitialPool function to return the default pool value
function getInitialPool() {
  try {
    const savedMint = localStorage.getItem('selectedTokenMint');
    if (savedMint) {
      const found = POOLS.find(pool => pool.token.toBase58() === savedMint);
      if (found) return found;
    }
  } catch {
    // Ignore localStorage errors
  }
  return DEFAULT_POOL;
}

// Component that uses the network context to provide dynamic connection
function NetworkAwareConnectionProvider({ children }: { children: React.ReactNode; }) {
  const { networkConfig } = useNetwork();

  return (
    <ConnectionProvider
      endpoint={networkConfig.rpcEndpoint}
      config={{ commitment: 'processed' }}
    >
      {children}
    </ConnectionProvider>
  );
}

// --- PersistSelectedToken: Save selected token to localStorage on change ---
function PersistSelectedToken() {
  // This hook must be used inside GambaPlatformProvider
  const { selectedPool } = useGambaPlatformContext();
  React.useEffect(() => {
    if (selectedPool?.token) {
      localStorage.setItem('selectedTokenMint', selectedPool.token.toBase58());
    }
  }, [selectedPool]);
  return null;
}

function Root() {
  // Ensure analyze monitor is initialized early so runtime calls to
  // window.__analyzeMonitor.record(...) are available app-wide.
  useAnalyzeMonitor();
  const wallets = React.useMemo(
    () => [
      // new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [],
  );

  // Store the initial pool in state so it doesn't change on re-render
  const [initialPool] = React.useState(getInitialPool);

  // Global priorityFee, persisted in localStorage
  const [priorityFee, setPriorityFee] = React.useState<number>(() => {
    const saved = localStorage.getItem('priorityFee');
    return saved ? Number(saved) : 400201;
  });

  React.useEffect(() => {
    localStorage.setItem('priorityFee', String(priorityFee));
  }, [priorityFee]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <HelmetProvider>
        <NetworkProvider>
          <NetworkAwareConnectionProvider>
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
                          {FEATURE_FLAGS.ENABLE_MOBILE_BROWSER ? (
                            <MobileBrowserProvider>
                              <UnifiedThemeProvider>
                                {FEATURE_FLAGS.USE_COMPREHENSIVE_ERROR_SYSTEM ? (
                                  <ComprehensiveErrorBoundary level="app" componentName="Application">
                                    <App />
                                  </ComprehensiveErrorBoundary>
                                ) : (
                                  <GlobalErrorBoundary>
                                    <App />
                                  </GlobalErrorBoundary>
                                )}
                              </UnifiedThemeProvider>
                            </MobileBrowserProvider>
                          ) : (
                            <UnifiedThemeProvider>
                              {FEATURE_FLAGS.USE_COMPREHENSIVE_ERROR_SYSTEM ? (
                                <ComprehensiveErrorBoundary level="app" componentName="Application">
                                  <App />
                                </ComprehensiveErrorBoundary>
                              ) : (
                                <GlobalErrorBoundary>
                                  <App />
                                </GlobalErrorBoundary>
                              )}
                            </UnifiedThemeProvider>
                          )}
                        </ReferralProvider>
                      </GambaPlatformProvider>
                    </GambaProvider>
                  </SendTransactionProvider>
                </TokenMetaProvider>
              </WalletModalProvider>
            </WalletProvider>
          </NetworkAwareConnectionProvider>
        </NetworkProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

// Ensure AudioContext is resumed on first user gesture to satisfy browser autoplay policies
// This helps external libs (Tone.js in games) that may attempt to create or start audio.
if (typeof window !== 'undefined') {
  const resumeAudio = async () => {
    try {
      if ((Tone as any).context && (Tone as any).context.state !== 'running') {
        await Tone.start();
        console.debug('🎵 Tone: audio context started after user gesture');
      }
    } catch (e) {
      // swallow - not fatal
    } finally {
      window.removeEventListener('click', resumeAudio);
      window.removeEventListener('touchstart', resumeAudio);
      window.removeEventListener('keydown', resumeAudio);
    }
  };

  window.addEventListener('click', resumeAudio, { once: true });
  window.addEventListener('touchstart', resumeAudio, { once: true });
  window.addEventListener('keydown', resumeAudio, { once: true });
}

root.render(<Root />);
