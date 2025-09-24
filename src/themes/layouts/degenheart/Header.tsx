import React, { useState, useEffect, useRef } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useColorScheme } from '../../ColorSchemeContext'
import { useHandleWalletConnect } from '../../../sections/walletConnect'
import { FaGem, FaBars, FaTimes, FaCopy, FaUser, FaCog, FaSignOutAlt, FaPalette, FaCoins } from 'react-icons/fa'
import { SIDEBAR_LINKS } from '../../../constants'
import { useToast } from '../../../hooks/ui/useToast'
import { Modal } from './components/Modal'
import { ColorSchemeSelector } from '../../../components'
import TokenSelect from '../../../sections/TokenSelect'

import { media, typography, spacing, components } from './breakpoints'

const heartGlow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.7));
    transform: scale(1);
  }
  25% {
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9));
    transform: scale(1.05);
  }  
  50% {
    filter: drop-shadow(0 0 25px rgba(255, 215, 0, 1));
    transform: scale(1.1);
  }
  75% {
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9));
    transform: scale(1.05);
  }
`

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
`

const HeaderContainer = styled.header<{ $colorScheme: any }>`
  width: 100%;
  /* Mobile-first: Optimized height for touch devices */
  height: 75px;
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.surface}98,
    ${props => props.$colorScheme.colors.background}90
  );
  backdrop-filter: blur(20px);
  border-bottom: 3px solid ${props => props.$colorScheme.colors.accent}40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* Mobile-first: Smaller padding for mobile screens */
  padding: 0 1rem;
  position: relative;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      transparent,
      ${props => props.$colorScheme.colors.accent},
      ${props => props.$colorScheme.colors.accent}80,
      ${props => props.$colorScheme.colors.accent},
      transparent
    );
    animation: ${heartGlow} 3s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 100%, ${props => props.$colorScheme.colors.accent}08 0%, transparent 70%);
    pointer-events: none;
  }
  
  /* Tablet and up: Standard desktop height and padding */
  ${media.tablet} {
    height: 80px;
    padding: 0 2rem;
  }
  
  /* Desktop: More generous padding */
  ${media.desktop} {
    padding: 0 2.5rem;
  }
`

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.5rem;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent, rgba(255, 215, 0, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: scale(1.08) translateY(-2px);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: scale(1.02) translateY(0);
  }
`

const LogoIcon = styled(FaGem)<{ $colorScheme: any }>`
  font-size: 2.2rem;
  color: ${props => props.$colorScheme.colors.accent};
  ${css`animation: ${heartGlow} 3s ease-in-out infinite, ${float} 4s ease-in-out infinite;`}
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.5));
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    inset: -10%;
    background: radial-gradient(circle, ${props => props.$colorScheme.colors.accent}20 0%, transparent 70%);
    border-radius: 50%;
    z-index: -1;
  }
`

const LogoText = styled.h1<{ $colorScheme: any }>`
  /* Mobile-first: Smaller, more compact text */
  font-size: 1.25rem;
  font-weight: 800;
  color: ${props => props.$colorScheme.colors.accent};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
  position: relative;
  
  background: linear-gradient(45deg, 
    ${props => props.$colorScheme.colors.accent},
    #ffd700,
    ${props => props.$colorScheme.colors.accent},
    ${props => props.$colorScheme.colors.text}
  );
  background-size: 300% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s ease-in-out infinite;
  
  @keyframes shimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    filter: blur(8px);
    opacity: 0.5;
    z-index: -1;
  }
  
  /* Tablet and up: Larger, more prominent text */
  ${media.tablet} {
    font-size: 1.5rem;
    letter-spacing: 0.08em;
  }
  
  /* Desktop: Full-size branding */
  ${media.desktop} {
    font-size: 1.6rem;
  }
`

const Navigation = styled.nav<{ $colorScheme: any; $isOpen: boolean }>`
  /* Mobile-first: Hidden by default on small screens */
  display: none;
  
  /* Mobile drawer when open */
  ${media.maxTablet} {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 75px; /* Match mobile header height */
    left: 0;
    right: 0;
    background: ${props => props.$colorScheme.colors.surface}F0;
    backdrop-filter: blur(20px);
    border-bottom: 2px solid ${props => props.$colorScheme.colors.border};
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
    transform: translateY(${props => props.$isOpen ? '0' : '-100%'});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
    max-height: calc(100vh - 75px);
    overflow-y: auto;
    
    .mobile-wallet-options {
      display: flex !important;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
      padding-top: 1rem;
      border-top: 1px solid ${props => props.$colorScheme.colors.border};
      margin-top: 1rem;
    }
  }
  
  /* Tablet and up: Show horizontal navigation */
  ${media.tablet} {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    position: static;
    background: none;
    border: none;
    flex-direction: row;
    padding: 0;
    transform: none;
    transition: none;
    z-index: auto;
    max-height: none;
    overflow-y: visible;
    
    .mobile-wallet-options {
      display: none !important;
    }
  }
  
  /* Desktop: More generous spacing */
  ${media.desktop} {
    gap: 2rem;
  }
`

const NavLink = styled.button<{ $colorScheme: any; $active: boolean }>`
  background: ${props => props.$active ? `${props.$colorScheme.colors.accent}15` : 'transparent'};
  border: 2px solid ${props => props.$active ? props.$colorScheme.colors.accent : 'transparent'};
  color: ${props => props.$active ? props.$colorScheme.colors.accent : props.$colorScheme.colors.text};
  font-weight: 600;
  /* Mobile-first: Smaller font, touch-friendly sizing */
  font-size: 0.8rem;
  padding: 0.75rem 1rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  position: relative;
  overflow: hidden;
  /* Mobile-first: Full width for better touch targets */
  width: 100%;
  text-align: center;
  min-height: 44px; /* Touch-friendly minimum */
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent, ${props => props.$colorScheme.colors.accent}20, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    border-color: ${props => props.$colorScheme.colors.accent};
    color: ${props => props.$colorScheme.colors.accent};
    background: ${props => props.$colorScheme.colors.accent}15;
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  /* Tablet and up: Inline styling with hover effects */
  ${media.tablet} {
    font-size: 0.9rem;
    padding: 0.8rem 1.6rem;
    width: auto;
    min-height: auto;
    
    &:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 5px 20px ${props => props.$colorScheme.colors.accent}30;
    }
    
    &:active {
      transform: translateY(-1px) scale(0.98);
    }
  }
`

const WalletSection = styled.div`
  display: flex;
  align-items: center;
  /* Mobile-first: Compact spacing */
  gap: 0.5rem;
  
  /* Tablet and up: More generous spacing */
  ${media.tablet} {
    gap: 1rem;
  }
`

const ThemeButton = styled.button<{ $colorScheme: any }>`
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.surface}85,
    ${props => props.$colorScheme.colors.background}70
  );
  border: 2px solid ${props => props.$colorScheme.colors.accent}50;
  color: ${props => props.$colorScheme.colors.accent};
  /* Mobile-first: Hide on mobile to save space */
  display: none;
  padding: 0.8rem 1.2rem;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(15px);
  align-items: center;
  gap: 0.6rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent, ${props => props.$colorScheme.colors.accent}15, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: ${props => props.$colorScheme.colors.accent};
    background: linear-gradient(135deg, 
      ${props => props.$colorScheme.colors.accent}25,
      ${props => props.$colorScheme.colors.accent}15
    );
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 6px 20px ${props => props.$colorScheme.colors.accent}40;
    
    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }

  /* Tablet and up: Show theme button */
  ${media.tablet} {
    display: flex;
  }
`

const TokenButton = styled.button<{ $colorScheme: any }>`
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.surface}85,
    ${props => props.$colorScheme.colors.background}70
  );
  border: 2px solid ${props => props.$colorScheme.colors.accent}50;
  color: ${props => props.$colorScheme.colors.accent};
  padding: 0.8rem 1.2rem;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent, ${props => props.$colorScheme.colors.accent}15, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: ${props => props.$colorScheme.colors.accent};
    background: linear-gradient(135deg, 
      ${props => props.$colorScheme.colors.accent}25,
      ${props => props.$colorScheme.colors.accent}15
    );
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 6px 20px ${props => props.$colorScheme.colors.accent}40;
    
    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const WalletButton = styled.button<{ $colorScheme: any }>`
  /* Mobile-first: Touch-friendly sizing */
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, ${props => props.$colorScheme.colors.accent}, ${props => props.$colorScheme.colors.accent}dd);
  color: white;
  border: 2px solid transparent;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  position: relative;
  overflow: hidden;
  min-height: 44px; /* Touch-friendly minimum */
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, ${props => props.$colorScheme.colors.accent}ee, ${props => props.$colorScheme.colors.accent}cc);
    border-color: ${props => props.$colorScheme.colors.accent}80;
    
    &::before {
      transform: translateX(100%);
    }
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  /* Tablet and up: Larger sizing with hover effects */
  ${media.tablet} {
    padding: 0.8rem 1.8rem;
    font-size: 0.9rem;
    min-height: auto;
    
    &:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 
        0 8px 25px ${props => props.$colorScheme.colors.accent}50,
        0 0 0 3px ${props => props.$colorScheme.colors.accent}20;
    }
    
    &:active {
      transform: translateY(-1px) scale(0.98);
    }
  }
`

const MenuButton = styled.button<{ $colorScheme: any }>`
  /* Mobile-first: Always visible for navigation drawer */
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$colorScheme.colors.surface}80;
  border: 2px solid ${props => props.$colorScheme.colors.accent}50;
  color: ${props => props.$colorScheme.colors.accent};
  padding: 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  min-height: 44px; /* Touch-friendly minimum */
  min-width: 44px;
  
  &:hover {
    border-color: ${props => props.$colorScheme.colors.accent};
    background: ${props => props.$colorScheme.colors.accent}20;
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    font-size: 1.2rem;
  }
  
  /* Tablet and up: Hide menu button as navigation is always visible */
  ${media.tablet} {
    display: none;
  }
`

// Wallet dropdown styles
const WalletDropdownContainer = styled.div`
  position: relative;
`

const dropdownAppear = keyframes`
  from { opacity: 0; transform: translateY(-10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`

const WalletDropdown = styled.div<{ $colorScheme: any }>`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 200px;
  background: ${props => props.$colorScheme.colors.surface}f5;
  border: 2px solid ${props => props.$colorScheme.colors.accent}30;
  border-radius: 15px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8), 0 0 24px ${props => props.$colorScheme.colors.accent}20;
  ${css`animation: ${dropdownAppear} 0.2s ease-out;`}

  @media (max-width: 768px) {
    min-width: 180px;
    right: -10px;
  }
`

const DropdownItem = styled.button<{ $colorScheme: any; $danger?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: ${props => props.$danger ? '#ff4757' : props.$colorScheme.colors.text};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  font-family: inherit;

  &:hover {
    background: ${props => props.$danger 
      ? 'rgba(255, 71, 87, 0.1)' 
      : `${props.$colorScheme.colors.accent}15`};
    color: ${props => props.$danger ? '#ff6b7a' : props.$colorScheme.colors.accent};
  }

  svg {
    font-size: 0.8rem;
    opacity: 0.8;
  }

  small {
    margin-left: auto;
    opacity: 0.6;
    font-size: 0.75rem;
  }
`

const DropdownDivider = styled.div<{ $colorScheme: any }>`
  height: 1px;
  background: ${props => props.$colorScheme.colors.border};
  margin: 0.5rem 0;
  opacity: 0.3;
`

const Header: React.FC = () => {
  const { currentColorScheme } = useColorScheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { connected, publicKey, disconnect } = useWallet()
  const walletModal = useWalletModal()
  const handleWalletConnect = useHandleWalletConnect()
  const toast = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showTokenSelect, setShowTokenSelect] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setWalletDropdownOpen(false)
      }
    }

    if (walletDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [walletDropdownOpen])

  const handleLogoClick = () => {
    navigate('/')
    setMobileMenuOpen(false)
  }

  const handleWalletClick = () => {
    if (connected) {
      setWalletDropdownOpen(!walletDropdownOpen)
    } else {
      handleWalletConnect()
    }
  }

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      toast({
        title: 'Address Copied!',
        description: 'Wallet address copied to clipboard'
      })
      setWalletDropdownOpen(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setWalletDropdownOpen(false)
    toast({
      title: 'Disconnected',
      description: 'Wallet has been disconnected'
    })
  }

  const handleProfileClick = () => {
    navigate(`/${publicKey?.toBase58()}/profile`)
    setWalletDropdownOpen(false)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <>
      <HeaderContainer $colorScheme={currentColorScheme}>
      <LogoSection onClick={handleLogoClick}>
        <LogoIcon $colorScheme={currentColorScheme} />
        <LogoText $colorScheme={currentColorScheme}>
          DegenHeart
        </LogoText>
      </LogoSection>

      <Navigation $colorScheme={currentColorScheme} $isOpen={mobileMenuOpen}>
        {/* Mobile-only wallet options when connected */}
        <div style={{ display: 'none' }} className="mobile-wallet-options">
          {connected && (
            <>
              <NavLink
                $colorScheme={currentColorScheme}
                $active={false}
                onClick={() => {
                  handleCopyAddress()
                  setMobileMenuOpen(false)
                }}
              >
                <FaCopy style={{ marginRight: '0.5rem' }} />
                Copy Address
              </NavLink>
              
              <NavLink
                $colorScheme={currentColorScheme}
                $active={false}
                onClick={() => {
                  handleProfileClick()
                  setMobileMenuOpen(false)
                }}
              >
                <FaUser style={{ marginRight: '0.5rem' }} />
                Profile
              </NavLink>
              
              <NavLink
                $colorScheme={currentColorScheme}
                $active={false}
                onClick={() => {
                  handleDisconnect()
                  setMobileMenuOpen(false)
                }}
                style={{ color: '#ff4757' }}
              >
                <FaSignOutAlt style={{ marginRight: '0.5rem' }} />
                Disconnect
              </NavLink>
            </>
          )}
          
          {!connected && (
            <NavLink
              $colorScheme={currentColorScheme}
              $active={false}
              onClick={() => {
                handleWalletConnect()
                setMobileMenuOpen(false)
              }}
            >
              Connect Wallet
            </NavLink>
          )}
        </div>
      </Navigation>

      <WalletSection>
        {connected && (
          <>
            <TokenButton 
              $colorScheme={currentColorScheme}
              onClick={() => setShowTokenSelect(true)}
            >
              <FaCoins />
              Tokens
            </TokenButton>
            
            <ThemeButton 
              $colorScheme={currentColorScheme}
              onClick={() => setShowThemeSelector(true)}
            >
              <FaPalette />
              Theme
            </ThemeButton>
          </>
        )}

        <WalletDropdownContainer ref={dropdownRef}>
          <WalletButton $colorScheme={currentColorScheme} onClick={handleWalletClick}>
            {connected && publicKey 
              ? formatAddress(publicKey.toString())
              : 'Connect Wallet'
            }
          </WalletButton>

          {connected && walletDropdownOpen && (
            <WalletDropdown $colorScheme={currentColorScheme}>
              <DropdownItem $colorScheme={currentColorScheme} onClick={handleCopyAddress}>
                <FaCopy />
                Copy Address
                <small>{formatAddress(publicKey?.toString() || '')}</small>
              </DropdownItem>
              
              <DropdownItem $colorScheme={currentColorScheme} onClick={handleProfileClick}>
                <FaUser />
                Profile
              </DropdownItem>
              
              <DropdownDivider $colorScheme={currentColorScheme} />
              
              <DropdownItem $colorScheme={currentColorScheme} onClick={handleDisconnect} $danger>
                <FaSignOutAlt />
                Disconnect
              </DropdownItem>
            </WalletDropdown>
          )}
        </WalletDropdownContainer>

        <MenuButton
          $colorScheme={currentColorScheme}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MenuButton>
      </WalletSection>
    </HeaderContainer>
    
    {/* Theme selector modal - outside header container */}
    {showThemeSelector && (
      <Modal variant="viewport" onClose={() => setShowThemeSelector(false)}>
        <ColorSchemeSelector />
      </Modal>
    )}

    {/* Token selector modal - outside header container */}
    {showTokenSelect && (
      <Modal variant="viewport" onClose={() => setShowTokenSelect(false)}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <TokenSelect />
        </div>
      </Modal>
    )}
    </>
  )
}

export default Header
