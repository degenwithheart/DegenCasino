import React from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useColorScheme } from '../../../ColorSchemeContext'
import { FaWallet, FaSignOutAlt, FaSignal, FaWifi } from 'react-icons/fa'
import { spacing, typography, components } from '../breakpoints'

const ConnectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.base};
`

const ConnectionStatus = styled.div<{ $colorScheme: any; $connected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing.base};
  
  padding: ${spacing.base};
  background: ${props => props.$connected 
    ? '#10B98120' 
    : '#EF444420'
  };
  
  color: ${props => props.$connected ? '#10B981' : '#EF4444'};
  border: 1px solid ${props => props.$connected ? '#10B98160' : '#EF444460'};
  border-radius: ${components.button.borderRadius};
  
  font-size: ${typography.scale.base};
  font-weight: ${typography.weight.medium};
`

const WalletInfo = styled.div<{ $colorScheme: any }>`
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
`

const ActionButton = styled.button<{ $colorScheme: any; $variant: 'connect' | 'disconnect' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  
  min-height: ${spacing.touchTarget};
  padding: ${spacing.base};
  
  background: ${props => props.$variant === 'connect' 
    ? props.$colorScheme.colors.accent 
    : '#EF4444'
  };
  
  color: white;
  border: none;
  border-radius: ${components.button.borderRadius};
  
  font-size: ${typography.scale.base};
  font-weight: ${typography.weight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

interface ConnectionStatusContentProps {}

export const ConnectionStatusContent: React.FC<ConnectionStatusContentProps> = () => {
  const { connected, publicKey, disconnect, wallet } = useWallet()
  const { setVisible } = useWalletModal()
  const { currentColorScheme } = useColorScheme()
  
  const handleConnect = () => {
    setVisible(true)
  }
  
  const handleDisconnect = () => {
    disconnect()
  }
  
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }
  
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
  )
}