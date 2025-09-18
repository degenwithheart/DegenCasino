// Holy Grail UserProfile.tsx - The Sacred Manuscript of the Chosen Knight
// Ancient parchment design with medieval illumination styling

import React, { useState, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useReferral, useTokenBalance, useCurrentToken } from "gamba-react-ui-v2"
import { generateUsernameFromWallet, generateDegenStoryFromWallet } from '../../../utils/user/userProfileUtils'
import { ReferralDashboard } from '../../../components'
import { ReferralLeaderboardModal, useReferralLeaderboardModal } from '../../../components'
import { useToast } from '../../../hooks/ui/useToast'
import { truncateString } from "../../../utils"

// Ancient manuscript animations with medieval flair
const manuscriptUnfurl = keyframes`
  0% {
    opacity: 0;
    transform: rotateX(90deg) scale(0.8);
    filter: sepia(100%) brightness(0.6);
  }
  50% {
    filter: sepia(80%) brightness(0.8);
  }
  100% {
    opacity: 1;
    transform: rotateX(0deg) scale(1);
    filter: sepia(60%) brightness(1);
  }
`

const grailLevitation = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    filter: drop-shadow(0 5px 15px rgba(139, 69, 19, 0.6));
  }
  33% { 
    transform: translateY(-12px) rotate(2deg);
    filter: drop-shadow(0 8px 25px rgba(139, 69, 19, 0.8));
  }
  66% { 
    transform: translateY(-8px) rotate(-1deg);
    filter: drop-shadow(0 6px 20px rgba(139, 69, 19, 0.7));
  }
`

const illuminatedGlow = keyframes`
  0%, 100% {
    text-shadow: 
      0 0 10px rgba(255, 215, 0, 0.8),
      0 0 20px rgba(255, 215, 0, 0.6),
      0 0 30px rgba(184, 134, 11, 0.4);
  }
  50% {
    text-shadow: 
      0 0 15px rgba(255, 215, 0, 1),
      0 0 30px rgba(255, 215, 0, 0.8),
      0 0 45px rgba(184, 134, 11, 0.6);
  }
`

const ancientShimmer = keyframes`
  0% {
    background-position: -200% 0;
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    background-position: 200% 0;
    opacity: 0.3;
  }
`

const candleFlicker = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
  75% { opacity: 0.9; }
`

// Sacred parchment container with authentic medieval appearance
const ParchmentContainer = styled.div<{ visible: boolean }>`
  min-height: 100vh;
  background: 
    /* Aged parchment base */
    linear-gradient(45deg, 
      #f4f1e8 0%, 
      #f7f4eb 25%, 
      #f2efe6 50%, 
      #f5f2e9 75%, 
      #f3f0e7 100%
    ),
    /* Ink stains and age spots */
    radial-gradient(circle at 20% 30%, rgba(101, 67, 33, 0.08) 0%, transparent 3%),
    radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.06) 0%, transparent 4%),
    radial-gradient(circle at 60% 20%, rgba(160, 82, 45, 0.04) 0%, transparent 2%),
    radial-gradient(circle at 30% 80%, rgba(101, 67, 33, 0.05) 0%, transparent 3%);
    
  /* Parchment texture */
  background-image: 
    /* Paper fiber texture */
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(139, 69, 19, 0.02) 1px,
      rgba(139, 69, 19, 0.02) 2px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 1px,
      rgba(139, 69, 19, 0.015) 1px,
      rgba(139, 69, 19, 0.015) 2px
    );
    
  padding: 4rem 2rem;
  position: relative;
  overflow-x: hidden;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 1.8s ease-in-out;
  
  /* Torn/worn edges */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      /* Left torn edge */
      linear-gradient(90deg, 
        rgba(139, 69, 19, 0.1) 0%,
        transparent 2%
      ),
      /* Right torn edge */
      linear-gradient(270deg, 
        rgba(139, 69, 19, 0.08) 0%,
        transparent 1.5%
      ),
      /* Top worn edge */
      linear-gradient(180deg, 
        rgba(101, 67, 33, 0.12) 0%,
        transparent 1%
      ),
      /* Bottom worn edge */
      linear-gradient(0deg, 
        rgba(101, 67, 33, 0.1) 0%,
        transparent 1%
      );
    pointer-events: none;
    z-index: 0;
  }
  
  /* Candlelight glow */
  &::after {
    content: '';
    position: fixed;
    top: 10%;
    right: 8%;
    width: 200px;
    height: 300px;
    background: 
      radial-gradient(ellipse 60% 80%, 
        rgba(255, 180, 80, 0.15) 0%,
        rgba(255, 140, 60, 0.08) 40%,
        transparent 70%
      );
    border-radius: 50%;
    animation: ${candleFlicker} 4s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }
`

const ScrollWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  animation: ${manuscriptUnfurl} 1.5s ease-out;
`

// Illuminated manuscript title - authentic medieval styling
const IlluminatedTitle = styled.h1`
  font-family: 'Uncial Antiqua', 'Luminari', 'Papyrus', serif;
  font-size: 4rem;
  font-weight: 400;
  text-align: center;
  margin: 0 0 2rem 0;
  color: #2d1810;
  position: relative;
  letter-spacing: 3px;
  
  /* Hand-lettered medieval appearance */
  text-shadow: 
    1px 1px 0px #8b4513,
    2px 2px 0px #654321,
    3px 3px 5px rgba(139, 69, 19, 0.3);
  
  /* Ornate drop cap */
  &::first-letter {
    font-size: 8rem;
    float: left;
    line-height: 6rem;
    padding: 0.5rem 1rem 0.5rem 0;
    margin-top: -0.5rem;
    color: #8b0000;
    /* Illuminated letter background */
    background: 
      radial-gradient(circle at center, 
        #d4af37 0%, 
        #b8860b 30%, 
        #8b4513 70%, 
        #654321 100%
      );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    border: 3px solid #8b4513;
    border-radius: 8px;
    box-shadow: 
      inset 0 0 10px rgba(212, 175, 55, 0.3),
      0 0 15px rgba(139, 69, 19, 0.5);
  }
  
  /* Medieval border decorations */
  &::before {
    content: '❦';
    position: absolute;
    left: -3rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2rem;
    color: #8b4513;
  }
  
  &::after {
    content: '❦';
    position: absolute;
    right: -3rem;
    top: 50%;
    transform: translateY(-50%) scaleX(-1);
    font-size: 2rem;
    color: #8b4513;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    
    &::first-letter {
      font-size: 5rem;
      line-height: 4rem;
    }
    
    &::before, &::after {
      display: none;
    }
  }
`

const SacredSubtitle = styled.p`
  font-family: 'Cinzel', serif;
  text-align: center;
  font-size: 1.4rem;
  color: #cdaa3d;
  margin: 0 0 3rem 0;
  font-style: italic;
  font-weight: 300;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
`

// Main manuscript page - authentic medieval scroll
const ManuscriptPage = styled.div`
  /* Parchment scroll appearance */
  background: 
    linear-gradient(145deg, 
      #faf8f3 0%,
      #f8f5f0 25%,
      #f6f3ee 50%,
      #f9f6f1 75%,
      #f7f4ef 100%
    );
  
  /* Medieval scroll borders */
  border: 8px solid #654321;
  border-radius: 0; /* Sharp medieval edges */
  box-shadow: 
    /* Scroll tube shadows */
    -15px 0 20px rgba(101, 67, 33, 0.3),
    15px 0 20px rgba(101, 67, 33, 0.3),
    /* Inner parchment depth */
    inset 0 0 40px rgba(139, 69, 19, 0.1),
    /* Outer manuscript shadow */
    0 10px 40px rgba(101, 67, 33, 0.4);
    
  padding: 4rem 3rem;
  margin: 3rem auto;
  max-width: 900px;
  position: relative;
  
  /* Scroll rod tops and bottoms */
  &::before, &::after {
    content: '';
    position: absolute;
    left: -12px;
    right: -12px;
    height: 8px;
    background: 
      linear-gradient(90deg, 
        #654321 0%, 
        #8b4513 20%, 
        #a0522d 50%, 
        #8b4513 80%, 
        #654321 100%
      );
    border-radius: 4px;
    box-shadow: 
      0 0 10px rgba(101, 67, 33, 0.5),
      inset 0 0 5px rgba(160, 82, 45, 0.3);
  }
  
  &::before {
    top: -4px;
  }
  
  &::after {
    bottom: -4px;
  }
  
  /* Ink blots and aging */
  background-image: 
    /* Random ink spots */
    radial-gradient(circle at 85% 15%, rgba(101, 67, 33, 0.04) 0%, transparent 1%),
    radial-gradient(circle at 15% 85%, rgba(139, 69, 19, 0.03) 0%, transparent 1.5%),
    radial-gradient(circle at 70% 90%, rgba(101, 67, 33, 0.02) 0%, transparent 0.8%),
    /* Writing guidelines (faint) */
    repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 25px,
      rgba(139, 69, 19, 0.03) 25px,
      rgba(139, 69, 19, 0.03) 26px,
      transparent 26px,
      transparent 51px
    );
`

// Knight's heraldic section with authentic medieval design
const KnightProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 4rem;
  padding: 3rem 2rem;
  
  /* Medieval illuminated border */
  border: 4px double #8b4513;
  border-radius: 0;
  background: 
    /* Parchment with gold leaf accents */
    linear-gradient(135deg, 
      rgba(212, 175, 55, 0.08) 0%,
      rgba(248, 243, 225, 0.95) 30%,
      rgba(250, 245, 230, 0.98) 70%,
      rgba(212, 175, 55, 0.1) 100%
    );
  position: relative;
  
  /* Corner illuminations */
  &::before, &::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    background: 
      radial-gradient(circle, 
        #d4af37 0%, 
        #b8860b 40%, 
        #8b4513 80%, 
        transparent 100%
      );
    border: 2px solid #654321;
  }
  
  &::before {
    top: -2px;
    left: -2px;
    border-radius: 0 0 20px 0;
  }
  
  &::after {
    bottom: -2px;
    right: -2px;
    border-radius: 20px 0 0 0;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`

// Medieval coat of arms shield
const CoatOfArms = styled.div`
  width: 120px;
  height: 140px;
  background: 
    /* Shield heraldic pattern */
    linear-gradient(180deg, 
      #d4af37 0%,
      #b8860b 20%,
      #8b4513 60%,
      #654321 100%
    );
  
  /* Classic heraldic shield shape */
  clip-path: polygon(
    50% 0%, 
    100% 0%, 
    100% 70%, 
    50% 100%, 
    0% 70%, 
    0% 0%
  );
  
  border: 4px solid #2d1810;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #2d1810;
  position: relative;
  margin: 0 auto 2rem auto;
  animation: ${grailLevitation} 6s ease-in-out infinite;
  
  /* Shield boss (center decoration) */
  &::before {
    content: '🏆';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2.5rem;
    text-shadow: 2px 2px 4px rgba(45, 24, 16, 0.6);
  }
  
  /* Heraldic border pattern */
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border: 2px dashed rgba(45, 24, 16, 0.4);
    clip-path: polygon(
      50% 0%, 
      92% 0%, 
      92% 65%, 
      50% 92%, 
      8% 65%, 
      8% 0%
    );
  }
  
  @media (max-width: 768px) {
    width: 100px;
    height: 120px;
    
    &::before {
      font-size: 2rem;
    }
  }
`

const KnightInfo = styled.div`
  h2 {
    font-family: 'Uncial Antiqua', 'Luminari', serif;
    font-size: 2.5rem;
    color: #2d1810;
    margin: 0 0 1rem 0;
    font-weight: 400;
    letter-spacing: 2px;
    text-transform: uppercase;
    
    /* Medieval calligraphy effect */
    text-shadow: 
      1px 1px 0px #8b4513,
      2px 2px 3px rgba(139, 69, 19, 0.4);
  }
  
  .wallet-address {
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    color: #654321;
    background: 
      /* Ink on parchment */
      linear-gradient(135deg, 
        rgba(101, 67, 33, 0.08) 0%,
        rgba(139, 69, 19, 0.06) 100%
      );
    padding: 0.8rem 1.2rem;
    border: 2px solid #8b4513;
    border-radius: 0; /* Medieval sharp corners */
    margin: 1rem 0;
    word-break: break-all;
    cursor: pointer;
    transition: all 0.3s ease;
    
    /* Medieval manuscript border */
    box-shadow: 
      inset 0 0 10px rgba(139, 69, 19, 0.1),
      0 2px 5px rgba(101, 67, 33, 0.2);
    
    &:hover {
      background: rgba(139, 69, 19, 0.12);
      transform: translateY(-1px);
      box-shadow: 
        inset 0 0 15px rgba(139, 69, 19, 0.15),
        0 4px 8px rgba(101, 67, 33, 0.3);
    }
  }
  
  .degen-story {
    font-family: 'Uncial Antiqua', serif;
    font-size: 1.2rem;
    color: #654321;
    font-style: italic;
    line-height: 1.8;
    margin-top: 1.5rem;
    padding: 1rem;
    
    /* Medieval scroll text box */
    background: rgba(212, 175, 55, 0.05);
    border: 1px solid rgba(139, 69, 19, 0.2);
    border-radius: 0;
    
    /* Ornate quotation marks */
    &::before {
      content: '❝';
      font-size: 2rem;
      color: #8b4513;
      vertical-align: top;
      line-height: 1;
      margin-right: 0.2rem;
    }
    
    &::after {
      content: '❞';
      font-size: 2rem;
      color: #8b4513;
      vertical-align: bottom;
      line-height: 1;
      margin-left: 0.2rem;
    }
  }
  
  @media (max-width: 768px) {
    h2 {
      font-size: 2rem;
    }
    
    .wallet-address {
      font-size: 1rem;
    }
    
    .degen-story {
      font-size: 1.1rem;
    }
  }
`

// Sacred statistics with illuminated borders
const SacredStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`

const StatCard = styled.div`
  /* Medieval illuminated manuscript panel */
  background: 
    /* Aged parchment with illuminated border */
    radial-gradient(ellipse at center, #faf5e4 0%, #f4e4bc 60%, #ddd2aa 100%);
  
  border: 3px solid #8b4513;
  
  /* Medieval decorative corners */
  border-image: 
    linear-gradient(45deg, #8b4513, #d4af37, #8b4513) 1;
  
  padding: 2rem 1.5rem;
  border-radius: 0; /* Medieval sharp corners */
  
  /* Illuminated manuscript shadow */
  box-shadow: 
    /* Inner illumination */
    inset 0 0 30px rgba(212, 175, 55, 0.3),
    inset 0 0 50px rgba(255, 255, 255, 0.1),
    /* Outer shadow (candlelight) */
    0 8px 25px rgba(139, 69, 19, 0.4),
    0 15px 35px rgba(101, 67, 33, 0.2);
  
  position: relative;
  overflow: hidden;
  text-align: center;
  
  /* Decorative corner illuminations */
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    width: 20px;
    height: 20px;
    background: 
      radial-gradient(circle, #d4af37 0%, transparent 70%);
    border-radius: 50%;
    opacity: 0.6;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    background: 
      radial-gradient(circle, #d4af37 0%, transparent 70%);
    border-radius: 50%;
    opacity: 0.6;
  }
  
  .icon {
    font-size: 2.8rem;
    color: #8b4513;
    margin-bottom: 1.2rem;
    /* Medieval heraldic icon glow */
    filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.4));
    text-shadow: 2px 2px 4px rgba(139, 69, 19, 0.3);
  }
  
  h3 {
    font-family: 'Uncial Antiqua', 'Luminari', serif;
    font-size: 1.4rem;
    color: #654321;
    margin: 0 0 1rem 0;
    font-weight: 400;
    text-transform: capitalize;
    
    /* Medieval calligraphy */
    text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.3);
    
    /* Ornate first letter */
    &::first-letter {
      font-size: 2.2rem;
      color: #8b4513;
      font-weight: 700;
      line-height: 1;
      margin-right: 2px;
      float: left;
      
      /* Drop cap shadow */
      text-shadow: 
        2px 2px 0px #d4af37,
        3px 3px 5px rgba(139, 69, 19, 0.5);
    }
  }
  
  .value {
    font-family: 'Cinzel Decorative', serif;
    font-size: 2.2rem;
    font-weight: 700;
    color: #8b4513;
    margin: 0.5rem 0;
    
    /* Medieval number styling */
    text-shadow: 
      2px 2px 0px #d4af37,
      3px 3px 6px rgba(139, 69, 19, 0.4);
    
    /* Medieval numerals glow */
    filter: drop-shadow(0 0 3px rgba(212, 175, 55, 0.5));
  }
  
  .description {
    font-family: 'Uncial Antiqua', serif;
    font-size: 0.95rem;
    color: #654321;
    font-style: italic;
    margin-top: 0.8rem;
    line-height: 1.6;
    opacity: 0.9;
  }
  
  /* Hover effect - manuscript page turn */
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    transform: translateY(-5px) rotateX(5deg);
    box-shadow: 
      inset 0 0 40px rgba(212, 175, 55, 0.4),
      inset 0 0 60px rgba(255, 255, 255, 0.15),
      0 15px 40px rgba(139, 69, 19, 0.5),
      0 25px 50px rgba(101, 67, 33, 0.3);
    
    border-color: #d4af37;
    
    .value {
      color: #d4af37;
      text-shadow: 
        2px 2px 0px #8b4513,
        3px 3px 8px rgba(212, 175, 55, 0.6);
    }
    
    .icon {
      color: #d4af37;
      filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.6));
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    
    .icon {
      font-size: 2.2rem;
    }
    
    h3 {
      font-size: 1.2rem;
      
      &::first-letter {
        font-size: 1.8rem;
      }
    }
    
    .value {
      font-size: 1.8rem;
    }
    
    .description {
      font-size: 0.85rem;
    }
  }
`

// Sacred referral shrine
const ReferralShrine = styled.div`
  background: 
    linear-gradient(145deg,
      rgba(139, 69, 19, 0.2) 0%,
      rgba(160, 82, 45, 0.15) 50%,
      rgba(139, 69, 19, 0.2) 100%
    );
  border: 4px double #8b4513;
  border-radius: 20px;
  padding: 3rem;
  margin: 3rem 0;
  position: relative;
  
  /* Sacred altar decoration */
  &::before {
    content: '⚜️ SACRED REFERRAL SHRINE ⚜️';
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(145deg, #f5f5dc, #ddd);
    padding: 0.5rem 1.5rem;
    border: 3px solid #8b4513;
    border-radius: 15px;
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    color: #8b4513;
    font-weight: 700;
    letter-spacing: 1px;
  }
  
  h3 {
    font-family: 'Cinzel', serif;
    font-size: 1.8rem;
    color: #8b4513;
    text-align: center;
    margin: 0 0 2rem 0;
    font-weight: 700;
  }
`

// Medieval knight action controls
const ActionButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin: 3rem 0;
  flex-wrap: wrap;
  padding: 1rem;
`

const MedievalButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  /* Medieval knight's banner button */
  font-family: 'Uncial Antiqua', 'Luminari', serif;
  padding: 1.2rem 2.5rem;
  border: none;
  border-radius: 0; /* Medieval sharp corners */
  
  background: ${props => props.variant === 'primary' 
    ? `
      /* Royal golden banner */
      linear-gradient(145deg, 
        #d4af37 0%, 
        #b8860b 30%, 
        #d4af37 60%, 
        #e6c547 100%
      ),
      /* Heraldic pattern */
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 2px,
        rgba(139, 69, 19, 0.1) 2px,
        rgba(139, 69, 19, 0.1) 4px
      )
    `
    : `
      /* Knight's steel banner */
      linear-gradient(145deg, 
        #f4f1e8 0%, 
        #e8e5dc 30%, 
        #f0ede4 60%, 
        #f7f4eb 100%
      ),
      /* Chainmail pattern */
      repeating-linear-gradient(
        60deg,
        transparent,
        transparent 1px,
        rgba(139, 69, 19, 0.08) 1px,
        rgba(139, 69, 19, 0.08) 2px
      )
    `
  };
  
  color: ${props => props.variant === 'primary' ? '#2a1810' : '#654321'};
  font-size: 1.1rem;
  font-weight: 400;
  cursor: pointer;
  position: relative;
  letter-spacing: 1px;
  text-transform: uppercase;
  
  /* Medieval banner border */
  border: 3px solid #8b4513;
  border-image: linear-gradient(45deg, #8b4513, #d4af37, #8b4513) 1;
  
  /* Medieval banner shadow */
  box-shadow: 
    /* Inner illumination */
    inset 0 0 20px rgba(212, 175, 55, 0.2),
    /* Outer shadow (candlelight) */
    0 6px 15px rgba(139, 69, 19, 0.3),
    0 10px 25px rgba(101, 67, 33, 0.2);
  
  /* Medieval banner transform */
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Medieval text styling */
  text-shadow: 
    1px 1px 2px rgba(139, 69, 19, 0.4),
    0 0 4px rgba(212, 175, 55, 0.3);
  
  &:hover {
    transform: translateY(-4px) rotateX(5deg);
    
    box-shadow: 
      inset 0 0 30px rgba(212, 175, 55, 0.3),
      0 10px 25px rgba(139, 69, 19, 0.4),
      0 15px 35px rgba(101, 67, 33, 0.3);
    
    border-color: #d4af37;
    
    color: ${props => props.variant === 'primary' ? '#1a0f08' : '#8b4513'};
    
    text-shadow: 
      2px 2px 3px rgba(139, 69, 19, 0.5),
      0 0 6px rgba(212, 175, 55, 0.4);
  }
  
  &:active {
    transform: translateY(-2px) rotateX(2deg);
    transition: all 0.1s ease;
  }
  
  /* Medieval banner flag effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%,
      rgba(212, 175, 55, 0.3) 50%,
      transparent 100%
    );
    transition: left 0.6s ease;
    z-index: 1;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  /* Medieval banner text overlay */
  & > * {
    position: relative;
    z-index: 2;
  }
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`

// Main component
const HolyGrailUserProfile: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [degenStory, setDegenStory] = useState('')
  
  const { publicKey, connected, disconnect } = useWallet()
  const referralCode = useReferral()
  const balance = useTokenBalance()
  const currentToken = useCurrentToken()
  const toast = useToast()
  const { openModal: openReferralModal } = useReferralLeaderboardModal()

  useEffect(() => {
    setVisible(true)
    if (publicKey) {
      setUsername(generateUsernameFromWallet(publicKey.toString()))
      setDegenStory(generateDegenStoryFromWallet(publicKey.toString()))
    }
  }, [publicKey])

  const copyReferralLink = () => {
    if (referralCode) {
      const referralUrl = `${window.location.origin}?code=${referralCode}`
      navigator.clipboard.writeText(referralUrl)
      toast({ 
        title: 'Sacred Link Copied!', 
        description: 'Referral link copied to scroll!' 
      })
    }
  }

  const copyWalletAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      toast({ 
        title: 'Address Copied!', 
        description: 'Wallet address copied to sacred scroll!' 
      })
    }
  }

  if (!connected || !publicKey) {
    return (
      <ParchmentContainer visible={true}>
        <ScrollWrapper>
          <ManuscriptPage>
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '2rem', color: '#8b4513', marginBottom: '1rem' }}>
                🏺 Sacred Entrance Required 🏺
              </h2>
              <p style={{ fontFamily: 'Cinzel, serif', fontSize: '1.2rem', color: '#654321', fontStyle: 'italic' }}>
                To access the Sacred Profile Chamber, you must first connect your mystical wallet and prove yourself worthy of the Holy Grail's blessing.
              </p>
              <MedievalButton variant="primary" style={{ marginTop: '2rem' }}>
                Connect Sacred Wallet
              </MedievalButton>
            </div>
          </ManuscriptPage>
        </ScrollWrapper>
      </ParchmentContainer>
    )
  }

  return (
    <ParchmentContainer visible={visible}>
      <ScrollWrapper>
        <IlluminatedTitle>⚜️ Sacred Profile Chamber ⚜️</IlluminatedTitle>
        <SacredSubtitle>
          ~ Chronicle of the Noble Knight's Journey Through the Mystical Realms ~
        </SacredSubtitle>

        <ManuscriptPage>
          <KnightProfile>
            <CoatOfArms>
              🏆
            </CoatOfArms>
            <KnightInfo>
              <h2>{username || 'Anonymous Knight'}</h2>
              <div className="wallet-address" onClick={copyWalletAddress}>
                {truncateString(publicKey.toString(), 8)}
              </div>
              <div className="degen-story">
                {degenStory || 'A mysterious knight whose legend is yet to be written...'}
              </div>
            </KnightInfo>
          </KnightProfile>

          <SacredStats>
            <StatCard>
              <div className="icon">💰</div>
              <h3>Sacred Treasury</h3>
              <div className="value">
                {balance && currentToken
                  ? `${balance.balance.toFixed(4)} ${currentToken.symbol || 'SOL'}`
                  : '0.0000 SOL'
                }
              </div>
              <div className="description">Gold coins in thy mystical purse</div>
            </StatCard>

            <StatCard>
              <div className="icon">🎲</div>
              <h3>Games Played</h3>
              <div className="value">42</div>
              <div className="description">Sacred rituals completed</div>
            </StatCard>

            <StatCard>
              <div className="icon">🏆</div>
              <h3>Total Winnings</h3>
              <div className="value">12.34 SOL</div>
              <div className="description">Blessed victories achieved</div>
            </StatCard>

            <StatCard>
              <div className="icon">⚔️</div>
              <h3>Knight Rank</h3>
              <div className="value">Squire</div>
              <div className="description">Current noble standing</div>
            </StatCard>
          </SacredStats>

          <ReferralShrine>
            <h3>Spread the Sacred Word</h3>
            <ReferralDashboard />
          </ReferralShrine>

          <ActionButtons>
            <MedievalButton variant="primary" onClick={copyReferralLink}>
              📜 Copy Sacred Link
            </MedievalButton>
            <MedievalButton variant="secondary" onClick={openReferralModal}>
              🏆 View Leaderboard
            </MedievalButton>
            <MedievalButton variant="secondary" onClick={disconnect}>
              🚪 Leave Chamber
            </MedievalButton>
          </ActionButtons>
        </ManuscriptPage>
      </ScrollWrapper>
    </ParchmentContainer>
  )
}

export default HolyGrailUserProfile