import styled from "styled-components";

export const StyledItemPreview = styled.div`
  display: flex;
  gap: 18px;
  padding: 30px 40px;
  background: 
    linear-gradient(135deg, 
      rgba(20, 20, 30, 0.8) 0%,
      rgba(30, 25, 40, 0.85) 50%,
      rgba(25, 20, 35, 0.8) 100%
    );
  border-radius: 20px;
  border: 3px solid transparent;
  background-image: 
    linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(25, 20, 35, 0.8)),
    linear-gradient(135deg, 
      rgba(147, 51, 234, 0.4) 0%,
      rgba(255, 215, 0, 0.3) 50%,
      rgba(147, 51, 234, 0.4) 100%
    );
  background-origin: border-box;
  background-clip: content-box, border-box;
  box-shadow: 
    0 12px 35px rgba(0, 0, 0, 0.4),
    0 6px 18px rgba(147, 51, 234, 0.15);
  margin-bottom: 20px;

  & > div {
    position: relative;
    width: 80px;
    aspect-ratio: 1/1.3;
    border-radius: 15px;
    border: 3px solid transparent;
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
      0 6px 15px rgba(0, 0, 0, 0.4),
      inset 0 2px 0 rgba(255, 255, 255, 0.12);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 
        0 8px 20px rgba(0, 0, 0, 0.5),
        inset 0 2px 0 rgba(255, 255, 255, 0.2);
    }
  }

  & > div.hidden {
    opacity: 0.4;
    filter: grayscale(0.6);
    transform: scale(0.95);
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
    padding: 12px;
  }

  & > div > .icon img {
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
    transition: all 0.3s ease;
  }

  & > div > .multiplier {
    position: absolute;
    right: -6px;
    top: -6px;
    color: #1a1a1a;
    background: 
      linear-gradient(135deg, 
        rgba(255, 215, 0, 0.95) 0%,
        rgba(255, 236, 99, 0.9) 100%
      );
    z-index: 10;
    padding: 4px 8px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: bold;
    border: 2px solid rgba(255, 215, 0, 0.8);
    box-shadow: 
      0 3px 8px rgba(0, 0, 0, 0.4),
      0 2px 4px rgba(255, 215, 0, 0.4);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    transform: scale(0.95);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
`
