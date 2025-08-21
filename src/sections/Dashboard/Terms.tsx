import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'

// Casino animations
const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #ffd70044;
  }
  100% { 
    box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88;
    border-color: #ffd700aa;
  }
`;

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`;

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

const SIDEBAR_WIDTH = 80;
interface ContainerProps {
  $compact?: boolean;
  visible?: boolean;
}
const Container = styled.div<ContainerProps>`
  max-width: 100vw;
  padding: ${({ $compact }) => ($compact ? '1rem' : '2rem')};
  margin: 2rem 0; /* Only vertical margins */
  border-radius: 12px;
  background: #0f0f23;
  border: 1px solid #2a2a4a;
  color: white;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: ${(props) => (props.visible ? 'translateY(0)' : 'translateY(20px)')};
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #ffd700;
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
    transform: translateY(-2px);
  }

  @media (max-width: 900px) {
    margin: 1rem 0;
    padding: ${({ $compact }) => ($compact ? '0.5rem' : '1.5rem')};
  }

  @media (max-width: 700px) {
    margin: 1rem 0;
    padding: ${({ $compact }) => ($compact ? '0.5rem' : '1rem')};
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
    margin: 0.5rem 0;
  }
  
  @media (max-width: 400px) {
    padding: 0.75rem 0.5rem;
    margin: 0.25rem 0;
    border-radius: 8px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #ffd700;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 2px;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 1.5rem;
    letter-spacing: 1px;
  }
`;

const Subtitle = styled.p`
  font-style: italic;
  color: #999;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  text-align: center;
`

const Selector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;

  label {
    font-weight: 600;
    font-size: 1.1rem;
    white-space: nowrap;
  }

  button {
    cursor: pointer;
    border: 1px solid #2a2a4a;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #0f0f23;
    color: #ddd;
    transition: all 0.3s ease;

    &:hover {
      border-color: #ffd700;
      box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
      transform: translateY(-2px);
    }
      color: #ffd700;
      border-color: rgba(255, 215, 0, 0.6);
      box-shadow: 0 0 12px rgba(255, 215, 0, 0.3);
      transform: translateY(-2px);
    }

    &.active {
      background: linear-gradient(135deg, #ffd700, #a259ff);
      color: #222;
      font-weight: 700;
      border-color: #ffd700;
      box-shadow: 0 0 16px rgba(255, 215, 0, 0.5);
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.1rem;
    label {
      font-size: 0.97rem;
    }
    button {
      font-size: 0.97rem;
      padding: 0.5rem 0.8rem;
      border-radius: 12px;
    }
  }
`;

const SectionHeading = styled.h2`
  margin-top: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffd700;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    font-size: 1.1rem;
    margin-top: 1.2rem;
  }
`;

const Content = styled.div`
  line-height: 1.6;
  font-size: 1rem;
  margin-top: 1rem;

  p,
  ul {
    margin-bottom: 1rem;
    color: #999;
  }

  ul {
    padding-left: 1.25rem;
    list-style-type: disc;
  }

  a {
    color: #ffd700;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      color: #fff;
      text-decoration: underline;
    }
  }

  strong {
    font-weight: 700;
    color: #ffd700;
  }

  em {
    font-style: italic;
    color: #a259ff;
  }

  @media (max-width: 600px) {
    font-size: 0.97rem;
    line-height: 1.4;
    margin-top: 0.5rem;
    p, ul {
      margin-bottom: 0.7rem;
    }
    ul {
      padding-left: 0.9rem;
    }
  }
`;

const Flag = styled.span`
  font-size: 1.5rem;
  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;

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
          The Platform is provided “as is” and “as available” without warranties of any kind, express or implied, including but not limited to merchantability, fitness for a particular purpose, or non-infringement.
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
