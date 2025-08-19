import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useTransactionError } from 'gamba-react-v2';
import { Modal } from './components/Modal';
import { TOS_HTML, ENABLE_TROLLBOX } from './constants';
import { useToast } from './hooks/useToast';
import { useUserStore } from './hooks/useUserStore';
import { Dashboard, GamesModalContext } from './sections/Dashboard/Dashboard';
import AboutMe from './sections/Dashboard/AboutMe';
import TermsPage from './sections/Dashboard/Terms';
import Whitepaper from './sections/Dashboard/Whitepaper';
import UserProfile from './sections/UserProfile';
import Game from './sections/Game/Game';
import Header from './sections/Header';
import AllGamesModalContent from './components/AllGamesModalContent';
import Toasts from './sections/Toasts';
import TrollBox from './components/TrollBox';
import { TosInner, TosWrapper } from './styles';
import Footer from './sections/Footer';
import { useWallet } from '@solana/wallet-adapter-react';
import Sidebar from './components/Sidebar';

import styled from 'styled-components';

const SIDEBAR_WIDTH = 80;

const MainContent = styled.main`
  min-height: calc(100vh - 140px);
  padding-top: 1rem;
  padding-left: ${SIDEBAR_WIDTH}px;
  padding-right: 0;
  padding-bottom: 80px; /* For footer */
  transition: padding 0.3s ease;

  @media (max-width: 900px) {
    padding-left: 0;
    padding-bottom: 150px; /* Space for bottom nav (70px) + footer (80px) */
  }

  @media (max-width: 700px) {
    padding-left: 0;
    padding-bottom: 80px; /* Sidebar is hidden, only footer space */
  }
`;

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function ErrorHandler() {
  const walletModal = useWalletModal();
  const toast = useToast();
  useTransactionError((err) => {
    if (err.message === 'NOT_CONNECTED') {
      walletModal.setVisible(true);
    } else {
      toast({
        title: '❌ Transaction error',
        description: err.error?.errorMessage ?? err.message,
      });
    }
  });
  return null;
}

function App() {
  const newcomer = useUserStore((s) => s.newcomer);
  const set = useUserStore((s) => s.set);
  const { connected } = useWallet();
  const [showGamesModal, setShowGamesModal] = React.useState(false);

  // Listen for sidebar "Games" button event
  React.useEffect(() => {
    const handler = () => setShowGamesModal(true);
    window.addEventListener('openGamesModal', handler);
    return () => window.removeEventListener('openGamesModal', handler);
  }, []);

  return (
    <GamesModalContext.Provider value={{ openGamesModal: () => setShowGamesModal(true) }}>
      {showGamesModal && (
        <Modal onClose={() => setShowGamesModal(false)}>
          <h2 style={{ textAlign: 'center', marginBottom: 16 }}>All Games</h2>
          <AllGamesModalContent onGameClick={() => setShowGamesModal(false)} />
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
      <Sidebar />
      <MainContent>
        <Toasts />
        {!connected && (
          <div>{/* Welcome banner or other pre-connect content can go here */}</div>
        )}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/:wallet/profile" element={<UserProfile />} />
          <Route path="/game/:wallet/:gameId" element={<Game />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/whitepaper" element={<Whitepaper />} />
          <Route path="/aboutme" element={<AboutMe />} />
        </Routes>
      </MainContent>
      <Footer />
      {ENABLE_TROLLBOX && <TrollBox />}
    </GamesModalContext.Provider>
  );
}
export default App;