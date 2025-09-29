import React from 'react'
import styled from 'styled-components'
import { useColorScheme } from '../../ColorSchemeContext'
import Feed from './components/Feed'
import { spacing } from './breakpoints'

const DashboardContainer = styled.div<{ $colorScheme: any }>`
  width: 100%;
  min-height: 100%;
  background: ${props => props.$colorScheme.colors.background};
`

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const { currentColorScheme } = useColorScheme()

  return (
    <DashboardContainer $colorScheme={currentColorScheme}>
      <Feed />
    </DashboardContainer>
  )
}

export default Dashboard