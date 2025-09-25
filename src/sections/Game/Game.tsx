import styled from 'styled-components';
// Styled modal content for info modal, matching casino modal look
const InfoModalContent = styled.div`
  /* Mobile-first: Start with mobile viewport optimized styles */
  width: 98vw;
  max-width: 98vw;
  min-width: 0;
  min-height: 200px;
  max-height: 400px;
  margin-bottom: 2rem;
  margin-top: 2rem;
  padding: 0.25rem;
  background: rgba(24, 24, 24, 0.95);
  border-radius: 10px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  position: relative;
  color: white;
  
  /* Small tablets */
  @media (min-width: 640px) {
    padding: 0.5rem;
    border-radius: 1rem;
    max-width: 90vw;
    min-height: 250px;
    max-height: 450px;
  }
  
  /* Tablets */
  @media (min-width: 768px) {
    padding: 1rem;
    max-width: 85vw;
    min-height: 300px;
    max-height: 500px;
    margin-bottom: 3rem;
    margin-top: 3rem;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    max-width: 80vw;
    min-height: 350px;
    margin-bottom: 4rem;
    margin-top: 4rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(162, 89, 255, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
    border-radius: 10px;
    
    @media (min-width: 640px) {
      border-radius: 24px;
    }
  }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    animation: moveGradient 4s linear infinite;
    border-radius: 10px 10px 0 0;
    z-index: 1;
    
    @media (min-width: 640px) {
      border-radius: 24px 24px 0 0;
    }
  }
`;
// src/sections/Game/Game.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { GambaUi, useSoundStore } from 'gamba-react-ui-v2'

import { GameSplashScreen, GraphicsSettings, GraphicsSettingsIcon, Modal, FullscreenPortal, GameStatsHeader } from '../../components'
import { GameScalingProvider } from '../../contexts/GameScalingContext'

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
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
        fill="currentColor"
      />
    </svg>
  ),
  Fairness: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 800 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m738 312.197-74.146-160.552a52.68 52.68 0 0 0 17.301-38.697 52.13 52.13 0 0 0-11.559-32.532 52.18 52.18 0 0 0-29.359-18.187 52.2 52.2 0 0 0-34.293 4.128 52.17 52.17 0 0 0-24.2 24.635l-374.847 95.233a51.1 51.1 0 0 0-33.228-12.35 51.93 51.93 0 0 0-29.664 9.063 51.9 51.9 0 0 0-19.193 24.353 51.84 51.84 0 0 0 14.256 57.426L63 429.386l221.064-.824-75.794-164.668a51.32 51.32 0 0 0 15.929-27.445l135.384-34.305v421.551h-2.747l-182.891 56.812a29.1 29.1 0 0 0-14.614 10.429 29.08 29.08 0 0 0-5.709 17.014v1.923a27.4 27.4 0 0 0 1.706 11.342 27.45 27.45 0 0 0 15.795 15.937 27.5 27.5 0 0 0 11.334 1.811h436.361a27.48 27.48 0 0 0 20.827-8.001 27.46 27.46 0 0 0 8.007-20.816v-2.196a29.07 29.07 0 0 0-5.597-16.95 29.1 29.1 0 0 0-14.45-10.493l-182.618-56.812h-3.021V184.58l146.096-38.698 5.491 5.763-74.42 161.101c16.434 0 203.806-.549 218.867-.549M108.311 429.386l65.358-141.615 64.451 140.984zm521.766-254.687 63.711 137.223H565.542z"
        fill="currentColor"
      />
      <path
        d="M323 424c0 82.842-66.932 150-149.5 150C90.934 574 24 506.842 24 424c164.834.004 130.334 0 299 0"
        fill="currentColor"
      />
      <path
        d="M626.5 424C626.5 506.842 693.432 574 776 574s149.5-67.158 149.5-150c-164.834.004-130.334 0-299 0"
        fill="currentColor"
      />
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
      viewBox="0 0 576 512"
      width="18"
      height="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM461.64 256l45.64-45.64c6.3-6.3 6.3-16.52 0-22.82l-22.82-22.82c-6.3-6.3-16.52-6.3-22.82 0L416 210.36l-45.64-45.64c-6.3-6.3-16.52-6.3-22.82 0l-22.82 22.82c-6.3 6.3-6.3 16.52 0 22.82L370.36 256l-45.63 45.63c-6.3 6.3-6.3 16.52 0 22.82l22.82 22.82c6.3 6.3 16.52 6.3 22.82 0L416 301.64l45.64 45.64c6.3 6.3 16.52 6.3 22.82 0l22.82-22.82c6.3-6.3 6.3-16.52 0-22.82L461.64 256z" />
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
}
import { GAMES } from '../../games'
import { useUserStore } from '../../hooks/data/useUserStore'
import { FEATURE_FLAGS } from '../../constants'
import { GameSlider } from '../Dashboard/Dashboard'
import { Container, Controls, IconButton, MetaControls, Screen, Spinner, Splash } from './Game.styles'
import { LoadingBar } from './LoadingBar'
import { ProvablyFairModal } from './ProvablyFairModal'
import { TransactionModal } from './TransactionModal'
import { PortalSafetyMonitor } from '../../components/Game/PortalSafety'
import { RenderModeToggle } from '../../components/Game/RenderModeToggle'
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
const Error404 = styled.div`
  width: 120px; height: 120px; position: relative;
  &:before, &:after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: #ffe066;
    opacity: 0.7;
    animation: ${bounce} 1.2s infinite;
  }
  &:before {
    width: 60px; height: 60px; left: 0; top: 30px;
    animation-delay: 0s;
  }
  &:after {
    width: 60px; height: 60px; right: 0; top: 30px;
    animation-delay: 0.6s;
  }
  div {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
    font-size: 3.2rem; font-weight: bold; color: #ffe066; text-shadow: 0 2px 12px #000a;
  }
`;
const Error500 = styled.div`
  width: 120px; height: 120px; border-radius: 50%; background: #ff0066; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 32px #ff006688;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    width: 60px; height: 60px;
    border: 6px solid #fff;
    border-top: 6px solid #ff0066;
    border-radius: 50%;
    left: 30px; top: 30px;
    animation: ${spin} 1.2s linear infinite;
    opacity: 0.7;
  }
  span {
    color: #fff; font-size: 2.2rem; font-weight: bold; z-index: 1;
  }
`;

const Error503 = styled.div`
  width: 120px; height: 120px; border-radius: 50%; background: #00ffe1; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 32px #00ffe188;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    width: 60px; height: 60px;
    border: 6px dashed #fff;
    border-radius: 50%;
    left: 30px; top: 30px;
    animation: ${spin} 2s linear infinite;
    opacity: 0.7;
  }
  span {
    color: #222; font-size: 2.2rem; font-weight: bold; z-index: 1;
  }
`;
const Error1024 = styled.div`
  width: 120px; height: 120px; border-radius: 20px; background: linear-gradient(135deg, #a259ff 0%, #ffd700 100%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 32px #ffd70088;
  position: relative;
  animation: ${pulse} 1.5s infinite;
  span {
    color: #fff; font-size: 2.2rem; font-weight: bold; z-index: 1;
  }
`;
const ErrorGeneric = styled.div`
  width: 120px; height: 120px; border-radius: 50%; background: #222; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 32px #fff2;
  span {
    color: #fff; font-size: 2.2rem; font-weight: bold;
  }
`;
function ErrorArt({ type }: { type: string }) {
  switch (type) {
    case '404':
      return <Error404><div>404</div></Error404>;
    case '500':
      return <Error500><span>500</span></Error500>;
    case '503':
      return <Error503><span>503</span></Error503>;
    case '1024':
      return <Error1024><span>🧪</span></Error1024>;
    case '400':
      return <ErrorGeneric><span>400</span></ErrorGeneric>;
    default:
      return <ErrorGeneric><span>?</span></ErrorGeneric>;
  }
}
const ErrorScreen = ({
  type,
  message,
  details,
}: {
  type: '400' | '404' | '500' | '503' | '1024';
  message: string;
  details?: string;
}) => {
  const navigate = useNavigate()
  const wallet = useWallet()
  const walletModal = useWalletModal()

  const reconnect = () => {
    if (wallet.wallet) {
      wallet.connect()
    } else {
      walletModal.setVisible(true)
    }
  }

  return (
    <div
      style={{
        textAlign: 'center',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 0 30px rgba(255,255,255,0.15)',
        background: '#000',
      }}
    >
      <ErrorArtWrapper>
        <ErrorArt type={type} />
      </ErrorArtWrapper>
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
        </div>
      </div>
    </div>
  )
}
// Error Boundary to catch render-time exceptions
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <ErrorScreen
          type="500"
          message="A rendering error occurred."
          details={this.state.error.stack || this.state.error.message}
        />
      )
    }
    return this.props.children
  }
}
function CustomError() {
  return (
    <GambaUi.Portal target="error">
      <GambaUi.Responsive>
        <h1>😭 Oh no!</h1>
        <p>Something went wrong</p>
      </GambaUi.Responsive>
    </GambaUi.Portal>
  )
}

function CustomRenderer() {
  const { game } = GambaUi.useGame()
  const [info, setInfo] = useState(false)
  const [provablyFair, setProvablyFair] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [graphicsSettings, setGraphicsSettings] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [renderKey, setRenderKey] = useState(0)
  const soundStore = useSoundStore()
  const firstTimePlaying = useUserStore(s => !s.gamesPlayed.includes(game.id))
  
  // Shared function to exit fullscreen with proper re-rendering
  const exitFullscreen = () => {
    setFullscreen(false)
    // Force re-render of the main game by updating render key
    setTimeout(() => {
      setRenderKey(prev => prev + 1)
    }, 50)
  }
  const markGameAsPlayed = useUserStore(s => () => s.markGameAsPlayed(game.id, true))
  const [ready, setReady] = useState(false)
  const [txModal, setTxModal] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 750)
    return () => clearTimeout(timeout)
  }, [])

  // Reset splash screen when game changes
  useEffect(() => {
    console.log('Game changed, setting showSplash to true for game:', game.id)
    setShowSplash(true)
  }, [game.id])

  const closeInfo = () => {
    markGameAsPlayed()
    setInfo(false)
  }

  const handleSplashStart = () => {
    console.log('Splash start clicked, setting showSplash to false')
    setShowSplash(false)
    markGameAsPlayed()
  }

  console.log('CustomRenderer render:', { showSplash, ready, gameName: game.meta.name })

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
                        const target = e.target as HTMLImageElement
                        // Try WebP version first, then fallback to original
                        if (!target.src.includes('.webp')) {
                          const webpSrc = target.src.replace(/\.(png|jpg|jpeg)$/i, '.webp')
                          if (webpSrc.includes('/games/')) {
                            target.src = webpSrc
                            return
                          }
                        }
                        target.style.display = 'none'
                        const container = target.parentElement
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
                          `
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
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 12px 40px -4px #ff006699'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 8px 32px -4px #ff006688'
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
              <button onClick={() => { setInfo(false); setProvablyFair(false) }}
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
          {/* Stats header as separate area above game screen */}
          {ready && <GambaUi.PortalTarget target="stats" />}
          
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
                        animation: 'pulse 1.2s ease-in-out infinite'
                      }}
                    >
                      Loading
                    </text>
                  </g>
                  <style>{`
                    @keyframes spin {
                      100% { transform: rotate(360deg); }
                    }
                    @keyframes pulse {
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
                  headerReservedSpace: 60,
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
                console.warn('🚨 Portal Safety Warning:', status.reasons)
              }
            }}
          />
          <LoadingBar />
          <Controls style={{ opacity: showSplash ? 0.3 : 1, pointerEvents: showSplash ? 'none' : 'auto' }}>
            <div className="control-buttons">
              <GambaUi.PortalTarget target="controls" />
              <IconButton as="div" className="play-button-portal">
                <GambaUi.PortalTarget target="play" />
              </IconButton>
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
  )
}

export default function Game() {
  const { wallet, gameId } = useParams()
  const { publicKey } = useWallet()
  const walletAdapter = useWallet()
  const connectedWallet = publicKey?.toBase58()
  const [loading, setLoading] = useState(true)
  const [game, setGame] = useState<any | null>(null)
  
  // Track if wallet auto-connect attempt has finished to prevent error flash
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false)

  useEffect(() => {
    const gameFound = GAMES().find(
      (x) => x.id.toLowerCase() === gameId?.toLowerCase(),
    )
    setGame(gameFound || null)
    setLoading(false)
  }, [gameId])

  useEffect(() => {
    // If wallet.connecting just transitioned to false, mark auto-connect as attempted
    if (!walletAdapter.connecting) {
      setAutoConnectAttempted(true)
    }
  }, [walletAdapter.connecting])

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
    )
  }
  
  if (!connectedWallet) {
    return (
      <ErrorScreen
        type="400"
        message="Please connect your wallet to play."
      />
    )
  }
  if (wallet && connectedWallet.toLowerCase() !== wallet.toLowerCase()) {
    return (
      <ErrorScreen
        type="400"
        message="Wallet mismatch. Please reconnect with the correct wallet."
      />
    )
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
    )
  }

  if (!game) {
    return (
      <ErrorScreen
        type="404"
        message="Game not found. Please check the URL or try again later."
      />
    )
  }

  // Support custom .env variable for environment, fallback to GAMBA_ENV
  const env = import.meta.env.GAMBA_ENV || import.meta.env.MODE || '';
  const isProd = env === 'production';

  // Determine if games should be blocked based on feature flags
  const shouldBlockMaintenance = FEATURE_FLAGS.BLOCK_MAINTENANCE_GAMES && 
    (FEATURE_FLAGS.RESPECT_ENVIRONMENT_FOR_GAME_BLOCKING ? isProd : true);
  const shouldBlockCreating = FEATURE_FLAGS.BLOCK_CREATING_GAMES && 
    (FEATURE_FLAGS.RESPECT_ENVIRONMENT_FOR_GAME_BLOCKING ? isProd : true);

  if (shouldBlockMaintenance && game.maintenance) {
    return (
      <ErrorScreen
        type="503"
        message="🛠️ This game is currently under maintenance. Please check back later!"
      />
    )
  }

  if (shouldBlockCreating && game.creating) {
    return (
      <ErrorScreen
        type="1024"
        message="🧪 This game is being added soon. Check back for new games!"
      />
    )
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
  )
}
