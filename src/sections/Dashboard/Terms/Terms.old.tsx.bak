import React, { useState, useEffect } from 'react'
import { useColorScheme } from '../../../themes/ColorSchemeContext'
import { 
  UnifiedPageContainer, 
  UnifiedPageTitle, 
  UnifiedCard, 
  UnifiedSectionHeading, 
  UnifiedContent,
  UnifiedResponsiveContainer 
} from '../../../components/UI/UnifiedStyles'
import { Selector, Flag } from './Terms.styles'

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
  const [visible, setVisible] = useState(false)
  const [continent, setContinent] = useState<ContinentKey>('EU')
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  const data = continents[continent]

  return (
    <UnifiedResponsiveContainer>
      <UnifiedPageContainer visible={visible}>
        <UnifiedPageTitle>⚖️ Terms of the Heart ⚖️</UnifiedPageTitle>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--text-secondary)', 
          textAlign: 'center', 
          margin: '0 0 2rem 0',
          fontStyle: 'italic'
        }}>
          In the flickering candlelight of our casino temple, understand the sacred bonds between player and house.
        </p>

        <UnifiedCard>
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
        </UnifiedCard>

        <UnifiedCard>
          <UnifiedContent>
            <p>
              <strong>💍 Age of Consent:</strong> {data.ageRequirement}
            </p>

            {data.gamblingWarning && (
              <>
                <UnifiedSectionHeading>🌹 Sacred Warnings 🌹</UnifiedSectionHeading>
                <p><em>{data.gamblingWarning}</em></p>
              </>
            )}

            <UnifiedSectionHeading>💎 The Nature of Our Sacred Ground 💎</UnifiedSectionHeading>
        <p>
          <strong>🏛️ Temple of Transparency:</strong> All gameplay unfolds like a love letter written in code, 
          executed on-chain through sacred smart contracts, ensuring every moment is transparent and fair.
        </p>
        <p>
          <strong>🔑 Your Sovereign Heart:</strong> You hold the keys to your own treasure, maintaining full control 
          of your funds at all times. Each bet and blessing flows directly through the blockchain's embrace.
        </p>

        <p>
          <strong>🎭 Provably Fair Romance:</strong> Every game is a sonnet of transparency, verifiable on the 
          eternal Solana blockchain where truth lives forever.
        </p>
        <p>
          <strong>⚡ The Dance of Risk:</strong> Crypto assets waltz with inherent risk, including the potential 
          loss of your treasures. You accept this passionate dance with full awareness of its consequences.
        </p>

        <SectionHeading $colorScheme={currentColorScheme}>🌟 Wallet's Sacred Union 🌟</SectionHeading>
        <p>
          <strong>💫 Chosen Vessels:</strong> Your Solana wallet must join our sacred circle to participate 
          in the casino's midnight mass.
        </p>
        <p>
          <strong>💰 Network's Tribute:</strong> The blockchain demands its offerings in the form of gas and 
          network fees - a small price for entry into our realm.
        </p>

        <SectionHeading $colorScheme={currentColorScheme}>🎲 The Art of Responsible Romance 🎲</SectionHeading>
        <p>
          <strong>🌙 No Promises Under Starlight:</strong> We offer no guarantees of winnings or golden returns. 
          Gambling is a dance with fortune's fickle heart.
        </p>
        <p>
          <strong>🛡️ Guardian of Your Own Soul:</strong> If the casino's siren song grows too strong, 
          seek wisdom from professionals and use the tools we provide for your protection.
        </p>

        <SectionHeading $colorScheme={currentColorScheme}>⚔️ Forbidden Enchantments ⚔️</SectionHeading>
        <ul>
          <li>Thou shalt not violate the sacred laws or speak false prophecies to our temple.</li>
          <li>No mechanical familiars (bots) or dark magic (automation) shall disturb our sacred rituals.</li>
          <li>Attempts to unweave our smart contract spells or exploit our mystical systems are forbidden.</li>
        </ul>

        <SectionHeading $colorScheme={currentColorScheme}>👑 Treasures of the Mind 👑</SectionHeading>
        <p>
          All creations, symbols, and intellectual pearls belong to the <strong>DegenHeart Foundation</strong>. 
          Unauthorized theft or reproduction of our romantic works is strictly forbidden.
        </p>

        <SectionHeading $colorScheme={currentColorScheme}>🔮 Secrets and Transparency 🔮</SectionHeading>
        <p>
          The blockchain keeps its own diary - all transactions become part of the eternal ledger. 
          We guard only what is necessary, keeping your deepest secrets safe while honoring transparency.
        </p>

        <SectionHeading $colorScheme={currentColorScheme}>⚠️ No Promises in the Moonlight ⚠️</SectionHeading>
        <p>
          Our temple stands "as is" beneath the stars, offering no warranties beyond the honesty of our code. 
          We promise no merchantability, fitness for purpose, or protection from the night's uncertainties.
        </p>

        <SectionHeading $colorScheme={currentColorScheme}>💔 Limitations of a Broken Heart 💔</SectionHeading>
        <p>
          To the fullest extent the law allows, <strong>DegenHeart Foundation</strong> bears no responsibility 
          for indirect sorrows, unexpected losses, or punitive damages. Our maximum liability remains at $100 
          or your total devotion to our platform over six moons, whichever brings greater comfort.
        </p>

        <SectionHeading $colorScheme={currentColorScheme}>🛡️ Shield of Mutual Protection 🛡️</SectionHeading>
        <p>
          You pledge to protect <strong>DegenHeart Foundation</strong> and its allied houses from claims, 
          damages, and sorrows arising from your journey through our realm.
        </p>

        <SectionHeading $colorScheme={currentColorScheme}>⚖️ Laws of the Heart & Resolution of Disputes ⚖️</SectionHeading>
        <p><em>{data.disputeResolution}</em></p>

        <SectionHeading $colorScheme={currentColorScheme}>🚪 When the Dance Must End 🚪</SectionHeading>
        <p>
          We reserve the right to close the temple doors to you at any moment, without warning bells, 
          should you break the sacred covenant of these terms.
        </p>

        <SectionHeading $colorScheme={currentColorScheme}>📜 The Final Verse 📜</SectionHeading>
        <p>
          These terms form the complete ballad between your heart and <strong>DegenHeart Foundation</strong>. 
          Should any verse prove unsingable, the remaining stanzas shall continue their eternal song.
        </p>

        <p style={{ fontStyle: 'italic', marginTop: '2rem', textAlign: 'center', opacity: 0.8 }}>
          <em>💕 Please gamble with the wisdom of the heart. Our temple exists for the joy of the game alone. 💕</em>
        </p>
      </Content>
    </Container>
  )
}

export default Terms
