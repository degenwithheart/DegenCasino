// ThemedDGHRTToken.tsx - Themed wrapper for DGHRTToken
import React from 'react'
import { useTheme } from '../../themes/UnifiedThemeContext'

// Default fallback component
const DefaultDGHRTToken = React.lazy(() => import('./DGHRTToken'))

const ThemedDGHRTToken: React.FC = () => {
  const { resolveComponent } = useTheme()
  
  // Try to resolve themed component, fallback to default
  const DGHRTTokenComponent = resolveComponent('pages', 'DGHRTTokenPage') || DefaultDGHRTToken
  
  return <DGHRTTokenComponent />
}

export default ThemedDGHRTToken