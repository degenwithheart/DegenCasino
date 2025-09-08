import styled, { keyframes } from 'styled-components'

// Enhanced romantic serenade animations
export const loveLetterFloat = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-12px) rotate(2deg);
    opacity: 1;
  }
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }
`;

export const romanticPulse = keyframes`
  0% {
    box-shadow: 
      0 0 32px rgba(212, 165, 116, 0.4),
      0 0 64px rgba(184, 51, 106, 0.2),
      0 0 96px rgba(139, 90, 158, 0.1);
    border-color: rgba(212, 165, 116, 0.3);
  }
  50% {
    box-shadow: 
      0 0 48px rgba(212, 165, 116, 0.6),
      0 0 96px rgba(184, 51, 106, 0.4),
      0 0 128px rgba(139, 90, 158, 0.2);
    border-color: rgba(212, 165, 116, 0.6);
  }
  100% {
    box-shadow: 
      0 0 32px rgba(212, 165, 116, 0.4),
      0 0 64px rgba(184, 51, 106, 0.2),
      0 0 96px rgba(139, 90, 158, 0.1);
    border-color: rgba(212, 165, 116, 0.3);
  }
`;

export const candlestickSparkle = keyframes`
  0%, 100% { 
    opacity: 0; 
    transform: scale(0.8) rotate(0deg); 
  }
  50% { 
    opacity: 1; 
    transform: scale(1.2) rotate(180deg); 
  }
`;

export const dreamlikeFloat = keyframes`
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg); 
    opacity: 0.8;
  }
  33% { 
    transform: translateY(-8px) translateX(3px) rotate(1deg); 
    opacity: 1;
  }
  66% { 
    transform: translateY(5px) translateX(-2px) rotate(-1deg); 
    opacity: 0.9;
  }
`;

// Legacy exports for compatibility
export const neonPulse = romanticPulse;
export const sparkle = candlestickSparkle;
export const moveGradient = loveLetterFloat;

interface ContainerProps {
  $compact?: boolean;
  visible?: boolean;
  $theme?: any;
}
export const Container = styled.div<ContainerProps>`
  max-width: none;
  padding: ${({ $compact }) => ($compact ? '1.5rem' : '2.5rem')};
  margin: 2.5rem 0;
  border-radius: 20px;
  background: ${({ $theme }) => $theme?.patterns?.background || `
    radial-gradient(circle at 20% 80%, rgba(212, 165, 116, 0.08) 0%, transparent 50%), 
    radial-gradient(circle at 80% 20%, rgba(184, 51, 106, 0.08) 0%, transparent 50%),
    linear-gradient(135deg, rgba(10, 5, 17, 0.95) 0%, rgba(15, 8, 28, 0.9) 100%)
  `};
  border: 2px solid ${({ $theme }) => $theme?.colors?.border || 'rgba(212, 165, 116, 0.3)'};
  color: ${({ $theme }) => $theme?.colors?.text || '#f4e9e1'};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => (visible ? 'translateY(0)' : 'translateY(30px)')};
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  backdrop-filter: blur(16px);
  box-shadow: ${({ $theme }) => $theme?.effects?.shadow || '0 12px 40px rgba(10, 5, 17, 0.4)'};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ $theme }) => $theme?.patterns?.overlay || `
      linear-gradient(135deg, 
        rgba(212, 165, 116, 0.08) 0%, 
        rgba(184, 51, 106, 0.06) 50%, 
        rgba(139, 90, 158, 0.04) 100%
      )
    `};
    opacity: 0.6;
    border-radius: 18px;
    pointer-events: none;
  }

  &::after {
    content: '✨';
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 1.8rem;
    opacity: 0.7;
    animation: ${candlestickSparkle} 4s infinite ease-in-out;
    z-index: 1;
  }

  &:hover {
    border-color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
    box-shadow: ${({ $theme }) => $theme?.effects?.glow || '0 0 40px rgba(212, 165, 116, 0.3)'};
    transform: translateY(-6px);
    
    &::before {
      opacity: 0.8;
    }
  }

  @media (max-width: 900px) {
    margin: 2rem 0;
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }

  @media (max-width: 700px) {
    margin: 1.5rem 0;
    border-radius: 14px;
    padding: 1.75rem 1.25rem;
  }

  @media (max-width: 480px) {
    margin: 1rem 0;
    padding: 1.5rem 1rem;
    border-radius: 12px;
  }

  @media (max-width: 400px) {
    margin: 0.75rem 0;
    padding: 1.25rem 0.75rem;
    border-radius: 10px;
  }
`

export const HeaderSection = styled.div<{ $theme?: any }>`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;

  &::before {
    content: '💕';
    position: absolute;
    top: -15px;
    left: -15px;
    font-size: 2rem;
    opacity: 0.6;
    animation: ${loveLetterFloat} 6s infinite ease-in-out;
  }

  &::after {
    content: '🌹';
    position: absolute;
    bottom: -15px;
    right: -15px;
    font-size: 1.8rem;
    opacity: 0.7;
    animation: ${dreamlikeFloat} 8s infinite ease-in-out;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
    margin-bottom: 2.5rem;
    
    &::before, &::after {
      display: none;
    }
  }

  @media (max-width: 480px) {
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
`;

export const ProfileImage = styled.img<{ $theme?: any }>`
  width: 160px;
  height: 160px;
  border-radius: 16px;
  object-fit: cover;
  border: 3px solid ${({ $theme }) => $theme?.colors?.border || 'rgba(212, 165, 116, 0.4)'};
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
  box-shadow: ${({ $theme }) => $theme?.effects?.shadow || '0 12px 32px rgba(10, 5, 17, 0.4)'};
  background: ${({ $theme }) => $theme?.colors?.surface || 'rgba(212, 165, 116, 0.05)'};

  &:hover {
    border-color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
    box-shadow: ${({ $theme }) => $theme?.effects?.glow || '0 0 40px rgba(212, 165, 116, 0.4)'};
    transform: translateY(-4px) scale(1.03);
    filter: brightness(1.1) saturate(1.2);
  }

  @media (max-width: 768px) {
    width: 140px;
    height: 140px;
    border-radius: 14px;
  }

  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
    border-radius: 12px;
  }

  @media (max-width: 400px) {
    width: 100px;
    height: 100px;
    border-radius: 10px;
  }
`;

export const TextInfo = styled.div<{ $theme?: any }>`
  flex: 1;
  position: relative;
  z-index: 2;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
    font-family: ${({ $theme }) => $theme?.typography?.fontFamily || "'Libre Baskerville', 'DM Sans', Georgia, serif"};
    letter-spacing: 2.5px;
    text-shadow: ${({ $theme }) => $theme?.effects?.textGlow || '0 0 20px rgba(212, 165, 116, 0.6)'};
    position: relative;

    &::after {
      content: '🎭';
      position: absolute;
      top: -10px;
      right: -40px;
      font-size: 2rem;
      opacity: 0.7;
      animation: ${romanticPulse} 3s infinite ease-in-out;
    }
  }

  p {
    font-style: italic;
    color: ${({ $theme }) => $theme?.colors?.textSecondary || '#e8d5c4'};
    font-size: 1.25rem;
    line-height: 1.6;
    font-weight: 500;
    opacity: 0.95;
    text-shadow: ${({ $theme }) => $theme?.effects?.textGlow || '0 0 8px rgba(184, 51, 106, 0.3)'};
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
      letter-spacing: 2px;
      
      &::after {
        font-size: 1.8rem;
        right: -35px;
      }
    }
    p {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 2rem;
      letter-spacing: 1.5px;
      
      &::after {
        font-size: 1.6rem;
        right: -30px;
      }
    }
    p {
      font-size: 1rem;
    }
  }

  @media (max-width: 400px) {
    h1 {
      font-size: 1.75rem;
      letter-spacing: 1px;
      
      &::after {
        display: none;
      }
    }
    p {
      font-size: 0.95rem;
    }
  }
`;

export const SectionHeading = styled.h2<{ $theme?: any }>`
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
  font-family: ${({ $theme }) => $theme?.typography?.fontFamily || "'Libre Baskerville', 'DM Sans', Georgia, serif"};
  letter-spacing: 1.5px;
  position: relative;
  z-index: 2;
  text-shadow: ${({ $theme }) => $theme?.effects?.textGlow || '0 0 16px rgba(212, 165, 116, 0.5)'};

  &::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: ${({ $theme }) => $theme?.patterns?.gradient || 'linear-gradient(135deg, #d4a574, #b8336a)'};
    border-radius: 2px;
    box-shadow: ${({ $theme }) => $theme?.effects?.glow || '0 0 12px rgba(212, 165, 116, 0.4)'};
  }

  &::after {
    content: '🕯️';
    position: absolute;
    top: -5px;
    right: -35px;
    font-size: 1.4rem;
    opacity: 0.7;
    animation: ${loveLetterFloat} 5s infinite ease-in-out;
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-top: 2.5rem;
    letter-spacing: 1.2px;
    
    &::after {
      font-size: 1.2rem;
      right: -30px;
    }
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
    margin-top: 2rem;
    letter-spacing: 1px;
    
    &::after {
      display: none;
    }
  }

  @media (max-width: 400px) {
    font-size: 1.3rem;
    margin-top: 1.75rem;
    letter-spacing: 0.8px;
  }
`;

export const Content = styled.div<{ $theme?: any }>`
  line-height: 1.8;
  font-size: 1.1rem;
  margin-top: 1.5rem;
  position: relative;
  z-index: 2;

  p,
  ul {
    margin-bottom: 1.5rem;
    color: ${({ $theme }) => $theme?.colors?.textSecondary || '#e8d5c4'};
    font-weight: 500;
    opacity: 0.95;
  }

  a {
    color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
    text-decoration: none;
    transition: all 0.4s ease;
    position: relative;
    font-weight: 600;
    text-shadow: ${({ $theme }) => $theme?.effects?.textGlow || '0 0 8px rgba(212, 165, 116, 0.4)'};

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: ${({ $theme }) => $theme?.patterns?.gradient || 'linear-gradient(135deg, #d4a574, #b8336a)'};
      transition: width 0.4s ease;
    }

    &:hover {
      color: ${({ $theme }) => $theme?.colors?.accent || '#8b5a9e'};
      text-shadow: ${({ $theme }) => $theme?.effects?.textGlow || '0 0 12px rgba(139, 90, 158, 0.6)'};
      
      &::after {
        width: 100%;
      }
    }
  }

  strong {
    font-weight: 700;
    color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
    text-shadow: ${({ $theme }) => $theme?.effects?.textGlow || '0 0 8px rgba(212, 165, 116, 0.4)'};
  }

  em {
    font-style: italic;
    color: ${({ $theme }) => $theme?.colors?.accent || '#8b5a9e'};
    font-weight: 500;
    text-shadow: ${({ $theme }) => $theme?.effects?.textGlow || '0 0 6px rgba(139, 90, 158, 0.3)'};
  }

  @media (max-width: 768px) {
    font-size: 1.05rem;
    line-height: 1.7;

    p, ul {
      margin-bottom: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    line-height: 1.6;
    margin-top: 1rem;

    p, ul {
      margin-bottom: 1rem;
    }
  }

  @media (max-width: 400px) {
    font-size: 0.95rem;
    line-height: 1.5;

    p, ul {
      margin-bottom: 0.9rem;
    }
  }
`
