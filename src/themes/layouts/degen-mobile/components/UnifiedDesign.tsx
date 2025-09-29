import styled, { keyframes } from 'styled-components';
import { spacing, animations, media } from '../breakpoints';

// TikTok/Instagram inspired animations
export const gracefulFloat = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

export const shimmerEffect = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

export const pulseGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% { 
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(162, 89, 255, 0.4);
  }
`;

export const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Modern TikTok/Instagram container
export const UnifiedPageContainer = styled.div<{ $colorScheme?: any }>`
  max-width: 900px;
  margin: 0 auto;
  padding: ${spacing.xl};
  min-height: calc(100vh - 200px);
  
  background: linear-gradient(135deg,
    rgba(24, 24, 24, 0.95),
    rgba(15, 15, 35, 0.98),
    rgba(10, 10, 25, 0.95)
  );
  
  border-radius: 24px;
  border: 1px solid ${props => props.$colorScheme?.colors?.primary || '#ffd700'}30;
  backdrop-filter: blur(20px);
  
  /* Modern glassmorphism effect */
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 8px 32px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}20,
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  /* Gradient border effect */
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      ${props => props.$colorScheme?.colors?.primary || '#ffd700'},
      ${props => props.$colorScheme?.colors?.accent || '#a259ff'},
      ${props => props.$colorScheme?.colors?.primary || '#ffd700'}
    );
    border-radius: 24px 24px 0 0;
  }

  ${media.maxMobile} {
    margin: ${spacing.base};
    padding: ${spacing.lg};
    border-radius: 20px;
    min-height: calc(100vh - 150px);
    
    &::before {
      border-radius: 20px 20px 0 0;
    }
  }

  ${media.tablet} {
    padding: ${spacing['3xl']};
  }
`;

// Enhanced page title with TikTok styling
export const UnifiedPageTitle = styled.h1<{ $colorScheme?: any }>`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin: 0 0 ${spacing['3xl']} 0;
  
  background: linear-gradient(135deg,
    ${props => props.$colorScheme?.colors?.primary || '#ffd700'} 0%,
    ${props => props.$colorScheme?.colors?.accent || '#a259ff'} 50%,
    ${props => props.$colorScheme?.colors?.primary || '#ffd700'} 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  animation: ${gradientMove} 3s ease infinite;
  text-shadow: 0 0 40px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}40;
  
  /* Shimmer effect overlay */
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: ${shimmerEffect} 2s ease-in-out infinite;
    background-size: 200px 100%;
  }

  ${media.maxMobile} {
    font-size: 2rem;
    margin-bottom: ${spacing.xl};
  }

  ${media.tablet} {
    font-size: 3rem;
  }
`;

// Modern section container
export const UnifiedSection = styled.section<{ 
  title?: string; 
  $colorScheme?: any;
  $highlight?: boolean;
}>`
  margin-bottom: ${spacing['3xl']};
  
  ${props => props.title && `
    &::before {
      content: '${props.title}';
      display: block;
      font-size: 1.3rem;
      font-weight: 700;
      color: ${props.$colorScheme?.colors?.primary || '#ffd700'};
      margin-bottom: ${spacing.base};
      padding-bottom: ${spacing.sm};
      border-bottom: 2px solid ${props.$colorScheme?.colors?.primary || '#ffd700'}30;
      text-shadow: 0 0 10px ${props.$colorScheme?.colors?.primary || '#ffd700'}50;
    }
  `}
  
  ${props => props.$highlight && `
    padding: ${spacing.xl};
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.02)
    );
    border-radius: 16px;
    border: 1px solid ${props.$colorScheme?.colors?.primary || '#ffd700'}20;
    backdrop-filter: blur(10px);
    animation: ${pulseGlow} 3s ease-in-out infinite;
  `}

  ${media.maxMobile} {
    margin-bottom: ${spacing.xl};
    
    ${props => props.title && `
      &::before {
        font-size: 1.1rem;
        margin-bottom: ${spacing.sm};
      }
    `}
    
    ${props => props.$highlight && `
      padding: ${spacing.lg};
      border-radius: 12px;
    `}
  }
`;

// Elegant card component
export const UnifiedCard = styled.div<{ $colorScheme?: any; $interactive?: boolean }>`
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.03)
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: ${spacing.xl};
  backdrop-filter: blur(15px);
  position: relative;
  
  /* Gradient accent line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      ${props => props.$colorScheme?.colors?.primary || '#ffd700'},
      ${props => props.$colorScheme?.colors?.accent || '#a259ff'}
    );
    border-radius: 16px 16px 0 0;
  }

  ${props => props.$interactive && `
    transition: all ${animations.duration.fast} ${animations.easing.easeOut};
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      background: linear-gradient(135deg,
        rgba(255, 255, 255, 0.12),
        rgba(255, 255, 255, 0.06)
      );
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
      border-color: ${props.$colorScheme?.colors?.primary || '#ffd700'}40;
    }
  `}

  ${media.maxMobile} {
    padding: ${spacing.lg};
    border-radius: 12px;
    
    &::before {
      border-radius: 12px 12px 0 0;
    }
  }
`;

// Button with TikTok styling
export const UnifiedButton = styled.button<{ 
  $variant?: 'primary' | 'secondary' | 'ghost';
  $colorScheme?: any;
  $size?: 'small' | 'medium' | 'large';
}>`
  padding: ${props => {
    switch (props.$size) {
      case 'small': return `${spacing.sm} ${spacing.base}`;
      case 'large': return `${spacing.lg} ${spacing['2xl']}`;
      default: return `${spacing.base} ${spacing.xl}`;
    }
  }};
  
  border-radius: 12px;
  font-weight: 600;
  font-size: ${props => props.$size === 'small' ? '0.9rem' : '1rem'};
  border: none;
  cursor: pointer;
  transition: all ${animations.duration.fast} ${animations.easing.easeOut};
  position: relative;
  overflow: hidden;
  
  ${props => {
    const primary = props.$colorScheme?.colors?.primary || '#ffd700';
    const accent = props.$colorScheme?.colors?.accent || '#a259ff';
    
    switch (props.$variant) {
      case 'secondary':
        return `
          background: transparent;
          border: 2px solid ${primary};
          color: ${primary};
          
          &:hover {
            background: ${primary}20;
            box-shadow: 0 4px 15px ${primary}30;
          }
        `;
      case 'ghost':
        return `
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          
          &:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, ${primary}, ${accent});
          color: #000;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          }
          
          &:active {
            transform: translateY(0);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  ${media.maxMobile} {
    padding: ${props => props.$size === 'large' ? `${spacing.base} ${spacing.xl}` : `${spacing.sm} ${spacing.base}`};
    font-size: 0.9rem;
  }
`;

// Text components
export const UnifiedText = styled.p<{ 
  $variant?: 'body' | 'caption' | 'lead';
  $colorScheme?: any;
}>`
  margin: 0 0 ${spacing.base} 0;
  line-height: 1.6;
  
  ${props => {
    switch (props.$variant) {
      case 'caption':
        return `
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        `;
      case 'lead':
        return `
          font-size: 1.1rem;
          color: ${props.$colorScheme?.colors?.primary || '#ffd700'};
          font-weight: 600;
          text-shadow: 0 0 6px ${props.$colorScheme?.colors?.primary || '#ffd700'}30;
        `;
      default:
        return `
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
        `;
    }
  }}

  ${media.maxMobile} {
    font-size: ${props => props.$variant === 'lead' ? '1rem' : '0.9rem'};
  }
`;

// Flex utilities
export const FlexRow = styled.div<{ $gap?: string; $justify?: string; $align?: string }>`
  display: flex;
  gap: ${props => props.$gap || spacing.base};
  justify-content: ${props => props.$justify || 'flex-start'};
  align-items: ${props => props.$align || 'center'};
  flex-wrap: wrap;

  ${media.maxMobile} {
    gap: ${spacing.sm};
  }
`;

export const FlexColumn = styled.div<{ $gap?: string; $align?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.$gap || spacing.base};
  align-items: ${props => props.$align || 'stretch'};
`;