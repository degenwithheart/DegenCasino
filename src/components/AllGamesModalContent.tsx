
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  z-index: 9999;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(162, 89, 255, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
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
    z-index: 1;
  }
`;

const ModalHeader = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: rgba(24, 24, 24, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
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
  margin: 0;
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
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 215, 0, 0.5);
  }
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 2rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 1rem 0.75rem;
    top: 70px;
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
  scroll-behavior: smooth;

  /* Hide scrollbar on mobile but keep functionality */
  @media (max-width: 600px) {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  &::-webkit-scrollbar {
    height: 6px;
    background: #181818;
  }
  &::-webkit-scrollbar-thumb {
    background: #ffd700;
    border-radius: 4px;
    &:hover {
      background: #a259ff;
    }
  }

  /* Ensure proper scrolling on all devices */
  scroll-snap-type: x mandatory;

  /* Prevent content from being cut off */
  padding-bottom: 1rem;
  margin-bottom: -0.5rem;
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
  flex-shrink: 0;

  /* Add scroll snap for better UX */
  scroll-snap-align: start;

  /* Ensure cards don't get compressed */
  @media (max-width: 600px) {
    width: 140px;
    min-width: 140px;
    max-width: 140px;
  }
`;


type AllGamesModalContentProps = {
  onGameClick?: (game: typeof ALL_GAMES[0]) => void;
  onClose?: () => void;
};


const AllGamesModalContent: React.FC<AllGamesModalContentProps> = ({ onGameClick, onClose }) => {
  return (
    <>
      <ModalOverlay onClick={onClose} />
      <ModalContent>
        <ModalHeader>
          <Title>All Games</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ContentWrapper>
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
        </ContentWrapper>
      </ModalContent>
    </>
  );
};

export default AllGamesModalContent;
