import React from 'react';
import styled from 'styled-components';
import { useBrowser } from '../../hooks/mobile/useBrowser';
import { TransactionLink, WalletDownloadButton, GameHelpButton } from './BrowserComponents';

// Integration with existing DegenCasino components
const MobileBrowserProvider = styled.div`
  .mobile-browser-integration {
    position: relative;
  }

  .native-browser-indicator {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 8px;
    height: 8px;
    background: #00ff88;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

// Enhanced Transaction Result Component for Mobile
interface MobileTransactionResultProps {
  signature: string;
  status: 'success' | 'pending' | 'failed';
  cluster?: 'mainnet-beta' | 'devnet';
}

export const MobileTransactionResult: React.FC<MobileTransactionResultProps> = ({
  signature,
  status,
  cluster = 'mainnet-beta'
}) => {
  const { isNativePlatform } = useBrowser();

  return (
    <MobileBrowserProvider>
      <div className="mobile-browser-integration">
        {isNativePlatform && <div className="native-browser-indicator" />}
        <TransactionLink 
          signature={signature} 
          cluster={cluster}
          variant={status === 'success' ? 'primary' : 'secondary'}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
          </svg>
          {status === 'pending' ? 'View Pending' : 'View Transaction'}
        </TransactionLink>
      </div>
    </MobileBrowserProvider>
  );
};

// Enhanced Wallet Connection Component for Mobile
interface MobileWalletConnectProps {
  onWalletSelect?: (wallet: string) => void;
  currentWallet?: string | null;
}

export const MobileWalletConnect: React.FC<MobileWalletConnectProps> = ({
  onWalletSelect,
  currentWallet
}) => {
  const { isNativePlatform } = useBrowser();

  const wallets = [
    { id: 'phantom', name: 'Phantom', popular: true },
    { id: 'solflare', name: 'Solflare', popular: true },
    { id: 'backpack', name: 'Backpack', popular: false },
    { id: 'coinbase', name: 'Coinbase Wallet', popular: false }
  ] as const;

  return (
    <MobileBrowserProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>
          {isNativePlatform ? 'Connect Mobile Wallet' : 'Connect Wallet'}
        </h3>
        
        {wallets.map(wallet => (
          <div key={wallet.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <WalletDownloadButton 
              wallet={wallet.id}
              variant={wallet.popular ? 'primary' : 'secondary'}
            >
              {isNativePlatform && <div className="native-browser-indicator" />}
              {wallet.name}
              {wallet.popular && <span style={{ fontSize: '10px', opacity: 0.7 }}>Popular</span>}
            </WalletDownloadButton>
            
            {currentWallet === wallet.id && (
              <span style={{ color: '#00ff88', fontSize: '12px' }}>Connected</span>
            )}
          </div>
        ))}
      </div>
    </MobileBrowserProvider>
  );
};

// Enhanced Game Interface for Mobile
interface MobileGameInterfaceProps {
  gameId: string;
  gameName: string;
  children: React.ReactNode;
}

export const MobileGameInterface: React.FC<MobileGameInterfaceProps> = ({
  gameId,
  gameName,
  children
}) => {
  const { isNativePlatform } = useBrowser();

  return (
    <MobileBrowserProvider>
      <div style={{ position: 'relative' }}>
        {/* Game Help Button - positioned for mobile accessibility */}
        <div style={{ 
          position: 'absolute', 
          top: '16px', 
          right: '16px', 
          zIndex: 10 
        }}>
          <GameHelpButton gameId={gameId}>
            {isNativePlatform && <div className="native-browser-indicator" />}
            ?
          </GameHelpButton>
        </div>
        
        {/* Game Content */}
        {children}
        
        {/* Mobile-specific game info */}
        {isNativePlatform && (
          <div style={{ 
            position: 'fixed', 
            bottom: '16px', 
            left: '16px', 
            background: 'rgba(0,0,0,0.8)', 
            padding: '8px 12px', 
            borderRadius: '4px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.7)'
          }}>
            {gameName} - Native App Mode
          </div>
        )}
      </div>
    </MobileBrowserProvider>
  );
};

// Mobile-optimized external links for DegenCasino resources
export const MobileResourceLinks: React.FC = () => {
  const { isNativePlatform, openExternal } = useBrowser();

  const resources = [
    { 
      name: 'Token Info', 
      url: 'https://coinmarketcap.com/currencies/solana/', 
      icon: '🪙' 
    },
    { 
      name: 'Gamba Protocol', 
      url: 'https://gamba.so/', 
      icon: '🎰' 
    },
    { 
      name: 'Solana Status', 
      url: 'https://status.solana.com/', 
      icon: '⚡' 
    }
  ];

  return (
    <MobileBrowserProvider>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {resources.map(resource => (
          <button
            key={resource.name}
            onClick={() => openExternal(resource.url, resource.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            {isNativePlatform && <div className="native-browser-indicator" />}
            <span>{resource.icon}</span>
            {resource.name}
          </button>
        ))}
      </div>
    </MobileBrowserProvider>
  );
};

export default {
  MobileTransactionResult,
  MobileWalletConnect,
  MobileGameInterface,
  MobileResourceLinks
};