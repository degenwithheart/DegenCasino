// Themed UserProfile Wrapper
import React from 'react'
import { useTheme } from '../../themes/UnifiedThemeContext'
import DefaultUserProfile from './UserProfile'

const ThemedUserProfile: React.FC = () => {
  const { resolveComponent } = useTheme()
  
  // Try to get themed UserProfile component
  const UserProfileComponent = resolveComponent('sections', 'UserProfile')
  
  // Use themed component if available, otherwise fallback to default
  const Component = UserProfileComponent || DefaultUserProfile
  
  return <Component />
}

export default ThemedUserProfile