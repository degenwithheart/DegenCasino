import styled from 'styled-components';
// Styled modal content for info modal, matching casino modal look
const InfoModalContent = styled.div`
  width: 100vw;
  max-width: 80vw;
  min-width: 0;
  min-height: 350px;
  max-height: 500px;
  margin-bottom: 4rem;
  margin-top: 4rem;
  padding: 1rem;
  background: rgba(24, 24, 24, 0.95);
  border-radius: 1rem;
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  position: relative;
  color: white;
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
    border-radius: 24px;
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
    border-radius: 24px 24px 0 0;
    z-index: 1;
  }
  @media (max-width: 1200px) {
    padding: 1rem;
  }
  @media (max-width: 900px) {
    padding: 0.5rem;
  }
  @media (max-width: 700px) {
    min-height: 200px;
    padding: 0.25rem;
    border-radius: 10px;
    max-width: 98vw;
  }
`;
// src/sections/Game/Game.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { GambaUi, useSoundStore } from 'gamba-react-ui-v2'
import { useTransactionError } from 'gamba-react-v2'

import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'
import { GameSplashScreen } from '../../components/GameSplashScreen'
import { GAMES } from '../../games'
import { useUserStore } from '../../hooks/useUserStore'
import { GameSlider } from '../Dashboard/Dashboard'
import { Container, Controls, IconButton, MetaControls, Screen, Spinner, Splash } from './Game.styles'
import { LoadingBar } from './LoadingBar'
import { ProvablyFairModal } from './ProvablyFairModal'
import { TransactionModal } from './TransactionModal'
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
  const soundStore = useSoundStore()
  const firstTimePlaying = useUserStore(s => !s.gamesPlayed.includes(game.id))
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

  // global transaction errors
  useTransactionError(err => {
    if (err.message === 'NOT_CONNECTED') return
    // you might want to show a toast here
  })

// Styled modal content for info modal, matching casino modal look
const InfoModalContent = styled.div`
  width: 100vw;
  max-width: 80vw;
  min-width: 0;
  min-height: 350px;
  max-height: 500px;
  margin-bottom: 4rem;
  margin-top: 4rem;
  padding: 1rem;
  background: rgba(24, 24, 24, 0.95);
  border-radius: 1rem;
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  position: relative;
  color: white;
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
    border-radius: 24px;
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
    border-radius: 24px 24px 0 0;
    z-index: 1;
  }
  @media (max-width: 1200px) {
    padding: 1rem;
  }
  @media (max-width: 900px) {
    padding: 0.5rem;
  }
  @media (max-width: 700px) {
    min-height: 200px;
    padding: 0.25rem;
    border-radius: 10px;
    max-width: 98vw;
  }
`;

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
              borderRadius: '24px',
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
                padding: '3rem',
                maxWidth: '500px',
              }}>
                <div style={{
                  width: 160,
                  height: 160,
                  margin: '0 auto 2rem',
                  borderRadius: 32,
                  background: 'linear-gradient(145deg,#201826,#110b14)',
                  padding: 12,
                  position: 'relative',
                  boxShadow: '0 8px 32px -8px #ffae0055, 0 0 0 1px #ffffff0f, 0 0 24px -4px #ff6ec744'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 32,
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,215,0,0.3), transparent 70%)',
                    pointerEvents: 'none',
                    mixBlendMode: 'overlay'
                  }} />
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 24,
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
                              font-size: 4rem; 
                              color: #ffd700;
                            ">🎮</div>
                          `
                        }
                      }}
                    />
                  </div>
                </div>
                <h1 style={{ 
                  fontSize: 48, 
                  margin: '0 0 1rem 0', 
                  background: 'linear-gradient(90deg,#ffe27a,#ff5ba5)', 
                  WebkitBackgroundClip: 'text', 
                  color: 'transparent', 
                  fontWeight: 800 
                }}>
                  {game.meta.name}
                </h1>
                <p style={{ 
                  fontSize: 18, 
                  lineHeight: 1.6, 
                  color: '#ffffffc9', 
                  margin: '0 0 3rem 0' 
                }}>
                  Ready to test your luck? Click start when you're ready to play!
                </p>
                <button 
                  onClick={handleSplashStart} 
                  style={{
                    width: '200px', 
                    padding: '18px 24px', 
                    fontSize: 18, 
                    fontWeight: 700,
                    borderRadius: 16, 
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
              borderRadius: '24px',
              border: '2px solid rgba(255,215,0,.35)',
              background: 'linear-gradient(160deg,#121217 0%,#1d0b24 60%,#2d0040 100%)',
              boxShadow: '0 10px 50px -10px #ff008866, 0 0 0 1px #000',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <button onClick={() => { setInfo(false); setProvablyFair(false) }}
                style={{
                  position: 'absolute', top: 10, right: 10, width: 42, height: 42,
                  borderRadius: '50%', border: '1px solid #ffffff22',
                  background: 'linear-gradient(135deg,#ff0066,#ffae00)', color: 'white',
                  fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 18px #ff006655'
                }}>✕</button>
              {info && (
                <div style={{ padding: '56px 48px 40px 48px' }}>
                  <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{
                      width: 140,
                      height: 140,
                      margin: '0 auto 26px',
                      borderRadius: 32,
                      background: 'linear-gradient(145deg,#201826,#110b14)',
                      padding: 10,
                      position: 'relative',
                      boxShadow: '0 6px 28px -6px #ffae0055, 0 0 0 1px #ffffff0f, 0 0 18px -2px #ff6ec744'
                    }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 32,
                        background: 'radial-gradient(circle at 30% 30%, rgba(255,215,0,0.25), transparent 70%)',
                        pointerEvents: 'none',
                        mixBlendMode: 'overlay'
                      }} />
                      <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 24,
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
                    <h1 style={{ fontSize: 34, margin: 0, background: 'linear-gradient(90deg,#ffe27a,#ff5ba5)', WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: 800 }}>{game.meta.name}</h1>
                  </div>
                  <p style={{ fontSize: 16, lineHeight: 1.6, color: '#ffffffc9', margin: '0 0 28px' }}>{game.meta.description}</p>
                  <button onClick={() => setInfo(false)} style={{
                    width: '100%', padding: '15px 20px', fontSize: 16, fontWeight: 600,
                    borderRadius: 14, border: '1px solid #ffffff22', cursor: 'pointer',
                    background: 'linear-gradient(135deg,#ffae00,#ff0066)', color: '#fff',
                    boxShadow: '0 6px 24px -4px #ff006688', letterSpacing: '.5px'
                  }}>Play Now</button>
                </div>
              )}
              {provablyFair && (
                <div style={{ padding: '56px 48px 40px 48px' }}>
                  <ProvablyFairModal onClose={() => setProvablyFair(false)} inline />
                </div>
              )}
            </div>
          </div>
        </GambaUi.Portal>
      )}
      {txModal && <TransactionModal onClose={() => setTxModal(false)} />}
  {/* <GameSlider /> removed to prevent featured games from appearing on game pages */}
      <Container>
        <Screen>
          {!ready ? (
            <Splash>
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
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
                    fontSize="36"
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
          {ready && <GambaUi.PortalTarget target="screen" />}
        </Screen>
        <LoadingBar />
        <Controls style={{ opacity: showSplash ? 0.3 : 1, pointerEvents: showSplash ? 'none' : 'auto' }}>
          <div className="control-buttons">
            <GambaUi.PortalTarget target="controls" />
            <IconButton as="div" className="play-button-portal">
              <GambaUi.PortalTarget target="play" />
            </IconButton>
          </div>
          <MetaControls>
            <IconButton onClick={() => setInfo(true)} disabled={showSplash}>
              <Icon.Info />
            </IconButton>
            <IconButton onClick={() => setProvablyFair(true)} disabled={showSplash}>
              <Icon.Fairness />
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
  const connectedWallet = publicKey?.toBase58()
  const [loading, setLoading] = useState(true)
  const [game, setGame] = useState<any | null>(null)

  useEffect(() => {
    const gameFound = GAMES().find(
      (x) => x.id.toLowerCase() === gameId?.toLowerCase(),
    )
    setGame(gameFound || null)
    setLoading(false)
  }, [gameId])

  // Improved wallet param logic:
  // 1. If not connected, prompt to connect wallet.
  // 2. If connected and wallet param exists, require match.
  // 3. If connected and no wallet param, allow access.
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

  // Support custom .env variable for environment, fallback to NODE_ENV
  const env = (typeof process !== 'undefined' && (process.env.GAMBA_ENV || process.env.NODE_ENV)) || '';
  const isProd = env === 'production';

  if (isProd && game.maintenance) {
    return (
      <ErrorScreen
        type="503"
        message="🛠️ This game is currently under maintenance. Please check back later!"
      />
    )
  }

  if (isProd && game.creating) {
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
