const floatAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;

import styled, { keyframes } from "styled-components";

const neonPulse = keyframes`
  0% {
    box-shadow: 0 0 32px #a259ff, 0 0 64px #ffd70044;
    border-color: #ffd70044;
  }
  50% {
    box-shadow: 0 0 48px #ffd700, 0 0 96px #a259ff88;
    border-color: #ffd700;
  }
  100% {
    box-shadow: 0 0 32px #a259ff, 0 0 64px #ffd70044;
    border-color: #ffd70044;
  }
`;

const Container = styled.div<{ $isVisible: boolean; $isLoading: boolean }>`
  width: 100%;
  max-width: none; /* Let main handle max-width */
  margin: ${({ $isVisible, $isLoading }) => 
    $isLoading || $isVisible ? '0 0 2rem 0' : '0'
  };
  padding: ${({ $isVisible, $isLoading }) => 
    $isLoading || $isVisible ? '1rem' : '0'
  };
  height: ${({ $isVisible, $isLoading }) => 
    $isLoading || $isVisible ? 'auto' : '0'
  };
  overflow: ${({ $isVisible, $isLoading }) => 
    $isLoading || $isVisible ? 'visible' : 'hidden'
  };
  opacity: ${({ $isVisible, $isLoading }) => 
    $isLoading ? 0 : $isVisible ? 1 : 0
  };
  transform: ${({ $isVisible, $isLoading }) => 
    $isLoading ? 'translateY(10px)' : $isVisible ? 'translateY(0)' : 'translateY(-10px)'
  };
  transition: all 0.3s ease;
  pointer-events: ${({ $isVisible, $isLoading }) => 
    $isLoading || !$isVisible ? 'none' : 'auto'
  };
  margin-top: ${({ $isVisible, $isLoading }) => 
    $isLoading || $isVisible ? '0.1rem' : '0'
  };
  gap: 2rem;
  
  @media (max-width: 1200px) {
    padding: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '0.75rem' : '0'
    };
    margin: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '0 0 1.5rem 0' : '0'
    };
  }
  
  @media (max-width: 700px) {
    padding: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '0.5rem 0.25rem' : '0'
    };
    margin: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '0 auto 1rem' : '0'
    };
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '0.25rem' : '0'
    };
    margin: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '0 auto 0.75rem' : '0'
    };
    gap: 0.75rem;
  }
`;

const Banner = styled.div`
  position: relative;
  border-radius: 24px;
  width: 100%;
  height: 300px;
  overflow: hidden;
  aspect-ratio: 15 / 5;
  background: linear-gradient(180deg, rgba(91, 33, 182, 0.8) 0%, #22003a 80%, #22003a 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 0 32px #a259ff, 0 0 64px #ffd70044;
  border: 2px solid #ffd70044;
  margin-bottom: 2rem;
  animation: ${neonPulse} 3s infinite alternate;
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
    animation: ${floatAnimation} 6s infinite ease-in-out;
    pointer-events: none;
  }
  
  @media (max-width: 1200px) {
    height: 250px;
    border-radius: 20px;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 768px) {
    border-radius: 16px;
    height: 200px;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    border-radius: 12px;
    height: 150px;
    margin-bottom: 0.75rem;
  }
  
  @media (max-width: 400px) {
    border-radius: 8px;
    height: 120px;
    margin-bottom: 0.5rem;
  }
`;

const BannerBottomBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 80px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  pointer-events: none;
  padding-bottom: 12px;
  @media (max-width: 768px) {
    height: 48px;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    padding-bottom: 4px;
  }
`;

const Heading = styled.h2`
  color: #ffd700;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  text-shadow: 0 0 16px #ffd700, 0 0 32px #a259ff;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  &::after {
    content: " — where every flip flirts with fate.";
    font-weight: 400;
    font-size: 1.25rem;
    display: block;
    margin-top: 0.25rem;
    opacity: 0.9;
    color: #ffffff;
    text-shadow: 0 0 8px #a259ff;
    font-family: 'Arial', sans-serif;
    letter-spacing: 1px;
  }
  
  @media (max-width: 1200px) {
    font-size: 2.2rem;
    letter-spacing: 1.5px;
    &::after {
      font-size: 1.1rem;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    letter-spacing: 1px;
    &::after {
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
    letter-spacing: 0.5px;
    &::after {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 400px) {
    font-size: 1.2rem;
    &::after {
      display: none;
    }
  }
`;
import { useWallet } from "@solana/wallet-adapter-react";
import { POOLS } from "../../constants";
import { useTokenMeta } from "gamba-react-ui-v2";
import { Connection } from '@solana/web3.js';
import { RPC_ENDPOINT } from '../../constants';
import React, { useEffect, useState, useRef, useCallback } from "react";
// Throttle hook for future-proofing (matches ConnectionStatus pattern)
function useThrottle(callback: (...args: any[]) => void, delay: number) {
  const lastCall = useRef(0);
  return useCallback((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall.current > delay) {
      lastCall.current = now;
      callback(...args);
    }
  }, [callback, delay]);
}
const fadeInOut = keyframes`
  0% { opacity: 0; transform: translateY(10px);}
  10% { opacity: 1; transform: translateY(0);}
  90% { opacity: 1; transform: translateY(0);}
  100% { opacity: 0; transform: translateY(-10px);}
`;
const JackpotTicker = styled.div`
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;    /* vertical center */
  justify-content: center;/* horizontal center */
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: #ffd700;
  background: transparent;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem 1.5rem 1.5rem; /* more vertical padding, especially bottom */
  box-shadow: none;
  transition: background 0.3s;
  gap: 1rem;
  @media (max-width: 768px) {
    padding: 0.5rem 0.25rem;
    margin: 0 auto 1rem;
    gap: 1rem;
  }
`;

type JackpotInfo = {
  icon?: string;
  name: string;
  symbol: string;
  jackpot: number | string;
};

// Custom hook to cycle through random Degen/web3/Trench/casino quotes every 3 seconds
import { QUOTES } from "../../constants/QuotesVault";

function useRandomQuote(): string {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % QUOTES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  return `"${QUOTES[index]}" #DegenSerenade`;
}

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
`;

  
const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center; /* vertical center */
  align-items: center;    /* horizontal center */
  min-height: 32px;
  z-index: 1;

  &::before {
    content: '🎰';
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 2rem;
    padding: 0.5rem 1.5rem 0.5rem 1.5rem;
  }

  &::after {
    content: '🎲';
    position: absolute;
    bottom: 20px;
    left: 20px;
    font-size: 2rem;
    animation: ${sparkle} 2s infinite 1s;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
  @media (max-width: 768px) {
    &::before {
      font-size: 1.25rem;
      top: 10px;
      right: 10px;
      padding: 0.25rem 0.75rem 0.25rem 0.75rem;
    }
    &::after {
      font-size: 1.25rem;
      left: 10px;
      bottom: 10px;
      padding: 0.25rem 0.75rem 0.25rem 0.75rem;
    }
  }
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
  @media (max-width: 480px) {
    &::before, &::after {
      display: none;
    }
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
    padding-bottom: 0.5rem;

    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }

    > div {
      flex: 0 0 auto;
      min-width: 220px;
    }
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255, 215, 0, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-6px) scale(1.04);
    box-shadow: 0 0 24px #ffd700cc, 0 0 48px #a259ff88;
    border: 1.5px solid #ffd700;
  }

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    border-radius: 16px;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease-in-out;
  }

  &:hover::before {
    opacity: 0.3;
  }

  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    color: #ffd700;
    text-shadow: 0 0 8px #ffd700;
  }

  p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.9;
  }
`;


export function WelcomeBanner() {
  const wallet = useWallet();
  const quote = useRandomQuote();

  // Track if wallet auto-connect attempt has finished to prevent flash
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false);
  
  useEffect(() => {
    // If wallet.connecting just transitioned to false, mark auto-connect as attempted
    if (!wallet.connecting) {
      setAutoConnectAttempted(true);
    }
  }, [wallet.connecting]);

  // Show welcome banner only when:
  // 1. Auto-connect has been attempted (to prevent flash)
  // 2. Wallet is not connected
  // 3. Wallet is not currently connecting
  const shouldShow = autoConnectAttempted && !wallet.connected && !wallet.connecting;

  // Only render the DOM if the banner should be visible
  if (!shouldShow) return null;

  return (
    <Container $isVisible={true} $isLoading={false}>
      <Banner>
        <HeroOverlay>
          <Heading>Welcome to the casino of chaos</Heading>
        </HeroOverlay>
        <BannerBottomBar>
          <JackpotTicker key={quote}>{quote}</JackpotTicker>
        </BannerBottomBar>
      </Banner>
      <FeatureGrid>
        {[
          {
            title: "🔒 No Registration",
            text: "Just connect and start playing.",
          },
          {
            title: "🛡️ Non‑Custodial",
            text: "You always control your wallet.",
          },
          {
            title: "✅ Provably Fair",
            text: "On‑chain randomness, transparent.",
          },
          {
            title: "⚡ Instant Payouts",
            text: "Winnings go straight to wallet.",
          },
        ].map(({ title, text }) => (
          <FeatureCard key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </FeatureCard>
        ))}
      </FeatureGrid>
    </Container>
  );
}
