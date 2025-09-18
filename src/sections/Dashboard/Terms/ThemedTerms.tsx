// Themed Terms Wrapper
import React from 'react'
import { useTheme } from '../../../themes/UnifiedThemeContext'
import DefaultTerms from './Terms'

const ThemedTerms: React.FC = () => {
  const { resolveComponent } = useTheme()
  
  // Try to get themed Terms page component
  const TermsComponent = resolveComponent('pages', 'TermsPage')
  
  // Use themed component if available, otherwise fallback to default
  const Component = TermsComponent || DefaultTerms
  
  return <Component />
}

export default ThemedTerms