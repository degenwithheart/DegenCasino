import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { PLATFORM_CREATOR_ADDRESS, EXPLORER_URL } from '../constants'

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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
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

const SearchSection = styled.div`
  background: var(--slate-1);
  border: 1px solid var(--slate-4);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
`

const SearchInput = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 16px 20px;
  font-size: 1.1rem;
  border: 1px solid var(--slate-4);
  border-radius: 8px;
  background: var(--slate-2);
  color: #fff;
  margin-bottom: 16px;

  &::placeholder {
    color: #666;
  }

  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
`

const SearchButton = styled.button`
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: bold;
  background: linear-gradient(90deg, #ffd700, #a259ff);
  color: #222;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 215, 0, 0.3);
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
          <p>View DegenCasino platform statistics, volume, and performance metrics</p>
        </QuickLinkCard>

        <QuickLinkCard to="/explorer/transaction/example">
          <h3>� Transaction Details</h3>
          <p>Deep dive into individual game transactions and verify fairness</p>
        </QuickLinkCard>

        <QuickLinkCard to={`${EXPLORER_URL}/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`}>
          <h3>� Gamba Explorer</h3>
          <p>View full transaction history and analytics on the official Gamba explorer</p>
        </QuickLinkCard>
      </QuickLinksGrid>

      <SearchSection>
        <h3 style={{ marginBottom: '24px', color: '#ffd700' }}>🔍 Search Explorer</h3>
        <form onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="Enter transaction signature or platform creator address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <br />
          <SearchButton type="submit">
            Search
          </SearchButton>
        </form>
        <p style={{ marginTop: '16px', color: '#666', fontSize: '0.9rem' }}>
          Search for transaction signatures or platform creator addresses. Players are accessed through transaction details.
        </p>
      </SearchSection>
    </ExplorerContainer>
  )
}
