import React from 'react';
import styled from 'styled-components';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useColorScheme } from '../../../../themes/ColorSchemeContext';
import { useDegenMobileModal } from '../DegenMobileLayout';
import { FaWallet, FaSignOutAlt, FaSignal, FaWifi } from 'react-icons/fa';
import { spacing, typography, components, animations, media } from '../breakpoints';

const ConnectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.base};
  padding: ${spacing.lg};
  background: linear-gradient(135deg,
    rgba(24, 24, 24, 0.95),
    rgba(15, 15, 35, 0.98)
  );
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;

  ${media.maxMobile} {
    padding: ${spacing.base};
    border-radius: 16px;
  }
`;

const ConnectionStatus = styled.div<{ $colorScheme: any; $connected: boolean; }>`
  display: flex;
  align-items: center;
  gap: ${spacing.base};
  
  padding: ${spacing.lg};
  background: ${props => props.$connected
    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(34, 197, 94, 0.1))'
    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(248, 113, 113, 0.1))'
  };
  
  color: ${props => props.$connected ? '#10B981' : '#EF4444'};
  border: 1px solid ${props => props.$connected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'};
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  font-size: ${typography.scale.base};
  font-weight: ${typography.weight.medium};
  transition: all ${animations.duration.normal} ${animations.easing.easeOut};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
`;

const WalletInfo = styled.div<{ $colorScheme: any; }>`
  color: ${props => props.$colorScheme.colors.text};
  font-size: ${typography.scale.sm};
  
  .wallet-name {
    font-weight: ${typography.weight.semibold};
    margin-bottom: ${spacing.xs};
  }
  
  .wallet-address {
    font-family: monospace;
    font-size: ${typography.scale.xs};
    color: ${props => props.$colorScheme.colors.text}80;
    word-break: break-all;
  }
`;

const ActionButton = styled.button<{ $colorScheme: any; $variant: 'connect' | 'disconnect'; }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  
  min-height: ${spacing.touchTarget};
  padding: ${spacing.lg};
  
  background: ${props => props.$variant === 'connect'
    ? `linear-gradient(135deg, ${props.$colorScheme.colors.primary}, ${props.$colorScheme.colors.accent})`
    : 'linear-gradient(135deg, #EF4444, #DC2626)'
  };
  
  color: white;
  border: none;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  
  font-size: ${typography.scale.base};
  font-weight: ${typography.weight.semibold};
  cursor: pointer;
  transition: all ${animations.duration.normal} ${animations.easing.easeOut};
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Shimmer effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left ${animations.duration.normal} ${animations.easing.easeOut};
  }

  &:hover::before {
    left: 100%;
  }
`;

interface ConnectionStatusContentProps { }

export const ConnectionStatusContent: React.FC<ConnectionStatusContentProps> = () => {
  const { connected, publicKey, disconnect, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const { currentColorScheme } = useColorScheme();

  const { closeAllOverlays } = useDegenMobileModal();

  const handleConnect = () => {
    // close overlays (menus/modals) then show wallet modal
    closeAllOverlays();
    setVisible(true);
  };

  const handleDisconnect = async () => {
    await disconnect();
    // ensure any open overlays closed after disconnect
    closeAllOverlays();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <ConnectionContent>
      <ConnectionStatus $colorScheme={currentColorScheme} $connected={connected}>
        {connected ? <FaSignal /> : <FaWifi />}
        <div>
          <strong>{connected ? 'Connected' : 'Disconnected'}</strong>
          <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
            {connected ? 'Wallet is connected' : 'Connect your wallet to play'}
          </div>
        </div>
      </ConnectionStatus>

      {connected && publicKey && wallet && (
        <WalletInfo $colorScheme={currentColorScheme}>
          <div className="wallet-name">
            {wallet.adapter.name}
          </div>
          <div className="wallet-address">
            {formatAddress(publicKey.toString())}
          </div>
        </WalletInfo>
      )}

      {connected ? (
        <ActionButton
          $colorScheme={currentColorScheme}
          $variant="disconnect"
          onClick={handleDisconnect}
        >
          <FaSignOutAlt />
          Disconnect Wallet
        </ActionButton>
      ) : (
        <ActionButton
          $colorScheme={currentColorScheme}
          $variant="connect"
          onClick={handleConnect}
        >
          <FaWallet />
          Connect Wallet
        </ActionButton>
      )}
    </ConnectionContent>
  );
};