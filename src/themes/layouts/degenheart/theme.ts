import { LayoutTheme } from '../index'
import { Header } from './index'
import { Footer } from './index'
import { Game } from './index'
import React from 'react'

// Lazy load themed pages
const MobileAppPage = React.lazy(() => import('./pages/MobileAppPage'))

export const degenHeartTheme: LayoutTheme = {
  id: 'degenheart',
  name: 'DegenHeart New',
  description: '3-Column layout',
  
  // The main layout wrapper component
  components: {
    Header,
    Footer,
  },
  
  // Sections with themed overrides
  sections: {
    Game,
  },
  
  // Pages with themed overrides
  pages: {
    MobileAppPage,
  },
  
  config: {
    enableSidebar: true,
    headerStyle: 'fixed',
    footerStyle: 'fixed',
    maxWidth: '100%',
    spacing: 'normal',
  },
}
