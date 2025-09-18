// ThemedAboutMe.tsx - Themed wrapper for AboutMe
import React from 'react'
import { useTheme } from '../../../themes/UnifiedThemeContext'

// Default fallback component
const DefaultAboutMe = React.lazy(() => import('./AboutMe'))

const ThemedAboutMe: React.FC = () => {
  const { resolveComponent } = useTheme()
  
  // Try to resolve themed component, fallback to default
  const AboutMeComponent = resolveComponent('pages', 'AboutMePage') || DefaultAboutMe
  
  return <AboutMeComponent />
}

export default ThemedAboutMe