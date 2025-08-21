import React from 'react'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { PLATFORM_CREATOR_ADDRESS } from '../constants'
import { useIsCompact } from '../hooks/useIsCompact'

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

const QuickLinkCard = styled(Link)`
  background: var(--slate-1);
  border: 1px solid var(--slate-4);
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: block;

  &:hover {
    border-color: #ffd700;
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
    transform: translateY(-2px);
  }

  h3 {
    margin: 0 0 12px 0;
    font-size: 1.5rem;
    color: #ffd700;
  }

  p {
    margin: 0;
    color: #999;
    line-height: 1.6;
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
    <ExplorerContainer>
      <ExplorerHeader>
        <ExplorerTitle>🔍 DegenCasino Explorer</ExplorerTitle>
        <ExplorerSubtitle>
          Explore transactions, players, and platform statistics
        </ExplorerSubtitle>
      </ExplorerHeader>

      <QuickLinksGrid>
        <QuickLinkCard to={`/explorer/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`}>
          <h3>🏢 Platform Stats</h3>
          <p>View platform statistics, volume, and performance metrics</p>
        </QuickLinkCard>

        <QuickLinkCard to={`/explorer/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`}>
          <h3>📊 Transaction Details</h3>
          <p>Deep dive into individual game transactions and verify fairness</p>
        </QuickLinkCard>

        <QuickLinkCard to={`/explorer/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`}>
          <h3>🎯 Provably Fair Gaming</h3>
          <p>All games use cryptographic proofs to ensure complete fairness and transparency</p>
        </QuickLinkCard>

        <QuickLinkCard to={`/explorer/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`}>
          <h3>⚡ Real-time Analytics</h3>
          <p>Live statistics tracking for players, platforms, and gaming outcomes</p>
        </QuickLinkCard>

        <QuickLinkCard to={`/explorer/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`}>
          <h3>🔐 Blockchain Verified</h3>
          <p>Every transaction is recorded and verifiable on the Solana blockchain</p>
        </QuickLinkCard>

        <QuickLinkCard to={`/explorer/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`}>
          <h3>📈 Performance Metrics</h3>
          <p>Comprehensive data on volume, fees, player activity, and platform growth</p>
        </QuickLinkCard>
      </QuickLinksGrid>
    </ExplorerContainer>
  )
}
