import { 
  Header, 
  Footer, 
  UserProfile, 
  JackpotPage,
  BonusPage,
  LeaderboardPage,
  SelectTokenPage,
  DGHRTTokenPage,
  AboutMePage,
  FairnessAuditPage,
  ChangelogPage,
  AdminPage,
  DGHRTPresalePage,
  PropagationPage
} from './index'
import { LayoutTheme } from '../index'
import Terms from './Terms'
import HolyGrailGame from './Game'

export const holyGrailTheme: LayoutTheme = {
  id: 'holy-grail',
  name: 'Holy Grail Layout',
  description: 'A mystical casino experience with the legendary Holy Grail CSS Grid layout featuring fixed header, footer, and elegant three-column design',
  
  // The main layout wrapper component
  components: {
    Header,
    Footer,
  },
  
  // Section overrides for custom game experience
  sections: {
    Game: HolyGrailGame,
    UserProfile,
  },
  
  // Page overrides for routes
  pages: {
    TermsPage: Terms,
    JackpotPage,
    BonusPage,
    LeaderboardPage,
    SelectTokenPage,
    DGHRTTokenPage,
    AboutMePage,
    FairnessAuditPage,
    ChangelogPage,
    AdminPage,
    DGHRTPresalePage,
    PropagationPage,
  },
  
  config: {
    enableSidebar: true,
    headerStyle: 'fixed',
    footerStyle: 'fixed',
    maxWidth: '100%',
    spacing: 'normal',
  },
}
