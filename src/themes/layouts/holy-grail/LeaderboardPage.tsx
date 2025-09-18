// Holy Grail LeaderboardPage.tsx - The Hall of Legendary Knights
// Medieval hall of fame with heraldic banners and royal rankings

import React, { useState, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useColorScheme } from '../../../themes/ColorSchemeContext'

// Noble ranking animations
const heraldicGleam = keyframes`
  0%, 100% {
    background-position: -200% center;
    opacity: 0.8;
  }
  50% {
    background-position: 200% center;
    opacity: 1;
  }
`

const royalBanner = keyframes`
  0% {
    transform: translateY(0) rotateX(0deg);
  }
  50% {
    transform: translateY(-3px) rotateX(2deg);
  }
  100% {
    transform: translateY(0) rotateX(0deg);
  }
`

// Legendary hall parchment
const LegendaryHall = styled.div<{ visible: boolean }>`
  min-height: 100vh;
  background: 
    /* Royal hall parchment */
    linear-gradient(45deg, 
      #f4f1e8 0%, 
      #f7f4eb 25%, 
      #f2efe6 50%, 
      #f5f2e9 75%, 
      #f3f0e7 100%
    ),
    /* Heraldic banners and coats of arms */
    radial-gradient(circle at 20% 25%, rgba(212, 175, 55, 0.1) 0%, transparent 5%),
    radial-gradient(circle at 80% 75%, rgba(139, 69, 19, 0.08) 0%, transparent 4%),
    radial-gradient(circle at 50% 10%, rgba(212, 175, 55, 0.06) 0%, transparent 3%);
    
  /* Royal tapestry texture */
  background-image: 
    /* Noble pattern */
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 5px,
      rgba(212, 175, 55, 0.03) 5px,
      rgba(212, 175, 55, 0.03) 10px
    );
    
  padding: 4rem 2rem;
  position: relative;
  overflow-x: hidden;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 2s ease-in-out;
  
  /* Royal hall atmosphere */
  &::before {
    content: '';
    position: fixed;
    top: 5%;
    left: 10%;
    width: 80%;
    height: 90%;
    background: 
      radial-gradient(ellipse at center, 
        rgba(212, 175, 55, 0.04) 0%,
        rgba(139, 69, 19, 0.02) 50%,
        transparent 80%
      );
    pointer-events: none;
    z-index: 0;
    animation: ${heraldicGleam} 5s ease-in-out infinite;
  }
`

// Royal hall scroll
const HallScroll = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  /* Royal proclamation scroll */
  background: 
    linear-gradient(135deg, 
      #faf8f0 0%, 
      #f6f3ea 30%, 
      #f4f1e8 70%, 
      #f2efe6 100%
    );
  
  border: 4px solid #8b4513;
  border-radius: 0;
  
  /* Legendary hall shadow */
  box-shadow: 
    inset 0 0 40px rgba(212, 175, 55, 0.2),
    inset 0 0 80px rgba(255, 255, 255, 0.3),
    0 15px 60px rgba(139, 69, 19, 0.4),
    0 30px 100px rgba(101, 67, 33, 0.3);
  
  transform: perspective(1000px) rotateX(1deg);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Royal scroll rods */
  &::before {
    content: '';
    position: absolute;
    top: -10px;
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
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
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
    box-shadow: 0 -3px 6px rgba(139, 69, 19, 0.4);
  }
`

// Royal leaderboard page
const HallPage = styled.div`
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

// Legendary hall title
const HallTitle = styled.h1`
  font-family: 'Uncial Antiqua', 'Luminari', serif;
  font-size: 4.5rem;
  color: #8b4513;
  text-align: center;
  margin: 0 0 2rem 0;
  font-weight: 400;
  letter-spacing: 3px;
  line-height: 1.2;
  position: relative;
  
  /* Legendary hall calligraphy */
  text-shadow: 
    2px 2px 0px #d4af37,
    4px 4px 8px rgba(139, 69, 19, 0.4),
    0 0 20px rgba(212, 175, 55, 0.3);
  
  /* Royal crown symbol */
  &::before {
    content: '🏆';
    font-size: 3.5rem;
    display: block;
    margin: 0 auto 1rem auto;
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
    animation: ${royalBanner} 3s ease-in-out infinite;
  }
  
  /* Illuminated first letter */
  &::first-letter {
    font-size: 6rem;
    color: #d4af37;
    font-weight: 700;
    line-height: 1;
    margin-right: 8px;
    float: left;
    
    /* Legendary drop cap */
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

// Hall of fame description
const HallDescription = styled.div`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1.3rem;
  color: #654321;
  text-align: center;
  line-height: 1.8;
  margin: 3rem auto;
  max-width: 800px;
  
  /* Noble manuscript styling */
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  
  /* Heraldic quotation marks */
  &::before {
    content: '⚜️';
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

// Knights ranking table
const KnightsTable = styled.div`
  margin: 4rem 0;
  border: 3px solid #8b4513;
  border-radius: 0;
  overflow: hidden;
  
  /* Royal table shadow */
  box-shadow: 
    0 10px 40px rgba(139, 69, 19, 0.3),
    0 20px 60px rgba(101, 67, 33, 0.2);
`

// Table header
const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 150px 150px 150px;
  background: 
    linear-gradient(135deg, 
      #d4af37 0%, 
      #b8860b 50%, 
      #d4af37 100%
    );
  color: #2a1810;
  font-family: 'Uncial Antiqua', serif;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 1.5rem 1rem;
  
  /* Royal header shadow */
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.4);
  box-shadow: inset 0 0 20px rgba(139, 69, 19, 0.2);
  
  @media (max-width: 768px) {
    grid-template-columns: 50px 1fr 100px 100px;
    font-size: 1rem;
    padding: 1rem 0.5rem;
    
    .desktop-only {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 40px 1fr 80px;
    font-size: 0.9rem;
    
    .mobile-hidden {
      display: none;
    }
  }
`

// Knight row
const KnightRow = styled.div<{ rank: number }>`
  display: grid;
  grid-template-columns: 60px 1fr 150px 150px 150px;
  padding: 1.5rem 1rem;
  background: ${props => {
    if (props.rank === 1) return 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)'
    if (props.rank === 2) return 'linear-gradient(135deg, rgba(192, 192, 192, 0.2) 0%, rgba(169, 169, 169, 0.1) 100%)'
    if (props.rank === 3) return 'linear-gradient(135deg, rgba(205, 127, 50, 0.2) 0%, rgba(184, 115, 51, 0.1) 100%)'
    return props.rank % 2 === 0 ? 'rgba(245, 245, 220, 0.3)' : 'rgba(250, 240, 190, 0.2)'
  }};
  border-bottom: 1px solid rgba(139, 69, 19, 0.2);
  font-family: 'Uncial Antiqua', serif;
  color: #654321;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(212, 175, 55, 0.15);
    transform: translateX(5px);
  }
  
  .rank {
    font-size: 1.2rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => {
      if (props.rank === 1) return '#FFD700'
      if (props.rank === 2) return '#C0C0C0'
      if (props.rank === 3) return '#CD7F32'
      return '#8b4513'
    }};
    
    /* Medal icons for top 3 */
    &::before {
      content: ${props => {
        if (props.rank === 1) return "'🥇'"
        if (props.rank === 2) return "'🥈'"
        if (props.rank === 3) return "'🥉'"
        return `'${props.rank}'`
      }};
      ${props => props.rank <= 3 && `
        font-size: 1.5rem;
        filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
      `}
    }
  }
  
  .knight-name {
    font-size: 1.1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    
    &::before {
      content: '⚔️';
      margin-right: 0.5rem;
      font-size: 1rem;
    }
  }
  
  .stat {
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #8b4513;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 50px 1fr 100px 100px;
    padding: 1rem 0.5rem;
    
    .desktop-only {
      display: none;
    }
    
    .knight-name {
      font-size: 1rem;
    }
    
    .stat {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 40px 1fr 80px;
    
    .mobile-hidden {
      display: none;
    }
    
    .knight-name {
      font-size: 0.9rem;
      
      &::before {
        font-size: 0.8rem;
      }
    }
    
    .stat {
      font-size: 0.8rem;
    }
  }
`

// Main component
const HolyGrailLeaderboardPage: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  // Mock leaderboard data
  const knights = [
    { name: 'Sir Lancelot the Bold', wins: 1247, wagered: '12,450 SOL', profit: '+2,890 SOL' },
    { name: 'Dame Guinevere', wins: 1156, wagered: '11,230 SOL', profit: '+2,340 SOL' },
    { name: 'Sir Galahad Pure', wins: 1089, wagered: '10,890 SOL', profit: '+1,980 SOL' },
    { name: 'Sir Percival Quest', wins: 987, wagered: '9,870 SOL', profit: '+1,720 SOL' },
    { name: 'Sir Gareth Young', wins: 876, wagered: '8,760 SOL', profit: '+1,450 SOL' },
    { name: 'Dame Morgana Wise', wins: 823, wagered: '8,230 SOL', profit: '+1,290 SOL' },
    { name: 'Sir Tristan Song', wins: 756, wagered: '7,560 SOL', profit: '+1,120 SOL' },
    { name: 'Sir Gawain Sun', wins: 689, wagered: '6,890 SOL', profit: '+980 SOL' },
  ]

  return (
    <LegendaryHall visible={visible}>
      <HallScroll>
        <HallPage>
          <HallTitle>Hall of Legends</HallTitle>
          
          <HallDescription>
            Behold the most valiant knights of our realm, whose courage and skill 
            have earned them eternal glory in the annals of the Holy Grail Casino. 
            Their deeds echo through the halls of time.
          </HallDescription>
          
          <KnightsTable>
            <TableHeader>
              <div>Rank</div>
              <div>Knight</div>
              <div className="mobile-hidden">Victories</div>
              <div className="desktop-only">Wagered</div>
              <div>Profit</div>
            </TableHeader>
            
            {knights.map((knight, index) => (
              <KnightRow key={knight.name} rank={index + 1}>
                <div className="rank"></div>
                <div className="knight-name">{knight.name}</div>
                <div className="stat mobile-hidden">{knight.wins}</div>
                <div className="stat desktop-only">{knight.wagered}</div>
                <div className="stat">{knight.profit}</div>
              </KnightRow>
            ))}
          </KnightsTable>
        </HallPage>
      </HallScroll>
    </LegendaryHall>
  )
}

export default HolyGrailLeaderboardPage