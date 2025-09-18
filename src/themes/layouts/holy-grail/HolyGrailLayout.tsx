import React from 'react'
import styled from 'styled-components'
import { useColorScheme } from '../../ColorSchemeContext'
import Header from './Header'
import Footer from './Footer'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import MainContent from './MainContent'

const LayoutContainer = styled.div<{ $colorScheme: any }>`
  display: grid;
  min-height: 100vh;
  width: 100%;
  background: ${props => props.$colorScheme.colors.background};
  
  /* Holy Grail Grid Layout */
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

const GridLeftSidebar = styled.aside`
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
  
  @media (max-width: 768px) {
    display: none;
  }
`

const GridMain = styled.main`
  grid-area: main;
  margin-top: 10px;
  margin-bottom: 10px;
  overflow-y: auto;
  padding: 1rem;
  
  @media (max-width: 768px) {
    margin-top: 0;
    margin-bottom: 0;
    padding: 0.5rem;
  }
`

const GridRightSidebar = styled.aside`
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
  
  @media (max-width: 768px) {
    display: none;
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

interface HolyGrailLayoutProps {
  children: React.ReactNode
}

const HolyGrailLayout: React.FC<HolyGrailLayoutProps> = ({ children }) => {
  const { currentColorScheme } = useColorScheme()

  return (
    <LayoutContainer $colorScheme={currentColorScheme}>
      <GridHeader>
        <Header />
      </GridHeader>
      
      <GridLeftSidebar>
        <LeftSidebar />
      </GridLeftSidebar>
      
      <GridMain>
        {children || <MainContent />}
      </GridMain>
      
      <GridRightSidebar>
        <RightSidebar />
      </GridRightSidebar>
      
      <GridFooter>
        <Footer />
      </GridFooter>
    </LayoutContainer>
  )
}

export default HolyGrailLayout
