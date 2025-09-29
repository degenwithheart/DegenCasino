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

export default function PropagationPage() {
  const seoHelmet = usePageSEO("Propagation", "Network propagation and technical information.")
  const { currentColorScheme } = useColorScheme()

  return (
    <PageWrapper>
      {seoHelmet}
      <UnifiedPageContainer $colorScheme={currentColorScheme}>
        <UnifiedPageTitle $colorScheme={currentColorScheme}>
          🌐 Propagation
        </UnifiedPageTitle>
        <UnifiedText $variant="lead" $colorScheme={currentColorScheme}>
          Network propagation and system status
        </UnifiedText>
        <UnifiedText $colorScheme={currentColorScheme}>
          Real-time network monitoring and propagation statistics coming soon!
        </UnifiedText>
      </UnifiedPageContainer>
    </PageWrapper>
  )
}