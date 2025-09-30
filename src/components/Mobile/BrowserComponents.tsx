import React from 'react';
import styled from 'styled-components';
import { useBrowser } from '../../hooks/mobile/useBrowser';

const ExternalLinkButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: ${props => props.$variant === 'ghost' ? '4px 8px' : '12px 16px'};
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

// Transaction Explorer Link Component
interface TransactionLinkProps {
  signature: string;
  cluster?: 'mainnet-beta' | 'devnet';
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const TransactionLink: React.FC<TransactionLinkProps> = ({
  signature,
  cluster = 'mainnet-beta',
  children,
  variant = 'ghost'
}) => {
  const { openTransaction, isNativePlatform } = useBrowser();

  const handleClick = () => {
    openTransaction(signature, cluster);
  };

  return (
    <ExternalLinkButton onClick={handleClick} $variant={variant}>
      {children || (
        <>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
          </svg>
          {isNativePlatform ? 'View Transaction' : 'View on Solscan'}
        </>
      )}
    </ExternalLinkButton>
  );
};

// Wallet Download Component
interface WalletDownloadProps {
  wallet: 'phantom' | 'solflare' | 'backpack' | 'coinbase';
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const WalletDownloadButton: React.FC<WalletDownloadProps> = ({
  wallet,
  children,
  variant = 'primary'
}) => {
  const { openWalletDownload, isNativePlatform } = useBrowser();

  const handleClick = () => {
    openWalletDownload(wallet);
  };

  const walletNames = {
    phantom: 'Phantom',
    solflare: 'Solflare', 
    backpack: 'Backpack',
    coinbase: 'Coinbase Wallet'
  };

  return (
    <ExternalLinkButton onClick={handleClick} $variant={variant}>
      {children || (
        <>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M5,20H19V18H5M19,9H15L13,7H9C7.89,7 7,7.89 7,9V15A2,2 0 0,0 9,17H15A2,2 0 0,0 17,15V11H19M17,3H5C3.89,3 3,3.89 3,5V15A2,2 0 0,0 5,17H7V15H5V5H17"/>
          </svg>
          {isNativePlatform ? `Get ${walletNames[wallet]}` : `Download ${walletNames[wallet]}`}
        </>
      )}
    </ExternalLinkButton>
  );
};

// Game Help Link Component
interface GameHelpProps {
  gameId?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const GameHelpButton: React.FC<GameHelpProps> = ({
  gameId,
  children,
  variant = 'ghost'
}) => {
  const { openGameHelp, isNativePlatform } = useBrowser();

  const handleClick = () => {
    openGameHelp(gameId);
  };

  return (
    <ExternalLinkButton onClick={handleClick} $variant={variant}>
      {children || (
        <>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C7.59,8 4,8.59 8,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z"/>
          </svg>
          {gameId ? 'Game Rules' : 'Help'}
        </>
      )}
    </ExternalLinkButton>
  );
};

// Generic External Link Component
interface ExternalLinkProps {
  url: string;
  title?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  url,
  title,
  children,
  variant = 'ghost'
}) => {
  const { openExternal } = useBrowser();

  const handleClick = () => {
    openExternal(url, title);
  };

  return (
    <ExternalLinkButton onClick={handleClick} $variant={variant}>
      {children}
    </ExternalLinkButton>
  );
};