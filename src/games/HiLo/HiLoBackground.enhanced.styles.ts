import styled from 'styled-components'

export const StyledHiLoBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4c1d95 0%, #7c2d12 15%, #991b1b 30%, #dc2626 45%, #ef4444 60%, #f87171 75%, #fca5a5 90%, #dc2626 100%);
  border-radius: 24px;
  border: 3px solid rgba(239, 68, 68, 0.4);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.7),
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    inset 0 -2px 4px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(239, 68, 68, 0.3);
  overflow: hidden;
  
  /* Floating card romance elements */
  &::before {
    content: '🃏';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 130px;
    opacity: 0.07;
    transform: rotate(-18deg);
    pointer-events: none;
    color: #7c2d12;
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.5);
  }

  &::after {
    content: '❤️';
    position: absolute;
    bottom: 12%;
    right: 8%;
    font-size: 110px;
    opacity: 0.08;
    transform: rotate(25deg);
    pointer-events: none;
    color: #dc2626;
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.5);
  }

  /* Override GameScreenFrame's dark background */
  & .absolute.inset-\\[2px\\].rounded-\\[0\\.65rem\\].bg-\\[\\#0c0c11\\] {
    background: transparent !important;
  }

  /* General override for any dark background in the frame */
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
    gap: 25px;
    transform: rotateX(1deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 40px 30px;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100%;
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
    padding: 25px;
    color: #fef2f2;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
`
