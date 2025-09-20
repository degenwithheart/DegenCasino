import React from 'react'
import styled from 'styled-components'
import { useRenderModeToggle } from '../../hooks/game/useRenderModeToggle'
import { ToggleIcon } from '../UI/Icons'

const ToggleButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: ${props => props.$isActive 
    ? 'rgba(255, 215, 0, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${props => props.$isActive 
    ? 'rgba(255, 215, 0, 0.5)' 
    : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  color: ${props => props.$isActive ? '#ffd700' : '#ffffff'};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 36px;
  min-height: 36px;

  &:hover {
    background: ${props => props.$isActive 
      ? 'rgba(255, 215, 0, 0.3)' 
      : 'rgba(255, 255, 255, 0.2)'};
    border-color: ${props => props.$isActive 
      ? 'rgba(255, 215, 0, 0.7)' 
      : 'rgba(255, 255, 255, 0.4)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const ModeLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.8);
`

interface RenderModeToggleProps {
  gameId: string
  showLabel?: boolean
  disabled?: boolean
}

export const RenderModeToggle: React.FC<RenderModeToggleProps> = ({
  gameId,
  showLabel = true,
  disabled = false
}) => {
  const { currentMode, canToggle, toggleMode } = useRenderModeToggle(gameId)

  const handleClick = () => {
    console.log(`[RenderModeToggle] Button clicked for game: ${gameId}`)
    console.log(`[RenderModeToggle] Can toggle: ${canToggle}`)
    console.log(`[RenderModeToggle] Disabled: ${disabled}`)
    if (canToggle && !disabled) {
      console.log(`[RenderModeToggle] Calling toggleMode...`)
      toggleMode()
    } else {
      console.log(`[RenderModeToggle] Toggle disabled - canToggle: ${canToggle}, disabled: ${disabled}`)
    }
  }

  if (!canToggle) {
    console.log(`[RenderModeToggle] Component hidden - canToggle: ${canToggle}, gameId: ${gameId}`)
    return null // Don't render if toggle is not available for this game
  }

  console.log('🔧 RenderModeToggle:', { gameId, currentMode, canToggle })

  return (
    <ToggleContainer>
      <ToggleButton
        $isActive={currentMode === '3D'}
        onClick={handleClick}
        disabled={disabled}
        title={`Switch to ${currentMode === '2D' ? '3D' : '2D'} mode`}
      >
        <ToggleIcon mode={currentMode} />
      </ToggleButton>
      {showLabel && <ModeLabel>{currentMode}</ModeLabel>}
    </ToggleContainer>
  )
}