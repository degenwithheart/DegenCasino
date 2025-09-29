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

export default function DGHRTPresalePage() {
  const seoHelmet = usePageSEO("DGHRT Presale", "Participate in the DGHRT token presale.")
  const { currentColorScheme } = useColorScheme()

  return (
    <PageWrapper>
      {seoHelmet}
      <UnifiedPageContainer $colorScheme={currentColorScheme}>
        <UnifiedPageTitle $colorScheme={currentColorScheme}>
          🚀 DGHRT Presale
        </UnifiedPageTitle>
        <UnifiedText $variant="lead" $colorScheme={currentColorScheme}>
          Join the presale for early access to DGHRT tokens
        </UnifiedText>
        <UnifiedText $colorScheme={currentColorScheme}>
          Presale details and participation information coming soon!
        </UnifiedText>
      </UnifiedPageContainer>
    </PageWrapper>
  )
}