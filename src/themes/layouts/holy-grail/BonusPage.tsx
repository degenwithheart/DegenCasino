// Holy Grail BonusPage.tsx - The Sacred Blessings Chamber
// Medieval monastery blessing chamber with divine reward scrolls

import React, { useState, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useColorScheme } from '../../../themes/ColorSchemeContext'

// Divine blessing animations
const divineGlow = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 25px rgba(212, 175, 55, 0.3),
      0 0 50px rgba(255, 255, 255, 0.2),
      inset 0 0 20px rgba(212, 175, 55, 0.1);
  }
  50% {
    box-shadow: 
      0 0 35px rgba(212, 175, 55, 0.5),
      0 0 70px rgba(255, 255, 255, 0.3),
      inset 0 0 30px rgba(212, 175, 55, 0.2);
  }
`

const holyShimmer = keyframes`
  0% {
    background-position: -300% center;
  }
  100% {
    background-position: 300% center;
  }
`

// Sacred blessing chamber parchment
const BlessingChamber = styled.div<{ visible: boolean }>`
  min-height: 100vh;
  background: 
    /* Monastery parchment */
    linear-gradient(45deg, 
      #f4f1e8 0%, 
      #f7f4eb 25%, 
      #f2efe6 50%, 
      #f5f2e9 75%, 
      #f3f0e7 100%
    ),
    /* Divine light rays */
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 8%),
    radial-gradient(circle at 70% 80%, rgba(212, 175, 55, 0.08) 0%, transparent 6%),
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 4%);
    
  /* Sacred texture patterns */
  background-image: 
    /* Cross patterns */
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 20px,
      rgba(212, 175, 55, 0.02) 20px,
      rgba(212, 175, 55, 0.02) 22px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 20px,
      rgba(212, 175, 55, 0.02) 20px,
      rgba(212, 175, 55, 0.02) 22px
    );
    
  padding: 4rem 2rem;
  position: relative;
  overflow-x: hidden;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 2s ease-in-out;
  
  /* Divine light from above */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 20%;
    width: 60%;
    height: 40%;
    background: 
      radial-gradient(ellipse at center top, 
        rgba(255, 255, 255, 0.08) 0%,
        rgba(212, 175, 55, 0.04) 40%,
        transparent 70%
      );
    pointer-events: none;
    z-index: 0;
    animation: ${divineGlow} 5s ease-in-out infinite;
  }
`

// Sacred blessing scroll
const BlessingScroll = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  /* Medieval blessing scroll */
  background: 
    linear-gradient(135deg, 
      #faf8f0 0%, 
      #f6f3ea 30%, 
      #f4f1e8 70%, 
      #f2efe6 100%
    );
  
  border: none;
  border-radius: 0;
  
  /* Sacred scroll shadow */
  box-shadow: 
    inset 0 0 40px rgba(212, 175, 55, 0.2),
    inset 0 0 80px rgba(255, 255, 255, 0.3),
    0 15px 50px rgba(139, 69, 19, 0.3),
    0 30px 80px rgba(101, 67, 33, 0.2);
  
  transform: perspective(1000px) rotateX(1deg);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Blessed scroll rods */
  &::before {
    content: '';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 85%;
    height: 12px;
    background: 
      linear-gradient(90deg, 
        #8b4513 0%, 
        #d4af37 25%, 
        #fff 50%, 
        #d4af37 75%, 
        #8b4513 100%
      );
    border-radius: 6px;
    box-shadow: 0 3px 6px rgba(139, 69, 19, 0.4);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 85%;
    height: 12px;
    background: 
      linear-gradient(90deg, 
        #8b4513 0%, 
        #d4af37 25%, 
        #fff 50%, 
        #d4af37 75%, 
        #8b4513 100%
      );
    border-radius: 6px;
    box-shadow: 0 -3px 6px rgba(139, 69, 19, 0.4);
  }
`

// Divine manuscript page
const BlessingPage = styled.div`
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

// Sacred blessing title
const BlessingTitle = styled.h1`
  font-family: 'Uncial Antiqua', 'Luminari', serif;
  font-size: 4rem;
  color: #8b4513;
  text-align: center;
  margin: 0 0 2rem 0;
  font-weight: 400;
  letter-spacing: 2px;
  line-height: 1.2;
  position: relative;
  
  /* Divine blessing calligraphy */
  text-shadow: 
    2px 2px 0px #d4af37,
    3px 3px 6px rgba(139, 69, 19, 0.4),
    0 0 15px rgba(255, 255, 255, 0.3);
  
  /* Sacred blessing symbol */
  &::before {
    content: '✨';
    font-size: 2.5rem;
    display: block;
    margin: 0 auto 1rem auto;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
    animation: ${holyShimmer} 3s ease-in-out infinite;
  }
  
  /* Illuminated first letter */
  &::first-letter {
    font-size: 5.5rem;
    color: #d4af37;
    font-weight: 700;
    line-height: 1;
    margin-right: 6px;
    float: left;
    
    /* Sacred drop cap glow */
    text-shadow: 
      3px 3px 0px #8b4513,
      5px 5px 10px rgba(212, 175, 55, 0.6),
      0 0 20px rgba(255, 255, 255, 0.4);
  }
  
  @media (max-width: 768px) {
    font-size: 3rem;
    
    &::before {
      font-size: 2rem;
    }
    
    &::first-letter {
      font-size: 4rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
    
    &::before {
      font-size: 1.8rem;
    }
    
    &::first-letter {
      font-size: 3.2rem;
    }
  }
`

// Sacred blessing description
const BlessingDescription = styled.div`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1.3rem;
  color: #654321;
  text-align: center;
  line-height: 1.8;
  margin: 3rem auto;
  max-width: 700px;
  
  /* Sacred manuscript styling */
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  
  /* Divine quotation marks */
  &::before {
    content: '☩';
    font-size: 2rem;
    color: #d4af37;
    display: block;
    margin: 0 auto 1rem auto;
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`

// Blessing altar grid
const BlessingAltar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`

// Sacred blessing shrine
const BlessingShrine = styled.div`
  /* Sacred shrine panel */
  background: 
    radial-gradient(ellipse at center, #faf5e4 0%, #f4e4bc 60%, #ddd2aa 100%);
  
  border: 3px solid #8b4513;
  border-radius: 0;
  padding: 2.5rem 2rem;
  text-align: center;
  
  /* Divine blessing shadow */
  box-shadow: 
    inset 0 0 30px rgba(212, 175, 55, 0.3),
    inset 0 0 60px rgba(255, 255, 255, 0.15),
    0 10px 40px rgba(139, 69, 19, 0.4),
    0 20px 60px rgba(101, 67, 33, 0.3);
  
  position: relative;
  overflow: hidden;
  
  /* Sacred corner blessings */
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    width: 20px;
    height: 20px;
    background: 
      radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    background: 
      radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
    border-radius: 50%;
  }
  
  .blessing-icon {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
    animation: ${divineGlow} 4s ease-in-out infinite;
  }
  
  h3 {
    font-family: 'Uncial Antiqua', serif;
    font-size: 1.6rem;
    color: #8b4513;
    margin: 0 0 1rem 0;
    font-weight: 400;
    
    /* Sacred title glow */
    text-shadow: 
      1px 1px 0px #d4af37,
      2px 2px 4px rgba(139, 69, 19, 0.4);
  }
  
  .blessing-value {
    font-family: 'Cinzel Decorative', serif;
    font-size: 2.5rem;
    font-weight: 700;
    color: #d4af37;
    margin: 1rem 0;
    
    /* Divine value glow */
    text-shadow: 
      2px 2px 0px #8b4513,
      3px 3px 8px rgba(212, 175, 55, 0.6),
      0 0 15px rgba(255, 255, 255, 0.3);
  }
  
  .blessing-description {
    font-family: 'Uncial Antiqua', serif;
    font-size: 1rem;
    color: #654321;
    line-height: 1.6;
    font-style: italic;
  }
  
  /* Sacred blessing hover */
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    transform: translateY(-6px) rotateX(3deg);
    
    box-shadow: 
      inset 0 0 40px rgba(212, 175, 55, 0.4),
      inset 0 0 80px rgba(255, 255, 255, 0.2),
      0 15px 60px rgba(139, 69, 19, 0.5),
      0 30px 90px rgba(101, 67, 33, 0.4);
    
    border-color: #d4af37;
    
    .blessing-value {
      color: #fff;
      text-shadow: 
        2px 2px 0px #8b4513,
        4px 4px 12px rgba(255, 255, 255, 0.8),
        0 0 25px rgba(255, 255, 255, 0.6);
    }
    
    .blessing-icon {
      transform: scale(1.1);
      filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
    }
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    
    .blessing-icon {
      font-size: 3rem;
    }
    
    h3 {
      font-size: 1.4rem;
    }
    
    .blessing-value {
      font-size: 2rem;
    }
  }
`

// Main component
const HolyGrailBonusPage: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <BlessingChamber visible={visible}>
      <BlessingScroll>
        <BlessingPage>
          <BlessingTitle>Divine Blessings</BlessingTitle>
          
          <BlessingDescription>
            Within these sacred halls, the faithful are rewarded with divine blessings 
            from the heavenly treasury. Each blessing carries the power to transform 
            your quest into legend.
          </BlessingDescription>
          
          <BlessingAltar>
            <BlessingShrine>
              <div className="blessing-icon">🙏</div>
              <h3>Daily Prayer</h3>
              <div className="blessing-value">50 SOL</div>
              <div className="blessing-description">
                A sacred blessing bestowed upon those who commune with the divine 
                each dawn.
              </div>
            </BlessingShrine>
            
            <BlessingShrine>
              <div className="blessing-icon">🕊️</div>
              <h3>Dove's Grace</h3>
              <div className="blessing-value">100 SOL</div>
              <div className="blessing-description">
                The gentle touch of the holy spirit, granting peace and prosperity 
                to the worthy.
              </div>
            </BlessingShrine>
            
            <BlessingShrine>
              <div className="blessing-icon">⛪</div>
              <h3>Cathedral's Gift</h3>
              <div className="blessing-value">200 SOL</div>
              <div className="blessing-description">
                A magnificent offering from the grand cathedral's sacred coffers, 
                reserved for the devout.
              </div>
            </BlessingShrine>
            
            <BlessingShrine>
              <div className="blessing-icon">👼</div>
              <h3>Angel's Touch</h3>
              <div className="blessing-value">500 SOL</div>
              <div className="blessing-description">
                The most precious blessing, touched by celestial beings and infused 
                with divine power.
              </div>
            </BlessingShrine>
          </BlessingAltar>
        </BlessingPage>
      </BlessingScroll>
    </BlessingChamber>
  )
}

export default HolyGrailBonusPage