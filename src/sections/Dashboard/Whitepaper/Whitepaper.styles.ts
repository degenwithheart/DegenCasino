import styled, { keyframes } from 'styled-components'

// Romantic Serenade Animations
export const loveLetterFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-8px) rotate(1deg); }
  66% { transform: translateY(-4px) rotate(-1deg); }
`;

export const romanticPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(212, 165, 116, 0.3), 0 0 40px rgba(184, 54, 106, 0.2);
    border-color: rgba(212, 165, 116, 0.4);
  }
  50% { 
    box-shadow: 0 0 40px rgba(212, 165, 116, 0.6), 0 0 80px rgba(184, 54, 106, 0.4);
    border-color: rgba(212, 165, 116, 0.8);
  }
`;

export const candlestickSparkle = keyframes`
  0%, 100% { 
    opacity: 0.6; 
    transform: scale(1) rotate(0deg);
  }
  50% { 
    opacity: 1; 
    transform: scale(1.1) rotate(180deg);
  }
`;

export const dreamlikeFloat = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-3px) translateX(2px); }
  50% { transform: translateY(-6px) translateX(-1px); }
  75% { transform: translateY(-3px) translateX(1px); }
`;

const SIDEBAR_WIDTH = 80;
interface ContainerProps {
  $compact?: boolean;
  visible?: boolean;
  $colorScheme?: any;
}
export const Container = styled.div<ContainerProps>`
  max-width: none; /* Let main handle max-width */
  margin: 2rem 0; /* Only vertical margins */
  padding: ${({ $compact }) => ($compact ? '2rem' : '3rem')};
  
  /* Romantic glassmorphism background */
  background: rgba(10, 5, 17, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid rgba(212, 165, 116, 0.18);
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Love letter paper texture */
  box-shadow: 
    0 8px 32px rgba(139, 90, 158, 0.15),
    0 0 40px rgba(212, 165, 116, 0.08),
    inset 0 1px 2px rgba(244, 233, 225, 0.05);

  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => (visible ? 'translateY(0)' : 'translateY(20px)')};
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textPrimary || '#e8d5c4'};
  overflow: hidden;

  &:hover {
    border-color: rgba(212, 165, 116, 0.4);
    box-shadow: 
      0 12px 48px rgba(139, 90, 158, 0.2),
      0 0 60px rgba(212, 165, 116, 0.15),
      inset 0 1px 4px rgba(244, 233, 225, 0.08);
    transform: translateY(-4px);
  }

  /* Romantic atmosphere overlay */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: 
      radial-gradient(circle at 20% 80%, rgba(212, 165, 116, 0.04) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(184, 51, 106, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(139, 90, 158, 0.02) 0%, transparent 60%);
    pointer-events: none;
    z-index: -1;
  }

  /* Candlestick constellation effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(1px 1px at 15% 25%, rgba(212, 165, 116, 0.2), transparent),
      radial-gradient(1px 1px at 85% 75%, rgba(184, 51, 106, 0.15), transparent),
      radial-gradient(1px 1px at 55% 15%, rgba(139, 90, 158, 0.15), transparent);
    background-size: 150px 150px, 200px 200px, 175px 175px;
    animation: ${dreamlikeFloat} 20s infinite ease-in-out;
    pointer-events: none;
    border-radius: 16px;

  @media (max-width: 900px) {
    margin: 1rem 0;
    padding: ${({ $compact }) => ($compact ? '0.5rem' : '1.5rem')};
  }

  @media (max-width: 700px) {
    margin: 1rem 0;
    padding: ${({ $compact }) => ($compact ? '0.5rem' : '1rem')};
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
    margin: 0.5rem 0;
  }

  @media (max-width: 400px) {
    padding: 0.75rem 0.5rem;
    margin: 0.25rem 0;
    border-radius: 12px;
  }
`;

export const Tabs = styled.div<{ $colorScheme?: any }>`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;

  button {
    background: linear-gradient(
      135deg,
      var(--love-letter-gold) 0%,
      var(--deep-crimson-rose) 50%,
      var(--soft-purple-twilight) 100%
    ) !important;
    border: 1px solid rgba(212, 165, 116, 0.4) !important;
    border-radius: 16px !important;
    padding: 0.75rem 1.5rem !important;
    font-weight: 600 !important;
    font-size: 1rem !important;
    color: var(--deep-romantic-night) !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    box-shadow: 
      0 8px 24px rgba(10, 5, 17, 0.4),
      0 4px 12px rgba(212, 165, 116, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(10px) !important;
    font-family: 'Luckiest Guy', cursive;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.3), transparent);
      transition: left 0.5s ease;
    }

    &:hover {
      transform: translateY(-2px) scale(1.05) !important;
      box-shadow: 
        0 12px 32px rgba(10, 5, 17, 0.5),
        0 6px 16px rgba(212, 165, 116, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;

      &::before {
        left: 100%;
      }
    }

    &:active {
      transform: translateY(-1px) scale(1.02) !important;
      transition: all 0.2s ease !important;
    }

    &.active {
      background: linear-gradient(135deg, #d4a574, #b8336a) !important;
      color: #0a0511 !important;
      border-color: #d4a574 !important;
      box-shadow: 0 0 30px rgba(212, 165, 116, 0.6), 0 0 60px rgba(184, 54, 106, 0.4) !important;
      animation: ${loveLetterFloat} 3s ease-in-out infinite;
    }
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    button {
      font-size: 0.85rem;
      padding: 0.6rem 1rem;
    }
  }
`

export const Section = styled.section<{ $colorScheme?: any }>`
  line-height: 1.8;
  font-size: 1.1rem;
  position: relative;
  z-index: 2;

  h1 {
    font-family: 'Luckiest Guy', cursive;
    font-size: 3rem;
    margin-bottom: 0.5rem;
    color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'};
    text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 20px rgba(212, 165, 116, 0.6)'};
    animation: ${loveLetterFloat} 4s ease-in-out infinite;
    text-align: center;
    position: relative;

    &::before {
      content: '📖';
      position: absolute;
      left: -60px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 2rem;
      opacity: 0.8;
      animation: ${candlestickSparkle} 3s ease-in-out infinite;
    }

    &::after {
      content: '📖';
      position: absolute;
      right: -60px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 2rem;
      opacity: 0.8;
      animation: ${candlestickSparkle} 3s ease-in-out infinite 1.5s;
    }
  }

  h2 {
    font-family: 'Luckiest Guy', cursive;
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
    color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'};
    text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 15px rgba(212, 165, 116, 0.5)'};
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.accent || '#8b5a9e'};
    position: relative;
    animation: ${dreamlikeFloat} 5s ease-in-out infinite;

    &::before {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: ${({ $colorScheme }) => $colorScheme?.patterns?.gradient || 'linear-gradient(90deg, #d4a574, #b8336a, #8b5a9e)'};
      transition: width 0.8s ease;
    }

    &:hover::before {
      width: 100%;
    }
  }

  p, ul {
    margin-bottom: 1.5rem;
    color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#e8d5c4'};
    font-weight: 500;
    opacity: 0.95;
  }

  ul {
    padding-left: 1.5rem;
    list-style-type: none;
    
    li {
      position: relative;
      margin-bottom: 0.75rem;
      
      &::before {
        content: '💎';
        position: absolute;
        left: -1.5rem;
        top: 0;
        font-size: 0.9rem;
        opacity: 0.7;
        animation: ${candlestickSparkle} 2s ease-in-out infinite;
      }
    }
  }

  strong {
    font-weight: 700;
    color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'};
    text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 8px rgba(212, 165, 116, 0.4)'};
  }

  em {
    font-style: italic;
    color: ${({ $colorScheme }) => $colorScheme?.colors?.accent || '#8b5a9e'};
    font-weight: 500;
    text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 6px rgba(139, 90, 158, 0.3)'};
  }

  a {
    color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'};
    text-decoration: none;
    transition: all 0.4s ease;
    position: relative;
    font-weight: 600;
    text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 8px rgba(212, 165, 116, 0.4)'};

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: ${({ $colorScheme }) => $colorScheme?.patterns?.gradient || 'linear-gradient(135deg, #d4a574, #b8336a)'};
      transition: width 0.4s ease;
    }

    &:hover {
      color: ${({ $colorScheme }) => $colorScheme?.colors?.accent || '#8b5a9e'};
      text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 12px rgba(139, 90, 158, 0.6)'};
      
      &::after {
        width: 100%;
      }
    }
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.7;

    h1 {
      font-size: 2.5rem;
      
      &::before, &::after {
        display: none;
      }
    }

    h2 {
      font-size: 1.8rem;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.5rem;
    }
  }
`
