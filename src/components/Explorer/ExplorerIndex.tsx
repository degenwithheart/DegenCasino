import React from 'react'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { PLATFORM_CREATOR_ADDRESS } from '../../constants'
import { useColorScheme } from '../../themes/ColorSchemeContext'
import {
  UnifiedPageContainer,
  UnifiedPageTitle,
  UnifiedSection,
  UnifiedSectionTitle,
  UnifiedContent,
  UnifiedGrid
} from '../UI/UnifiedDesign'

// Keyframe animations matching dashboard style
const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #ffd70044;
  }
  100% { 
    box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88;
    border-color: #ffd700aa;
  }
`

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`

const floatUp = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`

const ExplorerContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`

const ExplorerHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
`

const ExplorerTitle = styled.h1`
  font-size: 3rem;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  background: linear-gradient(90deg, #ffd700, #a259ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
`

const ExplorerSubtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 32px;
`

const QuickLinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`

const QuickLinkCard = styled(Link)<{ $colorScheme?: any }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: block;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(255, 215, 0, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ffd700, #ff69b4, #9370db);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    border-color: #ffd700;
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 15px 40px rgba(255, 215, 0, 0.3);

    &::after {
      opacity: 1;
    }
  }

  h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.25rem;
    color: #ffd700;
    font-weight: 600;
    position: relative;
    z-index: 2;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    font-size: 0.9rem;
    position: relative;
    z-index: 2;
  }
`

const InfoCard = styled.div`
  background: var(--slate-1);
  border: 1px solid var(--slate-4);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #a259ff;
    box-shadow: 0 0 24px rgba(162, 89, 255, 0.15);
    transform: translateY(-2px);
  }

  h3 {
    margin: 0 0 12px 0;
    font-size: 1.5rem;
    color: #a259ff;
  }

  p {
    margin: 0;
    color: #999;
    line-height: 1.6;
  }
`

export default function ExplorerIndex() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const { currentColorScheme } = useColorScheme()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      const trimmed = searchTerm.trim()
      
      // If it looks like a transaction signature (base58, ~88 chars)
      if (trimmed.length > 60) {
        window.location.href = `/explorer/transaction/${trimmed}`
      }
      // Otherwise assume it's a platform creator address
      else {
        window.location.href = `/explorer/platform/${trimmed}`
      }
    }
  }

  return (
    <UnifiedPageContainer $colorScheme={currentColorScheme}>
      <UnifiedPageTitle $colorScheme={currentColorScheme} style={{
        fontFamily: 'Luckiest Guy, cursive, sans-serif'
      }}>
        🔍 DegenCasino Explorer
      </UnifiedPageTitle>
      
      <UnifiedContent $colorScheme={currentColorScheme} style={{
        textAlign: 'center',
        marginBottom: '3rem',
        fontSize: '1.1rem',
        opacity: 0.9
      }}>
        Explore transactions, players, and platform statistics
      </UnifiedContent>

      <UnifiedSection $colorScheme={currentColorScheme}>
        <UnifiedGrid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          <QuickLinkCard to={`/explorer/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`} $colorScheme={currentColorScheme}>
            <h3>🏢 Platform Stats</h3>
            <p>View platform statistics, volume, and performance metrics</p>
          </QuickLinkCard>

          <QuickLinkCard to={`/explorer/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`} $colorScheme={currentColorScheme}>
            <h3>📊 Transaction Details</h3>
            <p>Deep dive into individual game transactions and verify fairness</p>
          </QuickLinkCard>

          <QuickLinkCard to={`/explorer/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`} $colorScheme={currentColorScheme}>
            <h3>🎯 Provably Fair Gaming</h3>
            <p>All games use cryptographic proofs to ensure complete fairness and transparency</p>
          </QuickLinkCard>

          <QuickLinkCard to={`/explorer/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`} $colorScheme={currentColorScheme}>
            <h3>⚡ Real-time Analytics</h3>
            <p>Live statistics tracking for players, platforms, and gaming outcomes</p>
          </QuickLinkCard>

          <QuickLinkCard to={`/explorer/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`} $colorScheme={currentColorScheme}>
            <h3>🔐 Blockchain Verified</h3>
            <p>Every transaction is recorded and verifiable on the Solana blockchain</p>
          </QuickLinkCard>

          <QuickLinkCard to={`/explorer/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`} $colorScheme={currentColorScheme}>
            <h3>📈 Performance Metrics</h3>
            <p>Comprehensive data on volume, fees, player activity, and platform growth</p>
          </QuickLinkCard>
        </UnifiedGrid>
      </UnifiedSection>
    </UnifiedPageContainer>
  )
}
