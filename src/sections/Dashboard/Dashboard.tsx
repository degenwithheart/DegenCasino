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
import { TOKEN_METADATA, updateTokenPrices, ENABLE_LEADERBOARD } from "../../constants";
import EnhancedTickerTape from "../../components/EnhancedTickerTape";
import { useIsCompact } from "../../hooks/useIsCompact";
import { FullReferralLeaderboard } from "../../components/FullReferralLeaderboard";

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

const GameSliderWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 1.5rem;
  justify-content: flex-start;
  flex-wrap: nowrap;
  padding-bottom: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  scroll-behavior: smooth;

  /* Ensure minimum touch target size */
  min-height: 200px;

  /* Prevent games from extending outside container */
  contain: layout style paint;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ffd700;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #a259ff;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  & > * {
    flex: 0 0 auto;
    min-width: 0; /* Allow flex items to shrink below their minimum content size */
    /* Ensure hover effects don't break out of container */
    transform-origin: center;
  }

  /* Ensure all games are accessible by making the container scrollable */
  @media (max-width: 768px) {
    gap: 1rem;
    padding: 0.75rem 1.5rem 1.5rem 1.5rem;
    justify-content: flex-start; /* Always left-align for better scrolling */
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
    padding: 0.5rem 1rem 1rem 1rem;

    &::-webkit-scrollbar {
      height: 6px;
    }
  }

  /* Add scroll snap for better UX */
  scroll-snap-type: x mandatory;

  & > * {
    scroll-snap-align: start;
  }
`;

// Glassy wrapper for game cards in slider with neon effects
const GameCardWrapper = styled.div<CompactProps>`
  width: ${({ $compact }) => ($compact ? '180px' : '200px')};
  height: ${({ $compact }) => ($compact ? '162px' : '180px')};
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

  /* Ensure hover effects stay within container bounds */
  transform-origin: center;
  will-change: transform;

  &:hover {
    transform: scale(1.03) rotate(-1deg);
    box-shadow: 0 0 32px #ffd700cc, 0 0 64px #a259ff88;
    border: 2px solid #ffd700;
    z-index: 10;
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
    height: ${({ $compact }) => ($compact ? '144px' : '162px')};
    min-width: 140px;
    max-width: 200px;
    padding: ${({ $compact }) => ($compact ? '0.4rem' : '0.6rem')};
  }

  @media (max-width: 480px) {
    width: 140px;
    height: 126px;
    min-width: 120px;
    max-width: 160px;
    padding: 0.3rem;
    border-radius: 0.6rem;
  }

  @media (max-width: 400px) {
    width: 120px;
    height: 108px;
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
  padding: ${({ $compact }) => ($compact ? '0.7rem 1rem' : '1.5rem 2rem')};
  background: rgba(24, 24, 24, 0.6);
  backdrop-filter: blur(15px);
  border-radius: ${({ $compact }) => ($compact ? '0.7rem' : '1rem')};
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);

  /* Ensure game cards don't overflow outside section */
  overflow: hidden;
  position: relative;

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
    padding: ${({ $compact }) => ($compact ? '0.2rem 0.5rem' : '0.5rem 1rem')};
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

  const [activeSection, setActiveSection] = useState<'games' | 'plays' | 'referrals'>('games');

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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: compact ? '0.8rem' : '1.5rem', 
            margin: '2rem 0',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveSection('games')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                fontFamily: "'Luckiest Guy', cursive, sans-serif",
                fontSize: compact ? '1.1rem' : '1.3rem',
                color: activeSection === 'games' ? '#ffd700' : '#fff2',
                textShadow: activeSection === 'games'
                  ? '0 0 8px #ffd700, 0 0 24px #a259ff'
                  : '0 0 4px #ffd70044',
                letterSpacing: '1px',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.2s',
                outline: 'none',
                filter: activeSection === 'games' ? 'drop-shadow(0 0 8px #ffd700)' : 'none',
                opacity: activeSection === 'games' ? 1 : 0.5,
                borderBottom: activeSection === 'games' ? '3px solid #ffd700' : '3px solid transparent',
                paddingBottom: '0.2em',
              }}
            >
              🃏 All Games
            </button>
            <button
              onClick={() => setActiveSection('plays')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                fontFamily: "'Luckiest Guy', cursive, sans-serif",
                fontSize: compact ? '1.1rem' : '1.3rem',
                color: activeSection === 'plays' ? '#ffd700' : '#fff2',
                textShadow: activeSection === 'plays'
                  ? '0 0 8px #ffd700, 0 0 24px #a259ff'
                  : '0 0 4px #ffd70044',
                letterSpacing: '1px',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.2s',
                outline: 'none',
                filter: activeSection === 'plays' ? 'drop-shadow(0 0 8px #ffd700)' : 'none',
                opacity: activeSection === 'plays' ? 1 : 0.5,
                borderBottom: activeSection === 'plays' ? '3px solid #ffd700' : '3px solid transparent',
                paddingBottom: '0.2em',
              }}
            >
              🕹️ Recent Plays
            </button>
            {ENABLE_LEADERBOARD && (
              <button
                onClick={() => setActiveSection('referrals')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  fontFamily: "'Luckiest Guy', cursive, sans-serif",
                  fontSize: compact ? '1.1rem' : '1.3rem',
                  color: activeSection === 'referrals' ? '#ffd700' : '#fff2',
                  textShadow: activeSection === 'referrals'
                    ? '0 0 8px #ffd700, 0 0 24px #a259ff'
                    : '0 0 4px #ffd70044',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  transition: 'all 0.2s',
                  outline: 'none',
                  filter: activeSection === 'referrals' ? 'drop-shadow(0 0 8px #ffd700)' : 'none',
                  opacity: activeSection === 'referrals' ? 1 : 0.5,
                  borderBottom: activeSection === 'referrals' ? '3px solid #ffd700' : '3px solid transparent',
                  paddingBottom: '0.2em',
                }}
              >
                🏆 Referral Leaders
              </button>
            )}
          </div>

          {/* Toggle Content */}
          {activeSection === 'games' && (
            <>
              <AccentBar />
              <SectionWrapper $compact={compact}>
                <h2>Featured Games</h2>
                <GameSlider compact={compact} />
              </SectionWrapper>
              
              <AccentBar />
              <SectionWrapper $compact={compact}>
                <h2>Singleplayer Games</h2>
                <GameSliderWrapper>
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
                <GameSliderWrapper>
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
                <GameSliderWrapper>
                  {liveNewGames.map((game) => (
                    <GameCardWrapper key={game.id} $compact={compact}>
                      <GameCard game={game} />
                    </GameCardWrapper>
                  ))}
                </GameSliderWrapper>
              </SectionWrapper>
              <AccentBar />
            </>
          )}

          {activeSection === 'plays' && (
            <SectionWrapper $compact={compact}>
              <RecentPlays showAllPlatforms={false} />
            </SectionWrapper>
          )}

          {activeSection === 'referrals' && ENABLE_LEADERBOARD && (
            <>
              <AccentBar />
              <SectionWrapper $compact={compact}>
                <FullReferralLeaderboard />
              </SectionWrapper>
              <AccentBar />
            </>
          )}
        </>
      )}

    </DashboardWrapper>
  );
}
