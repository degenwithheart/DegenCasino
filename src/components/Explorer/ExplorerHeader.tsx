import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { useTheme } from '../../themes/ThemeContext'

// Keyframe animations matching dashboard style
const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`

interface CompactProps {
  $compact?: boolean;
  $theme?: any;
}

const ExplorerHeaderContainer = styled.div<CompactProps>`
  text-align: center;
  margin-bottom: ${({ $compact }) => ($compact ? '2rem' : '3rem')};
  position: relative;
`

const ExplorerTitle = styled.h1<CompactProps>`
  font-size: ${({ $compact }) => ($compact ? '2.5rem' : '3rem')};
  font-family: 'Luckiest Guy', cursive, sans-serif;
  background: linear-gradient(90deg, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}, ${({ $theme }) => $theme?.colors?.accent || '#ff00cc'}, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'});
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  animation: ${moveGradient} 3s linear infinite;
  text-shadow: 0 0 30px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}80;
  
  @media (max-width: 768px) {
    font-size: ${({ $compact }) => ($compact ? '2rem' : '2.5rem')};
  }
`

const ExplorerSubtitle = styled.p<CompactProps>`
  font-size: ${({ $compact }) => ($compact ? '1.1rem' : '1.3rem')};
  color: ${({ $theme }) => $theme?.colors?.textSecondary || 'rgba(255, 255, 255, 0.8)'};
  margin-bottom: ${({ $compact }) => ($compact ? '1.5rem' : '2rem')};
  font-weight: 300;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`

// Animated accent bar
const AccentBar = styled.div<CompactProps>`
  height: ${({ $compact }) => ($compact ? '4px' : '6px')};
  width: 60%;
  max-width: 400px;
  margin: 0 auto ${({ $compact }) => ($compact ? '1.5rem' : '2rem')};
  border-radius: 3px;
  background: linear-gradient(90deg, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}, ${({ $theme }) => $theme?.colors?.accent || '#ff00cc'}, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'});
  background-size: 300% 100%;
  animation: ${moveGradient} 3s linear infinite;
  box-shadow: 0 0 20px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}66;
`

const CasinoSparkles = styled.div`
  position: absolute;
  top: -20px;
  right: 10%;
  font-size: 2rem;
  animation: ${sparkle} 2s infinite;
  pointer-events: none;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    right: 5%;
  }
`

export function ExplorerHeader() {
  const isCompact = useIsCompact()
  const { currentTheme } = useTheme()
  
  return (
    <ExplorerHeaderContainer $compact={!!isCompact}>
      <CasinoSparkles>✨🎰✨</CasinoSparkles>
      <ExplorerTitle $compact={!!isCompact} $theme={currentTheme}>🔍 DegenCasino Explorer</ExplorerTitle>
      <AccentBar $compact={!!isCompact} $theme={currentTheme} />
      <ExplorerSubtitle $compact={!!isCompact} $theme={currentTheme}>
        Explore transactions, players, and platform statistics
      </ExplorerSubtitle>
    </ExplorerHeaderContainer>
  )
}
