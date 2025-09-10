import React from 'react'
import styled from 'styled-components'
import { useNetwork } from '../../contexts/NetworkContext'
import { ENABLE_DEVNET_SUPPORT } from '../../constants'

const DevnetWarningBanner = styled.div<{ $theme?: any }>`
  background: linear-gradient(135deg, #ff9800, #f57c00);
  color: white;
  padding: 12px 20px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { 
      box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
    }
    50% { 
      box-shadow: 0 4px 16px rgba(255, 152, 0, 0.5);
    }
  }

  @media (max-width: 600px) {
    padding: 10px 16px;
    font-size: 0.85rem;
    margin-bottom: 12px;
  }
`

const WarningIcon = styled.span`
  font-size: 1.2rem;
  animation: bounce 1s infinite;

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-4px);
    }
    60% {
      transform: translateY(-2px);
    }
  }
`

const WarningText = styled.div`
  flex: 1;
  
  .highlight {
    font-weight: 700;
    text-decoration: underline;
  }
`

interface DevnetWarningProps {
  theme?: any
}

export default function DevnetWarning({ theme }: DevnetWarningProps) {
  const { isDevnet, networkConfig } = useNetwork()

  if (!ENABLE_DEVNET_SUPPORT || !isDevnet) {
    return null
  }

  return (
    <DevnetWarningBanner $theme={theme}>
      <WarningIcon>⚠️</WarningIcon>
      <WarningText>
        <span className="highlight">TESTING MODE:</span> You are connected to{' '}
        <span className="highlight">{networkConfig.displayName}</span>. 
        This is for testing only - no real money is involved.
      </WarningText>
      <WarningIcon>🧪</WarningIcon>
    </DevnetWarningBanner>
  )
}
