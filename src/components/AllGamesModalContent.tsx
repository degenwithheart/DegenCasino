
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { ALL_GAMES } from '../games/allGames';
import { GameCard } from '../sections/Dashboard/GameCard';

// Filter by meta.tag for 'Singleplayer' and 'Multiplayer'
const SINGLEPLAYER_GAMES = ALL_GAMES.filter(game => game.meta.tag === 'Singleplayer');
const MULTIPLAYER_GAMES = ALL_GAMES.filter(game => game.meta.tag === 'Multiplayer');

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;


const ModalContent = styled.div`
  /* Desktop/base: cap at 700px while respecting dynamic viewport (handles mobile browser UI) */
  width: min(700px, 96dvw);
  min-width: 0;
  min-height: 200px;
  max-height: 500px;
  margin-bottom: 1rem;
  margin-top: 1rem;
  padding: 2rem;
  background: rgba(24, 24, 24, 0.95);
  border-radius: 1rem;
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  position: relative;
  color: white;
  animation: ${moveGradient} 3s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(162, 89, 255, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
    border-radius: 24px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    animation: ${moveGradient} 4s linear infinite;
    border-radius: 24px 24px 0 0;
    z-index: 1;
  }

  @media (max-width: 1200px) {
    padding: 1rem;
  }
  @media (max-width: 800px) {
    padding: 0.5rem;
  }
  @media (max-width: 600px) {
    min-height: 200px;
    padding: 0.9rem 1rem 1.15rem;
    border-radius: 16px;
    /* Fill viewport minus margins; narrower upper bound keeps cards readable */
    width: 400px;
    margin: 12px auto 16px;
    box-sizing: border-box;
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;

  &::before {
    content: '✨';
    position: absolute;
    top: -10px;
    right: 20%;
    font-size: 2rem;
    animation: ${moveGradient} 3s infinite;
  }

  &::after {
    content: '🎮';
    position: absolute;
    top: 10px;
    left: 15%;
    font-size: 1.5rem;
    animation: ${moveGradient} 2s infinite reverse;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 16px #ffd700, 0 0 32px #a259ff;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 2px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #ffd700, #a259ff, #ffd700, transparent);
    background-size: 200% 100%;
    animation: ${moveGradient} 3s linear infinite;
    border-radius: 2px;
  }

  @media (max-width: 600px) {
    font-size: 1.4rem;
    margin-bottom: 0.25rem;
  }
`;


const HorizontalScroll = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 0.75rem;
  padding: 0.5rem 0 1rem 0;
  max-width: 100%;
  scrollbar-width: thin;
  scrollbar-color: #ffd700 #181818;
  &::-webkit-scrollbar {
    height: 6px;
    background: #181818;
  }
  &::-webkit-scrollbar-thumb {
    background: #ffd700;
    border-radius: 4px;
  }
`;

// Card wrapper to match StyledGameCard sizing
const MenuCardWrapper = styled.div`
  width: 150px;
  min-width: 150px;
  max-width: 150px;
  aspect-ratio: 1/0.9;
  max-height: 100px;
  display: flex;
  align-items: stretch;
`;


type AllGamesModalContentProps = {
  onGameClick?: (game: typeof ALL_GAMES[0]) => void;
};


const AllGamesModalContent: React.FC<AllGamesModalContentProps> = ({ onGameClick }) => {
  return (
    <ModalContent>
      <HeaderSection>
        <Title>All Games</Title>
      </HeaderSection>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#ffd700', fontSize: '1.2rem', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Singleplayer</h2>
        <HorizontalScroll>
          {SINGLEPLAYER_GAMES.map(game => (
            <MenuCardWrapper key={game.id}>
              <GameCard game={game} onClick={() => onGameClick?.(game)} />
            </MenuCardWrapper>
          ))}
        </HorizontalScroll>
      </div>
      <div>
        <h2 style={{ color: '#a259ff', fontSize: '1.2rem', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Multiplayer</h2>
        <HorizontalScroll>
          {MULTIPLAYER_GAMES.map(game => (
            <MenuCardWrapper key={game.id}>
              <GameCard game={game} onClick={() => onGameClick?.(game)} />
            </MenuCardWrapper>
          ))}
        </HorizontalScroll>
      </div>
    </ModalContent>
  );
};

export default AllGamesModalContent;
