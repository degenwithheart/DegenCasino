import React, { useMemo, useContext } from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useCurrentPool, TokenValue } from 'gamba-react-ui-v2'
import { useColorScheme } from '../../ColorSchemeContext'
import { SIDEBAR_LINKS } from '../../../constants'
import { ALL_GAMES } from '../../../games/allGames'
import { useDegenGamesModal } from './DegenHeartLayout'

const SidebarContainer = styled.aside<{ $colorScheme: any }>`
  background: linear-gradient(180deg, 
    ${props => props.$colorScheme.colors.surface}95,
    ${props => props.$colorScheme.colors.background}80
  );
  backdrop-filter: blur(10px);
  border-right: 2px solid ${props => props.$colorScheme.colors.accent}20;
  padding: 2rem 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.$colorScheme.colors.background};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.$colorScheme.colors.accent}40;
    border-radius: 3px;
    
    &:hover {
      background: ${props => props.$colorScheme.colors.accent}60;
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
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.$colorScheme.colors.accent};
    transform: scaleY(${props => props.$active ? 1 : 0});
    transition: transform 0.3s ease;
  }
  
  &:hover::before {
    transform: scaleY(1);
  }
  
  &:hover {
    background: ${props => props.$colorScheme.colors.accent}10;
  }
`

const NavLink = styled.button<{ $colorScheme: any; $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: none;
  border: none;
  color: ${props => props.$active ? props.$colorScheme.colors.accent : props.$colorScheme.colors.text};
  font-weight: ${props => props.$active ? 600 : 500};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  border-radius: 12px;
  
  &:hover {
    color: ${props => props.$colorScheme.colors.accent};
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
    ${props => props.$colorScheme.colors.accent}10,
    ${props => props.$colorScheme.colors.surface}30
  );
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: auto;
  border: 1px solid ${props => props.$colorScheme.colors.accent}20;
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
  const navigate = useNavigate()
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

  const handleNavClick = (link: any) => {
    if (link.external && link.to) {
      window.open(link.to, '_blank', 'noopener,noreferrer')
    } else if (link.to) {
      // Handle dynamic routes like profile
      if (typeof link.to === 'function') {
        const base58 = publicKey?.toBase58() || null
        navigate(link.to(base58))
      } else {
        navigate(link.to)
      }
    } else if (link.label === 'Games') {
      // Open the games modal
      openGamesModal()
    }
  }

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
              
              return (
                <NavItem 
                  key={`${link.label}-${linkPath}`}
                  $colorScheme={currentColorScheme}
                  $active={isActive}
                >
                  <NavLink
                    $colorScheme={currentColorScheme}
                    $active={isActive}
                    onClick={() => handleNavClick(link)}
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
                  </NavLink>
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
