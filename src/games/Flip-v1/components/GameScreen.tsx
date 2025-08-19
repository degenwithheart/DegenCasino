import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useGame } from 'gamba-react-v2'
import { GambaUi, Multiplayer, useSound } from 'gamba-react-ui-v2'
import styled from 'styled-components'
import { PLATFORM_CREATOR_ADDRESS, MULTIPLAYER_FEE, PLATFORM_REFERRAL_FEE } from '../../../constants'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { Coin, TEXTURE_HEADS, TEXTURE_TAILS } from './Coin'
import { Effect } from './Effect'

import SOUND_COIN from '../sounds/coin.mp3'
import SOUND_WIN from '../sounds/win.mp3'
import SOUND_LOSE from '../sounds/lose.mp3'

const GameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  margin: 20px;
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

const BackButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  background: rgba(107, 114, 128, 0.2);
  color: #d1d5db;
  border: 1px solid rgba(107, 114, 128, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(107, 114, 128, 0.3);
  }
`

const GameArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`

const PlayersSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const PlayerCard = styled.div<{ isCurrentPlayer?: boolean; isWinner?: boolean }>`
  background: ${({ isCurrentPlayer, isWinner }) => 
    isWinner ? 'rgba(34, 197, 94, 0.2)' : 
    isCurrentPlayer ? 'rgba(79, 70, 229, 0.2)' : 
    'rgba(31, 41, 55, 0.5)'};
  border: 2px solid ${({ isCurrentPlayer, isWinner }) => 
    isWinner ? 'rgba(34, 197, 94, 0.5)' : 
    isCurrentPlayer ? 'rgba(79, 70, 229, 0.5)' : 
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
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.5);
  margin: 20px 0;
`

const ActionSection = styled.div`
  background: rgba(31, 41, 55, 0.8);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(79, 70, 229, 0.3);
`

const SideSelector = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
`

const SideButton = styled.button<{ selected?: boolean }>`
  padding: 12px 24px;
  border-radius: 8px;
  border: 2px solid ${({ selected }) => 
    selected ? '#4f46e5' : 'rgba(79, 70, 229, 0.3)'};
  background: ${({ selected }) => 
    selected ? 'rgba(79, 70, 229, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    border-color: #4f46e5;
    background: rgba(79, 70, 229, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  img {
    width: 24px;
    height: 24px;
  }
`

const PlayButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
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

const SIDES = {
  heads: [2, 0],
  tails: [0, 2],
}

type Side = keyof typeof SIDES

const shorten = (pk: PublicKey) => pk.toBase58().slice(0, 4) + '...'

export default function GameScreen({
  pk,
  onBack,
}: {
  pk: PublicKey
  onBack: () => void
}) {
  const { game: chainGame } = useGame(pk, { fetchMetadata: true })
  const { publicKey } = useWallet()
  const [side, setSide] = useState<Side>('heads')
  const [flipping, setFlipping] = useState(false)
  const [resultIndex, setResultIndex] = useState<number | null>(null)
  const [gameResult, setGameResult] = useState<any>(null)

  const sounds = useSound({
    coin: SOUND_COIN,
    win: SOUND_WIN,
    lose: SOUND_LOSE,
  })

  const isPlayerInGame = chainGame?.players.some(p => p.user.equals(publicKey!))
  const canJoin = chainGame && !chainGame.state.settled && chainGame.players.length < 2 && !isPlayerInGame
  const gameStarted = chainGame?.players.length === 2
  const gameFinished = chainGame?.state.settled

  useEffect(() => {
    if (gameFinished && chainGame && !gameResult) {
      // Process game result
      const winner = chainGame.winnerIndexes[0]
      const players = chainGame.players
      setResultIndex(winner)
      setGameResult({
        winner: winner,
        players: players,
      })
    }
  }, [gameFinished, chainGame, gameResult])

  const getCurrentPlayerChoice = () => {
    if (!chainGame || !publicKey) return null
    const player = chainGame.players.find(p => p.user.equals(publicKey))
    return player?.metadata?.[0] || null
  }

  const getOpponentChoice = () => {
    if (!chainGame || !publicKey) return null
    const opponent = chainGame.players.find(p => !p.user.equals(publicKey))
    return opponent?.metadata?.[0] || null
  }

  const isWinner = () => {
    if (!gameFinished || !gameResult || !publicKey) return false
    const playerIndex = chainGame?.players.findIndex(p => p.user.equals(publicKey))
    return playerIndex === gameResult.winner
  }

  return (
    <GameWrapper>
      <GameHeader>
        <GameTitle>⚔️ Flip Duel Arena</GameTitle>
        <BackButton onClick={onBack}>← Back to Lobby</BackButton>
      </GameHeader>

      <GameArea>
        <PlayersSection>
          {chainGame?.players.map((player, index) => (
            <PlayerCard 
              key={player.user.toString()}
              isCurrentPlayer={player.user.equals(publicKey!)}
              isWinner={gameFinished && gameResult?.winner === index}
            >
              <h3>
                {player.user.equals(publicKey!) ? '👤 You' : '🤖 Opponent'} 
                {gameFinished && gameResult?.winner === index && ' 👑'}
              </h3>
              <p>Player: {shorten(player.user)}</p>
              <p>Choice: {player.metadata?.[0] || 'Not chosen'}</p>
              {gameFinished && (
                <p>Payout: {Number(player.pendingPayout || 0) / (10 ** 9)} SOL</p>
              )}
            </PlayerCard>
          )) || (
            <>
              <PlayerCard isCurrentPlayer={true}>
                <h3>👤 You</h3>
                <p>Waiting to join...</p>
              </PlayerCard>
              <PlayerCard>
                <h3>🤖 Opponent</h3>
                <p>Waiting for opponent...</p>
              </PlayerCard>
            </>
          )}
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
              <Coin result={resultIndex || 0} flipping={flipping || (gameStarted && !gameFinished)} />
            </React.Suspense>
            
            {(flipping || (gameStarted && !gameFinished)) && <Effect color="white" />}
            {gameFinished && isWinner() && <Effect color="#42ff78" />}
            {gameFinished && !isWinner() && <Effect color="#ff4242" />}
            
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
              {isWinner() ? '🎉 Victory! The silver chose your side!' : '💔 Defeat! Fate favored your opponent...'}
            </h3>
            <p>
              The coin landed on: <strong>{resultIndex === 0 ? 'Heads' : 'Tails'}</strong>
            </p>
          </GameStatus>
        ) : gameStarted ? (
          <GameStatus>
            <h3>🪙 The coin spins through destiny...</h3>
            <p>Both players have chosen their sides. Fate is deciding...</p>
          </GameStatus>
        ) : (
          <ActionSection>
            {isPlayerInGame ? (
              <GameStatus>
                <h3>⏳ Waiting for opponent</h3>
                <p>You chose: <strong>{getCurrentPlayerChoice()}</strong></p>
                <p>Waiting for another player to join the duel...</p>
              </GameStatus>
            ) : canJoin ? (
              <>
                <h3 style={{ color: '#f0f0ff', textAlign: 'center', marginBottom: '16px' }}>
                  Choose Your Side & Join the Duel
                </h3>
                <SideSelector>
                  <SideButton
                    selected={side === 'heads'}
                    onClick={() => setSide('heads')}
                  >
                    <img src={TEXTURE_HEADS} alt="Heads" style={{ width: '24px', height: '24px' }} />
                    Heads
                  </SideButton>
                  <SideButton
                    selected={side === 'tails'}
                    onClick={() => setSide('tails')}
                  >
                    <img src={TEXTURE_TAILS} alt="Tails" style={{ width: '24px', height: '24px' }} />
                    Tails
                  </SideButton>
                </SideSelector>
                <div style={{ marginTop: '20px' }}>
                  <Multiplayer.JoinGame
                    pubkey={pk}
                    account={chainGame}
                    creatorAddress={PLATFORM_CREATOR_ADDRESS}
                    creatorFeeBps={Math.round(MULTIPLAYER_FEE * BPS_PER_WHOLE)}
                    referralFee={PLATFORM_REFERRAL_FEE}
                    enableMetadata
                    onTx={() => {}}
                  />
                </div>
              </>
            ) : (
              <GameStatus>
                <h3>⚔️ Duel in Progress</h3>
                <p>This duel is already full or you cannot join.</p>
              </GameStatus>
            )}
          </ActionSection>
        )}
      </GameArea>
    </GameWrapper>
  )
}
