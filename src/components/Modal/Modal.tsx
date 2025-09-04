import React, { useRef, useEffect } from 'react';

interface Props extends React.PropsWithChildren {
  onClose?: () => void;
}

import { 
  Overlay, 
  ParticleField, 
  Portal, 
  EnergyRing, 
  EnergyRing2,
  HoloText, 
  Content, 
  CloseButton,
  quantumDissolve,
  rotateRing
} from './Modal.styles'

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
