import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { GambaUi, useSoundStore } from 'gamba-react-ui-v2'
import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'
import { GAMES } from '../../games'
import { useUserStore } from '../../hooks/useUserStore'
import {
  Container,
  Controls,
  IconButton,
  MetaControls,
  Screen,
  Spinner,
  Splash,
} from './Game.styles'
import { LoadingBar } from './LoadingBar'
import { ProvablyFairModal } from './ProvablyFairModal'
import { TransactionModal } from './TransactionModal'
import styled, { keyframes } from 'styled-components';

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
  height: 250px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #181828;
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

const errorImages: Record<string, string> = {
  '400': '/error-wallet.png', // e.g. wallet mismatch
  '404': '/error-404.png',   // game not found
  '500': '/error-500.png',   // render error
  '503': '/error-maintenance.png', // maintenance
  '1024': '/error-newgame.png', // game being added
  'default': '/error-generic.png',
};

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
        marginTop: '20px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 0 30px rgba(255,255,255,0.15)',
        marginLeft: 'auto',
        marginRight: 'auto',
        background: '#000',
        maxWidth: '800px',
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

function CustomRenderer() {
  const { game } = GambaUi.useGame()
  const [info, setInfo] = useState(false)
  const [provablyFair, setProvablyFair] = useState(false)
  const soundStore = useSoundStore()
  const firstTimePlaying = useUserStore(
    (state) => !state.gamesPlayed.includes(game.id),
  )
  const markGameAsPlayed = useUserStore((state) => () =>
    state.markGameAsPlayed(game.id, true),
  )
  const [ready, setReady] = useState(false)
  const [txModal, setTxModal] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 750)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => setInfo(firstTimePlaying), 1000)
    return () => clearTimeout(timeout)
  }, [firstTimePlaying])

  const closeInfo = () => {
    markGameAsPlayed()
    setInfo(false)
  }

  return (
    <>
      {info && (
        <Modal onClose={closeInfo}>
          <div style={{
            maxWidth: '420px',
            margin: '60px auto 0 auto',
            background: 'linear-gradient(145deg, rgba(20,20,25,0.95) 0%, rgba(15,15,20,0.98) 100%)',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            {/* Hero Section */}
            <div style={{
              position: 'relative',
              padding: '40px 32px 40px 32px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(0,255,225,0.05) 0%, rgba(102,126,234,0.08) 100%)'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 24px auto',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0,255,225,0.2) 0%, rgba(102,126,234,0.3) 100%)',
                padding: '6px',
                boxShadow: '0 12px 48px rgba(0,255,225,0.2)'
              }}>
                <img 
                  src={game.meta.image} 
                  alt={game.meta.name}
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    background: '#1a1a1f'
                  }}
                />
              </div>
              
              <h1 style={{
                margin: '0 0 16px 0',
                fontSize: '28px',
                fontWeight: '700',
                color: 'white',
                letterSpacing: '-0.5px'
              }}>
                {game.meta.name}
              </h1>
              
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0,255,225,0.15)',
                padding: '10px 20px',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#00ffe1',
                border: '1px solid rgba(0,255,225,0.3)'
              }}>
                <span>🎮</span>
                Ready to play?
              </div>
            </div>

            {/* Description */}
            <div style={{
              padding: '0 32px 32px 32px'
            }}>
              <p style={{
                margin: '0 0 28px 0',
                fontSize: '15px',
                lineHeight: '1.6',
                color: 'rgba(255,255,255,0.8)',
                textAlign: 'center'
              }}>
                {game.meta.description}
              </p>

              {/* Play button */}
              <button 
                onClick={closeInfo}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #00ffe1 0%, #00bcd4 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 20px rgba(0,255,225,0.3)'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement
                  target.style.transform = 'translateY(-1px)'
                  target.style.boxShadow = '0 6px 25px rgba(0,255,225,0.4)'
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement
                  target.style.transform = 'translateY(0)'
                  target.style.boxShadow = '0 4px 20px rgba(0,255,225,0.3)'
                }}
              >
                Let's Play
              </button>
            </div>
          </div>
        </Modal>
      )}
      {provablyFair && <ProvablyFairModal onClose={() => setProvablyFair(false)} />}
      {txModal && <TransactionModal onClose={() => setTxModal(false)} />}
      <Container>
        <Screen>
          <Splash>
            <img height="150px" src={game.meta.image} />
          </Splash>
          <GambaUi.PortalTarget target="error" />
          {ready && <GambaUi.PortalTarget target="screen" />}
          <MetaControls>
            <IconButton onClick={() => setInfo(true)}>
              <Icon.Info />
            </IconButton>
            <IconButton onClick={() => setProvablyFair(true)}>
              <Icon.Fairness />
            </IconButton>
            <IconButton
              onClick={() => soundStore.set(soundStore.volume ? 0 : 0.5)}
            >
              {soundStore.volume ? <Icon.Volume /> : <Icon.VolumeMuted />}
            </IconButton>
          </MetaControls>
        </Screen>
        <LoadingBar />
        <Controls>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GambaUi.PortalTarget target="controls" />
            <GambaUi.PortalTarget target="play" />
          </div>
        </Controls>
      </Container>
    </>
  )
}

export default function Game() {
  const { wallet, gameName } = useParams<{ wallet: string; gameName: string }>()
  const { publicKey } = useWallet()
  const connectedWallet = publicKey?.toBase58()
  const [loading, setLoading] = useState(true)
  const [game, setGame] = useState<any | null>(null)

  useEffect(() => {
    const gameFound = GAMES().find(
      (x) => x.id.toLowerCase() === gameName?.toLowerCase(),
    )
    setGame(gameFound || null)
    setLoading(false)
  }, [gameName])

  if (!connectedWallet || connectedWallet.toLowerCase() !== wallet?.toLowerCase()) {
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
        <ErrorScreen
          type="500"
          message="Something went wrong while loading the game."
        />
      }
    >
      <ErrorBoundary>
        <CustomRenderer />
      </ErrorBoundary>
    </GambaUi.Game>
  )
}
