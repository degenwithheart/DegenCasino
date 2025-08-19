import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { GambaUi } from 'gamba-react-ui-v2'
import { PublicKey } from '@solana/web3.js'
import { Lobby, GameScreen, DebugGameScreen } from './components'

const StyledBlackJackV1Background = styled.div`
  background: radial-gradient(ellipse at center, rgba(16, 20, 40, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%),
              linear-gradient(135deg, #0f172a, #1e293b);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
  
  .blackjack-header {
    background: rgba(0, 0, 0, 0.7);
    border-radius: 12px;
    padding: 16px 24px;
    border: 1px solid rgba(220, 38, 38, 0.3);
    backdrop-filter: blur(10px);
  }
`

export default function BlackJackV1() {
  const [selectedGame, setSelectedGame] = useState<PublicKey | null>(null)
  const [debugMode, setDebugMode] = useState(false)

  const handleBack = useCallback(() => {
    setSelectedGame(null)
    setDebugMode(false)
  }, [])

  return (
    <GambaUi.Portal target="screen">
      <StyledBlackJackV1Background style={{ pointerEvents: 'none' }}>
        {/* Themed Header */}
        <div className="blackjack-header" style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 3,
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <h2 style={{ 
            color: '#f0f0ff', 
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)', 
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold'
          }}>🃏 BLACKJACK DUEL</h2>
          <p style={{ 
            color: '#d0d0ea', 
            textShadow: '1px 1px 2px rgba(0,0,0,0.6)', 
            margin: 0,
            fontSize: '14px'
          }}>Where Skill Meets Chance in 1v1 Combat</p>
        </div>

        <div style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
          {debugMode ? (
            <DebugGameScreen onBack={() => setDebugMode(false)} />
          ) : selectedGame ? (
            <GameScreen gameId={selectedGame} onBack={handleBack} />
          ) : (
            <Lobby
              onSelect={setSelectedGame}
              onDebug={() => setDebugMode(true)}
            />
          )}
        </div>
      </StyledBlackJackV1Background>
    </GambaUi.Portal>
  )
}
