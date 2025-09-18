import React from 'react'
import styled from 'styled-components'
import { useColorScheme } from '../../ColorSchemeContext'
import { FOOTER_LINKS } from '../../../constants'
import { FaTwitter, FaDiscord, FaTelegram, FaGithub, FaHeart } from 'react-icons/fa'

const FooterContainer = styled.footer<{ $colorScheme: any }>`
  width: 100%;
  height: 60px;
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.surface}95,
    ${props => props.$colorScheme.colors.background}80
  );
  backdrop-filter: blur(10px);
  border-top: 2px solid ${props => props.$colorScheme.colors.accent}30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
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
    flex-direction: column;
    height: auto;
    padding: 1rem;
    gap: 1rem;
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
  color: ${props => props.$colorScheme.colors.text}60;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.$colorScheme.colors.accent};
    background: ${props => props.$colorScheme.colors.accent}10;
    transform: translateY(-2px) scale(1.1);
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

const Footer: React.FC = () => {
  const { currentColorScheme } = useColorScheme()

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
      // Handle internal navigation or other actions
      console.log(`Navigate to ${label}: ${href}`)
    }
  }

  return (
    <FooterContainer $colorScheme={currentColorScheme}>
      <LeftSection>
        <CopyrightText $colorScheme={currentColorScheme}>
          <span>© 2024 Holy Grail Casino</span>
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
            href="https://twitter.com/holygratilcasino"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Twitter"
          >
            <FaTwitter />
          </SocialLink>
          
          <SocialLink
            $colorScheme={currentColorScheme}
            href="https://discord.gg/holygrailcasino"
            target="_blank"
            rel="noopener noreferrer"
            title="Join our Discord"
          >
            <FaDiscord />
          </SocialLink>
          
          <SocialLink
            $colorScheme={currentColorScheme}
            href="https://t.me/holygrailcasino"
            target="_blank"
            rel="noopener noreferrer"
            title="Join our Telegram"
          >
            <FaTelegram />
          </SocialLink>
          
          <SocialLink
            $colorScheme={currentColorScheme}
            href="https://github.com/holygrailcasino"
            target="_blank"
            rel="noopener noreferrer"
            title="View our GitHub"
          >
            <FaGithub />
          </SocialLink>
        </SocialLinks>
      </RightSection>
    </FooterContainer>
  )
}

export default Footer
