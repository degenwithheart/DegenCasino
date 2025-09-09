import React, { useEffect, useState } from 'react'
import { FOOTER_LINKS } from '../../../constants'
import { useTheme } from '../../../themes/ThemeContext'
import { Container, HeaderSection, ProfileImage, TextInfo, SectionHeading, Content, HeartDecoration, CandlestickDecoration, MarketLoversOverlay } from './AboutMe.styles'

const AboutMe: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const { currentTheme } = useTheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  const githubLink = FOOTER_LINKS.find((link) =>
    link.title?.toLowerCase().includes('github')
  )

  return (
    <Container visible={visible} $theme={currentTheme}>
      <MarketLoversOverlay />
      <HeartDecoration>💖</HeartDecoration>
      <HeartDecoration>💕</HeartDecoration>
      <HeartDecoration>💗</HeartDecoration>
      <HeartDecoration>💓</HeartDecoration>
      <CandlestickDecoration />
      <CandlestickDecoration />
      <CandlestickDecoration />
      <HeaderSection $theme={currentTheme}>
        <ProfileImage src="/webp/images/pfp.webp" alt="Degen Serenade PFP" $theme={currentTheme} />
        <TextInfo $theme={currentTheme}>
          <h1>Degen Serenade</h1>
          <p>Heart on-chain, soul in code — a romantic builder dancing between candlesticks and palace dreams. Updated September 2025</p>
        </TextInfo>
      </HeaderSection>

      <Content $theme={currentTheme}>
        <SectionHeading $theme={currentTheme}>Who is Degen Serenade?</SectionHeading>
        <p>
          I'm <strong>Stuart</strong> — a romantic builder weaving love letters in Solana's blockchain realm, 
          where every smart contract whispers sweet promises of decentralization.
        </p>
        <p>
          My passion burns bright for <strong>DeFi symphonies</strong>, on-chain poetry, and crafting protocols 
          that users can trust like old lovers — faithful, transparent, and eternally devoted.
        </p>

        <SectionHeading $theme={currentTheme}>Vision & Mission</SectionHeading>
        <p>
          Creator of this casino platform and the sacred <strong>$DGHRT token</strong>, my mission dances 
          like candlelight against temple walls: fuse secure blockchain artistry with fun, fair entertainment 
          that feels like a slow-burn serenade.
        </p>
        <p>
          I craft systems that are <em>verifiably fair</em>, <em>non-custodial as moonlight</em>, 
          and <em>community-centric as a love song</em> — where every transaction tells a story of trust.
        </p>

        <SectionHeading $theme={currentTheme}>Life On & Off the Chain</SectionHeading>
        <p>
          By day, I chase <strong>AI ghosts</strong> through neural networks. By night, I dance in <strong>AR/VR dreams</strong> 
          where pixels become poetry. I'm a full-stack storm chaser, backend thumper, frontend dreamweaver, 
          and DevOps alchemist brewing magic in cloud palaces.
        </p>
        <p>
          Off-duty? I'm deep in <em>memecoin moonbeams</em>, building for the thrill of watching code come alive. 
          Building isn't just my craft — <strong>it's my love language</strong>, whispered in commit messages 
          and sung through deployment pipelines.
        </p>

        <SectionHeading $theme={currentTheme}>Connect & Collaborate</SectionHeading>
        <p>
          Want to vibe, collab, or dive deep into smart contract spelunking? Let's write code love letters together:
        </p>

        {githubLink && (
          <p>
            <strong>{githubLink.title}:</strong>{' '}
            <a href={githubLink.href} rel="noopener noreferrer">
              {githubLink.href?.replace(/^https?:\/\//, '')}
            </a>
          </p>
        )}

        <p style={{ 
          fontStyle: 'italic', 
          marginTop: '3rem',
          textAlign: 'center',
          fontSize: '1.2rem',
          opacity: 0.9
        }}>
          Thank you for being here, fellow traveler of the digital sanctuary. 
          Let's build something unforgettable together — where every line of code 
          is a love letter to the future. 🚀💕
        </p>
      </Content>
    </Container>
  )
}

export default AboutMe
