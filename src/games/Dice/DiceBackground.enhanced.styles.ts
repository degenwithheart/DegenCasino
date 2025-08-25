import styled from 'styled-components'

export const StyledDiceBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  /* Remove redundant background - GameScreenFrame handles this now */
  border-radius: 12px;
  overflow: hidden;
  
  /* Keep only decorative dice icons - remove background colors */
  &::before {
    content: '⚃';
    position: absolute;
    top: 12%;
    left: 8%;
    font-size: 120px;
    opacity: 0.08;
    transform: rotate(-15deg);
    pointer-events: none;
    color: rgba(255, 255, 255, 0.1); /* Use neutral color that works with any theme */
    z-index: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  &::after {
    content: '⚄';
    position: absolute;
    bottom: 15%;
    right: 10%;
    font-size: 100px;
    opacity: 0.09;
    transform: rotate(25deg);
    pointer-events: none;
    color: rgba(255, 255, 255, 0.1); /* Use neutral color that works with any theme */
    z-index: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  /* Remove background overrides - GameScreenFrame handles theming now */
  
  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
  }

  /* Modern Dice Redesign */
  .dice-redesign {
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

  .dice-header {
    display: flex;
    gap: 16px;
    width: 100%;
    max-width: 600px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 16px 20px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    min-width: 120px;

    &.highlight {
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid rgba(16, 185, 129, 0.4);
      box-shadow: 0 8px 32px rgba(16, 185, 129, 0.2);
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    }
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
    font-variant-numeric: tabular-nums;

    .error {
      color: #EF4444;
      font-size: 14px;
      font-weight: 600;
    }
  }

  .stat-label {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .roll-target {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .target-circle {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), transparent);
    border: 3px solid rgba(255, 255, 255, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.4),
      inset 0 4px 20px rgba(255, 255, 255, 0.1);
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
      animation: rotate 4s linear infinite;
      opacity: 0.5;
    }
  }

  .target-number {
    font-size: 48px;
    font-weight: 800;
    color: #fff;
    z-index: 1;
    position: relative;
    font-variant-numeric: tabular-nums;
  }

  .target-label {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
    z-index: 1;
    position: relative;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .dice-arena {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 700px;
  }

  .dice-track-container {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .result-marker {
    position: absolute;
    top: -60px;
    transform: translateX(-50%);
    z-index: 10;
    transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .result-number {
    background: linear-gradient(135deg, #10B981, #059669);
    color: white;
    border-radius: 12px;
    padding: 8px 12px;
    font-weight: 700;
    font-size: 16px;
    text-align: center;
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.3);
    animation: resultAppear 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    font-variant-numeric: tabular-nums;
  }

  .result-arrow {
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #10B981;
    margin: 0 auto;
  }

  @keyframes resultAppear {
    0% { transform: scale(0) rotate(180deg); opacity: 0; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  .dice-track {
    position: relative;
    height: 60px;
    display: flex;
    align-items: center;
  }

  .track-background {
    position: absolute;
    width: 100%;
    height: 20px;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .win-zone {
    background: linear-gradient(90deg, #10B981, #059669);
    transition: width 0.3s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 1px;
      height: 100%;
      background: rgba(255, 255, 255, 0.5);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    }
  }

  .lose-zone {
    background: linear-gradient(90deg, #DC2626, #B91C1C);
    transition: width 0.3s ease;
  }

  .track-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    gap: 16px;
  }

  .label-win,
  .label-lose {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border-radius: 8px;
    padding: 8px 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    flex: 1;

    span:first-child {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    span:last-child {
      font-size: 12px;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
  }

  .label-win {
    color: #10B981;
  }

  .label-lose {
    color: #EF4444;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .dice-redesign {
      padding: 16px;
      gap: 24px;
    }

    .dice-header {
      gap: 12px;
    }

    .stat-card {
      min-width: 100px;
      padding: 12px 16px;
    }

    .stat-value {
      font-size: 20px;
    }

    .target-circle {
      width: 120px;
      height: 120px;
    }

    .target-number {
      font-size: 36px;
    }

    .result-marker {
      top: -50px;
    }

    .track-labels {
      flex-direction: column;
      gap: 8px;
    }
  }

  .dice-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    transform: rotateX(2deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 60px 40px;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100%;
  }

  /* Additional mystical background elements */
  .mystical-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '🔮';
      position: absolute;
      top: 35%;
      right: 15%;
      font-size: 90px;
      opacity: 0.06;
      transform: rotate(-18deg);
      color: #f59e0b;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.4));
    }

    &::after {
      content: '🪙';
      position: absolute;
      bottom: 35%;
      left: 12%;
      font-size: 85px;
      opacity: 0.08;
      transform: rotate(30deg);
      color: #fbbf24;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.4));
    }
  }

  /* Sacred temple overlay */
  .sacred-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.12) 0%, transparent 60%),
      radial-gradient(circle at 75% 75%, rgba(218, 165, 32, 0.1) 0%, transparent 60%),
      radial-gradient(circle at 50% 50%, rgba(184, 134, 11, 0.05) 0%, transparent 80%);
    pointer-events: none;
    z-index: 0;
  }

  @keyframes mystical-glow {
    0%, 100% {
      opacity: 0.6;
      filter: brightness(1);
    }
    50% {
      opacity: 0.8;
      filter: brightness(1.2);
    }
  }

  @keyframes sacred-pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.9;
    }
  }

  /* Enhanced styling for dice-specific elements */
  .ancient-stats {
    background: 
      linear-gradient(135deg, 
        rgba(20, 20, 20, 0.85) 0%,
        rgba(40, 30, 10, 0.8) 50%,
        rgba(20, 20, 20, 0.85) 100%
      );
    border: 2px solid rgba(251, 191, 36, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
    padding: 20px;
    color: #fbbf24;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }

  .roll-under-display {
    background: 
      linear-gradient(135deg, 
        rgba(146, 64, 14, 0.9) 0%,
        rgba(217, 119, 6, 0.85) 50%,
        rgba(146, 64, 14, 0.9) 100%
      );
    border: 3px solid rgba(251, 191, 36, 0.6);
    border-radius: 20px;
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.2),
      0 0 20px rgba(251, 191, 36, 0.3);
    padding: 25px;
    color: #fffbeb;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    animation: mystical-glow 3s ease-in-out infinite;
  }

  .sacred-slider-container {
    background: 
      linear-gradient(135deg, 
        rgba(20, 20, 20, 0.8) 0%,
        rgba(40, 30, 10, 0.75) 50%,
        rgba(20, 20, 20, 0.8) 100%
      );
    border: 2px solid rgba(251, 191, 36, 0.3);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 6px 24px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.05);
  }
`
