import React from 'react'
import styled, { keyframes } from 'styled-components'
import { GambaUi } from 'gamba-react-ui-v2'
import { SmartImage } from '../UI/SmartImage'

interface GameSplashScreenProps {
  gameName: string
  gameImage: string
  onStart: () => void
  visible: boolean
}

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`

const scaleIn = keyframes`
  from { 
    transform: scale(0.8) translateY(20px); 
    opacity: 0;
  }
  to { 
    transform: scale(1) translateY(0); 
    opacity: 1;
  }
`

const scaleOut = keyframes`
  from { 
    transform: scale(1) translateY(0); 
    opacity: 1;
  }
  to { 
    transform: scale(1.1) translateY(-20px); 
    opacity: 0;
  }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

// Styled Components
const SplashContent = styled.div<{ $visible: boolean; $exiting: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
  padding: 2rem;
  animation: ${props => 
    props.$exiting ? scaleOut : (props.$visible ? scaleIn : 'none')
  } 0.4s ease-in-out;
  
  @media (max-width: 600px) {
    max-width: 90vw;
    padding: 1.5rem;
  }
`

const GameIconContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 2rem;
  border-radius: 24px;
  background: linear-gradient(145deg, #201826, #110b14);
  padding: 8px;
  box-shadow: 
    0 8px 32px rgba(0,0,0,0.5),
    0 0 0 1px rgba(255,255,255,0.1),
    inset 0 1px 0 rgba(255,255,255,0.1);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    background: radial-gradient(circle at 30% 30%, rgba(255,215,0,0.3), transparent 70%);
    pointer-events: none;
    mix-blend-mode: overlay;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 26px;
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    animation: ${shimmer} 3s linear infinite;
    z-index: -1;
    opacity: 0.6;
  }
  
  @media (max-width: 600px) {
    width: 100px;
    height: 100px;
    margin-bottom: 1.5rem;
  }
`

const GameIcon = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 18px;
  background: #0d0d11;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`

const GameTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  background: linear-gradient(90deg, #ffe27a, #ff5ba5, #a259ff);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-size: 200% 100%;
  animation: ${shimmer} 3s linear infinite;
  text-shadow: 0 0 30px rgba(255,215,0,0.3);
  
  @media (max-width: 600px) {
    font-size: 2rem;
  }
`

const StartButton = styled.button`
  padding: 16px 48px;
  font-size: 1.2rem;
  font-weight: 700;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffae00, #ff0066);
  color: white;
  cursor: pointer;
  box-shadow: 
    0 8px 24px rgba(255, 0, 102, 0.4),
    0 0 0 1px rgba(255,255,255,0.1),
    inset 0 1px 0 rgba(255,255,255,0.2);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #ff0066, #ffae00);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 32px rgba(255, 0, 102, 0.6),
      0 0 0 1px rgba(255,255,255,0.2),
      inset 0 1px 0 rgba(255,255,255,0.3);
    animation: ${pulse} 2s ease-in-out infinite;
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  span {
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 600px) {
    padding: 14px 36px;
    font-size: 1.1rem;
  }
`

const WelcomeText = styled.p`
  font-size: 1.1rem;
  color: rgba(255,255,255,0.8);
  margin: 0 0 2rem 0;
  line-height: 1.5;
  max-width: 300px;
  
  @media (max-width: 600px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`

export function GameSplashScreen({ gameName, gameImage, onStart, visible }: GameSplashScreenProps) {
  const [isExiting, setIsExiting] = React.useState(false)

  const handleStart = () => {
    setIsExiting(true)
    // Delay the actual start to allow exit animation
    setTimeout(() => {
      onStart()
    }, 400)
  }

  // Debug logging
  console.log('GameSplashScreen render:', { visible, isExiting, gameName })

  if (!visible && !isExiting) return null

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(0,0,0,0.9)',
      backdropFilter: 'blur(8px)',
      zIndex: 70,
      color: 'white',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: 'rgba(24, 24, 31, 0.9)',
        borderRadius: '16px',
        border: '2px solid #ffd700',
        maxWidth: '400px',
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          margin: '0 auto 1rem',
          borderRadius: '16px',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <SmartImage 
            src={gameImage}
            alt={gameName}
            qualityVariants={{
              high: gameImage,
              balanced: gameImage.replace(/\.(png|jpg|jpeg|webp)$/i, '-md.$1'),
              data: gameImage.replace(/\.(png|jpg|jpeg|webp)$/i, '-sm.$1')
            }}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        
        <h1 style={{
          fontSize: '2rem',
          margin: '0 0 1rem 0',
          color: '#ffd700',
        }}>
          {gameName}
        </h1>
        
        <p style={{
          margin: '0 0 2rem 0',
          color: '#ccc',
        }}>
          Ready to play? Click start when you're ready!
        </p>
        
        <button 
          onClick={handleStart}
          style={{
            padding: '12px 24px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #ffae00, #ff0066)',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Start Game
        </button>
      </div>
    </div>
  )
}