// ThemedAdminPage.tsx - Themed wrapper for AdminPage
import React from 'react'
import { useTheme } from '../../themes/UnifiedThemeContext'

// Default fallback component
const DefaultAdminPage = React.lazy(() => import('./AdminPage'))

const ThemedAdminPage: React.FC = () => {
  const { resolveComponent } = useTheme()
  
  // Try to resolve themed component, fallback to default
  const AdminPageComponent = resolveComponent('pages', 'AdminPage') || DefaultAdminPage
  
  return <AdminPageComponent />
}

export default ThemedAdminPage