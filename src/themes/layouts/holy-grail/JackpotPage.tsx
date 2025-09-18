// Holy Grail JackpotPage.tsx - The Sacred Treasury of Golden Fortunes
// Medieval royal treasury design with heraldic elements

import React, { useState, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useColorScheme } from '../../../themes/ColorSchemeContext'

// Medieval treasure vault animations
const treasureGleam = keyframes`
  0% {
    background-position: -200% center;
    filter: brightness(1);
  }
  50% {
    background-position: 200% center;
    filter: brightness(1.3);
  }
  100% {
    background-position: -200% center;
    filter: brightness(1);
  }
`

const royalPulse = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 30px rgba(212, 175, 55, 0.4),
      0 0 60px rgba(255, 215, 0, 0.2),
      inset 0 0 20px rgba(212, 175, 55, 0.1);
  }
  50% {
    box-shadow: 
      0 0 40px rgba(212, 175, 55, 0.6),
      0 0 80px rgba(255, 215, 0, 0.3),
      inset 0 0 30px rgba(212, 175, 55, 0.2);
  }
`

// Sacred treasury parchment container
const TreasuryContainer = styled.div<{ visible: boolean }>`
  min-height: 100vh;
  background: 
    /* Royal treasury parchment */
    linear-gradient(45deg, 
      #f4f1e8 0%, 
      #f7f4eb 25%, 
      #f2efe6 50%, 
      #f5f2e9 75%, 
      #f3f0e7 100%
    ),
    /* Gold dust and treasure spots */
    radial-gradient(circle at 15% 25%, rgba(212, 175, 55, 0.12) 0%, transparent 4%),
    radial-gradient(circle at 85% 75%, rgba(255, 215, 0, 0.08) 0%, transparent 5%),
    radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.06) 0%, transparent 3%),
    radial-gradient(circle at 25% 75%, rgba(255, 215, 0, 0.04) 0%, transparent 2%);
    
  /* Royal treasury texture */
  background-image: 
    /* Golden thread patterns */
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 3px,
      rgba(212, 175, 55, 0.03) 3px,
      rgba(212, 175, 55, 0.03) 6px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 3px,
      rgba(255, 215, 0, 0.02) 3px,
      rgba(255, 215, 0, 0.02) 6px
    );
    
  padding: 4rem 2rem;
  position: relative;
  overflow-x: hidden;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 2s ease-in-out;
  
  /* Royal treasury borders */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      /* Golden borders */
      linear-gradient(0deg, 
        rgba(212, 175, 55, 0.15) 0%,
        transparent 3%
      ),
      linear-gradient(180deg, 
        rgba(212, 175, 55, 0.15) 0%,
        transparent 3%
      ),
      linear-gradient(90deg, 
        rgba(212, 175, 55, 0.12) 0%,
        transparent 2%
      ),
      linear-gradient(270deg, 
        rgba(212, 175, 55, 0.12) 0%,
        transparent 2%
      );
    pointer-events: none;
    z-index: 1;
  }
  
  /* Treasure vault candlelight glow */
  &::after {
    content: '';
    position: fixed;
    top: 20%;
    left: 10%;
    width: 80%;
    height: 60%;
    background: 
      radial-gradient(ellipse at center, 
        rgba(255, 215, 0, 0.03) 0%,
        rgba(212, 175, 55, 0.02) 40%,
        transparent 70%
      );
    pointer-events: none;
    z-index: 0;
    animation: ${royalPulse} 4s ease-in-out infinite;
  }
`

// Royal treasury scroll wrapper
const TreasuryScroll = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  /* Medieval scroll appearance */
  background: 
    /* Main parchment */
    linear-gradient(135deg, 
      #faf8f0 0%, 
      #f6f3ea 30%, 
      #f4f1e8 70%, 
      #f2efe6 100%
    );
  
  border: none;
  border-radius: 0; /* Medieval sharp corners */
  
  /* Authentic scroll shadow */
  box-shadow: 
    /* Inner manuscript glow */
    inset 0 0 50px rgba(212, 175, 55, 0.2),
    inset 0 0 100px rgba(255, 255, 255, 0.3),
    /* Outer treasury shadow */
    0 20px 60px rgba(139, 69, 19, 0.3),
    0 40px 100px rgba(101, 67, 33, 0.2);
  
  /* Medieval manuscript transform */
  transform: perspective(1000px) rotateX(2deg);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Treasury scroll rods */
  &::before {
    content: '';
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 15px;
    background: 
      linear-gradient(90deg, 
        #8b4513 0%, 
        #d4af37 20%, 
        #8b4513 40%, 
        #d4af37 60%, 
        #8b4513 80%, 
        #d4af37 100%
      );
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(139, 69, 19, 0.4);
    z-index: 3;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 15px;
    background: 
      linear-gradient(90deg, 
        #8b4513 0%, 
        #d4af37 20%, 
        #8b4513 40%, 
        #d4af37 60%, 
        #8b4513 80%, 
        #d4af37 100%
      );
    border-radius: 8px;
    box-shadow: 0 -4px 8px rgba(139, 69, 19, 0.4);
    z-index: 3;
  }
`

// Medieval manuscript page
const TreasuryPage = styled.div`
  padding: 6rem 4rem;
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

// Illuminated royal title
const RoyalTitle = styled.h1`
  font-family: 'Uncial Antiqua', 'Luminari', serif;
  font-size: 4.5rem;
  color: #8b4513;
  text-align: center;
  margin: 0 0 2rem 0;
  font-weight: 400;
  letter-spacing: 3px;
  line-height: 1.2;
  position: relative;
  
  /* Medieval royal calligraphy */
  text-shadow: 
    2px 2px 0px #d4af37,
    4px 4px 8px rgba(139, 69, 19, 0.4),
    0 0 20px rgba(212, 175, 55, 0.3);
  
  /* Royal crown ornament */
  &::before {
    content: '👑';
    font-size: 3rem;
    display: block;
    margin: 0 auto 1rem auto;
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6));
    animation: ${treasureGleam} 3s ease-in-out infinite;
  }
  
  /* Ornate first letter */
  &::first-letter {
    font-size: 6rem;
    color: #d4af37;
    font-weight: 700;
    line-height: 1;
    margin-right: 8px;
    float: left;
    
    /* Royal drop cap shadow */
    text-shadow: 
      3px 3px 0px #8b4513,
      6px 6px 12px rgba(212, 175, 55, 0.6),
      0 0 25px rgba(255, 215, 0, 0.4);
  }
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
    
    &::before {
      font-size: 2.5rem;
    }
    
    &::first-letter {
      font-size: 4.5rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 2.8rem;
    
    &::before {
      font-size: 2rem;
    }
    
    &::first-letter {
      font-size: 3.5rem;
    }
  }
`

// Royal treasure description
const TreasuryDescription = styled.div`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1.4rem;
  color: #654321;
  text-align: center;
  line-height: 1.8;
  margin: 3rem auto;
  max-width: 800px;
  
  /* Medieval manuscript styling */
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  
  /* Ornate quotation marks */
  &::before {
    content: '❝';
    font-size: 3rem;
    color: #d4af37;
    vertical-align: top;
    line-height: 1;
    margin-right: 0.5rem;
  }
  
  &::after {
    content: '❞';
    font-size: 3rem;
    color: #d4af37;
    vertical-align: bottom;
    line-height: 1;
    margin-left: 0.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    
    &::before,
    &::after {
      font-size: 2.5rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    
    &::before,
    &::after {
      font-size: 2rem;
    }
  }
`

// Treasure vault panels
const TreasureVault = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`

// Individual treasure chest
const TreasureChest = styled.div`
  /* Medieval treasure chest panel */
  background: 
    /* Aged gold chest */
    radial-gradient(ellipse at center, #faf5e4 0%, #f4e4bc 60%, #ddd2aa 100%);
  
  border: 4px solid #8b4513;
  border-radius: 0; /* Medieval sharp corners */
  padding: 3rem 2rem;
  text-align: center;
  
  /* Royal treasure shadow */
  box-shadow: 
    /* Inner gold illumination */
    inset 0 0 40px rgba(212, 175, 55, 0.3),
    inset 0 0 80px rgba(255, 255, 255, 0.15),
    /* Outer treasure shadow */
    0 15px 50px rgba(139, 69, 19, 0.4),
    0 30px 80px rgba(101, 67, 33, 0.3);
  
  position: relative;
  overflow: hidden;
  
  /* Treasure chest decorations */
  &::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    width: 30px;
    height: 30px;
    background: 
      radial-gradient(circle, #d4af37 0%, transparent 70%);
    border-radius: 50%;
    opacity: 0.7;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 15px;
    right: 15px;
    width: 30px;
    height: 30px;
    background: 
      radial-gradient(circle, #d4af37 0%, transparent 70%);
    border-radius: 50%;
    opacity: 0.7;
  }
  
  .treasure-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.5));
    animation: ${treasureGleam} 4s ease-in-out infinite;
  }
  
  h3 {
    font-family: 'Uncial Antiqua', serif;
    font-size: 2rem;
    color: #8b4513;
    margin: 0 0 1rem 0;
    font-weight: 400;
    
    /* Royal title shadow */
    text-shadow: 
      2px 2px 0px #d4af37,
      3px 3px 6px rgba(139, 69, 19, 0.4);
  }
  
  .treasure-amount {
    font-family: 'Cinzel Decorative', serif;
    font-size: 3rem;
    font-weight: 700;
    color: #d4af37;
    margin: 1rem 0;
    
    /* Golden treasure glow */
    text-shadow: 
      3px 3px 0px #8b4513,
      4px 4px 10px rgba(212, 175, 55, 0.6),
      0 0 20px rgba(255, 215, 0, 0.4);
    
    filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.5));
  }
  
  .treasure-description {
    font-family: 'Uncial Antiqua', serif;
    font-size: 1.1rem;
    color: #654321;
    line-height: 1.6;
    font-style: italic;
  }
  
  /* Treasure chest hover effect */
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    transform: translateY(-8px) rotateX(5deg);
    
    box-shadow: 
      inset 0 0 60px rgba(212, 175, 55, 0.4),
      inset 0 0 120px rgba(255, 255, 255, 0.2),
      0 25px 80px rgba(139, 69, 19, 0.5),
      0 50px 120px rgba(101, 67, 33, 0.4);
    
    border-color: #d4af37;
    
    .treasure-amount {
      color: #ffd700;
      text-shadow: 
        3px 3px 0px #8b4513,
        5px 5px 15px rgba(255, 215, 0, 0.8),
        0 0 30px rgba(255, 215, 0, 0.6);
    }
    
    .treasure-icon {
      transform: scale(1.1);
      filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.8));
    }
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    
    .treasure-icon {
      font-size: 3rem;
    }
    
    h3 {
      font-size: 1.6rem;
    }
    
    .treasure-amount {
      font-size: 2.2rem;
    }
    
    .treasure-description {
      font-size: 1rem;
    }
  }
`

// Main component
const HolyGrailJackpotPage: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <TreasuryContainer visible={visible}>
      <TreasuryScroll>
        <TreasuryPage>
          <RoyalTitle>Sacred Treasury</RoyalTitle>
          
          <TreasuryDescription>
            Behold the legendary treasures of the Holy Grail Casino, where knights of fortune 
            gather to claim their rightful riches from the sacred vaults of destiny.
          </TreasuryDescription>
          
          <TreasureVault>
            <TreasureChest>
              <div className="treasure-icon">🏆</div>
              <h3>Royal Jackpot</h3>
              <div className="treasure-amount">1,000 SOL</div>
              <div className="treasure-description">
                The crown jewel of our treasury, awaiting the chosen knight who proves worthy 
                of this legendary prize.
              </div>
            </TreasureChest>
            
            <TreasureChest>
              <div className="treasure-icon">💎</div>
              <h3>Diamond Vault</h3>
              <div className="treasure-amount">500 SOL</div>
              <div className="treasure-description">
                Precious gems from the far reaches of the realm, collected for the most 
                valiant warriors of chance.
              </div>
            </TreasureChest>
            
            <TreasureChest>
              <div className="treasure-icon">⚔️</div>
              <h3>Sword of Fortune</h3>
              <div className="treasure-amount">250 SOL</div>
              <div className="treasure-description">
                The mystical blade that cuts through uncertainty, granting its wielder 
                unimaginable wealth and glory.
              </div>
            </TreasureChest>
            
            <TreasureChest>
              <div className="treasure-icon">🏰</div>
              <h3>Castle Coffers</h3>
              <div className="treasure-amount">100 SOL</div>
              <div className="treasure-description">
                The accumulated wealth of noble houses, stored in the deepest vaults 
                of our medieval stronghold.
              </div>
            </TreasureChest>
          </TreasureVault>
        </TreasuryPage>
      </TreasuryScroll>
    </TreasuryContainer>
  )
}

export default HolyGrailJackpotPage