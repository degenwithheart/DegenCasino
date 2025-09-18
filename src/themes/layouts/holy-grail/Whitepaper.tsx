// Holy Grail Whitepaper.tsx - The Sacred Manuscript of Technical Prophecy
// Ancient codex design with alchemical diagrams and mystical architectural blueprints

import React, { useState, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useColorScheme } from '../../ColorSchemeContext'

const sections = ['Sacred Genesis', 'Alchemical Architecture', 'Divine Mechanics', 'Prophetic Roadmap']

// Ancient codex animations with mystical properties
const codexManifestation = keyframes`
  0% {
    opacity: 0;
    transform: perspective(1000px) rotateY(-90deg) scale(0.5);
    filter: sepia(100%) brightness(0.2) blur(2px);
  }
  25% {
    filter: sepia(90%) brightness(0.4) blur(1px);
  }
  50% {
    filter: sepia(70%) brightness(0.6) blur(0.5px);
  }
  75% {
    filter: sepia(60%) brightness(0.8);
  }
  100% {
    opacity: 1;
    transform: perspective(1000px) rotateY(0deg) scale(1);
    filter: sepia(40%) brightness(1);
  }
`

const alchemicalGlow = keyframes`
  0%, 100% {
    text-shadow: 
      0 0 20px rgba(255, 215, 0, 0.9),
      0 0 40px rgba(255, 215, 0, 0.7),
      0 0 60px rgba(184, 134, 11, 0.5),
      2px 2px 0px #8b4513;
    transform: scale(1);
  }
  50% {
    text-shadow: 
      0 0 30px rgba(255, 215, 0, 1),
      0 0 60px rgba(255, 215, 0, 0.9),
      0 0 90px rgba(184, 134, 11, 0.7),
      2px 2px 0px #8b4513;
    transform: scale(1.02);
  }
`

const mysticalLevitation = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    filter: drop-shadow(0 8px 20px rgba(139, 69, 19, 0.7));
  }
  25% { 
    transform: translateY(-15px) rotate(1deg);
    filter: drop-shadow(0 12px 30px rgba(139, 69, 19, 0.9));
  }
  50% { 
    transform: translateY(-10px) rotate(-0.5deg);
    filter: drop-shadow(0 10px 25px rgba(139, 69, 19, 0.8));
  }
  75% { 
    transform: translateY(-18px) rotate(0.8deg);
    filter: drop-shadow(0 14px 35px rgba(139, 69, 19, 1));
  }
`

const runicShimmer = keyframes`
  0% {
    background-position: -300% 0;
    opacity: 0.2;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    background-position: 300% 0;
    opacity: 0.2;
  }
`

const torchFlame = keyframes`
  0%, 100% { 
    opacity: 0.9;
    transform: scale(1) rotate(0deg);
  }
  25% { 
    opacity: 1;
    transform: scale(1.1) rotate(1deg);
  }
  50% { 
    opacity: 0.95;
    transform: scale(0.98) rotate(-0.5deg);
  }
  75% { 
    opacity: 1;
    transform: scale(1.05) rotate(0.8deg);
  }
`

// Ancient monastery scriptorium
const Scriptorium = styled.div<{ visible: boolean }>`
  min-height: 100vh;
  background: 
    radial-gradient(ellipse at center, #4a3325 0%, #3d2914 30%, #2a1810 60%, #1a0f08 90%),
    linear-gradient(135deg, #5d4037 0%, #4a3325 25%, #3d2914 50%, #2a1810 75%, #1a0f08 100%);
  background-attachment: fixed;
  padding: 3rem 2rem;
  position: relative;
  overflow: hidden;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 2s ease-in-out;
  
  /* Gothic cathedral stonework */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="gothic" patternUnits="userSpaceOnUse" width="30" height="30"><rect width="30" height="30" fill="%23654321" opacity="0.02"/><path d="M15,5 L25,15 L15,25 L5,15 Z" fill="%238b4513" opacity="0.04"/></pattern></defs><rect width="100" height="100" fill="url(%23gothic)"/></svg>'),
      radial-gradient(circle at 10% 20%, rgba(139, 69, 19, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 90% 80%, rgba(160, 82, 45, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  /* Multiple flickering torches */
  &::after {
    content: '';
    position: absolute;
    top: 5%;
    left: 3%;
    width: 140px;
    height: 280px;
    background: 
      radial-gradient(ellipse, rgba(255, 140, 0, 0.5) 0%, rgba(255, 69, 0, 0.3) 50%, transparent 80%);
    border-radius: 70% 70% 70% 70% / 90% 90% 10% 10%;
    animation: ${torchFlame} 3s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
    box-shadow: 
      150px 200px 80px rgba(255, 140, 0, 0.3),
      300px 100px 60px rgba(255, 69, 0, 0.2),
      450px 250px 70px rgba(255, 140, 0, 0.25);
  }
`

const CodexContainer = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  animation: ${codexManifestation} 2.5s ease-out;
`

// Illuminated manuscript title with gothic lettering
const GothicTitle = styled.h1`
  font-family: 'Cinzel Decorative', 'Luminari', 'Papyrus', serif;
  font-size: 5.5rem;
  font-weight: 900;
  text-align: center;
  margin: 0 0 2rem 0;
  color: #d4af37;
  position: relative;
  animation: ${alchemicalGlow} 5s ease-in-out infinite;
  letter-spacing: 3px;
  
  /* Ornate illuminated initial */
  &::first-letter {
    font-size: 8rem;
    float: left;
    line-height: 5rem;
    padding-right: 1rem;
    margin-top: 0.5rem;
    color: #b8860b;
    text-shadow: 
      3px 3px 0px #8b4513,
      6px 6px 12px rgba(139, 69, 19, 0.9),
      0 0 30px rgba(212, 175, 55, 0.8);
    background: linear-gradient(145deg, 
      rgba(212, 175, 55, 0.1),
      rgba(184, 134, 11, 0.05)
    );
    border-radius: 20px;
    padding: 0.2rem 0.5rem;
    border: 3px solid rgba(139, 69, 19, 0.3);
  }
  
  /* Gothic cathedral spires */
  &::before {
    content: '🏰';
    position: absolute;
    left: -5rem;
    top: 20%;
    font-size: 4rem;
    color: #8b4513;
    animation: ${mysticalLevitation} 6s ease-in-out infinite;
  }
  
  &::after {
    content: '🏰';
    position: absolute;
    right: -5rem;
    top: 20%;
    font-size: 4rem;
    color: #8b4513;
    animation: ${mysticalLevitation} 6s ease-in-out infinite reverse;
  }
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
    
    &::first-letter {
      font-size: 5rem;
      line-height: 3rem;
    }
    
    &::before, &::after {
      display: none;
    }
  }
`

const MonasticSubtitle = styled.p`
  font-family: 'Cinzel', 'Book Antiqua', serif;
  text-align: center;
  font-size: 1.8rem;
  color: #cdaa3d;
  margin: 0 0 4rem 0;
  font-style: italic;
  font-weight: 400;
  letter-spacing: 2px;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 3rem;
  }
`

// Sacred tome with brass clasps
const SacredTome = styled.div`
  background: 
    linear-gradient(145deg, 
      rgba(250, 248, 240, 0.98) 0%,
      rgba(255, 253, 245, 0.96) 15%,
      rgba(248, 243, 225, 0.98) 40%,
      rgba(245, 240, 210, 0.99) 70%,
      rgba(250, 248, 240, 1) 100%
    );
  border: 15px solid #8b4513;
  border-radius: 30px;
  padding: 4rem;
  margin: 3rem 0;
  position: relative;
  box-shadow: 
    0 0 0 5px #d4af37,
    0 0 0 10px #8b4513,
    0 0 0 12px #654321,
    0 35px 100px rgba(139, 69, 19, 0.6),
    inset 0 0 80px rgba(212, 175, 55, 0.2);
    
  /* Ornate brass clasps */
  &::before, &::after {
    content: '🔒';
    position: absolute;
    right: -30px;
    font-size: 3rem;
    background: 
      radial-gradient(circle, 
        #b8860b 0%,
        #8b4513 50%,
        #654321 100%
      );
    padding: 1rem;
    border-radius: 15px;
    border: 6px solid #654321;
    animation: ${mysticalLevitation} 5s ease-in-out infinite;
    box-shadow: 
      0 10px 30px rgba(139, 69, 19, 0.7),
      inset 0 0 25px rgba(184, 134, 11, 0.5);
  }
  
  &::before {
    top: 20%;
  }
  
  &::after {
    bottom: 20%;
    animation-delay: -2.5s;
  }
  
  /* Aged vellum texture */
  background-image: 
    radial-gradient(circle at 35% 35%, rgba(139, 69, 19, 0.06) 0%, transparent 70%),
    radial-gradient(circle at 65% 65%, rgba(160, 82, 45, 0.04) 0%, transparent 70%),
    linear-gradient(45deg, transparent 48%, rgba(139, 69, 19, 0.02) 50%, transparent 52%),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="vellum" patternUnits="userSpaceOnUse" width="15" height="15"><circle cx="7" cy="7" r="0.5" fill="%23654321" opacity="0.03"/></pattern></defs><rect width="100" height="100" fill="url(%23vellum)"/></svg>');
`

// Chapter selection with runic symbols
const ChapterSelection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
  padding: 3rem;
  background: 
    linear-gradient(135deg,
      rgba(139, 69, 19, 0.25) 0%,
      rgba(160, 82, 45, 0.2) 30%,
      rgba(139, 69, 19, 0.15) 70%,
      rgba(101, 67, 33, 0.25) 100%
    );
  border: 6px double #8b4513;
  border-radius: 25px;
  position: relative;
  
  /* Chapter selector header */
  &::before {
    content: '📜 SACRED CHAPTERS 📜';
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background: 
      linear-gradient(145deg, #f5f5dc 0%, #e6dcc3 50%, #d4c19a 100%);
    padding: 1rem 3rem;
    border: 5px solid #8b4513;
    border-radius: 25px;
    font-family: 'Cinzel', serif;
    font-size: 1.1rem;
    color: #8b4513;
    font-weight: 700;
    letter-spacing: 2px;
    box-shadow: 
      0 8px 25px rgba(139, 69, 19, 0.5),
      inset 0 0 20px rgba(212, 175, 55, 0.2);
  }
`

const RunicChapter = styled.button<{ active: boolean }>`
  font-family: 'Cinzel', serif;
  padding: 2rem 1.5rem;
  border: 5px solid ${props => props.active ? '#d4af37' : '#8b4513'};
  border-radius: 20px;
  background: ${props => props.active 
    ? 'linear-gradient(145deg, rgba(212, 175, 55, 0.4), rgba(184, 134, 11, 0.3))'
    : 'linear-gradient(145deg, rgba(139, 69, 19, 0.15), rgba(160, 82, 45, 0.1))'
  };
  color: ${props => props.active ? '#b8860b' : '#8b4513'};
  cursor: pointer;
  transition: all 0.5s ease;
  position: relative;
  overflow: hidden;
  text-align: center;
  
  &:hover {
    border-color: #d4af37;
    background: linear-gradient(145deg, rgba(212, 175, 55, 0.35), rgba(184, 134, 11, 0.25));
    transform: translateY(-8px);
    box-shadow: 
      0 15px 40px rgba(139, 69, 19, 0.5),
      inset 0 0 0 3px rgba(212, 175, 55, 0.4);
  }
  
  .runic-symbol {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    animation: ${props => props.active ? mysticalLevitation : 'none'} 4s ease-in-out infinite;
  }
  
  .chapter-title {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.8rem;
    letter-spacing: 1px;
  }
  
  .chapter-subtitle {
    font-size: 1rem;
    opacity: 0.85;
    font-style: italic;
    line-height: 1.4;
  }
  
  /* Mystical energy flow */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent,
      rgba(212, 175, 55, 0.3),
      transparent
    );
    transition: left 0.8s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`

// Illuminated content sections
const IlluminatedSection = styled.section`
  margin: 4rem 0;
  padding: 3.5rem;
  background: 
    linear-gradient(145deg,
      rgba(245, 245, 220, 0.5) 0%,
      rgba(255, 248, 220, 0.4) 30%,
      rgba(250, 240, 190, 0.5) 70%,
      rgba(245, 245, 220, 0.6) 100%
    );
  border: 4px solid rgba(139, 69, 19, 0.5);
  border-radius: 25px;
  position: relative;
  
  /* Illuminated manuscript border decoration */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -150%;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, 
      transparent,
      #d4af37,
      #b8860b,
      #d4af37,
      transparent
    );
    animation: ${runicShimmer} 4s ease-in-out infinite;
    border-radius: 25px 25px 0 0;
  }
  
  h2 {
    font-family: 'Cinzel Decorative', serif;
    font-size: 2.5rem;
    color: #8b4513;
    margin: 0 0 2rem 0;
    font-weight: 700;
    letter-spacing: 1.5px;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    
    .chapter-icon {
      color: #d4af37;
      font-size: 3rem;
      animation: ${mysticalLevitation} 3s ease-in-out infinite;
      filter: drop-shadow(3px 3px 8px rgba(139, 69, 19, 0.5));
    }
    
    @media (max-width: 768px) {
      font-size: 2rem;
      
      .chapter-icon {
        font-size: 2.5rem;
      }
    }
  }
  
  h3 {
    font-family: 'Cinzel', serif;
    font-size: 1.6rem;
    color: #654321;
    margin: 2.5rem 0 1.5rem 0;
    font-weight: 700;
    border-bottom: 3px solid rgba(139, 69, 19, 0.4);
    padding-bottom: 0.8rem;
    letter-spacing: 0.5px;
    
    &::before {
      content: '✦ ';
      color: #d4af37;
      margin-right: 0.5rem;
    }
  }
  
  p {
    color: #4a3325;
    line-height: 1.9;
    font-size: 1.15rem;
    margin: 0 0 2rem 0;
    text-align: justify;
    font-family: 'Crimson Text', 'Book Antiqua', serif;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &:first-of-type {
      font-size: 1.25rem;
      font-weight: 500;
      color: #654321;
    }
  }
  
  ul {
    padding-left: 3rem;
    margin: 2rem 0;
    
    li {
      margin: 1.2rem 0;
      color: #4a3325;
      line-height: 1.8;
      font-size: 1.1rem;
      position: relative;
      
      &::marker {
        color: #8b4513;
        font-weight: bold;
        font-size: 1.2em;
      }
      
      strong {
        color: #654321;
        font-weight: 700;
      }
    }
  }
  
  em {
    font-style: italic;
    color: #654321;
    font-weight: 500;
    background: rgba(212, 175, 55, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
  }
  
  strong {
    color: #8b4513;
    font-weight: 700;
  }
`

// Mystical feature showcase
const AlchemicalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  margin: 3rem 0;
`

const AlchemicalCard = styled.div`
  background: 
    linear-gradient(145deg,
      rgba(245, 245, 220, 0.7) 0%,
      rgba(255, 248, 220, 0.6) 50%,
      rgba(250, 240, 190, 0.7) 100%
    );
  border: 5px solid #8b4513;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  position: relative;
  transition: all 0.5s ease;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    border-color: #d4af37;
    box-shadow: 
      0 0 0 3px #d4af37,
      0 20px 50px rgba(139, 69, 19, 0.5);
  }
  
  /* Alchemical symbol border */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, 
      transparent,
      #d4af37,
      transparent
    );
    border-radius: 20px 20px 0 0;
  }
  
  .alchemical-icon {
    font-size: 3.5rem;
    color: #8b4513;
    margin-bottom: 1.5rem;
    filter: drop-shadow(3px 3px 8px rgba(139, 69, 19, 0.4));
    animation: ${mysticalLevitation} 4s ease-in-out infinite;
  }
  
  h4 {
    font-family: 'Cinzel', serif;
    font-size: 1.5rem;
    color: #654321;
    margin: 0 0 1rem 0;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  
  p {
    color: #4a3325;
    line-height: 1.7;
    font-size: 1.05rem;
    margin: 0;
    font-family: 'Crimson Text', serif;
  }
`

// Sacred seal and signatures
const MonasticSeal = styled.div`
  margin-top: 5rem;
  padding: 4rem;
  text-align: center;
  background: 
    radial-gradient(circle,
      rgba(139, 69, 19, 0.3) 0%,
      rgba(160, 82, 45, 0.25) 30%,
      rgba(139, 69, 19, 0.2) 60%,
      rgba(101, 67, 33, 0.3) 100%
    );
  border: 8px double #8b4513;
  border-radius: 30px;
  position: relative;
  
  /* Sacred seal */
  &::before {
    content: '🏺';
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 5rem;
    background: 
      radial-gradient(circle, #d4af37 0%, #b8860b 40%, #8b4513 100%);
    padding: 1.5rem;
    border-radius: 50%;
    border: 8px solid #654321;
    animation: ${alchemicalGlow} 4s ease-in-out infinite;
    box-shadow: 
      0 15px 40px rgba(139, 69, 19, 0.7),
      inset 0 0 30px rgba(212, 175, 55, 0.4);
  }
  
  .seal-text {
    font-family: 'Cinzel', serif;
    font-size: 1.5rem;
    color: #8b4513;
    font-style: italic;
    margin-bottom: 1.5rem;
    letter-spacing: 1.5px;
    line-height: 1.6;
  }
  
  .monastery-signature {
    font-family: 'Cinzel', serif;
    font-size: 1.1rem;
    color: #654321;
    margin-top: 2rem;
    font-weight: 600;
    letter-spacing: 1px;
  }
`

// Main component
const HolyGrailWhitepaper: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [activeChapter, setActiveChapter] = useState('Sacred Genesis')
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <Scriptorium visible={visible}>
      <CodexContainer>
        <GothicTitle>Sacred Codex</GothicTitle>
        <MonasticSubtitle>
          ~ The Divine Architecture and Mystical Prophecies of the Holy Grail Casino ~
        </MonasticSubtitle>

        <SacredTome>
          <ChapterSelection>
            {sections.map(section => (
              <RunicChapter
                key={section}
                active={activeChapter === section}
                onClick={() => setActiveChapter(section)}
              >
                <div className="runic-symbol">
                  {section === 'Sacred Genesis' && '📜'}
                  {section === 'Alchemical Architecture' && '⚗️'}
                  {section === 'Divine Mechanics' && '⚙️'}
                  {section === 'Prophetic Roadmap' && '🗿'}
                </div>
                <div className="chapter-title">{section}</div>
                <div className="chapter-subtitle">
                  {section === 'Sacred Genesis' && 'The divine origin and sacred mission'}
                  {section === 'Alchemical Architecture' && 'The mystical technical foundations'}
                  {section === 'Divine Mechanics' && 'The sacred systems and protocols'}
                  {section === 'Prophetic Roadmap' && 'The path to eternal greatness'}
                </div>
              </RunicChapter>
            ))}
          </ChapterSelection>

          {activeChapter === 'Sacred Genesis' && (
            <IlluminatedSection>
              <h2>
                <span className="chapter-icon">📜</span>
                The Sacred Genesis
              </h2>
              <p>
                In the beginning was the Code, and the Code was with the Blockchain, 
                and the Code was the Blockchain. From this divine digital realm emerged 
                the Holy Grail Casino — not merely another gaming platform, but a sacred 
                temple where mathematics meets mysticism, where chance becomes choice, 
                and where every wager is a prayer to the gods of probability.
              </p>
              
              <p>
                We are the heretics of the casino world, the digital monks who have forsaken 
                the corrupted temples of centralized gaming for the pure sanctuary of 
                blockchain truth. No venture capitalists corrupt our vision. No corporate 
                overlords dictate our destiny. We build for the faithful, the believers, 
                the digital pilgrims who seek authentic experience over artificial promises.
              </p>

              <h3>The Sacred Mission</h3>
              <p>
                <em>"I don't build for venture capitalists or fleeting hype cycles — I build for the trenches, 
                where real degens bleed their passion and dream their wildest fantasies."</em>
              </p>
              
              <p>
                Our mission transcends mere entertainment. We are crafting a new paradigm where:
              </p>

              <AlchemicalGrid>
                <AlchemicalCard>
                  <div className="alchemical-icon">⚖️</div>
                  <h4>Mathematical Purity</h4>
                  <p>
                    Every outcome determined by cryptographic certainty, not human manipulation. 
                    The sacred algorithms cannot lie, cannot cheat, cannot favor the house unfairly.
                  </p>
                </AlchemicalCard>
                
                <AlchemicalCard>
                  <div className="alchemical-icon">🔗</div>
                  <h4>Blockchain Immutability</h4>
                  <p>
                    Built upon the eternal foundation of Solana's blockchain, where every transaction 
                    is witnessed by thousands of validators and sealed in digital stone.
                  </p>
                </AlchemicalCard>
                
                <AlchemicalCard>
                  <div className="alchemical-icon">🏛️</div>
                  <h4>Decentralized Governance</h4>
                  <p>
                    No single authority controls your destiny. The community guides the realm's evolution 
                    through collective wisdom and shared prosperity.
                  </p>
                </AlchemicalCard>
              </AlchemicalGrid>

              <h3>The Philosophy of Fair Gaming</h3>
              <p>
                Traditional casinos operate on trust — you must believe they are fair. 
                We operate on proof — you can verify fairness yourself. This fundamental 
                shift from faith to fact represents the true revolution of blockchain gaming.
              </p>
            </IlluminatedSection>
          )}

          {activeChapter === 'Alchemical Architecture' && (
            <IlluminatedSection>
              <h2>
                <span className="chapter-icon">⚗️</span>
                The Alchemical Architecture
              </h2>
              <p>
                Like the ancient alchemists who sought to transmute base metals into gold, 
                we have transmuted traditional gaming mechanics into their blockchain equivalents. 
                Our architecture represents a careful balance of mystical user experience 
                and rigorous technical precision.
              </p>

              <h3>The Sacred Technical Stack</h3>
              <AlchemicalGrid>
                <AlchemicalCard>
                  <div className="alchemical-icon">⚡</div>
                  <h4>Gamba SDK Foundation</h4>
                  <p>
                    Built upon the sacred foundation of Gamba SDK — the open standard for 
                    on-chain casinos, providing the mystical infrastructure for fair gaming.
                  </p>
                </AlchemicalCard>
                
                <AlchemicalCard>
                  <div className="alchemical-icon">🚀</div>
                  <h4>Pure Frontend Alchemy</h4>
                  <p>
                    Powered by Vite with no backend dependencies. Everything runs in your browser, 
                    as transparent as crystal and as fast as lightning.
                  </p>
                </AlchemicalCard>
                
                <AlchemicalCard>
                  <div className="alchemical-icon">🛡️</div>
                  <h4>Cryptographic Verification</h4>
                  <p>
                    Every game result can be independently verified using our built-in fairness 
                    checker. The mathematics never lies, the algorithms never cheat.
                  </p>
                </AlchemicalCard>
              </AlchemicalGrid>

              <h3>The Mystical Gaming Engine</h3>
              <p>
                Our games operate through a sophisticated blend of client-side randomness 
                and server-side verification, creating an unbreakable chain of trust:
              </p>
              
              <ul>
                <li><strong>Client Seed Generation:</strong> Your browser generates a unique seed for each game session</li>
                <li><strong>Server Seed Commitment:</strong> Our servers commit to a hashed seed before gameplay begins</li>
                <li><strong>Nonce Incrementing:</strong> Each bet increments a counter ensuring uniqueness</li>
                <li><strong>Result Derivation:</strong> Mathematical combination of all seeds produces the outcome</li>
                <li><strong>Post-Game Verification:</strong> Server seed revelation allows complete result verification</li>
              </ul>

              <h3>The Sacred Smart Contracts</h3>
              <p>
                Our smart contracts serve as the immutable priests of our digital temple, 
                executing the sacred rituals of gaming with mathematical precision. 
                These contracts handle all financial transactions, ensuring that winnings 
                are distributed instantly and losses are recorded permanently.
              </p>
            </IlluminatedSection>
          )}

          {activeChapter === 'Divine Mechanics' && (
            <IlluminatedSection>
              <h2>
                <span className="chapter-icon">⚙️</span>
                The Divine Mechanics
              </h2>
              <p>
                The sacred mechanics of our realm operate through divine principles that 
                ensure fairness, transparency, and prosperity for all who enter our halls. 
                These are not mere rules, but cosmic laws that govern the flow of fortune.
              </p>

              <h3>Sacred Token Economics</h3>
              <p>
                Our realm embraces the diversity of the blockchain ecosystem, accepting 
                various sacred tokens as offerings to the gods of chance:
              </p>

              <AlchemicalGrid>
                <AlchemicalCard>
                  <div className="alchemical-icon">☀️</div>
                  <h4>SOL - The Solar Essence</h4>
                  <p>
                    The primary currency of our realm, representing the pure energy of the 
                    Solana blockchain. Fast, efficient, and blessed with minimal transaction costs.
                  </p>
                </AlchemicalCard>
                
                <AlchemicalCard>
                  <div className="alchemical-icon">🌙</div>
                  <h4>USDC - The Stable Foundation</h4>
                  <p>
                    For those who prefer the stability of earthly currencies while dancing 
                    with digital fortune. A bridge between traditional and mystical realms.
                  </p>
                </AlchemicalCard>
                
                <AlchemicalCard>
                  <div className="alchemical-icon">⭐</div>
                  <h4>Community Tokens</h4>
                  <p>
                    Various community-blessed tokens that add flavor to the mystical experience, 
                    each carrying the hopes and dreams of their devoted holders.
                  </p>
                </AlchemicalCard>
              </AlchemicalGrid>

              <h3>The Sacred Gaming Principles</h3>
              <ul>
                <li><strong>Provable Fairness:</strong> Every outcome mathematically verifiable</li>
                <li><strong>Instant Settlement:</strong> Winnings appear faster than divine intervention</li>
                <li><strong>Zero Counterparty Risk:</strong> Smart contracts eliminate human fallibility</li>
                <li><strong>Complete Transparency:</strong> All algorithms open to mystical inspection</li>
                <li><strong>Community Governed:</strong> The realm evolves through collective wisdom</li>
              </ul>

              <h3>The Ritual of Gaming</h3>
              <p>
                Each game session follows a sacred ritual that ensures fairness and transparency. 
                From the moment you enter our halls to the final revelation of results, 
                every step is governed by immutable mathematical law and cryptographic truth.
              </p>
            </IlluminatedSection>
          )}

          {activeChapter === 'Prophetic Roadmap' && (
            <IlluminatedSection>
              <h2>
                <span className="chapter-icon">🗿</span>
                The Prophetic Roadmap
              </h2>
              <p>
                The path ahead is illuminated by the sacred fire of innovation and guided 
                by the ancient wisdom of the blockchain. Our roadmap is not merely a plan — 
                it is a prophecy of the legendary realm we shall build together.
              </p>

              <h3>Phase I: The Foundation (Q4 2024 - Q1 2025)</h3>
              <p><em>Laying the Sacred Stones</em></p>
              <ul>
                <li><strong>Core Gaming Engine:</strong> Establish the mystical foundation with essential games</li>
                <li><strong>Provably Fair System:</strong> Implement divine fairness protocols</li>
                <li><strong>Multi-Token Support:</strong> Enable sacred currency diversity</li>
                <li><strong>Security Audits:</strong> Fortify the realm against dark forces</li>
                <li><strong>Community Building:</strong> Gather the faithful around our sacred fire</li>
              </ul>

              <h3>Phase II: The Expansion (Q2 2025 - Q3 2025)</h3>
              <p><em>Growing the Sacred Realm</em></p>
              <ul>
                <li><strong>Advanced Gaming:</strong> Introduce complex mystical challenges</li>
                <li><strong>Social Features:</strong> Foster brotherhood among seekers</li>
                <li><strong>Mobile Sanctification:</strong> Bring the magic to handheld devices</li>
                <li><strong>Referral System:</strong> Reward those who spread the sacred word</li>
                <li><strong>Analytics Temple:</strong> Provide insights into your legendary journey</li>
              </ul>

              <h3>Phase III: The Revolution (Q4 2025 - Q1 2026)</h3>
              <p><em>Transcending Boundaries</em></p>
              <ul>
                <li><strong>Cross-Chain Bridges:</strong> Expand beyond the Solana realm</li>
                <li><strong>NFT Integration:</strong> Sacred artifacts and achievements</li>
                <li><strong>Tournament Colosseum:</strong> Epic competitions among legends</li>
                <li><strong>Advanced Analytics:</strong> Deep insights into mystical patterns</li>
                <li><strong>API Platform:</strong> Enable third-party mystical innovations</li>
              </ul>

              <h3>Phase IV: The Legacy (Q2 2026+)</h3>
              <p><em>Eternal Greatness</em></p>
              <ul>
                <li><strong>Full Decentralization:</strong> Community-owned and operated</li>
                <li><strong>Ecosystem Expansion:</strong> Multiple interconnected realms</li>
                <li><strong>Research Initiative:</strong> Advance the science of fair gaming</li>
                <li><strong>Educational Academy:</strong> Teach the sacred arts to newcomers</li>
                <li><strong>Eternal Innovation:</strong> Never-ending evolution of mystical arts</li>
              </ul>

              <h3>The Ultimate Vision</h3>
              <p>
                <em>
                  "We envision a future where gaming transcends mere entertainment to become 
                  a form of mystical expression, where every bet is a brushstroke on the canvas 
                  of destiny, and where the boundary between player and legend dissolves 
                  in the eternal dance of chance and skill."
                </em>
              </p>
            </IlluminatedSection>
          )}

          <MonasticSeal>
            <div className="seal-text">
              <em>
                "Inscribed by the Sacred Order of the Holy Grail, witnessed by the eternal blockchain, 
                sealed with the cryptographic fire of truth, and blessed by the divine mathematics 
                that govern all fortune and fate in the mystical realms of digital eternity."
              </em>
            </div>
            <div className="monastery-signature">
              Sealed in the Sacred Scriptorium<br />
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </MonasticSeal>
        </SacredTome>
      </CodexContainer>
    </Scriptorium>
  )
}

export default HolyGrailWhitepaper