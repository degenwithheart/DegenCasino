import styled, { keyframes } from "styled-components";

export const loveLetterFloat = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(1deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
`;

export const romanticPulse = keyframes`
  0% {
    box-shadow: 
      0 0 32px rgba(212, 165, 116, 0.4),
      0 0 64px rgba(184, 51, 106, 0.2);
    border-color: rgba(212, 165, 116, 0.3);
  }
  50% {
    box-shadow: 
      0 0 48px rgba(212, 165, 116, 0.6),
      0 0 96px rgba(184, 51, 106, 0.4);
    border-color: rgba(212, 165, 116, 0.5);
  }
  100% {
    box-shadow: 
      0 0 32px rgba(212, 165, 116, 0.4),
      0 0 64px rgba(184, 51, 106, 0.2);
    border-color: rgba(212, 165, 116, 0.3);
  }
`;

export const dreamlikeFadeInOut = keyframes`
  0% { opacity: 0; transform: translateY(10px) scale(0.95);}
  10% { opacity: 1; transform: translateY(0) scale(1);}
  90% { opacity: 1; transform: translateY(0) scale(1);}
  100% { opacity: 0; transform: translateY(-10px) scale(0.95);}
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

// Keep old exports for compatibility
export const floatAnimation = loveLetterFloat;
export const neonPulse = romanticPulse;
export const fadeInOut = dreamlikeFadeInOut;
export const sparkle = candlestickSparkle;

export const Container = styled.div<{ $isVisible: boolean; $isLoading: boolean; $colorScheme?: any }>`
  margin: ${({ $isVisible, $isLoading }) =>
    $isLoading || $isVisible ? '2rem 0' : '0'
  };
  padding: ${({ $isVisible, $isLoading }) =>
    $isLoading || $isVisible ? '1.5rem' : '0'
  };
  height: ${({ $isVisible, $isLoading }) =>
    $isLoading || $isVisible ? 'auto' : '0'
  };
  overflow: ${({ $isVisible, $isLoading }) =>
    $isLoading || $isVisible ? 'visible' : 'hidden'
  };
  opacity: ${({ $isVisible, $isLoading }) =>
    $isLoading ? 0 : $isVisible ? 1 : 0
  };
  transform: ${({ $isVisible, $isLoading }) =>
    $isLoading ? 'translateY(15px)' : $isVisible ? 'translateY(0)' : 'translateY(-15px)'
  };
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${({ $isVisible, $isLoading }) =>
    $isLoading || !$isVisible ? 'none' : 'auto'
  };
  background: ${({ $isVisible, $isLoading, $colorScheme }) =>
    $isLoading || $isVisible ? ($colorScheme?.colors?.surface || 'rgba(15, 15, 35, 0.6)') : 'transparent'
  };
  border-radius: ${({ $isVisible, $isLoading }) =>
    $isLoading || $isVisible ? '20px' : '0'
  };
  border: ${({ $isVisible, $isLoading, $colorScheme }) =>
    $isLoading || $isVisible ? `2px solid ${$colorScheme?.colors?.border || '#2a2a4a'}` : 'none'
  };
  position: relative;
  backdrop-filter: ${({ $isVisible, $isLoading }) =>
    $isLoading || $isVisible ? 'blur(12px)' : 'none'
  };
  box-shadow: ${({ $isVisible, $isLoading, $colorScheme }) =>
    $isLoading || $isVisible ? ($colorScheme?.effects?.shadow || '0 12px 40px rgba(0, 0, 0, 0.4)') : 'none'
  };

  ${({ $isVisible, $isLoading, $colorScheme }) => ($isLoading || $isVisible) && `
    &:hover {
      border-color: ${$colorScheme?.colors?.primary || '#ffd700'};
      box-shadow: ${$colorScheme?.effects?.glow || '0 0 32px rgba(255, 215, 0, 0.3)'};
      transform: translateY(-4px);
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: ${$colorScheme?.patterns?.overlay || 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(162, 89, 255, 0.03))'};
      border-radius: 18px;
      pointer-events: none;
      opacity: 0.8;
    }
  `}

  @media (max-width: 900px) {
    margin: ${({ $isVisible, $isLoading }) =>
      $isLoading || $isVisible ? '1.5rem 0' : '0'
    };
    padding: ${({ $isVisible, $isLoading }) =>
      $isLoading || $isVisible ? '1.25rem' : '0'
    };
    border-radius: ${({ $isVisible, $isLoading }) =>
      $isLoading || $isVisible ? '16px' : '0'
    };
  }

  @media (max-width: 700px) {
    margin: ${({ $isVisible, $isLoading }) =>
      $isLoading || $isVisible ? '1rem 0' : '0'
    };
    padding: ${({ $isVisible, $isLoading }) =>
      $isLoading || $isVisible ? '1rem' : '0'
    };
    border-radius: ${({ $isVisible, $isLoading }) =>
      $isLoading || $isVisible ? '14px' : '0'
    };
  }

  @media (max-width: 480px) {
    margin: ${({ $isVisible, $isLoading }) =>
      $isLoading || $isVisible ? '0.75rem 0' : '0'
    };
    padding: ${({ $isVisible, $isLoading }) =>
      $isLoading || $isVisible ? '0.75rem' : '0'
    };
    border-radius: ${({ $isVisible, $isLoading }) =>
      $isLoading || $isVisible ? '12px' : '0'
    };
  }

  @media (max-width: 400px) {
    margin: ${({ $isVisible, $isLoading }) =>
      $isLoading || $isVisible ? '0.5rem 0' : '0'
    };
    padding: ${({ $isVisible, $isLoading }) =>
      $isLoading || $isVisible ? '0.5rem' : '0'
    };
    border-radius: ${({ $isVisible, $isLoading }) =>
      $isLoading || $isVisible ? '10px' : '0'
    };
  }
`;

export const Banner = styled.div<{ $colorScheme?: any }>`
  position: relative;
  border-radius: 16px;
  width: 100%;
  min-height: 200px;
  overflow: hidden;
  background: ${({ $colorScheme }) => $colorScheme?.patterns?.background || `
    radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.08) 0%, transparent 50%), 
    radial-gradient(circle at 80% 20%, rgba(162, 89, 255, 0.08) 0%, transparent 50%),
    linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.9) 100%)
  `};
  border: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || '#2a2a4a'};
  margin-bottom: 1.5rem;
  transition: all 0.4s ease;
  box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.shadow || '0 8px 32px rgba(0, 0, 0, 0.3)'};

  &:hover {
    border-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
    box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.glow || '0 0 32px rgba(255, 215, 0, 0.4)'};
    transform: translateY(-3px);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: ${({ $colorScheme }) => $colorScheme?.patterns?.overlay || `
      radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
    `};
    animation: ${loveLetterFloat} 8s infinite ease-in-out;
    pointer-events: none;
    opacity: 0.6;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ $colorScheme }) => $colorScheme?.patterns?.gradient ? `
      linear-gradient(135deg, 
        ${$colorScheme.patterns.gradient.replace('linear-gradient(135deg, ', '').replace(')', '')}
      ), 
      ${$colorScheme.colors?.surface || 'rgba(26, 26, 46, 0.8)'}
    ` : `
      linear-gradient(135deg, 
        rgba(255, 215, 0, 0.05) 0%, 
        rgba(162, 89, 255, 0.03) 50%, 
        rgba(255, 149, 0, 0.02) 100%
      )
    `};
    opacity: 0.7;
    border-radius: 14px;
    pointer-events: none;
  }

  @media (max-width: 1200px) {
    min-height: 180px;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 768px) {
    min-height: 160px;
    margin-bottom: 1rem;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    min-height: 140px;
    margin-bottom: 0.75rem;
    border-radius: 10px;
  }

  @media (max-width: 400px) {
    min-height: 120px;
    margin-bottom: 0.5rem;
  }
`;

export const BannerBottomBar = styled.div<{ $colorScheme?: any }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 80px;
  background: ${({ $colorScheme }) => $colorScheme?.colors?.background ? `
    linear-gradient(180deg, 
      transparent 0%, 
      ${$colorScheme.colors.background}60 50%,
      ${$colorScheme.colors.background}95 100%
    )
  ` : 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
  pointer-events: none;
  padding: 0 1.5rem;
  backdrop-filter: blur(12px);
  border-top: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 215, 0, 0.2)'};

  @media (max-width: 768px) {
    height: 70px;
    padding: 0 1rem;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  @media (max-width: 480px) {
    height: 60px;
    padding: 0 0.75rem;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

export const Heading = styled.h2<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
  font-size: 2.8rem;
  font-weight: 700;
  text-align: center;
  text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 16px #ffd700, 0 0 32px rgba(162, 89, 255, 0.6)'};
  font-family: ${({ $colorScheme }) => $colorScheme?.typography?.fontFamily || "'Luckiest Guy', cursive, sans-serif"};
  letter-spacing: 2.5px;
  margin-bottom: 0.75rem;
  line-height: 1.1;
  position: relative;
  z-index: 2;

  &::after {
    content: " — where every flip flirts with fate.";
    font-weight: 400;
    font-size: 1.4rem;
    display: block;
    margin-top: 0.5rem;
    opacity: 0.95;
    color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#ffffff'};
    text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 12px rgba(162, 89, 255, 0.8)'};
    font-family: ${({ $colorScheme }) => $colorScheme?.typography?.fontFamily || "'Arial', sans-serif"};
    letter-spacing: 1.2px;
    animation: ${dreamlikeFadeInOut} 6s ease-in-out infinite;
  }

  &::before {
    content: '🎰✨';
    position: absolute;
    top: -10px;
    right: -40px;
    font-size: 1.8rem;
    opacity: 0.7;
    animation: ${candlestickSparkle} 3s infinite ease-in-out;
    z-index: -1;
  }

  @media (max-width: 1200px) {
    font-size: 2.4rem;
    letter-spacing: 2px;
    &::after {
      font-size: 1.2rem;
      letter-spacing: 1px;
    }
    &::before {
      font-size: 1.6rem;
      right: -35px;
    }
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    letter-spacing: 1.5px;
    &::after {
      font-size: 1.1rem;
      margin-top: 0.4rem;
    }
    &::before {
      font-size: 1.4rem;
      right: -30px;
    }
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
    letter-spacing: 1px;
    &::after {
      font-size: 1rem;
    }
    &::before {
      font-size: 1.2rem;
      right: -25px;
    }
  }

  @media (max-width: 400px) {
    font-size: 1.4rem;
    &::after {
      display: none;
    }
    &::before {
      display: none;
    }
  }
`;

export const JackpotTicker = styled.div<{ $colorScheme?: any }>`
  width: 100%;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1.35rem;
  font-weight: 600;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface ? `
    linear-gradient(135deg, 
      ${$colorScheme.colors.surface}60 0%, 
      ${$colorScheme.colors.background}80 100%
    )
  ` : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(15, 15, 35, 0.6) 100%)'};
  border-radius: 16px;
  padding: 1.5rem 2rem;
  box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.shadow || '0 8px 24px rgba(0, 0, 0, 0.3)'};
  border: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 215, 0, 0.2)'};
  transition: all 0.4s ease;
  gap: 1.2rem;
  text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 12px #ffd700'};
  font-family: ${({ $colorScheme }) => $colorScheme?.typography?.fontFamily || "'Arial', sans-serif"};
  letter-spacing: 0.8px;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ $colorScheme }) => $colorScheme?.patterns?.overlay || 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(162, 89, 255, 0.05))'};
    opacity: 0.6;
    border-radius: 14px;
  }

  &:hover {
    border-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
    box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.glow || '0 0 32px rgba(255, 215, 0, 0.4)'};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    margin: 0 auto 1rem;
    gap: 1rem;
    font-size: 1.2rem;
    min-height: 48px;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 1.1rem;
    gap: 0.75rem;
    min-height: 44px;
    border-radius: 12px;
  }

  @media (max-width: 400px) {
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
  }
`;

export const HeroOverlay = styled.div<{ $colorScheme?: any }>`
  position: absolute;
  inset: 0;
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface ? `
    linear-gradient(135deg, 
      ${$colorScheme.colors.surface}40 0%, 
      ${$colorScheme.colors.background}60 50%, 
      ${$colorScheme.colors.surface}20 100%
    )
  ` : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(15, 15, 35, 0.8) 100%)'};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 32px;
  z-index: 2;
  backdrop-filter: blur(8px);
  border-radius: 14px;

  &::before {
    content: '🎰';
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 2rem;
    padding: 0.5rem 1.2rem;
    opacity: 0.8;
    background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.1)'};
    border-radius: 12px;
    border: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 215, 0, 0.3)'};
    backdrop-filter: blur(6px);
    animation: ${loveLetterFloat} 4s infinite ease-in-out;
    box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.glow || '0 0 16px rgba(255, 215, 0, 0.3)'};
  }

  &::after {
    content: '🎲';
    position: absolute;
    bottom: 20px;
    left: 20px;
    font-size: 2rem;
    padding: 0.5rem 1.2rem;
    background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.1)'};
    border-radius: 12px;
    border: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(162, 89, 255, 0.3)'};
    backdrop-filter: blur(6px);
    animation: ${candlestickSparkle} 3s infinite 1s;
    opacity: 0.8;
    box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.glow || '0 0 16px rgba(162, 89, 255, 0.3)'};
  }

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    &::before {
      font-size: 1.6rem;
      top: 16px;
      right: 16px;
      padding: 0.4rem 1rem;
    }
    &::after {
      font-size: 1.6rem;
      left: 16px;
      bottom: 16px;
      padding: 0.4rem 1rem;
    }
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
    &::before, &::after {
      font-size: 1.4rem;
      padding: 0.3rem 0.8rem;
    }
  }

  @media (max-width: 400px) {
    &::before, &::after {
      display: none;
    }
  }
`;

export const FeatureGrid = styled.div<{ $colorScheme?: any }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
    padding-bottom: 0.5rem;
    margin-top: 1.5rem;

    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.1)'} transparent;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
      border-radius: 3px;
    }

    > div {
      flex: 0 0 auto;
      min-width: 220px;
    }
  }
`;

export const FeatureCard = styled.div<{ $colorScheme?: any }>`
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface ? `
    linear-gradient(135deg, 
      ${$colorScheme.colors.surface}80 0%, 
      ${$colorScheme.colors.background}90 100%
    )
  ` : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(15, 15, 35, 0.9) 100%)'};
  border: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || '#2a2a4a'};
  border-radius: 16px;
  padding: 2rem;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || '#fff'};
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  backdrop-filter: blur(10px);
  overflow: hidden;
  box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.shadow || '0 8px 24px rgba(0, 0, 0, 0.3)'};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ $colorScheme }) => $colorScheme?.patterns?.overlay || 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(162, 89, 255, 0.03))'};
    opacity: 0.6;
    border-radius: 14px;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.glow || '0 0 32px rgba(255, 215, 0, 0.3)'};
    border-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
    
    &::before {
      opacity: 0.8;
    }
  }

  h3 {
    margin: 0 0 1rem;
    font-size: 1.4rem;
    color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
    text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 12px #ffd700'};
    font-weight: 700;
    position: relative;
    z-index: 2;
    letter-spacing: 0.5px;
  }

  p {
    margin: 0;
    font-size: 1.1rem;
    opacity: 0.95;
    color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#c0c0c0'};
    line-height: 1.6;
    position: relative;
    z-index: 2;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 14px;
    h3 {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
    }
    p {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: 12px;
    h3 {
      font-size: 1.1rem;
    }
    p {
      font-size: 0.95rem;
    }
  }
`;

export const QuotesSection = styled.div<{ $colorScheme?: any }>`
  margin: 1.5rem 0;
  padding: 1rem;
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface ? `
    linear-gradient(135deg, 
      ${$colorScheme.colors.surface}60 0%, 
      ${$colorScheme.colors.background}80 100%
    )
  ` : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(15, 15, 35, 0.6) 100%)'};
  border-radius: 16px;
  border: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 215, 0, 0.2)'};
  backdrop-filter: blur(12px);
  box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.shadow || '0 8px 24px rgba(0, 0, 0, 0.3)'};
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
    box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.glow || '0 0 32px rgba(255, 215, 0, 0.4)'};
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ $colorScheme }) => $colorScheme?.patterns?.overlay || 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(162, 89, 255, 0.05))'};
    opacity: 0.6;
    border-radius: 14px;
  }

  @media (max-width: 768px) {
    margin: 1.25rem 0;
    padding: 0.875rem;
    border-radius: 14px;
  }

  @media (max-width: 480px) {
    margin: 1rem 0;
    padding: 0.75rem;
    border-radius: 12px;
  }
`;

export const QuotesTicker = styled.div<{ $colorScheme?: any }>`
  width: 100%;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1.35rem;
  font-weight: 600;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface ? `
    linear-gradient(135deg, 
      ${$colorScheme.colors.surface}60 0%, 
      ${$colorScheme.colors.background}80 100%
    )
  ` : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(15, 15, 35, 0.6) 100%)'};
  border-radius: 16px;
  padding: 1.5rem 2rem;
  box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.shadow || '0 8px 24px rgba(0, 0, 0, 0.3)'};
  border: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 215, 0, 0.2)'};
  transition: all 0.4s ease;
  gap: 1.2rem;
  text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 12px #ffd700'};
  font-family: ${({ $colorScheme }) => $colorScheme?.typography?.fontFamily || "'Arial', sans-serif"};
  letter-spacing: 0.8px;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ $colorScheme }) => $colorScheme?.patterns?.overlay || 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(162, 89, 255, 0.05))'};
    opacity: 0.6;
    border-radius: 14px;
  }

  &:hover {
    border-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
    box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.glow || '0 0 32px rgba(255, 215, 0, 0.4)'};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    margin: 0 auto 1rem;
    gap: 1rem;
    font-size: 1.2rem;
    min-height: 48px;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 1.1rem;
    gap: 0.75rem;
    min-height: 44px;
    border-radius: 12px;
  }

  @media (max-width: 400px) {
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
  }
`;
