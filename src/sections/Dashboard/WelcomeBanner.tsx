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
import { useTheme } from "../../themes/ThemeContext";

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

const Container = styled.div<{ $isVisible: boolean; $isLoading: boolean; $theme?: any }>`
  margin: ${({ $isVisible, $isLoading }) => 
    $isLoading || $isVisible ? '1.5rem 0' : '0'
  };
  padding: ${({ $isVisible, $isLoading }) => 
    $isLoading || $isVisible ? '1.25rem' : '0'
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
  background: ${({ $isVisible, $isLoading, $theme }) => 
    $isLoading || $isVisible ? ($theme?.colors?.background || '#0f0f23') : 'transparent'
  };
  border-radius: ${({ $isVisible, $isLoading }) => 
    $isLoading || $isVisible ? '12px' : '0'
  };
  border: ${({ $isVisible, $isLoading, $theme }) => 
    $isLoading || $isVisible ? `1px solid ${$theme?.colors?.border || '#2a2a4a'}` : 'none'
  };
  position: relative;

  ${({ $isVisible, $isLoading, $theme }) => ($isLoading || $isVisible) && `
    &:hover {
      border-color: ${$theme?.colors?.primary || '#ffd700'};
      box-shadow: 0 0 24px ${$theme?.colors?.primary || 'rgba(255, 215, 0, 0.2)'};
      transform: translateY(-2px);
    }
  `}

  @media (max-width: 900px) {
    margin: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '1rem 0' : '0'
    };
    padding: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '1rem 0.75rem' : '0'
    };
  }
  
  @media (max-width: 700px) {
    margin: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '0.75rem 0' : '0'
    };
    padding: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '1rem 0.5rem' : '0'
    };
    border-radius: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '12px' : '0'
    };
  }
  
  @media (max-width: 480px) {
    margin: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '0.5rem 0' : '0'
    };
    padding: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '0.75rem 0.5rem' : '0'
    };
    border-radius: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '12px' : '0'
    };
  }
  
  @media (max-width: 400px) {
    margin: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '0.25rem 0' : '0'
    };
    padding: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '0.5rem 0.4rem' : '0'
    };
    border-radius: ${({ $isVisible, $isLoading }) => 
      $isLoading || $isVisible ? '8px' : '0'
    };
  }
`;

const Banner = styled.div<{ $theme?: any }>`
  position: relative;
  border-radius: 12px;
  width: 100%;
  /* switch to min-height so surrounding frames control overall layout */
  min-height: 180px;
  overflow: hidden;
  background: linear-gradient(180deg, ${({ $theme }) => $theme?.colors?.surface || 'rgba(91, 33, 182, 0.8)'} 0%, ${({ $theme }) => $theme?.colors?.background || '#22003a'} 80%, ${({ $theme }) => $theme?.colors?.background || '#22003a'} 100%);
  border: 1px solid ${({ $theme }) => $theme?.colors?.border || '#2a2a4a'};
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
    box-shadow: 0 0 24px ${({ $theme }) => $theme?.colors?.primary || 'rgba(255, 215, 0, 0.2)'};
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, ${({ $theme }) => $theme?.colors?.primary || 'rgba(255, 215, 0, 0.1)'} 0%, transparent 50%);
    animation: ${floatAnimation} 6s infinite ease-in-out;
    pointer-events: none;
  }

  @media (max-width: 1200px) {
    min-height: 160px;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    min-height: 140px;
    margin-bottom: 0.75rem;
  }

  @media (max-width: 480px) {
    min-height: 120px;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 400px) {
    min-height: 100px;
    margin-bottom: 0.5rem;
  }
`;

const BannerBottomBar = styled.div<{ $theme?: any }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 64px;
  background: linear-gradient(180deg, transparent 0%, ${({ $theme }) => $theme?.colors?.background || 'rgba(0, 0, 0, 0.7)'} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  pointer-events: none;
  padding: 0 1rem;
  backdrop-filter: blur(8px);

  @media (max-width: 768px) {
    height: 56px;
    padding: 0 0.75rem;
  }

  @media (max-width: 480px) {
    height: 48px;
    padding: 0 0.5rem;
  }
`;

const Heading = styled.h2<{ $theme?: any }>`
  color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  text-shadow: 0 0 16px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, 0 0 32px ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'};
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  line-height: 1.2;

  &::after {
    content: " — where every flip flirts with fate.";
    font-weight: 400;
    font-size: 1.25rem;
    display: block;
    margin-top: 0.25rem;
    opacity: 0.9;
    color: ${({ $theme }) => $theme?.colors?.text || '#ffffff'};
    text-shadow: 0 0 8px ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'};
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
const JackpotTicker = styled.div<{ $theme?: any }>`
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
  background: transparent;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem 1.5rem 1.5rem;
  box-shadow: none;
  transition: background 0.3s;
  gap: 1rem;
  text-shadow: 0 0 8px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
  font-family: 'Arial', sans-serif;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    margin: 0 auto 1rem;
    gap: 0.75rem;
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    gap: 0.5rem;
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

  
const HeroOverlay = styled.div<{ $theme?: any }>`
  position: absolute;
  inset: 0;
  background: ${({ $theme }) => $theme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 32px;
  z-index: 1;

  &::before {
    content: '🎰';
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 1.6rem;
    padding: 0.35rem 1rem;
    opacity: 0.85;
  }

  &::after {
    content: '🎲';
    position: absolute;
    bottom: 16px;
    left: 16px;
    font-size: 1.6rem;
    animation: ${sparkle} 2s infinite 1s;
    opacity: 0.85;
  }

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    &::before {
      font-size: 1.3rem;
      top: 12px;
      right: 12px;
      padding: 0.25rem 0.75rem;
    }
    &::after {
      font-size: 1.3rem;
      left: 12px;
      bottom: 12px;
      padding: 0.25rem 0.75rem;
    }
  }

  @media (max-width: 480px) {
    padding: 0.75rem 0.5rem;
    &::before, &::after {
      display: none;
    }
  }
`;

const FeatureGrid = styled.div<{ $theme?: any }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
    padding-bottom: 0.5rem;
    margin-top: 1.5rem;

    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: ${({ $theme }) => $theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'} transparent;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${({ $theme }) => $theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
      border-radius: 3px;
    }

    > div {
      flex: 0 0 auto;
      min-width: 220px;
    }
  }
`;

const FeatureCard = styled.div<{ $theme?: any }>`
  background: ${({ $theme }) => $theme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${({ $theme }) => $theme?.colors?.border || '#2a2a4a'};
  border-radius: 12px;
  padding: 1.5rem;
  color: ${({ $theme }) => $theme?.colors?.text || '#fff'};
  text-align: center;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 24px ${({ $theme }) => $theme?.colors?.primary || 'rgba(255, 215, 0, 0.2)'};
    border-color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
  }

  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
    text-shadow: 0 0 8px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.9;
    color: ${({ $theme }) => $theme?.colors?.textSecondary || '#c0c0c0'};
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    h3 {
      font-size: 1.1rem;
    }
    p {
      font-size: 0.9rem;
    }
  }
`;


export function WelcomeBanner() {
  const wallet = useWallet();
  const quote = useRandomQuote();
  const { currentTheme } = useTheme();

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
    <Container $isVisible={true} $isLoading={false} $theme={currentTheme}>
      <Banner $theme={currentTheme}>
        <HeroOverlay $theme={currentTheme}>
          <Heading $theme={currentTheme}>Welcome to the casino of chaos</Heading>
        </HeroOverlay>
        <BannerBottomBar $theme={currentTheme}>
          <JackpotTicker $theme={currentTheme} key={quote}>{quote}</JackpotTicker>
        </BannerBottomBar>
      </Banner>
      <FeatureGrid $theme={currentTheme}>
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
          <FeatureCard $theme={currentTheme} key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </FeatureCard>
        ))}
      </FeatureGrid>
    </Container>
  );
}
