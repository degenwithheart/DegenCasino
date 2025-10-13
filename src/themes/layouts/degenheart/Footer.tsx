import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useColorScheme } from '../../ColorSchemeContext';
import { useChatNotifications } from '../../../contexts/ChatNotificationContext';
import { useDegenGamesModal } from './DegenHeartLayout';
import { useDegenHeaderModal } from './DegenHeartLayout';
import { FOOTER_LINKS } from '../../../constants';
import { FaTwitter, FaDiscord, FaTelegram, FaGithub, FaHeart, FaBars, FaTimes, FaChartLine, FaComments, FaCoins, FaGamepad, FaGift } from 'react-icons/fa';
import { media, spacing, components } from './breakpoints';
import { ConnectionStatus } from './components';

const FooterContainer = styled.footer<{ $colorScheme: any; }>`
  width: 100%;
  height: 65px;
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.surface}98,
    ${props => props.$colorScheme.colors.background}90
  );
  backdrop-filter: blur(20px);
  border-top: 3px solid ${props => props.$colorScheme.colors.accent}40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* Consistent even padding for desktop */
  padding: 0 2rem;
  position: relative;
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
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
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 0%, ${props => props.$colorScheme.colors.accent}08 0%, transparent 70%);
    pointer-events: none;
  }
  
  /* Hide desktop footer below desktop breakpoint */
  ${media.maxTabletLg} {
    display: none;
  }
  
  /* Desktop: Show desktop footer */
  ${media.tabletLg} {
    display: flex;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  /* Mobile layout adjustments */
  ${media.maxMobileLg} {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const CopyrightText = styled.div<{ $colorScheme: any; }>`
  font-size: 0.8rem;
  color: ${props => props.$colorScheme.colors.text}70;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  /* Mobile layout adjustments */
  ${media.maxMobileLg} {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const HeartIcon = styled(FaHeart) <{ $colorScheme: any; }>`
  color: ${props => props.$colorScheme.colors.accent};
  font-size: 0.8rem;
`;

const FooterLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  /* Mobile layout adjustments */
  ${media.maxMobileLg} {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
`;

const FooterLink = styled.a<{ $colorScheme: any; }>`
  color: ${props => props.$colorScheme.colors.text}80;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 4px;
  
  &:hover {
    color: ${props => props.$colorScheme.colors.accent};
    background: ${props => props.$colorScheme.colors.accent}10;
    transform: translateY(-1px);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  /* Mobile layout adjustments */
  ${media.maxMobileLg} {
    justify-content: center;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SocialLink = styled.a<{ $colorScheme: any; }>`
  color: ${props => props.$colorScheme.colors.text}70;
  font-size: 1.3rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.6rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, ${props => props.$colorScheme.colors.accent}20 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    color: ${props => props.$colorScheme.colors.accent};
    background: ${props => props.$colorScheme.colors.accent}15;
    transform: translateY(-3px) scale(1.15);
    box-shadow: 0 5px 15px ${props => props.$colorScheme.colors.accent}30;
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.05);
  }
`;

const StatusDot = styled.div<{ $colorScheme: any; }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: #22c55e;
    opacity: 0.3;
    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  
  @keyframes ping {
    75%, 100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
`;

const StatusText = styled.span<{ $colorScheme: any; }>`
  font-size: 0.8rem;
  color: ${props => props.$colorScheme.colors.text}70;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MobileFooter = styled.nav<{ $colorScheme: any; }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65px;
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.surface}98,
    ${props => props.$colorScheme.colors.background}95
  );
  backdrop-filter: blur(20px);
  border-top: 3px solid ${props => props.$colorScheme.colors.accent}40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* Mobile-first: Consistent even padding - 0.75rem matches header */
  padding: 0 0.75rem;
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
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
  }
  
  /* Show mobile footer below desktop breakpoint */
  display: flex;
  
  /* Hide mobile footer on desktop */
  ${media.tabletLg} {
    display: none;
  }
  
  /* These styles are now applied to the MobileNavLinks children */
`;

const SidebarToggleButton = styled.button<{ $colorScheme: any; }>`
  background: ${props => props.$colorScheme.colors.surface}80;
  border: 2px solid ${props => props.$colorScheme.colors.accent}50;
  color: ${props => props.$colorScheme.colors.accent};
  padding: 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* Prevent button from shrinking */
  
  &:hover {
    border-color: ${props => props.$colorScheme.colors.accent};
    background: ${props => props.$colorScheme.colors.accent}20;
    transform: scale(1.05);
  }

  svg {
    font-size: 1.2rem;
  }

  ${media.tabletLg} {
    display: none; /* Hide on tablet-large and up (>=1024px) */
  }
`;

const UnreadBadge = styled.div<{ $colorScheme: any; }>`
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: ${p => p.$colorScheme.colors.accent};
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
`;

const MobileNavPill = styled.div<{ $colorScheme: any; }>`
  flex: 1;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 0 1rem;
  
  /* Notch cutout for center button */
  &::before {
    content: '';
    position: absolute;
    top: -7px;
    left: 50%;
    transform: translateX(-50%);
    width: 90px;
    height: 90px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 50%;
    z-index: -1;
  }
  
  border-radius: 45px;
  position: relative;
  
  transition: all 0.3s ease;
`;

const MobileNavItem = styled.button<{
  $colorScheme: any;
  $active: boolean;
  $disabled?: boolean;
  $isCenter?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  
  width: ${props => props.$isCenter ? '75px' : '50px'};
  height: ${props => props.$isCenter ? '75px' : '50px'};
  padding: 0;
  flex-shrink: 0;
  position: ${props => props.$isCenter ? 'relative' : 'static'};
  z-index: ${props => props.$isCenter ? '10' : '1'};
  
  background: ${props => {
    if (props.$disabled) return 'rgba(255,255,255,0.1)';
    if (props.$isCenter) return '#d4a574';
    return 'rgba(255,255,255,0.2)';
  }};
  
  color: ${props => {
    if (props.$disabled) return 'rgba(255,255,255,0.4)';
    return '#ffffff';
  }};
  
  border: none;
  border-radius: 50%;
  
  box-shadow: ${props => {
    if (props.$disabled) return 'none';
    if (props.$isCenter) return '0 4px 12px rgba(212, 165, 116, 0.4)';
    return '0 2px 8px rgba(0,0,0,0.2)';
  }};
  
  font-size: 1rem;
  font-weight: 500;
  
  transform: ${props => props.$isCenter ? 'translateY(-8px)' : 'none'};
  
  backdrop-filter: blur(10px);
  
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;
  
  /* Responsive sizing */
  ${media.tablet} {
    width: 56px;
    height: 56px;
    border-radius: 16px;
  }
  
  /* Smooth scaling on press */
  &:active:not(:disabled) {
    transform: scale(0.88);
  }
  
  /* Hover effects for desktop */
  ${media.mouse} {
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }
  }
  
  ${media.reduceMotion} {
    transition: none;
    
    &:active {
      transform: none;
    }
  }
`;

const MobileNavIcon = styled.div<{ $size?: 'sm' | 'base' | 'lg'; }>`
  font-size: ${props => {
    switch (props.$size) {
      case 'sm': return '16px';
      case 'lg': return '24px';
      default: return '20px';
    }
  }};
  
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  /* Add subtle glow effect on active */
  filter: ${props => props.$size === 'lg' ? 'drop-shadow(0 0 8px currentColor)' : 'none'};
`;

const Footer: React.FC = () => {
  const { currentColorScheme } = useColorScheme();
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();
  const { toggleLeftSidebar, toggleRightSidebar, leftSidebarOpen, rightSidebarOpen } = useDegenGamesModal();
  const { unreadCount, resetUnread } = useChatNotifications();
  const { openBonusModal, openJackpotModal } = useDegenHeaderModal();

  const socialIcons = {
    Twitter: FaTwitter,
    Discord: FaDiscord,
    Telegram: FaTelegram,
    GitHub: FaGithub
  };

  const handleLinkClick = (href: string, label: string) => {
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      // Handle internal navigation
      navigate(href);
    }
  };

  return (
    <>
      <FooterContainer $colorScheme={currentColorScheme}>
        <LeftSection>
          <CopyrightText $colorScheme={currentColorScheme}>
            <span>© 2024 DegenHeart.Casino</span>
            <span>Made with</span>
            <HeartIcon $colorScheme={currentColorScheme} />
            <span>on Solana</span>
          </CopyrightText>

          <FooterLinks>
            {FOOTER_LINKS.map((link) => (
              <FooterLink
                key={link.href}
                $colorScheme={currentColorScheme}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href, link.title);
                }}
                title={link.title}
              >
                {link.title}
              </FooterLink>
            ))}
          </FooterLinks>
        </LeftSection>

        <RightSection>
          <ConnectionStatus />

          <SocialLinks>
            <SocialLink
              $colorScheme={currentColorScheme}
              href="https://x.com/DegenWithHeart"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow us on X"
            >
              <FaTwitter />
            </SocialLink>

            <SocialLink
              $colorScheme={currentColorScheme}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              title="Join our Discord"
            >
              <FaDiscord />
            </SocialLink>

            <SocialLink
              $colorScheme={currentColorScheme}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              title="Join our Telegram"
            >
              <FaTelegram />
            </SocialLink>

            <SocialLink
              $colorScheme={currentColorScheme}
              href="https://github.com/degenwithheart"
              target="_blank"
              rel="noopener noreferrer"
              title="View our GitHub"
            >
              <FaGithub />
            </SocialLink>
          </SocialLinks>
        </RightSection>
      </FooterContainer>

      {/* Mobile Footer - shows different links based on wallet connection state */}
      <MobileFooter $colorScheme={currentColorScheme}>
        {/* Left Sidebar Toggle Button */}
        <SidebarToggleButton
          $colorScheme={currentColorScheme}
          onClick={toggleLeftSidebar}
          title="Toggle Navigation Menu"
        >
          {leftSidebarOpen ? <FaTimes /> : <FaBars />}
        </SidebarToggleButton>

        {/* Pill-style Navigation */}
        <MobileNavPill $colorScheme={currentColorScheme}>
          {/* Jackpot Button */}
          <MobileNavItem
            $colorScheme={currentColorScheme}
            $active={false}
            onClick={() => openJackpotModal()}
            aria-label="Jackpot"
          >
            <MobileNavIcon>
              <FaCoins />
            </MobileNavIcon>
          </MobileNavItem>

          {/* Games Button - Center */}
          <MobileNavItem
            $colorScheme={currentColorScheme}
            $active={false} // Games modal doesn't have a direct route
            $isCenter={true}
            onClick={() => window.dispatchEvent(new CustomEvent('openGamesModal'))}
            aria-label="Games"
          >
            <MobileNavIcon $size="lg">
              <FaGamepad />
            </MobileNavIcon>
          </MobileNavItem>

          {/* Bonus Button */}
          <MobileNavItem
            $colorScheme={currentColorScheme}
            $active={false}
            onClick={() => openBonusModal()}
            aria-label="Bonus"
          >
            <MobileNavIcon>
              <FaGift />
            </MobileNavIcon>
          </MobileNavItem>
        </MobileNavPill>

        {/* Right Sidebar Toggle Button */}
        <SidebarToggleButton
          $colorScheme={currentColorScheme}
          onClick={() => {
            // When opening the chat sidebar, reset unread count
            if (!rightSidebarOpen) {
              resetUnread();
            }
            toggleRightSidebar();
          }}
          title={unreadCount > 0 ? `Chat (${unreadCount} unread)` : 'Toggle Chat Panel'}
          aria-label={unreadCount > 0 ? `Chat ${unreadCount} unread` : 'Toggle Chat Panel'}
        >
          {rightSidebarOpen ? <FaTimes /> : <FaComments />}
          {unreadCount > 0 && !rightSidebarOpen && (
            <UnreadBadge $colorScheme={currentColorScheme}>{unreadCount > 99 ? '99+' : unreadCount}</UnreadBadge>
          )}
        </SidebarToggleButton>
      </MobileFooter>
    </>
  );
};

export default Footer;
