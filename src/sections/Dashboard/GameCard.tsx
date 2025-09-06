import type { GameBundle } from '../../games/types'
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { StyledGameCard, Tag, tileAnimation, bounce, spin, flip, shake, effectAnimations } from './GameCard.styles'

// WebP-aware image component for game cards
function OptimizedGameImage({ src, alt }: { src: string; alt: string }) {
  const [imageSrc, setImageSrc] = useState(() => {
    // Try WebP first if it's a PNG/JPG from games directory
    if (src.match(/\.(png|jpg|jpeg)$/i)) {
      // Convert /games/image.png to /webp/games/image.webp
      const webpPath = src.replace(/\/(games\/[^/]+)\.(png|jpg|jpeg)$/i, '/webp/$1.webp');
      return webpPath;
    }
    return src;
  });
  const [hasWebP, setHasWebP] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleError = () => {
    if (hasWebP && imageSrc.includes('.webp')) {
      // Fallback to original image
      setHasWebP(false);
      setImageSrc(src);
    }
  };

  const handleLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      {/* Hidden img element to handle loading/error events */}
      <img
        src={imageSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        style={{ display: 'none' }}
      />
      {/* Visible div with background image */}
      <div 
        className="image" 
        style={{ 
          backgroundImage: imageLoaded ? `url(${imageSrc})` : 'none',
          backgroundSize: '100% auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
    </>
  );
}


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
