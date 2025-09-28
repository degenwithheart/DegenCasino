import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useColorScheme } from '../../ColorSchemeContext'
import { FaBars, FaUser, FaWifi, FaSignal, FaTimes } from 'react-icons/fa'
import { useDegenMobile, useDegenMobileModal } from './DegenMobileLayout'
import { spacing, components, typography, media, animations } from './breakpoints'

const HeaderContainer = styled.header<{ $colorScheme: any }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${components.header.zIndex};
  
  height: ${components.header.height};
  padding: ${spacing.base} ${spacing.lg};
  
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.background}f0 0%,
    ${props => props.$colorScheme.colors.surface}e0 100%
  );
  backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid ${props => props.$colorScheme.colors.primary}15;
  box-shadow: 0 4px 32px rgba(0,0,0,0.08);
  
  ${media.safeArea} {
    padding-top: calc(${spacing.base} + ${spacing.safeArea.top});
    height: calc(${components.header.height} + ${spacing.safeArea.top});
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      ${props => props.$colorScheme.colors.primary}30 50%, 
      transparent 100%
    );
  }
`

const Logo = styled.div<{ $colorScheme: any }>`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  
  font-size: ${typography.scale.xl};
  font-weight: ${typography.weight.bold};
  
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.primary} 0%,
    ${props => props.$colorScheme.colors.accent} 60%,
    ${props => props.$colorScheme.colors.secondary || props.$colorScheme.colors.primary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  cursor: pointer;
  user-select: none;
  position: relative;
  
  min-height: ${spacing.touchTarget};
  transition: all ${animations.duration.normal} ${animations.easing.bounce};
  
  &::before {
    content: '✨';
    position: absolute;
    left: -28px;
    font-size: 16px;
    animation: sparkle 3s ease-in-out infinite;
  }
  
  &:active {
    transform: scale(0.96);
  }
  
  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.2);
  }
  
  @keyframes sparkle {
    0%, 100% { 
      opacity: 0.7; 
      transform: rotate(0deg) scale(1); 
    }
    50% { 
      opacity: 1; 
      transform: rotate(180deg) scale(1.15); 
    }
  }
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`

const HeaderButton = styled.button<{ $colorScheme: any; $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  
  min-width: 48px;
  min-height: 48px;
  
  background: ${props => props.$variant === 'primary' 
    ? `linear-gradient(135deg, ${props.$colorScheme.colors.primary} 0%, ${props.$colorScheme.colors.accent} 100%)`
    : `${props.$colorScheme.colors.surface}80`
  };
  
  color: ${props => props.$variant === 'primary' 
    ? '#ffffff' 
    : props.$colorScheme.colors.text
  };
  
  border: ${props => props.$variant === 'primary'
    ? 'none'
    : `1px solid ${props.$colorScheme.colors.primary}20`
  };
  
  border-radius: 16px;
  backdrop-filter: blur(12px);
  box-shadow: ${props => props.$variant === 'primary'
    ? `0 4px 16px ${props.$colorScheme.colors.primary}30`
    : '0 2px 8px rgba(0,0,0,0.1)'
  };
  
  font-size: ${typography.scale.lg};
  font-weight: ${typography.weight.medium};
  cursor: pointer;
  transition: all ${animations.duration.normal} ${animations.easing.bounce};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left ${animations.duration.slow};
  }
  
  &:active {
    transform: scale(0.92);
    box-shadow: ${props => props.$variant === 'primary'
      ? `0 2px 8px ${props.$colorScheme.colors.primary}40`
      : '0 1px 4px rgba(0,0,0,0.15)'
    };
  }
  
  &:hover::before {
    left: 100%;
  }
  
  ${media.mouse} {
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props => props.$variant === 'primary'
        ? `0 8px 24px ${props.$colorScheme.colors.primary}40`
        : '0 4px 16px rgba(0,0,0,0.15)'
      };
    }
  }
`

const ConnectionStatus = styled.div<{ $colorScheme: any; $connected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  
  padding: ${spacing.xs} ${spacing.sm};
  background: ${props => props.$connected 
    ? '#10B98140' 
    : '#EF444440'
  };
  
  color: ${props => props.$connected ? '#10B981' : '#EF4444'};
  border: 1px solid ${props => props.$connected ? '#10B98160' : '#EF444460'};
  border-radius: ${components.button.borderRadius};
  
  font-size: ${typography.scale.sm};
  font-weight: ${typography.weight.medium};
  
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.98);
  }
`

const MenuOverlay = styled.div<{ $show: boolean; $colorScheme: any }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  background: ${props => props.$colorScheme.colors.background}F0;
  backdrop-filter: blur(20px);
  
  z-index: ${components.modal.zIndex};
  
  display: flex;
  flex-direction: column;
  padding: ${spacing.mobile.padding};
  
  transform: translateX(${props => props.$show ? '0' : '-100%'});
  transition: transform 0.3s ease-in-out;
`

const MenuHeader = styled.div<{ $colorScheme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.base} 0;
  border-bottom: 1px solid ${props => props.$colorScheme.colors.accent}20;
  margin-bottom: ${spacing.base};
`

const MenuItems = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${spacing.base};
`

const MenuItem = styled.div<{ $colorScheme: any }>`
  display: flex;
  align-items: center;
  gap: ${spacing.base};
  
  padding: ${spacing.base};
  background: ${props => props.$colorScheme.colors.surface}60;
  border: 1px solid ${props => props.$colorScheme.colors.accent}20;
  border-radius: ${components.button.borderRadius};
  
  color: ${props => props.$colorScheme.colors.text};
  font-size: ${typography.scale.base};
  
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.98);
    background: ${props => props.$colorScheme.colors.accent}20;
  }
`

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { connected } = useWallet()
  const { currentColorScheme } = useColorScheme()
  const { openConnectionStatus } = useDegenMobileModal()
  
  const [menuOpen, setMenuOpen] = useState(false)
  
  const handleLogoClick = () => {
    navigate('/')
  }
  
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen)
  }
  
  const handleConnectionClick = () => {
    openConnectionStatus()
  }
  
  return (
    <>
      <HeaderContainer $colorScheme={currentColorScheme}>
        <HeaderButton 
          $colorScheme={currentColorScheme}
          onClick={handleMenuToggle}
          aria-label="Open menu"
        >
          <FaBars />
        </HeaderButton>
        
        <Logo $colorScheme={currentColorScheme} onClick={handleLogoClick}>
          🎰 DegenHeart
        </Logo>
        
        <HeaderActions>
          <ConnectionStatus 
            $colorScheme={currentColorScheme}
            $connected={connected}
            onClick={handleConnectionClick}
          >
            {connected ? <FaSignal /> : <FaWifi />}
            {connected ? 'Connected' : 'Connect'}
          </ConnectionStatus>
        </HeaderActions>
      </HeaderContainer>
      
      {/* Mobile slide-out menu */}
      <MenuOverlay $show={menuOpen} $colorScheme={currentColorScheme}>
        <MenuHeader $colorScheme={currentColorScheme}>
          <Logo $colorScheme={currentColorScheme}>🎰 DegenHeart</Logo>
          <HeaderButton 
            $colorScheme={currentColorScheme}
            onClick={() => setMenuOpen(false)}
          >
            <FaTimes />
          </HeaderButton>
        </MenuHeader>
        
        <MenuItems>
          <MenuItem $colorScheme={currentColorScheme} onClick={() => { navigate('/'); setMenuOpen(false) }}>
            🏠 Home
          </MenuItem>
          <MenuItem $colorScheme={currentColorScheme} onClick={() => { navigate('/profile'); setMenuOpen(false) }}>
            👤 Profile
          </MenuItem>
          <MenuItem $colorScheme={currentColorScheme} onClick={() => { navigate('/explorer'); setMenuOpen(false) }}>
            🔍 Explorer
          </MenuItem>
          <MenuItem $colorScheme={currentColorScheme} onClick={() => { navigate('/token'); setMenuOpen(false) }}>
            💰 $DGHRT
          </MenuItem>
        </MenuItems>
      </MenuOverlay>
    </>
  )
}

export default Header