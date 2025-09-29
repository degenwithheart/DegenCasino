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

export default function ChangelogPage() {
  const seoHelmet = usePageSEO("Changelog", "See what's new in DegenCasino - latest updates and features.")
  const { currentColorScheme } = useColorScheme()

  return (
    <PageWrapper>
      {seoHelmet}
      <UnifiedPageContainer $colorScheme={currentColorScheme}>
        <UnifiedPageTitle $colorScheme={currentColorScheme}>
          📄 Changelog
        </UnifiedPageTitle>
        <UnifiedText $variant="lead" $colorScheme={currentColorScheme}>
          What's new in DegenCasino
        </UnifiedText>
        <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
          <h3 style={{ color: '#ffd700', marginTop: '2rem' }}>v2.0.0 - Degen Mobile Theme</h3>
          <ul>
            <li>📱 New mobile-first design with TikTok/Instagram aesthetics</li>
            <li>✨ Enhanced user interface and animations</li>
            <li>🎨 Improved color schemes and visual effects</li>
            <li>🚀 Better performance and loading times</li>
          </ul>
        </div>
      </UnifiedPageContainer>
    </PageWrapper>
  )
}