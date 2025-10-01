import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { StyledFeaturedGameCard } from './FeaturedGameCard.styles'
import { useColorScheme } from '../../../themes/ColorSchemeContext'
import { useProgressiveLoading } from '../../../hooks/system/useProgressiveLoading'
import { FEATURED_GAMES } from '../../../games/featuredGames'
import { GAME_CAPABILITIES } from '../../../constants'

export function FeaturedGameCard({ game, onClick }: { game: { id: string; meta: { image?: string; background?: string }; live?: string }; onClick?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { publicKey } = useWallet()
  const { currentColorScheme } = useColorScheme()
  const { onGameHover, onGameClick } = useProgressiveLoading()

  // Check if this game is actually featured
  const isFeatured = FEATURED_GAMES.some((fg: any) => fg.id === game.id)

  // Check live status from the extended game properties
  const gameWithStatus = game as any // Cast to access extended properties
  const isDown = gameWithStatus.live === 'down'
  const isNew = gameWithStatus.live === 'new'

  // 2D/3D mode overlay logic
  const capabilities = GAME_CAPABILITIES[game.id as keyof typeof GAME_CAPABILITIES]
  let modeLabel = ''
  if (capabilities) {
    if (capabilities.supports2D && capabilities.supports3D) modeLabel = '2D | 3D'
    else if (capabilities.supports2D) modeLabel = '2D'
    else if (capabilities.supports3D) modeLabel = '3D'
  }

  const handleClick = () => {
    if (onClick) {
      // If custom onClick is provided, use it instead of default navigation
      onClick()
    } else {
      // Default behavior: navigate to game
      if (!publicKey) return
      const wallet = publicKey.toBase58()
      onGameClick(game.id) // Track game click for analytics
      navigate(`/game/${wallet}/${game.id}`)
    }
  }

  return (
    <StyledFeaturedGameCard 
      onClick={handleClick} 
      $background={game.meta.background ?? ''} 
      $colorScheme={currentColorScheme}
      {...onGameHover(game.id)} // Add hover preloading
    >
  <div className="image" style={{ backgroundImage: `url(${game.meta.image ?? ''})` }} />
      
      {/* Featured badge - only show if this game is actually featured */}
      {isFeatured && (
        <div className="featured-badge">🌟</div>
      )}
      
      {/* Live status icons (top-right) */}
      {isDown && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'linear-gradient(90deg, #ff6b35, #ffd700)',
          color: '#222',
          fontSize: '0.95rem',
          fontWeight: 'bold',
          borderRadius: '8px',
          padding: '4px 12px',
          boxShadow: '0 0 12px #ff6b3588',
          zIndex: 2,
          fontFamily: "'Luckiest Guy', cursive, sans-serif",
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }} title="Under Maintenance">
          🛠️
        </div>
      )}
      {isNew && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'linear-gradient(90deg, #a259ff, #6ffaff)',
          color: '#222',
          fontSize: '0.95rem',
          fontWeight: 'bold',
          borderRadius: '8px',
          padding: '4px 12px',
          boxShadow: '0 0 12px #a259ff88',
          zIndex: 2,
          fontFamily: "'Luckiest Guy', cursive, sans-serif",
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }} title="Coming Soon">
          🧪
        </div>
      )}
      {/* 2D/3D mode overlay (bottom right) */}
      {modeLabel && (
        <div className="mode-overlay" title="Supported Modes">
          {modeLabel}
        </div>
      )}
    </StyledFeaturedGameCard>
  )
}
