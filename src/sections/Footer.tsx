import React from 'react'
import styled, { keyframes } from 'styled-components'
import { FOOTER_LINKS, SIDEBAR_LINKS, MOBILE_FOOTER_LINKS_CONNECTED, MOBILE_FOOTER_LINKS_DISCONNECTED } from '../constants'
import ConnectionStatus from '../components/ConnectionStatus'
import { useWallet } from '@solana/wallet-adapter-react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../themes/ThemeContext';
// ––––– Animations ––––– //

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

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

// ––––– Styled Components ––––– //

const StyledFooter = styled.footer<{ $theme?: any }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 72px;
  padding: 0 48px;
  background: ${({ $theme }) => $theme?.colors?.background || 'rgba(24, 24, 24, 0.9)'};
  backdrop-filter: blur(20px);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
  border-top: 2px solid ${({ $theme }) => $theme?.colors?.border || 'rgba(255, 215, 0, 0.2)'};
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: space-between;

  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: ${({ $theme }) => $theme?.colors?.text || '#ddd'};
  z-index: 1000;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(circle at 20% 50%, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}11 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}11 0%, transparent 50%);
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
    background: linear-gradient(90deg, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}, ${({ $theme }) => $theme?.colors?.accent || '#ff00cc'}, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'});
    background-size: 300% 100%;
    animation: ${moveGradient} 4s linear infinite;
  }

  /* Hide desktop footer for midscreen and below (<=900px) so sidebar bottom nav or burger takes over */
  @media (max-width: 900px) {
    display: none;
  }
`

const MobileFooter = styled.footer<{ $theme?: any }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 56px;
  background: ${({ $theme }) => $theme?.colors?.background || 'rgba(24, 24, 24, 0.98)'};
  border-top: 2px solid ${({ $theme }) => $theme?.colors?.border || 'rgba(255, 215, 0, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1001;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.25);
  font-size: 0.98rem;
  padding: 0 4px;

  @media (min-width: 901px) {
    display: none;
  }
`;

const FooterLinks = styled.ul<{ $theme?: any }>`
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
    color: ${({ $theme }) => $theme?.colors?.text || '#ddd'};
    text-decoration: none;
    font-size: 15px;
    transition: all 0.3s ease;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid transparent;

    &:hover {
      color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
      background: ${({ $theme }) => $theme?.colors?.surface || 'rgba(255, 215, 0, 0.1)'};
      border: 1px solid ${({ $theme }) => $theme?.colors?.border || 'rgba(255, 215, 0, 0.3)'};
      box-shadow: ${({ $theme }) => $theme?.effects?.glow || '0 0 12px rgba(255, 215, 0, 0.2)'};
      text-shadow: 0 0 8px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
      transform: translateY(-2px);
    }

    &::before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      background: linear-gradient(45deg, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}, ${({ $theme }) => $theme?.colors?.accent || '#ff00cc'}, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'});
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

const StyledConnectionStatus = styled.div`
  display: inline-block;

  button {
    font-weight: 700;
    color: #00ff88;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    user-select: none;
    white-space: nowrap;
    font-size: 16px;
    padding: 8px 16px;
    border-radius: 12px;
    border: 2px solid #00ff88;
    background: rgba(0, 255, 136, 0.1);
    backdrop-filter: blur(10px);
    animation: ${liveGlow} 2s infinite alternate;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    cursor: pointer;

    &::before {
      content: '🟢';
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
      background: linear-gradient(45deg, #00ff88, transparent, #00ff88);
      border-radius: 12px;
      opacity: 0.3;
      z-index: -1;
      animation: ${moveGradient} 3s linear infinite;
      background-size: 300% 100%;
    }

    span {
      font-size: 16px;
    }
  }
`

function Footer() {
  const { connected, publicKey } = useWallet();
  const location = useLocation();
  const { currentTheme } = useTheme();
  return (
    <>
      <StyledFooter $theme={currentTheme}>
        <StyledConnectionStatus>
          <ConnectionStatus />
        </StyledConnectionStatus>
        <FooterLinks $theme={currentTheme}>
          {FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} rel="noopener noreferrer">
                {link.title}
              </a>
            </li>
          ))}
        </FooterLinks>
      </StyledFooter>

      <MobileFooter $theme={currentTheme}>
        {(connected ? MOBILE_FOOTER_LINKS_CONNECTED : MOBILE_FOOTER_LINKS_DISCONNECTED).map((link) => {
          // Special handling for Games modal trigger (only available when connected)
          if ('label' in link && link.label === 'Games') {
            return (
              <button
                key={link.title}
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openGamesModal'));
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffd700',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  padding: '0 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                {link.title}
              </button>
            );
          }
          
          // Regular navigation links
          const href = typeof link.href === 'string' && link.href.includes('${base58}') 
            ? link.href.replace('${base58}', publicKey?.toBase58() || '') 
            : link.href;
            
          return (
            <a
              key={link.title}
              href={href}
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
          );
        })}
      </MobileFooter>
    </>
  );
}

export default Footer;
