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

export default function AboutMePage() {
  const seoHelmet = usePageSEO("About Me", "Learn about the creator and team behind DegenCasino.")
  const { currentColorScheme } = useColorScheme()

  return (
    <PageWrapper>
      {seoHelmet}
      <UnifiedPageContainer $colorScheme={currentColorScheme}>
        <UnifiedPageTitle $colorScheme={currentColorScheme}>
          👤 About Me
        </UnifiedPageTitle>
        <UnifiedText $variant="lead" $colorScheme={currentColorScheme}>
          Hi, I'm the creator of DegenCasino! 👋
        </UnifiedText>
        <UnifiedText $colorScheme={currentColorScheme}>
          Passionate about blockchain gaming, provably fair systems, and creating amazing user experiences. This casino is built with love for the crypto community!
        </UnifiedText>
      </UnifiedPageContainer>
    </PageWrapper>
  )
}