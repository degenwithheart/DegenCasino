// ThemedWhitepaper.tsx - Themed wrapper for Whitepaper
import React from 'react'
import { useTheme } from '../../../themes/UnifiedThemeContext'

// Default fallback component
const DefaultWhitepaper = React.lazy(() => import('./Whitepaper'))

const ThemedWhitepaper: React.FC = () => {
  const { resolveComponent } = useTheme()
  
  // Try to resolve themed component, fallback to default
  const WhitepaperComponent = resolveComponent('pages', 'WhitepaperPage') || DefaultWhitepaper
  
  return <WhitepaperComponent />
}

export default ThemedWhitepaper