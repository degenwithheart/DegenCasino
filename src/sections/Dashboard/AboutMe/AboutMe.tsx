import React, { useEffect, useState } from 'react'
import { FOOTER_LINKS } from '../../../constants'
import { Container, HeaderSection, ProfileImage, TextInfo, SectionHeading, Content } from './AboutMe.styles'

const AboutMe: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  const githubLink = FOOTER_LINKS.find((link) =>
    link.title?.toLowerCase().includes('github')
  )

  return (
    <Container visible={visible}>
      <HeaderSection>
        <ProfileImage src="/webp/pfp.webp" alt="Degen Serenade PFP" />
        <TextInfo>
          <h1>Degen Serenade</h1>
          <p>Heart on-chain, soul in code. Updated July 2025</p>
        </TextInfo>
      </HeaderSection>

      <Content>
        <SectionHeading>Who is Degen Serenade?</SectionHeading>
        <p>
          I'm <strong>Stuart</strong> — a romantic builder, alpha in code, and full-time decentralization dreamer.
        </p>
        <p>
          I specialize in building on <strong>Solana</strong> with a passion for DeFi, on-chain apps, and crafting user-trusted protocols.
        </p>

        <SectionHeading>Vision & Mission</SectionHeading>
        <p>
          Creator of this casino platform and the $DGHRT token, my mission is simple: fuse secure blockchain tech with fun and fair entertainment.
        </p>
        <p>
          I aim to create systems that are verifiably fair, non-custodial, and community-centric.
        </p>

        <SectionHeading>Life On & Off the Chain</SectionHeading>
        <p>
          By day, I chase AI ghosts. By night, I dance in AR/VR dreams. I'm a full-stack storm chaser, backend thumper, frontend dreamweaver, and DevOps alchemist.
        </p>
        <p>
          Off-duty? I'm deep in memecoins, building for the thrill. Building is my love language.
        </p>

        <SectionHeading>Connect & Collaborate</SectionHeading>
        <p>Want to vibe, collab, or dive deep into smart contract spelunking? Let's connect:</p>

        {githubLink && (
          <p>
            <strong>{githubLink.title}:</strong>{' '}
            <a href={githubLink.href} rel="noopener noreferrer">
              {githubLink.href?.replace(/^https?:\/\//, '')}
            </a>
          </p>
        )}

        <p style={{ fontStyle: 'italic', marginTop: '2rem' }}>
          Thank you for being here. Let's build something unforgettable. 🚀
        </p>
      </Content>
    </Container>
  )
}

export default AboutMe
