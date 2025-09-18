// ThemedDGHRTPresale.tsx - Themed wrapper for DGHRTPresale
import React from 'react'
import { useTheme } from '../../themes/UnifiedThemeContext'

// Default fallback component
const DefaultDGHRTPresale = React.lazy(() => import('./DGHRTPresale'))

const ThemedDGHRTPresale: React.FC = () => {
  const { resolveComponent } = useTheme()
  
  // Try to resolve themed component, fallback to default
  const DGHRTPresaleComponent = resolveComponent('pages', 'DGHRTPresalePage') || DefaultDGHRTPresale
  
  return <DGHRTPresaleComponent />
}

export default ThemedDGHRTPresale