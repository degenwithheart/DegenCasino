import { GameBundle } from 'gamba-react-ui-v2'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled, { keyframes, css } from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'

// Unique animation for featured games
const featuredGlow = keyframes`
  0% { box-shadow: 0 0 24px #ffd70088, 0 0 48px #a259ff44; }
  100% { box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88; }
`;

const StyledFeaturedGameCard = styled.div<{ $background: string }>`
  width: 100%;
  aspect-ratio: 1/.9;
  background: ${(props) => props.$background};
  border-radius: 14px;
  color: white;
  font-size: 26px;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #ffd700;
  box-shadow: 0 0 32px #ffd700cc, 0 0 64px #a259ff88;
  animation: ${featuredGlow} 1.5s infinite alternate;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.08) rotate(-2deg);
    box-shadow: 0 0 64px #ffd700cc, 0 0 128px #a259ff88;
  }

  .image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-size: 100% auto;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.95;
    z-index: 0;
  }

  .featured-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: linear-gradient(90deg, #ffd700, #a259ff);
    color: #222;
    font-size: 0.95rem;
    font-weight: bold;
    border-radius: 8px;
    padding: 4px 12px;
    box-shadow: 0 0 12px #ffd70088;
    z-index: 2;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    letter-spacing: 1px;
  }

  .play {
    position: absolute;
    right: 12px;
    bottom: 12px;
    background: linear-gradient(90deg, #ffd700, #a259ff);
    color: #222;
    font-weight: bold;
    border-radius: 8px;
    padding: 8px 18px;
    font-size: 15px;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    letter-spacing: 1px;
    box-shadow: 0 0 16px #ffd70088;
    z-index: 2;
    opacity: 0;
    transition: all 0.2s;
  }

  &:hover .play {
    opacity: 0.95;
    transform: scale(1.05);
    box-shadow: 0 0 24px #ffd700cc;
  }
`;

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
