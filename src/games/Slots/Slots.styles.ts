import styled, { keyframes } from 'styled-components'
import { GRID_WIDTH, GRID_HEIGHT } from './constants'

const mysticalAura = keyframes`
  0% { 
    background-position: 0% 50%; 
    opacity: 0.3;
  }
  50% { 
    background-position: 100% 50%;
    opacity: 0.6;
  }
  100% { 
    background-position: 0% 50%;
    opacity: 0.3;
  }
`;

const romanticSparkle = keyframes`
  0%, 100% { 
    transform: rotate(-15deg) scale(1);
    text-shadow: 
      0 0 20px rgba(212, 165, 116, 0.5),
      3px 3px 8px rgba(10, 5, 17, 0.8);
  }
  50% { 
    transform: rotate(-10deg) scale(1.05);
    text-shadow: 
      0 0 30px rgba(212, 165, 116, 0.7),
      3px 3px 12px rgba(10, 5, 17, 0.9);
  }
`;

const loveLetterTwinkle = keyframes`
  0%, 100% { 
    transform: rotate(18deg) scale(1);
    text-shadow: 
      0 0 25px rgba(184, 51, 106, 0.6),
      3px 3px 8px rgba(10, 5, 17, 0.8);
  }
  50% { 
    transform: rotate(25deg) scale(1.08);
    text-shadow: 
      0 0 35px rgba(184, 51, 106, 0.8),
      3px 3px 12px rgba(10, 5, 17, 0.9);
  }
`;

export const StyledSlotsBackground = styled.div`
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  background-size: 400% 400%;
  animation: ${mysticalAura} 12s ease-in-out infinite;
  border-radius: 20px;
  border: 2px solid rgba(212, 165, 116, 0.3);
  box-shadow: 
    0 25px 50px rgba(10, 5, 17, 0.8),
    inset 0 2px 4px rgba(212, 165, 116, 0.15),
    inset 0 -2px 4px rgba(10, 5, 17, 0.6),
    0 0 35px rgba(212, 165, 116, 0.2);
  overflow: hidden;
  z-index: 0;

  /* Romantic glow overlay */
  &::before {
    content: '🎰';
    position: absolute;
    top: 12%;
    left: 7%;
    font-size: 100px;
    opacity: 0.12;
    color: rgba(212, 165, 116, 0.4);
    z-index: 0;
    pointer-events: none;
    animation: ${romanticSparkle} 8s ease-in-out infinite;

    @media (max-width: 768px) {
      font-size: 80px;
      top: 8%;
      left: 5%;
    }

    @media (max-width: 479px) {
      font-size: 60px;
      opacity: 0.08;
    }
  }

  &::after {
    content: '💝';
    position: absolute;
    bottom: 15%;
    right: 8%;
    font-size: 90px;
    opacity: 0.1;
    color: rgba(184, 51, 106, 0.4);
    z-index: 0;
    pointer-events: none;
    animation: ${loveLetterTwinkle} 10s ease-in-out infinite;

    @media (max-width: 768px) {
      font-size: 70px;
      bottom: 12%;
      right: 6%;
    }

    @media (max-width: 479px) {
      font-size: 50px;
      opacity: 0.07;
    }
  }
`

export const StyledSlots = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  padding: 0;
  overflow: hidden;
  max-height: 500px;
  margin: auto;

    .slots-content {
    width: 100%;
    max-width: 800px;
    height: 100%;
    margin: 0 auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  .slots {
    width: 100%;
    max-width: 650px;
    aspect-ratio: 3/2;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background: rgba(10, 5, 17, 0.4);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .slots-reels-container {
    display: grid;
    grid-template-columns: repeat(${GRID_WIDTH}, 1fr);
    gap: 4px;
    width: 100%;
    height: 280px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 8px;
    background: linear-gradient(
      to bottom,
      rgba(10, 5, 17, 0.95) 0%,
      rgba(30, 15, 45, 0.9) 50%,
      rgba(10, 5, 17, 0.9) 100%
    );
    border-radius: 15px;
    border: 1px solid rgba(212, 165, 116, 0.2);
    box-shadow:
      0 10px 30px rgba(10, 5, 17, 0.7),
      inset 0 2px 6px rgba(212, 165, 116, 0.1),
      inset 0 -2px 6px rgba(10, 5, 17, 0.4),
      0 0 20px rgba(212, 165, 116, 0.1);
    min-height: 450px;
    height: calc(100vh - 250px);
    max-height: 650px;
    
    /* Romantic reel container styling */
    > * {
      flex: 1;
      max-width: calc((100% - (${GRID_WIDTH - 1} * 15px)) / ${GRID_WIDTH});
      height: 100%;
      min-height: 350px;
      max-height: calc(90vh - 200px);
      border-radius: 12px;
      background: rgba(10, 5, 17, 0.6);
      box-shadow:
        0 5px 15px rgba(10, 5, 17, 0.5),
        inset 0 1px 3px rgba(212, 165, 116, 0.1);
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }

    @media (max-width: 768px) {
      gap: 10px;
      padding: 15px;
      min-height: 400px;
      
      > * {
        border-radius: 8px;
      }
    }

    @media (max-width: 479px) {
      gap: 5px;
      padding: 10px;
      min-height: 350px;
      
      > * {
        border-radius: 6px;
      }
    }
  }
  
  .winning-line-display {
    margin-bottom: 25px;
    padding: 15px;
    background: rgba(212, 165, 116, 0.05);
    border: 1px solid rgba(212, 165, 116, 0.15);
    border-radius: 12px;
    box-shadow:
      0 5px 15px rgba(10, 5, 17, 0.3),
      inset 0 1px 3px rgba(212, 165, 116, 0.05);
    
    @media (max-width: 768px) {
      margin-bottom: 20px;
      padding: 12px;
    }
    
    @media (max-width: 479px) {
      margin-bottom: 15px;
      padding: 10px;
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      filter: brightness(1) saturate(1);
    }
    50% {
      transform: scale(1.05);
      filter: brightness(1.2) saturate(1.1);
    }
  }

  @keyframes reveal-glow {
    0% {
      border-color: rgba(212, 165, 116, 0.3);
      box-shadow: 0 0 20px rgba(212, 165, 116, 0.2);
      filter: brightness(1);
    }
    50% {
      border-color: rgba(212, 165, 116, 0.6);
      box-shadow: 0 0 40px rgba(212, 165, 116, 0.4);
      filter: brightness(1.3);
    }
    100% {
      border-color: rgba(212, 165, 116, 0.3);
      box-shadow: 0 0 20px rgba(212, 165, 116, 0.2);
      filter: brightness(1);
    }
  }

  @keyframes shine {
    0% {
      background: rgba(212, 165, 116, 0);
      box-shadow: none;
    }
    50% {
      background: rgba(212, 165, 116, 0.1);
      box-shadow: 0 0 30px rgba(212, 165, 116, 0.3);
    }
    100% {
      background: rgba(212, 165, 116, 0);
      box-shadow: none;
    }
  }

  @keyframes win-celebration {
    0% {
      transform: scale(1);
      filter: brightness(1) saturate(1);
    }
    10% {
      transform: scale(1.1);
      filter: brightness(1.4) saturate(1.2);
    }
    20% {
      transform: scale(1);
      filter: brightness(1.2) saturate(1.1);
    }
    100% {
      transform: scale(1);
      filter: brightness(1) saturate(1);
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
    padding: 10px;
    text-transform: uppercase;
    position: relative;
    padding: 10px;
    width: 100%;
    border-radius: 10px;
    border-spacing: 10px;
    border: 1px solid #ffec63;
    background-color: #ffec6311;
    color: #ffec63;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
  }

  .result[data-good="true"] {
    animation: result-flash 5s infinite;
  }

  .slots {
    display: flex;
    gap: 20px;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 10px;
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
`
