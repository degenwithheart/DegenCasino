// ThemedLeaderboardPage.tsx - Themed wrapper for LeaderboardPage
import React from 'react'
import { useTheme } from '../../themes/UnifiedThemeContext'

// Default fallback component
const DefaultLeaderboardPage = React.lazy(() => import('./LeaderboardPage'))

const ThemedLeaderboardPage: React.FC = () => {
  const { resolveComponent } = useTheme()
  
  // Try to resolve themed component, fallback to default
  const LeaderboardPageComponent = resolveComponent('pages', 'LeaderboardPage') || DefaultLeaderboardPage
  
  return <LeaderboardPageComponent />
}

export default ThemedLeaderboardPage