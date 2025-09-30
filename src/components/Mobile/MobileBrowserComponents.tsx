import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import styled from 'styled-components';
import { useBrowser } from '../../hooks/mobile/useBrowser';

const MobileBrowserButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: ${props => props.$variant === 'ghost' ? '6px 12px' : '12px 16px'};
  background: ${props => 
    props.$variant === 'secondary' ? 'rgba(255, 255, 255, 0.1)' :
    props.$variant === 'ghost' ? 'transparent' :
    'linear-gradient(45deg, #ff6b35, #f7931e)'
  };
  color: white;
  border: ${props => props.$variant === 'ghost' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'};
  border-radius: 8px;
  font-size: ${props => props.$variant === 'ghost' ? '12px' : '14px'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  position: relative;

  &:hover {
    transform: translateY(-1px);
    background: ${props => 
      props.$variant === 'secondary' ? 'rgba(255, 255, 255, 0.15)' :
      props.$variant === 'ghost' ? 'rgba(255, 255, 255, 0.1)' :
      'linear-gradient(45deg, #ff7b45, #f8a31e)'
    };
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const NativeIndicator = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  background: #00ff88;
  border-radius: 50%;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

interface TransactionLinkProps {
  signature: string;
  cluster?: 'mainnet-beta' | 'devnet';
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const MobileTransactionLink: React.FC<TransactionLinkProps> = ({
  signature,
  cluster,
  children,
  variant = 'ghost'
}) => {
  const { openTransaction, isNativePlatform } = useBrowser();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (isNativePlatform) {
      await openTransaction(signature, cluster);
    } else {
      navigate(`/explorer/transaction/${signature}`);
    }
  };

  return (
    <MobileBrowserButton onClick={handleClick} $variant={variant}>
      {isNativePlatform && <NativeIndicator />}
      {children || (
        <>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
          </svg>
          {isNativePlatform ? 'View in Explorer' : 'View Transaction'}
        </>
      )}
    </MobileBrowserButton>
  );
};

interface WalletConnectionProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const MobileWalletConnection: React.FC<WalletConnectionProps> = ({
  onConnect,
  onDisconnect,
  variant = 'primary'
}) => {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { openWalletDownload, isNativePlatform } = useBrowser();

  const handleConnect = () => {
    if (connected) return;
    
    try {
      setVisible(true);
      onConnect?.();
    } catch (error) {
      if (isNativePlatform) {
        openWalletDownload('phantom');
      }
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onDisconnect?.();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!connected) {
    return (
      <MobileBrowserButton onClick={handleConnect} $variant={variant}>
        {isNativePlatform && <NativeIndicator />}
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12L10,4H21M12,9H21V7H12M21,11H12V9H21M21,13H12V11H21Z"/>
        </svg>
        {isNativePlatform ? 'Connect Mobile Wallet' : 'Connect Wallet'}
      </MobileBrowserButton>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <span style={{ color: 'white', fontFamily: 'monospace', fontSize: '14px' }}>
        {formatAddress(publicKey?.toString() || '')}
      </span>
      {isNativePlatform && <NativeIndicator />}
      
      <MobileBrowserButton onClick={handleDisconnect} $variant="secondary">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
        </svg>
        Disconnect
      </MobileBrowserButton>
    </div>
  );
};

interface GameHelpButtonProps {
  gameId?: string;
  children?: React.ReactNode;
}

export const MobileGameHelpButton: React.FC<GameHelpButtonProps> = ({
  gameId,
  children
}) => {
  const { openGameHelp, isNativePlatform } = useBrowser();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (isNativePlatform) {
      await openGameHelp(gameId || 'general');
    } else {
      navigate(`/help${gameId ? `/${gameId}` : ''}`);
    }
  };

  return (
    <MobileBrowserButton onClick={handleClick} $variant="ghost">
      {isNativePlatform && <NativeIndicator />}
      {children || (
        <>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z"/>
          </svg>
          {isNativePlatform ? 'Help (Native)' : 'Help'}
        </>
      )}
    </MobileBrowserButton>
  );
};