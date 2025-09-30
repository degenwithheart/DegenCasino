import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMobileBrowser } from '../../contexts/MobileBrowserContext';
import { MobileTransactionLink } from './MobileBrowserComponents';

/**
 * Example: Integrate mobile browser with your existing game result patterns
 * Drop this into any game component that shows transaction results
 */
export const GameResultWithMobileBrowser: React.FC<{
  signature: string;
  amount: number;
  isWin: boolean;
}> = ({ signature, amount, isWin }) => {
  const { connected } = useWallet();
  const { isNativePlatform } = useMobileBrowser();

  return (
    <div style={{ 
      padding: '16px', 
      background: isWin ? 'rgba(0,255,136,0.1)' : 'rgba(255,107,53,0.1)',
      borderRadius: '8px',
      marginTop: '16px'
    }}>
      <div style={{ 
        fontSize: '24px', 
        fontWeight: 'bold',
        color: isWin ? '#00ff88' : '#ff6b35',
        marginBottom: '8px'
      }}>
        {isWin ? '🎉 You Won!' : '💸 You Lost'}
      </div>
      
      <div style={{ fontSize: '18px', marginBottom: '12px' }}>
        {amount} SOL
      </div>

      {connected && signature && (
        <MobileTransactionLink 
          signature={signature}
          variant="primary"
        >
          {isNativePlatform ? 'View in Native Explorer' : 'View Transaction'}
        </MobileTransactionLink>
      )}
    </div>
  );
};

/**
 * Example: Add to your existing wallet connection area
 * Replace your existing wallet button with this enhanced version
 */
export const EnhancedWalletArea: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { isNativePlatform, openWalletDownload } = useMobileBrowser();

  const handleGetWallet = () => {
    // Open Phantom download in native browser if on mobile app
    openWalletDownload('phantom');
  };

  return (
    <div style={{ padding: '16px' }}>
      {connected ? (
        <div style={{ color: '#00ff88' }}>
          ✅ Connected: {publicKey?.toString().slice(0, 8)}...
          {isNativePlatform && <span style={{ marginLeft: '8px' }}>📱</span>}
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '12px', color: '#fbbf24' }}>
            No wallet connected
          </div>
          {isNativePlatform && (
            <button 
              onClick={handleGetWallet}
              style={{
                padding: '8px 16px',
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Get Phantom Wallet 📱
            </button>
          )}
        </div>
      )}
    </div>
  );
};