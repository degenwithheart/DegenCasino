import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { heuristicPrefetch, preloadAssets, scheduleFontSubsetPreload, scheduleNetworkIdlePrefetch, setPrefetchUserOverride } from './hooks/usePrefetch';
import { useWallet } from '@solana/wallet-adapter-react';
import AdaptiveFpsOverlay from './components/Dev/AdaptiveFpsOverlay';
import { startRafScheduler } from './utils/rafScheduler';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useTransactionError } from 'gamba-react-v2';
// Keep only absolutely critical items in the initial bundle. Everything else is lazy.
import { Modal } from './components';
import { TOS_HTML, ENABLE_TROLLBOX } from './constants';
import { useToast } from './hooks/useToast';
import { useWalletToast } from './utils/solanaWalletToast';
import { useUserStore } from './hooks/useUserStore';
import { useServiceWorker, preloadCriticalAssets, warmCacheDeferred } from './hooks/useServiceWorker';
import { Dashboard, GamesModalContext } from './sections/Dashboard/Dashboard';
// Route/page level code-splitting (non-critical):
const AboutMe = lazy(() => import('./sections/Dashboard/AboutMe/AboutMe'));
const TermsPage = lazy(() => import('./sections/Dashboard/Terms/Terms'));
const Whitepaper = lazy(() => import('./sections/Dashboard/Whitepaper/Whitepaper'));
const FairnessAudit = lazy(() => import('./sections/FairnessAudit/FairnessAudit'));
const UserProfile = lazy(() => import('./sections/UserProfile/UserProfile'));
const Game = lazy(() => import('./sections/Game/Game'));
// Pages (already separate):
const Propagation = lazy(() => import('./pages/propagation'));
const JackpotPage = lazy(() => import('./pages/JackpotPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const SelectTokenPage = lazy(() => import('./pages/SelectTokenPage'));
const BonusPage = lazy(() => import('./pages/BonusPage'));

// Heavy / infrequently used components now lazy:
const ExplorerIndex = lazy(() => import('./components/Explorer/ExplorerIndex'));
// These modules use named exports; map them to default for React.lazy
const PlatformView = lazy(() => import('./components/Platform/PlatformView').then((m: any) => ({default: m.PlatformView})));
const PlayerView = lazy(() => import('./components/Platform/PlayerView').then((m: any) => ({default: m.PlayerView})));
const Transaction = lazy(() => import('./components/Transaction/Transaction'));
const AllGamesModal = lazy(() => import('./components/AllGamesModal/AllGamesModal'));
const TrollBox = lazy(() => import('./components/UI/TrollBox'));
const Sidebar = lazy(() => import('./components/UI/Sidebar'));
const CacheDebugWrapper = lazy(() => import('./components/Cache/CacheDebugPanel').then(m => ({default: m.CacheDebugWrapper || (()=>null)})));
const GraphicsProvider = lazy(() => import('./components/Game/GameScreenFrame').then(m => ({default: m.GraphicsProvider})));
const EmbeddedTransaction = lazy(() => import('./components/Transaction/EmbeddedTransaction'));
// Critical always-visible header stays eager (kept small) to avoid layout shift.
import Header from './sections/Header';
// Toasts small enough to keep inline.
import Toasts from './sections/Toasts';
import { TosInner, TosWrapper } from './styles';
import Footer from './sections/Footer';
import styled from 'styled-components';
import { ThemeProvider } from './themes/ThemeContext';

// Loading component for lazy-loaded routes
const SIDEBAR_WIDTH = 80;

const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '140px',
    color: '#FF5555',
    fontSize: '0.9rem',
    opacity: 0.9,
  }}>Loading...</div>
);

// Reusable Suspense boundary helper
const Boundary: React.FC<{children: React.ReactNode, fallbackSize?: number}> = ({ children, fallbackSize }) => (
  <Suspense fallback={<div style={{height: fallbackSize || 120}}><LoadingSpinner /></div>}>
    {children}
  </Suspense>
);

const MainContent = styled.main`
  min-height: calc(100vh - 140px);
  padding-top: 1rem;
  padding-left: ${SIDEBAR_WIDTH}px;
  padding-right: 0;
  padding-bottom: 80px;
  transition: padding 0.3s ease;
  @media (max-width: 900px) {
    padding-left: 0;
    padding-bottom: 80px;
  }
  @media (max-width: 700px) {
    padding-left: 0;
    padding-bottom: 80px;
  }
`;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    heuristicPrefetch(pathname);
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
  const dataSaver = useUserStore(s => s.dataSaver);
  const reduceMotion = useUserStore(s => !!s.reduceMotion);
  const lessGlow = useUserStore(s => !!s.lessGlow);
  const fontSlim = useUserStore(s => !!s.fontSlim);
  const backgroundThrottle = useUserStore(s => !!s.backgroundThrottle);
  const autoAdapt = useUserStore(s => !!s.autoAdapt);
  const setStore = useUserStore(s => s.set);
  // React to data saver toggle
  useEffect(() => {
    if (dataSaver) {
  startRafScheduler();
      setPrefetchUserOverride(false);
    } else {
      // null tells system to re-evaluate based on network conditions
      setPrefetchUserOverride(null as any);
    }
  }, [dataSaver]);

  // Anti-debugging protection (will be obfuscated)
  useEffect(() => {
    if (process.env.GAMBA_ENV === 'production') {
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

  // Apply body classes for global styling adjustments
  useEffect(() => {
    const cls = document.documentElement.classList;
    reduceMotion ? cls.add('reduce-motion') : cls.remove('reduce-motion');
    lessGlow ? cls.add('less-glow') : cls.remove('less-glow');
    fontSlim ? cls.add('font-slim') : cls.remove('font-slim');
  }, [reduceMotion, lessGlow, fontSlim]);

  // Background throttle: lower rAF driven loops by adding a class & custom event when hidden
  useEffect(() => {
    if (!backgroundThrottle) return;
    let hidden = false;
    const handleVis = () => {
      hidden = document.visibilityState === 'hidden';
      if (hidden) {
        document.documentElement.classList.add('bg-throttled');
      } else {
        document.documentElement.classList.remove('bg-throttled');
      }
      window.dispatchEvent(new CustomEvent('app:visibility-change', { detail: { hidden } }));
    };
    document.addEventListener('visibilitychange', handleVis);
    handleVis();
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, [backgroundThrottle]);

  // Auto adapt: monitor network & memory, toggle reduceMotion / lessGlow when constrained
  useEffect(() => {
    if (!autoAdapt) return;
    let frame: number;
    function evaluate() {
      try {
        const nav: any = navigator;
        const conn = nav.connection;
        const mem = (nav as any).deviceMemory || 4;
        let poorNet = false;
        if (conn) {
          const et = conn.effectiveType || '';
            poorNet = conn.saveData || /(2g|slow-2g)/.test(et);
        }
        const lowMemory = mem <= 2;
        if (poorNet || lowMemory) {
          setStore((s: any) => ({
            reduceMotion: true,
            lessGlow: true,
          }));
        }
      } catch {}
      frame = window.setTimeout(evaluate, 8000);
    }
    evaluate();
    return () => window.clearTimeout(frame);
  }, [autoAdapt, setStore]);

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
    preloadAssets([
      '/webp/games/blackjack.webp',
      '/webp/games/dice.webp',
      '/webp/games/roulette.webp',
      '/webp/games/mines.webp',
      '/webp/games/plinko.webp',
      '/webp/games/slots.webp',
      '/webp/games/crash.webp',
      '/webp/games/flip.webp',
      '/webp/$DGHRT.webp',
    ]);
    // Dynamic font subset preload (small char set first)
    scheduleFontSubsetPreload([
      { family: 'Luckiest Guy' },
      { family: 'Inter', weights: ['400','600','700'] },
    ])
    // Network idle low-priority prefetch (rare modals/pages)
    scheduleNetworkIdlePrefetch([
      ['terms-page', () => import('./sections/Dashboard/Terms/Terms')],
      ['whitepaper-page', () => import('./sections/Dashboard/Whitepaper/Whitepaper')],
      ['about-page', () => import('./sections/Dashboard/AboutMe/AboutMe')],
      ['fairness-audit', () => import('./sections/FairnessAudit/FairnessAudit')],
    ])
  // Warm broader cache once idle
  warmCacheDeferred()
  }, []);

  return (
    <ThemeProvider>
      <Boundary>
        <GraphicsProvider>
        <GamesModalContext.Provider value={{ openGamesModal: () => setShowGamesModal(true) }}>
          {showGamesModal && (
            <Modal onClose={() => setShowGamesModal(false)}>
              <Boundary fallbackSize={200}>
                <AllGamesModal onGameClick={() => setShowGamesModal(false)} />
              </Boundary>
            </Modal>
          )}
        {newcomer && (
          <Modal>
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(20, 10, 40, 0.75)',
                zIndex: 1000,
              }}
            />
            <div style={{ textAlign: 'center', padding: '2rem 1rem 1.5rem', position: 'relative', zIndex: 1001 }}>
              <div style={{
                height: '6px',
                width: '100%',
                borderRadius: '3px',
                margin: '0.5rem 0 1.5rem',
                background: 'linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700)',
                backgroundSize: '300% 100%',
                animation: 'moveGradient 3s linear infinite',
              }} />
              <TosWrapper>
                <div
                  style={{
                    background: 'linear-gradient(90deg, rgb(255, 215, 0), rgb(162, 89, 255))',
                    color: 'rgb(34, 34, 34)',
                    boxShadow: '0 0 24px rgba(255, 215, 0, 0.533)',
                    border: 'none',
                    borderRadius: '1.25rem',
                    padding: '2rem 1.5rem',
                    margin: '0 auto 2rem',
                    width: 700,
                    textAlign: 'center',
                    fontSize: '1.18rem',
                    fontFamily: "'Luckiest Guy', 'Inter', cursive, sans-serif",
                    letterSpacing: '0.01em',
                    lineHeight: 1.7,
                    position: 'relative',
                    zIndex: 2,
                    transition: 'box-shadow 0.3s',
                    boxSizing: 'border-box',
                  }}
                >
                  <TosInner dangerouslySetInnerHTML={{ __html: TOS_HTML }} />
                </div>
              </TosWrapper>
              <p style={{
                margin: '1.5rem 0 2rem',
                fontSize: '1.1rem',
                opacity: 0.9,
                color: '#fff',
                textShadow: '0 0 8px #a259ff',
              }}>
                By playing on our platform, you confirm your compliance.
              </p>
              <button
                style={{
                  margin: '0 auto',
                  display: 'block',
                  padding: '1rem 2.5rem',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  borderRadius: '2rem',
                  background: 'linear-gradient(90deg, #ffd700, #a259ff)',
                  color: '#222',
                  boxShadow: '0 0 24px #ffd70088',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Luckiest Guy', cursive, sans-serif",
                  letterSpacing: '1px',
                  transition: 'all 0.3s ease-in-out',
                }}
                onClick={() => set({ newcomer: false })}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 48px #ffd700cc';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 0 24px #ffd70088';
                }}
              >
                🚀 Acknowledge
              </button>
            </div>
          </Modal>
        )}
        <ScrollToTop />
        <ErrorHandler />
        <Header />
  <AdaptiveFpsOverlay />
        <Boundary>
          <Sidebar />
        </Boundary>
        <MainContent>
          <Toasts />
          {/* Only show WelcomeBanner after auto-connect attempt */}
          {autoConnectAttempted && !connected && <WelcomeBanner />}
          <Boundary fallbackSize={260}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/jackpot" element={<JackpotPage />} />
              <Route path="/bonus" element={<BonusPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/select-token" element={<SelectTokenPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/whitepaper" element={<Whitepaper />} />
              <Route path="/aboutme" element={<AboutMe />} />
              <Route path="/audit" element={<FairnessAudit />} />
              <Route path="/propagation" element={<Propagation />} />
              <Route path="/explorer" element={<ExplorerIndex />} />
              <Route path="/explorer/platform/:creator" element={<PlatformView />} />
              <Route path="/explorer/player/:address" element={<PlayerView />} />
              <Route path="/explorer/transaction/:txId" element={<Transaction />} />
              <Route path="/:wallet/profile" element={<UserProfile />} />
              <Route path="/game/:wallet/:gameId" element={<Game />} />
            </Routes>
          </Boundary>
        </MainContent>
        <Footer />
        {ENABLE_TROLLBOX && connected && (
          <Boundary fallbackSize={120}>
            <TrollBox />
          </Boundary>
        )}
        <Boundary fallbackSize={60}>
          <CacheDebugWrapper />
        </Boundary>
      </GamesModalContext.Provider>
        </GraphicsProvider>
      </Boundary>
    </ThemeProvider>
  );
}