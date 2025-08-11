import styled, { keyframes } from "styled-components";

const glowAnimation = keyframes`
  0%, 100% {
    box-shadow: 0 0 10px rgba(255, 236, 99, 0.8), 0 0 20px rgba(255, 236, 99, 0.6), 0 0 30px rgba(255, 236, 99, 0.4);
    background: rgba(255, 236, 99, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 236, 99, 1), 0 0 30px rgba(255, 236, 99, 0.8), 0 0 40px rgba(255, 236, 99, 0.6);
    background: rgba(255, 236, 99, 0.4);
  }
`;

const scatterGlowAnimation = keyframes`
  0%, 100% {
    box-shadow: 0 0 15px rgba(255, 107, 107, 0.8), 0 0 25px rgba(255, 107, 107, 0.6), 0 0 35px rgba(255, 107, 107, 0.4);
    background: rgba(255, 107, 107, 0.2);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 107, 107, 1), 0 0 35px rgba(255, 107, 107, 0.8), 0 0 45px rgba(255, 107, 107, 0.6);
    background: rgba(255, 107, 107, 0.4);
  }
`;

const lineAnimation = keyframes`
  0% {
    stroke-dasharray: 0, 1000;
  }
  100% {
    stroke-dasharray: 1000, 0;
  }
`;

export const StyledWinningLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
  z-index: 10;

  .payline-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
  }

  .winning-line {
    animation: ${lineAnimation} 1s ease-in-out forwards;
    stroke-dasharray: 0, 1000;
    filter: drop-shadow(0 0 6px rgba(255, 236, 99, 0.8));
  }

  .winning-dot {
    animation: ${glowAnimation} 2s ease-in-out infinite;
    filter: drop-shadow(0 0 4px rgba(255, 236, 99, 0.8));
  }

  .payline-highlight {
    border-radius: 8px;
    animation: ${glowAnimation} 2s ease-in-out infinite;
    z-index: 8;
  }

  .scatter-highlight {
    border-radius: 8px;
    animation: ${scatterGlowAnimation} 2s ease-in-out infinite;
    z-index: 8;
  }
`
