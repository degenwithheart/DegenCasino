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
  $theme?: any;
}
export const Container = styled.div<ContainerProps>`
  max-width: 100vw;
  padding: ${({ $compact }) => ($compact ? '1rem' : '2rem')};
  margin: 2rem 0;
  border-radius: 16px;
  background: ${({ $theme }) => $theme?.patterns?.background || 'linear-gradient(135deg, #0a0511 0%, #1a0b2e 50%, #2d1b4e 100%)'};
  border: 2px solid ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
  color: ${({ $theme }) => $theme?.colors?.textPrimary || '#e8d5c4'};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => (visible ? 'translateY(0)' : 'translateY(20px)')};
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ $theme }) => $theme?.patterns?.overlay || 'radial-gradient(circle at 30% 20%, rgba(212, 165, 116, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(184, 54, 106, 0.1) 0%, transparent 50%)'};
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: ${({ $theme }) => $theme?.patterns?.borderGlow || 'linear-gradient(45deg, #d4a574, #b8336a, #8b5a9e, #d4a574)'};
    border-radius: 18px;
    z-index: -1;
    opacity: 0.3;
    animation: ${romanticPulse} 4s ease-in-out infinite;
  }

  &:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: ${({ $theme }) => $theme?.effects?.glow || '0 20px 60px rgba(212, 165, 116, 0.3), 0 0 100px rgba(184, 54, 106, 0.2)'};
  }

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

export const Tabs = styled.div<{ $theme?: any }>`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;

  button {
    background: ${({ $theme }) => $theme?.patterns?.glassmorphism || 'rgba(26, 11, 46, 0.8)'};
    backdrop-filter: blur(10px);
    border: 2px solid ${({ $theme }) => $theme?.colors?.accent || '#8b5a9e'};
    color: ${({ $theme }) => $theme?.colors?.textSecondary || '#e8d5c4'};
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    font-family: 'Luckiest Guy', cursive;
    font-size: 1rem;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: ${({ $theme }) => $theme?.patterns?.gradient || 'linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.3), transparent)'};
      transition: left 0.5s ease;
    }

    &:hover {
      border-color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
      box-shadow: ${({ $theme }) => $theme?.effects?.glow || '0 0 20px rgba(212, 165, 116, 0.4), 0 0 40px rgba(184, 54, 106, 0.2)'};
      transform: translateY(-2px);
      color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};

      &::before {
        left: 100%;
      }
    }

    &.active {
      background: ${({ $theme }) => $theme?.patterns?.gradient || 'linear-gradient(135deg, #d4a574, #b8336a)'};
      color: ${({ $theme }) => $theme?.colors?.background || '#0a0511'};
      border-color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
      box-shadow: ${({ $theme }) => $theme?.effects?.glow || '0 0 30px rgba(212, 165, 116, 0.6), 0 0 60px rgba(184, 54, 106, 0.4)'};
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

export const Section = styled.section<{ $theme?: any }>`
  line-height: 1.8;
  font-size: 1.1rem;
  position: relative;
  z-index: 2;

  h1 {
    font-family: 'Luckiest Guy', cursive;
    font-size: 3rem;
    margin-bottom: 0.5rem;
    color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
    text-shadow: ${({ $theme }) => $theme?.effects?.textGlow || '0 0 20px rgba(212, 165, 116, 0.6)'};
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
    color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
    text-shadow: ${({ $theme }) => $theme?.effects?.textGlow || '0 0 15px rgba(212, 165, 116, 0.5)'};
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${({ $theme }) => $theme?.colors?.accent || '#8b5a9e'};
    position: relative;
    animation: ${dreamlikeFloat} 5s ease-in-out infinite;

    &::before {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: ${({ $theme }) => $theme?.patterns?.gradient || 'linear-gradient(90deg, #d4a574, #b8336a, #8b5a9e)'};
      transition: width 0.8s ease;
    }

    &:hover::before {
      width: 100%;
    }
  }

  p, ul {
    margin-bottom: 1.5rem;
    color: ${({ $theme }) => $theme?.colors?.textSecondary || '#e8d5c4'};
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
    color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
    text-shadow: ${({ $theme }) => $theme?.effects?.textGlow || '0 0 8px rgba(212, 165, 116, 0.4)'};
  }

  em {
    font-style: italic;
    color: ${({ $theme }) => $theme?.colors?.accent || '#8b5a9e'};
    font-weight: 500;
    text-shadow: ${({ $theme }) => $theme?.effects?.textGlow || '0 0 6px rgba(139, 90, 158, 0.3)'};
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
