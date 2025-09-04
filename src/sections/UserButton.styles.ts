import styled, { keyframes, css } from 'styled-components'

// Keyframe animations matching casino style
export const neonPulse = keyframes`
  0% {
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #ffd70044;
  }
  100% {
    box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88;
    border-color: #ffd700aa;
  }
`;

export const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

export const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

export const Container = styled.div`
  height: auto;
  width: 600px;
  margin: 1rem auto;
  border-radius: 20px;
  padding: 2rem;
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  text-align: center;
  position: relative;

  /* Enhanced glassmorphism */
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.4);

  /* Casino gradient border effect */
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    border-radius: 20px;
    opacity: 0.3;
    z-index: -1;
    ${css`animation: ${moveGradient} 4s linear infinite;`}
  }

  /* Inner glow effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    background:
      radial-gradient(circle at 30% 20%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(162, 89, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 600px) {
    width: 98vw;
    min-width: 0;
    padding: 1rem 0.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  }
`;

export const Header = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #ffd700;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  text-shadow: 0 0 12px #ffd700, 0 0 24px #a259ff;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &::before {
    content: '🎰';
    font-size: 1.2em;
    filter: drop-shadow(0 0 8px #ffd700);
  }
`

export const TokenPreview = styled.div`
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  font-size: 1.1rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 0.7rem 0.5rem;
    border-radius: 8px;
    gap: 0.5rem;
  }
`;

export const TokenIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  box-shadow: 0 0 12px #ffd700aa;
  filter: drop-shadow(0 0 4px #ffd700);

  @media (max-width: 600px) {
    width: 26px;
    height: 26px;
    border-radius: 6px;
  }
`;

export const WalletButtonWrapper = styled.div`
  text-align: center;
  position: relative;

  ${css`
    .gamba-button {
      background: linear-gradient(90deg, #ffd700, #a259ff) !important;
      border: 2px solid transparent !important;
      border-radius: 16px !important;
      padding: 0.75rem 1.5rem !important;
      font-weight: 700 !important;
      font-size: 1rem !important;
      color: #222 !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.3) !important;
      animation: ${neonPulse} 2s infinite alternate !important;

      @media (max-width: 600px) {
        font-size: 0.98rem !important;
        padding: 0.6rem 1rem !important;
        border-radius: 10px !important;
      }

      &:hover {
        transform: scale(1.05) !important;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.5) !important;
      }
    }
  `}
`;

// Enhanced referral section styles
export const ReferralSection = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  position: relative;

  &::before {
    content: '💎';
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 1.5rem;
    ${css`animation: ${sparkle} 2s infinite;`}
    filter: drop-shadow(0 0 8px #ffd700);
  }

  @media (max-width: 600px) {
    padding: 0.8rem 0.3rem;
    border-radius: 10px;
    gap: 0.6rem;
  }
`;

export const ReferralButton = styled.div`
  .gamba-button {
    background: linear-gradient(90deg, #00ff88, #0099ff) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 0.75rem 1.5rem !important;
    font-weight: 600 !important;
    color: #000 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 0 16px rgba(0, 255, 136, 0.3) !important;

    &:hover {
      transform: scale(1.02) !important;
      box-shadow: 0 0 24px rgba(0, 255, 136, 0.5) !important;
    }
  }
`

export const RemoveButton = styled.div`
  .gamba-button {
    background: rgba(255, 69, 87, 0.8) !important;
    border: 1px solid rgba(255, 69, 87, 0.5) !important;
    border-radius: 12px !important;
    color: white !important;
    transition: all 0.3s ease !important;

    &:hover:not(:disabled) {
      background: rgba(255, 69, 87, 1) !important;
      box-shadow: 0 0 16px rgba(255, 69, 87, 0.4) !important;
    }

    &:disabled {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
    }
  }
`

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
