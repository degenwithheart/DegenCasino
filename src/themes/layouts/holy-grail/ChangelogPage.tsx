// Holy Grail ChangelogPage.tsx - The Royal Chronicles of Updates
// Medieval changelog with heraldic version histories

import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useColorScheme } from '../../../themes/ColorSchemeContext'

// Royal chronicle animations
const chronicleGlow = keyframes`
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

const versionFloat = keyframes`
  0%, 100% {
    transform: translateY(0) rotateZ(0deg);
  }
  33% {
    transform: translateY(-4px) rotateZ(1deg);
  }
  66% {
    transform: translateY(-2px) rotateZ(-0.5deg);
  }
`

const heraldShimmer = keyframes`
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

// Royal chronicles chamber
const ChroniclesChamber = styled.div<{ visible: boolean }>`
  min-height: 100vh;
  background: 
    /* Royal chronicles parchment */
    linear-gradient(45deg, 
      #f4f1e8 0%, 
      #f7f4eb 25%, 
      #f2efe6 50%, 
      #f5f2e9 75%, 
      #f3f0e7 100%
    ),
    /* Heraldic chronicle patterns */
    radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.08) 0%, transparent 5%),
    radial-gradient(circle at 75% 75%, rgba(139, 69, 19, 0.06) 0%, transparent 4%),
    radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.04) 0%, transparent 3%);
    
  /* Noble chronicle texture */
  background-image: 
    /* Chronicle scroll pattern */
    repeating-linear-gradient(
      60deg,
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
  
  /* Royal chronicle atmosphere */
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
    animation: ${chronicleGlow} 9s ease-in-out infinite;
  }
`

// Chronicle manuscript scroll
const ChronicleScroll = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  /* Royal chronicle scroll */
  background: 
    linear-gradient(135deg, 
      #faf8f0 0%, 
      #f6f3ea 30%, 
      #f4f1e8 70%, 
      #f2efe6 100%
    );
  
  border: 4px solid #8b4513;
  border-radius: 0;
  
  /* Chronicle chamber shadow */
  box-shadow: 
    inset 0 0 40px rgba(212, 175, 55, 0.2),
    inset 0 0 80px rgba(255, 255, 255, 0.3),
    0 15px 60px rgba(139, 69, 19, 0.4),
    0 30px 100px rgba(101, 67, 33, 0.3);
  
  transform: perspective(1000px) rotateX(1deg);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Royal scroll rods */
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

// Chronicle chamber page
const ChroniclesPage = styled.div`
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

// Royal chronicles title
const ChroniclesTitle = styled.h1`
  font-family: 'Uncial Antiqua', 'Luminari', serif;
  font-size: 4.5rem;
  color: #8b4513;
  text-align: center;
  margin: 0 0 2rem 0;
  font-weight: 400;
  letter-spacing: 3px;
  line-height: 1.2;
  position: relative;
  
  /* Royal chronicles calligraphy */
  text-shadow: 
    2px 2px 0px #d4af37,
    4px 4px 8px rgba(139, 69, 19, 0.4),
    0 0 20px rgba(212, 175, 55, 0.3);
  
  /* Chronicle scroll symbol */
  &::before {
    content: '📜';
    font-size: 3.5rem;
    display: block;
    margin: 0 auto 1rem auto;
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
    animation: ${versionFloat} 5s ease-in-out infinite;
  }
  
  /* Illuminated first letter */
  &::first-letter {
    font-size: 6rem;
    color: #d4af37;
    font-weight: 700;
    line-height: 1;
    margin-right: 8px;
    float: left;
    
    /* Royal drop cap */
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

// Chronicle description
const ChronicleDescription = styled.div`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1.3rem;
  color: #654321;
  text-align: center;
  line-height: 1.8;
  margin: 3rem auto 4rem auto;
  max-width: 700px;
  
  /* Noble manuscript styling */
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`

// Version entries
const VersionEntries = styled.div`
  margin: 4rem 0;
`

// Version entry
const VersionEntry = styled.div<{ isLatest?: boolean }>`
  background: 
    linear-gradient(135deg, 
      ${props => props.isLatest ? 
        'rgba(212, 175, 55, 0.15)' : 
        'rgba(250, 248, 240, 0.8)'
      } 0%, 
      ${props => props.isLatest ? 
        'rgba(139, 69, 19, 0.1)' : 
        'rgba(246, 243, 234, 0.9)'
      } 100%
    );
  border: 3px solid ${props => props.isLatest ? '#d4af37' : '#8b4513'};
  border-radius: 0;
  padding: 2.5rem;
  margin: 2rem 0;
  position: relative;
  overflow: hidden;
  
  /* Heraldic version effects */
  box-shadow: 
    0 10px 40px rgba(139, 69, 19, 0.3),
    0 20px 60px rgba(101, 67, 33, 0.2),
    inset 0 0 30px rgba(212, 175, 55, 0.1);
  
  ${props => props.isLatest && `
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
          rgba(212, 175, 55, 0.2) 50%,
          transparent 100%
        );
      animation: ${heraldShimmer} 6s ease-in-out infinite;
    }
  `}
`

// Version header
const VersionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`

// Version number
const VersionNumber = styled.h2`
  font-family: 'Uncial Antiqua', serif;
  font-size: 2rem;
  color: #8b4513;
  margin: 0;
  font-weight: 600;
  
  /* Noble version styling */
  text-shadow: 
    1px 1px 0px #d4af37,
    2px 2px 4px rgba(139, 69, 19, 0.3);
  
  /* Version heraldic symbol */
  &::before {
    content: '🏰';
    font-size: 1.5rem;
    margin-right: 0.5rem;
    filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.4));
  }
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`

// Version date
const VersionDate = styled.div`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1.1rem;
  color: #765432;
  
  /* Noble date styling */
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  
  &::before {
    content: '📅 ';
    filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.3));
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

// Version content
const VersionContent = styled.div`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1.1rem;
  color: #654321;
  line-height: 1.8;
  
  /* Noble manuscript styling */
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  
  h3 {
    font-size: 1.3rem;
    color: #8b4513;
    margin: 1.5rem 0 1rem 0;
    font-weight: 600;
    
    /* Category styling */
    text-shadow: 
      1px 1px 0px #d4af37,
      2px 2px 4px rgba(139, 69, 19, 0.3);
    
    &::before {
      content: '⚔️ ';
      filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.3));
    }
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
    
    li {
      margin: 0.8rem 0;
      position: relative;
      padding-left: 1.5rem;
      
      &::before {
        content: '✨';
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

// Release badge
const ReleaseBadge = styled.span<{ type: 'major' | 'minor' | 'patch' }>`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  font-family: 'Uncial Antiqua', serif;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 0;
  border: 2px solid;
  margin-left: 1rem;
  
  ${props => {
    switch (props.type) {
      case 'major':
        return `
          background: rgba(220, 20, 60, 0.1);
          color: #DC143C;
          border-color: #DC143C;
        `
      case 'minor':
        return `
          background: rgba(255, 140, 0, 0.1);
          color: #FF8C00;
          border-color: #FF8C00;
        `
      case 'patch':
        return `
          background: rgba(34, 139, 34, 0.1);
          color: #228B22;
          border-color: #228B22;
        `
    }
  }}
  
  /* Noble badge styling */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 0.5rem;
    font-size: 0.8rem;
  }
`

// Main component
const HolyGrailChangelogPage: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  // Mock changelog data
  const versions = [
    {
      version: 'v2.1.0',
      date: 'December 15, 2024',
      type: 'minor' as const,
      isLatest: true,
      changes: {
        'New Features': [
          'Added Holy Grail theme with medieval aesthetics',
          'Introduced DGHRT token staking rewards',
          'Enhanced leaderboard with seasonal tournaments',
          'Implemented multi-language support'
        ],
        'Improvements': [
          'Optimized game loading performance by 40%',
          'Enhanced mobile responsiveness across all games',
          'Improved wallet connection stability',
          'Updated UI animations and transitions'
        ],
        'Bug Fixes': [
          'Fixed jackpot display flickering issue',
          'Resolved tooltip positioning on mobile devices',
          'Corrected bonus calculation edge cases',
          'Fixed theme switching persistence'
        ]
      }
    },
    {
      version: 'v2.0.5',
      date: 'November 28, 2024',
      type: 'patch' as const,
      changes: {
        'Bug Fixes': [
          'Fixed critical security vulnerability in smart contracts',
          'Resolved RPC connection timeout issues',
          'Corrected balance display for small denominations',
          'Fixed game history pagination'
        ],
        'Improvements': [
          'Enhanced error handling and user feedback',
          'Improved transaction confirmation speeds'
        ]
      }
    },
    {
      version: 'v2.0.0',
      date: 'November 1, 2024',
      type: 'major' as const,
      changes: {
        'Major Updates': [
          'Complete rewrite using Gamba SDK v2',
          'Introduced provably fair gaming system',
          'Launched DGHRT token ecosystem',
          'Added comprehensive audit system'
        ],
        'New Games': [
          'Blackjack with live dealer simulation',
          'Enhanced Plinko with custom boards',
          'Multi-table Poker tournaments',
          'Virtual horse racing events'
        ],
        'Platform': [
          'Migrated to Solana mainnet',
          'Implemented multi-token support',
          'Added referral reward system',
          'Enhanced security protocols'
        ]
      }
    }
  ]

  return (
    <ChroniclesChamber visible={visible}>
      <ChronicleScroll>
        <ChroniclesPage>
          <ChroniclesTitle>Royal Chronicles</ChroniclesTitle>
          
          <ChronicleDescription>
            Behold the sacred chronicles of our realm's evolution. Each version brings forth 
            new wonders, enhanced noble features, and mighty improvements to serve our 
            distinguished knights and nobles better.
          </ChronicleDescription>
          
          <VersionEntries>
            {versions.map((version) => (
              <VersionEntry key={version.version} isLatest={version.isLatest}>
                <VersionHeader>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <VersionNumber>{version.version}</VersionNumber>
                    <ReleaseBadge type={version.type}>
                      {version.type.toUpperCase()}
                    </ReleaseBadge>
                  </div>
                  <VersionDate>{version.date}</VersionDate>
                </VersionHeader>
                
                <VersionContent>
                  {Object.entries(version.changes).map(([category, items]) => (
                    <div key={category}>
                      <h3>{category}</h3>
                      <ul>
                        {items.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </VersionContent>
              </VersionEntry>
            ))}
          </VersionEntries>
        </ChroniclesPage>
      </ChronicleScroll>
    </ChroniclesChamber>
  )
}

export default HolyGrailChangelogPage