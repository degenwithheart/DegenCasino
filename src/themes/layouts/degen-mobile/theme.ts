import { LayoutTheme } from '../index'
import Header from './Header'
import Footer from './Footer' 
import Game from './Game'

export const degenMobileTheme: LayoutTheme = {
  id: 'degen-mobile',
  name: 'Degen Mobile',
  description: 'Mobile-first theme with bottom navigation and touch-optimized UI',
  
  // Mobile-optimized component overrides
  components: {
    Header,
    Footer, // Hidden/minimal on mobile
  },
  
  // Mobile-specific section overrides
  sections: {
    Game, // Touch-optimized game interface
  },
  
  config: {
    enableSidebar: false, // No traditional sidebars on mobile
    headerStyle: 'fixed', // Fixed header for mobile
    footerStyle: 'hidden', // Footer hidden in favor of bottom nav
    maxWidth: '100%', // Full width on mobile
    spacing: 'compact', // Tighter spacing for mobile screens
  },
}