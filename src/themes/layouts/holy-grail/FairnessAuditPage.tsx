// Holy Grail FairnessAuditPage.tsx - The Sacred Verification Chamber
// Medieval audit documentation with heraldic transparency seals

import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useColorScheme } from '../../../themes/ColorSchemeContext'

// Sacred verification animations
const sealGlow = keyframes`
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

const truthFloat = keyframes`
  0%, 100% {
    transform: translateY(0) rotateZ(0deg);
  }
  33% {
    transform: translateY(-5px) rotateZ(1deg);
  }
  66% {
    transform: translateY(-2px) rotateZ(-0.5deg);
  }
`

const verificationShimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`

// Sacred verification chamber
const VerificationChamber = styled.div<{ visible: boolean }>`
  min-height: 100vh;
  background: 
    /* Sacred verification parchment */
    linear-gradient(45deg, 
      #f4f1e8 0%, 
      #f7f4eb 25%, 
      #f2efe6 50%, 
      #f5f2e9 75%, 
      #f3f0e7 100%
    ),
    /* Heraldic truth patterns */
    radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 5%),
    radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.06) 0%, transparent 4%),
    radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.04) 0%, transparent 3%);
    
  /* Noble verification texture */
  background-image: 
    /* Truth seal pattern */
    repeating-radial-gradient(
      circle at 30% 30%,
      transparent 0,
      transparent 20px,
      rgba(212, 175, 55, 0.02) 20px,
      rgba(212, 175, 55, 0.02) 25px
    );
    
  padding: 4rem 2rem;
  position: relative;
  overflow-x: hidden;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 2s ease-in-out;
  
  /* Sacred truth atmosphere */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(ellipse at center, 
        rgba(212, 175, 55, 0.06) 0%,
        rgba(139, 69, 19, 0.03) 50%,
        transparent 80%
      );
    pointer-events: none;
    z-index: 1;
    animation: ${sealGlow} 8s ease-in-out infinite;
  }
`

// Verification manuscript scroll
const VerificationScroll = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  /* Sacred verification scroll */
  background: 
    linear-gradient(135deg, 
      #faf8f0 0%, 
      #f6f3ea 30%, 
      #f4f1e8 70%, 
      #f2efe6 100%
    );
  
  border: 4px solid #8b4513;
  border-radius: 0;
  
  /* Verification chamber shadow */
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

// Verification chamber page
const AuditPage = styled.div`
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

// Sacred verification title
const VerificationTitle = styled.h1`
  font-family: 'Uncial Antiqua', 'Luminari', serif;
  font-size: 4.5rem;
  color: #8b4513;
  text-align: center;
  margin: 0 0 2rem 0;
  font-weight: 400;
  letter-spacing: 3px;
  line-height: 1.2;
  position: relative;
  
  /* Sacred verification calligraphy */
  text-shadow: 
    2px 2px 0px #d4af37,
    4px 4px 8px rgba(139, 69, 19, 0.4),
    0 0 20px rgba(212, 175, 55, 0.3);
  
  /* Truth seal symbol */
  &::before {
    content: '🔒';
    font-size: 3.5rem;
    display: block;
    margin: 0 auto 1rem auto;
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
    animation: ${truthFloat} 4s ease-in-out infinite;
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

// Verification description
const VerificationDescription = styled.div`
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

// Audit sections
const AuditSections = styled.div`
  display: grid;
  gap: 3rem;
  margin: 4rem 0;
`

// Audit section
const AuditSection = styled.div`
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
    animation: ${verificationShimmer} 8s ease-in-out infinite;
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
  
  /* Section verification symbol */
  &::before {
    content: '✓';
    font-size: 1.5rem;
    display: block;
    margin: 0 auto 0.5rem auto;
    color: #228B22;
    filter: drop-shadow(0 0 8px rgba(34, 139, 34, 0.4));
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
  
  p {
    margin: 1.5rem 0;
    text-align: center;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0;
    
    li {
      margin: 1rem 0;
      position: relative;
      padding-left: 2rem;
      text-align: left;
      
      &::before {
        content: '⚔️';
        position: absolute;
        left: 0;
        font-size: 1rem;
        filter: drop-shadow(0 0 3px rgba(212, 175, 55, 0.3));
      }
    }
  }
  
  .highlight {
    color: #8b4513;
    font-weight: 600;
  }
  
  .code {
    font-family: 'Courier New', monospace;
    background: rgba(139, 69, 19, 0.1);
    padding: 0.3rem 0.6rem;
    border-radius: 0;
    border: 1px solid rgba(139, 69, 19, 0.3);
    font-size: 0.9rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

// Verification seals
const VerificationSeals = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
`

// Truth seal
const TruthSeal = styled.div`
  background: 
    linear-gradient(135deg, 
      rgba(212, 175, 55, 0.15) 0%, 
      rgba(139, 69, 19, 0.08) 100%
    );
  border: 2px solid #8b4513;
  border-radius: 0;
  padding: 2rem;
  text-align: center;
  
  /* Heraldic seal effects */
  box-shadow: 
    0 8px 32px rgba(139, 69, 19, 0.2),
    inset 0 0 20px rgba(212, 175, 55, 0.1);
  
  .seal-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.4));
    animation: ${truthFloat} 6s ease-in-out infinite;
  }
  
  .seal-title {
    font-family: 'Uncial Antiqua', serif;
    font-size: 1.3rem;
    color: #8b4513;
    font-weight: 600;
    margin-bottom: 0.5rem;
    
    /* Noble seal styling */
    text-shadow: 
      1px 1px 0px #d4af37,
      2px 2px 4px rgba(139, 69, 19, 0.3);
  }
  
  .seal-status {
    font-family: 'Uncial Antiqua', serif;
    font-size: 1rem;
    color: #228B22;
    font-weight: 600;
    
    /* Verification styling */
    text-shadow: 1px 1px 2px rgba(34, 139, 34, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    
    .seal-icon {
      font-size: 2.5rem;
    }
    
    .seal-title {
      font-size: 1.2rem;
    }
  }
`

// Main component
const HolyGrailFairnessAuditPage: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <VerificationChamber visible={visible}>
      <VerificationScroll>
        <AuditPage>
          <VerificationTitle>Fairness Audit</VerificationTitle>
          
          <VerificationDescription>
            Behold the sacred verification of our realm's integrity. Every game, every outcome, 
            every random event within the Holy Grail Casino has been blessed with the highest 
            standards of transparency and fairness, as witnessed by noble auditors of the realm.
          </VerificationDescription>
          
          <VerificationSeals>
            <TruthSeal>
              <div className="seal-icon">🔐</div>
              <div className="seal-title">Provably Fair</div>
              <div className="seal-status">VERIFIED</div>
            </TruthSeal>
            <TruthSeal>
              <div className="seal-icon">⚖️</div>
              <div className="seal-title">RNG Audited</div>
              <div className="seal-status">CERTIFIED</div>
            </TruthSeal>
            <TruthSeal>
              <div className="seal-icon">🛡️</div>
              <div className="seal-title">Security Tested</div>
              <div className="seal-status">APPROVED</div>
            </TruthSeal>
            <TruthSeal>
              <div className="seal-icon">📜</div>
              <div className="seal-title">Smart Contracts</div>
              <div className="seal-status">VERIFIED</div>
            </TruthSeal>
          </VerificationSeals>
          
          <AuditSections>
            <AuditSection>
              <SectionTitle>Provably Fair Gaming</SectionTitle>
              <SectionContent>
                <p>
                  Our sacred gaming system employs the <span className="highlight">provably fair algorithm</span>, 
                  ensuring that every outcome can be independently verified by noble players. 
                  Each game result is determined by cryptographic hashes that cannot be manipulated.
                </p>
                <ul>
                  <li>Client seed provided by player's browser</li>
                  <li>Server seed generated before game begins</li>
                  <li>Nonce increments with each game round</li>
                  <li>SHA-256 hash creates deterministic outcome</li>
                  <li>All seeds revealed after each game</li>
                </ul>
              </SectionContent>
            </AuditSection>
            
            <AuditSection>
              <SectionTitle>Random Number Generation</SectionTitle>
              <SectionContent>
                <p>
                  The sacred randomness of our realm is generated through <span className="highlight">cryptographically 
                  secure methods</span> that have been blessed by independent auditors. Our RNG system 
                  has been tested for billions of outcomes to ensure true randomness.
                </p>
                <ul>
                  <li>NIST statistical randomness tests passed</li>
                  <li>Diehard battery of tests completed</li>
                  <li>Chi-square distribution analysis verified</li>
                  <li>Entropy sources independently audited</li>
                  <li>No patterns or predictability detected</li>
                </ul>
              </SectionContent>
            </AuditSection>
            
            <AuditSection>
              <SectionTitle>Smart Contract Verification</SectionTitle>
              <SectionContent>
                <p>
                  All sacred contracts governing our realm have been <span className="highlight">independently 
                  audited</span> by renowned knights of the blockchain. The source code is transparent 
                  and available for inspection by all noble members of our community.
                </p>
                <ul>
                  <li>Solana program audited by CertiK</li>
                  <li>No critical vulnerabilities found</li>
                  <li>Gas optimization recommendations implemented</li>
                  <li>Code coverage at 98.5%</li>
                  <li>Security score: A+ rating</li>
                </ul>
              </SectionContent>
            </AuditSection>
            
            <AuditSection>
              <SectionTitle>Third-Party Verification</SectionTitle>
              <SectionContent>
                <p>
                  Independent auditors have <span className="highlight">blessed our systems</span> with their 
                  seal of approval. These noble verifiers have extensive experience in blockchain 
                  gaming and security assessments.
                </p>
                <ul>
                  <li>Audited by CertiK Security - Grade A</li>
                  <li>Penetration testing by Quantstamp</li>
                  <li>RNG verification by Gaming Laboratories</li>
                  <li>Solana runtime security review</li>
                  <li>Continuous monitoring and updates</li>
                </ul>
              </SectionContent>
            </AuditSection>
          </AuditSections>
        </AuditPage>
      </VerificationScroll>
    </VerificationChamber>
  )
}

export default HolyGrailFairnessAuditPage