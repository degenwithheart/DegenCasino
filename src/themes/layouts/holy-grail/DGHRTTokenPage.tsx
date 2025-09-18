// Holy Grail DGHRTTokenPage.tsx - The Sacred Token Chronicle
// Medieval token documentation with heraldic emblems

import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useColorScheme } from '../../../themes/ColorSchemeContext'

// Sacred token animations
const runicGlow = keyframes`
  0%, 100% {
    text-shadow: 
      0 0 10px rgba(212, 175, 55, 0.4),
      0 0 20px rgba(255, 215, 0, 0.3),
      0 0 30px rgba(212, 175, 55, 0.2);
  }
  50% {
    text-shadow: 
      0 0 20px rgba(212, 175, 55, 0.6),
      0 0 40px rgba(255, 215, 0, 0.5),
      0 0 60px rgba(212, 175, 55, 0.4);
  }
`

const tokenFloat = keyframes`
  0%, 100% {
    transform: translateY(0) rotateZ(0deg);
  }
  33% {
    transform: translateY(-8px) rotateZ(2deg);
  }
  66% {
    transform: translateY(-4px) rotateZ(-1deg);
  }
`

const heraldicShine = keyframes`
  0% {
    background-position: -100% center;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    background-position: 100% center;
    opacity: 0;
  }
`

// Sacred token chronicle chamber
const TokenChronicle = styled.div<{ visible: boolean }>`
  min-height: 100vh;
  background: 
    /* Sacred chronicle parchment */
    linear-gradient(45deg, 
      #f4f1e8 0%, 
      #f7f4eb 25%, 
      #f2efe6 50%, 
      #f5f2e9 75%, 
      #f3f0e7 100%
    ),
    /* Heraldic token patterns */
    radial-gradient(circle at 30% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 5%),
    radial-gradient(circle at 70% 70%, rgba(139, 69, 19, 0.06) 0%, transparent 4%),
    radial-gradient(circle at 50% 10%, rgba(212, 175, 55, 0.04) 0%, transparent 3%);
    
  /* Noble token texture */
  background-image: 
    /* Runic pattern */
    repeating-linear-gradient(
      120deg,
      transparent,
      transparent 8px,
      rgba(212, 175, 55, 0.02) 8px,
      rgba(212, 175, 55, 0.02) 16px
    );
    
  padding: 4rem 2rem;
  position: relative;
  overflow-x: hidden;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 2s ease-in-out;
  
  /* Sacred token atmosphere */
  &::before {
    content: '';
    position: fixed;
    top: 5%;
    left: 10%;
    width: 80%;
    height: 90%;
    background: 
      radial-gradient(ellipse at center, 
        rgba(212, 175, 55, 0.06) 0%,
        rgba(139, 69, 19, 0.03) 50%,
        transparent 80%
      );
    pointer-events: none;
    z-index: 1;
    animation: ${runicGlow} 7s ease-in-out infinite;
  }
`

// Token manuscript scroll
const TokenScroll = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  /* Sacred token scroll */
  background: 
    linear-gradient(135deg, 
      #faf8f0 0%, 
      #f6f3ea 30%, 
      #f4f1e8 70%, 
      #f2efe6 100%
    );
  
  border: 4px solid #8b4513;
  border-radius: 0;
  
  /* Token chronicle shadow */
  box-shadow: 
    inset 0 0 40px rgba(212, 175, 55, 0.2),
    inset 0 0 80px rgba(255, 255, 255, 0.3),
    0 15px 60px rgba(139, 69, 19, 0.4),
    0 30px 100px rgba(101, 67, 33, 0.3);
  
  transform: perspective(1000px) rotateX(1deg);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Sacred scroll rods */
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

// Token chronicle page
const ChronicePage = styled.div`
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

// Sacred token title
const TokenTitle = styled.h1`
  font-family: 'Uncial Antiqua', 'Luminari', serif;
  font-size: 4.5rem;
  color: #8b4513;
  text-align: center;
  margin: 0 0 2rem 0;
  font-weight: 400;
  letter-spacing: 3px;
  line-height: 1.2;
  position: relative;
  
  /* Sacred token calligraphy */
  text-shadow: 
    2px 2px 0px #d4af37,
    4px 4px 8px rgba(139, 69, 19, 0.4),
    0 0 20px rgba(212, 175, 55, 0.3);
  
  /* Sacred token symbol */
  &::before {
    content: '⚜️';
    font-size: 3.5rem;
    display: block;
    margin: 0 auto 1rem auto;
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
    animation: ${tokenFloat} 5s ease-in-out infinite;
  }
  
  /* Illuminated first letter */
  &::first-letter {
    font-size: 6rem;
    color: #d4af37;
    font-weight: 700;
    line-height: 1;
    margin-right: 8px;
    float: left;
    
    /* Sacred drop cap */
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

// Token description
const TokenDescription = styled.div`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1.3rem;
  color: #654321;
  text-align: center;
  line-height: 1.8;
  margin: 3rem auto 4rem auto;
  max-width: 800px;
  
  /* Noble manuscript styling */
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`

// Token sections grid
const TokenSections = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`

// Token section
const TokenSection = styled.div`
  background: 
    linear-gradient(135deg, 
      rgba(250, 248, 240, 0.8) 0%, 
      rgba(246, 243, 234, 0.9) 100%
    );
  border: 3px solid #8b4513;
  border-radius: 0;
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
  
  /* Heraldic section effects */
  box-shadow: 
    0 10px 40px rgba(139, 69, 19, 0.3),
    0 20px 60px rgba(101, 67, 33, 0.2),
    inset 0 0 30px rgba(212, 175, 55, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: 
      linear-gradient(90deg, 
        transparent 0%,
        rgba(212, 175, 55, 0.1) 50%,
        transparent 100%
      );
    animation: ${heraldicShine} 6s ease-in-out infinite;
  }
`

// Section title
const SectionTitle = styled.h2`
  font-family: 'Uncial Antiqua', serif;
  font-size: 2rem;
  color: #8b4513;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
  text-align: center;
  
  /* Noble section styling */
  text-shadow: 
    1px 1px 0px #d4af37,
    2px 2px 4px rgba(139, 69, 19, 0.3);
  
  /* Section heraldic symbol */
  &::before {
    content: '🪙';
    font-size: 1.5rem;
    display: block;
    margin: 0 auto 0.5rem auto;
    filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.4));
  }
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`

// Section content
const SectionContent = styled.div`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1.1rem;
  color: #654321;
  line-height: 1.8;
  
  /* Noble manuscript styling */
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  
  ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
    
    li {
      margin: 0.8rem 0;
      position: relative;
      padding-left: 1.5rem;
      
      &::before {
        content: '⚔️';
        position: absolute;
        left: 0;
        font-size: 0.9rem;
        filter: drop-shadow(0 0 3px rgba(212, 175, 55, 0.3));
      }
    }
  }
  
  .highlight {
    color: #8b4513;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

// Token stats
const TokenStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
  }
`

// Stat card
const StatCard = styled.div`
  background: 
    linear-gradient(135deg, 
      rgba(212, 175, 55, 0.1) 0%, 
      rgba(139, 69, 19, 0.05) 100%
    );
  border: 2px solid #8b4513;
  border-radius: 0;
  padding: 2rem;
  text-align: center;
  
  /* Heraldic stat effects */
  box-shadow: 
    0 8px 32px rgba(139, 69, 19, 0.2),
    inset 0 0 20px rgba(212, 175, 55, 0.1);
  
  .stat-value {
    font-family: 'Uncial Antiqua', serif;
    font-size: 2rem;
    color: #8b4513;
    font-weight: 700;
    margin-bottom: 0.5rem;
    
    /* Noble stat styling */
    text-shadow: 
      1px 1px 0px #d4af37,
      2px 2px 4px rgba(139, 69, 19, 0.3);
  }
  
  .stat-label {
    font-family: 'Uncial Antiqua', serif;
    font-size: 1rem;
    color: #654321;
    
    /* Noble label styling */
    text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    
    .stat-value {
      font-size: 1.8rem;
    }
  }
`

// Main component
const HolyGrailDGHRTTokenPage: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <TokenChronicle visible={visible}>
      <TokenScroll>
        <ChronicePage>
          <TokenTitle>DGHRT Token Chronicle</TokenTitle>
          
          <TokenDescription>
            Behold the sacred DGHRT Token, forged in the fires of the blockchain realm 
            and blessed by the Holy Grail itself. This noble currency serves as the 
            foundation of our royal casino kingdom.
          </TokenDescription>
          
          <TokenStats>
            <StatCard>
              <div className="stat-value">1,000,000</div>
              <div className="stat-label">Total Supply</div>
            </StatCard>
            <StatCard>
              <div className="stat-value">$0.125</div>
              <div className="stat-label">Current Price</div>
            </StatCard>
            <StatCard>
              <div className="stat-value">750,000</div>
              <div className="stat-label">Circulating</div>
            </StatCard>
            <StatCard>
              <div className="stat-value">$125,000</div>
              <div className="stat-label">Market Cap</div>
            </StatCard>
          </TokenStats>
          
          <TokenSections>
            <TokenSection>
              <SectionTitle>Token Utility</SectionTitle>
              <SectionContent>
                <p>The <span className="highlight">DGHRT Token</span> serves multiple sacred purposes within our realm:</p>
                <ul>
                  <li>Gaming currency for all casino activities</li>
                  <li>Staking rewards for loyal knights</li>
                  <li>Governance voting rights in the council</li>
                  <li>Exclusive access to VIP chambers</li>
                  <li>Tournament entry and prize pools</li>
                </ul>
              </SectionContent>
            </TokenSection>
            
            <TokenSection>
              <SectionTitle>Tokenomics</SectionTitle>
              <SectionContent>
                <p>The sacred distribution of <span className="highlight">DGHRT Tokens</span>:</p>
                <ul>
                  <li>40% - Gaming rewards and incentives</li>
                  <li>25% - Community treasury and development</li>
                  <li>20% - Staking rewards and yield farming</li>
                  <li>10% - Team and advisors (vested)</li>
                  <li>5% - Marketing and partnerships</li>
                </ul>
              </SectionContent>
            </TokenSection>
            
            <TokenSection>
              <SectionTitle>Staking Benefits</SectionTitle>
              <SectionContent>
                <p>Noble knights who stake their <span className="highlight">DGHRT Tokens</span> receive:</p>
                <ul>
                  <li>12% annual percentage yield</li>
                  <li>Bonus multipliers on casino rewards</li>
                  <li>Priority access to new game releases</li>
                  <li>Reduced fees on all transactions</li>
                  <li>Exclusive airdrops and bonuses</li>
                </ul>
              </SectionContent>
            </TokenSection>
            
            <TokenSection>
              <SectionTitle>Roadmap</SectionTitle>
              <SectionContent>
                <p>The future path of the <span className="highlight">DGHRT Token</span>:</p>
                <ul>
                  <li>Q1: Enhanced staking mechanisms</li>
                  <li>Q2: Cross-chain bridge implementation</li>
                  <li>Q3: DAO governance launch</li>
                  <li>Q4: NFT marketplace integration</li>
                  <li>2025: Mobile app and global expansion</li>
                </ul>
              </SectionContent>
            </TokenSection>
          </TokenSections>
        </ChronicePage>
      </TokenScroll>
    </TokenChronicle>
  )
}

export default HolyGrailDGHRTTokenPage