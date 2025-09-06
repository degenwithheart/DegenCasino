import styled, { css, keyframes } from 'styled-components'
import { CellStatus } from './types'

const tickingAnimation = keyframes`
  0%, 50%, 100% {
    transform: scale(1);
    filter: brightness(1);
    /* background: #764cc4; */
    /* box-shadow: 0 0 1px 1px #ffffff00; */
  }
  25% {
    transform: scale(0.95);
    filter: brightness(1.5);
    /* background: #945ef7; */
    /* box-shadow: 0 0 1px 1px #ffffff99; */
  }
`

const goldReveal = keyframes`
  0% {
    filter: brightness(1);
    /* background: #ffffff; */
    transform: scale(1.1);
  }
  75% {
    filter: brightness(2);
    /* background: #3fff7a; */
    transform: scale(1.2);
  }
`

const mineReveal = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  51% {
    background: #ffffff;
    transform: scale(1.6);
  }
`

const hoverPulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`

export const Container2 = styled.div`
  display: grid;
  grid-template-rows: auto auto auto 1fr;
  height: 100%;
  gap: 10px;
`

export const Container = styled.div`
  display: grid;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  user-select: none;
  backdrop-filter: blur(20px);
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    gap: 8px;
    font-size: 12px;
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    gap: 9px;
    font-size: 13px;
  }
  
  @media (min-width: 769px) and (max-width: 899px) {
    gap: 9px;
    font-size: 14px;
  }
  
  @media (min-width: 900px) {
    gap: 10px;
    font-size: 14px;
  }
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 8px;
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    gap: 6px;
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    gap: 7px;
  }
  
  @media (min-width: 769px) and (max-width: 899px) {
    gap: 7px;
  }
  
  @media (min-width: 900px) {
    gap: 8px;
  }
`

export const Levels = styled.div`
  border-radius: 5px;
  color: gray;
  background: #292a307d;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 50px;
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    height: 42px;
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    height: 46px;
  }
  
  @media (min-width: 769px) and (max-width: 899px) {
    height: 48px;
  }
  
  @media (min-width: 900px) {
    height: 50px;
  }
`

export const Level = styled.div<{$active: boolean}>`
  margin: 0 auto;
  width: 25%;
  text-align: center;
  padding: 5px 0;
  opacity: .5;
  text-wrap: nowrap;

  & > div:first-child {
    font-size: 60%;
    color: gray;
  }

  ${(props) => props.$active && css`
    background: #FFFFFF11;
    background: 2px 0px 10px #00000033;
    color: #32cd5e;
    opacity: 1;
  `}
`

export const CellButton = styled.button<{$status: CellStatus, selected: boolean, enableMotion?: boolean}>`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background: #9358ff;
  background-size: 100%;
  border: none;
  border-bottom: 5px solid #00000055;
  border-radius: 4px;
  font-weight: bold;
  aspect-ratio: 1;
  width: 60px;
  transition: ${props => props.enableMotion !== false ? 'background 0.3s, opacity .3s, filter .2s ease' : 'none'};
  font-size: 12px;
  cursor: pointer;

  ${(props) => props.selected && props.enableMotion !== false && css`
    animation: ${tickingAnimation} .5s ease infinite;
    z-index: 10;
    opacity: 1!important;
  `}

  ${(props) => props.$status === 'gold' && props.enableMotion !== false && css`
    color: white;
    animation: ${goldReveal} .5s ease;
    opacity: 1;
  `}

  ${(props) => props.$status === 'mine' && props.enableMotion !== false && css`
    background: #ff5252;
    z-index: 10;
    animation: ${mineReveal} .3s ease;
    opacity: 1;
  `}
  
  /* Static styles when motion is disabled */
  ${(props) => props.selected && props.enableMotion === false && css`
    z-index: 10;
    opacity: 1!important;
    background: #BBBBFF; /* Highlighted static color */
  `}

  ${(props) => props.$status === 'gold' && props.enableMotion === false && css`
    color: white;
    opacity: 1;
    background: #FFD700; /* Gold static color */
  `}

  ${(props) => props.$status === 'mine' && props.enableMotion === false && css`
    background: #ff5252;
    z-index: 10;
    opacity: 1;
  `}

  ${(props) => props.$status === 'hidden' && css`
    &:disabled {
      opacity: .5;
    }
  `}

  &:disabled {
    cursor: default;
  }

  &:hover:not(:disabled) {
    filter: brightness(1.5);
  }
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    width: 50px;
    font-size: 10px;
    border-bottom: 4px solid #00000055;
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    width: 55px;
    font-size: 11px;
    border-bottom: 4px solid #00000055;
  }
  
  @media (min-width: 769px) and (max-width: 899px) {
    width: 58px;
    font-size: 11px;
    border-bottom: 5px solid #00000055;
  }
  
  @media (min-width: 900px) {
    width: 60px;
    font-size: 12px;
    border-bottom: 5px solid #00000055;
  }
`

export const StatusBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: white;
  & > div:first-child {
    display: flex;
    color: #ffffffCC;
    gap: 20px;
  }
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    & > div:first-child {
      gap: 12px;
      flex-wrap: wrap;
    }
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    & > div:first-child {
      gap: 16px;
    }
  }
  
  @media (min-width: 769px) and (max-width: 899px) {
    & > div:first-child {
      gap: 18px;
    }
  }
  
  @media (min-width: 900px) {
    & > div:first-child {
      gap: 20px;
    }
  }
`
