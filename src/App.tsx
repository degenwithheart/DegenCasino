import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useTransactionError } from 'gamba-react-v2';
import { TOSModal } from './components';
import { useWalletToast } from './utils/wallet/solanaWalletToast';
import { useUserStore } from './hooks/data/useUserStore';
import { useServiceWorker, preloadCriticalAssets } from './hooks/system/useServiceWorker';
import { GamesModalContext } from './sections/Dashboard/Dashboard';
import { ThemeLayoutWrapper, useThemeModal } from './components/ThemeLayoutWrapper';
import { AppRoutes } from './routes/AppRoutes';
import { AllGamesModal, CacheDebugWrapper, GraphicsProvider } from './components';
import { UnifiedThemeProvider } from './themes/UnifiedThemeContext';

// Loading component for lazy-loaded routes - moved to ThemeLayoutWrapper
// const SIDEBAR_WIDTH = 80; - moved to ThemeLayoutWrapper

// Theme-aware content component that renders based on current layout theme
function AppContent({ autoConnectAttempted }: { autoConnectAttempted: boolean }) {
  return (
    <ThemeLayoutWrapper autoConnectAttempted={autoConnectAttempted}>
      <AppRoutes />
    </ThemeLayoutWrapper>
  );
}

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
        <GamesModalProvider showGamesModal={showGamesModal} setShowGamesModal={setShowGamesModal}>
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
        </GamesModalProvider>
      </GraphicsProvider>
    </UnifiedThemeProvider>
  );
}

// Component to handle games modal with theme-aware modal
function GamesModalProvider({ children, showGamesModal, setShowGamesModal }: {
  children: React.ReactNode;
  showGamesModal: boolean;
  setShowGamesModal: (show: boolean) => void;
}) {
  const ThemeModal = useThemeModal();
  
  return (
    <GamesModalContext.Provider value={{ openGamesModal: () => setShowGamesModal(true) }}>
      {showGamesModal && (
        <ThemeModal onClose={() => setShowGamesModal(false)}>
          <AllGamesModal onGameClick={() => setShowGamesModal(false)} />
        </ThemeModal>
      )}
      {children}
    </GamesModalContext.Provider>
  );
}