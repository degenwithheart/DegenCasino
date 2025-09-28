import React from 'react'
import styled from 'styled-components'
import { useColorScheme } from '../../ColorSchemeContext'
import { spacing, media, components } from './breakpoints'

const GameContainer = styled.div<{ $colorScheme: any }>`
  width: 100%;
  
  /* Mobile-first game display */
  background: ${props => props.$colorScheme.colors.surface}40;
  border: 1px solid ${props => props.$colorScheme.colors.accent}20;
  border-radius: ${components.button.borderRadius};
  
  /* Touch-optimized game area */
  min-height: 60vh;
  
  /* Game content padding */
  padding: ${spacing.mobile.padding};
  
  /* Enhanced touch scrolling */
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  
  ${media.landscape} {
    min-height: 50vh;
  }
  
  ${media.mobileLg} {
    padding: ${spacing.base};
    min-height: 65vh;
  }
  
  ${media.tablet} {
    padding: ${spacing.lg};
    min-height: 70vh;
  }
`

const GameContent = styled.div`
  width: 100%;
  height: 100%;
  
  /* Ensure game content is properly centered */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  /* Mobile-optimized game UI */
  gap: ${spacing.base};
`

interface GameProps {
  children: React.ReactNode;
}

const Game: React.FC<GameProps> = ({ children }) => {
  const { currentColorScheme } = useColorScheme()
  
  return (
    <GameContainer $colorScheme={currentColorScheme}>
      <GameContent>
        {children}
      </GameContent>
    </GameContainer>
  )
}

export default Game