import React from 'react'
import styled, { css } from 'styled-components'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useToastStore, type Toast as TToast } from '../hooks/useToast'

const StyledToasts = styled.div`
  position: fixed;
  right: 0;
  top: 60px;
  pointer-events: none;
  z-index: 1001;
  display: flex;
  flex-direction: column-reverse;
  gap: 12px;
  padding: 16px;
  width: 100%;
  max-width: 400px;
  
  /* Prevent affecting viewport calculations */
  transform: translateZ(0);
  will-change: transform;

  /* Mobile-first responsive design */
  @media (min-width: 640px) {
    padding: 20px;
    gap: 14px;
  }

  @media (min-width: 800px) {
    width: unset;
    top: unset;
    bottom: 0px;
    padding: 24px;
    gap: 16px;
    max-width: 380px;
  }

  @media (min-width: 1200px) {
    padding: 32px;
    max-width: 420px;
  }
`

const StackedToast = styled.div`
  background: linear-gradient(135deg, rgba(28, 28, 36, 0.95), rgba(40, 40, 50, 0.9));
  width: 100%;
  border-radius: 16px;
  height: 60px;
  transform: translateY(-60px);
  z-index: -1;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  
  @media (min-width: 640px) {
    border-radius: 18px;
    height: 65px;
    transform: translateY(-65px);
  }
`

const StyledToast = styled.div`
  @property --fade-in {
    syntax: '<percentage>';
    initial-value: 0%;
    inherits: false;
  }
  
  @keyframes toast-appear {
    0% { 
      opacity: 0; 
      --fade-in: 100%; 
      transform: translateY(20px) scale(0.95);
    }
    100% { 
      opacity: 1; 
      --fade-in: 0%; 
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes toast-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(149, 100, 255, 0.3), 0 4px 20px rgba(0, 0, 0, 0.3); }
    50% { box-shadow: 0 0 30px rgba(149, 100, 255, 0.5), 0 6px 25px rgba(0, 0, 0, 0.4); }
  }

  /* Casino-themed gradient background */
  background: linear-gradient(135deg, 
    rgba(28, 28, 36, 0.98) 0%,
    rgba(40, 40, 50, 0.95) 50%,
    rgba(32, 32, 42, 0.98) 100%
  );
  
  /* Casino gold accent border */
  border: 2px solid transparent;
  background-clip: padding-box;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 2px;
    background: linear-gradient(135deg, 
      rgba(255, 215, 0, 0.8) 0%,
      rgba(255, 165, 0, 0.6) 25%,
      rgba(149, 100, 255, 0.7) 50%,
      rgba(255, 20, 147, 0.6) 75%,
      rgba(255, 215, 0, 0.8) 100%
    );
    border-radius: inherit;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: xor;
    -webkit-mask-composite: xor;
  }
  
  color: #ffffff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: auto;
  user-select: none;
  cursor: pointer;
  padding: 16px;
  position: relative;
  overflow: hidden;

  animation: toast-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  width: 100%;

  /* Enhanced shadow and blur effects - reduced for performance */
  box-shadow: 
    0 0 15px rgba(149, 100, 255, 0.25),
    0 4px 15px rgba(0, 0, 0, 0.25),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  
  /* Force hardware acceleration to prevent layout issues */
  transform: translateZ(0);
  will-change: transform, opacity;
  
  /* Subtle inner glow */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
    );
  }

  &:hover {
    background: linear-gradient(135deg, 
      rgba(35, 35, 45, 0.98) 0%,
      rgba(48, 48, 60, 0.95) 50%,
      rgba(40, 40, 52, 0.98) 100%
    );
    
    animation: toast-glow 2s ease-in-out infinite;
    transform: translateY(-2px) scale(1.02);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &:active {
    transform: translateY(0) scale(0.98);
    transition: all 0.1s ease;
  }

  /* Mobile-first responsive sizing */
  @media (min-width: 640px) {
    padding: 18px;
    border-radius: 18px;
    gap: 10px;
  }

  @media (min-width: 800px) {
    min-width: 280px;
    max-width: 350px;
    padding: 20px;
    border-radius: 20px;
    transform: translateX(var(--fade-in));
  }

  @media (min-width: 1200px) {
    min-width: 320px;
    max-width: 400px;
    padding: 22px;
  }
`

const StyledTimer = styled.div<{$ticking: boolean}>`
  @keyframes timer-countdown {
    0% { width: 100%; }
    100% { width: 0%; }
  }
  
  @keyframes timer-pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
  
  width: 100%;
  height: 4px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  margin-top: 4px;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    border-radius: 8px;
    background: linear-gradient(90deg, 
      #9564ff 0%,
      #ff6b9d 50%,
      #ffd700 100%
    );
    ${(props) => props.$ticking && css`
      animation: timer-countdown linear 10s, timer-pulse ease-in-out 2s infinite;
      width: 100%;
    `}
    ${(props) => !props.$ticking && css`
      width: 100%;
    `}
  }
  
  /* Mobile responsive height */
  @media (min-width: 640px) {
    height: 5px;
    margin-top: 6px;
  }
  
  @media (min-width: 800px) {
    height: 6px;
    margin-top: 8px;
  }
`

function Toast({ toast }: {toast: TToast}) {
  const timeout = React.useRef<NodeJS.Timer>()
  const discard = useToastStore((state) => state.discard)
  const [ticking, setTicking] = React.useState(true)

  React.useLayoutEffect(
    () => {
      timeout.current = setTimeout(() => {
        discard(toast.id)
      }, 10000)
      return () => clearTimeout(timeout.current)
    },
    [toast.id],
  )

  const pauseTimer = () => {
    setTicking(false)
    clearTimeout(timeout.current)
  }
  const resumeTimer = () => {
    setTicking(true)
    timeout.current = setTimeout(() => {
      discard(toast.id)
    }, 10000)
  }

  return (
    <StyledToast
      onClick={() => discard(toast.id)}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
    >
      <div>
        <div style={{ 
          fontWeight: '700',
          fontSize: '1.1em',
          background: 'linear-gradient(135deg, #ffd700, #ff6b9d, #9564ff)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          marginBottom: '4px',
          lineHeight: '1.3'
        }}>
          {toast.title}
        </div>
        <div style={{ 
          color: 'rgba(255, 255, 255, 0.85)', 
          fontSize: '0.92em',
          lineHeight: '1.4',
          fontWeight: '400'
        }}>
          {toast.description}
        </div>
        {toast.link && (
          <div style={{
            marginTop: '8px',
            fontSize: '0.85em',
            color: '#9564ff',
            textDecoration: 'underline',
            opacity: 0.9
          }}>
            View Transaction →
          </div>
        )}
      </div>
      <StyledTimer $ticking={ticking} />
    </StyledToast>
  )
}

export default function Toasts() {
  const toasts = useToastStore((state) => [...state.toasts].reverse())
  const showAll = useMediaQuery('sm')

  const visible = showAll ? toasts : toasts.slice(0, 1)

  return (
    <StyledToasts>
      {visible.map((toast, i) => (
        <Toast toast={toast} key={toast.id} />
      ))}
      {!showAll && toasts.length > 1 && (
        <StackedToast />
      )}
    </StyledToasts>
  )
}
