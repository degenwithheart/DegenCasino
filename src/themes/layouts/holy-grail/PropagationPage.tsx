// Holy Grail PropagationPage.tsx - The Royal Message Propagation Chamber
// Medieval messaging interface with heraldic broadcast systems

import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useColorScheme } from '../../../themes/ColorSchemeContext'

// Royal propagation animations
const messageFlare = keyframes`
  0%, 100% {
    text-shadow: 
      0 0 15px rgba(212, 175, 55, 0.6),
      0 0 30px rgba(255, 215, 0, 0.4),
      0 0 45px rgba(212, 175, 55, 0.3);
  }
  50% {
    text-shadow: 
      0 0 25px rgba(212, 175, 55, 0.8),
      0 0 50px rgba(255, 215, 0, 0.6),
      0 0 75px rgba(212, 175, 55, 0.5);
  }
`

const heraldWave = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-10px) scale(1.05);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-5px) scale(1.1);
    opacity: 1;
  }
  75% {
    transform: translateY(-3px) scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
`

const signalPulse = keyframes`
  0% {
    background-position: -100% center;
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    background-position: 100% center;
    opacity: 0.3;
  }
`

// Royal propagation chamber
const PropagationChamber = styled.div<{ visible: boolean }>`
  min-height: 100vh;
  background: 
    /* Royal messaging parchment */
    linear-gradient(45deg, 
      #f4f1e8 0%, 
      #f7f4eb 25%, 
      #f2efe6 50%, 
      #f5f2e9 75%, 
      #f3f0e7 100%
    ),
    /* Heraldic message patterns */
    radial-gradient(circle at 25% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 6%),
    radial-gradient(circle at 75% 70%, rgba(139, 69, 19, 0.08) 0%, transparent 5%),
    radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.06) 0%, transparent 4%);
    
  /* Noble signal texture */
  background-image: 
    /* Royal wave pattern */
    repeating-linear-gradient(
      45deg,
      transparent 0,
      transparent 25px,
      rgba(212, 175, 55, 0.02) 25px,
      rgba(212, 175, 55, 0.02) 27px
    );
    
  padding: 4rem 2rem;
  position: relative;
  overflow-x: hidden;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 2s ease-in-out;
  
  /* Royal messaging atmosphere */
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
    animation: ${messageFlare} 8s ease-in-out infinite;
  }
`

// Propagation manuscript scroll
const PropagationScroll = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  /* Royal propagation scroll */
  background: 
    linear-gradient(135deg, 
      #faf8f0 0%, 
      #f6f3ea 30%, 
      #f4f1e8 70%, 
      #f2efe6 100%
    );
  
  border: 4px solid #8b4513;
  border-radius: 0;
  
  /* Propagation chamber shadow */
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

// Propagation chamber page
const PropagationPage = styled.div`
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

// Royal propagation title
const PropagationTitle = styled.h1`
  font-family: 'Uncial Antiqua', 'Luminari', serif;
  font-size: 4.5rem;
  color: #8b4513;
  text-align: center;
  margin: 0 0 2rem 0;
  font-weight: 400;
  letter-spacing: 3px;
  line-height: 1.2;
  position: relative;
  
  /* Royal propagation calligraphy */
  text-shadow: 
    2px 2px 0px #d4af37,
    4px 4px 8px rgba(139, 69, 19, 0.4),
    0 0 20px rgba(212, 175, 55, 0.3);
  
  /* Royal herald symbol */
  &::before {
    content: '📯';
    font-size: 3.5rem;
    display: block;
    margin: 0 auto 1rem auto;
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
    animation: ${heraldWave} 6s ease-in-out infinite;
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

// Propagation description
const PropagationDescription = styled.div`
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

// Signal status banner
const SignalBanner = styled.div`
  background: 
    linear-gradient(135deg, 
      rgba(212, 175, 55, 0.15) 0%, 
      rgba(139, 69, 19, 0.08) 100%
    );
  border: 3px solid #d4af37;
  border-radius: 0;
  padding: 3rem;
  margin: 4rem auto;
  max-width: 600px;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  /* Royal signal effects */
  box-shadow: 
    0 10px 40px rgba(212, 175, 55, 0.3),
    inset 0 0 30px rgba(212, 175, 55, 0.2);
  
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
        rgba(212, 175, 55, 0.3) 50%,
        transparent 100%
      );
    animation: ${signalPulse} 4s ease-in-out infinite;
  }
  
  .signal-title {
    font-family: 'Uncial Antiqua', serif;
    font-size: 2.5rem;
    color: #8b4513;
    margin: 0 0 1rem 0;
    font-weight: 700;
    
    /* Royal banner styling */
    text-shadow: 
      2px 2px 0px #d4af37,
      4px 4px 8px rgba(139, 69, 19, 0.4);
  }
  
  .signal-status {
    font-family: 'Uncial Antiqua', serif;
    font-size: 3rem;
    color: #228b22;
    margin: 1rem 0;
    font-weight: 700;
    
    /* Status highlighting */
    text-shadow: 
      2px 2px 0px #006400,
      4px 4px 8px rgba(34, 139, 34, 0.6);
  }
  
  .signal-description {
    font-family: 'Uncial Antiqua', serif;
    font-size: 1.2rem;
    color: #654321;
    line-height: 1.6;
    
    /* Noble description styling */
    text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
    
    .signal-title {
      font-size: 2rem;
    }
    
    .signal-status {
      font-size: 2.5rem;
    }
    
    .signal-description {
      font-size: 1.1rem;
    }
  }
`

// Propagation features
const PropagationFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`

// Feature card
const FeatureCard = styled.div`
  background: 
    linear-gradient(135deg, 
      rgba(250, 248, 240, 0.8) 0%, 
      rgba(246, 243, 234, 0.9) 100%
    );
  border: 3px solid #8b4513;
  border-radius: 0;
  padding: 2.5rem;
  text-align: center;
  
  /* Heraldic feature effects */
  box-shadow: 
    0 10px 40px rgba(139, 69, 19, 0.3),
    0 20px 60px rgba(101, 67, 33, 0.2),
    inset 0 0 30px rgba(212, 175, 55, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    border-color: #d4af37;
  }
  
  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    display: block;
    filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.4));
  }
  
  .feature-title {
    font-family: 'Uncial Antiqua', serif;
    font-size: 1.5rem;
    color: #8b4513;
    margin: 0 0 1rem 0;
    font-weight: 600;
    
    /* Noble feature styling */
    text-shadow: 
      1px 1px 0px #d4af37,
      2px 2px 4px rgba(139, 69, 19, 0.3);
  }
  
  .feature-description {
    font-family: 'Uncial Antiqua', serif;
    font-size: 1.1rem;
    color: #654321;
    line-height: 1.6;
    
    /* Noble description styling */
    text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
    
    .feature-icon {
      font-size: 2.5rem;
    }
    
    .feature-title {
      font-size: 1.3rem;
    }
    
    .feature-description {
      font-size: 1rem;
    }
  }
`

// Message form
const RoyalMessageForm = styled.div`
  background: 
    linear-gradient(135deg, 
      rgba(250, 248, 240, 0.8) 0%, 
      rgba(246, 243, 234, 0.9) 100%
    );
  border: 3px solid #8b4513;
  border-radius: 0;
  padding: 3rem;
  margin: 4rem auto;
  max-width: 800px;
  
  /* Royal form effects */
  box-shadow: 
    0 10px 40px rgba(139, 69, 19, 0.3),
    inset 0 0 30px rgba(212, 175, 55, 0.1);
  
  .form-title {
    font-family: 'Uncial Antiqua', serif;
    font-size: 2rem;
    color: #8b4513;
    text-align: center;
    margin: 0 0 2rem 0;
    font-weight: 700;
    
    /* Royal form styling */
    text-shadow: 
      2px 2px 0px #d4af37,
      4px 4px 8px rgba(139, 69, 19, 0.4);
  }
  
  .form-field {
    margin: 1.5rem 0;
    
    label {
      font-family: 'Uncial Antiqua', serif;
      font-size: 1.2rem;
      color: #654321;
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    input, textarea {
      font-family: 'Uncial Antiqua', serif;
      font-size: 1.1rem;
      width: 100%;
      padding: 1rem;
      border: 2px solid #8b4513;
      border-radius: 0;
      background: rgba(250, 248, 240, 0.8);
      color: #654321;
      
      &:focus {
        outline: none;
        border-color: #d4af37;
        box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
      }
    }
    
    textarea {
      min-height: 120px;
      resize: vertical;
    }
  }
  
  .form-button {
    font-family: 'Uncial Antiqua', serif;
    font-size: 1.3rem;
    padding: 1rem 2rem;
    background: 
      linear-gradient(135deg, 
        rgba(212, 175, 55, 0.2) 0%, 
        rgba(139, 69, 19, 0.1) 100%
      );
    color: #8b4513;
    border: 3px solid #d4af37;
    border-radius: 0;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 700;
    display: block;
    margin: 2rem auto 0;
    
    /* Royal button styling */
    text-shadow: 
      1px 1px 0px #d4af37,
      2px 2px 4px rgba(139, 69, 19, 0.3);
    box-shadow: 
      0 8px 32px rgba(212, 175, 55, 0.3),
      inset 0 0 20px rgba(212, 175, 55, 0.1);
    
    &:hover {
      background: 
        linear-gradient(135deg, 
          rgba(212, 175, 55, 0.3) 0%, 
          rgba(139, 69, 19, 0.2) 100%
        );
      transform: translateY(-2px);
    }
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
    
    .form-title {
      font-size: 1.7rem;
    }
    
    .form-field {
      label {
        font-size: 1.1rem;
      }
      
      input, textarea {
        font-size: 1rem;
      }
    }
    
    .form-button {
      font-size: 1.2rem;
    }
  }
`

// Main component
const HolyGrailPropagationPage: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [recipient, setRecipient] = useState('')
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  const features = [
    {
      icon: '📡',
      title: 'Real-time Broadcasting',
      description: 'Send messages instantly across the kingdom with our advanced heraldic signal network.'
    },
    {
      icon: '🛡️',
      title: 'Secure Encryption',
      description: 'All royal messages are protected with noble-grade encryption for maximum security.'
    },
    {
      icon: '🌍',
      title: 'Global Reach',
      description: 'Connect with knights and nobles across all realms and territories worldwide.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Messages propagate at the speed of lightning through our optimized network infrastructure.'
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle message propagation
    console.log('Broadcasting message:', { recipient, message })
  }

  return (
    <PropagationChamber visible={visible}>
      <PropagationScroll>
        <PropagationPage>
          <PropagationTitle>Royal Message Propagation</PropagationTitle>
          
          <PropagationDescription>
            Broadcast your royal messages across the kingdom with our advanced heraldic signal network. 
            Connect with knights, nobles, and allies in real-time through secure, encrypted communication channels.
          </PropagationDescription>
          
          <SignalBanner>
            <div className="signal-title">Network Status</div>
            <div className="signal-status">ONLINE</div>
            <div className="signal-description">
              All heraldic towers operational<br/>
              Signal strength: 100% • Latency: 12ms
            </div>
          </SignalBanner>
          
          <PropagationFeatures>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <span className="feature-icon">{feature.icon}</span>
                <div className="feature-title">{feature.title}</div>
                <div className="feature-description">{feature.description}</div>
              </FeatureCard>
            ))}
          </PropagationFeatures>
          
          <RoyalMessageForm>
            <div className="form-title">Send Royal Message</div>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="recipient">Recipient</label>
                <input
                  type="text"
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter noble's address or realm..."
                />
              </div>
              <div className="form-field">
                <label htmlFor="message">Royal Message</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Compose your royal decree..."
                />
              </div>
              <button type="submit" className="form-button">
                Broadcast Message
              </button>
            </form>
          </RoyalMessageForm>
        </PropagationPage>
      </PropagationScroll>
    </PropagationChamber>
  )
}

export default HolyGrailPropagationPage