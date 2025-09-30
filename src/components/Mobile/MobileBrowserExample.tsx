import React from 'react';
import styled from 'styled-components';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMobileBrowser } from '../../contexts/MobileBrowserContext';
import { MobileTransactionLink, MobileWalletConnection, MobileGameHelpButton } from './MobileBrowserComponents';

const ExampleContainer = styled.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  margin: 20px;
  color: white;

  h2 {
    color: #ff6b35;
    margin-bottom: 16px;
  }

  .section {
    margin-bottom: 24px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  .section h3 {
    color: #f7931e;
    margin-bottom: 12px;
    font-size: 14px;
    text-transform: uppercase;
  }

  .button-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .demo-text {
    font-size: 12px;
    opacity: 0.8;
    margin-top: 8px;
  }
`;

const StatusIndicator = styled.div<{ $isNative: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: ${props => props.$isNative ? '#00ff88' : '#fbbf24'};
  color: black;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;

  &::before {
    content: ${props => props.$isNative ? '"📱"' : '"🌐"'};
  }
`;

/**
 * MobileBrowserExample - Demonstrates integration with DegenCasino systems
 * Shows how mobile browser functionality works with existing wallet, transaction, and game components
 */
export const MobileBrowserExample: React.FC = () => {
  const { connected } = useWallet();
  const { isNativePlatform, openExternal, openWalletDownload } = useMobileBrowser();

  // Example transaction signatures for demo
  const exampleTransactions = [
    '5vAzZmU8wKzxVHc7DLu2NwSmH9jYjChDJzb6R8Qx7NrK1QvBVChL6K5uDqT2R9pXb1M8vCgN3F4tH2GjW6LzP9sX',
    '2fG8qR9sMnH4kL7pB1vD6xA3tN5wC8zE9rY1oJ4uT7qW3eS0iP6mK2bX5vL8nC9fH1dG4jR7sM0pQ3wE6yT9uI2'
  ];

  const handleSocialLink = async (platform: 'twitter' | 'discord' | 'telegram') => {
    const urls = {
      twitter: 'https://twitter.com/DegenHeartGames',
      discord: 'https://discord.gg/degenheart',
      telegram: 'https://t.me/degenheart'
    };
    
    await openExternal(urls[platform], `DegenCasino ${platform}`);
  };

  return (
    <ExampleContainer>
      <h2>Mobile Browser Integration Demo</h2>
      
      <StatusIndicator $isNative={isNativePlatform}>
        {isNativePlatform ? 'Native Mobile App' : 'Web Browser'}
      </StatusIndicator>

      <div className="section">
        <h3>Wallet Integration</h3>
        <MobileWalletConnection 
          variant="primary"
          onConnect={() => console.log('Wallet connected via mobile')}
          onDisconnect={() => console.log('Wallet disconnected via mobile')}
        />
        
        {!connected && (
          <div className="button-group" style={{ marginTop: '12px' }}>
            <button onClick={() => openWalletDownload('phantom')}>
              Get Phantom
            </button>
            <button onClick={() => openWalletDownload('solflare')}>
              Get Solflare
            </button>
            <button onClick={() => openWalletDownload('backpack')}>
              Get Backpack
            </button>
          </div>
        )}
        
        <div className="demo-text">
          {isNativePlatform 
            ? 'Wallet connections open in native fullscreen browser for secure downloads'
            : 'Wallet connections use standard web browser tabs'
          }
        </div>
      </div>

      <div className="section">
        <h3>Transaction Explorer</h3>
        <div className="button-group">
          <MobileTransactionLink 
            signature={exampleTransactions[0]}
            cluster="mainnet-beta"
            variant="primary"
          >
            View Mainnet TX
          </MobileTransactionLink>
          
          <MobileTransactionLink 
            signature={exampleTransactions[1]}
            cluster="devnet"
            variant="secondary"
          >
            View Devnet TX
          </MobileTransactionLink>
        </div>
        
        <div className="demo-text">
          {isNativePlatform 
            ? 'Transactions open in fullscreen native browser with custom toolbar colors'
            : 'Transactions navigate to internal transaction explorer pages'
          }
        </div>
      </div>

      <div className="section">
        <h3>Game Help & Documentation</h3>
        <div className="button-group">
          <MobileGameHelpButton gameId="dice">
            Dice Help
          </MobileGameHelpButton>
          
          <MobileGameHelpButton gameId="slots">
            Slots Help
          </MobileGameHelpButton>
          
          <MobileGameHelpButton gameId="mines">
            Mines Help
          </MobileGameHelpButton>
          
          <MobileGameHelpButton>
            General Help
          </MobileGameHelpButton>
        </div>
        
        <div className="demo-text">
          Game help opens documentation with game-specific styling and navigation
        </div>
      </div>

      <div className="section">
        <h3>Social & External Links</h3>
        <div className="button-group">
          <button onClick={() => handleSocialLink('twitter')}>
            Twitter
          </button>
          <button onClick={() => handleSocialLink('discord')}>
            Discord
          </button>
          <button onClick={() => handleSocialLink('telegram')}>
            Telegram
          </button>
          <button onClick={() => openExternal('https://docs.degenheart.casino', 'Documentation')}>
            Docs
          </button>
        </div>
        
        <div className="demo-text">
          {isNativePlatform 
            ? 'External links open in fullscreen browser with branded toolbar colors'
            : 'External links open in new browser tabs'
          }
        </div>
      </div>

      <div className="section">
        <h3>Integration Features</h3>
        <ul style={{ fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
          <li>✅ Integrates with existing useWalletToast system</li>
          <li>✅ Respects NetworkContext for mainnet/devnet switching</li>
          <li>✅ Uses DegenCasino styled-components theme</li>
          <li>✅ Provides native indicators for mobile app users</li>
          <li>✅ Fallback to web browser when Capacitor unavailable</li>
          <li>✅ Custom toolbar colors for different link types</li>
          <li>✅ Fullscreen presentation for immersive experience</li>
        </ul>
      </div>
    </ExampleContainer>
  );
};