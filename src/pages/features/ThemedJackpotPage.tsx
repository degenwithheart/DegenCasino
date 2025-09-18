// ThemedJackpotPage.tsx - Themed wrapper for JackpotPage
import React from 'react'
import { useTheme } from '../../themes/UnifiedThemeContext'

// Default fallback component
const DefaultJackpotPage = React.lazy(() => import('./JackpotPage'))

const ThemedJackpotPage: React.FC = () => {
  const { resolveComponent } = useTheme()
  
  // Try to resolve themed component, fallback to default
  const JackpotPageComponent = resolveComponent('pages', 'JackpotPage') || DefaultJackpotPage
  
  return <JackpotPageComponent />
}

export default ThemedJackpotPage