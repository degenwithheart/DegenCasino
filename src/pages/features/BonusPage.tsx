import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { BonusContent } from '../../components'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { useColorScheme } from '../../themes/ColorSchemeContext'
import { usePageSEO } from '../../hooks/ui/useGameSEO'

const PageWrapper = styled.div<{ $colorScheme?: any }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: linear-gradient(135deg, ${({ $colorScheme }) => $colorScheme?.colors?.background || '#0a0a0a'} 0%, ${({ $colorScheme }) => $colorScheme?.colors?.surface || '#1a1a2e'} 50%, ${({ $colorScheme }) => $colorScheme?.colors?.border || '#16213e'} 100%);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 20%, ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'}11 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'}11 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`;

const Header = styled.header<{ $colorScheme?: any }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(24, 24, 24, 0.95)'};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 215, 0, 0.2)'};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;

const Title = styled.h1<{ $colorScheme?: any }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
  margin: 0;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  text-shadow: 0 0 16px ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
  letter-spacing: 1px;
`;

const CloseButton = styled.button<{ $colorScheme?: any }>`
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || '#fff'};
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.2)'};
    border-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.5)'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 80px; /* Account for header height */
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 1rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 0.75rem;
    top: 70px; /* Smaller header on mobile */
  }
`;

export default function BonusPage() {
  // SEO for Bonus page
  const seoHelmet = usePageSEO(
    "Bonus", 
    "Claim your casino bonuses and rewards! Get free spins, deposit bonuses, and special promotions"
  )

  const navigate = useNavigate()
  const { mobile } = useIsCompact()
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    if (!mobile) {
      // If not mobile, redirect to home (desktop should use modal)
      navigate('/')
    }
  }, [mobile])

  return (
    <>
      {seoHelmet}
      <PageWrapper $colorScheme={currentColorScheme}>
        <Header $colorScheme={currentColorScheme}>
          <Title $colorScheme={currentColorScheme}>🎁 Bonus</Title>
          <CloseButton $colorScheme={currentColorScheme} onClick={() => navigate(-1)} aria-label="Close">
            ✕ Close
          </CloseButton>
        </Header>

        <ContentWrapper>
          <BonusContent />
        </ContentWrapper>
      </PageWrapper>
    </>
  )
}
