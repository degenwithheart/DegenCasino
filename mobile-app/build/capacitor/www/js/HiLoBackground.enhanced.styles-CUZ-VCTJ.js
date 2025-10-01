import{d as e,m as a}from"./index-BarUt2o_.js";const t=a`
  0%, 100% { 
    transform: rotate(-18deg) scale(1);
    text-shadow: 
      0 0 25px rgba(212, 165, 116, 0.5),
      3px 3px 8px rgba(10, 5, 17, 0.8);
  }
  50% { 
    transform: rotate(-12deg) scale(1.05);
    text-shadow: 
      0 0 35px rgba(212, 165, 116, 0.7),
      3px 3px 12px rgba(10, 5, 17, 0.9);
  }
`,r=a`
  0%, 100% { 
    transform: rotate(25deg) scale(1);
    text-shadow: 
      0 0 30px rgba(184, 51, 106, 0.6),
      3px 3px 8px rgba(10, 5, 17, 0.8);
  }
  50% { 
    transform: rotate(30deg) scale(1.1);
    text-shadow: 
      0 0 40px rgba(184, 51, 106, 0.8),
      3px 3px 12px rgba(10, 5, 17, 0.9);
  }
`,o=a`
  0% { 
    background-position: 0% 50%; 
    opacity: 0.95;
  }
  50% { 
    background-position: 100% 50%;
    opacity: 0.98;
  }
  100% { 
    background-position: 0% 50%;
    opacity: 0.95;
  }
`,n=e.div`
  perspective: 100px;
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(10, 5, 17, 0.95) 0%, 
    rgba(139, 90, 158, 0.25) 15%,
    rgba(184, 51, 106, 0.3) 30%,
    rgba(212, 165, 116, 0.2) 45%,
    rgba(184, 51, 106, 0.3) 60%,
    rgba(139, 90, 158, 0.25) 75%,
    rgba(10, 5, 17, 0.95) 100%
  );
  background-size: 400% 400%;
  animation: ${o} 8s ease-in-out infinite;
  border-radius: 20px;
  border: 2px solid rgba(212, 165, 116, 0.4);
  box-shadow: 
    0 25px 50px rgba(10, 5, 17, 0.7),
    inset 0 2px 4px rgba(212, 165, 116, 0.2),
    inset 0 -2px 4px rgba(10, 5, 17, 0.5),
    0 0 40px rgba(212, 165, 116, 0.25);
  overflow: hidden;
  
  /* Romantic card elements */
  &::before {
    content: '🃏';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 100px;
    opacity: 0.15;
    color: rgba(212, 165, 116, 0.5);
    z-index: 0;
    pointer-events: none;
    animation: ${t} 8s ease-in-out infinite;

    @media (max-width: 768px) {
      font-size: 80px;
      top: 6%;
      left: 4%;
    }

    @media (max-width: 479px) {
      font-size: 60px;
      opacity: 0.1;
    }
  }

  &::after {
    content: '💕';
    position: absolute;
    bottom: 12%;
    right: 8%;
    font-size: 85px;
    opacity: 0.18;
    color: rgba(184, 51, 106, 0.6);
    z-index: 0;
    pointer-events: none;
    animation: ${r} 5s ease-in-out infinite;

    @media (max-width: 768px) {
      font-size: 70px;
      bottom: 8%;
      right: 5%;
    }

    @media (max-width: 479px) {
      font-size: 50px;
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

  /* Allow content to dictate vertical growth while still filling available space */
  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
  }

  .hilo-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    transform: rotateX(1deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 32px 24px;
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'DM Sans', sans-serif;

    @media (max-width: 768px) {
      gap: 16px;
      padding: 24px 16px;
      transform: rotateX(0.5deg);
    }

    @media (max-width: 479px) {
      gap: 12px;
      padding: 20px 12px;
      transform: none;
    }
    /* Allow content to size naturally so decorative bands don't stretch the whole viewport */
    min-height: auto;
    box-sizing: border-box;
  }

  /* Additional romance elements */
  .romance-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '🌹';
      position: absolute;
      top: 35%;
      right: 15%;
      font-size: 95px;
      opacity: 0.06;
      transform: rotate(-22deg);
      color: #ef4444;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.4));
    }

    &::after {
      content: '🎴';
      position: absolute;
      bottom: 30%;
      left: 12%;
      font-size: 85px;
      opacity: 0.07;
      transform: rotate(30deg);
      color: #7c2d12;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.4));
    }
  }

  /* Razor's edge overlay */
  .razors-edge-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: 
      radial-gradient(circle at 30% 20%, rgba(239, 68, 68, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(124, 45, 18, 0.12) 0%, transparent 60%),
      radial-gradient(circle at 20% 70%, rgba(153, 27, 27, 0.1) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  @keyframes fragile-romance {
    0%, 100% {
      opacity: 0.8;
      filter: brightness(1);
    }
    50% {
      opacity: 1;
      filter: brightness(1.2);
    }
  }

  @keyframes streak-tension {
    0%, 100% {
      transform: scale(1);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
  }

  /* Enhanced styling for hilo-specific elements */
  .card-romance-area {
    background: 
      linear-gradient(135deg, 
        rgba(76, 29, 149, 0.9) 0%,
        rgba(124, 45, 18, 0.85) 50%,
        rgba(76, 29, 149, 0.9) 100%
      );
    border: 2px solid rgba(239, 68, 68, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.5),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
    padding: 20px;
    color: #fca5a5;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }

  .streak-display {
    background: 
      linear-gradient(135deg, 
        rgba(153, 27, 27, 0.9) 0%,
        rgba(220, 38, 38, 0.85) 50%,
        rgba(153, 27, 27, 0.9) 100%
      );
    border: 3px solid rgba(239, 68, 68, 0.6);
    border-radius: 20px;
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.15),
      0 0 25px rgba(239, 68, 68, 0.3);
    padding: 25px;
    color: #fef2f2;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    animation: fragile-romance 4s ease-in-out infinite;
  }

  .choices-container {
    background: 
      linear-gradient(135deg, 
        rgba(76, 29, 149, 0.8) 0%,
        rgba(124, 45, 18, 0.75) 50%,
        rgba(76, 29, 149, 0.8) 100%
      );
    border: 2px solid rgba(239, 68, 68, 0.3);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 6px 24px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.05);
  }

  /* Tension indicator for streak building */
  .tension-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 350px;
    height: 350px;
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 50%;
    animation: streak-tension 5s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  /* Result area for consistent layout */
  .romance-result-area {
    /* Keep the result area visually prominent but constrained so it appears as a panel/border, not a full band */
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    background: 
      linear-gradient(135deg, 
        rgba(124, 45, 18, 0.9) 0%,
        rgba(153, 27, 27, 0.85) 50%,
        rgba(124, 45, 18, 0.9) 100%
      );
    border: 2px solid rgba(239, 68, 68, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 10px 35px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.12),
      0 0 20px rgba(239, 68, 68, 0.3);
    padding: 18px 25px;
    color: #fef2f2;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
`;export{n as S};
