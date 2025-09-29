import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useColorScheme } from '../../../../themes/ColorSchemeContext'
import { usePageSEO } from '../../../../hooks/ui/useGameSEO'
import { spacing, animations, media } from '../breakpoints'
import { UnifiedPageContainer, UnifiedPageTitle, UnifiedText } from '../components/UnifiedDesign'

const PageWrapper = styled.div<{ $colorScheme?: any }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: linear-gradient(135deg,
    rgba(24, 24, 24, 0.98),
    rgba(15, 15, 35, 0.99),
    rgba(10, 10, 25, 0.98)
  );
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
      radial-gradient(circle at 25% 25%, #66666615 0%, transparent 60%),
      radial-gradient(circle at 75% 75%, #33333315 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }
`;

const Header = styled.header<{ $colorScheme?: any }>`
  position: sticky;
  top: 0;
  z-index: 10;
  background: linear-gradient(135deg,
    rgba(24, 24, 24, 0.95),
    rgba(15, 15, 35, 0.98)
  );
  backdrop-filter: blur(20px);
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding: ${spacing.base} ${spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #666, #999, #666);
  }

  ${media.maxMobile} {
    padding: ${spacing.sm} ${spacing.base};
  }
`;

const Title = styled.h1<{ $colorScheme?: any }>`
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;

  ${media.maxMobile} {
    font-size: 1.5rem;
  }
`;

const CloseButton = styled.button<{ $colorScheme?: any }>`
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: #fff;
  padding: ${spacing.sm} ${spacing.base};
  font-weight: 600;
  cursor: pointer;
  transition: all ${animations.duration.fast} ${animations.easing.easeOut};

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }

  ${media.maxMobile} {
    padding: ${spacing.xs} ${spacing.sm};
    font-size: 0.8rem;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  padding: ${spacing.lg};
  overflow-y: auto;
  min-height: calc(100vh - 80px);

  ${media.maxMobile} {
    padding: ${spacing.base};
    min-height: calc(100vh - 70px);
  }
`;

export default function TermsPage() {
  const seoHelmet = usePageSEO(
    "Terms of Service", 
    "Read our terms of service and user agreement for using DegenCasino."
  )

  const navigate = useNavigate()
  const { currentColorScheme } = useColorScheme()

  return (
    <PageWrapper $colorScheme={currentColorScheme}>
      {seoHelmet}
      <Header $colorScheme={currentColorScheme}>
        <Title $colorScheme={currentColorScheme}>📄 Terms</Title>
        <CloseButton $colorScheme={currentColorScheme} onClick={() => navigate(-1)}>
          ✕ Close
        </CloseButton>
      </Header>

      <ContentWrapper>
        <UnifiedPageContainer $colorScheme={currentColorScheme}>
          <UnifiedPageTitle $colorScheme={currentColorScheme}>
            📄 Terms of Service
          </UnifiedPageTitle>
          <UnifiedText $variant="lead" $colorScheme={currentColorScheme}>
            Welcome to DegenCasino! Please read these terms carefully.
          </UnifiedText>
          
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            <h3 style={{ color: '#ffd700', marginTop: '2rem' }}>1. Acceptance of Terms</h3>
            <p>By accessing and using this casino, you accept and agree to be bound by the terms and provision of this agreement.</p>

            <h3 style={{ color: '#ffd700', marginTop: '2rem' }}>2. Age Requirement</h3>
            <p>You must be at least 18 years old to use this service. By using this service, you represent that you meet this requirement.</p>

            <h3 style={{ color: '#ffd700', marginTop: '2rem' }}>3. Responsible Gaming</h3>
            <p>Please gamble responsibly. Never bet more than you can afford to lose. This is entertainment, not an investment.</p>

            <h3 style={{ color: '#ffd700', marginTop: '2rem' }}>4. Fair Play</h3>
            <p>All games use provably fair algorithms. Game outcomes are determined by cryptographic randomness that cannot be manipulated.</p>

            <h3 style={{ color: '#ffd700', marginTop: '2rem' }}>5. Privacy</h3>
            <p>We respect your privacy. We only collect necessary data to provide our services and comply with regulations.</p>

            <h3 style={{ color: '#ffd700', marginTop: '2rem' }}>6. Disclaimers</h3>
            <p>This service is provided "as is" without warranties. Cryptocurrency gambling involves risks, and you should only participate if you understand and accept these risks.</p>

            <div style={{ 
              background: 'rgba(255, 215, 0, 0.1)', 
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginTop: '2rem',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, fontWeight: '600', color: '#ffd700' }}>
                🎲 Remember: The house always has an edge. Play for fun, not profit! 🎲
              </p>
            </div>
          </div>
        </UnifiedPageContainer>
      </ContentWrapper>
    </PageWrapper>
  )
}