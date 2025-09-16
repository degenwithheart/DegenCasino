import styled, { keyframes, css } from 'styled-components'

// Animations
export const liveGlow = keyframes`
  0% { 
    box-shadow: 0 0 8px #00ff88;
    text-shadow: 0 0 8px #00ff88;
  }
  100% { 
    box-shadow: 0 0 16px #00ff88, 0 0 32px #00ff4488;
    text-shadow: 0 0 16px #00ff88, 0 0 32px #00ff4488;
  }
`

export const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`

export const StyledFooter = styled.footer<{ $colorScheme?: any }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 72px;
  padding: 0 48px;
  background: ${({ $colorScheme }) => $colorScheme?.colors?.background || 'rgba(24, 24, 24, 0.9)'};
  backdrop-filter: blur(20px);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
  border-top: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 215, 0, 0.2)'};
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: space-between;

  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || '#ddd'};
  z-index: 1000;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'}11 25%,
      ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'}11 75%,
      transparent 100%
    );
    opacity: 0.6;
    z-index: -1;
  }

  @media (max-width: 1024px) {
    padding: 0 24px;
    height: 64px;
  }

  @media (max-width: 768px) {
    padding: 0 16px;
    height: 60px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
    height: 56px;
    flex-direction: column;
    gap: 8px;
  }
`

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    flex-direction: column;
  }
`

export const CenterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    display: none;
  }
`

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`

export const FooterLink = styled.a<{ $active?: boolean; $live?: boolean }>`
  color: ${({ $active, $live }) => 
    $live ? '#00ff88' : 
    $active ? '#ffd700' : '#ddd'
  };
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    color: ${({ $live }) => $live ? '#00ff88' : '#ffd700'};
    background: ${({ $live }) => 
      $live ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 215, 0, 0.1)'
    };
    transform: translateY(-1px);
  }

  ${({ $live }) => $live && css`
    animation: ${liveGlow} 2s ease-in-out infinite alternate;
  `}

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 6px 10px;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
`

export const StatusIndicator = styled.div<{ $connected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: ${({ $connected }) => 
    $connected ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 69, 69, 0.1)'
  };
  border: 1px solid ${({ $connected }) => 
    $connected ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 69, 69, 0.3)'
  };
  border-radius: 6px;
  font-size: 0.8rem;
  color: ${({ $connected }) => $connected ? '#00ff88' : '#ff4545'};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $connected }) => $connected ? '#00ff88' : '#ff4545'};
    ${({ $connected }) => $connected && css`
      animation: ${liveGlow} 2s ease-in-out infinite alternate;
    `}
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 0.75rem;
  }
`

export const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`

export const SocialLink = styled.a`
  color: #ddd;
  font-size: 1.2rem;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 6px;
  }
`

export const CopyrightText = styled.span`
  font-size: 0.75rem;
  color: #999;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    display: none;
  }
`

export const MobileOnlySection = styled.div`
  display: none;
  
  @media (max-width: 480px) {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    justify-content: center;
  }
`

export const GradientBorder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #ffd700, #a259ff, #ffd700);
  background-size: 200% 100%;
  ${css`animation: ${moveGradient} 3s linear infinite;`}
  opacity: 0.7;
`

export const StyledConnectionStatus = styled.div<{ $colorScheme?: any }>`
  display: flex;
  align-items: center;
  margin-right: 24px;
  
  @media (max-width: 768px) {
    margin-right: 16px;
  }
  
  @media (max-width: 480px) {
    margin-right: 12px;
  }
`

export const FooterLinks = styled.ul<{ $colorScheme?: any }>`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 24px;
  
  li {
    margin: 0;
    
    a {
      color: ${({ $colorScheme }) => $colorScheme?.colors?.text || '#ddd'};
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      padding: 8px 12px;
      border-radius: 6px;
      transition: all 0.3s ease;
      
      &:hover {
        color: #ffd700;
        background: rgba(255, 215, 0, 0.1);
      }
    }
  }
  
  @media (max-width: 768px) {
    gap: 16px;
    
    li a {
      font-size: 0.8rem;
      padding: 6px 10px;
    }
  }
  
  @media (max-width: 480px) {
    display: none;
  }
`

export const MobileFooter = styled.div<{ $colorScheme?: any }>`
  display: none;
  
  @media (max-width: 480px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    width: 100%;
    padding: 8px 0;
    flex-wrap: wrap;
  }
`

export const MobileFooterButton = styled.button`
  background: none;
  border: none;
  color: #ffd700;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 0 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 215, 0, 0.1);
    transform: translateY(-1px);
  }
`

export const MobileFooterLink = styled.a`
  color: #ffd700;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 0 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 215, 0, 0.1);
    transform: translateY(-1px);
  }
`
