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
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: ${(props) => (props.visible ? 'translateY(0)' : 'translateY(20px)')};
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

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #ffd700;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 2px;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 1.5rem;
    letter-spacing: 1px;
  }
`;

export const Subtitle = styled.p`
  font-style: italic;
  color: #999;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  text-align: center;
`

export const Selector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;

  label {
    font-weight: 600;
    font-size: 1.1rem;
    white-space: nowrap;
  }

  button {
    cursor: pointer;
    border: 1px solid #2a2a4a;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #0f0f23;
    color: #ddd;
    transition: all 0.3s ease;

    &:hover {
      border-color: #ffd700;
      box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
      transform: translateY(-2px);
    }
      color: #ffd700;
      border-color: rgba(255, 215, 0, 0.6);
      box-shadow: 0 0 12px rgba(255, 215, 0, 0.3);
      transform: translateY(-2px);
    }

    &.active {
      background: linear-gradient(135deg, #ffd700, #a259ff);
      color: #222;
      font-weight: 700;
      border-color: #ffd700;
      box-shadow: 0 0 16px rgba(255, 215, 0, 0.5);
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.1rem;
    label {
      font-size: 0.97rem;
    }
    button {
      font-size: 0.97rem;
      padding: 0.5rem 0.8rem;
      border-radius: 12px;
    }
  }
`;

export const SectionHeading = styled.h2`
  margin-top: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffd700;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    font-size: 1.1rem;
    margin-top: 1.2rem;
  }
`;

export const Content = styled.div`
  line-height: 1.6;
  font-size: 1rem;
  margin-top: 1rem;

  p,
  ul {
    margin-bottom: 1rem;
    color: #999;
  }

  ul {
    padding-left: 1.25rem;
    list-style-type: disc;
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

  strong {
    font-weight: 700;
    color: #ffd700;
  }

  em {
    font-style: italic;
    color: #a259ff;
  }

  @media (max-width: 600px) {
    font-size: 0.97rem;
    line-height: 1.4;
    margin-top: 0.5rem;
    p, ul {
      margin-bottom: 0.7rem;
    }
    ul {
      padding-left: 0.9rem;
    }
  }
`;

export const Flag = styled.span`
  font-size: 1.5rem;
  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;
