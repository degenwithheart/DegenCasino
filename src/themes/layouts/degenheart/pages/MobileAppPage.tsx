import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import { FaDownload, FaAndroid, FaApple, FaMobile, FaRocket, FaBolt, FaLock, FaSync, FaGamepad, FaCoins, FaHeart } from 'react-icons/fa';
import { useColorScheme } from '../../../ColorSchemeContext';
import { media, spacing, typography } from '../breakpoints';

// Degen-themed animations
const degenGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 107, 122, 0.3);
    transform: translateY(0px) scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 107, 122, 0.6), 0 0 60px rgba(255, 215, 0, 0.2);
    transform: translateY(-3px) scale(1.02);
  }
`;

const heartPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    color: #FF6B7A;
  }
  50% {
    transform: scale(1.1);
    color: #FFD700;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const MobileAppContainer = styled.div<{ $colorScheme: any }>`
  min-height: 100%;
  background: ${props => props.$colorScheme.colors.background};
  color: ${props => props.$colorScheme.colors.text};
  overflow-x: hidden;
  padding: ${spacing.mobile.base};
  
  ${media.tablet} {
    padding: ${spacing.tablet.base};
  }
  
  ${media.desktop} {
    padding: ${spacing.desktop.base};
  }
`;

const Hero = styled.div<{ $colorScheme: any }>`
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.surface}90,
    ${props => props.$colorScheme.colors.background}50
  );
  border-radius: 20px;
  border: 2px solid ${props => props.$colorScheme.colors.accent}40;
  position: relative;
  overflow: hidden;
  margin-bottom: 3rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.$colorScheme.colors.accent}15,
      transparent
    );
    ${css`animation: ${shimmer} 3s ease-in-out infinite;`}
  }
  
  ${media.mobile} {
    padding: 2rem 1rem;
  }
`;

const HeroTitle = styled.h1<{ $colorScheme: any }>`
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, ${props => props.$colorScheme.colors.accent}, #FFD700, ${props => props.$colorScheme.colors.secondary});
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  ${media.mobile} {
    font-size: 2.5rem;
  }
  
  &::after {
    content: '💖';
    position: absolute;
    top: -10px;
    right: -20px;
    font-size: 2rem;
    ${css`animation: ${heartPulse} 2s ease-in-out infinite;`}
  }
`;

const HeroSubtitle = styled.p<{ $colorScheme: any }>`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  color: ${props => props.$colorScheme.colors.textSecondary};
  position: relative;
  z-index: 1;
`;

const DownloadSection = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
`;

const DownloadButton = styled(motion.a)<{ $colorScheme: any; $variant: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 15px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  ${props => props.$variant === 'primary' ? css`
    background: linear-gradient(135deg, ${props.$colorScheme.colors.accent}, ${props.$colorScheme.colors.secondary});
    color: white;
    border: 2px solid transparent;
    ${css`animation: ${degenGlow} 3s ease-in-out infinite;`}
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(255, 107, 122, 0.4);
    }
  ` : css`
    background: ${props.$colorScheme.colors.surface};
    color: ${props.$colorScheme.colors.text};
    border: 2px solid ${props.$colorScheme.colors.accent}30;
    
    &:hover {
      border-color: ${props.$colorScheme.colors.accent};
      background: ${props.$colorScheme.colors.accent}10;
    }
  `}
  
  svg {
    font-size: 1.3rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
  
  ${media.mobile} {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled(motion.div)<{ $colorScheme: any }>`
  padding: 2rem;
  border-radius: 20px;
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.surface}80,
    ${props => props.$colorScheme.colors.background}40
  );
  border: 2px solid ${props => props.$colorScheme.colors.accent}20;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: ${props => props.$colorScheme.colors.accent}60;
    transform: translateY(-5px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.$colorScheme.colors.accent}, ${props => props.$colorScheme.colors.secondary});
  }
`;

const FeatureIcon = styled.div<{ $colorScheme: any }>`
  font-size: 3rem;
  color: ${props => props.$colorScheme.colors.accent};
  margin-bottom: 1rem;
  
  svg {
    filter: drop-shadow(0 4px 8px rgba(255, 107, 122, 0.3));
  }
`;

const FeatureTitle = styled.h3<{ $colorScheme: any }>`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${props => props.$colorScheme.colors.text};
`;

const FeatureDescription = styled.p<{ $colorScheme: any }>`
  color: ${props => props.$colorScheme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const StepsSection = styled.div<{ $colorScheme: any }>`
  margin: 4rem 0;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.surface}60,
    ${props => props.$colorScheme.colors.background}20
  );
  border-radius: 20px;
  border: 2px solid ${props => props.$colorScheme.colors.accent}30;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, ${props => props.$colorScheme.colors.accent}05, transparent);
  }
`;

const StepsTitle = styled.h2<{ $colorScheme: any }>`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
  color: ${props => props.$colorScheme.colors.accent};
  position: relative;
  z-index: 1;
  
  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.$colorScheme.colors.accent}, ${props => props.$colorScheme.colors.secondary});
    margin: 1rem auto;
    border-radius: 2px;
  }
`;

const Step = styled(motion.div)<{ $colorScheme: any }>`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${props => props.$colorScheme.colors.surface}40;
  border-radius: 15px;
  border-left: 4px solid ${props => props.$colorScheme.colors.accent};
  position: relative;
  z-index: 1;
  
  ${media.mobile} {
    flex-direction: column;
    text-align: center;
  }
  
  &:hover {
    background: ${props => props.$colorScheme.colors.surface}60;
    transform: translateX(10px);
  }
`;

const StepNumber = styled.div<{ $colorScheme: any }>`
  font-size: 2rem;
  font-weight: 900;
  color: ${props => props.$colorScheme.colors.accent};
  margin-right: 1.5rem;
  min-width: 60px;
  text-align: center;
  
  ${media.mobile} {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h4<{ $colorScheme: any }>`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => props.$colorScheme.colors.text};
`;

const StepDescription = styled.p<{ $colorScheme: any }>`
  color: ${props => props.$colorScheme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const APKLinkSection = styled.div<{ $colorScheme: any }>`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.accent}10,
    ${props => props.$colorScheme.colors.secondary}10
  );
  border-radius: 15px;
  border: 2px solid ${props => props.$colorScheme.colors.accent}30;
  margin: 2rem 0;
`;

const APKLink = styled.code<{ $colorScheme: any }>`
  background: ${props => props.$colorScheme.colors.surface};
  color: ${props => props.$colorScheme.colors.accent};
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  border: 1px solid ${props => props.$colorScheme.colors.accent}40;
  display: inline-block;
  margin: 1rem 0;
`;

const CopyButton = styled(motion.button)<{ $colorScheme: any; $copied: boolean }>`
  background: ${props => props.$copied ? props.$colorScheme.colors.success : props.$colorScheme.colors.accent};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.$copied ? props.$colorScheme.colors.success : props.$colorScheme.colors.accent}40;
  }
`;

const DegenMobileAppPage: React.FC = () => {
  const { colorScheme } = useColorScheme();
  const [copied, setCopied] = useState(false);

  // Fallback color scheme if undefined
  const safeColorScheme = colorScheme || {
    colors: {
      background: '#1a1a2e',
      surface: '#16213e',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      accent: '#FF6B7A',
      secondary: '#FFD700',
      success: '#4CAF50'
    }
  };

  const handleCopyAPKLink = () => {
    navigator.clipboard.writeText('https://degenheart.casino/mobile/degencasino-latest.apk');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    {
      icon: <FaGamepad />,
      title: 'All Your Favorite Games',
      description: 'Access the complete DegenHeart Casino experience on mobile. Dice, Crash, Mines, and more - all optimized for touch gameplay.'
    },
    {
      icon: <FaBolt />,
      title: 'Lightning Fast Updates',
      description: 'Get the latest features instantly! No need to download new APKs - updates happen automatically with degen speed.'
    },
    {
      icon: <FaLock />,
      title: 'Secure & Non-Custodial',
      description: 'Your wallet, your keys, your crypto. Connect with any Solana wallet and maintain full control of your degen funds.'
    },
    {
      icon: <FaCoins />,
      title: 'Instant Degen Payouts',
      description: 'Winnings go directly to your wallet. No waiting, no intermediaries - just instant, provably fair degen gaming on Solana.'
    },
    {
      icon: <FaRocket />,
      title: 'Optimized Performance',
      description: 'Built specifically for mobile degens. Smooth animations, responsive design, and optimized for all screen sizes.'
    },
    {
      icon: <FaSync />,
      title: 'Cross-Device Sync',
      description: 'Start playing on desktop, continue on mobile. Your degen progress and settings sync seamlessly across all devices.'
    }
  ];

  return (
    <MobileAppContainer $colorScheme={safeColorScheme}>
      <Hero $colorScheme={safeColorScheme}>
        <HeroTitle $colorScheme={safeColorScheme}>
          DegenHeart Mobile
        </HeroTitle>
        <HeroSubtitle $colorScheme={safeColorScheme}>
          The ultimate degen casino experience, now in your pocket. Play anywhere, win everywhere, and let your degen heart lead the way! 💖
        </HeroSubtitle>
        
        <DownloadSection>
          <DownloadButton
            as="a"
            href="https://degenheart.casino/mobile/degencasino-latest.apk"
            download
            $colorScheme={safeColorScheme}
            $variant="primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaAndroid />
            Download APK
          </DownloadButton>
          
          <DownloadButton
            as="button"
            onClick={() => alert('iOS version coming soon! Follow us for updates 💖')}
            $colorScheme={safeColorScheme}
            $variant="secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaApple />
            iOS Coming Soon
          </DownloadButton>
        </DownloadSection>

        <APKLinkSection $colorScheme={safeColorScheme}>
          <p>Direct APK Link:</p>
          <APKLink $colorScheme={safeColorScheme}>
            https://degenheart.casino/mobile/degencasino-latest.apk
          </APKLink>
          <br />
          <CopyButton
            onClick={handleCopyAPKLink}
            $colorScheme={safeColorScheme}
            $copied={copied}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? '💖 Copied!' : 'Copy Link'}
          </CopyButton>
        </APKLinkSection>
      </Hero>

      <FeatureGrid>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            $colorScheme={safeColorScheme}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <FeatureIcon $colorScheme={safeColorScheme}>
              {feature.icon}
            </FeatureIcon>
            <FeatureTitle $colorScheme={safeColorScheme}>
              {feature.title}
            </FeatureTitle>
            <FeatureDescription $colorScheme={safeColorScheme}>
              {feature.description}
            </FeatureDescription>
          </FeatureCard>
        ))}
      </FeatureGrid>

      <StepsSection $colorScheme={safeColorScheme}>
        <StepsTitle $colorScheme={safeColorScheme}>
          Get Started in 4 Degen Steps
        </StepsTitle>
        
        <Step
          $colorScheme={safeColorScheme}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StepNumber $colorScheme={safeColorScheme}>1</StepNumber>
          <StepContent>
            <StepTitle $colorScheme={safeColorScheme}>Download & Install</StepTitle>
            <StepDescription $colorScheme={safeColorScheme}>
              Download the APK file and install it on your Android device. Make sure to enable "Install from unknown sources" in your settings for the ultimate degen experience.
            </StepDescription>
          </StepContent>
        </Step>

        <Step
          $colorScheme={safeColorScheme}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StepNumber $colorScheme={safeColorScheme}>2</StepNumber>
          <StepContent>
            <StepTitle $colorScheme={safeColorScheme}>Connect Your Degen Wallet</StepTitle>
            <StepDescription $colorScheme={safeColorScheme}>
              Open the app and connect your favorite Solana wallet. Phantom, Solflare, or any wallet adapter-compatible wallet works perfectly with your degen lifestyle.
            </StepDescription>
          </StepContent>
        </Step>

        <Step
          $colorScheme={safeColorScheme}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <StepNumber $colorScheme={safeColorScheme}>3</StepNumber>
          <StepContent>
            <StepTitle $colorScheme={safeColorScheme}>Choose Your Degen Token</StepTitle>
            <StepDescription $colorScheme={safeColorScheme}>
              Select from SOL, USDC, BONK, and other supported tokens. Your mobile degen gaming session is now ready to rock!
            </StepDescription>
          </StepContent>
        </Step>

        <Step
          $colorScheme={safeColorScheme}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <StepNumber $colorScheme={safeColorScheme}>4</StepNumber>
          <StepContent>
            <StepTitle $colorScheme={safeColorScheme}>Start Your Degen Journey!</StepTitle>
            <StepDescription $colorScheme={safeColorScheme}>
              Enjoy all your favorite casino games with instant payouts and automatic updates. Welcome to the future of mobile degen gaming! 💖🚀
            </StepDescription>
          </StepContent>
        </Step>
      </StepsSection>
    </MobileAppContainer>
  );
};

export default DegenMobileAppPage;