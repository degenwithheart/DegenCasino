import styled from 'styled-components'

export const StyledFlipBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e293b 0%, #334155 15%, #475569 30%, #64748b 45%, #94a3b8 60%, #cbd5e1 75%, #f1f5f9 90%, #94a3b8 100%);
  border-radius: 24px;
  border: 3px solid rgba(203, 213, 225, 0.4);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.6),
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.3),
    0 0 40px rgba(148, 163, 184, 0.3);
  overflow: hidden;
  
  /* Floating coin background elements - Silver poetry style */
  &::before {
    content: '🪙';
    position: absolute;
    top: 8%;
    left: 7%;
    font-size: 140px;
    opacity: 0.06;
    transform: rotate(-20deg);
    pointer-events: none;
    color: #64748b;
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.4);
    filter: blur(1px);
  }

  &::after {
    content: '🪙';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 120px;
    opacity: 0.08;
    transform: rotate(25deg);
    pointer-events: none;
    color: #94a3b8;
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.4);
    filter: blur(0.5px);
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
    height: 100%;
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

  /* Modern Flip Redesign */
  .flip-redesign {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
    padding: 24px;
    height: 100%;
    min-height: 500px;
    position: relative;
    z-index: 2;
  }

  .flip-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
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

    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    span {
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
      transition: all 0.3s ease;
      letter-spacing: 0.5px;
    }

    &.active {
      background: rgba(16, 185, 129, 0.2);
      border: 2px solid rgba(16, 185, 129, 0.5);
      transform: scale(1.05);

      img {
        box-shadow: 0 6px 25px rgba(16, 185, 129, 0.4);
        transform: scale(1.1);
      }

      span {
        color: #10B981;
      }
    }

    &:not(.active):hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
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
    font-size: 18px;
    font-weight: 700;
    padding: 8px 20px;
    border-radius: 25px;
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .coin-arena {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    width: 100%;
    max-width: 400px;
    position: relative;
  }

  .coin-container {
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), transparent);
    border: 3px solid rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.4),
      inset 0 4px 20px rgba(255, 255, 255, 0.1),
      0 0 40px rgba(148, 163, 184, 0.2);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      animation: rotate 3s linear infinite;
      opacity: 0.7;
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
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .status-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 24px 32px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    min-width: 200px;
    transition: all 0.3s ease;
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
  @media (max-width: 768px) {
    .flip-redesign {
      padding: 16px;
      gap: 24px;
    }

    .coin-container {
      width: 220px;
      height: 220px;
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
