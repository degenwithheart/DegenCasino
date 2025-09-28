import React from 'react'
import styled, { css } from 'styled-components'

// AllGamesModal
export { default as AllGamesModal } from './AllGamesModal/AllGamesModal'

// Bonus
export { default as BonusModal, BonusContent } from './Bonus/BonusModal'

// Cache
export * from './Cache/CacheDebugPanel'

// Connection
export { default as ConnectionStatus } from './Connection/ConnectionStatus'
export * from './Connection/PropagationStatus'

// Dropdown
export * from './Dropdown/Dropdown'

// Explorer
export * from './Explorer/ExplorerHeader'
export { default as ExplorerIndex } from './Explorer/ExplorerIndex'

// Game
export * from './Game/EnhancedGameControls'
export { FullscreenPortal } from './Game/FullscreenPortal'
export { default as GameplayFrame } from './Game/GameplayFrame'
export type { GameplayEffectsRef } from './Game/GameplayFrame'
export { default as GameScreenFrame, useGraphics, GraphicsProvider } from './Game/GameScreenFrame'
export * from './Game/GameSplashScreen'
export { default as LazyGameLoader } from './Game/LazyGameLoader'
export { GameStatsHeader } from './Game/GameStatsHeader'
export { GameControlsSection } from './Game/GameControlsSection'
export { GameRecentPlays } from './Game/GameRecentPlays'
export { GameRecentPlaysHorizontal } from './Game/GameRecentPlaysHorizontal'


// Graphics
export * from './Graphics/GraphicsSettings'

// Jackpot
export { default as JackpotModal, JackpotContent } from './Jackpot/JackpotModal'

// TOS
export { default as TOSModal, TOSContent } from './TOS/TOSModal'

// Desktop
export * from './Desktop/DesktopControls'

// Mobile
export * from './Mobile/MobileControls'
export * from './Mobile/MobileGameControls'

// Modal
export * from './Modal/ErrorModal'
export * from './Modal/Modal'

// Platform
export * from './Platform/PlatformView'
export * from './Platform/PlayerView'

// Referral
export * from './Referral/CompactReferralLeaderboard'
export * from './Referral/FullReferralLeaderboard'
export * from './Referral/ReferralDashboard'
export * from './Referral/ReferralLeaderboardModal'

// Share
export * from './Share/ShareModal'

// Theme
export * from './Theme/ColorSchemeSelector'

// Transaction
export { default as EmbeddedTransaction } from './Transaction/EmbeddedTransaction'
export * from './Transaction/FeesTab'
export { default as Transaction } from './Transaction/Transaction'

// UI
export { default as EnhancedTickerTape } from './UI/EnhancedTickerTape'
export { Icon } from './UI/Icon'
export { default as PriceIndicator } from './UI/PriceIndicator'
export { default as ResponsiveImage } from './UI/ResponsiveImage'
export { default as Sidebar } from './UI/Sidebar'
export * from './UI/Slider'
export { default as TrollBox } from './UI/TrollBox'

// Styled Components and Utilities
export const SelectableButton = styled.button<{selected?: boolean}>`
  all: unset;
  display: block;
  border-radius: max(var(--radius-2), var(--radius-full));
  width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;
  cursor: pointer;
  transition: background .1s;
  ${(props) => props.selected ? css`
    background: var(--accent-a3);
  ` : css`
    &:hover {
      background: var(--accent-a2);
    }
    background: transparent;
    color: inherit;
  `}
`

export const Address = (props: {children: string}) => {
  return (
    <span title={props.children}>
      {props.children.slice(0, 6) + '...' + props.children.slice(-6)}
    </span>
  )
}

export const Flex = styled.div<{gap?: number}>`
  display: flex;
  gap: ${props => props.gap ?? 10}px;
`

// Re-export styled components for convenience
export { DesktopControlsContainer } from '../sections/Game/Game.styles'
