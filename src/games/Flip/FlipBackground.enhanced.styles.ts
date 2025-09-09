import styled from 'styled-components'

export const StyledFlipBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg, 
    var(--deep-romantic-night) 0%, 
    var(--soft-purple-twilight) 15%, 
    var(--deep-crimson-rose) 30%, 
    var(--love-letter-gold) 45%, 
    var(--deep-crimson-rose) 60%, 
    var(--soft-purple-twilight) 75%, 
    var(--deep-romantic-night) 90%
  );
  border-radius: 24px;
  border: 3px solid var(--love-letter-gold);
  box-shadow: 
    0 25px 50px rgba(10, 5, 17, 0.8),
    inset 0 2px 4px rgba(212, 165, 116, 0.3),
    inset 0 -2px 4px rgba(10, 5, 17, 0.5),
    0 0 40px var(--deep-crimson-rose);
  overflow: hidden;
  animation: romanticPulse 5s ease-in-out infinite;
  
  /* Romantic coin elements */
  &::before {
    content: '💰';
    position: absolute;
    top: 8%;
    left: 7%;
    font-size: 140px;
    opacity: 0.12;
    transform: rotate(-20deg);
    pointer-events: none;
    color: var(--love-letter-gold);
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(10, 5, 17, 0.7);
    filter: blur(1px);
    animation: loveLetterFloat 8s ease-in-out infinite;
  }

  &::after {
    content: '💎';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 120px;
    opacity: 0.15;
    transform: rotate(25deg);
    pointer-events: none;
    color: var(--deep-crimson-rose);
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(10, 5, 17, 0.7);
    filter: blur(0.5px);
    animation: candlestickSparkle 6s ease-in-out infinite;
  }

  @keyframes romanticPulse {
    0%, 100% { 
      filter: brightness(1) saturate(1) hue-rotate(0deg);
      border-color: var(--love-letter-gold);
    }
    25% { 
      filter: brightness(1.05) saturate(1.1) hue-rotate(5deg);
      border-color: var(--deep-crimson-rose);
    }
    50% { 
      filter: brightness(1.1) saturate(1.2) hue-rotate(10deg);
      border-color: var(--soft-purple-twilight);
    }
    75% { 
      filter: brightness(1.05) saturate(1.1) hue-rotate(5deg);
      border-color: var(--deep-crimson-rose);
    }
  }

  @keyframes loveLetterFloat {
    0%, 100% { 
      transform: rotate(-20deg) translateY(0px);
      opacity: 0.12;
    }
    25% { 
      transform: rotate(-15deg) translateY(-10px);
      opacity: 0.18;
    }
    50% { 
      transform: rotate(-10deg) translateY(-20px);
      opacity: 0.25;
    }
    75% { 
      transform: rotate(-15deg) translateY(-10px);
      opacity: 0.18;
    }
  }

  @keyframes candlestickSparkle {
    0%, 100% { 
      transform: rotate(25deg) scale(1);
      opacity: 0.15;
    }
    20% { 
      transform: rotate(30deg) scale(1.05);
      opacity: 0.22;
    }
    40% { 
      transform: rotate(35deg) scale(1.1);
      opacity: 0.3;
    }
    60% { 
      transform: rotate(32deg) scale(1.08);
      opacity: 0.25;
    }
    80% { 
      transform: rotate(28deg) scale(1.03);
      opacity: 0.18;
    }
  }

  /* Override GameScreenFrame's dark background */
  & .absolute.inset-\\[2px\\].rounded-\\[0\\.65rem\\].bg-\\[\\#0c0c11\\] {
    background: transparent !important;
  }

  /* General override for any dark background in the frame */
  & [class*="bg-[#0c0c11]"] {
    background: transparent !important;
  }

  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
  }

  .flip-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    transform: rotateX(1deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 40px 30px;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100%;
  }

  /* Modern Flip Redesign - Now uses game scaling system */
  .flip-redesign {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: calc(var(--game-spacing-scale, 1) * 10px);
  padding: calc(var(--game-spacing-scale, 1) * 10px) calc(var(--game-spacing-scale, 1) * 14px);
  height: 100%;
  /* Use CSS custom properties from GameScalingProvider for optimal height */
  min-height: var(--game-screen-height, calc(100dvh - 160px));
  width: var(--game-screen-width, 100%);
  position: relative;
  z-index: 2;
  }

  .flip-header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(var(--game-spacing-scale, 1) * 6px);
  width: 100%;
  margin-top: calc(var(--game-spacing-scale, 1) * 4px);
  }

  .side-indicator {
    display: flex;
    align-items: center;
    gap: 24px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 12px 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .side-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    border-radius: 16px;
    transition: all 0.3s ease;
    cursor: pointer;
    min-width: 80px;
    position: relative;

    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    span {
      font-size: calc(var(--game-text-scale, 1) * 14px);
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
      transition: all 0.3s ease;
      letter-spacing: 0.5px;
    }

    &.selected {
      background: rgba(59, 130, 246, 0.2);
      border: 2px solid rgba(59, 130, 246, 0.5);
      transform: scale(1.02);

      img {
        box-shadow: 0 6px 25px rgba(59, 130, 246, 0.4);
      }

      span {
        color: #3b82f6;
      }
    }

    &.winner {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(52, 211, 153, 0.2));
      border: 2px solid #10B981;
      transform: scale(1.1);
      animation: winnerPulse 2s ease-in-out infinite;

      img {
        box-shadow: 0 8px 30px rgba(16, 185, 129, 0.6);
        transform: scale(1.15);
      }

      span {
        color: #10B981;
        font-weight: 700;
        text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
      }
    }

    &:not(.selected):not(.winner):hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
  }

  .result-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: linear-gradient(45deg, #10B981, #34D399);
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
    animation: badgeBounce 0.6s ease-out;
  }

  @keyframes winnerPulse {
    0%, 100% { 
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
    }
    50% { 
      box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
    }
  }

  @keyframes badgeBounce {
    0% { 
      transform: scale(0) rotate(-180deg);
      opacity: 0;
    }
    50% { 
      transform: scale(1.2) rotate(-90deg);
    }
    100% { 
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }

  .vs-divider {
    font-size: 16px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.6);
    background: linear-gradient(45deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding: 0 8px;
  }

  .win-multiplier {
    background: linear-gradient(135deg, #F59E0B, #EAB308);
    color: #92400E;
    font-size: calc(var(--game-text-scale, 1) * 18px);
    font-weight: 700;
    padding: calc(var(--game-spacing-scale, 1) * 8px) calc(var(--game-spacing-scale, 1) * 20px);
    border-radius: 25px;
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .coins-count {
  margin-top: calc(var(--game-spacing-scale, 1) * 4px);
  color: rgba(255,255,255,0.9);
  font-size: calc(var(--game-text-scale, 1) * 12px);
  }

  .coin-arena {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* lift the coins closer to the header on mobile */
  justify-content: flex-start;
  align-items: center;
  gap: calc(var(--game-spacing-scale, 1) * 10px);
  width: 100%;
  position: relative;
  overflow: visible;
  padding-top: calc(var(--game-spacing-scale, 1) * 12px);
  /* Use flexible height that adapts to available space */
  min-height: calc(var(--game-screen-height, 400px) * 0.6);
  }

  .coin-container {
  /* responsive canvas container using game scaling system */
  width: min(100%, var(--game-screen-width, 980px));
  max-width: 980px;
  /* Use proportional height based on available screen space */
  height: calc(var(--game-screen-height, 400px) * 0.5);
    border-radius: 12px;
    background: transparent;
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.4),
      inset 0 4px 20px rgba(255, 255, 255, 0.1),
      0 0 40px rgba(148, 163, 184, 0.2);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    z-index: 1;
    pointer-events: none;

    /* Force canvas to fill the container */
    canvas {
      width: 100% !important;
      height: 100% !important;
      display: block;
      background: transparent !important;
      background-color: transparent !important;
    }
  }

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.05), transparent);
      animation: rotate 3s linear infinite;
      opacity: 0.3;
    }
  }

  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .coin-shadow {
    width: 200px;
    height: 40px;
    background: radial-gradient(ellipse, rgba(0, 0, 0, 0.3), transparent);
    border-radius: 50%;
    filter: blur(8px);
    animation: shadowPulse 2s ease-in-out infinite;
  }

  @keyframes shadowPulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.1); opacity: 0.5; }
  }

  .status-display {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    width: 100%;
    display: flex;
    justify-content: center;
    pointer-events: none;
  }

  .status-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(255, 215, 0, 0.5);
    border-radius: 20px;
    padding: 20px 28px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
    min-width: 180px;
    transition: all 0.3s ease;
    pointer-events: auto;
  }

  .status-icon {
    font-size: 32px;
    transition: all 0.3s ease;

    &.spinning {
      animation: spin 1s linear infinite;
    }

    &.win {
      animation: bounce 0.6s ease-in-out;
    }

    &.lose {
      animation: shake 0.5s ease-in-out;
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
    40%, 43% { transform: translate3d(0,-30px,0); }
    70% { transform: translate3d(0,-15px,0); }
    90% { transform: translate3d(0,-4px,0); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
    20%, 40%, 60%, 80% { transform: translateX(8px); }
  }

  .status-text {
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    transition: all 0.3s ease;

    &.win {
      color: #10B981;
      font-weight: 700;
    }

    &.lose {
      color: #EF4444;
      font-weight: 700;
    }
  }

  /* Responsive Design */
  @media (max-width: 640px) {
    .flip-redesign {
      padding: 12px;
      gap: 20px;
    }

    .coin-container {
      width: 90%;
      height: 40vh;
    }

    .side-option {
      min-width: 50px;
      padding: 10px;

      img {
        width: 30px;
        height: 30px;
      }

      span {
        font-size: 11px;
      }
    }

    .status-card {
      padding: 16px 20px;
      min-width: 140px;
    }
  }

  @media (min-width: 641px) and (max-width: 768px) {
    .flip-redesign {
      padding: 16px;
      gap: 24px;
    }

    .coin-container {
      width: 90%;
      height: 45vh;
    }

    .side-option {
      min-width: 60px;
      padding: 12px;

      img {
        width: 36px;
        height: 36px;
      }

      span {
        font-size: 12px;
      }
    }

    .status-card {
      padding: 20px 24px;
      min-width: 160px;
    }
  }

  @media (min-width: 769px) and (max-width: 899px) {
    .flip-redesign {
      padding: 20px;
      gap: 28px;
    }

    .coin-container {
      width: 80%;
      height: 55vh;
    }

    .side-option {
      min-width: 70px;
      padding: 14px;

      img {
        width: 40px;
        height: 40px;
      }

      span {
        font-size: 13px;
      }
    }

    .status-card {
      padding: 22px 26px;
      min-width: 180px;
    }
  }

  @media (min-width: 900px) {
    .flip-redesign {
      padding: 24px;
      gap: 32px;
    }

    .coin-container {
      width: 70%;
      height: 60vh;
    }

    .side-option {
      min-width: 80px;
      padding: 16px;

      img {
        width: 44px;
        height: 44px;
      }

      span {
        font-size: 14px;
      }
    }

    .status-card {
      padding: 24px 32px;
      min-width: 200px;
    }
  }

  /* Additional silver elements */
  .silver-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '💫';
      position: absolute;
      top: 25%;
      right: 15%;
      font-size: 100px;
      opacity: 0.05;
      transform: rotate(-15deg);
      color: #cbd5e1;
      filter: drop-shadow(2px 2px 6px rgba(0, 0, 0, 0.3));
    }

    &::after {
      content: '✨';
      position: absolute;
      bottom: 40%;
      left: 12%;
      font-size: 90px;
      opacity: 0.07;
      transform: rotate(30deg);
      color: #f1f5f9;
      filter: drop-shadow(2px 2px 6px rgba(0, 0, 0, 0.3));
    }
  }

  /* Crystalline overlay - representing the moment of truth */
  .crystal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 40% 30%, rgba(241, 245, 249, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 60% 70%, rgba(203, 213, 225, 0.08) 0%, transparent 60%),
      radial-gradient(circle at 20% 80%, rgba(148, 163, 184, 0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  @keyframes silver-shimmer {
    0%, 100% {
      opacity: 0.8;
      filter: brightness(1) contrast(1);
    }
    50% {
      opacity: 1;
      filter: brightness(1.15) contrast(1.1);
    }
  }

  @keyframes suspended-moment {
    0%, 100% {
      transform: scale(1);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.03);
      opacity: 1;
    }
  }

  /* Enhanced styling for flip-specific elements */
  .destiny-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    border: 1px solid rgba(203, 213, 225, 0.15);
    border-radius: 50%;
    animation: suspended-moment 8s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  .silver-truth-area {
    background: 
      linear-gradient(135deg, 
        rgba(30, 41, 59, 0.85) 0%,
        rgba(51, 65, 85, 0.8) 50%,
        rgba(30, 41, 59, 0.85) 100%
      );
    border: 2px solid rgba(203, 213, 225, 0.3);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
    padding: 20px;
    color: #f1f5f9;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    animation: silver-shimmer 5s ease-in-out infinite;
  }

  /* Raw instinct canvas enhancement */
  .instinct-canvas-container {
    background: 
      linear-gradient(135deg, 
        rgba(15, 23, 42, 0.6) 0%,
        rgba(30, 41, 59, 0.4) 50%,
        rgba(15, 23, 42, 0.6) 100%
      );
    border: 2px solid rgba(148, 163, 184, 0.25);
    border-radius: 20px;
    padding: 30px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.08),
      0 0 25px rgba(148, 163, 184, 0.2);
  }

  /* Result area for consistent layout */
  .fate-result-area {
    background: 
      linear-gradient(135deg, 
        rgba(71, 85, 105, 0.9) 0%,
        rgba(100, 116, 139, 0.85) 50%,
        rgba(71, 85, 105, 0.9) 100%
      );
    border: 2px solid rgba(203, 213, 225, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 10px 35px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.15),
      0 0 20px rgba(148, 163, 184, 0.3);
    padding: 25px;
    color: #f8fafc;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
`
