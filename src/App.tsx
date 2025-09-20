import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useTransactionError } from 'gamba-react-v2';
import { Modal, TOSModal } from './components';
import { ENABLE_TROLLBOX } from './constants';
import { useToast } from './hooks/ui/useToast';
import { useWalletToast } from './utils/wallet/solanaWalletToast';
import { useUserStore } from './hooks/data/useUserStore';
import { useServiceWorker, preloadCriticalAssets } from './hooks/system/useServiceWorker';
import { Dashboard, GamesModalContext } from './sections/Dashboard/Dashboard';
// Lazy load non-critical pages
const AboutMe = lazy(() => import('./sections/Dashboard/AboutMe/AboutMe'));
const TermsPage = lazy(() => import('./sections/Dashboard/Terms/Terms'));
const Whitepaper = lazy(() => import('./sections/Dashboard/Whitepaper/Whitepaper'));
const DGHRTToken = lazy(() => import('./sections/DGHRTToken/DGHRTToken'));
const DGHRTPresale = lazy(() => import('./sections/DGHRTPresale/DGHRTPresale'));
const FairnessAudit = lazy(() => import('./sections/FairnessAudit/FairnessAudit'));
const UserProfile = lazy(() => import('./sections/UserProfile/UserProfile'));
const Game = lazy(() => import('./sections/Game/Game'));
import Header from './sections/Header';
import { AllGamesModal, TrollBox, Sidebar, Transaction, EmbeddedTransaction, PlayerView, CacheDebugWrapper, PlatformView, ExplorerIndex, GraphicsProvider } from './components';
import Toasts from './sections/Toasts';
import Footer from './sections/Footer';
import styled from 'styled-components';
import DevnetWarning from './components/Network/DevnetWarning';
// Lazy load pages and components
const Propagation = lazy(() => import('./pages/system/propagation'));
const ChangelogPage = lazy(() => import('./pages/system/ChangelogPage'));
// Lazy load pages
const JackpotPage = lazy(() => import('./pages/features/JackpotPage'));
const LeaderboardPage = lazy(() => import('./pages/features/LeaderboardPage'));
const SelectTokenPage = lazy(() => import('./pages/features/SelectTokenPage'));
const BonusPage = lazy(() => import('./pages/features/BonusPage'));
const AdminPage = lazy(() => import('./pages/system/AdminPage'));
import { UnifiedThemeProvider, useTheme } from './themes/UnifiedThemeContext';

// Loading component for lazy-loaded routes
const SIDEBAR_WIDTH = 80;

// Theme-aware content component that renders based on current layout theme
function AppContent({ autoConnectAttempted }: { autoConnectAttempted: boolean }) {
  const { connected } = useWallet();
  const { 
    currentLayoutTheme, 
    resolveComponent 
  } = useTheme();

  // Resolve theme-specific components or fall back to defaults
  const HeaderComponent = resolveComponent('components', 'Header') || Header;
  const FooterComponent = resolveComponent('components', 'Footer') || Footer;
  const DashboardComponent = resolveComponent('sections', 'Dashboard') || Dashboard;
  
  // Resolve Game component through theme system (falls back to default if no themed version)
  const GameComponent = resolveComponent('sections', 'Game') || React.lazy(() => import('./sections/Game/Game'));

  // Check if this is a Holy Grail theme that uses a layout wrapper
  const isDegenHeartTheme = currentLayoutTheme.id === 'degenheart';
  
  // Conditionally use degen Modal for degen theme
  const ModalComponent = isDegenHeartTheme 
    ? React.lazy(() => import('./themes/layouts/degenheart/components/Modal').then(m => ({ default: m.Modal })))
    : Modal;

  // For DegenHeart theme, wrap everything in the DegenHeart layout
  if (isDegenHeartTheme) {
    // Import the DegenHeart layout dynamically
    const DegenHeartLayout = React.lazy(() => import('./themes/layouts/degenheart/DegenHeartLayout'));
    
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <DegenHeartLayout>
          <Toasts />
          <DevnetWarning />
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
          {ENABLE_TROLLBOX && connected && <TrollBox />}
        </DegenHeartLayout>
      </Suspense>
    );
  }

  // For default theme, use the traditional layout structure
  return (
    <>
      <HeaderComponent />
      <Sidebar />
      <MainContent>
        <Toasts />
        <DevnetWarning />
        {/* Only show WelcomeBanner after auto-connect attempt */}
        {autoConnectAttempted && !connected && <WelcomeBanner />}
        <Suspense fallback={<LoadingSpinner />}>
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
        </Suspense>
      </MainContent>
      <FooterComponent />
      {ENABLE_TROLLBOX && connected && <TrollBox />}
    </>
  );
}

const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px',
    color: '#FF5555'
  }}>
    <div>Loading...</div>
  </div>
);

const MainContent = styled.main`
  /* Mobile-first approach with dynamic viewport height */
  min-height: calc(100vh - 120px);
  min-height: calc(100dvh - 120px);
  padding-top: 1rem;
  padding-left: ${SIDEBAR_WIDTH}px;
  padding-right: 0;
  padding-bottom: 80px;
  transition: padding 0.3s ease;
  
  /* Mobile devices - no sidebar, adjusted padding */
  @media (max-width: 900px) {
    padding-left: 0;
    padding-bottom: 60px;
    min-height: calc(100vh - 100px);
    min-height: calc(100dvh - 100px);
  }
  
  /* Small mobile devices - even less padding */
  @media (max-width: 700px) {
    padding-left: 0;
    padding-bottom: 60px;
    padding-top: 0.5rem;
    min-height: calc(100vh - 80px);
    min-height: calc(100dvh - 80px);
  }
  
  /* Very small mobile devices */
  @media (max-width: 479px) {
    padding-bottom: 50px;
    padding-top: 0.25rem;
    min-height: calc(100vh - 60px);
    min-height: calc(100dvh - 60px);
  }
`;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function ErrorHandler() {
  const walletModal = useWalletModal();
  const { showTransactionError } = useWalletToast();
  
  useTransactionError((err) => {
    if (err.message === 'NOT_CONNECTED') {
      walletModal.setVisible(true);
    } else {
      showTransactionError(err);
    }
  });
  return null;
}

function WelcomeBanner() {
  const wallet = useWallet();
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false);

  useEffect(() => {
    if (!wallet.connecting) {
      setAutoConnectAttempted(true);
    }
  }, [wallet.connecting]);

  const isLoading = !autoConnectAttempted || wallet.connecting;

  if (!isLoading) return null;

}

export default function App() {
  const newcomer = useUserStore((s) => s.newcomer);
  const set = useUserStore((s) => s.set);
  const { connected, connecting } = useWallet();
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false);
  const [showGamesModal, setShowGamesModal] = useState(false);

  // Anti-debugging protection (will be obfuscated)
  useEffect(() => {
    if (import.meta.env.MODE === 'production') {
      const devtools = { open: false, orientation: null };
      setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
          if (!devtools.open) {
            devtools.open = true;
            console.clear();
          }
        } else {
          devtools.open = false;
        }
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (!connecting) {
      setAutoConnectAttempted(true);
    }
  }, [connecting]);

  useEffect(() => {
    const handler = () => setShowGamesModal(true);
    window.addEventListener('openGamesModal', handler);
    return () => window.removeEventListener('openGamesModal', handler);
  }, []);

  // Initialize service worker
  useServiceWorker();
  
  useEffect(() => {
    // Preload critical assets for better performance
    preloadCriticalAssets();
  }, []);

  return (
    <UnifiedThemeProvider>
      <GraphicsProvider>
        <GamesModalContext.Provider value={{ openGamesModal: () => setShowGamesModal(true) }}>
          {showGamesModal && (
            <Modal onClose={() => setShowGamesModal(false)}>
              <AllGamesModal onGameClick={() => setShowGamesModal(false)} />
            </Modal>
          )}
        {newcomer && (
          <TOSModal 
            onClose={() => set({ newcomer: false })}
            onAccept={() => set({ newcomer: false })}
          />
        )}
        <ScrollToTop />
        <ErrorHandler />
        <AppContent autoConnectAttempted={autoConnectAttempted} />
        <CacheDebugWrapper />
      </GamesModalContext.Provider>
      </GraphicsProvider>
    </UnifiedThemeProvider>
  );
}