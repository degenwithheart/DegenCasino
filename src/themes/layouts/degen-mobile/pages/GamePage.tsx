import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { GambaUi } from 'gamba-react-ui-v2'
import styled from 'styled-components'
import { useGameLoading } from '../contexts/GameLoadingContext'
import { useColorScheme } from '../../../ColorSchemeContext'
import { spacing } from '../breakpoints'

// Mobile-optimized error display
const MobileErrorContainer = styled.div<{ $colorScheme: any }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: ${spacing.lg};
  text-align: center;
  background: ${props => props.$colorScheme.colors.surface}20;
  border-radius: 16px;
  margin: ${spacing.base};
`

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${spacing.base};
`

const ErrorTitle = styled.h2<{ $colorScheme: any }>`
  color: ${props => props.$colorScheme.colors.primary};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: ${spacing.sm};
`

const ErrorMessage = styled.p<{ $colorScheme: any }>`
  color: ${props => props.$colorScheme.colors.text}80;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: ${spacing.lg};
`

const RetryButton = styled.button<{ $colorScheme: any }>`
  background: ${props => props.$colorScheme.colors.primary};
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: ${spacing.sm} ${spacing.lg};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$colorScheme.colors.accent};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const LoadingContainer = styled.div<{ $colorScheme: any }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: ${props => props.$colorScheme.colors.text};
`

const Spinner = styled.div<{ $colorScheme: any }>`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.$colorScheme.colors.surface};
  border-top: 3px solid ${props => props.$colorScheme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: ${spacing.base};
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

// Mobile Game Loading Error Component
const MobileGameError: React.FC<{ 
  gameId: string; 
  onRetry: () => void;
  onGoHome: () => void;
  onLoadDesktop: () => void;
}> = ({ gameId, onRetry, onGoHome, onLoadDesktop }) => {
  const { currentColorScheme } = useColorScheme()
  
  return (
    <MobileErrorContainer $colorScheme={currentColorScheme}>
      <ErrorIcon>📱</ErrorIcon>
      <ErrorTitle $colorScheme={currentColorScheme}>
        Mobile Version Not Available
      </ErrorTitle>
      <ErrorMessage $colorScheme={currentColorScheme}>
        <strong>{gameId}</strong> doesn't have a mobile-optimized version yet.
        <br />
        You can still play the desktop version, but it may not be fully optimized for touch controls.
      </ErrorMessage>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, width: '100%' }}>
        <RetryButton $colorScheme={currentColorScheme} onClick={onLoadDesktop}>
          🖥️ Load Desktop Version
        </RetryButton>
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <RetryButton 
            $colorScheme={currentColorScheme} 
            onClick={onRetry}
            style={{ background: currentColorScheme.colors.surface }}
          >
            Try Again
          </RetryButton>
          <RetryButton 
            $colorScheme={currentColorScheme} 
            onClick={onGoHome}
            style={{ background: currentColorScheme.colors.surface }}
          >
            Browse Games
          </RetryButton>
        </div>
      </div>
    </MobileErrorContainer>
  )
}

export default function DegenMobileGamePage() {
  const { wallet, gameId } = useParams()
  const { publicKey } = useWallet()
  const walletAdapter = useWallet()
  const navigate = useNavigate()
  const { currentColorScheme } = useColorScheme()
  const { getDeviceAwareGames, getDesktopGames, deviceType, shouldUseMobileGames } = useGameLoading()
  
  const [loading, setLoading] = useState(true)
  const [game, setGame] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false)

  const loadGame = () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log(`🎮 Loading game ${gameId} on ${deviceType} device`)
      console.log(`📱 Should use mobile games: ${shouldUseMobileGames}`)
      
      // Use device-aware games from context
      const deviceAwareGames = getDeviceAwareGames()      
      const game = deviceAwareGames.find(
        (x) => x.id.toLowerCase() === gameId?.toLowerCase(),
      )
      
      if (!game) {
        setGame(null)
        setLoading(false)
        return
      }

      setGame(game)
      setLoading(false)
      
    } catch (err: any) {
      console.error('Game loading error:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGame()
  }, [gameId])

  useEffect(() => {
    if (!walletAdapter.connecting) {
      setAutoConnectAttempted(true)
    }
  }, [walletAdapter.connecting])

  const connectedWallet = publicKey?.toBase58()

  // Don't show wallet errors until auto-connect has been attempted
  if (!autoConnectAttempted || walletAdapter.connecting) {
    return (
      <LoadingContainer $colorScheme={currentColorScheme}>
        <Spinner $colorScheme={currentColorScheme} />
        <p>Connecting...</p>
      </LoadingContainer>
    )
  }

  // Loading state
  if (loading) {
    return (
      <LoadingContainer $colorScheme={currentColorScheme}>
        <Spinner $colorScheme={currentColorScheme} />
        <p>Loading game...</p>
      </LoadingContainer>
    )
  }

  // Wallet connection required
  if (!connectedWallet) {
    return (
      <MobileErrorContainer $colorScheme={currentColorScheme}>
        <ErrorIcon>🔐</ErrorIcon>
        <ErrorTitle $colorScheme={currentColorScheme}>
          Wallet Required
        </ErrorTitle>
        <ErrorMessage $colorScheme={currentColorScheme}>
          Please connect your wallet to play games.
        </ErrorMessage>
        <RetryButton 
          $colorScheme={currentColorScheme} 
          onClick={() => {
            if (walletAdapter.wallet) {
              walletAdapter.connect()
            } else {
              // Handle wallet selection - you'll need to implement this based on your wallet modal
              console.log('Need to show wallet selection')
            }
          }}
        >
          Connect Wallet
        </RetryButton>
      </MobileErrorContainer>
    )
  }

  // Wallet mismatch
  if (wallet && connectedWallet.toLowerCase() !== wallet.toLowerCase()) {
    return (
      <MobileErrorContainer $colorScheme={currentColorScheme}>
        <ErrorIcon>⚠️</ErrorIcon>
        <ErrorTitle $colorScheme={currentColorScheme}>
          Wallet Mismatch
        </ErrorTitle>
        <ErrorMessage $colorScheme={currentColorScheme}>
          Please reconnect with the correct wallet.
        </ErrorMessage>
        <RetryButton 
          $colorScheme={currentColorScheme} 
          onClick={() => {
            if (walletAdapter.wallet) {
              walletAdapter.connect()
            }
          }}
        >
          Reconnect Wallet
        </RetryButton>
      </MobileErrorContainer>
    )
  }

  // Mobile version not available error
  if (error && shouldUseMobileGames && error.includes('MOBILE_VERSION_NOT_AVAILABLE:')) {
    const errorGameId = error.split(':')[1] || gameId || 'unknown'
    return (
      <MobileGameError 
        gameId={errorGameId}
        onRetry={loadGame}
        onGoHome={() => navigate('/')}
        onLoadDesktop={() => {
          // Load desktop version directly from original games
          const desktopGames = getDesktopGames()
          const desktopGame = desktopGames.find(g => g.id === gameId)
          if (desktopGame) {
            setGame(desktopGame.app)
            setError(null)
          } else {
            setError('Desktop version not found')
          }
        }}
      />
    )
  }

  // Other mobile errors
  if (error && shouldUseMobileGames) {
    return (
      <MobileErrorContainer $colorScheme={currentColorScheme}>
        <ErrorIcon>📱</ErrorIcon>
        <ErrorTitle $colorScheme={currentColorScheme}>
          Mobile Loading Error
        </ErrorTitle>
        <ErrorMessage $colorScheme={currentColorScheme}>
          {error}
        </ErrorMessage>
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <RetryButton 
            $colorScheme={currentColorScheme} 
            onClick={loadGame}
          >
            Try Again
          </RetryButton>
          <RetryButton 
            $colorScheme={currentColorScheme} 
            onClick={() => navigate('/')}
            style={{ background: currentColorScheme.colors.surface }}
          >
            Browse Games
          </RetryButton>
        </div>
      </MobileErrorContainer>
    )
  }

  // Game not found
  if (!game) {
    return (
      <MobileErrorContainer $colorScheme={currentColorScheme}>
        <ErrorIcon>🎲</ErrorIcon>
        <ErrorTitle $colorScheme={currentColorScheme}>
          Game Not Found
        </ErrorTitle>
        <ErrorMessage $colorScheme={currentColorScheme}>
          The game you're looking for doesn't exist.
        </ErrorMessage>
        <RetryButton 
          $colorScheme={currentColorScheme} 
          onClick={() => navigate('/')}
        >
          Browse Games
        </RetryButton>
      </MobileErrorContainer>
    )
  }

  // Load the game
  return (
    <GambaUi.Game game={game}>
      {/* Game content will render here */}
    </GambaUi.Game>
  )
}