import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import TokenSelect from '../../sections/TokenSelect'
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
      radial-gradient(circle at 25% 25%, ${({ $theme }) => $theme?.colors?.primary || 'rgba(255, 215, 0, 0.03)'} 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, ${({ $theme }) => $theme?.colors?.secondary || 'rgba(162, 89, 255, 0.03)'} 0%, transparent 50%);
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

const TokenSelectContainer = styled.div<{ $theme?: any }>`
  background: ${({ $theme }) => $theme?.colors?.surface || 'rgba(24, 24, 24, 0.9)'};
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid ${({ $theme }) => $theme?.colors?.border || 'rgba(255, 215, 0, 0.2)'};
  padding: 1.5rem;
  box-shadow: 0 8px 32px ${({ $theme }) => $theme?.colors?.shadow || 'rgba(0, 0, 0, 0.3)'};
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 14px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
  }
`;

const Subtitle = styled.p<{ $theme?: any }>`
  color: ${({ $theme }) => $theme?.colors?.textSecondary || 'rgba(255, 255, 255, 0.7)'};
  text-align: center;
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;

export default function SelectTokenPage() {
  const navigate = useNavigate()
  const theme = useTheme()

  return (
    <PageWrapper $theme={theme}>
      <Header $theme={theme}>
        <Title $theme={theme}>🪙 Select Token</Title>
        <BackButton $theme={theme} onClick={() => navigate(-1)} aria-label="Go back">
          ← Back
        </BackButton>
      </Header>

      <ContentWrapper>
        <TokenSelectContainer $theme={theme}>
          <Subtitle $theme={theme}>
            Choose your preferred token for playing games and earning rewards
          </Subtitle>
          <TokenSelect />
        </TokenSelectContainer>
      </ContentWrapper>
    </PageWrapper>
  )
}
