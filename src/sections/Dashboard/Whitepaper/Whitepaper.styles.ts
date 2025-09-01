import styled, { keyframes } from 'styled-components'

// Casino animations
export const neonPulse = keyframes`
  0% {
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #ffd70044;
  }
  100% {
    box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88;
    border-color: #ffd700aa;
  }
`;

export const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

export const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`;

const SIDEBAR_WIDTH = 80;
interface ContainerProps {
  $compact?: boolean;
  visible?: boolean;
}
export const Container = styled.div<ContainerProps>`
  max-width: 100vw;
  padding: ${({ $compact }) => ($compact ? '1rem' : '2rem')};
  margin: 2rem 0; /* Only vertical margins */
  border-radius: 12px;
  background: #0f0f23;
  border: 1px solid #2a2a4a;
  color: white;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => (visible ? 'translateY(0)' : 'translateY(20px)')};
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #ffd700;
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
    transform: translateY(-2px);
  }

  @media (max-width: 900px) {
    margin: 1rem 0;
    padding: ${({ $compact }) => ($compact ? '0.5rem' : '1.5rem')};
  }

  @media (max-width: 700px) {
    margin: 1rem 0;
    padding: ${({ $compact }) => ($compact ? '0.5rem' : '1rem')};
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
    margin: 0.5rem 0;
  }

  @media (max-width: 400px) {
    padding: 0.75rem 0.5rem;
    margin: 0.25rem 0;
    border-radius: 8px;
  }
`;

export const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  button {
    background: #0f0f23;
    border: 1px solid #2a2a4a;
    color: #ffd700;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-family: 'Luckiest Guy', cursive;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:hover {
      border-color: #ffd700;
      box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
      transform: translateY(-2px);
    }

    &.active {
      background: #ffd700;
      color: #1a1a1a;
      border-color: #ffd700;
    }
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    button {
      font-size: 0.85rem;
      padding: 0.6rem 1rem;
    }
  }
`

export const Section = styled.section`
  line-height: 1.7;
  font-size: 1rem;

  h2 {
    font-family: 'Luckiest Guy', cursive;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: #ffd700;
    padding-bottom: 0.5rem;
  }

  p, ul {
    margin-bottom: 1rem;
    color: #999;
  }

  ul {
    padding-left: 1.25rem;
    list-style-type: disc;
  }

  strong {
    font-weight: bold;
    color: #ffd700;
  }

  em {
    font-style: italic;
    color: #a259ff;
  }

  a {
    color: #ffd700;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      color: #fff;
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    line-height: 1.6;

    h2 {
      font-size: 1.4rem;
    }
  }
`
