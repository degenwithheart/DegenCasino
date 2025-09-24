// src/sections/Header.tsx
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useGambaPlatformContext,
  useUserBalance,
} from 'gamba-react-ui-v2'
import { useWallet } from '@solana/wallet-adapter-react'
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { Modal } from '../components'
import LeaderboardsModal from '../sections/LeaderBoard/LeaderboardsModal'
import { BonusModal, JackpotModal, ColorSchemeSelector } from '../components'
import { PLATFORM_JACKPOT_FEE, PLATFORM_CREATOR_ADDRESS } from '../constants'
import { useMediaQuery } from '../hooks/ui/useMediaQuery'
import TokenSelect from './TokenSelect'
import { UserButton } from './UserButton'
import { ENABLE_LEADERBOARD } from '../constants'
import { useIsCompact } from '../hooks/ui/useIsCompact'
import { useColorScheme } from '../themes/ColorSchemeContext'


/* ─────── Romantic Degen Serenade Animations ───────────────────────────────────────────── */

const romanticPulse = keyframes`
  0% { 
    box-shadow: 0 0 20px rgba(212, 165, 116, 0.4), 0 0 40px rgba(184, 51, 106, 0.2);
    text-shadow: 0 0 12px rgba(212, 165, 116, 0.6), 0 0 24px rgba(184, 51, 106, 0.3);
  }
  50% { 
    box-shadow: 0 0 30px rgba(212, 165, 116, 0.6), 0 0 60px rgba(184, 51, 106, 0.4);
    text-shadow: 0 0 20px rgba(212, 165, 116, 0.8), 0 0 40px rgba(184, 51, 106, 0.5);
  }
  100% { 
    box-shadow: 0 0 20px rgba(212, 165, 116, 0.4), 0 0 40px rgba(184, 51, 106, 0.2);
    text-shadow: 0 0 12px rgba(212, 165, 116, 0.6), 0 0 24px rgba(184, 51, 106, 0.3);
  }
`;

const loveLetterFloat = keyframes`
  0%, 100% { 
    opacity: 0.6; 
    transform: rotate(0deg) scale(0.9) translateY(0px); 
  }
  33% { 
    opacity: 1; 
    transform: rotate(2deg) scale(1.1) translateY(-3px); 
  }
  66% { 
    opacity: 0.8; 
    transform: rotate(-1deg) scale(1.05) translateY(2px); 
  }
`;

const candlestickGlow = keyframes`
  0% { 
    filter: drop-shadow(0 0 15px rgba(212, 165, 116, 0.6));
  }
  50% { 
    filter: drop-shadow(0 0 25px rgba(184, 51, 106, 0.8));
  }
  100% { 
    filter: drop-shadow(0 0 15px rgba(212, 165, 116, 0.6));
  }
`;

/* ─────── styled ───────────────────────────────────────────── */

const StyledHeader = styled.div<{ offset?: number; $colorScheme?: any }>`
  position: fixed;
  top: ${({ offset }) => offset ?? 0}px;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  height: 100px;
  padding: 0 2rem;
  
  /* Romantic Glassmorphism Background */
  background: rgba(10, 5, 17, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(212, 165, 116, 0.2);
  box-shadow: 
    0 8px 32px rgba(139, 90, 158, 0.15),
    0 0 40px rgba(212, 165, 116, 0.1);

  /* Leave space for scrollbar on desktop devices with mouse */
  @media (hover: hover) and (pointer: fine) {
    right: 15px;
  }

  /* Romantic atmosphere overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.04) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(184, 51, 106, 0.03) 0%, transparent 50%),
      linear-gradient(90deg, rgba(139, 90, 158, 0.02) 0%, transparent 50%, rgba(139, 90, 158, 0.02) 100%);
    pointer-events: none;
    z-index: -1;
  }

  /* Jazz midnight border effect */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(212, 165, 116, 0.6) 25%, 
      rgba(184, 51, 106, 0.4) 50%, 
      rgba(139, 90, 158, 0.6) 75%, 
      transparent 100%
    );
    animation: ${romanticPulse} 4s infinite ease-in-out;
  }

  /* Mobile responsive */
  @media (max-width: 600px) {
    height: 80px;
    padding: 0.5rem;
    min-width: 0;
    box-shadow: 
      0 4px 16px rgba(139, 90, 158, 0.2),
      0 0 20px rgba(212, 165, 116, 0.08);
  }

  /* Small mobile */
  @media (max-width: 479px) {
    height: 70px;
    padding: 0.25rem;
  }
`

const Logo = styled(NavLink)<{ $colorScheme?: any }>`
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 0.75rem;
  position: relative;
  margin-left: 1.5rem;

  img {
    height: 42px;
    width: auto;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 0 12px ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'});
    border-radius: 12px;
    object-fit: contain;
    animation: ${candlestickGlow} 3s infinite ease-in-out;
  }

  span {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'};
    white-space: nowrap;
    user-select: none;
    font-family: 'Libre Baskerville', 'DM Sans', serif;
    text-shadow: 
      0 0 20px ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'}, 
      0 0 40px ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#b8336a'},
      0 0 8px rgba(244, 233, 225, 0.4);
    letter-spacing: 0.5px;
    animation: ${romanticPulse} 3s infinite ease-in-out;
    background: none !important;
    box-shadow: none !important;
    position: relative;
  }

  /* Love letter heart accent */
  span::after {
    content: '♡';
    position: absolute;
    top: -8px;
    right: -12px;
    font-size: 0.6em;
    opacity: 0.7;
    color: ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#b8336a'};
    animation: ${loveLetterFloat} 4s infinite ease-in-out;
  }

  &:hover {
    img {
      transform: scale(1.1) rotate(3deg);
      filter: drop-shadow(0 0 20px ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'})
              drop-shadow(0 0 30px ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#b8336a'});
    }
    
    span {
      transform: scale(1.05) translateY(-2px);
      text-shadow: 
        0 0 30px ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'}, 
        0 0 60px ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#b8336a'},
        0 0 12px rgba(244, 233, 225, 0.6);
    }

    span::after {
      transform: scale(1.2) rotate(10deg);
      opacity: 1;
    }
  }

  /* Tablet responsive */
  @media (max-width: 768px) {
    margin-left: 1rem;
    gap: 0.5rem;
    
    img {
      height: 36px;
    }

    span {
      font-size: 1.3rem;
    }
  }

  /* Mobile responsive */
  @media (max-width: 600px) {
    margin-left: 0.5rem;
    gap: 0.4rem;
    
    img {
      height: 32px;
    }

    span {
      font-size: 1.1rem;
    }
  }

  /* Small mobile */
  @media (max-width: 479px) {
    gap: 0.25rem;
    
    img {
      height: 28px;
    }

    span {
      font-size: 1rem;
    }

    span::after {
      display: none; /* Hide heart on very small screens */
    }
  }
`

const Bonus = styled.button<{ $colorScheme?: any }>`
  /* Romantic glassmorphism button */
  background: ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}14` : 'rgba(212, 165, 116, 0.08)'};
  backdrop-filter: blur(8px);
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || '#f4e9e1'};
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}2E` : 'rgba(212, 165, 116, 0.18)'};
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}33` : 'rgba(212, 165, 116, 0.2)'}, 
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover,
  &:focus {
    transform: translateY(-2px);
    color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'};
    border-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'};
    background: ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}26` : 'rgba(212, 165, 116, 0.15)'};
    box-shadow: 
      0 8px 24px ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}26` : 'rgba(139, 90, 158, 0.15)'},
      0 0 20px ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}4D` : 'rgba(212, 165, 116, 0.3)'};
    outline: none;
    text-shadow: 0 0 8px ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}66` : 'rgba(212, 165, 116, 0.4)'};
  }

  &:hover::before {
    left: 100%;
  }

  @media (max-width: 1024px) {
    font-size: 13px;
    padding: 6px 10px;
    border-radius: 10px;
  }

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 5px 8px;
    border-radius: 8px;
  }
`

const JackpotBonus = styled.button<{ $colorScheme?: any }>`
  /* Romantic glassmorphism jackpot button with enhanced glow */
  background: ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}14` : 'rgba(184, 51, 106, 0.08)'};
  backdrop-filter: blur(8px);
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || '#f4e9e1'};
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}2E` : 'rgba(184, 51, 106, 0.18)'};
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}33` : 'rgba(184, 51, 106, 0.2)'}, 
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover,
  &:focus {
    transform: translateY(-2px);
    color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#b8336a'};
    border-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#b8336a'};
    background: ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}26` : 'rgba(184, 51, 106, 0.15)'};
    box-shadow: 
      0 8px 24px ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}26` : 'rgba(139, 90, 158, 0.15)'},
      0 0 25px ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}66` : 'rgba(184, 51, 106, 0.4)'};
    outline: none;
    text-shadow: 0 0 8px ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}66` : 'rgba(184, 51, 106, 0.4)'};
  }

  &:hover::before {
    left: 100%;
  }

  @media (max-width: 1024px) {
    font-size: 13px;
    padding: 6px 10px;
    border-radius: 10px;
  }

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 5px 8px;
    border-radius: 8px;
  }
`;

const ThemeButton = styled.button<{ $colorScheme?: any }>`
  /* Romantic glassmorphism colorScheme button */
  background: ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}14` : 'rgba(139, 90, 158, 0.08)'};
  backdrop-filter: blur(8px);
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || '#f4e9e1'};
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}2E` : 'rgba(139, 90, 158, 0.18)'};
  border-radius: 12px;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}33` : 'rgba(139, 90, 158, 0.2)'}, 
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover,
  &:focus {
    transform: translateY(-2px);
    color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#8b5a9e'};
    border-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#8b5a9e'};
    background: ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}26` : 'rgba(139, 90, 158, 0.15)'};
    box-shadow: 
      0 8px 24px ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}26` : 'rgba(139, 90, 158, 0.15)'},
      0 0 20px ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}4D` : 'rgba(139, 90, 158, 0.3)'};
    outline: none;
    text-shadow: 0 0 8px ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}66` : 'rgba(139, 90, 158, 0.4)'};
  }

  &:hover::before {
    left: 100%;
  }

  @media (max-width: 1024px) {
    font-size: 12px;
    padding: 6px 8px;
    border-radius: 10px;
  }

  @media (max-width: 600px) {
    padding: 5px 7px;
    font-size: 11px;
    border-radius: 8px;
  }
`;

const LeaderboardButton = styled.button<{ $colorScheme?: any }>`
  /* Romantic glassmorphism leaderboard button */
  background: ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}14` : 'rgba(255, 175, 0, 0.08)'};
  backdrop-filter: blur(8px);
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || '#f4e9e1'};
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}2E` : 'rgba(255, 175, 0, 0.18)'};
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}33` : 'rgba(255, 175, 0, 0.2)'}, 
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover,
  &:focus {
    transform: translateY(-2px);
    color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffaf00'};
    border-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffaf00'};
    background: ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}26` : 'rgba(255, 175, 0, 0.15)'};
    box-shadow: 
      0 8px 24px ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}26` : 'rgba(139, 90, 158, 0.15)'},
      0 0 20px ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}4D` : 'rgba(255, 175, 0, 0.3)'};
    outline: none;
    text-shadow: 0 0 8px ${({ $colorScheme }) => $colorScheme?.colors?.primary ? `${$colorScheme.colors.primary}66` : 'rgba(255, 175, 0, 0.4)'};
  }

  &:hover::before {
    left: 100%;
  }

  @media (max-width: 1024px) {
    font-size: 13px;
    padding: 6px 10px;
    border-radius: 10px;
  }

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 5px 8px;
    border-radius: 8px;
  }
`;

const RightGroup = styled.div<{ $isCompact: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-left: 20px;
  
  @media (max-width: 600px) {
    gap: 4px;
    justify-content: flex-start;
    padding-left: 4px;
    min-width: 0;
    overflow-x: auto;
  }
`

/* ─────── component ─────────────────────────────────────────── */

export default function Header() {
  const pool = useCurrentPool()
  const context = useGambaPlatformContext()
  const balance = useUserBalance()
  const { compact: isCompact, mobile } = useIsCompact()
  const navigate = useNavigate()
  const { currentColorScheme } = useColorScheme()
  const { connected } = useWallet()

  const [bonusHelp, setBonusHelp] = React.useState(false)
  const [jackpotHelp, setJackpotHelp] = React.useState(false)
  const [showLeaderboard, setShowLeaderboard] = React.useState(false)
  const [showThemeSelector, setShowThemeSelector] = React.useState(false)

  return (
    <>
      {/* Bonus info modal */}
      {bonusHelp && (
        <BonusModal onClose={() => setBonusHelp(false)} />
      )}

      {/* Jackpot info modal */}
      {jackpotHelp && (
        <JackpotModal onClose={() => setJackpotHelp(false)} />
      )}

      {/* Leaderboards modal */}
      {showLeaderboard && (
        <LeaderboardsModal
          creator={PLATFORM_CREATOR_ADDRESS.toBase58()}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* Theme selector modal */}
      {showThemeSelector && (
        <Modal onClose={() => setShowThemeSelector(false)}>
          <ColorSchemeSelector />
        </Modal>
      )}

      {/* Header bar */}
      <StyledHeader>
        <Logo to="/" $colorScheme={currentColorScheme}>
          <img alt="DegenHeart.casino logo" src="/png/images/logo.png" />
          {!isCompact && <span>DegenHeart.casino</span>}
        </Logo>

        <RightGroup $isCompact={isCompact}>
          {connected && pool.jackpotBalance > 0 && (
            <JackpotBonus onClick={() => (mobile ? navigate('/jackpot') : setJackpotHelp(true))} aria-label="Jackpot info" $colorScheme={currentColorScheme}>
              💰
              {!isCompact && 'Jackpot'}
            </JackpotBonus>
          )}

          {connected && (
            <Bonus onClick={() => (mobile ? navigate('/bonus') : setBonusHelp(true))} aria-label="Bonus info" $colorScheme={currentColorScheme}>
              ✨
              {!isCompact && 'Bonus'}
            </Bonus>
          )}

          {/* Leaderboard trigger */}
          {connected && (
            <LeaderboardButton onClick={() => (mobile ? navigate('/leaderboard') : setShowLeaderboard(true))} aria-label="Show Leaderboard" $colorScheme={currentColorScheme}>
              🏆
              {!isCompact && ' Leaderboard'}
            </LeaderboardButton>
          )}

          {/* Theme selector trigger */}
          {connected && (
            <ThemeButton onClick={() => setShowThemeSelector(true)} aria-label="Choose Theme" $colorScheme={currentColorScheme}>
              🎨
              {!isCompact && ' Theme'}
            </ThemeButton>
          )}

          {/* Pass isCompact to UserButton to hide text on small */}
          <UserButton />

          {/* <ConnectionStatus /> */}
        </RightGroup>
      </StyledHeader>

      {/* Spacer for mobile so content isn't hidden behind the header */}
      <div style={{ height: isCompact ? '80px' : '100px' }} />
    </>
  )
}
