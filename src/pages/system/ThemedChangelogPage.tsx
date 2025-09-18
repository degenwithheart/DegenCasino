// ThemedChangelogPage.tsx - Themed wrapper for ChangelogPage
import React from 'react'
import { useTheme } from '../../themes/UnifiedThemeContext'

// Default fallback component
const DefaultChangelogPage = React.lazy(() => import('./ChangelogPage'))

const ThemedChangelogPage: React.FC = () => {
  const { resolveComponent } = useTheme()
  
  // Try to resolve themed component, fallback to default
  const ChangelogPageComponent = resolveComponent('pages', 'ChangelogPage') || DefaultChangelogPage
  
  return <ChangelogPageComponent />
}

export default ThemedChangelogPage