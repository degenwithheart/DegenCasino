// ThemedFairnessAudit.tsx - Themed wrapper for FairnessAudit
import React from 'react'
import { useTheme } from '../../themes/UnifiedThemeContext'

// Default fallback component
const DefaultFairnessAudit = React.lazy(() => import('./FairnessAudit'))

const ThemedFairnessAudit: React.FC = () => {
  const { resolveComponent } = useTheme()
  
  // Try to resolve themed component, fallback to default
  const FairnessAuditComponent = resolveComponent('pages', 'FairnessAuditPage') || DefaultFairnessAudit
  
  return <FairnessAuditComponent />
}

export default ThemedFairnessAudit