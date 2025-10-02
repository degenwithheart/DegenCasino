import styled, { keyframes } from 'styled-components'

// Romantic degen trader animations for crash game
const romanticRocketGlow = keyframes`
  0%, 100% { 
    transform: rotate(-15deg) scale(1);
    text-shadow: 
      0 0 25px rgba(212, 165, 116, 0.5),
      3px 3px 8px rgba(10, 5, 17, 0.8);
  }
  50% { 
    transform: rotate(-10deg) scale(1.05);
    text-shadow: 
      0 0 35px rgba(212, 165, 116, 0.7),
      3px 3px 12px rgba(10, 5, 17, 0.9);
  }
`;

const loveLetterFlame = keyframes`
  0%, 100% { 
    transform: rotate(20deg) scale(1);
    text-shadow: 
      0 0 30px rgba(184, 51, 106, 0.6),
      3px 3px 8px rgba(10, 5, 17, 0.8);
  }
  50% { 
    transform: rotate(25deg) scale(1.08);
    text-shadow: 
      0 0 40px rgba(184, 51, 106, 0.8),
      3px 3px 12px rgba(10, 5, 17, 0.9);
  }
`;

const mysticalMarketAura = keyframes`
  0% { 
    background-position: 0% 50%; 
    opacity: 0.9;
  }
  50% { 
    background-position: 100% 50%;
    opacity: 0.95;
  }
  100% { 
    background-position: 0% 50%;
    opacity: 0.9;
  }
`;

export const StyledCrashBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(10, 5, 17, 0.95) 0%, 
    rgba(139, 90, 158, 0.3) 15%,
    rgba(184, 51, 106, 0.25) 30%,
    rgba(212, 165, 116, 0.2) 45%,
    rgba(184, 51, 106, 0.25) 60%,
    rgba(139, 90, 158, 0.3) 75%,
    rgba(10, 5, 17, 0.95) 100%
  );
  background-size: 400% 400%;
  animation: ${mysticalMarketAura} 10s ease-in-out infinite;
  border-radius: 20px;
  border: 2px solid rgba(212, 165, 116, 0.4);
  box-shadow: 
    0 25px 50px rgba(10, 5, 17, 0.8),
    inset 0 2px 4px rgba(212, 165, 116, 0.2),
    inset 0 -2px 4px rgba(10, 5, 17, 0.6),
    0 0 40px rgba(212, 165, 116, 0.3);
  overflow: hidden;
  
  /* Romantic rocket element */
  &::before {
    content: '🚀';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 110px;
    opacity: 0.15;
    color: rgba(212, 165, 116, 0.5);
    z-index: 0;
    pointer-events: none;
    animation: ${romanticRocketGlow} 8s ease-in-out infinite;

    @media (max-width: 768px) {
      font-size: 85px;
      top: 6%;
      left: 4%;
    }

    @media (max-width: 479px) {
      font-size: 65px;
      opacity: 0.1;
    }
  }

  &::after {
    content: '�';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 95px;
    opacity: 0.18;
    color: rgba(184, 51, 106, 0.6);
    z-index: 0;
    pointer-events: none;
    animation: ${loveLetterFlame} 6s ease-in-out infinite;

    @media (max-width: 768px) {
      font-size: 75px;
      bottom: 8%;
      right: 5%;
    }

    @media (max-width: 479px) {
      font-size: 55px;
      opacity: 0.12;
    }
  }

  /* Override GameScreenFrame backgrounds */
  & .absolute.inset-\\[2px\\].rounded-\\[0\\.65rem\\].bg-\\[\\#0c0c11\\] {
    background: transparent !important;
  }

  & [class*="bg-[#0c0c11]"] {
    background: transparent !important;
  }

  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
  }

  .crash-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    transform: rotateX(1deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 24px 16px;
    max-width: 1400px;
    margin: 0 auto;
    min-height: 100%;
    font-family: 'DM Sans', sans-serif;

    @media (max-width: 768px) {
      gap: 12px;
      padding: 20px 12px;
      transform: rotateX(0.5deg);
    }

    @media (max-width: 479px) {
      gap: 10px;
      padding: 16px 10px;
      transform: none;
    }
  }

  /* Romantic chart elements */
  .fire-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '📈';
      position: absolute;
      top: 25%;
      right: 15%;
      font-size: 85px;
      opacity: 0.12;
      transform: rotate(-18deg);
      color: #fed7aa;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5));
    }

    &::after {
      content: '💥';
      position: absolute;
      bottom: 40%;
      left: 12%;
      font-size: 95px;
      opacity: 0.07;
      transform: rotate(25deg);
      color: #ea580c;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5));
    }
  }

  /* Fiery passion overlay */
  .passion-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 30% 20%, rgba(251, 146, 60, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(234, 88, 12, 0.12) 0%, transparent 60%),
      radial-gradient(circle at 20% 70%, rgba(124, 45, 18, 0.1) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  @keyframes fire-pulse {
    0%, 100% {
      opacity: 0.8;
      filter: brightness(1);
    }
    50% {
      opacity: 1;
      filter: brightness(1.25);
    }
  }

  @keyframes rocket-ascent {
    0%, 100% {
      transform: scale(1);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
  }

  /* Enhanced styling for crash-specific elements */
  .rocket-launch-area {
    background: 
      linear-gradient(135deg, 
        rgba(67, 20, 7, 0.9) 0%,
        rgba(124, 45, 18, 0.85) 50%,
        rgba(67, 20, 7, 0.9) 100%
      );
    border: 2px solid rgba(251, 146, 60, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.6),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
    padding: 20px;
    color: #ffedd5;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }

  .trajectory-display {
    background: 
      linear-gradient(135deg, 
        rgba(234, 88, 12, 0.9) 0%,
        rgba(249, 115, 22, 0.85) 50%,
        rgba(234, 88, 12, 0.9) 100%
      );
    border: 3px solid rgba(251, 146, 60, 0.6);
    border-radius: 20px;
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.15),
      0 0 25px rgba(251, 146, 60, 0.4);
    padding: 25px;
    color: #fff7ed;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    animation: fire-pulse 3s ease-in-out infinite;
  }

  .crash-controls {
    background: 
      linear-gradient(135deg, 
        rgba(67, 20, 7, 0.8) 0%,
        rgba(124, 45, 18, 0.75) 50%,
        rgba(67, 20, 7, 0.8) 100%
      );
    border: 2px solid rgba(251, 146, 60, 0.3);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 6px 24px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.05);
  }

  /* Ascent indicator */
  .ascent-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
    border: 1px solid rgba(251, 146, 60, 0.2);
    border-radius: 50%;
    animation: rocket-ascent 4s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  /* Result area for consistent layout */
  .tragedy-result-area {
    background: 
      linear-gradient(135deg, 
        rgba(234, 88, 12, 0.9) 0%,
        rgba(124, 45, 18, 0.85) 50%,
        rgba(234, 88, 12, 0.9) 100%
      );
    border: 2px solid rgba(251, 146, 60, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 10px 35px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.12),
      0 0 20px rgba(251, 146, 60, 0.4);
    padding: 25px;
    color: #fff7ed;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  /* Rocket graph styling integration */
  .crash-graph-container {
    background: 
      linear-gradient(135deg, 
        rgba(67, 20, 7, 0.6) 0%,
        rgba(124, 45, 18, 0.4) 50%,
        rgba(67, 20, 7, 0.6) 100%
      );
    border: 2px solid rgba(251, 146, 60, 0.25);
    border-radius: 20px;
    padding: 25px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.08),
      0 0 25px rgba(251, 146, 60, 0.3);
  }
`
