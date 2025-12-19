import React from 'react'
import { useColorScheme } from '../../themes/ColorSchemeContext'
import { usePageSEO } from '../../hooks/ui/useGameSEO'
import {
  UnifiedPageContainer,
  UnifiedPageTitle,
  UnifiedSubtitle,
  UnifiedSection,
  UnifiedSectionTitle,
  UnifiedContent
} from '../../components/UI/UnifiedDesign'
import styled from 'styled-components'

const GambleAwarenessContentWrapper = styled(UnifiedContent)`
  p {
    margin-bottom: 1em;
    line-height: 1.6;
  }

  ul {
    margin-bottom: 1em;
    padding-left: 1.5em;
  }

  li {
    margin-bottom: 0.5em;
  }

  strong {
    font-weight: 700;
  }
`

const GambleAwarenessPage: React.FC = () => {
  const seoHelmet = usePageSEO(
    "Responsible Gaming & Gamble Awareness | DegenHeart Casino",
    "DegenHeart Casino is committed to responsible gaming. Learn about understanding risks, staying in control, and finding support for problem gambling."
  )

  const { currentColorScheme } = useColorScheme()

  return (
    <>
      {seoHelmet}

      {/* JSON-LD for Organization */}
      <script type="application/ld+json">
        {`{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "DegenHeart Casino",
          "url": "https://degenheart.casino/gamble-awareness",
          "logo": "https://degenheart.casino/png/images/logo.png",
          "description": "Information and resources for responsible gaming at DegenHeart Casino."
        }`}
      </script>

      <UnifiedPageContainer $colorScheme={currentColorScheme}>
        <UnifiedSection $colorScheme={currentColorScheme}>
          <UnifiedPageTitle $colorScheme={currentColorScheme}>Responsible Gaming & Gamble Awareness</UnifiedPageTitle>
          <UnifiedSubtitle $colorScheme={currentColorScheme}>
            Your well-being is our priority. Enjoy DegenHeart Casino responsibly.
          </UnifiedSubtitle>
        </UnifiedSection>

        <UnifiedSection $colorScheme={currentColorScheme}>
          <GambleAwarenessContentWrapper $colorScheme={currentColorScheme}>
            <UnifiedSectionTitle $colorScheme={currentColorScheme}>Our Commitment to Responsible Gaming</UnifiedSectionTitle>
            <p>
              At <strong>DegenHeart Casino</strong>, we are committed to providing a safe and enjoyable gaming environment. While our platform is accountless and fully on-chain, gambling should always remain a form of entertainment, not a source of stress or financial strain.
            </p>
            <p>
              We encourage all players to understand the risks involved and make conscious decisions about how much to wager.
            </p>

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>Recognizing Problem Gambling</UnifiedSectionTitle>
            <p>
              It's important to recognize the signs of problem gambling. Consider the following questions:
            </p>
            <ul>
              <li>Do you spend more money or time gambling than you can afford?</li>
              <li>Do you feel anxious, guilty, or depressed because of gambling?</li>
              <li>Has gambling negatively affected your relationships, work, or personal life?</li>
              <li>Do you feel a need to chase losses or gamble secretly?</li>
            </ul>
            <p>
              If any of these resonate, we strongly encourage seeking professional help.
            </p>

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>Guidelines for Safer Play</UnifiedSectionTitle>
            <ul>
              <li>Decide beforehand how much SOLANA or USDC you are willing to risk in a session and stick to it yourself.</li>
              <li>Take regular breaks to avoid prolonged sessions.</li>
              <li>Track your own spending and wins using your wallet history or blockchain explorers.</li>
              <li>Focus on enjoyment and entertainment, not profits.</li>
              <li>Reflect on your playing habits and adjust accordingly.</li>
            </ul>

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>On-Chain Self-Monitoring</UnifiedSectionTitle>
            <p>
              Since DegenHeart Casino is fully accountless, you can take full control of your activity by monitoring it on-chain:
            </p>
            <ul>
              <li>Check your wallet balance before and after playing to stay aware of spending.</li>
              <li>Track transaction history via <a href="https://explorer.solana.com" target="_blank" rel="noopener noreferrer">Solana Explorer</a> or other Solana-compatible blockchain explorers.</li>
              <li>Optionally, use personal logs, spreadsheets, or reminders to note session frequency and expenditure.</li>
              <li>Use self-reflection to evaluate your habits and adjust your playing accordingly.</li>
            </ul>
            <p>
              This approach ensures responsible play while remaining fully aligned with our decentralized, accountless ethos.
            </p>

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>Where to Find Help</UnifiedSectionTitle>
            <p>
              For support with problem gambling, these organizations provide confidential advice and resources:
            </p>
            <ul>
              <li><a href="https://www.gamcare.org.uk/" target="_blank" rel="noopener noreferrer">GamCare (UK)</a></li>
              <li><a href="https://www.gamblingtherapy.org/" target="_blank" rel="noopener noreferrer">Gambling Therapy (International)</a></li>
              <li><a href="https://www.ncpgambling.org/" target="_blank" rel="noopener noreferrer">National Council on Problem Gambling (USA)</a></li>
              <li><a href="https://www.gamblersanonymous.org/ga/" target="_blank" rel="noopener noreferrer">Gamblers Anonymous (International)</a></li>
            </ul>

            <p style={{
              fontStyle: 'italic',
              marginTop: '3rem',
              textAlign: 'center',
              fontSize: '1.2rem',
              opacity: 0.9
            }}>
              Play for fun. Play responsibly. Protect your heart, and enjoy the game.
            </p>
          </GambleAwarenessContentWrapper>
        </UnifiedSection>
      </UnifiedPageContainer>
    </>
  )
}

export default GambleAwarenessPage
