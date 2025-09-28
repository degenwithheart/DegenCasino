import React, { useState, createContext, useContext, useEffect } from 'react'
import styled from 'styled-components'
import { useColorScheme } from '../../ColorSchemeContext'
import Header from './Header'
// Footer removed - mobile theme uses bottom navigation instead
import MainContent from './MainContent'
import BottomNavigation from './BottomNavigation'
import { Modal } from './components/Modal'
import { ShareModal } from './components/ShareModal'
import AllGamesContentModal from './components/AllGamesContentModal'
import { ConnectionStatusContent } from './components/ConnectionStatusContent'
import { BonusContent, JackpotContent, ColorSchemeSelector } from '../../../components'
import { LeaderboardsContent } from '../../../sections/LeaderBoard/LeaderboardsModal'
import TokenSelect from '../../../sections/TokenSelect'
import MoreModal from './MoreModal'
import { PLATFORM_CREATOR_ADDRESS } from '../../../constants'
import { media, gridBreakpoints, spacing, components } from './breakpoints'

// Mobile-specific context for bottom navigation and modals
const DegenMobileContext = createContext<{ 
  openGamesModal: () => void;
  activeBottomTab: string;
  setActiveBottomTab: (tab: string) => void;
  showBottomNav: boolean;
  setShowBottomNav: (show: boolean) => void;
}>({ 
  openGamesModal: () => {},
  activeBottomTab: 'home',
  setActiveBottomTab: () => {},
  showBottomNav: true,
  setShowBottomNav: () => {}
})

// Context for mobile modal system (slide-up modals)
const DegenMobileModalContext = createContext<{
  openBonusModal: () => void;
  openJackpotModal: () => void;
  openLeaderboardModal: () => void;
  openThemeSelector: () => void;
  openTokenSelect: () => void;
  openConnectionStatus: () => void;
  openShareModal: (game: any) => void;
  openMoreModal: () => void;
}>({
  openBonusModal: () => {},
  openJackpotModal: () => {},
  openLeaderboardModal: () => {},
  openThemeSelector: () => {},
  openTokenSelect: () => {},
  openConnectionStatus: () => {},
  openShareModal: () => {},
  openMoreModal: () => {}
})

export const useDegenMobile = () => useContext(DegenMobileContext)
export const useDegenMobileModal = () => useContext(DegenMobileModalContext)

const LayoutContainer = styled.div<{ $colorScheme: any; $showBottomNav: boolean }>`
  display: grid;
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height for mobile */
  width: 100%;
  background: ${props => props.$colorScheme.colors.background};
  
  /* Mobile-first: Single column with bottom navigation */
  grid-template-areas: ${gridBreakpoints.mobile.areas};
  grid-template-rows: ${gridBreakpoints.mobile.rows};
  grid-template-columns: ${gridBreakpoints.mobile.columns};
  
  /* Large mobile: Slightly adjusted proportions */
  ${media.mobileLg} {
    grid-template-areas: ${gridBreakpoints.mobileLg.areas};
    grid-template-rows: ${gridBreakpoints.mobileLg.rows};
    grid-template-columns: ${gridBreakpoints.mobileLg.columns};
  }
  
  /* Tablet fallback: Maintain mobile layout */
  ${media.tablet} {
    grid-template-areas: ${gridBreakpoints.tablet.areas};
    grid-template-rows: ${gridBreakpoints.tablet.rows};
    grid-template-columns: ${gridBreakpoints.tablet.columns};
  }
  
  /* Hide bottom nav when not needed */
  ${props => !props.$showBottomNav && `
    grid-template-areas: "header" "main";
    grid-template-rows: ${components.header.height} 1fr;
  `}
  
  /* Safe area padding for notched devices */
  ${media.safeArea} {
    padding-top: ${spacing.safeArea.top};
    padding-left: ${spacing.safeArea.left};
    padding-right: ${spacing.safeArea.right};
  }
`

const GridHeader = styled.header`
  grid-area: header;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${components.header.height};
  z-index: ${components.header.zIndex};
  
  /* Safe area support */
  ${media.safeArea} {
    padding-top: ${spacing.safeArea.top};
    height: calc(${components.header.height} + ${spacing.safeArea.top});
  }
  
  ${media.mobileLg} {
    height: ${components.header.heightLg};
    
    ${media.safeArea} {
      height: calc(${components.header.heightLg} + ${spacing.safeArea.top});
    }
  }
`

const GridMain = styled.main`
  grid-area: main;
  overflow: auto;
  
  /* Account for fixed header and bottom nav */
  padding-top: ${components.header.height};
  padding-bottom: ${components.bottomNav.height};
  
  /* Enhanced mobile scrolling */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  
  ${media.mobileLg} {
    padding-top: ${components.header.heightLg};
  }
  
  /* Safe area padding */
  ${media.safeArea} {
    padding-bottom: calc(${components.bottomNav.height} + ${spacing.safeArea.bottom});
  }
`

const GridBottomNav = styled.nav<{ $show: boolean }>`
  grid-area: bottomnav;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: ${components.bottomNav.height};
  z-index: ${components.bottomNav.zIndex};
  
  transform: translateY(${props => props.$show ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  
  /* Safe area support */
  ${media.safeArea} {
    padding-bottom: ${spacing.safeArea.bottom};
    height: calc(${components.bottomNav.height} + ${spacing.safeArea.bottom});
  }
`

// GridFooter removed - mobile theme uses bottom navigation instead

interface DegenMobileLayoutProps {
  children: React.ReactNode;
}

const DegenMobileLayout: React.FC<DegenMobileLayoutProps> = ({ children }) => {
  const { currentColorScheme } = useColorScheme()
  
  // Mobile-specific state
  const [activeBottomTab, setActiveBottomTab] = useState('home')
  const [showBottomNav, setShowBottomNav] = useState(true)
  
  // Modal state
  const [bonusModalOpen, setBonusModalOpen] = useState(false)
  const [jackpotModalOpen, setJackpotModalOpen] = useState(false)
  const [leaderboardModalOpen, setLeaderboardModalOpen] = useState(false)
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false)
  const [tokenSelectOpen, setTokenSelectOpen] = useState(false)
  const [connectionStatusOpen, setConnectionStatusOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareGame, setShareGame] = useState<any>(null)
  const [gamesModalOpen, setGamesModalOpen] = useState(false)
  const [moreModalOpen, setMoreModalOpen] = useState(false)
  
  // Keep bottom nav always visible for mobile-first experience
  useEffect(() => {
    setShowBottomNav(true)
  }, [])
  
  // Mobile context values
  const mobileContextValue = {
    openGamesModal: () => setGamesModalOpen(true),
    activeBottomTab,
    setActiveBottomTab,
    showBottomNav,
    setShowBottomNav
  }
  
  const modalContextValue = {
    openBonusModal: () => setBonusModalOpen(true),
    openJackpotModal: () => setJackpotModalOpen(true),
    openLeaderboardModal: () => setLeaderboardModalOpen(true),
    openThemeSelector: () => setThemeSelectorOpen(true),
    openTokenSelect: () => setTokenSelectOpen(true),
    openConnectionStatus: () => setConnectionStatusOpen(true),
    openShareModal: (game: any) => {
      setShareGame(game)
      setShareModalOpen(true)
    },
    openMoreModal: () => setMoreModalOpen(true)
  }
  
  return (
    <DegenMobileContext.Provider value={mobileContextValue}>
      <DegenMobileModalContext.Provider value={modalContextValue}>
        <LayoutContainer $colorScheme={currentColorScheme} $showBottomNav={showBottomNav}>
          <GridHeader>
            <Header />
          </GridHeader>
          
          <GridMain>
            <MainContent>{children}</MainContent>
          </GridMain>
          
          <GridBottomNav $show={showBottomNav}>
            <BottomNavigation />
          </GridBottomNav>
        </LayoutContainer>
        
        {/* Mobile-optimized slide-up modals */}
        <Modal 
          isOpen={gamesModalOpen} 
          onClose={() => setGamesModalOpen(false)}
          title="All Games"
        >
          <AllGamesContentModal />
        </Modal>
        
        <Modal 
          isOpen={bonusModalOpen} 
          onClose={() => setBonusModalOpen(false)}
          title="Bonus"
        >
          <BonusContent />
        </Modal>
        
        <Modal 
          isOpen={jackpotModalOpen} 
          onClose={() => setJackpotModalOpen(false)}
          title="Jackpot"
        >
          <JackpotContent />
        </Modal>
        
        <Modal 
          isOpen={leaderboardModalOpen} 
          onClose={() => setLeaderboardModalOpen(false)}
          title="Leaderboard"
        >
          <LeaderboardsContent creator={PLATFORM_CREATOR_ADDRESS.toString()} />
        </Modal>
        
        <Modal 
          isOpen={themeSelectorOpen} 
          onClose={() => setThemeSelectorOpen(false)}
          title="Theme"
        >
          <ColorSchemeSelector />
        </Modal>
        
        <Modal 
          isOpen={tokenSelectOpen} 
          onClose={() => setTokenSelectOpen(false)}
          title="Select Token"
        >
          <TokenSelect />
        </Modal>
        
        <Modal 
          isOpen={connectionStatusOpen} 
          onClose={() => setConnectionStatusOpen(false)}
          title="Connection"
        >
          <ConnectionStatusContent />
        </Modal>
        
        {shareModalOpen && shareGame && (
          <ShareModal 
            game={shareGame}
            onClose={() => {
              setShareModalOpen(false)
              setShareGame(null)
            }}
          />
        )}
        
        {/* More menu modal with additional options */}
        <Modal 
          isOpen={moreModalOpen} 
          onClose={() => setMoreModalOpen(false)}
          title="More"
        >
          <MoreModal onClose={() => setMoreModalOpen(false)} />
        </Modal>
      </DegenMobileModalContext.Provider>
    </DegenMobileContext.Provider>
  )
}

export default DegenMobileLayout