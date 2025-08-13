import React, { useState, useEffect } from "react";
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
const DashboardWrapper = styled.div`
  overflow-x: auto;
  max-width: 100%;
  margin-bottom: 7.5rem;
  padding: 1.5rem;
  background: rgba(24, 24, 24, 0.6);
  border-radius: 1rem;
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

  @media (max-width: 600px) {
    padding: 0.7rem 0.2rem;
    border-radius: 0.7rem;
    margin-bottom: 4.5rem;
  }
`;

// Responsive hide on mobile
const GameSliderWrapper = styled.div`
  @media (max-width: 767px) {
    display: none;
  }
`;

// Glassy wrapper for game cards in slider with neon effects
const GameCardWrapper = styled.div`
  width: 160px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  background: rgba(24, 24, 24, 0.6);
  backdrop-filter: blur(15px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  padding: 0.25rem;
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

  @media (max-width: 600px) {
    width: 100vw;
    min-width: 0;
    border-radius: 0.7rem;
    padding: 0.1rem;
  }
`;

function GameSlider() {
  return (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
      {FEATURED_GAMES.map((game) => (
        <GameCardWrapper key={game.id}>
          <FeaturedGameCard game={game} />
        </GameCardWrapper>
      ))}
    </div>
  );
}

// Grid layout for games with enhanced casino style
const Grid = styled.div`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (min-width: 600px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: 800px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  padding: 1rem;

  @media (max-width: 600px) {
    gap: 0.6rem;
    grid-template-columns: 1fr;
    padding: 0.5rem 0.1rem;
  }

  > div {
    background: rgba(24, 24, 24, 0.6);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 1rem;
    padding: 0.75rem;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
    transition: all 0.3s ease-in-out;
    position: relative;

    &:hover {
      transform: scale(1.06) rotate(-1deg);
      box-shadow: 0 0 24px #ffd700cc, 0 0 48px #a259ff88;
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
      opacity: 0.5;
    }

    @media (max-width: 600px) {
      border-radius: 0.7rem;
      padding: 0.4rem;
    }
  }
`;

function GameGrid() {
  return (
    <Grid>
      {GAMES().map((game) => (
        <div key={game.id}>
          <GameCard game={game} />
        </div>
      ))}
    </Grid>
  );
}

// Enhanced section wrapper with casino styling
const SectionWrapper = styled.div`
  overflow-x: auto;
  max-width: 100%;
  margin-top: 3rem;
  padding: 1.5rem;
  background: rgba(24, 24, 24, 0.6);
  backdrop-filter: blur(15px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  position: relative;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    font-size: 2rem;
    color: #ffd700;
    text-shadow: 0 0 8px #ffd700, 0 0 24px #a259ff;
    letter-spacing: 1px;
  }

  @media (max-width: 600px) {
    padding: 0.7rem 0.2rem;
    border-radius: 0.7rem;
    margin-top: 1.2rem;
    h2 {
      font-size: 1.2rem;
      margin-bottom: 0.7rem;
    }
  }
`;

// Connect wallet button with neon animation
const ConnectButton = styled.button`
  margin: 2rem auto 0;
  display: block;
  padding: 1rem 2.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  border-radius: 2rem;
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

  @media (max-width: 600px) {
    padding: 0.7rem 1.2rem;
    font-size: 1rem;
    border-radius: 1.2rem;
  }
`;

export default function Dashboard() {
  const { connected } = useWallet();
  const handleWalletConnect = useHandleWalletConnect();
  const [showAllGames, setShowAllGames] = useState(true);

  return (
    <DashboardWrapper>
      <WelcomeBanner />
      <EnhancedTickerTape />
      <AccentBar />

      {!connected && (
        <div
          style={{
            textAlign: 'center',
            margin: '2rem 0',
            padding: '0 0.5rem',
          }}
        >
          <span
            style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              filter: 'drop-shadow(0 0 8px #ffd700)',
              display: 'block',
            }}
          >
            🎰
          </span>
          <h3
            style={{
              color: '#ffd700',
              textShadow: '0 0 8px #ffd700, 0 0 24px #a259ff',
              fontFamily: "'Luckiest Guy', cursive, sans-serif",
              fontSize: '1.5rem',
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}
          >
            Ready to Play?
          </h3>
          <p
            style={{
              marginBottom: '1.5rem',
              fontSize: '1.1rem',
              opacity: 0.9,
              lineHeight: 1.3,
            }}
          >
            Connect your wallet to start your casino adventure!
          </p>
          {/* Use the shared wallet connect handler from UserButtons */}
          <ConnectButton onClick={handleWalletConnect}>
            🚀 Connect Wallet
          </ConnectButton>
        </div>
      )}

      {connected && (
        <>

          <GameSliderWrapper>
            <div
              style={{
                position: 'relative',
                marginBottom: '5.5rem',
                padding: '0 0.5rem',
              }}
            >
              <CasinoSparkles>✨</CasinoSparkles>
              <h3
                style={{
                  textAlign: 'center',
                  marginBottom: '1rem',
                  color: '#ffd700',
                  textShadow: '0 0 8px #ffd700',
                  fontFamily: "'Luckiest Guy', cursive, sans-serif",
                  fontSize: '1.2rem',
                  lineHeight: 1.2,
                }}
              >
                🎲 Featured Games
              </h3>
              <GameSlider />
            </div>
          </GameSliderWrapper>

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
                fontSize: '1.3rem',
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
                fontSize: '1.3rem',
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
              🏆 Recent Plays
            </button>
          </div>

          {/* Toggle Content */}
          {showAllGames ? (
            <GameGrid />
          ) : (
            <SectionWrapper>
              <RecentPlays showAllPlatforms={true} />
            </SectionWrapper>
          )}
        </>
      )}
    </DashboardWrapper>
  );
}
