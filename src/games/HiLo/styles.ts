import styled, { css, keyframes } from 'styled-components'

const appear = keyframes`
  0% { transform: scale(.0) translateY(100px) rotateY(90deg); }
  100% { transform: scale(1) translateY(0) rotateY(0deg) }
`

export const Container = styled.div<{ $disabled?: boolean }>`
  user-select: none;
  background: #9967e300;
  transition: opacity .2s;
  ${({ $disabled }) => $disabled && css`
    pointer-events: none;
    opacity: .7;
  `}
`

export const Options = styled.div`
  display: flex;
  flex-direction: column;
`

export const Option = styled.button<{ selected?: boolean }>`
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  transition: opacity .2s, background .2s ease;
  display: flex;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  font-size: 20px;
  color: white;
  & > div:first-child {
    font-size: 48px;
    filter: drop-shadow(-4px 4px 2px #00000066);
    margin-right: 10px;
  }

  --opacity: .5;

  &:hover {
    --opacity : 1;
  }

  ${(props) => props.selected && css`
    --opacity: 1;
  `}

  opacity: var(--opacity);
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    font-size: 16px;
    & > div:first-child {
      font-size: 36px;
      margin-right: 8px;
    }
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    font-size: 18px;
    & > div:first-child {
      font-size: 42px;
      margin-right: 9px;
    }
  }
  
  @media (min-width: 769px) and (max-width: 899px) {
    font-size: 19px;
    & > div:first-child {
      font-size: 45px;
      margin-right: 9px;
    }
  }
  
  @media (min-width: 900px) {
    font-size: 20px;
    & > div:first-child {
      font-size: 48px;
      margin-right: 10px;
    }
  }
`

export const Token = styled.div`
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border-radius: 50px;
  background: #69ff6d;
  padding: 5px;
  /* Animation will be conditionally applied via class or props */
`

export const CardPreview = styled.div`
  display: flex;
  border-radius: 5px;
  gap: 5px;
  padding: 5px;
  margin-top: 30px;
  justify-content: center;
  & > div {
    transition: opacity .2s;
  }
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    gap: 3px;
    padding: 3px;
    margin-top: 20px;
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    gap: 4px;
    padding: 4px;
    margin-top: 25px;
  }
  
  @media (min-width: 769px) and (max-width: 899px) {
    gap: 4px;
    padding: 4px;
    margin-top: 28px;
  }
  
  @media (min-width: 900px) {
    gap: 5px;
    padding: 5px;
    margin-top: 30px;
  }
`

export const CardsContainer = styled.div<{ enableMotion?: boolean }>`
  transition: ${props => props.enableMotion !== false ? 'transform .2s ease' : 'none'};
  perspective: 500px;
  display: flex;
  position: relative;
  justify-content: flex-end;
  align-items: center;
`

export const CardContainer = styled.div<{ enableMotion?: boolean }>`
  position: absolute;
  bottom: 0;
  transition: ${props => props.enableMotion !== false ? 'transform .25s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity .25s ease' : 'none'};
  filter: drop-shadow(-10px 10px 0px #00000011);
  transform-origin: bottom;
  perspective: 500px;
  & > div {
    ${props => props.enableMotion !== false && css`
      animation: ${appear} .25s cubic-bezier(0.5, 0.9, 0.35, 1.05);
    `}
  }
`

export const Card = styled.div<{$small?: boolean}>`
  ${(props) => props.$small ? css`
    height: 35px;
    font-size: 15px;
    padding: 5px;
    border-radius: 4px;
  ` : css`
    height: 100px;
    font-size: 70px;
    padding: 10px;
    border-radius: 8px;
  `}
  box-shadow: -5px 5px 10px 1px #0000003d;
  background: white;
  aspect-ratio: 4/5.5;
  position: relative;
  color: #333;
  overflow: hidden;
  .rank {
    font-weight: bold;
    line-height: 1em;
  }
  .suit {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 50%;
    height: 50%;
    background-size: cover;
    background-repeat: none;
    transform: translate(0%, 0%);
    font-size: 128px;
    opacity: .9;
  }
  
  /* Responsive adjustments for large cards */
  ${(props) => !props.$small && css`
    @media (max-width: 640px) {
      height: 80px;
      font-size: 56px;
      padding: 8px;
    }
    
    @media (min-width: 641px) and (max-width: 768px) {
      height: 90px;
      font-size: 63px;
      padding: 9px;
    }
    
    @media (min-width: 769px) and (max-width: 899px) {
      height: 95px;
      font-size: 66px;
      padding: 9px;
    }
    
    @media (min-width: 900px) {
      height: 100px;
      font-size: 70px;
      padding: 10px;
    }
  `}
  
  /* Responsive adjustments for small cards */
  ${(props) => props.$small && css`
    @media (max-width: 640px) {
      height: 28px;
      font-size: 12px;
      padding: 4px;
    }
    
    @media (min-width: 641px) and (max-width: 768px) {
      height: 31px;
      font-size: 13px;
      padding: 4px;
    }
    
    @media (min-width: 769px) and (max-width: 899px) {
      height: 33px;
      font-size: 14px;
      padding: 4px;
    }
    
    @media (min-width: 900px) {
      height: 35px;
      font-size: 15px;
      padding: 5px;
    }
  `}
`
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`

export const WarningMessage = styled.div<{ enableMotion?: boolean }>`
  ${props => props.enableMotion !== false && css`
    animation: ${float} 2s ease-in-out infinite;
  `}
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateX(100%) translateY(-50%);
  background-color: rgba(255, 204, 0, 0.8);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  color: black;
  white-space: nowrap;
  pointer-events: none;
`

export const Profit = styled.div<{ enableMotion?: boolean }>`
  font-size: 18px;
  color: #005400;
  margin-top: 20px;
  border-radius: 50px;
  background: #69ff6d;
  padding: 5px 10px;
  ${props => props.enableMotion !== false && css`
    animation: ${appear} .25s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  `}
  cursor: pointer;
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    font-size: 14px;
    margin-top: 16px;
    padding: 4px 8px;
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    font-size: 16px;
    margin-top: 18px;
    padding: 4px 9px;
  }
  
  @media (min-width: 769px) and (max-width: 899px) {
    font-size: 17px;
    margin-top: 19px;
    padding: 5px 9px;
  }
  
  @media (min-width: 900px) {
    font-size: 18px;
    margin-top: 20px;
    padding: 5px 10px;
  }
`
