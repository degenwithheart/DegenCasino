import React from 'react'
import styled from 'styled-components'
import { useNetwork } from '../../contexts/NetworkContext'
import { ENABLE_DEVNET_SUPPORT } from '../../constants'

const NetworkToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: rgba(24, 24, 24, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.2);
`

const NetworkLabel = styled.span<{ $theme?: any }>`
  color: ${({ $theme }) => $theme?.colors?.textSecondary || 'rgba(255, 255, 255, 0.7)'};
  font-size: 0.9rem;
  font-weight: 600;
`

const NetworkButton = styled.button<{ $active: boolean; $isDevnet: boolean; $theme?: any }>`
  padding: 8px 16px;
  background: ${({ $active, $isDevnet }) => 
    $active 
      ? $isDevnet 
        ? 'linear-gradient(135deg, #ff9800, #f57c00)' 
        : 'linear-gradient(135deg, #4caf50, #2e7d32)'
      : 'rgba(24, 24, 24, 0.8)'
  };
  color: ${({ $active }) => ($active ? '#fff' : '#ffd700')};
  border: 1px solid ${({ $active, $isDevnet }) => 
    $active 
      ? $isDevnet 
        ? '#ff9800' 
        : '#4caf50'
      : 'rgba(255, 215, 0, 0.3)'
  };
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  position: relative;
  min-width: 80px;

  &:hover {
    background: ${({ $active, $isDevnet }) => 
      $active 
        ? $isDevnet 
          ? 'linear-gradient(135deg, #ffb74d, #ff9800)' 
          : 'linear-gradient(135deg, #66bb6a, #4caf50)'
        : 'rgba(255, 215, 0, 0.1)'
    };
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${({ $isDevnet }) => 
      $isDevnet ? 'rgba(255, 152, 0, 0.3)' : 'rgba(76, 175, 80, 0.3)'
    };
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $active, $isDevnet }) => 
      $active 
        ? $isDevnet 
          ? '#ff5722' 
          : '#2e7d32'
        : 'transparent'
    };
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transition: opacity 0.3s ease;
  }
`

const NetworkStatus = styled.div<{ $isDevnet: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: ${({ $isDevnet }) => ($isDevnet ? '#ff9800' : '#4caf50')};
  font-weight: 600;
  margin-top: 4px;
  justify-content: center;
`

const StatusIndicator = styled.div<{ $isDevnet: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $isDevnet }) => ($isDevnet ? '#ff5722' : '#2e7d32')};
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`

interface NetworkToggleProps {
  theme?: any
}

export default function NetworkToggle({ theme }: NetworkToggleProps) {
  const { network, switchNetwork, isDevnet, isMainnet, networkConfig } = useNetwork()

  // Don't render the toggle if devnet support is disabled
  if (!ENABLE_DEVNET_SUPPORT) {
    return null
  }

  const handleNetworkSwitch = (targetNetwork: 'mainnet' | 'devnet') => {
    if (network !== targetNetwork) {
      switchNetwork(targetNetwork)
      
      // Show a brief notification about the network switch
      const notification = document.createElement('div')
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${targetNetwork === 'devnet' ? '#ff9800' : '#4caf50'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `
      notification.textContent = `Switched to ${targetNetwork === 'devnet' ? 'Devnet' : 'Mainnet'}`
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.remove()
      }, 3000)
    }
  }

  return (
    <div>
      <NetworkToggleContainer>
        <NetworkLabel $theme={theme}>Network:</NetworkLabel>
        <NetworkButton
          $active={isMainnet}
          $isDevnet={false}
          $theme={theme}
          onClick={() => handleNetworkSwitch('mainnet')}
          title="Switch to Solana Mainnet"
        >
          🟢 Mainnet
        </NetworkButton>
        <NetworkButton
          $active={isDevnet}
          $isDevnet={true}
          $theme={theme}
          onClick={() => handleNetworkSwitch('devnet')}
          title="Switch to Solana Devnet (Testing)"
        >
          🟠 Devnet
        </NetworkButton>
      </NetworkToggleContainer>
      
      <NetworkStatus $isDevnet={isDevnet}>
        <StatusIndicator $isDevnet={isDevnet} />
        Connected to {networkConfig.displayName}
        {isDevnet && ' (Testing Network)'}
      </NetworkStatus>
    </div>
  )
}
