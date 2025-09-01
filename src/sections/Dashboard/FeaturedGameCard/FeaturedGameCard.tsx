import { GameBundle } from 'gamba-react-ui-v2'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { StyledFeaturedGameCard } from './FeaturedGameCard.styles'

export function FeaturedGameCard({ game }: { game: GameBundle }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { publicKey } = useWallet()

  const handleClick = () => {
    if (!publicKey) return
    const wallet = publicKey.toBase58()
    navigate(`/game/${wallet}/${game.id}`)
  }

  return (
    <StyledFeaturedGameCard onClick={handleClick} $background={game.meta?.background}>
      <div className="image" style={{ backgroundImage: `url(${game.meta.image})` }} />
      <div className="featured-badge">🌟</div>
      <div className="play">Play {game.meta.name}</div>
    </StyledFeaturedGameCard>
  )
}
