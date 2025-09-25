import React, { useMemo, useContext } from 'react'
import styled from 'styled-components'
import { useLocation, Link } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useCurrentPool, TokenValue } from 'gamba-react-ui-v2'
import { useColorScheme } from '../../ColorSchemeContext'
import { SIDEBAR_LINKS } from '../../../constants'
import { ALL_GAMES } from '../../../games/allGames'
import { useDegenGamesModal } from './DegenHeartLayout'

const SidebarContainer = styled.aside<{ $colorScheme: any }>`
  background: linear-gradient(180deg, 
    ${props => props.$colorScheme.colors.surface}F8,
    ${props => props.$colorScheme.colors.background}F0
  );
  backdrop-filter: blur(20px);
  border-right: 3px solid ${props => props.$colorScheme.colors.accent}30;
  padding: 2rem 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  
  /* Enhanced scrolling for all devices */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: ${props => props.$colorScheme.colors.accent}60 transparent;
  
  /* Custom scrollbar for webkit browsers */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.$colorScheme.colors.accent}60;
    border-radius: 3px;
    
    &:hover {
      background: ${props => props.$colorScheme.colors.accent}80;
    }
  }
  
  /* Mobile/tablet drag scrolling optimization */
  @media (max-width: 1023px) {
    overscroll-behavior: contain;
    scroll-behavior: smooth;
    
    /* Hide scrollbar on mobile for cleaner look */
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, 
      transparent,
      ${props => props.$colorScheme.colors.accent}60,
      ${props => props.$colorScheme.colors.accent}80,
      ${props => props.$colorScheme.colors.accent}60,
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
    background: radial-gradient(circle at 100% 50%, ${props => props.$colorScheme.colors.accent}06 0%, transparent 70%);
    pointer-events: none;
  }
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.$colorScheme.colors.background}40;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, 
      ${props => props.$colorScheme.colors.accent}60,
      ${props => props.$colorScheme.colors.accent}40
    );
    border-radius: 4px;
    border: 2px solid ${props => props.$colorScheme.colors.background}20;
    
    &:hover {
      background: linear-gradient(180deg, 
        ${props => props.$colorScheme.colors.accent}80,
        ${props => props.$colorScheme.colors.accent}60
      );
    }
  }
`

const SectionTitle = styled.h3<{ $colorScheme: any }>`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${props => props.$colorScheme.colors.text}60;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 1rem 0;
  padding: 0 1rem;
  border-bottom: 1px solid ${props => props.$colorScheme.colors.border}30;
  padding-bottom: 0.5rem;
`

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const NavItem = styled.li<{ $colorScheme: any; $active: boolean }>`
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  background: ${props => props.$active ? `${props.$colorScheme.colors.accent}15` : 'transparent'};
  border: 2px solid ${props => props.$active ? `${props.$colorScheme.colors.accent}40` : 'transparent'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: linear-gradient(180deg, 
      ${props => props.$colorScheme.colors.accent},
      ${props => props.$colorScheme.colors.accent}cc
    );
    transform: scaleY(${props => props.$active ? 1 : 0});
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 0 3px 3px 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 0% 50%, ${props => props.$colorScheme.colors.accent}08 0%, transparent 70%);
    opacity: ${props => props.$active ? 1 : 0};
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    transform: scaleY(1);
  }
  
  &:hover {
    background: ${props => props.$colorScheme.colors.accent}15;
    border-color: ${props => props.$colorScheme.colors.accent}30;
    transform: translateX(8px);
    box-shadow: 0 4px 15px ${props => props.$colorScheme.colors.accent}20;
    
    &::after {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateX(4px) scale(0.98);
  }
`

const NavLinkStyled = styled(Link)<{ $colorScheme: any; $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: none;
  border: none;
  color: ${props => props.$active ? props.$colorScheme.colors.accent : props.$colorScheme.colors.text};
  font-weight: ${props => props.$active ? 600 : 500};
  cursor: pointer !important;
  transition: all 0.3s ease;
  text-align: left;
  text-decoration: none;
  border-radius: 12px;
  position: relative;
  z-index: 10;
  
  &:hover {
    color: ${props => props.$colorScheme.colors.accent};
  }
  
  &:visited {
    color: ${props => props.$active ? props.$colorScheme.colors.accent : props.$colorScheme.colors.text};
  }
  
  &:focus {
    outline: 2px solid ${props => props.$colorScheme.colors.accent}50;
    outline-offset: 2px;
  }
`

const NavLinkExternal = styled.a<{ $colorScheme: any; $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: none;
  border: none;
  color: ${props => props.$active ? props.$colorScheme.colors.accent : props.$colorScheme.colors.text};
  font-weight: ${props => props.$active ? 600 : 500};
  cursor: pointer !important;
  transition: all 0.3s ease;
  text-align: left;
  text-decoration: none;
  border-radius: 12px;
  position: relative;
  z-index: 10;
  
  &:hover {
    color: ${props => props.$colorScheme.colors.accent};
  }
  
  &:visited {
    color: ${props => props.$active ? props.$colorScheme.colors.accent : props.$colorScheme.colors.text};
  }
  
  &:focus {
    outline: 2px solid ${props => props.$colorScheme.colors.accent}50;
    outline-offset: 2px;
  }
`

const NavButton = styled.button<{ $colorScheme: any; $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: none;
  border: none;
  color: ${props => props.$active ? props.$colorScheme.colors.accent : props.$colorScheme.colors.text};
  font-weight: ${props => props.$active ? 600 : 500};
  cursor: pointer !important;
  transition: all 0.3s ease;
  text-align: left;
  border-radius: 12px;
  position: relative;
  z-index: 10;
  
  &:hover {
    color: ${props => props.$colorScheme.colors.accent};
  }
  
  &:focus {
    outline: 2px solid ${props => props.$colorScheme.colors.accent}50;
    outline-offset: 2px;
  }
`

const IconWrapper = styled.div<{ $colorScheme: any; $active: boolean }>`
  font-size: 1.2rem;
  color: ${props => props.$active ? props.$colorScheme.colors.accent : props.$colorScheme.colors.text}80;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`

const LinkText = styled.span<{ $colorScheme: any }>`
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const LinkDescription = styled.span<{ $colorScheme: any }>`
  font-size: 0.7rem;
  color: ${props => props.$colorScheme.colors.text}60;
  margin-top: 0.2rem;
  line-height: 1.2;
  display: block;
`

const QuickStats = styled.div<{ $colorScheme: any }>`
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.accent}15,
    ${props => props.$colorScheme.colors.surface}40
  );
  border-radius: 16px;
  padding: 2rem;
  margin-top: auto;
  border: 2px solid ${props => props.$colorScheme.colors.accent}30;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, ${props => props.$colorScheme.colors.accent}10 0%, transparent 70%);
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent,
      ${props => props.$colorScheme.colors.accent}80,
      transparent
    );
  }
`

const StatItem = styled.div<{ $colorScheme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const StatLabel = styled.span<{ $colorScheme: any }>`
  font-size: 0.8rem;
  color: ${props => props.$colorScheme.colors.text}70;
`

const StatValue = styled.span<{ $colorScheme: any }>`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.$colorScheme.colors.accent};
`

const LeftSidebar: React.FC = () => {
  const { currentColorScheme } = useColorScheme()
  const location = useLocation()
  const { connected, publicKey } = useWallet()
  const pool = useCurrentPool()
  const { openGamesModal } = useDegenGamesModal()

  // Calculate real statistics from available data
  const realStats = useMemo(() => {
    const liveGames = ALL_GAMES.filter(game => game.live === 'up').length
    const totalGames = ALL_GAMES.length
    const downGames = ALL_GAMES.filter(game => game.live === 'down').length
    
    return {
      gamesOnline: liveGames,
      totalGames,
      maintenanceGames: downGames,
      // Pool stats - only show if connected and pool available
      poolBalance: connected && pool ? pool.maxPayout : null,
      jackpotBalance: connected && pool ? pool.jackpotBalance : null
    }
  }, [connected, pool])

  // Filter links based on showWhen conditions
  const visibleLinks = SIDEBAR_LINKS.filter(link => {
    if (link.showWhen) {
      return link.showWhen(connected, publicKey)
    }
    return true
  })

  // Group sidebar links by section if they have one
  const groupedLinks = visibleLinks.reduce((groups, link) => {
    const section = (link as any).section || 'Main'
    if (!groups[section]) {
      groups[section] = []
    }
    groups[section].push(link)
    return groups
  }, {} as Record<string, typeof SIDEBAR_LINKS>)

  return (
    <SidebarContainer $colorScheme={currentColorScheme}>
      {Object.entries(groupedLinks).map(([section, links]) => (
        <div key={section}>
          <SectionTitle $colorScheme={currentColorScheme}>
            {section}
          </SectionTitle>
          
          <NavList>
            {links.map((link) => {
              const linkPath = typeof link.to === 'function' ? link.to(publicKey?.toBase58() || null) : link.to
              const isActive = location.pathname === linkPath
              const IconComponent = link.icon
              
              // Handle external links
              if (link.external) {
                return (
                  <NavItem 
                    key={`${link.label}-${linkPath}`}
                    $colorScheme={currentColorScheme}
                    $active={isActive}
                  >
                    <NavLinkExternal
                      $colorScheme={currentColorScheme}
                      $active={isActive}
                      href={linkPath as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={(link as any).description}
                    >
                      <IconWrapper $colorScheme={currentColorScheme} $active={isActive}>
                        <IconComponent />
                      </IconWrapper>
                      <div>
                        <LinkText $colorScheme={currentColorScheme}>
                          {link.label}
                        </LinkText>
                        {(link as any).description && (
                          <LinkDescription $colorScheme={currentColorScheme}>
                            {(link as any).description}
                          </LinkDescription>
                        )}
                      </div>
                    </NavLinkExternal>
                  </NavItem>
                )
              }
              
              // Handle Games modal button
              if (link.label === 'Games') {
                return (
                  <NavItem 
                    key={`${link.label}-${linkPath}`}
                    $colorScheme={currentColorScheme}
                    $active={isActive}
                  >
                    <NavButton
                      $colorScheme={currentColorScheme}
                      $active={isActive}
                      onClick={() => {
                        openGamesModal()
                      }}
                      title={(link as any).description}
                    >
                      <IconWrapper $colorScheme={currentColorScheme} $active={isActive}>
                        <IconComponent />
                      </IconWrapper>
                      <div>
                        <LinkText $colorScheme={currentColorScheme}>
                          {link.label}
                        </LinkText>
                        {(link as any).description && (
                          <LinkDescription $colorScheme={currentColorScheme}>
                            {(link as any).description}
                          </LinkDescription>
                        )}
                      </div>
                    </NavButton>
                  </NavItem>
                )
              }
              
              // Handle internal navigation links
              return (
                <NavItem 
                  key={`${link.label}-${linkPath}`}
                  $colorScheme={currentColorScheme}
                  $active={isActive}
                >
                  <NavLinkStyled
                    $colorScheme={currentColorScheme}
                    $active={isActive}
                    to={linkPath as string}
                    title={(link as any).description}
                  >
                    <IconWrapper $colorScheme={currentColorScheme} $active={isActive}>
                      <IconComponent />
                    </IconWrapper>
                    <div>
                      <LinkText $colorScheme={currentColorScheme}>
                        {link.label}
                      </LinkText>
                      {(link as any).description && (
                        <LinkDescription $colorScheme={currentColorScheme}>
                          {(link as any).description}
                        </LinkDescription>
                      )}
                    </div>
                  </NavLinkStyled>
                </NavItem>
              )
            })}
          </NavList>
        </div>
      ))}
      
      <QuickStats $colorScheme={currentColorScheme}>
        <SectionTitle $colorScheme={currentColorScheme}>
          Quick Stats
        </SectionTitle>
        
        <StatItem $colorScheme={currentColorScheme}>
          <StatLabel $colorScheme={currentColorScheme}>Games Online</StatLabel>
          <StatValue $colorScheme={currentColorScheme}>{realStats.gamesOnline}</StatValue>
        </StatItem>
        
        <StatItem $colorScheme={currentColorScheme}>
          <StatLabel $colorScheme={currentColorScheme}>Total Games</StatLabel>
          <StatValue $colorScheme={currentColorScheme}>{realStats.totalGames}</StatValue>
        </StatItem>
        
        {connected && realStats.jackpotBalance ? (
          <StatItem $colorScheme={currentColorScheme}>
            <StatLabel $colorScheme={currentColorScheme}>Jackpot Pool</StatLabel>
            <StatValue $colorScheme={currentColorScheme}>
              <TokenValue amount={realStats.jackpotBalance} />
            </StatValue>
          </StatItem>
        ) : (
          <StatItem $colorScheme={currentColorScheme}>
            <StatLabel $colorScheme={currentColorScheme}>Jackpot Pool</StatLabel>
            <StatValue $colorScheme={currentColorScheme}>Connect Wallet</StatValue>
          </StatItem>
        )}
        
        {connected && realStats.poolBalance ? (
          <StatItem $colorScheme={currentColorScheme}>
            <StatLabel $colorScheme={currentColorScheme}>Max Payout</StatLabel>
            <StatValue $colorScheme={currentColorScheme}>
              <TokenValue amount={realStats.poolBalance} />
            </StatValue>
          </StatItem>
        ) : (
          <StatItem $colorScheme={currentColorScheme}>
            <StatLabel $colorScheme={currentColorScheme}>Max Payout</StatLabel>
            <StatValue $colorScheme={currentColorScheme}>Connect Wallet</StatValue>
          </StatItem>
        )}
      </QuickStats>
    </SidebarContainer>
  )
}

export default LeftSidebar
