import { LayoutTheme } from '../index';
import { Header, Footer, Game, LeftSidebar } from './index';
import { Dashboard } from './Dashboard';
import TOSModal from './components/TOSModal';
import SessionWidgetModal from './components/SessionWidgetModal';
import React from 'react';

// Lazy load themed pages
const MobileAppPage = React.lazy(() => import('./pages/MobileAppPage'));

export const degenHeartTheme: LayoutTheme = {
  id: 'degenheart',
  name: 'Degen Heart',
  description: '3-Column layout',

  // The main layout wrapper component
  components: {
    Header,
    Footer,
    Sidebar: LeftSidebar,
    TOSModal,
    SessionWidgetModal,
  },

  // Sections with themed overrides
  sections: {
    Dashboard,
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
};
