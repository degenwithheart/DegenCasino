import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '../sections/Dashboard/Dashboard';
import { useTheme } from '../themes/UnifiedThemeContext';

// Lazy load non-critical pages
const AboutMe = lazy(() => import('../sections/Dashboard/AboutMe/AboutMe'));
const TermsPage = lazy(() => import('../sections/Dashboard/Terms/Terms'));
const Whitepaper = lazy(() => import('../sections/Dashboard/Whitepaper/Whitepaper'));
const DGHRTToken = lazy(() => import('../sections/DGHRTToken/DGHRTToken'));
const DGHRTPresale = lazy(() => import('../sections/DGHRTPresale/DGHRTPresale'));
const FairnessAudit = lazy(() => import('../sections/FairnessAudit/FairnessAudit'));
const UserProfile = lazy(() => import('../sections/UserProfile/UserProfile'));

// Lazy load pages and components
const Propagation = lazy(() => import('../pages/system/propagation'));
const ChangelogPage = lazy(() => import('../pages/system/ChangelogPage'));

// Lazy load feature pages
const JackpotPage = lazy(() => import('../pages/features/JackpotPage'));
const LeaderboardPage = lazy(() => import('../pages/features/LeaderboardPage'));
const SelectTokenPage = lazy(() => import('../pages/features/SelectTokenPage'));
const BonusPage = lazy(() => import('../pages/features/BonusPage'));
const AdminPage = lazy(() => import('../pages/system/AdminPage'));

// Import components directly since they're already available
import { Transaction, PlayerView, PlatformView, ExplorerIndex } from '../components';

/**
 * Universal route definitions used by all themes
 * This ensures routes only need to be defined once
 */
export function AppRoutes() {
  const { resolveComponent } = useTheme();
  
  // Resolve theme-specific components or fall back to defaults
  const DashboardComponent = resolveComponent('sections', 'Dashboard') || Dashboard;
  const GameComponent = resolveComponent('sections', 'Game') || lazy(() => import('../sections/Game/Game'));

  return (
    <Routes>
      <Route path="/" element={<DashboardComponent />} />
      <Route path="/jackpot" element={<JackpotPage />} />
      <Route path="/bonus" element={<BonusPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/select-token" element={<SelectTokenPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/whitepaper" element={<Whitepaper />} />
      <Route path="/token" element={<DGHRTToken />} />
      <Route path="/presale" element={<DGHRTPresale />} />
      <Route path="/aboutme" element={<AboutMe />} />
      <Route path="/audit" element={<FairnessAudit />} />
      <Route path="/changelog" element={<ChangelogPage />} />
      <Route path="/propagation" element={<Propagation />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/explorer" element={<ExplorerIndex />} />
      <Route path="/explorer/platform/:creator" element={<PlatformView />} />
      <Route path="/explorer/player/:address" element={<PlayerView />} />
      <Route path="/explorer/transaction/:txId" element={<Transaction />} />
      <Route path="/:wallet/profile" element={<UserProfile />} />
      <Route path="/game/:wallet/:gameId" element={<GameComponent />} />
    </Routes>
  );
}