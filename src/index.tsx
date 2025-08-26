import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { GambaProvider, SendTransactionProvider } from 'gamba-react-v2';
import { GambaPlatformProvider, ReferralProvider, TokenMetaProvider, useGambaPlatformContext } from 'gamba-react-ui-v2';
import App from './App';
import { GlobalErrorBoundary } from './GlobalErrorBoundary';
import { DEFAULT_POOL, PLATFORM_CREATOR_ADDRESS, PLATFORM_CREATOR_FEE, PLATFORM_JACKPOT_FEE, PLATFORM_REFERRAL_FEE, POOLS, RPC_ENDPOINT, TOKEN_METADATA } from './constants';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

function getInitialPool() {
  try {
    const savedMint = localStorage.getItem('selectedTokenMint');
    if (savedMint) {
      const found = POOLS.find(pool => pool.token.toBase58() === savedMint);
      if (found) return found;
    }
  } catch {}
  return DEFAULT_POOL;
}

function PersistSelectedToken() {
  const { selectedPool } = useGambaPlatformContext();
  React.useEffect(() => {
    if (selectedPool?.token) {
      localStorage.setItem('selectedTokenMint', selectedPool.token.toBase58());
    }
  }, [selectedPool]);
  return null;
}

function Root() {
  const wallets = React.useMemo(() => [new SolflareWalletAdapter()], []);
  const [initialPool] = React.useState(getInitialPool);
  const [priorityFee, setPriorityFee] = React.useState<number>(() => {
    const saved = localStorage.getItem('priorityFee');
    return saved ? Number(saved) : 400201;
  });

  React.useEffect(() => {
    localStorage.setItem('priorityFee', String(priorityFee));
  }, [priorityFee]);

  return (
    <BrowserRouter>
      <ConnectionProvider endpoint={RPC_ENDPOINT} config={{ commitment: 'processed' }}>
        <WalletProvider autoConnect wallets={wallets}>
          <WalletModalProvider>
            <TokenMetaProvider tokens={TOKEN_METADATA}>
              <SendTransactionProvider priorityFee={priorityFee}>
                <GambaProvider>
                  <GambaPlatformProvider
                    creator={PLATFORM_CREATOR_ADDRESS}
                    defaultCreatorFee={PLATFORM_CREATOR_FEE}
                    defaultJackpotFee={PLATFORM_JACKPOT_FEE}
                    defaultPool={initialPool}
                  >
                    <PersistSelectedToken />
                    <ReferralProvider prefix="code" fee={PLATFORM_REFERRAL_FEE}>
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
  );
}

root.render(<Root />);
