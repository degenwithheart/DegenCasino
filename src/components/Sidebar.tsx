import React, { useState, useEffect } from 'react'
import { useIsCompact } from '../hooks/useIsCompact';
import styled, { keyframes } from 'styled-components'
import { NavLink } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { generateUsernameFromWallet } from '../sections/userProfileUtils'

// Casino animations
const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 12px #a259ff88, 0 0 24px #ffd70044;
    border-color: #ffd70044;
  }
  100% { 
    box-shadow: 0 0 24px #ffd700cc, 0 0 48px #a259ff88;
    border-color: #ffd700aa;
  }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const SidebarContainer = styled.div<{ $compact: boolean }>`
  position: fixed;
  top: 100px;
  left: 0;
  width: ${({ $compact }) => ($compact ? '80px' : '260px')};
  height: 100%;
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  border-right: 2px solid rgba(255, 215, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  padding: ${({ $compact }) => ($compact ? '10px 0' : '20px')};
  overflow-y: auto;
  gap: 8px;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 10% 20%, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 90% 80%, rgba(162, 89, 255, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, #ffd700, #a259ff);
    border-radius: 6px;
    box-shadow: 0 0 8px #ffd70088;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
  }

  @media (max-width: 600px) {
    top: 80px;
    height: calc(100vh - 80px);
  }

  .menu-anim {
    transition: transform 0.3s cubic-bezier(.68,-0.55,.27,1.55), filter 0.3s;
  }
  .menu-anim.bounce:hover img {
    transform: translateY(-8px) scale(1.15);
    filter: drop-shadow(0 0 12px #ffd700);
  }
  .menu-anim.spin:hover img {
    transform: rotate(360deg) scale(1.15);
    filter: drop-shadow(0 0 12px #a259ff);
  }
  .menu-anim.flip:hover img {
    transform: rotateY(180deg) scale(1.15);
    filter: drop-shadow(0 0 12px #ff00cc);
  }
  .menu-anim.pulse:hover img {
    transform: scale(1.2);
    filter: drop-shadow(0 0 16px #ffd700);
  }
  .menu-anim.shake:hover img {
    animation: shake 0.4s;
    filter: drop-shadow(0 0 12px #ff3333);
  }
  @keyframes shake {
    0% { transform: translateX(0); }
    20% { transform: translateX(-4px); }
    40% { transform: translateX(4px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
    100% { transform: translateX(0); }
  }
`

const GameItem = styled(NavLink)<{ $compact: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 14px;
  color: #eee;
  font-size: 1.05rem;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease-in-out;
  position: relative;
  margin: 2px 0;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(162, 89, 255, 0.05));
    transform: translateX(4px) scale(1.02);
    border: 1px solid rgba(255, 215, 0, 0.2);
    box-shadow: 0 0 12px rgba(255, 215, 0, 0.15);
  }

  &.active {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.12), rgba(162, 89, 255, 0.08));
    border: 1px solid rgba(255, 215, 0, 0.3);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
    color: #ffd700;
  }

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(45deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    border-radius: 12px;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease-in-out;
  }

  &:hover::before {
    opacity: 0.1;
  }

  img {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    object-fit: contain;
    margin-right: ${({ $compact }) => ($compact ? '0' : '12px')};
    transition: all 0.3s;
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.1);
  }

  span {
    display: ${({ $compact }) => ($compact ? 'none' : 'inline')};
    white-space: nowrap;
    font-weight: 500;
  }
`

const ExternalLink = styled.a<{ $compact: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 14px;
  color: #eee;
  font-size: 1.05rem;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease-in-out;
  position: relative;
  margin: 2px 0;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(162, 89, 255, 0.05));
    transform: translateX(4px) scale(1.02);
    border: 1px solid rgba(255, 215, 0, 0.2);
    box-shadow: 0 0 12px rgba(255, 215, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(45deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    border-radius: 12px;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease-in-out;
  }

  &:hover::before {
    opacity: 0.1;
  }

  img {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    object-fit: contain;
    margin-right: 12px;
    transition: all 0.3s;
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.1);
    display: block;
  }

  span {
    display: ${({ $compact }) => ($compact ? 'none' : 'inline')};
    white-space: nowrap;
    font-weight: 500;
  }
`

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: block;
  }
`

// Alias for backwards compatibility
const StyledNavLink = GameItem;

const DesktopOnly = styled.div`
  @media (max-width: 767px) {
    display: none;
  }
`

const SectionTitle = styled.h4<{ $compact: boolean }>`
  font-size: 0.85rem;
  color: #ffd700;
  text-transform: uppercase;
  margin: 24px 12px 8px;
  display: ${({ $compact }) => ($compact ? 'none' : 'block')};
  user-select: none;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  text-shadow: 0 0 8px #ffd700;
  letter-spacing: 1px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #ffd700, #a259ff, transparent);
    border-radius: 1px;
    animation: ${moveGradient} 3s linear infinite;
    background-size: 200% 100%;
  }
`

const Sidebar: React.FC = () => {
  const { compact } = useIsCompact();
  const { connected, publicKey } = useWallet()
  const base58 = publicKey?.toBase58() ?? null

  const getAvatarUrl = (key: string | null) =>
    key ? `https://robohash.org/${key}` : '/user.png'

  // Use deterministic username generator and localStorage sync
  const getUsername = (key: string | null) => {
    if (!key) return 'Degen-Guest'
    let stored = localStorage.getItem(`username-${key}`)
    if (!stored) {
      stored = generateUsernameFromWallet(key)
      localStorage.setItem(`username-${key}`, stored)
    }
    return stored
  }

  const [username, setUsername] = useState('Degen-Guest')
  const [avatarUrl, setAvatarUrl] = useState(getAvatarUrl(base58))

  useEffect(() => {
    setAvatarUrl(getAvatarUrl(base58))
    setUsername(getUsername(base58))
  }, [base58])

  return (
    <SidebarContainer $compact={compact}>
      {/* ...existing menu items... */}
      <StyledNavLink
        to="/"
        $compact={compact}
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        {compact ? (
          <img src="https://cdn-icons-png.flaticon.com/512/1946/1946436.png" alt="Home" style={{ width: 28, height: 28, margin: '0 auto', display: 'block' }} />
        ) : (
          <span>Home</span>
        )}
      </StyledNavLink>

      {connected && (
        <>
          <StyledNavLink
            to={`/${base58}/profile`}
            $compact={compact}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {compact ? (
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Profile" style={{ width: 28, height: 28, margin: '0 auto', display: 'block' }} />
            ) : (
              <span>Profile</span>
            )}
          </StyledNavLink>
        </>
      )}

      <SectionTitle $compact={compact}>📄 Degen Pages</SectionTitle>

      <StyledNavLink
        to="/exchange"
        $compact={compact}
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        {compact ? (
          <img src="https://cdn-icons-png.flaticon.com/512/992/992651.png" alt="Exchange" style={{ width: 28, height: 28, margin: '0 auto', display: 'block' }} />
        ) : (
          <span>Exchange</span>
        )}
      </StyledNavLink>

      <StyledNavLink
        to="/aboutme"
        $compact={compact}
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        {compact ? (
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="About" style={{ width: 28, height: 28, margin: '0 auto', display: 'block' }} />
        ) : (
          <span>About</span>
        )}
      </StyledNavLink>

      <StyledNavLink
        to="/terms"
        $compact={compact}
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        {compact ? (
          <img src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png" alt="Terms" style={{ width: 28, height: 28, margin: '0 auto', display: 'block' }} />
        ) : (
          <span>Terms</span>
        )}
      </StyledNavLink>

      <StyledNavLink
        to="/whitepaper"
        $compact={compact}
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        {compact ? (
          <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" alt="Whitepaper" style={{ width: 28, height: 28, margin: '0 auto', display: 'block' }} />
        ) : (
          <span>Whitepaper</span>
        )}
      </StyledNavLink>

      <ExternalLinksContainer>
        <a
          href="https://github.com/degenwithheart"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on GitHub"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="Follow on Github" style={{ width: 32, height: 32, display: 'block' }} />
        </a>
        <a
          href="https://x.com/DegenWithHeart"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on X"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Follow on X" style={{ width: 32, height: 32, display: 'block' }} />
        </a>
      </ExternalLinksContainer>
    </SidebarContainer>
  );
}

const ExternalLinksContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 30px;
  padding-bottom: 24px;
  width: 100%;
  z-index: 2;
  background: none;
  margin: 24px 0 8px;

  a img {
    cursor: pointer;
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

export default Sidebar
