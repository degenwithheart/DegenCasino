import React from 'react'
import { Icon } from './Icon'
import useOutsideClick from '../../hooks/ui/useOutsideClick'
import styled, { keyframes } from 'styled-components'

interface Props extends React.PropsWithChildren {
  onClose?: () => void
}

// Quantum portal animations
const quantumDissolve = keyframes`
  0% { opacity: 0; filter: blur(12px); transform: scale(0.8) rotate(-10deg); }
  60% { opacity: 1; filter: blur(2px); transform: scale(1.05) rotate(2deg); }
  100% { opacity: 1; filter: blur(0); transform: scale(1) rotate(0deg); }
`;

const portalRing = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at center, #0a0a1a 60%, #1a0033 100%);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: ${quantumDissolve} 0.8s cubic-bezier(0.7,0.2,0.2,1);
`

const Portal = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: radial-gradient(circle, #1a0033 60%, #0a0a1a 100%);
  box-shadow: 0 0 80px 20px rgba(111, 250, 255, 0.3), 0 0 0 8px rgba(46, 26, 77, 0.6);

  @media (max-width: 600px) {
    width: 98vw;
    height: 98vw;
    max-width: 98vw;
    max-height: 98vw;
  }
`

const EnergyRing = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50%;
  border: 6px solid rgba(111, 250, 255, 0.8);
  box-shadow: 0 0 32px 8px rgba(111, 250, 255, 0.6), 0 0 0 2px rgba(255, 255, 255, 0.1);
  pointer-events: none;
  animation: ${portalRing} 4s linear infinite;
`

const EnergyRing2 = styled(EnergyRing)`
  border: 3px dashed rgba(162, 89, 255, 0.8);
  box-shadow: 0 0 24px 4px rgba(162, 89, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
  animation-duration: 7s;
  animation-direction: reverse;
`

const HoloText = styled.div`
  position: absolute;
  top: 18%;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(111, 250, 255, 0.9);
  font-family: 'Orbitron', 'JetBrains Mono', monospace;
  font-size: 1.2rem;
  letter-spacing: 0.12em;
  text-shadow: 0 0 12px rgba(111, 250, 255, 0.8), 0 0 2px rgba(255, 255, 255, 0.1);
  pointer-events: none;
  user-select: none;
`

const Wrapper = styled.div`
  position: relative;
  z-index: 2;
  background: rgba(20, 30, 60, 0.92);
  border-radius: 18px;
  box-shadow: 0 0 32px rgba(111, 250, 255, 0.2), 0 0 0 2px rgba(255, 255, 255, 0.1);
  padding: 1rem;
  min-height: 120px;
  color: #eaf6fb;
  font-family: 'JetBrains Mono', 'Orbitron', 'monospace';
  animation: ${quantumDissolve} 0.8s cubic-bezier(0.7,0.2,0.2,1);
  box-sizing: border-box;

  @media (max-width: 600px) {
    min-width: 0;
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
`

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, #0a0a1a 60%, #1a0033 100%);
  z-index: 100;
  overflow-y: auto;
  height: 100vh;
  animation: ${quantumDissolve} 0.8s cubic-bezier(0.7,0.2,0.2,1);

  & h1 {
    text-align: center;
    padding: 40px 0 20px 0;
    font-size: 24px;
    color: #6ffaff;
    text-shadow: 0 0 16px rgba(111, 250, 255, 0.8);
    font-family: 'Orbitron', monospace;
    @media (max-width: 600px) {
      padding: 24px 0 12px 0;
      font-size: 20px;
    }
  }

  & p {
    padding: 0 30px;
    text-align: center;
    color: #eaf6fb;
    font-family: 'JetBrains Mono', monospace;
    @media (max-width: 600px) {
      padding: 0 10px;
      font-size: 0.98rem;
    }
  }

  & button.close {
    margin: 0;
    position: absolute;
    cursor: pointer;
    right: 18px;
    top: 18px;
    border: none;
    z-index: 11;
    opacity: 0.8;
    transition: all 0.2s ease;
    background: linear-gradient(135deg, rgba(111, 250, 255, 0.2), rgba(162, 89, 255, 0.1));
    border-radius: 50%;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(111, 250, 255, 0.2);

    &:hover {
      opacity: 1;
      background: linear-gradient(135deg, rgba(162, 89, 255, 0.4), rgba(111, 250, 255, 0.4));
      transform: scale(1.08);
      box-shadow: 0 4px 12px rgba(111, 250, 255, 0.4);
    }

    & svg {
      color: #eaf6fb;
      vertical-align: middle;
    }

    @media (max-width: 600px) {
      right: 8px;
      top: 8px;
      width: 2.2em;
      height: 2.2em;
      background: rgba(0,0,0,0.1);
    }
  }
`

export function Modal({ children, onClose }: Props) {
  React.useEffect(() => {
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = oldOverflow
    }
  }, [])

  const ref = React.useRef<HTMLDivElement>(null!)

  useOutsideClick(ref, () => {
    if (onClose) onClose()
  })

  return (
    <Container>
      <Portal>
        <EnergyRing />
        <EnergyRing2 />
        <HoloText>QUANTUM PORTAL</HoloText>
        <Wrapper ref={ref}>
          {onClose && (
            <button className="close" onClick={onClose} aria-label="Close modal">
              <Icon.Close2 />
            </button>
          )}
          {children}
        </Wrapper>
      </Portal>
    </Container>
  )
}
