import React, { useState, createContext, useContext, useEffect } from 'react'
import styled from 'styled-components'
import { useColorScheme } from '../../ColorSchemeContext'
import Header from './Header'
import Footer from './Footer'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import MainContent from './MainContent'
import { Modal } from './components/Modal'
import AllGamesModalContent from '../../../components/AllGamesModal/AllGamesModal'

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

export const useDegenGamesModal = () => useContext(DegenGamesModalContext)

const LayoutContainer = styled.div<{ $colorScheme: any }>`
  display: grid;
  min-height: 100vh;
  width: 100%;
  background: ${props => props.$colorScheme.colors.background};
  
  /* DegenHeart Grid Layout */
  grid-template-areas: 
    "header header header"
    "left   main   right"
    "footer footer footer";
  grid-template-rows: 80px 1fr 60px;
  grid-template-columns: 250px 1fr 250px;
  
  /* Tablet adjustments */
  @media (max-width: 1024px) {
    grid-template-columns: 200px 1fr 200px;
  }
  
  /* Mobile responsive - hide sidebars completely */
  @media (max-width: 768px) {
    grid-template-areas: 
      "header"
      "main"
      "footer";
    grid-template-rows: 80px 1fr 60px;
    grid-template-columns: 1fr;
  }
`

const GridHeader = styled.header`
  grid-area: header;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    position: relative;
  }
`

const GridLeftSidebar = styled.aside<{ $isOpen?: boolean }>`
  grid-area: left;
  position: fixed;
  top: 80px;
  left: 0;
  width: 250px;
  height: calc(100vh - 140px);
  z-index: 900;
  
  @media (max-width: 1024px) {
    width: 200px;
  }
  
  /* Mobile drawer functionality */
  @media (max-width: 768px) {
    position: fixed;
    top: 80px;
    left: 0;
    bottom: 65px;
    width: 280px;
    height: auto;
    z-index: 1100;
    transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${props => props.$isOpen ? '8px 0 32px rgba(0, 0, 0, 0.5)' : 'none'};
  }
`

const GridMain = styled.main`
  grid-area: main;
  margin-top: 10px;
  margin-bottom: 10px;
  overflow-y: auto;
  padding: 1rem;
  width: 100%;
  max-width: none;
  
  /* Ensure all child content uses full available width */
  > * {
    width: 100%;
    max-width: none;
  }
  
  @media (max-width: 768px) {
    margin-top: 0;
    margin-bottom: 0;
    padding: 0.5rem;
  }
`

const GridRightSidebar = styled.aside<{ $isOpen?: boolean }>`
  grid-area: right;
  position: fixed;
  top: 80px;
  right: 0;
  width: 250px;
  height: calc(100vh - 140px);
  z-index: 900;
  
  @media (max-width: 1024px) {
    width: 200px;
  }
  
  /* Mobile drawer functionality */
  @media (max-width: 768px) {
    position: fixed;
    top: 80px;
    right: 0;
    bottom: 65px;
    width: 280px;
    height: auto;
    z-index: 1100;
    transform: translateX(${props => props.$isOpen ? '0' : '100%'});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${props => props.$isOpen ? '-8px 0 32px rgba(0, 0, 0, 0.5)' : 'none'};
  }
`

const GridFooter = styled.footer`
  grid-area: footer;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    position: relative;
  }
`

const MobileBackdrop = styled.div<{ $visible?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1050;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (min-width: 769px) {
    display: none;
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
      <LayoutContainer $colorScheme={currentColorScheme}>
        {/* Mobile backdrop */}
        <MobileBackdrop 
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
            <AllGamesModalContent onGameClick={() => setShowGamesModal(false)} />
          </Modal>
        )}
      </LayoutContainer>
    </DegenGamesModalContext.Provider>
  )
}

export default DegenHeartLayout
