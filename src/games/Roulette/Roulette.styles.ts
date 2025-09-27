import styled, { css, keyframes } from 'styled-components'

const romanticResultFlash = keyframes`
  from { 
    background-color: var(--love-letter-gold);
    box-shadow: 0 0 20px var(--deep-crimson-rose);
  }
  to { 
    background: linear-gradient(135deg, var(--deep-romantic-night), var(--soft-purple-twilight));
    box-shadow: 0 0 10px var(--love-letter-gold);
  }
`

const romanticPulse = keyframes`
  0%, 100% { 
    filter: brightness(1) saturate(1);
    border-color: var(--love-letter-gold);
  }
  50% { 
    filter: brightness(1.1) saturate(1.2);
    border-color: var(--deep-crimson-rose);
  }
`

export const StyledResults = styled.div<{ enableMotion?: boolean }>`
  border-radius: 10px;
  background: linear-gradient(135deg, 
    var(--deep-romantic-night) 0%, 
    var(--soft-purple-twilight) 50%, 
    var(--deep-crimson-rose) 100%
  );
  border: 2px solid var(--love-letter-gold);
  margin: 0 auto;
  font-weight: bold;
  overflow: hidden;
  width: 100%;
  display: flex;
  height: 50px;
  box-shadow: 
    0 8px 25px rgba(10, 5, 17, 0.6),
    inset 0 2px 4px rgba(212, 165, 116, 0.2),
    0 0 15px var(--deep-crimson-rose);
  animation: romanticPulse 3s ease-in-out infinite;

  & > div {
    display: flex;
    padding: 10px;
    width: 40px;
    justify-content: center;
    color: var(--love-letter-gold);
    text-shadow: 1px 1px 2px rgba(10, 5, 17, 0.8);
  }

  & > div:first-child {
    font-size: 24px;
    align-items: center;
    width: 60px;
    justify-content: center;
    background: linear-gradient(135deg, 
      var(--love-letter-gold) 0%, 
      var(--deep-crimson-rose) 100%
    );
    color: #fff;
    border-radius: 8px 0 0 8px;
    ${props => props.enableMotion !== false && css`
      animation: ${romanticResultFlash} 1s ease-in-out;
    `}
  }
  
  /* Responsive adjustments */
  @media (max-width: 479px) {
    height: 38px;
    
    & > div {
      padding: 6px;
      width: 30px;
      font-size: 12px;
    }
    
    & > div:first-child {
      font-size: 18px;
      width: 45px;
    }
  }

  @media (min-width: 480px) and (max-width: 768px) {
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
  
  
  @media (min-width: 769px) and (max-width: 1024px) {
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
  
  @media (min-width: 1025px) {
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

const romanticBetGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 10px var(--love-letter-gold);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 20px var(--deep-crimson-rose);
    transform: scale(1.02);
  }
`

export const StyledBetButton = styled.div<{$highlighted?: boolean, $color?: 'black' | 'red'}>`
  position: relative;
  border: 2px solid var(--love-letter-gold);
  border-radius: 8px;
  padding: 10px 10px;
  background: linear-gradient(135deg, 
    var(--deep-romantic-night) 0%, 
    var(--soft-purple-twilight) 50%, 
    var(--deep-crimson-rose) 100%
  );
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 15px rgba(10, 5, 17, 0.6),
    inset 0 1px 2px rgba(212, 165, 116, 0.2);
  color: var(--love-letter-gold);
  text-shadow: 1px 1px 2px rgba(10, 5, 17, 0.8);
  transition: all 0.3s ease;
  width: 60px;
  cursor: pointer;
  text-align: center;

  ${(props) => props.$color === 'red' && css`
    background: linear-gradient(135deg, 
      var(--deep-crimson-rose) 0%, 
      #ff3d5e 50%, 
      var(--deep-crimson-rose) 100%
    );
    border-color: var(--deep-crimson-rose);
  `}

  ${(props) => props.$color === 'black' && css`
    background: linear-gradient(135deg, 
      var(--deep-romantic-night) 0%, 
      #1b1b25 50%, 
      var(--deep-romantic-night) 100%
    );
    border-color: var(--soft-purple-twilight);
  `}

  &::after {
    content: " ";
    transition: all 0.3s ease;
    background: transparent;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }

  &:hover {
    animation: ${romanticBetGlow} 1.5s ease-in-out infinite;
    transform: translateY(-1px);
    
    &::after {
      background: linear-gradient(135deg, 
        rgba(212, 165, 116, 0.3) 0%, 
        rgba(184, 51, 106, 0.2) 100%
      );
    }
  }

  ${(props) => props.$highlighted && css`
    animation: ${romanticBetGlow} 1.5s ease-in-out infinite;
    
    &::after {
      background: linear-gradient(135deg, 
        rgba(212, 165, 116, 0.4) 0%, 
        rgba(184, 51, 106, 0.3) 100%
      );
    }
  `}
  
  /* Responsive adjustments */
  @media (max-width: 479px) {
    width: 45px;
    padding: 6px;
    font-size: 12px;
  }

  @media (min-width: 480px) and (max-width: 768px) {
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
