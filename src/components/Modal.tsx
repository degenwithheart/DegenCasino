import React, { useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface Props extends React.PropsWithChildren {
  onClose?: () => void;
}

// Quantum foam dissolve animation
const quantumDissolve = keyframes`
  0% { opacity: 0; filter: blur(12px); transform: scale(0.8) rotate(-10deg); }
  60% { opacity: 1; filter: blur(2px); transform: scale(1.05) rotate(2deg); }
  100% { opacity: 1; filter: blur(0); transform: scale(1) rotate(0deg); }
`;

// Portal ring animation
const rotateRing = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at center, #0a0a1a 60%, #1a0033 100%);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ParticleField = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
`;

const Portal = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: radial-gradient(circle, #1a0033 60%, #0a0a1a 100%);
  box-shadow: 0 0 80px 20px #6ffaff44, 0 0 0 8px #2e1a4d99;
  animation: ${quantumDissolve} 0.8s cubic-bezier(0.7,0.2,0.2,1);
  overflow: visible;
  @media (max-width: 600px) {
    width: 98vw;
    height: 98vw;
    max-width: 98vw;
    max-height: 98vw;
  }
`;

const EnergyRing = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50%;
  border: 6px solid #6ffaffcc;
  box-shadow: 0 0 32px 8px #6ffaff99, 0 0 0 2px #fff2;
  pointer-events: none;
  animation: ${rotateRing} 4s linear infinite;
`;

const EnergyRing2 = styled(EnergyRing)`
  border: 3px dashed #a259ffcc;
  box-shadow: 0 0 24px 4px #a259ff66, 0 0 0 1px #fff1;
  animation-duration: 7s;
  animation-direction: reverse;
`;

const HoloText = styled.div`
  position: absolute;
  top: 18%;
  left: 50%;
  transform: translateX(-50%);
  color: #6ffaff;
  font-family: 'Orbitron', 'JetBrains Mono', monospace;
  font-size: 1.2rem;
  letter-spacing: 0.12em;
  text-shadow: 0 0 12px #6ffaffcc, 0 0 2px #fff;
  pointer-events: none;
  user-select: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  background: rgba(20, 30, 60, 0.92);
  border-radius: 18px;
  box-shadow: 0 0 32px #6ffaff33, 0 0 0 2px #fff2;
  padding: 2.5rem 2rem 2rem 2rem;
  min-height: 120px;
  color: #eaf6fb;
  font-family: 'JetBrains Mono', 'Orbitron', 'monospace';
  animation: ${quantumDissolve} 0.8s cubic-bezier(0.7,0.2,0.2,1);
  box-sizing: border-box;
  @media (max-width: 600px) {
    min-width: 0;
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: linear-gradient(135deg, #6ffaff44, #a259ff33);
  border: none;
  color: #fff;
  font-size: 1.6rem;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  cursor: pointer;
  box-shadow: 0 2px 8px #6ffaff33;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s, transform 0.18s;
  z-index: 10;
  &:hover {
    background: linear-gradient(135deg, #a259ff88, #6ffaff88);
    transform: scale(1.08);
  }
`;

// Particle system for quantum foam
function useQuantumParticles(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame: number;
    let particles = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.7,
      dx: (Math.random() - 0.5) * 0.002,
      dy: (Math.random() - 0.5) * 0.002,
      a: Math.random() * Math.PI * 2,
    }));
    function draw() {
      if (!ctx || !canvas) return;
      const w = canvas.width = window.innerWidth;
      const h = canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.dx;
        p.y += p.dy;
        p.a += 0.01 + Math.random() * 0.01;
        if (p.x < 0 || p.x > 1) p.dx *= -1;
        if (p.y < 0 || p.y > 1) p.dy *= -1;
        const px = p.x * w;
        const py = p.y * h;
        ctx.save();
        ctx.globalAlpha = 0.18 + 0.18 * Math.sin(p.a);
        ctx.beginPath();
        ctx.arc(px, py, p.r + Math.sin(p.a) * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = '#6ffaff';
        ctx.shadowColor = '#6ffaff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, [canvasRef]);
}

export const Modal: React.FC<Props> = ({ children, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useQuantumParticles(canvasRef);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <Overlay>
      <ParticleField ref={canvasRef} />
      <Portal>
        <EnergyRing />
        <EnergyRing2 />
        <HoloText>QUANTUM PORTAL</HoloText>
        <Content>
          {onClose && (
            <CloseButton onClick={onClose} aria-label="Close modal">×</CloseButton>
          )}
          {children}
        </Content>
      </Portal>
    </Overlay>
  );
};
