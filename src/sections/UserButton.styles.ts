import styled, { keyframes, css } from 'styled-components'

// Romantic animations for user button
export const romanticPulse = keyframes`
  0% {
    box-shadow: 
      0 0 24px rgba(212, 165, 116, 0.4),
      0 0 48px rgba(184, 51, 106, 0.3);
    border-color: rgba(212, 165, 116, 0.4);
  }
  100% {
    box-shadow: 
      0 0 48px rgba(212, 165, 116, 0.6),
      0 0 96px rgba(184, 51, 106, 0.4);
    border-color: rgba(212, 165, 116, 0.7);
  }
`;

export const loveLetterGradientMove = keyframes`
  0% { 
    background-position: 0% 50%; 
  }
  100% { 
    background-position: 100% 50%; 
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

// Keep old exports for compatibility
export const neonPulse = romanticPulse;
export const moveGradient = loveLetterGradientMove;
export const sparkle = candlestickSparkle;

export const Container = styled.div`
  height: auto;
  width: min(600px, 94vw);
  margin: 1rem auto;
  border-radius: 24px;
  padding: clamp(1.5rem, 4vw, 2rem);
  color: var(--love-letter-gold);
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  text-align: center;
  position: relative;

  /* Enhanced romantic glassmorphism */
  background: linear-gradient(
    135deg,
    rgba(10, 5, 17, 0.9) 0%,
    rgba(139, 90, 158, 0.2) 50%,
    rgba(10, 5, 17, 0.9) 100%
  );
  backdrop-filter: blur(30px) saturate(1.5);
  border: 1px solid rgba(212, 165, 116, 0.3);
  box-shadow: 
    0 16px 48px rgba(10, 5, 17, 0.7),
    0 8px 24px rgba(212, 165, 116, 0.1),
    inset 0 1px 0 rgba(212, 165, 116, 0.2);

  /* Romantic gradient border effect */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(
      45deg,
      var(--love-letter-gold) 0%,
      var(--deep-crimson-rose) 25%,
      var(--soft-purple-twilight) 50%,
      var(--deep-crimson-rose) 75%,
      var(--love-letter-gold) 100%
    );
    background-size: 300% 300%;
    animation: ${loveLetterGradientMove} 6s ease-in-out infinite;
    border-radius: 26px;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.4s ease;
  }

  &:hover::before {
    opacity: 0.6;
  }

  /* Inner romantic glow effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 24px;
    background:
      radial-gradient(circle at 30% 20%, rgba(212, 165, 116, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(184, 51, 106, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(139, 90, 158, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* Mobile-first responsive design */
  @media (max-width: 479px) {
    margin: 0.75rem auto;
    border-radius: 18px;
    padding: 1.25rem;
    
    &::before {
      border-radius: 20px;
    }
    
    &::after {
      border-radius: 18px;
    }
  }

  @media (min-width: 768px) {
    border-radius: 28px;
    
    &::before {
      border-radius: 30px;
    }
    
    &::after {
      border-radius: 28px;
    }
  }

  > * {
    position: relative;
    z-index: 10;
  }
`;

export const Header = styled.h3`
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  margin-bottom: 1.5rem;
  color: var(--love-letter-gold);
  font-family: 'Libre Baskerville', serif;
  font-weight: 600;
  text-shadow: 
    0 0 12px rgba(212, 165, 116, 0.5),
    0 0 4px rgba(212, 165, 116, 0.3);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--love-letter-gold) 50%,
      transparent 100%
    );
    opacity: 0.7;
  }

  @media (max-width: 479px) {
    margin-bottom: 1.25rem;
    
    &::after {
      width: 40px;
      height: 1px;
      bottom: -6px;
    }
  }
`;

export const CasinoIcon = styled.div`
  font-family: 'DM Sans', sans-serif;
  text-shadow: 
    0 0 12px rgba(212, 165, 116, 0.5),
    0 0 8px rgba(184, 51, 106, 0.3);
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &::before {
    content: '💕';
    font-size: 1.2em;
    filter: drop-shadow(0 0 8px var(--love-letter-gold));
    animation: ${candlestickSparkle} 3s infinite;
  }

  @media (max-width: 479px) {
    gap: 0.25rem;
    
    &::before {
      font-size: 1em;
    }
  }
`;

export const TokenPreview = styled.div`
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--love-letter-gold);
  font-weight: 600;
  font-size: clamp(1rem, 3vw, 1.1rem);
  padding: 1rem 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(212, 165, 116, 0.1) 0%,
    rgba(184, 51, 106, 0.05) 50%,
    rgba(139, 90, 158, 0.1) 100%
  );
  border-radius: 16px;
  border: 1px solid rgba(212, 165, 116, 0.2);
  backdrop-filter: blur(15px) saturate(1.2);
  box-shadow: 
    0 4px 16px rgba(10, 5, 17, 0.4),
    inset 0 1px 0 rgba(212, 165, 116, 0.1);
  font-family: 'DM Sans', sans-serif;

  @media (max-width: 479px) {
    padding: 0.75rem 1rem;
    border-radius: 12px;
    gap: 0.5rem;
    margin-top: 1.25rem;
  }

  @media (min-width: 768px) {
    border-radius: 18px;
    padding: 1.25rem 1.75rem;
  }
`;

export const TokenIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  box-shadow: 
    0 0 12px rgba(212, 165, 116, 0.4),
    0 4px 8px rgba(10, 5, 17, 0.3);
  filter: drop-shadow(0 0 4px var(--love-letter-gold));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 
      0 0 16px rgba(212, 165, 116, 0.6),
      0 6px 12px rgba(10, 5, 17, 0.4);
  }

  @media (max-width: 479px) {
    width: 26px;
    height: 26px;
    border-radius: 8px;
  }

  @media (min-width: 768px) {
    width: 36px;
    height: 36px;
    border-radius: 12px;
  }
`;

export const WalletButtonWrapper = styled.div`
  text-align: center;
  position: relative;

  ${css`
    .gamba-button {
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
      font-size: clamp(0.9rem, 2.5vw, 1rem) !important;
      color: var(--deep-romantic-night) !important;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
      box-shadow: 
        0 8px 24px rgba(10, 5, 17, 0.4),
        0 4px 12px rgba(212, 165, 116, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
      animation: ${romanticPulse} 3s infinite alternate !important;
      backdrop-filter: blur(10px) !important;
      font-family: 'DM Sans', sans-serif !important;
      letter-spacing: 0.5px !important;
      text-shadow: 0 1px 2px rgba(10, 5, 17, 0.3) !important;

      @media (max-width: 479px) {
        padding: 0.6rem 1.25rem !important;
        border-radius: 12px !important;
      }

      @media (min-width: 768px) {
        padding: 0.875rem 1.75rem !important;
        border-radius: 18px !important;
      }

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
    }
  `}
`;

// Enhanced romantic referral section styles
export const ReferralSection = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(212, 165, 116, 0.08) 0%,
    rgba(184, 51, 106, 0.05) 50%,
    rgba(139, 90, 158, 0.08) 100%
  );
  border-radius: 20px;
  border: 1px solid rgba(212, 165, 116, 0.2);
  backdrop-filter: blur(15px) saturate(1.2);
  position: relative;
  box-shadow: 
    0 8px 24px rgba(10, 5, 17, 0.4),
    inset 0 1px 0 rgba(212, 165, 116, 0.1);

  &::before {
    content: '�';
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 1.5rem;
    animation: ${candlestickSparkle} 3s infinite;
    filter: drop-shadow(0 0 8px var(--love-letter-gold));
  }

  @media (max-width: 479px) {
    padding: 1rem;
    border-radius: 16px;
    gap: 0.75rem;
    margin-top: 1.5rem;
    
    &::before {
      font-size: 1.25rem;
      top: -8px;
      right: -8px;
    }
  }

  @media (min-width: 768px) {
    border-radius: 24px;
    padding: 1.75rem;
  }
`;

export const ReferralButton = styled.div`
  .gamba-button {
    background: linear-gradient(
      135deg,
      var(--soft-purple-twilight) 0%,
      var(--deep-crimson-rose) 50%,
      var(--love-letter-gold) 100%
    ) !important;
    border: 1px solid rgba(139, 90, 158, 0.4) !important;
    border-radius: 14px !important;
    padding: 0.75rem 1.5rem !important;
    font-weight: 600 !important;
    color: var(--deep-romantic-night) !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    box-shadow: 
      0 6px 20px rgba(10, 5, 17, 0.4),
      0 3px 10px rgba(139, 90, 158, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
    font-family: 'DM Sans', sans-serif !important;
    text-shadow: 0 1px 2px rgba(10, 5, 17, 0.3) !important;

    &:hover {
      transform: translateY(-2px) scale(1.02) !important;
      box-shadow: 
        0 8px 28px rgba(10, 5, 17, 0.5),
        0 4px 14px rgba(139, 90, 158, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
    }

    @media (max-width: 479px) {
      border-radius: 12px !important;
      padding: 0.6rem 1.25rem !important;
    }
  }
`;

export const RemoveButton = styled.div`
  .gamba-button {
    background: linear-gradient(
      135deg,
      rgba(184, 51, 106, 0.8) 0%,
      rgba(139, 90, 158, 0.8) 100%
    ) !important;
    border: 1px solid rgba(184, 51, 106, 0.5) !important;
    border-radius: 14px !important;
    color: var(--love-letter-gold) !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    font-family: 'DM Sans', sans-serif !important;
    backdrop-filter: blur(10px) !important;
    box-shadow: 
      0 4px 16px rgba(10, 5, 17, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;

    &:hover:not(:disabled) {
      background: linear-gradient(
        135deg,
        rgba(184, 51, 106, 1) 0%,
        rgba(139, 90, 158, 1) 100%
      ) !important;
      box-shadow: 
        0 6px 20px rgba(10, 5, 17, 0.4),
        0 3px 10px rgba(184, 51, 106, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
      transform: translateY(-1px) !important;
    }

    &:disabled {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
      transform: none !important;
    }

    @media (max-width: 479px) {
      border-radius: 12px !important;
    }
  }
`;

export const InfoText = styled.div`
  opacity: 0.8;
  font-size: 0.9rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;

  @media (max-width: 600px) {
    font-size: 0.85rem;
    padding: 0 2px;
  }

  a {
    color: #ffd700;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-shadow: 0 0 8px #ffd700;
    }
  }
`;
