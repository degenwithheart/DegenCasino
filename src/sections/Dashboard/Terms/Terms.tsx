import React, { useState, useEffect } from 'react'
import { Container, Title, Subtitle, Selector, SectionHeading, Content, Flag } from './Terms.styles'

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

  useEffect(() => {
    setVisible(true)
  }, [])

  const data = continents[continent]

  return (
    <Container visible={visible}>
      <Title>📜 Terms and Conditions 📜</Title>
      <Subtitle>
        Read our terms and understand your rights and responsibilities while using our platform.
      </Subtitle>

      <Selector>
        <label>Select your jurisdiction:</label>
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

      <Content>
        <p>
          <strong>1 Age Requirement:</strong> {data.ageRequirement}
        </p>

        {data.gamblingWarning && (
          <>
            <SectionHeading>Important Notice</SectionHeading>
            <p>{data.gamblingWarning}</p>
          </>
        )}

        <SectionHeading>2 Nature of the Platform</SectionHeading>
        <p>
          <strong>2a Decentralized Casino:</strong> All gameplay is executed on-chain via
          secure smart contracts, ensuring transparency and fairness.
        </p>
        <p>
          <strong>2b Non-Custodial Funds:</strong> You maintain full control of your funds at all times. Bets and payouts are executed directly on-chain.
        </p>

        <p>
          <strong>2c Provably Fair:</strong> All games are transparent and verifiable on Solana blockchain.
        </p>
        <p>
          <strong>2d Assumption of Risk:</strong> Use of crypto assets involves inherent risks, including potential loss of funds. You accept full responsibility for any losses incurred.
        </p>

        <SectionHeading>3 Account and Wallet Integration</SectionHeading>
        <p>
          <strong>3a Supported Wallets:</strong> You must connect a supported Solana wallet to use the Platform.
        </p>
        <p>
          <strong>3b Transaction Fees:</strong> You are solely responsible for any network or gas fees incurred when interacting with the Platform.
        </p>

        <SectionHeading>4 Responsible Gaming</SectionHeading>
        <p>
          <strong>4a No Guarantee:</strong> The Platform does not guarantee any winnings or financial returns. Gambling involves risk of loss.
        </p>
        <p>
          <strong>4b Self-Regulation:</strong> If you believe you may have a gambling problem, please seek professional help and use available self-exclusion tools.
        </p>

        <SectionHeading>5 Prohibited Conduct</SectionHeading>
        <ul>
          <li>You must not violate applicable laws or provide false or misleading information.</li>
          <li>No use of bots, automation, or unauthorized software to interact with the Platform.</li>
          <li>No attempts to exploit, manipulate, or reverse engineer smart contracts or Platform functionality.</li>
        </ul>

        <SectionHeading>6 Intellectual Property</SectionHeading>
        <p>
          All content, trademarks, and intellectual property are owned by DegenHeart Foundation. Unauthorized use, reproduction, or distribution is prohibited.
        </p>

        <SectionHeading>7 Privacy and Data</SectionHeading>
        <p>
          All blockchain transactions are publicly visible by design. We do not store or process sensitive personal data beyond what is necessary to operate the Platform.
        </p>

        <SectionHeading>8 Disclaimer of Warranties</SectionHeading>
        <p>
          The Platform is provided "as is" and "as available" without warranties of any kind, express or implied, including but not limited to merchantability, fitness for a particular purpose, or non-infringement.
        </p>

        <SectionHeading>9 Limitation of Liability</SectionHeading>
        <p>
          To the fullest extent permitted by law, DegenHeart Foundation is not liable for any indirect, incidental, consequential, or punitive damages. Maximum liability is limited to $100 or your total Platform spend within the last six months, whichever is greater.
        </p>

        <SectionHeading>10 Indemnification</SectionHeading>
        <p>
          You agree to indemnify and hold harmless DegenHeart Foundation, its affiliates, and partners from any claims, damages, losses, liabilities, and expenses arising out of your use or misuse of the Platform.
        </p>

        <SectionHeading>11 Governing Law & Dispute Resolution</SectionHeading>
        <p>{data.disputeResolution}</p>

        <SectionHeading>12 Termination</SectionHeading>
        <p>
          We reserve the right to suspend or terminate your access to the Platform at any time, without prior notice, for any reason including violation of these Terms.
        </p>

        <SectionHeading>13 General Provisions</SectionHeading>
        <p>
          These Terms constitute the entire agreement between you and DegenHeart Foundation. If any provision is found unenforceable, the remaining provisions shall remain in full force and effect.
        </p>

        <p style={{ fontStyle: 'italic', marginTop: '2rem' }}>
          Please gamble responsibly. This platform is intended for entertainment purposes only.
        </p>
      </Content>
    </Container>
  )
}

export default Terms
