import styled, { keyframes, css } from 'styled-components'
import { spacing, components, animations, media } from '../breakpoints'

// Enhanced TikTok/Instagram style animations
export const neonPulse = keyframes`
  0% {
    box-shadow: 0 0 20px rgba(162, 89, 255, 0.3), 0 0 40px rgba(255, 215, 0, 0.2);
    border-color: rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(162, 89, 255, 0.5), 0 0 60px rgba(255, 215, 0, 0.4);
    border-color: rgba(255, 215, 0, 0.6);
  }
  100% {
    box-shadow: 0 0 20px rgba(162, 89, 255, 0.3), 0 0 40px rgba(255, 215, 0, 0.2);
    border-color: rgba(255, 215, 0, 0.3);
  }
`

export const shimmer = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

export const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`

export const GridContainer = styled.div<{ $isSingleToken: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isSingleToken }) => ($isSingleToken ? '1fr' : 'repeat(2, 1fr)')};
  gap: ${spacing.base};
  background: linear-gradient(135deg,
    rgba(24, 24, 24, 0.9) 0%,
    rgba(15, 15, 35, 0.95) 100%
  );
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 215, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.2);
  padding: ${spacing.lg};
  backdrop-filter: blur(20px);
  animation: ${fadeIn} ${animations.duration.normal} ${animations.easing.easeOut};

    ${media.maxMobile} {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: ${spacing.sm};
  }

  /* Shimmer effect overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 215, 0, 0.1),
      transparent
    );
    animation: ${shimmer} 3s infinite;
    pointer-events: none;
    border-radius: 20px;
  }
`

export const TokenCard = styled.button<{ $selected?: boolean }>`
  width: 100%;
  background: ${({ $selected }) => $selected
    ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(162, 89, 255, 0.2))'
    : 'linear-gradient(135deg, rgba(24, 24, 24, 0.8), rgba(15, 15, 35, 0.9))'
  };
  border: 2px solid ${({ $selected }) => $selected
    ? 'rgba(255, 215, 0, 0.8)'
    : 'rgba(255, 215, 0, 0.2)'
  };
  border-radius: 16px;
  padding: ${spacing.base};
  cursor: pointer;
  color: ${({ $selected }) => $selected ? '#ffd700' : '#ffffff'};
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.sm};
  transition: all ${animations.duration.fast} ${animations.easing.easeOut};
  position: relative;
  overflow: hidden;
  min-height: 120px;
  backdrop-filter: blur(10px);

  ${media.maxMobile} {
    padding: ${spacing.sm};
    border-radius: 12px;
    min-height: 100px;
    gap: ${spacing.xs};
  }

  /* Hover effects */
  &:hover {
    transform: translateY(-4px) scale(1.02);
    border-color: rgba(255, 215, 0, 0.6);
    box-shadow:
      0 12px 24px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(255, 215, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  /* Active state */
  &:active {
    transform: translateY(-2px) scale(0.98);
  }

  /* Selected state animation */
  ${({ $selected }) => $selected && css`
    animation: ${bounceIn} ${animations.duration.normal} ${animations.easing.bounce};
    box-shadow:
      0 8px 16px rgba(255, 215, 0, 0.3),
      0 0 24px rgba(162, 89, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  `}

  /* Shimmer effect for selected cards */
  ${({ $selected }) => $selected && css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 215, 0, 0.4),
        transparent
      );
      animation: ${shimmer} 2s infinite;
    }
  `}
`

export const ToggleContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 600px) {
    gap: 8px;
    margin-bottom: 12px;
  }
`

export const ToggleButton = styled.button<{ $active: boolean }>`
  flex: 1;
  min-width: 100px;
  padding: ${spacing.sm} ${spacing.lg};
  background: ${({ $active }) => $active
    ? 'linear-gradient(135deg, #ffd700, #a259ff)'
    : 'linear-gradient(135deg, rgba(24, 24, 24, 0.8), rgba(15, 15, 35, 0.9))'
  };
  color: ${({ $active }) => $active ? '#000' : '#ffd700'};
  border: 2px solid ${({ $active }) => $active ? 'transparent' : 'rgba(255, 215, 0, 0.5)'};
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all ${animations.duration.fast} ${animations.easing.easeOut};
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);

  ${media.maxMobile} {
    padding: ${spacing.xs} ${spacing.base};
    font-size: 0.85rem;
    min-width: 80px;
    border-radius: 12px;
  }

  &:hover {
    background: ${({ $active }) => $active
      ? 'linear-gradient(135deg, #ffd700cc, #a259ffcc)'
      : 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(162, 89, 255, 0.1))'
    };
    transform: translateY(-2px);
    border-color: ${({ $active }) => $active ? 'transparent' : 'rgba(255, 215, 0, 0.8)'};
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.3),
      0 0 16px rgba(255, 215, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  /* Shimmer effect for active buttons */
  ${({ $active }) => $active && css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      animation: ${shimmer} 2.5s infinite;
    }
  `}
`

export const SectionHeading = styled.h2<{ $colorScheme?: any }>`
  color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  margin: ${spacing.xl} 0 ${spacing.base} 0;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  text-shadow: 0 0 12px ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.5)'};
  background: linear-gradient(135deg,
    ${props => props.$colorScheme?.colors?.primary || '#ffd700'},
    ${props => props.$colorScheme?.colors?.accent || '#a259ff'}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeIn} ${animations.duration.normal} ${animations.easing.easeOut};

  ${media.maxMobile} {
    margin: ${spacing.lg} 0 ${spacing.sm} 0;
    font-size: 1.1rem;
  }

  /* Add glow effect */
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg,
      transparent,
      ${props => props.$colorScheme?.colors?.primary || '#ffd700'},
      transparent
    );
    border-radius: 1px;
  }
`

export const TokenIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 215, 0, 0.3);
  transition: all 0.3s ease;

  ${TokenCard}:hover & {
    border-color: #ffd700;
    box-shadow: 0 0 12px rgba(255, 215, 0, 0.4);
  }

  @media (max-width: 600px) {
    width: 28px;
    height: 28px;
  }
`

export const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex: 1;
`

export const TokenName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  text-align: left;

  @media (max-width: 600px) {
    font-size: 0.85rem;
  }
`

export const TokenSymbol = styled.span`
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  font-weight: 500;

  @media (max-width: 600px) {
    font-size: 0.7rem;
  }
`

export const TokenBalance = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`

export const BalanceAmount = styled.span<{ $selected?: boolean }>`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ $selected }) => $selected ? '#ffd700' : '#00ff88'};

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`

export const BalanceUSD = styled.span`
  font-size: 0.7rem;
  color: #999;

  @media (max-width: 600px) {
    font-size: 0.65rem;
  }
`

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-top: 2px solid #ffd700;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 32px 16px;
  color: #999;
  font-size: 0.9rem;
`

export const ErrorState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 24px 16px;
  color: #ff4545;
  font-size: 0.85rem;
  background: rgba(255, 69, 69, 0.1);
  border: 1px solid rgba(255, 69, 69, 0.3);
  border-radius: 8px;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

export const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffd700;
  background: linear-gradient(90deg, #ffd700, #a259ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const RefreshButton = styled.button`
  background: none;
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.1);
    border-color: #ffd700;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ReferralSection = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 10px;
`

export const ReferralHeader = styled.h4`
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffd700;
`

export const ReferralStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
`

export const StatItem = styled.div`
  text-align: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
`

export const StatValue = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffd700;
`

export const StatLabel = styled.div`
  font-size: 0.7rem;
  color: #999;
  margin-top: 2px;
`

export const ReferralControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const ReferralInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 6px;
  padding: 8px 12px;
  color: #fff;
  font-size: 0.8rem;

  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
  }

  &::placeholder {
    color: #666;
  }
`

export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background: ${({ $variant }) => 
    $variant === 'primary' 
      ? 'linear-gradient(135deg, #ffd700, #a259ff)' 
      : 'rgba(255, 255, 255, 0.1)'
  };
  border: 1px solid ${({ $variant }) => 
    $variant === 'primary' ? '#ffd700' : 'rgba(255, 255, 255, 0.2)'
  };
  color: ${({ $variant }) => $variant === 'primary' ? '#000' : '#fff'};
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`
