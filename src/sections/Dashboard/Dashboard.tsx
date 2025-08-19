import React, { useState, useEffect, useContext } from "react";
// Context to allow opening the games modal from anywhere
export const GamesModalContext = React.createContext<{ openGamesModal: () => void }>({ openGamesModal: () => {} });
import styled, { keyframes, css } from "styled-components";
import { SlideSection } from "../../components/Slider";
import { FEATURED_GAMES } from "../../games/featuredGames";
import { GAMES } from "../../games";
import { GameCard } from "./GameCard";
import { FeaturedGameCard } from "./FeaturedGameCard";
import { WelcomeBanner } from "./WelcomeBanner";
import RecentPlays from "../RecentPlays/RecentPlays";
import { useWallet } from "@solana/wallet-adapter-react";
import { useHandleWalletConnect } from "../walletConnect";
import { TOKEN_METADATA, updateTokenPrices } from "../../constants";
import EnhancedTickerTape from "../../components/EnhancedTickerTape";
import { useIsCompact } from "../../hooks/useIsCompact";

// Remove hook call at module scope. Use inside Dashboard instead.

// Keyframe animations
const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #ffd70044;
  }
  100% { 
    box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88;
    border-color: #ffd700aa;
  }
`;

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

// Animated accent bar
const AccentBar = styled.div`
  height: 6px;
  width: 100%;
  border-radius: 3px;
  margin: 0.5rem 0 1.5rem;
  background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
  background-size: 300% 100%;
  animation: ${moveGradient} 3s linear infinite;
`;

// Casino sparkle decoration
const CasinoSparkles = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.5rem;
  animation: ${sparkle} 2s infinite;
  pointer-events: none;
`;

// Global Dashboard wrapper with enhanced casino styling
interface CompactDivProps {
  $compact?: boolean;
}
const DashboardWrapper = styled.div<CompactDivProps>`
  max-width: 100%;
  margin: 2rem 0; /* Only vertical margins */
  padding: ${({ $compact }) => ($compact ? '1rem' : '2rem')};
  background: rgba(24, 24, 24, 0.6);
  border-radius: ${({ $compact }) => ($compact ? '0.8rem' : '1.2rem')};
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(162, 89, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }

  @media (max-width: 1200px) {
    margin: 1.5rem 0;
    padding: ${({ $compact }) => ($compact ? '0.8rem' : '1.5rem')};
  }
  @media (max-width: 900px) {
    margin: 0.5rem 0;
    padding: ${({ $compact }) => ($compact ? '0.4rem' : '0.8rem')};
  }
  @media (max-width: 700px) {
    margin: 0.25rem 0;
    padding: ${({ $compact }) => ($compact ? '0.3rem' : '0.5rem')};
    border-radius: ${({ $compact }) => ($compact ? '0.6rem' : '0.8rem')};
    max-width: 100vw;
  }
  @media (max-width: 480px) {
    margin: 0;
    padding: ${({ $compact }) => ($compact ? '0.2rem' : '0.3rem')};
    border-radius: ${({ $compact }) => ($compact ? '0.4rem' : '0.6rem')};
    max-width: 100vw;
  }
  @media (max-width: 400px) {
    margin: 0;
    padding: ${({ $compact }) => ($compact ? '0.1rem' : '0.2rem')};
    border-radius: 0.3rem;
    max-width: 100vw;
  }
`;

// Type for compact prop used in styled components
type CompactProps = {
  $compact?: boolean;
};

const GameSliderWrapper = styled.div<{ $hasMany?: boolean }>`
  width: 100%;
  display: flex;
  gap: 1.5rem;
  justify-content: ${({ $hasMany }) => $hasMany ? 'flex-start' : 'center'};
  flex-wrap: nowrap;
  padding: 1rem 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--gamba-ui-primary-color);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  & > * {
    flex: 0 0 auto;
  }

  @media (max-width: 768px) {
    gap: 1rem;
    padding: 0.75rem 1rem;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;

    &::-webkit-scrollbar {
      height: 6px;
    }
  }
`;

// Glassy wrapper for game cards in slider with neon effects
const GameCardWrapper = styled.div<CompactProps>`
  width: ${({ $compact }) => ($compact ? '180px' : '200px')};
  max-width: 220px;
  min-width: 160px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  background: rgba(24, 24, 24, 0.6);
  backdrop-filter: blur(15px);
  border-radius: ${({ $compact }) => ($compact ? '0.8rem' : '1rem')};
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  padding: ${({ $compact }) => ($compact ? '0.5rem' : '0.75rem')};
  transition: all 0.3s ease-in-out;
  position: relative;

  &:hover {
    transform: scale(1.06) rotate(-2deg);
    box-shadow: 0 0 32px #ffd700cc, 0 0 64px #a259ff88;
    border: 2px solid #ffd700;
  }

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    border-radius: 1rem;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease-in-out;
  }

  &:hover::before {
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    width: ${({ $compact }) => ($compact ? '160px' : '180px')};
    min-width: 140px;
    max-width: 200px;
    padding: ${({ $compact }) => ($compact ? '0.4rem' : '0.6rem')};
  }

  @media (max-width: 480px) {
    width: 140px;
    min-width: 120px;
    max-width: 160px;
    padding: 0.3rem;
    border-radius: 0.6rem;
  }

  @media (max-width: 400px) {
    width: 120px;
    min-width: 100px;
    max-width: 140px;
  }
`;

const Grid = styled.div<CompactDivProps>`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: ${({ $compact }) => ($compact ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))')};
  padding: 1rem;

  @media (min-width: 600px) {
    grid-template-columns: ${({ $compact }) => ($compact ? '2fr' : 'repeat(3, 1fr)')};
  }

  @media (min-width: 800px) {
    grid-template-columns: ${({ $compact }) => ($compact ? '3fr' : 'repeat(4, 1fr)')};
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
`;

const SectionWrapper = styled.div<CompactDivProps>`
  max-width: 100vw;
  margin-bottom: 3rem;
  margin-top: 3rem;
  padding: ${({ $compact }) => ($compact ? '0.7rem 0.2rem' : '1.5rem')};
  background: rgba(24, 24, 24, 0.6);
  backdrop-filter: blur(15px);
  border-radius: ${({ $compact }) => ($compact ? '0.7rem' : '1rem')};
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    font-size: ${({ $compact }) => ($compact ? '1.2rem' : '2rem')};
    color: #ffd700;
    text-shadow: 0 0 8px #ffd700, 0 0 24px #a259ff;
    letter-spacing: 1px;
  }

  @media (max-width: 900px) {
    margin-bottom: 1rem;
    margin-top: 1rem;
    padding: ${({ $compact }) => ($compact ? '0.2rem 0.05rem' : '0.5rem')};
    border-radius: ${({ $compact }) => ($compact ? '0.4rem' : '0.6rem')};
    h2 {
      font-size: ${({ $compact }) => ($compact ? '0.95rem' : '1.1rem')};
    }
  }
  @media (max-width: 700px) {
    margin-left: 0;
  }
`;

const ConnectButton = styled.button<CompactDivProps>`
  margin: 2rem auto 0;
  display: block;
  padding: ${({ $compact }) => ($compact ? '0.7rem 1.2rem' : '1rem 2.5rem')};
  font-size: ${({ $compact }) => ($compact ? '1rem' : '1.3rem')};
  font-weight: 700;
  border-radius: ${({ $compact }) => ($compact ? '1.2rem' : '2rem')};
  background: linear-gradient(90deg, #ffd700, #a259ff);
  color: #222;
  box-shadow: 0 0 24px #ffd70088;
  border: none;
  cursor: pointer;
  animation: ${neonPulse} 1.5s infinite alternate;
  transition: all 0.3s ease-in-out;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 1px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 48px #ffd700cc;
  }
`;

export function GameSlider({ compact }: { compact?: boolean }) {
  return (
    <GameSliderWrapper>
      {FEATURED_GAMES.map((game) => (
        <GameCardWrapper key={game.id} $compact={compact}>
          <FeaturedGameCard game={game} />
        </GameCardWrapper>
      ))}
    </GameSliderWrapper>
  );
}

export function Dashboard() {
  const { connected, connect, publicKey } = useWallet();
  const { compact, screenTooSmall } = useIsCompact();
  const handleWalletConnect = useHandleWalletConnect();
  const { openGamesModal } = useContext(GamesModalContext);

  const [showAllGames, setShowAllGames] = useState(true);

  // Filtered game lists
  const singleplayerGames = GAMES().filter(g => g.meta?.tag?.toLowerCase() === 'singleplayer' && g.live !== 'new');
  const multiplayerGames = GAMES().filter(g => g.meta?.tag?.toLowerCase() === 'multiplayer' && g.live !== 'new');
  const liveNewGames = GAMES().filter(g => g.live === 'new');

  return (
    <DashboardWrapper $compact={compact}>
      <CasinoSparkles>✨</CasinoSparkles>
      <WelcomeBanner />
      <EnhancedTickerTape />

      {connected && (
        <>
          {/* Toggle Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '2rem 0' }}>
            <button
              onClick={() => setShowAllGames(true)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                fontFamily: "'Luckiest Guy', cursive, sans-serif",
                fontSize: compact ? '1.1rem' : '1.3rem',
                color: showAllGames ? '#ffd700' : '#fff2',
                textShadow: showAllGames
                  ? '0 0 8px #ffd700, 0 0 24px #a259ff'
                  : '0 0 4px #ffd70044',
                letterSpacing: '1px',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.2s',
                outline: 'none',
                filter: showAllGames ? 'drop-shadow(0 0 8px #ffd700)' : 'none',
                opacity: showAllGames ? 1 : 0.5,
                borderBottom: showAllGames ? '3px solid #ffd700' : '3px solid transparent',
                paddingBottom: '0.2em',
              }}
            >
              🃏 All Games
            </button>
            <button
              onClick={() => setShowAllGames(false)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                fontFamily: "'Luckiest Guy', cursive, sans-serif",
                fontSize: compact ? '1.1rem' : '1.3rem',
                color: !showAllGames ? '#ffd700' : '#fff2',
                textShadow: !showAllGames
                  ? '0 0 8px #ffd700, 0 0 24px #a259ff'
                  : '0 0 4px #ffd70044',
                letterSpacing: '1px',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.2s',
                outline: 'none',
                filter: !showAllGames ? 'drop-shadow(0 0 8px #ffd700)' : 'none',
                opacity: !showAllGames ? 1 : 0.5,
                borderBottom: !showAllGames ? '3px solid #ffd700' : '3px solid transparent',
                paddingBottom: '0.2em',
              }}
            >
              🕹️ Recent Plays
            </button>
          </div>

          {/* Toggle Content */}
          {showAllGames ? (
            <>
              <AccentBar />
              <SectionWrapper $compact={compact}>
                <h2>Featured Games</h2>
                <GameSlider compact={compact} />
              </SectionWrapper>
              <AccentBar />
              <SectionWrapper $compact={compact}>
                <h2>Singleplayer Games</h2>
                <GameSliderWrapper $hasMany={singleplayerGames.length >= 4}>
                  {singleplayerGames.map((game) => (
                    <GameCardWrapper key={game.id} $compact={compact}>
                      <GameCard game={game} />
                    </GameCardWrapper>
                  ))}
                </GameSliderWrapper>
              </SectionWrapper>
              <AccentBar />
              <SectionWrapper $compact={compact}>
                <h2>Multiplayer Games</h2>
                <GameSliderWrapper $hasMany={multiplayerGames.length >= 4}>
                  {multiplayerGames.map((game) => (
                    <GameCardWrapper key={game.id} $compact={compact}>
                      <GameCard game={game} />
                    </GameCardWrapper>
                  ))}
                </GameSliderWrapper>
              </SectionWrapper>
              <AccentBar />
              <SectionWrapper $compact={compact}>
                <h2>Coming Soon</h2>
                <GameSliderWrapper $hasMany={liveNewGames.length >= 4}>
                  {liveNewGames.map((game) => (
                    <GameCardWrapper key={game.id} $compact={compact}>
                      <GameCard game={game} />
                    </GameCardWrapper>
                  ))}
                </GameSliderWrapper>
              </SectionWrapper>
              <AccentBar />
            </>
          ) : (
            <SectionWrapper $compact={compact}>
              <RecentPlays />
            </SectionWrapper>
          )}
        </>
      )}

    </DashboardWrapper>
  );
}
