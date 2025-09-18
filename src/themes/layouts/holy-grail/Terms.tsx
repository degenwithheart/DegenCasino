// Holy Grail Terms.tsx - The Sacred Covenant and Laws of the Realm
// Ancient scroll design with heraldic emblems and medieval legal styling

import React, { useState, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useColorScheme } from '../../ColorSchemeContext'

// Medieval legal document animations
const scrollUnroll = keyframes`
  0% {
    opacity: 0;
    transform: rotateX(-90deg) scale(0.3);
    filter: sepia(100%) brightness(0.3);
  }
  30% {
    filter: sepia(90%) brightness(0.5);
  }
  60% {
    filter: sepia(70%) brightness(0.8);
  }
  100% {
    opacity: 1;
    transform: rotateX(0deg) scale(1);
    filter: sepia(50%) brightness(1);
  }
`

const sealGlow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(139, 69, 19, 0.8));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 35px rgba(212, 175, 55, 1));
    transform: scale(1.05);
  }
`

const illuminatedFlicker = keyframes`
  0%, 100% {
    text-shadow: 
      0 0 15px rgba(255, 215, 0, 0.9),
      0 0 30px rgba(255, 215, 0, 0.7),
      0 0 45px rgba(184, 134, 11, 0.5);
  }
  25% {
    text-shadow: 
      0 0 20px rgba(255, 215, 0, 1),
      0 0 35px rgba(255, 215, 0, 0.9),
      0 0 50px rgba(184, 134, 11, 0.7);
  }
  75% {
    text-shadow: 
      0 0 10px rgba(255, 215, 0, 0.8),
      0 0 25px rgba(255, 215, 0, 0.6),
      0 0 40px rgba(184, 134, 11, 0.4);
  }
`

const waxSealPulse = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 25px rgba(139, 69, 19, 0.6),
      inset 0 0 20px rgba(160, 82, 45, 0.4);
  }
  50% {
    box-shadow: 
      0 0 40px rgba(139, 69, 19, 0.9),
      inset 0 0 30px rgba(160, 82, 45, 0.6);
  }
`

const firecrackle = keyframes`
  0%, 100% { opacity: 0.8; }
  25% { opacity: 1; }
  50% { opacity: 0.9; }
  75% { opacity: 0.95; }
`

// Ancient parchment container
const ParchmentHall = styled.div<{ visible: boolean }>`
  min-height: 100vh;
  background: 
    radial-gradient(ellipse at center, #3d2914 0%, #2a1810 40%, #1a0f08 80%),
    linear-gradient(135deg, #4a3325 0%, #3d2914 30%, #2a1810 60%, #1a0f08 100%);
  background-attachment: fixed;
  padding: 3rem 2rem;
  position: relative;
  overflow: hidden;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 1.8s ease-in-out;
  
  /* Ancient stone archway texture */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stone" patternUnits="userSpaceOnUse" width="25" height="25"><rect width="25" height="25" fill="%23654321" opacity="0.03"/><circle cx="12" cy="12" r="2" fill="%238b4513" opacity="0.06"/></pattern></defs><rect width="100" height="100" fill="url(%23stone)"/></svg>'),
      radial-gradient(circle at 15% 25%, rgba(139, 69, 19, 0.12) 0%, transparent 45%),
      radial-gradient(circle at 85% 75%, rgba(160, 82, 45, 0.08) 0%, transparent 45%);
    pointer-events: none;
    z-index: 0;
  }
  
  /* Flickering brazier light */
  &::after {
    content: '';
    position: absolute;
    top: 8%;
    right: 8%;
    width: 120px;
    height: 240px;
    background: radial-gradient(ellipse, rgba(255, 140, 0, 0.4) 0%, rgba(255, 69, 0, 0.2) 40%, transparent 80%);
    border-radius: 60% 60% 60% 60% / 80% 80% 20% 20%;
    animation: ${firecrackle} 2.5s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }
`

const ScrollContainer = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  animation: ${scrollUnroll} 2s ease-out;
`

// Heraldic title with royal crests
const HeraldicTitle = styled.h1`
  font-family: 'Cinzel Decorative', 'Old English Text MT', serif;
  font-size: 5rem;
  font-weight: 900;
  text-align: center;
  margin: 0 0 1.5rem 0;
  color: #d4af37;
  position: relative;
  animation: ${illuminatedFlicker} 4s ease-in-out infinite;
  letter-spacing: 2px;
  
  /* Royal ornament before */
  &::before {
    content: '⚜️';
    position: absolute;
    left: -4rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 3rem;
    color: #8b4513;
    animation: ${sealGlow} 3s ease-in-out infinite;
  }
  
  /* Royal ornament after */
  &::after {
    content: '⚜️';
    position: absolute;
    right: -4rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 3rem;
    color: #8b4513;
    animation: ${sealGlow} 3s ease-in-out infinite reverse;
  }
  
  @media (max-width: 768px) {
    font-size: 3rem;
    
    &::before, &::after {
      display: none;
    }
  }
`

const RoyalSubtitle = styled.p`
  font-family: 'Cinzel', 'Book Antiqua', serif;
  text-align: center;
  font-size: 1.6rem;
  color: #cdaa3d;
  margin: 0 0 4rem 0;
  font-style: italic;
  font-weight: 400;
  letter-spacing: 1.5px;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 3rem;
  }
`

// Legal scroll with wax seals
const LegalScroll = styled.div`
  background: 
    linear-gradient(145deg, 
      rgba(250, 248, 240, 0.98) 0%,
      rgba(255, 253, 245, 0.95) 20%,
      rgba(248, 243, 225, 0.97) 50%,
      rgba(250, 248, 240, 0.99) 100%
    );
  border: 12px solid #8b4513;
  border-radius: 25px;
  padding: 4rem;
  margin: 3rem 0;
  position: relative;
  box-shadow: 
    0 0 0 4px #d4af37,
    0 0 0 8px #8b4513,
    0 30px 80px rgba(139, 69, 19, 0.5),
    inset 0 0 60px rgba(212, 175, 55, 0.15);
    
  /* Wax seal decorations */
  &::before {
    content: '🔱';
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 3rem;
    background: 
      radial-gradient(circle, 
        #8b0000 0%,
        #a0522d 30%,
        #8b4513 70%,
        #654321 100%
      );
    padding: 1rem;
    border-radius: 50%;
    border: 6px solid #654321;
    animation: ${waxSealPulse} 4s ease-in-out infinite;
    box-shadow: 
      0 8px 25px rgba(139, 0, 0, 0.6),
      inset 0 0 20px rgba(160, 82, 45, 0.4);
  }
  
  /* Corner flourishes */
  &::after {
    content: '';
    position: absolute;
    top: 2rem;
    left: 2rem;
    width: 60px;
    height: 60px;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20,20 Q50,10 80,20 Q90,50 80,80 Q50,90 20,80 Q10,50 20,20 Z" fill="%238b4513" opacity="0.3"/></svg>');
    background-size: contain;
  }
  
  /* Aged parchment texture overlay */
  background-image: 
    radial-gradient(circle at 30% 30%, rgba(139, 69, 19, 0.04) 0%, transparent 60%),
    radial-gradient(circle at 70% 70%, rgba(160, 82, 45, 0.03) 0%, transparent 60%),
    linear-gradient(45deg, transparent 49%, rgba(139, 69, 19, 0.015) 50%, transparent 51%);
`

// Regional jurisdiction selector
const CoatOfArmsSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
  padding: 2rem;
  background: 
    linear-gradient(135deg,
      rgba(139, 69, 19, 0.2) 0%,
      rgba(160, 82, 45, 0.15) 50%,
      rgba(139, 69, 19, 0.2) 100%
    );
  border: 4px double #8b4513;
  border-radius: 20px;
  position: relative;
  
  &::before {
    content: '👑 SELECT YOUR REALM 👑';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(145deg, #f5f5dc, #e6dcc3);
    padding: 0.8rem 2rem;
    border: 4px solid #8b4513;
    border-radius: 20px;
    font-family: 'Cinzel', serif;
    font-size: 1rem;
    color: #8b4513;
    font-weight: 700;
    letter-spacing: 1.5px;
  }
`

const RealmCrest = styled.button<{ active: boolean }>`
  font-family: 'Cinzel', serif;
  padding: 1.5rem;
  border: 4px solid ${props => props.active ? '#d4af37' : '#8b4513'};
  border-radius: 15px;
  background: ${props => props.active 
    ? 'linear-gradient(145deg, rgba(212, 175, 55, 0.3), rgba(184, 134, 11, 0.2))'
    : 'linear-gradient(145deg, rgba(139, 69, 19, 0.1), rgba(160, 82, 45, 0.05))'
  };
  color: ${props => props.active ? '#b8860b' : '#8b4513'};
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: #d4af37;
    background: linear-gradient(145deg, rgba(212, 175, 55, 0.25), rgba(184, 134, 11, 0.15));
    transform: translateY(-5px);
    box-shadow: 
      0 12px 30px rgba(139, 69, 19, 0.4),
      inset 0 0 0 2px rgba(212, 175, 55, 0.3);
  }
  
  .crest-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    animation: ${props => props.active ? sealGlow : 'none'} 2s ease-in-out infinite;
  }
  
  .crest-title {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    letter-spacing: 0.5px;
  }
  
  .crest-subtitle {
    font-size: 0.9rem;
    opacity: 0.8;
    font-style: italic;
  }
  
  /* Heraldic banner effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent,
      rgba(212, 175, 55, 0.2),
      transparent
    );
    transition: left 0.6s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`

// Legal section styling
const LegalSection = styled.section`
  margin: 3rem 0;
  padding: 2.5rem;
  background: 
    linear-gradient(145deg,
      rgba(245, 245, 220, 0.4) 0%,
      rgba(255, 248, 220, 0.3) 50%,
      rgba(250, 240, 190, 0.4) 100%
    );
  border: 3px solid rgba(139, 69, 19, 0.4);
  border-radius: 18px;
  position: relative;
  
  /* Section number ornament */
  &::before {
    content: attr(data-section);
    position: absolute;
    top: -18px;
    left: 2rem;
    background: 
      radial-gradient(circle, #8b4513 0%, #654321 70%);
    color: #d4af37;
    padding: 0.5rem 1.5rem;
    border-radius: 12px;
    border: 3px solid #d4af37;
    font-family: 'Cinzel', serif;
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 1px;
  }
  
  h2 {
    font-family: 'Cinzel', serif;
    font-size: 2rem;
    color: #8b4513;
    margin: 0 0 1.5rem 0;
    font-weight: 700;
    letter-spacing: 1px;
    
    .section-icon {
      margin-right: 1rem;
      color: #d4af37;
      filter: drop-shadow(2px 2px 4px rgba(139, 69, 19, 0.4));
    }
  }
  
  h3 {
    font-family: 'Cinzel', serif;
    font-size: 1.4rem;
    color: #654321;
    margin: 2rem 0 1rem 0;
    font-weight: 600;
    border-bottom: 2px solid rgba(139, 69, 19, 0.3);
    padding-bottom: 0.5rem;
  }
  
  p {
    color: #4a3325;
    line-height: 1.8;
    font-size: 1.1rem;
    margin: 0 0 1.5rem 0;
    text-align: justify;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  ul {
    padding-left: 2.5rem;
    margin: 1.5rem 0;
    
    li {
      margin: 1rem 0;
      color: #4a3325;
      line-height: 1.7;
      font-size: 1.05rem;
      position: relative;
      
      &::marker {
        color: #8b4513;
        font-weight: bold;
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
  }
  
  strong {
    color: #8b4513;
    font-weight: 700;
  }
`

// Signature and seal area
const RoyalSignature = styled.div`
  margin-top: 4rem;
  padding: 3rem;
  text-align: center;
  background: 
    linear-gradient(145deg,
      rgba(139, 69, 19, 0.25) 0%,
      rgba(160, 82, 45, 0.2) 50%,
      rgba(139, 69, 19, 0.25) 100%
    );
  border: 6px double #8b4513;
  border-radius: 25px;
  position: relative;
  
  &::before {
    content: '🏰';
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 4rem;
    background: 
      radial-gradient(circle, #d4af37 0%, #b8860b 70%);
    padding: 1rem;
    border-radius: 50%;
    border: 6px solid #8b4513;
    animation: ${sealGlow} 3s ease-in-out infinite;
  }
  
  .signature-text {
    font-family: 'Cinzel', serif;
    font-size: 1.3rem;
    color: #8b4513;
    font-style: italic;
    margin-bottom: 1rem;
    letter-spacing: 1px;
  }
  
  .date-seal {
    font-family: 'Cinzel', serif;
    font-size: 1rem;
    color: #654321;
    margin-top: 1rem;
    font-weight: 600;
  }
`

// Main component
const HolyGrailTerms: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [selectedRealm, setSelectedRealm] = useState('global')
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  const realms = [
    {
      id: 'global',
      icon: '🌍',
      title: 'Global Realm',
      subtitle: 'Universal Laws'
    },
    {
      id: 'usa',
      icon: '🦅',
      title: 'American Kingdom',
      subtitle: 'United States'
    },
    {
      id: 'eu',
      icon: '🏰',
      title: 'European Empire',
      subtitle: 'European Union'
    },
    {
      id: 'asia',
      icon: '🐉',
      title: 'Eastern Dynasty',
      subtitle: 'Asian Territories'
    }
  ]

  return (
    <ParchmentHall visible={visible}>
      <ScrollContainer>
        <HeraldicTitle>Sacred Covenant</HeraldicTitle>
        <RoyalSubtitle>
          ~ The Binding Laws and Ancient Agreements of the Holy Grail Casino ~
        </RoyalSubtitle>

        <LegalScroll>
          <CoatOfArmsSelector>
            {realms.map(realm => (
              <RealmCrest
                key={realm.id}
                active={selectedRealm === realm.id}
                onClick={() => setSelectedRealm(realm.id)}
              >
                <div className="crest-icon">{realm.icon}</div>
                <div className="crest-title">{realm.title}</div>
                <div className="crest-subtitle">{realm.subtitle}</div>
              </RealmCrest>
            ))}
          </CoatOfArmsSelector>

          <LegalSection data-section="Article I">
            <h2>
              <span className="section-icon">⚖️</span>
              Sacred Acceptance of Terms
            </h2>
            <p>
              <strong>By entering these hallowed halls</strong> and participating in the mystical games 
              of chance within the Holy Grail Casino, you, noble seeker, do hereby acknowledge and 
              accept the binding nature of this Sacred Covenant.
            </p>
            <p>
              These terms constitute a <em>legally binding agreement</em> between yourself and the 
              custodians of this digital realm. Your continued presence and participation signifies 
              your complete understanding and acceptance of all provisions herein contained.
            </p>
            <h3>Sacred Obligations</h3>
            <ul>
              <li><strong>Age Verification:</strong> You must be of legal age in your jurisdiction (18+ or 21+ where applicable)</li>
              <li><strong>Legal Capacity:</strong> You must possess the legal authority to enter into this agreement</li>
              <li><strong>Jurisdictional Compliance:</strong> You must not be in a location where online gaming is prohibited</li>
              <li><strong>True Identity:</strong> All information provided must be accurate and truthful</li>
            </ul>
          </LegalSection>

          <LegalSection data-section="Article II">
            <h2>
              <span className="section-icon">🏛️</span>
              The Nature of Our Sacred Realm
            </h2>
            <p>
              The Holy Grail Casino operates as a <strong>decentralized gaming platform</strong> built 
              upon the immutable foundations of blockchain technology. Unlike traditional casinos, 
              our realm exists in the digital ether, governed by smart contracts and cryptographic proof.
            </p>
            <h3>Platform Characteristics</h3>
            <ul>
              <li><strong>Blockchain-Based:</strong> All games operate on the Solana blockchain</li>
              <li><strong>Provably Fair:</strong> Every outcome is cryptographically verifiable</li>
              <li><strong>Decentralized:</strong> No central authority controls game outcomes</li>
              <li><strong>Self-Custodial:</strong> You maintain control of your funds at all times</li>
              <li><strong>Open Source:</strong> Game mechanics are publicly auditable</li>
            </ul>
          </LegalSection>

          <LegalSection data-section="Article III">
            <h2>
              <span className="section-icon">⚔️</span>
              Responsibilities and Conduct
            </h2>
            <p>
              <strong>With great power comes great responsibility.</strong> As a knight in our digital 
              realm, you are bound by codes of honor and conduct that ensure the sanctity of our 
              shared experience.
            </p>
            <h3>Player Obligations</h3>
            <ul>
              <li><strong>Responsible Gaming:</strong> You must gamble within your means and never risk more than you can afford to lose</li>
              <li><strong>Account Security:</strong> You are solely responsible for the security of your wallet and private keys</li>
              <li><strong>Prohibited Activities:</strong> No cheating, exploiting, or attempting to manipulate game outcomes</li>
              <li><strong>Legal Compliance:</strong> You must comply with all applicable laws in your jurisdiction</li>
              <li><strong>Respectful Behavior:</strong> Maintain civility and respect toward other players and platform administrators</li>
            </ul>
          </LegalSection>

          <LegalSection data-section="Article IV">
            <h2>
              <span className="section-icon">🛡️</span>
              Disclaimers and Limitations
            </h2>
            <p>
              <strong>The mystical arts carry inherent risks.</strong> While we strive to provide a safe 
              and fair gaming environment, the nature of blockchain technology and cryptocurrency involves 
              certain unavoidable risks and limitations.
            </p>
            <h3>Risk Acknowledgments</h3>
            <ul>
              <li><strong>Cryptocurrency Volatility:</strong> Token values may fluctuate significantly</li>
              <li><strong>Technical Risks:</strong> Blockchain networks may experience congestion or downtime</li>
              <li><strong>Smart Contract Risks:</strong> While audited, smart contracts may contain unforeseen vulnerabilities</li>
              <li><strong>Regulatory Changes:</strong> Laws governing digital assets may change without notice</li>
              <li><strong>No Guaranteed Returns:</strong> All gaming involves risk of loss</li>
            </ul>
          </LegalSection>

          <LegalSection data-section="Article V">
            <h2>
              <span className="section-icon">👑</span>
              Governance and Resolution
            </h2>
            <p>
              <strong>In matters of dispute,</strong> the Sacred Covenant provides clear pathways for 
              resolution. Our governance structure ensures fair treatment while maintaining the 
              decentralized nature of our realm.
            </p>
            <h3>Dispute Resolution</h3>
            <ul>
              <li><strong>Community Arbitration:</strong> Minor disputes may be resolved through community consensus</li>
              <li><strong>Technical Resolution:</strong> Game outcome disputes are resolved through cryptographic verification</li>
              <li><strong>Legal Jurisdiction:</strong> Serious legal matters fall under the jurisdiction of {selectedRealm === 'usa' ? 'Delaware, United States' : selectedRealm === 'eu' ? 'Malta' : selectedRealm === 'asia' ? 'Singapore' : 'International Maritime Law'}</li>
              <li><strong>Limitation Period:</strong> All claims must be brought within 30 days of the relevant event</li>
            </ul>
          </LegalSection>

          <RoyalSignature>
            <div className="signature-text">
              <em>
                "Signed and sealed by the Order of the Holy Grail, witnessed by the eternal blockchain, 
                and bound by the immutable laws of cryptographic truth."
              </em>
            </div>
            <div className="date-seal">
              Sealed this day: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </RoyalSignature>
        </LegalScroll>
      </ScrollContainer>
    </ParchmentHall>
  )
}

export default HolyGrailTerms