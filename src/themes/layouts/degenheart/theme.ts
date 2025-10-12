import { LayoutTheme } from '../index';
import { Header, Footer, Game, LeftSidebar } from './index';
import { Dashboard } from './Dashboard';
import React from 'react';

// Lazy load themed pages
const MobileAppPage = React.lazy(() => import('./pages/MobileAppPage'));

export const degenHeartTheme: LayoutTheme = {
  id: 'degenheart',
  name: 'DegenHeart New',
  description: '3-Column layout',

  // The main layout wrapper component
  components: {
    Header,
    Footer,
    Sidebar: LeftSidebar,
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
