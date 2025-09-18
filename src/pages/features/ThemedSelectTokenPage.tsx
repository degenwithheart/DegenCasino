// ThemedSelectTokenPage.tsx - Themed wrapper for SelectTokenPage
import React from 'react'
import { useTheme } from '../../themes/UnifiedThemeContext'

// Default fallback component
const DefaultSelectTokenPage = React.lazy(() => import('./SelectTokenPage'))

const ThemedSelectTokenPage: React.FC = () => {
  const { resolveComponent } = useTheme()
  
  // Try to resolve themed component, fallback to default
  const SelectTokenPageComponent = resolveComponent('pages', 'SelectTokenPage') || DefaultSelectTokenPage
  
  return <SelectTokenPageComponent />
}

export default ThemedSelectTokenPage