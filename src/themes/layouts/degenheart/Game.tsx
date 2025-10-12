import styled, { css } from 'styled-components';
import { media, components } from './breakpoints';

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { GambaUi, useSoundStore } from 'gamba-react-ui-v2';

import { GameSplashScreen, GraphicsSettings, GraphicsSettingsIcon, FullscreenPortal, GameStatsHeader } from '../../../components';
import { GameScalingProvider } from '../../../contexts/GameScalingContext';
import { useIsCompact } from '../../../hooks/ui/useIsCompact';

// Direct import of Icon object from the Icon file
const Icon = {
  Info: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m12 15h0M12 12v-1m0 8a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Fairness: () => (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Volume: () => (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  ),
  VolumeMuted: () => (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  ),
  Fullscreen: () => (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
    </svg>
  ),
};
import { GAMES } from '../../../games';
import { useUserStore } from '../../../hooks/data/useUserStore';
import { FEATURE_FLAGS } from '../../../constants';
import { Container, Controls, IconButton, MetaControls, Screen, Spinner, Splash } from '../../../sections/Game/Game.styles';
import { LoadingBar } from '../../../sections/Game/LoadingBar';
import { ProvablyFairModal } from '../../../sections/Game/ProvablyFairModal';
import { TransactionModal } from '../../../sections/Game/TransactionModal';
import { RenderModeToggle } from '../../../components/Game/RenderModeToggle';
import { PortalSafetyMonitor } from '../../../components/Game/PortalSafety';
import { keyframes } from 'styled-components';

// Animated CSS illustrations for each error type
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-18px); }
`;
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;
const ErrorArtWrapper = styled.div`
  height: 500px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorArt = styled.div<{ type: string; }>`
  font-size: 10rem;
  font-weight: 900;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  height: 100%;
  color: ${({ type }) => {
    switch (type) {
      case '404': return '#ff6b6b';
      case '500': return '#ffa726';
      case '503': return '#66bb6a';
      case '400': return '#42a5f5';
      default: return '#ab47bc';
    }
  }};
  
  ${({ type }) => {
    switch (type) {
      case '404':
        return css`
          animation: ${bounce} 2s infinite;
          &::before {
            content: '🤔';
            margin-right: 0.5rem;
          }
        `;
      case '500':
        return css`
          animation: ${spin} 3s linear infinite;
          &::before {
            content: '⚙️';
            margin-right: 0.5rem;
          }
        `;
      case '503':
        return css`
          animation: ${pulse} 1.5s ease-in-out infinite;
          &::before {
            content: '🔧';
            margin-right: 0.5rem;
          }
        `;
      case '400':
        return css`
          &::before {
            content: '💳';
            margin-right: 0.5rem;
          }
        `;
      default:
        return css`
          &::before {
            content: '🎲';
            margin-right: 0.5rem;
          }
        `;
    }
  }}
`;

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; },
  { hasError: boolean; error?: Error; }
> {
  constructor(props: { children: React.ReactNode; }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <GambaUi.Portal target="screen">
          <ErrorScreen
            type="500"
            message="Something went wrong while loading the game."
            details={this.state.error?.message}
          />
        </GambaUi.Portal>
      );
    }

    return this.props.children;
  }
}

interface ErrorScreenProps {
  type: '404' | '500' | '503' | '400' | '1024';
  message: string;
  details?: string;
}

function ErrorScreen({ type, message, details }: ErrorScreenProps) {
  const navigate = useNavigate();

  return (
    <GambaUi.Portal target="screen">
      <div style={{ padding: '16px', color: 'white' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{message}</h2>
        {details && (
          <pre
            style={{
              background: '#111',
              padding: '12px',
              textAlign: 'left',
              color: '#f88',
              whiteSpace: 'pre-wrap',
              overflow: 'auto',
              fontSize: '0.85rem',
              marginTop: '12px',
              borderRadius: '8px',
            }}
          >
            {details}
          </pre>
        )}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid #aaa',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Back to Home
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid #aaa',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </div>
      <ErrorArtWrapper>
        <ErrorArt type={type}>
          {type}
        </ErrorArt>
      </ErrorArtWrapper>
    </GambaUi.Portal>
  );
}

function CustomRenderer() {
  const { game } = GambaUi.useGame();
  const [info, setInfo] = useState(false);
  const [provablyFair, setProvablyFair] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [graphicsSettings, setGraphicsSettings] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const soundStore = useSoundStore();
  const firstTimePlaying = useUserStore(s => !s.gamesPlayed.includes(game.id));
  const { mobile: isMobile } = useIsCompact();

  // Shared function to exit fullscreen with proper re-rendering
  const exitFullscreen = () => {
    setFullscreen(false);
    // Force re-render of the main game by updating render key
    setTimeout(() => {
      setRenderKey(prev => prev + 1);
    }, 50);
  };
  const markGameAsPlayed = useUserStore(s => () => s.markGameAsPlayed(game.id, true));
  const [ready, setReady] = useState(false);
  const [txModal, setTxModal] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 750);
    return () => clearTimeout(timeout);
  }, []);

  // Reset splash screen when game changes
  useEffect(() => {
    console.log('Game changed, setting showSplash to true for game:', game.id);
    setShowSplash(true);
  }, [game.id]);

  const closeInfo = () => {
    markGameAsPlayed();
    setInfo(false);
  };

  const handleSplashStart = () => {
    console.log('Splash start clicked, setting showSplash to false');
    setShowSplash(false);
    markGameAsPlayed();
  };

  console.log('CustomRenderer render:', { showSplash, ready, gameName: game.meta.name });

  return (
    <>
      {/* Game Splash Screen - shows on every game load using full screen portal */}
      {showSplash && (
        <GambaUi.Portal target="screen">
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 60,
          }}>
            <div style={{
              width: '100%',
              height: '99%',
              overflow: 'hidden',
              borderRadius: 'clamp(16px, 2vw, 24px)',
              border: '2px solid rgba(255,215,0,.4)',
              background: 'linear-gradient(160deg,#121217 0%,#1d0b24 60%,#2d0040 100%)',
              boxShadow: '0 10px 50px -10px #ff008866, 0 0 0 1px #000',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <div style={{
                textAlign: 'center',
                padding: 'clamp(1.5rem, 4vw, 3rem)',
                maxWidth: 'clamp(320px, 80vw, 500px)',
              }}>
                <div style={{
                  width: 'clamp(120px, 20vw, 160px)',
                  height: 'clamp(120px, 20vw, 160px)',
                  margin: '0 auto clamp(1.5rem, 3vw, 2rem)',
                  borderRadius: 'clamp(24px, 4vw, 32px)',
                  background: 'linear-gradient(145deg,#201826,#110b14)',
                  padding: 'clamp(8px, 1.5vw, 12px)',
                  position: 'relative',
                  boxShadow: '0 8px 32px -8px #ffae0055, 0 0 0 1px #ffffff0f, 0 0 24px -4px #ff6ec744'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'clamp(24px, 4vw, 32px)',
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,215,0,0.3), transparent 70%)',
                    pointerEvents: 'none',
                    mixBlendMode: 'overlay'
                  }} />
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 'clamp(20px, 3vw, 24px)',
                    background: '#0d0d11',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={game.meta.image}
                      alt={game.meta.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        imageRendering: 'auto',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Try WebP version first, then fallback to original
                        if (!target.src.includes('.webp')) {
                          const webpSrc = target.src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
                          if (webpSrc.includes('/games/')) {
                            target.src = webpSrc;
                            return;
                          }
                        }
                        target.style.display = 'none';
                        const container = target.parentElement;
                        if (container) {
                          container.innerHTML = `
                            <div style="
                              width: 100%; 
                              height: 100%; 
                              display: flex; 
                              align-items: center; 
                              justify-content: center; 
                              font-size: clamp(2.5rem, 5vw, 4rem); 
                              color: #ffd700;
                            ">🎮</div>
                          `;
                        }
                      }}
                    />
                  </div>
                </div>
                <h1 style={{
                  fontSize: 'clamp(32px, 6vw, 48px)',
                  margin: '0 0 1rem 0',
                  background: 'linear-gradient(90deg,#ffe27a,#ff5ba5)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 800
                }}>
                  {game.meta.name}
                </h1>
                <p style={{
                  fontSize: 'clamp(14px, 2.5vw, 18px)',
                  lineHeight: 1.6,
                  color: '#ffffffc9',
                  margin: '0 0 clamp(2rem, 4vw, 3rem) 0'
                }}>
                  Ready to test your luck? Click start when you're ready to play!
                </p>
                <button
                  onClick={handleSplashStart}
                  style={{
                    width: 'clamp(160px, 30vw, 200px)',
                    padding: 'clamp(14px, 2.5vw, 18px) clamp(20px, 4vw, 24px)',
                    fontSize: 'clamp(16px, 2.5vw, 18px)',
                    fontWeight: 700,
                    borderRadius: 'clamp(12px, 2vw, 16px)',
                    border: '1px solid #ffffff22',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg,#ffae00,#ff0066)',
                    color: '#fff',
                    boxShadow: '0 8px 32px -4px #ff006688',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px -4px #ff006699';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px -4px #ff006688';
                  }}
                >
                  Start Game
                </button>
              </div>
            </div>
          </div>
        </GambaUi.Portal>
      )}

      {/* In-screen overlays via Gamba screen portal instead of separate modals */}
      {(info || provablyFair) && !showSplash && (
        <GambaUi.Portal target="screen">
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)',
            zIndex: 50,
          }}>
            <div style={{
              width: '100%',
              height: '99%',
              overflow: 'hidden',
              borderRadius: 'clamp(16px, 2vw, 24px)',
              border: '2px solid rgba(255,215,0,.35)',
              background: 'linear-gradient(160deg,#121217 0%,#1d0b24 60%,#2d0040 100%)',
              boxShadow: '0 10px 50px -10px #ff008866, 0 0 0 1px #000',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <button onClick={() => { setInfo(false); setProvablyFair(false); }}
                style={{
                  position: 'absolute',
                  top: 'clamp(8px, 1.5vw, 10px)',
                  right: 'clamp(8px, 1.5vw, 10px)',
                  width: 'clamp(36px, 6vw, 42px)',
                  height: 'clamp(36px, 6vw, 42px)',
                  borderRadius: '50%', border: '1px solid #ffffff22',
                  background: 'linear-gradient(135deg,#ff0066,#ffae00)', color: 'white',
                  fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 18px #ff006655',
                  fontSize: 'clamp(14px, 2.5vw, 16px)'
                }}>✕</button>
              {info && (
                <div style={{
                  padding: 'clamp(24px, 6vw, 48px) clamp(20px, 4vw, 48px) clamp(24px, 4vw, 40px) clamp(20px, 4vw, 48px)'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: 'clamp(20px, 4vw, 28px)' }}>
                    <div style={{
                      width: 'clamp(100px, 18vw, 140px)',
                      height: 'clamp(100px, 18vw, 140px)',
                      margin: '0 auto clamp(18px, 3vw, 26px)',
                      borderRadius: 'clamp(24px, 4vw, 32px)',
                      background: 'linear-gradient(145deg,#201826,#110b14)',
                      padding: 'clamp(8px, 1.5vw, 10px)',
                      position: 'relative',
                      boxShadow: '0 6px 28px -6px #ffae0055, 0 0 0 1px #ffffff0f, 0 0 18px -2px #ff6ec744'
                    }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'clamp(24px, 4vw, 32px)',
                        background: 'radial-gradient(circle at 30% 30%, rgba(255,215,0,0.25), transparent 70%)',
                        pointerEvents: 'none',
                        mixBlendMode: 'overlay'
                      }} />
                      <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 'clamp(20px, 3vw, 24px)',
                        background: '#0d0d11',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={game.meta.image}
                          alt={game.meta.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            imageRendering: 'auto',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
                          }}
                        />
                      </div>
                    </div>
                    <h1 style={{
                      fontSize: 'clamp(24px, 5vw, 34px)',
                      margin: 0,
                      background: 'linear-gradient(90deg,#ffe27a,#ff5ba5)',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      fontWeight: 800
                    }}>{game.meta.name}</h1>
                  </div>
                  <p style={{
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    lineHeight: 1.6,
                    color: '#ffffffc9',
                    margin: 'clamp(0px, 0px, 0px) 0 clamp(20px, 4vw, 28px) 0'
                  }}>{game.meta.description}</p>
                  <button onClick={() => setInfo(false)} style={{
                    width: '100%',
                    padding: 'clamp(12px, 2.5vw, 15px) clamp(16px, 3vw, 20px)',
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    fontWeight: 600,
                    borderRadius: 'clamp(12px, 2vw, 14px)',
                    border: '1px solid #ffffff22',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg,#ffae00,#ff0066)',
                    color: '#fff',
                    boxShadow: '0 6px 24px -4px #ff006688',
                    letterSpacing: '.5px'
                  }}>Play Now</button>
                </div>
              )}
              {provablyFair && (
                <div style={{
                  padding: 'clamp(40px, 8vw, 56px) clamp(20px, 4vw, 48px) clamp(24px, 5vw, 40px) clamp(20px, 4vw, 48px)'
                }}>
                  <ProvablyFairModal onClose={() => setProvablyFair(false)} inline />
                </div>
              )}
            </div>
          </div>
        </GambaUi.Portal>
      )}
      {txModal && <TransactionModal onClose={() => setTxModal(false)} />}
      {graphicsSettings && !fullscreen && <GraphicsSettings onClose={() => setGraphicsSettings(false)} />}
      {fullscreen && (
        <FullscreenPortal
          key={`fullscreen-${renderKey}`}
          onExit={exitFullscreen}
          modals={graphicsSettings ? <GraphicsSettings onClose={() => setGraphicsSettings(false)} /> : undefined}
          metaControls={
            <>
              <IconButton onClick={() => setInfo(true)} disabled={showSplash}>
                <Icon.Info />
              </IconButton>
              <IconButton onClick={() => setProvablyFair(true)} disabled={showSplash}>
                <Icon.Fairness />
              </IconButton>
              <IconButton onClick={() => setGraphicsSettings(true)} disabled={showSplash}>
                <GraphicsSettingsIcon />
              </IconButton>
              <IconButton onClick={exitFullscreen} disabled={showSplash}>
                ×
              </IconButton>
              <IconButton
                onClick={() => soundStore.set(soundStore.volume ? 0 : 0.5)}
                disabled={showSplash}
              >
                {soundStore.volume ? <Icon.Volume /> : <Icon.VolumeMuted />}
              </IconButton>
            </>
          }
        />
      )}
      {/* <GameSlider /> removed to prevent featured games from appearing on game pages */}
      <Container key={`game-container-${renderKey}`}>
        {/* DegenHeart Theme: Stats header only shown on mobile devices */}
        {ready && isMobile && <GambaUi.PortalTarget target="stats" />}

        <Screen>
          {!ready ? (
            <Splash>
              <svg
                width="clamp(120px, 25vw, 180px)"
                height="clamp(120px, 25vw, 180px)"
                viewBox="0 0 180 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block' }}
              >
                <g>
                  <circle
                    cx="90" cy="90" r="80"
                    stroke="#ffd700"
                    strokeWidth="8"
                    fill="#18181f"
                    style={{
                      transformOrigin: '90px 90px',
                      animation: 'spin 1.2s linear infinite'
                    }}
                  />
                  <text
                    x="50%" y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="'Luckiest Guy', cursive, sans-serif"
                    fontSize="clamp(24px, 5vw, 36px)"
                    fill="#ffd700"
                    letterSpacing="2"
                    style={{
                      textTransform: 'uppercase',
                      animation: 'degenHeartPulse 1.2s ease-in-out infinite'
                    }}
                  >
                    Loading
                  </text>
                </g>
                <style>{`
                    @keyframes spin {
                      100% { transform: rotate(360deg); }
                    }
                    @keyframes degenHeartPulse {
                      0%, 100% { opacity: 1; }
                      50% { opacity: 0.5; }
                    }
                  `}</style>
              </svg>
            </Splash>
          ) : null}
          <GambaUi.PortalTarget target="error" />
          {ready && (
            <GameScalingProvider
              options={{
                minHeight: 280,
                maxHeight: 900,
                controlsReservedSpace: 120,
                headerReservedSpace: isMobile ? 60 : 0, // Only reserve space on mobile
                aggressiveScaling: true,
              }}
            >
              <GambaUi.PortalTarget target="screen" />
            </GameScalingProvider>
          )}
        </Screen>
        {/* Portal Safety Monitor - actively prevents unsafe sizing */}
        <PortalSafetyMonitor
          enforceSafety={true}
          debugMode={false}
          onSafetyChange={(status) => {
            if (!status.isSafe) {
              console.warn('🚨 Portal Safety Warning:', status.reasons);
            }
          }}
        />
        <LoadingBar />
        <Controls style={{ opacity: showSplash ? 0.3 : 1, pointerEvents: showSplash ? 'none' : 'auto' }}>
          <div className="control-buttons">
            <GambaUi.PortalTarget target="controls" />
          </div>
          <MetaControls>
            <RenderModeToggle gameId={game?.id} />
            <IconButton onClick={() => setInfo(true)} disabled={showSplash}>
              <Icon.Info />
            </IconButton>
            <IconButton onClick={() => setProvablyFair(true)} disabled={showSplash}>
              <Icon.Fairness />
            </IconButton>
            <IconButton onClick={() => setGraphicsSettings(true)} disabled={showSplash}>
              <GraphicsSettingsIcon />
            </IconButton>
            <IconButton onClick={() => setFullscreen(true)} disabled={showSplash}>
              <Icon.Fullscreen />
            </IconButton>
            <IconButton
              onClick={() => soundStore.set(soundStore.volume ? 0 : 0.5)}
              disabled={showSplash}
            >
              {soundStore.volume ? <Icon.Volume /> : <Icon.VolumeMuted />}
            </IconButton>
          </MetaControls>
        </Controls>
      </Container>
    </>
  );
}

export default function Game() {
  const { wallet, gameId } = useParams();
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const walletAdapter = useWallet();
  const connectedWallet = publicKey?.toBase58();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<any | null>(null);

  // Track if wallet auto-connect attempt has finished to prevent error flash
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false);

  useEffect(() => {
    const gameFound = GAMES().find(
      (x) => x.id.toLowerCase() === gameId?.toLowerCase(),
    );
    console.log('🎮 DegenHeart Game Found:', {
      gameId,
      gameFound: gameFound ? {
        id: gameFound.id,
        live: gameFound.live,
        maintenance: gameFound.maintenance,
        creating: gameFound.creating
      } : 'null'
    });
    setGame(gameFound || null);
    setLoading(false);
  }, [gameId]);

  useEffect(() => {
    // If wallet.connecting just transitioned to false, mark auto-connect as attempted
    if (!walletAdapter.connecting) {
      setAutoConnectAttempted(true);
    }
  }, [walletAdapter.connecting]);

  // Improved wallet param logic:
  // 1. Wait for auto-connect attempt to complete before showing wallet errors
  // 2. If not connected after auto-connect, prompt to connect wallet.
  // 3. If connected and wallet param exists, require match.
  // 4. If connected and no wallet param, allow access.

  // Don't show wallet errors until auto-connect has been attempted
  if (!autoConnectAttempted || walletAdapter.connecting) {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          color: 'white',
        }}
      >
        <Spinner />
        <p style={{ marginTop: '12px', fontSize: '1.2rem' }}>Connecting...</p>
      </div>
    );
  }

  if (!connectedWallet) {
    return (
      <ErrorScreen
        type="400"
        message="Please connect your wallet to play."
      />
    );
  }
  if (wallet && connectedWallet.toLowerCase() !== wallet.toLowerCase()) {
    return (
      <ErrorScreen
        type="400"
        message="Wallet mismatch. Please reconnect with the correct wallet."
      />
    );
  }

  if (loading) {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          color: 'white',
        }}
      >
        <Spinner />
        <p style={{ marginTop: '12px', fontSize: '1.2rem' }}>Loading game...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <ErrorScreen
        type="404"
        message="Game not found. Please check the URL or try again later."
      />
    );
  }

  // Support custom .env variable for environment, fallback to GAMBA_ENV
  const env = import.meta.env.GAMBA_ENV || import.meta.env.MODE || '';
  const isProd = env === 'production';

  // Determine if games should be blocked based on feature flags
  const shouldBlockMaintenance = FEATURE_FLAGS.BLOCK_MAINTENANCE_GAMES &&
    (FEATURE_FLAGS.RESPECT_ENVIRONMENT_FOR_GAME_BLOCKING ? isProd : true);
  const shouldBlockCreating = FEATURE_FLAGS.BLOCK_CREATING_GAMES &&
    (FEATURE_FLAGS.RESPECT_ENVIRONMENT_FOR_GAME_BLOCKING ? isProd : true);

  console.log('🔍 DegenHeart Debug:', {
    gameId,
    gameLive: game.live,
    maintenance: game.maintenance,
    creating: game.creating,
    env,
    isProd,
    featureFlags: {
      blockMaintenance: FEATURE_FLAGS.BLOCK_MAINTENANCE_GAMES,
      blockCreating: FEATURE_FLAGS.BLOCK_CREATING_GAMES,
      respectEnvironment: FEATURE_FLAGS.RESPECT_ENVIRONMENT_FOR_GAME_BLOCKING
    },
    shouldBlockMaintenance,
    shouldBlockCreating
  });

  if (shouldBlockMaintenance && game.maintenance) {
    return (
      <Container>
        <Screen>
          <div style={{
            padding: 'clamp(16px, 3vw, 32px)',
            color: 'white',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(160deg, #121217 0%, #1d0b24 60%, #2d0040 100%)',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}>
            {/* Background decorative elements */}
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '5%',
              width: 'clamp(120px, 15vw, 180px)',
              height: 'clamp(120px, 15vw, 180px)',
              background: 'radial-gradient(circle, rgba(102, 187, 106, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '15%',
              right: '5%',
              width: 'clamp(100px, 12vw, 150px)',
              height: 'clamp(100px, 12vw, 150px)',
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />

            {/* Animated maintenance icon */}
            <div style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              marginBottom: 'clamp(12px, 2vw, 20px)',
              color: '#66bb6a',
              textShadow: '0 0 20px rgba(102, 187, 106, 0.5)',
              animation: 'pulse 2s ease-in-out infinite',
              position: 'relative',
              zIndex: 1
            }}>
              🔧
            </div>

            {/* Error code */}
            <div style={{
              fontSize: 'clamp(3rem, 7vw, 4.5rem)',
              fontWeight: '900',
              background: 'linear-gradient(90deg, #66bb6a, #4caf50)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: 'clamp(10px, 2vw, 16px)',
              textShadow: '0 4px 20px rgba(102, 187, 106, 0.3)',
              position: 'relative',
              zIndex: 1
            }}>
              503
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
              marginBottom: 'clamp(8px, 1.5vw, 16px)',
              maxWidth: 'clamp(280px, 85vw, 500px)',
              background: 'linear-gradient(90deg, #ffe27a, #ff5ba5)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: '700',
              lineHeight: '1.3',
              position: 'relative',
              zIndex: 1
            }}>
              This game is currently under maintenance
            </h2>

            {/* Subtitle */}
            <p style={{
              fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: 'clamp(20px, 4vw, 32px)',
              maxWidth: 'clamp(260px, 80vw, 450px)',
              lineHeight: '1.4',
              position: 'relative',
              zIndex: 1
            }}>
              We're working hard to get this game back online. Please check back later!
            </p>

            {/* Action buttons */}
            <div style={{
              display: 'flex',
              gap: 'clamp(8px, 2vw, 16px)',
              justifyContent: 'center',
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 1
            }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: 'clamp(10px, 2vw, 14px) clamp(16px, 3vw, 24px)',
                  borderRadius: 'clamp(6px, 1.5vw, 10px)',
                  background: 'linear-gradient(135deg, #66bb6a, #4caf50)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 3px 12px rgba(102, 187, 106, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 187, 106, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 12px rgba(102, 187, 106, 0.3)';
                }}
              >
                🏠 Back to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: 'clamp(10px, 2vw, 14px) clamp(16px, 3vw, 24px)',
                  borderRadius: 'clamp(6px, 1.5vw, 10px)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                🔄 Retry
              </button>
            </div>
          </div>
        </Screen>
      </Container>
    );
  }

  if (shouldBlockCreating && game.creating) {
    return (
      <Container>
        <Screen>
          <div style={{
            padding: 'clamp(16px, 3vw, 32px)',
            color: 'white',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(160deg, #121217 0%, #2d1b0f 60%, #3d2914 100%)',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}>
            {/* Background decorative elements */}
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '5%',
              width: 'clamp(120px, 15vw, 180px)',
              height: 'clamp(120px, 15vw, 180px)',
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '15%',
              right: '5%',
              width: 'clamp(100px, 12vw, 150px)',
              height: 'clamp(100px, 12vw, 150px)',
              background: 'radial-gradient(circle, rgba(255, 152, 0, 0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />

            {/* Animated lab flask icon */}
            <div style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              marginBottom: 'clamp(15px, 3vw, 25px)',
              color: '#fbbf24',
              textShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
              animation: 'bounce 2s ease-in-out infinite',
              position: 'relative',
              zIndex: 1
            }}>
              🧪
            </div>

            {/* Error code */}
            <div style={{
              fontSize: 'clamp(2.8rem, 7vw, 4.5rem)',
              fontWeight: '900',
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: 'clamp(12px, 2.5vw, 20px)',
              textShadow: '0 4px 20px rgba(251, 191, 36, 0.3)',
              position: 'relative',
              zIndex: 1
            }}>
              NEW
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
              marginBottom: 'clamp(12px, 2.5vw, 20px)',
              maxWidth: 'clamp(280px, 75vw, 500px)',
              background: 'linear-gradient(90deg, #ffe27a, #ff5ba5)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: '700',
              lineHeight: '1.4',
              position: 'relative',
              zIndex: 1
            }}>
              This game is being added soon
            </h2>

            {/* Subtitle */}
            <p style={{
              fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: 'clamp(25px, 5vw, 35px)',
              maxWidth: 'clamp(260px, 65vw, 450px)',
              lineHeight: '1.5',
              position: 'relative',
              zIndex: 1
            }}>
              We're putting the finishing touches on this exciting new game. Check back soon for the latest additions!
            </p>

            {/* Action buttons */}
            <div style={{
              display: 'flex',
              gap: 'clamp(8px, 2vw, 16px)',
              justifyContent: 'center',
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 1
            }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: 'clamp(10px, 2vw, 14px) clamp(16px, 3vw, 24px)',
                  borderRadius: 'clamp(6px, 1.5vw, 10px)',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 3px 12px rgba(251, 191, 36, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(251, 191, 36, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 12px rgba(251, 191, 36, 0.3)';
                }}
              >
                🏠 Back to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: 'clamp(10px, 2vw, 14px) clamp(16px, 3vw, 24px)',
                  borderRadius: 'clamp(6px, 1.5vw, 10px)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                🔄 Check Again
              </button>
            </div>
          </div>
        </Screen>
      </Container>
    );
  }

  return (
    <GambaUi.Game
      game={game}
      errorFallback={
        <GambaUi.Portal target="screen">
          <ErrorScreen
            type="500"
            message="Something went wrong while loading the game."
          />
        </GambaUi.Portal>
      }
    >
      <ErrorBoundary>
        <CustomRenderer />
      </ErrorBoundary>
    </GambaUi.Game>
  );
}