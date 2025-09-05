import styled from 'styled-components'

export const StyledSlots = styled.div`
  perspective: 100px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #581c87 0%, #7c3aed 25%, #a855f7 50%, #c084fc 75%, #e879f9 100%);
  border-radius: 24px;
  border: 3px solid rgba(168, 85, 247, 0.3);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    inset 0 -2px 4px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(168, 85, 247, 0.2);
  overflow: hidden;
  
  /* Floating slot machine background elements */
  &::before {
    content: '🎰';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 110px;
    opacity: 0.06;
    transform: rotate(-12deg);
    pointer-events: none;
    color: #a855f7;
    z-index: 0;
  }

  &::after {
    content: '💎';
    position: absolute;
    bottom: 12%;
    right: 8%;
    font-size: 95px;
    opacity: 0.08;
    transform: rotate(20deg);
    pointer-events: none;
    color: #c084fc;
    z-index: 0;
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

  .slots-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0;
    transform: rotateX(3deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 0;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100%;
  }

  /* Additional casino background elements */
  .casino-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '🍒';
      position: absolute;
      top: 40%;
      right: 12%;
      font-size: 85px;
      opacity: 0.05;
      transform: rotate(-20deg);
      color: #7c3aed;
    }

    &::after {
      content: '🔔';
      position: absolute;
      bottom: 30%;
      left: 10%;
      font-size: 75px;
      opacity: 0.07;
      transform: rotate(25deg);
      color: #e879f9;
    }
  }

  /* Decorative corner elements */
  .decorative-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 20, 147, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  @keyframes pulse {
    0%, 30% {
      transform: scale(1)
    }
    10% {
      transform: scale(1.3)
    }
  }

  @keyframes reveal-glow {
    0%, 30% {
      border-color: #2d2d57;
      background: #ffffff00;
    }
    10% {
      border-color: white;
      background: #ffffff33;
    }
  }

  @keyframes shine {
    0%, 30% {
      background: #ffffff00;
    }
    10% {
      background: #ffffff33;
    }
  }

  @keyframes result-flash {
    25%, 75% {
      background-color: #ffec63;
      color: #333;
    }
    50% {
      background-color: #ffec6311;
      color: #ffec63;
    }
  }
  @keyframes result-flash-2 {
    0%, 50% {
      background-color: #ffec6388;
      filter: brightness(2.5) contrast(1.5) saturate(10);
    }
    100% {
      background-color: #ffec6300;
      filter: brightness(1) contrast(1);
    }
  }

  .result {
    border: none;
    padding: 30px 40px;
    text-transform: uppercase;
    position: relative;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    border-radius: 20px;
    background: 
      linear-gradient(135deg, 
        rgba(30, 30, 50, 0.9) 0%,
        rgba(40, 25, 60, 0.85) 50%,
        rgba(25, 35, 55, 0.9) 100%
      );
    border: 3px solid transparent;
    background-image: 
      linear-gradient(135deg, rgba(30, 30, 50, 0.9), rgba(25, 35, 55, 0.9)),
      linear-gradient(135deg, 
        rgba(255, 236, 99, 0.7) 0%,
        rgba(255, 215, 0, 0.5) 50%,
        rgba(255, 236, 99, 0.7) 100%
      );
    background-origin: border-box;
    background-clip: content-box, border-box;
    color: #ffe066;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    letter-spacing: 1.5px;
    box-shadow: 
      0 12px 35px rgba(0, 0, 0, 0.4),
      0 6px 20px rgba(255, 236, 99, 0.15),
      inset 0 2px 0 rgba(255, 255, 255, 0.15);
    text-shadow: 
      0 0 15px rgba(255, 236, 99, 0.6),
      0 3px 6px rgba(0, 0, 0, 0.4);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        transparent 30%,
        rgba(255, 255, 255, 0.15) 50%,
        transparent 70%
      );
      border-radius: 20px;
      animation: shimmer 3s ease-in-out infinite;
    }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .result[data-good="true"] {
    animation: result-flash 2s infinite, victoryPulse 1s ease-in-out infinite alternate;
    background: 
      linear-gradient(135deg, 
        rgba(255, 215, 0, 0.2) 0%,
        rgba(255, 140, 0, 0.15) 50%,
        rgba(255, 215, 0, 0.2) 100%
      );
    border-image: linear-gradient(
      45deg,
      rgba(255, 215, 0, 0.8) 0%,
      rgba(255, 140, 0, 0.6) 50%,
      rgba(255, 215, 0, 0.8) 100%
    ) 1;
    box-shadow: 
      0 0 30px rgba(255, 215, 0, 0.4),
      0 0 60px rgba(255, 215, 0, 0.2),
      0 8px 25px rgba(0, 0, 0, 0.3);
  }

  @keyframes victoryPulse {
    0% { transform: scale(1); }
    100% { transform: scale(1.02); }
  }

  .slots {
    display: flex;
    flex-direction: column;
    gap: 0;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 25px;
    background: 
      linear-gradient(145deg, 
        rgba(30, 30, 30, 0.9) 0%,
        rgba(15, 15, 25, 0.95) 50%,
        rgba(20, 20, 30, 0.9) 100%
      );
    padding: 0;
    border: 3px solid transparent;
    background-image: 
      linear-gradient(145deg, rgba(30, 30, 30, 0.9), rgba(15, 15, 25, 0.95)),
      linear-gradient(145deg, 
        rgba(255, 215, 0, 0.4) 0%,
        rgba(220, 38, 127, 0.3) 25%,
        rgba(147, 51, 234, 0.4) 50%,
        rgba(59, 130, 246, 0.3) 75%,
        rgba(255, 215, 0, 0.4) 100%
      );
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.5),
      0 15px 30px rgba(147, 51, 234, 0.15),
      inset 0 2px 0 rgba(255, 255, 255, 0.1),
      inset 0 -2px 0 rgba(0, 0, 0, 0.2);
    position: relative;
    min-height: 300px;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
      background: linear-gradient(45deg, 
        rgba(255, 215, 0, 0.3) 0%,
        rgba(220, 38, 127, 0.2) 25%,
        rgba(147, 51, 234, 0.3) 50%,
        rgba(59, 130, 246, 0.2) 75%,
        rgba(255, 215, 0, 0.3) 100%
      );
      border-radius: 28px;
      z-index: -1;
      animation: borderGlow 3s ease-in-out infinite alternate;
    }
  }

  .winning-line-display {
    background: 
      linear-gradient(135deg, 
        rgba(10, 10, 20, 0.95) 0%,
        rgba(20, 15, 30, 0.9) 50%,
        rgba(15, 10, 25, 0.95) 100%
      );
    border-bottom: 2px solid rgba(147, 51, 234, 0.3);
    padding: 20px 30px;
    border-radius: 22px 22px 0 0;
    position: relative;
    
    &::before {
      content: 'WINNING COMBINATIONS';
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 10px;
      font-weight: bold;
      color: rgba(147, 51, 234, 0.8);
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  }

  .slots-reels {
    display: flex;
    gap: 12px; /* Reduced gap for 6 reels */
    justify-content: center;
    align-items: center;
    padding: 40px 20px; /* Reduced horizontal padding */
    flex: 1;
    perspective: 800px;
    transform: rotateX(-5deg); /* Slight tilt so top appears further back */
    position: relative;
  }

  .winning-line-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px; /* Match new reel height (4 rows × 100px) */
    width: 50px; /* Reduced width for 6-reel layout */
    position: relative;
    z-index: 10;
    pointer-events: none;
  }

  .winning-line-arrow-left {
    margin-right: 10px;
  }

  .winning-line-arrow-right {
    margin-left: 10px;
  }

  .arrow-icon {
    font-size: 36px;
    color: #ffd700;
    text-shadow: 
      0 0 10px rgba(255, 215, 0, 0.8),
      0 0 20px rgba(255, 215, 0, 0.6),
      0 0 30px rgba(255, 215, 0, 0.4);
    animation: arrowPulse 2s ease-in-out infinite;
    /* Position the arrow to align perfectly with the ECG line on 3rd row */
    transform: translateY(48px); /* Fine-tuned to match ECG line exactly */
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  }

  .winning-line-arrow-left .arrow-icon {
    transform: translateY(48px) rotate(0deg);
  }

  .winning-line-arrow-right .arrow-icon {
    transform: translateY(48px) rotate(0deg);
  }

  @keyframes arrowPulse {
    0%, 100% {
      opacity: 0.7;
      transform: translateY(48px) scale(1); /* Updated to match ECG line exactly */
    }
    50% {
      opacity: 1;
      transform: translateY(48px) scale(1.1); /* Updated to match ECG line exactly */
    }
  }

  /* ECG-style winning line animation */
  .ecg-winning-line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 3px;
    background: transparent;
    z-index: 15;
    pointer-events: none;
    transform: translateY(50px); /* Position at 3rd row */
    opacity: 0;
    transition: opacity 0.3s ease;
    
    &.active {
      opacity: 1;
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: #00ff41;
      box-shadow: 
        0 0 6px #00ff41,
        0 0 12px #00ff41,
        0 0 18px #00ff41;
      clip-path: inset(0 100% 0 0);
      animation: none;
    }
    
    &.active::before {
      animation: ecgDraw 4s ease-out 1s forwards, ecgLinePulse 1.5s ease-in-out 5s infinite;
    }
  }

  @keyframes ecgDraw {
    0% {
      clip-path: inset(0 100% 0 0);
    }
    100% {
      clip-path: inset(0 0% 0 0);
    }
  }

  @keyframes ecgLinePulse {
    0%, 100% {
      box-shadow: 
        0 0 6px #00ff41,
        0 0 12px #00ff41,
        0 0 18px #00ff41;
      filter: brightness(1);
      transform: scaleY(1);
    }
    50% {
      box-shadow: 
        0 0 20px #00ff41,
        0 0 40px #00ff41,
        0 0 60px #00ff41,
        0 0 80px #00ff41;
      filter: brightness(2.5);
      transform: scaleY(2);
    }
  }

  @keyframes borderGlow {
    0% { opacity: 0.6; }
    100% { opacity: 1; }
  }

  .slot::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
  }

  @keyframes reveal {
    0% {
      transform: translateY(100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0%);
      opacity: 1;
    }
  }

  .slotImage {
    aspect-ratio: 1/1;
    max-width: 100%;
    max-height: 100%;
  }

  /* Mobile responsive adjustments for arrows */
  @media (max-width: 480px) {
    .slots-reels {
      gap: 2px; /* Very tight gap for small phones */
      padding: 15px 4px; /* Minimal padding */
    }

    .winning-line-arrow {
      width: 20px; /* Very small arrows */
      display: none; /* Hide arrows on very small screens */
    }

    .arrow-icon {
      font-size: 16px;
    }
  }

  @media (min-width: 481px) and (max-width: 640px) {
    .slots-reels {
      gap: 4px; /* Tighter gap for 6 reels on mobile */
      padding: 20px 8px; /* Reduced padding for mobile */
    }

    .winning-line-arrow {
      width: 25px; /* Smaller arrows for mobile */
    }

    .winning-line-arrow-left {
      margin-right: 2px;
    }

    .winning-line-arrow-right {
      margin-left: 2px;
    }

    .arrow-icon {
      font-size: 20px; /* Smaller arrow icons */
    }
  }

  @media (min-width: 641px) and (max-width: 768px) {
    .slots-reels {
      gap: 6px; /* Tighter gap for tablets */
      padding: 25px 12px;
    }

    .winning-line-arrow {
      width: 32px;
    }

    .winning-line-arrow-left {
      margin-right: 4px;
    }

    .winning-line-arrow-right {
      margin-left: 4px;
    }

    .arrow-icon {
      font-size: 24px;
    }
  }

  @media (min-width: 769px) and (max-width: 899px) {
    .slots-reels {
      gap: 8px;
      padding: 30px 15px;
    }

    .winning-line-arrow {
      width: 38px;
    }

    .winning-line-arrow-left {
      margin-right: 5px;
    }

    .winning-line-arrow-right {
      margin-left: 5px;
    }

    .arrow-icon {
      font-size: 28px;
    }
  }

  @media (min-width: 900px) {
    .slots-reels {
      gap: 10px; /* Slightly reduced for 6 reels */
      padding: 35px 18px;
    }

    .winning-line-arrow {
      width: 42px;
    }

    .winning-line-arrow-left {
      margin-right: 6px;
    }

    .winning-line-arrow-right {
      margin-left: 6px;
    }

    .arrow-icon {
      font-size: 32px;
    }
  }
`
