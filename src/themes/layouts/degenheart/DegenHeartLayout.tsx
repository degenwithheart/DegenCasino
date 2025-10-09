import React, { useState, createContext, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useColorScheme } from '../../ColorSchemeContext';
import Header from './Header';
import Footer from './Footer';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MainContent from './MainContent';
import { Modal, ModalContent } from './components/Modal';
import { ShareModal } from './components/ShareModal';
import AllGamesContentModal from './components/AllGamesContentModal';
import { ConnectionStatusContent } from './components/ConnectionStatusContent';
import { BonusContent, JackpotContent, ColorSchemeSelector } from '../../../components';
import { LeaderboardsContent } from '../../../sections/LeaderBoard/LeaderboardsModal';
import TokenSelect from '../../../sections/TokenSelect';
import { PLATFORM_CREATOR_ADDRESS } from '../../../constants';
import { media, gridBreakpoints } from './breakpoints';

// Create a local games modal context for degen theme
const DegenGamesModalContext = createContext<{
  openGamesModal: () => void;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  closeSidebars: () => void;
}>({
  openGamesModal: () => { },
  leftSidebarOpen: false,
  rightSidebarOpen: false,
  toggleLeftSidebar: () => { },
  toggleRightSidebar: () => { },
  closeSidebars: () => { }
});

// Create context for Header modals to render within MainContent area
const DegenHeaderModalContext = createContext<{
  openBonusModal: () => void;
  openJackpotModal: () => void;
  openLeaderboardModal: () => void;
  openThemeSelector: () => void;
  openTokenSelect: () => void;
  openConnectionStatus: () => void;
  openShareModal: (game: any) => void;
}>({
  openBonusModal: () => { },
  openJackpotModal: () => { },
  openLeaderboardModal: () => { },
  openThemeSelector: () => { },
  openTokenSelect: () => { },
  openConnectionStatus: () => { },
  openShareModal: () => { }
});

export const useDegenGamesModal = () => useContext(DegenGamesModalContext);
export const useDegenHeaderModal = () => useContext(DegenHeaderModalContext);

const LayoutContainer = styled.div<{ $colorScheme: any; }>`
  display: grid;
  min-height: 100vh;
  min-height: 100dvh; /* Use dynamic viewport height for mobile */
  width: 100%;
  max-width: 100vw; /* Prevent overflow beyond viewport width */
  margin: 0; /* Ensure no external margins */
  padding: 0; /* Ensure no external padding */
  box-sizing: border-box; /* Include borders and padding in width calculations */
  background: ${props => props.$colorScheme.colors.background};
  
  /* Mobile-first: Single column layout by default */
  grid-template-areas: ${gridBreakpoints.mobile.areas};
  grid-template-rows: ${gridBreakpoints.mobile.rows};
  grid-template-columns: ${gridBreakpoints.mobile.columns};
  
  /* Tablet: Single column layout (hide both sidebars for better content focus) */
  ${media.tablet} {
    grid-template-areas: ${gridBreakpoints.tablet.areas};
    grid-template-rows: ${gridBreakpoints.tablet.rows};
    grid-template-columns: ${gridBreakpoints.tablet.columns};
  }
  
  /* Small Desktop: Two column layout (main content + right sidebar) */
  ${media.tabletLg} {
    grid-template-areas: ${gridBreakpoints.smallDesktop.areas};
    grid-template-rows: ${gridBreakpoints.smallDesktop.rows};
    grid-template-columns: ${gridBreakpoints.smallDesktop.columns};
  }
  
  /* Desktop: Full three-column layout */
  ${media.desktop} {
    grid-template-areas: ${gridBreakpoints.desktop.areas};
    grid-template-rows: ${gridBreakpoints.desktop.rows};
    grid-template-columns: ${gridBreakpoints.desktop.columns};
  }
  
  /* Large desktop: Wider sidebars for better balance */
  ${media.desktopLg} {
    grid-template-columns: 280px 1fr 280px;
  }
  
  /* Ultra-wide: Add max-width constraint for very large screens */
  ${media.ultraWide} {
    max-width: 2400px;
    margin: 0 auto;
  }
`;

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
`;

const GridLeftSidebar = styled.aside<{ $isOpen?: boolean; }>`
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
  
  /* Small Desktop: Keep left sidebar hidden for cleaner two-column layout */
  ${media.tabletLg} {
    display: none;
  }
  
  /* Desktop: Show as fixed sidebar */
  ${media.desktop} {
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
  ${media.desktopLg} {
    width: 280px;
  }
`;

const GridMain = styled.main`
  grid-area: main;
  /* Mobile-first: Full width with minimal padding, content touches viewport edges */
  margin: 0;
  padding: 0.75rem;
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scroll */
  width: 100%;
  max-width: none;
  box-sizing: border-box; /* Include padding in width calculations */

  /* Ensure all child content uses full available width and respects viewport edges */
  > * {
    width: 100%;
    max-width: none;
    box-sizing: border-box;
    /* Prevent content from extending beyond container edges */
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
  }

  /* Ensure nested content also respects boundaries */
  > * > * {
    max-width: 100%;
    box-sizing: border-box;
  }

  /* Tablet: Add top margin for fixed header, maintain edge alignment */
  ${media.tablet} {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 0;
    margin-right: 0;
    padding: 1rem;
  }

  /* Small Desktop: Two-column layout, content aligns with viewport edges */
  ${media.tabletLg} {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 0; /* Align with left viewport edge */
    margin-right: 10px; /* Small gap from right sidebar */
    padding: 1.25rem;
  }

  /* Desktop: Three-column layout, content properly spaced from sidebars */
  ${media.desktop} {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10px; /* Gap from left sidebar */
    margin-right: 10px; /* Gap from right sidebar */
    padding: 1.5rem;
  }

  /* Large desktop: Maintain consistent spacing */
  ${media.desktopLg} {
    margin-left: 10px;
    margin-right: 10px;
    padding: 1.5rem;
  }
`;

const GridRightSidebar = styled.aside<{ $isOpen?: boolean; }>`
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
  
  /* Small Desktop: Show right sidebar for two-column layout */
  ${media.tabletLg} {
    display: block;
    position: fixed;
    top: 80px;
    right: 0;
    width: 220px;
    height: calc(100vh - 140px);
    z-index: 900;
    transform: none;
    box-shadow: none;
  }
  
  /* Desktop: Full three-column layout with wider sidebar */
  ${media.desktop} {
    width: 250px;
  }
  
  /* Large desktop: Even wider sidebar */
  ${media.desktopLg} {
    width: 280px;
  }
`;

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
`;

const MobileBackdrop = styled.div<{ $visible?: boolean; }>`
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
`;

const SidebarBackdrop = styled.div<{ $visible?: boolean; }>`
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
`;

interface DegenHeartLayoutProps {
  children: React.ReactNode;
}

const DegenHeartLayout: React.FC<DegenHeartLayoutProps> = ({ children }) => {
  const { currentColorScheme } = useColorScheme();
  const [showGamesModal, setShowGamesModal] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  // Header modal states
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showJackpotModal, setShowJackpotModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);

  // Share modal state
  const [shareModalGame, setShareModalGame] = useState<any>(undefined);

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen);
    setRightSidebarOpen(false); // Close right sidebar when left opens
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen);
    setLeftSidebarOpen(false); // Close left sidebar when right opens
  };

  const closeSidebars = () => {
    setLeftSidebarOpen(false);
    setRightSidebarOpen(false);
  };

  // Handle escape key to close sidebars
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && (leftSidebarOpen || rightSidebarOpen)) {
        closeSidebars();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [leftSidebarOpen, rightSidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (leftSidebarOpen || rightSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [leftSidebarOpen, rightSidebarOpen]);

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
        openConnectionStatus: () => setShowConnectionStatus(true),
        openShareModal: (game: any) => {
          console.log('ShareModal triggered with game:', game);
          setShareModalGame(game);
        }
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
              <ModalContent $maxWidth="600px">
                <BonusContent />
              </ModalContent>
            </Modal>
          )}

          {showJackpotModal && (
            <Modal variant="viewport" onClose={() => setShowJackpotModal(false)}>
              <ModalContent $maxWidth="700px">
                <JackpotContent />
              </ModalContent>
            </Modal>
          )}

          {showLeaderboardModal && (
            <Modal variant="viewport" onClose={() => setShowLeaderboardModal(false)}>
              <ModalContent $maxWidth="800px">
                <LeaderboardsContent
                  creator={PLATFORM_CREATOR_ADDRESS.toBase58()}
                />
              </ModalContent>
            </Modal>
          )}

          {shareModalGame && (
            <Modal variant="viewport" onClose={() => setShareModalGame(undefined)}>
              <ShareModal
                event={shareModalGame}
                onClose={() => setShareModalGame(undefined)}
              />
            </Modal>
          )}

          {/* Debug: Show shareModalGame state */}
          {console.log('ShareModal state in render:', shareModalGame)}

          {showThemeSelector && (
            <Modal variant="viewport" onClose={() => setShowThemeSelector(false)}>
              <ModalContent $maxWidth="500px">
                <ColorSchemeSelector />
              </ModalContent>
            </Modal>
          )}

          {showTokenSelect && (
            <Modal variant="viewport" onClose={() => setShowTokenSelect(false)}>
              <ModalContent $maxWidth="500px">
                <TokenSelect />
              </ModalContent>
            </Modal>
          )}

          {showConnectionStatus && (
            <Modal variant="viewport" onClose={() => setShowConnectionStatus(false)}>
              <ModalContent $maxWidth="600px">
                <ConnectionStatusContent />
              </ModalContent>
            </Modal>
          )}
        </LayoutContainer>
      </DegenHeaderModalContext.Provider>
    </DegenGamesModalContext.Provider>
  );
};

export default DegenHeartLayout;
