import styled, { keyframes } from 'styled-components'
import { spacing, components, animations, media } from '../breakpoints'

// Modern jackpot animations
const jackpotPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
`

const coinFloat = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-8px) rotate(90deg);
  }
  50% {
    transform: translateY(-16px) rotate(180deg);
  }
  75% {
    transform: translateY(-8px) rotate(270deg);
  }
`

// Clean jackpot header
export const HeaderSection = styled.div<{ $colorScheme?: any }>`
  text-align: center;
  margin-bottom: ${spacing.xl};
  position: relative;
  padding: ${spacing.lg};
  background: linear-gradient(135deg,
    ${props => props.$colorScheme?.colors?.surface || 'rgba(24, 24, 24, 0.8)'},
    ${props => props.$colorScheme?.colors?.background || 'rgba(15, 15, 35, 0.9)'}
  );
  border-radius: 20px;
  border: 1px solid ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.2)'};
  backdrop-filter: blur(20px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.1)'},
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  ${media.maxMobile} {
    padding: ${spacing.base};
    border-radius: 16px;
    margin-bottom: ${spacing.lg};
  }

  &::before {
    content: '🏆';
    position: absolute;
    top: -15px;
    right: 20%;
    font-size: 2.5rem;
    animation: ${coinFloat} 3s ease-in-out infinite;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg,
      transparent,
      ${props => props.$colorScheme?.colors?.primary || '#ffd700'},
      transparent
    );
    border-radius: 2px;
  }
`

// Modern title styling
export const Title = styled.h2<{ $colorScheme?: any }>`
  color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  text-shadow:
    0 0 20px ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.5)'},
    0 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg,
    ${props => props.$colorScheme?.colors?.primary || '#ffd700'},
    ${props => props.$colorScheme?.colors?.accent || '#a259ff'}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  animation: ${jackpotPulse} 2s ease-in-out infinite;

  ${media.maxMobile} {
    font-size: 1.25rem;
  }
`

// Clean subtitle
export const Subtitle = styled.p<{ $colorScheme?: any }>`
  color: ${props => props.$colorScheme?.colors?.text || '#ffffff'};
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
  opacity: 0.8;
  font-weight: 500;
  letter-spacing: 0.01em;
`

// Modern jackpot amount display
export const JackpotAmount = styled.div<{ $colorScheme?: any }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.sm};

  background: linear-gradient(135deg,
    ${props => props.$colorScheme?.colors?.surface || 'rgba(255, 215, 0, 0.1)'},
    ${props => props.$colorScheme?.colors?.background || 'rgba(162, 89, 255, 0.1)'}
  );
  border: 2px solid ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  border-radius: 16px;
  padding: ${spacing.lg};

  margin: ${spacing.xl} 0;

  &::before {
    content: '💰';
    font-size: 2rem;
    margin-bottom: ${spacing.xs};
  }

  .amount {
    font-size: 1.8rem;
    font-weight: 700;
    color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
    text-shadow: 0 0 12px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}80;
  }

  .label {
    font-size: 0.9rem;
    color: ${props => props.$colorScheme?.colors?.text || '#ffffff'};
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`

// Clean feature list
export const FeatureList = styled.ul<{ $colorScheme?: any }>`
  background: ${props => props.$colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$colorScheme?.colors?.accent || '#ffd700'}20;
  border-radius: 12px;
  padding: ${spacing.lg};
  margin: ${spacing.lg} 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
    padding: ${spacing.sm} 0;
    color: ${props => props.$colorScheme?.colors?.text || '#ffffff'};
    font-size: 0.95rem;

    &::before {
      content: '✨';
      font-size: 1rem;
      flex-shrink: 0;
    }
  }
`

// Modern action buttons
export const ActionButtons = styled.div`
  display: flex;
  gap: ${spacing.base};
  margin-top: ${spacing.xl};
`

export const PrimaryButton = styled.button<{ $colorScheme?: any }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};

  padding: ${spacing.base} ${spacing.lg};
  background: linear-gradient(135deg,
    ${props => props.$colorScheme?.colors?.primary || '#ffd700'},
    ${props => props.$colorScheme?.colors?.accent || '#a259ff'}
  );
  color: white;
  border: none;
  border-radius: 12px;

  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  transition: all ${animations.duration.fast} ${animations.easing.easeOut};

  &:active {
    transform: scale(0.95);
  }

  &::before {
    content: '🎯';
    font-size: 1.2rem;
  }
`

export const SecondaryButton = styled.button<{ $colorScheme?: any }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};

  padding: ${spacing.base} ${spacing.lg};
  background: transparent;
  color: ${props => props.$colorScheme?.colors?.text || '#ffffff'};
  border: 1px solid ${props => props.$colorScheme?.colors?.accent || '#ffd700'}40;
  border-radius: 12px;

  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  transition: all ${animations.duration.fast} ${animations.easing.easeOut};

  &:active {
    transform: scale(0.95);
  }

  &::before {
    content: 'ℹ️';
    font-size: 1.2rem;
  }
`
