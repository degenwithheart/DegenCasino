import type { GameBundle } from '../../games/types'
import React, { useState } from 'react'
import { useHoverPrefetch } from '../../hooks/usePrefetch'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { StyledGameCard, Tag, tileAnimation, bounce, spin, flip, shake, effectAnimations } from './GameCard.styles'
import { SmartImage } from '../../components/UI/SmartImage'

// Replaced by SmartImage for unified quality handling


export function GameCard({ game, onClick }: { game: GameBundle; onClick?: () => void }) {
  const location = useLocation()
  const small = location.pathname !== '/'
  const navigate = useNavigate()
  const { publicKey } = useWallet()

  const doPrefetch = useHoverPrefetch(`game-${game.id}`, () => import('../../sections/Game/Game'))

  const handleClick = () => {
    if (!publicKey) return
    const wallet = publicKey.toBase58()
    navigate(`/game/${wallet}/${game.id}`)
    if (onClick) onClick()
  }

  return (
    <StyledGameCard
      onClick={handleClick}
      onMouseEnter={doPrefetch}
      onFocus={doPrefetch}
      $small={small ?? false}
      $background={game.meta?.background}
      $effect={game.meta?.effect}
    >
      {game.meta?.tag && (
        <Tag>{game.meta.tag}</Tag>
      )}
      <div className="background" />
      <div className="image" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <SmartImage src={game.meta.image} alt={game.meta.name} style={{maxWidth:'100%', maxHeight:'100%', borderRadius:8}} />
      </div>
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
