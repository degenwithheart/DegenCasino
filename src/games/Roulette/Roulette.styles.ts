import styled, { css, keyframes } from 'styled-components'

const resultFlash = keyframes`
  from { background-color: white; }
  to { background-color: #292a307d; }
`

export const StyledResults = styled.div`
  border-radius: 10px;
  background: #191c2fa1;
  margin: 0 auto;
  font-weight: bold;
  overflow: hidden;
  width: 100%;
  display: flex;
  height: clamp(40px, 6vw, 50px);

  & > div {
    display: flex;
    padding: 10px;
    width: clamp(30px, 5vw, 40px);
    justify-content: center;
    align-items: center;
  }

  & > div:first-child {
    font-size: clamp(16px, 4vw, 24px);
    width: clamp(40px, 8vw, 60px);
    background: #ffffff11;
    animation: ${resultFlash} 1s;
  }
`

export const StyledBetButton = styled.div<{
  $highlighted?: boolean
  $color?: 'black' | 'red'
}>`
  position: relative;
  border: none;
  border-radius: 5px;
  padding: clamp(8px, 2vw, 10px);
  font-size: clamp(12px, 2.5vw, 14px);
  width: clamp(50px, 12vw, 60px);
  color: white;
  cursor: pointer;
  text-align: center;

  ${(props) => props.$color === 'red' && css`
    --background-color: #ff3d5e;
    --border-color: #ff2b4e;
  `}

  ${(props) => props.$color === 'black' && css`
    --background-color: #1b1b25;
    --border-color: #121218;
  `}

  background-color: var(--background-color);
  box-shadow: 0 0 0 1px var(--border-color);

  &::after {
    content: " ";
    transition: background 0.1s;
    background: transparent;
    position: absolute;
    inset: 0;
    border-radius: 5px;
  }

  &:hover::after {
    background: #9999ff44;
    mix-blend-mode: screen;
  }

  ${(props) => props.$highlighted && css`
    &::after {
      background: #9999ff44;
      mix-blend-mode: screen;
    }
  `}
`

export const StyledTable = styled.div`
  display: grid;
  gap: clamp(6px, 1.5vw, 10px);
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  width: 100%;
  padding: clamp(10px, 2vw, 20px);
`

export const ChipContainer = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  transform: translate(25%, -25%);
  pointer-events: none;

  @media (max-width: 600px) {
    transform: translate(15%, -15%);
  }
`
