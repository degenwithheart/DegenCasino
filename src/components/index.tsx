import React from 'react'
import styled, { css } from 'styled-components'

export * from './GameSplashScreen'

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

// Export enhanced game controls
export * from './Sidebar';
export * from './Slider';
export * from './TrollBox';
export * from './EnhancedGameControls';
export * from './MobileControls';

// Re-export styled components for convenience
export { DesktopControlsContainer } from '../sections/Game/Game.styles';
