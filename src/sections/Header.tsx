// src/sections/Header.tsx
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useGambaPlatformContext,
  useUserBalance,
} from 'gamba-react-ui-v2'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { Modal } from '../components/Modal'
import LeaderboardsModal from '../sections/LeaderBoard/LeaderboardsModal'
import BonusModal from '../components/BonusModal'
import JackpotModal from '../components/JackpotModal'
import { PLATFORM_JACKPOT_FEE, PLATFORM_CREATOR_ADDRESS } from '../constants'
import { useMediaQuery } from '../hooks/useMediaQuery'
import TokenSelect from './TokenSelect'
import { UserButton } from './UserButton'
import { ENABLE_LEADERBOARD } from '../constants'
import { useIsCompact } from '../hooks/useIsCompact'
// import ConnectionStatus from '../components/ConnectionStatus'

/* ─────── Casino Animations ───────────────────────────────────────────── */

const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 12px #a259ff88, 0 0 24px #ffd70044;
    text-shadow: 0 0 8px #ffd700;
  }
  100% { 
    box-shadow: 0 0 24px #ffd700cc, 0 0 48px #a259ff88;
    text-shadow: 0 0 16px #ffd700, 0 0 32px #a259ff;
  }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`;

/* ─────── styled ───────────────────────────────────────────── */

const StyledHeader = styled.div<{ offset?: number }>`
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
  background: rgba(24, 24, 24, 0.85);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  border-bottom: 2px solid rgba(255, 215, 0, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(162, 89, 255, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }

  @media (max-width: 600px) {
    height: 80px;
    padding: 0.5rem 0.5rem;
    min-width: 0;
    box-shadow: 0 2px 12px rgba(0,0,0,0.25);
  }
`

const Logo = styled(NavLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 0.5rem;
  position: relative;
  margin-left: 1.5rem;

  /* Remove any background or box-shadow from Logo itself */

  &::before {
    content: '🎰';
    position: absolute;
    left: -30px;
    font-size: 1.5rem;
    animation: ${sparkle} 3s infinite;
  }

  img {
    height: 42px;
    transition: all 0.3s ease-in-out;
    filter: drop-shadow(0 0 8px #ffd700);
    border-radius: 8px;
  }

  span {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffd700;
    white-space: nowrap;
    user-select: none;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    text-shadow: 0 0 16px #ffd700, 0 0 32px #a259ff;
    letter-spacing: 1px;
    animation: ${neonPulse} 2s infinite alternate;
    /* Remove any background or box-shadow here as well */
    background: none !important;
    box-shadow: none !important;
  }

  &:hover {
    img {
      transform: scale(1.1) rotate(5deg);
      filter: drop-shadow(0 0 16px #ffd700);
    }
    
    span {
      transform: scale(1.05);
    }
  }

  @media (max-width: 600px) {
    margin-left: 0.5rem;
    &::before {
      left: -25px;
      font-size: 1.2rem;
    }

    img {
      height: 32px;
    }

    span {
      font-size: 1.1rem;
    }
  }
`

const Bonus = styled.button<{ noBackground?: boolean }>`
  background: ${({ noBackground }) => (noBackground ? 'transparent' : 'linear-gradient(135deg, rgba(162, 89, 255, 0.8), rgba(255, 215, 0, 0.6))')};
  color: #fff;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 12px rgba(162, 89, 255, 0.3);
  backdrop-filter: blur(10px);

  &:hover,
  &:focus {
    background: ${({ noBackground }) => (noBackground ? 'rgba(255, 215, 0, 0.1)' : 'linear-gradient(135deg, rgba(255, 215, 0, 0.8), rgba(162, 89, 255, 0.6))')};
    transform: translateY(-2px) scale(1.05);
    border-color: rgba(255, 215, 0, 0.6);
    outline: none;
  }

  @media (max-width: 600px) {
    padding: 5px 8px;
    font-size: 11px;
    border-radius: 8px;
  }
`

const JackpotBonus = styled(Bonus)`
  font-size: 16px;
  padding: 10px 18px;
  font-weight: 700;
  color: #222;
  background: linear-gradient(135deg, #ffd700, #ff9500);
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.8);
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 1px;

  &:hover,
  &:focus {
    background: linear-gradient(135deg, #ff9500, #ffd700);
    transform: translateY(-3px) scale(1.08);
    outline: none;
  }

  @media (max-width: 1024px) {
    font-size: 13px;
    padding: 7px 10px;
    border-radius: 8px;
  }
`

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
  const { compact: isCompact } = useIsCompact()

  const [bonusHelp, setBonusHelp] = React.useState(false)
  const [jackpotHelp, setJackpotHelp] = React.useState(false)
  const [showLeaderboard, setShowLeaderboard] = React.useState(false)

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

      {/* Header bar */}
      <StyledHeader>
        <Logo to="/">
          {!isCompact ? (
            <span>DegenHeart.casino</span>
          ) : (
            <img alt="DegenHeart.casino logo" src="/$DGHRT.png" />
          )}
        </Logo>

        <RightGroup $isCompact={isCompact}>
          {pool.jackpotBalance > 0 && (
            <JackpotBonus onClick={() => setJackpotHelp(true)} aria-label="Jackpot info">
              💰
              {!isCompact && <TokenValue amount={pool.jackpotBalance} />}
            </JackpotBonus>
          )}

          {balance.bonusBalance > 0 && (
            <Bonus onClick={() => setBonusHelp(true)} aria-label="Bonus info">
              ✨
              {!isCompact && <TokenValue amount={balance.bonusBalance} />}
            </Bonus>
          )}

          {/* Leaderboard trigger */}
          <GambaUi.Button onClick={() => setShowLeaderboard(true)} aria-label="Show Leaderboard">
            🏆
            {!isCompact && ' Leaderboard'}
          </GambaUi.Button>

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
