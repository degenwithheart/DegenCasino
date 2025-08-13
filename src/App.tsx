import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useTransactionError } from 'gamba-react-v2';
import { GambaUi } from 'gamba-react-ui-v2';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Modal } from './components/Modal';
import LeaderboardsModal from './components/LeaderboardsModal';
import Sidebar from './components/Sidebar';
import ScreenSizeWarning from './components/ScreenSizeWarning';
import Footer from './sections/Footer';

import { TOS_HTML } from './constants';
import { useToast } from './hooks/useToast';
import { useUserStore } from './hooks/useUserStore';

import AboutMe from './sections/Dashboard/AboutMe';
import Dashboard from './sections/Dashboard/Dashboard';
import TermsPage from './sections/Dashboard/Terms';
import Whitepaper from './sections/Dashboard/Whitepaper';
import Game from './sections/Game/Game';
import Header from './sections/Header';
import Toasts from './sections/Toasts';
import UserProfile from './sections/UserProfile';

import { MainWrapper, TosInner, TosWrapper } from './styles';
import { getAccessWindow, isWithinAccessTime } from './utils/timeAccess';

import LiveAccessWrapper from './components/LiveAccessWrapper';
import ExchangePage from './sections/Dashboard/ExchangePage';

// Import global responsive paytables (works for all games automatically)
import './utils/globalResponsivePaytables';
import Propagation from './pages/propagation';
import { GambaResultProvider } from './context/GambaResultContext';
import { MilestoneProvider } from './context/MilestoneContext';
import { MilestoneModalContainer } from './components/MilestoneModalContainer';
import { MilestoneTestPanel } from './components/MilestoneTestPanel';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ErrorHandler() {
  const walletModal = useWalletModal();
  const toast = useToast();
  const [error, setError] = useState<Error | undefined>(undefined);

  useTransactionError((error) => {
    if (error.message === 'NOT_CONNECTED') {
      walletModal.setVisible(true);
      return;
    }
    setError(error);
    toast({
      title: '❌ Transaction error',
      description: error.error?.errorMessage ?? error.message,
    });
  });

  return (
    <>
      {error && (
        <Modal onClose={() => setError(undefined)}>
          <h1>Error occurred</h1>
          <p>{error.message}</p>
        </Modal>
      )}
    </>
  );
}

import { useIsCompact } from './hooks/useIsCompact';

export default function App() {
  const { connected } = useWallet();
  const newcomer = useUserStore((state) => state.newcomer);
  const set = useUserStore((state) => state.set);
  const isCompact = useIsCompact();
  const [showScreenSizeWarning, setShowScreenSizeWarning] = useState(false);
  const navigate = useNavigate();

  // Remove forced redirect to home page on refresh

  useEffect(() => {
    setShowScreenSizeWarning(isCompact.screenTooSmall);
  }, [isCompact.screenTooSmall]);

  if (showScreenSizeWarning) {
    return <ScreenSizeWarning onDismiss={() => setShowScreenSizeWarning(false)} />;
  }

  return (
    <GambaResultProvider>
      <MilestoneProvider>
        <LiveAccessWrapper>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div
            style={{
              flex: 1,
              marginLeft: isCompact.compact ? 80 : 290,
            overflowX: 'hidden',
            maxWidth: '100vw',
            boxSizing: 'border-box',
            transition: 'margin-left 0.3s ease',
          }}
        >
          {newcomer && (
          <Modal>
            {/* Overlay background */}
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
                    height: 300,  
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
          <MilestoneModalContainer />
          <Header />
          <div style={{ height: '50px', visibility: 'hidden', pointerEvents: 'none' }} />
          <Toasts />
          <Footer />

          {!connected && (
            <div>{/* Welcome banner or other pre-connect content can go here */}</div>
          )}

          <MainWrapper>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/:wallet/profile" element={<UserProfile />} />
              <Route path="/game/:wallet/:gameName" element={<Game />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/whitepaper" element={<Whitepaper />} />
              <Route path="/aboutme" element={<AboutMe />} />
              <Route path="/exchange" element={<ExchangePage />} />
              <Route path="/propagation" element={<Propagation />} />
            </Routes>
          </MainWrapper>

          {/* Uncomment if needed */}
          {/* <LeaderboardsModal /> */}
          
          {/* Milestone Test Panel - Remove in production */}
          <MilestoneTestPanel />
        </div>
      </div>
    </LiveAccessWrapper>
    </MilestoneProvider>
    </GambaResultProvider>
  );
}
