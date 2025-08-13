import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Modal } from './Modal';
import { TokenMeta } from 'gamba-react-ui-v2';

// Celebration animations
const celebrationPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
`;

const sparkleAnimation = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
`;

const priceCountUp = keyframes`
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const ModalContent = styled.div`
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.95) 0%, rgba(91, 33, 182, 0.2) 100%);
  border-radius: 16px;
  border: 2px solid #ffd700;
  box-shadow: 0 0 32px #ffd700aa, 0 0 64px #a259ffaa;
  position: relative;
  overflow: hidden;
  max-width: 480px;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
    animation: ${sparkleAnimation} 3s infinite;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 90vw;
  }
`;

const MilestoneTitle = styled.h2`
  color: #ffd700;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 0 16px #ffd700, 0 0 32px #a259ff;
  animation: ${celebrationPulse} 2s infinite;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const TokenImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid #ffd700;
  box-shadow: 0 0 16px #ffd700aa;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
`;

const TokenDetails = styled.div`
  text-align: left;
`;

const TokenName = styled.h3`
  color: #fff;
  font-size: 1.4rem;
  margin: 0;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const TokenSymbol = styled.p`
  color: #ffd700;
  font-size: 1rem;
  margin: 0.25rem 0;
  font-weight: 500;
`;

const PriceDisplay = styled.div`
  margin: 1.5rem 0;
  animation: ${priceCountUp} 0.8s ease-out;
`;

const CurrentPrice = styled.div`
  color: #ffd700;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 0 16px #ffd700;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PriceChange = styled.div<{ isPositive: boolean }>`
  color: ${props => props.isPositive ? '#22c55e' : '#ef4444'};
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &::before {
    content: '${props => props.isPositive ? '📈' : '📉'}';
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const MilestoneMessage = styled.p`
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 1rem 0;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const EmojiBurst = styled.div`
  font-size: 2rem;
  margin: 1rem 0;
  animation: ${sparkleAnimation} 2s infinite 0.5s;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #000;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
`;

// Milestone types
export type MilestoneType = 'ath' | 'price_target' | 'percentage_gain' | 'volume_spike';

export interface TokenMilestone {
  type: MilestoneType;
  token: TokenMeta;
  currentPrice: number;
  previousPrice?: number;
  targetPrice?: number;
  percentageChange?: number;
  message: string;
  emoji: string;
}

interface TokenMilestoneModalProps {
  milestone: TokenMilestone | null;
  isOpen: boolean;
  onClose: () => void;
}

const getMilestoneTitle = (type: MilestoneType): string => {
  switch (type) {
    case 'ath':
      return '🚀 ALL-TIME HIGH! 🚀';
    case 'price_target':
      return '🎯 TARGET REACHED! 🎯';
    case 'percentage_gain':
      return '📈 MAJOR PUMP! 📈';
    case 'volume_spike':
      return '🔥 VOLUME EXPLOSION! 🔥';
    default:
      return '🎉 MILESTONE ACHIEVED! 🎉';
  }
};

const formatPrice = (price: number): string => {
  if (price >= 1) {
    return `$${price.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 6 
    })}`;
  }
  return `$${price.toLocaleString(undefined, { 
    minimumFractionDigits: 6, 
    maximumFractionDigits: 8 
  })}`;
};

const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
};

export function TokenMilestoneModal({ milestone, isOpen, onClose }: TokenMilestoneModalProps) {
  if (!isOpen || !milestone) return null;

  const { type, token, currentPrice, previousPrice, percentageChange } = milestone;
  const priceChange = previousPrice ? currentPrice - previousPrice : 0;
  const isPositive = priceChange >= 0;

  return (
    <Modal onClose={onClose}>
      <ModalContent>
        <MilestoneTitle>{getMilestoneTitle(type)}</MilestoneTitle>
        
        <TokenInfo>
          <TokenImage src={token.image} alt={token.symbol} />
          <TokenDetails>
            <TokenName>{token.name}</TokenName>
            <TokenSymbol>${token.symbol}</TokenSymbol>
          </TokenDetails>
        </TokenInfo>

        <PriceDisplay>
          <CurrentPrice>{formatPrice(currentPrice)}</CurrentPrice>
          {percentageChange !== undefined && (
            <PriceChange isPositive={isPositive}>
              {formatPercentage(percentageChange)}
            </PriceChange>
          )}
        </PriceDisplay>

        <EmojiBurst>{milestone.emoji}</EmojiBurst>
        
        <MilestoneMessage>{milestone.message}</MilestoneMessage>

        <ActionButton onClick={onClose}>
          Celebrate! 🎉
        </ActionButton>
      </ModalContent>
    </Modal>
  );
}
