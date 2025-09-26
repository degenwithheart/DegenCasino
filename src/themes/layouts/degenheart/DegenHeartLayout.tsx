import React, { useState, createContext, useContext, useEffect } from 'react'
import styled from 'styled-components'
import { useColorScheme } from '../../ColorSchemeContext'
import Header from './Header'
import Footer from './Footer'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import MainContent from './MainContent'
import { Modal } from './components/Modal'
import AllGamesContentModal from './components/AllGamesContentModal'
import { ConnectionStatusContent } from './components/ConnectionStatusContent'
import { BonusContent, JackpotContent, ColorSchemeSelector } from '../../../components'
import { LeaderboardsContent } from '../../../sections/LeaderBoard/LeaderboardsModal'
import TokenSelect from '../../../sections/TokenSelect'
import { PLATFORM_CREATOR_ADDRESS } from '../../../constants'
import { media, gridBreakpoints } from './breakpoints'

// Create a local games modal context for degen theme
const DegenGamesModalContext = createContext<{ 
  openGamesModal: () => void;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  closeSidebars: () => void;
}>({ 
  openGamesModal: () => {},
  leftSidebarOpen: false,
  rightSidebarOpen: false,
  toggleLeftSidebar: () => {},
  toggleRightSidebar: () => {},
  closeSidebars: () => {}
})

// Create context for Header modals to render within MainContent area
const DegenHeaderModalContext = createContext<{
  openBonusModal: () => void;
  openJackpotModal: () => void;
  openLeaderboardModal: () => void;
  openThemeSelector: () => void;
  openTokenSelect: () => void;
  openConnectionStatus: () => void;
}>({
  openBonusModal: () => {},
  openJackpotModal: () => {},
  openLeaderboardModal: () => {},
  openThemeSelector: () => {},
  openTokenSelect: () => {},
  openConnectionStatus: () => {}
})

export const useDegenGamesModal = () => useContext(DegenGamesModalContext)
export const useDegenHeaderModal = () => useContext(DegenHeaderModalContext)

const LayoutContainer = styled.div<{ $colorScheme: any }>`
  display: grid;
  min-height: 100vh;
  min-height: 100dvh; /* Use dynamic viewport height for mobile */
  width: 100%;
  background: ${props => props.$colorScheme.colors.background};
  
  /* Mobile-first: Single column layout by default */
  grid-template-areas: ${gridBreakpoints.mobile.areas};
  grid-template-rows: ${gridBreakpoints.mobile.rows};
  grid-template-columns: ${gridBreakpoints.mobile.columns};
  
  /* Tablet: Show right sidebar only for better space utilization */
  ${media.tablet} {
    grid-template-areas: ${gridBreakpoints.tablet.areas};
    grid-template-rows: ${gridBreakpoints.tablet.rows};
    grid-template-columns: ${gridBreakpoints.tablet.columns};
  }
  
  /* Desktop: Full three-column layout */
  ${media.tabletLg} {
    grid-template-areas: ${gridBreakpoints.desktop.areas};
    grid-template-rows: ${gridBreakpoints.desktop.rows};
    grid-template-columns: ${gridBreakpoints.desktop.columns};
  }
  
  /* Large desktop: Wider sidebars for better balance */
  ${media.desktop} {
    grid-template-columns: 280px 1fr 280px;
  }
`

const GridHeader = styled.header`
  grid-area: header;
  /* Mobile-first: Relative positioning to avoid viewport issues */
  position: relative;
  height: 80px;
  z-index: 1100;
  
  /* Tablet and up: Fixed positioning for better UX */
  ${media.tablet} {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
`

const GridLeftSidebar = styled.aside<{ $isOpen?: boolean }>`
  grid-area: left;
  /* Mobile-first: Hidden by default, drawer when needed */
  display: none;
  
  /* Mobile drawer functionality - only show as drawer on mobile */
  ${media.maxMobileLg} {
    display: block;
    position: fixed;
    top: 80px;
    left: 0;
    bottom: 65px;
    width: min(320px, 85vw); /* Responsive width with max constraint */
    height: auto;
    z-index: 9998; /* Higher z-index to ensure visibility */
    transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${props => props.$isOpen ? '8px 0 32px rgba(0, 0, 0, 0.5)' : 'none'};
    
    /* Enhanced mobile/tablet touch support */
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    touch-action: pan-y; /* Allow vertical scrolling/dragging */
  }
  
  /* Tablet: Hide left sidebar to maximize main content space */
  ${media.tablet} {
    display: none;
  }
  
  /* Desktop: Show as fixed sidebar */
  ${media.tabletLg} {
    display: block;
    position: fixed;
    top: 80px;
    left: 0;
    width: 250px;
    height: calc(100vh - 140px);
    z-index: 900;
    transform: none;
    box-shadow: none;
  }
  
  /* Large desktop: Wider sidebar */
  ${media.desktop} {
    width: 280px;
  }
`

const GridMain = styled.main`
  grid-area: main;
  /* Mobile-first: Minimal spacing, full width utilization */
  margin: 0;
  padding: 0.75rem;
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scroll */
  width: 100%;
  max-width: none;
  
  /* Ensure all child content uses full available width */
  > * {
    width: 100%;
    max-width: none;
  }
  
  /* Tablet: Add top margin to account for fixed header */
  ${media.tablet} {
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 1rem;
  }
  
  /* Desktop: More generous spacing */
  ${media.desktop} {
    padding: 1.5rem;
  }
`

const GridRightSidebar = styled.aside<{ $isOpen?: boolean }>`
  grid-area: right;
  /* Mobile-first: Hidden by default, drawer when needed */
  display: none;
  
  /* Mobile drawer functionality - only show as drawer on mobile */
  ${media.maxMobileLg} {
    display: block;
    position: fixed;
    top: 80px;
    right: 0;
    bottom: 65px;
    width: min(320px, 85vw); /* Responsive width with max constraint */
    height: auto;
    z-index: 1100;
    transform: translateX(${props => props.$isOpen ? '0' : '100%'});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${props => props.$isOpen ? '-8px 0 32px rgba(0, 0, 0, 0.5)' : 'none'};
    
    /* Enhanced mobile/tablet touch support */
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    touch-action: pan-y; /* Allow vertical scrolling/dragging */
  }
  
  /* Tablet: Hide right sidebar to maximize content space */
  ${media.tablet} {
    display: none;
  }
  
  /* Desktop: Show right sidebar */
  ${media.tabletLg} {
    display: block;
    position: fixed;
    top: 80px;
    right: 0;
    width: 250px;
    height: calc(100vh - 140px);
    z-index: 900;
    transform: none;
    box-shadow: none;
  }
  
  /* Large desktop: Wider sidebar */
  ${media.desktop} {
    width: 280px;
  }
`

const GridFooter = styled.footer`
  grid-area: footer;
  height: 65px; /* Slightly taller for touch targets */
  z-index: 9999; /* Ensure footer container is above sidebars */
  /* Mobile-first: Relative positioning */
  position: relative;
  
  /* Tablet and up: Fixed positioning */
  ${media.tablet} {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
  }
`

const MobileBackdrop = styled.div<{ $visible?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 65px; /* Don't cover footer area */
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1050;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  
  /* Only show backdrop for mobile/tablet drawer states */
  ${media.tabletLg} {
    display: none; /* Hide on desktop where sidebars are always visible */
  }
`

const SidebarBackdrop = styled.div<{ $visible?: boolean }>`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 65px; /* Don't cover footer area */
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  z-index: 1080; /* Above main backdrop but below sidebars */
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  
  /* Only show backdrop for mobile/tablet drawer states */
  ${media.tabletLg} {
    display: none; /* Hide on desktop where sidebars are always visible */
  }
`

interface DegenHeartLayoutProps {
  children: React.ReactNode
}

const DegenHeartLayout: React.FC<DegenHeartLayoutProps> = ({ children }) => {
  const { currentColorScheme } = useColorScheme()
  const [showGamesModal, setShowGamesModal] = useState(false)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  
  // Header modal states
  const [showBonusModal, setShowBonusModal] = useState(false)
  const [showJackpotModal, setShowJackpotModal] = useState(false)
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showTokenSelect, setShowTokenSelect] = useState(false)
  const [showConnectionStatus, setShowConnectionStatus] = useState(false)

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen)
    setRightSidebarOpen(false) // Close right sidebar when left opens
  }

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen)
    setLeftSidebarOpen(false) // Close left sidebar when right opens
  }

  const closeSidebars = () => {
    setLeftSidebarOpen(false)
    setRightSidebarOpen(false)
  }

  // Handle escape key to close sidebars
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && (leftSidebarOpen || rightSidebarOpen)) {
        closeSidebars()
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [leftSidebarOpen, rightSidebarOpen])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (leftSidebarOpen || rightSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [leftSidebarOpen, rightSidebarOpen])

  return (
    <DegenGamesModalContext.Provider value={{ 
      openGamesModal: () => setShowGamesModal(true),
      leftSidebarOpen,
      rightSidebarOpen,
      toggleLeftSidebar,
      toggleRightSidebar,
      closeSidebars
    }}>
      <DegenHeaderModalContext.Provider value={{
        openBonusModal: () => setShowBonusModal(true),
        openJackpotModal: () => setShowJackpotModal(true),
        openLeaderboardModal: () => setShowLeaderboardModal(true),
        openThemeSelector: () => setShowThemeSelector(true),
        openTokenSelect: () => setShowTokenSelect(true),
        openConnectionStatus: () => setShowConnectionStatus(true)
      }}>
      <LayoutContainer $colorScheme={currentColorScheme}>
        {/* Mobile backdrop */}
        <MobileBackdrop 
          $visible={leftSidebarOpen || rightSidebarOpen} 
          onClick={closeSidebars}
        />
        
        {/* Additional backdrop for sidebars */}
        <SidebarBackdrop 
          $visible={leftSidebarOpen || rightSidebarOpen} 
          onClick={closeSidebars}
        />
        
        <GridHeader>
          <Header />
        </GridHeader>
        
        <GridLeftSidebar $isOpen={leftSidebarOpen}>
          <LeftSidebar />
        </GridLeftSidebar>
        
        <GridMain>
          {children || <MainContent />}
        </GridMain>
        
        <GridRightSidebar $isOpen={rightSidebarOpen}>
          <RightSidebar />
        </GridRightSidebar>
        
        <GridFooter>
          <Footer />
        </GridFooter>
        
        {/* Degen Games Modal - renders in viewport mode covering main content area */}
        {showGamesModal && (
          <Modal variant="viewport" onClose={() => setShowGamesModal(false)}>
            <AllGamesContentModal onGameClick={() => setShowGamesModal(false)} />
          </Modal>
        )}
        
        {/* Header Modals - render in viewport mode covering main content area */}
        {showBonusModal && (
          <Modal variant="viewport" onClose={() => setShowBonusModal(false)}>
            <BonusContent />
          </Modal>
        )}

        {showJackpotModal && (
          <Modal variant="viewport" onClose={() => setShowJackpotModal(false)}>
            <JackpotContent />
          </Modal>
        )}

        {showLeaderboardModal && (
          <Modal variant="viewport" onClose={() => setShowLeaderboardModal(false)}>
            <LeaderboardsContent
              creator={PLATFORM_CREATOR_ADDRESS.toBase58()}
            />
          </Modal>
        )}

        {showThemeSelector && (
          <Modal variant="viewport" onClose={() => setShowThemeSelector(false)}>
            <ColorSchemeSelector />
          </Modal>
        )}

        {showTokenSelect && (
          <Modal variant="viewport" onClose={() => setShowTokenSelect(false)}>
            <div style={{ maxWidth: '500px', width: '100%' }}>
              <TokenSelect />
            </div>
          </Modal>
        )}

        {showConnectionStatus && (
          <Modal variant="viewport" onClose={() => setShowConnectionStatus(false)}>
            <div style={{ maxWidth: '600px', width: '100%' }}>
              <ConnectionStatusContent />
            </div>
          </Modal>
        )}
      </LayoutContainer>
      </DegenHeaderModalContext.Provider>
    </DegenGamesModalContext.Provider>
  )
}

export default DegenHeartLayout
