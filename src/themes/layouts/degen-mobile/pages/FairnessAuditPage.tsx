import React from 'react'
import styled from 'styled-components'
import { useColorScheme } from '../../../../themes/ColorSchemeContext'
import { usePageSEO } from '../../../../hooks/ui/useGameSEO'
import { spacing, media } from '../breakpoints'
import { UnifiedPageContainer, UnifiedPageTitle, UnifiedText } from '../components/UnifiedDesign'

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.98), rgba(15, 15, 35, 0.99));
  padding: ${spacing.lg};

  ${media.maxMobile} {
    padding: ${spacing.base};
  }
`;

export default function FairnessAuditPage() {
  const seoHelmet = usePageSEO("Fairness Audit", "Verify the fairness of our games and see detailed audit results.")
  const { currentColorScheme } = useColorScheme()

  return (
    <PageWrapper>
      {seoHelmet}
      <UnifiedPageContainer $colorScheme={currentColorScheme}>
        <UnifiedPageTitle $colorScheme={currentColorScheme}>
          🔍 Fairness Audit
        </UnifiedPageTitle>
        <UnifiedText $variant="lead" $colorScheme={currentColorScheme}>
          Verify game fairness with our provably fair system
        </UnifiedText>
        <UnifiedText $colorScheme={currentColorScheme}>
          All games use cryptographically secure randomness that can be independently verified. Audit results and verification tools coming soon!
        </UnifiedText>
      </UnifiedPageContainer>
    </PageWrapper>
  )
}