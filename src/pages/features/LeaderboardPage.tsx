import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { LeaderboardsContent } from '../../sections/LeaderBoard/LeaderboardsModal'
import { PLATFORM_CREATOR_ADDRESS } from '../../constants'
import { useTheme } from '../../themes/ThemeContext'

const PageWrapper = styled.div<{ $theme?: any }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, ${({ $theme }) => $theme?.colors?.background || '#0a0a0a'} 0%, ${({ $theme }) => $theme?.colors?.surface || '#1a1a2e'} 50%, ${({ $theme }) => $theme?.colors?.border || '#16213e'} 100%);
  z-index: 9999;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 30% 30%, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}11 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}11 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`;

const Header = styled.header<{ $theme?: any }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: ${({ $theme }) => $theme?.colors?.surface || 'rgba(24, 24, 24, 0.95)'};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${({ $theme }) => $theme?.colors?.border || 'rgba(255, 215, 0, 0.2)'};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1<{ $theme?: any }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
  margin: 0;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  text-shadow: 0 0 16px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BackButton = styled.button<{ $theme?: any }>`
  background: ${({ $theme }) => $theme?.colors?.surface || 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${({ $theme }) => $theme?.colors?.border || 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  color: ${({ $theme }) => $theme?.colors?.text || '#fff'};
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ $theme }) => $theme?.colors?.surface || 'rgba(255, 255, 255, 0.2)'};
    border-color: ${({ $theme }) => $theme?.colors?.primary || 'rgba(255, 215, 0, 0.5)'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
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

const LeaderboardContainer = styled.div<{ $theme?: any }>`
  background: ${({ $theme }) => $theme?.colors?.surface || 'rgba(24, 24, 24, 0.95)'};
  border: 1px solid ${({ $theme }) => $theme?.colors?.border || 'rgba(255, 215, 0, 0.2)'};
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 800px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px ${({ $theme }) => $theme?.colors?.shadow || 'rgba(0, 0, 0, 0.3)'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, ${({ $theme }) => $theme?.colors?.secondary || '#ff6b35'});
  }

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    margin: 0.5rem;
    padding: 1rem;
  }
`;

export default function LeaderboardPage() {
  const navigate = useNavigate()

  return (
    <PageWrapper>
      <Header>
        <Title>🏆 Leaderboard</Title>
        <BackButton onClick={() => navigate(-1)} aria-label="Go back">
          ← Back
        </BackButton>
      </Header>

      <ContentWrapper>
        <LeaderboardContainer>
          <LeaderboardsContent creator={PLATFORM_CREATOR_ADDRESS.toBase58()} />
        </LeaderboardContainer>
      </ContentWrapper>
    </PageWrapper>
  )
}
