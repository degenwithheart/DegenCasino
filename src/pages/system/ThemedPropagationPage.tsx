// ThemedPropagationPage.tsx - Themed wrapper for PropagationPage
import React from 'react'
import { useTheme } from '../../themes/UnifiedThemeContext'

// Default fallback component
const DefaultPropagationPage = React.lazy(() => import('./propagation'))

const ThemedPropagationPage: React.FC = () => {
  const { resolveComponent } = useTheme()
  
  // Try to resolve themed component, fallback to default
  const PropagationPageComponent = resolveComponent('pages', 'PropagationPage') || DefaultPropagationPage
  
  return <PropagationPageComponent />
}

export default ThemedPropagationPage