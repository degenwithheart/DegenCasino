import React, { useState, useCallback } from 'react';
import { GambaUi }                       from 'gamba-react-ui-v2';
import type { PublicKey }                from '@solana/web3.js';

import Lobby            from './components/Lobby';
import GameScreen       from './components/GameScreen';
import DebugGameScreen  from './components/DebugGameScreen';
import { StyledPlinkoRaceBackground } from './PlinkoRaceBackground.enhanced.styles';

export default function PlinkoRace() {
  const [selectedGame, setSelectedGame] = useState<PublicKey | null>(null);
  const [debugMode,    setDebugMode]    = useState(false);

  const handleBack = useCallback(() => {
    setSelectedGame(null);
    setDebugMode(false);
  }, []);

  return (
    <GambaUi.Portal target="screen">
      <StyledPlinkoRaceBackground style={{ pointerEvents: 'none' }}>
        {/* Velocity vortex background elements */}
        <div className="velocity-bg-elements" />
        <div className="race-whispers-overlay" />
        <div className="lightning-speed-indicator" />
        
        {/* Themed Header */}
        <div className="plinko-header" style={{ 
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
          }}>⚡ PLINKO RACE</h2>
          <p style={{ 
            color: '#d0d0ea', 
            textShadow: '1px 1px 2px rgba(0,0,0,0.6)', 
            margin: 0,
            fontSize: '14px'
          }}>Where Lightning Strikes the Fastest</p>
        </div>

        <div style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
          {debugMode ? (
            <DebugGameScreen onBack={() => setDebugMode(false)} />
          ) : selectedGame ? (
            <GameScreen pk={selectedGame} onBack={handleBack} />
          ) : (
            <Lobby
              onSelect={setSelectedGame}
              onDebug ={() => setDebugMode(true)}
            />
          )}
        </div>
      </StyledPlinkoRaceBackground>
    </GambaUi.Portal>
  );
}
