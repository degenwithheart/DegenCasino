import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
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

export default function WhitepaperPage() {
  const seoHelmet = usePageSEO("Whitepaper", "Read our technical whitepaper and learn about DegenCasino's technology.")
  const { currentColorScheme } = useColorScheme()

  return (
    <PageWrapper>
      {seoHelmet}
      <UnifiedPageContainer $colorScheme={currentColorScheme}>
        <UnifiedPageTitle $colorScheme={currentColorScheme}>
          📖 Whitepaper
        </UnifiedPageTitle>
        <UnifiedText $variant="lead" $colorScheme={currentColorScheme}>
          Technical documentation coming soon!
        </UnifiedText>
        <UnifiedText $colorScheme={currentColorScheme}>
          This page will contain detailed technical information about our platform, including blockchain integration, fairness algorithms, and tokenomics.
        </UnifiedText>
      </UnifiedPageContainer>
    </PageWrapper>
  )
}