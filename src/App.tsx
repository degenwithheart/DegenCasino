import React, { useEffect, useState, Suspense, lazy, useMemo } from 'react';
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
import { useRouteRefresh } from './hooks/system/useRouteRefresh';
import { RouterErrorBoundary } from './components/RouterErrorBoundary';
import { NavigationDebugger, NavigationForcer } from './components/NavigationDebugger';
import { Dashboard, GamesModalContext } from './sections/Dashboard/Dashboard';
// Lazy load non-critical pages
const AboutMe = lazy(() => import('./sections/Dashboard/AboutMe/AboutMe'));
const TermsPage = lazy(() => import('./sections/Dashboard/Terms/Terms'));
const Whitepaper = lazy(() => import('./sections/Dashboard/Whitepaper/Whitepaper'));
const Credits = lazy(() => import('./sections/Dashboard/Credits/Credits'));
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

  // Force re-render when route changes using custom hook
  const renderKey = useRouteRefresh();

  // Memoize theme components to prevent unnecessary re-creation
  const themeComponents = useMemo(() => ({
    HeaderComponent: resolveComponent('components', 'Header') || Header,
    FooterComponent: resolveComponent('components', 'Footer') || Footer,
    DashboardComponent: resolveComponent('sections', 'Dashboard') || Dashboard,
    GameComponent: resolveComponent('sections', 'Game') || React.lazy(() => import('./sections/Game/Game')),
  }), [resolveComponent, currentLayoutTheme.id]);

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
      <div key={renderKey}>
        <Suspense fallback={<LoadingSpinner />}>
          <DegenHeartLayout>
            <Toasts />
            <DevnetWarning />
            <RouterErrorBoundary>
              <Routes>
                <Route path="/" element={<themeComponents.DashboardComponent />} />
                <Route path="/jackpot" element={<JackpotPage />} />
                <Route path="/bonus" element={<BonusPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/select-token" element={<SelectTokenPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/whitepaper" element={<Whitepaper />} />
                <Route path="/credits" element={<Credits />} />
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
                <Route path="/game/:wallet/:gameId" element={<themeComponents.GameComponent />} />
              </Routes>
            </RouterErrorBoundary>
            {ENABLE_TROLLBOX && connected && <TrollBox />}
          </DegenHeartLayout>
        </Suspense>
      </div>
    );
  }

  // For default theme, use the traditional layout structure
  return (
    <div key={renderKey}>
      <themeComponents.HeaderComponent />
      <Sidebar />
      <MainContent>
        <Toasts />
        <DevnetWarning />
        {/* Only show WelcomeBanner after auto-connect attempt */}
        {autoConnectAttempted && !connected && <WelcomeBanner />}
        <Suspense fallback={<LoadingSpinner />}>
          <RouterErrorBoundary>
            <Routes>
              <Route path="/" element={<themeComponents.DashboardComponent />} />
              <Route path="/jackpot" element={<JackpotPage />} />
              <Route path="/bonus" element={<BonusPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/select-token" element={<SelectTokenPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/whitepaper" element={<Whitepaper />} />
              <Route path="/credits" element={<Credits />} />
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
              <Route path="/game/:wallet/:gameId" element={<themeComponents.GameComponent />} />
            </Routes>
          </RouterErrorBoundary>
        </Suspense>
      </MainContent>
      <themeComponents.FooterComponent />
      {ENABLE_TROLLBOX && connected && <TrollBox />}
    </div>
  );
}

const LoadingSpinner = () => {
  const [showSlowMessage, setShowSlowMessage] = useState(false);
  const [showHomeButton, setShowHomeButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show slow loading message after 5 seconds
    const slowTimer = setTimeout(() => setShowSlowMessage(true), 5000);
    
    // Show home button after 15 seconds
    const homeTimer = setTimeout(() => setShowHomeButton(true), 15000);
    
    return () => {
      clearTimeout(slowTimer);
      clearTimeout(homeTimer);
    };
  }, [navigate]);

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
  useEffect(() => {
    // Scroll to top and force re-render on route change
    window.scrollTo(0, 0);
    // Force component re-render by triggering a small state change
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('route-changed', { detail: { pathname } }));
    }, 100);
  }, [pathname]);
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
        <NavigationDebugger />
        <NavigationForcer />
        <ErrorHandler />
        <AppContent autoConnectAttempted={autoConnectAttempted} />
        <CacheDebugWrapper />
      </GamesModalContext.Provider>
      </GraphicsProvider>
    </UnifiedThemeProvider>
  );
}