// Holy Grail AboutMePage.tsx - The Creator's Chronicle
// Medieval biography with noble heraldic elements

import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useColorScheme } from '../../../themes/ColorSchemeContext'

// Noble creator animations
const nobleGlow = keyframes`
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

const heraldFloat = keyframes`
  0%, 100% {
    transform: translateY(0) rotateZ(0deg);
  }
  33% {
    transform: translateY(-6px) rotateZ(1deg);
  }
  66% {
    transform: translateY(-3px) rotateZ(-0.5deg);
  }
`

const quillWrite = keyframes`
  0% {
    transform: rotate(-5deg) translateX(-2px);
  }
  50% {
    transform: rotate(5deg) translateX(2px);
  }
  100% {
    transform: rotate(-5deg) translateX(-2px);
  }
`

// Creator's chronicle chamber
const CreatorChronicle = styled.div<{ visible: boolean }>`
  min-height: 100vh;
  background: 
    /* Noble chronicle parchment */
    linear-gradient(45deg, 
      #f4f1e8 0%, 
      #f7f4eb 25%, 
      #f2efe6 50%, 
      #f5f2e9 75%, 
      #f3f0e7 100%
    ),
    /* Heraldic creator patterns */
    radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.1) 0%, transparent 6%),
    radial-gradient(circle at 75% 75%, rgba(139, 69, 19, 0.08) 0%, transparent 5%),
    radial-gradient(circle at 50% 10%, rgba(212, 175, 55, 0.06) 0%, transparent 4%);
    
  /* Noble creator texture */
  background-image: 
    /* Manuscript pattern */
    repeating-linear-gradient(
      30deg,
      transparent,
      transparent 6px,
      rgba(212, 175, 55, 0.02) 6px,
      rgba(212, 175, 55, 0.02) 12px
    );
    
  padding: 4rem 2rem;
  position: relative;
  overflow-x: hidden;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 2s ease-in-out;
  
  /* Noble creator atmosphere */
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
        rgba(139, 69, 19, 0.04) 50%,
        transparent 80%
      );
    pointer-events: none;
    z-index: 1;
    animation: ${nobleGlow} 8s ease-in-out infinite;
  }
`

// Creator manuscript scroll
const CreatorScroll = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  /* Noble creator scroll */
  background: 
    linear-gradient(135deg, 
      #faf8f0 0%, 
      #f6f3ea 30%, 
      #f4f1e8 70%, 
      #f2efe6 100%
    );
  
  border: 4px solid #8b4513;
  border-radius: 0;
  
  /* Creator chronicle shadow */
  box-shadow: 
    inset 0 0 40px rgba(212, 175, 55, 0.2),
    inset 0 0 80px rgba(255, 255, 255, 0.3),
    0 15px 60px rgba(139, 69, 19, 0.4),
    0 30px 100px rgba(101, 67, 33, 0.3);
  
  transform: perspective(1000px) rotateX(1deg);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Noble scroll rods */
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

// Creator chronicle page
const BiographyPage = styled.div`
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

// Noble creator title
const CreatorTitle = styled.h1`
  font-family: 'Uncial Antiqua', 'Luminari', serif;
  font-size: 4.5rem;
  color: #8b4513;
  text-align: center;
  margin: 0 0 2rem 0;
  font-weight: 400;
  letter-spacing: 3px;
  line-height: 1.2;
  position: relative;
  
  /* Noble creator calligraphy */
  text-shadow: 
    2px 2px 0px #d4af37,
    4px 4px 8px rgba(139, 69, 19, 0.4),
    0 0 20px rgba(212, 175, 55, 0.3);
  
  /* Creator's quill symbol */
  &::before {
    content: '🪶';
    font-size: 3.5rem;
    display: block;
    margin: 0 auto 1rem auto;
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
    animation: ${quillWrite} 3s ease-in-out infinite;
  }
  
  /* Illuminated first letter */
  &::first-letter {
    font-size: 6rem;
    color: #d4af37;
    font-weight: 700;
    line-height: 1;
    margin-right: 8px;
    float: left;
    
    /* Noble drop cap */
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

// Creator portrait
const CreatorPortrait = styled.div`
  display: flex;
  justify-content: center;
  margin: 3rem 0;
`

const PortraitFrame = styled.div`
  width: 200px;
  height: 200px;
  border: 5px solid #8b4513;
  border-radius: 0;
  background: 
    linear-gradient(135deg, 
      rgba(212, 175, 55, 0.2) 0%, 
      rgba(139, 69, 19, 0.1) 100%
    );
  
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  
  /* Noble portrait effects */
  box-shadow: 
    0 10px 40px rgba(139, 69, 19, 0.4),
    0 20px 60px rgba(101, 67, 33, 0.3),
    inset 0 0 30px rgba(212, 175, 55, 0.2);
  
  animation: ${heraldFloat} 6s ease-in-out infinite;
  
  &::before {
    content: '👑';
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.5));
  }
  
  @media (max-width: 768px) {
    width: 160px;
    height: 160px;
    font-size: 3rem;
  }
  
  @media (max-width: 480px) {
    width: 140px;
    height: 140px;
    font-size: 2.5rem;
  }
`

// Biography sections
const BiographySections = styled.div`
  margin: 4rem 0;
`

// Biography section
const BiographySection = styled.div`
  background: 
    linear-gradient(135deg, 
      rgba(250, 248, 240, 0.8) 0%, 
      rgba(246, 243, 234, 0.9) 100%
    );
  border: 3px solid #8b4513;
  border-radius: 0;
  padding: 3rem;
  margin: 2.5rem 0;
  position: relative;
  overflow: hidden;
  
  /* Heraldic section effects */
  box-shadow: 
    0 10px 40px rgba(139, 69, 19, 0.3),
    0 20px 60px rgba(101, 67, 33, 0.2),
    inset 0 0 30px rgba(212, 175, 55, 0.1);
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`

// Section title
const SectionTitle = styled.h2`
  font-family: 'Uncial Antiqua', serif;
  font-size: 2.2rem;
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
    content: '⚔️';
    font-size: 1.5rem;
    display: block;
    margin: 0 auto 0.5rem auto;
    filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.4));
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`

// Section content
const SectionContent = styled.div`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1.2rem;
  color: #654321;
  line-height: 1.8;
  text-align: center;
  
  /* Noble manuscript styling */
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  
  p {
    margin: 1.5rem 0;
  }
  
  .highlight {
    color: #8b4513;
    font-weight: 600;
  }
  
  .quote {
    font-style: italic;
    color: #765432;
    position: relative;
    
    &::before {
      content: '"';
      font-size: 2rem;
      color: #d4af37;
      position: absolute;
      left: -1.5rem;
      top: -0.5rem;
    }
    
    &::after {
      content: '"';
      font-size: 2rem;
      color: #d4af37;
      position: absolute;
      right: -1.5rem;
      bottom: -1rem;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`

// Contact heraldry
const ContactHeraldry = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 3rem 0;
  flex-wrap: wrap;
`

const ContactShield = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: 
    linear-gradient(135deg, 
      rgba(212, 175, 55, 0.2) 0%, 
      rgba(139, 69, 19, 0.1) 100%
    );
  border: 3px solid #8b4513;
  border-radius: 0;
  font-size: 1.5rem;
  color: #8b4513;
  text-decoration: none;
  transition: all 0.3s ease;
  
  /* Noble shield effects */
  box-shadow: 
    0 5px 20px rgba(139, 69, 19, 0.3),
    inset 0 0 20px rgba(212, 175, 55, 0.1);
  
  &:hover {
    transform: translateY(-5px) scale(1.1);
    border-color: #d4af37;
    background: 
      linear-gradient(135deg, 
        rgba(212, 175, 55, 0.3) 0%, 
        rgba(139, 69, 19, 0.2) 100%
      );
    
    box-shadow: 
      0 10px 30px rgba(139, 69, 19, 0.4),
      inset 0 0 30px rgba(212, 175, 55, 0.2);
  }
  
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
  }
`

// Main component
const HolyGrailAboutMePage: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <CreatorChronicle visible={visible}>
      <CreatorScroll>
        <BiographyPage>
          <CreatorTitle>About the Creator</CreatorTitle>
          
          <CreatorPortrait>
            <PortraitFrame />
          </CreatorPortrait>
          
          <BiographySections>
            <BiographySection>
              <SectionTitle>The Noble Quest</SectionTitle>
              <SectionContent>
                <p>
                  Greetings, noble visitors to the realm of the Holy Grail Casino. I am <span className="highlight">DegenWithHeart</span>, 
                  the architect and guardian of this sacred gaming sanctuary. My quest began with a vision: 
                  to create a realm where fortune favors the bold and every wager carries the blessing of providence.
                </p>
                <p className="quote">
                  In the sacred union of blockchain technology and timeless gaming traditions, 
                  we forge a new path toward digital nobility.
                </p>
              </SectionContent>
            </BiographySection>
            
            <BiographySection>
              <SectionTitle>The Sacred Mission</SectionTitle>
              <SectionContent>
                <p>
                  Through years of dedication to the craft of <span className="highlight">decentralized gaming</span>, 
                  I have witnessed the transformation of traditional casinos into transparent, 
                  provably fair sanctuaries of chance. The Holy Grail Casino represents the culmination 
                  of this noble pursuit.
                </p>
                <p>
                  Our sacred mission extends beyond mere entertainment - we seek to establish a 
                  <span className="highlight">trustworthy haven</span> where knights and nobles can test their 
                  fortune with complete confidence in the fairness of every roll, spin, and draw.
                </p>
              </SectionContent>
            </BiographySection>
            
            <BiographySection>
              <SectionTitle>The Royal Philosophy</SectionTitle>
              <SectionContent>
                <p>
                  In this digital age, I believe that <span className="highlight">transparency and fairness</span> 
                  should be the cornerstones of any gaming experience. Every algorithm, every random number, 
                  every outcome in our realm is verifiable through the sacred ledger of the blockchain.
                </p>
                <p>
                  The Holy Grail Casino is not merely a destination - it is a <span className="highlight">testament 
                  to the power of community</span>, where every player contributes to the greater glory of our 
                  shared realm and partakes in its prosperous future.
                </p>
              </SectionContent>
            </BiographySection>
          </BiographySections>
          
          <ContactHeraldry>
            <ContactShield href="https://twitter.com" target="_blank" title="Royal Twitter">🐦</ContactShield>
            <ContactShield href="https://github.com" target="_blank" title="Code Repository">⚒️</ContactShield>
            <ContactShield href="https://discord.com" target="_blank" title="Royal Discord">💬</ContactShield>
            <ContactShield href="mailto:contact@holygrailcasino.com" title="Royal Correspondence">📧</ContactShield>
          </ContactHeraldry>
        </BiographyPage>
      </CreatorScroll>
    </CreatorChronicle>
  )
}

export default HolyGrailAboutMePage