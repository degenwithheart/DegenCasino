// src/components/DebugGameScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Keypair, PublicKey } from '@solana/web3.js';
import { GambaUi, useSound }  from 'gamba-react-ui-v2';
import Board                  from '../board/Board';
import lobbymusicSnd          from '../sounds/lobby.mp3';
import actionSnd              from '../sounds/action.mp3';
import {
  musicManager,
  attachMusic,
  stopAndDispose,
} from '../musicManager';

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
  }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Page = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Panel = styled.div`
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  animation: ${slideIn} 0.6s ease-out;
`

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
`

const Title = styled.h2`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffd700 0%, #a259ff 50%, #ff9500 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
`

const FormGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const Field = styled.label`
  display: grid;
  gap: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #ffd700;
`

const Input = styled.input`
  appearance: none;
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  border-radius: 12px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  background: rgba(40, 40, 40, 0.8);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ffd700;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
    background: rgba(50, 50, 50, 0.9);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
`

const StyledButton = styled.button`
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`

const Helper = styled.div`
  color: #ccc;
  font-size: 0.9rem;
  font-weight: 400;
`

export default function DebugGameScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [count,  setCount ] = useState(5);
  const [winner, setWinner] = useState(0);
  const [you,    setYou   ] = useState(0);        // which ball is “you”
  const [players,   setPlayers]   = useState<PublicKey[]>([]);
  const [winnerIdx, setWinnerIdx] = useState<number | null>(null);

  const [seedInput, setSeedInput] = useState('');
  const [gamePk,    setGamePk]    = useState<string | null>(null);

  const [gameOver, setGameOver] = useState(false);

  const waiting = players.length === 0;

  useEffect(() => {
    // cancel any pending stop
    clearTimeout(musicManager.timer);
    // bump claim count
    musicManager.count += 1;
    return () => {
      musicManager.count -= 1;
      if (musicManager.count === 0) {
        musicManager.timer = setTimeout(stopAndDispose, 200);
      }
    };
  }, []);

  const { play: playLobby, sounds: lobbySounds } = useSound(
    { lobby: lobbymusicSnd },
    { disposeOnUnmount: false },
  );
  useEffect(() => {
    if (!musicManager.sound) {
      const snd = lobbySounds.lobby;
      if (snd) {
        snd.player.loop = true;
        const startWhenReady = () => {
          if (snd.ready) {
            playLobby('lobby');
            attachMusic(snd);
          } else {
            setTimeout(startWhenReady, 100);
          }
        };
        startWhenReady();
      }
    }
  }, [lobbySounds, playLobby]);

  const { play: playAction, sounds: actionSounds } = useSound(
    { action: actionSnd },
    { disposeOnUnmount: false },
  );
  useEffect(() => {
    if (!waiting) {
      try { musicManager.sound?.player.stop(); } catch {}
      const snd = actionSounds.action;
      if (snd) {
        snd.player.loop = true;
        const startWhenReady = () => {
          if (snd.ready) {
            playAction('action');
            attachMusic(snd);
          } else {
            setTimeout(startWhenReady, 100);
          }
        };
        startWhenReady();
      }
    }
  }, [waiting, actionSounds, playAction]);

  const start = useCallback(() => {
    const n = Math.max(1, Math.min(20, count));
    const youClamped = Math.max(0, Math.min(n - 1, you));
    setYou(youClamped);

    setPlayers(Array.from({ length: n }, randomPk));
    setWinnerIdx(Math.max(0, Math.min(n - 1, winner)));

    const seed = seedInput.trim() || Keypair.generate().publicKey.toBase58();
    setGamePk(seed);

    setGameOver(false);
  }, [count, winner, you, seedInput]);

  return (
    <>
      {players.length === 0 && (
        <Page>
          <Panel>
            <PanelHeader>
              <Title>🐞 Debug Simulator</Title>
            </PanelHeader>
            <FormGrid>
              <Field>
                <span>Balls (Players)</span>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  step={1}
                  inputMode="numeric"
                  value={count}
                  onChange={e => setCount(+e.target.value)}
                />
                <Helper>How many players (1–20)</Helper>
              </Field>

              <Field>
                <span>Winner Index</span>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  value={winner}
                  onChange={e => setWinner(+e.target.value)}
                />
                <Helper>Zero-based index of the winner</Helper>
              </Field>

              <Field>
                <span>Your Index</span>
                <Input
                  type="number"
                  min={0}
                  max={Math.max(0, count - 1)}
                  step={1}
                  inputMode="numeric"
                  value={you}
                  onChange={e => setYou(+e.target.value)}
                />
                <Helper>Which ball is "you" (0…{Math.max(0, count - 1)})</Helper>
              </Field>

              <Field>
                <span>Seed (optional)</span>
                <Input
                  type="text"
                  placeholder="Base58 seed or leave empty"
                  value={seedInput}
                  onChange={e => setSeedInput(e.target.value)}
                />
                <Helper>Leave empty to use a random seed</Helper>
              </Field>
            </FormGrid>

            <Actions>
              <StyledButton onClick={start}>🎯 Run Race</StyledButton>
            </Actions>
          </Panel>
        </Page>
      )}

      {players.length > 0 && gamePk && (
        <Board
          players          ={players}
          winnerIdx        ={winnerIdx}
          youIndexOverride ={you}
          gamePk           ={gamePk}
          onFinished       ={() => setGameOver(true)}
        />
      )}

      <GambaUi.Portal target="controls">
        {players.length > 0 && gameOver && (
          <GambaUi.Button onClick={onBack}>
            ← Back to lobby
          </GambaUi.Button>
        )}
      </GambaUi.Portal>
    </>
  );
}
function randomPk(v: unknown, k: number): PublicKey {
  throw new Error('Function not implemented.');
}

