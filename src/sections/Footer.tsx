import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { FOOTER_LINKS } from '../constants'
import { getAccessWindow, isWithinAccessTime } from '../utils/timeAccess'
import { useLocation } from 'react-router-dom'

// Casino animations
const liveGlow = keyframes`
  0% { 
    box-shadow: 0 0 8px #00ff88;
    text-shadow: 0 0 8px #00ff88;
  }
  100% { 
    box-shadow: 0 0 16px #00ff88, 0 0 32px #00ff4488;
    text-shadow: 0 0 16px #00ff88, 0 0 32px #00ff4488;
  }
`;

const offlineGlow = keyframes`
  0% { 
    text-shadow: 0 0 8px #ff4444;
  }
  100% { 
    text-shadow: 0 0 16px #ff4444, 0 0 32px #ff444488;
  }
`;

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const StyledFooter = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 72px;
  padding: 0 48px;
  background: rgba(24, 24, 24, 0.9);
  backdrop-filter: blur(20px);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
  border-top: 2px solid rgba(255, 215, 0, 0.2);
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: space-between;

  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #ddd;
  z-index: 1000;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(162, 89, 255, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    animation: ${moveGradient} 4s linear infinite;
  }

  @media (max-width: 600px) {
    display: none;
  }
`

// Mobile footer
const MobileFooter = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 56px;
  background: rgba(24, 24, 24, 0.98);
  border-top: 2px solid rgba(255, 215, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1001;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.25);
  font-size: 0.98rem;
  padding: 0 4px;

  @media (min-width: 601px) {
    display: none;
  }
`;

const FooterLinks = styled.ul`
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    font-weight: 500;
    position: relative;
  }

  a {
    color: #ddd;
    text-decoration: none;
    font-size: 15px;
    transition: all 0.3s ease;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid transparent;

    &:hover {
      color: #ffd700;
      background: rgba(255, 215, 0, 0.1);
      border: 1px solid rgba(255, 215, 0, 0.3);
      box-shadow: 0 0 12px rgba(255, 215, 0, 0.2);
      text-shadow: 0 0 8px #ffd700;
      transform: translateY(-2px);
    }

    &::before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      background: linear-gradient(45deg, #ffd700, #a259ff, #ff00cc, #ffd700);
      border-radius: 8px;
      opacity: 0;
      z-index: -1;
      transition: opacity 0.3s ease-in-out;
    }

    &:hover::before {
      opacity: 0.1;
    }
  }
`

const LiveStatus = styled.div<{ $live: boolean }>`
  font-weight: 700;
  color: ${({ $live }) => ($live ? '#00ff88' : '#ff6666')};
  font-family: 'Luckiest Guy', cursive, sans-serif;
  user-select: none;
  white-space: nowrap;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 12px;
  border: 2px solid ${({ $live }) => ($live ? '#00ff88' : '#ff6666')};
  background: ${({ $live }) => ($live ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 102, 102, 0.1)')};
  backdrop-filter: blur(10px);
  animation: ${({ $live }) => ($live ? liveGlow : offlineGlow)} 2s infinite alternate;
  letter-spacing: 1px;
  position: relative;

  &::before {
    content: '${({ $live }) => ($live ? '🟢' : '🔴')}';
    margin-right: 8px;
    font-size: 12px;
  }

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, ${({ $live }) => ($live ? '#00ff88' : '#ff6666')}, transparent, ${({ $live }) => ($live ? '#00ff88' : '#ff6666')});
    border-radius: 12px;
    opacity: 0.3;
    z-index: -1;
    animation: ${moveGradient} 3s linear infinite;
    background-size: 300% 100%;
  }
`

function formatTime(ms: number): string {
  if (ms <= 0) return '00:00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export default function Footer() {
  const [isLive, setIsLive] = useState(isWithinAccessTime())
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const { start, end } = getAccessWindow()
      const liveNow = isWithinAccessTime()
      setIsLive(liveNow)

      if (liveNow) {
        setTimeRemaining(end.getTime() - now.getTime())
      } else {
        setTimeRemaining(start.getTime() - now.getTime())
      }
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <StyledFooter>
        <LiveStatus $live={isLive}>
          {isLive
            ? `LIVE — ends in ${formatTime(timeRemaining)}`
            : `OFFLINE — next live in ${formatTime(timeRemaining)}`}
        </LiveStatus>

        <FooterLinks>
          {FOOTER_LINKS.map((link, idx) => (
            <li key={link.href}>
              <a href={link.href} rel="noopener noreferrer">
                {link.title}
              </a>
            </li>
          ))}
        </FooterLinks>
      </StyledFooter>
      {/* Mobile footer */}
      <MobileFooter>
        <span style={{ fontWeight: 700, color: isLive ? '#00ff88' : '#ff6666', fontFamily: 'Luckiest Guy, cursive', fontSize: '1.05rem' }}>
          {isLive ? '🟢 LIVE' : '🔴 OFFLINE'}
        </span>
        {FOOTER_LINKS.slice(0, 3).map((link, idx) => (
          <a
            key={link.href}
            href={link.href}
            rel="noopener noreferrer"
            style={{
              color: '#ffd700',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.05rem',
              padding: '0 8px',
              borderRadius: '6px',
            }}
          >
            {link.title}
          </a>
        ))}
      </MobileFooter>
    </>
  )
}
