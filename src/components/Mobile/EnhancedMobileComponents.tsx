import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import styled from 'styled-components';
import { useBrowser } from '../../hooks/mobile/useBrowser';
import { useWalletToast } from '../../utils/wallet/solanaWalletToast';
import { useNetwork } from '../../contexts/NetworkContext';

const MobileBrowserButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: ${props => (props.$variant === 'ghost' ? '6px 12px' : '12px 16px')};
  background: ${props =>
    props.$variant === 'secondary'
      ? 'rgba(255, 255, 255, 0.1)'
      : props.$variant === 'ghost'
      ? 'transparent'
      : 'linear-gradient(45deg, #ff6b35, #f7931e)'};
  color: white;
  border: ${props => (props.$variant === 'ghost' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none')};
  border-radius: 8px;
  font-size: ${props => (props.$variant === 'ghost' ? '12px' : '14px')};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  position: relative;

  &:hover {
    transform: translateY(-1px);
    background: ${props =>
      props.$variant === 'secondary'
        ? 'rgba(255, 255, 255, 0.15)'
        : props.$variant === 'ghost'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'linear-gradient(45deg, #ff7b45, #f8a31e)'};
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
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

interface EnhancedTransactionLinkProps {
  signature: string;
  cluster?: 'mainnet-beta' | 'devnet' | 'testnet';
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  showSuccessToast?: boolean;
}

export const EnhancedTransactionLink: React.FC<EnhancedTransactionLinkProps> = ({
  signature,
  cluster,
  children,
  variant = 'ghost',
  showSuccessToast = false,
}) => {
  const { openTransaction, isNativePlatform } = useBrowser();
  const { showWalletToast } = useWalletToast();
  const navigate = useNavigate();
  const { publicKey } = useWallet();

  const handleClick = async () => {
    if (isNativePlatform) {
      // openTransaction currently types only mainnet/devnet; cast to any to allow testnet option
      await openTransaction(signature, cluster as any);
      if (showSuccessToast) {
        showWalletToast('TRANSACTION_SUCCESS', {
          description: 'Transaction opened in native browser',
        });
      }
    } else {
      const wallet = publicKey?.toBase58() || '';
      navigate(`/explorer/transaction/${signature}${wallet ? `?user=${wallet}` : ''}`);
    }
  };

  return (
    <MobileBrowserButton onClick={handleClick} $variant={variant}>
      {isNativePlatform && <NativeIndicator />}
      {children || (
        <>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
          </svg>
          {isNativePlatform ? 'View in Explorer' : 'View Transaction'}
        </>
      )}
    </MobileBrowserButton>
  );
};

interface EnhancedWalletConnectionProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  showAddressActions?: boolean;
}

export const EnhancedWalletConnection: React.FC<EnhancedWalletConnectionProps> = ({
  onConnect,
  onDisconnect,
  variant = 'primary',
  showAddressActions = true,
}) => {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { openWalletDownload, isNativePlatform } = useBrowser();
  const { showWalletToast } = useWalletToast();
  const navigate = useNavigate();
  const { network } = useNetwork();

  const handleConnect = () => {
    if (connected) return;
    try {
      setVisible(true);
      onConnect?.();
    } catch (error) {
      showWalletToast('WALLET_NOT_FOUND');
      if (isNativePlatform) {
        openWalletDownload('phantom');
      }
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onDisconnect?.();
    showWalletToast('WALLET_DISCONNECTED');
  };

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      showWalletToast('COPY_SUCCESS', {
        description: 'Wallet address copied to clipboard',
      });
    }
  };

  const handleViewProfile = () => {
    if (publicKey) {
      navigate(`/${publicKey.toBase58()}/profile`);
    }
  };

  const handleViewOnExplorer = async () => {
    if (publicKey) {
      const explorerUrl = `https://solscan.io/account/${publicKey.toString()}${network === 'devnet' ? '?cluster=devnet' : network === 'testnet' ? '?cluster=testnet' : ''}`;
      if (isNativePlatform) {
        const { openExternal } = useBrowser();
        await openExternal(explorerUrl, 'Wallet on Solscan');
      } else {
        window.open(explorerUrl, '_blank');
      }
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!connected) {
    return (
      <MobileBrowserButton onClick={handleConnect} $variant={variant}>
        {isNativePlatform && <NativeIndicator />}
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12L10,4H21M12,9H21V7H12M21,11H12V9H21M21,13H12V11H21Z" />
        </svg>
        {isNativePlatform ? 'Connect Mobile Wallet' : 'Connect Wallet'}
      </MobileBrowserButton>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ color: 'white', fontFamily: 'monospace', fontSize: '14px' }}>{formatAddress(publicKey?.toString() || '')}</span>
        {isNativePlatform && <NativeIndicator />}
      </div>

      {showAddressActions && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <MobileBrowserButton onClick={handleCopyAddress} $variant="ghost">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
            </svg>
            Copy
          </MobileBrowserButton>

          <MobileBrowserButton onClick={handleViewProfile} $variant="ghost">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
            Profile
          </MobileBrowserButton>

          <MobileBrowserButton onClick={handleViewOnExplorer} $variant="ghost">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
            </svg>
            Explorer
          </MobileBrowserButton>

          <MobileBrowserButton onClick={handleDisconnect} $variant="secondary">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
            </svg>
            Disconnect
          </MobileBrowserButton>
        </div>
      )}
    </div>
  );
};