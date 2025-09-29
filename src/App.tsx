import React, { useEffect, useState, Suspense, lazy, useMemo } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useTransactionError } from 'gamba-react-v2';
import { Modal, TOSModal } from './components';
import RouterErrorBoundary from './components/RouterErrorBoundary';
import { RouteTransitionWrapper, RouteLoadingSpinner } from './components/RouteTransitionWrapper';
import { ComprehensiveErrorBoundary, SafeSuspense, WindowErrorHandler } from './components/ErrorBoundaries';
import { ErrorBoundaryWrapper } from './utils/errorBoundaryUtils';
import { ENABLE_TROLLBOX, FEATURE_FLAGS } from './constants';
import { useToast } from './hooks/ui/useToast';
import { useWalletToast } from './utils/wallet/solanaWalletToast';
import { useUserStore } from './hooks/data/useUserStore';
import { useServiceWorker, preloadCriticalAssets } from './hooks/system/useServiceWorker';
import { useComponentPreloader } from './hooks/system/useComponentPreloader';
import { useProgressiveLoadingManager } from './hooks/system/useProgressiveLoadingManager';
import { ProgressiveLoadingProvider } from './hooks/system/useProgressiveLoading';
import { useRouteChangeHandler, addRouteTransitionCSS } from './hooks/system/useRouteChangeHandler';
import { Dashboard } from './sections/Dashboard/Dashboard';
import { GamesModalContext } from './contexts/GamesModalContext';
// Lazy load non-critical pages
const AboutMe = lazy(() => import('./sections/Dashboard/AboutMe/AboutMe'));
const TermsPage = lazy(() => import('./sections/Dashboard/Terms/Terms'));
const Whitepaper = lazy(() => import('./sections/Dashboard/Whitepaper/Whitepaper'));
const Credits = lazy(() => import('./sections/Dashboard/Credits/Credits'));
const DGHRTToken = lazy(() => import('./sections/DGHRTToken/DGHRTToken'));
const DGHRTPresale = lazy(() => import('./sections/DGHRTPresale/DGHRTPresale'));
const FairnessAudit = lazy(() => import('./sections/FairnessAudit/FairnessAudit'));
const UserProfile = lazy(() => import('./sections/UserProfile/UserProfile'));
const DegenMobileUserProfile = lazy(() => import('./themes/layouts/degen-mobile/components/UserProfile'));
const Game = lazy(() => import('./sections/Game/Game'));
import Header from './sections/Header';
import { AllGamesModal, TrollBox, Sidebar, Transaction, EmbeddedTransaction, PlayerView, CacheDebugWrapper, PlatformView, ExplorerIndex, GraphicsProvider } from './components';
import { ProgressiveLoadingMonitor } from './components/Debug/ProgressiveLoadingMonitor';
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
import { useTheme } from './themes/UnifiedThemeContext';

// Loading component for lazy-loaded routes
const SIDEBAR_WIDTH = 80;

// Theme-aware content component that renders based on current layout theme
function AppContent({ autoConnectAttempted }: { autoConnectAttempted: boolean }) {
  const { connected } = useWallet();
  const location = useLocation();
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
  
  // Resolve theme-specific pages or fall back to defaults
  const JackpotPageComponent = resolveComponent('pages', 'JackpotPage') || JackpotPage;
  const BonusPageComponent = resolveComponent('pages', 'BonusPage') || BonusPage;
  const LeaderboardPageComponent = resolveComponent('pages', 'LeaderboardPage') || LeaderboardPage;
  const SelectTokenPageComponent = resolveComponent('pages', 'SelectTokenPage') || SelectTokenPage;

  // Check if this is a themed layout that uses a layout wrapper
  const isDegenHeartTheme = currentLayoutTheme.id === 'degenheart';
  const isDegenMobileTheme = currentLayoutTheme.id === 'degen-mobile';
  
  // Conditionally use themed Modal components
  const ModalComponent = isDegenHeartTheme 
    ? React.lazy(() => import('./themes/layouts/degenheart/components/Modal').then(m => ({ default: m.Modal })))
    : Modal;

  // For DegenHeart theme, wrap everything in the DegenHeart layout
  if (isDegenHeartTheme) {
    // Import the DegenHeart layout dynamically
    const DegenHeartLayout = React.lazy(() => import('./themes/layouts/degenheart/DegenHeartLayout'));
    
    return (
      <RouterErrorBoundary key={`degenheart-${location.pathname}`}>
        <RouteTransitionWrapper fallback={<RouteLoadingSpinner />}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <DegenHeartLayout>
            <Toasts />
            <DevnetWarning />
            <Routes>
              <Route path="/" element={<DashboardComponent />} />
              <Route path="/jackpot" element={<SafeSuspense level="route" componentName="Jackpot Page"><JackpotPageComponent /></SafeSuspense>} />
              <Route path="/bonus" element={<SafeSuspense level="route" componentName="Bonus Page"><BonusPageComponent /></SafeSuspense>} />
              <Route path="/leaderboard" element={<SafeSuspense level="route" componentName="Leaderboard Page"><LeaderboardPageComponent /></SafeSuspense>} />
              <Route path="/select-token" element={<SafeSuspense level="route" componentName="Select Token Page"><SelectTokenPageComponent /></SafeSuspense>} />
              <Route path="/terms" element={<SafeSuspense level="route" componentName="Terms Page"><TermsPage /></SafeSuspense>} />
              <Route path="/whitepaper" element={<SafeSuspense level="route" componentName="Whitepaper Page"><Whitepaper /></SafeSuspense>} />
              <Route path="/credits" element={<SafeSuspense level="route" componentName="Credits Page"><Credits /></SafeSuspense>} />
              <Route path="/token" element={<SafeSuspense level="route" componentName="DGHRT Token Page"><DGHRTToken /></SafeSuspense>} />
              <Route path="/presale" element={<SafeSuspense level="route" componentName="DGHRT Presale Page"><DGHRTPresale /></SafeSuspense>} />
              <Route path="/aboutme" element={<SafeSuspense level="route" componentName="About Me Page"><AboutMe /></SafeSuspense>} />
              <Route path="/audit" element={<SafeSuspense level="route" componentName="Fairness Audit Page"><FairnessAudit /></SafeSuspense>} />
              <Route path="/changelog" element={<SafeSuspense level="route" componentName="Changelog Page"><ChangelogPage /></SafeSuspense>} />
              <Route path="/propagation" element={<SafeSuspense level="route" componentName="Propagation Page"><Propagation /></SafeSuspense>} />
              <Route path="/admin" element={<SafeSuspense level="route" componentName="Admin Page"><AdminPage /></SafeSuspense>} />
              <Route path="/explorer" element={<ErrorBoundaryWrapper level="route" componentName="Explorer"><ExplorerIndex /></ErrorBoundaryWrapper>} />
              <Route path="/explorer/platform/:creator" element={<ErrorBoundaryWrapper level="route" componentName="Platform View"><PlatformView /></ErrorBoundaryWrapper>} />
              <Route path="/explorer/player/:address" element={<ErrorBoundaryWrapper level="route" componentName="Player View"><PlayerView /></ErrorBoundaryWrapper>} />
              <Route path="/explorer/transaction/:txId" element={<ErrorBoundaryWrapper level="route" componentName="Transaction View"><Transaction /></ErrorBoundaryWrapper>} />
              <Route path="/:wallet/profile" element={<SafeSuspense level="route" componentName="User Profile Page"><UserProfile /></SafeSuspense>} />
              <Route path="/game/:wallet/:gameId" element={<SafeSuspense level="route" componentName="Game Page"><GameComponent /></SafeSuspense>} />
            </Routes>
            {ENABLE_TROLLBOX && connected && <TrollBox />}
            </DegenHeartLayout>
          </Suspense>
        </RouteTransitionWrapper>
      </RouterErrorBoundary>
    );
  }

  // For DegenMobile theme, wrap everything in the DegenMobile layout
  if (isDegenMobileTheme) {
    // Import the DegenMobile layout dynamically
    const DegenMobileLayout = React.lazy(() => import('./themes/layouts/degen-mobile/DegenMobileLayout'));
    
    return (
      <RouterErrorBoundary key={`degen-mobile-${location.pathname}`}>
        <RouteTransitionWrapper fallback={<RouteLoadingSpinner />}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <DegenMobileLayout>
            <Toasts />
            <DevnetWarning />
            <Routes>
              <Route path="/" element={<DashboardComponent />} />
              <Route path="/jackpot" element={<SafeSuspense level="route" componentName="Jackpot Page"><JackpotPageComponent /></SafeSuspense>} />
              <Route path="/bonus" element={<SafeSuspense level="route" componentName="Bonus Page"><BonusPageComponent /></SafeSuspense>} />
              <Route path="/leaderboard" element={<SafeSuspense level="route" componentName="Leaderboard Page"><LeaderboardPageComponent /></SafeSuspense>} />
              <Route path="/select-token" element={<SafeSuspense level="route" componentName="Select Token Page"><SelectTokenPageComponent /></SafeSuspense>} />
              <Route path="/terms" element={<SafeSuspense level="route" componentName="Terms Page"><TermsPage /></SafeSuspense>} />
              <Route path="/whitepaper" element={<SafeSuspense level="route" componentName="Whitepaper Page"><Whitepaper /></SafeSuspense>} />
              <Route path="/credits" element={<SafeSuspense level="route" componentName="Credits Page"><Credits /></SafeSuspense>} />
              <Route path="/token" element={<SafeSuspense level="route" componentName="DGHRT Token Page"><DGHRTToken /></SafeSuspense>} />
              <Route path="/presale" element={<SafeSuspense level="route" componentName="DGHRT Presale Page"><DGHRTPresale /></SafeSuspense>} />
              <Route path="/aboutme" element={<SafeSuspense level="route" componentName="About Me Page"><AboutMe /></SafeSuspense>} />
              <Route path="/audit" element={<SafeSuspense level="route" componentName="Fairness Audit Page"><FairnessAudit /></SafeSuspense>} />
              <Route path="/changelog" element={<SafeSuspense level="route" componentName="Changelog Page"><ChangelogPage /></SafeSuspense>} />
              <Route path="/propagation" element={<SafeSuspense level="route" componentName="Propagation Page"><Propagation /></SafeSuspense>} />
              <Route path="/admin" element={<SafeSuspense level="route" componentName="Admin Page"><AdminPage /></SafeSuspense>} />
              <Route path="/explorer" element={<ErrorBoundaryWrapper level="route" componentName="Explorer"><ExplorerIndex /></ErrorBoundaryWrapper>} />
              <Route path="/explorer/platform/:creator" element={<ErrorBoundaryWrapper level="route" componentName="Platform View"><PlatformView /></ErrorBoundaryWrapper>} />
              <Route path="/explorer/player/:address" element={<ErrorBoundaryWrapper level="route" componentName="Player View"><PlayerView /></ErrorBoundaryWrapper>} />
              <Route path="/explorer/transaction/:txId" element={<ErrorBoundaryWrapper level="route" componentName="Transaction View"><Transaction /></ErrorBoundaryWrapper>} />
              <Route path="/:wallet/profile" element={<SafeSuspense level="route" componentName="User Profile Page"><DegenMobileUserProfile /></SafeSuspense>} />
              <Route path="/game/:wallet/:gameId" element={<SafeSuspense level="route" componentName="Game Page"><GameComponent /></SafeSuspense>} />
            </Routes>
            {ENABLE_TROLLBOX && connected && <TrollBox />}
            </DegenMobileLayout>
          </Suspense>
        </RouteTransitionWrapper>
      </RouterErrorBoundary>
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
        <RouterErrorBoundary key={`default-${location.pathname}`}>
          <RouteTransitionWrapper fallback={<RouteLoadingSpinner />}>
            <SafeSuspense level="route" componentName="Route Content">
              <Routes>
              <Route path="/" element={<DashboardComponent />} />
              <Route path="/jackpot" element={<SafeSuspense level="route" componentName="Jackpot Page"><JackpotPageComponent /></SafeSuspense>} />
              <Route path="/bonus" element={<SafeSuspense level="route" componentName="Bonus Page"><BonusPageComponent /></SafeSuspense>} />
              <Route path="/leaderboard" element={<SafeSuspense level="route" componentName="Leaderboard Page"><LeaderboardPageComponent /></SafeSuspense>} />
              <Route path="/select-token" element={<SafeSuspense level="route" componentName="Select Token Page"><SelectTokenPageComponent /></SafeSuspense>} />
              <Route path="/terms" element={<SafeSuspense level="route" componentName="Terms Page"><TermsPage /></SafeSuspense>} />
              <Route path="/whitepaper" element={<SafeSuspense level="route" componentName="Whitepaper Page"><Whitepaper /></SafeSuspense>} />
              <Route path="/credits" element={<SafeSuspense level="route" componentName="Credits Page"><Credits /></SafeSuspense>} />
              <Route path="/token" element={<SafeSuspense level="route" componentName="DGHRT Token Page"><DGHRTToken /></SafeSuspense>} />
              <Route path="/presale" element={<SafeSuspense level="route" componentName="DGHRT Presale Page"><DGHRTPresale /></SafeSuspense>} />
              <Route path="/aboutme" element={<SafeSuspense level="route" componentName="About Me Page"><AboutMe /></SafeSuspense>} />
              <Route path="/audit" element={<SafeSuspense level="route" componentName="Fairness Audit Page"><FairnessAudit /></SafeSuspense>} />
              <Route path="/changelog" element={<SafeSuspense level="route" componentName="Changelog Page"><ChangelogPage /></SafeSuspense>} />
              <Route path="/propagation" element={<SafeSuspense level="route" componentName="Propagation Page"><Propagation /></SafeSuspense>} />
              <Route path="/admin" element={<SafeSuspense level="route" componentName="Admin Page"><AdminPage /></SafeSuspense>} />
              <Route path="/explorer" element={<ErrorBoundaryWrapper level="route" componentName="Explorer"><ExplorerIndex /></ErrorBoundaryWrapper>} />
              <Route path="/explorer/platform/:creator" element={<ErrorBoundaryWrapper level="route" componentName="Platform View"><PlatformView /></ErrorBoundaryWrapper>} />
              <Route path="/explorer/player/:address" element={<ErrorBoundaryWrapper level="route" componentName="Player View"><PlayerView /></ErrorBoundaryWrapper>} />
              <Route path="/explorer/transaction/:txId" element={<ErrorBoundaryWrapper level="route" componentName="Transaction View"><Transaction /></ErrorBoundaryWrapper>} />
              <Route path="/:wallet/profile" element={<SafeSuspense level="route" componentName="User Profile Page"><UserProfile /></SafeSuspense>} />
              <Route path="/game/:wallet/:gameId" element={<SafeSuspense level="route" componentName="Game Page"><GameComponent /></SafeSuspense>} />
              </Routes>
            </SafeSuspense>
          </RouteTransitionWrapper>
        </RouterErrorBoundary>
      </MainContent>
      <FooterComponent />
      {ENABLE_TROLLBOX && connected && <TrollBox />}
    </>
  );
}

const LoadingSpinner = () => {
  const [showSlowMessage, setShowSlowMessage] = useState(false);
  const [showHomeButton, setShowHomeButton] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Reset states on location change
    setShowSlowMessage(false);
    setShowHomeButton(false);
    
    // Show slow loading message after 3 seconds (reduced from 5)
    const slowTimer = setTimeout(() => setShowSlowMessage(true), 3000);
    
    // Show home button after 8 seconds (reduced from 15)
    const homeTimer = setTimeout(() => setShowHomeButton(true), 8000);
    
    return () => {
      clearTimeout(slowTimer);
      clearTimeout(homeTimer);
    };
  }, [location.pathname]);

  return (
    <>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        color: '#FF5555',
        zIndex: 9999,
        backgroundColor: 'rgba(24, 24, 24, 0.95)',
        backdropFilter: 'blur(20px)'
      }}>
        {/* Logo above Loading text */}
        <img 
          src="/png/images/logo.png" 
          alt="DegenHeart Casino" 
          style={{ 
            width: '250px', 
            height: '250px', 
            marginBottom: '16px',
            animation: 'loadingPulse 2s infinite'
          }} 
        />
        
        <div style={{ fontSize: '18px', fontWeight: '500' }}>Loading...</div>
      </div>
      
      {/* Slow loading message - bottom right after 5 seconds */}
      {showSlowMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(255, 85, 85, 0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}>
          This is taking longer than usual...
        </div>
      )}
      
      {/* Home button message after 15 seconds */}
      {showHomeButton && (
        <div 
          style={{
            position: 'fixed',
            bottom: showSlowMessage ? '70px' : '20px',
            right: '20px',
            background: 'rgba(255, 85, 85, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            zIndex: 1000,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease',
            userSelect: 'none'
          }}
          onClick={() => navigate('/')}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 85, 85, 1)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 85, 85, 0.9)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          🏠 Go Home
        </div>
      )}
      
      <style>{`
        @keyframes loadingPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
      `}</style>
    </>
  );
};

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

  // Initialize progressive loading system
  useServiceWorker();
  useComponentPreloader();
  useRouteChangeHandler();
  const { preloadGameOnHover, getPerformanceStats, isProgressiveLoadingActive } = useProgressiveLoadingManager();
  
  useEffect(() => {
    // Preload critical assets for better performance
    preloadCriticalAssets();
    
    // Add route transition CSS
    addRouteTransitionCSS();
  }, []);

  return (
    <ErrorBoundaryWrapper level="app" componentName="DegenHeart Casino App">
      <ProgressiveLoadingProvider value={{ preloadGameOnHover, getPerformanceStats, isProgressiveLoadingActive }}>
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
          {FEATURE_FLAGS.USE_COMPREHENSIVE_ERROR_SYSTEM && <WindowErrorHandler />}
          <AppContent autoConnectAttempted={autoConnectAttempted} />
          <CacheDebugWrapper />
          <ProgressiveLoadingMonitor />
        </GamesModalContext.Provider>
        </GraphicsProvider>
      </ProgressiveLoadingProvider>
    </ErrorBoundaryWrapper>
  );
}