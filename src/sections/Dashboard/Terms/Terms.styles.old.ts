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
export const moveGradient = loveLetterFloat;
export const sparkle = candlestickSparkle;

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

  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: ${(props) => (props.visible ? 'translateY(0)' : 'translateY(30px)')};
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || '#f4e9e1'};
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
    margin: 2rem 0;
    padding: ${({ $compact }) => ($compact ? '1rem' : '2rem')};
    border-radius: 16px;
  }

  @media (max-width: 700px) {
    margin: 1.5rem 0;
    padding: ${({ $compact }) => ($compact ? '0.75rem' : '1.5rem')};
    border-radius: 14px;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    margin: 1rem 0;
    border-radius: 12px;
  }

  @media (max-width: 400px) {
    padding: 1.25rem 0.75rem;
    margin: 0.75rem 0;
    border-radius: 10px;
  }
`;

export const Title = styled.h1<{ $colorScheme?: any }>`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'};
  font-family: ${({ $colorScheme }) => $colorScheme?.typography?.fontFamily || "'Libre Baskerville', 'DM Sans', Georgia, serif"};
  letter-spacing: 2.5px;
  text-align: center;
  text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 20px rgba(212, 165, 116, 0.6)'};
  position: relative;
  z-index: 2;

  &::before {
    content: '⚖️';
    position: absolute;
    top: -10px;
    left: -50px;
    font-size: 2.2rem;
    opacity: 0.7;
    animation: ${candlestickSparkle} 4s infinite ease-in-out;
  }

  &::after {
    content: '✨';
    position: absolute;
    top: -10px;
    right: -50px;
    font-size: 2rem;
    opacity: 0.6;
    animation: ${dreamlikeFloat} 5s infinite ease-in-out;
  }

  @media (max-width: 600px) {
    font-size: 2rem;
    letter-spacing: 1.5px;
    
    &::before, &::after {
      display: none;
    }
  }

  @media (max-width: 400px) {
    font-size: 1.75rem;
    letter-spacing: 1px;
  }
`;

export const Subtitle = styled.p<{ $colorScheme?: any }>`
  font-style: italic;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#e8d5c4'};
  margin-bottom: 2.5rem;
  font-size: 1.25rem;
  text-align: center;
  font-weight: 500;
  opacity: 0.95;
  text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 8px rgba(184, 51, 106, 0.3)'};
  position: relative;
  z-index: 2;

  @media (max-width: 600px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 400px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`

export const Selector = styled.div<{ $colorScheme?: any }>`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;

  label {
    font-weight: 700;
    font-size: 1.2rem;
    white-space: nowrap;
    color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'};
    text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 8px rgba(212, 165, 116, 0.4)'};
  }

  button {
    cursor: pointer;
    background: linear-gradient(
      135deg,
      var(--love-letter-gold) 0%,
      var(--deep-crimson-rose) 50%,
      var(--soft-purple-twilight) 100%
    ) !important;
    border: 1px solid rgba(212, 165, 116, 0.4) !important;
    border-radius: 16px !important;
    padding: 0.8rem 1.5rem !important;
    font-size: 1.1rem !important;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--deep-romantic-night) !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    box-shadow: 
      0 8px 24px rgba(10, 5, 17, 0.4),
      0 4px 12px rgba(212, 165, 116, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(10px) !important;
    font-weight: 600;

    &:hover {
      transform: translateY(-2px) scale(1.05) !important;
      box-shadow: 
        0 12px 32px rgba(10, 5, 17, 0.5),
        0 6px 16px rgba(212, 165, 116, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
    }

    &:active {
      transform: translateY(-1px) scale(1.02) !important;
      transition: all 0.2s ease !important;
    }

    &.active {
      background: linear-gradient(135deg, #d4a574, #b8336a) !important;
      color: #0a0511 !important;
      font-weight: 700;
      border-color: #d4a574 !important;
      box-shadow: 0 0 32px rgba(212, 165, 116, 0.5) !important;
      transform: translateY(-2px);
      text-shadow: none;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
    
    label {
      font-size: 1.1rem;
    }
    
    button {
      font-size: 1rem;
      padding: 0.7rem 1.2rem;
      border-radius: 10px;
    }
  }

  @media (max-width: 400px) {
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

export const SectionHeading = styled.h2<{ $colorScheme?: any }>`
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'};
  font-family: ${({ $colorScheme }) => $colorScheme?.typography?.fontFamily || "'Libre Baskerville', 'DM Sans', Georgia, serif"};
  letter-spacing: 1.5px;
  position: relative;
  z-index: 2;
  text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 16px rgba(212, 165, 116, 0.5)'};

  &::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: ${({ $colorScheme }) => $colorScheme?.patterns?.gradient || 'linear-gradient(135deg, #d4a574, #b8336a)'};
    border-radius: 2px;
    box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.glow || '0 0 12px rgba(212, 165, 116, 0.4)'};
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

  @media (max-width: 600px) {
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

export const Content = styled.div<{ $colorScheme?: any }>`
  line-height: 1.8;
  font-size: 1.1rem;
  margin-top: 1.5rem;
  position: relative;
  z-index: 2;

  p,
  ul {
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
      }
    }
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

  @media (max-width: 600px) {
    font-size: 1.05rem;
    line-height: 1.7;
    margin-top: 1rem;
    
    p, ul {
      margin-bottom: 1.25rem;
    }
    
    ul {
      padding-left: 1.25rem;
    }
  }

  @media (max-width: 400px) {
    font-size: 1rem;
    line-height: 1.6;
    
    p, ul {
      margin-bottom: 1rem;
    }
    
    ul {
      padding-left: 1rem;
    }
  }
`;

export const Flag = styled.span`
  font-size: 1.5rem;
  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;
