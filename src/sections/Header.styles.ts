import styled, { keyframes } from 'styled-components'
import { NavLink } from 'react-router-dom'

// Casino animations
export const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 12px var(--secondary-color-88), 0 0 24px var(--primary-color-44);
    text-shadow: 0 0 8px var(--primary-color);
  }
  100% { 
    box-shadow: 0 0 24px var(--primary-color-cc), 0 0 48px var(--secondary-color-88);
    text-shadow: 0 0 16px var(--primary-color), 0 0 32px var(--secondary-color);
  }
`

export const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`

export const StyledHeader = styled.div<{ offset?: number; $theme?: any }>`
  position: fixed;
  top: ${({ offset }) => offset ?? 0}px;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  height: 100px;
  padding: 0 2rem;
  background: rgba(24, 24, 24, 0.85);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  border-bottom: 2px solid rgba(255, 215, 0, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(162, 89, 255, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }

  @media (max-width: 600px) {
    height: 80px;
    padding: 0.5rem 0.5rem;
    min-width: 0;
    box-shadow: 0 2px 12px rgba(0,0,0,0.25);
  }
`

export const Logo = styled(NavLink)<{ $theme?: any }>`
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 0.5rem;
  position: relative;
  margin-left: 1.5rem;

  &::before {
    content: '🎰';
    position: absolute;
    left: -30px;
    font-size: 1.5rem;
    animation: ${sparkle} 3s infinite;
  }

  img {
    height: 42px;
    transition: all 0.3s ease-in-out;
    filter: drop-shadow(0 0 8px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'});
    border-radius: 8px;
  }

  span {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
    white-space: nowrap;
    user-select: none;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    text-shadow: 0 0 16px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, 0 0 32px ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'};
    letter-spacing: 1px;
    animation: ${neonPulse} 2s infinite alternate;
    background: none !important;
    box-shadow: none !important;
  }

  &:hover {
    img {
      transform: scale(1.1) rotate(5deg);
      filter: drop-shadow(0 0 16px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'});
    }
    
    span {
      transform: scale(1.05);
    }
  }

  @media (max-width: 600px) {
    margin-left: 0.5rem;
    &::before {
      left: -25px;
      font-size: 1.2rem;
    }

    img {
      height: 32px;
    }

    span {
      font-size: 1.1rem;
    }
  }
`

export const Bonus = styled.button<{ $theme?: any }>`
  background: transparent;
  color: ${({ $theme }) => $theme?.colors?.text || '#fff'};
  border: none;
  padding: 8px 10px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: color 0.12s ease, transform 0.12s ease;
  box-shadow: none;
  backdrop-filter: none;

  &:hover {
    color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
    transform: translateY(-1px);
  }

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 6px 8px;
  }
`

export const JackpotBonus = styled.button<{ $theme?: any }>`
  background: transparent;
  color: ${({ $theme }) => $theme?.colors?.text || '#fff'};
  border: none;
  padding: 8px 10px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: color 0.12s ease, transform 0.12s ease;
  box-shadow: none;
  backdrop-filter: none;

  &:hover {
    color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
    transform: translateY(-1px);
  }

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 6px 8px;
  }
`

export const ThemeButton = styled.button<{ $theme?: any }>`
  background: transparent;
  color: ${({ $theme }) => $theme?.colors?.text || '#fff'};
  border: none;
  padding: 8px 10px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: color 0.12s ease, transform 0.12s ease;
  box-shadow: none;
  backdrop-filter: none;

  &:hover {
    color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
    transform: translateY(-1px);
  }

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 6px 8px;
  }
`

export const RightGroup = styled.div<{ $isCompact: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isCompact }) => ($isCompact ? '0.5rem' : '1rem')};
  margin-right: 1.5rem;

  @media (max-width: 600px) {
    margin-right: 0.5rem;
    gap: 0.25rem;
  }
`
