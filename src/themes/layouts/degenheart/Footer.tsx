import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useColorScheme } from '../../ColorSchemeContext'
import { useDegenGamesModal } from './DegenHeartLayout'
import { FOOTER_LINKS, MOBILE_FOOTER_LINKS_CONNECTED, MOBILE_FOOTER_LINKS_DISCONNECTED } from '../../../constants'
import { FaTwitter, FaDiscord, FaTelegram, FaGithub, FaHeart, FaBars, FaTimes, FaChartLine } from 'react-icons/fa'

const FooterContainer = styled.footer<{ $colorScheme: any }>`
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
  padding: 0 2rem;
  position: relative;
  z-index: 1000;
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
  
  @media (max-width: 768px) {
    display: none; /* Hide desktop footer on mobile to avoid overlap with mobile footer */
  }
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`

const CopyrightText = styled.div<{ $colorScheme: any }>`
  font-size: 0.8rem;
  color: ${props => props.$colorScheme.colors.text}70;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`

const HeartIcon = styled(FaHeart)<{ $colorScheme: any }>`
  color: ${props => props.$colorScheme.colors.accent};
  font-size: 0.8rem;
`

const FooterLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
`

const FooterLink = styled.a<{ $colorScheme: any }>`
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
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const SocialLink = styled.a<{ $colorScheme: any }>`
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
`

const StatusDot = styled.div<{ $colorScheme: any }>`
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
`

const StatusText = styled.span<{ $colorScheme: any }>`
  font-size: 0.8rem;
  color: ${props => props.$colorScheme.colors.text}70;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const MobileFooter = styled.nav<{ $colorScheme: any }>`
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
  justify-content: center;
  gap: 2.5rem;
  padding: 0 1rem;
  z-index: 1000;
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
  
  @media (min-width: 769px) {
    display: none; /* Hide on desktop */
  }
  
  a, button {
    color: ${props => props.$colorScheme.colors.accent};
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
    border-radius: 12px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    background: none;
    border: none;
    cursor: pointer;
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent, ${props => props.$colorScheme.colors.accent}20, transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover {
      background: ${props => props.$colorScheme.colors.accent}20;
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 4px 12px ${props => props.$colorScheme.colors.accent}30;
      
      &::before {
        opacity: 1;
      }
    }
    
    &:active {
      transform: translateY(0) scale(1);
    }
  }
`

const SidebarToggleButton = styled.button<{ $colorScheme: any; $position: 'left' | 'right' }>`
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
  
  /* Position absolute for left/right corners */
  position: absolute;
  ${props => props.$position}: 1rem;
  top: 50%;
  transform: translateY(-50%);

  &:hover {
    border-color: ${props => props.$colorScheme.colors.accent};
    background: ${props => props.$colorScheme.colors.accent}20;
    transform: translateY(-50%) scale(1.05);
  }

  svg {
    font-size: 1.2rem;
  }

  @media (min-width: 769px) {
    display: none; /* Hide on desktop */
  }
`

const Footer: React.FC = () => {
  const { currentColorScheme } = useColorScheme()
  const navigate = useNavigate()
  const { connected, publicKey } = useWallet()
  const { toggleLeftSidebar, toggleRightSidebar, leftSidebarOpen, rightSidebarOpen } = useDegenGamesModal()

  const socialIcons = {
    Twitter: FaTwitter,
    Discord: FaDiscord,
    Telegram: FaTelegram,
    GitHub: FaGithub
  }

  const handleLinkClick = (href: string, label: string) => {
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer')
    } else {
      // Handle internal navigation
      navigate(href)
    }
  }

  const handleMobileLinkClick = (link: any) => {
    // Special handling for Games modal trigger (only available when connected)
    if ('label' in link && link.label === 'Games') {
      window.dispatchEvent(new CustomEvent('openGamesModal'))
      return
    }
    
    // Regular navigation links - handle dynamic href replacement
    const href = typeof link.href === 'string' && link.href.includes('${base58}') 
      ? link.href.replace('${base58}', publicKey?.toBase58() || '') 
      : link.href
      
    if (href) {
      handleLinkClick(href, link.title)
    }
  }

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
                e.preventDefault()
                handleLinkClick(link.href, link.title)
              }}
              title={link.title}
            >
              {link.title}
            </FooterLink>
          ))}
        </FooterLinks>
      </LeftSection>

      <RightSection>
        <StatusText $colorScheme={currentColorScheme}>
          <StatusDot $colorScheme={currentColorScheme} />
          All Systems Operational
        </StatusText>
        
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
        $position="left"
        onClick={toggleLeftSidebar}
        title="Toggle Navigation Menu"
      >
        {leftSidebarOpen ? <FaTimes /> : <FaBars />}
      </SidebarToggleButton>
      
      {/* Center navigation links */}
      {(connected ? MOBILE_FOOTER_LINKS_CONNECTED : MOBILE_FOOTER_LINKS_DISCONNECTED).map((link) => {
        // Special handling for Games modal trigger (only available when connected)
        if ('label' in link && link.label === 'Games') {
          return (
            <button
              key={link.title}
              type="button"
              onClick={() => handleMobileLinkClick(link)}
            >
              {link.title}
            </button>
          )
        }
        
        // Regular navigation links
        const href = typeof link.href === 'string' && link.href.includes('${base58}') 
          ? link.href.replace('${base58}', publicKey?.toBase58() || '') 
          : link.href
          
        return (
          <a
            key={link.title}
            href={href}
            onClick={(e) => {
              e.preventDefault()
              handleMobileLinkClick(link)
            }}
          >
            {link.title}
          </a>
        )
      })}
      
      {/* Right Sidebar Toggle Button */}
      <SidebarToggleButton 
        $colorScheme={currentColorScheme} 
        $position="right"
        onClick={toggleRightSidebar}
        title="Toggle Stats & Info Panel"
      >
        {rightSidebarOpen ? <FaTimes /> : <FaChartLine />}
      </SidebarToggleButton>
    </MobileFooter>
  </>
  )
}

export default Footer
