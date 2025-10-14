import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useColorScheme } from '../../../themes/ColorSchemeContext';
import { FaBars, FaUser, FaWifi, FaSignal, FaTimes, FaTrophy, FaGift, FaGem, FaComments } from 'react-icons/fa';
import { useDegenMobile, useDegenMobileModal } from './DegenMobileLayout';
import { useChatNotifications } from '../../../contexts/ChatNotificationContext';
import { spacing, components, typography, media, animations } from './breakpoints';

const HeaderContainer = styled.header<{ $colorScheme: any; }>`
  /* Shared header sizing vars to keep mobile and desktop headers aligned */
  --dh-header-height: 100px;
  --dh-header-height-tablet: 80px;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${components.header.zIndex};

  height: var(--dh-header-height-tablet);
  padding: ${spacing.sm} ${spacing.base};
  
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  
  box-shadow: 0 2px 20px rgba(0,0,0,0.3);
  
  ${media.safeArea} {
    padding-top: calc(${spacing.sm} + ${spacing.safeArea.top});
    height: calc(var(--dh-header-height-tablet) + ${spacing.safeArea.top});
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.base};
  flex: 1;
`;

const Logo = styled.div<{ $colorScheme: any; }>`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  
  font-size: ${typography.scale.xl};
  font-weight: ${typography.weight.bold};
  color: #ffffff;
  
  cursor: pointer;
  user-select: none;
  
  transition: all ${animations.duration.fast} ease;
  
  &:active {
    transform: scale(0.95);
  }
  
  ${media.mouse} {
    &:hover {
      transform: translateY(-1px);
      filter: brightness(1.1);
    }
  }
`;

const LogoText = styled.span`
  /* Hide text on mobile, show on tablet+ */
  display: none;
  
  ${media.tablet} {
    display: inline;
  }
`;

const MenuLogoText = styled.span`
  /* Always show text in menu regardless of screen size */
  display: inline;
`;

const LogoIcon = styled.img`
  /* Always show the logo image */
  display: inline;
  width: 32px;
  height: 32px;
  object-fit: contain;
`;

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  flex: 1;
`;

const HeaderQuickButton = styled.button<{ $colorScheme: any; }>`
  display: flex;
  align-items: center;
  justify-content: center;
  
  width: 40px;
  height: 40px;
  
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border: none;
  border-radius: 50%;
  backdrop-filter: blur(10px);
  
  font-size: ${typography.scale.base};
  cursor: pointer;
  transition: all ${animations.duration.fast} ease;
  
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  
  &:active {
    transform: scale(0.9);
  }
  
  ${media.mouse} {
    &:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
  }
`;

const MobileNotificationBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #ff4757, #ff3838);
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: bold;
  border: 1px solid rgba(0, 0, 0, 0.8);
  box-shadow: 0 1px 4px rgba(255, 71, 87, 0.4);
  z-index: 10;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.base};
  flex: 1;
  justify-content: flex-end;
`;

const HeaderButton = styled.button<{ $colorScheme: any; $variant?: 'primary' | 'secondary'; }>`
  display: flex;
  align-items: center;
  justify-content: center;
  
  width: 44px;
  height: 44px;
  
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border: none;
  border-radius: 50%;
  backdrop-filter: blur(10px);
  
  font-size: ${typography.scale.base};
  font-weight: ${typography.weight.medium};
  cursor: pointer;
  transition: all ${animations.duration.fast} ease;
  
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  
  &:active {
    transform: scale(0.9);
  }
  
  ${media.mouse} {
    &:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
  }
`;

const ConnectionStatus = styled.div<{ $colorScheme: any; $connected: boolean; }>`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  
  padding: ${spacing.xs} ${spacing.sm};
  background: ${props => props.$connected
    ? 'rgba(16, 185, 129, 0.2)'
    : 'rgba(239, 68, 68, 0.2)'
  };
  
  color: ${props => props.$connected ? '#10B981' : '#EF4444'};
  border: 1px solid ${props => props.$connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  border-radius: 20px;
  backdrop-filter: blur(10px);
  
  font-size: ${typography.scale.sm};
  font-weight: ${typography.weight.medium};
  
  cursor: pointer;
  transition: all ${animations.duration.fast} ease;
  
  &:active {
    transform: scale(0.95);
  }
  
  ${media.mouse} {
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
  }
`;

const MenuOverlay = styled.div<{ $show: boolean; $colorScheme: any; }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  
  z-index: ${components.modal.zIndex};
  
  display: flex;
  flex-direction: column;
  padding: ${spacing.mobile.padding};
  
  transform: translateX(${props => props.$show ? '0' : '-100%'});
  transition: transform 0.3s ease-in-out;
`;

const MenuHeader = styled.div<{ $colorScheme: any; }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.base} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: ${spacing.base};
`;

const MenuItems = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${spacing.base};
`;

const MenuItem = styled.div<{ $colorScheme: any; }>`
  display: flex;
  align-items: center;
  gap: ${spacing.base};
  
  padding: ${spacing.base};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  
  color: #ffffff;
  font-size: ${typography.scale.base};
  
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.98);
    background: rgba(255, 255, 255, 0.15);
  }
`;

interface HeaderProps { }

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { connected } = useWallet();
  const { currentColorScheme } = useColorScheme();
  const { openConnectionStatus, openTrollBoxModal, closeAllOverlays } = useDegenMobileModal();
  const { unreadCount, hasNewMessages } = useChatNotifications();

  const { menuOpen, setMenuOpen } = useDegenMobile();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMenuToggle = () => {
    // If opening menu, ensure other overlays closed first
    if (!menuOpen) {
      closeAllOverlays();
      setMenuOpen(true);
    } else {
      setMenuOpen(false);
    }
  };

  const handleConnectionClick = () => {
    openConnectionStatus();
  };

  const handleNavigation = (route: string) => {
    // close any open overlays/menus when navigating from header/menu
    closeAllOverlays();
    navigate(`/${route}`);
  };

  return (
    <>
      <HeaderContainer $colorScheme={currentColorScheme}>
        <LeftSection>
          <HeaderButton
            $colorScheme={currentColorScheme}
            onClick={handleMenuToggle}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </HeaderButton>

          <Logo $colorScheme={currentColorScheme} onClick={handleLogoClick}>
            <LogoIcon src="/png/images/logo.png" alt="DegenHeart Casino" />
            <LogoText>DegenHeart</LogoText>
          </Logo>
        </LeftSection>

        <CenterSection>
          <HeaderQuickButton
            $colorScheme={currentColorScheme}
            onClick={() => { closeAllOverlays(); navigate('/bonus'); }}
            title="Bonus"
          >
            <FaGift />
          </HeaderQuickButton>

          <HeaderQuickButton
            $colorScheme={currentColorScheme}
            onClick={() => { closeAllOverlays(); navigate('/jackpot'); }}
            title="Jackpot"
          >
            <FaGem />
          </HeaderQuickButton>

          <HeaderQuickButton
            $colorScheme={currentColorScheme}
            onClick={() => { closeAllOverlays(); navigate('/leaderboard'); }}
            title="Leaderboard"
          >
            <FaTrophy />
          </HeaderQuickButton>

          <div style={{ position: 'relative' }}>
            <HeaderQuickButton
              $colorScheme={currentColorScheme}
              onClick={() => (connected ? (closeAllOverlays(), openTrollBoxModal()) : (closeAllOverlays(), navigate('/')))}
              title="Chat"
            >
              <FaComments />
            </HeaderQuickButton>
            {hasNewMessages && (
              <MobileNotificationBadge>
                {unreadCount > 99 ? '99+' : unreadCount}
              </MobileNotificationBadge>
            )}
          </div>
        </CenterSection>

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
          <Logo $colorScheme={currentColorScheme}>
            <LogoIcon src="/png/images/logo.png" alt="DegenHeart Casino" />
            <MenuLogoText>DegenHeart</MenuLogoText>
          </Logo>
          <HeaderButton
            $colorScheme={currentColorScheme}
            onClick={() => setMenuOpen(false)}
          >
            <FaTimes />
          </HeaderButton>
        </MenuHeader>

        <MenuItems>
          <MenuItem $colorScheme={currentColorScheme} onClick={() => { closeAllOverlays(); navigate('/'); }}>
            🏠 Home
          </MenuItem>
          <MenuItem $colorScheme={currentColorScheme} onClick={() => { closeAllOverlays(); navigate('/profile'); }}>
            👤 Profile
          </MenuItem>
          <MenuItem $colorScheme={currentColorScheme} onClick={() => { closeAllOverlays(); navigate('/explorer'); }}>
            🔍 Explorer
          </MenuItem>
          <MenuItem $colorScheme={currentColorScheme} onClick={() => { closeAllOverlays(); navigate('/token'); }}>
            💰 $DGHRT
          </MenuItem>
        </MenuItems>
      </MenuOverlay>

    </>
  );
};

export default Header;