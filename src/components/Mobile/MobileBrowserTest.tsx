import React, { useState } from 'react';
import { useBrowser } from '../../hooks/mobile/useBrowser';
import { MobileTransactionLink, MobileWalletConnection, MobileGameHelpButton } from './MobileBrowserComponents';

/**
 * MobileBrowserTest - Drop this into your App.tsx temporarily to test mobile browser
 * 
 * Usage:
 * import { MobileBrowserTest } from './components/Mobile/MobileBrowserTest';
 * 
 * Then in your App component:
 * <MobileBrowserTest />
 */
export const MobileBrowserTest: React.FC = () => {
  const { 
    isNativePlatform, 
    openTransaction, 
    openExternal, 
    openWalletDownload 
  } = useBrowser();
  
  const [testSignature] = useState('5vAzZmU8wKzxVHc7DLu2NwSmH9jYjChDJzb6R8Qx7NrK1QvBVChL6K5uDqT2R9pXb1M8vCgN3F4tH2GjW6LzP9sX');

  const handleTestTransaction = async () => {
    await openTransaction(testSignature, 'mainnet-beta');
  };

  const handleTestExternal = async () => {
    await openExternal('https://degenheart.casino', 'DegenCasino Website');
  };

  const handleTestWallet = async () => {
    await openWalletDownload('phantom');
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '300px',
      background: 'rgba(0, 0, 0, 0.9)',
      border: '2px solid #ff6b35',
      borderRadius: '12px',
      padding: '16px',
      color: 'white',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div style={{ 
        borderBottom: '1px solid #ff6b35', 
        paddingBottom: '8px', 
        marginBottom: '12px',
        fontWeight: 'bold'
      }}>
        📱 Mobile Browser Test
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        Platform: <span style={{ color: isNativePlatform ? '#00ff88' : '#fbbf24' }}>
          {isNativePlatform ? 'Native Mobile' : 'Web Browser'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        <button 
          onClick={handleTestTransaction}
          style={{
            padding: '8px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Test Transaction Link
        </button>

        <button 
          onClick={handleTestExternal}
          style={{
            padding: '8px',
            background: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Test External Link
        </button>

        <button 
          onClick={handleTestWallet}
          style={{
            padding: '8px',
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Test Wallet Download
        </button>

        <div style={{ 
          borderTop: '1px solid #333', 
          paddingTop: '8px', 
          marginTop: '8px' 
        }}>
          <div style={{ marginBottom: '8px', fontSize: '11px', color: '#ccc' }}>
            Components:
          </div>
          
          <MobileTransactionLink 
            signature={testSignature}
            variant="ghost"
          >
            TX Link
          </MobileTransactionLink>
          
          <div style={{ margin: '8px 0' }}>
            <MobileWalletConnection variant="secondary" />
          </div>
          
          <MobileGameHelpButton gameId="dice">
            Game Help
          </MobileGameHelpButton>
        </div>

        <div style={{ 
          fontSize: '10px', 
          color: '#666', 
          marginTop: '8px',
          borderTop: '1px solid #333',
          paddingTop: '8px'
        }}>
          {isNativePlatform ? (
            '✅ Native: Links open fullscreen'
          ) : (
            '🌐 Web: Links open in new tabs'
          )}
        </div>
      </div>
    </div>
  );
};