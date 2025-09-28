import React from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useColorScheme } from '../../ColorSchemeContext'
import { FaHome, FaGamepad, FaSearch, FaUser, FaCog, FaTrophy, FaGift, FaEllipsisH, FaCoins } from 'react-icons/fa'
import { useDegenMobile, useDegenMobileModal } from './DegenMobileLayout'
import { spacing, components, typography, media, animations } from './breakpoints'

const BottomNavContainer = styled.nav<{ $colorScheme: any }>`
  width: 100%;
  height: 100%;
  position: relative;
  
  background: linear-gradient(135deg,
    ${props => props.$colorScheme.colors.surface}e0 0%,
    ${props => props.$colorScheme.colors.background}f5 50%,
    ${props => props.$colorScheme.colors.surface}e8 100%
  );
  backdrop-filter: blur(30px) saturate(180%);
  
  border-top: 1px solid ${props => props.$colorScheme.colors.primary}25;
  border-radius: 28px 28px 0 0;
  
  box-shadow: 
    0 -8px 32px rgba(0,0,0,0.1),
    inset 0 1px 0 rgba(255,255,255,0.1);
  
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: ${spacing.sm} ${spacing.base};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20%;
    right: 20%;
    height: 4px;
    background: linear-gradient(90deg,
      transparent 0%,
      ${props => props.$colorScheme.colors.primary}60 50%,
      transparent 100%
    );
    border-radius: 2px;
    transform: translateY(-2px);
  }
  
  ${media.safeArea} {
    padding-bottom: calc(${spacing.sm} + ${spacing.safeArea.bottom});
  }
`

const NavItem = styled.button<{ 
  $colorScheme: any; 
  $active: boolean; 
  $disabled?: boolean 
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${spacing.xs};
  
  min-width: 56px;
  min-height: 56px;
  padding: ${spacing.sm};
  
  background: ${props => props.$active 
    ? `linear-gradient(135deg, ${props.$colorScheme.colors.primary}25 0%, ${props.$colorScheme.colors.accent}20 100%)`
    : 'transparent'
  };
  
  color: ${props => {
    if (props.$disabled) return `${props.$colorScheme.colors.text}40`;
    if (props.$active) return props.$colorScheme.colors.primary;
    return `${props.$colorScheme.colors.text}80`;
  }};
  
  border: ${props => props.$active 
    ? `1px solid ${props.$colorScheme.colors.primary}30`
    : 'none'
  };
  border-radius: 18px;
  
  box-shadow: ${props => props.$active 
    ? `0 4px 16px ${props.$colorScheme.colors.primary}20, inset 0 1px 0 rgba(255,255,255,0.1)`
    : 'none'
  };
  
  font-size: ${typography.scale.xs};
  font-weight: ${props => props.$active 
    ? typography.weight.bold 
    : typography.weight.medium
  };
  
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all ${animations.duration.normal} ${animations.easing.bounce};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: ${props => props.$colorScheme.colors.primary}15;
    border-radius: 50%;
    transition: all ${animations.duration.normal};
    transform: translate(-50%, -50%);
  }
  
  &:active {
    transform: ${props => props.$disabled ? 'none' : 'scale(0.9)'};
    
    &::before {
      width: 100%;
      height: 100%;
    }
  }
  
  ${media.mouse} {
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: ${props => props.$active 
        ? `0 8px 24px ${props.$colorScheme.colors.primary}30`
        : `0 4px 12px ${props.$colorScheme.colors.primary}15`
      };
    }
  }
  
  ${media.reduceMotion} {
    transition: none;
    
    &:active {
      transform: none;
    }
  }
`

const NavIcon = styled.div<{ $size?: 'sm' | 'base' | 'lg' }>`
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
  transition: all ${animations.duration.fast} ${animations.easing.easeOut};
  
  /* Add subtle glow effect on active */
  filter: ${props => props.$size === 'lg' ? 'drop-shadow(0 0 8px currentColor)' : 'none'};
`

const NavLabel = styled.span`
  font-size: ${typography.scale.xs};
  line-height: 1;
  white-space: nowrap;
  
  /* Hide labels on very small screens */
  @media (max-width: 320px) {
    display: none;
  }
`

const Badge = styled.div<{ $colorScheme: any }>`
  position: absolute;
  top: -4px;
  right: -4px;
  
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(238, 90, 36, 0.4);
  border: 2px solid white;
  
  border-radius: 8px;
  border: 1px solid ${props => props.$colorScheme.colors.background};
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  font-size: 10px;
  font-weight: ${typography.weight.bold};
  line-height: 1;
`

interface BottomNavigationProps {}

const BottomNavigation: React.FC<BottomNavigationProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { connected, publicKey } = useWallet()
  const { currentColorScheme } = useColorScheme()
  
  const { activeBottomTab, setActiveBottomTab, openGamesModal } = useDegenMobile()
  const { 
    openBonusModal, 
    openJackpotModal,
    openLeaderboardModal,
    openMoreModal 
  } = useDegenMobileModal()
  
  const currentPath = location.pathname
  
  // Navigation items configuration
  const navItems = [
    {
      id: 'home',
      icon: FaHome,
      label: 'Home',
      active: currentPath === '/',
      action: () => {
        navigate('/')
        setActiveBottomTab('home')
      }
    },
    {
      id: 'games',
      icon: FaGamepad,
      label: 'Games',
      active: activeBottomTab === 'games',
      action: () => {
        openGamesModal()
        setActiveBottomTab('games')
      }
    },
    {
      id: 'jackpot',
      icon: FaCoins,
      label: 'Jackpot',
      active: currentPath === '/jackpot',
      action: () => {
        navigate('/jackpot')
        setActiveBottomTab('jackpot')
      }
    },
    {
      id: 'profile',
      icon: FaUser,
      label: 'Profile',
      active: currentPath.includes('/profile'),
      disabled: !connected,
      action: () => {
        if (connected && publicKey) {
          navigate(`/${publicKey.toString()}/profile`)
          setActiveBottomTab('profile')
        }
      }
    },
    {
      id: 'more',
      icon: FaEllipsisH,
      label: 'More',
      active: activeBottomTab === 'more',
      action: () => {
        openMoreModal()
        setActiveBottomTab('more')
      }
    }
  ]
  
  return (
    <BottomNavContainer $colorScheme={currentColorScheme}>
      {navItems.map((item) => {
        const IconComponent = item.icon
        
        return (
          <NavItem
            key={item.id}
            $colorScheme={currentColorScheme}
            $active={item.active}
            $disabled={item.disabled}
            onClick={item.action}
            disabled={item.disabled}
            aria-label={item.label}
          >
            <div style={{ position: 'relative' }}>
              <NavIcon>
                <IconComponent />
              </NavIcon>
              
              {/* Show badge for certain items */}
              {item.id === 'bonus' && (
                <Badge $colorScheme={currentColorScheme}>!</Badge>
              )}
            </div>
            
            <NavLabel>{item.label}</NavLabel>
          </NavItem>
        )
      })}
    </BottomNavContainer>
  )
}

export default BottomNavigation