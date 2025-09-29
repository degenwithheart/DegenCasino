import React from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useColorScheme } from '../../../themes/ColorSchemeContext'
import { FaHome, FaGamepad, FaSearch, FaUser, FaCog, FaTrophy, FaGift, FaEllipsisH, FaCoins } from 'react-icons/fa'
import { useDegenMobile, useDegenMobileModal } from './DegenMobileLayout'
import GestureHandler from './components/GestureHandler'
import { spacing, components, typography, media, animations } from './breakpoints'

const BottomNavContainer = styled.nav<{ $colorScheme: any }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: ${components.bottomNav.zIndex};
  
  ${media.safeArea} {
    padding-bottom: ${spacing.safeArea.bottom};
  }
`

const NavPill = styled.div<{ $colorScheme: any }>`
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  
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
  
  box-shadow: 
    0 4px 20px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.1);
  
  transition: all ${animations.duration.normal} ${animations.easing.easeOut};
  
  ${media.safeArea} {
    padding-bottom: ${spacing.safeArea.bottom};
  }
`

const NavItem = styled.button<{ 
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
  
  font-size: ${props => props.$isCenter ? typography.scale.lg : typography.scale.base};
  font-weight: ${typography.weight.medium};
  
  transform: ${props => props.$isCenter ? 'translateY(-8px)' : 'none'};
  
  backdrop-filter: blur(10px);
  
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all ${animations.duration.fast} ${animations.easing.easeOut};
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
      box-shadow: ${props => {
        if (props.$active) return `0 6px 16px ${props.$colorScheme.colors.primary}50, 0 4px 8px ${props.$colorScheme.colors.primary}30`;
        return '0 4px 12px rgba(0,0,0,0.12)';
      }};
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
    <GestureHandler
      onSwipeLeft={() => {
        const tabs = ['home', 'jackpot', 'games', 'profile', 'more']
        const currentIndex = tabs.indexOf(activeBottomTab)
        const nextIndex = (currentIndex + 1) % tabs.length
        setActiveBottomTab(tabs[nextIndex])
      }}
      onSwipeRight={() => {
        const tabs = ['home', 'jackpot', 'games', 'profile', 'more']
        const currentIndex = tabs.indexOf(activeBottomTab)
        const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1
        setActiveBottomTab(tabs[prevIndex])
      }}
    >
      <BottomNavContainer $colorScheme={currentColorScheme}>
        <NavPill $colorScheme={currentColorScheme}>
          {navItems.map((item) => {
            const IconComponent = item.icon
            
            return (
              <NavItem
                key={item.id}
                $colorScheme={currentColorScheme}
                $active={item.active}
                $disabled={item.disabled}
                $isCenter={item.id === 'games'}
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
              </NavItem>
            )
          })}
        </NavPill>
      </BottomNavContainer>
    </GestureHandler>
  )
}

export default BottomNavigation