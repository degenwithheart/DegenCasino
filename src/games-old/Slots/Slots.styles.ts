import styled, { keyframes } from 'styled-components'

// Romantic degen trader animations for slots
const romanticSlotGlow = keyframes`
  0%, 100% { 
    transform: rotate(-12deg) scale(1);
    text-shadow: 
      0 0 20px rgba(212, 165, 116, 0.4),
      3px 3px 8px rgba(10, 5, 17, 0.8);
  }
  50% { 
    transform: rotate(-8deg) scale(1.05);
    text-shadow: 
      0 0 30px rgba(212, 165, 116, 0.6),
      3px 3px 12px rgba(10, 5, 17, 0.9);
  }
`;

const loveLetterSparkle = keyframes`
  0%, 100% { 
    transform: rotate(20deg) scale(1);
    text-shadow: 
      0 0 25px rgba(184, 51, 106, 0.5),
      3px 3px 8px rgba(10, 5, 17, 0.8);
  }
  50% { 
    transform: rotate(25deg) scale(1.08);
    text-shadow: 
      0 0 35px rgba(184, 51, 106, 0.7),
      3px 3px 12px rgba(10, 5, 17, 0.9);
  }
`;

const romanticFlicker = keyframes`
  0%, 100% { 
    opacity: 0.05;
    transform: rotate(-20deg) scale(1);
  }
  50% { 
    opacity: 0.08;
    transform: rotate(-15deg) scale(1.02);
  }
`;

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
  background: linear-gradient(135deg, 
    rgba(10, 5, 17, 0.95) 0%, 
    rgba(139, 90, 158, 0.25) 20%,
    rgba(184, 51, 106, 0.2) 40%,
    rgba(212, 165, 116, 0.15) 60%,
    rgba(139, 90, 158, 0.25) 80%,
    rgba(10, 5, 17, 0.95) 100%
  );
  border-radius: 20px;
  border: 2px solid rgba(212, 165, 116, 0.3);
  box-shadow: 
    0 25px 50px rgba(10, 5, 17, 0.7),
    inset 0 2px 4px rgba(212, 165, 116, 0.15),
    inset 0 -2px 4px rgba(10, 5, 17, 0.5),
    0 0 30px rgba(212, 165, 116, 0.2);
  overflow: hidden;
  
  /* Romantic slot machine elements */
  &::before {
    content: '🎰';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 90px;
    opacity: 0.12;
    color: rgba(212, 165, 116, 0.4);
    z-index: 0;
    pointer-events: none;
    animation: ${romanticSlotGlow} 8s ease-in-out infinite;

    @media (max-width: 768px) {
      font-size: 70px;
      top: 6%;
      left: 4%;
    }

    @media (max-width: 479px) {
      font-size: 50px;
      opacity: 0.08;
    }
  }

  &::after {
    content: '�';
    position: absolute;
    bottom: 12%;
    right: 8%;
    font-size: 80px;
    opacity: 0.15;
    color: rgba(184, 51, 106, 0.5);
    z-index: 0;
    pointer-events: none;
    animation: ${loveLetterSparkle} 6s ease-in-out infinite;

    @media (max-width: 768px) {
      font-size: 60px;
      bottom: 8%;
      right: 5%;
    }

    @media (max-width: 479px) {
      font-size: 45px;
      opacity: 0.1;
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
    height: 100%;
  }

  .slots-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0;
    transform: rotateX(2deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 0;
    max-width: 1400px; /* Increased max-width for 6-reel layout */
    margin: 0 auto;
    min-height: 100%;
    width: 100%;
    font-family: 'DM Sans', sans-serif;

    @media (max-width: 768px) {
      transform: rotateX(1deg);
      max-width: 100%;
    }

    @media (max-width: 479px) {
      transform: none;
      padding: 0 4px; /* Reduced padding for very small screens */
    }
  }

  /* Romantic casino background elements */
  .casino-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '�';
      position: absolute;
      top: 40%;
      right: 12%;
      font-size: 70px;
      color: rgba(184, 51, 106, 0.3);
      animation: ${romanticFlicker} 10s ease-in-out infinite;

      @media (max-width: 768px) {
        font-size: 50px;
        right: 8%;
      }

      @media (max-width: 479px) {
        font-size: 35px;
        opacity: 0.06;
      }
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

  @keyframes slotsPulse {
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
    width: 100%;
    overflow: hidden;

    /* Responsive width constraints */
    @media (min-width: 768px) {
      min-width: 1000px; /* 6-reel layout on desktop */
    }

    @media (max-width: 767px) {
      min-width: 500px; /* 4-reel layout on mobile */
    }
    
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
    justify-content: center;
    align-items: center;
    flex: 1;
    perspective: 800px;
    transform: rotateX(-5deg); /* Slight tilt so top appears further back */
    position: relative;
    width: 100%;

    /* Responsive layout adjustments */
    @media (min-width: 768px) {
      gap: 8px; /* Tighter gap for 6 reels on desktop */
      padding: 40px 10px;
      min-width: 700px;
    }

    @media (max-width: 767px) {
      gap: 12px; /* More generous gap for 4 reels on mobile */
      padding: 40px 20px;
      min-width: 400px;
    }
  }

  .winning-line-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px; /* Match new reel height (3 rows × 100px) */
    position: relative;
    z-index: 10;
    pointer-events: none;

    /* Responsive width based on number of reels */
    @media (min-width: 768px) {
      width: 40px; /* Smaller width for 6-reel desktop layout */
    }

    @media (max-width: 767px) {
      width: 50px; /* Normal width for 4-reel mobile layout */
    }
  }

  .winning-line-arrow-left {
    @media (min-width: 768px) {
      margin-right: 5px; /* Tighter margin for 6-reel desktop */
    }

    @media (max-width: 767px) {
      margin-right: 10px; /* Normal margin for 4-reel mobile */
    }
  }

  .winning-line-arrow-right {
    @media (min-width: 768px) {
      margin-left: 5px; /* Tighter margin for 6-reel desktop */
    }

    @media (max-width: 767px) {
      margin-left: 10px; /* Normal margin for 4-reel mobile */
    }
  }

  .arrow-icon {
    color: #ffd700;
    text-shadow: 
      0 0 10px rgba(255, 215, 0, 0.8),
      0 0 20px rgba(255, 215, 0, 0.6),
      0 0 30px rgba(255, 215, 0, 0.4);
    animation: arrowPulse 2s ease-in-out infinite;
    /* Position the arrow to align perfectly with the ECG line on middle row (3-row layout) */
    transform: translateY(0px); /* Centered for middle row of 3-row layout */
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));

    /* Responsive sizing */
    @media (min-width: 768px) {
      font-size: 30px; /* Smaller for 6-reel desktop layout */
    }

    @media (max-width: 767px) {
      font-size: 36px; /* Normal size for 4-reel mobile layout */
    }
  }

  .winning-line-arrow-left .arrow-icon {
    transform: translateY(0px) rotate(0deg);
  }

  .winning-line-arrow-right .arrow-icon {
    transform: translateY(0px) rotate(0deg);
  }

  @keyframes arrowPulse {
    0%, 100% {
      opacity: 0.7;
      transform: translateY(0px) scale(1); /* Updated to match ECG line exactly */
    }
    50% {
      opacity: 1;
      transform: translateY(0px) scale(1.1); /* Updated to match ECG line exactly */
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
    transform: translateY(0px); /* Position at middle row for 3-row layout */
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
      gap: 1px; /* Very tight gap for small phones to fit 6 reels */
      padding: 15px 2px; /* Minimal padding */
      overflow-x: auto; /* Allow horizontal scroll on very small screens */
    }

    .winning-line-arrow {
      width: 15px; /* Very small arrows */
      display: none; /* Hide arrows on very small screens */
    }

    .arrow-icon {
      font-size: 12px;
    }
  }

  @media (min-width: 481px) and (max-width: 640px) {
    .slots-reels {
      gap: 3px; /* Tighter gap for 6 reels on mobile */
      padding: 20px 4px; /* Further reduced padding for mobile */
    }

    .winning-line-arrow {
      width: 20px; /* Smaller arrows for mobile */
    }

    .winning-line-arrow-left {
      margin-right: 1px;
    }

    .winning-line-arrow-right {
      margin-left: 1px;
    }

    .arrow-icon {
      font-size: 16px; /* Smaller arrow icons */
    }
  }

  @media (min-width: 641px) and (max-width: 768px) {
    .slots-reels {
      gap: 5px; /* Tighter gap for tablets */
      padding: 25px 8px;
    }

    .winning-line-arrow {
      width: 28px;
    }

    .winning-line-arrow-left {
      margin-right: 3px;
    }

    .winning-line-arrow-right {
      margin-left: 3px;
    }

    .arrow-icon {
      font-size: 20px;
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
      gap: 8px; /* Further reduced for 6 reels */
      padding: 35px 15px;
    }

    .winning-line-arrow {
      width: 40px;
    }

    .winning-line-arrow-left {
      margin-right: 5px;
    }

    .winning-line-arrow-right {
      margin-left: 5px;
    }

    .arrow-icon {
      font-size: 30px;
    }
  }
`
