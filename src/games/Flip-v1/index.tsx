import React, { useState, useCallback } from 'react';
import { GambaUi } from 'gamba-react-ui-v2';
import type { PublicKey } from '@solana/web3.js';
import styled, { keyframes } from 'styled-components';

import { Lobby, GameScreen, DebugGameScreen } from './components';

const silverPulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
`

const duelGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(192, 192, 192, 0.3); }
  50% { box-shadow: 0 0 40px rgba(192, 192, 192, 0.6); }
`

const StyledFlipV1Background = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse at center, 
    rgba(25, 25, 35, 0.95) 0%, 
    rgba(15, 15, 25, 0.98) 60%, 
    rgba(5, 5, 15, 1) 100%);

  .duel-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    
    &::before {
      content: '';
      position: absolute;
      top: 20%;
      left: 10%;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(192, 192, 192, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      animation: ${silverPulse} 4s ease-in-out infinite;
    }
  }

  .flip-header {
    background: rgba(0, 0, 0, 0.7);
    border-radius: 12px;
    padding: 16px 24px;
    border: 1px solid rgba(192, 192, 192, 0.2);
    animation: ${duelGlow} 4s ease-in-out infinite;
    backdrop-filter: blur(10px);
  }
`

export default function FlipV1() {
  const [selectedGame, setSelectedGame] = useState<PublicKey | null>(null);
  const [debugMode, setDebugMode] = useState(false);

  const handleBack = useCallback(() => {
    setSelectedGame(null);
    setDebugMode(false);
  }, []);

  return (
    <GambaUi.Portal target="screen">
      <StyledFlipV1Background style={{ pointerEvents: 'none' }}>
        {/* Enhanced multiplayer background elements */}
        <div className="duel-bg-elements" />
        <div className="silver-whispers-overlay" />
        <div className="destiny-duel-indicator" />
        
        {/* Themed Header */}
        <div className="flip-header" style={{ 
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
          }}>🪙 FLIP DUEL</h2>
          <p style={{ 
            color: '#d0d0ea', 
            textShadow: '1px 1px 2px rgba(0,0,0,0.6)', 
            margin: 0,
            fontSize: '14px'
          }}>Where Silver Truths Collide in 1v1 Combat</p>
        </div>

        <div style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
          {debugMode ? (
            <DebugGameScreen onBack={() => setDebugMode(false)} />
          ) : selectedGame ? (
            <GameScreen pk={selectedGame} onBack={handleBack} />
          ) : (
            <Lobby
              onSelect={setSelectedGame}
              onDebug={() => setDebugMode(true)}
            />
          )}
        </div>
      </StyledFlipV1Background>
    </GambaUi.Portal>
  );
}
