import React, { useState, useEffect } from 'react'
import { useColorScheme } from '../../../themes/ColorSchemeContext'
import { usePageSEO } from '../../../hooks/ui/useGameSEO'
import { 
  UnifiedPageContainer, 
  UnifiedPageTitle, 
  UnifiedSubtitle,
  UnifiedSection, 
  UnifiedSectionTitle, 
  UnifiedContent
} from '../../../components/UI/UnifiedDesign'
import { Selector, Flag } from './Terms.styles'
import { Helmet } from 'react-helmet-async' // ⚠️ Ensure this is imported for the Schema to work

type ContinentKey = 'AU' | 'EU' | 'AMERICAS' | 'ASIA'

const continents: Record<
  ContinentKey,
  {
    name: string
    ageRequirement: string
    disputeResolution: string
    gamblingWarning?: string
    flag: string
  }
> = {
  AU: {
    name: 'Australia',
    ageRequirement: 'Must be 18+ in compliance with Australian law.',
    disputeResolution: 'Disputes resolved under Australian law.',
    flag: '🇦🇺',
  },
  EU: {
    name: 'Europe',
    ageRequirement: 'Must be 18+ or as required in your country.',
    disputeResolution:
      'Disputes resolved under EU law and applicable UK laws where relevant.',
    gamblingWarning:
      'Note: Most crypto assets are not regulated by the FCA and are not covered by FSCS protections. The FCA bans the promotion of certain crypto derivatives and products to retail consumers in the UK. Please gamble responsibly and comply with all applicable local laws.',
    flag: '🇪🇺',
  },
  AMERICAS: {
    name: 'Americas',
    ageRequirement: 'Must be 21+ or legal age in your state or country.',
    disputeResolution: 'Disputes resolved under American laws.',
    flag: '🇺🇸',
  },
  ASIA: {
    name: 'Asia',
    ageRequirement: 'Must comply with local gambling laws, typically 18+.',
    disputeResolution: 'Disputes resolved per local regulations.',
    gamblingWarning:
      'Crypto gambling regulations vary widely across Asian countries. Ensure local compliance.',
    flag: '🇸🇬',
  },
}

const Terms: React.FC = () => {
  // SEO for Terms page - This is what provides the <title> and <meta name="description"> tags
  const seoHelmet = usePageSEO(
    "Terms of Service", 
    "Read our Terms of Service and legal agreements for using DegenHeart Casino. Age requirements and dispute resolution by region."
  )

  const [visible, setVisible] = useState(false)
  const [continent, setContinent] = useState<ContinentKey>('EU')
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  const data = continents[continent]

  return (
    <>
      {/* Renders the standard <title> and <meta description> tags */}
      {seoHelmet}
      
      {/* ✅ WEBPAGE SCHEMA MARKUP (JSON-LD) - Placed next to the helmet output */}
      <script type="application/ld+json">
        {`{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Terms and Conditions of Service | DegenHeart Casino",
          "url": "https://degenheart.casino/terms",
          "description": "The official terms and conditions for DegenHeart Casino. Details on user responsibilities, use of the Gamba Protocol, and dispute resolution.",
          "lastReviewed": "${new Date().toISOString().slice(0, 10)}", 
          "keywords": "crypto casino terms, solana gambling rules, degenheart conditions, provably fair terms of service",
          "mainEntityOfPage": {
            "@type": "WebSite",
            "name": "DegenHeart Casino",
            "url": "https://degenheart.casino/"
          }
        }`}
      </script>

      <UnifiedPageContainer $colorScheme={currentColorScheme}>
        <UnifiedPageTitle $colorScheme={currentColorScheme}>⚖️ Terms of the Heart ⚖️</UnifiedPageTitle>
        <UnifiedSubtitle $colorScheme={currentColorScheme}>
          In the flickering candlelight of our casino temple, understand the sacred bonds between player and house.
        </UnifiedSubtitle>

        <UnifiedSection $colorScheme={currentColorScheme}>
          <Selector $colorScheme={currentColorScheme}>
            <label>Choose your romantic realm:</label>
            {(Object.entries(continents) as [ContinentKey, typeof data][]).map(
              ([key, val]) => (
                <button
                  key={key}
                  onClick={() => setContinent(key)}
                  className={key === continent ? 'active' : ''}
                  aria-pressed={key === continent}
                >
                  <Flag>{val.flag}</Flag> {val.name}
                </button>
              )
            )}
          </Selector>
        </UnifiedSection>

        <UnifiedSection $colorScheme={currentColorScheme}>
          <UnifiedContent $colorScheme={currentColorScheme}>
            <p>
              <strong>💍 Age of Consent:</strong> {data.ageRequirement}
            </p>

            {data.gamblingWarning && (
              <>
                <UnifiedSectionTitle $colorScheme={currentColorScheme}>🌹 Sacred Warnings 🌹</UnifiedSectionTitle>
                <p><em>{data.gamblingWarning}</em></p>
              </>
            )}

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>💎 The Nature of Our Sacred Ground 💎</UnifiedSectionTitle>
            <p>
              <strong>🏛️ Temple of Transparency:</strong> All gameplay unfolds like a love letter written in code, 
              executed on-chain through sacred smart contracts, ensuring every moment is transparent and fair.
            </p>
            <p>
              <strong>🔑 Your Sovereign Heart:</strong> You hold the keys to your own treasure, maintaining full control 
              over your wallet. We never touch nor store your precious assets, ensuring true sovereignty.
            </p>
            <p>
              <strong>🌟 Provably Fair Romance:</strong> Each bet is a cryptographic promise, verifiable through our 
              eternal ledger, ensuring the dance between chance and destiny remains untainted.
            </p>
            <p>
              <strong>🎭 No House of Mirrors:</strong> We offer no bonuses, promotional treasures, or honeyed words 
              that might cloud judgment. Pure gameplay, untainted by deceptive allure.
            </p>

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>🌟 Wallet's Sacred Union 🌟</UnifiedSectionTitle>
            <p>
              By connecting your digital heart (wallet) to our temple, you consent to the mystical binding that 
              allows gameplay. This connection is ephemeral, broken the moment you close our gates or disconnect 
              your vessel.
            </p>

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>🎲 The Art of Responsible Romance 🎲</UnifiedSectionTitle>
            <p>
              <strong>Gamble only with the tenderness you can afford to lose.</strong> Set limits like boundaries 
              around your heart. If gambling becomes more shadow than light, seek guidance from organizations 
              dedicated to healing.
            </p>

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>⚔️ Forbidden Enchantments ⚔️</UnifiedSectionTitle>
            <p>
              You shall not use dark magic (automated tools, bots, cheats) to gain unfair advantage, 
              nor shall you attempt to break our sacred seals (hack or exploit our platform).
            </p>

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>👑 Treasures of the Mind 👑</UnifiedSectionTitle>
            <p>
              All intellectual treasures within our temple belong to <strong>DegenHeart Foundation</strong>. 
              You may partake in the experience but not claim ownership of our mystical designs.
            </p>

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>🔮 Secrets and Transparency 🔮</UnifiedSectionTitle>
            <p>
              We honor your privacy like a secret whispered between lovers. Personal data is handled with 
              utmost care, collected only when necessary for the sacred function of gameplay.
            </p>

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>⚠️ No Promises in the Moonlight ⚠️</UnifiedSectionTitle>
            <p>
              Our temple stands "as is" beneath the stars, offering no warranties beyond the honesty of our code. 
              We promise no merchantability, fitness for purpose, or protection from the night's uncertainties.
            </p>

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>💔 Limitations of a Broken Heart 💔</UnifiedSectionTitle>
            <p>
              To the fullest extent the law allows, <strong>DegenHeart Foundation</strong> bears no responsibility 
              for indirect sorrows, unexpected losses, or punitive damages. Our maximum liability remains at $100 
              or your total devotion to our platform over six moons, whichever brings greater comfort.
            </p>

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>🛡️ Shield of Mutual Protection 🛡️</UnifiedSectionTitle>
            <p>
              You pledge to protect <strong>DegenHeart Foundation</strong> and its allied houses from claims, 
              damages, and sorrows arising from your journey through our realm.
            </p>

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>⚖️ Laws of the Heart & Resolution of Disputes ⚖️</UnifiedSectionTitle>
            <p><em>{data.disputeResolution}</em></p>

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>🚪 When the Dance Must End 🚪</UnifiedSectionTitle>
            <p>
              We reserve the right to close the temple doors to you at any moment, without warning bells, 
              should you break the sacred covenant of these terms.
            </p>

            <UnifiedSectionTitle $colorScheme={currentColorScheme}>📜 The Final Verse 📜</UnifiedSectionTitle>
            <p>
              These terms form the complete ballad between your heart and <strong>DegenHeart Foundation</strong>. 
              Should any verse prove unsingable, the remaining stanzas shall continue their eternal song.
            </p>

            <p style={{ fontStyle: 'italic', marginTop: '2rem', textAlign: 'center', opacity: 0.8 }}>
              <em>💕 Please gamble with the wisdom of the heart. Our temple exists for the joy of the game alone. 💕</em>
            </p>
          </UnifiedContent>
        </UnifiedSection>
      </UnifiedPageContainer>
    </>
  )
}

export default Terms