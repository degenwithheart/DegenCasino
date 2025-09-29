import styled, { keyframes } from 'styled-components';
import { spacing, components, animations, media } from '../breakpoints';

// TikTok/Instagram style animations
const shimmer = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Modern profile banner with gradient overlay
export const ProfileBanner = styled.div<{ $colorScheme?: any }>`
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.3)'};
  background: linear-gradient(135deg,
    ${props => props.$colorScheme?.colors?.surface || 'rgba(24, 24, 24, 0.9)'},
    ${props => props.$colorScheme?.colors?.background || 'rgba(15, 15, 35, 0.95)'}
  );
  margin-bottom: ${spacing.xl};
  backdrop-filter: blur(20px);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.1)'},
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  ${media.maxMobile} {
    height: 250px;
    border-radius: 16px;
    margin-bottom: ${spacing.lg};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
      rgba(255, 215, 0, 0.1) 0%,
      rgba(162, 89, 255, 0.1) 50%,
      rgba(0, 255, 136, 0.1) 100%
    );
    z-index: 1;
  }

  /* Subtle shimmer effect */
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
      rgba(255, 215, 0, 0.05),
      transparent
    );
    animation: shimmer 4s infinite;
    z-index: 2;
  }
`

// Enhanced avatar container
export const AvatarContainer = styled.div<{ $colorScheme?: any }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  background-color: ${props => props.$colorScheme?.colors?.surface || '#0f0f23'};
  overflow: hidden;
  z-index: 2;
  box-shadow: 0 8px 24px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}40;

  transition: all ${animations.duration.fast} ${animations.easing.easeOut};

  &:hover {
    border-color: ${props => props.$colorScheme?.colors?.accent || '#a259ff'};
    box-shadow: 0 12px 32px ${props => props.$colorScheme?.colors?.accent || '#a259ff'}60;
    transform: translate(-50%, -50%) scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${media.maxMobile} {
    width: 70px;
    height: 70px;
  }
`

// Default avatar with modern styling
export const DefaultAvatar = styled.div<{ $colorScheme?: any }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg,
    ${props => props.$colorScheme?.colors?.surface || '#0f0f23'},
    ${props => props.$colorScheme?.colors?.background || '#1a1a2e'}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  z-index: 2;
  box-shadow: 0 8px 24px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}40;

  transition: all ${animations.duration.fast} ${animations.easing.easeOut};

  &:hover {
    border-color: ${props => props.$colorScheme?.colors?.accent || '#a259ff'};
    box-shadow: 0 12px 32px ${props => props.$colorScheme?.colors?.accent || '#a259ff'}60;
    transform: translate(-50%, -50%) scale(1.05);
  }

  ${media.maxMobile} {
    width: 70px;
    height: 70px;
  }
`

// Username overlay with glass effect
export const UsernameOverlay = styled.div<{ $colorScheme?: any }>`
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: ${spacing.lg};
  border-radius: 16px 16px 0 0;
  width: 100%;
  bottom: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-top: 1px solid ${props => props.$colorScheme?.colors?.primary || '#ffd700'}30;
  z-index: 2;

  transition: all ${animations.duration.normal} ${animations.easing.easeOut};

  color: ${props => props.$colorScheme?.colors?.text || '#ffffff'};
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};

  ${media.maxMobile} {
    padding: ${spacing.base};
    font-size: 1.1rem;
    border-radius: 12px 12px 0 0;
  }

  &::before {
    content: '👑';
    font-size: 1.5rem;
  }
`

// Modern info card
export const InfoCard = styled.div<{ $colorScheme?: any }>`
  background: linear-gradient(135deg,
    ${props => props.$colorScheme?.colors?.surface || 'rgba(24, 24, 24, 0.9)'},
    ${props => props.$colorScheme?.colors?.background || 'rgba(15, 15, 35, 0.95)'}
  );
  border: 1px solid ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.2)'};
  border-radius: 16px;
  padding: ${spacing.lg};
  margin-bottom: ${spacing.lg};
  backdrop-filter: blur(20px);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.3),
    0 0 0 1px ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.1)'},
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: ${fadeInUp} ${animations.duration.normal} ${animations.easing.easeOut};
  position: relative;
  overflow: hidden;

  ${media.maxMobile} {
    padding: ${spacing.base};
    border-radius: 12px;
    margin-bottom: ${spacing.base};
  }

  /* Subtle shimmer effect */
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
      rgba(255, 215, 0, 0.03),
      transparent
    );
    animation: ${shimmer} 5s infinite;
  }
`

// Wallet info section
export const WalletInfoSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${spacing.base};
`

// Wallet details
export const WalletDetails = styled.div`
  flex: 1;
  min-width: 200px;
`

export const WalletAddress = styled.p<{ $colorScheme?: any }>`
  margin: 0;
  font-weight: 700;
  color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  font-size: 0.95rem;
  word-break: break-all;
`

export const WalletAdapter = styled.p<{ $colorScheme?: any }>`
  margin: 0;
  color: ${props => props.$colorScheme?.colors?.text || '#ffffff'}70;
  font-size: 0.85rem;
`

// Action buttons container
export const ActionButtons = styled.div`
  display: flex;
  gap: ${spacing.sm};
  align-items: center;
  flex-wrap: wrap;
`

// Modern action button
export const ActionButton = styled.a<{ $colorScheme?: any }>`
  padding: ${spacing.sm} ${spacing.lg};
  border: 2px solid ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.4)'};
  border-radius: 12px;
  text-decoration: none;
  color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  font-size: 0.9rem;
  font-weight: 600;
  transition: all ${animations.duration.fast} ${animations.easing.easeOut};
  background: linear-gradient(135deg,
    rgba(255, 215, 0, 0.05),
    rgba(255, 215, 0, 0.02)
  );
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  gap: ${spacing.xs};

  ${media.maxMobile} {
    padding: ${spacing.xs} ${spacing.base};
    font-size: 0.85rem;
    border-radius: 10px;
  }

  &:hover {
    background: linear-gradient(135deg,
      rgba(255, 215, 0, 0.15),
      rgba(255, 215, 0, 0.08)
    );
    border-color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
    box-shadow:
      0 4px 12px ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.3)'},
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow:
      0 2px 8px ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.2)'};
  }

  &::before {
    content: '🔍';
    font-size: 1rem;
  }

  /* Subtle shimmer on hover */
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
      rgba(255, 215, 0, 0.1),
      transparent
    );
    transition: left ${animations.duration.normal} ${animations.easing.easeOut};
  }

  &:hover::after {
    left: 100%;
  }
`

// Balance display
export const BalanceDisplay = styled.div<{ $colorScheme?: any }>`
  background: linear-gradient(135deg,
    ${props => props.$colorScheme?.colors?.surface || 'rgba(24, 24, 24, 0.9)'},
    ${props => props.$colorScheme?.colors?.background || 'rgba(15, 15, 35, 0.95)'}
  );
  border: 1px solid ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.2)'};
  border-radius: 16px;
  padding: ${spacing.lg};
  margin-top: ${spacing.sm};
  backdrop-filter: blur(20px);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.3),
    0 0 0 1px ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.1)'},
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: ${fadeInUp} ${animations.duration.normal} ${animations.easing.easeOut};
  position: relative;
  overflow: hidden;

  ${media.maxMobile} {
    padding: ${spacing.base};
    border-radius: 12px;
    margin-top: ${spacing.xs};
  }

  /* Subtle shimmer effect */
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
      rgba(255, 215, 0, 0.03),
      transparent
    );
    animation: ${shimmer} 6s infinite;
  }

  p {
    margin: ${spacing.xs} 0;
    color: ${props => props.$colorScheme?.colors?.text || '#ffffff'};
    font-size: 0.95rem;
    position: relative;
    z-index: 1;

    ${media.maxMobile} {
      font-size: 0.9rem;
    }

    b {
      color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
      font-weight: 700;
      text-shadow: 0 0 8px ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.3)'};
    }
  }
`