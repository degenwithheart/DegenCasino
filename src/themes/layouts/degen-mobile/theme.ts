import { LayoutTheme } from '../index'
import { Header, Footer, Game, Dashboard } from './index'
import JackpotPageComponent from './pages/JackpotPage'
import BonusPageComponent from './pages/BonusPage'
import LeaderboardPageComponent from './pages/LeaderboardPage'
import SelectTokenPageComponent from './pages/SelectTokenPage'
import AdminPage from './pages/AdminPage'
import TermsPage from './pages/TermsPage'
import Whitepaper from './pages/WhitepaperPage'
import GameComponent from './pages/GamePage'

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
    Game: GameComponent, // Full game page component, not just layout wrapper
    Dashboard, // Mobile-optimized dashboard
  },

  // Mobile-specific pages with TikTok/Instagram styling
  pages: {
    JackpotPage: JackpotPageComponent,
    BonusPage: BonusPageComponent,
    LeaderboardPage: LeaderboardPageComponent,
    SelectTokenPage: SelectTokenPageComponent,
    AdminPage: AdminPage,
    TermsPage: TermsPage,
    WhitepaperPage: Whitepaper,
    AllGamesPage: GameComponent,
  },
  
  config: {
    enableSidebar: false, // No traditional sidebars on mobile
    headerStyle: 'fixed', // Fixed header for mobile
    footerStyle: 'hidden', // Footer hidden in favor of bottom nav
    maxWidth: '100%', // Full width on mobile
    spacing: 'compact', // Tighter spacing for mobile screens
  },
}