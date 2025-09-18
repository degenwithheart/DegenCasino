// Holy Grail SelectTokenPage.tsx - The Sacred Treasury Vault
// Medieval coin selection chamber with heraldic currency symbols

import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useColorScheme } from '../../../themes/ColorSchemeContext'

// Sacred treasury animations
const treasuryGlow = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(212, 175, 55, 0.3),
      0 0 40px rgba(255, 215, 0, 0.2),
      inset 0 0 30px rgba(212, 175, 55, 0.1);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(212, 175, 55, 0.5),
      0 0 60px rgba(255, 215, 0, 0.4),
      inset 0 0 40px rgba(212, 175, 55, 0.2);
  }
`

const coinFloat = keyframes`
  0%, 100% {
    transform: translateY(0) rotateY(0deg);
  }
  25% {
    transform: translateY(-5px) rotateY(90deg);
  }
  50% {
    transform: translateY(0) rotateY(180deg);
  }
  75% {
    transform: translateY(-3px) rotateY(270deg);
  }
`

const heraldShimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`

// Sacred treasury chamber
const TreasuryVault = styled.div<{ visible: boolean }>`
  min-height: 100vh;
  background: 
    /* Sacred vault parchment */
    linear-gradient(45deg, 
      #f4f1e8 0%, 
      #f7f4eb 25%, 
      #f2efe6 50%, 
      #f5f2e9 75%, 
      #f3f0e7 100%
    ),
    /* Heraldic treasury patterns */
    radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.1) 0%, transparent 6%),
    radial-gradient(circle at 75% 75%, rgba(139, 69, 19, 0.08) 0%, transparent 5%),
    radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.06) 0%, transparent 4%);
    
  /* Noble vault texture */
  background-image: 
    /* Coin pattern */
    repeating-radial-gradient(
      circle at 20% 20%,
      transparent 0,
      transparent 15px,
      rgba(212, 175, 55, 0.02) 15px,
      rgba(212, 175, 55, 0.02) 20px
    );
    
  padding: 4rem 2rem;
  position: relative;
  overflow-x: hidden;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 2s ease-in-out;
  
  /* Sacred treasury atmosphere */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(ellipse at center, 
        rgba(212, 175, 55, 0.08) 0%,
        rgba(139, 69, 19, 0.04) 40%,
        transparent 70%
      );
    pointer-events: none;
    z-index: 1;
    animation: ${treasuryGlow} 6s ease-in-out infinite;
  }
`

// Treasury manuscript scroll
const TreasuryScroll = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  /* Sacred treasury scroll */
  background: 
    linear-gradient(135deg, 
      #faf8f0 0%, 
      #f6f3ea 30%, 
      #f4f1e8 70%, 
      #f2efe6 100%
    );
  
  border: 4px solid #8b4513;
  border-radius: 0;
  
  /* Treasury vault shadow */
  box-shadow: 
    inset 0 0 40px rgba(212, 175, 55, 0.2),
    inset 0 0 80px rgba(255, 255, 255, 0.3),
    0 15px 60px rgba(139, 69, 19, 0.4),
    0 30px 100px rgba(101, 67, 33, 0.3);
  
  transform: perspective(1000px) rotateX(1deg);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Treasury scroll rods */
  &::before, &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 10px;
    background: 
      linear-gradient(90deg, 
        #8b4513 0%, 
        #d4af37 50%, 
        #8b4513 100%
      );
    border-radius: 5px;
    box-shadow: 0 3px 6px rgba(139, 69, 19, 0.4);
  }
  
  &::before {
    top: -10px;
  }
  
  &::after {
    bottom: -10px;
    box-shadow: 0 -3px 6px rgba(139, 69, 19, 0.4);
  }
`

// Treasury chamber page
const VaultPage = styled.div`
  padding: 5rem 4rem;
  background: transparent;
  position: relative;
  z-index: 4;
  
  @media (max-width: 768px) {
    padding: 4rem 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 3rem 1.5rem;
  }
`

// Treasury vault title
const VaultTitle = styled.h1`
  font-family: 'Uncial Antiqua', 'Luminari', serif;
  font-size: 4.5rem;
  color: #8b4513;
  text-align: center;
  margin: 0 0 2rem 0;
  font-weight: 400;
  letter-spacing: 3px;
  line-height: 1.2;
  position: relative;
  
  /* Treasury vault calligraphy */
  text-shadow: 
    2px 2px 0px #d4af37,
    4px 4px 8px rgba(139, 69, 19, 0.4),
    0 0 20px rgba(212, 175, 55, 0.3);
  
  /* Sacred treasury symbol */
  &::before {
    content: '🏦';
    font-size: 3.5rem;
    display: block;
    margin: 0 auto 1rem auto;
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
    animation: ${coinFloat} 4s ease-in-out infinite;
  }
  
  /* Illuminated first letter */
  &::first-letter {
    font-size: 6rem;
    color: #d4af37;
    font-weight: 700;
    line-height: 1;
    margin-right: 8px;
    float: left;
    
    /* Treasury drop cap */
    text-shadow: 
      3px 3px 0px #8b4513,
      6px 6px 12px rgba(212, 175, 55, 0.6),
      0 0 25px rgba(255, 215, 0, 0.4);
  }
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
    
    &::before {
      font-size: 2.8rem;
    }
    
    &::first-letter {
      font-size: 4.5rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 2.8rem;
    
    &::before {
      font-size: 2.2rem;
    }
    
    &::first-letter {
      font-size: 3.5rem;
    }
  }
`

// Treasury description
const VaultDescription = styled.div`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1.3rem;
  color: #654321;
  text-align: center;
  line-height: 1.8;
  margin: 3rem auto;
  max-width: 700px;
  
  /* Noble manuscript styling */
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  
  /* Heraldic currency symbol */
  &::before {
    content: '💰';
    font-size: 2rem;
    display: block;
    margin: 0 auto 1rem auto;
    filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.5));
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`

// Currency grid
const CurrencyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

// Coin chest
const CoinChest = styled.div<{ selected?: boolean }>`
  background: 
    linear-gradient(135deg, 
      rgba(250, 248, 240, 0.9) 0%, 
      rgba(246, 243, 234, 0.95) 100%
    );
  border: 3px solid ${props => props.selected ? '#d4af37' : '#8b4513'};
  border-radius: 0;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  
  /* Heraldic chest effects */
  box-shadow: 
    0 8px 32px rgba(139, 69, 19, 0.3),
    0 16px 48px rgba(101, 67, 33, 0.2),
    ${props => props.selected ? 
      'inset 0 0 30px rgba(212, 175, 55, 0.3)' : 
      'inset 0 0 20px rgba(139, 69, 19, 0.1)'
    };
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: 
      linear-gradient(45deg, 
        transparent 0%, 
        rgba(212, 175, 55, 0.2) 50%, 
        transparent 100%
      );
    background-size: 200% 200%;
    animation: ${heraldShimmer} 3s linear infinite;
    opacity: ${props => props.selected ? 1 : 0};
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: #d4af37;
    
    box-shadow: 
      0 12px 48px rgba(139, 69, 19, 0.4),
      0 24px 64px rgba(101, 67, 33, 0.3),
      inset 0 0 30px rgba(212, 175, 55, 0.2);
  }
  
  &:active {
    transform: translateY(-4px) scale(0.98);
  }
`

// Coin symbol
const CoinSymbol = styled.div`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  
  /* Sacred coin glow */
  filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.4));
  animation: ${coinFloat} 6s ease-in-out infinite;
`

// Coin name
const CoinName = styled.h3`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1.5rem;
  color: #8b4513;
  text-align: center;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  
  /* Noble coin naming */
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.3);
`

// Coin details
const CoinDetails = styled.div`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1rem;
  color: #654321;
  text-align: center;
  line-height: 1.6;
  
  /* Noble manuscript styling */
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  
  .balance {
    font-weight: 600;
    color: #8b4513;
    margin-top: 0.5rem;
  }
`

// Search treasury
const TreasurySearch = styled.div`
  margin: 3rem 0;
  display: flex;
  justify-content: center;
`

const SearchInput = styled.input`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1.2rem;
  padding: 1rem 2rem;
  border: 3px solid #8b4513;
  border-radius: 0;
  background: rgba(250, 248, 240, 0.9);
  color: #654321;
  width: 100%;
  max-width: 400px;
  
  /* Noble search styling */
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  box-shadow: 
    inset 0 0 20px rgba(212, 175, 55, 0.1),
    0 5px 15px rgba(139, 69, 19, 0.2);
  
  &::placeholder {
    color: rgba(101, 67, 33, 0.6);
    font-family: 'Uncial Antiqua', serif;
  }
  
  &:focus {
    outline: none;
    border-color: #d4af37;
    box-shadow: 
      inset 0 0 20px rgba(212, 175, 55, 0.2),
      0 0 20px rgba(212, 175, 55, 0.3);
  }
`

// Main component with mock token data
const HolyGrailSelectTokenPage: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  // Mock token data
  const mockTokens = [
    { 
      symbol: 'SOL', 
      name: 'Solana Coin', 
      icon: '◎', 
      balance: '125.45 SOL',
      description: 'The noble coin of the Solana realm'
    },
    { 
      symbol: 'USDC', 
      name: 'USD Coin', 
      icon: '💵', 
      balance: '1,250.00 USDC',
      description: 'Stable currency of the kingdom'
    },
    { 
      symbol: 'USDT', 
      name: 'Tether USD', 
      icon: '💳', 
      balance: '890.75 USDT',
      description: 'Trusted currency of merchants'
    },
    { 
      symbol: 'BONK', 
      name: 'Bonk Token', 
      icon: '🐕', 
      balance: '1,000,000 BONK',
      description: 'The loyal hound of the realm'
    },
    { 
      symbol: 'WIF', 
      name: 'Dogwifhat', 
      icon: '🐶', 
      balance: '500.00 WIF',
      description: 'The noble canine with a hat'
    },
    { 
      symbol: 'JUP', 
      name: 'Jupiter', 
      icon: '🪐', 
      balance: '75.25 JUP',
      description: 'Celestial trading currency'
    }
  ]

  const filteredTokens = mockTokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTokenSelect = (symbol: string) => {
    setSelectedToken(symbol)
    // Here you would implement the actual token selection logic
    console.log(`Selected token: ${symbol}`)
  }

  return (
    <TreasuryVault visible={visible}>
      <TreasuryScroll>
        <VaultPage>
          <VaultTitle>Sacred Treasury</VaultTitle>
          
          <VaultDescription>
            Choose thy preferred currency from the sacred treasury of our realm. 
            Each coin bears the blessing of the Holy Grail and shall serve thee well 
            in thy noble quest for fortune.
          </VaultDescription>
          
          <TreasurySearch>
            <SearchInput
              type="text"
              placeholder="Search for thy chosen currency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </TreasurySearch>
          
          <CurrencyGrid>
            {filteredTokens.map((token) => (
              <CoinChest
                key={token.symbol}
                selected={selectedToken === token.symbol}
                onClick={() => handleTokenSelect(token.symbol)}
              >
                <CoinSymbol>{token.icon}</CoinSymbol>
                <CoinName>{token.name}</CoinName>
                <CoinDetails>
                  <div>{token.description}</div>
                  <div className="balance">{token.balance}</div>
                </CoinDetails>
              </CoinChest>
            ))}
          </CurrencyGrid>
          
          {filteredTokens.length === 0 && (
            <VaultDescription>
              No currencies found matching thy search. Try a different term, noble knight.
            </VaultDescription>
          )}
        </VaultPage>
      </TreasuryScroll>
    </TreasuryVault>
  )
}

export default HolyGrailSelectTokenPage