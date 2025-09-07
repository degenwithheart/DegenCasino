import styled, { keyframes } from 'styled-components'

// Romantic degen trader animations for dice gameplay
const romanticPulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    box-shadow: 
      0 0 20px rgba(212, 165, 116, 0.4),
      0 8px 32px rgba(10, 5, 17, 0.3);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 
      0 0 30px rgba(212, 165, 116, 0.6),
      0 12px 48px rgba(10, 5, 17, 0.5);
  }
`;

const candlestickSparkle = keyframes`
  0%, 100% { 
    box-shadow: 
      0 0 15px rgba(212, 165, 116, 0.3),
      0 0 30px rgba(184, 51, 106, 0.2),
      inset 0 0 20px rgba(139, 90, 158, 0.1);
  }
  50% { 
    box-shadow: 
      0 0 25px rgba(212, 165, 116, 0.5),
      0 0 50px rgba(184, 51, 106, 0.3),
      inset 0 0 30px rgba(139, 90, 158, 0.2);
  }
`;

const loveLetterFloat = keyframes`
  0% { 
    background-position: -200px 0; 
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
  100% { 
    background-position: calc(200px + 100%) 0;
    opacity: 0.3;
  }
`;

const romanticRotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const StyledDiceBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  
  /* Romantic dice icons with candlelight glow */
  &::before {
    content: '⚃';
    position: absolute;
    top: 12%;
    left: 8%;
    font-size: 120px;
    opacity: 0.15;
    transform: rotate(-15deg);
    pointer-events: none;
    color: rgba(212, 165, 116, 0.3);
    z-index: 0;
    text-shadow: 
      0 0 20px rgba(212, 165, 116, 0.5),
      2px 2px 8px rgba(10, 5, 17, 0.8);
    animation: ${candlestickSparkle} 8s ease-in-out infinite;
  }

  &::after {
    content: '⚄';
    position: absolute;
    bottom: 15%;
    right: 10%;
    font-size: 100px;
    opacity: 0.12;
    transform: rotate(25deg);
    pointer-events: none;
    color: rgba(184, 51, 106, 0.3);
    z-index: 0;
    text-shadow: 
      0 0 20px rgba(184, 51, 106, 0.4),
      2px 2px 8px rgba(10, 5, 17, 0.8);
    animation: ${candlestickSparkle} 6s ease-in-out infinite reverse;
  }
  
  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
  }

  /* Romantic Dice Redesign */
  .dice-redesign {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 20px;
    min-height: 100%;
    position: relative;
    z-index: 2;
    font-family: 'DM Sans', sans-serif;

    @media (max-width: 768px) {
      gap: 16px;
      padding: 16px;
      min-height: 400px;
    }

    @media (max-width: 479px) {
      gap: 12px;
      padding: 12px;
      min-height: 350px;
    }
  }

  .dice-header {
    display: flex;
    gap: 12px;
    width: 100%;
    max-width: 600px;
    justify-content: center;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      gap: 8px;
      max-width: 100%;
    }

    @media (max-width: 479px) {
      gap: 6px;
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .stat-card {
    background: linear-gradient(135deg, 
      rgba(10, 5, 17, 0.85) 0%, 
      rgba(139, 90, 158, 0.15) 50%,
      rgba(10, 5, 17, 0.85) 100%
    );
    backdrop-filter: blur(16px) saturate(1.2);
    border: 1px solid rgba(212, 165, 116, 0.3);
    border-radius: 16px;
    padding: 16px 18px;
    text-align: center;
    box-shadow: 
      0 8px 32px rgba(10, 5, 17, 0.4),
      inset 0 1px 0 rgba(212, 165, 116, 0.2);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 110px;
    animation: ${romanticPulse} 8s ease-in-out infinite;
    
    /* Romantic glow */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, 
        var(--love-letter-gold), 
        var(--deep-crimson-rose), 
        var(--love-letter-gold)
      );
      border-radius: 16px 16px 0 0;
      opacity: 0.6;
    }

    &.highlight {
      background: linear-gradient(135deg, 
        rgba(212, 165, 116, 0.2) 0%, 
        rgba(184, 51, 106, 0.15) 50%,
        rgba(139, 90, 158, 0.2) 100%
      );
      border: 1px solid rgba(212, 165, 116, 0.5);
      box-shadow: 
        0 8px 32px rgba(212, 165, 116, 0.3),
        inset 0 1px 0 rgba(212, 165, 116, 0.3);
      animation: ${candlestickSparkle} 4s ease-in-out infinite;
    }

    &:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 
        0 12px 40px rgba(212, 165, 116, 0.4),
        inset 0 1px 0 rgba(212, 165, 116, 0.3);
      border-color: rgba(212, 165, 116, 0.6);
    }

    @media (max-width: 768px) {
      padding: 12px 14px;
      min-width: 90px;
    }

    @media (max-width: 479px) {
      padding: 10px 12px;
      min-width: 80px;
      flex: 1;
    }
  }

  .stat-value {
    font-size: 20px;
    font-weight: 700;
    color: var(--love-letter-gold);
    margin-bottom: 4px;
    font-variant-numeric: tabular-nums;
    font-family: 'Libre Baskerville', serif;
    text-shadow: 0 2px 4px rgba(10, 5, 17, 0.8);

    @media (max-width: 768px) {
      font-size: 18px;
    }

    @media (max-width: 479px) {
      font-size: 16px;
    }

    .error {
      color: var(--deep-crimson-rose);
      font-size: 12px;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      
      @media (max-width: 479px) {
        font-size: 10px;
      }
    }
  }

  .stat-label {
    font-size: 11px;
    font-weight: 500;
    color: rgba(212, 165, 116, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-family: 'DM Sans', sans-serif;

    @media (max-width: 479px) {
      font-size: 10px;
      letter-spacing: 0.5px;
    }
  }
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

    @media (max-width: 768px) {
      margin: 8px 0;
    }
  }

  .target-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, 
      rgba(212, 165, 116, 0.3), 
      rgba(184, 51, 106, 0.15), 
      rgba(10, 5, 17, 0.8)
    );
    border: 2px solid rgba(212, 165, 116, 0.4);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 
      0 20px 40px rgba(10, 5, 17, 0.6),
      inset 0 4px 20px rgba(212, 165, 116, 0.2);
    position: relative;
    overflow: hidden;
    animation: ${romanticPulse} 6s ease-in-out infinite;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(from 0deg, 
        transparent, 
        rgba(212, 165, 116, 0.2), 
        transparent
      );
      animation: ${romanticRotate} 8s linear infinite;
      opacity: 0.6;
    }

    @media (max-width: 768px) {
      width: 100px;
      height: 100px;
    }

    @media (max-width: 479px) {
      width: 85px;
      height: 85px;
    }
  }

  .target-number {
    font-size: 36px;
    font-weight: 700;
    color: var(--love-letter-gold);
    z-index: 1;
    position: relative;
    font-variant-numeric: tabular-nums;
    font-family: 'Libre Baskerville', serif;
    text-shadow: 0 2px 8px rgba(10, 5, 17, 0.8);

    @media (max-width: 768px) {
      font-size: 32px;
    }

    @media (max-width: 479px) {
      font-size: 28px;
    }
  }

  .target-label {
    font-size: 11px;
    font-weight: 600;
    color: rgba(212, 165, 116, 0.8);
    z-index: 1;
    position: relative;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'DM Sans', sans-serif;

    @media (max-width: 479px) {
      font-size: 10px;
      letter-spacing: 0.8px;
    }
  }

  .dice-arena {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 600px;

    @media (max-width: 768px) {
      max-width: 100%;
    }
  }

  .dice-track-container {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (max-width: 479px) {
      gap: 12px;
    }
  }

  .result-marker {
    position: absolute;
    top: -55px;
    transform: translateX(-50%);
    z-index: 10;
    transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);

    @media (max-width: 479px) {
      top: -45px;
    }
  }

  .result-number {
    background: linear-gradient(135deg, 
      var(--deep-crimson-rose), 
      var(--soft-purple-twilight)
    );
    color: var(--love-letter-gold);
    border-radius: 12px;
    padding: 8px 12px;
    font-weight: 700;
    font-size: 14px;
    text-align: center;
    box-shadow: 
      0 8px 25px rgba(184, 51, 106, 0.4),
      inset 0 1px 0 rgba(212, 165, 116, 0.3);
    border: 1px solid rgba(212, 165, 116, 0.4);
    animation: resultAppear 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    font-variant-numeric: tabular-nums;
    font-family: 'Libre Baskerville', serif;

    @media (max-width: 479px) {
      font-size: 12px;
      padding: 6px 10px;
    }
  }

  .result-arrow {
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid var(--deep-crimson-rose);
    margin: 0 auto;

    @media (max-width: 479px) {
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid var(--deep-crimson-rose);
    }
  }

  @keyframes resultAppear {
    0% { transform: scale(0) rotate(180deg); opacity: 0; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  .dice-track {
    position: relative;
    height: 50px;
    display: flex;
    align-items: center;

    @media (max-width: 479px) {
      height: 40px;
    }
  }

  .track-background {
    position: absolute;
    width: 100%;
    height: 16px;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    box-shadow: 
      inset 0 2px 8px rgba(10, 5, 17, 0.5),
      0 2px 8px rgba(212, 165, 116, 0.1);
    border: 1px solid rgba(212, 165, 116, 0.2);

    @media (max-width: 479px) {
      height: 14px;
    }
  }

  .win-zone {
    background: linear-gradient(90deg, 
      var(--deep-crimson-rose), 
      var(--soft-purple-twilight)
    );
    transition: width 0.3s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 2px;
      height: 100%;
      background: var(--love-letter-gold);
      box-shadow: 0 0 10px rgba(212, 165, 116, 0.6);
    }
  }

  .lose-zone {
    background: linear-gradient(90deg, 
      rgba(139, 90, 158, 0.6), 
      rgba(10, 5, 17, 0.8)
    );
    transition: width 0.3s ease;
  }

  .track-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    gap: 12px;

    @media (max-width: 479px) {
      gap: 8px;
      margin-top: 6px;
    }
  }

  .label-win,
  .label-lose {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: linear-gradient(135deg, 
      rgba(10, 5, 17, 0.7) 0%, 
      rgba(139, 90, 158, 0.1) 100%
    );
    backdrop-filter: blur(8px);
    border-radius: 8px;
    padding: 8px 10px;
    border: 1px solid rgba(212, 165, 116, 0.2);
    flex: 1;
    font-family: 'DM Sans', sans-serif;

    @media (max-width: 479px) {
      padding: 6px 8px;
      gap: 2px;
    }

    span:first-child {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      @media (max-width: 479px) {
        font-size: 8px;
      }
    }

    span:last-child {
      font-size: 11px;
      font-weight: 500;
      font-variant-numeric: tabular-nums;

      @media (max-width: 479px) {
        font-size: 10px;
      }
    }
  }

  .label-win {
    color: var(--deep-crimson-rose);
  }

  .label-lose {
    color: rgba(139, 90, 158, 0.8);
  }

  /* Mobile responsive improvements */
  @media (max-width: 479px) {
    .dice-redesign {
      padding: 10px;
    }
    
    .dice-header {
      margin-bottom: 8px;
    }
    
    .roll-target {
      margin: 6px 0;
    }
    
    .dice-arena {
      margin-top: 8px;
    }
  }

  /* Additional romantic effects for mobile */
  @media (max-width: 768px) {
    &::before {
      font-size: 80px;
      top: 8%;
      left: 5%;
    }

    &::after {
      font-size: 70px;
      bottom: 8%;
      right: 5%;
    }
  }

  @media (max-width: 479px) {
    &::before {
      font-size: 60px;
      opacity: 0.1;
    }

    &::after {
      font-size: 50px;
      opacity: 0.08;
    }
  }

  .label-lose {
    color: rgba(139, 90, 158, 0.8);
  }
`
