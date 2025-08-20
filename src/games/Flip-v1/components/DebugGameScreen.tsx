// src/components/DebugGameScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import { Keypair, PublicKey } from '@solana/web3.js';
import { GambaUi, useSound } from 'gamba-react-ui-v2';
import { makeDeterministicRng } from '../../../fairness/deterministicRng';
import { Coin, TEXTURE_HEADS, TEXTURE_TAILS } from './Coin';
import { Effect } from './Effect';
import lobbymusicSnd from '../sounds/coin.mp3';

function randomPk(): PublicKey {
  return Keypair.generate().publicKey;
}

const Page = styled.div`
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
`

const Panel = styled.div`
  background: rgba(17, 21, 31, 0.3);
  border: 1px solid rgba(112, 112, 218, 0.2);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.25);
  backdrop-filter: blur(10px);
`

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  h2 { margin: 0; font-size: 18px; }
`

const FormGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const Field = styled.label`
  display: grid;
  gap: 8px;
  font-size: 14px;
`

const Input = styled.input`
  appearance: none;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(112, 112, 218, 0.3);
  background: rgba(13, 17, 24, 0.4);
  color: #e8eefc;
  outline: none;
  font-size: 14px;
  backdrop-filter: blur(5px);
  &:focus {
    border-color: #7070da;
    box-shadow: 0 0 0 3px rgba(112, 112, 218, 0.2);
  }
`

const Select = styled.select`
  appearance: none;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(112, 112, 218, 0.3);
  background: rgba(13, 17, 24, 0.4);
  color: #e8eefc;
  outline: none;
  font-size: 14px;
  backdrop-filter: blur(5px);
  cursor: pointer;
  &:focus {
    border-color: #7070da;
    box-shadow: 0 0 0 3px rgba(112, 112, 218, 0.2);
  }
  
  option {
    background: #1a1a2e;
    color: #e8eefc;
  }
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 8px;
`

const Helper = styled.div`
  color: #9aa7bd;
  font-size: 12px;
`

const GameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
`

const GameHeader = styled.div`
  padding: 20px;
  background: rgba(31, 41, 55, 0.8);
  border-bottom: 1px solid rgba(79, 70, 229, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`

const GameTitle = styled.h2`
  color: #f0f0ff;
  margin: 0;
  font-size: 24px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
`

const PlayersSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const PlayerCard = styled.div<{ isYou?: boolean; isWinner?: boolean }>`
  background: ${({ isYou, isWinner }) => 
    isWinner ? 'rgba(34, 197, 94, 0.2)' : 
    isYou ? 'rgba(79, 70, 229, 0.2)' : 
    'rgba(31, 41, 55, 0.5)'};
  border: 2px solid ${({ isYou, isWinner }) => 
    isWinner ? 'rgba(34, 197, 94, 0.5)' : 
    isYou ? 'rgba(79, 70, 229, 0.5)' : 
    'rgba(75, 85, 99, 0.3)'};
  border-radius: 12px;
  padding: 16px;
  
  h3 {
    color: #f0f0ff;
    margin: 0 0 8px 0;
    font-size: 18px;
  }
  
  p {
    color: #d1d5db;
    margin: 4px 0;
    font-size: 14px;
  }
`

const CanvasContainer = styled.div`
  height: 300px;
  margin: 20px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.5);
`

const GameStatus = styled.div`
  text-align: center;
  padding: 20px;
  color: #d1d5db;
  font-size: 16px;
  
  h3 {
    color: #f0f0ff;
    margin: 0 0 8px 0;
  }
`

const shorten = (pk: PublicKey) => pk.toBase58().slice(0, 4) + '...'

export default function DebugGameScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [player1Choice, setPlayer1Choice] = useState<'heads' | 'tails'>('heads');
  const [player2Choice, setPlayer2Choice] = useState<'heads' | 'tails'>('tails');
  const [coinResult, setCoinResult] = useState<'heads' | 'tails'>('heads');
  const [seedInput, setSeedInput] = useState('');
  const [gamePk, setGamePk] = useState<string | null>(null);
  
  const [players, setPlayers] = useState<PublicKey[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);

  const waiting = players.length === 0;

  const sounds = useSound({
    lobby: lobbymusicSnd,
  });

  useEffect(() => {
    if (waiting) {
      sounds.play('lobby');
    }
  }, [waiting, sounds]);

  const start = useCallback(async () => {
    // Generate two players
    const player1 = randomPk();
    const player2 = randomPk();
    setPlayers([player1, player2]);

    const seed = seedInput.trim() || Keypair.generate().publicKey.toBase58();
    setGamePk(seed);

    setGameStarted(true);
    setGameFinished(false);
    setFlipping(true);

    // Simulate coin flip after 2 seconds
    setTimeout(() => {
      setFlipping(false);
      setGameFinished(true);
      
      // Determine winner based on choices and result
      let winnerIndex: number;
      if (player1Choice === coinResult && player2Choice !== coinResult) {
        winnerIndex = 0; // Player 1 wins
      } else if (player2Choice === coinResult && player1Choice !== coinResult) {
        winnerIndex = 1; // Player 2 wins
      } else {
        // Both chose same or both chose wrong - derive deterministically from seed
        const rng = makeDeterministicRng((seedInput || gamePk || '') + ':flip-draw')
        winnerIndex = rng() < 0.5 ? 0 : 1;
      }
      
      setWinner(winnerIndex);
    }, 3000);
  }, [player1Choice, player2Choice, coinResult, seedInput]);

  const reset = useCallback(() => {
    setPlayers([]);
    setGameStarted(false);
    setGameFinished(false);
    setFlipping(false);
    setWinner(null);
    setGamePk(null);
  }, []);

  if (waiting) {
    return (
      <Page>
        <Panel>
          <PanelHeader>
            <h2>🐞 Flip Duel Debug Simulator</h2>
          </PanelHeader>
          <FormGrid>
            <Field>
              <span>Player 1 Choice</span>
              <Select
                value={player1Choice}
                onChange={e => setPlayer1Choice(e.target.value as 'heads' | 'tails')}
              >
                <option value="heads">Heads</option>
                <option value="tails">Tails</option>
              </Select>
              <Helper>What side Player 1 chooses</Helper>
            </Field>

            <Field>
              <span>Player 2 Choice</span>
              <Select
                value={player2Choice}
                onChange={e => setPlayer2Choice(e.target.value as 'heads' | 'tails')}
              >
                <option value="heads">Heads</option>
                <option value="tails">Tails</option>
              </Select>
              <Helper>What side Player 2 chooses</Helper>
            </Field>

            <Field>
              <span>Coin Result</span>
              <Select
                value={coinResult}
                onChange={e => setCoinResult(e.target.value as 'heads' | 'tails')}
              >
                <option value="heads">Heads</option>
                <option value="tails">Tails</option>
              </Select>
              <Helper>What the coin lands on</Helper>
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
            <GambaUi.Button main onClick={start}>Start Duel</GambaUi.Button>
          </Actions>
        </Panel>
      </Page>
    );
  }

  return (
    <GameWrapper>
      <GameHeader>
        <GameTitle>🐞 Debug Flip Duel</GameTitle>
        <div>Game: {gamePk?.slice(0, 8)}...</div>
      </GameHeader>

      <PlayersSection>
        {players.map((player, index) => (
          <PlayerCard 
            key={player.toString()}
            isYou={index === 0}
            isWinner={gameFinished && winner === index}
          >
            <h3>
              {index === 0 ? '👤 Player 1 (You)' : '🤖 Player 2'} 
              {gameFinished && winner === index && ' 👑'}
            </h3>
            <p>Address: {shorten(player)}</p>
            <p>Choice: {index === 0 ? player1Choice : player2Choice}</p>
            {gameFinished && (
              <p>
                {winner === index ? '🎉 Winner!' : '💔 Lost'}
              </p>
            )}
          </PlayerCard>
        ))}
      </PlayersSection>

      <CanvasContainer>
        <Canvas
          linear
          flat
          orthographic
          camera={{
            zoom: 80,
            position: [0, 0, 100],
          }}
        >
          <React.Suspense fallback={null}>
            <Coin 
              result={coinResult === 'heads' ? 0 : 1} 
              flipping={flipping} 
            />
          </React.Suspense>
          
          {flipping && <Effect color="white" />}
          {gameFinished && winner === 0 && <Effect color="#42ff78" />}
          {gameFinished && winner === 1 && <Effect color="#ff4242" />}
          
          <ambientLight intensity={3} />
          <directionalLight
            position-z={1}
            position-y={1}
            castShadow
            color="#CCCCCC"
          />
          <hemisphereLight
            intensity={0.5}
            position={[0, 1, 0]}
            scale={[1, 1, 1]}
            color="#ffadad"
            groundColor="#6666fe"
          />
        </Canvas>
      </CanvasContainer>

      {gameFinished ? (
        <GameStatus>
          <h3>
            {winner === 0 ? '🎉 You Won the Duel!' : '💔 You Lost the Duel!'}
          </h3>
          <p>
            The coin landed on: <strong>{coinResult}</strong>
          </p>
          <p>
            Player 1 chose: <strong>{player1Choice}</strong> | 
            Player 2 chose: <strong>{player2Choice}</strong>
          </p>
        </GameStatus>
      ) : gameStarted ? (
        <GameStatus>
          <h3>🪙 The coin spins through destiny...</h3>
          <p>Both players have chosen their sides. Fate is deciding...</p>
        </GameStatus>
      ) : null}

      <GambaUi.Portal target="controls">
        {gameFinished && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <GambaUi.Button onClick={reset}>
              🔄 Reset Duel
            </GambaUi.Button>
            <GambaUi.Button onClick={onBack}>
              ← Back to Lobby
            </GambaUi.Button>
          </div>
        )}
      </GambaUi.Portal>
    </GameWrapper>
  );
}
