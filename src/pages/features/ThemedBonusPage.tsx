// ThemedBonusPage.tsx - Themed wrapper for BonusPage
import React from 'react'
import { useTheme } from '../../themes/UnifiedThemeContext'

// Default fallback component
const DefaultBonusPage = React.lazy(() => import('./BonusPage'))

const ThemedBonusPage: React.FC = () => {
  const { resolveComponent } = useTheme()
  
  // Try to resolve themed component, fallback to default
  const BonusPageComponent = resolveComponent('pages', 'BonusPage') || DefaultBonusPage
  
  return <BonusPageComponent />
}

export default ThemedBonusPage