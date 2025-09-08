import styled from "styled-components";

export const StyledItemPreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 15px 10px;
  background: transparent;
  border-radius: 0;
  border: none;
  box-shadow: none;
  margin-bottom: 0;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  & > div {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 8px;
    border: 2px solid transparent;
    background: 
      linear-gradient(145deg, 
        rgba(15, 15, 25, 0.9) 0%,
        rgba(25, 20, 35, 0.85) 100%
      );
    background-image: 
      linear-gradient(145deg, rgba(15, 15, 25, 0.9), rgba(25, 20, 35, 0.85)),
      linear-gradient(145deg, 
        rgba(59, 130, 246, 0.4) 0%,
        rgba(147, 51, 234, 0.3) 50%,
        rgba(220, 38, 127, 0.4) 100%
      );
    background-origin: border-box;
    background-clip: content-box, border-box;
    transition: all 0.3s ease;
    box-shadow: 
      0 4px 10px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 6px 15px rgba(0, 0, 0, 0.5),
        inset 0 2px 0 rgba(255, 255, 255, 0.2);
    }
  }

  & > div.hidden {
    opacity: 0.4;
    filter: grayscale(0.6);
    transform: scale(0.95);
  }

  /* Winning item animation */
  & > div.winning {
    animation: winningPulse 1.5s ease-in-out infinite, winningGlow 2s ease-in-out infinite;
    transform: scale(1.05);
    
    & > .icon img {
      filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)) 
              drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
    }
    
    & > .multiplier {
      animation: multiplierGlow 1s ease-in-out infinite;
      background: 
        linear-gradient(135deg, 
          rgba(255, 215, 0, 1) 0%,
          rgba(255, 140, 0, 0.95) 100%
        );
      box-shadow: 
        0 0 20px rgba(255, 215, 0, 0.6),
        0 3px 8px rgba(0, 0, 0, 0.4),
        0 2px 4px rgba(255, 215, 0, 0.4);
    }
  }

  @keyframes winningPulse {
    0%, 100% { transform: scale(1.05); }
    50% { transform: scale(1.1); }
  }

  @keyframes winningGlow {
    0%, 100% { 
      box-shadow: 
        0 6px 15px rgba(0, 0, 0, 0.4),
        0 0 30px rgba(255, 215, 0, 0.4),
        inset 0 2px 0 rgba(255, 255, 255, 0.12);
    }
    50% { 
      box-shadow: 
        0 8px 25px rgba(0, 0, 0, 0.5),
        0 0 50px rgba(255, 215, 0, 0.8),
        inset 0 2px 0 rgba(255, 255, 255, 0.3);
    }
  }

  @keyframes multiplierGlow {
    0%, 100% { transform: scale(0.95); }
    50% { transform: scale(1.1); }
  }

  & > div > .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 8px;
    box-sizing: border-box;
  }

  & > div > .icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
    transition: all 0.3s ease;
  }

  & > div > .multiplier {
    position: absolute;
    right: -2px;
    top: -2px;
    color: #1a1a1a;
    background: 
      linear-gradient(135deg, 
        rgba(255, 215, 0, 0.95) 0%,
        rgba(255, 236, 99, 0.9) 100%
      );
    z-index: 10;
    padding: 2px 4px;
    border-radius: 6px;
    font-size: 8px;
    font-weight: bold;
    border: 1px solid rgba(255, 215, 0, 0.8);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.4),
      0 1px 2px rgba(255, 215, 0, 0.4);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    transform: scale(0.85);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(0.95);
    }
  }

  /* Mobile responsive adjustments */
  @media (max-width: 480px) {
    display: flex;
    flex-direction: row;
    gap: 8px;
    padding: 10px 15px;
    margin-top: 15px;

    & > div {
      width: 45px;
      height: 45px;
    }

    & > div > .multiplier {
      font-size: 7px;
      padding: 1px 3px;
      transform: scale(0.8);
    }
  }

  @media (min-width: 481px) and (max-width: 640px) {
    gap: 10px;
    padding: 12px 8px;

    & > div {
      width: 48px;
      height: 48px;
    }

    & > div > .multiplier {
      font-size: 7.5px;
      padding: 2px 3px;
      transform: scale(0.82);
    }
  }

  @media (min-width: 641px) {
    gap: 12px;
    padding: 15px 10px;

    & > div {
      width: 50px;
      height: 50px;
    }

    & > div > .multiplier {
      font-size: 8px;
      padding: 2px 4px;
      transform: scale(0.85);
    }
  }
`
