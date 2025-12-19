import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useColorScheme } from '../../../themes/ColorSchemeContext'
import { 
  FaTrophy, 
  FaGift, 
  FaFileContract, 
  FaBook, 
  FaUsers, 
  FaCoins,
  FaCog,
  FaSearch,
  FaChartLine,
  FaInfoCircle,
  FaAward,
  FaRocket,
  FaClipboardList,
  FaNetworkWired,
  FaGamepad
} from 'react-icons/fa'
import { spacing, typography, animations } from './breakpoints'
import { PLATFORM_CREATOR_ADDRESS } from '../../../constants'
import { 
  ModalOverlay, 
  ModalContainer, 
  Header, 
  Title, 
  CloseButton, 
  Content
} from './components/ModalComponents'
import { useDegenMobileModal } from './DegenMobileLayout'

const MoreContainer = styled.div`
  /* Content styling is now handled by unified Content component */
`

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.base};
  margin-bottom: ${spacing.lg};
`

const MenuItem = styled.button<{ $colorScheme: any; $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  
  padding: ${spacing.lg} ${spacing.base};
  min-height: 80px;
  
  background: ${props => props.$disabled 
    ? `${props.$colorScheme.colors.surface}40`
    : `linear-gradient(135deg, ${props.$colorScheme.colors.surface}60 0%, ${props.$colorScheme.colors.background}80 100%)`
  };
  backdrop-filter: blur(10px);
  
  border: 1px solid ${props => props.$disabled 
    ? `${props.$colorScheme.colors.text}20`
    : `${props.$colorScheme.colors.primary}30`
  };
  border-radius: 16px;
  
  color: ${props => props.$disabled 
    ? `${props.$colorScheme.colors.text}50`
    : props.$colorScheme.colors.text
  };
  
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all ${animations.duration.normal} ${animations.easing.easeOut};
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: linear-gradient(135deg, ${props => props.$colorScheme.colors.primary}20 0%, ${props => props.$colorScheme.colors.accent}15 100%);
    border-color: ${props => props.$colorScheme.colors.primary}60;
    box-shadow: 0 8px 24px ${props => props.$colorScheme.colors.primary}20;
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`

const MenuIcon = styled.div<{ $colorScheme: any }>`
  font-size: 24px;
  color: ${props => props.$colorScheme.colors.primary};
  
  display: flex;
  align-items: center;
  justify-content: center;
`

const MenuLabel = styled.span`
  font-size: ${typography.scale.xs};
  font-weight: ${typography.weight.medium};
  line-height: 1.2;
  text-align: center;
`

const Section = styled.div`
  margin-bottom: ${spacing.xl};
`

const SectionTitle = styled.h3<{ $colorScheme: any }>`
  font-size: ${typography.scale.base};
  font-weight: ${typography.weight.semibold};
  color: ${props => props.$colorScheme.colors.text};
  margin: 0 0 ${spacing.base} 0;
  padding-left: ${spacing.sm};
  border-left: 3px solid ${props => props.$colorScheme.colors.primary};
`

interface MoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoreModal: React.FC<MoreModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { connected, publicKey } = useWallet()
  const { currentColorScheme } = useColorScheme()
  const { openSessionWidgetModal } = useDegenMobileModal()
  
  // Check if current wallet is the platform creator
  const isCreator = connected && publicKey && publicKey.equals(PLATFORM_CREATOR_ADDRESS)
  
  const handleNavigate = (path: string) => {
    navigate(path)
    onClose()
  }
  
  // Gaming & Features
  const gamingItems = [
    {
      icon: FaGamepad,
      label: 'Jackpot',
      path: '/jackpot',
      disabled: false
    },
    {
      icon: FaTrophy,
      label: 'Leaderboard',
      path: '/leaderboard',
      disabled: false
    },
    {
      icon: FaGift,
      label: 'Bonus',
      path: '/bonus',
      disabled: false
    },
    {
      icon: FaCoins,
      label: 'Select Token',
      path: '/select-token',
      disabled: false
    },
    {
      icon: FaSearch,
      label: 'Explorer',
      path: '/explorer',
      disabled: false
    }
  ]

  // Token & Investment
  const tokenItems = [
    {
      icon: FaRocket,
      label: 'DGHRT Token',
      path: '/token',
      disabled: false
    },
    {
      icon: FaChartLine,
      label: 'Presale',
      path: '/presale',
      disabled: false
    }
  ]

  // Legal & Compliance
  const legalItems = [
    {
      icon: FaFileContract,
      label: 'Terms',
      path: '/terms',
      disabled: false
    },
    {
      icon: FaAward,
      disabled: false
    }
  ]
  
  // Documentation & Resources
  const docsItems = [
    {
      icon: FaBook,
      label: 'Whitepaper',
      path: '/whitepaper',
      disabled: false
    },
    {
      icon: FaClipboardList,
      label: 'Changelog',
      path: '/changelog',
      disabled: false
    },
    {
      icon: FaNetworkWired,
      label: 'Propagation',
      path: '/propagation',
      disabled: false
    }
  ]

  // About & Support
  const aboutItems = [
    {
      icon: FaInfoCircle,
      label: 'About',
      path: '/aboutus',
      disabled: false
    },
    {
      icon: FaUsers,
      label: 'Credits',
      path: '/credits',
      disabled: false
    },
    // Only show admin for creator wallet
    ...(isCreator ? [{
      icon: FaCog,
      label: 'Admin',
      path: '/admin',
      disabled: false
    }] : [])
  ]
  
  if (!isOpen) return null

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalContainer 
          $variant="moremenu"
          onClick={(e) => e.stopPropagation()}
        >
          <Header $variant="moremenu">
            <Title $variant="moremenu" $icon="⚡">
              More
            </Title>
            <CloseButton $variant="moremenu" onClick={onClose} />
          </Header>
          
          <Content>
            <MoreContainer>
              {/* Gaming & Features Section */}
              <Section>
                <SectionTitle $colorScheme={currentColorScheme}>
                  🎮 Gaming & Features
                </SectionTitle>
                <MenuGrid>
                  {gamingItems.map((item) => {
                    const IconComponent = item.icon
                    
                    return (
                      <MenuItem
                        key={item.path}
                        $colorScheme={currentColorScheme}
                        $disabled={item.disabled}
                        onClick={() => !item.disabled && handleNavigate(item.path)}
                        disabled={item.disabled}
                      >
                        <MenuIcon $colorScheme={currentColorScheme}>
                          <IconComponent />
                        </MenuIcon>
                        <MenuLabel>{item.label}</MenuLabel>
                      </MenuItem>
                    )
                  })}
                </MenuGrid>

                {/* Session quick access */}
                <MenuGrid>
                  <MenuItem
                    key="session"
                    $colorScheme={currentColorScheme}
                    $disabled={false}
                    onClick={() => { openSessionWidgetModal(); onClose(); }}
                  >
                    <MenuIcon $colorScheme={currentColorScheme}>🎲</MenuIcon>
                    <MenuLabel>Session</MenuLabel>
                  </MenuItem>
                </MenuGrid>
              </Section>
              
              {/* Token & Investment Section */}
              <Section>
                <SectionTitle $colorScheme={currentColorScheme}>
                  💰 Token & Investment
                </SectionTitle>
                <MenuGrid>
                  {tokenItems.map((item) => {
                    const IconComponent = item.icon
                    
                    return (
                      <MenuItem
                        key={item.path}
                        $colorScheme={currentColorScheme}
                        $disabled={item.disabled}
                        onClick={() => !item.disabled && handleNavigate(item.path)}
                        disabled={item.disabled}
                      >
                        <MenuIcon $colorScheme={currentColorScheme}>
                          <IconComponent />
                        </MenuIcon>
                        <MenuLabel>{item.label}</MenuLabel>
                      </MenuItem>
                    )
                  })}
                </MenuGrid>
              </Section>

              {/* Legal & Compliance Section */}
              <Section>
                <SectionTitle $colorScheme={currentColorScheme}>
                  ⚖️ Legal & Compliance
                </SectionTitle>
                <MenuGrid>
                  {legalItems.map((item) => {
                    const IconComponent = item.icon

                    return (
                      <MenuItem
                        key={item.path ?? item.label ?? Math.random().toString()}
                        $colorScheme={currentColorScheme}
                        $disabled={item.disabled}
                        onClick={() => {
                          if (!item.disabled && item.path) handleNavigate(item.path)
                        }}
                        disabled={item.disabled}
                      >
                        <MenuIcon $colorScheme={currentColorScheme}>
                          <IconComponent />
                        </MenuIcon>
                        <MenuLabel>{item.label}</MenuLabel>
                      </MenuItem>
                    )
                  })}
                </MenuGrid>
              </Section>

              {/* Documentation & Resources Section */}
              <Section>
                <SectionTitle $colorScheme={currentColorScheme}>
                  📚 Documentation & Resources
                </SectionTitle>
                <MenuGrid>
                  {docsItems.map((item) => {
                    const IconComponent = item.icon
                    
                    return (
                      <MenuItem
                        key={item.path}
                        $colorScheme={currentColorScheme}
                        $disabled={item.disabled}
                        onClick={() => !item.disabled && handleNavigate(item.path)}
                        disabled={item.disabled}
                      >
                        <MenuIcon $colorScheme={currentColorScheme}>
                          <IconComponent />
                        </MenuIcon>
                        <MenuLabel>{item.label}</MenuLabel>
                      </MenuItem>
                    )
                  })}
                </MenuGrid>
              </Section>

              {/* About & Support Section */}
              <Section>
                <SectionTitle $colorScheme={currentColorScheme}>
                  ℹ️ About & Support
                </SectionTitle>
                <MenuGrid>
                  {aboutItems.map((item) => {
                    const IconComponent = item.icon
                    
                    return (
                      <MenuItem
                        key={item.path}
                        $colorScheme={currentColorScheme}
                        $disabled={item.disabled}
                        onClick={() => !item.disabled && handleNavigate(item.path)}
                        disabled={item.disabled}
                      >
                        <MenuIcon $colorScheme={currentColorScheme}>
                          <IconComponent />
                        </MenuIcon>
                        <MenuLabel>{item.label}</MenuLabel>
                      </MenuItem>
                    )
                  })}
                </MenuGrid>
              </Section>
            </MoreContainer>
          </Content>
        </ModalContainer>
      </ModalOverlay>
    </>
  )
}

export default MoreModal