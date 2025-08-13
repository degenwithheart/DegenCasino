import React from 'react';
import styled from 'styled-components';
import { useManualMilestone } from '../context/MilestoneContext';
import { TOKEN_METADATA } from '../constants';

const TestPanel = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(24, 24, 24, 0.9);
  border: 2px solid #ffd700;
  border-radius: 12px;
  padding: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;

  @media (max-width: 768px) {
    display: none; // Hide on mobile to avoid clutter
  }
`;

const TestButton = styled.button`
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #000;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PanelTitle = styled.h4`
  color: #ffd700;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  text-align: center;
`;

interface MilestoneTestPanelProps {
  isVisible?: boolean;
}

/**
 * MilestoneTestPanel - A development/testing component to manually trigger milestone modals
 * Shows a floating panel with buttons to test different milestone types
 * Only visible in development or when explicitly enabled
 */
export function MilestoneTestPanel({ isVisible = true }: MilestoneTestPanelProps) {
  const { triggerTestMilestone } = useManualMilestone();

  // Don't render in production unless explicitly enabled
  // Use GAMBA_ENV instead of NODE_ENV for more granular control
  if (!isVisible && import.meta.env.GAMBA_ENV !== 'development') {
    return null;
  }

  const availableTokens = TOKEN_METADATA.filter(token => token.symbol && token.symbol !== 'DGHRT');

  return (
    <TestPanel>
      <PanelTitle>🚀 Test Milestones</PanelTitle>
      {availableTokens.slice(0, 4).map(token => (
        <TestButton
          key={token.symbol}
          onClick={() => triggerTestMilestone(token.symbol)}
        >
          {token.symbol} ATH! 🌙
        </TestButton>
      ))}
      <TestButton
        onClick={() => triggerTestMilestone('SOL')}
        style={{ 
          background: 'linear-gradient(135deg, #a259ff 0%, #ff00cc 100%)',
          color: '#fff'
        }}
      >
        🎯 SOL $500!
      </TestButton>
    </TestPanel>
  );
}
