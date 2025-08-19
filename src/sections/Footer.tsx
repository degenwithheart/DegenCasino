import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { FOOTER_LINKS, SIDEBAR_LINKS } from '../constants'
// import { useLocation } from 'react-router-dom' // (moved below)
import ConnectionStatus from '../components/ConnectionStatus' // Keep if still used elsewhere
import { FiMenu, FiX } from 'react-icons/fi';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link, useLocation } from 'react-router-dom';
// Mobile sidebar drawer styles
const DrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.55);
  z-index: 2002;
  display: flex;
`;

const Drawer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 80vw;
  max-width: 320px;
  background: linear-gradient(180deg, #222 0%, #a259ff 100%);
  box-shadow: 2px 0 16px #ffd70044;
  z-index: 2003;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem 1rem 1rem;
  animation: slideInDrawer 0.25s cubic-bezier(.4,1.3,.6,1) both;

  @keyframes slideInDrawer {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
`;

const DrawerClose = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  color: #ffd700;
  font-size: 2rem;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const DrawerLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DrawerItem = styled.li<{ $active?: boolean }>`
  a, button {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: ${({ $active }) => ($active ? '#ffd700' : '#fff')};
    background: none;
    border: none;
    font-size: 1.2rem;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    cursor: pointer;
    transition: color 0.2s;
    padding: 0.5rem 0.2rem;
    border-radius: 8px;
    &:hover {
      color: #ffd700;
      text-shadow: 0 0 8px #a259ff;
      background: rgba(255,215,0,0.07);
    }
    svg {
      font-size: 1.5rem;
      margin-right: 0.7rem;
    }
  }
`;

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

  /* Hide desktop footer for midscreen and below (<=900px) so sidebar bottom nav or burger takes over */
  @media (max-width: 900px) {
    display: none;
  }
`

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { connected, publicKey } = useWallet();
  const location = useLocation();
  return (
    <>
      <StyledFooter>
        <StyledConnectionStatus>
          <ConnectionStatus />
        </StyledConnectionStatus>
        <FooterLinks>
          {FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} rel="noopener noreferrer">
                {link.title}
              </a>
            </li>
          ))}
        </FooterLinks>
      </StyledFooter>

      <MobileFooter>
        {/* Burger menu icon and status */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            aria-label="Open menu"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffd700',
              fontSize: 28,
              marginRight: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => setMobileMenuOpen(true)}
          >
            <FiMenu />
          </button>
          <StyledConnectionStatus>
            <ConnectionStatus />
          </StyledConnectionStatus>
        </div>
        {FOOTER_LINKS.slice(0, 3).map((link) => (
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

      {/* Mobile sidebar drawer/modal */}
      {mobileMenuOpen && (
        <DrawerOverlay onClick={() => setMobileMenuOpen(false)}>
          <Drawer onClick={e => e.stopPropagation()}>
            <DrawerClose aria-label="Close menu" onClick={() => setMobileMenuOpen(false)}>
              <FiX />
            </DrawerClose>
            <DrawerLinks>
              {SIDEBAR_LINKS.filter(link =>
                typeof link.showWhen === 'function' ? link.showWhen(connected) : true
              ).map((link, i) => {
                const to = typeof link.to === 'function'
                  ? link.to(publicKey?.toBase58() ?? null)
                  : link.to;
                const isActive = to && typeof to === 'string' ? location.pathname === to : false;
                if (link.external) {
                  return (
                    <DrawerItem key={i}>
                      <a href={to as string} target="_blank" rel="noopener noreferrer">
                        <link.icon />
                        <span>{link.label}</span>
                      </a>
                    </DrawerItem>
                  );
                }
                if (link.label === 'Games') {
                  return (
                    <DrawerItem key={i}>
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('openGamesModal'));
                          setMobileMenuOpen(false);
                        }}
                      >
                        <link.icon />
                        <span>{link.label}</span>
                      </button>
                    </DrawerItem>
                  );
                }
                return (
                  <DrawerItem key={i} $active={isActive}>
                    <Link to={to as string} onClick={() => setMobileMenuOpen(false)}>
                      <link.icon />
                      <span>{link.label}</span>
                    </Link>
                  </DrawerItem>
                );
              })}
            </DrawerLinks>
          </Drawer>
        </DrawerOverlay>
      )}
    </>
  );
}

export default Footer;
