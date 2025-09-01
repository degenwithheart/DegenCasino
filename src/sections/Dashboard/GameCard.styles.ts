import styled, { keyframes, css } from 'styled-components'

export const tileAnimation = keyframes`
  0% {
    background-position: -100px 100px;
  }
  100% {
    background-position: 100px -100px;
  }
`

export const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

export const flip = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`

export const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
`

export const effectAnimations = {
  bounce,
  spin,
  flip,
  shake,
}

export const StyledGameCard = styled.div<{ $small: boolean; $background: string; $effect?: string }>`
  width: 100%;
  height: 100%;
  background-size: cover;
  border-radius: 10px;
  color: white;
  font-size: 24px;
  transition: all 0.3s ease;
  position: relative;
  background: ${(props) => props.$background};
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  background-size: 100% auto;
  background-position: center;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);

  & > .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url(/webp/stuff.webp);
    background-size: 100%;
    background-position: center;
    background-repeat: repeat;
    transition: transform 0.2s ease, opacity 0.3s;
    animation: ${tileAnimation} 5s linear infinite;
    opacity: 0;
    pointer-events: none;
    z-index: 2;
  }

  & > .image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-size: 100% auto;
    background-position: center;
    background-repeat: no-repeat;
    transition: transform 0.2s ease;
  }

  .play {
    font-size: 14px;
    border-radius: 8px;
    padding: 8px 16px;
    background: linear-gradient(90deg, #ffd700, #a259ff);
    color: #222;
    font-weight: bold;
    position: absolute;
    right: 8px;
    bottom: 8px;
    opacity: 0;
    text-transform: uppercase;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 16px #ffd70088;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    letter-spacing: 1px;
    border: none;
    transition: all 0.3s ease;
    z-index: 1;
  }

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    border-radius: 10px;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease-in-out;
  }

  @media (max-width: 600px) {
    font-size: 16px;
    border-radius: 7px;
    .play {
      font-size: 11px;
      border-radius: 6px;
      padding: 6px 10px;
      right: 4px;
      bottom: 4px;
    }
  }
`;

// New badge for the "VS" tag (or any other tag you choose)
export const Tag = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 4px;
  text-transform: uppercase;
  z-index: 1;
`;
