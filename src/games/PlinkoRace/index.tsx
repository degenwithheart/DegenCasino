import React, { useState, useCallback } from 'react';
import { GambaUi, useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2';
import { useGameState, GameStateProvider } from '../../hooks/useGameState';
import { useGambaResult } from '../../hooks/useGambaResult';
import { useIsCompact } from '../../hooks/useIsCompact';
import { renderThinkingOverlay } from '../../utils/overlayUtils';
import { TOKEN_METADATA } from '../../constants';
import type { PublicKey } from '@solana/web3.js';

import Lobby from './components/Lobby';
import GameScreen from './components/GameScreen';
import DebugGameScreen from './components/DebugGameScreen';

export default function PlinkoRace() {
  return (
    <GameStateProvider>
      <PlinkoRaceGame />
    </GameStateProvider>
  )
}

function PlinkoRaceGame() {
  const [selectedGame, setSelectedGame] = useState<PublicKey | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const { gamePhase, setGamePhase } = useGameState();
  const { storeResult } = useGambaResult();
  const token = useCurrentToken();
  const { balance } = useTokenBalance();
  const { compact } = useIsCompact();

  // Find token metadata for symbol display
  const tokenMeta = token ? TOKEN_METADATA.find((t: any) => t.symbol === token.symbol) : undefined;
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1);

  // Game phase management for overlays
  const [thinkingPhase, setThinkingPhase] = React.useState(false);
  const [dramaticPause, setDramaticPause] = React.useState(false);
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(0);
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🏁');

  const handleBack = useCallback(() => {
    setSelectedGame(null);
    setDebugMode(false);
    setGamePhase('idle');
    setThinkingPhase(false);
    setDramaticPause(false);
    setCelebrationIntensity(0);
  }, [setGamePhase]);

  return (
    <GambaUi.Portal target="screen">
      {debugMode ? (
        <DebugGameScreen onBack={() => setDebugMode(false)} />
      ) : selectedGame ? (
        <GameScreen 
          pk={selectedGame} 
          onBack={handleBack}
          gamePhase={gamePhase}
          setGamePhase={setGamePhase}
          thinkingPhase={thinkingPhase}
          setThinkingPhase={setThinkingPhase}
          dramaticPause={dramaticPause}
          setDramaticPause={setDramaticPause}
          celebrationIntensity={celebrationIntensity}
          setCelebrationIntensity={setCelebrationIntensity}
          thinkingEmoji={thinkingEmoji}
          setThinkingEmoji={setThinkingEmoji}
          storeResult={storeResult}
          balance={balance}
        />
      ) : (
        <Lobby
          onSelect={setSelectedGame}
          onDebug={() => setDebugMode(true)}
        />
      )}
    </GambaUi.Portal>
  );
}
