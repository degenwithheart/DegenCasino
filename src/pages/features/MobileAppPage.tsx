import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaDownload, FaAndroid, FaApple, FaMobile, FaRocket, FaBolt, FaLock, FaSync, FaGamepad, FaCoins } from 'react-icons/fa';

const MobileAppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  overflow-x: hidden;
`;

const Hero = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(33, 150, 243, 0.1));
  position: relative;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #4CAF50, #2196F3, #FF9800);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const DownloadSection = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const DownloadButton = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(76, 175, 80, 0.4);
  }
  
  &.android {
    background: linear-gradient(45deg, #3DDC84, #2ECC40);
  }
  
  &.ios {
    background: linear-gradient(45deg, #007AFF, #0051D5);
  }
  
  &.apk {
    background: linear-gradient(45deg, #FF5722, #D84315);
  }
`;

const FeaturesSection = styled.div`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(45deg, #FF9800, #F57C00);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: #4CAF50;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #4CAF50;
`;

const FeatureDescription = styled.p`
  opacity: 0.8;
  line-height: 1.6;
`;

const HotUpdateSection = styled.div`
  background: linear-gradient(45deg, rgba(255, 152, 0, 0.1), rgba(255, 193, 7, 0.1));
  padding: 4rem 2rem;
  margin: 2rem 0;
`;

const UpdateCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const UpdateIcon = styled.div`
  font-size: 4rem;
  color: #FF9800;
  margin-bottom: 1rem;
`;

const UpdateTitle = styled.h3`
  font-size: 2rem;
  color: #FF9800;
  margin-bottom: 1rem;
`;

const UpdateDescription = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const StepsSection = styled.div`
  padding: 4rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #2196F3, #21CBF3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h4`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #2196F3;
`;

const StepDescription = styled.p`
  opacity: 0.8;
`;

const StatusBadge = styled.div<{ status: 'live' | 'coming-soon' }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: bold;
  background: ${props => props.status === 'live' ? 
    'linear-gradient(45deg, #4CAF50, #45a049)' : 
    'linear-gradient(45deg, #FF9800, #F57C00)'
  };
  color: white;
  margin-left: 1rem;
`;

const MobileAppPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAPKLink = () => {
    navigator.clipboard.writeText('https://degenheart.casino/mobile/degencasino-latest.apk');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    {
      icon: <FaGamepad />,
      title: 'Full Casino Experience',
      description: 'Access all your favorite games - Dice, Slots, Plinko, Roulette, and more. Optimized for mobile with touch controls and responsive design.'
    },
    {
      icon: <FaBolt />,
      title: 'Hot Updates',
      description: 'Get the latest features instantly! No need to download new APKs - updates happen automatically in the background.'
    },
    {
      icon: <FaLock />,
      title: 'Secure & Non-Custodial',
      description: 'Your wallet, your keys, your crypto. Connect with any Solana wallet and maintain full control of your funds.'
    },
    {
      icon: <FaCoins />,
      title: 'Instant Payouts',
      description: 'Winnings go directly to your wallet. No waiting, no intermediaries - just instant, provably fair gaming on Solana.'
    },
    {
      icon: <FaSync />,
      title: 'Always Up to Date',
      description: 'Never miss new games or features. The app automatically updates itself to ensure you have the latest version.'
    },
    {
      icon: <FaRocket />,
      title: 'Optimized Performance',
      description: 'Built with Capacitor for native performance. Fast loading, smooth animations, and responsive gameplay.'
    }
  ];

  return (
    <MobileAppContainer>
      <Hero>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>📱 DegenCasino Mobile App</HeroTitle>
          <HeroSubtitle>
            Take the Casino of Chaos anywhere! Play provably fair games on Solana with instant payouts and hot updates.
          </HeroSubtitle>
          
          <DownloadSection>
            <DownloadButton
              className="apk"
              onClick={handleCopyAPKLink}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDownload />
              {copied ? 'Link Copied!' : 'Download APK'}
              <StatusBadge status="live">LIVE</StatusBadge>
            </DownloadButton>
            
            <DownloadButton
              className="android"
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaAndroid />
              Google Play
              <StatusBadge status="coming-soon">SOON</StatusBadge>
            </DownloadButton>
            
            <DownloadButton
              className="ios"
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaApple />
              App Store
              <StatusBadge status="coming-soon">SOON</StatusBadge>
            </DownloadButton>
          </DownloadSection>
        </motion.div>
      </Hero>

      <HotUpdateSection>
        <UpdateCard>
          <UpdateIcon>
            <FaRocket />
          </UpdateIcon>
          <UpdateTitle>🔥 Revolutionary Hot Updates</UpdateTitle>
          <UpdateDescription>
            Our mobile app features cutting-edge hot update technology. Once you install the APK, 
            you'll never need to download a new version again! Updates happen automatically in the 
            background, ensuring you always have the latest games, features, and security improvements.
          </UpdateDescription>
        </UpdateCard>
      </HotUpdateSection>

      <FeaturesSection>
        <SectionTitle>Why Choose Our Mobile App?</SectionTitle>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      <StepsSection>
        <SectionTitle>How to Get Started</SectionTitle>
        
        <Step>
          <StepNumber>1</StepNumber>
          <StepContent>
            <StepTitle>Download the APK</StepTitle>
            <StepDescription>
              Click the "Download APK" button above to get the latest version of DegenCasino mobile app.
            </StepDescription>
          </StepContent>
        </Step>
        
        <Step>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Enable Unknown Sources</StepTitle>
            <StepDescription>
              In your Android settings, enable "Install unknown apps" for your browser or file manager to install the APK.
            </StepDescription>
          </StepContent>
        </Step>
        
        <Step>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>Install & Connect Wallet</StepTitle>
            <StepDescription>
              Install the app, open it, and connect your Solana wallet. The app will automatically check for updates!
            </StepDescription>
          </StepContent>
        </Step>
        
        <Step>
          <StepNumber>4</StepNumber>
          <StepContent>
            <StepTitle>Start Playing!</StepTitle>
            <StepDescription>
              Enjoy all your favorite casino games with instant payouts and automatic updates. Welcome to the future of mobile gaming!
            </StepDescription>
          </StepContent>
        </Step>
      </StepsSection>
    </MobileAppContainer>
  );
};

export default MobileAppPage;