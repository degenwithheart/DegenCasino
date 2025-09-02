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
`

export const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`

export const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`

export const StatusButton = styled.button<{ $hovered: boolean }>`
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  font-family: 'Luckiest Guy', cursive;
  font-size: 0.9rem;
  @media (max-width: 600px) {
    padding: 0.6rem 0.9rem;
    font-size: 1rem;
    border-radius: 10px;
    min-width: 110px;
  }
  font-weight: bold;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    border-color: #ffd700;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
    transform: translateY(-2px);

    &::before {
      left: 100%;
    }
  }

  \${({ $hovered }) => $hovered && \`
    border-color: #ffd700;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
    transform: translateY(-2px);
  \`}
`

export const StatusModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

export const ModalContentStyled = styled.div`
  background: rgba(24, 24, 24, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  padding: 2rem;
  max-width: 600px;
  width: 95vw;
  max-height: 80vh;
  overflow-y: auto;
  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
    max-width: 99vw;
    border-radius: 12px;
    font-size: 1rem;
  }
  position: relative;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.7);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(162, 89, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
    border-radius: 24px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    animation: \${moveGradient} 4s linear infinite;
    border-radius: 24px 24px 0 0;
  }
`

export const ModalTitle = styled.h2`
  font-family: 'Luckiest Guy', cursive;
  font-size: 2rem;
  color: #ffd700;
  text-align: center;
  margin-bottom: 1.5rem;
  text-shadow: 
    0 0 10px #ffd700,
    0 0 20px #ffd700,
    2px 2px 4px rgba(0, 0, 0, 0.8);
  position: relative;

  &::before {
    content: '🔌';
    position: absolute;
    left: -2.5rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    animation: \${sparkle} 2s ease-in-out infinite;
  }

  &::after {
    content: '⚡';
    position: absolute;
    right: -2.5rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    animation: \${sparkle} 2s ease-in-out infinite 0.5s;
  }
`

export const StatusItem = styled.div<{ status: 'Online' | 'Issues' | 'Offline' | 'Secured' | 'Unsecured' | 'Loading' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);

  .label {
    font-weight: bold;
    color: #ffd700;
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }

  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 8px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.8rem;
    
    \${({ status }) => {
      switch(status) {
        case 'Online':
        case 'Secured':
          return \`
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.3);
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
          \`;
        case 'Issues':
        case 'Loading':
          return \`
            background: rgba(234, 179, 8, 0.2);
            color: #eab308;
            border: 1px solid rgba(234, 179, 8, 0.3);
            box-shadow: 0 0 10px rgba(234, 179, 8, 0.3);
          \`;
        case 'Offline':
        case 'Unsecured':
          return \`
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
            box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
          \`;
      }
    }}
  }
`

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.2);
    border-color: #ffd700;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
  }
`
