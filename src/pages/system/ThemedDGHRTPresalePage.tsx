// ThemedDGHRTPresalePage.tsx - Themed wrapper for DGHRTPresalePage
import React from 'react'
import { useTheme } from '../../themes/UnifiedThemeContext'

// Default fallback component
const DefaultDGHRTPresalePage = React.lazy(() => import('./DGHRTPresalePage'))

const ThemedDGHRTPresalePage: React.FC = () => {
  const { resolveComponent } = useTheme()
  
  // Try to resolve themed component, fallback to default
  const DGHRTPresalePageComponent = resolveComponent('pages', 'DGHRTPresalePage') || DefaultDGHRTPresalePage
  
  return <DGHRTPresalePageComponent />
}

export default ThemedDGHRTPresalePage