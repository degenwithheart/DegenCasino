import styled from 'styled-components'
import { sparkle } from '../../themes/globalThemes'

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;

  &::before {
    content: '⚛️';
    position: absolute;
    top: -15px;
    right: 15%;
    font-size: 2.5rem;
    animation: \${sparkle} 4s infinite;
    filter: drop-shadow(0 0 8px #6ffaff);
  }
`

export const Title = styled.h2`
  color: #6ffaff;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.15em;
  text-shadow: 0 0 16px #6ffaffcc, 0 0 4px #fff;
  font-family: 'Orbitron', 'JetBrains Mono', monospace;
`

export const Subtitle = styled.p`
  color: #a259ff;
  font-size: 0.9rem;
  margin: 0;
  letter-spacing: 0.1em;
  text-shadow: 0 0 8px #a259ff88;
  font-family: 'JetBrains Mono', monospace;
`

export const BonusAmount = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(111, 250, 255, 0.08);
  border: 2px solid rgba(111, 250, 255, 0.3);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #6ffaff;
  text-shadow: 0 0 8px #6ffaff;
  box-shadow: 0 0 16px rgba(111, 250, 255, 0.15);
  transition: all 0.3s ease;
  font-family: 'JetBrains Mono', monospace;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 24px rgba(111, 250, 255, 0.25);
    border-color: rgba(111, 250, 255, 0.5);
  }

  &::before {
    content: '⚛️';
    font-size: 1.5rem;
  }

  @media (max-width: 600px) {
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    margin: 1rem 0;
    border-radius: 10px;
  }
`

export const FeatureList = styled.ul`
  background: rgba(111, 250, 255, 0.08);
  border: 1px solid rgba(111, 250, 255, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0;
    color: #eaf6fb;
    font-size: 0.95rem;
    font-family: 'JetBrains Mono', monospace;

    &::before {
      content: '⚛️';
      font-size: 1.2rem;
      background: rgba(111, 250, 255, 0.15);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 8px rgba(111, 250, 255, 0.25);
      filter: drop-shadow(0 0 4px #6ffaff);
    }

    @media (max-width: 600px) {
      font-size: 0.9rem;
      gap: 0.4rem;
      padding: 0.3rem 0;
      &::before {
        width: 20px;
        height: 20px;
        font-size: 1rem;
      }
    }
  }
`
