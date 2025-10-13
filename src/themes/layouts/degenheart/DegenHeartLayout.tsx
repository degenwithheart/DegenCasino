import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useColorScheme } from '../../ColorSchemeContext';
import { useChatNotifications } from '../../../contexts/ChatNotificationContext';
import Header from './Header';
import Footer from './Footer';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MainContent from './MainContent';
import { Modal } from './components/Modal';
import { ShareModal } from './components/ShareModal';
import AllGamesContentModal from './components/AllGamesContentModal';
import { ConnectionStatusContent } from './components/ConnectionStatusContent';
import { BonusPage, JackpotPage, LeaderboardPage, SelectTokenPage, TrollBoxPage } from './pages';
import { ColorSchemeSelector } from '../../../components';
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
  openTrollBoxModal: () => void;
}>({
  openBonusModal: () => { },
  openJackpotModal: () => { },
  openLeaderboardModal: () => { },
  openThemeSelector: () => { },
  openTokenSelect: () => { },
  openConnectionStatus: () => { },
  openShareModal: () => { },
  openTrollBoxModal: () => { }
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
  
  /* Enable touch events for drag functionality */
  touch-action: manipulation; /* Allow normal touch interactions */
  
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

const GridLeftSidebar = styled.aside<{ $isOpen?: boolean; $isDragging?: boolean; }>`
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
    height: calc(100vh - 145px); /* Fixed height to enable scrolling */
    z-index: 9998; /* Higher z-index to ensure visibility */
    transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
    transition: transform ${props => props.$isDragging ? '0s' : '0.3s cubic-bezier(0.4, 0, 0.2, 1)'};
    box-shadow: ${props => props.$isOpen ? '8px 0 32px rgba(0, 0, 0, 0.5)' : 'none'};
    
    /* Enable scrolling */
    overflow-y: auto;
    overflow-x: hidden;
    
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
    /* Show left sidebar in tabletLg (>=1024px) to match smallDesktop grid
       previously defined. This prevents the gap where left sidebar is hidden
       but right sidebar is visible. */
    display: block;
    position: fixed;
    top: 80px;
    left: 0;
    width: 200px;
    height: calc(100vh - 140px);
    z-index: 900;
    transform: none;
    box-shadow: none;
    overflow-y: auto;
    overflow-x: hidden;
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
    
    /* Enable scrolling on desktop */
    overflow-y: auto;
    overflow-x: hidden;
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
    margin-right: 0px; /* Small gap from right sidebar */
    padding: 1.25rem;
  }

  /* Desktop: Three-column layout, content properly spaced from sidebars */
  ${media.desktop} {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 0px; /* Gap from left sidebar */
    margin-right: 0px; /* Gap from right sidebar */
    padding: 1.5rem;
  }

  /* Large desktop: Maintain consistent spacing */
  ${media.desktopLg} {
    margin-left: 0px;
    margin-right: 0px;
    padding: 1.5rem;
  }
`;

const GridRightSidebar = styled.aside<{ $isOpen?: boolean; $isDragging?: boolean; }>`
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
    height: calc(100vh - 145px); /* Fixed height to enable scrolling */
    z-index: 1100;
    transform: translateX(${props => props.$isOpen ? '0' : '100%'});
    transition: transform ${props => props.$isDragging ? '0s' : '0.3s cubic-bezier(0.4, 0, 0.2, 1)'};
    box-shadow: ${props => props.$isOpen ? '-8px 0 32px rgba(0, 0, 0, 0.5)' : 'none'};
    
    /* Enable scrolling */
    overflow-y: auto;
    overflow-x: hidden;
    
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
    
    /* Enable scrolling on desktop */
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  /* Large desktop: Even wider sidebar */
  ${media.desktopLg} {
    width: 280px;
  }
`;

const DragZoneLeft = styled.div<{ $visible: boolean; }>`
  position: fixed;
  top: 80px;
  left: 0;
  width: 20px;
  bottom: 65px;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.3) 0%, transparent 100%);
  z-index: 10000;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
  
  ${media.tablet} {
    display: none; /* Hide on desktop */
  }
`;

const DragZoneRight = styled.div<{ $visible: boolean; }>`
  position: fixed;
  top: 80px;
  right: 0;
  width: 20px;
  bottom: 65px;
  background: linear-gradient(270deg, rgba(59, 130, 246, 0.3) 0%, transparent 100%);
  z-index: 10000;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
  
  ${media.tablet} {
    display: none; /* Hide on desktop */
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
  const { resetUnread } = useChatNotifications();
  const [showGamesModal, setShowGamesModal] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [currentDragX, setCurrentDragX] = useState(0);
  const dragThreshold = 50; // Minimum distance to trigger drag
  const layoutRef = useRef<HTMLDivElement>(null);

  // Header modal states
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showJackpotModal, setShowJackpotModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [showTrollBoxModal, setShowTrollBoxModal] = useState(false);
  const [trollBoxStatus, setTrollBoxStatus] = useState('Connecting…');

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

  // Drag handlers - only trigger from screen edges
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const screenWidth = window.innerWidth;
    const edgeZone = 50; // 50px edge zone

    // Only start drag if touch is in edge zones
    if (touch.clientX <= edgeZone || touch.clientX >= screenWidth - edgeZone) {
      setDragStartX(touch.clientX);
      setDragStartY(touch.clientY);
      setCurrentDragX(touch.clientX);
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === 0) return; // No valid drag started

    const deltaX = e.touches[0].clientX - dragStartX;
    const deltaY = e.touches[0].clientY - dragStartY;

    // Start dragging if horizontal movement is significant
    if (!isDragging && Math.abs(deltaX) > 15 && Math.abs(deltaX) > Math.abs(deltaY)) {
      setIsDragging(true);
      e.preventDefault(); // Prevent scrolling during drag
    }

    if (isDragging) {
      setCurrentDragX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || dragStartX === 0) {
      setDragStartX(0);
      return;
    }

    const deltaX = currentDragX - dragStartX;
    const absDeltaX = Math.abs(deltaX);
    const screenWidth = window.innerWidth;

    // Check if drag is significant enough
    if (absDeltaX > dragThreshold) {
      // Left edge drag to right - open left sidebar
      if (dragStartX <= 50 && deltaX > 0) {
        setLeftSidebarOpen(true);
        setRightSidebarOpen(false);
      }
      // Right edge drag to left - open right sidebar  
      else if (dragStartX >= screenWidth - 50 && deltaX < 0) {
        setRightSidebarOpen(true);
        setLeftSidebarOpen(false);
      }
    }

    setIsDragging(false);
    setDragStartX(0);
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
        },
        openTrollBoxModal: () => {
          resetUnread();
          toggleRightSidebar();
        }
      }}>
        <LayoutContainer
          $colorScheme={currentColorScheme}
          ref={layoutRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Drag zone indicators */}
          <DragZoneLeft $visible={isDragging && dragStartX <= 50} />
          <DragZoneRight $visible={isDragging && dragStartX >= window.innerWidth - 50} />

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

          <GridLeftSidebar $isOpen={leftSidebarOpen} $isDragging={isDragging}>
            <LeftSidebar />
          </GridLeftSidebar>

          <GridMain>
            {children || <MainContent />}
          </GridMain>

          <GridRightSidebar $isOpen={rightSidebarOpen} $isDragging={isDragging}>
            <RightSidebar onChatStatusChange={setTrollBoxStatus} chatStatus={trollBoxStatus} />
          </GridRightSidebar>

          <GridFooter>
            <Footer />
          </GridFooter>

          {/* Degen Games Modal - renders in viewport mode covering main content area */}
          <Modal
            isOpen={showGamesModal}
            onClose={() => setShowGamesModal(false)}
            title="🎮 All Games"
            maxHeight="90vh"
          >
            <AllGamesContentModal onGameClick={() => setShowGamesModal(false)} />
          </Modal>

          {/* Header Modals - render in viewport mode covering main content area */}
          <Modal
            isOpen={showBonusModal}
            onClose={() => setShowBonusModal(false)}
            title="🎁 Bonus"
            maxHeight="80vh"
          >
            <BonusPage />
          </Modal>

          <Modal
            isOpen={showJackpotModal}
            onClose={() => setShowJackpotModal(false)}
            title="💰 Jackpot"
            maxHeight="80vh"
          >
            <JackpotPage />
          </Modal>

          <Modal
            isOpen={showLeaderboardModal}
            onClose={() => setShowLeaderboardModal(false)}
            title="🏆 Leaderboard"
            maxHeight="85vh"
          >
            <LeaderboardPage />
          </Modal>

          <Modal
            isOpen={!!shareModalGame}
            onClose={() => setShareModalGame(undefined)}
            title="📤 Share Result"
            maxHeight="80vh"
          >
            {shareModalGame && (
              <ShareModal
                event={shareModalGame}
                onClose={() => setShareModalGame(undefined)}
              />
            )}
          </Modal>

          <Modal
            isOpen={showThemeSelector}
            onClose={() => setShowThemeSelector(false)}
            title="🎨 Theme Selector"
            maxHeight="70vh"
          >
            <ColorSchemeSelector />
          </Modal>

          <Modal
            isOpen={showTokenSelect}
            onClose={() => setShowTokenSelect(false)}
            title="💎 Select Token"
            maxHeight="75vh"
          >
            <SelectTokenPage />
          </Modal>

          <Modal
            isOpen={showConnectionStatus}
            onClose={() => setShowConnectionStatus(false)}
            title="📡 Connection Status"
            maxHeight="75vh"
          >
            <ConnectionStatusContent />
          </Modal>
        </LayoutContainer>
      </DegenHeaderModalContext.Provider>
    </DegenGamesModalContext.Provider>
  );
};

export default DegenHeartLayout;
