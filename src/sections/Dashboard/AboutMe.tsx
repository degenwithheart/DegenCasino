import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { FOOTER_LINKS } from '../../constants'

// Casino animations
const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #ffd70044;
  }
  100% { 
    box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88;
    border-color: #ffd700aa;
  }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`;

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const SIDEBAR_WIDTH = 80;
interface ContainerProps {
  $compact?: boolean;
  visible?: boolean;
}
const Container = styled.div<ContainerProps>`
  max-width: none; /* Let main handle max-width */
  padding: ${({ $compact }) => ($compact ? '1rem' : '2rem')};
  margin: 2rem 0; /* Only vertical margins */
  border-radius: 24px;
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 215, 0, 0.2);
  color: white;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => (visible ? 'translateY(0)' : 'translateY(20px)')};
  transition: opacity 1s ease, transform 1s ease;
  position: relative;

  @media (max-width: 900px) {
    margin: 1rem 0;
    padding: 1.5rem 1rem;
  }

  @media (max-width: 700px) {
    margin: 1rem 0;
    border-radius: 16px;
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    margin: 0.5rem 0;
    padding: 1rem 0.75rem;
    border-radius: 12px;
  }

  @media (max-width: 400px) {
    margin: 0.25rem 0;
    padding: 0.75rem 0.5rem;
    border-radius: 8px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(162, 89, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
    border-radius: 24px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    animation: ${moveGradient} 4s linear infinite;
    border-radius: 24px 24px 0 0;
    z-index: 1;
  }
`

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2.5rem;
  position: relative;

  &::before {
    content: '👨‍💻';
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 2rem;
    animation: ${sparkle} 3s infinite;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    
    &::before {
      top: -5px;
      right: -5px;
      font-size: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    &::before {
      font-size: 1.25rem;
    }
  }
`;

const ProfileImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: 0 0 24px rgba(255, 215, 0, 0.6);
  border: 3px solid rgba(255, 215, 0, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05) rotate(2deg);
    box-shadow: 0 0 32px rgba(255, 215, 0, 0.8);
    border-color: rgba(255, 215, 0, 0.8);
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
    border-radius: 14px;
    border-width: 2px;
  }

  @media (max-width: 400px) {
    width: 80px;
    height: 80px;
    border-radius: 12px;
  }
`;

const TextInfo = styled.div`
  flex: 1;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #ffd700;
    text-shadow: 0 0 16px #ffd700, 0 0 32px #a259ff;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    letter-spacing: 2px;
  }

  p {
    font-style: italic;
    color: #ccc;
    font-size: 1.1rem;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
      letter-spacing: 1.5px;
    }
    p {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 1.75rem;
      letter-spacing: 1px;
    }
    p {
      font-size: 0.95rem;
    }
  }

  @media (max-width: 400px) {
    h1 {
      font-size: 1.5rem;
      letter-spacing: 0.5px;
    }
    p {
      font-size: 0.9rem;
    }
  }
`;

const SectionHeading = styled.h2`
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 0 0 8px #ffd700;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 1px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #ffd700, #a259ff, transparent);
    border-radius: 1px;
    animation: ${moveGradient} 3s linear infinite;
    background-size: 200% 100%;
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-top: 1.5rem;
  }

  @media (max-width: 400px) {
    font-size: 1.1rem;
    margin-top: 1.25rem;
  }
`;

const Content = styled.div`
  line-height: 1.6;
  font-size: 1rem;
  margin-top: 1rem;

  p,
  ul {
    margin-bottom: 1.2rem;
  }

  a {
    color: #ffd700;
    text-decoration: none;
    transition: all 0.3s ease;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid transparent;

    &:hover {
      color: #fff;
      background: rgba(255, 215, 0, 0.1);
      border: 1px solid rgba(255, 215, 0, 0.3);
      box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
      text-shadow: 0 0 8px #ffd700;
    }
  }

  strong {
    font-weight: 700;
    color: #ffd700;
  }

  em {
    font-style: italic;
    color: #a259ff;
  }

  @media (max-width: 768px) {
    font-size: 0.97rem;
    line-height: 1.5;
    
    p, ul {
      margin-bottom: 1rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    line-height: 1.4;
    margin-top: 0.75rem;
    
    p, ul {
      margin-bottom: 0.8rem;
    }
  }

  @media (max-width: 400px) {
    font-size: 0.9rem;
    
    p, ul {
      margin-bottom: 0.7rem;
    }
  }
`

const AboutMe: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  const githubLink = FOOTER_LINKS.find((link) =>
    link.title?.toLowerCase().includes('github')
  )

  return (
    <Container visible={visible}>
      <HeaderSection>
        <ProfileImage src="/pfp.png" alt="Degen Serenade PFP" />
        <TextInfo>
          <h1>Degen Serenade</h1>
          <p>Heart on-chain, soul in code. Updated July 2025</p>
        </TextInfo>
      </HeaderSection>

      <Content>
        <SectionHeading>Who is Degen Serenade?</SectionHeading>
        <p>
          I’m <strong>Stuart</strong> — a romantic builder, alpha in code, and full-time decentralization dreamer.
        </p>
        <p>
          I specialize in building on <strong>Solana</strong> with a passion for DeFi, on-chain apps, and crafting user-trusted protocols.
        </p>

        <SectionHeading>Vision & Mission</SectionHeading>
        <p>
          Creator of this casino platform and the $DGHRT token, my mission is simple: fuse secure blockchain tech with fun and fair entertainment.
        </p>
        <p>
          I aim to create systems that are verifiably fair, non-custodial, and community-centric.
        </p>

        <SectionHeading>Life On & Off the Chain</SectionHeading>
        <p>
          By day, I chase AI ghosts. By night, I dance in AR/VR dreams. I'm a full-stack storm chaser, backend thumper, frontend dreamweaver, and DevOps alchemist.
        </p>
        <p>
          Off-duty? I'm deep in memecoins, building for the thrill. Building is my love language.
        </p>

        <SectionHeading>Connect & Collaborate</SectionHeading>
        <p>Want to vibe, collab, or dive deep into smart contract spelunking? Let’s connect:</p>

        {githubLink && (
          <p>
            <strong>{githubLink.title}:</strong>{' '}
            <a href={githubLink.href} rel="noopener noreferrer">
              {githubLink.href?.replace(/^https?:\/\//, '')}
            </a>
          </p>
        )}

        <p style={{ fontStyle: 'italic', marginTop: '2rem' }}>
          Thank you for being here. Let’s build something unforgettable. 🚀
        </p>
      </Content>
    </Container>
  )
}

export default AboutMe
