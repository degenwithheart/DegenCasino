import styled, { keyframes } from 'styled-components';
import type { GlobalColorScheme } from '../../themes/globalColorSchemes';

// Elegant animations from Credits page
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
    box-shadow: 0 0 20px rgba(212, 165, 116, 0.3);
  }
  50% { 
    box-shadow: 0 0 30px rgba(212, 165, 116, 0.6), 0 0 60px rgba(184, 51, 106, 0.4);
  }
`;

export const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Shared container for all pages
export const UnifiedPageContainer = styled.div<{ $colorScheme?: GlobalColorScheme; }>`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 200px);
  
  background: linear-gradient(135deg, 
    rgba(10, 5, 17, 0.95) 0%,
    rgba(25, 15, 35, 0.98) 50%,
    rgba(15, 8, 22, 0.95) 100%
  );
  
  border-radius: 20px;
  border: 1px solid rgba(212, 165, 116, 0.3);
  backdrop-filter: blur(20px);
  
  /* Romantic glassmorphism effect */
  box-shadow: 
    0 20px 60px rgba(139, 90, 158, 0.15),
    0 8px 32px rgba(212, 165, 116, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  /* Elegant border animation */
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      transparent 30%, 
      rgba(212, 165, 116, 0.1) 50%, 
      transparent 70%
    );
    background-size: 200% 200%;
    animation: ${gradientMove} 8s ease-in-out infinite;
    pointer-events: none;
    border-radius: 20px;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 15px;
  }
`;

// Shared page title
export const UnifiedPageTitle = styled.h1<{ $colorScheme?: GlobalColorScheme; }>`
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  
  background: linear-gradient(135deg, 
    ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'} 0%,
    ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'} 50%,
    ${({ $colorScheme }) => $colorScheme?.colors?.accent || '#ff00cc'} 100%
  );
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientMove} 6s ease-in-out infinite;
  
  text-shadow: 0 0 30px rgba(212, 165, 116, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

// Shared subtitle
export const UnifiedSubtitle = styled.p<{ $colorScheme?: GlobalColorScheme; }>`
  text-align: center;
  font-size: 1.2rem;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || 'rgba(255, 255, 255, 0.8)'};
  margin-bottom: 3rem;
  font-style: italic;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
`;

// Shared section container
export const UnifiedSection = styled.section<{ $colorScheme?: GlobalColorScheme; }>`
  margin-bottom: 3rem;
  padding: 2rem;
  
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 165, 116, 0.2);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  
  transition: all 0.3s ease;
  /* Removed floating animation */
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(212, 165, 116, 0.4);
    box-shadow: 0 15px 40px rgba(139, 90, 158, 0.2);
  }
  
  /* Removed animation delays */

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
`;

// Shared section title
export const UnifiedSectionTitle = styled.h2<{ $colorScheme?: GlobalColorScheme; }>`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
  
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    width: 4px;
    height: 30px;
    background: linear-gradient(180deg, 
      ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'} 0%,
      ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'} 100%
    );
    border-radius: 2px;
    animation: ${pulseGlow} 3s ease-in-out infinite;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// Shared content text
export const UnifiedContent = styled.div<{ $colorScheme?: GlobalColorScheme; }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || '#fff'};
  line-height: 1.6;
  font-size: 1rem;
  
  p {
    margin-bottom: 1rem;
    color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || 'rgba(255, 255, 255, 0.9)'};
  }
  
  ul, ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || 'rgba(255, 255, 255, 0.8)'};
    }
  }
  
  strong {
    color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
    font-weight: 600;
  }
  
  a {
    color: ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'};
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all 0.3s ease;
    
    &:hover {
      border-bottom-color: ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'};
      text-shadow: 0 0 8px ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'};
    }
  }
`;

// Shared button style
export const UnifiedButton = styled.button<{ $colorScheme?: GlobalColorScheme; $variant?: 'primary' | 'secondary'; }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  background: ${({ $variant, $colorScheme }) =>
    $variant === 'secondary'
      ? 'rgba(255, 255, 255, 0.1)'
      : `linear-gradient(135deg, ${$colorScheme?.colors?.primary || '#ffd700'} 0%, ${$colorScheme?.colors?.secondary || '#a259ff'} 100%)`
  };
  
  color: ${({ $variant, $colorScheme }) =>
    $variant === 'secondary'
      ? $colorScheme?.colors?.text || '#fff'
      : '#000'
  };
  
  border: 1px solid ${({ $variant }) =>
    $variant === 'secondary'
      ? 'rgba(212, 165, 116, 0.3)'
      : 'transparent'
  };
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212, 165, 116, 0.3);
    
    ${({ $variant }) => $variant === 'secondary' && `
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(212, 165, 116, 0.5);
    `}
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

// Shared grid layout
export const UnifiedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

// Special highlight section
export const UnifiedHighlightSection = styled.div<{ $colorScheme?: GlobalColorScheme; }>`
  text-align: center;
  padding: 3rem 2rem;
  margin: 2rem 0;
  
  background: linear-gradient(135deg, 
    rgba(212, 165, 116, 0.1) 0%,
    rgba(184, 51, 106, 0.08) 50%,
    rgba(139, 90, 158, 0.1) 100%
  );
  
  border-radius: 15px;
  border: 1px solid rgba(212, 165, 116, 0.3);
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;