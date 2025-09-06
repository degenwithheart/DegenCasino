import styled, { css, keyframes } from 'styled-components'

const resultFlash = keyframes`
  from { background-color: white;}
  to { background-color: #292a307d;}
`

export const StyledResults = styled.div<{ enableMotion?: boolean }>`
  border-radius: 10px;
  background: #191c2fa1;
  margin: 0 auto;
  font-weight: bold;
  overflow: hidden;
  width: 100%;
  display: flex;
  height: 50px;

  & > div {
    display: flex;
    padding: 10px;
    width: 40px;
    justify-content: center;
  }

  & > div:first-child {
    font-size: 24px;
    align-items: center;
    width: 60px;
    justify-content: center;
    background: #FFFFFF11;
    ${props => props.enableMotion !== false && css`
      animation: ${resultFlash} 1s;
    `}
  }
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    height: 42px;
    
    & > div {
      padding: 8px;
      width: 35px;
    }
    
    & > div:first-child {
      font-size: 20px;
      width: 50px;
    }
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    height: 46px;
    
    & > div {
      padding: 9px;
      width: 38px;
    }
    
    & > div:first-child {
      font-size: 22px;
      width: 55px;
    }
  }
  
  @media (min-width: 769px) and (max-width: 899px) {
    height: 48px;
    
    & > div {
      padding: 9px;
      width: 39px;
    }
    
    & > div:first-child {
      font-size: 23px;
      width: 58px;
    }
  }
  
  @media (min-width: 900px) {
    height: 50px;
    
    & > div {
      padding: 10px;
      width: 40px;
    }
    
    & > div:first-child {
      font-size: 24px;
      width: 60px;
    }
  }
`

export const StyledBetButton = styled.div<{$highlighted?: boolean, $color?: 'black' | 'red'}>`
  position: relative;
  border: none;
  border-radius: 5px;
  padding: 10px 10px;
  box-shadow: 0 0 0 1px var(--border-color);
  color: white;
  width: 60px;
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
    transition: background .1s;
    background: transparent;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }

  &:hover::after {
    background: #9999ff44;
    mix-blend-mode:screen;
  }
  ${(props) => props.$highlighted && css`
    &::after {
      background: #9999ff44;
      mix-blend-mode:screen;
    }
  `}
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    width: 50px;
    padding: 8px 6px;
    font-size: 14px;
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    width: 55px;
    padding: 9px 8px;
    font-size: 15px;
  }
  
  @media (min-width: 769px) and (max-width: 899px) {
    width: 58px;
    padding: 9px 9px;
    font-size: 16px;
  }
  
  @media (min-width: 900px) {
    width: 60px;
    padding: 10px 10px;
    font-size: 16px;
  }
`

export const StyledTable = styled.div`
  display: grid;
  gap: 10px;
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    gap: 6px;
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    gap: 8px;
  }
  
  @media (min-width: 769px) and (max-width: 899px) {
    gap: 9px;
  }
  
  @media (min-width: 900px) {
    gap: 10px;
  }
`

export const ChipContainer = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  transform: translate(25%, -25%);
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    transform: translate(20%, -20%);
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    transform: translate(22%, -22%);
  }
  
  @media (min-width: 769px) and (max-width: 899px) {
    transform: translate(24%, -24%);
  }
  
  @media (min-width: 900px) {
    transform: translate(25%, -25%);
  }
`
