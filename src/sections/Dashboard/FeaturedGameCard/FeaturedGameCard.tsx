import { GameBundle } from 'gamba-react-ui-v2'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { StyledFeaturedGameCard } from './FeaturedGameCard.styles'
import { FEATURED_GAMES } from '../../../games/featuredGames'

export function FeaturedGameCard({ game, onClick }: { game: GameBundle; onClick?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { publicKey } = useWallet()

  // Check if this game is actually featured
  const isFeatured = FEATURED_GAMES.some((fg: any) => fg.id === game.id)

  // Check live status from the extended game properties
  const gameWithStatus = game as any // Cast to access extended properties
  const isDown = gameWithStatus.live === 'down'
  const isNew = gameWithStatus.live === 'new'

  const handleClick = () => {
    if (!publicKey) return
    const wallet = publicKey.toBase58()
    navigate(`/game/${wallet}/${game.id}`)
    if (onClick) onClick()
  }

  return (
    <StyledFeaturedGameCard onClick={handleClick} $background={game.meta?.background}>
      <div className="image" style={{ backgroundImage: `url(${game.meta.image})` }} />
      
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
    </StyledFeaturedGameCard>
  )
}
