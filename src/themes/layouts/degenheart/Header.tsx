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

const heartGlow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9));
  }
`

const HeaderContainer = styled.header<{ $colorScheme: any }>`
  width: 100%;
  height: 80px;
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.surface}95,
    ${props => props.$colorScheme.colors.background}80
  );
  backdrop-filter: blur(10px);
  border-bottom: 2px solid ${props => props.$colorScheme.colors.accent}30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent,
      ${props => props.$colorScheme.colors.accent},
      transparent
    );
  }
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`

const LogoIcon = styled(FaGem)<{ $colorScheme: any }>`
  font-size: 2rem;
  color: ${props => props.$colorScheme.colors.accent};
  ${css`animation: ${heartGlow} 2s ease-in-out infinite;`}
`

const LogoText = styled.h1<{ $colorScheme: any }>`
  font-size: 1.5rem;
  font-weight: 900;
  color: ${props => props.$colorScheme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
  
  background: linear-gradient(45deg, 
    ${props => props.$colorScheme.colors.accent},
    ${props => props.$colorScheme.colors.text}
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`

const Navigation = styled.nav<{ $colorScheme: any; $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: ${props => props.$colorScheme.colors.surface};
    border-bottom: 2px solid ${props => props.$colorScheme.colors.border};
    flex-direction: column;
    padding: 2rem;
    gap: 1.5rem;
    transform: translateY(${props => props.$isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
    z-index: 999;
    
    .mobile-wallet-options {
      display: flex !important;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      padding-top: 1rem;
      border-top: 1px solid ${props => props.$colorScheme.colors.border};
      margin-top: 1rem;
    }
  }
`

const NavLink = styled.button<{ $colorScheme: any; $active: boolean }>`
  background: none;
  border: 2px solid ${props => props.$active ? props.$colorScheme.colors.accent : 'transparent'};
  color: ${props => props.$active ? props.$colorScheme.colors.accent : props.$colorScheme.colors.text};
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:hover {
    border-color: ${props => props.$colorScheme.colors.accent};
    color: ${props => props.$colorScheme.colors.accent};
    background: ${props => props.$colorScheme.colors.accent}10;
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`

const WalletSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`

const ThemeButton = styled.button<{ $colorScheme: any }>`
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.surface}80,
    ${props => props.$colorScheme.colors.background}60
  );
  border: 2px solid ${props => props.$colorScheme.colors.accent}40;
  color: ${props => props.$colorScheme.colors.accent};
  padding: 0.75rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: ${props => props.$colorScheme.colors.accent};
    background: linear-gradient(135deg, 
      ${props => props.$colorScheme.colors.accent}20,
      ${props => props.$colorScheme.colors.accent}10
    );
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const TokenButton = styled.button<{ $colorScheme: any }>`
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.surface}80,
    ${props => props.$colorScheme.colors.background}60
  );
  border: 2px solid ${props => props.$colorScheme.colors.accent}40;
  color: ${props => props.$colorScheme.colors.accent};
  padding: 0.75rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: ${props => props.$colorScheme.colors.accent};
    background: linear-gradient(135deg, 
      ${props => props.$colorScheme.colors.accent}20,
      ${props => props.$colorScheme.colors.accent}10
    );
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const WalletButton = styled.button<{ $colorScheme: any }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.$colorScheme.colors.accent};
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:hover {
    background: ${props => props.$colorScheme.colors.accent}dd;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px ${props => props.$colorScheme.colors.accent}40;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
`

const MenuButton = styled.button<{ $colorScheme: any }>`
  display: none;
  background: ${props => props.$colorScheme.colors.surface}80;
  border: 2px solid ${props => props.$colorScheme.colors.accent}50;
  color: ${props => props.$colorScheme.colors.accent};
  padding: 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    border-color: ${props => props.$colorScheme.colors.accent};
    background: ${props => props.$colorScheme.colors.accent}20;
    transform: scale(1.05);
  }
  
  svg {
    font-size: 1.2rem;
  }
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
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
