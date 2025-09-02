import styled, { keyframes } from 'styled-components'

// Quantum animations
export const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`

export const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`

export const ModalContent = styled.div`
  /* Desktop/base: cap at 700px while respecting dynamic viewport (handles mobile browser UI) */
  width: min(700px, 96dvw);
  min-width: 0;
  min-height: 200px;
  max-height: 80vh;
  margin-bottom: 1rem;
  margin-top: 1rem;
  padding: 2rem;
  background: rgba(20, 30, 60, 0.92);
  border-radius: 18px;
  border: 2px solid rgba(111, 250, 255, 0.3);
  box-shadow: 0 0 32px rgba(111, 250, 255, 0.2);
  position: relative;
  color: #eaf6fb;
  font-family: 'JetBrains Mono', 'Orbitron', monospace;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(111, 250, 255, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(162, 89, 255, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
    border-radius: 18px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #6ffaff, #a259ff, #6ffaff);
    background-size: 300% 100%;
    animation: \${moveGradient} 4s linear infinite;
    border-radius: 18px 18px 0 0;
    z-index: 1;
  }

  @media (max-width: 1200px) {
    padding: 1rem;
  }
  @media (max-width: 800px) {
    padding: 0.5rem;
  }
  @media (max-width: 600px) {
    min-height: 200px;
    padding: 0.9rem 1rem 1.15rem;
    border-radius: 16px;
    /* Fill viewport minus margins; narrower upper bound keeps cards readable */
    width: 400px;
    margin: 12px auto 16px;
    box-sizing: border-box;
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
  }
`

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
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

export const Title = styled.h1`
  color: #6ffaff;
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.15em;
  text-shadow: 0 0 16px #6ffaffcc, 0 0 4px #fff;
  font-family: 'Orbitron', 'JetBrains Mono', monospace;

  @media (max-width: 600px) {
    font-size: 1.4rem;
    margin-bottom: 0.25rem;
  }
`

export const HorizontalScroll = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 0.75rem;
  padding: 0.5rem 0 1rem 0;
  max-width: 100%;
  scrollbar-width: thin;
  scrollbar-color: #6ffaff #181818;
  &::-webkit-scrollbar {
    height: 6px;
    background: #181818;
  }
  &::-webkit-scrollbar-thumb {
    background: #6ffaff;
    border-radius: 4px;
    box-shadow: 0 0 8px rgba(111, 250, 255, 0.5);
  }
`

// Card wrapper to match StyledGameCard sizing
export const MenuCardWrapper = styled.div`
  width: 150px;
  min-width: 150px;
  max-width: 150px;
  aspect-ratio: 1/0.9;
  max-height: 100px;
  display: flex;
  align-items: stretch;
`
