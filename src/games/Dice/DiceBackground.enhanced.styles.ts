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
    justify-content: flex-start;
    align-items: center;
    gap: clamp(12px, 2vh, 24px);
    padding: clamp(8px, 1.5vh, 20px);
    height: 100%;
    position: relative;
    z-index: 2;
    font-family: 'DM Sans', sans-serif;

    @media (max-width: 768px) {
      gap: clamp(8px, 1.5vh, 16px);
      padding: clamp(8px, 1vh, 16px);
    }

    @media (max-width: 479px) {
      gap: clamp(6px, 1vh, 12px);
      padding: clamp(6px, 0.8vh, 12px);
    }
  }

  .dice-header {
    display: flex;
    gap: clamp(6px, 1.5vw, 16px);
    width: 100%;
    max-width: min(90vw, 800px);
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: clamp(8px, 1.5vh, 16px);

    @media (max-width: 768px) {
      gap: clamp(6px, 1.2vw, 12px);
      max-width: 95vw;
      margin-bottom: clamp(6px, 1vh, 12px);
    }

    @media (max-width: 479px) {
      gap: clamp(4px, 1vw, 8px);
      flex-direction: row;
      justify-content: space-between;
      max-width: 98vw;
      margin-bottom: clamp(4px, 0.8vh, 10px);
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
    border-radius: clamp(12px, 2vw, 18px);
    padding: clamp(12px, 2vh, 20px) clamp(14px, 2.5vw, 22px);
    text-align: center;
    box-shadow: 
      0 8px 32px rgba(10, 5, 17, 0.4),
      inset 0 1px 0 rgba(212, 165, 116, 0.2);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: clamp(80px, 15vw, 130px);
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

    &.result-active {
      background: linear-gradient(135deg, 
        rgba(184, 51, 106, 0.2) 0%, 
        rgba(139, 90, 158, 0.15) 50%,
        rgba(212, 165, 116, 0.2) 100%
      );
      border: 1px solid rgba(184, 51, 106, 0.5);
      box-shadow: 
        0 8px 32px rgba(184, 51, 106, 0.3),
        inset 0 1px 0 rgba(184, 51, 106, 0.3);
      animation: ${romanticPulse} 3s ease-in-out infinite;
    }

    &.result-inactive {
      background: linear-gradient(135deg, 
        rgba(10, 5, 17, 0.6) 0%, 
        rgba(139, 90, 158, 0.05) 50%,
        rgba(10, 5, 17, 0.6) 100%
      );
      border: 1px solid rgba(212, 165, 116, 0.2);
      opacity: 0.7;
    }

    &:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 
        0 12px 40px rgba(212, 165, 116, 0.4),
        inset 0 1px 0 rgba(212, 165, 116, 0.3);
      border-color: rgba(212, 165, 116, 0.6);
    }

    @media (max-width: 768px) {
      padding: clamp(10px, 1.8vh, 16px) clamp(12px, 2vw, 18px);
      min-width: clamp(75px, 18vw, 110px);
    }

    @media (max-width: 479px) {
      padding: clamp(8px, 1.5vh, 14px) clamp(10px, 1.8vw, 16px);
      min-width: clamp(70px, 25vw, 100px);
      flex: 1;
    }
  }

  .stat-value {
    font-size: clamp(16px, 2.5vw, 24px);
    font-weight: 700;
    color: var(--love-letter-gold);
    margin-bottom: clamp(2px, 0.5vh, 6px);
    font-variant-numeric: tabular-nums;
    font-family: 'Libre Baskerville', serif;
    text-shadow: 0 2px 4px rgba(10, 5, 17, 0.8);

    @media (max-width: 768px) {
      font-size: clamp(14px, 3vw, 20px);
    }

    @media (max-width: 479px) {
      font-size: clamp(12px, 3.5vw, 18px);
    }

    .error {
      color: var(--deep-crimson-rose);
      font-size: clamp(10px, 1.5vw, 14px);
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      
      @media (max-width: 479px) {
        font-size: clamp(8px, 2vw, 12px);
      }
    }
  }

  .stat-label {
    font-size: clamp(9px, 1.4vw, 13px);
    font-weight: 500;
    color: rgba(212, 165, 116, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-family: 'DM Sans', sans-serif;

    @media (max-width: 479px) {
      font-size: clamp(8px, 1.6vw, 11px);
      letter-spacing: 0.5px;
    }
  }


  .roll-target {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: clamp(8px, 2vh, 20px);

    @media (max-width: 768px) {
      margin-bottom: clamp(6px, 1.5vh, 16px);
    }

    @media (max-width: 479px) {
      margin-bottom: clamp(4px, 1vh, 12px);
    }
  }

  .target-circle {
    width: clamp(85px, 12vw, 150px);
    height: clamp(85px, 12vw, 150px);
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
      width: clamp(80px, 15vw, 120px);
      height: clamp(80px, 15vw, 120px);
    }

    @media (max-width: 479px) {
      width: clamp(75px, 18vw, 100px);
      height: clamp(75px, 18vw, 100px);
    }
  }

  .target-number {
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 700;
    color: var(--love-letter-gold);
    z-index: 1;
    position: relative;
    font-variant-numeric: tabular-nums;
    font-family: 'Libre Baskerville', serif;
    text-shadow: 0 2px 8px rgba(10, 5, 17, 0.8);

    @media (max-width: 768px) {
      font-size: clamp(26px, 5vw, 36px);
    }

    @media (max-width: 479px) {
      font-size: clamp(24px, 6vw, 32px);
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
    max-width: min(90vw, 800px);
    min-height: 0; /* Allow flex shrinking */

    @media (max-width: 768px) {
      max-width: 95vw;
    }

    @media (max-width: 479px) {
      max-width: 98vw;
    }
  }

  .dice-track-container {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: clamp(8px, 2vh, 20px);
    min-height: 0; /* Allow flex shrinking */

    @media (max-width: 479px) {
      gap: clamp(6px, 1.5vh, 12px);
    }
  }



  .dice-track {
    position: relative;
    height: clamp(40px, 6vh, 70px);
    display: flex;
    align-items: center;

    @media (max-width: 479px) {
      height: clamp(35px, 5vh, 50px);
    }
  }

  .track-background {
    position: absolute;
    width: 100%;
    height: clamp(14px, 2.5vh, 24px);
    border-radius: clamp(7px, 1.25vh, 12px);
    overflow: hidden;
    display: flex;
    box-shadow: 
      inset 0 2px 8px rgba(10, 5, 17, 0.5),
      0 2px 8px rgba(212, 165, 116, 0.1);
    border: 1px solid rgba(212, 165, 116, 0.2);

    @media (max-width: 479px) {
      height: clamp(12px, 2vh, 18px);
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
    margin-top: clamp(16px, 3vh, 24px);
    gap: clamp(8px, 2vw, 16px);

    @media (max-width: 479px) {
      gap: clamp(6px, 2vw, 12px);
      margin-top: clamp(12px, 2vh, 18px);
    }
  }

  .label-win,
  .label-lose {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(2px, 0.5vh, 6px);
    background: linear-gradient(135deg, 
      rgba(10, 5, 17, 0.7) 0%, 
      rgba(139, 90, 158, 0.1) 100%
    );
    backdrop-filter: blur(8px);
    border-radius: clamp(6px, 1vh, 10px);
    padding: clamp(6px, 1.2vh, 12px) clamp(8px, 1.5vw, 14px);
    border: 1px solid rgba(212, 165, 116, 0.2);
    flex: 1;
    font-family: 'DM Sans', sans-serif;

    @media (max-width: 479px) {
      padding: clamp(4px, 1vh, 8px) clamp(6px, 1.2vw, 10px);
      gap: clamp(1px, 0.3vh, 3px);
    }

    span:first-child {
      font-size: clamp(7px, 1.2vw, 11px);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      @media (max-width: 479px) {
        font-size: clamp(6px, 1.4vw, 9px);
      }
    }

    span:last-child {
      font-size: clamp(9px, 1.4vw, 13px);
      font-weight: 500;
      font-variant-numeric: tabular-nums;

      @media (max-width: 479px) {
        font-size: clamp(8px, 1.6vw, 11px);
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
      padding: clamp(6px, 0.8vh, 12px);
      gap: clamp(4px, 0.8vh, 8px);
    }
    
    .dice-header {
      margin-bottom: clamp(4px, 0.6vh, 8px);
    }
    
    .dice-arena {
      flex: 1;
      min-height: 0;
    }
    
    .dice-track-container {
      height: 100%;
      justify-content: space-around;
    }
  }

  /* Extra small screens */
  @media (max-width: 360px) {
    .dice-redesign {
      padding: 4px;
      gap: 4px;
    }
    
    .dice-header {
      margin-bottom: 4px;
      gap: 2px;
    }
    
    .stat-card {
      min-width: 65px;
      padding: 6px 8px;
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
