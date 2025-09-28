import React from 'react'
import styled from 'styled-components'
import { useColorScheme } from '../../ColorSchemeContext'
import { spacing, media } from './breakpoints'

const MainContentContainer = styled.div<{ $colorScheme: any }>`
  width: 100%;
  min-height: 100%;
  
  /* Mobile-first padding */
  padding: ${spacing.mobile.padding};
  
  /* Enhanced mobile scrolling */
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  /* Prevent horizontal scroll */
  max-width: 100vw;
  
  ${media.mobileLg} {
    padding: ${spacing.base} ${spacing.lg};
  }
  
  ${media.tablet} {
    padding: ${spacing.lg} ${spacing.xl};
  }
`

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const { currentColorScheme } = useColorScheme()
  
  return (
    <MainContentContainer $colorScheme={currentColorScheme}>
      {children}
    </MainContentContainer>
  )
}

export default MainContent