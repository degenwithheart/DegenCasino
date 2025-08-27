import type { GameBundle } from '../../games/types'
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled, { keyframes, css } from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'

// WebP-aware image component for game cards
function OptimizedGameImage({ src, alt }: { src: string; alt: string }) {
  const [imageSrc, setImageSrc] = useState(() => {
    // Try WebP first if it's a PNG/JPG
    if (src.match(/\.(png|jpg|jpeg)$/i)) {
      return src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    }
    return src;
  });
  const [hasWebP, setHasWebP] = useState(true);

  const handleError = () => {
    if (hasWebP && imageSrc.includes('.webp')) {
      // Fallback to original image
      setHasWebP(false);
      setImageSrc(src);
    }
  };

  return (
    <div 
      className="image" 
      style={{ 
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: '100% auto',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      onError={handleError}
    />
  );
}


const tileAnimation = keyframes`
  0% {
    background-position: -100px 100px;
  }
  100% {
    background-position: 100px -100px;
  }
`

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`
const flip = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
`
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
`

const effectAnimations = {
  bounce,
  spin,
  flip,
  pulse,
  shake,
}

const StyledGameCard = styled.div<{ $small: boolean; $background: string; $effect?: string }>`
  width: 100%;
  aspect-ratio: ${(props) => (props.$small ? '1/.9' : '1/.9')};
  background-size: cover;
  border-radius: 10px;
  color: white;
  font-size: 24px;
  transition: all 0.3s ease;
  position: relative;
  background: ${(props) => props.$background};
  max-height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  background-size: 100% auto;
  background-position: center;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);

  & > .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url(/stuff.png);
    background-size: 100%;
    background-position: center;
    background-repeat: repeat;
    transition: transform 0.2s ease, opacity 0.3s;
    animation: ${tileAnimation} 5s linear infinite;
    opacity: 0;
    pointer-events: none;
    z-index: 2;
  }

  & > .image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-size: 100% auto;
    background-position: center;
    background-repeat: no-repeat;
    transition: transform 0.2s ease;
  }

  .play {
    font-size: 14px;
    border-radius: 8px;
    padding: 8px 16px;
    background: linear-gradient(90deg, #ffd700, #a259ff);
    color: #222;
    font-weight: bold;
    position: absolute;
    right: 8px;
    bottom: 8px;
    opacity: 0;
    text-transform: uppercase;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 16px #ffd70088;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    letter-spacing: 1px;
    border: none;
    transition: all 0.3s ease;
    z-index: 1;
  }

  &:hover {
    transform: scale(1.06) rotate(-1deg);
    border: 2px solid #ffd700;
    box-shadow: 0 0 32px #ffd700cc, 0 0 64px #a259ff88;

    .image {
      transform: scale(1.1);
      ${(props) => {
        const effect = props.$effect as keyof typeof effectAnimations;
        return effect && effectAnimations[effect]
          ? css`
              animation: ${effectAnimations[effect]} 0.6s;
            `
          : '';
      }}
      z-index: 1;
    }

    .background {
      opacity: 0.4;
      z-index: 2;
    }

    .play {
      opacity: 1;
      transform: scale(1.05);
      box-shadow: 0 0 24px #ffd700cc;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    border-radius: 10px;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease-in-out;
  }

  &:hover::before {
    opacity: 0.3;
  }

  @media (max-width: 600px) {
    font-size: 16px;
    border-radius: 7px;
    .play {
      font-size: 11px;
      border-radius: 6px;
      padding: 6px 10px;
      right: 4px;
      bottom: 4px;
    }
  }
`;

// New badge for the “VS” tag (or any other tag you choose)
const Tag = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 4px;
  text-transform: uppercase;
  z-index: 1;
`;

export function GameCard({ game, onClick }: { game: GameBundle; onClick?: () => void }) {
  const location = useLocation()
  const small = location.pathname !== '/'
  const navigate = useNavigate()
  const { publicKey } = useWallet()

  const handleClick = () => {
    if (!publicKey) return
    const wallet = publicKey.toBase58()
    navigate(`/game/${wallet}/${game.id}`)
    if (onClick) onClick()
  }

  return (
    <StyledGameCard
      onClick={handleClick}
      $small={small ?? false}
      $background={game.meta?.background}
      $effect={game.meta?.effect}
    >
      {game.meta?.tag && (
        <Tag>{game.meta.tag}</Tag>
      )}
      <div className="background" />
      <OptimizedGameImage src={game.meta.image} alt={game.meta.name} />
      {game.maintenance && (
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          fontSize: '2rem',
          background: 'rgba(0,0,0,0.7)',
          borderRadius: '50%',
          width: '2.2em',
          height: '2.2em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px #000a',
        }} title="Under Maintenance">
          🛠️
        </div>
      )}
      {game.creating && (
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          fontSize: '2rem',
          background: 'rgba(0,0,0,0.7)',
          borderRadius: '50%',
          width: '2.2em',
          height: '2.2em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px #000a',
        }} title="Coming Soon">
          🧪
        </div>
      )}
      <div className="play">Play {game.meta.name}</div>
    </StyledGameCard>
  )
}
