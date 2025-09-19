import { LayoutTheme } from '../index'
import { Header } from './index'
import { Footer } from './index'

export const holyGrailTheme: LayoutTheme = {
  id: 'holy-grail',
  name: 'Holy Grail Layout',
  description: 'A mystical casino experience with the legendary Holy Grail CSS Grid layout featuring fixed header, footer, and elegant three-column design',
  
  // The main layout wrapper component
  components: {
    Header,
    Footer,
  },
  
  config: {
    enableSidebar: true,
    headerStyle: 'fixed',
    footerStyle: 'fixed',
    maxWidth: '100%',
    spacing: 'normal',
  },
}
