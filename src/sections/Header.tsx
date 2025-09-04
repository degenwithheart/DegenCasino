// src/sections/Header.tsx
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useGambaPlatformContext,
  useUserBalance,
} from 'gamba-react-ui-v2'
import React, { useEffect } from 'react'
import { prefetchBatch, useHoverPrefetch } from '../hooks/usePrefetch'
import { NavLink, useNavigate } from 'react-router-dom'
import { Modal } from '../components'
import LeaderboardsModal from '../sections/LeaderBoard/LeaderboardsModal'
import { BonusModal, JackpotModal, ThemeSelector } from '../components'
import { SmartImage } from '../components/UI/SmartImage'
import SettingsModal from '../components/Settings/SettingsModal'
import { useUserStore } from '../hooks/useUserStore'
import { PLATFORM_JACKPOT_FEE, PLATFORM_CREATOR_ADDRESS } from '../constants'
import { useMediaQuery } from '../hooks/useMediaQuery'
import TokenSelect from './TokenSelect'
import { UserButton } from './UserButton'
import { ENABLE_LEADERBOARD } from '../constants'
import { useIsCompact } from '../hooks/useIsCompact'
import { useTheme } from '../themes/ThemeContext'
import * as S from './Header.styles'

/* ─────── component ─────────────────────────────────────────── */

export default function Header() {
  const pool = useCurrentPool()
  const context = useGambaPlatformContext()
  const balance = useUserBalance()
  const { compact: isCompact, mobile } = useIsCompact()
  const navigate = useNavigate()
  const { currentTheme } = useTheme()

  const [bonusHelp, setBonusHelp] = React.useState(false)
  const [jackpotHelp, setJackpotHelp] = React.useState(false)
  const [showLeaderboard, setShowLeaderboard] = React.useState(false)
  const [showThemeSelector, setShowThemeSelector] = React.useState(false)
  const [showSettings, setShowSettings] = React.useState(false)
  const dataSaver = useUserStore(s => s.dataSaver)

  // Idle prefetch a small set of common secondary pages
  useEffect(() => {
    prefetchBatch([
      ['bonus-page', () => import('../pages/BonusPage')],
      ['jackpot-page', () => import('../pages/JackpotPage')],
      ['leaderboard-page', () => import('../pages/LeaderboardPage')],
      ['select-token-page', () => import('../pages/SelectTokenPage')],
    ])
  }, [])

  const pfLeaderboard = useHoverPrefetch('leaderboard-modal', () => import('../sections/LeaderBoard/LeaderboardsModal'))
  const pfTheme = useHoverPrefetch('theme-selector', () => import('../components/Theme/ThemeSelector'))
  const pfBonus = useHoverPrefetch('bonus-modal', () => import('../components/Bonus/BonusModal'))
  const pfJackpot = useHoverPrefetch('jackpot-modal', () => import('../components/Jackpot/JackpotModal'))

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
          <ThemeSelector />
        </Modal>
      )}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}

      {/* Header bar */}
      <S.StyledHeader>
        <S.Logo to="/" $theme={currentTheme}>
          {!isCompact ? (
            <span>DegenHeart.casino</span>
          ) : (
            <SmartImage alt="DegenHeart.casino logo" src="/webp/$DGHRT.webp" style={{height:32}} />
          )}
        </S.Logo>

        <S.RightGroup $isCompact={isCompact}>
          {pool.jackpotBalance > 0 && (
            <S.JackpotBonus onMouseEnter={pfJackpot} onFocus={pfJackpot} onClick={() => (mobile ? navigate('/jackpot') : setJackpotHelp(true))} aria-label="Jackpot info" $theme={currentTheme}>
              💰
              {!isCompact && 'Jackpot'}
            </S.JackpotBonus>
          )}

          <S.Bonus onMouseEnter={pfBonus} onFocus={pfBonus} onClick={() => (mobile ? navigate('/bonus') : setBonusHelp(true))} aria-label="Bonus info" $theme={currentTheme}>
            ✨
            {!isCompact && 'Bonus'}
          </S.Bonus>

          {/* Leaderboard trigger */}
          <span onMouseEnter={pfLeaderboard} onFocus={pfLeaderboard} style={{display:'inline-flex'}}>
            <GambaUi.Button onClick={() => (mobile ? navigate('/leaderboard') : setShowLeaderboard(true))} aria-label="Show Leaderboard">
              🏆
              {!isCompact && ' Leaderboard'}
            </GambaUi.Button>
          </span>

          {/* Theme selector trigger */}
          <S.ThemeButton onClick={() => setShowSettings(true)} aria-label="Open Settings" $theme={currentTheme}>
            ⚙️
            {!isCompact && ' Settings'}
          </S.ThemeButton>

          {dataSaver && (
            <div style={{
              display:'flex',
              alignItems:'center',
              gap:4,
              background:'linear-gradient(90deg,#333,#222)',
              padding:'4px 8px',
              borderRadius:8,
              fontSize:'.55rem',
              letterSpacing:'.75px',
              border:'1px solid #444',
              boxShadow:'0 0 6px #000',
              position:'relative'
            }} title="Prefetch paused (Data Saver)">
              <span style={{color:'#ffd700'}}>⏸ PREFETCH</span>
            </div>
          )}

          {/* Pass isCompact to UserButton to hide text on small */}
          <UserButton />

          {/* <ConnectionStatus /> */}
        </S.RightGroup>
      </S.StyledHeader>

      {/* Spacer for mobile so content isn't hidden behind the header */}
      <div style={{ height: isCompact ? '80px' : '100px' }} />
    </>
  )
}
