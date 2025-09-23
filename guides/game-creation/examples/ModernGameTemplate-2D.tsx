import React, { useState, useCallback } from 'react';
import { useGamba } from 'gamba-react-v2';
import { GambaUi, useWagerInput } from 'gamba-react-ui-v2';
// Audio imports
import { SOUND_LOSE, SOUND_TICK, SOUND_PLAY, SOUND_WIN } from './constants';

/**
 * 2D Renderer Component for Modern Game Template
 * 
 * This demonstrates the 2D Canvas-based rendering approach used in DegenHeart Casino games.
 * Features include Canvas rendering, audio integration, and Gamba portal system.
 */
const ModernGameTemplate2D: React.FC = () => {
  const gamba = useGamba();
  const [wager, setWager] = useWagerInput();
  const game = GambaUi.useGame();

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [result, setResult] = useState<number | null>(null);
  const [lastWin, setLastWin] = useState<number>(0);

  // Audio management
  const playSound = (soundFile: string) => {
    try {
      const audio = new Audio(soundFile);
      audio.volume = 0.3; // Adjust volume as needed
      audio.play();
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  };

  const play = async () => {
    if (gamba.isPlaying) return;

    setGameState('playing');
    setResult(null);
    playSound(SOUND_PLAY);

    try {
      // Example bet array - adjust for your game logic
      // This creates: 40% chance for 0x, 30% chance for 2x, 20% chance for 0x, 10% chance for 5x
      const bet = [0, 2, 0, 5]; 

      await game.play({ wager, bet });
      const gameResult = await game.result();

      setResult(gameResult.resultIndex);
      setLastWin(gameResult.payout);
      setGameState('finished');

      // Play appropriate sound
      if (gameResult.payout > 0) {
        playSound(SOUND_WIN);
      } else {
        playSound(SOUND_LOSE);
      }

      // Auto-reset after 3 seconds
      setTimeout(() => {
        setGameState('idle');
        setResult(null);
      }, 3000);

    } catch (error) {
      console.error('Game error:', error);
      setGameState('idle');
      playSound(SOUND_LOSE);
    }
  };

  // Canvas rendering function
  const renderCanvas = useCallback(({ ctx, size, clock }) => {
    // Clear canvas
    ctx.clearRect(0, 0, size.width, size.height);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, size.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size.width, size.height);

    // Game content
    const centerX = size.width / 2;
    const centerY = size.height / 2;

    // Main text
    ctx.fillStyle = gameState === 'playing' ? '#ffd700' : '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    
    if (gameState === 'idle') {
      ctx.fillText('🎯 Click to Play!', centerX, centerY - 20);
      
      // Instructions
      ctx.font = '16px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('Bet on the outcome - Good luck!', centerX, centerY + 20);
      
    } else if (gameState === 'playing') {
      // Animated playing state
      const dots = '.'.repeat((Math.floor(clock * 0.003) % 3) + 1);
      ctx.fillText(`🎲 Playing${dots}`, centerX, centerY);
      
    } else if (gameState === 'finished' && result !== null) {
      // Result display
      const isWin = result === 1 || result === 3; // Based on our bet array
      ctx.fillStyle = isWin ? '#00ff88' : '#ff4757';
      ctx.fillText(isWin ? '🎉 You Win!' : '💸 Try Again!', centerX, centerY - 30);
      
      // Payout information
      if (lastWin > 0) {
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#ffd700';
        ctx.fillText(`+${(lastWin / 1e9).toFixed(3)} SOL`, centerX, centerY + 10);
      }
    }

    // Animated decoration
    if (gameState === 'playing') {
      const pulse = Math.sin(clock * 0.008) * 0.5 + 0.5;
      const radius = 30 + pulse * 15;
      
      ctx.globalAlpha = 0.3 + pulse * 0.4;
      
      // Spinning circle
      ctx.save();
      ctx.translate(centerX, centerY + 80);
      ctx.rotate(clock * 0.01);
      
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#a259ff';
      ctx.fill();
      
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    // Game state indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(10, 10, 150, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`State: ${gameState}`, 20, 30);

  }, [gameState, result, lastWin]);

  return (
    <>
      <GambaUi.Portal target="screen">
        <div 
          style={{ 
            width: '100%', 
            height: '100%',
            cursor: gameState === 'idle' ? 'pointer' : 'default'
          }} 
          onClick={gameState === 'idle' ? play : undefined}
        >
          <GambaUi.Canvas render={renderCanvas} />
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          alignItems: 'center',
          padding: '1rem',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '8px'
        }}>
          <GambaUi.WagerInput value={wager} onChange={setWager} />
          <GambaUi.PlayButton 
            onClick={play} 
            disabled={gamba.isPlaying || gameState !== 'idle'}
          >
            {gameState === 'playing' ? 'Playing...' : 'Play Game'}
          </GambaUi.PlayButton>
        </div>
      </GambaUi.Portal>

      {/* Optional stats portal */}
      <GambaUi.Portal target="stats">
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          alignItems: 'center',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          <span>🎮 2D Mode</span>
          <span>RTP: 96%</span>
          <span>Max Win: 5x</span>
        </div>
      </GambaUi.Portal>
    </>
  );
};

export default ModernGameTemplate2D;