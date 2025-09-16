import styled, { keyframes, css } from 'styled-components';

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

export const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

interface ProfileContainerProps {
  $compact?: boolean;
}

export const ProfileContainer = styled.div<ProfileContainerProps & { $colorScheme?: any }>`
  max-width: none; /* Let main handle max-width */
  padding: ${({ $compact }) => ($compact ? '2rem' : '3rem')};
  margin: 2rem 0; /* Only vertical margins */
  background: ${({ $colorScheme }) => $colorScheme?.colors?.background || '#0f0f23'};
  border-radius: 12px;
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || '#2a2a4a'};
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
    box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.glow || '0 0 24px rgba(255, 215, 0, 0.2)'};
    transform: translateY(-2px);
  }

  @media (max-width: 900px) {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }

  @media (max-width: 700px) {
    padding: 1.5rem 1rem;
    margin: 0.5rem;
  }

  @media (max-width: 400px) {
    padding: 1rem 0.75rem;
    margin: 0.25rem;
    border-radius: 8px;
  }
`;

export const ProfileHeader = styled.div<{ $colorScheme?: any }>`
  text-align: center;
  margin-bottom: 4rem;

  h1 {
    font-family: 'Luckiest Guy', cursive;
    font-size: 3rem;
    color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    margin-bottom: 3rem;
    h1 {
      font-size: 2rem;
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 2rem;
    h1 {
      font-size: 1.5rem;
    }
  }
`;

export const SectionBox = styled.div<{ visible: boolean; isHovered?: boolean }>`
  max-width: 100%;
  margin: 2rem auto;
  padding: 2rem;
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

  & + & {
    margin-top: 2.5rem;
  }

  label {
    display: block;
    margin-bottom: 1rem;
    font-weight: bold;
    color: #ffd700;
    font-family: 'Luckiest Guy', cursive;
    font-size: 1.1rem;
  }

  p {
    color: #999;
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  @media (max-width: 600px) {
    padding: 1.5rem 1rem;
    margin: 1.5rem auto;

    & + & {
      margin-top: 2rem;
    }
  }
`;

export const CasinoButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  background: ${props =>
    props.variant === 'danger'
      ? '#ff4444'
      : '#ffd700'
  };
  color: ${props => props.variant === 'danger' ? 'white' : '#1a1a1a'};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'Luckiest Guy', cursive;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${props =>
      props.variant === 'danger'
        ? 'rgba(255, 68, 68, 0.3)'
        : 'rgba(255, 215, 0, 0.3)'
    };
  }

  @media (max-width: 600px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
`;

export const AvatarContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 2px solid #2a2a4a;
  background-color: #0f0f23;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ffd700;
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
  }

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
  }
`;

export const DefaultAvatar = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #0f0f23;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #2a2a4a;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ffd700;
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
  }

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
  }
`;
