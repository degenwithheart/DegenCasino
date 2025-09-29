import styled, { keyframes } from 'styled-components'
import { spacing, components, animations, media } from '../breakpoints'

// TikTok/Instagram style animations
const bonusGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(162, 89, 255, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(162, 89, 255, 0.4);
  }
`

const sparkle = keyframes`
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 1;
  }
`

const shimmer = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`

// Clean bonus header
export const HeaderSection = styled.div<{ $colorScheme?: any }>`
  text-align: center;
  margin-bottom: ${spacing.xl};
  position: relative;
  padding: ${spacing.lg};
  background: linear-gradient(135deg,
    ${props => props.$colorScheme?.colors?.surface || 'rgba(24, 24, 24, 0.9)'},
    ${props => props.$colorScheme?.colors?.background || 'rgba(15, 15, 35, 0.95)'}
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
    content: '💰';
    position: absolute;
    top: -15px;
    right: 20%;
    font-size: 2.5rem;
    animation: ${sparkle} 2s ease-in-out infinite;
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
  animation: ${bonusGlow} 2s ease-in-out infinite;

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

// Modern bonus amount display
export const BonusAmount = styled.div<{ $colorScheme?: any }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.lg};
  background: linear-gradient(135deg,
    ${props => props.$colorScheme?.colors?.surface || 'rgba(24, 24, 24, 0.9)'},
    ${props => props.$colorScheme?.colors?.background || 'rgba(15, 15, 35, 0.95)'}
  );
  border: 2px solid ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.5)'};
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow:
    0 12px 24px rgba(0, 0, 0, 0.3),
    0 0 0 1px ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.1)'},
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  animation: ${bonusGlow} 3s ease-in-out infinite;

  ${media.maxMobile} {
    padding: ${spacing.base};
    border-radius: 16px;
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
      rgba(255, 215, 0, 0.1),
      transparent
    );
    animation: shimmer 3s infinite;
  }

  /* Sparkle decorations */
  &::after {
    content: '✨💎✨';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.2rem;
    opacity: 0.8;
    animation: ${sparkle} 2s ease-in-out infinite;
  }
`

// Clean feature list
export const FeatureList = styled.ul<{ $colorScheme?: any }>`
  background: ${props => props.$colorScheme?.colors?.surface || 'rgba(24, 24, 24, 0.8)'};
  border: 1px solid ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.2)'};
  border-radius: 16px;
  padding: ${spacing.lg};
  margin: ${spacing.lg} 0;
  list-style: none;
  backdrop-filter: blur(10px);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  ${media.maxMobile} {
    padding: ${spacing.base};
    border-radius: 12px;
    margin: ${spacing.base} 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
    padding: ${spacing.sm} 0;
    color: ${props => props.$colorScheme?.colors?.text || '#ffffff'};
    font-size: 0.95rem;
    line-height: 1.4;

    ${media.maxMobile} {
      font-size: 0.9rem;
      gap: ${spacing.xs};
    }

    &::before {
      content: '✨';
      font-size: 1.1rem;
      flex-shrink: 0;
      animation: ${sparkle} 2s ease-in-out infinite;
    }
  }
`
